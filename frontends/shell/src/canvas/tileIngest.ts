// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";
import { EvictionPlan, planTileEviction, TileResidentSet } from "./tileResidentSet";
import { tileDistanceToPoint, TileGridFrame, TileKey } from "./tileGrid";
import type { TileGridLevel } from "./tileGridConstants";
import type { AuthoritativeBbox } from "./viewportBbox";

/**
 * Viewport-residency cut P3w item B: the candidate arm's own ingest DECISION, pulled out of
 * `WorkingCanvas.tsx`'s imperative handle into a pure, DI-free function -- the same testability
 * reason `applyStyleChange`/`admitAndResetStaleUiState` are pure functions in their own files
 * (`WorkingCanvas`'s real `Deck` construction needs a WebGL context jsdom does not provide, so
 * nothing that needs a live canvas can be unit-tested directly; everything that does NOT need one
 * lives here instead). `WorkingCanvas.tsx`'s own `pushTileBatch` method is a thin wrapper: decode,
 * call `ingestTileBatch`, `render()`.
 */

/** `tileGrid.ts`'s own `tileKeyToString` is one-way by design ("there is no `tileKeyFromString`;
 * nothing needs to parse this back") -- eviction ordering here is the one place that genuinely
 * does, since `TileResidentSet` only ever stores the STRING form. A local, minimal parse of that
 * same stable `"${row}:${col}"` format, not exported from `tileGrid.ts` itself. */
function parseTileKey(key: string): TileKey {
  const [row, col] = key.split(":").map(Number);
  return { row, col };
}

export interface TileGridContext {
  frame: TileGridFrame;
  level: TileGridLevel;
}

export interface TileBatchIngestResult {
  /** Rows/features this call actually admitted into `tileSet` -- `0` when every row was either a
   * cross-tile duplicate (item C) or trimmed away by the budget boundary (item D). */
  rowsAdmitted: number;
  duplicatesDropped: number;
  /** Tile keys evicted (farthest-from-view-centre first, `planTileEviction`'s own order) to make
   * room for this batch, if any. */
  evictedTileKeys: string[];
  /** True iff evicting every evictable tile still could not make room for this batch, so it was
   * trimmed to the remaining budget boundary rather than admitted whole (item D's own contract:
   * "accept up to the budget boundary" -- never the baseline's `ResidentVertexCeilingExceeded`
   * refusal, which this function never throws or references). */
  overBudget: boolean;
  /** The dataset-lifetime union of every batch extent this tile set has ever admitted, unioned with
   * this batch's own extent -- mirrors `WorkingCanvas.tsx`'s own `fitAnchorRef` accumulation
   * (`tileGrid.ts`'s own top doc comment: "the same anchor `WorkingCanvas.tsx`'s `fitAnchorRef`
   * already accumulates"). Provided so a caller (`WorkingCanvas.tsx`) can feed it straight into that
   * same ref rather than this function reaching into React state itself. `null` only when this
   * batch AND every prior one carried no geometry at all. */
  unionedExtent: AuthoritativeBbox | null;
}

/**
 * The item-B/item-D ingest decision for one batch, tagged with the tile key its stream was issued
 * for: budget check (`planTileEviction`) BEFORE admission, apply any resulting eviction, trim the
 * batch to the remaining budget boundary if eviction alone could not make room, then admit via
 * `tileSet.addBatch` (which performs item C's own cross-tile dedupe internally, unconditionally).
 *
 * **Ordering note, disclosed:** the budget check runs against the batch's OWN (undeduped)
 * `totalVertices` -- exactly item B's own wording ("a batch that would exceed MAX_RESIDENT_VERTICES"
 * names the incoming batch, not its post-dedupe remainder, since dedupe is `addBatch`'s own internal
 * concern and this function trims BEFORE handing anything to it). A trimmed-in feature that later
 * turns out to be a cross-tile duplicate is "wasted" budget room that could in principle have gone to
 * a later, non-duplicate feature in the same batch -- a real but minor inefficiency, not a
 * correctness gap: the declared ceiling is never exceeded either way.
 *
 * `grid` is `null` until `TileViewportStreamManager.establishGridFrame` has run at least once this
 * session (`WorkingCanvas.tsx`'s own `establishTileGridContext` call) -- eviction cannot be ordered
 * by distance without a frame/level to derive tile centres from. A batch arriving before that (should
 * not happen in practice: the very first stream IS what establishes the frame) still cannot be left
 * to silently exceed the ceiling, so it is trimmed to budget with no eviction attempted.
 */
export function ingestTileBatch(params: {
  tileSet: TileResidentSet;
  tileKey: string;
  batch: ResidentBatch;
  grid: TileGridContext | null;
  viewportTileKeys: ReadonlySet<string>;
  viewCentre: { x: number; y: number };
  maxResidentVertices: number;
  priorExtent: AuthoritativeBbox | null;
  extentOfBatch: (batch: Pick<ResidentBatch, "rings">) => AuthoritativeBbox | null;
  unionBbox: (a: AuthoritativeBbox | null, b: AuthoritativeBbox | null) => AuthoritativeBbox | null;
}): TileBatchIngestResult {
  const { tileSet, tileKey, batch, grid, viewportTileKeys, viewCentre, maxResidentVertices } = params;

  let evictedTileKeys: string[] = [];
  let overBudget = false;
  let toAdmit = batch;

  const projected = tileSet.totalResidentVertices + batch.totalVertices;
  if (projected > maxResidentVertices) {
    if (grid) {
      const plan: EvictionPlan = planTileEviction({
        residentTileKeys: tileSet.residentTileKeys(),
        tileVertices: (k) => tileSet.tileVertexCount(k),
        viewportTileKeys,
        incomingVertices: batch.totalVertices,
        currentTotalVertices: tileSet.totalResidentVertices,
        maxResidentVertices,
        distanceToViewCentre: (k) => tileDistanceToPoint(grid.frame, grid.level, parseTileKey(k), viewCentre),
      });
      for (const key of plan.evict) {
        tileSet.evictTile(key);
      }
      evictedTileKeys = plan.evict;
      overBudget = plan.overBudget;
    } else {
      // No frame yet to order eviction by -- nothing evictable is identified, so this degrades
      // straight to "truncate at budget" rather than ever exceeding the declared ceiling.
      overBudget = true;
    }
    if (overBudget) {
      const remaining = Math.max(0, maxResidentVertices - tileSet.totalResidentVertices);
      toAdmit = trimBatchToVertexBudget(batch, remaining);
    }
  }

  const result = tileSet.addBatch(tileKey, toAdmit);
  const unionedExtent = params.unionBbox(params.priorExtent, params.extentOfBatch(batch));

  return {
    rowsAdmitted: result.accepted?.ids.length ?? 0,
    duplicatesDropped: result.duplicatesDropped,
    evictedTileKeys,
    overBudget,
    unionedExtent,
  };
}

/**
 * The largest PREFIX of `batch` (by feature index -- the same "ids and rings built together, one
 * pass" discipline `decodeBatch.ts`'s own `ResidentBatch` doc comment names) whose cumulative vertex
 * count does not exceed `remainingVertices`. A feature is included only whole -- there is no
 * per-vertex truncation of an individual polygon's own rings, since a ring/feature is `decodeBatch`'s
 * own atomic unit (rule 2: "any cull, chunk, sort or LOD [that] desyncs an ordinal from its identity"
 * is the hazard building `ids`/`rings` together in one pass exists to avoid; slicing a `ResidentBatch`
 * by feature index preserves that pairing exactly). `remainingVertices <= 0` yields an empty batch,
 * never a negative-length slice.
 */
export function trimBatchToVertexBudget(batch: ResidentBatch, remainingVertices: number): ResidentBatch {
  let vertices = 0;
  let count = 0;
  while (count < batch.ids.length) {
    let featureVertices = 0;
    for (const ring of batch.rings[count]) {
      featureVertices += ring.length;
    }
    if (vertices + featureVertices > remainingVertices) break;
    vertices += featureVertices;
    count++;
  }
  return {
    streamHandle: batch.streamHandle,
    batchSeq: batch.batchSeq,
    ids: batch.ids.slice(0, count),
    rings: batch.rings.slice(0, count),
    totalVertices: vertices,
  };
}
