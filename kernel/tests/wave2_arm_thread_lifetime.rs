// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Wave-2 audit reproducer (item C), Linux evidence only.** Proves the kernel-side precondition
//! of a Windows-only mechanism in `engine/src/watch.rs`: `SkpHost::open_dataset` calls
//! `SourceWatchArm::arm` synchronously on its own caller's thread, and the `ArmedWatch` it returns
//! outlives that thread. The product `PlatformWatch::arm` (Windows) issues each handle's FIRST
//! overlapped `ReadDirectoryChangesW` inside `arm`, i.e. on that caller's thread, and only later
//! reads issued after a non-matching completion come from the watch thread. The shell runs
//! `open_dataset` on `tokio::task::spawn_blocking`, whose pool threads exit when idle.
//!
//! This test asserts only what Linux can observe: the arm call's thread, that thread's exit, and
//! the watch still held afterwards. What Windows does to a pending read whose issuing thread has
//! exited is not observable here and is not claimed by this file.


use std::cell::RefCell;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::thread::ThreadId;

use spatial_engine::fixture::{write_geoparquet, FixtureSpec};
use spatial_engine::{ArmOutcome, ArmedWatch, SourceWatchArm, WatchSink};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{CloseDatasetRequest, OpenDatasetRequest, SKP_VERSION};

fn fixture(name: &str) -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/wave2-arm-thread");
    std::fs::create_dir_all(&d).expect("fixture dir");
    let path = d.join(format!("{name}.parquet"));
    write_geoparquet(&path, &FixtureSpec { features: 50, avg_vertices: 6, hole_every: 0, ..Default::default() })
        .expect("write fixture");
    path
}

/// Flips its flag when the thread that owns it exits (thread-local destructors run at thread exit).
struct ExitMarker(Arc<AtomicBool>);
impl Drop for ExitMarker {
    fn drop(&mut self) {
        self.0.store(true, Ordering::SeqCst);
    }
}

thread_local! {
    static EXIT_MARKER: RefCell<Option<ExitMarker>> = const { RefCell::new(None) };
}

struct RecordingWatch {
    dropped: Arc<AtomicBool>,
}
impl ArmedWatch for RecordingWatch {
    fn resolves_unchanged(&self) -> bool {
        true
    }
}
impl Drop for RecordingWatch {
    fn drop(&mut self) {
        self.dropped.store(true, Ordering::SeqCst);
    }
}

/// Records which thread `arm` ran on and plants an exit marker on that thread — standing in for
/// the product arm's first `ReadDirectoryChangesW`, which is issued on the same thread.
struct RecordingArm {
    armed_on: Mutex<Option<ThreadId>>,
    arming_thread_exited: Arc<AtomicBool>,
    watch_dropped: Arc<AtomicBool>,
}
impl SourceWatchArm for RecordingArm {
    fn arm(&self, _path: &Path, _sink: WatchSink) -> ArmOutcome {
        *self.armed_on.lock().unwrap() = Some(std::thread::current().id());
        let flag = self.arming_thread_exited.clone();
        EXIT_MARKER.with(|m| *m.borrow_mut() = Some(ExitMarker(flag)));
        ArmOutcome::Watching(Box::new(RecordingWatch { dropped: self.watch_dropped.clone() }))
    }
}

#[test]
fn the_armed_watch_outlives_the_thread_that_armed_it() {
    let path = fixture("c1");
    let arm = Arc::new(RecordingArm {
        armed_on: Mutex::new(None),
        arming_thread_exited: Arc::new(AtomicBool::new(false)),
        watch_dropped: Arc::new(AtomicBool::new(false)),
    });
    let (tx, _rx) = session_end_channel();
    let host = Arc::new(SkpHost::new(Arc::new(Catalog::new()), StreamRegistry::new(), arm.clone(), tx));

    // Stand-in for the shell's `spawn_blocking` pool thread: open on a thread that then exits.
    let opener = {
        let host = host.clone();
        let path = path.clone();
        std::thread::spawn(move || {
            let id = std::thread::current().id();
            let open = host
                .open_dataset(OpenDatasetRequest {
                    skp: SKP_VERSION.to_string(),
                    path: path.display().to_string(),
                    cancel_key: "wave2-c1".to_string(),
                    crs_assertion: None,
                    identity: None,
                })
                .expect("open");
            (id, open)
        })
    };
    let (opener_id, open) = opener.join().expect("opener thread");

    assert_eq!(
        *arm.armed_on.lock().unwrap(),
        Some(opener_id),
        "SkpHost::open_dataset called SourceWatchArm::arm on its own caller's thread"
    );
    assert!(
        arm.arming_thread_exited.load(Ordering::SeqCst),
        "the thread that ran arm() has exited"
    );
    assert!(
        !arm.watch_dropped.load(Ordering::SeqCst),
        "the ArmedWatch is still held by the host (Watching) after its arming thread exited"
    );
    eprintln!(
        "OBSERVED: arm() ran on the open_dataset caller thread {opener_id:?}; that thread exited; \
         the ArmedWatch is still live in the host"
    );

    host.close_dataset(CloseDatasetRequest { skp: SKP_VERSION.to_string(), dataset: open.dataset })
        .expect("close");
    assert!(arm.watch_dropped.load(Ordering::SeqCst), "close_dataset dropped the watch");
}
