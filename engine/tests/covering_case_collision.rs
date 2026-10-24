// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `engine/COVERING-CASE-COLLISION-BINDS-OTHER-COLUMN-FULL-PREREGISTRATION.md` §4: a name the file
//! supplies (a covering path, `geo.primary_column`) is judged against the file's own names, not
//! the names DuckDB binds. A name matching more than one of the file's names, or one whose bound
//! column is not the column the file names, refuses the open by name; a name matching none is
//! absent.
//!
//! Every fixture is written in-test, with the P0's row shapes (Amendment 1, items 2 and 5), and is
//! hash-verified before and after the test that writes it. Every refusal asserts its whole
//! Display, the texts of Amendment 1, item 5.

use std::path::{Path, PathBuf};
use std::sync::Arc;

use arrow::array::{
    ArrayRef, BinaryBuilder, Float64Array, StringBuilder, StructArray, UInt64Builder,
};
use arrow::datatypes::{DataType, Field, Fields, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::ArrowWriter;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;

use spatial_engine::{Bbox, CancelToken, Dataset, EngineError, PoolConfig, ViewportQuery};

const N: u64 = 10;
/// Added to the xmin and xmax values of a struct built with `off`, so a bbox query over the true
/// extent reads 0 rows from it and 10 from a true one.
const OFFSET: f64 = 1_000_000.0;

/// One struct child: its name, its role (0 xmin, 1 ymin, 2 xmax, 3 ymax) and whether its values
/// are offset.
type Child = (&'static str, usize, bool);

struct Spec {
    /// Binary geometry columns: name and an easting offset, so the column read is identifiable.
    geoms: Vec<(&'static str, f64)>,
    structs: Vec<(&'static str, Vec<Child>)>,
    /// Utf8 attribute columns, written last.
    attrs: Vec<&'static str>,
    primary: &'static str,
    covering: Option<[Vec<&'static str>; 4]>,
}

fn std_struct(name: &'static str) -> (&'static str, Vec<Child>) {
    (
        name,
        vec![
            ("xmin", 0, false),
            ("ymin", 1, false),
            ("xmax", 2, false),
            ("ymax", 3, false),
        ],
    )
}

/// The same, with the xmin and xmax values offset: it reads 0 rows over the true extent.
fn offset_struct(name: &'static str) -> (&'static str, Vec<Child>) {
    (
        name,
        vec![
            ("xmin", 0, true),
            ("ymin", 1, false),
            ("xmax", 2, true),
            ("ymax", 3, false),
        ],
    )
}

/// A covering whose four paths are `<name>.<child>`, with xmin's child named `xmin_child`.
fn bbox_paths(name: &'static str, xmin_child: &'static str) -> [Vec<&'static str>; 4] {
    [
        vec![name, xmin_child],
        vec![name, "ymin"],
        vec![name, "xmax"],
        vec![name, "ymax"],
    ]
}

fn spec(geoms: &[(&'static str, f64)], primary: &'static str) -> Spec {
    Spec {
        geoms: geoms.to_vec(),
        structs: vec![],
        attrs: vec![],
        primary,
        covering: None,
    }
}

fn write(path: &Path, sp: &Spec) {
    let mut ids = UInt64Builder::new();
    let mut vals: [Vec<f64>; 4] = [vec![], vec![], vec![], vec![]];
    for i in 0..N {
        ids.append_value(i);
        let (e, n) = (2_600_000.0 + i as f64, 1_200_000.0 + i as f64);
        vals[0].push(e);
        vals[1].push(n);
        vals[2].push(e + 1.0);
        vals[3].push(n + 1.0);
    }
    let mut fields = vec![Field::new("id", DataType::UInt64, false)];
    let mut arrays: Vec<ArrayRef> = vec![Arc::new(ids.finish())];
    for (name, offset) in &sp.geoms {
        let mut geoms = BinaryBuilder::new();
        for i in 0..N {
            let (e, n) = (2_600_000.0 + i as f64 + offset, 1_200_000.0 + i as f64);
            geoms.append_value(spatial_engine::wkb::encode_polygon(&[vec![
                [e, n],
                [e + 1.0, n],
                [e + 1.0, n + 1.0],
                [e, n],
            ]]));
        }
        fields.push(Field::new(*name, DataType::Binary, false));
        arrays.push(Arc::new(geoms.finish()));
    }
    for (name, children) in &sp.structs {
        let child_fields: Fields = children
            .iter()
            .map(|(n, _, _)| Field::new(*n, DataType::Float64, false))
            .collect();
        let child_arrays: Vec<ArrayRef> = children
            .iter()
            .map(|(_, role, offset)| {
                let v: Vec<f64> = vals[*role]
                    .iter()
                    .map(|x| {
                        if *offset && role % 2 == 0 {
                            x + OFFSET
                        } else {
                            *x
                        }
                    })
                    .collect();
                Arc::new(Float64Array::from(v)) as ArrayRef
            })
            .collect();
        arrays.push(Arc::new(StructArray::new(
            child_fields.clone(),
            child_arrays,
            None,
        )));
        fields.push(Field::new(*name, DataType::Struct(child_fields), false));
    }
    for (k, name) in sp.attrs.iter().enumerate() {
        let mut b = StringBuilder::new();
        for i in 0..N {
            b.append_value(format!("col{k}-row{i}"));
        }
        fields.push(Field::new(*name, DataType::Utf8, true));
        arrays.push(Arc::new(b.finish()));
    }
    let schema = Arc::new(Schema::new(fields));
    let batch = RecordBatch::try_new(schema.clone(), arrays).expect("batch");

    let paths = |p: &[&str]| serde_json::to_string(p).unwrap();
    let covering = match &sp.covering {
        Some(c) => format!(
            ",\"covering\":{{\"bbox\":{{\"xmin\":{},\"ymin\":{},\"xmax\":{},\"ymax\":{}}}}}",
            paths(&c[0]),
            paths(&c[1]),
            paths(&c[2]),
            paths(&c[3])
        ),
        None => String::new(),
    };
    let primary = serde_json::to_string(sp.primary).unwrap();
    let geo = format!(
        "{{\"version\":\"1.1.0\",\"primary_column\":{primary},\"columns\":{{{primary}:{{\
          \"encoding\":\"WKB\",\"geometry_types\":[\"Polygon\"]{covering},\"crs\":{}}}}}}}",
        spatial_engine::fixture::LV95_PROJJSON
    );
    let props = WriterProperties::builder()
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo)]))
        .build();
    let mut w = ArrowWriter::try_new(std::fs::File::create(path).unwrap(), schema, Some(props))
        .expect("writer");
    w.write(&batch).expect("write");
    w.close().expect("close");
}

fn sha256_file(path: &Path) -> String {
    use sha2::{Digest, Sha256};
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    Sha256::digest(&bytes)
        .iter()
        .map(|b| format!("{b:02x}"))
        .collect()
}

/// A written fixture and its hash. `done` re-hashes it at the end of the test.
struct Fixture {
    path: PathBuf,
    sha: String,
}

impl Fixture {
    fn new(tag: &str, sp: &Spec) -> Self {
        let dir = std::env::temp_dir().join("spatial-engine-covering-case-collision");
        std::fs::create_dir_all(&dir).unwrap();
        Self::at(dir.join(format!("{tag}.parquet")), sp)
    }

    fn at(path: PathBuf, sp: &Spec) -> Self {
        write(&path, sp);
        let sha = sha256_file(&path);
        Self { path, sha }
    }

    fn done(&self) {
        assert_eq!(sha256_file(&self.path), self.sha, "the fixture changed");
    }
}

/// The error an open must end in.
fn refused(path: &Path) -> EngineError {
    match Dataset::open(path) {
        Err(e) => e,
        Ok(_) => panic!("expected the open to be refused"),
    }
}

fn opened(path: &Path) -> Dataset {
    Dataset::open(path).expect("the open succeeds")
}

fn assert_geo_metadata(e: &EngineError, display: &str) {
    assert!(matches!(e, EngineError::GeoMetadata(_)), "{e:?}");
    assert_eq!(e.to_string(), display);
}

fn true_extent_query() -> ViewportQuery {
    let mut q = ViewportQuery::all();
    q.bbox = Some(Bbox {
        xmin: 2_599_999.0,
        ymin: 1_199_999.0,
        xmax: 2_600_011.0,
        ymax: 1_200_011.0,
    });
    q.bbox_crs = Some("EPSG:2056".to_string());
    q
}

/// Rows a bbox query over the true extent returns; every item must be `Ok`.
fn rows_over_true_extent(ds: &Dataset) -> usize {
    let mut stream = ds
        .stream_with_cancel(&true_extent_query(), CancelToken::new())
        .expect("the stream opens");
    let (mut buf, mut rows) = (Vec::new(), 0);
    while let Some(info) = stream.next_into(&mut buf) {
        rows += info.expect("no item error").rows;
        buf.clear();
    }
    rows
}

fn resident_names(ds: &Dataset) -> Vec<String> {
    ds.file_schema()
        .fields()
        .iter()
        .map(|f| f.name().clone())
        .collect()
}

const MORE_THAN_ONE: &str = "which matches more than one name in the file's schema when ASCII \
                             letter case is ignored";

/// CC-1 (P0 row s1): a file holding `BBOX` and `bbox`, the covering declaring `bbox`. DuckDB reads
/// the later one as `bbox_1`, so the first match, the `BBOX` struct, was the one read.
/// Mutation M1: the more-than-one arm is skipped at the top level, the first file match taken.
#[test]
fn a_covering_whose_name_matches_two_of_the_files_names_by_case_refuses_the_open_by_name() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![offset_struct("BBOX"), std_struct("bbox")];
    sp.covering = Some(bbox_paths("bbox", "xmin"));
    let fx = Fixture::new("cc1", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        &format!("geo metadata: the covering names `bbox.xmin`, {MORE_THAN_ONE}: `BBOX`, `bbox`"),
    );
    fx.done();
}

/// CC-2 (P0 row s2): `bbox` holding `xmin` and `XMIN`, with an absent `bbox.zmax` declared for
/// ymax. The refusal wins over the absence.
/// Mutation M2: the more-than-one arm is skipped below the top level. Mutation M3: absence is
/// returned over the four paths before any refusal. Both give `Ok` with the covering dropped.
#[test]
fn a_covering_whose_child_name_matches_two_of_the_files_children_by_case_refuses_the_open_by_name()
{
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![(
        "bbox",
        vec![
            ("xmin", 0, false),
            ("XMIN", 0, true),
            ("ymin", 1, false),
            ("xmax", 2, false),
            ("ymax", 3, false),
        ],
    )];
    sp.covering = Some([
        vec!["bbox", "xmin"],
        vec!["bbox", "ymin"],
        vec!["bbox", "xmax"],
        vec!["bbox", "zmax"],
    ]);
    let fx = Fixture::new("cc2", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        &format!(
            "geo metadata: the covering names `bbox.xmin`, {MORE_THAN_ONE}: `bbox.xmin`, \
             `bbox.XMIN`"
        ),
    );
    fx.done();
}

/// CC-3 (P0 row g1): `bbox`, `BBOX` and a real `BBOX_1`. DuckDB reads the real one as `BBOX_1_1`,
/// so the declared `BBOX_1` matches one file name that is read under another.
/// Mutation M4: clause (b) is skipped at the top level (gives `Ok`, the covering kept).
#[test]
fn a_covering_whose_one_matching_name_duckdb_renamed_refuses_the_open_by_name() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![
        std_struct("bbox"),
        offset_struct("BBOX"),
        std_struct("BBOX_1"),
    ];
    sp.covering = Some(bbox_paths("BBOX_1", "xmin"));
    let fx = Fixture::new("cc3", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        "geo metadata: the covering names `BBOX_1.xmin`, which the file's schema holds as \
         `BBOX_1`, but that column is read under the name `BBOX_1_1`, so the declared name does \
         not read it",
    );
    fx.done();
}

/// CC-4 (P0 row s3): `bbox` holding `xmin`, `XMIN` and a real `XMIN_1`, which DuckDB reads as
/// `XMIN_1_1`.
/// Mutation M5: clause (b) is skipped below the top level.
#[test]
fn a_covering_whose_one_matching_child_duckdb_renamed_refuses_the_open_by_name() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![(
        "bbox",
        vec![
            ("xmin", 0, true),
            ("XMIN", 0, true),
            ("XMIN_1", 0, false),
            ("ymin", 1, false),
            ("xmax", 2, false),
            ("ymax", 3, false),
        ],
    )];
    sp.covering = Some(bbox_paths("bbox", "XMIN_1"));
    let fx = Fixture::new("cc4", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        "geo metadata: the covering names `bbox.XMIN_1`, which the file's schema holds as \
         `bbox.XMIN_1`, but that column is read under the name `bbox.XMIN_1_1`, so the declared \
         name does not read it",
    );
    fx.done();
}

/// CC-5 (P0 row g4): `bbox` and `BBOX`, the covering declaring `BBOX_1`, a name DuckDB generated
/// and the file does not hold. It is absent: the covering is dropped, with the existing text.
/// Mutation M6: a segment with no file match is resolved against the resident schema instead
/// (gives the covering kept).
#[test]
fn a_covering_naming_a_generated_name_the_file_lacks_is_dropped_as_absent() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![std_struct("bbox"), offset_struct("BBOX")];
    sp.covering = Some(bbox_paths("BBOX_1", "xmin"));
    let fx = Fixture::new("cc5", &sp);
    let ds = opened(&fx.path);
    assert!(ds.covering().is_none(), "the covering is dropped");
    let leases = ds.connections().leases_issued();
    match ds.stream_with_cancel(&true_extent_query(), CancelToken::new()) {
        Err(EngineError::NoCoveringBbox { detail }) => assert_eq!(
            detail,
            "the covering names `BBOX_1.xmin`, which the file's schema does not contain"
        ),
        Err(other) => panic!("expected NoCoveringBbox, got {other:?}"),
        Ok(_) => panic!("expected NoCoveringBbox, got a stream"),
    }
    assert_eq!(ds.connections().leases_issued(), leases, "before any lease");
    fx.done();
}

/// CC-6 (P0 row k1, K2): a file under a `year=2024` folder. DuckDB adds `year` after the file's own
/// columns, so the resident schema is longer than the file's; the file's columns keep their
/// positions and the covering is kept.
/// Mutation MKV: exact equality of the root count (gives `InternalInconsistency`).
#[test]
fn a_file_under_a_key_value_folder_opens_with_its_covering_kept() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![std_struct("bbox")];
    sp.covering = Some(bbox_paths("bbox", "xmin"));
    let dir = std::env::temp_dir()
        .join("spatial-engine-covering-case-collision")
        .join("kv")
        .join("year=2024");
    std::fs::create_dir_all(&dir).unwrap();
    let fx = Fixture::at(dir.join("f.parquet"), &sp);
    let ds = opened(&fx.path);
    assert!(ds.covering().is_some(), "the covering is kept");
    assert_eq!(resident_names(&ds), ["id", "geometry", "bbox", "year"]);
    assert_eq!(rows_over_true_extent(&ds), N as usize);
    fx.done();
}

/// CC-7 (P0 row s1's shape): the absent path `extent.xmin` comes before `bbox.ymin`, which matches
/// `BBOX` and `bbox`. The refusal wins whichever comes first.
/// Mutation MO: the first walk that does not resolve, in path order, is returned (gives `Ok`, the
/// covering dropped as absent for `extent.xmin`).
#[test]
fn a_covering_whose_absent_path_comes_before_a_path_matching_two_of_the_files_names_refuses_the_open_by_name(
) {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![offset_struct("BBOX"), std_struct("bbox")];
    sp.covering = Some([
        vec!["extent", "xmin"],
        vec!["bbox", "ymin"],
        vec!["bbox", "xmax"],
        vec!["bbox", "ymax"],
    ]);
    let fx = Fixture::new("cc7", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        &format!("geo metadata: the covering names `bbox.ymin`, {MORE_THAN_ONE}: `BBOX`, `bbox`"),
    );
    fx.done();
}

/// CC-8 (P0 row s4, W1): two columns written byte for byte `bbox`. DuckDB reads the second as
/// `bbox_1`; at main the open succeeded and read the first.
/// Mutation MC8: the matches are collected as distinct names before they are counted (gives `Ok`,
/// the covering kept).
#[test]
fn a_covering_whose_name_two_columns_hold_byte_for_byte_refuses_the_open_by_name() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![std_struct("bbox"), offset_struct("bbox")];
    sp.covering = Some(bbox_paths("bbox", "xmin"));
    let fx = Fixture::new("cc8", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        &format!("geo metadata: the covering names `bbox.xmin`, {MORE_THAN_ONE}: `bbox`, `bbox`"),
    );
    fx.done();
}

/// CC-9: case twins the geo metadata does not name (`zone` and `Zone`, `id` and `ID`) refuse
/// nothing. The attribute names are the renamed ones, and the covering reads the true values.
/// Mutation MC9: the more-than-one check is run over every top-level name of the file, not only
/// the declared ones (gives `Err(GeoMetadata)`).
#[test]
fn case_twins_the_geo_metadata_does_not_name_open_with_the_covering_kept() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![std_struct("bbox")];
    sp.attrs = vec!["zone", "Zone", "ID"];
    sp.covering = Some(bbox_paths("bbox", "xmin"));
    let fx = Fixture::new("cc9", &sp);
    let ds = opened(&fx.path);
    assert!(ds.covering().is_some(), "the covering is kept");
    assert_eq!(
        resident_names(&ds),
        ["id", "geometry", "bbox", "zone", "Zone_1", "ID_1"]
    );
    assert_eq!(rows_over_true_extent(&ds), N as usize);
    fx.done();
}

/// G-1 (P0 row g3): `geometry` and `GEOMETRY`, the primary column declared `GEOMETRY`. At main this
/// was `engine.source`, "does not contain"; the name matches two of the file's names.
/// Mutation MG1: steps 2 and 3 of `check_geometry_column` run before step 1 (gives
/// `Err(GeoMetadata)` with text (g): `GEOMETRY`, read under `GEOMETRY_1`).
#[test]
fn a_primary_column_spelled_like_the_later_of_two_case_twins_refuses_the_open_by_name() {
    let sp = spec(&[("geometry", 0.0), ("GEOMETRY", 10_000.0)], "GEOMETRY");
    let fx = Fixture::new("g1", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        &format!(
            "geo metadata: `geo.primary_column` names `GEOMETRY`, {MORE_THAN_ONE}: `geometry`, \
             `GEOMETRY`"
        ),
    );
    fx.done();
}

/// G-2 (P0 row g2): `geom`, `GEOM` and a real `GEOM_1`, which DuckDB reads as `GEOM_1_1`. The
/// declared `GEOM_1` is the file's third geometry column, read under another name; at main it
/// streamed the file's `GEOM`.
/// Mutation MG2: step 3 of `check_geometry_column` is removed (gives `Ok`).
#[test]
fn a_primary_column_whose_name_collides_with_a_generated_name_refuses_the_open() {
    let sp = spec(
        &[("geom", 0.0), ("GEOM", 10_000.0), ("GEOM_1", 20_000.0)],
        "GEOM_1",
    );
    let fx = Fixture::new("g2", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        "geo metadata: `geo.primary_column` names `GEOM_1`, which the file contains, but that \
         column is read under the name `GEOM_1_1`, so the declared name does not read it",
    );
    fx.done();
}

/// G-3: a file holding only `geometry`, the primary column declared `GEOMETRY`. One match ignoring
/// case, none byte for byte: refused as `engine.source` with the existing text, at main and after.
/// Mutation MG3: that arm raises `GeoMetadata` with the same text. Mutation MG10: a single match
/// ignoring case is taken as the column, as the covering walk does (gives `Err(GeoMetadata)`).
#[test]
fn a_primary_column_the_file_does_not_contain_keeps_its_source_refusal_byte_for_byte() {
    let sp = spec(&[("geometry", 0.0)], "GEOMETRY");
    let fx = Fixture::new("g3", &sp);
    let e = refused(&fx.path);
    assert!(matches!(e, EngineError::Source(_)), "{e:?}");
    assert_eq!(
        e.to_string(),
        "source: `geo.primary_column` names `GEOMETRY`, which the file does not contain"
    );
    fx.done();
}

/// G-4 (P0 row g5): `geometry` and `GEOMETRY`, the primary column declared `GEOMETRY_1`, a name
/// DuckDB generated and the file does not hold. At main it opened and streamed the file's
/// `GEOMETRY`; now it is refused as `engine.source` with the existing text.
/// Mutation MG4: a miss among the file's names falls back to the byte lookup on the resident
/// schema (gives `Ok`).
#[test]
fn a_primary_column_spelled_like_a_generated_name_the_file_does_not_contain_refuses_the_open_as_source(
) {
    let sp = spec(&[("geometry", 0.0), ("GEOMETRY", 10_000.0)], "GEOMETRY_1");
    let fx = Fixture::new("g4", &sp);
    let e = refused(&fx.path);
    assert!(matches!(e, EngineError::Source(_)), "{e:?}");
    assert_eq!(
        e.to_string(),
        "source: `geo.primary_column` names `GEOMETRY_1`, which the file does not contain"
    );
    fx.done();
}

/// G-5: `geometry` (Binary) beside a Utf8 column `GEOMETRY`, the primary column declared
/// `geometry`: the shape removed from the b1 test. At main it opened and read `geometry`.
/// Mutation MG6: the count in step 1 compares bytes, not ASCII case (gives `Ok`).
#[test]
fn a_primary_column_whose_name_matches_two_of_the_files_names_by_case_refuses_the_open_by_name() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.attrs = vec!["GEOMETRY"];
    let fx = Fixture::new("g5", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        &format!(
            "geo metadata: `geo.primary_column` names `geometry`, {MORE_THAN_ONE}: `geometry`, \
             `GEOMETRY`"
        ),
    );
    fx.done();
}

/// G-6 (P0 row g6, W1): two columns written byte for byte `geometry`. DuckDB reads the second as
/// `geometry_1`; at main the open succeeded and streamed the first.
/// Mutation MG7: step 1's matches are collected as distinct names before they are counted (gives
/// `Ok`, streaming the first column).
#[test]
fn a_primary_column_whose_name_two_columns_hold_byte_for_byte_refuses_the_open_by_name() {
    let sp = spec(&[("geometry", 0.0), ("geometry", 10_000.0)], "geometry");
    let fx = Fixture::new("g6", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        &format!(
            "geo metadata: `geo.primary_column` names `geometry`, {MORE_THAN_ONE}: `geometry`, \
             `geometry`"
        ),
    );
    fx.done();
}

/// G-7 (P0 row g7): `geometry` and `GEOMETRY`, the primary column declared `Geometry`: no name
/// byte for byte, two by case. At main this was `engine.source`; the more-than-one check runs
/// before the miss arm.
/// Mutation MG9: step 2's miss arm runs before step 1 (gives `Err(Source)`, the text for `Geometry`).
#[test]
fn a_primary_column_matching_no_name_exactly_but_two_by_case_refuses_the_open_by_name() {
    let sp = spec(&[("geometry", 0.0), ("GEOMETRY", 10_000.0)], "Geometry");
    let fx = Fixture::new("g7", &sp);
    assert_geo_metadata(
        &refused(&fx.path),
        &format!(
            "geo metadata: `geo.primary_column` names `Geometry`, {MORE_THAN_ONE}: `geometry`, \
             `GEOMETRY`"
        ),
    );
    fx.done();
}

/// CK-1: the read of the file's names is bound to the open's cancel token. With the token
/// cancelled before the open, the read ends the open `Cancelled`; nothing before it observes the
/// token (D1 of the form), and the file would otherwise be refused for its `BBOX` and `bbox`.
/// Mutation MK: the read runs outside `cancellable` (gives `Err(GeoMetadata)`).
#[test]
fn the_file_names_read_observes_a_cancel_already_requested() {
    let mut sp = spec(&[("geometry", 0.0)], "geometry");
    sp.structs = vec![offset_struct("BBOX"), std_struct("bbox")];
    sp.covering = Some(bbox_paths("bbox", "xmin"));
    let fx = Fixture::new("ck1", &sp);
    let token = CancelToken::new();
    token.cancel();
    match Dataset::open_cancellable(&fx.path, None, None, &token, PoolConfig::default()) {
        Err(EngineError::Cancelled) => {}
        Err(other) => panic!("expected Cancelled, got {other:?}"),
        Ok(_) => panic!("expected Cancelled, got an open"),
    }
    fx.done();
}
