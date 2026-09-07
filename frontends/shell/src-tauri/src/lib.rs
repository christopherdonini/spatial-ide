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
use tauri::Manager;
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

/// ADR-020 Amendment 1's origin-read retry loop (`run()`'s `setup()` closure, the block documented
/// there): drains whatever Win32 messages are already queued on this (main, STA) thread, without
/// blocking if the queue is empty. Exists because WebView2's async work -- specifically, the
/// navigation-completion notification that updates what `Webview::url()`/`ICoreWebView2::Source()`
/// reports -- is delivered entirely via posted window messages
/// (`webview2-com` 0.38.2's own doc comment on `wait_with_pump`, quoted in `Cargo.toml`'s comment
/// next to the `windows` dependency this function uses), so a caller that only sleeps between
/// retries, never pumping, can observe `about:blank` indefinitely even though the navigation was
/// already issued -- proven empirically on a real `tauri dev` run, not assumed (ADR-020 Amendment 1
/// §(f)). `PeekMessageW` with `PM_REMOVE` (not `GetMessageW`, which blocks indefinitely if the
/// queue is empty -- unacceptable inside a bounded retry loop) so an idle queue returns immediately
/// rather than hanging this thread.
///
/// **Residual consideration, disclosed rather than silently assumed away:** this drains and
/// dispatches WHATEVER is queued, not narrowly the one navigation-completion message this loop is
/// waiting on -- if Tauri's own webview-to-host IPC delivery also depends on a message this pump
/// could drain, a command COULD in principle be dispatched before `app.manage(...)` has registered
/// the state it needs (this closure calls `pump_pending_windows_messages` only before that point).
/// Not observed: two independent end-to-end runs (ADR-020 Amendment 1 §(f)), one of which invokes a
/// real command (`open_dataset`, via the E2E hook) immediately once the page loads, both completed
/// with no such failure -- consistent with the retry loop resolving and moving on to
/// `app.manage(...)` well before the page has loaded enough JS to invoke anything, but not a proof
/// that no ordering could ever produce it. Narrowing this pump to filter for specific message types
/// would need WebView2/wry internals this piece did not verify; flagged here rather than closed.
#[cfg(windows)]
fn pump_pending_windows_messages() {
    use windows::Win32::UI::WindowsAndMessaging::{
        DispatchMessageW, PeekMessageW, TranslateMessage, MSG, PM_REMOVE,
    };
    let mut msg = MSG::default();
    // SAFETY: `PeekMessageW`/`TranslateMessage`/`DispatchMessageW` are the standard Win32
    // message-pump triad, called here exactly as `webview2-com`'s own `wait_with_pump` calls the
    // blocking-`GetMessageW` equivalent (this function's own doc comment cites it) -- `msg` is a
    // plain, fully-owned `MSG::default()` local the call fills in; `hwnd: None` means "any window
    // belonging to this thread", the same scope wry/WebView2's own internal message handling for
    // this window already assumes since it runs on this same (main, STA) thread.
    unsafe {
        while PeekMessageW(&mut msg, None, 0, 0, PM_REMOVE).as_bool() {
            let _ = TranslateMessage(&msg);
            DispatchMessageW(&msg);
        }
    }
}

/// Non-Windows fallback: a no-op. ADR-003's Resolution validates only Windows/WebView2 today
/// (docs/07's macOS/Linux hardware-validation follow-up is still open) -- the retry loop that calls
/// this still falls back to its own plain `std::thread::sleep` between attempts either way, which is
/// the best available without an equivalent platform-specific message pump.
#[cfg(not(windows))]
fn pump_pending_windows_messages() {}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            // ADR-020 Amendment 1: the measure-build's own main window is deliberately NOT
            // auto-created by Tauri's internal `setup()` (`create: false` in the measure build's
            // own generated config overlay, `writeMeasureConfigOverlay.mjs`) so the block further
            // below can build it itself with extra CDP browser args. It is built FIRST here, before
            // anything reads the webview's URL below, so that under every build mode -- ordinary
            // and measure-build alike -- the "main" window this process is about to pin an origin
            // to already exists at that point. (Every OTHER build mode's window is already built by
            // the time this closure starts: Tauri's own internal `setup()` builds every
            // `app.config().app.windows` entry whose `create` is `true` BEFORE calling this crate's
            // closure -- verified against `tauri-2.11.5/src/app.rs:2521-2526` -- so this block is
            // the only case where this closure itself must create the window before reading its
            // URL.) This block used to run near the end of `setup()`, AFTER every `app.manage(...)`
            // call below; it now runs BEFORE all of them. That ordering is load-bearing and safe for
            // the same reason `block_on(serve(...))` below was already safe running before those
            // same `app.manage(...)` calls in the pre-existing code: no Tauri command can be
            // dispatched to this window until `setup()` itself returns and the app's own event loop
            // begins actually pumping in its own right (`RuntimeRunEvent::Ready` calls this crate's
            // `setup()` closure synchronously, from inside `tauri::App::run_return`'s own callback --
            // verified against `tauri-2.11.5/src/app.rs:1422-1426`), so a window existing earlier
            // than the state it might eventually read is not itself a race on its own. **Caveat, not
            // absolute:** the origin-read block below DOES pump Win32 messages itself, deliberately,
            // between `app.manage(...)` calls' own position and this window's creation -- see
            // `pump_pending_windows_messages`'s own doc comment for the honestly-disclosed residual
            // risk that raises (a command dispatched via a pumped message before `app.manage(...)`
            // runs), and why two independent end-to-end runs argue against it happening in practice
            // without proving it cannot. See the origin-read block below for the narrower, verified
            // argument for why no PAGE SCRIPT reaches it early either.
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

            // Moved up from its old position (after `serve()`/`data_plane_handle` below) to before
            // the origin-read block that follows: `refuse_to_start` needs a working session log to
            // log a refusal into, and needs only `app.path()`, which is available this early. This
            // is itself a fatal-setup-failure panic, unchanged from before (not one of the three
            // MUST-FIX 2 converted below -- if the log cannot even be opened, there is nowhere to
            // log that failure into either).
            let log_dir = app
                .path()
                .app_log_dir()
                .unwrap_or_else(|_| std::env::temp_dir().join("spatial-ide-shell-logs"));
            let session_log = SessionLog::open(&log_dir).unwrap_or_else(|e| {
                panic!("could not open a session log at {}: {e}", log_dir.display())
            });
            eprintln!("[spatial-ide-shell] session log: {}", session_log.path.display());

            // ADR-020 Amendment 1: derive the data plane's `expected_origin` from the shell's own
            // webview window's *actual* URL, read once, right here -- before `serve()` below.
            // Replaces the retired `cfg!(debug_assertions)` compile-time selector, which got `tauri
            // build --debug` wrong (`debug_assertions == true` on that *packaged* build, so it
            // picked the dev-server origin while the webview actually loaded the packaged
            // custom-protocol origin -- every upgrade 403'd; ADR-020's Status paragraph, Decision).
            //
            // **Why this read happens before any PAGE SCRIPT can run (condition 1), precisely
            // stated rather than by "the event loop never pumps here"** (that broader claim is
            // false for WebView2: wry DOES pump the Win32 message loop internally during webview
            // creation -- `wry-0.55.1/src/webview2/mod.rs:414`'s `webview2_com::wait_with_pump(rx)?`
            // -- though the webview's own content still runs in a separate renderer process
            // regardless). The narrower, verified argument: the ONLY navigation ever issued to this
            // webview before this read runs is the single, host-configured one Tauri/wry issues at
            // webview-creation time, built from `tauri.conf.json`'s own `devUrl`/`frontendDist`
            // (`WebViewAttributes::url` → `webview.Navigate(&url)`,
            // `wry-0.55.1/src/webview2/mod.rs:518-531`) -- so the URL this code reads is exactly
            // that host-configured navigation's target, not a page-initiated one, regardless of
            // what the message loop pumps during webview construction; and the resulting value is
            // pinned into `DataPlaneConfig::expected_origin` before this closure returns, so no
            // LATER navigation -- page-initiated or not -- can ever change what gets pinned. The
            // read itself cannot deadlock even if the loop is active: `Webview::url()`'s dispatcher
            // call is serviced INLINE, synchronously, when invoked from the main thread (which
            // `setup()` runs on) rather than routed through the async event-loop proxy --
            // `tauri-runtime-wry-2.11.4/src/lib.rs:239-248`'s `send_user_message`.
            //
            // `origin::expected_origin_from_url`'s own module doc names the exact API + crate
            // version (condition 5). `Session::with_origin`/`DataPlaneConfig::expected_origin` (the
            // ADR-020-accepted mechanism: host-supplied, exact-match, never page script, never a
            // wildcard; `Origin: null` still rejected; the `sec-fetch-site: same-origin` fallback
            // unchanged) are untouched by this change -- only how `webview_origin` below is
            // computed changes.
            //
            // Fails closed (condition 4): if the configured window does not exist, if its URL
            // cannot be read, or if that URL has no host to pin an origin to, `refuse_to_start`
            // (this file's own top-level fn) logs, shows a blocking native error dialog, and exits
            // (1) -- never a default, and never silent (a plain release build has no console).
            let window_label = app
                .config()
                .app
                .windows
                .first()
                .map(|w| w.label.clone())
                .unwrap_or_else(|| {
                    refuse_to_start(
                        app,
                        &session_log,
                        "ADR-020 Amendment 1: tauri.conf.json declares no app.windows[0] -- there \
                         is no configured window to derive the data plane's expected origin from",
                    )
                });
            let webview_window = app.get_webview_window(&window_label).unwrap_or_else(|| {
                refuse_to_start(
                    app,
                    &session_log,
                    &format!(
                        "ADR-020 Amendment 1: no webview window labelled {window_label:?} exists \
                         at setup time -- refusing to start rather than guess the data plane's \
                         expected origin"
                    ),
                )
            });
            // **Empirical finding, MUST-FIX 4's runtime evidence pass (2026-09-07): a single read
            // is not enough, and neither is a plain retry-with-sleep.** `origin.rs`'s own doc
            // comment already named the hazard -- `Webview::url()` can report `about:blank` before
            // the first navigation lands -- but a real `tauri dev` run PROVED it, not just as a
            // theoretical risk: the very first attempt to gather this piece's runtime evidence
            // refused to start with exactly this message, on an ordinary launch, no special
            // conditions. A first fix attempt (retry with `std::thread::sleep` between attempts, no
            // pumping) was tried and DISPROVED the same way: it still failed, every one of 50
            // attempts over 5 seconds, because sleeping does not make WebView2's navigation-
            // completion notification arrive -- that notification is delivered entirely via posted
            // Win32 window messages (`webview2-com` 0.38.2's own `wait_with_pump` doc comment,
            // quoted in `Cargo.toml`), and nothing pumps this thread's message queue between
            // `webview.Navigate(&url)` returning (which only STARTS navigation) and this closure
            // returning (`setup()` is fully synchronous; the surrounding `RuntimeRunEvent::Ready`
            // dispatch that calls it, `tauri-2.11.5/src/app.rs:1422-1426`, does not advance to its
            // next event until this closure returns either) -- so a plain sleep genuinely cannot
            // observe navigation land, proven, not assumed. `pump_pending_windows_messages` (this
            // file's own top-level fn, `#[cfg(windows)]`) is what actually closes the gap: it drains
            // whatever Win32 messages are already queued, non-blockingly, between retry attempts.
            //
            // This still satisfies condition 1 ("before any page script can run"): every retried
            // read, and every pumped message, happens inside this same synchronous `setup()` call,
            // before it returns -- nothing here waits past the point where page script could start
            // running anyway, since that point is `setup()` returning, which this loop is still
            // inside. Only a URL that is STILL hostless after every attempt is treated as a genuine
            // fail-closed refusal, not a startup race.
            const ORIGIN_READ_RETRY_BUDGET: u32 = 250;
            const ORIGIN_READ_RETRY_INTERVAL: std::time::Duration =
                std::time::Duration::from_millis(20);
            let (webview_url, webview_origin) = {
                let mut last_attempt: Option<(tauri::Url, origin::OriginError)> = None;
                let mut resolved = None;
                for attempt in 0..ORIGIN_READ_RETRY_BUDGET {
                    pump_pending_windows_messages();
                    let url = webview_window.url().unwrap_or_else(|e| {
                        refuse_to_start(
                            app,
                            &session_log,
                            &format!(
                                "ADR-020 Amendment 1: could not read the URL of the webview \
                                 window labelled {window_label:?} ({e}) -- refusing to start \
                                 rather than guess the data plane's expected origin"
                            ),
                        )
                    });
                    match origin::expected_origin_from_url(&url) {
                        Ok(computed_origin) => {
                            resolved = Some((url, computed_origin));
                            break;
                        }
                        Err(e) => {
                            last_attempt = Some((url, e));
                            if attempt + 1 < ORIGIN_READ_RETRY_BUDGET {
                                std::thread::sleep(ORIGIN_READ_RETRY_INTERVAL);
                            }
                        }
                    }
                }
                resolved.unwrap_or_else(|| {
                    let (url, e) = last_attempt
                        .expect("ORIGIN_READ_RETRY_BUDGET > 0, so at least one attempt ran");
                    let budget_ms =
                        u128::from(ORIGIN_READ_RETRY_BUDGET) * ORIGIN_READ_RETRY_INTERVAL.as_millis();
                    refuse_to_start(
                        app,
                        &session_log,
                        &format!(
                            "ADR-020 Amendment 1: the webview's URL never resolved to a usable \
                             origin after {ORIGIN_READ_RETRY_BUDGET} attempts over ~{budget_ms}ms \
                             of pumped retry (last seen: {url}, {e}) -- refusing to start rather \
                             than guess the data plane's expected origin"
                        ),
                    )
                })
            };
            let origin_line = format!(
                "data-plane expected origin (from webview URL {webview_url}): {webview_origin}"
            );
            session_log.append("info", &origin_line);
            eprintln!("[spatial-ide-shell] {origin_line}");

            // The composition SKP v0 needs (ADR-019): one catalog, one ticket registry, shared
            // between the command layer and the data-plane server below.
            let catalog = Arc::new(Catalog::new());
            let tickets = spatial_kernel::skp::StreamRegistry::new();
            let host = Arc::new(SkpHost::new(catalog.clone(), tickets.clone()));

            // Blocking on the setup thread is the standard Tauri pattern for "this must exist
            // before the app finishes starting" async work — `setup` itself is synchronous, and
            // `block_on` itself pumps no Win32 messages (unlike the origin-read retry loop above,
            // already returned from by this point) — this pre-existing property is what the
            // origin-read block's own caveat (`pump_pending_windows_messages`'s doc comment) is
            // scoped against, not a claim this line alone reintroduces.
            let running = tauri::async_runtime::block_on(serve(DataPlaneConfig {
                factory: Arc::new(EngineSourceFactory::ticket_only(catalog, tickets)),
                // No static assets: the shell's own webview loads the frontend directly, unlike
                // `slice-host`'s browser consumer. This endpoint serves the data plane only.
                static_dir: None,
                expected_origin: Some(webview_origin),
            }))
            .expect(
                "the data plane binds an OS-assigned loopback port and startup failure here is \
                 not a recoverable admission refusal — it means the shell itself cannot run",
            );
            let data_plane_handle = DataPlaneHandle {
                port: running.addr.port(),
                token: running.session.token_for_delivery().to_string(),
            };

            // `session_log` itself was opened earlier (before the origin-read block above, MUST-FIX
            // 2's ordering) -- managed here, at its original position relative to the rest of this
            // closure's `app.manage(...)` calls.
            app.manage(host);
            app.manage(data_plane_handle);
            app.manage(session_log);
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

            // Viewport-residency cut P3r (RESIDENCY-PREREGISTRATION.md §12 Amendment 16, the
            // "measure build") -- the debug-gated CDP port, compiled in via the `measure-build`
            // cargo feature, never a shipped default. The block that actually opens it now runs at
            // the TOP of this closure (ADR-020 Amendment 1's origin-read ordering requires the
            // window to exist before the origin is read) -- see that block's own doc comment for
            // the full account, including why it is always paired at build time with a config
            // overlay that sets this window's own `create: false`.
            //
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
