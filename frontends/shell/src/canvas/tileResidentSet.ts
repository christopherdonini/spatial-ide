// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import type { ResidentBatch } from "./decodeBatch";

/**
 * Viewport-residency cut P3 items C/D: tile-keyed residency for the candidate arm -- a sibling to
 * `residentSet.ts`'s `ResidentSet` (baseline, stream-keyed), never imported by it, so arm="baseline"
 * never references this module (this piece's own bit-identity requirement). The candidate arm's
 * canvas-side owner (a later piece's WorkingCanvas wiring) decodes a batch exactly as it does today
 * (`decodeBatch`) and hands it to `addBatch` here alongside the tile key its stream was issued for.
 */

export interface TileIngestResult {
  /** The batch actually admitted, containing only rows whose id was not already resident via ANY
   * tile -- `null` when every row in the incoming batch was a duplicate (nothing new to render).
   * Never a partial reference into the original `ResidentBatch`: a genuinely new `BigUint64Array`/
   * `rings` array, so a caller can push it straight into a render layer the same way an ordinary
   * accepted batch already is. */
  accepted: ResidentBatch | null;
  /** Rows dropped because their id was already resident via a DIFFERENT tile (or the same one --
   * genuinely impossible today since `decodeBatch` never repeats an id within one batch, but not
   * assumed here either). The misaligned-grid test's own subject (NEXT-CUT.md P3 item C). */
  duplicatesDropped: number;
}

interface TileEntry {
  batches: ResidentBatch[];
  vertices: number;
  features: number;
}

/**
 * Cross-tile dedupe by stable feature id (item C) + distance-ordered eviction (item D), tracked per
 * tile key (`tileGrid.ts`'s own `tileKeyToString`). `totalResidentVertices`/`totalResidentFeatures`
 * mirror `ResidentSet`'s own getters, summed across every tile instead of every stream.
 */
export class TileResidentSet {
  private tiles = new Map<string, TileEntry>();
  /** Every feature id currently resident, via ANY tile -- the dedupe set item C's own contract
   * names ("a feature arriving in tile B that is already resident via tile A is dropped at
   * ingest"). Shrunk in lockstep with a tile's own eviction (`evictTile`), never left stale --
   * evicting a tile makes its ids available again for a later re-fetch of the same cell. */
  private knownIds = new Set<bigint>();
  private totalVertices = 0;
  private totalFeatures = 0;

  get totalResidentVertices(): number {
    return this.totalVertices;
  }

  get totalResidentFeatures(): number {
    return this.totalFeatures;
  }

  /** Whether `tileKey` has ever been ingested (via `addBatch` or `markTileResidentEmpty`) and not
   * since evicted -- planning's own "resident tiles are NOT re-requested" input
   * (`TileViewportStreamManager`'s `TileResidencyAccessor`). True even for a tile whose own delivery
   * turned out to carry zero (or entirely duplicate) rows -- it was still genuinely asked for and
   * answered, so asking again would be wasted work, not new data. */
  isTileResident(tileKey: string): boolean {
    return this.tiles.has(tileKey);
  }

  residentTileKeys(): string[] {
    return [...this.tiles.keys()];
  }

  tileVertexCount(tileKey: string): number {
    return this.tiles.get(tileKey)?.vertices ?? 0;
  }

  getBatches(): ResidentBatch[] {
    const out: ResidentBatch[] = [];
    for (const entry of this.tiles.values()) {
      out.push(...entry.batches);
    }
    return out;
  }

  /**
   * Adds a batch under `tileKey`, filtering out any row whose id is already resident via another
   * tile first (item C) -- `duplicatesDropped` counts them, `accepted` carries only the rest.
   * Ceiling enforcement is deliberately NOT here: item D's own eviction is a `MAX_RESIDENT_VERTICES`
   * decision that needs the CURRENT VIEW CENTRE (never evict a viewport tile) to pick which tiles to
   * free, which this class does not know on its own -- `planTileEviction` below is the pure decision
   * function a caller runs first (typically: attempt eviction, then call this only if evicting made
   * room, or accept over-budget per item D's own contract). This keeps `addBatch` itself a pure
   * bookkeeping operation, never a refusal.
   */
  addBatch(tileKey: string, batch: ResidentBatch): TileIngestResult {
    const keepIdx: number[] = [];
    let duplicatesDropped = 0;
    for (let i = 0; i < batch.ids.length; i++) {
      const id = batch.ids[i];
      if (this.knownIds.has(id)) {
        duplicatesDropped++;
      } else {
        keepIdx.push(i);
      }
    }

    this.markTileResidentEmpty(tileKey); // ingesting at all makes this tile resident, even if trimmed to nothing

    if (keepIdx.length === 0) {
      return { accepted: null, duplicatesDropped };
    }

    let trimmed: ResidentBatch;
    if (duplicatesDropped === 0) {
      trimmed = batch;
    } else {
      const ids = new BigUint64Array(keepIdx.length);
      const rings: ResidentBatch["rings"] = new Array(keepIdx.length);
      let totalVertices = 0;
      keepIdx.forEach((srcIdx, dstIdx) => {
        ids[dstIdx] = batch.ids[srcIdx];
        rings[dstIdx] = batch.rings[srcIdx];
        for (const ring of rings[dstIdx]) {
          totalVertices += ring.length;
        }
      });
      trimmed = { streamHandle: batch.streamHandle, batchSeq: batch.batchSeq, ids, rings, totalVertices };
    }

    for (const id of trimmed.ids) {
      this.knownIds.add(id);
    }
    const entry = this.tiles.get(tileKey)!; // set by markTileResidentEmpty above
    entry.batches.push(trimmed);
    entry.vertices += trimmed.totalVertices;
    entry.features += trimmed.ids.length;
    this.totalVertices += trimmed.totalVertices;
    this.totalFeatures += trimmed.ids.length;

    return { accepted: trimmed, duplicatesDropped };
  }

  /** Marks `tileKey` resident with no data of its own yet -- a stream whose own tile bbox genuinely
   * carries nothing (an empty delivery, or a delivery entirely deduped away) still counts as
   * "already have this tile" for planning purposes. A no-op if the tile is already tracked (via a
   * prior `addBatch` or an earlier call to this method). */
  markTileResidentEmpty(tileKey: string): void {
    if (!this.tiles.has(tileKey)) {
      this.tiles.set(tileKey, { batches: [], vertices: 0, features: 0 });
    }
  }

  /**
   * Distance-ordered eviction's own apply step (item D): drops `tileKey`'s whole residency --
   * batches, vertex/feature totals, AND every id it contributed to the cross-tile dedupe set. An
   * evicted tile is genuinely gone, not merely hidden: a later re-request for the same cell is
   * treated as new data, never silently deduped against its own former residency (which would make
   * a re-fetched tile render as empty forever).
   */
  evictTile(tileKey: string): void {
    const entry = this.tiles.get(tileKey);
    if (!entry) return;
    this.tiles.delete(tileKey);
    this.totalVertices -= entry.vertices;
    this.totalFeatures -= entry.features;
    for (const b of entry.batches) {
      for (const id of b.ids) {
        this.knownIds.delete(id);
      }
    }
  }

  clear(): void {
    this.tiles.clear();
    this.knownIds.clear();
    this.totalVertices = 0;
    this.totalFeatures = 0;
  }
}

export interface EvictionPlan {
  /** Tile keys to evict, farthest-from-view-centre first -- the order a caller should actually call
   * `TileResidentSet.evictTile` in (though nothing here requires stopping early; a caller may evict
   * every entry regardless of `overBudget`, since each further eviction only frees more room). */
  evict: string[];
  /** True iff evicting every EVICTABLE tile (every resident tile not in `viewportTileKeys`) still
   * would not make room for `incomingVertices` -- item D's own "the viewport's own tiles exceed the
   * budget" case. The caller accepts up to budget and marks the state over-budget WITHOUT the
   * baseline refusal path (never `ResidentVertexCeilingExceeded` here); this flag is exactly the
   * signal for that decision. */
  overBudget: boolean;
}

/**
 * The pure eviction DECISION (item D) -- never evicts a tile in `viewportTileKeys` (the current
 * viewport's own covering set), regardless of distance or budget: "never evict a tile intersecting
 * the current viewport" is absolute, not merely preferred. Ordered farthest-from-`viewCentre` first
 * via `distanceToViewCentre` (typically `tileGrid.ts`'s own `tileDistanceToPoint`, injected here so
 * this function stays free of any grid-frame/level knowledge of its own).
 */
export function planTileEviction(params: {
  /** Every currently resident tile this caller is willing to consider evicting from (typically
   * `TileResidentSet.residentTileKeys()`). */
  residentTileKeys: readonly string[];
  tileVertices: (tileKey: string) => number;
  /** Tiles the current viewport itself covers -- never evicted, however far the budget overshoots. */
  viewportTileKeys: ReadonlySet<string>;
  incomingVertices: number;
  currentTotalVertices: number;
  maxResidentVertices: number;
  distanceToViewCentre: (tileKey: string) => number;
}): EvictionPlan {
  const projectedNoEviction = params.currentTotalVertices + params.incomingVertices;
  if (projectedNoEviction <= params.maxResidentVertices) {
    return { evict: [], overBudget: false };
  }

  const evictable = params.residentTileKeys
    .filter((k) => !params.viewportTileKeys.has(k))
    .map((k) => ({ key: k, vertices: params.tileVertices(k), distance: params.distanceToViewCentre(k) }))
    .sort((a, b) => b.distance - a.distance);

  const evict: string[] = [];
  let projected = projectedNoEviction;
  for (const t of evictable) {
    if (projected <= params.maxResidentVertices) break;
    evict.push(t.key);
    projected -= t.vertices;
  }

  return { evict, overBudget: projected > params.maxResidentVertices };
}
