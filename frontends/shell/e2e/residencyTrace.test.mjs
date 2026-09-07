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
  lastSessionLogPathFromAppLog,
  MAX_IN_FLIGHT_TILE_STREAMS_PROPOSED,
  newestSessionLogSinceLaunch,
  parsePerStepWatchdogMsArg,
  parseTileSizeArg,
  percentileNearestRank,
  poolPollPreflightInvalidationReason,
  resolvedPerStepSettleTimeoutMs,
  SESSION_LOG_LAUNCH_TOLERANCE_SECONDS,
  sessionLogCandidates,
  sessionLogThresholdSeconds,
  SETTLE_PER_STEP_TIMEOUT_MS,
  SETTLE_PER_STEP_TIMEOUT_LARGE_FIXTURE_MS,
  SETTLE_PER_STEP_TIMEOUT_5GB_MS,
  SETTLE_TIMEOUT_BY_BASENAME_MS,
  settleTimeoutForFixture,
  SETTLE_QUIET_MS,
  TILE_SIZE_LEVELS_PROPOSED,
  TRACE_VERSION,
  trialWatchdogMsForStepBound,
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

test("TRACE_VERSION (M9) is a declared, non-empty string literal, pinned at \"3\" (Amendment 20's step-6 magnitude change)", () => {
  assert.equal(typeof TRACE_VERSION, "string");
  assert.ok(TRACE_VERSION.length > 0);
  assert.equal(TRACE_VERSION, "3");
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
console.log("residencyTrace.mjs -- pan-northeast (step 6), Amendment 20's magnitude rule (trace v3)");

test("pan-northeast's params encode Amendment 20's rule: width basis, unchanged; multiplier = 1/sqrt(2) (Math.SQRT1_2)", () => {
  const step = CAMERA_TRACE_STEPS.find((s) => s.id === "pan-northeast");
  assert.ok(step, "pan-northeast step not found in CAMERA_TRACE_STEPS");
  assert.deepEqual(step.params, { direction: "NE", distanceBasis: "width", distanceMultiplier: Math.SQRT1_2 });
});

test(
  "pan-northeast realizes exactly 0.5*width per screen axis (total 0.5*sqrt(2)*width), through the SAME " +
    "arithmetic residency-harness.mjs's own applyStep applies (mirrors the M8-era realization-formula check)",
  () => {
    const step = CAMERA_TRACE_STEPS.find((s) => s.id === "pan-northeast");
    for (const width of [1600, 800, 1234.5]) {
      // Mirrors residency-harness.mjs's applyStep exactly (its own "pan" branch): dxBase (this
      // step's distanceBasis is "width") * distanceMultiplier gives the declared scalar `distance`;
      // a genuinely diagonal direction (both N/S and E/W present, as "NE" is) sets BOTH screen axes
      // to that same scalar; M8's own fix then divides EACH axis by Math.SQRT2 once both are
      // nonzero -- exactly `applyStep`'s own three steps, in the same order, on the same inputs.
      const dxBase = width; // step.params.distanceBasis === "width"
      const distance = dxBase * step.params.distanceMultiplier;
      let dxScreen = 0;
      let dyScreen = 0;
      if (step.params.direction.includes("N")) dyScreen += distance;
      if (step.params.direction.includes("S")) dyScreen -= distance;
      if (step.params.direction.includes("E")) dxScreen -= distance;
      if (step.params.direction.includes("W")) dxScreen += distance;
      if (dxScreen !== 0 && dyScreen !== 0) {
        dxScreen /= Math.SQRT2;
        dyScreen /= Math.SQRT2;
      }
      const expectedPerAxis = 0.5 * width;
      assert.ok(
        Math.abs(Math.abs(dxScreen) - expectedPerAxis) < 1e-9,
        `width=${width}: |dxScreen|=${Math.abs(dxScreen)}, expected ${expectedPerAxis}`
      );
      assert.ok(
        Math.abs(Math.abs(dyScreen) - expectedPerAxis) < 1e-9,
        `width=${width}: |dyScreen|=${Math.abs(dyScreen)}, expected ${expectedPerAxis}`
      );
      // Amendment 20's own declared total: "0.5·√2·width".
      const realizedTotal = Math.hypot(dxScreen, dyScreen);
      const expectedTotal = 0.5 * Math.SQRT2 * width;
      assert.ok(
        Math.abs(realizedTotal - expectedTotal) < 1e-9,
        `width=${width}: realizedTotal=${realizedTotal}, expected 0.5*sqrt(2)*width=${expectedTotal}`
      );
    }
  }
);

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
console.log("residencyTrace.mjs -- parseTileSizeArg (P7: the tile-size sweep selector's own harness arg parsing)");

test("returns null when --tile-size was not given at all", () => {
  assert.equal(parseTileSizeArg([]), null);
  assert.equal(parseTileSizeArg(["--smoke", "--arm", "candidate"]), null);
});

test("parses each of the three locked levels", () => {
  for (const level of TILE_SIZE_LEVELS_PROPOSED) {
    assert.equal(parseTileSizeArg(["--tile-size", level]), level);
    // Order-independent -- a real argv can carry other flags before/after it.
    assert.equal(parseTileSizeArg(["--arm", "candidate", "--tile-size", level, "--smoke"]), level);
  }
});

test("throws loudly on a missing value (--tile-size as the last argv token)", () => {
  assert.throws(() => parseTileSizeArg(["--smoke", "--tile-size"]), /--tile-size requires one of/);
});

test("throws loudly on an unrecognized value", () => {
  assert.throws(() => parseTileSizeArg(["--tile-size", "extra-fine"]), /--tile-size requires one of/);
  assert.throws(() => parseTileSizeArg(["--tile-size", "8"]), /--tile-size requires one of/);
});

console.log("");
console.log(
  "residencyTrace.mjs -- parsePerStepWatchdogMsArg (entry-40 pass: --per-step-watchdog-ms parsing)"
);

test("returns null when --per-step-watchdog-ms was not given at all", () => {
  assert.equal(parsePerStepWatchdogMsArg([]), null);
  assert.equal(parsePerStepWatchdogMsArg(["--smoke", "--arm", "candidate"]), null);
});

test("parses a positive integer value", () => {
  assert.equal(parsePerStepWatchdogMsArg(["--per-step-watchdog-ms", "3600000"]), 3_600_000);
  // Order-independent -- a real argv can carry other flags before/after it.
  assert.equal(
    parsePerStepWatchdogMsArg(["--arm", "candidate", "--per-step-watchdog-ms", "1000", "--smoke"]),
    1000
  );
});

test("throws loudly on a missing value (flag as the last argv token)", () => {
  assert.throws(
    () => parsePerStepWatchdogMsArg(["--smoke", "--per-step-watchdog-ms"]),
    /--per-step-watchdog-ms requires a positive number/
  );
});

test("throws loudly on a non-numeric, zero, or negative value", () => {
  assert.throws(
    () => parsePerStepWatchdogMsArg(["--per-step-watchdog-ms", "soon"]),
    /--per-step-watchdog-ms requires a positive number/
  );
  assert.throws(
    () => parsePerStepWatchdogMsArg(["--per-step-watchdog-ms", "0"]),
    /--per-step-watchdog-ms requires a positive number/
  );
  assert.throws(
    () => parsePerStepWatchdogMsArg(["--per-step-watchdog-ms", "-5"]),
    /--per-step-watchdog-ms requires a positive number/
  );
});

console.log("");
console.log(
  "residencyTrace.mjs -- resolvedPerStepSettleTimeoutMs / trialWatchdogMsForStepBound (entry-40 pass: the watchdog arithmetic)"
);

test("resolvedPerStepSettleTimeoutMs falls back to settleTimeoutForFixture when no override is given", () => {
  assert.equal(
    resolvedPerStepSettleTimeoutMs("/a/b/parcels-5gb.parquet", 5_000, null),
    settleTimeoutForFixture("/a/b/parcels-5gb.parquet", 5_000)
  );
  assert.equal(resolvedPerStepSettleTimeoutMs("/a/b/parcels-5gb.parquet", 5_000, null), 150_000);
  assert.equal(
    resolvedPerStepSettleTimeoutMs("C:\\x\\filter-zoned.parquet", 5_000, null),
    5_000
  );
});

test("resolvedPerStepSettleTimeoutMs uses the override when given, regardless of fixture", () => {
  assert.equal(resolvedPerStepSettleTimeoutMs("/a/b/parcels-5gb.parquet", 5_000, 3_600_000), 3_600_000);
  assert.equal(resolvedPerStepSettleTimeoutMs("C:\\x\\filter-zoned.parquet", 5_000, 3_600_000), 3_600_000);
});

test("trialWatchdogMsForStepBound is (stepCount + 1) * perStepBoundMs, Amendment 12's own formula", () => {
  assert.equal(trialWatchdogMsForStepBound(CAMERA_TRACE_STEPS.length, SETTLE_PER_STEP_TIMEOUT_MS), 60_000);
  assert.equal(trialWatchdogMsForStepBound(CAMERA_TRACE_STEPS.length, 150_000), 1_800_000);
});

test("an entry-40 --per-step-watchdog-ms override always leaves the outer watchdog >= stepCount * n, so it cannot fire first (PASS-PREREGISTRATION.md §2)", () => {
  const n = 3_600_000; // the run's own declared one-hour override
  const outer = trialWatchdogMsForStepBound(CAMERA_TRACE_STEPS.length, n);
  assert.ok(outer >= CAMERA_TRACE_STEPS.length * n);
  assert.equal(outer, (CAMERA_TRACE_STEPS.length + 1) * n);
});

console.log("");
console.log(
  "residencyTrace.mjs -- lastSessionLogPathFromAppLog (reviewer M2(a): reading lib.rs's own startup line back out of app.log)"
);

test("returns null when the app-log text carries no session-log line at all", () => {
  assert.equal(lastSessionLogPathFromAppLog(""), null);
  assert.equal(lastSessionLogPathFromAppLog("some other startup noise\nmore noise\n"), null);
});

test("extracts the path from a single matching line", () => {
  assert.equal(
    lastSessionLogPathFromAppLog("[spatial-ide-shell] session log: C:\\Users\\x\\AppData\\Local\\spatial-ide-shell\\logs\\session-123.log\n"),
    "C:\\Users\\x\\AppData\\Local\\spatial-ide-shell\\logs\\session-123.log"
  );
});

test("returns the LAST occurrence when the app-log file has more than one (e.g. a reused process from a prior run)", () => {
  const text =
    "[spatial-ide-shell] session log: /tmp/session-1.log\n" +
    "some interleaved startup noise\n" +
    "[spatial-ide-shell] session log: /tmp/session-2.log\n";
  assert.equal(lastSessionLogPathFromAppLog(text), "/tmp/session-2.log");
});

test("tolerates surrounding whitespace/CRLF line endings", () => {
  assert.equal(
    lastSessionLogPathFromAppLog("[spatial-ide-shell] session log: /tmp/session-3.log \r\n"),
    "/tmp/session-3.log"
  );
});

console.log("");
console.log(
  "residencyTrace.mjs -- newestSessionLogSinceLaunch (entry-40 pass, Amendment 2: the app-log-dir primary session-log-path source)"
);

test("none: an empty listing returns null", () => {
  assert.equal(newestSessionLogSinceLaunch([], 1_788_757_855_000), null);
});

test("none: a listing with only non-matching names returns null", () => {
  assert.equal(
    newestSessionLogSinceLaunch(
      [
        { name: "app.log", mtimeMs: 1_788_757_000_000 },
        { name: "session-abc.log", mtimeMs: 1_788_757_000_000 }, // non-numeric epoch -- ignored, not thrown
        { name: "not-a-session-log.txt", mtimeMs: 1_788_757_000_000 },
      ],
      1_788_757_855_000
    ),
    null
  );
});

test("one: a single qualifying file is returned by its path-less name", () => {
  const launchEpochMs = 1_788_757_855_000; // seconds: 1788757855
  assert.equal(
    newestSessionLogSinceLaunch([{ name: "session-1788757860.log", mtimeMs: 1_788_757_861_000 }], launchEpochMs),
    "session-1788757860.log"
  );
});

test("several: the file with the HIGHEST embedded epoch wins, regardless of array order or mtimeMs", () => {
  const launchEpochMs = 1_788_757_855_000;
  const dirListing = [
    { name: "session-1788757900.log", mtimeMs: 1 }, // lowest mtimeMs, highest epoch -- must still win
    { name: "session-1788757860.log", mtimeMs: 9_999_999_999_999 }, // highest mtimeMs, not highest epoch
    { name: "session-1788757861.log", mtimeMs: 2 },
  ];
  assert.equal(newestSessionLogSinceLaunch(dirListing, launchEpochMs), "session-1788757900.log");
});

test("tolerance edge: exactly floor(launchEpochMs/1000) - 5 qualifies; one second earlier does not", () => {
  const launchEpochMs = 1_788_757_855_000; // floor/1000 = 1788757855; threshold = 1788757850
  assert.equal(
    newestSessionLogSinceLaunch([{ name: "session-1788757850.log", mtimeMs: null }], launchEpochMs),
    "session-1788757850.log"
  );
  assert.equal(
    newestSessionLogSinceLaunch([{ name: "session-1788757849.log", mtimeMs: null }], launchEpochMs),
    null
  );
});

test("a non-matching name sitting alongside qualifying ones is ignored, not selected and not fatal", () => {
  const launchEpochMs = 1_788_757_855_000;
  const dirListing = [
    { name: "measure-app.log", mtimeMs: 9_999_999_999_999 },
    { name: "session-1788757900.log", mtimeMs: 1 },
    { name: "session-1788757900.log.bak", mtimeMs: 9_999_999_999_999 }, // suffix after .log -- must not match
  ];
  assert.equal(newestSessionLogSinceLaunch(dirListing, launchEpochMs), "session-1788757900.log");
});

test("rejects a non-array dirListing or a non-finite launchEpochMs rather than silently producing garbage", () => {
  assert.throws(() => newestSessionLogSinceLaunch(null, 1_788_757_855_000));
  assert.throws(() => newestSessionLogSinceLaunch([], NaN));
  assert.throws(() => newestSessionLogSinceLaunch([], undefined));
});

// Reviewer fix batch SHOULD-FIX 5 (on ffb688f): numeric epoch comparison, never lexicographic --
// a string comparison of "999" vs "1000" ranks "999" as greater (first character '9' > '1'), which
// would wrongly select the OLDER file. Both epochs (999, 1000) are chosen to clear the threshold
// with room to spare so this test isolates the ordering comparison itself, not the threshold.
test("selects by NUMERIC epoch, not lexicographic string order -- session-1000.log (numerically newer) beats session-999.log", () => {
  const launchEpochMs = 1_000_000; // seconds: 1000; threshold = 1000 - 5 = 995 -- both 999 and 1000 clear it
  const dirListing = [
    { name: "session-999.log", mtimeMs: null },
    { name: "session-1000.log", mtimeMs: null },
  ];
  assert.equal(newestSessionLogSinceLaunch(dirListing, launchEpochMs), "session-1000.log");
  // Order-independence: the same result regardless of which entry appears first in the listing.
  assert.equal(newestSessionLogSinceLaunch([...dirListing].reverse(), launchEpochMs), "session-1000.log");
});

// Reviewer fix batch SHOULD-FIX 6 (on ffb688f): the real regression shape PASS-PREREGISTRATION.md
// Amendment 2's own attempt 1 hit, reproduced structurally -- a STALE, old-epoch file (a prior
// launch's own session log) sitting beside the CORRECT, newer-epoch file this launch created, with
// the stale file carrying the NEWEST filesystem mtime of the two (exactly the kind of mtime this
// module's own `mtimeMs` field could tempt a caller to sort by, and exactly why selection never
// does). Epoch alone must win.
test("regression shape (Amendment 2's own real bug): a stale OLD-epoch file with the NEWEST mtime, beside the correct NEWER-epoch file with an OLDER mtime -- selection follows epoch, never mtime", () => {
  const launchEpochMs = 1_788_757_855_000; // this run's own launch instant
  const dirListing = [
    { name: "session-1754857478.log", mtimeMs: 9_999_999_999_999 }, // a month-old prior launch, newest mtime
    { name: "session-1788757900.log", mtimeMs: 1 }, // this launch's own file, oldest mtime
  ];
  assert.equal(newestSessionLogSinceLaunch(dirListing, launchEpochMs), "session-1788757900.log");
});

console.log("");
console.log(
  "residencyTrace.mjs -- sessionLogThresholdSeconds (reviewer fix batch SHOULD-FIX 3, on ffb688f: the extracted threshold arithmetic)"
);

test("SESSION_LOG_LAUNCH_TOLERANCE_SECONDS is 5, and sessionLogThresholdSeconds matches newestSessionLogSinceLaunch's own tolerance edge", () => {
  assert.equal(SESSION_LOG_LAUNCH_TOLERANCE_SECONDS, 5);
  assert.equal(sessionLogThresholdSeconds(1_788_757_855_000), 1_788_757_850);
});

test("floors sub-second launchEpochMs before subtracting the tolerance", () => {
  assert.equal(sessionLogThresholdSeconds(1_788_757_855_999), 1_788_757_850);
});

test("throws on a non-finite launchEpochMs rather than silently producing garbage", () => {
  assert.throws(() => sessionLogThresholdSeconds(NaN));
  assert.throws(() => sessionLogThresholdSeconds(undefined));
  assert.throws(() => sessionLogThresholdSeconds(Infinity));
});

console.log("");
console.log(
  "residencyTrace.mjs -- sessionLogCandidates (reviewer fix batch SHOULD-FIX 3/7, on ffb688f: diagnostic candidate list, mtime recorded as evidence)"
);

test("returns every session-<digits>.log-shaped entry with its own mtimeMs, regardless of the launch threshold", () => {
  const dirListing = [
    { name: "session-1754857478.log", mtimeMs: 9_999_999_999_999 },
    { name: "session-1788757900.log", mtimeMs: 1 },
    { name: "app.log", mtimeMs: 123 },
    { name: "session-1788757900.log.bak", mtimeMs: 456 },
  ];
  assert.deepEqual(sessionLogCandidates(dirListing), [
    { name: "session-1754857478.log", mtimeMs: 9_999_999_999_999 },
    { name: "session-1788757900.log", mtimeMs: 1 },
  ]);
});

test("an empty or entirely non-matching listing returns an empty array, never null or a throw", () => {
  assert.deepEqual(sessionLogCandidates([]), []);
  assert.deepEqual(sessionLogCandidates([{ name: "app.log", mtimeMs: 1 }]), []);
});

test("a missing mtimeMs on an entry is normalized to null, never undefined", () => {
  assert.deepEqual(sessionLogCandidates([{ name: "session-1.log" }]), [{ name: "session-1.log", mtimeMs: null }]);
});

test("throws on a non-array dirListing rather than silently producing garbage", () => {
  assert.throws(() => sessionLogCandidates(null));
  assert.throws(() => sessionLogCandidates(undefined));
});

console.log("");
console.log(
  "residencyTrace.mjs -- poolPollPreflightInvalidationReason (entry-40 pass, Amendment 2 item 3; reviewer fix batch MUST-FIX 2 on ffb688f corrected the contract to key on readSucceeded, not resolvedPath)"
);

test('a falsy readSucceeded -- the check itself never ran -- selects "pool-poll pre-flight could not be evaluated"', () => {
  assert.equal(poolPollPreflightInvalidationReason(null), "pool-poll pre-flight could not be evaluated");
  assert.equal(poolPollPreflightInvalidationReason(undefined), "pool-poll pre-flight could not be evaluated");
  assert.equal(poolPollPreflightInvalidationReason(false), "pool-poll pre-flight could not be evaluated");
});

// MUST-FIX 2's own regression case: a path that DID resolve but whose read FAILED (permission
// denied, deleted between resolution and read, ...) must select the same "could not be evaluated"
// reason as an unresolved path -- never "emitted nothing", which the log's content was never
// actually inspected to establish. Modeled here as `readSucceeded: false` regardless of any path
// string existing elsewhere on the caller's side -- this function itself never sees the path at
// all, only whether the read succeeded, which is exactly the fix (it used to be handed the path's
// own truthiness instead).
test('a resolved path whose readFileSync FAILED (readSucceeded: false) also selects "pool-poll pre-flight could not be evaluated", never "emitted nothing" (MUST-FIX 2)', () => {
  const readSucceeded = false; // the caller's own try/catch never reached the success assignment
  assert.equal(poolPollPreflightInvalidationReason(readSucceeded), "pool-poll pre-flight could not be evaluated");
});

test('a truthy readSucceeded -- the log was actually read and genuinely lacks the line -- selects "pool-poll instrument emitted nothing"', () => {
  assert.equal(poolPollPreflightInvalidationReason(true), "pool-poll instrument emitted nothing");
});

test("the two reasons are never conflated -- distinct strings for the two distinct cases", () => {
  assert.notEqual(poolPollPreflightInvalidationReason(false), poolPollPreflightInvalidationReason(true));
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
