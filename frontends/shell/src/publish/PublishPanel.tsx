import { useEffect, useState } from "react";

import RefusalBlock from "../admission/RefusalBlock";
import type { FormattedRefusal } from "../admission/formatRefusal";
import { registerE2eHook, unregisterE2eHook } from "../e2e-test-surface";
import { decodeHexF64 } from "../skp/codec";
import type { Bbox } from "../skp/types";
import type { StyleState } from "../style/document";
import { toStyleDocument } from "../style/document";
import { formatPublishRefusal } from "./formatPublishRefusal";
import PublishDialog from "./PublishDialog";
import type { DialogSettleResult } from "./PublishDialog";
import { publishCancel, publishExecute, publishPrepare, subscribePublishProgress } from "./client";
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

/** The panel's own visible state -- `"preparing"` covers the whole native-picker + `preflight` +
 * grant-mint round trip (`binding_publish_prepare` is a single async call; there is no
 * intermediate state to observe inside it). */
export type PublishPanelState =
  | { kind: "idle" }
  | { kind: "preparing" }
  | { kind: "dialog"; attemptId: string; prompt: PublishPromptData }
  | { kind: "refused"; refusal: FormattedRefusal }
  | {
      kind: "succeeded";
      outcome: Extract<ExecuteOutcome, { status: "success" }> | Extract<ExecuteOutcome, { status: "succeeded-unaudited" }>;
    };

/** `binding_publish_prepare`'s own outcome, turned into this panel's next state -- pure, so
 * `PublishPanel.test.ts` can assert every branch (`prompt` / `picker-cancelled` / `refused`)
 * without a DOM (`NEXT-CUT.md`'s own required test list: "PickerCancelled path"). */
export function nextStateFromPrepareOutcome(outcome: PrepareOutcome): PublishPanelState {
  switch (outcome.status) {
    case "picker-cancelled":
      // Silent return to idle -- not an error (`NEXT-CUT.md` P3 item 4).
      return { kind: "idle" };
    case "refused":
      return { kind: "refused", refusal: formatPublishRefusal(outcome.message) };
    case "prompt":
      return { kind: "dialog", attemptId: outcome.attempt_id, prompt: outcome.prompt };
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
    setState({ kind: "preparing" });
    const styleDoc = JSON.stringify(toStyleDocument(style));
    const outcome = await publishPrepare(datasetHandle, styleDoc, scopeInput, filterActive);
    setState(nextStateFromPrepareOutcome(outcome));
    return outcome;
  }

  function handlePublishClick(): void {
    void runPrepare(scope);
  }

  function handleDialogSettled(result: DialogSettleResult): void {
    setState(nextStateFromDialogSettled(result));
  }

  // E2E TEST SURFACE (dev builds only): drives the SAME `runPrepare` function the real "Publish…"
  // button calls above -- not a second, parallel path (`e2e-test-surface.ts`'s own top comment
  // doctrine). `PublishDialog.tsx` registers the matching `publishExecute` hook once a dialog is
  // actually open, mirroring `capturePixels`/`queryWithFilter`'s own "only exists once there is
  // something to drive" precedent.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    registerE2eHook("publishPrepare", (scopeOverride?: PublishScopeChoice) => runPrepare(scopeOverride ?? scope));
    return () => unregisterE2eHook("publishPrepare");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datasetHandle, style, filterActive, scope]);

  const currentDisabled = currentViewOptionDisabled(hasSettledView);
  const busy = state.kind === "preparing";

  return (
    <div className="publish-panel">
      <button
        type="button"
        className="publish-disclosure"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
      >
        {expanded ? "▾" : "▸"} Publish
      </button>
      {expanded && (
        <div className="publish-controls">
          <fieldset className="publish-scope">
            <legend>Row scope</legend>
            <label>
              <input
                type="radio"
                name="publish-scope"
                value="whole"
                checked={scope === "whole"}
                onChange={() => setScope("whole")}
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
                onChange={() => setScope("current")}
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
            onClick={handlePublishClick}
            disabled={busy || (scope === "current" && currentDisabled) || state.kind === "dialog"}
          >
            {busy ? "Preparing…" : "Publish…"}
          </button>

          {state.kind === "dialog" && (
            <PublishDialog
              attemptId={state.attemptId}
              prompt={state.prompt}
              execute={publishExecute}
              cancelExecution={publishCancel}
              subscribeProgress={subscribePublishProgress}
              onSettled={handleDialogSettled}
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
                  <p className="publish-summary-headline">
                    Bundle written, but its outcome record could not be audited.
                  </p>
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
      )}
    </div>
  );
}
