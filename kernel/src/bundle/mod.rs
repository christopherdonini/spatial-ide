// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The **static bundle format**: layout, manifest, and the guarantees the manifest is allowed to
//! make. Proposed as **ADR-017**.
//!
//! This is the project's first persisted artifact, and the moment it exists `docs/11`'s resource
//! model and ADR-005's reproducibility grades stop being future work — `kernel/README.md` said so
//! in advance, naming "emits a bundle" as the trigger, and this module is that trigger arriving.
//!
//! ## Deliberately free of everything except the format
//!
//! Nothing here touches DuckDB, the engine, the data plane, or the filesystem. `docs/14` makes file
//! formats open permanently, and a format a third party can only read by linking the orchestrator
//! that wrote it is not open. The types below are separable into their own crate without a rewrite;
//! they depend on `spatial_renderer::canonical` and nothing else, because **the manifest and the
//! style share one number grammar on purpose** — two would be two things to specify and two to
//! re-implement.
//!
//! ## The layout
//!
//! ```text
//! <bundle>/
//!   manifest.json      the contract. Canonical JSON. Byte-identical across two publishes
//!   style.json         the canonical style document, hashed into the manifest
//!   data/part-00000.arrows   … one self-contained Arrow IPC stream per partition
//!   viewer/index.html, viewer/app.js
//!   build-info.json    wall-clock facts. NOT hash-listed, NOT verified, excluded from determinism
//! ```
//!
//! ## Why `build-info.json` is a separate file and not a manifest field
//!
//! The brief asks for two things that a timestamp inside `manifest.json` cannot both satisfy: that
//! wall-clock values live in "a separate non-hashed sidecar field excluded from the determinism
//! assertion", **and** that two publishes produce a **byte-identical manifest**. A field inside the
//! manifest makes the second sentence false. A separate file makes both true, so that is the
//! reading implemented — and it is recorded in ADR-017 as a *reading*, with what the alternative
//! would cost ("byte-identical modulo the sidecar field"), so the human can correct it at
//! acceptance rather than discover it.
//!
//! The sidecar is the highest redaction-risk file in the bundle, because "built by" and "built
//! from" want to live there. Its field set is closed (see [`BuildInfo`]), it is covered by the same
//! redaction scan as everything else, and **its absence must not break the viewer** — it is named
//! by a constant rather than known by convention, and nothing the viewer decides depends on it.

use spatial_renderer::canonical::{self, Json};

pub mod redaction;

/// The manifest schema version. A reader **refuses** a version it does not implement and refuses
/// unknown keys; additive evolution proceeds by incrementing this, which is exactly why the
/// derived-cache and v1-query slots exist in v1 rather than being added later.
pub const BUNDLE_VERSION: i64 = 1;

/// The digest input-set version. Without it, a later change to what the digest covers would change
/// every digest with nothing to say that the *meaning* changed rather than the operation.
pub const OPERATION_DIGEST_VERSION: i64 = 1;

pub const MANIFEST_PATH: &str = "manifest.json";
pub const STYLE_PATH: &str = "style.json";
pub const BUILD_INFO_PATH: &str = "build-info.json";
pub const DATA_DIR: &str = "data";
pub const VIEWER_DIR: &str = "viewer";

/// The partition naming scheme: fixed, contiguous from zero, derived **only** from the ordinal.
///
/// Never from content, a timestamp, or a path. A content-derived name would make the manifest a
/// function of bytes the manifest is already hashing, and a path-derived one would put a filesystem
/// path in an artifact `docs/09` forbids one in.
pub fn partition_path(index: usize) -> String {
    format!("{DATA_DIR}/part-{index:05}.arrows")
}

/// One asset the manifest lists and a reader must verify.
#[derive(Clone, Debug, PartialEq)]
pub struct Asset {
    /// Bundle-relative, forward slashes, never absolute and never containing `..`.
    pub path: String,
    pub bytes: u64,
    /// `sha256:<lowercase hex>`.
    pub content_hash: String,
    /// Rows, for a partition. `None` for the style and viewer assets.
    pub rows: Option<u64>,
}

impl Asset {
    fn to_json(&self) -> Json {
        let mut members = vec![
            ("path".to_string(), Json::str(self.path.clone())),
            ("bytes".to_string(), Json::UInt(self.bytes)),
            ("content_hash".to_string(), Json::str(self.content_hash.clone())),
        ];
        if let Some(rows) = self.rows {
            members.push(("rows".to_string(), Json::UInt(rows)));
        }
        Json::obj_from(members)
    }
}

/// A value that is not known, said as a **named state with its basis** rather than as a bare null.
///
/// The repository's established form — `IdUniqueness::as_str`, `axis_normalization =
/// none-performed` — is that a record says what was established, never a bare word and never a bare
/// absence. A `null` is ambiguous between "this field does not apply" and "this is known to be
/// none"; a state distinguishes them and carries why.
#[derive(Clone, Debug, PartialEq)]
pub struct Unknown {
    pub state: &'static str,
    pub basis: String,
}

impl Unknown {
    pub fn new(state: &'static str, basis: impl Into<String>) -> Self {
        Self { state, basis: basis.into() }
    }
    fn to_json(&self) -> Json {
        Json::obj([("state", Json::str(self.state)), ("basis", Json::str(self.basis.clone()))])
    }
}

/// Either a known value or a named unknown state.
#[derive(Clone, Debug, PartialEq)]
pub enum Known<T> {
    Value(T),
    Unknown(Unknown),
}

impl Known<String> {
    fn to_json(&self) -> Json {
        match self {
            Self::Value(v) => Json::str(v.clone()),
            Self::Unknown(u) => u.to_json(),
        }
    }
}

/// A `docs/11` **ResourceRef**, with all six members present by name.
///
/// docs/11: "logical URI · content hash, if known · source revision · one or more locators · cache
/// status · portability policy". The brief requires a *named, minimal* conformance and rules out a
/// silent partial one, so every member appears — an unknown one as an [`Unknown`] state carrying
/// its basis, never omitted and never a bare null.
///
/// **Three of these are owed, not one.** ADR-005 rewords principle 1 to "everything is an
/// addressable, typed resource", and `docs/11` lists styles among the typed artifacts. So the
/// bundle is a resource, the source dataset is a resource, and the style is a resource, and each
/// gets its own block.
#[derive(Clone, Debug, PartialEq)]
pub struct ResourceRef {
    pub logical_uri: String,
    pub content_hash: Known<String>,
    pub source_revision: Known<String>,
    pub locators: Vec<Locator>,
    pub cache_status: &'static str,
    pub portability_policy: &'static str,
}

#[derive(Clone, Debug, PartialEq)]
pub struct Locator {
    pub kind: &'static str,
    /// Bundle-relative. **Never a filesystem path** (`docs/09`).
    pub at: String,
}

impl ResourceRef {
    fn to_json(&self) -> Json {
        Json::obj([
            ("logical_uri", Json::str(self.logical_uri.clone())),
            ("content_hash", self.content_hash.to_json()),
            ("source_revision", self.source_revision.to_json()),
            (
                "locators",
                Json::Arr(
                    self.locators
                        .iter()
                        .map(|l| {
                            Json::obj([
                                ("kind", Json::str(l.kind)),
                                ("at", Json::str(l.at.clone())),
                            ])
                        })
                        .collect(),
                ),
            ),
            ("cache_status", Json::str(self.cache_status)),
            ("portability_policy", Json::str(self.portability_policy)),
        ])
    }
}

/// Whether the bundle may be redistributed, as the source or the operator declared it.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum Redistribution {
    Permitted,
    /// Publish **refuses**: a static bundle is a redistributed copy, and performing a class-3
    /// external side effect against a declared no-redistribution term is what ADR-006 and `docs/09`
    /// gate.
    Forbidden,
    Unknown,
}

impl Redistribution {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Permitted => "permitted",
            Self::Forbidden => "forbidden",
            Self::Unknown => "unknown",
        }
    }
}

/// License and attribution, as a **claim carrying its claimant**.
///
/// The shape mirrors `crs_source` (ADR-015 §3) and `id_source` (ADR-016 §6) for the same reason: a
/// consumer can tell a file fact from an operator's declaration without asking the publisher.
///
/// Absence is `not-declared` — the brief's own vocabulary — and **no attribution is invented to
/// satisfy a checklist**. `docs/14` says published bundles *surface* license metadata "when known";
/// it does not say refuse when absent.
///
/// **The two declared states carry different member types, and that is the format's rule rather
/// than an exception to it** (ADR-017 §5; Corrigendum 1). `by` and `at` already exist in one state
/// only, and `viewer[]` omits `rows` outright rather than nulling it. So the `license` member is
/// modelled per state instead of through one shared struct: `Option<String>` where a source may
/// have named none, `String` where an operator must have.
///
/// Sharing one `LicenseTerms` across both would make `license: None` *representable* under
/// `declared-by-operator`, and a writer could then emit a manifest every conforming reader refuses.
/// A shape that cannot be built wrongly is worth more than a comment saying it will not be.
#[derive(Clone, Debug, PartialEq)]
pub enum License {
    NotDeclared,
    DeclaredBySource(LicenseTerms),
    DeclaredByOperator {
        /// **Never absent.** An operator states a license or makes no declaration at all.
        license: String,
        attribution: Option<String>,
        redistribution: Redistribution,
        by: String,
        at: String,
    },
}

/// The terms a **source** declares, carried verbatim.
#[derive(Clone, Debug, PartialEq)]
pub struct LicenseTerms {
    /// Carried **verbatim**, and `None` when there is nothing to carry.
    ///
    /// No SPDX parsing, no interpretation of license text — that would be this module deciding a
    /// legal question from a string. **And no placeholder**: the three source metadata keys are
    /// independent, so a source may declare attribution and/or redistribution while naming no
    /// license, and this is `None` in exactly that case (ADR-017 Corrigendum 1, amending §5/§6/§10).
    ///
    /// It was once `String` with a `"(unnamed)"` fallback — text no source wrote, sitting in the one
    /// member whose entire contract is verbatim carriage, and *plausible-looking* enough that a
    /// consumer could read it as a license name. `null` is the absence, not a value.
    pub license: Option<String>,
    pub attribution: Option<String>,
    pub redistribution: Redistribution,
}

impl License {
    fn to_json(&self) -> Json {
        match self {
            Self::NotDeclared => Json::obj([
                ("state", Json::str("not-declared")),
                (
                    "basis",
                    Json::str(
                        "the source declares no license or attribution metadata and the operator \
                         declared none; nothing is invented to fill it",
                    ),
                ),
            ]),
            Self::DeclaredBySource(t) => Json::obj([
                ("state", Json::str("declared-by-source")),
                // **`null`, in the same shape as `attribution` two members down**, and for the same
                // reason ADR-017 §6 gives: the enclosing `state` already carries the claimant, so
                // "does not apply" is not an available reading and the absence needs no basis. A
                // `{state, basis}` named-unknown here would nest a second state inside a block that
                // already has one, and §6 scopes that shape to ResourceRef members.
                (
                    "license",
                    match &t.license {
                        Some(l) => Json::str(l.clone()),
                        None => Json::Null,
                    },
                ),
                (
                    "attribution",
                    match &t.attribution {
                        Some(a) => Json::str(a.clone()),
                        None => Json::Null,
                    },
                ),
                ("redistribution", Json::str(t.redistribution.as_str())),
            ]),
            // **`declared-by-operator` never nulls `license`** — and this arm cannot, because the
            // variant holds a `String`. Declaring a member nullable that the writer is incapable of
            // nulling would be a schema saying something untrue about the format.
            Self::DeclaredByOperator { license, attribution, redistribution, by, at } => {
                Json::obj([
                    ("state", Json::str("declared-by-operator")),
                    ("license", Json::str(license.clone())),
                    (
                        "attribution",
                        match attribution {
                            Some(a) => Json::str(a.clone()),
                            None => Json::Null,
                        },
                    ),
                    ("redistribution", Json::str(redistribution.as_str())),
                    ("by", Json::str(by.clone())),
                    ("at", Json::str(at.clone())),
                ])
            }
        }
    }
}

/// Where the corresponding source of the distributed code was said to be available.
///
/// **Exactly two kinds, and a third is refused rather than carried** — the same closed-enumeration
/// discipline [`Filter`] applies below, for the same reason: a shape a reader cannot describe is
/// worse carried than refused.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum CorrespondingSourceKind {
    /// `at` is an `http`/`https` URL. Any other scheme is refused by the publisher: a `file:///…`
    /// route is both a `docs/09` redaction leak and not a durable route in ADR-009 item 7's sense.
    Url,
    /// `at` is the text of a written offer. **Ordinarily carries a name and a postal address**, so
    /// it is personal data entering a redistributable artifact — ADR-017 Corrigendum 3 names the
    /// interaction with `redaction.rs` rather than leaving it to be discovered.
    WrittenOffer,
}

impl CorrespondingSourceKind {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::Url => "url",
            Self::WrittenOffer => "written-offer",
        }
    }
}

/// The corresponding-source route ADR-009 item 7 requires every bundle to carry.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct CorrespondingSource {
    pub kind: CorrespondingSourceKind,
    pub at: String,
}

/// **A route recorded, not a guarantee**, and the wording is fixed here rather than left to a
/// writer.
///
/// Quoted verbatim in ADR-017 Corrigendum 3, which is what keeps this member out of §2's set of
/// strings an independent implementer cannot reproduce. Changing it here without changing it there
/// makes the ADR wrong about its own format.
pub const CORRESPONDING_SOURCE_NOTE: &str =
    "a route recorded, not a guarantee. This format records where corresponding source was said to \
     be available; it cannot establish that the route resolves, that it serves the source of this \
     bundle's viewer, or that it will outlive this bundle. Verify by following it.";

/// The **distributed code's** copyright notice, license, and corresponding-source route.
///
/// ADR-017 Corrigendum 3, discharging ADR-009 item 7. This is *not* [`License`]: that member carries
/// the terms of the **data**, and this one carries the terms of the **program the recipient is
/// running**. They sit next to each other in the manifest so the distinction is unmissable.
///
/// ## What this type establishes, and what it does not
///
/// The publisher refuses to build a bundle without one, and refuses a `notice_path` that does not
/// name a hash-listed viewer asset — so a bundle with no declaration does not exist, and the notice
/// file's bytes are covered by a content hash.
///
/// It cannot check what is *in* the notice file. A `notice_path` of `viewer/app.js` satisfies every
/// mechanical rule here. Accuracy is the publisher's claim, exactly as `license.state` is, and
/// ADR-017 Corrigendum 3 says so rather than letting the refusals imply more than they check.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ViewerLicense {
    /// What is distributed, named. Non-empty.
    pub program: String,
    /// The copyright notice, verbatim. Non-empty.
    pub copyright: String,
    /// The license identifier, e.g. `AGPL-3.0-or-later`. Non-empty.
    pub license: String,
    /// **Bundle-relative** (`viewer/NOTICE.txt`), and equal to the `path` of one entry in `viewer[]`.
    ///
    /// The namespace is the trap: [`crate::publish::ViewerAsset`] paths are *viewer*-relative and
    /// the publisher prefixes `viewer/` on the way out. The manifest carries the bundle-relative
    /// form because §14 requires every asset path to be bundle-relative, and because a reader can
    /// cross-check only against what the manifest actually carries.
    ///
    /// It names a notice **set**: the program's own notice *and* the retained notices of every
    /// third-party work compiled into it. The built viewer bundles `apache-arrow` and `flatbuffers`
    /// (Apache-2.0, with a NOTICE whose contents §4(d) requires to travel) and `tslib` (0BSD).
    pub notice_path: String,
    pub corresponding_source: CorrespondingSource,
}

impl ViewerLicense {
    fn to_json(&self) -> Json {
        Json::obj([
            ("program", Json::str(self.program.clone())),
            ("copyright", Json::str(self.copyright.clone())),
            ("license", Json::str(self.license.clone())),
            ("notice_path", Json::str(self.notice_path.clone())),
            (
                "corresponding_source",
                Json::obj([
                    ("kind", Json::str(self.corresponding_source.kind.as_str())),
                    ("at", Json::str(self.corresponding_source.at.clone())),
                    ("note", Json::str(CORRESPONDING_SOURCE_NOTE)),
                ]),
            ),
        ])
    }
}

/// The filter the operation applied, **named for what it is**.
///
/// The engine filters on GeoParquet's covering-bbox columns. That is neither arbitrary SQL nor
/// geometric intersection, and calling it "the SQL filter" in a published contract would let a
/// reader believe the bundle contains features whose *geometry* meets the viewport. The name here is
/// the same discipline `index::IndexKey` applies to its answered predicate, for the same reason.
#[derive(Clone, Debug, PartialEq)]
pub enum Filter {
    WholeFile,
    CoveringBboxIntersects { xmin: f64, ymin: f64, xmax: f64, ymax: f64, bbox_crs: Option<String> },
}

impl Filter {
    fn to_json(&self) -> Json {
        match self {
            Self::WholeFile => Json::obj([("kind", Json::str("whole-file"))]),
            Self::CoveringBboxIntersects { xmin, ymin, xmax, ymax, bbox_crs } => Json::obj([
                ("kind", Json::str("covering-bbox-intersects")),
                ("xmin", Json::Double(*xmin)),
                ("ymin", Json::Double(*ymin)),
                ("xmax", Json::Double(*xmax)),
                ("ymax", Json::Double(*ymax)),
                (
                    "bbox_crs",
                    match bbox_crs {
                        Some(c) => Json::str(c.clone()),
                        None => Json::Null,
                    },
                ),
            ]),
        }
    }
}

/// One published column, as it appears in every partition's schema.
#[derive(Clone, Debug, PartialEq)]
pub struct Column {
    pub name: String,
    /// The Arrow type, spelled as Arrow spells it.
    pub arrow_type: String,
    pub nullable: bool,
}

impl Column {
    fn to_json(&self) -> Json {
        Json::obj([
            ("name", Json::str(self.name.clone())),
            ("arrow_type", Json::str(self.arrow_type.clone())),
            ("nullable", Json::Bool(self.nullable)),
        ])
    }
}

/// The partition format, declared normatively so an independent writer can reproduce the bytes.
#[derive(Clone, Debug, PartialEq)]
pub struct FormatDeclaration {
    pub framing: &'static str,
    pub compression: &'static str,
    pub dictionaries: &'static str,
    pub geometry_encoding: String,
    pub coordinate_layout: String,
    pub partition_target_bytes: u64,
    pub partition_max_rows: u64,
    pub partition_boundary_rule: &'static str,
    pub max_partitions: u64,
}

impl FormatDeclaration {
    fn to_json(&self) -> Json {
        Json::obj([
            ("framing", Json::str(self.framing)),
            ("compression", Json::str(self.compression)),
            ("dictionaries", Json::str(self.dictionaries)),
            ("geometry_encoding", Json::str(self.geometry_encoding.clone())),
            ("coordinate_layout", Json::str(self.coordinate_layout.clone())),
            ("partition_target_bytes", Json::UInt(self.partition_target_bytes)),
            ("partition_max_rows", Json::UInt(self.partition_max_rows)),
            ("partition_boundary_rule", Json::str(self.partition_boundary_rule)),
            ("max_partitions", Json::UInt(self.max_partitions)),
        ])
    }
}

/// The **semantic operation**, as data, plus a digest over it.
///
/// Source hash + style hash + engine version cannot reproduce a *filtered* result on their own, so
/// the operation itself is part of the reproducibility basis rather than an unrecorded input.
///
/// **The digest is never taken over generated SQL.** The engine's SQL interpolates the source path
/// into `read_parquet('<path>')`, so a SQL digest would walk a filesystem path into the manifest —
/// a straight `docs/09` redaction failure — and would also change whenever the query builder's
/// spelling changed without the operation changing.
///
/// **Software versions are deliberately outside the digest.** They affect the bytes; they do not
/// affect the *request*. Including them would change the digest on every dependency bump for an
/// identical operation. They are recorded beside it in `software`. The digest answers "what was
/// asked for"; the software block answers "what executed it".
#[derive(Clone, Debug, PartialEq)]
pub struct Operation {
    pub operation: &'static str,
    pub source_logical_uri: String,
    pub source_content_hash: String,
    pub id_source: String,
    pub id_uniqueness: String,
    pub id_verified_rows: Option<u64>,
    pub crs_identifier: String,
    pub crs_source: String,
    pub axis_order: String,
    pub axis_normalization: String,
    /// Hash of the CRS definition, or a named state when the source carried none.
    ///
    /// Load-bearing: every definition-only dataset shares the same placeholder identifier, so
    /// without this two genuinely different CRS would digest identically.
    pub crs_definition_hash: Known<String>,
    pub filter: Filter,
    pub limit: Option<u64>,
    pub projection: Vec<Column>,
    pub ordering: &'static str,
    pub format: FormatDeclaration,
    pub style_hash: String,
}

impl Operation {
    /// The digest's input object, **without** the digest member — stated as its own function
    /// because "the digest is over this object minus the digest" is the kind of self-reference an
    /// implementer has to be told about rather than left to infer.
    fn digest_input(&self) -> Json {
        Json::obj([
            ("digest_version", Json::Int(OPERATION_DIGEST_VERSION)),
            ("operation", Json::str(self.operation)),
            ("source_logical_uri", Json::str(self.source_logical_uri.clone())),
            ("source_content_hash", Json::str(self.source_content_hash.clone())),
            ("id_source", Json::str(self.id_source.clone())),
            ("id_uniqueness", Json::str(self.id_uniqueness.clone())),
            (
                "id_verified_rows",
                match self.id_verified_rows {
                    Some(n) => Json::UInt(n),
                    None => Json::Null,
                },
            ),
            ("crs_identifier", Json::str(self.crs_identifier.clone())),
            ("crs_source", Json::str(self.crs_source.clone())),
            ("axis_order", Json::str(self.axis_order.clone())),
            ("axis_normalization", Json::str(self.axis_normalization.clone())),
            ("crs_definition_hash", self.crs_definition_hash.to_json()),
            ("filter", self.filter.to_json()),
            (
                "limit",
                match self.limit {
                    Some(n) => Json::UInt(n),
                    None => Json::Null,
                },
            ),
            ("projection", Json::Arr(self.projection.iter().map(Column::to_json).collect())),
            ("ordering", Json::str(self.ordering)),
            ("format", self.format.to_json()),
            ("style_hash", Json::str(self.style_hash.clone())),
        ])
    }

    /// `sha256:<hex>` over the canonical serialization of [`Self::digest_input`].
    pub fn digest(&self) -> Result<String, canonical::CanonicalError> {
        let (_, hash) = canonical::canonical_and_hash(&self.digest_input())?;
        Ok(hash)
    }

    /// The manifest's `operation` block: the input object written verbatim, with the digest beside
    /// it. A digest whose input set a reader has to guess cannot be verified, which fails
    /// `docs/01` principle 8.
    fn to_json(&self) -> Result<Json, canonical::CanonicalError> {
        let Json::Obj(mut members) = self.digest_input() else { unreachable!("digest input is an object") };
        members.push(("digest".to_string(), Json::str(self.digest()?)));
        Ok(Json::Obj(members))
    }
}

/// What executed the operation. **Recorded versions, not a build identity.**
#[derive(Clone, Debug, PartialEq)]
pub struct Software {
    pub engine: String,
    pub kernel: String,
    pub renderer: String,
    pub arrow: String,
    pub duckdb: String,
    pub bundle_writer: i64,
}

impl Software {
    fn to_json(&self) -> Json {
        Json::obj([
            ("engine_crate_version", Json::str(self.engine.clone())),
            ("kernel_crate_version", Json::str(self.kernel.clone())),
            ("renderer_crate_version", Json::str(self.renderer.clone())),
            ("arrow_crate_version_requirement", Json::str(self.arrow.clone())),
            ("duckdb_library_version", Json::str(self.duckdb.clone())),
            ("bundle_writer_version", Json::Int(self.bundle_writer)),
            (
                "note",
                Json::str(
                    "recorded versions, not a build identity. ADR-005 Exact is not claimed: these \
                     name which software ran, not an immutable pinned build of it",
                ),
            ),
        ])
    }
}

/// The ADR-005 grade this bundle claims, and the basis it is claimed from.
///
/// **Snapshot**, and the reason Exact is not claimed is recorded rather than left to inference.
/// ADR-005's Exact requires "immutable, content-hashed inputs **and** pinned software versions": the
/// inputs are content-hashed but their immutability is not established, and a crate version is not
/// a pinned build. ADR-005 also composes a derived output's grade as the weakest among its inputs,
/// so the composition is stated instead of the conclusion being asserted.
#[derive(Clone, Debug, PartialEq)]
pub struct Reproducibility {
    pub grade: &'static str,
    pub basis: Vec<String>,
    pub why_not_higher: String,
}

impl Reproducibility {
    /// The only grade this format can honestly claim today.
    pub fn snapshot(source_hash: &str, style_hash: &str, operation_digest: &str) -> Self {
        Self {
            grade: "Snapshot",
            basis: vec![
                format!(
                    "the published data is a materialized local copy captured when publish ran, \
                     content-hashed per partition; source content hash {source_hash}"
                ),
                format!("style content hash {style_hash}"),
                format!("operation digest {operation_digest}"),
                "composition (ADR-005: a derived output's grade is the weakest among its inputs): \
                 source Snapshot AND style content-hashed immutable text AND operation recorded \
                 -> Snapshot"
                    .to_string(),
            ],
            why_not_higher: "Exact requires immutable, content-hashed inputs AND pinned software \
                             versions. The inputs are content-hashed but their immutability is not \
                             established — nothing here pins a source revision — and the recorded \
                             crate versions are not a pinned build identity"
                .to_string(),
        }
    }

    fn to_json(&self) -> Json {
        Json::obj([
            ("grade", Json::str(self.grade)),
            ("basis", Json::Arr(self.basis.iter().map(|b| Json::str(b.clone())).collect())),
            ("why_not_higher", Json::str(self.why_not_higher.clone())),
        ])
    }
}

/// Everything the manifest states.
#[derive(Clone, Debug, PartialEq)]
pub struct Manifest {
    pub bundle: ResourceRef,
    pub source: ResourceRef,
    pub style: ResourceRef,
    pub style_version: i64,
    pub style_match_column: Option<String>,
    pub software: Software,
    pub operation: Operation,
    pub crs_source_identifier: String,
    pub crs_source_definition: Option<String>,
    pub crs_display_identifier: String,
    pub crs_transform: &'static str,
    pub crs_source_kind: String,
    pub axis_order: String,
    pub axis_normalization: String,
    pub id_source: String,
    pub id_uniqueness: String,
    pub id_verified_rows: Option<u64>,
    pub id_js_exact: Option<bool>,
    pub identity_caveat: String,
    pub schema: Vec<Column>,
    pub bounds: Option<[f64; 4]>,
    pub bounds_basis: &'static str,
    pub rows: u64,
    pub partitions: Vec<Asset>,
    pub viewer: Vec<Asset>,
    /// The **distributed code's** terms (ADR-017 Corrigendum 3). Immediately before [`Self::license`]
    /// — the *data*'s terms — because a reader parsing in order already holds `viewer` when it
    /// reaches the member that must cross-check against it.
    pub viewer_license: ViewerLicense,
    pub license: License,
    pub reproducibility: Reproducibility,
    pub source_verification: String,
}

impl Manifest {
    /// The manifest as canonical JSON, in the schema's declared key order.
    pub fn to_json(&self) -> Result<Json, canonical::CanonicalError> {
        Ok(Json::obj([
            ("bundle_version", Json::Int(BUNDLE_VERSION)),
            ("bundle", self.bundle.to_json()),
            ("source", self.source.to_json()),
            ("source_verification", Json::str(self.source_verification.clone())),
            (
                "style",
                Json::obj([
                    ("resource", self.style.to_json()),
                    ("style_version", Json::Int(self.style_version)),
                    (
                        "match_column",
                        match &self.style_match_column {
                            Some(c) => Json::str(c.clone()),
                            None => Json::Null,
                        },
                    ),
                ]),
            ),
            ("software", self.software.to_json()),
            ("operation", self.operation.to_json()?),
            (
                "crs",
                Json::obj([
                    ("source", Json::str(self.crs_source_identifier.clone())),
                    (
                        "source_definition",
                        match &self.crs_source_definition {
                            Some(d) => Json::str(d.clone()),
                            None => Json::Null,
                        },
                    ),
                    ("display", Json::str(self.crs_display_identifier.clone())),
                    // v0's whole publishing path, recorded as a fact rather than as a placeholder
                    // for a transform that does not exist.
                    ("transform", Json::str(self.crs_transform)),
                    ("crs_source", Json::str(self.crs_source_kind.clone())),
                    ("axis_order", Json::str(self.axis_order.clone())),
                    ("axis_normalization", Json::str(self.axis_normalization.clone())),
                ]),
            ),
            (
                "identity",
                Json::obj([
                    ("id_source", Json::str(self.id_source.clone())),
                    ("id_uniqueness", Json::str(self.id_uniqueness.clone())),
                    (
                        "id_verified_rows",
                        match self.id_verified_rows {
                            Some(n) => Json::UInt(n),
                            None => Json::Null,
                        },
                    ),
                    (
                        "id_js_exact",
                        match self.id_js_exact {
                            Some(b) => Json::Bool(b),
                            None => Json::Null,
                        },
                    ),
                    ("caveat", Json::str(self.identity_caveat.clone())),
                ]),
            ),
            ("schema", Json::Arr(self.schema.iter().map(Column::to_json).collect())),
            (
                "bounds",
                match self.bounds {
                    Some(b) => Json::obj([
                        ("xmin", Json::Double(b[0])),
                        ("ymin", Json::Double(b[1])),
                        ("xmax", Json::Double(b[2])),
                        ("ymax", Json::Double(b[3])),
                        ("crs", Json::str(self.crs_source_identifier.clone())),
                        ("basis", Json::str(self.bounds_basis)),
                    ]),
                    None => Json::Null,
                },
            ),
            (
                "data",
                Json::obj([
                    ("rows", Json::UInt(self.rows)),
                    ("format", self.operation.format.to_json()),
                    (
                        "partitions",
                        Json::Arr(self.partitions.iter().map(Asset::to_json).collect()),
                    ),
                ]),
            ),
            ("viewer", Json::Arr(self.viewer.iter().map(Asset::to_json).collect())),
            ("viewer_license", self.viewer_license.to_json()),
            ("license", self.license.to_json()),
            ("reproducibility", self.reproducibility.to_json()),
            // **Reserved slots, present in v1 on purpose.** A reader refuses unknown keys, so a
            // format that gained these later would be a breaking change; declaring them empty now
            // is what makes adding a PMTiles cache or an in-browser query surface a *fill*, not a
            // format revision.
            ("derived_caches", Json::Arr(vec![])),
            (
                "query_surface",
                Json::obj([
                    ("available", Json::Bool(false)),
                    (
                        "reserved_for",
                        Json::str(
                            "v1 in-browser query (DuckDB-WASM). The schema and partition layout \
                             above are already canonical and are what such a surface would bind to; \
                             nothing else about it lands in this version",
                        ),
                    ),
                ]),
            ),
            (
                "sidecar",
                Json::obj([
                    ("path", Json::str(BUILD_INFO_PATH)),
                    ("hashed", Json::Bool(false)),
                    ("verified", Json::Bool(false)),
                    (
                        "note",
                        Json::str(
                            "wall-clock build facts, excluded from the determinism assertion and \
                             from every hash. A reader must not depend on it, must not trust it, \
                             and must work when it is absent",
                        ),
                    ),
                ]),
            ),
        ]))
    }

    /// The canonical bytes and their hash.
    pub fn canonical(&self) -> Result<String, canonical::CanonicalError> {
        canonical::to_canonical_string(&self.to_json()?)
    }
}

/// The sidecar's **closed** field set.
///
/// Closed deliberately: this is where "built by", "built from" and a hostname want to live, and
/// `docs/09` forbids all three anywhere in the bundle. Nothing here is a filesystem path, a user, a
/// machine, or a process id.
///
/// ## What belongs here versus in the manifest, because a timestamp alone does not decide it
///
/// The rule is **not** "timestamps go in the sidecar". It is that a value describing **this
/// execution** goes here, outside every hash, while a value describing **the request** stays in the
/// manifest, inside the determinism surface.
///
/// Everything in this struct is the first kind: when a build began and ended, how long it took, how
/// much it produced. Two publishes of the *same* request differ in all of it, which is exactly why
/// none of it may reach a hashed byte.
///
/// `License::DeclaredByOperator`'s `at` is the second kind and lives in the manifest. It is the
/// instant an operator made a declaration — part of the claim, like `by` — so two publishes that
/// declare different instants *are* different publishes and correctly produce different manifests.
/// Moving it here would make a declared fact unverifiable; moving build timing to the manifest would
/// make byte-identical rebuild impossible. ADR-017 §10 and §12 state the same split.
#[derive(Clone, Debug, PartialEq)]
pub struct BuildInfo {
    pub started_at: String,
    pub finished_at: String,
    pub build_millis: f64,
    pub total_bytes: u64,
    pub partition_count: u64,
    pub rows: u64,
    pub content_hash_millis: f64,
}

impl BuildInfo {
    pub fn to_json(&self) -> Json {
        Json::obj([
            ("started_at", Json::str(self.started_at.clone())),
            ("finished_at", Json::str(self.finished_at.clone())),
            ("build_millis", Json::Double(self.build_millis)),
            ("content_hash_millis", Json::Double(self.content_hash_millis)),
            ("total_bytes", Json::UInt(self.total_bytes)),
            ("partition_count", Json::UInt(self.partition_count)),
            ("rows", Json::UInt(self.rows)),
            (
                "note",
                Json::str(
                    "not hash-listed in the manifest, not verified by any reader, and excluded \
                     from the determinism assertion. These are facts about one build, with no \
                     budget attached and no comparison implied",
                ),
            ),
        ])
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_partition_name_is_a_function_of_its_ordinal_and_nothing_else() {
        assert_eq!(partition_path(0), "data/part-00000.arrows");
        assert_eq!(partition_path(7), "data/part-00007.arrows");
        assert_eq!(partition_path(99_999), "data/part-99999.arrows");

        // Fixed width across the whole declared range: the padding covers the ceiling exactly, and
        // one more digit would mean the ceiling and the naming scheme had drifted apart.
        let width = partition_path(0).len();
        for i in [0, 1, 9, 10, 999, 1_000, spatial_engine::MAX_PUBLISH_PARTITIONS - 1] {
            assert_eq!(partition_path(i).len(), width, "index {i} changed the name's width");
        }

        // Contiguous and collision-free over a real run of ordinals — the property the manifest's
        // partition list depends on. *(The previous version of this test claimed "contiguous" and
        // "content-independent" in its name and checked neither; the second is now a property of the
        // signature — `partition_path` takes only an ordinal, so there is no content it could
        // depend on — and the first is checked here.)*
        let names: std::collections::BTreeSet<String> = (0..2_000).map(partition_path).collect();
        assert_eq!(names.len(), 2_000, "two ordinals produced the same name");
        assert!(names.contains("data/part-00000.arrows"));
        assert!(names.contains("data/part-01999.arrows"));
    }

    #[test]
    fn the_operation_digest_excludes_itself_and_moves_with_every_declared_input() {
        let base = sample_operation();
        let d0 = base.digest().unwrap();

        // Same inputs, same digest.
        assert_eq!(sample_operation().digest().unwrap(), d0);

        // Each declared input moves it.
        let mut o = sample_operation();
        o.style_hash = "sha256:different".into();
        assert_ne!(o.digest().unwrap(), d0, "style hash is not in the digest");

        let mut o = sample_operation();
        o.limit = Some(5);
        assert_ne!(o.digest().unwrap(), d0, "limit is not in the digest");

        let mut o = sample_operation();
        o.projection = vec![];
        assert_ne!(o.digest().unwrap(), d0, "projection is not in the digest");

        let mut o = sample_operation();
        o.id_source = "mapped:parcel_key".into();
        assert_ne!(o.digest().unwrap(), d0, "identity space is not in the digest");

        let mut o = sample_operation();
        o.filter = Filter::CoveringBboxIntersects {
            xmin: 2_600_000.0,
            ymin: 1_200_000.0,
            xmax: 2_601_000.0,
            ymax: 1_201_000.0,
            bbox_crs: Some("EPSG:2056".into()),
        };
        assert_ne!(o.digest().unwrap(), d0, "the filter is not in the digest");

        // …and the digest block carries its own input set verbatim, so it can be recomputed.
        let json = o.to_json().unwrap();
        let Json::Obj(members) = &json else { panic!() };
        assert!(members.iter().any(|(k, _)| k == "digest"));
        assert!(members.iter().any(|(k, _)| k == "filter"));
        assert!(members.iter().any(|(k, _)| k == "digest_version"));
    }

    #[test]
    fn two_different_definition_only_crs_do_not_digest_identically() {
        // Every definition-only dataset shares the `(definition-only)` placeholder identifier, so
        // without the definition hash in the digest these two operations would be indistinguishable.
        let mut a = sample_operation();
        a.crs_identifier = "(definition-only)".into();
        a.crs_definition_hash = Known::Value("sha256:aaa".into());
        let mut b = a.clone();
        b.crs_definition_hash = Known::Value("sha256:bbb".into());
        assert_ne!(a.digest().unwrap(), b.digest().unwrap());
    }

    #[test]
    fn an_unknown_resource_ref_member_is_a_named_state_and_never_a_bare_null() {
        let r = ResourceRef {
            logical_uri: "spatial://dataset/parcels".into(),
            content_hash: Known::Value("sha256:abc".into()),
            source_revision: Known::Unknown(Unknown::new("none-pinned", "this slice pins no revision")),
            locators: vec![Locator { kind: "bundle-local", at: "data/".into() }],
            cache_status: "materialized-in-bundle",
            portability_policy: "self-contained",
        };
        let s = canonical::to_canonical_string(&r.to_json()).unwrap();
        assert!(s.contains(r#""source_revision":{"state":"none-pinned""#), "{s}");
        assert!(!s.contains(r#""source_revision":null"#));
        // All six docs/11 members present by name.
        for member in [
            "logical_uri",
            "content_hash",
            "source_revision",
            "locators",
            "cache_status",
            "portability_policy",
        ] {
            assert!(s.contains(&format!("\"{member}\"")), "missing {member}");
        }
    }

    #[test]
    fn absent_license_is_not_declared_and_invents_no_attribution() {
        let s = canonical::to_canonical_string(&License::NotDeclared.to_json()).unwrap();
        assert!(s.contains(r#""state":"not-declared""#));
        // Nothing that looks like a substituted default.
        assert!(!s.to_lowercase().contains("cc-by"));
        assert!(!s.to_lowercase().contains("public domain"));
    }

    /// A source that declared license-adjacent metadata and named **no** license serializes
    /// `"license":null` — the absence, not a placeholder (ADR-017 Corrigendum 1).
    ///
    /// The shape it must match is `attribution`'s, two members along, which the same test checks so
    /// the two cannot drift into different spellings of "absent".
    #[test]
    fn a_source_declared_license_with_no_name_is_null_and_never_a_placeholder() {
        let s = canonical::to_canonical_string(
            &License::DeclaredBySource(LicenseTerms {
                license: None,
                attribution: Some("© Example Cadastre".into()),
                redistribution: Redistribution::Permitted,
            })
            .to_json(),
        )
        .unwrap();
        assert!(s.contains(r#""state":"declared-by-source""#), "{s}");
        assert!(s.contains(r#""license":null"#), "{s}");
        // Not a placeholder, an empty string, or a word a consumer could read as a license name.
        assert!(!s.contains("unnamed"), "{s}");
        assert!(!s.contains(r#""license":"""#), "{s}");
        assert!(!s.contains(r#""license":"unknown""#), "{s}");

        // The other absence in the same block uses the identical spelling.
        let both_absent = canonical::to_canonical_string(
            &License::DeclaredBySource(LicenseTerms {
                license: None,
                attribution: None,
                redistribution: Redistribution::Unknown,
            })
            .to_json(),
        )
        .unwrap();
        assert!(both_absent.contains(r#""license":null,"attribution":null"#), "{both_absent}");
    }

    /// **An operator's license cannot be null, and the type is what guarantees it.**
    ///
    /// `DeclaredByOperator` holds a `String`, so there is no way to construct the manifest ADR-017
    /// §5 forbids. This test records the guarantee; the compiler enforces it.
    #[test]
    fn an_operator_declared_license_is_always_a_string() {
        let s = canonical::to_canonical_string(
            &License::DeclaredByOperator {
                license: "CC-BY-4.0".into(),
                attribution: None,
                redistribution: Redistribution::Permitted,
                by: "operator".into(),
                at: "2026-08-06T09:00:00Z".into(),
            }
            .to_json(),
        )
        .unwrap();
        assert!(s.contains(r#""license":"CC-BY-4.0""#), "{s}");
        assert!(!s.contains(r#""license":null"#), "{s}");
    }

    fn sample_operation() -> Operation {
        Operation {
            operation: "publish-static-bundle",
            source_logical_uri: "spatial://dataset/parcels".into(),
            source_content_hash: "sha256:0123".into(),
            id_source: "file:id".into(),
            id_uniqueness: "verified-at-open-full-file".into(),
            id_verified_rows: Some(100),
            crs_identifier: "EPSG:2056".into(),
            crs_source: "file".into(),
            axis_order: "easting,northing".into(),
            axis_normalization: "none-performed".into(),
            crs_definition_hash: Known::Value("sha256:def".into()),
            filter: Filter::WholeFile,
            limit: None,
            projection: vec![Column {
                name: "zone".into(),
                arrow_type: "Utf8".into(),
                nullable: true,
            }],
            ordering: "identity-ascending",
            format: FormatDeclaration {
                framing: "arrow-ipc-stream-per-partition",
                compression: "none",
                dictionaries: "none",
                geometry_encoding: "geoarrow.polygon".into(),
                coordinate_layout: "interleaved-xy".into(),
                partition_target_bytes: 1 << 20,
                partition_max_rows: 8192,
                partition_boundary_rule: "cut-before-append",
                max_partitions: 100_000,
            },
            style_hash: "sha256:style".into(),
        }
    }
}
