// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! **The lasting dataset reference**: ADR-036 §5 (Proposed, binding nothing until the human
//! accepts it), built by `kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md` §2.4.
//!
//! A format and a comparison, and nothing else: this module opens nothing, reads nothing, hashes
//! nothing and takes no lease. A [`DatasetRef`] is built from an open dataset's existing accessors
//! alone and checked against another open the same way. It holds docs/11's six ResourceRef members
//! in the bundle's order (`bundle::ResourceRef`), the change-detection observation of the open it
//! was bound to beside them, and the claims the open was admitted under, in the wire's own types.
//!
//! - **A linked file is at most Reference-only** (ADR-005). The observation is a change detector
//!   (`engine/src/descriptor.rs`'s module header), not a content hash, a source revision or a
//!   snapshot claim: [`RefCheck::NoChangeDetected`] says no compared component differed, not that
//!   the file is the same one.
//! - **Nothing session-scoped is held**: no handle, session reference, generation, `by`/`at`
//!   attribution or absolute path, and no persisted feature id (ADR-016's OPEN).
//! - **The reader bounds every member and refuses rather than truncates.** `parse` takes a parsed
//!   [`Value`], which has collapsed a duplicate key: a file reader (piece 1c's) must refuse one.
//! - **A named state's basis is free text:** the reader accepts any bounded, non-blank basis and
//!   keeps none, and `to_json` writes this writer's own basis texts (ADR-036 §5).
//!
//! A producer ahead of its consumers, `b2-piece-1b-recording` and `b2-piece-1c-save-and-reopen`
//! (the human's round 8 exemption, the form's §2.6).

use std::fmt;
use std::str::FromStr;

use serde_json::{Map, Value};
use spatial_engine::crs::{CrsSource, MAX_CRS_DEFINITION_BYTES};
use spatial_engine::descriptor::SourceObservation;
use spatial_engine::identity::IdSource;
use spatial_engine::Dataset;
use spatial_renderer::canonical::Json;
use spatial_skp::v0::{CrsAssertion, IdentityDeclaration};

/// A dataset reference's URI prefix, then exactly [`URI_HEX_LEN`] lowercase hex characters. It
/// cannot collide with a bundle's `spatial://dataset/<name>`, whose name refuses `/`.
const DATASET_URI_PREFIX: &str = "spatial://dataset/ref/";
const URI_HEX_LEN: usize = 32;
/// The most locators a reference may carry, and the most bytes in any string member except
/// `definition_json` (bounded by the engine's own [`MAX_CRS_DEFINITION_BYTES`]).
const MAX_REF_LOCATORS: usize = 8;
const MAX_REF_STRING_BYTES: usize = 4_096;
/// 2^53 - 1, the largest integer every reader holds exactly (ADR-036 §2).
const MAX_EXACT_INTEGER: u64 = (1 << 53) - 1;

const KIND_PROJECT_RELATIVE: &str = "project-relative";
const KIND_MACHINE_RECORDED: &str = "machine-recorded";
const CACHE_LINKED: &str = "linked";
const LINKED_LIVE_FILE: &str = "linked-live-file";
const RESOURCE_KEYS: [&str; 6] = [
    "logical_uri",
    "content_hash",
    "source_revision",
    "locators",
    "cache_status",
    "portability_policy",
];

// A named state: the word is closed in version 1, and the basis is the text this writer writes. A
// reader accepts any other bounded, non-blank basis (`expect_state`).
const NOT_TAKEN: (&str, &str) = (
    "not-taken",
    "a linked file is not read into a hash; the observation beside the six members is a change \
     detector and not a content hash",
);
const NONE_PINNED: (&str, &str) = (
    "none-pinned",
    "this engine pins no revision of a linked file; the observation beside the six members is a \
     change detector and not a revision",
);
const NOT_REPORTED: (&str, &str) = (
    "not-reported",
    "the filesystem reported no modification time for this file when it was opened",
);
const NOT_READ_OVER_CEILING: (&str, &str) = (
    "not-read-over-ceiling",
    "the footer was over the declared ceiling and was not read or hashed",
);

/// A dataset reference's logical URI: `spatial://dataset/ref/` and 32 lowercase hex characters.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct DatasetUri(String);

impl DatasetUri {
    pub fn as_str(&self) -> &str {
        &self.0
    }

    /// A fresh URI: 128 bits from the operating system's CSPRNG (ADR-036 §4, OPEN-5 ruled (A)).
    pub fn mint() -> Self {
        let mut bytes = [0u8; URI_HEX_LEN / 2];
        getrandom::fill(&mut bytes).expect("OS CSPRNG unavailable");
        let hex: String = bytes.iter().map(|b| format!("{b:02x}")).collect();
        DatasetUri(format!("{DATASET_URI_PREFIX}{hex}"))
    }
}

impl FromStr for DatasetUri {
    type Err = RefParseError;

    fn from_str(s: &str) -> Result<Self, RefParseError> {
        parse_uri(s, "$")
    }
}

fn parse_uri(s: &str, path: &str) -> Result<DatasetUri, RefParseError> {
    match s.strip_prefix(DATASET_URI_PREFIX) {
        Some(hex) if hex.len() == URI_HEX_LEN && hex.bytes().all(is_lower_hex) => {
            Ok(DatasetUri(s.to_string()))
        }
        _ => Err(malformed(
            path,
            format!("expected `{DATASET_URI_PREFIX}` and {URI_HEX_LEN} lowercase hex characters"),
        )),
    }
}

fn is_lower_hex(b: u8) -> bool {
    matches!(b, b'0'..=b'9' | b'a'..=b'f')
}

/// One locator of a reference.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum Locator {
    /// A path relative to the project folder, `/`-separated, in canonical form. Built by piece 1c;
    /// held as written. Checked here for canonical form only: containment is checked by piece 1c's
    /// resolver, on the resolved target.
    ProjectRelative(String),
    /// The reference's own logical URI, which the machine's location store resolves.
    MachineRecorded,
}

/// The claims an open was admitted under, in the wire's own types and without attribution: a
/// reopen passes them to `open_dataset` as they are, and the host mints attribution there.
#[derive(Clone, Debug)]
pub struct Admission {
    pub crs_assertion: Option<CrsAssertion>,
    pub identity: Option<IdentityDeclaration>,
}

/// What [`DatasetRef::check`] found: facts only. What is done about a difference belongs to the
/// owner that acts on it.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RefCheck {
    /// No compared component differed. Not a statement that the file is the same one.
    NoChangeDetected,
    Differs {
        /// The observation's components, in the descriptor's own vocabulary.
        observed: Vec<&'static str>,
        /// `crs` and/or `identity`.
        admission: Vec<&'static str>,
    },
}

/// Why a reference could not be built: the open was admitted under a CRS assertion with no
/// definition. The engine allows one; the wire claim requires one, and an empty claim is not
/// recorded in its place.
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RefBuildError {
    AssertionWithoutDefinition,
}

/// Why a reference's text was refused: a closed set, each naming the member's path (`$` is the
/// entry).
#[derive(Clone, Debug, PartialEq, Eq)]
pub enum RefParseError {
    UnknownMember { path: String },
    MissingMember { path: String },
    UnknownState { path: String, value: String },
    OverCeiling { path: String, ceiling: u64 },
    Malformed { path: String, detail: String },
}

macro_rules! error_shown_as_its_debug_form {
    ($($t:ty),*) => {$(
        impl fmt::Display for $t {
            fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
                fmt::Debug::fmt(self, f)
            }
        }
        impl std::error::Error for $t {}
    )*};
}
error_shown_as_its_debug_form!(RefBuildError, RefParseError);

fn malformed(path: &str, detail: impl Into<String>) -> RefParseError {
    RefParseError::Malformed {
        path: path.to_string(),
        detail: detail.into(),
    }
}

/// A lasting reference to one dataset, linked to a live file.
#[derive(Clone, Debug)]
pub struct DatasetRef {
    uri: DatasetUri,
    locators: Vec<Locator>,
    observed: SourceObservation,
    admission: Admission,
}

impl DatasetRef {
    /// Build a reference to the file `ds` was opened over, from its existing accessors alone: the
    /// descriptor read at open, the admitted CRS and the admitted identity source. No read. The
    /// locators are `[machine-recorded]`; a project-relative one is built by piece 1c.
    pub fn linked(uri: DatasetUri, ds: &Dataset) -> Result<DatasetRef, RefBuildError> {
        let crs = ds.crs();
        let crs_assertion = claim_of(crs.source(), crs.identifier(), crs.definition_json())?;
        let identity = mapped_column(ds).map(|column| IdentityDeclaration {
            column: column.to_string(),
        });
        Ok(DatasetRef {
            uri,
            locators: vec![Locator::MachineRecorded],
            observed: ds.descriptor().observation(),
            admission: Admission {
                crs_assertion,
                identity,
            },
        })
    }

    pub fn uri(&self) -> &DatasetUri {
        &self.uri
    }

    pub fn locators(&self) -> &[Locator] {
        &self.locators
    }

    pub fn admission(&self) -> &Admission {
        &self.admission
    }

    /// ADR-036 §5's dataset entry: `{"resource":…,"observed":…,"admission":…}`.
    pub fn to_json(&self) -> Json {
        let locators = self.locators.iter().map(|l| {
            let (kind, at) = match l {
                Locator::ProjectRelative(at) => (KIND_PROJECT_RELATIVE, at.as_str()),
                Locator::MachineRecorded => (KIND_MACHINE_RECORDED, self.uri.as_str()),
            };
            Json::obj([("kind", Json::str(kind)), ("at", Json::str(at))])
        });
        let resource = Json::obj([
            ("logical_uri", Json::str(self.uri.as_str())),
            ("content_hash", state_json(NOT_TAKEN)),
            ("source_revision", state_json(NONE_PINNED)),
            ("locators", Json::Arr(locators.collect())),
            ("cache_status", Json::str(CACHE_LINKED)),
            ("portability_policy", Json::str(LINKED_LIVE_FILE)),
        ]);
        let o = &self.observed;
        let observed = Json::obj([
            ("byte_size", Json::UInt(o.byte_size())),
            (
                "modified_ns",
                o.modified_nanos()
                    .map_or_else(|| state_json(NOT_REPORTED), |n| Json::str(n.to_string())),
            ),
            ("footer_length", Json::UInt(o.footer_length())),
            (
                "footer_sha256",
                o.footer_hash()
                    .map_or_else(|| state_json(NOT_READ_OVER_CEILING), Json::str),
            ),
        ]);
        let a = &self.admission;
        let admission = Json::obj([
            (
                "crs_assertion",
                a.crs_assertion.as_ref().map_or(Json::Null, |c| {
                    Json::obj([
                        ("identifier", Json::str(c.identifier.as_str())),
                        ("definition_json", Json::str(c.definition_json.as_str())),
                    ])
                }),
            ),
            (
                "identity",
                a.identity.as_ref().map_or(Json::Null, |i| {
                    Json::obj([("column", Json::str(i.column.as_str()))])
                }),
            ),
        ]);
        Json::obj([
            ("resource", resource),
            ("observed", observed),
            ("admission", admission),
        ])
    }

    /// Read a dataset entry back. Refuses an unknown member, a missing member, a value outside its
    /// closed set and anything over a ceiling, naming the path.
    pub fn parse(v: &Value) -> Result<DatasetRef, RefParseError> {
        let entry = closed(v, "$", &["resource", "observed", "admission"])?;
        let (uri, locators) = parse_resource(&entry["resource"], "$.resource")?;
        Ok(DatasetRef {
            uri,
            locators,
            observed: parse_observed(&entry["observed"], "$.observed")?,
            admission: parse_admission(&entry["admission"], "$.admission")?,
        })
    }

    /// Compare with a reopened dataset: the observation by the descriptor's own rule, and the
    /// admission claims against the reopened dataset's admitted CRS and identity source.
    pub fn check(&self, ds: &Dataset) -> RefCheck {
        let observed = self.observed.components_differing_from(ds.descriptor());
        let crs = ds.crs();
        let now_crs = (crs.source() == CrsSource::CallerAsserted)
            .then(|| (crs.identifier(), crs.definition_json()));
        let crs_matches = match (self.admission.crs_assertion.as_ref(), now_crs) {
            (None, None) => true,
            (Some(a), Some((identifier, Some(definition)))) => {
                a.identifier == identifier && a.definition_json == definition
            }
            _ => false,
        };
        let recorded = self.admission.identity.as_ref().map(|i| i.column.as_str());
        let mut admission = Vec::new();
        if !crs_matches {
            admission.push("crs");
        }
        if recorded != mapped_column(ds) {
            admission.push("identity");
        }
        if observed.is_empty() && admission.is_empty() {
            RefCheck::NoChangeDetected
        } else {
            RefCheck::Differs {
                observed,
                admission,
            }
        }
    }
}

/// The CRS claim an open was admitted under, from the admitted CRS's own accessors: `Some` only
/// for a caller's assertion, refused when that assertion carries no definition.
fn claim_of(
    source: CrsSource,
    identifier: &str,
    definition: Option<&str>,
) -> Result<Option<CrsAssertion>, RefBuildError> {
    if source != CrsSource::CallerAsserted {
        return Ok(None);
    }
    let definition = definition.ok_or(RefBuildError::AssertionWithoutDefinition)?;
    Ok(Some(CrsAssertion {
        identifier: identifier.to_string(),
        definition_json: definition.to_string(),
    }))
}

/// The column of a caller's identity declaration, when the open was admitted under one.
fn mapped_column(ds: &Dataset) -> Option<&str> {
    match ds.identity().source() {
        IdSource::Mapped { column, .. } => Some(column.as_str()),
        _ => None,
    }
}

fn state_json((state, basis): (&str, &str)) -> Json {
    Json::obj([("state", Json::str(state)), ("basis", Json::str(basis))])
}

fn join(path: &str, key: &str) -> String {
    format!("{path}.{key}")
}

/// An object with exactly `keys`: an unknown and a missing key are each refused by path.
fn closed<'a>(
    v: &'a Value,
    path: &str,
    keys: &[&str],
) -> Result<&'a Map<String, Value>, RefParseError> {
    let obj = v
        .as_object()
        .ok_or_else(|| malformed(path, "expected an object"))?;
    if let Some(k) = obj.keys().find(|k| !keys.contains(&k.as_str())) {
        return Err(RefParseError::UnknownMember {
            path: join(path, k),
        });
    }
    if let Some(k) = keys.iter().find(|k| !obj.contains_key(**k)) {
        return Err(RefParseError::MissingMember {
            path: join(path, k),
        });
    }
    Ok(obj)
}

fn bounded<'a>(v: &'a Value, path: &str, ceiling: usize) -> Result<&'a str, RefParseError> {
    let s = v
        .as_str()
        .ok_or_else(|| malformed(path, "expected a string"))?;
    if s.len() > ceiling {
        return Err(over(path, ceiling as u64));
    }
    Ok(s)
}

fn over(path: &str, ceiling: u64) -> RefParseError {
    RefParseError::OverCeiling {
        path: path.to_string(),
        ceiling,
    }
}

fn unknown_state(path: &str, value: &str) -> RefParseError {
    RefParseError::UnknownState {
        path: path.to_string(),
        value: value.to_string(),
    }
}

/// A claim's text: bounded, and not blank, because an empty claim is not recorded.
fn claim(v: &Value, path: &str, ceiling: usize) -> Result<String, RefParseError> {
    let s = bounded(v, path, ceiling)?;
    if s.trim().is_empty() {
        return Err(malformed(path, "an empty claim is not recorded"));
    }
    Ok(s.to_string())
}

/// A word that must be exactly `word`: version 1 defines no other value here.
fn expect_word(v: &Value, path: &str, word: &str) -> Result<(), RefParseError> {
    match bounded(v, path, MAX_REF_STRING_BYTES)? {
        got if got == word => Ok(()),
        got => Err(unknown_state(path, got)),
    }
}

/// A named state whose word is the one version 1 defines. The word is closed. The basis is free
/// text (ADR-036 §5): any string within [`MAX_REF_STRING_BYTES`] that is not blank is accepted and
/// none is kept, because the basis constants are the text this writer writes, not a text a reader
/// requires.
fn expect_state(v: &Value, path: &str, (state, _): (&str, &str)) -> Result<(), RefParseError> {
    let obj = closed(v, path, &["state", "basis"])?;
    expect_word(&obj["state"], &join(path, "state"), state)?;
    claim(&obj["basis"], &join(path, "basis"), MAX_REF_STRING_BYTES).map(drop)
}

/// A string member, or the one named state standing for `None`.
fn string_or_state<'a>(
    v: &'a Value,
    path: &str,
    state: (&str, &str),
) -> Result<Option<&'a str>, RefParseError> {
    if v.is_object() {
        return expect_state(v, path, state).map(|()| None);
    }
    bounded(v, path, MAX_REF_STRING_BYTES).map(Some)
}

fn exact_integer(v: &Value, path: &str) -> Result<u64, RefParseError> {
    match v.as_u64() {
        None => Err(malformed(path, "expected a non-negative integer")),
        Some(n) if n > MAX_EXACT_INTEGER => Err(over(path, MAX_EXACT_INTEGER)),
        Some(n) => Ok(n),
    }
}

fn parse_resource(v: &Value, path: &str) -> Result<(DatasetUri, Vec<Locator>), RefParseError> {
    let obj = closed(v, path, &RESOURCE_KEYS)?;
    let uri_path = join(path, "logical_uri");
    let uri = parse_uri(
        bounded(&obj["logical_uri"], &uri_path, MAX_REF_STRING_BYTES)?,
        &uri_path,
    )?;
    let hash_path = join(path, "content_hash");
    if obj["content_hash"].is_string() {
        return Err(malformed(
            &hash_path,
            "a sealed copy's hash belongs to a snapshot reference, which this version does not read",
        ));
    }
    expect_state(&obj["content_hash"], &hash_path, NOT_TAKEN)?;
    let at = |key: &str| join(path, key);
    expect_state(&obj["source_revision"], &at("source_revision"), NONE_PINNED)?;
    expect_word(&obj["cache_status"], &at("cache_status"), CACHE_LINKED)?;
    expect_word(
        &obj["portability_policy"],
        &at("portability_policy"),
        LINKED_LIVE_FILE,
    )?;

    let locators_path = join(path, "locators");
    let items = obj["locators"]
        .as_array()
        .ok_or_else(|| malformed(&locators_path, "expected an array"))?;
    if items.is_empty() {
        return Err(malformed(
            &locators_path,
            "a reference holds at least one locator",
        ));
    }
    if items.len() > MAX_REF_LOCATORS {
        return Err(over(&locators_path, MAX_REF_LOCATORS as u64));
    }
    let mut locators = Vec::with_capacity(items.len());
    for (i, item) in items.iter().enumerate() {
        let item_path = format!("{locators_path}[{i}]");
        let o = closed(item, &item_path, &["kind", "at"])?;
        let (kind_path, at_path) = (join(&item_path, "kind"), join(&item_path, "at"));
        let at = bounded(&o["at"], &at_path, MAX_REF_STRING_BYTES)?;
        locators.push(
            match bounded(&o["kind"], &kind_path, MAX_REF_STRING_BYTES)? {
                KIND_PROJECT_RELATIVE => {
                    in_canonical_form(at, &at_path)?;
                    Locator::ProjectRelative(at.to_string())
                }
                KIND_MACHINE_RECORDED if at == uri.as_str() => Locator::MachineRecorded,
                KIND_MACHINE_RECORDED => {
                    return Err(malformed(
                        &at_path,
                        "a machine-recorded locator names the reference's own URI",
                    ))
                }
                other => return Err(unknown_state(&kind_path, other)),
            },
        );
    }
    Ok((uri, locators))
}

/// ADR-036 §5's canonical form for a `project-relative` locator, checked on the string alone: no
/// empty, `.` or `..` segment (which also refuses an empty `at` and a leading `/`), and no backslash
/// or `:`. Containment, that the resolved target lies inside the resolved project folder, is not
/// checked here: piece 1c's resolver checks it. No path type is used, nothing is joined and no
/// file is touched.
fn in_canonical_form(at: &str, path: &str) -> Result<(), RefParseError> {
    if at.contains(['\\', ':']) || at.split('/').any(|s| matches!(s, "" | "." | "..")) {
        return Err(malformed(
            path,
            "a project-relative locator is in canonical form",
        ));
    }
    Ok(())
}

fn parse_observed(v: &Value, path: &str) -> Result<SourceObservation, RefParseError> {
    let keys = ["byte_size", "modified_ns", "footer_length", "footer_sha256"];
    let obj = closed(v, path, &keys)?;
    let mtime_path = join(path, "modified_ns");
    let modified_nanos = match string_or_state(&obj["modified_ns"], &mtime_path, NOT_REPORTED)? {
        None => None,
        Some(s) => match s.parse::<u128>() {
            Ok(n) if n.to_string() == s => Some(n),
            _ => {
                return Err(malformed(
                    &mtime_path,
                    "expected a decimal string in minimal form",
                ))
            }
        },
    };
    let hash_path = join(path, "footer_sha256");
    let footer_hash =
        match string_or_state(&obj["footer_sha256"], &hash_path, NOT_READ_OVER_CEILING)? {
            Some(s) if s.len() != 64 || !s.bytes().all(is_lower_hex) => {
                return Err(malformed(
                    &hash_path,
                    "expected 64 lowercase hex characters",
                ))
            }
            other => other.map(str::to_string),
        };
    Ok(SourceObservation::recorded(
        exact_integer(&obj["byte_size"], &join(path, "byte_size"))?,
        modified_nanos,
        exact_integer(&obj["footer_length"], &join(path, "footer_length"))?,
        footer_hash,
    ))
}

fn parse_admission(v: &Value, path: &str) -> Result<Admission, RefParseError> {
    let obj = closed(v, path, &["crs_assertion", "identity"])?;
    // A claim is `null`, or a closed object whose texts are bounded and not blank.
    let member = |key: &str, keys: &[&str]| match &obj[key] {
        Value::Null => Ok(None),
        other => closed(other, &join(path, key), keys).map(Some),
    };
    let text = |o: &Map<String, Value>, parent: &str, key: &str, ceiling| {
        claim(&o[key], &join(&join(path, parent), key), ceiling)
    };
    let crs_assertion = match member("crs_assertion", &["identifier", "definition_json"])? {
        None => None,
        Some(o) => Some(CrsAssertion {
            identifier: text(o, "crs_assertion", "identifier", MAX_REF_STRING_BYTES)?,
            definition_json: text(
                o,
                "crs_assertion",
                "definition_json",
                MAX_CRS_DEFINITION_BYTES,
            )?,
        }),
    };
    let identity = match member("identity", &["column"])? {
        None => None,
        Some(o) => Some(IdentityDeclaration {
            column: text(o, "identity", "column", MAX_REF_STRING_BYTES)?,
        }),
    };
    Ok(Admission {
        crs_assertion,
        identity,
    })
}

#[cfg(test)]
mod tests {
    use spatial_renderer::canonical::to_canonical_string;

    use super::*;

    const URI: &str = "spatial://dataset/ref/0123456789abcdef0123456789abcdef";
    const HASH: &str = "abababababababababababababababababababababababababababababababab";

    fn sample(
        mtime: Option<u128>,
        hash: Option<&str>,
        claims: bool,
        extra: Vec<Locator>,
    ) -> DatasetRef {
        let mut locators = vec![Locator::MachineRecorded];
        locators.extend(extra);
        DatasetRef {
            uri: URI.parse().expect("a well-formed URI"),
            locators,
            observed: SourceObservation::recorded(27_132, mtime, 11_806, hash.map(str::to_string)),
            admission: Admission {
                crs_assertion: claims.then(|| CrsAssertion {
                    identifier: "EPSG:2056".to_string(),
                    definition_json: "{\"type\":\"ProjectedCRS\"}".to_string(),
                }),
                identity: claims.then(|| IdentityDeclaration {
                    column: "parcel_key".to_string(),
                }),
            },
        }
    }

    fn text(r: &DatasetRef) -> String {
        to_canonical_string(&r.to_json()).expect("canonical text")
    }

    fn value(r: &DatasetRef) -> Value {
        serde_json::from_str(&text(r)).expect("the text is JSON")
    }

    fn plain() -> DatasetRef {
        sample(Some(5), Some(HASH), true, vec![])
    }

    /// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted): the parser
    /// drops `admission.identity` (builds `identity: None`). OBSERVED FAILURE: the byte comparison
    /// of the first reference that holds an identity declaration: the reparsed text has
    /// `"identity":null` where the original has the `parcel_key` declaration.
    #[test]
    fn a_reference_round_trips_through_its_canonical_text_byte_for_byte() {
        for mtime in [Some(1_700_000_000_123_456_789u128), None] {
            for hash in [Some(HASH), None] {
                for claims in [true, false] {
                    let original = sample(mtime, hash, claims, vec![]);
                    let back = DatasetRef::parse(&value(&original)).expect("own text parses");
                    assert_eq!(text(&original), text(&back));
                    assert_eq!(back.admission().identity.is_some(), claims);
                }
            }
        }
    }

    /// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted): the parser
    /// ignores unknown keys. OBSERVED FAILURE: its first case: `parse` returned `Ok` for an entry
    /// with an unknown top-level member (`unwrap_err()` on an `Ok` value).
    #[test]
    fn an_unknown_member_is_refused_by_its_path() {
        let refused = |edit: &dyn Fn(&mut Value)| {
            let mut v = value(&plain());
            edit(&mut v);
            DatasetRef::parse(&v).unwrap_err()
        };
        let unknown = |path: &str| RefParseError::UnknownMember {
            path: path.to_string(),
        };
        assert_eq!(
            refused(&|v| v["extra"] = Value::Bool(true)),
            unknown("$.extra")
        );
        let resource = refused(&|v| v["resource"]["extra"] = Value::Bool(true));
        assert_eq!(resource, unknown("$.resource.extra"));
        let by = refused(&|v| v["admission"]["crs_assertion"]["by"] = Value::Null);
        assert_eq!(by, unknown("$.admission.crs_assertion.by"));
        let missing =
            refused(&|v| drop(v["observed"].as_object_mut().unwrap().remove("byte_size")));
        assert_eq!(
            missing,
            RefParseError::MissingMember {
                path: "$.observed.byte_size".to_string()
            }
        );
    }

    /// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted): the
    /// locator-count check is removed. OBSERVED FAILURE: the count case: `parse` returned `Ok` for
    /// a reference with nine locators (`unwrap_err()` on an `Ok` value).
    #[test]
    fn a_locator_count_or_string_over_its_ceiling_is_refused() {
        let at = |n: usize, s: usize| {
            let l = Locator::ProjectRelative("x".repeat(s));
            DatasetRef::parse(&value(&sample(Some(5), Some(HASH), false, vec![l; n])))
        };
        assert!(at(MAX_REF_LOCATORS - 1, 1).is_ok());
        assert_eq!(
            at(MAX_REF_LOCATORS, 1).unwrap_err(),
            RefParseError::OverCeiling {
                path: "$.resource.locators".to_string(),
                ceiling: MAX_REF_LOCATORS as u64
            }
        );
        assert!(at(1, MAX_REF_STRING_BYTES).is_ok());
        assert_eq!(
            at(1, MAX_REF_STRING_BYTES + 1).unwrap_err(),
            RefParseError::OverCeiling {
                path: "$.resource.locators[1].at".to_string(),
                ceiling: MAX_REF_STRING_BYTES as u64
            }
        );
    }

    /// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted): the hex
    /// check is removed from `FromStr`. OBSERVED FAILURE: the first malformed URI the prefix and
    /// length checks do not catch, the one with uppercase hex:
    /// `"spatial://dataset/ref/0123456789ABCDEF0123456789ABCDEF" must be refused`.
    #[test]
    fn a_dataset_uri_outside_its_grammar_is_refused() {
        assert_eq!(
            URI.parse::<DatasetUri>().expect("well formed").as_str(),
            URI
        );
        let minted = DatasetUri::mint();
        assert_eq!(minted.as_str().parse::<DatasetUri>().unwrap(), minted);
        assert_ne!(minted, DatasetUri::mint());
        for bad in [
            "spatial://dataset/parcels",
            "spatial://dataset/ref/0123456789ABCDEF0123456789ABCDEF",
            "spatial://dataset/ref/0123456789abcdef0123456789abcde",
            "spatial://dataset/ref/0123456789abcdef0123456789abcdef0",
            "spatial://dataset/ref/0123456789abcdef0123456789abcdeg",
            "spatial://project/0123456789abcdef0123456789abcdef",
            " spatial://dataset/ref/0123456789abcdef0123456789abcdef",
        ] {
            assert!(
                bad.parse::<DatasetUri>().is_err(),
                "{bad:?} must be refused"
            );
        }
    }

    /// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted): the
    /// grammar check is removed, so a `..` segment parses. OBSERVED FAILURE: its first case,
    /// `../x.parquet`: `parse` returned `Ok` (`unwrap_err()` on an `Ok` value).
    #[test]
    fn a_project_relative_locator_outside_canonical_form_is_refused() {
        let at_path = "$.resource.locators[1].at";
        for at in [
            "../x.parquet",
            "data/../../x.parquet",
            "/etc/x.parquet",
            "data\\x.parquet",
            "C:x.parquet",
            "data/a:b",
            "",
            "data//x.parquet",
            "./x.parquet",
        ] {
            let relative = Locator::ProjectRelative(at.to_string());
            let read =
                DatasetRef::parse(&value(&sample(Some(5), Some(HASH), false, vec![relative])));
            match read.unwrap_err() {
                RefParseError::Malformed { path, .. } => assert_eq!(path, at_path, "{at:?}"),
                other => panic!("{at:?} must be refused as malformed, got {other:?}"),
            }
        }
    }

    /// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted): the parser
    /// refuses `project-relative` (the grammar call is replaced by an error return). OBSERVED
    /// FAILURE: the parse: `a project-relative locator parses: Malformed { path:
    /// "$.resource.locators[1].at", detail: "mutation" }`.
    #[test]
    fn a_project_relative_locator_parses_and_writes_back_unchanged() {
        let relative = Locator::ProjectRelative("data/parcels.parquet".to_string());
        let original = sample(Some(5), Some(HASH), false, vec![relative.clone()]);
        let back = DatasetRef::parse(&value(&original)).expect("a project-relative locator parses");
        assert_eq!(back.locators(), [Locator::MachineRecorded, relative]);
        assert_eq!(text(&original), text(&back));
    }

    /// RECORDED MUTATION (observed at 1e637d55: applied, this test run alone, reverted): `claim_of`
    /// maps a missing definition to an empty string. OBSERVED FAILURE: its first assertion:
    /// `claim_of` returned `Ok(Some(CrsAssertion { identifier: "EPSG:2056", definition_json: ""
    /// }))` (`unwrap_err()` on an `Ok` value).
    #[test]
    fn an_asserted_crs_without_a_definition_is_refused_rather_than_recorded_empty() {
        assert_eq!(
            claim_of(CrsSource::CallerAsserted, "EPSG:2056", None).unwrap_err(),
            RefBuildError::AssertionWithoutDefinition
        );
        assert!(claim_of(CrsSource::FormatRule, "EPSG:2056", None)
            .unwrap()
            .is_none());
        let recorded = claim_of(CrsSource::CallerAsserted, "EPSG:2056", Some("{}"));
        assert_eq!(recorded.unwrap().unwrap().definition_json, "{}");
    }

    #[test]
    fn a_named_states_basis_is_free_text_and_its_word_is_closed() {
        let named = sample(None, None, false, vec![]);
        let original = text(&named);
        let edited = |object: &str, member: &str, key: &str, to: String| {
            let mut v = value(&named);
            v[object][member][key] = Value::String(to);
            DatasetRef::parse(&v)
        };
        for (object, member) in [
            ("resource", "content_hash"),
            ("resource", "source_revision"),
            ("observed", "modified_ns"),
            ("observed", "footer_sha256"),
        ] {
            let at = format!("$.{object}.{member}");
            let other = edited(object, member, "basis", "another writer's wording".into());
            let back = other.expect("another non-blank basis parses");
            assert_eq!(
                text(&back),
                original,
                "{at}: the writer states its own basis"
            );
            let blank = edited(object, member, "basis", "   ".into());
            match blank.unwrap_err() {
                RefParseError::Malformed { path, .. } => assert_eq!(path, format!("{at}.basis")),
                other => panic!("{at}: a blank basis must be malformed, got {other:?}"),
            }
            let long = edited(
                object,
                member,
                "basis",
                "x".repeat(MAX_REF_STRING_BYTES + 1),
            );
            let over = RefParseError::OverCeiling {
                path: format!("{at}.basis"),
                ceiling: MAX_REF_STRING_BYTES as u64,
            };
            assert_eq!(long.unwrap_err(), over);
            let word = edited(object, member, "state", "another-word".into());
            let unknown = RefParseError::UnknownState {
                path: format!("{at}.state"),
                value: "another-word".to_string(),
            };
            assert_eq!(word.unwrap_err(), unknown);
        }
    }
}
