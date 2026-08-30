#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Plain Node unit test for `residencyTrace.mjs`'s committed pure functions -- NOT part of
// `npm run test` (vitest's own `include` is `src/**/*.test.ts`/`.test.tsx` only, matching every
// other file directly under `e2e/`, none of which run under vitest either). Run directly:
//   node e2e/residencyTrace.test.mjs
// Exits non-zero on any failure, matching this repository's e2e scripts' own exit-code convention.

import assert from "node:assert/strict";

import {
  abbaInterleave,
  CAMERA_TRACE_STEPS,
  G7_COLD_FIRST_VIEW_MARGIN_PROPOSED,
  isWellFormedSettleCriterion,
  MAX_IN_FLIGHT_TILE_STREAMS_PROPOSED,
  percentileNearestRank,
  SETTLE_PER_STEP_TIMEOUT_MS,
  SETTLE_QUIET_MS,
  TILE_SIZE_LEVELS_PROPOSED,
  TRACE_VERSION,
  validateCameraTrace,
} from "./residencyTrace.mjs";

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.error(`  FAIL - ${name}`);
    console.error(`    ${e.stack ?? e.message}`);
  }
}

/** N3 fix's own async sibling -- `test` above never awaits `fn()`, so an async test body's own
 * rejection would silently escape as an unhandled rejection rather than being counted as a failure.
 * Used ONLY where a test genuinely needs `await` (dynamic `import()`, below) -- every other test in
 * this file stays synchronous via `test` unchanged. Node ESM supports top-level `await`, so callers
 * `await testAsync(...)` at module scope, keeping this file's overall test order deterministic. */
async function testAsync(name, fn) {
  try {
    await fn();
    passed++;
    console.log(`  ok - ${name}`);
  } catch (e) {
    failed++;
    console.error(`  FAIL - ${name}`);
    console.error(`    ${e.stack ?? e.message}`);
  }
}

console.log("residencyTrace.mjs -- CAMERA_TRACE_STEPS");

test("has exactly 11 steps (RESIDENCY-PREREGISTRATION.md §4b)", () => {
  assert.equal(CAMERA_TRACE_STEPS.length, 11);
});

test("step ids are exactly, and in order: fit, 5 pans, 3 zoom-ins, 1 zoom-out, zoom-to-layer", () => {
  assert.deepEqual(
    CAMERA_TRACE_STEPS.map((s) => s.id),
    [
      "fit",
      "pan-north",
      "pan-east",
      "pan-south",
      "pan-west",
      "pan-northeast",
      "zoom-in-1",
      "zoom-in-2",
      "zoom-in-3",
      "zoom-out-1",
      "zoom-to-layer",
    ]
  );
});

test("validateCameraTrace(CAMERA_TRACE_STEPS) reports zero problems -- the committed trace is well-formed", () => {
  assert.deepEqual(validateCameraTrace(CAMERA_TRACE_STEPS), []);
});

test("every step's settle criterion is well-formed (isWellFormedSettleCriterion)", () => {
  for (const step of CAMERA_TRACE_STEPS) {
    assert.ok(isWellFormedSettleCriterion(step.settle), `step ${step.id}'s settle criterion is not well-formed`);
  }
});

test("every step's settle criterion is IDENTICAL (§4b: 'identical at every step')", () => {
  for (const step of CAMERA_TRACE_STEPS) {
    assert.equal(step.settle.quietMs, SETTLE_QUIET_MS);
    assert.equal(step.settle.timeoutMs, SETTLE_PER_STEP_TIMEOUT_MS);
  }
});

test("quietMs is 300ms and timeoutMs is 5000ms, per §4b/§7", () => {
  assert.equal(SETTLE_QUIET_MS, 300);
  assert.equal(SETTLE_PER_STEP_TIMEOUT_MS, 5_000);
});

test("CAMERA_TRACE_STEPS and every step are frozen (Object.isFrozen) -- nothing, including a careless driver, can mutate the committed trace out from under a later step", () => {
  assert.ok(Object.isFrozen(CAMERA_TRACE_STEPS));
  for (const step of CAMERA_TRACE_STEPS) {
    assert.ok(Object.isFrozen(step), `step ${step.id} is not frozen`);
  }
});

// N3 (P1b reviewer-gate remediation): the test ABOVE used to be misnamed "calling CAMERA_TRACE_STEPS
// twice in the same process yields deep-equal, frozen arrays" while its own body never called
// anything twice and never asserted a deep-equal comparison -- only freeze-ness. Fixed two ways: the
// test above is renamed to what it actually does, and THIS test genuinely does what the old name
// claimed -- re-imports this module as a FRESH ESM module instance (a cache-busting query string
// forces Node's module loader to re-evaluate `residencyTrace.mjs` from scratch, not return the
// already-cached instance `import` at this file's top already holds) and asserts the two
// independently-produced `CAMERA_TRACE_STEPS` arrays are deep-equal but NOT the same object
// reference -- the real "the trace is DATA, not incidentally-shared identity" claim.
await testAsync(
  "re-importing this module as a fresh instance yields a deep-equal, but not reference-equal, CAMERA_TRACE_STEPS (N3: the trace is DATA)",
  async () => {
    // A query string distinct from the static top-of-file import specifier forces Node's ESM loader
    // to instantiate a genuinely SEPARATE module record, not return the already-cached one.
    const fresh = await import("./residencyTrace.mjs?fresh-instance-check");
    assert.deepEqual(fresh.CAMERA_TRACE_STEPS, CAMERA_TRACE_STEPS);
    assert.notEqual(fresh.CAMERA_TRACE_STEPS, CAMERA_TRACE_STEPS);
  }
);

test("TRACE_VERSION (M9) is a declared, non-empty string literal", () => {
  assert.equal(typeof TRACE_VERSION, "string");
  assert.ok(TRACE_VERSION.length > 0);
});

test("validateCameraTrace flags a malformed trace instead of throwing", () => {
  const problems = validateCameraTrace([
    { id: "a", kind: "not-a-real-kind", params: {}, settle: { quietMs: 300, timeoutMs: 5000 } },
    { id: "a", kind: "pan", params: {}, settle: { quietMs: 300, timeoutMs: 5000 } }, // duplicate id
    { id: "b", kind: "pan", params: {}, settle: { quietMs: 5000, timeoutMs: 300 } }, // timeout < quiet
  ]);
  assert.ok(problems.length >= 3, `expected at least 3 problems, got ${problems.length}: ${JSON.stringify(problems)}`);
});

console.log("");
console.log("residencyTrace.mjs -- abbaInterleave (ABBA, committed pure function)");

test("is a pure function -- the SAME inputs produce the SAME output on repeated calls", () => {
  const a = abbaInterleave(3, 2);
  const b = abbaInterleave(3, 2);
  assert.deepEqual(a, b);
});

test("cellCount=1 (nothing to interleave against) returns trialsPerCell entries, all cellIndex 0", () => {
  const order = abbaInterleave(1, 4);
  assert.equal(order.length, 4);
  assert.ok(order.every((e) => e.cellIndex === 0));
  assert.deepEqual(
    order.map((e) => e.trial),
    [0, 1, 2, 3]
  );
});

test("two cells (baseline + one candidate), 2 trials -- the classic ABBA block, both trials", () => {
  const order = abbaInterleave(2, 2);
  // trial 0 (even): A,B. trial 1 (odd): B,A. Concatenated: A,B,B,A -- the literal ABBA shape.
  assert.deepEqual(order, [
    { cellIndex: 0, trial: 0 },
    { cellIndex: 1, trial: 0 },
    { cellIndex: 1, trial: 1 },
    { cellIndex: 0, trial: 1 },
  ]);
});

test("every candidate cell is paired against baseline (cellIndex 0) exactly trialsPerCell times", () => {
  const cellCount = 4; // baseline + coarse + medium + fine
  const trialsPerCell = 3;
  const order = abbaInterleave(cellCount, trialsPerCell);
  for (let candidate = 1; candidate < cellCount; candidate++) {
    const count = order.filter((e) => e.cellIndex === candidate).length;
    assert.equal(count, trialsPerCell, `cell ${candidate} appears ${count} times, expected ${trialsPerCell}`);
  }
  // Baseline appears once per candidate block, per trial -- (cellCount - 1) * trialsPerCell times.
  const baselineCount = order.filter((e) => e.cellIndex === 0).length;
  assert.equal(baselineCount, (cellCount - 1) * trialsPerCell);
});

test("is a fixed permutation -- output length is exactly 2*(cellCount-1)*trialsPerCell for cellCount>1", () => {
  const order = abbaInterleave(4, 3);
  assert.equal(order.length, 2 * (4 - 1) * 3);
});

test("baseline is never isolated at one end of a candidate's block -- every ABBA block starts AND ends at baseline or candidate symmetrically", () => {
  const order = abbaInterleave(2, 4);
  // Reconstruct blocks of 2 (one per trial) and confirm the ABBA alternation itself, not just counts.
  for (let t = 0; t < 4; t++) {
    const block = order.filter((e) => e.trial === t);
    assert.equal(block.length, 2);
    if (t % 2 === 0) {
      assert.deepEqual(block.map((e) => e.cellIndex), [0, 1]);
    } else {
      assert.deepEqual(block.map((e) => e.cellIndex), [1, 0]);
    }
  }
});

test("rejects a non-positive-integer cellCount or trialsPerCell rather than silently producing garbage", () => {
  assert.throws(() => abbaInterleave(0, 1));
  assert.throws(() => abbaInterleave(1, 0));
  assert.throws(() => abbaInterleave(1.5, 1));
  assert.throws(() => abbaInterleave(1, -1));
});

console.log("");
console.log("residencyTrace.mjs -- percentileNearestRank (S2: declared, tested percentile convention)");

test("p95 equals the max for every n in [1, 20]", () => {
  for (let n = 1; n <= 20; n++) {
    const sorted = Array.from({ length: n }, (_, i) => i); // 0, 1, ..., n-1 -- max is n-1
    assert.equal(percentileNearestRank(sorted, 95), n - 1, `n=${n}: p95 should equal the max (${n - 1})`);
  }
});

test("at n=21, p95 first stops being the max", () => {
  const sorted = Array.from({ length: 21 }, (_, i) => i); // max is 20
  assert.equal(percentileNearestRank(sorted, 95), 19); // second-to-last, not 20
});

test("p50 of a 4-element sorted array: floor(0.5*4)=2 -> index 2", () => {
  assert.equal(percentileNearestRank([10, 20, 30, 40], 50), 30);
});

test("p50/p95/max agree with a hand-worked 10-element example", () => {
  const sorted = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // floor(0.5*10)=5 -> index 5 -> value 6
  assert.equal(percentileNearestRank(sorted, 50), 6);
  // floor(0.95*10)=9 -> index 9 -> value 10 (the max)
  assert.equal(percentileNearestRank(sorted, 95), 10);
  assert.equal(percentileNearestRank(sorted, 100), 10);
});

test("throws on an empty array rather than returning undefined silently", () => {
  assert.throws(() => percentileNearestRank([], 50));
});

console.log("");
console.log("residencyTrace.mjs -- proposed-pending-sight constants (parameterized, never hard-wired)");

test("G7 margin, tile-size levels, and max-in-flight are each named, single-source constants", () => {
  assert.equal(G7_COLD_FIRST_VIEW_MARGIN_PROPOSED, 1.1);
  assert.deepEqual(TILE_SIZE_LEVELS_PROPOSED, ["coarse", "medium", "fine"]);
  assert.equal(MAX_IN_FLIGHT_TILE_STREAMS_PROPOSED, 3);
  assert.ok(Object.isFrozen(TILE_SIZE_LEVELS_PROPOSED));
});

console.log("");
console.log(`== ${passed} passed, ${failed} failed ==`);
if (failed > 0) {
  process.exitCode = 1;
}
