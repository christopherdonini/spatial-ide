// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! # `engine` — the data-engine module (docs/02, docs/05)
//!
//! Its first cut was scoped to one operation: **open a GeoParquet → filter in SQL → stream
//! GeoArrow record batches → cancel.** That operation now carries one of five GeoArrow encodings,
//! selected at open (ADR-034, Accepted), and a declared attribute projection on both the publish
//! stream and the live projected stream (ADR-023 stays Proposed and binds nothing). Scaffolded for
//! the `docs/07` Prototype hero slice, per that document's method rule (vertical slices, never
//! every module built in parallel to 20 %).
//!
//! ## What this module does
//!
//! - Opens a GeoParquet file through DuckDB and reads the file's own `geo` metadata.
//! - Holds the CRS as **part of the dataset's type** (`docs/05`) and records where it came from: the
//!   file's own `crs`, a caller's assertion, or — for an absent key under a pinned GeoParquet
//!   version — the format's own published rule. A file whose CRS none of these supplies is refused.
//!   See [`crs`] for the admission policy, recorded as **ADR-015** (Accepted, with its Amendment 1).
//! - Filters with SQL over the GeoParquet 1.1 covering-bbox columns — a **linear scan** in the
//!   product planner. The fixed-grid index is built and tested ([`index`]) but is not in that
//!   planner; `docs/07`'s gate on it is closed for this slice's shape only (see the README's
//!   index sections).
//! - Decodes WKB into **GeoArrow polygons** (`geoarrow.polygon`:
//!   `List<rings: List<vertices: FixedSizeList<xy>[2]>>`), **GeoArrow multipolygons**
//!   (`geoarrow.multipolygon`: `List<polygons: List<rings: List<vertices: FixedSizeList<xy>[2]>>>`)
//!   **GeoArrow points** (`geoarrow.point`: `FixedSizeList<xy>[2]`), **GeoArrow linestrings**
//!   (`geoarrow.linestring`: `List<vertices: FixedSizeList<xy>[2]>`) or **GeoArrow
//!   multilinestrings** (`geoarrow.multilinestring`:
//!   `List<linestrings: List<vertices: FixedSizeList<xy>[2]>>`), variable-width where the encoding
//!   is, holes included. Which encoding a dataset travels in is a fact of the open (ADR-034): a
//!   declared set of exactly Polygon gives the first, a set that includes MultiPolygon, or an empty
//!   or absent declaration, gives the second, a set of exactly Point gives the third, a set of
//!   exactly LineString gives the fourth, and a lineal set that includes MultiLineString gives the
//!   fifth. It never varies per batch.
//! - Emits Arrow IPC batches whose envelope names their frame, CRS, CRS source and axis order
//!   (ADR-010 rule 1), by construction rather than by convention — see [`envelope`].
//! - Streams and cancels: the DuckDB result is consumed lazily, and cancellation reaches DuckDB's
//!   own interrupt rather than only the loop around it (`docs/01` principle 7; `docs/08`'s
//!   <100 ms budget applies to an operation that has not produced anything yet).
//!
//! ## What this module deliberately does not do
//!
//! - **No transport.** Nothing here names a socket, a URL, a port, or a frame. The binding lives in
//!   `protocol/data-plane` and this module has no dependency on it (ADR-004: "one semantic API,
//!   multiple optimized *bindings*").
//! - **No reprojection**, so no PROJ dependency and no definitional-equivalence check (`docs/05`).
//!   A viewport in a different CRS is refused, not transformed.
//! - **No provenance column.** ADR-013 is Accepted: its granularity was ruled per-feature at
//!   acceptance, and the column's shape is deferred (its Acceptance appendix, items 1 and 3). This
//!   module writes no provenance column. The tiers it builds are derived and never authoritative;
//!   no ADR-013 applicability to them is asserted here.
//! - **No dataset registry, no lineage, no undo.** The stream code in this module opens no file
//!   for writing, and DuckDB's default spill of intermediates is not configured off by the engine
//!   (`kernel/CANCELLATION-AND-TRACING.md` §7; `kernel/RESULTS.md`, the subsection on §5d being
//!   partially measurable). The stream is a pure transformation (ADR-006); it claims no
//!   reproducibility grade (ADR-005). The tier builder (`lod::build_tiers`) writes a derived, non-authoritative tier cache: a directory per source
//!   content hash under `LOD_TIER_ROOT`, one GeoParquet file per derived tier, and `tiers.json`.
//!   Caching to disk was this module's own trigger for owing `docs/11`'s ResourceRef model and
//!   `kernel/`, and that trigger has come due for the cache. What is owed — whether a tier set
//!   carries a ResourceRef and an ADR-005 statement, and what the kernel side owes — is a named
//!   open item on the PLAN node `lod-tier-selection`, which the human rules before any product path
//!   calls `build_tiers`. It is not discharged here, and no SKP command calls `build_tiers` today.
//! - **No geometry repair.** An unclosed ring is a typed refusal. Consent-based repair with a
//!   before/after diff belongs to the data doctor (`docs/05`), which is Alpha work.
//!
//! ## Declared recovery policy (ADR-010 rule 7)
//!
//! **`none` — fail visibly and terminate the stream with a typed, surfaced error.** No retry, no
//! reconnect, no partial result presented as complete. A producer thread that dies delivers its
//! error as the stream's terminal outcome; there is no watchdog because there is nothing to
//! restart. *Not declaring* would not be a valid option; this is the declaration.
//!
//! ## Scope of any measurement taken through this module
//!
//! Windows 10 Pro 22H2 / MSVC / bundled DuckDB. Nothing here says anything about macOS or Linux —
//! the same limit `docs/07` places on ADR-003.

/// This crate's version, for a manifest's software block. **A recorded version, not a build
/// identity** — ADR-005's Exact grade wants pinned software and a crate version is not that.
pub const CRATE_VERSION: &str = env!("CARGO_PKG_VERSION");

/// The Arrow **version requirement** this workspace declares — not the resolved version.
///
/// Partition bytes, and therefore every partition hash a bundle records, are a function of the Arrow
/// IPC writer, so a bundle that named nothing would be claiming byte-identity across writers it has
/// never seen.
///
/// **The distinction is load-bearing and the manifest field is named for it.** This is the semver
/// requirement from the workspace manifest (`58`), which `engine/tests/slice.rs` asserts against so
/// the two cannot drift. It is **not** the resolved patch version — `Cargo.lock` currently says
/// 58.4.0 — and there is no runtime accessor for one. So byte-identity is claimed **within** a
/// resolved Arrow version and is not claimed across a patch bump, and the manifest says so rather
/// than implying otherwise by recording a number that looks more precise than it is.
pub const ARROW_CRATE_VERSION_REQUIREMENT: &str = "58";

/// The one classifying function for a column name that does not round-trip through this engine's
/// own admission — `engine/B1-PROJECTION-PREREGISTRATION.md` §10 Amendment 12, 12.1(c).
pub(crate) mod addressability;
pub mod attributes;
pub mod cancel;
pub mod crs;
pub mod crs_catalog;
pub mod dataset;
pub mod descriptor;
pub mod envelope;
pub mod error;
#[cfg(feature = "fixture")]
pub mod fixture;
pub mod geoarrow;
pub mod geoparquet;
pub mod identity;
pub mod index;
/// Spatially-clustered layout variants — lever B1. Test/measurement support, gated with the
/// generator for the same reason: rewriting a file is not one of the things `docs/02` scopes to
/// this module.
#[cfg(feature = "fixture")]
pub mod layout;
/// LOD tier construction — route B, per `engine/LOD-PREREGISTRATION.md`. **Builds tiers; selects
/// none**: which tier a viewport draws is renderer/shell work under its own gate, and nothing here
/// is served to a shell by this cut.
pub mod lod;
pub mod pin;
pub mod pool;
pub mod predicate;
pub mod rowgroup;
pub mod stream;
pub mod trace;
/// The advisory source-change watcher's adapter — `SOURCE-WATCHER-PREREGISTRATION.md` §2a.
pub mod watch;
pub mod wkb;

pub use attributes::{AdmittedProjection, ProjectionError, MAX_PROJECTED_ATTRIBUTES};
pub use cancel::CancelToken;
pub use crs::{
    AxisOrder, CrsAssertion, CrsSource, DatasetCrs, GEOGRAPHIC_DISPLAY_CONVENTION,
    MAX_CRS_DEFINITION_BYTES,
};
pub use crs_catalog::{definition_provenance, CatalogEntry};
pub use dataset::Dataset;
pub use descriptor::{SourceDescriptor, FOOTER_DESCRIPTOR_MAX_BYTES};
pub use envelope::{BatchEnvelope, TaggedBatch, FRAME_AUTHORITATIVE, ID_COLUMN};
pub use error::{EngineError, Result};
pub use geoarrow::GeometryEncoding;
pub use geoparquet::{
    AdmissionRecord, AxisProvenance, CoordinateUnit, CoordinateUnitSource, CrsProvenance,
    SanityLevel, MAX_UNIT_NAME_BYTES, PINNED_SPEC_VERSIONS, SANITY_SAMPLE_MAX_ROWS,
};
pub use identity::{
    DatasetIdentity, IdSource, IdUniqueness, IdentityDeclaration, FILE_ROW_NUMBER_COLUMN,
    SESSION_IDENTITY_STATEMENT,
};
pub use pin::ContentPin;
pub use pool::{
    ConnectionPool, LeaseClass, PoolConfig, MAX_ADMISSION_CONNECTIONS, MAX_MAINTENANCE_CONNECTIONS,
    MAX_PHYSICAL_CONNECTIONS, MAX_STREAM_CONNECTIONS,
};
pub use predicate::{
    AdmittedPredicate, FilterError, PredicateAdmitError, TypeRefusalReason, MAX_PREDICATE_BYTES,
    MAX_PREDICATE_DEPTH,
};
pub use rowgroup::{RowGroupIndex, RowGroupRefusal, RowGroupSelection};
pub use stream::{
    BatchCut, BatchCutPolicy, BatchInfo, BatchPoll, BatchSizePolicy, BatchStream, Bbox,
    ConnectionFacts, FilterPlan, RowOrdering, StreamStats, ViewportQuery, BUDGET_CHECK_ROW_STRIDE,
    FIRST_BATCH_TIME_BUDGET, MAX_BATCH_BYTES, MAX_PUBLISH_PARTITIONS, MAX_QUEUED_BATCHES,
    MAX_ROWS_PER_BATCH, PUBLISH_PARTITION_ROWS, PUBLISH_PARTITION_TARGET_BYTES,
    PUBLISH_STREAM_POLL_INTERVAL, TARGET_BATCH_BYTES,
};
pub use watch::{ArmOutcome, ArmedWatch, PlatformWatch, SourceWatchArm, WatchSignal, WatchSink};
