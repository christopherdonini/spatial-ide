#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- E-REOPEN (R1 to R9) and E-CHANGED of B2 piece 1c (B2-1C-SAVE-AND-REOPEN-PREREGISTRATION.md Amendment 54 item 9, with its
// item 7 (a)): a project saved from the real app is reopened in the same window, and what the kernel answers (opened, question, not_found, a refusal) and what the shell
// applies and shows are read from the real page. Sibling to `project.mjs`; one app process; the real `open_project` command, the real project file, the real machine store.
//
// **The folders and files come through three DEV-only hooks** (`e2e-test-surface.ts`): `e2eOpenProjectFolder` and `e2eRelinkFile` supply the picker's answer once to the
// click's own handler, and `e2eReadWorkspace` reads the applied workspace. The native folder and file pickers are not exercised: that is the operator's Part (the form's section 9).
//
// **The store is a scratch folder.** As `project.mjs` does, the suite sets `LOCALAPPDATA` to a fresh folder before it launches the app, launches its own app and refuses one
// already listening, and removes the store and every folder it made (under the OS temp folder) at the end, a failing run included.
//
// **The Console is read, not trusted.** R5, R8, R9 and E-CHANGED read `close_dataset` rows and R6 and R8 read `open_project` rows (class A) from the Console, which keeps 128 entries of each kind (ADV-2026-11-19-06, A4-1; ADV-2026-11-22-22 item 2).
// R6's read follows its call at once; each close row is read while the open after it runs, and R8's `same` row after the click, each polled to a harness bound. The suite prints the ring's label at each read, and the entries newer than the row at each close read and at R6.
// A row that is not there by its bound fails the step by name; the close reads and R6 name the form's stop 13. Every bound below is a harness bound, never a claim about how long anything takes (ADR-018).
//
// RECORDED MUTATIONS: entries are added by the commit that observes them.

import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, renameSync, rmSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const TEMP_BASE = realpathSync.native(tmpdir());
const SCRATCH = mkdtempSync(join(TEMP_BASE, "spatial-reopen-"));
const mk = (name) => mkdtempSync(join(TEMP_BASE, `spatial-reopen-${name}-`));
const FOLDER_P = mk("p");
const FOLDER_Q = mk("q");
const FOLDER_P2 = mk("p2");
const FOLDER_C = mk("changed");
const FOLDER_SPARE = mk("spare");
const DATA_DIR = mk("data");
process.env.LOCALAPPDATA = SCRATCH;

const { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } = await import("./lib.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "out");
const NOTICES_SOURCE = join(HERE, "..", "src", "project", "reopenNotices.ts");
// Read only: the main checkout's fixture, as `project.mjs` takes it; the suite copies it into its own folders and never writes it.
const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

const BAR = ".command-input";
const MOUNT_READY_TIMEOUT_MS = 90_000;
const CLAUSE_A = `"zone" = 'residential'`;
const CLAUSE_C = `"zone" <> 'residential'`;
const SET_COLOUR = "#112233";
const POSE = { x: 2_600_900 + 1 / 3, y: 1_200_900 + 2 / 7, zoom: -1 + 1 / 7 };
const HOOKS = ["openPath", "e2eSaveProjectToFolder", "e2eOpenProjectFolder", "e2eRelinkFile", "e2eReadWorkspace", "e2eSetViewState"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function dropFolders() {
  for (const path of [FOLDER_P, FOLDER_Q, FOLDER_P2, FOLDER_C, FOLDER_SPARE, DATA_DIR, SCRATCH]) {
    try {
      rmSync(path, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
    } catch (e) {
      console.error(`reopen: could not remove ${path}: ${e.message}`);
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

/** The bit pattern of a double as 16 lowercase hex digits (ADR-036 Amendment 1 item 1's spelling of a view number). */
function hexF64(x) {
  const view = new DataView(new ArrayBuffer(8));
  view.setFloat64(0, x);
  return view.getBigUint64(0).toString(16).padStart(16, "0");
}

/** An exported string constant of `reopenNotices.ts`, read from its source by its name. */
function noticeText(name) {
  const found = new RegExp(`export const ${name} =\\s*("(?:[^"\\\\]|\\\\.)*");`).exec(readFileSync(NOTICES_SOURCE, "utf8"));
  if (found === null) throw new Error(`${NOTICES_SOURCE} holds no exported ${name} constant`);
  return JSON.parse(found[1]);
}

const readCards = (page) =>
  page.evaluate(() => ({
    texts: [...document.querySelectorAll(".clause-card .clause-text")].map((e) => e.textContent),
    on: [...document.querySelectorAll(".clause-switch")].map((b) => b.getAttribute("aria-checked")),
    pending: document.querySelector('.clause-card [aria-disabled="true"]') !== null,
    applied: document.querySelector(".filter-active")?.textContent ?? null,
  }));

async function expectCards(page, texts, on, applied) {
  await waitFor(
    `the cards ${JSON.stringify(texts)} with switches ${on.join()} and the line "Applied: ${applied}"`,
    () => readCards(page),
    (c) => same(c.texts, texts) && c.on.join() === on.join() && c.applied === `Applied: ${applied}` && !c.pending,
    30_000
  );
}

async function sendCondition(page, condition) {
  await page.focus(BAR);
  await page.fill(BAR, `/filter ${condition}`);
  await sleep(250);
  await page.keyboard.press("Enter");
  await waitFor(`the bar to clear after /filter ${condition}`, () => page.evaluate((s) => document.querySelector(s).value, BAR), (v) => v === "", 30_000);
}

/** The Console as the page shows it, expanded with every group open: the label, and every row in order. Run right after the call it reads. */
async function readConsole(page) {
  await page.evaluate(() => {
    const panel = document.querySelector(".console-disclosure");
    if (panel && panel.getAttribute("aria-expanded") !== "true") panel.click();
  });
  await page.evaluate(() => document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click()));
  return page.evaluate(() => ({
    label: document.querySelector(".console-disclosure")?.textContent ?? null,
    rows: [...document.querySelectorAll(".console-entry")].map((el) => ({
      header: el.querySelector(".console-entry-header")?.textContent ?? el.querySelector(".console-entry-prose")?.textContent ?? null,
      request: el.querySelector(".console-request-text")?.textContent ?? null,
      outcome: el.querySelector(".console-outcome")?.textContent ?? null,
    })),
  }));
}

const rowsOf = (reading, header) => reading.rows.map((row, index) => ({ ...row, index })).filter((row) => row.header === header);
const requestOf = (row) => { try { return JSON.parse(row.request); } catch { return null; } };

/** Opens `path`; `afterOpen` runs right after the call returns, before the first look's tile requests fill the ring. */
async function openFile(page, consoleHandle, path, what, afterOpen = async () => {}) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), path);
  if (outcome.kind !== "admitted") throw new Error(`openPath(${what}) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  await afterOpen();
  await waitFor("the Save control", () => page.evaluate(() => document.querySelector("button.save-project") !== null), (v) => v, 60_000);
  await waitFor("the first pixels", () => page.evaluate(async () => (await window.__SPATIAL_E2E__.capturePixels([])).nonBackgroundCount), (n) => n > 0, 60_000, 500);
  await settle(consoleHandle, `after ${what}'s first look`);
}

/** The request texts of the close rows in a reading. Each close names its own handle, so the texts differ. */
const closedTexts = (reading) => rowsOf(reading, "close_dataset").map((row) => row.request);

/** Waits for a `close_dataset` row at `ok` whose request text is not among `known` (read before the open), so no older row's staying in the ring matters. Returns the reading with the new row as `fresh`. */
async function waitClosed(page, known, what) {
  const reading = await waitFor(
    `a new close_dataset row at ok, its request not among the ${known.length} read before (${what}); a row missing at its read is the form's stop 13`,
    async () => { const r = await readConsole(page); return { ...r, fresh: rowsOf(r, "close_dataset").find((row) => row.outcome === "ok" && !known.includes(row.request)) }; },
    (r) => r.fresh !== undefined,
    30_000
  );
  return reading;
}

async function hookSave(page, folder) {
  return withTimeout(page.evaluate((f) => window.__SPATIAL_E2E__.e2eSaveProjectToFolder(f), folder), 60_000, "e2eSaveProjectToFolder");
}
const hookOpen = (page, folder) => withTimeout(page.evaluate((f) => window.__SPATIAL_E2E__.e2eOpenProjectFolder(f), folder), 90_000, "e2eOpenProjectFolder");
const hookRelink = (page, file) => withTimeout(page.evaluate((f) => window.__SPATIAL_E2E__.e2eRelinkFile(f), file), 90_000, "e2eRelinkFile");
const readWorkspace = (page) => page.evaluate(() => window.__SPATIAL_E2E__.e2eReadWorkspace());
const readFile = (folder) => JSON.parse(readFileSync(join(folder, "project.spatial"), "utf8"));
const expectAnswer = (answer, expected, what) => {
  if (answer !== expected) throw new Error(`${what} answered ${JSON.stringify(answer)}, expected ${JSON.stringify(expected)}`);
};

/** Retries a file operation the operating system refuses while a handle may still be closing. */
async function retrying(what, fn) {
  let last;
  for (let i = 0; i < 40; i++) {
    try { return fn(); } catch (e) { last = e; await sleep(500); }
  }
  throw new Error(`${what} kept failing for 20s: ${last.message}`);
}

/** Copies the fixture into `folder` as `parcels.parquet`, opens the copy and saves into `folder`; the project file is returned. */
async function openAndSave(page, consoleHandle, folder, dataPath) {
  copyFileSync(FIXTURE, dataPath);
  await openFile(page, consoleHandle, dataPath, `the copy ${basename(dataPath)}`);
  expectAnswer(await hookSave(page, folder), "asked", "the first e2eSaveProjectToFolder");
  return readFile(folder);
}

async function stepR1(page, consoleHandle, ctx) {
  ctx.dataP = join(FOLDER_P, "parcels.parquet");
  copyFileSync(FIXTURE, ctx.dataP);
  await openFile(page, consoleHandle, ctx.dataP, "F1 in folder P");
  return "F1 (parcels.parquet in folder P) admitted; the Save control and the first pixels are there";
}

async function stepR2(page, consoleHandle) {
  await page.fill("input.filter-predicate", CLAUSE_A);
  await page.click("button.filter-apply");
  await expectCards(page, [CLAUSE_A], ["true"], CLAUSE_A);
  await sendCondition(page, CLAUSE_C);
  await expectCards(page, [CLAUSE_A, CLAUSE_C], ["true", "true"], `(${CLAUSE_A}) AND (${CLAUSE_C})`);
  await page.click(".clause-card:nth-child(2) .clause-switch");
  await expectCards(page, [CLAUSE_A, CLAUSE_C], ["true", "false"], CLAUSE_A);
  await page.click("#inspector-tab-style");
  if (!(await page.evaluate(() => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded") === "true"))) await page.click(".style-disclosure");
  await waitFor("the fill colour control", () => page.evaluate(() => document.querySelector("input.style-fill-color") !== null), (v) => v, 5_000);
  await page.fill("input.style-fill-color", SET_COLOUR);
  await settle(consoleHandle, "after the style");
  const moved = await page.evaluate(([x, y, z]) => window.__SPATIAL_E2E__.e2eSetViewState(x, y, z), [POSE.x, POSE.y, POSE.zoom]);
  if (moved !== true) throw new Error(`e2eSetViewState answered ${JSON.stringify(moved)}, expected true`);
  await settle(consoleHandle, "after the pose");
  return `two clauses (the second off), the fill colour ${SET_COLOUR} and the camera at (${POSE.x}, ${POSE.y}), zoom ${POSE.zoom}`;
}

async function stepR3(page, ctx) {
  expectAnswer(await hookSave(page, FOLDER_P), "asked", "the first e2eSaveProjectToFolder");
  ctx.saved = readFile(FOLDER_P);
  const kinds = ctx.saved.datasets?.[0]?.resource?.locators?.map((l) => l.kind).join();
  if (kinds === undefined || !kinds.includes("project-relative")) throw new Error(`the file's dataset locators read ${kinds}, expected a project-relative one`);
  if (!same(ctx.saved.workspace.clauses.map((c) => c.enabled), [true, false])) throw new Error(`the file's clauses read ${JSON.stringify(ctx.saved.workspace.clauses)}`);
  return `saved into P through the hook; ${ctx.saved.project}; locators ${kinds}`;
}

async function stepR4(page) {
  const own = noticeText("OPEN_ELSEWHERE_OWN_NOTICE");
  const answer = await hookOpen(page, FOLDER_P);
  expectAnswer(answer, "skp.project_open_elsewhere", "the same-window reopen");
  const shown = await page.evaluate(() => ({
    code: document.querySelector(".admission-panel .admission-refusal-code")?.textContent ?? null,
    owner: document.querySelector(".admission-panel .admission-refusal-owner")?.textContent ?? null,
    cancel: document.querySelector(".admission-open-cancel") !== null,
    liveness: document.querySelector(".admission-open-liveness") !== null,
    save: document.querySelector("button.save-project") !== null,
  }));
  if (shown.code !== "skp.project_open_elsewhere") throw new Error(`the refusal block shows the code ${shown.code}`);
  if (shown.owner !== own) throw new Error(`the refusal block's owner place reads ${JSON.stringify(shown.owner)}, expected S9's own-window place ${JSON.stringify(own)}`);
  if (shown.cancel || shown.liveness) throw new Error(`the run did not end: ${JSON.stringify(shown)}`);
  const kept = await readWorkspace(page);
  if (!shown.save || kept.clauses.length !== 2) throw new Error(`the window's open was not kept: ${JSON.stringify({ save: shown.save, clauses: kept.clauses })}`);
  return "refused as skp.project_open_elsewhere with S9's own-window place; the run ended; the open and its two clauses are kept";
}

async function stepR5(page, consoleHandle, ctx) {
  const known = closedTexts(await readConsole(page));
  let reading;
  await openFile(page, consoleHandle, FIXTURE, "another file (the fixture itself)", async () => { reading = await waitClosed(page, known, "the first handle's close"); });
  ctx.r5 = `${reading.label}; the close_dataset row has ${reading.rows.length - 1 - reading.fresh.index} entries after it`;
  return `another file opened; the first handle's close_dataset row is at ok (${ctx.r5})`;
}

async function stepR6(page, consoleHandle, ctx) {
  const answer = await hookOpen(page, FOLDER_P);
  const reading = await readConsole(page); // at once: the first look's tile requests have not yet been issued
  const early = (await readWorkspace(page)).view;
  expectAnswer(answer, "admitted", "the reopen of P");
  const rows = rowsOf(reading, "open_project");
  const last = rows.at(-1);
  if (last === undefined) throw new Error(`the Console holds no open_project row at its read (${reading.label}); the form's stop 13`);
  const request = requestOf(last);
  if (request === null || request.answer !== null || request.relink !== null) throw new Error(`the open_project row's request reads ${last.request}, expected answer and relink null`);
  if (last.outcome !== "ok") throw new Error(`the open_project row's outcome reads ${last.outcome}, expected ok`);
  ctx.r6 = `${reading.label}; the open_project row has ${reading.rows.length - 1 - last.index} entries after it`;
  await waitFor("the first pixels of the reopen", () => page.evaluate(async () => (await window.__SPATIAL_E2E__.capturePixels([])).nonBackgroundCount), (n) => n > 0, 60_000, 500);
  await settle(consoleHandle, "after the reopen's first look");
  const file = ctx.saved.workspace;
  const applied = await waitFor(
    "the applied workspace to read as the file does",
    () => readWorkspace(page),
    (w) => w.filter === file.filter?.predicate && same(w.clauses, file.clauses) && w.style?.fillColor === file.style.layer.fill_color.literal,
    30_000
  );
  const problems = [];
  if (applied.style.fillOpacity !== file.style.layer.fill_opacity.literal) problems.push(`fill opacity ${applied.style.fillOpacity} against ${file.style.layer.fill_opacity.literal}`);
  if (!same([hexF64(applied.view.centre[0]), hexF64(applied.view.centre[1]), hexF64(applied.view.zoom)], [...file.view.centre, file.view.zoom])) problems.push(`view ${JSON.stringify(applied.view)} (right after the call: ${JSON.stringify(early)}; notices ${JSON.stringify(await page.evaluate(() => [...document.querySelectorAll(".reopen-notice")].map((e) => e.textContent)))}) against ${JSON.stringify([file.view.centre, file.view.zoom])}`);
  if (problems.length > 0) throw new Error(`the applied workspace differs from the file: ${problems.join("; ")}`);
  return `opened; the open_project request carries answer and relink null, outcome ok (${ctx.r6}); filter, clauses, fill colour, opacity and view equal the file's, the view bit for bit`;
}

async function stepR7(page, ctx) {
  expectAnswer(await hookSave(page, FOLDER_SPARE), "not-asked", "the save after the reopen");
  if (readdirSync(FOLDER_SPARE).length !== 0) throw new Error("the spare folder, which no picker slot may reach, is not empty");
  const after = readFile(FOLDER_P);
  if (after.project !== ctx.saved.project || !same(after.workspace, ctx.saved.workspace)) throw new Error(`the file's workspace or identity changed by the save after the reopen: ${JSON.stringify(after.workspace)}`);
  return "the save answered not-asked (no picker slot used); the file's identity and workspace are unchanged";
}

/** `folders.json` of the identity, from the scratch store. */
function knownFolders(project) {
  const id = project.split("/").at(-1);
  return JSON.parse(readFileSync(join(SCRATCH, "spatial-ide", "projects", id, "folders.json"), "utf8"));
}

async function stepR8(page, consoleHandle, ctx) {
  // This window's open of P still holds P's lock; the answer `same` would meet it. As at R5, another file is opened and the close of P's handle is seen first.
  const known = closedTexts(await readConsole(page));
  let closed;
  await openFile(page, consoleHandle, FIXTURE, "another file (before Q)", async () => { closed = await waitClosed(page, known, "P's handle"); });
  ctx.r8 = `${closed.label}; the close_dataset row has ${closed.rows.length - 1 - closed.fresh.index} entries after it`;
  cpSync(FOLDER_P, FOLDER_Q, { recursive: true });
  expectAnswer(await hookOpen(page, FOLDER_Q), "question", "the reopen of Q");
  const text = noticeText("QUESTION_TEXT");
  const shown = await page.evaluate(() => document.querySelector(".admission-reopen-question p")?.textContent ?? null);
  if (shown !== text) throw new Error(`S8 shows ${JSON.stringify(shown)}, expected ${JSON.stringify(text)}`);
  await page.click(".admission-reopen-same");
  const reading = await waitFor(
    "an open_project row with answer same at ok",
    () => readConsole(page),
    (r) => rowsOf(r, "open_project").some((row) => requestOf(row)?.answer === "same" && row.outcome === "ok"),
    60_000
  );
  await waitFor("S8 to be gone", () => page.evaluate(() => document.querySelector(".admission-reopen-question") !== null), (open) => open === false, 10_000);
  const folders = JSON.stringify(knownFolders(ctx.saved.project));
  for (const folder of [FOLDER_P, FOLDER_Q]) if (!folders.includes(basename(folder))) throw new Error(`folders.json reads ${folders}, expected it to list ${basename(folder)}`);
  return `P's handle closed (${ctx.r8}); Q (a hand copy of P) gave S8 with its text; the same choice opened it (${reading.label}); folders.json lists both folders`;
}

async function stepR9(page, consoleHandle) {
  const dataD = join(DATA_DIR, "moved-away.parquet");
  const project = await openAndSave(page, consoleHandle, FOLDER_P2, dataD);
  const kinds = project.datasets?.[0]?.resource?.locators?.map((l) => l.kind).join();
  if (kinds !== "machine-recorded") throw new Error(`P2's dataset locators read ${kinds}, expected machine-recorded alone`);
  const known = closedTexts(await readConsole(page));
  let closed;
  await openFile(page, consoleHandle, FIXTURE, "another file", async () => { closed = await waitClosed(page, known, "P2's data handle"); });
  const ring = `${closed.label}; the close_dataset row has ${closed.rows.length - 1 - closed.fresh.index} entries after it`;
  const moved = join(DATA_DIR, "found-again.parquet");
  await retrying("renaming P2's data file", () => renameSync(dataD, moved));
  expectAnswer(await hookOpen(page, FOLDER_P2), "not_found", "the reopen of P2");
  const shown = await page.evaluate(() => document.querySelector(".admission-reopen-not-found p")?.textContent ?? null);
  if (shown === null || !shown.includes(basename(dataD))) throw new Error(`S11 shows ${JSON.stringify(shown)}, expected it to name ${basename(dataD)}`);
  expectAnswer(await hookRelink(page, moved), "admitted", "the re-link");
  return `P2's handle closed (${ring}); P2's data moved; S11 named ${basename(dataD)}; the re-link slot's file opened the project`;
}

async function stepChanged(page, consoleHandle) {
  const data = join(FOLDER_C, "parcels.parquet");
  await openAndSave(page, consoleHandle, FOLDER_C, data);
  const known = closedTexts(await readConsole(page));
  let closed;
  await openFile(page, consoleHandle, FIXTURE, "another file", async () => { closed = await waitClosed(page, known, "F4's handle"); });
  const ring = `${closed.label}; the close_dataset row has ${closed.rows.length - 1 - closed.fresh.index} entries after it`;
  const stat = statSync(data);
  await retrying("moving F4's mtime", () => utimesSync(data, stat.atime, new Date(stat.mtimeMs + 60_000)));
  expectAnswer(await hookOpen(page, FOLDER_C), "admitted", "the reopen of F4");
  const notices = await waitFor("the reopen's notice", () => page.evaluate(() => [...document.querySelectorAll(".reopen-notice")].map((e) => e.textContent)), (all) => all.length > 0, 10_000);
  const text = notices.join("\n");
  if (!text.includes("In the file: mtime.")) throw new Error(`the notices read ${JSON.stringify(notices)}, expected S10 naming mtime`);
  if (text.includes("In its admission")) throw new Error(`the notices read ${JSON.stringify(notices)}, expected no admission part`);
  return `F4's predecessor handle closed (${ring}); F4 (F1 with its mtime 60 s later) opened; the notice names mtime alone: ${JSON.stringify(notices)}`;
}

async function main() {
  const watchdog = setTimeout(() => {
    console.error("reopen: SPATIAL_E2E_DEADLINE_MS (default 1200000) exceeded -- presumed hung, failing loudly");
    process.exit(2);
  }, Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 1_200_000));
  watchdog.unref();

  if (!existsSync(FIXTURE)) {
    console.error(`reopen: fixture not found: ${FIXTURE}\nRegenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    dropFolders();
    return;
  }
  console.log(`reopen: the store for this run is ${SCRATCH}; the folders are ${[FOLDER_P, FOLDER_Q, FOLDER_P2, FOLDER_C, FOLDER_SPARE, DATA_DIR].join(", ")}`);
  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`reopen: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    dropFolders();
    return;
  }
  const { page, launched } = session;
  if (!launched) {
    console.error(`reopen: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA; stop it (and its process tree) and run again.`);
    await session.browser.close().catch(() => {});
    process.exitCode = 1;
    dropFolders();
    return;
  }
  const consoleHandle = attachConsole(page);
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
    console.log(`reopen: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    await waitFor(
      `the app header and the hooks ${HOOKS.join(", ")}`,
      () => page.evaluate((hooks) => document.querySelector(".app-header") !== null && hooks.slice(0, 5).every((h) => typeof window.__SPATIAL_E2E__?.[h] === "function"), HOOKS),
      (ready) => ready === true,
      MOUNT_READY_TIMEOUT_MS,
      300
    );
    // Each step needs the one before it, so the first failure ends the run (the cleanup still happens, in `finally`).
    const ok =
      (await runStep("R1", 180_000, () => stepR1(page, consoleHandle, ctx))) &&
      (await runStep("R2", 240_000, () => stepR2(page, consoleHandle))) &&
      (await runStep("R3", 120_000, () => stepR3(page, ctx))) &&
      (await runStep("R4", 120_000, () => stepR4(page))) &&
      (await runStep("R5", 240_000, () => stepR5(page, consoleHandle, ctx))) &&
      (await runStep("R6", 300_000, () => stepR6(page, consoleHandle, ctx))) &&
      (await runStep("R7", 120_000, () => stepR7(page, ctx))) &&
      (await runStep("R8", 240_000, () => stepR8(page, consoleHandle, ctx))) &&
      (await runStep("R9", 400_000, () => stepR9(page, consoleHandle))) &&
      (await runStep("E-CHANGED", 300_000, () => stepChanged(page, consoleHandle)));
    console.log("\n== Summary ==");
    for (const r of results) console.log(`${r.id.padEnd(9)}  ${r.status.padEnd(6)}  ${r.note}`);
    process.exitCode = results.some((r) => r.status === "FAIL") || !ok ? 1 : 0;
  } catch (e) {
    console.error(`reopen: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `reopen-console-ledger-${Date.now()}.json`);
      writeFileSync(ledgerPath, JSON.stringify({ allConsoleEntries: consoleHandle.entries }, null, 2));
      console.log(`Full console ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`reopen: failed to write the ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    await session.stop().catch(() => {});
    dropFolders();
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
