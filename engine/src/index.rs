// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! A revision-keyed, in-memory spatial index over the covering-bbox columns — `docs/07`'s open
//! gate, closed for this slice's shape only.
//!
//! ## Authority, stated because the obvious citation is the wrong one
//!
//! This index is **derived state**, but *not* by ADR-010 rule 5. Rule 5 binds "every **renderer**
//! cache"; its generalizing clause generalizes across renderer cache *designs* so that it survives
//! ADR-011's rejection, not across modules. ADR-013 §7 fixes the test — delete this index and rule 5
//! still says exactly what it says — so citing it here would enlarge an Accepted,
//! architect-blockable rule by analogy, which is the thing §7 refuses to do for rule 3.
//!
//! What binds instead is more specific and gives more:
//!
//! - **ADR-006** — building this index is a **pure transformation**: an input snapshot plus
//!   parameters produce a derived output. That class is replayable, cacheable and never the system
//!   of record, and it owes no transaction boundary and no undo.
//! - **ADR-007** — "transactions are delegated to the store that owns the mutation." This index owns
//!   none, so it cannot run, extend, gate or delay one.
//! - **`docs/02` / `docs/05`** — "a DAG with cached, content-addressed intermediates"; this is one.
//! - **`docs/01` principle 8** — staleness is signalled, never silently served.
//!
//! ## What the index answers, and what it must never be promoted to
//!
//! Exactly one predicate: **does a feature's covering bbox intersect the viewport?** That is what
//! the unindexed scan computes today, and it is *weaker* than geometry intersection — a bbox can
//! overlap where the polygon does not. The predicate is part of the cache key precisely so this
//! index can never be silently reused by a caller asking the stronger question; promoting it would
//! be a wrong-but-plausible result set, which is the hazard class ADR-010 rule 2 names.

use std::collections::HashMap;
use std::sync::Arc;

use duckdb::Connection;

use crate::cancel::CancelToken;
use crate::error::{EngineError, Result};
use crate::stream::Bbox;

/// Bumped whenever the built structure or its query semantics change.
///
/// Part of the key: two indexes over the same bytes produced by different code are different
/// derived objects. `docs/05` records the PROJ database version alongside a pinned pipeline for
/// exactly this reason — the inputs to a derivation include the deriver.
pub const BUILDER_VERSION: u32 = 1;

/// The predicate this index answers. Part of the key, so it cannot be silently promoted.
pub const ANSWERS_PREDICATE: &str = "covering-bbox-intersects";

/// Declared ceilings for the index — ADR-010 rule 6's discipline, applied where the ceilings live.
///
/// The index is **in-memory and per-process**. It is deliberately not persisted: the moment
/// anything is written to disk, `docs/11`'s ResourceRef model and ADR-005's grades are owed
/// (`kernel/README.md` names that trigger), and that needs its own ADR rather than arriving as a
/// side effect of a latency fix.
pub const MAX_INDEXED_FEATURES: usize = 20_000_000;
/// Grid cells per axis. A fixed grid, not an R-tree: this slice needs a measurable baseline more
/// than it needs the best structure, and a grid's build cost is one pass with no rebalancing.
pub const GRID_AXIS_CELLS: usize = 256;
/// Bytes of index payload per feature, for the declared memory bound below.
pub const BYTES_PER_INDEXED_FEATURE: usize = 8 + 32; // id + bbox
/// Bytes per grid-bucket entry.
pub const BYTES_PER_CELL_ENTRY: usize = 4;
/// How often the post-scan build phases check for cancellation (ADR-010 rule 6: declared).
///
/// **Declared as a cadence rather than polled per item**, because a `SeqCst` load per item on a
/// 20-million-feature build is work inside the phase it is protecting. It is *declared* rather than
/// tuned: `MAX_INDEXED_FEATURES` is the scale it has to hold at, and no timing is offered for it
/// here — `docs/08`'s rule is no numbers, no claim, and the cancellation latency this bounds is
/// measured by `kernel/tests/indexed_budgets.rs` rather than asserted in a comment. What is claimed
/// is the *bound*: the unpolled window is at most 4 096 bbox validations, extent reductions,
/// feature placements or cell insertions on every branch.
///
/// It is counted over **cell insertions** in the grid phase, not over features: one feature may
/// occupy up to `MAX_CELLS_PER_FEATURE` buckets, so a per-feature poll would leave a window a
/// thousand times longer than the constant says.
///
/// The validation and extent phases poll on `i % INTERVAL == 0`, so their first check is at `i = 0`;
/// the grid phase counts insertions and so first checks at 4 096. The asymmetry is deliberate and
/// harmless — both are bounded by the same constant — and is noted so it does not read as a defect.
pub const CANCEL_POLL_INTERVAL: usize = 4_096;

const _: () = assert!(CANCEL_POLL_INTERVAL >= 1);

/// Most cells one feature may occupy before it is held in a coarse list instead.
///
/// A feature spanning the extent would otherwise be pushed into every one of
/// `GRID_AXIS_CELLS^2` buckets -- 65 536 entries for one row, which one national boundary in a
/// parcel file produces. That is unbounded build time and memory hiding behind a per-feature
/// constant.
pub const MAX_CELLS_PER_FEATURE: usize = 1_024;

/// The phases one index build passes through, in order.
///
/// **A test and measurement fact, not a public engine protocol and not an SKP addition.** It exists
/// because the previous cancellation pass fired all twelve of its delays inside the 610 ms content
/// hash and obtained zero samples of the 30 ms DuckDB scan — a delay ladder cannot aim at a phase
/// it cannot see, and `kernel/RESULTS.md` records that gap rather than papering over it.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum IndexPhase {
    /// SHA-256 of the whole source file — the index's identity, and the dominant cost.
    ContentHash,
    /// The DuckDB scan of the covering-bbox columns.
    DuckDbScan,
    /// Every bbox checked for finiteness and orientation.
    ValidateBboxes,
    /// One reduction over every bbox for the grid's extent.
    ComputeExtent,
    /// Every feature placed into its cells.
    PopulateGrid,
    /// The build finished, or a cached index was reused.
    Complete,
}

impl IndexPhase {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::ContentHash => "content-hash",
            Self::DuckDbScan => "duckdb-scan",
            Self::ValidateBboxes => "validate-bboxes",
            Self::ComputeExtent => "compute-extent",
            Self::PopulateGrid => "populate-grid",
            Self::Complete => "complete",
        }
    }
}

/// Notified as a build enters each phase.
///
/// Called **on the building thread**, so an instrument can act on the transition — but the
/// observation instant for any cancellation measurement stays stamped inside the thread doing the
/// work, never on the observer's. A threshold asserted across a thread handoff measures scheduling
/// rather than the property (`kernel/PROBE-PREREGISTRATION.md` §1b, finding 1).
///
/// The observer sees **phases only, never per-feature data** — a data-bearing observer would be a
/// second bulk path out of this module, which is not what a test seam is for.
pub trait IndexPhaseObserver: Send + Sync {
    fn phase(&self, phase: IndexPhase);
}

/// Report a phase, if anyone is listening. Zero cost when nobody is.
pub(crate) fn observe(observer: Option<&dyn IndexPhaseObserver>, phase: IndexPhase) {
    if let Some(o) = observer {
        o.phase(phase);
    }
}

/// The identity of a derived artifact: what it was built **from**, **by**, and **for**.
///
/// A key that omitted any of the three would let a stale or wrong-shaped index serve a query that
/// looks similar. All three are in `PartialEq`, so a mismatch cannot be missed by a caller that
/// forgot to compare one.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct IndexKey {
    /// **Content hash of the source.** `docs/05`'s grid argument, applied one level up: "grids are
    /// identified by content hash, not filename. A grid substituted under the same name is a
    /// different transformation."
    pub content_hash: String,
    pub builder_version: u32,
    pub answers: String,
    /// The index's own build parameters. Two grids at different resolutions are different objects.
    pub grid_axis_cells: usize,
    /// **The column the stored ids came from.** Without this, two `Dataset`s over the same file
    /// with different declared identities share one index and the second is handed candidate ids
    /// from the other's column -- the same wrong-but-plausible answer ADR-010 rule 2 exists to
    /// prevent. The identity is part of what the index *is*, not a detail of how it was used.
    pub id_column: String,
}

impl IndexKey {
    pub fn new(content_hash: impl Into<String>, id_column: impl Into<String>) -> Self {
        Self {
            content_hash: content_hash.into(),
            builder_version: BUILDER_VERSION,
            answers: ANSWERS_PREDICATE.to_string(),
            grid_axis_cells: GRID_AXIS_CELLS,
            id_column: id_column.into(),
        }
    }
}

/// A cheap check on whether a file *appears* unchanged.
///
/// **This is a validity heuristic and never an identity.** path + mtime + size can collide, and a
/// file can be rewritten within a filesystem timestamp's resolution. It exists so a cached index
/// can be discarded cheaply, never so one can be *served* as though it were content-keyed — hence
/// `fail_closed` below.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct ValidityHeuristic {
    pub len: u64,
    pub modified_nanos: Option<u128>,
}

impl ValidityHeuristic {
    pub fn of(path: &std::path::Path) -> Option<Self> {
        let md = std::fs::metadata(path).ok()?;
        let modified = md
            .modified()
            .ok()
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_nanos());
        Some(Self { len: md.len(), modified_nanos: modified })
    }

    /// **Fail closed.** An absent or unreadable heuristic is treated as "cannot confirm", which
    /// discards the index. The alternative — treating unknown as unchanged — is precisely the
    /// silent staleness `docs/01` principle 8 forbids.
    pub fn fail_closed_matches(a: Option<&Self>, b: Option<&Self>) -> bool {
        match (a, b) {
            (Some(x), Some(y)) => x == y && x.modified_nanos.is_some(),
            _ => false,
        }
    }
}

/// Why a cached index was not used. Signalled rather than silently absorbed (principle 8).
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum IndexMiss {
    /// Nothing cached for this source.
    Absent,
    /// A different revision, builder, predicate or parameter set.
    KeyMismatch,
    /// The source no longer looks like the file the index was built from.
    SourceChanged,
}

/// The built index.
pub struct SpatialIndex {
    key: IndexKey,
    validity: Option<ValidityHeuristic>,
    /// Per-feature id and bbox, in build order.
    ids: Vec<u64>,
    bboxes: Vec<[f64; 4]>,
    /// Grid extent and cell → feature-slot buckets.
    extent: [f64; 4],
    cells: HashMap<(u32, u32), Vec<u32>>,
    /// Features too broad to bucket; considered by every query so none is ever missed.
    spanning: Vec<u32>,
    cell_entries: usize,
    build_millis: f64,
    scanned_rows: u64,
}

impl SpatialIndex {
    pub fn key(&self) -> &IndexKey {
        &self.key
    }
    pub fn feature_count(&self) -> usize {
        self.ids.len()
    }
    /// Build cost, recorded **separately from any query benefit**. The two are different
    /// quantities and are never netted into "pays for itself after N queries" here.
    pub fn build_millis(&self) -> f64 {
        self.build_millis
    }
    pub fn scanned_rows(&self) -> u64 {
        self.scanned_rows
    }
    /// Declared memory bound for this index, in bytes (ADR-010 rule 6: declared, not discovered).
    /// Declared memory bound, over **actual occupancy** rather than a per-feature constant.
    ///
    /// The first figure counted one grid slot per feature and ignored the buckets entirely, so a
    /// feature spanning many cells was understated by orders of magnitude -- and that wrong
    /// figure had already been propagated into the composed process bound. Bucket entries are
    /// counted now, and per-feature coverage is capped, so this is bounded by construction.
    pub fn declared_memory_bound(&self) -> usize {
        self.ids.len() * BYTES_PER_INDEXED_FEATURE + self.cell_entries * BYTES_PER_CELL_ENTRY
    }

    /// Build from the source's covering-bbox columns.
    ///
    /// One scan, cancellable throughout: this reads every row's bbox, so it is an operation under
    /// `docs/01` principle 7 exactly as the identity scan is.
    pub fn build(
        conn: &Connection,
        path: &str,
        covering: &crate::geoparquet::CoveringBbox,
        id_column: &str,
        key: IndexKey,
        validity: Option<ValidityHeuristic>,
        cancel: &CancelToken,
    ) -> Result<Self> {
        Self::build_observed(conn, path, covering, id_column, key, validity, cancel, None)
    }

    /// As `build`, reporting each phase to an observer. See [`IndexPhaseObserver`].
    ///
    /// **Every phase below the DuckDB scan is O(N) and every one of them polls cancellation.**
    /// That is the gap `kernel/RESULTS.md` names as a code fact rather than a timing: after the
    /// scan's last check, the extent pass and the grid loops used to contain no cancellation point
    /// at all. At 100 000 features that window is a few milliseconds and nothing is at stake; at
    /// `MAX_INDEXED_FEATURES` = 20 000 000 it is the same code with 200× the work, against
    /// `docs/08`'s "cancellation acknowledged < 100 ms, **any operation**" and `docs/01`
    /// principle 7.
    ///
    /// **In these phases the token flag is the only mechanism, and that is correct.** DuckDB's
    /// interrupt handle is detached the moment the scan returns — there is no query left to
    /// interrupt — so what stops the work here is the poll, not the interrupt.
    #[allow(clippy::too_many_arguments)]
    pub fn build_observed(
        conn: &Connection,
        path: &str,
        covering: &crate::geoparquet::CoveringBbox,
        id_column: &str,
        key: IndexKey,
        validity: Option<ValidityHeuristic>,
        cancel: &CancelToken,
        observer: Option<&dyn IndexPhaseObserver>,
    ) -> Result<Self> {
        let started = std::time::Instant::now();
        let sql = format!(
            "SELECT \"{id}\", {xmin}, {ymin}, {xmax}, {ymax} FROM read_parquet('{p}')",
            id = id_column.replace('"', "\"\""),
            xmin = covering.xmin.to_sql(),
            ymin = covering.ymin.to_sql(),
            xmax = covering.xmax.to_sql(),
            ymax = covering.ymax.to_sql(),
            p = path.replace('\'', "''"),
        );

        cancel.attach(Arc::clone(&conn.interrupt_handle()))?;
        observe(observer, IndexPhase::DuckDbScan);
        let built = Self::scan(conn, &sql, cancel);
        cancel.detach();
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }
        let (ids, bboxes, scanned_rows) = built?;

        // **A bbox this engine cannot reason about makes the index unusable, not approximate.**
        // A NaN bound compares false in Rust and true on one side in SQL; an inverted bbox
        // produces an empty cell range and lands in no cell at all. Either way the index would
        // exclude a row the scan returns, which is the one thing it must never do.
        observe(observer, IndexPhase::ValidateBboxes);
        for (i, b) in bboxes.iter().enumerate() {
            if i % CANCEL_POLL_INTERVAL == 0 && cancel.is_cancelled() {
                return Err(EngineError::Cancelled);
            }
            if !b.iter().all(|v| v.is_finite()) {
                return Err(EngineError::Source(format!(
                    "feature at row {i} has a non-finite covering bbox ({b:?}); this engine                      will not index a bound it cannot compare"
                )));
            }
            if b[0] > b[2] || b[1] > b[3] {
                return Err(EngineError::Source(format!(
                    "feature at row {i} has an inverted covering bbox ({b:?})"
                )));
            }
        }

        observe(observer, IndexPhase::ComputeExtent);
        let mut extent = [f64::INFINITY, f64::INFINITY, f64::NEG_INFINITY, f64::NEG_INFINITY];
        for (i, b) in bboxes.iter().enumerate() {
            if i % CANCEL_POLL_INTERVAL == 0 && cancel.is_cancelled() {
                return Err(EngineError::Cancelled);
            }
            extent[0] = extent[0].min(b[0]);
            extent[1] = extent[1].min(b[1]);
            extent[2] = extent[2].max(b[2]);
            extent[3] = extent[3].max(b[3]);
        }

        observe(observer, IndexPhase::PopulateGrid);
        let mut cells: HashMap<(u32, u32), Vec<u32>> = HashMap::new();
        let mut spanning: Vec<u32> = Vec::new();
        if !bboxes.is_empty() && extent[2] > extent[0] && extent[3] > extent[1] {
            // Counted over **insertions**, not features: one feature may fill
            // `MAX_CELLS_PER_FEATURE` buckets, so a per-feature poll would leave an unpolled
            // window a thousand times longer than `CANCEL_POLL_INTERVAL` claims.
            let mut since_poll = 0usize;
            for (slot, b) in bboxes.iter().enumerate() {
                if since_poll >= CANCEL_POLL_INTERVAL {
                    since_poll = 0;
                    if cancel.is_cancelled() {
                        return Err(EngineError::Cancelled);
                    }
                }
                let (c0, r0) = cell_of(&extent, b[0], b[1]);
                let (c1, r1) = cell_of(&extent, b[2], b[3]);
                let covered = (c1 - c0 + 1) as usize * (r1 - r0 + 1) as usize;
                if covered > MAX_CELLS_PER_FEATURE {
                    // Too broad to bucket. Held in a list every query considers, so it is never
                    // *missed* -- the index stays a narrowing structure and the cost is bounded.
                    spanning.push(slot as u32);
                    since_poll += 1;
                    continue;
                }
                for c in c0..=c1 {
                    for r in r0..=r1 {
                        // The inner loop, which is where a single wide feature spends its time.
                        if since_poll >= CANCEL_POLL_INTERVAL {
                            since_poll = 0;
                            if cancel.is_cancelled() {
                                return Err(EngineError::Cancelled);
                            }
                        }
                        cells.entry((c, r)).or_default().push(slot as u32);
                        since_poll += 1;
                    }
                }
            }
        }

        // **The last check, and it is unconditional.**
        //
        // Every phase above polls at a cadence, which bounds how long a cancel waits *inside* a
        // phase — it does not cover the tail. Two ways a cancelled build would otherwise return
        // `Ok` and be inserted into the cache: fewer than `CANCEL_POLL_INTERVAL` insertions
        // remained after the last poll, or the grid loop was skipped entirely because the extent is
        // degenerate (every feature sharing an x or a y — a point layer, a single feature,
        // duplicated bboxes; `candidates` names those shapes), in which case `PopulateGrid`
        // contains no poll at all. The scan phase already has its own unconditional check after it
        // returns; this is the same discipline applied to everything after it.
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }

        Ok(Self {
            key,
            validity,
            ids,
            bboxes,
            extent,
            cell_entries: cells.values().map(Vec::len).sum::<usize>() + spanning.len(),
            cells,
            spanning,
            build_millis: started.elapsed().as_secs_f64() * 1000.0,
            scanned_rows,
        })
    }

    fn scan(
        conn: &Connection,
        sql: &str,
        cancel: &CancelToken,
    ) -> Result<(Vec<u64>, Vec<[f64; 4]>, u64)> {
        use arrow::array::{Array, Float64Array, UInt64Array};
        let mut stmt = conn
            .prepare(sql)
            .map_err(|e| EngineError::Query(format!("index build prepare: {e}")))?;
        let arrow = stmt
            .query_arrow([])
            .map_err(|e| EngineError::Query(format!("index build: {e}")))?;

        let (mut ids, mut bboxes, mut rows) = (Vec::new(), Vec::new(), 0u64);
        for chunk in arrow {
            if cancel.is_cancelled() {
                return Err(EngineError::Cancelled);
            }
            let idc = chunk
                .column(0)
                .as_any()
                .downcast_ref::<UInt64Array>()
                .ok_or_else(|| EngineError::Query("index: id column is not u64".into()))?;
            let f = |i: usize| -> Result<&Float64Array> {
                chunk
                    .column(i)
                    .as_any()
                    .downcast_ref::<Float64Array>()
                    .ok_or_else(|| EngineError::Query(format!("index: column {i} is not f64")))
            };
            let (xmin, ymin, xmax, ymax) = (f(1)?, f(2)?, f(3)?, f(4)?);
            if rows + chunk.num_rows() as u64 > MAX_INDEXED_FEATURES as u64 {
                // Enforced **while** reading, not after. Checking once the whole column had been
                // materialized meant a file past the ceiling allocated everything first and then
                // reported the limit -- a ceiling that describes rather than bounds.
                return Err(EngineError::CeilingExceeded {
                    ceiling: "MAX_INDEXED_FEATURES",
                    limit: MAX_INDEXED_FEATURES as u64,
                    saw: rows + chunk.num_rows() as u64,
                });
            }
            for r in 0..chunk.num_rows() {
                ids.push(idc.value(r));
                bboxes.push([xmin.value(r), ymin.value(r), xmax.value(r), ymax.value(r)]);
                rows += 1;
            }
        }
        Ok((ids, bboxes, rows))
    }

    /// Candidate feature ids whose **covering bbox** intersects `view`.
    ///
    /// Returns candidates, not answers: the caller still applies whatever stronger predicate it
    /// needs. Naming it `candidates` rather than `matches` is the same discipline as putting the
    /// predicate in the key.
    /// `None` means **"this index cannot narrow this query"** -- the caller falls back to the
    /// scan.
    ///
    /// That distinction is a correction to this file's first design and it matters more than it
    /// looks. An empty candidate list used to be encoded as `WHERE 1=0`, which made the index
    /// *decide* the result rather than narrow it: a degenerate extent -- every feature sharing an
    /// x or a y, which a point layer, a single feature or duplicated bboxes all produce -- built
    /// an empty grid, and every viewport query then returned zero rows while the same query
    /// without an index returned the right ones. A pure transformation's cached output may not be
    /// the system of record (ADR-006), so whatever this structure cannot answer confidently falls
    /// through to the scan.
    pub fn candidates(&self, view: &Bbox) -> Option<Vec<u64>> {
        if self.ids.is_empty() || self.cells.is_empty() {
            return None;
        }
        let finite = view.xmin.is_finite()
            && view.ymin.is_finite()
            && view.xmax.is_finite()
            && view.ymax.is_finite();
        if !finite || view.xmin > view.xmax || view.ymin > view.ymax {
            return None;
        }
        let (c0, r0) = cell_of(&self.extent, view.xmin, view.ymin);
        let (c1, r1) = cell_of(&self.extent, view.xmax, view.ymax);
        let mut seen = vec![false; self.ids.len()];
        let mut out = Vec::new();
        let consider = |s: usize, out: &mut Vec<u64>, seen: &mut Vec<bool>| {
            if seen[s] {
                return;
            }
            seen[s] = true;
            let b = &self.bboxes[s];
            // The exact predicate named in the key -- bbox intersection, nothing stronger.
            if b[0] <= view.xmax && b[2] >= view.xmin && b[1] <= view.ymax && b[3] >= view.ymin {
                out.push(self.ids[s]);
            }
        };
        for &slot in &self.spanning {
            consider(slot as usize, &mut out, &mut seen);
        }
        for c in c0..=c1 {
            for r in r0..=r1 {
                let Some(slots) = self.cells.get(&(c, r)) else { continue };
                for &slot in slots {
                    let s = slot as usize;
                    if seen[s] {
                        continue;
                    }
                    seen[s] = true;
                    let b = &self.bboxes[s];
                    // The exact predicate named in the key — bbox intersection, nothing stronger.
                    if b[0] <= view.xmax && b[2] >= view.xmin && b[1] <= view.ymax && b[3] >= view.ymin
                    {
                        out.push(self.ids[s]);
                    }
                }
            }
        }
        out.sort_unstable();
        Some(out)
    }

    /// Whether this index may serve a request, or the reason it may not.
    ///
    /// A caller cannot get a stale answer by forgetting to check: the only way to a candidate list
    /// is through the index, and the only way to an index is through the cache, which calls this.
    pub fn admits(&self, key: &IndexKey, validity: Option<&ValidityHeuristic>) -> std::result::Result<(), IndexMiss> {
        if &self.key != key {
            return Err(IndexMiss::KeyMismatch);
        }
        if !ValidityHeuristic::fail_closed_matches(self.validity.as_ref(), validity) {
            return Err(IndexMiss::SourceChanged);
        }
        Ok(())
    }
}

/// The source's content hash — the index's **identity**.
///
/// `docs/05`'s grid rule, one level up: "grids are identified by content hash, not filename. A grid
/// substituted under the same name is a different transformation." A file replaced in place is a
/// different source, and no filename or timestamp can be trusted to say so.
///
/// **This reads the whole file.** At `docs/07`'s 5 GB that is a real cost that lands on the same
/// `docs/08` cold-open budget `kernel/RESULTS.md` records as unmeasured, so it is timed separately
/// and reported as its own quantity rather than folded into "index build". It is cancellable for
/// the same reason the other whole-file passes are (principle 7).
pub fn content_hash(path: &std::path::Path, cancel: &CancelToken) -> Result<(String, f64)> {
    use sha2::{Digest, Sha256};
    use std::io::Read;

    let started = std::time::Instant::now();
    let mut f = std::fs::File::open(path)
        .map_err(|e| EngineError::Source(format!("open for hashing: {e}")))?;
    let mut hasher = Sha256::new();
    let mut buf = vec![0u8; 1 << 20];
    loop {
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }
        let n = f.read(&mut buf).map_err(|e| EngineError::Source(format!("read for hashing: {e}")))?;
        if n == 0 {
            break;
        }
        hasher.update(&buf[..n]);
    }
    Ok((hex(&hasher.finalize()), started.elapsed().as_secs_f64() * 1000.0))
}

fn hex(bytes: &[u8]) -> String {
    let mut s = String::with_capacity(bytes.len() * 2);
    for b in bytes {
        s.push_str(&format!("{b:02x}"));
    }
    s
}

/// A process-wide cache of built indexes, keyed by source path.
///
/// **In-memory and per-process, deliberately.** Persisting would make this the first thing this
/// tree writes to disk, which `kernel/README.md` names as the trigger for `docs/11`'s ResourceRef
/// model and ADR-005's grades — a decision that needs its own ADR rather than arriving as a side
/// effect of a latency fix.
///
/// The path is only a *lookup* key. Whether the entry may actually be **used** is decided by
/// `SpatialIndex::admits`, against the content hash, the builder version, the answered predicate,
/// the build parameters and the fail-closed validity heuristic. A stale index therefore cannot
/// serve a newer revision: it is found, rejected, and the reason is reported.
#[derive(Default)]
pub struct IndexCache {
    entries: std::sync::Mutex<HashMap<std::path::PathBuf, Arc<SpatialIndex>>>,
}

impl IndexCache {
    /// Look up an index that may serve `key`, or say why none may.
    pub fn get(
        &self,
        path: &std::path::Path,
        key: &IndexKey,
        validity: Option<&ValidityHeuristic>,
    ) -> std::result::Result<Arc<SpatialIndex>, IndexMiss> {
        let entries = self.entries.lock().unwrap_or_else(|e| e.into_inner());
        let found = entries.get(path).ok_or(IndexMiss::Absent)?;
        found.admits(key, validity)?;
        Ok(Arc::clone(found))
    }

    pub fn insert(&self, path: std::path::PathBuf, index: Arc<SpatialIndex>) {
        self.entries.lock().unwrap_or_else(|e| e.into_inner()).insert(path, index);
    }

    /// The content hash an entry for `path` was built from, if any. Lets a caller reconstruct the
    /// key it must match without re-reading the whole file — the hash is an *identity*, so reusing
    /// the recorded one is sound; what must be re-checked each time is the validity heuristic.
    pub fn hash_for(&self, path: &std::path::Path) -> Option<String> {
        let entries = self.entries.lock().unwrap_or_else(|e| e.into_inner());
        entries.get(path).map(|i| i.key().content_hash.clone())
    }

    pub fn len(&self) -> usize {
        self.entries.lock().unwrap_or_else(|e| e.into_inner()).len()
    }

    pub fn is_empty(&self) -> bool {
        self.len() == 0
    }
}

/// Compress a sorted id list into inclusive ranges.
///
/// The candidate set has to reach DuckDB as SQL, and one predicate per id does not scale. Ranges do
/// when ids are spatially correlated and do **not** when they are scattered — which is why
/// `MAX_ID_RANGES` exists and why exceeding it is *reported* rather than absorbed: an index that
/// silently stopped being used would show up only as a performance mystery.
pub fn compress_to_ranges(sorted_ids: &[u64], max_ranges: usize) -> Option<Vec<(u64, u64)>> {
    if sorted_ids.is_empty() {
        return Some(Vec::new());
    }
    let mut out = Vec::new();
    let (mut lo, mut hi) = (sorted_ids[0], sorted_ids[0]);
    for &id in &sorted_ids[1..] {
        if id == hi + 1 {
            hi = id;
        } else {
            out.push((lo, hi));
            if out.len() > max_ranges {
                return None;
            }
            lo = id;
            hi = id;
        }
    }
    out.push((lo, hi));
    if out.len() > max_ranges {
        return None;
    }
    Some(out)
}

/// Most id ranges the engine will put in one statement before falling back to the scan.
pub const MAX_ID_RANGES: usize = 4_096;

fn cell_of(extent: &[f64; 4], x: f64, y: f64) -> (u32, u32) {
    let span_x = (extent[2] - extent[0]).max(f64::MIN_POSITIVE);
    let span_y = (extent[3] - extent[1]).max(f64::MIN_POSITIVE);
    let n = (GRID_AXIS_CELLS - 1) as f64;
    let cx = (((x - extent[0]) / span_x) * n).clamp(0.0, n) as u32;
    let cy = (((y - extent[1]) / span_y) * n).clamp(0.0, n) as u32;
    (cx, cy)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn key(hash: &str) -> IndexKey {
        IndexKey::new(hash, "id")
    }

    #[test]
    fn a_key_that_differs_in_any_component_is_a_different_derived_object() {
        let base = key("abc");
        assert_eq!(base, key("abc"));

        // Different source bytes.
        assert_ne!(base, key("def"));
        // Different deriver — same bytes, different code, different object.
        let mut other_builder = key("abc");
        other_builder.builder_version = BUILDER_VERSION + 1;
        assert_ne!(base, other_builder);
        // Different question. This is the one that stops a bbox index answering "intersects".
        let mut other_predicate = key("abc");
        other_predicate.answers = "geometry-intersects".into();
        assert_ne!(base, other_predicate);
        // Different build parameters.
        let mut other_grid = key("abc");
        other_grid.grid_axis_cells = GRID_AXIS_CELLS * 2;
        assert_ne!(base, other_grid);
        // Different identity column — the ids stored *are* that column's values.
        assert_ne!(base, IndexKey::new("abc", "parcel_key"));
    }

    #[test]
    fn ranges_compress_contiguous_ids_and_refuse_to_explode() {
        assert_eq!(compress_to_ranges(&[], 10), Some(vec![]));
        assert_eq!(compress_to_ranges(&[1, 2, 3, 7, 8], 10), Some(vec![(1, 3), (7, 8)]));
        assert_eq!(compress_to_ranges(&[5], 10), Some(vec![(5, 5)]));
        // Scattered ids do not compress, and the answer is None — "fall back and say so" —
        // rather than a statement with thousands of predicates in it.
        let scattered: Vec<u64> = (0..50).map(|i| i * 3).collect();
        assert_eq!(compress_to_ranges(&scattered, 10), None);
    }

    #[test]
    fn the_validity_heuristic_fails_closed_on_anything_it_cannot_confirm() {
        let a = ValidityHeuristic { len: 10, modified_nanos: Some(5) };
        assert!(ValidityHeuristic::fail_closed_matches(Some(&a), Some(&a)));

        // Unknown is never "unchanged".
        assert!(!ValidityHeuristic::fail_closed_matches(Some(&a), None));
        assert!(!ValidityHeuristic::fail_closed_matches(None, Some(&a)));
        assert!(!ValidityHeuristic::fail_closed_matches(None, None));

        // A filesystem with no mtime cannot confirm anything, even against itself.
        let no_mtime = ValidityHeuristic { len: 10, modified_nanos: None };
        assert!(!ValidityHeuristic::fail_closed_matches(Some(&no_mtime), Some(&no_mtime)));

        let bigger = ValidityHeuristic { len: 11, modified_nanos: Some(5) };
        assert!(!ValidityHeuristic::fail_closed_matches(Some(&a), Some(&bigger)));
    }
}
