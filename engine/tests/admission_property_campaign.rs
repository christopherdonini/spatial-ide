// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Wave 2 B — a deterministic, seeded **property campaign** against the ADR-021 filter-admission
//! boundary ([`AdmittedPredicate::admit`]), composed with B1's live projection
//! ([`Dataset::stream_projected_with_cancel`]).
//!
//! **Evidence only.** This file changes no product code and adds no dependency: the generators are
//! a plain SplitMix64 stream in test code (no property-testing crate is a dependency of this
//! workspace, and none is added). Every generator's seed and case count is a constant below, and the
//! run prints them with its tallies (`--nocapture`).
//!
//! The four properties:
//!
//! - **P1** — every generated predicate is either refused with a *named* `skp.filter_*` code, or
//!   admitted with the bbox and the limit intact in the composed SQL. Checked two ways for every
//!   admitted predicate: (a) the composition rule ADR-021 item 4 states as a string
//!   (`SELECT <projection> FROM read_parquet(?) WHERE (<predicate>) AND <bbox> LIMIT <n>`) is
//!   rebuilt here and parsed by DuckDB's own parser (`json_serialize_sql`, an oracle independent of
//!   `predicate.rs`), and the parse must end its top-level `AND` in the four covering-bbox
//!   comparisons and carry exactly one `LIMIT <n>`; (b) the real stream is drained and every row it
//!   delivers must intersect the viewport per an independent DuckDB read of the covering column,
//!   and the row count must equal `min(limit, matching rows)`.
//! - **P2** — admission is deterministic: the same predicate against the same schema gives the same
//!   result three times (twice on one `Dataset`, once on a freshly opened one).
//! - **P3** — no admitted predicate reaches a function call, a file read, or a network access: the
//!   composed statement's parse carries no non-operator function, no table function but the
//!   engine's own `read_parquet`, no subquery and no parameter beyond the engine's five; and every
//!   canary path the hostile generators name (files to read, files a smuggled `COPY`/`ATTACH`
//!   would create) is still absent after the campaign.
//! - **P4** — no refusal carries data from the file: a refusal's rendered text (Display and Debug)
//!   contains no attribute value the fixture wrote that the predicate itself did not already carry.

use std::collections::{BTreeMap, BTreeSet};
use std::panic::{catch_unwind, AssertUnwindSafe};
use std::path::PathBuf;

use arrow::array::{Array, Float64Array, UInt64Array};
use serde_json::Value;

use spatial_engine::cancel::CancelToken;
use spatial_engine::fixture::{
    configured_connection, i64_for, text_for, write_geoparquet, AttributeMode, CrsMode,
    FixtureFacts, FixtureSpec, ZONE_VALUES,
};
use spatial_engine::{
    AdmittedPredicate, Bbox, Dataset, FilterError, PredicateAdmitError, TypeRefusalReason,
    ViewportQuery, ID_COLUMN, MAX_PREDICATE_BYTES,
};

// ---------------------------------------------------------------------------------------------
// Seeds and case counts (recorded; the report quotes these)
// ---------------------------------------------------------------------------------------------

const FIXTURE_SEED: u64 = 0x5EED_2056_0B02_0001;
const FIXTURE_FEATURES: usize = 800;

/// G1 — predicates drawn from the admitted grammar (comparisons, arithmetic, BETWEEN, IN-lists,
/// LIKE/ILIKE with a literal pattern, IS [NOT] NULL, NOT, AND/OR, bare boolean column).
const G1_SEED: u64 = 0x0B02_A001_0000_0001;
const G1_CASES: usize = 500;
/// G2 — predicates from outside the grammar: one hostile template (subquery, function call, CAST,
/// placeholder, comment, statement separator, quote/dollar-quote game, breakout, huge literal,
/// identifier collision) with a G1 fragment spliced in.
const G2_SEED: u64 = 0x0B02_A002_0000_0002;
const G2_CASES: usize = 900;
/// G3 — token-splice mutations of G1 predicates (insert/delete/duplicate a structural token).
const G3_SEED: u64 = 0x0B02_A003_0000_0003;
const G3_CASES: usize = 900;
/// G4 — deep nesting and huge literals around both declared ceilings.
const G4_SEED: u64 = 0x0B02_A004_0000_0004;
const G4_CASES: usize = 200;

// ---------------------------------------------------------------------------------------------
// Deterministic generator
// ---------------------------------------------------------------------------------------------

/// SplitMix64 — the same generator family `engine/src/fixture.rs` uses, written out here so this
/// file depends on nothing but `std`.
struct Rng(u64);

impl Rng {
    fn new(seed: u64) -> Self {
        Self(seed)
    }
    fn next(&mut self) -> u64 {
        self.0 = self.0.wrapping_add(0x9E37_79B9_7F4A_7C15);
        let mut z = self.0;
        z = (z ^ (z >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
        z = (z ^ (z >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
        z ^ (z >> 31)
    }
    fn below(&mut self, n: usize) -> usize {
        (self.next() % n as u64) as usize
    }
    fn chance(&mut self, pct: u64) -> bool {
        self.next() % 100 < pct
    }
    fn pick<'a, T>(&mut self, xs: &'a [T]) -> &'a T {
        &xs[self.below(xs.len())]
    }
}

// ---------------------------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------------------------

struct Fixture {
    path: PathBuf,
    facts: FixtureFacts,
    /// `id -> (xmin, ymin, xmax, ymax)` of the covering `bbox` column, read by an independent DuckDB
    /// connection — never from the stream under test.
    covering: BTreeMap<u64, [f64; 4]>,
}

fn fixture() -> &'static Fixture {
    static FIXTURE: std::sync::OnceLock<Fixture> = std::sync::OnceLock::new();
    FIXTURE.get_or_init(|| {
        let spec = FixtureSpec {
            features: FIXTURE_FEATURES,
            attributes: AttributeMode::MultiType,
            crs_mode: CrsMode::DeclaredLv95,
            seed: FIXTURE_SEED,
            ..Default::default()
        };
        let dir = std::env::temp_dir().join("spatial-engine-wave2-admission-property");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("multitype.parquet");
        let facts = write_geoparquet(&path, &spec).expect("fixture");

        let conn = configured_connection().expect("oracle connection");
        let mut stmt = conn
            .prepare(
                "SELECT id, bbox.xmin AS xmin, bbox.ymin AS ymin, bbox.xmax AS xmax, bbox.ymax AS ymax \
                 FROM read_parquet(?)",
            )
            .expect("prepare covering oracle");
        let mut covering = BTreeMap::new();
        let p = path.to_string_lossy().to_string();
        for batch in stmt.query_arrow([p.as_str()]).expect("covering oracle") {
            let ids = batch.column(0).as_any().downcast_ref::<UInt64Array>().expect("u64 id").clone();
            let f = |i: usize| {
                batch.column(i).as_any().downcast_ref::<Float64Array>().expect("f64 bbox").clone()
            };
            let (a, b, c, d) = (f(1), f(2), f(3), f(4));
            for r in 0..batch.num_rows() {
                covering.insert(ids.value(r), [a.value(r), b.value(r), c.value(r), d.value(r)]);
            }
        }
        assert_eq!(covering.len(), FIXTURE_FEATURES, "covering oracle read every row");
        Fixture { path, facts, covering }
    })
}

/// The canary directory every hostile generator names for reads, writes, attaches and URLs. It is
/// created empty and must still be empty after the campaign (P3's runtime half).
fn canary_dir() -> PathBuf {
    let d = std::env::temp_dir().join("spatial-engine-wave2-admission-canary");
    let _ = std::fs::remove_dir_all(&d);
    std::fs::create_dir_all(&d).unwrap();
    d
}

// ---------------------------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------------------------

const NUM_COLS: &[&str] = &["area", "f32", "i64", "id"];
const CMP: &[&str] = &[
    "=",
    "<>",
    "!=",
    "<",
    ">",
    "<=",
    ">=",
    "IS DISTINCT FROM",
    "IS NOT DISTINCT FROM",
];

fn num_lit(r: &mut Rng) -> String {
    match r.below(6) {
        0 => format!("{}", r.below(1000)),
        1 => format!("-{}", r.below(1000)),
        2 => format!("{}.{}", r.below(10_000), r.below(100)),
        3 => format!("{}", (r.next() >> 20) as i64 - (1i64 << 42)),
        4 => "0.1".to_string(),
        _ => format!("{}e{}", r.below(9) + 1, r.below(4)),
    }
}

fn kw(r: &mut Rng, k: &str) -> String {
    match r.below(3) {
        0 => k.to_string(),
        1 => k.to_lowercase(),
        _ => {
            let mut s = String::new();
            for (i, c) in k.chars().enumerate() {
                s.push(if i % 2 == 0 {
                    c.to_ascii_lowercase()
                } else {
                    c
                });
            }
            s
        }
    }
}

fn ws(r: &mut Rng) -> &'static str {
    *r.pick(&[" ", " ", " ", "  ", "\t", "\n", " \n "])
}

fn leaf(r: &mut Rng) -> String {
    match r.below(14) {
        0 | 1 => format!("{} {} {}", r.pick(NUM_COLS), r.pick(CMP), num_lit(r)),
        2 => format!("zone {} '{}'", r.pick(&["=", "<>"]), r.pick(&ZONE_VALUES)),
        3 => {
            let op = *r.pick(&["LIKE", "ILIKE", "NOT LIKE", "NOT ILIKE"]);
            let op = kw(r, op);
            format!(
                "zone {op} '{}'",
                r.pick(&["r%", "%al", "%", "_ivic", "RES%"])
            )
        }
        4 => format!("text {} 'row-0000000000000000%'", kw(r, "LIKE")),
        5 => {
            let n = r.below(4) + 1;
            let items: Vec<String> = (0..n)
                .map(|_| format!("'{}'", r.pick(&ZONE_VALUES)))
                .collect();
            let op = *r.pick(&["IN", "NOT IN"]);
            format!("zone {} ({})", kw(r, op), items.join(", "))
        }
        6 => {
            let n = r.below(4) + 1;
            let items: Vec<String> = (0..n).map(|_| num_lit(r)).collect();
            format!("{} IN ({})", r.pick(NUM_COLS), items.join(","))
        }
        7 => {
            let c = *r.pick(&["zone", "area", "f32", "i64", "flag", "text", "id"]);
            let op = *r.pick(&["IS NULL", "IS NOT NULL"]);
            format!("{c} {}", kw(r, op))
        }
        8 => r
            .pick(&[
                "flag",
                "NOT flag",
                "flag = true",
                "flag <> false",
                "flag IS TRUE",
            ])
            .to_string(),
        9 => {
            let a = num_lit(r);
            let b = num_lit(r);
            let c = *r.pick(NUM_COLS);
            let op = *r.pick(&["BETWEEN", "NOT BETWEEN"]);
            let op = kw(r, op);
            let and = kw(r, "AND");
            format!("{c} {op} {a} {and} {b}")
        }
        10 => format!(
            "({} {} {}) {} {} {}",
            r.pick(NUM_COLS),
            r.pick(&["+", "-", "*", "/"]),
            num_lit(r),
            r.pick(&["*", "+"]),
            r.below(5) + 1,
            format!("{} {}", r.pick(&["<", ">", "="]), num_lit(r))
        ),
        11 => format!("-{} < {}", r.pick(NUM_COLS), num_lit(r)),
        12 => format!("{} {} {}", r.pick(NUM_COLS), r.pick(CMP), r.pick(NUM_COLS)),
        _ => format!("f32 {} 0.1", r.pick(&["=", ">", "<"])),
    }
}

/// G1: an expression from the admitted grammar.
fn gen_expr(r: &mut Rng, depth: usize) -> String {
    if depth == 0 || r.chance(35) {
        let l = leaf(r);
        return if r.chance(20) { format!("({l})") } else { l };
    }
    match r.below(4) {
        0 => format!(
            "({}){}{}{}({})",
            gen_expr(r, depth - 1),
            ws(r),
            kw(r, "AND"),
            ws(r),
            gen_expr(r, depth - 1)
        ),
        1 => format!(
            "{}{}{}{}{}",
            gen_expr(r, depth - 1),
            ws(r),
            kw(r, "OR"),
            ws(r),
            gen_expr(r, depth - 1)
        ),
        2 => format!("{} ({})", kw(r, "NOT"), gen_expr(r, depth - 1)),
        _ => format!(
            "{} {} {}",
            gen_expr(r, depth - 1),
            kw(r, "AND"),
            gen_expr(r, depth - 1)
        ),
    }
}

/// Hostile templates for G2. `{e}` is a G1 fragment; `{c}` is the canary directory.
const HOSTILE: &[&str] = &[
    // subqueries
    "({e}) AND EXISTS (SELECT 1)",
    "zone IN (SELECT zone FROM read_parquet('{c}/in.parquet'))",
    "(SELECT count(*) FROM read_csv('{c}/sub.csv')) > 0",
    "{e} AND i64 = ANY(SELECT 1)",
    "(SELECT true)",
    "EXISTS (FROM '{c}/from.csv')",
    "i64 = (FROM range(1))",
    "{e} AND (SELECT flag)",
    // function calls
    "length(zone) > 3",
    "read_text('{c}/read.txt') IS NOT NULL",
    "getenv('HOME') = zone",
    "current_setting('threads') IS NULL",
    "abs(i64) > 0",
    "random() < 0.5",
    "{e} AND glob('{c}/*') IS NULL",
    "zone = read_blob('http://127.0.0.1:9/{c}/net')",
    "zone ^@ 'r'",
    "zone || 'x' = 'rx'",
    "i64 % 2 = 0",
    "i64 // 2 = 0",
    "2 ** 3 = 8",
    "zone SIMILAR TO 'r.*'",
    "zone GLOB 'r*'",
    "zone ~ 'r'",
    "list_contains([1], i64)",
    "{'a': 1}.a = 1",
    "[1, 2][1] = 1",
    "current_date IS NULL",
    "now() IS NULL",
    "nextval('s') > 0",
    "COLUMNS('.*') IS NULL",
    "* IS NULL",
    "CASE WHEN flag THEN true ELSE false END",
    "COALESCE(flag, false)",
    "IF(flag, true, false)",
    "zone LIKE zone",
    "zone LIKE 'a' ESCAPE '!'",
    "zone COLLATE nocase = 'x'",
    "(i64, i64) = (1, 1)",
    "ROW(1, 2) IS NULL",
    "list_filter([1], x -> x > 0) IS NULL",
    "{e} AND starts_with(zone, 'r')",
    "{e} AND query('SELECT 1') IS NULL",
    "{e} AND read_parquet('{c}/rp.parquet') IS NULL",
    "zone = (SELECT content FROM read_text('{c}/rt.txt'))",
    "{e} AND 'http://127.0.0.1:9/x' IN (SELECT file FROM glob('{c}/*'))",
    // CAST
    "CAST(i64 AS VARCHAR) = '1'",
    "i64::VARCHAR = '1'",
    "TRY_CAST(zone AS INT) = 1",
    "DATE '2020-01-01' < d32",
    "INTERVAL 1 DAY IS NULL",
    "TIMESTAMP '2020-01-01' IS NULL",
    "'1'::INT = i64",
    "{e} AND flag::BOOLEAN",
    // placeholders
    "i64 = ?",
    "i64 = $1",
    "zone = $name",
    "{e} AND ? IS NULL",
    "?",
    "$1",
    "{e} AND i64 = ?1",
    // comments
    "{e} --",
    "{e} -- trailing",
    "{e} /* c */",
    "/* c */ {e}",
    "{e} /*",
    "{e}) AND 1=1 --",
    "{e}) AND 2=2 --",
    "{e}) AND 1=1 /*",
    "{e}\n-- c\n",
    "{e} --\n",
    "{e}) --\n AND (1=1",
    "{e} /* ) AND 1=1 */",
    "{e}) AND 1=1 AND 2=2 --",
    "{e}) AND (1=1) --",
    // statement separators
    "{e}; SELECT 1",
    "{e};",
    "; {e}",
    "{e}) ; DROP TABLE x; --",
    "{e}); COPY (SELECT 1) TO '{c}/copy.csv'; --",
    "{e}); ATTACH '{c}/attach.db'; --",
    "{e}); INSTALL httpfs; --",
    "{e}); LOAD httpfs; --",
    "{e}); SET enable_external_access = true; --",
    "{e}); PRAGMA version; --",
    "{e}) AND 1=1; COPY (SELECT 1) TO '{c}/copy2.csv' --",
    // breakouts / limit games
    "{e}) OR (1=1",
    "{e}) OR TRUE OR (1=1",
    "{e}) LIMIT 1000000 --",
    "{e}) AND 1=1 LIMIT 1000000 --",
    "{e}) ORDER BY 1 --",
    "{e}) GROUP BY 1 HAVING count(*) > 0 --",
    "{e}) UNION SELECT 1 WHERE (1=1",
    "{e}) UNION ALL SELECT 1 WHERE (1=1",
    "{e}) QUALIFY (1=1",
    "{e}) USING SAMPLE 1 --",
    "{e}) AND (1=1) OR (1=1",
    "{e}) AND (true",
    "flag) AND (flag",
    "{e}) AND 1=1 AND (2=2",
    "i64) BETWEEN (0",
    "i64) NOT BETWEEN (0",
    "{e}) IS NOT NULL AND (true",
    "{e}) = (true",
    "{e}) OR (",
    "(({e}",
    "{e}))",
    ")",
    "(",
    "",
    " ",
    "--",
    "/* */",
    // quote games
    "zone = 'a''b'",
    "zone = 'a",
    "zone = 'x'') OR (''1''=''1'",
    "zone = \"residential\"",
    "\"zone\" = 'residential'",
    "\"zo\"\"ne\" = 'x'",
    "zone = E'\\''",
    "zone = e'x'",
    "zone = $$x$$",
    "zone = $$x) AND 1=1 --$$",
    "zone = $t$x$t$",
    "zone = $t$x$$",
    "zone = $$",
    "zone = $$ ) OR (1=1 $$",
    "zone = $$ ) AND 1=1 -- $$ AND {e}",
    "zone = U&'\\0041'",
    "zone = N'x'",
    "zone = x'41'",
    "zone = B'01'",
    "'a' = 'a'",
    "\"\" = 1",
    "zone = '\u{0}'",
    "zone = '\\'",
    "zone = 'é' OR {e}",
    // identifier collisions (with projected, aliased, surrogate and covering names)
    "id > 3",
    "\"id\" > 3",
    "ID > 3",
    "geometry IS NULL",
    "\"geometry\" IS NULL",
    "bbox IS NULL",
    "bbox.xmin > 0",
    "\"bbox\".\"xmin\" > 0",
    "__predicate_result",
    "\"__predicate_result\" IS NULL",
    "__surrogate_anchor = 1",
    "__surrogate.zone = 'x'",
    "\"__surrogate\".\"zone\" = 'x'",
    "d32 IS NULL",
    "rowid = 1",
    "filename = 'x'",
    "file_row_number = 1",
    "read_parquet.zone = 'x'",
    "ZONE = 'residential'",
    "Zone = 'residential'",
    "\"ZONE\" = 'x'",
    "text = 'x'",
    "\"text\" = 'x'",
    "flag.x",
    "zone.len",
    "\"id\" = \"id\"",
    "zone = zone AND {e}",
];

fn render(template: &str, e: &str, canary: &str) -> String {
    template.replace("{e}", e).replace("{c}", canary)
}

const SPLICE_TOKENS: &[&str] = &[
    ")",
    "(",
    "--",
    "/*",
    "*/",
    ";",
    "'",
    "\"",
    "$$",
    "?",
    "$1",
    " AND 1=1",
    " AND 2=2",
    " OR 1=1",
    "::INT",
    " LIMIT 1",
    "\n",
    "read_csv('c')",
    "(SELECT 1)",
    "\\",
    ",",
    " 2=2 ",
    ") AND (",
    ") OR (",
    "NOT ",
    "E'",
    "$t$",
    " BETWEEN 0 AND ",
    " COLLATE nocase",
    "*",
    "id",
    "geometry",
    "abs(",
];

/// G3: one to three structural-token mutations of a G1 predicate.
fn splice(r: &mut Rng, base: &str) -> String {
    let mut s = base.to_string();
    for _ in 0..(r.below(3) + 1) {
        let boundaries: Vec<usize> = (0..=s.len()).filter(|&i| s.is_char_boundary(i)).collect();
        let at = *r.pick(&boundaries);
        match r.below(4) {
            0 | 1 => {
                let t: &str = *r.pick(SPLICE_TOKENS);
                s.insert_str(at, t)
            }
            2 if at < s.len() => {
                let end = boundaries
                    .iter()
                    .copied()
                    .find(|&b| b > at)
                    .unwrap_or(s.len());
                s.replace_range(at..end, "");
            }
            _ => {
                let end = (at + r.below(8)).min(s.len());
                let end = boundaries
                    .iter()
                    .copied()
                    .filter(|&b| b <= end)
                    .last()
                    .unwrap_or(at);
                let dup = s[at..end].to_string();
                s.insert_str(at, &dup);
            }
        }
    }
    s
}

/// G4: deep nesting and huge literals around both declared ceilings.
fn gen_ceiling(r: &mut Rng) -> String {
    match r.below(7) {
        0 => {
            let k = 20 + r.below(60);
            format!("{}flag{}", "NOT (".repeat(k), ")".repeat(k))
        }
        1 => {
            let k = 100 + r.below(2500);
            format!("{}flag{}", "(".repeat(k), ")".repeat(k))
        }
        2 => {
            // alternating AND/OR behind explicit parens — genuine depth
            let k = 10 + r.below(40);
            let mut s = "flag".to_string();
            for i in 0..k {
                s = format!("({s} {} flag)", if i % 2 == 0 { "AND" } else { "OR" });
            }
            s
        }
        3 => {
            let n = MAX_PREDICATE_BYTES - 20 + r.below(40);
            format!("zone = '{}'", "a".repeat(n.saturating_sub(10)))
        }
        4 => format!("i64 = {}", "9".repeat(10 + r.below(4000))),
        5 => {
            let lit = *r.pick(&[
                "1e308",
                "1e309",
                "-9223372036854775808",
                "9223372036854775808",
                "170141183460469231731687303715884105728",
                "0.000000000000000000000000001",
                "NaN",
                "'inf'",
            ]);
            format!("{} < {lit}", r.pick(NUM_COLS))
        }
        _ => {
            let k = 50 + r.below(400);
            let items: Vec<String> = (0..k)
                .map(|i| format!("'{}{i}'", r.pick(&ZONE_VALUES)))
                .collect();
            format!("zone IN ({})", items.join(","))
        }
    }
}

// ---------------------------------------------------------------------------------------------
// Admission outcome
// ---------------------------------------------------------------------------------------------

/// The named `skp.filter_*` code a refusal maps to (SKP-V0 §7.5; ADR-021 item 8). Exhaustive, no
/// wildcard arm: a new variant is a compile error here, exactly the discipline the product keeps.
fn code_of(e: &FilterError) -> &'static str {
    match e {
        FilterError::DialectUnsupported { .. } => "skp.filter_dialect_unsupported",
        FilterError::Unparsable { .. } => "skp.filter_unparsable",
        FilterError::NotASingleExpression { .. } => "skp.filter_not_a_single_expression",
        FilterError::ConstructNotAdmitted { .. } => "skp.filter_construct_not_admitted",
        FilterError::UnknownColumn { .. } => "skp.filter_unknown_column",
        FilterError::ColumnNotFilterable { .. } => "skp.filter_column_not_filterable",
        FilterError::IdentityAliasAmbiguous { .. } => "skp.filter_identity_alias_ambiguous",
        FilterError::NotBoolean { .. } => "skp.filter_not_boolean",
        FilterError::TooLong { .. } => "skp.filter_too_long",
        FilterError::TooDeep { .. } => "skp.filter_too_deep",
        FilterError::RejectedByBinder { .. } => "skp.filter_rejected_by_binder",
        FilterError::TypeNotAdmitted { .. } => "skp.filter_type_not_admitted",
    }
}

#[derive(Debug, Clone, PartialEq)]
enum Outcome {
    Admitted(String),
    Refused(PredicateAdmitError),
    Panicked(String),
}

fn admit(ds: &Dataset, predicate: &str) -> Outcome {
    match catch_unwind(AssertUnwindSafe(|| {
        AdmittedPredicate::admit(predicate.to_string(), ds)
    })) {
        Ok(Ok(p)) => Outcome::Admitted(p.sql_text().to_string()),
        Ok(Err(e)) => Outcome::Refused(e),
        Err(panic) => Outcome::Panicked(
            panic
                .downcast_ref::<String>()
                .cloned()
                .or_else(|| panic.downcast_ref::<&str>().map(|s| s.to_string()))
                .unwrap_or_else(|| "<non-string panic>".to_string()),
        ),
    }
}

// ---------------------------------------------------------------------------------------------
// P1(a) / P3 oracle — DuckDB's own parser over the rebuilt composition (ADR-021 item 4)
// ---------------------------------------------------------------------------------------------

fn q(s: &str) -> String {
    format!("\"{}\"", s.replace('"', "\"\""))
}

/// ADR-021 item 4's composition rule, stated as a string, for the native-identity, unordered,
/// index-off plan this campaign streams through (`build_sql`'s default-plan branch).
fn composed_sql(predicate: &str, projection: &[String], limit: u64) -> String {
    let mut cols = format!("{} AS {}, {}", q(ID_COLUMN), q(ID_COLUMN), q("geometry"));
    for c in projection {
        cols.push_str(", ");
        cols.push_str(&q(c));
    }
    format!(
        "SELECT {cols} FROM read_parquet(?) WHERE ({predicate}) AND \"bbox\".\"xmin\" <= ? AND \
         \"bbox\".\"xmax\" >= ? AND \"bbox\".\"ymin\" <= ? AND \"bbox\".\"ymax\" >= ? LIMIT {limit}"
    )
}

const ADMITTED_OPERATOR_FUNCTIONS: &[&str] = &["+", "-", "*", "/", "~~", "~~*", "!~~", "!~~*"];

/// Walk every JSON object below `v`, counting what P3 forbids. Deliberately generic — it recurses
/// into every value of every object, not into the fields `predicate.rs` knows about — so it is an
/// oracle independent of the product's allowlist walk.
fn forbidden_in(v: &Value, params: &mut usize, out: &mut Vec<String>) {
    match v {
        Value::Object(m) => {
            let class = m.get("class").and_then(Value::as_str).unwrap_or("");
            let ty = m.get("type").and_then(Value::as_str).unwrap_or("");
            match class {
                "FUNCTION" => {
                    let name = m
                        .get("function_name")
                        .and_then(Value::as_str)
                        .unwrap_or("?");
                    let is_op = m
                        .get("is_operator")
                        .and_then(Value::as_bool)
                        .unwrap_or(false);
                    if !(is_op && ADMITTED_OPERATOR_FUNCTIONS.contains(&name)) {
                        out.push(format!("function `{name}` (is_operator={is_op})"));
                    }
                }
                "SUBQUERY" | "CAST" | "LAMBDA" | "STAR" | "COLLATE" | "CASE" | "WINDOW" => {
                    out.push(format!("node class {class}"))
                }
                "PARAMETER" => *params += 1,
                _ => {}
            }
            if matches!(ty, "TABLE_FUNCTION" | "SUBQUERY" | "BASE_TABLE" | "JOIN") {
                out.push(format!("table ref {ty}"));
            }
            for (_, child) in m {
                forbidden_in(child, params, out);
            }
        }
        Value::Array(a) => a.iter().for_each(|c| forbidden_in(c, params, out)),
        _ => {}
    }
}

fn is_bbox_cmp(v: &Value, field: &str, ty: &str) -> bool {
    v.get("class").and_then(Value::as_str) == Some("COMPARISON")
        && v.get("type").and_then(Value::as_str) == Some(ty)
        && v.get("left").and_then(|l| l.get("column_names"))
            == Some(&serde_json::json!(["bbox", field]))
        && v.get("right")
            .and_then(|r| r.get("class"))
            .and_then(Value::as_str)
            == Some("PARAMETER")
}

/// Parse the composed statement and check P1(a) and P3 on it. Returns every violation found.
fn check_composed(
    conn: &duckdb::Connection,
    predicate: &str,
    projection: &[String],
    limit: u64,
) -> Vec<String> {
    let sql = composed_sql(predicate, projection, limit);
    let json: String = conn
        .query_row(
            "SELECT json_serialize_sql(CAST(? AS VARCHAR))",
            [sql.as_str()],
            |r| r.get(0),
        )
        .expect("json_serialize_sql");
    let v: Value = serde_json::from_str(&json).expect("json");
    let mut bad = Vec::new();
    if v.get("error").and_then(Value::as_bool) != Some(false) {
        bad.push(format!(
            "composed statement does not parse: {}",
            v.get("error_message").unwrap_or(&Value::Null)
        ));
        return bad;
    }
    let stmts = v["statements"].as_array().cloned().unwrap_or_default();
    if stmts.len() != 1 {
        bad.push(format!("composed text is {} statements", stmts.len()));
        return bad;
    }
    let node = &stmts[0]["node"];
    if node["type"] != "SELECT_NODE" {
        bad.push(format!("composed statement is {}", node["type"]));
        return bad;
    }
    // LIMIT intact: exactly one modifier, a LIMIT carrying our own constant.
    let mods = node["modifiers"].as_array().cloned().unwrap_or_default();
    let limit_ok = mods.len() == 1
        && mods[0]["type"] == "LIMIT_MODIFIER"
        && mods[0]["limit"]["class"] == "CONSTANT"
        && mods[0]["limit"]["value"]["value"].as_u64() == Some(limit);
    if !limit_ok {
        bad.push(format!(
            "LIMIT not intact: modifiers = {}",
            Value::Array(mods.clone())
        ));
    }
    for k in ["group_expressions", "group_sets"] {
        if node[k].as_array().map(|a| !a.is_empty()).unwrap_or(true) {
            bad.push(format!("{k} non-empty"));
        }
    }
    for k in ["having", "sample", "qualify"] {
        if !node[k].is_null() {
            bad.push(format!("{k} present"));
        }
    }
    // FROM: exactly the engine's own `read_parquet(?)`.
    let from = &node["from_table"];
    let from_ok = from["type"] == "TABLE_FUNCTION"
        && from["function"]["function_name"] == "read_parquet"
        && from["function"]["children"]
            .as_array()
            .map(|c| c.len() == 1 && c[0]["class"] == "PARAMETER")
            .unwrap_or(false);
    if !from_ok {
        bad.push("FROM is not exactly read_parquet(?)".to_string());
    }
    // Select list: exactly id, geometry, then the projection.
    let sel = node["select_list"].as_array().cloned().unwrap_or_default();
    if sel.len() != 2 + projection.len() {
        bad.push(format!(
            "select list has {} entries, expected {}",
            sel.len(),
            2 + projection.len()
        ));
    }
    // WHERE: a top-level AND whose last four operands are exactly the covering-bbox comparisons.
    let w = &node["where_clause"];
    let children = w["children"].as_array().cloned().unwrap_or_default();
    let n = children.len();
    let bbox_ok = w["class"] == "CONJUNCTION"
        && w["type"] == "CONJUNCTION_AND"
        && n >= 5
        && is_bbox_cmp(&children[n - 4], "xmin", "COMPARE_LESSTHANOREQUALTO")
        && is_bbox_cmp(&children[n - 3], "xmax", "COMPARE_GREATERTHANOREQUALTO")
        && is_bbox_cmp(&children[n - 2], "ymin", "COMPARE_LESSTHANOREQUALTO")
        && is_bbox_cmp(&children[n - 1], "ymax", "COMPARE_GREATERTHANOREQUALTO");
    if !bbox_ok {
        bad.push(
            "bbox not intact: WHERE is not `<predicate operands> AND <4 bbox comparisons>`"
                .to_string(),
        );
    }
    // P3 over the predicate's own operands, and over the whole statement's parameter count.
    let mut params = 0usize;
    let mut forbidden = Vec::new();
    for c in children.iter().take(n.saturating_sub(4)) {
        forbidden_in(c, &mut params, &mut forbidden);
    }
    if params != 0 {
        bad.push(format!("predicate operands carry {params} parameter(s)"));
    }
    let mut total_params = 0usize;
    let mut whole_forbidden = Vec::new();
    forbidden_in(node, &mut total_params, &mut whole_forbidden);
    // The statement's own `read_parquet` is the one table function allowed (it appears as a
    // TABLE_FUNCTION ref, and its inner FUNCTION node `read_parquet`).
    whole_forbidden.retain(|f| {
        f != "table ref TABLE_FUNCTION" && f != "function `read_parquet` (is_operator=false)"
    });
    if total_params != 5 {
        bad.push(format!(
            "statement carries {total_params} parameters, expected the engine's 5"
        ));
    }
    for f in forbidden.into_iter().chain(whole_forbidden) {
        bad.push(format!("P3: {f}"));
    }
    bad.sort();
    bad.dedup();
    bad
}

// ---------------------------------------------------------------------------------------------
// P1(b) — the real stream
// ---------------------------------------------------------------------------------------------

const PROJECTABLE: &[&str] = &["zone", "area", "f32", "i64", "flag", "text"];

struct StreamCheck {
    violations: Vec<String>,
    error: Option<String>,
}

fn stream_check(
    ds: &Dataset,
    fx: &Fixture,
    conn: &duckdb::Connection,
    predicate: &AdmittedPredicate,
    view: Bbox,
    limit: u64,
    projection: &[String],
) -> StreamCheck {
    let q = ViewportQuery::viewport(view, ds.crs().identifier())
        .with_limit(limit)
        .with_filter(predicate.clone());
    let started = if projection.is_empty() {
        ds.stream_with_cancel(&q, CancelToken::new())
    } else {
        let proj = ds
            .admit_projection(projection)
            .expect("projection is admitted");
        ds.stream_projected_with_cancel(&q, &proj, CancelToken::new())
    };
    let mut stream = match started {
        Ok(s) => s,
        Err(e) => {
            return StreamCheck {
                violations: vec![],
                error: Some(format!("start: {e}")),
            }
        }
    };
    let mut ids: Vec<u64> = Vec::new();
    let mut buf = Vec::new();
    let mut error = None;
    while let Some(info) = stream.next_into(&mut buf) {
        if let Err(e) = info {
            error = Some(format!("{e}"));
            break;
        }
        let reader = arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None)
            .expect("ipc");
        for batch in reader {
            let batch = batch.expect("batch");
            let col = batch.column_by_name(ID_COLUMN).expect("id");
            let col = col.as_any().downcast_ref::<UInt64Array>().expect("u64");
            for r in 0..batch.num_rows() {
                ids.push(col.value(r));
            }
        }
        buf.clear();
    }
    let mut violations = Vec::new();
    if error.is_some() {
        return StreamCheck { violations, error };
    }
    if ids.len() as u64 > limit {
        violations.push(format!(
            "LIMIT not intact at run time: {} rows > limit {limit}",
            ids.len()
        ));
    }
    for id in &ids {
        let [xmin, ymin, xmax, ymax] = fx.covering[id];
        let hit = xmin <= view.xmax && xmax >= view.xmin && ymin <= view.ymax && ymax >= view.ymin;
        if !hit {
            violations.push(format!(
                "bbox not intact at run time: id {id} outside the viewport"
            ));
            break;
        }
    }
    // Count oracle: the same composition evaluated by an independent connection. Only its size is
    // used — `min(limit, matching)` rows must come back, so a limit is neither dropped nor tightened.
    let count_sql = format!(
        "SELECT count(*) FROM read_parquet(?) WHERE ({}) AND bbox.xmin <= ? AND bbox.xmax >= ? \
         AND bbox.ymin <= ? AND bbox.ymax >= ?",
        predicate.sql_text()
    );
    let p = fx.path.to_string_lossy().to_string();
    let matching: Result<i64, _> = conn.query_row(
        &count_sql,
        duckdb::params![p, view.xmax, view.xmin, view.ymax, view.ymin],
        |r| r.get(0),
    );
    if let Ok(m) = matching {
        let expect = (m as u64).min(limit);
        if ids.len() as u64 != expect {
            violations.push(format!(
                "row count {} != min(limit {limit}, matching {m})",
                ids.len()
            ));
        }
    }
    StreamCheck { violations, error }
}

// ---------------------------------------------------------------------------------------------
// P4 — file data in a refusal
// ---------------------------------------------------------------------------------------------

/// Distinctive attribute values the fixture wrote. A refusal's text may carry one only if the
/// predicate itself did.
fn file_tokens() -> Vec<String> {
    let mut t: Vec<String> = ZONE_VALUES.iter().map(|s| s.to_string()).collect();
    for id in 0..FIXTURE_FEATURES as u64 {
        t.push(i64_for(FIXTURE_SEED, id).to_string());
    }
    for id in 0..40u64 {
        let text = text_for(FIXTURE_SEED, id);
        t.push(text[..26].to_string());
        t.push(text[40..56].to_string());
    }
    t
}

fn leaked<'a>(tokens: &'a [String], predicate: &str, rendered: &str) -> Vec<&'a str> {
    tokens
        .iter()
        .filter(|t| !predicate.contains(t.as_str()) && rendered.contains(t.as_str()))
        .map(String::as_str)
        .collect()
}

// ---------------------------------------------------------------------------------------------
// The campaign
// ---------------------------------------------------------------------------------------------

#[derive(Default)]
struct Tally {
    cases: usize,
    admitted: usize,
    refused: BTreeMap<&'static str, usize>,
    streamed: usize,
    stream_errors: usize,
}

struct Counterexample {
    generator: &'static str,
    seed: u64,
    case: usize,
    property: &'static str,
    predicate: String,
    detail: String,
}

/// The campaign's one declared exclusion (section 2.5(d); section 2.10): overflow in admitted
/// integer arithmetic (`+`, `-`, `*`, unary `-`), whose operand conversions are all lossless
/// widenings -- out of scope for this piece, and routed to node
/// `stream-evaluation-failure-fixed-detail`. Identified by both of these: the predicate's typed
/// class, integer arithmetic (this fixture's own integer-typed operands, `i64` and `id`, and any
/// integer literal, joined by `+`, `-` or `*`), and a terminal text containing `Overflow`. Removed
/// when node `stream-evaluation-failure-fixed-detail` lands.
fn is_declared_integer_arithmetic_overflow(predicate: &str, terminal_error: &str) -> bool {
    if !terminal_error.contains("Overflow") {
        return false;
    }
    ["i64", "id"].iter().any(|c| {
        [" + ", " - ", " * "]
            .iter()
            .any(|op| predicate.contains(&format!("{c}{op}")) || predicate.contains(&format!("{op}{c}")))
    })
}

#[test]
fn filter_admission_property_campaign() {
    let fx = fixture();
    let ds = Dataset::open(&fx.path).expect("open");
    let ds_fresh = Dataset::open(&fx.path).expect("second open");
    let conn = configured_connection().expect("oracle connection");
    let canary = canary_dir();
    let canary_s = canary.to_string_lossy().replace('\\', "/");
    let tokens = file_tokens();
    let [ex0, ey0, ex1, ey1] = fx.facts.extent;

    let mut tallies: BTreeMap<&'static str, Tally> = BTreeMap::new();
    let mut counterexamples: Vec<Counterexample> = Vec::new();
    let mut stream_error_samples: BTreeMap<String, String> = BTreeMap::new();
    let mut stream_error_leaks: Vec<(String, String)> = Vec::new();

    let generators: [(&'static str, u64, usize); 4] = [
        ("G1", G1_SEED, G1_CASES),
        ("G2", G2_SEED, G2_CASES),
        ("G3", G3_SEED, G3_CASES),
        ("G4", G4_SEED, G4_CASES),
    ];

    for (gname, seed, cases) in generators {
        let mut r = Rng::new(seed);
        let tally = tallies.entry(gname).or_default();
        for case in 0..cases {
            let predicate = match gname {
                "G1" => {
                    let d = r.below(5);
                    gen_expr(&mut r, d)
                }
                "G2" => {
                    let t = *r.pick(HOSTILE);
                    let d = r.below(3);
                    let e = gen_expr(&mut r, d);
                    render(t, &e, &canary_s)
                }
                "G3" => {
                    let d = r.below(4);
                    let base = gen_expr(&mut r, d);
                    splice(&mut r, &base)
                }
                _ => gen_ceiling(&mut r),
            };
            // Per-case stream parameters, drawn unconditionally so the stream stays aligned.
            let fx0 = r.below(1000) as f64 / 1000.0;
            let fy0 = r.below(1000) as f64 / 1000.0;
            let fw = (r.below(700) + 50) as f64 / 1000.0;
            let fh = (r.below(700) + 50) as f64 / 1000.0;
            let limit = *r.pick(&[1u64, 2, 3, 7, 16, 50, 1000]);
            let proj: Vec<String> = PROJECTABLE
                .iter()
                .filter(|_| r.chance(30))
                .map(|s| s.to_string())
                .collect();

            tally.cases += 1;
            let mut fail = |property: &'static str, detail: String| {
                counterexamples.push(Counterexample {
                    generator: gname,
                    seed,
                    case,
                    property,
                    predicate: predicate.clone(),
                    detail,
                });
            };

            let o1 = admit(&ds, &predicate);
            let o2 = admit(&ds, &predicate);
            let o3 = admit(&ds_fresh, &predicate);
            // P2
            if o1 != o2 || o1 != o3 {
                fail("P2", format!("non-deterministic: {o1:?} / {o2:?} / {o3:?}"));
            }
            match &o1 {
                Outcome::Panicked(m) => fail("P1", format!("admission panicked: {m}")),
                Outcome::Refused(PredicateAdmitError::ConnectionsExhausted { class, capacity }) => fail(
                    "P1",
                    format!("refused without a filter code: connections exhausted ({class}, {capacity})"),
                ),
                Outcome::Refused(PredicateAdmitError::Filter(e)) => {
                    *tally.refused.entry(code_of(e)).or_default() += 1;
                    if predicate.len() > MAX_PREDICATE_BYTES && !matches!(e, FilterError::TooLong { .. }) {
                        fail("P1", format!("over-length predicate refused as {} not filter_too_long", code_of(e)));
                    }
                    // P4
                    let rendered = format!("{e}\n{e:?}");
                    let l = leaked(&tokens, &predicate, &rendered);
                    if !l.is_empty() {
                        fail("P4", format!("refusal carries file data {l:?}: {rendered}"));
                    }
                }
                Outcome::Admitted(text) => {
                    tally.admitted += 1;
                    if text != &predicate {
                        fail("P1", "admitted text was rewritten".to_string());
                    }
                    // P1(a) + P3 on the composed statement.
                    for v in check_composed(&conn, &predicate, &proj, limit) {
                        fail(if v.starts_with("P3") { "P3" } else { "P1" }, v);
                    }
                    // P1(b) on the real stream.
                    let view = Bbox {
                        xmin: ex0 + (ex1 - ex0) * fx0 * 0.9,
                        ymin: ey0 + (ey1 - ey0) * fy0 * 0.9,
                        xmax: ex0 + (ex1 - ex0) * (fx0 * 0.9 + fw),
                        ymax: ey0 + (ey1 - ey0) * (fy0 * 0.9 + fh),
                    };
                    let admitted = AdmittedPredicate::admit(predicate.clone(), &ds).expect("admitted above");
                    let sc = stream_check(&ds, fx, &conn, &admitted, view, limit, &proj);
                    tally.streamed += 1;
                    for v in sc.violations {
                        fail("P1", v);
                    }
                    if let Some(err) = sc.error {
                        tally.stream_errors += 1;
                        let l = leaked(&tokens, &predicate, &err);
                        if !l.is_empty() {
                            stream_error_leaks.push((predicate.clone(), err.clone()));
                            // section 2.10: "no stream error carries file data" -- no exclusion
                            // covers this; a leak is always a counterexample.
                            fail("P4", format!("admitted predicate's stream error carries file data {l:?}: {err}"));
                        }
                        stream_error_samples.entry(predicate.clone()).or_insert(err.clone());
                        // section 2.10: "asserts that no admitted predicate's stream ends in
                        // error", with the one declared exclusion (section 2.5(d)).
                        if !is_declared_integer_arithmetic_overflow(&predicate, &err) {
                            fail(
                                "P1",
                                format!("admitted predicate's stream ended in error outside section 2.5(d): {err}"),
                            );
                        }
                    }
                }
            }
        }
    }

    // P3, runtime half: nothing any hostile template named was created or fetched into the canary.
    let residue: Vec<String> = std::fs::read_dir(&canary)
        .expect("canary dir")
        .map(|e| e.unwrap().file_name().to_string_lossy().to_string())
        .collect();
    if !residue.is_empty() {
        counterexamples.push(Counterexample {
            generator: "all",
            seed: 0,
            case: 0,
            property: "P3",
            predicate: String::new(),
            detail: format!("canary directory not empty after the campaign: {residue:?}"),
        });
    }

    // Report.
    println!("== Wave 2 B filter-admission property campaign ==");
    println!("fixture: MultiType, {FIXTURE_FEATURES} features, seed {FIXTURE_SEED:#x}");
    for (gname, seed, _) in generators {
        let t = &tallies[gname];
        println!(
            "{gname} seed {seed:#x}: cases {} admitted {} streamed {} stream_errors {} refused {:?}",
            t.cases, t.admitted, t.streamed, t.stream_errors, t.refused
        );
    }
    println!(
        "stream errors on admitted predicates (distinct predicates): {}",
        stream_error_samples.len()
    );
    for (p, e) in stream_error_samples.iter().take(12) {
        println!("  stream error: predicate {p:?} -> {e}");
    }
    println!(
        "stream errors carrying file data: {}",
        stream_error_leaks.len()
    );
    for (p, e) in stream_error_leaks.iter().take(5) {
        println!("  leak: predicate {p:?} -> {e}");
    }

    // Minimise and print counterexamples, grouped by property.
    let mut by_prop: BTreeMap<&str, Vec<&Counterexample>> = BTreeMap::new();
    for c in &counterexamples {
        by_prop.entry(c.property).or_default().push(c);
    }
    for (prop, cs) in &by_prop {
        println!("COUNTEREXAMPLES {prop}: {}", cs.len());
        let mut seen = BTreeSet::new();
        for c in cs.iter().take(8) {
            if !seen.insert(c.detail.clone()) {
                continue;
            }
            println!(
                "  {} seed {:#x} case {}: {:?}\n    {}",
                c.generator, c.seed, c.case, c.predicate, c.detail
            );
        }
    }
    assert!(
        counterexamples.is_empty(),
        "{} counterexample(s); see the report above",
        counterexamples.len()
    );
}

// ---------------------------------------------------------------------------------------------
// B-1's reproducer (wave-2 finding), now asserting the fixed behaviour (F5).
// ---------------------------------------------------------------------------------------------

/// B-T4 (`FILTER-BIND-COERCIONS-PREREGISTRATION.md` section 4). Was: counterexample B-1, wave-2
/// finding, asserting only that nothing was admitted. Now (F5; the type walk lands): each of the
/// three predicates is refused `TypeNotAdmitted`, with the corpus's own reason for its row (C1,
/// C2 as amended by section 10 Amendment 3, C3) -- `zone = 1` and `flag = 'x'` for a text/non-text
/// mismatch, `i64 < 0.000000000000000000000000001` for a decimal literal beyond the declared
/// scale bound. Mutation: `AdmittedPredicate::admit` skips the type walk. It fails by name on this
/// test's own no-admission assertion below (each predicate would then admit).
#[test]
fn b1_an_implicit_coercion_is_admitted_and_fails_in_the_scan_carrying_file_data() {
    let fx = fixture();
    let ds = Dataset::open(&fx.path).expect("open");

    let cases: [(&str, TypeRefusalReason); 3] = [
        ("zone = 1", TypeRefusalReason::TextWithNonText),
        (
            "i64 < 0.000000000000000000000000001",
            TypeRefusalReason::LiteralOutOfBounds,
        ),
        ("flag = 'x'", TypeRefusalReason::TextWithNonText),
    ];

    for (p, expected_reason) in cases {
        match admit(&ds, p) {
            Outcome::Refused(PredicateAdmitError::Filter(FilterError::TypeNotAdmitted {
                reason,
                ..
            })) => {
                assert_eq!(
                    reason, expected_reason,
                    "{p:?}: expected reason {expected_reason:?}, got {reason:?}"
                );
            }
            other => panic!("{p:?}: expected a TypeNotAdmitted refusal, got {other:?}"),
        }
    }
}
