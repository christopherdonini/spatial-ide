// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { ResidentBatch } from "./decodeBatch";
import { partsOfFeatures } from "../testUtils/partsOfPolygons";
import { MAX_RESIDENT_VERTICES, PickCeilingExceeded, ResidentVertexCeilingExceeded } from "./limits";
import { DuplicateBatchError, ResidentSet } from "./residentSet";

function batch(streamHandle: string, batchSeq: number, totalVertices: number, featureCount = 1): ResidentBatch {
  const ids = new BigUint64Array(featureCount);
  for (let i = 0; i < featureCount; i++) {
    ids[i] = BigInt(batchSeq) * 1000n + BigInt(i);
  }
  return {
    streamHandle,
    batchSeq,
    ids,
    ...partsOfFeatures(Array.from({ length: featureCount }, () => [[[[0, 0]]]])),
    totalVertices,
  };
}

describe("ResidentSet", () => {
  /**
   * SH-5, the `ResidentSet.addBatch` site (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` section 4):
   * the pick ceiling is counted in parts. A batch of one feature whose PART count is over the ceiling
   * is refused and adds nothing, and a batch whose FEATURE count is over the ceiling but whose part
   * count is not is accepted.
   *
   * RECORDED MUTATION: pass `batch.ids.length` to `checkPickCeiling` in `ResidentSet.addBatch`. The
   * first assertion then fails by name.
   *
   * Observed over `ac538440` on the uncommitted tree of the shell commit: `counts the pick ceiling in parts, not features, at this site (SH-5)`
   * FAILED by name with the mutation applied, then reverted.
   */
  it("counts the pick ceiling in parts, not features, at this site (SH-5)", () => {
    const set = new ResidentSet();
    const manyParts: ResidentBatch = { ...batch("sh_a", 0, 10), partCount: 16_777_216 };
    expect(manyParts.ids.length).toBe(1);
    expect(() => set.addBatch(manyParts)).toThrow(PickCeilingExceeded);
    expect(set.getBatches()).toHaveLength(0); // refused, not partially resident

    const manyFeatures: ResidentBatch = {
      ...batch("sh_a", 1, 10),
      ids: { length: 16_777_216 } as unknown as BigUint64Array,
    };
    expect(() => set.addBatch(manyFeatures)).not.toThrow();
  });

  it("accumulates vertex totals across batches and streams", () => {
    const set = new ResidentSet();
    set.addBatch(batch("sh_a", 0, 100));
    set.addBatch(batch("sh_b", 0, 200));
    expect(set.totalResidentVertices).toBe(300);
    expect(set.getBatches()).toHaveLength(2);
  });

  it("refuses a batch that would push the resident total past MAX_RESIDENT_VERTICES, and adds nothing", () => {
    const set = new ResidentSet();
    set.addBatch(batch("sh_a", 0, MAX_RESIDENT_VERTICES - 10));
    expect(() => set.addBatch(batch("sh_a", 1, 11))).toThrow(ResidentVertexCeilingExceeded);
    // The refused batch is not partially resident.
    expect(set.getBatches()).toHaveLength(1);
    expect(set.totalResidentVertices).toBe(MAX_RESIDENT_VERTICES - 10);
  });

  it("accepts a batch landing exactly at the ceiling", () => {
    const set = new ResidentSet();
    set.addBatch(batch("sh_a", 0, MAX_RESIDENT_VERTICES));
    expect(set.totalResidentVertices).toBe(MAX_RESIDENT_VERTICES);
  });

  it("clearStream drops only the named stream's batches and their vertex share", () => {
    const set = new ResidentSet();
    set.addBatch(batch("sh_a", 0, 100));
    set.addBatch(batch("sh_a", 1, 50));
    set.addBatch(batch("sh_b", 0, 200));
    set.clearStream("sh_a");
    expect(set.getBatches()).toHaveLength(1);
    expect(set.getBatches()[0].streamHandle).toBe("sh_b");
    expect(set.totalResidentVertices).toBe(200);
  });

  it("clear() empties everything", () => {
    const set = new ResidentSet();
    set.addBatch(batch("sh_a", 0, 100));
    set.clear();
    expect(set.getBatches()).toHaveLength(0);
    expect(set.totalResidentVertices).toBe(0);
  });

  it("refuses a (streamHandle, batchSeq) that is already resident, and adds nothing (S12)", () => {
    const set = new ResidentSet();
    set.addBatch(batch("sh_a", 0, 100));
    expect(() => set.addBatch(batch("sh_a", 0, 100))).toThrow(DuplicateBatchError);
    expect(set.getBatches()).toHaveLength(1);
    expect(set.totalResidentVertices).toBe(100);
  });

  it("clearStream frees its keys, so a later batch reusing the same batchSeq is accepted", () => {
    const set = new ResidentSet();
    set.addBatch(batch("sh_a", 0, 100));
    set.clearStream("sh_a");
    expect(() => set.addBatch(batch("sh_a", 0, 50))).not.toThrow();
    expect(set.totalResidentVertices).toBe(50);
  });

  it("clear() frees its keys too", () => {
    const set = new ResidentSet();
    set.addBatch(batch("sh_a", 0, 100));
    set.clear();
    expect(() => set.addBatch(batch("sh_a", 0, 50))).not.toThrow();
  });

  // Rider 1 (DECISIONS-PENDING.md entry 0, option (a)): the persistent ceiling-refusal status
  // indicator names "N of M features rendered", which needs a row/feature count -- distinct from
  // `totalResidentVertices`, since one refused batch's vertex delta says nothing about how many
  // features it carried.
  describe("totalResidentFeatures", () => {
    it("accumulates row/feature counts across batches and streams", () => {
      const set = new ResidentSet();
      set.addBatch(batch("sh_a", 0, 100, 3));
      set.addBatch(batch("sh_b", 0, 200, 5));
      expect(set.totalResidentFeatures).toBe(8);
    });

    it("a batch refused for exceeding MAX_RESIDENT_VERTICES contributes nothing -- the count read at refusal time is exactly what was resident before it", () => {
      const set = new ResidentSet();
      set.addBatch(batch("sh_a", 0, MAX_RESIDENT_VERTICES - 10, 97_500));
      expect(() => set.addBatch(batch("sh_a", 1, 11, 2_500))).toThrow(ResidentVertexCeilingExceeded);
      expect(set.totalResidentFeatures).toBe(97_500);
    });

    it("clearStream drops only the named stream's feature share", () => {
      const set = new ResidentSet();
      set.addBatch(batch("sh_a", 0, 100, 3));
      set.addBatch(batch("sh_a", 1, 50, 2));
      set.addBatch(batch("sh_b", 0, 200, 7));
      set.clearStream("sh_a");
      expect(set.totalResidentFeatures).toBe(7);
    });

    it("clear() resets it to 0", () => {
      const set = new ResidentSet();
      set.addBatch(batch("sh_a", 0, 100, 4));
      set.clear();
      expect(set.totalResidentFeatures).toBe(0);
    });
  });
});
