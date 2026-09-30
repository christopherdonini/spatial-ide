// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! T5 (`engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md` §4): a cancel landing *while* the
//! producer thread is inside its own execute window ends the stream `Cancelled` — proven through
//! the shipped product path (`Dataset::stream_with_cancel` -> `stream::produce`), not a synthetic
//! reproduction confined to `cancel.rs`. `is_executing()` is the instrument this needs: without it,
//! "the producer really is inside `execute_guarded` right now" rests on reading the code.

use std::time::{Duration, Instant};

use spatial_engine::fixture::{
    write_geoparquet_cancellable, AttributeMode, FixtureFacts, FixtureSpec,
};
use spatial_engine::{AdmittedPredicate, Bbox, CancelToken, Dataset, EngineError, ViewportQuery};

/// Bounds only how long a failing test runs (form §7). Never reported as a latency.
const TEST_LIVENESS_DEADLINE: Duration = Duration::from_secs(60);

/// F3: 2,000,000 features — the late-match precedent's own count
/// (`kernel/tests/skp_filter_cancellation.rs:124`), large enough that `stream_arrow`'s single call
/// (bind + execute + the whole non-matching scan) is still running when this test's poll observes
/// `is_executing()`.
const FEATURES: usize = 2_000_000;

/// The admitted predicate F3 streams with (form §10 Amendment 3, item 3). It matches no row: every
/// `zone` is one of `fixture::ZONE_VALUES` or NULL and none contains `zz`, and `id + id < id` is
/// false for every unsigned id. **Both disjuncts are needed.** Each alone is decided by DuckDB
/// without reading the row groups, so the whole call returns at once; the `OR` of the two is not,
/// and every row of every row group goes through a `FILTER` above the scan before any chunk exists.
/// That was checked for this predicate by `EXPLAIN ANALYZE` outside the repo, and is not asserted
/// here: a missed window is an invalid run (form §5), and this test cannot tell it from its mutation.
const NEVER_TRUE: &str = "zone LIKE '%zz%' OR id + id < id";

/// The fixture directory, unique to this run and removed when the test ends, on a panic too.
struct RunDir(std::path::PathBuf);

impl RunDir {
    fn new() -> Self {
        let nanos = std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .map_or(0, |d| d.as_nanos());
        let dir = std::env::temp_dir().join(format!(
            "spatial-engine-cancel-execute-window-{}-{nanos}",
            std::process::id()
        ));
        std::fs::create_dir_all(&dir).expect("fixture dir");
        Self(dir)
    }
}

impl Drop for RunDir {
    fn drop(&mut self) {
        let _ = std::fs::remove_dir_all(&self.0);
    }
}

/// A viewport covering the whole extent, so the bbox admits every row and only the predicate
/// decides. The scan can then not be shortened by excluding row groups on the bbox statistics.
fn whole_extent(facts: &FixtureFacts) -> Bbox {
    let e = facts.extent;
    Bbox {
        xmin: e[0],
        ymin: e[1],
        xmax: e[2],
        ymax: e[3],
    }
}

#[test]
fn a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled() {
    let run_dir = RunDir::new();
    let path = run_dir.0.join("no-match.parquet");
    let facts = write_geoparquet_cancellable(
        &path,
        &FixtureSpec {
            features: FEATURES,
            avg_vertices: 12,
            hole_every: 0,
            attributes: AttributeMode::CategoricalZone,
            ..Default::default()
        },
        &CancelToken::new(),
        None,
    )
    .expect("write fixture");

    let ds = Dataset::open(&path).expect("open");
    let filter = AdmittedPredicate::admit(NEVER_TRUE, &ds).expect("the predicate is admitted");
    let query = ViewportQuery::viewport(whole_extent(&facts), "EPSG:2056").with_filter(filter);
    let cancel = CancelToken::new();
    let mut stream = ds
        .stream_with_cancel(&query, cancel.clone())
        .expect("stream");

    // Spin on `is_executing()` until the producer thread is actually inside `execute_guarded`'s
    // closure — i.e. inside `stmt.stream_arrow(..)` — rather than cancelling blind. This is the
    // assertion that the shipped `produce` really routes execution through the guard at all.
    let deadline = Instant::now() + TEST_LIVENESS_DEADLINE;
    while !cancel.is_executing() {
        assert!(
            Instant::now() < deadline,
            "timed out waiting for the producer to start executing"
        );
        std::thread::sleep(Duration::from_millis(1));
    }

    cancel.cancel();

    let mut buf = Vec::new();
    let terminal = stream.next_into(&mut buf);
    match terminal {
        Some(Err(EngineError::Cancelled)) => {}
        None => panic!(
            "the scan completed before the cancel was issued, so this trial says nothing about \
             cancellation inside the execute window. It is reported as inconclusive rather than \
             counted as a pass"
        ),
        other => panic!(
            "expected a cancelled terminal, got {:?}",
            other.map(|r| r.map(|_| ()))
        ),
    }

    let deadline = Instant::now() + TEST_LIVENESS_DEADLINE;
    while cancel.is_executing() {
        assert!(
            Instant::now() < deadline,
            "timed out waiting for is_executing() to fall back to false after the stream ended"
        );
        std::thread::sleep(Duration::from_millis(1));
    }
}
