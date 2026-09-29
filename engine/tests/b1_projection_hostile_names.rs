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
//!   `engine::addressability::not_addressable_reason` at every use site before any SQL runs. `N-1`
//!   and `N-2` invert the two tests these names used to carry (12.2).

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
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(
        file_names(&ds),
        ["id", "geometry", "nu\u{0}l"],
        "the resident name is the full, untruncated one DESCRIBE binds by"
    );

    match ds.admit_projection(&["nu\u{0}l".to_string()]) {
        Err(ProjectionError::ColumnNameNotAddressable { column, .. }) => {
            assert_eq!(column, "nu\u{0}l");
        }
        other => panic!("expected ColumnNameNotAddressable, got {other:?}"),
    }
    match ds.admit_projection(&["nu".to_string()]) {
        Err(ProjectionError::ColumnUnknown { column, known_columns }) => {
            assert_eq!(column, "nu");
            assert!(
                known_columns.iter().any(|c| c == "nu\u{0}l"),
                "known_columns must hold the full name: {known_columns:?}"
            );
        }
        other => panic!("expected ColumnUnknown, got {other:?}"),
    }
}

/// N-1a (§10 Amendment 12, wave-2 A2-1): `a_nul_in_a_name_renders_as_a_visible_escape_in_every_
/// engine_message_and_detail` (c01, c16, c20, k1; §8 item 34). Four of the five refusal shapes
/// N-1a names are reachable live and checked here; the fifth, `ColumnNotFilterable`, is not
/// reachable live at all (E9: a raw U+0000 in predicate text is refused as unparsable before the
/// namespace ever runs) and is proven instead by `predicate.rs`'s own unit test, N-5.
/// Mutation: the rendering function (`addressability::render_visible_escape`) returns the name
/// unchanged.
#[test]
fn a_nul_in_a_name_renders_as_a_visible_escape_in_every_engine_message_and_detail() {
    // ColumnNameNotAddressable (c01).
    let path = path_for("n1a-projection");
    write(&path, "id", &[Col { name: "nu\0l", int: false }]);
    let ds = Dataset::open(&path).expect("open");
    match ds.admit_projection(&["nu\u{0}l".to_string()]) {
        Err(ProjectionError::ColumnNameNotAddressable { column: _, detail }) => {
            assert!(!detail.contains('\0'), "{detail:?}");
            assert!(detail.contains("\\u0000"), "{detail:?}");
        }
        other => panic!("expected ColumnNameNotAddressable, got {other:?}"),
    }

    // GeoMetadata (c16).
    let path = path_for("n1a-geometry");
    spatial_engine::fixture::write_hostile_geometry_name(
        &path,
        "geo\0m",
        &[spatial_engine::fixture::HostileColumn { name: "a", int: false }],
    );
    match Dataset::open(&path) {
        Err(EngineError::GeoMetadata(msg)) => {
            assert!(!msg.contains('\0'), "{msg:?}");
            assert!(msg.contains("\\u0000"), "{msg:?}");
        }
        Ok(_) => panic!("expected GeoMetadata, got Ok"),
        Err(other) => panic!("expected GeoMetadata, got {other:?}"),
    }

    // IdentityUnusable (c20).
    let path = path_for("n1a-identity");
    write(&path, "key\0x", &[Col { name: "a", int: false }]);
    let declaration = IdentityDeclaration::new("key\u{0}x", "test", "2026-09-29T00:00:00Z");
    match Dataset::open_with_declared_identity(&path, declaration, &CancelToken::new()) {
        Err(EngineError::IdentityUnusable { column: _, detail, .. }) => {
            assert!(!detail.contains('\0'), "{detail:?}");
            assert!(detail.contains("\\u0000"), "{detail:?}");
        }
        Ok(_) => panic!("expected IdentityUnusable, got Ok"),
        Err(other) => panic!("expected IdentityUnusable, got {other:?}"),
    }

    // NoCoveringBbox (k1).
    let path = path_for("n1a-covering");
    spatial_engine::fixture::write_hostile_covering(
        &path,
        "bb\0ox",
        ["xmin", "ymin", "xmax", "ymax"],
        ("bb\0ox", ["xmin", "ymin", "xmax", "ymax"]),
    );
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
        Err(EngineError::NoCoveringBbox { detail }) => {
            assert!(!detail.contains('\0'), "{detail:?}");
            assert!(detail.contains("\\u0000"), "{detail:?}");
        }
        Ok(_) => panic!("expected NoCoveringBbox, got Ok"),
        Err(other) => panic!("expected NoCoveringBbox, got {other:?}"),
    }
}

/// N-2 (§10 Amendment 12, wave-2 A2-1): `a_nul_named_column_never_makes_admission_type_a_column_
/// duckdb_does_not_bind`. Inverts `a_nul_in_a_column_name_makes_admission_type_a_different_column_
/// than_duckdb_binds` (c02): the two positions no longer collide under one truncated name, so
/// `zone` admits the real `Utf8` column and streams its own values, and the hostile position's own
/// full name is refused on its own, separately.
/// Mutation: the function in (c) (`addressability::not_addressable_reason`) always returns `None`.
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
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(file_names(&ds), ["id", "geometry", "zone\u{0}x", "zone"]);

    let batches = drain(&ds, &["zone".to_string()]).expect("stream");
    assert_eq!(
        string_values(&batches, "zone"),
        expected(1),
        "zone streams its own (Utf8) values, never the hostile position's"
    );

    match ds.admit_projection(&["zone\u{0}x".to_string()]) {
        Err(ProjectionError::ColumnNameNotAddressable { column, .. }) => {
            assert_eq!(column, "zone\u{0}x");
        }
        other => panic!("expected ColumnNameNotAddressable, got {other:?}"),
    }
}

/// N-6 (§10 Amendment 12, wave-2 A2-1): `a_filter_on_a_file_with_a_nul_named_column_binds_and_
/// streams_its_other_columns` (c01). `"Num" IS NOT NULL` is admitted and streams; `"nu" IS NOT
/// NULL` (the old truncated form) is refused `UnknownColumn`, never `ColumnNotFilterable`.
/// Mutation: `namespace_admit` inserts every field without the name check (the surrogate SQL would
/// then carry U+0000, which duckdb-rs itself refuses at prepare — this mutation is therefore
/// observed as a different, lower-level failure than the one this test names, not a silent pass).
#[test]
fn a_filter_on_a_file_with_a_nul_named_column_binds_and_streams_its_other_columns() {
    let cols = [
        Col { name: "nu\0l", int: false },
        Col { name: "Num", int: false },
    ];
    let path = path_for("nul-name-filter");
    write(&path, "id", &cols);
    let ds = Dataset::open(&path).expect("open");

    let admitted = spatial_engine::AdmittedPredicate::admit("\"Num\" IS NOT NULL", &ds)
        .expect("Num is filterable");
    let batches = drain_with_filter(&ds, &["Num".to_string()], admitted).expect("stream");
    assert_eq!(string_values(&batches, "Num"), expected(1));

    match spatial_engine::AdmittedPredicate::admit("\"nu\" IS NOT NULL", &ds) {
        Err(spatial_engine::PredicateAdmitError::Filter(spatial_engine::FilterError::UnknownColumn {
            column,
        })) => {
            assert_eq!(column, "nu");
        }
        other => panic!("expected UnknownColumn for the truncated name, got {other:?}"),
    }
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
        Col { name: "zone", int: false },
        Col { name: "zone\0x", int: true },
    ];
    let path = path_for("nul-shares-name-filter");
    write(&path, "id", &cols);
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(file_names(&ds), ["id", "geometry", "zone", "zone\u{0}x"]);

    let admitted = spatial_engine::AdmittedPredicate::admit("zone LIKE 'col0%'", &ds)
        .expect("zone LIKE 'col0%' must admit over the real Utf8 zone column");
    let batches = drain_with_filter(&ds, &["zone".to_string()], admitted).expect("stream");
    let values = string_values(&batches, "zone");
    assert_eq!(values.len(), FEATURES as usize, "every row's zone begins col0-");
    for v in &values {
        assert!(v.starts_with("col0-"), "{v}");
    }
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
        &[spatial_engine::fixture::HostileColumn { name: "a", int: false }],
    );
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
}

/// N-9 (§10 Amendment 12, wave-2 A2-1): `a_native_id_with_u0000_opens_on_the_session_tier_with_no_
/// nul_candidate` (c18). No native `id` can ever match a resident name containing U+0000 (`id`
/// itself carries none), so the open falls to the session tier rather than refusing.
/// Mutation: `identity::candidate_identity_columns` drops the U+0000 omission.
#[test]
fn a_native_id_with_u0000_opens_on_the_session_tier_with_no_nul_candidate() {
    let path = path_for("nul-native-id");
    write(&path, "id\0x", &[Col { name: "a", int: false }]);
    let ds = Dataset::open(&path).expect("open must succeed, on the session tier");
    assert!(
        ds.identity().source().is_session_ordinal(),
        "no addressable native `id` exists on this file"
    );
    assert!(
        !ds.identity().candidate_columns().iter().any(|c| c.contains('\0')),
        "the NUL-named column must never be offered as a candidate: {:?}",
        ds.identity().candidate_columns()
    );
}

/// N-10 (§10 Amendment 12, wave-2 A2-1): `the_native_id_is_the_column_duckdb_binds_when_a_nul_
/// named_id_precedes_it` (E8's p3 file: `id\0x` ahead of a real, addressable `id`). The open
/// succeeds natively on the real `id`, with the identity verification scan run once — which
/// `admit_column_type` refusing a `Utf8` column would have prevented, so success here is itself
/// the proof the scan bound the right position.
/// Mutation: `probe_schema` returns the export's (truncated) names, which would again let `id\0x`'s
/// truncated form shadow the real `id`.
#[test]
fn the_native_id_is_the_column_duckdb_binds_when_a_nul_named_id_precedes_it() {
    let cols = [
        Col { name: "id\0x", int: false },
        Col { name: "id", int: true },
    ];
    let path = path_for("nul-id-then-real-id");
    write(&path, "key", &cols);
    let ds = Dataset::open(&path).expect("open must succeed, native on the real `id`");
    assert_eq!(file_names(&ds), ["key", "geometry", "id\u{0}x", "id"]);
    assert!(!ds.identity().source().is_session_ordinal(), "a real, addressable `id` exists");
    assert_eq!(ds.identity().source().source_column(), "id");
    assert_eq!(
        ds.identity().uniqueness(),
        spatial_engine::identity::IdUniqueness::VerifiedAtOpenFullFile,
        "the native scan must have run, over the real column"
    );
}

/// N-11 (§10 Amendment 12, wave-2 A2-1): `a_declared_identity_naming_a_nul_named_column_is_refused_
/// before_any_scan` (c20). `column` is the full name; `candidate_columns` is empty.
/// Mutation: the name check is removed from the declared arm of `dataset::admit_identity`.
#[test]
fn a_declared_identity_naming_a_nul_named_column_is_refused_before_any_scan() {
    let path = path_for("nul-declared-identity");
    write(&path, "key\0x", &[Col { name: "a", int: false }]);
    let declaration = IdentityDeclaration::new("key\u{0}x", "test", "2026-09-29T00:00:00Z");
    match Dataset::open_with_declared_identity(&path, declaration, &CancelToken::new()) {
        Err(EngineError::IdentityUnusable { column, candidate_columns, .. }) => {
            assert_eq!(column, "key\u{0}x");
            assert!(
                candidate_columns.is_empty(),
                "the hostile column must never be a candidate: {candidate_columns:?}"
            );
        }
        Ok(_) => panic!("expected IdentityUnusable, got Ok"),
        Err(other) => panic!("expected IdentityUnusable, got {other:?}"),
    }
}

/// N-12 (§10 Amendment 12, wave-2 A2-1): `a_declared_identity_naming_the_truncated_prefix_is_an_
/// absent_column` (c21). Never `engine.query` — the truncated name the caller declared resolves to
/// nothing in the resident schema, so no scan is ever prepared.
/// Mutation: `probe_schema` returns the export's (truncated) names, which would make the declared
/// (truncated) name resolve.
#[test]
fn a_declared_identity_naming_the_truncated_prefix_is_an_absent_column() {
    let path = path_for("nul-declared-identity-truncated");
    write(&path, "key\0x", &[Col { name: "a", int: false }]);
    let declaration = IdentityDeclaration::new("key", "test", "2026-09-29T00:00:00Z");
    match Dataset::open_with_declared_identity(&path, declaration, &CancelToken::new()) {
        Err(EngineError::IdentityUnusable { column, .. }) => assert_eq!(column, "key"),
        Err(EngineError::Query(msg)) => panic!("must never reach a raw query error: {msg}"),
        Ok(_) => panic!("expected IdentityUnusable, got Ok"),
        Err(other) => panic!("expected IdentityUnusable, got {other:?}"),
    }
}

/// N-15 (§10 Amendment 12, wave-2 A2-1): `the_schema_probe_classifies_by_position_and_keeps_
/// duckdbs_own_renames` (c07, c14, plus a NUL position). `C2` and `Zone_1`/`Zone_1_1` are
/// byte-equal to today's, and carry no exported-name metadata; the metadata appears exactly at the
/// one position whose name does not round-trip.
/// Mutation: names are taken from the export list unconditionally (the reconciliation this test
/// exercises is what the closing sibling tests above call reverting `probe_schema`; there is no
/// `parquet_schema` call anywhere on this path to swap in its place).
#[test]
fn the_schema_probe_classifies_by_position_and_keeps_duckdbs_own_renames() {
    let path = path_for("empty-name");
    write(&path, "id", &[Col { name: "", int: false }]);
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(file_names(&ds), ["id", "geometry", "C2"]);
    assert!(
        ds.file_schema().field(2).metadata().is_empty(),
        "a name that round-trips carries no exported-name metadata"
    );

    let path = path_for("case-dups");
    write(
        &path,
        "id",
        &[
            Col { name: "zone", int: false },
            Col { name: "Zone", int: false },
            Col { name: "Zone_1", int: false },
        ],
    );
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(file_names(&ds), ["id", "geometry", "zone", "Zone_1", "Zone_1_1"]);
    for i in 2..5 {
        assert!(
            ds.file_schema().field(i).metadata().is_empty(),
            "field {i}: a name that round-trips carries no exported-name metadata"
        );
    }

    let path = path_for("nul-position-metadata");
    write(
        &path,
        "id",
        &[Col { name: "plain", int: false }, Col { name: "nu\0l", int: false }],
    );
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(file_names(&ds), ["id", "geometry", "plain", "nu\u{0}l"]);
    assert!(ds.file_schema().field(2).metadata().is_empty(), "plain round-trips");
    assert!(
        !ds.file_schema().field(3).metadata().is_empty(),
        "the exported-name key must appear exactly at the U+0000 position"
    );
}
