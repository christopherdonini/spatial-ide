// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Entry-40 empirical producer pass instrument (`spikes/entry40-producer-hang-diagnosis/
//! PASS-PREREGISTRATION.md` §2's own heading calls this "The instrument" and, parenthetically,
//! "the one load-bearing addition" -- both quoted verbatim from that heading, which itself also
//! numbers this as README §2's own item 2, a cross-reference PASS-PREREGISTRATION.md makes, not a
//! claim of this comment's own): a periodic, timestamped poll of the engine pool's lease counts for
//! a dataset open in the shell, written to the session log every 1,000 ms.
//!
//! **No new engine/kernel accessor was needed.** The pool is already reachable from this crate:
//! `SkpHost::catalog()` (`kernel/src/skp.rs:317-319`) -> `Catalog::get(name)` (`kernel/src/lib.rs:181`,
//! `-> Option<Arc<Dataset>>`) -> `Dataset::connections()` (`engine/src/dataset.rs:392`, `-> &Arc<ConnectionPool>`)
//! -> `active_leases()`/`live_connections()`/`idle_connections()` (`engine/src/pool.rs:383`, `:379`,
//! `:375` respectively -- the three accessors PASS-PREREGISTRATION.md §2 names as already existing
//! and "already polled this way by three kernel tests").
//!
//! **Dev/measure-build-gated, never in a plain release build** -- compiled in only via `lib.rs`'s
//! `#[cfg(any(debug_assertions, feature = "measure-build"))] mod pool_poll;`. That exact `any(...)`
//! union is NOT an existing precedent in this crate (reviewer nit ii): `Cargo.toml`'s own
//! `measure-build` feature comment and `lib.rs`'s CDP-port block each gate on `feature =
//! "measure-build"` alone, and the E2E test seam (`commands.rs`/`lib.rs`) gates on `debug_assertions`
//! alone -- this module is the first site that needs BOTH, because the instrument is useful under
//! either build class this pass might run against (a plain `cargo test`/`tauri dev` build, where
//! `debug_assertions` is true, OR the measure build, where it is false but `feature =
//! "measure-build"` is true), and must never compile into a plain release build (neither condition
//! true there).
//!
//! **Structural cost, per tick** (no evaluative claim -- docs/08: no numbers, no perf claim without
//! a measurement): three short, independent lock acquisitions on the pool's own state mutex
//! (`active_leases()`/`live_connections()`/`idle_connections()` each call `self.state.lock()`
//! separately -- `engine/src/pool.rs:383`, `:379`, `:375` -- not one shared acquisition across the
//! three), one formatted `String`, and one blocking `SessionLog::append` (a `write_all` + `flush`
//! under a `Mutex<File>`, `state.rs:43-55`) that `poll_loop` below moves onto
//! `tokio::task::spawn_blocking` rather than running inline on the async worker thread (`docs/01`
//! principle 7: a tokio worker must not block on synchronous file IO -- this IS the dominant
//! per-tick cost, reviewer M1). That state mutex is the SAME lock the lease acquire/release path
//! takes (`engine/src/pool.rs`), so this poll does contend for it, however briefly -- not "no effect
//! on the data path" in the strict sense. The three reads are also not an atomic snapshot: each is
//! its own lock acquisition, so `live_connections()` can disagree with `active_leases() +
//! idle_connections()` if a lease is acquired or released between them -- harmless for
//! PASS-PREREGISTRATION.md §4's own pre-committed readings, each of which reads one field for what
//! it reports on its own, never asserts the three as a consistent triple.

use std::collections::HashMap;
use std::sync::{Arc, Mutex};
use std::time::Duration;

use spatial_kernel::skp::SkpHost;
use tauri::{AppHandle, Manager};

use crate::state::SessionLog;

/// The session-log line's class -- `SessionLog::append`'s own `level` argument, a free-text field,
/// never a closed enum (paraphrase of `commands.rs`'s `binding_log_session_event` doc comment,
/// which says the same of its own `level` parameter), matching this crate's existing JS-side
/// convention of using the class name itself as `level` (e.g. `"watchdog"`,
/// `"candidate-tile-terminal"`, `diagnostics/log.ts`'s call sites).
pub const POOL_POLL_LOG_CLASS: &str = "producer-pool-poll";

/// The exact `producer-pool-poll active=<n> live=<n> idle=<n>` line PASS-PREREGISTRATION.md §2
/// names, as one pure, unit-tested string -- no lock, no pool, no app handle. The class and its
/// fields are split back apart at the one call site below (`strip_prefix`) so the persisted
/// session-log line does not carry the class twice (once as `SessionLog::append`'s `level`, once
/// inside `message`).
pub fn format_pool_poll_line(active: usize, live: usize, idle: usize) -> String {
    format!("{POOL_POLL_LOG_CLASS} active={active} live={live} idle={idle}")
}

/// One abort handle per currently-open dataset, keyed by the dataset's kernel-minted handle string.
///
/// **Never logged or persisted.** That key lives only in this process's memory for the life of the
/// task it names -- `protocol/skp/src/v0/handles.rs`'s own module doc says, of all three handle
/// types it defines (reviewer nit iv: "All three", not only the kernel-minted ones -- the
/// kernel-minted `DatasetHandle`/`StreamHandle` this module's own key is drawn from, AND the
/// client-minted `CancelKey` the same sentence also covers), quoted verbatim: "session-scoped and
/// non-persistable: none may be written to disk, logged, or reused across a process restart" (the
/// sentence continues into a parenthetical this quote drops, unrelated to the point cited here).
/// This map satisfies that for the one handle type it actually stores (`DatasetHandle`, kept only
/// as a plain `String` key): never written anywhere, and never appears in the log line itself
/// (which carries only the three counts).
#[derive(Default)]
pub struct PoolPollTasks(Mutex<HashMap<String, tokio::task::AbortHandle>>);

impl PoolPollTasks {
    pub fn new() -> Self {
        Self::default()
    }

    /// Starts the poll for `dataset`: `poll_loop` (below) does the actual 1,000 ms ticking;
    /// `supervise` (below) awaits its `JoinHandle` and logs exactly one `stopped reason=...` line on
    /// every exit path (reviewer S3); `record` (below) does the map bookkeeping alone, split out so
    /// it is unit-testable without an `AppHandle` (reviewer S5).
    pub fn start(&self, app: AppHandle, dataset: String) {
        let poll_app = app.clone();
        let poll_dataset = dataset.clone();
        let join = tokio::spawn(poll_loop(poll_app, poll_dataset));
        self.record(dataset.clone(), join.abort_handle());
        tokio::spawn(supervise(join, app, dataset));
    }

    /// Map bookkeeping only, no task spawning -- split out from `start` (reviewer S5) so the
    /// insert/replace/remove logic is unit-testable with a real `AbortHandle` from a trivial spawned
    /// task, without needing an `AppHandle` (`start`'s own poll loop needs one; this does not).
    /// Replacing an existing entry under the same key ABORTS the replaced task: `start` called twice
    /// for the same `dataset` without an intervening `stop()` must not leave the first poll running,
    /// silently orphaned, forever.
    fn record(&self, dataset: String, handle: tokio::task::AbortHandle) {
        let previous = self.0.lock().unwrap_or_else(|e| e.into_inner()).insert(dataset, handle);
        if let Some(previous) = previous {
            previous.abort();
        }
    }

    /// Aborts and forgets the poll task for `dataset`. A no-op if none is running (e.g. `dataset`
    /// was never opened through the gated `open_dataset` path, was already stopped, or `poll_loop`
    /// already exited on its own and `supervise` already removed it -- reviewer nit vii).
    pub fn stop(&self, dataset: &str) {
        if let Some(handle) = self.0.lock().unwrap_or_else(|e| e.into_inner()).remove(dataset) {
            handle.abort();
        }
    }
}

/// The tick loop itself. Returns a `&'static str` reason on every GRACEFUL exit (`supervise` below
/// reads it); an external `stop()` call instead aborts this task outright (never reaches a `return`
/// here -- `supervise` observes that as a cancelled `JoinHandle`), and a genuine panic inside the
/// loop body is likewise never returned from here (`supervise` observes that as a panicked
/// `JoinHandle`, reviewer S3's "supervising task reading the JoinHandle result" alternative to
/// wrapping this body in `catch_unwind`).
async fn poll_loop(app: AppHandle, dataset: String) -> &'static str {
    let mut ticker = tokio::time::interval(Duration::from_millis(1_000));
    // Reviewer S4: the default `MissedTickBehavior::Burst` would fire a catch-up burst of ticks
    // after any starvation of this task -- `Delay` instead means a starved poll shows as an honest
    // gap in the session log (the next tick is 1,000 ms after the tick actually runs, never
    // backfilled to the original schedule), rather than a burst that could misread as several
    // healthy 1 s ticks in a row.
    ticker.set_missed_tick_behavior(tokio::time::MissedTickBehavior::Delay);
    loop {
        ticker.tick().await;
        let Some(host) = app.try_state::<Arc<SkpHost>>() else { return "host-missing" };
        let Some(ds) = host.catalog().get(&dataset) else {
            // The dataset is no longer in the catalog. `commands::close_dataset` normally stops this
            // task (via `stop()`, an abort, not this return) before that happens; reaching this arm
            // means some other path removed it first -- self-terminating here is the fail-safe, not
            // the expected stop.
            return "catalog-miss";
        };
        let pool = ds.connections();
        let line = format_pool_poll_line(
            pool.active_leases(),
            pool.live_connections(),
            pool.idle_connections(),
        );
        let Some(fields) = line.strip_prefix(POOL_POLL_LOG_CLASS) else { continue };
        let fields = fields.trim_start().to_string();
        // Reviewer M1: the dominant per-tick cost -- `write_all` + `flush` under `SessionLog`'s own
        // `Mutex<File>` (`state.rs:43-55`) -- moved off this async worker thread onto the blocking
        // pool (`docs/01` principle 7: a tokio worker must not block on synchronous file IO). A
        // fresh `AppHandle` clone is captured (rather than moving a borrowed `State`) because
        // `State<'_, T>` is tied to the borrow that produced it and cannot cross into a `'static`
        // `spawn_blocking` closure -- `AppHandle` itself is `Send + Sync + 'static` and re-resolves
        // the same state inside the blocking closure.
        let blocking_app = app.clone();
        let _ = tokio::task::spawn_blocking(move || {
            if let Some(log) = blocking_app.try_state::<SessionLog>() {
                log.append(POOL_POLL_LOG_CLASS, &fields);
            }
        })
        .await;
    }
}

/// Reviewer S3: every exit path of `poll_loop` was silent before this piece. This task awaits
/// `poll_loop`'s own `JoinHandle` and logs exactly one `producer-pool-poll stopped reason=<...>`
/// line covering all four cases -- `poll_loop`'s own graceful returns (`host-missing`/
/// `catalog-miss`), an external `stop()` call (`closed`, via `JoinError::is_cancelled`), or a
/// genuine panic inside the tick body (`panic`, via `JoinError::is_panic`) -- then removes any
/// still-present map entry for `dataset` (reviewer nit vii: a graceful `host-missing`/
/// `catalog-miss`/`panic` exit is not caused by `stop()`, so nothing else would otherwise clear the
/// map; a `stop()`-caused `closed` exit finds nothing left to remove, since `stop()` already did).
async fn supervise(join: tokio::task::JoinHandle<&'static str>, app: AppHandle, dataset: String) {
    let reason = match join.await {
        Ok(reason) => reason,
        Err(e) if e.is_cancelled() => "closed",
        Err(e) if e.is_panic() => "panic",
        Err(_) => "unknown",
    };
    let line = format!("stopped reason={reason}");
    let log_app = app.clone();
    let _ = tokio::task::spawn_blocking(move || {
        if let Some(log) = log_app.try_state::<SessionLog>() {
            log.append(POOL_POLL_LOG_CLASS, &line);
        }
    })
    .await;
    if let Some(tasks) = app.try_state::<PoolPollTasks>() {
        tasks.stop(&dataset);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn formats_the_exact_producer_pool_poll_line() {
        assert_eq!(format_pool_poll_line(2, 4, 2), "producer-pool-poll active=2 live=4 idle=2");
    }

    #[test]
    fn formats_all_zero_counts() {
        assert_eq!(format_pool_poll_line(0, 0, 0), "producer-pool-poll active=0 live=0 idle=0");
    }

    #[test]
    fn line_splits_back_into_the_append_call_s_level_and_message_with_no_duplication() {
        let line = format_pool_poll_line(1, 3, 2);
        let fields = line.strip_prefix(POOL_POLL_LOG_CLASS).unwrap().trim_start();
        assert_eq!(fields, "active=1 live=3 idle=2");
        // The class token appears exactly once across (level, message) together.
        assert_eq!(fields.matches(POOL_POLL_LOG_CLASS).count(), 0);
    }

    #[test]
    fn stop_on_a_dataset_never_started_is_a_no_op() {
        let tasks = PoolPollTasks::new();
        tasks.stop("never-started");
    }

    /// Reviewer S5: the map bookkeeping (`record`/`stop`), tested without an `AppHandle` -- a
    /// trivial never-completing spawned task supplies a real `AbortHandle`.
    #[tokio::test]
    async fn record_then_stop_leaves_the_map_empty_and_aborts_the_task() {
        let tasks = PoolPollTasks::new();
        let handle = tokio::spawn(std::future::pending::<()>());
        tasks.record("ds-a".to_string(), handle.abort_handle());
        assert_eq!(tasks.0.lock().unwrap().len(), 1);
        tasks.stop("ds-a");
        assert_eq!(tasks.0.lock().unwrap().len(), 0);
        let result = handle.await;
        assert!(result.unwrap_err().is_cancelled());
    }

    /// Reviewer S5: a second `record` under the same key replaces AND aborts the first -- the bug
    /// `record`'s own doc comment names (an orphaned, silently-still-running first poll) would
    /// reproduce here as `first` never being cancelled.
    #[tokio::test]
    async fn a_second_record_under_the_same_key_replaces_and_aborts_the_first() {
        let tasks = PoolPollTasks::new();
        let first = tokio::spawn(std::future::pending::<()>());
        let second = tokio::spawn(std::future::pending::<()>());
        tasks.record("ds-a".to_string(), first.abort_handle());
        tasks.record("ds-a".to_string(), second.abort_handle());
        // Exactly one entry remains -- the second's.
        assert_eq!(tasks.0.lock().unwrap().len(), 1);
        let first_result = first.await;
        assert!(first_result.unwrap_err().is_cancelled());
        // The second is still running -- `stop` still reaches it under the same key.
        tasks.stop("ds-a");
        let second_result = second.await;
        assert!(second_result.unwrap_err().is_cancelled());
    }
}
