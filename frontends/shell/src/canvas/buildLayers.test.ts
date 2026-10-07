// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import type { Position } from "@deck.gl/core";
import { PathLayer, ScatterplotLayer, SolidPolygonLayer } from "@deck.gl/layers";

import { batchForLayerId, buildLayers, layerId, POINT_RADIUS_PX, toResolvedDrawParams } from "./buildLayers";
import type { ResolvedDrawParams } from "./buildLayers";
import { decodeBatch, ENCODING_POINT } from "./decodeBatch";
import type { ResidentBatch } from "./decodeBatch";
import { loadBatchFixture, pointP1Positions } from "../testUtils/batchFixtures";
import { partsOfFeatures, partsOfPolygons } from "../testUtils/partsOfPolygons";
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
    ...partsOfPolygons([
      [[[2_600_000, 1_200_000], [2_600_001, 1_200_000], [2_600_001, 1_200_001], [2_600_000, 1_200_000]]],
      [
        [[2_600_010, 1_200_010], [2_600_011, 1_200_010], [2_600_010, 1_200_010]],
        [[2_600_010.4, 1_200_010.4], [2_600_010.6, 1_200_010.4], [2_600_010.4, 1_200_010.4]],
      ],
    ]),
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
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame, FIXED_DRAW, "polygonal");
    expect(layers).toHaveLength(2);
    expect(layers[0].id).toBe("sh_a:0");
    expect(layers[1].id).toBe("sh_b:3");
  });

  it("coordinates are offset-relative to the frame's current origin (rule 3), not absolute", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const [layer] = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW, "polygonal");
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
    const [layer] = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW, "polygonal");
    const data = layer.props.data as Array<Array<Array<[number, number]>>>;
    expect(data[1]).toHaveLength(2); // exterior + one hole
    expect(Array.isArray(data[1][0][0])).toBe(true); // each ring is an array of [x,y] pairs
    expect(typeof data[1][0][0][0]).toBe("number"); // and each pair holds plain numbers
  });

  it("recomputes from the authoritative source for a genuinely new batch object -- a later recenter changes the output", () => {
    // `batch("sh_a", 0)` returns a FRESH object on each call (a real cache miss regardless of the
    // P9 caching fix below), so this asserts the same thing it always has: a later recenter is
    // reflected in freshly-computed output. See the next `describe` block for the caching fix's own
    // reference-stability coverage (same object, unchanged origin -> same `data` reference).
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const before = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW, "polygonal")[0].props.data as number[][][][];
    frame.maybeRecenter(2_600_500, 1_200_500); // past the threshold; forces a recenter
    const after = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW, "polygonal")[0].props.data as number[][][][];
    expect(before[0][0][0]).not.toEqual(after[0][0][0]);
  });

  it("propagates the 24-bit pick ceiling refusal rather than constructing an oversized layer", () => {
    const frame = new OffsetFrame(100);
    // `checkPickCeiling` is called with `partCount` (ADR-034 Decision 6), a plain number, so no
    // 16,777,216-element array is allocated for a value never read.
    const huge: ResidentBatch = { ...batch("sh_a", 0), partCount: 16_777_216 };
    expect(() => buildLayers([huge], frame, FIXED_DRAW, "polygonal")).toThrow(PickCeilingExceeded);
  });

  /**
   * SH-5, the `buildLayers` site (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` section 4): the pick
   * ceiling is counted in parts. A batch of two features whose PART count is over the ceiling is
   * refused, and a batch whose FEATURE count is over the ceiling but whose part count is not is not.
   *
   * RECORDED MUTATION: pass `batch.ids.length` to `checkPickCeiling` in `buildLayers`. The first
   * assertion then fails by name.
   *
   * Observed over `ac538440` on the uncommitted tree of the shell commit: `counts the pick ceiling in
   * parts, not features, at this site (SH-5)` FAILED by name with the mutation applied (the updated
   * ceiling test above it failed with it), then reverted.
   */
  it("counts the pick ceiling in parts, not features, at this site (SH-5)", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const manyParts: ResidentBatch = { ...batch("sh_a", 0), partCount: 16_777_216 };
    expect(manyParts.ids.length).toBe(2);
    expect(() => buildLayers([manyParts], frame, FIXED_DRAW, "polygonal")).toThrow(PickCeilingExceeded);

    const manyFeatures: ResidentBatch = {
      ...batch("sh_a", 1),
      ids: { length: 16_777_216 } as unknown as BigUint64Array,
    };
    expect(() => buildLayers([manyFeatures], frame, FIXED_DRAW, "polygonal")).not.toThrow();
  });
});

/**
 * SH-8 (`engine/MULTIPOLYGON-MP1-PREREGISTRATION.md` section 4, styling): one deck.gl datum per PART,
 * all drawn with the style's fill, and the outline holds every ring of every part. Row 0 has two
 * parts (the first with a hole), row 1 has one: three datums, four outline paths. The datum order is
 * `partToRow`'s feature-then-part order, which is what makes a datum index a part ordinal.
 *
 * RECORDED MUTATION: build one datum per feature in `geometryForBatch` (take only each feature's
 * first part). The datum count and the outline path count then fail by name.
 *
 * Observed over `ac538440` on the uncommitted tree of the shell commit: `builds one datum per part
 * with the style's fill, and an outline holding every ring of every part` FAILED by name with the
 * mutation applied, then reverted.
 */
describe("buildLayers -- one datum per part (SH-8)", () => {
  function multiPartBatch(): ResidentBatch {
    return {
      streamHandle: "sh_m",
      batchSeq: 0,
      ids: BigUint64Array.from([10n, 20n]),
      ...partsOfFeatures([
        [
          [
            [[2_600_000, 1_200_000], [2_600_004, 1_200_000], [2_600_004, 1_200_004], [2_600_000, 1_200_000]],
            [[2_600_001, 1_200_001], [2_600_002, 1_200_001], [2_600_001, 1_200_002], [2_600_001, 1_200_001]],
          ],
          [[[2_600_100, 1_200_100], [2_600_101, 1_200_100], [2_600_101, 1_200_101], [2_600_100, 1_200_100]]],
        ],
        [[[[2_600_200, 1_200_200], [2_600_201, 1_200_200], [2_600_201, 1_200_201], [2_600_200, 1_200_200]]]],
      ]),
      totalVertices: 16,
    };
  }

  it("builds one datum per part with the style's fill, and an outline holding every ring of every part", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const draw: ResolvedDrawParams = { fillColor: [9, 8, 7, 200], outlineColor: [1, 2, 3, 255], outlineWidth: 2 };
    const b = multiPartBatch();
    expect(b.partCount).toBe(3);
    const [fill, outline] = buildLayers([b], frame, draw, "polygonal");

    const data = asFillLayer(fill).props.data as Array<Array<Array<[number, number]>>>;
    expect(data).toHaveLength(3); // one datum per part, never per feature
    expect(data[0]).toHaveLength(2); // row 0's first part: exterior + hole
    expect(data[1]).toHaveLength(1); // row 0's second part
    expect(data[2]).toHaveLength(1); // row 1's only part
    // Datum order is feature-then-part (`partToRow`'s order), offset-relative to the frame origin.
    expect(data[0][0][0]).toEqual([0, 0]);
    expect(data[1][0][0]).toEqual([100, 100]);
    expect(data[2][0][0]).toEqual([200, 200]);
    expect(asFillLayer(fill).props.getFillColor).toEqual([9, 8, 7, 200]);

    const paths = (outline as PathLayer<Position[]>).props.data as Position[][];
    expect(paths).toHaveLength(4); // 2 + 1 + 1 rings
  });
});

describe("buildLayers -- P9 paint-cost fix (viewport-residency cut, Amendment 23): cached, reference-stable `data`", () => {
  it("the SAME batch object at an UNCHANGED frame origin gets the exact same `data` array reference across two calls -- what lets deck.gl's own reference-only `diffDataProps` skip attribute regeneration", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const b = batch("sh_a", 0); // ONE object, reused across both calls -- unlike the tests above
    const first = buildLayers([b], frame, FIXED_DRAW, "polygonal")[0].props.data;
    const second = buildLayers([b], frame, FIXED_DRAW, "polygonal")[0].props.data;
    expect(second).toBe(first); // reference equality, not merely deep equality
  });

  it("the outline layer's `data` is also reference-stable for the same batch and unchanged origin", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const draw: ResolvedDrawParams = { fillColor: [1, 2, 3, 4], outlineColor: [5, 6, 7, 255], outlineWidth: 2 };
    const b = batch("sh_a", 0);
    const first = buildLayers([b], frame, draw, "polygonal")[1].props.data;
    const second = buildLayers([b], frame, draw, "polygonal")[1].props.data;
    expect(second).toBe(first);
  });

  it("a recenter (origin move) invalidates the cache for the SAME batch object -- a fresh `data` reference, with recomputed values", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const b = batch("sh_a", 0);
    const before = buildLayers([b], frame, FIXED_DRAW, "polygonal")[0].props.data as number[][][][];
    frame.maybeRecenter(2_600_500, 1_200_500); // past the threshold; forces a recenter
    const after = buildLayers([b], frame, FIXED_DRAW, "polygonal")[0].props.data as number[][][][];
    expect(after).not.toBe(before);
    expect(before[0][0][0]).not.toEqual(after[0][0][0]);
  });

  it("a genuinely different batch object (e.g. a real refetch) never reuses another batch's cached geometry", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const first = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW, "polygonal")[0].props.data;
    const second = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW, "polygonal")[0].props.data; // a NEW object, same field values
    expect(second).not.toBe(first);
  });
});

/**
 * SH-P2 (`engine/GEOMETRY-POINTS-PREREGISTRATION.md` section 4; real shape: the engine's own
 * `lv95-point-batch`, decoded by the product `decodeBatch`). A point open gives one pickable
 * `ScatterplotLayer` per batch, id'd by `layerId`, and no `PathLayer` even when the style has an
 * outline. Its data is the six offset-relative positions in `partToRow`'s order; the radius is
 * `POINT_RADIUS_PX` (4) in pixels; the fill is the style's, passed through; the stroke exists only
 * when `outlineWidth > 0`, in pixels, in the outline's colour and width. The pick ceiling is counted
 * from `partCount`, never the row count.
 *
 * RECORDED MUTATION: build a `SolidPolygonLayer` for points (ignore `kind` in `buildLayers`). The
 * first `ScatterplotLayer` assertion then fails by name.
 *
 * Observed over `edbc0f3c` on the uncommitted tree of the shell commit: `a point batch gives one pickable ScatterplotLayer with the radius, fill and stroke rule, no PathLayer, and the ceiling counted in partCount (SH-P2)`
 * FAILED by name with the mutation applied, at `expect(layer).toBeInstanceOf(ScatterplotLayer)` (`expected SolidPolygonLayer{ …(6) } to be an instance of ScatterplotLayer`), then reverted.
 */
describe("buildLayers -- a point open (SH-P2)", () => {
  function p1(streamHandle: string, batchSeq: number): ResidentBatch {
    return decodeBatch(streamHandle, batchSeq, loadBatchFixture("lv95-point-batch"), "geometry", ENCODING_POINT);
  }

  it("a point batch gives one pickable ScatterplotLayer with the radius, fill and stroke rule, no PathLayer, and the ceiling counted in partCount (SH-P2)", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const b = p1("sh_p", 2);

    const plain = buildLayers([b], frame, FIXED_DRAW, "point");
    expect(plain).toHaveLength(1);
    const layer = plain[0];
    expect(layer).toBeInstanceOf(ScatterplotLayer);
    expect(layer.id).toBe("sh_p:2");
    expect(layer.props.pickable).toBe(true);
    expect(POINT_RADIUS_PX).toBe(4);
    expect(layer.props.radiusUnits).toBe("pixels");
    expect(layer.props.getRadius).toBe(POINT_RADIUS_PX);
    expect(layer.props.getFillColor).toBe(FIXED_DRAW.fillColor); // the style's own array, not cloned
    expect(layer.props.stroked).toBe(false); // outlineWidth 0: no stroke

    // One datum per point, offset-relative, in partToRow's order (datum k is pick ordinal k).
    const data = layer.props.data as Array<[number, number]>;
    expect(data).toHaveLength(6);
    pointP1Positions().forEach(([x, y], k) => {
      expect(data[k]).toEqual([x - 2_600_000, y - 1_200_000]);
    });

    // An outline in the style gives a stroke on the same layer, in pixels, and never a PathLayer.
    const outlined = buildLayers([b], frame, { ...FIXED_DRAW, outlineColor: [17, 17, 17, 255], outlineWidth: 3 }, "point");
    expect(outlined).toHaveLength(1);
    expect(outlined.some((l) => (l as unknown) instanceof PathLayer)).toBe(false);
    expect(outlined[0].props.stroked).toBe(true);
    expect(outlined[0].props.lineWidthUnits).toBe("pixels");
    expect(outlined[0].props.getLineColor).toEqual([17, 17, 17, 255]);
    expect(outlined[0].props.getLineWidth).toBe(3);

    // The ceiling is `partCount`: a batch over it is refused; a batch with only its ROW count over it is not.
    const manyParts: ResidentBatch = { ...b, partCount: 16_777_216 };
    expect(() => buildLayers([manyParts], frame, FIXED_DRAW, "point")).toThrow(PickCeilingExceeded);
    const manyRows: ResidentBatch = { ...b, ids: { length: 16_777_216 } as unknown as BigUint64Array };
    expect(() => buildLayers([manyRows], frame, FIXED_DRAW, "point")).not.toThrow();
  });

  /**
   * SH-P2's cache rule: a point batch's `data` is cached per batch object and frame origin, as the
   * polygon path's is (`geometryForBatch`), so deck.gl's reference-only data diff skips regeneration
   * for an unchanged batch; a recenter recomputes it from the authoritative f64 positions.
   *
   * RECORDED MUTATION: delete the cache hit in `pointsForBatch` (always recompute). The reference
   * assertion then fails by name.
   *
   * Observed over `edbc0f3c` on the uncommitted tree of the shell commit: `a point batch's data is reference-stable at an unchanged origin and recomputed after a recenter (SH-P2, the cache rule)`
   * FAILED by name with the mutation applied, at `expect(second).toBe(first)` (`expected [ [ 0.1234567891806364, …(1) ], …(5) ] to be [ [ 0.1234567891806364, …(1) ], …(5) ] // Object.is equality`), then reverted.
   */
  it("a point batch's data is reference-stable at an unchanged origin and recomputed after a recenter (SH-P2, the cache rule)", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const b = p1("sh_p", 0);
    const first = buildLayers([b], frame, FIXED_DRAW, "point")[0].props.data;
    const second = buildLayers([b], frame, FIXED_DRAW, "point")[0].props.data;
    expect(second).toBe(first);

    frame.maybeRecenter(2_600_500, 1_200_500); // past the threshold; forces a recenter
    const third = buildLayers([b], frame, FIXED_DRAW, "point")[0].props.data as Array<[number, number]>;
    expect(third).not.toBe(first);
    expect(third[0]).not.toEqual((first as Array<[number, number]>)[0]);
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
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame, draw, "polygonal");
    expect(asFillLayer(layers[0]).props.getFillColor).toEqual([10, 20, 30, 200]);
    expect(asFillLayer(layers[1]).props.getFillColor).toEqual([10, 20, 30, 200]);
  });

  it("passes the SAME array reference through untouched -- no per-batch or per-call reallocation (binding note 7)", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const draw: ResolvedDrawParams = { fillColor: [1, 2, 3, 4], outlineColor: [0, 0, 0, 255], outlineWidth: 0 };
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame, draw, "polygonal");
    // Reference equality, not merely value equality: this function must not clone `draw.fillColor`
    // per batch, or a caller memoizing it once per style change (`WorkingCanvas.tsx`) would still see
    // a fresh array reach deck.gl on every render.
    expect(asFillLayer(layers[0]).props.getFillColor).toBe(draw.fillColor);
    expect(asFillLayer(layers[1]).props.getFillColor).toBe(draw.fillColor);

    const againSameDraw = buildLayers([batch("sh_a", 0)], frame, draw, "polygonal");
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
    const layers = buildLayers([batch("sh_a", 0), batch("sh_b", 3)], frame, OUTLINE_DRAW, "polygonal");
    expect(layers).toHaveLength(4); // 2 fill + 2 outline
    expect(layers.map((l) => l.id)).toEqual(["sh_a:0", "sh_a:0-outline", "sh_b:3", "sh_b:3-outline"]);
  });

  it("builds no outline layer at all when outlineWidth is exactly 0 -- never an invisible zero-width layer", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([batch("sh_a", 0)], frame, FIXED_DRAW, "polygonal");
    expect(layers).toHaveLength(1);
    expect(layers[0].id).toBe("sh_a:0");
  });

  it("the outline layer is a PathLayer, is never pickable, and carries the outline colour/width", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([batch("sh_a", 0)], frame, OUTLINE_DRAW, "polygonal");
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
    const layers = buildLayers([batch("sh_a", 0)], frame, OUTLINE_DRAW, "polygonal");
    expect(asFillLayer(layers[0]).props.pickable).toBe(true);
  });

  it("the outline layer's id never collides with batchForLayerId's exact-match lookup -- fills only", () => {
    const b = batch("sh_a", 0);
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_600_000, 1_200_000);
    const layers = buildLayers([b], frame, OUTLINE_DRAW, "polygonal");
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
