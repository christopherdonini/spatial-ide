import { describe, expect, it } from "vitest";

import { bboxForFit, chooseFitTarget, extentOfBatch, fitViewStateForBbox, unionBbox } from "./extent";

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

// 2026-08-14 walkthrough A7 defect: `WorkingCanvas.fitToBounds` used to fit only current residency
// (`residentExtentRef`), which the supersede-on-pan clearing empties whenever the viewport leaves
// the data -- exactly when "Zoom to layer" is needed most. `chooseFitTarget` is the pure decision
// extracted out of that fix, exercised directly here since `fitToBounds` itself needs a live
// `Deck`/WebGL canvas this package's jsdom test environment does not provide.
describe("chooseFitTarget (2026-08-14 walkthrough A7 fix)", () => {
  const resident = { xmin: 0, ymin: 0, xmax: 10, ymax: 10 };
  const anchor = { xmin: -50, ymin: -50, xmax: 100, ymax: 100 };

  it("prefers current residency when it is non-null, even if the anchor covers more", () => {
    expect(chooseFitTarget(resident, anchor)).toEqual(resident);
  });

  it("falls back to the dataset-lifetime anchor when residency has been emptied (panned fully off-data)", () => {
    expect(chooseFitTarget(null, anchor)).toEqual(anchor);
  });

  it("returns null only when neither residency nor the anchor has ever seen any geometry", () => {
    expect(chooseFitTarget(null, null)).toBeNull();
  });
});

// 2026-08-14 walkthrough A7 fix, second half (coordinator-authorized completion): giving
// `fitToBounds` a fit target (`chooseFitTarget` above) moves the camera there, but nothing was
// re-fetched for that location -- `bboxForFit` is the pure "compute the bbox to emit" half of the
// fix, exercised directly here for the same reason `chooseFitTarget` is: `WorkingCanvas.fitToExtent`
// itself needs a live `Deck`/WebGL canvas this package's jsdom test environment does not provide.
describe("bboxForFit (2026-08-14 walkthrough A7 fix, second half)", () => {
  it("reconstructs the authoritative viewport bbox from a fit's zoom and the post-recenter frame origin", () => {
    // zoom=2 -> pixelsPerMetre=4; widthPx=800/heightPx=400 -> half-extents 100m/50m either side of
    // the origin (`fit.target` is always [0,0], so world coords collapse to the origin itself).
    const fit = { target: [0, 0] as [number, number], zoom: 2, centerX: 999, centerY: 999 };
    const bbox = bboxForFit(fit, 100, 50, 800, 400);
    expect(bbox).toEqual({ xmin: 0, ymin: 0, xmax: 200, ymax: 100 });
  });

  it("is centered on the post-recenter origin, not on the fit's own centerX/centerY field", () => {
    // A caller who forgot to recenter the frame before calling this (passing some other origin)
    // gets a bbox centered on whatever origin it actually passed, not silently re-derived from
    // `fit.centerX`/`fit.centerY` -- this function trusts its own `frameOriginX`/`frameOriginY`
    // parameters, matching `fitToExtent`'s own doc comment ("read now, i.e. AFTER forceRecenter").
    const fit = { target: [0, 0] as [number, number], zoom: 0, centerX: 12345, centerY: 12345 };
    const bbox = bboxForFit(fit, 10, 20, 1000, 1000);
    expect(bbox.xmin + bbox.xmax).toBeCloseTo(20, 9); // centered on x=10, not x=12345
    expect(bbox.ymin + bbox.ymax).toBeCloseTo(40, 9); // centered on y=20, not y=12345
  });

  it("covers the original extent a fit was computed for, once the frame recenters to that fit's own center (margin only ever grows the box)", () => {
    const original = { xmin: 2_600_000, ymin: 1_200_000, xmax: 2_600_100, ymax: 1_200_050 };
    const widthPx = 1000;
    const heightPx = 800;
    const fit = fitViewStateForBbox(original, widthPx, heightPx);
    // Simulates `fitToExtent`'s own sequence: `OffsetFrame.forceRecenter(fit.centerX, fit.centerY)`
    // moves the origin there, then this function is called with that same, now-current origin.
    const bbox = bboxForFit(fit, fit.centerX, fit.centerY, widthPx, heightPx);
    expect(bbox.xmin).toBeLessThanOrEqual(original.xmin);
    expect(bbox.ymin).toBeLessThanOrEqual(original.ymin);
    expect(bbox.xmax).toBeGreaterThanOrEqual(original.xmax);
    expect(bbox.ymax).toBeGreaterThanOrEqual(original.ymax);
  });
});
