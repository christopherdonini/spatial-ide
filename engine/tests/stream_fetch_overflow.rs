// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! An admitted same-type BIGINT `*` whose overflow is first raised during a fetch, not at the
//! prepare or execute site, ends the stream with the engine's fixed detail after the batches already
//! delivered. The file has 1,000,000 rows (N by the size rule of §3 of
//! `engine/STREAM-FETCH-OVERFLOW-FIXED-DETAIL-PREREGISTRATION.md`, its Amendment 1): `v = id` except
//! in the last 1,000 rows, whose `v * v` leaves int64, so the first chunks are delivered before the
//! `duckdb` crate's fetch panic carries DuckDB's overflow text to the engine. The wrapped payload
//! shape is what the engine saw at step 0 on all 16 runs; the bare shape is proven by a unit sample
//! in `engine/src/stream.rs` only.
//!
//! The file is checked before use and its bytes are hashed before and after the stream.

use std::fs::File;
use std::path::Path;
use std::sync::Arc;

use arrow::array::{ArrayRef, BinaryBuilder, Float64Array, Int64Array, StructArray, UInt64Array};
use arrow::datatypes::{DataType, Field, Fields, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;
use parquet::arrow::ArrowWriter;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::WriterProperties;

use spatial_engine::cancel::CancelToken;
use spatial_engine::fixture::{configured_connection, encode_point, LV95_PROJJSON};
use spatial_engine::{AdmittedPredicate, Bbox, Dataset, ViewportQuery};

/// N by §3's size rule: the smallest value at which every step-0 run reached the fetch site.
const N: u64 = 1_000_000;
/// The rows at the end whose square leaves int64.
const TAIL: u64 = 1_000;
/// `v` of the first tail row; `v * v` is near 1.3e37, far past int64 and past 2^32 per operand.
const BASE: i64 = 3_600_000_000_000_000_000;

/// The terminal text of that class: `query: ` and the engine's fixed detail, byte for byte (the
/// engine's constant is private, so its text is written here once, as the campaign writes it).
const FIXED_DETAIL: &str = "query: [P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld";

fn v_of(id: u64) -> i64 {
    if id >= N - TAIL {
        BASE + (id - (N - TAIL)) as i64
    } else {
        id as i64
    }
}

fn xy(id: u64) -> (f64, f64) {
    (
        2_600_000.0 + (id % 2_000) as f64,
        1_200_000.0 + (id / 2_000) as f64,
    )
}

/// Writes the file with the writer's defaults (one row group of at most 1,048,576 rows, statistics
/// on) and a declared bbox covering, so the viewport shape has one to use; returns the extent.
fn write_file(path: &Path) -> [f64; 4] {
    let child = |c: &str| Field::new(c, DataType::Float64, false);
    let kids = vec![child("xmin"), child("ymin"), child("xmax"), child("ymax")];
    let schema = Arc::new(Schema::new(vec![
        Field::new("id", DataType::UInt64, false),
        Field::new("geometry", DataType::Binary, false),
        Field::new("bbox", DataType::Struct(Fields::from(kids.clone())), false),
        Field::new("v", DataType::Int64, false),
    ]));
    let geo = format!(
        "{{\"version\":\"1.1.0\",\"primary_column\":\"geometry\",\"columns\":{{\"geometry\":{{\
         \"encoding\":\"WKB\",\"geometry_types\":[\"Point\"],\"covering\":{{\"bbox\":{{\
         \"xmin\":[\"bbox\",\"xmin\"],\"ymin\":[\"bbox\",\"ymin\"],\
         \"xmax\":[\"bbox\",\"xmax\"],\"ymax\":[\"bbox\",\"ymax\"]}}}},\"crs\":{LV95_PROJJSON}}}}}}}"
    );
    let props = WriterProperties::builder()
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo)]))
        .build();
    let mut w =
        ArrowWriter::try_new(File::create(path).unwrap(), schema.clone(), Some(props)).unwrap();
    let (mut x0, mut y0, mut x1, mut y1) = (f64::MAX, f64::MAX, f64::MIN, f64::MIN);
    let mut at = 0u64;
    while at < N {
        let end = (at + 65_536).min(N);
        let ids: Vec<u64> = (at..end).collect();
        let mut geoms = BinaryBuilder::new();
        let (mut xs, mut ys) = (Vec::new(), Vec::new());
        for &id in &ids {
            let (x, y) = xy(id);
            geoms.append_value(encode_point(x, y));
            xs.push(x);
            ys.push(y);
            (x0, y0, x1, y1) = (x0.min(x), y0.min(y), x1.max(x), y1.max(y));
        }
        let bbox = StructArray::new(
            Fields::from(kids.clone()),
            vec![
                Arc::new(Float64Array::from(xs.clone())) as ArrayRef,
                Arc::new(Float64Array::from(ys.clone())),
                Arc::new(Float64Array::from(xs)),
                Arc::new(Float64Array::from(ys)),
            ],
            None,
        );
        let vs: Vec<i64> = ids.iter().map(|&id| v_of(id)).collect();
        let columns: Vec<ArrayRef> = vec![
            Arc::new(UInt64Array::from(ids)),
            Arc::new(geoms.finish()),
            Arc::new(bbox),
            Arc::new(Int64Array::from(vs)),
        ];
        w.write(&RecordBatch::try_new(schema.clone(), columns).unwrap())
            .unwrap();
        at = end;
    }
    w.close().unwrap();
    [x0, y0, x1, y1]
}

fn sha256_file(path: &Path) -> String {
    use sha2::{Digest, Sha256};
    let bytes = std::fs::read(path).expect("read the file for hashing");
    Sha256::digest(&bytes)
        .iter()
        .map(|b| format!("{b:02x}"))
        .collect()
}

/// One stream, drained to its end with `next_into`, as the kernel drains it: over the whole extent
/// (`view`) or with no viewport. An error at the start and an error from `next_into` are both the
/// terminal.
struct Run {
    batches: usize,
    terminal: Option<String>,
}

fn run(ds: &Dataset, extent: [f64; 4], predicate: &str, view: bool) -> Run {
    let p = AdmittedPredicate::admit(predicate.to_string(), ds)
        .unwrap_or_else(|e| panic!("`{predicate}` is not admitted: {e}"));
    let [xmin, ymin, xmax, ymax] = extent;
    let q = if view {
        let bbox = Bbox {
            xmin,
            ymin,
            xmax,
            ymax,
        };
        ViewportQuery::viewport(bbox, ds.crs().identifier()).with_limit(N + 1)
    } else {
        ViewportQuery::all()
    };
    let q = q.with_filter(p);
    let mut out = Run {
        batches: 0,
        terminal: None,
    };
    let mut stream = match ds.stream_with_cancel(&q, CancelToken::new()) {
        Ok(s) => s,
        Err(e) => {
            out.terminal = Some(e.to_string());
            return out;
        }
    };
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        if let Err(e) = info {
            out.terminal = Some(e.to_string());
            break;
        }
        out.batches += 1;
        buf.clear();
    }
    out
}

#[test]
fn an_admitted_integer_overflow_first_raised_during_a_fetch_ends_the_stream_with_the_fixed_detail()
{
    let dir = std::env::temp_dir().join("spatial-engine-stream-fetch-overflow");
    std::fs::create_dir_all(&dir).unwrap();
    let path = dir.join("F-1M.parquet");
    let extent = write_file(&path);
    let before = sha256_file(&path);
    let p = path.to_string_lossy().replace('\\', "/");

    // The file is checked before use: row count, `v` Int64, the tail read back, `Dataset::open` Ok.
    let footer = ParquetRecordBatchReaderBuilder::try_new(File::open(&path).unwrap()).unwrap();
    assert_eq!(
        footer.metadata().file_metadata().num_rows(),
        N as i64,
        "row count"
    );
    let conn = configured_connection().expect("connection");
    let mut st = conn
        .prepare(&format!(
            "SELECT id, v FROM read_parquet(?) WHERE id >= {} ORDER BY id",
            N - TAIL
        ))
        .expect("prepare");
    let got: Vec<(u64, i64)> = st
        .query_map([p.as_str()], |r| Ok((r.get(0)?, r.get(1)?)))
        .expect("query")
        .map(|r| r.expect("row"))
        .collect();
    let want: Vec<(u64, i64)> = ((N - TAIL)..N).map(|id| (id, v_of(id))).collect();
    assert_eq!(got, want, "the tail read back");
    let ds = Dataset::open(&path).expect("open");
    let t = ds
        .file_schema()
        .field_with_name("v")
        .unwrap()
        .data_type()
        .clone();
    assert_eq!(t, DataType::Int64, "column v");

    // Cell I, before any stream: on an independent connection the first tail row's operands raise
    // DuckDB's out-of-range error; they do not wrap.
    let first_tail = N - TAIL;
    let sql = format!("SELECT v * v FROM read_parquet(?) WHERE id = {first_tail}");
    let conn = configured_connection().expect("connection");
    let raised = conn
        .prepare(&sql)
        .and_then(|mut st| st.query_row([p.as_str()], |r| r.get::<_, i64>(0)));
    let err = raised.expect_err("cell I: the operands wrapped instead of raising");
    assert!(
        err.to_string().starts_with("Out of Range Error"),
        "cell I: not DuckDB's out-of-range error: {err}"
    );

    for view in [false, true] {
        let cell = if view { "view" } else { "all" };
        // Assertion 1 is `admit` inside `run`: the predicate is admitted.
        let r = run(&ds, extent, "v * v > 0", view);
        assert!(
            r.batches >= 1,
            "{cell}: no batch before the terminal ({:?}), so the fetch site was not reached",
            r.terminal
        );
        let text = r
            .terminal
            .unwrap_or_else(|| panic!("{cell}: the stream did not end in an error"));
        assert_eq!(
            text, FIXED_DETAIL,
            "{cell}: the terminal after {} batches is not the fixed detail",
            r.batches
        );
        assert!(
            !text.contains("read_parquet("),
            "{cell}: the query text leaked"
        );
        for k in 0..TAIL as i64 {
            let operand = (BASE + k).to_string();
            assert!(!text.contains(&operand), "{cell}: operand {operand} leaked");
        }
    }

    assert_eq!(
        sha256_file(&path),
        before,
        "the file changed during the streams"
    );
    let _ = std::fs::remove_file(&path);
}
