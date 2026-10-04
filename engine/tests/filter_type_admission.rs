// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! B-1's own corpus (`FILTER-BIND-COERCIONS-PREREGISTRATION.md` sections 3 and 4: B-T1, B-T2,
//! B-T3), over FX-1 (`AttributeMode::FilterWitness`).
//!
//! B-T1's own oracle is independent of `engine::predicate`'s private implementation, on the same
//! precedent `admission_property_campaign.rs`'s `code_of` already sets: this file re-derives the
//! declared cast set (section 7) and the declared arithmetic-promotion table from the governing
//! text, and checks the product's real behaviour (`AdmittedPredicate::admit`, the real stream)
//! against that independent oracle and against DuckDB's own `json_serialize_plan` (a second oracle,
//! independent of the product's own decision).

use std::path::PathBuf;
use std::sync::OnceLock;

use arrow::array::{Array, UInt64Array};
use duckdb::Connection;
use serde_json::Value;
use sha2::{Digest, Sha256};

use spatial_engine::cancel::CancelToken;
use spatial_engine::fixture::{configured_connection, AttributeMode, CrsMode, FixtureSpec};
use spatial_engine::{
    AdmittedPredicate, Dataset, FilterError, PredicateAdmitError, TypeRefusalReason, ViewportQuery,
    ID_COLUMN,
};

const FIXTURE_SEED: u64 = 0x5EED_2056_0B03_0001;
/// FX-1's feature count (section 3): the longest declared witness list (`zone`, 13 entries) sets
/// the floor -- `id % len` then hits every entry of every shorter list at least once too.
const FX1_FEATURES: usize = 13;

fn sha256_hex(path: &std::path::Path) -> String {
    let bytes = std::fs::read(path).expect("read fixture for hashing");
    let mut hasher = Sha256::new();
    hasher.update(&bytes);
    hasher
        .finalize()
        .iter()
        .map(|b| format!("{b:02x}"))
        .collect()
}

/// FX-1, written once (the `predicate_admission.rs` / `live_projection.rs` `OnceLock` precedent).
/// Its sha256 is taken right after the write and checked equal at the end of each test that opens
/// it (section 3: "its sha256 is taken after the write and checked equal at the end of each run").
struct Fixture {
    path: PathBuf,
    sha256: String,
}

fn fixture() -> &'static Fixture {
    static FIXTURE: OnceLock<Fixture> = OnceLock::new();
    FIXTURE.get_or_init(|| {
        let spec = FixtureSpec {
            features: FX1_FEATURES,
            attributes: AttributeMode::FilterWitness,
            crs_mode: CrsMode::DeclaredLv95,
            seed: FIXTURE_SEED,
            ..Default::default()
        };
        let dir = std::env::temp_dir().join("spatial-engine-filter-type-admission");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("filter-witness.parquet");
        spatial_engine::fixture::write_geoparquet(&path, &spec).expect("fixture");
        let sha256 = sha256_hex(&path);
        Fixture { path, sha256 }
    })
}

/// Section 3's own end-of-run check: FX-1's bytes are unchanged since the write.
fn assert_fixture_unchanged(fx: &Fixture) {
    assert_eq!(
        sha256_hex(&fx.path),
        fx.sha256,
        "FX-1 changed since it was written"
    );
}

fn dataset() -> Dataset {
    Dataset::open(&fixture().path).expect("open FX-1")
}

/// Drain an admitted predicate's stream over the whole file (`ViewportQuery::all()`) into the set
/// of `id`s it delivered, or the terminal error text.
fn drain_ids(
    ds: &Dataset,
    predicate: &AdmittedPredicate,
) -> Result<std::collections::BTreeSet<u64>, String> {
    let query = ViewportQuery::all().with_filter(predicate.clone());
    let mut stream = ds
        .stream_with_cancel(&query, CancelToken::new())
        .map_err(|e| e.to_string())?;
    let mut ids = std::collections::BTreeSet::new();
    let mut buf = Vec::new();
    while let Some(info) = stream.next_into(&mut buf) {
        info.map_err(|e| e.to_string())?;
        let reader =
            arrow::ipc::reader::StreamReader::try_new(std::io::Cursor::new(&buf), None).unwrap();
        for batch in reader {
            let batch = batch.unwrap();
            let col = batch
                .column_by_name(ID_COLUMN)
                .unwrap()
                .as_any()
                .downcast_ref::<UInt64Array>()
                .unwrap();
            for r in 0..batch.num_rows() {
                ids.insert(col.value(r));
            }
        }
        buf.clear();
    }
    Ok(ids)
}

// -------------------------------------------------------------------------------------------
// B-T2
// -------------------------------------------------------------------------------------------

/// B-T2 (section 4). The row set of `f32 = 16777217` equals the ids whose stored `f32` is
/// `16777216f32`, is non-empty, and equals `f32 = 16777216`'s set. Mutation: rule 6 restricted to
/// decimal literals. It fails by name (refused TNA).
#[test]
fn a_float32_column_compared_with_16777217_matches_a_stored_16777216() {
    let fx = fixture();
    let ds = dataset();

    let expected: std::collections::BTreeSet<u64> = (0..FX1_FEATURES as u64)
        .filter(|&id| spatial_engine::fixture::filter_witness_f32(id) == 16_777_216.0f32)
        .collect();
    assert!(
        !expected.is_empty(),
        "FX-1 must carry the 16777216 witness, or this test proves nothing"
    );

    for text in ["f32 = 16777217", "f32 = 16777216"] {
        let admitted = AdmittedPredicate::admit(text, &ds)
            .unwrap_or_else(|e| panic!("{text}: expected admitted, got {e}"));
        let ids = drain_ids(&ds, &admitted)
            .unwrap_or_else(|e| panic!("{text}: expected the stream to succeed, got {e}"));
        assert_eq!(ids, expected, "`{text}` over FX-1's declared f32 witnesses");
    }

    assert_fixture_unchanged(fx);
}

// -------------------------------------------------------------------------------------------
// B-T3
// -------------------------------------------------------------------------------------------

#[derive(Debug, Clone, PartialEq)]
enum Predicted {
    Admitted,
    Tna {
        construct: Option<&'static str>,
        reason: TypeRefusalReason,
        operand_types: Option<&'static [&'static str]>,
    },
    Code(&'static str),
}

fn tna(reason: TypeRefusalReason) -> Predicted {
    Predicted::Tna {
        construct: None,
        reason,
        operand_types: None,
    }
}

fn tna_named(
    construct: &'static str,
    reason: TypeRefusalReason,
    operand_types: &'static [&'static str],
) -> Predicted {
    Predicted::Tna {
        construct: Some(construct),
        reason,
        operand_types: Some(operand_types),
    }
}

/// Section 3's corpus, as amended (section 10 Amendments 1 and 3). One row per predicate; a row
/// with several predicates in section 3's own table becomes several entries here, one per
/// predicate, all carrying that row's own label for the report. Rows C39 to C51 are
/// `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`'s section 3 and its section 10
/// Amendments 1 and 2.
fn corpus() -> Vec<(&'static str, &'static str, Predicted)> {
    use Predicted::Admitted;
    use TypeRefusalReason::*;
    vec![
        (
            "C1",
            "zone = 1",
            tna_named("=", TextWithNonText, &["VARCHAR", "INTEGER literal"]),
        ),
        (
            "C2",
            "i64 < 0.000000000000000000000000001",
            tna(LiteralOutOfBounds),
        ),
        ("C3", "flag = 'x'", tna(TextWithNonText)),
        ("C4", "flag = 1", tna(BooleanConversion)),
        (
            "C5",
            "NOT i32",
            tna_named("NOT", BooleanConversion, &["INTEGER"]),
        ),
        (
            "C6",
            "i32 AND flag",
            tna_named("AND", BooleanConversion, &["INTEGER"]),
        ),
        ("C7", "i64 = 1e3", tna(ConversionRounds)),
        ("C8", "i32 = f32", tna(ConversionRounds)),
        ("C9", "i64 < f64", tna(ConversionRounds)),
        (
            "C10",
            "i64 + 0.5 > 0",
            tna_named("+", ConversionCanFail, &["BIGINT", "DECIMAL(2,1) literal"]),
        ),
        ("C11", "id < 'inf'", tna(TextWithNonText)),
        (
            "C12",
            "zone IN (1, 2)",
            tna_named("IN", TextWithNonText, &["VARCHAR", "INTEGER literal"]),
        ),
        ("C13", "u64 = 18446744073709551615", Admitted),
        ("C13", "u64 = 18446744073709551616", Admitted),
        ("C13", "u64 = 99999999999999999999", Admitted),
        ("C13", "i64 = -18446744073709551615", Admitted),
        ("C13", "i64 = -18446744073709551616", Admitted),
        ("C13", "i64 = -99999999999999999999", Admitted),
        (
            "C14",
            "i64 = 100000000000000000000",
            tna(LiteralOutOfBounds),
        ),
        (
            "C14",
            "i64 = -100000000000000000000",
            tna(LiteralOutOfBounds),
        ),
        ("C15", "u64 > 0.000000000000000001", Admitted),
        (
            "C15",
            "u64 > 0.0000000000000000001",
            tna(LiteralOutOfBounds),
        ),
        ("C16", "f32 = 16777217", Admitted),
        ("C16", "f32 = 0.1", Admitted),
        ("C16", "f32 = 1e3", Admitted),
        ("C17", "i64 / f64 > 1", Admitted),
        ("C17", "i64 / 3 > 1", Admitted),
        ("C18", "u8 + 1 > 0", Admitted),
        ("C18", "i16 + f32 > 0", Admitted),
        ("C19", "i32 + f32 > 0", tna(ConversionRounds)),
        ("C20", "i32 / f32 > 0", Admitted),
        ("C21", "i64 IN (9223372036854775808, 0.5)", Admitted),
        (
            "C22",
            "i64 IN (170141183460469231731687303715884105727, 0.5)",
            tna(LiteralOutOfBounds),
        ),
        (
            "C23",
            "i64 IN (123456789012345678901.5, 0.000000000000000001)",
            tna(LiteralOutOfBounds),
        ),
        (
            "C24",
            "f64 = 100000000000000000000",
            tna(LiteralOutOfBounds),
        ),
        (
            "C25",
            "zone < 1",
            Predicted::Code("skp.filter_rejected_by_binder"),
        ),
        (
            "C25",
            "zone LIKE 1",
            Predicted::Code("skp.filter_rejected_by_binder"),
        ),
        (
            "C25",
            "u64 + 9223372036854775808 > 0",
            Predicted::Code("skp.filter_rejected_by_binder"),
        ),
        ("C26", "i32", Predicted::Code("skp.filter_not_boolean")),
        ("C26", "flag", Admitted),
        (
            "C27",
            "flag = TRUE",
            Predicted::Code("skp.filter_construct_not_admitted"),
        ),
        (
            "C27",
            "CAST(zone AS INT) = 1",
            Predicted::Code("skp.filter_construct_not_admitted"),
        ),
        ("C28", "zone = x'41'", Admitted),
        ("C28", "zone = $$x$$", Admitted),
        ("C28", "zone = NULL", Admitted),
        ("C28", "zone LIKE 'c%'", Admitted),
        // section 10 Amendment 4, post-result (gate attempt 2's findings).
        (
            "C29",
            "u64 * i64 < 0.5",
            tna_named(
                "<",
                ConversionCanFail,
                &["HUGEINT expression", "DECIMAL(2,1) literal"],
            ),
        ),
        (
            "C30",
            "u64 * -9223372036854775808 < 0.5",
            tna(ConversionCanFail),
        ),
        ("C31", "f32 * f32 > 0", Admitted),
        ("C31", "f64 + f64 > 0", Admitted),
        ("C32", "i32 + NULL > 0", Admitted),
        ("C32", "-NULL > 0", Admitted),
        ("C33", "(f32 + 1e3) = i32", Admitted),
        ("C34", "(i32 > 0) = flag", Admitted),
        ("C34", "(i32 > 0) IS NOT NULL", Admitted),
        ("C34", "flag = (zone LIKE 'c%')", Admitted),
        (
            "C35",
            "i16 BETWEEN f32 AND i64",
            tna_named("BETWEEN", ConversionRounds, &["REAL", "BIGINT"]),
        ),
        (
            "C36",
            "i32 BETWEEN i64 AND f64",
            tna_named("BETWEEN", ConversionRounds, &["BIGINT", "DOUBLE"]),
        ),
        ("C37", "i64 BETWEEN u64 AND 0.5", Admitted),
        ("C37", "i64 BETWEEN u64 AND 0.000000000000000001", Admitted),
        ("C38", "i16 BETWEEN i32 AND f64", Admitted),
        // `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` section 3, rows C39 to
        // C47 (C47 is O-2, ruled yes by question round 45, item 1).
        ("C39", "NULL + NULL > 0", Admitted),
        ("C40", "NULL - 0.5 > 0", Admitted),
        (
            "C41",
            "i64 < NULL + 0.000000000000000000000000001",
            Predicted::Tna {
                construct: Some("<"),
                reason: LiteralOutOfBounds,
                operand_types: None,
            },
        ),
        (
            "C42",
            "i64 = (NULL + 170141183460469231731687303715884105728)",
            tna_named("=", LiteralOutOfBounds, &["BIGINT", "UHUGEINT expression"]),
        ),
        ("C43", "i64 < -0.5", Admitted),
        ("C44", "i64 > NULL - 0.5", Admitted),
        ("C44", "(NULL - 0.5) = 0.25", Admitted),
        ("C44", "f32 > NULL - 0.5", Admitted),
        ("C44", "1e3 > NULL - 0.5", Admitted),
        ("C44", "i64 BETWEEN NULL - 0.5 AND 1", Admitted),
        (
            "C45",
            "(NULL - 0.5) < (u64 * i64)",
            tna_named(
                "<",
                ConversionCanFail,
                &["DECIMAL(2,1) expression", "HUGEINT expression"],
            ),
        ),
        (
            "C45",
            "zone = NULL - 0.5",
            tna_named(
                "=",
                TextWithNonText,
                &["VARCHAR", "DECIMAL(2,1) expression"],
            ),
        ),
        (
            "C46",
            "NULL = 170141183460469231731687303715884105728",
            Admitted,
        ),
        ("C47", "-(NULL - 0.5) > 0", Admitted),
        ("C47", "NULL + (NULL - 0.5) > 0", Admitted),
        // section 10 Amendment 1, rows C48 to C50 (section 2.1 as replaced: NULL beside NULL is a
        // BIGINT expression, as P-0 observed at DuckDB v1.5.5).
        (
            "C48",
            "zone = NULL + NULL",
            tna_named("=", TextWithNonText, &["VARCHAR", "BIGINT expression"]),
        ),
        (
            "C48",
            "flag = NULL + NULL",
            tna_named("=", BooleanConversion, &["BOOLEAN", "BIGINT expression"]),
        ),
        (
            "C48",
            "zone = NULL - NULL",
            tna_named("=", TextWithNonText, &["VARCHAR", "BIGINT expression"]),
        ),
        (
            "C48",
            "zone IS DISTINCT FROM NULL + NULL",
            tna_named(
                "IS DISTINCT FROM",
                TextWithNonText,
                &["VARCHAR", "BIGINT expression"],
            ),
        ),
        // H-4's class-2 result, observed at DuckDB v1.5.5 at commit 8efcde98: the surrogate prepare refuses
        // this shape (`Cannot mix values of type VARCHAR and BIGINT in BETWEEN clause`) before
        // the type walk is reached, where the form's table predicted a `TypeNotAdmitted` of
        // `BETWEEN` and `text_with_non_text`.
        (
            "C48",
            "zone BETWEEN NULL * NULL AND NULL",
            Predicted::Code("skp.filter_rejected_by_binder"),
        ),
        (
            "C49",
            "flag AND NULL + NULL",
            tna_named("AND", BooleanConversion, &["BIGINT expression"]),
        ),
        ("C50", "i64 BETWEEN NULL + NULL AND 1", Admitted),
        ("C50", "u8 = NULL * NULL", Admitted),
        // section 10 Amendment 2, row C51 (section 2.9: unary `-` over a NULL literal is a BIGINT
        // expression, question round 49, item 1).
        (
            "C51",
            "zone = -NULL",
            tna_named("=", TextWithNonText, &["VARCHAR", "BIGINT expression"]),
        ),
        (
            "C51",
            "flag = -NULL",
            tna_named("=", BooleanConversion, &["BOOLEAN", "BIGINT expression"]),
        ),
        (
            "C51",
            "zone IS DISTINCT FROM -NULL",
            tna_named(
                "IS DISTINCT FROM",
                TextWithNonText,
                &["VARCHAR", "BIGINT expression"],
            ),
        ),
        (
            "C51",
            "flag AND -NULL",
            tna_named("AND", BooleanConversion, &["BIGINT expression"]),
        ),
    ]
}

/// B-T3 (section 4, as amended by section 10 Amendment 4). Section 3's table, cell by cell. C25
/// also asserts `RejectedByBinder` with Display's prefix unchanged, and C27 asserts that
/// `construct` names CAST. Mutation: `MAX_INTEGER_LITERAL_DIGITS` = 21. It fails by name on C14.
/// Rows C39 to C51 are `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md`'s section 3
/// and its section 10 Amendments 1 and 2; its section 4 and those amendments name mutations M1 to
/// M7 for them.
#[test]
fn each_corpus_row_is_admitted_or_refused_with_its_code_reason_and_operand_types() {
    let fx = fixture();
    let ds = dataset();

    for (row, predicate, predicted) in corpus() {
        let outcome = AdmittedPredicate::admit(predicate, &ds);
        match (&predicted, outcome) {
            (Predicted::Admitted, Ok(_)) => {}
            (Predicted::Admitted, Err(e)) => {
                panic!("{row} ({predicate:?}): expected admitted, got refused: {e}")
            }
            (
                Predicted::Tna {
                    construct,
                    reason,
                    operand_types,
                },
                Err(PredicateAdmitError::Filter(FilterError::TypeNotAdmitted {
                    construct: c,
                    operand_types: ot,
                    reason: r,
                })),
            ) => {
                assert_eq!(&r, reason, "{row} ({predicate:?}): reason");
                if let Some(expected_construct) = construct {
                    assert_eq!(&c, expected_construct, "{row} ({predicate:?}): construct");
                }
                if let Some(expected_types) = operand_types {
                    assert_eq!(
                        ot,
                        expected_types.to_vec(),
                        "{row} ({predicate:?}): operand_types"
                    );
                }
            }
            (Predicted::Tna { .. }, other) => {
                panic!("{row} ({predicate:?}): expected TypeNotAdmitted, got {other:?}")
            }
            (Predicted::Code(code), Err(e)) => {
                let actual = match &e {
                    PredicateAdmitError::Filter(fe) => campaign_code_of(fe),
                    PredicateAdmitError::ConnectionsExhausted { .. } => {
                        "engine.connections_exhausted"
                    }
                };
                assert_eq!(actual, *code, "{row} ({predicate:?}): code");
                // Amendment 4, section 4 B-T3: C25 also asserts `RejectedByBinder` with Display's
                // prefix unchanged (section 5's declared-unchanged list).
                if row == "C25" {
                    match &e {
                        PredicateAdmitError::Filter(FilterError::RejectedByBinder { .. }) => {}
                        other => panic!(
                            "{row} ({predicate:?}): expected RejectedByBinder, got {other:?}"
                        ),
                    }
                    assert!(
                        e.to_string()
                            .starts_with("refused: DuckDB's binder rejected the predicate ("),
                        "{row} ({predicate:?}): Display's prefix changed: {e}"
                    );
                }
                // Amendment 4, section 4 B-T3: C27 asserts that `construct` names CAST.
                if row == "C27" {
                    match &e {
                        PredicateAdmitError::Filter(FilterError::ConstructNotAdmitted {
                            construct,
                        }) => {
                            assert!(
                                construct.contains("CAST"),
                                "{row} ({predicate:?}): construct should name CAST, got {construct:?}"
                            );
                        }
                        other => panic!(
                            "{row} ({predicate:?}): expected ConstructNotAdmitted naming CAST, got {other:?}"
                        ),
                    }
                }
            }
            (Predicted::Code(code), Ok(_)) => {
                panic!("{row} ({predicate:?}): expected refused {code}, got admitted")
            }
        }
    }

    assert_fixture_unchanged(fx);
}

/// The named `skp.filter_*` code a refusal maps to (SKP-V0 section 7.5) -- the same independent,
/// exhaustive, no-wildcard mapping `admission_property_campaign.rs`'s own `code_of` keeps, kept
/// separately here so B-T3 does not depend on that file.
fn campaign_code_of(e: &FilterError) -> &'static str {
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

// -------------------------------------------------------------------------------------------
// B-T1 -- the type walk agrees with the binder over the P0 matrix
// -------------------------------------------------------------------------------------------

/// FX-1's twelve attribute columns, DuckDB type name included -- `state/drafts/b1-p0/probe.rs.txt`'s
/// own `COLS` list, byte for byte (the fixture schema is the same set, by design).
const COLS: &[(&str, &str)] = &[
    ("zone", "VARCHAR"),
    ("flag", "BOOLEAN"),
    ("i8", "TINYINT"),
    ("i16", "SMALLINT"),
    ("i32", "INTEGER"),
    ("i64", "BIGINT"),
    ("u8", "UTINYINT"),
    ("u16", "USMALLINT"),
    ("u32", "UINTEGER"),
    ("u64", "UBIGINT"),
    ("f32", "FLOAT"),
    ("f64", "DOUBLE"),
];

/// The probe's literal set (`state/drafts/b1-p0/probe.rs.txt`'s `LITS`), less `u_str` (mangled in
/// the original run; section 4 B-T1: "less the dropped u_str row") and `n_str` (parses as `CAST`,
/// refused at stage 1 -- outside the type walk's own reach, exactly like the family form
/// `cmp = TRUE` dropped from `FAMILY` below). Removing both here, rather than filtering generated
/// cases after the fact, reaches section 4's declared count (7,620) directly.
const LITS: &[(&str, &str)] = &[
    ("int", "1"),
    ("int_neg", "-1"),
    ("int_300", "300"),
    ("int_big", "3000000000"),
    ("int_huge", "9223372036854775808"),
    ("int_uhuge", "170141183460469231731687303715884105728"),
    ("dec_s1", "1.5"),
    ("dec_s9", "0.000000001"),
    ("dec_s18", "0.000000000000000001"),
    ("dec_s19", "0.0000000000000000001"),
    ("dec_s20", "0.00000000000000000001"),
    ("dec_s27", "0.000000000000000000000000001"),
    ("dec_s28", "0.0000000000000000000000000001"),
    ("dec_s29", "0.00000000000000000000000000001"),
    ("dec_s34", "0.0000000000000000000000000000000001"),
    ("dec_s36", "0.000000000000000000000000000000000001"),
    ("dec_0_1", "0.1"),
    ("dec_2p53", "9007199254740993.0"),
    ("dbl", "1e3"),
    ("dbl_long", "1.00000000000000000000000000000000000001"),
    ("str_x", "'x'"),
    ("str_5", "'5'"),
    ("str_true", "'true'"),
    ("null", "NULL"),
    ("x_hex", "x'41'"),
    ("b_bits", "B'01'"),
    ("e_str", "e'x'"),
    ("dollar", "$$x$$"),
    ("dec_neg", "-1.5"),
    ("dbl_neg", "-1e3"),
];

/// The probe's per-column family forms (`probe.rs.txt`'s own inline list), less `cmp = TRUE`
/// (parses as `CAST`, refused at stage 1 -- see `LITS`'s own doc).
const FAMILY: &[&str] = &[
    "like",
    "ilike",
    "like int pattern",
    "is null",
    "is not null",
    "not",
    "and flag",
    "flag or",
    "bare",
    "unary minus then > 0",
    "arith + 1 = 0",
    "arith * 2 = 0",
    "arith / 0 = 0",
    "arith self * then > 0",
    "in mixed (1, 'x')",
    "in mixed (1, 1.5)",
    "between mixed 1 AND 1.5",
];

fn family_predicate(fam: &str, c: &str) -> String {
    match fam {
        "like" => format!("{c} LIKE 'x%'"),
        "ilike" => format!("{c} ILIKE 'x%'"),
        "like int pattern" => format!("{c} LIKE 1"),
        "is null" => format!("{c} IS NULL"),
        "is not null" => format!("{c} IS NOT NULL"),
        "not" => format!("NOT {c}"),
        "and flag" => format!("{c} AND flag"),
        "flag or" => format!("flag OR {c}"),
        "bare" => c.to_string(),
        "unary minus then > 0" => format!("-{c} > 0"),
        "arith + 1 = 0" => format!("{c} + 1 = 0"),
        "arith * 2 = 0" => format!("{c} * 2 = 0"),
        "arith / 0 = 0" => format!("{c} / 0 = 0"),
        "arith self * then > 0" => format!("{c} * {c} > 0"),
        "in mixed (1, 'x')" => format!("{c} IN (1, 'x')"),
        "in mixed (1, 1.5)" => format!("{c} IN (1, 1.5)"),
        "between mixed 1 AND 1.5" => format!("{c} BETWEEN 1 AND 1.5"),
        other => unreachable!("{other}"),
    }
}

/// One generated case. `arith_op` is set for every case built from `+`, `-`, `*` or unary `-`
/// (whatever the other operand is) -- section 2.5(d)'s declared campaign exclusion (overflow in
/// admitted integer arithmetic) is checked against it for check (iii). Section 10 Amendment 4
/// moves check (ii) (the walk's arithmetic result type equals the plan's `return_type`) to a new
/// unit test in `engine/src/predicate.rs`'s `mod tests`, `the_walk_types_every_arithmetic_node_as_
/// the_binder_does` (B-T1b) -- this struct no longer carries an `ArithNode` for it.
struct Case {
    label: String,
    predicate: String,
    arith_op: Option<&'static str>,
}

/// The probe's own case set (`probe.rs.txt`'s `cases` construction), less `u_str`/`n_str`/
/// `cmp = TRUE` (see `LITS`/`FAMILY`'s own docs) -- 7,620 cases exactly (section 4 B-T1;
/// `state/drafts/b1-p0/analysis/counts.txt`).
fn generate_cases() -> Vec<Case> {
    const CMP: &[&str] = &[
        "=",
        "<>",
        "<",
        "<=",
        ">",
        ">=",
        "IS DISTINCT FROM",
        "IS NOT DISTINCT FROM",
    ];

    let mut operands: Vec<(String, String)> = LITS
        .iter()
        .map(|(l, t)| (format!("lit:{l}"), t.to_string()))
        .collect();
    for (n, t) in COLS {
        operands.push((format!("col:{t}"), n.to_string()));
    }

    let mut cases = Vec::new();
    for (c, _cty) in COLS {
        for (olabel, o) in &operands {
            for op in CMP {
                cases.push(Case {
                    label: format!("cmp {op} {c} {olabel}"),
                    predicate: format!("{c} {op} {o}"),
                    arith_op: None,
                });
            }
            cases.push(Case {
                label: format!("cmp = reversed {c} {olabel}"),
                predicate: format!("{o} = {c}"),
                arith_op: None,
            });
            cases.push(Case {
                label: format!("between {c} {olabel}"),
                predicate: format!("{c} BETWEEN {o} AND {o}"),
                arith_op: None,
            });
            if olabel.starts_with("lit:") {
                cases.push(Case {
                    label: format!("in {c} {olabel}"),
                    predicate: format!("{c} IN ({o}, {o})"),
                    arith_op: None,
                });
            }
            for (fam, op) in [
                ("arith + then > 0", "+"),
                ("arith * then > 0", "*"),
                ("arith - then > 0", "-"),
                ("arith / then > 0", "/"),
            ] {
                cases.push(Case {
                    label: format!("{fam} {c} {olabel}"),
                    predicate: format!("{c} {op} {o} > 0"),
                    arith_op: Some(op),
                });
            }
        }
        for fam in FAMILY {
            let arith_op = match *fam {
                "unary minus then > 0" => Some("-"),
                "arith + 1 = 0" => Some("+"),
                "arith * 2 = 0" | "arith self * then > 0" => Some("*"),
                "arith / 0 = 0" => Some("/"),
                _ => None,
            };
            cases.push(Case {
                label: format!("{fam} {c}"),
                predicate: family_predicate(fam, c),
                arith_op,
            });
        }
    }
    cases
}

// ---- Oracle 1: DuckDB's own `json_serialize_plan`, independent of the product's own decision ----

fn find_filter_exprs(v: &Value, out: &mut Vec<Value>) {
    match v {
        Value::Object(m) => {
            if m.get("type").and_then(Value::as_str) == Some("LOGICAL_FILTER") {
                if let Some(e) = m.get("expressions") {
                    out.push(e.clone());
                }
            }
            for (_, x) in m {
                find_filter_exprs(x, out);
            }
        }
        Value::Array(a) => a.iter().for_each(|x| find_filter_exprs(x, out)),
        _ => {}
    }
}

fn type_str(t: &Value) -> String {
    let id = t
        .get("id")
        .and_then(Value::as_str)
        .unwrap_or("?")
        .to_string();
    if id == "DECIMAL" {
        let ti = &t["type_info"];
        format!("DECIMAL({},{})", ti["width"], ti["scale"])
    } else {
        id
    }
}

fn child_type(c: &Value) -> String {
    match c.get("expression_class").and_then(Value::as_str) {
        Some("BOUND_CONSTANT") => type_str(&c["value"]["type"]),
        _ => c
            .get("return_type")
            .map(type_str)
            .unwrap_or_else(|| "?".into()),
    }
}

fn child_kind(c: &Value) -> &'static str {
    match c.get("expression_class").and_then(Value::as_str) {
        Some("BOUND_CONSTANT") => "constant",
        _ => "column",
    }
}

struct Cast {
    kind: &'static str,
    from: String,
    to: String,
    in_division: bool,
}

/// Walk every `BOUND_CAST` under `v`, tagging each one with whether it sits among a `/` operator's
/// own operands (section 7's `/`-specific cast line is wider than the general rule).
fn walk_casts(v: &Value, in_division: bool, out: &mut Vec<Cast>) {
    match v {
        Value::Object(m) => {
            let class = m.get("expression_class").and_then(Value::as_str);
            if class == Some("BOUND_CAST") {
                let child = &m["child"];
                let from = child_type(child);
                let to = type_str(&m["return_type"]);
                if from != to {
                    out.push(Cast {
                        kind: child_kind(child),
                        from,
                        to,
                        in_division,
                    });
                }
                walk_casts(child, in_division, out);
                return;
            }
            if class == Some("BOUND_FUNCTION")
                && m.get("is_operator").and_then(Value::as_bool) == Some(true)
                && m.get("name").and_then(Value::as_str) == Some("/")
            {
                if let Some(children) = m.get("children").and_then(Value::as_array) {
                    for c in children {
                        walk_casts(c, true, out);
                    }
                }
                for (k, x) in m {
                    if k != "children" {
                        walk_casts(x, in_division, out);
                    }
                }
                return;
            }
            for (_, x) in m {
                walk_casts(x, in_division, out);
            }
        }
        Value::Array(a) => a.iter().for_each(|x| walk_casts(x, in_division, out)),
        _ => {}
    }
}

/// `json_serialize_plan` of `SELECT * FROM read_parquet('<FX-1>') WHERE (<pred>)` -- an oracle
/// wholly independent of `AdmittedPredicate::admit`'s own decision (it runs whether or not the
/// engine admitted `pred`; only admitted cases' plans are inspected by the caller).
fn plan_json(conn: &Connection, fx1_path: &str, pred: &str) -> Value {
    let sql = format!("SELECT * FROM read_parquet('{fx1_path}') WHERE ({pred})");
    let j: String = conn
        .query_row(
            "SELECT json_serialize_plan(CAST(? AS VARCHAR))",
            [sql.as_str()],
            |r| r.get(0),
        )
        .unwrap_or_else(|e| {
            panic!("json_serialize_plan could not even be called for {pred:?}: {e}")
        });
    serde_json::from_str(&j).unwrap_or_else(|e| panic!("{pred:?}: plan JSON did not parse: {e}"))
}

// ---- Oracle 2: the declared cast set (section 7), re-derived independently of `predicate.rs` ----

fn int_info(name: &str) -> Option<(u32, bool)> {
    match name {
        "TINYINT" => Some((8, true)),
        "SMALLINT" => Some((16, true)),
        "INTEGER" => Some((32, true)),
        "BIGINT" => Some((64, true)),
        "HUGEINT" => Some((128, true)),
        "UTINYINT" => Some((8, false)),
        "USMALLINT" => Some((16, false)),
        "UINTEGER" => Some((32, false)),
        "UBIGINT" => Some((64, false)),
        "UHUGEINT" => Some((128, false)),
        _ => None,
    }
}

fn is_numeric_name(name: &str) -> bool {
    int_info(name).is_some() || name.starts_with("DECIMAL(") || name == "FLOAT" || name == "DOUBLE"
}

fn decimal_width(name: &str) -> Option<u32> {
    name.strip_prefix("DECIMAL(")?
        .strip_suffix(')')?
        .split(',')
        .next()?
        .trim()
        .parse()
        .ok()
}

/// Section 7's declared cast set, re-derived from the governing text (independent of
/// `predicate.rs::type_of_arithmetic`/`is_admitted_comparison`'s own implementation): no cast to or
/// from BOOLEAN (except `NULL`), no cast from VARCHAR; integer to a wider integer of the *same*
/// signedness, an unsigned integer to a wider signed one, or any integer to `HUGEINT`
/// unconditionally; integer of at most 64 bits to `DECIMAL(w,s)` with
/// `w` at most 38; integer of at most 16 bits to `REAL`, of at most 32 bits to `DOUBLE`; `REAL` to
/// `DOUBLE`; as `/` operands, any integer to the division's float type; on literals, numeric to
/// numeric, `NULL` to any, VARCHAR to VARCHAR only. Corrected in round 2 (W2; architect B2) to
/// match section 7 exactly: `UHUGEINT` is reachable only via the general integer branch below (an
/// unsigned integer widening to it), never unconditionally the way `HUGEINT` is (section 7 says
/// "or HUGEINT", not "or a huge integer type"), and a `DECIMAL` target is declared only for a
/// **from** side of at most 64 bits.
fn is_declared_cast(kind: &str, from: &str, to: &str, in_division: bool) -> bool {
    if from == to {
        return true;
    }
    if from == "NULL" {
        return true;
    }
    if to == "BOOLEAN" || from == "BOOLEAN" {
        return false;
    }
    if from == "VARCHAR" {
        return false;
    }
    if kind == "constant" && is_numeric_name(from) && is_numeric_name(to) {
        return true;
    }
    if in_division {
        if let Some(_) = int_info(from) {
            if to == "FLOAT" || to == "DOUBLE" {
                return true;
            }
        }
    }
    if let Some((fb, fs)) = int_info(from) {
        if to == "HUGEINT" {
            return true;
        }
        if let Some((tb, ts)) = int_info(to) {
            if fs == ts && tb >= fb {
                return true;
            }
            if !fs && ts && tb > fb {
                return true;
            }
            return false;
        }
        if to.starts_with("DECIMAL(") {
            return fb <= 64 && decimal_width(to).unwrap_or(99) <= 38;
        }
        if to == "FLOAT" {
            return fb <= 16;
        }
        if to == "DOUBLE" {
            return fb <= 32;
        }
        return false;
    }
    if from == "FLOAT" && to == "DOUBLE" {
        return true;
    }
    false
}

/// Section 2.5(d)'s declared campaign exclusion: overflow in admitted integer arithmetic
/// (`+`, `-`, `*`, unary `-`). Every admission rule this piece implements only ever admits
/// `+`/`-`/`*` between two "Integer"-class operands or a float-involving pair (section 2.5(a)),
/// and float arithmetic never raises DuckDB's "Overflow" error text at v1.5.5 (correction round 2,
/// W11; architect B8) (IEEE 754 has no such trap) -- so an admitted case whose operator is one of
/// these four and whose stream error contains "Overflow" is, by construction, exactly section
/// 2.5(d)'s class, with no need to separately re-derive "both operands are integer" from the
/// case's own text. `/` is excluded by name: section 2.5(d) names only `+`, `-`, `*` and unary `-`.
fn is_declared_overflow(arith_op: Option<&str>, terminal_error: &str) -> bool {
    terminal_error.contains("Overflow") && matches!(arith_op, Some("+") | Some("-") | Some("*"))
}

/// section 10 Amendment 4's B-T1 enumeration part 2: discriminators.txt's N-ARY lists
/// (`state/drafts/b1-p0/discriminators.txt`, every `^N-ARY` row's own predicate, byte for byte),
/// 18 rows exactly.
const NARY_PREDICATES: &[&str] = &[
    "i64 IN (9223372036854775808, 0.5)",
    "i64 IN (3000000000, 0.5)",
    "i64 BETWEEN 0.5 AND 9223372036854775808",
    "i64 IN (1, 1.5, 3000000000)",
    "i64 IN (170141183460469231731687303715884105727, 1)",
    "i64 IN (170141183460469231731687303715884105727, 0.5)",
    "u64 IN (-1, 0.5)",
    "u64 IN (9223372036854775808, 0.000000000000000001)",
    "u64 IN (-1, 0.000000000000000001)",
    "u64 BETWEEN -1 AND 0.000000000000000001",
    "i32 IN (3000000000, 0.5)",
    "i8 IN (1, 0.000000000000000001)",
    "i64 IN (0.5, 0.000000000000000001)",
    "u64 IN (0.5, 0.000000000000000001, -1)",
    "i64 = 9223372036854775808",
    "i64 BETWEEN -9223372036854775809 AND 0.5",
    "f32 IN (1, 1.5)",
    "f64 IN (9223372036854775808, 0.5)",
];

fn nary_cases() -> Vec<Case> {
    NARY_PREDICATES
        .iter()
        .map(|p| Case {
            label: format!("N-ARY {p}"),
            predicate: p.to_string(),
            arith_op: None,
        })
        .collect()
}

/// The sightings' B-1 point 2 boundary literals and their negatives (`state/directives/
/// 2026-09-29-a2-1-and-b-1-sightings.md`): u64::MAX, u64::MAX+1 and the 20-nines admitted case, and
/// the 21-digit refused case.
const BOUNDARY_MAGNITUDES: &[&str] = &[
    "18446744073709551615",
    "18446744073709551616",
    "99999999999999999999",
    "100000000000000000000",
];

/// section 10 Amendment 4's B-T1 enumeration part 3: the sightings' point 2 boundary literals with
/// their negatives (8 literals total), bare against every integer column and in mixed `IN`/
/// `BETWEEN` lists with `0.5` and with a scale-18 literal -- 8 columns x 8 literals x 5 forms = 320
/// cases. It also carries the two Amendment 4 hypothesis pins whose own discriminator is named
/// "B-T1 (i)": C32's second case (`-NULL > 0`, no column at all) and C37 (an integer `BETWEEN` a
/// `UBIGINT` column bound and a decimal literal) -- 323 cases -- the nine admitted pins of
/// `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` section 3, its section 10
/// Amendment 1's nine pins (seven refused, C50's two admitted) and Amendment 2's five (all
/// refused) -- 346 cases in all.
fn boundary_literal_cases() -> Vec<Case> {
    let int_cols: Vec<&str> = COLS
        .iter()
        .filter(|(_, ty)| int_info(ty).is_some())
        .map(|(name, _)| *name)
        .collect();
    let mut literals: Vec<String> = Vec::new();
    for m in BOUNDARY_MAGNITUDES {
        literals.push((*m).to_string());
        literals.push(format!("-{m}"));
    }

    let mut cases = Vec::new();
    for c in &int_cols {
        for lit in &literals {
            cases.push(Case {
                label: format!("boundary bare {c} {lit}"),
                predicate: format!("{c} = {lit}"),
                arith_op: None,
            });
            cases.push(Case {
                label: format!("boundary in-0.5 {c} {lit}"),
                predicate: format!("{c} IN ({lit}, 0.5)"),
                arith_op: None,
            });
            cases.push(Case {
                label: format!("boundary in-scale18 {c} {lit}"),
                predicate: format!("{c} IN ({lit}, 0.000000000000000001)"),
                arith_op: None,
            });
            cases.push(Case {
                label: format!("boundary between-0.5 {c} {lit}"),
                predicate: format!("{c} BETWEEN {lit} AND 0.5"),
                arith_op: None,
            });
            cases.push(Case {
                label: format!("boundary between-scale18 {c} {lit}"),
                predicate: format!("{c} BETWEEN {lit} AND 0.000000000000000001"),
                arith_op: None,
            });
        }
    }
    cases.push(Case {
        label: "C32 second case: -NULL > 0".to_string(),
        predicate: "-NULL > 0".to_string(),
        arith_op: Some("-"),
    });
    cases.push(Case {
        label: "C37a: i64 BETWEEN u64 AND 0.5".to_string(),
        predicate: "i64 BETWEEN u64 AND 0.5".to_string(),
        arith_op: None,
    });
    cases.push(Case {
        label: "C37b: i64 BETWEEN u64 AND 0.000000000000000001".to_string(),
        predicate: "i64 BETWEEN u64 AND 0.000000000000000001".to_string(),
        arith_op: None,
    });
    // `engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` section 3, B-T1 pins: the
    // admitted new shapes C39, C40, C44 (five) and C47 (two; O-2 ruled yes by question round 45,
    // item 1), each with `arith_op` set as for C32's pin.
    for (label, predicate, arith_op) in [
        ("C39: NULL + NULL > 0", "NULL + NULL > 0", "+"),
        ("C40: NULL - 0.5 > 0", "NULL - 0.5 > 0", "-"),
        ("C44a: i64 > NULL - 0.5", "i64 > NULL - 0.5", "-"),
        ("C44b: (NULL - 0.5) = 0.25", "(NULL - 0.5) = 0.25", "-"),
        ("C44c: f32 > NULL - 0.5", "f32 > NULL - 0.5", "-"),
        ("C44d: 1e3 > NULL - 0.5", "1e3 > NULL - 0.5", "-"),
        (
            "C44e: i64 BETWEEN NULL - 0.5 AND 1",
            "i64 BETWEEN NULL - 0.5 AND 1",
            "-",
        ),
        ("C47a: -(NULL - 0.5) > 0", "-(NULL - 0.5) > 0", "-"),
        (
            "C47b: NULL + (NULL - 0.5) > 0",
            "NULL + (NULL - 0.5) > 0",
            "+",
        ),
        // section 10 Amendment 1: C48 (five refused), C49 (refused), C50 (two admitted) and
        // `f32 > NULL * NULL` (refused; no B-T3 row).
        ("C48a: zone = NULL + NULL", "zone = NULL + NULL", "+"),
        ("C48b: flag = NULL + NULL", "flag = NULL + NULL", "+"),
        ("C48c: zone = NULL - NULL", "zone = NULL - NULL", "-"),
        (
            "C48d: zone IS DISTINCT FROM NULL + NULL",
            "zone IS DISTINCT FROM NULL + NULL",
            "+",
        ),
        (
            "C48e: zone BETWEEN NULL * NULL AND NULL",
            "zone BETWEEN NULL * NULL AND NULL",
            "*",
        ),
        ("C49: flag AND NULL + NULL", "flag AND NULL + NULL", "+"),
        (
            "C50a: i64 BETWEEN NULL + NULL AND 1",
            "i64 BETWEEN NULL + NULL AND 1",
            "+",
        ),
        ("C50b: u8 = NULL * NULL", "u8 = NULL * NULL", "*"),
        ("A1 pin: f32 > NULL * NULL", "f32 > NULL * NULL", "*"),
        // section 10 Amendment 2: C51 (four refused) and `f32 > -NULL` (refused; no B-T3 row).
        ("C51a: zone = -NULL", "zone = -NULL", "-"),
        ("C51b: flag = -NULL", "flag = -NULL", "-"),
        (
            "C51c: zone IS DISTINCT FROM -NULL",
            "zone IS DISTINCT FROM -NULL",
            "-",
        ),
        ("C51d: flag AND -NULL", "flag AND -NULL", "-"),
        ("A2 pin: f32 > -NULL", "f32 > -NULL", "-"),
    ] {
        cases.push(Case {
            label: label.to_string(),
            predicate: predicate.to_string(),
            arith_op: Some(arith_op),
        });
    }
    cases
}

/// section 10 Amendment 4's B-T1 enumeration part 4: C23-shaped rows -- C23 itself
/// (`i64 IN (123456789012345678901.5, 0.000000000000000001)`, a 21-integer-digit decimal literal,
/// beyond section 7's bound, mixed with a scale-18 literal) generalized over every integer column
/// and both `IN` and `BETWEEN` -- 8 columns x 2 forms = 16 cases.
const C23_OUT_OF_BOUNDS_DECIMAL: &str = "123456789012345678901.5";
const C23_SCALE_18_DECIMAL: &str = "0.000000000000000001";

fn c23_shaped_cases() -> Vec<Case> {
    let mut cases = Vec::new();
    for (c, ty) in COLS {
        if int_info(ty).is_none() {
            continue;
        }
        cases.push(Case {
            label: format!("C23-shaped in {c}"),
            predicate: format!("{c} IN ({C23_OUT_OF_BOUNDS_DECIMAL}, {C23_SCALE_18_DECIMAL})"),
            arith_op: None,
        });
        cases.push(Case {
            label: format!("C23-shaped between {c}"),
            predicate: format!(
                "{c} BETWEEN {C23_OUT_OF_BOUNDS_DECIMAL} AND {C23_SCALE_18_DECIMAL}"
            ),
            arith_op: None,
        });
    }
    cases
}

/// section 10 Amendment 4's B-T1 enumeration part 5: `BETWEEN` over every ordered triple of FX-1's
/// twelve columns, 12<sup>3</sup> = 1,728 cases exactly -- this is what pins the all-pairs
/// `BETWEEN` fix (reviewer B1; section 2.3 as amended): a column-bound triple like
/// `i16 BETWEEN f32 AND i64` only refuses once the lower-upper pair is itself checked.
fn between_triple_cases() -> Vec<Case> {
    let mut cases = Vec::new();
    for (a, _) in COLS {
        for (b, _) in COLS {
            for (c, _) in COLS {
                cases.push(Case {
                    label: format!("between-triple {a} BETWEEN {b} AND {c}"),
                    predicate: format!("{a} BETWEEN {b} AND {c}"),
                    arith_op: None,
                });
            }
        }
    }
    cases
}

/// B-T1 (section 4, as amended by section 10 Amendment 4). The enumeration is five parts, each
/// counted and asserted separately: the probe set (7,620); discriminators.txt's N-ARY lists (18);
/// the boundary literals with their negatives, bare and in mixed lists, plus the C32/C37 pins
/// and the NULL-literal-arithmetic pins (346); the C23-shaped rows (16); and `BETWEEN` over every
/// ordered triple of FX-1's twelve columns (1,728). FX-1 carries inf, -inf, nan and the maximum for both REAL and DOUBLE by
/// construction (`FILTER_WITNESS_F32`/`FILTER_WITNESS_F64`). Amendment 4 moves check (ii) (the
/// walk's arithmetic result type against the plan's `return_type`) to B-T1b
/// (`engine/src/predicate.rs`'s `mod tests`); this test keeps only checks (i) and (iii).
/// Mutation: rule 5 widened to 64-bit integers. It fails by name on `i64 = 1e3` (a BIGINT->DOUBLE
/// column cast outside the declared set). Second mutation (Amendment 4): `check_between` checks
/// only input against each bound. It fails by name on C35's plan cast (`i16 BETWEEN f32 AND i64`,
/// part 5's own enumeration).
#[test]
fn the_type_walk_agrees_with_the_binder_over_the_p0_matrix() {
    assert!(spatial_engine::fixture::FILTER_WITNESS_F32.contains(&f32::INFINITY));
    assert!(spatial_engine::fixture::FILTER_WITNESS_F32.contains(&f32::NEG_INFINITY));
    assert!(spatial_engine::fixture::FILTER_WITNESS_F32
        .iter()
        .any(|v| v.is_nan()));
    assert!(spatial_engine::fixture::FILTER_WITNESS_F32.contains(&f32::MAX));
    assert!(spatial_engine::fixture::FILTER_WITNESS_F64.contains(&f64::INFINITY));
    assert!(spatial_engine::fixture::FILTER_WITNESS_F64.contains(&f64::NEG_INFINITY));
    assert!(spatial_engine::fixture::FILTER_WITNESS_F64
        .iter()
        .any(|v| v.is_nan()));
    assert!(spatial_engine::fixture::FILTER_WITNESS_F64.contains(&f64::MAX));

    let fx = fixture();
    let ds = dataset();
    let conn = configured_connection().expect("oracle connection");
    let fx1_path = fx.path.to_string_lossy().replace('\\', "/");

    let part1 = generate_cases();
    assert_eq!(part1.len(), 7_620, "B-T1 enumeration part 1: the probe set");
    let part2 = nary_cases();
    assert_eq!(
        part2.len(),
        18,
        "B-T1 enumeration part 2: discriminators.txt's N-ARY lists"
    );
    let part3 = boundary_literal_cases();
    assert_eq!(
        part3.len(),
        346,
        "B-T1 enumeration part 3: boundary literals"
    );
    let part4 = c23_shaped_cases();
    assert_eq!(part4.len(), 16, "B-T1 enumeration part 4: C23-shaped rows");
    let part5 = between_triple_cases();
    assert_eq!(
        part5.len(),
        1_728,
        "B-T1 enumeration part 5: BETWEEN triples"
    );

    let cases: Vec<Case> = part1
        .into_iter()
        .chain(part2)
        .chain(part3)
        .chain(part4)
        .chain(part5)
        .collect();
    assert_eq!(cases.len(), 9_728, "B-T1's five parts together");

    let mut admitted = 0usize;
    let mut refused = 0usize;
    let mut failures: Vec<String> = Vec::new();

    for case in &cases {
        let outcome = AdmittedPredicate::admit(case.predicate.as_str(), &ds);
        let admitted_predicate = match outcome {
            Ok(p) => {
                admitted += 1;
                p
            }
            Err(_) => {
                refused += 1;
                continue;
            }
        };

        // (i) every BOUND_CAST is in the declared set.
        let plan = plan_json(&conn, &fx1_path, &case.predicate);
        if plan.get("error").and_then(Value::as_bool) == Some(true) {
            failures.push(format!(
                "{}: admitted by the engine, but DuckDB's own planner refuses it: {:?}",
                case.label, plan["error_message"]
            ));
            continue;
        }
        let mut filters = Vec::new();
        find_filter_exprs(&plan, &mut filters);
        let mut casts = Vec::new();
        for f in &filters {
            walk_casts(f, false, &mut casts);
        }
        for cast in &casts {
            if !is_declared_cast(cast.kind, &cast.from, &cast.to, cast.in_division) {
                failures.push(format!(
                    "{}: undeclared cast {} {} -> {} (in_division={})",
                    case.label, cast.kind, cast.from, cast.to, cast.in_division
                ));
            }
        }

        // (ii) moved to B-T1b (`engine/src/predicate.rs`'s `mod tests`, section 10 Amendment 4).

        // (iii) the product stream ends without error, outside section 2.5(d).
        match drain_ids(&ds, &admitted_predicate) {
            Ok(_) => {}
            Err(e) => {
                if !is_declared_overflow(case.arith_op, &e) {
                    failures.push(format!(
                        "{}: admitted, but the stream ended in error: {e}",
                        case.label
                    ));
                }
            }
        }
    }

    println!(
        "B-T1: {admitted} admitted, {refused} refused, {} failures",
        failures.len()
    );
    for f in failures.iter().take(40) {
        println!("  {f}");
    }
    assert!(
        failures.is_empty(),
        "{} B-T1 counterexample(s); see the report above",
        failures.len()
    );

    assert_fixture_unchanged(fx);
}
