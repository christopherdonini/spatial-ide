// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Bounded, per-dataset DuckDB connection leases.
//!
//! ## Why this exists, and what it is answering
//!
//! `kernel/RESULTS.md`'s second section decomposed the first-pixels budget and found
//! **S2 — query start to OPEN — at p50 92.6 ms / p95 100.4 ms in the one established cell.** (A
//! pre-warmed-socket cell read 67.8 ms, but it failed its canary and that section marks it
//! *recorded, not established*; it is named here only so the range is not misread as one figure.)
//!
//! S2 contains socket acquisition and the handshake **and** the producer accepting the stream: SQL
//! construction, **a new in-memory DuckDB connection per stream**, and
//! `SET enable_geoparquet_conversion=false`. **How S2 divides between those has not been
//! measured** — producing that decomposition is what the reused-connection pass exists to do — so
//! nothing here attributes a share of it to connection creation. What this module does is remove
//! the connection creation and the configuration statement from that path, by keeping configured
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
//!    priority beyond the three fixed class bounds. Anything that *waits* for a connection would be
//!    an admission policy wearing a pool's clothes.
//! 2. **The ceilings are the engine's own**, justified by what this engine will serve over one
//!    dataset, and **no ceiling here is *computed* from a binding's constant** — every value below
//!    is a literal this crate owns and can change alone (`docs/02`'s module split). One of them,
//!    `MAX_ADMISSION_CONNECTIONS`, is nonetheless *sized to* a binding's declared concurrency and
//!    **says so in its own doc**, naming the shell's `MAX_IN_FLIGHT_TILE_STREAMS` as the quantity
//!    it was chosen against (ADR-010 rule 6: a declared ceiling states what it bounds). That is a
//!    prose derivation the reader can check, not a code dependency — nothing here imports, reads or
//!    is rebuilt by any binding — and the *composition* claim it implies (that the shipped shell
//!    therefore never collides at this class) belongs to `kernel/README.md`, the only file
//!    entitled to know both sides, where it is recorded.
//! 3. `MAX_STREAM_CONNECTIONS` equals the concurrent-stream ceiling the shipped binding happens to
//!    declare, so on the **natural-completion** path `ConnectionsExhausted { class: "stream" }` is
//!    unreachable in composition: the producer resolves its lease before it drops the channel, so a
//!    consumer that has seen the stream end has already seen the lease returned.
//!
//!    **On the cancel path it is reachable, and that is stated rather than assumed away.** The
//!    binding's admission permit and this lease are released by different, unsynchronized threads,
//!    and on a cancel the permit goes back first: the binding's reader returns on CANCEL, the
//!    source is then dropped, which cancels the token, and only then does the producer thread
//!    observe it, detach and discard. So at the ceiling a consumer that cancels and immediately
//!    re-requests — the ordinary pan/zoom supersession shape — can be admitted by the binding and
//!    refused here.
//!
//!    **What that is and is not.** It is a typed, visible refusal of a request the binding had
//!    already admitted, not a wrong result and not a silent degradation. It is *new* with this
//!    module: before it, every stream simply made its own connection. It is not closed by adding
//!    slack, because N cancelled streams can leave N leases in flight; closing it properly means
//!    ordering the two releases, which is a decision about **admission** and belongs to the
//!    reserved **ADR-014**. Recorded here as raw material for that decision and citable as evidence
//!    for nothing else.

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

/// Short, per-request predicate-admission work (`predicate.rs`'s three admission stages) that may
/// run at once over one dataset — **its own class, bounded separately from both of the above.**
///
/// **What quantity this bounds, declared per ADR-010 rule 6 ("ceilings are declared, not
/// discovered").** The concurrent admissions one binding can present at once: the shell's declared
/// tile-stream concurrency, `MAX_IN_FLIGHT_TILE_STREAMS = 3`
/// (`frontends/shell/src/canvas/tileGridConstants.ts:40`), plus the baseline (non-tiled) viewport
/// query a session also issues, `1` — `3 + 1 = 4`. This is a **chosen ceiling**, not a measured or
/// derived one: it is sized to the shipped shell's own composition so that, in that composition,
/// this class is never the thing that refuses (DECISIONS-PENDING entry 91 (a); ADR-033 (accepted 2026-09-14)).
///
/// **Admission-side capacity, not stream concurrency — ADR-014 stays reserved.** This ceiling
/// bounds how many *predicate admissions* (a short control-plane check, `predicate.rs`) may be in
/// flight; it says nothing about how many *streams* a binding may run concurrently
/// (`MAX_STREAM_CONNECTIONS`, above) or about the lease/permit release ordering ADR-014 owns
/// (`:72-78`, this module's header). Raising or lowering it is not an answer to either question.
///
/// **Why it must not share `Maintenance`'s budget (capacity 1).** Before this class existed,
/// `predicate.rs` leased `Maintenance` for admission, so concurrent `viewport_query` admissions
/// under a row filter collided at capacity 1 and the losers were refused as binder rejections
/// (`predicate.rs`'s own history, DECISIONS-PENDING entry 87) — a *typed* refusal with the *wrong
/// cause*. Splitting admission into its own, adequately-sized class removes that contention
/// entirely for the shipped shell's composition; a residual failure beyond this ceiling is refused
/// as `ConnectionsExhausted`, never folded back into a binder rejection (`predicate.rs`).
pub const MAX_ADMISSION_CONNECTIONS: usize = 4;

/// Physical DuckDB connections one dataset may hold at once, idle and leased together —
/// re-derived from all three lease classes below.
pub const MAX_PHYSICAL_CONNECTIONS: usize =
    MAX_STREAM_CONNECTIONS + MAX_MAINTENANCE_CONNECTIONS + MAX_ADMISSION_CONNECTIONS;

const _: () = assert!(MAX_STREAM_CONNECTIONS >= 1);
const _: () = assert!(MAX_MAINTENANCE_CONNECTIONS >= 1);
const _: () = assert!(MAX_ADMISSION_CONNECTIONS >= 1);
const _: () = assert!(
    MAX_PHYSICAL_CONNECTIONS
        == MAX_STREAM_CONNECTIONS + MAX_MAINTENANCE_CONNECTIONS + MAX_ADMISSION_CONNECTIONS
);

/// The statement every engine connection is configured with, **once, at creation** — the single
/// place this repository spells it (`engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md` §2 item 1).
///
/// **The two extension settings come first, before anything else, and that order is load-bearing.**
/// The vendored `libduckdb-sys 1.10505.0` compiles DuckDB with
/// `DUCKDB_EXTENSION_AUTOINSTALL_DEFAULT` and `DUCKDB_EXTENSION_AUTOLOAD_DEFAULT` set to `"1"`
/// (`build_bundled_cc.rs:96-97`), so a *fresh* connection will, on first reference to any known
/// extension, load it — and install it from DuckDB's repository, writing to the extension directory
/// and reaching the network. ADR-021's "Security property" consequence (the admission parser is
/// statically linked, admission performs no runtime extension fetch) was therefore held by
/// **content** — `json` is built in — and not by configuration. From ADR-021's amendment of
/// 2026-09-15 it is held by both: no product engine connection loads or installs an extension
/// *implicitly*. The two settings bound implicit acquisition (first-reference autoload and
/// autoinstall) — not an explicit `INSTALL`/`LOAD`, which the engine never issues and no admitted
/// predicate can express; `#[cfg(test)]` connections are not configured and are outside the claim.
/// Anything appended to this statement must stay *after* the two settings, so that nothing the
/// engine itself runs can trigger a load before they take effect.
///
/// This does not, and may not, claim that the engine loads no extensions: `core_functions`,
/// `parquet` and `json` are compiled in (`build_bundled_cc.rs:37-43`) and remain.
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
const CONFIGURE_SQL: &str = "SET autoinstall_known_extensions=false; \
                             SET autoload_known_extensions=false; \
                             SET enable_geoparquet_conversion=false";

/// Apply [`CONFIGURE_SQL`] to a connection the caller opened.
///
/// **Crate-private and the only way an engine connection gets configured.** Two product sites open
/// DuckDB connections — this module's [`ConnectionPool::configure_new`] and `layout.rs`'s variant
/// rewriter — and before this function existed the second carried its own copy of the statement,
/// which is exactly how a security-relevant setting goes missing from one path. One function, one
/// spelling, both sites (`engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md` §2 item 3).
///
/// Failure is `ConnectionSetup`, naming the phase, so a configuration that does not apply is a
/// typed refusal and never a connection that quietly runs unconfigured.
pub(crate) fn configure_connection(conn: &Connection) -> Result<()> {
    apply_configuration(conn, CONFIGURE_SQL)
}

/// Run a configuration statement, naming the phase in any failure. Shared by
/// [`configure_connection`] and the pool's test seam so the two cannot report differently.
fn apply_configuration(conn: &Connection, sql: &str) -> Result<()> {
    conn.execute_batch(sql)
        .map_err(|e| EngineError::ConnectionSetup { detail: format!("configure: {e}") })
}

/// What a lease is for. The three classes are bounded separately over one physical pool.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum LeaseClass {
    /// One streaming query.
    Stream,
    /// A whole-file pass that is not a stream — today, building the spatial index.
    Maintenance,
    /// Short, per-request predicate-admission work (`predicate.rs`) — never a whole-file pass and
    /// never a stream. See [`MAX_ADMISSION_CONNECTIONS`] for what its ceiling bounds and why it is
    /// not shared with either of the other two.
    Admission,
}

impl LeaseClass {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Stream => "stream",
            Self::Maintenance => "maintenance",
            Self::Admission => "admission",
        }
    }

    fn capacity(self) -> usize {
        match self {
            Self::Stream => MAX_STREAM_CONNECTIONS,
            Self::Maintenance => MAX_MAINTENANCE_CONNECTIONS,
            Self::Admission => MAX_ADMISSION_CONNECTIONS,
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
    active_admission: usize,
}

impl PoolState {
    fn active(&self, class: LeaseClass) -> usize {
        match class {
            LeaseClass::Stream => self.active_stream,
            LeaseClass::Maintenance => self.active_maintenance,
            LeaseClass::Admission => self.active_admission,
        }
    }
    fn active_mut(&mut self, class: LeaseClass) -> &mut usize {
        match class {
            LeaseClass::Stream => &mut self.active_stream,
            LeaseClass::Maintenance => &mut self.active_maintenance,
            LeaseClass::Admission => &mut self.active_admission,
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
    /// `None` is the product: every connection is configured by [`configure_connection`], the one
    /// function that spells [`CONFIGURE_SQL`]. `Some` is the test seam only — the pool holds no
    /// copy of the product statement, so it cannot drift from the layout site.
    configure_sql: Option<&'static str>,
    next_physical_id: AtomicU64,
    physical_created: AtomicU64,
    leases_issued: AtomicU64,
}

impl ConnectionPool {
    pub fn new(config: PoolConfig) -> Arc<Self> {
        Arc::new(Self {
            config,
            state: Mutex::new(PoolState::default()),
            configure_sql: None,
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
    ///
    /// **Not part of this crate's intended surface.** It is `pub` so a test in `engine/tests/` can
    /// exercise the class bounds directly, which needs a lease without a stream. A caller taking
    /// `Stream` leases out of band could starve the product path, so `Dataset::stream*` is the way
    /// in and this is hidden from the documented API rather than offered as an alternative.
    #[doc(hidden)]
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
        match self.configure_sql {
            // The product path goes through the shared function, not a copy of it.
            None => configure_connection(&conn)?,
            Some(sql) => apply_configuration(&conn, sql)?,
        }
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
        st.active_stream + st.active_maintenance + st.active_admission
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
    /// `pub(crate)`: the connection itself never leaves this crate, so the invariant behind the
    /// `expect` below — a live lease holds its connection, because `physical` is only taken as the
    /// lease ends — cannot be broken from outside.
    pub(crate) fn connection(&self) -> &Connection {
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
        // **Verified while the lease still owns the connection, and taken only after.**
        //
        // Taking it first disarms `Drop`: an unwind inside `verify` would then leave a lease whose
        // `physical` is already `None`, so `Drop` frees nothing and this dataset loses a slot of
        // capacity permanently. Four of those exhaust the stream class for the life of the process,
        // and one exhausts the maintenance class — `Dataset::open` calls this method, so a single
        // unwind there would make `build_index` on that dataset refuse forever.
        //
        // That is not a hypothetical panic. `stream.rs` records that duckdb-rs **panics** rather
        // than returning an error when a fetch fails, including when it was interrupted by our own
        // cancel, and `verify` runs `prepare` + `query` + drain on a connection that may have taken
        // an interrupt in the window before `detach`. Leaving `Drop` armed is what makes the
        // failing case discard rather than leak. ADR-010 rule 6: a ceiling that drifts is not a
        // declared ceiling.
        let healthy = match self.physical.as_ref() {
            Some(p) => verify(&p.conn).is_ok(),
            None => return,
        };
        if !healthy {
            // Leave `physical` in place: `Drop` discards it and frees the slot.
            return;
        }
        if let Some(p) = self.physical.take() {
            self.pool.return_healthy(self.class, p);
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
            p.configure_sql = Some(sql);
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
        // …and neither is admission — the third class this piece adds, bounded the same way.
        let mut admission_held = Vec::new();
        for _ in 0..MAX_ADMISSION_CONNECTIONS {
            admission_held.push(pool.acquire(LeaseClass::Admission).expect("admission is its own budget too"));
        }
        match pool.acquire(LeaseClass::Admission) {
            Err(EngineError::ConnectionsExhausted { class, capacity }) => {
                assert_eq!(class, "admission");
                assert_eq!(capacity, MAX_ADMISSION_CONNECTIONS);
            }
            other => panic!("expected a typed refusal, got {other:?}", other = other.map(|_| ())),
        }
        assert_eq!(pool.live_connections(), MAX_PHYSICAL_CONNECTIONS);
        drop(m);
        drop(held);
        drop(admission_held);
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

    // ---- DuckDB extension autoload/autoinstall, off by configuration ---------------------------
    //
    // `engine/EXTENSION-AUTOLOAD-PREREGISTRATION.md` §4. The vendored `libduckdb-sys` compiles
    // DuckDB with `DUCKDB_EXTENSION_AUTOINSTALL_DEFAULT` and `DUCKDB_EXTENSION_AUTOLOAD_DEFAULT`
    // set to `"1"`, so the ADR-021 no-runtime-fetch property was held by *content* (`json` built
    // in) while every connection still permitted DuckDB to load — and install from its repository —
    // any other known extension on first reference. These three tests assert the configuration that
    // closes that, fail-closed, on every lease class.

    /// Probe B (preregistration §0 item 3, §7): one statement that references a known extension
    /// which is **not** built in. Loopback, a closed port, no DNS — with the two settings off the
    /// statement fails at file-system dispatch, before any socket.
    const EXTENSION_PROBE_SQL: &str =
        "SELECT * FROM read_parquet('https://127.0.0.1:9/none.parquet')";
    /// The fail-closed message (preregistration §7): DuckDB refusing the reference rather than
    /// satisfying it.
    const FAIL_CLOSED_TEXT: &str = "requires the extension httpfs to be loaded";

    fn setting(conn: &Connection, name: &str) -> String {
        conn.query_row(&format!("SELECT current_setting('{name}')::VARCHAR"), [], |r| {
            r.get::<_, String>(0)
        })
        .unwrap_or_else(|e| panic!("reading `{name}`: {e}"))
    }

    /// Run the probe and return its error text, or `None` if it somehow succeeded.
    fn probe_error(conn: &Connection) -> Option<String> {
        let mut stmt = match conn.prepare(EXTENSION_PROBE_SQL) {
            Ok(s) => s,
            Err(e) => return Some(e.to_string()),
        };
        let mut rows = match stmt.query([]) {
            Ok(r) => r,
            Err(e) => return Some(e.to_string()),
        };
        loop {
            match rows.next() {
                Ok(Some(_)) => {}
                Ok(None) => return None,
                Err(e) => return Some(e.to_string()),
            }
        }
    }

    /// `duckdb_extensions()`'s two booleans for httpfs, read as integers so no boolean type mapping
    /// sits between the assertion and the fact.
    fn httpfs_installed_loaded(conn: &Connection) -> (i64, i64) {
        conn.query_row(
            "SELECT coalesce(max(CASE WHEN installed THEN 1 ELSE 0 END), 0)::BIGINT, \
             coalesce(max(CASE WHEN loaded THEN 1 ELSE 0 END), 0)::BIGINT \
             FROM duckdb_extensions() WHERE extension_name = 'httpfs'",
            [],
            |r| Ok((r.get::<_, i64>(0)?, r.get::<_, i64>(1)?)),
        )
        .expect("duckdb_extensions() is a built-in table function")
    }

    /// A fresh, empty directory this test owns, so "zero files" is a fact about this run.
    fn fresh_extension_dir(tag: &str) -> std::path::PathBuf {
        let d = std::env::temp_dir().join("spatial-engine-extension-autoload-tests").join(tag);
        let _ = std::fs::remove_dir_all(&d);
        std::fs::create_dir_all(&d).expect("create extension dir");
        d
    }

    fn count_files(dir: &std::path::Path) -> usize {
        let mut n = 0;
        let entries = match std::fs::read_dir(dir) {
            Ok(e) => e,
            Err(_) => return 0,
        };
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                n += count_files(&path);
            } else {
                n += 1;
            }
        }
        n
    }

    /// T1 (preregistration §4).
    ///
    /// RECORDED MUTATION (run 2026-09-15, reverted): remove the two `SET … =false` clauses from
    /// `CONFIGURE_SQL`. `every_lease_class_opens_with_extension_autoload_and_autoinstall_off`
    /// fails — *assertion `left == right` failed: class `stream` must not be able to install an
    /// extension at runtime / left: "true" / right: "false"*.
    #[test]
    fn every_lease_class_opens_with_extension_autoload_and_autoinstall_off() {
        for class in [LeaseClass::Stream, LeaseClass::Maintenance, LeaseClass::Admission] {
            let pool = ConnectionPool::new(PoolConfig::reuse());
            let lease = pool.acquire(class).expect("lease");
            let conn = lease.connection();
            assert_eq!(
                setting(conn, "autoinstall_known_extensions"),
                "false",
                "class `{}` must not be able to install an extension at runtime",
                class.as_str()
            );
            assert_eq!(
                setting(conn, "autoload_known_extensions"),
                "false",
                "class `{}` must not be able to load an extension at runtime",
                class.as_str()
            );
        }
    }

    /// T2 (preregistration §4).
    ///
    /// RECORDED MUTATION (run 2026-09-15, reverted): the same removal.
    /// `a_known_extension_reference_fails_closed_on_every_lease_class` fails — *class `stream`:
    /// expected the fail-closed refusal `requires the extension httpfs to be loaded`, got: IO
    /// Error: Could not connect to server error for HTTP HEAD to
    /// 'https://127.0.0.1:9/none.parquet'*. That message is the extension having been fetched and
    /// loaded: the pre-fix run of this test wrote `httpfs.duckdb_extension` (28.5 MB — observed once
    /// in the mutation run, not asserted) and its `.info` under the temp directory below, which is
    /// the runtime fetch this piece closes.
    #[test]
    fn a_known_extension_reference_fails_closed_on_every_lease_class() {
        for class in [LeaseClass::Stream, LeaseClass::Maintenance, LeaseClass::Admission] {
            let dir = fresh_extension_dir(class.as_str());
            let pool = ConnectionPool::new(PoolConfig::reuse());
            let lease = pool.acquire(class).expect("lease");
            let conn = lease.connection();
            conn.execute_batch(&format!(
                "SET extension_directory='{}'",
                dir.display().to_string().replace('\\', "/")
            ))
            .expect("extension_directory is settable at runtime");

            let err = probe_error(conn).unwrap_or_else(|| {
                panic!("class `{}`: the probe statement must not succeed", class.as_str())
            });
            assert!(
                err.contains(FAIL_CLOSED_TEXT),
                "class `{}`: expected the fail-closed refusal `{FAIL_CLOSED_TEXT}`, got: {err}",
                class.as_str()
            );

            let (installed, loaded) = httpfs_installed_loaded(conn);
            assert_eq!(installed, 0, "class `{}`: httpfs must not be installed", class.as_str());
            assert_eq!(loaded, 0, "class `{}`: httpfs must not be loaded", class.as_str());
            assert_eq!(
                count_files(&dir),
                0,
                "class `{}`: nothing may be written under the extension directory",
                class.as_str()
            );
        }
    }

    /// T3 (preregistration §4). The shared function is what `layout.rs` calls on its own
    /// connection, so what it sets is what that site gets — including the setting it used to carry
    /// itself.
    ///
    /// RECORDED MUTATION (run 2026-09-15, reverted): drop `enable_geoparquet_conversion` from
    /// `CONFIGURE_SQL`. `the_shared_configuration_sets_all_three_settings_on_a_fresh_connection`
    /// fails — *assertion `left == right` failed: the retained setting must survive every edit to
    /// the statement / left: "true" / right: "false"* — and T1 and T2 stay green, which is the
    /// point: nothing else in this file guards the retained setting.
    #[test]
    fn the_shared_configuration_sets_all_three_settings_on_a_fresh_connection() {
        let conn = Connection::open_in_memory().expect("bare connection");
        configure_connection(&conn).expect("the shared configuration applies");
        assert_eq!(setting(&conn, "autoinstall_known_extensions"), "false");
        assert_eq!(setting(&conn, "autoload_known_extensions"), "false");
        assert_eq!(
            setting(&conn, "enable_geoparquet_conversion"),
            "false",
            "the retained setting must survive every edit to the statement"
        );
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
