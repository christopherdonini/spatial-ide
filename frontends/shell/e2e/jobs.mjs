#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 4, J-E1 and J-E2 as Amendments 2, 4 and 15 leave them): the Jobs tab on the shipped candidate arm, on real WebView2,
// run as `node e2e/jobs.mjs` from frontends/shell. WRITTEN, NOT RUN, by the build that added it: the run is the tester's.
// Fixtures, from this checkout's target/fixtures/manual-walkthrough (the manual-walkthrough fixture generator): `slow-filter-scan.parquet` (J-E1) and `100k-happy-path.parquet` (J-E2);
// `--slow <path>` and `--fixture <path>` name others. Neither is written. The app's store is a scratch LOCALAPPDATA. The arm is the shipped one: `getResidencyArm()` is read back as
// "candidate" before the first `openPath`, and `setResidencyArm` is never called. The words are read by name from `src/jobs/jobs.ts`, never typed here.
//
//   J-E1  open the slow fixture, wait for the first look's settle, and apply the slow predicate through the Filter panel as `filter-panel.mjs`'s FIND' does (Amendment 4's N-2, in place of
//         the pan of H6, which this run neither confirms nor refutes): the Jobs scan row and `button.filter-cancel` stand; click Cancel in Jobs; the row and `button.filter-cancel` are
//         gone, `.residency-status` is the owner's relinquished statement (`residencyStatus.ts`), and `.scan-incomplete` stays absent over a bounded settle window. Any other status FAILS.
//   J-E2  open the 100k fixture, start a prepare through `publishPrepareWithDestination` and do not wait for it (H4): the export row stands; click Cancel in Jobs; Cancel answers false,
//         so S-11 shows and Cancel is offered again; the row leaves when the prepare ends. If the row is gone before the click, the run is VOID, never a PASS.
// Exit 0 all PASS; 1 a check failed, a wait after a Cancel click that timed out included; 2 VOID (a precondition failed: the arm, a fixture, a row never standing or gone before its click, any other wait that timed out).
// What this does not prove: any docs/08 figure, macOS or Linux, the baseline arm, or a timing. Waits are harness bounds on readiness (ADR-018).
import { existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const TEMP_BASE = realpathSync.native(tmpdir());
const SCRATCH = mkdtempSync(join(TEMP_BASE, "spatial-jobs-"));
process.env.LOCALAPPDATA = SCRATCH;

const { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } = await import("./lib.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const argAfter = (flag, fallback) => (argv.indexOf(flag) !== -1 ? argv[argv.indexOf(flag) + 1] : fallback);
const FIXTURES = join(HERE, "..", "..", "..", "target", "fixtures", "manual-walkthrough");
const SLOW = argAfter("--slow", join(FIXTURES, "slow-filter-scan.parquet"));
const HAPPY = argAfter("--fixture", join(FIXTURES, "100k-happy-path.parquet"));
const JOBS_SOURCE = join(HERE, "..", "src", "jobs", "jobs.ts");
const MOUNT_READY_TIMEOUT_MS = 90_000;
const WAIT_TIMEOUT_MS = 60_000;
const NO_INCOMPLETE_WINDOW_MS = 3_000;
// The slow fixture's own predicate, as filter-panel.mjs builds it: 4,000,000 features, the last 100 matching.
const SLOW_PREDICATE = `id > ${4_000_000 - 100}`;
// The owner's relinquished statement (`relinquishedText`, src/residency/residencyStatus.ts): the count is the only part that varies.
const RELINQUISHED = /^Filling stopped — showing \d+ features already loaded; the rest of this view was not loaded\.$/;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
class Void extends Error {}
const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ::  ${detail}`);
}

async function waitFor(what, read, predicate, timeoutMs = WAIT_TIMEOUT_MS, pollMs = 100) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    try {
      last = await read();
      if (predicate(last)) return last;
    } catch (e) {
      last = { readFailed: e.message };
    }
    await sleep(pollMs);
  }
  throw new Void(`waited ${timeoutMs}ms for ${what}; the last reading was ${JSON.stringify(last)}`);
}

/** A string constant of jobs.ts, by its exported name. */
function jobsWord(name) {
  const found = new RegExp(`export const ${name} =\\s*("(?:[^"\\\\]|\\\\.)*");`).exec(readFileSync(JOBS_SOURCE, "utf8"));
  if (found === null) throw new Void(`${JOBS_SOURCE} holds no exported ${name} constant`);
  return JSON.parse(found[1]);
}

const settle = async (consoleHandle, what, quietMs = 2000) => {
  const outcome = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs, timeoutMs: 120_000 });
  if (!outcome.settled) throw new Void(`the render trace was not quiet for ${quietMs}ms within 120000ms (${what})`);
};

/** The Jobs tab and FilterPanel's own Cancel as the page shows them, in one read. */
const read = (page) =>
  page.evaluate(() => {
    const jobs = document.querySelector("#activity-panel-jobs");
    const row = (kind) => jobs?.querySelector(`.jobs-row-${kind}`) ?? null;
    return {
      scanRow: row("scan")?.textContent ?? null,
      exportRow: row("export")?.textContent ?? null,
      exportCancel: row("export")?.querySelector("button.jobs-cancel")?.textContent ?? null,
      exportCancelDisabled: row("export")?.querySelector("button.jobs-cancel")?.disabled ?? null,
      notCancelled: row("export")?.querySelector(".jobs-not-cancelled")?.textContent ?? null,
      empty: jobs?.querySelector(".jobs-empty")?.textContent ?? null,
      filterCancel: document.querySelector("button.filter-cancel") !== null,
      residency: document.querySelector(".residency-status")?.textContent ?? null,
      incomplete: document.querySelector(".scan-incomplete") !== null,
    };
  });

/** Shows the Jobs tab: Activity open, then the tab. */
async function showJobs(page) {
  const opened = await page.evaluate(() => document.querySelector("#region-activity")?.hasAttribute("hidden") === false);
  if (!opened) await page.click('.top-bar-toggle[aria-controls="region-activity"]');
  await page.click("#activity-tab-jobs");
  await waitFor("the Jobs tab selected", () => page.evaluate(() => document.querySelector("#activity-tab-jobs")?.getAttribute("aria-selected")), (v) => v === "true", 20_000);
}

async function openFixture(page, consoleHandle, path) {
  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), path);
  if (opened?.kind !== "admitted") throw new Void(`openPath did not admit ${path}: ${JSON.stringify(opened)}`);
  await settle(consoleHandle, "after the open");
}

async function jE1(page, consoleHandle) {
  await openFixture(page, consoleHandle, SLOW);
  await page.fill("input.filter-predicate", SLOW_PREDICATE);
  await page.click("button.filter-apply");
  await showJobs(page);
  const standing = await waitFor("the Jobs scan row and FilterPanel's Cancel", () => read(page), (r) => r.scanRow !== null && r.filterCancel);
  record("J-E1: the Jobs scan row shows S-8, and FilterPanel's Cancel stands", standing.scanRow.includes(jobsWord("SCAN_JOB_TEXT")), JSON.stringify(standing.scanRow));
  await page.click("#activity-panel-jobs .jobs-row-scan button.jobs-cancel", { timeout: 5_000 }).catch(() => {
    throw new Void("the scan row was gone before the click: the scan ended first");
  });
  const after = await waitFor("the row and FilterPanel's Cancel to go", () => read(page), (r) => r.scanRow === null && !r.filterCancel, 20_000).catch(() => read(page));
  record("J-E1: the row and button.filter-cancel are gone", after.scanRow === null && !after.filterCancel, `row ${JSON.stringify(after.scanRow)}, filter-cancel ${after.filterCancel}`);
  const status = await waitFor("the relinquished statement", () => read(page), (r) => RELINQUISHED.test(r.residency ?? ""), 20_000).catch((e) => e);
  record("J-E1: .residency-status is the owner's relinquished statement", !(status instanceof Error), status instanceof Error ? status.message : JSON.stringify(status.residency));
  let incomplete = false;
  for (const start = Date.now(); Date.now() - start < NO_INCOMPLETE_WINDOW_MS; await sleep(100)) incomplete ||= (await read(page)).incomplete;
  record("J-E1: .scan-incomplete stays absent over the settle window", !incomplete, `${NO_INCOMPLETE_WINDOW_MS}ms window, present ${incomplete}`);
}

async function jE2(page, consoleHandle) {
  await openFixture(page, consoleHandle, HAPPY);
  await waitFor("the publishPrepareWithDestination hook", () => page.evaluate(() => typeof window.__SPATIAL_E2E__?.publishPrepareWithDestination), (t) => t === "function", 20_000);
  const parent = mkdtempSync(join(TEMP_BASE, "spatial-jobs-bundle-"));
  mkdirSync(parent, { recursive: true });
  // Not awaited (H4): the prepare is the run the row stands for.
  const prepared = page.evaluate((d) => window.__SPATIAL_E2E__.publishPrepareWithDestination(d, "whole"), join(parent, "bundle"));
  const settled = prepared.then(() => true, () => true);
  await showJobs(page);
  const standing = await waitFor("the export row", () => read(page), (r) => r.exportRow !== null, 20_000).catch(() => null);
  if (standing === null) throw new Void("the export row never stood before the prepare ended: the prepare was too quick to cancel (H4's precondition)");
  record("J-E2: the export row shows S-9", standing.exportRow.includes(jobsWord("EXPORT_JOB_TEXT")), JSON.stringify(standing.exportRow));
  await page.click("#activity-panel-jobs .jobs-row-export button.jobs-cancel", { timeout: 5_000 }).catch(() => {
    throw new Void("the export row was gone before the click: the prepare ended first");
  });
  const answered = await waitFor("S-11 on the row", () => read(page), (r) => r.notCancelled !== null || r.exportRow === null, 20_000).catch(() => read(page));
  record("J-E2: Cancel answers false: S-11 shows and Cancel is offered again (H4)", answered.notCancelled === jobsWord("NOT_CANCELLED_TEXT") && answered.exportCancel === "Cancel" && answered.exportCancelDisabled === false, JSON.stringify(answered));
  await settled;
  const gone = await waitFor("the row to leave at the prepare's end", () => read(page), (r) => r.exportRow === null, 20_000).catch(() => read(page));
  record("J-E2: the row leaves when the prepare ends", gone.exportRow === null, `S-7 reads ${JSON.stringify(gone.empty)}`);
}

async function run(page, consoleHandle) {
  await waitFor("the app header and the openPath hook", () => page.evaluate(() => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function"), (ready) => ready === true, MOUNT_READY_TIMEOUT_MS, 300);
  const arm = await page.evaluate(() => window.__SPATIAL_E2E__.getResidencyArm?.());
  if (arm !== "candidate") throw new Void(`getResidencyArm() read ${JSON.stringify(arm)}, expected "candidate": the shipped arm is the one this suite proves`);
  await jE1(page, consoleHandle);
  await jE2(page, consoleHandle);
}

async function main() {
  for (const path of [SLOW, HAPPY]) {
    if (!existsSync(path)) {
      console.error(`jobs: fixture missing: ${path}\nRegenerate with the manual-walkthrough fixture generator (frontends/shell/MANUAL-WALKTHROUGH.md names it), or pass --slow / --fixture <path>.`);
      process.exit(2);
    }
  }
  const session = await attachOrLaunch();
  if (!session.launched) {
    console.error(`jobs: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA; stop it and run again.`);
    await session.browser.close().catch(() => {});
    process.exit(2);
  }
  const consoleHandle = attachConsole(session.page);
  let voided = null;
  try {
    await run(session.page, consoleHandle);
  } catch (e) {
    if (!(e instanceof Void)) { console.error("jobs.mjs fatal:", e?.stack ?? e); voided = `fatal: ${e?.message ?? e}`; } else voided = e.message;
  } finally {
    consoleHandle.dispose();
    await session.stop().catch(() => {});
    console.log(`the scratch store, with the session log, is kept: ${SCRATCH}`);
  }
  if (voided) { console.log(`\nVOID  ${voided} -- not a PASS (checks recorded before it: ${results.length})`); process.exit(2); }
  const failed = results.filter((r) => !r.ok);
  console.log(`\n==== ${results.length - failed.length}/${results.length} PASS ====`);
  if (failed.length) { console.log("FAILED:", failed.map((f) => f.name).join("; ")); process.exit(1); }
  process.exit(0);
}

await main();
