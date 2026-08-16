import { useEffect, useReducer, useState } from "react";
import type { KeyboardEvent } from "react";

import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
import type { ExecuteOutcome, PublishPromptData } from "./types";

/**
 * The dialog's own lifecycle -- deliberately NOT the outcome data itself (that flows to the parent
 * via `onSettled`, below; this machine only ever tracks what the DIALOG shows). `"confirming"` is
 * the ONLY state with a live phrase input; once `submit` moves it to `"executing"`, there is no
 * transition back to `"confirming"` for this instance -- a new attempt requires a fresh
 * `PublishDialog` (a fresh `attemptId`/`prompt` pair from the parent, per `NEXT-CUT.md`'s "ONE
 * prompt, no retry loop" rule), never this component reopening itself.
 */
export type PublishDialogState =
  | { kind: "confirming"; phrase: string }
  | { kind: "executing"; cancelRequested: boolean }
  | { kind: "closed" };

export type PublishDialogEvent =
  | { kind: "phraseChanged"; value: string }
  | { kind: "submit" }
  /** Abandons BEFORE submit -- the dialog's own Cancel button, valid only in `"confirming"`. */
  | { kind: "cancel" }
  /** Requests cancellation of the IN-FLIGHT publish -- the Cancel-publish control, valid only in
   * `"executing"`. Distinct from `"cancel"` above: this does not itself close the dialog (the
   * underlying `execute()` call still has to return), it only marks the request as made so the UI
   * can say so. */
  | { kind: "cancelExecution" }
  /** `execute()` resolved -- ANY outcome (`ExecuteOutcome`'s own success/refused/unaudited/
   * unknown-attempt) closes the dialog identically; `PublishPanel` is what branches on which. */
  | { kind: "settled" };

/**
 * The pure reducer (`PublishDialog.test.ts` asserts every rule below directly, no DOM -- this
 * repository's own established "pure-seam" test style, `App.tsx`'s `nextScanState`/
 * `admitAndResetStaleUiState` precedent).
 *
 * - **Empty-field / Enter-on-empty-inert**: `submit` on `phrase === ""` is a no-op (stays
 *   `"confirming"` with the same phrase) -- NOT a JS comparison against `confirmation_phrase`,
 *   only a non-emptiness check (`NEXT-CUT.md`: "enable/disable only on non-empty — NOT on match").
 * - **Second submit impossible**: `submit` while already `"executing"` is a no-op.
 * - **Cancel abandons**: `cancel` only acts from `"confirming"`; a no-op from `"executing"` (that
 *   state has its own `cancelExecution` event instead).
 * - **Closed on any outcome**: `settled` only acts from `"executing"`, and always moves to
 *   `"closed"` regardless of what the outcome actually was.
 */
export function nextPublishDialogState(
  state: PublishDialogState,
  event: PublishDialogEvent
): PublishDialogState {
  switch (event.kind) {
    case "phraseChanged":
      return state.kind === "confirming" ? { kind: "confirming", phrase: event.value } : state;
    case "submit":
      if (state.kind !== "confirming" || state.phrase === "") return state;
      return { kind: "executing", cancelRequested: false };
    case "cancel":
      return state.kind === "confirming" ? { kind: "closed" } : state;
    case "cancelExecution":
      return state.kind === "executing" ? { kind: "executing", cancelRequested: true } : state;
    case "settled":
      return state.kind === "executing" ? { kind: "closed" } : state;
  }
}

export interface PublishDialogSubmitDeps {
  execute: (attemptId: string, typedPhrase: string) => Promise<ExecuteOutcome>;
}

/**
 * The dialog's Submit/Enter handler, extracted as a **pure async function with no access to
 * `prompt.confirmation_phrase` at all** -- `PublishDialog.test.ts`'s no-JS-comparison proof is
 * structural, not merely observed: this signature has nowhere to put a comparison even if someone
 * tried, since the confirmation phrase is not a parameter here. `typedPhrase` crosses to
 * `deps.execute` UNCONDITIONALLY, whatever it is (`NEXT-CUT.md`: "the button submits whatever was
 * typed").
 */
export function submitPublishAttempt(
  attemptId: string,
  typedPhrase: string,
  deps: PublishDialogSubmitDeps
): Promise<ExecuteOutcome> {
  return deps.execute(attemptId, typedPhrase);
}

/** What `PublishDialog` reports to its parent exactly once, when it reaches `"closed"` --
 * `"abandoned"` for the pre-submit Cancel button (never reached the host at all), `"executed"` for
 * a real `execute()` outcome of any kind. `PublishPanel.tsx` is what turns this into a rendered
 * refusal/summary/idle transition (`nextStateFromDialogSettled`). */
export type DialogSettleResult = { kind: "abandoned" } | { kind: "executed"; outcome: ExecuteOutcome };

export interface PublishDialogProps {
  attemptId: string;
  prompt: PublishPromptData;
  /** `client.ts`'s `publishExecute`, or a test double -- never re-implemented here. */
  execute: (attemptId: string, typedPhrase: string) => Promise<ExecuteOutcome>;
  /** `client.ts`'s `publishCancel`, or a test double. Best-effort: the in-flight `execute()` call
   * is still what ultimately settles the dialog (via its own returned `ExecuteOutcome`), this only
   * requests that it stop early. */
  cancelExecution: (attemptId: string) => Promise<boolean>;
  /** `client.ts`'s `subscribePublishProgress`, or a test double returning a no-op unsubscribe.
   * Optional so a caller with no live Tauri event bus (every unit test) can omit it. */
  subscribeProgress?: (attemptId: string, onPhase: (phase: string) => void) => () => void;
  /** Called EXACTLY ONCE, the instant this dialog reaches `"closed"` -- the parent (`PublishPanel`)
   * owns what happens next (render a refusal, a summary, or return to idle). This component never
   * renders `RefusalBlock` itself (`NEXT-CUT.md` P2 item 2: "the dialog CLOSES and renders the
   * refusal through RefusalBlock in the publish panel"). */
  onSettled: (result: DialogSettleResult) => void;
}

/** Subscribes to progress phases only while `active`; unsubscribes on every transition out (a
 * fresh attempt gets a fresh subscription, never a stale one from a previous `attemptId`
 * continuing to update this instance). Factored out of `PublishDialog` only to keep that
 * component's own body free of a `useEffect` whose dependency array reviewers would otherwise have
 * to re-derive by eye. */
function usePublishPhase(
  attemptId: string,
  active: boolean,
  subscribeProgress?: (attemptId: string, onPhase: (phase: string) => void) => () => void
): string | null {
  const [phase, setPhase] = useState<string | null>(null);
  useEffect(() => {
    if (!active || !subscribeProgress) return;
    setPhase(null);
    return subscribeProgress(attemptId, setPhase);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, attemptId]);
  return phase;
}

/**
 * The approval surface (`NEXT-CUT.md` P2). Every `PublishPromptData` field the host sent is
 * rendered verbatim, in the order this component declares below -- see this piece's own report for
 * the full enumeration.
 *
 * **Never pre-filled** (the phrase input starts at `""`, `nextPublishDialogState`'s own initial
 * state below -- never `prompt.confirmation_phrase`). **No don't-ask-again, no remembered
 * approval** -- there is no checkbox, no localStorage read/write, nothing that could skip this
 * component on a future attempt; every `PublishPanel` "Publish…" click mints a brand-new
 * `attempt_id` and a brand-new `PublishDialog` instance (the parent keys on `attemptId`).
 */
export default function PublishDialog({
  attemptId,
  prompt,
  execute,
  cancelExecution,
  subscribeProgress,
  onSettled,
}: PublishDialogProps) {
  const [state, dispatch] = useReducer(nextPublishDialogState, { kind: "confirming", phrase: "" });
  const phase = usePublishPhase(attemptId, state.kind === "executing", subscribeProgress);

  // E2E TEST SURFACE (dev builds only): drives the SAME `execute` prop the Submit button below
  // calls -- not a second, parallel path (`e2e-test-surface.ts`'s own top comment doctrine).
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    registerE2eHook("publishExecute", (typedPhrase: string) => execute(attemptId, typedPhrase));
    return () => unregisterE2eHook("publishExecute");
  }, [attemptId, execute]);

  function handleSubmit(): void {
    // Guarded directly against the current `state`, not merely by the disabled button -- this
    // codebase's own recurring "never trust a single guard alone" discipline (e.g.
    // `StylePanel.tsx`'s `handleFillColor` comment). Also what makes Enter-on-empty inert: this is
    // the SAME function `handleKeyDown` calls below.
    if (state.kind !== "confirming" || state.phrase === "") return;
    const typedPhrase = state.phrase;
    dispatch({ kind: "submit" });
    void submitPublishAttempt(attemptId, typedPhrase, { execute }).then((outcome) => {
      dispatch({ kind: "settled" });
      onSettled({ kind: "executed", outcome });
    });
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") handleSubmit();
  }

  function handleAbandon(): void {
    dispatch({ kind: "cancel" });
    onSettled({ kind: "abandoned" });
    // No host abandon call: P1 exposed none (`CUT-STATE.md` P1's own phase table has no
    // `binding_publish_abandon`); the pending attempt's own TTL (`PENDING_ATTEMPT_TTL`, 120s,
    // `publish.rs`) is what reclaims it host-side -- this piece's own permitted fallback ("if not,
    // note the TTL covers it").
  }

  function handleCancelExecution(): void {
    dispatch({ kind: "cancelExecution" });
    void cancelExecution(attemptId);
  }

  if (state.kind === "closed") return null;

  return (
    <div className="publish-dialog" role="dialog" aria-modal="true">
      <div className="publish-dialog-header">
        {prompt.operation} — class {prompt.class} — {prompt.reversibility}
      </div>
      <dl className="publish-dialog-fields">
        <dt>Source</dt>
        <dd className="publish-dialog-source-name">{prompt.source_name}</dd>
        <dt>Source content hash</dt>
        <dd className="publish-dialog-source-hash">{prompt.source_content_hash}</dd>
        <dt>Style hash</dt>
        <dd className="publish-dialog-style-hash">{prompt.style_hash}</dd>
        <dt>Destination</dt>
        {/* The FULL display string, never truncated/ellipsized (NEXT-CUT.md P2 item 1). */}
        <dd className="publish-dialog-destination">{prompt.destination_display}</dd>
        <dt>Grantor</dt>
        <dd className="publish-dialog-grantor">
          {prompt.grantor}
          {/* Display-only countdown, cosmetic, host clock rules (NEXT-CUT.md P2 item 1) -- no
            * client-side re-derivation of `grant_remaining_s`, just the number the host sent. */}
          <span className="publish-dialog-grant-remaining"> — grant remaining: {prompt.grant_remaining_s}s</span>
        </dd>
        <dt>Row scope</dt>
        <dd className="publish-dialog-row-scope">{prompt.row_scope}</dd>
      </dl>
      {prompt.filter_scope && (
        <div className="publish-dialog-filter-scope" role="alert">
          {prompt.filter_scope}
        </div>
      )}

      {state.kind === "confirming" && (
        <div className="publish-dialog-confirm">
          <p className="publish-dialog-instruction">
            Type the destination's final path component to confirm.
          </p>
          <input
            type="text"
            className="publish-dialog-phrase"
            value={state.phrase}
            onChange={(e) => dispatch({ kind: "phraseChanged", value: e.target.value })}
            onKeyDown={handleKeyDown}
            autoComplete="off"
          />
          <div className="publish-dialog-actions">
            <button type="button" className="publish-dialog-cancel" onClick={handleAbandon}>
              Cancel
            </button>
            {/* Enabled on NON-EMPTY only -- NEVER on a match against `prompt.confirmation_phrase`
              * (NEXT-CUT.md's binding "no JS comparison" rule; `PublishDialog.test.ts` proves this
              * structurally via `submitPublishAttempt`'s own signature). */}
            <button
              type="button"
              className="publish-dialog-submit"
              onClick={handleSubmit}
              disabled={state.phrase === ""}
            >
              Publish
            </button>
          </div>
        </div>
      )}

      {state.kind === "executing" && (
        <div className="publish-dialog-executing">
          {/* No duration word, no figure (ADR-018) -- phase names only. */}
          <p className="publish-dialog-phase" role="status">
            {phase ?? "Publishing…"}
          </p>
          <button
            type="button"
            className="publish-dialog-cancel-execution"
            onClick={handleCancelExecution}
            disabled={state.cancelRequested}
          >
            {state.cancelRequested ? "Cancelling" : "Cancel publish"}
          </button>
        </div>
      )}
    </div>
  );
}
