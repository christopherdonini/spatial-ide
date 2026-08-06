//! Bounded, per-dataset DuckDB connection leases.
//!
//! ## Why this exists, and what it is answering
//!
//! `kernel/RESULTS.md`'s second section decomposed the first-pixels budget and found that
//! **S2 — query start to OPEN — is 67.8–92.6 ms**, of which the producer's share is
//! `EngineSourceFactory::create` accepting the stream: SQL construction plus **a new in-memory
//! DuckDB connection per stream** plus `SET enable_geoparquet_conversion=false`. Two thirds of the
//! whole 100 ms budget was spent before the query had looked at a row. This module removes the
//! connection creation and the configuration statement from that path by keeping configured
//! connections alive for the life of the `Dataset` that owns them.
//!
//! ## Authority — stated because the obvious citation is the wrong one
//!
//! A pool holds **execution resources**, not derived results, so **ADR-010 rule 5 does not bind
//! it**: rule 5 is about renderer *caches*, and ADR-013 §7's test applies — delete this pool and
//! rule 5 says exactly what it said. Citing it here would enlarge an Accepted, architect-blockable
//! rule by analogy, which `index.rs` already refuses to do for the same rule and ADR-016 §6 refuses
//! for rule 1. What binds instead:
//!
//! - **`docs/05`** — DuckDB is the data-engine module's; the connections to it are this module's to
//!   own.
//! - **ADR-007** — DuckDB is the *analytical* store and owns no mutation, so a pooled connection
//!   cannot run, extend, gate or delay a transaction.
//! - **ADR-006** — a stream is a pure transformation; a connection is the resource it runs on, with
//!   no undo semantics and no system-of-record status.
//! - **`docs/01` principle 7** — the lease lifecycle exists so cancellation keeps reaching the
//!   *query*, not merely the loop around it. A connection that outlived its cancellation binding
//!   would quietly reintroduce the defect `cancel.rs` exists to prevent.
//! - **ADR-010 rule 6** — the ceilings below are declared, not discovered. (Rule 6 is cited for the
//!   *discipline*, which this repository already applies to `MAX_BATCH_BYTES` and
//!   `MAX_INDEXED_FEATURES`; nothing else in rule 6 is claimed.)
//!
//! ## What this is not, and must not be read as
//!
//! **It is not an admission policy.** The number of streams a consumer may run concurrently is
//! decided upstream, in the binding, before any request reaches this module. This is a resource
//! ceiling *downstream* of a decision already made. `protocol/data-plane/README.md` reserves
//! queue-versus-refuse for **ADR-014** and calls its own N+1 refusal "provisional and reversible,
//! not a decision"; the same words apply here, and **nothing in this module may be cited as
//! evidence that ADR-014 should not replace it**.
//!
//! Three consequences of that, which are constraints rather than notes:
//!
//! 1. **`try_acquire` semantics only.** No queue, no wait, no timeout-on-acquire, no fairness, no
//!    priority beyond the two fixed class bounds. Anything that *waits* for a connection would be
//!    an admission policy wearing a pool's clothes.
//! 2. **The ceilings are the engine's own**, justified by what this engine will serve over one
//!    dataset. This module names no constant belonging to a binding: `docs/02` makes that split
//!    structural, and `engine/tests/slice.rs` scans this crate's own source to keep it that way.
//! 3. Because `MAX_STREAM_CONNECTIONS` equals the concurrent-stream ceiling the shipped binding
//!    happens to declare, **`ConnectionsExhausted { class: "stream" }` is unreachable through the
//!    composed product path.** A ceiling that cannot be reached in composition is not an admission
//!    policy. It is still asserted, because the engine is not entitled to assume the composition it
//!    is used in — see `kernel/README.md` for the composed figure.

use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::{Arc, Mutex};

use duckdb::Connection;

use crate::error::{EngineError, Result};

/// Streams this engine will serve concurrently over one dataset (ADR-010 rule 6's discipline).
///
/// **Engine-owned, and deliberately not derived from any binding's constant.** That the shipped
/// data plane admits the same number of concurrent streams is a *composition* fact and is recorded
/// in `kernel/README.md`, which is the only place that knows both sides.
pub const MAX_STREAM_CONNECTIONS: usize = 4;

/// Whole-file maintenance passes — today, an index build — that may run at once over one dataset.
///
/// **Its own class, so the two cannot starve each other.** Sharing one budget would let four
/// admitted streams make an index build impossible, and an index build make a fourth stream
/// impossible; neither is a decision anyone made.
pub const MAX_MAINTENANCE_CONNECTIONS: usize = 1;

/// Physical DuckDB connections one dataset may hold at once, idle and leased together.
pub const MAX_PHYSICAL_CONNECTIONS: usize = MAX_STREAM_CONNECTIONS + MAX_MAINTENANCE_CONNECTIONS;

const _: () = assert!(MAX_STREAM_CONNECTIONS >= 1);
const _: () = assert!(MAX_MAINTENANCE_CONNECTIONS >= 1);
const _: () = assert!(MAX_PHYSICAL_CONNECTIONS == MAX_STREAM_CONNECTIONS + MAX_MAINTENANCE_CONNECTIONS);

/// The statement every physical connection is configured with, **once, at creation**.
///
/// **`enable_geoparquet_conversion` is turned off deliberately, and it is not only a workaround.**
/// DuckDB (v1.5.5 on the reference profile) will, by default, interpret a file's `geo` metadata and
/// hand back a converted geometry type. That would put a **second CRS policy** in the path — one
/// this engine did not write, whose admission rules are not ADR-015's, and whose conversions are
/// invisible here. `docs/05` allows exactly one: no silent conversion, CRS decided once, by the
/// engine that owns the dataset's type. This engine therefore reads the raw WKB and decides for
/// itself.
///
/// It also avoids an upstream defect found while building this slice, recorded here because it will
/// otherwise be rediscovered: with the conversion enabled, `read_parquet` on a GeoParquet file whose
/// `geo` metadata has **no `crs` key** fails with an internal error
/// (`TransactionContext::ActiveTransaction called without active transaction`) rather than a
/// diagnosable one. Files without a declared CRS are precisely the ones this engine has an
/// admission policy for, so that path is not exotic here.
///
/// **Applying it once per connection rather than once per query is the whole point of this
/// module**: it was previously executed on the query's own critical path.
const CONFIGURE_SQL: &str = "SET enable_geoparquet_conversion=false";

/// What a lease is for. The two classes are bounded separately over one physical pool.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LeaseClass {
    /// One streaming query.
    Stream,
    /// A whole-file pass that is not a stream — today, building the spatial index.
    Maintenance,
}

impl LeaseClass {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Stream => "stream",
            Self::Maintenance => "maintenance",
        }
    }

    fn capacity(self) -> usize {
        match self {
            Self::Stream => MAX_STREAM_CONNECTIONS,
            Self::Maintenance => MAX_MAINTENANCE_CONNECTIONS,
        }
    }
}

/// How many configured connections a dataset keeps alive between leases.
///
/// **`max_idle = 0` is the measurement control, and it is a capacity rather than a second code
/// path.** The reuse/no-reuse contrast has to measure *reuse*, not two implementations of a lease:
/// with a capacity parameter the acquire, attach, detach, verify and error paths are byte-identical
/// in both settings and only the return-to-idle step differs, which is exactly the treatment being
/// named. A strategy branch would have measured the branch.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct PoolConfig {
    pub max_idle: usize,
}

impl PoolConfig {
    /// The product default: every healthy connection is kept.
    pub const fn reuse() -> Self {
        Self { max_idle: MAX_PHYSICAL_CONNECTIONS }
    }

    /// The measurement control: nothing is kept, so every lease creates and configures a
    /// connection, as this engine did before connection reuse existed.
    pub const fn fresh_per_query() -> Self {
        Self { max_idle: 0 }
    }

    pub fn reuses_connections(&self) -> bool {
        self.max_idle > 0
    }
}

impl Default for PoolConfig {
    fn default() -> Self {
        Self::reuse()
    }
}

/// One physical DuckDB connection and the two facts an instrument needs about it.
struct Physical {
    conn: Connection,
    /// **A monotonic counter, never a pointer value.** An id derived from an address would put a
    /// live heap address into an evidence artifact.
    id: u64,
    /// Leases issued over this connection's lifetime, including the one in flight.
    leases: u64,
}

#[derive(Default)]
struct PoolState {
    idle: Vec<Physical>,
    /// Physical connections that exist right now — idle plus leased.
    live: usize,
    active_stream: usize,
    active_maintenance: usize,
}

impl PoolState {
    fn active(&self, class: LeaseClass) -> usize {
        match class {
            LeaseClass::Stream => self.active_stream,
            LeaseClass::Maintenance => self.active_maintenance,
        }
    }
    fn active_mut(&mut self, class: LeaseClass) -> &mut usize {
        match class {
            LeaseClass::Stream => &mut self.active_stream,
            LeaseClass::Maintenance => &mut self.active_maintenance,
        }
    }
}

/// The connections one open dataset owns.
///
/// **Owned by the `Dataset`, never by a process-wide path-keyed cache.** A connection cached by
/// path would outlive the `Dataset` that holds the admitted CRS (ADR-015) and identity (ADR-016)
/// facts, and a later caller could then run against a connection admitted under a different
/// dataset's policy. Dropping the `Dataset` closes its idle connections, because they live here and
/// nowhere else.
pub struct ConnectionPool {
    config: PoolConfig,
    state: Mutex<PoolState>,
    configure_sql: &'static str,
    next_physical_id: AtomicU64,
    physical_created: AtomicU64,
    leases_issued: AtomicU64,
}

impl ConnectionPool {
    pub fn new(config: PoolConfig) -> Arc<Self> {
        Arc::new(Self {
            config,
            state: Mutex::new(PoolState::default()),
            configure_sql: CONFIGURE_SQL,
            next_physical_id: AtomicU64::new(1),
            physical_created: AtomicU64::new(0),
            leases_issued: AtomicU64::new(0),
        })
    }

    /// Take a configured connection, or refuse.
    ///
    /// **Never blocks and never queues** — see this module's header. The lock is held for the
    /// bookkeeping only; connection creation happens outside it, so one slow creation cannot
    /// serialize the other classes, and a query never runs with the lock held.
    pub fn acquire(self: &Arc<Self>, class: LeaseClass) -> Result<Lease> {
        enum Take {
            Existing(Physical),
            Create(u64),
        }

        let take = {
            let mut st = self.state.lock().unwrap_or_else(|e| e.into_inner());
            if st.active(class) >= class.capacity() {
                return Err(EngineError::ConnectionsExhausted {
                    class: class.as_str(),
                    capacity: class.capacity(),
                });
            }
            match st.idle.pop() {
                Some(p) => {
                    *st.active_mut(class) += 1;
                    Take::Existing(p)
                }
                None => {
                    // Unreachable while the class capacities sum to this ceiling; asserted anyway,
                    // because a later class or a raised bound must not silently exceed it.
                    if st.live >= MAX_PHYSICAL_CONNECTIONS {
                        return Err(EngineError::ConnectionsExhausted {
                            class: "physical",
                            capacity: MAX_PHYSICAL_CONNECTIONS,
                        });
                    }
                    *st.active_mut(class) += 1;
                    st.live += 1;
                    Take::Create(self.next_physical_id.fetch_add(1, Ordering::SeqCst))
                }
            }
        };

        let mut physical = match take {
            Take::Existing(p) => p,
            Take::Create(id) => match self.configure_new() {
                Ok(conn) => {
                    self.physical_created.fetch_add(1, Ordering::SeqCst);
                    Physical { conn, id, leases: 0 }
                }
                Err(e) => {
                    // The reservation is undone, so a failing configuration cannot leak capacity
                    // and turn one bad connection into a permanently exhausted dataset.
                    let mut st = self.state.lock().unwrap_or_else(|e| e.into_inner());
                    *st.active_mut(class) -= 1;
                    st.live -= 1;
                    return Err(e);
                }
            },
        };

        physical.leases += 1;
        self.leases_issued.fetch_add(1, Ordering::SeqCst);
        let physical_id = physical.id;
        let generation = physical.leases;
        Ok(Lease {
            physical: Some(physical),
            pool: Arc::clone(self),
            class,
            physical_id,
            generation,
        })
    }

    fn configure_new(&self) -> Result<Connection> {
        let conn = Connection::open_in_memory()
            .map_err(|e| EngineError::ConnectionSetup { detail: format!("open: {e}") })?;
        conn.execute_batch(self.configure_sql)
            .map_err(|e| EngineError::ConnectionSetup { detail: format!("configure: {e}") })?;
        Ok(conn)
    }

    /// Hand a verified-healthy connection back, or drop it if the pool is not keeping any.
    fn return_healthy(&self, class: LeaseClass, p: Physical) {
        let surplus = {
            let mut st = self.state.lock().unwrap_or_else(|e| e.into_inner());
            *st.active_mut(class) -= 1;
            if st.idle.len() < self.config.max_idle {
                st.idle.push(p);
                None
            } else {
                st.live -= 1;
                Some(p)
            }
        };
        // Closing a connection outside the lock: nothing else should wait on a `Drop` that reaches
        // into DuckDB.
        drop(surplus);
    }

    /// Free a lease's capacity without returning its connection.
    fn discard(&self, class: LeaseClass) {
        let mut st = self.state.lock().unwrap_or_else(|e| e.into_inner());
        *st.active_mut(class) -= 1;
        st.live -= 1;
    }

    pub fn config(&self) -> PoolConfig {
        self.config
    }

    /// Physical connections created over this pool's lifetime — an instrument fact.
    pub fn physical_connections_created(&self) -> u64 {
        self.physical_created.load(Ordering::SeqCst)
    }

    /// Leases issued over this pool's lifetime — an instrument fact.
    pub fn leases_issued(&self) -> u64 {
        self.leases_issued.load(Ordering::SeqCst)
    }

    pub fn idle_connections(&self) -> usize {
        self.state.lock().unwrap_or_else(|e| e.into_inner()).idle.len()
    }

    pub fn live_connections(&self) -> usize {
        self.state.lock().unwrap_or_else(|e| e.into_inner()).live
    }

    pub fn active_leases(&self) -> usize {
        let st = self.state.lock().unwrap_or_else(|e| e.into_inner());
        st.active_stream + st.active_maintenance
    }
}

/// One exclusive hold on one physical connection.
///
/// **A lease moves the connection out of the pool**, so two concurrent queries can never share one
/// and no lock is held across a query. That is what keeps DuckDB's interrupt meaningful: an
/// interrupt handle addresses a connection, so cancelling stream A could otherwise interrupt
/// stream B.
///
/// **Dropping discards.** Returning a connection is an explicit act (`release_healthy`) and never
/// the default, because the default has to be right for the case nobody wrote code for: a producer
/// thread that unwinds part-way leaves DuckDB in a state this engine has not established anything
/// about, and handing that back would spread one failure across every later query. Same discipline
/// as `ValidityHeuristic::fail_closed_matches` — what cannot be confirmed is discarded.
pub struct Lease {
    physical: Option<Physical>,
    pool: Arc<ConnectionPool>,
    class: LeaseClass,
    physical_id: u64,
    generation: u64,
}

impl Lease {
    pub fn connection(&self) -> &Connection {
        &self.physical.as_ref().expect("a live lease holds its connection").conn
    }

    /// Which physical connection this is — a monotonic per-dataset counter, never an address.
    pub fn physical_id(&self) -> u64 {
        self.physical_id
    }

    /// Which use of that connection this lease is. `1` is a connection created for this lease.
    ///
    /// **Generation counts every lease, including the one `Dataset::open` takes** for the `geo`
    /// metadata read, the schema probe and ADR-016's identity scan. So on a dataset opened in the
    /// reusing configuration, the first *stream* runs at generation 2. That definition is fixed
    /// here rather than settled after looking at an artifact.
    pub fn generation(&self) -> u64 {
        self.generation
    }

    /// Whether this query received a connection that already existed and was already configured.
    pub fn reused_an_existing_connection(&self) -> bool {
        self.generation > 1
    }

    /// Verify and return the connection.
    ///
    /// The verification is a trivial statement, **drained**. It is not ceremony: `probe_schema`
    /// abandons a result iterator mid-flight, and `read_geo_metadata`'s own comment records that
    /// abandoning a result and then preparing the next statement left DuckDB reporting
    /// `ActiveTransaction called without active transaction` *two calls later*. While a connection
    /// died at the end of every open, that latent state died with it. It no longer does, so it is
    /// checked once, uniformly, on every return rather than reasoned about per call site.
    pub fn release_healthy(mut self) {
        if let Some(p) = self.physical.take() {
            match verify(&p.conn) {
                Ok(()) => self.pool.return_healthy(self.class, p),
                Err(_) => {
                    self.pool.discard(self.class);
                    drop(p);
                }
            }
        }
    }
}

impl Drop for Lease {
    fn drop(&mut self) {
        if let Some(p) = self.physical.take() {
            self.pool.discard(self.class);
            drop(p);
        }
    }
}

/// A trivial statement, run and **fully drained**, so a connection is only reused after it has
/// answered something.
fn verify(conn: &Connection) -> Result<()> {
    let mut stmt = conn
        .prepare("SELECT 1")
        .map_err(|e| EngineError::ConnectionSetup { detail: format!("verify prepare: {e}") })?;
    let mut rows = stmt
        .query([])
        .map_err(|e| EngineError::ConnectionSetup { detail: format!("verify: {e}") })?;
    while rows
        .next()
        .map_err(|e| EngineError::ConnectionSetup { detail: format!("verify drain: {e}") })?
        .is_some()
    {}
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    impl ConnectionPool {
        /// A pool whose per-connection configuration statement is the caller's. Test-only: the
        /// product statement is a constant precisely so no caller can substitute a CRS policy.
        fn with_configure_sql(config: PoolConfig, sql: &'static str) -> Arc<Self> {
            let pool = Self::new(config);
            // Safe because nothing has been leased from this pool yet.
            let mut p = Arc::try_unwrap(pool).ok().expect("fresh pool is unshared");
            p.configure_sql = sql;
            Arc::new(p)
        }
    }

    #[test]
    fn a_returned_connection_is_the_same_physical_connection_next_time() {
        let pool = ConnectionPool::new(PoolConfig::reuse());
        let first = pool.acquire(LeaseClass::Stream).expect("first lease");
        let id = first.physical_id();
        assert_eq!(first.generation(), 1, "a connection created for this lease is generation 1");
        assert!(!first.reused_an_existing_connection());
        first.release_healthy();

        let second = pool.acquire(LeaseClass::Stream).expect("second lease");
        assert_eq!(second.physical_id(), id, "reuse must hand back the same physical connection");
        assert_eq!(second.generation(), 2);
        assert!(second.reused_an_existing_connection());
        assert_eq!(pool.physical_connections_created(), 1, "reuse creates nothing the second time");
        assert_eq!(pool.leases_issued(), 2);
    }

    #[test]
    fn the_measurement_control_keeps_nothing_and_creates_every_time() {
        // `max_idle = 0` is the same code path with a capacity of zero, which is what makes the
        // reuse-on/reuse-off contrast a measurement of reuse rather than of two implementations.
        let pool = ConnectionPool::new(PoolConfig::fresh_per_query());
        let a = pool.acquire(LeaseClass::Stream).expect("lease");
        let first_id = a.physical_id();
        a.release_healthy();
        let b = pool.acquire(LeaseClass::Stream).expect("lease");
        assert_ne!(b.physical_id(), first_id, "nothing may be kept when max_idle is 0");
        assert_eq!(b.generation(), 1, "every lease is a first lease when nothing is kept");
        assert_eq!(pool.physical_connections_created(), 2);
        assert_eq!(pool.idle_connections(), 0);
    }

    #[test]
    fn a_dropped_lease_is_discarded_rather_than_returned() {
        // Fail closed: a lease that ended in a way nobody described must not put a connection of
        // unknown state back into circulation.
        let pool = ConnectionPool::new(PoolConfig::reuse());
        let lease = pool.acquire(LeaseClass::Stream).expect("lease");
        let id = lease.physical_id();
        drop(lease);
        assert_eq!(pool.idle_connections(), 0, "a dropped lease returns nothing");
        assert_eq!(pool.live_connections(), 0, "and frees its capacity");

        let next = pool.acquire(LeaseClass::Stream).expect("lease again");
        assert_ne!(next.physical_id(), id, "the discarded connection is replaced, not reused");
    }

    #[test]
    fn each_class_is_bounded_on_its_own_and_neither_starves_the_other() {
        let pool = ConnectionPool::new(PoolConfig::reuse());
        let mut held = Vec::new();
        for _ in 0..MAX_STREAM_CONNECTIONS {
            held.push(pool.acquire(LeaseClass::Stream).expect("stream lease"));
        }
        // The stream class is full…
        match pool.acquire(LeaseClass::Stream) {
            Err(EngineError::ConnectionsExhausted { class, capacity }) => {
                assert_eq!(class, "stream");
                assert_eq!(capacity, MAX_STREAM_CONNECTIONS);
            }
            other => panic!("expected a typed refusal, got {other:?}", other = other.map(|_| ())),
        }
        // …and maintenance is unaffected, which is the point of the split.
        let m = pool.acquire(LeaseClass::Maintenance).expect("maintenance is its own budget");
        assert!(pool.acquire(LeaseClass::Maintenance).is_err(), "and is itself bounded");
        assert_eq!(pool.live_connections(), MAX_PHYSICAL_CONNECTIONS);
        drop(m);
        drop(held);
        assert_eq!(pool.live_connections(), 0);
    }

    #[test]
    fn a_configuration_failure_is_a_typed_error_and_leaks_no_capacity() {
        let pool = ConnectionPool::with_configure_sql(PoolConfig::reuse(), "SET not_a_real_setting=1");
        for _ in 0..(MAX_STREAM_CONNECTIONS + 2) {
            match pool.acquire(LeaseClass::Stream) {
                Err(EngineError::ConnectionSetup { detail }) => {
                    assert!(detail.contains("configure"), "the phase is named: {detail}");
                }
                other => panic!("expected ConnectionSetup, got {:?}", other.map(|_| ())),
            }
        }
        // The failing acquisitions did not consume capacity: a bad statement must not turn into a
        // permanently exhausted dataset, which is a different failure with a different remedy.
        assert_eq!(pool.live_connections(), 0);
        assert_eq!(pool.physical_connections_created(), 0);
    }

    #[test]
    fn two_concurrent_leases_are_two_different_physical_connections() {
        // One query per physical connection. DuckDB's interrupt addresses a *connection*, so two
        // streams sharing one would make cancelling either one interrupt both.
        let pool = ConnectionPool::new(PoolConfig::reuse());
        let a = pool.acquire(LeaseClass::Stream).expect("a");
        let b = pool.acquire(LeaseClass::Stream).expect("b");
        assert_ne!(a.physical_id(), b.physical_id());
        assert_eq!(pool.active_leases(), 2);
    }
}
