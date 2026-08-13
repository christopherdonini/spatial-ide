// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! An **admitted predicate** — SQL text this engine may compose directly into a `WHERE` clause —
//! and the admission that earns that trust.
//!
//! `NEXT-CUT.md`'s filter-in-SQL design note (architect note, binding) splits validation into
//! three named stages, all implemented in this module:
//!
//! 1. **Structural admission** ([`structural_admit`]) — DuckDB's own parser (`json_serialize_sql`,
//!    a bound `CAST(? AS VARCHAR)` parameter per `CUT-STATE.md` P0) parses the predicate, and the
//!    returned tree is walked against a declared allowlist of construct names.
//! 2. **Namespace admission** ([`namespace_admit`]) — every column the walk collected is checked
//!    against the dataset's resident `file_schema()`, minus the geometry column, minus any column
//!    whose type fails [`crate::attributes::admit_attribute_type`], plus the identity-alias rule
//!    (see [`identity_alias_ambiguity`]).
//! 3. **Bind admission** ([`bind_admit`]) — the predicate is prepared against a zero-row, typed
//!    surrogate relation built from the admitted namespace (no file I/O — the relation's rows are
//!    `CAST(NULL AS ...)` literals, never a scan), and its inferred type is asserted `BOOLEAN`.
//!
//! ## The security boundary (docs/09), verbatim intent
//!
//! The no-subquery, no-function-call rules below are a **docs/09 security boundary, not taste**.
//! They are what stops a "read dataset A" grant from becoming "read any local file" via
//! `read_csv` (or any other table or scalar function) reached through a filter predicate. The
//! allowlist is allowlist-**shaped**: every arm below names an admitted construct, and the final
//! arm of every match refuses whatever it cannot name — never the reverse.
//!
//! ## What a caller gets from [`AdmittedPredicate::admit`]
//!
//! A type only constructible through one checked path, exactly [`crate::attributes::
//! PublishedProjection`]'s discipline applied to a predicate: without it, `build_sql` would take a
//! bare `&str`, and every caller between the SKP boundary and composition would be *trusted* not
//! to have skipped admission — exactly the shape a `docs/09` boundary must not have.

use std::collections::BTreeMap;
use std::fmt;

use arrow::datatypes::DataType;
use duckdb::Connection;
use serde_json::Value;

use crate::dataset::Dataset;
use crate::envelope::ID_COLUMN;
use crate::identity::IdSource;
use crate::pool::LeaseClass;

/// The predicate's own text may not exceed this many bytes.
///
/// **Declared, not discovered (ADR-010 rule 6), and checked *before* the text ever reaches
/// DuckDB's parser** — the first thing [`structural_admit`] does. A generous ceiling for any
/// predicate a filter panel would plausibly build (dozens of `AND`/`OR`-joined conditions comfortably
/// fit in low hundreds of bytes), and small enough that even a predicate built entirely of nested
/// parentheses cannot hand the C++ parser a payload large enough to matter before this check ever
/// calls it — see the module's `CUT-STATE.md` entry for why the *byte* ceiling, not the depth
/// ceiling, is what actually bounds a "paren bomb": redundant grouping parentheses do not add a
/// single level to DuckDB's parsed expression tree (measured; empty JSON evidence recorded there).
pub const MAX_PREDICATE_BYTES: usize = 4_096;

/// The predicate's parsed expression tree may not descend past this depth.
///
/// **Declared, not discovered.** A tree walk recurses once per nesting level, so this is the
/// ceiling that bounds that recursion's own stack use, independent of the byte ceiling above.
/// Real predicates nest a handful of levels deep at most (an `OR` of a few `AND`s of comparisons
/// is depth 3–4); 32 is generous headroom over that while still small enough to make a crafted
/// deeply-nested expression (chained `NOT`, or alternating `AND`/`OR` inside explicit parens —
/// **not** redundant parens, which the measurement above shows add no depth at all) refused before
/// the recursion goes any further.
pub const MAX_PREDICATE_DEPTH: usize = 32;

/// Arithmetic function names admitted as ordinary "basic arithmetic operators" — DuckDB's parser
/// represents `x + 1` as a `FUNCTION` node (`function_name: "+"`, `is_operator: true`), not as a
/// distinct operator class, so admission must recognize these four by name rather than by class.
const ADMITTED_ARITHMETIC_FUNCTIONS: &[&str] = &["+", "-", "*", "/"];

/// `LIKE` / `ILIKE` function names — DuckDB's parser lowers both to `FUNCTION` nodes too
/// (`~~` / `~~*`, `is_operator: true`). Admitted only with a literal pattern (the brief's own
/// qualifier): the second child must be a `CONSTANT`, never a sub-expression.
const ADMITTED_PATTERN_FUNCTIONS: &[&str] = &["~~", "~~*"];

/// SQL text admitted to ride, verbatim, into a `WHERE` clause.
///
/// **The single-constructor discipline [`crate::attributes::PublishedProjection`] uses, applied to
/// a predicate.** The only public, non-deprecated way to build one is [`AdmittedPredicate::admit`],
/// which runs all three admission stages this module implements. Nothing rewrites, normalizes, or
/// case-folds the text on the way in or out — [`Self::sql_text`] returns exactly what was admitted.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct AdmittedPredicate {
    text: String,
}

impl AdmittedPredicate {
    /// Admit `text` against `dataset`'s resident schema, running all three named stages —
    /// structural, namespace, bind — in that order, each gating the next.
    ///
    /// **Why this takes `&Dataset` rather than a bare connection.** `crate::pool::Lease::connection`
    /// is `pub(crate)` deliberately (`pool.rs`: "the connection itself never leaves this crate"), so
    /// a public signature accepting a raw `&duckdb::Connection` would either violate that invariant
    /// or be uncallable by an external crate (`kernel/`, P4's caller) without engine changes P4
    /// would then owe anyway. Taking `&Dataset` keeps every DuckDB connection admission uses inside
    /// this crate, on the dataset's own bounded pool (`LeaseClass::Maintenance` — the same class
    /// `Dataset::open` itself uses for its own admission work), so a burst of filter admissions
    /// cannot bypass the pool's declared connection ceiling by minting ad-hoc connections per call.
    pub fn admit(text: impl Into<String>, dataset: &Dataset) -> Result<Self, FilterError> {
        let text = text.into();

        let lease = dataset.connections().acquire(LeaseClass::Maintenance).map_err(|e| {
            FilterError::RejectedByBinder {
                detail: format!("no connection was available to validate this predicate: {e}"),
            }
        })?;
        let conn = lease.connection();

        let columns = structural_admit(&text, conn)?;
        let namespace = namespace_admit(&columns, dataset)?;
        bind_admit(&text, &namespace, conn)?;

        // Reached only once every stage above returned `Ok` — every earlier `?` drops (and so
        // discards, never returns to the pool) a lease that ran arbitrary caller text through
        // DuckDB and was never confirmed to be in a state worth reusing. Only a *fully* admitted
        // predicate's connection is known-clean enough to hand back.
        lease.release_healthy();

        Ok(Self { text })
    }

    /// Construct an `AdmittedPredicate` with **nothing checked** — `pub(crate)`, test-only.
    ///
    /// **Not the old `assume_validated` shim.** That was a `pub` method `kernel/src/skp.rs`'s P2
    /// pass-through called directly; `NEXT-CUT.md` P4 switched that call site to
    /// [`AdmittedPredicate::admit`] and removed it, so nothing outside this crate can build a
    /// predicate with admission skipped any more. This constructor exists only for
    /// `stream::tests::filter_composition`'s composition-as-string matrix, which tests `build_sql`'s
    /// pure SQL-**text** composition in isolation from whether a given predicate would pass real
    /// admission against any particular dataset (its own odd-casing/whitespace case names a column
    /// no fixture in this crate ever writes, on purpose — the property under test is "never
    /// rewritten", not "would admit").
    #[cfg(test)]
    pub(crate) fn unchecked_for_composition_test(text: String) -> Self {
        Self { text }
    }

    /// The predicate's SQL text, exactly as admitted — never rewritten, normalized, or case-folded
    /// on the way out. `build_sql` composes this verbatim into a `WHERE` clause, wrapped in exactly
    /// the one paren pair the design note describes.
    pub fn sql_text(&self) -> &str {
        &self.text
    }
}

/// Every refusal [`AdmittedPredicate::admit`] can produce.
///
/// **A deliberate 1:1 correspondence with `NEXT-CUT.md` design essential 5's eleven `skp.filter_*`
/// wire codes, field for field — not a coincidence.** P4 maps each variant to its SKP code by name;
/// a twelfth variant here would be inventing wire taxonomy this crate does not own. Every match on
/// this enum in this module is exhaustive, with no wildcard arm, for the same reason.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum FilterError {
    /// The predicate declared a dialect other than the one this engine admits.
    ///
    /// **Not constructible by [`AdmittedPredicate::admit`] today.** `protocol/skp`'s `Filter::new`
    /// already refuses any dialect but `duckdb-expr/0` at the wire boundary, before predicate text
    /// ever reaches this crate (`CUT-STATE.md` P1). This variant exists only so `FilterError`'s
    /// eleven arms match the SKP taxonomy exactly, so a later exhaustive match never needs a
    /// wildcard arm to compile.
    DialectUnsupported { declared: String },

    /// DuckDB's own parser rejected the wrapped text.
    ///
    /// Two distinct sources fold into this one variant, deliberately: the JSON payload's own
    /// `"error": true` case (`CUT-STATE.md` P0 — never a Rust-level `Err` for a malformed *inner*
    /// SQL string), and a genuine failure to even reach that payload (an unexpected error from the
    /// `json_serialize_sql` call itself, or JSON this module could not parse). Either way, the text
    /// did not yield a usable parse, and a caller does not need to know which layer said so.
    Unparsable { detail: String },

    /// The wrapped text parsed to more than one top-level statement (or, defensively, zero).
    NotASingleExpression { statements: usize },

    /// A node the allowlist does not recognize by name — refused by construct, never admitted by
    /// default. `construct` names exactly what was found, for the docs/09 reason in the module doc.
    ConstructNotAdmitted { construct: String },

    /// A column reference names something absent from the dataset's resident schema.
    UnknownColumn { column: String },

    /// A column exists in the resident schema but may not be filtered on — the geometry column, or
    /// a column whose type fails [`crate::attributes::admit_attribute_type`].
    ColumnNotFilterable { column: String, reason: String },

    /// The predicate referenced the wire's `id` name while a declared identity mapping means that
    /// name **also** exists, unrelated, in the source file — see [`identity_alias_ambiguity`].
    IdentityAliasAmbiguous { column: String, source_column: String },

    /// The predicate binds, but its inferred type is not `BOOLEAN`. An int-to-bool (or any other)
    /// implicit coercion is refused rather than silently applied (`docs/01` principle 8).
    NotBoolean { inferred_type: String },

    /// The predicate's own text exceeded [`MAX_PREDICATE_BYTES`].
    TooLong { limit: u64, saw: u64 },

    /// The predicate's parsed expression tree exceeded [`MAX_PREDICATE_DEPTH`].
    TooDeep { limit: u64, saw: u64 },

    /// Structural and namespace admission both passed, but DuckDB's own binder refused the
    /// predicate against the surrogate relation — or a connection to run that check on could not be
    /// acquired at all ([`AdmittedPredicate::admit`]'s own doc explains why that folds in here).
    RejectedByBinder { detail: String },
}

impl fmt::Display for FilterError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::DialectUnsupported { declared } => {
                write!(f, "refused: dialect `{declared}` is not admitted; only `duckdb-expr/0` is")
            }
            Self::Unparsable { detail } => write!(f, "refused: the predicate did not parse ({detail})"),
            Self::NotASingleExpression { statements } => write!(
                f,
                "refused: the predicate parsed to {statements} statement(s), not exactly one boolean \
                 expression"
            ),
            Self::ConstructNotAdmitted { construct } => write!(
                f,
                "refused: {construct} is not on the admitted construct list — the no-subquery, \
                 no-function-call rules are a docs/09 security boundary, not taste"
            ),
            Self::UnknownColumn { column } => {
                write!(f, "refused: `{column}` is not a column this dataset carries")
            }
            Self::ColumnNotFilterable { column, reason } => {
                write!(f, "refused: `{column}` cannot be filtered on — {reason}")
            }
            Self::IdentityAliasAmbiguous { column, source_column } => write!(
                f,
                "refused: `{column}` is ambiguous — this dataset's identity is mapped from \
                 `{source_column}`, and the file also carries its own, unrelated column literally \
                 named `{column}`; a predicate cannot say which one it means"
            ),
            Self::NotBoolean { inferred_type } => write!(
                f,
                "refused: the predicate's inferred type is {inferred_type}, not BOOLEAN; an implicit \
                 conversion to BOOLEAN is not performed (docs/01 principle 8)"
            ),
            Self::TooLong { limit, saw } => {
                write!(f, "refused: predicate is {saw} bytes, over the declared ceiling of {limit}")
            }
            Self::TooDeep { limit, saw } => write!(
                f,
                "refused: predicate's expression tree reached depth {saw}, over the declared ceiling \
                 of {limit}"
            ),
            Self::RejectedByBinder { detail } => {
                write!(f, "refused: DuckDB's binder rejected the predicate ({detail})")
            }
        }
    }
}

impl std::error::Error for FilterError {}

// ---------------------------------------------------------------------------------------------
// Stage 1 — structural admission
// ---------------------------------------------------------------------------------------------

/// Wrap `predicate` in the fixed template this module standardizes on (`CUT-STATE.md` P0):
/// `SELECT 1 WHERE ( <predicate> )`. The added parens are the **only** thing ever prepended or
/// appended to the caller's text before it reaches DuckDB's parser.
fn wrap(predicate: &str) -> String {
    format!("SELECT 1 WHERE ({predicate})")
}

/// Ask DuckDB's own parser (`json_serialize_sql`) what `wrapped` parses to.
///
/// **Never a hand-rolled SQL lexer** (`NEXT-CUT.md` P0's own instruction). The predicate text is
/// always bound as `CAST(? AS VARCHAR)`, never string-concatenated into the query — `CUT-STATE.md`
/// P0 found the bare `?` form fails to bind at all, and string concatenation here would defeat the
/// entire admission this module exists to perform.
fn serialize_sql(wrapped: &str, conn: &Connection) -> Result<Value, FilterError> {
    let sql = "SELECT json_serialize_sql(CAST(? AS VARCHAR))";
    let json_text: String = conn.query_row(sql, [wrapped], |row| row.get(0)).map_err(|e| {
        FilterError::Unparsable { detail: format!("json_serialize_sql could not be called: {e}") }
    })?;
    serde_json::from_str(&json_text).map_err(|e| FilterError::Unparsable {
        detail: format!("json_serialize_sql returned JSON this module could not parse: {e}"),
    })
}

/// Structural admission (stage 1). Parses `predicate` via DuckDB's own parser, walks the returned
/// tree against the declared allowlist, and returns every column name the walk collected (for
/// stage 2). Enforces [`MAX_PREDICATE_BYTES`] before parsing at all, and [`MAX_PREDICATE_DEPTH`]
/// during the walk.
fn structural_admit(predicate: &str, conn: &Connection) -> Result<Vec<String>, FilterError> {
    if predicate.len() > MAX_PREDICATE_BYTES {
        return Err(FilterError::TooLong {
            limit: MAX_PREDICATE_BYTES as u64,
            saw: predicate.len() as u64,
        });
    }

    let payload = serialize_sql(&wrap(predicate), conn)?;

    // `CUT-STATE.md` P0: a malformed inner SQL string never surfaces as a Rust `Err` from the call
    // above — it succeeds at the SQL-execution layer and reports its own failure *inside* the JSON
    // payload's `"error"` field, which is what this checks. A missing or non-boolean `"error"` key
    // is treated the same as `true` — refuse-by-default, never admit what the payload did not
    // affirmatively say was `false`.
    if payload.get("error").and_then(Value::as_bool).unwrap_or(true) {
        let detail = payload
            .get("error_message")
            .and_then(Value::as_str)
            .unwrap_or("json_serialize_sql reported an error with no error_message field")
            .to_string();
        return Err(FilterError::Unparsable { detail });
    }

    let statements = payload.get("statements").and_then(Value::as_array).ok_or_else(|| {
        FilterError::Unparsable {
            detail: "json_serialize_sql's payload carries no `statements` array".to_string(),
        }
    })?;
    if statements.len() != 1 {
        return Err(FilterError::NotASingleExpression { statements: statements.len() });
    }
    let stmt = &statements[0];

    // Defense in depth: a `?`/`$1` placeholder reaching *anywhere* in the wrapped statement shows
    // up here too, not only as a `PARAMETER` node the walk below would refuse on its own.
    if !matches!(stmt.get("named_param_map").and_then(Value::as_array), Some(a) if a.is_empty()) {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a bind parameter (the statement's named_param_map is non-empty)".to_string(),
        });
    }

    let node = stmt.get("node").ok_or_else(|| FilterError::ConstructNotAdmitted {
        construct: "a statement with no `node`".to_string(),
    })?;
    let where_clause = expect_bare_select_wrapper(node)?;

    let mut columns = Vec::new();
    walk_expr(where_clause, 1, &mut columns)?;
    Ok(columns)
}

/// Assert that `node` (the top-level parsed `SELECT_NODE`) is **exactly** this module's own
/// `SELECT 1 WHERE ( ... )` wrapper, with nothing else attached anywhere else in the statement,
/// and return its `where_clause` on success.
///
/// **Why every field here, not only `where_clause`.** The wrapper closes its own parenthesis
/// immediately after the caller's text; if that text itself contains an unbalanced `)`, everything
/// after it lands in the *same* top-level `SELECT`, not inside `where_clause` at all — a `GROUP
/// BY`/`HAVING` breakout (`1=1) GROUP BY 1 HAVING count(*) > 0 --`) parses to **one** valid
/// `SELECT_NODE` whose `where_clause` is an innocuous `1=1`, while `group_expressions` and
/// `having` carry the smuggled function call — real JSON observed while building this module,
/// recorded in `CUT-STATE.md`. A walker that only inspected `where_clause` would admit that whole
/// predicate. Checking every other field the wrapper's own fixed template controls is what closes
/// that gap.
fn expect_bare_select_wrapper(node: &Value) -> Result<&Value, FilterError> {
    let node_type = node.get("type").and_then(Value::as_str).unwrap_or("<missing type>");
    if node_type != "SELECT_NODE" {
        return Err(FilterError::ConstructNotAdmitted {
            construct: format!("a top-level statement of type `{node_type}`, not a bare SELECT"),
        });
    }

    let empty_array = |key: &str| matches!(node.get(key).and_then(Value::as_array), Some(a) if a.is_empty());
    let is_null = |key: &str| node.get(key).map(Value::is_null).unwrap_or(false);

    if !empty_array("modifiers") {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a query modifier (DISTINCT/ORDER BY/LIMIT on the wrapper's own SELECT)"
                .to_string(),
        });
    }
    if !matches!(
        node.get("cte_map").and_then(|m| m.get("map")).and_then(Value::as_array),
        Some(a) if a.is_empty()
    ) {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a WITH / common table expression".to_string(),
        });
    }
    let select_list = node.get("select_list").and_then(Value::as_array).ok_or_else(|| {
        FilterError::ConstructNotAdmitted { construct: "a malformed select_list".to_string() }
    })?;
    if select_list.len() != 1 || select_list[0].get("class").and_then(Value::as_str) != Some("CONSTANT")
    {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "the wrapper's own `SELECT 1` was altered".to_string(),
        });
    }
    if node.get("from_table").and_then(|t| t.get("type")).and_then(Value::as_str) != Some("EMPTY") {
        return Err(FilterError::ConstructNotAdmitted { construct: "a FROM clause".to_string() });
    }
    if !empty_array("group_expressions") || !empty_array("group_sets") {
        return Err(FilterError::ConstructNotAdmitted { construct: "a GROUP BY clause".to_string() });
    }
    if node.get("aggregate_handling").and_then(Value::as_str) != Some("STANDARD_HANDLING") {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "non-standard aggregate handling".to_string(),
        });
    }
    if !is_null("having") {
        return Err(FilterError::ConstructNotAdmitted { construct: "a HAVING clause".to_string() });
    }
    if !is_null("sample") {
        return Err(FilterError::ConstructNotAdmitted { construct: "a SAMPLE clause".to_string() });
    }
    if !is_null("qualify") {
        return Err(FilterError::ConstructNotAdmitted { construct: "a QUALIFY clause".to_string() });
    }

    match node.get("where_clause") {
        Some(w) if !w.is_null() => Ok(w),
        _ => Err(FilterError::ConstructNotAdmitted {
            construct: "an empty predicate (no WHERE expression at all)".to_string(),
        }),
    }
}

/// Read `node`'s `children` array, refusing (by construct) any node whose shape does not carry one.
fn expect_children(node: &Value) -> Result<&Vec<Value>, FilterError> {
    node.get("children").and_then(Value::as_array).ok_or_else(|| FilterError::ConstructNotAdmitted {
        construct: "a node with no `children` array".to_string(),
    })
}

fn missing_field(what: &str) -> FilterError {
    FilterError::ConstructNotAdmitted { construct: format!("a node missing `{what}`") }
}

/// Walk one expression node against the declared allowlist, collecting every `COLUMN_REF` name
/// into `columns` and refusing (by [`MAX_PREDICATE_DEPTH`]) once `depth` exceeds the ceiling.
///
/// **Allowlist-shaped by construction**: every match arm names an admitted construct; the final
/// arm of the outer `match`, and of every nested `match`, refuses whatever it does not recognize.
/// This is the docs/09 boundary the module doc states — see there for the full sentence.
fn walk_expr(node: &Value, depth: usize, columns: &mut Vec<String>) -> Result<(), FilterError> {
    if depth > MAX_PREDICATE_DEPTH {
        return Err(FilterError::TooDeep {
            limit: MAX_PREDICATE_DEPTH as u64,
            saw: depth as u64,
        });
    }

    let class = node.get("class").and_then(Value::as_str).ok_or_else(|| {
        FilterError::ConstructNotAdmitted { construct: "an expression node with no `class`".to_string() }
    })?;

    match class {
        // A literal. Nothing to admit or collect — dollar-quoted strings (`$$...$$`) parse to this
        // same node, indistinguishable from a single-quoted string at this level; see
        // `CUT-STATE.md`'s comment-handling entry for the corresponding documented decision.
        "CONSTANT" => Ok(()),

        "COLUMN_REF" => {
            let names = node.get("column_names").and_then(Value::as_array).ok_or_else(|| {
                FilterError::ConstructNotAdmitted {
                    construct: "a COLUMN_REF with no column_names".to_string(),
                }
            })?;
            if names.len() != 1 {
                return Err(FilterError::ConstructNotAdmitted {
                    construct: "a qualified column reference (table.column) — this predicate names \
                                no table"
                        .to_string(),
                });
            }
            let name = names[0].as_str().ok_or_else(|| FilterError::ConstructNotAdmitted {
                construct: "a COLUMN_REF whose name is not a string".to_string(),
            })?;
            columns.push(name.to_string());
            Ok(())
        }

        // `AND` / `OR`. DuckDB's parser flattens a same-operator chain (`a AND b AND c`) into one
        // n-ary node, not nested pairs — measured while building this module (`CUT-STATE.md`), so
        // siblings here cost no extra depth; only genuine nesting (parens around a *different*
        // operator, or explicit `NOT`) does.
        "CONJUNCTION" => {
            for child in expect_children(node)? {
                walk_expr(child, depth + 1, columns)?;
            }
            Ok(())
        }

        // A basic comparison (`=`, `<`, `>`, `<>`, `<=`, `>=`, ...). Every `COMPARE_*` type is
        // admitted uniformly; the comparison *operator* is never the thing being restricted here.
        "COMPARISON" => {
            let left = node.get("left").ok_or_else(|| missing_field("COMPARISON.left"))?;
            let right = node.get("right").ok_or_else(|| missing_field("COMPARISON.right"))?;
            walk_expr(left, depth + 1, columns)?;
            walk_expr(right, depth + 1, columns)
        }

        // `x BETWEEN lower AND upper`.
        "BETWEEN" => {
            let input = node.get("input").ok_or_else(|| missing_field("BETWEEN.input"))?;
            let lower = node.get("lower").ok_or_else(|| missing_field("BETWEEN.lower"))?;
            let upper = node.get("upper").ok_or_else(|| missing_field("BETWEEN.upper"))?;
            walk_expr(input, depth + 1, columns)?;
            walk_expr(lower, depth + 1, columns)?;
            walk_expr(upper, depth + 1, columns)
        }

        // `NOT`, `IS [NOT] NULL`, and (DuckDB models it here too) `IN` with a literal list.
        "OPERATOR" => {
            let op_type = node.get("type").and_then(Value::as_str).unwrap_or("<missing type>");
            match op_type {
                "OPERATOR_NOT" | "OPERATOR_IS_NULL" | "OPERATOR_IS_NOT_NULL" => {
                    let children = expect_children(node)?;
                    if children.len() != 1 {
                        return Err(FilterError::ConstructNotAdmitted {
                            construct: format!("{op_type} with {} operand(s)", children.len()),
                        });
                    }
                    walk_expr(&children[0], depth + 1, columns)
                }
                // `x IN (a, b, c)` — the brief's "IN with literal list": the needle (first child)
                // walks normally, but every remaining child **must** be a literal `CONSTANT`. `x IN
                // (SELECT ...)` does not reach this arm at all — DuckDB parses it as a `SUBQUERY`
                // node instead (measured; see the `SUBQUERY` refusal below).
                "COMPARE_IN" => {
                    let children = expect_children(node)?;
                    if children.len() < 2 {
                        return Err(FilterError::ConstructNotAdmitted {
                            construct: "IN with an empty list".to_string(),
                        });
                    }
                    walk_expr(&children[0], depth + 1, columns)?;
                    for member in &children[1..] {
                        if member.get("class").and_then(Value::as_str) != Some("CONSTANT") {
                            return Err(FilterError::ConstructNotAdmitted {
                                construct: "IN with a non-literal list member".to_string(),
                            });
                        }
                        walk_expr(member, depth + 1, columns)?;
                    }
                    Ok(())
                }
                other => Err(FilterError::ConstructNotAdmitted {
                    construct: format!("OPERATOR::{other}"),
                }),
            }
        }

        // Every function call DuckDB's parser produces is this class, `is_operator` included —
        // `x + 1`, `x LIKE 'a%'` and `random()` are all `FUNCTION` nodes (measured; see
        // `ADMITTED_ARITHMETIC_FUNCTIONS`/`ADMITTED_PATTERN_FUNCTIONS`'s own docs). Everything
        // except those two small, named sets is refused unconditionally — the docs/09 boundary
        // this module's own doc states in full.
        "FUNCTION" => {
            let name = node.get("function_name").and_then(Value::as_str).unwrap_or("<missing name>");
            let is_operator = node.get("is_operator").and_then(Value::as_bool).unwrap_or(false);
            let children = expect_children(node)?;

            if is_operator && ADMITTED_ARITHMETIC_FUNCTIONS.contains(&name) {
                for child in children {
                    walk_expr(child, depth + 1, columns)?;
                }
                Ok(())
            } else if is_operator && ADMITTED_PATTERN_FUNCTIONS.contains(&name) {
                if children.len() != 2 {
                    return Err(FilterError::ConstructNotAdmitted {
                        construct: format!("`{name}` (LIKE/ILIKE) with {} operand(s)", children.len()),
                    });
                }
                if children[1].get("class").and_then(Value::as_str) != Some("CONSTANT") {
                    return Err(FilterError::ConstructNotAdmitted {
                        construct: format!("`{name}` (LIKE/ILIKE) with a non-literal pattern"),
                    });
                }
                walk_expr(&children[0], depth + 1, columns)?;
                walk_expr(&children[1], depth + 1, columns)
            } else {
                Err(FilterError::ConstructNotAdmitted {
                    construct: format!("a function call (`{name}`)"),
                })
            }
        }

        "CAST" => Err(FilterError::ConstructNotAdmitted { construct: "CAST".to_string() }),
        "SUBQUERY" => Err(FilterError::ConstructNotAdmitted { construct: "a subquery".to_string() }),
        "PARAMETER" => Err(FilterError::ConstructNotAdmitted {
            construct: "a bind parameter placeholder".to_string(),
        }),
        "STAR" => Err(FilterError::ConstructNotAdmitted { construct: "a star expression".to_string() }),

        other => Err(FilterError::ConstructNotAdmitted {
            construct: format!("an unrecognized node class `{other}` — refused, never admitted, \
                                 because this module cannot name what it would be admitting"),
        }),
    }
}

// ---------------------------------------------------------------------------------------------
// Stage 2 — namespace admission
// ---------------------------------------------------------------------------------------------

/// If `dataset` carries a declared identity mapping (ADR-016 §3) whose source column differs from
/// the wire's own `id` name, **and** the file separately carries its own column literally named
/// `id` (unrelated to identity), that name is ambiguous: a predicate that writes `id` cannot say
/// whether it means the wire identity or the file's own unrelated column.
///
/// **Honesty note, exactly as the piece asks for.** No product entry point constructs a `Mapped`
/// identity today (`kernel/` always opens through `Dataset::open_cancellable` /
/// `open_with_connections`, neither of which is ever handed a declared identity) — grepped before
/// writing this function; only this crate's own tests exercise
/// `Dataset::open_with_declared_identity`. This check is implemented at the seam where the
/// ambiguity **would** surface the day a caller does supply one, not because it fires today.
fn identity_alias_ambiguity(dataset: &Dataset) -> Option<(String, String)> {
    match dataset.identity().source() {
        IdSource::Mapped { column, .. } if column != ID_COLUMN => {
            let file_has_its_own_id =
                dataset.file_schema().fields().iter().any(|f| f.name() == ID_COLUMN);
            file_has_its_own_id.then(|| (ID_COLUMN.to_string(), column.clone()))
        }
        _ => None,
    }
}

/// Namespace admission (stage 2). Every name `structural_admit` collected is checked against
/// `dataset`'s resident `file_schema()`, minus the geometry column, minus any column whose type
/// fails [`crate::attributes::admit_attribute_type`], plus the identity-alias rule above. Returns
/// the admitted namespace (name → type) for stage 3 to build its surrogate relation from.
fn namespace_admit(
    columns: &[String],
    dataset: &Dataset,
) -> Result<BTreeMap<String, DataType>, FilterError> {
    let geometry_column = dataset.geometry_column();
    let alias = identity_alias_ambiguity(dataset);

    let mut namespace = BTreeMap::new();
    for field in dataset.file_schema().fields() {
        let name = field.name().as_str();
        if name == geometry_column {
            continue;
        }
        if crate::attributes::admit_attribute_type(name, field.data_type()).is_ok() {
            namespace.insert(name.to_string(), field.data_type().clone());
        }
    }

    for name in columns {
        if let Some((ambiguous_name, source_column)) = &alias {
            if name == ambiguous_name {
                return Err(FilterError::IdentityAliasAmbiguous {
                    column: name.clone(),
                    source_column: source_column.clone(),
                });
            }
        }
        if name == geometry_column {
            return Err(FilterError::ColumnNotFilterable {
                column: name.clone(),
                reason: "this is the geometry column; it already travels as GeoArrow, and a \
                         predicate may reference attribute columns only"
                    .to_string(),
            });
        }
        match dataset.file_schema().fields().iter().find(|f| f.name() == name) {
            None => return Err(FilterError::UnknownColumn { column: name.clone() }),
            Some(field) => {
                if let Err(e) = crate::attributes::admit_attribute_type(name, field.data_type()) {
                    return Err(FilterError::ColumnNotFilterable {
                        column: name.clone(),
                        reason: e.to_string(),
                    });
                }
            }
        }
    }

    Ok(namespace)
}

// ---------------------------------------------------------------------------------------------
// Stage 3 — bind admission
// ---------------------------------------------------------------------------------------------

/// The DuckDB type name to `CAST(NULL AS ...)` a column of Arrow type `ty` as, for the surrogate
/// relation. `None` only for a type [`crate::attributes::admit_attribute_type`] would already have
/// refused — `namespace_admit` guarantees every entry it hands to [`bind_admit`] admits here.
fn duckdb_type_name(ty: &DataType) -> Option<&'static str> {
    use DataType as D;
    match ty {
        D::Utf8 | D::LargeUtf8 | D::Utf8View => Some("VARCHAR"),
        D::Boolean => Some("BOOLEAN"),
        D::Int8 => Some("TINYINT"),
        D::Int16 => Some("SMALLINT"),
        D::Int32 => Some("INTEGER"),
        D::Int64 => Some("BIGINT"),
        D::UInt8 => Some("UTINYINT"),
        D::UInt16 => Some("USMALLINT"),
        D::UInt32 => Some("UINTEGER"),
        D::UInt64 => Some("UBIGINT"),
        D::Float64 => Some("DOUBLE"),
        _ => None,
    }
}

/// Bind admission (stage 3). Prepares `predicate` against a **zero-row, typed surrogate relation**
/// built entirely from `namespace` — every column is a `CAST(NULL AS <type>)` literal, and the
/// relation itself is cut to zero rows with `LIMIT 0`, so **no file I/O happens at all**: this is
/// the same `LIMIT 0` + `query_arrow` + `get_schema()` pattern `dataset.rs::probe_schema` already
/// uses to read a schema without reading rows. Refuses [`FilterError::NotBoolean`] if the
/// predicate's inferred type is not `BOOLEAN` — checked by reading the expression's own column
/// type from the executed (zero-row) result schema, not by embedding it in a `WHERE` clause DuckDB
/// might silently coerce to boolean without saying so.
///
/// **Safe to interpolate `predicate` directly into SQL text here only because [`structural_admit`]
/// has already run and admitted it** — by the time this stage sees the text, it can contain
/// nothing but column references, literals, and the small set of comparison/logical/arithmetic
/// constructs the allowlist walk admits. This function must never run on text stage 1 has not
/// approved.
fn bind_admit(
    predicate: &str,
    namespace: &BTreeMap<String, DataType>,
    conn: &Connection,
) -> Result<(), FilterError> {
    let quote = |s: &str| format!("\"{}\"", s.replace('"', "\"\""));

    let columns_sql = if namespace.is_empty() {
        // No admitted attribute column exists (or none happened to be referenced) — a predicate
        // like `1 + 1` still needs *some* FROM target to bind against.
        format!("1 AS {}", quote("__surrogate_anchor"))
    } else {
        namespace
            .iter()
            .map(|(name, ty)| {
                let type_name = duckdb_type_name(ty)
                    .expect("namespace_admit only carries types admit_attribute_type accepted");
                format!("CAST(NULL AS {type_name}) AS {}", quote(name))
            })
            .collect::<Vec<_>>()
            .join(", ")
    };

    let sql = format!(
        "SELECT ({predicate}) AS {} FROM (SELECT {columns_sql}) AS {} LIMIT 0",
        quote("__predicate_result"),
        quote("__surrogate")
    );

    let mut stmt = conn
        .prepare(&sql)
        .map_err(|e| FilterError::RejectedByBinder { detail: e.to_string() })?;
    let arrow = stmt
        .query_arrow([])
        .map_err(|e| FilterError::RejectedByBinder { detail: e.to_string() })?;
    let schema = arrow.get_schema();
    let inferred = schema.field(0).data_type();

    if inferred != &DataType::Boolean {
        return Err(FilterError::NotBoolean { inferred_type: inferred.to_string() });
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_text_comes_back_exactly_as_given_never_rewritten() {
        let odd = "  zone = 'residential'  -- not touched";
        let p = AdmittedPredicate::unchecked_for_composition_test(odd.to_string());
        assert_eq!(p.sql_text(), odd);
    }

    /// Stage 1 alone, exercised without a `Dataset` — `structural_admit` needs only a bare
    /// in-memory connection, which is what makes it possible to unit-test the byte/depth ceilings
    /// (and the allowlist walk itself) without paying for a real GeoParquet fixture on every row.
    /// The full end-to-end corpus (all three stages, real refusal codes) lives in
    /// `engine/tests/predicate_admission.rs`, which needs `Dataset::open` and so the fixture
    /// writer.
    fn conn() -> Connection {
        Connection::open_in_memory().expect("in-memory duckdb connection")
    }

    #[test]
    fn a_predicate_over_the_byte_ceiling_is_refused_before_parsing() {
        let long = format!("zone = '{}'", "a".repeat(MAX_PREDICATE_BYTES));
        assert!(long.len() > MAX_PREDICATE_BYTES);
        match structural_admit(&long, &conn()) {
            Err(FilterError::TooLong { limit, saw }) => {
                assert_eq!(limit, MAX_PREDICATE_BYTES as u64);
                assert_eq!(saw, long.len() as u64);
            }
            other => panic!("expected TooLong, got {other:?}"),
        }
    }

    #[test]
    fn a_chained_not_deeper_than_the_ceiling_is_refused_as_too_deep() {
        let depth = MAX_PREDICATE_DEPTH + 8;
        let bomb = format!("{}x{}", "NOT (".repeat(depth), ")".repeat(depth));
        assert!(bomb.len() < MAX_PREDICATE_BYTES, "must trip depth, not the byte ceiling");
        match structural_admit(&bomb, &conn()) {
            Err(FilterError::TooDeep { limit, .. }) => assert_eq!(limit, MAX_PREDICATE_DEPTH as u64),
            other => panic!("expected TooDeep, got {other:?}"),
        }
    }

    #[test]
    fn redundant_grouping_parens_add_no_depth_at_all() {
        // The empirical claim `MAX_PREDICATE_BYTES`'s own doc makes: 400 levels of pure grouping
        // parens around one comparison stays at tree depth 1, so it must be admitted structurally
        // (namespace/bind admission is a different module's job — this only proves depth).
        let n = 400;
        let bomb = format!("{}zone = 'r'{}", "(".repeat(n), ")".repeat(n));
        assert!(bomb.len() < MAX_PREDICATE_BYTES);
        structural_admit(&bomb, &conn()).expect("pure grouping parens must not add tree depth");
    }

    #[test]
    fn a_subquery_is_refused_by_construct_name() {
        match structural_admit("(SELECT 1)", &conn()) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(construct.contains("subquery"), "{construct}");
            }
            other => panic!("expected ConstructNotAdmitted, got {other:?}"),
        }
    }

    #[test]
    fn a_function_call_is_refused_by_construct_name() {
        match structural_admit("random() < 0.5", &conn()) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(construct.contains("random"), "{construct}");
            }
            other => panic!("expected ConstructNotAdmitted, got {other:?}"),
        }
    }

    #[test]
    fn a_group_by_having_breakout_is_refused_even_though_where_clause_alone_looks_innocuous() {
        // Real JSON observed while building this module (`CUT-STATE.md`): `where_clause` alone
        // parses to the innocuous `1=1`, while `group_expressions`/`having` carry a smuggled
        // `count(*)` call. `expect_bare_select_wrapper` must catch this, not `walk_expr`.
        match structural_admit("1=1) GROUP BY 1 HAVING count(*) > 0 --", &conn()) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(construct.contains("GROUP BY"), "{construct}");
            }
            other => panic!("expected ConstructNotAdmitted naming GROUP BY, got {other:?}"),
        }
    }

    #[test]
    fn a_union_breakout_is_refused_because_the_top_level_statement_is_no_longer_a_select() {
        match structural_admit("1=1) UNION SELECT 1 --", &conn()) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(construct.to_uppercase().contains("SET_OPERATION"), "{construct}");
            }
            other => panic!("expected ConstructNotAdmitted naming the set operation, got {other:?}"),
        }
    }

    #[test]
    fn dollar_quoting_is_structurally_indistinguishable_from_a_normal_string_literal() {
        // Documented decision (`CUT-STATE.md`): DuckDB's parser lowers `$$...$$` to the exact same
        // `CONSTANT`/`VALUE_CONSTANT` node a `'...'` literal produces — there is no construct name
        // left to refuse by the time this module ever sees it. Structurally admitted; namespace/bind
        // admission (a different stage, tested in the integration corpus) is what would still
        // refuse it if `x` is not a real column.
        structural_admit("x = $$hi$$", &conn()).expect("dollar-quoted string is a plain literal");
    }

    #[test]
    fn a_trailing_line_comment_breaks_the_wrapper_itself_and_is_refused_as_unparsable() {
        // Documented decision (`CUT-STATE.md`): the wrapper appends its own closing `)` on the same
        // line as the caller's text. A `--` comment eats everything to end of line, including that
        // `)`, so the wrapped statement itself fails to parse — refused as Unparsable, never as "the
        // expression before the comment".
        match structural_admit("1=1 --", &conn()) {
            Err(FilterError::Unparsable { .. }) => {}
            other => panic!("expected Unparsable, got {other:?}"),
        }
    }
}
