#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- Brief A boundary 4, P3b's T10
// (`frontends/shell/OWNER-INVALIDATION-PREREGISTRATION.md` section 4).
//
// WHAT THIS PROVES, and it is exactly one thing: that when the source file changes underneath an
// open dataset, the RUNNING app clears the resident geometry it was showing and refuses picks,
// and that what the operator reads is a sentence rather than a machine code. Every other claim
// P3b makes is a unit or integration assertion at a named seam; this is the only step that can
// speak about what an operator sees, which is why section 4 declares it.
//
// WHAT IT DOES NOT PROVE. Nothing here says the session up to the detection was a snapshot
// (block-on-sight A1). It says what was cleared, never that what was cleared was consistent.
// Evidence class is E2E-verified, not operator-verified (e2e/README.md's own "Evidence class"):
// the native file dialog is bypassed by `openPath`, and no look-and-feel judgement is made here.
//
// NO TIMING, ANYWHERE (ADR-018; section 1's boundary-10 line). This script records a single observation
// and no duration: no p50/p95, no ms figure, no rate, and no performance word in any assertion,
// note or report field. The two millisecond numbers that do exist are BOUNDS on waiting
// (`withTimeout`, the whole-run watchdog) -- the same bounds every sibling driver carries, never
// reported as a result. The step report has no elapsed field, deliberately.
//
// THE COUNTS READ, and why it is not `residencyEndStep`. Resident vertices are read through
// `window.__SPATIAL_E2E__.residentCounts()`, a counts-only hook added with this driver
// (`src/e2e-test-surface.ts`, registered in `App.tsx`). `residencyEndStep` exposes the same totals
// but merged into the residency MEASUREMENT instrument's step snapshot, which carries timing
// fields; reaching it to read a count would drag a measurement into a piece that measures nothing.
// Custodian's decision, 2026-09-17, recorded as a class-2 deviation in the preregistration's section 10
// Amendment 5 -- section 6 of that document named an existing counts-only hook, and no such hook existed.
//
// THE FIXTURE (X-4). A scratch COPY of the 100k manual-walkthrough fixture, copied per run, and
// mutated by an MTIME TOUCH ONLY -- bytes untouched. A copy rather than the fixture itself
// deliberately: other E2E steps share that file and a mutation would end their sessions too.
// The copy is sha256-hashed BEFORE and AFTER the run (section 8.8), and the two hashes must be EQUAL:
// that equality is what proves the mutation was an mtime touch and not a byte edit.
//
// ----------------------------------------------------------------------------------------------
// THE RECORDED MUTATION, and how to perform it (section 4 T10; run it ONCE, record the observed failure,
// then revert -- never ship it).
//
//   Mutation: skip the owner clear in a dev build. In
//   `src/streaming/viewportStreamManager.ts`, delete the `this.clearResidency();` line from the
//   source-changed branch; and in `src/residency/candidateArmSession.ts`, delete the
//   `canvas?.clearAllTiles();` line from `endCandidateSession`. (Either one alone suffices for the
//   arm the run exercises; the shipped default arm is `candidate`, so the second is the one that
//   bites unless the run pins baseline.) Rebuild/reload, run this script.
//
//   Expected failure: step S5b fails by name -- `residentCounts()` reports non-zero resident
//   vertices after the change, and the message prints the count it found. The status line and the
//   pick refusal (S5a, S5c) still pass, which is the point: they are the owner SAYING something,
//   and S5b is the owner having DONE it. Record the observed failure, then revert.
//
//   OBSERVED 2026-09-17, performed once and reverted (run 6, report
//   `e2e/out/source-changed-1789618937407.json`; section 10 Amendment 9), verbatim:
//
//     S5b: resident vertices are 188665 (features 10000), expected 0 -- the owner did not clear
//     what it was showing
//
//   And S5a and S5c PASSED under it, exactly as predicted: those two are the owner SAYING
//   something, S5b is the owner having DONE it. Both edits were reverted and run 7
//   (`...-1789618985531.json`) is green from the reverted tree.
//
// ----------------------------------------------------------------------------------------------
// THIS DRIVER PASSES. Runs 5 and 7 are green end to end (reports
// `e2e/out/source-changed-1789618861740.json` and `...-1789618985531.json`, section 10
// Amendment 9): resident 188665 -> 0 vertices, the session-ended status rendered and not
// dismissible, and the hover at the formerly-occupied pixel showing the refusal rather than an id
// or silence. The kernel's own detection is in the session log on the pre-check route:
// `tile-stream-mint-refused 7:8: engine.source_changed {"detail":"{mtime}"}`.
//
// ----------------------------------------------------------------------------------------------
// HOW S2 GOT HERE, in three failed runs -- read this before editing the precondition.
//
// Runs 1 and 2 (reports `e2e/out/source-changed-1789608089617.json`,
// `...-1789608230988.json`; section 10 Amendment 6) probed a blind centre-anchored grid and found
// nothing, with zero hover/pick lines in the render trace: a synthetic pointer has to land inside a
// feature's own footprint, which a blind grid does not do. Run 3 (`...-1789608771959.json`;
// Amendment 7) took `A9'`'s densest-patch bisection and still failed, verbatim:
//
//   S2: no interior-verified pixel at this camera -- 11/25 neighbourhood pixels touch background
//   (edge-adjacent); bisection levels coarse 8x5: 46.5% -> subdivide 4x4 (level 1): 54.3% ->
//   subdivide 4x4 (level 2): 80.0%
//
// The bisection had worked -- 80% non-background at buffer (1005,141) in a 1280x200 buffer -- but no
// 5x5 fully-covered patch existed anywhere in the frame at the fit-to-bounds camera. That is what
// `A9'`'s ZOOM-NOTCH LOOP exists for, and run 4 takes it (the human's ruling, 2026-09-17, round 9).
//
// ----------------------------------------------------------------------------------------------
// THE PRE-DECLARED FALLBACK (the same ruling, option 2) -- automatic, in the SAME run, never a
// judgement call at run time and never a retry.
//
// If, even with the notch loop, the interior-verified pixel yields no hover answer BEFORE the
// change, this driver takes that pixel as the formerly-occupied point on the read-back evidence
// alone, records `precondition: "formerly occupied, not formerly hovered"` in its report JSON,
// prints the weakening, and proceeds to S3-S5 unchanged. S5c still hovers that pixel after the
// change and still asserts the refusal readout -- not an id, and not silence. The report and this
// header both say which path a given run took; `observation.precondition` is the field to read.
//
// What the weakening costs, stated plainly: on that path the run proves the pixel HELD DRAWN
// GEOMETRY before the change (read back from the drawing buffer, 5x5 interior-verified) but not
// that a hover there ANSWERED before the change. S5c's own assertion is unweakened.
//
// ----------------------------------------------------------------------------------------------
// WHY S4 ASSERTS A QUERY AND NOT A GESTURE (run 4's finding, corrected 2026-09-17).
//
// Run 4 (report `e2e/out/source-changed-1789618409392.json`, section 10 Amendment 8) got the
// precondition RIGHT for the first time -- the notch loop found an interior-verified pixel at notch
// 2 and the hover there answered with an id, so S2 passed on the strong path, not the fallback.
// S3 and S4 passed. Then S5a, S5b and S5c all failed, and the render trace said why:
//
//   82 render-trace entries; the last `viewport_query` is at index 46; the pan begins at index 73;
//   ZERO `viewport_query` lines follow it -- only view-state lines and one residency status.
//
// The tiled arm plans a query only for a covering tile that is not already resident, and at that
// camera every covering tile was ("Showing all 10000 features in view", residentFeatureCount
// 10000), so a 120x80 px pan planned nothing. Every tile stream had also already reached its
// Completed terminal before the mtime touch, so no stream was open to post-check either. Neither
// detection path could fire, and the session log's source-change lines were empty -- a check that
// never ran, not one that ran and found nothing. Those three failures therefore said NOTHING about
// the owner-side code: it was never handed a detection.
//
// Section 4 T10's own words are "trigger one query (a pan)". **The requirement is the QUERY; the
// parenthetical names the gesture.** So S4 now issues a bounded gesture ladder and asserts the
// query: a pan larger than the viewport first (the literal T10 gesture, and what leaves the
// resident cover), then one zoom notch if the tiled arm still plans nothing. Which rung produced
// the query is recorded in `observation.queryProducedBy`. If neither does, the run stops and says
// so rather than inventing a gesture T10 never named. Custodian's decision, recorded as a class-2
// deviation in section 10 Amendment 9 -- a driver defect inside T10's own words, not a change to
// what T10 claims.
//
// A run is bounded and never kills anything it did not start: `attachOrLaunch` attaches to an app
// already on the CDP port and returns `launched: false`, in which case this script leaves it
// running (the sibling policy). A run that PROVES a branch must assert `launched: true`
// (AI_DEVELOPMENT.md, "Launching the app and E2E runs"); this script records `launched` in its
// report and prints it, so the gate can read which kind of run it was rather than assume.
//
// This file is deliberately pure ASCII (AI_DEVELOPMENT.md, "Scripts we write"): scan with
//   Select-String -Path frontends/shell/e2e/source-changed.mjs -Pattern '[^\x00-\x7F]'
// which must print nothing before this is ever launched unattended.

import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, utimesSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  attachOrLaunch,
  attachConsole,
  bufferPointToCss,
  canvasRect,
  CDP_PORT,
  findInteriorCandidate,
  gridRegions,
  MAX_ZOOM_NOTCHES,
  verifyInteriorCandidate,
  waitForSettle,
  zoomInOneNotch,
} from "./lib.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");

// The shared fixture, never opened by this script -- only copied.
const FIXTURE_100K = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture";
// X-4: the scratch copy this run opens and mutates. Under `e2e/out`, which is gitignored.
const SCRATCH_COPY = join(OUT_DIR, "source-changed-scratch.parquet");

// Bounds on waiting, not results (ADR-018). Same shape as every sibling driver.
const MOUNT_READY_TIMEOUT_MS = 120_000;
const STEP_TIMEOUT_MS = 60_000;
// S2's own bound, larger than the others because it is the only step that both waits for a settle
// AND probes a grid of pixels looking for one that shows an id. Raised from the shared 60s after
// the first run of this driver (2026-09-17) timed out here with the settle alone already spent:
// a bound that was too tight, not a product finding -- that run had already read
// 188665 resident vertices through `residentCounts` before the probe began.
const PRECONDITION_TIMEOUT_MS = 180_000;
const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 600_000);

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

/**
 * The running shell app's PID, ExecutablePath and creation time.
 *
 * AI_DEVELOPMENT.md, "Launching the app and E2E runs": "an E2E that proves a branch must assert
 * `launched: true` and record PID, exe path and session log", and "ownership is checked by the
 * process's `ExecutablePath` (or creation time), not its command line" -- the harness spawns the
 * app with a RELATIVE command line, so a worktree-path match on the command line fails for the
 * instance you own. `attachOrLaunch` returns no PID of its own (it holds the `npx tauri dev`
 * wrapper, not the app), so this asks the OS. Best-effort: a failure here is recorded, never fatal.
 */
function appProcesses() {
  try {
    const csv = execFileSync(
      "wmic",
      ["process", "where", "name='spatial-ide-shell.exe'", "get", "ProcessId,ExecutablePath,CreationDate", "/format:csv"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }
    );
    const lines = csv.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
    const header = lines.shift();
    if (!header) return [];
    const cols = header.split(",");
    const iCreated = cols.indexOf("CreationDate");
    const iExe = cols.indexOf("ExecutablePath");
    const iPid = cols.indexOf("ProcessId");
    return lines.map((line) => {
      const parts = line.split(",");
      return { creationDate: parts[iCreated] ?? null, exePath: parts[iExe] ?? null, pid: Number(parts[iPid] ?? NaN) };
    });
  } catch (e) {
    return [{ error: `could not enumerate spatial-ide-shell.exe: ${e.message}` }];
  }
}

/**
 * The app's own session log, READ rather than sized.
 *
 * AI_DEVELOPMENT.md: "A file another process holds open for append shows a STALE size in directory
 * listings ... Never infer 'nothing was written' from a size -- read the content." So this reads the
 * newest `session-*.log` and records its byte length as measured from the CONTENT it actually read,
 * plus a tail, never a `statSync` size.
 */
function newestSessionLog() {
  try {
    const local = process.env.LOCALAPPDATA;
    if (!local) return { error: "LOCALAPPDATA is not set" };
    const dir = join(local, "dev.spatialide.shell", "logs");
    if (!existsSync(dir)) return { error: `no session-log directory at ${dir}` };
    const candidates = readdirSync(dir)
      .filter((n) => /^session-.*\.log$/.test(n))
      .map((n) => ({ name: n, path: join(dir, n), mtimeMs: statSync(join(dir, n)).mtimeMs }))
      .sort((a, b) => b.mtimeMs - a.mtimeMs);
    if (candidates.length === 0) return { error: `no session-*.log in ${dir}` };
    const chosen = candidates[0];
    const content = readFileSync(chosen.path, "utf8");
    const lines = content.split(/\r?\n/).filter((l) => l.length > 0);
    return {
      path: chosen.path,
      bytesReadFromContent: Buffer.byteLength(content),
      lineCount: lines.length,
      tail: lines.slice(-40),
      sourceChangedLines: lines.filter((l) => /source.changed|session-ended|session ended/i.test(l)),
    };
  } catch (e) {
    return { error: `could not read the session log: ${e.message}` };
  }
}

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

/** Mount-readiness gate, the same one `regression.mjs` runs before its first step. */
async function waitForMountReady(page) {
  const start = Date.now();
  let last = null;
  while (Date.now() - start < MOUNT_READY_TIMEOUT_MS) {
    last = await page.evaluate(() => ({
      header: document.querySelector(".app-header")?.textContent ?? null,
      openPath: typeof window.__SPATIAL_E2E__?.openPath === "function",
      residentCounts: typeof window.__SPATIAL_E2E__?.residentCounts === "function",
    }));
    if (last.header !== null && last.openPath && last.residentCounts) {
      return { readyAfterMs: Date.now() - start };
    }
    await sleep(250);
  }
  throw new Error(
    `mount-readiness gate: .app-header, __SPATIAL_E2E__.openPath and __SPATIAL_E2E__.residentCounts ` +
      `were not all present within ${MOUNT_READY_TIMEOUT_MS}ms (last: ${JSON.stringify(last)}). ` +
      `residentCounts absent means the app predates P3b's counts-only hook -- rebuild the shell.`
  );
}

/** `lib.mjs`'s shared `canvasRect` (moved there from `regression.mjs`, byte-identical) returns
 * `null` when the element is absent; every call here wants a throw instead of a silent null, so
 * this is the one-line assert around it -- never a second implementation of the query. */
async function requireCanvasRect(page) {
  const rect = await canvasRect(page);
  if (!rect) throw new Error("no .working-canvas element in the DOM");
  return rect;
}

async function residentCounts(page) {
  return page.evaluate(() => window.__SPATIAL_E2E__.residentCounts());
}

/** The hover readout as the operator would read it: its classes and its text. */
async function hoverReadout(page) {
  return page.evaluate(() => {
    const el = document.querySelector(".hover-readout");
    if (!el) return null;
    return { className: el.className, text: el.textContent ?? "" };
  });
}

async function hoverAt(page, x, y, budgetMs = 6_000) {
  await page.mouse.move(x, y);
  // Settle the pointer: the canvas re-picks on its own schedule, and this waits for the readout
  // to appear rather than assuming one frame is enough. A bound, not a measurement.
  const start = Date.now();
  while (Date.now() - start < budgetMs) {
    const readout = await hoverReadout(page);
    if (readout !== null) return readout;
    await sleep(100);
  }
  return null;
}

function readoutShowsAnId(readout) {
  return readout !== null && /\bid \d/.test(readout.text);
}

/**
 * Pans by MORE than one viewport, as a sequence of full-width drags.
 *
 * One drag cannot exceed the window: the pointer has to stay inside the canvas box, so the largest
 * single displacement is roughly the box's own width. Leaving the already-resident tile cover needs
 * more than that, so this repeats the drag -- each one carrying the map about 80% of a viewport in
 * the same direction -- and reports the total displacement in CSS pixels for the record.
 */
async function panByViewports(page, rect, drags) {
  const y = rect.top + rect.height / 2;
  const fromX = rect.left + rect.width * 0.9;
  const toX = rect.left + rect.width * 0.1;
  for (let i = 0; i < drags; i++) {
    await page.mouse.move(fromX, y);
    await page.mouse.down();
    await page.mouse.move(toX, y, { steps: 10 });
    await page.mouse.up();
  }
  return { drags, cssPixelsPerDrag: Math.round(fromX - toX), totalCssPixels: Math.round((fromX - toX) * drags) };
}

/** How many `viewport_query` lines the render trace carries right now -- S4's own assertion reads
 * this before and after each gesture, because the QUERY is what T10 requires and the gesture is
 * only how it is provoked. */
function viewportQueryCount(consoleHandle) {
  return consoleHandle.renderTrace().filter((e) => /viewport_query/.test(e.text)).length;
}

/** The canvas status stack, split the way an operator reads it. */
async function statusStack(page) {
  return page.evaluate(() => {
    const stack = document.querySelector(".canvas-status-stack");
    const ended = document.querySelector(".canvas-session-ended");
    return {
      stackText: stack?.textContent ?? null,
      sessionEndedPresent: ended !== null,
      code: ended?.querySelector(".admission-refusal-code")?.textContent ?? null,
      message: ended?.querySelector(".admission-refusal-message")?.textContent ?? null,
      guidance: ended?.querySelector(".admission-refusal-guidance")?.textContent ?? null,
      dismissButtons: ended ? ended.querySelectorAll("button").length : null,
    };
  });
}

async function main() {
  const watchdog = setTimeout(() => {
    console.error(
      `source-changed: SPATIAL_E2E_DEADLINE_MS (default ${DEADLINE_MS}) exceeded -- presumed hung, failing loudly`
    );
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE_100K)) {
    console.error(`source-changed: 100k fixture not found: ${FIXTURE_100K}`);
    console.error(`Regenerate the manual-walkthrough fixtures with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    return;
  }

  mkdirSync(OUT_DIR, { recursive: true });
  copyFileSync(FIXTURE_100K, SCRATCH_COPY);
  const hashBefore = sha256(SCRATCH_COPY);

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`source-changed: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL"|"INFO", note: string}>} */
  const results = [];
  /** @type {Record<string, unknown>} */
  const observation = { launched, cdpPort: CDP_PORT, fixture: SCRATCH_COPY, hashBefore };
  // Recorded on every run, whether this one launched or attached, so a gate can read which kind of
  // run it got rather than assume (AI_DEVELOPMENT.md, "Launching the app and E2E runs").
  observation.appProcesses = appProcesses();
  if (!launched) {
    console.warn(
      "source-changed: attached to an app already on the CDP port -- launched:false. A run that PROVES a branch must assert launched:true."
    );
  }

  async function runStep(id, fn, passStatus = "PASS", timeoutMs = STEP_TIMEOUT_MS) {
    try {
      const note = await withTimeout(fn(), timeoutMs, id);
      results.push({ id, status: passStatus, note });
      console.log(`[${id}] ${passStatus}: ${note}`);
      return true;
    } catch (e) {
      const note = e?.message ?? String(e);
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL: ${note}`);
      return false;
    }
  }

  let occupiedPoint = null;

  try {
    console.log(`source-changed: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const ready = await waitForMountReady(page);
    console.log(`source-changed: mount-readiness gate PASSED (after ${ready.readyAfterMs}ms of waiting, a bound not a result)`);

    // ------------------------------------------------------------------------------------
    // S1: open the scratch copy through the real admission path.
    // ------------------------------------------------------------------------------------
    const s1 = await runStep("S1-open", async () => {
      const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), SCRATCH_COPY);
      if (outcome.kind !== "admitted") {
        throw new Error(`S1-open: openPath(scratch copy) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
      }
      return `scratch copy admitted: ${SCRATCH_COPY}`;
    });
    if (!s1) throw new Error("S1-open failed; the rest of the run would be vacuous");

    // ------------------------------------------------------------------------------------
    // S2: settle, and establish the two preconditions the later assertions need to MEAN
    // anything -- that something is actually resident, and that a specific pixel is occupied.
    // Without these, "resident vertices are zero" and "the hover refuses" would both pass on an
    // empty canvas that never held anything.
    // ------------------------------------------------------------------------------------
    const s2 = await runStep("S2-settle-and-precondition", async () => {
      await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
      const counts = await residentCounts(page);
      if (counts === null) throw new Error("S2: residentCounts() returned null -- no dataset admitted");
      if (!(counts.totalResidentVertices > 0)) {
        throw new Error(
          `S2: nothing is resident before the change (totalResidentVertices=${counts.totalResidentVertices}); ` +
            `the later zero assertion would be vacuous`
        );
      }
      observation.residentBefore = counts;

      // **The occupied pixel, found by READ-BACK and not by guessing** -- `A9'`'s full mechanism:
      // the densest-patch bisection, the 5x5 interior verification, AND the zoom-notch loop around
      // both. Runs 1 and 2 of this driver probed a blind centre grid and found nothing; run 3 took
      // the bisection alone and reported "no interior-verified pixel at this camera -- 11/25
      // neighbourhood pixels touch background", which is precisely what the notch loop exists for.
      //
      // The loop's control flow is `stepA9`'s, condition for condition: notch 0 (the CURRENT
      // camera) first, then real wheel zoom-ins up to `MAX_ZOOM_NOTCHES`, re-bisecting and
      // re-verifying against a freshly settled frame each time, with the same early stop on two
      // consecutive frame-wide non-background DECREASES (content leaving the viewport -- zooming
      // further cannot help). `lib.mjs` carries every primitive it calls, byte-identical; see that
      // module's note for why the loop body itself could not be moved as a unit.
      let rect = await requireCanvasRect(page);
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      let bisection = null;
      let verdict = null;
      let notchesUsed = 0;
      let overshootStopped = false;
      let previousNonBackgroundCount = null;
      let declineStreak = 0;
      const notchEvidence = [];

      for (let notch = 0; notch <= MAX_ZOOM_NOTCHES; notch++) {
        let zoomMotion = null;
        let zoomSettled = null;
        if (notch > 0) {
          const zoomResult = await zoomInOneNotch(page, consoleHandle, center);
          zoomMotion = zoomResult.motion;
          zoomSettled = zoomResult.settled;
          rect = await canvasRect(page);
          if (!rect) throw new Error("S2: .working-canvas not found after a zoom notch");
        }
        notchesUsed = notch;

        const grid = await page.evaluate((regions) => window.__SPATIAL_E2E__.capturePixels(regions), gridRegions());
        const nonBackgroundCount = grid.nonBackgroundCount;
        if (previousNonBackgroundCount !== null) {
          declineStreak = nonBackgroundCount < previousNonBackgroundCount ? declineStreak + 1 : 0;
        }
        previousNonBackgroundCount = nonBackgroundCount;

        if (nonBackgroundCount <= 0) {
          notchEvidence.push({ notch, zoomMotion, zoomSettled, nonBackgroundCount, declineStreak, best: "(nothing non-background this notch)" });
          if (declineStreak >= 2) { overshootStopped = true; break; }
          continue;
        }

        const candidate = await findInteriorCandidate(page);
        const candidateVerdict = await verifyInteriorCandidate(page, candidate.candidate, candidate.bufferWidth, candidate.bufferHeight);
        notchEvidence.push({
          notch,
          zoomMotion,
          zoomSettled,
          nonBackgroundCount,
          declineStreak,
          bufferSize: `${candidate.bufferWidth}x${candidate.bufferHeight}`,
          bisectionLevels: candidate.levels.map((l) => `${l.label}: ${(l.fraction * 100).toFixed(1)}%`).join(" -> "),
          best: `buffer(${candidate.candidate.x},${candidate.candidate.y}): ${candidateVerdict.ok ? "OK" : "MISS"} -- ${candidateVerdict.reason}`,
        });
        if (candidateVerdict.ok) {
          bisection = candidate;
          verdict = candidateVerdict;
          break;
        }
        if (declineStreak >= 2) { overshootStopped = true; break; }
      }

      observation.notchEvidence = notchEvidence;
      observation.notchesUsed = notchesUsed;
      observation.overshootStopped = overshootStopped;
      if (!bisection) {
        throw new Error(
          `S2: no interior-verified pixel at ANY notch ${
            overshootStopped
              ? `-- stopped early at notch ${notchesUsed} after 2 consecutive non-background decreases (overshoot)`
              : `after notch 0 plus ${MAX_ZOOM_NOTCHES} zoom-in notch(es)`
          }. Per-notch evidence:\n` +
            notchEvidence.map((e) => `notch ${e.notch} (non-bg=${e.nonBackgroundCount}px, decline=${e.declineStreak}): ${e.best}`).join("\n")
        );
      }
      observation.interiorCandidate = { ...bisection, verdict };

      // The pixel is proven occupied by the read-back above. What the hover adds is a weaker and
      // separate thing: that the pick path ANSWERS at this pixel today, so S5c's "it now refuses"
      // is a real change rather than a pixel that never answered at all.
      //
      // Either answer counts as "the pick path is alive": an id, or the declared
      // below-pick-resolution refusal (`canvas/pickResolution.ts` -- at a wide camera over a
      // 100k-feature fixture the average feature can genuinely sit under the 9 px threshold, and
      // that refusal is the honest answer there, not a miss). What must NOT already be showing is
      // the session-ended refusal, which is what S5c asserts appears only after the change.
      const attempts = [];
      for (const flipY of [true, false]) {
        const css = bufferPointToCss(bisection.candidate, rect, bisection.bufferWidth, bisection.bufferHeight, flipY);
        const readout = await hoverAt(page, css.x, css.y, 5_000);
        attempts.push({ flipY, css, readout });
        if (readout !== null && !readout.className.includes("hover-readout-session-ended")) {
          occupiedPoint = css;
          observation.occupiedPointFlipY = flipY;
          observation.readoutBefore = readout;
          break;
        }
      }
      observation.preconditionAttempts = attempts;

      // **The PRE-DECLARED fallback (the human's ruling, 2026-09-17, round 9 -- option 2).** Not a
      // decision made at run time and not a retry: if the interior-verified pixel yields no hover
      // answer under either row-0 convention, this run takes that pixel as the formerly-occupied
      // point anyway, on the READ-BACK evidence alone, and proceeds. The weakening is named, in the
      // report and on stdout, in the ruling's own words -- "formerly occupied, not formerly
      // hovered" -- and S5c below is unchanged: it still asserts the refusal readout at that
      // pixel after the change, and still rejects both an id and silence.
      if (!occupiedPoint) {
        occupiedPoint = bufferPointToCss(bisection.candidate, rect, bisection.bufferWidth, bisection.bufferHeight, true);
        observation.precondition = "formerly occupied, not formerly hovered";
        observation.occupiedPointFlipY = true;
        observation.readoutBefore = null;
        console.warn(
          "source-changed: PRE-DECLARED FALLBACK taken -- the interior-verified pixel gave no hover answer before " +
            "the change, so it is treated as formerly occupied on the read-back evidence alone. Weakening recorded: " +
            '"formerly occupied, not formerly hovered". S5c still asserts the refusal, not an id and not silence.'
        );
      } else {
        observation.precondition = "formerly occupied AND formerly hovered";
      }
      observation.occupiedPoint = occupiedPoint;

      const kind =
        observation.readoutBefore === null
          ? "no hover answer (fallback path)"
          : readoutShowsAnId(observation.readoutBefore)
            ? "an id"
            : "the below-pick-resolution refusal";
      return (
        `resident before the change: ${counts.totalResidentVertices} vertices / ` +
        `${counts.totalResidentFeatures} features; interior-verified pixel ` +
        `buffer(${bisection.candidate.x},${bisection.candidate.y}) at notch ${notchesUsed} -- ${verdict.reason}; ` +
        `the hover there answers with ${kind}; precondition: ${observation.precondition}`
      );
    }, "PASS", PRECONDITION_TIMEOUT_MS);
    if (!s2) throw new Error("S2 failed; the assertions below would be vacuous");

    // ------------------------------------------------------------------------------------
    // S3: change the source underneath it -- mtime only, bytes untouched.
    // ------------------------------------------------------------------------------------
    await runStep("S3-touch-mtime", async () => {
      const later = new Date(Date.now() + 120_000);
      utimesSync(SCRATCH_COPY, later, later);
      const hashAfterTouch = sha256(SCRATCH_COPY);
      if (hashAfterTouch !== hashBefore) {
        throw new Error(
          `S3: the scratch copy's bytes changed (${hashBefore} -> ${hashAfterTouch}); this mutation must be ` +
            `an mtime touch only (block-on-sight 8)`
        );
      }
      observation.hashAfterTouch = hashAfterTouch;
      return "modification time moved forward; sha256 unchanged, so no byte was edited";
    });

    // ------------------------------------------------------------------------------------
    // S4: one query. A pan is what an operator does; it is also what makes the client issue the
    // next viewport_query, which is where the pre-check refuses (or, on the other route, where
    // the post-check's terminal arrives).
    // ------------------------------------------------------------------------------------
    await runStep("S4-issue-one-query", async () => {
      // **The QUERY is the assertion; the gesture is only recorded** (custodian's decision,
      // 2026-09-17, on run 4). Section 4 T10 says "trigger one query (a pan)": the requirement is
      // the query, and the parenthetical names the gesture that usually provokes it. Run 4 panned
      // 120x80 px inside an already-resident tile cover, the tiled arm planned nothing, and ZERO
      // `viewport_query` lines followed -- so that step asserted a gesture and not what T10
      // declares. This is the correction, inside T10's own words.
      //
      // A bounded ladder, in the order the decision names, stopping at the first rung that produces
      // a query: (1) a pan LARGER THAN THE VIEWPORT, the literal T10 gesture, which is what leaves
      // the resident cover; (2) if the tiled arm still plans nothing, one zoom notch, which
      // re-plans tiles by construction. No third rung: if neither issues a query, the run stops and
      // says so rather than inventing a gesture T10 never named.
      const before = viewportQueryCount(consoleHandle);
      const ladder = [];

      let rect = await requireCanvasRect(page);
      const pan = await panByViewports(page, rect, 2);
      await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 30_000 });
      let after = viewportQueryCount(consoleHandle);
      ladder.push({ rung: "pan-beyond-viewport", ...pan, queriesBefore: before, queriesAfter: after });

      if (after === before) {
        rect = await requireCanvasRect(page);
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        const zoom = await zoomInOneNotch(page, consoleHandle, center);
        await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 30_000 });
        const afterZoom = viewportQueryCount(consoleHandle);
        ladder.push({ rung: "zoom-one-notch", motion: zoom.motion, settled: zoom.settled, queriesBefore: after, queriesAfter: afterZoom });
        after = afterZoom;
      }

      observation.queryLadder = ladder;
      observation.queryProducedBy = after > before ? ladder[ladder.length - 1].rung : null;
      if (after === before) {
        throw new Error(
          `S4: no viewport_query followed any gesture in the ladder, so the detection path was never ` +
            `exercised and S5 below would be vacuous. Ladder: ${JSON.stringify(ladder)}`
        );
      }
      return `a viewport_query followed the "${observation.queryProducedBy}" gesture (${before} -> ${after} in the render trace)`;
    });

    // ------------------------------------------------------------------------------------
    // S5a: the status stack names the state, and no machine PREFIX reaches the operator.
    //
    // What is asserted, precisely: the operator's SENTENCE (`.admission-refusal-message`, and the
    // guidance beside it) contains no `engine.` code at all -- that is the prefix regression
    // disclosure 4(b) named. The typed code itself IS rendered, in its own labelled element
    // (`.admission-refusal-code`), which is the shared refusal block's long-standing shape for
    // every refusal in this app and is not a prefix in front of a sentence.
    // ------------------------------------------------------------------------------------
    await runStep("S5a-status", async () => {
      const status = await statusStack(page);
      observation.status = status;
      if (!status.sessionEndedPresent) {
        throw new Error(`S5a: no .canvas-session-ended block in the status stack; stack text was ${JSON.stringify(status.stackText)}`);
      }
      if (status.message === null) throw new Error("S5a: the session-ended block rendered no .admission-refusal-message");
      if (status.message.includes("engine.")) {
        throw new Error(`S5a: a machine code reached the operator's sentence: ${JSON.stringify(status.message)}`);
      }
      if (status.guidance === null || status.guidance.length === 0) {
        throw new Error("S5a: the session-ended block rendered no guidance; the owner's sentence is what states the consequence");
      }
      if (status.guidance.includes("engine.")) {
        throw new Error(`S5a: a machine code reached the guidance: ${JSON.stringify(status.guidance)}`);
      }
      if (status.dismissButtons !== 0) {
        throw new Error(`S5a: the session-ended block is dismissible (${status.dismissButtons} button(s)); it must not be`);
      }
      return `status shown, not dismissible; code chip ${JSON.stringify(status.code)}; sentence carries no engine. prefix`;
    });

    // ------------------------------------------------------------------------------------
    // S5b: resident vertices are zero. THE assertion this whole script exists for -- the owner
    // having DONE what the sentence above says, not merely said it.
    // ------------------------------------------------------------------------------------
    await runStep("S5b-residency-cleared", async () => {
      const counts = await residentCounts(page);
      if (counts === null) throw new Error("S5b: residentCounts() returned null -- the dataset closed, which is not what this asserts");
      observation.residentAfter = counts;
      if (counts.totalResidentVertices !== 0) {
        throw new Error(
          `S5b: resident vertices are ${counts.totalResidentVertices} (features ${counts.totalResidentFeatures}), expected 0 -- ` +
            `the owner did not clear what it was showing`
        );
      }
      return "resident vertices 0, resident features " + counts.totalResidentFeatures;
    });

    // ------------------------------------------------------------------------------------
    // S5c: a hover over the formerly-occupied pixel yields the refusal, not an id and not
    // silence. Silence is the answer ADR-010 rule 5 forbids here: it would read as "nothing under
    // the cursor", which is a different and false statement.
    // ------------------------------------------------------------------------------------
    await runStep("S5c-picks-refused", async () => {
      const readout = await hoverAt(page, occupiedPoint.x, occupiedPoint.y);
      observation.readoutAfter = readout;
      if (readout === null) {
        throw new Error(
          `S5c: hovering the formerly-occupied pixel (${occupiedPoint.x}, ${occupiedPoint.y}) produced NO readout at all; ` +
            `silence reads as "nothing under the cursor" and is the one answer boundary 4 forbids`
        );
      }
      if (readoutShowsAnId(readout)) {
        throw new Error(`S5c: the hover still names an identity: ${JSON.stringify(readout.text)}`);
      }
      if (!readout.className.includes("hover-readout-session-ended")) {
        throw new Error(
          `S5c: the hover readout is not the session-ended refusal (class ${JSON.stringify(readout.className)}, ` +
            `text ${JSON.stringify(readout.text)})`
        );
      }
      return "hover over the formerly-occupied pixel shows the session-ended refusal, no id";
    });
  } catch (e) {
    results.push({ id: "harness", status: "FAIL", note: e?.stack ?? e?.message ?? String(e) });
    console.error(`source-changed: harness failure: ${e?.stack ?? e?.message ?? String(e)}`);
  } finally {
    // The app's own session log, read (never sized) -- AI_DEVELOPMENT.md's stale-directory-entry
    // finding. Captured here so it lands in the report whether the run passed or failed.
    observation.sessionLog = newestSessionLog();
    observation.appProcessesAtEnd = appProcesses();

    // The fixture hash, after use (section 8.8's "before and after").
    try {
      observation.hashAfter = existsSync(SCRATCH_COPY) ? sha256(SCRATCH_COPY) : null;
      if (observation.hashAfter !== null && observation.hashAfter !== hashBefore) {
        results.push({
          id: "fixture-integrity",
          status: "FAIL",
          note: `the scratch copy's bytes differ from the copy taken at start (${hashBefore} -> ${observation.hashAfter})`,
        });
      } else {
        results.push({ id: "fixture-integrity", status: "PASS", note: `sha256 unchanged across the run: ${hashBefore}` });
      }
    } catch (e) {
      results.push({ id: "fixture-integrity", status: "FAIL", note: `could not re-hash the scratch copy: ${e.message}` });
    }

    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    console.log(`${"Step".padEnd(idWidth)}  Status  Note`);
    console.log(`${"-".repeat(idWidth)}  ------  ${"-".repeat(40)}`);
    for (const r of results) console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(6)}  ${r.note}`);

    const anyFail = results.some((r) => r.status === "FAIL");
    process.exitCode = anyFail ? 1 : 0;

    try {
      const reportPath = join(OUT_DIR, `source-changed-${Date.now()}.json`);
      writeFileSync(
        reportPath,
        JSON.stringify(
          {
            // A single observation, per section 4 T10. No timing field of any kind (ADR-018).
            observation,
            results,
            renderTrace: consoleHandle.renderTrace(),
            allConsoleEntries: consoleHandle.entries,
          },
          null,
          2
        )
      );
      console.log(`Report: ${reportPath}`);
    } catch (e) {
      console.error(`source-changed: failed to write the report: ${e.message}`);
    }

    consoleHandle.dispose();
    await browser.close().catch(() => {});
    console.log(
      launched
        ? `This run LAUNCHED the app; it stays running on CDP port ${CDP_PORT}.`
        : `Attached to an already-running app on CDP port ${CDP_PORT}; leaving it running. A run that PROVES a branch must assert launched:true.`
    );
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
