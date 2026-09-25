// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The engine → kernel seam, from the real shape** (worker.md's cross-module seam rule):
//! `PlatformWatch` — the real Windows adapter, not a test double — armed through the real
//! `SkpHost::open_dataset`, over a real GeoParquet fixture. `engine/SOURCE-WATCHER-PREREGISTRATION.md`
//! §4's W1–W3.
//!
//! Non-Windows is a declared non-goal (§4's tier note): this whole file is `#[cfg(windows)]`.

#![cfg(windows)]

mod watch_support;

use std::path::PathBuf;
use std::sync::Arc;
use std::time::Duration;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::PlatformWatch;
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{
    CloseDatasetRequest, DatasetHandle, EndReason, OpenDatasetRequest, ViewportQueryRequest,
    SKP_VERSION,
};

const WAIT: Duration = Duration::from_secs(10);

fn dir(name: &str) -> PathBuf {
    let d = std::env::temp_dir().join("spatial-kernel-source-watch-windows-tests").join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).expect("scratch dir");
    d
}

fn fixture(parent: &std::path::Path) -> PathBuf {
    let path = parent.join("source.parquet");
    write_geoparquet(&path, &FixtureSpec { features: 30, avg_vertices: 6, hole_every: 0, ..Default::default() })
        .expect("write fixture");
    path
}

fn open_req(path: &std::path::Path, cancel_key: &str) -> OpenDatasetRequest {
    OpenDatasetRequest {
        skp: SKP_VERSION.to_string(),
        path: path.display().to_string(),
        cancel_key: cancel_key.to_string(),
        crs_assertion: None,
        identity: None,
    }
}

fn viewport_req(dataset: DatasetHandle) -> ViewportQueryRequest {
    ViewportQueryRequest {
        skp: SKP_VERSION.to_string(),
        dataset,
        bbox: None,
        bbox_crs: None,
        limit: None,
        filter: None,
    }
}

fn touch_modification_time(path: &std::path::Path) {
    let later = std::time::SystemTime::now() + Duration::from_secs(120);
    std::fs::File::options()
        .write(true)
        .open(path)
        .expect("reopen to touch mtime")
        .set_modified(later)
        .expect("touch mtime");
}

// -------------------------------------------------------------------------------------------
// W1 — a real write to the open source ends its generation through the host
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: in `SkpHost::open_dataset`'s sink closure, make the `Admitted` arm a no-op
/// (ignore signals once admitted). Expected failure: this test's `viewport_query` no longer
/// refuses, and no event arrives.
#[test]
fn w1_a_real_write_to_the_open_source_ends_its_generation_through_the_host() {
    let d = dir("w1");
    let path = fixture(&d);
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        Arc::new(PlatformWatch::new()),
        tx,
    );
    let open = host.open_dataset(open_req(&path, "w1")).expect("open");

    touch_modification_time(&path);

    // **Wait for the real watcher's own event FIRST, before ever calling `viewport_query`.**
    // `Dataset::check_source_unchanged`'s pre-check re-reads the descriptor synchronously on
    // every query issue, entirely independent of this watcher — calling `viewport_query` in a
    // retry loop here would let that pre-check alone explain the refusal (on its very first
    // call, since the descriptor already differs), proving nothing about the watcher at all. The
    // event arriving is what isolates the watcher's own contribution; the mutation breaks
    // exactly that.
    let event = rx.recv_timeout(WAIT).expect("the real watch signals within the wait");
    assert_eq!(event.session, open.session);
    assert_eq!(event.reason, EndReason::ObservedChange);
    assert!(rx.recv_timeout(Duration::from_millis(200)).is_err(), "exactly one event");

    let refused = host.viewport_query(viewport_req(open.dataset)).expect_err("refused");
    assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);
}

// -------------------------------------------------------------------------------------------
// W2 (addition 5) — renaming the watched directory ends the generation
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: skip arming G in `engine::watch::arm` (return early after step 4). Expected
/// failure: this test's `viewport_query` never refuses within the wait — H1 means only G could
/// ever have caught this.
#[test]
fn w2_renaming_the_watched_directory_ends_the_generation() {
    let d = dir("w2");
    let parent = d.join("watched-parent");
    std::fs::create_dir(&parent).expect("create P");
    let path = fixture(&parent);
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        Arc::new(PlatformWatch::new()),
        tx,
    );
    let open = host.open_dataset(open_req(&path, "w2")).expect("open");

    std::fs::rename(&parent, d.join("watched-parent-renamed")).expect("rename the watched directory");

    // Wait for the real watcher's own event first — a stale absolute path after `parent`'s own
    // rename would ALSO fail the pre-check's re-read on the next query issue regardless of the
    // watcher, so a `viewport_query` retry loop here would not isolate this seam at all.
    let event = rx.recv_timeout(WAIT).expect("the real watch signals within the wait (via G)");
    assert_eq!(event.session, open.session);

    let refused = host.viewport_query(viewport_req(open.dataset)).expect_err("refused");
    assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);
}

// -------------------------------------------------------------------------------------------
// W3 (addition 5) — deleting the watched directory ends the generation
// -------------------------------------------------------------------------------------------

/// RECORDED MUTATION: open P without `FILE_SHARE_DELETE` in `engine::watch::open_directory`.
/// Expected failure: `remove_dir_all` below fails with a sharing violation instead of succeeding.
#[test]
fn w3_deleting_the_watched_directory_ends_the_generation() {
    let d = dir("w3");
    let parent = d.join("watched-parent");
    std::fs::create_dir(&parent).expect("create P");
    let path = fixture(&parent);
    let (tx, rx) = session_end_channel();
    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        Arc::new(PlatformWatch::new()),
        tx,
    );
    let open = host.open_dataset(open_req(&path, "w3")).expect("open");

    std::fs::remove_dir_all(&parent).expect("remove the watched directory");

    // As W2: wait for the real event first — a deleted file also fails the pre-check's own re-read
    // regardless of the watcher, so a retry loop would not isolate this seam.
    let event = rx.recv_timeout(WAIT).expect("the real watch signals within the wait");
    assert_eq!(event.session, open.session);

    let refused = host.viewport_query(viewport_req(open.dataset.clone())).expect_err("refused");
    assert_eq!(refused.code, "engine.source_changed", "{}", refused.message);

    // Cleanup, matching the product's own close-then-forget order.
    let _ = host.close_dataset(CloseDatasetRequest { skp: SKP_VERSION.to_string(), dataset: open.dataset });
}
