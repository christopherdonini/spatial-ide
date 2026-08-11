import { describe, expect, it } from "vitest";

import { extentOfBatch, fitViewStateForBbox, unionBbox } from "./extent";

describe("extentOfBatch", () => {
  it("returns null for a batch with zero features", () => {
    expect(extentOfBatch({ rings: [] })).toBeNull();
  });

  it("returns null for a batch whose features all have null geometry", () => {
    // decodeBatch.ts represents a null-geometry row as an empty featureRings array.
    expect(extentOfBatch({ rings: [[], []] })).toBeNull();
  });

  it("bounds every vertex across every ring and every feature", () => {
    const bbox = extentOfBatch({
      rings: [
        [[[0, 0], [10, 0], [10, 10], [0, 10]]], // feature 0, one ring
        [[[5, -5], [20, -5], [20, 5]]], // feature 1, one ring
      ],
    });
    expect(bbox).toEqual({ xmin: 0, ymin: -5, xmax: 20, ymax: 10 });
  });

  it("a single-point ring still produces a (degenerate) bbox, not null", () => {
    const bbox = extentOfBatch({ rings: [[[[7, 3]]]] });
    expect(bbox).toEqual({ xmin: 7, ymin: 3, xmax: 7, ymax: 3 });
  });
});

describe("unionBbox", () => {
  it("returns the other side when one side is null", () => {
    const b = { xmin: 0, ymin: 0, xmax: 1, ymax: 1 };
    expect(unionBbox(null, b)).toEqual(b);
    expect(unionBbox(b, null)).toEqual(b);
  });

  it("returns null when both sides are null (nothing accumulated yet)", () => {
    expect(unionBbox(null, null)).toBeNull();
  });

  it("expands to the smallest box containing both inputs", () => {
    const a = { xmin: 0, ymin: 0, xmax: 5, ymax: 5 };
    const b = { xmin: 3, ymin: -2, xmax: 10, ymax: 4 };
    expect(unionBbox(a, b)).toEqual({ xmin: 0, ymin: -2, xmax: 10, ymax: 5 });
  });
});

describe("fitViewStateForBbox", () => {
  it("centers on the bbox midpoint", () => {
    const fit = fitViewStateForBbox({ xmin: 2_600_000, ymin: 1_200_000, xmax: 2_600_100, ymax: 1_200_050 }, 1000, 800);
    expect(fit.centerX).toBe(2_600_050);
    expect(fit.centerY).toBe(1_200_025);
    expect(fit.target).toEqual([0, 0]);
  });

  it("picks the tighter of the two axis fits (the taller-than-wide extent is height-bound)", () => {
    // 100 wide x 400 tall into a 1000x1000 canvas with no margin: height is the binding constraint.
    const fit = fitViewStateForBbox({ xmin: 0, ymin: 0, xmax: 100, ymax: 400 }, 1000, 1000, 0);
    const pixelsPerMetre = Math.pow(2, fit.zoom);
    expect(pixelsPerMetre).toBeCloseTo(1000 / 400, 6);
  });

  it("picks the tighter of the two axis fits (the wider-than-tall extent is width-bound)", () => {
    const fit = fitViewStateForBbox({ xmin: 0, ymin: 0, xmax: 400, ymax: 100 }, 1000, 1000, 0);
    const pixelsPerMetre = Math.pow(2, fit.zoom);
    expect(pixelsPerMetre).toBeCloseTo(1000 / 400, 6);
  });

  it("a real-world-scale extent does not fit at zoom 0 -- the bug this replaces", () => {
    // The extent a single-vertex, zoom=0 anchor used to leave on screen: a few kilometres of data
    // in a ~1000px canvas is not visible at 1 world unit == 1 px. The fit must zoom out well past 0.
    const fit = fitViewStateForBbox({ xmin: 0, ymin: 0, xmax: 5000, ymax: 5000 }, 1000, 1000, 0);
    expect(fit.zoom).toBeLessThan(-2);
  });

  it("a degenerate (single-point) bbox falls back to the previous fixed scale rather than NaN/Infinity", () => {
    const fit = fitViewStateForBbox({ xmin: 42, ymin: 7, xmax: 42, ymax: 7 }, 1000, 800);
    expect(fit.zoom).toBe(0);
    expect(Number.isFinite(fit.zoom)).toBe(true);
  });

  it("margin shrinks the usable area, so a margined fit zooms out further than an unmargined one", () => {
    const bbox = { xmin: 0, ymin: 0, xmax: 100, ymax: 100 };
    const unmargined = fitViewStateForBbox(bbox, 1000, 1000, 0);
    const margined = fitViewStateForBbox(bbox, 1000, 1000, 0.1);
    expect(margined.zoom).toBeLessThan(unmargined.zoom);
  });

  it("zoom is clamped so a vast extent does not zoom out unboundedly", () => {
    const fit = fitViewStateForBbox({ xmin: 0, ymin: 0, xmax: 1e12, ymax: 1e12 }, 1000, 1000, 0);
    expect(fit.zoom).toBeGreaterThanOrEqual(-20);
  });
});
