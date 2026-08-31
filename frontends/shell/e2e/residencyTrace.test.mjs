#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// Plain Node unit test for `residencyTrace.mjs`'s committed pure functions -- NOT part of
// `npm run test` (vitest's own `include` is `src/**/*.test.ts`/`.test.tsx` only, matching every
// other file directly under `e2e/`, none of which run under vitest either). P1d nit 17: an earlier
// version of this comment said "Run directly" as the only invocation path -- stale even at the time
// it was written, since `package.json`'s own `test:residency-trace` script (in turn part of
// `npm run verify`'s own chain) already wired this file in. Run via either:
//   npm run test:residency-trace   (also runs as part of `npm run verify`)
//   node e2e/residencyTrace.test.mjs   (the same script, invoked directly)
// Exits non-zero on any failure, matching this repository's e2e scripts' own exit-code convention.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  abbaInterleave,
  BANNER_DISMISS_CLICK_MAX_ATTEMPTS,
  CAMERA_TRACE_STEPS,
  dismissThenClickRetry,
  G7_COLD_FIRST_VIEW_MARGIN_PROPOSED,
  IDENTITY_VIEW_STATE_STEPS,
  isWellFormedSettleCriterion,
  MAX_IN_FLIGHT_TILE_STREAMS_PROPOSED,
  percentileNearestRank,
  SETTLE_PER_STEP_TIMEOUT_MS,
  SETTLE_PER_STEP_TIMEOUT_LARGE_FIXTURE_MS,
  SETTLE_PER_STEP_TIMEOUT_5GB_MS,
  SETTLE_TIMEOUT_BY_BASENAME_MS,
  settleTimeoutForFixture,
  SETTLE_QUIET_MS,
  TILE_SIZE_LEVELS_PROPOSED,
  TRACE_VERSION,
  TRIAL_WATCHDOG_MS,
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

test("step ids are exactly, and in order (amendment 10): fit, 5 pans, zoom-to-layer, 3 zoom-ins, 1 zoom-out", () => {
  assert.deepEqual(
    CAMERA_TRACE_STEPS.map((s) => s.id),
    [
      "fit",
      "pan-north",
      "pan-east",
      "pan-south",
      "pan-west",
      "pan-northeast",
      "zoom-to-layer",
      "zoom-in-1",
      "zoom-in-2",
      "zoom-in-3",
      "zoom-out-1",
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
  // Amendment 9 (proposed-pending-sight, LOCKED): the driver scales the per-step bound for the
  // Polygons class; the trace data itself stays fixture-agnostic. Pin the scaling here.
  assert.equal(SETTLE_PER_STEP_TIMEOUT_LARGE_FIXTURE_MS, 60_000);
  // Amendment 12 (2026-08-31): the 5 GB fixture gets its OWN, larger bound -- no longer shares
  // SETTLE_PER_STEP_TIMEOUT_LARGE_FIXTURE_MS with the Polygons class.
  assert.equal(SETTLE_PER_STEP_TIMEOUT_5GB_MS, 150_000);
  assert.deepEqual(SETTLE_TIMEOUT_BY_BASENAME_MS, {
    "polygons-100k.parquet": 60_000,
    "parcels-5gb.parquet": 150_000,
  });
  assert.ok(Object.isFrozen(SETTLE_TIMEOUT_BY_BASENAME_MS));
  assert.equal(settleTimeoutForFixture("C:\\x\\polygons-100k.parquet", 5_000), 60_000);
  assert.equal(settleTimeoutForFixture("/a/b/parcels-5gb.parquet", 5_000), 150_000);
  assert.equal(settleTimeoutForFixture("C:\\x\\filter-zoned.parquet", 5_000), 5_000);
});

test("TRIAL_WATCHDOG_MS (§7's own 180s figure) is kept exported at its ORIGINAL value, now historical (Amendment 12: the live outer watchdog is computed by residency-harness.mjs as (CAMERA_TRACE_STEPS.length + 1) * the resolved per-step bound, never this constant directly)", () => {
  assert.equal(TRIAL_WATCHDOG_MS, 180_000);
  // The historical figure's own documented relationship: on a SMALL fixture (resolved per-step
  // bound = SETTLE_PER_STEP_TIMEOUT_MS), the new formula stays comfortably under this constant.
  assert.ok((CAMERA_TRACE_STEPS.length + 1) * SETTLE_PER_STEP_TIMEOUT_MS < TRIAL_WATCHDOG_MS);
  // On the 5 GB fixture, the new formula now EXCEEDS the historical constant -- exactly the gap
  // Amendment 12 exists to close (the historical constant would have fired by construction).
  assert.ok((CAMERA_TRACE_STEPS.length + 1) * SETTLE_PER_STEP_TIMEOUT_5GB_MS > TRIAL_WATCHDOG_MS);
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
console.log("residencyTrace.mjs -- IDENTITY_VIEW_STATE_STEPS (§12 Amendment 6: the instrument-identity mode's deterministic camera script)");

test("has exactly 3 steps (residency-harness.mjs's own FIELD_SEQUENCE_STEP_LIMIT)", () => {
  assert.equal(IDENTITY_VIEW_STATE_STEPS.length, 3);
});

test("every step has a non-empty string id and finite targetX/targetY/zoom", () => {
  for (const step of IDENTITY_VIEW_STATE_STEPS) {
    assert.equal(typeof step.id, "string");
    assert.ok(step.id.length > 0);
    assert.ok(Number.isFinite(step.targetX), `${step.id}: targetX is not finite`);
    assert.ok(Number.isFinite(step.targetY), `${step.id}: targetY is not finite`);
    assert.ok(Number.isFinite(step.zoom), `${step.id}: zoom is not finite`);
  }
});

test("step ids are unique", () => {
  const ids = IDENTITY_VIEW_STATE_STEPS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("IDENTITY_VIEW_STATE_STEPS and every step are frozen (Object.isFrozen) -- a literal script, not mutable state", () => {
  assert.ok(Object.isFrozen(IDENTITY_VIEW_STATE_STEPS));
  for (const step of IDENTITY_VIEW_STATE_STEPS) {
    assert.ok(Object.isFrozen(step), `step ${step.id} is not frozen`);
  }
});

await testAsync(
  "is a pure, referentially-stable literal -- re-importing this module as a fresh instance yields a deep-equal IDENTITY_VIEW_STATE_STEPS",
  async () => {
    const fresh = await import("./residencyTrace.mjs?fresh-instance-check-identity");
    assert.deepEqual(fresh.IDENTITY_VIEW_STATE_STEPS, IDENTITY_VIEW_STATE_STEPS);
  }
);

test("residencyTrace.mjs's own CODE (comments stripped) contains no Math.random/Date.now/`new Date(` -- the identity script (and everything else this module declares) is deterministic data, never derived from a non-deterministic source, matching this module's own top doc comment (which names both tokens IN PROSE, hence the comment-stripping: a literal substring check without it would false-positive on the very sentence disclosing their absence)", () => {
  const src = readFileSync(new URL("./residencyTrace.mjs", import.meta.url), "utf8");
  const codeOnly = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.ok(!/Math\.random/.test(codeOnly), "found Math.random in residencyTrace.mjs's own code (outside comments)");
  assert.ok(!/Date\.now/.test(codeOnly), "found Date.now in residencyTrace.mjs's own code (outside comments)");
  assert.ok(!/new Date\(/.test(codeOnly), "found `new Date(` in residencyTrace.mjs's own code (outside comments)");
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
console.log("residencyTrace.mjs -- dismissThenClickRetry (§12 Amendment 13: bounded dismiss-then-click retry)");

test("BANNER_DISMISS_CLICK_MAX_ATTEMPTS is 3 (Amendment 13's own '<=3 attempts')", () => {
  assert.equal(BANNER_DISMISS_CLICK_MAX_ATTEMPTS, 3);
});

await testAsync("succeeds immediately when the first click is never intercepted -- one attempt, no dismissal needed", async () => {
  let dismissCalls = 0;
  let clickCalls = 0;
  const result = await dismissThenClickRetry(
    async () => {
      dismissCalls++;
      return false; // no banner present
    },
    async () => {
      clickCalls++;
      return { intercepted: false };
    }
  );
  assert.deepEqual(result, { succeeded: true, attempts: [{ dismissed: false, intercepted: false }], dismissals: 0 });
  assert.equal(dismissCalls, 1);
  assert.equal(clickCalls, 1);
});

await testAsync("one banner present, dismissed, then the click succeeds -- one attempt, one dismissal recorded", async () => {
  const result = await dismissThenClickRetry(
    async () => true, // banner present and dismissed
    async () => ({ intercepted: false })
  );
  assert.deepEqual(result, { succeeded: true, attempts: [{ dismissed: true, intercepted: false }], dismissals: 1 });
});

await testAsync("banner re-raises twice, dismissed and re-clicked each time, third attempt succeeds -- all three attempts recorded", async () => {
  let attempt = 0;
  const result = await dismissThenClickRetry(
    async () => true, // a fresh banner every attempt
    async () => {
      attempt++;
      return { intercepted: attempt < 3 };
    }
  );
  assert.equal(result.succeeded, true);
  assert.deepEqual(result.attempts, [
    { dismissed: true, intercepted: true },
    { dismissed: true, intercepted: true },
    { dismissed: true, intercepted: false },
  ]);
  assert.equal(result.dismissals, 3);
});

await testAsync("every attempt up to maxAttempts intercepted -- fails the step, per Amendment 13 ('a third intercepted click fails the step')", async () => {
  const result = await dismissThenClickRetry(
    async () => true,
    async () => ({ intercepted: true })
  );
  assert.equal(result.succeeded, false);
  assert.equal(result.attempts.length, BANNER_DISMISS_CLICK_MAX_ATTEMPTS);
  assert.ok(result.attempts.every((a) => a.intercepted === true && a.dismissed === true));
  assert.equal(result.dismissals, BANNER_DISMISS_CLICK_MAX_ATTEMPTS);
});

await testAsync("respects a custom maxAttempts (never hard-wired to 3 inside the loop itself)", async () => {
  let clickCalls = 0;
  const result = await dismissThenClickRetry(
    async () => false,
    async () => {
      clickCalls++;
      return { intercepted: true };
    },
    { maxAttempts: 1 }
  );
  assert.equal(result.succeeded, false);
  assert.equal(clickCalls, 1);
  assert.equal(result.attempts.length, 1);
});

await testAsync("never swallows a genuine click error -- only an { intercepted: true } result is treated as the race", async () => {
  const boom = new Error("boom -- an unrelated click failure");
  await assert.rejects(
    () =>
      dismissThenClickRetry(
        async () => false,
        async () => {
          throw boom;
        }
      ),
    (e) => e === boom
  );
});

await testAsync(
  "rejects a non-function dismissFn/clickFn or a non-positive-integer maxAttempts rather than silently producing garbage",
  async () => {
    await assert.rejects(() => dismissThenClickRetry(null, async () => ({ intercepted: false })));
    await assert.rejects(() => dismissThenClickRetry(async () => false, null));
    await assert.rejects(() =>
      dismissThenClickRetry(async () => false, async () => ({ intercepted: false }), { maxAttempts: 0 })
    );
  }
);

console.log("");
console.log(`== ${passed} passed, ${failed} failed ==`);
if (failed > 0) {
  process.exitCode = 1;
}
