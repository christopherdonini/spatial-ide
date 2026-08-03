// CI item "CRS/local-frame calculations" (see .github/workflows/spike-ci.yml).
// Pure logic, no DOM/WebView2/GPU -- runs identically on any platform Node
// runs on. Node's native TypeScript type-stripping runs this file directly,
// no build step or test-framework dependency (`node --test`, Node >=22.6).
// This does NOT validate what M2 actually measured (f32 upload behaviour
// inside a real WebGL2 context, on real driver/ANGLE stacks) -- only that
// the CPU-side arithmetic ADR-003's offset-relative technique depends on
// behaves as documented, on any platform.

import { test } from "node:test";
import assert from "node:assert/strict";
import { OffsetFrame, offsetPositions, recenterThresholdForBudget } from "./offset-frame.ts";

test("recenterThresholdForBudget: matches the documented f32-ULP-vs-pixel-budget formula", () => {
  // f32RelativePrecision = 2^-24; threshold = budgetPx / (2^-24 * pxPerM).
  // maxM passed explicitly high so this test isolates the formula itself
  // from the sanity-ceiling clamp, which has its own dedicated test below
  // (M2/M3's real 1:500/0.5px inputs actually exceed the default 131,072 m
  // ceiling and get clamped -- a real interaction, not a reason to avoid
  // testing the formula on its own terms here).
  const pxPerM = 7.559055; // M2/M3's 1:500 scale
  const budgetPx = 0.5;
  const expected = budgetPx / (Math.pow(2, -24) * pxPerM);
  assert.equal(recenterThresholdForBudget(pxPerM, budgetPx, Number.MAX_SAFE_INTEGER), expected);
});

test("recenterThresholdForBudget: caps at maxM regardless of how generous the budget is", () => {
  // A huge budget or tiny pxPerM would otherwise compute a threshold far
  // past what's sane to let the origin drift -- maxM is a sanity ceiling,
  // not a precision-derived value, per the function's own doc comment.
  const threshold = recenterThresholdForBudget(0.001, 1000, 131_072);
  assert.equal(threshold, 131_072);
});

test("offsetPositions: subtracts origin in f64 before narrowing (order is the whole point)", () => {
  // A value whose f32 rendering would be wrong if narrowed BEFORE
  // subtracting: 2_659_500.123456 has more precision than f32 can hold
  // directly, but (value - origin) is small and narrows losslessly.
  const origin = 2_659_500;
  const e = new Float64Array([2_659_500.123456]);
  const n = new Float64Array([1_185_500.654321]);
  const out = offsetPositions(e, n, origin, 1_185_500);
  // Math.fround is the correctly-rounded f32 narrowing of the f64
  // subtraction result -- this is what "subtract first, narrow second"
  // should produce, bit-for-bit.
  assert.equal(out[0], Math.fround(2_659_500.123456 - origin));
  assert.equal(out[1], Math.fround(1_185_500.654321 - 1_185_500));
});

test("offsetPositions: origin (0,0) is the naive-absolute-f32 control M2 measured against", () => {
  const e = new Float64Array([2_659_500.123456]);
  const n = new Float64Array([1_185_500.654321]);
  const out = offsetPositions(e, n, 0, 0);
  assert.equal(out[0], Math.fround(2_659_500.123456));
  assert.equal(out[1], Math.fround(1_185_500.654321));
});

test("offsetPositions: interleaves e/n pairs correctly for a multi-point buffer", () => {
  const e = new Float64Array([100, 200, 300]);
  const n = new Float64Array([10, 20, 30]);
  const out = offsetPositions(e, n, 0, 0);
  assert.deepEqual(Array.from(out), [100, 10, 200, 20, 300, 30]);
});

test("OffsetFrame: first maybeRecenter call always recenters (initial placement)", () => {
  const frame = new OffsetFrame(100);
  const moved = frame.maybeRecenter(2_659_500, 1_185_500);
  assert.equal(moved, true);
  assert.equal(frame.originE, 2_659_500);
  assert.equal(frame.originN, 1_185_500);
  assert.equal(frame.recenterCount, 1);
});

test("OffsetFrame: does not recenter below the drift threshold", () => {
  const frame = new OffsetFrame(100);
  frame.maybeRecenter(0, 0);
  const moved = frame.maybeRecenter(50, 50); // hypot(50,50) ~= 70.7, under 100
  assert.equal(moved, false);
  assert.equal(frame.originE, 0);
  assert.equal(frame.recenterCount, 1);
});

test("OffsetFrame: recenters past the drift threshold and records the event (docs/01 principle 8: no silent transforms)", () => {
  const frame = new OffsetFrame(100);
  frame.maybeRecenter(0, 0);
  const moved = frame.maybeRecenter(1000, 1000);
  assert.equal(moved, true);
  assert.equal(frame.recenterCount, 2);
  assert.equal(frame.events.length, 2);
  const last = frame.events[1];
  assert.equal(last.fromE, 0);
  assert.equal(last.toE, 1000);
  assert.ok(last.driftM > 100);
});

test("OffsetFrame.toF32Positions / toLocal are consistent with the current origin", () => {
  const frame = new OffsetFrame(100);
  frame.maybeRecenter(2_659_500, 1_185_500);
  const [localE, localN] = frame.toLocal(2_659_600, 1_185_600);
  assert.equal(localE, 100);
  assert.equal(localN, 100);
  const f32 = frame.toF32Positions(new Float64Array([2_659_600]), new Float64Array([1_185_600]));
  assert.equal(f32[0], Math.fround(100));
  assert.equal(f32[1], Math.fround(100));
});
