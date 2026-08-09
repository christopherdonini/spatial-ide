import { describe, expect, it } from "vitest";

import { OffsetFrame, offsetPositions, recenterThresholdForBudget } from "./offsetFrame";

// Ported from the concluded ADR-003 spike's offset-frame.test.ts. Pure logic, no DOM/GPU -- this
// validates the CPU-side arithmetic ADR-010 rule 3 depends on, not what a real WebGL2 upload does
// (that is the spike's own M2 measurement, inherited by keeping this formula unchanged).

describe("recenterThresholdForBudget", () => {
  it("matches the documented f32-ULP-vs-pixel-budget formula", () => {
    const pxPerM = 7.559055; // the spike's 1:500 scale
    const budgetPx = 0.5;
    const expected = budgetPx / (Math.pow(2, -24) * pxPerM);
    expect(recenterThresholdForBudget(pxPerM, budgetPx, Number.MAX_SAFE_INTEGER)).toBe(expected);
  });

  it("caps at maxM regardless of how generous the budget is", () => {
    expect(recenterThresholdForBudget(0.001, 1000, 131_072)).toBe(131_072);
  });
});

describe("offsetPositions", () => {
  it("subtracts origin in f64 before narrowing -- the order is the whole point", () => {
    const origin = 2_659_500;
    const x = new Float64Array([2_659_500.123456]);
    const y = new Float64Array([1_185_500.654321]);
    const out = offsetPositions(x, y, origin, 1_185_500);
    expect(out[0]).toBe(Math.fround(2_659_500.123456 - origin));
    expect(out[1]).toBe(Math.fround(1_185_500.654321 - 1_185_500));
  });

  it("origin (0,0) is the naive-absolute-f32 control the spike's M2 measured against", () => {
    const x = new Float64Array([2_659_500.123456]);
    const y = new Float64Array([1_185_500.654321]);
    const out = offsetPositions(x, y, 0, 0);
    expect(out[0]).toBe(Math.fround(2_659_500.123456));
    expect(out[1]).toBe(Math.fround(1_185_500.654321));
  });

  it("interleaves x/y pairs correctly for a multi-point buffer", () => {
    const x = new Float64Array([100, 200, 300]);
    const y = new Float64Array([10, 20, 30]);
    const out = offsetPositions(x, y, 0, 0);
    expect(Array.from(out)).toEqual([100, 10, 200, 20, 300, 30]);
  });
});

describe("OffsetFrame", () => {
  it("the first maybeRecenter call always recenters (initial placement)", () => {
    const frame = new OffsetFrame(100);
    expect(frame.maybeRecenter(2_659_500, 1_185_500)).toBe(true);
    expect(frame.originX).toBe(2_659_500);
    expect(frame.originY).toBe(1_185_500);
    expect(frame.recenterCount).toBe(1);
  });

  it("does not recenter below the drift threshold", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(0, 0);
    expect(frame.maybeRecenter(50, 50)).toBe(false); // hypot(50,50) ~= 70.7, under 100
    expect(frame.originX).toBe(0);
    expect(frame.recenterCount).toBe(1);
  });

  it("recenters past the drift threshold and records the event (docs/01 principle 8)", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(0, 0);
    expect(frame.maybeRecenter(1000, 1000)).toBe(true);
    expect(frame.recenterCount).toBe(2);
    expect(frame.events).toHaveLength(2);
    const last = frame.events[1];
    expect(last.fromX).toBe(0);
    expect(last.toX).toBe(1000);
    expect(last.driftM).toBeGreaterThan(100);
  });

  it("toLocal / toF32Positions are consistent with the current origin", () => {
    const frame = new OffsetFrame(100);
    frame.maybeRecenter(2_659_500, 1_185_500);
    const [localX, localY] = frame.toLocal(2_659_600, 1_185_600);
    expect(localX).toBe(100);
    expect(localY).toBe(100);
    const f32 = frame.toF32Positions(new Float64Array([2_659_600]), new Float64Array([1_185_600]));
    expect(f32[0]).toBe(Math.fround(100));
    expect(f32[1]).toBe(Math.fround(100));
  });
});
