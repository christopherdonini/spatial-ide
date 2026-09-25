// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A shared `SourceWatchArm` for the many kernel integration tests that construct an `SkpHost` but
//! do not exercise watch behaviour at all — `describe_crs_unit.rs`, `skp_admission.rs`,
//! `skp_admission_remediation.rs`, `skp_filter_cancellation.rs`, `typed_terminal_codes.rs`,
//! `session_generation.rs`. Every test that DOES exercise ordering or mapping implements
//! `SourceWatchArm`/`ArmedWatch` itself, per `engine/SOURCE-WATCHER-PREREGISTRATION.md` §2a ("no
//! constructor exists for tests only") — this one file is indifferent plumbing, not a shortcut
//! around that rule.

#![allow(dead_code)]

use std::path::Path;
use std::sync::Arc;

use spatial_engine::{ArmOutcome, SourceWatchArm, WatchSink};

pub struct NoWatchArm;

impl SourceWatchArm for NoWatchArm {
    fn arm(&self, _path: &Path, _sink: WatchSink) -> ArmOutcome {
        ArmOutcome::ChecksOnly { reason: "test fixture: no watch armed".to_string() }
    }
}

pub fn no_watch_arm() -> Arc<dyn SourceWatchArm> {
    Arc::new(NoWatchArm)
}
