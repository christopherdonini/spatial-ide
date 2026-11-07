// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

use std::collections::BTreeSet;
use std::fs::File;
use std::io::Cursor;
use std::path::{Path, PathBuf};

use arrow::array::UInt64Array;
use arrow::datatypes::DataType;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;
use spatial_engine::fixture::{
    write_geoparquet, FixtureSpec, IdentityMode, NarrowColumn, NarrowValues, NarrowWidth,
};
use spatial_engine::identity::{IdUniqueness, IdentityDeclaration};
use spatial_engine::{CancelToken, Dataset, EngineError, PoolConfig, ViewportQuery};

const FEATURES: usize = 100;

fn write(test: &str, name: &str, identity: IdentityMode) -> PathBuf {
    let dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../target/fixtures/narrow-integer-id-stream")
        .join(test);
    std::fs::create_dir_all(&dir).expect("fixture dir");
    let path = dir.join(format!("{name}.parquet"));
    let spec = FixtureSpec {
        features: FEATURES,
        avg_vertices: 8,
        identity,
        ..Default::default()
    };
    write_geoparquet(&path, &spec).expect("write fixture");
    path
}

fn narrow(width: NarrowWidth, column: NarrowColumn, values: NarrowValues) -> IdentityMode {
    IdentityMode::NarrowInteger {
        width,
        column,
        values,
    }
}

fn footer_type(path: &Path, column: &str) -> DataType {
    let builder = ParquetRecordBatchReaderBuilder::try_new(File::open(path).expect("open file"))
        .expect("read footer");
    builder
        .schema()
        .field_with_name(column)
        .expect("column in footer")
        .data_type()
        .clone()
}

fn declaration(column: &str) -> IdentityDeclaration {
    IdentityDeclaration::new(column, "integration-test", "2026-11-07T00:00:00Z")
}

fn open(path: &Path, declared: Option<IdentityDeclaration>) -> Result<Dataset, EngineError> {
    Dataset::open_cancellable(
        path,
        None,
        declared,
        &CancelToken::new(),
        PoolConfig::default(),
    )
}

fn drain(ds: &Dataset) -> (Vec<u64>, Option<EngineError>) {
    let mut stream = ds
        .stream_with_cancel(&ViewportQuery::all(), CancelToken::new())
        .expect("stream starts");
    let mut ids = Vec::new();
    let mut buf = Vec::new();
    while let Some(item) = stream.next_into(&mut buf) {
        if let Err(e) = item {
            return (ids, Some(e));
        }
        let reader = arrow::ipc::reader::StreamReader::try_new(Cursor::new(&buf), None)
            .expect("a batch is an Arrow IPC stream");
        for batch in reader {
            let batch = batch.expect("decode batch");
            let col = batch
                .column_by_name("id")
                .expect("batch has id")
                .as_any()
                .downcast_ref::<UInt64Array>()
                .expect("every batch carries id as UInt64");
            ids.extend(col.values().iter().copied());
        }
        buf.clear();
    }
    (ids, None)
}

fn top_of_range(max: u64) -> BTreeSet<u64> {
    (0..FEATURES as u64).map(|i| max - i).collect()
}

#[test]
fn a_narrow_integer_identity_column_streams_every_row_with_its_source_value_widened_to_u64() {
    let rows = [
        ("n1", NarrowWidth::Int8, DataType::Int8, i8::MAX as u64),
        ("n2", NarrowWidth::Int16, DataType::Int16, i16::MAX as u64),
        ("n3", NarrowWidth::Int32, DataType::Int32, i32::MAX as u64),
        ("n4", NarrowWidth::UInt8, DataType::UInt8, u8::MAX as u64),
        ("n5", NarrowWidth::UInt16, DataType::UInt16, u16::MAX as u64),
        ("n6", NarrowWidth::UInt32, DataType::UInt32, u32::MAX as u64),
    ];
    for (label, width, intended, max) in rows {
        let path = write(
            "e1",
            label,
            narrow(width, NarrowColumn::Id, NarrowValues::TopOfRange),
        );
        assert_eq!(footer_type(&path, "id"), intended, "{label}: written type");
        let ds = open(&path, None).unwrap_or_else(|e| panic!("{label}: open: {e:?}"));
        let identity = ds.identity();
        assert_eq!(identity.source().as_envelope_value(), "file:id", "{label}");
        assert_eq!(
            identity.uniqueness(),
            IdUniqueness::VerifiedAtOpenFullFile,
            "{label}"
        );
        assert_eq!(identity.verified_rows(), Some(FEATURES as u64), "{label}");
        assert_eq!(identity.max_value(), Some(max), "{label}");
        let (ids, error) = drain(&ds);
        assert!(error.is_none(), "{label}: the stream ended in {error:?}");
        assert_eq!(ids.len(), FEATURES, "{label}: row count");
        assert_eq!(
            ids.iter().copied().collect::<BTreeSet<_>>(),
            top_of_range(max),
            "{label}: ids"
        );
    }

    let d1 = write(
        "e1",
        "d1",
        narrow(
            NarrowWidth::Int32,
            NarrowColumn::ParcelKey,
            NarrowValues::TopOfRange,
        ),
    );
    assert_eq!(
        footer_type(&d1, "parcel_key"),
        DataType::Int32,
        "d1: written type"
    );
    let ds =
        open(&d1, Some(declaration("parcel_key"))).unwrap_or_else(|e| panic!("d1: open: {e:?}"));
    let identity = ds.identity();
    assert_eq!(identity.source().as_envelope_value(), "mapped:parcel_key");
    assert_eq!(identity.uniqueness(), IdUniqueness::VerifiedAtOpenFullFile);
    assert_eq!(identity.verified_rows(), Some(FEATURES as u64));
    assert_eq!(identity.max_value(), Some(i32::MAX as u64));
    let (ids, error) = drain(&ds);
    assert!(error.is_none(), "d1: the stream ended in {error:?}");
    assert_eq!(ids.len(), FEATURES, "d1: row count");
    assert_eq!(
        ids.iter().copied().collect::<BTreeSet<_>>(),
        top_of_range(i32::MAX as u64),
        "d1: ids"
    );

    let c0 = write("e1", "c0", IdentityMode::NativeUnique);
    assert_eq!(footer_type(&c0, "id"), DataType::UInt64, "c0: written type");
    let ds = open(&c0, None).expect("c0: open");
    let identity = ds.identity();
    assert_eq!(identity.source().as_envelope_value(), "file:id");
    assert_eq!(identity.uniqueness(), IdUniqueness::VerifiedAtOpenFullFile);
    assert_eq!(identity.verified_rows(), Some(FEATURES as u64));
    assert_eq!(identity.max_value(), Some(FEATURES as u64 - 1));
    let (ids, error) = drain(&ds);
    assert!(error.is_none(), "c0: the stream ended in {error:?}");
    assert_eq!(
        ids.iter().copied().collect::<BTreeSet<_>>(),
        (0..FEATURES as u64).collect::<BTreeSet<_>>(),
        "c0: ids"
    );
    assert_eq!(ids.len(), FEATURES, "c0: row count");
}

#[test]
fn a_negative_value_in_a_signed_narrow_identity_is_refused_at_open_and_at_stream_on_the_unverified_route(
) {
    let signed = [
        ("1", NarrowWidth::Int8, DataType::Int8),
        ("2", NarrowWidth::Int16, DataType::Int16),
        ("3", NarrowWidth::Int32, DataType::Int32),
    ];
    for (n, width, intended) in signed {
        let path = write(
            "e2",
            &format!("negative-{n}"),
            narrow(width, NarrowColumn::Id, NarrowValues::Negative),
        );
        assert_eq!(footer_type(&path, "id"), intended, "g{n}: written type");

        match open(&path, None) {
            Err(EngineError::IdentityUnusable { detail, .. }) => {
                assert!(detail.contains("negative"), "g{n}: {detail}");
            }
            other => panic!(
                "g{n}: expected a typed refusal at open, got {:?}",
                other.err()
            ),
        }

        let mut skip = declaration("id");
        skip.skip_uniqueness_check = true;
        let ds = open(&path, Some(skip)).unwrap_or_else(|e| panic!("s{n}: open: {e:?}"));
        assert_eq!(
            ds.identity().uniqueness(),
            IdUniqueness::DeclaredNotVerified,
            "s{n}"
        );
        let (ids, error) = drain(&ds);
        assert!(
            ids.is_empty(),
            "s{n}: rows before the refusal: {}",
            ids.len()
        );
        match error {
            Some(EngineError::Query(detail)) => {
                assert!(detail.contains("negative"), "s{n}: {detail}");
            }
            other => panic!("s{n}: expected EngineError::Query, got {other:?}"),
        }
    }

    let s0 = write(
        "e2",
        "top-of-range-int16",
        narrow(
            NarrowWidth::Int16,
            NarrowColumn::Id,
            NarrowValues::TopOfRange,
        ),
    );
    let mut skip = declaration("id");
    skip.skip_uniqueness_check = true;
    let ds = open(&s0, Some(skip)).expect("s0: open");
    assert_eq!(
        ds.identity().uniqueness(),
        IdUniqueness::DeclaredNotVerified
    );
    let (ids, error) = drain(&ds);
    assert!(error.is_none(), "s0: the stream ended in {error:?}");
    assert_eq!(ids.len(), FEATURES, "s0: row count");
    assert_eq!(
        ids.iter().copied().collect::<BTreeSet<_>>(),
        top_of_range(i16::MAX as u64),
        "s0: ids"
    );
}
