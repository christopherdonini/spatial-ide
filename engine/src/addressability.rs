// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The one classifying function** for a column name that does not round-trip through this
//! engine's own admission (`engine/B1-PROJECTION-PREREGISTRATION.md` §10 Amendment 12, 12.1(c)).
//!
//! A name is **not addressable** when either:
//! - its [`Field`] carries an exported name (`dataset.rs::probe_schema`'s reconciliation) that
//!   differs from its bound (resident) name; or
//! - the name itself contains U+0000 — the rule for a name no comparison covers, such as a
//!   covering's struct-child segment (12.1(c), E1, E3).
//!
//! **[`not_addressable`] is the one classifying function.** It takes a name plus an optional
//! exported name and returns the typed engine fact 12.1(c) declares: the bound name, the exported
//! name where there is one, and the byte offset of the first U+0000. [`not_addressable_for_field`]
//! is the `Field` entry point every caller that already holds one uses, so it never has to read the
//! metadata key itself. Every use by name in this crate goes through one of these two functions —
//! projection (`attributes.rs::check_geometry_and_identity`, the one site both projection paths
//! share), `describe`'s `projectable`, the filter namespace (`predicate.rs::filterable_column_type`),
//! geometry (`dataset.rs::check_geometry_column`), both identity arms (`dataset.rs::admit_identity`),
//! the candidate list (`identity.rs::candidate_identity_columns`) and a covering's declared path
//! segments, which have no `Field` to compare and so call [`not_addressable`] directly, one segment
//! at a time (`dataset.rs::covering_not_addressable_reason`). **There is no second classification
//! function** (12.4 item 25): every one of those sites calls into this module, never re-implements
//! the U+0000 or exported-name test itself. A message site renders a [`NotAddressableFact`] through
//! [`NotAddressableFact::render`], which itself goes through [`render_visible_escape`].

use arrow::datatypes::Field;

/// The [`Field`] metadata key carrying a position's DuckDB Arrow-export name, set only where it
/// differs from the resident (DESCRIBE-bound) name this crate now names the field by (§7's one new
/// declaration). Internal only: never serialized to SKP or into a frame (§8 item 8).
pub(crate) const EXPORTED_NAME_KEY: &str = "spatial.exported_name";

/// Render U+0000 as the six visible ASCII characters `\u0000` — the one rendering function every
/// engine message, detail and log line that names a column goes through (§8 item 34; test N-1a).
/// A name carrying no U+0000 is returned unchanged, so this is a no-op for every ordinary column.
pub(crate) fn render_visible_escape(name: &str) -> String {
    if name.contains('\0') {
        name.replace('\0', "\\u0000")
    } else {
        name.to_string()
    }
}

/// The typed engine fact 12.1(c) declares for a name that is not addressable: the bound (resident)
/// name, the exported name where DuckDB's Arrow export reported one differing from it, and the byte
/// offset of the first U+0000 in the bound name, where it carries one. A message site renders this
/// fact through [`Self::render`] rather than re-deriving prose from the two names itself.
#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) struct NotAddressableFact {
    pub(crate) bound: String,
    pub(crate) exported: Option<String>,
    pub(crate) nul_offset: Option<usize>,
}

impl NotAddressableFact {
    /// The prose every message site carried inline before this fact existed — kept byte for byte
    /// (12.3: declared unchanged for every name that round-trips is untouched, and this text is
    /// unchanged for a name that does not). Both names are rendered through
    /// [`render_visible_escape`], so a caller may carry this string directly into a `detail` or
    /// `reason` field without a second pass (§8 item 34).
    pub(crate) fn render(&self) -> String {
        match &self.exported {
            Some(exported) => format!(
                "the resident name `{}` is not addressable: DuckDB's Arrow export reports this \
                 position as `{}`, a different name than the one DESCRIBE binds it by, so no \
                 SELECT list built from either name can be trusted to reach it",
                render_visible_escape(&self.bound),
                render_visible_escape(exported)
            ),
            None => format!(
                "the name `{}` contains U+0000, and no SQL statement can address an identifier \
                 carrying it",
                render_visible_escape(&self.bound)
            ),
        }
    }
}

/// **The one classifying function (12.1(c)).** `Some(fact)` when `bound` is not addressable —
/// `None` when it round-trips (`exported` is either absent or equal to `bound`, and `bound` carries
/// no U+0000). Every use by name in this crate that does not already hold a [`Field`] — a covering's
/// declared path segment, which has no independent DESCRIBE name to reconcile it against — calls
/// this directly, one segment at a time, with `exported: None` (12.1(c)'s second bullet).
pub(crate) fn not_addressable(bound: &str, exported: Option<&str>) -> Option<NotAddressableFact> {
    let nul_offset = bound.find('\0');
    let differs = exported.is_some_and(|e| e != bound);
    if nul_offset.is_none() && !differs {
        return None;
    }
    Some(NotAddressableFact {
        bound: bound.to_string(),
        exported: exported.map(str::to_string),
        nul_offset,
    })
}

/// The `Field` entry point every caller that already holds one uses, so it never re-reads
/// [`EXPORTED_NAME_KEY`] itself (12.1(c)'s "a `Field` entry point wraps it").
pub(crate) fn not_addressable_for_field(field: &Field) -> Option<NotAddressableFact> {
    not_addressable(
        field.name().as_str(),
        field.metadata().get(EXPORTED_NAME_KEY).map(String::as_str),
    )
}
