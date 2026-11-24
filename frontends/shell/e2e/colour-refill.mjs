#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (COLOUR-BY-REFILL-KEEPS-THE-VIEW-PREREGISTRATION.md section 4, OPEN-3 (a)): E-RK1, on real WebView2, run as `node e2e/colour-refill.mjs` from frontends/shell.
// The fixture is `colour-refill-300k.parquet` (300,000 features, `AttributeMode::MultiType`), made by
//   cargo test --locked -p spatial-kernel --test manual_walkthrough_fixtures generate_the_colour_refill_fixture -- --ignored --nocapture
// into this checkout's target/fixtures/manual-walkthrough; `--fixture <path>` names another copy of the same file. The app's store is a scratch LOCALAPPDATA (as colour.mjs). The session log is read from the app's own log folder (Tauri's `app_log_dir()`, under the profile's Local AppData), which does not follow that variable.
//
// Steps: open the fixture through `openPath` (the suites' own open); wait for the open's first look to plan (the first `candidate-first-look-view-planned` session-log line);
// zoom out by the mouse wheel, one notch at a time, until `.attributes-not-held` stands; pan by pointer to a view away from the fit; Colour by `zone` through the Style tab.
// Preconditions (else VOID, exit 2): the not-held status stands within the zoom budget; the view before the Colour by differs from the open's fitted view by more than a pixel's world span;
//   no wheel or pointer event reaches the canvas from the Colour by until the planned line is read; the canvas's client size is the same at the pre-view and at the planned line.
// Asserts (exit 1 when any fails):
//   (a) the first `candidate-first-look-view-planned` line written after the Colour by has a box equal, within a pixel's world span (1 / 2^zoom), to the box computed from the
//       last `view-state` render-trace line before the Colour by (`traceViewState`, WorkingCanvas.tsx, written at each gesture) at the canvas's client size;
//   (b) the resident feature count (`residentCounts`, the counts-only hook) once the render trace is quiet after the plan exceeds the first look's 10,000 rows;
//   (c) `.attributes-not-held` still stands.
// Page members called: `window.__SPATIAL_E2E__.openPath` and `residentCounts` (a counts-only read); the rest is DOM reads and input through the Playwright page. No DEV-only hook that acts is used beyond the open.
// What this does not prove: any docs/08 figure, macOS or Linux, a file other than this fixture, or a timing. Waits are harness bounds on readiness (ADR-018), not measurements.
// Recorded: the zoom steps taken, the generator's feature count (restated, not read from the file), the fixture's sha256, the boxes and the client sizes.
import { createHash } from "node:crypto";
import { existsSync, mkdtempSync, readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const TEMP_BASE = realpathSync.native(tmpdir());
const SCRATCH = mkdtempSync(join(TEMP_BASE, "spatial-colour-refill-"));
const PROFILE_LOCALAPPDATA = process.env.LOCALAPPDATA;
process.env.LOCALAPPDATA = SCRATCH;
const LOG_DIR = PROFILE_LOCALAPPDATA ? join(PROFILE_LOCALAPPDATA, "dev.spatialide.shell", "logs") : null;
let LAUNCH_MS = 0;

const { newestSessionLogSinceLaunch } = await import("./residencyTrace.mjs");
const { attachOrLaunch, attachConsole, waitForSettle, canvasRect, doWheel, CDP_PORT } = await import("./lib.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const fixtureAt = argv.indexOf("--fixture");
const FIXTURE = fixtureAt !== -1 ? argv[fixtureAt + 1] : join(HERE, "..", "..", "..", "target", "fixtures", "manual-walkthrough", "colour-refill-300k.parquet");
const FEATURES = 300_000; // the generator's FEATURES (kernel/tests/manual_walkthrough_fixtures.rs), restated: an e2e module imports no product constant
const FIRST_LOOK_ROWS = 10_000; // UNTILED_FIRST_LOOK_ROW_LIMIT (src/canvas/tileGridConstants.ts), restated
const COLUMN = "zone";
const MAX_ZOOM_OUT_NOTCHES = 15; // a harness bound; the not-held status is the stop
const ZOOM_OUT_DELTA_Y = 300; // one zoom-out wheel notch: lib.mjs's ZOOM_NOTCH_DELTA_Y, the other way
const PAN_PX = 120; // CSS px of pointer travel, in 12 steps
const MOUNT_READY_TIMEOUT_MS = 90_000;
const PLANNED_TIMEOUT_MS = 120_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
class Void extends Error {}
const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ::  ${detail}`);
}

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
  throw new Void(`waited ${timeoutMs}ms for ${what}; the last reading was ${JSON.stringify(last)}`);
}

const settle = async (consoleHandle, what, quietMs = 2000) => {
  const outcome = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs, timeoutMs: 120_000 });
  if (!outcome.settled) throw new Void(`the render trace was not quiet for ${quietMs}ms within 120000ms (${what})`);
};

/** The path of the newest session log THIS launch created, in the app's own log folder under the profile's Local AppData (the scratch folder holds the store only); null when none. */
function sessionLogPath() {
  if (!LOG_DIR || !existsSync(LOG_DIR)) return null;
  const listing = readdirSync(LOG_DIR).map((name) => ({ name, mtimeMs: statSync(join(LOG_DIR, name)).mtimeMs }));
  const name = newestSessionLogSinceLaunch(listing, LAUNCH_MS);
  return name === null ? null : join(LOG_DIR, name);
}
/** The lines of the session log THIS launch created (see `sessionLogPath`); `[]` when none. */
function sessionLogLines() {
  const p = sessionLogPath();
  return p === null ? [] : readFileSync(p, "utf8").split("\n");
}
/** The `candidate-first-look-view-planned` lines, in file order: { box } (the line is `<ms> candidate-first-look-view-planned {xmin:..,ymin:..,xmax:..,ymax:..}`). */
function plannedLines() {
  const out = [];
  for (const line of sessionLogLines()) {
    const m = /^\d+ candidate-first-look-view-planned \{xmin:(\S+),ymin:(\S+),xmax:(\S+),ymax:(\S+)\}$/.exec(line);
    if (m) out.push({ xmin: Number(m[1]), ymin: Number(m[2]), xmax: Number(m[3]), ymax: Number(m[4]) });
  }
  return out;
}

const lastViewState = (consoleHandle) => {
  let last = null;
  for (const e of consoleHandle.renderTrace()) {
    const m = /view-state \{targetX: (\S+), targetY: (\S+), zoom: (\S+), originX: (\S+), originY: (\S+)\}/.exec(e.text);
    if (m) last = { targetX: Number(m[1]), targetY: Number(m[2]), zoom: Number(m[3]), originX: Number(m[4]), originY: Number(m[5]) };
  }
  return last;
};
/** The box a view shows at a client size: viewportBbox.ts's computeAuthoritativeViewportBbox, restated (centre = target + origin, 2^zoom px per metre). */
const boxOf = (v, size) => {
  const [cx, cy, s] = [v.targetX + v.originX, v.targetY + v.originY, 2 ** v.zoom];
  return { xmin: cx - size.w / 2 / s, ymin: cy - size.h / 2 / s, xmax: cx + size.w / 2 / s, ymax: cy + size.h / 2 / s };
};
const maxEdgeDiff = (a, b) => Math.max(Math.abs(a.xmin - b.xmin), Math.abs(a.ymin - b.ymin), Math.abs(a.xmax - b.xmax), Math.abs(a.ymax - b.ymax));
const clientSize = (page) => page.evaluate(() => { const el = document.querySelector(".working-canvas"); return el ? { w: el.clientWidth, h: el.clientHeight } : null; });
const notHeld = (page) => page.evaluate(() => document.querySelector(".attributes-not-held") !== null);
const residentFeatures = (page) => page.evaluate(async () => (await window.__SPATIAL_E2E__.residentCounts())?.totalResidentFeatures ?? 0);
const fmt = (b) => `{xmin:${b.xmin},ymin:${b.ymin},xmax:${b.xmax},ymax:${b.ymax}}`;

async function run(page, consoleHandle) {
  await waitFor("the app header and the openPath hook", () => page.evaluate(() => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function"), (r) => r === true, MOUNT_READY_TIMEOUT_MS, 300);
  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  if (opened?.kind !== "admitted") throw new Void(`openPath did not admit the fixture: ${JSON.stringify(opened)}`);
  // The open's first look plans (the same line the refill writes, so the count before the Colour by is kept).
  await waitFor("the open's first look to plan", () => plannedLines().length, (n) => n >= 1, PLANNED_TIMEOUT_MS, 500);
  await settle(consoleHandle, "after the open's first look");
  const fitView = lastViewState(consoleHandle);
  const fitSize = await clientSize(page);
  if (!fitView || !fitSize) throw new Void("no view-state line, or no .working-canvas, after the open");
  const fitBox = boxOf(fitView, fitSize);

  // Zoom out by the wheel, one notch at a time, until the not-held status stands.
  const rect = await canvasRect(page);
  const centre = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  let steps = 0;
  while (!(await notHeld(page)) && steps < MAX_ZOOM_OUT_NOTCHES) {
    await doWheel(page, centre, ZOOM_OUT_DELTA_Y);
    steps += 1;
    await settle(consoleHandle, `after zoom-out notch ${steps}`, 1500);
  }
  const standing = await notHeld(page);
  console.log(`zoom-out notches taken: ${steps}; the generator's feature count (restated, not read from the file): ${FEATURES}; the not-held status stands: ${standing}`);
  if (!standing) throw new Void(`the not-held status does not stand after ${steps} zoom-out notches: the fixture cannot reach the fact (stop I5)`);

  // Pan by pointer to a view away from the fit.
  await page.mouse.move(centre.x, centre.y);
  await page.mouse.down();
  for (let i = 1; i <= 12; i++) await page.mouse.move(centre.x + (PAN_PX * i) / 12, centre.y + (PAN_PX * i) / 24);
  await page.mouse.up();
  await settle(consoleHandle, "after the pan");

  // The pre-view, and the instruments: input listeners on the canvas count what reaches it from here on.
  await page.evaluate(() => {
    window.__rk1Inputs = 0;
    const el = document.querySelector(".working-canvas");
    for (const type of ["wheel", "pointerdown", "pointerup", "pointermove"]) el.addEventListener(type, () => { window.__rk1Inputs += 1; }, true);
  });
  const preView = lastViewState(consoleHandle);
  const preSize = await clientSize(page);
  const preBox = boxOf(preView, preSize);
  const span = 1 / 2 ** preView.zoom;
  const away = maxEdgeDiff(preBox, fitBox);
  console.log(`fit box ${fmt(fitBox)} at ${JSON.stringify(fitSize)}; pre-view box ${fmt(preBox)} at ${JSON.stringify(preSize)}; a pixel's world span ${span}; the pre-view differs from the fit by ${away}`);
  if (!(away > span)) throw new Void("the pre-view does not differ from the open's fitted view by more than a pixel's world span");
  const plannedBefore = plannedLines().length;
  const hashBefore = sha256(FIXTURE);

  // Colour by `zone` through the Style tab's own controls. The inspector's buttons are not on the canvas.
  await page.click("#inspector-tab-style");
  if (!(await page.evaluate(() => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded") === "true"))) await page.click(".style-disclosure");
  await waitFor(`the column choice ${COLUMN}`, () => page.evaluate((c) => [...document.querySelectorAll("select.style-colour-column option")].some((o) => o.value === c), COLUMN), (p) => p, 30_000);
  await page.selectOption("select.style-colour-column", COLUMN);
  await page.click("button.style-colour-apply");

  // The first planned line after the Colour by.
  await waitFor("the first candidate-first-look-view-planned line after the Colour by", () => plannedLines().length, (n) => n > plannedBefore, PLANNED_TIMEOUT_MS, 300);
  const planned = plannedLines()[plannedBefore];
  const plannedSize = await clientSize(page);
  const inputs = await page.evaluate(() => window.__rk1Inputs);
  if (inputs !== 0) throw new Void(`${inputs} input event(s) reached the canvas between the Colour by and the planned line`);
  if (!plannedSize || plannedSize.w !== preSize.w || plannedSize.h !== preSize.h) throw new Void(`the canvas's client size changed from ${JSON.stringify(preSize)} to ${JSON.stringify(plannedSize)}`);
  console.log(`planned box ${fmt(planned)} at ${JSON.stringify(plannedSize)}; the pre-view box ${fmt(preBox)} at ${JSON.stringify(preSize)}`);

  // RECORDED MUTATION M-A1 (the form's register, Amendment 2 item 3): in the Colour-by effect (App.tsx) drop the `{ keepCamera: true }` fourth argument. Expected failure: (a), the planned box
  // is the refitted view, not the pre-view; RK-A1 fails with it. Observed by the tester's run against a build with M-A1 applied, recorded in the series report, not here.
  const diff = maxEdgeDiff(planned, preBox);
  record("(a) the planned box after the Colour by equals the view shown before it, within a pixel's world span", diff <= span, `largest edge difference ${diff} against a pixel's world span ${span}`);

  await settle(consoleHandle, "after the plan");
  const resident = await residentFeatures(page);
  record(`(b) the resident feature count after the plan exceeds the first look's ${FIRST_LOOK_ROWS}`, resident > FIRST_LOOK_ROWS, `resident ${resident}`);
  record("(c) the not-held status still stands", await notHeld(page), "the .attributes-not-held element is mounted");
  const hashAfter = sha256(FIXTURE);
  if (hashAfter !== hashBefore) throw new Void(`the fixture's sha256 changed during the run: ${hashBefore} -> ${hashAfter}`);
  console.log(`fixture sha256 ${hashAfter} (unchanged)`);
}

async function main() {
  if (!existsSync(FIXTURE)) {
    console.error(`colour-refill: fixture missing: ${FIXTURE}\nRegenerate with: cargo test --locked -p spatial-kernel --test manual_walkthrough_fixtures generate_the_colour_refill_fixture -- --ignored --nocapture`);
    process.exit(2);
  }
  if (LOG_DIR === null) {
    console.error("colour-refill: the app's log folder cannot be found: LOCALAPPDATA is not set in this environment.");
    process.exit(2);
  }
  console.log(`colour-refill: fixture ${FIXTURE} sha256 ${sha256(FIXTURE)}; LOCALAPPDATA=${SCRATCH}; session logs read from ${LOG_DIR}`);
  LAUNCH_MS = Date.now();
  const session = await attachOrLaunch();
  if (!session.launched) {
    console.error(`colour-refill: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA; stop it and run again.`);
    await session.browser.close().catch(() => {});
    process.exit(2);
  }
  const consoleHandle = attachConsole(session.page);
  let voided = null;
  try {
    await run(session.page, consoleHandle);
  } catch (e) {
    if (!(e instanceof Void)) { console.error("colour-refill.mjs fatal:", e?.stack ?? e); voided = `fatal: ${e?.message ?? e}`; } else voided = e.message;
  } finally {
    consoleHandle.dispose();
    await session.stop().catch(() => {});
    console.log(`the scratch store is kept: ${SCRATCH}; the session log read: ${sessionLogPath() ?? "none"}`);
  }
  if (voided) { console.log(`\nVOID  ${voided} -- not a PASS (checks recorded before it: ${results.length})`); process.exit(2); }
  const failed = results.filter((r) => !r.ok);
  console.log(`\n==== ${results.length - failed.length}/${results.length} PASS ====`);
  if (failed.length) { console.log("FAILED:", failed.map((f) => f.name).join("; ")); process.exit(1); }
  process.exit(0);
}

await main();
