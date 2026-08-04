//! Cancellation that reaches the query, not just the loop around it.
//!
//! ADR-004 amendment 2 disqualified the Tauri custom protocol as the data plane because "a client
//! abort never reaches the producer, so the kernel keeps computing cancelled work, violating
//! `docs/01` principle 7". A cancel flag polled between batches has the same defect in a smaller
//! place: a filter that scans for seconds before its first batch would keep scanning. So
//! `CancelToken::cancel` calls DuckDB's own interrupt on the connection running the query, and the
//! between-batch check is the second line of defence rather than the only one.
//!
//! `docs/08`'s budget is "Cancellation acknowledged < 100 ms, **any operation**" — including the
//! operation that has not produced anything yet.

use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};

use duckdb::InterruptHandle;

#[derive(Clone, Default)]
pub struct CancelToken {
    inner: Arc<Inner>,
}

#[derive(Default)]
struct Inner {
    cancelled: AtomicBool,
    /// Present from the moment a query is bound to this token. A cancel that arrives before the
    /// handle is attached is not lost: `attach` interrupts immediately if the flag is already set.
    interrupt: Mutex<Option<Arc<InterruptHandle>>>,
}

impl CancelToken {
    pub fn new() -> Self {
        Self::default()
    }

    /// Request cancellation. Sets the flag **before** interrupting, so any thread that observes the
    /// interrupt's error can already tell why it happened.
    pub fn cancel(&self) {
        self.inner.cancelled.store(true, Ordering::SeqCst);
        if let Some(h) = self.inner.interrupt.lock().unwrap_or_else(|e| e.into_inner()).as_ref() {
            h.interrupt();
        }
    }

    pub fn is_cancelled(&self) -> bool {
        self.inner.cancelled.load(Ordering::SeqCst)
    }

    /// Bind a connection to this token.
    ///
    /// **Measured behaviour, recorded because it changes what callers must do:** DuckDB's interrupt
    /// acts on a query that is *already running*. An interrupt raised on an idle connection is not
    /// latched — the next query runs to completion. So the `is_cancelled()` check the producer
    /// performs **before** executing is not redundant belt-and-braces; it is the only thing that
    /// stops a query that was cancelled before it started. See
    /// `an_interrupt_on_an_idle_connection_is_not_latched`.
    pub(crate) fn attach(&self, handle: Arc<InterruptHandle>) {
        let mut slot = self.inner.interrupt.lock().unwrap_or_else(|e| e.into_inner());
        if self.inner.cancelled.load(Ordering::SeqCst) {
            handle.interrupt();
        }
        *slot = Some(handle);
    }

    /// Release the connection when the stream is over, so a later `cancel()` cannot poke a
    /// connection that has been handed back.
    pub(crate) fn detach(&self) {
        *self.inner.interrupt.lock().unwrap_or_else(|e| e.into_inner()) = None;
    }
}

#[cfg(test)]
mod tests {
    use super::*;

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
        t.attach(conn.interrupt_handle());

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
    fn an_interrupt_on_an_idle_connection_is_not_latched() {
        // Pinning the finding recorded on `attach`: this is *why* the producer checks the flag
        // before executing. If DuckDB ever starts latching interrupts, this test fails and the
        // comment on `attach` needs revising — which is the point of asserting it.
        let conn = duckdb::Connection::open_in_memory().unwrap();
        let t = CancelToken::new();
        t.cancel();
        t.attach(conn.interrupt_handle());

        let mut stmt = conn.prepare("SELECT count(*) FROM range(0, 1000) t(i)").unwrap();
        assert!(
            stmt.query_arrow([]).is_ok(),
            "an interrupt raised while idle does not carry over to the next query"
        );
    }
}
