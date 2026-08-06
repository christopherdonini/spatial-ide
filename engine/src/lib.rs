//! # `engine` — the data-engine module (docs/02, docs/05)
//!
//! First cut, scoped to one operation: **open a GeoParquet → filter in SQL → stream GeoArrow
//! record batches → cancel.** Scaffolded for the `docs/07` Prototype hero slice, per that
//! document's method rule (vertical slices, never every module built in parallel to 20 %).
//!
//! ## What this module does
//!
//! - Opens a GeoParquet file through DuckDB and reads the file's own `geo` metadata.
//! - Holds the CRS as **part of the dataset's type** (`docs/05`), and refuses a file that does not
//!   carry one. See [`crs`] for the admission policy, recorded as **ADR-015 (Proposed)**.
//! - Filters with SQL over the GeoParquet 1.1 covering-bbox columns — a **linear scan**, not an
//!   index. Server-side spatial indexing is `docs/07`'s other open gate and is not touched here.
//! - Decodes WKB into **GeoArrow polygons**: `List<rings: List<vertices: FixedSizeList<xy>[2]>>`,
//!   variable-width, holes included.
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
//! - **No provenance column.** ADR-013 is Proposed and binds nothing; its own OPEN block says the
//!   per-feature-versus-per-vertex choice "should be made explicitly at acceptance, not inherited",
//!   and implementing one now *is* inheriting it. Nothing in this slice creates derived
//!   coordinates — there is no digitizing and no cursor unprojection — so there is nothing to
//!   record.
//! - **No persistence, no dataset registry, no lineage, no undo.** The operation is a pure
//!   transformation (ADR-006), it writes nothing, and it claims no reproducibility grade
//!   (ADR-005). The moment anything here caches to disk or names datasets by URI, `docs/11`'s
//!   ResourceRef model and `kernel/` are owed.
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

/// The Arrow crate version this workspace pins.
///
/// Partition bytes — and therefore every partition hash a bundle records — are a function of the
/// Arrow IPC writer, so a bundle that did not name it would be claiming byte-identity across
/// versions it has never seen. There is no runtime accessor for a dependency's version, so this is
/// a constant, and `engine/tests/slice.rs` asserts it against the workspace manifest rather than
/// leaving the two to drift.
pub const ARROW_CRATE_VERSION: &str = "58";

pub mod attributes;
pub mod cancel;
pub mod crs;
pub mod identity;
pub mod index;
pub mod dataset;
pub mod envelope;
pub mod error;
#[cfg(feature = "fixture")]
pub mod fixture;
pub mod geoarrow;
pub mod geoparquet;
pub mod pin;
pub mod pool;
pub mod stream;
pub mod wkb;

pub use attributes::MAX_PUBLISHED_ATTRIBUTES;
pub use cancel::CancelToken;
pub use pin::ContentPin;
pub use crs::{AxisOrder, CrsAssertion, CrsSource, DatasetCrs};
pub use dataset::Dataset;
pub use envelope::{BatchEnvelope, TaggedBatch, FRAME_AUTHORITATIVE, ID_COLUMN};
pub use error::{EngineError, Result};
pub use pool::{
    ConnectionPool, LeaseClass, PoolConfig, MAX_MAINTENANCE_CONNECTIONS, MAX_PHYSICAL_CONNECTIONS,
    MAX_STREAM_CONNECTIONS,
};
pub use stream::{
    BatchInfo, BatchSizePolicy, BatchStream, Bbox, ConnectionFacts, FilterPlan, RowOrdering,
    StreamStats, ViewportQuery, MAX_BATCH_BYTES, MAX_PUBLISH_PARTITIONS, MAX_QUEUED_BATCHES,
    MAX_ROWS_PER_BATCH, PUBLISH_PARTITION_ROWS, PUBLISH_PARTITION_TARGET_BYTES,
    TARGET_BATCH_BYTES,
};
