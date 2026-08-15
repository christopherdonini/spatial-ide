import { describe, expect, it } from "vitest";

import type { Position } from "@deck.gl/core";
import { PathLayer, SolidPolygonLayer } from "@deck.gl/layers";

import { batchForLayerId, buildLayers, layerId, toResolvedDrawParams } from "./buildLayers";
import type { ResolvedDrawParams } from "./buildLayers";
import type { ResidentBatch } from "./decodeBatch";
import { PickCeilingExceeded } from "./limits";
import { OffsetFrame } from "./offsetFrame";

// The pre-P2 fixed default (`buildLayers.ts`'s own git history: `getFillColor: [66, 133, 244,
// 180]`), reused here as the fixture every existing test's `buildLayers` call passes as the new
// third parameter -- so every pre-existing assertion below is otherwise unchanged. `outlineWidth: 0`
// -- every test in this file except the "outline PathLayer" describe block below never asks for an
// outline, so `buildLayers` never pushes a second (`-outline`) layer for any of them (NEXT-CUT.md
// P5: "only when outline_width > 0").
const FIXED_DRAW: ResolvedDrawParams = {
  fillColor: [66, 133, 244, 180],
  outlineColor: [0, 0, 0, 255],
  outlineWidth: 0,
};

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

/** Every test in this file except the "outline PathLayer" describe block below uses
 * `outlineWidth: 0`, so `buildLayers` never returns anything but `SolidPolygonLayer`s for them --
 * this narrows the union return type once, at the point a test needs a fill-layer-only prop
 * (`getFillColor`, which `PathLayer` does not have), rather than casting at each call site. Throws
 * (never silently narrows wrong) if a test that thinks it built only fill layers actually got a
 * `PathLayer` back -- that would itself be a real bug in the test's own `draw` fixture. */
function asFillLayer(layer: SolidPolygonLayer<Position[][]> | PathLayer<Position[]>): SolidPolygonLayer<Position[][]> {
  if (!(layer instanceof SolidPolygonLayer)) {
    throw new Error("asFillLayer: expected a SolidPolygonLayer, got a PathLayer");
  }
  return layer;
}

describe("buildLayers (ADR-010 rules 3 and 6)", () => {
  it("builds one layer per resident batch, id'd by stream handle and batch sequence", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame, FIXED_DRAW);
    expect(layers).toHaveLength(2);
    expect(layers[0].id).toBe("sh_a:0");
    expect(layers[1].id).toBe("sh_b:3");
  });

  it("coordinates are offset-relative to the frame's current origin (rule 3), not absolute", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const [layer] = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW);
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
    const [layer] = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW);
    const data = layer.props.data as Array<Array<Array<[number, number]>>>;
    expect(data[1]).toHaveLength(2); // exterior + one hole
    expect(Array.isArray(data[1][0][0])).toBe(true); // each ring is an array of [x,y] pairs
    expect(typeof data[1][0][0][0]).toBe("number"); // and each pair holds plain numbers
  });

  it("recomputes from the authoritative source on every call -- a later recenter changes the output", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const before = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW)[0].props.data as number[][][][];
    frame.maybeRecenter(2_600_500, 1_200_500); // past the threshold; forces a recenter
    const after = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW)[0].props.data as number[][][][];
    expect(before[0][0][0]).not.toEqual(after[0][0][0]);
  });

  it("propagates the 24-bit pick ceiling refusal rather than constructing an oversized layer", () => {
    const frame = new OffsetFrame(100);
    // `checkPickCeiling` (and this test) only ever reads `.length` -- a real 16,777,216-element
    // `BigUint64Array` would be a genuine 128 MiB allocation per test run for a value never read.
    const oversizedIds = { length: 16_777_216 } as unknown as BigUint64Array;
    const huge: ResidentBatch = { ...batch("sh_a", 0), ids: oversizedIds };
    expect(() => buildLayers([huge], frame, FIXED_DRAW)).toThrow(PickCeilingExceeded);
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

describe("buildLayers -- resolved draw parameters (NEXT-CUT.md P2)", () => {
  it("every batch's getFillColor is exactly the passed-in draw parameters", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const draw: ResolvedDrawParams = { fillColor: [10, 20, 30, 200], outlineColor: [0, 0, 0, 255], outlineWidth: 0 };
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame, draw);
    expect(asFillLayer(layers[0]).props.getFillColor).toEqual([10, 20, 30, 200]);
    expect(asFillLayer(layers[1]).props.getFillColor).toEqual([10, 20, 30, 200]);
  });

  it("passes the SAME array reference through untouched -- no per-batch or per-call reallocation (binding note 7)", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const draw: ResolvedDrawParams = { fillColor: [1, 2, 3, 4], outlineColor: [0, 0, 0, 255], outlineWidth: 0 };
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame, draw);
    // Reference equality, not merely value equality: this function must not clone `draw.fillColor`
    // per batch, or a caller memoizing it once per style change (`WorkingCanvas.tsx`) would still see
    // a fresh array reach deck.gl on every render.
    expect(asFillLayer(layers[0]).props.getFillColor).toBe(draw.fillColor);
    expect(asFillLayer(layers[1]).props.getFillColor).toBe(draw.fillColor);

    const againSameDraw = buildLayers([batch("sh_a", 0)], frame, draw);
    expect(asFillLayer(againSameDraw[0]).props.getFillColor).toBe(draw.fillColor);
  });
});

describe("buildLayers -- outline PathLayer (NEXT-CUT.md P5)", () => {
  const OUTLINE_DRAW: ResolvedDrawParams = {
    fillColor: [66, 133, 244, 180],
    outlineColor: [17, 17, 17, 255],
    outlineWidth: 3,
  };

  it("adds a second, distinctly-id'd layer per batch when outlineWidth > 0", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame, OUTLINE_DRAW);
    expect(layers).toHaveLength(4); // 2 fill + 2 outline
    expect(layers.map((l) => l.id)).toEqual(["sh_a:0", "sh_a:0-outline", "sh_b:3", "sh_b:3-outline"]);
  });

  it("builds no outline layer at all when outlineWidth is exactly 0 -- never an invisible zero-width layer", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW);
    expect(layers).toHaveLength(1);
    expect(layers[0].id).toBe("sh_a:0");
  });

  it("the outline layer is a PathLayer, is never pickable, and carries the outline colour/width", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([batch("sh_a", 0)], frame, OUTLINE_DRAW);
    const outline = layers[1];
    expect(outline).toBeInstanceOf(PathLayer);
    expect(outline.props.pickable).toBe(false);
    expect((outline as PathLayer<Position[]>).props.getColor).toEqual([17, 17, 17, 255]);
    expect((outline as PathLayer<Position[]>).props.getWidth).toBe(3);
    expect((outline as PathLayer<Position[]>).props.widthUnits).toBe("pixels");
  });

  it("the fill layer stays pickable, unaffected by the outline layer's presence", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([batch("sh_a", 0)], frame, OUTLINE_DRAW);
    expect(asFillLayer(layers[0]).props.pickable).toBe(true);
  });

  it("the outline layer's id never collides with batchForLayerId's exact-match lookup -- fills only", () => {
    const b = batch("sh_a", 0);
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([b], frame, OUTLINE_DRAW);
    const outlineId = layers[1].id;
    expect(outlineId).toBe("sh_a:0-outline");
    // The structural guarantee is `pickable: false` (never reachable from a real pick at all); this
    // is the redundant-insurance half this file's own `buildLayers.ts` comment names: even if an id
    // were ever handed to `batchForLayerId` by mistake, it still would not resolve to anything.
    expect(batchForLayerId([b], outlineId)).toBeUndefined();
    expect(batchForLayerId([b], layerId(b))).toBe(b);
  });
});

describe("toResolvedDrawParams (DrawParameters -> deck.gl's 0-255 RGBA accessor convention)", () => {
  it("reconstructs today's exact fixed default byte-for-byte", () => {
    // #4285f4 / 180 is buildLayers.ts's own pre-P2 fixed `getFillColor: [66, 133, 244, 180]`
    // (frontends/shell/src/style/document.ts's DEFAULT_STYLE_STATE doc comment has the hex math).
    expect(
      toResolvedDrawParams({ fillColor: "#4285f4", fillOpacity: 180 / 255, outlineColor: "#000000", outlineWidth: 0 })
    ).toEqual({
      fillColor: [66, 133, 244, 180],
      outlineColor: [0, 0, 0, 255],
      outlineWidth: 0,
    });
  });

  it("opacity 1.0 is alpha 255, opacity 0 is alpha 0", () => {
    expect(
      toResolvedDrawParams({ fillColor: "#ffffff", fillOpacity: 1, outlineColor: "#000000", outlineWidth: 0 })
        .fillColor[3]
    ).toBe(255);
    expect(
      toResolvedDrawParams({ fillColor: "#ffffff", fillOpacity: 0, outlineColor: "#000000", outlineWidth: 0 })
        .fillColor[3]
    ).toBe(0);
  });

  it("accepts uppercase hex too (defensive -- the shell's own producer only ever emits lowercase)", () => {
    expect(
      toResolvedDrawParams({ fillColor: "#AA3333", fillOpacity: 1, outlineColor: "#000000", outlineWidth: 0 })
        .fillColor
    ).toEqual([170, 51, 51, 255]);
  });

  it("outline colour converts the same way as fill colour, always at alpha 255 (no separate outline-opacity field)", () => {
    const result = toResolvedDrawParams({ fillColor: "#000000", fillOpacity: 0, outlineColor: "#112233", outlineWidth: 5 });
    expect(result.outlineColor).toEqual([17, 34, 51, 255]);
    expect(result.outlineWidth).toBe(5);
  });
});
