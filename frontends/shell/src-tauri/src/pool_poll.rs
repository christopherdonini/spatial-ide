// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Entry-40 empirical producer pass instrument
//! (`spikes/entry40-producer-hang-diagnosis/PASS-PREREGISTRATION.md` §2 "The instrument", README
//! §2 item 2 -- "the one load-bearing addition"): a periodic, timestamped poll of the engine pool's
//! lease counts for a dataset open in the shell, written to the session log every 1,000 ms.
//!
//! **No new engine/kernel accessor was needed.** The pool is already reachable from this crate:
//! `SkpHost::catalog()` (`kernel/src/skp.rs:317-319`) -> `Catalog::get(name)` (`kernel/src/lib.rs:181`,
//! `-> Option<Arc<Dataset>>`) -> `Dataset::connections()` (`engine/src/dataset.rs:392`, `-> &Arc<ConnectionPool>`)
//! -> `active_leases()`/`live_connections()`/`idle_connections()` (`engine/src/pool.rs:383`, `:379`,
//! `:375` respectively -- the three accessors PASS-PREREGISTRATION.md §2 names as already existing
//! and "already polled this way by three kernel tests").
//!
//! **Dev/measure-build-gated, never in a plain release build** (docs/09's dev/debug-gate discipline):
//! this entire module is compiled in only via `lib.rs`'s `#[cfg(any(debug_assertions, feature =
//! "measure-build"))] mod pool_poll;` -- the same gate `Cargo.toml`'s `measure-build` feature and
//! this crate's own CDP-port block (`lib.rs`) already establish as the precedent for a diagnostic-only
//! addition that must never ship in a product release.
//!
//! **Cheap by construction.** One lock acquisition per tick across the three accessor calls (they all
//! read the same `Mutex<PoolState>`, `engine/src/pool.rs`), one formatted `String` per tick, no effect
//! on the data path -- this task never touches a `Dataset`'s connections, only reads counters already
//! exposed for exactly this kind of poll.

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
/// task it names -- `protocol/skp/src/v0/handles.rs`'s own module doc says of kernel-minted handles,
/// quoted verbatim, "session-scoped and non-persistable: none may be written to disk, logged, or
/// reused across a process restart" (the sentence continues into a parenthetical this quote drops,
/// unrelated to the point cited here). This map satisfies that by construction: the key is a
/// `HashMap` lookup key, never written anywhere, and never appears in the log line itself (which
/// carries only the three counts).
#[derive(Default)]
pub struct PoolPollTasks(Mutex<HashMap<String, tokio::task::AbortHandle>>);

impl PoolPollTasks {
    pub fn new() -> Self {
        Self::default()
    }

    /// Starts one 1,000 ms interval task polling `dataset`'s pool. The task re-resolves both
    /// `Arc<SkpHost>` and `SessionLog` through `app` on every tick rather than capturing borrowed
    /// `State`, because the task outlives the calling command -- the same pattern this crate's
    /// `commands::binding_publish_execute` already uses for its progress events (a cloned
    /// `AppHandle` captured into a spawned closure, `progress_app.emit(...)`).
    pub fn start(&self, app: AppHandle, dataset: String) {
        let task_dataset = dataset.clone();
        let join = tokio::spawn(async move {
            let mut ticker = tokio::time::interval(Duration::from_millis(1_000));
            loop {
                ticker.tick().await;
                let Some(host) = app.try_state::<Arc<SkpHost>>() else { break };
                let Some(ds) = host.catalog().get(&task_dataset) else {
                    // The dataset is no longer in the catalog. `commands::close_dataset` normally
                    // aborts this task before that happens (see its own doc comment); reaching this
                    // arm means some other path removed it first -- self-terminating here is the
                    // fail-safe, not the expected stop.
                    break;
                };
                let pool = ds.connections();
                let line = format_pool_poll_line(
                    pool.active_leases(),
                    pool.live_connections(),
                    pool.idle_connections(),
                );
                let Some(fields) = line.strip_prefix(POOL_POLL_LOG_CLASS) else { continue };
                if let Some(log) = app.try_state::<SessionLog>() {
                    log.append(POOL_POLL_LOG_CLASS, fields.trim_start());
                }
            }
        });
        let mut tasks = self.0.lock().unwrap_or_else(|e| e.into_inner());
        tasks.insert(dataset, join.abort_handle());
    }

    /// Aborts and forgets the poll task for `dataset`. A no-op if none is running (e.g. `dataset`
    /// was never opened through the gated `open_dataset` path, or was already stopped).
    pub fn stop(&self, dataset: &str) {
        if let Some(handle) = self.0.lock().unwrap_or_else(|e| e.into_inner()).remove(dataset) {
            handle.abort();
        }
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
}
