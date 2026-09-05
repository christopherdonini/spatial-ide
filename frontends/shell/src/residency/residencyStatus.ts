// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Viewport-residency cut P4 (decisions 24(a)/(b), resolved by the human): rider 1's persistent
 * `.residency-status` indicator (`App.tsx`'s own `.canvas-status-stack` child), extracted to its own
 * module so `residency/candidateArmSession.ts` can construct the SAME transition events `App.tsx`
 * reduces through `nextResidencyStatus` -- one state machine, arm-aware -- without a circular import
 * back into `App.tsx` itself. `App.tsx` re-exports everything here, so every existing
 * `import { ... } from "./App"` call site (`App.test.ts` included) keeps working unchanged.
 *
 * **Baseline's own `"baseline-ceiling"` variant and its rendered wording are UNTOUCHED by this
 * piece** (decisions 24(a)/(b)'s own text: "Baseline arm's wording is UNTOUCHED") -- only its
 * wrapping (a `kind` discriminant, needed once this became a union of three shapes) moved, never the
 * string `residencyStatusText` produces for it.
 *
 * **The two `"candidate-*"` variants are this piece's own contribution** -- the declared-partial-view
 * contract the human's decisions made real: over-budget is no longer an error-shaped refusal
 * (`.canvas-refusal`, baseline-only -- see `candidateArmSession.ts`'s own doc comment on why that
 * banner is structurally unreachable from candidate-arm ingest), it is this persistent status showing
 * what IS resident and why the rest is not.
 */

/** `residencyStatusText` below is the ONE place that renders any of these to a string -- amend
 * wording there only, never at a JSX call site, so `App.tsx`'s own render stays a one-line lookup. */
export type ResidencyStatus =
  | { kind: "baseline-ceiling"; residentFeatureCount: number; datasetRowCount: string }
  /** Candidate arm, within budget: the viewport's own covering tile set is fully resident, nothing
   * evicted/trimmed to make room for it right now. */
  | { kind: "candidate-within-budget"; residentFeatureCount: number }
  /** Candidate arm, over budget: `residentFeatureCount` is what IS resident and drawn.
   * `viewportTotal` is an HONEST total feature count for the current viewport if one is EVER known --
   * today, never: the candidate arm has no wire mechanism that reports an undelivered tile's own
   * feature count (`candidateArmSession.ts`'s own `emitResidencyStatus` doc comment has the full
   * account), so this is always `null` in the current implementation. NEVER an estimate or
   * extrapolation (docs/08: no invented numbers) -- `residencyStatusText` degrades the wording when
   * `null` rather than guessing a figure. The field exists (rather than being omitted entirely) so a
   * future honest per-viewport total, if one is ever added on the wire, has somewhere to land without
   * a second status shape.
   *
   * Item A (residency-debt cut 1b, BS3): `stalled` is `true` only -- never `false` -- when
   * `fillActivity` below reads `"stalled"` (the held queue is provably frozen until the next camera
   * change); omitted entirely otherwise (`"filling"`/`"idle"`), the same "absent property, not an
   * explicit `false`" idiom `TilePlanOutcome.coveringTruncated` already established in this codebase,
   * so every pre-existing `toEqual({kind:"candidate-over-budget", ...})` assertion that predates this
   * field keeps matching (`toEqual` treats an absent property and an explicit `undefined` as
   * equivalent). */
  | { kind: "candidate-over-budget"; residentFeatureCount: number; viewportTotal: number | null; stalled?: true }
  /** Item A (decisions 32a/33b): the scoped-relief lever fired -- queued/mid-mint tiles were dropped
   * and every in-flight one was cancelled, but the resident view itself (`residentFeatureCount`) is
   * retained untouched. 32a's own rider, binding on `residencyStatusText` below: this NEVER reads as
   * complete -- a user-stopped fill is not a finished one, regardless of how close `residentFeatureCount`
   * happens to sit to whatever the full covering set would have delivered (BS6: no completeness claim
   * over a partial set).
   *
   * **M1 (reviewer gate, residency-debt cut 1b) -- `untiledStreamStillRunning`.** Entry 32 ruled
   * Cancel repoints to the scoped relief of THE TILE FILL only; it never named the untiled first-
   * look/reissue stream (`candidateArmSession.ts`'s own `untiledStreamHandle`), which the relief lever
   * does NOT cancel -- that scope question is DECISIONS-PENDING.md entry 35, pending the human, NOT
   * decided by this piece. While that stream is still running at the moment the lever fires, the
   * ordinary "Filling stopped" wording below would be a false claim (batches keep landing) -- this
   * field, `true` only in that window (omitted otherwise, the same "absent, never explicit `false`"
   * idiom `TilePlanOutcome.coveringTruncated`/this file's own `stalled` field already use), tells
   * `residencyStatusText` to render the honest alternative instead. */
  | { kind: "candidate-relinquished"; residentFeatureCount: number; untiledStreamStillRunning?: true };

/**
 * Every input this state machine accepts, arm-aware. `"ceiling-refusal"` is baseline-only (never
 * constructed by candidate-arm code); `"candidate-within-budget"`/`"candidate-over-budget"` are
 * candidate-only (never constructed by baseline code, which has no notion of tile budgets).
 * `"delivery-complete"`/`"dataset-changed"`/`"query-issued"` are shared -- both arms clear the status
 * on any of the three, exactly rider 1's own declared transitions plus its later `"query-issued"`
 * refinement (DECISIONS-PENDING.md entry 1).
 */
export type ResidencyStatusEvent =
  | { kind: "ceiling-refusal"; residentFeatureCount: number; datasetRowCount: string }
  | { kind: "delivery-complete" }
  | { kind: "dataset-changed" }
  | { kind: "query-issued" }
  | { kind: "candidate-within-budget"; residentFeatureCount: number }
  | { kind: "candidate-over-budget"; residentFeatureCount: number; viewportTotal: number | null; stalled?: true }
  /** Item A (decisions 32a/33b): fired once, synchronously, from `candidateArmSession.ts`'s own
   * `relinquishFill()` -- never derived from `nextResidencyStatus`'s other transitions, so it can
   * never be confused with the ordinary within/over-budget machinery this state machine already runs.
   * M1: `untiledStreamStillRunning` mirrors the `ResidencyStatus` field of the same name above --
   * see that doc comment for the full account. */
  | { kind: "candidate-relinquished"; residentFeatureCount: number; untiledStreamStillRunning?: true };

/**
 * The status-indicator state machine itself -- pure, outside React state updates, for the same
 * testability reason `admitAndResetStaleUiState` (`App.tsx`) is: `App.test.ts` asserts every
 * transition here directly, without a DOM/WebGL harness this package does not carry.
 *
 * Dismissing the `.canvas-refusal` banner is deliberately NOT a transition here (baseline, unchanged
 * from before this piece) -- rider 1, the human's words: "dismiss hides the banner, never the status
 * indicator".
 */
export function nextResidencyStatus(event: ResidencyStatusEvent): ResidencyStatus | null {
  switch (event.kind) {
    case "ceiling-refusal":
      return { kind: "baseline-ceiling", residentFeatureCount: event.residentFeatureCount, datasetRowCount: event.datasetRowCount };
    case "candidate-within-budget":
      return { kind: "candidate-within-budget", residentFeatureCount: event.residentFeatureCount };
    case "candidate-over-budget":
      return {
        kind: "candidate-over-budget",
        residentFeatureCount: event.residentFeatureCount,
        viewportTotal: event.viewportTotal,
        stalled: event.stalled,
      };
    case "candidate-relinquished":
      return {
        kind: "candidate-relinquished",
        residentFeatureCount: event.residentFeatureCount,
        untiledStreamStillRunning: event.untiledStreamStillRunning,
      };
    case "delivery-complete":
    case "dataset-changed":
    case "query-issued":
      return null;
  }
}

/** Item A (residency-debt cut 1b), BS3: exactly the inputs the block-on-sight condition names --
 * `overBudget`/`queuedCount`/`inFlightCount`/`hasHeadroom`, nothing else (no producer scan-progress,
 * no new SKP field). Pure -- no timer, no manager/canvas reference -- so it is unit-testable directly
 * against these four inputs, per the pre-committed test case 3 (Item A's own, RESIDENCY-DEBT-1B.md).
 *
 * `"stalled"`: `queuedCount > 0 && overBudget && !hasHeadroom` -- the held queue is provably frozen:
 * `TileViewportStreamManager.drainQueueIfRoom` refuses to mint while `overBudget` is set regardless of
 * how many slots free up, and `hasHeadroom` being `false` means the SAME manager's own over-budget
 * drain-stop exception (`onCameraChange`'s own `headroomDespiteOverBudget`) cannot let a new candidate
 * through on the next camera change either -- nothing this session itself does moves it, only an
 * externally-driven camera change (which recomputes `overBudget` from scratch) can.
 *
 * `"filling"`: not stalled, and at least one stream is genuinely in flight -- real, currently-running
 * work, whether or not the viewport happens to be over budget right now.
 *
 * `"idle"`: neither -- nothing queued behind a frozen gate, nothing in flight either (e.g. between
 * plans, or once a round has fully drained/completed). Never surfaced as its own status text (Item A's
 * own scope is the HELD QUEUE; an idle read is simply "nothing to report" here, same as
 * `emitResidencyStatus`'s pre-existing "absence is honest" branch for a mid-fill, under-budget state
 * this predicate does not change). */
export interface FillActivityInputs {
  queuedCount: number;
  overBudget: boolean;
  hasHeadroom: boolean;
  inFlightCount: number;
}

export type FillActivity = "filling" | "stalled" | "idle";

export function fillActivity(input: FillActivityInputs): FillActivity {
  if (input.queuedCount > 0 && input.overBudget && !input.hasHeadroom) return "stalled";
  if (input.inFlightCount > 0) return "filling";
  return "idle";
}

/**
 * `.residency-status`'s rendered text (`App.tsx`), content arm-dependent, kept as a pure function
 * (not inline JSX) so the exact strings are directly unit-testable without a DOM -- the same seam
 * `scanLivenessText` (`App.tsx`) already establishes for its own persistent status text.
 *
 * The two candidate-arm strings are decisions 24(a)/(b)'s own verbatim wording (drafted for, and
 * shipped for, the human's sight at the PR):
 *  - within budget: "Showing all {N} features in view"
 *  - over budget, an honest viewport total known: "Showing {N} of ~{M} features — areas farthest
 *    from view are not drawn, to stay within the render budget. Pan or zoom in to see them."
 *  - over budget, no honest total known (`viewportTotal === null` -- the ordinary case today):
 *    "Showing {N} features — the farthest areas of this view are not drawn, to stay within the
 *    render budget. Zoom in to see more detail."
 * Baseline's own string is byte-identical to what it was before this piece.
 *
 * Item A (residency-debt cut 1b) adds two more, both DRAFTS for the human's 24(b) sight (see this
 * piece's own report for the full "DRAFT STRINGS FOR HUMAN SIGHT" list) -- kept as named constants
 * below (nit, reviewer gate: the report claiming these were already constants is only true once they
 * actually are), still draft-marked:
 *  - over budget AND `stalled` (the held queue is provably frozen, `fillActivity` above): the ordinary
 *    over-budget sentence, plus one more naming the freeze and its own remedy -- never a duration.
 *  - relinquished (32a's own rider -- NEVER "complete"): "Filling stopped — showing {N} features
 *    already loaded; the rest of this view was not fetched."
 *
 * M1 (reviewer gate) adds a THIRD draft string, for the `untiledStreamStillRunning` case above: the
 * ordinary "Filling stopped" wording would be false while the untiled first-look/reissue stream keeps
 * delivering, so this one states the truth instead -- the tile backlog was relinquished, the initial/
 * filter data load is still running, and Cancel does not stop it (DECISIONS-PENDING.md entry 35's own
 * open scope question, not yet ruled).
 */
/** Item A draft (24(b) sight): appended to the ordinary over-budget sentence only when `fillActivity`
 * reads `"stalled"` -- never a duration, only the freeze and its remedy. */
const STALLED_SUFFIX = " Filling is paused until the next pan or zoom.";
/** Item A draft (24(b) sight): 32a's own rider -- never "complete", never silent. */
function relinquishedText(residentFeatureCount: number): string {
  return `Filling stopped — showing ${residentFeatureCount} features already loaded; the rest of this view was not fetched.`;
}
/** M1 draft (24(b) sight): the honest alternative when the untiled first-look/reissue stream is still
 * running at relinquish time -- see `ResidencyStatus`'s own `untiledStreamStillRunning` doc comment
 * for the full account of why the ordinary `relinquishedText` above would be false here. */
function relinquishedUntiledStillRunningText(residentFeatureCount: number): string {
  return `Tile filling stopped — showing ${residentFeatureCount} features already loaded; the initial data load for this view is still running and Cancel does not stop it.`;
}

export function residencyStatusText(status: ResidencyStatus): string {
  switch (status.kind) {
    case "baseline-ceiling":
      return `${status.residentFeatureCount} of ${status.datasetRowCount} features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`;
    case "candidate-within-budget":
      return `Showing all ${status.residentFeatureCount} features in view`;
    case "candidate-over-budget": {
      const base =
        status.viewportTotal !== null
          ? `Showing ${status.residentFeatureCount} of ~${status.viewportTotal} features — areas farthest from view are not drawn, to stay within the render budget. Pan or zoom in to see them.`
          : `Showing ${status.residentFeatureCount} features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail.`;
      return status.stalled ? `${base}${STALLED_SUFFIX}` : base;
    }
    case "candidate-relinquished":
      return status.untiledStreamStillRunning
        ? relinquishedUntiledStillRunningText(status.residentFeatureCount)
        : relinquishedText(status.residentFeatureCount);
  }
}
