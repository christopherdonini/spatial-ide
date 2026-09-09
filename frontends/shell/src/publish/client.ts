// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import { recordNamed } from "../console/recorder";
import type { ExecuteOutcome, PrepareOutcome, PublishProgressEvent, PublishScopeInput } from "./types";

/**
 * NEXT-CUT.md P3 item B: recorded name-only, pre-invoke; resolved post-invoke, rethrown unchanged
 * -- inlined at each call site below rather than behind a shared helper that takes `command` as a
 * variable, deliberately: `console/surfaceCompleteness.test.ts`'s completeness scan classifies
 * every `invoke(`/`invoke<` call site by requiring a STRING LITERAL command name (its own file
 * header: "the ONE place invoke is ever called with a non-literal command name" is
 * `skp/client.ts::call()`); a shared `invokeRecorded(command, ...)` helper here would make
 * `command` a variable at its own `invoke(command, ...)` call site, which that scan would then
 * (rightly) flag as a second, unaccounted-for non-literal choke point outside `skp/client.ts`.
 */


/** `binding_publish_prepare`'s own JS-visible key spelling: Tauri's `#[tauri::command]` macro
 * converts snake_case Rust parameter names to camelCase by default (`ArgumentCase::Camel`, the
 * macro's own default, unmodified anywhere in this crate) -- this is NOT the same discipline
 * `skp/client.ts` uses (whose commands take one already-snake_case request struct, unaffected by
 * this conversion since it is a single argument, not per-field). Opens the **native** OS
 * destination picker host-side (`publish.rs`'s own module docs: "the destination never crosses
 * from JS") -- `filter_active` is a disclosed P1 deviation (`CUT-STATE.md`), not this shell's own
 * choice to omit or default.
 */
export async function publishPrepare(
  datasetHandle: string,
  styleDoc: string,
  scope: PublishScopeInput,
  filterActive: boolean
): Promise<PrepareOutcome> {
  const entry = recordNamed("binding-command", "binding_publish_prepare");
  try {
    const result = await invoke<PrepareOutcome>("binding_publish_prepare", {
      datasetHandle,
      styleDoc,
      scope,
      filterActive,
    });
    entry.resolveOk();
    return result;
  } catch (e) {
    // S4 (reviewer gate, action-console P7 fixes): resolveThrew takes no message -- `e` is still
    // rethrown below unchanged, so the real text is not lost, only kept out of the console
    // (BindingCommandHandle's own doc comment has where it still goes).
    entry.resolveThrew();
    throw e;
  }
}

/** `binding_publish_execute` -- carries the operator's ALREADY-TYPED phrase. **No comparison
 * happens in this function or anywhere else in this file**: the phrase crosses verbatim, whatever
 * it is; the one comparison lives in Rust (`permission::approval::check`, `NEXT-CUT.md`'s binding
 * "Approval: DOM, one comparison, in Rust" rule) and a mismatch comes back as `{status:"refused"}`,
 * never a JS-side short-circuit. */
export async function publishExecute(attemptId: string, typedPhrase: string): Promise<ExecuteOutcome> {
  const entry = recordNamed("binding-command", "binding_publish_execute");
  try {
    const result = await invoke<ExecuteOutcome>("binding_publish_execute", { attemptId, typedPhrase });
    entry.resolveOk();
    return result;
  } catch (e) {
    // S4 (reviewer gate, action-console P7 fixes): resolveThrew takes no message -- `e` is still
    // rethrown below unchanged, so the real text is not lost, only kept out of the console
    // (BindingCommandHandle's own doc comment has where it still goes).
    entry.resolveThrew();
    throw e;
  }
}

/** The `RunningPublishes` lookup key for the "Preparing…" pin phase's own `CancelToken`
 * (RELEASE-0.1 item 10) -- mirrors `frontends/shell/src-tauri/src/publish.rs::prepare_cancel_key`
 * EXACTLY (the two copies are pinned equal by `PublishPanel.test.ts` reading that file's own
 * source text, the same discipline `FILTER_SCOPE_SENTENCE` already established, above this file).
 * Computed client-side from `datasetHandle` alone -- a fact this shell already holds before it ever
 * calls `binding_publish_prepare` -- so the panel can register a `subscribePublishProgress`
 * listener AND a `publishCancel` call for the pin phase before the round trip even starts, with
 * **no new Tauri command**: `binding_publish_cancel` already takes an arbitrary lookup string
 * (`publish.rs::prepare_cancel_key`'s own doc comment has the full reasoning for why this needs no
 * host-minted id and no new command). */
export const PREPARE_CANCEL_KEY_PREFIX = "prepare:";

export function prepareCancelKey(datasetHandle: string): string {
  return `${PREPARE_CANCEL_KEY_PREFIX}${datasetHandle}`;
}

/** `binding_publish_cancel` (P2's own addition -- `commands.rs`'s doc comment). `true` iff a
 * running publish for this attempt was found and cancelled; `false` is not an error. Since
 * RELEASE-0.1 item 10, `attemptId` may also be a [`prepareCancelKey`] -- the same command reaches
 * the "Preparing…" pin phase's own token, registered under that key instead of a real attempt id. */
export async function publishCancel(attemptId: string): Promise<boolean> {
  const entry = recordNamed("binding-command", "binding_publish_cancel");
  try {
    const result = await invoke<boolean>("binding_publish_cancel", { attemptId });
    entry.resolveOk();
    return result;
  } catch (e) {
    // S4 (reviewer gate, action-console P7 fixes): resolveThrew takes no message -- `e` is still
    // rethrown below unchanged, so the real text is not lost, only kept out of the console
    // (BindingCommandHandle's own doc comment has where it still goes).
    entry.resolveThrew();
    throw e;
  }
}

/**
 * **DEV-ONLY E2E TEST SEAM.** `binding_publish_prepare_e2e_destination` (`commands.rs`,
 * `#[cfg(debug_assertions)]` -- compiled out of a release build entirely, not merely
 * runtime-gated; see that command's own doc comment for the full design note). Mirrors
 * `publishPrepare` exactly except it supplies `destination` directly instead of opening the
 * native OS save dialog, which no CDP-driven E2E suite can reach (`e2e/README.md`'s "Evidence
 * class" paragraph) -- unlike the admission flow's `openPath` (whose picker and downstream call
 * were already two separate commands `AdmissionPanel.tsx` could split apart in JS alone),
 * publish's native picker is fused inside `binding_publish_prepare` itself, so bypassing it needs
 * a host-side seam rather than a JS-only one.
 *
 * The grant `publish::prepare` mints is still minted **host-side** from this supplied
 * destination, never from a JS-asserted grant (F-5 holds through this seam exactly as it does for
 * the real command). **`e2e/publish.mjs` therefore does not exercise the native picker itself --
 * only the operator's manual walkthrough does.**
 *
 * NEXT-CUT.md P3 item B: recorded exactly like every other binding command here, including in dev
 * sessions where this seam actually runs -- it exists in those sessions (compiled in whenever
 * `debug_assertions` holds), and hiding it from the console would be a display lie, the same
 * standard the rest of this cut holds every other action to.
 */
export async function publishPrepareWithDestination(
  datasetHandle: string,
  styleDoc: string,
  scope: PublishScopeInput,
  filterActive: boolean,
  destination: string
): Promise<PrepareOutcome> {
  const entry = recordNamed("binding-command", "binding_publish_prepare_e2e_destination");
  try {
    const result = await invoke<PrepareOutcome>("binding_publish_prepare_e2e_destination", {
      datasetHandle,
      styleDoc,
      scope,
      filterActive,
      destination,
    });
    entry.resolveOk();
    return result;
  } catch (e) {
    // S4 (reviewer gate, action-console P7 fixes): resolveThrew takes no message -- `e` is still
    // rethrown below unchanged, so the real text is not lost, only kept out of the console
    // (BindingCommandHandle's own doc comment has where it still goes).
    entry.resolveThrew();
    throw e;
  }
}

/** `publish.rs::PUBLISH_PROGRESS_EVENT` verbatim -- the one Tauri event name this seam emits. */
export const PUBLISH_PROGRESS_EVENT = "publish://progress";

/**
 * Subscribes to `PUBLISH_PROGRESS_EVENT`, filtered to `attemptId` (the event is broadcast to every
 * listener in the webview -- `tauri::Emitter::emit` has no per-attempt targeting, so the filter
 * happens here, not host-side). Returns an unsubscribe function; safe to call more than once.
 * `@tauri-apps/api/event`'s `listen` resolves asynchronously (it registers the listener over IPC),
 * so a caller that unsubscribes before that promise settles must not leak a live listener --
 * `cancelled` below covers exactly that race.
 *
 * `attemptId` may be a real minted attempt id (the execute phase) OR a [`prepareCancelKey`] (the
 * "Preparing…" pin phase, RELEASE-0.1 item 10) -- the filter is a plain string match either way.
 * `onPhase`'s two extra arguments are passed ONLY when the event itself carries them (the pin
 * phase's own `bytes_done`/`bytes_total`, non-null); every other phase still calls `onPhase` with
 * one argument, exactly as before this piece.
 */
export function subscribePublishProgress(
  attemptId: string,
  onPhase: (phase: string, bytesDone?: number, bytesTotal?: number) => void
): () => void {
  let unlisten: (() => void) | null = null;
  let cancelled = false;
  listen<PublishProgressEvent>(PUBLISH_PROGRESS_EVENT, (event) => {
    if (event.payload.attempt_id !== attemptId) return;
    const { phase, bytes_done, bytes_total } = event.payload;
    if (bytes_done != null && bytes_total != null) {
      onPhase(phase, bytes_done, bytes_total);
    } else {
      onPhase(phase);
    }
  }).then((fn) => {
    if (cancelled) {
      fn();
    } else {
      unlisten = fn;
    }
  });
  return () => {
    cancelled = true;
    unlisten?.();
  };
}
