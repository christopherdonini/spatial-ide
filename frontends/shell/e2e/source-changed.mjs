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
// A run is bounded and never kills anything it did not start: `attachOrLaunch` attaches to an app
// already on the CDP port and returns `launched: false`, in which case this script leaves it
// running (the sibling policy). A run that PROVES a branch must assert `launched: true`
// (AI_DEVELOPMENT.md, "Launching the app and E2E runs"); this script records `launched` in its
// report and prints it, so the gate can read which kind of run it was rather than assume.
//
// This file is deliberately pure ASCII (AI_DEVELOPMENT.md, "Scripts we write"): scan with
//   Select-String -Path frontends/shell/e2e/source-changed.mjs -Pattern '[^\x00-\x7F]'
// which must print nothing before this is ever launched unattended.

import { copyFileSync, existsSync, mkdirSync, readFileSync, utimesSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");

// The shared fixture, never opened by this script -- only copied.
const FIXTURE_100K = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture";
// X-4: the scratch copy this run opens and mutates. Under `e2e/out`, which is gitignored.
const SCRATCH_COPY = join(OUT_DIR, "source-changed-scratch.parquet");

// Bounds on waiting, not results (ADR-018). Same shape as every sibling driver.
const MOUNT_READY_TIMEOUT_MS = 120_000;
const STEP_TIMEOUT_MS = 60_000;
const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 600_000);

function sha256(path) {
  return createHash("sha256").update(readFileSync(path)).digest("hex");
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

async function canvasRect(page) {
  const rect = await page.evaluate(() => {
    const el = document.querySelector(".working-canvas");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });
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

async function hoverAt(page, x, y) {
  await page.mouse.move(x, y);
  // Settle the pointer: the canvas re-picks on its own schedule, and this waits for the readout
  // to appear rather than assuming one frame is enough. A bound, not a measurement.
  const start = Date.now();
  while (Date.now() - start < 6_000) {
    const readout = await hoverReadout(page);
    if (readout !== null) return readout;
    await sleep(100);
  }
  return null;
}

function readoutShowsAnId(readout) {
  return readout !== null && /\bid \d/.test(readout.text);
}

async function doPan(page, rect, dx, dy) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + dx, cy + dy, { steps: 8 });
  await page.mouse.up();
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

  async function runStep(id, fn, passStatus = "PASS") {
    try {
      const note = await withTimeout(fn(), STEP_TIMEOUT_MS, id);
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

      // Find a pixel that really is occupied, by observing an id there -- never by assuming the
      // centre is over data. A small grid around the centre, first hit wins.
      const rect = await canvasRect(page);
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const offsets = [0, 40, -40, 80, -80, 120, -120];
      const attempts = [];
      for (const dx of offsets) {
        for (const dy of offsets) {
          const point = { x: cx + dx, y: cy + dy };
          const readout = await hoverAt(page, point.x, point.y);
          attempts.push({ point, readout });
          if (readoutShowsAnId(readout)) {
            occupiedPoint = point;
            break;
          }
        }
        if (occupiedPoint) break;
      }
      if (!occupiedPoint) {
        throw new Error(
          `S2: no pixel among ${attempts.length} tried around the canvas centre yielded a hover id, so ` +
            `"a formerly-occupied pixel" cannot be established; last readout: ${JSON.stringify(attempts.at(-1)?.readout)}`
        );
      }
      observation.occupiedPoint = occupiedPoint;
      return (
        `resident before the change: ${counts.totalResidentVertices} vertices / ` +
        `${counts.totalResidentFeatures} features; an id is shown at (${occupiedPoint.x}, ${occupiedPoint.y})`
      );
    });
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
    await runStep("S4-pan", async () => {
      const rect = await canvasRect(page);
      await doPan(page, rect, 120, 80);
      await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 30_000 });
      return "one pan issued; render trace quiet again";
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
