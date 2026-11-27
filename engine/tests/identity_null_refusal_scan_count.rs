// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The scan count of a null refusal** (`identity-scan-refuses-a-null-by-name`, its form's §4, T7).
//!
//! `identity_verification_scans` is a process-wide counter, so a delta read is exact only in a
//! binary whose one test is the only one running (the reason `admission_instruments.rs` records).
//! This file therefore holds **one** `#[test]`.

use std::path::PathBuf;

use spatial_engine::dataset::identity_verification_scans;
use spatial_engine::fixture::{
    write_geoparquet, FixtureSpec, IdentityMode, NarrowColumn, NullBearingValues, NullBearingWidth,
};
use spatial_engine::{Dataset, EngineError};

/// **T7.** F-1 opened natively is refused for its null with exactly one guarded verification scan:
/// the null count rides the one statement and never a second guarded call.
///
/// Mutation M-7: the null count read by a second guarded call over the file. Observed at commit 69e363251158: this
/// test fails at its delta assertion, which reads 2 for 1.
#[test]
fn a_null_refusal_issues_exactly_one_verification_scan() {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/identity-null");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join("t7-scan-count.parquet");
    let spec = FixtureSpec {
        features: 100,
        avg_vertices: 8,
        identity: IdentityMode::NullBearing {
            width: NullBearingWidth::UInt64,
            column: NarrowColumn::Id,
            values: NullBearingValues::OneNull,
        },
        ..Default::default()
    };
    write_geoparquet(&path, &spec).expect("write fixture");

    let before = identity_verification_scans();
    let result = Dataset::open(&path);
    let after = identity_verification_scans();
    assert!(
        matches!(result, Err(EngineError::IdentityUnusable { .. })),
        "refused for the null: {:?}",
        result.err()
    );
    assert_eq!(after - before, 1, "one guarded scan, no second pass");
}
