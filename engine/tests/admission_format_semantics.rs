// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Brief A P1: the format-governed admission rules, the provenance classes, and the range check's
//! assurance levels — asserted against **real GeoParquet files**, row by row against the fixture
//! table of `engine/ADMISSION-PREREGISTRATION.md` §4 (F-1…F-6).
//!
//! Every expectation here was fixed by that preregistration before this file existed, and no
//! assertion below was derived from an outcome someone had already seen. Where a test's expectation
//! differs from what the rules produce, the rules and the preregistration are what is right and the
//! difference is a recorded result — not a number edited to match (§8).
//!
//! **No outcome in this file is described as a file passing, being verified, or being valid.** The
//! range check convicts or is silent (settled boundary 2), and its recorded value is a level plus
//! the reason it was decided from.

use std::collections::HashMap;
use std::path::PathBuf;

use spatial_engine::fixture::{
    write_geoparquet, CoordinateDomain, CrsMode, FixtureSpec, StatisticsMode,
};
use spatial_engine::{CrsAssertion, CrsSource, Dataset, EngineError};

fn fixture_dir() -> PathBuf {
    let d = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../target/fixtures/admission-p1");
    std::fs::create_dir_all(&d).expect("fixture dir");
    d
}

fn write(name: &str, spec: &FixtureSpec) -> PathBuf {
    let path = fixture_dir().join(format!("{name}.parquet"));
    write_geoparquet(&path, spec).expect("write fixture");
    path
}

/// The metre-domain base every existing fixture is drawn in: **outside** ±180/±90.
fn metres() -> FixtureSpec {
    FixtureSpec { features: 256, avg_vertices: 12, ..Default::default() }
}

/// The same fixture in degrees: **inside** ±180/±90.
fn degrees() -> FixtureSpec {
    FixtureSpec { domain: CoordinateDomain::Wgs84Degrees, ..metres() }
}

fn envelope_metadata(ds: &Dataset) -> HashMap<String, String> {
    ds.envelope().schema().metadata().clone()
}

fn lv95_assertion() -> CrsAssertion {
    CrsAssertion {
        identifier: "EPSG:2056".into(),
        definition_json: Some(spatial_engine::fixture::LV95_PROJJSON.to_string()),
        by: "admission-p1-test".into(),
        at: "2026-09-10T00:00:00Z".into(),
        definition_provenance: spatial_engine::definition_provenance(Some(
            spatial_engine::fixture::LV95_PROJJSON,
        )),
    }
}

// ---- §4's fixture table, one test per row -------------------------------------------------

/// **F-1** — absent key, polygons, coordinates inside ±180/±90, pinned version.
/// Expected: admitted, `crs:format-default`, level `metadata`.
#[test]
fn f1_an_absent_crs_key_admits_under_the_formats_own_rule_with_that_provenance() {
    let path = write(
        "f1-absent-key-in-domain",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, with_geo_bbox: true, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("F-1 opens under the format's absent-key rule");
    let md = envelope_metadata(&ds);

    assert_eq!(ds.crs().identifier(), "OGC:CRS84");
    assert_eq!(md.get("crs").unwrap(), "OGC:CRS84");
    assert_eq!(md.get("crs_provenance").unwrap(), "crs:format-default");
    assert_eq!(md.get("axis_provenance").unwrap(), "axis:format-override");
    assert_eq!(
        md.get("format_rule_reference").unwrap(),
        "geoparquet:1.1.0#crs-absent-default",
        "the reader carries the version and the rule it relied on, whose text is pinned in \
         ADMISSION-PREREGISTRATION.md Appendix A"
    );
    assert!(
        !md.contains_key("declared_axis_order"),
        "no definition existed, so there is no declared order to retain"
    );
    assert_eq!(md.get("sanity_level").unwrap(), "metadata");
    assert!(
        md.get("sanity_reason").unwrap().contains("`bbox` member"),
        "the level names what it was read from: {:?}",
        md.get("sanity_reason")
    );

    // Every field the envelope carried before this cut still carries the same value.
    assert_eq!(md.get("axis_normalization").unwrap(), "none-performed");
    assert_eq!(md.get("axis_order").unwrap(), "longitude,latitude");
    assert_eq!(md.get("frame").unwrap(), spatial_engine::FRAME_AUTHORITATIVE);
}

/// R-S1's second `metadata` source: no `geo` `bbox` member, but the covering columns carry parquet
/// statistics — footer-resident either way.
#[test]
fn the_metadata_level_is_also_reached_from_covering_column_statistics() {
    let path = write(
        "metadata-from-statistics",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("opens");
    let md = envelope_metadata(&ds);
    assert_eq!(md.get("sanity_level").unwrap(), "metadata");
    assert!(
        md.get("sanity_reason").unwrap().contains("parquet statistics"),
        "reason: {:?}",
        md.get("sanity_reason")
    );
}

/// **F-2** — as F-1 but coordinates outside the domain.
/// Expected: `engine.format_default_contradicted`.
#[test]
fn f2_coordinates_outside_the_domain_convict_the_format_default() {
    let path = write(
        "f2-absent-key-out-of-domain",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, with_geo_bbox: true, ..metres() },
    );
    match Dataset::open(&path) {
        Err(EngineError::FormatDefaultContradicted { detail }) => {
            assert!(detail.contains("metadata"), "the level convicted at is named: {detail}");
            assert!(detail.contains("180"), "the domain left is named: {detail}");
        }
        other => panic!("expected FormatDefaultContradicted, got {:?}", other.err()),
    }
}

/// The remedy the refusal names is real: a caller who knows the file's CRS asserts it and the file
/// opens, recorded as `crs:asserted` (R-C6, unchanged in every respect).
#[test]
fn a_contradicted_file_still_opens_under_a_caller_assertion() {
    let path = write(
        "f2-asserted",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, with_geo_bbox: true, ..metres() },
    );
    let ds = Dataset::open_with_asserted_crs(&path, lv95_assertion()).expect("assertion admits");
    let md = envelope_metadata(&ds);
    assert_eq!(ds.crs().source(), CrsSource::CallerAsserted);
    assert_eq!(md.get("crs_provenance").unwrap(), "crs:asserted");
    assert_eq!(md.get("axis_provenance").unwrap(), "axis:declared");
    assert_eq!(md.get("sanity_level").unwrap(), "none");
    assert!(!md.contains_key("format_rule_reference"));
}

/// **F-3** — explicit `crs: null`, polygons. Expected: `crs_undeclared`, unchanged from today.
#[test]
fn f3_an_explicit_null_crs_is_unchanged_and_still_needs_an_assertion() {
    let path =
        write("f3-explicit-null", &FixtureSpec { crs_mode: CrsMode::ExplicitNull, ..degrees() });
    assert!(
        matches!(Dataset::open(&path), Err(EngineError::CrsUndeclared { .. })),
        "an explicit null says the CRS is undefined or unknown, and no format rule answers for it"
    );

    let ds = Dataset::open_with_asserted_crs(&path, lv95_assertion()).expect("assertion admits");
    assert_eq!(envelope_metadata(&ds).get("crs_provenance").unwrap(), "crs:asserted");
}

/// **F-4** — declared lat-first geographic CRS, polygons, degrees.
/// Expected: admitted, `axis:format-override`, declared order retained.
#[test]
fn f4_a_declared_lat_first_crs_admits_under_the_wkb_override_with_its_declared_order_retained() {
    let path = write(
        "f4-declared-lat-first",
        &FixtureSpec { crs_mode: CrsMode::DeclaredLatLonFirst, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("F-4 opens under the format's WKB axis rule");
    let md = envelope_metadata(&ds);

    assert_eq!(md.get("crs").unwrap(), "EPSG:4326");
    assert_eq!(md.get("crs_provenance").unwrap(), "crs:declared");
    assert_eq!(md.get("axis_provenance").unwrap(), "axis:format-override");
    assert_eq!(
        md.get("axis_order").unwrap(),
        "longitude,latitude",
        "the data's order, established from the format's WKB rule"
    );
    assert_eq!(
        md.get("declared_axis_order").unwrap(),
        "latitude,longitude",
        "the definition's own order is retained as a recorded fact and never discarded"
    );
    assert_eq!(
        md.get("format_rule_reference").unwrap(),
        "geoparquet:1.1.0#coordinate-axis-order"
    );
    assert_eq!(
        md.get("axis_normalization").unwrap(),
        "none-performed",
        "no coordinate value was transformed to get here"
    );
    assert_eq!(
        md.get("sanity_level").unwrap(),
        "metadata",
        "the level records what evidence was available even where no range verdict is taken from \
         it (R-S2): the CRS is the file's own, and only the data's axis order came from the format"
    );
    assert!(
        md.get("sanity_reason").unwrap().contains("no range check applies"),
        "the CRS is the file's own declaration, so there is nothing assumed to convict: {:?}",
        md.get("sanity_reason")
    );
}

/// **F-5** — as F-1 but no `geo` `bbox` and no covering.
/// Expected: admitted, level `none`, "not checked" stated.
#[test]
fn f5_with_neither_bbox_nor_covering_the_level_is_none_and_says_not_checked() {
    let path = write(
        "f5-no-bbox-no-covering",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, with_covering_bbox: false, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("F-5 opens; a missing level is not a refusal");
    let md = envelope_metadata(&ds);
    assert_eq!(md.get("crs_provenance").unwrap(), "crs:format-default");
    assert_eq!(md.get("sanity_level").unwrap(), "none");
    let reason = md.get("sanity_reason").unwrap();
    assert!(reason.contains("Not checked"), "reason: {reason}");
    assert!(!reason.contains("passed"), "a level is never a verdict: {reason}");
}

/// **F-6** — as F-1 but covering present, no statistics, ≥2 row groups.
/// Expected: admitted, level `sample`.
#[test]
fn f6_without_statistics_the_level_is_the_bounded_sample_of_the_covering_columns() {
    let path = write(
        "f6-sample-level",
        &FixtureSpec {
            crs_mode: CrsMode::AbsentKey,
            statistics: StatisticsMode::Disabled,
            // ≥2 row groups, as §4's row states.
            row_group_rows: 64,
            ..degrees()
        },
    );
    let ds = Dataset::open(&path).expect("F-6 opens");
    let md = envelope_metadata(&ds);
    assert_eq!(md.get("sanity_level").unwrap(), "sample");
    let reason = md.get("sanity_reason").unwrap();
    assert!(
        reason.contains("first row group"),
        "the sample's unit is named: {reason}"
    );
    assert!(
        reason.contains("covering bbox columns only"),
        "the WKB is never read at open: {reason}"
    );
}

/// **R-S1 and §13 B's own words** — the `sample` level is *"the first row group of the covering
/// bbox columns only, capped at `SANITY_SAMPLE_MAX_ROWS`"*, so on a file with 64-row row groups it
/// reads 64 rows and not the whole 256-row file. Added at the P1 reviewer gate's follow-through:
/// before it, the statement carried `LIMIT 8192`, which on this file spans every row group.
#[test]
fn the_sample_level_reads_the_first_row_group_and_not_a_fixed_row_count() {
    let path = write(
        "sample-first-row-group",
        &FixtureSpec {
            crs_mode: CrsMode::AbsentKey,
            statistics: StatisticsMode::Disabled,
            row_group_rows: 64,
            ..degrees()
        },
    );
    let ds = Dataset::open(&path).expect("opens");
    let md = envelope_metadata(&ds);
    assert_eq!(md.get("sanity_level").unwrap(), "sample");
    let reason = md.get("sanity_reason").unwrap();
    assert!(
        reason.contains("the first row group (64 rows)"),
        "the row group's own row count is what bounded the read: {reason}"
    );
    assert!(
        !reason.contains("256"),
        "the file's 256 rows are not what the sample read: {reason}"
    );
    assert!(
        !reason.contains(&spatial_engine::SANITY_SAMPLE_MAX_ROWS.to_string()),
        "the declared ceiling did not bound this read, so it is not named as though it had: \
         {reason}"
    );
}

// ---- R-C1's precondition, R-C5, and R-S3 ---------------------------------------------------

/// **R-C1** — a file declaring a spec version whose text is not pinned in this tree takes no format
/// rule; with an absent key it refuses under the existing `CrsUndeclared`, naming the version.
#[test]
fn an_unpinned_spec_version_takes_no_format_rule_and_the_refusal_names_the_version() {
    let path = write(
        "unpinned-version-absent-key",
        &FixtureSpec {
            crs_mode: CrsMode::AbsentKey,
            geo_version: "2.0.0".to_string(),
            with_geo_bbox: true,
            ..degrees()
        },
    );
    match Dataset::open(&path) {
        Err(EngineError::CrsUndeclared { detail }) => {
            assert!(detail.contains("2.0.0"), "the unpinned version is named: {detail}");
            assert!(
                detail.contains("pinned"),
                "and why no rule was taken from it: {detail}"
            );
        }
        other => panic!("expected CrsUndeclared naming the version, got {:?}", other.err()),
    }
    assert!(
        !spatial_engine::PINNED_SPEC_VERSIONS.contains(&"2.0.0"),
        "2.0.0 has no release tag to pin; the precondition holds for 1.0.0 and 1.1.0 only"
    );
}

/// R-C1 gates the axis rule too: an unpinned version with a lat-first declaration meets the same
/// refusal it always met, because no format rule established the data's order.
#[test]
fn an_unpinned_version_with_a_lat_first_declaration_still_refuses_by_name() {
    let path = write(
        "unpinned-version-lat-first",
        &FixtureSpec {
            crs_mode: CrsMode::DeclaredLatLonFirst,
            geo_version: "2.0.0".to_string(),
            ..degrees()
        },
    );
    match Dataset::open(&path) {
        Err(EngineError::AxisOrderUnsupported { established }) => {
            assert_eq!(established, "latitude,longitude");
        }
        other => panic!("expected AxisOrderUnsupported, got {:?}", other.err()),
    }
}

/// **R-C5** — a declared x-first CRS is admitted as declared: no format rule, no rule reference,
/// and nothing to range-check.
#[test]
fn a_declared_x_first_crs_records_crs_declared_and_axis_declared() {
    let path = write("declared-x-first", &metres());
    let ds = Dataset::open(&path).expect("opens as it always did");
    let md = envelope_metadata(&ds);
    assert_eq!(md.get("crs").unwrap(), "EPSG:2056");
    assert_eq!(md.get("crs_source").unwrap(), "file");
    assert_eq!(md.get("crs_provenance").unwrap(), "crs:declared");
    assert_eq!(md.get("axis_provenance").unwrap(), "axis:declared");
    assert_eq!(md.get("declared_axis_order").unwrap(), "easting,northing");
    assert_eq!(md.get("axis_order").unwrap(), "easting,northing");
    assert!(!md.contains_key("format_rule_reference"));
    assert_eq!(md.get("sanity_level").unwrap(), "none");
    assert!(
        md.get("sanity_reason").unwrap().contains("no format rule was applied"),
        "reason: {:?}",
        md.get("sanity_reason")
    );
}

/// **R-S3** — a covering naming a column the schema does not contain records level `none` with the
/// reason, and the open still succeeds. Refusing at open instead would be a user-visible behaviour
/// change and is on the preregistration's human list (§12d), not taken here.
#[test]
fn a_covering_naming_an_absent_column_records_none_and_the_open_still_succeeds() {
    let path = write(
        "covering-absent-column",
        &FixtureSpec {
            crs_mode: CrsMode::AbsentKey,
            covering_names_absent_column: true,
            ..degrees()
        },
    );
    let ds = Dataset::open(&path).expect("open still succeeds");
    let md = envelope_metadata(&ds);
    assert_eq!(md.get("sanity_level").unwrap(), "none");
    let reason = md.get("sanity_reason").unwrap();
    assert!(reason.contains("no_such_bbox_column"), "the column named is quoted: {reason}");
    assert!(reason.contains("Not checked"), "reason: {reason}");
}

/// The two format-rule routes must be distinguishable at sight (§5's consequence): the same
/// real-world CRS is reached by two different routes, and one line collapsing them would collapse
/// two different facts.
#[test]
fn the_two_format_rule_routes_are_distinguishable_on_the_envelope() {
    let default_path = write(
        "route-format-default",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, ..degrees() },
    );
    let override_path = write(
        "route-axis-override",
        &FixtureSpec { crs_mode: CrsMode::DeclaredLatLonFirst, ..degrees() },
    );
    let by_default = envelope_metadata(&Dataset::open(&default_path).expect("opens"));
    let by_override = envelope_metadata(&Dataset::open(&override_path).expect("opens"));

    assert_ne!(by_default.get("crs_provenance"), by_override.get("crs_provenance"));
    assert_ne!(
        by_default.get("format_rule_reference"),
        by_override.get("format_rule_reference")
    );
    // Both are longitude/latitude data, by two different routes.
    assert_eq!(by_default.get("axis_order").unwrap(), "longitude,latitude");
    assert_eq!(by_override.get("axis_order").unwrap(), "longitude,latitude");
}

// ---- Brief A P2: the coordinate unit, and the geographic-degrees instance ------------------
//
// `ADMISSION-PREREGISTRATION.md` §14 item I fixes what is read and what the unreadable cases
// record; the proposed ADR-013 Amendment 1 (§2, and its block-on-sight 2 and 8) is the rule these
// assertions serve. Nothing below transforms a coordinate, and every envelope assertion checks
// that `axis_normalization` is still `none-performed`.

/// **(a)** The corpus-shaped CRS84 file: a declared definition carrying `"unit": "degree"` on both
/// coordinate-system axes, drawn in degrees. The unit is recorded as read, the source says a
/// definition was read, and the dataset answers the instance predicate.
#[test]
fn a_declared_crs84_definition_in_degrees_records_the_degree_unit_and_is_the_instance() {
    let path = write(
        "p2-declared-crs84-degrees",
        &FixtureSpec { crs_mode: CrsMode::DeclaredCrs84Degrees, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("a declared x-first CRS84 file opens as it always did");
    let md = envelope_metadata(&ds);

    assert_eq!(md.get("crs").unwrap(), "OGC:CRS84");
    assert_eq!(md.get("coordinate_unit").unwrap(), "degree");
    assert_eq!(md.get("coordinate_unit_source").unwrap(), "unit:definition");
    assert!(
        ds.is_geographic_degrees_instance(),
        "both axes declare the angular degree, which is the whole of what the instance is"
    );

    // P1's keys, unchanged by an additive one.
    assert_eq!(md.get("crs_provenance").unwrap(), "crs:declared");
    assert_eq!(md.get("axis_provenance").unwrap(), "axis:declared");
    assert_eq!(md.get("axis_order").unwrap(), "longitude,latitude");
    assert_eq!(
        md.get("axis_normalization").unwrap(),
        "none-performed",
        "reading a unit transforms nothing"
    );
}

/// **(b)** EPSG:2056 — the definition this tree pins, whose `conversion.parameters` and whose
/// `base_crs` axes declare `degree` while the CRS's own axes declare `metre`. The recorded unit is
/// `metre` and the dataset is not the instance; the test asserts the trap is still in the fixture,
/// so it cannot pass by the fixture having lost it.
#[test]
fn the_degrees_on_epsg2056s_conversion_parameters_do_not_leak_into_the_recorded_unit() {
    assert!(
        spatial_engine::fixture::LV95_PROJJSON.contains("\"unit\": \"degree\""),
        "the pinned EPSG:2056 definition must still carry the degree units this test exists for"
    );
    let path = write("p2-declared-lv95-metres", &metres());
    let ds = Dataset::open(&path).expect("opens as it always did");
    let md = envelope_metadata(&ds);

    assert_eq!(md.get("crs").unwrap(), "EPSG:2056");
    assert_eq!(
        md.get("coordinate_unit").unwrap(),
        "metre",
        "the unit is `coordinate_system.axis[i].unit`, not a conversion parameter's and not the \
         base CRS's"
    );
    assert_eq!(md.get("coordinate_unit_source").unwrap(), "unit:definition");
    assert!(!ds.is_geographic_degrees_instance());
}

/// **(c)** PROJJSON's object form is the same declaration written another way, on both sides:
/// `{"type": "AngularUnit", "name": "degree", …}` records `degree` and
/// `{"type": "LinearUnit", "name": "metre", …}` records `metre`, with the same instance answers as
/// (a) and (b).
#[test]
fn the_object_form_of_a_unit_records_what_the_string_form_records() {
    let degrees_path = write(
        "p2-crs84-degrees-object-unit",
        &FixtureSpec { crs_mode: CrsMode::DeclaredCrs84DegreesObjectUnit, ..degrees() },
    );
    let metres_path = write(
        "p2-lv95-metre-object-unit",
        &FixtureSpec { crs_mode: CrsMode::DeclaredLv95ObjectUnit, ..metres() },
    );

    let in_degrees = Dataset::open(&degrees_path).expect("opens");
    let in_metres = Dataset::open(&metres_path).expect("opens");

    assert_eq!(envelope_metadata(&in_degrees).get("coordinate_unit").unwrap(), "degree");
    assert!(in_degrees.is_geographic_degrees_instance());
    assert_eq!(envelope_metadata(&in_metres).get("coordinate_unit").unwrap(), "metre");
    assert!(!in_metres.is_geographic_degrees_instance());
}

/// **(d)** Two axes in different units are two facts and one record: the unit is recorded
/// `unestablished`, which is **not** a refusal — the file opens.
#[test]
fn axes_declaring_different_units_record_unestablished_and_the_open_still_succeeds() {
    let path = write(
        "p2-axis-units-disagree",
        &FixtureSpec { crs_mode: CrsMode::DeclaredAxisUnitsDisagree, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("an unestablished unit is not a refusal");
    let md = envelope_metadata(&ds);
    assert_eq!(md.get("coordinate_unit").unwrap(), "unestablished");
    assert_eq!(
        md.get("coordinate_unit_source").unwrap(),
        "unit:definition",
        "a definition was there and was read; what it said did not establish one unit"
    );
    assert!(!ds.is_geographic_degrees_instance());
}

/// **(e)** A missing `unit` member is not a licence to assume one: `unestablished`, and the file
/// opens.
#[test]
fn a_missing_unit_member_records_unestablished_and_is_never_defaulted() {
    let path = write(
        "p2-axis-unit-absent",
        &FixtureSpec { crs_mode: CrsMode::DeclaredAxisUnitAbsent, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("opens");
    let md = envelope_metadata(&ds);
    assert_eq!(md.get("coordinate_unit").unwrap(), "unestablished");
    assert!(!ds.is_geographic_degrees_instance());
}

/// **(f)** The absent-key format-default admission — F-1's own shape. It carries **no definition**
/// (the rule names a CRS; it does not supply PROJJSON), so its unit is recorded `unestablished` by
/// name and no source key is written at all.
///
/// **Item IV of `ADMISSION-PREREGISTRATION.md` §14 is open and is the human's**
/// (DECISIONS-PENDING entry 81): whether such an admission yields the degrees instance. This test
/// asserts what the code records today and pre-empts nothing — if entry 81 is ruled the other way,
/// this expectation changes with it.
#[test]
fn the_format_default_admission_records_an_unestablished_unit_and_no_source() {
    let path = write(
        "p2-format-default-unit",
        &FixtureSpec { crs_mode: CrsMode::AbsentKey, with_geo_bbox: true, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("F-1's shape opens under the format's absent-key rule");
    let md = envelope_metadata(&ds);

    assert_eq!(md.get("crs_provenance").unwrap(), "crs:format-default");
    assert_eq!(md.get("coordinate_unit").unwrap(), "unestablished");
    assert!(
        !md.contains_key("coordinate_unit_source"),
        "there was no definition to read a unit from, and the record says so by omitting the key"
    );
    assert!(!ds.is_geographic_degrees_instance());
}

/// **(g)** The identifier is not a unit source. Two files whose definitions differ **only** in
/// their `id` member — one OGC:CRS84, one EPSG:2056, the identifier of a metre CRS — record the
/// same unit and give the same answer to the predicate (the proposed ADR-013 Amendment 1's
/// block-on-sight 8; `docs/05`: never a name-string comparison).
#[test]
fn an_identifier_only_change_does_not_flip_the_instance_predicate() {
    let as_crs84 = write(
        "p2-identifier-crs84",
        &FixtureSpec { crs_mode: CrsMode::DeclaredCrs84Degrees, ..degrees() },
    );
    let relabelled = write(
        "p2-identifier-relabelled",
        &FixtureSpec { crs_mode: CrsMode::DeclaredCrs84DegreesWithLv95Identifier, ..degrees() },
    );
    let named_crs84 = Dataset::open(&as_crs84).expect("opens");
    let named_lv95 = Dataset::open(&relabelled).expect("opens");

    let crs84_definition = named_crs84.crs().definition_json().expect("a declared definition");
    let relabelled_definition =
        named_lv95.crs().definition_json().expect("a declared definition");
    assert_eq!(
        crs84_definition.split(",\"id\":").next(),
        relabelled_definition.split(",\"id\":").next(),
        "the two definitions must differ in their `id` member and in nothing else"
    );
    assert_ne!(named_crs84.crs().identifier(), named_lv95.crs().identifier());
    assert_eq!(named_lv95.crs().identifier(), "EPSG:2056");

    assert_eq!(
        envelope_metadata(&named_crs84).get("coordinate_unit").unwrap(),
        envelope_metadata(&named_lv95).get("coordinate_unit").unwrap()
    );
    assert!(named_crs84.is_geographic_degrees_instance());
    assert!(
        named_lv95.is_geographic_degrees_instance(),
        "the axes declare degrees; an identifier that names a metre CRS does not overrule them"
    );
}

/// The human's display-convention sentence, held once and **verbatim**. The literal is written out
/// here so the two texts are compared mechanically rather than by eye (the proposed ADR-013
/// Amendment 1's block-on-sight 2: never paraphrased, shortened or reworded).
///
/// The two surfaces that must carry it — the shell's own status at open, and `describe` — are P3's
/// and the cut's. This engine-side piece holds the sentence and consumes it nowhere, which is what
/// the second assertion records.
#[test]
fn the_display_convention_sentence_is_carried_verbatim_and_no_surface_here_consumes_it() {
    assert_eq!(
        spatial_engine::GEOGRAPHIC_DISPLAY_CONVENTION,
        "no coordinate value is transformed; the display convention is equirectangular"
    );

    let path = write(
        "p2-display-convention",
        &FixtureSpec { crs_mode: CrsMode::DeclaredCrs84Degrees, ..degrees() },
    );
    let ds = Dataset::open(&path).expect("opens");
    assert!(ds.is_geographic_degrees_instance());
    let md = envelope_metadata(&ds);
    assert!(
        !md.values().any(|v| v.contains(spatial_engine::GEOGRAPHIC_DISPLAY_CONVENTION)),
        "the surfaces that carry the statement are P3's and the cut's, not this envelope's"
    );
    assert_eq!(md.get("axis_normalization").unwrap(), "none-performed");
}
