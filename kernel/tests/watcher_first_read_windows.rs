// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Regression test (1)**, `engine/WATCHER-FIRST-READ-PREREGISTRATION.md` (wave-2 C-1; the
//! 2026-09-28 S1 batch, `state/directives/2026-09-28-after-wave-s1-batch.md`'s C-1 paragraph).
//! `PlatformWatch` armed through the real `SkpHost::open_dataset`, over a real GeoParquet
//! fixture, from a thread that then exits — the exact interleaving `state/cloud/wave2/W2-C.md`'s
//! finding C-1 reproduced (its custodian fields' own Windows reproduction is the second rule
//! below the finding; this file makes that regression permanent).
//!
//! Non-Windows is a declared non-goal of the watcher itself (`SOURCE-WATCHER-PREREGISTRATION.md`
//! §4's tier note): this whole file is `#[cfg(windows)]`.

#![cfg(windows)]

use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::PlatformWatch;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    CoverageState, DescribeRequest, OpenDatasetRequest, ViewportQueryRequest, SKP_VERSION,
};

/// A harness ceiling, never a claim about delivery latency (ADR-018) — long enough that a real
/// false `CoverageLost` (the bug this test guards against) would already have arrived.
const BOUNDED_WAIT: Duration = Duration::from_secs(5);

fn dir(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-kernel-watcher-first-read-tests")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).expect("scratch dir");
    d
}

/// RECORDED MUTATION: (1) in `engine::watch::windows_watch::arm`, issue each handle's first
/// overlapped read on `arm`'s own caller thread again (today's order), instead of inside its
/// watch thread. Expected failure: `session_ended` below is `Ok(..)` — a real event arrives —
/// where `Err(_)` (nothing within `BOUNDED_WAIT`) is expected, because the opener thread's exit
/// cancels the still-caller-owned pending read and the watch reports it as `CoverageLost`.
/// (2) Vacuity (reviewer gate 1, S2): in `watch_thread`, unconditionally `ready.send(Err(..))`
/// and return immediately, before ever calling `issue_read` — every arm becomes `ChecksOnly`
/// instead of `Watching`. Expected failure: the `CoverageState::Watching` assertion below fails,
/// because `describe`'s coverage state is `ChecksOnly` instead.
#[test]
fn the_opener_threads_exit_does_not_end_a_healthy_session() {
    let d = dir("c1");
    let path = d.join("source.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            features: 30,
            avg_vertices: 6,
            hole_every: 0,
            ..Default::default()
        },
    )
    .expect("write fixture");

    let (tx, rx) = session_end_channel();
    let host = Arc::new(SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        Arc::new(PlatformWatch::new()),
        tx,
    ));

    let req = OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: "c1".to_string(),
        crs_assertion: None,
        identity: None,
    };
    let opener_host = host.clone();
    // The opening thread arms the watch through `open_dataset`, then exits immediately — the
    // exact interleaving finding C-1 reproduced (a `spawn_blocking` pool thread in the shell).
    let open = std::thread::spawn(move || opener_host.open_dataset(req).expect("open"))
        .join()
        .expect("the opener thread exits cleanly");

    // Positive control (reviewer gate 1, S2): the watch must actually be armed, not merely
    // absent-of-signal — kernel/tests/source_watch_ordering.rs:237 uses the same check.
    let described = host
        .describe(DescribeRequest {
            skp: SKP_VERSION.to_string(),
            dataset: open.dataset.clone(),
        })
        .expect("describe");
    assert_eq!(
        described.coverage.state,
        CoverageState::Watching,
        "the watch must actually be armed: {:?}",
        described.coverage
    );

    let session_ended = rx.recv_timeout(BOUNDED_WAIT);
    assert!(
        session_ended.is_err(),
        "a healthy session must not end just because its opener thread exited: {session_ended:?}"
    );

    let queried = host.viewport_query(ViewportQueryRequest {
        skp: SKP_VERSION.to_string(),
        dataset: open.dataset,
        bbox: None,
        bbox_crs: None,
        limit: None,
        filter: None,
        columns: None,
    });
    assert!(
        queried.is_ok(),
        "viewport_query must be admitted: {queried:?}"
    );
}
