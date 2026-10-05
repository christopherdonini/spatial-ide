// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

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
use std::sync::mpsc::{sync_channel, Receiver, RecvTimeoutError};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use arrow::array::{
    make_array, Array, ArrayRef, BinaryArray, BinaryViewArray, Int64Array, LargeBinaryArray,
    MutableArrayData, UInt64Array,
};
use arrow::datatypes::DataType;
use duckdb::ToSql;

use crate::cancel::CancelToken;
use crate::dataset::{lease_for_stream, Dataset};
use crate::envelope::{BatchEnvelope, TaggedBatch, ID_COLUMN};
use crate::error::{EngineError, Result};
use crate::geoarrow::build_polygon_array;
use crate::predicate::AdmittedPredicate;
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
///
/// **On the live projected stream alone** (route (a), Amendment 5 row 5.2 — every other plan,
/// publish's included, keeps main's own slice unconditionally and pays none of this), a batch's
/// attribute-carrying buffers are separately bounded by [`MAX_ATTRIBUTE_RETENTION_FACTOR`] (`flush`'s
/// retention rule, condition (3)): each attribute column retains at most `MAX_ATTRIBUTE_RETENTION_
/// FACTOR` × its own slice memory, **plus 64 bytes × the number of buffers it holds, its validity
/// buffer included** (Amendment 5 row 5.3 — `arrow-buffer` 58.4.0's own allocation multiple; a small
/// run's rounding-up can otherwise breach the plain factor on its own). Producer-resident payload for
/// the live projected stream is then `(MAX_QUEUED_BATCHES + 1)` batches under that bound, plus
/// DuckDB's current chunk, uncounted, as today.
pub const MAX_QUEUED_BATCHES: usize = 2;

/// **`flush`'s retention rule** (condition (3); B1 §2.3, §7), **narrowed to the live projected
/// stream alone** (route (a), Amendment 5 row 5.2). A single-run attribute slice is kept as a slice
/// — no copy — unless the buffers it retains (`ArrayData::get_buffer_memory_size`) exceed this
/// factor times its own memory (`ArrayData::get_slice_memory_size`, what a compacted copy would
/// occupy) plus 64 bytes per buffer it holds (Amendment 5 row 5.3: `arrow-buffer` 58.4.0's own
/// allocation multiple — without it a small run's rounding-up can breach the plain factor on its
/// own even when nothing is actually over-retained). Past that it is compacted by one copy, decided
/// after the cut.
///
/// **What "identical either way" now means, on the live projected stream.** H3's second clause is
/// false at `arrow-ipc` 58.4.0 for the cases observed, and no rule over offsets or lengths is
/// claimed beyond them: the IPC bytes of the slice and of its compacted copy differed for a
/// nullable `Utf8` slice carrying a NULL (Amendment 5, row 5.1, R-E1's probe) and for a non-null
/// `Boolean`'s values bitmap at offset/length 8/3, 0/10 and 40/20, and were equal at 3/5
/// (Amendment 8's class-2 row; pinned in the X6 test
/// `publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes`).
/// So this narrows to **decoded equality** — values, and validity within the array's length — never
/// byte identity, on this stream. **Every other plan (publish's included) never reaches
/// [`retain_or_compact_single_run`]'s compacting branch at all**: it keeps main's own single-run
/// arm, the slice with no copy, so its bytes equal main's by construction and no claim about IPC
/// byte identity is made for it, needed, or at risk. For publish that is proven through `flush` by
/// T1, `a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush`.
pub const MAX_ATTRIBUTE_RETENTION_FACTOR: usize = 2;

/// **Publish partition ceilings — declared, not discovered (ADR-010 rule 6).**
///
/// A published partition is **exactly one `TaggedBatch`**. That is the whole design and it is worth
/// stating as a decision rather than as an implementation detail: re-batching in the publisher —
/// concatenating IPC streams, or calling `RecordBatch::try_new` there — would produce partition
/// bytes that never passed through `TaggedBatch`'s single constructor, and the ADR-010 rule 1
/// envelope would then be on the partition by *care* rather than by construction.
///
/// The size ceiling is also what bounds cancellation — **but it is not, on its own, the bound the
/// consumer feels.** This comment used to end "the uninterruptible window is one partition's encode
/// and write", and the fifth section of `kernel/RESULTS.md` measured that window at a p95 of
/// 418.321 ms and an inter-partition cadence max of 999.924 ms against `docs/08`'s 100 ms. Two
/// things were missing from the sentence: a consumer blocked in [`BatchStream::next_into`] cannot
/// poll at all while the producer is quiet (see [`PUBLISH_STREAM_POLL_INTERVAL`]), and one
/// partition's *write* is not one uninterruptible act. The narrowed statement lives on
/// `PUBLISH_WRITE_CHUNK_BYTES` in `kernel/src/publish`, and it names the term that has no ceiling.
///
/// Progressive sizing is deliberately **not** used here: it exists for `docs/08`'s first-pixels
/// budget, nobody is waiting for a first pixel during a publish, and a fixed rule makes the
/// determinism argument short enough to audit.
pub const PUBLISH_PARTITION_TARGET_BYTES: usize = 1024 * 1024;

/// **The first batch's time budget — a *cut trigger*, never a delivery deadline.**
///
/// The first batch is cut at the first opportunity after this has elapsed **since the first source
/// row**, or at the size target, whichever comes first.
///
/// **What it does not bound, stated first because an earlier draft of this cut's brief said the
/// opposite.** The window before the first source row contains DuckDB's own fetch — an external
/// section this module neither times nor controls — so "the first batch is emitted at 8 ms" would be
/// a delivery deadline the code cannot honour. It is withdrawn for exactly the reason the
/// `262,144 B ÷ 10 MB/s` claim on `PUBLISH_WRITE_CHUNK_BYTES` and the acknowledgement reading of
/// [`PUBLISH_STREAM_POLL_INTERVAL`] were withdrawn: a bound that excludes an unbounded external
/// section is not a bound. **This value may never be quoted as "first batch within 8 ms of query
/// start."**
///
/// **Why 8 ms, derived rather than tuned.** It is about half a 60 Hz vsync interval, so a batch cut
/// at the budget can still make the next compositor tick. That is a presentation-model derivation;
/// no measurement is claimed for the value itself, and `docs/08`'s no-numbers-no-claim rule applies
/// to any assertion that it improved anything.
pub const FIRST_BATCH_TIME_BUDGET: Duration = Duration::from_millis(8);

/// Rows between clock reads inside the first batch. **Never per row.**
///
/// `trace.rs`'s hard rule — no `mark` inside the producer's row loop — is about cost, not about
/// tracing, so it applies with equal force to an `Instant::elapsed`. The row loop runs once per
/// feature (3.3 M times on the hero-slice fixture) and already carries a `SeqCst` load per row.
///
/// **The size of that cost is arithmetic, not a measurement, and is labelled as such** (`docs/08`:
/// no numbers, no claim). A Windows `QueryPerformanceCounter` is conventionally quoted in the tens
/// of nanoseconds; at 3.3 M rows, *any* per-row cost in that range is tens of milliseconds, against
/// a budget of 8. Nothing here measures QPC on this machine, and no figure derived from this comment
/// may be quoted as one — the point is only that the stride exists because the per-row alternative
/// is the wrong order of magnitude, which holds across the whole plausible range.
///
/// The clock is read at DuckDB chunk boundaries and at this stride **while the first batch is
/// accumulating**, and not at all thereafter.
pub const BUDGET_CHECK_ROW_STRIDE: usize = 256;

/// Rows per published partition, whichever ceiling binds first.
pub const PUBLISH_PARTITION_ROWS: usize = 8_192;
/// Partitions one bundle may contain. The zero-padded width of `data/part-NNNNN.arrows` is derived
/// from this, so raising it is a **format change** and not a tuning knob.
pub const MAX_PUBLISH_PARTITIONS: usize = 100_000;

/// **How long a publish consumer waits on the producer before polling its own cancellation
/// (ADR-010 rule 6).**
///
/// [`BatchStream::next_into`] blocks on the channel with no timeout, which is correct for a consumer
/// that has nothing else to do — but publish does: it holds the cancellation token that the operator
/// just used. While DuckDB sorts, the producer sends nothing, so every `check_cancel` in the publish
/// loop is unreachable and the operation cannot acknowledge anything. `kernel/RESULTS.md`'s fifth
/// section measured that as a **3,920 ms** window inside the sort, with the interrupt already armed:
/// the cancel had reached DuckDB, and the thread that had to *notice* was parked on a channel.
///
/// **Derived worst case, not hoped:** one interval, plus the host timer's rounding of a timed park.
/// The Windows default tick is 15.625 ms and `timeBeginPeriod` is a dependency this workspace does
/// not take, so that slop is a **declared floor, not a fixable**:
///
/// > 10 ms + 15.625 ms = **25.625 ms** before this loop next *looks*.
///
/// **That is a cadence, not an acknowledgement bound, and an earlier revision of this comment
/// claimed the latter. It is withdrawn for the same reason the `262,144 B ÷ 10 MB/s` claim on
/// `PUBLISH_WRITE_CHUNK_BYTES` was withdrawn.** Two terms it excludes:
///
/// - **The OS scheduler.** `recv_timeout` guarantees a *lower* bound on the park. Waking on time
///   requires the scheduler to run this thread, and on a machine saturated by a 5 GB publish that
///   is an unbounded external section — the very class this cadence may not be netted against.
/// - **The rest of the window.** "Pre-first-batch" also contains `pool.acquire`'s connection open
///   and PRAGMA configuration, a `create_dir`, and — when the producer wins the race and the stream
///   ends — a style file written and **fsynced** before the next check. None of those poll.
///
/// So: **the cadence is exact and this code controls it; the latency it produces is measured, never
/// derived.** The number above may be cited as "how often the loop looks" and never as a bound.
pub const PUBLISH_STREAM_POLL_INTERVAL: Duration = Duration::from_millis(10);

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
    /// A caller predicate, already an [`AdmittedPredicate`] by the time it reaches this struct.
    ///
    /// **`None` is "no predicate"** — the whole-file-or-viewport answer this type already had before
    /// this cut, unchanged in shape. Admitting the *text* (structural/namespace/bind checks) is not
    /// this crate's job today (see `predicate.rs`); this field only says where a validated predicate
    /// composes into `build_sql`'s `WHERE` clause once one exists.
    pub filter: Option<AdmittedPredicate>,
}

impl ViewportQuery {
    pub fn all() -> Self {
        Self {
            bbox: None,
            bbox_crs: None,
            limit: None,
            filter: None,
        }
    }

    pub fn viewport(bbox: Bbox, crs_identifier: impl Into<String>) -> Self {
        Self {
            bbox: Some(bbox),
            bbox_crs: Some(crs_identifier.into()),
            limit: None,
            filter: None,
        }
    }

    pub fn with_limit(mut self, n: u64) -> Self {
        self.limit = Some(n);
        self
    }

    /// Attach an admitted predicate. Builder-style, on the [`Self::with_limit`] precedent.
    pub fn with_filter(mut self, filter: AdmittedPredicate) -> Self {
        self.filter = Some(filter);
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
    /// **Which trigger ended this batch — reported, never inferred from its size.**
    ///
    /// The same doctrine as [`FilterPlan`] and [`ConnectionFacts`]: "the size target was reached"
    /// and "the time budget fired" produce a batch that looks similar from outside and are different
    /// facts, and a measurement that cannot tell them apart cannot say whether the budget ever ran.
    /// Without this the only way to answer "did lever A fire?" is to compare `payload_bytes` against
    /// `target_bytes` and guess, which is exactly the inference this field exists to remove.
    pub cut_by: BatchCut,
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

/// What ended one batch.
///
/// Four triggers, and they are not interchangeable: a reader of an artifact has to be able to say
/// which one produced a given batch without reasoning backwards from its size.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum BatchCut {
    /// The size ladder's target for this batch index was reached — including the pre-append cut
    /// that keeps one oversized feature from carrying an almost-full batch past the ceiling.
    SizeTarget,
    /// The policy's row ceiling was reached first.
    RowCeiling,
    /// [`FIRST_BATCH_TIME_BUDGET`] had elapsed since the first source row. **Only ever on batch 0**,
    /// and only under [`BatchCutPolicy::TimeBudgetedFirstBatch`].
    TimeBudget,
    /// The source ran out. The final batch of every stream carries this, whatever its size.
    StreamEnd,
}

impl BatchCut {
    pub fn as_str(self) -> &'static str {
        match self {
            Self::SizeTarget => "size-target",
            Self::RowCeiling => "row-ceiling",
            Self::TimeBudget => "time-budget",
            Self::StreamEnd => "stream-end",
        }
    }
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
    /// What may cut a batch: size alone, or size **or** the first batch's time budget.
    pub cut: BatchCutPolicy,
}

/// What is allowed to end a batch.
///
/// **A named enum and not a `bool`**, on the `IndexUse` / `AttributeMode` precedent: a reader of a
/// call site sees which policy is in force without knowing which way round a flag goes, and a third
/// policy later is a compile error at every construction site rather than a silent reinterpretation.
///
/// **Deliberately no `impl Default`.** `BatchSizePolicy::default()` names its variant explicitly, so
/// there is no way to acquire a cut policy by omission — which is what makes the publish path's
/// `SizeOnly` a decision recorded at the site rather than an inherited accident.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum BatchCutPolicy {
    /// The size ladder alone. Every boundary is a pure function of the row sequence and the
    /// declared ceilings — which is what ADR-017 §12's determinism guarantee rests on.
    SizeOnly,
    /// Batch 0 is additionally cut once [`FIRST_BATCH_TIME_BUDGET`] has elapsed since the first
    /// source row. Batches 1..n are unaffected and stay on the size ladder.
    TimeBudgetedFirstBatch,
}

impl BatchCutPolicy {
    /// The name a typed refusal and an artifact both use, so a measurement and an error cannot
    /// disagree about which policy ran.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::SizeOnly => "size-only",
            Self::TimeBudgetedFirstBatch => "time-budgeted-first-batch",
        }
    }
}

impl Default for BatchSizePolicy {
    fn default() -> Self {
        Self {
            first_target_bytes: FIRST_TARGET_BATCH_BYTES,
            growth_factor: BATCH_GROWTH_FACTOR,
            target_bytes: TARGET_BATCH_BYTES,
            min_bytes: MIN_BATCH_BYTES,
            max_rows: MAX_ROWS_PER_BATCH,
            // Named, not omitted. The budgeted policy is undecided — its preregistered gate has not
            // been answered — and shipping it as the default would prejudge that gate.
            cut: BatchCutPolicy::SizeOnly,
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
            // **ADR-017 §12.** A clock in the cut decision would make partition boundaries — and
            // therefore every partition hash and the manifest — a function of machine load. Stated
            // here *and* enforced in `stream_inner`, which refuses the combination outright: a
            // convention at one call site is not a guarantee, and the guarantee is what §12 needs.
            cut: BatchCutPolicy::SizeOnly,
        }
    }

    /// The viewport policy with the first batch's **time budget** armed.
    ///
    /// Measurement-only; reached through `Dataset::stream_budgeted_experimental` and no product
    /// path. Identical to [`Default`] in every size term — the budget is an *additional* cut
    /// trigger, never a replacement for the ladder — so a cell that differs between the two differs
    /// by the budget and by nothing else.
    pub fn time_budgeted() -> Self {
        Self {
            cut: BatchCutPolicy::TimeBudgetedFirstBatch,
            ..Self::default()
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

    // ---- lever B2: the row-group index (`crate::rowgroup`) --------------------------------------
    //
    // Four variants where a bool would do, because they are four different facts and the whole
    // point of this enum is that a timing can be *attributed* rather than inferred. In particular
    // `RowGroupsKeptAll` is the cell most likely to look like a regression — the plan ran, the
    // statement grew, nothing was excluded — and it has to be nameable for that to be reportable.
    /// Row-group envelopes excluded at least one group's IO.
    RowGroupsPruned {
        total: usize,
        kept: usize,
        ranges: usize,
    },
    /// The index was admissible and every group survived: the predicate is in the statement and
    /// **no IO was excluded**. Correct, and worth nothing.
    RowGroupsKeptAll { total: usize },
    /// The file's own statistics cannot support an id-range injection. The named refusal travels
    /// with the plan, because "no index" and "this file's layout refuses one" are different facts.
    RowGroupsNotPrunable {
        total: usize,
        reason: crate::rowgroup::RowGroupRefusal,
    },
    /// Surviving groups produced more ranges than one statement will carry.
    RowGroupsTooFragmented { total: usize, kept: usize },
    /// **No** row group's envelope intersects the viewport.
    ///
    /// No range predicate is emitted, and the omission is the point: an empty predicate — `WHERE
    /// 1=0`, or a range list with nothing in it — would make the index *decide* the result rather
    /// than narrow it, which ADR-006 says a pure transformation's cached output may not do. That
    /// exact encoding is what made every viewport query return zero rows in `index.rs`'s first
    /// design. The scan reaches the same empty answer from the file's own statistics.
    RowGroupsExcludeAll { total: usize },
}

impl FilterPlan {
    /// A short stable name for an artifact. Kept beside the variants so a harness and an error
    /// message cannot disagree about what a cell ran.
    pub fn as_str(self) -> &'static str {
        match self {
            Self::WholeFile => "whole-file",
            Self::IndexNarrowed { .. } => "index-narrowed",
            Self::ScanOnly => "scan-only",
            Self::IndexTooFragmented { .. } => "index-too-fragmented",
            Self::RowGroupsPruned { .. } => "row-groups-pruned",
            Self::RowGroupsKeptAll { .. } => "row-groups-kept-all",
            Self::RowGroupsNotPrunable { .. } => "row-groups-not-prunable",
            Self::RowGroupsTooFragmented { .. } => "row-groups-too-fragmented",
            Self::RowGroupsExcludeAll { .. } => "row-groups-exclude-all",
        }
    }

    /// Whether this plan **injected a predicate intended to exclude IO**. Never evidence that IO was
    /// actually excluded — that is a read-volume measurement and this is a statement about what was
    /// built.
    ///
    /// **`RowGroupsExcludeAll` is deliberately excluded from this**, though it is the arm where the
    /// most IO is unnecessary. It emits no range predicate at all — by design, because an empty
    /// predicate would make the index decide — so the statement it produced is byte-for-byte the
    /// scan's. Counting it here would put "the index excluded IO" in an artifact for a query in
    /// which the index injected nothing.
    pub fn claims_io_exclusion(self) -> bool {
        matches!(self, Self::RowGroupsPruned { .. })
    }
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
    /// The **row-group** seam (lever B2), reached only through
    /// `Dataset::stream_rowgroup_pruned_experimental`. A third variant rather than a second boolean:
    /// the two seams consult different structures answering different predicates, and a plan that
    /// could reach both would have to decide which one wins, which is a design nobody has made.
    RowGroups,
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
    /// **`flush`'s retention rule (condition (3); §7), narrowed to the live projected stream alone
    /// (Amendment 5, row 5.2 — route (a)).** H3's second clause is false at `arrow-ipc` 58.4.0 where
    /// a sliced bitmap's padding bits differ between the slice and its compacted copy: observed for
    /// a nullable `Utf8` run carrying a NULL (Amendment 5, row 5.1, R-E1) and for a non-null
    /// `Boolean`'s values bitmap (Amendment 8's class-2 row). A publish partition's bytes are
    /// declared unchanged (§5) and must equal main's by construction, so `stream_for_publish`'s plan
    /// — and every other plan — keeps main's own single-run arm (the slice, no copy) regardless of
    /// this flag. Only
    /// [`Dataset::stream_projected_with_cancel`]'s plan sets this `true`.
    pub(crate) compact_attribute_retention: bool,
}

impl StreamPlan {
    /// The **publish** stream's plan, [`Dataset::stream_for_publish`]'s own, over `envelope` (the
    /// dataset's envelope widened by the admitted projection). One constructor, so the retention
    /// this plan declares is the one the X6 test
    /// (`publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes`)
    /// reads, never a literal of its own.
    fn for_publish(envelope: BatchEnvelope) -> Self {
        StreamPlan {
            index_use: IndexUse::Off,
            ordering: RowOrdering::ByIdentityAscending,
            policy: BatchSizePolicy::publish(),
            envelope,
            report_bounds: true,
            // **Route (a) (Amendment 5, row 5.2).** Publish keeps main's own single-run arm —
            // the slice, no copy — so publish bytes equal main's by construction. See
            // `StreamPlan::compact_attribute_retention`'s own doc.
            compact_attribute_retention: false,
        }
    }
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
    /// What the **post-check** found, if it found a change (§13 C). Set on the producer thread
    /// after the iterator is drained and the lease released; read by the host after the terminal.
    ///
    /// **It exists because rule (ii) needs it.** A cancelled stream keeps its `cancelled` terminal,
    /// so on that path the change cannot ride the terminal — but the dataset-session generation
    /// still has to end. This is the record that makes both true at once. It carries the
    /// components that differed, never a generation value (A2).
    source_changed_detail: Mutex<Option<String>>,
    /// Footer bytes the **post-check** read, bounded by
    /// [`crate::descriptor::FOOTER_DESCRIPTOR_MAX_BYTES`] (8 MiB).
    ///
    /// **Reported so the post-check's cost is never silent** (the human's ruling of 2026-09-16,
    /// round 5 item 3), on the stats that already travel with a stream's terminal. It is a byte
    /// count, not a duration, and nothing anywhere claims a duration from it.
    post_check_bytes_read: AtomicU64,
}

impl StreamStats {
    fn record_post_check_bytes(&self, bytes: u64) {
        self.post_check_bytes_read.store(bytes, Ordering::SeqCst);
    }

    /// Footer bytes the post-check read for this stream, bounded by
    /// [`crate::descriptor::FOOTER_DESCRIPTOR_MAX_BYTES`]. `0` before the post-check has run, and
    /// `0` when the source could not be re-read at all.
    ///
    /// **No longer an instrument accessor: it is product-called.** It was declared under the
    /// exemption while its only caller was a test; that declaration is retired, because two product
    /// call sites now read it, both in `kernel/src/lib.rs`'s `EngineSource`:
    /// `Drop::drop` fills `StreamConnectionRecord::post_check_bytes_read` (consumed by
    /// `kernel/src/main.rs`'s connection reporter, which prints it), and
    /// `end_session_if_source_changed` puts the same figure on the always-on `session ended for
    /// dataset` line. The exemption is for accessors with no product caller; this one has two, so
    /// it stands on the plain caller rule instead.
    ///
    /// Still not `cfg(test)`-gated, for the reason `SourceDescriptor::footer_bytes_read` is not:
    /// the obligation is that the *shipped* build reports this cost.
    ///
    /// `engine::trace`'s `POST_CHECK_END` carries the same figure, but **only in a traced run** —
    /// `trace::ENABLED` is `false` by default and `trace::start` has no product caller — so the
    /// trace marks are not what discharges "never silent"; the two kernel-side carriers above are.
    pub fn post_check_bytes_read(&self) -> u64 {
        self.post_check_bytes_read.load(Ordering::SeqCst)
    }

    fn record_source_changed(&self, detail: &str) {
        *self
            .source_changed_detail
            .lock()
            .unwrap_or_else(|e| e.into_inner()) = Some(detail.to_string());
    }

    /// The post-check's finding for this stream, or `None` if it found no change. Meaningful only
    /// once the stream has reached its terminal — before that the post-check has not run.
    pub fn source_changed_detail(&self) -> Option<String> {
        self.source_changed_detail
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .clone()
    }

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
    cut_by: BatchCut,
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

/// What a bounded wait on the producer found.
///
/// `WouldBlock` is the state [`BatchStream::next_into`] cannot express and the one publish needs:
/// **the producer is busy and has sent nothing yet**. It is not an error and not an end — it is the
/// caller getting its thread back so it can poll the cancellation it holds.
#[derive(Debug)]
pub enum BatchPoll {
    /// A batch was serialized into `out`, or the stream failed terminally.
    Ready(Result<BatchInfo>),
    /// The stream is over. Same meaning as `next_into`'s `None`.
    Ended,
    /// The wait elapsed with no batch. **Nothing was consumed and nothing was written to `out`** —
    /// calling again is always safe and never loses a batch.
    WouldBlock,
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
            Ok(Ok(item)) => Some(self.absorb(item, out)),
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

    /// As [`next_into`](Self::next_into), but gives the thread back after `wait` if the producer has
    /// sent nothing.
    ///
    /// **Why this exists, in one sentence:** a consumer that holds a cancellation token must be able
    /// to look at it, and `recv()` denies it that for as long as the producer is quiet — which for a
    /// publish with an `ORDER BY` is the entire sort.
    ///
    /// The wait is a *lower* bound on the park, never an upper one; see
    /// [`PUBLISH_STREAM_POLL_INTERVAL`] for the derived worst case including timer rounding.
    /// `WouldBlock` consumes nothing, so a caller may poll as often as it likes without losing a
    /// batch or perturbing the producer — the demand signal is the bounded channel's free slot, and
    /// a timed-out receive does not take one.
    pub fn next_into_timeout(&mut self, out: &mut Vec<u8>, wait: Duration) -> BatchPoll {
        if self.finished {
            return BatchPoll::Ended;
        }
        match self.rx.recv_timeout(wait) {
            Ok(Ok(item)) => BatchPoll::Ready(self.absorb(item, out)),
            Ok(Err(e)) => {
                self.finished = true;
                BatchPoll::Ready(Err(e))
            }
            Err(RecvTimeoutError::Timeout) => BatchPoll::WouldBlock,
            Err(RecvTimeoutError::Disconnected) => {
                self.finished = true;
                BatchPoll::Ended
            }
        }
    }

    /// The one place a received item becomes a `BatchInfo`, shared by both receive paths so a
    /// bounded wait and an unbounded one cannot drift into accounting resident bytes differently.
    fn absorb(&mut self, item: Item, out: &mut Vec<u8>) -> Result<BatchInfo> {
        self.stats.sub_resident(item.est_bytes);
        let before = out.len();
        if let Err(e) = item.batch.write_ipc_into(out) {
            self.finished = true;
            return Err(e);
        }
        Ok(BatchInfo {
            rows: item.batch.num_rows(),
            vertices: item.vertices,
            payload_bytes: out.len() - before,
            batch_index: item.batch_index,
            target_bytes: item.target_bytes,
            xy_bounds: item.xy_bounds,
            cut_by: item.cut_by,
        })
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
        // `cancel_for_drop`, not `cancel`: this fires on *every* drop, a completed stream
        // included, so stamping a cancellation instant here would record a request in an
        // operation nobody cancelled. See `CancelToken::cancel_for_drop`.
        self.cancel.cancel_for_drop();
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
    pub fn stream_with_cancel(
        &self,
        q: &ViewportQuery,
        cancel: CancelToken,
    ) -> Result<BatchStream> {
        self.stream_inner(
            q,
            cancel,
            StreamPlan {
                index_use: IndexUse::Off,
                ordering: RowOrdering::Unordered,
                policy: BatchSizePolicy::default(),
                envelope: self.envelope().clone(),
                report_bounds: false,
                compact_attribute_retention: false,
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
        attributes: &crate::attributes::AdmittedProjection,
        cancel: CancelToken,
    ) -> Result<BatchStream> {
        let envelope = BatchEnvelope::with_attributes(
            self.crs().clone(),
            self.geometry_column().to_string(),
            self.identity().clone(),
            attributes.fields().to_vec(),
        );
        self.stream_inner(q, cancel, StreamPlan::for_publish(envelope))
    }

    /// Resolve a caller's projection to the fields the stream will actually emit.
    ///
    /// Types come from the dataset's own schema, which is DuckDB's arrow schema for this file, so
    /// the declared fields cannot disagree with the arrays the producer hands over. Nullability is
    /// **not** taken from the source — see `attributes::admit_projection`.
    ///
    /// **Publish's own entry point.** Every refusal [`crate::attributes::admit_projection`] can
    /// produce is a [`crate::attributes::ProjectionError`]; this wraps it into the crate's ordinary
    /// [`EngineError`] via `impl From<ProjectionError> for EngineError`, which is publish's own
    /// texts, kept byte for byte (O1, O2). The live `viewport_query` path does not call this — it
    /// calls [`Self::admit_projection`] directly, so the kernel keeps the typed
    /// [`crate::attributes::ProjectionError`] apart for its own six-code wire mapping.
    pub fn resolve_projection(
        &self,
        names: &[String],
    ) -> Result<crate::attributes::AdmittedProjection> {
        self.admit_projection(names).map_err(EngineError::from)
    }

    /// As [`Self::resolve_projection`], returning the typed [`crate::attributes::ProjectionError`]
    /// rather than folding it into [`EngineError`] — the live `viewport_query` path's own entry
    /// point (`kernel::skp::build_viewport_query`), which needs the variant apart to pick one of six
    /// typed SKP codes (`kernel::skp::projection_error_of`).
    pub fn admit_projection(
        &self,
        names: &[String],
    ) -> std::result::Result<
        crate::attributes::AdmittedProjection,
        crate::attributes::ProjectionError,
    > {
        crate::attributes::admit_projection(
            names,
            self.file_schema().fields(),
            self.geometry_column(),
            self.identity().source().source_column(),
        )
    }

    /// The **live projected** stream (Brief B stage B1): a declared attribute projection over the
    /// ordinary viewport plan — `IndexUse::Off`, unordered, the default batch-size policy, and no
    /// per-batch bounds report. Everything else is [`Self::stream_with_cancel`]'s.
    ///
    /// Deliberately its own entry point, on [`Self::stream_for_publish`]'s own precedent: a reader
    /// of a call site sees which discipline is in force without a flag to interpret, and the
    /// unprojected path (`columns: null`) cannot acquire a widened schema by accident. Its product
    /// caller is `kernel::open_engine_stream`, with a non-empty admitted projection.
    pub fn stream_projected_with_cancel(
        &self,
        q: &ViewportQuery,
        projection: &crate::attributes::AdmittedProjection,
        cancel: CancelToken,
    ) -> Result<BatchStream> {
        let envelope = BatchEnvelope::with_attributes(
            self.crs().clone(),
            self.geometry_column().to_string(),
            self.identity().clone(),
            projection.fields().to_vec(),
        );
        self.stream_inner(
            q,
            cancel,
            StreamPlan {
                index_use: IndexUse::Off,
                ordering: RowOrdering::Unordered,
                policy: BatchSizePolicy::default(),
                envelope,
                report_bounds: false,
                // **The only plan this is `true` for (Amendment 5, row 5.2).** Route (a) narrows
                // §2.3's retention rule to the live projected stream alone.
                compact_attribute_retention: true,
            },
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
                compact_attribute_retention: false,
            },
        )
    }

    /// The same query with the **first batch's time budget** armed.
    ///
    /// **Experimental and measurement-only. No product path calls this**, on the
    /// `stream_indexed_experimental` precedent and for the same reason: the budgeted policy's
    /// preregistered gate has not been answered, and a policy that reached the default planner
    /// before its gate would make the gate ceremonial.
    ///
    /// What it changes is one thing — batch 0 may be cut by [`FIRST_BATCH_TIME_BUDGET`] as well as
    /// by size. Everything else, the size ladder included, is `Dataset::stream`'s.
    #[doc(hidden)]
    pub fn stream_budgeted_experimental(
        &self,
        q: &ViewportQuery,
        cancel: CancelToken,
    ) -> Result<BatchStream> {
        self.stream_inner(
            q,
            cancel,
            StreamPlan {
                index_use: IndexUse::Off,
                ordering: RowOrdering::Unordered,
                policy: BatchSizePolicy::time_budgeted(),
                envelope: self.envelope().clone(),
                report_bounds: false,
                compact_attribute_retention: false,
            },
        )
    }

    /// The same query planned with the **row-group index** in the path (lever B2).
    ///
    /// **Experimental and measurement-only. No product path calls this**, and its preregistered
    /// gate has not been answered — `docs/07`'s "an index that prunes actual IO is a separate,
    /// architect-first design with its own preregistered gate; no claim is made for it here."
    ///
    /// Requires [`Dataset::build_row_group_index`] to have run in this process for this file. When
    /// no admissible index exists the plan is [`FilterPlan::ScanOnly`] and the query is exactly the
    /// unindexed one — a missing index narrows nothing and must not fail a query.
    #[doc(hidden)]
    pub fn stream_rowgroup_pruned_experimental(
        &self,
        q: &ViewportQuery,
        cancel: CancelToken,
    ) -> Result<BatchStream> {
        self.stream_inner(
            q,
            cancel,
            StreamPlan {
                index_use: IndexUse::RowGroups,
                ordering: RowOrdering::Unordered,
                policy: BatchSizePolicy::default(),
                envelope: self.envelope().clone(),
                report_bounds: false,
                compact_attribute_retention: false,
            },
        )
    }

    /// As [`Self::stream_rowgroup_pruned_experimental`], with the first batch's time budget armed —
    /// the factorial cell where **both** levers are in force.
    ///
    /// It exists because the measurement is factorial and a cell that cannot be constructed cannot
    /// be measured; it is not a policy anybody has proposed shipping.
    #[doc(hidden)]
    pub fn stream_rowgroup_pruned_budgeted_experimental(
        &self,
        q: &ViewportQuery,
        cancel: CancelToken,
    ) -> Result<BatchStream> {
        self.stream_inner(
            q,
            cancel,
            StreamPlan {
                index_use: IndexUse::RowGroups,
                ordering: RowOrdering::Unordered,
                policy: BatchSizePolicy::time_budgeted(),
                envelope: self.envelope().clone(),
                report_bounds: false,
                compact_attribute_retention: false,
            },
        )
    }

    fn stream_inner(
        &self,
        q: &ViewportQuery,
        cancel: CancelToken,
        plan: StreamPlan,
    ) -> Result<BatchStream> {
        let StreamPlan {
            index_use,
            ordering,
            policy,
            envelope,
            report_bounds,
            compact_attribute_retention,
        } = plan;

        // **The ADR-017 §12 protection, and it is structural rather than conventional.**
        //
        // A declared row order exists so that partition boundaries — and therefore every partition
        // hash and the manifest — are a pure function of the row sequence and the declared
        // ceilings. A time budget in the cut decision makes them a function of how fast the machine
        // was, so the same inputs would publish differently under load. Refusing the combination
        // here means "publish partitioning is independent of stream batching" is a property of the
        // code, checkable at one place, rather than a convention spread across call sites.
        //
        // Checked before anything is prepared, leased or spawned: a refusal that costs a connection
        // is a refusal that had a side effect.
        if is_timing_dependent(ordering, policy.cut) {
            return Err(EngineError::TimingDependentOrdering {
                ordering: "by-identity-ascending",
                cut: policy.cut.as_str(),
            });
        }
        // **R-D2's pre-check — "before every query issue", and this is that point.** Every stream
        // entry point funnels through `stream_inner`, so one call here is every query issue and not
        // a set of call sites that can drift apart. Placed beside the check above and for the same
        // reason: before anything is prepared, leased or spawned, so a refusal costs no connection.
        //
        // It is not a snapshot check. It says the file is no longer the one that opened, or it says
        // nothing (boundary 4; A1).
        self.check_source_unchanged()?;
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
        // Stamped on the caller's thread, before a lease exists — `sql_built` is outside the
        // `lease_to_first_row` window by construction (`SPAN_LEASE_BIND` reports the gap to
        // `lease_acquired` rather than folding it into any scored segment; see docs/07's scope
        // bound in `trace.rs`).
        crate::trace::mark(crate::trace::SQL_BUILT, 0, 0);
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
        // Stamped on the caller's thread, before the producer starts — the same place the token is
        // bound to the connection, which is what makes this the boundary a trace wants.
        // `0, 0` — **not** the physical id and lease generation. Those fields are declared as
        // `rows` and `bytes` on `Event`, and review caught an artifact reading `"rows":1,"bytes":2`
        // for connection 1 generation 2: any summarizer summing rows or bytes across events would
        // have got a wrong number with nothing raised. The identity belongs to `TraceKey`, which is
        // where it already is.
        crate::trace::mark(crate::trace::LEASE_ACQUIRED, 0, 0);
        let geometry_column = self.geometry_column().to_string();
        let stats = Arc::new(StreamStats::default());
        let (tx, rx) = sync_channel::<std::result::Result<Item, EngineError>>(MAX_QUEUED_BATCHES);

        let bbox = q.bbox;
        let limit = q.limit;
        let thread_stats = Arc::clone(&stats);
        let thread_cancel = cancel.clone();
        let thread_env = envelope.clone();
        // Captured for the post-check below: the descriptor this dataset **opened** against, and
        // the path to re-read. Cloned rather than borrowed because the producer thread outlives
        // this call — and it is the open-time descriptor, never a fresh one, that the comparison is
        // against.
        let post_check_descriptor = self.descriptor().clone();
        let post_check_path = self.path().to_path_buf();

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
                    compact_attribute_retention,
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
                //
                // **The lease is decided here and the terminal is NOT sent here.** The two used to
                // happen in one `match`, which put `tx.send(Err(e))` before the post-check below —
                // so a host reading the post-check's flag when the terminal arrived raced the
                // producer still computing it (P3 gate attempt 1, blocking finding 2). Splitting
                // them costs nothing and removes the race by construction: by the time any terminal
                // leaves this thread, the flag is already written.
                match &outcome {
                    Ok(()) => lease.release_healthy(),
                    Err(_) => drop(lease),
                }

                // ---------------------------------------------------------------------------
                // **R-D2's post-check — `ADMISSION-PREREGISTRATION.md` §13 C's named call site.**
                //
                // `produce` above has returned, so DuckDB's result iterator is fully drained; the
                // `match` above has decided the lease, so the lease is released; and **no terminal
                // of any class has been sent yet** — for the `Ok` path the terminal is the drop of
                // `tx` at the end of this closure, and for every error path it is the `tx.send`
                // below this block. That is what "before the terminal" means, for all of them.
                //
                // **Never inside the batch loop** (§13 C): a per-batch descriptor read would put
                // filesystem work on the data path (docs/10) and would multiply one refusal into
                // many.
                //
                // (i) On a clean run the terminal is `ok` **only if** the post-check finds no
                //     change; otherwise the terminal *is* the typed `engine.source_changed`, sent
                //     here.
                // (ii) A **cancelled** stream keeps its `cancelled` terminal (ADR-018 vocabulary).
                //     The check still runs and still records the change — that is what invalidates
                //     the dataset-session generation — but a cancel is never reported as a source
                //     change. The same holds for any other terminal error: it already happened and
                //     it is what the caller needs to see, so the change rides the recorded flag
                //     rather than displacing it.
                // (iii) A change caught only here is exactly boundary 4's declared limit, and the
                //     refusal's own text says so: "may detect a change during a query only after
                //     that query has finished reading" (`EngineError::SourceChanged`'s `Display`).
                //     Nothing anywhere claims the batches already delivered were a snapshot (A1).
                // **The post-check's cost is reported, never silent** (the human's ruling of
                // 2026-09-16, round 5 item 3). The marks bound the interval in the session log; the
                // bytes come from the read the post-check already performed — counting them by
                // re-reading would have doubled the very cost this reports — and ride both
                // `POST_CHECK_END`'s `bytes` field and `StreamStats`, where a stream's terminal
                // stats already travel. The read is bounded by `FOOTER_DESCRIPTOR_MAX_BYTES`.
                // **No duration is claimed here or anywhere else**; measuring the interval is P5's.
                crate::trace::mark(crate::trace::POST_CHECK_BEGIN, 0, 0);
                let (post, post_check_bytes) =
                    post_check_source(&post_check_path, &post_check_descriptor);
                crate::trace::mark(crate::trace::POST_CHECK_END, 0, post_check_bytes);
                thread_stats.record_post_check_bytes(post_check_bytes);
                if let Err(EngineError::SourceChanged { detail }) = &post {
                    // Recorded **before any terminal is sent**, so a host that reads this flag when
                    // a terminal arrives always sees a finished answer — on the clean, the errored
                    // and the cancelled path alike (rule ii).
                    thread_stats.record_source_changed(detail);
                }

                // Now, and only now, the terminal.
                match outcome {
                    // Rule (i): `ok` only if the post-check found no change; otherwise the terminal
                    // *is* the typed `engine.source_changed`. On the no-change path nothing is sent
                    // and the terminal is the drop of `tx` below.
                    Ok(()) => {
                        if let Err(e) = post {
                            let _ = tx.send(Err(e));
                        }
                    }
                    // Rule (ii): the stream's own terminal stands — a cancel is reported as a
                    // cancel, and any other failure as itself. The source change rides the flag
                    // recorded above, never this frame.
                    //
                    // Best-effort: if the consumer is gone there is nobody to tell, which is not an
                    // error in itself. H7's "no partial view presented as complete" is enforced on
                    // the consumer side by the terminal frame, not by this send succeeding.
                    Err(e) => {
                        let _ = tx.send(Err(e));
                    }
                }

                // **Stamped here, below the lease's fate, and the position is the whole point.**
                // This is the producer's `cancel_acknowledged`, and
                // `kernel/CANCELLATION-AND-TRACING.md` §3 classifies DuckDB connection teardown as
                // an unbounded class-(b) term on the cancel path. An earlier revision stamped it
                // *above* the `detach` and the `match` — review measured it at 33 µs after the last
                // batch, i.e. covering none of the teardown, so any acknowledgement figure derived
                // from it would have systematically excluded the term the taxonomy says dominates.
                //
                // **The post-check sits inside this window, and it is the UNBUDGETED one.**
                // `PRODUCER_FINISHED` is the producer's `cancel_acknowledged` — the
                // operation-quiescent instant (`trace.rs:363`'s own table: "`cancel_acknowledged`
                // (the operation quiescent)… | [`PRODUCER_FINISHED`]"). `docs/08:8` budgets
                // `cancel_requested → cancel_observed` and reports the quiescent term "beside it
                // with no budget", and `cancel_observed` on this side is `PRODUCER_CANCELLED`,
                // stamped inside `produce()` — **before** the R-D2 post-check above. So the
                // post-check does not enter the budgeted term at all; it lands in the unbudgeted
                // quiescent one, as a bounded metadata read plus a footer read bounded by
                // `FOOTER_DESCRIPTOR_MAX_BYTES`.
                //
                // No figure is claimed for it and none is implied. It is recorded so that a
                // measurement of the quiescent term knows the term is there — **P5's** to make.
                crate::trace::mark(crate::trace::PRODUCER_FINISHED, 0, 0);
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

        // **The caller's predicate, verbatim, wrapped in exactly the one added paren pair the
        // design note (`NEXT-CUT.md`) describes.** Never rewritten, normalized, or case-folded —
        // whatever `AdmittedPredicate` carries is what reaches DuckDB. `AdmittedPredicate` itself
        // establishes nothing about admission (see `predicate.rs`); this line only composes it.
        let filter_clause: Option<String> =
            q.filter.as_ref().map(|f| format!("({})", f.sql_text()));

        // Opens this statement's `WHERE` clause. **The caller's predicate is always leftmost when
        // one exists** — `NEXT-CUT.md`'s composition rule — and every condition this plan itself
        // contributes (bbox, and any `FilterPlan` range predicate) is `AND`-appended after it, never
        // the reverse. Without a filter this opens exactly the clause the plan already built before
        // this cut. Callers append their own condition text immediately after calling this.
        let open_where = |sql: &mut String| {
            sql.push_str(" WHERE ");
            if let Some(f) = &filter_clause {
                sql.push_str(f);
                sql.push_str(" AND ");
            }
        };

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
                detail: self.no_covering_bbox_detail(""),
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
            // **The regime that sentence holds in, added by the seventh section rather than
            // withdrawn.** "DuckDB still scans" was true of the fixture the second section measured,
            // which had a **single row group** and so had nothing to prune. On a multi-row-group
            // file it does not hold: the seventh section measured a quarter-extent query reading
            // **51.8 %** of a 13-row-group file with no index in the path, because DuckDB's own zone
            // maps skip six groups on the covering-bbox statistics. The conclusion is unchanged and
            // its reason is stronger — an index over the same statistics is redundant there, and the
            // row-group candidate in `crate::rowgroup` measured **exactly zero** bytes of additional
            // IO exclusion in four of four viewports.
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
            // ---------------------------------------------------------------------------------
            // **Lever B2 — the row-group seam.** A separate block, not a third arm of the
            // feature-index match, because it injects a fundamentally different predicate: the
            // ranges here are **row-group aligned**, so a range never excludes a row inside a group
            // it names. That is what makes the injection a statement about IO rather than about
            // rows, and it is the whole difference from the fixed-grid index the second section
            // measured.
            //
            // **The bbox comparison stays alongside, exactly as it does for the other seam**, and
            // for the identical reason: it keeps the result set provably identical to the
            // unindexed one, so a wrong index costs time and never correctness (ADR-006 — a pure
            // transformation's cached output is not the system of record).
            // ---------------------------------------------------------------------------------
            if index_use == IndexUse::RowGroups {
                match self.admitted_row_groups() {
                    // No index has been built for this file, or the cached one may no longer
                    // serve it. Falling through to the scan is the only safe reading.
                    None => plan = FilterPlan::ScanOnly,
                    Some(idx) => match idx.ranges_for(view) {
                        Err(reason) => {
                            plan = FilterPlan::RowGroupsNotPrunable {
                                total: idx.total_groups(),
                                reason,
                            }
                        }
                        Ok(sel) if sel.kept == 0 => {
                            plan = FilterPlan::RowGroupsExcludeAll { total: sel.total }
                        }
                        Ok(sel) if !sel.excludes_io() => {
                            // Admissible, in force, and excluding nothing. Named rather than
                            // rendered as a longer statement that does the same work.
                            plan = FilterPlan::RowGroupsKeptAll { total: sel.total }
                        }
                        Ok(sel) if sel.ranges.len() > crate::rowgroup::MAX_ROW_GROUP_RANGES => {
                            plan = FilterPlan::RowGroupsTooFragmented {
                                total: sel.total,
                                kept: sel.kept,
                            }
                        }
                        Ok(sel) => {
                            // **The source column, never the `id` alias** — the measured DuckDB
                            // resolution finding this file records twenty lines down.
                            let col = source_column.clone();
                            let preds: Vec<String> = sel
                                .ranges
                                .iter()
                                .map(|(lo, hi)| {
                                    if lo == hi {
                                        format!("{col} = {lo}")
                                    } else {
                                        format!("{col} BETWEEN {lo} AND {hi}")
                                    }
                                })
                                .collect();
                            plan = FilterPlan::RowGroupsPruned {
                                total: sel.total,
                                kept: sel.kept,
                                ranges: sel.ranges.len(),
                            };
                            open_where(&mut sql);
                            sql.push_str(&format!("({})", preds.join(" OR ")));
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
                    },
                }
                // Every arm that reaches here emits the plain covering-bbox scan below, with the
                // plan recording *why* no range predicate was injected.
                open_where(&mut sql);
                sql.push_str(&format!(
                    "{xmin} <= ? AND {xmax} >= ? AND {ymin} <= ? AND {ymax} >= ?",
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

            let admitted = match index_use {
                IndexUse::Off | IndexUse::RowGroups => None,
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
                        open_where(&mut sql);
                        sql.push_str(&format!("({})", preds.join(" OR ")));
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
                    None => {
                        plan = FilterPlan::IndexTooFragmented {
                            candidates: candidates.len(),
                        }
                    }
                }
            }
            if plan == FilterPlan::WholeFile {
                plan = FilterPlan::ScanOnly;
            }
            // Intersection, not containment: a feature whose bbox overlaps the viewport is in.
            open_where(&mut sql);
            sql.push_str(&format!(
                "{xmin} <= ? AND {xmax} >= ? AND {ymin} <= ? AND {ymax} >= ?",
                xmin = c.xmin.to_sql(),
                xmax = c.xmax.to_sql(),
                ymin = c.ymin.to_sql(),
                ymax = c.ymax.to_sql(),
            ));
        } else if let Some(f) = &filter_clause {
            // No bbox: the predicate is the whole `WHERE` clause. `open_where` is not used here —
            // it always leaves a trailing `AND` for a condition this branch has none of.
            sql.push_str(" WHERE ");
            sql.push_str(f);
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

/// The post-check's own read — R-D2 after a stream terminal, §13 C.
///
/// Separate from `Dataset::check_source_unchanged` only because the producer thread does not hold
/// the `Dataset`; the comparison is the identical one, on `SourceDescriptor::refuse_if_changed`,
/// so the pre-check and the post-check cannot drift into two ideas of "changed".
///
/// A descriptor that cannot be read at all here — the file was removed mid-query, say — is
/// **reported as the change it is**, not swallowed: `SourceDescriptor::of`'s own typed error is
/// mapped onto `SourceChanged` with the reason named, because "the file is gone" is precisely the
/// situation this check exists for and treating an unreadable source as unchanged would be the
/// silent staleness `docs/01` principle 8 forbids.
/// Runs the post-check and reports **the footer bytes it read**, so the cost is accounted from the
/// read that actually happened rather than measured by doing it a second time (the human's ruling
/// of 2026-09-16, round 5 item 3: reported per cancellation, never silent).
///
/// `0` bytes means the source could not be re-read at all — the refusal then says so, and there was
/// no footer to read.
fn post_check_source(
    path: &std::path::Path,
    opened_with: &crate::descriptor::SourceDescriptor,
) -> (Result<()>, u64) {
    match crate::descriptor::SourceDescriptor::of(path) {
        Ok(now) => {
            let bytes = now.footer_bytes_read();
            (opened_with.refuse_if_changed(&now), bytes)
        }
        Err(e) => (
            Err(EngineError::SourceChanged {
                detail: format!("{{the source could not be re-read: {e}}}"),
            }),
            0,
        ),
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
    compact_attribute_retention: bool,
) -> Result<()> {
    // First statement in the producer thread's body — separates thread-spawn/handoff cost
    // (`SPAN_PRODUCER_HANDOFF`, `lease_acquired → producer_started`) from `conn.prepare()` plus the
    // pre-prepare cancellation check just below (`SPAN_STATEMENT_PREPARE`), which a single event
    // bracketing both would have conflated.
    crate::trace::mark(crate::trace::PRODUCER_STARTED, 0, 0);

    // Checked before anything is prepared or executed: DuckDB does not latch an interrupt raised on
    // an idle connection (see `cancel.rs`), so a stream cancelled before it started is stopped
    // here or not at all.
    if cancel.is_cancelled() {
        return Err(EngineError::Cancelled);
    }

    let mut stmt = conn
        .prepare(sql)
        .map_err(|e| classify(cancel, format!("prepare: {e}")))?;
    // **This is not "planning" in the query-planner sense.** The file path is a bound parameter
    // (`FROM read_parquet(?)`), so DuckDB cannot open the file, read its footer, or plan the scan
    // yet — it does not know which file. What this call costs is settled by `SPAN_STATEMENT_PREPARE`
    // (`producer_started → sql_prepared`), not assumed from its name.
    crate::trace::mark(crate::trace::SQL_PREPARED, 0, 0);

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

    // `SPAN_PARAM_ASSEMBLY` (`sql_prepared → execute_called`) closes at the `EXECUTE_CALLED` stamp
    // inside the closure below: parameter-`Vec` construction plus the guard's own first two steps,
    // named so it is not inferred by subtracting the other segments from `query`. The cancellation
    // check that used to sit here is now step 2 inside `execute_guarded` — folded in rather than
    // duplicated, because a check here and a separate check inside the guard would still leave the
    // gap between them open.
    // **`stream_arrow` binds *and executes* in one call** (the comment below already says the
    // vendored crate exposes no boundary between the two) — for a selective, late-matching predicate
    // this one call is where the *entire* non-matching prefix gets scanned, because nothing yields a
    // chunk this producer could check `cancel.is_cancelled()` between until a match is found. Routed
    // through `execute_guarded` (`cancel.rs`, `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`)
    // rather than called bare: a cancel landing between `prepare` and here, or during this call
    // itself, is not lost to the window DuckDB's own interrupt-clearing-on-execute opens (see
    // `cancel.rs`'s header) — the guard checks immediately before running this closure and the
    // re-interrupter it starts keeps re-raising for as long as the closure is in flight.
    let mut arrow = match cancel.execute_guarded(|| {
        // Stamped inside the closure so that a guard `Cancelled` from step 2, which never runs this
        // closure, leaves no `execute_called` — the trace a stream cancelled before its execute
        // left before this guard existed.
        crate::trace::mark(crate::trace::EXECUTE_CALLED, 0, 0);
        stmt.stream_arrow(params.as_slice())
    }) {
        crate::cancel::Guarded::Cancelled => {
            crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0);
            return Err(EngineError::Cancelled);
        }
        crate::cancel::Guarded::Err(e) => {
            // **A `PRODUCER_CANCELLED` site found by `cut/sql-filter` P4's own testing** (the
            // sibling site just below the `catch_unwind` this function's row-fetch loop wraps is
            // the other one that piece added): an interrupt landing inside `stream_arrow` surfaces
            // as this call's own `Err`, not a panic on a later `.next()`.
            if cancel.is_cancelled() {
                crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0);
            }
            return Err(classify(cancel, format!("execute: {e}")));
        }
        crate::cancel::Guarded::Ok(arrow) => arrow,
    };
    // **`SPAN_BIND_AND_EXECUTE` (`execute_called → execute_returned`) brackets this call, which
    // binds parameters *and* executes in one step, plus the guard's own step 4 (two atomic
    // operations) on the `Ok` path — `execute_returned` is stamped only there, as before the guard
    // existed.** The vendored `duckdb` crate has no
    // public API on this path that separates them — `Statement::stream_arrow` is `__bind_in` then
    // `execute_streaming` with no observable boundary between — so this span may never be quoted as
    // either half alone.
    //
    // A previous revision of this comment framed these events as settling whether DuckDB sorts
    // inside `stream_arrow` or the first `next()`. That framing is withdrawn: the cell that
    // produced the only measurement here (`kernel/tests/cancel_rescore.rs`'s consistency
    // demonstration) runs an unordered whole-file scan with no `ORDER BY`, so it measured this call's
    // cost on a query with no sort to locate. `kernel/CANCELLATION-AND-TRACING.md` §2's question is
    // still open; see `kernel/RESULTS.md`'s eighth section.
    crate::trace::mark(crate::trace::EXECUTE_RETURNED, 0, 0);

    let attribute_fields = envelope.attributes().to_vec();
    let mut pending = Pending::new(attribute_fields.len());
    // Batches handed over so far — the policy's input, and the `batch_index` a consumer sees.
    let mut emitted: u64 = 0;
    let mut saw_first_chunk = false;
    // **The first batch's budget clock, started at the first source row and at no other boundary.**
    //
    // Not at lease acquisition and not when `stream_arrow` returns: anchored there, the budget's
    // window would contain DuckDB's own fetch, during which the producer holds no rows and is
    // parked inside `next()` — a budget that expires where no action is possible is noise, not a
    // trigger. Anchored here it is exactly co-terminous with `SPAN_SOURCE_TO_FIRST_BATCH` and
    // provably does not touch `SPAN_QUERY`, which is what lets a measurement *attribute* any
    // movement to a segment rather than infer it.
    //
    // An unconditional `Instant`, deliberately **not** derived from `trace::mark` — `mark` is a
    // no-op when tracing is off, and the policy has to behave identically in both states or the
    // traced twin measures a different producer than the cell it is a twin of.
    let mut first_row_at: Option<std::time::Instant> = None;
    let budgeted = policy.cut == BatchCutPolicy::TimeBudgetedFirstBatch;
    // Rows appended since the budget clock was last read. Maintained only while batch 0 is
    // accumulating under an armed budget; zero cost on every other stream and every later batch.
    let mut rows_since_budget_check = 0usize;

    loop {
        if cancel.is_cancelled() {
            crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0);
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
                // **The other new `PRODUCER_CANCELLED` site this piece adds (`cut/sql-filter` P4's
                // own testing; see `stream_arrow`'s call site above for the first).** A selective,
                // late-matching predicate can leave the *entire* non-matching prefix
                // scanned inside one `arrow.next()` call (DuckDB does not yield a chunk boundary this
                // producer can check `cancel.is_cancelled()` between, because nothing survives the
                // filter until near the end) — DuckDB's own interrupt is what actually stops it, and
                // the interrupted fetch panics rather than returning an error (the comment above the
                // `catch_unwind` this arm belongs to already says so). Without this mark, a
                // cancellation observed *only* on this path — which a late-matching filter makes the
                // common case, not a corner case — left `cancel_observed` permanently unstamped: the
                // same "an always-absent name reads as did not happen" defect the row-loop check's own
                // comment (above) already named for a different gap.
                if cancel.is_cancelled() {
                    crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0);
                }
                return Err(classify(cancel, format!("duckdb fetch panicked: {detail}")));
            }
        };

        // Per *chunk*, and only for the first one. A mark per chunk would still be off the row
        // loop, but the row loop is what this file's hot-path rule is about and one boundary is
        // what the segment needs.
        // **Guarded on the chunk actually carrying rows, and that is not pedantry.** DuckDB may
        // yield an empty vector, and anchoring the budget there would start the 8 ms before a single
        // row existed — so the first batch would be cut small for a reason nothing in the artifact
        // records, which is precisely the attribution this lever exists to establish. The span's
        // name is `first_source_row`; a chunk with no rows contains no source row.
        if !saw_first_chunk && chunk.num_rows() > 0 {
            saw_first_chunk = true;
            // Stamped before the trace mark, so the budget's origin is the arrival of the rows and
            // not the cost of recording that they arrived.
            first_row_at = Some(std::time::Instant::now());
            crate::trace::mark(crate::trace::FIRST_SOURCE_ROW, chunk.num_rows() as u64, 0);
        }

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
                let col = decode_dictionary_chunk_column(col, f.data_type())?;
                if col.data_type() != f.data_type() {
                    return Err(EngineError::EncodingMismatch {
                        claimed: format!("attribute `{}` is {}", f.name(), f.data_type()),
                        found: col.data_type().to_string(),
                    });
                }
                Ok(col)
            })
            .collect::<Result<_>>()?;

        // First row of this chunk that belongs to the batch currently being accumulated. Attribute
        // columns are carried as **slices of the chunk's own arrays**, one run per cut, rather than
        // as per-row copies: a run is one slice regardless of how many rows it covers, and ADR-004
        // asks for copies to be minimized rather than assumed absent.
        let mut run_start = 0usize;

        for (row, id) in ids.iter().enumerate().take(chunk.num_rows()) {
            if cancel.is_cancelled() {
                // **Stamped here too, and this is not a breach of `trace.rs`'s no-mark-in-the-row-
                // loop rule.** That rule is about cost, and this `mark` is on the branch that
                // *returns*: it executes at most once per stream and never in the steady state.
                //
                // Without it the span is simply missing for the common case. The producer usually
                // observes a cancellation here rather than at the chunk boundary — a chunk is
                // thousands of rows — so `cancel_requested → cancel_observed`, which is the interval
                // `docs/08`'s 100 ms budget is scored on, had no endpoint on the path that actually
                // fires. An always-absent name reads as "did not happen", which is the defect
                // `kernel/CANCELLATION-AND-TRACING.md` records about the previous vocabulary.
                crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0);
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
                flush(
                    &mut pending,
                    envelope,
                    cancel,
                    stats,
                    tx,
                    emitted,
                    target,
                    report_bounds,
                    compact_attribute_retention,
                    BatchCut::SizeTarget,
                )?;
                emitted += 1;
                rows_since_budget_check = 0;
            }

            let before = pending.builder.vertices();
            pending.builder.push_wkb(wkb)?;
            pending.vertices += pending.builder.vertices() - before;
            pending.ids.push(*id);
            pending.attr_bytes += attr_row_bytes(&chunk_attrs, row);
            pending.est_bytes =
                estimate_bytes(pending.ids.len(), pending.builder.vertices()) + pending.attr_bytes;
            pending.first_id.get_or_insert(*id);

            // **The budget's in-chunk site: a row stride, never per row.** See
            // `BUDGET_CHECK_ROW_STRIDE` — the row loop already carries a `SeqCst` load per row, and
            // a clock read per row would cost more than the trigger can save. Maintained only while
            // batch 0 is accumulating, so every later batch pays nothing at all: the whole
            // expression is guarded by `emitted == 0`, which is false for the rest of the stream.
            let mut budget_reached = false;
            if budgeted && emitted == 0 {
                rows_since_budget_check += 1;
                if rows_since_budget_check >= BUDGET_CHECK_ROW_STRIDE {
                    rows_since_budget_check = 0;
                    budget_reached =
                        first_row_at.is_some_and(|t| t.elapsed() >= FIRST_BATCH_TIME_BUDGET);
                }
            }
            let cut_by = cut_reason(
                pending.est_bytes,
                pending.ids.len(),
                target,
                policy.max_rows,
                budget_reached,
            );
            if let Some(cut_by) = cut_by {
                pending.push_attr_run(&chunk_attrs, run_start, row + 1);
                run_start = row + 1;
                flush(
                    &mut pending,
                    envelope,
                    cancel,
                    stats,
                    tx,
                    emitted,
                    target,
                    report_bounds,
                    compact_attribute_retention,
                    cut_by,
                )?;
                emitted += 1;
                rows_since_budget_check = 0;
            }
        }
        // Whatever of this chunk is still accumulating carries over into the next batch.
        pending.push_attr_run(&chunk_attrs, run_start, chunk.num_rows());

        // **The budget's principal site: a DuckDB chunk boundary.**
        //
        // This is where it can actually fire on a selective query. The producer never sees
        // non-matching rows — the bbox predicate is in SQL — so a sparse viewport spends its time
        // *inside* `arrow.next()`, and the accumulating first batch crosses chunk after chunk while
        // the row loop barely runs. A trigger that only looked at a row stride would be checking a
        // clock exactly where the clock is not moving.
        //
        // **An empty-at-budget first batch is a declared behaviour and it is: nothing is emitted.**
        // `pending.ids.is_empty()` is the whole of it. The producer cannot cut a batch it has no
        // rows for; the budget re-arms and fires at the first moment at least one row exists. An
        // empty batch would spend a queue credit and a `batch_index` on zero rows and would put a
        // zero-row IPC stream on a path no consumer in this tree has ever seen one on.
        if budgeted && emitted == 0 && !pending.ids.is_empty() {
            let expired = first_row_at.is_some_and(|t| t.elapsed() >= FIRST_BATCH_TIME_BUDGET);
            if expired {
                let target = policy.target_for(emitted);
                flush(
                    &mut pending,
                    envelope,
                    cancel,
                    stats,
                    tx,
                    emitted,
                    target,
                    report_bounds,
                    compact_attribute_retention,
                    BatchCut::TimeBudget,
                )?;
                emitted += 1;
                rows_since_budget_check = 0;
            }
        }
    }

    if !pending.ids.is_empty() {
        let target = policy.target_for(emitted);
        flush(
            &mut pending,
            envelope,
            cancel,
            stats,
            tx,
            emitted,
            target,
            report_bounds,
            compact_attribute_retention,
            BatchCut::StreamEnd,
        )?;
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

/// Which trigger, if any, ends the batch that has just had a row appended.
///
/// **Extracted so the precedence is testable rather than argued.** The producer's row loop cannot be
/// driven at a chosen clock from a test, so the part of lever A that *can* be pinned deterministically
/// is this decision — and it is the part that decides what an artifact's `cut_by` counts mean.
///
/// Precedence is declared, not incidental: when two triggers are true at once the **reported** one is
/// the one that would have fired without the other. A budget cut is therefore only ever reported
/// where the size ladder had not already reached its target, which is exactly what makes a
/// `time-budget` count mean "this batch exists because of lever A" rather than "lever A was armed".
///
/// **What `MIN_BATCH_BYTES` actually is, since the budget is the second thing to go under it.** MIN
/// is not a per-batch floor and never was: it floors [`BatchSizePolicy::target_for`]'s *target*, and
/// the final `StreamEnd` batch of every stream is routinely smaller than it. The budget arm adds a
/// second, deliberate way to emit a batch below MIN — one taken in exchange for pixels sooner, the
/// same trade `FIRST_TARGET_BATCH_BYTES` makes one step earlier. Declared, not discovered (ADR-010
/// rule 6).
fn cut_reason(
    est_bytes: usize,
    rows: usize,
    target: usize,
    max_rows: usize,
    budget_reached: bool,
) -> Option<BatchCut> {
    if est_bytes >= target {
        Some(BatchCut::SizeTarget)
    } else if rows >= max_rows {
        Some(BatchCut::RowCeiling)
    } else if budget_reached {
        Some(BatchCut::TimeBudget)
    } else {
        None
    }
}

/// Whether a stream's ordering and cut policy may be combined.
///
/// One place, so the refusal in `stream_inner` and the truth table its test asserts cannot drift
/// apart. See [`EngineError::TimingDependentOrdering`] for why the combination is refused.
pub(crate) fn is_timing_dependent(ordering: RowOrdering, cut: BatchCutPolicy) -> bool {
    ordering == RowOrdering::ByIdentityAscending && cut == BatchCutPolicy::TimeBudgetedFirstBatch
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
/// Decode a chunk column to `declared` when it arrived dictionary-encoded, before any check runs
/// against it — round 17 item 3; the chunk-loop half of E-12. **A named copy** (ADR-004): a
/// dictionary index is an ordinal, and this is the one place in the live path that turns one into
/// the value type the envelope actually declares.
///
/// **Unreachable through `read_parquet` today** (H2, confirmed by P0): DuckDB's parquet reader never
/// reports an Arrow `Dictionary` in this pinned version. The decode runs on `col`'s own actual type,
/// not on that finding, so a source that does carry one is still handled correctly rather than
/// merely refused as an `EncodingMismatch` a few lines below this function's own caller.
fn decode_dictionary_chunk_column(col: &ArrayRef, declared: &DataType) -> Result<ArrayRef> {
    if matches!(col.data_type(), DataType::Dictionary(_, _)) {
        arrow::compute::cast(col, declared)
            .map_err(|e| EngineError::Arrow(format!("dictionary decode: {e}")))
    } else {
        Ok(col.clone())
    }
}

fn attr_row_bytes(chunk_attrs: &[ArrayRef], row: usize) -> usize {
    use arrow::array::{
        BooleanArray, Float32Array, Float64Array, Int16Array, Int32Array, Int64Array, Int8Array,
        LargeStringArray, StringArray, StringViewArray, UInt16Array, UInt32Array, UInt8Array,
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
        } else if col.as_any().downcast_ref::<Float32Array>().is_some() {
            // E-11: Float32 is admitted and emitted as its own type (round 17 item 3), never
            // widened — its own 4-byte arm, not folded into the 8-byte Int64/Float64 one.
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

/// The number of buffers `data`'s own array holds, its validity buffer included, recursing into any
/// child data. Used only by [`retain_or_compact_single_run`]'s own allowance (X7; Amendment 5, row
/// 5.3) — none of this crate's admitted attribute types carry child data today (they are all
/// primitive, `Utf8`, or `Boolean`), so this recurses defensively rather than because it is
/// exercised, on the same discipline `attr_row_bytes`'s own unreachable arm states.
fn buffer_count(data: &arrow::array::ArrayData) -> usize {
    let mut n = data.buffers().len();
    if data.nulls().is_some() {
        n += 1;
    }
    for child in data.child_data() {
        n += buffer_count(child);
    }
    n
}

/// `flush`'s own single-run decision, extracted so a test can drive it directly with either plan's
/// own declared `compact_attribute_retention` (X6; Amendment 5, row 5.2/5.6) without wiring a whole
/// `Pending`/channel/envelope through `flush` itself. `compact` is the calling plan's own declared
/// choice (`StreamPlan::compact_attribute_retention`'s own doc) — `false` for every plan but the
/// live projected stream's. Those plans never enter [`retain_or_compact_single_run`]'s compacting
/// branch at all, and so never risk the byte difference H3's second clause found (row 5.1); for
/// publish, T1 (`a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush`) proves it
/// through `flush`.
fn single_run_retention(array: &ArrayRef, compact: bool) -> Result<ArrayRef> {
    if compact {
        retain_or_compact_single_run(array)
    } else {
        Ok(Arc::clone(array))
    }
}

/// The retention rule `flush` applies to a single-run attribute slice, reached through
/// [`single_run_retention`] and narrowed to the live projected stream alone (condition (3); §7;
/// route (a), Amendment 5 row 5.2): the slice is kept as a slice — no copy — unless the buffers it
/// retains exceed an allowance of `MAX_ATTRIBUTE_RETENTION_FACTOR` times its own memory,
/// **plus 64 bytes per buffer it holds** (Amendment 5, row 5.3 — `arrow-buffer` 58.4.0's own
/// `MutableBuffer` allocation-rounding multiple, confirmed by R-E2: a 1-row `Int64` run retains 64
/// bytes against 8, and a 100-row `Boolean` run 64 against 13, neither of which the plain factor
/// alone would call within bounds even though nothing is actually over-retained). Past the allowance
/// it is compacted by one copy.
///
/// **Decided after the cut**, on the run this batch actually retained, not on the source chunk as a
/// whole: a run near the end of a large chunk retains little of it (offset near the chunk's end),
/// while a run near the start of the same chunk retains almost all of it, so the ratio is a property
/// of *this* run and cannot be precomputed before `run_start..row` is known.
fn retain_or_compact_single_run(array: &ArrayRef) -> Result<ArrayRef> {
    let data = array.to_data();
    let buffer_mem = data.get_buffer_memory_size();
    let slice_mem = data
        .get_slice_memory_size()
        .map_err(|e| EngineError::Arrow(format!("attribute slice memory: {e}")))?;
    let allowance = MAX_ATTRIBUTE_RETENTION_FACTOR
        .saturating_mul(slice_mem)
        .saturating_add(64usize.saturating_mul(buffer_count(&data)));
    if buffer_mem > allowance {
        Ok(compact_attribute_slice(array))
    } else {
        Ok(Arc::clone(array))
    }
}

/// One copy: rebuilds `array`'s own `offset..offset+len` range into freshly sized buffers, so the
/// source chunk's buffers are no longer retained. `arrow::compute::concat` cannot do this for a
/// single array — its single-array case (`arrays.len() == 1`) returns `array.slice(0, array.len())`
/// unchanged, which retains exactly what it started with.
///
/// **Only ever called on the live projected stream** (route (a), Amendment 5 row 5.2 —
/// [`retain_or_compact_single_run`]'s own `compact_attribute_retention` gate). H3's second clause is
/// false at `arrow-ipc` 58.4.0 for the cases observed, and no rule over offsets or lengths is
/// claimed beyond them: the slice and this compacted copy wrote different IPC bytes for a nullable
/// `Utf8` slice carrying a NULL (Amendment 5, row 5.1) and for a non-null `Boolean`'s values bitmap
/// at offset/length 8/3, 0/10 and 40/20, and the same bytes at 3/5 (Amendment 8's class-2 row). The
/// guarantee this function actually gives is **decoded equality** — the same values, and the same
/// validity within the array's own length — never byte identity, and nothing on this stream claims
/// the latter.
fn compact_attribute_slice(array: &ArrayRef) -> ArrayRef {
    let data = array.to_data();
    let mut mutable = MutableArrayData::new(vec![&data], false, array.len());
    mutable.extend(0, 0, array.len());
    make_array(mutable.freeze())
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
    compact_attribute_retention: bool,
    cut_by: BatchCut,
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
        //
        // **On the live projected stream alone** (route (a), Amendment 5 row 5.2),
        // `MAX_ATTRIBUTE_RETENTION_FACTOR` (condition (3)) bounds that retention: past the factor,
        // plus 64 bytes per buffer (row 5.3), the run is compacted by one copy here, decided after
        // the cut, so the live projected stream's producer-resident payload is the bound
        // `MAX_QUEUED_BATCHES`'s doc states.
        //
        // **Route (a) (Amendment 5, row 5.2): this compaction runs only on the live projected
        // stream.** H3's second clause is false at `arrow-ipc` 58.4.0 where a sliced bitmap's
        // padding bits differ between the slice and its compacted copy — observed for a nullable
        // `Utf8` run carrying a NULL (R-E1; row 5.1) and for a non-null `Boolean`'s values bitmap
        // (Amendment 8's class-2 row) — so every other plan, publish's included, keeps main's own
        // single-run arm (the slice, no copy) regardless of the factor:
        // `compact_attribute_retention` is that plan's own declared choice (`StreamPlan`'s own
        // doc), not a fact this function decides.
        .map(|runs| match runs.len() {
            1 => single_run_retention(&runs[0], compact_attribute_retention),
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
    stats
        .rows_generated
        .fetch_add(rows as u64, Ordering::SeqCst);
    if cancel.is_cancelled() {
        // H2 allows at most one batch after the producer observes cancellation. Counted, and then
        // dropped rather than sent: the stream is over.
        stats.batches_after_cancel.fetch_add(1, Ordering::SeqCst);
        return Err(EngineError::Cancelled);
    }
    stats.add_resident(p.est_bytes);

    // Per batch, not per row — the rule this module's tracing keeps. `batch_index` 0 also gets its
    // own name so a summarizer can find time-to-first-batch without scanning for a minimum.
    if batch_index == 0 {
        crate::trace::mark(
            crate::trace::FIRST_BATCH_FULL,
            rows as u64,
            p.est_bytes as u64,
        );
    }
    crate::trace::mark(crate::trace::BATCH_FULL, rows as u64, p.est_bytes as u64);

    // Blocks when the consumer is behind: this is the backpressure (H3). A disconnected receiver
    // means the consumer is gone, which is a cancellation, not a producer failure.
    tx.send(Ok(Item {
        batch,
        est_bytes: p.est_bytes,
        vertices: p.vertices,
        batch_index,
        target_bytes,
        xy_bounds,
        cut_by,
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
    Err(EngineError::Query(format!(
        "`{name}` is {}; expected a 64-bit integer",
        col.data_type()
    )))
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
    Err(EngineError::Query(format!(
        "geometry column is {}; expected binary",
        col.data_type()
    )))
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

    /// E-11: `float32_costs_four_bytes_in_the_estimate`. Mutation: remove the arm (falls through to
    /// the 8-byte catch-all).
    #[test]
    fn float32_costs_four_bytes_in_the_estimate() {
        let col: ArrayRef = std::sync::Arc::new(arrow::array::Float32Array::from(vec![1.0f32]));
        // 1 validity bit (rounded to a byte) + 4 bytes for the value.
        assert_eq!(attr_row_bytes(&[col], 0), 1 + 4);
    }

    /// E-12: `a_dictionary_chunk_is_decoded_before_the_declared_type_check_and_no_index_reaches_
    /// the_envelope` — proven over a real arrow-rs `DictionaryArray`, directly against the
    /// chunk-loop's own decode function, per round 17 item 4 stop item 6's accepted pattern (H2
    /// makes this unreachable through `read_parquet` itself). Mutation: skip the decode (return
    /// `col.clone()` unconditionally) — the test then observes the still-dictionary-typed array
    /// rather than the value-typed one, and the assertion on `data_type()` fails by name.
    #[test]
    fn a_dictionary_chunk_is_decoded_before_the_declared_type_check_and_no_index_reaches_the_envelope(
    ) {
        use arrow::array::{DictionaryArray, StringArray};
        use arrow::datatypes::Int32Type;

        let keys = arrow::array::Int32Array::from(vec![1, 0, 1]);
        let values = StringArray::from(vec!["industrial", "residential"]);
        let dict: ArrayRef = std::sync::Arc::new(
            DictionaryArray::<Int32Type>::try_new(keys, Arc::new(values)).unwrap(),
        );
        assert!(matches!(dict.data_type(), DataType::Dictionary(_, _)));

        let decoded = decode_dictionary_chunk_column(&dict, &DataType::Utf8).unwrap();
        // No index reaches the caller: the returned array is the value type, not a dictionary.
        assert_eq!(decoded.data_type(), &DataType::Utf8);
        let strings = decoded.as_any().downcast_ref::<StringArray>().unwrap();
        assert_eq!(strings.value(0), "residential");
        assert_eq!(strings.value(1), "industrial");
        assert_eq!(strings.value(2), "residential");
    }

    /// A column that never arrived dictionary-encoded passes through unchanged (no copy, no
    /// panic) — the common case this function must not slow down or alter.
    // RECORDED MUTATION (observed at b438c58728d044e67466c438b35091f813e57be2): in
    // `decode_dictionary_chunk_column`, replace the non-dictionary `else` arm's `Ok(col.clone())`
    // with an unconditional `Err(..)`. Observed: this test fails by name -- `unwrap()` panics on
    // `Arrow("mutated: non-dictionary path refused")`. Reverted.
    #[test]
    fn a_non_dictionary_chunk_column_passes_through_the_decode_step_unchanged() {
        let col: ArrayRef = std::sync::Arc::new(arrow::array::Float32Array::from(vec![1.0f32]));
        let out = decode_dictionary_chunk_column(&col, &DataType::Float32).unwrap();
        assert_eq!(out.data_type(), &DataType::Float32);
    }

    /// E-14: `every_emitted_attribute_column_retains_at_most_the_declared_factor`. Directly against
    /// `flush`'s own retention decision, on a constructed array rather than a live DuckDB chunk —
    /// what actually matters here is the *ratio*, not where the array came from, and a run near the
    /// tail of a large chunk (`retain_or_compact_single_run`'s own doc) is exactly this shape:
    /// most of a large source array's buffer retained by a small slice of it.
    ///
    /// **X7 (Amendment 5, row 5.6) adds R-E2's two small runs**, over the widened allowance (row
    /// 5.3): a 1-row `Int64` run (retains 64 bytes against 8) and a 100-row `Boolean` run (64
    /// against 13) — both breach the *plain* factor on their own (`MutableBuffer`'s 64-byte
    /// allocation rounding, `arrow-buffer` 58.4.0) even though nothing is actually over-retained,
    /// and both must be reported as within the declared bound once the 64-bytes-per-buffer
    /// allowance is included.
    ///
    /// **The small runs assert the decision itself (gate 2, R2-B1):** each comes back as the same
    /// array, uncopied (`Arc::ptr_eq`) — the property the 64-bytes-per-buffer term buys (ADR-004).
    /// A bound check alone cannot tell: a compacted 1-row `Int64` still rounds to 64 bytes.
    // RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): remove compaction
    // (`retain_or_compact_single_run`'s compacting branch never taken). Observed: this test fails
    // by name -- "retained 342208 bytes for a run whose own allowance is 408 bytes" at
    // `engine/src/stream.rs:2578`. Reverted.
    // RECORDED MUTATION (observed at `ca3d7ae`): remove the 64-bytes-per-buffer term from
    // `retain_or_compact_single_run`'s allowance. Observed: this test fails by name -- "a 1-row
    // Int64 run must be kept uncopied" at `engine/src/stream.rs:2612`. Reverted.
    #[test]
    fn every_emitted_attribute_column_retains_at_most_the_declared_factor() {
        let allowance = |data: &arrow::array::ArrayData| -> usize {
            MAX_ATTRIBUTE_RETENTION_FACTOR
                .saturating_mul(data.get_slice_memory_size().unwrap())
                .saturating_add(64 * buffer_count(data))
        };

        // The large-run case (unchanged from before X7): 10 rows out of 20 000 retains far more
        // than even the widened allowance.
        let big = arrow::array::StringArray::from(
            (0..20_000)
                .map(|i| format!("row-{i:06}"))
                .collect::<Vec<_>>(),
        );
        let source: ArrayRef = Arc::new(big);
        let tail: ArrayRef = source.slice(19_990, 10);

        // The un-decided input itself breaches the allowance — otherwise this test would pass
        // whether or not the retention rule ran at all.
        let before = tail.to_data();
        assert!(
            before.get_buffer_memory_size() > allowance(&before),
            "test fixture does not actually exercise the retention rule"
        );

        let kept = retain_or_compact_single_run(&tail).expect("retention decision");
        let after = kept.to_data();
        assert!(
            after.get_buffer_memory_size() <= allowance(&after),
            "retained {} bytes for a run whose own allowance is {} bytes",
            after.get_buffer_memory_size(),
            allowance(&after)
        );
        let kept = kept
            .as_any()
            .downcast_ref::<arrow::array::StringArray>()
            .unwrap();
        for i in 0..10 {
            assert_eq!(kept.value(i), format!("row-{:06}", 19_990 + i));
        }

        // R-E2's small runs (X7, row 5.3): the plain factor alone would call both of these a
        // breach, though nothing is actually over-retained — the 64-bytes-per-buffer allowance is
        // what makes the declared bound hold for them. Built directly from a `MutableBuffer`, never
        // an ordinary `Builder`: `PrimitiveBuilder`'s own values buffer is a plain `Vec<T::Native>`
        // (this crate's own read of `arrow-array` 58.4.0's `primitive_builder.rs`), which carries no
        // 64-byte rounding at all — only `arrow_buffer::MutableBuffer::with_capacity` does that
        // (`bit_util::round_upto_multiple_of_64`, `arrow-buffer` 58.4.0's own source), which is the
        // path DuckDB's own FFI-to-Arrow import actually allocates through. Constructing the
        // `MutableBuffer` directly reproduces the real allocator's rounding deterministically,
        // rather than depending on which of arrow-rs's several construction paths a future version
        // might route a small array through.
        use arrow::buffer::{Buffer, MutableBuffer};
        let mut one_row_buf = MutableBuffer::new(8); // rounds to 64 (R-E2's own observed figure)
        one_row_buf.extend_from_slice(&0i64.to_le_bytes());
        let one_row_data = arrow::array::ArrayData::builder(DataType::Int64)
            .len(1)
            .add_buffer(Buffer::from(one_row_buf))
            .build()
            .expect("1-row Int64 ArrayData");
        assert_eq!(
            one_row_data.get_buffer_memory_size(),
            64,
            "R-E2's own observed figure"
        );
        assert_eq!(
            one_row_data.get_slice_memory_size().unwrap(),
            8,
            "R-E2's own observed figure"
        );
        let one_row: ArrayRef = make_array(one_row_data);
        let kept = retain_or_compact_single_run(&one_row).expect("retention decision");
        assert!(
            Arc::ptr_eq(&kept, &one_row),
            "a 1-row Int64 run must be kept uncopied"
        );
        assert!(
            kept.to_data().get_buffer_memory_size() <= allowance(&kept.to_data()),
            "a 1-row Int64 run must not be reported as needing compaction"
        );

        // A 100-row `Boolean` run: bit-packed, 100 bits = 13 bytes (ceil(100/8)), needing 13 bytes
        // rounded to 64 (R-E2's own observed figure). Packed by hand, byte by byte, rather than
        // through a `BooleanBuffer`/`Builder` helper — the same reason the `Int64` case above is
        // built from a raw `MutableBuffer`.
        let mut packed_bits = [0u8; 13];
        for i in 0..100usize {
            if i % 3 == 0 {
                packed_bits[i / 8] |= 1 << (i % 8);
            }
        }
        let mut hundred_rows_buf = MutableBuffer::new(13);
        hundred_rows_buf.extend_from_slice(&packed_bits);
        let hundred_rows_data = arrow::array::ArrayData::builder(DataType::Boolean)
            .len(100)
            .add_buffer(Buffer::from(hundred_rows_buf))
            .build()
            .expect("100-row Boolean ArrayData");
        assert_eq!(
            hundred_rows_data.get_buffer_memory_size(),
            64,
            "R-E2's own observed figure"
        );
        assert_eq!(
            hundred_rows_data.get_slice_memory_size().unwrap(),
            13,
            "R-E2's own observed figure"
        );
        let hundred_rows: ArrayRef = make_array(hundred_rows_data);
        let kept = retain_or_compact_single_run(&hundred_rows).expect("retention decision");
        assert!(
            Arc::ptr_eq(&kept, &hundred_rows),
            "a 100-row Boolean run must be kept uncopied"
        );
        assert!(
            kept.to_data().get_buffer_memory_size() <= allowance(&kept.to_data()),
            "a 100-row Boolean run must not be reported as needing compaction"
        );
    }

    /// E-15: `a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_bytes`. **Narrowed to a
    /// non-null run** (Amendment 5, row 5.1 and Amendment 8's class-2 row — H3's second clause is
    /// false at `arrow-ipc` 58.4.0 where a sliced bitmap's padding bits differ, observed for a
    /// nullable `Utf8` run carrying a NULL and for a non-null `Boolean`'s values bitmap; this test's
    /// own non-null `Int64` array has no bitmap, so byte identity is a true claim for it
    /// specifically, never a claim about every attribute column). X6's own new
    /// tests (`publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_
    /// bytes`, `a_compacted_single_run_decodes_equal_to_the_slice_it_replaces_nulls_included`) cover
    /// the nullable shape this one does not.
    /// Mutation: compact the whole chunk — if `compact_attribute_slice` copied the *source* array's
    /// full length rather than the retained run's own `offset..offset+len`, the compacted array's
    /// row count (and therefore its IPC bytes) would no longer match the 20-row run it replaces.
    /// Recorded mutation (B1 gate 3's reviewer, row 9.6(a), observed at `c9ec02e`): a full-length
    /// copy realized through `Buffer::ptr_offset`. This test fails by name at its length assertion,
    /// left 5000, with the message "the whole chunk was compacted, not just the retained run".
    #[test]
    fn a_compacted_and_a_sliced_single_run_serialize_to_identical_ipc_bytes() {
        let source: ArrayRef = Arc::new(arrow::array::Int64Array::from(
            (0..5_000i64).collect::<Vec<_>>(),
        ));
        let run: ArrayRef = source.slice(4_980, 20);

        let compacted = compact_attribute_slice(&run);
        assert_eq!(
            compacted.len(),
            20,
            "the whole chunk was compacted, not just the retained run"
        );

        let ipc_bytes = |a: &ArrayRef| -> Vec<u8> {
            let schema = Arc::new(arrow::datatypes::Schema::new(vec![
                arrow::datatypes::Field::new("v", DataType::Int64, false),
            ]));
            let batch =
                arrow::record_batch::RecordBatch::try_new(schema.clone(), vec![Arc::clone(a)])
                    .expect("record batch");
            let mut buf = Vec::new();
            {
                let mut w =
                    arrow::ipc::writer::StreamWriter::try_new(&mut buf, &schema).expect("writer");
                w.write(&batch).expect("write");
                w.finish().expect("finish");
            }
            buf
        };

        assert_eq!(
            ipc_bytes(&compacted),
            ipc_bytes(&run),
            "a compacted copy must serialize byte-for-byte identically to the uncompacted slice it \
             replaces, for this non-null run"
        );
    }

    /// An envelope carrying one declared attribute column `v` of type `ty`, over the file CRS and
    /// a verified native identity — the shape `stream_for_publish` builds, for tests that assemble
    /// a batch around one attribute run.
    fn one_attribute_envelope(ty: DataType) -> BatchEnvelope {
        BatchEnvelope::with_attributes(
            crate::crs::DatasetCrs::from_file(
                "EPSG:2056".into(),
                Some(include_str!("../tests/data/epsg2056.projjson").to_string()),
                crate::crs::AxisOrder::EastingNorthing,
            ),
            "geometry".into(),
            crate::identity::DatasetIdentity::new(
                crate::identity::IdSource::File,
                crate::identity::IdUniqueness::VerifiedAtOpenFullFile,
                Some(1),
                Some(0),
            ),
            vec![arrow::datatypes::Field::new("v", ty, true)],
        )
    }

    /// The IPC bytes of the batch `TaggedBatch::assemble` builds from `env`, `attribute.len()`
    /// ids and polygons, and `attribute` as the one attribute column — `flush`'s own assembly.
    fn assembled_ipc_bytes(env: &BatchEnvelope, attribute: ArrayRef) -> Vec<u8> {
        let rows = attribute.len();
        let ids: ArrayRef = Arc::new(UInt64Array::from((0..rows as u64).collect::<Vec<_>>()));
        let mut b = PolygonBuilder::new();
        for _ in 0..rows {
            b.push_wkb(&crate::wkb::encode_polygon(&[vec![
                [2_600_000.0, 1_200_000.0],
                [2_600_010.0, 1_200_000.0],
                [2_600_010.0, 1_200_010.0],
                [2_600_000.0, 1_200_000.0],
            ]]))
            .expect("polygon");
        }
        let geometry = build_polygon_array(b).expect("polygon array");
        let batch = TaggedBatch::assemble(env, ids, geometry, vec![attribute]).expect("assemble");
        let mut out = Vec::new();
        batch.write_ipc_into(&mut out).expect("ipc");
        out
    }

    /// X6 (Amendment 5, row 5.6): `publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes`.
    /// Reads the retention the publish plan declares from the plan's own constructor
    /// (`StreamPlan::for_publish`, the one `stream_for_publish` calls) and drives
    /// [`single_run_retention`], `flush`'s single-run decision, with it. The IPC bytes of the
    /// batch `TaggedBatch::assemble` builds from the kept run must equal those of the batch
    /// assembled over the uncompacted run.
    ///
    /// Each case is a run the live decision would compact (so the plan's flag decides the
    /// outcome), taken from a 20 000-row source at a byte-aligned offset. The nullable `Utf8` runs
    /// carry a NULL inside the window with set validity bits after it (R-E1's shape: NULLs at 5,
    /// 9, 22 and 41). The non-null `Boolean` runs are the H3 probe (Amendment 8's class-2 row):
    /// the `changes` column records, for each case, whether compaction changed the IPC bytes as
    /// observed at `arrow-ipc` 58.4.0.
    // RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): `StreamPlan::for_publish`
    // declares `compact_attribute_retention: true`. Observed: this test fails by name --
    // "publish's flush must never compact: nullable Utf8 IPC bytes differ at offset 8 len 3" at
    // `engine/src/stream.rs:2787`. Reverted.
    #[test]
    fn publish_emits_a_nullable_byte_aligned_single_run_with_the_uncompacted_slices_ipc_bytes() {
        let utf8_source: ArrayRef = Arc::new(arrow::array::StringArray::from(
            (0..20_000)
                .map(|i| {
                    if [5, 9, 22, 41].contains(&i) {
                        None
                    } else {
                        Some(format!("v{i}"))
                    }
                })
                .collect::<Vec<_>>(),
        ));
        let bool_source: ArrayRef = Arc::new(arrow::array::BooleanArray::from(
            (0..20_000).map(|i| i % 2 == 0).collect::<Vec<_>>(),
        ));

        // (label, source, offset, length, whether compaction changes the IPC bytes)
        let cases: [(&str, &ArrayRef, usize, usize, bool); 7] = [
            ("nullable Utf8", &utf8_source, 8, 3, true),
            ("nullable Utf8", &utf8_source, 0, 10, true),
            ("nullable Utf8", &utf8_source, 40, 20, true),
            ("non-null Boolean", &bool_source, 8, 3, true),
            ("non-null Boolean", &bool_source, 0, 10, true),
            ("non-null Boolean", &bool_source, 40, 20, true),
            ("non-null Boolean", &bool_source, 3, 5, false),
        ];
        for (label, source, offset, len, changes) in cases {
            let run = source.slice(offset, len);
            if label.starts_with("nullable") {
                assert!(
                    run.null_count() > 0,
                    "{label} {offset}/{len}: the window must carry a NULL"
                );
            }
            let plan = StreamPlan::for_publish(one_attribute_envelope(source.data_type().clone()));
            let uncompacted = assembled_ipc_bytes(&plan.envelope, Arc::clone(&run));

            let live = retain_or_compact_single_run(&run).expect("live retention decision");
            assert!(
                !Arc::ptr_eq(&live, &run),
                "{label} {offset}/{len}: the live decision must compact this run, or the plan's flag decides nothing"
            );
            let compacted = assembled_ipc_bytes(&plan.envelope, compact_attribute_slice(&run));
            assert_eq!(
                compacted != uncompacted,
                changes,
                "{label} {offset}/{len}: whether compaction changes the IPC bytes"
            );

            let kept = single_run_retention(&run, plan.compact_attribute_retention)
                .expect("retention decision");
            assert_eq!(
                assembled_ipc_bytes(&plan.envelope, kept),
                uncompacted,
                "publish's flush must never compact: {label} IPC bytes differ at offset {offset} len {len}"
            );
        }
    }

    /// X6 (Amendment 5, row 5.6): `a_compacted_single_run_decodes_equal_to_the_slice_it_replaces_
    /// nulls_included` — the live projected stream's own guarantee (§2.3's narrowed byte-identity
    /// sentence, row 5.2): a compacted run decodes to the **same values and the same validity**
    /// (within the array's own length) as the slice it replaced, nulls included, even though the
    /// two are no longer byte-identical at the IPC level for a nullable run (H3's second clause,
    /// row 5.1).
    /// Mutation: `compact_attribute_slice` drops the null buffer (`MutableArrayData::new(vec![&data],
    /// false, ...)` — `false` becomes the default `use_nulls` already; the mutation instead directly
    /// clears the compacted array's own validity, e.g. by rebuilding it with
    /// `.with_nulls(None)`-equivalent bit-twiddling) so a null in the source no longer decodes as
    /// NULL in the compacted copy.
    // RECORDED MUTATION (observed at `ca3d7ae`, line numbers at that commit): in
    // `compact_attribute_slice`, build the frozen data again with `.nulls(None)` (the compacted
    // copy drops its null buffer). Observed: this test fails by name -- "index 5 (source index 5):
    // NULL-ness must match" at `engine/src/stream.rs:2824`. Reverted.
    #[test]
    fn a_compacted_single_run_decodes_equal_to_the_slice_it_replaces_nulls_included() {
        let source: ArrayRef = Arc::new(arrow::array::StringArray::from(
            (0..64)
                .map(|i| {
                    if i == 5 || i == 22 || i == 41 {
                        None
                    } else {
                        Some(format!("v{i}"))
                    }
                })
                .collect::<Vec<_>>(),
        ));
        let run = source.slice(0, 10); // covers source index 5, a NULL.
        let compacted = compact_attribute_slice(&run);

        assert_eq!(compacted.len(), run.len());
        let run_strings = run
            .as_any()
            .downcast_ref::<arrow::array::StringArray>()
            .unwrap();
        let compacted_strings = compacted
            .as_any()
            .downcast_ref::<arrow::array::StringArray>()
            .unwrap();
        for i in 0..run.len() {
            assert_eq!(
                run_strings.is_null(i),
                compacted_strings.is_null(i),
                "index {i} (source index {}): NULL-ness must match",
                i
            );
            if !run_strings.is_null(i) {
                assert_eq!(
                    run_strings.value(i),
                    compacted_strings.value(i),
                    "index {i}: value must match"
                );
            }
        }
    }

    #[test]
    fn identifiers_are_quoted_not_interpolated() {
        assert_eq!(
            quote_ident("geom\"; DROP TABLE t; --"),
            "\"geom\"\"; DROP TABLE t; --\""
        );
    }

    /// X7 (Amendment 5, row 5.6): `a_live_projected_text_stream_emits_every_attribute_column_
    /// within_the_declared_retention_bound`, over a real `AttributeMode::MultiType` fixture's
    /// `[text]` projection (§3's `[text]` row) — the live projected stream, which is the one plan
    /// `compact_attribute_retention` is `true` for. Reads the producer's own queued `Item`s directly
    /// (this module's own private channel, in-module), before `write_ipc_into` ever runs: a
    /// serialized-then-reconstructed array's buffer memory always equals its slice memory (this
    /// file's own module doc), which would make the retention decision untestable from decoded IPC
    /// output.
    /// Mutation: remove compaction (`flush`'s single-run arm always `Arc::clone`s), the same as
    /// E-14's own recorded mutation — the assertion below then fails on whichever queued item
    /// retains a `text` run near the tail of a large DuckDB chunk.
    // RECORDED MUTATION (observed at b438c58728d044e67466c438b35091f813e57be2): in
    // `single_run_retention`, ignore `compact` and always `Ok(Arc::clone(array))`. Observed: this
    // test fails by name -- "text run retained 2105348 bytes over its 84424-byte allowance" (a
    // `text` run near the tail of a large chunk retains far more than the declared bound once
    // compaction never runs). Reverted.
    #[cfg(feature = "fixture")]
    #[test]
    fn a_live_projected_text_stream_emits_every_attribute_column_within_the_declared_retention_bound(
    ) {
        use crate::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec};

        let dir = std::env::temp_dir().join("spatial-engine-x7-retention-tests");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("multitype-text.parquet");
        write_geoparquet(
            &path,
            &FixtureSpec {
                features: 4_000,
                attributes: AttributeMode::MultiType,
                crs_mode: CrsMode::DeclaredLv95,
                ..Default::default()
            },
        )
        .expect("fixture");

        // X12 (Amendment 5, row 5.6): hashed before and after this run.
        let fixture_sha_before = {
            use sha2::{Digest, Sha256};
            let bytes = std::fs::read(&path).expect("read fixture for hashing");
            let mut h = Sha256::new();
            h.update(&bytes);
            format!("{:x}", h.finalize())
        };

        let ds = Dataset::open(&path).expect("open");

        let projection = ds
            .resolve_projection(&["text".to_string()])
            .expect("admitted projection");
        let stream = ds
            .stream_projected_with_cancel(&ViewportQuery::all(), &projection, CancelToken::new())
            .expect("stream");

        let mut rows_seen = 0usize;
        let mut checked_any = false;
        loop {
            match stream.rx.recv() {
                Ok(Ok(item)) => {
                    rows_seen += item.batch.record_batch().num_rows();
                    for col in item.batch.record_batch().columns().iter().skip(2) {
                        // Skip `id` (0) and `geometry` (1) — only attribute columns carry this
                        // retention rule (condition (3); §7).
                        let data = col.to_data();
                        let buffer_mem = data.get_buffer_memory_size();
                        let allowance = MAX_ATTRIBUTE_RETENTION_FACTOR
                            .saturating_mul(data.get_slice_memory_size().unwrap())
                            .saturating_add(64usize.saturating_mul(buffer_count(&data)));
                        assert!(
                            buffer_mem <= allowance,
                            "text run retained {buffer_mem} bytes over its {allowance}-byte allowance"
                        );
                        checked_any = true;
                    }
                }
                Ok(Err(e)) => panic!("stream failed: {e:?}"),
                Err(_) => break,
            }
        }
        assert_eq!(rows_seen, 4_000, "every row must be seen exactly once");
        assert!(
            checked_any,
            "must have checked at least one attribute column"
        );

        drop(stream);
        let fixture_sha_after = {
            use sha2::{Digest, Sha256};
            let bytes = std::fs::read(&path).expect("read fixture for hashing");
            let mut h = Sha256::new();
            h.update(&bytes);
            format!("{:x}", h.finalize())
        };
        assert_eq!(
            fixture_sha_after, fixture_sha_before,
            "the fixture file must be unchanged by this run"
        );
    }

    /// T1 (`b1-engine-kernel-half-followups` §2, E2): publish's `compact_attribute_retention: false`
    /// proven **through `flush`**, not only at the constructor. Makes the kernel's own two calls
    /// (`Dataset::resolve_projection`, `Dataset::stream_for_publish`) over a `MultiType` fixture's
    /// `[zone, text]` projection and reads the producer's queued `Item`s in-module, before
    /// `write_ipc_into` runs (decoded IPC cannot show retention — this file's own module doc). For
    /// each column, at least one queued batch carries an array the live rule *would* compact: its
    /// [`retain_or_compact_single_run`] is not `Arc::ptr_eq` to the emitted array, so `flush` kept it
    /// as the uncompacted slice. A compacted or concatenated array is tight and would come back
    /// pointer-equal.
    // RECORDED MUTATION (M-E2, B1 gate 3's S1), observed at
    // 784a15c79bc818488b89fdc21008993ccadd6297: in `flush`'s single-run arm, pass `true` to
    // `single_run_retention` in place of the plan's `compact_attribute_retention`. Observed: this
    // test fails by name -- "no queued publish batch carries an over-allowance `zone` run: publish's
    // `flush` compacted every one, or the fixture has no such run". Reverted.
    #[cfg(feature = "fixture")]
    #[test]
    fn a_publish_stream_keeps_its_attribute_runs_uncompacted_through_flush() {
        use crate::fixture::{write_geoparquet, AttributeMode, CrsMode, FixtureSpec};
        use sha2::{Digest, Sha256};

        let dir = std::env::temp_dir().join("spatial-engine-t1-publish-retention-tests");
        std::fs::create_dir_all(&dir).unwrap();
        let path = dir.join("multitype-publish.parquet");
        write_geoparquet(
            &path,
            &FixtureSpec {
                features: 4_000,
                avg_vertices: 100,
                attributes: AttributeMode::MultiType,
                crs_mode: CrsMode::DeclaredLv95,
                ..Default::default()
            },
        )
        .expect("fixture");
        let sha = || {
            format!(
                "{:x}",
                Sha256::digest(std::fs::read(&path).expect("read fixture"))
            )
        };
        let fixture_sha_before = sha();

        let ds = Dataset::open(&path).expect("open");
        let projection = ds
            .resolve_projection(&["zone".to_string(), "text".to_string()])
            .expect("admitted projection");
        let stream = ds
            .stream_for_publish(&ViewportQuery::all(), &projection, CancelToken::new())
            .expect("stream");

        let mut rows_seen = 0usize;
        let mut kept = std::collections::BTreeSet::new();
        while let Ok(item) = stream.rx.recv() {
            let rb = item.expect("stream failed").batch.record_batch().clone();
            rows_seen += rb.num_rows();
            for (field, col) in rb.schema().fields().iter().zip(rb.columns()).skip(2) {
                if !Arc::ptr_eq(&retain_or_compact_single_run(col).unwrap(), col) {
                    kept.insert(field.name().clone());
                }
            }
        }
        assert_eq!(rows_seen, 4_000, "every row must be seen exactly once");
        for column in ["zone", "text"] {
            assert!(
                kept.contains(column),
                "no queued publish batch carries an over-allowance `{column}` run: publish's `flush` \
                 compacted every one, or the fixture has no such run"
            );
        }

        drop(stream);
        assert_eq!(
            sha(),
            fixture_sha_before,
            "the fixture file must be unchanged by this run"
        );
    }

    // ---- lever A ------------------------------------------------------------------------------

    #[test]
    fn the_publish_policy_is_size_only_and_cannot_acquire_a_clock_by_default() {
        // ADR-017 §12. Stated at the construction site *and* asserted here, because the whole
        // determinism guarantee rests on a publish partition boundary being a pure function of the
        // row sequence.
        assert_eq!(BatchSizePolicy::publish().cut, BatchCutPolicy::SizeOnly);
        // And the viewport default too: the budgeted policy's gate is unanswered, so nothing may
        // reach it by omission. `BatchCutPolicy` has no `Default` precisely so this is a decision.
        assert_eq!(BatchSizePolicy::default().cut, BatchCutPolicy::SizeOnly);
        // The experimental policy differs from the default in the cut and in nothing else — a cell
        // that differs between them differs by the budget alone.
        let (d, b) = (BatchSizePolicy::default(), BatchSizePolicy::time_budgeted());
        assert_eq!(b.cut, BatchCutPolicy::TimeBudgetedFirstBatch);
        assert_eq!(
            (
                d.first_target_bytes,
                d.growth_factor,
                d.target_bytes,
                d.min_bytes,
                d.max_rows
            ),
            (
                b.first_target_bytes,
                b.growth_factor,
                b.target_bytes,
                b.min_bytes,
                b.max_rows
            ),
        );
    }

    #[test]
    fn a_declared_row_order_and_a_time_budget_are_never_combinable() {
        // The **whole** truth table, so a third `BatchCutPolicy` or a third `RowOrdering` cannot be
        // added without this test being revisited.
        use BatchCutPolicy::*;
        use RowOrdering::*;
        assert!(!is_timing_dependent(Unordered, SizeOnly));
        assert!(!is_timing_dependent(Unordered, TimeBudgetedFirstBatch));
        assert!(!is_timing_dependent(ByIdentityAscending, SizeOnly));
        assert!(is_timing_dependent(
            ByIdentityAscending,
            TimeBudgetedFirstBatch
        ));
    }

    #[test]
    fn the_cut_precedence_makes_a_time_budget_count_mean_what_it_says() {
        let (target, max_rows) = (1000usize, 10usize);
        // Size wins over everything: a batch that reached its target was going to be cut anyway.
        assert_eq!(
            cut_reason(1000, 1, target, max_rows, true),
            Some(BatchCut::SizeTarget)
        );
        assert_eq!(
            cut_reason(1001, 20, target, max_rows, true),
            Some(BatchCut::SizeTarget)
        );
        // Rows win over the budget, for the same reason.
        assert_eq!(
            cut_reason(10, 10, target, max_rows, true),
            Some(BatchCut::RowCeiling)
        );
        // The budget is reported only where nothing else would have cut — which is what makes it
        // countable as "this batch exists because of lever A".
        assert_eq!(
            cut_reason(10, 1, target, max_rows, true),
            Some(BatchCut::TimeBudget)
        );
        // Disarmed, the same state cuts nothing at all.
        assert_eq!(cut_reason(10, 1, target, max_rows, false), None);
    }

    #[test]
    fn a_budget_cut_is_free_to_land_below_the_minimum_batch_size() {
        // The declared trade, asserted on the decision rather than on two literals: a batch far
        // below `MIN_BATCH_BYTES` is still cut when the budget fires, and is not cut when it does
        // not. An earlier revision "asserted" this as `10 < MIN_BATCH_BYTES`, which is a fact about
        // two constants and says nothing about the code.
        let tiny = MIN_BATCH_BYTES / 8;
        assert_eq!(
            cut_reason(tiny, 1, TARGET_BATCH_BYTES, MAX_ROWS_PER_BATCH, true),
            Some(BatchCut::TimeBudget)
        );
        assert_eq!(
            cut_reason(tiny, 1, TARGET_BATCH_BYTES, MAX_ROWS_PER_BATCH, false),
            None
        );
    }

    // ---- filter composition (`cut/sql-filter` P2) --------------------------------------------
    //
    // `build_sql` is a private method, so the only place that can assert its emitted SQL **text**
    // is a unit test in this module. Exercising it needs a real, opened `Dataset`, and the only way
    // to get one without a hand-authored parquet file is the fixture writer — hence the explicit
    // `fixture` feature gate, rather than relying on this crate's own `[dev-dependencies]` self-
    // reference (`Cargo.toml`) to have turned it on implicitly.
    #[cfg(feature = "fixture")]
    mod filter_composition {
        use super::*;
        use crate::fixture::{write_geoparquet, AttributeMode, FixtureSpec};

        // Carries a `zone` column so E-17's projected cases have a real admitted column to name —
        // `build_sql` never reads the file, so the unprojected cases below are unaffected by it.
        fn test_dataset(name: &str) -> Dataset {
            let dir = std::env::temp_dir()
                .join("spatial-engine-build-sql-tests")
                .join(name);
            std::fs::create_dir_all(&dir).unwrap();
            let path = dir.join("fixture.parquet");
            write_geoparquet(
                &path,
                &FixtureSpec {
                    features: 8,
                    attributes: AttributeMode::CategoricalZone,
                    ..Default::default()
                },
            )
            .expect("fixture");
            Dataset::open(&path).expect("open")
        }

        /// The composition-as-string matrix (`NEXT-CUT.md` P2; condition (4)): `{predicate
        /// present/absent} × {bbox present/absent} × {limit present/absent} × {projection none or
        /// `[zone]`}`, all 16 cells, each checked against the emitted SQL **text** — so the
        /// composition rule (`WHERE ( <predicate verbatim> ) AND <bbox>`, exactly one added paren
        /// pair, predicate leftmost) is verified against code, not prose, and the projection axis
        /// (B1 §4 E-17) proves the `WHERE`/`LIMIT` suffix does not move when a projection is added:
        /// only the `SELECT` prefix differs between a cell's two runs.
        #[test]
        fn the_where_composition_matrix_matches_the_declared_rule_exactly() {
            let ds = test_dataset("composition_matrix");
            let bbox = Bbox {
                xmin: 0.0,
                ymin: 0.0,
                xmax: 1.0,
                ymax: 1.0,
            };
            let predicate =
                || AdmittedPredicate::unchecked_for_composition_test("zone = 'residential'".into());
            let zone_field = arrow::datatypes::Field::new("zone", DataType::Utf8, true);

            const BBOX_COND: &str = "\"bbox\".\"xmin\" <= ? AND \"bbox\".\"xmax\" >= ? AND \
                                      \"bbox\".\"ymin\" <= ? AND \"bbox\".\"ymax\" >= ?";
            const PREFIX: &str = "SELECT \"id\" AS \"id\", \"geometry\" FROM read_parquet(?)";
            const PROJECTED_PREFIX: &str =
                "SELECT \"id\" AS \"id\", \"geometry\", \"zone\" FROM read_parquet(?)";

            // Eight `(filter, bbox, limit)` cells, carried as the WHERE/LIMIT *suffix* alone — the
            // prefix is supplied separately below, once per projection state, so the same suffix
            // string is asserted against both prefixes without being written out twice.
            let cases: [(Option<AdmittedPredicate>, Option<Bbox>, Option<u64>, String); 8] = [
                (None, None, None, String::new()),
                (None, None, Some(7), " LIMIT 7".to_string()),
                (None, Some(bbox), None, format!(" WHERE {BBOX_COND}")),
                (
                    None,
                    Some(bbox),
                    Some(7),
                    format!(" WHERE {BBOX_COND} LIMIT 7"),
                ),
                (
                    Some(predicate()),
                    None,
                    None,
                    " WHERE (zone = 'residential')".to_string(),
                ),
                (
                    Some(predicate()),
                    None,
                    Some(7),
                    " WHERE (zone = 'residential') LIMIT 7".to_string(),
                ),
                (
                    Some(predicate()),
                    Some(bbox),
                    None,
                    format!(" WHERE (zone = 'residential') AND {BBOX_COND}"),
                ),
                (
                    Some(predicate()),
                    Some(bbox),
                    Some(7),
                    format!(" WHERE (zone = 'residential') AND {BBOX_COND} LIMIT 7"),
                ),
            ];

            for (filter, bbox, limit, suffix) in cases {
                let had_filter = filter.is_some();
                let projections: [(&[arrow::datatypes::Field], &str); 2] = [
                    (&[], PREFIX),
                    (std::slice::from_ref(&zone_field), PROJECTED_PREFIX),
                ];
                for (attributes, prefix) in projections {
                    let q = ViewportQuery {
                        bbox,
                        bbox_crs: None,
                        limit,
                        filter: filter.clone(),
                    };
                    let (sql, _plan) = ds
                        .build_sql(&q, IndexUse::Off, attributes, RowOrdering::Unordered)
                        .expect("build_sql");
                    assert_eq!(
                        sql,
                        format!("{prefix}{suffix}"),
                        "cell: filter={had_filter} bbox={} limit={limit:?} projected={}",
                        bbox.is_some(),
                        !attributes.is_empty()
                    );
                }
            }
        }

        /// The predicate's text is never rewritten on the way into the clause — only wrapped in the
        /// one declared paren pair. Odd internal whitespace and casing ride through unexamined.
        #[test]
        fn the_predicate_text_rides_verbatim_never_rewritten_or_case_folded() {
            let ds = test_dataset("verbatim");
            let odd = "  Zone = 'Residential'  ";
            let q = ViewportQuery::all().with_filter(
                AdmittedPredicate::unchecked_for_composition_test(odd.to_string()),
            );
            let (sql, _) = ds
                .build_sql(&q, IndexUse::Off, &[], RowOrdering::Unordered)
                .expect("build_sql");
            assert_eq!(
                sql,
                format!("SELECT \"id\" AS \"id\", \"geometry\" FROM read_parquet(?) WHERE ({odd})")
            );
        }

        /// E-17's projected twin of the test above: a declared `[zone]` projection places the
        /// column after `geometry` in the `SELECT` list, and the `WHERE` clause is exactly as
        /// verbatim as the unprojected case — the predicate text is untouched by the projection.
        #[test]
        fn the_projected_select_prefix_places_declared_columns_after_geometry_and_leaves_where_verbatim(
        ) {
            let ds = test_dataset("projected_verbatim");
            let odd = "  Zone = 'Residential'  ";
            let zone_field = arrow::datatypes::Field::new("zone", DataType::Utf8, true);
            let q = ViewportQuery::all().with_filter(
                AdmittedPredicate::unchecked_for_composition_test(odd.to_string()),
            );
            let (sql, _) = ds
                .build_sql(
                    &q,
                    IndexUse::Off,
                    std::slice::from_ref(&zone_field),
                    RowOrdering::Unordered,
                )
                .expect("build_sql");
            assert_eq!(
                sql,
                format!(
                    "SELECT \"id\" AS \"id\", \"geometry\", \"zone\" FROM read_parquet(?) WHERE ({odd})"
                )
            );
        }
    }
}
