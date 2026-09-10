// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Opening a GeoParquet dataset: read the file's own facts, admit or refuse, hold the CRS as type.
//!
//! `docs/05` puts DuckDB in the role of "querying GeoParquet", and that is the only role it has
//! here — the file's metadata is read *through* DuckDB (`parquet_kv_metadata`) rather than through a
//! second parquet implementation, so there is one reader in the shipped path.

use std::path::{Path, PathBuf};
use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;

use arrow::datatypes::{DataType, SchemaRef};
use duckdb::Connection;

use crate::cancel::CancelToken;
use crate::crs::{self, CrsAssertion, DatasetCrs};
use crate::envelope::{BatchEnvelope, ID_COLUMN};
use crate::identity::{self, DatasetIdentity, IdSource, IdUniqueness, IdentityDeclaration};
use crate::index;
use crate::rowgroup;
use crate::error::{EngineError, Result};
use crate::geoparquet::{CoveringBbox, GeoMeta};
use crate::pool::{ConnectionPool, Lease, LeaseClass, PoolConfig};

/// Process-wide, in-memory index cache. Not persisted — persisting is the trigger
/// `kernel/README.md` names for `docs/11`'s ResourceRef model and ADR-005's grades, and that needs
/// its own decision rather than arriving as a side effect of a latency fix.
static INDEX_CACHE: std::sync::LazyLock<index::IndexCache> =
    std::sync::LazyLock::new(index::IndexCache::default);

/// How many times the index seam has been consulted in this process.
///
/// **An instrument fact, unconditional, and deliberately not behind `cfg(test)` or a feature.** The
/// property under test is "the *shipped* planner never reaches the index", and a counter compiled
/// only into a test build would prove that about a build nobody runs — the same objection
/// `kernel/PROBE-PREREGISTRATION.md` invalidator 1 makes of a figure from a debug build. It costs
/// one relaxed-contended atomic on a path the product no longer takes at all, and it makes the
/// claim checkable rather than asserted (`docs/01` principle 8). `StreamStats` and the binding's
/// own stream registry are the same pattern.
static INDEX_CONSULTATIONS: AtomicU64 = AtomicU64::new(0);

/// Times any `Dataset` in this process has asked whether an index may serve a query.
///
/// Never an SKP field and never on the wire: it exists so a test can prove a negative
/// deterministically instead of inferring it from a timing.
pub fn index_consultations() -> u64 {
    INDEX_CONSULTATIONS.load(Ordering::SeqCst)
}

/// Process-wide, in-memory **row-group** index cache (lever B2). Not persisted, for the reason
/// `INDEX_CACHE` is not: the first thing this tree writes to disk owes `docs/11`'s ResourceRef model
/// and ADR-005's grades, and that is a decision rather than a side effect of a latency fix.
static ROW_GROUP_CACHE: std::sync::LazyLock<rowgroup::RowGroupCache> =
    std::sync::LazyLock::new(rowgroup::RowGroupCache::default);

/// How many times the row-group seam has been consulted in this process.
///
/// The same instrument, unconditional and not `cfg(test)`-gated, for the same reason
/// `INDEX_CONSULTATIONS` is: the property under test is that the **shipped** planner never reaches
/// this seam, and a counter compiled only into a test build would prove that about a build nobody
/// runs.
static ROW_GROUP_CONSULTATIONS: AtomicU64 = AtomicU64::new(0);

/// Times any `Dataset` in this process has asked whether a row-group index may serve a query.
///
/// Never an SKP field and never on the wire.
pub fn row_group_consultations() -> u64 {
    ROW_GROUP_CONSULTATIONS.load(Ordering::SeqCst)
}

/// What one `build_row_group_index` call cost and produced.
///
/// Build cost and query benefit stay separate, and **admissibility is a first-class field rather
/// than something inferred from a later plan**: "this file's statistics cannot support an injection"
/// is a fact about the file, decided once, and a caller that learned it only from a query's
/// `FilterPlan` would be learning it once per query.
#[derive(Clone, Debug)]
pub struct RowGroupReport {
    /// `None` when a cached index was reused; otherwise why it could not be.
    pub miss: Option<index::IndexMiss>,
    pub content_hash_millis: f64,
    pub build_millis: f64,
    pub row_groups: usize,
    pub admissible: std::result::Result<(), rowgroup::RowGroupRefusal>,
    pub declared_memory_bytes: usize,
    /// Footer rows `parquet_metadata` returned — one per (row group × column), so it is the
    /// metadata query's own size and not the file's row count.
    pub scanned_metadata_rows: u64,
}

/// What one `build_index` call cost and produced. Build cost and query benefit stay separate.
#[derive(Clone, Debug)]
pub struct IndexReport {
    /// `None` when a cached index was reused; otherwise why it could not be.
    pub miss: Option<index::IndexMiss>,
    pub content_hash_millis: f64,
    pub build_millis: f64,
    pub indexed_features: usize,
    pub declared_memory_bytes: usize,
    pub scanned_rows: u64,
}

/// Everything the engine established about a file at open time.
pub struct Dataset {
    path: PathBuf,
    envelope: BatchEnvelope,
    covering: Option<CoveringBbox>,
    geo: GeoMeta,
    file_schema: SchemaRef,
    /// This dataset's own bounded DuckDB connections.
    ///
    /// **Owned here and nowhere else.** A process-wide, path-keyed connection cache would outlive
    /// the `Dataset` holding the admitted CRS (ADR-015) and identity (ADR-016) facts, and a later
    /// caller could then run against a connection admitted under a different dataset's policy.
    /// Dropping this `Dataset` closes its idle connections; a lease still in flight keeps the pool
    /// alive until the query it is running is over.
    pool: Arc<ConnectionPool>,
    /// The source's content pin, if a caller took one. `None` until [`Dataset::pin_content`] is
    /// called — never computed on demand, because a hash taken at the moment of comparison compares
    /// the file with itself.
    pin: std::sync::Mutex<Option<crate::pin::ContentPin>>,
    /// License and attribution as the **file** declares them, read once at open and carried
    /// verbatim.
    source_license: SourceLicense,
}

/// License and attribution as a source file declares them — **verbatim, uninterpreted**.
///
/// `docs/14` requires published bundles to surface license metadata "when known". Knowing means the
/// file said so: nothing here parses SPDX, reads license text, or infers terms from a URL. A source
/// that declares nothing produces `SourceLicense::default()`, and the publisher records that as
/// `not-declared` rather than inventing attribution to fill a field.
#[derive(Clone, Debug, Default, PartialEq, Eq)]
pub struct SourceLicense {
    pub license: Option<String>,
    pub attribution: Option<String>,
    /// The source's own redistribution term, verbatim. The publisher's carryability test reads
    /// exactly this one field and refuses a bundle whose source says `forbidden` — a static bundle
    /// *is* a redistributed copy.
    pub redistribution: Option<String>,
}

impl SourceLicense {
    fn from_kv(kv: &[(String, Vec<u8>)]) -> Self {
        let get = |key: &str| -> Option<String> {
            kv.iter()
                .find(|(k, _)| k == key)
                .and_then(|(_, v)| String::from_utf8(v.clone()).ok())
                .map(|s| s.trim().to_string())
                .filter(|s| !s.is_empty())
        };
        Self {
            license: get(LICENSE_KEY),
            attribution: get(ATTRIBUTION_KEY),
            redistribution: get(REDISTRIBUTION_KEY),
        }
    }

    pub fn declares_anything(&self) -> bool {
        self.license.is_some() || self.attribution.is_some() || self.redistribution.is_some()
    }
}

impl Dataset {
    /// Open a GeoParquet file whose CRS the file itself declares.
    pub fn open(path: impl AsRef<Path>) -> Result<Self> {
        Self::open_inner(path.as_ref(), None, None, &CancelToken::new(), PoolConfig::default())
    }

    /// Open a GeoParquet file, supplying a CRS for the case where the file declares none.
    ///
    /// The assertion is consulted **only** if the file declares nothing. If the file declares a
    /// CRS, this refuses rather than overriding — see `crs::admit`.
    pub fn open_with_asserted_crs(path: impl AsRef<Path>, assertion: CrsAssertion) -> Result<Self> {
        Self::open_inner(
            path.as_ref(),
            Some(assertion),
            None,
            &CancelToken::new(),
            PoolConfig::default(),
        )
    }

    /// Open a file whose feature identity lives in a column this engine does not name `id`
    /// (**ADR-016 §3**).
    ///
    /// The declaration is explicit, per dataset, and never inferred. The uniqueness scan runs over
    /// the **mapped** values and reads a whole column, so it is an *operation* rather than a lookup
    /// — `cancel` is honoured throughout (`docs/01` principle 7), and at `docs/07`'s 5 GB it lands
    /// on the same `docs/08` cold-open budget `kernel/RESULTS.md` records as unmeasured.
    pub fn open_with_declared_identity(
        path: impl AsRef<Path>,
        identity: IdentityDeclaration,
        cancel: &CancelToken,
    ) -> Result<Self> {
        Self::open_inner(path.as_ref(), None, Some(identity), cancel, PoolConfig::default())
    }

    /// Open with an explicit connection configuration.
    ///
    /// **The product default is `PoolConfig::reuse()` and every other constructor uses it.** This
    /// entry point exists so a *measurement* can run the same code with `max_idle = 0` — the
    /// control for the reuse contrast recorded in `kernel/RESULTS.md`. It is a capacity, not a
    /// second code path: the acquire, attach, detach, verify and refusal paths are identical in
    /// both configurations, so the contrast measures reuse rather than two implementations.
    pub fn open_with_connections(
        path: impl AsRef<Path>,
        assertion: Option<CrsAssertion>,
        connections: PoolConfig,
    ) -> Result<Self> {
        Self::open_inner(path.as_ref(), assertion, None, &CancelToken::new(), connections)
    }

    /// Open with every admission parameter exposed, and a caller-held cancel token.
    ///
    /// **This is the constructor a control-plane host uses.** The four constructors above all pass
    /// a throwaway `CancelToken::new()` internally — nobody outside `open_inner` could ever reach
    /// it, so `open_dataset` was uncancellable even though `admit_identity`'s uniqueness scan (a
    /// multi-second, uninterruptible whole-column read at `docs/07`'s 5 GB) already threads a token
    /// through every path. This constructor changes nothing about *what* runs; it only lets a
    /// caller hold the token that was always there (SKP-V0.md §2, correction C3).
    pub fn open_cancellable(
        path: impl AsRef<Path>,
        assertion: Option<CrsAssertion>,
        declared_identity: Option<IdentityDeclaration>,
        cancel: &CancelToken,
        connections: PoolConfig,
    ) -> Result<Self> {
        Self::open_inner(path.as_ref(), assertion, declared_identity, cancel, connections)
    }

    fn open_inner(
        path: &Path,
        assertion: Option<CrsAssertion>,
        declared_identity: Option<IdentityDeclaration>,
        cancel: &CancelToken,
        connections: PoolConfig,
    ) -> Result<Self> {
        if !path.is_file() {
            return Err(EngineError::Source(format!("{} is not a readable file", path.display())));
        }
        let path_str = path
            .to_str()
            .ok_or_else(|| EngineError::Source("path is not valid UTF-8".into()))?
            .to_string();

        // **Open runs on a lease, and that is what prepares the pool at no extra cost.**
        //
        // `kernel/RESULTS.md` records a ~20–25 ms uninterruptible prelude before `cancel.attach`,
        // and this cut must not silently double `Dataset::open`. Opening already needed one
        // configured connection — for `parquet_kv_metadata`, the schema probe and ADR-016's
        // identity scan — so instead of dropping it at the end of open, it is *returned* to the
        // pool. Nothing new is created and no new statement runs in the prelude; the first stream
        // then finds a configured connection already there. If open fails, the lease is dropped and
        // the connection discarded, because a `Dataset` that does not exist owns nothing.
        let pool = ConnectionPool::new(connections);
        let lease = pool.acquire(LeaseClass::Maintenance)?;
        let conn = lease.connection();

        // One footer read serves both the `geo` key and the declared license keys. A second read
        // would be a second chance for the two to disagree about the same file.
        let kv = read_kv_metadata(conn, &path_str)?;
        let geo_json = geo_from_kv(&kv, &path_str)?;
        let geo = GeoMeta::parse(&geo_json)?;
        let source_license = SourceLicense::from_kv(&kv);

        if !geo.encoding.eq_ignore_ascii_case("WKB") {
            return Err(EngineError::GeoMetadata(format!(
                "geometry encoding is `{}`; this slice reads WKB-encoded GeoParquet only",
                geo.encoding
            )));
        }
        if !geo.geometry_types.is_empty()
            && !geo.geometry_types.iter().all(|t| t.eq_ignore_ascii_case("Polygon"))
        {
            return Err(EngineError::GeoMetadata(format!(
                "geometry_types {:?} include non-polygon types; this slice reads polygons only",
                geo.geometry_types
            )));
        }

        // SF3/SF4 (reviewer gate, admission-remediation cut): the assertion's own shape — a
        // non-blank identifier, a definition within `MAX_CRS_DEFINITION_BYTES` — is checked before
        // anything about it is parsed, including the `serde_json::from_str` immediately below.
        if let Some(a) = assertion.as_ref() {
            crs::validate_assertion_shape(a)?;
        }

        // The asserted axis order comes from the caller's own definition when it supplied one.
        // This engine never supplies an axis order it did not read somewhere.
        let asserted_axis = match assertion.as_ref().and_then(|a| a.definition_json.as_deref()) {
            Some(def) => {
                let v: serde_json::Value = serde_json::from_str(def)
                    .map_err(|e| EngineError::GeoMetadata(format!("asserted definition: {e}")))?;
                Some(crate::geoparquet::axis_order_from_projjson(&v)?)
            }
            None => None,
        };

        // **The reader establishes the format's own semantics; this line consumes them.**
        // `format_semantics` runs R-C1…R-C5 (`engine/ADMISSION-PREREGISTRATION.md` §2b) and hands
        // back the tuple `crs::admit` takes as "what the file declares" — whose axis order is the
        // **data's** order, established in `geoparquet.rs` and nowhere else. The admission policy
        // itself (`crs::admit`, `crs.rs`) is untouched by this cut.
        let semantics = crate::geoparquet::format_semantics(&geo);
        if assertion.is_none() {
            if let Some(detail) = semantics.undeclared_detail.clone() {
                // R-C1: the version is not pinned, so no format rule was read. The refusal is the
                // one that has always been raised here; only its `detail` is new, and it names the
                // version rather than leaving the caller to guess why the default did not apply.
                return Err(EngineError::CrsUndeclared { detail });
            }
        }
        // **R-C6, unchanged in every respect.** A caller's assertion over a file that declares
        // nothing is admissible exactly as it was before this cut: the format's default is a rule
        // this engine applies when nobody says otherwise, not a declaration by the file, so it does
        // not turn an assertion into `CrsAssertionConflict`. An assertion over a file that *does*
        // declare is refused, as it always was — that path is untouched.
        let admissible = match (assertion.is_some(), semantics.crs_provenance) {
            (true, Some(crate::geoparquet::CrsProvenance::FormatDefault)) => None,
            _ => semantics.admissible_crs.clone(),
        };
        let crs = crs::admit(admissible, assertion.as_ref(), asserted_axis)?;
        // **Narrowed by R-C4, not relaxed.** The order checked here is the data's. A file whose
        // definition is (northing, easting) or (latitude, longitude) now reaches this line carrying
        // the order the format's WKB rule establishes, so it is admitted and its declared order
        // travels beside it. What still refuses: a caller-asserted non-x-first CRS (R-C6, unchanged
        // — no format rule governs an assertion), and a declared non-x-first CRS in a file whose
        // spec version is not pinned in this tree (R-C1).
        if !crs.axis_order().is_x_first() {
            return Err(EngineError::AxisOrderUnsupported {
                established: crs.axis_order().as_str().to_string(),
            });
        }

        let file_schema = probe_schema(conn, &path_str)?;
        check_geometry_column(&file_schema, &geo.primary_column)?;

        // The provenance of what was just admitted. A caller's assertion is its own class and is
        // decided here, because `format_semantics` is not told about assertions: the format governs
        // the file, never the caller's claim about it.
        let (crs_provenance, axis_provenance, declared_axis_order, format_rule_reference) =
            match crs.source() {
                crs::CrsSource::CallerAsserted => (
                    crate::geoparquet::CrsProvenance::Asserted,
                    crate::geoparquet::AxisProvenance::Declared,
                    Some(crs.axis_order()),
                    None,
                ),
                // **A provenance class is read or the open stops; it is never substituted.**
                // `crs::admit` reaches its file arm only because `format_semantics` handed it a
                // CRS, and every branch that does so sets both provenances — so the `None` arm is
                // unreachable today. Filling it in with `Declared` would record a class this
                // reader never established, which is exactly what `docs/01` principle 8 forbids
                // and what the whole of P1 exists to keep apart from a fact.
                crs::CrsSource::File => match (semantics.crs_provenance, semantics.axis_provenance)
                {
                    (Some(crs_class), Some(axis_class)) => (
                        crs_class,
                        axis_class,
                        semantics.declared_axis_order,
                        semantics.format_rule_reference.clone(),
                    ),
                    (crs_class, axis_class) => {
                        debug_assert!(
                            false,
                            "a file CRS was admitted with crs_provenance {crs_class:?} and \
                             axis_provenance {axis_class:?}"
                        );
                        return Err(EngineError::Source(format!(
                            "internal inconsistency: {} was admitted as the file's own CRS, but \
                             the reader recorded crs_provenance {crs_class:?} and axis_provenance \
                             {axis_class:?}. A provenance class is a recorded fact and is never \
                             substituted for a missing one",
                            crs.identifier()
                        )));
                    }
                },
            };

        // The sanity check (R-S1…R-S3), before the identity scan: a file the format's own default
        // is contradicted by is refused on that ground, which is the first outcome it reaches.
        let (sanity_level, sanity_reason) =
            sanity_check(conn, &path_str, &geo, &file_schema, crs_provenance, &semantics, cancel)?;

        let admission = crate::geoparquet::AdmissionRecord {
            crs_provenance,
            axis_provenance,
            declared_axis_order,
            format_rule_reference,
            sanity_level,
            sanity_reason,
        };

        // Identity admission (ADR-016). Native `id` unless the caller declared a mapping; the
        // uniqueness scan runs either way, so a native column is no longer trusted without it.
        let identity = admit_identity(conn, &path_str, &file_schema, declared_identity, cancel)?;

        // Verified, then kept. `probe_schema` abandons a result iterator mid-flight and
        // `read_geo_metadata`'s own comment records what that used to cost two calls later; while
        // the connection died at the end of every open, the latent state died with it. It no longer
        // does, so `release_healthy` runs a trivial drained statement first, uniformly, rather than
        // this code reasoning about which of open's paths happen to have proven health. A
        // connection that fails it is discarded and open still succeeds — with an empty pool.
        lease.release_healthy();

        Ok(Self {
            path: path.to_path_buf(),
            envelope: BatchEnvelope::admitted(crs, geo.primary_column.clone(), identity, admission),
            covering: geo.covering.clone(),
            geo,
            file_schema,
            pool,
            pin: std::sync::Mutex::new(None),
            source_license,
        })
    }

    /// License and attribution as the source file declares them. Verbatim, uninterpreted.
    pub fn source_license(&self) -> &SourceLicense {
        &self.source_license
    }

    /// The DuckDB library version actually linked into this process.
    ///
    /// **Asked at runtime rather than hardcoded.** DuckDB produced the result set and its ordering,
    /// so a bundle that records a reproducibility grade has to name which DuckDB — and a constant
    /// would record the version someone typed rather than the version that ran.
    ///
    /// Runs on a maintenance lease, so it neither creates a connection nor takes one a stream needs.
    pub fn duckdb_version(&self) -> Result<String> {
        let lease = self.pool.acquire(LeaseClass::Maintenance)?;
        let version: std::result::Result<String, _> =
            lease.connection().query_row("SELECT version()", [], |r| r.get(0));
        match version {
            Ok(v) => {
                lease.release_healthy();
                Ok(v)
            }
            Err(e) => {
                drop(lease);
                Err(EngineError::Query(format!("duckdb version: {e}")))
            }
        }
    }

    /// Pin this source's bytes — an **explicit** whole-file SHA-256, cancellable throughout.
    ///
    /// Deliberately not part of `open`. `kernel/RESULTS.md` measures the hash at ~603–610 ms on the
    /// 100 000-feature fixture, and `docs/07`'s hero slice opens a 5 GB file whose cold-open cost
    /// that same file records as **unmeasured** — so an unconditional hash at open would spend that
    /// on every viewport query's dataset to serve a check only publishing needs. The caller that
    /// needs the pin pays for it, visibly, at a call site that can be grepped.
    ///
    /// Idempotent: a second call re-reads and replaces the pin rather than returning a stale one,
    /// because "the pin I took a while ago" is precisely the thing this exists to stop trusting.
    /// Returns the pin and the milliseconds the hash took, as separate quantities.
    pub fn pin_content(&self, cancel: &CancelToken) -> Result<(crate::pin::ContentPin, f64)> {
        self.pin_content_observed(cancel, None)
    }

    /// As [`Self::pin_content`], reporting bytes hashed / total through `on_progress` as the hash
    /// proceeds — RELEASE-0.1 item 10 (DECISIONS-PENDING entry 7's ruled pre-fix), so a caller
    /// driving a "Preparing…" UI can show the pin phase's own progress rather than a silent wait.
    pub fn pin_content_observed(
        &self,
        cancel: &CancelToken,
        on_progress: Option<&mut dyn FnMut(u64, u64)>,
    ) -> Result<(crate::pin::ContentPin, f64)> {
        let (pin, millis) = crate::pin::ContentPin::take_with_progress(self.path(), cancel, on_progress)?;
        *self.pin.lock().unwrap_or_else(|e| e.into_inner()) = Some(pin.clone());
        Ok((pin, millis))
    }

    /// The pin taken by [`Self::pin_content`], if one was. `None` is the honest answer for a
    /// dataset nobody pinned — never a pin computed on demand, which would defeat the check by
    /// hashing the file at exactly the moment the comparison happens.
    pub fn content_pin(&self) -> Option<crate::pin::ContentPin> {
        self.pin.lock().unwrap_or_else(|e| e.into_inner()).clone()
    }

    /// This dataset's connections — capacity, counters and current occupancy.
    ///
    /// Instrument surface only: these are Rust-API facts for tests and measurement, never SKP
    /// fields and never on the wire.
    pub fn connections(&self) -> &Arc<ConnectionPool> {
        &self.pool
    }

    pub fn identity(&self) -> &DatasetIdentity {
        self.envelope.identity()
    }

    /// Build (or reuse) this dataset's spatial index — `docs/07`'s open gate.
    ///
    /// **Build cost and query benefit are different quantities and are returned separately.** The
    /// report carries the content-hash cost, the index build cost and the row count as their own
    /// numbers; nothing here nets them into "pays for itself after N queries", which would be a
    /// claim neither figure supports on its own.
    ///
    /// The index is per-process and in-memory (`index::IndexCache`). A cached index is *found* by
    /// path and *admitted* by content hash, builder version, answered predicate, build parameters
    /// and a fail-closed validity heuristic — so a stale index cannot serve a newer revision; it is
    /// found, rejected, and the reason is in the report.
    pub fn build_index(&self, cancel: &CancelToken) -> Result<IndexReport> {
        self.build_index_observed(cancel, None)
    }

    /// As `build_index`, reporting each phase it enters to an observer.
    ///
    /// **A test and measurement seam, not a new engine protocol.** The previous cancellation pass
    /// fired all twelve of its delays inside the SHA-256 content hash and obtained *zero* samples
    /// of the DuckDB scan phase, because a delay ladder cannot aim at a phase it cannot see. The
    /// observer sees phase transitions and nothing else — never per-feature data, which would be a
    /// second bulk path — and the public `build_index` passes none, so this costs nothing when
    /// unused.
    pub fn build_index_observed(
        &self,
        cancel: &CancelToken,
        observer: Option<&dyn index::IndexPhaseObserver>,
    ) -> Result<IndexReport> {
        let covering = self.covering().ok_or_else(|| EngineError::NoCoveringBbox {
            detail: "the file's `geo` metadata declares no covering.bbox, so there is nothing to                      index in this slice"
                .into(),
        })?;

        index::observe(observer, index::IndexPhase::ContentHash);
        let (content_hash, hash_millis) = index::content_hash(self.path(), cancel)?;
        let key = index::IndexKey::new(content_hash, self.identity().source().source_column());
        let validity = index::ValidityHeuristic::of(self.path());

        match INDEX_CACHE.get(self.path(), &key, validity.as_ref()) {
            Ok(existing) => {
                index::observe(observer, index::IndexPhase::Complete);
                Ok(IndexReport {
                    miss: None,
                    content_hash_millis: hash_millis,
                    build_millis: 0.0,
                    indexed_features: existing.feature_count(),
                    declared_memory_bytes: existing.declared_memory_bound(),
                    scanned_rows: existing.scanned_rows(),
                })
            }
            Err(miss) => {
                let path_str = self
                    .path()
                    .to_str()
                    .ok_or_else(|| EngineError::Source("path is not valid UTF-8".into()))?;
                // An index build is a whole-file pass, so it takes a **maintenance** lease rather
                // than a stream one: four admitted streams must not make a build impossible, and a
                // build must not consume the capacity a stream needs.
                let lease = self.pool.acquire(LeaseClass::Maintenance)?;
                let built = index::SpatialIndex::build_observed(
                    lease.connection(),
                    path_str,
                    covering,
                    self.identity().source().source_column(),
                    key,
                    validity,
                    cancel,
                    observer,
                );
                // **The lease's fate is decided from the build's own outcome, before the `?`.** A
                // cancelled build interrupted DuckDB on this connection, so it is discarded and
                // replaced rather than handed on; and the capacity slot is freed either way, or the
                // single maintenance slot would leak and every later `build_index` in the process
                // would refuse.
                let built = match built {
                    Ok(b) => {
                        lease.release_healthy();
                        b
                    }
                    Err(e) => {
                        drop(lease);
                        return Err(e);
                    }
                };
                let report = IndexReport {
                    miss: Some(miss),
                    content_hash_millis: hash_millis,
                    build_millis: built.build_millis(),
                    indexed_features: built.feature_count(),
                    declared_memory_bytes: built.declared_memory_bound(),
                    scanned_rows: built.scanned_rows(),
                };
                // Reached only on a completed build: a cancelled one returned above, so no partial
                // index is ever inserted.
                INDEX_CACHE.insert(self.path().to_path_buf(), std::sync::Arc::new(built));
                index::observe(observer, index::IndexPhase::Complete);
                Ok(report)
            }
        }
    }

    /// The index that may serve this dataset right now, if any.
    ///
    /// Re-checks admission on every call rather than caching the answer: the file can change under
    /// a long-lived process, and an index that was admissible a minute ago is not thereby
    /// admissible now.
    ///
    /// **The ordinary planner does not call this.** See `stream.rs`'s planner comment: the only
    /// caller is the explicitly-named experimental stream entry point.
    pub(crate) fn admitted_index(&self) -> Option<std::sync::Arc<index::SpatialIndex>> {
        INDEX_CONSULTATIONS.fetch_add(1, Ordering::SeqCst);
        let hash = INDEX_CACHE.hash_for(self.path())?;
        let key = index::IndexKey::new(hash, self.identity().source().source_column());
        INDEX_CACHE.get(self.path(), &key, index::ValidityHeuristic::of(self.path()).as_ref()).ok()
    }

    /// Build (or reuse) this dataset's **row-group** index — lever B2 of the first-batch cut.
    ///
    /// Same discipline as [`Self::build_index`] and, deliberately, the same shape of report:
    /// content-hash cost and build cost are **separate numbers and are never netted** into "pays for
    /// itself after N queries". Two additional facts ride along, because without them a cell cannot
    /// be attributed: how many row groups the file has, and whether the file's own statistics admit
    /// an id-range injection at all.
    ///
    /// **The metadata query is one `parquet_metadata()` call on a maintenance lease**, for the same
    /// reason `build_index` takes one: it is a whole-file operation in kind, and four admitted
    /// streams must not make a build impossible.
    pub fn build_row_group_index(&self, cancel: &CancelToken) -> Result<RowGroupReport> {
        self.build_row_group_index_observed(cancel, None)
    }

    /// As [`Self::build_row_group_index`], reporting each phase to an observer.
    pub fn build_row_group_index_observed(
        &self,
        cancel: &CancelToken,
        observer: Option<&dyn index::IndexPhaseObserver>,
    ) -> Result<RowGroupReport> {
        let covering = self.covering().ok_or_else(|| EngineError::NoCoveringBbox {
            detail: "the file's `geo` metadata declares no covering.bbox, so a row group has no \
                     envelope to reason about"
                .into(),
        })?;

        index::observe(observer, index::IndexPhase::ContentHash);
        let (content_hash, hash_millis) = index::content_hash(self.path(), cancel)?;
        let key = rowgroup::RowGroupKey::new(content_hash, self.identity().source().source_column());
        let validity = index::ValidityHeuristic::of(self.path());

        match ROW_GROUP_CACHE.get(self.path(), &key, validity.as_ref()) {
            Ok(existing) => {
                index::observe(observer, index::IndexPhase::Complete);
                Ok(RowGroupReport {
                    miss: None,
                    content_hash_millis: hash_millis,
                    build_millis: 0.0,
                    row_groups: existing.total_groups(),
                    admissible: existing.admissible(),
                    declared_memory_bytes: existing.declared_memory_bound(),
                    scanned_metadata_rows: existing.scanned_metadata_rows(),
                })
            }
            Err(miss) => {
                let path_str = self
                    .path()
                    .to_str()
                    .ok_or_else(|| EngineError::Source("path is not valid UTF-8".into()))?;
                let lease = self.pool.acquire(LeaseClass::Maintenance)?;
                let built = rowgroup::RowGroupIndex::build(
                    lease.connection(),
                    path_str,
                    covering,
                    self.identity().source().source_column(),
                    key,
                    validity,
                    cancel,
                    observer,
                );
                // The lease's fate is decided from the build's own outcome, before the `?` — a
                // cancelled build interrupted DuckDB on this connection, and the capacity slot must
                // be freed either way or the single maintenance slot leaks.
                let built = match built {
                    Ok(b) => {
                        lease.release_healthy();
                        b
                    }
                    Err(e) => {
                        drop(lease);
                        return Err(e);
                    }
                };
                let report = RowGroupReport {
                    miss: Some(miss),
                    content_hash_millis: hash_millis,
                    build_millis: built.build_millis(),
                    row_groups: built.total_groups(),
                    admissible: built.admissible(),
                    declared_memory_bytes: built.declared_memory_bound(),
                    scanned_metadata_rows: built.scanned_metadata_rows(),
                };
                // Reached only on a completed build: a cancelled one returned above, so no partial
                // index is ever inserted.
                ROW_GROUP_CACHE.insert(self.path().to_path_buf(), std::sync::Arc::new(built));
                index::observe(observer, index::IndexPhase::Complete);
                Ok(report)
            }
        }
    }

    /// The row-group index that may serve this dataset right now, if any.
    ///
    /// Re-checks admission on every call, exactly as [`Self::admitted_index`] does and for the same
    /// reason: the file can change under a long-lived process.
    ///
    /// **The ordinary planner does not call this.** The only caller is the explicitly-named
    /// experimental stream entry point, and `engine/tests/row_group_seam.rs` is what keeps that true
    /// — its own file, its own process, because this counter is process-wide.
    pub(crate) fn admitted_row_groups(&self) -> Option<std::sync::Arc<rowgroup::RowGroupIndex>> {
        ROW_GROUP_CONSULTATIONS.fetch_add(1, Ordering::SeqCst);
        let hash = ROW_GROUP_CACHE.hash_for(self.path())?;
        let key = rowgroup::RowGroupKey::new(hash, self.identity().source().source_column());
        ROW_GROUP_CACHE
            .get(self.path(), &key, index::ValidityHeuristic::of(self.path()).as_ref())
            .ok()
    }

    pub fn path(&self) -> &Path {
        &self.path
    }

    pub fn crs(&self) -> &DatasetCrs {
        self.envelope.crs()
    }

    pub fn envelope(&self) -> &BatchEnvelope {
        &self.envelope
    }

    pub fn geometry_column(&self) -> &str {
        &self.geo.primary_column
    }

    pub fn covering(&self) -> Option<&CoveringBbox> {
        self.covering.as_ref()
    }

    pub fn geoparquet_version(&self) -> &str {
        &self.geo.version
    }

    /// What admission recorded about how this dataset's CRS and data axis order were established,
    /// and at what level the range check ran. Always present for a dataset that opened.
    pub fn admission(&self) -> Option<&crate::geoparquet::AdmissionRecord> {
        self.envelope.admission()
    }

    pub fn file_schema(&self) -> &SchemaRef {
        &self.file_schema
    }
}

/// Keys the engine reads from a source's parquet key/value metadata besides `geo`.
///
/// **A closed, declared list.** Carrying every key a file happens to hold into a published artifact
/// would publish unreviewed metadata (`docs/09`), and guessing which key means "license" is exactly
/// the inference ADR-016 §3 refuses for identity and `docs/05` assigns to the data doctor's
/// propose-with-preview path. Values are carried **verbatim** and never parsed: no SPDX
/// interpretation, no reading of license text.
pub const LICENSE_KEY: &str = "license";
pub const ATTRIBUTION_KEY: &str = "attribution";
pub const REDISTRIBUTION_KEY: &str = "redistribution";

/// The `geo` key out of an already-read footer.
fn geo_from_kv(kv: &[(String, Vec<u8>)], path: &str) -> Result<String> {
    for (k, v) in kv {
        if k == "geo" {
            return String::from_utf8(v.clone())
                .map_err(|e| EngineError::GeoMetadata(format!("`geo` is not UTF-8: {e}")));
        }
    }
    Err(EngineError::GeoMetadata(format!(
        "{path} carries no `geo` key: it is a parquet file, but not a GeoParquet file"
    )))
}

/// Every key/value pair in the parquet footer, read once.
fn read_kv_metadata(conn: &Connection, path: &str) -> Result<Vec<(String, Vec<u8>)>> {
    let mut stmt = conn
        .prepare("SELECT key, value FROM parquet_kv_metadata(?)")
        .map_err(|e| EngineError::Source(format!("prepare kv metadata: {e}")))?;

    // Drained in full before anything else runs on this connection. Abandoning a result
    // mid-iteration and then preparing the next statement left DuckDB reporting
    // "ActiveTransaction called without active transaction" — an internal error surfacing as an
    // unrelated failure two calls later, which is exactly the kind of thing that is cheap to avoid
    // and expensive to diagnose.
    let pairs: Vec<(Vec<u8>, Vec<u8>)> = stmt
        .query_map([path], |row| {
            let k: Vec<u8> = row.get(0)?;
            let v: Vec<u8> = row.get(1)?;
            Ok((k, v))
        })
        .map_err(|e| EngineError::Source(format!("read kv metadata: {e}")))?
        .collect::<std::result::Result<Vec<_>, _>>()
        .map_err(|e| EngineError::Source(format!("kv metadata row: {e}")))?;

    Ok(pairs
        .into_iter()
        .map(|(k, v)| (String::from_utf8_lossy(&k).to_string(), v))
        .collect())
}

fn probe_schema(conn: &Connection, path: &str) -> Result<SchemaRef> {
    let mut stmt = conn
        .prepare("SELECT * FROM read_parquet(?) LIMIT 0")
        .map_err(|e| EngineError::Source(format!("prepare schema probe: {e}")))?;
    let arrow = stmt
        .query_arrow([path])
        .map_err(|e| EngineError::Source(format!("schema probe: {e}")))?;
    Ok(arrow.get_schema())
}

/// The range check — **R-S1…R-S3** (`engine/ADMISSION-PREREGISTRATION.md` §2c), and **a sanity
/// check rather than a truth test** (Brief A settled boundary 2).
///
/// It exists for one situation: a format rule supplied a CRS the file never stated, and the file's
/// own coordinates can show that rule to be contradicted. So it **convicts or is silent**. Nothing
/// it does establishes that a file is correct, conformant or checked-and-sound, and no string it
/// records may say so.
///
/// Its stated limit, which travels with it into KNOWN-LIMITATIONS (boundary 2, verbatim): *"A
/// projected file inside ±180/±90 is NOT detected by it"*.
///
/// **What it reads, in order, and never two of them (R-S1).**
///
/// 1. `metadata` — footer-resident facts only: the geometry column's own `bbox` member, else
///    Parquet statistics on the covering bbox columns.
/// 2. `sample` — **the first row group** of the covering bbox columns only, capped at
///    [`crate::geoparquet::SANITY_SAMPLE_MAX_ROWS`] (R-S1; §13 B), never the WKB.
/// 3. `none` — neither was available, or the covering names a column the schema does not contain
///    (R-S3: the open still succeeds, and the reason is recorded).
///
/// **It never reads all coordinates at open**, and the level it ran at is always recorded, on the
/// envelope and in the record `describe` will carry.
///
/// **Every query it issues is bound to the caller's cancellation token**, the way the identity scan
/// beside it already is (`docs/01` principle 7). Nothing about what runs changes when nobody
/// cancels; what changes is that a cancel arriving during an open reaches DuckDB rather than
/// waiting for the read to finish.
fn sanity_check(
    conn: &Connection,
    path: &str,
    geo: &GeoMeta,
    schema: &SchemaRef,
    crs_provenance: crate::geoparquet::CrsProvenance,
    semantics: &crate::geoparquet::FormatSemantics,
    cancel: &CancelToken,
) -> Result<(crate::geoparquet::SanityLevel, String)> {
    use crate::geoparquet::{CrsProvenance, SanityLevel};

    // A caller's assertion is not a format rule, and a file that declares its own CRS and needed no
    // rule has nothing assumed about it to convict.
    let rule = match crs_provenance {
        CrsProvenance::Asserted => None,
        _ => semantics.format_rule_reference.as_deref(),
    };
    let Some(rule) = rule else {
        return Ok((
            SanityLevel::NotChecked,
            "no format rule was applied, so nothing about the coordinates was assumed and there \
             is nothing to convict"
                .to_string(),
        ));
    };

    // Only the absent-key default *assumes* a CRS the file never stated (R-S2). Where the rule
    // established the data's axis order over a CRS the file did declare, the level below records
    // what evidence was available; no range verdict is taken from it, because the CRS is the
    // file's own.
    let convicts = crs_provenance == CrsProvenance::FormatDefault;

    // 1. The geometry column's own `bbox` member — in the footer, alongside the `geo` key already
    //    read, so consulting it is not a read of the data.
    if let Some(bbox) = geo.bbox {
        let reason = format!(
            "read from the `geo` metadata's own `bbox` member [{}, {}, {}, {}] under the format \
             rule {rule}",
            bbox[0], bbox[1], bbox[2], bbox[3]
        );
        return convict_or_record(SanityLevel::Metadata, reason, bbox, convicts);
    }

    let Some(covering) = geo.covering.as_ref() else {
        return Ok((
            SanityLevel::NotChecked,
            format!(
                "the file's `geo` metadata carries neither a `bbox` member nor a covering bbox \
                 column, so nothing footer-resident or column-local was available to decide a \
                 level from under the format rule {rule}. Not checked"
            ),
        ));
    };

    // R-S3: a covering may name a column that is not in the file. Today such a file opens and
    // fails later at query; this cut leaves that behaviour alone and records the level as `none`
    // with the reason, rather than making open refuse — that would be a user-visible behaviour
    // change, and it is on the preregistration's human list (§12d), not taken here.
    let paths = [&covering.xmin, &covering.ymin, &covering.xmax, &covering.ymax];
    if let Some(missing) = paths.iter().find(|p| !field_path_exists(schema, p)) {
        return Ok((
            SanityLevel::NotChecked,
            format!(
                "the covering names `{}`, which the file's schema does not contain, so no level \
                 could be decided from it. Not checked",
                missing.0.join(".")
            ),
        ));
    }

    // 2. Parquet statistics on those columns — footer-resident as well.
    if let Some(bbox) = covering_statistics(conn, path, covering, cancel)? {
        let reason = format!(
            "read from the covering bbox columns' parquet statistics [{}, {}, {}, {}] under the \
             format rule {rule}",
            bbox[0], bbox[1], bbox[2], bbox[3]
        );
        return convict_or_record(SanityLevel::Metadata, reason, bbox, convicts);
    }

    // 3. The sample: the covering bbox columns of **the first row group**, capped at the declared
    //    ceiling, and nothing else. The row group is the unit R-S1 and §13 B name; a fixed row
    //    count spans several row groups on a file whose groups are small, which is a different read
    //    from the one the rule states.
    let first_row_group = first_row_group_rows(conn, path, cancel)?;
    let cap = crate::geoparquet::SANITY_SAMPLE_MAX_ROWS;
    let limit = first_row_group.map_or(cap, |rows| rows.min(cap));
    let (rows_read, qualifier) = match first_row_group {
        Some(rows) if rows > cap => (
            format!("the first {limit} row(s) of the first row group ({rows} rows)"),
            format!(", capped at the declared ceiling of {cap} rows"),
        ),
        Some(rows) => (format!("the first row group ({rows} rows)"), String::new()),
        // The footer gave no row count for the first row group, so the declared ceiling is the only
        // bound left. Recorded as what it is rather than described as a row group that was read.
        None => (
            format!("the first {limit} row(s)"),
            ", the footer carrying no row count for the first row group".to_string(),
        ),
    };
    match covering_sample(conn, path, covering, limit, cancel)? {
        Some(bbox) => {
            let reason = format!(
                "read from {rows_read} of the covering bbox columns only{qualifier}, [{}, {}, {}, \
                 {}], under the format rule {rule}",
                bbox[0], bbox[1], bbox[2], bbox[3]
            );
            convict_or_record(SanityLevel::Sample, reason, bbox, convicts)
        }
        None => Ok((
            SanityLevel::NotChecked,
            format!(
                "the covering bbox columns carry no value in {rows_read}{qualifier}, so nothing \
                 was read. Not checked"
            ),
        )),
    }
}

/// Apply R-S2 where a format rule supplied the CRS, and record the level either way.
///
/// A `false` from the domain test says the coordinates cannot be longitude/latitude on WGS84. A
/// `true` says nothing: the level and what it was read from are recorded, and no outcome is
/// described as a check that passed.
fn convict_or_record(
    level: crate::geoparquet::SanityLevel,
    reason: String,
    bbox: [f64; 4],
    convicts: bool,
) -> Result<(crate::geoparquet::SanityLevel, String)> {
    if convicts && !crate::geoparquet::inside_crs84_domain(bbox) {
        return Err(EngineError::FormatDefaultContradicted {
            detail: format!(
                "at level `{}`, {reason}: [{}, {}, {}, {}] leaves ±{}/±{}",
                level.as_str(),
                bbox[0],
                bbox[1],
                bbox[2],
                bbox[3],
                crate::geoparquet::CRS84_MAX_ABS_X,
                crate::geoparquet::CRS84_MAX_ABS_Y
            ),
        });
    }
    if convicts {
        Ok((level, reason))
    } else {
        Ok((
            level,
            format!(
                "{reason}; no range check applies, because the CRS is the file's own declaration \
                 and only the data's axis order came from the format"
            ),
        ))
    }
}

/// Whether a covering path resolves to a real field, walking struct children.
fn field_path_exists(schema: &SchemaRef, path: &crate::geoparquet::FieldPath) -> bool {
    let mut segments = path.0.iter();
    let Some(first) = segments.next() else { return false };
    let Some(field) = schema.fields().iter().find(|f| f.name() == first) else { return false };
    let mut current = field.clone();
    for segment in segments {
        let DataType::Struct(children) = current.data_type() else { return false };
        match children.iter().find(|f| f.name() == segment) {
            Some(child) => current = child.clone(),
            None => return false,
        }
    }
    true
}

/// Run one open-path query bound to the caller's cancellation token.
///
/// **The same shape `admit_identity` already uses**, applied to the reads the sanity check issues
/// (`docs/01` principle 7): attach the connection's interrupt handle before the statement runs,
/// detach after it, and report a token that was cancelled as `Cancelled` rather than returning a
/// value read from an interrupted query. Nothing about what runs changes when nothing cancels.
fn cancellable<T>(
    conn: &Connection,
    cancel: &CancelToken,
    run: impl FnOnce(&Connection) -> Result<T>,
) -> Result<T> {
    cancel.attach(Arc::clone(&conn.interrupt_handle()))?;
    let outcome = run(conn);
    cancel.detach();
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }
    outcome
}

/// The first row group's row count, out of the footer this open has already read — the unit R-S1
/// and §13 B give the `sample` level.
///
/// `None` where the footer carries no row count for row group 0 (an empty file, or a rendering this
/// query cannot read one from); the caller then bounds the read by the declared ceiling alone and
/// records that it did.
fn first_row_group_rows(
    conn: &Connection,
    path: &str,
    cancel: &CancelToken,
) -> Result<Option<usize>> {
    cancellable(conn, cancel, |conn| {
        let mut stmt = conn
            .prepare(
                "SELECT row_group_num_rows FROM parquet_metadata(?) WHERE row_group_id = 0 LIMIT 1",
            )
            .map_err(|e| EngineError::Source(format!("prepare row group metadata: {e}")))?;
        let mut rows = stmt
            .query([path])
            .map_err(|e| EngineError::Source(format!("read row group metadata: {e}")))?;
        let Some(row) = rows
            .next()
            .map_err(|e| EngineError::Source(format!("row group metadata row: {e}")))?
        else {
            return Ok(None);
        };
        let count: Option<i64> = row
            .get(0)
            .map_err(|e| EngineError::Source(format!("row group row count: {e}")))?;
        Ok(count.and_then(|n| usize::try_from(n).ok()))
    })
}

/// The covering bbox columns' Parquet statistics, out of the footer — `None` when the file carries
/// none for them, which is what sends R-S1 on to its next level.
fn covering_statistics(
    conn: &Connection,
    path: &str,
    covering: &CoveringBbox,
    cancel: &CancelToken,
) -> Result<Option<[f64; 4]>> {
    let rows: Vec<(String, Option<String>, Option<String>)> = cancellable(conn, cancel, |conn| {
        let mut stmt = conn
            .prepare(
                "SELECT path_in_schema, stats_min_value, stats_max_value FROM parquet_metadata(?)",
            )
            .map_err(|e| EngineError::Source(format!("prepare parquet metadata: {e}")))?;
        stmt.query_map([path], |row| {
            Ok((row.get::<_, String>(0)?, row.get::<_, Option<String>>(1)?, row.get::<_, Option<String>>(2)?))
        })
        .map_err(|e| EngineError::Source(format!("read parquet metadata: {e}")))?
        .collect::<std::result::Result<Vec<_>, _>>()
        .map_err(|e| EngineError::Source(format!("parquet metadata row: {e}")))
    })?;

    // **How a nested path is spelled is DuckDB's own rendering, not a contract.** This build joins
    // a struct child's path with `", "`; another may join it with `.`. Both are normalized to the
    // same segment spelling before comparison, and a path this cannot match simply does not supply
    // a `metadata` level — R-S1 then falls to `sample`, which is a level recorded honestly rather
    // than a claim made from a path nothing read.
    let normalize = |s: &str| s.replace(',', ".").replace(' ', "");
    let extreme = |wanted: &crate::geoparquet::FieldPath, take_max: bool| -> Option<f64> {
        let key = wanted.0.join(".");
        let mut out: Option<f64> = None;
        for (name, lo, hi) in &rows {
            if normalize(name) != key {
                continue;
            }
            let text = if take_max { hi.as_ref() } else { lo.as_ref() };
            let v: f64 = text?.parse().ok()?;
            out = Some(match (out, take_max) {
                (Some(prev), true) => prev.max(v),
                (Some(prev), false) => prev.min(v),
                (None, _) => v,
            });
        }
        out
    };

    match (
        extreme(&covering.xmin, false),
        extreme(&covering.ymin, false),
        extreme(&covering.xmax, true),
        extreme(&covering.ymax, true),
    ) {
        (Some(xmin), Some(ymin), Some(xmax), Some(ymax)) => Ok(Some([xmin, ymin, xmax, ymax])),
        _ => Ok(None),
    }
}

/// The `sample` level's read: the covering bbox columns, bounded to `limit` rows, and no other
/// column named anywhere in the statement. Never the WKB.
///
/// `limit` is the caller's — the first row group's row count, capped at
/// [`crate::geoparquet::SANITY_SAMPLE_MAX_ROWS`] (R-S1; §13 B). This function does not choose it,
/// so the bound the record names and the bound the statement carries are one value.
fn covering_sample(
    conn: &Connection,
    path: &str,
    covering: &CoveringBbox,
    limit: usize,
    cancel: &CancelToken,
) -> Result<Option<[f64; 4]>> {
    let sql = format!(
        "SELECT min(x0), min(y0), max(x1), max(y1) FROM (SELECT {xmin} AS x0, {ymin} AS y0, \
         {xmax} AS x1, {ymax} AS y1 FROM read_parquet('{p}') LIMIT {n})",
        xmin = covering.xmin.to_sql(),
        ymin = covering.ymin.to_sql(),
        xmax = covering.xmax.to_sql(),
        ymax = covering.ymax.to_sql(),
        p = path.replace('\'', "''"),
        n = limit,
    );
    cancellable(conn, cancel, |conn| {
        let mut stmt = conn
            .prepare(&sql)
            .map_err(|e| EngineError::Query(format!("prepare covering sample: {e}")))?;
        let mut rows =
            stmt.query([]).map_err(|e| EngineError::Query(format!("covering sample: {e}")))?;
        let Some(row) =
            rows.next().map_err(|e| EngineError::Query(format!("covering sample: {e}")))?
        else {
            return Ok(None);
        };
        let value = |i: usize| -> Result<Option<f64>> {
            row.get::<_, Option<f64>>(i)
                .map_err(|e| EngineError::Query(format!("covering sample value: {e}")))
        };
        match (value(0)?, value(1)?, value(2)?, value(3)?) {
            (Some(xmin), Some(ymin), Some(xmax), Some(ymax)) => Ok(Some([xmin, ymin, xmax, ymax])),
            _ => Ok(None),
        }
    })
}

/// Admit the dataset's feature identity — **ADR-016 §3–§6**.
///
/// Refusal is the default: absent a declaration, the engine looks for its own `id` column and
/// refuses if it is not there. A declaration redirects identity to a named source column, and
/// **changes nothing else** — in particular it does not weaken any check.
///
/// The uniqueness scan is what turns "a column exists" into "an id identifies one feature", and it
/// runs for a **native** column too: ADR-016's Context records that the native column was
/// previously trusted without it, which is the gap this closes.
///
/// A declared column name is the one caller-supplied string that legitimately reaches SQL text
/// (as a doubled-quote-escaped identifier). What bounds it is **schema membership, not escaping
/// alone**: the name must first match a field in the file's own Arrow schema, refused typed
/// otherwise, before any SQL is composed — SKP-V0 §7.4's "never string-concatenated" discipline,
/// made explicit for the one site that interpolates an identifier at all (docs/09).
fn admit_identity(
    conn: &Connection,
    path: &str,
    schema: &SchemaRef,
    declared: Option<IdentityDeclaration>,
    cancel: &CancelToken,
) -> Result<DatasetIdentity> {
    let (source, column, skip) = match declared {
        Some(d) => {
            let col = d.column.clone();
            (IdSource::Mapped { column: col.clone(), by: d.by, at: d.at }, col, d.skip_uniqueness_check)
        }
        None => (IdSource::File, ID_COLUMN.to_string(), false),
    };

    let field = schema.fields().iter().find(|f| f.name() == &column).ok_or_else(|| {
        EngineError::IdentityUnusable {
            column: column.clone(),
            detail: if matches!(source, IdSource::File) {
                "the file has no such column, and no identity mapping was declared. Stable \
                 per-feature identity is required (docs/11); declare a mapping to a column that \
                 carries it"
                    .to_string()
            } else {
                "the file has no such column".to_string()
            },
            candidate_columns: identity::candidate_identity_columns(schema),
        }
    })?;

    // §4's value-preserving test. A type needing a transform to reach u64 is refused outright.
    identity::admit_column_type(&column, field.data_type(), schema)?;

    if skip {
        // Recorded, not hidden. A caller may take responsibility for uniqueness; it may not make
        // that invisible to the consumer downstream of it.
        return Ok(DatasetIdentity::new(source, IdUniqueness::DeclaredNotVerified, None, None));
    }

    // **One pass, three questions.** Row count, distinct count and the extreme values come from a
    // single scan because each extra pass over a 5 GB column is another cold-open cost. `MIN` is
    // here because a signed source column widens into u64 exactly only if it holds no negative
    // value — §4 admits the *type* and this refuses the *values*.
    let sql = format!(
        "SELECT count(*), count(DISTINCT \"{c}\"), min(\"{c}\"), max(\"{c}\") \
         FROM read_parquet('{p}')",
        c = column.replace('"', "\"\""),
        p = path.replace('\'', "''")
    );

    // Bound to the caller's token before the scan starts, so a cancel arriving mid-scan reaches
    // DuckDB's interrupt rather than waiting for a whole column to be read (principle 7).
    cancel.attach(std::sync::Arc::clone(&conn.interrupt_handle()))?;
    let scan = run_identity_scan(conn, &sql);
    cancel.detach();
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }
    let (rows, distinct, min, max) = scan?;

    if let Some(m) = min {
        if m < 0 {
            return Err(EngineError::IdentityUnusable {
                column: column.clone(),
                detail: format!(
                    "holds a negative value ({m}); identity is carried as u64 and a negative \
                     source value cannot widen into it without changing the value"
                ),
                candidate_columns: identity::candidate_identity_columns(schema),
            });
        }
    }
    if distinct != rows {
        return Err(EngineError::IdentityUnusable {
            column: column.clone(),
            detail: format!(
                "{rows} rows carry only {distinct} distinct values, so at least two features share \
                 an identity. ADR-010 rule 2 resolves a pick through this id, and a shared id \
                 returns a wrong-but-plausible feature with nothing raised"
            ),
            candidate_columns: identity::candidate_identity_columns(schema),
        });
    }

    Ok(DatasetIdentity::new(
        source,
        IdUniqueness::VerifiedAtOpenFullFile,
        Some(rows),
        max.and_then(|m| u64::try_from(m).ok()),
    ))
}

fn run_identity_scan(
    conn: &Connection,
    sql: &str,
) -> Result<(u64, u64, Option<i128>, Option<i128>)> {
    let mut stmt = conn
        .prepare(sql)
        .map_err(|e| EngineError::Query(format!("identity scan prepare: {e}")))?;
    let mut rows = stmt
        .query([])
        .map_err(|e| EngineError::Query(format!("identity scan: {e}")))?;
    let row = rows
        .next()
        .map_err(|e| EngineError::Query(format!("identity scan: {e}")))?
        .ok_or_else(|| EngineError::Query("identity scan returned no row".into()))?;
    let count: i64 = row.get(0).map_err(|e| EngineError::Query(format!("count: {e}")))?;
    let distinct: i64 = row.get(1).map_err(|e| EngineError::Query(format!("distinct: {e}")))?;
    // **NULL and "did not convert" are different answers and must not share a branch.**
    //
    // `Option<i64>` distinguishes them: MIN/MAX are NULL for an empty file, which is zero features
    // and not an error. Swallowing the error with `.ok()` instead meant that a UBIGINT column whose
    // max exceeds `i64::MAX` — precisely the values ADR-016 §7's width contract exists to flag —
    // read as `None`, so `id_js_exact` was omitted from an envelope that still claimed
    // `verified-at-open-full-file`. The consumer was told "verified, width unknown" about a file
    // provably not JS-exact. Unsigned is tried first for that reason.
    let (min, max) = match (row.get::<_, Option<u64>>(2), row.get::<_, Option<u64>>(3)) {
        (Ok(lo), Ok(hi)) => (lo.map(|v| v as i128), hi.map(|v| v as i128)),
        _ => {
            let lo: Option<i64> =
                row.get(2).map_err(|e| EngineError::Query(format!("identity min: {e}")))?;
            let hi: Option<i64> =
                row.get(3).map_err(|e| EngineError::Query(format!("identity max: {e}")))?;
            (lo.map(i128::from), hi.map(i128::from))
        }
    };
    Ok((count as u64, distinct as u64, min, max))
}

/// The geometry column, checked at open so a stream cannot fail halfway for a reason that was
/// knowable up front.
fn check_geometry_column(schema: &SchemaRef, geometry_column: &str) -> Result<()> {
    let geom = schema
        .fields()
        .iter()
        .find(|f| f.name() == geometry_column)
        .ok_or_else(|| {
            EngineError::Source(format!(
                "`geo.primary_column` names `{geometry_column}`, which the file does not contain"
            ))
        })?;
    if !matches!(geom.data_type(), DataType::Binary | DataType::LargeBinary | DataType::BinaryView) {
        return Err(EngineError::Source(format!(
            "geometry column `{geometry_column}` is {}; WKB must be a binary column",
            geom.data_type()
        )));
    }
    Ok(())
}

/// A leased DuckDB connection for one stream, with its interrupt handle already bound to `cancel`.
///
/// **The lease is taken here — on the caller's thread — rather than inside the producer thread**,
/// so there is no window in which a cancel could arrive before anything is interruptible. The
/// configuration statement no longer runs here at all: it ran once when this physical connection
/// was created, which is the whole of what this cut removes from the query's critical path.
///
/// If the attach fails the lease is dropped rather than returned: a connection whose cancellation
/// binding did not take is one this engine has established nothing about.
pub(crate) fn lease_for_stream(
    dataset: &Dataset,
    cancel: &crate::cancel::CancelToken,
) -> Result<Lease> {
    let lease = dataset.pool.acquire(LeaseClass::Stream)?;
    cancel.attach(Arc::clone(&lease.connection().interrupt_handle()))?;
    Ok(lease)
}
