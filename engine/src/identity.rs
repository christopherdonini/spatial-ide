// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Stable feature identity, and the admission policy for a source that carries it under another
//! name — **ADR-016 (Proposed)**.
//!
//! ADR-010 rule 2 resolves picking through `GPU ordinal → stable feature ID → authoritative f64`.
//! A native `id` column satisfies that with no transform between file bytes and wire. A *mapping*
//! adds obligations that are not free, and this module exists to make them structural rather than
//! remembered:
//!
//! - the mapping is **declared**, never inferred (ADR-016 §3);
//! - it is **deterministic and value-preserving**, which is what keeps identity orthogonal to
//!   ADR-005's grades **by construction** rather than by assertion (§4);
//! - uniqueness is verified over the **mapped** values (§5) — distinctness of the source column
//!   proves nothing about what the engine emits;
//! - the envelope records **what was checked**, never a bare "unique" (§6).
//!
//! What this does *not* establish is stated in ADR-016's Context and is not restated as reassurance
//! here: identity is a function of (file, declared mapping), and nothing in this slice pins a file
//! revision, so two opens agreeing is a property of an immutable source rather than one the engine
//! established.

use crate::error::{EngineError, Result};

/// Where the engine's identity came from.
///
/// The `crs_source` precedent (ADR-015 §3), applied to identity: a caller's declaration and a file
/// fact stay distinguishable all the way onto the wire. **The basis is `docs/11`** — "the
/// ID-assignment policy is per dataset and recorded in metadata" — and `docs/01` principle 8, *not*
/// ADR-010 rule 1, whose tag-on-envelope clause is about coordinate space (ADR-016 §6).
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum IdSource {
    /// The file's own `id` column, read with no transform.
    File,
    /// A caller-declared mapping from a named source column.
    Mapped { column: String, by: String, at: String },
}

impl IdSource {
    /// The envelope value. `mapped:` carries the column, because a consumer handed two identity
    /// spaces over the same bytes can only tell them apart by which column produced them.
    pub fn as_envelope_value(&self) -> String {
        match self {
            Self::File => format!("file:{}", crate::envelope::ID_COLUMN),
            Self::Mapped { column, .. } => format!("mapped:{column}"),
        }
    }

    pub fn source_column(&self) -> &str {
        match self {
            Self::File => crate::envelope::ID_COLUMN,
            Self::Mapped { column, .. } => column,
        }
    }
}

/// What was actually checked about uniqueness — **never the bare word "unique"**.
///
/// ADR-015 §5's `axis_normalization = none-performed` discipline applied here: the record says what
/// was done, not what is hoped. A consumer that cannot tell a verified identity from an unverified
/// one is in exactly the position ADR-016's Context describes.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum IdUniqueness {
    /// Every value in the column was counted, at open, over the whole file.
    VerifiedAtOpenFullFile,
    /// Declared by the caller and **not** checked. Reachable only by explicit opt-out.
    DeclaredNotVerified,
}

impl IdUniqueness {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::VerifiedAtOpenFullFile => "verified-at-open-full-file",
            Self::DeclaredNotVerified => "declared-not-verified",
        }
    }
}

/// A caller's declaration that a named column carries this dataset's feature identity.
///
/// **Never inferred.** Guessing "this column looks like an id" from a name, a type or a cardinality
/// is the data doctor's *proposal* territory (`docs/05`: detect → propose → preview → apply, with
/// confidence scores) and is Alpha work. ADR-016 is its floor: the data doctor may propose an
/// identity column with a preview; it may never silently supply one.
#[derive(Clone, Debug)]
pub struct IdentityDeclaration {
    /// The source column to read identity from.
    pub column: String,
    /// Who declared it, and when. Same shape as `CrsAssertion`'s, for the same reason: a claim
    /// carries its claimant.
    pub by: String,
    pub at: String,
    /// Skip the uniqueness scan. **Opt-out, and it is recorded as such on every batch envelope** —
    /// a caller may take responsibility for a fact, but not hide that it did.
    pub skip_uniqueness_check: bool,
}

impl IdentityDeclaration {
    pub fn new(column: impl Into<String>, by: impl Into<String>, at: impl Into<String>) -> Self {
        Self {
            column: column.into(),
            by: by.into(),
            at: at.into(),
            skip_uniqueness_check: false,
        }
    }
}

/// The admitted identity: where it came from, and what was verified about it.
#[derive(Clone, Debug)]
pub struct DatasetIdentity {
    source: IdSource,
    uniqueness: IdUniqueness,
    /// Rows the uniqueness check counted. `None` when it did not run.
    verified_rows: Option<u64>,
    /// Largest value observed, when the check ran.
    ///
    /// Recorded because **width is part of the contract** (ADR-016 §7): a JS consumer reading ids
    /// as `BigUint64Array` is correct only while values stay below 2⁵³, and an unhandled BigInt is
    /// the M4 root cause behind ADR-010 rule 7. The engine carries u64 exactly; this lets a
    /// consumer see, from the envelope, whether narrowing would have been lossy — instead of
    /// finding out per value.
    max_value: Option<u64>,
}

/// Values at or above this cannot survive a round trip through a JS `Number` (ADR-016 §7).
pub const JS_EXACT_INTEGER_LIMIT: u64 = 1 << 53;

impl DatasetIdentity {
    pub(crate) fn new(
        source: IdSource,
        uniqueness: IdUniqueness,
        verified_rows: Option<u64>,
        max_value: Option<u64>,
    ) -> Self {
        Self { source, uniqueness, verified_rows, max_value }
    }

    pub fn source(&self) -> &IdSource {
        &self.source
    }
    pub fn uniqueness(&self) -> IdUniqueness {
        self.uniqueness
    }
    pub fn verified_rows(&self) -> Option<u64> {
        self.verified_rows
    }
    pub fn max_value(&self) -> Option<u64> {
        self.max_value
    }

    /// Whether every observed id survives a JS `Number` exactly. `None` when unverified — which is
    /// itself the answer a consumer needs, and is why it is not defaulted to `true`.
    pub fn js_exact(&self) -> Option<bool> {
        self.max_value.map(|m| m < JS_EXACT_INTEGER_LIMIT)
    }
}

/// The file's 64-bit integer columns — `Int64` and `UInt64` only, narrower than the widths
/// [`admit_column_type`] below still accepts — in schema order (NEXT-CUT.md P0, the
/// admission-remediation cut's declare-identity flow).
///
/// Unranked and unpreselected: ADR-016 §3's "declared, never inferred" extends to this list
/// itself. It names candidates a remediation UI may offer a caller to choose among; it is never a
/// recommendation, a score, or a "looks like an id" guess (that inference is Alpha data-doctor
/// territory, `docs/05`).
pub(crate) fn candidate_identity_columns(schema: &arrow::datatypes::SchemaRef) -> Vec<String> {
    use arrow::datatypes::DataType as D;
    schema
        .fields()
        .iter()
        .filter(|f| matches!(f.data_type(), D::Int64 | D::UInt64))
        .map(|f| f.name().clone())
        .collect()
}

/// The SQL type of a candidate identity column, classified by whether reading it into `u64`
/// **preserves the value**.
///
/// This is the whole of ADR-016 §4's "value-preserving" test, and it is deliberately a short list.
/// Anything that would require a hash, a dictionary index, or a scan-order ordinal is refused: those
/// are synthesized ordinals wearing a mapping's clothes, and §2 already refuses synthesized
/// ordinals — a mapping may not readmit them under another name.
pub(crate) fn admit_column_type(
    column: &str,
    ty: &arrow::datatypes::DataType,
    schema: &arrow::datatypes::SchemaRef,
) -> Result<()> {
    use arrow::datatypes::DataType as D;
    match ty {
        // Widening into u64 is exact. A signed type is admitted here and its *values* are checked
        // when they are read — a negative id is refused there, not assumed absent here.
        D::UInt64 | D::UInt32 | D::UInt16 | D::UInt8 | D::Int64 | D::Int32 | D::Int16 | D::Int8 => {
            Ok(())
        }
        other => Err(EngineError::IdentityUnusable {
            column: column.to_string(),
            detail: format!(
                "type is {other}; identity must be an integer that widens into u64 without \
                 transformation. A hash, a dictionary index or a row ordinal is not a mapping — it \
                 is a synthesized identity, which ADR-016 refuses"
            ),
            candidate_columns: candidate_identity_columns(schema),
        }),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use arrow::datatypes::DataType as D;

    fn schema_with(name: &str, ty: D) -> arrow::datatypes::SchemaRef {
        std::sync::Arc::new(arrow::datatypes::Schema::new(vec![arrow::datatypes::Field::new(
            name, ty, true,
        )]))
    }

    #[test]
    fn only_value_preserving_integer_types_are_admitted() {
        for ty in [D::UInt64, D::Int64, D::UInt32, D::Int32, D::Int16, D::UInt8] {
            let schema = schema_with("k", ty.clone());
            assert!(admit_column_type("k", &ty, &schema).is_ok(), "{ty} should widen exactly");
        }
        // Each of these would need a transform to become a u64, and a transform is where
        // collisions and scan-order dependence enter.
        for ty in [D::Utf8, D::Float64, D::Binary, D::Boolean] {
            let schema = schema_with("k", ty.clone());
            assert!(admit_column_type("k", &ty, &schema).is_err(), "{ty} must be refused");
        }
    }

    #[test]
    fn candidate_columns_are_the_64_bit_integer_columns_in_schema_order_unranked() {
        use arrow::datatypes::Field;
        let schema = std::sync::Arc::new(arrow::datatypes::Schema::new(vec![
            Field::new("name", D::Utf8, true),
            Field::new("big_signed", D::Int64, false),
            Field::new("small_signed", D::Int32, false),
            Field::new("big_unsigned", D::UInt64, false),
            Field::new("geometry", D::Binary, false),
        ]));
        assert_eq!(
            candidate_identity_columns(&schema),
            vec!["big_signed".to_string(), "big_unsigned".to_string()],
            "schema order, Int64 and UInt64 only — no Int32, no ranking"
        );
    }

    #[test]
    fn the_envelope_value_names_the_column_a_mapped_identity_came_from() {
        let native = IdSource::File;
        assert_eq!(native.as_envelope_value(), "file:id");

        let mapped = IdSource::Mapped {
            column: "parcel_key".into(),
            by: "operator".into(),
            at: "2026-08-05T00:00:00Z".into(),
        };
        // Two callers declaring different columns get two identity spaces over the same bytes;
        // the column name is what lets a consumer tell them apart (ADR-016 Consequences).
        assert_eq!(mapped.as_envelope_value(), "mapped:parcel_key");
    }

    #[test]
    fn uniqueness_is_reported_as_what_was_checked() {
        assert_eq!(IdUniqueness::VerifiedAtOpenFullFile.as_str(), "verified-at-open-full-file");
        assert_eq!(IdUniqueness::DeclaredNotVerified.as_str(), "declared-not-verified");
    }

    #[test]
    fn js_exactness_is_unknown_rather_than_assumed_when_nothing_was_verified() {
        let unverified =
            DatasetIdentity::new(IdSource::File, IdUniqueness::DeclaredNotVerified, None, None);
        assert_eq!(unverified.js_exact(), None, "unknown must not default to true");

        let small = DatasetIdentity::new(
            IdSource::File,
            IdUniqueness::VerifiedAtOpenFullFile,
            Some(10),
            Some(9),
        );
        assert_eq!(small.js_exact(), Some(true));

        let huge = DatasetIdentity::new(
            IdSource::File,
            IdUniqueness::VerifiedAtOpenFullFile,
            Some(2),
            Some(JS_EXACT_INTEGER_LIMIT),
        );
        assert_eq!(huge.js_exact(), Some(false), "2^53 itself does not round-trip");
    }
}
