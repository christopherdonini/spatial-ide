#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- `engine/SOURCE-WATCHER-PREREGISTRATION.md` section 4, case (f),
// the seam from the real shape (addition 4).
//
// WHAT THIS PROVES, and it is exactly one thing: that while the canvas is otherwise IDLE -- no
// pan, no zoom, no query issued by this driver at all -- the OS-level advisory watch this piece
// adds notices a source change on its own, ends the dataset's session over the
// `skp://dataset_session_ended` event, and the RUNNING app clears the resident geometry and
// refuses picks, exactly as `source-changed.mjs`'s pre-check route already proves for a change
// caught by the NEXT query. This driver is the one place that can show the difference: no next
// query is ever issued here.
//
// F0-F3, named after the preregistration's own steps:
//   F0: no NEW `viewport_query` entry in the console recorder after the touch -- proving the
//       event route did the work, not a pre-check this driver never triggers.
//   F1: the session-ended block is present, with no machine prefix.
//   F2: zero resident vertices.
//   F3: a hover at a formerly-occupied pixel is refused.
//
// WHAT IT DOES NOT PROVE. No OS delivery deadline, no latency, no snapshot claim
// (`SOURCE-WATCHER-PREREGISTRATION.md` section 1's "May not claim" list). NO TIMING, ANYWHERE (ADR-018):
// this script records a single observation and no duration -- the millisecond figures below are
// BOUNDS on waiting, never a reported result.
//
// THE FIXTURE (X-4, `source-changed.mjs`'s own precedent, section 3's table). A scratch COPY of the 100k
// manual-walkthrough fixture, copied per run and mutated by an MTIME TOUCH ONLY -- bytes
// untouched, sha256-hashed before and after, and the two hashes must be EQUAL.
//
// THE OCCUPIED-PIXEL SEARCH reuses `lib.mjs`'s own bisection/zoom-notch primitives
// (`findInteriorCandidate`, `verifyInteriorCandidate`, `zoomInOneNotch`), the identical mechanism
// `source-changed.mjs`'s own S2 step established -- carried here rather than reimplemented, per
// that file's own top note ("`lib.mjs` carries every primitive it calls, byte-identical").
//
// ----------------------------------------------------------------------------------------------
// THE RECORDED MUTATION (section 4's own line: "never register the listener; F1 and F2 fail by name").
// Perform it once, on this Windows machine, record the observed failure, then revert -- never
// ship it.
//
//   Mutation: in `src/App.tsx`, delete the `useEffect` that calls `listenDatasetSessionEnded` (the
//   one registered once at mount, right after `endSessionForReason`'s own definition). Rebuild,
//   reload, run this script.
//
//   Expected failure: F1 and F2 fail by name -- with the listener never registered, the
//   `dataset_session_ended` event the kernel still emits reaches no code in this process, so the
//   session never ends while the canvas is idle. `.canvas-session-ended` never appears (F1) and
//   resident vertices stay non-zero (F2). F0 is unaffected (there was never a query to begin
//   with) and would still pass, with no new viewport_query, vacuously.
//
// A run is bounded and never kills anything it did not start (`attachOrLaunch`'s own contract);
// unlike `source-changed.mjs`'s own sibling-run policy, THIS driver always calls `session.stop()`
// before exiting, tearing down an app it launched itself and only disconnecting from one it
// merely attached to -- the piece's own instruction to leave nothing running behind it.
//
// This file is deliberately pure ASCII (AI_DEVELOPMENT.md, "Scripts we write"): scan with
//   Select-String -Path frontends/shell/e2e/source-watch-idle.mjs -Pattern '[^\x00-\x7F]'
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

// The shared fixture, never opened by this script -- only copied. Hardcoded to the main
// checkout's own `target/`, the same path every sibling driver uses regardless of which worktree
// built the app under test (`source-changed.mjs`'s own `FIXTURE_100K`, byte-identical path).
const FIXTURE_100K = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture";
const SCRATCH_COPY = join(OUT_DIR, "source-watch-idle-scratch.parquet");

// Bounds on waiting, not results (ADR-018). Same shape as `source-changed.mjs`.
const MOUNT_READY_TIMEOUT_MS = 120_000;
const STEP_TIMEOUT_MS = 60_000;
const PRECONDITION_TIMEOUT_MS = 180_000;
// The OS notification has no declared deadline (section 1); this is a generous bound on how long this
// driver waits for the idle-route end to show up before it gives up and fails by name -- not a
// claim about when it arrives.
const IDLE_END_WAIT_TIMEOUT_MS = 60_000;
const IDLE_END_POLL_MS = 250;
const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 600_000);

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
}

/** `source-changed.mjs`'s own helper, byte-identical -- see that file's doc comment for why
 * ownership is checked by ExecutablePath/creation time, never the command line. */
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

/** `source-changed.mjs`'s own helper, byte-identical. */
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
      sourceWatchLines: lines.filter((l) => /session ended|session-ended|dataset_session_ended|source.changed|coverage.lost/i.test(l)),
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

/** `source-changed.mjs`'s own mount-readiness gate, byte-identical. */
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
      `were not all present within ${MOUNT_READY_TIMEOUT_MS}ms (last: ${JSON.stringify(last)}).`
  );
}

async function requireCanvasRect(page) {
  const rect = await canvasRect(page);
  if (!rect) throw new Error("no .working-canvas element in the DOM");
  return rect;
}

async function residentCounts(page) {
  return page.evaluate(() => window.__SPATIAL_E2E__.residentCounts());
}

async function hoverReadout(page) {
  return page.evaluate(() => {
    const el = document.querySelector(".hover-readout");
    if (!el) return null;
    return { className: el.className, text: el.textContent ?? "" };
  });
}

async function hoverAt(page, x, y, budgetMs = 6_000) {
  await page.mouse.move(x, y);
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

/** How many `viewport_query` lines the render trace carries right now -- F0's own read. */
function viewportQueryCount(consoleHandle) {
  return consoleHandle.renderTrace().filter((e) => /viewport_query/.test(e.text)).length;
}

/** The canvas status stack, split the way an operator reads it -- `source-changed.mjs`'s own
 * helper, byte-identical. */
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
      `source-watch-idle: SPATIAL_E2E_DEADLINE_MS (default ${DEADLINE_MS}) exceeded -- presumed hung, failing loudly`
    );
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE_100K)) {
    console.error(`source-watch-idle: 100k fixture not found: ${FIXTURE_100K}`);
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
    console.error(`source-watch-idle: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { page, launched } = session;
  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL"|"INFO", note: string}>} */
  const results = [];
  /** @type {Record<string, unknown>} */
  const observation = { launched, cdpPort: CDP_PORT, fixture: SCRATCH_COPY, hashBefore };
  observation.appProcesses = appProcesses();
  if (!launched) {
    console.warn(
      "source-watch-idle: attached to an app already on the CDP port -- launched:false. A run that PROVES a branch must assert launched:true."
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
    console.log(`source-watch-idle: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    await waitForMountReady(page);
    console.log("source-watch-idle: mount-readiness gate PASSED");

    // ------------------------------------------------------------------------------------
    // W1: open the scratch copy through the real admission path.
    // ------------------------------------------------------------------------------------
    const w1 = await runStep("W1-open", async () => {
      const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), SCRATCH_COPY);
      if (outcome.kind !== "admitted") {
        throw new Error(`W1-open: openPath(scratch copy) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
      }
      return `scratch copy admitted: ${SCRATCH_COPY}`;
    });
    if (!w1) throw new Error("W1-open failed; the rest of the run would be vacuous");

    // ------------------------------------------------------------------------------------
    // W2: settle, and establish the preconditions F1-F3 need to MEAN anything -- something is
    // resident, and a specific pixel is occupied. Reuses `source-changed.mjs`'s own bisection +
    // zoom-notch mechanism (`lib.mjs`'s primitives), without that file's own before/after hover
    // comparison -- this driver only needs an occupied point to hover AFTER the change (F3).
    // ------------------------------------------------------------------------------------
    const w2 = await runStep("W2-settle-and-precondition", async () => {
      await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
      const counts = await residentCounts(page);
      if (counts === null) throw new Error("W2: residentCounts() returned null -- no dataset admitted");
      if (!(counts.totalResidentVertices > 0)) {
        throw new Error(
          `W2: nothing is resident before the change (totalResidentVertices=${counts.totalResidentVertices}); ` +
            `the later zero assertion (F2) would be vacuous`
        );
      }
      observation.residentBefore = counts;

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
          if (!rect) throw new Error("W2: .working-canvas not found after a zoom notch");
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
          `W2: no interior-verified pixel at ANY notch ${
            overshootStopped
              ? `-- stopped early at notch ${notchesUsed} after 2 consecutive non-background decreases (overshoot)`
              : `after notch 0 plus ${MAX_ZOOM_NOTCHES} zoom-in notch(es)`
          }. Per-notch evidence:\n` +
            notchEvidence.map((e) => `notch ${e.notch} (non-bg=${e.nonBackgroundCount}px, decline=${e.declineStreak}): ${e.best}`).join("\n")
        );
      }
      observation.interiorCandidate = { ...bisection, verdict };
      occupiedPoint = bufferPointToCss(bisection.candidate, rect, bisection.bufferWidth, bisection.bufferHeight, true);
      observation.occupiedPoint = occupiedPoint;

      return (
        `resident before the change: ${counts.totalResidentVertices} vertices / ` +
        `${counts.totalResidentFeatures} features; interior-verified pixel ` +
        `buffer(${bisection.candidate.x},${bisection.candidate.y}) at notch ${notchesUsed} -- ${verdict.reason}`
      );
    }, "PASS", PRECONDITION_TIMEOUT_MS);
    if (!w2) throw new Error("W2 failed; F0-F3 below would be vacuous");

    // ------------------------------------------------------------------------------------
    // W3: touch the source's mtime ONLY, while the canvas is otherwise idle -- no pan, no zoom,
    // no query issued by this driver from here on. This is the whole point of case (f): nothing
    // below asks the kernel anything until F3's own hover, which is a pick, never a query.
    // ------------------------------------------------------------------------------------
    const viewportQueryCountBeforeTouch = viewportQueryCount(consoleHandle);
    observation.viewportQueryCountBeforeTouch = viewportQueryCountBeforeTouch;
    const sessionLogBaselineLineCount = newestSessionLog().lineCount ?? 0;
    observation.sessionLogBaselineLineCount = sessionLogBaselineLineCount;

    const w3 = await runStep("W3-touch-mtime-while-idle", async () => {
      const later = new Date(Date.now() + 120_000);
      utimesSync(SCRATCH_COPY, later, later);
      const hashAfterTouch = sha256(SCRATCH_COPY);
      if (hashAfterTouch !== hashBefore) {
        throw new Error(
          `W3: the scratch copy's bytes changed (${hashBefore} -> ${hashAfterTouch}); this mutation must be ` +
            `an mtime touch only (block-on-sight 8)`
        );
      }
      observation.hashAfterTouch = hashAfterTouch;
      return "modification time moved forward while idle; sha256 unchanged, so no byte was edited";
    });
    if (!w3) throw new Error("W3 failed; F0-F3 below would be vacuous");

    // ------------------------------------------------------------------------------------
    // W4: wait for the idle-route end to show up, bounded (ADR-018: a bound, not a claim about
    // when the OS notification arrives). Polls the status stack rather than the session log, so
    // the wait ends the instant the operator-visible state is actually there.
    // ------------------------------------------------------------------------------------
    const w4 = await runStep(
      "W4-wait-for-idle-end",
      async () => {
        const start = Date.now();
        let last = null;
        while (Date.now() - start < IDLE_END_WAIT_TIMEOUT_MS) {
          last = await statusStack(page);
          if (last.sessionEndedPresent) {
            return ".canvas-session-ended appeared";
          }
          await sleep(IDLE_END_POLL_MS);
        }
        throw new Error(
          `W4: .canvas-session-ended did not appear within ${IDLE_END_WAIT_TIMEOUT_MS}ms of the idle touch ` +
            `(last status: ${JSON.stringify(last)}) -- either the watch never fired, or the listener never reached App.tsx`
        );
      },
      "PASS",
      IDLE_END_WAIT_TIMEOUT_MS + 5_000
    );
    if (!w4) throw new Error("W4 failed; F1-F3 below would be vacuous, and F0 alone would not prove case (f)");

    // ------------------------------------------------------------------------------------
    // F0: no NEW viewport_query entry followed the touch -- the event route did the work, not a
    // pre-check this driver never triggered. Proves the idle claim itself, not only that the
    // session ended somehow.
    // ------------------------------------------------------------------------------------
    await runStep("F0-no-new-viewport-query", async () => {
      const after = viewportQueryCount(consoleHandle);
      observation.viewportQueryCountAfter = after;
      if (after !== viewportQueryCountBeforeTouch) {
        throw new Error(
          `F0: viewport_query count changed (${viewportQueryCountBeforeTouch} -> ${after}) after the idle touch -- ` +
            `this driver issued no query, so a new one means the event route was not what ended the session`
        );
      }
      return `viewport_query count unchanged at ${after} -- the event route ended the session, not a re-issued query`;
    });

    // ------------------------------------------------------------------------------------
    // F1: the status stack names the state, and no machine PREFIX reaches the operator --
    // `source-changed.mjs`'s own S5a, unchanged.
    // ------------------------------------------------------------------------------------
    await runStep("F1-status", async () => {
      const status = await statusStack(page);
      observation.status = status;
      if (!status.sessionEndedPresent) {
        throw new Error(`F1: no .canvas-session-ended block in the status stack; stack text was ${JSON.stringify(status.stackText)}`);
      }
      if (status.message === null) throw new Error("F1: the session-ended block rendered no .admission-refusal-message");
      if (status.message.includes("engine.")) {
        throw new Error(`F1: a machine code reached the operator's sentence: ${JSON.stringify(status.message)}`);
      }
      if (status.guidance === null || status.guidance.length === 0) {
        throw new Error("F1: the session-ended block rendered no guidance; the owner's sentence is what states the consequence");
      }
      if (status.guidance.includes("engine.")) {
        throw new Error(`F1: a machine code reached the guidance: ${JSON.stringify(status.guidance)}`);
      }
      if (status.dismissButtons !== 0) {
        throw new Error(`F1: the session-ended block is dismissible (${status.dismissButtons} button(s)); it must not be`);
      }
      return `status shown, not dismissible; code chip ${JSON.stringify(status.code)}; sentence carries no engine. prefix`;
    });

    // ------------------------------------------------------------------------------------
    // F2: resident vertices are zero -- the owner having DONE what the sentence says.
    // ------------------------------------------------------------------------------------
    await runStep("F2-residency-cleared", async () => {
      const counts = await residentCounts(page);
      if (counts === null) throw new Error("F2: residentCounts() returned null -- the dataset closed, which is not what this asserts");
      observation.residentAfter = counts;
      if (counts.totalResidentVertices !== 0) {
        throw new Error(
          `F2: resident vertices are ${counts.totalResidentVertices} (features ${counts.totalResidentFeatures}), expected 0 -- ` +
            `the owner did not clear what it was showing`
        );
      }
      return "resident vertices 0, resident features " + counts.totalResidentFeatures;
    });

    // ------------------------------------------------------------------------------------
    // F3: a hover over the formerly-occupied pixel yields the refusal, not an id and not silence.
    // ------------------------------------------------------------------------------------
    await runStep("F3-picks-refused", async () => {
      const readout = await hoverAt(page, occupiedPoint.x, occupiedPoint.y);
      observation.readoutAfter = readout;
      if (readout === null) {
        throw new Error(
          `F3: hovering the formerly-occupied pixel (${occupiedPoint.x}, ${occupiedPoint.y}) produced NO readout at all; ` +
            `silence reads as "nothing under the cursor" and is the one answer boundary 4 forbids`
        );
      }
      if (readoutShowsAnId(readout)) {
        throw new Error(`F3: the hover still names an identity: ${JSON.stringify(readout.text)}`);
      }
      if (!readout.className.includes("hover-readout-session-ended")) {
        throw new Error(
          `F3: the hover readout is not the session-ended refusal (class ${JSON.stringify(readout.className)}, ` +
            `text ${JSON.stringify(readout.text)})`
        );
      }
      return "hover over the formerly-occupied pixel shows the session-ended refusal, no id";
    });
  } catch (e) {
    results.push({ id: "harness", status: "FAIL", note: e?.stack ?? e?.message ?? String(e) });
    console.error(`source-watch-idle: harness failure: ${e?.stack ?? e?.message ?? String(e)}`);
  } finally {
    observation.sessionLog = newestSessionLog();
    observation.appProcessesAtEnd = appProcesses();

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
      const reportPath = join(OUT_DIR, `source-watch-idle-${Date.now()}.json`);
      writeFileSync(
        reportPath,
        JSON.stringify(
          {
            // A single observation, per case (f). No timing field of any kind (ADR-018).
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
      console.error(`source-watch-idle: failed to write the report: ${e.message}`);
    }

    consoleHandle.dispose();
    // Unlike `source-changed.mjs`'s own sibling-run policy, this driver ALWAYS tears down a
    // session it launched itself, and only disconnects from one it merely attached to -- the
    // piece's own instruction to leave no app, driver or probe process behind it.
    await session.stop().catch(() => {});
    console.log(
      launched
        ? `This run LAUNCHED the app and has now torn it down (session.stop()); nothing was left running.`
        : `Attached to an already-running app on CDP port ${CDP_PORT}; disconnected without touching a process this run did not start.`
    );
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
