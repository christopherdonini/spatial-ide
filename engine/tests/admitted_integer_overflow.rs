// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! An admitted same-type BIGINT `*` whose exact value leaves int64 ends the stream in an error whose
//! text is the engine's fixed detail; it never completes with the rows that wrapped arithmetic
//! selects. A product that fits returns exactly the rows exact arithmetic selects. Every outcome is
//! checked against an i128 oracle written here, never against DuckDB.
//!
//! By DuckDB's source, the bundled int64 multiply takes the compiler's checked path under clang or
//! GCC 5 or later, so on Windows `.cargo/config.toml` names clang-cl (the paragraph above the
//! `duckdb` dependency in `engine/Cargo.toml` records the build of record). A build without that
//! setting is the build these tests exist to catch.
//!
//! Every file is one row group of at most 2,048 rows, so each overflow is first raised in the first
//! chunk, at the prepare or execute site, where the fixed detail is proven. The fetch site is not
//! reached by construction and belongs to node `stream-fetch-overflow-fixed-detail`.

use std::collections::BTreeSet;
use std::fs::File;
use std::path::{Path, PathBuf};
use std::sync::{Arc, OnceLock};

use arrow::array::{Array, Int64Array, UInt64Array};
use arrow::datatypes::{DataType, Field, Schema};
use arrow::record_batch::RecordBatch;
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;
use parquet::arrow::ArrowWriter;
use parquet::basic::Compression;
use parquet::file::metadata::KeyValue;
use parquet::file::properties::{EnabledStatistics, WriterProperties};

use spatial_engine::cancel::CancelToken;
use spatial_engine::fixture::{
    configured_connection, write_geoparquet, FixtureSpec, StatisticsMode,
};
use spatial_engine::{
    AdmittedPredicate, Bbox, Dataset, FilterError, PredicateAdmitError, ViewportQuery,
};

/// The terminal text of that class: `query: ` and the engine's fixed detail, byte for byte (the
/// engine's constant is private, so its text is written here once, as the campaign writes it).
const FIXED_DETAIL: &str = "query: [P6 placeholder] a value computed while this query ran was out of range for its type; the row values and the query text are withheld";

#[derive(Clone, Copy)]
enum Cmp {
    Gt,
    Lt,
    NotNull,
}
const ALL: [Cmp; 3] = [Cmp::Gt, Cmp::Lt, Cmp::NotNull];
const OVER: &[Cmp] = &[Cmp::Gt, Cmp::Lt];

/// One fixture: a GeoParquet whose `id` is the row index, plus the Int64 columns `cols` (one name
/// twice for a squared column). `fixed` holds the comparisons whose product leaves int64 in some
/// row, so those streams must end in the fixed detail; it is empty when every product fits.
struct Fx {
    name: &'static str,
    cols: [&'static str; 2],
    rows: Vec<(i64, i64)>,
    fixed: &'static [Cmp],
    path: PathBuf,
    extent: [f64; 4],
}

fn squares(vs: impl IntoIterator<Item = i64>) -> Vec<(i64, i64)> {
    vs.into_iter().map(|v| (v, v)).collect()
}

fn query<T>(sql: &str, path: &str, get: impl Fn(&duckdb::Row<'_>) -> duckdb::Result<T>) -> Vec<T> {
    let conn = configured_connection().expect("connection");
    let mut st = conn.prepare(sql).expect("prepare");
    let rows = st.query_map([path], |r| get(r)).expect("query");
    rows.map(|r| r.expect("row")).collect()
}

/// Writes the fixture, then checks it before use: one row group of the declared size, statistics
/// present or absent as declared, a readback equal to `rows`, Int64 columns, `Dataset::open` Ok.
fn write_fixture(
    dir: &Path,
    name: &'static str,
    cols: [&'static str; 2],
    rows: Vec<(i64, i64)>,
    stats: bool,
    fixed: &'static [Cmp],
) -> Fx {
    let base = dir.join(format!("{name}-base.parquet"));
    let spec = FixtureSpec {
        features: rows.len(),
        row_group_rows: 2_048,
        statistics: StatisticsMode::WriterDefault,
        ..Default::default()
    };
    let extent = write_geoparquet(&base, &spec).expect("base fixture").extent;
    let reader = ParquetRecordBatchReaderBuilder::try_new(File::open(&base).unwrap()).unwrap();
    let kv = reader
        .metadata()
        .file_metadata()
        .key_value_metadata()
        .cloned();
    let geo = kv
        .unwrap()
        .into_iter()
        .find(|k| k.key == "geo")
        .and_then(|k| k.value)
        .unwrap();
    let names: Vec<&str> = if cols[0] == cols[1] {
        vec![cols[0]]
    } else {
        cols.to_vec()
    };
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
        .set_key_value_metadata(Some(vec![KeyValue::new("geo".to_string(), geo)]));
    let props = if stats {
        props
    } else {
        props.set_statistics_enabled(EnabledStatistics::None)
    };
    let path = dir.join(format!("{name}.parquet"));
    let mut w = ArrowWriter::try_new(
        File::create(&path).unwrap(),
        schema.clone(),
        Some(props.build()),
    )
    .unwrap();
    for batch in reader.build().unwrap() {
        let batch = batch.unwrap();
        let ids = batch.column_by_name("id").unwrap().clone();
        let ids = ids.as_any().downcast_ref::<UInt64Array>().unwrap().clone();
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

    let p = path.to_string_lossy().replace('\\', "/");
    let groups = "SELECT path_in_schema, CAST(row_group_num_rows AS BIGINT), \
                  (stats_min_value IS NOT NULL AND stats_max_value IS NOT NULL) \
                  FROM parquet_metadata(?) ORDER BY path_in_schema, row_group_id";
    let mut got = query(groups, &p, |r| {
        Ok((
            r.get::<_, String>(0)?,
            r.get::<_, i64>(1)?,
            r.get::<_, bool>(2)?,
        ))
    });
    got.retain(|g| names.contains(&g.0.as_str()));
    let want: Vec<_> = names
        .iter()
        .map(|c| (c.to_string(), rows.len() as i64, stats))
        .collect();
    assert_eq!(
        got, want,
        "{name}: one row group per column, statistics as declared"
    );
    let sql = format!(
        "SELECT id, {}, {} FROM read_parquet(?) ORDER BY id",
        cols[0], cols[1]
    );
    let got = query(&sql, &p, |r| {
        Ok((
            r.get::<_, u64>(0)?,
            r.get::<_, i64>(1)?,
            r.get::<_, i64>(2)?,
        ))
    });
    let want: Vec<_> = rows
        .iter()
        .enumerate()
        .map(|(i, r)| (i as u64, r.0, r.1))
        .collect();
    assert_eq!(got, want, "{name}: readback");
    let ds = Dataset::open(&path).expect("open");
    for c in &names {
        let t = ds
            .file_schema()
            .field_with_name(c)
            .unwrap()
            .data_type()
            .clone();
        assert_eq!(t, DataType::Int64, "{name}: column {c}");
    }
    Fx {
        name,
        cols,
        rows,
        fixed,
        path,
        extent,
    }
}

fn fixtures() -> &'static [Fx] {
    static FIXTURES: OnceLock<Vec<Fx>> = OnceLock::new();
    FIXTURES.get_or_init(|| {
        let dir = std::env::temp_dir().join("spatial-engine-admitted-integer-overflow");
        std::fs::create_dir_all(&dir).unwrap();
        let (v, ab, big) = (["v", "v"], ["a", "b"], 1_152_921_504_606_846_976);
        let a_vals = (0..2048i64).map(|id| match id - 1024 {
            k if k < 0 => id,
            k if k % 2 == 0 => 4_000_000_000 + k,
            k => -(4_000_000_000 + k),
        });
        let b_vals = (0..2048i64).map(|id| if id < 2047 { id } else { 4_000_002_047 });
        let s = [
            2,
            3_037_000_499,
            3_037_000_500,
            -3_037_000_500,
            4_000_000_000,
            4_294_967_295,
        ];
        let e = [0, 1, -1, 2, 3_037_000_499, -3_037_000_499];
        let tc = vec![
            (2, 3),
            (3_037_000_500, 4_000_000_000),
            (-4_000_000_000, 4_294_967_295),
        ];
        let tm = vec![(2, 3), (4_294_967_296, 4_294_967_296), (-1, i64::MIN)];
        let te = vec![
            (2, 3),
            (2_147_483_648, 2_147_483_648),
            (-4_294_967_296, 2_147_483_648),
            (i64::MAX, 1),
            (3_037_000_499, 3_037_000_499),
        ];
        let w =
            |name, cols, rows, stats, fixed| write_fixture(&dir, name, cols, rows, stats, fixed);
        vec![
            w("A-ar-n", v, squares(a_vals), false, OVER),
            w("B-ar-s", v, squares(b_vals), true, OVER),
            w("S-ar-n", v, squares(s), false, OVER),
            w("T-c-ar-n", ab, tc.clone(), false, OVER),
            w("T-c-ar-s", ab, tc, true, OVER),
            w(
                "T-o-ar-n",
                ab,
                vec![(2, 3), (268_435_456, big)],
                false,
                OVER,
            ),
            w(
                "T-o-mirror-ar-n",
                ab,
                vec![(2, 3), (big, 268_435_456)],
                false,
                OVER,
            ),
            w("T-m-ar-n", ab, tm, false, &[Cmp::Gt]),
            w("E-ar-n", v, squares(e), false, &[]),
            w("T-e-ar-n", ab, te, false, &[]),
        ]
    })
}

fn fixture(name: &str) -> &'static Fx {
    fixtures().iter().find(|f| f.name == name).expect("fixture")
}

fn open(f: &Fx) -> Dataset {
    Dataset::open(&f.path).expect("open")
}

fn text(f: &Fx, c: Cmp) -> String {
    let p = format!("{} * {}", f.cols[0], f.cols[1]);
    match c {
        Cmp::Gt => format!("{p} > 0"),
        Cmp::Lt => format!("{p} < 0"),
        Cmp::NotNull => format!("({p}) IS NOT NULL"),
    }
}

/// The ids exact i128 arithmetic selects.
fn oracle(rows: &[(i64, i64)], c: Cmp) -> BTreeSet<u64> {
    let keep = |x: i128| match c {
        Cmp::Gt => x > 0,
        Cmp::Lt => x < 0,
        Cmp::NotNull => true,
    };
    let exact = |r: &(i64, i64)| i128::from(r.0) * i128::from(r.1);
    (0..rows.len())
        .filter(|&i| keep(exact(&rows[i])))
        .map(|i| i as u64)
        .collect()
}

struct Run {
    ids: Vec<u64>,
    batches: usize,
    terminal: Option<String>,
}

impl Run {
    fn set(&self) -> BTreeSet<u64> {
        self.ids.iter().copied().collect()
    }
    fn describe(&self) -> String {
        let (n, first) = (self.ids.len(), &self.ids[..self.ids.len().min(8)]);
        match self.terminal.as_deref() {
            Some(FIXED_DETAIL) => format!("the fixed detail after {} batches", self.batches),
            Some(t) => format!("error {t:?} after {} batches", self.batches),
            None => format!("completed with {n} ids, first {first:?}"),
        }
    }
}

/// One stream, drained to its end: over the whole extent (`view`) or with no viewport. An error at
/// the start and an error from `next_into` are both the terminal.
fn run(f: &Fx, ds: &Dataset, predicate: &str, view: bool) -> Run {
    let p = AdmittedPredicate::admit(predicate.to_string(), ds)
        .unwrap_or_else(|e| panic!("{}: `{predicate}` is not admitted: {e}", f.name));
    let [xmin, ymin, xmax, ymax] = f.extent;
    let q = if view {
        let bbox = Bbox {
            xmin,
            ymin,
            xmax,
            ymax,
        };
        ViewportQuery::viewport(bbox, ds.crs().identifier()).with_limit(f.rows.len() as u64 + 1)
    } else {
        ViewportQuery::all()
    };
    let q = q.with_filter(p);
    let mut out = Run {
        ids: Vec::new(),
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
        let reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None);
        for batch in reader.expect("ipc") {
            let col = batch
                .expect("batch")
                .column_by_name("id")
                .expect("id")
                .clone();
            let col = col
                .as_any()
                .downcast_ref::<UInt64Array>()
                .expect("u64")
                .clone();
            out.ids.extend(col.values().iter().copied());
        }
        buf.clear();
    }
    out
}

fn cell(f: &Fx, predicate: &str, view: bool) -> String {
    format!(
        "{} {} [{predicate}]",
        f.name,
        if view { "view" } else { "all" }
    )
}

/// RECORDED MUTATION: M1, both `[env]` entries removed from `.cargo/config.toml` (the MSVC build main
/// ships: cl.exe, no define), observed at commit 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0 in a second
/// checkout on its own target (all 352 DuckDB units compiled by cl.exe). This test fails: 28 of 30
/// cells did not end in the fixed detail, among them S-ar-n all [v * v > 0], which completed with 2
/// ids, and the T-o cells, which completed with wrapped rows (T-o-ar-n all [a * b > 0]: 1 id); the
/// T-m cells ended in the fixed detail.
/// RECORDED MUTATION: M4, the out-of-range arm of `classify` in `engine/src/stream.rs` deleted,
/// applied alone at commit 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0. This test fails: 30 of 30 cells
/// did not end in the fixed detail, the first (A-ar-n all [v * v > 0]) ending in DuckDB's own text.
#[test]
fn an_admitted_bigint_product_that_overflows_ends_the_stream_in_the_fixed_detail() {
    // Every cell's terminal is collected before anything is asserted, so a failure names them all.
    let (mut lines, mut bad) = (Vec::new(), 0);
    for f in fixtures().iter().filter(|f| !f.fixed.is_empty()) {
        let ds = open(f);
        for (&c, view) in f.fixed.iter().flat_map(|c| [(c, false), (c, true)]) {
            let t = text(f, c);
            let r = run(f, &ds, &t, view);
            let ok = r.terminal.as_deref() == Some(FIXED_DETAIL) && r.batches == 0;
            bad += usize::from(!ok);
            let mark = if ok { "ok  " } else { "FAIL" };
            lines.push(format!("{mark} {}: {}", cell(f, &t, view), r.describe()));
        }
    }
    let all = lines.join("\n");
    assert_eq!(
        bad, 0,
        "{bad} cells did not end in the fixed detail with no batch; all:\n{all}"
    );
}

/// RECORDED MUTATION: M2, the composition `format!("({})", f.sql_text())` in `engine/src/stream.rs`
/// changed to `format!("NOT ({})", f.sql_text())`, applied alone at commit
/// 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0. This test fails at its first cell: E-ar-n all
/// [v * v > 0] completed with 1 ids, first [0], where exact arithmetic selects 5.
/// RECORDED MUTATION: M1, as recorded at the first test of this file, observed at commit
/// 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0. This test also fails, which the form does not predict:
/// T-e-ar-n all [a * b > 0] ended in the fixed detail on the MSVC build.
#[test]
fn an_admitted_bigint_product_that_fits_returns_exactly_the_rows_exact_arithmetic_selects() {
    for f in fixtures().iter().filter(|f| f.fixed.is_empty()) {
        let ds = open(f);
        for (c, view) in ALL.iter().flat_map(|&c| [(c, false), (c, true)]) {
            let t = text(f, c);
            let r = run(f, &ds, &t, view);
            let at = format!("{}: {}", cell(f, &t, view), r.describe());
            assert!(r.terminal.is_none(), "{at}");
            assert_eq!(r.ids.len(), r.set().len(), "{at}: a duplicate id");
            assert_eq!(r.set(), oracle(&f.rows, c), "{at}");
        }
    }
}

/// RECORDED MUTATION: M1, as recorded at the first test of this file, observed at commit
/// 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0. This test fails: 24 runs completed with a wrong id set,
/// the first A-ar-n all [v * v > 0], which delivered 1023 ids where exact arithmetic selects 2047.
#[test]
fn no_admitted_bigint_product_completes_with_rows_exact_arithmetic_does_not_select() {
    // The S1 condition, asserted absent: over every file and predicate here, a run that completes
    // has exactly the oracle's id set (an error is not a completed run).
    let mut wrong = Vec::new();
    for f in fixtures() {
        let ds = open(f);
        for (c, view) in ALL.iter().flat_map(|&c| [(c, false), (c, true)]) {
            let t = text(f, c);
            let (got, want) = (run(f, &ds, &t, view), oracle(&f.rows, c));
            if got.terminal.is_none() && got.set() != want {
                let (g, x) = (got.set().len(), want.len());
                wrong.push(format!("{}: delivered {g}, exact {x}", cell(f, &t, view)));
            }
        }
    }
    let all = wrong.join("\n");
    assert!(
        wrong.is_empty(),
        "{} runs completed with a wrong id set:\n{all}",
        wrong.len()
    );
}

/// RECORDED MUTATION: M3, the BOOLEAN check at the end of `bind_admit` in `engine/src/predicate.rs`
/// (the `inferred != &DataType::Boolean` branch) removed, applied alone at commit
/// 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0. This test fails at C1: `v * v` was refused as
/// `TypeNotAdmitted` (a later stage), not as `NotBoolean`.
#[test]
fn a_bare_product_and_a_decimal_beside_an_integer_are_still_refused() {
    let ds = open(fixture("B-ar-s"));
    let c1 = AdmittedPredicate::admit("v * v".to_string(), &ds);
    let refused = matches!(
        &c1,
        Err(PredicateAdmitError::Filter(FilterError::NotBoolean { .. }))
    );
    assert!(
        refused,
        "C1 `v * v` must be refused as not boolean: {:?}",
        c1.err()
    );
    let c2 = AdmittedPredicate::admit("v * 1.5 > 0".to_string(), &ds);
    let refused = matches!(
        &c2,
        Err(PredicateAdmitError::Filter(
            FilterError::TypeNotAdmitted { .. }
        ))
    );
    assert!(
        refused,
        "C2 `v * 1.5 > 0` must be refused as a type not admitted: {:?}",
        c2.err()
    );
}

/// RECORDED MUTATION: M1, as recorded at the first test of this file, observed at commit
/// 5d9a7eb3f446b0d2ced5785805e3ca6c8765cdf0. This test fails at its first cell: B-ar-s all
/// [4000000000 * 4000000000 > 0] completed with 0 ids, where exact arithmetic selects 2048.
#[test]
fn a_literal_only_bigint_product_returns_the_rows_exact_arithmetic_selects() {
    // A literal-only product (the form's H-L) is not an overflow the stream raises: it completes
    // with the exact rows.
    let f = fixture("B-ar-s");
    let ds = open(f);
    let all: BTreeSet<u64> = (0..f.rows.len() as u64).collect();
    let none = BTreeSet::new();
    let cases = [
        ("4000000000 * 4000000000 > 0", &all),
        ("4000000000 * 4000000000 < 0", &none),
        ("268435456 * 1152921504606846976 > 0", &all),
    ];
    for (t, want) in cases {
        for view in [false, true] {
            let r = run(f, &ds, t, view);
            let at = format!("{}: {}", cell(f, t, view), r.describe());
            assert!(r.terminal.is_none(), "{at}");
            assert_eq!(&r.set(), want, "{at}");
        }
    }
}
