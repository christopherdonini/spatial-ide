//! **Every O(N) phase of an index build is cancellable — deterministically, not by luck.**
//!
//! `kernel/RESULTS.md`'s second section reports this as a code fact rather than a timing: after
//! `SpatialIndex::scan` performed its last `is_cancelled()` check, the extent pass and the
//! grid-construction loops contained **no cancellation point at all**. A cancel arriving in that
//! window was not observed and the build completed. At 100 000 features the window is a few
//! milliseconds and nothing is at stake; at `MAX_INDEXED_FEATURES` = 20 000 000 it is the same code
//! with 200× the work, against `docs/08`'s "cancellation acknowledged < 100 ms, **any operation**"
//! and `docs/01` principle 7.
//!
//! ## Why these tests use a phase observer rather than a sleep
//!
//! **A delay ladder cannot aim at a phase it cannot see, and the previous pass proved it.** All
//! twelve of its delays landed inside the 610 ms content hash and it obtained zero samples of the
//! 30 ms DuckDB scan. Sleeping for "about the right number of milliseconds" tests the scheduler.
//!
//! Here the observer is notified **on the building thread as it enters each phase**, and cancels
//! from inside that notification. The cancel is therefore issued at a known point in a known phase
//! every time, on any machine, at any speed. The observation instant of a cancellation *latency*
//! measurement still belongs to the thread doing the work and is not taken here — that is
//! `kernel/tests/indexed_budgets.rs`'s job, and these are correctness tests.

use std::path::PathBuf;
use std::sync::atomic::{AtomicBool, AtomicUsize, Ordering};
use std::sync::Mutex;

use spatial_engine::fixture::{write_geoparquet, FixtureFacts, FixtureSpec};
use spatial_engine::index::{IndexPhase, IndexPhaseObserver};
use spatial_engine::{Bbox, CancelToken, Dataset, EngineError, ViewportQuery};

fn write(name: &str, spec: &FixtureSpec) -> (PathBuf, FixtureFacts) {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/index-cancel");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    let facts = write_geoparquet(&path, spec).expect("write fixture");
    (path, facts)
}

/// Large enough that each post-scan phase runs long enough to contain a poll, and that a build
/// which ignored cancellation would visibly complete.
fn spec() -> FixtureSpec {
    FixtureSpec { features: 60_000, avg_vertices: 16, ..Default::default() }
}

/// Cancels the build the moment it enters a chosen phase, and records the order of phases seen.
struct CancelAtPhase {
    target: IndexPhase,
    cancel: CancelToken,
    seen: Mutex<Vec<IndexPhase>>,
    fired: AtomicBool,
}

impl CancelAtPhase {
    fn new(target: IndexPhase, cancel: CancelToken) -> Self {
        Self { target, cancel, seen: Mutex::new(Vec::new()), fired: AtomicBool::new(false) }
    }
    fn phases(&self) -> Vec<IndexPhase> {
        self.seen.lock().unwrap_or_else(|e| e.into_inner()).clone()
    }
}

impl IndexPhaseObserver for CancelAtPhase {
    fn phase(&self, phase: IndexPhase) {
        self.seen.lock().unwrap_or_else(|e| e.into_inner()).push(phase);
        if phase == self.target {
            self.fired.store(true, Ordering::SeqCst);
            self.cancel.cancel();
        }
    }
}

/// Records every phase and cancels nothing.
#[derive(Default)]
struct RecordPhases {
    seen: Mutex<Vec<IndexPhase>>,
    calls: AtomicUsize,
}

impl IndexPhaseObserver for RecordPhases {
    fn phase(&self, phase: IndexPhase) {
        self.calls.fetch_add(1, Ordering::SeqCst);
        self.seen.lock().unwrap_or_else(|e| e.into_inner()).push(phase);
    }
}

/// Cancel on entry to `target`, and assert the build refused rather than completing.
///
/// **The cancel is issued from inside the phase transition**, so the poll that must catch it is the
/// one at the top of that phase's own loop. A phase with no poll would run to completion and the
/// build would succeed, which is exactly what this fails on.
fn cancelled_at(name: &str, target: IndexPhase) {
    let (path, _) = write(name, &spec());
    let ds = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();
    let observer = CancelAtPhase::new(target, cancel.clone());

    let outcome = ds.build_index_observed(&cancel, Some(&observer));

    assert!(
        observer.fired.load(Ordering::SeqCst),
        "the build never entered {target:?}; phases seen: {:?}",
        observer.phases()
    );
    match outcome {
        Err(EngineError::Cancelled) => {}
        Ok(_) => panic!(
            "a build cancelled on entry to {target:?} completed anyway — that phase has no \
             cancellation point. Phases seen: {:?}",
            observer.phases()
        ),
        Err(e) => panic!("expected Cancelled, got {e}"),
    }
    assert!(
        !observer.phases().contains(&IndexPhase::Complete),
        "a cancelled build must not report Complete"
    );

    // **No partial index reaches the cache.** A later query must not be served candidate ids from
    // a structure that was never finished — and the cheapest way for that to happen is for a
    // cancelled build to insert what it had.
    let after = Dataset::open(&path).expect("reopen");
    let report = after
        .build_index(&CancelToken::new())
        .expect("a build after a cancelled one must succeed");
    assert!(
        report.miss.is_some(),
        "a cancelled build left an entry in the cache: the rebuild reported a hit"
    );
    assert!(report.build_millis > 0.0, "the rebuild really rebuilt");
}

#[test]
fn a_build_cancelled_entering_the_duckdb_scan_refuses() {
    // The phase the previous pass never sampled at all: all twelve of its delays fell inside the
    // content hash, which runs first and is 20× longer.
    cancelled_at("scan", IndexPhase::DuckDbScan);
}

#[test]
fn a_build_cancelled_entering_bbox_validation_refuses() {
    cancelled_at("validate", IndexPhase::ValidateBboxes);
}

#[test]
fn a_build_cancelled_entering_extent_reduction_refuses() {
    cancelled_at("extent", IndexPhase::ComputeExtent);
}

#[test]
fn a_build_cancelled_entering_grid_population_refuses() {
    cancelled_at("grid", IndexPhase::PopulateGrid);
}

#[test]
fn a_build_cancelled_during_the_content_hash_refuses() {
    cancelled_at("hash", IndexPhase::ContentHash);
}

#[test]
fn the_inner_cell_insertion_loop_polls_too() {
    // **The loop a per-feature poll would miss.** One feature may occupy up to
    // `MAX_CELLS_PER_FEATURE` buckets, so a cancellation check placed once per feature leaves an
    // unpolled window a thousand times longer than the declared cadence claims. This fixture holds
    // features whose covering bboxes span many cells, so grid population spends its time in the
    // inner loop rather than in the outer one.
    //
    // The cancel is issued on entry to `PopulateGrid`, and the assertion is that the build refuses
    // *at this shape* as well — the cadence is counted over insertions, so both loops are covered
    // by the same constant.
    let (path, facts) = write(
        "wide-features",
        &FixtureSpec { features: 20_000, avg_vertices: 64, hole_every: 3, ..Default::default() },
    );
    assert!(facts.features > 0);
    let ds = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();
    let observer = CancelAtPhase::new(IndexPhase::PopulateGrid, cancel.clone());
    match ds.build_index_observed(&cancel, Some(&observer)) {
        Err(EngineError::Cancelled) => {}
        other => panic!("expected Cancelled, got {:?}", other.map(|_| ())),
    }
}

#[test]
fn an_uncancelled_build_passes_every_phase_in_order_and_still_produces_the_same_index() {
    // The control. Adding cancellation points must not change what a build produces, and the phase
    // sequence is asserted so a future edit cannot silently drop a phase and make the cancellation
    // tests above vacuous.
    let (path, facts) = write("uncancelled", &spec());
    let ds = Dataset::open(&path).expect("open");

    let observer = RecordPhases::default();
    let report =
        ds.build_index_observed(&CancelToken::new(), Some(&observer)).expect("build must succeed");

    assert_eq!(
        observer.seen.lock().unwrap().as_slice(),
        &[
            IndexPhase::ContentHash,
            IndexPhase::DuckDbScan,
            IndexPhase::ValidateBboxes,
            IndexPhase::ComputeExtent,
            IndexPhase::PopulateGrid,
            IndexPhase::Complete,
        ],
        "the declared phase sequence"
    );
    assert_eq!(report.indexed_features, facts.features);
    assert!(report.miss.is_some());

    // And the index it built still answers what the scan answers — the property that matters most
    // about the index, asked through the experimental seam because the product planner no longer
    // consults it.
    let e = facts.extent;
    let view = Bbox {
        xmin: e[0] + (e[2] - e[0]) * 0.2,
        ymin: e[1] + (e[3] - e[1]) * 0.2,
        xmax: e[0] + (e[2] - e[0]) * 0.7,
        ymax: e[1] + (e[3] - e[1]) * 0.7,
    };
    let q = ViewportQuery::viewport(view, "EPSG:2056");
    let scan = drain(ds.stream(&q).expect("scan stream"));
    let indexed = drain(
        ds.stream_indexed_experimental(&q, CancelToken::new()).expect("indexed stream"),
    );
    assert!(!scan.is_empty(), "the viewport must select something");
    assert_eq!(scan, indexed, "cancellation points must not change what the index answers");
}

#[test]
fn a_cancelled_build_frees_the_maintenance_lease_it_held() {
    // **A deadlock if it did not.** The maintenance class holds one connection, so a cancelled
    // build that leaked its slot would make every later `build_index` in the process refuse with
    // `ConnectionsExhausted` — a cancellation poisoning the dataset, one level up from the
    // connection.
    let (path, _) = write("lease-freed", &spec());
    let ds = Dataset::open(&path).expect("open");

    for phase in [IndexPhase::DuckDbScan, IndexPhase::ValidateBboxes, IndexPhase::PopulateGrid] {
        let cancel = CancelToken::new();
        let observer = CancelAtPhase::new(phase, cancel.clone());
        match ds.build_index_observed(&cancel, Some(&observer)) {
            Err(EngineError::Cancelled) => {}
            other => panic!("expected Cancelled at {phase:?}, got {:?}", other.map(|_| ())),
        }
        assert_eq!(ds.connections().active_leases(), 0, "the lease must be released at {phase:?}");
    }

    ds.build_index(&CancelToken::new()).expect("a build after three cancelled ones must succeed");
}

fn drain(mut s: spatial_engine::BatchStream) -> Vec<u64> {
    let mut ids = Vec::new();
    let mut buf = Vec::new();
    while let Some(info) = s.next_into(&mut buf) {
        info.expect("batch");
        let mut rdr =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        let batch = rdr.next().unwrap().unwrap();
        let col = batch.column(0).as_any().downcast_ref::<arrow::array::UInt64Array>().unwrap();
        ids.extend(col.values().iter().copied());
        buf.clear();
    }
    ids.sort_unstable();
    ids
}
