// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import fc from "fast-check";
import { describe, expect, it } from "vitest";

import { buildLayers } from "./buildLayers";
import type { ResolvedDrawParams } from "./buildLayers";
import type { ResidentBatch } from "./decodeBatch";
import { OffsetFrame, RECENTER_BUDGET_PX, RECENTER_MAX_DRIFT, recenterThresholdForBudget } from "./offsetFrame";
import { partsOfFeatures } from "../testUtils/partsOfPolygons";

/**
 * The property-testing trial's P1 (its preregistration, section 3): changing the frame origin keeps the
 * drawn map within the pixel budget, on the shell's own frame path. The functions are the ones the
 * view-state handler (`WorkingCanvas.tsx`) and the layer builder call, in the handler's order: a real
 * `OffsetFrame`, `recenterThresholdForBudget`, and `buildLayers`, whose vertex coordinates come from
 * `frame.toLocal`.
 *
 * The drawn position of a vertex in a frame is (`Math.fround` of its local coordinate in the layer's
 * `data`, minus the camera target in that frame) times 2^z CSS px. `Math.fround` models deck's f32
 * attribute store; deck's own attribute and viewport arithmetic is not run. The exact position is
 * (p - W) * 2^z, from the vertex and the camera's world point alone, not through `toLocal`.
 *
 * The bound is RECENTER_BUDGET_PX plus 0.001 px, declared before any run: the threshold is solved for
 * an offset of magnitude T, a vertex's offset exceeds T by the drift past the bound and by its own
 * distance from the camera, and an f32 store errs by at most 2^-24 of the magnitude it stores. Over
 * this domain that is at most 2^-24 * (2000 + 2 * 1102) px, about 0.00025 px, plus f64 rounding below
 * 0.000001 px. It is not the strict budget (a strict test fails by design; see the fixed case below).
 *
 * Outside the domain, not tested: a drift reached inside a drag longer than 2000 CSS px or inside a
 * transition, and a zoom change inside a deferred drag or transition.
 */
const SLACK_PX = 0.001;
const BOUND_PX = RECENTER_BUDGET_PX + SLACK_PX;

type Unit = "metre" | "degree";

/** `origin` is the first frame's origin O; `world` the camera's world point W (one gesture at a fixed
 * zoom `z`); `vertices` are absolute coordinates, one single-vertex part each. */
interface Scenario {
  unit: Unit;
  z: number;
  origin: [number, number];
  world: [number, number];
  vertices: Array<[number, number]>;
}

const DRAW: ResolvedDrawParams = { fillColor: [0, 0, 0, 255], outlineColor: [0, 0, 0, 255], outlineWidth: 0 };

/** One point batch of one-vertex parts, built the way `buildLayers.test.ts` builds its batches. */
function pointBatch(vertices: Array<[number, number]>): ResidentBatch {
  return {
    streamHandle: "sh_p",
    batchSeq: 0,
    ids: BigUint64Array.from(vertices.map((_, i) => BigInt(i))),
    ...partsOfFeatures(vertices.map((v) => [[[v]]])),
    totalVertices: vertices.length,
    attributes: null,
    filter: null,
  };
}

function layerData(batch: ResidentBatch, frame: OffsetFrame): Array<[number, number]> {
  const [layer] = buildLayers([batch], frame, DRAW, "point");
  return layer.props.data as Array<[number, number]>;
}

function drawn(local: Array<[number, number]>, target: [number, number], scale: number): Array<[number, number]> {
  return local.map(([x, y]) => [(Math.fround(x) - target[0]) * scale, (Math.fround(y) - target[1]) * scale]);
}

/** The largest, over the vertices, of: the drawn error in frame 1, in frame 2, and the move of the
 * drawn position across the change of origin. Euclidean, in CSS px. */
function measure(s: Scenario): { frame1: number; frame2: number; jump: number } {
  const scale = 2 ** s.z;
  const threshold = recenterThresholdForBudget(scale, RECENTER_BUDGET_PX, RECENTER_MAX_DRIFT[s.unit]);
  const frame = new OffsetFrame(0);
  frame.setThreshold(threshold);
  expect(frame.maybeRecenter(s.origin[0], s.origin[1]), "the first call places the frame").toBe(true);
  const batch = pointBatch(s.vertices);
  const local1 = layerData(batch, frame);
  const target1 = frame.toLocal(s.world[0], s.world[1]);

  // The handler's next tick, in its order: setThreshold, maybeRecenter at the camera's world point, then the
  // rebased target. W is passed as generated, not recovered as target + origin, so that this step does not
  // itself depend on `toLocal`: the property below is what must see a defect there.
  frame.setThreshold(threshold);
  expect(frame.maybeRecenter(s.world[0], s.world[1]), "the camera is past the bound, so the origin moves").toBe(true);
  expect([frame.originX, frame.originY]).toEqual(s.world);
  const target2 = frame.toLocal(s.world[0], s.world[1]);
  const local2 = layerData(batch, frame);
  expect(local1).toHaveLength(s.vertices.length);
  expect(local2).toHaveLength(s.vertices.length);

  const exact = s.vertices.map(([x, y]) => [(x - s.world[0]) * scale, (y - s.world[1]) * scale]);
  const drawn1 = drawn(local1, target1, scale);
  const drawn2 = drawn(local2, target2, scale);
  const out = { frame1: 0, frame2: 0, jump: 0 };
  exact.forEach(([ex, ey], i) => {
    out.frame1 = Math.max(out.frame1, Math.hypot(drawn1[i][0] - ex, drawn1[i][1] - ey));
    out.frame2 = Math.max(out.frame2, Math.hypot(drawn2[i][0] - ex, drawn2[i][1] - ey));
    out.jump = Math.max(out.jump, Math.hypot(drawn1[i][0] - drawn2[i][0], drawn1[i][1] - drawn2[i][1]));
  });
  return out;
}

function holds(s: Scenario): void {
  const m = measure(s);
  expect(m.frame1, "frame 1: drawn against exact, px").toBeLessThanOrEqual(BOUND_PX);
  expect(m.frame2, "frame 2: drawn against exact, px").toBeLessThanOrEqual(BOUND_PX);
  expect(m.jump, "the change of origin: drawn position moved, px").toBeLessThanOrEqual(BOUND_PX);
}

const originArb = fc.oneof(
  fc.record({
    unit: fc.constant<Unit>("metre"),
    x: fc.double({ min: 2_400_000, max: 2_900_000, noNaN: true }),
    y: fc.double({ min: 1_000_000, max: 1_400_000, noNaN: true }),
  }),
  fc.record({
    unit: fc.constant<Unit>("degree"),
    x: fc.double({ min: -180, max: 180, noNaN: true }),
    y: fc.double({ min: -90, max: 90, noNaN: true }),
  })
);

const zoomArb = fc.oneof(fc.integer({ min: -8, max: 16 }), fc.double({ min: -8, max: 16, noNaN: true }));

/** W is held at a drift from O of T + 1/2^z to T + 2000/2^z (1 to 2000 CSS px past the bound); 1 to 16
 * vertices lie inside a 1920 x 1080 CSS-px viewport centred on W. */
const scenarioArb: fc.Arbitrary<Scenario> = fc
  .record({
    origin: originArb,
    z: zoomArb,
    pastBoundPx: fc.double({ min: 1, max: 2000, noNaN: true }),
    angle: fc.double({ min: 0, max: 2 * Math.PI, noNaN: true }),
    pixels: fc.array(
      fc.tuple(fc.double({ min: -960, max: 960, noNaN: true }), fc.double({ min: -540, max: 540, noNaN: true })),
      { minLength: 1, maxLength: 16 }
    ),
  })
  .map(({ origin, z, pastBoundPx, angle, pixels }): Scenario => {
    const scale = 2 ** z;
    const threshold = recenterThresholdForBudget(scale, RECENTER_BUDGET_PX, RECENTER_MAX_DRIFT[origin.unit]);
    const drift = threshold + pastBoundPx / scale;
    const world: [number, number] = [origin.x + drift * Math.cos(angle), origin.y + drift * Math.sin(angle)];
    return {
      unit: origin.unit,
      z,
      origin: [origin.x, origin.y],
      world,
      vertices: pixels.map(([px, py]): [number, number] => [world[0] + px / scale, world[1] + py / scale]),
    };
  });

// Fixed case: the architect's constructed case at z = 6 (T = 131072 m), 32 px past the bound. The vertex's
// x lies on the midpoint of the 1/64 m f32 grid, so one axis alone rounds by 0.5 px.
// Measured 0.5000000000005775 px in frame 1: the strict 0.5 px budget is exceeded here, the declared bound is not.
const CONSTRUCTED_CASE: Scenario = {
  unit: "metre",
  z: 6,
  origin: [2_500_000, 1_200_000],
  world: [2_631_072.5, 1_200_000],
  vertices: [[2_631_072.0078125, 1_200_000.3]],
};

describe("the re-centre pixel budget, on the shell's own frame path (property)", () => {
  it("a change of origin keeps the drawn map within the budget plus its declared slack, over 200 generated cases", () => {
    fc.assert(fc.property(scenarioArb, holds), { numRuns: 200 });
  });

  it("the constructed case holds the same property: past the strict budget, within the declared bound", () => {
    holds(CONSTRUCTED_CASE);
  });
});
