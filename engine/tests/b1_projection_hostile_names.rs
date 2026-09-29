// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Wave-2 A2 adversarial probe of B1's live projection, closed by §10 Amendment 12 (wave-2 A2-1).
//!
//! Treats the file's own column names as attacker-controlled and drives them through the real
//! `Dataset::resolve_projection` / `admit_projection_column` / `stream_projected_with_cancel`
//! entry points, decoded from the Arrow IPC wire.
//!
//! - `hostile_names_*`: names carrying double quotes, a backslash, a comma, a newline, a SQL
//!   keyword, `;--`, surrounding spaces, a Unicode confusable and case-folding collisions all
//!   round-trip to the right column's values. These pass at the baseline and record that the
//!   SELECT-list quoting holds. Unchanged since this file's own reproducer commit (c37b427,
//!   sha256 515db6f692edd7b78393a13b651c9222893101fceecf5626efb2a68ddd58190d).
//! - `a_nul_in_a_column_name_*`: **the defect these once reproduced is now closed.** DuckDB's
//!   Arrow schema truncates a column name at an interior NUL; `dataset::probe_schema` now
//!   reconciles that against DESCRIBE's own (untruncated) name and names the resident field by
//!   the one DuckDB actually binds, so a position whose two names differ is caught by
//!   `engine::addressability::not_addressable`/`not_addressable_for_field` at every use site before
//!   any SQL runs. `N-1` and `N-2` invert the two tests these names used to carry (12.2).
//! - Every fixture this file writes is hash-verified before and after the test that writes it
//!   (§3's discipline; `sha256_file`, `kernel/tests/skp_projection.rs`'s own X12 precedent).

use std::sync::Arc;

use arrow::array::{Array, ArrayRef, BinaryBuilder, Int64Builder, StringBuilder, UInt64Builder};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::ArrowWriter;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;

use spatial_engine::attributes::ProjectionError;
use spatial_engine::identity::IdentityDeclaration;
use spatial_engine::{CancelToken, Dataset, EngineError, ViewportQuery};

const FEATURES: u64 = 10;

/// An attribute column to write: its name and whether it is `Int64` (else `Utf8`). Values are a
/// pure function of the column's position `k` and the row `i`, so a column read from the wrong
/// source is distinguishable by value.
struct Col {
    name: &'static str,
    int: bool,
}

fn text(k: usize, i: u64) -> String {
    format!("col{k}-row{i}")
}

fn write(path: &std::path::Path, id_name: &str, cols: &[Col]) {
    let mut fields = vec![
        Field::new(id_name, DataType::UInt64, false),
        Field::new("geometry", DataType::Binary, false),
    ];
    for c in cols {
        fields.push(Field::new(
            c.name,
            if c.int {
                DataType::Int64
            } else {
                DataType::Utf8
            },
            true,
        ));
    }
    let schema = Arc::new(Schema::new(fields));

    let mut ids = UInt64Builder::new();
    let mut geoms = BinaryBuilder::new();
    for i in 0..FEATURES {
        ids.append_value(i);
        let e = 2_600_000.0 + i as f64;
        let n = 1_200_000.0 + i as f64;
        geoms.append_value(spatial_engine::wkb::encode_polygon(&[vec![
            [e, n],
            [e + 1.0, n],
            [e + 1.0, n + 1.0],
            [e, n],
        ]]));
    }
    let mut arrays: Vec<ArrayRef> = vec![Arc::new(ids.finish()), Arc::new(geoms.finish())];
    for (k, c) in cols.iter().enumerate() {
        if c.int {
            let mut b = Int64Builder::new();
            for i in 0..FEATURES {
                b.append_value(k as i64 * 100 + i as i64);
            }
            arrays.push(Arc::new(b.finish()));
        } else {
            let mut b = StringBuilder::new();
            for i in 0..FEATURES {
                b.append_value(text(k, i));
            }
            arrays.push(Arc::new(b.finish()));
        }
    }
    let batch = RecordBatch::try_new(schema.clone(), arrays).unwrap();

    let geo = format!(
        "{{\"version\":\"1.1.0\",\"primary_column\":\"geometry\",\"columns\":{{\"geometry\":{{\
          \"encoding\":\"WKB\",\"geometry_types\":[\"Polygon\"],\"crs\":{}}}}}}}",
        spatial_engine::fixture::LV95_PROJJSON
    );
    let props = WriterProperties::builder()
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo)]))
        .build();
    let f = std::fs::File::create(path).unwrap();
    let mut w = ArrowWriter::try_new(f, schema, Some(props)).unwrap();
    w.write(&batch).unwrap();
    w.close().unwrap();
}

fn path_for(tag: &str) -> std::path::PathBuf {
    let dir = std::env::temp_dir().join("spatial-engine-b1-hostile-names");
    std::fs::create_dir_all(&dir).unwrap();
    dir.join(format!("{tag}.parquet"))
}

/// §3's fixture discipline: every fixture this file writes is hashed before and after the test
/// that uses it, the same `sha256_file` precedent `kernel/tests/skp_projection.rs`'s X12 (Amendment
/// 5, row 5.6) established.
fn sha256_file(path: &std::path::Path) -> String {
    use sha2::{Digest, Sha256};
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    let digest = Sha256::digest(&bytes);
    digest.iter().map(|b| format!("{b:02x}")).collect()
}

fn file_names(ds: &Dataset) -> Vec<String> {
    ds.file_schema()
        .fields()
        .iter()
        .map(|f| f.name().clone())
        .collect()
}

/// Drain a projected stream. `Ok` holds every emitted batch; `Err` the first batch error.
fn drain(ds: &Dataset, names: &[String]) -> Result<Vec<RecordBatch>, EngineError> {
    let projection = ds.resolve_projection(names).expect("projection admitted");
    let mut stream = ds
        .stream_projected_with_cancel(&ViewportQuery::all(), &projection, CancelToken::new())
        .expect("stream opened");
    let mut out = Vec::new();
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        info?;
        let reader =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        for b in reader {
            out.push(b.unwrap());
        }
        buf.clear();
    }
    Ok(out)
}

fn string_values(batches: &[RecordBatch], name: &str) -> Vec<String> {
    let mut v = Vec::new();
    for b in batches {
        let a = b
            .column_by_name(name)
            .unwrap_or_else(|| panic!("emitted batch lacks {name:?}"))
            .as_any()
            .downcast_ref::<arrow::array::StringArray>()
            .unwrap_or_else(|| panic!("{name:?} is not Utf8"));
        for r in 0..a.len() {
            v.push(a.value(r).to_string());
        }
    }
    v
}

fn expected(k: usize) -> Vec<String> {
    (0..FEATURES).map(|i| text(k, i)).collect()
}

/// Quoting holds: each hostile name, projected alone and all together, returns its own column's
/// values under its own name, in declared order.
#[test]
fn hostile_names_round_trip_to_their_own_columns() {
    let hostile: [&'static str; 8] = [
        "a\"b",
        "x\\y",
        "c,d",
        " sp ",
        "select",
        "new\nline",
        "semi;--",
        "z\u{043e}ne",
    ];
    let cols: Vec<Col> = hostile
        .iter()
        .map(|n| Col {
            name: n,
            int: false,
        })
        .collect();
    let path = path_for("hostile");
    write(&path, "id", &cols);
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(&file_names(&ds)[2..], &hostile.map(String::from));

    for (k, name) in hostile.iter().enumerate() {
        let batches = drain(&ds, &[name.to_string()]).expect("stream");
        assert_eq!(string_values(&batches, name), expected(k), "{name:?} alone");
    }
    // All eight together, reversed, so a positional mix-up cannot pass.
    let all: Vec<String> = hostile.iter().rev().map(|s| s.to_string()).collect();
    let batches = drain(&ds, &all).expect("stream");
    let emitted: Vec<String> = batches[0]
        .schema()
        .fields()
        .iter()
        .skip(2)
        .map(|f| f.name().clone())
        .collect();
    assert_eq!(emitted, all);
    for (k, name) in hostile.iter().enumerate() {
        assert_eq!(
            string_values(&batches, name),
            expected(k),
            "{name:?} in the full projection"
        );
    }
}

/// Case-folding collisions never reach the SELECT list as ambiguous names: DuckDB's reader renames
/// them (`Zone` -> `Zone_1`, and a real `Zone_1` then -> `Zone_1_1`) and the engine's resident schema
/// carries the renamed names, so every projected name binds exactly one column. A column differing
/// from the identity or geometry only in case is renamed the same way (`ID_1`, `GEOMETRY_1`).
#[test]
fn hostile_names_colliding_after_case_folding_bind_one_column_each() {
    let cols = [
        Col {
            name: "zone",
            int: false,
        },
        Col {
            name: "Zone",
            int: false,
        },
        Col {
            name: "Zone_1",
            int: false,
        },
        Col {
            name: "ID",
            int: false,
        },
        Col {
            name: "GEOMETRY",
            int: false,
        },
    ];
    let path = path_for("casefold");
    write(&path, "id", &cols);
    let ds = Dataset::open(&path).expect("open");
    let names = file_names(&ds);
    assert_eq!(
        &names[2..],
        &["zone", "Zone_1", "Zone_1_1", "ID_1", "GEOMETRY_1"]
    );
    let batches = drain(&ds, &names[2..]).expect("stream");
    for (k, name) in names[2..].iter().enumerate() {
        assert_eq!(string_values(&batches, name), expected(k), "{name:?}");
    }
}

/// Under a mapped identity (`parcel_key`), a file column named `ID` is admitted — the reserved-name
/// check is exact-case — and the emitted batch carries both `id` (the identity) and `ID` (an
/// ordinary attribute). Recorded as observed, not as a defect: every name still binds one column.
#[test]
fn hostile_names_an_uppercase_id_under_a_mapped_identity_is_admitted_beside_id() {
    let cols = [Col {
        name: "ID",
        int: false,
    }];
    let path = path_for("mapped-uppercase-id");
    write(&path, "parcel_key", &cols);
    let ds = Dataset::open_with_declared_identity(
        &path,
        IdentityDeclaration::new("parcel_key", "test", "2026-08-06T00:00:00Z"),
        &CancelToken::new(),
    )
    .expect("open");
    assert!(
        ds.resolve_projection(&["id".to_string()]).is_err(),
        "reserved `id` refuses"
    );
    let batches = drain(&ds, &["ID".to_string()]).expect("stream");
    let emitted: Vec<String> = batches[0]
        .schema()
        .fields()
        .iter()
        .map(|f| f.name().clone())
        .collect();
    assert_eq!(emitted, ["id", "geometry", "ID"]);
    assert_eq!(string_values(&batches, "ID"), expected(0));
}

/// A stream opened with a filter admitted through [`spatial_engine::AdmittedPredicate::admit`], on
/// [`drain`]'s own pattern (N-6, N-7).
fn drain_with_filter(
    ds: &Dataset,
    names: &[String],
    filter: spatial_engine::AdmittedPredicate,
) -> Result<Vec<RecordBatch>, EngineError> {
    let projection = ds.resolve_projection(names).expect("projection admitted");
    let q = ViewportQuery::all().with_filter(filter);
    let mut stream = ds
        .stream_projected_with_cancel(&q, &projection, CancelToken::new())
        .expect("stream opened");
    let mut out = Vec::new();
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        info?;
        let reader =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        for b in reader {
            out.push(b.unwrap());
        }
        buf.clear();
    }
    Ok(out)
}

/// N-1 (§10 Amendment 12, wave-2 A2-1): `a_nul_in_a_column_name_is_refused_by_admission_before_
/// any_stream_opens`. Inverts `a_nul_in_a_column_name_is_admitted_then_fails_after_the_stream_
/// opens` (c01): the resident name is now the full, untruncated one DESCRIBE binds by, so
/// `["nu\u{0}l"]` is refused `ColumnNameNotAddressable` and `["nu"]` (the old truncated form) is
/// refused `ColumnUnknown`, with `known_columns` holding the full name. Neither ever opens a stream
/// — only `admit_projection` is called, never `drain`.
/// Mutation: `probe_schema` returns the export's (truncated) names instead of reconciling them
/// against DESCRIBE.
#[test]
fn a_nul_in_a_column_name_is_refused_by_admission_before_any_stream_opens() {
    let cols = [Col {
        name: "nu\0l",
        int: false,
    }];
    let path = path_for("nul-name");
    write(&path, "id", &cols);
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(
        file_names(&ds),
        ["id", "geometry", "nu\u{0}l"],
        "the resident name is the full, untruncated one DESCRIBE binds by"
    );

    let leases_before = ds.connections().leases_issued();

    match ds.admit_projection(&["nu\u{0}l".to_string()]) {
        Err(ProjectionError::ColumnNameNotAddressable { column, .. }) => {
            assert_eq!(column, "nu\u{0}l");
        }
        other => panic!("expected ColumnNameNotAddressable, got {other:?}"),
    }
    match ds.admit_projection(&["nu".to_string()]) {
        Err(ProjectionError::ColumnUnknown {
            column,
            known_columns,
        }) => {
            assert_eq!(column, "nu");
            assert!(
                known_columns.iter().any(|c| c == "nu\u{0}l"),
                "known_columns must hold the full name: {known_columns:?}"
            );
        }
        other => panic!("expected ColumnUnknown, got {other:?}"),
    }

    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "no stream opens -- a projection refusal must not touch the connection pool at all"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

/// N-1a (§10 Amendment 12, wave-2 A2-1): `a_nul_in_a_name_renders_as_a_visible_escape_in_every_
/// engine_message_and_detail` (c01, c16, c20, k1; §8 item 34). The `Display` text and every
/// `detail`/`reason` field of each refusal these files produce must be free of a raw U+0000 —
/// checked here for `ColumnUnknown` and `ColumnNameNotAddressable` (c01), `GeoMetadata` (c16),
/// `IdentityUnusable` (c20) and `NoCoveringBbox` (k1). The fifth shape 12.2 names,
/// `ColumnNotFilterable`, is not reachable live at all (E9: a raw U+0000 in predicate text is
/// refused as unparsable before the namespace ever runs) and is proven instead by `predicate.rs`'s
/// own unit test, N-5, which asserts its `Display` text the same way.
/// Mutation: the rendering function (`addressability::render_visible_escape`) returns the name
/// unchanged.
#[test]
fn a_nul_in_a_name_renders_as_a_visible_escape_in_every_engine_message_and_detail() {
    fn assert_no_raw_nul(label: &str, text: &str) {
        assert!(!text.contains('\0'), "{label}: {text:?}");
        assert!(text.contains("\\u0000"), "{label}: {text:?}");
    }

    // ColumnNameNotAddressable and ColumnUnknown (c01).
    let path = path_for("n1a-projection");
    write(
        &path,
        "id",
        &[Col {
            name: "nu\0l",
            int: false,
        }],
    );
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("open");
    match ds.admit_projection(&["nu\u{0}l".to_string()]) {
        Err(
            ref err @ ProjectionError::ColumnNameNotAddressable {
                column: _,
                ref detail,
            },
        ) => {
            assert_no_raw_nul("ColumnNameNotAddressable detail", detail);
            assert_no_raw_nul("ColumnNameNotAddressable Display", &err.to_string());
        }
        other => panic!("expected ColumnNameNotAddressable, got {other:?}"),
    }
    match ds.admit_projection(&["nu".to_string()]) {
        Err(err @ ProjectionError::ColumnUnknown { .. }) => {
            assert_no_raw_nul("ColumnUnknown Display", &err.to_string());
        }
        other => panic!("expected ColumnUnknown, got {other:?}"),
    }
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );

    // GeoMetadata (c16).
    let path = path_for("n1a-geometry");
    spatial_engine::fixture::write_hostile_geometry_name(
        &path,
        "geo\0m",
        &[spatial_engine::fixture::HostileColumn {
            name: "a",
            int: false,
        }],
    );
    let fixture_sha_before = sha256_file(&path);
    match Dataset::open(&path) {
        Err(EngineError::GeoMetadata(msg)) => {
            assert_no_raw_nul("GeoMetadata Display", &msg);
        }
        Ok(_) => panic!("expected GeoMetadata, got Ok"),
        Err(other) => panic!("expected GeoMetadata, got {other:?}"),
    }
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );

    // IdentityUnusable (c20).
    let path = path_for("n1a-identity");
    write(
        &path,
        "key\0x",
        &[Col {
            name: "a",
            int: false,
        }],
    );
    let fixture_sha_before = sha256_file(&path);
    let declaration = IdentityDeclaration::new("key\u{0}x", "test", "2026-09-29T00:00:00Z");
    match Dataset::open_with_declared_identity(&path, declaration, &CancelToken::new()) {
        Err(
            ref err @ EngineError::IdentityUnusable {
                column: _,
                ref detail,
                ..
            },
        ) => {
            assert_no_raw_nul("IdentityUnusable detail", detail);
            assert_no_raw_nul("IdentityUnusable Display", &err.to_string());
        }
        Ok(_) => panic!("expected IdentityUnusable, got Ok"),
        Err(other) => panic!("expected IdentityUnusable, got {other:?}"),
    }
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );

    // NoCoveringBbox (k1).
    let path = path_for("n1a-covering");
    spatial_engine::fixture::write_hostile_covering(
        &path,
        "bb\0ox",
        ["xmin", "ymin", "xmax", "ymax"],
        ("bb\0ox", ["xmin", "ymin", "xmax", "ymax"]),
    );
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("the open itself must still succeed");
    let mut q = ViewportQuery::all();
    q.bbox = Some(spatial_engine::Bbox {
        xmin: 2_599_000.0,
        ymin: 1_199_000.0,
        xmax: 2_601_000.0,
        ymax: 1_201_000.0,
    });
    q.bbox_crs = Some("EPSG:2056".to_string());
    match ds.stream_with_cancel(&q, CancelToken::new()) {
        Err(ref err @ EngineError::NoCoveringBbox { ref detail }) => {
            assert_no_raw_nul("NoCoveringBbox detail", detail);
            assert_no_raw_nul("NoCoveringBbox Display", &err.to_string());
        }
        Ok(_) => panic!("expected NoCoveringBbox, got Ok"),
        Err(other) => panic!("expected NoCoveringBbox, got {other:?}"),
    }
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

/// N-2 (§10 Amendment 12, wave-2 A2-1): `a_nul_named_column_never_makes_admission_type_a_column_
/// duckdb_does_not_bind`. Inverts `a_nul_in_a_column_name_makes_admission_type_a_different_column_
/// than_duckdb_binds` (c02): the two positions no longer collide under one truncated name, so
/// `zone` admits the real `Utf8` column and streams its own values, and the hostile position's own
/// full name is refused on its own, separately.
/// Mutation: the function in (c) (`addressability::not_addressable`/`not_addressable_for_field`)
/// always returns `None`.
#[test]
fn a_nul_named_column_never_makes_admission_type_a_column_duckdb_does_not_bind() {
    let cols = [
        Col {
            name: "zone\0x",
            int: true,
        },
        Col {
            name: "zone",
            int: false,
        },
    ];
    let path = path_for("nul-type");
    write(&path, "id", &cols);
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(file_names(&ds), ["id", "geometry", "zone\u{0}x", "zone"]);

    let batches = drain(&ds, &["zone".to_string()]).expect("stream");
    // 12.2's own text: "streams values equal to a DuckDB read" — an independent oracle, ordered by
    // `id` (K-1's own X11 precedent), rather than only the writer's own pure function.
    let oracle: Vec<String> = {
        let conn = spatial_engine::fixture::configured_connection().expect("oracle connection");
        let path_str = path.to_string_lossy().to_string();
        let mut stmt = conn
            .prepare("SELECT \"zone\" FROM read_parquet(?) ORDER BY \"id\"")
            .expect("prepare oracle");
        let mut values = Vec::new();
        for batch in stmt.query_arrow([path_str.as_str()]).expect("query oracle") {
            let col = batch
                .column_by_name("zone")
                .unwrap()
                .as_any()
                .downcast_ref::<arrow::array::StringArray>()
                .unwrap();
            for r in 0..col.len() {
                values.push(col.value(r).to_string());
            }
        }
        values
    };
    assert_eq!(
        oracle,
        expected(1),
        "sanity: the oracle itself must match the writer's own values"
    );
    assert_eq!(
        string_values(&batches, "zone"),
        oracle,
        "zone streams its own (Utf8) values, equal to an independent DuckDB read, never the \
         hostile position's"
    );

    let leases_before = ds.connections().leases_issued();
    match ds.admit_projection(&["zone\u{0}x".to_string()]) {
        Err(ProjectionError::ColumnNameNotAddressable { column, .. }) => {
            assert_eq!(column, "zone\u{0}x");
        }
        other => panic!("expected ColumnNameNotAddressable, got {other:?}"),
    }
    assert_eq!(
        ds.connections().leases_issued(),
        leases_before,
        "the hostile position's own refusal must not touch the connection pool at all"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

/// N-6 (§10 Amendment 12, wave-2 A2-1): `a_filter_on_a_file_with_a_nul_named_column_binds_and_
/// streams_its_other_columns` (c01). `"Num" IS NOT NULL` is admitted and streams; `"nu" IS NOT
/// NULL` (the old truncated form) is refused `UnknownColumn`, never `ColumnNotFilterable`.
/// Mutation: `namespace_admit` inserts every field's name into the namespace unconditionally,
/// without the name check `filter_surrogate` (via `filterable_column_type`) applies. Observed by
/// the gate-1 reviewer (`state/consults/gates/2026-09-29-a2-1-gate1-reviewer.md`) at 303dca0:
/// `a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns` FAILED — `"Num"
/// IS NOT NULL` no longer admits at all: `Num is filterable: Filter(RejectedByBinder { detail: "nul
/// byte found in provided data at position: 155" })`. The surrogate SQL then carries every column's
/// name, including the hostile one, so duckdb-rs's own prepare refuses the whole namespace at a
/// lower level than this test's own assertion names — still a failure by name, not a silent pass.
#[test]
fn a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns() {
    let cols = [
        Col {
            name: "nu\0l",
            int: false,
        },
        Col {
            name: "Num",
            int: false,
        },
    ];
    let path = path_for("nul-name-filter");
    write(&path, "id", &cols);
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("open");

    let admitted = spatial_engine::AdmittedPredicate::admit("\"Num\" IS NOT NULL", &ds)
        .expect("Num is filterable");
    let batches = drain_with_filter(&ds, &["Num".to_string()], admitted).expect("stream");
    assert_eq!(string_values(&batches, "Num"), expected(1));

    match spatial_engine::AdmittedPredicate::admit("\"nu\" IS NOT NULL", &ds) {
        Err(spatial_engine::PredicateAdmitError::Filter(
            spatial_engine::FilterError::UnknownColumn { column },
        )) => {
            assert_eq!(column, "nu");
        }
        other => panic!("expected UnknownColumn for the truncated name, got {other:?}"),
    }
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

/// N-7 (§10 Amendment 12, wave-2 A2-1): `a_filter_types_the_column_duckdb_binds_when_a_nul_named_
/// column_shares_its_name` (E7's p2 file: a real `zone` (`Utf8`) ahead of `zone\0x` (`Int64`)).
/// The namespace surrogate for `zone` is `VARCHAR` (never confused with the hostile position's
/// `Int64`), and `zone LIKE 'col0%'` is admitted and streams the rows whose `zone` begins `col0`
/// (`zone = 5` on this file is B-1's own shape, from the original preregistration, and is not
/// asserted here).
/// Mutation: `probe_schema` returns the export's (truncated) names, which would again collide the
/// two `zone` positions under one name.
#[test]
fn a_filter_types_the_column_duckdb_binds_when_a_nul_named_column_shares_its_name() {
    let cols = [
        Col {
            name: "zone",
            int: false,
        },
        Col {
            name: "zone\0x",
            int: true,
        },
    ];
    let path = path_for("nul-shares-name-filter");
    write(&path, "id", &cols);
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(file_names(&ds), ["id", "geometry", "zone", "zone\u{0}x"]);

    let admitted = spatial_engine::AdmittedPredicate::admit("zone LIKE 'col0%'", &ds)
        .expect("zone LIKE 'col0%' must admit over the real Utf8 zone column");
    let batches = drain_with_filter(&ds, &["zone".to_string()], admitted).expect("stream");
    let values = string_values(&batches, "zone");
    assert_eq!(
        values.len(),
        FEATURES as usize,
        "every row's zone begins col0-"
    );
    for v in &values {
        assert!(v.starts_with("col0-"), "{v}");
    }
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

/// N-8 (§10 Amendment 12, wave-2 A2-1): `a_geometry_column_whose_name_contains_u0000_refuses_open_
/// naming_that_fact` (c16, c17). The message never says that the file lacks the column — it does
/// contain it, under a name nothing can address.
/// Mutation: the name check is removed from `dataset::check_geometry_column`.
#[test]
fn a_geometry_column_whose_name_contains_u0000_refuses_open_naming_that_fact() {
    let path = path_for("nul-geometry");
    spatial_engine::fixture::write_hostile_geometry_name(
        &path,
        "geo\0m",
        &[spatial_engine::fixture::HostileColumn {
            name: "a",
            int: false,
        }],
    );
    let fixture_sha_before = sha256_file(&path);
    match Dataset::open(&path) {
        Err(EngineError::GeoMetadata(msg)) => {
            assert!(
                !msg.to_lowercase().contains("does not contain"),
                "the message must never say the file lacks the column: {msg}"
            );
            assert!(msg.contains("\\u0000"), "{msg}");
        }
        Ok(_) => panic!("expected GeoMetadata, got Ok"),
        Err(other) => panic!("expected GeoMetadata, got {other:?}"),
    }
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

/// N-9 (§10 Amendment 12, wave-2 A2-1): `a_native_id_with_u0000_opens_on_the_session_tier_with_no_
/// nul_candidate` (c18). No native `id` can ever match a resident name containing U+0000 (`id`
/// itself carries none), so the open falls to the session tier rather than refusing.
/// Mutation: `identity::candidate_identity_columns` drops the U+0000 omission.
#[test]
fn a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate() {
    let path = path_for("nul-native-id");
    write(
        &path,
        "id\0x",
        &[Col {
            name: "a",
            int: false,
        }],
    );
    let fixture_sha_before = sha256_file(&path);
    let ds = Dataset::open(&path).expect("open must succeed, on the session tier");
    assert!(
        ds.identity().source().is_session_ordinal(),
        "no addressable native `id` exists on this file"
    );
    assert!(
        !ds.identity()
            .candidate_columns()
            .iter()
            .any(|c| c.contains('\0')),
        "the NUL-named column must never be offered as a candidate: {:?}",
        ds.identity().candidate_columns()
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

// N-10 and N-11 moved to `b1_nul_native_id_scan_once.rs` and
// `b1_nul_declared_identity_no_scan.rs`: both need `IDENTITY_VERIFICATION_SCANS`'s counter, which
// is process-global, so each needs a process nothing else in the suite can touch it in
// (`engine/tests/admission_instruments.rs`'s own precedent for why that file holds exactly one
// `#[test]`; every other test in *this* file would otherwise race the same counter).

/// N-12 (§10 Amendment 12, wave-2 A2-1): `a_declared_identity_naming_the_truncated_prefix_is_an_
/// absent_column` (c21). Never `engine.query` — the truncated name the caller declared resolves to
/// nothing in the resident schema, so no scan is ever prepared.
/// Mutation: `probe_schema` returns the export's (truncated) names, which would make the declared
/// (truncated) name resolve.
#[test]
fn a_declared_identity_naming_the_truncated_prefix_is_an_absent_column() {
    let path = path_for("nul-declared-identity-truncated");
    write(
        &path,
        "key\0x",
        &[Col {
            name: "a",
            int: false,
        }],
    );
    let fixture_sha_before = sha256_file(&path);
    let declaration = IdentityDeclaration::new("key", "test", "2026-09-29T00:00:00Z");
    match Dataset::open_with_declared_identity(&path, declaration, &CancelToken::new()) {
        Err(EngineError::IdentityUnusable { column, .. }) => assert_eq!(column, "key"),
        Err(EngineError::Query(msg)) => panic!("must never reach a raw query error: {msg}"),
        Ok(_) => panic!("expected IdentityUnusable, got Ok"),
        Err(other) => panic!("expected IdentityUnusable, got {other:?}"),
    }
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}

/// N-15 (§10 Amendment 12, wave-2 A2-1): `the_schema_probe_classifies_by_position_and_keeps_
/// duckdbs_own_renames` (12.2: c01-c07, c14, c15, o1, o2 — the P0's own case ids,
/// `state/drafts/a2-1-p0/{p0-output.txt,extra-output.txt}`). Every case's resident name is
/// DESCRIBE's own bound name, never the Arrow export's truncated one; `C2` and `Zone_1`/`Zone_1_1`
/// (c07, c14) are byte-equal to today's; and the exported-name metadata key appears at a position
/// exactly when that position's bound and exported names differ — E10's positional rule (o1, o2),
/// not only the two full-admission scenarios (c01, c02) this file's own N-1/N-2 already cover.
/// Mutation: names are taken from `parquet_schema` — `probe_schema`'s DESCRIBE query swapped for
/// `SELECT name FROM parquet_schema(?) OFFSET 1` (12.4 item 29's own named discriminator). Observed
/// (gate-1 correction round 1, uncommitted on base 303dca0):
/// `the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames` FAILED on the c07 case —
/// `left: [""] / right: ["C2"]` — because `parquet_schema` disagrees with the binder in exactly the
/// two cases E5 names (c07, c14; `docs`/12.1(a)'s own "a bind check or `parquet_schema` cannot
/// supply" reasoning).
// (case id, written columns, expected resident names at positions 2.., expected
// exported-name-metadata presence at each of those positions) -- named, not inlined, on
// `kernel/tests/skp_projection.rs`'s own `ProjectionRefusalCase` precedent (clippy's
// `type_complexity` lint).
type N15Case = (&'static str, Vec<Col>, Vec<&'static str>, Vec<bool>);

#[test]
fn the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames() {
    let cases: Vec<N15Case> = vec![
        (
            "c01",
            vec![
                Col {
                    name: "nu\0l",
                    int: false,
                },
                Col {
                    name: "Num",
                    int: false,
                },
            ],
            vec!["nu\u{0}l", "Num"],
            vec![true, false],
        ),
        (
            "c02",
            vec![
                Col {
                    name: "zone\0x",
                    int: true,
                },
                Col {
                    name: "zone",
                    int: false,
                },
            ],
            vec!["zone\u{0}x", "zone"],
            vec![true, false],
        ),
        (
            "c03",
            vec![
                Col {
                    name: "zone",
                    int: false,
                },
                Col {
                    name: "zone\0x",
                    int: true,
                },
            ],
            vec!["zone", "zone\u{0}x"],
            vec![false, true],
        ),
        (
            "c04",
            vec![Col {
                name: "\0lead",
                int: false,
            }],
            vec!["\u{0}lead"],
            vec![true],
        ),
        (
            "c05",
            vec![Col {
                name: "trail\0",
                int: false,
            }],
            vec!["trail\u{0}"],
            vec![true],
        ),
        (
            "c06",
            vec![Col {
                name: "\0",
                int: false,
            }],
            vec!["\u{0}"],
            vec![true],
        ),
        (
            "c07",
            vec![Col {
                name: "",
                int: false,
            }],
            vec!["C2"],
            vec![false],
        ),
        (
            "c14",
            vec![
                Col {
                    name: "zone",
                    int: false,
                },
                Col {
                    name: "Zone",
                    int: false,
                },
                Col {
                    name: "Zone_1",
                    int: false,
                },
            ],
            vec!["zone", "Zone_1", "Zone_1_1"],
            vec![false, false, false],
        ),
        (
            "c15",
            vec![
                Col {
                    name: "Num\0x",
                    int: true,
                },
                Col {
                    name: "num",
                    int: false,
                },
            ],
            vec!["Num\u{0}x", "num"],
            vec![true, false],
        ),
        (
            "o1",
            vec![
                Col {
                    name: "a\0x",
                    int: false,
                },
                Col {
                    name: "a\0y",
                    int: false,
                },
            ],
            vec!["a\u{0}x", "a\u{0}y"],
            vec![true, true],
        ),
        (
            "o2",
            vec![
                Col {
                    name: "zone\0x",
                    int: false,
                },
                Col {
                    name: "ZONE\0x",
                    int: false,
                },
            ],
            vec!["zone\u{0}x", "ZONE\u{0}x_1"],
            vec![true, true],
        ),
    ];

    for (tag, cols, expected_names, expected_metadata) in cases {
        let path = path_for(&format!("n15-{tag}"));
        write(&path, "id", &cols);
        let fixture_sha_before = sha256_file(&path);
        let ds = Dataset::open(&path).unwrap_or_else(|e| panic!("{tag}: open: {e:?}"));
        assert_eq!(
            &file_names(&ds)[2..],
            expected_names.as_slice(),
            "{tag}: resident names must be DESCRIBE's own bound names, positionally"
        );
        for (i, must_carry_metadata) in expected_metadata.iter().enumerate() {
            let carries = !ds.file_schema().field(2 + i).metadata().is_empty();
            assert_eq!(
                carries, *must_carry_metadata,
                "{tag}: field {i} exported-name metadata presence"
            );
        }
        assert_eq!(
            sha256_file(&path),
            fixture_sha_before,
            "{tag}: the fixture file must be unchanged by this run"
        );
    }
}
