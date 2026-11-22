// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Cancellation that reaches the query, not just the loop around it.
//!
//! ADR-004 amendment 2 disqualified the Tauri custom protocol as the data plane because "a client
//! abort never reaches the producer, so the kernel keeps computing cancelled work, violating
//! `docs/01` principle 7". A cancel flag polled between batches has the same defect in a smaller
//! place: a filter that scans for seconds before its first batch would keep scanning. So
//! `CancelToken::cancel` calls DuckDB's own interrupt on the connection running the query, and the
//! between-batch check is the second line of defence rather than the only one — qualified by
//! `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`: DuckDB clears its own interrupt flag in
//! `ClientContext::InitialCleanup`, which `Prepare` and `PendingQueryPreparedInternal` reach among
//! others, and in `RunFunctionInTransactionInternal` only when that function opens an auto-commit
//! transaction (§10 Amendment 1, item 2, enumerates the clearing functions), so an interrupt raised
//! between `attach` and the moment execution actually begins is not, by itself, guaranteed to reach
//! the query it was meant for. The window guard below (`CancelToken::execute_guarded`) is what
//! closes that gap: it checks the flag immediately before running the closure that executes, and
//! re-raises the interrupt on a timer for as long as that closure is in flight, so a cancel landing
//! anywhere in the window is either seen before execution starts or re-delivered while it runs.
//!
//! `docs/08`'s budget is "Cancellation acknowledged < 100 ms, **any operation**" — including the
//! operation that has not produced anything yet.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use std::time::Duration;

use duckdb::InterruptHandle;

/// How often the re-interrupter (`CancelToken::cancel_inner`) re-raises DuckDB's interrupt while a
/// guarded execute is in flight. Bounds only how often the thread looks; it bounds no latency —
/// DuckDB's reaction and thread scheduling are a separate class (`docs/08`, ADR-018 item 4). Same
/// precedent as `PUBLISH_STREAM_POLL_INTERVAL` (`engine/src/stream.rs:199`).
const REINTERRUPT_INTERVAL: Duration = Duration::from_millis(10);

#[derive(Clone, Default)]
pub struct CancelToken {
    inner: Arc<Inner>,
}

#[derive(Default)]
struct Inner {
    cancelled: AtomicBool,
    /// Present from the moment a query is bound to this token. `attach` interrupts immediately if
    /// the flag is already set, but that interrupt is **not latched**: on an idle connection DuckDB
    /// does not carry it into the next query (`an_interrupt_on_an_idle_connection_is_not_latched`),
    /// and it clears its own flag at the start of `prepare` and of execution. So this field is not
    /// what stops a query cancelled before `attach` or before `prepare`. That is a flag check:
    /// `stream::produce`'s check before it prepares, and `execute_guarded`'s step 2 — **qualified:**
    /// only for a caller that checks under the guard; a caller that executes without it has no such
    /// check. What the interrupt through this field does reach is a query already running, which is
    /// what `cancel_inner` and its re-interrupter raise it against.
    interrupt: Mutex<Option<Arc<InterruptHandle>>>,
    /// Set for exactly the duration of one `execute_guarded` closure. Read by the re-interrupter
    /// thread and by the `is_executing` instrument accessor.
    in_execute: AtomicBool,
    /// Held while `cancel_inner` decides who cancels first, stamps the request and publishes the
    /// flag. Every writer of `cancelled` holds it, so one call per token sees the flag unset.
    transition: Mutex<()>,
    /// The test build's seams in `cancel_inner` (form §2.3). Absent from the shipped build.
    #[cfg(test)]
    seams: Seams,
}

/// One point in `cancel_inner` where a test can hold, observe or panic. Test build only.
#[cfg(test)]
#[derive(Clone, Copy)]
pub(crate) enum Seam {
    /// `transition.try_lock()` fails before the call takes the lock.
    OnContended,
    /// In the stamping step, whether or not the call stamps, before the mark.
    BeforeStamp,
    /// Right after the mark.
    OnStamp,
    /// Right after the flag is published.
    AfterPublish,
}

/// A seam's action. It runs on the first call that reaches its seam and passes every later call.
#[cfg(test)]
#[derive(Default)]
struct Seams {
    on_contended: Mutex<Option<Box<dyn FnOnce() + Send>>>,
    before_stamp: Mutex<Option<Box<dyn FnOnce() + Send>>>,
    on_stamp: Mutex<Option<Box<dyn FnOnce() + Send>>>,
    after_publish: Mutex<Option<Box<dyn FnOnce() + Send>>>,
    /// How many times this token's own stamp decision reached the mark.
    stamps: std::sync::atomic::AtomicUsize,
}

/// Publishes `Inner::cancelled` when dropped, so an unwind out of the request's stamp cannot leave
/// the token uncancelled.
struct PublishOnDrop<'a>(&'a AtomicBool);

impl Drop for PublishOnDrop<'_> {
    fn drop(&mut self) {
        self.0.store(true, Ordering::SeqCst);
    }
}

/// Clears `Inner::in_execute` when dropped, so an unwind out of the guarded closure cannot leave the
/// flag set.
struct WindowOpen<'a>(&'a AtomicBool);

impl Drop for WindowOpen<'_> {
    fn drop(&mut self) {
        self.0.store(false, Ordering::SeqCst);
    }
}

/// The outcome of running a closure through [`CancelToken::execute_guarded`].
pub(crate) enum Guarded<T, E> {
    /// The closure ran and returned `Ok`, and no cancel was observed either before it started or
    /// after it returned.
    Ok(T),
    /// The closure ran and returned `Err`; unchanged from what the closure itself produced.
    Err(E),
    /// Either the closure never ran (a cancel was already set when the window opened) or it ran
    /// and returned `Ok` but a cancel was observed by the time it returned. Either way the caller
    /// must treat this as cancelled, not as the closure's own result.
    Cancelled,
}

impl<T> Guarded<T, crate::error::EngineError> {
    /// The `Result` a caller returning `EngineError` wants: `Cancelled` becomes
    /// `EngineError::Cancelled`; the closure's own `Ok` and `Err` pass through unchanged.
    pub(crate) fn into_result(self) -> crate::error::Result<T> {
        match self {
            Guarded::Ok(v) => Ok(v),
            Guarded::Err(e) => Err(e),
            Guarded::Cancelled => Err(crate::error::EngineError::Cancelled),
        }
    }
}

impl CancelToken {
    pub fn new() -> Self {
        Self::default()
    }

    /// Request cancellation. Sets the flag **before** interrupting, so any thread that observes the
    /// interrupt's error can already tell why it happened.
    ///
    /// Stamps [`trace::CANCELLATION_REQUESTED`](crate::trace::CANCELLATION_REQUESTED), when a trace
    /// is running, at most once per token, under the token's `transition` lock and **before the flag
    /// is published**, so the stamp precedes every observer that loads the flag. It is the **first
    /// of the three cancellation instants**, and the only one the canceller itself can stamp. The
    /// other two belong to whoever owns the operation: `cancel_observed` (the worker stopped
    /// advancing — what `docs/08` budgets) and `cancel_acknowledged` (the operation quiescent).
    /// A latency quoted without naming which pair of instants it spans is not a latency.
    pub fn cancel(&self) {
        self.cancel_inner(true);
    }

    /// Cancel **without** stamping a cancellation instant.
    ///
    /// **Exists for exactly one caller: [`BatchStream`](crate::stream::BatchStream)'s `Drop`**,
    /// which cancels on *every* drop including a stream that ran to completion — that is what stops
    /// an abandoned stream, and this module's own header explains why it must. But it means a
    /// successful run also calls `cancel()`, and a trace that stamped there would record a
    /// cancellation request in an operation nobody cancelled. Confirmed in a real artifact during
    /// review: `producer_finished` at 169.68 ms followed by `cancellation_requested` at 170.32 ms,
    /// on a run with no cancel in it.
    ///
    /// `Drop`'s comment already records that the flag "cannot tell 'cancelled' from 'finished'". A
    /// stamp inherits that ambiguity, and the frozen semantics in `kernel/CANCELLATION-AND-TRACING.md`
    /// §2 assert the opposite — so the stamp has to come from the caller that meant it.
    pub(crate) fn cancel_for_drop(&self) {
        self.cancel_inner(false);
    }

    /// **Stamps at most once, on the false→true transition, under `transition` and before the flag
    /// is published.** A token cancelled twice is one cancellation request; two stamps would give a
    /// summarizer two candidate origins for the same interval, and `Trace::first` would pick
    /// whichever was pushed first rather than the earliest. A caller that finds the flag already set
    /// stamps nothing and returns once the winner has published, so `is_cancelled()` is true when
    /// any `cancel()` returns.
    fn cancel_inner(&self, stamp: bool) {
        #[cfg(test)]
        if matches!(
            self.inner.transition.try_lock(),
            Err(std::sync::TryLockError::WouldBlock)
        ) {
            self.fire(Seam::OnContended);
        }
        let first = {
            let _transition = self
                .inner
                .transition
                .lock()
                .unwrap_or_else(|e| e.into_inner());
            if self.inner.cancelled.load(Ordering::SeqCst) {
                false
            } else {
                // Publishes when dropped, an unwind out of the stamp included.
                let publish = PublishOnDrop(&self.inner.cancelled);
                #[cfg(test)]
                self.fire(Seam::BeforeStamp);
                if stamp {
                    crate::trace::mark(crate::trace::CANCELLATION_REQUESTED, 0, 0);
                    #[cfg(test)]
                    {
                        self.inner.seams.stamps.fetch_add(1, Ordering::SeqCst);
                        self.fire(Seam::OnStamp);
                    }
                }
                drop(publish);
                #[cfg(test)]
                self.fire(Seam::AfterPublish);
                true
            }
        };
        if let Some(h) = self
            .inner
            .interrupt
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .as_ref()
        {
            h.interrupt();
        }
        // The re-interrupter: spawned at most once per token, on the false→true transition only,
        // and only when an execute is actually in flight right now. It exists because the interrupt
        // just above can land in the window DuckDB clears on execution's own start (this module's
        // header) — if that happens, nothing raised here reaches the query, so this thread keeps
        // re-raising on a timer for as long as `execute_guarded`'s closure is still running and a
        // connection is still bound, and stops the moment either is no longer true.
        if first && self.inner.in_execute.load(Ordering::SeqCst) {
            let inner = Arc::clone(&self.inner);
            // `Builder::spawn`, not `thread::spawn`: this runs from `BatchStream`'s `Drop` too, and
            // `thread::spawn` panics when the OS refuses a thread. A refusal is discarded: stopping
            // then degrades to what an interrupt raised above alone does for this cancel, and the
            // outcome stays `Cancelled` through the guard's step 4 (form §2 item 3). Named, like
            // the producer thread (`stream.rs`).
            let _ = std::thread::Builder::new()
                .name("engine-cancel-reinterrupt".into())
                .spawn(move || loop {
                    std::thread::sleep(REINTERRUPT_INTERVAL);
                    // Both conditions are read under the slot mutex, after the sleep and before the
                    // interrupt: a `detach` racing the sleep is never reached after the connection
                    // has been handed back (the discipline `attach` and `detach` keep), and a window
                    // that closed during the sleep is not interrupted into.
                    let slot = inner.interrupt.lock().unwrap_or_else(|e| e.into_inner());
                    if !inner.in_execute.load(Ordering::SeqCst) {
                        break;
                    }
                    match slot.as_ref() {
                        Some(h) => h.interrupt(),
                        None => break,
                    }
                });
        }
    }

    pub fn is_cancelled(&self) -> bool {
        self.inner.cancelled.load(Ordering::SeqCst)
    }

    /// Test build only: set this token's action for one seam of `cancel_inner`.
    #[cfg(test)]
    pub(crate) fn set_seam(&self, seam: Seam, action: impl FnOnce() + Send + 'static) {
        *self
            .seam_slot(seam)
            .lock()
            .unwrap_or_else(|e| e.into_inner()) = Some(Box::new(action));
    }

    /// Test build only: how many times this token's own stamp decision reached the mark.
    #[cfg(test)]
    pub(crate) fn stamp_count(&self) -> usize {
        self.inner.seams.stamps.load(Ordering::SeqCst)
    }

    #[cfg(test)]
    fn seam_slot(&self, seam: Seam) -> &Mutex<Option<Box<dyn FnOnce() + Send>>> {
        let s = &self.inner.seams;
        match seam {
            Seam::OnContended => &s.on_contended,
            Seam::BeforeStamp => &s.before_stamp,
            Seam::OnStamp => &s.on_stamp,
            Seam::AfterPublish => &s.after_publish,
        }
    }

    /// Test build only. Takes the action out before it runs, so it runs once and never under the
    /// slot's own mutex.
    #[cfg(test)]
    fn fire(&self, seam: Seam) {
        let action = self
            .seam_slot(seam)
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .take();
        if let Some(action) = action {
            action();
        }
    }

    /// Run `f` — the call that actually executes a prepared statement — inside the window a bare
    /// `is_cancelled()` check cannot close.
    ///
    /// Four steps (`engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md` §2 item 1):
    /// 1. mark `in_execute` so the re-interrupter (`cancel_inner`) knows a closure is running;
    /// 2. if already cancelled, clear `in_execute` and return [`Guarded::Cancelled`] without
    ///    running `f` at all;
    /// 3. run `f`;
    /// 4. clear `in_execute`; then, if cancelled is set and `f` returned `Ok`, drop that value and
    ///    return [`Guarded::Cancelled`] — an `Err` from `f` is returned unchanged either way.
    pub(crate) fn execute_guarded<T, E>(&self, f: impl FnOnce() -> Result<T, E>) -> Guarded<T, E> {
        self.inner.in_execute.store(true, Ordering::SeqCst);
        // Clears `in_execute` on every way out, an unwind out of `f` included.
        let window = WindowOpen(&self.inner.in_execute);
        if self.inner.cancelled.load(Ordering::SeqCst) {
            return Guarded::Cancelled;
        }
        let result = f();
        // Step 4 clears before it reads `cancelled`, so the drop is explicit here.
        drop(window);
        match result {
            Ok(v) => {
                if self.inner.cancelled.load(Ordering::SeqCst) {
                    Guarded::Cancelled
                } else {
                    Guarded::Ok(v)
                }
            }
            Err(e) => Guarded::Err(e),
        }
    }

    /// Whether an [`execute_guarded`](Self::execute_guarded) closure is currently running.
    ///
    /// **Instrument accessor (the human, 2026-09-16, round 5 item 4): a read-only view over state
    /// the shipped build already maintains.** Its only callers are the test suite —
    /// `a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled`
    /// (`engine/tests/cancel_execute_window.rs`);
    /// `a_cancellable_open_read_runs_inside_the_execute_window` (`dataset.rs`); and, through
    /// `test_support::cancel_when_executing`,
    /// `a_cancel_inside_the_identity_scans_execute_window_ends_the_admission_cancelled`
    /// (`dataset.rs`) and `a_cancel_inside_the_index_scans_execute_window_ends_the_build_cancelled`
    /// (`index.rs`) — because whether `stream::produce`, `cancellable`, the identity scan and the
    /// index scan actually route their statement through this guard, in the shipped build and not
    /// just in a unit test inside this module, is exactly the fact those tests exist to prove.
    pub fn is_executing(&self) -> bool {
        self.inner.in_execute.load(Ordering::SeqCst)
    }

    /// Bind a connection to this token.
    ///
    /// **Measured behaviour, recorded because it changes what callers must do:** DuckDB's interrupt
    /// acts on a query that is *already running*. An interrupt raised on an idle connection is not
    /// latched — the next query runs to completion. So a cancel check performed **before**
    /// executing is not redundant belt-and-braces. **Qualified:** a bare `is_cancelled()` check
    /// immediately before the call that executes is still a race against DuckDB clearing its own
    /// flag at execution's start — see this module's header. What actually stops a query cancelled
    /// before or during its own start is `execute_guarded`'s check-then-run-then-recheck window
    /// together with its re-interrupter, not this check alone. See
    /// `an_interrupt_on_an_idle_connection_is_not_latched`.
    /// **One token, one live stream — a second binding is refused, never silently swapped.**
    ///
    /// The slot holds a single handle, so overwriting it would disarm the stream already bound to
    /// this token: that stream's `cancel()` would stop poking DuckDB and degrade to the
    /// between-batches flag this module exists not to rely on, with nothing raised. It is
    /// reachable — `Dataset::stream_with_cancel` is public and takes a caller-held token precisely
    /// so a binding can hold one, and nothing stopped a caller passing the same one twice.
    pub(crate) fn attach(&self, handle: Arc<InterruptHandle>) -> crate::error::Result<()> {
        let mut slot = self
            .inner
            .interrupt
            .lock()
            .unwrap_or_else(|e| e.into_inner());
        if slot.is_some() {
            return Err(crate::error::EngineError::Source(
                "this cancellation token is already bound to a running stream; each stream needs \
                 its own token"
                    .into(),
            ));
        }
        if self.inner.cancelled.load(Ordering::SeqCst) {
            handle.interrupt();
        }
        *slot = Some(handle);
        Ok(())
    }

    /// Release the connection when the stream is over, so a later `cancel()` cannot poke a
    /// connection that has been handed back.
    pub(crate) fn detach(&self) {
        *self
            .inner
            .interrupt
            .lock()
            .unwrap_or_else(|e| e.into_inner()) = None;
    }

    /// Whether a running query's interrupt handle is currently bound to this token.
    ///
    /// **An instrument fact, and the observable form of two properties that would otherwise rest on
    /// reading the code.** That a stream's connection was bound *at all* is what makes cancellation
    /// reach DuckDB rather than only the loop around it — and it is the specific thing that could
    /// regress when a connection is recycled rather than freshly created. That it is *unbound*
    /// afterwards is what says a cancelled token was not left attached to a connection that has
    /// been handed back to the pool.
    pub fn is_bound(&self) -> bool {
        self.inner
            .interrupt
            .lock()
            .unwrap_or_else(|e| e.into_inner())
            .is_some()
    }
}

/// Test support for the sites that run a statement inside the execute window (cfg(test) only).
#[cfg(test)]
pub(crate) mod test_support {
    use super::*;

    /// Bounds only how long a failing test runs; never reported as a latency.
    const TEST_LIVENESS_DEADLINE: Duration = Duration::from_secs(60);

    /// Spins on `token.is_executing()` and cancels the token the moment it is true. Returns whether
    /// it saw the window; gives up when `done` is set or the deadline passes. Times nothing.
    pub(crate) fn cancel_when_executing(
        token: &CancelToken,
        done: &Arc<AtomicBool>,
    ) -> std::thread::JoinHandle<bool> {
        let (token, done) = (token.clone(), Arc::clone(done));
        std::thread::spawn(move || {
            let deadline = std::time::Instant::now() + TEST_LIVENESS_DEADLINE;
            while !done.load(Ordering::SeqCst) && std::time::Instant::now() < deadline {
                if token.is_executing() {
                    token.cancel();
                    return true;
                }
                std::thread::sleep(Duration::from_millis(1));
            }
            false
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Bounds only how long a failing test runs (`engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`
    /// §7). Never reported as a latency; T2 and T3 print elapsed time and assert on it only through
    /// this ceiling, never against a target duration.
    const TEST_LIVENESS_DEADLINE: std::time::Duration = std::time::Duration::from_secs(60);

    /// Poll `f` until it holds or `TEST_LIVENESS_DEADLINE` passes, failing by name on a timeout —
    /// never a hang. `docs/07`-style: bounded waits only.
    fn until_live(what: &str, f: impl Fn() -> bool) {
        let deadline = std::time::Instant::now() + TEST_LIVENESS_DEADLINE;
        while !f() {
            assert!(
                std::time::Instant::now() < deadline,
                "timed out waiting for: {what}"
            );
            std::thread::sleep(std::time::Duration::from_millis(2));
        }
    }

    #[test]
    fn a_token_refuses_a_second_stream_rather_than_disarming_the_first() {
        // Overwriting the slot would leave the first stream cancellable only between batches, with
        // nothing raised — the silent degradation this module's whole premise rejects.
        let a = duckdb::Connection::open_in_memory().unwrap();
        let b = duckdb::Connection::open_in_memory().unwrap();
        let t = CancelToken::new();
        t.attach(a.interrupt_handle()).unwrap();
        assert!(
            t.attach(b.interrupt_handle()).is_err(),
            "a second binding must be refused"
        );

        // And the refusal is not permanent: the token is reusable once its stream releases it.
        t.detach();
        assert!(t.attach(b.interrupt_handle()).is_ok());
    }

    #[test]
    fn cancellation_is_visible_and_sticky() {
        let t = CancelToken::new();
        assert!(!t.is_cancelled());
        t.cancel();
        assert!(t.is_cancelled());
        let clone = t.clone();
        assert!(clone.is_cancelled(), "clones share one state");
    }

    #[test]
    fn an_in_flight_query_is_interrupted_not_merely_flagged() {
        // The case ADR-004 amendment 2 disqualified a transport over: work that keeps running after
        // the client is gone. The query below has no output rows for seconds, so a flag polled
        // between batches would not stop it — only the interrupt does.
        let conn = duckdb::Connection::open_in_memory().unwrap();
        let t = CancelToken::new();
        t.attach(conn.interrupt_handle()).unwrap();

        let canceller = {
            let t = t.clone();
            std::thread::spawn(move || {
                std::thread::sleep(std::time::Duration::from_millis(120));
                t.cancel();
            })
        };

        let start = std::time::Instant::now();
        let mut stmt = conn
            .prepare("SELECT count(*) FROM range(0, 4000000000) t(i) WHERE i % 7 = 0")
            .unwrap();
        let outcome = stmt.query_arrow([]);
        let elapsed = start.elapsed();
        canceller.join().unwrap();

        assert!(outcome.is_err(), "an interrupt must fail the running query");
        assert!(
            elapsed < std::time::Duration::from_secs(10),
            "the query must stop when interrupted, not run to completion (took {elapsed:?})"
        );
    }

    #[test]
    fn an_interrupt_raised_after_prepare_is_cleared_when_execution_begins() {
        // P0-1 (`engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md` §4): attach, prepare, cancel,
        // then execute — the interrupt lands on an idle, already-prepared connection, before
        // `query_arrow` begins running it. H1 predicts DuckDB clears its interrupt flag at the
        // start of execution, so this query completes rather than failing.
        let conn = duckdb::Connection::open_in_memory().unwrap();
        let t = CancelToken::new();
        t.attach(conn.interrupt_handle()).unwrap();

        let mut stmt = conn
            .prepare("SELECT count(*) FROM range(0, 1000) t(i)")
            .unwrap();
        t.cancel();

        let outcome = stmt.query_arrow([]);
        assert!(
            outcome.is_ok(),
            "an interrupt raised between prepare and execute must not fail execution: {:?}",
            outcome.err()
        );
    }

    #[test]
    fn a_cancel_landing_before_execution_begins_is_re_raised_once_it_has() {
        // T2 (F2): the guard's own closure cancels first, then runs the query — so the interrupt
        // this raises lands on an idle, already-prepared connection (not latched, per
        // `an_interrupt_on_an_idle_connection_is_not_latched`) an instant before `query_arrow`
        // itself begins running and clears it (H1, P0-1). Nothing but the re-interrupter spawned by
        // `cancel_inner` on that same cancel is left to end this query.
        let conn = duckdb::Connection::open_in_memory().unwrap();
        let t = CancelToken::new();
        t.attach(conn.interrupt_handle()).unwrap();
        let mut stmt = conn
            .prepare("SELECT count(*) FROM range(0, 9223372036854775807) t(i) WHERE i % 7 = 0")
            .unwrap();

        // A second, independent interrupt handle on the same connection — the watchdog's own
        // safety net, not part of what this test is proving. It fires only if the re-interrupter
        // does not end the query within `TEST_LIVENESS_DEADLINE`, which would otherwise hang this
        // test rather than fail it by name.
        let fired = Arc::new(AtomicBool::new(false));
        {
            let handle = conn.interrupt_handle();
            let fired = Arc::clone(&fired);
            std::thread::spawn(move || {
                std::thread::sleep(TEST_LIVENESS_DEADLINE);
                fired.store(true, Ordering::SeqCst);
                handle.interrupt();
            });
        }

        let start = std::time::Instant::now();
        let outcome = t.execute_guarded(|| {
            t.cancel();
            stmt.query_arrow([])
        });
        let elapsed = start.elapsed();
        // Printed, never asserted against — the human's round 25 item 1 (a) ruling: properties and
        // their ordering are what this test proves, not a latency.
        println!(
            "a_cancel_landing_before_execution_begins_is_re_raised_once_it_has: ended in {elapsed:?}"
        );

        assert!(
            matches!(outcome, Guarded::Err(_)),
            "the query must end, not run to completion"
        );
        assert!(
            !fired.load(Ordering::SeqCst),
            "the re-interrupter must end the query before the liveness watchdog does"
        );
    }

    #[test]
    fn the_re_interrupter_exits_when_the_execute_window_closes() {
        // T3 (F2 then F1): once the guard has returned, the thread `cancel_inner` spawned must
        // stop holding its own `Arc<Inner>` clone — the observable form of "it exits when either
        // `in_execute` or the bound slot goes false". Proven by the strong count falling back to
        // what it was before any cancel, then proven live by a fresh, ordinary query on the same
        // connection.
        let conn = duckdb::Connection::open_in_memory().unwrap();
        let t = CancelToken::new();
        t.attach(conn.interrupt_handle()).unwrap();
        let mut stmt = conn
            .prepare("SELECT count(*) FROM range(0, 9223372036854775807) t(i) WHERE i % 7 = 0")
            .unwrap();

        let before = Arc::strong_count(&t.inner);
        let start = std::time::Instant::now();
        let outcome = t.execute_guarded(|| {
            t.cancel();
            stmt.query_arrow([])
        });
        assert!(matches!(outcome, Guarded::Err(_)), "the query must end");

        until_live("the re-interrupter thread to exit", || {
            Arc::strong_count(&t.inner) == before
        });
        println!(
            "the_re_interrupter_exits_when_the_execute_window_closes: fell back in {:?}",
            start.elapsed()
        );

        drop(stmt);
        let mut stmt2 = conn
            .prepare("SELECT count(*) FROM range(0, 1000) t(i)")
            .unwrap();
        assert!(
            stmt2.query_arrow([]).is_ok(),
            "the connection must still serve an ordinary query once the window has closed"
        );
    }

    #[test]
    fn a_cancel_after_execution_returns_is_seen_by_the_post_return_check() {
        // T4 (F1): the closure runs to completion and only then cancels — proving step 4's own
        // recheck, not the pre-run check in step 2, is what catches this case.
        let conn = duckdb::Connection::open_in_memory().unwrap();
        let t = CancelToken::new();
        t.attach(conn.interrupt_handle()).unwrap();
        let mut stmt = conn
            .prepare("SELECT count(*) FROM range(0, 1000) t(i)")
            .unwrap();

        let outcome = t.execute_guarded(|| {
            let r = stmt.query_arrow([]);
            t.cancel();
            r
        });

        assert!(
            matches!(outcome, Guarded::Cancelled),
            "a cancel observed after the closure returned Ok must still end the guard as Cancelled"
        );
    }

    #[test]
    fn an_interrupt_on_an_idle_connection_is_not_latched() {
        // Pinning the finding recorded on `attach`: this is *why* the producer checks the flag
        // before executing. If DuckDB ever starts latching interrupts, this test fails and the
        // comment on `attach` needs revising — which is the point of asserting it.
        let conn = duckdb::Connection::open_in_memory().unwrap();
        let t = CancelToken::new();
        t.cancel();
        t.attach(conn.interrupt_handle()).unwrap();

        let mut stmt = conn
            .prepare("SELECT count(*) FROM range(0, 1000) t(i)")
            .unwrap();
        assert!(
            stmt.query_arrow([]).is_ok(),
            "an interrupt raised while idle does not carry over to the next query"
        );
    }

    // ---- The request stamp's order and its promises (form §4.1, §4.2). Deterministic: each test
    // ---- drives the seams of `cancel_inner`, and none reads a trace. ----

    use std::sync::mpsc::{channel, Receiver, Sender};

    /// A seam action that reports it was reached and then holds until released. The wait is bounded
    /// by `TEST_LIVENESS_DEADLINE` and ends early if the test drops the sender, so a failing test
    /// never leaves a held thread behind for the full deadline.
    fn held() -> (impl FnOnce() + Send + 'static, Receiver<()>, Sender<()>) {
        let (reached_tx, reached_rx) = channel();
        let (release_tx, release_rx) = channel::<()>();
        let action = move || {
            let _ = reached_tx.send(());
            let _ = release_rx.recv_timeout(TEST_LIVENESS_DEADLINE);
        };
        (action, reached_rx, release_tx)
    }

    /// Wait for a real completion signal; fail by name when the deadline passes.
    fn await_signal(rx: &Receiver<()>, what: &str) {
        rx.recv_timeout(TEST_LIVENESS_DEADLINE)
            .unwrap_or_else(|_| panic!("timed out waiting for: {what}"));
    }

    /// A seam action that only reports it was reached.
    fn signal() -> (impl FnOnce() + Send + 'static, Receiver<()>) {
        let (tx, rx) = channel();
        (
            move || {
                let _ = tx.send(());
            },
            rx,
        )
    }

    #[test]
    fn the_request_is_stamped_before_the_flag_is_published() {
        let t = CancelToken::new();
        // 0: the stamp seam never ran; 1: the flag was unset at the stamp; 2: it was already set.
        let seen = Arc::new(std::sync::atomic::AtomicUsize::new(0));
        {
            let (probe, seen) = (t.clone(), Arc::clone(&seen));
            t.set_seam(Seam::OnStamp, move || {
                let state = if probe.is_cancelled() { 2 } else { 1 };
                seen.store(state, Ordering::SeqCst);
            });
        }
        t.cancel();
        assert_ne!(seen.load(Ordering::SeqCst), 0, "the stamp seam never ran");
        assert_eq!(
            seen.load(Ordering::SeqCst),
            1,
            "the cancelled flag was already published when the request was stamped"
        );
    }

    #[test]
    fn an_observer_that_sees_the_flag_finds_the_request_already_stamped() {
        let t = CancelToken::new();
        let (go_tx, go_rx) = channel::<()>();
        let (done_tx, done_rx) = channel::<()>();
        let observer = {
            let t = t.clone();
            std::thread::spawn(move || {
                await_signal(&go_rx, "the canceller to publish the flag");
                let seen = (t.is_cancelled(), t.stamp_count());
                let _ = done_tx.send(());
                seen
            })
        };
        t.set_seam(Seam::AfterPublish, move || {
            let _ = go_tx.send(());
            let _ = done_rx.recv_timeout(TEST_LIVENESS_DEADLINE);
        });
        t.cancel();
        let (flag, stamps) = observer.join().expect("the observer thread");
        assert!(
            flag,
            "the observer ran after the publication and found the flag unset"
        );
        assert_eq!(
            stamps, 1,
            "an observer that saw the flag found {stamps} request stamps, not 1"
        );
    }

    #[test]
    fn two_concurrent_cancels_stamp_once_and_the_loser_returns_after_the_stamp() {
        let t = CancelToken::new();
        let (hold, a_reached, release_a) = held();
        t.set_seam(Seam::BeforeStamp, hold);
        let (contended, b_contended) = signal();
        t.set_seam(Seam::OnContended, contended);

        let a = {
            let t = t.clone();
            std::thread::spawn(move || t.cancel())
        };
        await_signal(&a_reached, "A to reach before_stamp");
        let b = {
            let t = t.clone();
            std::thread::spawn(move || {
                t.cancel();
                (t.is_cancelled(), t.stamp_count())
            })
        };
        await_signal(&b_contended, "B to find the transition lock held");
        release_a.send(()).expect("release A");
        a.join().expect("A");
        let (flag, stamps) = b.join().expect("B");
        assert!(flag, "B returned before the flag was published");
        assert_eq!(stamps, 1, "B returned when {stamps} request stamps existed");
        assert_eq!(t.stamp_count(), 1, "the two cancels stamped more than once");
    }

    #[test]
    fn a_cancel_entering_before_a_drop_stamps_once() {
        let t = CancelToken::new();
        let (hold, a_reached, release_a) = held();
        t.set_seam(Seam::BeforeStamp, hold);
        let (contended, d_contended) = signal();
        t.set_seam(Seam::OnContended, contended);

        let a = {
            let t = t.clone();
            std::thread::spawn(move || t.cancel())
        };
        await_signal(&a_reached, "the cancel to reach before_stamp");
        let d = {
            let t = t.clone();
            std::thread::spawn(move || {
                t.cancel_for_drop();
                t.is_cancelled()
            })
        };
        await_signal(&d_contended, "the drop to find the transition lock held");
        release_a.send(()).expect("release the cancel");
        a.join().expect("the cancel");
        assert!(
            d.join().expect("the drop"),
            "the drop returned before the flag was set"
        );
        assert_eq!(
            t.stamp_count(),
            1,
            "a cancel then a drop stamped other than once"
        );
    }

    #[test]
    fn a_drop_entering_before_a_cancel_stamps_nothing() {
        let t = CancelToken::new();
        let (hold, d_reached, release_d) = held();
        t.set_seam(Seam::BeforeStamp, hold);
        let (contended, c_contended) = signal();
        t.set_seam(Seam::OnContended, contended);

        let d = {
            let t = t.clone();
            std::thread::spawn(move || t.cancel_for_drop())
        };
        await_signal(&d_reached, "the drop to reach before_stamp");
        let c = {
            let t = t.clone();
            std::thread::spawn(move || {
                t.cancel();
                t.is_cancelled()
            })
        };
        await_signal(&c_contended, "the cancel to find the transition lock held");
        release_d.send(()).expect("release the drop");
        d.join().expect("the drop");
        assert!(
            c.join().expect("the cancel"),
            "the cancel returned before the flag was set"
        );
        assert_eq!(t.stamp_count(), 0, "a drop then a cancel stamped a request");
    }

    #[test]
    fn a_repeated_cancellation_stamps_once() {
        let t = CancelToken::new();
        t.cancel();
        t.cancel();
        t.clone().cancel();
        assert!(t.is_cancelled());
        assert_eq!(t.stamp_count(), 1, "three cancels stamped other than once");
    }

    #[test]
    fn cancel_for_drop_stamps_nothing_and_a_later_cancel_adds_none() {
        let t = CancelToken::new();
        t.cancel_for_drop();
        assert!(t.is_cancelled());
        assert_eq!(t.stamp_count(), 0, "a drop stamped a request");
        t.cancel();
        assert_eq!(
            t.stamp_count(),
            0,
            "a cancel after a drop stamped a request"
        );
    }

    #[test]
    fn a_stamp_that_panics_still_publishes_the_flag() {
        let t = CancelToken::new();
        t.set_seam(Seam::OnStamp, || panic!("the stamp panicked"));
        let outcome = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| t.cancel()));
        assert!(
            outcome.is_err(),
            "the seam's panic did not reach the caller"
        );
        assert!(
            t.is_cancelled(),
            "a stamp that panicked left the token uncancelled"
        );
        t.cancel();
        assert!(t.is_cancelled());
    }
}
