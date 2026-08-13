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

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};

fn dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/manual-walkthrough");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

/// The happy-path fixture: `docs/07`'s own "100k" figure, an ordinary admitted file in every
/// respect (declared LV95 CRS, a unique native `id` column, a covering bbox for the viewport
/// filter) — nothing about it should ever surface a refusal.
///
/// `avg_vertices: 18`, not the `24` this spec originally carried. The 2026-08-13 instrumented
/// session (entry 0, `DECISIONS-PENDING.md`) diagnosed the `24` spec's real ring-vertex total as
/// over the shell's declared `MAX_RESIDENT_VERTICES = 2_000_000` ceiling, by construction — so the
/// happy path tripped a designed ceiling refusal on every first load instead of demonstrating one.
/// `18` is the option-(a) fix: the closest integer `avg_vertices` (`19` measures over) that keeps
/// this fixture's true total under the hard-asserted bound below, at the same `features: 100_000`
/// `docs/07` and the walkthrough/E2E both name — the row count is load-bearing and is not tuned.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_100k_happy_path_fixture() {
    let path = dir().join("100k-happy-path.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec { features: 100_000, avg_vertices: 18, hole_every: 7, ..Default::default() },
    )
    .expect("write the 100k happy-path fixture");
    println!(
        "wrote {} ({} features, {} vertices, {} bytes)",
        path.display(),
        facts.features,
        facts.vertices,
        facts.bytes
    );
    // Hard-asserted, not merely commented: the shell's declared MAX_RESIDENT_VERTICES ceiling is
    // 2_000_000 (frontends/shell/src/canvas/limits.ts). 1_950_000 leaves a 50k safety margin below
    // it, so a future generator edit that drifts this fixture's true total back toward — or over —
    // the ceiling fails *this* test with a clear cause, instead of silently re-breaking the
    // walkthrough's happy path the way the 2026-08-13 diagnosis found it broken (entry 0,
    // `DECISIONS-PENDING.md`: the `24`-spec fixture's TRUE total is 2,508,699 vertices, 25.4% over
    // the ceiling -- the same spec `generate_the_over_ceiling_refusing_fixture` below now measures
    // directly, the one and only metric that number ever named. A separate, smaller figure --
    // 2,012,436 -- circulated in early diagnosis (and an earlier version of this comment) as if it
    // were a second measurement of this fixture's total; the run ledger
    // (`e2e/out/regression-render-trace-1786582131720.json`) resolved it as a TRUNCATED PARTIAL SUM
    // captured at the shell's own refusal moment on a since-cancelled stream (1,961,249 already
    // resident + 51,187 attempted in the batch that tripped the ceiling), never a file total. This
    // 50k margin is real, but the true headroom below the ceiling this `18`-spec fixture actually
    // carries is 114,870 vertices (5.7%, measured at 1,885,130) -- thin enough that raising
    // `avg_vertices` again without re-running this assert re-ships the exact defect entry 0 found.
    assert!(
        facts.vertices <= 1_950_000,
        "happy-path fixture must stay under the shell's 2_000_000 MAX_RESIDENT_VERTICES ceiling \
         with a 50k safety margin (got {} vertices) — see the 2026-08-13 entry-0 diagnosis in \
         DECISIONS-PENDING.md",
        facts.vertices
    );
}

/// The deliberate over-ceiling acceptance fixture, per the human's 2026-08-13 entry-0 decision
/// (option (a), `DECISIONS-PENDING.md`): the declared-ceiling refusal is designed behavior
/// (`limits.ts`: refuse, never silently evict), not a bug, and it deserves its own acceptance step
/// rather than photobombing the happy path above.
///
/// **Exactly the old happy-path spec** (`features: 100_000, avg_vertices: 24, hole_every: 7`) —
/// its true total is deliberately kept rather than tuned further over: it is a realistic shape of
/// the failure, most features admitted and rendering before the refusal fires part-way through the
/// stream, the same "batches render, pixels look right until the refusal" symptom the 2026-08-13
/// diagnosis found. This spec's true total is 2,508,699 vertices — 25.4% over the 2_000_000
/// ceiling, the one and only metric that number ever named (client-decoded vertex count and this
/// generator's own `facts.vertices` agree bit-identically — `decodeBatch` sums ring points with no
/// closure dedup, so there is no separate "writer" vs. "client" figure to reconcile here). An
/// earlier diagnosis conflated this true total with 2,012,436 — a *different* number, a truncated
/// partial sum this exact spec's own stream carried at the moment the shell's ceiling refused and
/// cancelled it (1,961,249 already resident + 51,187 attempted in the refusing batch), read back
/// from the run ledger (`e2e/out/regression-render-trace-1786582131720.json`) and confirmed against
/// this test's own printed facts line — not a second measurement of the file's total, and not
/// generator drift. At this fixture's true total, the shell's own D2 acceptance step refuses at
/// 78,191 of 100,000 features delivered (78.19%) before the ceiling trips. The hard assert below is
/// what this fixture's acceptance role actually depends on.
/// Rider 1 of that decision requires the refusal be unmissable — a persistent rendered/total
/// status, not just a dismissible banner — which this fixture is what the walkthrough/E2E
/// acceptance step for that requirement opens.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_over_ceiling_refusing_fixture() {
    let path = dir().join("over-ceiling-refused.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec { features: 100_000, avg_vertices: 24, hole_every: 7, ..Default::default() },
    )
    .expect("write the over-ceiling refusing fixture");
    println!(
        "wrote {} ({} features, {} vertices, {} bytes)",
        path.display(),
        facts.features,
        facts.vertices,
        facts.bytes
    );
    // Hard-asserted: this fixture only does its job — exercising the declared-ceiling refusal —
    // if its true total is actually over the shell's 2_000_000 MAX_RESIDENT_VERTICES ceiling.
    assert!(
        facts.vertices > 2_000_000,
        "over-ceiling fixture must exceed the shell's 2_000_000 MAX_RESIDENT_VERTICES ceiling to \
         exercise the refusal it exists for (got {} vertices)",
        facts.vertices
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

/// The filter fixture (`NEXT-CUT.md` sql-filter P5): a dataset where a predicate meaningfully
/// partitions rows, opened through the same real admission path
/// (`window.__SPATIAL_E2E__.openPath`) `frontends/shell/e2e/filter.mjs`'s FILTER'/REFUSED' steps
/// use to exercise the shell's filter client wrapper end to end -- P0-P4 already cover admission and
/// composition themselves with unit/integration tests; this file exists only to give the E2E spec a
/// real GeoParquet file to open.
///
/// `AttributeMode::CategoricalZone` writes a nullable `zone` text column, four declared values
/// (`engine::fixture::ZONE_VALUES`, `zone = 'residential'` is the E2E spec's predicate) plus NULL --
/// derived from `zone_for(seed, id)`, a pure hash of the feature id, so the admitted subset is
/// scattered across the whole grid (`parcel()`'s own placement is one feature per grid cell, `id %
/// cols` / `id / cols`) rather than clustered in one screen region -- a working filter should show
/// roughly a fifth of the unfiltered pixel coverage, not just "fewer pixels somewhere".
#[test]
#[ignore = "generates a real file for the E2E filter spec; not part of the default suite"]
fn generate_the_filter_fixture() {
    let path = dir().join("filter-zoned.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 2_000,
            avg_vertices: 12,
            hole_every: 0,
            attributes: AttributeMode::CategoricalZone,
            ..Default::default()
        },
    )
    .expect("write the filter fixture");
    println!(
        "wrote {} ({} features, {} vertices, zone_counts={:?}, zone_nulls={})",
        path.display(),
        facts.features,
        facts.vertices,
        facts.zone_counts,
        facts.zone_nulls
    );
    // Counted while writing, never predicted (`FixtureFacts::zone_counts`'s own doc comment) --
    // guards against a vacuous partition: every declared value present, at least one NULL, and the
    // spec's own predicate (`zone = 'residential'`, `ZONE_VALUES[0]`) excluding real rows.
    assert!(
        facts.zone_counts.iter().all(|&c| c > 0),
        "every ZONE_VALUES entry must appear at least once (got {:?})",
        facts.zone_counts
    );
    assert!(facts.zone_nulls > 0, "at least one NULL zone must appear (got 0)");
    assert!(
        facts.zone_counts[0] > 0 && facts.zone_counts[0] < facts.features,
        "the 'residential' predicate must admit some rows but exclude others (admits {} of {})",
        facts.zone_counts[0],
        facts.features
    );
}
