// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Producer-side spans: where a streaming operation's time actually went.
//!
//! ## What this is for
//!
//! `kernel/RESULTS.md`'s fifth section reported a 3,920 ms cancellation window as **one number with
//! three candidate mechanisms** — DuckDB honouring the interrupt, connection teardown, and the
//! notification reaching the consumer — and could not say which. A single number that three
//! different faults would produce identically is not a diagnosis. Spans decompose it.
//!
//! ## Instrument surface, never the wire — the rule this module is built to keep
//!
//! **No span identifier crosses the wire, and no span exists on any wire type.** The frame set in
//! `protocol/data-plane/src/wire.rs` is fixed and closed, `progress_payload` is pinned at exactly 24
//! bytes by its own test, and nothing here adds a tag, a field or a byte to any of them. This is
//! the same standing rule that keeps [`ConnectionFacts`](crate::stream::ConnectionFacts) off SKP:
//! authority is ADR-004 and `docs/10`.
//!
//! **The consequence is deliberate and is a limit, not an oversight.** Producer spans are producer
//! artifacts; a consumer's spans are its own; joining them is the harness's job, using identities
//! that already exist. Nothing was invented to make a join easier, because an identifier minted for
//! tracing is exactly the thing that ends up on the wire six months later.
//!
//! ## Off by default, and why it is a branch rather than a `cfg`
//!
//! A disabled [`mark`] is **one relaxed atomic load and a not-taken branch**; the recording path is
//! `#[cold]` and out of line. It is deliberately *not* `cfg(test)`-gated, for the reason
//! `stream::ATTRIBUTE_CONCATENATIONS` already states: the overhead a results table quotes must be
//! the overhead of the **shipped** binary, and a counter compiled only into a test build would
//! prove that about a build nobody runs. Enabling tracing must not change which code is measured.
//!
//! **Hard rule: no `mark` inside a per-row loop.** The producer's row loop runs once per feature —
//! 3.3 million times on the hero-slice fixture — and already carries a `SeqCst` load per row. Spans
//! are per *operation* and per *batch*. A span site in that loop is the one place the "one relaxed
//! load" argument stops being true, and review should treat it as a defect.
//!
//! ## ADR-004
//!
//! An event is `(&'static str, u64, u64, u64)` — a name that is already in the binary and three
//! integers. Nothing here copies a payload byte, reads a batch buffer, or allocates per event; the
//! backing `Vec` is reserved once. JSONL is produced **after the operation is terminal**, off every
//! hot path, which is where ADR-004 puts instrument surface and where `ConnectionFacts` already
//! lives.

use std::sync::atomic::{AtomicBool, AtomicU64, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Instant;

/// **How many records one trace holds (ADR-010 rule 6). A ceiling, not a hint.**
///
/// The buffer is fixed and pre-allocated, and a trace that fills it **drops further records and
/// counts them — it never blocks and never grows.** Both halves are deliberate. Blocking would put
/// the instrument in the path it is measuring, which is the defect this module's own header forbids;
/// growing would allocate mid-run, which that header also forbids and which the previous revision of
/// this file promised in a comment while `Vec::with_capacity` quietly permitted the opposite.
///
/// **This ceiling is reached in normal use and that is expected.** [`BATCH_FULL`] fires once per
/// batch, and the hero-slice fixture streams 6,637 batches — so a whole-file trace drops roughly
/// 2,500 records. The drop count travels with the artifact and must be printed beside any figure
/// derived from it, because a segment whose endpoint was dropped is missing, not zero.
///
/// **An earlier revision of this comment said "first occurrences are never the records that get
/// dropped". That is false and it was load-bearing, so it is withdrawn with its replacement stated
/// exactly.** Drop-with-count is *positional*, not name-aware: once the buffer is full every later
/// record goes, first occurrence or not. On the hero-slice fixture the buffer fills at about batch
/// 4,090 of 6,637, and everything the publish side stamps after that — `publish_cancel_observed`,
/// `publish_staging_removed`, a late partition's `partition_sync_end` — is a first occurrence that
/// is dropped. The cancellation instant this instrument exists to time is in that list.
///
/// > **The rule that replaces it:** no segment whose endpoint occurs after the buffer filled may be
/// > derived from a trace with `dropped > 0`. In practice that means a trace which dropped anything
/// > supports only segments that close early — the query and first-batch pair — and supports no
/// > publish-side or cancellation segment at all.
///
/// A trace that must carry late events needs a run short enough not to fill the buffer, which is why
/// the cancellation cells cancel within the first few hundred partitions and the consistency cell
/// runs on the 145 MB control.
pub const TRACE_BUFFER_RECORDS: usize = 4096;

/// The single flag every disabled `mark` reads.
///
/// `Relaxed` is correct and is not a shortcut: nothing is published through this flag. A span that
/// is missed in the instant between `enable` and the flag becoming visible to another thread is a
/// missing *instrument* record, and paying for an `Acquire` on the product path to tighten that
/// would be spending the measured path's budget on the unmeasured one.
static ENABLED: AtomicBool = AtomicBool::new(false);

/// The run being traced, if any.
///
/// **One traced stream per traced run — a declared limit (ADR-010 rule 6), not an accident.** The
/// alternative is threading a trace handle through every producer, which would mean changing
/// `SourceFactory::create`'s signature to carry an identity the kernel does not yet have at that
/// point. That is a real design question about the data-plane handshake and it is not this cut's.
/// The consistency demonstration this module exists to support is a single-stream run, so the limit
/// costs nothing today and is recorded so that the day it costs something is visible.
static CURRENT: Mutex<Option<Arc<Trace>>> = Mutex::new(None);

/// One stamped moment on a producer path.
#[derive(Clone, Copy, Debug)]
pub struct Event {
    /// A `&'static str` already in the binary — never a formatted string, so recording allocates
    /// nothing.
    pub name: &'static str,
    /// Nanoseconds since the trace's origin. Stored as an offset rather than an `Instant` so the
    /// record is meaningful after serialization, and monotonic by construction.
    pub offset_nanos: u64,
    pub rows: u64,
    pub bytes: u64,
}

/// What a trace is *about*, from identities that already exist.
///
/// This is the engine's half. `physical_id` and `lease_generation` come from the connection pool
/// and are unique per lease per dataset; **there is deliberately no `stream_id` here**, because the
/// engine does not know one and `engine/tests/slice.rs` exists to keep it that way. The kernel is
/// the only module that knows both halves, so the kernel emits the join.
#[derive(Clone, Debug, Default)]
pub struct TraceKey {
    pub dataset: String,
    pub physical_id: u64,
    pub lease_generation: u64,
    /// Free-form label for the run, so two traces in one artifact directory are tellable apart.
    pub label: String,
}

/// A recording in progress.
pub struct Trace {
    key: TraceKey,
    origin: Instant,
    events: Mutex<Vec<Event>>,
    dropped: AtomicU64,
}

impl Trace {
    fn new(key: TraceKey) -> Self {
        Self {
            key,
            origin: Instant::now(),
            // Allocated once, to its ceiling, and never grown. `with_capacity` alone would only
            // have *delayed* the first reallocation; the length check in `push` is what makes the
            // ceiling real.
            events: Mutex::new(Vec::with_capacity(TRACE_BUFFER_RECORDS)),
            dropped: AtomicU64::new(0),
        }
    }

    fn push(&self, name: &'static str, rows: u64, bytes: u64) {
        let offset_nanos = self.origin.elapsed().as_nanos() as u64;
        let mut events = self.events.lock().unwrap_or_else(|e| e.into_inner());
        // Drop-with-count, never block, never grow — the declared overflow behaviour of
        // [`TRACE_BUFFER_RECORDS`]. Counted under the same lock that guards the buffer, so the
        // count and the length can never disagree about the same record.
        if events.len() >= TRACE_BUFFER_RECORDS {
            self.dropped.fetch_add(1, Ordering::Relaxed);
            return;
        }
        events.push(Event { name, offset_nanos, rows, bytes });
    }

    /// How many records the ceiling refused. **Print this beside every figure derived from a
    /// trace**: a segment whose endpoint was dropped is missing, and a summarizer that renders it
    /// as zero would be the same class of defect this module exists to fix one level up.
    pub fn dropped(&self) -> u64 {
        self.dropped.load(Ordering::Relaxed)
    }

    pub fn key(&self) -> &TraceKey {
        &self.key
    }

    /// Every recorded event, **sorted by its own timestamp**.
    ///
    /// **Push order is not timestamp order, and assuming it was is a real defect rather than a
    /// theoretical one.** `push` reads the clock *before* it takes the buffer lock, and `mark_cold`
    /// takes the global slot lock before that — so with a consumer and a producer both stamping,
    /// which is the normal case, two events can land in the buffer in the opposite order to the
    /// instants they carry. `first()` would then return the later of two, and `segment_ms` could
    /// hand back a negative duration that `to_jsonl` would happily print as `"millis":-0.3`.
    ///
    /// Sorting is stable, so two events sharing a nanosecond keep their push order — the only
    /// tie-break available, and better than an arbitrary one.
    pub fn events(&self) -> Vec<Event> {
        let mut v = self.events.lock().unwrap_or_else(|e| e.into_inner()).clone();
        v.sort_by_key(|e| e.offset_nanos);
        v
    }

    /// The first event with this name, if any. The building block every derived segment uses.
    pub fn first(&self, name: &str) -> Option<Event> {
        self.events().into_iter().find(|e| e.name == name)
    }

    /// Milliseconds between the first `from` and the first `to`.
    ///
    /// `None` rather than `0.0` when either end is missing: a segment that did not happen and a
    /// segment that took no time are different facts, and a summarizer that renders them alike
    /// would be the same defect this module exists to fix one level up.
    pub fn segment_ms(&self, from: &str, to: &str) -> Option<f64> {
        let a = self.first(from)?;
        let b = self.first(to)?;
        // **A segment that runs backwards is refused, not reported.** With `events()` sorted this
        // should be unreachable for a well-formed pair, which is exactly why it is worth keeping:
        // if it ever fires, the pair is wrong or the clock is, and `None` says "this is not
        // derivable" while a negative number would say "this took less than no time".
        if b.offset_nanos < a.offset_nanos {
            return None;
        }
        Some((b.offset_nanos - a.offset_nanos) as f64 / 1_000_000.0)
    }

    /// Every span in the frozen vocabulary that this trace can actually derive, as
    /// `(name, milliseconds)`.
    ///
    /// A span whose either endpoint is absent is **omitted rather than zeroed** — see
    /// [`segment_ms`](Self::segment_ms). A reader therefore distinguishes "this span did not happen"
    /// from "this span took no time" by presence, which is the distinction the whole instrument
    /// exists to preserve.
    pub fn spans(&self) -> Vec<(&'static str, f64)> {
        SPANS.iter().filter_map(|(name, from, to)| self.segment_ms(from, to).map(|ms| (*name, ms))).collect()
    }

    /// One JSON object per line: the key once, then every **event**, then every derived **span**.
    ///
    /// **Events and spans are distinct record kinds and are never merged.** An event is one stamped
    /// instant; a span is an ordered pair of events with a duration. An earlier revision of this file
    /// emitted every event under `"kind":"span"`, which made the artifact claim durations it did not
    /// hold and would have let a reader quote an instant as an interval.
    ///
    /// Hand-rolled rather than `serde_json`, which the kernel carries only as a dev-dependency —
    /// and the shapes here are four fields wide. `kernel/tests/scale_pass_a6.rs` writes its artifact
    /// the same way for the same reason.
    pub fn to_jsonl(&self) -> String {
        let events = self.events();
        let mut s = String::with_capacity(128 * (events.len() + SPANS.len() + 1));
        // The key line carries the buffer's declared ceiling and what it refused, so a figure
        // derived from this artifact can never be quoted without the drop count being in the file.
        s.push_str(&format!(
            "{{\"kind\":\"trace-key\",\"label\":\"{}\",\"dataset\":\"{}\",\"physical_id\":{},\"lease_generation\":{},\"buffer_records\":{},\"dropped_records\":{}}}\n",
            escape(&self.key.label),
            escape(&self.key.dataset),
            self.key.physical_id,
            self.key.lease_generation,
            TRACE_BUFFER_RECORDS,
            self.dropped()
        ));
        for e in &events {
            s.push_str(&format!(
                "{{\"kind\":\"event\",\"name\":\"{}\",\"offset_nanos\":{},\"rows\":{},\"bytes\":{}}}\n",
                escape(e.name),
                e.offset_nanos,
                e.rows,
                e.bytes
            ));
        }
        for (name, ms) in self.spans() {
            s.push_str(&format!(
                "{{\"kind\":\"span\",\"name\":\"{}\",\"millis\":{ms}}}\n",
                escape(name)
            ));
        }
        s
    }
}

fn escape(s: &str) -> String {
    let mut out = String::with_capacity(s.len());
    for c in s.chars() {
        match c {
            '"' => out.push_str("\\\""),
            '\\' => out.push_str("\\\\"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\t' => out.push_str("\\t"),
            c if (c as u32) < 0x20 => out.push_str(&format!("\\u{:04x}", c as u32)),
            c => out.push(c),
        }
    }
    out
}

/// Record a moment, if a trace is running.
///
/// **The disabled cost is the point of this signature.** One `Relaxed` load, one not-taken branch,
/// and nothing else — no `Option` to unwrap, no lock to take, no argument to format. The arguments
/// are integers a caller already has in hand; a site that has to *compute* something to call this
/// is a site that has moved work onto the product path, and belongs behind [`is_enabled`].
#[inline]
pub fn mark(name: &'static str, rows: u64, bytes: u64) {
    if !ENABLED.load(Ordering::Relaxed) {
        return;
    }
    mark_cold(name, rows, bytes);
}

/// Out of line and `#[cold]`, so the enabled path costs the disabled one nothing in code size or
/// branch prediction.
#[cold]
fn mark_cold(name: &'static str, rows: u64, bytes: u64) {
    if let Some(t) = CURRENT.lock().unwrap_or_else(|e| e.into_inner()).as_ref() {
        t.push(name, rows, bytes);
    }
}

/// Whether a trace is running. For call sites whose arguments cost something to compute.
#[inline]
pub fn is_enabled() -> bool {
    ENABLED.load(Ordering::Relaxed)
}

/// Start a trace. Returns a guard that stops it on drop.
///
/// Refuses if one is already running rather than silently replacing it — the same reasoning as
/// [`CancelToken::attach`](crate::cancel::CancelToken), where overwriting a slot would disarm
/// something already relying on it, here by scattering one run's spans across two traces.
pub fn start(key: TraceKey) -> Option<TraceGuard> {
    let mut slot = CURRENT.lock().unwrap_or_else(|e| e.into_inner());
    if slot.is_some() {
        return None;
    }
    let trace = Arc::new(Trace::new(key));
    *slot = Some(Arc::clone(&trace));
    // Published *after* the trace is in place, so no mark can find an enabled flag and no trace.
    ENABLED.store(true, Ordering::SeqCst);
    Some(TraceGuard { trace })
}

/// Stops the trace when dropped, so a panicking measurement cannot leave tracing on for whatever
/// runs next in the same process.
pub struct TraceGuard {
    trace: Arc<Trace>,
}

impl TraceGuard {
    pub fn trace(&self) -> Arc<Trace> {
        Arc::clone(&self.trace)
    }
}

impl Drop for TraceGuard {
    fn drop(&mut self) {
        ENABLED.store(false, Ordering::SeqCst);
        *CURRENT.lock().unwrap_or_else(|e| e.into_inner()) = None;
    }
}

// ---------------------------------------------------------------------------------------------
// Span names. `&'static str` constants rather than literals at the call sites, so a summarizer and
// a producer cannot disagree about spelling — the failure mode where a segment silently becomes
// `None` because one side wrote `first_batch` and the other `first-batch`.
// ---------------------------------------------------------------------------------------------

/// The operation was admitted and its clock started. Stamped by the **caller** — the engine is
/// handed a request, it does not accept one — so this is the one event a producer cannot emit for
/// itself.
pub const REQUEST_ACCEPTED: &str = "request_accepted";
/// `cancel()` returned to whoever called it — **`cancel_requested`, the first of the three
/// cancellation instants** and the only one the canceller itself can stamp.
///
/// ## The other two instants live where the operations do, deliberately
///
/// `cancel_observed` (the worker stopped advancing — **what `docs/08` budgets**) and
/// `cancel_acknowledged` (the operation quiescent — what `kernel/RESULTS.md`'s fifth section
/// actually measured) are **not** declared here, because this module has no operation to stamp them
/// for. Each worker stamps its own, and there is more than one worker:
///
/// | instant | producer side | publish side |
/// |---|---|---|
/// | `cancel_requested` | this constant | this constant |
/// | `cancel_observed` | [`PRODUCER_CANCELLED`] | `publish::trace_names::CANCEL_OBSERVED` |
/// | `cancel_acknowledged` | [`PRODUCER_FINISHED`] | `publish::trace_names::STAGING_REMOVED` + return |
///
/// **Generic `cancellation_observed` / `cancellation_acknowledged` names are deliberately absent.**
/// Nothing would emit them, and a name in the vocabulary that never appears in an artifact reads as
/// "this did not happen" rather than "this is not built" — the exact failure the [`SPANS`] table
/// avoids by listing only derivable pairs.
pub const CANCELLATION_REQUESTED: &str = "cancellation_requested";

/// `build_sql` returned on the **caller's** thread, before a lease exists and before a producer
/// thread is spawned. Stamped here rather than inferred: `build_sql` runs strictly before
/// [`LEASE_ACQUIRED`] (`stream_inner` calls it first — the seam behind every entry point that opens
/// a stream, including the publish path), so it is outside the attributed `lease_to_first_row`
/// window by construction — see [`SPAN_LEASE_BIND`], which reports it rather than folding it into
/// any scored segment.
///
/// **The earliest-firing event in the vocabulary, which matters under this module's declared "one
/// traced stream per traced run" limit** (see `CURRENT`'s doc, above): a traced run that opens a
/// second stream after the first fails but before it is dropped would let this event pair with the
/// wrong stream's later events, since [`Trace::first`] is name-global, not stream-scoped. No traced
/// cell today opens two streams in one trace; a harness that ever does must not rely on this event.
pub const SQL_BUILT: &str = "sql_built";
/// The lease was acquired and the cancellation token bound to its connection.
pub const LEASE_ACQUIRED: &str = "lease_acquired";
/// The first statement in `produce()`'s body, on the newly spawned producer thread — before the
/// pre-prepare cancellation check. Separates thread-spawn/handoff cost ([`SPAN_PRODUCER_HANDOFF`])
/// from `conn.prepare()`'s own cost ([`SPAN_STATEMENT_PREPARE`]), which a single event bracketing
/// both would have conflated.
pub const PRODUCER_STARTED: &str = "producer_started";
/// The SQL statement was prepared (`conn.prepare()` returned). **This is not "planning" in the
/// query-planner sense** — the file path is a bound parameter (`FROM read_parquet(?)`), so DuckDB
/// cannot open the file, read its footer, or plan the scan at this point; it does not yet know
/// which file. What `conn.prepare()` costs here is settled by [`SPAN_STATEMENT_PREPARE`], not
/// assumed.
pub const SQL_PREPARED: &str = "sql_prepared";
/// Immediately before `stmt.stream_arrow(params)` is called — after parameters are assembled and
/// the cancellation check that follows them. See [`SPAN_PARAM_ASSEMBLY`] and
/// [`SPAN_BIND_AND_EXECUTE`].
pub const EXECUTE_CALLED: &str = "execute_called";
/// `stream_arrow` returned. **This call binds parameters and executes in one step** — the vendored
/// `duckdb` crate has no public API that separates them *on this path*, so
/// [`SPAN_BIND_AND_EXECUTE`] (`execute_called` → `execute_returned`) may never be quoted as either
/// half alone. (`Statement::raw_bind_parameter` does separate binding from execution, but only
/// pairs with `raw_query`/`raw_execute`, not with `stream_arrow`'s `execute_streaming`, which is
/// `pub(crate)` — reaching it would mean forking the vendored crate, which the architect's ruling
/// rules out for the same reason `trace.rs`'s own header refuses `cfg(test)`-gated tracing: a
/// measurement against a locally patched dependency describes a binary nobody ships.)
pub const EXECUTE_RETURNED: &str = "execute_returned";
/// The first chunk arrived from DuckDB.
///
/// **A previous revision of this doc called this "the end of the sort".** Withdrawn along with
/// [`SPAN_QUERY`]'s equivalent claim — see that constant's doc for why.
pub const FIRST_SOURCE_ROW: &str = "first_source_row";
/// The producer completed its first batch and offered it to the consumer.
pub const FIRST_BATCH_FULL: &str = "first_batch_full";
/// Every batch the producer completes, carrying its rows and estimated bytes.
pub const BATCH_FULL: &str = "batch_full";
/// The producer observed cancellation.
pub const PRODUCER_CANCELLED: &str = "producer_cancelled";
/// The producer's lease was resolved and its work is over.
pub const PRODUCER_FINISHED: &str = "producer_finished";

// ---------------------------------------------------------------------------------------------
// Spans. **A span is an ordered pair of events with a duration — never an instant.** Named here
// once, as `(span, from_event, to_event)`, so the producer, the summarizer and the write-up cannot
// disagree about which pair a name refers to.
// ---------------------------------------------------------------------------------------------

/// Request admitted → the lease bound to a connection.
pub const SPAN_LEASE_ACQUIRE: &str = "lease_acquire";
/// Statement prepared → the first row out of DuckDB.
///
/// **A previous revision of this doc called this span "the sort".** That claim was drawn from a
/// cell (`kernel/tests/cancel_rescore.rs`'s consistency demonstration) that runs
/// `ViewportQuery::all()` — `RowOrdering::Unordered`, no `ORDER BY` at all. There is no sort in
/// that query, so nothing established where a sort would happen; the label is withdrawn and the
/// question `kernel/CANCELLATION-AND-TRACING.md` §2 asked remains open. The measured split itself
/// (`sql_prepared → execute_returned` dominant over `execute_returned → first_source_row`) stands;
/// only the causal story attached to it is retracted. See `kernel/RESULTS.md`'s eighth section.
pub const SPAN_QUERY: &str = "query";
/// First source row → the producer's first completed batch.
pub const SPAN_SOURCE_TO_FIRST_BATCH: &str = "source_to_first_batch";

/// `sql_built` → `lease_acquired`. **Reported, never scored** (docs/07 scope bound): the path's
/// UTF-8 conversion, `lease_for_stream`'s pool acquire / connection open / PRAGMA configuration /
/// interrupt-token attach, and `ConnectionFacts` construction —
/// `kernel/CANCELLATION-AND-TRACING.md` §3's unbounded class-(b) section, which nothing had ever
/// measured before this cut. A lever against it is a separate, undesignated future phase, not this
/// one's.
pub const SPAN_LEASE_BIND: &str = "lease_bind";
/// `lease_acquired` → `producer_started`. Thread spawn and the cross-thread handoff: cloning the
/// geometry column name, the `Arc<StreamStats>`, the cancel token and the `BatchEnvelope`
/// (CRS + identity + attribute fields), allocating the batch channel, and naming/spawning the
/// producer thread. **If this segment is large, do not assume the cost is the spawn itself** — the
/// envelope clone is the one call here with unbounded-by-schema size.
pub const SPAN_PRODUCER_HANDOFF: &str = "producer_handoff";
/// `producer_started` → `sql_prepared`. `conn.prepare()` plus the pre-prepare cancellation check
/// that precedes it (the same disclosure [`SPAN_PARAM_ASSEMBLY`] makes for its own check) —
/// **the only segment a prepared-statement-reuse lever can remove.** The Phase-1 decision rule is
/// scored against this segment's share of [`SPAN_LEASE_TO_FIRST_ROW`].
pub const SPAN_STATEMENT_PREPARE: &str = "statement_prepare";
/// `sql_prepared` → `execute_called`. Parameter-`Vec` construction plus one cancellation check —
/// named so it is not inferred by subtracting the other segments from `query`.
pub const SPAN_PARAM_ASSEMBLY: &str = "param_assembly";
/// `execute_called` → `execute_returned`. Brackets exactly `Statement::stream_arrow`, which binds
/// parameters **and** executes in one call. Never quotable as "bind" or "execute" alone — see
/// [`EXECUTE_RETURNED`].
pub const SPAN_BIND_AND_EXECUTE: &str = "bind_and_execute";
/// `execute_returned` → `first_source_row`. The first chunk carrying rows, once `stream_arrow` has
/// already returned.
pub const SPAN_FIRST_FETCH: &str = "first_fetch";
/// `lease_acquired` → `first_source_row`. **The window Phase 1 attributes.** Wider than
/// [`SPAN_QUERY`] by exactly [`SPAN_PRODUCER_HANDOFF`] + [`SPAN_STATEMENT_PREPARE`] — the brief's
/// own description of "the query window" as "lease acquired → first source row" named this span,
/// not `query`, and the decision rule is scored against it so that `statement_prepare` (outside
/// `query`) is not structurally excluded from ever being found dominant.
///
/// **This span is a composite of `producer_handoff` + `statement_prepare` + `query` (itself
/// `param_assembly` + `bind_and_execute` + `first_fetch`), not a disjoint sibling of them.** A
/// summarizer that sums every entry in [`SPANS`] to get "the window" double-counts: `query` and
/// `lease_to_first_row` each restate segments also reported individually. Report the five
/// leaf segments and the two composites side by side, never summed together.
pub const SPAN_LEASE_TO_FIRST_ROW: &str = "lease_to_first_row";

/// The spans this cut derives, and the event pair each one means.
///
/// **Reserved but deliberately not implemented, named so the vocabulary does not mislead:**
/// `encode` (one opaque `write_ipc_into` on the *consumer* thread — measurable only as a pair
/// around `next_into`, which is a different boundary than the name implies), `wire_send` and
/// `consumer_decode` (consumer-side, and a consumer's clock is never differenced against a
/// producer's). Adding a name here without the events to back it would produce a span that is
/// always absent, which reads as "did not happen" rather than "not built".
/// **`lease_acquire` is reserved, not derived.** Its opening event [`REQUEST_ACCEPTED`] is stamped
/// by the caller that admits an operation, and no site in this workspace does so yet — so listing it
/// here would produce exactly the always-absent span this doc warns against. It moves into the table
/// on the commit that emits the event, not before.
pub const SPANS: &[(&str, &str, &str)] = &[
    (SPAN_QUERY, SQL_PREPARED, FIRST_SOURCE_ROW),
    (SPAN_SOURCE_TO_FIRST_BATCH, FIRST_SOURCE_ROW, FIRST_BATCH_FULL),
    (SPAN_LEASE_BIND, SQL_BUILT, LEASE_ACQUIRED),
    (SPAN_PRODUCER_HANDOFF, LEASE_ACQUIRED, PRODUCER_STARTED),
    (SPAN_STATEMENT_PREPARE, PRODUCER_STARTED, SQL_PREPARED),
    (SPAN_PARAM_ASSEMBLY, SQL_PREPARED, EXECUTE_CALLED),
    (SPAN_BIND_AND_EXECUTE, EXECUTE_CALLED, EXECUTE_RETURNED),
    (SPAN_FIRST_FETCH, EXECUTE_RETURNED, FIRST_SOURCE_ROW),
    (SPAN_LEASE_TO_FIRST_ROW, LEASE_ACQUIRED, FIRST_SOURCE_ROW),
];

#[cfg(test)]
mod tests {
    use super::*;

    /// **`SPANS` is the contract every summarizer reads; a silent edit to it must fail a test, not
    /// just a downstream figure.** Two properties this cut's arithmetic depends on, checked
    /// structurally rather than by re-deriving them from literals: every span name is unique, and no
    /// two entries share an `(from, to)` pair (which would make two differently-named spans always
    /// report the identical duration — a defect the previous version of this table could not have
    /// had with two entries, but a nine-entry table can).
    #[test]
    fn spans_table_has_unique_names_and_unique_event_pairs() {
        let mut names: Vec<&str> = SPANS.iter().map(|(name, _, _)| *name).collect();
        names.sort_unstable();
        names.dedup();
        assert_eq!(names.len(), SPANS.len(), "a span name is reused");

        let mut pairs: Vec<(&str, &str)> = SPANS.iter().map(|(_, from, to)| (*from, *to)).collect();
        pairs.sort_unstable();
        pairs.dedup();
        assert_eq!(pairs.len(), SPANS.len(), "two spans share the same (from, to) event pair");
    }

    /// **Additivity of `SPANS` itself, checked structurally — this is the test that catches a
    /// re-pointed entry, not the nanosecond one below.** A previous revision of this test built every
    /// leg from hard-coded event constants rather than from `SPANS`, so its own doc claimed table-edit
    /// protection the test could not provide: review found that re-pointing
    /// `SPAN_STATEMENT_PREPARE` at `(LEASE_ACQUIRED, SQL_PREPARED)` — silently overlapping
    /// `producer_handoff` and corrupting the eighth section's arithmetic by exactly one segment —
    /// passed every test in the workspace, because none of them looked the pair up in the table they
    /// were meant to be checking.
    ///
    /// This one does: each leg's `(from, to)` is resolved by name **from `SPANS`**, so a re-point is
    /// caught here even though every event pair in isolation is still a duplicate-free, valid entry
    /// (`spans_table_has_unique_names_and_unique_event_pairs` cannot catch it — uniqueness and
    /// telescoping are different properties). No trace, no marks, no timing — this is pure structure
    /// over the table's declared pairs.
    #[test]
    fn the_spans_table_telescopes_by_construction() {
        fn pair(name: &str) -> (&'static str, &'static str) {
            let (_, from, to) = SPANS.iter().find(|(n, _, _)| *n == name).unwrap_or_else(|| {
                panic!("{name} must be a span in SPANS for this chain to be checkable")
            });
            (from, to)
        }

        let five_leg = [
            SPAN_PRODUCER_HANDOFF,
            SPAN_STATEMENT_PREPARE,
            SPAN_PARAM_ASSEMBLY,
            SPAN_BIND_AND_EXECUTE,
            SPAN_FIRST_FETCH,
        ];
        for w in five_leg.windows(2) {
            assert_eq!(
                pair(w[0]).1,
                pair(w[1]).0,
                "{} must close on the event {} opens on, for lease_to_first_row to telescope",
                w[0],
                w[1]
            );
        }
        assert_eq!(
            pair(five_leg[0]).0,
            pair(SPAN_LEASE_TO_FIRST_ROW).0,
            "the five-leg chain must open where lease_to_first_row opens"
        );
        assert_eq!(
            pair(*five_leg.last().unwrap()).1,
            pair(SPAN_LEASE_TO_FIRST_ROW).1,
            "the five-leg chain must close where lease_to_first_row closes"
        );

        let three_leg = [SPAN_PARAM_ASSEMBLY, SPAN_BIND_AND_EXECUTE, SPAN_FIRST_FETCH];
        for w in three_leg.windows(2) {
            assert_eq!(pair(w[0]).1, pair(w[1]).0, "{} must close where {} opens, for query", w[0], w[1]);
        }
        assert_eq!(pair(three_leg[0]).0, pair(SPAN_QUERY).0, "the three-leg chain must open where query opens");
        assert_eq!(
            pair(*three_leg.last().unwrap()).1,
            pair(SPAN_QUERY).1,
            "the three-leg chain must close where query closes"
        );
    }

    /// **Not a table-edit guard — [`the_spans_table_telescopes_by_construction`] is that test.** This
    /// one proves a narrower thing: that the millisecond API every summarizer actually calls
    /// (`Trace::segment_ms`, which divides by 1e6) does not lose additivity that the raw
    /// `offset_nanos` integers provably have. A tight `mark` loop puts every leg microseconds apart,
    /// so the f64 rounding error this test can actually exercise is on the order of 1e-16 — far under
    /// the `1e-6` tolerance below — which is disclosed rather than presented as a stress test of the
    /// boundary.
    #[test]
    fn the_query_windows_events_telescope_exactly() {
        let _serial = TEST_LOCK.lock().unwrap_or_else(|e| e.into_inner());
        let guard = start(TraceKey::default()).expect("no other trace is running");
        // A tight, deliberate sequence — not a real stream — so the only thing under test is the
        // arithmetic, not scheduling. Real gaps between these marks are exercised by
        // `kernel/tests/trace_spans.rs`'s `the_query_windows_internal_spans_are_all_present_and_ordered`.
        for name in [
            SQL_BUILT,
            LEASE_ACQUIRED,
            PRODUCER_STARTED,
            SQL_PREPARED,
            EXECUTE_CALLED,
            EXECUTE_RETURNED,
            FIRST_SOURCE_ROW,
        ] {
            mark(name, 0, 0);
        }
        let t = guard.trace();

        let leg = |from: &str, to: &str| -> u64 {
            let a = t.first(from).unwrap();
            let b = t.first(to).unwrap();
            b.offset_nanos - a.offset_nanos
        };

        // Exact, in the unit the marks are actually stored in.
        let five_leg_nanos = leg(LEASE_ACQUIRED, PRODUCER_STARTED)
            + leg(PRODUCER_STARTED, SQL_PREPARED)
            + leg(SQL_PREPARED, EXECUTE_CALLED)
            + leg(EXECUTE_CALLED, EXECUTE_RETURNED)
            + leg(EXECUTE_RETURNED, FIRST_SOURCE_ROW);
        assert_eq!(five_leg_nanos, leg(LEASE_ACQUIRED, FIRST_SOURCE_ROW), "lease_to_first_row, in nanos");

        let three_leg_nanos = leg(SQL_PREPARED, EXECUTE_CALLED)
            + leg(EXECUTE_CALLED, EXECUTE_RETURNED)
            + leg(EXECUTE_RETURNED, FIRST_SOURCE_ROW);
        assert_eq!(three_leg_nanos, leg(SQL_PREPARED, FIRST_SOURCE_ROW), "query, in nanos");

        // The millisecond API every summarizer actually calls — within a tolerance, because f64
        // division does not guarantee the sum of parts equals the whole to the last bit.
        let leg_ms = |from: &str, to: &str| t.segment_ms(from, to).unwrap();
        let five_leg_ms = leg_ms(LEASE_ACQUIRED, PRODUCER_STARTED)
            + leg_ms(PRODUCER_STARTED, SQL_PREPARED)
            + leg_ms(SQL_PREPARED, EXECUTE_CALLED)
            + leg_ms(EXECUTE_CALLED, EXECUTE_RETURNED)
            + leg_ms(EXECUTE_RETURNED, FIRST_SOURCE_ROW);
        let whole_ms = t.segment_ms(LEASE_ACQUIRED, FIRST_SOURCE_ROW).unwrap();
        assert!(
            (five_leg_ms - whole_ms).abs() < 1e-6,
            "lease_to_first_row, in ms: {five_leg_ms} vs {whole_ms}"
        );

        drop(guard);
    }

    /// **`CURRENT` is process-global by design, and `cargo test` runs tests as threads in one
    /// process** — so two trace-using tests would otherwise race for the single slot and one would
    /// fail `start`. That is the declared "one traced stream per traced run" limit behaving exactly
    /// as documented, surfacing in the test harness rather than in a product path. Serializing here
    /// is the honest fix; loosening the refusal to make tests pass would delete the property.
    static TEST_LOCK: Mutex<()> = Mutex::new(());

    #[test]
    fn a_disabled_mark_records_nothing_and_a_started_trace_records_in_order() {
        let _serial = TEST_LOCK.lock().unwrap_or_else(|e| e.into_inner());
        // No trace running: the mark is a no-op rather than a panic or a queued event.
        mark("ignored", 1, 1);

        let guard = start(TraceKey {
            dataset: "d".into(),
            physical_id: 7,
            lease_generation: 2,
            label: "unit".into(),
        })
        .expect("no other trace is running");
        mark(SQL_PREPARED, 0, 0);
        mark(FIRST_SOURCE_ROW, 1, 0);
        let t = guard.trace();
        let names: Vec<_> = t.events().into_iter().map(|e| e.name).collect();
        assert_eq!(names, vec![SQL_PREPARED, FIRST_SOURCE_ROW]);
        assert!(t.segment_ms(SQL_PREPARED, FIRST_SOURCE_ROW).is_some());
        assert!(
            t.segment_ms(SQL_PREPARED, "never_happened").is_none(),
            "a segment with a missing end is None, not zero"
        );
        drop(guard);

        // The guard turned it off, so a later mark is a no-op again.
        assert!(!is_enabled());
        mark("after", 1, 1);
    }

    #[test]
    fn a_second_trace_is_refused_rather_than_replacing_the_first() {
        let _serial = TEST_LOCK.lock().unwrap_or_else(|e| e.into_inner());
        let a = start(TraceKey::default()).expect("first starts");
        assert!(start(TraceKey::default()).is_none(), "a second trace must be refused");
        drop(a);
        // And the refusal is not permanent.
        assert!(start(TraceKey::default()).is_some());
    }

    #[test]
    fn jsonl_is_one_object_per_line_and_escapes_its_strings() {
        let _serial = TEST_LOCK.lock().unwrap_or_else(|e| e.into_inner());
        let guard = start(TraceKey {
            dataset: r#"C:\a\"b"#.into(),
            physical_id: 1,
            lease_generation: 1,
            label: "esc".into(),
        })
        .unwrap();
        mark(BATCH_FULL, 10, 20);
        let jsonl = guard.trace().to_jsonl();
        let lines: Vec<_> = jsonl.lines().collect();
        assert_eq!(lines.len(), 2, "one key line plus one span line");
        assert!(lines[0].contains(r#"\\a\\\"b"#), "backslashes and quotes are escaped: {}", lines[0]);
        assert!(lines[1].contains(r#""rows":10"#));
        assert!(lines.iter().all(|l| l.starts_with('{') && l.ends_with('}')));
    }
}
