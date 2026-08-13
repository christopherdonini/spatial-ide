import { describe, expect, it } from "vitest";

import type { PixelRegion } from "../e2e-test-surface";
import { summarizePixels } from "./WorkingCanvas";

// S6 (reviewer round, 2026-08-13): `summarizePixels`'s `samplePoint` logic (both the frame-wide
// densest-non-background-bin sample and each region's own first-non-background-hit sample) had no
// direct test -- only exercised indirectly through a real WebGL `readPixels` call this package has
// no DOM/WebGL harness to drive in a unit test. `summarizePixels` itself is pure (no DOM, no
// WebGL), so exporting it (`WorkingCanvas.tsx`'s own comment) is what makes it testable directly
// against a small synthetic RGBA buffer instead.

/** width=4, height=2 (row-major, buffer-native indexing -- `i = y*width + x`, the same convention
 * `summarizePixels` itself documents). Two pixels share one non-background color ("colorA",
 * appearing at (1,0) and (0,1)) -- the densest non-background bin -- and one pixel is a different,
 * less-frequent color ("colorB" at (1,1)); every other pixel is the exact background color
 * `0,0,0,0`. */
function syntheticBuffer(): Uint8Array {
  const pixels: Array<[number, number, number, number]> = [
    [0, 0, 0, 0], // (0,0) background
    [10, 20, 30, 255], // (1,0) colorA -- 1st occurrence
    [0, 0, 0, 0], // (2,0) background
    [0, 0, 0, 0], // (3,0) background
    [10, 20, 30, 255], // (0,1) colorA -- 2nd occurrence, makes colorA the densest non-bg bin
    [100, 100, 100, 255], // (1,1) colorB -- only occurrence
    [0, 0, 0, 0], // (2,1) background
    [0, 0, 0, 0], // (3,1) background
  ];
  const buf = new Uint8Array(pixels.length * 4);
  pixels.forEach(([r, g, b, a], i) => buf.set([r, g, b, a], i * 4));
  return buf;
}

function allBackgroundBuffer(width: number, height: number): Uint8Array {
  return new Uint8Array(width * height * 4); // every byte 0 -- exactly the background color
}

describe("summarizePixels samplePoint logic (S6)", () => {
  it("frame-wide samplePoint names the densest non-background bin's first-seen pixel", () => {
    const summary = summarizePixels(syntheticBuffer(), 4, 2, []);
    // colorA (count 2) outranks colorB (count 1); its bin's stored sample is the FIRST index it
    // was seen at, (1,0), not the second, (0,1).
    expect(summary.samplePoint).toEqual({ x: 1, y: 0 });
    expect(summary.nonBackgroundCount).toBe(3); // (1,0), (0,1), (1,1)
    expect(summary.totalPixels).toBe(8);
  });

  it("frame-wide samplePoint is null when every pixel is exactly the background color", () => {
    const summary = summarizePixels(allBackgroundBuffer(3, 3), 3, 3, []);
    expect(summary.samplePoint).toBeNull();
    expect(summary.nonBackgroundCount).toBe(0);
  });

  it("a region's samplePoint is the first non-background pixel encountered in that region's own row-major scan", () => {
    const regions: PixelRegion[] = [
      // Columns [0,2), both rows -- contains (1,0) [colorA], (0,1) [colorA], (1,1) [colorB].
      // Row-major scan order (y outer, x inner) hits (1,0) before either of the other two.
      { x: 0, y: 0, w: 0.5, h: 1 },
      // Columns [2,4), row 0 only -- both pixels ((2,0), (3,0)) are background.
      { x: 0.5, y: 0, w: 0.5, h: 0.5 },
    ];
    const summary = summarizePixels(syntheticBuffer(), 4, 2, regions);

    expect(summary.regions[0].samplePoint).toEqual({ x: 1, y: 0 });
    expect(summary.regions[0].nonBackgroundCount).toBe(3);

    expect(summary.regions[1].samplePoint).toBeNull();
    expect(summary.regions[1].nonBackgroundCount).toBe(0);
  });
});
