// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A-1 to A-4 of `engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` §4 and A-P1 and A-P2 of
//! `engine/GEOMETRY-POINTS-PREREGISTRATION.md` §4: which geometry types a file's `geometry_types`
//! declaration admits, what encoding that gives, and the refusal's wording.
//!
//! **Real shape.** Every case writes a real GeoParquet file through `spatial_engine::fixture` and
//! opens it through `Dataset::open`; nothing here calls an admission helper directly. The
//! multipolygon rows are the fixture module's own (`multipolygon_f1_rows`).

use std::path::PathBuf;

use spatial_engine::fixture::{
    multipolygon_f1_rows, point_p1_rows, write_geoparquet, DeclaredTypes, FixtureSpec,
    GeometryMode, E_LO, N_LO,
};
use spatial_engine::wkb::encode_polygon;
use spatial_engine::{Dataset, EngineError, GeometryEncoding};

fn workspace(name: &str) -> PathBuf {
    let d = std::env::temp_dir()
        .join("spatial-engine-geometry-admission")
        .join(name);
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

/// Three LV95 polygon rows, as type-3 WKB.
fn polygon_rows() -> Vec<Vec<u8>> {
    (0..3)
        .map(|i| {
            let x = E_LO + f64::from(i) * 100.0;
            encode_polygon(&[vec![
                [x, N_LO],
                [x + 50.0, N_LO],
                [x + 50.0, N_LO + 50.0],
                [x, N_LO],
            ]])
        })
        .collect()
}

/// Write `rows` under `declared` (LV95, no covering) and open the file.
fn open(name: &str, declared: DeclaredTypes, rows: Vec<Vec<u8>>) -> Result<Dataset, EngineError> {
    let path = workspace(name).join("f.parquet");
    write_geoparquet(
        &path,
        &FixtureSpec {
            geometry: GeometryMode::Rows(rows),
            with_covering_bbox: false,
            declared_types: declared,
            ..Default::default()
        },
    )
    .unwrap();
    Dataset::open(&path)
}

fn json(text: &str) -> DeclaredTypes {
    DeclaredTypes::Json(text.to_string())
}

fn f1() -> Vec<Vec<u8>> {
    multipolygon_f1_rows([E_LO, N_LO], 10.0)
}

/// P-1's six LV95 point rows, as type-1 WKB.
fn p1() -> Vec<Vec<u8>> {
    point_p1_rows([E_LO, N_LO], 10.0)
}

fn refusal(r: Result<Dataset, EngineError>) -> String {
    match r {
        Err(EngineError::GeoMetadata(d)) => d,
        Err(other) => panic!("expected engine.geo_metadata, got {other}"),
        Ok(_) => panic!("expected a refusal at open, the file was admitted"),
    }
}

fn declared(ds: &Dataset) -> Option<Vec<String>> {
    ds.declared_geometry_types().map(<[String]>::to_vec)
}

/// A-1. F-1 to F-3 and F-6 to F-8 (and the default declaration): the encoding each declared set
/// selects, or its refusal, read off the open's envelope and the dataset's two accessors. Changed
/// by the points cut: F-6 is `["LineString"]`, because `["Point"]` is now read (A-P1).
///
/// RECORDED MUTATION: in `geoarrow::encoding_for_declared_types`, map a declared set equal to
/// `{Polygon}` to `MultiPolygon` (return `MultiPolygon` where the all-`Polygon` branch returns
/// `Polygon`). F-8 and the default declaration then open as `geoarrow.multipolygon` and this test
/// fails by name.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit (before the points
/// cut changed this test): `a_declared_set_selects_the_encoding_or_is_refused_at_open` FAILED with the mutation applied,
/// then reverted.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `a_declared_set_selects_the_encoding_or_is_refused_at_open` FAILED with the mutation applied, at
/// the F-8 encoding assertion (left `MultiPolygon`, right `Polygon`), then reverted.
#[test]
fn a_declared_set_selects_the_encoding_or_is_refused_at_open() {
    // F-1: [MultiPolygon] -> multipolygon.
    let ds = open("f1", json(r#"["MultiPolygon"]"#), f1()).unwrap();
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::MultiPolygon);
    assert_eq!(declared(&ds), Some(vec!["MultiPolygon".to_string()]));
    // The envelope, every batch and `describe` carry the one value: here, the envelope's two spellings.
    let schema = ds.envelope().schema();
    assert_eq!(
        schema.metadata().get("geometry_encoding").unwrap(),
        "geoarrow.multipolygon"
    );

    // F-2: [Polygon, MultiPolygon] -> multipolygon, declared order kept.
    let mut mixed = polygon_rows();
    mixed.extend(f1());
    let ds = open("f2", json(r#"["Polygon","MultiPolygon"]"#), mixed).unwrap();
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::MultiPolygon);
    assert_eq!(
        declared(&ds),
        Some(vec!["Polygon".to_string(), "MultiPolygon".to_string()])
    );

    // F-3: an explicit empty list -> multipolygon, and the list is kept empty.
    let ds = open("f3", json("[]"), polygon_rows()).unwrap();
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::MultiPolygon);
    assert_eq!(declared(&ds), Some(Vec::new()));

    // F-6, re-pointed by the points cut (§4's changed A-1): [LineString] is refused. [Point] is read.
    refusal(open("f6", json(r#"["LineString"]"#), polygon_rows()));

    // F-7: mixed kinds and Z names are refused.
    refusal(open(
        "f7a",
        json(r#"["Polygon","LineString"]"#),
        polygon_rows(),
    ));
    refusal(open("f7b", json(r#"["Polygon Z"]"#), polygon_rows()));

    // F-8: a lower-case Polygon is still exactly Polygon, and the declaration is kept as written.
    let ds = open("f8", json(r#"["polygon"]"#), polygon_rows()).unwrap();
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::Polygon);
    assert_eq!(declared(&ds), Some(vec!["polygon".to_string()]));
    assert_eq!(
        ds.envelope()
            .schema()
            .metadata()
            .get("geometry_encoding")
            .unwrap(),
        "geoarrow.polygon"
    );

    // The default declaration, `["Polygon"]`, is the encoding every earlier file had.
    let ds = open("default", DeclaredTypes::Polygon, polygon_rows()).unwrap();
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::Polygon);
}

/// A-2. F-6's detail is Decision 4's sighted wording with the declared list rendered, byte for byte,
/// under the variant's unchanged `Display` prefix. Changed by the points cut: the file declares
/// `["LineString"]`, and the readable-set clause renders three types.
///
/// RECORDED MUTATION: in `geoarrow::readable_set_phrase`, join the readable set with `, ` instead
/// of ` and `. The detail then reads `Polygon, MultiPolygon, Point` and this test fails by name.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit (before the points
/// cut changed this test): `the_refusal_detail_is_the_sighted_wording_with_the_declared_list_rendered` FAILED with the mutation applied,
/// then reverted.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `the_refusal_detail_is_the_sighted_wording_with_the_declared_list_rendered` FAILED with the
/// mutation applied, at the first `assert_eq!` of the detail (`it reads Polygon, MultiPolygon,
/// Point`), then reverted.
#[test]
fn the_refusal_detail_is_the_sighted_wording_with_the_declared_list_rendered() {
    let detail = refusal(open("a2", json(r#"["LineString"]"#), polygon_rows()));
    assert_eq!(
        detail,
        "geometry_types [\"LineString\"] include types this engine does not read; it reads \
         Polygon, MultiPolygon and Point"
    );
    // The list is rendered as `{:?}` renders a `Vec<String>`, in declared order and case as written.
    let detail = refusal(open(
        "a2-two",
        json(r#"["Polygon","LineString"]"#),
        polygon_rows(),
    ));
    assert_eq!(
        detail,
        "geometry_types [\"Polygon\", \"LineString\"] include types this engine does not read; it \
         reads Polygon, MultiPolygon and Point"
    );
    // The variant's `Display` prefix is unchanged.
    let e = EngineError::GeoMetadata(detail.clone());
    assert_eq!(format!("{e}"), format!("geo metadata: {detail}"));
}

/// A-3. The readable set is one declaration read by both the gate and the text (Decision 1): every
/// member the refusal names admits, in the order the text states them, and a type it does not name
/// is refused. Changed by the points cut: the clause is parsed by the phrase rule (`A, B and C`:
/// the last member after ` and `, the rest split at `, `) and names three types.
///
/// RECORDED MUTATION: in `geoarrow::readable_set_phrase`, state a hard-coded `Polygon` instead of
/// reading `READABLE_GEOMETRY_TYPES`. The text then names one member and no ` and `, so this test
/// fails by name at the phrase rule's last member, before it reaches the member list.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit (before the points
/// cut changed this test): `the_refusal_names_exactly_the_types_the_gate_admits_in_order` FAILED with the mutation applied,
/// then reverted.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `the_refusal_names_exactly_the_types_the_gate_admits_in_order` FAILED with the mutation applied,
/// at `the phrase rule's last member`, then reverted.
#[test]
fn the_refusal_names_exactly_the_types_the_gate_admits_in_order() {
    let detail = refusal(open("a3", json(r#"["LineString"]"#), polygon_rows()));
    let clause = detail
        .split("it reads ")
        .nth(1)
        .expect("the refusal states what the engine reads");
    let (rest, last) = clause
        .rsplit_once(" and ")
        .expect("the phrase rule's last member");
    let members: Vec<&str> = rest.split(", ").chain([last]).collect();
    assert_eq!(
        members,
        ["Polygon", "MultiPolygon", "Point"],
        "Decision 1: the readable set, in that order"
    );

    for (i, member) in members.iter().enumerate() {
        let rows = match *member {
            "Polygon" => polygon_rows(),
            "Point" => p1(),
            _ => f1(),
        };
        open(&format!("a3-{i}"), json(&format!("[\"{member}\"]")), rows)
            .unwrap_or_else(|e| panic!("`{member}` is named as read, and was refused: {e}"));
    }
    // A type the text does not name is not admitted.
    refusal(open("a3-line", json(r#"["MultiPoint"]"#), polygon_rows()));
}

/// A-4 (OPEN-1, ruled (b1) and (c1)). F-4: an absent `geometry_types` key takes the empty list's
/// encoding and `declared_types` is `None`. F-5: a member that is not a string is refused at open,
/// naming its position, and so is a value that is not a list.
///
/// RECORDED MUTATION: in `GeoMeta::parse`, treat an absent `geometry_types` key as `["Polygon"]`.
/// F-4 then opens as `geoarrow.polygon` with a declared list, and this test fails by name.
///
/// Observed over `d8276158` on the uncommitted tree of the engine commit:
/// `an_absent_key_is_multipolygon_with_no_declaration_and_a_non_string_member_is_refused` FAILED
/// with the mutation applied, then reverted.
#[test]
fn an_absent_key_is_multipolygon_with_no_declaration_and_a_non_string_member_is_refused() {
    // F-4.
    let ds = open("f4", DeclaredTypes::Absent, polygon_rows()).unwrap();
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::MultiPolygon);
    assert_eq!(declared(&ds), None, "absent is not the empty list");
    let ds = open("f4-empty", json("[]"), polygon_rows()).unwrap();
    assert_eq!(
        declared(&ds),
        Some(Vec::new()),
        "and the empty list is not absent"
    );

    // F-5.
    let detail = refusal(open("f5", json(r#"["Polygon", 3]"#), polygon_rows()));
    assert!(detail.starts_with("[P6 placeholder] "), "{detail}");
    assert!(detail.contains("member 1 is not a string"), "{detail}");
    let detail = refusal(open("f5-null", json("[null]"), polygon_rows()));
    assert!(detail.contains("member 0 is not a string"), "{detail}");
    // A value that is not a list is not folded into the empty list either.
    let detail = refusal(open("f5-scalar", json(r#""Polygon""#), polygon_rows()));
    assert!(detail.starts_with("[P6 placeholder] "), "{detail}");
}

/// A-P1. P-1 to P-5: the encoding each declared set selects, or the refusal. `["Point"]` and
/// `["point"]` give `geoarrow.point` with the declaration kept as written, the envelope carrying
/// the same value; a set that mixes kinds is refused (A-P2 reads its wording); `["MultiPoint"]` and
/// `["Point Z"]` are refused with the sighted template, which renders three types.
///
/// RECORDED MUTATION: in `geoarrow::encoding_for_declared_types`, delete the branch that gives a
/// set whose members are all `Point` the point encoding (E-P2 check 3). `["Point"]` then falls to
/// the mixed-kinds refusal and this test fails by name at P-1's open.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `a_declared_point_set_selects_the_point_encoding_and_other_sets_are_refused` FAILED with the
/// mutation applied, at P-1's open (`unwrap` on the mixed-kinds refusal), then reverted.
#[test]
fn a_declared_point_set_selects_the_point_encoding_and_other_sets_are_refused() {
    // P-1: [Point] -> point; six rows.
    let ds = open("p1", json(r#"["Point"]"#), p1()).unwrap();
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::Point);
    assert_eq!(declared(&ds), Some(vec!["Point".to_string()]));
    let schema = ds.envelope().schema();
    assert_eq!(
        schema.metadata().get("geometry_encoding").unwrap(),
        "geoarrow.point"
    );
    assert_eq!(
        schema
            .field(1)
            .metadata()
            .get("ARROW:extension:name")
            .unwrap(),
        "geoarrow.point",
        "the envelope key and the geometry field are one value"
    );

    // P-2: a lower-case name is still Point, and the declaration is kept as written.
    let ds = open("p2", json(r#"["point"]"#), p1()).unwrap();
    assert_eq!(ds.geometry_encoding(), GeometryEncoding::Point);
    assert_eq!(declared(&ds), Some(vec!["point".to_string()]));

    // P-3: a polygonal member beside Point is refused at open as `engine.geo_metadata`.
    for (name, set) in [
        ("p3a", r#"["Point","Polygon"]"#),
        ("p3b", r#"["MultiPolygon","Point"]"#),
    ] {
        refusal(open(name, json(set), p1()));
    }

    // P-4 and P-5: the sighted template, its readable-set clause rendering three types.
    assert_eq!(
        refusal(open("p4", json(r#"["MultiPoint"]"#), p1())),
        "geometry_types [\"MultiPoint\"] include types this engine does not read; it reads \
         Polygon, MultiPolygon and Point"
    );
    assert_eq!(
        refusal(open("p5", json(r#"["Point Z"]"#), p1())),
        "geometry_types [\"Point Z\"] include types this engine does not read; it reads \
         Polygon, MultiPolygon and Point"
    );
}

/// A-P2 (OPEN-2, ruled (A)). P-3's detail is the ruling's placeholder draft, `[P6 placeholder]`-
/// marked, with the declared list rendered as `{:?}` renders it, in declared order and case as
/// written, under the variant's unchanged `Display` prefix.
///
/// RECORDED MUTATION: in `geoarrow::encoding_for_declared_types`, give a set that mixes kinds
/// `MultiPolygon` instead of refusing it (the final `else` returns `Ok(MultiPolygon)`). The mixed
/// file is then admitted and this test fails by name at its refusal.
///
/// Observed over `d3fe6055` on the uncommitted tree of the engine commit:
/// `a_set_that_mixes_kinds_is_refused_with_the_rulings_placeholder_detail` FAILED with the mutation
/// applied, at `expected a refusal at open, the file was admitted`, then reverted.
#[test]
fn a_set_that_mixes_kinds_is_refused_with_the_rulings_placeholder_detail() {
    // The ruling's draft (question round 62, item 2), byte-copied by script from the directive.
    const RULED: &str = "geometry_types [<declared list>] mix polygonal and point types; this engine reads one kind per geometry column";
    let expect = |list: &str| {
        format!(
            "[P6 placeholder] {}",
            RULED.replace("[<declared list>]", list)
        )
    };

    let detail = refusal(open("a-p2", json(r#"["Point","Polygon"]"#), p1()));
    assert_eq!(detail, expect(r#"["Point", "Polygon"]"#));
    // The list is rendered in declared order and case as written, however many members.
    let detail = refusal(open(
        "a-p2-b",
        json(r#"["MULTIPOLYGON","point","Polygon"]"#),
        p1(),
    ));
    assert_eq!(detail, expect(r#"["MULTIPOLYGON", "point", "Polygon"]"#));
    // The variant's `Display` prefix is unchanged.
    let e = EngineError::GeoMetadata(detail.clone());
    assert_eq!(format!("{e}"), format!("geo metadata: {detail}"));
}
