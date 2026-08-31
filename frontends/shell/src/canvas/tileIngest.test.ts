// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { ResidentBatch } from "./decodeBatch";
import { extentOfBatch, unionBbox } from "./extent";
import { deriveTileGridFrame } from "./tileGrid";
import { TileResidentSet } from "./tileResidentSet";
import { ingestTileBatch, trimBatchToVertexBudget } from "./tileIngest";

function batch(streamHandle: string, batchSeq: number, ids: number[], verticesPerFeature = 1): ResidentBatch {
  const idArray = new BigUint64Array(ids.map(BigInt));
  const rings = ids.map(() => [Array.from({ length: verticesPerFeature }, (_, i) => [i, 0] as [number, number])]);
  return {
    streamHandle,
    batchSeq,
    ids: idArray,
    rings,
    totalVertices: ids.length * verticesPerFeature,
  };
}

const GRID = { frame: deriveTileGridFrame({ xmin: 0, ymin: 0, xmax: 100, ymax: 100 }), level: "medium" as const };

function baseParams(overrides: Partial<Parameters<typeof ingestTileBatch>[0]> = {}) {
  return {
    tileSet: new TileResidentSet(),
    tileKey: "0:0",
    batch: batch("sh_a", 0, [1, 2, 3]),
    grid: GRID,
    viewportTileKeys: new Set<string>(),
    viewCentre: { x: 0, y: 0 },
    maxResidentVertices: 2_000_000,
    priorExtent: null,
    extentOfBatch,
    unionBbox,
    ...overrides,
  };
}

describe("trimBatchToVertexBudget", () => {
  it("keeps the largest whole-feature prefix that fits", () => {
    const b = batch("sh_a", 0, [1, 2, 3], 10); // 10 vertices/feature, 30 total
    const trimmed = trimBatchToVertexBudget(b, 25);
    expect(trimmed.ids.length).toBe(2); // only 2 features fit (20 <= 25, 30 > 25)
    expect(trimmed.totalVertices).toBe(20);
  });

  it("remainingVertices <= 0 yields an empty batch, never negative-length", () => {
    const b = batch("sh_a", 0, [1, 2], 5);
    const trimmed = trimBatchToVertexBudget(b, 0);
    expect(trimmed.ids.length).toBe(0);
    expect(trimmed.totalVertices).toBe(0);
  });

  it("a whole batch that already fits is returned unchanged in content", () => {
    const b = batch("sh_a", 0, [1, 2, 3], 2);
    const trimmed = trimBatchToVertexBudget(b, 1000);
    expect(trimmed.ids.length).toBe(3);
    expect(trimmed.totalVertices).toBe(6);
  });
});

describe("ingestTileBatch: item C dedupe across tiles", () => {
  it("a feature already resident via another tile is dropped, counted, never double-admitted", () => {
    const tileSet = new TileResidentSet();
    ingestTileBatch(baseParams({ tileSet, tileKey: "0:0", batch: batch("sh_a", 0, [100, 101]) }));
    const second = ingestTileBatch(
      baseParams({ tileSet, tileKey: "0:1", batch: batch("sh_b", 0, [100, 102]) })
    );
    expect(second.duplicatesDropped).toBe(1);
    expect(second.rowsAdmitted).toBe(1);
    expect(tileSet.totalResidentFeatures).toBe(3);
  });
});

describe("ingestTileBatch: item D eviction at the budget boundary", () => {
  it("evicts the farthest non-viewport tile to make room, admits the incoming batch whole", () => {
    const tileSet = new TileResidentSet();
    // Tile far from the view centre -- fills most of a small budget.
    ingestTileBatch(
      baseParams({
        tileSet,
        tileKey: "10:10",
        batch: batch("sh_far", 0, [1, 2, 3, 4, 5], 100), // 500 vertices
        maxResidentVertices: 900,
        viewCentre: { x: 0, y: 0 },
      })
    );
    expect(tileSet.totalResidentVertices).toBe(500);

    // A new tile, close to the view centre, arrives with a batch that would overflow the budget
    // (500 + 500 = 1000 > 900) unless the far tile is evicted.
    const result = ingestTileBatch(
      baseParams({
        tileSet,
        tileKey: "0:0",
        batch: batch("sh_near", 0, [6, 7, 8, 9, 10], 100), // 500 vertices
        maxResidentVertices: 900,
        viewportTileKeys: new Set(["0:0"]),
        viewCentre: { x: 0, y: 0 },
      })
    );

    expect(result.evictedTileKeys).toEqual(["10:10"]);
    expect(result.overBudget).toBe(false);
    expect(result.rowsAdmitted).toBe(5);
    expect(tileSet.isTileResident("10:10")).toBe(false);
    expect(tileSet.totalResidentVertices).toBe(500);
  });

  it("never evicts a tile intersecting the current viewport, even to make room", () => {
    const tileSet = new TileResidentSet();
    ingestTileBatch(
      baseParams({
        tileSet,
        tileKey: "0:0",
        batch: batch("sh_view", 0, [1, 2, 3, 4, 5], 100), // 500 vertices, IS the viewport
        maxResidentVertices: 900,
      })
    );

    const result = ingestTileBatch(
      baseParams({
        tileSet,
        tileKey: "5:5",
        batch: batch("sh_new", 0, [6, 7, 8, 9, 10], 100), // another 500 vertices -- 500+500=1000 > 900
        maxResidentVertices: 900,
        viewportTileKeys: new Set(["0:0"]), // the ONLY resident tile is protected
      })
    );

    // Nothing evictable -- "0:0" is the current viewport and the only resident tile.
    expect(result.evictedTileKeys).toEqual([]);
    expect(result.overBudget).toBe(true);
    expect(tileSet.isTileResident("0:0")).toBe(true);
  });

  it("when full eviction of everything evictable still cannot make room, truncates the incoming batch at the boundary", () => {
    const tileSet = new TileResidentSet();
    // "0:0" (the viewport, never evicted, 500 vertices) + "1:1" (evictable, 200 vertices) = 700 resident.
    ingestTileBatch(
      baseParams({
        tileSet,
        tileKey: "0:0",
        batch: batch("sh_view", 0, [1, 2, 3, 4, 5], 100),
        maxResidentVertices: 900,
      })
    );
    ingestTileBatch(
      baseParams({
        tileSet,
        tileKey: "1:1",
        batch: batch("sh_far", 0, [6, 7], 100),
        maxResidentVertices: 900,
        viewportTileKeys: new Set(["0:0"]),
      })
    );
    expect(tileSet.totalResidentVertices).toBe(700);

    // Incoming: 500 vertices (5 features @ 100). projected = 700 + 500 = 1200 > 900. Evicting the
    // ONLY evictable tile ("1:1", 200) still leaves 1000 > 900 -- eviction alone cannot make room,
    // so the remaining 400 (900 - 500 resident-after-eviction) trims the incoming batch to 4 features.
    const result = ingestTileBatch(
      baseParams({
        tileSet,
        tileKey: "5:5",
        batch: batch("sh_over", 0, [11, 12, 13, 14, 15], 100),
        maxResidentVertices: 900,
        viewportTileKeys: new Set(["0:0"]),
      })
    );

    expect(result.evictedTileKeys).toEqual(["1:1"]);
    expect(result.overBudget).toBe(true);
    expect(result.rowsAdmitted).toBe(4); // 400 remaining budget / 100 per feature
    expect(tileSet.totalResidentVertices).toBe(900); // ceiling never exceeded
    expect(tileSet.isTileResident("1:1")).toBe(false);
  });

  it("with no grid context yet, degrades to truncate-at-budget rather than exceeding the ceiling", () => {
    const tileSet = new TileResidentSet();
    const result = ingestTileBatch(
      baseParams({
        tileSet,
        tileKey: "0:0",
        batch: batch("sh_a", 0, [1, 2, 3, 4, 5], 100),
        maxResidentVertices: 300,
        grid: null,
      })
    );
    expect(result.overBudget).toBe(true);
    expect(tileSet.totalResidentVertices).toBeLessThanOrEqual(300);
  });
});

describe("ingestTileBatch: unionedExtent mirrors fitAnchorRef's own accumulation", () => {
  it("unions across calls and never shrinks", () => {
    const tileSet = new TileResidentSet();
    const rings = (x: number, y: number): ResidentBatch => ({
      streamHandle: "sh",
      batchSeq: 0,
      ids: new BigUint64Array([BigInt(1)]),
      rings: [[[[x, y]]]],
      totalVertices: 1,
    });
    const r1 = ingestTileBatch(baseParams({ tileSet, tileKey: "0:0", batch: rings(0, 0) }));
    expect(r1.unionedExtent).toEqual({ xmin: 0, ymin: 0, xmax: 0, ymax: 0 });
    const r2 = ingestTileBatch(
      baseParams({ tileSet, tileKey: "0:1", batch: rings(10, 10), priorExtent: r1.unionedExtent })
    );
    expect(r2.unionedExtent).toEqual({ xmin: 0, ymin: 0, xmax: 10, ymax: 10 });
  });
});
