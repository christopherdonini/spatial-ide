#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- FILTER'/REFUSED' steps for NEXT-CUT.md sql-filter cut,
// phase P5 (the shell's filter client wrapper + dev-only E2E hook). Sibling to regression.mjs, not
// folded into it: P5's scope is strictly the client + hook, and regression.mjs's own README note
// ("Currently RED on A5'-A9'") names a pre-existing, unrelated shell defect this script must not be
// entangled with -- a FAIL here must mean a real filter defect, never collateral from a different
// step. Same attach-or-launch path, same in-page hooks contract (`openPath`, `capturePixels`,
// `queryWithFilter`), same watchdog/deadline discipline, same **E2E-verified** evidence class
// (e2e/README.md) as regression.mjs -- driven through real IPC and a real render loop, via an
// in-page hook, not through the (nonexistent) shell filter panel (NEXT-CUT.md: out of scope).
//
// `waitForMountReady` and `withTimeout` are duplicated from regression.mjs rather than imported --
// this workspace's own established convention for sibling test files (`CUT-STATE.md`'s Rust
// integration tests duplicate rather than cross-import for the identical reason).

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");

const FIXTURE_FILTER = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

// Verbatim from `engine/src/predicate.rs`'s `Display` impl for `FilterError::UnknownColumn`
// (traced through `kernel/src/skp.rs::filter_error_of`, `message = e.to_string()`).
const UNKNOWN_COLUMN_MESSAGE = "refused: `bogus_column_xyz` is not a column this dataset carries";

/** Bounds one step's whole async body -- identical to regression.mjs's own helper. */
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

const MOUNT_READY_TIMEOUT_MS = 90_000;

/** Same gate regression.mjs uses, before A1' -- see its own doc comment for the fresh-launch race
 * this closes (a WebView2 page target existing is not the same fact as React having mounted). */
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
    await new Promise((resolve) => setTimeout(resolve, 300));
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
  return "admitted; window.__SPATIAL_E2E__.queryWithFilter now registered (dataset-scoped)";
}

/**
 * The core assertion (NEXT-CUT.md P5, deliverable 4): open, capture the unfiltered non-background
 * fraction, apply a valid predicate through `queryWithFilter` (the same client function a future
 * filter panel would call, per `App.tsx`'s own hook registration), capture again, assert the
 * filtered fraction is MEASURABLY LOWER, with a margin, and that the filtered stream still rendered
 * (not blank). `filter-zoned.parquet`'s `zone = 'residential'` predicate admits ~1/5 of rows,
 * scattered across the whole grid (`manual_walkthrough_fixtures.rs`'s own doc comment on this
 * fixture) -- 60% of the unfiltered fraction is a generous margin above the ~20% expected, so this
 * only trips for a real defect (no reduction at all, or the predicate silently ignored), not
 * rendering noise between two captures of the same fixed camera viewport (never panned/zoomed
 * between the two captures in this step, so "over a fixed bbox" holds by construction, not by
 * re-deriving one).
 */
async function stepFilter(page, consoleHandle) {
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const unfiltered = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const unfilteredFraction = fractionOf(unfiltered);
  if (unfilteredFraction <= 0.02) {
    throw new Error(
      `FILTER': unfiltered non-background fraction ${(unfilteredFraction * 100).toFixed(2)}% <= 2% -- nothing rendered to filter against`
    );
  }

  const outcome = await page.evaluate(
    (predicate) => window.__SPATIAL_E2E__.queryWithFilter(predicate),
    "zone = 'residential'"
  );
  // "applied", not "issued"/"admitted" (filter-panel cut P3, deviation-3 retrofit: queryWithFilter
  // now routes through App.tsx's own `applyFilter` -- the same seam the real FilterPanel's Apply
  // button calls -- and reports ITS outcome shape, `ApplyFilterOutcome`, not the lower-level
  // `RequestOutcome` P1 reported): a ticket was actually minted for this call and committed as the
  // active filter. The subsequent pixel-fraction comparison below is still what proves the filtered
  // query rendered, which "applied" alone cannot.
  if (outcome.kind !== "applied") {
    throw new Error(
      `FILTER': queryWithFilter("zone = 'residential'") returned ${JSON.stringify(outcome)}, expected {kind:"applied"}`
    );
  }

  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const filtered = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const filteredFraction = fractionOf(filtered);

  const MARGIN = 0.6; // filtered must be under 60% of unfiltered -- see this function's own doc comment
  if (filteredFraction >= unfilteredFraction * MARGIN) {
    throw new Error(
      `FILTER': filtered fraction ${(filteredFraction * 100).toFixed(2)}% is not measurably lower than unfiltered ` +
        `${(unfilteredFraction * 100).toFixed(2)}% (threshold: below ${(MARGIN * 100).toFixed(0)}% of unfiltered, settled=${settle.settled})`
    );
  }
  if (filteredFraction <= 0.002) {
    throw new Error(
      `FILTER': filtered fraction ${(filteredFraction * 100).toFixed(3)}% is effectively blank -- the filtered stream did not visibly render (settled=${settle.settled})`
    );
  }

  return (
    `admitted; unfiltered ${(unfilteredFraction * 100).toFixed(1)}% non-bg, filtered ${(filteredFraction * 100).toFixed(1)}% non-bg ` +
    `(< ${(MARGIN * 100).toFixed(0)}% of unfiltered); filtered stream rendered, not blank (settled=${settle.settled})`
  );
}

/**
 * `NEXT-CUT.md` P5 deliverable 4's second assertion: an invalid predicate (a made-up column) must
 * surface a typed `skp.filter_*` code/message to the client, with no crash or hang -- admission runs
 * synchronously, pre-lease/pre-mint (`kernel/src/skp.rs`, P4), so this is expected to resolve
 * quickly rather than time out.
 */
async function stepRefused(page) {
  const outcome = await page.evaluate(
    (predicate) => window.__SPATIAL_E2E__.queryWithFilter(predicate),
    "bogus_column_xyz = 1"
  );
  if (outcome.kind !== "refused") {
    throw new Error(`REFUSED': queryWithFilter("bogus_column_xyz = 1") returned ${JSON.stringify(outcome)}, expected {kind:"refused"}`);
  }
  // filter-panel cut P3 (deviation-3 retrofit): the refusal is now `applyFilter`'s own structured
  // `FormattedRefusal` (`outcome.refusal.{code,message,fields,remediationIsCut2}`), not the bare
  // `{code, message}` pair P1's direct-`requestViewport` hook used to construct by hand.
  if (outcome.refusal.code !== "skp.filter_unknown_column") {
    throw new Error(
      `REFUSED': expected code "skp.filter_unknown_column", got "${outcome.refusal.code}" (message: ${outcome.refusal.message})`
    );
  }
  if (outcome.refusal.message !== UNKNOWN_COLUMN_MESSAGE) {
    throw new Error(`REFUSED': message mismatch.\nExpected: ${UNKNOWN_COLUMN_MESSAGE}\nActual:   ${outcome.refusal.message}`);
  }
  return `refused skp.filter_unknown_column; message verbatim; call resolved (no crash/hang)`;
}

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 300_000);
  const watchdog = setTimeout(() => {
    console.error(`filter: SPATIAL_E2E_DEADLINE_MS (default 300000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE_FILTER)) {
    console.error(`filter: fixture not found: ${FIXTURE_FILTER}`);
    console.error(`Regenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    return;
  }

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`filter: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL", note: string}>} */
  const results = [];

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
    console.log(`filter: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const mountReady = await waitForMountReady(page);
    console.log(`filter: mount-readiness gate PASSED after ${mountReady.readyAfterMs}ms`);

    await runStep("OPEN", 40_000, () => stepOpen(page));
    await runStep("FILTER'", 60_000, () => stepFilter(page, consoleHandle));
    await runStep("REFUSED'", 20_000, () => stepRefused(page));

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
    console.error(`filter: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `filter-render-trace-${Date.now()}.json`);
      writeFileSync(
        ledgerPath,
        JSON.stringify({ renderTrace: consoleHandle.renderTrace(), allConsoleEntries: consoleHandle.entries }, null, 2)
      );
      console.log(`Full render-trace ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`filter: failed to write the render-trace ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    // Same policy as regression.mjs: disconnect only, never stop the app -- a launched fallback
    // session is left running for further interactive use.
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
