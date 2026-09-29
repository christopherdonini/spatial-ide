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
//! Every use by name in this crate goes through [`not_addressable_reason`] (projection, `describe`
//! `projectable`, the filter namespace) or, for a covering's declared path text — which has no
//! [`Field`] to compare — through the same U+0000 check applied directly to the raw segment text
//! (`dataset.rs::covering_not_addressable_reason`). There is no second classification function
//! (12.4 item 25).

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

/// `Some(reason)` when `field`'s name is not addressable — `None` when it round-trips. `reason` is
/// already rendered through [`render_visible_escape`], so a caller may carry it directly into a
/// `detail` or `reason` string without a second pass.
pub(crate) fn not_addressable_reason(field: &Field) -> Option<String> {
    let bound = field.name().as_str();
    let exported = field.metadata().get(EXPORTED_NAME_KEY).map(String::as_str);
    let nul = bound.contains('\0');
    let differs = exported.is_some_and(|e| e != bound);
    if !nul && !differs {
        return None;
    }
    Some(match exported {
        Some(exported) => format!(
            "the resident name `{}` is not addressable: DuckDB's Arrow export reports this \
             position as `{}`, a different name than the one DESCRIBE binds it by, so no SELECT \
             list built from either name can be trusted to reach it",
            render_visible_escape(bound),
            render_visible_escape(exported)
        ),
        None => format!(
            "the name `{}` contains U+0000, and no SQL statement can address an identifier \
             carrying it",
            render_visible_escape(bound)
        ),
    })
}
