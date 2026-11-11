#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- E-SAVE (B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md section 4, step 1, with Amendment 1 item 5, Amendment 12 item 2 and
// Amendment 14 item 5) of B2 piece 1c: a filter made of three clauses (two on, one off), a style edit and a camera pose are saved from the real app, and the
// project file the kernel wrote reads back as the shell held them. The real `.filter-panel`, `.command-input`, `.style-panel` DOM, the real `save_project`
// command, the real file. Sibling to `recording.mjs`.
//
// **The folder comes through the DEV-only hook.** The first save opens the native folder picker, which no CDP driver reaches. Every save here goes through
// `window.__SPATIAL_E2E__.e2eSaveProjectToFolder(folder)` (`e2e-test-surface.ts`), which hands the folder to the saver that `handleSaveProject` runs, the save the
// control and the bar call. So this suite does NOT exercise the native folder picker: that is the operator's Part (the form's section 9, OP1). The driver reads
// `project.spatial` from disk and lists the folder; nothing but the hook's two-word answer crosses CDP.
//
// **The store is a scratch folder.** As `recording.mjs` does, the suite sets `LOCALAPPDATA` to a fresh folder before it launches the app, so the machine store
// (the session record, the project's folder under `projects/`) lands there. It launches its own app and refuses one already listening. The two project folders
// are made with `mkdtempSync` under the OS temp folder. All three are removed at the end, a failing run included; a folder the operating system will not free
// while the app still runs is named in the output.
//
// **The pose.** Before the save, `e2eSetViewState` puts the camera at three numbers with no short decimal spelling. The file's `view` must hold their HexF64
// patterns (ADR-036 Amendment 1 item 1): the seam's end-to-end proof from the real shape, canvas -> App -> `save_project` -> the file.
//
// **Not proved here:** the native folder picker (OP1); reopen; that the machine store holds what the form says (the kernel's tests do); and any timing. Every
// bound below is a harness bound, never a claim about how long anything takes (ADR-018).
//
// RECORDED MUTATIONS, each applied alone and reverted, each failing at the step it names. Entries are added by the commit that observes them.
//
// m-filter: the save made before the filter. In `main`, the SAVE step moved to run between OPEN and CLAUSES (two lines of this file).
//   Expected: a non-zero exit, failing at READBACK-FILTER, the file's clauses empty.
//   Observed (run m-filter at 1c807fc6e8e931dfa4d8a356bb4914b4d9fa29f4, exit 1):
//   [READBACK-FILTER] FAIL (0ms): READBACK-FILTER: the file's clauses read [], expected [{"text":"\"zone\" = 'residential'","enabled":true},{"text":"\"zone\" <> 'residential'","enabled":false},{"text":"\"zone\" IS NOT NULL","enabled":true}]
//
// m-view: the view's centre without the origin. In `canvas/WorkingCanvas.tsx`'s `currentView`, `centre` returned as `[camera.targetX, camera.targetY]`.
//   Expected: a non-zero exit, failing at READBACK-VIEW, the file's centre not the pose's patterns.
//   Observed (run m-view at 1c807fc6e8e931dfa4d8a356bb4914b4d9fa29f4, exit 1):
//   [READBACK-VIEW] FAIL (1ms): READBACK-VIEW: the file's view reads {"centre":["0000000000000000","0000000000000000"],"zoom":"bfeb6db6db6db6dc"}, expected the pose's HexF64 patterns {"centre":["4143d7e22aaaaaab","4132530449249249"],"zoom":"bfeb6db6db6db6dc"}
//
// m-hook: the hook's save made through a saver of its own. In `App.tsx`, the hook body builds a `createProjectSaver` whose `pickFolder` answers the supplied folder and saves
//   through it, in place of `await handleSaveProject()`.
//   Expected: a non-zero exit, failing at SAVE, the answer not "asked".
//   Observed (run m-hook at 1c807fc6e8e931dfa4d8a356bb4914b4d9fa29f4, exit 1):
//   [SAVE] FAIL (29ms): SAVE: the first e2eSaveProjectToFolder answered "not-asked", expected "asked"

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const TEMP_BASE = realpathSync.native(tmpdir());
const SCRATCH = mkdtempSync(join(TEMP_BASE, "spatial-project-"));
const FOLDER_ONE = mkdtempSync(join(TEMP_BASE, "spatial-project-first-"));
const FOLDER_TWO = mkdtempSync(join(TEMP_BASE, "spatial-project-second-"));
process.env.LOCALAPPDATA = SCRATCH;

const { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } = await import("./lib.mjs");

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");
const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

const BAR = ".command-input";
const MOUNT_READY_TIMEOUT_MS = 90_000;
// Clause A is applied through the Filter section; C and B through the bar. C is switched off before B is added, so the file's order is A, C, B.
const CLAUSE_A = `"zone" = 'residential'`;
const CLAUSE_C = `"zone" <> 'residential'`;
const CLAUSE_B = `"zone" IS NOT NULL`;
const FILTER_AB = `(${CLAUSE_A}) AND (${CLAUSE_B})`;
const SET_OPACITY = "0.37";
const SET_COLOUR = "#112233";
// Inside the fixture's LV95 grid (2,600,000 / 1,200,000, 40 m cells); each number has no spelling of 15 significant digits or fewer.
const POSE = { x: 2_600_900 + 1 / 3, y: 1_200_900 + 2 / 7, zoom: -1 + 1 / 7 };

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

/** The folders and the scratch store go at the end of every run; a folder the app still holds open is named, not hidden. */
function dropFolders() {
  for (const path of [FOLDER_ONE, FOLDER_TWO, SCRATCH]) {
    try {
      rmSync(path, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
    } catch (e) {
      console.error(`project: could not remove ${path}: ${e.message}`);
    }
  }
}

function withTimeout(promise, ms, stepId) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${stepId}: timed out after ${ms}ms`)), ms);
    Promise.resolve(promise).then(
      (value) => (clearTimeout(timer), resolve(value)),
      (err) => (clearTimeout(timer), reject(err))
    );
  });
}

/** Polls `read` until `predicate` holds. The bound is a readiness gate; its failure names what was waited for and the last reading. */
async function waitFor(what, read, predicate, timeoutMs, pollMs = 200) {
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
  throw new Error(`waited ${timeoutMs}ms for ${what}; the last reading was ${JSON.stringify(last)}`);
}

async function settle(consoleHandle, what) {
  const outcome = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  if (!outcome.settled) throw new Error(`the render trace was not quiet for 3000ms within 45000ms (${what})`);
}

/** The bit pattern of a double as 16 lowercase hex digits, big-endian: ADR-036 Amendment 1 item 1's spelling of a view number. */
function hexF64(x) {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, x);
  return view.getBigUint64(0).toString(16).padStart(16, "0");
}

const readCards = (page) =>
  page.evaluate(() => ({
    texts: [...document.querySelectorAll(".clause-card .clause-text")].map((e) => e.textContent),
    on: [...document.querySelectorAll(".clause-switch")].map((b) => b.getAttribute("aria-checked")),
    pending: document.querySelector('.clause-card [aria-disabled="true"]') !== null,
    applied: document.querySelector(".filter-active")?.textContent ?? null,
  }));

/** Waits for the cards, their switches and the Filter section's Applied line to read as given, with no card change pending. */
async function expectCards(page, texts, on, applied) {
  await waitFor(
    `the cards ${JSON.stringify(texts)} with switches ${on.join()} and the line "Applied: ${applied}"`,
    () => readCards(page),
    (c) => JSON.stringify(c.texts) === JSON.stringify(texts) && c.on.join() === on.join() && c.applied === `Applied: ${applied}` && !c.pending,
    30_000
  );
}

/** `/filter <condition>` typed into the bar and sent with Enter. The bar is empty once the change was applied. */
async function sendCondition(page, condition) {
  await page.focus(BAR);
  await page.fill(BAR, `/filter ${condition}`);
  await sleep(250);
  await page.keyboard.press("Enter");
  await waitFor(
    `the bar to clear after /filter ${condition}`,
    () => page.evaluate((selector) => document.querySelector(selector).value, BAR),
    (value) => value === "",
    30_000
  );
}

/** Every rendered class-A `record_step` row, oldest first, every group expanded (`recording.mjs` reads them the same way). */
async function readRecordStepRows(page) {
  await page.evaluate(() => {
    const panel = document.querySelector(".console-disclosure");
    if (panel && panel.getAttribute("aria-expanded") !== "true") panel.click();
  });
  await page.evaluate(() => document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click()));
  return page.evaluate(() =>
    [...document.querySelectorAll(".console-entry-class-a")]
      .filter((el) => el.querySelector(".console-entry-header")?.textContent === "record_step")
      .map((el) => el.querySelector(".console-outcome")?.textContent ?? null)
  );
}

/** Waits until at least `atLeast` rows exist and every one has reached `ok` (the kernel replied, after its flush). */
async function waitRecorded(page, atLeast, what) {
  const outcomes = await waitFor(
    `at least ${atLeast} record_step rows, all ok (${what})`,
    () => readRecordStepRows(page),
    (rows) => rows.length >= atLeast && rows.every((outcome) => outcome === "ok"),
    30_000
  );
  return outcomes.length;
}

async function stepOpen(page, consoleHandle) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  if (outcome.kind !== "admitted") throw new Error(`openPath(fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  await waitFor(
    "the Save control, and the e2eSetViewState hook",
    () => page.evaluate(() => ({ control: document.querySelector("button.save-project") !== null, pose: typeof window.__SPATIAL_E2E__?.e2eSetViewState })),
    (r) => r.control && r.pose === "function",
    60_000
  );
  await waitFor(
    "the first pixels (capturePixels reporting a non-background pixel)",
    () => page.evaluate(async () => (await window.__SPATIAL_E2E__.capturePixels([])).nonBackgroundCount),
    (n) => n > 0,
    60_000,
    500
  );
  await settle(consoleHandle, "after the first look");
  return "admitted; the Save control and the first pixels are there";
}

async function stepClauses(page, consoleHandle, ctx) {
  await page.fill("input.filter-predicate", CLAUSE_A);
  await page.click("button.filter-apply");
  await expectCards(page, [CLAUSE_A], ["true"], CLAUSE_A);
  let rows = await waitRecorded(page, 1, "after clause A");
  await sendCondition(page, CLAUSE_C);
  await expectCards(page, [CLAUSE_A, CLAUSE_C], ["true", "true"], `(${CLAUSE_A}) AND (${CLAUSE_C})`);
  rows = await waitRecorded(page, rows + 1, "after clause C");
  await page.click(".clause-card:nth-child(2) .clause-switch");
  await expectCards(page, [CLAUSE_A, CLAUSE_C], ["true", "false"], CLAUSE_A);
  rows = await waitRecorded(page, rows, "after clause C was switched off");
  await sendCondition(page, CLAUSE_B);
  await expectCards(page, [CLAUSE_A, CLAUSE_C, CLAUSE_B], ["true", "false", "true"], FILTER_AB);
  ctx.rows = await waitRecorded(page, rows + 1, "after clause B");
  await settle(consoleHandle, "after the clauses");
  return `three clauses, the second off; the Filter section reads Applied: ${FILTER_AB}; ${ctx.rows} record_step rows reached ok`;
}

async function stepStyle(page, consoleHandle, ctx) {
  await page.click("#inspector-tab-style");
  const expanded = await page.evaluate(() => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded") === "true");
  if (!expanded) await page.click(".style-disclosure");
  await waitFor("the style controls (.style-fill-opacity)", () => page.evaluate(() => document.querySelector(".style-fill-opacity") !== null), (present) => present, 5_000);
  await page.fill("input.style-fill-opacity", SET_OPACITY);
  ctx.appliedOpacity = await page.$eval("input.style-fill-opacity", (el) => Number(el.value));
  await waitRecorded(page, ctx.rows + 1, "after the opacity");
  await page.fill("input.style-fill-color", SET_COLOUR);
  await waitRecorded(page, ctx.rows + 2, "after the colour");
  await settle(consoleHandle, "after the style");
  return `opacity ${SET_OPACITY} and colour ${SET_COLOUR} committed; their record_step rows reached ok`;
}

async function stepPose(page, consoleHandle) {
  for (const [name, value] of Object.entries(POSE)) {
    if (Number(value.toPrecision(15)) === value) throw new Error(`the pose's ${name} (${value}) has a spelling of 15 digits or fewer, so it cannot show a lost digit`);
  }
  const moved = await page.evaluate(([x, y, z]) => window.__SPATIAL_E2E__.e2eSetViewState(x, y, z), [POSE.x, POSE.y, POSE.zoom]);
  if (moved !== true) throw new Error(`e2eSetViewState answered ${JSON.stringify(moved)}, expected true (no canvas to move)`);
  await settle(consoleHandle, "after the pose");
  return `camera set to centre (${POSE.x}, ${POSE.y}), zoom ${POSE.zoom}`;
}

/** Lists a project folder and reads its `project.spatial`. The save notices on the page are named when the file is absent. */
async function readFolder(page, folder) {
  const names = readdirSync(folder);
  if (!names.includes("project.spatial")) {
    const notices = await page.evaluate(() => [...document.querySelectorAll(".save-notice")].map((e) => e.textContent)).catch(() => null);
    throw new Error(`the folder lists ${JSON.stringify(names)}, with no project.spatial; the page shows the save notices ${JSON.stringify(notices)}`);
  }
  const text = readFileSync(join(folder, "project.spatial"), "utf8");
  return { names, text, json: JSON.parse(text) };
}

async function hookSave(page, folder) {
  return withTimeout(page.evaluate((f) => window.__SPATIAL_E2E__.e2eSaveProjectToFolder(f), folder), 60_000, "e2eSaveProjectToFolder");
}

async function stepSave(page, ctx) {
  const answer = await hookSave(page, FOLDER_ONE);
  if (answer !== "asked") throw new Error(`the first e2eSaveProjectToFolder answered ${JSON.stringify(answer)}, expected "asked"`);
  ctx.first = await readFolder(page, FOLDER_ONE);
  const { names, text, json } = ctx.first;
  if (JSON.stringify(names) !== JSON.stringify(["project.spatial"])) throw new Error(`the folder lists ${JSON.stringify(names)}, expected only project.spatial`);
  if (!text.startsWith('{\n  "format": "spatial-project",\n') || !text.endsWith("}\n")) throw new Error(`project.spatial is not the line-oriented layout: ${JSON.stringify(text.slice(0, 80))}`);
  const members = Object.keys(json).join();
  if (members !== "format,version,project,datasets,lineage,workspace" || json.version !== 1) throw new Error(`project.spatial's members read ${members}, version ${json.version}`);
  if (!/^spatial:\/\/project\/[0-9a-f]{32}$/.test(json.project)) throw new Error(`the project identity reads ${JSON.stringify(json.project)}`);
  return `answered "asked"; the folder holds project.spatial alone (${text.length} characters); ${json.project}`;
}

function workspaceOf(ctx) {
  const workspace = ctx.first.json.workspace;
  if (Object.keys(workspace ?? {}).join() !== "filter,clauses,style,view") throw new Error(`the workspace's members read ${Object.keys(workspace ?? {}).join()}`);
  return workspace;
}

function stepReadbackFilter(ctx) {
  const { clauses, filter } = workspaceOf(ctx);
  const expected = [{ text: CLAUSE_A, enabled: true }, { text: CLAUSE_C, enabled: false }, { text: CLAUSE_B, enabled: true }];
  if (JSON.stringify(clauses) !== JSON.stringify(expected)) throw new Error(`the file's clauses read ${JSON.stringify(clauses)}, expected ${JSON.stringify(expected)}`);
  if (JSON.stringify(filter) !== JSON.stringify({ predicate: FILTER_AB, dialect: "duckdb-expr/0" })) {
    throw new Error(`the file's filter reads ${JSON.stringify(filter)}, expected the shell's join ${JSON.stringify(FILTER_AB)}`);
  }
  return `the file holds the three clauses in order, the second off, and the filter ${FILTER_AB}`;
}

function stepReadbackStyle(ctx) {
  const layer = workspaceOf(ctx).style?.layer;
  if (layer?.fill_color?.literal !== SET_COLOUR) throw new Error(`the file's fill colour reads ${JSON.stringify(layer?.fill_color)}, expected the literal ${SET_COLOUR}`);
  if (layer?.fill_opacity?.literal !== ctx.appliedOpacity) throw new Error(`the file's fill opacity reads ${JSON.stringify(layer?.fill_opacity)}, expected the applied ${ctx.appliedOpacity}`);
  return `the file's style holds the fill colour ${SET_COLOUR} and the applied opacity ${ctx.appliedOpacity}`;
}

function stepReadbackView(ctx) {
  const view = workspaceOf(ctx).view;
  const expected = { centre: [hexF64(POSE.x), hexF64(POSE.y)], zoom: hexF64(POSE.zoom) };
  const read = { centre: view?.centre, zoom: view?.zoom };
  if (JSON.stringify(read) !== JSON.stringify(expected)) throw new Error(`the file's view reads ${JSON.stringify(read)}, expected the pose's HexF64 patterns ${JSON.stringify(expected)}`);
  if (typeof view.crs !== "object" || view.crs === null) throw new Error(`the file's view carries no crs object: ${JSON.stringify(view.crs)}`);
  return `the file's view holds the pose's patterns: centre ${expected.centre.join(", ")}, zoom ${expected.zoom}`;
}

async function stepSecondSave(page, ctx) {
  const answer = await hookSave(page, FOLDER_TWO);
  if (answer !== "not-asked") throw new Error(`the second e2eSaveProjectToFolder answered ${JSON.stringify(answer)}, expected "not-asked"`);
  const second = readdirSync(FOLDER_TWO);
  if (second.length !== 0) throw new Error(`the second folder lists ${JSON.stringify(second)}, expected it empty`);
  const again = await readFolder(page, FOLDER_ONE);
  if (JSON.stringify(again.names) !== JSON.stringify(["project.spatial"])) throw new Error(`the first folder lists ${JSON.stringify(again.names)}, expected only project.spatial`);
  if (again.json.project !== ctx.first.json.project || JSON.stringify(again.json.workspace) !== JSON.stringify(ctx.first.json.workspace)) {
    throw new Error("the first folder's project.spatial no longer reads as the first save did (the identity or the workspace differs)");
  }
  return 'answered "not-asked"; the second folder stays empty; the first folder\'s project.spatial still reads back';
}

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 900_000);
  const watchdog = setTimeout(() => {
    console.error("project: SPATIAL_E2E_DEADLINE_MS (default 900000) exceeded -- presumed hung, failing loudly");
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE)) {
    console.error(`project: fixture not found: ${FIXTURE}\nRegenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    dropFolders();
    return;
  }
  const hashBefore = sha256(FIXTURE);
  console.log(`project: fixture sha256 ${hashBefore}; the store for this run is ${SCRATCH}; the folders are ${FOLDER_ONE} and ${FOLDER_TWO}`);
  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`project: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    dropFolders();
    return;
  }
  const { page, launched } = session;
  if (!launched) {
    console.error(`project: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA; stop it (and its process tree) and run again.`);
    await session.browser.close().catch(() => {});
    process.exitCode = 1;
    dropFolders();
    return;
  }
  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL", note: string}>} */
  const results = [];
  const ctx = {};

  async function runStep(id, timeoutMs, fn) {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(Promise.resolve().then(fn), timeoutMs, id);
      results.push({ id, status: "PASS", note });
      console.log(`[${id}] PASS (${Date.now() - startedAt}ms): ${note}`);
      return true;
    } catch (e) {
      const note = `${id}: ${e?.message ?? String(e)}`;
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
      return false;
    }
  }

  try {
    console.log(`project: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    await waitFor(
      "the app header, the openPath hook and the e2eSaveProjectToFolder hook",
      () => page.evaluate(() => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function" && typeof window.__SPATIAL_E2E__?.e2eSaveProjectToFolder === "function"),
      (ready) => ready === true,
      MOUNT_READY_TIMEOUT_MS,
      300
    );

    // Each step needs the one before it, so the first failure ends the run (the cleanup still happens, in `finally`).
    const ok =
      (await runStep("OPEN", 180_000, () => stepOpen(page, consoleHandle))) &&
      (await runStep("CLAUSES", 240_000, () => stepClauses(page, consoleHandle, ctx))) &&
      (await runStep("STYLE", 120_000, () => stepStyle(page, consoleHandle, ctx))) &&
      (await runStep("POSE", 120_000, () => stepPose(page, consoleHandle))) &&
      (await runStep("SAVE", 120_000, () => stepSave(page, ctx))) &&
      (await runStep("READBACK-FILTER", 20_000, () => stepReadbackFilter(ctx))) &&
      (await runStep("READBACK-STYLE", 20_000, () => stepReadbackStyle(ctx))) &&
      (await runStep("READBACK-VIEW", 20_000, () => stepReadbackView(ctx))) &&
      (await runStep("SECOND-SAVE", 120_000, () => stepSecondSave(page, ctx)));

    const hashAfter = sha256(FIXTURE);
    console.log(`project: fixture sha256 after ${hashAfter}${hashAfter === hashBefore ? " (unchanged)" : " (CHANGED)"}`);
    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    console.log(`${"Step".padEnd(idWidth)}  Status  Note`);
    for (const r of results) console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(6)}  ${r.note}`);
    process.exitCode = results.some((r) => r.status === "FAIL") || !ok || hashAfter !== hashBefore ? 1 : 0;
  } catch (e) {
    console.error(`project: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `project-console-ledger-${Date.now()}.json`);
      writeFileSync(ledgerPath, JSON.stringify({ allConsoleEntries: consoleHandle.entries }, null, 2));
      console.log(`Full console ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`project: failed to write the ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    await session.stop().catch(() => {});
    dropFolders();
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
