// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { ResidentBatch } from "./decodeBatch";
import { planTileEviction, TileResidentSet } from "./tileResidentSet";

function batch(streamHandle: string, batchSeq: number, ids: number[], verticesPerFeature = 1): ResidentBatch {
  const idArray = new BigUint64Array(ids.map(BigInt));
  const rings = ids.map(() => [Array.from({ length: verticesPerFeature }, () => [0, 0] as [number, number])]);
  return {
    streamHandle,
    batchSeq,
    ids: idArray,
    rings,
    totalVertices: ids.length * verticesPerFeature,
  };
}

describe("TileResidentSet: per-tile bookkeeping", () => {
  it("accumulates vertex/feature totals across tiles", () => {
    const set = new TileResidentSet();
    set.addBatch("0:0", batch("sh_a", 0, [1, 2, 3]));
    set.addBatch("0:1", batch("sh_b", 0, [4, 5]));
    expect(set.totalResidentVertices).toBe(5);
    expect(set.totalResidentFeatures).toBe(5);
    expect(set.getBatches()).toHaveLength(2);
  });

  it("isTileResident is true only for tiles that were ingested (even if trivially empty)", () => {
    const set = new TileResidentSet();
    expect(set.isTileResident("0:0")).toBe(false);
    set.markTileResidentEmpty("0:0");
    expect(set.isTileResident("0:0")).toBe(true);
  });

  it("addBatch marks its own tile resident", () => {
    const set = new TileResidentSet();
    set.addBatch("2:3", batch("sh_a", 0, [1]));
    expect(set.isTileResident("2:3")).toBe(true);
  });
});

describe("TileResidentSet: cross-tile dedupe by stable feature id (item C)", () => {
  it("a feature id already resident via tile A is dropped when it arrives again via tile B, counted", () => {
    const set = new TileResidentSet();
    const resultA = set.addBatch("0:0", batch("sh_a", 0, [100, 101]));
    expect(resultA.duplicatesDropped).toBe(0);
    expect(resultA.accepted?.ids.length).toBe(2);

    // The misaligned-grid case: the SAME feature id (100) also intersects tile B's own bbox and
    // arrives there too.
    const resultB = set.addBatch("0:1", batch("sh_b", 0, [100, 102]));
    expect(resultB.duplicatesDropped).toBe(1);
    expect(resultB.accepted?.ids.length).toBe(1);
    expect(resultB.accepted?.ids[0]).toBe(102n);

    // Exactly one resident copy of id 100 -- not two.
    expect(set.totalResidentFeatures).toBe(3); // 100, 101, 102
  });

  it("a batch that is ENTIRELY duplicate rows is dropped in full -- accepted is null", () => {
    const set = new TileResidentSet();
    set.addBatch("0:0", batch("sh_a", 0, [1, 2]));
    const result = set.addBatch("0:1", batch("sh_b", 0, [1, 2]));
    expect(result.accepted).toBeNull();
    expect(result.duplicatesDropped).toBe(2);
    // The tile is still marked resident even though nothing new landed in it.
    expect(set.isTileResident("0:1")).toBe(true);
    expect(set.totalResidentFeatures).toBe(2);
  });

  it("a batch with no duplicates at all is accepted unchanged (identity fast path)", () => {
    const set = new TileResidentSet();
    const b = batch("sh_a", 0, [1, 2, 3]);
    const result = set.addBatch("0:0", b);
    expect(result.duplicatesDropped).toBe(0);
    expect(result.accepted).toBe(b);
  });
});

describe("TileResidentSet: eviction apply (evictTile)", () => {
  it("drops a tile's batches, vertex/feature totals, and its ids from the dedupe set", () => {
    const set = new TileResidentSet();
    set.addBatch("0:0", batch("sh_a", 0, [1, 2]));
    set.addBatch("0:1", batch("sh_b", 0, [3]));
    set.evictTile("0:0");

    expect(set.isTileResident("0:0")).toBe(false);
    expect(set.totalResidentFeatures).toBe(1);
    expect(set.totalResidentVertices).toBe(1);
    expect(set.getBatches()).toHaveLength(1);

    // The evicted tile's ids are no longer "known" -- a later re-fetch is treated as new data.
    const reAdd = set.addBatch("0:0", batch("sh_c", 0, [1, 2]));
    expect(reAdd.duplicatesDropped).toBe(0);
    expect(reAdd.accepted?.ids.length).toBe(2);
  });

  it("evicting an unknown tile is a harmless no-op", () => {
    const set = new TileResidentSet();
    expect(() => set.evictTile("9:9")).not.toThrow();
  });
});

describe("TileResidentSet: clear", () => {
  it("empties everything, including the dedupe set", () => {
    const set = new TileResidentSet();
    set.addBatch("0:0", batch("sh_a", 0, [1]));
    set.clear();
    expect(set.totalResidentVertices).toBe(0);
    expect(set.totalResidentFeatures).toBe(0);
    expect(set.getBatches()).toHaveLength(0);
    expect(set.isTileResident("0:0")).toBe(false);
  });
});

describe("planTileEviction (item D)", () => {
  const distances: Record<string, number> = { a: 10, b: 50, c: 100, viewport: 5 };
  function distanceToViewCentre(key: string): number {
    return distances[key];
  }

  it("plans nothing when the incoming batch already fits", () => {
    const plan = planTileEviction({
      residentTileKeys: ["a", "b"],
      tileVertices: () => 100,
      viewportTileKeys: new Set(),
      incomingVertices: 50,
      currentTotalVertices: 100,
      maxResidentVertices: 1000,
      distanceToViewCentre,
    });
    expect(plan).toEqual({ evict: [], overBudget: false });
  });

  it("evicts the farthest tiles first until the incoming batch fits", () => {
    const plan = planTileEviction({
      residentTileKeys: ["a", "b", "c"],
      tileVertices: () => 40,
      viewportTileKeys: new Set(),
      incomingVertices: 30,
      currentTotalVertices: 100, // a+b+c = 120, total = 100 (no overlap in this synthetic scenario)
      maxResidentVertices: 100,
      distanceToViewCentre,
    });
    // currentTotal(100) + incoming(30) = 130 > 100 -- evict farthest ("c", dist 100) first: 130-40=90 <= 100, done.
    expect(plan.evict).toEqual(["c"]);
    expect(plan.overBudget).toBe(false);
  });

  it("never evicts a tile intersecting the current viewport, however far the budget overshoots", () => {
    const plan = planTileEviction({
      residentTileKeys: ["viewport", "a"],
      tileVertices: () => 1000,
      viewportTileKeys: new Set(["viewport"]),
      incomingVertices: 500,
      currentTotalVertices: 2000,
      maxResidentVertices: 100,
      distanceToViewCentre,
    });
    expect(plan.evict).not.toContain("viewport");
  });

  it("sets overBudget when evicting every evictable tile still cannot make room (the viewport's own tiles exceed the budget)", () => {
    const plan = planTileEviction({
      residentTileKeys: ["viewport"],
      tileVertices: () => 5000,
      viewportTileKeys: new Set(["viewport"]),
      incomingVertices: 500,
      currentTotalVertices: 5000,
      maxResidentVertices: 1000,
      distanceToViewCentre,
    });
    expect(plan.evict).toEqual([]); // nothing evictable -- the only resident tile IS the viewport
    expect(plan.overBudget).toBe(true);
  });

  it("orders eviction strictly by distance, farthest first, among multiple evictable tiles", () => {
    const plan = planTileEviction({
      residentTileKeys: ["a", "b", "c"], // distances 10, 50, 100
      tileVertices: () => 10,
      viewportTileKeys: new Set(),
      incomingVertices: 1000,
      currentTotalVertices: 30,
      maxResidentVertices: 40,
      distanceToViewCentre,
    });
    // Needs to evict all three to fit (30+1000 way over 40) -- order must be c, b, a.
    expect(plan.evict).toEqual(["c", "b", "a"]);
  });
});
