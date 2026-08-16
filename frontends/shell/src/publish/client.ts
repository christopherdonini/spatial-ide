import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";

import type { ExecuteOutcome, PrepareOutcome, PublishProgressEvent, PublishScopeInput } from "./types";

/** `binding_publish_prepare`'s own JS-visible key spelling: Tauri's `#[tauri::command]` macro
 * converts snake_case Rust parameter names to camelCase by default (`ArgumentCase::Camel`, the
 * macro's own default, unmodified anywhere in this crate) -- this is NOT the same discipline
 * `skp/client.ts` uses (whose commands take one already-snake_case request struct, unaffected by
 * this conversion since it is a single argument, not per-field). Opens the **native** OS
 * destination picker host-side (`publish.rs`'s own module docs: "the destination never crosses
 * from JS") -- `filter_active` is a disclosed P1 deviation (`CUT-STATE.md`), not this shell's own
 * choice to omit or default.
 */
export function publishPrepare(
  datasetHandle: string,
  styleDoc: string,
  scope: PublishScopeInput,
  filterActive: boolean
): Promise<PrepareOutcome> {
  return invoke<PrepareOutcome>("binding_publish_prepare", {
    datasetHandle,
    styleDoc,
    scope,
    filterActive,
  });
}

/** `binding_publish_execute` -- carries the operator's ALREADY-TYPED phrase. **No comparison
 * happens in this function or anywhere else in this file**: the phrase crosses verbatim, whatever
 * it is; the one comparison lives in Rust (`permission::approval::check`, `NEXT-CUT.md`'s binding
 * "Approval: DOM, one comparison, in Rust" rule) and a mismatch comes back as `{status:"refused"}`,
 * never a JS-side short-circuit. */
export function publishExecute(attemptId: string, typedPhrase: string): Promise<ExecuteOutcome> {
  return invoke<ExecuteOutcome>("binding_publish_execute", { attemptId, typedPhrase });
}

/** `binding_publish_cancel` (P2's own addition -- `commands.rs`'s doc comment). `true` iff a
 * running publish for this attempt was found and cancelled; `false` is not an error. */
export function publishCancel(attemptId: string): Promise<boolean> {
  return invoke<boolean>("binding_publish_cancel", { attemptId });
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
 */
export function publishPrepareWithDestination(
  datasetHandle: string,
  styleDoc: string,
  scope: PublishScopeInput,
  filterActive: boolean,
  destination: string
): Promise<PrepareOutcome> {
  return invoke<PrepareOutcome>("binding_publish_prepare_e2e_destination", {
    datasetHandle,
    styleDoc,
    scope,
    filterActive,
    destination,
  });
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
 */
export function subscribePublishProgress(attemptId: string, onPhase: (phase: string) => void): () => void {
  let unlisten: (() => void) | null = null;
  let cancelled = false;
  listen<PublishProgressEvent>(PUBLISH_PROGRESS_EVENT, (event) => {
    if (event.payload.attempt_id === attemptId) onPhase(event.payload.phase);
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
