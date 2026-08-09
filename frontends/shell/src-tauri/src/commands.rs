// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

//! Every Tauri command in this crate. Two families, kept visually distinct so a reviewer can tell
//! them apart at a glance:
//!
//! - **SKP v0** (`open_dataset`, `describe`, `viewport_query`, `cancel`, `close_dataset`) — each
//!   takes the exact request struct `protocol/skp` defines and returns the exact response or
//!   `SkpError`. No renaming, no remapping: the same type is the fixture-verified wire shape and
//!   the Tauri command's own argument/return type, so there is nothing here to drift.
//! - **Binding-local** (`binding_*`) — named so they cannot be mistaken for SKP, excluded from the
//!   command catalog and from any future conformance suite (SKP-V0.md §4 item 1).
//!
//! **This file contains no logic** beyond decode → call one `SkpHost`/state method → serialize —
//! docs/02's "frontends: clients only, no logic" applied to the Rust half of a client. `lib.rs`
//! lists every command below in its `tauri::generate_handler!` call; adding one here without adding
//! it there is a command JS can never reach, which is the reason there is exactly one list.

use std::sync::Arc;

use spatial_kernel::skp::SkpHost;
use spatial_skp::v0::{
    CancelRequest, CancelResponse, CloseDatasetRequest, CloseDatasetResponse, DescribeRequest,
    DescribeResponse, OpenDatasetRequest, OpenDatasetResponse, SkpError, ViewportQueryRequest,
    ViewportQueryResponse,
};
use tauri::State;
use tauri_plugin_dialog::DialogExt;

use crate::state::{DataPlaneHandle, SessionLog};

/// **Runs on `spawn_blocking`.** Opens a DuckDB connection and runs ADR-016's whole-column
/// uniqueness scan — real IO, and exactly the work `docs/01` principle 7 requires stay
/// interruptible without stalling every other command on the same async runtime.
#[tauri::command]
pub async fn open_dataset(
    state: State<'_, Arc<SkpHost>>,
    request: OpenDatasetRequest,
) -> Result<OpenDatasetResponse, SkpError> {
    let host = state.inner().clone();
    tokio::task::spawn_blocking(move || host.open_dataset(request))
        .await
        .unwrap_or_else(|e| Err(SkpError::protocol("open_dataset_panicked", e.to_string())))
}

/// Pure, in-memory, no IO (SKP-V0.md §1) — runs directly on the calling task.
#[tauri::command]
pub fn describe(
    state: State<'_, Arc<SkpHost>>,
    request: DescribeRequest,
) -> Result<DescribeResponse, SkpError> {
    state.describe(request)
}

/// **Runs on `spawn_blocking`.** Builds and validates a real DuckDB statement synchronously before
/// minting a ticket (SKP-V0.md §1) — the same reasoning as `open_dataset`.
#[tauri::command]
pub async fn viewport_query(
    state: State<'_, Arc<SkpHost>>,
    request: ViewportQueryRequest,
) -> Result<ViewportQueryResponse, SkpError> {
    let host = state.inner().clone();
    tokio::task::spawn_blocking(move || host.viewport_query(request))
        .await
        .unwrap_or_else(|e| Err(SkpError::protocol("viewport_query_panicked", e.to_string())))
}

#[tauri::command]
pub fn cancel(
    state: State<'_, Arc<SkpHost>>,
    request: CancelRequest,
) -> Result<CancelResponse, SkpError> {
    state.cancel(request)
}

#[tauri::command]
pub fn close_dataset(
    state: State<'_, Arc<SkpHost>>,
    request: CloseDatasetRequest,
) -> Result<CloseDatasetResponse, SkpError> {
    state.close_dataset(request)
}

// -------------------------------------------------------------------------------------------
// Binding-local commands — not SKP (SKP-V0.md §4 item 1; ADR-012 H6; ADR-019)
// -------------------------------------------------------------------------------------------

#[derive(serde::Serialize)]
pub struct DataPlaneAttach {
    pub url: String,
    /// Offered in this order to `new WebSocket(url, subprotocols)`: the data-plane's fixed
    /// subprotocol name, then the session credential (`tok.<hex>`), exactly as
    /// `protocol/data-plane/src/session.rs` expects.
    pub subprotocols: [String; 2],
}

/// The one command that ever hands the shell's WebSocket client an endpoint and a credential.
/// **Not SKP** — ADR-012 H6 forbids a transport detail on the semantic API, so this is named,
/// documented and excluded from the command catalog rather than dressed up as a sixth command.
#[tauri::command]
pub fn binding_data_plane_attach(state: State<'_, DataPlaneHandle>) -> DataPlaneAttach {
    DataPlaneAttach {
        url: format!("ws://127.0.0.1:{}/stream", state.port),
        subprotocols: [
            spatial_data_plane::session::SUBPROTOCOL.to_string(),
            format!("tok.{}", state.token),
        ],
    }
}

/// ADR-010 rule 7: a global `error`/`unhandledrejection` handler's output is visible **and**
/// persisted to a log that outlives the session. This is the persistence half; the visible half is
/// a JS-side banner. `level` is free text (`"error"`, `"unhandledrejection"`, `"watchdog"`, …), not
/// a closed enum — instrument surface owes no protocol.
#[tauri::command]
pub fn binding_log_session_event(state: State<'_, SessionLog>, level: String, message: String) {
    state.append(&level, &message);
}

/// The OS file picker (docs/03; this cut's admission flow starts here). **Not SKP**: SKP's
/// `open_dataset` takes a path already chosen — it has no opinion about how the caller got one, and
/// a picker is squarely UI, which docs/02 keeps out of the protocol.
#[tauri::command]
pub async fn binding_pick_file(app: tauri::AppHandle) -> Result<Option<String>, String> {
    let (tx, rx) = tokio::sync::oneshot::channel();
    app.dialog()
        .file()
        .add_filter("GeoParquet", &["parquet"])
        .pick_file(move |picked| {
            let _ = tx.send(picked);
        });
    let picked = rx.await.map_err(|e| format!("file picker channel closed: {e}"))?;
    Ok(picked.map(|p| p.to_string()))
}
