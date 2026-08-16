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

use std::sync::{Arc, Mutex};

use spatial_engine::CancelToken;
use spatial_kernel::permission::GrantSet;
use spatial_kernel::skp::SkpHost;
use spatial_skp::v0::{
    CancelRequest, CancelResponse, CloseDatasetRequest, CloseDatasetResponse, DescribeRequest,
    DescribeResponse, OpenDatasetRequest, OpenDatasetResponse, SkpError, ViewportQueryRequest,
    ViewportQueryResponse,
};
use tauri::{Emitter, State};
use tauri_plugin_dialog::DialogExt;

use crate::publish::{
    self, EventProgress, ExecuteOutcome, PendingAttempts, PrepareOutcome, PublishScope,
    RunningPublishes,
};
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

// -------------------------------------------------------------------------------------------
// The publish seam (`NEXT-CUT.md` P1) — binding-local, never SKP; see `crate::publish`'s module
// docs for the design this pair implements.
// -------------------------------------------------------------------------------------------

/// Opens the **native** destination picker (the destination never crosses from JS), runs
/// `publish::preflight` (pure — P0's row-filter refusal fires here), mints a grant from host-held
/// facts, and stashes a single-use pending attempt. Returns plain prompt data plus its `attempt_id`.
///
/// `filter_active` is a **disclosed deviation** from `NEXT-CUT.md`'s three-parameter shorthand
/// (`dataset_handle, style_doc, scope`): composing the filter-scope sentence needs to know whether
/// the shell's *own* active SQL filter (tracked in JS, `App.tsx`'s `activeFilter` — a piece this
/// binding-local seam has no other way to see) would have applied, and that is not expressible
/// inside `scope`'s two ADR-017 §8 shapes without a third shape existing. P3 ("Publish affordance and
/// scope") is what actually threads the live UI state through this parameter; P1 wires the mechanism
/// and defaults nothing silently — a caller must pass the fact.
#[tauri::command]
pub async fn binding_publish_prepare(
    app: tauri::AppHandle,
    host: State<'_, Arc<SkpHost>>,
    grants: State<'_, Arc<Mutex<GrantSet>>>,
    attempts: State<'_, Arc<PendingAttempts>>,
    dataset_handle: String,
    style_doc: String,
    scope: PublishScope,
    filter_active: bool,
) -> Result<PrepareOutcome, String> {
    let dataset = host
        .catalog()
        .get(&dataset_handle)
        .ok_or_else(|| format!("unknown dataset `{dataset_handle}`"))?;
    let dataset_name = publish::dataset_name_for(&dataset);

    let default_name = dataset_name.clone();
    let (tx, rx) = tokio::sync::oneshot::channel();
    app.dialog().file().set_file_name(&default_name).save_file(move |picked| {
        let _ = tx.send(picked);
    });
    let picked = rx.await.map_err(|e| format!("destination picker channel closed: {e}"))?;
    let Some(destination) = picked.and_then(|p| p.into_path().ok()) else {
        return Ok(PrepareOutcome::PickerCancelled);
    };

    let (viewer, viewer_license) = match publish::bundled_viewer() {
        Ok(v) => v,
        Err(message) => return Ok(PrepareOutcome::Refused { message }),
    };

    let started_at = spatial_kernel::permission::audit::rfc3339_utc_now();
    Ok(publish::prepare(
        grants.inner(),
        attempts.inner(),
        dataset,
        dataset_name,
        style_doc,
        scope,
        filter_active,
        viewer,
        viewer_license,
        destination,
        started_at,
    ))
}

/// Takes the pending attempt (single-use), opens a fresh audit log for it alone (F-9), and runs it
/// through the permission boundary with a `ShellApproval` carrying `typed_phrase`. Runs on
/// `spawn_blocking`: real IO, exactly the class of work `docs/01` principle 7 requires stay off the
/// async runtime's own worker thread.
///
/// **P2's progress + cancel wiring** (`NEXT-CUT.md` item 3 — P1 left this at `None` progress on a
/// token nothing outside the call could reach, `publish.rs`'s own module docs). A fresh
/// [`CancelToken`] is minted here and registered in [`RunningPublishes`] BEFORE the blocking call
/// starts (so `binding_publish_cancel` can reach it for the whole run) and removed unconditionally
/// after, whatever the outcome — never leaked across attempts. Progress crosses as
/// [`publish::PUBLISH_PROGRESS_EVENT`] via [`EventProgress`], phases only (no percentage/ETA).
#[tauri::command]
pub async fn binding_publish_execute(
    app: tauri::AppHandle,
    grants: State<'_, Arc<Mutex<GrantSet>>>,
    attempts: State<'_, Arc<PendingAttempts>>,
    running: State<'_, Arc<RunningPublishes>>,
    attempt_id: String,
    typed_phrase: String,
) -> Result<ExecuteOutcome, String> {
    let grants = grants.inner().clone();
    let attempts = attempts.inner().clone();
    let running = running.inner().clone();

    let cancel = CancelToken::new();
    running.insert(attempt_id.clone(), cancel.clone());

    let progress_app = app.clone();
    let progress = EventProgress::new(attempt_id.clone(), move |event| {
        // Best-effort: this is an instrument stream (module docs, "phases only"), never a side
        // effect the publish's own success/refusal depends on — a webview with no listener attached
        // yet must not fail or stall the operation itself.
        let _ = progress_app.emit(publish::PUBLISH_PROGRESS_EVENT, event);
    });

    let exec_attempt_id = attempt_id.clone();
    let result = tokio::task::spawn_blocking(move || {
        publish::execute_with_progress(&grants, &attempts, &exec_attempt_id, &typed_phrase, &cancel, Some(&progress))
    })
    .await;

    // Unconditional: whether the call above succeeded, refused, or the blocking task itself
    // panicked, this attempt is no longer running and must not linger in the registry.
    running.remove(&attempt_id);

    result.map_err(|e| format!("binding_publish_execute panicked: {e}"))
}

/// The Cancel-publish control's own seam (`NEXT-CUT.md` P2 item 3: "wires to the CancelToken seam
/// if present; if absent host-side, add the minimal token" — P1 left none; this piece adds it,
/// [`RunningPublishes`]). `true` iff a running publish for this `attempt_id` was found and
/// cancelled; `false` is not an error (already finished, or an id this registry never held —
/// `RunningPublishes::cancel`'s own doc comment).
#[tauri::command]
pub fn binding_publish_cancel(running: State<'_, Arc<RunningPublishes>>, attempt_id: String) -> bool {
    running.cancel(&attempt_id)
}
