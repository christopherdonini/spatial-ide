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
        }
    }
}

impl std::error::Error for EngineError {}

pub type Result<T> = std::result::Result<T, EngineError>;
