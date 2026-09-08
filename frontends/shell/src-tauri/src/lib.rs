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

/// ADR-020 Amendment 1 (rewritten 2026-09-08): the origin pinned by the config mirror
/// (`origin::expected_origin_from_config`) at `setup()` time, exactly as passed into
/// `DataPlaneConfig::expected_origin` — managed so the post-load self-check
/// (`on_page_load` below) can compare the webview's *actual* URL against it. Read-only after
/// `setup()` manages it: nothing here, and nothing in the self-check that reads it, ever writes a
/// new value back into it or into `DataPlaneConfig` — an ASSERTION, never a second selection (the
/// human's ruling on `DECISIONS-PENDING.md` entry 55; `AI_DEVELOPMENT.md`'s "never block or pump
/// inside `setup()`" mechanic).
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
/// `diagnostics/originSelfCheck.ts`'s `OriginMismatchPayload` field-for-field.
#[derive(serde::Serialize, Clone)]
struct OriginSelfCheckMismatch {
    pinned: String,
    actual: String,
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
                        OriginSelfCheckMismatch { pinned: pinned.origin.clone(), actual },
                    );
                }
                Err(e) => {
                    // Same fail-closed spirit as `refuse_to_start`, but the process is already
                    // running and the page has already loaded -- there is nothing left to refuse to
                    // START. Logged and treated as a mismatch (an unreadable/hostless actual origin
                    // can never equal the pinned one) so the frontend still gets the typed state
                    // rather than silence.
                    let actual = format!("<unreadable: {e}>");
                    let line =
                        format!("origin-self-check MISMATCH pinned={} actual={actual}", pinned.origin);
                    session_log.append("error", &line);
                    eprintln!("[spatial-ide-shell] {line}");
                    let _ = webview.app_handle().emit(
                        ORIGIN_SELF_CHECK_MISMATCH_EVENT,
                        OriginSelfCheckMismatch { pinned: pinned.origin.clone(), actual },
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
            // process exits -- `refuse_to_start` needs only `app.path()`, available this early. This
            // is itself a fatal-setup-failure panic (unchanged from before this rewrite -- if the
            // log cannot even be opened, there is nowhere to log that failure into either).
            let log_dir = app
                .path()
                .app_log_dir()
                .unwrap_or_else(|_| std::env::temp_dir().join("spatial-ide-shell-logs"));
            let session_log = SessionLog::open(&log_dir).unwrap_or_else(|e| {
                panic!("could not open a session log at {}: {e}", log_dir.display())
            });
            eprintln!("[spatial-ide-shell] session log: {}", session_log.path.display());

            // ADR-020 Amendment 1 (rewritten 2026-09-08, entry 55 = "(b)"): the config mirror.
            // `expected_origin` is no longer read off a live webview at all -- there is no `unsafe`,
            // no retry, no Win32 message pump, and nothing here can block `setup()` waiting for a
            // value that is not yet observable (`AI_DEVELOPMENT.md`'s "never block or pump inside
            // setup()" mechanic, named for exactly this history). `origin::expected_origin_from_config`
            // is a pure function over plain inputs gathered from `app.config()` below; see
            // `origin.rs`'s own module doc for the full API + version citation (condition 5) and why
            // this mirror cannot disagree with Tauri's own internal `WebviewUrl::App` resolution.
            let is_dev = tauri::is_dev();
            let dev_url = app.config().build.dev_url.clone();
            let frontend_dist = app.config().build.frontend_dist.clone();
            let use_https_scheme = app
                .config()
                .app
                .windows
                .first()
                .map(|w| w.use_https_scheme)
                .unwrap_or(false);
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
                         is no configured window for the origin mirror's useHttpsScheme/label, or \
                         for the post-load self-check to scope itself to",
                    )
                });

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
            // `Box::leak`), matching `main`'s own ordering byte-for-byte for this block.
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
            // build entirely (`tauri-macros`' own `Handler` codegen applies each item's attributes to
            // its generated arm), not merely a runtime-disabled command that still ships.
            #[cfg(debug_assertions)]
            commands::binding_publish_prepare_e2e_destination,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
