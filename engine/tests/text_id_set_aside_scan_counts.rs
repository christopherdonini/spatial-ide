// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The whole-column scans of a set-aside open, counted exactly** (ADR-016, Amendment 3).
//!
//! `identity_verification_scans` is a process-wide counter, so a delta read is exact only in a
//! binary whose one test is the only one running. This file therefore holds **one** `#[test]`, and
//! the counts of `text_id_set_aside_session_tier.rs`'s three inputs that need them are read here
//! and nowhere else.

use std::path::PathBuf;

use spatial_engine::dataset::identity_verification_scans;
use spatial_engine::fixture::{write_geoparquet, FixtureSpec, IdentityMode};
use spatial_engine::identity::IdentityDeclaration;
use spatial_engine::{CancelToken, Dataset, EngineError, PoolConfig};

fn write(name: &str, identity: IdentityMode) -> PathBuf {
    let dir =
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/text-id-scan-counts");
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    let spec = FixtureSpec {
        features: 500,
        avg_vertices: 12,
        identity,
        ..Default::default()
    };
    write_geoparquet(&path, &spec).expect("write fixture");
    path
}

fn open_setting_aside(
    path: &std::path::Path,
    declared: Option<IdentityDeclaration>,
) -> Result<Dataset, EngineError> {
    Dataset::open_cancellable_setting_aside_file_id(
        path,
        None,
        declared,
        &CancelToken::new(),
        PoolConfig::default(),
    )
}

#[test]
fn the_set_aside_scan_counts_are_exact() {
    // N-3's input: a repeating integer `id`. It must open on the session tier first, so that a
    // delta of one is the scan of a column that was then set aside and not the scan of a refusal.
    let repeating = write("repeating", IdentityMode::DuplicateIds);
    let before = identity_verification_scans();
    let dataset = open_setting_aside(&repeating, None).expect("the choice opens the file");
    let after = identity_verification_scans();
    assert!(
        dataset.identity().source().is_session_ordinal(),
        "N-3's input opens on the session tier"
    );
    assert_eq!(dataset.identity().set_aside_column(), Some("id"));
    assert_eq!(
        after - before,
        1,
        "the file's own `id` is scanned again, once"
    );

    // N-5's input: no `id` column. Refused before any scan.
    let no_id = write("no-id", IdentityMode::ForeignKeyColumn);
    let before = identity_verification_scans();
    let result = open_setting_aside(&no_id, None);
    let after = identity_verification_scans();
    assert!(
        matches!(result, Err(EngineError::IdentitySetAsideRefused { .. })),
        "refused by name: {:?}",
        result.err()
    );
    assert_eq!(
        after - before,
        0,
        "nothing is scanned for a file with no `id`"
    );

    // N-7's input: a declared column beside the choice. Refused before any scan.
    let beside = write("declared", IdentityMode::StringIdsBesideParcelKey);
    let declaration =
        IdentityDeclaration::new("parcel_key", "integration-test", "2026-11-27T00:00:00Z");
    let before = identity_verification_scans();
    let result = open_setting_aside(&beside, Some(declaration));
    let after = identity_verification_scans();
    assert!(
        matches!(result, Err(EngineError::IdentitySetAsideRefused { .. })),
        "refused by name: {:?}",
        result.err()
    );
    assert_eq!(after - before, 0, "nothing is scanned beside a declaration");
}
