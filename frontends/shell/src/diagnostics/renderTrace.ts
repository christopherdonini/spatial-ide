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
