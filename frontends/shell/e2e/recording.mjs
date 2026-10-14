#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- the RECORD step (B2-1B-RECORDING-PREREGISTRATION.md section 4, E1) of B2 piece 1b:
// a filter and two style edits committed in the real app reach the kernel's session history on disk, and survive the
// app being killed. Sibling to `style.mjs`/`filter-panel.mjs`; the real `.filter-panel` and `.style-panel` DOM, the
// real `record_step` command, the real file.
//
// **The store is a scratch folder.** The app resolves its store root from `LOCALAPPDATA` (`kernel/src/permission/
// audit/log.rs::data_dir`, then `spatial-ide/sessions`). This suite sets `LOCALAPPDATA` to a fresh folder in its own
// environment BEFORE it launches the app, so the app (spawned with `env: process.env` by `lib.mjs::attachOrLaunch`)
// writes there and nowhere else, and no switch was added to the product for it. It therefore needs to launch its own
// app: an app already listening on the CDP port was started with another `LOCALAPPDATA`, and this suite refuses it.
//
// **Why the suite waits on the console, not on the file.** A live history is locked by the kernel (an exclusive
// `try_lock` held for the session), and on Windows that lock also blocks a read by another process. So nothing reads the
// file while the app lives. A `record_step` row reaches `ok` in the console only after the kernel replied, and the kernel
// replies after `write_all` and `sync_all`; the suite waits for the rows, kills the process tree, and reads the file once
// the operating system has freed the lock. The kill is the crash the history exists to survive.
//
// **H5 (the form, section 0.6): this harness cannot close the app normally.** `lib.mjs` stops an app it launched with
// `taskkill /T /F`, and no suite closes a window; the app has no capability that lets the page close itself. So E2 (a
// normal close removes that run's record) is not a step here: it is carried by row AA4 of the walkthrough
// (`MANUAL-WALKTHROUGH.md`, Part AA), as the form's section 4 provides.
//
// **H6 (the form, section 0.6), how this suite reads it.** A style number crosses the webview boundary as JSON. The
// opacity the operator sets (`0.37`) is a two-decimal value, the only kind the control's `step` lets a drag produce; Reset
// sends the default, `180 / 255`, a 16-digit double, which is the one value the product sends that serde_json's default
// float parse (no `float_roundtrip`) could return one unit in the last place away. The suite compares each recorded
// opacity with the value the shell applied BIT FOR BIT, and a difference fails the step with both bit patterns and the
// distance in units in the last place, so a drift is a finding with its size, never a rounding the suite forgives.

import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const SCRATCH = mkdtempSync(join(tmpdir(), "spatial-recording-"));
process.env.LOCALAPPDATA = SCRATCH;

const { attachOrLaunch, attachConsole, CDP_PORT } = await import("./lib.mjs");

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");
const STORE_ROOT = join(SCRATCH, "spatial-ide", "sessions");

const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

const PREDICATE = "zone = 'residential'";
const SET_OPACITY = "0.37";
const SET_COLOUR = "#112233";
// `document.ts`'s DEFAULT_STYLE_STATE, as literals (this script cannot import a TS module): Reset sets these.
const DEFAULT_FILL_COLOUR = "#4285f4";
const DEFAULT_FILL_OPACITY = 180 / 255;

const MOUNT_READY_TIMEOUT_MS = 90_000;

/** The scratch store goes only when nothing in it is wanted: after a passing run, or when nothing was launched. */
function dropScratch() {
  try {
    rmSync(SCRATCH, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
  } catch (e) {
    console.error(`recording: could not remove the scratch store ${SCRATCH}: ${e.message}`);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, ms, stepId) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${stepId}: timed out after ${ms}ms`)), ms);
    Promise.resolve(promise).then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

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
  const gate = await waitForCondition(
    () =>
      page
        .evaluate(() => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function")
        .catch(() => false),
    (ready) => ready === true,
    MOUNT_READY_TIMEOUT_MS,
    300
  );
  if (!gate.ok) throw new Error(`mount-readiness gate: .app-header and the openPath hook did not appear within ${MOUNT_READY_TIMEOUT_MS}ms`);
}

/** The bit pattern of a double, as a 16-digit hex string, and its distance from another in units in the last place. */
function bitsOf(x) {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, x);
  return view.getBigUint64(0);
}
function ulpDistance(a, b) {
  const d = bitsOf(a) - bitsOf(b);
  return d < 0n ? -d : d;
}
function describeBits(x) {
  return `${x} (0x${bitsOf(x).toString(16).padStart(16, "0")})`;
}

/** Every rendered class-A `record_step` row, oldest first, with every group expanded: its request text and its outcome. */
async function readRecordStepRows(page) {
  await page.evaluate(() => {
    const panel = document.querySelector(".console-disclosure");
    if (panel && panel.getAttribute("aria-expanded") !== "true") panel.click();
  });
  await page.evaluate(() => {
    document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click());
  });
  return page.evaluate(() =>
    Array.from(document.querySelectorAll(".console-entry-class-a"))
      .filter((el) => el.querySelector(".console-entry-header")?.textContent === "record_step")
      .map((el) => ({
        request: el.querySelector(".console-request-text")?.textContent ?? null,
        outcome: el.querySelector(".console-outcome")?.textContent ?? null,
      }))
  );
}

/** Waits until `count` `record_step` rows exist and every one of them has reached `ok` (the kernel replied, after its flush). */
async function waitForRecordedRows(page, count) {
  const polled = await waitForCondition(
    () => readRecordStepRows(page),
    (rows) => rows.length >= count && rows.every((row) => row.outcome === "ok"),
    30_000
  );
  if (!polled.ok) {
    throw new Error(`expected ${count} record_step rows, all ok; saw ${JSON.stringify(polled.last?.map((row) => row.outcome))}`);
  }
  if (polled.last.length !== count) {
    throw new Error(`expected exactly ${count} record_step rows; saw ${polled.last.length}: ${JSON.stringify(polled.last)}`);
  }
}

async function stepOpen(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  if (outcome.kind !== "admitted") throw new Error(`openPath(fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  return "admitted";
}

async function stepApply(page) {
  await page.fill("input.filter-predicate", PREDICATE);
  await page.click("button.filter-apply");
  const applied = await waitForCondition(
    () => page.evaluate(() => document.querySelector(".filter-active")?.textContent ?? null),
    (text) => text === `Applied: ${PREDICATE}`,
    30_000
  );
  if (!applied.ok) throw new Error(`.filter-active never read "Applied: ${PREDICATE}"; last ${JSON.stringify(applied.last)}`);
  await waitForRecordedRows(page, 1);
  return "applied, and one record_step row reached ok";
}

/** Opens the Inspector's Style tab and the panel's disclosure, once. */
async function expandStylePanel(page) {
  await page.click("#inspector-tab-style");
  const expanded = await page.evaluate(() => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded") === "true");
  if (!expanded) await page.click(".style-disclosure");
  const ready = await waitForCondition(
    () => page.evaluate(() => document.querySelector(".style-fill-opacity") !== null),
    (present) => present === true,
    5_000
  );
  if (!ready.ok) throw new Error("the style controls did not appear after the disclosure was clicked");
}

async function stepStyle(page, ctx) {
  await expandStylePanel(page);
  // Playwright's `fill` on a range and on a colour input sets the value, then dispatches `input` and `change` (see
  // `style.mjs`'s header): one commit each, which is what the panel's native `change` listeners record.
  await page.fill("input.style-fill-opacity", SET_OPACITY);
  ctx.appliedOpacity = await page.$eval("input.style-fill-opacity", (el) => Number(el.value));
  await waitForRecordedRows(page, 2);
  await page.fill("input.style-fill-color", SET_COLOUR);
  await waitForRecordedRows(page, 3);
  return `opacity ${SET_OPACITY} and colour ${SET_COLOUR} committed; three record_step rows reached ok`;
}

/** Reset sends the default style: the colour, and the one 16-digit opacity the product sends (H6's probe). */
async function stepReset(page) {
  await page.click("button.style-reset");
  await waitForRecordedRows(page, 5);
  return "Reset committed; five record_step rows reached ok";
}

/** E1 RECORD: kill the process tree, then read the store. */
async function stepRecord(session, ctx) {
  await session.stop();
  // The operating system frees the kernel's lock when its holder ends; poll until the file reads.
  const dirs = () => (existsSync(STORE_ROOT) ? readdirSync(STORE_ROOT) : []);
  const found = await waitForCondition(
    () => {
      try {
        const [only] = dirs();
        return dirs().length === 1 ? readFileSync(join(STORE_ROOT, only, "history.jsonl"), "utf8") : null;
      } catch {
        return null;
      }
    },
    (text) => text !== null,
    30_000,
    500
  );
  if (!found.ok) {
    throw new Error(`no readable history.jsonl under ${STORE_ROOT} (folders: ${JSON.stringify(dirs())}); a live lock would read as this`);
  }
  const [folder] = dirs();
  if (!/^unsaved-[0-9a-f]{32}$/.test(folder)) throw new Error(`the record folder is named ${JSON.stringify(folder)}, expected unsaved-<32 hex>`);
  ctx.text = found.last;
  ctx.folder = folder;

  if (!ctx.text.endsWith("\n")) throw new Error("the history does not end in a line feed");
  const lines = ctx.text.slice(0, -1).split("\n");
  if (lines.length !== 6) throw new Error(`expected a header and five steps (6 lines), found ${lines.length}`);
  const header = JSON.parse(lines[0]);
  if (header.format !== "spatial-steps" || header.purpose !== "session-history" || header.actions !== 2) {
    throw new Error(`the header is not a session history at actions 2: ${lines[0].slice(0, 300)}`);
  }
  const uri = header.datasets?.[0]?.resource?.logical_uri;
  if (header.datasets?.length !== 1 || typeof uri !== "string") throw new Error("the header does not carry one dataset entry with a logical_uri");

  const steps = lines.slice(1).map((line) => JSON.parse(line).step);
  steps.forEach((step, i) => {
    if (step === undefined) throw new Error(`line ${i + 2} is not a {"step": ...} object`);
    if (step.parent !== (i === 0 ? null : steps[i - 1].id)) throw new Error(`step ${i + 1} does not chain: parent ${JSON.stringify(step.parent)}`);
    if (step.data?.dataset !== uri) throw new Error(`step ${i + 1} names ${JSON.stringify(step.data?.dataset)}, not the header's ${uri}`);
  });

  const [filter, opacity, colour, resetColour, resetOpacity] = steps;
  if (filter.intent.action !== "filter.apply" || filter.intent.params.filter?.predicate !== PREDICATE) {
    throw new Error(`step 1 is not filter.apply ${PREDICATE}: ${JSON.stringify(filter.intent)}`);
  }
  if (!filter.dependencies.fields.some((f) => f.name === "zone")) {
    throw new Error(`step 1's dependencies do not name the field zone: ${JSON.stringify(filter.dependencies.fields)}`);
  }
  const styleOf = (step) => (step.intent.action === "style.set" ? step.intent.params : null);
  if (styleOf(opacity)?.property !== "fillOpacity") throw new Error(`step 2 is not style.set fillOpacity: ${JSON.stringify(opacity.intent)}`);
  if (styleOf(colour)?.property !== "fillColor" || styleOf(colour).value !== SET_COLOUR) {
    throw new Error(`step 3 is not style.set fillColor ${SET_COLOUR}: ${JSON.stringify(colour.intent)}`);
  }

  // H6, bit for bit: the opacity the shell applied against the opacity the kernel wrote.
  const compare = (label, recorded, applied) => {
    if (recorded !== applied) {
      throw new Error(
        `H6 FAILS at ${label}: applied ${describeBits(applied)}, recorded ${describeBits(recorded)}, ${ulpDistance(recorded, applied)} ulp apart`
      );
    }
  };
  compare("the committed opacity", styleOf(opacity).value, ctx.appliedOpacity);

  // Reset: the two properties that differ from the last committed style, in styleTransitions' order.
  if (styleOf(resetColour)?.property !== "fillColor" || styleOf(resetColour).value !== DEFAULT_FILL_COLOUR) {
    throw new Error(`step 4 is not style.set fillColor ${DEFAULT_FILL_COLOUR}: ${JSON.stringify(resetColour.intent)}`);
  }
  if (styleOf(resetOpacity)?.property !== "fillOpacity") throw new Error(`step 5 is not style.set fillOpacity: ${JSON.stringify(resetOpacity.intent)}`);
  compare("the default opacity sent by Reset", styleOf(resetOpacity).value, DEFAULT_FILL_OPACITY);

  const locations = JSON.parse(readFileSync(join(STORE_ROOT, folder, "locations.json"), "utf8"));
  if (locations.entries?.length !== 1 || locations.entries[0].dataset !== uri) {
    throw new Error(`locations.json does not name the header's dataset: ${JSON.stringify(locations)}`);
  }
  return (
    `${folder}: a header and five steps, in order and chained; the filter names the field zone; the recorded opacities ` +
    `${styleOf(opacity).value} and ${styleOf(resetOpacity).value} equal the applied values bit for bit (H6)`
  );
}

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 900_000);
  const watchdog = setTimeout(() => {
    console.error(`recording: SPATIAL_E2E_DEADLINE_MS (default 900000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE)) {
    console.error(`recording: fixture not found: ${FIXTURE}`);
    console.error(`Regenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    dropScratch();
    return;
  }

  console.log(`recording: the store for this run is ${STORE_ROOT} (LOCALAPPDATA=${SCRATCH})`);
  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`recording: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    dropScratch();
    return;
  }
  const { page, launched } = session;
  if (!launched) {
    console.error(
      `recording: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA. This suite writes its ` +
        `history to a scratch folder it sets for the app it launches, so stop that app (and its process tree) and run again.`
    );
    await session.browser.close().catch(() => {});
    process.exitCode = 1;
    dropScratch();
    return;
  }
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
      return true;
    } catch (e) {
      const note = e?.message ?? String(e);
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
      return false;
    }
  }

  try {
    console.log(`recording: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    await waitForMountReady(page);

    // Each step needs the one before it, so the first failure ends the run (the kill still happens, in `finally`).
    const ok =
      (await runStep("OPEN", 60_000, () => stepOpen(page))) &&
      (await runStep("APPLY", 60_000, () => stepApply(page))) &&
      (await runStep("STYLE", 60_000, () => stepStyle(page, ctx))) &&
      (await runStep("RESET", 60_000, () => stepReset(page)));
    if (ok) await runStep("RECORD", 120_000, () => stepRecord(session, ctx));

    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    console.log(`${"Step".padEnd(idWidth)}  Status  Note`);
    for (const r of results) console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(6)}  ${r.note}`);
    process.exitCode = results.some((r) => r.status === "FAIL") || !ok ? 1 : 0;
  } catch (e) {
    console.error(`recording: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `recording-console-ledger-${Date.now()}.json`);
      writeFileSync(ledgerPath, JSON.stringify({ allConsoleEntries: consoleHandle.entries }, null, 2));
      console.log(`Full console ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`recording: failed to write the ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    // The app this run launched ends with the run: the RECORD step killed it, and this is the same stop for any other exit.
    await session.stop().catch(() => {});
    if (process.exitCode === 0) {
      dropScratch();
    } else {
      console.log(`recording: the scratch store is kept for inspection at ${SCRATCH}`);
    }
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
