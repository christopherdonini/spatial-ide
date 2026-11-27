#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 4, C-E2 as Amendments 2, 4 and 12 leave it): the shipped candidate arm's real-app proof of seam 8, on real WebView2,
// run as `node e2e/conditions.mjs` from frontends/shell. WRITTEN, NOT RUN, by the build that added it: the run is the tester's.
// The fixture is a scratch copy of `100k-happy-path.parquet`, made by the manual-walkthrough fixture generator into this checkout's target/fixtures/manual-walkthrough;
// `--fixture <path>` names another copy of the same file. The copy is hashed before and after the run (a write here is an mtime touch only). The app's store is a scratch LOCALAPPDATA.
// The arm is the shipped one: `getResidencyArm()` is read back as "candidate" before the first `openPath`, and `setResidencyArm` is never called.
//
// Steps (the section's C-E2 row):
//   1. open the copy; save through `e2eSaveProjectToFolder` into a new folder under the run's TMP: the strip's top is a `.save-notice`, the save notices include the owner's
//      `SAVED_NOTICE` (read from `src/project/saveProject.ts` by name, as `project.mjs` reads S18), and S-3 is absent (Amendment 4's N-4: exactly one notice here);
//   2. write to the copy (an mtime touch with its sha256 unchanged, as `source-watch-idle.mjs:446-458`) and pan (H7): the top is session ended with S-3 at 1;
//   3. S-3 opens Problems, which lists the top row and the `.save-notice` row; `.canvas-session-ended` and each `.save-notice` are each once in the DOM;
//      no `.canvas-refusal` holds an `.admission-refusal-code` and none stands that is not a notice (no viewport-refusal and no stream-terminal condition: H7);
//   4. reopen the copy. Once the reopen is admitted, wait within WAIT_TIMEOUT_MS for session ended and the save notice to go; if either still stands at that bound the step FAILS.
//      Then PASS on S-4; any other reading FAILS.
// Exit 0 all PASS; 1 a check failed (step 4's wait for the old conditions included); 2 VOID (a precondition failed: the arm, the fixture, any other wait that timed out).
// What this does not prove: any docs/08 figure, macOS or Linux, the baseline arm (that is `conditions-baseline.mjs`), or a timing. Waits are harness bounds on readiness (ADR-018).
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const TEMP_BASE = realpathSync.native(tmpdir());
const SCRATCH = mkdtempSync(join(TEMP_BASE, "spatial-conditions-"));
process.env.LOCALAPPDATA = SCRATCH;

const { attachOrLaunch, attachConsole, waitForSettle, canvasRect, CDP_PORT } = await import("./lib.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const fixtureAt = argv.indexOf("--fixture");
const FIXTURE = fixtureAt !== -1 ? argv[fixtureAt + 1] : join(HERE, "..", "..", "..", "target", "fixtures", "manual-walkthrough", "100k-happy-path.parquet");
const SAVE_PROJECT_SOURCE = join(HERE, "..", "src", "project", "saveProject.ts");
const MOUNT_READY_TIMEOUT_MS = 90_000;
const WAIT_TIMEOUT_MS = 60_000;
const PAN_PX = 120; // CSS px of pointer travel, in 12 steps

// The strings are the advisor's (ADV-2026-11-23-30 item 1), copied by script from the ruling file.
const MORE_IN_PROBLEMS = (n) => `${n} more in Problems`;
const NO_PROBLEMS = "No problems for the dataset on the map.";
const SHOWN_ABOVE = "Shown above in the attention strip.";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
class Void extends Error {}
const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ::  ${detail}`);
}

async function waitFor(what, read, predicate, timeoutMs = WAIT_TIMEOUT_MS, pollMs = 200) {
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

const settle = async (consoleHandle, what, quietMs = 2000) => {
  const outcome = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs, timeoutMs: 120_000 });
  if (!outcome.settled) throw new Void(`the render trace was not quiet for ${quietMs}ms within 120000ms (${what})`);
};

/** `SAVED_NOTICE`'s text, read from the exported constant's own source by its name (`project.mjs`'s `s18Text`). */
function savedNoticeText() {
  const source = readFileSync(SAVE_PROJECT_SOURCE, "utf8");
  const found = /export const SAVED_NOTICE =\s*("(?:[^"\\]|\\.)*");/.exec(source);
  if (found === null) throw new Void(`${SAVE_PROJECT_SOURCE} holds no exported SAVED_NOTICE constant`);
  return JSON.parse(found[1]);
}

/** The strip and Problems as the page shows them, in one read. */
const read = (page) =>
  page.evaluate(() => {
    const strip = document.querySelector(".attention-strip");
    const others = strip?.querySelector("button.attention-others") ?? null;
    const problems = document.querySelector("#activity-panel-problems");
    const rows = problems ? [...problems.querySelectorAll(".problem-row")] : [];
    return {
      stripShown: strip !== null && !strip.hasAttribute("hidden"),
      topClasses: strip?.firstElementChild?.className ?? null,
      topAlert: strip?.firstElementChild?.getAttribute("role") ?? null,
      othersText: others?.textContent ?? null,
      sessionEnded: document.querySelectorAll(".canvas-session-ended").length,
      saveNotices: [...document.querySelectorAll(".save-notice")].map((e) => e.textContent),
      refusalCodes: document.querySelectorAll(".canvas-refusal .admission-refusal-code").length,
      plainRefusals: document.querySelectorAll(".canvas-refusal:not(.save-notice):not(.record-notice):not(.reopen-notice)").length,
      problemsSelected: document.querySelector("#activity-tab-problems")?.getAttribute("aria-selected") === "true",
      rows: rows.map((row) => ({ top: row.classList.contains("problem-row-top"), text: row.textContent, owner: row.matches(".canvas-session-ended, .canvas-refusal, .record-notice, .save-notice, .reopen-notice"), saveNotices: row.querySelectorAll(".save-notice").length })),
      emptyText: problems?.textContent ?? "",
    };
  });

async function pan(page) {
  const rect = await canvasRect(page);
  const centre = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  await page.mouse.move(centre.x, centre.y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(centre.x + (PAN_PX * i) / 12, centre.y + (PAN_PX * i) / 24);
  await page.mouse.up();
}

async function run(page, consoleHandle, copy) {
  await waitFor("the app header and the openPath hook", () => page.evaluate(() => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function"), (ready) => ready === true, MOUNT_READY_TIMEOUT_MS, 300);
  const arm = await page.evaluate(() => window.__SPATIAL_E2E__.getResidencyArm?.());
  if (arm !== "candidate") throw new Void(`getResidencyArm() read ${JSON.stringify(arm)}, expected "candidate": the shipped arm is the one this suite proves`);
  const hashBefore = sha256(copy);

  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), copy);
  if (opened?.kind !== "admitted") throw new Void(`openPath did not admit the copy: ${JSON.stringify(opened)}`);
  await settle(consoleHandle, "after the open");

  // 1. The save: a notice, and nothing else.
  const folder = join(TEMP_BASE, `spatial-conditions-save-${Date.now()}`);
  mkdirSync(folder, { recursive: true });
  const asked = await page.evaluate((f) => window.__SPATIAL_E2E__.e2eSaveProjectToFolder(f), folder);
  if (asked !== "asked") throw new Void(`e2eSaveProjectToFolder answered ${JSON.stringify(asked)}, expected "asked"`);
  const saved = savedNoticeText();
  const afterSave = await waitFor("the save notices", () => read(page), (r) => r.saveNotices.includes(saved));
  record("the strip's top is a .save-notice", afterSave.topClasses?.split(" ").includes("save-notice") === true, `the strip's first element has the classes ${JSON.stringify(afterSave.topClasses)}`);
  record("the top carries the alert role", afterSave.topAlert === "alert", `role ${JSON.stringify(afterSave.topAlert)}`);
  record("the save notices hold SAVED_NOTICE once, and only it (N-4: exactly one notice)", afterSave.saveNotices.length === 1 && afterSave.saveNotices[0] === saved, JSON.stringify(afterSave.saveNotices));
  record("S-3 is absent", afterSave.othersText === null, `the strip's button reads ${JSON.stringify(afterSave.othersText)}`);

  // 1b. E-A1, a second save is announced: save again, and what the strip shows is a new element whose text differs from the first save's line.
  // The first wait is a harness bound on readiness, not a timing: the page's clock must read a whole second past its own first reading, which follows step 1's.
  const firstSaveLine = afterSave.saveNotices[0];
  const pageClock = () => page.evaluate(() => Date.now());
  const clockAtFirstReading = await pageClock();
  const nextWholeSecond = (Math.floor(clockAtFirstReading / 1000) + 1) * 1000;
  await waitFor("the page's clock to read a whole second past the first reading", pageClock, (now) => now >= nextWholeSecond);
  const held = await page.$(".attention-strip .save-notice");
  if (held === null) throw new Void("no .attention-strip .save-notice stands to hold before the second save");
  const askedAgain = await page.evaluate((f) => window.__SPATIAL_E2E__.e2eSaveProjectToFolder(f), folder);
  if (askedAgain !== "not-asked") throw new Void(`the second e2eSaveProjectToFolder answered ${JSON.stringify(askedAgain)}, expected "not-asked"`);
  // The wait throws no Void: the held element still connected at the bound is a FAIL, recorded below with the last reading, and the checks that follow read after the wait.
  const heldWaitStart = Date.now();
  let heldConnected;
  while (Date.now() - heldWaitStart < WAIT_TIMEOUT_MS) {
    try {
      heldConnected = await held.evaluate((el) => el.isConnected);
      if (heldConnected === false) break;
    } catch (e) {
      heldConnected = { readFailed: e.message };
    }
    await sleep(200);
  }
  const afterSecondSave = await page.evaluate(() => {
    const top = document.querySelector(".attention-strip .save-notice");
    return { text: top?.textContent ?? null, role: top?.getAttribute("role") ?? null, occurrences: document.querySelectorAll(".condition-occurrences").length };
  });
  record("E-A1: the held save line is no longer connected, and the strip's top .save-notice carries the alert role", heldConnected === false && afterSecondSave.role === "alert", `the held element connected: ${JSON.stringify(heldConnected)}; the top's role ${JSON.stringify(afterSecondSave.role)}`);
  record("E-A1: the second save's line differs from the first save's", afterSecondSave.text !== null && afterSecondSave.text !== firstSaveLine, `first ${JSON.stringify(firstSaveLine)}; second ${JSON.stringify(afterSecondSave.text)}`);
  record("E-A1: no .condition-occurrences stands", afterSecondSave.occurrences === 0, `${afterSecondSave.occurrences} stand`);

  // 2. The write and the pan (H7).
  const later = new Date(Date.now() + 120_000);
  utimesSync(copy, later, later);
  if (sha256(copy) !== hashBefore) throw new Void("the copy's bytes changed under the write: it must be an mtime touch only");
  await pan(page);
  const ended = await waitFor("session ended in the strip", () => read(page), (r) => r.sessionEnded >= 1 && r.othersText !== null);
  record("the top is session ended, with the alert role through the owner's block", ended.topClasses?.split(" ").includes("canvas-session-ended") === true, `the strip's first element has the classes ${JSON.stringify(ended.topClasses)}`);
  record("S-3 reads 1 more in Problems", ended.othersText === MORE_IN_PROBLEMS(1), `the button reads ${JSON.stringify(ended.othersText)}`);
  record("no viewport-refusal and no stream-terminal condition (H7)", ended.refusalCodes === 0 && ended.plainRefusals === 0, `.admission-refusal-code ${ended.refusalCodes}, refusals that are not notices ${ended.plainRefusals}`);

  // 3. S-3 opens Problems.
  await page.click("button.attention-others");
  const open = await waitFor("the Problems tab", () => read(page), (r) => r.problemsSelected && r.rows.length > 0);
  record("S-3 opened Problems", open.problemsSelected, "the Problems tab is selected");
  record("Problems lists the top row and the .save-notice row", open.rows.length === 2 && open.rows[0].top && !open.rows[0].owner && open.rows[0].text === SHOWN_ABOVE && !open.rows[1].top && open.rows[1].saveNotices === 1, JSON.stringify(open.rows));
  record(".canvas-session-ended is once in the DOM", open.sessionEnded === 1, `${open.sessionEnded}`);
  record("each .save-notice is once in the DOM", open.saveNotices.length === 1 && open.saveNotices[0] === saved, JSON.stringify(open.saveNotices));

  // 4. The reopen: a successful open of the copy, and S-4 shows.
  const reopened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), copy);
  if (reopened?.kind !== "admitted") throw new Void(`the second openPath did not admit the copy: ${JSON.stringify(reopened)}`);
  // The wait throws no Void: session ended or the save notice still standing at the bound is a FAIL (Amendment 12, item 3).
  const waitStart = Date.now();
  let reading;
  let gone = false;
  while (Date.now() - waitStart < WAIT_TIMEOUT_MS) {
    try {
      reading = await read(page);
      if (reading.sessionEnded === 0 && reading.saveNotices.length === 0) {
        gone = true;
        break;
      }
    } catch (e) {
      reading = { readFailed: e.message };
    }
    await sleep(200);
  }
  if (!gone) {
    record("the reopen ends session ended and the save notice within the bound", false, `one of them still stood after ${WAIT_TIMEOUT_MS}ms; the last reading was ${JSON.stringify(reading)}`);
  } else {
    record("a reopen empties Problems: S-4 shows, and the strip is hidden", reading.emptyText.includes(NO_PROBLEMS) && reading.rows.length === 0 && !reading.stripShown && reading.sessionEnded === 0 && reading.saveNotices.length === 0, `rows ${reading.rows.length}, the strip shown ${reading.stripShown}, ended ${reading.sessionEnded}, save notices ${reading.saveNotices.length}`);
  }

  const hashAfter = sha256(copy);
  if (hashAfter !== hashBefore) throw new Void(`the copy's sha256 changed during the run: ${hashBefore} -> ${hashAfter}`);
  console.log(`the copy's sha256 ${hashAfter} (unchanged)`);
}

async function main() {
  if (!existsSync(FIXTURE)) {
    console.error(`conditions: fixture missing: ${FIXTURE}\nRegenerate with the manual-walkthrough fixture generator (frontends/shell/MANUAL-WALKTHROUGH.md names it), or pass --fixture <path>.`);
    process.exit(2);
  }
  const copy = join(SCRATCH, "conditions-100k.parquet");
  copyFileSync(FIXTURE, copy);
  console.log(`conditions: the copy ${copy} of ${FIXTURE}, sha256 ${sha256(copy)}; LOCALAPPDATA=${SCRATCH}`);
  const session = await attachOrLaunch();
  if (!session.launched) {
    console.error(`conditions: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA; stop it and run again.`);
    await session.browser.close().catch(() => {});
    process.exit(2);
  }
  const consoleHandle = attachConsole(session.page);
  let voided = null;
  try {
    await run(session.page, consoleHandle, copy);
  } catch (e) {
    if (!(e instanceof Void)) { console.error("conditions.mjs fatal:", e?.stack ?? e); voided = `fatal: ${e?.message ?? e}`; } else voided = e.message;
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
