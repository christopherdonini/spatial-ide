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
