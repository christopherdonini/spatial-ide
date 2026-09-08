#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- PANEL'/PANELREFUSE'/CLEAR'/FIND' steps for NEXT-CUT.md's
// filter-panel cut, phase P5 (+ FIND', added post-P7a per the operator's own Part E E5 finding and
// the human-approved "Apply behaves exactly like opening a dataset" design revision -- see
// `stepFind`'s own doc comment). Sibling to `filter.mjs` (which drives
// `window.__SPATIAL_E2E__.queryWithFilter` directly, bypassing the actual `FilterPanel` DOM --
// "not through the (nonexistent) shell filter panel", its own header's words, written before P3
// built one) and to `regression.mjs` -- this suite is what actually drives the real rendered
// `.filter-panel` DOM NEXT-CUT.md's own evidence plan names: `.filter-panel`,
// `input.filter-predicate`, `button.filter-apply`, `button.filter-clear`, `button.filter-cancel`,
// `.filter-refusal`, `.scan-liveness`, `.scan-incomplete` (verified against
// `frontends/shell/src/filter/FilterPanel.tsx` and `src/App.tsx` before writing the assertions
// below -- `CUT-STATE.md`'s P3 section: the droppable `.filter-columns*` extra was built then
// dropped, so no assertion here targets it).
//
// RELEASE-0.1 item 7 (2026-09-07, MUST-FIX 1, reviewer gate): `SLOW'/CANCEL'` moved OUT of this
// file, to `e2e/refusal-contract-baseline.mjs`'s own process -- its declared precondition
// (`.canvas-refusal`, the literal ceiling-refusal text) is a baseline-arm-only mechanic, and this
// file now runs on the SHIPPED DEFAULT (candidate), unpinned. See that file's own top comment for
// the "does NOT drive Apply via the DOM" disclosure `SLOW'/CANCEL'` itself carries (moved with it).
//
// `waitForMountReady`/`withTimeout`/`waitForCondition`/`fractionOf` duplicated from
// `regression.mjs`/`filter.mjs` rather than imported -- this workspace's own established convention
// for sibling test files (`CUT-STATE.md`'s Rust integration tests duplicate rather than cross-import
// for the identical reason).

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");

const FIXTURE_FILTER = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const FIXTURE_SLOW = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\slow-filter-scan.parquet";
const REGEN_FILTER_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";
const REGEN_SLOW_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_slow_filter_fixture -- --ignored --nocapture";

// Verbatim from `engine/src/predicate.rs`'s `Display` impl for `FilterError::UnknownColumn`
// (traced through `kernel/src/skp.rs::filter_error_of`, `message = e.to_string()`) -- the same
// string `filter.mjs`'s own `REFUSED'` step already asserts.
const UNKNOWN_COLUMN_MESSAGE = "refused: `bogus_column_xyz` is not a column this dataset carries";

// Mirrors `kernel/tests/manual_walkthrough_fixtures.rs`'s `generate_the_slow_filter_fixture`
// `FEATURES` const -- not derived, the same "literal, not computed" discipline
// `regression.mjs`'s own OVERCEIL' step uses for its "100000" pattern.
const SLOW_FIXTURE_FEATURES = 4_000_000;
const SLOW_FIXTURE_TAIL = 100;
const SLOW_FIXTURE_PREDICATE = `id > ${SLOW_FIXTURE_FEATURES - SLOW_FIXTURE_TAIL}`;

/** Bounds one step's whole async body -- identical to regression.mjs's/filter.mjs's own helper. */
function withTimeout(promise, ms, stepId) {
  return new Promise((resolve, reject) => {
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error(`${stepId}: timed out after ${ms}ms`));
    }, ms);
    Promise.resolve(promise).then(
      (value) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Polls `getValue()` until `predicate(value)` holds or `timeoutMs` elapses -- identical to
 * `regression.mjs`'s own helper. A bounded-timeout POLL is not a "timing assertion" in the ADR-018
 * sense (no claim about how fast anything happened is ever made from the elapsed time here, and none
 * of this suite's error messages below cite one) -- it is the same robustness mechanism every
 * existing step in this harness already uses to wait out React's own commit/IPC/render latency. */
async function waitForCondition(getValue, predicate, timeoutMs, pollMs = 200) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await getValue();
    if (predicate(last)) return { ok: true, last };
    await sleep(pollMs);
  }
  return { ok: false, last };
}

const MOUNT_READY_TIMEOUT_MS = 90_000;

/** Same gate `regression.mjs`/`filter.mjs` use, before the first step. */
async function waitForMountReady(page, timeoutMs = MOUNT_READY_TIMEOUT_MS) {
  const start = Date.now();
  let lastHeader = null;
  let lastHookPresent = false;
  let lastEvalError = null;

  while (Date.now() - start < timeoutMs) {
    try {
      const info = await page.evaluate(() => ({
        header: document.querySelector(".app-header")?.textContent ?? null,
        hookPresent: typeof window.__SPATIAL_E2E__?.openPath === "function",
      }));
      lastHeader = info.header;
      lastHookPresent = info.hookPresent;
      lastEvalError = null;
      if (lastHeader !== null && lastHookPresent) {
        return { readyAfterMs: Date.now() - start };
      }
    } catch (e) {
      lastEvalError = e?.message ?? String(e);
    }
    await sleep(300);
  }

  const missing = [];
  if (lastHeader === null) missing.push(".app-header non-null");
  if (!lastHookPresent) missing.push("window.__SPATIAL_E2E__.openPath present");
  throw new Error(
    `mount-readiness gate: timed out after ${timeoutMs}ms waiting for ${missing.join(" and ")}. page url=${page.url()}` +
      (lastEvalError ? `, last evaluate error=${lastEvalError}` : "")
  );
}

function fractionOf(summary) {
  return summary.totalPixels > 0 ? summary.nonBackgroundCount / summary.totalPixels : 0;
}

async function stepOpen(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_FILTER);
  if (outcome.kind !== "admitted") {
    throw new Error(`OPEN: openPath(filter fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  }
  return "admitted; .filter-panel now mounted (keyed on the dataset handle)";
}

/**
 * `PANEL'` (NEXT-CUT.md P5 evidence plan): drives the real panel DOM -- `page.fill` on
 * `input.filter-predicate`, `page.click` on `button.filter-apply` -- and reuses `filter.mjs`'s own
 * 60%-of-unfiltered pixel-fraction margin, since it is the identical fixture/predicate/camera. The
 * resulting filtered fraction is returned (not just asserted) so `PANELREFUSE'`/`CLEAR'` below can
 * check their own claims relative to it, rather than re-deriving a baseline.
 */
async function stepPanel(page, consoleHandle, ctx) {
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const unfiltered = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  ctx.unfilteredFraction = fractionOf(unfiltered);
  if (ctx.unfilteredFraction <= 0.02) {
    throw new Error(
      `PANEL': unfiltered non-background fraction ${(ctx.unfilteredFraction * 100).toFixed(2)}% <= 2% -- nothing rendered to filter against`
    );
  }

  await page.fill("input.filter-predicate", "zone = 'residential'");
  await page.click("button.filter-apply");

  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const filtered = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  ctx.filteredFraction = fractionOf(filtered);

  const MARGIN = 0.6; // filtered must be under 60% of unfiltered -- filter.mjs's own FILTER' margin
  if (ctx.filteredFraction >= ctx.unfilteredFraction * MARGIN) {
    throw new Error(
      `PANEL': filtered fraction ${(ctx.filteredFraction * 100).toFixed(2)}% is not measurably lower than unfiltered ` +
        `${(ctx.unfilteredFraction * 100).toFixed(2)}% (threshold: below ${(MARGIN * 100).toFixed(0)}% of unfiltered, settled=${settle.settled})`
    );
  }
  if (ctx.filteredFraction <= 0.002) {
    throw new Error(
      `PANEL': filtered fraction ${(ctx.filteredFraction * 100).toFixed(3)}% is effectively blank -- the filtered stream did not visibly render (settled=${settle.settled})`
    );
  }

  const appliedText = await page.evaluate(() => document.querySelector(".filter-active")?.textContent ?? null);
  if (appliedText === null || !appliedText.includes("zone = 'residential'")) {
    throw new Error(`PANEL': .filter-active did not show the applied predicate verbatim. Actual: ${JSON.stringify(appliedText)}`);
  }

  return (
    `typed + Apply via the real DOM; unfiltered ${(ctx.unfilteredFraction * 100).toFixed(1)}% non-bg, filtered ` +
    `${(ctx.filteredFraction * 100).toFixed(1)}% non-bg (< ${(MARGIN * 100).toFixed(0)}% of unfiltered)`
  );
}

/**
 * `PANELREFUSE'`: an unknown-column predicate through the real input/Apply pair must surface
 * `.filter-refusal` (the shared `RefusalBlock`, `.admission-refusal-code`/`.admission-refusal-message`
 * inside it -- `CUT-STATE.md` P3's "class names preserved byte-exactly") with the verbatim
 * `skp.filter_unknown_column` code/message, AND the canvas must still show the PREVIOUS filtered view
 * -- `App.tsx`'s "typo-blanks-canvas fix": the refusing Apply already superseded and cleared
 * residency, so `applyFilter` re-issues the last successfully-issued query (the `PANEL'` predicate,
 * still over the same un-panned viewport) through the same retry helper. Checked as "unchanged within
 * a small tolerance" rather than exact equality: a re-issued query re-renders the identical geometry
 * over the identical camera, but WebGL readback is not guaranteed bit-identical run to run.
 */
async function stepPanelRefuse(page, consoleHandle, ctx) {
  await page.fill("input.filter-predicate", "bogus_column_xyz = 1");
  await page.click("button.filter-apply");

  const refusalShown = await waitForCondition(
    () => page.evaluate(() => document.querySelector(".filter-refusal") !== null),
    (present) => present === true,
    20_000
  );
  if (!refusalShown.ok) {
    throw new Error("PANELREFUSE': .filter-refusal never appeared after Apply with an unknown column");
  }

  const refusal = await page.evaluate(() => ({
    code: document.querySelector(".filter-refusal .admission-refusal-code")?.textContent ?? null,
    message: document.querySelector(".filter-refusal .admission-refusal-message")?.textContent ?? null,
  }));
  if (refusal.code !== "skp.filter_unknown_column") {
    throw new Error(`PANELREFUSE': expected code "skp.filter_unknown_column", got ${JSON.stringify(refusal.code)}`);
  }
  if (refusal.message !== UNKNOWN_COLUMN_MESSAGE) {
    throw new Error(`PANELREFUSE': message mismatch.\nExpected: ${UNKNOWN_COLUMN_MESSAGE}\nActual:   ${refusal.message}`);
  }

  // The recovery re-issue is a fresh query over the same viewport -- give it its own settle window
  // rather than assuming the refusal's own settle already covers it.
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const afterRefusal = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const afterRefusalFraction = fractionOf(afterRefusal);

  const TOLERANCE = 0.02; // 2 percentage points absolute -- same fixed camera, same recovered predicate
  const delta = Math.abs(afterRefusalFraction - ctx.filteredFraction);
  if (delta > TOLERANCE) {
    throw new Error(
      `PANELREFUSE': canvas fraction after the refusal (${(afterRefusalFraction * 100).toFixed(2)}%) drifted ` +
        `${(delta * 100).toFixed(2)} points from PANEL''s own filtered fraction (${(ctx.filteredFraction * 100).toFixed(2)}%), ` +
        `over ${(TOLERANCE * 100).toFixed(0)} points -- the recovery re-issue may not have fired (settled=${settle.settled})`
    );
  }

  return (
    `refused skp.filter_unknown_column; message verbatim; previous filtered view still rendered ` +
    `(${(afterRefusalFraction * 100).toFixed(2)}% non-bg, within ${(TOLERANCE * 100).toFixed(0)} pts of PANEL''s own fraction)`
  );
}

/** `CLEAR'`: `button.filter-clear` restores the unfiltered fraction and dismisses any refusal. */
async function stepClear(page, consoleHandle, ctx) {
  await page.click("button.filter-clear");

  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const clearedFraction = fractionOf(pixels);

  const MARGIN = 0.9; // must recover to at least 90% of the ORIGINAL unfiltered fraction
  if (clearedFraction < ctx.unfilteredFraction * MARGIN) {
    throw new Error(
      `CLEAR': cleared fraction ${(clearedFraction * 100).toFixed(2)}% did not recover to at least ` +
        `${(MARGIN * 100).toFixed(0)}% of PANEL''s own unfiltered fraction (${(ctx.unfilteredFraction * 100).toFixed(2)}%) (settled=${settle.settled})`
    );
  }

  const refusalGone = await page.evaluate(() => document.querySelector(".filter-refusal") === null);
  if (!refusalGone) {
    throw new Error("CLEAR': .filter-refusal still present after Clear");
  }
  const appliedGone = await page.evaluate(() => document.querySelector(".filter-active") === null);
  if (!appliedGone) {
    throw new Error("CLEAR': .filter-active still present after Clear (Clear must apply filter: null)");
  }

  return `unfiltered fraction restored (${(clearedFraction * 100).toFixed(1)}% non-bg, >= ${(MARGIN * 100).toFixed(0)}% of original); .filter-refusal and .filter-active both cleared`;
}

/**
 * `FIND'` -- the operator's exact 2026-08-15 walkthrough Part E, E5 scenario, permanently encoded.
 * A fresh open of the slow fixture (not chained off `SLOW'/CANCEL''s` own leftover state: that step
 * ends with a CANCELLED, zero-row scan and a camera that never moved for this filter generation --
 * FIND' needs the scan to actually run to completion, which is a materially different scenario worth
 * its own clean start). Applies the SAME late-matching predicate via the real panel DOM (input +
 * Apply click -- no stream handle needed here, `SLOW'/CANCEL'` already owns that assertion), waits
 * for the scan to finish on its own (liveness/Cancel both gone, `isScanInFlight` false), and asserts
 * the human-approved design revision's whole point: the camera actually shows the matching features,
 * not a blank canvas -- non-background pixels clearly above a small floor.
 *
 * RELEASE-0.1 item 7 (2026-09-07, MUST-FIX 1, reviewer gate): `SLOW'/CANCEL'` moved to its own
 * process, `e2e/refusal-contract-baseline.mjs` (its declared ceiling-refusal precondition is a
 * baseline-arm-only mechanic; see that file's own top comment) -- `FIND'` stays here and runs on
 * the shipped default (candidate), unpinned: it was already documented as NOT chained off
 * `SLOW'/CANCEL''s` own state (a deliberately fresh, independent open), and none of its own
 * assertions (scan completes, camera lands on the matches) are residency-ceiling-specific, so
 * moving is unneeded and this step's own pass/fail status is unaffected by which arm is active.
 */
async function stepFind(page, consoleHandle) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_SLOW);
  if (outcome.kind !== "admitted") {
    throw new Error(`FIND': openPath(slow fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  }

  // The unfiltered first look overflows the ceiling (the same OVERCEIL' pattern `SLOW'/CANCEL'`
  // already asserts in full) -- not re-asserted here, just settled out before Apply.
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 120_000 });

  // The operator's exact scenario, through the real panel DOM.
  await page.fill("input.filter-predicate", SLOW_FIXTURE_PREDICATE);
  await page.click("button.filter-apply");

  // TWO-PHASE wait, not a bare "not in-flight" check -- diagnosed empirically while calibrating this
  // step: a bare `!cancelPresent && livenessGone` poll can pass on its VERY FIRST read, before
  // `page.click`'s own async `applyFilter` chain has progressed far enough to dispatch a fresh
  // `issued` event -- because the UNFILTERED first look's own ceiling refusal already left `scanState`
  // as `{kind:"failed"}` moments earlier (P6 review B1's own fix), and "failed" ALSO satisfies
  // "not in-flight". A poll that never actually observed the NEW scan start would report "done"
  // immediately, true only by accident. Phase 1 requires observing `button.filter-cancel` actually
  // appear (the new scan genuinely started) before phase 2 waits for it to disappear again (the new
  // scan genuinely finished) -- `isScanInFlight` covers both liveness/Cancel identically, so Cancel
  // alone is a sufficient, simpler signal for phase 1.
  const started = await waitForCondition(
    () => page.evaluate(() => document.querySelector("button.filter-cancel") !== null),
    (present) => present === true,
    30_000
  );
  if (!started.ok) {
    throw new Error("FIND': button.filter-cancel never appeared after Apply -- the new scan never appears to have started");
  }

  // The scan must actually finish here (unlike `SLOW'/CANCEL'`, which cancels it pre-batch).
  // Generous timeout: this is the full, unprunable single-row-group scan across all 4,000,000
  // features (`generate_the_slow_filter_fixture`'s own doc comment), not the first-batch-only
  // measurement the fixture's sizing was calibrated against.
  const scanDone = await waitForCondition(
    () =>
      page.evaluate(() => ({
        livenessGone: document.querySelector(".scan-liveness") === null,
        cancelGone: document.querySelector("button.filter-cancel") === null,
        incompleteText: document.querySelector(".scan-incomplete")?.textContent ?? null,
      })),
    (state) => state.livenessGone && state.cancelGone,
    180_000
  );
  if (!scanDone.ok) {
    throw new Error(
      `FIND': the filtered scan never left the in-flight family (liveness/Cancel both gone) within 180s ` +
        `of having started (last observed: ${JSON.stringify(scanDone.last)})`
    );
  }
  if (scanDone.last.incompleteText !== null) {
    throw new Error(
      `FIND': .scan-incomplete unexpectedly present after the scan finished on its own (nobody clicked Cancel) -- ` +
        `${JSON.stringify(scanDone.last.incompleteText)}`
    );
  }

  // THE operator's finding, permanently encoded: the camera actually landed on the matching
  // features -- non-background pixels clearly above a small floor. `SLOW_FIXTURE_TAIL` (100)
  // features fitted onto the whole canvas should render clearly, not a blank/near-blank sliver.
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 30_000 });
  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const fraction = fractionOf(pixels);
  // Calibrated against a real run (99 matching rows -- id > 3999900 admits ids 3999901..3999999 on a
  // 0-indexed id column -- fitted onto the whole canvas measured 1.41% non-background,
  // 4036/285440 px): FLOOR set at 0.5%, comfortably below the observed value (~2.8x headroom for
  // run-to-run WebGL/AA variance) while still failing hard on an effectively blank canvas (the exact
  // defect this step exists to catch).
  const FLOOR = 0.005;
  if (fraction <= FLOOR) {
    throw new Error(
      `FIND': filtered-and-completed canvas is effectively blank (${(fraction * 100).toFixed(3)}% non-bg, floor ` +
        `${(FLOOR * 100).toFixed(1)}%, settled=${settle.settled}) -- the human-approved design revision (Apply issues ` +
        `bbox: null, WorkingCanvas.resetFitForNewGeneration) should have landed the camera on the ${SLOW_FIXTURE_TAIL} ` +
        `matching features, exactly the 2026-08-15 walkthrough Part E E5 finding this step encodes`
    );
  }

  return (
    `fresh open; applied "${SLOW_FIXTURE_PREDICATE}" via the real DOM; scan completed on its own ` +
    `(liveness/Cancel both gone, no .scan-incomplete); camera landed on the matches ` +
    `(${(fraction * 100).toFixed(2)}% non-bg, > ${(FLOOR * 100).toFixed(1)}% floor, settled=${settle.settled})`
  );
}

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 900_000);
  const watchdog = setTimeout(() => {
    console.error(`filter-panel: SPATIAL_E2E_DEADLINE_MS (default 900000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  const missingFixtures = [];
  if (!existsSync(FIXTURE_FILTER)) missingFixtures.push([FIXTURE_FILTER, REGEN_FILTER_COMMAND]);
  if (!existsSync(FIXTURE_SLOW)) missingFixtures.push([FIXTURE_SLOW, REGEN_SLOW_COMMAND]);
  if (missingFixtures.length > 0) {
    for (const [path, cmd] of missingFixtures) {
      console.error(`filter-panel: fixture not found: ${path}`);
      console.error(`Regenerate with:\n  ${cmd}`);
    }
    process.exitCode = 1;
    return;
  }

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`filter-panel: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL", note: string}>} */
  const results = [];
  const ctx = {};

  async function runStep(id, timeoutMs, fn) {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(fn(), timeoutMs, id);
      results.push({ id, status: "PASS", note });
      console.log(`[${id}] PASS (${Date.now() - startedAt}ms): ${note}`);
    } catch (e) {
      const note = e?.message ?? String(e);
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
    }
  }

  try {
    console.log(`filter-panel: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const mountReady = await waitForMountReady(page);
    console.log(`filter-panel: mount-readiness gate PASSED after ${mountReady.readyAfterMs}ms`);

    // RELEASE-0.1 item 7 (2026-09-07, MUST-FIX 1, reviewer gate): NO arm pin here any more -- this
    // run exercises the SHIPPED DEFAULT residency arm (candidate), unpinned, the same as an ordinary
    // operator would get. An earlier version of this piece pinned the whole file to baseline; the
    // reviewer found that over-applied the human's ruling and left the shipped default with zero
    // regression coverage from this file. `SLOW'/CANCEL'` (the one step that DID need baseline)
    // moved to `e2e/refusal-contract-baseline.mjs`'s own process; see that file's own top comment.
    //
    // Post-PASS sweep S-c (2026-09-08, reviewer gate): "no pin" is not "no assumption" -- on the
    // ATTACH path (a previous script's own instance, still running), this run inherits whatever arm
    // that prior script left the app pinned to. `e2e/refusal-contract-baseline.mjs` deliberately
    // leaves a BASELINE-pinned app running when it finishes, exactly the class MUST-FIX 2 fixed for
    // `residency-harness.mjs` (a harness inferring its arm instead of asserting it). A non-pinning
    // READBACK, asserted, closes the same gap here: fails loudly, naming the actual value, rather
    // than silently exercising the wrong arm under the "shipped default" label.
    const armReadback = await page.evaluate(() => window.__SPATIAL_E2E__.getResidencyArm?.());
    if (armReadback !== "candidate") {
      throw new Error(
        `filter-panel: expected the shipped default residency arm ("candidate") but readback was ${JSON.stringify(armReadback)} -- ` +
          `this run attached to an app a prior script left pinned to a different arm (no pin is applied here by design; ` +
          `see this file's own comment above)`
      );
    }

    await runStep("OPEN", 40_000, () => stepOpen(page));
    await runStep("PANEL'", 60_000, () => stepPanel(page, consoleHandle, ctx));
    await runStep("PANELREFUSE'", 60_000, () => stepPanelRefuse(page, consoleHandle, ctx));
    await runStep("CLEAR'", 60_000, () => stepClear(page, consoleHandle, ctx));
    await runStep("FIND'", 300_000, () => stepFind(page, consoleHandle));

    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    const statusWidth = 6;
    console.log(`${"Step".padEnd(idWidth)}  ${"Status".padEnd(statusWidth)}  Note`);
    console.log(`${"-".repeat(idWidth)}  ${"-".repeat(statusWidth)}  ${"-".repeat(40)}`);
    for (const r of results) {
      console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(statusWidth)}  ${r.note}`);
    }

    process.exitCode = results.some((r) => r.status === "FAIL") ? 1 : 0;
  } catch (e) {
    console.error(`filter-panel: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `filter-panel-render-trace-${Date.now()}.json`);
      writeFileSync(
        ledgerPath,
        JSON.stringify({ renderTrace: consoleHandle.renderTrace(), allConsoleEntries: consoleHandle.entries }, null, 2)
      );
      console.log(`Full render-trace ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`filter-panel: failed to write the render-trace ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    // Same policy as regression.mjs/filter.mjs: disconnect only, never stop the app.
    await browser.close().catch(() => {});
    console.log(
      launched
        ? `This run launched the app; it stays RUNNING on CDP port ${CDP_PORT} for further interactive use.`
        : `Attached to an already-running app on CDP port ${CDP_PORT}; leaving it running.`
    );
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
