import { describe, expect, it } from "vitest";

import { computeAuthoritativeViewportBbox } from "./viewportBbox";

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
