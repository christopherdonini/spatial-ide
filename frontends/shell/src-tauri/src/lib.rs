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
mod publish;
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
            // The composition SKP v0 needs (ADR-019): one catalog, one ticket registry, shared
            // between the command layer and the data-plane server below.
            let catalog = Arc::new(Catalog::new());
            let tickets = spatial_kernel::skp::StreamRegistry::new();
            let host = Arc::new(SkpHost::new(catalog.clone(), tickets.clone()));

            // The shell's webview is never the same-origin page `static_dir` would serve (there is
            // none here) -- its actual origin is `http://localhost:5180` under `tauri dev`
            // (vite.config.ts's fixed dev port, mirrored in tauri.conf.json's devUrl) or
            // `http://tauri.localhost` in a packaged build (Tauri's default custom-protocol origin
            // on Windows/WebView2, the only validated platform per ADR-003's Resolution).
            // `Session`'s default (deriving its expected origin from the data plane's own bound
            // port) assumed a same-origin browser consumer and silently 403'd every WebSocket
            // upgrade from this webview -- ADR-020.
            let webview_origin = if cfg!(debug_assertions) {
                "http://localhost:5180".to_string()
            } else {
                "http://tauri.localhost".to_string()
            };

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
