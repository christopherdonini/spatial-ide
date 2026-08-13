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
    ];
    for p in positive {
        AdmittedPredicate::admit(p, &ds).unwrap_or_else(|e| panic!("`{p}` should admit: {e}"));
    }
}
