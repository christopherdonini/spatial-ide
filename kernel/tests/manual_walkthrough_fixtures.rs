// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **Generates the real GeoParquet files `frontends/shell/MANUAL-WALKTHROUGH.md` names.**
//!
//! `frontends/shell` cut 1 has no desktop UI automation (tauri-driver/WebDriver): the file picker
//! is a native OS dialog living outside the WebView2 DOM, which WebDriver cannot click into, and
//! standing up that infrastructure before this cut has a real user is deferred (see the
//! walkthrough doc's own header). The two acceptance-list items that need an actual click-through
//! — the happy path and a refusing file's typed refusal — are verified by a human operator running
//! the numbered steps in that doc instead. These tests exist so the exact files that doc points at
//! are reproducible from the generator, not hand-crafted and forgotten (the same "generator
//! committed, file not" discipline every other fixture in this repository already follows).
//!
//! Run explicitly, not part of the default suite: `cargo test -p spatial-kernel --test
//! manual_walkthrough_fixtures -- --ignored --nocapture`.

use std::path::PathBuf;

use spatial_engine::fixture::{write_geoparquet, CrsMode, FixtureSpec, IdentityMode};

fn dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/manual-walkthrough");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

/// The happy-path fixture: `docs/07`'s own "100k" figure, an ordinary admitted file in every
/// respect (declared LV95 CRS, a unique native `id` column, a covering bbox for the viewport
/// filter) — nothing about it should ever surface a refusal.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_100k_happy_path_fixture() {
    let path = dir().join("100k-happy-path.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec { features: 100_000, avg_vertices: 24, hole_every: 7, ..Default::default() },
    )
    .expect("write the 100k happy-path fixture");
    println!(
        "wrote {} ({} features, {} vertices, {} bytes)",
        path.display(),
        facts.features,
        facts.vertices,
        facts.bytes
    );
}

/// The "no CRS" refusing file the walkthrough's refusal step opens: GeoParquet's `crs` key is
/// absent entirely (`CrsMode::AbsentKey`), which this engine refuses rather than defaulting to
/// OGC:CRS84 (`EngineError::CrsUndeclared`, SKP code `engine.crs_undeclared`).
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_no_crs_refusing_fixture() {
    let path = dir().join("no-crs-refused.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec { features: 100, avg_vertices: 12, crs_mode: CrsMode::AbsentKey, ..Default::default() },
    )
    .expect("write the no-CRS refusing fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The "missing identity" refusing file: the shape most real GeoParquet has per ADR-016's own
/// Context — a unique key under a different name (`parcel_key`) and **no `id` column at all**
/// (`IdentityMode::ForeignKeyColumn`), refused as `EngineError::IdentityUnusable` (SKP code
/// `engine.identity_unusable`) until a mapping is declared — a cut-2 remediation this build does
/// not offer.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_missing_identity_refusing_fixture() {
    let path = dir().join("missing-identity-refused.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 100,
            avg_vertices: 12,
            identity: IdentityMode::ForeignKeyColumn,
            ..Default::default()
        },
    )
    .expect("write the missing-identity refusing fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}
