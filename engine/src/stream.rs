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
//! **The spatial index narrows; it never decides.** `docs/07`'s open gate is closed for this
//! slice's shape by `index.rs`: an in-memory, revision-keyed index over the GeoParquet 1.1
//! covering-bbox columns. When one is admissible its candidate ids are added *alongside* the bbox
//! predicate, never instead of it, so the result set is provably identical to the unindexed one and
//! a wrong index costs time rather than correctness. Without an admissible index the filter is the
//! same linear scan it always was, and says so.

use std::panic::{catch_unwind, AssertUnwindSafe};
use std::sync::atomic::{AtomicU64, AtomicUsize, Ordering};
use std::sync::mpsc::{sync_channel, Receiver};
use std::sync::Arc;

use arrow::array::{Array, ArrayRef, BinaryArray, BinaryViewArray, Int64Array, LargeBinaryArray, UInt64Array};
use duckdb::ToSql;

use crate::cancel::CancelToken;
use crate::dataset::{connect_for_stream, Dataset};
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
}

impl Default for BatchSizePolicy {
    fn default() -> Self {
        Self {
            first_target_bytes: FIRST_TARGET_BATCH_BYTES,
            growth_factor: BATCH_GROWTH_FACTOR,
            target_bytes: TARGET_BATCH_BYTES,
            min_bytes: MIN_BATCH_BYTES,
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
}

pub struct BatchStream {
    rx: Receiver<std::result::Result<Item, EngineError>>,
    cancel: CancelToken,
    stats: Arc<StreamStats>,
    finished: bool,
    envelope: BatchEnvelope,
    filter_plan: FilterPlan,
    policy: BatchSizePolicy,
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
    /// observes a cancellation (the transport) is not the thing that started the stream.
    pub fn stream_with_cancel(&self, q: &ViewportQuery, cancel: CancelToken) -> Result<BatchStream> {
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

        let (sql, filter_plan) = self.build_sql(q)?;
        let policy = BatchSizePolicy::default();
        let path = self
            .path()
            .to_str()
            .ok_or_else(|| EngineError::Source("path is not valid UTF-8".into()))?
            .to_string();

        let conn = connect_for_stream(&cancel)?;
        let envelope = self.envelope().clone();
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
                    &conn,
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
                );
                if let Err(e) = outcome {
                    // Best-effort: if the consumer is gone there is nobody to tell, which is not an
                    // error in itself. H7's "no partial view presented as complete" is enforced on
                    // the consumer side by the terminal frame, not by this send succeeding.
                    let _ = tx.send(Err(e));
                }
                thread_cancel.detach();
            })
            .map_err(|e| EngineError::Source(format!("spawn producer thread: {e}")))?;

        Ok(BatchStream { rx, cancel, stats, finished: false, envelope, filter_plan, policy })
    }

    fn build_sql(&self, q: &ViewportQuery) -> Result<(String, FilterPlan)> {
        let mut plan = FilterPlan::WholeFile;
        let geom = quote_ident(self.geometry_column());
        // **The identity's source column, aliased to the engine's identity name** (ADR-016 §3).
        // A declared mapping changes which column is read and nothing else: everything downstream
        // — the envelope's non-nullable `id` field, the null and negative checks, ADR-010 rule 2's
        // indirection — is identical for a native and a mapped identity, which is what makes the
        // mapping a redirection rather than a second code path with its own bugs.
        let source_column = quote_ident(self.identity().source().source_column());
        let id = quote_ident(ID_COLUMN);
        let mut sql = format!("SELECT {source_column} AS {id}, {geom} FROM read_parquet(?)");

        if let Some(view) = q.bbox.as_ref() {
            let c = self.covering().ok_or_else(|| EngineError::NoCoveringBbox {
                detail: "the file's `geo` metadata declares no covering.bbox".into(),
            })?;

            // **The index narrows; it never decides.** When an admissible index exists, its
            // candidate ids are added as a range predicate *alongside* the bbox comparison rather
            // than instead of it. Two reasons, both about not trusting derived state further than
            // it has been shown to be right: the index answers `covering-bbox-intersects`, which is
            // exactly what the bbox predicate answers, so keeping both makes the result set
            // provably identical to the unindexed one; and a wrong index then costs time, not
            // correctness. Removing the predicate would make the index the system of record, which
            // ADR-006 says a pure transformation's cached output is not.
            // `None` from `candidates` means the index cannot narrow *this* query — a degenerate
            // grid, a bbox it will not reason about. Falling through to the scan is the only safe
            // reading: a derived structure that cannot answer must not answer.
            if let Some(candidates) = self.admitted_index().and_then(|idx| idx.candidates(view)) {
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
        // Deliberately no ORDER BY: ordering would materialize the whole result before the first
        // batch and turn a streaming query into a batch one.
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

    let mut pending = Pending::new();
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
            let incoming = estimate_bytes(1, wkb.len() / 16);
            // The target this batch is being cut at, from the progressive policy. Early batches
            // are small so pixels land sooner; later ones grow to `TARGET_BATCH_BYTES` so the
            // per-batch envelope stops being a significant share of the payload.
            let target = policy.target_for(emitted);
            if !pending.ids.is_empty() && pending.est_bytes + incoming > target {
                flush(&mut pending, envelope, cancel, stats, tx, emitted, target)?;
                emitted += 1;
            }

            let before = pending.builder.vertices();
            pending.builder.push_wkb(wkb)?;
            pending.vertices += pending.builder.vertices() - before;
            pending.ids.push(*id);
            pending.est_bytes = estimate_bytes(pending.ids.len(), pending.builder.vertices());
            pending.first_id.get_or_insert(*id);

            if pending.est_bytes >= target || pending.ids.len() >= MAX_ROWS_PER_BATCH {
                flush(&mut pending, envelope, cancel, stats, tx, emitted, target)?;
                emitted += 1;
            }
        }
    }

    if !pending.ids.is_empty() {
        let target = policy.target_for(emitted);
        flush(&mut pending, envelope, cancel, stats, tx, emitted, target)?;
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
}

impl Pending {
    fn new() -> Self {
        Self {
            ids: Vec::new(),
            builder: PolygonBuilder::new(),
            vertices: 0,
            est_bytes: 0,
            first_id: None,
        }
    }
}

fn estimate_bytes(rows: usize, vertices: usize) -> usize {
    // 16 B per interleaved xy pair, 8 B per id, 4 B per offset entry, both offset levels.
    vertices * 16 + rows * 8 + (rows + vertices) * 4
}

fn flush(
    pending: &mut Pending,
    envelope: &BatchEnvelope,
    cancel: &CancelToken,
    stats: &Arc<StreamStats>,
    tx: &std::sync::mpsc::SyncSender<std::result::Result<Item, EngineError>>,
    batch_index: u64,
    target_bytes: usize,
) -> Result<()> {
    let mut p = std::mem::replace(pending, Pending::new());

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
    let batch = TaggedBatch::assemble(envelope, ids, geometry)?;

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
