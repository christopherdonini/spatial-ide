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
//! AdmittedProjection`]'s discipline applied to a predicate: without it, `build_sql` would take a
//! bare `&str`, and every caller between the SKP boundary and composition would be *trusted* not
//! to have skipped admission — exactly the shape a `docs/09` boundary must not have.

use std::collections::BTreeMap;
use std::fmt;

use arrow::datatypes::{DataType, Field};
use duckdb::Connection;
use serde_json::Value;

use crate::dataset::Dataset;
use crate::envelope::ID_COLUMN;
use crate::error::EngineError;
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
/// **The single-constructor discipline [`crate::attributes::AdmittedProjection`] uses, applied to
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
    /// this crate, on the dataset's own bounded pool (`LeaseClass::Admission` — its own class,
    /// sized to the concurrent admissions a binding can present; see `pool::
    /// MAX_ADMISSION_CONNECTIONS`), so a burst of filter admissions cannot bypass the pool's
    /// declared connection ceiling by minting ad-hoc connections per call.
    ///
    /// **Returns [`PredicateAdmitError`], not a bare [`FilterError`].** Eleven of its twelve admission
    /// refusals (every stage this module implements) still arrive wrapped in
    /// [`PredicateAdmitError::Filter`], unchanged; the thirteenth possibility, a residual admission-
    /// lease exhaustion, is a fact about this pool's capacity, never about the predicate, and is
    /// therefore a sibling variant rather than a thirteenth `FilterError`/`skp.filter_*` case (ADR-021
    /// item 8 stays untouched — see [`PredicateAdmitError`]'s own doc).
    pub fn admit(text: impl Into<String>, dataset: &Dataset) -> Result<Self, PredicateAdmitError> {
        let text = text.into();

        // Cheap, pool-free refusal, checked **before** anything touches the connection pool — an
        // over-length predicate should never cost a lease acquisition. `structural_admit` repeats
        // this same check (it is also called directly, without a pool at all, by this module's own
        // unit tests), so this is a second enforcement of one ceiling, not a second ceiling.
        if text.len() > MAX_PREDICATE_BYTES {
            return Err(FilterError::TooLong {
                limit: MAX_PREDICATE_BYTES as u64,
                saw: text.len() as u64,
            }
            .into());
        }

        // `LeaseClass::Admission`, not `Maintenance` (DECISIONS-PENDING entry 91 (a); PROPOSED
        // ADR-033; `pool::MAX_ADMISSION_CONNECTIONS`'s own doc). Before this class existed,
        // admission shared `Maintenance`'s capacity-1 budget with whole-file passes, so concurrent
        // `viewport_query` admissions collided there and the losers were refused as
        // `FilterError::RejectedByBinder` — a typed refusal naming the wrong cause (the lease, not
        // the predicate's own text). A residual failure here is a fact about this connection
        // pool's admission-class capacity, never a claim about the predicate, so a genuine
        // exhaustion is returned as `EngineError::ConnectionsExhausted` **unchanged** — never
        // folded into `RejectedByBinder` (docs/01 principle 8: the reported cause must be the
        // cause). A failure to configure a *new* physical connection (`EngineError::
        // ConnectionSetup`, a real connection problem, not a capacity one) keeps the previous,
        // still-accurate `RejectedByBinder` text — that substring
        // (`tileViewportStreamManager.ts`'s former `LEASE_REFUSAL_DETAIL_SUBSTRING` match) stays
        // truthful for a genuine connection failure; only the capacity-exhaustion case moves.
        let lease = dataset
            .connections()
            .acquire(LeaseClass::Admission)
            .map_err(|e| match e {
                EngineError::ConnectionsExhausted { class, capacity } => {
                    PredicateAdmitError::ConnectionsExhausted { class, capacity }
                }
                other => FilterError::RejectedByBinder {
                    detail: format!(
                        "no connection was available to validate this predicate: {other}"
                    ),
                }
                .into(),
            })?;
        let conn = lease.connection();

        // Stages 1 and 2 never run anything but `SELECT json_serialize_sql(CAST(? AS VARCHAR))`
        // with the caller's text passed as **bound data**, never executed as SQL — exactly as safe
        // as the pool's own trivial `SELECT 1` verification (`pool.rs::Lease::verify_and_take`'s
        // doc). A refusal at either stage says nothing adverse about the connection itself, so it
        // is released healthy rather than discarded — P5's filter panel calls admission on every
        // keystroke, and destroying and recreating a DuckDB connection per refused keystroke would
        // be a real, avoidable cost.
        let structural = match structural_admit(&text, conn) {
            Ok(structural) => structural,
            Err(e) => {
                lease.release_healthy();
                return Err(e.into());
            }
        };
        let namespace = match namespace_admit(&structural.columns, dataset) {
            Ok(namespace) => namespace,
            Err(e) => {
                // `namespace_admit` never touches `conn` at all — the connection is exactly as
                // clean here as it was right after `structural_admit` succeeded.
                lease.release_healthy();
                return Err(e.into());
            }
        };

        // Stage 3 is different: it actually `prepare()`s and executes a statement built from the
        // (already structurally-admitted) predicate text. Keep the original, more conservative
        // discard-on-failure behavior here — `pool.rs`'s own discipline is "what cannot be
        // confirmed is discarded", and a connection that ran a real prepared statement, even an
        // admitted one, is not the same trivial, data-only call stages 1/2 make.
        bind_admit(&text, &namespace, conn)?;

        // The type walk (§2.1): runs only after `bind_admit` returns `Ok`, over the tree
        // `structural_admit` already parsed — no second parse, no new DuckDB call, no plan read at
        // runtime. A refusal here is a stage-3 refusal, so the lease is discarded exactly as
        // `bind_admit`'s own refusals are (the `?` below never reaches `release_healthy`).
        type_walk(&structural.operands, &namespace)?;

        // Reached only once every stage above returned `Ok`.
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
/// **A deliberate 1:1 correspondence with `NEXT-CUT.md` design essential 5's twelve `skp.filter_*`
/// wire codes, field for field — not a coincidence.** P4 maps each variant to its SKP code by name;
/// a thirteenth variant here would be inventing wire taxonomy this crate does not own (correction
/// round 2, W10; architect B7, reviewer B7). Every match on
/// this enum in this module is exhaustive, with no wildcard arm, for the same reason.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum FilterError {
    /// The predicate declared a dialect other than the one this engine admits.
    ///
    /// **Not constructible by [`AdmittedPredicate::admit`] today.** `protocol/skp`'s `Filter::new`
    /// already refuses any dialect but `duckdb-expr/0` at the wire boundary, before predicate text
    /// ever reaches this crate (`CUT-STATE.md` P1). This variant exists only so `FilterError`'s
    /// twelve arms match the SKP taxonomy exactly, so a later exhaustive match never needs a
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
    IdentityAliasAmbiguous {
        column: String,
        source_column: String,
    },

    /// The predicate binds, but its inferred type is not `BOOLEAN`. An int-to-bool (or any other)
    /// implicit coercion is refused rather than silently applied (`docs/01` principle 8).
    NotBoolean { inferred_type: String },

    /// The predicate's own text exceeded [`MAX_PREDICATE_BYTES`].
    TooLong { limit: u64, saw: u64 },

    /// The predicate's parsed expression tree exceeded [`MAX_PREDICATE_DEPTH`].
    TooDeep { limit: u64, saw: u64 },

    /// Structural and namespace admission both passed, but DuckDB's own binder refused the
    /// predicate against the surrogate relation ([`bind_admit`]) — or a *new* physical connection
    /// to run that check on could not be configured ([`AdmittedPredicate::admit`]'s own doc:
    /// `EngineError::ConnectionSetup`, a genuine connection problem, still folds in here). **Never**
    /// an admission-lease capacity failure: since DECISIONS-PENDING entry 91 (a) / PROPOSED
    /// ADR-033, that residual case is [`PredicateAdmitError::ConnectionsExhausted`], a sibling of
    /// this enum, not a variant of it — a lease being unavailable says nothing about this
    /// predicate's own text, and this variant's own wire mapping (`skp.filter_rejected_by_binder`)
    /// must not be minted for it.
    RejectedByBinder { detail: String },

    /// The predicate's binding needs an implicit coercion outside the admitted class the type walk
    /// declares (§2 of `engine/FILTER-BIND-COERCIONS-PREREGISTRATION.md`, as amended) — a
    /// comparison, junction or arithmetic operator whose operand types the walk does not admit.
    /// Refused synchronously, in stage 3, after [`bind_admit`]'s own BOOLEAN check succeeds and
    /// before any lease or mint. Carries no value read from the file: `construct`, `operand_types`
    /// and `reason` are built from types, the operator and the reason only (§2.6).
    TypeNotAdmitted {
        /// The operator's canonical spelling (§2.6's declared map).
        construct: String,
        /// The first refused pair's rendered types, in tree order — or the single operand of a
        /// junction (`AND`/`OR`/`NOT`). Joined with `"; "` on the wire (a `DECIMAL` name carries a
        /// comma).
        operand_types: Vec<String>,
        /// One of [`TypeRefusalReason`]'s five fixed wire values, in the precedence §2.6 (as
        /// amended by §10 Amendment 1) states.
        reason: TypeRefusalReason,
    },
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
            Self::ColumnNotFilterable { column, reason } => write!(
                f,
                "refused: `{}` cannot be filtered on — {reason}",
                crate::addressability::render_visible_escape(column)
            ),
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
            Self::TypeNotAdmitted { construct, operand_types, reason } => write!(
                f,
                "refused: `{construct}` over {}: {} (docs/01 principle 8)",
                operand_types.join(" and "),
                reason.sentence(),
            ),
        }
    }
}

/// Every way [`AdmittedPredicate::admit`] can fail.
///
/// **Why this is not a bare [`FilterError`].** `FilterError`'s twelve variants are a deliberate,
/// closed, 1:1 correspondence with the wire's `skp.filter_*` taxonomy (this module's own doc,
/// above) — every one of them is a claim about the *predicate's own text*. An admission-lease
/// capacity failure (DECISIONS-PENDING entry 91 (a); ADR-033 (accepted 2026-09-14)) is not that kind of claim
/// at all: it is a fact about this dataset's connection pool, true or false independent of what
/// the caller wrote. Folding it into `FilterError::RejectedByBinder` — the only shape available
/// before this type existed — was exactly the defect entry 87 diagnosed: a typed refusal naming
/// the wrong cause. Giving it a twelfth `FilterError` arm was rejected in the same review that
/// added this type, for the same reason `FilterError`'s own doc gives for staying at twelve: it
/// would be inventing wire taxonomy this crate does not own (no new `skp.filter_*` code, ADR-021
/// item 8) merely to carry information that was never about the wire's filter taxonomy to begin
/// with. This type carries both without conflating them.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum PredicateAdmitError {
    /// One of [`FilterError`]'s twelve admission-content refusals, unchanged.
    Filter(FilterError),
    /// [`crate::pool::LeaseClass::Admission`] had no free lease when this call needed one.
    ///
    /// **Never [`FilterError::RejectedByBinder`].** Nothing about the predicate's text was
    /// examined; DuckDB's binder was never reached. `class` and `capacity` are the same fields
    /// `EngineError::ConnectionsExhausted` already carries (`kernel/src/skp.rs`'s existing
    /// `engine.connections_exhausted` mapping) — this variant is that fact, not a rewrapped one.
    /// Composition-unreachable for the shipped shell at the declared ceiling
    /// (`pool::MAX_ADMISSION_CONNECTIONS`'s own doc); recorded here as raw material for ADR-014,
    /// citable as evidence for nothing else.
    ConnectionsExhausted {
        class: &'static str,
        capacity: usize,
    },
}

impl fmt::Display for PredicateAdmitError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Filter(e) => fmt::Display::fmt(e, f),
            Self::ConnectionsExhausted { class, capacity } => write!(
                f,
                "refused: no `{class}`-class connection lease was free (capacity {capacity}) — a \
                 pool capacity fact, not a refusal of the predicate's own text"
            ),
        }
    }
}

impl From<FilterError> for PredicateAdmitError {
    fn from(e: FilterError) -> Self {
        Self::Filter(e)
    }
}

// **No `From<PredicateAdmitError> for FilterError`, deliberately, and it may not come back.**
// An earlier cut carried one so that `kernel/src/skp.rs`'s `build_viewport_query` — whose `Result`
// was then pinned to `FilterError` — kept compiling unchanged. That fold was the defect the gate
// reports of 2026-09-14 named: it rewrote `ConnectionsExhausted` into
// `FilterError::RejectedByBinder`, which the kernel then mapped to `skp.filter_rejected_by_binder`
// — precisely the false binder refusal the ruling of 2026-09-13 (DECISIONS-PENDING entry 91 (a))
// forbids. `build_viewport_query` now returns `PredicateAdmitError` itself and the kernel *matches*
// on it (`kernel::skp::predicate_admit_error_of`), routing the residual through the existing
// `engine.connections_exhausted` arm. A caller that needs one kind or the other matches on the
// enum; re-adding a lossy fold here would restore the defect, not a convenience.

impl std::error::Error for FilterError {}

// ---------------------------------------------------------------------------------------------
// Stage 1 — structural admission
// ---------------------------------------------------------------------------------------------

/// The two literal comparisons this module appends, on two **separate** parses of the same
/// predicate, standing in for the real `<bbox>` condition `stream.rs::build_sql` appends in the
/// identical position (`(<predicate>) AND <bbox>`). See [`wrap_with`] and
/// [`differential_operands`] for the full rationale — a single fixed sentinel (this module's first
/// fix attempt) is **forgeable**: a predicate can write its own trailing `1=1` and use a same-line
/// comment to eat the wrapper's real, appended `) AND 1=1` in both admission and composition
/// identically, so "last child is *a* `1=1` comparison" cannot tell the forgery from the real
/// sentinel. Two sentinels that **differ from each other** cannot both be forged by one text at
/// the same textual position, which is the property this module now actually relies on.
const SENTINEL_A: &str = "1=1";
const SENTINEL_A_VALUE: i64 = 1;
const SENTINEL_B: &str = "2=2";
const SENTINEL_B_VALUE: i64 = 2;

/// Wrap `predicate` in the fixed template this module standardizes on (`CUT-STATE.md` P0),
/// appending `sentinel` as the `AND`-conjoined right neighbour real composition
/// (`stream.rs::build_sql`, `(<predicate>) AND <bbox>`) always supplies in that position.
/// [`differential_operands`] calls this twice, once per sentinel in [`SENTINEL_A`]/[`SENTINEL_B`],
/// and requires both parses to agree — see that function's doc for why one sentinel alone is not
/// enough.
fn wrap_with(predicate: &str, sentinel: &str) -> String {
    format!("SELECT 1 WHERE ({predicate}) AND {sentinel}")
}

/// Ask DuckDB's own parser (`json_serialize_sql`) what `wrapped` parses to.
///
/// **Never a hand-rolled SQL lexer** (`NEXT-CUT.md` P0's own instruction). The predicate text is
/// always bound as `CAST(? AS VARCHAR)`, never string-concatenated into the query — `CUT-STATE.md`
/// P0 found the bare `?` form fails to bind at all, and string concatenation here would defeat the
/// entire admission this module exists to perform.
fn serialize_sql(wrapped: &str, conn: &Connection) -> Result<Value, FilterError> {
    let sql = "SELECT json_serialize_sql(CAST(? AS VARCHAR))";
    let json_text: String = conn
        .query_row(sql, [wrapped], |row| row.get(0))
        .map_err(|e| FilterError::Unparsable {
            detail: format!("json_serialize_sql could not be called: {e}"),
        })?;
    serde_json::from_str(&json_text).map_err(|e| FilterError::Unparsable {
        detail: format!("json_serialize_sql returned JSON this module could not parse: {e}"),
    })
}

/// Stage 1's result (§2.2): every column name the walk collected (stage 2's input), and the
/// admitted operand trees themselves, parsed once — stage 3's type walk consumes `operands`
/// directly, issuing no second parse and no new DuckDB call (§2.1, §8 item 4).
#[derive(Debug)]
struct StructuralAdmission {
    columns: Vec<String>,
    operands: Vec<Value>,
}

/// Structural admission (stage 1). Parses `predicate` **twice**, differentially (see
/// [`differential_operands`]), walks the returned operands against the declared allowlist, and
/// returns every column name the walk collected (for stage 2) together with the operand trees
/// (for stage 3's type walk). Enforces [`MAX_PREDICATE_BYTES`] before parsing at all, and
/// [`MAX_PREDICATE_DEPTH`] during the walk.
fn structural_admit(
    predicate: &str,
    conn: &Connection,
) -> Result<StructuralAdmission, FilterError> {
    if predicate.len() > MAX_PREDICATE_BYTES {
        return Err(FilterError::TooLong {
            limit: MAX_PREDICATE_BYTES as u64,
            saw: predicate.len() as u64,
        });
    }

    let operands = differential_operands(predicate, conn)?;
    if operands.is_empty() {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "an empty predicate (nothing but this module's own AND-sentinel)"
                .to_string(),
        });
    }

    let mut columns = Vec::new();
    // Each operand is walked at depth 1, as if it were the top of the caller's own predicate —
    // deliberately *not* depth 2 under an implied top-level AND, because that AND is this module's
    // own sentinel wrapping, not something the caller wrote. See `differential_operands`'s doc for
    // the one place this reads slightly more generously than before for a predicate whose own top
    // level is itself a bare `AND` chain (DuckDB flattens it together with the sentinel's own
    // `AND`, so what used to be one `CONJUNCTION` node at depth 1 is now several operands each
    // starting fresh at depth 1) — not a security gap, since [`MAX_PREDICATE_DEPTH`]'s ceiling has
    // headroom to spare and every operand is still walked and admitted independently.
    for operand in &operands {
        walk_expr(operand, 1, &mut columns)?;
    }
    Ok(StructuralAdmission { columns, operands })
}

/// Parse `predicate` wrapped with `sentinel` appended (`wrap_with`) and, if the wrapper's own fixed
/// shape is intact (every field `expect_wrapper_shape` checks, plus a top-level
/// `CONJUNCTION`/`CONJUNCTION_AND` `where_clause`), return **every** child of that top-level `AND`
/// — sentinel included, owned, for the caller ([`differential_operands`]) to compare across two
/// independent parses. Everything that used to be one function (`expect_bare_select_wrapper`, this
/// module's original name) is now shared, single-parse plumbing that [`differential_operands`]
/// calls twice.
fn parse_and_children(
    predicate: &str,
    sentinel: &str,
    conn: &Connection,
) -> Result<Vec<Value>, FilterError> {
    let payload = serialize_sql(&wrap_with(predicate, sentinel), conn)?;

    // `CUT-STATE.md` P0: a malformed inner SQL string never surfaces as a Rust `Err` from the call
    // above — it succeeds at the SQL-execution layer and reports its own failure *inside* the JSON
    // payload's `"error"` field, which is what this checks. A missing or non-boolean `"error"` key
    // is treated the same as `true` — refuse-by-default, never admit what the payload did not
    // affirmatively say was `false`.
    if payload
        .get("error")
        .and_then(Value::as_bool)
        .unwrap_or(true)
    {
        let detail = payload
            .get("error_message")
            .and_then(Value::as_str)
            .unwrap_or("json_serialize_sql reported an error with no error_message field")
            .to_string();
        return Err(FilterError::Unparsable { detail });
    }

    let statements = payload
        .get("statements")
        .and_then(Value::as_array)
        .ok_or_else(|| FilterError::Unparsable {
            detail: "json_serialize_sql's payload carries no `statements` array".to_string(),
        })?;
    if statements.len() != 1 {
        return Err(FilterError::NotASingleExpression {
            statements: statements.len(),
        });
    }
    let stmt = &statements[0];
    refuse_unknown_keys(stmt, KNOWN_STATEMENT_KEYS, "statement")?;

    // Defense in depth: a `?`/`$1` placeholder reaching *anywhere* in the wrapped statement shows
    // up here too, not only as a `PARAMETER` node the walk below would refuse on its own.
    if !matches!(stmt.get("named_param_map").and_then(Value::as_array), Some(a) if a.is_empty()) {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a bind parameter (the statement's named_param_map is non-empty)"
                .to_string(),
        });
    }

    let node = stmt
        .get("node")
        .ok_or_else(|| FilterError::ConstructNotAdmitted {
            construct: "a statement with no `node`".to_string(),
        })?;
    let children = expect_wrapper_shape(node)?;
    Ok(children.clone())
}

/// **The differential two-sentinel probe — B1's final fix, superseding the single-sentinel check.**
///
/// A re-review demonstrated the single-sentinel wrapper (`SELECT 1 WHERE (<predicate>) AND 1=1`,
/// this module's first B1 fix attempt) was still escapable: `1=1) AND 1=1 --` **forges** the
/// sentinel by writing its own trailing `1=1`, then uses a same-line `--` comment to eat the
/// wrapper's real, appended `) AND 1=1` — in admission *and* in composition identically, since both
/// append the same suffix on the same line. The single check ("last child is *a* `1=1`
/// comparison") cannot distinguish the caller's forged `1=1` from this module's real one, because
/// nothing about a `1=1` node says who wrote it.
///
/// **The fix: parse the same predicate twice, with two *different* sentinels, and require both
/// parses to agree on everything except the sentinel itself.** [`SENTINEL_A`] (`1=1`) and
/// [`SENTINEL_B`] (`2=2`) are appended on two separate calls to [`parse_and_children`]. For
/// admission to pass:
///
/// 1. Both parses must independently pass every wrapper-shape check (`expect_wrapper_shape`) and
///    resolve to a top-level `CONJUNCTION_AND`.
/// 2. Probe A's **last** child must be exactly `1=1`; probe B's **last** child must be exactly
///    `2=2`. (**Not** "exactly two children" — DuckDB flattens n-ary `AND`, so `(a AND b) AND 1=1`
///    is one 3-ary `AND [a, b, sentinel]`; the check is "last child is the sentinel value this
///    probe expects", which holds regardless of how many operands precede it.)
/// 3. Every child **except the last** must be identical, JSON-value-for-JSON-value, in the same
///    order, between the two parses.
///
/// **Why this is sound against the whole escape class, not just the two shapes already found.** A
/// rightward escape — a comment, a semicolon, or an unbalanced paren — truncates or reassociates
/// the wrapped text at some point. Whatever that point is, it is *identical* between probe A and
/// probe B, because `wrap_with`'s two outputs differ **only** in their final three characters (the
/// sentinel's own digits) — everything before that, including the caller's entire predicate text
/// and this module's own added `) AND `, is byte-for-byte the same string in both probes. So an
/// escape that truncates before reaching the sentinel truncates *both* probes at the same point,
/// producing the same tree for both (rule 3 fails only if it produced different last-children by
/// coincidence, but rule 2 already fails first: a truncated tree cannot independently end in both a
/// real `1=1` *and* a real `2=2`, because whatever is truncated to is the same text read twice, and
/// no single text is simultaneously `1=1`-shaped and `2=2`-shaped). An escape that reassociates
/// (`... ) OR (1=1`) produces a top-level `CONJUNCTION_OR` in both probes identically, refused by
/// rule 1. **No single predicate text can end in `1=1` for probe A and `2=2` for probe B at the
/// same textual position** — that is the property this check actually relies on, not an enumerated
/// list of shapes. Combined with the existing refuse-by-default allowlist walk (`walk_expr`) over
/// whatever operands survive, this closes the paren, comment, and semicolon escape classes
/// uniformly: this module is no longer enumerating escape shapes, it is checking that its own
/// appended conjunct provably survived to the last position, under a name the caller could not have
/// forged.
///
/// **Empirically confirmed** (probe built, run, and deleted before commit — evidence retained at
/// `target/slice-evidence/sql-filter/logs/p3-probe-differential.log`) to refuse every one of
/// `1=1) AND 1=1 --`, `1=1) AND 1=1 ;--`, `1=1) AND 1=1 /*`, `1=1) OR (1=1`, `1=1) --`,
/// `zone='x') AND 1=1 --`, `1=1) AND 1=1 /* x */`, and to admit every one of `zone='residential'`,
/// `id BETWEEN 5 AND 10`, `a=1 AND b=2 AND c=3`, `NOT (x>3 OR y<2)`, and — the case that would prove
/// this check too strict if it failed — `id > 3 AND 1=1`, a benign predicate whose *own* text
/// legitimately ends in `1=1`: probe A's operands flatten to `[id>3, caller's 1=1, sentinel 1=1]`
/// and probe B's to `[id>3, caller's 1=1, sentinel 2=2]` — both end in the *correct* sentinel for
/// their own probe, and the two preceding-operand lists (`[id>3, caller's 1=1]`) are identical, so
/// this admits, and the caller's own harmless `1=1` rides through to the allowlist walk like any
/// other admitted comparison.
fn differential_operands(predicate: &str, conn: &Connection) -> Result<Vec<Value>, FilterError> {
    let children_a = parse_and_children(predicate, SENTINEL_A, conn)?;
    let children_b = parse_and_children(predicate, SENTINEL_B, conn)?;

    let mismatch = |detail: &str| FilterError::ConstructNotAdmitted {
        construct: format!(
            "the predicate does not provably compose with this module's own AND-sentinel the way \
             real composition, `(<predicate>) AND <bbox>`, would ({detail}) — the caller's text \
             re-associated, truncated, or forged a sentinel across the paren this module added"
        ),
    };

    let last_a = children_a
        .last()
        .ok_or_else(|| mismatch("probe A's top-level AND has no operands"))?;
    let last_b = children_b
        .last()
        .ok_or_else(|| mismatch("probe B's top-level AND has no operands"))?;

    if !is_integer_equality_sentinel(last_a, SENTINEL_A_VALUE) {
        return Err(mismatch(
            "probe A's last operand is not this module's own 1=1 sentinel",
        ));
    }
    if !is_integer_equality_sentinel(last_b, SENTINEL_B_VALUE) {
        return Err(mismatch(
            "probe B's last operand is not this module's own 2=2 sentinel",
        ));
    }

    let preceding_a = &children_a[..children_a.len() - 1];
    let preceding_b = &children_b[..children_b.len() - 1];
    if preceding_a != preceding_b {
        return Err(mismatch(
            "the two differentially-sentineled parses disagree on everything before the sentinel",
        ));
    }

    Ok(preceding_a.to_vec())
}

/// Every key `json_serialize_sql` puts on a wrapped statement's top-level `node`
/// (`SELECT_NODE`), confirmed against real output while building this module — twelve, exactly.
/// See [`refuse_unknown_keys`].
const KNOWN_SELECT_NODE_KEYS: &[&str] = &[
    "type",
    "modifiers",
    "cte_map",
    "select_list",
    "from_table",
    "where_clause",
    "group_expressions",
    "group_sets",
    "aggregate_handling",
    "having",
    "sample",
    "qualify",
];

/// Every key `json_serialize_sql` puts on one entry of the top-level `statements` array — two.
/// See [`refuse_unknown_keys`].
const KNOWN_STATEMENT_KEYS: &[&str] = &["node", "named_param_map"];

/// Refuse `value` if it carries any object key **outside** `known`.
///
/// **Hardening against version drift, not a present hole** — every key `json_serialize_sql`
/// produces today, at both the statement level and the `SELECT_NODE` level, is already checked
/// explicitly by name elsewhere in this module. This exists so a *future* DuckDB version that adds
/// a new clause (a new key this module has never seen and so has no explicit check for) is refused
/// by default rather than silently passed through unexamined — the same allowlist-shaped,
/// refuse-what-you-cannot-name discipline [`walk_expr`] applies to expression nodes, applied here
/// to the wrapper's own shape.
fn refuse_unknown_keys(value: &Value, known: &[&str], what: &str) -> Result<(), FilterError> {
    match value.as_object() {
        Some(obj) => {
            for key in obj.keys() {
                if !known.contains(&key.as_str()) {
                    return Err(FilterError::ConstructNotAdmitted {
                        construct: format!(
                            "an unrecognized {what} key `{key}` — a shape this module does not \
                             know how to check, refused rather than silently passed"
                        ),
                    });
                }
            }
            Ok(())
        }
        None => Err(FilterError::ConstructNotAdmitted {
            construct: format!("a malformed {what} (not a JSON object)"),
        }),
    }
}

/// Is `node` an equality comparison of the literal integer `value` against itself (`1=1`, `2=2`,
/// ...) — used once per probe in [`differential_operands`], against that probe's own expected
/// sentinel value, never against a fixed constant a caller's own text could coincidentally produce
/// and have accepted as this module's.
fn is_integer_equality_sentinel(node: &Value, value: i64) -> bool {
    node.get("class").and_then(Value::as_str) == Some("COMPARISON")
        && node.get("type").and_then(Value::as_str) == Some("COMPARE_EQUAL")
        && is_integer_constant(node.get("left"), value)
        && is_integer_constant(node.get("right"), value)
}

fn is_integer_constant(node: Option<&Value>, value: i64) -> bool {
    match node {
        Some(n) => {
            n.get("class").and_then(Value::as_str) == Some("CONSTANT")
                && n.get("value")
                    .and_then(|v| v.get("value"))
                    .and_then(Value::as_i64)
                    == Some(value)
        }
        None => false,
    }
}

/// Assert that `node` (the top-level parsed `SELECT_NODE`) is **exactly** this module's own
/// `SELECT 1 WHERE ( <predicate> ) AND <sentinel>` wrapper, with nothing else attached anywhere
/// else in the statement, and return **every** child of the top-level `AND` — sentinel included —
/// for [`differential_operands`] to compare across its two independent parses.
///
/// **This function checks the wrapper's fixed shape only; it does not, and cannot on its own,
/// decide which child is the sentinel** — that requires knowing *which* sentinel this particular
/// parse used, which only [`differential_operands`] (the caller, holding both parses) can compare.
/// What this function alone closes: the wrapper's *other* fields (everything but `where_clause`)
/// must be exactly the fixed template's own — this is what refuses a `GROUP BY`/`HAVING`/`UNION`
/// breakout (`1=1) GROUP BY 1 HAVING count(*) > 0 --` parses to **one** valid `SELECT_NODE` whose
/// `where_clause` is an innocuous `1=1`, while `group_expressions`/`having` carry the smuggled
/// `count(*)` — real JSON observed while building this module, recorded in `CUT-STATE.md`) — and
/// `where_clause` itself must be a top-level `CONJUNCTION`/`CONJUNCTION_AND` (refusing a
/// reassociation like `... ) OR (1=1`, whose top level is `CONJUNCTION_OR`, or a comment-eaten
/// `1=1) --`, whose `where_clause` is a bare `COMPARISON`, not even a `CONJUNCTION`). **Neither of
/// those alone is enough** — see [`differential_operands`]'s doc for the escape (a forged trailing
/// `1=1` plus a same-line comment) that a single-sentinel version of this same shape check missed,
/// and the fix.
fn expect_wrapper_shape(node: &Value) -> Result<&Vec<Value>, FilterError> {
    let node_type = node
        .get("type")
        .and_then(Value::as_str)
        .unwrap_or("<missing type>");
    if node_type != "SELECT_NODE" {
        return Err(FilterError::ConstructNotAdmitted {
            construct: format!("a top-level statement of type `{node_type}`, not a bare SELECT"),
        });
    }
    refuse_unknown_keys(node, KNOWN_SELECT_NODE_KEYS, "SELECT_NODE")?;

    let empty_array =
        |key: &str| matches!(node.get(key).and_then(Value::as_array), Some(a) if a.is_empty());
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
    let select_list = node
        .get("select_list")
        .and_then(Value::as_array)
        .ok_or_else(|| FilterError::ConstructNotAdmitted {
            construct: "a malformed select_list".to_string(),
        })?;
    if select_list.len() != 1
        || select_list[0].get("class").and_then(Value::as_str) != Some("CONSTANT")
    {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "the wrapper's own `SELECT 1` was altered".to_string(),
        });
    }
    if node
        .get("from_table")
        .and_then(|t| t.get("type"))
        .and_then(Value::as_str)
        != Some("EMPTY")
    {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a FROM clause".to_string(),
        });
    }
    if !empty_array("group_expressions") || !empty_array("group_sets") {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a GROUP BY clause".to_string(),
        });
    }
    if node.get("aggregate_handling").and_then(Value::as_str) != Some("STANDARD_HANDLING") {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "non-standard aggregate handling".to_string(),
        });
    }
    if !is_null("having") {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a HAVING clause".to_string(),
        });
    }
    if !is_null("sample") {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a SAMPLE clause".to_string(),
        });
    }
    if !is_null("qualify") {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "a QUALIFY clause".to_string(),
        });
    }

    let where_clause = match node.get("where_clause") {
        Some(w) if !w.is_null() => w,
        _ => {
            return Err(FilterError::ConstructNotAdmitted {
                construct: "an empty predicate (no WHERE expression at all)".to_string(),
            })
        }
    };

    // Top-level shape check only — *which* child is the sentinel is [`differential_operands`]'s
    // question, not this function's; it holds both parses and this one holds only one of them.
    if where_clause.get("class").and_then(Value::as_str) != Some("CONJUNCTION")
        || where_clause.get("type").and_then(Value::as_str) != Some("CONJUNCTION_AND")
    {
        return Err(FilterError::ConstructNotAdmitted {
            construct: "the predicate does not compose with this module's own AND-sentinel the \
                        way real composition, `(<predicate>) AND <bbox>`, would — the caller's \
                        text re-associated across the paren this module added"
                .to_string(),
        });
    }
    expect_children(where_clause)
}

/// Read `node`'s `children` array, refusing (by construct) any node whose shape does not carry one.
fn expect_children(node: &Value) -> Result<&Vec<Value>, FilterError> {
    node.get("children")
        .and_then(Value::as_array)
        .ok_or_else(|| FilterError::ConstructNotAdmitted {
            construct: "a node with no `children` array".to_string(),
        })
}

fn missing_field(what: &str) -> FilterError {
    FilterError::ConstructNotAdmitted {
        construct: format!("a node missing `{what}`"),
    }
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
        FilterError::ConstructNotAdmitted {
            construct: "an expression node with no `class`".to_string(),
        }
    })?;

    match class {
        // A literal. Nothing to admit or collect — dollar-quoted strings (`$$...$$`) parse to this
        // same node, indistinguishable from a single-quoted string at this level; see
        // `CUT-STATE.md`'s comment-handling entry for the corresponding documented decision.
        "CONSTANT" => Ok(()),

        "COLUMN_REF" => {
            let names = node
                .get("column_names")
                .and_then(Value::as_array)
                .ok_or_else(|| FilterError::ConstructNotAdmitted {
                    construct: "a COLUMN_REF with no column_names".to_string(),
                })?;
            if names.len() != 1 {
                return Err(FilterError::ConstructNotAdmitted {
                    construct:
                        "a qualified column reference (table.column) — this predicate names \
                                no table"
                            .to_string(),
                });
            }
            let name = names[0]
                .as_str()
                .ok_or_else(|| FilterError::ConstructNotAdmitted {
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
            let left = node
                .get("left")
                .ok_or_else(|| missing_field("COMPARISON.left"))?;
            let right = node
                .get("right")
                .ok_or_else(|| missing_field("COMPARISON.right"))?;
            walk_expr(left, depth + 1, columns)?;
            walk_expr(right, depth + 1, columns)
        }

        // `x BETWEEN lower AND upper`.
        "BETWEEN" => {
            let input = node
                .get("input")
                .ok_or_else(|| missing_field("BETWEEN.input"))?;
            let lower = node
                .get("lower")
                .ok_or_else(|| missing_field("BETWEEN.lower"))?;
            let upper = node
                .get("upper")
                .ok_or_else(|| missing_field("BETWEEN.upper"))?;
            walk_expr(input, depth + 1, columns)?;
            walk_expr(lower, depth + 1, columns)?;
            walk_expr(upper, depth + 1, columns)
        }

        // `NOT`, `IS [NOT] NULL`, and (DuckDB models it here too) `IN` with a literal list.
        "OPERATOR" => {
            let op_type = node
                .get("type")
                .and_then(Value::as_str)
                .unwrap_or("<missing type>");
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
            let name = node
                .get("function_name")
                .and_then(Value::as_str)
                .unwrap_or("<missing name>");
            let is_operator = node
                .get("is_operator")
                .and_then(Value::as_bool)
                .unwrap_or(false);
            let children = expect_children(node)?;

            if is_operator && ADMITTED_ARITHMETIC_FUNCTIONS.contains(&name) {
                for child in children {
                    walk_expr(child, depth + 1, columns)?;
                }
                Ok(())
            } else if is_operator && ADMITTED_PATTERN_FUNCTIONS.contains(&name) {
                if children.len() != 2 {
                    return Err(FilterError::ConstructNotAdmitted {
                        construct: format!(
                            "`{name}` (LIKE/ILIKE) with {} operand(s)",
                            children.len()
                        ),
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

        "CAST" => Err(FilterError::ConstructNotAdmitted {
            construct: "CAST".to_string(),
        }),
        "SUBQUERY" => Err(FilterError::ConstructNotAdmitted {
            construct: "a subquery".to_string(),
        }),
        "PARAMETER" => Err(FilterError::ConstructNotAdmitted {
            construct: "a bind parameter placeholder".to_string(),
        }),
        "STAR" => Err(FilterError::ConstructNotAdmitted {
            construct: "a star expression".to_string(),
        }),

        other => Err(FilterError::ConstructNotAdmitted {
            construct: format!(
                "an unrecognized node class `{other}` — refused, never admitted, \
                                 because this module cannot name what it would be admitting"
            ),
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
            let file_has_its_own_id = dataset
                .file_schema()
                .fields()
                .iter()
                .any(|f| f.name() == ID_COLUMN);
            file_has_its_own_id.then(|| (ID_COLUMN.to_string(), column.clone()))
        }
        _ => None,
    }
}

/// Namespace admission (stage 2). Every name `structural_admit` collected is checked against
/// `dataset`'s resident `file_schema()`, minus the geometry column, minus any dictionary-encoded
/// column (excluded by name — round 17 item 3; ADR-021 Note 2026-09-24 — whatever its value type),
/// minus any column whose type fails [`crate::attributes::admit_attribute_type`], plus the
/// identity-alias rule above. Returns the admitted namespace (name → **surrogate**, the DuckDB type
/// name [`filter_surrogate`] computed) for stage 3 to build its surrogate relation from.
///
/// **X5 (Amendment 5, row 5.6; O4).** The surrogate is computed once, here, and carried — never
/// recomputed by [`bind_admit`], which only reads what this function already decided. A column
/// whose type has no surrogate is refused *here*, by name, as `filter_column_not_filterable` (O4's
/// own recommendation), for every column the predicate actually referenced; a column nothing
/// referenced simply does not enter the namespace (the same non-event the dictionary exclusion
/// already was before this fix, and still is).
fn namespace_admit(
    columns: &[String],
    dataset: &Dataset,
) -> Result<BTreeMap<String, &'static str>, FilterError> {
    let geometry_column = dataset.geometry_column();
    let alias = identity_alias_ambiguity(dataset);

    let mut namespace = BTreeMap::new();
    for field in dataset.file_schema().fields() {
        let name = field.name().as_str();
        if name == geometry_column {
            continue;
        }
        // **X5: no duplicate dictionary exclusion here.** [`filter_surrogate`] (via
        // [`filterable_column_type`]) is the one place that checks it now — a column nothing
        // referenced that lacks a surrogate for any reason, dictionary-encoded or otherwise, is
        // simply not added, exactly as it was skipped before.
        if let Ok(surrogate) = filter_surrogate(name, field) {
            namespace.insert(name.to_string(), surrogate);
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
        match dataset
            .file_schema()
            .fields()
            .iter()
            .find(|f| f.name() == name)
        {
            None => {
                return Err(FilterError::UnknownColumn {
                    column: name.clone(),
                })
            }
            // The referenced column's own surrogate is required to exist (O4) — this is where a
            // "no surrogate" refusal actually fires for a column that matters to this predicate.
            Some(field) => {
                filter_surrogate(name, field)?;
            }
        }
    }

    Ok(namespace)
}

/// Whether `name` (with file-schema field `field`) may be filtered on — the per-column check
/// `namespace_admit` runs for every declared name, extracted so it is provable over a
/// **constructed** `Field` without a `Dataset` (E-19; O6). A dictionary-encoded parquet column is
/// unreachable through `read_parquet` in the pinned DuckDB (H2, confirmed), so a real `Dataset`
/// carrying one cannot exist to test this against; this function is what a test calls instead,
/// exactly as `stream::decode_dictionary_chunk_column` is (E-12's same accepted pattern).
fn filterable_column_type(name: &str, field: &Field) -> std::result::Result<DataType, FilterError> {
    // **§10 Amendment 12, 12.1(d); test N-5.** A name that does not round-trip is left out of the
    // filter namespace before any other check — including the dictionary exclusion below — because
    // no SQL statement can address it at all, dictionary or not.
    if let Some(fact) = crate::addressability::not_addressable_for_field(field) {
        return Err(FilterError::ColumnNotFilterable {
            column: name.to_string(),
            reason: fact.render(),
        });
    }
    // **ADR-021 Note 2026-09-24; round 17 item 3.** Refused by name, before the type gate ever
    // runs — the gate now *admits* a dictionary (emitted as its value type), and the filter
    // namespace deliberately does not follow it there.
    if matches!(field.data_type(), DataType::Dictionary(_, _)) {
        return Err(FilterError::ColumnNotFilterable {
            column: name.to_string(),
            reason: format!(
                "type is {}. This column is dictionary-encoded, and dictionary-encoded columns are \
                 excluded from the filter namespace",
                field.data_type()
            ),
        });
    }
    crate::attributes::admit_attribute_type(name, field.data_type()).map_err(|e| {
        FilterError::ColumnNotFilterable {
            column: name.to_string(),
            reason: e.to_string(),
        }
    })
}

/// The DuckDB surrogate type name for `field`, if the filter namespace admits it — one function
/// combining [`filterable_column_type`]'s gate (the dictionary exclusion, then
/// [`crate::attributes::admit_attribute_type`]) with the DuckDB-side name ([`duckdb_type_name`]), so
/// a column's surrogate is computed exactly once and [`namespace_admit`] can carry it (X5; O4) —
/// [`bind_admit`] never recomputes it.
fn filter_surrogate(name: &str, field: &Field) -> std::result::Result<&'static str, FilterError> {
    let emitted = filterable_column_type(name, field)?;
    duckdb_type_name(&emitted).ok_or_else(|| FilterError::ColumnNotFilterable {
        column: name.to_string(),
        reason: format!(
            "type is {emitted}, which this namespace admits but has no DuckDB surrogate type to \
             bind against — [B1 close placeholder]"
        ),
    })
}

// ---------------------------------------------------------------------------------------------
// Stage 3 — bind admission
// ---------------------------------------------------------------------------------------------

/// The DuckDB type name to `CAST(NULL AS ...)` a column of Arrow type `ty` as, for the surrogate
/// relation. `None` for a type the filter namespace never admits (F1: it must cover every type
/// [`namespace_admit`] can put in the namespace, with no gap left to an `.expect()`).
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
        // **F1 (round 17 item 3; ADR-021 Note 2026-09-24).** The gate now admits `Float32` for
        // filtering; DuckDB's `REAL` is its own 32-bit float type, and H5 (P0) confirmed a stored
        // `REAL` compares against a decimal literal by casting the literal to `REAL`, never by
        // widening the column to `DOUBLE`.
        D::Float32 => Some("REAL"),
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
///
/// **X5 (Amendment 5, row 5.6; O4).** `namespace` already carries each column's surrogate —
/// [`namespace_admit`] computed and, for every referenced column, admitted it. This function reads
/// that decision; it never calls [`duckdb_type_name`] or refuses a missing surrogate itself.
fn bind_admit(
    predicate: &str,
    namespace: &BTreeMap<String, &'static str>,
    conn: &Connection,
) -> Result<(), FilterError> {
    let quote = |s: &str| format!("\"{}\"", s.replace('"', "\"\""));

    let columns_sql = if namespace.is_empty() {
        // No admitted attribute column exists (or none happened to be referenced) — a predicate
        // like `1 + 1` still needs *some* FROM target to bind against.
        format!("1 AS {}", quote("__surrogate_anchor"))
    } else {
        let mut parts = Vec::with_capacity(namespace.len());
        for (name, type_name) in namespace {
            parts.push(format!("CAST(NULL AS {type_name}) AS {}", quote(name)));
        }
        parts.join(", ")
    };

    let sql = format!(
        "SELECT ({predicate}) AS {} FROM (SELECT {columns_sql}) AS {} LIMIT 0",
        quote("__predicate_result"),
        quote("__surrogate")
    );

    let mut stmt = conn
        .prepare(&sql)
        .map_err(|e| FilterError::RejectedByBinder {
            detail: e.to_string(),
        })?;
    let arrow = stmt
        .query_arrow([])
        .map_err(|e| FilterError::RejectedByBinder {
            detail: e.to_string(),
        })?;
    let schema = arrow.get_schema();
    // `.fields().first()`, never the indexing `schema.field(0)` — this runs on a caller-driven
    // path, and an index access would be a panic waiting on whatever input makes the surrogate
    // query's result carry zero columns (not observed, but not worth an `unwrap`-shaped risk on
    // this seam either).
    let inferred = match schema.fields().first() {
        Some(field) => field.data_type(),
        None => {
            return Err(FilterError::RejectedByBinder {
                detail: "the surrogate query's result carries no columns at all".to_string(),
            })
        }
    };

    if inferred != &DataType::Boolean {
        return Err(FilterError::NotBoolean {
            inferred_type: inferred.to_string(),
        });
    }
    Ok(())
}
// ---------------------------------------------------------------------------------------------
// Stage 3 (continued) -- the type walk (`FILTER-BIND-COERCIONS-PREREGISTRATION.md` section 2, as
// amended by section 10 Amendment 1)
// ---------------------------------------------------------------------------------------------

/// A numeric literal's integer part may not exceed this many digits, sign excluded, counted from
/// the value itself, never from its DuckDB parse type (section 2.2; section 7).
const MAX_INTEGER_LITERAL_DIGITS: u32 = 20;

/// A decimal literal's scale (digits after the point) may not exceed this (section 2.2; section 7).
const MAX_DECIMAL_LITERAL_SCALE: u32 = 18;

/// The reason a [`FilterError::TypeNotAdmitted`] refusal names -- five fixed wire values, in the
/// precedence section 2.6 (as amended by section 10 Amendment 1) states. The sentence lives only
/// in [`Self::sentence`] / [`FilterError`]'s own `Display`, never on the wire (O-4): a wording
/// change never changes `reason`'s wire value.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TypeRefusalReason {
    /// One side is VARCHAR (a column or a string literal) and the other is neither VARCHAR nor
    /// NULL.
    TextWithNonText,
    /// One side is BOOLEAN and the other is neither BOOLEAN nor NULL.
    BooleanConversion,
    /// A literal beyond section 7's two declared bounds.
    LiteralOutOfBounds,
    /// A DECIMAL conversion wider than comparison rule 4 admits, or a decimal literal beside an
    /// integer or a decimal in `+`, `-` or `*` (O-5).
    ConversionCanFail,
    /// Everything else a refused pair can be.
    ConversionRounds,
}

impl TypeRefusalReason {
    /// The wire's fixed snake_case value (T-B; O-4). Copied byte for byte from
    /// `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` T-C by the script that wrote
    /// this file.
    pub fn wire_value(self) -> &'static str {
        match self {
            Self::TextWithNonText => "text_with_non_text",
            Self::BooleanConversion => "boolean_conversion",
            Self::LiteralOutOfBounds => "literal_out_of_bounds",
            Self::ConversionCanFail => "conversion_can_fail",
            Self::ConversionRounds => "conversion_rounds",
        }
    }

    /// The `Display` sentence (T-C), never sent on the wire. Copied byte for byte from
    /// `state/directives/B-1-RULINGS-AND-TYPED-TEXTS-2026-09-30.md` T-C by the script that wrote
    /// this file.
    fn sentence(self) -> &'static str {
        match self {
            Self::TextWithNonText => "a comparison of text with a non-text value",
            Self::BooleanConversion => "a conversion to or from BOOLEAN",
            Self::LiteralOutOfBounds => {
                "a numeric literal beyond the declared bounds (20 integer digits; decimal scale 18)"
            }
            Self::ConversionCanFail => "a conversion that can fail during the scan",
            Self::ConversionRounds => {
                "a conversion that can round a value read from the file before it is compared"
            }
        }
    }
}

/// Whether an operand is a column reference, a literal, or an arithmetic result -- `operand_types`
/// suffixes a literal with `" literal"` and an arithmetic result with `" expression"` (section 2.6).
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum OperandKind {
    Column,
    Literal,
    Expression,
}

/// The engine's own type names (section 2.2), the closed set `operand_types` renders from.
#[derive(Debug, Clone, PartialEq, Eq)]
enum EngineType {
    Varchar,
    Boolean,
    TinyInt,
    SmallInt,
    Integer,
    BigInt,
    UTinyInt,
    USmallInt,
    UInteger,
    UBigInt,
    HugeInt,
    UHugeInt,
    Real,
    Double,
    Decimal(u32, u32),
    Null,
}

impl fmt::Display for EngineType {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Varchar => write!(f, "VARCHAR"),
            Self::Boolean => write!(f, "BOOLEAN"),
            Self::TinyInt => write!(f, "TINYINT"),
            Self::SmallInt => write!(f, "SMALLINT"),
            Self::Integer => write!(f, "INTEGER"),
            Self::BigInt => write!(f, "BIGINT"),
            Self::UTinyInt => write!(f, "UTINYINT"),
            Self::USmallInt => write!(f, "USMALLINT"),
            Self::UInteger => write!(f, "UINTEGER"),
            Self::UBigInt => write!(f, "UBIGINT"),
            Self::HugeInt => write!(f, "HUGEINT"),
            Self::UHugeInt => write!(f, "UHUGEINT"),
            Self::Real => write!(f, "REAL"),
            Self::Double => write!(f, "DOUBLE"),
            Self::Decimal(w, s) => write!(f, "DECIMAL({w},{s})"),
            Self::Null => write!(f, "NULL"),
        }
    }
}

/// A typed operand the walk has classified: its [`EngineType`], whether it is a column, a literal
/// or an arithmetic result, and (for a literal) whether it sits within section 7's declared
/// bounds -- `true` for every non-literal and for a literal type the bounds do not name (VARCHAR,
/// DOUBLE, NULL).
#[derive(Debug, Clone, PartialEq)]
struct Typed {
    ty: EngineType,
    kind: OperandKind,
    within_bounds: bool,
    /// The literal's own integer value, carried only so arithmetic's constant-folding rule
    /// ([`fold_or_promote_integer`]) can ask "does this specific value fit the other operand's
    /// type" -- the same question DuckDB's own binder asks (observed at v1.5.5: `i8 + 1` keeps
    /// TINYINT, `i8 + 300` promotes to INTEGER).
    literal_int_value: Option<i128>,
    /// A rule-2 result over a NULL operand and a decimal literal within bounds counts as that
    /// decimal literal for comparison rules 4 and 6 and for [`determine_reason`]'s decimal-literal
    /// test (`engine/TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` section 2.3, question
    /// round 43, item 1). Private; `false` at every constructor and in every [`literal_typed`]
    /// arm; set only in [`type_of_arithmetic`]'s binary arm, where the NULL-typed operand is a
    /// NULL literal and the partner is a decimal literal within bounds or a result that already
    /// counts (question round 45, item 1, O-2); read in exactly three places for comparison and
    /// refusal, and a fourth time by that set condition on the partner (section 8 item 7 as read
    /// by section 10 Amendment 1).
    counts_as_decimal_literal: bool,
}

impl Typed {
    fn column(ty: EngineType) -> Self {
        Self {
            ty,
            kind: OperandKind::Column,
            within_bounds: true,
            literal_int_value: None,
            counts_as_decimal_literal: false,
        }
    }

    fn expression(ty: EngineType) -> Self {
        Self {
            ty,
            kind: OperandKind::Expression,
            within_bounds: true,
            literal_int_value: None,
            counts_as_decimal_literal: false,
        }
    }

    /// `operand_types`' own rendering of one entry (section 2.6): the type name, suffixed
    /// `" literal"` or `" expression"` as [`Self::kind`] says, unsuffixed for a column.
    fn render(&self) -> String {
        let base = self.ty.to_string();
        match self.kind {
            OperandKind::Column => base,
            OperandKind::Literal => format!("{base} literal"),
            OperandKind::Expression => format!("{base} expression"),
        }
    }
}

/// A virtual BOOLEAN operand, standing in for the boolean context `AND`/`OR`/`NOT` impose on each
/// of their own operands, so a single refused operand's reason is found by the same precedence
/// logic ([`determine_reason`]) a refused pair uses.
fn boolean_virtual() -> Typed {
    Typed::column(EngineType::Boolean)
}

/// A virtual numeric (DOUBLE) operand, standing in for "any numeric type", used only to find the
/// reason a unary `-`'s non-numeric operand is refused (section 2.5(b)).
fn numeric_virtual() -> Typed {
    Typed::column(EngineType::Double)
}

fn is_numeric(t: &Typed) -> bool {
    int_bits_signed(&t.ty).is_some()
        || matches!(
            t.ty,
            EngineType::Real | EngineType::Double | EngineType::Decimal(..)
        )
}

/// `(bit width, is signed)` for every integer [`EngineType`] -- `None` for anything else. The
/// closed set this engine's columns, arithmetic results and within-bounds literals ever carry
/// (section 2.2): every value from any two of these fits a signed 128-bit (`HUGEINT`) integer,
/// which is exactly what section 7's declared bounds exist to guarantee.
fn int_bits_signed(ty: &EngineType) -> Option<(u32, bool)> {
    match ty {
        EngineType::TinyInt => Some((8, true)),
        EngineType::SmallInt => Some((16, true)),
        EngineType::Integer => Some((32, true)),
        EngineType::BigInt => Some((64, true)),
        EngineType::HugeInt => Some((128, true)),
        EngineType::UTinyInt => Some((8, false)),
        EngineType::USmallInt => Some((16, false)),
        EngineType::UInteger => Some((32, false)),
        EngineType::UBigInt => Some((64, false)),
        EngineType::UHugeInt => Some((128, false)),
        _ => None,
    }
}

fn bits_signed_to_type(bits: u32, signed: bool) -> EngineType {
    match (bits, signed) {
        (8, true) => EngineType::TinyInt,
        (16, true) => EngineType::SmallInt,
        (32, true) => EngineType::Integer,
        (64, true) => EngineType::BigInt,
        (_, true) => EngineType::HugeInt,
        (8, false) => EngineType::UTinyInt,
        (16, false) => EngineType::USmallInt,
        (32, false) => EngineType::UInteger,
        (64, false) => EngineType::UBigInt,
        (_, false) => EngineType::UHugeInt,
    }
}

/// Does `v` fit exactly inside `ty`'s own range? Used only by [`fold_or_promote_integer`], to
/// answer the same question DuckDB's binder asks a literal before it decides whether to fold the
/// literal down to a column's own type or to promote instead (observed at v1.5.5).
fn fits_int_type(v: i128, ty: &EngineType) -> bool {
    let Some((bits, signed)) = int_bits_signed(ty) else {
        return false;
    };
    match (bits, signed) {
        (8, true) => (i8::MIN as i128..=i8::MAX as i128).contains(&v),
        (16, true) => (i16::MIN as i128..=i16::MAX as i128).contains(&v),
        (32, true) => (i32::MIN as i128..=i32::MAX as i128).contains(&v),
        (64, true) => (i64::MIN as i128..=i64::MAX as i128).contains(&v),
        (_, true) => true,
        (8, false) => (0..=u8::MAX as i128).contains(&v),
        (16, false) => (0..=u16::MAX as i128).contains(&v),
        (32, false) => (0..=u32::MAX as i128).contains(&v),
        (64, false) => (0..=u64::MAX as i128).contains(&v),
        (_, false) => v >= 0,
    }
}

/// DuckDB's own integer-pair promotion table at v1.5.5 (measured directly: `json_serialize_plan`'s
/// `return_type` over every pair of this engine's eight integer column types) -- **not** simply
/// "the wider of the two": same-signedness pairs promote to the wider of the two, but a
/// signed/unsigned pair promotes to `HUGEINT` whenever the unsigned side is 64 bits wide, to
/// `BIGINT` whenever the signed side is no wider than the unsigned side (even where a narrower
/// signed type would losslessly hold both, e.g. `i16 + u16` measures `BIGINT`, not `INTEGER`), and
/// to the signed side's own type otherwise.
fn int_promote(a: &EngineType, b: &EngineType) -> EngineType {
    let (abits, asig) = int_bits_signed(a).expect("integer type");
    let (bbits, bsig) = int_bits_signed(b).expect("integer type");
    if asig == bsig {
        return bits_signed_to_type(abits.max(bbits), asig);
    }
    let (sbits, ubits) = if asig { (abits, bbits) } else { (bbits, abits) };
    if sbits > ubits {
        bits_signed_to_type(sbits, true)
    } else if ubits >= 64 {
        EngineType::HugeInt
    } else {
        EngineType::BigInt
    }
}

/// The result type of an admitted integer `+`/`-`/`*` pair (section 2.5(a)'s "integer with integer
/// is admitted" line). DuckDB folds a literal to the other operand's own type first, when the
/// literal's specific value fits it exactly (observed at v1.5.5: `i8 + 1` returns `TINYINT`, not
/// `INTEGER`) -- checked before [`int_promote`]'s general table, which is for two non-literal
/// operands (or two literals) and can overshoot a minimal common type.
fn fold_or_promote_integer(l: &Typed, r: &Typed) -> EngineType {
    if l.kind == OperandKind::Literal && r.kind != OperandKind::Literal {
        if let Some(v) = l.literal_int_value {
            if fits_int_type(v, &r.ty) {
                return r.ty.clone();
            }
        }
    }
    if r.kind == OperandKind::Literal && l.kind != OperandKind::Literal {
        if let Some(v) = r.literal_int_value {
            if fits_int_type(v, &l.ty) {
                return l.ty.clone();
            }
        }
    }
    int_promote(&l.ty, &r.ty)
}

/// The engine type a namespace surrogate string names -- the reverse of [`duckdb_type_name`],
/// total over the closed set [`namespace_admit`] ever inserts.
fn engine_type_of_surrogate(name: &str) -> EngineType {
    match name {
        "VARCHAR" => EngineType::Varchar,
        "BOOLEAN" => EngineType::Boolean,
        "TINYINT" => EngineType::TinyInt,
        "SMALLINT" => EngineType::SmallInt,
        "INTEGER" => EngineType::Integer,
        "BIGINT" => EngineType::BigInt,
        "UTINYINT" => EngineType::UTinyInt,
        "USMALLINT" => EngineType::USmallInt,
        "UINTEGER" => EngineType::UInteger,
        "UBIGINT" => EngineType::UBigInt,
        "DOUBLE" => EngineType::Double,
        "REAL" => EngineType::Real,
        other => {
            unreachable!("namespace_admit only ever inserts duckdb_type_name's outputs: {other}")
        }
    }
}

/// A `CONSTANT` node's integer value (`INTEGER`/`BIGINT`/`HUGEINT`/`UHUGEINT`), read from
/// `json_serialize_sql`'s own JSON: a plain JSON number when it fits `i64`/`u64`, or DuckDB's own
/// `{"lower": u64, "upper": ...}` split for a 128-bit value (`upper` signed for `HUGEINT`, unsigned
/// for `UHUGEINT`) -- measured directly against `json_serialize_sql`'s real output at v1.5.5 while
/// building this module (correction round 2, W11; architect B8).
fn integer_literal_value(id: &str, raw: Option<&Value>) -> Result<i128, FilterError> {
    let raw = raw.ok_or_else(|| missing_field("CONSTANT.value.value"))?;
    if let Some(n) = raw.as_i64() {
        return Ok(n as i128);
    }
    if let Some(n) = raw.as_u64() {
        return Ok(n as i128);
    }
    let lower = raw
        .get("lower")
        .and_then(Value::as_u64)
        .ok_or_else(|| missing_field("CONSTANT.value.value.lower"))?;
    if id == "UHUGEINT" {
        let upper = raw
            .get("upper")
            .and_then(Value::as_u64)
            .ok_or_else(|| missing_field("CONSTANT.value.value.upper"))?;
        let v: u128 = ((upper as u128) << 64) | (lower as u128);
        // Already out of section 7's bound by construction (39+ digits); clamped only for a stable
        // digit count -- `within_bounds` is already false for anything this large, and no admitted
        // rule ever reads this value once it is out of bounds.
        Ok(i128::try_from(v).unwrap_or(i128::MAX))
    } else {
        let upper = raw
            .get("upper")
            .and_then(Value::as_i64)
            .ok_or_else(|| missing_field("CONSTANT.value.value.upper"))?;
        Ok((upper as i128) * (1i128 << 64) + (lower as i128))
    }
}

/// A `CONSTANT` node's [`Typed`] classification (section 2.2). The literal kinds are integer
/// (`INTEGER`, `BIGINT`, `HUGEINT`, `UHUGEINT`), decimal, double, string (`VARCHAR`) and `NULL`; a
/// literal of any other type refuses `ConstructNotAdmitted`, naming the type -- the walk's own
/// final, unconditional-refusal arm for a literal kind it cannot name (never reached by any
/// construct this crate's `structural_admit` admits today, since every literal `walk_expr` already
/// lets through parses to one of these five; kept for totality, the same discipline every other
/// `match` in this module keeps).
fn literal_typed(node: &Value) -> Result<Typed, FilterError> {
    let value = node
        .get("value")
        .ok_or_else(|| missing_field("CONSTANT.value"))?;
    if value
        .get("is_null")
        .and_then(Value::as_bool)
        .unwrap_or(false)
    {
        return Ok(Typed {
            ty: EngineType::Null,
            kind: OperandKind::Literal,
            within_bounds: true,
            literal_int_value: None,
            counts_as_decimal_literal: false,
        });
    }
    let ty = value
        .get("type")
        .ok_or_else(|| missing_field("CONSTANT.value.type"))?;
    let id = ty.get("id").and_then(Value::as_str).unwrap_or("");
    match id {
        "INTEGER" | "BIGINT" | "HUGEINT" | "UHUGEINT" => {
            let v = integer_literal_value(id, value.get("value"))?;
            let digits = v.unsigned_abs().to_string().len() as u32;
            let engine_ty = match id {
                "INTEGER" => EngineType::Integer,
                "BIGINT" => EngineType::BigInt,
                "HUGEINT" => EngineType::HugeInt,
                _ => EngineType::UHugeInt,
            };
            Ok(Typed {
                ty: engine_ty,
                kind: OperandKind::Literal,
                within_bounds: digits <= MAX_INTEGER_LITERAL_DIGITS,
                literal_int_value: Some(v),
                counts_as_decimal_literal: false,
            })
        }
        "DECIMAL" => {
            let info = ty
                .get("type_info")
                .ok_or_else(|| missing_field("CONSTANT.value.type.type_info"))?;
            let width = info.get("width").and_then(Value::as_u64).unwrap_or(0) as u32;
            let scale = info.get("scale").and_then(Value::as_u64).unwrap_or(0) as u32;
            let integer_digits = width.saturating_sub(scale);
            Ok(Typed {
                ty: EngineType::Decimal(width, scale),
                kind: OperandKind::Literal,
                within_bounds: scale <= MAX_DECIMAL_LITERAL_SCALE
                    && integer_digits <= MAX_INTEGER_LITERAL_DIGITS,
                literal_int_value: None,
                counts_as_decimal_literal: false,
            })
        }
        "DOUBLE" => Ok(Typed {
            ty: EngineType::Double,
            kind: OperandKind::Literal,
            within_bounds: true,
            literal_int_value: None,
            counts_as_decimal_literal: false,
        }),
        "VARCHAR" => Ok(Typed {
            ty: EngineType::Varchar,
            kind: OperandKind::Literal,
            within_bounds: true,
            literal_int_value: None,
            counts_as_decimal_literal: false,
        }),
        other => Err(FilterError::ConstructNotAdmitted {
            construct: format!("a literal of type `{other}`"),
        }),
    }
}

/// The type of a value-producing node: a `CONSTANT`, a `COLUMN_REF`, an admitted arithmetic
/// `FUNCTION` (`+`, `-`, `*`, `/`), or one of the BOOLEAN-valued nodes `walk_expr` admits in a
/// value position -- a comparison, `BETWEEN`, a conjunction, `NOT`, `IS [NOT] NULL`, `IN`, or a
/// `LIKE`/`ILIKE` pattern function (correction round 2, W5; architect B5, reviewer B3). Each of
/// those is walked under its own existing check first, so a problem inside it still surfaces with
/// its own reason; only the *outer* result is typed here, as BOOLEAN, section 2.3 rule 1's own
/// admission for a case like `(i32 > 0) = flag`. This gives `type_of_value` one arm per
/// `walk_expr` admitted arm (section 2.2's "mirror... one to one"); anything else refuses
/// `ConstructNotAdmitted` -- the walk's own final arm, unreachable through any text
/// `structural_admit` admits today (B-T10 proves it over a constructed node, the
/// `an_unrecognized_select_node_key_is_refused_rather_than_silently_passed` pattern).
fn type_of_value(
    node: &Value,
    namespace: &BTreeMap<String, &'static str>,
) -> Result<Typed, FilterError> {
    let class = node.get("class").and_then(Value::as_str).unwrap_or("");
    match class {
        "CONSTANT" => literal_typed(node),
        "COLUMN_REF" => {
            let names = node
                .get("column_names")
                .and_then(Value::as_array)
                .ok_or_else(|| missing_field("COLUMN_REF.column_names"))?;
            let name = names
                .first()
                .and_then(Value::as_str)
                .ok_or_else(|| missing_field("COLUMN_REF.column_names[0]"))?;
            // Unreachable in practice: `namespace_admit` already refused any name absent from the
            // namespace before stage 3 ever runs.
            let surrogate =
                namespace
                    .get(name)
                    .copied()
                    .ok_or_else(|| FilterError::UnknownColumn {
                        column: name.to_string(),
                    })?;
            Ok(Typed::column(engine_type_of_surrogate(surrogate)))
        }
        "COMPARISON" => {
            check_comparison(node, namespace)?;
            Ok(Typed::expression(EngineType::Boolean))
        }
        "BETWEEN" => {
            check_between(node, namespace)?;
            Ok(Typed::expression(EngineType::Boolean))
        }
        "CONJUNCTION" => {
            let inner = if node.get("type").and_then(Value::as_str) == Some("CONJUNCTION_OR") {
                "OR"
            } else {
                "AND"
            };
            check_junction_children(expect_children(node)?, inner, namespace)?;
            Ok(Typed::expression(EngineType::Boolean))
        }
        "OPERATOR" => {
            let op_type = node.get("type").and_then(Value::as_str).unwrap_or("");
            match op_type {
                "OPERATOR_NOT" => {
                    check_junction_children(expect_children(node)?, "NOT", namespace)?;
                    Ok(Typed::expression(EngineType::Boolean))
                }
                "OPERATOR_IS_NULL" | "OPERATOR_IS_NOT_NULL" => {
                    let children = expect_children(node)?;
                    let operand = children
                        .first()
                        .ok_or_else(|| missing_field("OPERATOR.children[0]"))?;
                    type_of_value(operand, namespace)?;
                    Ok(Typed::expression(EngineType::Boolean))
                }
                "COMPARE_IN" => {
                    check_in(node, namespace)?;
                    Ok(Typed::expression(EngineType::Boolean))
                }
                other => Err(FilterError::ConstructNotAdmitted {
                    construct: format!("OPERATOR::{other} in a value position"),
                }),
            }
        }
        "FUNCTION" => {
            let name = node
                .get("function_name")
                .and_then(Value::as_str)
                .unwrap_or("");
            let children = expect_children(node)?;
            if name == "/" {
                type_of_division(children, namespace)
            } else if ADMITTED_ARITHMETIC_FUNCTIONS.contains(&name) {
                type_of_arithmetic(name, children, namespace)
            } else if ADMITTED_PATTERN_FUNCTIONS.contains(&name) {
                check_pattern(name, children, namespace)?;
                Ok(Typed::expression(EngineType::Boolean))
            } else {
                Err(FilterError::ConstructNotAdmitted {
                    construct: format!("a function call (`{name}`)"),
                })
            }
        }
        other => Err(FilterError::ConstructNotAdmitted {
            construct: format!("an untyped node class `{other}` in a value position"),
        }),
    }
}

/// `/`'s own admission and result type (section 2.5(c), replaced by section 10 Amendment 1 under
/// O-1). Admitted for any two numeric-or-NULL operands, section 7's literal bounds **not**
/// applied. Divides in the float type the binder chooses: `REAL` when one operand is REAL-typed
/// and none is DOUBLE-typed or a double literal (F6), `DOUBLE` otherwise.
fn type_of_division(
    children: &[Value],
    namespace: &BTreeMap<String, &'static str>,
) -> Result<Typed, FilterError> {
    if children.len() != 2 {
        return Err(FilterError::ConstructNotAdmitted {
            construct: format!("`/` with {} operand(s)", children.len()),
        });
    }
    let left = type_of_value(&children[0], namespace)?;
    let right = type_of_value(&children[1], namespace)?;
    let is_varchar = |t: &Typed| t.ty == EngineType::Varchar;
    let is_boolean = |t: &Typed| t.ty == EngineType::Boolean;
    if is_varchar(&left) || is_varchar(&right) || is_boolean(&left) || is_boolean(&right) {
        let reason = determine_reason(&left, &right, false);
        return Err(FilterError::TypeNotAdmitted {
            construct: "/".to_string(),
            operand_types: vec![left.render(), right.render()],
            reason,
        });
    }
    let has_real = matches!(left.ty, EngineType::Real) || matches!(right.ty, EngineType::Real);
    let has_double =
        matches!(left.ty, EngineType::Double) || matches!(right.ty, EngineType::Double);
    let ty = if has_real && !has_double {
        EngineType::Real
    } else {
        EngineType::Double
    };
    Ok(Typed::expression(ty))
}

/// `+`, `-`, `*`'s own admission and result type (section 2.5(a)). Unary `-` (one child) is
/// admitted for any numeric operand with the operand's own type, or for a NULL literal typed
/// BIGINT (section 2.5(b), as amended by section 10 Amendment 4; the NULL literal's type by
/// `TYPE-WALK-NULL-LITERAL-ARITHMETIC-PREREGISTRATION.md` section 10 Amendment 2).
fn type_of_arithmetic(
    op: &str,
    children: &[Value],
    namespace: &BTreeMap<String, &'static str>,
) -> Result<Typed, FilterError> {
    if children.len() == 1 {
        let operand = type_of_value(&children[0], namespace)?;
        if operand.ty == EngineType::Null {
            // section 10 Amendment 2, section 2.9: unary `-` over a NULL literal is typed as the
            // binder types it (BIGINT, observed at DuckDB v1.5.5), not as NULL, so no path of the
            // walk but a NULL literal produces the NULL type.
            return Ok(Typed::expression(EngineType::BigInt));
        }
        if is_numeric(&operand) {
            return Ok(Typed {
                kind: OperandKind::Expression,
                ..operand
            });
        }
        let reason = determine_reason(&operand, &numeric_virtual(), false);
        return Err(FilterError::TypeNotAdmitted {
            construct: op.to_string(),
            operand_types: vec![operand.render()],
            reason,
        });
    }
    let left = type_of_value(&children[0], namespace)?;
    let right = type_of_value(&children[1], namespace)?;
    match admitted_arithmetic_result(&left, &right) {
        Some(ty) => {
            // section 2.2: a binary result is within bounds exactly when both operands are.
            // section 2.3, as ruled by question round 45, item 1 (O-2): a NULL-typed operand (a
            // NULL literal, the only path to the NULL type) beside a decimal literal within
            // bounds, or beside a result that already counts as one, is the pair whose result
            // counts as that decimal literal. This reads the field on the partner.
            let is_decimal_literal_within_bounds = |t: &Typed| {
                matches!(t.ty, EngineType::Decimal(..))
                    && ((t.kind == OperandKind::Literal && t.within_bounds)
                        || t.counts_as_decimal_literal)
            };
            let counts_as_decimal_literal = (left.ty == EngineType::Null
                && is_decimal_literal_within_bounds(&right))
                || (right.ty == EngineType::Null && is_decimal_literal_within_bounds(&left));
            Ok(Typed {
                within_bounds: left.within_bounds && right.within_bounds,
                counts_as_decimal_literal,
                ..Typed::expression(ty)
            })
        }
        None => {
            let is_arith_decimal = is_decimal_arithmetic_pair(&left, &right);
            let reason = determine_reason(&left, &right, is_arith_decimal);
            Err(FilterError::TypeNotAdmitted {
                construct: op.to_string(),
                operand_types: vec![left.render(), right.render()],
                reason,
            })
        }
    }
}

/// Does `+`/`-`/`*` admit this pair (section 2.5(a), applying section 2.3's rules pairwise), and
/// if so, its result type? `None` covers both "refused" and "not this arm's job" uniformly -- a
/// decimal literal beside an integer or a decimal is refused outright (O-5) and never reaches any
/// branch below, because none of them ever classifies a `Decimal` operand as admitted.
fn admitted_arithmetic_result(l: &Typed, r: &Typed) -> Option<EngineType> {
    let is_int = |t: &Typed| int_bits_signed(&t.ty).is_some() && t.within_bounds;
    let is_float_col = |t: &Typed| {
        matches!(t.ty, EngineType::Real | EngineType::Double) && t.kind != OperandKind::Literal
    };
    let is_numeric_lit = |t: &Typed| {
        t.kind == OperandKind::Literal
            && t.within_bounds
            && (int_bits_signed(&t.ty).is_some()
                || matches!(t.ty, EngineType::Decimal(..) | EngineType::Double))
    };
    let is_double_lit = |t: &Typed| t.ty == EngineType::Double && t.kind == OperandKind::Literal;
    let int_le = |t: &Typed, bits: u32| {
        t.kind != OperandKind::Literal
            && is_int(t)
            && int_bits_signed(&t.ty)
                .map(|(b, _)| b <= bits)
                .unwrap_or(false)
    };

    // rule 1: identical types (correction round 2, W3; architect B3, reviewer N1) -- no conversion
    // at all, so `f32 * f32` and `f64 + f64` keep their own shared type. Scoped to REAL/DOUBLE
    // only: an identical-type shortcut over every `EngineType` would also admit VARCHAR-with-
    // VARCHAR and DECIMAL-with-DECIMAL arithmetic, which section 2.5(a)'s own text refuses
    // unconditionally (`text_with_non_text`, and O-5's decimal-with-decimal); integer-with-integer
    // is already rule 3's job below, which this would only duplicate.
    if l.ty == r.ty && matches!(l.ty, EngineType::Real | EngineType::Double) {
        return Some(l.ty.clone());
    }
    // rule 2: a NULL literal on either side (correction round 2, W3), when the other operand is
    // itself numeric -- the walk gives the result the other operand's own type (the walk's rule,
    // not a claim about the plan). Guarded on `is_numeric` for the same reason rule 1 is scoped
    // above: section 2.5(a)'s string/boolean refusals apply regardless of a NULL partner.
    if l.ty == EngineType::Null && r.ty == EngineType::Null {
        // section 10 Amendment 1, section 2.1 as replaced: NULL beside NULL is admitted, typed as
        // the binder types it (BIGINT, observed at DuckDB v1.5.5), so the result is judged as an
        // integer expression and not as a NULL literal.
        return Some(EngineType::BigInt);
    }
    if l.ty == EngineType::Null && is_numeric(r) {
        return Some(r.ty.clone());
    }
    if r.ty == EngineType::Null && is_numeric(l) {
        return Some(l.ty.clone());
    }
    // rule 3: integer with integer.
    if is_int(l) && is_int(r) {
        return Some(fold_or_promote_integer(l, r));
    }
    // rule 6: float with a literal within bounds. A double literal widens even a REAL column to
    // DOUBLE (correction round 2, W4; architect B4, reviewer B4) -- the same widening rule 6
    // already states for comparisons (section 2.3).
    if is_float_col(l) && is_numeric_lit(r) {
        return Some(if is_double_lit(r) {
            EngineType::Double
        } else {
            l.ty.clone()
        });
    }
    if is_float_col(r) && is_numeric_lit(l) {
        return Some(if is_double_lit(l) {
            EngineType::Double
        } else {
            r.ty.clone()
        });
    }
    // rule 7: float with an integer (column or expression), bit-width-limited; REAL against DOUBLE.
    if matches!(l.ty, EngineType::Real) && is_float_col(l) && int_le(r, 16) {
        return Some(EngineType::Real);
    }
    if matches!(r.ty, EngineType::Real) && is_float_col(r) && int_le(l, 16) {
        return Some(EngineType::Real);
    }
    if matches!(l.ty, EngineType::Double) && is_float_col(l) && int_le(r, 32) {
        return Some(EngineType::Double);
    }
    if matches!(r.ty, EngineType::Double) && is_float_col(r) && int_le(l, 32) {
        return Some(EngineType::Double);
    }
    if matches!(l.ty, EngineType::Real)
        && is_float_col(l)
        && matches!(r.ty, EngineType::Double)
        && is_float_col(r)
    {
        return Some(EngineType::Double);
    }
    if matches!(r.ty, EngineType::Real)
        && is_float_col(r)
        && matches!(l.ty, EngineType::Double)
        && is_float_col(l)
    {
        return Some(EngineType::Double);
    }
    // rule 5: a double literal with an integer of at most 32 bits (column or expression).
    if is_double_lit(l) && int_le(r, 32) {
        return Some(EngineType::Double);
    }
    if is_double_lit(r) && int_le(l, 32) {
        return Some(EngineType::Double);
    }
    None
}

/// Whether this pair is exactly section 2.5(a)'s named decimal-arithmetic refusal: a decimal
/// literal beside an integer or a decimal (O-5) -- the one case [`determine_reason`] resolves to
/// `ConversionCanFail` rather than `ConversionRounds`.
fn is_decimal_arithmetic_pair(l: &Typed, r: &Typed) -> bool {
    let is_decimal = |t: &Typed| matches!(t.ty, EngineType::Decimal(..));
    let is_int_or_decimal = |t: &Typed| int_bits_signed(&t.ty).is_some() || is_decimal(t);
    (is_decimal(l) && is_int_or_decimal(r)) || (is_decimal(r) && is_int_or_decimal(l))
}

/// Does this pair satisfy comparison rules 1-7 (section 2.3, "=", "<>", "<", "<=", ">", ">=",
/// `IS [NOT] DISTINCT FROM`, a `BETWEEN` input against each bound, an `IN` needle against each
/// member)? The first rule that matches admits the pair.
fn is_admitted_comparison(l: &Typed, r: &Typed) -> bool {
    // rule 1: identical types.
    if l.ty == r.ty {
        return true;
    }
    // rule 2: a NULL literal on either side.
    if l.ty == EngineType::Null || r.ty == EngineType::Null {
        return true;
    }

    let is_int = |t: &Typed| int_bits_signed(&t.ty).is_some() && t.within_bounds;
    let is_int_literal = |t: &Typed| is_int(t) && t.kind == OperandKind::Literal;
    // read of `counts_as_decimal_literal`, 1 of 3 (section 2.3): stands in for kind literal.
    let is_decimal_literal = |t: &Typed| {
        matches!(t.ty, EngineType::Decimal(..))
            && (t.kind == OperandKind::Literal || t.counts_as_decimal_literal)
            && t.within_bounds
    };
    let is_double_literal =
        |t: &Typed| t.ty == EngineType::Double && t.kind == OperandKind::Literal;
    // read of `counts_as_decimal_literal`, 2 of 3 (section 2.3): stands in for kind literal.
    let is_numeric_literal_within_bounds = |t: &Typed| {
        (t.kind == OperandKind::Literal || t.counts_as_decimal_literal)
            && t.within_bounds
            && (int_bits_signed(&t.ty).is_some()
                || matches!(t.ty, EngineType::Decimal(..) | EngineType::Double))
    };
    let is_float_nonliteral = |t: &Typed| {
        matches!(t.ty, EngineType::Real | EngineType::Double) && t.kind != OperandKind::Literal
    };
    let int_le = |t: &Typed, bits: u32| {
        t.kind != OperandKind::Literal
            && is_int(t)
            && int_bits_signed(&t.ty)
                .map(|(b, _)| b <= bits)
                .unwrap_or(false)
    };

    // rule 3: integer against integer -- always representable via HUGEINT at worst (section 7's
    // bounds exist precisely to guarantee this over this engine's closed type universe).
    if is_int(l) && is_int(r) {
        return true;
    }
    // rule 4: "an integer of at most 64 bits, or an integer literal" (correction round 2, W2;
    // architect B2) -- a non-literal integer (a column or an arithmetic result, for example a
    // `u64 * i64` product typed HUGEINT) must not exceed 64 bits; a literal integer carries no
    // extra bit-width bound here because section 7's digit bound already caps it.
    let int64_or_literal = |t: &Typed| {
        is_int(t)
            && (t.kind == OperandKind::Literal
                || int_bits_signed(&t.ty)
                    .map(|(b, _)| b <= 64)
                    .unwrap_or(false))
    };
    if (int64_or_literal(l) && is_decimal_literal(r))
        || (int64_or_literal(r) && is_decimal_literal(l))
    {
        return true;
    }
    if is_decimal_literal(l) && is_decimal_literal(r) {
        return true;
    }
    // rule 5.
    if (is_double_literal(l) && int_le(r, 32)) || (is_double_literal(r) && int_le(l, 32)) {
        return true;
    }
    // rule 6(i): float against a numeric literal within bounds, or against a double literal.
    if (is_float_nonliteral(l) && is_numeric_literal_within_bounds(r))
        || (is_float_nonliteral(r) && is_numeric_literal_within_bounds(l))
    {
        return true;
    }
    // rule 6(ii): a double literal against an integer or decimal literal within bounds.
    if (is_double_literal(l) && (is_int_literal(r) || is_decimal_literal(r)))
        || (is_double_literal(r) && (is_int_literal(l) || is_decimal_literal(l)))
    {
        return true;
    }
    // rule 7.
    if (matches!(l.ty, EngineType::Real) && is_float_nonliteral(l) && int_le(r, 16))
        || (matches!(r.ty, EngineType::Real) && is_float_nonliteral(r) && int_le(l, 16))
    {
        return true;
    }
    if (matches!(l.ty, EngineType::Double) && is_float_nonliteral(l) && int_le(r, 32))
        || (matches!(r.ty, EngineType::Double) && is_float_nonliteral(r) && int_le(l, 32))
    {
        return true;
    }
    if matches!(l.ty, EngineType::Real)
        && is_float_nonliteral(l)
        && matches!(r.ty, EngineType::Double)
        && is_float_nonliteral(r)
    {
        return true;
    }
    if matches!(r.ty, EngineType::Real)
        && is_float_nonliteral(r)
        && matches!(l.ty, EngineType::Double)
        && is_float_nonliteral(l)
    {
        return true;
    }
    false
}

/// The reason a refused pair (or a refused single junction operand, against a virtual BOOLEAN or
/// numeric partner) is refused -- section 2.6's precedence, as amended by section 10 Amendment 1.
fn determine_reason(l: &Typed, r: &Typed, is_arithmetic: bool) -> TypeRefusalReason {
    let is_varchar = |t: &Typed| t.ty == EngineType::Varchar;
    let is_null = |t: &Typed| t.ty == EngineType::Null;
    let is_boolean = |t: &Typed| t.ty == EngineType::Boolean;

    if (is_varchar(l) && !is_varchar(r) && !is_null(r))
        || (is_varchar(r) && !is_varchar(l) && !is_null(l))
    {
        return TypeRefusalReason::TextWithNonText;
    }
    if (is_boolean(l) && !is_boolean(r) && !is_null(r))
        || (is_boolean(r) && !is_boolean(l) && !is_null(l))
    {
        return TypeRefusalReason::BooleanConversion;
    }
    if !l.within_bounds || !r.within_bounds {
        return TypeRefusalReason::LiteralOutOfBounds;
    }
    // section 2.6 item 4's first clause, "a DECIMAL conversion wider than rule 4 admits"
    // (correction round 2, W2; Amendment 4 rows C29-C30): comparison rule 4 bounds a non-literal
    // integer side to 64 bits, so an arithmetic result wider than that (a HUGEINT/UHUGEINT
    // expression) beside a decimal literal is refused for that reason, not the residual
    // `ConversionRounds`.
    // read of `counts_as_decimal_literal`, 3 of 3 (section 2.3): stands in for kind literal.
    let is_decimal_lit = |t: &Typed| {
        matches!(t.ty, EngineType::Decimal(..))
            && (t.kind == OperandKind::Literal || t.counts_as_decimal_literal)
    };
    let is_wide_int = |t: &Typed| {
        t.kind != OperandKind::Literal
            && int_bits_signed(&t.ty).map(|(b, _)| b > 64).unwrap_or(false)
    };
    if (is_decimal_lit(l) && is_wide_int(r)) || (is_decimal_lit(r) && is_wide_int(l)) {
        return TypeRefusalReason::ConversionCanFail;
    }
    if is_arithmetic && is_decimal_arithmetic_pair(l, r) {
        return TypeRefusalReason::ConversionCanFail;
    }
    TypeRefusalReason::ConversionRounds
}

fn comparison_construct_name(cmp_type: &str) -> Result<&'static str, FilterError> {
    Ok(match cmp_type {
        "COMPARE_EQUAL" => "=",
        "COMPARE_NOTEQUAL" => "<>",
        "COMPARE_LESSTHAN" => "<",
        "COMPARE_LESSTHANOREQUALTO" => "<=",
        "COMPARE_GREATERTHAN" => ">",
        "COMPARE_GREATERTHANOREQUALTO" => ">=",
        "COMPARE_DISTINCT_FROM" => "IS DISTINCT FROM",
        "COMPARE_NOT_DISTINCT_FROM" => "IS NOT DISTINCT FROM",
        // Unreachable: `walk_expr`'s own COMPARISON arm admits every `COMPARE_*` type uniformly,
        // and this list is every one `json_serialize_sql` produces for a binary comparison operator
        // (measured at v1.5.5 while building this module). Refuses rather than emitting a
        // `construct` outside section 2.6's declared map (correction round 2, W1; architect N3,
        // reviewer N2).
        other => {
            return Err(FilterError::ConstructNotAdmitted {
                construct: format!("a comparison type `{other}`"),
            })
        }
    })
}

fn check_pair(
    construct: &str,
    l: &Typed,
    r: &Typed,
    is_arithmetic: bool,
) -> Result<(), FilterError> {
    let admitted = if is_arithmetic {
        admitted_arithmetic_result(l, r).is_some()
    } else {
        is_admitted_comparison(l, r)
    };
    if admitted {
        return Ok(());
    }
    let reason = determine_reason(l, r, is_arithmetic);
    Err(FilterError::TypeNotAdmitted {
        construct: construct.to_string(),
        operand_types: vec![l.render(), r.render()],
        reason,
    })
}

fn check_comparison(
    node: &Value,
    namespace: &BTreeMap<String, &'static str>,
) -> Result<(), FilterError> {
    let cmp_type = node.get("type").and_then(Value::as_str).unwrap_or("");
    let construct = comparison_construct_name(cmp_type)?;
    let left_node = node
        .get("left")
        .ok_or_else(|| missing_field("COMPARISON.left"))?;
    let right_node = node
        .get("right")
        .ok_or_else(|| missing_field("COMPARISON.right"))?;
    let left = type_of_value(left_node, namespace)?;
    let right = type_of_value(right_node, namespace)?;
    check_pair(construct, &left, &right, false)
}

/// section 2.3's `BETWEEN` item, as amended by section 10 Amendment 4 (correction round 2, W6;
/// reviewer B1, the architect's consult ruling it removable inside the sighted design): every pair
/// of the three operands is checked, in the order input-lower, input-upper, lower-upper.
/// `operand_types` (via [`check_pair`]) names the first refused pair in that order. `IN` is
/// unchanged (`check_in`): `walk_expr`'s own `COMPARE_IN` arm admits only literal members, so the
/// needle is the only operand ever carrying file data there, unlike a non-literal `BETWEEN` bound.
fn check_between(
    node: &Value,
    namespace: &BTreeMap<String, &'static str>,
) -> Result<(), FilterError> {
    let input = node
        .get("input")
        .ok_or_else(|| missing_field("BETWEEN.input"))?;
    let lower = node
        .get("lower")
        .ok_or_else(|| missing_field("BETWEEN.lower"))?;
    let upper = node
        .get("upper")
        .ok_or_else(|| missing_field("BETWEEN.upper"))?;
    let ti = type_of_value(input, namespace)?;
    let tl = type_of_value(lower, namespace)?;
    check_pair("BETWEEN", &ti, &tl, false)?;
    let tu = type_of_value(upper, namespace)?;
    check_pair("BETWEEN", &ti, &tu, false)?;
    check_pair("BETWEEN", &tl, &tu, false)
}

fn check_in(node: &Value, namespace: &BTreeMap<String, &'static str>) -> Result<(), FilterError> {
    let children = expect_children(node)?;
    let needle_node = children
        .first()
        .ok_or_else(|| missing_field("COMPARE_IN.children[0]"))?;
    let needle = type_of_value(needle_node, namespace)?;
    for member in &children[1..] {
        let tm = type_of_value(member, namespace)?;
        check_pair("IN", &needle, &tm, false)?;
    }
    Ok(())
}

fn check_pattern(
    function_name: &str,
    children: &[Value],
    namespace: &BTreeMap<String, &'static str>,
) -> Result<(), FilterError> {
    let construct = if function_name == "~~*" {
        "ILIKE"
    } else {
        "LIKE"
    };
    if children.len() != 2 {
        return Err(FilterError::ConstructNotAdmitted {
            construct: format!("`{construct}` with {} operand(s)", children.len()),
        });
    }
    let operand = type_of_value(&children[0], namespace)?;
    let pattern = type_of_value(&children[1], namespace)?;
    let operand_ok = operand.ty == EngineType::Varchar;
    let pattern_ok = pattern.ty == EngineType::Varchar || pattern.ty == EngineType::Null;
    if operand_ok && pattern_ok {
        return Ok(());
    }
    // section 2.4: "the operand is VARCHAR, and the pattern is a VARCHAR or NULL literal. Anything
    // else refuses text_with_non_text." Today the binder refuses this first (structural admission
    // -- the second operand of `~~`/`~~*` must already be a `CONSTANT`), so this arm is what makes
    // the walk total rather than what fires live.
    Err(FilterError::TypeNotAdmitted {
        construct: construct.to_string(),
        operand_types: vec![operand.render(), pattern.render()],
        reason: TypeRefusalReason::TextWithNonText,
    })
}

fn require_boolean_or_null(t: &Typed, construct: &'static str) -> Result<(), FilterError> {
    if t.ty == EngineType::Boolean || t.ty == EngineType::Null {
        return Ok(());
    }
    let reason = determine_reason(t, &boolean_virtual(), false);
    Err(FilterError::TypeNotAdmitted {
        construct: construct.to_string(),
        operand_types: vec![t.render()],
        reason,
    })
}

/// Every child of an `AND`/`OR`/`NOT` (or the walk's own top-level implicit `AND` -- real
/// composition is always `(<predicate>) AND <bbox>`, so every top-level operand is exactly one of
/// that outer `AND`'s own children) must independently be BOOLEAN-typed or a NULL literal
/// (section 2.4), on pain of `boolean_conversion` (or a higher-precedence reason, section 2.6).
fn check_junction_children(
    children: &[Value],
    construct: &'static str,
    namespace: &BTreeMap<String, &'static str>,
) -> Result<(), FilterError> {
    for child in children {
        check_boolean_operand(child, construct, namespace)?;
    }
    Ok(())
}

/// Dispatch one operand of a boolean context (the top-level implicit `AND`, or a real `AND`/`OR`):
/// a construct that is inherently boolean-shaped (a comparison, `BETWEEN`, `IN`, `NOT`,
/// `IS [NOT] NULL`, a nested `AND`/`OR`, `LIKE`/`ILIKE`) is walked on its own terms; anything else
/// (a bare column, literal, or arithmetic expression) is typed and must be BOOLEAN or NULL.
fn check_boolean_operand(
    node: &Value,
    construct: &'static str,
    namespace: &BTreeMap<String, &'static str>,
) -> Result<(), FilterError> {
    let class = node.get("class").and_then(Value::as_str).unwrap_or("");
    match class {
        "COMPARISON" => check_comparison(node, namespace),
        "BETWEEN" => check_between(node, namespace),
        "CONJUNCTION" => {
            let inner = if node.get("type").and_then(Value::as_str) == Some("CONJUNCTION_OR") {
                "OR"
            } else {
                "AND"
            };
            check_junction_children(expect_children(node)?, inner, namespace)
        }
        "OPERATOR" => {
            let op_type = node.get("type").and_then(Value::as_str).unwrap_or("");
            match op_type {
                "OPERATOR_NOT" => check_junction_children(expect_children(node)?, "NOT", namespace),
                "OPERATOR_IS_NULL" | "OPERATOR_IS_NOT_NULL" => {
                    // section 2.4: "any typed operand, with no rule" -- still walked, so an inner
                    // problem (a mistyped nested arithmetic expression) still surfaces, but the
                    // operand's own type is never itself checked.
                    let children = expect_children(node)?;
                    let operand = children
                        .first()
                        .ok_or_else(|| missing_field("OPERATOR.children[0]"))?;
                    type_of_value(operand, namespace).map(|_| ())
                }
                "COMPARE_IN" => check_in(node, namespace),
                // section 8 item 5: a rule table may not admit by default. `walk_expr`'s own
                // OPERATOR arm never reaches this with any `op_type` but the three named above
                // (correction round 2, W1) -- kept total, refusing rather than admitting, the same
                // discipline every other match in this module keeps.
                other => Err(FilterError::ConstructNotAdmitted {
                    construct: format!("OPERATOR::{other} in a boolean context"),
                }),
            }
        }
        "FUNCTION" => {
            let name = node
                .get("function_name")
                .and_then(Value::as_str)
                .unwrap_or("");
            if ADMITTED_PATTERN_FUNCTIONS.contains(&name) {
                check_pattern(name, expect_children(node)?, namespace)
            } else {
                let typed = type_of_value(node, namespace)?;
                require_boolean_or_null(&typed, construct)
            }
        }
        _ => {
            let typed = type_of_value(node, namespace)?;
            require_boolean_or_null(&typed, construct)
        }
    }
}

/// The type walk (section 2), run once per [`AdmittedPredicate::admit`] call, after
/// [`bind_admit`] returns `Ok`, over `structural_admit`'s own parsed operand list -- the tree is
/// parsed only once (section 2.2). Real composition is always `(<predicate>) AND <bbox>`, so every
/// top-level operand is treated exactly as one child of that outer `AND` (section 2.4's own rule),
/// which is what catches an implicit coercion `bind_admit`'s own BOOLEAN check misses today (for
/// example `i32 AND flag`, whose *overall* inferred type is already BOOLEAN via DuckDB's own
/// implicit int-to-bool cast inside `AND`).
fn type_walk(
    operands: &[Value],
    namespace: &BTreeMap<String, &'static str>,
) -> Result<(), FilterError> {
    check_junction_children(operands, "AND", namespace)
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

    /// E-18 (the namespace half): `Float32` is filterable — `duckdb_type_name` maps it to `REAL`
    /// (F1; round 17 item 3), and [`filterable_column_type`] admits a `Float32`-typed field.
    /// Mutation: leave `Float32` out of the namespace (drop the `REAL` arm).
    #[test]
    fn a_float32_column_is_filterable() {
        assert_eq!(duckdb_type_name(&DataType::Float32), Some("REAL"));
        let field = Field::new("f32", DataType::Float32, true);
        assert_eq!(filterable_column_type("f32", &field), Ok(DataType::Float32));
    }

    /// E-19: `a_dictionary_encoded_column_is_refused_as_not_filterable_with_a_reason_naming_the_
    /// encoding` — proven over a **constructed** `Field`, per O6: H2 (confirmed by P0) makes a real
    /// dictionary-encoded parquet column unreachable through `read_parquet` in the pinned DuckDB, so
    /// no real `Dataset` can carry one to test `namespace_admit` against end to end. This is the
    /// same accepted pattern E-12 uses for `stream::decode_dictionary_chunk_column`. Mutation:
    /// remove the exclusion (fall through to `admit_attribute_type`, which now admits the
    /// dictionary's value type).
    #[test]
    fn a_dictionary_encoded_column_is_refused_as_not_filterable_with_a_reason_naming_the_encoding()
    {
        let field = Field::new(
            "cat",
            DataType::Dictionary(Box::new(DataType::Int32), Box::new(DataType::Utf8)),
            true,
        );
        match filterable_column_type("cat", &field) {
            Err(FilterError::ColumnNotFilterable { column, reason }) => {
                assert_eq!(column, "cat");
                assert!(
                    reason.contains("dictionary-encoded"),
                    "reason must name the encoding: {reason}"
                );
            }
            other => panic!("expected ColumnNotFilterable naming the encoding, got {other:?}"),
        }
    }

    /// N-5 (§10 Amendment 12, wave-2 A2-1): `a_nul_named_column_is_refused_as_not_filterable_by_
    /// name` — proven over a **constructed** `Field`, E-19's own pattern: a name carrying U+0000
    /// left out of the filter namespace before the dictionary check even runs.
    /// Mutation: the name check is removed from `filterable_column_type` (this arm deleted).
    #[test]
    fn a_nul_named_column_is_refused_as_not_filterable_by_name() {
        let field = Field::new("nu\0l", DataType::Utf8, true);
        match filterable_column_type("nu\0l", &field) {
            Err(
                ref err @ FilterError::ColumnNotFilterable {
                    ref column,
                    ref reason,
                },
            ) => {
                assert_eq!(column, "nu\0l");
                assert!(
                    reason.contains("U+0000"),
                    "reason must name U+0000: {reason}"
                );
                assert!(
                    !reason.contains('\0'),
                    "reason must not carry a raw NUL byte: {reason:?}"
                );
                // N-1a's fifth shape (§8 item 34): `ColumnNotFilterable`'s own `Display`, proven
                // here rather than live (E9: a raw U+0000 in predicate text is refused as
                // unparsable before the namespace ever runs, so this shape is unreachable live).
                let display = err.to_string();
                assert!(
                    !display.contains('\0'),
                    "Display must not carry a raw NUL byte: {display:?}"
                );
                assert!(
                    display.contains("\\u0000"),
                    "Display must render the visible escape: {display:?}"
                );
            }
            other => panic!("expected ColumnNotFilterable naming U+0000, got {other:?}"),
        }
    }

    /// X5 (row 5.6; O4): every type the filter namespace admits carries a DuckDB surrogate —
    /// `filter_surrogate` is the one function [`namespace_admit`] and [`bind_admit`] rely on for
    /// that, and this proves it covers every type [`filterable_column_type`] itself admits.
    // RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): in `duckdb_type_name`,
    // remove the `D::Float32 => Some("REAL")` arm. Observed: this test fails by name -- "f32
    // (Float32) must carry a surrogate" at `engine/src/predicate.rs:1283`. Reverted.
    // RECORDED MUTATION (observed at `ca3d7ae`): in `duckdb_type_name`, drop `LargeUtf8` and
    // `Utf8View` from the `VARCHAR` arm. Observed: this test fails by name -- "large (LargeUtf8)
    // must carry a surrogate" at `engine/src/predicate.rs:1283`. Reverted.
    #[test]
    fn every_type_the_filter_namespace_admits_carries_a_surrogate() {
        let cases = [
            ("s", DataType::Utf8),
            ("large", DataType::LargeUtf8),
            ("view", DataType::Utf8View),
            ("b", DataType::Boolean),
            ("i8", DataType::Int8),
            ("i16", DataType::Int16),
            ("i32", DataType::Int32),
            ("i64", DataType::Int64),
            ("u8", DataType::UInt8),
            ("u16", DataType::UInt16),
            ("u32", DataType::UInt32),
            ("u64", DataType::UInt64),
            ("f64", DataType::Float64),
            ("f32", DataType::Float32),
        ];
        for (name, ty) in cases {
            let field = Field::new(name, ty.clone(), true);
            // Every one of these types is admitted by `filterable_column_type` itself (it is not
            // a dictionary and `admit_attribute_type` accepts it), so if it is admitted at all it
            // must also carry a surrogate — `filter_surrogate` must not narrow the namespace by
            // silently dropping one of `filterable_column_type`'s own admitted types.
            assert!(
                filterable_column_type(name, &field).is_ok(),
                "{name} ({ty}) must itself be filterable, or this test proves nothing about it"
            );
            assert!(
                filter_surrogate(name, &field).is_ok(),
                "{name} ({ty}) must carry a surrogate: {:?}",
                filter_surrogate(name, &field)
            );
        }
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
        assert!(
            bomb.len() < MAX_PREDICATE_BYTES,
            "must trip depth, not the byte ceiling"
        );
        match structural_admit(&bomb, &conn()) {
            Err(FilterError::TooDeep { limit, .. }) => {
                assert_eq!(limit, MAX_PREDICATE_DEPTH as u64)
            }
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
                assert!(
                    construct.to_uppercase().contains("SET_OPERATION"),
                    "{construct}"
                );
            }
            other => {
                panic!("expected ConstructNotAdmitted naming the set operation, got {other:?}")
            }
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

    /// B1 (reviewer gate, demonstrated live): the old wrapper (`SELECT 1 WHERE (<text>)`) admitted
    /// this, and composition (`(<text>) AND <bbox>`) then re-associated it — `AND` binds tighter
    /// than `OR`, so the bbox condition was bypassed entirely. The fixed wrapper
    /// (`SELECT 1 WHERE (<text>) AND 1=1`) refuses it: the top-level `where_clause` here is a
    /// `CONJUNCTION_OR`, not the required `CONJUNCTION_AND` with the sentinel last.
    #[test]
    fn a_predicate_that_closes_the_wrapper_paren_early_and_reassociates_as_or_is_refused() {
        match structural_admit("zone = 'residential') OR (1=1", &conn()) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(construct.contains("AND-sentinel"), "{construct}");
            }
            other => panic!("expected ConstructNotAdmitted naming the AND-sentinel, got {other:?}"),
        }
    }

    /// B1's other demonstrated escape: a trailing comment that eats real composition's `AND
    /// <bbox> ... LIMIT n` suffix eats this module's own `AND 1=1` sentinel identically — refused
    /// because `where_clause` is a bare `COMPARISON`, not a `CONJUNCTION_AND` at all.
    #[test]
    fn a_trailing_comment_that_would_eat_compositions_and_bbox_also_eats_the_sentinel_and_is_refused(
    ) {
        match structural_admit("1=1) --", &conn()) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(construct.contains("AND-sentinel"), "{construct}");
            }
            other => panic!("expected ConstructNotAdmitted naming the AND-sentinel, got {other:?}"),
        }
    }

    /// Positive control for the sentinel design itself: a predicate whose own top level is already
    /// an `AND` chain still admits, and both of its own columns are still collected — DuckDB
    /// flattens `(a AND b) AND <sentinel>` into one 3-ary `CONJUNCTION_AND` (measured;
    /// `target/slice-evidence/sql-filter/logs/p3-probe-sentinel.log`), and `expect_wrapper_shape`
    /// (via `differential_operands`) walks every child except the last (the sentinel), not
    /// "exactly two children".
    #[test]
    fn a_predicate_that_is_itself_a_top_level_and_chain_still_admits_with_every_column_collected() {
        match structural_admit("a = 1 AND b = 2 AND c = 3", &conn()) {
            Ok(admission) => {
                let columns = admission.columns;
                for name in ["a", "b", "c"] {
                    assert!(
                        columns.iter().any(|c| c == name),
                        "missing {name} in {columns:?}"
                    );
                }
                assert!(
                    !columns.contains(&"1".to_string()),
                    "the sentinel must not be collected"
                );
            }
            other => panic!("expected the AND-chain to admit, got {other:?}"),
        }
    }

    /// **The escape that survived the single-sentinel fix** (reviewer's final gate on B1, FINAL
    /// attempt per rule 7): `1=1) AND 1=1 --` forges its own trailing `1=1` and then uses a
    /// same-line comment to eat this module's real, appended `) AND 1=1` — identically to how a
    /// real composed `) AND <bbox> ... LIMIT n` would be eaten. A single fixed sentinel cannot
    /// tell the forged `1=1` from the real one. The differential two-sentinel probe can: probe A
    /// (real sentinel `1=1`) sees a forged `1=1` in last position and would pass on its own, but
    /// probe B (real sentinel `2=2`) has its own real `) AND 2=2` eaten the same way, leaving its
    /// last operand the caller's forged `1=1` too — which is not `2=2` — so probe B's own
    /// sentinel check fails and the whole predicate is refused.
    #[test]
    fn a_forged_trailing_sentinel_eaten_by_a_comment_is_refused_by_the_differential_probe() {
        // The first two force the differential mismatch this test is named for. The third,
        // `1=1) AND 1=1 /*`, is an *unterminated* block comment — DuckDB's parser refuses it
        // outright (`Unparsable`, "unterminated /* comment") before this module's own shape checks
        // ever run at all. Still a refusal, and still evidence the escape does not survive, just
        // via a different named code — asserted separately below rather than folded into the same
        // `ConstructNotAdmitted`/"AND-sentinel" assertion, so this test says exactly which code
        // each row actually produces rather than a bare "it refused".
        for predicate in ["1=1) AND 1=1 --", "1=1) AND 1=1 ;--"] {
            match structural_admit(predicate, &conn()) {
                Err(FilterError::ConstructNotAdmitted { construct }) => {
                    assert!(construct.contains("AND-sentinel"), "`{predicate}`: {construct}");
                }
                other => panic!(
                    "`{predicate}` was expected to be refused as a forged/eaten sentinel, got {other:?}"
                ),
            }
        }
        match structural_admit("1=1) AND 1=1 /*", &conn()) {
            Err(FilterError::Unparsable { .. }) => {}
            other => panic!(
                "`1=1) AND 1=1 /*` was expected Unparsable (unterminated comment), got {other:?}"
            ),
        }
    }

    /// The differential probe's own converse case, proving it is not *too* strict: a predicate
    /// whose **own** text legitimately ends in `1=1` must still admit. Probe A flattens to
    /// `[id > 3, caller's 1=1, sentinel 1=1]`; probe B flattens to `[id > 3, caller's 1=1,
    /// sentinel 2=2]` — both end in the correct sentinel for their own probe, the preceding
    /// operands agree, and the caller's own harmless `1=1` rides through to the allowlist walk
    /// like any other admitted comparison.
    #[test]
    fn a_predicate_that_legitimately_ends_in_its_own_one_equals_one_still_admits() {
        match structural_admit("id > 3 AND 1=1", &conn()) {
            Ok(admission) => {
                assert!(
                    admission.columns.iter().any(|c| c == "id"),
                    "missing id in {:?}",
                    admission.columns
                )
            }
            other => panic!("expected this benign predicate to admit, got {other:?}"),
        }
    }

    /// Should-fix 4 (reviewer gate): an unrecognized key anywhere on the wrapped `SELECT_NODE`
    /// refuses by default rather than passing silently — hardening against a future DuckDB version
    /// adding a clause this module has no explicit check for. Exercised directly against the
    /// checker rather than by finding real DuckDB output that adds a thirteenth key (there isn't
    /// one today), which is exactly the point: the check must fire on a shape this module has
    /// never seen, not only on shapes it can currently provoke.
    #[test]
    fn an_unrecognized_select_node_key_is_refused_rather_than_silently_passed() {
        let mut node = serde_json::json!({
            "type": "SELECT_NODE",
            "modifiers": [],
            "cte_map": {"map": []},
            "select_list": [{"class": "CONSTANT"}],
            "from_table": {"type": "EMPTY"},
            "where_clause": {"class": "CONJUNCTION", "type": "CONJUNCTION_AND", "children": []},
            "group_expressions": [],
            "group_sets": [],
            "aggregate_handling": "STANDARD_HANDLING",
            "having": null,
            "sample": null,
            "qualify": null,
        });
        node.as_object_mut().unwrap().insert(
            "a_future_clause_this_module_has_never_seen".into(),
            Value::Bool(true),
        );
        match expect_wrapper_shape(&node) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(
                    construct.contains("a_future_clause_this_module_has_never_seen"),
                    "{construct}"
                );
            }
            other => {
                panic!("expected ConstructNotAdmitted naming the unrecognized key, got {other:?}")
            }
        }
    }

    /// B-T10 (`FILTER-BIND-COERCIONS-PREREGISTRATION.md` section 4). A node the type walk cannot
    /// name (in a value position) is refused, never silently passed -- the same
    /// `an_unrecognized_select_node_key_is_refused_rather_than_silently_passed` pattern, applied to
    /// `type_of_value`'s own final arm, and to `literal_typed`'s own final arm for a literal type
    /// section 2.2 does not name. Mutation: either final arm returns `Ok`. It fails by name.
    #[test]
    fn an_untyped_node_or_literal_type_is_refused_by_the_type_walk() {
        let namespace: BTreeMap<String, &'static str> = BTreeMap::new();

        let node = serde_json::json!({"class": "WINDOW"});
        match type_of_value(&node, &namespace) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(construct.contains("WINDOW"), "{construct}");
            }
            other => {
                panic!("expected ConstructNotAdmitted naming the unrecognized class, got {other:?}")
            }
        }

        let literal = serde_json::json!({
            "class": "CONSTANT",
            "value": {"is_null": false, "type": {"id": "DATE", "type_info": null}, "value": 0}
        });
        match type_of_value(&literal, &namespace) {
            Err(FilterError::ConstructNotAdmitted { construct }) => {
                assert!(construct.contains("DATE"), "{construct}");
            }
            other => panic!(
                "expected ConstructNotAdmitted naming the unrecognized literal type, got {other:?}"
            ),
        }
    }

    // -----------------------------------------------------------------------------------------
    // B-T1b (section 10 Amendment 4) -- the walk's own arithmetic types against the binder's,
    // over an in-memory table carrying FX-1's schema, never a real GeoParquet file (no file data
    // is read; section 8 item 4 is unaffected since this reads a plan at test time only).
    // -----------------------------------------------------------------------------------------

    /// FX-1's twelve columns (`FILTER-BIND-COERCIONS-PREREGISTRATION.md` section 3), by name and
    /// surrogate type -- doubles as the namespace [`type_of_value`] needs and the in-memory table's
    /// own DDL column type (at v1.5.5, `REAL` is valid SQL for a 4-byte float, as `FLOAT` is).
    const BT1B_COLS: &[(&str, &str)] = &[
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
        ("f32", "REAL"),
        ("f64", "DOUBLE"),
    ];

    /// `engine/tests/filter_type_admission.rs`'s own `LITS`, byte for byte -- this test cannot
    /// import an integration test's generator (Amendment 4), so the operand lists are rebuilt here.
    const BT1B_LITS: &[&str] = &[
        "1",
        "-1",
        "300",
        "3000000000",
        "9223372036854775808",
        "170141183460469231731687303715884105728",
        "1.5",
        "0.000000001",
        "0.000000000000000001",
        "0.0000000000000000001",
        "0.00000000000000000001",
        "0.000000000000000000000000001",
        "0.0000000000000000000000000001",
        "0.00000000000000000000000000001",
        "0.0000000000000000000000000000000001",
        "0.000000000000000000000000000000000001",
        "0.1",
        "9007199254740993.0",
        "1e3",
        "1.00000000000000000000000000000000000001",
        "'x'",
        "'5'",
        "'true'",
        "NULL",
        "x'41'",
        "B'01'",
        "e'x'",
        "$$x$$",
        "-1.5",
        "-1e3",
    ];

    /// One rebuilt B-T1b case: `predicate` always has the shape `(<arithmetic-node>) <cmp> <other>`,
    /// so the top-level `COMPARISON`'s own `left` child is always the arithmetic node under test.
    /// `op`/`arity` name which `BOUND_FUNCTION` in the plan is the one to read back.
    struct Bt1bCase {
        label: String,
        predicate: String,
        op: &'static str,
        arity: usize,
    }

    /// section 10 Amendment 4's B-T1b enumeration: `engine/tests/filter_type_admission.rs`'s own
    /// `generate_cases` arithmetic forms (the main loop's four `+`/`-`/`*`/`/` family members, and
    /// the per-column unary-minus/`+1`/`*2`/`/0`/self-`*` family forms), rebuilt from the same
    /// operand lists, plus Amendment 4's C29-C33 (post-result).
    fn bt1b_generate_cases() -> Vec<Bt1bCase> {
        let mut operands: Vec<String> = BT1B_LITS.iter().map(|s| s.to_string()).collect();
        operands.extend(BT1B_COLS.iter().map(|(n, _)| n.to_string()));

        let mut cases = Vec::new();
        for (c, _) in BT1B_COLS {
            for o in &operands {
                for op in ["+", "-", "*", "/"] {
                    cases.push(Bt1bCase {
                        label: format!("arith {op} {c} {o}"),
                        predicate: format!("({c} {op} {o}) = 0"),
                        op,
                        arity: 2,
                    });
                }
            }
            cases.push(Bt1bCase {
                label: format!("unary - {c}"),
                predicate: format!("(-{c}) = 0"),
                op: "-",
                arity: 1,
            });
            cases.push(Bt1bCase {
                label: format!("arith + 1 = 0 {c}"),
                predicate: format!("({c} + 1) = 0"),
                op: "+",
                arity: 2,
            });
            cases.push(Bt1bCase {
                label: format!("arith * 2 = 0 {c}"),
                predicate: format!("({c} * 2) = 0"),
                op: "*",
                arity: 2,
            });
            cases.push(Bt1bCase {
                label: format!("arith / 0 = 0 {c}"),
                predicate: format!("({c} / 0) = 0"),
                op: "/",
                arity: 2,
            });
            cases.push(Bt1bCase {
                label: format!("arith self * then > 0 {c}"),
                predicate: format!("({c} * {c}) = 0"),
                op: "*",
                arity: 2,
            });
        }
        cases.push(Bt1bCase {
            label: "C29: u64 * i64 < 0.5".to_string(),
            predicate: "(u64 * i64) < 0.5".to_string(),
            op: "*",
            arity: 2,
        });
        cases.push(Bt1bCase {
            label: "C30: u64 * -9223372036854775808 < 0.5".to_string(),
            predicate: "(u64 * -9223372036854775808) < 0.5".to_string(),
            op: "*",
            arity: 2,
        });
        cases.push(Bt1bCase {
            label: "C31a: f32 * f32 > 0".to_string(),
            predicate: "(f32 * f32) > 0".to_string(),
            op: "*",
            arity: 2,
        });
        cases.push(Bt1bCase {
            label: "C31b: f64 + f64 > 0".to_string(),
            predicate: "(f64 + f64) > 0".to_string(),
            op: "+",
            arity: 2,
        });
        cases.push(Bt1bCase {
            label: "C32a: i32 + NULL > 0".to_string(),
            predicate: "(i32 + NULL) > 0".to_string(),
            op: "+",
            arity: 2,
        });
        cases.push(Bt1bCase {
            label: "C32b: -NULL > 0".to_string(),
            predicate: "(-NULL) > 0".to_string(),
            op: "-",
            arity: 1,
        });
        cases.push(Bt1bCase {
            label: "C33: (f32 + 1e3) = i32".to_string(),
            predicate: "(f32 + 1e3) = i32".to_string(),
            op: "+",
            arity: 2,
        });
        cases
    }

    fn bt1b_plan_json(conn: &Connection, predicate: &str) -> Value {
        let sql = format!("SELECT * FROM fx1 WHERE ({predicate})");
        let j: String = conn
            .query_row(
                "SELECT json_serialize_plan(CAST(? AS VARCHAR))",
                [sql.as_str()],
                |r| r.get(0),
            )
            .unwrap_or_else(|e| panic!("{predicate:?}: json_serialize_plan failed: {e}"));
        serde_json::from_str(&j)
            .unwrap_or_else(|e| panic!("{predicate:?}: plan JSON parse failed: {e}"))
    }

    fn bt1b_find_filter_exprs(v: &Value, out: &mut Vec<Value>) {
        match v {
            Value::Object(m) => {
                if m.get("type").and_then(Value::as_str) == Some("LOGICAL_FILTER") {
                    if let Some(e) = m.get("expressions") {
                        out.push(e.clone());
                    }
                }
                for (_, x) in m {
                    bt1b_find_filter_exprs(x, out);
                }
            }
            Value::Array(a) => a.iter().for_each(|x| bt1b_find_filter_exprs(x, out)),
            _ => {}
        }
    }

    fn bt1b_type_str(t: &Value) -> String {
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

    /// Every `BOUND_FUNCTION` under `v` named `name` with exactly `arity` children -- the plan's
    /// own oracle for the one arithmetic node each [`Bt1bCase`] carries.
    fn bt1b_find_function_return_types(v: &Value, name: &str, arity: usize, out: &mut Vec<String>) {
        match v {
            Value::Object(m) => {
                if m.get("expression_class").and_then(Value::as_str) == Some("BOUND_FUNCTION")
                    && m.get("is_operator").and_then(Value::as_bool) == Some(true)
                    && m.get("name").and_then(Value::as_str) == Some(name)
                    && m.get("children").and_then(Value::as_array).map(|c| c.len()) == Some(arity)
                {
                    out.push(bt1b_type_str(&m["return_type"]));
                }
                for (_, x) in m {
                    bt1b_find_function_return_types(x, name, arity, out);
                }
            }
            Value::Array(a) => a
                .iter()
                .for_each(|x| bt1b_find_function_return_types(x, name, arity, out)),
            _ => {}
        }
    }

    /// [`EngineType`] rendered the way `json_serialize_plan` names it -- identical to
    /// [`EngineType`]'s own `Display` except `Real`, whose engine-facing name is `REAL` (section
    /// 2.2's own rendering) while DuckDB's internal type id is `FLOAT` (measured at v1.5.5).
    fn bt1b_engine_type_as_plan_id(ty: &EngineType) -> String {
        match ty {
            EngineType::Real => "FLOAT".to_string(),
            other => other.to_string(),
        }
    }

    /// B-T1b, `the_walk_types_every_arithmetic_node_as_the_binder_does`
    /// (`FILTER-BIND-COERCIONS-PREREGISTRATION.md` section 10 Amendment 4). For every arithmetic
    /// node the walk types `Ok`, asserts that the walk's type equals the `return_type` of that
    /// node in `json_serialize_plan`, `/`'s own node included. Private access within the crate
    /// adds no `pub` item (section 2.11). Mutation: rule 6 returns the float column's own type
    /// beside a double literal (the arm at ff3a841). It fails by name on the `f32 + 1e3` cases.
    #[test]
    fn the_walk_types_every_arithmetic_node_as_the_binder_does() {
        let conn = Connection::open_in_memory().expect("in-memory duckdb connection");
        conn.execute_batch(
            "CREATE TABLE fx1 (
                zone VARCHAR, flag BOOLEAN,
                i8 TINYINT, i16 SMALLINT, i32 INTEGER, i64 BIGINT,
                u8 UTINYINT, u16 USMALLINT, u32 UINTEGER, u64 UBIGINT,
                f32 REAL, f64 DOUBLE
            )",
        )
        .expect("create the FX-1-shaped in-memory table");

        let namespace: BTreeMap<String, &'static str> =
            BT1B_COLS.iter().map(|(n, t)| (n.to_string(), *t)).collect();

        let cases = bt1b_generate_cases();
        assert_eq!(cases.len(), 2_083, "B-T1b's own rebuilt case count");

        let mut checked = 0usize;
        let mut failures: Vec<String> = Vec::new();

        for case in &cases {
            let admission = match structural_admit(&case.predicate, &conn) {
                Ok(a) => a,
                Err(_) => continue, // refused before the type walk; nothing to compare.
            };
            let Some(top) = admission.operands.into_iter().next() else {
                continue;
            };
            let arith_node = top.get("left").cloned().unwrap_or_else(|| top.clone());
            let typed = match type_of_value(&arith_node, &namespace) {
                Ok(t) => t,
                Err(_) => continue, // the walk itself refuses this node; nothing to compare.
            };

            let plan = bt1b_plan_json(&conn, &case.predicate);
            let mut filters = Vec::new();
            bt1b_find_filter_exprs(&plan, &mut filters);
            let mut return_types = Vec::new();
            for f in &filters {
                bt1b_find_function_return_types(f, case.op, case.arity, &mut return_types);
            }
            if return_types.is_empty() {
                // Constant-folded away at v1.5.5 (for example a NULL-involving node) -- not
                // independently observable through this plan-based oracle.
                continue;
            }
            checked += 1;
            let expected = bt1b_engine_type_as_plan_id(&typed.ty);
            for observed in &return_types {
                if *observed != expected {
                    failures.push(format!(
                        "{}: the walk says {expected}, the plan's {} return_type says {observed}",
                        case.label, case.op
                    ));
                }
            }
        }

        println!(
            "B-T1b: {checked} arithmetic nodes checked, {} failures",
            failures.len()
        );
        for f in failures.iter().take(40) {
            println!("  {f}");
        }
        assert!(
            failures.is_empty(),
            "{} B-T1b counterexample(s); see the report above",
            failures.len()
        );
        assert!(
            checked > 0,
            "B-T1b must actually check at least one arithmetic node"
        );
    }
}
