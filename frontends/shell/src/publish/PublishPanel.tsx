// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { useEffect, useRef, useState } from "react";

import RefusalBlock from "../admission/RefusalBlock";
import type { FormattedRefusal } from "../admission/formatRefusal";
import { recordNamed } from "../console/recorder";
import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
import { decodeHexF64 } from "../skp/codec";
import type { Bbox } from "../skp/types";
import type { StyleState } from "../style/document";
import { toStyleDocument } from "../style/document";
import { formatPublishRefusal } from "./formatPublishRefusal";
import PublishDialog from "./PublishDialog";
import type { DialogSettleResult } from "./PublishDialog";
import {
  prepareCancelKey,
  publishCancel,
  publishExecute,
  publishPrepare,
  publishPrepareWithDestination,
  subscribePublishProgress,
} from "./client";
import { FILTER_SCOPE_SENTENCE } from "./types";
import type { ExecuteOutcome, PrepareOutcome, PublishPromptData, PublishScopeInput } from "./types";

export type PublishScopeChoice = "whole" | "current";

/**
 * Whether "Current view" may be chosen (`NEXT-CUT.md` P3 item 3: "if null -- no settled view yet
 * -- disable the option with a visible reason"). Pure over the boolean `App.tsx` already tracks
 * (`hasSettledView`), not the ref itself -- a `useRef` has no meaningful value to a pure test, and
 * the render-time decision only ever needs "has one ever arrived", never the bbox's own contents.
 */
export function currentViewOptionDisabled(hasSettledView: boolean): boolean {
  return !hasSettledView;
}

/**
 * Builds the wire-shape `PublishScope` `binding_publish_prepare` expects, decoding the SKP-wire
 * (`HexF64`-encoded) viewport bbox this shell already tracks (`App.tsx`'s `lastViewportBboxRef`)
 * back to plain `f64` -- `publish.rs`'s own module docs: this is a binding-local command, not SKP,
 * so its `JsBbox` carries plain numbers, never SKP's wire encoding.
 *
 * Returns `null` when `"current"` is chosen but no settled view exists yet -- the disabled
 * option's own boundary case, defended here too even though the real Publish button is already
 * disabled by `currentViewOptionDisabled` (never trust a UI-level guard as the only guard, this
 * codebase's own recurring discipline).
 */
export function resolvePublishScope(choice: PublishScopeChoice, bbox: Bbox | null): PublishScopeInput | null {
  if (choice === "whole") return { kind: "whole-file" };
  if (bbox === null) return null;
  return {
    kind: "viewport-bbox",
    bbox: {
      xmin: decodeHexF64(bbox.xmin),
      ymin: decodeHexF64(bbox.ymin),
      xmax: decodeHexF64(bbox.xmax),
      ymax: decodeHexF64(bbox.ymax),
    },
  };
}

/** The panel's own visible state. `"preparing"` covers the whole native-picker + pin-free-preflight
 * + pin + grant-mint round trip -- RELEASE-0.1 item 10 gives it real substructure now (the pin
 * phase's own label and bytes fraction, and whether a Cancel click is already in flight), where
 * before this piece it was a single opaque wait with nothing to observe inside it. */
export type PublishPanelState =
  | { kind: "idle" }
  | { kind: "preparing"; phase: string | null; bytesDone: number | null; bytesTotal: number | null; cancelRequested: boolean }
  | { kind: "dialog"; attemptId: string; prompt: PublishPromptData }
  | { kind: "cancelled" }
  | { kind: "refused"; refusal: FormattedRefusal }
  | {
      kind: "succeeded";
      outcome: Extract<ExecuteOutcome, { status: "success" }> | Extract<ExecuteOutcome, { status: "succeeded-unaudited" }>;
    };

/** The panel's own initial `"preparing"` state, before any progress event has arrived -- one place
 * so `runPrepare`/`runPrepareWithDestination` cannot spell its four fields two different ways. */
const PREPARING_START: PublishPanelState = {
  kind: "preparing",
  phase: null,
  bytesDone: null,
  bytesTotal: null,
  cancelRequested: false,
};

/** The `"preparing"` variant of [`PublishPanelState`], named once so the pure transitions below can
 * return it narrowed rather than re-spelling the shape. */
type PreparingState = Extract<PublishPanelState, { kind: "preparing" }>;

/**
 * Whether a Cancel control may be rendered at all -- **MF1, this batch's own reviewer gate, and the
 * criterion the whole fix turns on**.
 *
 * `binding_publish_prepare` (`commands.rs`) awaits the NATIVE save dialog first (`rx.await`) and only
 * mints and registers the prepare phase's `CancelToken` in `RunningPublishes` afterwards. So for the
 * whole picker window there is no token under `prepareCancelKey(datasetHandle)` for
 * `binding_publish_cancel` to reach: a Cancel click there returned `false` (nothing found), the panel
 * latched `cancelRequested` anyway, and the button sat disabled reading "Cancelling" while the pin ran
 * on, uncancelled -- the exact defect MF1 names.
 *
 * **The criterion is `state.phase !== null`: the first pin-phase progress event has actually
 * arrived.** That event is emitted from inside the `spawn_blocking` call the token was registered
 * before (`commands.rs`), so its arrival is PROOF the token is registered and reachable -- not an
 * assumption about ordering. Before it, no Cancel is offered: during the picker window the operator's
 * own cancel affordance is the native dialog's own Cancel button (`PrepareOutcome::PickerCancelled`),
 * which no host-side control can substitute for -- a Tauri command cannot dismiss an open OS save
 * dialog. Rendering nothing there is the honest surface; rendering a button that cannot act is the
 * thing being fixed.
 *
 * A type predicate, so the transitions below narrow on the one criterion instead of restating it.
 */
export function cancelControlVisible(state: PublishPanelState): state is PreparingState {
  return state.kind === "preparing" && state.phase !== null;
}

/** A pin-phase progress event folded into the panel's state -- pure, so the subscription in the
 * component below is a one-liner and every branch is testable without a DOM. Only ever updates while
 * still `"preparing"`, so a late event after the phase settled (refused, prompted, cancelled) is a
 * silent no-op rather than corrupting whatever state came next. */
export function stateAfterPinProgress(
  prev: PublishPanelState,
  phase: string,
  bytesDone?: number,
  bytesTotal?: number
): PublishPanelState {
  if (prev.kind !== "preparing") return prev;
  return {
    ...prev,
    phase,
    bytesDone: bytesDone ?? prev.bytesDone,
    bytesTotal: bytesTotal ?? prev.bytesTotal,
  };
}

/** The Cancel click's own latch -- set ONLY when a token is proven registered
 * ([`cancelControlVisible`]). A request that arrives before the first phase event changes nothing at
 * all: the button it would have disabled is not rendered yet, and latching there is what previously
 * wedged the panel at "Cancelling" for the rest of an uncancelled pin (MF1). */
export function stateAfterCancelRequested(prev: PublishPanelState): PublishPanelState {
  if (!cancelControlVisible(prev)) return prev;
  return { ...prev, cancelRequested: true };
}

/** The latch cleared again when the cancel request did not reach a running pin -- either
 * `binding_publish_cancel` answered `false` (nothing found under the key, so nothing was cancelled)
 * or the call itself REJECTED (an IPC failure; [`requestPrepareCancel`] treats a throw as the same
 * `reached === false`, since in both cases the pin is still running). Previously that `false` was
 * discarded and nothing ever cleared the flag (MF1); clearing it puts a live Cancel back in the
 * operator's hands instead of a permanently disabled "Cancelling". */
export function stateAfterCancelRejected(prev: PublishPanelState): PublishPanelState {
  if (prev.kind !== "preparing") return prev;
  return { ...prev, cancelRequested: false };
}

/** The prefix of the one diagnostic [`requestPrepareCancel`] writes when the cancel call rejects --
 * exported so `PublishPanel.test.ts` asserts the exact text rather than a substring of its own
 * invention. The message it carries is normalized the way [`settlePrepareOutcome`] normalizes a
 * rejected prepare (`e instanceof Error ? e.message : String(e)`). */
export const PREPARE_CANCEL_FAILED_LOG = "publish: the prepare-phase cancel request failed; the pin may still be running";

/**
 * The Cancel-during-"Preparing…" request itself: guard, latch, call, un-latch on a miss.
 *
 * Lives at module scope taking its `applyState`/`cancel` collaborators as parameters -- the same
 * "pure so it is testable" shape [`settlePrepareOutcome`] and [`nextStateFromPrepareOutcome`] already
 * establish in this file -- so `PublishPanel.test.ts` can prove BOTH halves of MF1 without a DOM: that
 * a request before the first phase event neither latches nor calls the host, and that one after it
 * calls `publishCancel` with `prepareCancelKey(datasetHandle)`.
 *
 * The guard here is defence in depth, not the only guard: the button is not rendered before the first
 * phase event either ([`cancelControlVisible`], used by both) -- this codebase's own recurring
 * discipline of never trusting a UI-level guard alone (see `resolvePublishScope` above).
 *
 * **A REJECTION is treated as `reached === false`** (the re-review's own must-fix). `publishCancel`
 * (`client.ts`) rethrows whatever `invoke` rejected with, and this function's only call site is
 * `void requestPrepareCancel(...)` -- so before this try/catch an IPC failure escaped as an
 * unhandled rejection AND left `cancelRequested` latched, wedging the button at a permanently
 * disabled "Cancelling" while the pin ran on: the exact shape of the defect MF1 already fixed for
 * the `false` answer, reachable through the other exit. Nothing was cancelled either way, so the
 * un-latch is the same and Cancel is clickable again. The error is not swallowed: `publishCancel`
 * has already recorded the attempt as having thrown in the action console (its own
 * `entry.resolveThrew()`, which deliberately withholds the text -- S4), and the text itself is
 * normalized here exactly as [`settlePrepareOutcome`] normalizes a rejected prepare. It does NOT
 * become a `RefusalBlock`: the in-flight `runPrepare` is still what settles this panel, and a
 * refusal painted here would be both premature and immediately overwritten.
 */
export async function requestPrepareCancel(
  state: PublishPanelState,
  datasetHandle: string,
  applyState: (update: (prev: PublishPanelState) => PublishPanelState) => void,
  cancel: (key: string) => Promise<boolean>
): Promise<void> {
  if (!cancelControlVisible(state)) return;
  applyState(stateAfterCancelRequested);
  let reached: boolean;
  try {
    reached = await cancel(prepareCancelKey(datasetHandle));
  } catch (e) {
    reached = false;
    console.error(PREPARE_CANCEL_FAILED_LOG, e instanceof Error ? e.message : String(e));
  }
  if (!reached) applyState(stateAfterCancelRejected);
}

/** The bytes readout's own text. Digit grouping via `toLocaleString`, no dependency; the locale is
 * pinned to `en-US` deliberately -- every other string this panel renders is a fixed English sentence,
 * and a host-locale-dependent readout would make the rendered text untestable for no gain. A COUNT of
 * bytes read against the source's own length: never a rate, a percentage or an ETA (ADR-018). */
export function formatBytesHashed(bytesDone: number | null, bytesTotal: number): string {
  return `${(bytesDone ?? 0).toLocaleString("en-US")} / ${bytesTotal.toLocaleString("en-US")} bytes hashed`;
}

/** `binding_publish_prepare`'s own outcome, turned into this panel's next state -- pure, so
 * `PublishPanel.test.ts` can assert every branch (`prompt` / `picker-cancelled` / `cancelled` /
 * `refused`) without a DOM (`NEXT-CUT.md`'s own required test list: "PickerCancelled path"). */
export function nextStateFromPrepareOutcome(outcome: PrepareOutcome): PublishPanelState {
  switch (outcome.status) {
    case "picker-cancelled":
      // Silent return to idle -- not an error (`NEXT-CUT.md` P3 item 4).
      return { kind: "idle" };
    case "cancelled":
      // RELEASE-0.1 item 10: the operator cancelled during "Preparing…" -- shown, not silent
      // (unlike `picker-cancelled`, which is a native-dialog dismissal with nothing to report),
      // and Publish is re-enabled (`busy` is only true for `"preparing"`, below).
      return { kind: "cancelled" };
    case "refused":
      return { kind: "refused", refusal: formatPublishRefusal(outcome.message) };
    case "prompt":
      return { kind: "dialog", attemptId: outcome.attempt_id, prompt: outcome.prompt };
  }
}

/**
 * Awaits a `binding_publish_prepare*` call and ALWAYS resolves to a `PrepareOutcome` -- success,
 * typed refusal, or an unexpected REJECTION alike, turned into the same refused shape.
 *
 * **S2, this cut's own reviewer gate.** An earlier version had `runPrepare`/
 * `runPrepareWithDestination` `await` their own `invoke()` call directly, with no surrounding
 * try/catch -- a rejected promise (an IPC failure; `invoke()`'s own failure mode when a Tauri
 * command's `Result::Err` is a bare string, not this seam's typed `{status:"refused"}` shape)
 * unwound out of the caller before `setState` ever ran, wedging the panel in `"preparing"` forever
 * with no refusal shown and no way to recover (`docs/01` principle 7). Extracted as a pure,
 * top-level, exported function -- not a component-internal closure -- specifically so
 * `PublishPanel.test.ts` can prove the reject path without a DOM, mirroring `nextStateFromPrepareOutcome`'s
 * own "pure so it is testable" precedent above. Mirrors `admitDataset.ts`'s own try/catch
 * discipline: unlike that function's `SkpCallError` (a real typed shape worth preserving), a
 * publish-seam rejection has no typed shape at all, so it becomes a plain refusal through the SAME
 * `RefusalBlock` surface every other publish refusal already renders through.
 */
export async function settlePrepareOutcome(promise: Promise<PrepareOutcome>): Promise<PrepareOutcome> {
  try {
    return await promise;
  } catch (e) {
    return { status: "refused", message: e instanceof Error ? e.message : String(e) };
  }
}

/** `PublishDialog`'s own settle result, turned into this panel's next state -- pure, covering
 * every `ExecuteOutcome` variant plus the pre-submit abandon path. */
export function nextStateFromDialogSettled(result: DialogSettleResult): PublishPanelState {
  if (result.kind === "abandoned") return { kind: "idle" };
  const outcome = result.outcome;
  switch (outcome.status) {
    case "success":
    case "succeeded-unaudited":
      return { kind: "succeeded", outcome };
    case "refused":
      return { kind: "refused", refusal: formatPublishRefusal(outcome.message) };
    case "unknown-attempt":
      return {
        kind: "refused",
        refusal: formatPublishRefusal(
          "this publish attempt is no longer known to the host (already used, expired, or never " +
            "issued) — start over"
        ),
      };
  }
}

export interface PublishPanelProps {
  /** `admitted.dataset` -- the opaque `ds_<hex>` handle `binding_publish_prepare` resolves against
   * the shell's own catalog (never a name or path crossing from JS). */
  datasetHandle: string;
  /** App-owned style state (`App.tsx`'s own `style`) -- this panel derives the wire-shape §5a
   * document from it at Publish-click time via `toStyleDocument`, the SAME producer `StylePanel`
   * uses, never a second one. */
  style: StyleState;
  /** `App.tsx`'s `activeFilter !== null` -- wired into `binding_publish_prepare`'s own
   * `filter_active` parameter (P1's disclosed deviation) so the host can embed the filter-scope
   * sentence in the real prompt. */
  filterActive: boolean;
  /** Whether a settled view has ever arrived for the current dataset (`App.tsx`'s own
   * `hasSettledView`, paired with `lastViewportBboxRef`'s own reset -- see that file's comments).
   * Render-time signal only; the actual bbox at click time is read fresh via
   * `getLastViewportBbox`. */
  hasSettledView: boolean;
  /** `lastViewportBboxRef.current` at CALL TIME -- a getter, never a snapshotted value, so a scope
   * choice of "current" always publishes the freshest viewport, not whatever it was when this
   * panel last rendered. */
  getLastViewportBbox: () => Bbox | null;
}

/**
 * The publish affordance (`NEXT-CUT.md` P3): collapsed-by-default disclosure, a scope choice, one
 * "Publish…" button. Placed in `.app-main`'s flex column below `StylePanel` (`App.tsx`) -- see
 * `styles.css`'s own `.publish-panel` comment for the measured layout budget, the same discipline
 * `StylePanel.tsx`'s own doc comment establishes.
 *
 * **Default scope is "Current view"** (a design choice the piece text explicitly permits: "A
 * default IS acceptable here since scope is not the approval"). It is the honest SMALL scope --
 * whichever is chosen, the approval prompt restates it in words (`PublishPromptData.row_scope`),
 * so a default here never silently ships more than the operator sees confirmed at the dialog.
 */
export default function PublishPanel({
  datasetHandle,
  style,
  filterActive,
  hasSettledView,
  getLastViewportBbox,
}: PublishPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const [scope, setScope] = useState<PublishScopeChoice>("current");
  const [state, setState] = useState<PublishPanelState>({ kind: "idle" });

  /**
   * Subscribes to the "Preparing…" pin phase's own progress (RELEASE-0.1 item 10) -- the phase
   * label and the bytes-hashed fraction, through the SAME `subscribePublishProgress` seam
   * `PublishDialog`'s own execute-phase phase display uses, filtered on
   * `prepareCancelKey(datasetHandle)` rather than a real attempt id (none exists yet at this
   * point -- `client.ts::prepareCancelKey`'s own doc comment). Only ever updates state while still
   * `"preparing"`, so a late-arriving event after the phase has already settled (refused, prompted,
   * cancelled) is a silent no-op rather than corrupting whatever state came next.
   */
  function subscribeToPinProgress(): () => void {
    return subscribePublishProgress(prepareCancelKey(datasetHandle), (phase, bytesDone, bytesTotal) => {
      setState((prev) => stateAfterPinProgress(prev, phase, bytesDone, bytesTotal));
    });
  }

  async function runPrepare(scopeChoice: PublishScopeChoice): Promise<PrepareOutcome> {
    const scopeInput = resolvePublishScope(scopeChoice, getLastViewportBbox());
    if (scopeInput === null) {
      // Defensive fallback only (see `resolvePublishScope`'s own doc comment) -- the real button
      // is already disabled for this case, so this path is not reachable from the rendered UI.
      const outcome: PrepareOutcome = {
        status: "refused",
        message: "no settled view yet -- pan or zoom the canvas once first",
      };
      setState(nextStateFromPrepareOutcome(outcome));
      return outcome;
    }
    setState(PREPARING_START);
    const unsubscribe = subscribeToPinProgress();
    const styleDoc = JSON.stringify(toStyleDocument(style));
    // `settlePrepareOutcome` (module scope, above) is what turns an unexpected rejection into a
    // refusal instead of leaving this `await` throw straight out of `runPrepare`, unresolved and
    // with `setState` never called -- see its own doc comment (S2).
    const outcome = await settlePrepareOutcome(publishPrepare(datasetHandle, styleDoc, scopeInput, filterActive));
    unsubscribe();
    setState(nextStateFromPrepareOutcome(outcome));
    return outcome;
  }

  /**
   * **E2E TEST SEAM ONLY** (`NEXT-CUT.md` P4) -- no button in this component's own JSX calls this.
   * Identical to `runPrepare` above except the destination is supplied directly rather than asked
   * of the native OS save dialog (`publishPrepareWithDestination` -> `commands.rs`'s
   * `binding_publish_prepare_e2e_destination`, `#[cfg(debug_assertions)]`, compiled out of a
   * release build). WebView2's save dialog has no CDP-reachable automation path at all, so
   * `e2e/publish.mjs` has no way past it without this seam -- see that hook's own doc comment
   * (`e2e-test-surface.ts`) for the full design note and its one documented limitation: an E2E run
   * through this path does not exercise the native picker, only the operator's manual walkthrough
   * does.
   *
   * **No Cancel is rendered on this path, and that is now true by construction** (MF1, this batch's
   * reviewer gate -- before it, this path rendered a Cancel that could not cancel anything):
   * `binding_publish_prepare_e2e_destination` registers no token in `RunningPublishes` and passes
   * `None` for the pin-progress sink (`commands.rs`), so no phase event ever arrives, `state.phase`
   * stays `null`, and [`cancelControlVisible`] stays false for the whole call.
   */
  async function runPrepareWithDestination(
    scopeChoice: PublishScopeChoice,
    destination: string
  ): Promise<PrepareOutcome> {
    const scopeInput = resolvePublishScope(scopeChoice, getLastViewportBbox());
    if (scopeInput === null) {
      // Same defensive fallback as `runPrepare` -- see its own comment.
      const outcome: PrepareOutcome = {
        status: "refused",
        message: "no settled view yet -- pan or zoom the canvas once first",
      };
      setState(nextStateFromPrepareOutcome(outcome));
      return outcome;
    }
    setState(PREPARING_START);
    const unsubscribe = subscribeToPinProgress();
    const styleDoc = JSON.stringify(toStyleDocument(style));
    const outcome = await settlePrepareOutcome(
      publishPrepareWithDestination(datasetHandle, styleDoc, scopeInput, filterActive, destination)
    );
    unsubscribe();
    setState(nextStateFromPrepareOutcome(outcome));
    return outcome;
  }

  function handlePublishClick(): void {
    void runPrepare(scope);
  }

  /**
   * The "Preparing…" state's own Cancel control (RELEASE-0.1 item 10) -- the same
   * `publishCancel`/`binding_publish_cancel` control [`PublishDialog`]'s own execute-phase Cancel
   * button uses, addressed at [`prepareCancelKey`] instead of a real attempt id. Best-effort, the
   * same posture the execute phase's own `handleCancelExecution` takes: the in-flight `runPrepare`
   * call is still what ultimately settles this panel's state (via the `PrepareOutcome::Cancelled`
   * it resolves to), this only requests that the pin stop early.
   *
   * The whole body is [`requestPrepareCancel`] (module scope, above) -- MF1's own fix and its own
   * doc comment: the guard, the latch, and the un-latch when the host answers `false` OR the call
   * rejects. That second case is why the `void` below is safe: the function handles its own
   * rejection and never settles rejected, so nothing here can become an unhandled rejection.
   */
  function handleCancelPreparing(): void {
    void requestPrepareCancel(state, datasetHandle, setState, publishCancel);
  }

  function handleDialogSettled(result: DialogSettleResult): void {
    setState(nextStateFromDialogSettled(result));
  }

  /**
   * **The current attempt's id, readable outside a render** (`state.kind === "dialog" ?
   * state.attemptId : null`) -- kept in sync by the effect just below. Exists so the
   * `publishExecute` E2E hook (registered ONCE, dataset-scoped, alongside `publishPrepare`/
   * `publishPrepareWithDestination` -- see that effect's own comment) always reads the FRESHEST
   * attempt rather than a stale one closed over at registration time, without having to
   * re-register the hook on every state transition.
   */
  const attemptIdRef = useRef<string | null>(null);
  useEffect(() => {
    attemptIdRef.current = state.kind === "dialog" ? state.attemptId : null;
  }, [state]);

  /**
   * **The SAME `execute` function `PublishDialog`'s own Submit button drives** (`client.ts`'s
   * `publishExecute`, the identical reference `<PublishDialog execute={publishExecute} .../>`
   * passes below), and the SAME terminal-state transition a real dialog's `onSettled` produces
   * (`handleDialogSettled`) -- not a second, parallel path, only a second caller of the one seam.
   * `"unknown-attempt"` when there is no current attempt (`attemptIdRef.current === null`) mirrors
   * what the host itself returns for an `attempt_id` it does not hold, rather than throwing.
   */
  async function runExecute(typedPhrase: string): Promise<ExecuteOutcome> {
    const attemptId = attemptIdRef.current;
    if (attemptId === null) {
      return { status: "unknown-attempt" };
    }
    const outcome = await publishExecute(attemptId, typedPhrase);
    handleDialogSettled({ kind: "executed", outcome });
    return outcome;
  }

  // E2E TEST SURFACE (dev builds only): drives the SAME `runPrepare`/`runPrepareWithDestination`/
  // `runExecute` functions the real "Publish…" button and `PublishDialog`'s own Submit button call
  // -- not a second, parallel path (`e2e-test-surface.ts`'s own top comment doctrine).
  //
  // **`publishExecute` is registered HERE, dataset-scoped, like `publishPrepare` -- NOT inside
  // `PublishDialog.tsx`.** An earlier version registered it there, mirroring
  // `capturePixels`/`queryWithFilter`'s "only exists once there is something to drive" precedent
  // -- but `PublishDialog` only mounts when BOTH `state.kind === "dialog"` AND this panel's own
  // `expanded` disclosure is open (JSX below), and `e2e/publish.mjs` drives this seam headlessly,
  // never clicking the disclosure toggle -- so that hook could never appear, a real finding from
  // running the suite, not a hypothetical. Registering it here, keyed off `attemptIdRef` rather
  // than a mounted `PublishDialog`, is what "dataset-scoped like prepare" means concretely: the
  // hook exists for as long as this panel does, independent of the disclosure's own expand/collapse
  // state, exactly like `publishPrepare`/`publishPrepareWithDestination` already are.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    registerE2eHook("publishPrepare", (scopeOverride?: PublishScopeChoice) => runPrepare(scopeOverride ?? scope));
    registerE2eHook(
      "publishPrepareWithDestination",
      (destination: string, scopeOverride?: PublishScopeChoice) =>
        runPrepareWithDestination(scopeOverride ?? scope, destination)
    );
    registerE2eHook("publishExecute", (typedPhrase: string) => runExecute(typedPhrase));
    return () => {
      unregisterE2eHook("publishPrepare");
      unregisterE2eHook("publishPrepareWithDestination");
      unregisterE2eHook("publishExecute");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetHandle, style, filterActive, scope]);

  return (
    <div className="publish-panel">
      <button
        type="button"
        className="publish-disclosure"
        onClick={() => {
          // S5 (reviewer gate, action-console P7 fixes): pure view state, same class-C treatment
          // as StylePanel's own togglePanelExpanded row.
          recordNamed("gui-action", "publish.togglePanelExpanded");
          setExpanded((v) => !v);
        }}
        aria-expanded={expanded}
      >
        {expanded ? "▾" : "▸"} Publish
      </button>
      {expanded && (
        <PublishControls
          state={state}
          scope={scope}
          hasSettledView={hasSettledView}
          filterActive={filterActive}
          onScopeChange={setScope}
          onPublishClick={handlePublishClick}
          onCancelPreparing={handleCancelPreparing}
          onDialogSettled={handleDialogSettled}
        />
      )}
    </div>
  );
}

export interface PublishControlsProps {
  state: PublishPanelState;
  scope: PublishScopeChoice;
  hasSettledView: boolean;
  filterActive: boolean;
  onScopeChange: (scope: PublishScopeChoice) => void;
  onPublishClick: () => void;
  onCancelPreparing: () => void;
  onDialogSettled: (result: DialogSettleResult) => void;
}

/**
 * The disclosure's whole body, as a PURE function of the panel's state -- extracted from
 * [`PublishPanel`]'s own JSX (which renders exactly this, and nothing else, when expanded) for MF3,
 * this batch's reviewer gate: before it, `PublishPanel.test.ts` imported pure functions only and
 * NOTHING in the suite rendered this component's markup at all.
 *
 * A component that owns no state and no effects can be rendered one-shot with `renderToStaticMarkup`
 * -- `PublishDialog.test.ts`'s own established in-house route (that file's own describe block: "not a
 * DOM harness this package deliberately does not carry ... needs no jsdom event loop, and adds no
 * dependency") -- in any state a test cares to construct, including the two an operator can only
 * reach mid-flight ("preparing", "cancelled"). Not a second, parallel render path: this IS the panel's
 * render, one component down.
 */
export function PublishControls({
  state,
  scope,
  hasSettledView,
  filterActive,
  onScopeChange,
  onPublishClick,
  onCancelPreparing,
  onDialogSettled,
}: PublishControlsProps) {
  const currentDisabled = currentViewOptionDisabled(hasSettledView);
  const busy = state.kind === "preparing";

  return (
    <div className="publish-controls">
      <fieldset className="publish-scope">
        <legend>Row scope</legend>
        <label>
          <input
            type="radio"
            name="publish-scope"
            value="whole"
            checked={scope === "whole"}
            onChange={() => onScopeChange("whole")}
          />
          Whole dataset
        </label>
        <label>
          <input
            type="radio"
            name="publish-scope"
            value="current"
            checked={scope === "current"}
            disabled={currentDisabled}
            onChange={() => onScopeChange("current")}
          />
          Current view
        </label>
        {currentDisabled && (
          <p className="publish-scope-disabled-reason">
            No settled view yet — pan or zoom the canvas once before publishing the current view.
          </p>
        )}
      </fieldset>

      {filterActive && <p className="publish-filter-scope-sentence">{FILTER_SCOPE_SENTENCE}</p>}

      <button
        type="button"
        className="publish-open"
        onClick={onPublishClick}
        disabled={busy || (scope === "current" && currentDisabled) || state.kind === "dialog"}
      >
        {busy ? "Preparing…" : "Publish…"}
      </button>

      {/* RELEASE-0.1 item 10: the "Preparing…" wait's own phase label, bytes count, and a live
        * Cancel control -- the same `publishCancel` control PublishDialog's own execute-phase
        * Cancel button uses, addressed at `prepareCancelKey` instead of a real attempt id. No
        * duration/rate/ETA anywhere (ADR-018): only a plain "<done> / <total> bytes hashed" count.
        *
        * **The Cancel button renders only once `cancelControlVisible(state)` holds** -- MF1, this
        * batch's reviewer gate; see that function's own doc comment for why the first phase event
        * is the criterion and why the picker window offers no host-side Cancel at all. */}
      {state.kind === "preparing" && (
        <div className="publish-preparing" role="status">
          <p className="publish-preparing-phase">{state.phase ?? "Preparing…"}</p>
          {state.bytesTotal !== null && (
            <p className="publish-preparing-fraction">{formatBytesHashed(state.bytesDone, state.bytesTotal)}</p>
          )}
          {cancelControlVisible(state) && (
            <button
              type="button"
              className="publish-preparing-cancel"
              onClick={onCancelPreparing}
              disabled={state.cancelRequested}
            >
              {state.cancelRequested ? "Cancelling" : "Cancel"}
            </button>
          )}
        </div>
      )}

      {state.kind === "cancelled" && (
        <p className="publish-cancelled" role="status">
          Preparing stopped — nothing was written.
        </p>
      )}

      {state.kind === "dialog" && (
        <PublishDialog
          attemptId={state.attemptId}
          prompt={state.prompt}
          execute={publishExecute}
          cancelExecution={publishCancel}
          subscribeProgress={subscribePublishProgress}
          onSettled={onDialogSettled}
        />
      )}

      {state.kind === "refused" && <RefusalBlock refusal={state.refusal} />}

      {state.kind === "succeeded" && (
        // A quiet summary block -- NO auto-open of anything (NEXT-CUT.md P3 item 4). Deliberately
        // omits `build_millis`: the evidence guard rail ("no perf figure anywhere ... the UI
        // publish path is UNMEASURED and stays that way this cut") -- see `types.ts`'s own
        // comment on that field.
        <div className="publish-summary" role="status">
          {state.outcome.status === "succeeded-unaudited" ? (
            <>
              <p className="publish-summary-headline">Bundle written, but its outcome record could not be audited.</p>
              <p className="publish-summary-detail">{state.outcome.detail}</p>
            </>
          ) : (
            <p className="publish-summary-headline">Published.</p>
          )}
          <dl className="publish-summary-fields">
            <dt>Destination</dt>
            <dd>{state.outcome.bundle_path}</dd>
            {state.outcome.status === "success" && (
              <>
                <dt>Rows</dt>
                <dd>{state.outcome.rows}</dd>
                <dt>Partitions</dt>
                <dd>{state.outcome.partitions}</dd>
              </>
            )}
          </dl>
        </div>
      )}
    </div>
  );
}
