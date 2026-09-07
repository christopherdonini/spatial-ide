// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The pinned CRS definition catalog (**ADR-026**, Accepted, decision 1(a)): a small, in-tree,
//! plain-text, content-hashed set of full PROJJSON definitions an operator may choose from when
//! asserting a CRS for a file that declares none (see [`crate::crs::CrsAssertion`]).
//!
//! - **Compiled in via `include_str!`, never fetched at runtime** (ADR-026 decision 3 — the
//!   ADR-021 statically-linked-parser security property applied here: an assertion works offline
//!   and its inputs are exactly what the repository pins).
//! - **File order, no ranking.** [`entries`] returns the catalog in the order the JSON array
//!   declares — no sorting, no scoring, nothing that could read as a recommendation (ADR-026
//!   decision 4).
//! - **Not a lookup table.** Nothing here matches, scores, defaults, or suggests an entry for a
//!   particular file. The caller picks an entry (or pastes their own definition, `crs_catalog`'s
//!   sibling route), and the definition travels verbatim (ADR-015 §1).
//!
//! [`definition_provenance`] is the host-derived audit fact ADR-026 decision 2 asks for: the
//! record names the definition's own provenance — a catalog entry id and content hash, or
//! `pasted` — never just an identifier string. It is exact-equality bookkeeping only: no
//! similarity, no normalization before hashing, no suggestion.

use std::sync::OnceLock;

use serde_json::Value;
use sha2::{Digest, Sha256};

/// The catalog's raw text, compiled in at build time. **Growing this set is a reviewed change**
/// (ADR-026 Consequences) — the pinned-hash unit test below exists so an edit here cannot pass
/// review silently.
const CATALOG_JSON: &str = include_str!("crs-catalog.json");

/// Attribution for a catalog entry's **source data**, carried as a field **beside** the entry —
/// never inside `definition` (entry 51: `definition`'s bytes are pinned/hash-checked against
/// `engine/tests/data/epsg2056.projjson` and must not change; the acknowledgement a source's terms
/// require is data about the entry, not part of what the parser reads as a CRS definition).
///
/// Read from the catalog JSON's `attribution` object with the same manual `field_str` reads
/// every other field here uses (a compiled-in constant's parse failure is a build-time defect,
/// not a runtime refusal; see `field_str`'s own doc comment) — no `serde::Deserialize` derive.
#[derive(Debug, Clone)]
pub struct Attribution {
    /// Acknowledgement of the source dataset's ownership, e.g.
    /// `"EPSG Geodetic Parameter Dataset, © IOGP"` — the EPSG Dataset Terms of Use's
    /// "Ownership of the EPSG Dataset by IOGP must be acknowledged in any publication or
    /// transmission… thereof" (quoted verbatim in `DEPENDENCY-LICENSES.md`'s "Third-party data
    /// terms" section).
    pub source: String,
    /// The terms-of-use URL a recipient of this definition must be informed of — the same
    /// section's "You are obliged to inform anyone to whom you provide the EPSG Facilities of
    /// these Terms of Use."
    pub terms_url: String,
    /// A dated verification note. **Paraphrase**, not a verbatim quote — see
    /// `DEPENDENCY-LICENSES.md`'s "Third-party data terms" section, "Verification (3)"
    /// paragraph, for the full record this summarizes.
    pub verified: String,
}

/// One pinned catalog entry: identity, a human name, the full PROJJSON definition exactly as
/// stored, that definition's own content hash, and (where the source data's terms call for it)
/// an attribution.
#[derive(Debug, Clone)]
pub struct CatalogEntry {
    pub id: String,
    pub authority: String,
    pub code: u32,
    pub name: String,
    pub definition: String,
    /// Lowercase hex sha256 of `definition` exactly as stored — no normalization performed before
    /// hashing. **`attribution` below is not part of this hash's input** — only `definition` is
    /// (see `parse_catalog`) — so adding or editing `attribution` does not move this value or the
    /// pinned `EPSG_2056_HASH` literal in this module's tests.
    pub hash: String,
    /// `None` for an entry whose source data carries no such obligation. `crs-catalog.json`'s
    /// `epsg-2056` entry supplies one (entry 51: the EPSG Dataset Terms of Use's acknowledgement
    /// and inform-of-terms obligations).
    pub attribution: Option<Attribution>,
}

fn hex(bytes: &[u8]) -> String {
    let mut s = String::with_capacity(bytes.len() * 2);
    for b in bytes {
        s.push_str(&format!("{b:02x}"));
    }
    s
}

/// sha256, lowercase hex, of `text` exactly as given — no normalization of any kind.
pub fn sha256_hex(text: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(text.as_bytes());
    hex(&hasher.finalize())
}

/// Reads `field` off `entry` as a JSON string, or panics — a compiled-in constant that fails to
/// parse is a build-time defect (`crs-catalog.json` is never caller input), not a runtime refusal.
fn field_str<'a>(entry: &'a Value, field: &str, entry_index: usize) -> &'a str {
    entry.get(field).and_then(Value::as_str).unwrap_or_else(|| {
        panic!("engine/src/crs-catalog.json: entry {entry_index} has no string `{field}`")
    })
}

fn parse_catalog() -> Vec<CatalogEntry> {
    let root: Value = serde_json::from_str(CATALOG_JSON).unwrap_or_else(|e| {
        panic!(
            "engine/src/crs-catalog.json failed to parse -- this is a compiled-in constant, not \
             caller input, so a parse failure here is a build-time defect: {e}"
        )
    });
    let array = root
        .as_array()
        .unwrap_or_else(|| panic!("engine/src/crs-catalog.json: top level must be a JSON array"));

    array
        .iter()
        .enumerate()
        .map(|(i, entry)| {
            let id = field_str(entry, "id", i).to_string();
            let authority = field_str(entry, "authority", i).to_string();
            let code = entry
                .get("code")
                .and_then(Value::as_u64)
                .unwrap_or_else(|| panic!("engine/src/crs-catalog.json: entry {i} has no integer `code`"))
                as u32;
            let name = field_str(entry, "name", i).to_string();
            let definition = field_str(entry, "definition", i).to_string();
            let hash = sha256_hex(&definition);
            // An entry with no `attribution` key parses to `None` rather than failing; when the
            // key is present, every one of its three fields is required (`field_str` panics on a
            // missing/non-string field, same build-time-defect posture as every field above).
            let attribution = entry.get("attribution").map(|v| Attribution {
                source: field_str(v, "source", i).to_string(),
                terms_url: field_str(v, "terms_url", i).to_string(),
                verified: field_str(v, "verified", i).to_string(),
            });
            CatalogEntry { id, authority, code, name, definition, hash, attribution }
        })
        .collect()
}

static CATALOG: OnceLock<Vec<CatalogEntry>> = OnceLock::new();

/// The catalog, in file order (ADR-026 decision 4 — no sorting, no ranking). Parsed once, on
/// first use.
pub fn entries() -> &'static [CatalogEntry] {
    CATALOG.get_or_init(parse_catalog).as_slice()
}

/// The catalog entry, if any, whose pinned definition hash matches `definition_hash` exactly.
/// Exact-equality bookkeeping only (ADR-026 decision 2) — no similarity, no normalization.
pub fn find_by_definition_hash(definition_hash: &str) -> Option<&'static CatalogEntry> {
    entries().iter().find(|e| e.hash == definition_hash)
}

/// Host-derived provenance for a supplied PROJJSON definition text (ADR-026 decision 2).
///
/// Hashes `definition_json` **exactly as received** — no parsing, no reformatting, no
/// normalization before hashing — and compares against the catalog's own pinned hashes. A match
/// records `catalog:<id>@sha256:<first-12-hex>`; anything else, including a definition that
/// differs from a catalog entry by even one byte of whitespace, records `pasted` (retained per
/// DECISIONS-PENDING entry 25's 2026-09-03 ruling: the value records the route the operator took,
/// not the catalog check's outcome). `None` (no definition text at all) records `none-supplied`
/// (entry 30, same ruling's corollary): `pasted` here asserted an action that never happened —
/// the honest record of the None case is that no definition was supplied, so no hash and no
/// catalog comparison ever ran. `crs::admit` still refuses such an assertion for establishing no
/// axis order before this value is ever surfaced (`AxisOrderUnestablished`).
///
/// **This is the only place that compares a supplied definition against the catalog.** Nothing
/// else in this module — or ADR-026 — performs matching, scoring, or suggestion (decision 4); this
/// is bookkeeping about what already happened (the caller chose a route), not a recommendation
/// about what should happen.
pub fn definition_provenance(definition_json: Option<&str>) -> String {
    let Some(text) = definition_json else {
        return "none-supplied".to_string();
    };
    let hash = sha256_hex(text);
    match find_by_definition_hash(&hash) {
        Some(e) => format!("catalog:{}@sha256:{}", e.id, &e.hash[..12]),
        None => "pasted".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Pinned literal (task brief: "a catalog edit must consciously update this test"). Computed
    /// once from `engine/tests/data/epsg2056.projjson`'s own bytes — the fixture generators'
    /// proven in-tree EPSG:2056 definition (`engine/src/fixture.rs::LV95_PROJJSON`) — reused
    /// verbatim as this catalog's first entry, per this piece's brief.
    const EPSG_2056_HASH: &str =
        "254016888ff494a4099d72869206eaf4a8c1ef5a52fb94104540557c2f46d024";

    #[test]
    fn catalog_parses_and_is_not_empty() {
        assert!(!entries().is_empty());
    }

    #[test]
    fn every_entry_definition_carries_coordinate_system_axis() {
        // ADR-015 §5: `axis_order_from_projjson` refuses a definition with no
        // `coordinate_system.axis`. A catalog entry that could never establish an axis order
        // would be useless for the one thing this catalog exists to unblock.
        for e in entries() {
            let v: serde_json::Value = serde_json::from_str(&e.definition).unwrap_or_else(|err| {
                panic!("{}: definition is not valid JSON: {err}", e.id)
            });
            let axis = v.get("coordinate_system").and_then(|cs| cs.get("axis"));
            assert!(
                axis.is_some(),
                "{}: definition carries no coordinate_system.axis (ADR-015 §5)",
                e.id
            );
        }
    }

    /// The reviewer's named test (NOTE, reviewer gate, admission-remediation cut): binds
    /// `crs-catalog.json`'s pinned definition to its claimed source by *equality*, not by matching
    /// hashes alone (`epsg_2056_entry_hash_is_pinned` above already pins the hash; a hash match
    /// does not itself prove the two source texts are byte-identical, only that they hash the
    /// same). ADR-026's implementation note says the catalog "reuses … verbatim" the fixture
    /// generators' proven EPSG:2056 definition (`engine/src/fixture.rs::LV95_PROJJSON`, itself
    /// `engine/tests/data/epsg2056.projjson`) — this is what holds that claim true by test rather
    /// than by manual copy-paste discipline. Gated on the `fixture` feature because `LV95_PROJJSON`
    /// lives behind it (`crate::fixture`, `engine/src/lib.rs`); run via
    /// `cargo test -p spatial-engine --features fixture`.
    #[cfg(feature = "fixture")]
    #[test]
    fn epsg_2056_catalog_entry_is_byte_identical_to_the_fixture_generators_own_definition() {
        let e = entries().iter().find(|e| e.id == "epsg-2056").expect("epsg-2056 entry present");
        assert_eq!(e.definition, crate::fixture::LV95_PROJJSON);
    }

    #[test]
    fn epsg_2056_entry_hash_is_pinned() {
        let e = entries().iter().find(|e| e.id == "epsg-2056").expect("epsg-2056 entry present");
        assert_eq!(e.authority, "EPSG");
        assert_eq!(e.code, 2056);
        assert_eq!(e.hash, EPSG_2056_HASH, "catalog entry hash drifted from the pinned literal");
    }

    /// Entry 51 (1): every entry whose source is EPSG's own dataset carries the acknowledgement
    /// and terms URL the EPSG Dataset Terms of Use require ("Ownership… must be acknowledged in
    /// any publication or transmission…"; "You are obliged to inform anyone… of these Terms of
    /// Use" — `DEPENDENCY-LICENSES.md`'s "Third-party data terms" section). Written to hold for
    /// *every* EPSG entry so a future EPSG addition to the catalog cannot land unattributed.
    #[test]
    fn every_epsg_authority_entry_carries_attribution_with_the_terms_url() {
        let epsg_entries: Vec<&CatalogEntry> =
            entries().iter().filter(|e| e.authority == "EPSG").collect();
        assert!(!epsg_entries.is_empty(), "expected at least one EPSG-authority catalog entry");
        for e in epsg_entries {
            let attribution = e
                .attribution
                .as_ref()
                .unwrap_or_else(|| panic!("{}: authority is EPSG but attribution is None", e.id));
            assert_eq!(
                attribution.terms_url, "https://epsg.org/terms-of-use.html",
                "{}: attribution.terms_url",
                e.id
            );
            assert!(
                !attribution.source.trim().is_empty(),
                "{}: attribution.source is empty",
                e.id
            );
            assert!(
                !attribution.verified.trim().is_empty(),
                "{}: attribution.verified is empty",
                e.id
            );
        }
    }

    #[test]
    fn entries_are_in_file_order_not_sorted() {
        // Trivial with one entry today; asserts the *shape* of the guarantee (Vec preserving JSON
        // array order) rather than a fact that only holds by accident once the set grows.
        let ids: Vec<&str> = entries().iter().map(|e| e.id.as_str()).collect();
        assert_eq!(ids, vec!["epsg-2056"]);
    }

    #[test]
    fn a_catalog_supplied_definition_gets_catalog_provenance() {
        let text = &entries().iter().find(|e| e.id == "epsg-2056").unwrap().definition;
        let provenance = definition_provenance(Some(text));
        assert_eq!(provenance, format!("catalog:epsg-2056@sha256:{}", &EPSG_2056_HASH[..12]));
    }

    #[test]
    fn one_whitespace_change_loses_catalog_provenance_no_normalization() {
        let text = &entries().iter().find(|e| e.id == "epsg-2056").unwrap().definition;
        // A single extra trailing space -- proves the comparison is exact-byte, not JSON-value
        // equivalence and not whitespace-insensitive.
        let mutated = format!("{text} ");
        assert_eq!(definition_provenance(Some(&mutated)), "pasted");
    }

    #[test]
    fn an_arbitrary_valid_definition_is_pasted_never_matched() {
        let arbitrary = r#"{"type":"ProjectedCRS","name":"Not In The Catalog","coordinate_system":{"subtype":"Cartesian","axis":[{"name":"Easting","abbreviation":"E","direction":"east","unit":"metre"},{"name":"Northing","abbreviation":"N","direction":"north","unit":"metre"}]},"id":{"authority":"EPSG","code":9999999}}"#;
        assert_eq!(definition_provenance(Some(arbitrary)), "pasted");
    }

    #[test]
    fn no_definition_text_is_none_supplied_not_pasted_nor_a_panic_nor_a_false_match() {
        // Entry 30 (2026-09-03): `pasted` here asserted an action that never happened. The None
        // case records the observed non-supply — no hash, no catalog comparison ever ran.
        assert_eq!(definition_provenance(None), "none-supplied");
    }
}
