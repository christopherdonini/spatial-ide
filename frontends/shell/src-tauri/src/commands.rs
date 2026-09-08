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
use tauri::{Emitter, Manager, State};
// Entry-40 pass: `AppHandle::try_state` (used by `open_dataset`/`close_dataset` below) is a
// `Manager` trait method, and used to be reached only under `#[cfg(any(debug_assertions, feature
// = "measure-build"))]` (this import was gated the same way, so a plain release build — which
// never called it — did not warn on an unused import). RELEASE-0.1 item 3: `Manager::path()` (used
// by `binding_publish_prepare`'s own resource-directory resolution, below) is now called
// UNCONDITIONALLY, in every profile, so the import is unconditional too — removing the gate does
// not reintroduce an unused-import warning anywhere, because `Manager` is always used now.
use tauri_plugin_dialog::DialogExt;

use crate::publish::{
    self, EventProgress, ExecuteOutcome, PendingAttempts, PrepareOutcome, PublishScope,
    RunningPublishes,
};
use crate::state::{DataPlaneHandle, SessionLog};

/// **Runs on `spawn_blocking`.** Opens a DuckDB connection and runs ADR-016's whole-column
/// uniqueness scan — real IO, and exactly the work `docs/01` principle 7 requires stay
/// interruptible without stalling every other command on the same async runtime.
///
/// **Entry-40 pass:** on success, starts the dev/measure-build-gated pool-lease poll
/// (`pool_poll.rs`) for the newly-opened dataset. `app` is unused (and would warn as such) in a
/// plain release build, where `pool_poll` is not compiled in at all — see the `cfg_attr` below.
#[cfg_attr(not(any(debug_assertions, feature = "measure-build")), allow(unused_variables))]
#[tauri::command]
pub async fn open_dataset(
    app: tauri::AppHandle,
    state: State<'_, Arc<SkpHost>>,
    request: OpenDatasetRequest,
) -> Result<OpenDatasetResponse, SkpError> {
    let host = state.inner().clone();
    let result = tokio::task::spawn_blocking(move || host.open_dataset(request))
        .await
        .unwrap_or_else(|e| Err(SkpError::protocol("open_dataset_panicked", e.to_string())));
    #[cfg(any(debug_assertions, feature = "measure-build"))]
    if let Ok(response) = &result {
        if let Some(tasks) = app.try_state::<crate::pool_poll::PoolPollTasks>() {
            tasks.start(app.clone(), response.dataset.as_str().to_string());
        }
    }
    result
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

/// **Entry-40 pass:** stops the dataset's pool-lease poll (if one is running) — `app` is unused
/// (and would warn as such) in a plain release build; see `open_dataset`'s own `cfg_attr`.
///
/// **Reviewer nit (vi):** `stop()` runs AFTER `state.close_dataset(request)`, not before, and
/// unconditionally (regardless of whether the close itself succeeded), so the poll's last tick(s)
/// can still observe the dataset's own teardown (e.g. leases dropping as its tickets are cancelled)
/// rather than being cut off the moment `close_dataset` is called.
#[cfg_attr(not(any(debug_assertions, feature = "measure-build")), allow(unused_variables))]
#[tauri::command]
pub fn close_dataset(
    app: tauri::AppHandle,
    state: State<'_, Arc<SkpHost>>,
    request: CloseDatasetRequest,
) -> Result<CloseDatasetResponse, SkpError> {
    #[cfg(any(debug_assertions, feature = "measure-build"))]
    let dataset_for_stop = request.dataset.as_str().to_string();
    let result = state.close_dataset(request);
    #[cfg(any(debug_assertions, feature = "measure-build"))]
    if let Some(tasks) = app.try_state::<crate::pool_poll::PoolPollTasks>() {
        tasks.stop(&dataset_for_stop);
    }
    result
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

/// One entry of the pinned, in-tree CRS definition catalog (ADR-026 decision 1(a)), as handed to
/// the shell for display. Mirrors the operator-facing fields of
/// `spatial_engine::crs_catalog::CatalogEntry`; `attribution` (entry 51) is deliberately not
/// surfaced here yet — a follow-up piece, not this one.
#[derive(serde::Serialize)]
pub struct CrsCatalogEntry {
    pub id: String,
    pub authority: String,
    pub code: u32,
    pub name: String,
    /// The full PROJJSON definition text, exactly as stored — displayed in full, never
    /// summarized, before an operator may choose it (ADR-026 decision 1(a): "displayed in full
    /// before assertion, never selected silently").
    pub definition: String,
    /// The definition's own sha256, lowercase hex — what a returned `catalog:<id>@sha256:…`
    /// provenance string's suffix is drawn from (`spatial_engine::crs_catalog`).
    pub hash: String,
}

/// The pinned CRS definition catalog, read-only, for the shell's remediation UI (`NEXT-CUT.md` P3)
/// to display in full before an operator asserts a CRS. **Not SKP** — ADR-026's catalog is host UI
/// furniture (a fixed, compiled-in list an operator picks from), not semantic API surface; giving
/// it its own SKP command would need its own version discussion the same way any other
/// request/response shape change on that protocol would (SKP-V0.md §4 item 1). No caching here:
/// the catalog is static, compiled-in data (`spatial_engine::crs_catalog`'s own `OnceLock`, parsed
/// once per process already) — a second cache on top of that would be cleverness this data does
/// not need.
#[tauri::command]
pub fn binding_crs_catalog() -> Vec<CrsCatalogEntry> {
    spatial_engine::crs_catalog::entries()
        .iter()
        .map(|e| CrsCatalogEntry {
            id: e.id.clone(),
            authority: e.authority.clone(),
            code: e.code,
            name: e.name.clone(),
            definition: e.definition.clone(),
            hash: e.hash.clone(),
        })
        .collect()
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

/// Opens the **native** destination picker (the destination never crosses from JS), runs the
/// predictable ADR-025 checks before any byte is hashed, pins the dataset's content if it is not
/// already pinned (cancellable and progress-reporting — RELEASE-0.1 item 10, DECISIONS-PENDING
/// entry 7's ruled pre-fix), mints a grant from host-held facts, and stashes a single-use pending
/// attempt. Returns plain prompt data plus its `attempt_id`.
///
/// `filter_active` is a **disclosed deviation** from `NEXT-CUT.md`'s three-parameter shorthand
/// (`dataset_handle, style_doc, scope`): composing the filter-scope sentence needs to know whether
/// the shell's *own* active SQL filter (tracked in JS, `App.tsx`'s `activeFilter` — a piece this
/// binding-local seam has no other way to see) would have applied, and that is not expressible
/// inside `scope`'s two ADR-017 §8 shapes without a third shape existing. P3 ("Publish affordance and
/// scope") is what actually threads the live UI state through this parameter; P1 wires the mechanism
/// and defaults nothing silently — a caller must pass the fact.
///
/// **RELEASE-0.1 item 10's own wiring.** A fresh [`CancelToken`] is minted and registered in
/// [`RunningPublishes`] under [`publish::prepare_cancel_key`] BEFORE the blocking call starts and
/// removed unconditionally after, whatever the outcome — the SAME `RunningPublishes` precedent
/// `binding_publish_execute` below established for the execute phase, written once as
/// [`publish::with_registered_cancel`]. Pin progress crosses as the SAME
/// [`publish::PUBLISH_PROGRESS_EVENT`] via a [`publish::PublishProgressEvent`] carrying
/// [`publish::PIN_PHASE_LABEL`] and the bytes-hashed fraction, `attempt_id` set to the prepare key
/// (no real `attempt_id` exists yet at this point — `publish::prepare_cancel_key`'s own doc
/// comment), bounded by [`publish::pin_progress_should_emit`] (MF2).
///
/// **What "cancellable" does and does not cover here (MF1).** The token's life starts after the
/// native picker below has settled, because nothing this command can do would close an open OS save
/// dialog — during that window the picker's own Cancel is the operator's cancel, and it arrives as
/// [`PrepareOutcome::PickerCancelled`]. The pin phase that follows is the cancellable part, and the
/// frontend now offers a Cancel button only once its first progress event has proven the token is
/// registered (`PublishPanel.tsx::cancelControlVisible`).
#[tauri::command]
pub async fn binding_publish_prepare(
    app: tauri::AppHandle,
    host: State<'_, Arc<SkpHost>>,
    grants: State<'_, Arc<Mutex<GrantSet>>>,
    attempts: State<'_, Arc<PendingAttempts>>,
    running: State<'_, Arc<RunningPublishes>>,
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

    // RELEASE-0.1 item 3: the packaged resource directory first, the dev-tree checkout path as a
    // fallback — `resolve_viewer_dir`'s own doc comment has the order and why an `AppHandle`
    // itself never crosses into `publish.rs`. `.ok()` rather than `?`: a `resource_dir()` failure
    // (e.g. under `tauri dev`, where nothing is packaged) is not this command's own error — it
    // just means `bundled_viewer` falls through to the dev-tree path, same as `None` would.
    let (viewer, viewer_license) = match publish::bundled_viewer(app.path().resource_dir().ok().as_deref()) {
        Ok(v) => v,
        Err(message) => return Ok(PrepareOutcome::Refused { message }),
    };

    let started_at = spatial_kernel::permission::audit::rfc3339_utc_now();
    let grants = grants.inner().clone();
    let attempts = attempts.inner().clone();
    let running = running.inner().clone();

    let prepare_key = publish::prepare_cancel_key(&dataset_handle);
    let progress_app = app.clone();
    let progress_key = prepare_key.clone();
    // MF2 (this batch's reviewer gate): `content_hash_observed` calls its sink once per 1 MiB read,
    // so an ungated emitter put one Tauri event on the webview per MiB — thousands of them, each a
    // `setState` and a render, at `docs/07`'s own 5 GB scale. `pin_progress_should_emit` bounds
    // that to one event per 64 MiB read plus two that always cross: the FIRST observation (so the
    // panel's Cancel control — gated on a pin-phase event having arrived, `cancelControlVisible` —
    // is up after the first chunk rather than after 64 MiB) and the final one (so the readout ends
    // at `total / total`, and exactly once even if the source grew past the total read at open
    // time). `last_emitted` is this closure's own state, `0` until something has crossed, which is
    // why it is `FnMut` and why the first-observation rule can read it (see that function's own doc
    // comment — a bound, not a claim about what the events cost).
    let mut last_emitted = 0u64;
    let mut on_pin_progress = move |bytes_done: u64, bytes_total: u64| {
        if !publish::pin_progress_should_emit(bytes_done, bytes_total, last_emitted) {
            return;
        }
        last_emitted = bytes_done;
        // Best-effort, same posture `binding_publish_execute`'s own progress sink takes: an
        // instrument stream, never a side effect the pin's own success/cancellation depends on.
        let _ = progress_app.emit(
            publish::PUBLISH_PROGRESS_EVENT,
            publish::PublishProgressEvent {
                attempt_id: progress_key.clone(),
                phase: publish::PIN_PHASE_LABEL,
                bytes_done: Some(bytes_done),
                bytes_total: Some(bytes_total),
            },
        );
    };

    // RELEASE-0.1 item 10: the token is registered BEFORE the blocking call and removed
    // unconditionally after — whether prepare refused, cancelled, produced a prompt, or the blocking
    // task itself panicked. `publish::with_registered_cancel` is that sequence, written once and
    // unit-tested (M4, this batch's reviewer gate: the removal had no test, since this command needs
    // a live Tauri app to reach).
    //
    // **The registration happens AFTER the native picker above, deliberately** (MF1): a
    // `#[tauri::command]` cannot dismiss an open OS save dialog, so registering a token earlier would
    // buy nothing an operator could use — the picker's own Cancel button is the affordance during
    // that window (`PrepareOutcome::PickerCancelled`). What was wrong before this batch was the
    // FRONTEND offering a Cancel across the picker window regardless; it now renders one only once
    // the first pin-phase progress event proves this token is registered
    // (`PublishPanel.tsx::cancelControlVisible`).
    //
    // Real IO/CPU (a whole-file hash, when the pin is not already taken) — `spawn_blocking`, never
    // the async runtime's own worker thread, the same discipline `open_dataset`/`viewport_query`
    // already apply above.
    let result = publish::with_registered_cancel(&running, &prepare_key, |cancel| async move {
        tokio::task::spawn_blocking(move || {
            publish::prepare_with_progress(
                &grants,
                &attempts,
                dataset,
                dataset_name,
                style_doc,
                scope,
                filter_active,
                viewer,
                viewer_license,
                destination,
                started_at,
                &cancel,
                Some(&mut on_pin_progress),
            )
        })
        .await
    })
    .await;

    result.map_err(|e| format!("binding_publish_prepare panicked: {e}"))
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

// -------------------------------------------------------------------------------------------
// E2E TEST SEAM (`NEXT-CUT.md` P4, `frontends/shell/e2e/publish.mjs`) — dev builds only,
// compiled out of a release build entirely, not merely runtime-gated.
// -------------------------------------------------------------------------------------------

/// **Bypasses EXACTLY the native destination picker [`binding_publish_prepare`] opens above,
/// nothing else** — the same "bypass exactly the native dialog" discipline `openPath`
/// (`e2e-test-surface.ts`) already establishes for `binding_pick_file`/`admitPath`. WebView2's own
/// save-dialog chrome has no CDP-reachable automation path at all (`e2e/README.md`'s "Evidence
/// class" paragraph), so unlike admission — where the picker and the downstream call were already
/// two separate commands an E2E hook could split apart in JS alone — publish's picker is fused
/// inside [`binding_publish_prepare`] itself, and there is no way to reach
/// [`publish::prepare_with_progress`] from JS without a new host-side seam.
///
/// This command supplies `destination` directly and otherwise calls the **identical**
/// [`publish::prepare_with_progress`] the real command calls (SF1, this batch's reviewer gate: this
/// sentence used to name `publish::prepare`, which neither command has called since RELEASE-0.1
/// item 10 — a stale link, and a false claim about which code the E2E seam shares) — same
/// `preflight`, same ADR-025 ordering, same grant minted **host-side**
/// from this supplied path (never from a JS-asserted grant; F-5's "the requester never mints the
/// grant" holds exactly as it does for the real command — see `docs/adr/ADR-024-…md`'s own
/// Decision section for why the test seam does not weaken that property, only which *fact source*
/// supplied the destination), same single-use pending-attempt stash. **An E2E run through this
/// seam therefore does not exercise the native picker itself — only the operator's manual
/// walkthrough does** (`frontends/shell/e2e/publish.mjs`'s own top comment says so again, for a
/// reader who only ever sees the test file).
///
/// **Compiled out of a release build, not merely runtime-gated**: `#[cfg(debug_assertions)]` here
/// AND on this command's own entry in `lib.rs`'s `generate_handler!` list means `tauri build`'s
/// default (release) profile never emits this match arm at all — `tauri-macros`' own `Handler`
/// codegen applies each list item's attributes to its generated match arm
/// (`#(#attrs)* #command_name_macros => …wrapper!(…)`), so a `cfg` attribute here genuinely removes
/// the arm rather than merely disabling it at runtime — the same guarantee `npm run build` gives
/// the JS-side `openPath` hook (verified against `tauri-macros-2.6.3/src/command/handler.rs`
/// directly while writing this, not assumed).
///
/// **Known limitation, the same one ADR-020 already named for this exact idiom in this crate**
/// (`lib.rs`'s `webview_origin` selector): `cfg!(debug_assertions)`/`#[cfg(debug_assertions)]` is
/// true for `tauri build --debug` as well as `cargo tauri dev` — a *packaged* debug build would
/// still carry this seam, letting any page script on that build supply an arbitrary destination
/// with no native picker in the way. Not exercised or closed by this piece; named so it cannot be
/// missed.
#[cfg(debug_assertions)]
#[tauri::command]
pub async fn binding_publish_prepare_e2e_destination(
    app: tauri::AppHandle,
    host: State<'_, Arc<SkpHost>>,
    grants: State<'_, Arc<Mutex<GrantSet>>>,
    attempts: State<'_, Arc<PendingAttempts>>,
    dataset_handle: String,
    style_doc: String,
    scope: PublishScope,
    filter_active: bool,
    destination: String,
) -> Result<PrepareOutcome, String> {
    let dataset = host
        .catalog()
        .get(&dataset_handle)
        .ok_or_else(|| format!("unknown dataset `{dataset_handle}`"))?;
    let dataset_name = publish::dataset_name_for(&dataset);

    // Same resolution order as the real `binding_publish_prepare`, above.
    let (viewer, viewer_license) = match publish::bundled_viewer(app.path().resource_dir().ok().as_deref()) {
        Ok(v) => v,
        Err(message) => return Ok(PrepareOutcome::Refused { message }),
    };

    let started_at = spatial_kernel::permission::audit::rfc3339_utc_now();
    let grants = grants.inner().clone();
    let attempts = attempts.inner().clone();
    // Same ordering, same `spawn_blocking` discipline as the real `binding_publish_prepare` above
    // — this seam calls `prepare_with_progress` (the identical function that command now calls),
    // so it must not diverge on the one precondition that command satisfies: the ADR-025 checks
    // run before the pin. The cancel token here is a throwaway nothing outside this call can reach
    // (RELEASE-0.1 item 10 wires a real, `RunningPublishes`-registered one only for the real
    // command above — this dev-only seam has no manual-walkthrough row that exercises a
    // prepare-phase cancel, so a second registration is not added here). Since it also passes `None`
    // for the pin-progress sink, no phase event ever reaches the panel through this path, so the
    // panel renders no Cancel button on it at all (MF1) — before that fix it rendered one that could
    // not cancel anything, since nothing is registered under this call's key.
    tokio::task::spawn_blocking(move || {
        publish::prepare_with_progress(
            &grants,
            &attempts,
            dataset,
            dataset_name,
            style_doc,
            scope,
            filter_active,
            viewer,
            viewer_license,
            std::path::PathBuf::from(destination),
            started_at,
            &CancelToken::new(),
            None,
        )
    })
    .await
    .map_err(|e| format!("binding_publish_prepare_e2e_destination panicked: {e}"))
}
