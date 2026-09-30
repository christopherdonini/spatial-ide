// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! T5 (`engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md` §4): a cancel landing *while* the
//! producer thread is inside its own execute window ends the stream `Cancelled` — proven through
//! the shipped product path (`Dataset::stream_with_cancel` -> `stream::produce`), not a synthetic
//! reproduction confined to `cancel.rs`. `is_executing()` is the instrument this needs: without it,
//! "the producer really is inside `execute_guarded` right now" rests on reading the code.

use std::time::{Duration, Instant};

use spatial_engine::fixture::{write_geoparquet_cancellable, FixtureFacts, FixtureSpec};
use spatial_engine::{Bbox, CancelToken, Dataset, EngineError, ViewportQuery};

/// Bounds only how long a failing test runs (form §7). Never reported as a latency.
const TEST_LIVENESS_DEADLINE: Duration = Duration::from_secs(60);

/// F3: 2,000,000 features — the late-match precedent's own count
/// (`kernel/tests/skp_filter_cancellation.rs:124`), large enough that `stream_arrow`'s single call
/// (bind + execute + the whole non-matching scan) is still running when this test's poll observes
/// `is_executing()`.
const FEATURES: usize = 2_000_000;

fn fixture_path() -> std::path::PathBuf {
    let dir = std::env::temp_dir().join("spatial-engine-cancel-execute-window");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    dir.join("no-match.parquet")
}

/// A viewport outside the data entirely, so the scan matches no row and `stream_arrow` must walk
/// the whole file before yielding anything. The same structural device
/// `engine/tests/connection_reuse.rs`'s `matches_nothing` uses, restated here rather than shared:
/// this workspace's integration test binaries do not import code from one another
/// (`kernel/tests/skp_filter_cancellation.rs`'s module doc states the same convention).
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
fn a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled() {
    let path = fixture_path();
    let facts = write_geoparquet_cancellable(
        &path,
        &FixtureSpec { features: FEATURES, avg_vertices: 12, hole_every: 0, ..Default::default() },
        &CancelToken::new(),
        None,
    )
    .expect("write fixture");

    let ds = Dataset::open(&path).expect("open");
    let cancel = CancelToken::new();
    let mut stream =
        ds.stream_with_cancel(&matches_nothing(&facts), cancel.clone()).expect("stream");

    // Spin on `is_executing()` until the producer thread is actually inside `execute_guarded`'s
    // closure — i.e. inside `stmt.stream_arrow(..)` — rather than cancelling blind. This is the
    // assertion that the shipped `produce` really routes execution through the guard at all.
    let deadline = Instant::now() + TEST_LIVENESS_DEADLINE;
    while !cancel.is_executing() {
        assert!(Instant::now() < deadline, "timed out waiting for the producer to start executing");
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
        other => panic!("expected a cancelled terminal, got {:?}", other.map(|r| r.map(|_| ()))),
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
