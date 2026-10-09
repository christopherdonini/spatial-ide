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

use spatial_engine::fixture::{
    write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode,
};

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
        &FixtureSpec {
            features: 100_000,
            avg_vertices: 18,
            hole_every: 7,
            ..Default::default()
        },
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
        &FixtureSpec {
            features: 100_000,
            avg_vertices: 24,
            hole_every: 7,
            ..Default::default()
        },
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
/// explicitly `null` (`CrsMode::ExplicitNull`) — the spec's own "no CRS" declaration, refused
/// (`EngineError::CrsUndeclared`, SKP code `engine.crs_undeclared`) unless the caller asserts
/// (`engine/ADMISSION-PREREGISTRATION.md` §4 row F-3; §2b R-C3, "unchanged from today").
///
/// **Re-aimed, not merely fixed.** This generator used to write `CrsMode::AbsentKey`. Since Brief
/// A's P1/P2 (merged in PR #44) an *absent* `crs` key is GeoParquet's own OGC:CRS84 format default
/// (§2b R-C2; `engine/src/fixture.rs`'s own `CrsMode::AbsentKey` doc comment), which this file's
/// metre-domain coordinates would now *contradict* rather than declare nothing —
/// `EngineError::FormatDefaultContradicted`, SKP code `engine.format_default_contradicted` (§4 row
/// F-2), a different refusal than the one this walkthrough step and `regression.mjs`'s `B2'/B3'`
/// exist to exercise. Moving to `CrsMode::ExplicitNull` (same filename, so the walkthrough's copy
/// line and the B2/B3 steps keep pointing at this file) keeps it producing the refusal they were
/// written to show. The absent-key shape now has its own fixture,
/// `generate_the_absent_crs_contradicted_fixture` below (`absent-crs-contradicted.parquet`).
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_no_crs_refusing_fixture() {
    let path = dir().join("no-crs-refused.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 100,
            avg_vertices: 12,
            crs_mode: CrsMode::ExplicitNull,
            ..Default::default()
        },
    )
    .expect("write the no-CRS refusing fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The "absent CRS key, contradicted" file (`engine/ADMISSION-PREREGISTRATION.md` §4 row F-2):
/// GeoParquet's `crs` key is missing entirely (`CrsMode::AbsentKey`), in the metre-domain
/// coordinates every other fixture in this file uses (outside ±180/±90). An absent key admits under
/// the format's own OGC:CRS84 default since Brief A's P1/P2 (§2b R-C2) — but this file's own bbox
/// lies outside the domain that default assumes, so the sanity check convicts it (§2c R-S2):
/// `EngineError::FormatDefaultContradicted`, SKP code `engine.format_default_contradicted`.
/// `with_geo_bbox: true` puts the conviction at sanity level `metadata`, read straight from the
/// `geo` key's own `bbox` member (no data read), the same construction
/// `engine/tests/admission_format_semantics.rs`'s own F-2 test uses.
///
/// Unlike `no-crs-refused.parquet` (F-3, explicit `"crs": null`), no CRS-assertion remediation
/// form is asserted to render for this refusal here — `AdmissionPanel.tsx`'s `formFamilyForCode`
/// starts a form family only for `engine.crs_undeclared`/`engine.identity_unusable`, not for this
/// code, so whether this refusal offers a remediation form is a shell-surface question left to
/// Brief A's later parts, not this fixture's own claim.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_absent_crs_contradicted_fixture() {
    let path = dir().join("absent-crs-contradicted.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 100,
            avg_vertices: 12,
            crs_mode: CrsMode::AbsentKey,
            with_geo_bbox: true,
            ..Default::default()
        },
    )
    .expect("write the absent-key format-default-contradicted fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The multipolygon file for the shell E2E's MP' step (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md`
/// section 3, fixture F-1; ADR-034): LV95, declared `["MultiPolygon"]`, three MultiPolygon rows of
/// three, one and two parts (the second part of row 0 with a hole), no covering. It is what
/// `spatial_engine::fixture::multipolygon_f1_rows` writes, so the shell E2E opens the same shape the
/// engine's own tests and the committed batches (BF-1) carry. Admitted as `geoarrow.multipolygon`;
/// publishing it is refused by name (ADR-034 Decision 10).
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_multipolygon_f1_fixture() {
    use spatial_engine::fixture::{multipolygon_f1_rows, DeclaredTypes, GeometryMode, E_LO, N_LO};
    let path = dir().join("multipolygon-f1.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(multipolygon_f1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["MultiPolygon"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the multipolygon F-1 fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The points file for the shell E2E's PT' step and Part P (`engine/GEOMETRY-POINTS-PREREGISTRATION.md`
/// section 3, fixture P-1 with its covering; ADR-034): LV95, declared `["Point"]`, six Point rows
/// from `spatial_engine::fixture::point_p1_rows`, **with a covering**, so a viewport query reaches
/// the canvas (a file with no covering meets `engine.no_covering_bbox` there). Admitted as
/// `geoarrow.point`; publishing it is refused by name (ADR-034 Decision 10).
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_point_p1_fixture() {
    use spatial_engine::fixture::{
        point_p1_rows_with_bounds, DeclaredTypes, GeometryMode, E_LO, N_LO,
    };
    let path = dir().join("point-p1.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::RowsWithBounds(point_p1_rows_with_bounds([E_LO, N_LO], 10.0)),
            with_covering_bbox: true,
            declared_types: DeclaredTypes::Json(r#"["Point"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the point P-1 fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The pile-of-points file for Part P's row P2 (`engine/GEOMETRY-POINTS-PREREGISTRATION.md`
/// Amendment 3, item 7): LV95, declared `["Point"]`, with a covering. It holds P-1's six points and a
/// pile of five more, each `d` x 1 cm east and north of P-1's second point (`d` = 1 to 5), so the
/// pile's own spread is at most about 7 cm and the extent is P-1's own. With eleven points over that
/// extent (about 20.6 m x 9.9 m), `averagePointSpacing` is about 4.30 m, so the 9 px refusal starts
/// below about 2.09 px per metre (zoom 1.06), and above it the pile's five 4 px symbols overlap (a
/// spread of about 0.07 m x 2^zoom px, under 8 px up to zoom 6.8) while the average spacing stays at or
/// above 9 px. No far-apart point is needed.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_point_pile_fixture() {
    use spatial_engine::fixture::{
        encode_point, point_p1, DeclaredTypes, GeometryMode, E_LO, N_LO,
    };
    let mut points = point_p1([E_LO, N_LO], 10.0);
    let base = points[1];
    for d in 1..=5u32 {
        let step = f64::from(d) * 0.01;
        points.push([base[0] + step, base[1] + step]);
    }
    let rows = points
        .iter()
        .map(|p| (encode_point(p[0], p[1]), [p[0], p[1], p[0], p[1]]))
        .collect();
    let path = dir().join("point-pile.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::RowsWithBounds(rows),
            with_covering_bbox: true,
            declared_types: DeclaredTypes::Json(r#"["Point"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the point pile fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The LineString-declared file of L-9, for Part T's T6 (`engine/GEOMETRY-LINES-PREREGISTRATION.md`
/// section 3): LV95, `geometry_types` declares `["LineString"]`. Since the lines cut the open is
/// admitted, as `geoarrow.linestring`, and the stream stops at row 0 with `engine.wkb`, because the
/// rows are P-1's points (WKB type 1) and a linestring open reads WKB type 2 only. (Before the lines
/// cut the open was refused with the sighted `engine.geo_metadata` template.)
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_declared_linestring_fixture() {
    use spatial_engine::fixture::{point_p1_rows, DeclaredTypes, GeometryMode, E_LO, N_LO};
    let path = dir().join("declared-linestring.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(point_p1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["LineString"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the declared-LineString fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The Polygon-and-Point file for Part P's wording step (P7): LV95, `geometry_types` declares
/// `["Polygon", "Point"]`, and the open is refused as `engine.geo_metadata` with the mixed-kinds
/// `[P6 placeholder]` detail (ruled in question round 62, item 2). The rows are P-1's points: the
/// refusal is at the declaration and never reaches a row.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_declared_polygon_and_point_fixture() {
    use spatial_engine::fixture::{point_p1_rows, DeclaredTypes, GeometryMode, E_LO, N_LO};
    let path = dir().join("declared-polygon-and-point.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(point_p1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["Polygon","Point"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the declared-Polygon-and-Point fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The lines file for the shell E2E's LN' step and Part T's T1, T2, T4 and T5
/// (`engine/GEOMETRY-LINES-PREREGISTRATION.md` section 3, fixture L-1 with its covering; ADR-034):
/// LV95, declared `["LineString"]`, five LineString rows from `spatial_engine::fixture::line_l1_rows_with_bounds`,
/// rows 1 and 3 crossing, **with a covering**, so a viewport query reaches the canvas (a file with
/// no covering meets `engine.no_covering_bbox` there). Admitted as `geoarrow.linestring`;
/// publishing it is refused by name (ADR-034 Decision 10).
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_line_l1_fixture() {
    use spatial_engine::fixture::{
        line_l1_rows_with_bounds, DeclaredTypes, GeometryMode, E_LO, N_LO,
    };
    let path = dir().join("line-l1.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::RowsWithBounds(line_l1_rows_with_bounds([E_LO, N_LO], 10.0)),
            with_covering_bbox: true,
            declared_types: DeclaredTypes::Json(r#"["LineString"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the line L-1 fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The multilinestring file for Part T's T3
/// (`engine/GEOMETRY-LINES-PREREGISTRATION.md` section 3, fixture ML-1 with its covering): LV95,
/// declared `["MultiLineString"]`, three rows of 2, 1 and 3 parts from
/// `spatial_engine::fixture::multilinestring_ml1_rows_with_bounds`, **with a covering**. Admitted as
/// `geoarrow.multilinestring`; publishing it is refused by name.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_multilinestring_ml1_fixture() {
    use spatial_engine::fixture::{
        multilinestring_ml1_rows_with_bounds, DeclaredTypes, GeometryMode, E_LO, N_LO,
    };
    let path = dir().join("multilinestring-ml1.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::RowsWithBounds(multilinestring_ml1_rows_with_bounds(
                [E_LO, N_LO],
                10.0,
            )),
            with_covering_bbox: true,
            declared_types: DeclaredTypes::Json(r#"["MultiLineString"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the multilinestring ML-1 fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The GeometryCollection-declared file for Part T's T6 (`engine/GEOMETRY-LINES-PREREGISTRATION.md`
/// section 3, L-6): LV95, `geometry_types` declares `["GeometryCollection"]`, and the open is
/// refused as `engine.geo_metadata` with the sighted template, whose readable-set clause renders
/// five types. The rows are P-1's points: the refusal is at the declaration and never reaches a row.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_declared_geometrycollection_fixture() {
    use spatial_engine::fixture::{point_p1_rows, DeclaredTypes, GeometryMode, E_LO, N_LO};
    let path = dir().join("declared-geometrycollection.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(point_p1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["GeometryCollection"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the declared-GeometryCollection fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The Polygon-and-LineString file for Part T's T6 (`engine/GEOMETRY-LINES-PREREGISTRATION.md`
/// section 3, L-3): LV95, `geometry_types` declares `["Polygon", "LineString"]`, and the open is
/// refused as `engine.geo_metadata` with the mixed-kinds `[P6 placeholder]` detail, its span naming
/// the kinds present (polygonal and line; question round 63, OPEN-2). The rows are L-1's lines: the
/// refusal is at the declaration and never reaches a row.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_declared_polygon_and_linestring_fixture() {
    use spatial_engine::fixture::{line_l1_rows, DeclaredTypes, GeometryMode, E_LO, N_LO};
    let path = dir().join("declared-polygon-and-linestring.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(line_l1_rows([E_LO, N_LO], 10.0)),
            with_covering_bbox: false,
            declared_types: DeclaredTypes::Json(r#"["Polygon","LineString"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the declared-Polygon-and-LineString fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// **[C-1]** F-1 with a covering, for Part S's S2 note: the same three
/// MultiPolygon rows as `generate_the_multipolygon_f1_fixture` (LV95, declared `["MultiPolygon"]`),
/// each with the covering bounds of its own parts, so a viewport query reaches the canvas. F-1's own
/// generator writes no covering and meets `engine.no_covering_bbox` there (Amendment 1, item 6 of
/// the points form). Admitted as `geoarrow.multipolygon`; publishing it is refused by name.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_multipolygon_f1_with_covering_fixture() {
    use spatial_engine::fixture::{
        encode_multipolygon, multipolygon_f1, DeclaredTypes, GeometryMode, E_LO, N_LO,
    };
    let rows = multipolygon_f1([E_LO, N_LO], 10.0)
        .iter()
        .map(|parts| {
            let (mut xmin, mut ymin) = (f64::INFINITY, f64::INFINITY);
            let (mut xmax, mut ymax) = (f64::NEG_INFINITY, f64::NEG_INFINITY);
            for p in parts.iter().flatten().flatten() {
                xmin = xmin.min(p[0]);
                ymin = ymin.min(p[1]);
                xmax = xmax.max(p[0]);
                ymax = ymax.max(p[1]);
            }
            (encode_multipolygon(parts), [xmin, ymin, xmax, ymax])
        })
        .collect();
    let path = dir().join("multipolygon-f1-with-covering.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::RowsWithBounds(rows),
            with_covering_bbox: true,
            declared_types: DeclaredTypes::Json(r#"["MultiPolygon"]"#.to_string()),
            ..Default::default()
        },
    )
    .expect("write the multipolygon F-1 with-covering fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The "no id column" file: the shape most real GeoParquet has per ADR-016's own Context — a unique
/// key under a different name (`parcel_key`) and **no `id` column at all**
/// (`IdentityMode::ForeignKeyColumn`). A single file of this shape opens on the session tier
/// (R-I3, ADR-016 Amendment 1). Renamed from `missing-identity-refused.parquet`; bytes unchanged.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_no_id_column_fixture() {
    let path = dir().join("no-id-column.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 100,
            avg_vertices: 12,
            identity: IdentityMode::ForeignKeyColumn,
            ..Default::default()
        },
    )
    .expect("write the no-id-column fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The "string id" refusing file: a text `id` (`key-{n}`) beside a unique `parcel_key`
/// (`IdentityMode::StringIdsBesideParcelKey`). A plain open still refuses as
/// `engine.identity_unusable` (the `id` type cannot serve) and offers `parcel_key` to declare.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_string_id_refusing_fixture() {
    let path = dir().join("string-id-refused.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 100,
            avg_vertices: 12,
            identity: IdentityMode::StringIdsBesideParcelKey,
            ..Default::default()
        },
    )
    .expect("write the string-id refusing fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The "duplicate id" refusing file (`NEXT-CUT.md` admission-remediation cut, P5's `DUPKEY'` E2E
/// step and Part I's I6): a native `id` column that repeats a constant value
/// (`IdentityMode::DuplicateIds` — an existing engine fixture mode, reused rather than added;
/// `kernel/tests/skp_admission_remediation.rs`'s own P1 test already proved this combination
/// refuses). A **plain** open already refuses here — `engine::dataset::admit_identity` runs the
/// uniqueness scan for the native `id` column too (`engine/src/identity.rs`'s own module doc: "the
/// uniqueness scan ... runs for a native column too"), so this file needs no identity declaration to
/// trip the refusal it exists for; declaring the SAME `id` column again (the E2E step's own "declare
/// the duplicate-id column") re-runs the identical uniqueness scan and re-refuses identically — a
/// genuine, typed uniqueness refusal, not a missing-column one, with the remediation form still
/// reachable afterward.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_dupkey_refusing_fixture() {
    let path = dir().join("dupkey-refused.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 100,
            avg_vertices: 12,
            identity: IdentityMode::DuplicateIds,
            ..Default::default()
        },
    )
    .expect("write the duplicate-id refusing fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The "no CRS, no id" file (`NEXT-CUT.md` admission-remediation cut, P5's `BOTHNEEDED'` E2E step
/// (a)): an explicit `"crs": null` (`CrsMode::ExplicitNull`) **and** no `id` column, only
/// `parcel_key` (`IdentityMode::ForeignKeyColumn`, the mode `no-id-column.parquet` uses). A plain
/// open refuses CRS first (`engine::dataset::open_inner` admits CRS before identity); with the CRS
/// asserted it admits on the session tier (R-I3, ADR-016 Amendment 1). Renamed from
/// `bothneeded-refused.parquet`, which stopped needing both; the both-needed loop (CRS, then
/// identity, then the combined request) is `no-crs-string-id-refused.parquet`'s.
///
/// **Re-aimed, same ruling and same class as `no-crs-refused.parquet`
/// (`engine/ADMISSION-PREREGISTRATION.md` §4 F-2/F-3).** This generator used to write
/// `CrsMode::AbsentKey` in the metre domain — since Brief A's P1/P2 an absent key admits under
/// GeoParquet's own OGC:CRS84 format default and this file's metre-domain coordinates would
/// contradict it (`engine.format_default_contradicted`, F-2), not the `engine.crs_undeclared`
/// refusal `frontends/shell/e2e/admission-remediation.mjs`'s `stepBothNeeded` expects first and
/// this fixture's own "both remediations needed" intent depends on (a CRS-assertion form has to
/// render so the carried-claim flow has something to assert through). Moving to
/// `CrsMode::ExplicitNull` (F-3, unchanged refusal, same filename) keeps both the code
/// `stepBothNeeded` checks and the form it requires correct — no change needed there.
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_no_crs_no_id_refusing_fixture() {
    let path = dir().join("no-crs-no-id-refused.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 100,
            avg_vertices: 12,
            crs_mode: CrsMode::ExplicitNull,
            identity: IdentityMode::ForeignKeyColumn,
            ..Default::default()
        },
    )
    .expect("write the no-crs-no-id refusing fixture");
    println!("wrote {} ({} features)", path.display(), facts.features);
}

/// The "both remediations needed" file: an explicit `"crs": null` and a text `id` beside a unique
/// `parcel_key` (`IdentityMode::StringIdsBesideParcelKey`). A plain open refuses CRS; the CRS alone
/// then refuses identity (the type); only a request carrying BOTH admits (MF2's loop case).
#[test]
#[ignore = "generates a real file for the manual walkthrough; not part of the default suite"]
fn generate_the_no_crs_string_id_refusing_fixture() {
    let path = dir().join("no-crs-string-id-refused.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: 100,
            avg_vertices: 12,
            crs_mode: CrsMode::ExplicitNull,
            identity: IdentityMode::StringIdsBesideParcelKey,
            ..Default::default()
        },
    )
    .expect("write the no-crs-string-id refusing fixture");
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
    assert!(
        facts.zone_nulls > 0,
        "at least one NULL zone must appear (got 0)"
    );
    assert!(
        facts.zone_counts[0] > 0 && facts.zone_counts[0] < facts.features,
        "the 'residential' predicate must admit some rows but exclude others (admits {} of {})",
        facts.zone_counts[0],
        facts.features
    );
}

/// The slow-filter fixture (`NEXT-CUT.md` filter-panel cut P5 -- the ADR-021 acceptance condition's
/// own evidence): a dataset large enough that a **late-matching** filtered scan
/// (`e2e/filter-panel.mjs`'s `SLOW'`/`CANCEL'` step issues `id > <FEATURES - 100>` -- the same
/// "ids ascend in physical row order" trick `skp_filter_cancellation.rs`'s
/// `cancel_reaches_the_producer_during_a_late_matching_filtered_scan` already relies on; this
/// generator's default `IdentityMode::NativeUnique` writes `id = written + i`, ascending with
/// physical row order, unchanged here) takes long enough, wall-clock, for the shell's scan-liveness
/// indicator and Cancel affordance to be observed with **genuinely zero batches delivered yet** --
/// the literal acceptance condition this cut exists to prove, never a hand-simulated delay.
///
/// **Declared precondition, asserted openly by the E2E step, not hidden:** at `FEATURES` features,
/// `avg_vertices: 12`, this fixture's true vertex total is far over the shell's declared
/// `MAX_RESIDENT_VERTICES = 2_000_000` ceiling (`frontends/shell/src/canvas/limits.ts`) -- hard
/// -asserted below -- so the *unfiltered* first look (every dataset's own first, unfiltered query,
/// `App.tsx`'s own effect comment: "The first look is unfiltered") refuses part-way through with the
/// same OVERCEIL' pattern `over-ceiling-refused.parquet` already exercises
/// (`.canvas-refusal`/`.residency-status`, `regression.mjs`'s `stepOverCeiling`). `SLOW'` asserts this
/// pattern FIRST, openly, before ever applying a filter -- it is expected and asserted, not a defect
/// this fixture happens to also carry.
///
/// **Sizing, measured, not guessed.** `row_group_rows` is set to `FEATURES` -- one single Parquet row
/// group spanning every id -- so DuckDB's own row-group-level statistics pruning (which this
/// fixture's ascending, sorted `id` column would otherwise make maximally effective, collapsing a
/// late-matching scan to a near-instant tail-only read, since a plain multi-row-group file only ever
/// needs to open the ONE row group whose own `[min, max]` id range straddles the threshold) has
/// nothing to prune: the file's one row group has `min_id = 0`, `max_id = FEATURES - 1`, so
/// `id > FEATURES - 100` cannot skip it, and DuckDB must genuinely scan through it. Measured with a
/// throwaway probe (`engine/examples/pilot_p5_slow_scan_timing.rs` -- P0's own disposal convention,
/// `pilot_json_serialize_sql.rs`/P3's `pilot_p3_*.rs`: built, timed, deleted before this piece's
/// commit; console kept at `target/slice-evidence/filter-panel/logs/p5-probe-scan-timing.log`),
/// isolating just the engine's own `ds.stream(&query)` call to first-batch, with no SKP ticket, no
/// WebSocket, no JS decode on top (all of which can only ADD latency, never remove it, so this is a
/// conservative lower bound on what the running shell will show): at 1,500,000 features (single row
/// group) the same construction measured 345.6 ms; **at `FEATURES = 4_000_000` (this fixture) it
/// measured 962.5 ms** -- comfortably over the shell's `SCAN_LIVENESS_DELAY_MS = 200` anti-flicker
/// gate (`frontends/shell/src/App.tsx`) with real margin left over for the real pipeline's own added
/// latency and the E2E harness's own polling round trips, rather than the ~360 ms the 1,500,000-
/// feature construction left (too tight a margin to commit to, disclosed rather than risked). Write
/// time for `FEATURES = 4_000_000` at `avg_vertices: 12` measured 65.84 s (`generate_the_slow_filter_fixture`'s
/// own `--ignored --nocapture` run, `target/slice-evidence/filter-panel/logs/p5-generate-slow-fixture.log`:
/// "finished in 65.84s") -- a one-time, explicit `--ignored` generation, not part of
/// any default suite or CI path, in the same "minutes for the big ones" tolerance this crate's own
/// `fixture.rs` module doc already states for the docs/07 5 GB fixture; declined to go larger (a
/// 6,000,000-feature single-row-group construction was estimated, not measured, at roughly 1.4 s
/// scan / ~100 s write by linear extrapolation from the two measured points above) because the
/// measured 4,000,000-feature margin already clears the liveness gate by a comfortable factor with a
/// bounded, declared write cost, and NEXT-CUT.md's own sizing guidance names "something like 1-2M
/// rows" as the target range -- `4_000_000` is already a disclosed step beyond that range, taken
/// because the row-group-forcing construction described above is what actually defeats DuckDB's own
/// pruning (a plain 1-2M-row file at the writer's *default* row-group size would let pruning collapse
/// the scan to whichever one ~1M-row group straddles the threshold regardless of the file's total
/// size, which is the near-instant-tail-read failure mode this fixture exists to avoid) -- going
/// further into the docs/07 "5 GB, minutes" write-time class for a bigger safety margin than the
/// already-comfortable 962.5 ms provides was judged not worth the added one-time generation cost.
#[test]
#[ignore = "generates a real file for the E2E filter-panel liveness/cancel spec; not part of the default suite"]
fn generate_the_slow_filter_fixture() {
    const FEATURES: usize = 4_000_000;
    let path = dir().join("slow-filter-scan.parquet");
    let facts = write_geoparquet(
        &path,
        &FixtureSpec {
            features: FEATURES,
            avg_vertices: 12,
            hole_every: 0,
            // See this function's own doc comment: a single row group spanning every id is what
            // makes `id > FEATURES - 100` genuinely unprunable, rather than collapsing to a
            // near-instant tail-only read the way the writer's *default* ~1,048,576-row grouping
            // would let DuckDB's own row-group statistics pruning produce.
            row_group_rows: FEATURES,
            ..Default::default()
        },
    )
    .expect("write the slow-filter fixture");
    println!(
        "wrote {} ({} features, {} vertices, {} bytes)",
        path.display(),
        facts.features,
        facts.vertices,
        facts.bytes
    );
    // Hard-asserted, not merely commented: this fixture only does its declared-precondition job --
    // the unfiltered first look overflowing the shell's ceiling, so `SLOW'` can assert the OVERCEIL'
    // pattern openly before ever applying a filter -- if its true vertex total actually exceeds the
    // shell's 2_000_000 MAX_RESIDENT_VERTICES ceiling.
    assert!(
        facts.vertices > 2_000_000,
        "slow-filter fixture must exceed the shell's 2_000_000 MAX_RESIDENT_VERTICES ceiling on its \
         unfiltered first look, per this fixture's own declared precondition (got {} vertices)",
        facts.vertices
    );
}
