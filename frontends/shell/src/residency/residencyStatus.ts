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
   * a second status shape. */
  | { kind: "candidate-over-budget"; residentFeatureCount: number; viewportTotal: number | null };

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
  | { kind: "candidate-over-budget"; residentFeatureCount: number; viewportTotal: number | null };

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
      return { kind: "candidate-over-budget", residentFeatureCount: event.residentFeatureCount, viewportTotal: event.viewportTotal };
    case "delivery-complete":
    case "dataset-changed":
    case "query-issued":
      return null;
  }
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
 */
export function residencyStatusText(status: ResidencyStatus): string {
  switch (status.kind) {
    case "baseline-ceiling":
      return `${status.residentFeatureCount} of ${status.datasetRowCount} features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`;
    case "candidate-within-budget":
      return `Showing all ${status.residentFeatureCount} features in view`;
    case "candidate-over-budget":
      return status.viewportTotal !== null
        ? `Showing ${status.residentFeatureCount} of ~${status.viewportTotal} features — areas farthest from view are not drawn, to stay within the render budget. Pan or zoom in to see them.`
        : `Showing ${status.residentFeatureCount} features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail.`;
  }
}
