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
/// derived from it, because a segment whose endpoint was dropped is missing, not zero. Every segment
/// the consistency demonstration needs is a *first* occurrence, and first occurrences are never the
/// records that get dropped.
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

    pub fn events(&self) -> Vec<Event> {
        self.events.lock().unwrap_or_else(|e| e.into_inner()).clone()
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
        Some((b.offset_nanos as f64 - a.offset_nanos as f64) / 1_000_000.0)
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

/// The lease was acquired and the cancellation token bound to its connection.
pub const LEASE_ACQUIRED: &str = "lease_acquired";
/// The SQL statement was prepared. Whether the sort happens here or at the first fetch is exactly
/// what this and [`EXECUTE_RETURNED`] exist to settle — nothing in this repository establishes it.
pub const SQL_PREPARED: &str = "sql_prepared";
/// `stream_arrow` returned. See [`SQL_PREPARED`].
pub const EXECUTE_RETURNED: &str = "execute_returned";
/// The first chunk arrived from DuckDB — the end of the sort, whatever else it is.
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
/// Statement prepared → the first row out of DuckDB. **This is the sort**, and it is the span that
/// finally names the window `kernel/RESULTS.md`'s fifth section could only measure from outside.
pub const SPAN_QUERY: &str = "query";
/// First source row → the producer's first completed batch.
pub const SPAN_SOURCE_TO_FIRST_BATCH: &str = "source_to_first_batch";

/// The spans this cut derives, and the event pair each one means.
///
/// **Reserved but deliberately not implemented, named so the vocabulary does not mislead:**
/// `encode` (one opaque `write_ipc_into` on the *consumer* thread — measurable only as a pair
/// around `next_into`, which is a different boundary than the name implies), `wire_send` and
/// `consumer_decode` (consumer-side, and a consumer's clock is never differenced against a
/// producer's). Adding a name here without the events to back it would produce a span that is
/// always absent, which reads as "did not happen" rather than "not built".
pub const SPANS: &[(&str, &str, &str)] = &[
    (SPAN_LEASE_ACQUIRE, REQUEST_ACCEPTED, LEASE_ACQUIRED),
    (SPAN_QUERY, SQL_PREPARED, FIRST_SOURCE_ROW),
    (SPAN_SOURCE_TO_FIRST_BATCH, FIRST_SOURCE_ROW, FIRST_BATCH_FULL),
];

#[cfg(test)]
mod tests {
    use super::*;

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
