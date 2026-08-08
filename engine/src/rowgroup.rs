// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! An external **row-group** index over a parquet file's own statistics — lever B2 of the
//! first-batch cut, and the first candidate in this tree that tries to *replace* IO rather than
//! re-filter rows.
//!
//! ## The lesson it is built from, and the one it is measured against
//!
//! `kernel/RESULTS.md`'s second section measured the fixed-grid index in [`crate::index`] making
//! **every** filtered query slower, and named the mechanism: it answers `covering-bbox-intersects`,
//! which is exactly the predicate the scan already computes, so its candidate ids are pure added
//! work per row on a scan that still runs in full. `docs/07` records the corrected lesson — an index
//! must replace IO, not re-filter it — and defers the design.
//!
//! This module is that design's first candidate. It answers a **different, weaker predicate about a
//! coarser object**: *does this row group's covering-bbox envelope intersect the viewport?* One row
//! group is thousands of rows and, at the shapes this repository measures, megabytes of geometry —
//! so a group excluded is IO not performed rather than rows not returned.
//!
//! ## What it is not, stated before anything else
//!
//! **It cannot be assumed to prune. DuckDB prunes row groups on the same statistics itself**, and a
//! pilot measurement taken before this module existed recorded a SW-quarter query on a 13-row-group
//! file reading 77,631,970 B of 151,642,404 B — seven groups, exactly the set whose envelope
//! intersects the viewport — with no index of any kind in the path. Where that already happens, this
//! index can only re-express a decision DuckDB has already made, at the cost of a longer statement.
//! **So the pruning claim is an empirical one and is answered by a read-volume instrument, never by
//! a plan**: "the predicate was built" and "IO was excluded" are different facts, and the second
//! section's mistake was to time the first while believing the second.
//!
//! ## Authority
//!
//! The same set that binds [`crate::index`], for the same reasons, and **not** ADR-010 rule 5 (which
//! binds renderer caches; ADR-013 §7 refuses the generalization by analogy):
//!
//! - **ADR-006** — building this is a **pure transformation**: input snapshot plus parameters give a
//!   derived output. Replayable, cacheable, and **never the system of record** — which is why the
//!   covering-bbox `WHERE` clause always stays alongside the injected ranges.
//! - **ADR-016 is consumed beyond what it guarantees, and that is why [`RowGroupRefusal`] exists.**
//!   ADR-016 promises a feature identity that is unique, non-null and representable as `u64`. It
//!   promises **nothing about physical ordering in the file**, and the injection below needs exactly
//!   that. The property is therefore *checked per file* from the file's own statistics and refused
//!   when absent, rather than assumed from the ADR.
//! - **`docs/01` principle 8** — every refusal is a named variant that reaches the artifact.
//! - **In-memory and per-process, never persisted**, exactly as [`crate::index::IndexCache`]:
//!   the first thing this tree writes to disk owes `docs/11`'s ResourceRef model and ADR-005's
//!   grades, and that is a decision with its own ADR rather than a side effect of a latency fix.

use std::collections::HashMap;
use std::sync::Arc;

use duckdb::Connection;

use crate::cancel::CancelToken;
use crate::error::{EngineError, Result};
use crate::geoparquet::{CoveringBbox, FieldPath};
use crate::index::{observe, IndexPhase, IndexPhaseObserver, ValidityHeuristic, CANCEL_POLL_INTERVAL};
use crate::stream::Bbox;

/// Bumped whenever the built structure or its query semantics change. Part of the key: two indexes
/// over the same bytes produced by different code are different derived objects.
pub const BUILDER_VERSION: u32 = 1;

/// The predicate this index answers.
///
/// **Deliberately not [`crate::index::ANSWERS_PREDICATE`].** That one is about a *feature's* bbox;
/// this one is about a *row group's* envelope, which is a strictly weaker statement about a coarser
/// object. Sharing the string would let one be served for the other, which is the whole reason the
/// predicate is in the key.
pub const ANSWERS_PREDICATE: &str = "row-group-covering-bbox-intersects";

/// Bytes of **retained** index payload per row group, for the declared memory bound.
///
/// **Checked against the type rather than derived in prose.** An earlier revision of this constant
/// counted the envelope as a bare `[f64; 4]` (32 B) and declared 64; the field is
/// `Option<[f64; 4]>`, which has no niche and costs 40 B, so the real entry is 72 B with alignment
/// and the declared bound under-reported occupancy by about 11 %. The compile-time assertion below
/// is what stops that recurring — a bound that a type change can silently invalidate is not a bound.
pub const BYTES_PER_ROW_GROUP_ENTRY: usize = 80;

const _: () = assert!(std::mem::size_of::<RowGroupEntry>() <= BYTES_PER_ROW_GROUP_ENTRY);

/// Row groups one index will hold — **a ceiling, enforced while reading** (ADR-010 rule 6).
///
/// Enforced *while* the metadata is consumed rather than after, which is the lesson
/// `MAX_INDEXED_FEATURES` records in its own comment: a check that runs once everything has been
/// materialized is a ceiling that describes rather than bounds.
///
/// **What it bounds, and what it does not — stated because the difference is a whole term.** At
/// [`BYTES_PER_ROW_GROUP_ENTRY`] this bounds the *retained* structure at **80 MiB**; the 5 GB
/// hero-slice fixture has 403 row groups, or about 32 KiB. It does **not** bound peak memory during
/// the build: the reduction holds one `RawGroup` per group first, and a `RawGroup` carries up to six
/// heap `String`s straight from DuckDB's VARCHAR statistics. That transient is bounded by the same
/// group count but not by this constant, and it is named here rather than netted in — the
/// `PUBLISH_WRITE_CHUNK_BYTES` lesson about a bound that excludes its dominant term.
pub const MAX_INDEXED_ROW_GROUPS: usize = 1_048_576;

/// Most id ranges the engine will put in one statement before falling back to the scan.
///
/// Deliberately the same value as [`crate::index::MAX_ID_RANGES`] and deliberately a **separate
/// constant**: the two limits bound different things — per-feature ranges there, per-row-group ranges
/// here — and a shared constant would make a change to one silently a change to the other.
pub const MAX_ROW_GROUP_RANGES: usize = 4_096;

const _: () = assert!(MAX_INDEXED_ROW_GROUPS >= 1);
const _: () = assert!(MAX_ROW_GROUP_RANGES >= 1);

/// The identity of a built row-group index: what it was built **from**, **by**, and **for**.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct RowGroupKey {
    /// Content hash of the source — `docs/05`'s grid rule: identified by content, never by filename.
    pub content_hash: String,
    pub builder_version: u32,
    pub answers: String,
    /// The column the stored ranges are expressed in. The ranges *are* that column's values, so an
    /// index built for one declared identity may not serve another — the same wrong-but-plausible
    /// answer ADR-010 rule 2 exists to prevent.
    pub id_column: String,
}

impl RowGroupKey {
    pub fn new(content_hash: impl Into<String>, id_column: impl Into<String>) -> Self {
        Self {
            content_hash: content_hash.into(),
            builder_version: BUILDER_VERSION,
            answers: ANSWERS_PREDICATE.to_string(),
            id_column: id_column.into(),
        }
    }
}

/// Why a file's row-group statistics cannot support an id-range injection.
///
/// **A closed, named set, and every variant reaches the artifact** (`docs/01` principle 8). An index
/// that silently stopped being used would surface only as a performance mystery — the reason
/// [`crate::stream::FilterPlan::IndexTooFragmented`] exists at all.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum RowGroupRefusal {
    /// The identity column has no min or no max statistic on at least one row group.
    IdStatsAbsent,
    /// Two row groups' identity intervals overlap, so an id range cannot name a set of groups.
    IdRangesOverlap,
    /// The identity intervals are not non-decreasing in file order.
    IdRangesUnordered,
    /// A statistic did not parse as the type its column claims, or is non-finite.
    StatsUnparseable,
    /// The **viewport** is not one this index will reason about — non-finite, or inverted.
    ///
    /// A separate variant from [`Self::StatsUnparseable`] because it is a statement about the
    /// caller's query and not about the file, and an artifact that conflated them would report a
    /// caller error as a property of the data.
    ViewportUnusable,
    /// The file has more row groups than [`MAX_INDEXED_ROW_GROUPS`].
    CeilingExceeded,
    /// The file has no row groups at all, or `parquet_metadata` returned nothing.
    NoRowGroups,
}

impl RowGroupRefusal {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::IdStatsAbsent => "id-stats-absent",
            Self::IdRangesOverlap => "id-ranges-overlap",
            Self::IdRangesUnordered => "id-ranges-unordered",
            Self::StatsUnparseable => "stats-unparseable",
            Self::ViewportUnusable => "viewport-unusable",
            Self::CeilingExceeded => "ceiling-exceeded",
            Self::NoRowGroups => "no-row-groups",
        }
    }
}

/// One row group, as the file's own footer describes it.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct RowGroupEntry {
    pub ordinal: u32,
    pub rows: u64,
    /// The identity column's closed interval over this group.
    pub id_lo: u64,
    pub id_hi: u64,
    /// `[xmin, ymin, xmax, ymax]` — the group's **envelope**, from the covering columns'
    /// per-group statistics.
    ///
    /// **`None` means "cannot be reasoned about", and such a group is always retained.** A group
    /// with no usable envelope is one this index may not exclude, ever; the only safe direction for
    /// a missing statistic is to keep the IO, because the alternative is dropping a row the scan
    /// would have returned.
    pub envelope: Option<[f64; 4]>,
}

impl RowGroupEntry {
    /// Whether this group must be read for `view`. Retention is the default on anything unknown.
    fn intersects(&self, view: &Bbox) -> bool {
        match self.envelope {
            None => true,
            Some(b) => b[0] <= view.xmax && b[2] >= view.xmin && b[1] <= view.ymax && b[3] >= view.ymin,
        }
    }
}

/// The built index: one entry per row group, plus the admissibility verdict for the whole file.
pub struct RowGroupIndex {
    key: RowGroupKey,
    validity: Option<ValidityHeuristic>,
    groups: Vec<RowGroupEntry>,
    /// `Ok(())` when the file's identity statistics support an id-range injection; the named
    /// refusal otherwise. **Decided once, at build time, over the whole file** — an injection that
    /// was sound for one viewport and unsound for another would be a property of the query, and it
    /// is not: it is a property of the file's layout.
    admissible: std::result::Result<(), RowGroupRefusal>,
    build_millis: f64,
    /// Row groups the file has, whatever their admissibility. Reported so "13 groups, 7 kept" and
    /// "13 groups, all kept" are different sentences in an artifact.
    total_groups: usize,
    scanned_metadata_rows: u64,
}

impl RowGroupIndex {
    pub fn key(&self) -> &RowGroupKey {
        &self.key
    }
    pub fn groups(&self) -> &[RowGroupEntry] {
        &self.groups
    }
    pub fn total_groups(&self) -> usize {
        self.total_groups
    }
    pub fn admissible(&self) -> std::result::Result<(), RowGroupRefusal> {
        self.admissible
    }
    /// Build cost, recorded **separately from any query benefit**. The two are different quantities
    /// and this module never nets them into "pays for itself after N queries" — `index.rs`'s own
    /// standing rule, restated because it is the easiest one to forget when a lever looks good.
    pub fn build_millis(&self) -> f64 {
        self.build_millis
    }
    pub fn scanned_metadata_rows(&self) -> u64 {
        self.scanned_metadata_rows
    }
    /// Declared memory bound, over actual occupancy (ADR-010 rule 6).
    pub fn declared_memory_bound(&self) -> usize {
        self.groups.len() * BYTES_PER_ROW_GROUP_ENTRY
    }

    /// The id ranges a query for `view` must read, or the reason this index cannot narrow it.
    ///
    /// **`Err` is not a failure and `Ok(all groups)` is not a bug.** They are three different facts —
    /// "this file's layout cannot support injection", "every group is needed", "these groups are
    /// needed" — and a caller that could not tell them apart could not attribute a timing to any of
    /// them.
    ///
    /// Ranges are **row-group aligned by construction**: each is one surviving group's own
    /// `[id_lo, id_hi]`, merged only where adjacent groups are contiguous. A range therefore never
    /// excludes a row inside a group it names, which is what makes the injection an *IO* statement
    /// rather than a row filter.
    pub fn ranges_for(
        &self,
        view: &Bbox,
    ) -> std::result::Result<RowGroupSelection, RowGroupRefusal> {
        self.admissible?;
        // A viewport this index will not reason about narrows nothing, and saying so is the only
        // safe reading — the correction `index.rs::candidates` records, applied here from the start.
        let finite = view.xmin.is_finite()
            && view.ymin.is_finite()
            && view.xmax.is_finite()
            && view.ymax.is_finite();
        if !finite || view.xmin > view.xmax || view.ymin > view.ymax {
            return Err(RowGroupRefusal::ViewportUnusable);
        }

        let mut ranges: Vec<(u64, u64)> = Vec::new();
        let mut kept = 0usize;
        for g in &self.groups {
            if !g.intersects(view) {
                continue;
            }
            kept += 1;
            match ranges.last_mut() {
                // Contiguous with the previous surviving group: one range, not two. The groups are
                // in file order and their intervals are disjoint and non-decreasing (checked at
                // build time), so `id_lo == prev_hi + 1` is exactly adjacency.
                //
                // `saturating_add` cannot mask a bug here, and the argument is not local so it is
                // written down: a group with `id_hi == u64::MAX` forces the overlap refusal in
                // `admit` (any following group's `id_lo` is `<= u64::MAX`), and `admissible?` above
                // returns before this loop is reached. The saturation is therefore unreachable
                // rather than merely harmless.
                Some((_, hi)) if g.id_lo == hi.saturating_add(1) => *hi = g.id_hi,
                _ => ranges.push((g.id_lo, g.id_hi)),
            }
        }
        Ok(RowGroupSelection { total: self.groups.len(), kept, ranges })
    }

    /// Whether this index may serve a request, or the reason it may not.
    pub fn admits(
        &self,
        key: &RowGroupKey,
        validity: Option<&ValidityHeuristic>,
    ) -> std::result::Result<(), crate::index::IndexMiss> {
        if &self.key != key {
            return Err(crate::index::IndexMiss::KeyMismatch);
        }
        if !ValidityHeuristic::fail_closed_matches(self.validity.as_ref(), validity) {
            return Err(crate::index::IndexMiss::SourceChanged);
        }
        Ok(())
    }

    /// Build from the file's own parquet footer.
    ///
    /// **Read through DuckDB's `parquet_metadata()` on the connection this dataset already holds,
    /// and not through a second parquet reader.** Promoting the `parquet` crate to a non-optional
    /// dependency would put two footer readers in the shipped binary — DuckDB's, which executes the
    /// query, and the crate's, which decided what to prune — and two readers that can disagree about
    /// one footer is the wrong-but-plausible-answer hazard class ADR-010 rule 2 exists to prevent.
    /// It also costs no `Cargo.toml` change at all, which is what "zero new dependencies" was
    /// supposed to mean.
    ///
    /// One metadata query, cancellable: the query itself through the connection's interrupt handle,
    /// the reduction below through the token, at [`CANCEL_POLL_INTERVAL`].
    pub fn build(
        conn: &Connection,
        path: &str,
        covering: &CoveringBbox,
        id_column: &str,
        key: RowGroupKey,
        validity: Option<ValidityHeuristic>,
        cancel: &CancelToken,
        observer: Option<&dyn IndexPhaseObserver>,
    ) -> Result<Self> {
        let started = std::time::Instant::now();

        observe(observer, IndexPhase::RowGroupMetadata);
        cancel.attach(Arc::clone(&conn.interrupt_handle()))?;
        let scanned = Self::read_metadata(conn, path, covering, id_column, cancel);
        cancel.detach();
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }
        let (raw, scanned_metadata_rows) = scanned?;

        observe(observer, IndexPhase::RowGroupAdmissibility);
        let (groups, admissible) = Self::admit(raw, cancel)?;

        // Unconditional, after every phase — the discipline `index.rs`'s build ends with, and for
        // the same reason: a cadence bounds how long a cancel waits *inside* a phase and covers
        // none of the tail, so a cancelled build could otherwise return `Ok` and be cached.
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }

        Ok(Self {
            key,
            validity,
            total_groups: groups.len(),
            groups,
            admissible,
            build_millis: started.elapsed().as_secs_f64() * 1000.0,
            scanned_metadata_rows,
        })
    }

    /// One `parquet_metadata()` query, reduced to one row per row group.
    ///
    /// The five columns are selected by name and the file path is a bound parameter, so nothing here
    /// is assembled from a string a caller controls. `path_in_schema` for a struct child is reported
    /// by DuckDB as `"bbox, xmin"` — **comma and space, not a dot** — which is measured against this
    /// DuckDB rather than assumed from the parquet specification, and is asserted by this module's
    /// own test against a real file.
    #[allow(clippy::type_complexity)]
    fn read_metadata(
        conn: &Connection,
        path: &str,
        covering: &CoveringBbox,
        id_column: &str,
        cancel: &CancelToken,
    ) -> Result<(Vec<RawGroup>, u64)> {
        let sql = "SELECT row_group_id, row_group_num_rows, path_in_schema, stats_min_value, \
                   stats_max_value, stats_null_count FROM parquet_metadata(?)";
        let mut stmt = conn
            .prepare(sql)
            .map_err(|e| EngineError::Query(format!("row-group metadata prepare: {e}")))?;
        let mut rows = stmt
            .query([path])
            .map_err(|e| EngineError::Query(format!("row-group metadata: {e}")))?;

        let want_id = id_column.to_string();
        let want = [
            metadata_path(&covering.xmin),
            metadata_path(&covering.ymin),
            metadata_path(&covering.xmax),
            metadata_path(&covering.ymax),
        ];

        let mut by_group: HashMap<u32, RawGroup> = HashMap::new();
        let mut scanned = 0u64;
        let mut since_poll = 0usize;
        loop {
            if since_poll >= CANCEL_POLL_INTERVAL {
                since_poll = 0;
                if cancel.is_cancelled() {
                    return Err(EngineError::Cancelled);
                }
            }
            since_poll += 1;
            let Some(r) = rows
                .next()
                .map_err(|e| EngineError::Query(format!("row-group metadata row: {e}")))?
            else {
                break;
            };
            scanned += 1;
            let ordinal: i64 = r.get(0).map_err(col_err)?;
            let num_rows: i64 = r.get(1).map_err(col_err)?;
            let column: String = r.get(2).map_err(col_err)?;
            // `stats_min_value` / `stats_max_value` are VARCHAR and may be NULL. A NULL is a
            // *missing statistic*, which is a retention reason, never an error.
            let min: Option<String> = r.get(3).ok();
            let max: Option<String> = r.get(4).ok();
            // **`None` here means "this file does not say", and it is never read as "zero".** A
            // NULL identity that this index does not know about would fail
            // `source_col BETWEEN lo AND hi` and be dropped, while the plain scan reaches
            // `column_u64` and raises a typed refusal naming the null. That turns a loud failure
            // into a silently smaller result set, which is the one outcome an index that narrows
            // may never produce.
            let nulls: Option<i64> = r.get(5).ok();

            let ordinal = u32::try_from(ordinal).map_err(|_| {
                EngineError::Query(format!("row_group_id {ordinal} is not representable"))
            })?;
            // **Enforced while reading.** A file past the ceiling must not materialize its whole
            // footer first and then be told the limit — `MAX_INDEXED_FEATURES`'s own lesson.
            if !by_group.contains_key(&ordinal) && by_group.len() >= MAX_INDEXED_ROW_GROUPS {
                return Err(EngineError::CeilingExceeded {
                    ceiling: "MAX_INDEXED_ROW_GROUPS",
                    limit: MAX_INDEXED_ROW_GROUPS as u64,
                    saw: by_group.len() as u64 + 1,
                });
            }
            let g = by_group.entry(ordinal).or_insert_with(|| RawGroup {
                ordinal,
                rows: num_rows.max(0) as u64,
                id: None,
                id_nulls: None,
                bounds: [const { None }; 4],
            });
            if column == want_id {
                g.id = Some((min.clone(), max.clone()));
                g.id_nulls = nulls.map(|n| n.max(0) as u64);
            }
            for (i, w) in want.iter().enumerate() {
                if &column == w {
                    // xmin/ymin take the group's minimum; xmax/ymax take its maximum. The envelope
                    // is a **union over the group**, never one member's own min/max pair.
                    g.bounds[i] = match i {
                        0 | 1 => min.clone(),
                        _ => max.clone(),
                    };
                }
            }
        }
        if cancel.is_cancelled() {
            return Err(EngineError::Cancelled);
        }

        let mut out: Vec<RawGroup> = by_group.into_values().collect();
        out.sort_by_key(|g| g.ordinal);
        Ok((out, scanned))
    }

    /// Turn the raw footer rows into entries, and decide the file's admissibility once.
    fn admit(
        raw: Vec<RawGroup>,
        cancel: &CancelToken,
    ) -> Result<(Vec<RowGroupEntry>, std::result::Result<(), RowGroupRefusal>)> {
        if raw.is_empty() {
            return Ok((Vec::new(), Err(RowGroupRefusal::NoRowGroups)));
        }
        let mut entries = Vec::with_capacity(raw.len());
        let mut verdict: std::result::Result<(), RowGroupRefusal> = Ok(());
        let mut prev_hi: Option<u64> = None;

        for (i, g) in raw.iter().enumerate() {
            if i % CANCEL_POLL_INTERVAL == 0 && cancel.is_cancelled() {
                return Err(EngineError::Cancelled);
            }
            // --- the identity interval, which is what the injection is expressed in ---------------
            let (lo, hi) = match &g.id {
                Some((Some(lo), Some(hi))) => match (lo.parse::<u64>(), hi.parse::<u64>()) {
                    (Ok(lo), Ok(hi)) if lo <= hi => (lo, hi),
                    (Ok(_), Ok(_)) => {
                        verdict = verdict.and(Err(RowGroupRefusal::IdRangesUnordered));
                        (0, u64::MAX)
                    }
                    _ => {
                        verdict = verdict.and(Err(RowGroupRefusal::StatsUnparseable));
                        (0, u64::MAX)
                    }
                },
                _ => {
                    verdict = verdict.and(Err(RowGroupRefusal::IdStatsAbsent));
                    (0, u64::MAX)
                }
            };
            // **A null identity — or a file that does not say whether there is one — refuses.**
            // `column_u64` refuses a null identity downstream and is right to; what must not happen
            // is this index quietly excluding such a row with a range predicate, which is what
            // `BETWEEN` does to a NULL. `None` is "the file does not say", and unknown is refused
            // rather than read as zero: the fail-closed direction, the same one
            // `ValidityHeuristic::fail_closed_matches` takes.
            if g.id_nulls.is_none_or(|n| n > 0) {
                verdict = verdict.and(Err(RowGroupRefusal::IdStatsAbsent));
            }
            if let Some(p) = prev_hi {
                if lo <= p {
                    verdict = verdict.and(Err(RowGroupRefusal::IdRangesOverlap));
                }
            }
            prev_hi = Some(hi);

            // --- the envelope: any missing or unusable member retains the group -------------------
            // **The envelope is widened by one ulp on every side, deliberately.**
            //
            // These statistics arrive as VARCHAR and are parsed back to f64. Nothing in this tree
            // pins that DuckDB renders them with shortest-round-trip precision, and if a minimum
            // were ever rendered rounded *up*, the parsed envelope would be slightly **smaller**
            // than the group's true extent — and a group that genuinely intersects the viewport
            // could then be excluded. That is an error in the unsafe direction, in a module whose
            // whole doctrine is retention-on-unknown, so it is removed by construction rather than
            // by trusting a rendering. One ulp at LV95 magnitudes is ~5×10⁻¹⁰ m; it cannot cost a
            // prune that mattered, and it cannot lose a row.
            let mut env = [0.0f64; 4];
            let mut usable = true;
            for (k, s) in g.bounds.iter().enumerate() {
                match s.as_deref().map(str::parse::<f64>) {
                    Some(Ok(v)) if v.is_finite() => {
                        // 0 and 1 are the minima and widen downward; 2 and 3 are the maxima.
                        env[k] = if k < 2 { next_down(v) } else { next_up(v) };
                    }
                    // Not an error and not a refusal: an envelope this index cannot compare is one
                    // it may not exclude. Retention is the only safe direction.
                    _ => usable = false,
                }
            }
            if usable && (env[0] > env[2] || env[1] > env[3]) {
                usable = false;
            }
            entries.push(RowGroupEntry {
                ordinal: g.ordinal,
                rows: g.rows,
                id_lo: lo,
                id_hi: hi,
                envelope: usable.then_some(env),
            });
        }
        Ok((entries, verdict))
    }
}

/// What one viewport selected, in the terms a measurement needs.
#[derive(Clone, Debug, PartialEq, Eq)]
pub struct RowGroupSelection {
    pub total: usize,
    pub kept: usize,
    /// Row-group-aligned, ascending, non-overlapping. Empty only when no group survives.
    pub ranges: Vec<(u64, u64)>,
}

impl RowGroupSelection {
    /// Whether this selection would exclude any IO at all.
    ///
    /// **The distinction the whole lever turns on.** A selection that keeps every group is
    /// admissible, correct, and worthless — it re-states the scan as a longer statement. Naming it
    /// separately is what stops a cell reporting "pruning was in the path" when nothing was pruned.
    pub fn excludes_io(&self) -> bool {
        self.kept < self.total
    }
}

/// One row group's footer rows, before admissibility.
struct RawGroup {
    ordinal: u32,
    rows: u64,
    /// `(min, max)` of the identity column, each possibly absent.
    id: Option<(Option<String>, Option<String>)>,
    /// The identity column's null count, or `None` when the footer does not report one. **Not
    /// collapsed to zero** — see the refusal in `admit`.
    id_nulls: Option<u64>,
    /// `[xmin, ymin, xmax, ymax]` as reported, each possibly absent.
    bounds: [Option<String>; 4],
}

/// The next representable f64 below `v`, and above it. Used to widen a parsed envelope so a
/// rendering that rounded the wrong way cannot exclude a group. Written out rather than taken from
/// `f64::next_down`/`next_up`, which are newer than this workspace's declared toolchain floor.
fn next_down(v: f64) -> f64 {
    if v.is_nan() || v == f64::NEG_INFINITY {
        return v;
    }
    if v == 0.0 {
        return -f64::from_bits(1);
    }
    let bits = v.to_bits();
    f64::from_bits(if v > 0.0 { bits - 1 } else { bits + 1 })
}

fn next_up(v: f64) -> f64 {
    if v.is_nan() || v == f64::INFINITY {
        return v;
    }
    if v == 0.0 {
        return f64::from_bits(1);
    }
    let bits = v.to_bits();
    f64::from_bits(if v > 0.0 { bits + 1 } else { bits - 1 })
}

fn col_err(e: duckdb::Error) -> EngineError {
    EngineError::Query(format!("row-group metadata column: {e}"))
}

/// A covering-bbox path as `parquet_metadata` spells it.
///
/// **Measured against this DuckDB, not read from the parquet specification.** DuckDB reports a
/// struct child's `path_in_schema` as `"bbox, xmin"` — comma and space — where the file's own schema
/// path is `bbox.xmin`. Getting this wrong does not fail loudly: every group would simply have no
/// envelope, every group would be retained, and the lever would report a flawless null. The test
/// `metadata_paths_match_what_duckdb_reports` is what keeps that from being a silent result.
fn metadata_path(p: &FieldPath) -> String {
    p.0.join(", ")
}

/// A process-wide cache of built row-group indexes, keyed by source path.
///
/// **In-memory, per-process, never persisted** — see this module's header. The path is a *lookup*
/// key only; whether an entry may be **used** is decided by [`RowGroupIndex::admits`] against the
/// content hash, the builder version, the answered predicate and the fail-closed validity heuristic.
#[derive(Default)]
pub struct RowGroupCache {
    entries: std::sync::Mutex<HashMap<std::path::PathBuf, Arc<RowGroupIndex>>>,
}

impl RowGroupCache {
    pub fn get(
        &self,
        path: &std::path::Path,
        key: &RowGroupKey,
        validity: Option<&ValidityHeuristic>,
    ) -> std::result::Result<Arc<RowGroupIndex>, crate::index::IndexMiss> {
        let entries = self.entries.lock().unwrap_or_else(|e| e.into_inner());
        let found = entries.get(path).ok_or(crate::index::IndexMiss::Absent)?;
        found.admits(key, validity)?;
        Ok(Arc::clone(found))
    }

    pub fn insert(&self, path: std::path::PathBuf, index: Arc<RowGroupIndex>) {
        self.entries.lock().unwrap_or_else(|e| e.into_inner()).insert(path, index);
    }

    /// The content hash an entry for `path` was built from, if any. The hash is an *identity*, so
    /// reusing the recorded one is sound; what must be re-checked each time is the validity
    /// heuristic.
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

#[cfg(test)]
mod tests {
    use super::*;

    fn entry(ordinal: u32, id_lo: u64, id_hi: u64, env: Option<[f64; 4]>) -> RowGroupEntry {
        RowGroupEntry { ordinal, rows: id_hi - id_lo + 1, id_lo, id_hi, envelope: env }
    }

    fn index_of(groups: Vec<RowGroupEntry>) -> RowGroupIndex {
        RowGroupIndex {
            key: RowGroupKey::new("abc", "id"),
            validity: None,
            total_groups: groups.len(),
            groups,
            admissible: Ok(()),
            build_millis: 0.0,
            scanned_metadata_rows: 0,
        }
    }

    #[test]
    fn a_group_with_no_envelope_is_always_retained() {
        let idx = index_of(vec![
            entry(0, 0, 9, Some([0.0, 0.0, 1.0, 1.0])),
            entry(1, 10, 19, None),
            entry(2, 20, 29, Some([100.0, 100.0, 101.0, 101.0])),
        ]);
        let sel = idx
            .ranges_for(&Bbox { xmin: 0.0, ymin: 0.0, xmax: 1.0, ymax: 1.0 })
            .expect("admissible");
        // Group 2 is excluded on its envelope; group 1 has none and is kept regardless.
        assert_eq!(sel.kept, 2);
        assert_eq!(sel.ranges, vec![(0, 19)], "adjacent survivors merge into one range");
        assert!(sel.excludes_io());
    }

    #[test]
    fn surviving_groups_merge_only_when_contiguous() {
        let idx = index_of(vec![
            entry(0, 0, 9, Some([0.0, 0.0, 1.0, 1.0])),
            entry(1, 10, 19, Some([100.0, 100.0, 101.0, 101.0])),
            entry(2, 20, 29, Some([0.0, 0.0, 1.0, 1.0])),
        ]);
        let sel = idx
            .ranges_for(&Bbox { xmin: 0.0, ymin: 0.0, xmax: 1.0, ymax: 1.0 })
            .expect("admissible");
        assert_eq!(sel.ranges, vec![(0, 9), (20, 29)]);
        assert_eq!(sel.kept, 2);
    }

    #[test]
    fn keeping_every_group_is_admissible_and_excludes_nothing() {
        let idx = index_of(vec![
            entry(0, 0, 9, Some([0.0, 0.0, 10.0, 10.0])),
            entry(1, 10, 19, Some([0.0, 0.0, 10.0, 10.0])),
        ]);
        let sel = idx
            .ranges_for(&Bbox { xmin: 0.0, ymin: 0.0, xmax: 1.0, ymax: 1.0 })
            .expect("admissible");
        assert_eq!(sel.kept, sel.total);
        // The distinction the lever turns on: the plan is in force and prunes nothing.
        assert!(!sel.excludes_io());
    }

    #[test]
    fn a_viewport_this_index_will_not_reason_about_narrows_nothing() {
        let idx = index_of(vec![entry(0, 0, 9, Some([0.0, 0.0, 1.0, 1.0]))]);
        for bad in [
            Bbox { xmin: f64::NAN, ymin: 0.0, xmax: 1.0, ymax: 1.0 },
            Bbox { xmin: 5.0, ymin: 0.0, xmax: 1.0, ymax: 1.0 },
            Bbox { xmin: 0.0, ymin: 5.0, xmax: 1.0, ymax: 1.0 },
        ] {
            assert!(idx.ranges_for(&bad).is_err(), "{bad:?} should narrow nothing");
        }
    }

    #[test]
    fn overlapping_id_intervals_refuse_the_whole_file() {
        let raw = vec![
            RawGroup {
                ordinal: 0,
                rows: 10,
                id: Some((Some("0".into()), Some("20".into()))),
                id_nulls: Some(0),
                bounds: [Some("0".into()), Some("0".into()), Some("1".into()), Some("1".into())],
            },
            RawGroup {
                ordinal: 1,
                rows: 10,
                id: Some((Some("10".into()), Some("30".into()))),
                id_nulls: Some(0),
                bounds: [Some("0".into()), Some("0".into()), Some("1".into()), Some("1".into())],
            },
        ];
        let (_, verdict) = RowGroupIndex::admit(raw, &CancelToken::new()).expect("admit");
        assert_eq!(verdict, Err(RowGroupRefusal::IdRangesOverlap));
    }

    #[test]
    fn a_missing_identity_statistic_refuses_rather_than_guessing() {
        let raw = vec![RawGroup {
            ordinal: 0,
            rows: 10,
            id: Some((None, Some("20".into()))),
            id_nulls: Some(0),
            bounds: [Some("0".into()), Some("0".into()), Some("1".into()), Some("1".into())],
        }];
        let (_, verdict) = RowGroupIndex::admit(raw, &CancelToken::new()).expect("admit");
        assert_eq!(verdict, Err(RowGroupRefusal::IdStatsAbsent));
    }

    #[test]
    fn a_null_bearing_identity_column_refuses() {
        let raw = vec![RawGroup {
            ordinal: 0,
            rows: 10,
            id: Some((Some("0".into()), Some("9".into()))),
            id_nulls: Some(1),
            bounds: [Some("0".into()), Some("0".into()), Some("1".into()), Some("1".into())],
        }];
        let (_, verdict) = RowGroupIndex::admit(raw, &CancelToken::new()).expect("admit");
        assert_eq!(verdict, Err(RowGroupRefusal::IdStatsAbsent));
    }

    #[test]
    fn an_unparseable_bbox_statistic_retains_the_group_and_does_not_refuse_the_file() {
        let raw = vec![RawGroup {
            ordinal: 0,
            rows: 10,
            id: Some((Some("0".into()), Some("9".into()))),
            id_nulls: Some(0),
            bounds: [Some("nan".into()), Some("0".into()), Some("1".into()), Some("1".into())],
        }];
        let (entries, verdict) = RowGroupIndex::admit(raw, &CancelToken::new()).expect("admit");
        assert_eq!(verdict, Ok(()), "an unusable envelope is a retention, not a refusal");
        assert_eq!(entries[0].envelope, None);
    }

    #[test]
    fn the_answered_predicate_is_not_the_feature_indexs() {
        // The key exists so one cannot be served for the other. If these two strings were ever
        // equal, a row-group envelope could answer a question about a feature's own bbox.
        assert_ne!(ANSWERS_PREDICATE, crate::index::ANSWERS_PREDICATE);
    }
}
