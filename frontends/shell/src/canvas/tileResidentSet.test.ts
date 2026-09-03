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

// Viewport-residency cut P6a, Defect A (architect gate, blocking): durable partiality as a property
// of the resident set itself, per ADR-028's appended clarification 2.
describe("TileResidentSet: durable partiality (Defect A)", () => {
  it("a tile with no batch ever admitted is neither resident, partial, nor complete", () => {
    const set = new TileResidentSet();
    expect(set.isTileResident("0:0")).toBe(false);
    expect(set.isTilePartial("0:0")).toBe(false);
    expect(set.isTileComplete("0:0")).toBe(false);
  });

  it("an ordinary (non-trimmed) addBatch leaves the tile complete, not partial", () => {
    const set = new TileResidentSet();
    set.addBatch("0:0", batch("sh_a", 0, [1, 2]));
    expect(set.isTilePartial("0:0")).toBe(false);
    expect(set.isTileComplete("0:0")).toBe(true);
  });

  it("addBatch(..., partial: true) marks the tile durably partial -- resident but not complete", () => {
    const set = new TileResidentSet();
    set.addBatch("0:0", batch("sh_a", 0, [1, 2]), true);
    expect(set.isTileResident("0:0")).toBe(true);
    expect(set.isTilePartial("0:0")).toBe(true);
    expect(set.isTileComplete("0:0")).toBe(false);
  });

  it("partial is sticky: a LATER non-partial addBatch to the same tile does not clear it", () => {
    const set = new TileResidentSet();
    set.addBatch("0:0", batch("sh_a", 0, [1]), true); // trimmed once -- partial
    set.addBatch("0:0", batch("sh_b", 0, [2]), false); // a later, whole batch for the same tile
    expect(set.isTilePartial("0:0")).toBe(true); // still partial -- nothing here proves recovery
  });

  it("markTilePartial marks an already-tracked tile without adding a batch (the mid-delivery-cancel case)", () => {
    const set = new TileResidentSet();
    set.markTileResidentEmpty("0:0");
    expect(set.isTilePartial("0:0")).toBe(false);
    set.markTilePartial("0:0");
    expect(set.isTilePartial("0:0")).toBe(true);
    expect(set.isTileComplete("0:0")).toBe(false);
  });

  it("markTilePartial is a no-op for a tile that was never tracked -- no phantom entry is created", () => {
    const set = new TileResidentSet();
    set.markTilePartial("9:9");
    expect(set.isTileResident("9:9")).toBe(false);
    expect(set.isTilePartial("9:9")).toBe(false);
  });

  it("evicting a partial tile and re-ingesting it fresh clears partial -- eviction is the only reset", () => {
    const set = new TileResidentSet();
    set.addBatch("0:0", batch("sh_a", 0, [1]), true);
    expect(set.isTilePartial("0:0")).toBe(true);
    set.evictTile("0:0");
    set.addBatch("0:0", batch("sh_b", 0, [1]), false);
    expect(set.isTilePartial("0:0")).toBe(false);
    expect(set.isTileComplete("0:0")).toBe(true);
  });

  // Viewport-residency cut P6d (the sticky-partial exit): a covering tile is eviction-protected, so
  // the ONLY reset above (evict + re-ingest) can never fire for it -- `markTileComplete` is the
  // caller-proven, in-place alternative `candidateArmSession.ts`'s own refetch-generation tracking
  // uses once it holds real proof (every batch of a refetch arrived untrimmed, terminal `Completed`).
  describe("markTileComplete (P6d): the in-place partial-clear a caller with proof can reach for", () => {
    it("clears partial in place -- no eviction, no re-ingest needed", () => {
      const set = new TileResidentSet();
      set.addBatch("0:0", batch("sh_a", 0, [1]), true); // trimmed once -- partial, sticky
      expect(set.isTilePartial("0:0")).toBe(true);
      expect(set.isTileComplete("0:0")).toBe(false);

      set.markTileComplete("0:0");

      expect(set.isTilePartial("0:0")).toBe(false);
      expect(set.isTileComplete("0:0")).toBe(true);
      expect(set.isTileResident("0:0")).toBe(true); // residency itself untouched -- only the flag moves
    });

    it("is a no-op for a tile that was never tracked -- no phantom entry is created", () => {
      const set = new TileResidentSet();
      set.markTileComplete("9:9");
      expect(set.isTileResident("9:9")).toBe(false);
      expect(set.isTilePartial("9:9")).toBe(false);
    });

    it("is a harmless no-op for a tile that was never partial", () => {
      const set = new TileResidentSet();
      set.addBatch("0:0", batch("sh_a", 0, [1]), false);
      set.markTileComplete("0:0");
      expect(set.isTileComplete("0:0")).toBe(true);
    });

    // The full lifecycle this piece's own blocker names: trim -> partial -> (headroom opens
    // elsewhere) -> refetch delivers everything, untrimmed -> the caller's own proof arrives ->
    // markTileComplete -> the tile reads complete again, in place, still the SAME entry throughout
    // (never evicted -- `evictTile` is never called anywhere in this test).
    it("the full sticky-partial-exit lifecycle: trim, partial, refetch (untrimmed), complete -- in place", () => {
      const set = new TileResidentSet();
      const tileKey = "0:0";

      // Trim: the first delivery only fit {1,2} of a wider bbox before the budget boundary cut it.
      set.addBatch(tileKey, batch("sh_a", 0, [1, 2]), true);
      expect(set.isTilePartial(tileKey)).toBe(true);
      expect(set.isTileComplete(tileKey)).toBe(false);

      // Headroom opens elsewhere (some other tile's own eviction, not modeled here -- this class
      // itself has no opinion on WHY a refetch was planned, only what arrives).
      // Refetch: a fresh stream for the SAME tile key delivers the rest, untrimmed this time.
      const refetch = set.addBatch(tileKey, batch("sh_b", 0, [3, 4]), false);
      expect(refetch.duplicatesDropped).toBe(0); // genuinely new rows this bbox never delivered before
      expect(set.isTilePartial(tileKey)).toBe(true); // still sticky -- addBatch alone never clears it

      // The caller's own proof (this stream's generation was entirely untrimmed, Completed terminal)
      // arrives, and it clears the flag in place.
      set.markTileComplete(tileKey);

      expect(set.isTilePartial(tileKey)).toBe(false);
      expect(set.isTileComplete(tileKey)).toBe(true);
      expect(set.totalResidentFeatures).toBe(4); // 1,2,3,4 -- nothing was ever evicted or lost
    });
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

  // Viewport-residency cut P6d (nit): a tile re-delivering rows it already owns itself (the ordinary
  // shape of a refetch's own batch -- it necessarily re-sends everything in its bbox, including rows
  // this SAME tile already admitted in an earlier generation) is a self-duplicate, not a cross-tile
  // ownership conflict -- it must never register the tile as its own suppressor.
  it("a tile re-delivering its own already-owned id is a self-duplicate, counted, but never registers the tile as its own suppressor", () => {
    const set = new TileResidentSet();
    set.addBatch("A", batch("sh_a", 0, [1, 2])); // A owns 1, 2
    const redeliver = set.addBatch("A", batch("sh_a2", 0, [1, 3])); // 1 is A's own id again; 3 is new
    expect(redeliver.duplicatesDropped).toBe(1); // still counted, exactly as any duplicate is
    expect(Array.from(redeliver.accepted?.ids ?? [])).toEqual([3n]);

    // Observable proof of no self-suppression: evicting A (its own eviction, unprotected) must name
    // ONLY A -- a self-registered suppressor entry would be indistinguishable from a genuine second
    // suppressor tile that also needed evicting/marking partial in the same cascade.
    const evicted = set.evictTile("A");
    expect(evicted).toEqual(["A"]);
    expect(set.totalResidentFeatures).toBe(0);

    // Fully recoverable, exactly like any other evicted tile's own ids -- no residual bookkeeping
    // from the self-duplicate left id 1 in a half-owned state.
    const reAdd = set.addBatch("A", batch("sh_a3", 0, [1, 2, 3]));
    expect(reAdd.duplicatesDropped).toBe(0);
    expect(reAdd.accepted?.ids.length).toBe(3);
  });

  // The sibling of the test above, at the point the guard is actually meant to matter: a PROTECTED
  // tile that has self-duplicated one of its own ids must never be marked partial "against itself"
  // when some OTHER, unrelated tile's own eviction cascade later touches a DIFFERENT id it genuinely
  // suppressed -- the self-duplicate entry (if the guard were absent) would be indistinguishable
  // bookkeeping-wise from a real cross-tile suppression of the SAME id it owns.
  it("a protected tile's self-duplicate never interferes with a genuine, unrelated suppressor cascade", () => {
    const set = new TileResidentSet();
    const protectedTile = "viewport-tile";
    set.addBatch(protectedTile, batch("sh_p", 0, [1, 2])); // owns 1, 2
    set.addBatch(protectedTile, batch("sh_p2", 0, [1, 4])); // self-redelivers 1 (self-dup); 4 is new

    // A different, evictable tile genuinely tries to deliver id 2 too (loses -- protectedTile owns it).
    const other = set.addBatch("other", batch("sh_o", 0, [2, 5]));
    expect(other.duplicatesDropped).toBe(1);

    const protectedKeys = new Set([protectedTile]);
    const evicted = set.evictTile(protectedTile, protectedKeys);
    expect(evicted).toEqual([]); // never evicted -- protected
    expect(set.isTileResident(protectedTile)).toBe(true);
    expect(set.isTilePartial(protectedTile)).toBe(false); // its own eviction never even runs
    // Its surviving content (1, 2, 4) is untouched -- the self-duplicate cost it nothing.
    expect(set.totalResidentFeatures).toBe(4); // 1, 2, 4 (protectedTile) + 5 (other)
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

  // P5f complex-gate must-fix 2: the reproduced boundary-feature-loss scenario. Tile A delivers
  // {100,101} first (owns both); tile B's own delivery of {100,102} has 100 suppressed as a
  // duplicate (the SAME feature genuinely intersects both tiles' bboxes at a misaligned grid
  // boundary) -- only 102 is admitted under B. Before this fix, evicting A (100's owner) simply
  // deleted 100 from the flat dedupe set while B -- which also tried to deliver it -- stayed
  // resident with no way to ever recover it: the feature vanished from the render set though it
  // still intersected the viewport, unrecoverable until an unrelated clear. This design's own
  // promise: B becomes non-resident (re-queryable) the moment A is evicted.
  it("M2: evicting the owner of a boundary feature also evicts every still-resident tile that tried to deliver it -- re-queryable, never silently lost", () => {
    const set = new TileResidentSet();
    const resultA = set.addBatch("A", batch("sh_a", 0, [100, 101]));
    expect(resultA.duplicatesDropped).toBe(0);
    const resultB = set.addBatch("B", batch("sh_b", 0, [100, 102]));
    expect(resultB.duplicatesDropped).toBe(1); // B's own 100 suppressed -- A already owns it
    expect(Array.from(resultB.accepted?.ids ?? [])).toEqual([102n]);
    expect(set.totalResidentFeatures).toBe(3); // 100, 101, 102 -- one resident copy of 100

    set.evictTile("A");

    expect(set.isTileResident("A")).toBe(false);
    // B is evicted too (this design's own promise) -- assert WHICHEVER the design promises: here,
    // B becomes re-queryable, not silently stuck with a permanent hole.
    expect(set.isTileResident("B")).toBe(false);
    expect(set.totalResidentFeatures).toBe(0);
    expect(set.totalResidentVertices).toBe(0);
    expect(set.getBatches()).toHaveLength(0);

    // Fully recoverable: re-fetching either tile treats every id as genuinely new again, and counts
    // stay honest (`duplicatesDropped` semantics unchanged).
    const reAddA = set.addBatch("A", batch("sh_a2", 0, [100, 101]));
    expect(reAddA.duplicatesDropped).toBe(0);
    expect(reAddA.accepted?.ids.length).toBe(2);
    const reAddB = set.addBatch("B", batch("sh_b2", 0, [100, 102]));
    expect(reAddB.duplicatesDropped).toBe(1); // A (re-added) owns 100 again
    expect(Array.from(reAddB.accepted?.ids ?? [])).toEqual([102n]);
  });

  it("M2: evicting the suppressed tile FIRST (its own unrelated reason) cleans up bookkeeping -- evicting the owner afterward is still safe", () => {
    const set = new TileResidentSet();
    set.addBatch("A", batch("sh_a", 0, [100, 101]));
    set.addBatch("B", batch("sh_b", 0, [100, 102]));

    set.evictTile("B"); // evicted first, for its own reason (e.g. ordinary budget eviction)
    expect(set.isTileResident("B")).toBe(false);
    expect(set.totalResidentFeatures).toBe(2); // A's own {100, 101} untouched

    expect(() => set.evictTile("A")).not.toThrow();
    expect(set.isTileResident("A")).toBe(false);
    expect(set.totalResidentFeatures).toBe(0);
  });

  // Viewport-residency cut P6a, B1 (re-review, blocking): the reviewer's own reproduced probe
  // scenario, extended into a real test. A "bootstrap" tile (the reserved untiled first-look key in
  // real production use; a plain owner tile here) owns ids {1, 2, 3}. A real, current-VIEWPORT tile
  // also attempts to deliver {1, 2, 3} (all suppressed as duplicates, the bootstrap already owns them)
  // plus a genuinely new id 4 of its own. Under a tight budget the bootstrap tile is evicted; before
  // this fix, the cascade (M2's own suppressor sweep) evicted the viewport tile too, BLANKING a tile
  // the "never evict a tile intersecting the current viewport" rule exists to protect, with no honest
  // record that it had happened. The fix: the viewport tile is named PROTECTED, survives with its own
  // surviving content (id 4) intact, is marked partial (Defect A's own re-fetch machinery, so planning
  // recovers ids 1-3 under the viewport tile's own delivery once headroom allows), and the returned
  // evicted list -- what a caller's own counters must read, never `plan.evict` itself -- names only
  // the tile that was ACTUALLY blanked.
  it("B1: a protected (current-viewport) suppressor survives a cascade -- its record is dropped, it is marked partial, never evicted; the returned list is the true one", () => {
    const set = new TileResidentSet();
    const bootstrap = "bootstrap";
    const viewportTile = "viewport-tile";
    set.addBatch(bootstrap, batch("sh_bootstrap", 0, [1, 2, 3])); // bootstrap owns 1, 2, 3
    const viewportResult = set.addBatch(viewportTile, batch("sh_viewport", 0, [1, 2, 3, 4]));
    expect(viewportResult.duplicatesDropped).toBe(3); // 1, 2, 3 all lost to the bootstrap's own ownership
    expect(Array.from(viewportResult.accepted?.ids ?? [])).toEqual([4n]); // only its own new id survives ingest

    const protectedTileKeys = new Set([viewportTile]); // the current covering set, protected absolutely
    const evicted = set.evictTile(bootstrap, protectedTileKeys);

    // The TRUE evicted list -- the viewport tile is never in it, however far the cascade reached.
    expect(evicted).toEqual([bootstrap]);
    expect(set.isTileResident(bootstrap)).toBe(false);
    // The protected tile survives, with its own surviving content untouched.
    expect(set.isTileResident(viewportTile)).toBe(true);
    expect(set.totalResidentFeatures).toBe(1); // only id 4 -- the bootstrap's {1,2,3} geometry is gone
    // Marked partial: it once tried to deliver 1-3 and lost that ownership race, and now that the
    // owner is gone, its own delivery of them was never stored either -- planning must re-fetch it.
    expect(set.isTilePartial(viewportTile)).toBe(true);
    expect(set.isTileComplete(viewportTile)).toBe(false);

    // Re-queryable: a fresh delivery from the viewport tile itself now owns 1-3 cleanly (the owner
    // slot is genuinely open -- evicting the bootstrap really did clear `knownIds` for them).
    const refetch = set.addBatch(viewportTile, batch("sh_viewport2", 0, [1, 2, 3]));
    expect(refetch.duplicatesDropped).toBe(0);
    expect(Array.from(refetch.accepted?.ids ?? [])).toEqual([1n, 2n, 3n]);
  });

  it("B1: a protected tile can never be evicted directly either, even if named in the caller's own evict list", () => {
    const set = new TileResidentSet();
    set.addBatch("viewport-tile", batch("sh_a", 0, [1]));
    const evicted = set.evictTile("viewport-tile", new Set(["viewport-tile"]));
    expect(evicted).toEqual([]);
    expect(set.isTileResident("viewport-tile")).toBe(true);
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

  describe("reservedTileKeys (P5f complex-gate must-fix 3)", () => {
    // `distanceToViewCentre` throws for the reserved key here -- exactly like `tileIngest.ts`'s own
    // real `parseTileKey` now does for a non-`"row:col"` input -- so this test doubles as proof the
    // reserved key is NEVER handed to it (a NaN-producing/comparator-artifact call would throw here
    // instead of silently corrupting the sort).
    function distanceOrThrowForReserved(key: string): number {
      if (key === "reserved") throw new Error(`distanceToViewCentre must never be called for: ${key}`);
      return distances[key];
    }

    it("never calls distanceToViewCentre for a reserved key -- NaN is structurally impossible", () => {
      expect(() =>
        planTileEviction({
          residentTileKeys: ["a", "b", "reserved"],
          tileVertices: () => 10,
          viewportTileKeys: new Set(),
          incomingVertices: 1000,
          currentTotalVertices: 30,
          maxResidentVertices: 40,
          distanceToViewCentre: distanceOrThrowForReserved,
          reservedTileKeys: new Set(["reserved"]),
        })
      ).not.toThrow();
    });

    it("evicts the reserved key LAST, only once every ordinary evictable tile is gone", () => {
      // Budget so tight that BOTH ordinary evictable tiles ("a", "b") AND the reserved one must go.
      const plan = planTileEviction({
        residentTileKeys: ["a", "b", "reserved"],
        tileVertices: () => 10,
        viewportTileKeys: new Set(),
        incomingVertices: 1000,
        currentTotalVertices: 30,
        maxResidentVertices: 40,
        distanceToViewCentre: distanceOrThrowForReserved,
        reservedTileKeys: new Set(["reserved"]),
      });
      // Ordinary tiles farthest-first ("b" dist 50, "a" dist 10), reserved key LAST regardless.
      expect(plan.evict).toEqual(["b", "a", "reserved"]);
    });

    it("does NOT evict the reserved key when evicting ordinary tiles alone already makes room", () => {
      const plan = planTileEviction({
        residentTileKeys: ["a", "b", "reserved"],
        tileVertices: () => 40,
        viewportTileKeys: new Set(),
        incomingVertices: 30,
        currentTotalVertices: 100, // a+b+reserved = 120, but no double-counted overlap in this synthetic case
        maxResidentVertices: 100,
        distanceToViewCentre: distanceOrThrowForReserved,
        reservedTileKeys: new Set(["reserved"]),
      });
      // Mirrors "evicts the farthest tiles first" above: evicting "b" (dist 50, farthest ordinary
      // tile) alone already fits -- the reserved key is never touched.
      expect(plan.evict).toEqual(["b"]);
    });

    it("a reserved key that is ALSO the current viewport is never evicted, same absolute rule every other tile gets", () => {
      const plan = planTileEviction({
        residentTileKeys: ["reserved"],
        tileVertices: () => 5000,
        viewportTileKeys: new Set(["reserved"]),
        incomingVertices: 500,
        currentTotalVertices: 5000,
        maxResidentVertices: 1000,
        distanceToViewCentre: distanceOrThrowForReserved,
        reservedTileKeys: new Set(["reserved"]),
      });
      expect(plan.evict).toEqual([]);
      expect(plan.overBudget).toBe(true);
    });
  });
});
