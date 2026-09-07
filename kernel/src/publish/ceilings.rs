// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The bundled viewer's declared ceilings, read by the publish preflight (**RELEASE-0.1 item
//! 3e**; **ADR-025**'s Decision: *"the ceilings' figures live in the viewer's own declared
//! constants … read at preflight — never a second copy that can drift"*).
//!
//! **ONE source, two readers.** `renderer/bundle-viewer/ceilings.json` is the single file both
//! this module (`include_str!`, compiled in) and `renderer/bundle-viewer/src/render.ts` (a JSON
//! import, re-exported as its five `MAX_*` constants) read. Neither side owns a second copy of
//! the five numbers — the pattern is [`crate::bundle`]'s CRS-catalog one
//! (`engine/src/crs_catalog.rs`'s `CATALOG_JSON` + its pinned-hash test), applied here to a
//! five-field object instead of an array of definitions.
//!
//! **Growing or changing this set is a reviewed change**, same as the CRS catalog: the pinned-hash
//! unit test below exists so an edit to `ceilings.json` cannot pass review silently.

use std::sync::OnceLock;

use serde_json::Value;

use super::error::PublishError;

/// The ceilings file's raw text, compiled in at build time from the ONE source both readers share.
const CEILINGS_JSON: &str = include_str!("../../../renderer/bundle-viewer/ceilings.json");

/// The bundled viewer's declared ceilings — mirrors `renderer/bundle-viewer/src/render.ts`'s five
/// `MAX_*` constants exactly, because both are re-exports/parses of the same JSON file.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct ReaderCeilings {
    pub max_features: u64,
    pub max_partitions: u64,
    pub max_resident_bytes: u64,
    pub max_attribute_columns: u64,
    pub max_attribute_display_chars: u64,
}

fn field_u64(root: &Value, field: &'static str) -> u64 {
    root.get(field)
        .and_then(Value::as_u64)
        .unwrap_or_else(|| {
            panic!(
                "renderer/bundle-viewer/ceilings.json has no integer `{field}` -- this is a \
                 compiled-in constant, not caller input, so a missing/malformed field here is a \
                 build-time defect"
            )
        })
}

fn parse_ceilings() -> ReaderCeilings {
    let root: Value = serde_json::from_str(CEILINGS_JSON).unwrap_or_else(|e| {
        panic!(
            "renderer/bundle-viewer/ceilings.json failed to parse -- this is a compiled-in \
             constant, not caller input, so a parse failure here is a build-time defect: {e}"
        )
    });
    ReaderCeilings {
        max_features: field_u64(&root, "MAX_FEATURES"),
        max_partitions: field_u64(&root, "MAX_PARTITIONS"),
        max_resident_bytes: field_u64(&root, "MAX_RESIDENT_BYTES"),
        max_attribute_columns: field_u64(&root, "MAX_ATTRIBUTE_COLUMNS"),
        max_attribute_display_chars: field_u64(&root, "MAX_ATTRIBUTE_DISPLAY_CHARS"),
    }
}

static CEILINGS: OnceLock<ReaderCeilings> = OnceLock::new();

/// The bundled viewer's declared ceilings. Parsed once, on first use.
pub fn reader_ceilings() -> ReaderCeilings {
    *CEILINGS.get_or_init(parse_ceilings)
}

/// The alternative every reader-ceiling refusal names (the human's ruling on ADR-025, entry 53/B3:
/// "reading = refuse-at-preflight, typed, naming the viewport-bbox alternative").
pub(crate) const VIEWPORT_BBOX_ALTERNATIVE: &str =
    "publish the current-viewport bbox instead of the whole file (the viewer's ceilings apply to \
     what a bundle carries, not to what the source dataset holds)";

/// What preflight can predict against the reader's ceilings, checked against real values rather
/// than against a fixture-sized proxy (kept free of `Dataset`/`PublishedProjection` so it can be
/// unit-tested at realistic ceiling values without writing a multi-million-row fixture to disk —
/// `kernel/tests/publish.rs` still exercises the real, wired-up `preflight()` end to end at every
/// existing (small, within-ceiling) fixture, which is what proves this function is actually
/// reached from there).
///
/// **What this cannot and does not check** (named, not silently absorbed — `docs/01` principle 8):
/// `MAX_PARTITIONS` and `MAX_RESIDENT_BYTES` are properties of the *emitted bundle*
/// (partition count, on-disk/resident size), neither of which preflight can predict before a
/// single partition is streamed and written — the write-time `MAX_PUBLISH_PARTITIONS` check
/// (`run_inner`, this module's parent) stands for partitions; nothing predicts resident bytes at
/// any stage today. `predicted_features` is itself `None` when the dataset's identity was opened
/// `DeclaredNotVerified` (`engine/src/identity.rs`, the `skip_uniqueness_check` route) — a real gap
/// this function states rather than hides: such a dataset's feature count is not predictable at
/// preflight either, and a publish above `MAX_FEATURES` on that route is refused only by the
/// viewer, exactly the gap ADR-025 was filed to close, left open for this one identity route.
pub(crate) fn check_reader_ceilings(
    predicted_features: Option<u64>,
    projected_attribute_columns: u64,
    ceilings: &ReaderCeilings,
) -> Result<(), PublishError> {
    if let Some(features) = predicted_features {
        if features > ceilings.max_features {
            return Err(PublishError::ReaderCeilingExceeded {
                ceiling: "MAX_FEATURES",
                limit: ceilings.max_features,
                predicted: features,
                alternative: VIEWPORT_BBOX_ALTERNATIVE,
            });
        }
    }
    if projected_attribute_columns > ceilings.max_attribute_columns {
        return Err(PublishError::ReaderCeilingExceeded {
            ceiling: "MAX_ATTRIBUTE_COLUMNS",
            limit: ceilings.max_attribute_columns,
            predicted: projected_attribute_columns,
            alternative: VIEWPORT_BBOX_ALTERNATIVE,
        });
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    /// **Pinned, like the CRS catalog's `EPSG_2056_HASH`.** A change to `ceilings.json` must be a
    /// reviewed, conscious edit to this literal, not a silent drift between the two readers.
    #[test]
    fn ceilings_json_is_pinned_to_the_five_values_both_readers_share() {
        let c = reader_ceilings();
        assert_eq!(c.max_features, 2_000_000);
        assert_eq!(c.max_partitions, 100_000);
        assert_eq!(c.max_resident_bytes, 512 * 1024 * 1024);
        assert_eq!(c.max_attribute_columns, 32);
        assert_eq!(c.max_attribute_display_chars, 512);
    }

    #[test]
    fn a_feature_count_at_or_below_the_ceiling_is_not_refused() {
        let c = reader_ceilings();
        assert!(check_reader_ceilings(Some(c.max_features), 1, &c).is_ok());
        assert!(check_reader_ceilings(None, 1, &c).is_ok(), "unpredictable feature count must not refuse");
    }

    #[test]
    fn a_feature_count_above_the_ceiling_refuses_typed_and_names_the_viewport_bbox_alternative() {
        let c = reader_ceilings();
        match check_reader_ceilings(Some(c.max_features + 1), 1, &c) {
            Err(PublishError::ReaderCeilingExceeded { ceiling, limit, predicted, alternative }) => {
                assert_eq!(ceiling, "MAX_FEATURES");
                assert_eq!(limit, c.max_features);
                assert_eq!(predicted, c.max_features + 1);
                assert!(alternative.contains("viewport"), "must name the viewport-bbox alternative");
            }
            other => panic!("expected ReaderCeilingExceeded, got {other:?}"),
        }
    }

    #[test]
    fn an_attribute_column_count_above_the_ceiling_refuses_typed() {
        let c = reader_ceilings();
        match check_reader_ceilings(Some(0), c.max_attribute_columns + 1, &c) {
            Err(PublishError::ReaderCeilingExceeded { ceiling, .. }) => {
                assert_eq!(ceiling, "MAX_ATTRIBUTE_COLUMNS");
            }
            other => panic!("expected ReaderCeilingExceeded, got {other:?}"),
        }
    }

    #[test]
    fn an_attribute_column_count_at_the_ceiling_is_not_refused() {
        let c = reader_ceilings();
        assert!(check_reader_ceilings(Some(0), c.max_attribute_columns, &c).is_ok());
    }
}
