#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- E-RECOVER of the recovery offer (B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md, section 4): a session an
// earlier run left behind is offered at the next start, Recover brings its filter and style back, the next step continues that record, and
// Discard removes it. Sibling to `recording.mjs` (same scratch store, same kill) and `reopen.mjs` (the same read of the applied workspace).
//
// **One scratch store, three launches.** LOCALAPPDATA is set to a fresh folder before lib.mjs is loaded, so every app this suite launches
// uses <scratch>\spatial-ide\sessions and nothing else; it launches its own app each time (after the earlier one's port is free) and refuses
// one already listening. A live history is locked, and on Windows that blocks a read, so every read of history.jsonl follows a kill.
// Recover is read through e2eReadWorkspace (the dev seam reopen.mjs uses). The data is the unchanged fixture, so no reopen notice is expected.
// What it proves not: the recover's check against changed data (K-C5 and S-6), the native pickers, and the operator's reading of the offer's words.

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const SCRATCH = mkdtempSync(join(tmpdir(), "spatial-recover-"));
process.env.LOCALAPPDATA = SCRATCH;

const { attachOrLaunch, CDP_PORT } = await import("./lib.mjs");

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");
const STORE_ROOT = join(SCRATCH, "spatial-ide", "sessions");

const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const FIXTURE_NAME = "filter-zoned.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

const PREDICATE = "zone = 'residential'";
const SET_COLOUR = "#112233";
const NEXT_OPACITY = "0.5";
const MOUNT_READY_TIMEOUT_MS = 90_000;

function dropScratch() {
  try {
    rmSync(SCRATCH, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
  } catch (e) {
    console.error(`recover: could not remove the scratch store ${SCRATCH}: ${e.message}`);
  }
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const withTimeout = (promise, ms, stepId) =>
  Promise.race([promise, sleep(ms).then(() => Promise.reject(new Error(`${stepId}: timed out after ${ms}ms`)))]);

/** A bounded poll is a readiness gate (has this state arrived yet), never a claim about how fast anything happened (ADR-018). */
async function waitForCondition(getValue, predicate, timeoutMs, pollMs = 150) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await getValue();
    if (predicate(last)) return { ok: true, last };
    await sleep(pollMs);
  }
  return { ok: false, last };
}

async function waitForMountReady(page) {
  const probe = () => page.evaluate(() => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false);
  if (!(await waitForCondition(probe, (ready) => ready === true, MOUNT_READY_TIMEOUT_MS, 300)).ok) {
    throw new Error(`mount-readiness gate: .app-header and the openPath hook did not appear within ${MOUNT_READY_TIMEOUT_MS}ms`);
  }
}

/** True once nothing answers on the CDP port: the earlier app is gone. */
async function waitForPortFree() {
  const free = await waitForCondition(
    () => fetch(`http://127.0.0.1:${CDP_PORT}/json/version`).then(() => false, () => true),
    (isFree) => isFree === true,
    60_000,
    500
  );
  if (!free.ok) throw new Error(`CDP port ${CDP_PORT} still answers 60 s after the kill`);
}

/** Launches this suite's own app on the scratch store, or throws. */
async function launch(label) {
  await waitForPortFree();
  const session = await attachOrLaunch();
  if (!session.launched) {
    await session.browser.close().catch(() => {});
    throw new Error(`${label}: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA; stop it and run again`);
  }
  await waitForMountReady(session.page);
  return session;
}

const folders = () => (existsSync(STORE_ROOT) ? readdirSync(STORE_ROOT) : []);

/** After a kill: the one record folder's history, once the lock is freed, as parsed steps. */
async function readSteps(folder) {
  const found = await waitForCondition(
    () => {
      try {
        return readFileSync(join(STORE_ROOT, folder, "history.jsonl"), "utf8");
      } catch {
        return null;
      }
    },
    (text) => text !== null,
    30_000,
    500
  );
  if (!found.ok) throw new Error(`no readable history.jsonl in ${folder}; a live lock would read as this`);
  const lines = found.last.replace(/\n$/, "").split("\n");
  return lines.slice(1).map((line) => JSON.parse(line).step);
}

async function recordStepRows(page) {
  await page.evaluate(() => {
    const panel = document.querySelector(".console-disclosure");
    if (panel && panel.getAttribute("aria-expanded") !== "true") panel.click();
    document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click());
  });
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".console-entry-class-a"))
      .filter((el) => el.querySelector(".console-entry-header")?.textContent === "record_step")
      .map((el) => el.querySelector(".console-outcome")?.textContent ?? null)
  );
}

/** Waits until exactly `count` `record_step` rows exist and all are `ok`: the kernel replied, after its flush. */
async function waitForRows(page, count) {
  const polled = await waitForCondition(() => recordStepRows(page), (rows) => rows.length >= count && rows.every((o) => o === "ok"), 30_000);
  if (!polled.ok || polled.last.length !== count) throw new Error(`expected exactly ${count} record_step rows, all ok; saw ${JSON.stringify(polled.last)}`);
}

async function openStyleControls(page) {
  await page.click("#inspector-tab-style");
  if (!(await page.evaluate(() => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded") === "true"))) await page.click(".style-disclosure");
  const ready = await waitForCondition(() => page.evaluate(() => document.querySelector(".style-fill-opacity") !== null), (v) => v === true, 5_000);
  if (!ready.ok) throw new Error("the style controls did not appear after the disclosure was clicked");
}

const readWorkspace = (page) => page.evaluate(() => window.__SPATIAL_E2E__.e2eReadWorkspace());

/** RUN-1: open, apply a filter, commit a fill colour, then kill the process tree. */
async function stepFirstRun(ctx) {
  const session = await launch("RUN-1");
  ctx.sessions.push(session);
  const { page } = session;
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  if (outcome.kind !== "admitted") throw new Error(`openPath(fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  await page.fill("input.filter-predicate", PREDICATE);
  await page.click("button.filter-apply");
  await waitForRows(page, 1);
  await openStyleControls(page);
  await page.fill("input.style-fill-color", SET_COLOUR);
  await waitForRows(page, 2);
  await session.stop();

  const [folder, ...others] = folders();
  if (others.length > 0 || !/^unsaved-[0-9a-f]{32}$/.test(folder ?? "")) throw new Error(`expected one unsaved-<32 hex> folder, saw ${JSON.stringify(folders())}`);
  ctx.folder = folder;
  const steps = await readSteps(folder);
  if (steps.length !== 2) throw new Error(`expected 2 recorded steps, found ${steps.length}`);
  ctx.lastKeptId = steps[1].id;
  return `${folder}: two steps recorded (filter.apply, style.set), the process tree killed`;
}

/** The offer an earlier run's record produces: one entry, naming the file and carrying a time. */
async function readOffer(page) {
  const shown = await waitForCondition(
    () => page.evaluate(() => Array.from(document.querySelectorAll(".recovery-offer .recovery-entry-text")).map((el) => el.textContent ?? "")),
    (texts) => texts.length >= 1,
    30_000
  );
  if (!shown.ok) throw new Error("no .recovery-entry-text appeared at start");
  if (shown.last.length !== 1) throw new Error(`expected one offered entry, saw ${JSON.stringify(shown.last)}`);
  const [text] = shown.last;
  if (!text.includes(FIXTURE_NAME)) throw new Error(`the offer's entry does not name ${FIXTURE_NAME}: ${JSON.stringify(text)}`);
  if (!/\d/.test(text.slice(text.indexOf(FIXTURE_NAME) + FIXTURE_NAME.length))) throw new Error(`the offer's entry carries no time after the file name: ${JSON.stringify(text)}`);
  return text;
}

/** RUN-2: the offer, Recover, the workspace read back, and one more style step continuing the record. */
async function stepRecover(ctx) {
  const session = await launch("RUN-2");
  ctx.sessions.push(session);
  const { page } = session;
  const offered = await readOffer(page);
  await page.click(".recovery-offer .recovery-recover");
  const applied = await waitForCondition(
    () => readWorkspace(page),
    (w) => w.filter === PREDICATE && w.style?.fillColor === SET_COLOUR,
    60_000
  );
  if (!applied.ok) throw new Error(`the recovered workspace is not the filter and fill colour of the killed run: ${JSON.stringify(applied.last)}`);
  const gone = await waitForCondition(() => page.evaluate(() => document.querySelectorAll(".recovery-entry").length), (n) => n === 0, 10_000);
  if (!gone.ok) throw new Error("the entry stayed in the offer after Recover succeeded");
  if (await page.evaluate(() => document.querySelector(".reopen-notice") !== null)) throw new Error("a reopen notice appeared for unchanged data");

  await openStyleControls(page);
  await page.fill("input.style-fill-opacity", NEXT_OPACITY);
  await waitForRows(page, 1);
  await session.stop();

  const steps = await readSteps(ctx.folder);
  if (steps.length !== 3) throw new Error(`expected 3 steps in ${ctx.folder} after one more, found ${steps.length}`);
  if (steps[2].parent !== ctx.lastKeptId) throw new Error(`the new step's parent is ${JSON.stringify(steps[2].parent)}, not the last kept id ${ctx.lastKeptId}`);
  if (steps[2].intent.action !== "style.set" || steps[2].intent.params.property !== "fillOpacity") throw new Error(`step 3 is not style.set fillOpacity: ${JSON.stringify(steps[2].intent)}`);
  return `offered ${JSON.stringify(offered)}; the filter and fill colour came back; the next step's parent is the last kept id`;
}

/** RUN-3: Discard removes the record's folder. */
async function stepDiscard(ctx) {
  const session = await launch("RUN-3");
  ctx.sessions.push(session);
  const { page } = session;
  await readOffer(page);
  await page.click(".recovery-offer .recovery-discard");
  const gone = await waitForCondition(() => page.evaluate(() => document.querySelectorAll(".recovery-entry").length), (n) => n === 0, 10_000);
  if (!gone.ok) throw new Error("the entry stayed in the offer after Discard");
  const removed = await waitForCondition(() => existsSync(join(STORE_ROOT, ctx.folder)), (exists) => exists === false, 10_000);
  if (!removed.ok) throw new Error(`${ctx.folder} is still on disk after Discard`);
  await session.stop();
  return `${ctx.folder} is removed from the store`;
}

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 1_200_000);
  const watchdog = setTimeout(() => {
    console.error(`recover: SPATIAL_E2E_DEADLINE_MS (default 1200000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE)) {
    console.error(`recover: fixture not found: ${FIXTURE}`);
    console.error(`Regenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    dropScratch();
    return;
  }

  console.log(`recover: the store for this run is ${STORE_ROOT} (LOCALAPPDATA=${SCRATCH})`);
  /** @type {Array<{id: string, status: "PASS"|"FAIL", note: string}>} */
  const results = [];
  const ctx = { sessions: [] };

  async function runStep(id, timeoutMs, fn) {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(fn(), timeoutMs, id);
      results.push({ id, status: "PASS", note });
      console.log(`[${id}] PASS (${Date.now() - startedAt}ms): ${note}`);
      return true;
    } catch (e) {
      const note = e?.message ?? String(e);
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
      return false;
    }
  }

  try {
    // Each run needs the record the one before it left, so the first failure ends the suite (the kill still happens, in `finally`).
    const ok =
      (await runStep("RUN-1", 400_000, () => stepFirstRun(ctx))) &&
      (await runStep("RECOVER", 400_000, () => stepRecover(ctx))) &&
      (await runStep("DISCARD", 400_000, () => stepDiscard(ctx)));

    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    console.log(`${"Step".padEnd(idWidth)}  Status  Note`);
    for (const r of results) console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(6)}  ${r.note}`);
    process.exitCode = ok ? 0 : 1;
  } catch (e) {
    console.error(`recover: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    for (const session of ctx.sessions) await session.stop().catch(() => {});
    mkdirSync(OUT_DIR, { recursive: true });
    writeFileSync(join(OUT_DIR, `recover-results-${Date.now()}.json`), JSON.stringify({ results }, null, 2));
    if (process.exitCode === 0) dropScratch();
    else console.log(`recover: the scratch store is kept for inspection at ${SCRATCH}`);
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
