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

/// Each of the six narrow widths as a native `id`, and an Int32 `parcel_key` declared as the
/// identity, is written by the fixture's `NarrowInteger` mode at the width's top of range (100
/// rows), opened, and streamed with `ViewportQuery::all()`. A UInt64 `NativeUnique` file is the
/// control. For each file the test asserts, in order: the column type read back from the written
/// file's footer is the intended width, so the file is not a UInt64 file standing in for a narrow
/// one; the identity's source (`file:id`, or `mapped:parcel_key`), its uniqueness
/// (`VerifiedAtOpenFullFile`), its `verified_rows` (100) and its `max_value` (the width's maximum,
/// and 99 for the control); then the drain, which downcasts every batch's `id` to `UInt64Array`,
/// ends with no error, and the ids it delivered are the written set, 100 of them.
///
/// RECORDED MUTATION (observed at `8cce80cade922cfbec62d8de6064f76fd1cab488`, on the uncommitted
/// tree): the Int32 arm removed from `column_u64`. Observed outcome: this test fails by name at the
/// no-error assertion for row n3, with the stream's error ``Query("`id` is Int32; expected a
/// 64-bit integer")``.
///
/// RECORDED MUTATION (observed at `8cce80cade922cfbec62d8de6064f76fd1cab488`, on the uncommitted
/// tree): the UInt32 arm of `column_u64` reading through `i32` (`*v as i32 as u64`). Observed
/// outcome: this test fails by name at the id-set assertion for row n6 (`n6: ids`), the delivered
/// ids being 18446744073709551516 and up where 4294967196 and up were written.
///
/// RECORDED MUTATION (observed at `8cce80cade922cfbec62d8de6064f76fd1cab488`, on the uncommitted
/// tree): the fixture's narrow mode writing UInt64 (`NarrowWidth::data_type` and `narrow_array`).
/// Observed outcome: this test fails by name at the written-type assertion for row n1 (`n1:
/// written type`, left `UInt64`, right `Int8`).
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

/// Int8, Int16 and Int32 `id` files holding negative values (-1, -2, ...) are written by the
/// fixture's `NarrowInteger` mode. Opened plainly, each is refused with `IdentityUnusable` whose
/// detail contains "negative", because admission's scan reads the column's minimum (rows g1 to
/// g3). Declared as `id` with `skip_uniqueness_check`, so that the scan does not run, each is
/// admitted as `DeclaredNotVerified`, and its stream ends in `EngineError::Query` with "negative"
/// in the detail before any row is delivered (rows s1 to s3). Row s0 is the control on that same
/// route: an Int16 file at top of range streams its 100 rows, the ids being the written set.
///
/// RECORDED MUTATION (observed at `8cce80cade922cfbec62d8de6064f76fd1cab488`, on the uncommitted
/// tree): the Int16 arm of `column_u64` mapping with `*v as u64` in place of `u64::try_from`.
/// Observed outcome: this test fails by name at the no-rows-before-the-refusal assertion for row
/// s2 (`s2: rows before the refusal: 100`).
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
