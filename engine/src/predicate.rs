// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! An **admitted predicate** — SQL text this engine may compose directly into a `WHERE` clause.
//!
//! `NEXT-CUT.md`'s filter-in-SQL design note (architect note, binding) splits validation into three
//! named stages — structural admission against DuckDB's own parser, namespace admission against the
//! dataset's resident schema, and a bind check against a zero-row typed surrogate — and schedules
//! all three for a later piece in this same cut (P3, with P4 wiring the call site behind them). This
//! module exists now, ahead of that admission code, so [`crate::stream::ViewportQuery`] and
//! `build_sql` can compose against the **final** shape of a filtered query without waiting for it —
//! the same reason [`crate::attributes::PublishedProjection`] exists as a type distinct from the raw
//! column names a caller supplies, and this module copies that type's single-constructor discipline
//! deliberately, field for field.

/// SQL text admitted to ride, verbatim, into a `WHERE` clause.
///
/// **The single-constructor discipline [`crate::attributes::PublishedProjection`] uses, applied to
/// a predicate.** Without it, `build_sql` would take a bare `&str`, and every caller between the SKP
/// boundary and this composition step would be *trusted* not to have skipped admission — exactly the
/// shape a `docs/09` security boundary must not have. A type only constructible through one named
/// path is what makes "no caller reaches `build_sql` without going through admission" a property of
/// the type rather than a convention someone could forget to follow.
///
/// **What [`Self::assume_validated`] does NOT establish, stated plainly because the name is an
/// escape hatch and escape hatches get misread.** Nothing here parses the text, walks it against a
/// construct allowlist, resolves a column name against the dataset's resident schema, or asks
/// DuckDB whether it binds to `BOOLEAN`. Those are the three named admission stages the design note
/// describes — structural, namespace, and bind — and **none of them run in this crate today.** This
/// piece (P2) exists only so the type has its final shape before a later piece (P3) wires that
/// validation in front of the constructor, and a still-later piece (P4) moves the constructor call
/// itself behind it in `kernel/src/skp.rs`. The constructor's name says exactly what it is standing
/// in for; it is not a claim that anything has been checked.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct AdmittedPredicate {
    text: String,
}

impl AdmittedPredicate {
    /// Construct an `AdmittedPredicate` **without validating it.**
    ///
    /// The name is deliberately not `new`. A reader who finds `assume_validated` at a call site has
    /// to ask what validated it — and today the honest answer is "nothing; the admission piece has
    /// not landed yet". Once admission exists, the only caller of this constructor is meant to be
    /// the admission path itself, which becomes the thing doing the assuming *after* having actually
    /// checked structure, namespace and bind type. Nothing about how a predicate composes into SQL
    /// changes when that happens — only what is allowed to stand between a caller's raw text and
    /// this type does.
    pub fn assume_validated(text: String) -> Self {
        Self { text }
    }

    /// The predicate's SQL text, exactly as constructed — never rewritten, normalized, or
    /// case-folded on the way out. `build_sql` composes this verbatim into a `WHERE` clause, wrapped
    /// in exactly the one paren pair the design note describes.
    pub fn sql_text(&self) -> &str {
        &self.text
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn the_text_comes_back_exactly_as_given_never_rewritten() {
        let odd = "  zone = 'residential'  -- not touched";
        let p = AdmittedPredicate::assume_validated(odd.to_string());
        assert_eq!(p.sql_text(), odd);
    }
}
