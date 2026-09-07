#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- RELEASE-0.1 item 7's own reviewer-directed fix (MUST-FIX 1,
// 2026-09-07): `regression.mjs`'s `OVERCEIL'`/`REOPEN'` (rider 1's baseline-arm-only ceiling-refusal
// acceptance test, `DECISIONS-PENDING.md` entry 0 option (a)) and `filter-panel.mjs`'s `SLOW'/CANCEL'`
// (ADR-021's own acceptance condition, whose own declared precondition is the SAME baseline-only
// mechanic) moved HERE, into their OWN process, launched separately from `regression.mjs` and
// `filter-panel.mjs` -- which now run entirely on the SHIPPED DEFAULT (candidate), unpinned, per the
// reviewer's own reading of the ruling ("every test encoding the refusal contract", not the suites
// that happen to contain one).
//
// **`SLOW'/CANCEL'` is the one step that does NOT drive Apply via the DOM, disclosed here rather than
// silently varying** (carried over from `filter-panel.mjs`'s own former top comment): obtaining the
// issued stream handle to assert "zero [render-trace] batch lines exist for that handle" has no DOM
// surface at all (a button click returns nothing to the harness), so that one step applies its
// predicate via `window.__SPATIAL_E2E__.queryWithFilter` -- NEXT-CUT.md's own evidence plan names this
// explicitly as a sanctioned handle source. `queryWithFilter` reaches the IDENTICAL `applyFilter` seam
// `FilterPanel`'s own Apply button calls (`P3`'s deviation-3 retrofit), so the resulting
// `scanState`/DOM is exactly what a real Apply click would produce -- only the mechanism that fired it
// differs, and every assertion in the step is still against the real rendered DOM.
//
// **Why a separate PROCESS, not an in-suite pin (the S4 precedent).** `setResidencyArm` is refused
// while a dataset is open (`residencyArm.ts`'s own contract); `residency-harness.mjs`'s own S4 doc
// comment records that a `page.reload()` mid-script to force a close-without-reopen has "no precedent
// anywhere in this harness suite" and was judged riskier than a fresh launch-per-process -- the SAME
// choice this file makes: baseline is pinned once, here, before the FIRST `openPath` this process ever
// issues (no dataset has ever opened in THIS process at that point, so the pin cannot be refused), with
// a `getResidencyArm()` READBACK asserted afterward -- never trusting `setResidencyArm`'s own `{ok:true}`
// alone (a caller-side bug could return `{ok:true}` while `currentArm` itself never actually moved;
// the readback is the independent check that it did).
//
// `REOPEN'` moved here WITH `OVERCEIL'`, not left behind in `regression.mjs` -- an extension of the
// reviewer's literal instruction ("move stepOverCeiling and stepSlowCancel"), stated here rather than
// silently done: `REOPEN'` is not a free-standing step. It exists to assert rider 1's OTHER half --
// "a dataset change, not a banner dismiss, clears `.residency-status`" -- and that assertion is only
// meaningful immediately after `OVERCEIL'` has left a STANDING baseline-ceiling status for it to clear
// (`stepReopen`'s own doc comment, unchanged below). Left in `regression.mjs` alone, with `OVERCEIL'`
// gone, `REOPEN'` would either find `.residency-status` null already (nothing set it) or, under the
// shipped candidate default, whatever `candidate-within-budget`/`candidate-over-budget` status the
// EARLIER unrelated steps (A1'-K6) happened to leave behind -- a different, non-deterministic claim,
// not the one this step was written to make. Moving it here keeps the original claim intact.
//
// Same attach-or-launch path as every sibling script (`lib.mjs`'s `attachOrLaunch`), same in-page hooks,
// same evidence-class limit. Independently bounded/caught per step (`withTimeout`), same as every sibling.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");

const FIXTURE_100K = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const FIXTURE_OVER_CEILING =
  "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\over-ceiling-refused.parquet";
const FIXTURE_SLOW = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\slow-filter-scan.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture";
const REGEN_SLOW_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_slow_filter_fixture -- --ignored --nocapture";

// Mirrors `kernel/tests/manual_walkthrough_fixtures.rs`'s `generate_the_slow_filter_fixture`
// `FEATURES` const -- not derived, the same "literal, not computed" discipline `stepOverCeiling`'s
// own "100000" pattern uses. Duplicated from `filter-panel.mjs` (moved with `stepSlowCancel`).
const SLOW_FIXTURE_FEATURES = 4_000_000;
const SLOW_FIXTURE_TAIL = 100;
const SLOW_FIXTURE_PREDICATE = `id > ${SLOW_FIXTURE_FEATURES - SLOW_FIXTURE_TAIL}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Duplicated from `regression.mjs`/`filter-panel.mjs` -- this workspace's own established
 * sibling-file convention (`admission-remediation.mjs`'s own top comment: "duplicate rather than
 * cross-import for the identical reason" Rust integration tests do), not an oversight. */
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

/** Polls `getValue()` until `predicate(value)` holds or `timeoutMs` elapses -- duplicated from
 * `regression.mjs`/`filter-panel.mjs`'s own identical helper. A bounded-timeout POLL is not a
 * "timing assertion" in the ADR-018 sense (no claim about how fast anything happened is ever made
 * from the elapsed time here). */
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

/** Duplicated from `regression.mjs` (its own doc comment has the 2026-08-12 fresh-launch finding
 * this closes: a WebView2 page target existing is not the same fact as React having mounted). */
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

  let readyState = "(unavailable -- evaluate itself failed; see last evaluate error below)";
  let bodySnippet = "(unavailable)";
  try {
    const diag = await page.evaluate(() => ({
      readyState: document.readyState,
      bodySnippet: document.body ? document.body.innerHTML.slice(0, 200) : "(no body element)",
    }));
    readyState = diag.readyState;
    bodySnippet = diag.bodySnippet;
  } catch {
    // Page is truly wedged; the fallback strings above and `lastEvalError` are what's left to report.
  }

  const missing = [];
  if (lastHeader === null) missing.push(".app-header non-null");
  if (!lastHookPresent) missing.push("window.__SPATIAL_E2E__.openPath present");

  throw new Error(
    `mount-readiness gate: timed out after ${timeoutMs}ms waiting for ${missing.join(" and ")}. ` +
      `document.readyState=${readyState}, page url=${page.url()}` +
      (lastEvalError ? `, last evaluate error=${lastEvalError}` : "") +
      `, body.innerHTML (first 200 chars)=${JSON.stringify(bodySnippet)}`
  );
}

function fractionOf(summary) {
  return summary.totalPixels > 0 ? summary.nonBackgroundCount / summary.totalPixels : 0;
}

async function assertNoRefusalOrBanner(page, stepId) {
  const found = await page.evaluate(() => ({
    canvasRefusalText: document.querySelector(".canvas-refusal")?.textContent ?? null,
    errorBannerText: document.querySelector(".error-banner")?.textContent ?? null,
  }));
  if (found.canvasRefusalText !== null) throw new Error(`${stepId}: .canvas-refusal present: ${found.canvasRefusalText}`);
  if (found.errorBannerText !== null) throw new Error(`${stepId}: .error-banner present: ${found.errorBannerText}`);
}

/**
 * Rider 1 of the human's 2026-08-13 entry-0 decision (`DECISIONS-PENDING.md`, option (a)): the
 * declared `MAX_RESIDENT_VERTICES` ceiling is a designed refusal, not a bug (`limits.ts`: refuse,
 * never silently evict), and it deserves its own deliberate acceptance step rather than the happy
 * path accidentally tripping it. `over-ceiling-refused.parquet` is a VALID GeoParquet file -- the
 * refusal is render-side (mid-stream, once resident vertices would cross the ceiling), never
 * admission-side, so `openPath` must return `{kind:"admitted"}` here, not `{kind:"refused"}`.
 *
 * The core assertion is rider 1's own words, quoted in `residencyStatus.ts`'s own doc comment (via
 * `App.tsx`'s re-export of `nextResidencyStatus`): "dismiss hides the banner, never the status
 * indicator" -- `.canvas-refusal`'s Dismiss button only ever calls `setCanvasRefusal(null)`;
 * `.residency-status` clears only on a later full delivery or a dataset change (asserted separately,
 * by `stepReopen` immediately after this step).
 *
 * **RELEASE-0.1 item 7 (2026-09-07, DECISIONS-PENDING entry 52 = (a)) -- this is a baseline-arm-only
 * mechanic.** Under the shipped candidate default, an over-ceiling view is never an error-shaped
 * refusal at all (`WorkingCanvas.tsx`'s own doc comment, `pushTileBatch`: "the candidate arm never
 * refuses a batch (item B)"; `residencyStatus.ts`'s own doc comment: the `.canvas-refusal` banner is
 * "structurally unreachable from candidate-arm ingest"), so this whole assertion -- the banner
 * existing, its Dismiss button clearing the banner but not the status -- is not re-aimable to the
 * candidate contract without becoming a different test; it stays exercised against the arm ADR-011
 * gate 8 (met 2026-09-02, discharged by ADR-028) actually measured. The arm is pinned ONCE, in
 * `main()`, before this function's first `openPath` -- see this file's own top comment.
 */
async function stepOverCeiling(page, consoleHandle) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_OVER_CEILING);
  if (outcome.kind !== "admitted") {
    throw new Error(
      `OVERCEIL': openPath(over-ceiling fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"} -- ` +
        `this fixture is a VALID file; the refusal is render-side, not admission-side`
    );
  }
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });

  const before = await page.evaluate(() => ({
    canvasRefusalText: document.querySelector(".canvas-refusal")?.textContent ?? null,
    residencyStatusText: document.querySelector(".residency-status")?.textContent ?? null,
  }));
  if (before.canvasRefusalText === null) {
    throw new Error(`OVERCEIL': .canvas-refusal not present after admitting the over-ceiling fixture (settled=${settle.settled})`);
  }
  if (before.residencyStatusText === null) {
    throw new Error(`OVERCEIL': .residency-status not present after admitting the over-ceiling fixture (settled=${settle.settled})`);
  }
  // Plain digits, no thousands separators -- `App.tsx`'s own `ResidencyStatus` doc comment:
  // `datasetRowCount` is a wire `DecU64` string, never narrowed to `Number`. `100000` here is a
  // literal, not a variable, because this fixture shares the happy path's exact `features:
  // 100_000` spec (`manual_walkthrough_fixtures.rs`'s own doc comment on the generator).
  const statusPattern = /^(\d+) of 100000 features rendered — declared ceiling reached \(MAX_RESIDENT_VERTICES\)$/;
  const match = statusPattern.exec(before.residencyStatusText);
  if (!match) {
    throw new Error(
      `OVERCEIL': .residency-status text did not match the expected pattern. Actual: ${JSON.stringify(before.residencyStatusText)}`
    );
  }
  const renderedCount = Number(match[1]);

  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const frac = fractionOf(pixels);
  if (frac <= 0.02) {
    throw new Error(
      `OVERCEIL': pixels non-background fraction ${(frac * 100).toFixed(2)}% <= 2% -- expected most features to have rendered before the ceiling refusal (rendered count per the status line: ${renderedCount})`
    );
  }

  const clicked = await page.evaluate(() => {
    const btn = document.querySelector(".canvas-refusal button");
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!clicked) throw new Error("OVERCEIL': no Dismiss button found inside .canvas-refusal to click");

  const after = await page.evaluate(() => ({
    canvasRefusalPresent: document.querySelector(".canvas-refusal") !== null,
    residencyStatusText: document.querySelector(".residency-status")?.textContent ?? null,
  }));
  if (after.canvasRefusalPresent) {
    throw new Error("OVERCEIL': .canvas-refusal still present after clicking its Dismiss button");
  }
  if (after.residencyStatusText === null) {
    throw new Error(
      'OVERCEIL\': .residency-status disappeared after dismissing the banner -- rider 1\'s core claim ' +
        '("dismiss hides the banner, never the status indicator") violated'
    );
  }
  if (after.residencyStatusText !== before.residencyStatusText) {
    throw new Error(
      `OVERCEIL': .residency-status text changed across the Dismiss click. Before: ${JSON.stringify(before.residencyStatusText)}, after: ${JSON.stringify(after.residencyStatusText)}`
    );
  }

  return (
    `admitted (render-side refusal, not admission-side); .canvas-refusal and .residency-status both present after settle; ` +
    `${renderedCount} of 100000 features rendered (${(frac * 100).toFixed(1)}% pixels non-bg); ` +
    `Dismiss removed the banner but .residency-status remained: "${after.residencyStatusText}"`
  );
}

/** See this file's own top comment for why `REOPEN'` moved here alongside `OVERCEIL'` rather than
 * staying in `regression.mjs`: this step's whole point is asserting that a DATASET CHANGE (not a
 * banner Dismiss) is what clears `.residency-status`, which is only a meaningful claim immediately
 * after `OVERCEIL'` has left that status standing. */
async function stepReopen(page, consoleHandle) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_100K);
  if (outcome.kind !== "admitted") {
    throw new Error(`REOPEN': expected {kind:"admitted"} reopening the 100k fixture, got ${JSON.stringify(outcome)}`);
  }
  // Rider 1 (DECISIONS-PENDING.md entry 0): `admitAndResetStaleUiState`'s "dataset-changed"
  // transition unconditionally nulls `residencyStatus` on every admission -- this reopen runs
  // immediately after `OVERCEIL'` left `.residency-status` present (deliberately, post-Dismiss),
  // so it is that transition's own assertion: a dataset change, not a banner dismiss, is what
  // must clear it. Checked before `waitForSettle` below, with no separate wait -- but not because
  // the reset itself is synchronous end-to-end: `setResidencyStatus(null)` is a synchronous JS
  // *call*, but React's own commit (re-rendering and actually updating the DOM) is not synchronous
  // with it -- React 18 flushes a batch of updates at the next microtask checkpoint, even outside
  // an event handler. What makes checking immediately safe is the `await page.evaluate(...)` this
  // line already crossed: a CDP round trip (browser IPC, not an in-page call) cannot resolve
  // before at least one full microtask checkpoint on the page has passed, so by the time this
  // step's own next `page.evaluate` below runs, React's commit is certainly already done -- the
  // ordering guarantee comes from the round trip already paid for above, not from the setter call
  // being synchronous. A still-present status at this point would be the state surviving the wrong
  // event, not a timing gap this script failed to wait out.
  const residencyStatusAfterReopen = await page.evaluate(() => document.querySelector(".residency-status")?.textContent ?? null);
  if (residencyStatusAfterReopen !== null) {
    throw new Error(
      `REOPEN': .residency-status still present after reopening the happy-path fixture (a dataset change must clear it, not just a banner dismiss). Text: ${JSON.stringify(residencyStatusAfterReopen)}`
    );
  }
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  // `WorkingCanvas` is keyed on `admitted.dataset` (`App.tsx`'s D4 fix, ADR-010 rule 1): the
  // assertion right below this comment, not the click that follows it, is what actually checks the
  // remount fix -- a still-broken reopen (the old, unkeyed canvas reconciling stale residency into
  // the new dataset) would banner a ceiling refusal here, before any click.
  await assertNoRefusalOrBanner(page, "REOPEN' (before Zoom to layer)");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("Zoom to layer"));
    btn?.click();
  });
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const frac = fractionOf(pixels);
  if (frac <= 0.02) {
    throw new Error(`REOPEN': pixels non-background fraction ${(frac * 100).toFixed(2)}% <= 2% after reopening (settled=${settle.settled})`);
  }
  return `reopened 100k fixture -> admitted; .residency-status cleared immediately (dataset change, not Dismiss); canvas ${(frac * 100).toFixed(1)}% non-bg after settle`;
}

/**
 * `SLOW'`/`CANCEL'` -- the acceptance condition ADR-021 exists for, asserted literally (this file's
 * top comment explains why this one step applies its predicate via `queryWithFilter` rather than the
 * DOM input/Apply pair): open the slow fixture, assert the OVERCEIL' pattern FIRST and openly (the
 * fixture's own declared precondition -- `manual_walkthrough_fixtures.rs`'s doc comment on
 * `generate_the_slow_filter_fixture`), THEN apply the late-matching predicate and assert
 * `button.filter-cancel` + `.scan-liveness` are both present WHILE genuinely zero
 * `[render-trace] batch` lines exist for the issued handle, THEN click Cancel and assert
 * `.scan-incomplete` appears with no further batch lines for that handle over a settle window.
 * NO timing assertion anywhere below -- every wait is a bounded robustness poll, never a claim about
 * how fast anything happened (ADR-018).
 *
 * RELEASE-0.1 item 7 (2026-09-07, MUST-FIX 1, reviewer gate): moved here from `filter-panel.mjs`
 * (formerly ARM-PINNED per-step there) -- the arm is pinned ONCE, in `main()`, before this file's
 * first `openPath`; no per-step pin here any more (this file has no OTHER arm to guard against).
 */
async function stepSlowCancel(page, consoleHandle) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_SLOW);
  if (outcome.kind !== "admitted") {
    throw new Error(
      `SLOW'/CANCEL': openPath(slow fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"} -- ` +
        `this fixture is a VALID file; the ceiling refusal is render-side, not admission-side`
    );
  }

  // The unfiltered first look is a ~4,000,000-feature stream that itself refuses part-way through --
  // generous settle/timeout budgets, matching this file's own OVERCEIL' step but wider (this fixture
  // is ~40x that one's feature count).
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 120_000 });

  // The declared precondition, asserted OPENLY, first: this fixture overflows MAX_RESIDENT_VERTICES
  // on the unfiltered first look -- the same OVERCEIL' pattern this file's own stepOverCeiling
  // exercises against a different fixture.
  const overceil = await page.evaluate(() => ({
    canvasRefusalText: document.querySelector(".canvas-refusal")?.textContent ?? null,
    residencyStatusText: document.querySelector(".residency-status")?.textContent ?? null,
  }));
  if (overceil.canvasRefusalText === null) {
    throw new Error(
      `SLOW'/CANCEL': .canvas-refusal not present after admitting the slow fixture -- declared precondition ` +
        `(this fixture overflows MAX_RESIDENT_VERTICES on the unfiltered first look) not observed (settled=${settle.settled})`
    );
  }
  if (overceil.residencyStatusText === null) {
    throw new Error(`SLOW'/CANCEL': .residency-status not present after admitting the slow fixture (settled=${settle.settled})`);
  }
  const statusPattern = new RegExp(
    `^(\\d+) of ${SLOW_FIXTURE_FEATURES} features rendered — declared ceiling reached \\(MAX_RESIDENT_VERTICES\\)$`
  );
  const match = statusPattern.exec(overceil.residencyStatusText);
  if (!match) {
    throw new Error(
      `SLOW'/CANCEL': .residency-status text did not match the OVERCEIL' pattern. Actual: ${JSON.stringify(overceil.residencyStatusText)}`
    );
  }

  // Now the acceptance condition itself. `queryWithFilter` -- see this file's top comment -- both
  // applies the predicate (the same `applyFilter` seam a real Apply click uses) and hands back the
  // issued stream handle directly, with no need to race a console line that does not exist yet.
  const consoleIndexBeforeApply = consoleHandle.entries.length;
  const applyOutcome = await page.evaluate(
    (p) => window.__SPATIAL_E2E__.queryWithFilter(p),
    SLOW_FIXTURE_PREDICATE
  );
  if (applyOutcome.kind !== "applied") {
    throw new Error(
      `SLOW'/CANCEL': queryWithFilter("${SLOW_FIXTURE_PREDICATE}") returned ${JSON.stringify(applyOutcome)}, expected {kind:"applied"}`
    );
  }
  const handle = applyOutcome.streamHandle;

  // P6 review, should-fix 3: a real pre-batch reference for `handle` before the zero-batch-lines
  // check below even runs -- retires that check's prior "true by construction" weakness. `traceStreamIssued`
  // (`diagnostics/renderTrace.ts`) fires synchronously, inside `ViewportStreamManager.requestViewport`,
  // right before that same promise resolves with the handle -- so this line should already be in the
  // console buffer by the time `applyOutcome` above resolved; polled anyway (bounded, not timed) as
  // the same robustness margin every other DOM/console check in this suite already uses.
  const issuedLine = await waitForCondition(
    () =>
      Promise.resolve(
        consoleHandle.entries
          .slice(consoleIndexBeforeApply)
          .some((e) => e.text.includes("[render-trace] stream-issued") && e.text.includes(handle))
      ),
    (found) => found === true,
    10_000
  );
  if (!issuedLine.ok) {
    throw new Error(
      `SLOW'/CANCEL': no [render-trace] stream-issued line found for ${handle} within 10s of queryWithFilter ` +
        `resolving -- the zero-batch-lines check below would be true by construction without this`
    );
  }

  // Poll (bounded, not timed) for BOTH the Cancel affordance and the liveness indicator.
  const shown = await waitForCondition(
    () =>
      page.evaluate(() => ({
        cancelPresent: document.querySelector("button.filter-cancel") !== null,
        cancelDisabled: document.querySelector("button.filter-cancel")?.disabled ?? null,
        livenessText: document.querySelector(".scan-liveness")?.textContent ?? null,
      })),
    (state) => state.cancelPresent && state.livenessText !== null,
    15_000
  );
  if (!shown.ok) {
    throw new Error(
      `SLOW'/CANCEL': button.filter-cancel + .scan-liveness never both appeared within 15s of Apply ` +
        `(last observed: ${JSON.stringify(shown.last)}) -- if this is because a batch already arrived and cleared ` +
        `liveness, the fixture scanned too fast; per NEXT-CUT.md P5 item 3 the fix is a larger fixture or a ` +
        `later-matching predicate, never a weakened assertion`
    );
  }
  if (shown.last.cancelDisabled !== false) {
    throw new Error(`SLOW'/CANCEL': button.filter-cancel present but disabled=${JSON.stringify(shown.last.cancelDisabled)}`);
  }
  const expectedLivenessText = "Filtering — scanning, no matching rows yet";
  if (shown.last.livenessText !== expectedLivenessText) {
    throw new Error(
      `SLOW'/CANCEL': .scan-liveness text mismatch.\nExpected: ${expectedLivenessText}\nActual:   ${shown.last.livenessText}`
    );
  }

  // THE acceptance condition, asserted literally, over the SAME window the two checks above just
  // held in: zero [render-trace] batch lines for `handle` since the predicate was applied.
  const batchLinesBeforeCancel = consoleHandle.entries
    .slice(consoleIndexBeforeApply)
    .filter((e) => e.text.includes("[render-trace] batch") && e.text.includes(handle));
  if (batchLinesBeforeCancel.length > 0) {
    throw new Error(
      `SLOW'/CANCEL': expected ZERO [render-trace] batch lines for ${handle} while Cancel/liveness were shown -- ` +
        `found ${batchLinesBeforeCancel.length} (the fixture's scan completed too fast; per NEXT-CUT.md P5 item 3 ` +
        `the fix is a larger fixture or a later-matching predicate, never a weakened assertion). First: ${batchLinesBeforeCancel[0]?.text}`
    );
  }

  const clicked = await page.evaluate(() => {
    const btn = document.querySelector("button.filter-cancel");
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!clicked) {
    throw new Error("SLOW'/CANCEL': button.filter-cancel disappeared before it could be clicked");
  }

  const incomplete = await waitForCondition(
    () => page.evaluate(() => document.querySelector(".scan-incomplete")?.textContent ?? null),
    (text) => text !== null,
    15_000
  );
  if (!incomplete.ok) {
    throw new Error("SLOW'/CANCEL': .scan-incomplete never appeared within 15s of clicking Cancel");
  }
  const incompletePattern = /^Filtered view incomplete — scan cancelled at (\d+) rows$/;
  const incompleteMatch = incompletePattern.exec(incomplete.last);
  if (!incompleteMatch) {
    throw new Error(`SLOW'/CANCEL': .scan-incomplete text did not match the expected pattern. Actual: ${JSON.stringify(incomplete.last)}`);
  }
  const rowsAtCancel = Number(incompleteMatch[1]);
  if (rowsAtCancel !== 0) {
    throw new Error(
      `SLOW'/CANCEL': .scan-incomplete reports ${rowsAtCancel} rows at cancel -- the acceptance condition is that ` +
        `Cancel landed with ZERO rows delivered yet (consistent with the zero-batch-lines check above)`
    );
  }

  // Settle window: a bounded wait, not a timing claim -- see this function's own doc comment. Long
  // enough that if the (already-cancelled) producer were somehow still going to emit a batch for this
  // handle, it would have by now; ADR-018 forbids asserting HOW fast cancellation reached the
  // producer, not waiting out a fixed window before checking a state that must not change further.
  await sleep(3000);
  const batchLinesAfterCancel = consoleHandle.entries.filter(
    (e) => e.text.includes("[render-trace] batch") && e.text.includes(handle)
  );
  if (batchLinesAfterCancel.length > 0) {
    throw new Error(
      `SLOW'/CANCEL': expected ZERO [render-trace] batch lines for ${handle} even after Cancel + a 3s settle window -- ` +
        `found ${batchLinesAfterCancel.length}`
    );
  }

  return (
    `OVERCEIL' pattern observed openly (${match[1]} of ${SLOW_FIXTURE_FEATURES}); applied "${SLOW_FIXTURE_PREDICATE}" ` +
    `(handle ${handle}, [render-trace] stream-issued line confirmed); Cancel enabled + liveness "${expectedLivenessText}" ` +
    `shown WHILE zero batch lines existed for that handle; Cancel clicked; .scan-incomplete "${incomplete.last}"; ` +
    `zero batch lines for that handle ever, including a 3s settle window after Cancel`
  );
}

// ---------------------------------------------------------------------------------------

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 600_000);
  const watchdog = setTimeout(() => {
    console.error(`refusal-contract-baseline: SPATIAL_E2E_DEADLINE_MS (default 600000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  for (const [label, path] of [
    ["100k happy path", FIXTURE_100K],
    ["over-ceiling (deliberate)", FIXTURE_OVER_CEILING],
  ]) {
    if (!existsSync(path)) {
      console.error(`refusal-contract-baseline: ${label} fixture not found: ${path}`);
      console.error(`Regenerate the manual-walkthrough fixtures with:\n  ${REGEN_COMMAND}`);
      process.exitCode = 1;
      return;
    }
  }
  if (!existsSync(FIXTURE_SLOW)) {
    console.error(`refusal-contract-baseline: slow filter scan fixture not found: ${FIXTURE_SLOW}`);
    console.error(`Regenerate with:\n  ${REGEN_SLOW_COMMAND}`);
    process.exitCode = 1;
    return;
  }

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`refusal-contract-baseline: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL"|"INFO", note: string}>} */
  const results = [];

  async function runStep(id, timeoutMs, fn, passStatus = "PASS") {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(fn(), timeoutMs, id);
      results.push({ id, status: passStatus, note });
      console.log(`[${id}] ${passStatus} (${Date.now() - startedAt}ms): ${note}`);
    } catch (e) {
      const note = e?.message ?? String(e);
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
    }
  }

  try {
    console.log(`refusal-contract-baseline: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const mountReady = await waitForMountReady(page);
    console.log(
      `refusal-contract-baseline: mount-readiness gate PASSED after ${mountReady.readyAfterMs}ms (.app-header and window.__SPATIAL_E2E__.openPath both present)`
    );

    // MUST-FIX 1 (reviewer gate, 2026-09-07): pinned ONCE, here, before the first `openPath` this
    // process ever issues -- no dataset has ever opened in THIS process yet, the only point
    // `setResidencyArm` is guaranteed not to be refused (`residencyArm.ts`'s own "refused while a
    // dataset is open" contract). The readback (`getResidencyArm()`) is asserted SEPARATELY from the
    // setter's own `{ok:true}` -- the reviewer's own instruction: "not `{ok:true}` trusted" -- so a
    // caller-side bug that returns `{ok:true}` without `currentArm` actually having moved would still
    // be caught here, not silently believed.
    const setResult = await page.evaluate(() => window.__SPATIAL_E2E__.setResidencyArm?.("baseline"));
    if (!setResult || setResult.ok !== true) {
      throw new Error(`refusal-contract-baseline: setResidencyArm("baseline") failed: ${JSON.stringify(setResult)}`);
    }
    const armReadback = await page.evaluate(() => window.__SPATIAL_E2E__.getResidencyArm?.());
    if (armReadback !== "baseline") {
      throw new Error(
        `refusal-contract-baseline: getResidencyArm() readback was ${JSON.stringify(armReadback)}, expected "baseline" -- ` +
          `setResidencyArm returned {ok:true} but the arm did not actually move`
      );
    }
    console.log(`refusal-contract-baseline: residency arm pinned to "baseline", readback confirmed`);

    // Harness hygiene, not a walkthrough step: a previous run (or prior interactive use) may have
    // left a dismissable refusal banner up from before this run started.
    await page
      .evaluate(() => {
        document.querySelectorAll(".canvas-refusal button, .error-banner button").forEach((b) => b.click());
      })
      .catch(() => {});

    await runStep("OVERCEIL'", 60_000, () => stepOverCeiling(page, consoleHandle));
    await runStep("REOPEN'", 60_000, () => stepReopen(page, consoleHandle));
    await runStep("SLOW'/CANCEL'", 240_000, () => stepSlowCancel(page, consoleHandle));

    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    const statusWidth = 6;
    console.log(`${"Step".padEnd(idWidth)}  ${"Status".padEnd(statusWidth)}  Note`);
    console.log(`${"-".repeat(idWidth)}  ${"-".repeat(statusWidth)}  ${"-".repeat(40)}`);
    for (const r of results) {
      console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(statusWidth)}  ${r.note}`);
    }

    const anyFail = results.some((r) => r.status === "FAIL");
    process.exitCode = anyFail ? 1 : 0;
  } catch (e) {
    console.error(`refusal-contract-baseline: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `refusal-contract-baseline-render-trace-${Date.now()}.json`);
      writeFileSync(
        ledgerPath,
        JSON.stringify({ renderTrace: consoleHandle.renderTrace(), allConsoleEntries: consoleHandle.entries }, null, 2)
      );
      console.log(`Full render-trace ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`refusal-contract-baseline: failed to write the render-trace ledger: ${e.message}`);
    }
    consoleHandle.dispose();
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
