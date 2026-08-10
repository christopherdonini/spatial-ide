import { describe, expect, it } from "vitest";

import { batchForLayerId, buildLayers, layerId } from "./buildLayers";
import type { ResidentBatch } from "./decodeBatch";
import { PickCeilingExceeded } from "./limits";
import { OffsetFrame } from "./offsetFrame";

function batch(streamHandle: string, batchSeq: number): ResidentBatch {
  return {
    streamHandle,
    batchSeq,
    ids: BigUint64Array.from([1n, 2n]),
    rings: [
      [[[2_600_000, 1_200_000], [2_600_001, 1_200_000], [2_600_001, 1_200_001], [2_600_000, 1_200_000]]],
      [
        [[2_600_010, 1_200_010], [2_600_011, 1_200_010], [2_600_010, 1_200_010]],
        [[2_600_010.4, 1_200_010.4], [2_600_010.6, 1_200_010.4], [2_600_010.4, 1_200_010.4]],
      ],
    ],
    totalVertices: 4 + 6,
  };
}

describe("buildLayers (ADR-010 rules 3 and 6)", () => {
  it("builds one layer per resident batch, id'd by stream handle and batch sequence", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame);
    expect(layers).toHaveLength(2);
    expect(layers[0].id).toBe("sh_a:0");
    expect(layers[1].id).toBe("sh_b:3");
  });

  it("coordinates are offset-relative to the frame's current origin (rule 3), not absolute", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const [layer] = buildLayers([batch("sh_a", 0)], frame);
    const data = layer.props.data as Array<Array<Array<[number, number]>>>;
    // Feature 0, ring 0, vertex 0: (2_600_000, 1_200_000) - origin(2_600_000, 1_200_000) = (0, 0).
    expect(data[0][0][0]).toEqual([0, 0]);
    // Feature 0, ring 0, vertex 1: (2_600_001, 1_200_000) -> (1, 0).
    expect(data[0][0][1]).toEqual([1, 0]);
  });

  it("preserves the exterior-ring-then-holes structure deck.gl's own normalizer expects", () => {
    // deck.gl's polygon normalizer (@deck.gl/layers/solid-polygon-layer/polygon.js) treats
    // `polygon[0][0]` being a finite number as "simple flat" and a hole-bearing polygon must
    // therefore stay nested as [[x,y],...] per ring, never flattened -- verified by reading that
    // module's `isSimple`/`isNested` checks; this asserts this function's own output shape rather
    // than re-importing deck.gl internals into a test.
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const [layer] = buildLayers([batch("sh_a", 0)], frame);
    const data = layer.props.data as Array<Array<Array<[number, number]>>>;
    expect(data[1]).toHaveLength(2); // exterior + one hole
    expect(Array.isArray(data[1][0][0])).toBe(true); // each ring is an array of [x,y] pairs
    expect(typeof data[1][0][0][0]).toBe("number"); // and each pair holds plain numbers
  });

  it("recomputes from the authoritative source on every call -- a later recenter changes the output", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const before = buildLayers([batch("sh_a", 0)], frame)[0].props.data as number[][][][];
    frame.maybeRecenter(2_600_500, 1_200_500); // past the threshold; forces a recenter
    const after = buildLayers([batch("sh_a", 0)], frame)[0].props.data as number[][][][];
    expect(before[0][0][0]).not.toEqual(after[0][0][0]);
  });

  it("propagates the 24-bit pick ceiling refusal rather than constructing an oversized layer", () => {
    const frame = new OffsetFrame(100);
    // `checkPickCeiling` (and this test) only ever reads `.length` -- a real 16,777,216-element
    // `BigUint64Array` would be a genuine 128 MiB allocation per test run for a value never read.
    const oversizedIds = { length: 16_777_216 } as unknown as BigUint64Array;
    const huge: ResidentBatch = { ...batch("sh_a", 0), ids: oversizedIds };
    expect(() => buildLayers([huge], frame)).toThrow(PickCeilingExceeded);
  });
});

describe("layerId / batchForLayerId", () => {
  it("round-trips a batch through its layer id", () => {
    const b = batch("sh_a", 7);
    expect(layerId(b)).toBe("sh_a:7");
    expect(batchForLayerId([b], "sh_a:7")).toBe(b);
    expect(batchForLayerId([b], "sh_a:8")).toBeUndefined();
  });
});
