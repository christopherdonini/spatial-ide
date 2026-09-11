// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

/**
 * Console-only diagnostic instrumentation (Custodian walkthrough finding, `frontends/shell` cut
 * 1): the render path had no visibility into where geometry that should be on screen was actually
 * going missing. Dumps `describe`'s bounds, every `viewport_query`'s bbox, per-stream batch/row/
 * vertex counts, the layer's position count on each update, the camera's target/zoom, and a small
 * sample of decoded positions both pre- and post-offset -- enough to tell decode failure,
 * double-offsetting and NaN corruption apart from each other and from "no data arrived at all"
 * without re-instrumenting ad hoc every time.
 *
 * **Not persisted** -- `diagnostics/log.ts`'s `logSessionEvent` is the sink for that. This is for
 * a live devtools console during a walkthrough, deliberately terse per call (one line per batch or
 * view-state change, never per vertex) so it stays usable at the volume a real session produces.
 */
const PREFIX = "[render-trace]";

export function traceDescribeBounds(dataset: string, extent: { basis: string; value: unknown }): void {
  console.debug(PREFIX, "describe.extent", { dataset, basis: extent.basis, value: extent.value });
}

export function traceViewportQuery(dataset: string, bbox: unknown, bboxCrs: string | null): void {
  console.debug(PREFIX, "viewport_query", { dataset, bbox, bboxCrs });
}

/** NEXT-CUT.md P6 reviewer gate, should-fix 3: a sibling to `traceViewportQuery` above, logged at the
 * moment a ticket actually mints (`ViewportStreamManager.requestViewport`, right before it returns
 * `{kind:"issued", streamHandle}`) -- `traceViewportQuery` itself fires before the mint, so it never
 * carries a handle. Gives `e2e/filter-panel.mjs`'s `SLOW'/CANCEL'` step a real pre-batch reference
 * for the handle it asserts zero `[render-trace] batch` lines against, retiring the "true by
 * construction" weakness of trusting only the handle `queryWithFilter`'s own return value carried. */
export function traceStreamIssued(dataset: string, streamHandle: string): void {
  console.debug(PREFIX, "stream-issued", { dataset, streamHandle });
}

export function traceStreamBatch(
  streamHandle: string,
  batchSeq: number,
  rows: number,
  vertices: number,
  cumulativeRows: number,
  cumulativeVertices: number
): void {
  console.debug(PREFIX, "batch", { streamHandle, batchSeq, rows, vertices, cumulativeRows, cumulativeVertices });
}

export function traceLayerUpdate(layerCount: number, totalPositions: number): void {
  console.debug(PREFIX, "layers", { layerCount, totalPositions });
}

export function traceViewState(targetX: number, targetY: number, zoom: number, originX: number, originY: number): void {
  console.debug(PREFIX, "view-state", { targetX, targetY, zoom, originX, originY });
}

/**
 * **D9 (entry 47, `frontends/shell/HOVER-REPICK-PREREGISTRATION.md`): the re-pick a camera settle
 * produced, and what it resolved to.** Sits beside `traceViewState` above deliberately -- a settle
 * re-pick always follows the camera changes that armed it, so a reader of one console stream sees
 * `view-state` lines, then this line naming the readout the operator was actually given at that
 * camera.
 *
 * `resolved` is that readout in the operator's own terms: `id <stable id>`, the named
 * below-pick-resolution refusal, or `cleared` (nothing resolved under the stored pixel). The event
 * name is `readout_confirmed` -- one of three instants entry 47's preregistration names for itself
 * (`camera_change_seen`, `camera_settled`, `readout_confirmed`). **These are that document's own
 * vocabulary, an extension of ADR-018's discipline, NOT ADR-018's own three names**, and this line
 * carries no timing figure of any kind, by construction.
 *
 * **Not sufficient on its own, and never treated as if it were**: this line is emitted by the same
 * code whose behaviour it describes, so the E2E contract that rests on it (`e2e/regression.mjs`'s
 * `stepK6`) also carries a case whose correct answer is a DIFFERENT id or an absence -- an
 * implementation that emitted this line while re-asserting a retained id fails that case.
 */
export function traceReadoutConfirmed(resolved: string, zoom: number): void {
  console.debug(PREFIX, "readout_confirmed", "camera-settle-repick", resolved, { zoom });
}

/** DECISIONS-PENDING.md entry 0's residency ledger: every `ResidentSet` mutation attempt, in
 * `WorkingCanvas.pushBatch`/`clearStream`. `residentTotalAfter` is the attempted (not necessarily
 * applied) total on a `"push"` -- the same number whether admitted or refused, since
 * `ResidentSet.addBatch` computes and compares that one value before deciding either way -- so a
 * refused attempt still leaves a ledger line naming the total it was refused at. `batchSeq` is
 * `null` for `"clear"` (a whole-stream event, not one batch). */
export function traceResidency(
  event: "push" | "clear",
  streamHandle: string,
  batchSeq: number | null,
  vertexDelta: number,
  residentTotalBefore: number,
  residentTotalAfter: number,
  refused: boolean
): void {
  console.debug(PREFIX, "residency", { event, streamHandle, batchSeq, vertexDelta, residentTotalBefore, residentTotalAfter, refused });
}

/** Viewport-residency cut P3w items C/D: one line per candidate-arm tile batch ingest --
 * `tileResidentSet.ts`'s own dedupe (`duplicatesDropped`) and `tileIngest.ts`'s own eviction/budget
 * decision (`evictedTileKeys`, `overBudget`), console-visible the same way `traceResidency` already
 * makes baseline's ledger visible.
 *
 * P5f complex-gate should-fix 6 (superseding the prior "never gated" framing this comment used to
 * carry): the CALL SITE (`WorkingCanvas.tsx`'s `pushTileBatch`) now gates this behind
 * `isInstrumentedBuild()`, unlike every other function in this file -- one line per tile batch is a
 * real trace-volume cost non-instrumented builds never needed, and this event's own kind
 * (`"tile-ingest"`) is not one of `residency-harness.mjs`'s own `FIELD_SEQUENCE_EVENTS`
 * (`["viewport_query", "stream-issued", "batch"]`), so gating it does not change what the dual-arm
 * identity guard compares. This function itself is unchanged (still an unconditional `console.debug`
 * -- the gate lives at the call site, matching how `instrument/residencyInstrument.ts`'s own
 * `record*` functions are always gated by their CALLERS, never internally). */
export function traceTileIngest(
  tileKey: string,
  rowsAdmitted: number,
  duplicatesDropped: number,
  evictedTileKeys: readonly string[],
  overBudget: boolean
): void {
  console.debug(PREFIX, "tile-ingest", { tileKey, rowsAdmitted, duplicatesDropped, evictedTileKeys, overBudget });
}

/** Viewport-residency cut P4 (decisions 24(a)/(b)), item C: one line per candidate-arm
 * `.residency-status` recomputation (`candidateArmSession.ts`'s own `emitResidencyStatus`) --
 * `evictedTileCountSession` is the SESSION-CUMULATIVE eviction count (not one batch's own
 * `evictedTileKeys.length`, which `traceTileIngest` above already carries per call), so a
 * diagnosis session can read "how many tiles has this whole session evicted so far" off one line
 * rather than summing every `tile-ingest` line itself. This is the console-only diagnostic
 * counterpart to the user-facing `.residency-status` text (item C's own words: "the status line IS
 * the visibility -- no tile readout"), never a second UI surface.
 *
 * P5f complex-gate should-fix 6: the CALL SITE (`candidateArmSession.ts`'s `emitResidencyStatus`) now
 * gates this behind `isInstrumentedBuild()`, matching `traceTileIngest`'s own identical fix above and
 * for the same reason -- this event's own kind (`"candidate-residency-status"`) is not one of
 * `residency-harness.mjs`'s own `FIELD_SEQUENCE_EVENTS`, so gating it does not change the dual-arm
 * identity guard's own coverage. */
export function traceCandidateResidencyStatus(
  dataset: string,
  overBudget: boolean,
  residentFeatureCount: number,
  evictedTileCountSession: number
): void {
  console.debug(PREFIX, "candidate-residency-status", { dataset, overBudget, residentFeatureCount, evictedTileCountSession });
}

/** Close-out fix piece F2 (entry 43): ONE always-on line per truncating plan -- a covering set
 * beyond `MAX_QUEUED_TILES`'s own issuing/queueing capacity, farthest-from-view-centre-first
 * (`TileViewportStreamManager.onCameraChange`'s own `coveringTruncated`/`truncatedCount`,
 * `tileViewportStreamManager.ts`). Unconditional, never gated behind `isInstrumentedBuild()` --
 * mirrors this file's own always-on precedent (`traceViewportQuery`'s own call site,
 * `tileViewportStreamManager.ts:574`, "always-on render-trace (never instrument-gated)" per that
 * call site's own comment), unlike `traceTileIngest`/`traceCandidateResidencyStatus` above, which
 * the CALL SITE gates. **This is test/console OBSERVABILITY only, never the operator disclosure** --
 * entry 43's own operator-facing fix is the settled-partial status line itself
 * (`residencyStatus.ts`'s `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`), surfaced through
 * `candidateArmSession.ts`'s own `emitResidencyStatus`; this line exists so a session log / live
 * console can also see a truncating plan happened, alongside the pre-existing
 * `logSessionEvent("candidate-covering-truncated", ...)` call this sits beside. */
export function traceCoveringTruncated(dataset: string, truncatedCount: number): void {
  console.debug(PREFIX, "covering-truncated", { dataset, truncatedCount });
}

/** One line per `WorkingCanvas` mount/unmount, naming the dataset handle it was keyed on (D4's
 * remount fix, `App.tsx`) -- lets a session's ledger show exactly how many canvas instances
 * existed and which dataset each owned, without inferring it from `"push"`/`"clear"` lines alone. */
export function traceCanvasLifecycle(event: "mount" | "unmount", dataset: string): void {
  console.debug(PREFIX, "canvas-lifecycle", { event, dataset });
}

/** `positions` is `[x, y]` pairs, at most 3 -- the caller decides which 3 (e.g. the first ring's
 * first three vertices), this only formats and logs what it is given. */
export function tracePositionsSample(
  label: "pre-offset" | "post-offset",
  streamHandle: string,
  batchSeq: number,
  positions: ReadonlyArray<readonly [number, number]>
): void {
  console.debug(PREFIX, label, {
    streamHandle,
    batchSeq,
    sample: positions.map(([x, y]) => `(${x}, ${y})`),
  });
}
