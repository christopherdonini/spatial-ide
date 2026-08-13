// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `cut/sql-filter` phase P3 (`NEXT-CUT.md`, `CUT-STATE.md`): the adversarial corpus for
//! [`spatial_engine::AdmittedPredicate::admit`] — every row asserts a **specific** refusal code
//! (never a bare `is_err`), against a real, opened `Dataset`, so structural, namespace and bind
//! admission all actually run end to end.
//!
//! **The one dataset every row shares.** `AttributeMode::CategoricalZone` is the only attribute
//! column any fixture in this crate writes (`zone`, `Utf8`, `fixture::ZONE_VALUES`) — the same
//! constraint `engine/tests/filter_composition.rs` (P2) already works within. Two of the brief's
//! own illustrative predicates (`name LIKE 'A%'`, `value IS NOT NULL`) name columns this fixture
//! does not have; they are adapted to `zone` below, disclosed here rather than silently invented,
//! because what the corpus is actually proving is that the **construct** (`LIKE`, `IS NOT NULL`)
//! is admitted — not that a column named `name` or `value` exists.

use spatial_engine::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec};
use spatial_engine::{AdmittedPredicate, Dataset, FilterError, MAX_PREDICATE_BYTES, MAX_PREDICATE_DEPTH};

fn dataset() -> Dataset {
    let spec = FixtureSpec {
        features: 200,
        attributes: AttributeMode::CategoricalZone,
        crs_mode: CrsMode::DeclaredLv95,
        ..Default::default()
    };
    let dir = std::env::temp_dir().join("spatial-engine-predicate-admission-tests");
    std::fs::create_dir_all(&dir).unwrap();
    let path = dir.join("zoned.parquet");
    write_geoparquet(&path, &spec).expect("fixture");
    Dataset::open(&path).expect("open")
}

/// One adversarial-corpus row: a predicate text and a check against the *specific* refusal it must
/// produce (never a bare `is_err`).
struct Refusal {
    label: &'static str,
    predicate: String,
    check: fn(&FilterError) -> Option<String>,
}

macro_rules! refusal {
    ($label:expr, $predicate:expr, $pat:pat if $cond:expr, $desc:expr) => {
        Refusal {
            label: $label,
            predicate: $predicate.to_string(),
            check: |e: &FilterError| match e {
                $pat if $cond => None,
                other => Some(format!("expected {}, got {other:?}", $desc)),
            },
        }
    };
    ($label:expr, $predicate:expr, $pat:pat, $desc:expr) => {
        Refusal {
            label: $label,
            predicate: $predicate.to_string(),
            check: |e: &FilterError| match e {
                $pat => None,
                other => Some(format!("expected {}, got {other:?}", $desc)),
            },
        }
    };
}

#[test]
fn the_adversarial_corpus_each_row_refused_with_its_specific_code() {
    let ds = dataset();
    let geometry_column = ds.geometry_column().to_string();

    let long_predicate = format!("zone = '{}'", "a".repeat(MAX_PREDICATE_BYTES));
    let depth = MAX_PREDICATE_DEPTH + 8;
    // The body must be a bare column reference, **not** a comparison: DuckDB's own parser folds
    // `NOT (a = b)` into the negated comparison (`a <> b`) at *parse* time, all the way down, so a
    // `NOT`-chain wrapping a `COMPARISON` collapses to zero `OPERATOR_NOT` nodes at *any* depth —
    // measured while building this corpus (`CUT-STATE.md`), and why this bomb wraps a bare `zone`
    // reference instead.
    let deep_predicate = format!("{}zone{}", "NOT (".repeat(depth), ")".repeat(depth));

    let rows: Vec<Refusal> = vec![
        refusal!(
            "statement-separator breakout",
            "1=1; DROP TABLE x",
            FilterError::Unparsable { .. },
            "Unparsable"
        ),
        refusal!(
            "trailing line comment eats the wrapper's own closing paren",
            "1=1 --",
            FilterError::Unparsable { .. },
            "Unparsable"
        ),
        refusal!("bare block comment, nothing else", "/* */", FilterError::Unparsable { .. }, "Unparsable"),
        refusal!(
            "scalar subquery",
            "(SELECT 1)",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("subquery"),
            "ConstructNotAdmitted naming a subquery"
        ),
        refusal!(
            "table function reached as a scalar call",
            "read_csv('c:/x')",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("read_csv"),
            "ConstructNotAdmitted naming read_csv"
        ),
        refusal!(
            "IN subquery",
            "zone IN (SELECT 1)",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("subquery"),
            "ConstructNotAdmitted naming a subquery"
        ),
        refusal!(
            "bind parameter placeholder",
            "zone = ?",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("bind parameter"),
            "ConstructNotAdmitted naming a bind parameter"
        ),
        refusal!(
            "CAST",
            "CAST(zone AS INT) = 1",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("CAST"),
            "ConstructNotAdmitted naming CAST"
        ),
        refusal!(
            "non-arithmetic, non-pattern function call",
            "random() < 0.5",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("random"),
            "ConstructNotAdmitted naming random"
        ),
        refusal!(
            "unknown column",
            "nonexistent_column_xyz = 1",
            FilterError::UnknownColumn { column } if column == "nonexistent_column_xyz",
            "UnknownColumn"
        ),
        refusal!(
            "non-boolean arithmetic expression",
            "1 + 1",
            FilterError::NotBoolean { .. },
            "NotBoolean"
        ),
        refusal!(
            "over-length predicate",
            &long_predicate,
            FilterError::TooLong { .. },
            "TooLong"
        ),
        refusal!(
            "paren/NOT-chain depth bomb",
            &deep_predicate,
            FilterError::TooDeep { .. },
            "TooDeep"
        ),
        // Two extra rows beyond the brief's literal list, added because building the walker
        // surfaced a real bypass risk worth a standing regression test (`CUT-STATE.md` records the
        // JSON that motivated these): a predicate that closes the wrapper's own paren early and
        // appends a second clause to the *same* top-level SELECT.
        refusal!(
            "GROUP BY/HAVING breakout past an innocuous where_clause",
            "1=1) GROUP BY 1 HAVING count(*) > 0 --",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("GROUP BY"),
            "ConstructNotAdmitted naming GROUP BY"
        ),
        refusal!(
            "UNION breakout",
            "1=1) UNION SELECT 1 --",
            FilterError::ConstructNotAdmitted { .. },
            "ConstructNotAdmitted"
        ),
        // Reviewer gate over P1–P4: a BLOCKING, demonstrated escape — admission's old wrapper
        // (`SELECT 1 WHERE (<text>)`) added exactly one paren pair, and real composition
        // (`stream.rs::build_sql`) also adds exactly one paren pair (`(<text>) AND <bbox>`), but
        // the two shapes were not the *same* shape: nothing after admission's own closing paren
        // mirrored the `AND <bbox>` that always follows once a predicate reaches composition. A
        // predicate whose own text closes that paren early admitted fine here and then
        // re-associated after composition — demonstrated live: `zone = 'residential') OR (1=1`
        // composed to `WHERE (zone='residential') OR (1=1) AND <bbox>`, and since `AND` binds
        // tighter than `OR`, the bbox condition was bypassed entirely (a 1-row viewport returned
        // 77 rows); `1=1) --` composed with the comment eating the real `AND <bbox> ... LIMIT n`
        // suffix, dropping the caller's own ceiling (400 rows instead of 3). Fixed by making the
        // wrapper mirror composition's *shape*, not just its paren count (`wrap`'s own doc); these
        // four rows are the standing regression, both escape classes (re-association via a
        // top-level `OR`, and comment-eats-tail) plus the reviewer's own `1=1) OR (1=1` variant.
        refusal!(
            "ESCAPE (re-association): predicate closes admission's paren early, reassociates as OR",
            "zone = 'residential') OR (1=1",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("AND-sentinel"),
            "ConstructNotAdmitted naming the AND-sentinel mismatch"
        ),
        refusal!(
            "ESCAPE (comment-eats-tail): trailing comment consumes the AND-sentinel entirely",
            "1=1) --",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("AND-sentinel"),
            "ConstructNotAdmitted naming the AND-sentinel mismatch"
        ),
        refusal!(
            "ESCAPE (statement-separator + comment): same class as above, semicolon variant",
            "1=1) ;--",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("AND-sentinel"),
            "ConstructNotAdmitted naming the AND-sentinel mismatch"
        ),
        refusal!(
            "ESCAPE (re-association, reviewer's own variant): bare 1=1 OR 1=1 breakout",
            "1=1) OR (1=1",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("AND-sentinel"),
            "ConstructNotAdmitted naming the AND-sentinel mismatch"
        ),
        // FINAL B1 attempt (rule 7): the single-sentinel fix above was itself re-review-demonstrated
        // escapable — `1=1) AND 1=1 --` and `1=1) AND 1=1 ;--` FORGE the sentinel by writing their
        // own trailing `1=1`, then use a same-line comment to eat the wrapper's real, appended
        // `) AND 1=1` — identically in admission and in composition. `is_sentinel_comparison` could
        // not tell the forged `1=1` from the real one, so "last child is a 1=1 comparison" passed on
        // the forgery. Fixed by the differential two-sentinel probe (`differential_operands`):
        // parsed once with a `1=1` sentinel and once with `2=2`, requiring both to end in their own
        // distinct, correct sentinel and otherwise agree exactly — no single predicate text can end
        // in `1=1` for one parse and `2=2` for the other at the same textual position. These five
        // rows are that fix's own standing regression, empirically confirmed (`target/slice-
        // evidence/sql-filter/logs/p3-probe-differential.log`) before any test was written.
        refusal!(
            "ESCAPE (forged sentinel + line comment): the surviving escape from the reviewer's final gate",
            "1=1) AND 1=1 --",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("AND-sentinel"),
            "ConstructNotAdmitted naming the AND-sentinel mismatch"
        ),
        refusal!(
            "ESCAPE (forged sentinel + semicolon/comment): same class, semicolon variant",
            "1=1) AND 1=1 ;--",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("AND-sentinel"),
            "ConstructNotAdmitted naming the AND-sentinel mismatch"
        ),
        refusal!(
            "ESCAPE (forged sentinel + unterminated block comment): fails to parse outright",
            "1=1) AND 1=1 /*",
            FilterError::Unparsable { .. },
            "Unparsable (unterminated /* comment)"
        ),
        refusal!(
            "ESCAPE (forged sentinel + line comment, real column): same class over a real predicate",
            "zone='x') AND 1=1 --",
            FilterError::ConstructNotAdmitted { construct } if construct.contains("AND-sentinel"),
            "ConstructNotAdmitted naming the AND-sentinel mismatch"
        ),
        refusal!(
            "block-comment variant of the forged sentinel (terminated, leaves an unmatched paren)",
            "1=1) AND 1=1 /* x */",
            FilterError::Unparsable { .. },
            "Unparsable (the terminated comment leaves a dangling close-paren, refused at parse)"
        ),
    ];

    for row in &rows {
        match AdmittedPredicate::admit(row.predicate.clone(), &ds) {
            Ok(_) => panic!("[{}] predicate `{}` was admitted; expected a refusal", row.label, row.predicate),
            Err(e) => {
                if let Some(msg) = (row.check)(&e) {
                    panic!("[{}] predicate `{}`: {msg}", row.label, row.predicate);
                }
            }
        }
    }

    // The geometry column: a real column, structurally fine, refused only at namespace admission.
    let geom_predicate = format!("{geometry_column} IS NOT NULL");
    match AdmittedPredicate::admit(geom_predicate.clone(), &ds) {
        Err(FilterError::ColumnNotFilterable { column, .. }) => assert_eq!(column, geometry_column),
        other => panic!("geometry column reference: expected ColumnNotFilterable, got {other:?}"),
    }
}

#[test]
fn dollar_quoting_and_a_positive_control_both_admit() {
    let ds = dataset();
    // Structurally indistinguishable from a normal string literal (`CUT-STATE.md`'s documented
    // decision) — admitted, not refused, since `zone` is a real filterable column.
    AdmittedPredicate::admit("zone = $$residential$$", &ds).expect("dollar-quoted literal admits");
}

/// Should-fix 2 (reviewer gate): a stage-1/2 refusal releases its lease **healthy** — the
/// connection is reused, not discarded-and-recreated — because stage 1/2 only ever run
/// `json_serialize_sql` with the caller's text as bound data, never executed. A stage-3 refusal
/// keeps the original, more conservative discard, because stage 3 actually prepares and executes
/// a statement built from the predicate text.
#[test]
fn a_stage_one_or_two_refusal_releases_its_connection_healthy_but_a_stage_three_refusal_still_discards()
{
    let ds = dataset();
    let created_after_open = ds.connections().physical_connections_created();
    assert_eq!(created_after_open, 1, "Dataset::open leaves exactly one connection behind it");

    // A stage-1 refusal (a subquery — never reaches namespace or bind admission at all).
    match AdmittedPredicate::admit("(SELECT 1)", &ds) {
        Err(FilterError::ConstructNotAdmitted { .. }) => {}
        other => panic!("expected a stage-1 refusal, got {other:?}"),
    }
    assert_eq!(
        ds.connections().physical_connections_created(),
        created_after_open,
        "a stage-1 refusal must not have discarded (and so recreated) the connection"
    );
    assert_eq!(ds.connections().idle_connections(), 1, "the connection must be back in the pool");

    // A stage-2 refusal (an unknown column — structurally fine, only namespace admission refuses).
    match AdmittedPredicate::admit("nonexistent_column_xyz = 1", &ds) {
        Err(FilterError::UnknownColumn { .. }) => {}
        other => panic!("expected a stage-2 refusal, got {other:?}"),
    }
    assert_eq!(
        ds.connections().physical_connections_created(),
        created_after_open,
        "a stage-2 refusal must not have discarded the connection either"
    );

    // A stage-3 refusal (non-boolean arithmetic — structurally fine, namespace admits trivially
    // since no column is referenced, only the bind check against the surrogate refuses).
    match AdmittedPredicate::admit("1 + 1", &ds) {
        Err(FilterError::NotBoolean { .. }) => {}
        other => panic!("expected a stage-3 refusal, got {other:?}"),
    }
    // `physical_connections_created` is cumulative and only grows when `acquire` finds the pool
    // empty and has to open a fresh connection — discarding on `Drop` does not itself bump it, it
    // only empties the idle pool. So the discard shows up as `idle_connections() == 0` right away,
    // and as the counter incrementing on the *next* lease, which the final admitted call below is.
    assert_eq!(
        ds.connections().idle_connections(),
        0,
        "a stage-3 refusal must discard its connection rather than return it to the pool"
    );

    // One fully-admitted predicate: the pool is empty, so this must create a *new* physical
    // connection — proving the stage-3 refusal above really did discard the old one rather than
    // merely failing to release it.
    AdmittedPredicate::admit("zone = 'residential'", &ds).expect("a real predicate still admits");
    assert_eq!(
        ds.connections().physical_connections_created(),
        created_after_open + 1,
        "the stage-3 discard must have forced this next lease to create a fresh connection"
    );
}

#[test]
fn the_positive_controls_from_the_design_note_all_admit() {
    let ds = dataset();
    let positive = [
        "zone = 'residential'",
        "id BETWEEN 5 AND 10 AND zone IN ('a','b')",
        // Adapted from the brief's `name LIKE 'A%'` — this fixture's one attribute column is `zone`.
        "zone LIKE 'r%'",
        // Adapted from the brief's `value IS NOT NULL`.
        "zone IS NOT NULL",
        "zone ILIKE 'R%'",
        // Adapted from the brief's `NOT (x > 3 OR y < 2)` — `id` is a real, filterable, numeric
        // column (the native identity column); `x`/`y` are not columns this fixture has.
        "NOT (id > 3 OR id < 2)",
        // The differential probe's own converse case (final B1 fix): a predicate whose *own* text
        // legitimately ends in `1=1` must still admit, not be caught by the forged-sentinel refusal
        // above. Probe A flattens to `[id>3, caller's 1=1, sentinel 1=1]`, probe B to `[id>3,
        // caller's 1=1, sentinel 2=2]` — both end in the correct sentinel for their own probe, and
        // the preceding operands agree, so this is the check working as designed, not a coincidence.
        "id > 3 AND 1=1",
    ];
    for p in positive {
        AdmittedPredicate::admit(p, &ds).unwrap_or_else(|e| panic!("`{p}` should admit: {e}"));
    }
}
