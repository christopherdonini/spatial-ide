import { describe, expect, it } from "vitest";

import type { ResidentBatch } from "./decodeBatch";
import { MAX_RESIDENT_VERTICES, ResidentVertexCeilingExceeded } from "./limits";
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
    rings: [[[[0, 0]]]],
    totalVertices,
  };
}

describe("ResidentSet", () => {
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
