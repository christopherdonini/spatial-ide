// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! §10 Amendment 12 (wave-2 A2-1), N-13 and N-14: a declared covering whose path — the struct
//! column's own name, or one of its children — contains U+0000. Built from the P0 covering probe's
//! own writer (`state/drafts/a2-1-p0/covering-probe.rs.txt`), promoted to
//! `engine::fixture::write_hostile_covering`.
//!
//! Every fixture this file writes is hash-verified before and after the test that writes it (§3's
//! discipline; `sha256_file`, `kernel/tests/skp_projection.rs`'s own X12 precedent).

use std::sync::Arc;

use arrow::array::{
    ArrayRef, BinaryBuilder, Float64Array, StringBuilder, StructArray, UInt64Builder,
};
use arrow::datatypes::{DataType, Field, Fields, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::ArrowWriter;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;

use spatial_engine::fixture::write_hostile_covering;
use spatial_engine::{Bbox, CancelToken, Dataset, EngineError, ViewportQuery};

fn path_for(tag: &str) -> std::path::PathBuf {
    let dir = std::env::temp_dir().join("spatial-engine-b1-hostile-covering");
    std::fs::create_dir_all(&dir).unwrap();
    dir.join(format!("{tag}.parquet"))
}

/// §3's fixture discipline (see the module doc).
fn sha256_file(path: &std::path::Path) -> String {
    use sha2::{Digest, Sha256};
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    let digest = Sha256::digest(&bytes);
    digest.iter().map(|b| format!("{b:02x}")).collect()
}

/// A GeoParquet file under the **format default** (no `crs` key, degrees, no geo `bbox` member) —
/// the shape `state/drafts/a2-1-p0/extra-probe.rs.txt`'s `write(..., degrees: true, ...)` wrote for
/// E6's p1a/p1b files, promoted here local to this one test: `write_hostile_covering` always
/// declares LV95, which is not this shape.
fn write_format_default_covering(path: &std::path::Path, struct_name: &str, children: [&str; 4]) {
    const FEATURES: u64 = 10;
    let mut ids = UInt64Builder::new();
    let mut geoms = BinaryBuilder::new();
    let (mut x0, mut y0, mut x1, mut y1) = (vec![], vec![], vec![], vec![]);
    for i in 0..FEATURES {
        ids.append_value(i);
        let (e, n, d) = (7.4 + i as f64 * 0.001, 46.9, 0.0005);
        geoms.append_value(spatial_engine::wkb::encode_polygon(&[vec![
            [e, n],
            [e + d, n],
            [e + d, n + d],
            [e, n],
        ]]));
        x0.push(e);
        y0.push(n);
        x1.push(e + d);
        y1.push(n + d);
    }
    let mut fields = vec![
        Field::new("id", DataType::UInt64, false),
        Field::new("geometry", DataType::Binary, false),
    ];
    let mut a = StringBuilder::new();
    for i in 0..FEATURES {
        a.append_value(format!("col0-row{i}"));
    }
    fields.push(Field::new("a", DataType::Utf8, true));

    let child_fields: Vec<Field> = children
        .iter()
        .map(|c| Field::new(*c, DataType::Float64, false))
        .collect();
    let st = StructArray::new(
        Fields::from(child_fields.clone()),
        vec![
            Arc::new(Float64Array::from(x0)),
            Arc::new(Float64Array::from(y0)),
            Arc::new(Float64Array::from(x1)),
            Arc::new(Float64Array::from(y1)),
        ],
        None,
    );
    fields.push(Field::new(
        struct_name,
        DataType::Struct(Fields::from(child_fields)),
        false,
    ));

    let schema = Arc::new(Schema::new(fields));
    let arrays: Vec<ArrayRef> = vec![
        Arc::new(ids.finish()),
        Arc::new(geoms.finish()),
        Arc::new(a.finish()),
        Arc::new(st),
    ];
    let batch = RecordBatch::try_new(schema.clone(), arrays).unwrap();

    let j = |s: &str| serde_json::to_string(s).unwrap();
    let covering_json = format!(
        ",\"covering\":{{\"bbox\":{{\"xmin\":[{s},{}],\"ymin\":[{s},{}],\"xmax\":[{s},{}],\"ymax\":[{s},{}]}}}}",
        j(children[0]), j(children[1]), j(children[2]), j(children[3]), s = j(struct_name)
    );
    let geo = format!(
        "{{\"version\":\"1.1.0\",\"primary_column\":\"geometry\",\"columns\":{{\"geometry\":{{\
          \"encoding\":\"WKB\",\"geometry_types\":[\"Polygon\"]{covering_json}}}}}}}"
    );
    let props = WriterProperties::builder()
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo)]))
        .build();
    let f = std::fs::File::create(path).unwrap();
    let mut w = ArrowWriter::try_new(f, schema, Some(props)).unwrap();
    w.write(&batch).unwrap();
    w.close().unwrap();
}

fn bbox_query() -> ViewportQuery {
    let mut q = ViewportQuery::all();
    q.bbox = Some(Bbox {
        xmin: 2_599_000.0,
        ymin: 1_199_000.0,
        xmax: 2_601_000.0,
        ymax: 1_201_000.0,
    });
    q.bbox_crs = Some("EPSG:2056".to_string());
    q
}

/// N-13 (k1, k2): `a_covering_whose_path_contains_u0000_is_unusable_and_a_bbox_query_refuses_
/// before_any_lease`. The open succeeds; the covering is recorded unusable
/// (`Dataset::covering()` returns `None`); a bbox query refuses `NoCoveringBbox` before any lease;
/// the no-bbox stream is unchanged. Both the struct's own name (k1) and one child's (k2) are
/// checked.
/// Mutation: `Dataset::covering()` (or its backing field) returns the declared covering whatever
/// its usability.
#[test]
fn a_covering_whose_path_contains_u0000_is_unusable_and_a_bbox_query_refuses_before_any_lease() {
    // k1: the struct column's own name contains U+0000.
    let path = path_for("k1-struct-nul");
    write_hostile_covering(
        &path,
        "bb\0ox",
        ["xmin", "ymin", "xmax", "ymax"],
        ("bb\0ox", ["xmin", "ymin", "xmax", "ymax"]),
    );
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("the open itself must still succeed");
    assert!(
        ds.covering().is_none(),
        "a covering whose path is not addressable is not usable"
    );

    let leases_before = ds.connections().leases_issued();
    match ds.stream_with_cancel(&bbox_query(), CancelToken::new()) {
        Err(EngineError::NoCoveringBbox { detail }) => {
            assert!(!detail.contains('\0'), "{detail:?}");
        }
        other => panic!(
            "expected NoCoveringBbox before any lease, got {}",
            describe(other)
        ),
    }
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "k1: before any lease -- a covering refusal must not touch the connection pool"
    );
    // The no-bbox stream is unchanged: it opens and produces a batch, covering or not.
    let mut stream = ds
        .stream_with_cancel(&ViewportQuery::all(), CancelToken::new())
        .expect("no-bbox stream opens");
    let mut buf = Vec::new();
    let mut n = 0;
    while let Some(info) = stream.next_into(&mut buf) {
        info.expect("no item error");
        n += 1;
        buf.clear();
    }
    assert!(
        n > 0,
        "the no-bbox stream must still produce at least one batch"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "k1: the fixture file must be unchanged by this run"
    );

    // k2: one child segment contains U+0000; the struct's own name is clean.
    let path = path_for("k2-child-nul");
    write_hostile_covering(
        &path,
        "bbox",
        ["xmin\0a", "ymin", "xmax", "ymax"],
        ("bbox", ["xmin\0a", "ymin", "xmax", "ymax"]),
    );
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("the open itself must still succeed");
    assert!(
        ds.covering().is_none(),
        "a covering whose child segment is not addressable is not usable"
    );
    let leases_before = ds.connections().leases_issued();
    match ds.stream_with_cancel(&bbox_query(), CancelToken::new()) {
        Err(EngineError::NoCoveringBbox { .. }) => {}
        other => panic!(
            "expected NoCoveringBbox before any lease, got {}",
            describe(other)
        ),
    }
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "k2: before any lease -- a covering refusal must not touch the connection pool"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "k2: the fixture file must be unchanged by this run"
    );
}

/// N-14 (E6's p1a/p1b files): `a_nul_covering_under_the_format_default_records_not_checked_with_
/// the_true_reason`. Under the format default (no `crs` key, degrees, no geo `bbox` member),
/// the sanity level is `NotChecked`; the reason names U+0000 and never says the schema lacks the
/// column; a bbox query refuses `NoCoveringBbox` before any lease. Both p1a (the struct column's
/// own name contains U+0000) and p1b (a child segment does, the struct's own name clean) are
/// checked, the same k1/k2 split N-13 makes for the LV95 shape.
/// Mutation: `sanity_check`'s path check skips the not-addressable check (falls straight to
/// `field_path_exists`, R-S3's own "the schema does not contain" wording).
#[test]
fn a_nul_covering_under_the_format_default_records_not_checked_with_the_true_reason() {
    // p1a: the struct column's own name contains U+0000.
    let path = path_for("p1a-format-default-struct-nul");
    write_format_default_covering(&path, "bb\0ox", ["xmin", "ymin", "xmax", "ymax"]);
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("the format default admits an undeclared CRS file");
    let admission = ds.admission().expect("admission is always recorded");
    assert_eq!(
        admission.sanity_level,
        spatial_engine::geoparquet::SanityLevel::NotChecked
    );
    assert!(
        admission.sanity_reason.contains("U+0000"),
        "{}",
        admission.sanity_reason
    );
    assert!(
        !admission
            .sanity_reason
            .to_lowercase()
            .contains("does not contain"),
        "{}",
        admission.sanity_reason
    );

    let mut q = ViewportQuery::all();
    q.bbox = Some(Bbox {
        xmin: 7.0,
        ymin: 46.0,
        xmax: 8.0,
        ymax: 47.0,
    });
    q.bbox_crs = Some("OGC:CRS84".to_string());
    let leases_before = ds.connections().leases_issued();
    match ds.stream_with_cancel(&q, CancelToken::new()) {
        Err(EngineError::NoCoveringBbox { .. }) => {}
        other => panic!(
            "p1a: expected NoCoveringBbox before any lease, got {}",
            describe(other)
        ),
    }
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "p1a: before any lease -- a covering refusal must not touch the connection pool"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "p1a: the fixture file must be unchanged by this run"
    );

    // p1b: one child segment contains U+0000; the struct's own name is clean.
    let path = path_for("p1b-format-default-child-nul");
    write_format_default_covering(&path, "bbox", ["xmin\0a", "ymin", "xmax", "ymax"]);
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("the format default admits an undeclared CRS file");
    let admission = ds.admission().expect("admission is always recorded");
    assert_eq!(
        admission.sanity_level,
        spatial_engine::geoparquet::SanityLevel::NotChecked
    );
    assert!(
        admission.sanity_reason.contains("U+0000"),
        "{}",
        admission.sanity_reason
    );
    assert!(
        !admission
            .sanity_reason
            .to_lowercase()
            .contains("does not contain"),
        "{}",
        admission.sanity_reason
    );
    let leases_before = ds.connections().leases_issued();
    match ds.stream_with_cancel(&q, CancelToken::new()) {
        Err(EngineError::NoCoveringBbox { .. }) => {}
        other => panic!(
            "p1b: expected NoCoveringBbox before any lease, got {}",
            describe(other)
        ),
    }
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "p1b: before any lease -- a covering refusal must not touch the connection pool"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "p1b: the fixture file must be unchanged by this run"
    );
}

fn describe(r: Result<spatial_engine::BatchStream, EngineError>) -> String {
    match r {
        Ok(_) => "Ok(stream)".to_string(),
        Err(e) => format!("{e:?}"),
    }
}
