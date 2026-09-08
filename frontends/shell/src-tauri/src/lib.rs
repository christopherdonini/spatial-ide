// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! `frontends/shell/src-tauri` — the walking skeleton's process (docs/07 Prototype-completion cut
//! 1, architect review 2026-08-09, `protocol/skp/SKP-V0.md`).
//!
//! **One process, no sidecar** (ADR-019 design note D2.1): this crate owns the `Arc<Catalog>`, the
//! ticket registry, and `spatial_data_plane::serve()` — exactly what `kernel/src/main.rs`'s
//! `slice-host` binary already does, replacing that binary's `main`, not adding a tier. The Tauri
//! command layer and the WebSocket data plane share the identical `Arc<Catalog>` /
//! `Arc<StreamRegistry>` via `SkpHost::catalog()`/`SkpHost::tickets()`.
//!
//! **Contains no logic of its own.** `commands.rs` is decode → call `SkpHost` → serialize;
//! everything semantic lives in `kernel::skp` and below it. See `docs/02`'s "frontends: clients
//! only, no logic" and this crate's exclusion from the Cargo workspace (root `Cargo.toml`), which is
//! the structural enforcement of that rule.

mod commands;
mod origin;
mod publish;
// Entry-40 empirical producer pass instrument (`pool_poll.rs`'s own module doc has the full
// account): compiled in under EITHER a plain dev/test build OR the measure-build feature -- the
// union of both, not an existing single-condition precedent (`pool_poll.rs`'s module doc explains
// why) -- never in a plain release build. Every reference to this module elsewhere in the crate
// (`lib.rs`'s `setup`, `commands.rs`'s `open_dataset`/`close_dataset`) is gated identically.
#[cfg(any(debug_assertions, feature = "measure-build"))]
mod pool_poll;
mod state;

use std::sync::{Arc, Mutex};

use spatial_data_plane::{serve, DataPlaneConfig};
use spatial_kernel::permission::GrantSet;
use spatial_kernel::skp::SkpHost;
use spatial_kernel::{Catalog, EngineSourceFactory};
use tauri::{Emitter, Manager};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

use state::{DataPlaneHandle, SessionLog};

/// ADR-020 Amendment 1 condition 4 (fail closed) + the reviewer-gate remediation on that
/// amendment: refusing to start must be **logged** and **visible**, not silent. Silent was never
/// acceptable as `setup()`'s existing `panic!`/`.expect(...)` idiom (elsewhere in this closure)
/// would have been for THIS failure class specifically, because a plain release build has no
/// console at all (`main.rs`'s `windows_subsystem = "windows"`), so a panic's message reaches
/// nowhere a person would ever see it.
///
/// Order: **log** to the session log (so the failure survives after the dialog is dismissed and
/// the process exits) → **eprintln** (still useful under `tauri dev`, where a console exists) →
/// a **blocking** native error dialog through the already-registered `tauri_plugin_dialog` plugin,
/// naming the condition → `std::process::exit(1)`. Fail-closed stays (the process never starts);
/// silence goes.
///
/// This is a direct, host-side call on the setup thread — **not** a `#[tauri::command]` — so
/// ADR-027 decision 4's unclassified-command build-time scan (every registered command must be
/// display-classified, or the build fails) does not apply to it: there is no new command here for
/// that scan to see.
///
/// **This relies on `blocking_show()` on the setup thread, which is also the main thread — a
/// reliance stated here, not hidden (architect B2 = reviewer S3).** `tauri-plugin-dialog`
/// **2.7.2**'s own doc comment on `blocking_show()` (`src/lib.rs:355-356`), quoted verbatim:
///
/// > This is a blocking operation,
/// > and should *NOT* be used when running on the main thread context.
///
/// `setup()` (this function's only caller) runs on the main thread: `App::run` — the method
/// `.run(tauri::generate_context!())` at the bottom of this file resolves to — records
/// `main_thread_id` as the thread that calls it (`tauri-2.11.5/src/app.rs:1367`) and then invokes
/// `setup()` from inside `RuntimeRunEvent::Ready`'s handler on that same thread
/// (`tauri-2.11.5/src/app.rs:1422-1426`). The reviewer's own traced call chain from there, each
/// link verified against the pinned crate version: `blocking_show()` calls `AppHandle::
/// run_on_main_thread`, which reaches `tauri-runtime-wry` **2.11.4**'s `send_user_message`
/// (`src/lib.rs:239-248`) — when called FROM the main thread (as here), it runs the queued closure
/// **inline**, synchronously, rather than posting it to the event loop for a later pump. That
/// closure (`tauri-plugin-dialog-2.7.2/src/desktop.rs:222-225`) then itself calls
/// `std::thread::spawn` (`:225`) so the actual dialog display happens off the main thread; `rfd`
/// **0.16.0**'s own Windows backend does the same one level deeper
/// (`src/backend/win_cid/thread_future.rs:26`, `std::thread::spawn` again) to show the native message
/// box. `blocking_show()`'s own blocking `rx.recv()` (the `blocking_fn!` macro, `src/lib.rs:71-80`)
/// therefore waits on a channel fed from a thread two levels removed from the main thread, not on
/// anything requiring the main thread's own event loop to be pumping — which is why this has not
/// been observed to hang under `tauri dev` (§(f) below). **The residual, stated honestly:**
/// condition (4)'s refusal path has never been exercised on a PACKAGED (`tauri build`) artifact,
/// where a hang here would be silent — `main.rs`'s `windows_subsystem = "windows"` applies under
/// `not(debug_assertions)`, so there is no console for even the `eprintln!` above to reach. The
/// log-first ordering (this function logs before it dialogs) is what survives a silent hang: the
/// session log still carries the refusal even if the dialog itself never becomes visible. A
/// deliberate exercise of this path on a packaged artifact is a Part M candidate, at the human's
/// discretion — not undertaken by this piece.
fn refuse_to_start<R: tauri::Runtime>(app: &tauri::App<R>, log: &SessionLog, message: &str) -> ! {
    log.append("error", message);
    eprintln!("[spatial-ide-shell] REFUSING TO START: {message}");
    app.dialog()
        .message(message)
        .title("Spatial IDE could not start")
        .kind(MessageDialogKind::Error)
        .blocking_show();
    std::process::exit(1);
}

/// The one failure that can happen BEFORE a [`SessionLog`] exists to log to (reviewer S2):
/// `SessionLog::open` failing was previously a bare `panic!`, invisible in a release build for the
/// same reason [`refuse_to_start`]'s own doc comment gives (no console: `main.rs`'s
/// `windows_subsystem = "windows"`). Same shape as [`refuse_to_start`] minus the log line — there
/// is nothing to log this particular failure into, so the comment says so rather than pretending
/// otherwise. Kept as a separate function (rather than `refuse_to_start` taking an
/// `Option<&SessionLog>`) so every OTHER call site, which always has a real, already-opened log,
/// cannot accidentally take the "nothing to log to" path.
fn refuse_to_start_before_log<R: tauri::Runtime>(app: &tauri::App<R>, message: &str) -> ! {
    eprintln!("[spatial-ide-shell] REFUSING TO START (no session log exists yet to log this to): {message}");
    app.dialog()
        .message(message)
        .title("Spatial IDE could not start")
        .kind(MessageDialogKind::Error)
        .blocking_show();
    std::process::exit(1);
}

/// ADR-020 Amendment 1 (rewritten 2026-09-08): the origin pinned by the config mirror
/// (`origin::expected_origin_from_config`) at `setup()` time, exactly as passed into
/// `DataPlaneConfig::expected_origin` — managed so the post-load self-check
/// (`on_page_load` below) can compare the webview's *actual* URL against it. Read-only after
/// `setup()` manages it: nothing here, and nothing in the self-check that reads it, ever writes a
/// new value back into it or into `DataPlaneConfig` — an ASSERTION, never a second selection (the
/// human's ruling on `DECISIONS-PENDING.md` entry 55; `AI_DEVELOPMENT.md`'s "Never block or pump
/// inside Tauri's `setup()`" mechanic, `AI_DEVELOPMENT.md:147`).
struct PinnedOrigin {
    origin: String,
    /// The window label the self-check scopes itself to (`tauri.conf.json`'s
    /// `app.windows[0].label`, the same one the config mirror's own `use_https` input is read
    /// from) — a page-load event for any other webview is not this process's main window and is
    /// silently skipped. This crate creates exactly one window in every build mode today
    /// (including `measure-build`'s own block below, which builds the SAME configured window
    /// rather than a second one), so this scoping is defensive rather than load-bearing in
    /// practice.
    window_label: String,
}

/// The event name `on_page_load`'s self-check emits on a mismatch — the single source both this
/// file's `app.emit` call and the frontend's `listen(...)` call (`diagnostics/originSelfCheck.ts`)
/// must agree on.
const ORIGIN_SELF_CHECK_MISMATCH_EVENT: &str = "origin-self-check-mismatch";

/// Payload for [`ORIGIN_SELF_CHECK_MISMATCH_EVENT`] — mirrors
/// `diagnostics/originSelfCheck.ts`'s discriminated `OriginSelfCheckPayload` union field-for-field,
/// tagged on `kind`.
///
/// **Reviewer S5: a `Webview::url()`/normalisation FAILURE is typed distinctly from a genuine
/// MISMATCH.** An unreadable actual origin does not mean the pinned origin is wrong — only that
/// this one check could not confirm it either way; the data plane's own admission still runs
/// against the pinned origin exactly as pinned, unaffected by this check's own inability to read
/// the webview back. Collapsing the two into one "mismatch" state (the pre-fix shape) overclaimed:
/// it told the frontend "the data plane will refuse this session" in a case where it might not.
///
/// **Reviewer S6's alternative — reading `payload.url()` instead of `Webview::url()` — was
/// considered and is deferred, not adopted.** `RELEASE-0.1.md` Amendment 6's "Preregistration —
/// item 1 (b)" names `Webview::url()` specifically ("read `Webview::url()`, normalise, compare to
/// the pinned origin"), and this ADR sits behind the human's security red line: preregistration
/// fidelity is not something this piece may trade away on its own initiative. **The difference
/// between the two reads is a real TOCTOU window, and a benign one (architect advisory, correcting
/// an earlier draft of this paragraph which claimed the two "observe the SAME completed
/// navigation").** `payload.url()` is the URL of the load that fired this event; `Webview::url()`
/// re-reads the webview's live state at call time, and with `csp: null`
/// (`frontends/shell/src-tauri/tauri.conf.json:22`) page script may navigate between the two
/// instants, so they CAN disagree. What that window can do is bounded: this check is an ASSERTION
/// over an origin `setup()` already pinned and nothing ever rewrites, so a navigation landing
/// inside the window can only make the check MORE conservative — report a mismatch or an
/// unverifiable read for a session the data plane still admits exactly as pinned — and can never
/// change what the data plane admits, because no path from here writes back into that decision.
/// Which read the preregistration names therefore remains the only thing that selects between them.
#[derive(serde::Serialize, Clone)]
#[serde(tag = "kind", rename_all = "camelCase")]
enum OriginSelfCheckOutcome {
    /// The webview's actual origin was read and normalised successfully, and differs from the
    /// pinned one — the data plane WILL refuse every stream this session opens.
    Mismatch { pinned: String, actual: String },
    /// `Webview::url()` or `origin::expected_origin_from_url` itself failed. The pinned origin may
    /// still be exactly right; this check simply could not confirm it, and admission is unaffected.
    Unverifiable { pinned: String, error: String },
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        // ADR-020 Amendment 1 (rewritten): the post-load self-check. Registered on the `Builder`
        // (not inside `setup()`) because `Webview<R>` implements `Manager<R>`/`Emitter<R>`, so this
        // closure needs nothing `setup()` alone provides -- it reads managed state
        // (`PinnedOrigin`/`SessionLog`) the SAME way any command does. Tauri calls this once per
        // page-load event, per webview (`tauri::Builder::on_page_load`,
        // `tauri-2.11.5/src/app.rs:1781-1789`: `Fn(&Webview<R>, &PageLoadPayload<'_>)`), for every
        // webview this process ever creates -- filtered below to `PageLoadEvent::Finished` and this
        // process's one main window.
        //
        // **This can only ever fire after `setup()` has returned.** Page-load events are dispatched
        // by the app's own event loop, which does not begin pumping until `setup()`'s synchronous
        // closure completes (`tauri-2.11.5/src/app.rs:1422-1426`'s `RuntimeRunEvent::Ready`
        // dispatch) -- the exact same reasoning `AI_DEVELOPMENT.md`'s new mechanic states for why a
        // pumped command inside `setup()` was the disproved pump design's own hazard. So every
        // `app.manage(...)` call `setup()` makes (including `PinnedOrigin` and `SessionLog` below)
        // has already run by the time this closure can possibly observe a `Finished` event -- the
        // `try_state` calls below are a defensive `None`-skip, not a real race.
        //
        // **Assertion, never selection**: this closure reads `pinned.origin` but never writes it,
        // never touches `DataPlaneConfig`, and never re-derives an origin to pin -- it only compares
        // the webview's actual URL (normalised with the SAME `origin::expected_origin_from_url` the
        // mirror itself uses) against the value `setup()` already pinned, logs the verdict, and, on
        // a mismatch, emits one typed event so the frontend can render a named state (ADR-027
        // decision 4 untouched: no new Tauri command exists here for its unclassified-command scan
        // to see).
        .on_page_load(|webview, payload| {
            if payload.event() != tauri::webview::PageLoadEvent::Finished {
                return;
            }
            let Some(pinned) = webview.try_state::<PinnedOrigin>() else {
                return;
            };
            if webview.label() != pinned.window_label {
                return;
            }
            let Some(session_log) = webview.try_state::<SessionLog>() else {
                return;
            };

            let actual = webview
                .url()
                .map_err(|e| e.to_string())
                .and_then(|url| origin::expected_origin_from_url(&url).map_err(|e| e.to_string()));

            match actual {
                Ok(actual) if actual == pinned.origin => {
                    session_log
                        .append("info", &format!("origin-self-check ok pinned={}", pinned.origin));
                }
                Ok(actual) => {
                    let line = format!(
                        "origin-self-check MISMATCH pinned={} actual={}",
                        pinned.origin, actual
                    );
                    session_log.append("error", &line);
                    eprintln!("[spatial-ide-shell] {line}");
                    let _ = webview.app_handle().emit(
                        ORIGIN_SELF_CHECK_MISMATCH_EVENT,
                        OriginSelfCheckOutcome::Mismatch { pinned: pinned.origin.clone(), actual },
                    );
                }
                Err(e) => {
                    // Reviewer S5: distinct from a genuine mismatch (`OriginSelfCheckOutcome`'s own
                    // doc comment) -- the process is already running and the page has already
                    // loaded, so there is nothing left to refuse to START, and an unreadable actual
                    // origin does NOT mean the pinned one is wrong: this check simply could not
                    // confirm it either way, and the data plane's admission still runs against the
                    // pinned origin exactly as pinned, unaffected.
                    let line =
                        format!("origin-self-check UNVERIFIABLE pinned={} error={e}", pinned.origin);
                    session_log.append("error", &line);
                    eprintln!("[spatial-ide-shell] {line}");
                    let _ = webview.app_handle().emit(
                        ORIGIN_SELF_CHECK_MISMATCH_EVENT,
                        OriginSelfCheckOutcome::Unverifiable { pinned: pinned.origin.clone(), error: e },
                    );
                }
            }
        })
        .setup(|app| {
            // The composition SKP v0 needs (ADR-019): one catalog, one ticket registry, shared
            // between the command layer and the data-plane server below.
            let catalog = Arc::new(Catalog::new());
            let tickets = spatial_kernel::skp::StreamRegistry::new();
            let host = Arc::new(SkpHost::new(catalog.clone(), tickets.clone()));

            // Opened first, before the origin mirror below, so a fail-closed refusal
            // (`OriginError::DevUrlNotConfigured`, condition 4) has somewhere to log to before the
            // process exits -- `refuse_to_start` needs only `app.path()`, available this early.
            // Reviewer S2: this open itself failing used to be a bare `panic!`, invisible in a
            // release build with no console -- now visible the same way `refuse_to_start` is
            // (`refuse_to_start_before_log`: eprintln, a blocking dialog, `exit(1)` -- there being
            // nothing to log this one failure into is exactly why that function exists separately).
            let log_dir = app
                .path()
                .app_log_dir()
                .unwrap_or_else(|_| std::env::temp_dir().join("spatial-ide-shell-logs"));
            let session_log = SessionLog::open(&log_dir).unwrap_or_else(|e| {
                refuse_to_start_before_log(
                    app,
                    &format!("could not open a session log at {}: {e}", log_dir.display()),
                )
            });
            eprintln!("[spatial-ide-shell] session log: {}", session_log.path.display());

            // ADR-020 Amendment 1 (rewritten 2026-09-08, entry 55 = "(b)"): the config mirror.
            // `expected_origin` is no longer read off a live webview at all -- there is no `unsafe`,
            // no retry, no Win32 message pump, and nothing here can block `setup()` waiting for a
            // value that is not yet observable (`AI_DEVELOPMENT.md`'s "Never block or pump inside
            // Tauri's setup()" mechanic, `AI_DEVELOPMENT.md:147`, named for exactly this history).
            // `origin::expected_origin_from_config` is a pure function over plain inputs gathered
            // from `app.config()` below; see `origin.rs`'s own module doc for the full API +
            // version citation (condition 5) and why this mirror cannot disagree with Tauri's own
            // internal `WebviewUrl::App` resolution.
            let is_dev = tauri::is_dev();
            let dev_url = app.config().build.dev_url.clone();
            let frontend_dist = app.config().build.frontend_dist.clone();
            // Gathered once (rather than a separate `.first()` per field) so the fail-closed guard
            // just below and `window_label`/`use_https_scheme` all read the SAME configured window.
            let main_window_config = app.config().app.windows.first().cloned().unwrap_or_else(|| {
                refuse_to_start(
                    app,
                    &session_log,
                    "ADR-020 Amendment 1: tauri.conf.json declares no app.windows[0] -- there \
                     is no configured window for the origin mirror's useHttpsScheme/label/url \
                     guard, or for the post-load self-check to scope itself to",
                )
            });
            // Architect review A2: this mirror reproduces `AppManager::get_app_url`'s resolution of
            // a `WebviewUrl::App` window only (`origin.rs`'s own module doc has the verified line
            // citations and the `WebviewUrl::External`/`CustomProtocol` divergence this guards
            // against). A main window configured any other way would have the webview navigate
            // somewhere this mirror does not compute -- refuse rather than pin a value the webview
            // might never actually land on.
            if !origin::main_window_url_is_app(&main_window_config.url) {
                refuse_to_start(
                    app,
                    &session_log,
                    &format!(
                        "ADR-020 Amendment 1: the main window's configured url ({:?}) is not \
                         WebviewUrl::App -- this mirror reproduces AppManager::get_app_url's \
                         App-window resolution only (tauri-2.11.5/src/manager/webview.rs:443-461); \
                         refusing to start rather than pin an origin the webview might not \
                         actually navigate to",
                        main_window_config.url
                    ),
                );
            }
            let use_https_scheme = main_window_config.use_https_scheme;
            let window_label = main_window_config.label.clone();

            let frontend_dist_origin = match &frontend_dist {
                Some(tauri::utils::config::FrontendDist::Url(u)) => origin::FrontendDistOrigin::Url(u),
                _ => origin::FrontendDistOrigin::Other,
            };

            let webview_origin = origin::expected_origin_from_config(
                is_dev,
                dev_url.as_ref(),
                frontend_dist_origin,
                use_https_scheme,
                origin::Platform::current(),
            )
            .unwrap_or_else(|e| {
                refuse_to_start(
                    app,
                    &session_log,
                    &format!(
                        "ADR-020 Amendment 1: the config mirror could not derive a data-plane \
                         expected origin ({e}) -- refusing to start rather than guess it"
                    ),
                )
            });
            let origin_line = format!("data-plane expected origin (config mirror): {webview_origin}");
            session_log.append("info", &origin_line);
            eprintln!("[spatial-ide-shell] {origin_line}");

            // Blocking on the setup thread is the standard Tauri pattern for "this must exist
            // before the app finishes starting" async work — `setup` itself is synchronous, and no
            // command can run before it returns.
            let running = tauri::async_runtime::block_on(serve(DataPlaneConfig {
                factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets)),
                // No static assets: the shell's own webview loads the frontend directly, unlike
                // `slice-host`'s browser consumer. This endpoint serves the data plane only.
                static_dir: None,
                expected_origin: Some(webview_origin.clone()),
            }))
            .expect(
                "the data plane binds an OS-assigned loopback port and startup failure here is \
                 not a recoverable admission refusal — it means the shell itself cannot run",
            );
            let data_plane_handle = DataPlaneHandle {
                port: running.addr.port(),
                token: running.session.token_for_delivery().to_string(),
            };

            app.manage(host);
            app.manage(data_plane_handle);
            app.manage(session_log);
            // ADR-020 Amendment 1 (rewritten): managed so `on_page_load` above can assert the
            // webview's actual origin against exactly what was pinned into `DataPlaneConfig` a few
            // lines above -- never read back into anything that could change that pinned value.
            app.manage(PinnedOrigin { origin: webview_origin, window_label });
            // Entry-40 pass: one abort handle per currently-open dataset's pool-poll task
            // (`pool_poll.rs`'s own doc comment) -- managed here so `commands::open_dataset`/
            // `close_dataset` can start/stop it via `AppHandle::try_state`.
            #[cfg(any(debug_assertions, feature = "measure-build"))]
            app.manage(pool_poll::PoolPollTasks::new());
            // The publish seam's own state (NEXT-CUT.md P1): a shared, in-process grant set and a
            // single-use pending-attempt store. Both are `Arc`-wrapped so a `spawn_blocking` closure
            // in `commands.rs` can hold an owned clone across the `'static` boundary that requires;
            // both die with the process (`kernel/src/permission/grant.rs`'s own non-persistence
            // rule) -- nothing here is written to disk, and nothing is read back.
            app.manage(Arc::new(Mutex::new(GrantSet::new())));
            app.manage(Arc::new(publish::PendingAttempts::new()));
            // P2's Cancel-publish seam (`NEXT-CUT.md` item 3): a running publish's own `CancelToken`,
            // keyed by `attempt_id`, live only for the duration of one `binding_publish_execute`
            // call (`publish::RunningPublishes`'s own doc comment). Dies with the process, same as
            // every other publish-seam state above.
            app.manage(Arc::new(publish::RunningPublishes::new()));

            // Viewport-residency cut P3r (RESIDENCY-PREREGISTRATION.md §12 Amendment 16, the "measure
            // build") -- the debug-gated CDP port, compiled in via this NAMED cargo feature, never a
            // shipped default. There is no `#[cfg(debug_assertions)]`-gated Rust site that already
            // opens a CDP port to widen (verified while writing this: `additionalBrowserArgs` is set
            // ONLY by `e2e/lib.mjs`'s `writeConfigOverlay` for `tauri dev --config <path>`, a Node-side
            // JSON overlay with no Rust equivalent; `tauri.conf.json` itself carries no
            // `additionalBrowserArgs` key at all) -- this block is that site, built new, following the
            // same idiom (`e2e/lib.mjs`'s own `WRY_DEFAULT_BROWSER_ARGS` comment: `additionalBrowserArgs`
            // REPLACES wry's own defaults rather than appending to them, so they must be repeated here).
            //
            // **Restored to this position (ADR-020 Amendment 1's rewrite, 2026-09-08):** the
            // pre-rewrite pump design hoisted this whole block to the TOP of `setup()`, so a window
            // existed before that design's own runtime read of it. This rewrite reads no webview at
            // all, so nothing here still depends on this block running before anything else in this
            // closure -- restored to its pre-pump position (the end, immediately before
            // `Box::leak`), matching `main`'s own ordering for this block. Precisely: the block's
            // CODE is byte-identical to `main`'s and sits in `main`'s own position; THIS comment
            // paragraph is the one thing this branch adds to it.
            //
            // **Always paired, at build time, with a config overlay that sets this window's own
            // `create: false`** (`npm run build:measure`'s generated `e2e/out/tauri.measure.conf.json`,
            // `e2e/writeMeasureConfigOverlay.mjs`) -- Tauri's own internal `setup()` creates every
            // `app.config().app.windows` entry whose `create` is `true` BEFORE this closure ever runs
            // (verified against `tauri-2.11.5/src/app.rs`'s own `setup()` function, not assumed), so
            // without that overlay this block would race the declarative auto-created window for the
            // same `"main"` label and `.build()?` below would return `Err` -- a loud `setup` failure
            // (`.expect(...)` below), never a silent second window or a silently-missing CDP port.
            //
            // Reads the CDP port from `SPATIAL_E2E_CDP_PORT` (the SAME env var `e2e/lib.mjs`'s own
            // `CDP_PORT` reads, so one flag governs both the harness's own attach target and this
            // process's own open port), defaulting to `9223` -- `CDP_PORT`'s own default.
            #[cfg(feature = "measure-build")]
            {
                let window_config = app
                    .config()
                    .app
                    .windows
                    .first()
                    .cloned()
                    .expect(
                        "measure-build: tauri.conf.json (as merged with the measure build's own \
                         config overlay) has no app.windows[0] to build the measure window from",
                    );
                let cdp_port =
                    std::env::var("SPATIAL_E2E_CDP_PORT").unwrap_or_else(|_| "9223".to_string());
                let browser_args = format!(
                    "--disable-features=msWebOOUI,msPdfOOUI,msSmartScreenProtection \
                     --autoplay-policy=no-user-gesture-required --remote-debugging-port={cdp_port}"
                );
                tauri::WebviewWindowBuilder::from_config(app.handle(), &window_config)?
                    .additional_browser_args(&browser_args)
                    .build()?;
                eprintln!(
                    "[spatial-ide-shell] measure-build: CDP remote-debugging port {cdp_port} opened"
                );
            }

            // `running` is intentionally leaked into a `Box` rather than dropped: dropping it would
            // shut the data plane down while the app is still starting. It lives for the process's
            // whole lifetime, exactly as `slice-host`'s own `running` does until its Ctrl-C.
            Box::leak(Box::new(running));

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::open_dataset,
            commands::describe,
            commands::viewport_query,
            commands::cancel,
            commands::close_dataset,
            commands::binding_data_plane_attach,
            commands::binding_log_session_event,
            commands::binding_pick_file,
            commands::binding_crs_catalog,
            commands::binding_publish_prepare,
            commands::binding_publish_execute,
            commands::binding_publish_cancel,
            // E2E TEST SEAM (`NEXT-CUT.md` P4) — `#[cfg(debug_assertions)]` on both this entry and
            // the command's own definition (`commands.rs`) removes the match arm from a release
            // build entirely (`tauri-macros`' `Handler` codegen applies each item's attributes to
            // its generated arm), not merely a runtime-disabled command that still ships.
            #[cfg(debug_assertions)]
            commands::binding_publish_prepare_e2e_destination,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
