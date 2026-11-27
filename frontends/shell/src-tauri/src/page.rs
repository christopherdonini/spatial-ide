// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! The main window's page lifecycle, in the binding (ADR-037, `docs/adr/ADR-037-main-window-page-lifecycle-and-kernel-held-opens.md`).
//!
//! **What this is.** One process serves one kernel, and the main window's page can be replaced while
//! the kernel runs on (Ctrl+R, F5, a dev reload, a suite's `page.reload()`). The kernel holds each
//! open, and a project's open lock, until its dataset is closed. A reload closed nothing, so the new
//! page's reopen of the project the old page held was refused. This module is the bookkeeping that
//! fixes that, and it decides nothing about data (docs/02, the frontends row): it maps one fact only
//! the host sees, a page-load `Started`, onto calls the kernel already has (`SkpHost::cancel`,
//! `SkpHost::close_dataset`, `Projects::release_ended`) and the binding's own
//! `RunningPublishes::cancel_all`.
//!
//! **The page's opens** are what the commands return to it: each dataset name `open_dataset` and
//! `open_project` returned to the current page, and the cancel key of each such command still in
//! flight (ADR-037 section 2). A name the page closes itself leaves them ([`Pages::forget`]).
//!
//! **The end** ([`Pages::page_started`], [`run_end`]) runs on a thread of its own, started from the
//! page-load hook without waiting. **A late close** ([`Pages::settle`]) is the same close for an open
//! that returned after its page ended. **The gate** ([`Pages::admit`]) holds the new page's
//! `open_dataset` and `open_project` until every earlier end, every earlier page's in-flight open and
//! every late close has finished (ADR-037 section 5). It lives here, in the binding, before the
//! kernel's `begin_open`; no wait is added inside the kernel.
//!
//! **The mutex** in [`Pages`] is never held across a kernel call, a wait or a close, and each lock
//! recovers from poison with `unwrap_or_else(|e| e.into_inner())`. Every change bumps a `watch`
//! counter under that mutex, the pattern of `RunningPublishes` (`publish.rs`), so a waiter that
//! subscribed before its first read of the state loses no change between a read and its wait.

use std::collections::BTreeSet;
use std::io::Write;
use std::sync::{Arc, Mutex, MutexGuard};
use std::thread::JoinHandle;

use spatial_engine::EngineError;
use spatial_kernel::project::Projects;
use spatial_kernel::skp::{error_of, SkpHost};
use spatial_skp::v0::{
    CancelRequest, CancelResponse, CancelState, CloseDatasetRequest, DatasetHandle, SkpError,
    StreamHandle, SKP_VERSION,
};
use tokio::sync::watch;

use crate::publish::RunningPublishes;

/// An open of the current page that has been admitted past the gate and has not yet returned.
struct InFlight {
    id: u64,
    /// The command's cancel key, as the page sent it.
    key: String,
    page: u64,
}

/// An open that waits at the gate.
struct Waiting {
    id: u64,
    key: String,
    /// Set by [`Pages::cancel`]; the entry is removed with it.
    cancelled: bool,
}

#[derive(Default)]
struct State {
    /// The current page's number. It is 0 until the first load's `Started`.
    page: u64,
    /// The dataset names the current page's commands returned and the page has not closed.
    names: BTreeSet<String>,
    next_id: u64,
    in_flight: Vec<InFlight>,
    waiting: Vec<Waiting>,
    ends_running: usize,
    late_closes_running: usize,
}

/// The binding's page bookkeeping: managed once, as `Arc<Pages>`.
pub struct Pages {
    state: Mutex<State>,
    /// Bumped, under `state`'s mutex, on every change.
    changed: watch::Sender<u64>,
}

impl Default for Pages {
    fn default() -> Self {
        Self {
            state: Mutex::new(State::default()),
            changed: watch::channel(0).0,
        }
    }
}

/// A boxed closure from `lib.rs`, called on the end's thread: stops a dataset's pool poll.
pub type StopFn = Box<dyn Fn(&str) + Send>;

/// A boxed closure from `lib.rs`, called on the end's thread: writes one session-log line.
pub type LogFn = Box<dyn Fn(&str, &str) + Send>;

/// What [`Pages::page_started`] hands the end: the kernel and binding parts it acts on, and the two
/// closures `lib.rs` builds from a clone of the `AppHandle`. The closures are called on the end's
/// thread only.
pub struct EndParts {
    pub host: Arc<SkpHost>,
    pub projects: Option<Arc<Projects>>,
    pub publishes: Arc<RunningPublishes>,
    /// Stops a closed dataset's dev pool poll (a no-op in a plain release build).
    pub stop_poll: StopFn,
    /// Writes one session-log line: the level and the message.
    pub log: LogFn,
}

/// How [`Pages::settle`] ended an open's bookkeeping.
#[cfg_attr(not(test), allow(dead_code))]
pub enum Settled {
    /// The open's page is the current page: a returned name entered its set.
    Current,
    /// The open's page had ended. A returned name is closed by a late close on a thread of its own;
    /// its handle is `None` when there was no name, or when the thread did not start. Only the
    /// tests read the handle: `an_open_settled_after_its_page_ended_is_closed`,
    /// `the_gate_waits_for_ends_earlier_opens_and_late_closes` and
    /// `a_reopen_behind_an_earlier_pages_reopen_waits_then_opens` join it, so that they assert after
    /// the late close has run; the commands discard it.
    Ended(Option<JoinHandle<()>>),
}

/// An open admitted past the gate: a drop guard, as `OpenGuard` is in the kernel. Dropped without
/// [`Pages::settle`], it removes its in-flight entry, so no early return or unwind leaves an entry
/// that holds the gate for every later page.
pub struct Ticket {
    pages: Arc<Pages>,
    id: u64,
    page: u64,
    settled: bool,
}

impl Drop for Ticket {
    fn drop(&mut self) {
        if !self.settled {
            let id = self.id;
            self.pages.change(|s| s.in_flight.retain(|f| f.id != id));
        }
    }
}

/// The gate-waiting entry of one [`Pages::admit`], so that an `admit` future dropped while it waits
/// leaves no entry that [`Pages::cancel`] could answer `requested` for.
struct WaitGuard {
    pages: Arc<Pages>,
    id: u64,
}

impl Drop for WaitGuard {
    fn drop(&mut self) {
        let mut state = self.pages.lock();
        let before = state.waiting.len();
        let id = self.id;
        state.waiting.retain(|w| w.id != id);
        if state.waiting.len() != before {
            self.pages.bump();
        }
    }
}

/// Holds the decrement of `ends_running`: dropped when the end's thread finishes, panics included,
/// or when the thread did not start. A drop guard, so that the gate opens on every path.
struct EndGuard {
    pages: Arc<Pages>,
}

impl Drop for EndGuard {
    fn drop(&mut self) {
        // `saturating_sub`: a panic in a drop during an unwind would abort.
        self.pages
            .change(|s| s.ends_running = s.ends_running.saturating_sub(1));
    }
}

/// The same for `late_closes_running`.
struct LateGuard {
    pages: Arc<Pages>,
}

impl Drop for LateGuard {
    fn drop(&mut self) {
        self.pages
            .change(|s| s.late_closes_running = s.late_closes_running.saturating_sub(1));
    }
}

/// The refusal a cancelled open returns from the kernel (`error_of` of `EngineError::Cancelled`).
/// The binding makes no code and no text of its own for it.
fn cancelled() -> SkpError {
    error_of(&EngineError::Cancelled)
}

impl Pages {
    pub fn new() -> Self {
        Self::default()
    }

    fn lock(&self) -> MutexGuard<'_, State> {
        self.state.lock().unwrap_or_else(|e| e.into_inner())
    }

    fn bump(&self) {
        self.changed.send_modify(|v| *v = v.wrapping_add(1));
    }

    /// One change of the state, then the bump, both under the mutex.
    fn change<R>(&self, f: impl FnOnce(&mut State) -> R) -> R {
        let mut state = self.lock();
        let out = f(&mut state);
        self.bump();
        out
    }

    /// The gate (ADR-037 section 5), for the new page's `open_dataset` and `open_project`. It enters
    /// a gate-waiting entry under the current page, then waits until one of these:
    ///
    /// - its page is the current page, no end is running, no earlier page's open is in flight and
    ///   no late close is running, all read in one critical section: the entry moves to in-flight
    ///   and the [`Ticket`] is returned;
    /// - its entry was removed by [`Pages::cancel`], or its page is no longer the current page: the
    ///   kernel's cancelled refusal is returned and the open never reaches the kernel.
    ///
    /// The receiver is taken before the first read of the state, and the wait follows each read that
    /// admits nothing, so no change between a read and the wait is lost. The mutex is taken between
    /// awaits only. With no reload in the process, the gate is open once the first load's end, which
    /// closes nothing, has run.
    pub async fn admit(self: &Arc<Self>, key: &str) -> Result<Ticket, SkpError> {
        let mut receiver = self.changed.subscribe();
        let (id, page) = self.change(|s| {
            let id = s.next_id;
            s.next_id = s.next_id.wrapping_add(1);
            let page = s.page;
            s.waiting.push(Waiting {
                id,
                key: key.to_string(),
                cancelled: false,
            });
            (id, page)
        });
        let _waiting = WaitGuard {
            pages: self.clone(),
            id,
        };
        loop {
            if let Some(answer) = self.try_admit(id, key, page) {
                return answer.map(|()| Ticket {
                    pages: self.clone(),
                    id,
                    page,
                    settled: false,
                });
            }
            if receiver.changed().await.is_err() {
                return Err(cancelled());
            }
        }
    }

    /// One read of the state for [`Pages::admit`]: `Some(Ok(()))` when the entry moved to
    /// in-flight, `Some(Err(_))` when it ends cancelled, `None` when it goes on waiting.
    fn try_admit(&self, id: u64, key: &str, page: u64) -> Option<Result<(), SkpError>> {
        let mut state = self.lock();
        let Some(entry) = state.waiting.iter().find(|w| w.id == id) else {
            // Removed by `Pages::cancel`.
            return Some(Err(cancelled()));
        };
        if entry.cancelled || state.page != page {
            state.waiting.retain(|w| w.id != id);
            self.bump();
            return Some(Err(cancelled()));
        }
        let earlier = state.in_flight.iter().any(|f| f.page < page);
        if state.ends_running == 0 && state.late_closes_running == 0 && !earlier {
            state.waiting.retain(|w| w.id != id);
            state.in_flight.push(InFlight {
                id,
                key: key.to_string(),
                page,
            });
            self.bump();
            return Some(Ok(()));
        }
        None
    }

    /// The end of an open command's bookkeeping, in one critical section with [`Pages::page_started`]'s
    /// taking of the set (ADR-037 section 4). `opened` is the dataset name the open returned, if it
    /// returned one.
    ///
    /// - **Current page:** the in-flight entry is removed and the name enters the current set.
    /// - **Ended page, no name:** the in-flight entry is removed; nothing is closed.
    /// - **Ended page, a name:** in the same critical section the entry is removed and
    ///   `late_closes_running` is raised, so the gate never sees the entry gone with the late close
    ///   not yet counted. The mutex is then released and a late close starts on a thread of its own:
    ///   the host's close, then `Projects::release_ended` when there is a `Projects`, then the
    ///   decrement, held by a drop guard. With no `Projects` (`setup` managed `None`), no project
    ///   lock can be held, since only `Projects` takes one and `save_project` and `open_project`
    ///   refuse without it, so the late close is the host's close and the decrement.
    ///   If the thread does not start, the error goes to standard error by `writeln!`, the guard
    ///   opens the gate, and that open stays held, as it was before this module.
    pub fn settle(
        self: &Arc<Self>,
        mut ticket: Ticket,
        opened: Option<&str>,
        host: &Arc<SkpHost>,
        projects: Option<Arc<Projects>>,
    ) -> Settled {
        ticket.settled = true;
        let (id, page) = (ticket.id, ticket.page);
        let late = self.change(|s| {
            s.in_flight.retain(|f| f.id != id);
            let current = s.page == page;
            match (opened, current) {
                (Some(name), true) => {
                    s.names.insert(name.to_string());
                    None
                }
                (Some(name), false) => {
                    s.late_closes_running = s.late_closes_running.saturating_add(1);
                    Some(Some(name.to_string()))
                }
                (None, true) => None,
                (None, false) => Some(None),
            }
        });
        let name = match late {
            None => return Settled::Current,
            Some(None) => return Settled::Ended(None),
            Some(Some(name)) => name,
        };
        let guard = LateGuard {
            pages: self.clone(),
        };
        let host = host.clone();
        let spawned = std::thread::Builder::new()
            .name("page-late-close".to_string())
            .spawn(move || {
                let _guard = guard;
                close_one(&host, &name);
                if let Some(projects) = projects {
                    projects.release_ended();
                }
            });
        match spawned {
            Ok(handle) => Settled::Ended(Some(handle)),
            Err(e) => {
                let _ = writeln!(
                    std::io::stderr(),
                    "[spatial-ide-shell] a late close's thread did not start: {e}"
                );
                Settled::Ended(None)
            }
        }
    }

    /// The `close_dataset` command's own close of a name the page holds: the name leaves the
    /// current page's opens, so the end does not close it again.
    pub fn forget(&self, name: &str) {
        self.change(|s| {
            s.names.remove(name);
        });
    }

    /// Called from the page-load hook at a main-window `Started`. It starts a new page and closes the
    /// gate, then starts the end on a thread of its own and returns, with no wait and no kernel call.
    /// Its work does not grow with the page's entries (the set is taken, not copied), and it has no
    /// panic path: no `unwrap`, `expect`, indexing, `eprintln!` or unchecked arithmetic. The handle is
    /// read only by the tests; `None` when the thread did not start, in which case the error went to
    /// standard error by `writeln!` and the gate is open.
    ///
    /// A gate-waiting entry whose page is no longer the current page is not flagged here; it is
    /// cancelled when its [`Pages::admit`] next reads the state.
    pub fn page_started(self: &Arc<Self>, parts: EndParts) -> Option<JoinHandle<()>> {
        let (page, set) = self.change(|s| {
            let ended = s.page;
            s.page = s.page.saturating_add(1);
            s.ends_running = s.ends_running.saturating_add(1);
            (ended, std::mem::take(&mut s.names))
        });
        let guard = EndGuard {
            pages: self.clone(),
        };
        let pages = self.clone();
        let spawned = std::thread::Builder::new()
            .name("page-end".to_string())
            .spawn(move || {
                let _guard = guard;
                run_end(&pages, page, set, parts);
            });
        match spawned {
            Ok(handle) => Some(handle),
            Err(e) => {
                let _ = writeln!(
                    std::io::stderr(),
                    "[spatial-ide-shell] a page end's thread did not start: {e}"
                );
                None
            }
        }
    }

    /// The `cancel` command (ADR-037 section 5; ADV-2026-11-26-16 item 1).
    ///
    /// The cancel goes to `SkpHost::cancel` first, so the version check and the lookup by the handle's
    /// shape stay the kernel's. Only when the kernel answers `Unknown`, and the handle does not parse
    /// as a `StreamHandle`, does it look for gate-waiting entries with that key: their flags are set,
    /// they are removed, and the answer is `Requested`. Every other answer, the version refusal
    /// included, is returned unchanged. A second cancel of a key that waited at the gate gets the
    /// kernel's `unknown`: the binding no longer holds it. Entries under distinct tickets with one key
    /// are all matched by one cancel. No text or shape of SKP-V0 changes.
    ///
    /// **The moments this does not cover.** From `admit` returning to `begin_open` registering the key
    /// inside `spawn_blocking`, neither the binding nor the kernel holds the key, so a cancel answers
    /// `unknown`; the window from the command's dispatch to `begin_open` answers the same today. A
    /// second moment, inside one request round trip: the kernel answers `unknown` while the open
    /// waits at the gate, and the open leaves the gate before the binding looks. The binding then
    /// finds no gate entry, answers `unknown`, and the open goes on.
    pub fn cancel(
        &self,
        host: &SkpHost,
        request: CancelRequest,
    ) -> Result<CancelResponse, SkpError> {
        let handle = request.handle.clone();
        let answer = host.cancel(request)?;
        if answer.state != CancelState::Unknown || handle.parse::<StreamHandle>().is_ok() {
            return Ok(answer);
        }
        let found = self.change(|s| {
            let mut found = false;
            for entry in s.waiting.iter_mut().filter(|w| w.key == handle) {
                entry.cancelled = true;
                found = true;
            }
            s.waiting.retain(|w| !w.cancelled);
            found
        });
        if found {
            Ok(CancelResponse {
                state: CancelState::Requested,
            })
        } else {
            Ok(answer)
        }
    }
}

/// The host's close of one dataset name, by the `close_dataset` command's own request. `true` when
/// the host answered `Ok`.
fn close_one(host: &SkpHost, name: &str) -> bool {
    let Ok(dataset) = name.parse::<DatasetHandle>() else {
        return false;
    };
    host.close_dataset(CloseDatasetRequest {
        skp: SKP_VERSION.to_string(),
        dataset,
    })
    .is_ok()
}

/// The end of page `page`, on its own thread, in this order (ADR-037 section 3):
///
/// 1. the page's in-flight keys are read under the mutex; with it released, `SkpHost::cancel` for
///    each, then `RunningPublishes::cancel_all`. A key still in the window [`Pages::cancel`]'s doc
///    names answers `unknown`, and its open completes into a late close;
/// 2. for each name, the host's close, then `stop_poll`;
/// 3. `Projects::release_ended`, once, when there is a [`Projects`];
/// 4. one session-log line at level `info`, at every end, the first load's included. Each count is
///    in decimal digits; the line carries no handle, path, name or project identity. A late close
///    writes no line;
/// 5. the caller's drop guard lowers `ends_running`, whether this returns or unwinds.
///
/// `opens_closed` counts the names whose close returned `Ok`; `opens_cancelled` counts the keys whose
/// cancel answered `requested` (no gate-waiting open the binding cancelled, and no key the kernel
/// answered `unknown` or `already_terminal`); `publishes_cancelled` is `cancel_all`'s return.
fn run_end(pages: &Arc<Pages>, page: u64, set: BTreeSet<String>, parts: EndParts) {
    let keys: Vec<String> = pages
        .lock()
        .in_flight
        .iter()
        .filter(|f| f.page == page)
        .map(|f| f.key.clone())
        .collect();
    let mut opens_cancelled = 0usize;
    for key in keys {
        let request = CancelRequest {
            skp: SKP_VERSION.to_string(),
            handle: key,
        };
        if let Ok(answer) = parts.host.cancel(request) {
            if answer.state == CancelState::Requested {
                opens_cancelled += 1;
            }
        }
    }
    let publishes_cancelled = parts.publishes.cancel_all();
    let mut opens_closed = 0usize;
    for name in &set {
        if close_one(&parts.host, name) {
            opens_closed += 1;
        }
        (parts.stop_poll)(name);
    }
    if let Some(projects) = &parts.projects {
        projects.release_ended();
    }
    (parts.log)(
        "info",
        &format!(
            "page-end opens_closed={opens_closed} opens_cancelled={opens_cancelled} publishes_cancelled={publishes_cancelled}"
        ),
    );
}

#[cfg(test)]
mod tests {
    use std::future::Future;
    use std::path::PathBuf;
    use std::pin::Pin;
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Condvar;
    use std::task::{Context, Poll, Waker};
    use std::time::Duration;

    use serde_json::{json, Value};
    use spatial_engine::fixture::{write_geoparquet, AttributeMode, FixtureSpec};
    use spatial_engine::{ArmOutcome, ArmedWatch, CancelToken, SourceWatchArm, WatchSink};
    use spatial_kernel::project::store::{LockRefused, ProjectLock};
    use spatial_kernel::project::ProjectUri;
    use spatial_kernel::session_history::StepRecorder;
    use spatial_kernel::skp::{session_end_channel, StreamRegistry};
    use spatial_kernel::Catalog;
    use spatial_skp::v0::{
        HexF64, OpenDatasetRequest, OpenProjectRequest, OpenProjectResponse, SaveProjectRequest,
    };

    use super::*;

    /// A bound on a wait that no test expects to reach. It is a harness bound, never a claim about
    /// how long anything takes (ADR-018), and it keeps a broken test from hanging the run.
    const HARNESS_BOUND: Duration = Duration::from_secs(120);

    const STYLE: &str = r##"{"style_version":1,"layer":{"geometry":"polygon","fill_color":{"literal":"#4285f4"},"fill_opacity":{"literal":0.35},"outline_color":{"literal":"#000000"},"outline_width":{"literal":1.5}}}"##;

    /// A one-way latch: `set` once, `wait` until it is.
    struct Latch {
        set: Mutex<bool>,
        changed: Condvar,
    }

    impl Latch {
        fn new() -> Arc<Self> {
            Arc::new(Self {
                set: Mutex::new(false),
                changed: Condvar::new(),
            })
        }

        fn set(&self) {
            *self.set.lock().unwrap_or_else(|e| e.into_inner()) = true;
            self.changed.notify_all();
        }

        /// `true` when the latch was set, `false` at the harness bound.
        fn wait(&self) -> bool {
            let guard = self.set.lock().unwrap_or_else(|e| e.into_inner());
            let (guard, _) = self
                .changed
                .wait_timeout_while(guard, HARNESS_BOUND, |set| !*set)
                .unwrap_or_else(|e| e.into_inner());
            *guard
        }
    }

    /// What the next `arm` call does. Each mode is used once, by the first call after it is set.
    enum Mode {
        Plain,
        /// Signals `entered`, then waits for `release` inside `arm`, then arms no watch.
        Block {
            entered: Arc<Latch>,
            release: Arc<Latch>,
        },
        /// Arms a watch whose `Drop` signals `dropping` and then waits for `release`.
        HeldWatch {
            dropping: Arc<Latch>,
            release: Arc<Latch>,
        },
    }

    struct TestArm(Mutex<Mode>);

    impl TestArm {
        fn set(&self, mode: Mode) {
            *self.0.lock().unwrap_or_else(|e| e.into_inner()) = mode;
        }
    }

    struct HeldWatch {
        dropping: Arc<Latch>,
        release: Arc<Latch>,
    }

    impl ArmedWatch for HeldWatch {
        fn resolves_unchanged(&self) -> bool {
            true
        }
    }

    impl Drop for HeldWatch {
        fn drop(&mut self) {
            self.dropping.set();
            self.release.wait();
        }
    }

    impl SourceWatchArm for TestArm {
        fn arm(&self, _path: &std::path::Path, _sink: WatchSink) -> ArmOutcome {
            let mode = std::mem::replace(
                &mut *self.0.lock().unwrap_or_else(|e| e.into_inner()),
                Mode::Plain,
            );
            let checks_only = || ArmOutcome::ChecksOnly {
                reason: "test arm: no watch armed".to_string(),
            };
            match mode {
                Mode::Plain => checks_only(),
                Mode::Block { entered, release } => {
                    entered.set();
                    release.wait();
                    checks_only()
                }
                Mode::HeldWatch { dropping, release } => {
                    ArmOutcome::Watching(Box::new(HeldWatch { dropping, release }))
                }
            }
        }
    }

    /// What the end's two closures saw.
    #[derive(Default)]
    struct Seen {
        stopped: Mutex<Vec<String>>,
        lines: Mutex<Vec<String>>,
    }

    impl Seen {
        fn stopped(&self) -> Vec<String> {
            self.stopped
                .lock()
                .unwrap_or_else(|e| e.into_inner())
                .clone()
        }

        fn lines(&self) -> Vec<String> {
            self.lines.lock().unwrap_or_else(|e| e.into_inner()).clone()
        }
    }

    /// A real `SkpHost`, `StepRecorder` and `Projects` over a temporary root, with the `Pages` under
    /// test, as `kernel/tests/project_reopen_skp.rs` has them. The folder is in the test process's own
    /// temporary folder, as `commands.rs`'s tests make theirs.
    struct Rig {
        machine: PathBuf,
        folder: PathBuf,
        data: PathBuf,
        host: Arc<SkpHost>,
        projects: Arc<Projects>,
        arm: Arc<TestArm>,
        pages: Arc<Pages>,
        publishes: Arc<RunningPublishes>,
        seen: Arc<Seen>,
    }

    fn rig(name: &str) -> Rig {
        let dir = std::env::temp_dir()
            .join("spatial-ide-shell-page-tests")
            .join(std::process::id().to_string())
            .join(name);
        let _ = std::fs::remove_dir_all(&dir);
        let folder = dir.join("project");
        std::fs::create_dir_all(&folder).expect("the project folder");
        let data = dir.join("data").join("parcels.parquet");
        std::fs::create_dir_all(data.parent().expect("a parent")).expect("the data folder");
        let spec = FixtureSpec {
            features: 100,
            avg_vertices: 8,
            seed: 1,
            attributes: AttributeMode::CategoricalZone,
            ..Default::default()
        };
        write_geoparquet(&data, &spec).expect("the fixture");
        let arm = Arc::new(TestArm(Mutex::new(Mode::Plain)));
        let host = Arc::new(SkpHost::new(
            Arc::new(Catalog::new()),
            StreamRegistry::new(),
            arm.clone(),
            session_end_channel().0,
        ));
        let machine = dir.join("machine");
        let recorder = Arc::new(StepRecorder::new(dir.join("sessions"), host.clone()));
        let projects = Arc::new(Projects::new(machine.clone(), recorder));
        Rig {
            machine,
            folder,
            data,
            host,
            projects,
            arm,
            pages: Arc::new(Pages::new()),
            publishes: Arc::new(RunningPublishes::new()),
            seen: Arc::new(Seen::default()),
        }
    }

    fn poll<F: Future>(future: &mut Pin<Box<F>>) -> Poll<F::Output> {
        future
            .as_mut()
            .poll(&mut Context::from_waker(Waker::noop()))
    }

    fn ready<T>(poll: Poll<T>, what: &str) -> T {
        match poll {
            Poll::Ready(value) => value,
            Poll::Pending => panic!("{what}: the future was pending"),
        }
    }

    fn assert_pending<T>(poll: Poll<T>, what: &str) {
        assert!(
            matches!(poll, Poll::Pending),
            "{what}: the future was ready"
        );
    }

    impl Rig {
        fn parts_with(&self, stop_poll: StopFn, log: LogFn) -> EndParts {
            EndParts {
                host: self.host.clone(),
                projects: Some(self.projects.clone()),
                publishes: self.publishes.clone(),
                stop_poll,
                log,
            }
        }

        fn recording_stop(&self) -> StopFn {
            let seen = self.seen.clone();
            Box::new(move |name| {
                seen.stopped
                    .lock()
                    .unwrap_or_else(|e| e.into_inner())
                    .push(name.to_string());
            })
        }

        fn recording_log(&self) -> LogFn {
            let seen = self.seen.clone();
            Box::new(move |level, message| {
                seen.lines
                    .lock()
                    .unwrap_or_else(|e| e.into_inner())
                    .push(format!("{level} {message}"));
            })
        }

        fn parts(&self) -> EndParts {
            self.parts_with(self.recording_stop(), self.recording_log())
        }

        /// A page starts and its end is joined by the handle `page_started` returns.
        fn page(&self) {
            self.pages
                .page_started(self.parts())
                .expect("the end's thread started")
                .join()
                .expect("the end ran to its close");
        }

        fn last_line(&self) -> String {
            self.seen.lines().last().expect("a page-end line").clone()
        }

        /// The gate, for a test of a page that expects it open.
        fn admit_now(&self, key: &str) -> Ticket {
            let mut future = Box::pin(self.pages.admit(key));
            ready(poll(&mut future), "admit").expect("admitted")
        }

        fn open_request(&self, key: &str) -> OpenDatasetRequest {
            OpenDatasetRequest {
                skp: SKP_VERSION.to_string(),
                path: self.data.display().to_string(),
                cancel_key: key.to_string(),
                crs_assertion: None,
                identity: None,
            }
        }

        /// What `open_dataset` does after the gate: the host's open, then `settle`.
        fn open(&self, ticket: Ticket, key: &str) -> (Settled, String) {
            let name = self
                .host
                .open_dataset(self.open_request(key))
                .expect("the open")
                .dataset
                .as_str()
                .to_string();
            let settled =
                self.pages
                    .settle(ticket, Some(&name), &self.host, Some(self.projects.clone()));
            (settled, name)
        }

        fn reopen_request(&self, key: &str) -> OpenProjectRequest {
            OpenProjectRequest {
                skp: SKP_VERSION.to_string(),
                folder: self.folder.display().to_string(),
                cancel_key: key.to_string(),
                answer: None,
                relink: None,
            }
        }

        /// A first save of the open `name` into the project folder: the identity.
        fn save(&self, name: &str) -> ProjectUri {
            let hex = |x: f64| HexF64(x).to_hex();
            let wire = json!({
                "skp": SKP_VERSION, "dataset": name,
                "folder": self.folder.display().to_string(),
                "workspace": {
                    "filter": null, "clauses": [],
                    "style": serde_json::from_str::<Value>(STYLE).expect("STYLE is JSON"),
                    "view": {"centre": [hex(2_600_000.5), hex(1_200_000.25)], "zoom": hex(-4.5)}
                }
            });
            let request: SaveProjectRequest = serde_json::from_value(wire).expect("the request");
            let saved = self.projects.save_project(request).expect("saved");
            saved.project.parse().expect("an identity")
        }

        /// A project saved before any page: the data opened, saved into the folder and closed, and
        /// the save's lock released as the shell's `close_dataset` releases it.
        fn saved_before_any_page(&self) -> ProjectUri {
            let name = self
                .host
                .open_dataset(self.open_request("seed"))
                .expect("the seed open")
                .dataset;
            let project = self.save(name.as_str());
            assert!(close_one(&self.host, name.as_str()), "the seed close");
            self.projects.release_ended();
            project
        }

        fn lock_state(&self, project: &ProjectUri) -> &'static str {
            match ProjectLock::try_lock(&self.machine, project) {
                Ok(_lock) => "free",
                Err(LockRefused::Held) => "held",
                Err(LockRefused::Io(_)) => "io",
            }
        }

        fn is_open(&self, name: &str) -> bool {
            self.host.catalog().get(name).is_some()
        }

        fn cancel(&self, handle: &str) -> Result<CancelResponse, SkpError> {
            self.pages.cancel(
                &self.host,
                CancelRequest {
                    skp: SKP_VERSION.to_string(),
                    handle: handle.to_string(),
                },
            )
        }
    }

    /// An open running on its own thread, held inside `arm`.
    fn held_open(
        rig: &Rig,
        key: &str,
    ) -> (Arc<Latch>, std::thread::JoinHandle<Result<(), SkpError>>) {
        let (entered, release) = (Latch::new(), Latch::new());
        rig.arm.set(Mode::Block {
            entered: entered.clone(),
            release: release.clone(),
        });
        let (host, request) = (rig.host.clone(), rig.open_request(key));
        let thread = std::thread::spawn(move || host.open_dataset(request).map(|_| ()));
        assert!(entered.wait(), "the open reached the watch arm");
        (release, thread)
    }

    #[test]
    fn a_page_end_closes_its_opens_and_frees_the_lock() {
        let rig = rig("u1");
        rig.page();
        let (settled, name) = rig.open(rig.admit_now("u1"), "u1");
        assert!(matches!(settled, Settled::Current));
        let project = rig.save(&name);
        assert_eq!(
            rig.lock_state(&project),
            "held",
            "the premise: the save holds the lock"
        );
        rig.page();
        assert!(!rig.is_open(&name), "the end closed the open");
        assert_eq!(rig.lock_state(&project), "free");
        assert_eq!(
            rig.last_line(),
            "info page-end opens_closed=1 opens_cancelled=0 publishes_cancelled=0"
        );
    }

    #[test]
    fn a_page_end_frees_the_lock_after_the_close() {
        let rig = rig("u1b");
        rig.page();
        let (_, name) = rig.open(rig.admit_now("u1b"), "u1b");
        let project = rig.save(&name);
        rig.page();
        assert!(!rig.is_open(&name), "the close was kept");
        assert_eq!(
            rig.lock_state(&project),
            "free",
            "the end's release_ended did not free the lock"
        );
    }

    #[test]
    fn an_open_settled_after_its_page_ended_is_closed() {
        let rig = rig("u2");
        let project = rig.saved_before_any_page();
        rig.page();
        let ticket = rig.admit_now("u2");
        rig.page();
        let reopened = rig
            .projects
            .open_project_command(rig.reopen_request("u2"))
            .expect("the reopen");
        let OpenProjectResponse::Opened(opened) = reopened else {
            panic!("the reopen was not opened");
        };
        let name = opened.dataset.as_str().to_string();
        assert_eq!(
            rig.lock_state(&project),
            "held",
            "the premise: the reopen holds the lock"
        );
        let settled = rig
            .pages
            .settle(ticket, Some(&name), &rig.host, Some(rig.projects.clone()));
        let Settled::Ended(Some(late)) = settled else {
            panic!("the open's page had ended, so a late close was expected");
        };
        late.join().expect("the late close ran");
        assert!(!rig.is_open(&name), "the late close closed the open");
        assert_eq!(rig.lock_state(&project), "free");
        assert!(
            rig.pages.lock().names.is_empty(),
            "the name did not enter the current set"
        );
    }

    #[test]
    fn the_gate_waits_for_ends_earlier_opens_and_late_closes() {
        let rig = rig("u3");
        rig.page();

        // An end held in its `log` part.
        let (entered, release) = (Latch::new(), Latch::new());
        let held_log: LogFn = {
            let (entered, release) = (entered.clone(), release.clone());
            Box::new(move |_, _| {
                entered.set();
                release.wait();
            })
        };
        let end = rig
            .pages
            .page_started(rig.parts_with(rig.recording_stop(), held_log))
            .expect("the end's thread started");
        assert!(entered.wait(), "the end reached its log part");
        let mut first = Box::pin(rig.pages.admit("a"));
        assert_pending(poll(&mut first), "an end is running");
        release.set();
        end.join().expect("the end ran");
        let ticket = ready(poll(&mut first), "the end has finished").expect("admitted");
        rig.pages.settle(ticket, None, &rig.host, None);

        // An earlier page's unsettled open, with that page's end finished.
        let earlier = rig.admit_now("b");
        rig.page();
        let mut second = Box::pin(rig.pages.admit("c"));
        assert_pending(poll(&mut second), "an earlier page's open is in flight");
        rig.pages.settle(earlier, None, &rig.host, None);
        let ticket = ready(poll(&mut second), "the earlier open has settled").expect("admitted");
        rig.pages.settle(ticket, None, &rig.host, None);

        // A late close held in the drop of the open's armed watch.
        let (dropping, release) = (Latch::new(), Latch::new());
        rig.arm.set(Mode::HeldWatch {
            dropping: dropping.clone(),
            release: release.clone(),
        });
        let ticket = rig.admit_now("d");
        let name = rig
            .host
            .open_dataset(rig.open_request("d"))
            .expect("the open")
            .dataset
            .as_str()
            .to_string();
        rig.page();
        let settled = rig.pages.settle(ticket, Some(&name), &rig.host, None);
        let Settled::Ended(Some(late)) = settled else {
            panic!("a late close was expected");
        };
        assert!(dropping.wait(), "the late close reached the watch's drop");
        let mut third = Box::pin(rig.pages.admit("e"));
        assert_pending(poll(&mut third), "a late close is running");
        release.set();
        late.join().expect("the late close ran");
        assert!(!rig.is_open(&name));
        ready(poll(&mut third), "the late close has finished").expect("admitted");
    }

    #[test]
    fn a_name_the_page_closed_is_not_closed_again() {
        let rig = rig("u4");
        rig.page();
        let (_, name) = rig.open(rig.admit_now("u4"), "u4");
        assert!(close_one(&rig.host, &name), "the host's close");
        rig.pages.forget(&name);
        rig.page();
        assert!(
            rig.seen.stopped().is_empty(),
            "the end stopped the poll of {:?}",
            rig.seen.stopped()
        );
        assert_eq!(
            rig.last_line(),
            "info page-end opens_closed=0 opens_cancelled=0 publishes_cancelled=0"
        );
    }

    #[test]
    fn a_page_end_cancels_registered_publishes() {
        let rig = rig("u5");
        let token = CancelToken::new();
        rig.publishes.insert("attempt-1".to_string(), token.clone());
        rig.page();
        assert!(
            token.is_cancelled(),
            "the registered token was not cancelled"
        );
        assert_eq!(
            rig.last_line(),
            "info page-end opens_closed=0 opens_cancelled=0 publishes_cancelled=1"
        );
    }

    #[test]
    fn the_gate_cancel_is_the_kernels_cancelled_refusal() {
        let rig = rig("u6");
        rig.page();
        // The kernel's own answer, from a real open held in the watch arm.
        let (release, open) = held_open(&rig, "kernel-key");
        let answer = rig.cancel("kernel-key").expect("the cancel");
        assert_eq!(answer.state, CancelState::Requested);
        release.set();
        let kernel_refusal = open
            .join()
            .expect("the open's thread")
            .expect_err("the cancelled open is refused");
        assert_eq!(kernel_refusal.code, "engine.cancelled");
        // The gate's: an open waiting behind an earlier page's open.
        let earlier = rig.admit_now("earlier");
        rig.page();
        let mut waiting = Box::pin(rig.pages.admit("gate-key"));
        assert_pending(poll(&mut waiting), "behind the earlier page's open");
        assert_eq!(
            rig.cancel("gate-key").expect("the cancel").state,
            CancelState::Requested
        );
        let gate_refusal = ready(poll(&mut waiting), "cancelled at the gate")
            .err()
            .expect("the gate-cancelled open is refused");
        assert_eq!(
            serde_json::to_value(&gate_refusal).expect("serializes"),
            serde_json::to_value(&kernel_refusal).expect("serializes"),
            "the gate's refusal is the kernel's"
        );
        rig.pages.settle(earlier, None, &rig.host, None);
    }

    #[test]
    fn a_cancel_at_the_gate_and_the_kernels_other_answers() {
        let rig = rig("u7");
        rig.page();
        let earlier = rig.admit_now("earlier");
        rig.page();
        let reached = Arc::new(AtomicBool::new(false));
        let mut waiting = Box::pin({
            let (pages, reached) = (rig.pages.clone(), reached.clone());
            async move {
                let ticket = pages.admit("gate-key").await?;
                reached.store(true, Ordering::SeqCst);
                Ok::<Ticket, SkpError>(ticket)
            }
        });
        assert_pending(poll(&mut waiting), "behind the earlier page's open");

        // An unknown key: the kernel's `unknown`.
        assert_eq!(
            rig.cancel("nobody").expect("the cancel").state,
            CancelState::Unknown
        );
        // A bad version, on the key waiting at the gate: the kernel's refusal, and the open waits on.
        let refusal = rig
            .pages
            .cancel(
                &rig.host,
                CancelRequest {
                    skp: "skp/0.0".to_string(),
                    handle: "gate-key".to_string(),
                },
            )
            .expect_err("a bad version is refused");
        assert_eq!(refusal.code, "skp.version_unsupported");
        assert_pending(poll(&mut waiting), "the bad-version cancel left it waiting");
        // A stream handle's shape never matches a gate key, even for a key spelled like one.
        let spelled = format!("sh_{}", "0".repeat(32));
        let mut like_a_stream = Box::pin(rig.pages.admit(&spelled));
        assert_pending(
            poll(&mut like_a_stream),
            "a key spelled like a stream handle",
        );
        assert_eq!(
            rig.cancel(&spelled).expect("the cancel").state,
            CancelState::Unknown
        );
        assert_pending(
            poll(&mut like_a_stream),
            "the stream-shaped cancel left it waiting",
        );
        // A key the kernel holds: the kernel's `requested`.
        let (release, open) = held_open(&rig, "kernel-key");
        assert_eq!(
            rig.cancel("kernel-key").expect("the cancel").state,
            CancelState::Requested
        );
        release.set();
        open.join()
            .expect("the open's thread")
            .expect_err("cancelled");

        // The gate key: `requested`, and the open never reaches the kernel.
        assert_eq!(
            rig.cancel("gate-key").expect("the cancel").state,
            CancelState::Requested
        );
        let error = ready(poll(&mut waiting), "cancelled at the gate")
            .err()
            .expect("refused");
        assert_eq!(error.code, "engine.cancelled");
        assert!(
            !reached.load(Ordering::SeqCst),
            "the open went past the gate"
        );
        // The binding no longer holds that key.
        assert_eq!(
            rig.cancel("gate-key").expect("the cancel").state,
            CancelState::Unknown
        );
        rig.pages.settle(earlier, None, &rig.host, None);
    }

    #[test]
    fn a_second_reload_ends_the_ending_pages_gate_waiters() {
        let rig = rig("u8");
        rig.page();
        let first = rig.admit_now("a");
        rig.page();
        let mut b = Box::pin(rig.pages.admit("b"));
        assert_pending(poll(&mut b), "behind page 1's open");
        rig.page();
        let refusal = ready(poll(&mut b), "its page ended")
            .err()
            .expect("the ended page's waiter is cancelled");
        assert_eq!(refusal.code, "engine.cancelled");
        let mut c = Box::pin(rig.pages.admit("c"));
        assert_pending(poll(&mut c), "page 1's open has not settled");
        rig.pages.settle(first, None, &rig.host, None);
        let ticket = ready(poll(&mut c), "page 1's open has settled").expect("admitted");
        rig.pages.settle(ticket, None, &rig.host, None);
    }

    #[test]
    fn a_panic_in_the_end_still_opens_the_gate() {
        let rig = rig("u9");
        rig.page();
        let (_, _name) = rig.open(rig.admit_now("u9"), "u9");
        let panicking: StopFn = Box::new(|_| panic!("stop_poll panics"));
        let end = rig
            .pages
            .page_started(rig.parts_with(panicking, rig.recording_log()))
            .expect("the end's thread started");
        assert!(end.join().is_err(), "the end's thread panicked");
        let mut next = Box::pin(rig.pages.admit("next"));
        ready(poll(&mut next), "the gate is open after the panic").expect("admitted");
    }

    #[test]
    fn page_started_returns_and_starts_the_end_on_a_poisoned_lock() {
        let rig = rig("u10");
        rig.page();
        let pages = rig.pages.clone();
        let poisoner = std::thread::spawn(move || {
            let _held = pages.state.lock().unwrap_or_else(|e| e.into_inner());
            panic!("poisons the Pages mutex");
        });
        assert!(poisoner.join().is_err());
        assert!(
            rig.pages.state.is_poisoned(),
            "the premise: the mutex is poisoned"
        );
        let end = rig
            .pages
            .page_started(rig.parts())
            .expect("the end's thread started");
        end.join().expect("the end ran");
        assert_eq!(
            rig.last_line(),
            "info page-end opens_closed=0 opens_cancelled=0 publishes_cancelled=0"
        );
        let mut next = Box::pin(rig.pages.admit("next"));
        ready(poll(&mut next), "the gate is open").expect("admitted");
    }

    #[test]
    fn a_ticket_dropped_unsettled_does_not_hold_the_gate() {
        let rig = rig("u11");
        rig.page();
        let ticket = rig.admit_now("u11");
        rig.page();
        let mut next = Box::pin(rig.pages.admit("next"));
        assert_pending(poll(&mut next), "the earlier page's ticket is in flight");
        drop(ticket);
        ready(poll(&mut next), "the ticket was dropped").expect("admitted");
    }

    #[test]
    fn a_gate_waiting_future_dropped_leaves_no_entry_to_cancel() {
        let rig = rig("u11b");
        rig.page();
        let earlier = rig.admit_now("earlier");
        rig.page();
        let mut waiting = Box::pin(rig.pages.admit("dropped-key"));
        assert_pending(poll(&mut waiting), "behind the earlier page's open");
        drop(waiting);
        assert_eq!(
            rig.cancel("dropped-key").expect("the cancel").state,
            CancelState::Unknown,
            "a dropped admit left an entry to cancel"
        );
        rig.pages.settle(earlier, None, &rig.host, None);
    }

    #[test]
    fn a_reopen_behind_an_earlier_pages_reopen_waits_then_opens() {
        let rig = rig("u12");
        let project = rig.saved_before_any_page();
        rig.page();
        let ticket = rig.admit_now("reopen-1");
        // Page 1's reopen takes the project's lock, then stands in the watch arm.
        let (entered, release) = (Latch::new(), Latch::new());
        rig.arm.set(Mode::Block {
            entered: entered.clone(),
            release: release.clone(),
        });
        let (projects, request) = (rig.projects.clone(), rig.reopen_request("reopen-1"));
        let first = std::thread::spawn(move || projects.open_project_command(request));
        assert!(entered.wait(), "the reopen reached the watch arm");
        assert_eq!(
            rig.lock_state(&project),
            "held",
            "the premise: the reopen holds the lock"
        );
        rig.page();
        let mut second = Box::pin(rig.pages.admit("reopen-2"));
        assert_pending(poll(&mut second), "the earlier page's reopen is in flight");
        release.set();
        let answer = first.join().expect("the reopen's thread");
        let name = match &answer {
            Ok(OpenProjectResponse::Opened(opened)) => Some(opened.dataset.as_str().to_string()),
            _ => None,
        };
        let settled = rig.pages.settle(
            ticket,
            name.as_deref(),
            &rig.host,
            Some(rig.projects.clone()),
        );
        if let Settled::Ended(Some(late)) = settled {
            late.join().expect("the late close ran");
        }
        let ticket = ready(poll(&mut second), "the earlier reopen has settled").expect("admitted");
        let reopened = rig
            .projects
            .open_project_command(rig.reopen_request("reopen-2"))
            .expect("the second reopen is not refused");
        let OpenProjectResponse::Opened(opened) = reopened else {
            panic!("the second reopen did not answer opened");
        };
        rig.pages.settle(
            ticket,
            Some(opened.dataset.as_str()),
            &rig.host,
            Some(rig.projects.clone()),
        );
    }
}
