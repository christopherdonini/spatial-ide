// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **A fixture regeneration entry point, outside the measurement harness.**
//!
//! `DECISIONS-PENDING.md`, RULED 2026-09-24 — question round 17, item 6, applying entry 121's
//! option (c). Entry 121 diagnosed a cold-disk failure mode in `scale_pass.rs`'s `generate()`: its
//! 60 s silence ceiling (`SILENCE_GENERATE`) can fire while `write_geoparquet_cancellable`'s
//! `writer.close()` flushes the final partial row group and the footer, with no progress event in
//! that window (the `Watchdog` in `kernel/tests/support/mod.rs`). That firing is a
//! measurement-harness artifact, not a defect in the fixture it produces.
//!
//! This entry point regenerates the same bytes with **no watchdog, no canary, no silence
//! ceiling** — nothing here measures anything, so nothing here can time out on a cold disk. It
//! reuses `support::spec_5gb()` (the exact spec `scale_pass.rs` uses — see that module for the pure
//! move that put it there) and the same writer, `write_geoparquet_cancellable`, so the bytes it
//! produces are the ones `kernel/FIXTURES.md`'s Regenerate row names.
//!
//! `kernel/SCALE-PASS-PREREGISTRATION.md` is **not amended** by this file, and `scale_pass.rs`'s
//! measured behaviour is unchanged — `spec_5gb_matches_the_scale_pass` below pins the shared spec's
//! field values against the exact literals `kernel/FIXTURES.md` documents.

mod support;

use std::path::{Path, PathBuf};

use spatial_engine::fixture::{write_geoparquet_cancellable, FixtureFacts, FixtureSpec};
use spatial_engine::CancelToken;

/// The output path is explicit and required — this entry point never guesses where to write 5 GB.
const OUT_VAR: &str = "SPATIAL_REGEN_OUT";

/// Resolves `SPATIAL_REGEN_OUT` the same way `scale_pass.rs`'s `evidence_dir()` resolves the
/// fixture directory: an absolute path is used as given; a relative path is resolved against the
/// **workspace root** (`CARGO_MANIFEST_DIR`'s parent — `kernel/`'s own manifest dir is `kernel/`
/// itself, and cargo's test working directory is the crate root, not the workspace root), never
/// left to resolve against wherever the test binary happens to run from.
fn resolve_out_path(raw: &str) -> PathBuf {
    let p = PathBuf::from(raw);
    if p.is_absolute() {
        p
    } else {
        PathBuf::from(env!("CARGO_MANIFEST_DIR")).parent().unwrap().join(p)
    }
}

/// The entry point itself: refuses to overwrite an existing file, then writes `spec` to `path` with
/// no watchdog, no canary and no cancellation source. Shared by the `#[ignore]`d 5 GB test and the
/// cheap refusal test below, so the refusal test proves this function's own behaviour rather than a
/// separately maintained copy of its guard.
fn regenerate(path: &Path, spec: &FixtureSpec) -> FixtureFacts {
    // RECORDED MUTATION: removing this `assert!` (or the `path.exists()` check) makes
    // `refuses_to_overwrite_an_existing_output_path` below fail, because the call would then run to
    // completion (overwriting the pre-created file) instead of panicking with this message.
    assert!(
        !path.exists(),
        "{} already exists. This entry point generates once; remove the file yourself to \
         regenerate — deliberately manual, because it is 5 GB.",
        path.display()
    );
    let cancel = CancelToken::new();
    write_geoparquet_cancellable(path, spec, &cancel, None).expect("fixture generation")
}

/// Regenerates the 5 GB fixture at an explicit output path, outside the measurement harness.
///
/// ```bash
/// SPATIAL_REGEN_OUT=/path/to/parcels-5gb.parquet \
///   cargo test --release -p spatial-kernel --test regenerate_fixture -- --ignored --exact \
///   regenerate_parcels_5gb_fixture --nocapture
/// ```
///
/// Refuses to overwrite an existing file, exactly as `scale_pass.rs`'s `generate()` does — this is
/// a manual regeneration entry point, not a silent replace.
#[ignore = "writes ~5 GB to an explicit path; release-only recommended, several minutes"]
#[test]
fn regenerate_parcels_5gb_fixture() {
    let out = std::env::var(OUT_VAR)
        .unwrap_or_else(|_| panic!("set {OUT_VAR} to the output path before running this test"));
    let path = resolve_out_path(&out);
    let facts = regenerate(&path, &support::spec_5gb());
    println!(
        "[regenerate] {} features, {} B, wrote {}",
        facts.features,
        facts.bytes,
        path.display()
    );
}

/// The refusal path, exercised cheaply (no 5 GB write) and against the real entry point: a
/// pre-created file at the target path makes `regenerate` (the same function
/// `regenerate_parcels_5gb_fixture` calls above) refuse rather than overwrite, using a tiny spec so
/// the call costs nothing and needs no `--ignored`.
///
/// RECORDED MUTATION: deleting `regenerate`'s `assert!(!path.exists(), ...)` guard makes this test
/// fail, because `should_panic`'s expected message would never be produced.
#[test]
#[should_panic(expected = "already exists")]
fn refuses_to_overwrite_an_existing_output_path() {
    let dir = std::env::temp_dir().join("spatial-regen-fixture-refusal-test");
    std::fs::create_dir_all(&dir).expect("create the scratch dir");
    let path = dir.join("placeholder.parquet");
    std::fs::write(&path, b"not a real fixture").expect("create the placeholder file");

    let tiny = FixtureSpec { features: 1, ..support::spec_5gb() };
    // `write_geoparquet_cancellable` is never reached when this fires, which is the property under
    // test: the refusal happens before any write is attempted.
    regenerate(&path, &tiny);
}

/// **Pins the path resolution** `resolve_out_path` performs: a relative `SPATIAL_REGEN_OUT` must
/// land under the workspace root (matching `scale_pass.rs`'s `evidence_dir()`), not under `kernel/`
/// (cargo's per-crate test working directory), and an absolute path must be used unchanged.
///
/// RECORDED MUTATION: changing `resolve_out_path` to join the relative input onto
/// `CARGO_MANIFEST_DIR` directly (dropping `.parent()`) makes this test fail, because the resolved
/// path would then land under `kernel/` instead of the workspace root.
#[test]
fn relative_out_path_resolves_under_the_workspace_root_not_kernel() {
    let manifest_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let workspace_root = manifest_dir.parent().unwrap().to_path_buf();

    let relative = "target/slice-evidence/scale-pass/parcels-5gb.parquet";
    let resolved = resolve_out_path(relative);
    assert_eq!(
        resolved,
        workspace_root.join(relative),
        "a relative SPATIAL_REGEN_OUT must resolve under the workspace root, not kernel/"
    );
    assert!(
        !resolved.starts_with(&manifest_dir),
        "the resolved path must not land under kernel/ itself: {}",
        resolved.display()
    );

    let absolute = if cfg!(windows) { "C:/spatial-ide-scratch/x.parquet" } else { "/tmp/x.parquet" };
    assert_eq!(
        resolve_out_path(absolute),
        PathBuf::from(absolute),
        "an absolute SPATIAL_REGEN_OUT must be used as given"
    );
}

/// **Pins the shared spec against `kernel/FIXTURES.md`'s documented "Exact generation spec"
/// table**, so a future edit to `support::spec_5gb()` (used by both this entry point and
/// `scale_pass.rs`) cannot silently drift from what the scale pass measured.
///
/// RECORDED MUTATION: changing any literal in `support::spec_5gb()` (for example
/// `features: FIVE_GB_FEATURES` to a different value) makes this test fail, because the equality
/// assertion below is against the exact literals reproduced here, independent of the shared
/// constants.
#[test]
fn spec_5gb_matches_the_scale_pass() {
    use spatial_engine::fixture::{
        AttributeMode, CoordinateDomain, CrsMode, IdentityMode, LicenseMode, StatisticsMode,
    };

    let expected = FixtureSpec {
        features: 3_300_000,
        avg_vertices: 100,
        hole_every: 7,
        seed: 0x5EED_2056_0000_0005,
        crs_mode: CrsMode::DeclaredLv95,
        with_covering_bbox: true,
        chunk: 8_192,
        row_group_rows: 8_192,
        identity: IdentityMode::NativeUnique,
        attributes: AttributeMode::None,
        license: LicenseMode::DeclaredBySource,
        domain: CoordinateDomain::Lv95Metres,
        with_geo_bbox: false,
        statistics: StatisticsMode::WriterDefault,
        covering_names_absent_column: false,
        geo_version: "1.1.0".to_string(),
    };

    assert_eq!(
        support::spec_5gb(),
        expected,
        "the shared spec `support::spec_5gb()` no longer matches kernel/FIXTURES.md's documented \
         Exact generation spec — scale_pass.rs and this entry point would then produce different \
         bytes than the table records"
    );
}
