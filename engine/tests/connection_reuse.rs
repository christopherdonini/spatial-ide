//! **Reused DuckDB connections, and the cancellation that has to survive the reuse.**
//!
//! `kernel/RESULTS.md`'s second section decomposed the first-pixels budget and found S2 — query
//! start to OPEN — at 67.8–92.6 ms, of which the producer's share is accepting the stream: SQL
//! construction, **a new in-memory DuckDB connection**, and `SET enable_geoparquet_conversion=
//! false`. This crate now keeps configured connections for the life of the `Dataset`.
//!
//! ## The lease-generation rule, and why these tests state their generation
//!
//! **A first, freshly-created lease is equivalent to the old path and proves nothing about reuse.**
//! The regression risk this cut creates is specific: an interrupt handle attached to a *recycled*
//! connection failing to reach DuckDB, or a recycled connection carrying a stale cancelled token
//! into the next query. Both exist only from the second lease onwards. So the cancellation tests
//! below run on **lease generation ≥ 2** and each states the generation it exercises.
//!
//! Generation counts every lease of a physical connection, **including the one `Dataset::open`
//! takes** for the `geo` metadata read, the schema probe and ADR-016's identity scan. That
//! definition is fixed in `engine/src/pool.rs` and in `kernel/PROBE-PREREGISTRATION.md`, not chosen
//! after looking at an artifact.

use std::path::PathBuf;
use std::sync::atomic::Ordering;
use std::time::{Duration, Instant};

use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_engine::pool::LeaseClass;
use spatial_engine::{
    Bbox, CancelToken, Dataset, EngineError, PoolConfig, ViewportQuery, MAX_STREAM_CONNECTIONS,
};

/// Every blocking wait in this file has a deadline. A test that can hang forever is itself a
/// defect: a deadline turns a stall into a failure that names which wait it was.
const DEADLINE: Duration = Duration::from_secs(60);

fn write(name: &str, spec: &FixtureSpec) -> (PathBuf, FixtureFacts) {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/connections");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    let facts = write_geoparquet(&path, spec).expect("write fixture");
    (path, facts)
}

fn spec() -> FixtureSpec {
    FixtureSpec { features: 4_000, avg_vertices: 16, ..Default::default() }
}

/// Big enough that a query is still running some milliseconds in, so a cancellation test cancels
/// something rather than racing a query that has already finished.
fn big_spec() -> FixtureSpec {
    FixtureSpec { features: 40_000, avg_vertices: 64, ..Default::default() }
}

fn drain_to_end(s: &mut spatial_engine::BatchStream) -> usize {
    let mut rows = 0;
    let mut buf = Vec::new();
    while let Some(info) = s.next_into(&mut buf) {
        rows += info.expect("batch").rows;
        buf.clear();
    }
    rows
}

/// Wait until `f` holds, or fail naming the wait.
fn until(what: &str, f: impl Fn() -> bool) {
    let deadline = Instant::now() + DEADLINE;
    while !f() {
        assert!(Instant::now() < deadline, "timed out waiting for: {what}");
        std::thread::sleep(Duration::from_millis(2));
    }
}

/// A viewport **outside the data entirely**, so the query matches no row at all.
///
/// This is what makes the "cancel before the first batch" assertion structural rather than a race.
/// A batch is only flushed when the pending payload reaches the size target or when the scan ends
/// with something pending; a query that matches nothing can never satisfy either, so **zero
/// batches is true whether or not the cancel wins**. What the cancel then decides is only the
/// terminal, which is the one thing that test asserts about timing — and it asserts it with a
/// message that names the race rather than leaving a reader to guess.
fn matches_nothing(facts: &FixtureFacts) -> ViewportQuery {
    let e = facts.extent;
    let w = e[2] - e[0];
    let h = e[3] - e[1];
    ViewportQuery::viewport(
        Bbox { xmin: e[2] + w, ymin: e[3] + h, xmax: e[2] + w * 2.0, ymax: e[3] + h * 2.0 },
        "EPSG:2056",
    )
}

#[test]
fn two_sequential_streams_run_on_one_physical_connection() {
    let (path, facts) = write("sequential", &spec());
    let ds = Dataset::open(&path).expect("open");

    // Open itself leased and returned one connection, so nothing is created for the first stream.
    assert_eq!(ds.connections().physical_connections_created(), 1, "open prepared one");
    assert_eq!(ds.connections().idle_connections(), 1, "and kept it");

    let mut first = ds.stream(&ViewportQuery::all()).expect("first stream");
    let first_facts = first.connection_facts();
    assert_eq!(drain_to_end(&mut first), facts.features);
    drop(first);
    until("the first stream's lease to come back", || ds.connections().idle_connections() == 1);

    let mut second = ds.stream(&ViewportQuery::all()).expect("second stream");
    let second_facts = second.connection_facts();
    assert_eq!(drain_to_end(&mut second), facts.features);

    assert_eq!(
        first_facts.physical_id, second_facts.physical_id,
        "two sequential streams must run on the same physical connection"
    );
    assert_eq!(first_facts.lease_generation, 2, "open was generation 1; the first stream is 2");
    assert_eq!(second_facts.lease_generation, 3);
    assert!(first_facts.reused_an_existing_connection);
    assert!(second_facts.reused_an_existing_connection);
    assert_eq!(ds.connections().physical_connections_created(), 1, "nothing created after open");
}

#[test]
fn cancellation_before_the_first_batch_binds_a_recycled_connection_and_delivers_nothing() {
    // **Lease generation 3** — open took 1, the warm-up stream 2, this stream 3.
    //
    // Two things are asserted, because the second alone would not distinguish a working interrupt
    // from a lucky flag check:
    //   1. the *recycled* connection's interrupt handle is genuinely bound to this stream's token.
    //      That is the regression this cut could introduce and the reason a first lease proves
    //      nothing — `cancel.rs` already pins what a bound handle then does to a running query.
    //   2. nothing is delivered, and nothing is generated.
    let (path, facts) = write("cancel-before-first", &big_spec());
    let ds = Dataset::open(&path).expect("open");

    let mut warm = ds.stream(&ViewportQuery::all()).expect("warm-up stream");
    assert_eq!(drain_to_end(&mut warm), facts.features);
    drop(warm);
    until("the warm-up lease to come back", || ds.connections().idle_connections() == 1);

    let cancel = CancelToken::new();
    let mut stream = ds.stream_with_cancel(&matches_nothing(&facts), cancel.clone()).expect("stream");
    let f = stream.connection_facts();
    assert_eq!(f.lease_generation, 3, "generation exercised: 3");
    assert!(f.reused_an_existing_connection, "this test needs a recycled connection");
    assert!(
        cancel.is_bound(),
        "a recycled connection's interrupt handle must reach the token, or cancellation degrades \
         to the between-batches flag this engine's whole premise rejects"
    );

    cancel.cancel();

    let mut buf = Vec::new();
    let terminal = stream.next_into(&mut buf);
    // **Structural, not a race.** The query matches no row, so no batch can be flushed on any
    // interleaving — this assertion holds whether the cancel arrived before the scan ended or not.
    assert_eq!(
        stream.stats().batches_generated.load(Ordering::SeqCst),
        0,
        "nothing may be produced when the cancel arrives before the first batch"
    );
    match terminal {
        Some(Err(EngineError::Cancelled)) => {}
        None => panic!(
            "the scan completed before the cancel was issued, so this trial says nothing about \
             cancellation. It is reported as inconclusive rather than counted as a pass"
        ),
        other => panic!("expected a cancelled terminal, got {:?}", other.map(|r| r.map(|_| ()))),
    }
}

#[test]
fn midstream_cancellation_still_stops_the_producer_on_a_recycled_connection() {
    // **Lease generation 3**, for the same reason as above.
    let (path, facts) = write("cancel-midstream", &big_spec());
    let ds = Dataset::open(&path).expect("open");

    let mut warm = ds.stream(&ViewportQuery::all()).expect("warm-up stream");
    assert_eq!(drain_to_end(&mut warm), facts.features);
    drop(warm);
    until("the warm-up lease to come back", || ds.connections().idle_connections() == 1);

    let cancel = CancelToken::new();
    let mut stream = ds.stream_with_cancel(&ViewportQuery::all(), cancel.clone()).expect("stream");
    assert_eq!(stream.connection_facts().lease_generation, 3, "generation exercised: 3");
    assert!(cancel.is_bound());

    let mut buf = Vec::new();
    let first = stream.next_into(&mut buf).expect("a first batch").expect("batch");
    assert!(first.rows > 0);
    buf.clear();
    cancel.cancel();

    // Drain whatever was already in flight; the stream must end rather than run to completion.
    let mut rows = first.rows;
    while let Some(item) = stream.next_into(&mut buf) {
        match item {
            Ok(info) => rows += info.rows,
            Err(EngineError::Cancelled) => break,
            Err(e) => panic!("unexpected terminal {e}"),
        }
        buf.clear();
    }
    assert!(
        rows < facts.features,
        "a cancelled stream delivered the whole file ({rows} of {}) — it did not stop",
        facts.features
    );
    assert!(
        stream.stats().batches_after_cancel.load(Ordering::SeqCst) <= 1,
        "at most one batch may be generated after the producer observes the cancel"
    );
}

#[test]
fn a_query_after_a_cancellation_completes_on_a_replaced_connection() {
    // **The post-cancellation query is on lease ≥ 2 by construction, and it is asserted.**
    //
    // A cancelled query interrupted DuckDB on its connection, so that connection is discarded and
    // replaced rather than handed on: this engine has established no post-interrupt health
    // guarantee for DuckDB, and discard-and-replace is the declared bounded behaviour rather than
    // an optimisation. What must hold is that the *next* query is healthy — a cancellation may not
    // poison the dataset, and it may not cost the pool its capacity either.
    let (path, facts) = write("cancel-then-query", &big_spec());
    let ds = Dataset::open(&path).expect("open");

    let mut warm = ds.stream(&ViewportQuery::all()).expect("warm-up");
    assert_eq!(drain_to_end(&mut warm), facts.features);
    drop(warm);
    until("the warm-up lease to come back", || ds.connections().idle_connections() == 1);

    let cancel = CancelToken::new();
    let cancelled = ds.stream_with_cancel(&ViewportQuery::all(), cancel.clone()).expect("stream");
    let cancelled_facts = cancelled.connection_facts();
    assert_eq!(cancelled_facts.lease_generation, 3, "generation exercised: 3");
    cancel.cancel();
    drop(cancelled);

    until("the cancelled lease to be released", || ds.connections().active_leases() == 0);
    assert_eq!(
        ds.connections().idle_connections(),
        0,
        "a connection whose query was interrupted must not be returned to the pool"
    );
    assert!(!cancel.is_bound(), "a cancelled token must not stay attached to anything");

    let mut next = ds.stream(&ViewportQuery::all()).expect("a query after a cancellation");
    let next_facts = next.connection_facts();
    assert_ne!(
        next_facts.physical_id, cancelled_facts.physical_id,
        "the interrupted connection is replaced, not reused"
    );
    assert_eq!(
        drain_to_end(&mut next),
        facts.features,
        "cancellation must not poison the next query"
    );
}

#[test]
fn two_concurrent_streams_hold_separate_leases_and_cancelling_one_leaves_the_other_alone() {
    let (path, facts) = write("concurrent", &big_spec());
    let ds = Dataset::open(&path).expect("open");

    let cancel_a = CancelToken::new();
    let mut a = ds.stream_with_cancel(&ViewportQuery::all(), cancel_a.clone()).expect("stream a");
    let mut b = ds.stream(&ViewportQuery::all()).expect("stream b");
    assert_ne!(
        a.connection_facts().physical_id,
        b.connection_facts().physical_id,
        "concurrent streams must not share one physical connection: DuckDB's interrupt addresses a \
         connection, so sharing would make cancelling either one interrupt both"
    );

    // Pull one batch from each, so both are genuinely running when the cancel arrives. B's first
    // batch counts toward its total — it is part of the result B must still deliver in full.
    let mut buf = Vec::new();
    a.next_into(&mut buf).expect("a batch from a").expect("batch");
    buf.clear();
    let mut b_rows = b.next_into(&mut buf).expect("a batch from b").expect("batch").rows;
    buf.clear();

    cancel_a.cancel();

    // B completes in full. This is the assertion that matters: one stream's cancellation is not
    // another's.
    while let Some(item) = b.next_into(&mut buf) {
        b_rows += item.expect("b must not be affected by a's cancellation").rows;
        buf.clear();
    }
    assert_eq!(b_rows, facts.features, "the untouched stream delivers its whole result");
    drop(a);
}

#[test]
fn dropping_a_stream_releases_its_lease_and_detaches_the_interrupt_handle() {
    let (path, _) = write("drop-releases", &big_spec());
    let ds = Dataset::open(&path).expect("open");

    let cancel = CancelToken::new();
    let stream = ds.stream_with_cancel(&ViewportQuery::all(), cancel.clone()).expect("stream");
    assert_eq!(ds.connections().active_leases(), 1);
    assert!(cancel.is_bound());
    drop(stream);

    until("the abandoned stream's lease to be released", || ds.connections().active_leases() == 0);
    // **Detached, not merely finished.** `CancelToken::detach` exists so a later `cancel()` cannot
    // poke a connection that has been handed back — which is precisely the hazard reuse creates,
    // because the connection now outlives the stream that used it.
    assert!(!cancel.is_bound(), "the interrupt handle must be released with the lease");

    // And the dataset still serves: abandoning a stream must not cost the pool its capacity.
    let mut next = ds.stream(&ViewportQuery::all()).expect("the dataset still serves");
    assert!(drain_to_end(&mut next) > 0);
}

#[test]
fn capacity_exhaustion_is_a_typed_refusal_rather_than_a_queue() {
    // **Reachable here because this test bypasses the composition.** In the shipped process the
    // binding admits no more concurrent streams than this class has connections, so this refusal
    // cannot be reached — `kernel/README.md` records that composition. The engine is not entitled
    // to assume the composition it is used in, so the ceiling is asserted anyway.
    //
    // It refuses rather than queueing, deliberately: waiting for a connection would be an admission
    // policy, and that question is reserved elsewhere. Nothing here may be cited as evidence about
    // how it should be resolved.
    let (path, _) = write("exhaustion", &big_spec());
    let ds = Dataset::open(&path).expect("open");

    let mut held = Vec::new();
    for i in 0..MAX_STREAM_CONNECTIONS {
        held.push(ds.stream(&ViewportQuery::all()).unwrap_or_else(|e| panic!("stream {i}: {e}")));
    }
    match ds.stream(&ViewportQuery::all()) {
        Err(EngineError::ConnectionsExhausted { class, capacity }) => {
            assert_eq!(class, "stream");
            assert_eq!(capacity, MAX_STREAM_CONNECTIONS);
        }
        Ok(_) => panic!("the declared ceiling was exceeded"),
        Err(e) => panic!("expected a typed refusal, got {e}"),
    }

    // Maintenance is a separate budget and is unaffected, which is the point of the split: four
    // admitted streams must not make an index build impossible.
    let maintenance = ds
        .connections()
        .acquire(LeaseClass::Maintenance)
        .expect("four streams must not exhaust the maintenance class");
    drop(maintenance);
    drop(held);
}

#[test]
fn the_measurement_control_creates_a_connection_for_every_query() {
    // The reuse-off control the S2 comparison needs — the same code path with a capacity of zero,
    // so the contrast measures reuse rather than two implementations.
    let (path, facts) = write("control", &spec());
    let ds =
        Dataset::open_with_connections(&path, None, PoolConfig::fresh_per_query()).expect("open");
    assert_eq!(ds.connections().idle_connections(), 0, "nothing is kept from open");

    let mut a = ds.stream(&ViewportQuery::all()).expect("a");
    let a_facts = a.connection_facts();
    assert_eq!(drain_to_end(&mut a), facts.features);
    drop(a);
    until("a's lease to be released", || ds.connections().active_leases() == 0);

    let mut b = ds.stream(&ViewportQuery::all()).expect("b");
    let b_facts = b.connection_facts();
    assert_eq!(drain_to_end(&mut b), facts.features);

    assert_ne!(a_facts.physical_id, b_facts.physical_id);
    assert_eq!(a_facts.lease_generation, 1, "every lease is a first lease when nothing is kept");
    assert_eq!(b_facts.lease_generation, 1);
    assert!(!a_facts.reused_an_existing_connection);
    assert!(!b_facts.reused_an_existing_connection);
}

#[test]
fn a_connection_that_skipped_the_identity_scan_is_still_safe_to_reuse() {
    // **The one open path where the verification statement is the *first* thing to run after
    // `probe_schema` abandons its result iterator.**
    //
    // `read_geo_metadata`'s own comment records what that abandonment used to cost: DuckDB
    // reporting `ActiveTransaction called without active transaction` **two calls later**, an
    // internal error surfacing as an unrelated failure. On the ordinary path ADR-016's identity
    // scan runs in between, so `release_healthy`'s `SELECT 1` is the second call. With
    // `skip_uniqueness_check` the scan returns before running any SQL, so the verification is the
    // first call and the *next stream's* `prepare` is the second — exactly the position the old
    // failure surfaced at. While the connection died at the end of every open this was
    // unreachable; reuse makes it reachable, so it is tested rather than reasoned about.
    use spatial_engine::identity::IdentityDeclaration;

    let (path, facts) = write("skip-uniqueness", &spec());
    let mut declaration =
        IdentityDeclaration::new("id", "connection-reuse test", "2026-08-06T00:00:00Z");
    declaration.skip_uniqueness_check = true;
    let ds = Dataset::open_with_declared_identity(&path, declaration, &CancelToken::new())
        .expect("open");
    assert_eq!(ds.connections().idle_connections(), 1, "the connection was verified and kept");

    let mut first = ds.stream(&ViewportQuery::all()).expect("first stream after a skipped scan");
    assert_eq!(first.connection_facts().lease_generation, 2, "generation exercised: 2");
    assert_eq!(drain_to_end(&mut first), facts.features);
    drop(first);
    until("the lease to come back", || ds.connections().idle_connections() == 1);

    let mut second = ds.stream(&ViewportQuery::all()).expect("second stream");
    assert_eq!(drain_to_end(&mut second), facts.features, "and the one after it");
}

#[test]
fn dropping_the_dataset_closes_its_idle_connections() {
    // The pool is owned by the `Dataset`, not by a process-wide path-keyed cache — so a connection
    // cannot outlive the CRS (ADR-015) and identity (ADR-016) facts admitted alongside it.
    //
    // **Asserted through a `Weak`, deliberately.** Holding a strong reference to the pool in order
    // to look at it would keep the very thing alive whose release is the property under test, and
    // the assertion would then be about the test's own reference rather than about the dataset.
    let (path, _) = write("dataset-drop", &spec());
    let ds = Dataset::open(&path).expect("open");
    let watch = std::sync::Arc::downgrade(ds.connections());
    assert_eq!(
        watch.upgrade().expect("alive while the dataset is").idle_connections(),
        1,
        "open left one configured connection ready"
    );

    drop(ds);

    assert!(
        watch.upgrade().is_none(),
        "the dataset's pool outlived it, so its idle DuckDB connections were not closed"
    );
}

#[test]
fn a_lease_in_flight_keeps_the_pool_alive_after_the_dataset_is_dropped() {
    // The other half of ownership: a producer thread still running a query must not have its
    // connection freed underneath it. The pool is reference-counted for exactly this, so the last
    // lease closes the last connection rather than the `Dataset` doing it early.
    let (path, _) = write("dataset-drop-inflight", &big_spec());
    let ds = Dataset::open(&path).expect("open");
    let watch = std::sync::Arc::downgrade(ds.connections());

    let cancel = CancelToken::new();
    let stream = ds.stream_with_cancel(&ViewportQuery::all(), cancel.clone()).expect("stream");
    drop(ds);
    assert!(watch.upgrade().is_some(), "a lease in flight keeps the pool alive");

    drop(stream);
    until("the last lease to be released", || watch.upgrade().is_none());
}

#[test]
fn a_bbox_query_on_a_reused_connection_returns_what_it_always_did() {
    // Reuse must change nothing a consumer can see: the same rows, from a connection that has
    // already served other queries.
    let (path, facts) = write("bbox-reuse", &spec());
    let ds = Dataset::open(&path).expect("open");
    let e = facts.extent;
    let view = Bbox {
        xmin: e[0],
        ymin: e[1],
        xmax: e[0] + (e[2] - e[0]) * 0.5,
        ymax: e[1] + (e[3] - e[1]) * 0.5,
    };
    let q = ViewportQuery::viewport(view, "EPSG:2056");

    let mut first = ds.stream(&q).expect("first");
    let expected = drain_to_end(&mut first);
    drop(first);
    until("the lease to come back", || ds.connections().idle_connections() == 1);

    let mut whole = ds.stream(&ViewportQuery::all()).expect("whole");
    assert_eq!(drain_to_end(&mut whole), facts.features);
    drop(whole);
    until("the lease to come back", || ds.connections().idle_connections() == 1);

    let mut third = ds.stream(&q).expect("third");
    assert!(third.connection_facts().lease_generation >= 4, "generation exercised: 4 or more");
    assert_eq!(drain_to_end(&mut third), expected, "the same viewport must select the same rows");
    assert!(expected > 0 && expected < facts.features, "the viewport must actually narrow");
}
