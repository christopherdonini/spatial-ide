// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A Linux run of the P0 cells of
//! `governance/forms/engine/ADMITTED-INTEGER-OVERFLOW-SILENT-WRAPAROUND-PREREGISTRATION.md` §3:
//! W, F (and both on a second row group), the exact control P3, the refusal controls C1 and C2, the
//! independent per-row products (S, R and every two-column file), the literal cells L1 to L4 (L4 is
//! the one-sided `268435456 * 1152921504606846976`), and the two-column files T-c, T-o (and its
//! mirror), T-e and T-m.
//!
//! The files are built as lead-data's probe design builds them (A, B, B3 in three writers, S and R
//! arrow-rs without statistics; `state/consults/2026-10-25-...-probe-design-lead-data-draft.md`,
//! step 1) and the two-column files as the pinned test builds them
//! (`engine/tests/admitted_integer_overflow.rs`). Every outcome is printed beside the exact i128
//! oracle and the two's-complement wrap model; nothing here asserts on the engine or grades it.
//!
//! Usage: `o1-probe <out-dir>`. Each run writes its own fixtures under `<out-dir>`.

use std::collections::BTreeSet;
use std::fs::File;
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::{Path, PathBuf};
use std::sync::Arc;

use arrow::array::{Array, Int64Array, UInt64Array};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use duckdb::params;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;
use parquet::arrow::ArrowWriter;
use parquet::basic::Compression;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::{EnabledStatistics, WriterProperties};

use spatial_engine::cancel::CancelToken;
use spatial_engine::fixture::{
    configured_connection, write_geoparquet, FixtureSpec, StatisticsMode,
};
use spatial_engine::{AdmittedPredicate, Bbox, Dataset, ViewportQuery};

/// The engine's fixed detail, as `engine/tests/admitted_integer_overflow.rs` writes it.
const FIXED_DETAIL: &str = "query: [P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld";

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Writer {
    ArS,
    ArN,
    Dk,
}

impl Writer {
    fn tag(self) -> &'static str {
        match self {
            Writer::ArS => "ar-s",
            Writer::ArN => "ar-n",
            Writer::Dk => "dk",
        }
    }
}

/// One fixture file: `id` is the row index; `rows[id]` are the two operands. A squared column has
/// `cols == ["v", "v"]` and equal operands.
struct Fx {
    name: String,
    cols: [&'static str; 2],
    rows: Vec<(i64, i64)>,
    writer: Writer,
    path: PathBuf,
    extent: [f64; 4],
    groups_expected: Vec<i64>,
}

fn norm(p: &Path) -> String {
    p.to_string_lossy().replace('\\', "/")
}

fn sq(s: &str) -> String {
    s.replace('\'', "''")
}

fn panic_text(p: Box<dyn std::any::Any + Send>) -> String {
    p.downcast_ref::<String>()
        .cloned()
        .or_else(|| p.downcast_ref::<&str>().map(|s| s.to_string()))
        .unwrap_or_else(|| "<non-string panic>".to_string())
}

// ---------------------------------------------------------------------------------------------
// The values (the probe design's step 1, and the pinned test's two-column files)
// ---------------------------------------------------------------------------------------------

fn a_vals() -> Vec<i64> {
    (0..2048i64)
        .map(|id| match id - 1024 {
            k if k < 0 => id,
            k if k % 2 == 0 => 4_000_000_000 + k,
            k => -(4_000_000_000 + k),
        })
        .collect()
}

fn b_vals() -> Vec<i64> {
    (0..2048i64)
        .map(|id| if id < 2047 { id } else { 4_000_002_047 })
        .collect()
}

fn b3_vals() -> Vec<i64> {
    (0..4096i64)
        .map(|id| match id {
            0..=2047 => id,
            2048 => 0,
            2049..=4094 => id,
            _ => 4_000_004_095,
        })
        .collect()
}

const S_VALS: [i64; 6] = [
    2,
    3_037_000_499,
    3_037_000_500,
    -3_037_000_500,
    4_000_000_000,
    4_294_967_295,
];
const R_VALS: [i64; 3] = [2, 4_294_967_296, 3_600_000_000_003_999_000];
const BIG: i64 = 1_152_921_504_606_846_976; // 2^60

fn squares(vs: &[i64]) -> Vec<(i64, i64)> {
    vs.iter().map(|&v| (v, v)).collect()
}

// ---------------------------------------------------------------------------------------------
// Writers
// ---------------------------------------------------------------------------------------------

struct Base {
    path: PathBuf,
    extent: [f64; 4],
    geo: String,
}

fn make_base(dir: &Path, n: usize) -> Base {
    let spec = FixtureSpec {
        features: n,
        row_group_rows: 2_048,
        statistics: StatisticsMode::WriterDefault,
        ..Default::default()
    };
    let path = dir.join(format!("base-{n}.parquet"));
    let facts = write_geoparquet(&path, &spec).expect("base fixture");
    let b = ParquetRecordBatchReaderBuilder::try_new(File::open(&path).unwrap()).unwrap();
    let geo = b
        .metadata()
        .file_metadata()
        .key_value_metadata()
        .and_then(|kv| kv.iter().find(|k| k.key == "geo"))
        .and_then(|k| k.value.clone())
        .expect("base geo key");
    println!(
        "BASE n={n} bytes={} extent={:?}",
        facts.bytes, facts.extent
    );
    Base {
        path,
        extent: facts.extent,
        geo,
    }
}

/// arrow-rs: the base file's columns plus `cols` (one name once for a squared column), SNAPPY, row
/// groups of at most 2,048 rows, the base's `geo` key only; statistics the writer's default or none.
fn add_cols_arrow(base: &Base, cols: [&str; 2], rows: &[(i64, i64)], dst: &Path, stats: bool) {
    let names: Vec<&str> = if cols[0] == cols[1] {
        vec![cols[0]]
    } else {
        cols.to_vec()
    };
    let reader = ParquetRecordBatchReaderBuilder::try_new(File::open(&base.path).unwrap())
        .unwrap()
        .with_batch_size(1024);
    let mut fields: Vec<Arc<Field>> = reader.schema().fields().iter().cloned().collect();
    fields.extend(
        names
            .iter()
            .map(|c| Arc::new(Field::new(*c, DataType::Int64, false))),
    );
    let schema = Arc::new(Schema::new(fields));
    let props = WriterProperties::builder()
        .set_compression(Compression::SNAPPY)
        .set_max_row_group_row_count(Some(2048))
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), base.geo.clone())]));
    let props = if stats {
        props
    } else {
        props.set_statistics_enabled(EnabledStatistics::None)
    };
    let mut w = ArrowWriter::try_new(
        File::create(dst).unwrap(),
        schema.clone(),
        Some(props.build()),
    )
    .unwrap();
    for batch in reader.build().unwrap() {
        let batch = batch.unwrap();
        let ids = batch
            .column_by_name("id")
            .unwrap()
            .as_any()
            .downcast_ref::<UInt64Array>()
            .unwrap()
            .clone();
        let mut out = batch.columns().to_vec();
        for k in 0..names.len() {
            let pick = |i: usize| {
                let r = rows[ids.value(i) as usize];
                [r.0, r.1][k]
            };
            out.push(Arc::new(Int64Array::from_iter_values(
                (0..ids.len()).map(pick),
            )));
        }
        w.write(&RecordBatch::try_new(schema.clone(), out).unwrap())
            .unwrap();
    }
    w.close().unwrap();
}

/// DuckDB's writer, as the probe design has it: `SET threads = 1`, the values appended from Rust
/// (no SQL arithmetic makes them), then `COPY ... ROW_GROUP_SIZE 2048, KV_METADATA {geo: ...}`.
fn add_v_duckdb(base: &Base, vals: &[i64], dst: &Path) {
    let conn = configured_connection().expect("connection");
    conn.execute_batch("SET threads = 1;").unwrap();
    conn.execute_batch("CREATE TABLE __v (id UBIGINT, v BIGINT)")
        .unwrap();
    {
        let mut app = conn.appender("__v").unwrap();
        for (id, v) in vals.iter().enumerate() {
            app.append_row(params![id as u64, *v]).unwrap();
        }
        app.flush().unwrap();
    }
    let sql = format!(
        "COPY (SELECT s.*, t.v FROM read_parquet('{b}') s JOIN __v t ON s.id = t.id ORDER BY s.id) \
         TO '{d}' (FORMAT PARQUET, COMPRESSION SNAPPY, ROW_GROUP_SIZE 2048, KV_METADATA {{geo: '{g}'}})",
        b = sq(&norm(&base.path)),
        d = sq(&norm(dst)),
        g = sq(&base.geo),
    );
    conn.execute_batch(&sql).unwrap();
}

/// The checks every file passes before use: per column, row groups and rows as declared and
/// statistics present or absent as declared; a readback equal to `rows`; `Dataset::open` Ok with the
/// columns Int64. Returns a one-line record.
fn check(f: &Fx, stats_expected: bool) -> String {
    let p = norm(&f.path);
    let conn = configured_connection().unwrap();
    let names: Vec<&str> = if f.cols[0] == f.cols[1] {
        vec![f.cols[0]]
    } else {
        f.cols.to_vec()
    };
    let mut stmt = conn
        .prepare(
            "SELECT path_in_schema, CAST(row_group_num_rows AS BIGINT), \
             (stats_min_value IS NOT NULL AND stats_max_value IS NOT NULL) \
             FROM parquet_metadata(?) ORDER BY path_in_schema, row_group_id",
        )
        .unwrap();
    let got: Vec<(String, i64, bool)> = stmt
        .query_map([&p], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)))
        .unwrap()
        .map(|r| r.unwrap())
        .filter(|g: &(String, i64, bool)| names.contains(&g.0.as_str()))
        .collect();
    let want: Vec<(String, i64, bool)> = names
        .iter()
        .flat_map(|c| {
            f.groups_expected
                .iter()
                .map(move |&n| (c.to_string(), n, stats_expected))
        })
        .collect();
    let layout_ok = got == want;
    let sql = format!(
        "SELECT id, {}, {} FROM read_parquet(?) ORDER BY id",
        f.cols[0], f.cols[1]
    );
    let mut stmt = conn.prepare(&sql).unwrap();
    let back: Vec<(u64, i64, i64)> = stmt
        .query_map([&p], |r| Ok((r.get(0)?, r.get(1)?, r.get(2)?)))
        .unwrap()
        .map(|r| r.unwrap())
        .collect();
    let want_back: Vec<(u64, i64, i64)> = f
        .rows
        .iter()
        .enumerate()
        .map(|(i, r)| (i as u64, r.0, r.1))
        .collect();
    let mismatches = back
        .iter()
        .zip(&want_back)
        .filter(|(a, b)| a != b)
        .count()
        + back.len().abs_diff(want_back.len());
    let open = match Dataset::open(&f.path) {
        Ok(ds) => {
            let ok = names.iter().all(|c| {
                ds.file_schema()
                    .field_with_name(c)
                    .map(|fl| fl.data_type() == &DataType::Int64)
                    .unwrap_or(false)
            });
            if ok {
                "Ok, Int64".to_string()
            } else {
                "Ok, NOT Int64".to_string()
            }
        }
        Err(e) => format!("Err({e})"),
    };
    let bytes = std::fs::metadata(&f.path).map(|m| m.len()).unwrap_or(0);
    let pass = layout_ok && mismatches == 0 && open == "Ok, Int64";
    format!(
        "FILE {} writer={} rows={} groups={:?} stats={} layout_ok={layout_ok} readback_mismatches={mismatches} open=[{open}] bytes={bytes} checks={}",
        f.name,
        f.writer.tag(),
        f.rows.len(),
        f.groups_expected,
        stats_expected,
        if pass { "PASS" } else { "FAIL" }
    )
}

// ---------------------------------------------------------------------------------------------
// Predicates, the oracle, the engine run
// ---------------------------------------------------------------------------------------------

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
enum Cmp {
    Gt,
    Lt,
    NotNull,
}

fn text(cols: [&str; 2], c: Cmp) -> String {
    let p = format!("{} * {}", cols[0], cols[1]);
    match c {
        Cmp::Gt => format!("{p} > 0"),
        Cmp::Lt => format!("{p} < 0"),
        Cmp::NotNull => format!("({p}) IS NOT NULL"),
    }
}

fn keep_i128(x: i128, c: Cmp) -> bool {
    match c {
        Cmp::Gt => x > 0,
        Cmp::Lt => x < 0,
        Cmp::NotNull => true,
    }
}

fn keep_i64(x: i64, c: Cmp) -> bool {
    keep_i128(x as i128, c)
}

/// X: the ids exact i128 arithmetic selects. W: the ids two's-complement wrapping selects.
fn x_set(rows: &[(i64, i64)], c: Cmp) -> BTreeSet<u64> {
    (0..rows.len())
        .filter(|&i| keep_i128(i128::from(rows[i].0) * i128::from(rows[i].1), c))
        .map(|i| i as u64)
        .collect()
}

fn w_set(rows: &[(i64, i64)], c: Cmp) -> BTreeSet<u64> {
    (0..rows.len())
        .filter(|&i| keep_i64(rows[i].0.wrapping_mul(rows[i].1), c))
        .map(|i| i as u64)
        .collect()
}

fn overflow_rows(rows: &[(i64, i64)]) -> usize {
    rows.iter().filter(|r| r.0.checked_mul(r.1).is_none()).count()
}

#[derive(Default)]
struct Run {
    refused: Option<String>,
    start_err: Option<String>,
    terminal: Option<String>,
    panic: Option<String>,
    batches: usize,
    ids: Vec<u64>,
}

impl Run {
    fn set(&self) -> BTreeSet<u64> {
        self.ids.iter().copied().collect()
    }
    fn completed(&self) -> bool {
        self.refused.is_none()
            && self.start_err.is_none()
            && self.terminal.is_none()
            && self.panic.is_none()
    }
    /// One token: FIXED (the fixed detail, no batch), FIXED-AFTER-BATCHES, ERROR[...], REFUSED[...],
    /// PANIC[...] or COMPLETED.
    fn class(&self) -> String {
        if let Some(e) = &self.refused {
            return format!("REFUSED[{e}]");
        }
        if let Some(p) = &self.panic {
            return format!("PANIC[{p}]");
        }
        let err = self.start_err.as_ref().or(self.terminal.as_ref());
        match err {
            Some(t) if t == FIXED_DETAIL && self.batches == 0 => "FIXED".to_string(),
            Some(t) if t == FIXED_DETAIL => format!("FIXED-AFTER-{}-BATCHES", self.batches),
            Some(t) => format!("ERROR[{t}] after {} batches", self.batches),
            None => "COMPLETED".to_string(),
        }
    }
}

/// The variant name of a refusal (`NotBoolean`, `TypeNotAdmitted`, ...) and its Display.
fn refusal(e: &spatial_engine::PredicateAdmitError) -> String {
    let dbg = format!("{e:?}");
    let inner = dbg
        .strip_prefix("Filter(")
        .unwrap_or(&dbg)
        .split(|ch: char| ch == ' ' || ch == '{' || ch == '(')
        .next()
        .unwrap_or("")
        .to_string();
    format!("{inner}: {e}")
}

fn engine_run(f: &Fx, ds: &Dataset, predicate: &str, view: bool) -> Run {
    let go = || {
        let mut out = Run::default();
        let p = match AdmittedPredicate::admit(predicate.to_string(), ds) {
            Ok(p) => p,
            Err(e) => {
                out.refused = Some(refusal(&e));
                return out;
            }
        };
        let [xmin, ymin, xmax, ymax] = f.extent;
        let q = if view {
            ViewportQuery::viewport(
                Bbox {
                    xmin,
                    ymin,
                    xmax,
                    ymax,
                },
                ds.crs().identifier(),
            )
            .with_limit(f.rows.len() as u64 + 1)
        } else {
            ViewportQuery::all()
        }
        .with_filter(p);
        let mut stream = match ds.stream_with_cancel(&q, CancelToken::new()) {
            Ok(s) => s,
            Err(e) => {
                out.start_err = Some(e.to_string());
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
            let reader =
                arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
                    .expect("ipc");
            for batch in reader {
                let batch = batch.expect("batch");
                let col = batch.column_by_name("id").expect("id");
                let col = col.as_any().downcast_ref::<UInt64Array>().expect("u64");
                out.ids.extend(col.values().iter().copied());
            }
            buf.clear();
        }
        out
    };
    match catch_unwind(AssertUnwindSafe(go)) {
        Ok(r) => r,
        Err(p) => Run {
            panic: Some(panic_text(p)),
            ..Default::default()
        },
    }
}

fn fmt_ids(s: &BTreeSet<u64>) -> String {
    let v: Vec<u64> = s.iter().copied().collect();
    if v.is_empty() {
        return "{}".into();
    }
    let mut out = Vec::new();
    let (mut a, mut b) = (v[0], v[0]);
    for &x in &v[1..] {
        if x == b + 1 {
            b = x;
        } else {
            out.push(if a == b { format!("{a}") } else { format!("{a}..={b}") });
            a = x;
            b = x;
        }
    }
    out.push(if a == b { format!("{a}") } else { format!("{a}..={b}") });
    format!("{{{}}}", out.join(","))
}

struct Tally {
    runs: usize,
    s1: Vec<String>,
}

/// Runs one (file, predicate) cell in both shapes, twice each, and prints one CELL line per run.
fn cell(t: &mut Tally, f: &Fx, ds: &Dataset, form: &str, predicate: &str, c: Option<Cmp>) {
    let (x, w) = match c {
        Some(c) => (x_set(&f.rows, c), Some(w_set(&f.rows, c))),
        // Literal-only predicates: the oracle is computed from the literal (see `lit`).
        None => (lit_x(predicate, f.rows.len()), None),
    };
    for rep in 1..=2 {
        for view in [false, true] {
            let r = engine_run(f, ds, predicate, view);
            let class = r.class();
            let got = r.set();
            let mut line = format!(
                "CELL form={form} file={} shape={} rep={rep} pred=[{predicate}] overflow_rows={} X={} W={} outcome={class}",
                f.name,
                if view { "view" } else { "all" },
                if c.is_some() { overflow_rows(&f.rows) } else { 0 },
                x.len(),
                w.as_ref().map(|w| w.len().to_string()).unwrap_or_else(|| "n/a".into()),
            );
            if r.refused.is_none() {
                t.runs += 1;
            }
            if r.completed() {
                let eq_x = got == x;
                let eq_w = w.as_ref().map(|w| got == *w);
                line.push_str(&format!(
                    " n={} dup={} eq_X={eq_x} eq_W={} ids={}",
                    got.len(),
                    r.ids.len() - got.len(),
                    eq_w.map(|b| b.to_string()).unwrap_or_else(|| "n/a".into()),
                    fmt_ids(&got)
                ));
                if !eq_x || r.ids.len() != got.len() {
                    t.s1.push(format!("{} {} [{predicate}]", f.name, if view { "view" } else { "all" }));
                }
            }
            println!("{line}");
        }
    }
}

/// The literal-only predicates on B-ar-s: X is all rows when the exact literal product satisfies the
/// comparison, none otherwise.
fn lit_x(predicate: &str, n: usize) -> BTreeSet<u64> {
    let (lhs, rhs) = predicate.split_once(" * ").unwrap();
    let (rhs, cmp) = rhs.split_once(' ').unwrap();
    let x = lhs.parse::<i128>().unwrap() * rhs.parse::<i128>().unwrap();
    let keep = match cmp.trim_start().chars().next().unwrap() {
        '>' => x > 0,
        '<' => x < 0,
        _ => unreachable!(),
    };
    if keep {
        (0..n as u64).collect()
    } else {
        BTreeSet::new()
    }
}

/// An independent per-row product, `SELECT a * b FROM read_parquet(?) WHERE id = k`, on a fresh
/// connection, beside the exact product and the wrapped one.
fn per_k(f: &Fx) {
    let conn = configured_connection().unwrap();
    let sql = format!(
        "SELECT {} * {} AS p FROM read_parquet(?) WHERE id = ?",
        f.cols[0], f.cols[1]
    );
    for (k, r) in f.rows.iter().enumerate() {
        let x = i128::from(r.0) * i128::from(r.1);
        let w = r.0.wrapping_mul(r.1);
        let got: Result<i64, duckdb::Error> = (|| {
            let mut st = conn.prepare(&sql)?;
            st.query_row(params![norm(&f.path), k as u64], |row| row.get::<_, i64>(0))
        })();
        let got = match got {
            Ok(v) => format!("value={v} eq_X={} eq_W={}", i128::from(v) == x, v == w),
            Err(e) => format!("error=[{e}]"),
        };
        println!(
            "PERK file={} k={k} a={} b={} X={x} fits_i64={} W={w} {got}",
            f.name,
            r.0,
            r.1,
            i64::try_from(x).is_ok()
        );
    }
}

fn scalar(sql: &str) -> String {
    let conn = configured_connection().unwrap();
    let r: Result<String, duckdb::Error> = (|| {
        let mut st = conn.prepare(sql)?;
        st.query_row([], |row| {
            let v: duckdb::types::Value = row.get(0)?;
            Ok(format!("{v:?}"))
        })
    })();
    match r {
        Ok(v) => format!("value={v}"),
        Err(e) => format!("error=[{e}]"),
    }
}

fn explain(path: &str, predicate: &str) -> (usize, String) {
    let conn = configured_connection().unwrap();
    conn.execute_batch("SET explain_output = 'all'").unwrap();
    let sql = format!(
        "EXPLAIN SELECT count(*) FROM read_parquet('{}') WHERE ({predicate})",
        sq(path)
    );
    let mut st = conn.prepare(&sql).unwrap();
    let rows: Vec<String> = st
        .query_map([], |r| r.get::<_, String>(1))
        .unwrap()
        .map(|r| r.unwrap())
        .collect();
    let all = rows.join("\n");
    (all.matches("EMPTY_RESULT").count(), all)
}

fn main() {
    let out = PathBuf::from(std::env::args().nth(1).expect("usage: o1-probe <out-dir>"));
    std::fs::create_dir_all(&out).unwrap();
    println!("VERSIONS pragma_version() = {}", {
        let conn = configured_connection().unwrap();
        let mut st = conn
            .prepare("SELECT library_version, source_id FROM pragma_version()")
            .unwrap();
        let v: (String, String) = st.query_row([], |r| Ok((r.get(0)?, r.get(1)?))).unwrap();
        format!("{v:?}")
    });

    let b2048 = make_base(&out, 2048);
    let b4096 = make_base(&out, 4096);
    let b6 = make_base(&out, 6);
    let b5 = make_base(&out, 5);
    let b3 = make_base(&out, 3);
    let b2 = make_base(&out, 2);
    let base_for = |n: usize| match n {
        2048 => &b2048,
        4096 => &b4096,
        6 => &b6,
        5 => &b5,
        3 => &b3,
        2 => &b2,
        _ => unreachable!(),
    };

    let v = ["v", "v"];
    let ab = ["a", "b"];
    // (name, cols, rows, writer)
    let specs: Vec<(String, [&'static str; 2], Vec<(i64, i64)>, Writer)> = {
        let mut s = Vec::new();
        for (fam, vals) in [("A", a_vals()), ("B", b_vals()), ("B3", b3_vals())] {
            for w in [Writer::ArS, Writer::ArN, Writer::Dk] {
                s.push((format!("{fam}-{}", w.tag()), v, squares(&vals), w));
            }
        }
        s.push(("S-ar-n".into(), v, squares(&S_VALS), Writer::ArN));
        s.push(("R-ar-n".into(), v, squares(&R_VALS), Writer::ArN));
        let tc = vec![
            (2, 3),
            (3_037_000_500, 4_000_000_000),
            (-4_000_000_000, 4_294_967_295),
        ];
        s.push(("T-c-ar-n".into(), ab, tc.clone(), Writer::ArN));
        s.push(("T-c-ar-s".into(), ab, tc, Writer::ArS));
        s.push(("T-o-ar-n".into(), ab, vec![(2, 3), (268_435_456, BIG)], Writer::ArN));
        s.push(("T-o-mirror-ar-n".into(), ab, vec![(2, 3), (BIG, 268_435_456)], Writer::ArN));
        s.push((
            "T-e-ar-n".into(),
            ab,
            vec![
                (2, 3),
                (2_147_483_648, 2_147_483_648),
                (-4_294_967_296, 2_147_483_648),
                (i64::MAX, 1),
                (3_037_000_499, 3_037_000_499),
            ],
            Writer::ArN,
        ));
        s.push((
            "T-m-ar-n".into(),
            ab,
            vec![(2, 3), (4_294_967_296, 4_294_967_296), (-1, i64::MIN)],
            Writer::ArN,
        ));
        // Added after the first two runs' results were seen, not a section 3 cell: the operand order
        // of the form's Amendment 8 figure, (-2^31, 2^32), whose exact product is i64::MIN.
        s.push((
            "T-e-swap-ar-n".into(),
            ab,
            vec![(2, 3), (-2_147_483_648, 4_294_967_296)],
            Writer::ArN,
        ));
        s
    };

    let mut files = Vec::new();
    for (name, cols, rows, writer) in specs {
        let base = base_for(rows.len());
        let path = out.join(format!("{name}.parquet"));
        match writer {
            Writer::ArS => add_cols_arrow(base, cols, &rows, &path, true),
            Writer::ArN => add_cols_arrow(base, cols, &rows, &path, false),
            Writer::Dk => add_v_duckdb(base, &rows.iter().map(|r| r.0).collect::<Vec<_>>(), &path),
        }
        let groups_expected = if rows.len() == 4096 {
            vec![2048, 2048]
        } else {
            vec![rows.len() as i64]
        };
        let f = Fx {
            name,
            cols,
            rows,
            writer,
            path,
            extent: base.extent,
            groups_expected,
        };
        println!("{}", check(&f, writer != Writer::ArN));
        files.push(f);
    }
    let get = |n: &str| files.iter().find(|f| f.name == n).unwrap();

    let mut t = Tally {
        runs: 0,
        s1: Vec::new(),
    };

    // W, F and their second-row-group cells, and P3 (the exact control), on A, B, B3.
    for f in files.iter().filter(|f| f.cols == v && f.rows.len() >= 2048) {
        let ds = Dataset::open(&f.path).unwrap();
        let fam = f.name.split('-').next().unwrap();
        let wf = match (fam, f.writer) {
            ("A", _) | (_, Writer::ArN) => "W",
            _ => "F",
        };
        let wf = if fam == "B3" { format!("{wf}-second-row-group") } else { wf.to_string() };
        for c in [Cmp::Gt, Cmp::Lt] {
            cell(&mut t, f, &ds, &wf, &text(v, c), Some(c));
        }
        cell(&mut t, f, &ds, "P3-exact-control", &text(v, Cmp::NotNull), Some(Cmp::NotNull));
    }
    // S and R: P1, P2 through the engine; the independent products per k.
    for name in ["S-ar-n", "R-ar-n"] {
        let f = get(name);
        let ds = Dataset::open(&f.path).unwrap();
        let form = if name == "S-ar-n" { "W" } else { "R-stream" };
        for c in [Cmp::Gt, Cmp::Lt] {
            cell(&mut t, f, &ds, form, &text(v, c), Some(c));
        }
        per_k(f);
    }
    // The refusal controls, admission only.
    for name in ["A-ar-s", "B-ar-s"] {
        let f = get(name);
        let ds = Dataset::open(&f.path).unwrap();
        for (k, p) in [("C1", "v * v"), ("C2", "v * 1.5 > 0")] {
            let r = match AdmittedPredicate::admit(p.to_string(), &ds) {
                Ok(_) => "ADMITTED".to_string(),
                Err(e) => format!("REFUSED[{}]", refusal(&e)),
            };
            println!("CONTROL {k} file={name} pred=[{p}] outcome={r}");
        }
    }
    // L1 to L4 on B-ar-s, then the literal products alone on a fresh connection.
    {
        let f = get("B-ar-s");
        let ds = Dataset::open(&f.path).unwrap();
        for (k, p) in [
            ("L1", "4000000000 * 4000000000 > 0"),
            ("L2", "4000000000 * 4000000000 < 0"),
            ("L3", "4294967296 * 4294967296 > 0"),
            ("L4-one-sided", "268435456 * 1152921504606846976 > 0"),
        ] {
            cell(&mut t, f, &ds, k, p, None);
        }
        for p in [
            "4000000000 * 4000000000",
            "3037000500 * 3037000500",
            "4294967296 * 4294967296",
            "268435456 * 1152921504606846976",
            "1152921504606846976 * 268435456",
        ] {
            println!("LITERAL SELECT {p} AS p -> {}", scalar(&format!("SELECT {p} AS p")));
        }
    }
    // The two-column files: Q1, Q2, Q3 through the engine; the products per k.
    for name in [
        "T-c-ar-n",
        "T-c-ar-s",
        "T-o-ar-n",
        "T-o-mirror-ar-n",
        "T-e-ar-n",
        "T-m-ar-n",
        "T-e-swap-ar-n",
    ] {
        let f = get(name);
        let ds = Dataset::open(&f.path).unwrap();
        let form = name.trim_end_matches("-ar-n").trim_end_matches("-ar-s");
        for c in [Cmp::Gt, Cmp::Lt, Cmp::NotNull] {
            cell(&mut t, f, &ds, form, &text(ab, c), Some(c));
        }
        per_k(f);
    }
    // EXPLAIN of the F cells: does a statistics fold to EMPTY_RESULT appear?
    for name in ["B-ar-s", "B-dk", "B3-ar-s", "B3-dk"] {
        let f = get(name);
        for c in [Cmp::Gt, Cmp::Lt] {
            let (n, plan) = explain(&norm(&f.path), &text(v, c));
            println!("EXPLAIN file={name} pred=[{}] EMPTY_RESULT={n}", text(v, c));
            for l in plan.lines() {
                println!("EXPLAIN-PLAN file={name} | {l}");
            }
        }
    }
    println!(
        "TALLY engine_runs_admitted={} s1_condition_runs(admitted, completed, id set != X)={} {:?}",
        t.runs,
        t.s1.len(),
        t.s1
    );
    println!("O1 PROBE LINUX DONE");
}
