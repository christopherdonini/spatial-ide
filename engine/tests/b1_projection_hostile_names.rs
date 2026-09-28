// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Wave-2 A2 adversarial probe of B1's live projection (evidence only; no product change).
//!
//! Treats the file's own column names as attacker-controlled and drives them through the real
//! `Dataset::resolve_projection` / `admit_projection_column` / `stream_projected_with_cancel`
//! entry points, decoded from the Arrow IPC wire.
//!
//! - `hostile_names_*`: names carrying double quotes, a backslash, a comma, a newline, a SQL
//!   keyword, `;--`, surrounding spaces, a Unicode confusable and case-folding collisions all
//!   round-trip to the right column's values. These pass at the baseline and record that the
//!   SELECT-list quoting holds.
//! - `a_nul_in_a_column_name_*`: **reproduce a defect**. DuckDB's Arrow schema (the engine's
//!   `probe_schema`) truncates a column name at an interior NUL, admission resolves against the
//!   truncated name, and the SELECT list then names a column DuckDB's binder does not have (or
//!   binds a different one). The projection is admitted and `describe` would call the column
//!   projectable, but the stream fails only after it has started. These tests assert the observed
//!   baseline behaviour; a fix should invert them.

use std::sync::Arc;

use arrow::array::{Array, ArrayRef, BinaryBuilder, Int64Builder, StringBuilder, UInt64Builder};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::ArrowWriter;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;

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

/// DEFECT (reproduced): a column named `nu\0l` appears in the resident schema as `nu`. `describe`'s
/// `projectable` (the same `admit_projection_column`) says yes, `resolve_projection(["nu"])` admits,
/// and the stream opens — then its first item is a DuckDB binder error that arrives only after the
/// stream exists (on the kernel path: after the ticket is minted, as a data-plane terminal frame).
/// The error text also echoes the generated SQL and the file's other column names.
#[test]
fn a_nul_in_a_column_name_is_admitted_then_fails_after_the_stream_opens() {
    let cols = [Col {
        name: "nu\0l",
        int: false,
    }];
    let path = path_for("nul-name");
    write(&path, "id", &cols);
    let ds = Dataset::open(&path).expect("open");
    assert_eq!(
        file_names(&ds),
        ["id", "geometry", "nu"],
        "the NUL-truncated name is resident"
    );

    let field = ds.file_schema().field(2).clone();
    assert!(
        spatial_engine::attributes::admit_projection_column(&field, ds.geometry_column(), "id")
            .is_ok(),
        "describe would report `nu` projectable"
    );

    match drain(&ds, &["nu".to_string()]) {
        Err(EngineError::Query(msg)) => {
            assert!(msg.contains("Binder Error"), "{msg}");
            assert!(
                msg.contains("SELECT \"id\" AS \"id\", \"geometry\", \"nu\""),
                "{msg}"
            );
        }
        other => panic!("expected the post-open binder failure, got {other:?}"),
    }
}

/// DEFECT (reproduced), the type-confusion form: `zone\0x` (`Int64`) before a real `zone` (`Utf8`).
/// The resident schema lists `zone` twice; admission resolves the first (`Int64`) and the envelope
/// declares `zone: Int64`, but `SELECT "zone"` binds the real `Utf8` column, so the stream fails
/// with `EncodingMismatch` after it opens. Reversing the order makes `describe` list a second,
/// projectable `zone: Int64` that no request can ever stream.
#[test]
fn a_nul_in_a_column_name_makes_admission_type_a_different_column_than_duckdb_binds() {
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
    assert_eq!(file_names(&ds), ["id", "geometry", "zone", "zone"]);

    let projection = ds
        .resolve_projection(&["zone".to_string()])
        .expect("admitted");
    assert_eq!(
        projection.fields()[0].data_type(),
        &DataType::Int64,
        "admission typed the NUL column"
    );

    match drain(&ds, &["zone".to_string()]) {
        Err(EngineError::EncodingMismatch { claimed, found }) => {
            assert_eq!(claimed, "attribute `zone` is Int64");
            assert_eq!(found, "Utf8");
        }
        other => panic!("expected the post-open EncodingMismatch, got {other:?}"),
    }
}
