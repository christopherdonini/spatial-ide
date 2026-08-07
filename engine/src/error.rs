// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Typed, visible failures.
//!
//! `docs/05`: "Mixing CRS without a declared transform is an **error**, not a warning." Every
//! refusal in this module is a value in this enum — never a log line, never a default substituted
//! for a missing fact (`docs/01` principle 8).

use std::fmt;

#[derive(Debug)]
pub enum EngineError {
    /// The file could not be opened or read at all.
    Source(String),

    /// The file carries no readable CRS and the caller asserted none.
    ///
    /// GeoParquet's own specification says an **absent** `crs` key means OGC:CRS84. This engine
    /// does not apply that default: substituting a CRS the file does not state is precisely the
    /// silent conversion `docs/05` forbids. See `engine/README.md` and the proposed ADR-015.
    CrsUndeclared { detail: String },

    /// The file declares a CRS **and** the caller asserted one.
    ///
    /// Refused rather than resolved. Deciding whether the two agree would require a definitional
    /// equivalence check (`docs/05`: never a name-string comparison), which this slice does not
    /// implement because it performs no transform. Reassignment with preview is a data-doctor
    /// operation (`docs/05` detect → propose → preview → apply), which is Alpha work (`docs/07`).
    CrsAssertionConflict { declared: String, asserted: String },

    /// A query's viewport names a CRS other than the dataset's.
    ///
    /// **Deliberately a separate variant from `CrsAssertionConflict`.** The two refusals are
    /// unrelated — one is about admitting a *source*, the other about admitting a *query* — and
    /// sharing a variant meant a caller who asserted nothing received a message about caller
    /// assertions. A typed terminal has to say which refusal happened for the consumer to act on
    /// it.
    ViewportCrsMismatch { dataset: String, viewport: String },

    /// A viewport named the dataset's CRS by an identifier that identifies nothing.
    ///
    /// A definition-only CRS (PROJJSON with no authority and code) has no name to match against.
    /// Accepting a caller's echo of the placeholder would be a name comparison over a string that
    /// is not a name — the weakest possible form of the check `docs/05` already forbids.
    ViewportCrsUnidentifiable,

    /// The CRS is present but its axis order could not be established from the file.
    ///
    /// ADR-010 rule 1's tag has to *mean* something: `docs/05` requires that the normalization
    /// performed is recorded, and a hardcoded `easting,northing` records nothing.
    AxisOrderUnestablished { detail: String },

    /// The established axis order is not the one this slice can emit without normalizing.
    ///
    /// This slice performs no normalization, so an (N, E) or (lat, lon) source is refused rather
    /// than silently reinterpreted — the EPSG:4326 trap `docs/05` names, in its GeoParquet form.
    AxisOrderUnsupported { established: String },

    /// The `geo` metadata is present but not usable.
    GeoMetadata(String),

    /// A viewport filter was requested but the file declares no covering bbox column.
    ///
    /// This slice has no spatial index and no geometry accessor — server-side spatial indexing is
    /// `docs/07`'s other open gate and is deliberately untouched here.
    NoCoveringBbox { detail: String },

    /// Geometry bytes did not decode.
    Wkb(String),

    /// The geometry column's actual shape contradicts the GeoArrow encoding this engine would
    /// claim for it. Asserted per stream rather than assumed (ADR-010 rule 1's tag-on-envelope
    /// clause is only worth something if the tag is checked against the data).
    EncodingMismatch { claimed: String, found: String },

    /// The query failed inside DuckDB.
    Query(String),

    /// Arrow assembly or IPC serialization failed.
    Arrow(String),

    /// The stream was cancelled. Producer-side, observed on the producer's own clock.
    Cancelled,

    /// A declared ceiling was reached (ADR-010 rule 6: declared, not discovered).
    CeilingExceeded { ceiling: &'static str, limit: u64, saw: u64 },

    /// The declared or native identity column cannot serve as stable feature identity.
    ///
    /// ADR-016. Covers a missing column, a type that cannot widen into `u64` without a transform,
    /// a negative value, and a column that is not unique. All four are the same failure from a
    /// consumer's side — the id it is handed does not identify one feature — so they share a
    /// variant and are distinguished by `detail`.
    IdentityUnusable { column: String, detail: String },

    /// One feature alone is larger than the largest batch this engine will emit.
    ///
    /// Separate from `CeilingExceeded` because the remedy differs and the diagnosis has to name a
    /// feature: this is not a batch that grew past a ceiling by accumulating rows, it is a single
    /// geometry that cannot be carried whole. Without the id there is no way to find it in a file
    /// with millions of rows.
    FeatureTooLarge { id: u64, limit: u64, saw: u64 },

    /// A DuckDB connection could not be created or configured.
    ///
    /// Separate from `Source` because the two name different things: `Source` is about the file,
    /// this is about the execution resource the query would have run on. A caller that cannot tell
    /// them apart cannot tell "this file is unreadable" from "this process is out of connections".
    ConnectionSetup { detail: String },

    /// A column cannot be carried in a published bundle's partitions.
    ///
    /// Covers a column that is not in the file, a type outside the admissible set, the geometry or
    /// identity column named as an attribute, and a column named twice. They share a variant
    /// because from a caller's side they are one failure — this projection cannot be published —
    /// and `detail` says which.
    AttributeUnpublishable { column: String, detail: String },

    /// The source's bytes are not the bytes that were pinned.
    ///
    /// `detected_by` names **which check found it**, because the two checks establish different
    /// things: a content-hash re-read is a statement about the bytes, and the length/modification
    /// heuristic is a fail-closed guard that is not a content hash and must never be read as one.
    SourceChangedUnderPublish { pinned: String, observed: String, detected_by: &'static str },

    /// A dataset's bounded connection capacity is fully leased.
    ///
    /// **A refusal, never a queue.** Waiting for a connection would be an admission policy wearing
    /// a pool's clothes, and `protocol/data-plane/README.md` reserves the queue-versus-refuse
    /// question for **ADR-014**. This ceiling is provisional and reversible, exactly as that
    /// crate's own N+1 refusal is, and nothing here may be cited as evidence about ADR-014.
    ConnectionsExhausted { class: &'static str, capacity: usize },
}

impl fmt::Display for EngineError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Source(d) => write!(f, "source: {d}"),
            Self::CrsUndeclared { detail } => write!(
                f,
                "refused: the file declares no CRS and none was asserted by the caller ({detail}). \
                 This engine does not apply GeoParquet's OGC:CRS84 default (docs/05, no silent conversion)"
            ),
            Self::CrsAssertionConflict { declared, asserted } => write!(
                f,
                "refused: the file declares CRS {declared} and the caller asserted {asserted}. \
                 A caller assertion is admissible only for a file that declares nothing"
            ),
            Self::ViewportCrsMismatch { dataset, viewport } => write!(
                f,
                "refused: the viewport is expressed in {viewport} and the dataset is in {dataset}. \
                 This slice performs no reprojection, so a viewport in another CRS cannot be \
                 honoured (docs/05: mixing CRS without a declared transform is an error)"
            ),
            Self::ViewportCrsUnidentifiable => write!(
                f,
                "refused: the dataset's CRS is definition-only and carries no authority and code, \
                 so a viewport cannot name it. Send the viewport without a CRS to declare it is \
                 expressed in the dataset's own CRS"
            ),
            Self::AxisOrderUnestablished { detail } => write!(
                f,
                "refused: axis order could not be established from the file's CRS definition ({detail})"
            ),
            Self::AxisOrderUnsupported { established } => write!(
                f,
                "refused: established axis order is {established}; this slice performs no axis \
                 normalization and emits (easting, northing) only"
            ),
            Self::GeoMetadata(d) => write!(f, "geo metadata: {d}"),
            Self::NoCoveringBbox { detail } => write!(
                f,
                "refused: viewport filter needs a covering bbox column ({detail}); this slice has \
                 no spatial index (docs/07 open gate)"
            ),
            Self::Wkb(d) => write!(f, "wkb: {d}"),
            Self::EncodingMismatch { claimed, found } => {
                write!(f, "encoding mismatch: claimed {claimed}, found {found}")
            }
            Self::Query(d) => write!(f, "query: {d}"),
            Self::Arrow(d) => write!(f, "arrow: {d}"),
            Self::Cancelled => write!(f, "cancelled"),
            Self::CeilingExceeded { ceiling, limit, saw } => {
                write!(f, "declared ceiling {ceiling} exceeded: limit {limit}, saw {saw}")
            }
            Self::IdentityUnusable { column, detail } => write!(
                f,
                "refused: `{column}` cannot serve as stable feature identity — {detail}. \
                 Synthesizing a row ordinal instead is the hazard ADR-010 rule 2 exists to prevent"
            ),
            Self::FeatureTooLarge { id, limit, saw } => write!(
                f,
                "feature {id} needs about {saw} B on its own, above the declared per-batch \
                 ceiling of {limit} B; it cannot be carried in one batch"
            ),
            Self::ConnectionSetup { detail } => {
                write!(f, "duckdb connection could not be prepared: {detail}")
            }
            Self::AttributeUnpublishable { column, detail } => write!(
                f,
                "refused: `{column}` cannot be published as an attribute — {detail}. Nothing is \
                 cast, widened or stringified to make a column fit; a conversion the caller did \
                 not ask for is the silent conversion docs/01 principle 8 forbids"
            ),
            Self::SourceChangedUnderPublish { pinned, observed, detected_by } => write!(
                f,
                "refused: the source is not what was pinned — pinned {pinned}, observed {observed} \
                 ({detected_by}). A bundle built across a changing source would carry a content \
                 hash describing bytes it does not contain"
            ),
            Self::ConnectionsExhausted { class, capacity } => write!(
                f,
                "refused: this dataset's {class} connection capacity ({capacity}) is fully leased. \
                 The engine refuses rather than queueing; queueing would decide an admission \
                 policy that is reserved elsewhere"
            ),
        }
    }
}

impl std::error::Error for EngineError {}

pub type Result<T> = std::result::Result<T, EngineError>;
