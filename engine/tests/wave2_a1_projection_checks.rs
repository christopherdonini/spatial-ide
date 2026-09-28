// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Wave-2 audit A1 probe (evidence only). Admission (`attributes::admit_projection`) compares names
//! byte-exactly; DuckDB resolves identifiers case-insensitively. This probe asks whether a file
//! column whose name differs from the reserved `id` only by case is admitted, and what the live
//! projected stream then emits for it.

use std::fs::File;
use std::sync::Arc;

use arrow::datatypes::{Field, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;
use parquet::arrow::ArrowWriter;
use parquet::file::properties::WriterProperties;

use spatial_engine::cancel::CancelToken;
use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec, IdentityMode};
use spatial_engine::{Dataset, ViewportQuery};

/// Rewrite `src` with column `from` renamed to `to`, keeping every footer key-value (GeoParquet
/// `geo` included) and the Arrow schema metadata.
fn rename_column(src: &std::path::Path, dst: &std::path::Path, from: &str, to: &str) {
    let builder = ParquetRecordBatchReaderBuilder::try_new(File::open(src).unwrap()).unwrap();
    let kv = builder.metadata().file_metadata().key_value_metadata().cloned();
    let schema = builder.schema().clone();
    let fields: Vec<Field> = schema
        .fields()
        .iter()
        .map(|f| if f.name() == from { f.as_ref().clone().with_name(to) } else { f.as_ref().clone() })
        .collect();
    let new_schema = Arc::new(Schema::new_with_metadata(fields, schema.metadata().clone()));
    let reader = builder.build().unwrap();
    let props = WriterProperties::builder()
        .set_key_value_metadata(kv.map(|v| v.into_iter().filter(|e| e.key != "ARROW:schema").collect()))
        .build();
    let mut w = ArrowWriter::try_new(File::create(dst).unwrap(), new_schema.clone(), Some(props)).unwrap();
    for b in reader {
        let b = b.unwrap();
        w.write(&RecordBatch::try_new(new_schema.clone(), b.columns().to_vec()).unwrap()).unwrap();
    }
    w.close().unwrap();
}

#[test]
fn a_column_named_like_id_up_to_case_is_admitted_and_streams_beside_the_id_alias() {
    let dir = std::env::temp_dir().join("wave2-a1-case-alias");
    std::fs::create_dir_all(&dir).unwrap();
    let base = dir.join("base.parquet");
    let spec = FixtureSpec {
        features: 200,
        attributes: AttributeMode::CategoricalZone,
        crs_mode: CrsMode::DeclaredLv95,
        identity: IdentityMode::ForeignKeyColumn,
        seed: 0x5EED_2056_0A1C_0001,
        ..Default::default()
    };
    write_geoparquet(&base, &spec).expect("fixture");
    let path = dir.join("upper_id.parquet");
    rename_column(&base, &path, "zone", "ID");

    let ds = Dataset::open(&path).expect("open");
    let names: Vec<String> = ds.file_schema().fields().iter().map(|f| f.name().clone()).collect();
    println!("file schema: {names:?}");
    println!("identity source column: {}", ds.identity().source().source_column());

    let projectable = spatial_engine::attributes::admit_projection_column(
        ds.file_schema().field_with_name("ID").unwrap(),
        ds.geometry_column(),
        ds.identity().source().source_column(),
    );
    println!("projectable(ID): {:?}", projectable.is_ok());
    let admitted = ds.admit_projection(&["ID".to_string()]);
    println!("admission of [\"ID\"]: {:?}", admitted.as_ref().map(|p| p.names()));
    let projection = admitted.expect("admitted");

    let mut stream = ds
        .stream_projected_with_cancel(&ViewportQuery::all(), &projection, CancelToken::new())
        .expect("stream opened");
    let mut buf = Vec::new();
    let mut outcome = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        match info {
            Ok(_) => {
                let reader =
                    arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
                let s = reader.schema();
                outcome.push(format!(
                    "batch schema: {:?}",
                    s.fields().iter().map(|f| f.name().clone()).collect::<Vec<_>>()
                ));
            }
            Err(e) => outcome.push(format!("stream error: {e}")),
        }
        buf.clear();
    }
    for o in &outcome {
        println!("{o}");
    }
    assert!(outcome.iter().all(|o| !o.starts_with("stream error")), "admitted projection failed mid-stream: {outcome:?}");
}

/// Passing check (evidence): a projected `Int64` is emitted as `Int64`, never narrowed, with values
/// equal to an independent DuckDB read keyed on `id`; `UInt64`'s arm is the same code path.
#[test]
fn a_projected_int64_is_emitted_as_int64_with_exact_values() {
    use arrow::array::{Array, Int64Array, UInt64Array};
    let dir = std::env::temp_dir().join("wave2-a1-i64");
    std::fs::create_dir_all(&dir).unwrap();
    let path = dir.join("multitype.parquet");
    let spec = FixtureSpec {
        features: 300,
        attributes: AttributeMode::MultiType,
        crs_mode: CrsMode::DeclaredLv95,
        seed: 0x5EED_2056_0A1C_0002,
        ..Default::default()
    };
    write_geoparquet(&path, &spec).expect("fixture");
    let ds = Dataset::open(&path).expect("open");
    let projection = ds.admit_projection(&["i64".to_string()]).expect("admitted");
    let mut stream = ds
        .stream_projected_with_cancel(&ViewportQuery::all(), &projection, CancelToken::new())
        .expect("stream");
    let conn = spatial_engine::fixture::configured_connection().unwrap();
    let mut stmt = conn.prepare("SELECT id, i64 FROM read_parquet(?)").unwrap();
    let mut oracle = std::collections::BTreeMap::new();
    for b in stmt.query_arrow([path.to_string_lossy().to_string()]).unwrap() {
        let ids = b.column_by_name("id").unwrap().as_any().downcast_ref::<UInt64Array>().unwrap().clone();
        let v = b.column_by_name("i64").unwrap().as_any().downcast_ref::<Int64Array>().unwrap().clone();
        for r in 0..b.num_rows() {
            oracle.insert(ids.value(r), v.value(r));
        }
    }
    let mut buf = Vec::new();
    let mut seen = 0;
    while let Some(info) = stream.next_into(&mut buf) {
        info.expect("batch");
        for b in arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap() {
            let b = b.unwrap();
            assert_eq!(b.schema().field(2).data_type(), &arrow::datatypes::DataType::Int64);
            assert!(b.schema().field(2).is_nullable());
            let ids = b.column(0).as_any().downcast_ref::<UInt64Array>().unwrap();
            let v = b.column(2).as_any().downcast_ref::<Int64Array>().unwrap();
            for r in 0..b.num_rows() {
                assert_eq!(v.value(r), oracle[&ids.value(r)]);
                seen += 1;
            }
        }
        buf.clear();
    }
    assert_eq!(seen, 300);
}
