#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md section 4, C-E1 as Amendments 2, 3 and 4 leave it): the baseline-only routes (canvas-ceiling, stream-terminal) in the real app, in
// their own baseline-pinned process, run as `node e2e/conditions-baseline.mjs` from frontends/shell. WRITTEN, NOT RUN, by the build that added it: the run is the tester's.
// The fixture is a scratch copy of `over-ceiling-refused.parquet` (a valid file whose first look is refused render-side, MANUAL-WALKTHROUGH.md Part D), made by the manual-walkthrough
// fixture generator into this checkout's target/fixtures/manual-walkthrough; `--fixture <path>` names another copy. The copy is hashed before and after (the write is an mtime touch only).
// The arm is pinned ONCE in `main()`'s run before the first `openPath`, with a `getResidencyArm()` readback; a refused pin fails the run (`refusal-contract-baseline.mjs`'s pin, restated).
//
// Steps (the section's C-E1 row):
//   1. open the copy: the canvas refusal is the strip's top, with no S-3 and no S-5 line;
//   2. pan: the same refusal is raised again under the same view and open (H3), and Problems shows 1 row (the top), the strip's element carrying S-5 with the count of raises;
//   3. write to the copy (mtime touch, sha256 unchanged) and pan: the top is session ended with S-3 at 1 and both conditions standing, or S-3 at 2 only when the session log holds a
//      `stream-terminal-failure` line whose detail opens with `engine.source_changed` (the extra row being that stream-terminal condition); any other count fails;
//   4. S-3 opens Problems; Dismiss the canvas refusal; reopen the copy, and both the strip and Problems are empty (S-4 shows).
// Exit 0 all PASS; 1 a check failed; 2 VOID (the arm pin, the fixture, a wait that timed out).
// What this does not prove: any docs/08 figure, macOS or Linux, the shipped candidate arm (that is `conditions.mjs`), or a timing. Waits are harness bounds on readiness (ADR-018).
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, utimesSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const TEMP_BASE = realpathSync.native(tmpdir());
const SCRATCH = mkdtempSync(join(TEMP_BASE, "spatial-conditions-baseline-"));
process.env.LOCALAPPDATA = SCRATCH;
const LOG_DIR = join(SCRATCH, "dev.spatialide.shell", "logs");

const { attachOrLaunch, attachConsole, waitForSettle, canvasRect, CDP_PORT } = await import("./lib.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const fixtureAt = argv.indexOf("--fixture");
const FIXTURE = fixtureAt !== -1 ? argv[fixtureAt + 1] : join(HERE, "..", "..", "..", "target", "fixtures", "manual-walkthrough", "over-ceiling-refused.parquet");
const MOUNT_READY_TIMEOUT_MS = 90_000;
const WAIT_TIMEOUT_MS = 90_000;
const PAN_PX = 120; // CSS px of pointer travel, in 12 steps

// The strings are the advisor's (ADV-2026-11-23-30 item 1), copied by script from the ruling file.
const MORE_IN_PROBLEMS = (n) => `${n} more in Problems`;
const RAISED_TIMES = (n) => `Raised ${n} times in all. The latest:`;
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

/** This run's own app's newest session log (the scratch LOCALAPPDATA holds no other). */
function sessionLogLines() {
  if (!existsSync(LOG_DIR)) return [];
  const names = readdirSync(LOG_DIR).filter((n) => /^session-\d+\.log$/.test(n)).sort((a, b) => Number(a.slice(8, -4)) - Number(b.slice(8, -4)));
  return names.length === 0 ? [] : readFileSync(join(LOG_DIR, names[names.length - 1]), "utf8").split("\n");
}
/** The `stream-terminal-failure` lines whose detail opens with `engine.source_changed` (`App.tsx` writes `<handle>: <kind> — <detail>`). */
const sourceChangedTerminals = () => sessionLogLines().filter((line) => /stream-terminal-failure .*— engine\.source_changed/.test(line)).length;

/** The strip and Problems as the page shows them, in one read. */
const read = (page) =>
  page.evaluate(() => {
    const strip = document.querySelector(".attention-strip");
    const problems = document.querySelector("#activity-panel-problems");
    const rows = problems ? [...problems.querySelectorAll(".problem-row")] : [];
    return {
      stripShown: strip !== null && !strip.hasAttribute("hidden"),
      topClasses: strip?.firstElementChild?.className ?? null,
      othersText: strip?.querySelector("button.attention-others")?.textContent ?? null,
      occurrencesLine: strip?.querySelector(".condition-occurrences")?.textContent ?? null,
      sessionEnded: document.querySelectorAll(".canvas-session-ended").length,
      refusals: document.querySelectorAll(".canvas-refusal:not(.save-notice):not(.record-notice):not(.reopen-notice)").length,
      problemsSelected: document.querySelector("#activity-tab-problems")?.getAttribute("aria-selected") === "true",
      rows: rows.map((row) => ({ top: row.classList.contains("problem-row-top"), text: row.textContent, owner: row.matches(".canvas-session-ended, .canvas-refusal, .record-notice, .save-notice, .reopen-notice") })),
      panelText: problems?.textContent ?? "",
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
  // Pinned once, before the first openPath: a refused pin, or a readback that is not "baseline", fails the run.
  const pinned = await page.evaluate(() => window.__SPATIAL_E2E__.setResidencyArm?.("baseline"));
  if (!pinned || pinned.ok !== true) throw new Void(`setResidencyArm("baseline") failed: ${JSON.stringify(pinned)}`);
  const arm = await page.evaluate(() => window.__SPATIAL_E2E__.getResidencyArm?.());
  if (arm !== "baseline") throw new Void(`getResidencyArm() read ${JSON.stringify(arm)}, expected "baseline" after a pin that answered ok`);
  const hashBefore = sha256(copy);

  // 1. The open: the canvas refusal first.
  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), copy);
  if (opened?.kind !== "admitted") throw new Void(`openPath did not admit the copy: ${JSON.stringify(opened)}`);
  const first = await waitFor("the canvas refusal", () => read(page), (r) => r.refusals >= 1);
  record("the refusal is the strip's top", first.topClasses?.split(" ").includes("canvas-refusal") === true, `the strip's first element has the classes ${JSON.stringify(first.topClasses)}`);
  record("no S-3 and no S-5 line", first.othersText === null && first.occurrencesLine === null, `the button ${JSON.stringify(first.othersText)}, the line ${JSON.stringify(first.occurrencesLine)}`);
  await settle(consoleHandle, "after the first refusal");

  // 2. A pan raises it again (H3): one condition, with S-5.
  await pan(page);
  const again = await waitFor("the refusal's occurrence line", () => read(page), (r) => r.occurrencesLine !== null);
  const counted = /\d+/.exec(again.occurrencesLine);
  const times = counted === null ? NaN : Number(counted[0]);
  record("the pan raised the same refusal again: S-5 reads the count of raises", Number.isInteger(times) && times >= 2 && again.occurrencesLine === RAISED_TIMES(times), `the line reads ${JSON.stringify(again.occurrencesLine)}`);
  record("one condition: one refusal in the DOM, no S-3", again.refusals === 1 && again.othersText === null, `refusals ${again.refusals}, the button ${JSON.stringify(again.othersText)}`);
  // Activity is closed at the first layout: its chord (Ctrl+J, layout.mjs) opens it, then its Problems tab is clicked.
  if (await page.evaluate(() => document.querySelector("#region-activity")?.hasAttribute("hidden"))) await page.keyboard.press("Control+KeyJ");
  await page.click("#activity-tab-problems");
  const shown = await waitFor("the Problems tab", () => read(page), (r) => r.problemsSelected);
  record("Problems shows 1 row, the top", shown.rows.length === 1 && shown.rows[0].top && !shown.rows[0].owner && shown.rows[0].text === SHOWN_ABOVE, JSON.stringify(shown.rows));

  // 3. A write and a pan end the session (H2).
  const later = new Date(Date.now() + 120_000);
  utimesSync(copy, later, later);
  if (sha256(copy) !== hashBefore) throw new Void("the copy's bytes changed under the write: it must be an mtime touch only");
  await pan(page);
  const ended = await waitFor("session ended in the strip", () => read(page), (r) => r.sessionEnded >= 1);
  const terminals = sourceChangedTerminals();
  const expectedOthers = terminals > 0 ? 2 : 1;
  record("the top is session ended", ended.topClasses?.split(" ").includes("canvas-session-ended") === true, `the strip's first element has the classes ${JSON.stringify(ended.topClasses)}`);
  record(`S-3 reads ${expectedOthers} (the session log holds ${terminals} stream-terminal-failure line(s) opening engine.source_changed)`, ended.othersText === MORE_IN_PROBLEMS(expectedOthers), `the button reads ${JSON.stringify(ended.othersText)}`);
  record("both conditions stand: the refusal and session ended, each once in the DOM", ended.sessionEnded === 1 && ended.refusals === 1 + (terminals > 0 ? 1 : 0), `session ended ${ended.sessionEnded}, refusals ${ended.refusals}`);

  // 4. S-3 opens Problems; Dismiss; the reopen.
  await page.click("button.attention-others");
  const open = await waitFor("the Problems tab", () => read(page), (r) => r.problemsSelected && r.rows.length === 1 + expectedOthers);
  record("S-3 opened Problems, with the top and the others", open.problemsSelected && open.rows.length === 1 + expectedOthers && open.rows[0].top, JSON.stringify(open.rows));
  await page.evaluate(() => document.querySelector("#activity-panel-problems .canvas-refusal button")?.click());
  const dismissed = await waitFor("the refusal's Dismiss", () => read(page), (r) => r.refusals === ended.refusals - 1);
  record("Dismiss ends the refusal and nothing else", dismissed.sessionEnded === 1, `refusals ${dismissed.refusals}, session ended ${dismissed.sessionEnded}`);
  const reopened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), copy);
  if (reopened?.kind !== "admitted") throw new Void(`the reopen's openPath did not admit the copy: ${JSON.stringify(reopened)}`);
  const empty = await waitFor("S-4 in Problems", () => read(page), (r) => r.panelText.includes(NO_PROBLEMS));
  record("a reopen empties both: the strip is hidden and Problems shows S-4", !empty.stripShown && empty.rows.length === 0 && empty.refusals === 0 && empty.sessionEnded === 0, `the strip shown ${empty.stripShown}, rows ${empty.rows.length}`);

  const hashAfter = sha256(copy);
  if (hashAfter !== hashBefore) throw new Void(`the copy's sha256 changed during the run: ${hashBefore} -> ${hashAfter}`);
  console.log(`the copy's sha256 ${hashAfter} (unchanged)`);
}

async function main() {
  if (!existsSync(FIXTURE)) {
    console.error(`conditions-baseline: fixture missing: ${FIXTURE}\nRegenerate with the manual-walkthrough fixture generator (frontends/shell/MANUAL-WALKTHROUGH.md names it), or pass --fixture <path>.`);
    process.exit(2);
  }
  const copy = join(SCRATCH, "conditions-over-ceiling.parquet");
  copyFileSync(FIXTURE, copy);
  console.log(`conditions-baseline: the copy ${copy} of ${FIXTURE}, sha256 ${sha256(copy)}; LOCALAPPDATA=${SCRATCH}`);
  const session = await attachOrLaunch();
  if (!session.launched) {
    console.error(`conditions-baseline: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA; stop it and run again.`);
    await session.browser.close().catch(() => {});
    process.exit(2);
  }
  const consoleHandle = attachConsole(session.page);
  let voided = null;
  try {
    await run(session.page, consoleHandle, copy);
  } catch (e) {
    if (!(e instanceof Void)) { console.error("conditions-baseline.mjs fatal:", e?.stack ?? e); voided = `fatal: ${e?.message ?? e}`; } else voided = e.message;
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
