// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! §10 Amendment 12 (wave-2 A2-1), N-10's own process. `IDENTITY_VERIFICATION_SCANS`
//! (`engine/src/dataset.rs`, read through `identity_verification_scans()`) is process-global, so a
//! before/after comparison needs a process nothing else in the suite can touch it in —
//! `engine/tests/admission_instruments.rs`'s own module doc states the general hazard: "an
//! integration-test *file* is its own process, but `cargo test` runs every `#[test]` fn *within*
//! one file concurrently, on shared threads, by default." This file holds exactly one `#[test]`,
//! the same discipline that file's own doc explains, so N-10's own counter delta is never raced by
//! anything else this crate's test suite runs concurrently.

use std::sync::Arc;

use arrow::array::{ArrayRef, BinaryBuilder, StringBuilder, UInt64Builder};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::ArrowWriter;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;

use spatial_engine::dataset::identity_verification_scans;
use spatial_engine::identity::IdUniqueness;
use spatial_engine::Dataset;

/// §3's fixture discipline: hashed before and after this file's own run.
fn sha256_file(path: &std::path::Path) -> String {
    use sha2::{Digest, Sha256};
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    let digest = Sha256::digest(&bytes);
    digest.iter().map(|b| format!("{b:02x}")).collect()
}

/// E8's p3 file (`state/drafts/a2-1-p0/extra-output.txt`, the p3-utf8-nul-id-then-id row): `key`
/// (`UInt64`, position 0), `geometry` (`Binary`, position 1), `id\0x` (`Utf8`, position 2), then a
/// real `id` (`UInt64`, position 3) -- local here because [`spatial_engine::fixture::HostileColumn`]
/// carries only `Int64`/`Utf8`, the same precedent
/// `engine/tests/b1_projection_hostile_covering.rs`'s own `write_format_default_covering` sets for a
/// shape the shared writer does not cover.
fn write_p3_native_id(path: &std::path::Path) {
    const FEATURES: u64 = 10;
    let schema = Arc::new(Schema::new(vec![
        Field::new("key", DataType::UInt64, false),
        Field::new("geometry", DataType::Binary, false),
        Field::new("id\0x", DataType::Utf8, true),
        Field::new("id", DataType::UInt64, true),
    ]));

    let mut keys = UInt64Builder::new();
    let mut geoms = BinaryBuilder::new();
    let mut hostile_ids = StringBuilder::new();
    let mut real_ids = UInt64Builder::new();
    for i in 0..FEATURES {
        keys.append_value(i);
        let e = 2_600_000.0 + i as f64;
        let n = 1_200_000.0 + i as f64;
        geoms.append_value(spatial_engine::wkb::encode_polygon(&[vec![
            [e, n],
            [e + 1.0, n],
            [e + 1.0, n + 1.0],
            [e, n],
        ]]));
        hostile_ids.append_value(format!("col0-row{i}"));
        real_ids.append_value(i);
    }
    let arrays: Vec<ArrayRef> = vec![
        Arc::new(keys.finish()),
        Arc::new(geoms.finish()),
        Arc::new(hostile_ids.finish()),
        Arc::new(real_ids.finish()),
    ];
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

/// N-10 (§10 Amendment 12, wave-2 A2-1): `the_native_id_is_the_column_duckdb_binds_when_a_nul_
/// named_id_precedes_it` (E8's p3 file: `id\0x` (Utf8) ahead of a real, addressable `id` (`UInt64`)).
/// The open succeeds, native on the real `id`, and the identity verification scan runs **exactly
/// once** — measured on the process-global counter, alone in this process, rather than inferred
/// from `IdUniqueness::VerifiedAtOpenFullFile` alone (that state is reachable only after the scan
/// ran, but does not itself say how many times).
/// Mutation: `dataset::admit_identity` matches by exported name instead of the bound (DESCRIBE)
/// name, so it would resolve `id\0x`'s truncated form and shadow the real `id`.
#[test]
fn the_native_id_is_the_column_duckdb_binds_when_a_nul_named_id_precedes_it() {
    let dir = std::env::temp_dir().join("spatial-engine-b1-nul-native-id-scan-once");
    std::fs::create_dir_all(&dir).unwrap();
    let path = dir.join("nul-id-then-real-id.parquet");
    write_p3_native_id(&path);
    let fixture_sha_before = sha256_file(&path);

    let before = identity_verification_scans();
    let ds = Dataset::open(&path).expect("open must succeed, native on the real `id`");
    assert!(
        !ds.identity().source().is_session_ordinal(),
        "a real, addressable `id` exists"
    );
    assert_eq!(ds.identity().source().source_column(), "id");
    assert_eq!(
        ds.file_schema()
            .field_with_name("id")
            .expect("the real `id` field")
            .data_type(),
        &DataType::UInt64,
        "E8's p3 file: the real `id` is UInt64"
    );
    assert_eq!(
        ds.identity().uniqueness(),
        IdUniqueness::VerifiedAtOpenFullFile,
        "the native scan must have run, over the real column"
    );
    let after = identity_verification_scans();
    assert_eq!(
        after,
        before + 1,
        "the identity verification scan must run exactly once"
    );
    assert_eq!(
        sha256_file(&path),
        fixture_sha_before,
        "the fixture file must be unchanged by this run"
    );
}
