//! One operation: open → SQL filter → stream GeoArrow batches → cancel.
//!
//! `docs/05` Execution: "Streaming, cancellable queries; partial results flow to the renderer as
//! they arrive." Three things make that true here rather than claimed:
//!
//! 1. The DuckDB result is consumed with `stream_arrow`, which fetches chunks lazily. A
//!    collect-then-chunk implementation would satisfy the word "stream" and miss `docs/08`'s
//!    "First pixels < 100 ms after query start" by the whole query.
//! 2. Batches are produced **on demand**: the producer thread blocks on a bounded channel, so a
//!    consumer that stops reading stops the producer (H3), and nothing is generated ahead of need.
//! 3. Cancellation reaches DuckDB itself (`cancel.rs`), not just the loop around it.
//!
//! **The fixed-grid spatial index is not in the product planner, and the reason is measured.** See
//! the planner comment on `build_sql`. `index.rs` still builds and answers correctly; it is reached
//! only through `stream_indexed_experimental`, which no product path calls.

use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::atomic::{AtomicU64, AtomicUsize, Ordering};
use std::sync::mpsc::{sync_channel, Receiver};
use std::sync::Arc;

use arrow::array::{Array, ArrayRef, BinaryArray, BinaryViewArray, Int64Array, LargeBinaryArray, UInt64Array};
use duckdb::ToSql;

use crate::cancel::CancelToken;
use crate::dataset::{lease_for_stream, Dataset};
use crate::envelope::{BatchEnvelope, TaggedBatch, ID_COLUMN};
use crate::error::{EngineError, Result};
use crate::geoarrow::build_polygon_array;
use crate::wkb::PolygonBuilder;

/// Declared ceilings — ADR-010 rule 6: "A layer design states its ceiling … before approaching it."
/// Declared here, asserted in `stream.rs`'s own tests, and reported by the binding that carries
/// them onto the wire.
pub const MAX_BATCH_BYTES: usize = 4 * 1024 * 1024;
/// Batches are cut at this size; `MAX_BATCH_BYTES` is the hard ceiling above it.
pub const TARGET_BATCH_BYTES: usize = 1024 * 1024;

/// **Progressive first-batch sizing.** The first batch is cut small so pixels can land sooner, and
/// subsequent batches grow to `TARGET_BATCH_BYTES`.
///
/// `docs/08`'s "First pixels < 100 ms after query start" is missed today at this dataset class, and
/// `kernel/RESULTS.md` attributes p50 109.7 ms of it to the producer *before any browser*. That
/// 109.7 ms is two components — query start-up, and scanning until a batch is full — and this
/// policy attacks only the second. **It therefore cannot be claimed to meet the budget until the
/// two are decomposed**, because if start-up alone is ≥ 100 ms no batch size reaches it.
///
/// **The floor is declared, not discovered.** Every batch is a complete self-contained Arrow IPC
/// stream — schema, metadata, one record batch, EOS — so the whole envelope is repeated per batch
/// (that repetition is deliberate: it is what puts the ADR-010 rule 1 tag on *every* batch). Below
/// the floor a batch is mostly envelope, and the extra round trip buys nothing.
pub const MIN_BATCH_BYTES: usize = 32 * 1024;
/// Target size of the **first** batch.
pub const FIRST_TARGET_BATCH_BYTES: usize = 64 * 1024;
/// Multiplier applied per batch until `TARGET_BATCH_BYTES` is reached.
pub const BATCH_GROWTH_FACTOR: usize = 4;
pub const MAX_ROWS_PER_BATCH: usize = 65_536;
/// Batches the producer may hold ahead of the consumer. Producer-resident payload is bounded by
/// `(MAX_QUEUED_BATCHES + 1) * MAX_BATCH_BYTES`, plus DuckDB's own streaming buffer, which this
/// counter does not see and does not claim to.
pub const MAX_QUEUED_BATCHES: usize = 2;

/// **Publish partition ceilings — declared, not discovered (ADR-010 rule 6).**
///
/// A published partition is **exactly one `TaggedBatch`**. That is the whole design and it is worth
/// stating as a decision rather than as an implementation detail: re-batching in the publisher —
/// concatenating IPC streams, or calling `RecordBatch::try_new` there — would produce partition
/// bytes that never passed through `TaggedBatch`'s single constructor, and the ADR-010 rule 1
/// envelope would then be on the partition by *care* rather than by construction.
///
/// The size ceiling is also what bounds cancellation. Between-partition polling alone says nothing
/// about how long one partition takes to encode and write; with these ceilings, **the
/// uninterruptible window is one partition's encode and write**, and that sentence is the bound.
///
/// Progressive sizing is deliberately **not** used here: it exists for `docs/08`'s first-pixels
/// budget, nobody is waiting for a first pixel during a publish, and a fixed rule makes the
/// determinism argument short enough to audit.
pub const PUBLISH_PARTITION_TARGET_BYTES: usize = 1024 * 1024;
/// Rows per published partition, whichever ceiling binds first.
pub const PUBLISH_PARTITION_ROWS: usize = 8_192;
/// Partitions one bundle may contain. The zero-padded width of `data/part-NNNNN.arrows` is derived
/// from this, so raising it is a **format change** and not a tuning knob.
pub const MAX_PUBLISH_PARTITIONS: usize = 100_000;

// A partition must fit inside the batch ceiling, or the publish policy would be quietly asking for
// batches the producer refuses to build.
const _: () = assert!(PUBLISH_PARTITION_TARGET_BYTES < MAX_BATCH_BYTES);
const _: () = assert!(PUBLISH_PARTITION_ROWS <= MAX_ROWS_PER_BATCH);
const _: () = assert!(MIN_BATCH_BYTES <= PUBLISH_PARTITION_TARGET_BYTES);
// Five digits of zero padding, contiguous from 0. Asserted so the naming scheme and the ceiling
// cannot drift apart silently.
const _: () = assert!(MAX_PUBLISH_PARTITIONS == 100_000);

// Relationships between the declared ceilings, checked **at compile time**. As runtime assertions
// these were constant-folded and could not fail — a check that cannot fail is not a check. Here an
// edit that breaks the relationship stops the build instead.
const _: () = assert!(TARGET_BATCH_BYTES < MAX_BATCH_BYTES);
// **The progressive policy's bounds hold structurally, for every state it can be in.** Not by
// test: a test covers the states someone thought of, and ADR-010 rule 6 asks that a ceiling stay a
// ceiling. `target_for` is `min(first * factor^n, TARGET)`, so these four facts are jointly enough
// to guarantee `MIN <= FIRST <= target_n <= TARGET < MAX` for all n.
const _: () = assert!(MIN_BATCH_BYTES <= FIRST_TARGET_BATCH_BYTES);
const _: () = assert!(FIRST_TARGET_BATCH_BYTES <= TARGET_BATCH_BYTES);
const _: () = assert!(BATCH_GROWTH_FACTOR >= 1);
const _: () = assert!(MIN_BATCH_BYTES > 0);
const _: () = assert!(MAX_QUEUED_BATCHES >= 1);

/// A viewport in the dataset's own CRS. There is no reprojection in this slice, so a bbox in any
/// other CRS is the caller's error and cannot be detected here — which is why `ViewportQuery`
/// carries the CRS identifier it was written against and the engine refuses a mismatch.
#[derive(Clone, Copy, Debug)]
pub struct Bbox {
    pub xmin: f64,
    pub ymin: f64,
    pub xmax: f64,
    pub ymax: f64,
}

#[derive(Clone, Debug)]
pub struct ViewportQuery {
    /// `None` streams the whole file.
    pub bbox: Option<Bbox>,
    /// The CRS the bbox is expressed in, as an identifier. Checked against the dataset's own.
    pub bbox_crs: Option<String>,
    pub limit: Option<u64>,
}

impl ViewportQuery {
    pub fn all() -> Self {
        Self { bbox: None, bbox_crs: None, limit: None }
    }

    pub fn viewport(bbox: Bbox, crs_identifier: impl Into<String>) -> Self {
        Self { bbox: Some(bbox), bbox_crs: Some(crs_identifier.into()), limit: None }
    }

    pub fn with_limit(mut self, n: u64) -> Self {
        self.limit = Some(n);
        self
    }
}

#[derive(Debug, Clone, Copy)]
pub struct BatchInfo {
    pub rows: usize,
    pub vertices: usize,
    pub payload_bytes: usize,
    /// 0-based position in the stream, and the target this batch was cut at. Two integers, so a
    /// consumer or a measurement can attribute a batch's size to the policy without parsing one.
    pub batch_index: u64,
    pub target_bytes: usize,
    /// `[xmin, ymin, xmax, ymax]` over this batch's own vertices, in the dataset's CRS.
    ///
    /// **`None` means "not computed", never "empty".** It is computed only on the publish path,
    /// which asks for it because a bundle's `bounds` must describe the rows the bundle actually
    /// contains. The viewport path does not ask, so it does not pay: this is one extra pass over the
    /// coordinate buffer, and adding unmeasured work to the path `docs/08`'s first-pixels budget is
    /// measured on is not something to do for a consumer that has no use for the answer.
    ///
    /// Authoritative f64 throughout — no origin, no narrowing. A render origin is renderer-local
    /// state (ADR-010 rule 1) and nothing derived from one appears here.
    pub xy_bounds: Option<[f64; 4]>,
}

/// The batch-size policy in force for a stream, and the whole of it.
///
/// **Declared once per stream, not per batch.** Putting a varying value in the batch *schema*
/// metadata would make the envelope batch-dependent and hollow out the assertion that every batch
/// carries the same envelope — so the policy is reported here and the per-batch numbers ride on
/// `BatchInfo` as two integers, never as a policy string. (This is a `docs/01` principle 8
/// visibility obligation; ADR-010 rule 1 is about coordinate space and is deliberately not cited.)
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct BatchSizePolicy {
    pub first_target_bytes: usize,
    pub growth_factor: usize,
    pub target_bytes: usize,
    pub min_bytes: usize,
    /// Row ceiling per batch. Part of the policy rather than a global constant because the publish
    /// policy declares a lower one, and a ceiling that lives in two places is a ceiling that can
    /// disagree with itself.
    pub max_rows: usize,
}

impl Default for BatchSizePolicy {
    fn default() -> Self {
        Self {
            first_target_bytes: FIRST_TARGET_BATCH_BYTES,
            growth_factor: BATCH_GROWTH_FACTOR,
            target_bytes: TARGET_BATCH_BYTES,
            min_bytes: MIN_BATCH_BYTES,
            max_rows: MAX_ROWS_PER_BATCH,
        }
    }
}

impl BatchSizePolicy {
    /// The publish policy: **fixed**, so every partition boundary is a pure function of the row
    /// sequence and the declared ceilings. `growth_factor` is 1 and first equals target, which is
    /// what makes "one partition is one batch" hold for every partition rather than for all but the
    /// first few.
    pub fn publish() -> Self {
        Self {
            first_target_bytes: PUBLISH_PARTITION_TARGET_BYTES,
            growth_factor: 1,
            target_bytes: PUBLISH_PARTITION_TARGET_BYTES,
            min_bytes: MIN_BATCH_BYTES,
            max_rows: PUBLISH_PARTITION_ROWS,
        }
    }
}

impl BatchSizePolicy {
    /// Target size for the batch at `index` (0-based).
    ///
    /// Monotone non-decreasing and clamped to `target_bytes` **by construction** — saturating
    /// arithmetic, so no growth factor and no index can carry it past the ceiling or wrap.
    pub fn target_for(&self, index: u64) -> usize {
        let mut t = self.first_target_bytes;
        for _ in 0..index {
            if t >= self.target_bytes {
                return self.target_bytes;
            }
            t = t.saturating_mul(self.growth_factor);
        }
        t.min(self.target_bytes).max(self.min_bytes)
    }
}

/// How the viewport predicate was built for one stream — reported, never inferred from timings.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FilterPlan {
    /// No viewport: the whole file.
    WholeFile,
    /// An admissible index supplied candidate ids, narrowing the scan.
    IndexNarrowed { ranges: usize, candidates: usize },
    /// No admissible index; the covering-bbox scan alone.
    ScanOnly,
    /// An index existed and produced too many disjoint ranges to express, so the scan ran instead.
    /// Distinct from `ScanOnly` because "there was no index" and "the index could not help" are
    /// different facts, and a reader deserves to know which one a timing describes.
    IndexTooFragmented { candidates: usize },
}

/// Whether a plan may consult the spatial index.
///
/// **Not a `bool` and not an `Option`, deliberately.** The product answer is one variant of a named
/// type, so a reader of a call site sees which policy is in force without knowing which way round
/// the flag goes, and adding a third policy later is a compile error at every site rather than a
/// silent reinterpretation.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub(crate) enum IndexUse {
    /// The product planner. The index seam is not consulted at all.
    Off,
    /// The experimental seam, reached only through `Dataset::stream_indexed_experimental`.
    Experimental,
}

/// Whether a stream's rows arrive in a declared order.
///
/// **Two paths, two reasons, and they do not compromise with each other.**
///
/// The viewport path is `Unordered` and the comment on `build_sql` says why: an `ORDER BY` would
/// materialize the whole result before the first batch and turn a streaming query into a batch one,
/// which is a `docs/08` first-pixels argument.
///
/// The publish path is `ByIdentityAscending`, because a bundle's determinism guarantee — two
/// publishes of the same inputs producing byte-identical partitions and hashes — cannot rest on
/// DuckDB's freedom to reach row groups in whatever order it likes. Publishing has **no
/// first-pixels budget**: nobody is watching a canvas, so the argument that governs the other path
/// does not reach this one.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum RowOrdering {
    Unordered,
    /// `ORDER BY` the identity's **source column**, ascending.
    ByIdentityAscending,
}

/// Everything one stream's plan fixes before the producer starts.
pub(crate) struct StreamPlan {
    pub(crate) index_use: IndexUse,
    pub(crate) ordering: RowOrdering,
    pub(crate) policy: BatchSizePolicy,
    /// The envelope this stream's batches carry — the dataset's own, or a widened one bearing a
    /// declared attribute projection.
    pub(crate) envelope: BatchEnvelope,
    /// Whether each batch reports its own extent. See [`BatchInfo::xy_bounds`].
    pub(crate) report_bounds: bool,
}

/// Facts about the DuckDB connection one stream is running on.
///
/// **Instrument surface, on the engine's Rust API only.** These are never SKP fields, never on the
/// wire, and never in any type belonging to a binding — the crate that carries batches knows
/// nothing about what a batch contains, and a storage-engine detail crossing it would be exactly
/// the leakage the boundary tests gate. Authority for keeping them off the wire is ADR-004 and
/// `docs/10` (the semantic API surface), not ADR-010 rule 1, which is about coordinate space.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub struct ConnectionFacts {
    /// Which physical connection — a monotonic per-dataset counter, never an address.
    pub physical_id: u64,
    /// Which use of that connection this stream is. `1` is a connection created for this stream.
    pub lease_generation: u64,
    /// Whether this query received a connection that already existed and was already configured.
    pub reused_an_existing_connection: bool,
}

/// How many times a batch's attribute column has been assembled from **more than one** chunk run.
///
/// **An instrument fact, unconditional, and deliberately not behind `cfg(test)`** — the same pattern
/// and the same reasoning as `dataset::INDEX_CONSULTATIONS`. The property a test needs is that the
/// *shipped* producer took the concatenation path, and a counter compiled only into a test build
/// would prove that about a build nobody runs.
///
/// It exists because the alternative is inferring the path from partition row counts, and that
/// inference is wrong: a published partition is ~2 000 rows and a DuckDB chunk is ~2 048, so a
/// partition never *exceeds* a chunk while most of them *cross* one. A test that looked for a
/// partition larger than a chunk would conclude the path was untaken while it was running every
/// time. One relaxed atomic makes the claim checkable instead (`docs/01` principle 8).
static ATTRIBUTE_CONCATENATIONS: AtomicU64 = AtomicU64::new(0);

/// Times any stream in this process has concatenated a multi-chunk attribute run.
///
/// Never an SKP field and never on the wire.
pub fn attribute_concatenations() -> u64 {
    ATTRIBUTE_CONCATENATIONS.load(Ordering::SeqCst)
}

/// Counters the producer keeps about itself. H2 and H3 rest on these rather than on OS readings.
#[derive(Default)]
pub struct StreamStats {
    pub batches_generated: AtomicU64,
    pub batches_after_cancel: AtomicU64,
    pub rows_generated: AtomicU64,
    pub resident_bytes: AtomicUsize,
    pub peak_resident_bytes: AtomicUsize,
}

impl StreamStats {
    fn add_resident(&self, n: usize) {
        let now = self.resident_bytes.fetch_add(n, Ordering::SeqCst) + n;
        self.peak_resident_bytes.fetch_max(now, Ordering::SeqCst);
    }
    fn sub_resident(&self, n: usize) {
        self.resident_bytes.fetch_sub(n, Ordering::SeqCst);
    }
}

struct Item {
    batch: TaggedBatch,
    est_bytes: usize,
    vertices: usize,
    batch_index: u64,
    target_bytes: usize,
    xy_bounds: Option<[f64; 4]>,
}

pub struct BatchStream {
    rx: Receiver<std::result::Result<Item, EngineError>>,
    cancel: CancelToken,
    stats: Arc<StreamStats>,
    finished: bool,
    envelope: BatchEnvelope,
    filter_plan: FilterPlan,
    policy: BatchSizePolicy,
    connection: ConnectionFacts,
}

impl BatchStream {
    /// Serialize the next batch into `out`, appending to whatever it already holds.
    ///
    /// Blocks until a batch is available — the call *is* the demand signal. `None` means the stream
    /// ended; a terminal error is delivered once, as `Some(Err(_))`, and the stream then ends.
    pub fn next_into(&mut self, out: &mut Vec<u8>) -> Option<Result<BatchInfo>> {
        if self.finished {
            return None;
        }
        match self.rx.recv() {
            Ok(Ok(item)) => {
                self.stats.sub_resident(item.est_bytes);
                let before = out.len();
                if let Err(e) = item.batch.write_ipc_into(out) {
                    self.finished = true;
                    return Some(Err(e));
                }
                Some(Ok(BatchInfo {
                    rows: item.batch.num_rows(),
                    vertices: item.vertices,
                    payload_bytes: out.len() - before,
                    batch_index: item.batch_index,
                    target_bytes: item.target_bytes,
                    xy_bounds: item.xy_bounds,
                }))
            }
            Ok(Err(e)) => {
                self.finished = true;
                Some(Err(e))
            }
            Err(_) => {
                self.finished = true;
                None
            }
        }
    }

    pub fn cancel_token(&self) -> CancelToken {
        self.cancel.clone()
    }

    pub fn stats(&self) -> Arc<StreamStats> {
        Arc::clone(&self.stats)
    }

    pub fn envelope(&self) -> &BatchEnvelope {
        &self.envelope
    }

    /// How this stream's viewport predicate was built.
    ///
    /// Reported rather than inferred: "the index narrowed this" and "there was no index" and "the
    /// index could not help" produce similar timings and are different facts, and a measurement
    /// that cannot tell them apart cannot attribute what it measured.
    pub fn filter_plan(&self) -> FilterPlan {
        self.filter_plan
    }

    /// The batch-size policy in force, declared once for the stream rather than per batch.
    pub fn size_policy(&self) -> BatchSizePolicy {
        self.policy
    }

    /// Which physical connection this stream leased, and whether it already existed.
    ///
    /// Reported rather than inferred, for the same reason `filter_plan` is: "this query reused a
    /// configured connection" and "this query created one" produce similar timings and are
    /// different facts. A measurement that cannot tell them apart cannot say which mode it ran in.
    pub fn connection_facts(&self) -> ConnectionFacts {
        self.connection
    }
}

impl Drop for BatchStream {
    /// Dropping the stream cancels it. Without this, abandoning a stream would leave DuckDB
    /// scanning a file nobody is reading — the "kernel keeps computing cancelled work" failure
    /// ADR-004 amendment 2 disqualified a transport over.
    fn drop(&mut self) {
        self.cancel.cancel();
    }
}

impl Dataset {
    /// Start one streaming query. Returns as soon as the statement is prepared; the first batch is
    /// produced on the first `next_into` call.
    pub fn stream(&self, q: &ViewportQuery) -> Result<BatchStream> {
        self.stream_with_cancel(q, CancelToken::new())
    }

    /// As `stream`, with a caller-held token — the shape a binding needs, because the thing that
    /// observes a cancellation is not the thing that started the stream.
    pub fn stream_with_cancel(&self, q: &ViewportQuery, cancel: CancelToken) -> Result<BatchStream> {
        self.stream_inner(
            q,
            cancel,
            StreamPlan {
                index_use: IndexUse::Off,
                ordering: RowOrdering::Unordered,
                policy: BatchSizePolicy::default(),
                envelope: self.envelope().clone(),
                report_bounds: false,
            },
        )
    }

    /// The **publish** stream: a declared attribute projection, a declared row order, and fixed
    /// partition ceilings.
    ///
    /// Deliberately its own entry point rather than a flag on `stream`. A reader of a call site can
    /// see which discipline is in force without knowing which way round a boolean goes, and the
    /// viewport path cannot acquire an `ORDER BY` by accident — which matters, because the ordering
    /// costs exactly what `build_sql`'s comment says it costs.
    ///
    /// **What this does not bound.** Ordering makes DuckDB sort before the first row arrives, and
    /// that sort's memory is DuckDB's own — outside `MAX_QUEUED_BATCHES` and outside every ceiling
    /// this module declares, exactly as the engine's streaming buffer already is. The silence before
    /// the first batch is likewise DuckDB's; the caller is what reports progress across it.
    pub fn stream_for_publish(
        &self,
        q: &ViewportQuery,
        attributes: &crate::attributes::PublishedProjection,
        cancel: CancelToken,
    ) -> Result<BatchStream> {
        let envelope = BatchEnvelope::with_attributes(
            self.crs().clone(),
            self.geometry_column().to_string(),
            self.identity().clone(),
            attributes.fields().to_vec(),
        );
        self.stream_inner(
            q,
            cancel,
            StreamPlan {
                index_use: IndexUse::Off,
                ordering: RowOrdering::ByIdentityAscending,
                policy: BatchSizePolicy::publish(),
                envelope,
                report_bounds: true,
            },
        )
    }

    /// Resolve a caller's projection to the fields the stream will actually emit.
    ///
    /// Types come from the dataset's own schema, which is DuckDB's arrow schema for this file, so
    /// the declared fields cannot disagree with the arrays the producer hands over. Nullability is
    /// **not** taken from the source — see `attributes::admit_projection`.
    pub fn resolve_projection(
        &self,
        names: &[String],
    ) -> Result<crate::attributes::PublishedProjection> {
        let mut resolved = Vec::with_capacity(names.len());
        for name in names {
            let f = self
                .file_schema()
                .fields()
                .iter()
                .find(|f| f.name() == name)
                .ok_or_else(|| EngineError::AttributeUnpublishable {
                    column: name.clone(),
                    detail: format!(
                        "the file has no such column (it has: {})",
                        self.file_schema()
                            .fields()
                            .iter()
                            .map(|f| f.name().as_str())
                            .collect::<Vec<_>>()
                            .join(", ")
                    ),
                })?;
            resolved.push(f.as_ref().clone());
        }
        crate::attributes::admit_projection(
            &resolved,
            self.geometry_column(),
            self.identity().source().source_column(),
        )
    }

    /// The same query, planned **with the fixed-grid index in the path**.
    ///
    /// **Experimental and measurement-only. No product path calls this**, and it is not what
    /// `slice-host` or `kernel/` reach for. It exists so the index's correctness properties stay
    /// asserted by the ordinary test suite — `an_indexed_query_returns_exactly_what_the_scan_
    /// returns` is the property that matters most about the index, and deleting the only way to
    /// reach the index would delete the test with it.
    ///
    /// Why it is not the default is measured, not assumed: see the planner comment on `build_sql`.
    #[doc(hidden)]
    pub fn stream_indexed_experimental(
        &self,
        q: &ViewportQuery,
        cancel: CancelToken,
    ) -> Result<BatchStream> {
        self.stream_inner(
            q,
            cancel,
            StreamPlan {
                index_use: IndexUse::Experimental,
                ordering: RowOrdering::Unordered,
                policy: BatchSizePolicy::default(),
                envelope: self.envelope().clone(),
                report_bounds: false,
            },
        )
    }

    fn stream_inner(
        &self,
        q: &ViewportQuery,
        cancel: CancelToken,
        plan: StreamPlan,
    ) -> Result<BatchStream> {
        let StreamPlan { index_use, ordering, policy, envelope, report_bounds } = plan;
        // **A viewport CRS is a caller assertion about the query, not an equivalence judgement
        // about two definitions.** ADR-015 §7. The engine does not decide that the caller's CRS
        // and the dataset's "agree" — it has no PROJ and cannot — it only refuses a viewport that
        // names something other than what the dataset declares. Identifier equality is admitted as
        // the caller's own claim that the viewport was authored against this dataset's CRS, and it
        // is recorded as a claim rather than treated as a fact.
        //
        // The distinction matters because `docs/05` forbids deciding CRS *identity* by name-string
        // comparison, and ADR-015 §4 refuses that judgement on the source path even when the two
        // strings are identical. Calling this an assertion is what keeps the two paths consistent
        // instead of applying opposite rules to the same question.
        if let (Some(_), Some(bbox_crs)) = (q.bbox.as_ref(), q.bbox_crs.as_ref()) {
            let dataset_crs = self.crs().identifier();
            // A definition-only CRS has no authority and code, so `identifier()` is a placeholder
            // that names nothing and is shared by every such dataset. A caller echoing it asserts
            // nothing, and admitting it would be a name comparison over a non-name.
            if dataset_crs == crate::crs::DEFINITION_ONLY {
                return Err(EngineError::ViewportCrsUnidentifiable);
            }
            if bbox_crs != dataset_crs {
                // No reprojection exists in this slice, so a viewport in another CRS cannot be
                // honoured. docs/05: mixing CRS without a declared transform is an error.
                return Err(EngineError::ViewportCrsMismatch {
                    dataset: dataset_crs.to_string(),
                    viewport: bbox_crs.clone(),
                });
            }
        }

        let (sql, filter_plan) = self.build_sql(q, index_use, envelope.attributes(), ordering)?;
        let path = self
            .path()
            .to_str()
            .ok_or_else(|| EngineError::Source("path is not valid UTF-8".into()))?
            .to_string();

        let lease = lease_for_stream(self, &cancel)?;
        let connection = ConnectionFacts {
            physical_id: lease.physical_id(),
            lease_generation: lease.generation(),
            reused_an_existing_connection: lease.reused_an_existing_connection(),
        };
        let geometry_column = self.geometry_column().to_string();
        let stats = Arc::new(StreamStats::default());
        let (tx, rx) = sync_channel::<std::result::Result<Item, EngineError>>(MAX_QUEUED_BATCHES);

        let bbox = q.bbox;
        let limit = q.limit;
        let thread_stats = Arc::clone(&stats);
        let thread_cancel = cancel.clone();
        let thread_env = envelope.clone();

        std::thread::Builder::new()
            .name("engine-geoparquet-stream".into())
            .spawn(move || {
                let outcome = produce(
                    lease.connection(),
                    &sql,
                    &path,
                    bbox,
                    limit,
                    &geometry_column,
                    &thread_env,
                    &thread_cancel,
                    &thread_stats,
                    &tx,
                    policy,
                    report_bounds,
                );
                // **Detach before the lease is decided**, so a `cancel()` arriving after this
                // stream is over cannot reach a connection that has been handed back — the reason
                // `CancelToken::detach` exists. Cancellation belongs to the *active lease*, never
                // permanently to the connection or the dataset.
                thread_cancel.detach();

                // **The producer decides its own connection's fate, and it is the only thing that
                // can.** `BatchStream`'s `Drop` cancels the token on *every* drop, including a
                // stream that completed and was then let go — so the token's flag, read from the
                // consumer side, cannot tell "cancelled" from "finished". This thread knows which
                // one happened because it holds the result.
                //
                // Any error, cancellation included, discards: a cancelled query interrupted DuckDB
                // on this connection, and this engine has established no post-interrupt health
                // guarantee, so discard-and-replace is the declared bounded behaviour rather than
                // an optimisation. A completed query returns its connection, verified first.
                match outcome {
                    Ok(()) => lease.release_healthy(),
                    Err(e) => {
                        drop(lease);
                        // Best-effort: if the consumer is gone there is nobody to tell, which is
                        // not an error in itself. H7's "no partial view presented as complete" is
                        // enforced on the consumer side by the terminal frame, not by this send
                        // succeeding.
                        let _ = tx.send(Err(e));
                    }
                }
            })
            .map_err(|e| {
                // **Unbind the token, or it is permanently unusable.** `lease_for_stream` attached
                // this connection's interrupt handle, and `attach` refuses a second binding rather
                // than disarming the first — so a caller who retried with the same token would be
                // refused forever, and `is_bound()` would report true for a connection that no
                // longer exists. The lease itself is inside the closure being dropped here, so its
                // capacity is already freed.
                cancel.detach();
                EngineError::Source(format!("spawn producer thread: {e}"))
            })?;

        Ok(BatchStream {
            rx,
            cancel,
            stats,
            finished: false,
            envelope,
            filter_plan,
            policy,
            connection,
        })
    }

    fn build_sql(
        &self,
        q: &ViewportQuery,
        index_use: IndexUse,
        attributes: &[arrow::datatypes::Field],
        ordering: RowOrdering,
    ) -> Result<(String, FilterPlan)> {
        let mut plan = FilterPlan::WholeFile;
        let geom = quote_ident(self.geometry_column());
        // **The identity's source column, aliased to the engine's identity name** (ADR-016 §3).
        // A declared mapping changes which column is read and nothing else: everything downstream
        // — the envelope's non-nullable `id` field, the null and negative checks, ADR-010 rule 2's
        // indirection — is identical for a native and a mapped identity, which is what makes the
        // mapping a redirection rather than a second code path with its own bugs.
        let source_column = quote_ident(self.identity().source().source_column());
        let id = quote_ident(ID_COLUMN);
        let mut projection = format!("{source_column} AS {id}, {geom}");
        for f in attributes {
            projection.push_str(", ");
            projection.push_str(&quote_ident(f.name()));
        }
        let mut sql = format!("SELECT {projection} FROM read_parquet(?)");

        // **`ORDER BY` names the *source* column, never the `id` alias — and the reason is not the
        // one the range predicates below give.**
        //
        // It is tempting to carry the `WHERE` hazard across to `ORDER BY` by analogy. **Measured,
        // it does not carry**, and the two clauses resolve a bare name in opposite directions.
        // Against a table holding `id` and `parcel_key`, projected as `"parcel_key" AS "id"`
        // (pinned by `duckdb_resolves_order_by_and_where_in_opposite_directions`):
        //
        // | clause | bare `"id"` binds to | |
        // |---|---|---|
        // | `ORDER BY "id"` | the **select alias** | so it happens to be right |
        // | `WHERE "id" >= …` | the **base column** | so it is wrong, which is the paragraph below |
        //
        // So naming the source column here is not a bug fix; it is **independence from which rule
        // applies**. It is correct under either resolution, it reads the same as the predicate
        // twenty lines down, and it means a reader does not have to know that one SQL clause
        // resolves aliases and its neighbour does not. Every partition boundary, every partition
        // hash and the whole determinism guarantee sit on this clause, which is reason enough not
        // to spend them on a resolution rule that has to be looked up.
        let order_clause = match ordering {
            RowOrdering::Unordered => String::new(),
            RowOrdering::ByIdentityAscending => format!(" ORDER BY {source_column} ASC"),
        };

        if let Some(view) = q.bbox.as_ref() {
            let c = self.covering().ok_or_else(|| EngineError::NoCoveringBbox {
                detail: "the file's `geo` metadata declares no covering.bbox".into(),
            })?;

            // ---------------------------------------------------------------------------------
            // **The product planner is `ScanOnly`, and the index is not consulted. This is the
            // measured decision, not a preference.**
            //
            // `kernel/RESULTS.md`, second section, "The finding this pass exists to report: the
            // index made every filtered query slower": with the index in the path the quarter
            // extent's time to *first batch* was 35.6 % slower and its total 21.7 % slower, and the
            // 1/64 extent 17.5 % and 15.5 % slower — same session, same binary, same file, against
            // an unindexed baseline re-measured beside it.
            //
            // **The mechanism, because a number without one is a tuning excuse:** candidate-ID
            // ranges add work while DuckDB still scans the GeoParquet bbox columns. The index
            // answers `covering-bbox-intersects`, which is exactly the predicate the scan already
            // computes, and the bbox comparison is deliberately kept alongside the ranges so the
            // result set stays provably identical — so the ranges cannot exclude a single row the
            // bbox test would have kept. They are pure added work per row on top of a scan that
            // still runs in full. **Until an index prunes actual IO, `ScanOnly` is the preferred
            // product plan.**
            //
            // Nothing here says the index is wrong. It is not:
            // `an_indexed_query_returns_exactly_what_the_scan_returns` holds, and the measured
            // payload totals were byte-identical at every point. It says this index does not pay
            // for itself on this shape, and that first-batch time — which is what the first-pixels
            // budget depends on — is not what it improves. An index that prunes IO is a separate,
            // architect-first design with its own preregistered gate; no claim is made for it here.
            // ---------------------------------------------------------------------------------
            //
            // **The index narrows; it never decides.** When the experimental seam admits an index,
            // its candidate ids are added as a range predicate *alongside* the bbox comparison
            // rather than instead of it. Two reasons, both about not trusting derived state further
            // than it has been shown to be right: keeping both makes the result set provably
            // identical to the unindexed one; and a wrong index then costs time, not correctness.
            // Removing the predicate would make the index the system of record, which ADR-006 says
            // a pure transformation's cached output is not.
            // `None` from `candidates` means the index cannot narrow *this* query — a degenerate
            // grid, a bbox it will not reason about. Falling through to the scan is the only safe
            // reading: a derived structure that cannot answer must not answer.
            let admitted = match index_use {
                IndexUse::Off => None,
                IndexUse::Experimental => self.admitted_index(),
            };
            if let Some(candidates) = admitted.and_then(|idx| idx.candidates(view)) {
                match crate::index::compress_to_ranges(&candidates, crate::index::MAX_ID_RANGES) {
                    // **An empty candidate set falls through to the scan; it does not decide.**
                    // Encoding it as `WHERE 1=0` made the index the system of record, which ADR-006
                    // says a pure transformation's cached output is not — and when a degenerate
                    // grid produced an empty set, every viewport query returned zero rows while the
                    // unindexed query returned the right ones.
                    Some(ranges) if ranges.is_empty() => {
                        plan = FilterPlan::ScanOnly;
                    }
                    Some(ranges) => {
                        // **Range predicates name the *source* column, never the alias.**
                        //
                        // DuckDB resolves a WHERE reference to a base column when one of that name
                        // exists, not to the select alias. With a declared mapping the projection
                        // is `"parcel_key" AS "id"`, so filtering on `"id"` bound the file's own
                        // `id` column instead — measured returning the empty set on a file carrying
                        // both, and a wrong-but-plausible set whenever the ranges happened to
                        // overlap. Filtering on the column the ids actually came from removes the
                        // ambiguity rather than working around it.
                        let id = source_column.clone();
                        let preds: Vec<String> = ranges
                            .iter()
                            .map(|(lo, hi)| {
                                if lo == hi {
                                    format!("{id} = {lo}")
                                } else {
                                    format!("{id} BETWEEN {lo} AND {hi}")
                                }
                            })
                            .collect();
                        plan = FilterPlan::IndexNarrowed {
                            ranges: ranges.len(),
                            candidates: candidates.len(),
                        };
                        sql.push_str(&format!(" WHERE ({})", preds.join(" OR ")));
                        sql.push_str(&format!(
                            " AND {xmin} <= ? AND {xmax} >= ? AND {ymin} <= ? AND {ymax} >= ?",
                            xmin = c.xmin.to_sql(),
                            xmax = c.xmax.to_sql(),
                            ymin = c.ymin.to_sql(),
                            ymax = c.ymax.to_sql(),
                        ));
                        sql.push_str(&order_clause);
                        if let Some(n) = q.limit {
                            sql.push_str(&format!(" LIMIT {n}"));
                        }
                        return Ok((sql, plan));
                    }
                    // Too many disjoint ranges to express. Falling back is correct — and it is
                    // *recorded*, because an index that silently stopped being used would surface
                    // only as a performance mystery (principle 8: signalled, never absorbed).
                    None => plan = FilterPlan::IndexTooFragmented { candidates: candidates.len() },
                }
            }
            if plan == FilterPlan::WholeFile {
                plan = FilterPlan::ScanOnly;
            }
            // Intersection, not containment: a feature whose bbox overlaps the viewport is in.
            sql.push_str(&format!(
                " WHERE {xmin} <= ? AND {xmax} >= ? AND {ymin} <= ? AND {ymax} >= ?",
                xmin = c.xmin.to_sql(),
                xmax = c.xmax.to_sql(),
                ymin = c.ymin.to_sql(),
                ymax = c.ymax.to_sql(),
            ));
        }
        // **`RowOrdering::Unordered` emits nothing here, and that is the viewport path's whole
        // point:** ordering would materialize the entire result before the first batch and turn a
        // streaming query into a batch one, which is what `docs/08`'s first-pixels budget is
        // measured against. The publish path pays that cost deliberately and has no such budget.
        sql.push_str(&order_clause);
        if let Some(n) = q.limit {
            sql.push_str(&format!(" LIMIT {n}"));
        }
        Ok((sql, plan))
    }
}

fn quote_ident(name: &str) -> String {
    format!("\"{}\"", name.replace('"', "\"\""))
}

#[allow(clippy::too_many_arguments)]
fn produce(
    conn: &duckdb::Connection,
    sql: &str,
    path: &str,
    bbox: Option<Bbox>,
    _limit: Option<u64>,
    geometry_column: &str,
    envelope: &BatchEnvelope,
    cancel: &CancelToken,
    stats: &Arc<StreamStats>,
    tx: &std::sync::mpsc::SyncSender<std::result::Result<Item, EngineError>>,
    policy: BatchSizePolicy,
    report_bounds: bool,
) -> Result<()> {
    // Checked before anything is prepared or executed: DuckDB does not latch an interrupt raised on
    // an idle connection (see `cancel.rs`), so a stream cancelled before it started is stopped
    // here or not at all.
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }

    let mut stmt = conn
        .prepare(sql)
        .map_err(|e| classify(cancel, format!("prepare: {e}")))?;

    let mut params: Vec<&dyn ToSql> = vec![&path];
    let (xmax, xmin, ymax, ymin);
    if let Some(b) = bbox.as_ref() {
        // Bbox intersection: feature.xmin <= view.xmax AND feature.xmax >= view.xmin, etc.
        xmax = b.xmax;
        xmin = b.xmin;
        ymax = b.ymax;
        ymin = b.ymin;
        params.push(&xmax);
        params.push(&xmin);
        params.push(&ymax);
        params.push(&ymin);
    }

    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }

    let mut arrow = stmt
        .stream_arrow(params.as_slice())
        .map_err(|e| classify(cancel, format!("execute: {e}")))?;

    let attribute_fields = envelope.attributes().to_vec();
    let mut pending = Pending::new(attribute_fields.len());
    // Batches handed over so far — the policy's input, and the `batch_index` a consumer sees.
    let mut emitted: u64 = 0;

    loop {
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }

        // The iterator panics rather than returning an error when a fetch fails — including when
        // the fetch was interrupted by our own cancel. Catching it turns "the process dies on
        // cancel" into a typed terminal outcome (ADR-010 rule 7: an async operation may not
        // terminate silently, and an application error must never present as a hardware hang).
        let next = catch_unwind(AssertUnwindSafe(|| arrow.next()));
        let chunk = match next {
            Ok(Some(c)) => c,
            Ok(None) => break,
            Err(payload) => {
                // Keep what the panic actually said. ADR-010 rule 7 asks for a *surfaced* error, and
                // "duckdb fetch failed" surfaces the phase without the reason.
                let detail = payload
                    .downcast_ref::<&str>()
                    .map(|s| (*s).to_string())
                    .or_else(|| payload.downcast_ref::<String>().cloned())
                    .unwrap_or_else(|| "no panic message".to_string());
                return Err(classify(cancel, format!("duckdb fetch panicked: {detail}")));
            }
        };

        let ids = column_u64(&chunk, ID_COLUMN)?;
        let geoms = chunk
            .column_by_name(geometry_column)
            .ok_or_else(|| EngineError::Query(format!("result has no `{geometry_column}` column")))?
            .clone();

        // The declared projection's arrays for this chunk, in declared order, with the type the
        // envelope promises checked against what actually arrived. A mismatch here would otherwise
        // surface as an Arrow string when the batch is assembled, several frames from the column
        // that caused it.
        let chunk_attrs: Vec<ArrayRef> = attribute_fields
            .iter()
            .map(|f| {
                let col = chunk.column_by_name(f.name()).ok_or_else(|| {
                    EngineError::Query(format!("result has no `{}` column", f.name()))
                })?;
                if col.data_type() != f.data_type() {
                    return Err(EngineError::EncodingMismatch {
                        claimed: format!("attribute `{}` is {}", f.name(), f.data_type()),
                        found: col.data_type().to_string(),
                    });
                }
                Ok(col.clone())
            })
            .collect::<Result<_>>()?;

        // First row of this chunk that belongs to the batch currently being accumulated. Attribute
        // columns are carried as **slices of the chunk's own arrays**, one run per cut, rather than
        // as per-row copies: a run is one slice regardless of how many rows it covers, and ADR-004
        // asks for copies to be minimized rather than assumed absent.
        let mut run_start = 0usize;

        for (row, id) in ids.iter().enumerate().take(chunk.num_rows()) {
            if cancel.is_cancelled() {
                return Err(EngineError::Cancelled);
            }
            let wkb = binary_value(&geoms, row)?;

            // **Cut before appending, not after.**
            //
            // Appending first and cutting afterwards makes a batch's final size a function of its
            // *last* feature: one large geometry landing on an almost-full batch pushes the total
            // past `MAX_BATCH_BYTES`, and the whole stream dies on a ceiling that the payload as a
            // whole never approached. Real cadastral parcels and administrative boundaries reach
            // that size; `docs/08`'s Polygons class is 50–200 vertices per feature and never does,
            // which is why the tests did not catch it. ADR-010 rule 6 wants a ceiling that normal
            // payload cannot reach — cutting first is what makes that true.
            //
            // The incoming size is bounded without parsing the geometry: WKB spends 16 B on every
            // vertex plus a per-ring header, so `wkb.len() / 16` cannot under-count the vertices
            // this feature will contribute. An over-estimate only cuts a batch slightly early.
            // The attribute contribution is a pure function of this row's content — a fixed width,
            // or a string's own byte length — never of allocator state, so two publishes of the
            // same rows cut in the same places.
            let incoming = estimate_bytes(1, wkb.len() / 16) + attr_row_bytes(&chunk_attrs, row);
            // The target this batch is being cut at, from the progressive policy. Early batches
            // are small so pixels land sooner; later ones grow to `TARGET_BATCH_BYTES` so the
            // per-batch envelope stops being a significant share of the payload. The publish policy
            // is flat, so every publish partition is cut at the same target.
            let target = policy.target_for(emitted);
            if !pending.ids.is_empty() && pending.est_bytes + incoming > target {
                pending.push_attr_run(&chunk_attrs, run_start, row);
                run_start = row;
                flush(&mut pending, envelope, cancel, stats, tx, emitted, target, report_bounds)?;
                emitted += 1;
            }

            let before = pending.builder.vertices();
            pending.builder.push_wkb(wkb)?;
            pending.vertices += pending.builder.vertices() - before;
            pending.ids.push(*id);
            pending.attr_bytes += attr_row_bytes(&chunk_attrs, row);
            pending.est_bytes =
                estimate_bytes(pending.ids.len(), pending.builder.vertices()) + pending.attr_bytes;
            pending.first_id.get_or_insert(*id);

            if pending.est_bytes >= target || pending.ids.len() >= policy.max_rows {
                pending.push_attr_run(&chunk_attrs, run_start, row + 1);
                run_start = row + 1;
                flush(&mut pending, envelope, cancel, stats, tx, emitted, target, report_bounds)?;
                emitted += 1;
            }
        }
        // Whatever of this chunk is still accumulating carries over into the next batch.
        pending.push_attr_run(&chunk_attrs, run_start, chunk.num_rows());
    }

    if !pending.ids.is_empty() {
        let target = policy.target_for(emitted);
        flush(&mut pending, envelope, cancel, stats, tx, emitted, target, report_bounds)?;
    }
    Ok(())
}

/// Everything accumulated toward the next batch.
struct Pending {
    ids: Vec<u64>,
    builder: PolygonBuilder,
    vertices: usize,
    est_bytes: usize,
    /// The first id in this batch — carried so an over-ceiling single feature can be *named*. An
    /// error that says only "4 MiB exceeded" cannot be acted on in a file with millions of rows.
    first_id: Option<u64>,
    /// One run list per declared attribute column: the slices of successive DuckDB chunks that this
    /// batch's rows occupy, concatenated once at flush.
    attrs: Vec<Vec<ArrayRef>>,
    /// Attribute bytes accumulated, so the cut decision sees the whole row and not only its
    /// geometry.
    attr_bytes: usize,
}

impl Pending {
    fn new(attribute_columns: usize) -> Self {
        Self {
            ids: Vec::new(),
            builder: PolygonBuilder::new(),
            vertices: 0,
            est_bytes: 0,
            first_id: None,
            attrs: vec![Vec::new(); attribute_columns],
            attr_bytes: 0,
        }
    }

    /// Record that rows `start..end` of the current chunk belong to the batch being accumulated.
    fn push_attr_run(&mut self, chunk_attrs: &[ArrayRef], start: usize, end: usize) {
        if end <= start {
            return;
        }
        for (runs, col) in self.attrs.iter_mut().zip(chunk_attrs.iter()) {
            runs.push(col.slice(start, end - start));
        }
    }
}

fn estimate_bytes(rows: usize, vertices: usize) -> usize {
    // 16 B per interleaved xy pair, 8 B per id, 4 B per offset entry, both offset levels.
    vertices * 16 + rows * 8 + (rows + vertices) * 4
}

/// One row's attribute contribution, as a function of the row's content only.
///
/// Deliberately not `get_array_memory_size` or anything else that reports an allocation: a batch
/// boundary derived from how much capacity a buffer happens to have reserved would move between two
/// runs over identical data, and every partition hash in a bundle depends on where the boundaries
/// fall.
fn attr_row_bytes(chunk_attrs: &[ArrayRef], row: usize) -> usize {
    use arrow::array::{
        BooleanArray, Float64Array, Int16Array, Int32Array, Int64Array, Int8Array, LargeStringArray,
        StringArray, StringViewArray, UInt16Array, UInt32Array, UInt8Array,
    };
    let mut total = 0usize;
    for col in chunk_attrs {
        // One validity bit per value, plus the value itself. Rounded to a byte, which over-counts
        // slightly and can only cut a batch marginally early.
        total += 1;
        // **A null slot's contents are unspecified in Arrow, so they are never read.** Reading one
        // would make a partition boundary — and therefore every partition hash — a function of
        // whatever bytes happen to occupy the slot, which is precisely the non-determinism this
        // function's own contract rules out. A null costs its validity bit and nothing else.
        if col.is_null(row) {
            continue;
        }
        total += if let Some(a) = col.as_any().downcast_ref::<StringArray>() {
            a.value(row).len() + 4
        } else if let Some(a) = col.as_any().downcast_ref::<LargeStringArray>() {
            a.value(row).len() + 8
        } else if let Some(a) = col.as_any().downcast_ref::<StringViewArray>() {
            a.value(row).len() + 16
        } else if col.as_any().downcast_ref::<BooleanArray>().is_some() {
            1
        } else if col.as_any().downcast_ref::<Int8Array>().is_some()
            || col.as_any().downcast_ref::<UInt8Array>().is_some()
        {
            1
        } else if col.as_any().downcast_ref::<Int16Array>().is_some()
            || col.as_any().downcast_ref::<UInt16Array>().is_some()
        {
            2
        } else if col.as_any().downcast_ref::<Int32Array>().is_some()
            || col.as_any().downcast_ref::<UInt32Array>().is_some()
        {
            4
        } else if col.as_any().downcast_ref::<Int64Array>().is_some()
            || col.as_any().downcast_ref::<UInt64Array>().is_some()
            || col.as_any().downcast_ref::<Float64Array>().is_some()
        {
            8
        } else {
            // Unreachable: `attributes::admit_attribute_type` is the gate, and it admits exactly the
            // types above. Costing an unknown type at 8 B keeps the estimator total rather than
            // panicking on a path that would only be reached if the two lists drifted apart.
            8
        };
    }
    total
}

fn flush(
    pending: &mut Pending,
    envelope: &BatchEnvelope,
    cancel: &CancelToken,
    stats: &Arc<StreamStats>,
    tx: &std::sync::mpsc::SyncSender<std::result::Result<Item, EngineError>>,
    batch_index: u64,
    target_bytes: usize,
    report_bounds: bool,
) -> Result<()> {
    let mut p = std::mem::replace(pending, Pending::new(pending.attrs.len()));

    if p.est_bytes > MAX_BATCH_BYTES {
        // Because the loop cuts *before* appending, a batch holding more than one feature can
        // never reach here: it is cut while it still fits. So an over-ceiling batch is always a
        // single feature too large to carry, and the error names it. The multi-row arm remains for
        // the estimator being wrong, and says so rather than silently naming an arbitrary id.
        return match (p.ids.len(), p.first_id) {
            (1, Some(id)) => Err(EngineError::FeatureTooLarge {
                id,
                limit: MAX_BATCH_BYTES as u64,
                saw: p.est_bytes as u64,
            }),
            _ => Err(EngineError::CeilingExceeded {
                ceiling: "MAX_BATCH_BYTES",
                limit: MAX_BATCH_BYTES as u64,
                saw: p.est_bytes as u64,
            }),
        };
    }

    let rows = p.ids.len();
    let ids: ArrayRef = Arc::new(UInt64Array::from(std::mem::take(&mut p.ids)));
    let geometry = build_polygon_array(std::mem::take(&mut p.builder))?;

    // One run needs no concatenation — the common case when a batch is cut inside a single DuckDB
    // chunk, and the copy ADR-004 asks to be avoided rather than assumed away.
    let attributes: Vec<ArrayRef> = p
        .attrs
        .iter()
        // **A single run is kept as a slice rather than copied** — ADR-004 asks for copies to be
        // minimized rather than assumed absent, and this is the common case. The consequence, stated
        // because `est_bytes` does not see it: a slice retains its whole DuckDB chunk's buffers
        // until the batch is dropped, so producer-resident memory can exceed the estimate by up to
        // one chunk per attribute column. It is bounded by the chunk, so no declared ceiling is
        // breached, but the ceiling arithmetic in `MAX_QUEUED_BATCHES` does not account for it.
        .map(|runs| match runs.len() {
            1 => Ok(Arc::clone(&runs[0])),
            _ => {
                ATTRIBUTE_CONCATENATIONS.fetch_add(1, Ordering::SeqCst);
                let refs: Vec<&dyn Array> = runs.iter().map(|a| a.as_ref()).collect();
                arrow::compute::concat(&refs)
                    .map_err(|e| EngineError::Arrow(format!("attribute concat: {e}")))
            }
        })
        .collect::<Result<_>>()?;

    let batch = TaggedBatch::assemble(envelope, ids, geometry, attributes)?;
    let xy_bounds = report_bounds.then(|| batch.xy_bounds()).flatten();

    stats.batches_generated.fetch_add(1, Ordering::SeqCst);
    stats.rows_generated.fetch_add(rows as u64, Ordering::SeqCst);
    if cancel.is_cancelled() {
        // H2 allows at most one batch after the producer observes cancellation. Counted, and then
        // dropped rather than sent: the stream is over.
        stats.batches_after_cancel.fetch_add(1, Ordering::SeqCst);
        return Err(EngineError::Cancelled);
    }
    stats.add_resident(p.est_bytes);

    // Blocks when the consumer is behind: this is the backpressure (H3). A disconnected receiver
    // means the consumer is gone, which is a cancellation, not a producer failure.
    tx.send(Ok(Item {
        batch,
        est_bytes: p.est_bytes,
        vertices: p.vertices,
        batch_index,
        target_bytes,
        xy_bounds,
    }))
    .map_err(|_| EngineError::Cancelled)
}

fn classify(cancel: &CancelToken, detail: String) -> EngineError {
    if cancel.is_cancelled() {
        EngineError::Cancelled
    } else {
        EngineError::Query(detail)
    }
}

fn column_u64(chunk: &arrow::array::RecordBatch, name: &str) -> Result<Vec<u64>> {
    let col = chunk
        .column_by_name(name)
        .ok_or_else(|| EngineError::Query(format!("result has no `{name}` column")))?;
    // **Checked before `values()` is read.** `values()` returns the raw buffer and ignores the
    // validity bitmap, so a NULL would arrive as whatever byte pattern occupies its slot —
    // normally 0 — and be emitted into a field the envelope declares non-nullable. That is a
    // wrong-but-plausible feature identity, which is the failure ADR-010 rule 2's id indirection
    // exists to prevent, against a stable-identity requirement `docs/11` makes of every dataset.
    // A malformed GeoParquet is untrusted input; the geometry path below already checks.
    if col.null_count() > 0 {
        return Err(EngineError::Query(format!(
            "`{name}` holds {} null value(s); every feature must carry a stable identity",
            col.null_count()
        )));
    }
    if let Some(a) = col.as_any().downcast_ref::<UInt64Array>() {
        return Ok(a.values().to_vec());
    }
    if let Some(a) = col.as_any().downcast_ref::<Int64Array>() {
        return a
            .values()
            .iter()
            .map(|v| {
                u64::try_from(*v).map_err(|_| {
                    EngineError::Query(format!("`{name}` holds a negative value: {v}"))
                })
            })
            .collect();
    }
    Err(EngineError::Query(format!("`{name}` is {}; expected a 64-bit integer", col.data_type())))
}

fn binary_value(col: &ArrayRef, row: usize) -> Result<&[u8]> {
    if col.is_null(row) {
        return Err(EngineError::Wkb(format!("row {row} has a null geometry")));
    }
    if let Some(a) = col.as_any().downcast_ref::<BinaryArray>() {
        return Ok(a.value(row));
    }
    if let Some(a) = col.as_any().downcast_ref::<LargeBinaryArray>() {
        return Ok(a.value(row));
    }
    if let Some(a) = col.as_any().downcast_ref::<BinaryViewArray>() {
        return Ok(a.value(row));
    }
    Err(EngineError::Query(format!("geometry column is {}; expected binary", col.data_type())))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn a_full_row_batch_fits_inside_the_declared_frame_ceiling() {
        // ADR-010 rule 6: a ceiling that a normal batch can exceed is not a ceiling. This one is a
        // real computation over the estimator, not a comparison of two literals — the pure-constant
        // relationships are asserted at compile time above.
        assert!(estimate_bytes(MAX_ROWS_PER_BATCH, 0) < MAX_BATCH_BYTES);
        // A geometry-free batch of the maximum row count leaves room for real geometry.
        assert!(estimate_bytes(MAX_ROWS_PER_BATCH, 0) * 4 < MAX_BATCH_BYTES);
    }

    #[test]
    fn identifiers_are_quoted_not_interpolated() {
        assert_eq!(quote_ident("geom\"; DROP TABLE t; --"), "\"geom\"\"; DROP TABLE t; --\"");
    }
}
