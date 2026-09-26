// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A test-implemented `SourceWatchArm`/`ArmedWatch` pair, shared by the kernel's Tier-1 ordering,
//! emission and session-reference tests (`source_watch_ordering.rs`, `session_end_event.rs`,
//! `session_reference.rs`, `no_generation_in_persisted_artifacts.rs`) — every one of them injects
//! signals at a moment IT chooses, through this plumbing, per
//! `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a ("Tier-1 tests implement the two traits
//! themselves, so no constructor exists for tests only"). This module is the shared *routing*
//! (keyed by source path, since that's what the product `arm()` call receives); which signal fires
//! when is each test's own choice, made by calling `InjectedArm::signal`/`fire_on_next_arm`.

#![allow(dead_code)]

use std::collections::HashMap;
use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};

use spatial_engine::{ArmOutcome, ArmedWatch, SourceWatchArm, WatchSignal, WatchSink};

struct InjectedWatch {
    fired: Arc<AtomicBool>,
}

impl ArmedWatch for InjectedWatch {
    fn resolves_unchanged(&self) -> bool {
        !self.fired.load(Ordering::SeqCst)
    }
}

/// One armed path's live registration: the sink to call, and the flag `InjectedWatch::
/// resolves_unchanged` reads.
struct Armed {
    sink: WatchSink,
    fired: Arc<AtomicBool>,
}

#[derive(Default)]
pub struct InjectedArm {
    armed: Mutex<HashMap<PathBuf, Armed>>,
    /// Paths that arm as `ChecksOnly` instead of `Watching` — K8's case.
    checks_only: Mutex<HashMap<PathBuf, String>>,
    /// A signal queued to fire synchronously, *inside* `arm()`, before it returns — lands in the
    /// caller's pre-admission latch (K6: "a signal between arming and admission").
    fire_on_next_arm: Mutex<HashMap<PathBuf, WatchSignal>>,
}

impl InjectedArm {
    pub fn new() -> Arc<Self> {
        Arc::new(Self::default())
    }

    /// Arm `path` as `ChecksOnly { reason }` instead of `Watching`, on the next (and every
    /// subsequent) `arm()` call for it.
    pub fn mark_checks_only(&self, path: &Path, reason: &str) {
        self.checks_only.lock().unwrap().insert(path.to_path_buf(), reason.to_string());
    }

    /// Queue `signal` to fire synchronously inside the *next* `arm()` call for `path`, before that
    /// call returns — simulating a signal that arrived between arming and admission.
    pub fn fire_on_next_arm(&self, path: &Path, signal: WatchSignal) {
        self.fire_on_next_arm.lock().unwrap().insert(path.to_path_buf(), signal);
    }

    /// Fire `signal` for `path` now — `path` must already be armed (a prior `arm()` call for it
    /// must have returned `Watching`). Panics if not, so a test's own setup mistake is loud.
    pub fn signal(&self, path: &Path, signal: WatchSignal) {
        let armed = self.armed.lock().unwrap();
        let entry = armed
            .get(path)
            .unwrap_or_else(|| panic!("InjectedArm::signal: {} was never armed", path.display()));
        entry.fired.store(true, Ordering::SeqCst);
        (entry.sink)(signal);
    }
}

impl SourceWatchArm for InjectedArm {
    fn arm(&self, path: &Path, sink: WatchSink) -> ArmOutcome {
        if let Some(reason) = self.checks_only.lock().unwrap().get(path) {
            return ArmOutcome::ChecksOnly { reason: reason.clone() };
        }
        let fired = Arc::new(AtomicBool::new(false));
        if let Some(signal) = self.fire_on_next_arm.lock().unwrap().remove(path) {
            fired.store(true, Ordering::SeqCst);
            sink(signal);
        }
        self.armed.lock().unwrap().insert(path.to_path_buf(), Armed { sink, fired: fired.clone() });
        ArmOutcome::Watching(Box::new(InjectedWatch { fired }))
    }
}
