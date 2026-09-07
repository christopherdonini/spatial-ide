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

use state::{DataPlaneHandle, SessionLog};

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
            // URL.) This block used to run near the end of `setup()`, after the data plane was
            // already serving; it moved here for the origin-read ordering below. Nothing it does
            // depends on anything computed later in this closure (`catalog`/`tickets`/`host`/the
            // data plane), so relocating it changes no other behaviour.
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

            // ADR-020 Amendment 1: derive the data plane's `expected_origin` from the shell's own
            // webview window's *actual* URL, read once, right here -- before `serve()` below, and
            // therefore before the event loop resumes and any page script can execute (`setup()`
            // itself is synchronous and blocking; Tauri does not pump the event loop, and so cannot
            // run page script, until this closure returns -- the same property the pre-existing
            // comment on `block_on` below already relies on for "no command can run before setup
            // returns"). Replaces the retired `cfg!(debug_assertions)` compile-time selector, which
            // got `tauri build --debug` wrong (`debug_assertions == true` on that *packaged* build,
            // so it picked the dev-server origin while the webview actually loaded the packaged
            // custom-protocol origin -- every upgrade 403'd; ADR-020's Status paragraph, Decision).
            //
            // `origin::expected_origin_from_url`'s own module doc names the exact API + crate
            // version (condition 5). `Session::with_origin`/`DataPlaneConfig::expected_origin` (the
            // ADR-020-accepted mechanism: host-supplied, exact-match, never page script, never a
            // wildcard; `Origin: null` still rejected; the `sec-fetch-site: same-origin` fallback
            // unchanged) are untouched by this change -- only how `webview_origin` below is
            // computed changes.
            //
            // Fails closed (condition 4): if the configured window does not exist, if its URL
            // cannot be read, or if that URL has no host to pin an origin to, this panics with a
            // named message rather than falling back to any default -- the same "fatal setup
            // failure" idiom this closure already uses below for `serve()` and `SessionLog::open`.
            let window_label = app
                .config()
                .app
                .windows
                .first()
                .map(|w| w.label.clone())
                .unwrap_or_else(|| {
                    panic!(
                        "ADR-020 Amendment 1: tauri.conf.json declares no app.windows[0] -- there \
                         is no configured window to derive the data plane's expected origin from"
                    )
                });
            let webview_window = app.get_webview_window(&window_label).unwrap_or_else(|| {
                panic!(
                    "ADR-020 Amendment 1: no webview window labelled {window_label:?} exists at \
                     setup time -- refusing to start rather than guess the data plane's expected \
                     origin"
                )
            });
            let webview_url = webview_window.url().unwrap_or_else(|e| {
                panic!(
                    "ADR-020 Amendment 1: could not read the URL of the webview window labelled \
                     {window_label:?} ({e}) -- refusing to start rather than guess the data \
                     plane's expected origin"
                )
            });
            let webview_origin =
                origin::expected_origin_from_url(&webview_url).unwrap_or_else(|e| {
                    panic!(
                        "ADR-020 Amendment 1: the webview's URL ({webview_url}) cannot be turned \
                         into an expected origin ({e}) -- refusing to start rather than guess the \
                         data plane's expected origin"
                    )
                });
            eprintln!(
                "[spatial-ide-shell] data-plane expected origin (from webview URL {webview_url}): \
                 {webview_origin}"
            );

            // The composition SKP v0 needs (ADR-019): one catalog, one ticket registry, shared
            // between the command layer and the data-plane server below.
            let catalog = Arc::new(Catalog::new());
            let tickets = spatial_kernel::skp::StreamRegistry::new();
            let host = Arc::new(SkpHost::new(catalog.clone(), tickets.clone()));

            // Blocking on the setup thread is the standard Tauri pattern for "this must exist
            // before the app finishes starting" async work — `setup` itself is synchronous, and no
            // command can run before it returns.
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

            let log_dir = app
                .path()
                .app_log_dir()
                .unwrap_or_else(|_| std::env::temp_dir().join("spatial-ide-shell-logs"));
            let session_log = SessionLog::open(&log_dir).unwrap_or_else(|e| {
                panic!("could not open a session log at {}: {e}", log_dir.display())
            });
            eprintln!("[spatial-ide-shell] session log: {}", session_log.path.display());

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
