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
   * evicted/trimmed to make room for it right now.
   *
   * Item B (residency-debt cut 1b): `settled` is `"complete"` exactly when `candidateArmSession.ts`'s
   * own `emitResidencyStatus` gates this event on `settledState(...) === "settled-complete"` (never
   * merely `isFillComplete()` alone any more -- see that call site's own doc comment for the
   * `pendingViewportChange` gap this closes, BS5: "never declared while `trackedTileCount > 0` or a
   * re-plan is pending").
   *
   * Nit (reviewer gate, residency-debt cut 1b): this field carries no information a caller could not
   * already derive (`candidate-within-budget` firing AT ALL already implies `settledState(...) ===
   * "settled-complete"` -- see the gate on `emitResidencyStatus` above) -- kept anyway, deliberately, for
   * SYMMETRY with `candidate-over-budget`'s own `settled?: "partial"` (below), where the field DOES carry
   * information (an over-budget event fires whether or not it is settled): one consistent shape, `status
   * .settled === "complete"`/`"partial"`, either kind can be checked the same way without a caller needing
   * to know which variant is the informationless one.
   *
   * Piece 2(ii) (residency-debt cut 1b, entry 36): `settled` widens to `"partial-failure"` -- the
   * typed-partiality reading for a fill that genuinely settled (nothing tracked, no pending re-plan,
   * the untiled stream at its own terminal) but where a covering-tile terminal since the last plan
   * failed (`settledState`'s own `hasCoveringFailure` input, `candidateArmSession.ts`'s
   * `failedCoveringTerminals`) -- REPLACES B1's silent "nothing emitted" reading for exactly that
   * case: never `"complete"` (BS6: no completeness claim over a set a stream failed for), and never
   * silent either (entry 36's own ruling: "silence and staleness never represent state"). */
  | { kind: "candidate-within-budget"; residentFeatureCount: number; settled?: "complete" | "partial-failure" }
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
   * equivalent).
   *
   * Item B: `settled` is `"partial"` exactly when `settledState(...)` reads `"settled-partial"` --
   * always paired with `overBudget === true` at this event's own emission site (`isFillComplete()`
   * reads `false` unconditionally while `manager.overBudget` is `true`, so a settled-but-not-complete
   * reading over an over-budget covering set is exactly this classification, never the within-budget
   * one). Structurally mutually exclusive with `stalled` -- `stalled` requires `queuedCount > 0`, which
   * requires `trackedTileCount > 0`, which the settled predicate excludes by construction (BS5). */
  | { kind: "candidate-over-budget"; residentFeatureCount: number; viewportTotal: number | null; stalled?: true; settled?: "partial" }
  /** Item A (decisions 32a/33b): the scoped-relief lever fired -- queued/mid-mint tiles were dropped
   * and every in-flight one was cancelled, but the resident view itself (`residentFeatureCount`) is
   * retained untouched. 32a's own rider, binding on `residencyStatusText` below: this NEVER reads as
   * complete -- a user-stopped fill is not a finished one, regardless of how close `residentFeatureCount`
   * happens to sit to whatever the full covering set would have delivered (BS6: no completeness claim
   * over a partial set).
   *
   * **M1 (reviewer gate, residency-debt cut 1b) -- `untiledStreamStillRunning`, entry 35 RULED
   * 2026-09-05.** Entry 32 ruled Cancel repoints to the scoped relief of THE TILE FILL; entry 35 later
   * ruled the untiled first-look/reissue stream (`candidateArmSession.ts`'s own `untiledStreamHandle`)
   * INTO scope too, but only conditionally: `relinquishFill` now cancels it as well whenever a grid
   * frame already exists (no anchor hazard once the frame is frozen), leaving only the frameless
   * bootstrap window uncancellable (the ruling's own "no at bootstrap"). This field is therefore `true`
   * only in that narrower, frameless window now (omitted otherwise, the same "absent, never explicit
   * `false`" idiom `TilePlanOutcome.coveringTruncated`/this file's own `stalled` field already use) --
   * `candidateArmSession.ts`'s own `relinquishFill` doc comment has the full trace of why no OTHER
   * window can reach this field any more. `residencyStatusText` renders the honest alternative
   * (reworded per the ruling's own string-3 follow-on) whenever it does.
   *
   * Item B: deliberately carries NO `settled` field of its own -- `relinquishFill` (`candidateArmSession
   * .ts`) resets its session's own `hasPlanned` latch to `false`, so `settledState`'s own `isSettled`
   * check reads `false` unconditionally the instant this status fires, and stays that way until a NEW
   * camera-change plan runs. A relinquished fill is therefore never "settled" by construction -- there
   * is no settled classification for this event to carry. */
  | { kind: "candidate-relinquished"; residentFeatureCount: number; untiledStreamStillRunning?: true };

/**
 * Every input this state machine accepts, arm-aware. `"ceiling-refusal"` is baseline-only (never
 * constructed by candidate-arm code); `"candidate-within-budget"`/`"candidate-over-budget"` are
 * candidate-only (never constructed by baseline code, which has no notion of tile budgets).
 * `"delivery-complete"`/`"dataset-changed"`/`"query-issued"` are shared -- both arms clear the status
 * on any of the three, exactly rider 1's own declared transitions plus its later `"query-issued"`
 * refinement (DECISIONS-PENDING.md entry 1). Piece 2(i) (residency-debt cut 1b, entry 36) adds a
 * FOURTH clearing member, `"candidate-fill-progress"` -- see its own doc comment below.
 */
export type ResidencyStatusEvent =
  | { kind: "ceiling-refusal"; residentFeatureCount: number; datasetRowCount: string }
  | { kind: "delivery-complete" }
  | { kind: "dataset-changed" }
  | { kind: "query-issued" }
  /** Piece 2(i) (residency-debt cut 1b, entry 36 rule (i)): a clearing-class event the candidate arm
   * emits whenever it has just learned that a prior complete-looking reading ("Showing all N features
   * in view") no longer holds, so that reading is never left standing by inertia (the twice-convicted
   * "Showing all N" class, BS6) -- `candidateArmSession.ts`'s own `emitResidencyStatus` fires this
   * exactly once, right before falling silent, whenever the covering set just stopped reading
   * complete after having read complete before. Also fired once by `handleViewportChange` when a
   * genuinely fresh plan follows a `candidate-relinquished` status (entry 35's own sticky-clear rule,
   * below), so a NEW plan can supersede a standing relinquished reading. Reduces to `null`
   * (`nextResidencyStatus` below), the same shared clearing mechanism the three events above already
   * are -- a fourth member of that family, not a second parallel signal. */
  | { kind: "candidate-fill-progress" }
  | { kind: "candidate-within-budget"; residentFeatureCount: number; settled?: "complete" | "partial-failure" }
  | { kind: "candidate-over-budget"; residentFeatureCount: number; viewportTotal: number | null; stalled?: true; settled?: "partial" }
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
 *
 * **Piece 1 (residency-debt cut 1b, entry 35 -- "sticky per entry-1"): the `current` parameter and its
 * one refusal rule.** A standing `"candidate-relinquished"` status must persist until a
 * query-issued-class transition clears it -- it is NEVER silently replaced by a later batch-driven
 * `"candidate-within-budget"`/`"candidate-over-budget"` reading (the concrete, reachable case: the
 * frameless bootstrap window's own untiled stream, left deliberately uncancelled, later reports
 * over-budget on its own batch, and `emitResidencyStatus`'s over-budget branch emits unconditionally
 * -- `candidateArmSession.ts`'s own doc comment on `relinquishFill` has the full trace). `current`
 * defaults to `null` so every pre-existing call site/test that never threads a prior status through
 * keeps behaving exactly as before (the refusal can only ever fire when a caller actually supplies a
 * `"candidate-relinquished"` `current`, which none of them did before this piece). A NEW plan or
 * dataset/filter change clears the sticky status honestly -- through one of the clearing-class events
 * themselves (`"query-issued"`/`"dataset-changed"`/`"delivery-complete"`/`"candidate-fill-progress"`)
 * or another relinquish, never by simply letting the next over/within-budget reading overwrite it in
 * place (`candidateArmSession.ts`'s own `relinquishFill`/`handleViewportChange` wiring fires the
 * clearing event at exactly that moment).
 */
export function nextResidencyStatus(event: ResidencyStatusEvent, current: ResidencyStatus | null = null): ResidencyStatus | null {
  if (
    current?.kind === "candidate-relinquished" &&
    (event.kind === "candidate-within-budget" || event.kind === "candidate-over-budget")
  ) {
    return current; // sticky: refuse the overwrite -- neither a clearing class nor another relinquish
  }
  switch (event.kind) {
    case "ceiling-refusal":
      return { kind: "baseline-ceiling", residentFeatureCount: event.residentFeatureCount, datasetRowCount: event.datasetRowCount };
    case "candidate-within-budget":
      return { kind: "candidate-within-budget", residentFeatureCount: event.residentFeatureCount, settled: event.settled };
    case "candidate-over-budget":
      return {
        kind: "candidate-over-budget",
        residentFeatureCount: event.residentFeatureCount,
        viewportTotal: event.viewportTotal,
        stalled: event.stalled,
        settled: event.settled,
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
    case "candidate-fill-progress":
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
 * Item B (residency-debt cut 1b, RESIDENCY-DEBT-1B.md, ADR-028 Amendment 1 + principle 8): the
 * settled-partial signal's own pure predicate, a "modest generalization of an existing pure function"
 * (`candidateArmSession.ts`'s own `isFillComplete`) -- never a second copy of ITS loop (the covering-
 * tile-by-covering-tile completeness check stays exactly where it is; this function only classifies
 * ON TOP of that single boolean).
 *
 * The predicate, originally preregistered (RESIDENCY-DEBT-1B.md, Item B section) as:
 * `isSettled = hasPlanned && !pendingViewportChange && manager.trackedTileCount === 0`.
 * Classification (only meaningful once settled): `"settled-complete"` is exactly today's
 * `isFillComplete()`; `"settled-partial"` is `isSettled && !isFillComplete()` -- derived, never a
 * second copy of what makes a covering set incomplete (over budget, a truncated covering set, or some
 * covering tile itself partial/missing -- `isFillComplete()`'s own doc comment enumerates these; this
 * function does not re-enumerate them, it only asks whether that single boolean agrees).
 *
 * **M1 (reviewer gate, residency-debt cut 1b) -- the input list widened by one, per the preregistration's
 * own "Item B input-list amendment" (dated 2026-09-05).** The reviewer found the ORIGINAL three-input predicate
 * above insufficient to satisfy this file's own BS5/BS6: the untiled first-look/reissue stream is exempt
 * from `manager.trackedTileCount` (`candidateArmSession.ts`'s own `ingestAndMaybeEstablishFrame`/
 * `issueUntiledQuery` doc comments), so in a filter-reissue window the ORIGINAL predicate could read
 * settled -- and the status claim "filling has stopped"/"Showing all N" -- while that stream keeps
 * delivering batches into the same view. `untiledStreamRunning` (below) closes that gap: the CURRENT
 * predicate is `isSettled = hasPlanned && !pendingViewportChange && trackedTileCount === 0 &&
 * !untiledStreamRunning`, forcing `"not-settled"` unconditionally while that stream is still open,
 * exactly like the other two negative preconditions below.
 *
 * BS5 (quoted): "never declared while `trackedTileCount > 0` or a re-plan is pending" -- each of
 * `input.trackedTileCount > 0`, `input.pendingViewportChange`, and (M1) `input.untiledStreamRunning`
 * independently forces `"not-settled"` below, regardless of `hasPlanned`/`fillComplete`. This is also the
 * Amendment-1 guarantee stated in that ADR's own text: an eviction under the partial-covering-eviction
 * exception "frees vertices, which reopens headroom, which reopens issuance" (ADR-028 Amendment 1) --
 * that whole reopening chain can only run from WITHIN a live `onCameraChange` admission, which requires
 * the tile in question to be freshly re-tracked (`trackedTileCount` rises above 0) before it can complete
 * again -- so this predicate excluding every `trackedTileCount > 0` state by construction also excludes
 * every state the reopening exception could still be mid-flight in.
 *
 * `pendingViewportChange`: `true` from the moment a viewport change is accepted for debouncing until
 * its debounced handler actually runs (or is cancelled) -- `candidateArmSession.ts`'s own
 * `onViewportChanged`/`handleViewportChange`/`cancelPendingViewportChange` wiring sets this. A
 * scheduled-but-not-yet-run re-plan means the CURRENT covering set's own completeness (even if
 * genuinely `true` right now) is about to be re-evaluated against a different viewport -- declaring it
 * settled in that window would be a claim about to go stale by the caller's own next action, not a
 * false claim about the past but a premature one about "at rest," which BS5 forbids identically.
 */
export interface SettledStateInputs {
  /** `candidateArmSession.ts`'s own `hasPlanned` latch: `false` until a real camera-change plan has
   * run this generation, and reset to `false` again by `relinquishFill` -- so a relinquished fill
   * reads `"not-settled"` here unconditionally (this field `false`) until a NEW plan earns it back,
   * regardless of `trackedTileCount`/`pendingViewportChange`/`fillComplete`. */
  hasPlanned: boolean;
  pendingViewportChange: boolean;
  trackedTileCount: number;
  /** M1 (reviewer gate, residency-debt cut 1b, the "Item B input-list amendment"): `true` while
   * `candidateArmSession.ts`'s own `untiledStreamHandle` (the initial/reissued untiled first-look
   * stream) is non-`null` -- that stream is exempt from `trackedTileCount` above (it is never tracked by
   * `TileViewportStreamManager` at all), so without this input a settled reading could be taken while it
   * still keeps delivering batches into the current view, exactly the false-claim class Item A's own M1
   * finding convicted. Read at emission time (`emitResidencyStatus`'s own `currentSettledState`), so it
   * always reflects THIS instant's own truth -- "never a stale snapshot," the same discipline this
   * session's other status inputs already follow (`emitResidencyRelinquished`'s own identical read,
   * `candidateArmSession.ts`). */
  untiledStreamRunning: boolean;
  /** `candidateArmSession.ts`'s own `isFillComplete()` -- the SAME boolean `emitResidencyStatus`'s
   * pre-existing within-budget gate already reads; not re-derived here. Piece 2(ii) (residency-debt
   * cut 1b, entry 36): `isFillComplete()` itself now also reads `false` whenever `hasCoveringFailure`
   * (below) would be `true` (`candidateArmSession.ts`'s own `failedCoveringTerminals.size > 0` check),
   * so `fillComplete` can never be `true` at the same time as `hasCoveringFailure` -- the two inputs
   * are consulted in sequence below, never in conflict. */
  fillComplete: boolean;
  /** Piece 2(ii) (residency-debt cut 1b, entry 36): `true` iff a covering-tile stream (or the untiled
   * stream, Piece 2(iii)) has terminated with a non-`Completed` terminal since the last real plan --
   * `candidateArmSession.ts`'s own `failedCoveringTerminals` set, recorded by `manager`'s own
   * `onTerminal` callback and the untiled sink's `onTerminal`, cleared at the top of every fresh
   * `handleViewportChange` plan. REPLACES the prior B1 fix's blunt, unconditional
   * `hasPlanned = false` latch on any non-`Completed` terminal -- the typed accounting distinguishes
   * WHY a fill is not complete (budget/truncation vs. a genuine failure), so `residencyStatusText` can
   * finally say which, rather than falling silent (entry 36's own ruling: "silence and staleness never
   * represent state"). Only consulted here when `fillComplete` is `false` -- `fillComplete` already
   * excludes every failure case by construction (see that field's own doc comment), so this input
   * exists purely to tell "not complete because of budget/truncation" apart from "not complete because
   * something genuinely failed," never to override `fillComplete` itself. */
  hasCoveringFailure: boolean;
}

export type SettledState = "not-settled" | "settled-complete" | "settled-partial" | "settled-partial-failure";

export function settledState(input: SettledStateInputs): SettledState {
  const isSettled =
    input.hasPlanned && !input.pendingViewportChange && input.trackedTileCount === 0 && !input.untiledStreamRunning;
  if (!isSettled) return "not-settled";
  if (input.fillComplete) return "settled-complete";
  return input.hasCoveringFailure ? "settled-partial-failure" : "settled-partial";
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
 * filter data load is still running, and Cancel does not stop it. **RULED 2026-09-05 (entry 35, the
 * 24(b) string sight):** the human held string 3 for the string-3 reachability re-check this piece
 * carries out -- see `candidateArmSession.ts`'s own `relinquishFill` doc comment for the trace. The
 * survivor is REWORDED here per the human's own note ("reworded per my note if it survives"): with
 * `relinquishFill` now also cancelling this stream whenever `manager.gridFrame` already exists, the
 * ONLY window this variant can still fire from is the frameless one (bootstrap, or an Apply/Clear
 * reissue racing the first look's own frame-establishing terminal) -- never "the initial data load"
 * alone (a frameless reissue is not initial), so the string now names the frame itself, not "initial".
 *
 * Item B (residency-debt cut 1b) adds a FOURTH draft string, for `settled: "partial"` above: the fill
 * has genuinely come to rest for this viewport (no further request is outstanding, and none will start
 * without a fresh pan/zoom) but did not complete -- distinct from `stalled` (a frozen, still-tracked
 * queue that COULD resume the moment headroom frees up) and from `candidate-relinquished` (the
 * operator stopped it). States the fill's own quiescence plainly, never a completeness/total claim over
 * the partial set (BS6) -- `settled: "complete"` on the within-budget event, by contrast, needs no new
 * string at all: it renders the SAME pre-existing "Showing all N" text (see that function's own doc
 * comment on `emitResidencyStatus`, `candidateArmSession.ts`, for the new gate that guards it).
 * **RULED 2026-09-05 (24(b) string sight):** the human's own wording, applied verbatim below.
 *
 * Piece 2(ii) (residency-debt cut 1b, entry 36) adds a FIFTH string, for `settled: "partial-failure"`
 * on the WITHIN-budget event -- distinct from string 4 above, whose "the render budget is full" claim
 * is budget-only and would be false here (nothing was evicted for space; a covering-tile stream
 * genuinely failed instead). Draft-marked, for the human's 24(b) sight at this piece's own PR.
 */
/** Item A draft (24(b) sight): appended to the ordinary over-budget sentence only when `fillActivity`
 * reads `"stalled"` -- never a duration, only the freeze and its remedy. */
const STALLED_SUFFIX = " Filling is paused until the next pan or zoom.";
/** Item B string, RULED 2026-09-05 (24(b) string sight) -- the human's own wording, applied verbatim:
 * appended to the ordinary over-budget sentence only when `settledState` reads `"settled-partial"` --
 * mutually exclusive with `STALLED_SUFFIX` above by construction (a settled reading requires
 * `trackedTileCount === 0`; a stalled reading requires `queuedCount > 0`, which requires
 * `trackedTileCount > 0`), so the two never compete for the same sentence. States the fill's own
 * quiescence AND that the reason is the render budget, never a total or a completeness claim (BS6). */
const SETTLED_PARTIAL_SUFFIX = " Filling has finished for this view — the render budget is full; pan or zoom to see other areas.";
/** Piece 2(ii) draft (24(b) sight, entry 36): the failure-partial state's OWN distinct wording -- never
 * `SETTLED_PARTIAL_SUFFIX` above, whose "the render budget is full" claim is budget-only and would be
 * false here (`settledState`'s own doc comment: `hasCoveringFailure` is only ever consulted when
 * `fillComplete` is otherwise false for a NON-budget reason). Rendered as a complete sentence on the
 * WITHIN-budget event (never appended as a suffix -- nothing here is "the ordinary over-budget
 * sentence" to append to), since the render budget was never the issue. */
const SETTLED_PARTIAL_FAILURE_TEXT = "Filling has finished for this view, but part of it failed to load; pan or zoom to retry.";
/** Item A draft (24(b) sight), RULED 2026-09-05 (24(b) string sight, "not fetched" -> "not loaded",
 * rest verbatim): 32a's own rider -- never "complete", never silent. */
function relinquishedText(residentFeatureCount: number): string {
  return `Filling stopped — showing ${residentFeatureCount} features already loaded; the rest of this view was not loaded.`;
}
/** M1 draft (24(b) sight), REWORDED 2026-09-05 per entry 35's own string-3 reachability re-check (see
 * this file's own doc comment on `residencyStatusText`, above, for the full account): the honest
 * alternative when the untiled first-look/reissue stream is still running at relinquish time -- now
 * reachable ONLY in the frameless window, so this names the frame's own absence, never "the initial
 * data load" (a frameless Apply/Clear reissue racing the first look's own terminal is not "initial"). */
function relinquishedUntiledStillRunningText(residentFeatureCount: number): string {
  return `Tile filling stopped — showing ${residentFeatureCount} features already loaded; the data load for this view is still running and Cancel does not stop it while the view's frame is not yet established.`;
}

export function residencyStatusText(status: ResidencyStatus): string {
  switch (status.kind) {
    case "baseline-ceiling":
      return `${status.residentFeatureCount} of ${status.datasetRowCount} features rendered — declared ceiling reached (MAX_RESIDENT_VERTICES)`;
    case "candidate-within-budget":
      // Piece 2(ii) (residency-debt cut 1b, entry 36): the failure-partial reading gets its OWN
      // complete sentence -- never the "Showing all N" claim, which would be false over a set a
      // covering-tile (or the untiled) stream genuinely failed for (BS6).
      if (status.settled === "partial-failure") return SETTLED_PARTIAL_FAILURE_TEXT;
      return `Showing all ${status.residentFeatureCount} features in view`;
    case "candidate-over-budget": {
      const base =
        status.viewportTotal !== null
          ? `Showing ${status.residentFeatureCount} of ~${status.viewportTotal} features — areas farthest from view are not drawn, to stay within the render budget. Pan or zoom in to see them.`
          : `Showing ${status.residentFeatureCount} features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail.`;
      // Item B: mutually exclusive by construction (this type's own doc comment) -- `stalled` checked
      // first only because it was written first; either order is equivalent since both can never be
      // true on the same event.
      if (status.stalled) return `${base}${STALLED_SUFFIX}`;
      if (status.settled === "partial") return `${base}${SETTLED_PARTIAL_SUFFIX}`;
      return base;
    }
    case "candidate-relinquished":
      return status.untiledStreamStillRunning
        ? relinquishedUntiledStillRunningText(status.residentFeatureCount)
        : relinquishedText(status.residentFeatureCount);
  }
}
