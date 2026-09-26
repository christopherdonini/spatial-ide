// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **`skp/0.4`, crs-unit-fact-and-bounds.** `describe.crs.unit` carries the engine's recorded
//! `AdmissionRecord::coordinate_unit` class for every admission route this piece's preregistration
//! table (§3, rows 1-8) names — exercised through a real `SkpHost::open_dataset` +
//! `SkpHost::describe` round trip, the same seam `kernel/tests/skp_admission_remediation.rs`
//! already exercises for the other `describe.crs.*` fields.

mod watch_support;

use std::path::PathBuf;
use std::sync::Arc;

use spatial_engine::fixture::{write_geoparquet, CoordinateDomain, CrsMode, FixtureSpec};
use spatial_kernel::skp::{session_end_channel, SkpHost, StreamRegistry};
use spatial_kernel::Catalog;
use spatial_skp::v0::{CrsUnit, DescribeRequest, OpenDatasetRequest, SKP_VERSION};

fn dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/describe-crs-unit");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

fn fixture(name: &str, spec: &FixtureSpec) -> PathBuf {
    let path = dir().join(format!("{name}.parquet"));
    write_geoparquet(&path, spec).expect("write fixture");
    path
}

fn small_spec() -> FixtureSpec {
    FixtureSpec {
        features: 20,
        avg_vertices: 6,
        hole_every: 0,
        ..Default::default()
    }
}

fn open_and_describe(name: &str, spec: &FixtureSpec) -> spatial_skp::v0::DescribeResponse {
    let path = fixture(name, spec);
    let host = SkpHost::new(
        Arc::new(Catalog::new()),
        StreamRegistry::new(),
        watch_support::no_watch_arm(),
        session_end_channel().0,
    );
    let open = host
        .open_dataset(OpenDatasetRequest {
            skp: SKP_VERSION.to_string(),
            path: path.display().to_string(),
            cancel_key: format!("open-{name}"),
            crs_assertion: None,
            identity: None,
        })
        .unwrap_or_else(|e| panic!("{name}: open must succeed: {e:?}"));
    host.describe(DescribeRequest {
        skp: SKP_VERSION.to_string(),
        dataset: open.dataset,
    })
    .unwrap_or_else(|e| panic!("{name}: describe must succeed: {e:?}"))
}

/// §3, rows 1-8. Asserts `unit` per the table, and — the falsification condition §5 names — that
/// `unit == Degree` exactly when `display_convention` is `Some`.
///
/// Mutation: `CoordinateUnit::Degree => CrsUnit::Metre` in `crs_unit_of`. Expected failure: this
/// test fails, naming rows 3-6 (every degree row) in its own assertion messages.
#[test]
fn describe_carries_the_unit_the_engine_recorded_for_each_admission_route() {
    struct Row {
        name: &'static str,
        spec: FixtureSpec,
        expect_unit: CrsUnit,
    }

    let rows = vec![
        // Row 1: DeclaredLv95 x Lv95Metres.
        Row {
            name: "row1-declared-lv95",
            spec: FixtureSpec { ..small_spec() },
            expect_unit: CrsUnit::Metre,
        },
        // Row 2: DeclaredLv95ObjectUnit x Lv95Metres.
        Row {
            name: "row2-declared-lv95-object-unit",
            spec: FixtureSpec {
                crs_mode: CrsMode::DeclaredLv95ObjectUnit,
                ..small_spec()
            },
            expect_unit: CrsUnit::Metre,
        },
        // Row 3: AbsentKey x Wgs84Degrees (unit:format-rule).
        Row {
            name: "row3-absent-key-degrees",
            spec: FixtureSpec {
                crs_mode: CrsMode::AbsentKey,
                domain: CoordinateDomain::Wgs84Degrees,
                with_geo_bbox: true,
                ..small_spec()
            },
            expect_unit: CrsUnit::Degree,
        },
        // Row 4: DeclaredCrs84Degrees x Wgs84Degrees.
        Row {
            name: "row4-declared-crs84-degrees",
            spec: FixtureSpec {
                crs_mode: CrsMode::DeclaredCrs84Degrees,
                domain: CoordinateDomain::Wgs84Degrees,
                ..small_spec()
            },
            expect_unit: CrsUnit::Degree,
        },
        // Row 5: DeclaredCrs84DegreesObjectUnit x Wgs84Degrees.
        Row {
            name: "row5-declared-crs84-degrees-object-unit",
            spec: FixtureSpec {
                crs_mode: CrsMode::DeclaredCrs84DegreesObjectUnit,
                domain: CoordinateDomain::Wgs84Degrees,
                ..small_spec()
            },
            expect_unit: CrsUnit::Degree,
        },
        // Row 6: DeclaredCrs84DegreesWithLv95Identifier x Wgs84Degrees -- the unit is read from
        // the definition, never from the identifier string (the fixture's own point).
        Row {
            name: "row6-declared-crs84-degrees-with-lv95-identifier",
            spec: FixtureSpec {
                crs_mode: CrsMode::DeclaredCrs84DegreesWithLv95Identifier,
                domain: CoordinateDomain::Wgs84Degrees,
                ..small_spec()
            },
            expect_unit: CrsUnit::Degree,
        },
        // Row 7: DeclaredAxisUnitsDisagree, the domain of
        // `engine/tests/admission_format_semantics.rs`'s
        // `axes_declaring_different_units_record_unestablished_and_the_open_still_succeeds`
        // (Wgs84Degrees).
        Row {
            name: "row7-declared-axis-units-disagree",
            spec: FixtureSpec {
                crs_mode: CrsMode::DeclaredAxisUnitsDisagree,
                domain: CoordinateDomain::Wgs84Degrees,
                ..small_spec()
            },
            expect_unit: CrsUnit::Unestablished,
        },
        // Row 8: DeclaredAxisUnitAbsent, the domain of
        // `engine/tests/admission_format_semantics.rs`'s
        // `a_missing_unit_member_records_unestablished_and_is_never_defaulted` (Wgs84Degrees).
        Row {
            name: "row8-declared-axis-unit-absent",
            spec: FixtureSpec {
                crs_mode: CrsMode::DeclaredAxisUnitAbsent,
                domain: CoordinateDomain::Wgs84Degrees,
                ..small_spec()
            },
            expect_unit: CrsUnit::Unestablished,
        },
    ];

    // Collected, not asserted per-row: a wrong mapping that happens to hit only the degree rows
    // (§3 rows 3-6) must name every one of them in a single failure, not stop at the first.
    let mut failures = Vec::new();
    for row in rows {
        let describe = open_and_describe(row.name, &row.spec);
        if describe.crs.unit != row.expect_unit {
            failures.push(format!(
                "{}: expected unit {:?}, got {:?}",
                row.name, row.expect_unit, describe.crs.unit
            ));
        }
        // Falsification (§5): `unit == Degree` exactly when `display_convention` is `Some`. Any
        // admitted dataset where the two disagree would mean they are not read from one record.
        if (describe.crs.unit == CrsUnit::Degree) != describe.crs.display_convention.is_some() {
            failures.push(format!(
                "{}: unit ({:?}) and display_convention ({:?}) must agree on whether this is a \
                 geographic-degrees instance",
                row.name, describe.crs.unit, describe.crs.display_convention
            ));
        }
    }
    assert!(failures.is_empty(), "{}", failures.join("\n"));
}
