// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

import { describe, expect, it } from "vitest";

import { computeAuthoritativeViewportBbox, viewportAfterResize } from "./viewportBbox";
import type { ViewportCamera } from "./viewportBbox";

describe("computeAuthoritativeViewportBbox", () => {
  it("centers the box on the authoritative target (local target + origin)", () => {
    const bbox = computeAuthoritativeViewportBbox({
      targetX: 0,
      targetY: 0,
      zoom: 0, // 1 world unit == 1 px
      widthPx: 200,
      heightPx: 100,
      originX: 2_600_000,
      originY: 1_200_000,
    });
    expect(bbox.xmin).toBe(2_600_000 - 100);
    expect(bbox.xmax).toBe(2_600_000 + 100);
    expect(bbox.ymin).toBe(1_200_000 - 50);
    expect(bbox.ymax).toBe(1_200_000 + 50);
  });

  it("a non-zero local target is added to the origin before computing bounds", () => {
    const bbox = computeAuthoritativeViewportBbox({
      targetX: 10,
      targetY: -5,
      zoom: 0,
      widthPx: 10,
      heightPx: 10,
      originX: 1_000,
      originY: 2_000,
    });
    expect(bbox.xmin).toBe(1_005);
    expect(bbox.xmax).toBe(1_015);
    expect(bbox.ymin).toBe(1_990);
    expect(bbox.ymax).toBe(2_000);
  });

  it("higher zoom halves the world-space extent per unit increase", () => {
    const base = computeAuthoritativeViewportBbox({
      targetX: 0,
      targetY: 0,
      zoom: 0,
      widthPx: 100,
      heightPx: 100,
      originX: 0,
      originY: 0,
    });
    const zoomedIn = computeAuthoritativeViewportBbox({
      targetX: 0,
      targetY: 0,
      zoom: 1,
      widthPx: 100,
      heightPx: 100,
      originX: 0,
      originY: 0,
    });
    const baseWidth = base.xmax - base.xmin;
    const zoomedWidth = zoomedIn.xmax - zoomedIn.xmin;
    expect(zoomedWidth).toBeCloseTo(baseWidth / 2, 10);
  });
});

// The decision a change of the canvas's CSS size asks of the viewport query (RF1 to RF6). The camera is
// the one the canvas last wrote; the box last asked for is the camera's view at 800 x 600 CSS px.
describe("viewportAfterResize (shell-map-refill-after-resize)", () => {
  const camera: ViewportCamera = { targetX: 10, targetY: -5, zoom: 0, originX: 1_000, originY: 2_000 };
  const boxAt = (widthPx: number, heightPx: number) => computeAuthoritativeViewportBbox({ ...camera, widthPx, heightPx });
  const lastQueried = boxAt(800, 600);

  it("RF1: wider at the same height after a query is a query, with the box of the camera at the new size", () => {
    expect(viewportAfterResize(camera, lastQueried, 1_000, 600)).toEqual({ kind: "query", bbox: boxAt(1_000, 600) });
  });

  it("RF2: narrower, or no larger than the last query on either side, is within the last query -- never a query", () => {
    expect(viewportAfterResize(camera, lastQueried, 400, 300)).toEqual({ kind: "within", bbox: boxAt(400, 300) });
    expect(viewportAfterResize(camera, lastQueried, 800, 500)).toEqual({ kind: "within", bbox: boxAt(800, 500) });
    expect(viewportAfterResize(camera, lastQueried, 700, 600)).toEqual({ kind: "within", bbox: boxAt(700, 600) });
  });

  it("RF3: taller only (the Activity region closed) is a query", () => {
    expect(viewportAfterResize(camera, lastQueried, 800, 700)).toEqual({ kind: "query", bbox: boxAt(800, 700) });
  });

  it("RF4: with no reported view yet, or no camera, a size change asks for nothing", () => {
    expect(viewportAfterResize(camera, null, 1_000, 700)).toEqual({ kind: "none" });
    expect(viewportAfterResize(null, lastQueried, 1_000, 700)).toEqual({ kind: "none" });
    expect(viewportAfterResize(null, null, 1_000, 700)).toEqual({ kind: "none" });
  });

  it("RF5: a zero, negative or non-finite size asks for nothing", () => {
    const sizes: Array<[number, number]> = [[0, 600], [800, 0], [-800, 600], [800, -1], [NaN, 600], [800, NaN], [Infinity, 600], [800, Infinity]];
    for (const [w, h] of sizes) expect(viewportAfterResize(camera, lastQueried, w, h), `${w} x ${h}`).toEqual({ kind: "none" });
  });

  it("RF6: the same camera at the same size is within the last query, with a box bit-identical to it", () => {
    const decision = viewportAfterResize(camera, lastQueried, 800, 600);
    expect(decision.kind).toBe("within");
    if (decision.kind === "none") throw new Error("unreachable");
    for (const edge of ["xmin", "ymin", "xmax", "ymax"] as const) {
      expect(Object.is(decision.bbox[edge], lastQueried[edge]), edge).toBe(true);
    }
  });
});
