#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- viewport-residency cut P1/P1b, the measurement harness.
// RESIDENCY-PREREGISTRATION.md is this file's ENTIRE spec (§4b the camera trace, §6 instruments/
// quantities, §7 watchdogs, §8 standing rules). Same attach-or-launch path as every sibling suite
// (`lib.mjs`'s `attachOrLaunch`), same in-page hooks pattern (`src/e2e-test-surface.ts`), same
// mount-readiness gate duplicated per this workspace's own sibling-file convention
// (`admission-remediation.mjs`'s own top comment: "CUT-STATE.md's Rust integration tests duplicate
// rather than cross-import for the identical reason").
//
// **This piece MEASURES. It does not SCORE.** No budget comparison, no gate verdict, no G1-G7
// pass/fail anywhere in this file -- every evidence file this driver writes is a flat record of what
// was observed, for a later piece (P2 baseline / P6 tester) to score against RESIDENCY-
// PREREGISTRATION.md §2d's gates.
//
// **Camera control: real synthetic pointer/wheel gestures over `.working-canvas`, not a
// programmatic view-state hook.** This is a disclosed engineering choice, not a preregistration
// requirement: it drives the EXACT SAME deck.gl controller code path a real operator's drag/scroll
// would (no new product-code seam needed for camera control at all -- lower risk for a piece whose
// defining constraint is zero product-behavior change), at the cost of two approximations flagged
// here and in this piece's own report for a later piece to calibrate against a live app:
//   1. Zoom steps ("x2 magnification") use a fixed wheel-delta constant (`ZOOM_WHEEL_DELTA` below)
//      -- deck.gl/mjolnir.js's own wheel-to-zoom-factor mapping was not empirically calibrated
//      within this piece's own scope, so the resulting zoom factor is approximate, not exactly x2.
//   2. Pan direction's screen-to-world mapping (`PAN_SCREEN_DELTA` below) assumes north-is-up-on-
//      -screen in this fixture's stored CRS; not verified against a live render.
//
// **Settle criterion (P1b, M6): BOTH console quiescence AND in-flight === 0 (§4b's own letter --
// "zero in-flight viewport_query streams remain").** P1's own version of this driver used console
// quiescence ALONE as a proxy for both halves of §4b's criterion; `waitForSettleWithInFlight` below
// now ALSO polls `residencyInFlightStreamCount` (a real, driver-visible counter,
// `residencyInstrument.ts`'s own M6 fix) and requires it to read `0` before declaring a step settled.
// **Disclosed limitation, carried forward from P1's own choice:** the in-flight counter is gated by
// the residency instrument's `enabled` flag (S3: "no-op when off," the same discipline every other
// instrument mutator follows) -- in `--control` mode the counter always reads `0`, so a control-arm
// step's settle decision still rests on console quiescence alone. This is disclosed here and in this
// piece's own report, not silently narrowed.

import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";
import {
  CAMERA_TRACE_STEPS,
  percentileNearestRank,
  SETTLE_QUIET_MS,
  TRACE_VERSION,
  TRIAL_WATCHDOG_MS,
} from "./residencyTrace.mjs";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(SHELL_DIR, "e2e", "out");
const MOUNT_READY_TIMEOUT_MS = 90_000;

const FIXTURE_FILTER_ZONED = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_FILTER_ZONED =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_zoned_fixture -- --ignored --nocapture";

// Disclosed approximations -- see this file's own top comment.
const ZOOM_WHEEL_DELTA = -1200; // negative deltaY == "scroll up" == zoom in, in deck.gl's default wheel handling
const ZOOM_OUT_WHEEL_DELTA = 1200;

// M13: a constant, stated honestly, carried into every evidence file's own `cell.buildClass`.
const BUILD_CLASS = "vite-dev (tauri dev; DEV-gated hooks; unminified client)";

// S13 (M4's own divergence, carried into evidence per the fold-in this piece's instructions name):
// the REAL §6 definition of the input-to-present proxy quantity, quoted verbatim from
// RESIDENCY-PREREGISTRATION.md §6's own table row ("Input-to-present proxy"), followed by this
// harness's own code proxy, stated explicitly as a divergence, never presented as the same thing.
const INPUT_TO_PRESENT_PROXY_DIVERGENCE = {
  real_section_6_definition:
    "client clock, pointer/keyboard event -> next composited frame carrying its effect (reported, never gated -- proxy only, not a docs/08 row, no budget attaches)",
  this_code_proxy:
    "pointer/keyboard event timestamp (residencyMarkInput, called by this driver immediately before dispatching a synthetic gesture) -> the NEXT deck.gl onAfterRender fire observed while WorkingCanvas.tsx's per-step hook is armed (residencyArmFirstPixel/residencyDisarmFirstPixel window only, not the app's whole lifetime)",
  divergence:
    "deck.gl's onAfterRender fires once its WebGL draw call issues; the browser's own compositor may actually PRESENT the resulting pixels on a later frame boundary than this timestamp reflects. This proxy is therefore closer to 'issue the GPU draw call' than to a true browser compositor-present event, and is only observed inside the driver-controlled arm/disarm window, not continuously.",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

// ---------------------------------------------------------------------------------------
// M9: the cell declaration every evidence file carries.
// ---------------------------------------------------------------------------------------

/** Streams the fixture through SHA-256 rather than reading it whole -- honest even at the 5 GB
 * fixture's scale (§3's own hash-gating discipline for that fixture), though this driver's own
 * FIXTURE_FILTER_ZONED is small. */
function sha256File(path) {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(path);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });
}

function gitRevParseHead() {
  try {
    return execFileSync("git", ["rev-parse", "HEAD"], { cwd: SHELL_DIR, encoding: "utf8" }).trim();
  } catch (e) {
    return `unavailable: ${e.message}`;
  }
}

/** M9: parses this driver's own declared cell-metadata CLI flags -- kept separate from the
 * `--smoke`/`--control`/`--wire-identity` mode flags `main()` already parses via `Set`, since these
 * carry VALUES, not just presence. */
function parseCellArgs(argv) {
  let arm = "baseline";
  let coldOrWarm = "warm"; // declared default -- see this function's own doc comment on why
  let machineAttestation = "UNSPECIFIED -- no --attest flag given at run start";
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--arm" && argv[i + 1]) {
      arm = argv[i + 1];
      i++;
    } else if (argv[i] === "--cold") {
      coldOrWarm = "cold";
    } else if (argv[i] === "--warm") {
      coldOrWarm = "warm";
    } else if (argv[i] === "--attest" && argv[i + 1]) {
      machineAttestation = argv[i + 1];
      i++;
    }
  }
  return { arm, coldOrWarm, machineAttestation };
}

// ---------------------------------------------------------------------------------------
// M6: settle requires BOTH console quiescence AND in-flight === 0.
// ---------------------------------------------------------------------------------------

/** §4b's own two-part settle criterion, both halves now driver-checked: console-line-count
 * quiescence (`waitForSettle`, `lib.mjs`, unchanged) AND `residencyInFlightStreamCount() === 0`
 * (M6's new driver-visible counter). Loops between the two checks up to `timeoutMs` total -- console
 * quiescence can be satisfied while a stream is still in flight (a stream whose batches have all
 * arrived but whose terminal has not yet reached the manager), in which case this polls again rather
 * than declaring settle early. See this file's own top comment for the control-arm disclosure
 * (in-flight always reads 0 while the instrument is disabled). */
async function waitForSettleWithInFlight(page, traceFn, { quietMs, timeoutMs }) {
  const start = Date.now();
  while (true) {
    const remaining = Math.max(200, timeoutMs - (Date.now() - start));
    const consoleSettle = await waitForSettle(traceFn, { quietMs, timeoutMs: remaining });
    if (!consoleSettle.settled) {
      return { settled: false, count: consoleSettle.count, inFlight: null, reason: "console quiescence not reached" };
    }
    const inFlight = await page.evaluate(() => window.__SPATIAL_E2E__.residencyInFlightStreamCount?.() ?? 0);
    if (inFlight === 0) {
      return { settled: true, count: consoleSettle.count, inFlight };
    }
    if (Date.now() - start >= timeoutMs) {
      return { settled: false, count: consoleSettle.count, inFlight, reason: "in-flight never reached 0" };
    }
    // Console went quiet but a stream is still in flight -- give it a short beat and re-check BOTH
    // conditions together (a fresh render-trace line could arrive while we wait, which is exactly
    // why this re-enters `waitForSettle` rather than only polling in-flight in a tight loop).
    await sleep(100);
  }
}

// ---------------------------------------------------------------------------------------
// S1: pre/post view-state capture, from the always-on `traceViewState` render-trace line.
// ---------------------------------------------------------------------------------------

/** S5: a generic `[render-trace]` value listener -- captures a MONOTONIC index (`seq`) SYNCHRONOUSLY
 * inside `onConsole`, before the async `jsonValue()` round trip that resolves the line's real typed
 * payload. `sorted()` returns entries ordered by that index, never by whichever async resolution
 * happened to finish first (`jsonValue()` calls for concurrent console messages can resolve out of
 * emission order). Used for BOTH the M11 field-sequence identity check and S1's view-state capture,
 * replacing P1's own single-purpose `attachWireTraceListener`. */
function attachRenderTraceValueListener(page, eventNames) {
  const wanted = new Set(eventNames);
  const entries = [];
  let nextSeq = 0;
  const onConsole = (msg) => {
    const args = msg.args();
    if (args.length < 2) return;
    const seq = nextSeq++; // S5: monotonic, captured at onConsole time -- not after the await below.
    Promise.all(args.map((a) => a.jsonValue().catch(() => undefined))).then((values) => {
      if (values[0] !== "[render-trace]") return;
      const event = values[1];
      if (!wanted.has(event)) return;
      entries.push({ seq, event, data: values[2] });
    });
  };
  page.on("console", onConsole);
  return {
    sorted: () => [...entries].sort((a, b) => a.seq - b.seq),
    dispose: () => page.off("console", onConsole),
  };
}

/** S1: the LAST `view-state` line observed so far, or `null` if none yet -- called once before a
 * step's gesture and once after its settle, against the SAME persistent listener (attached once for
 * the whole trial). */
function lastViewState(viewStateListener) {
  const sorted = viewStateListener.sorted();
  return sorted.length > 0 ? sorted[sorted.length - 1].data : null;
}

/** S1: realized displacement in WORLD (authoritative-CRS) units -- `target + origin` at each
 * snapshot, never bare `target` alone, since a recenter between the two snapshots would re-base
 * `target` against a DIFFERENT origin (ADR-010 rule 1: a value that does not carry its space's tag
 * does not leave the module that produced it -- `traceViewState`'s own `originX`/`originY` fields are
 * that tag here, carried through exactly as `WorkingCanvas.tsx`'s own `onViewStateChange` handler
 * re-bases across a recenter). `null` if either snapshot is missing (no `view-state` line observed
 * yet, e.g. a step measured before the very first camera transform). */
function realizedDisplacement(pre, post) {
  if (!pre || !post) return null;
  const preWorldX = pre.targetX + pre.originX;
  const preWorldY = pre.targetY + pre.originY;
  const postWorldX = post.targetX + post.originX;
  const postWorldY = post.targetY + post.originY;
  const dx = postWorldX - preWorldX;
  const dy = postWorldY - preWorldY;
  return { dx, dy, distance: Math.hypot(dx, dy) };
}

// ---------------------------------------------------------------------------------------
// Camera gestures -- M8 (realized-diagonal fix) and S1 (clamp-check drag splitting).
// ---------------------------------------------------------------------------------------

/** S1 clamp-check: a drag whose total screen displacement would ask the OS pointer to travel further
 * than the canvas's own footprint in one leg is broken into multiple shorter MOVE LEGS, summing to
 * the SAME total displacement (M8's own realized-magnitude discipline: the SUM of per-leg vectors,
 * not the leg count, is what must equal the step's declared total). A single leg whenever the total
 * already fits.
 *
 * **ONE continuous mousedown -> [leg, leg, ...] -> ONE mouseup -- never released between legs.**
 * Live-verified bug, found running the M11/S4 field-sequence identity check repeatedly: an earlier
 * version of this function used SEPARATE mousedown/mouseup pairs per leg (multiple independent drag
 * gestures). Releasing the button between legs lets the camera's view-state settle for the real
 * wall-clock gap between one leg's `mouseup` and the next leg's `mousedown` (each `page.mouse.*` call
 * is its own CDP round trip) -- long enough, some fraction of the time, to cross
 * `App.tsx`'s own pan/zoom debounce window and issue an EXTRA, premature `viewport_query` mid-pan.
 * Confirmed live: repeated `--wire-identity` runs showed the SAME logical pan step producing a
 * DIFFERENT NUMBER of `viewport_query`/`batch` lines across runs (5 vs 6 `viewport_query` lines for
 * an otherwise-identical 3-step trace), independent of instrument on/off state -- a self-inflicted
 * non-determinism from the clamp-check fix itself, not a pre-existing server-side effect. Never
 * lifting the pointer until the FINAL leg removes the gap entirely: deck.gl's controller sees one
 * uninterrupted drag, exactly like a single-leg pan already did. */
async function clampedPanDrag(page, box, cx, cy, dxScreenTotal, dyScreenTotal) {
  const maxLegMagnitude = Math.min(box.width, box.height) * 0.9; // stay safely inside the canvas
  const totalMagnitude = Math.hypot(dxScreenTotal, dyScreenTotal);
  const legs = totalMagnitude > 0 ? Math.max(1, Math.ceil(totalMagnitude / maxLegMagnitude)) : 1;
  const dxLeg = dxScreenTotal / legs;
  const dyLeg = dyScreenTotal / legs;

  await page.mouse.move(cx, cy);
  await page.mouse.down();
  let curX = cx;
  let curY = cy;
  for (let i = 0; i < legs; i++) {
    curX += dxLeg;
    curY += dyLeg;
    await page.mouse.move(curX, curY, { steps: 10 });
  }
  await page.mouse.up();
  return { legs, dxLeg, dyLeg };
}

/** Dispatches the real pointer/wheel gesture a trace step's `kind` names, against `.working-canvas`'s
 * own bounding box -- see this file's top comment for the disclosed direction/magnitude
 * approximations. `zoomToLayerSelector` is `.zoom-to-layer` (App.tsx), reused by BOTH the `fit` step
 * (per §4b step 1: "Zoom-to-layer-equivalent fit-to-declared-extent") and the `zoom-to-layer` step
 * itself (step 11) -- the SAME real button a real operator would click, never a parallel path.
 *
 * **M8 fix (reviewer gate, P1b): the diagonal pan's per-axis components.** §4b step 6's own text:
 * "one full viewport diagonal (√2 x the pan distance above, same direction convention)" -- Amendment
 * 1 resolved "the pan distance above" as step 5's WIDTH basis, so `distance = width * sqrt(2)` is the
 * step's declared TOTAL magnitude. P1's own `applyStep` set BOTH the x and y screen components to
 * this full `distance` (one `dyScreen += distance` from the "N" branch, one `dxScreen -= distance`
 * from the "E" branch) -- combined via Pythagoras, that realizes a vector of magnitude
 * `distance * sqrt(2)`, i.e. `2 * width`, not `distance` (`width * sqrt(2)`) as declared: doubly
 * diagonal. Dividing each nonzero component by `Math.SQRT2` when BOTH an x and a y component are set
 * (a genuinely diagonal direction) restores the realized total to exactly `distance` -- see this
 * file's own report for the resulting formula, restated for Amendment 2. */
async function applyStep(page, step) {
  const box = await page.locator(".working-canvas").boundingBox();
  if (!box) throw new Error(`applyStep(${step.id}): .working-canvas has no bounding box (not mounted/visible?)`);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  if (step.kind === "fit" || step.kind === "zoom-to-layer") {
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyMarkInput?.());
    await page.click(".zoom-to-layer");
    return { kind: "fit" };
  }

  if (step.kind === "pan") {
    const dxBase = step.params.distanceBasis === "width" ? box.width : box.height;
    const distance = dxBase * step.params.distanceMultiplier;
    // Screen-drag-to-pan convention (disclosed approximation, this file's own top comment): dragging
    // the pointer in a direction reveals the OPPOSITE direction's data, i.e. moves the camera toward
    // the direction named. N: drag down. S: drag up. E: drag left. W: drag right. NE: both.
    let dxScreen = 0;
    let dyScreen = 0;
    if (step.params.direction.includes("N")) dyScreen += distance;
    if (step.params.direction.includes("S")) dyScreen -= distance;
    if (step.params.direction.includes("E")) dxScreen -= distance;
    if (step.params.direction.includes("W")) dxScreen += distance;
    // M8: a genuinely diagonal direction (both components nonzero) realizes `distance * sqrt(2)`
    // unless each component is itself divided by `sqrt(2)` first -- see this function's own doc
    // comment.
    if (dxScreen !== 0 && dyScreen !== 0) {
      dxScreen /= Math.SQRT2;
      dyScreen /= Math.SQRT2;
    }
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyMarkInput?.());
    const drag = await clampedPanDrag(page, box, cx, cy, dxScreen, dyScreen);
    return { kind: "pan", declaredDistance: distance, dxScreen, dyScreen, ...drag };
  }

  if (step.kind === "zoom") {
    const delta = step.params.factor >= 1 ? ZOOM_WHEEL_DELTA : ZOOM_OUT_WHEEL_DELTA;
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyMarkInput?.());
    await page.mouse.move(cx, cy);
    await page.mouse.wheel(0, delta);
    return { kind: "zoom", delta };
  }

  throw new Error(`applyStep(${step.id}): unknown kind "${step.kind}"`);
}

// ---------------------------------------------------------------------------------------
// Offline frame-time stats -- p50/p95 via the declared, tested `percentileNearestRank` (S2).
// ---------------------------------------------------------------------------------------

/** Offline (computed here, by the driver, never in-page -- §6's own instrument-column framing for
 * this quantity), from FRAME-TIME DELTAS (consecutive-frame-timestamp differences), not the raw
 * timestamps themselves -- G4's own "frame time p50/p95 vs vsync interval" wording is about the time
 * BETWEEN frames. Returns `null` for both when fewer than 2 timestamps were observed (no delta to
 * compute) -- an honest absence, never a fabricated 0. `truncated` is threaded through from the
 * instrument's own S9 cap flag (`frameTimestampsTruncated`), never silently dropped. */
function frameTimeStatsMs(frameTimestamps, truncated) {
  if (!Array.isArray(frameTimestamps) || frameTimestamps.length < 2) {
    return { p50: null, p95: null, max: null, sampleCount: 0, truncated: Boolean(truncated) };
  }
  const deltas = [];
  for (let i = 1; i < frameTimestamps.length; i++) {
    deltas.push(frameTimestamps[i] - frameTimestamps[i - 1]);
  }
  deltas.sort((a, b) => a - b);
  return {
    p50: percentileNearestRank(deltas, 50),
    p95: percentileNearestRank(deltas, 95),
    max: deltas[deltas.length - 1],
    sampleCount: deltas.length,
    truncated: Boolean(truncated),
  };
}

/** Same gate every sibling suite duplicates (regression.mjs/admission-remediation.mjs's own doc
 * comment on why: the 2026-08-12 fresh-launch race this closes). This suite additionally requires
 * `residencyBeginStep` present, since every trace step depends on it. */
async function waitForMountReady(page, timeoutMs = MOUNT_READY_TIMEOUT_MS) {
  const start = Date.now();
  let lastHeader = null;
  let lastHookPresent = false;
  let lastEvalError = null;

  while (Date.now() - start < timeoutMs) {
    try {
      const info = await page.evaluate(() => ({
        header: document.querySelector(".app-header")?.textContent ?? null,
        hookPresent:
          typeof window.__SPATIAL_E2E__?.openPath === "function" &&
          typeof window.__SPATIAL_E2E__?.residencyBeginStep === "function",
      }));
      lastHeader = info.header;
      lastHookPresent = info.hookPresent;
      lastEvalError = null;
      if (lastHeader !== null && lastHookPresent) {
        return { readyAfterMs: Date.now() - start };
      }
    } catch (e) {
      lastEvalError = e?.message ?? String(e);
    }
    await sleep(300);
  }

  const missing = [];
  if (lastHeader === null) missing.push(".app-header non-null");
  if (!lastHookPresent) missing.push("window.__SPATIAL_E2E__.openPath/residencyBeginStep present");
  throw new Error(
    `mount-readiness gate: timed out after ${timeoutMs}ms waiting for ${missing.join(" and ")}. page url=${page.url()}` +
      (lastEvalError ? `, last evaluate error=${lastEvalError}` : "")
  );
}

/** One measured step: begin (if instrumented), arm the first-pixel/frame-tick hook CONCURRENTLY with
 * the gesture, wait for BOTH-conditions settle (M6), disarm (S7, boolean recorded), end, and (S1)
 * capture pre/post view-state + realized displacement. Shared by the M7 `open-drain` pre-step and
 * every regular trace step below -- `applyStepFn` is `null` for `open-drain` (its own "gesture" is
 * `openFixture`, applied by the caller, not by this function).
 *
 * **Concurrency fix, found live verifying M7 (P1b).** `residencyArmFirstPixel`'s own hook now polls
 * (bounded, `App.tsx`'s own doc comment) for a live `WorkingCanvas`/`deck` instance to exist before it
 * can arm anything -- for every step EXCEPT `open-drain`, one already does (arm-then-gesture,
 * sequential, was fine there). For `open-drain` specifically, the "gesture" (`openFixture`) is THE
 * THING that CREATES the canvas the arm is polling for: awaiting the arm call FIRST, sequentially,
 * before ever starting `openFixture`, deadlocks the poll into always exhausting its own bound
 * silently (`openFixture` never even started yet) -- confirmed live: a fresh-launch smoke run's own
 * `open-drain` row read `firstPixelReason: "no-paint"` despite 3 batches/2000 features genuinely
 * arriving and rendering soon after. Firing the arm call WITHOUT awaiting it, then awaiting BOTH it
 * and the gesture together, lets the arm's in-page poll and `openFixture`'s own admission run
 * concurrently in the SAME page -- the poll picks up the canvas the moment `openFixture` creates it,
 * comfortably inside its 4s bound. */
async function measureOneStep(page, consoleHandle, viewStateListener, step, { instrumentEnabled, applyStepFn }) {
  if (instrumentEnabled) {
    await page.evaluate((id) => window.__SPATIAL_E2E__.residencyBeginStep(id), step.id);
  }
  const armPromise = instrumentEnabled
    ? page.evaluate(() => window.__SPATIAL_E2E__.residencyArmFirstPixel?.())
    : Promise.resolve();

  const preViewState = lastViewState(viewStateListener);
  const preCount = consoleHandle.renderTrace().length;
  const stepStartWallMs = Date.now();

  const gestureResult = applyStepFn ? await applyStepFn() : null;
  await armPromise; // ensure the arm has resolved (armed successfully or gave up) before settling

  const settle = await waitForSettleWithInFlight(page, () => consoleHandle.renderTrace(), step.settle);
  const postCount = consoleHandle.renderTrace().length;
  const wallMs = Date.now() - stepStartWallMs;
  const postViewState = lastViewState(viewStateListener);

  let armDisarmedCleanly = null;
  if (instrumentEnabled) {
    armDisarmedCleanly = await page.evaluate(() => window.__SPATIAL_E2E__.residencyDisarmFirstPixel?.() ?? null);
  }

  let result = null;
  if (instrumentEnabled) {
    result = await page.evaluate(() => window.__SPATIAL_E2E__.residencyEndStep());
  }

  const frameStats = result
    ? frameTimeStatsMs(result.frameTimestamps, result.frameTimestampsTruncated)
    : { p50: null, p95: null, max: null, sampleCount: 0, truncated: false };

  return {
    stepId: step.id,
    kind: step.kind,
    status: settle.settled ? "measured" : "unmeasured",
    reason: settle.settled ? undefined : `settle watchdog at step (${step.id}): ${settle.reason ?? "unknown"}`,
    wallMs,
    settled: settle.settled,
    inFlightAtSettle: settle.inFlight,
    renderTraceLinesDuringStep: postCount - preCount,
    gesture: gestureResult,
    armDisarmedCleanly, // S7: true = disarmed before the 5s watchdog, false = watchdog already fired, null = instrument off
    counters: result ? result.counters : undefined,
    firstPixelMs: result ? result.firstPixelMs : undefined,
    firstPixelReason: result ? result.firstPixelReason : undefined,
    frameTimeMs: frameStats,
    inputToPresentProxiesMs: result ? result.inputToPresentProxiesMs : undefined,
    inputToPresentProxiesTruncated: result ? result.inputToPresentProxiesTruncated : undefined,
    residentAtEndStep: result ? result.residentAtEndStep : undefined, // N4, G6 instrument
    // S1: pre/post view-state + realized displacement (world units, origin-corrected) + a genuine
    // assertion, not merely a recording -- a `pan` step that SETTLED but realized ZERO displacement
    // is a real anomaly (the camera transform is exactly what `waitForSettle`'s own quiescence is
    // supposed to be waiting to see change), flagged here so a reader never has to notice its own
    // absence by inference.
    viewState: (() => {
      const displacement = realizedDisplacement(preViewState, postViewState);
      let assertion = "not-applicable"; // non-pan steps (zoom/fit) don't carry this same expectation
      if (step.kind === "pan" && settle.settled) {
        assertion = displacement && displacement.distance > 0 ? "ok" : "FAIL: zero realized displacement for a settled pan step";
      }
      return { pre: preViewState, post: postViewState, realizedDisplacement: displacement, assertion };
    })(),
  };
}

/**
 * Runs the committed trace (or its first `stepLimit` steps, for `--smoke`) against the currently
 * admitted dataset. Per §4b: a step that does not settle within its own `timeoutMs` invalidates the
 * WHOLE TRIAL from that point on. **S8 fix (P1b): once invalidated, EVERY row in the trial --
 * including steps that individually settled fine BEFORE the failure -- is stamped `status:
 * "unmeasured"`**, per §4b's own letter ("a mid-trace watchdog fire cannot be recorded as a partial
 * success; the trial is recorded unmeasured -- settle watchdog at step N"). P1's own version left
 * earlier rows at `"measured"`, contradicting that text; this rewrites every row's `status` (and adds
 * a `wholeTrialInvalidatedReason` note) as a final pass after the loop, never during it (so the loop
 * itself still records each row's own honest per-step outcome first).
 */
async function runTrace(page, consoleHandle, viewStateListener, { stepLimit, instrumentEnabled }) {
  const steps = stepLimit ? CAMERA_TRACE_STEPS.slice(0, stepLimit) : CAMERA_TRACE_STEPS;
  const rows = [];
  let invalidatedAtStep = null;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (invalidatedAtStep !== null) {
      rows.push({ stepId: step.id, kind: step.kind, status: "unmeasured", reason: `settle watchdog at step ${invalidatedAtStep}` });
      continue;
    }

    const row = await measureOneStep(page, consoleHandle, viewStateListener, step, {
      instrumentEnabled,
      applyStepFn: () => applyStep(page, step),
    });
    rows.push(row);

    if (!row.settled) {
      invalidatedAtStep = i;
    }
  }

  const invalidated = invalidatedAtStep !== null;
  if (invalidated) {
    // S8: whole-trial invalidation stamps EVERY row, not only the ones from the failing step onward.
    for (const row of rows) {
      row.status = "unmeasured";
      row.wholeTrialInvalidatedReason = `settle watchdog at step ${invalidatedAtStep} (${steps[invalidatedAtStep]?.id ?? "?"})`;
    }
  }

  return { rows, invalidated, invalidatedAtStep };
}

async function openFixture(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_FILTER_ZONED);
  if (outcome.kind !== "admitted") {
    throw new Error(`openFixture: expected {kind:"admitted"}, got ${JSON.stringify(outcome)} -- ${FIXTURE_FILTER_ZONED}`);
  }
}

// ---------------------------------------------------------------------------------------
// M11 (renamed from P1's "wire-bytes-identity assertion"): render-trace field-sequence identity
// (proxy). RESIDENCY-PREREGISTRATION.md §6/§8's own wire-bytes-identity assertion asks for the
// bytes ACTUALLY ON THE WIRE to be identical; this driver has no raw-byte capture (a disclosed
// upgrade path, this piece's own report), so what it actually proves is narrower and is named for
// exactly that: a PROXY over the ordered sequence of typed VALUES three always-on render-trace lines
// carry, never the wire bytes themselves.
//
// **What is compared (S6, folded in):** `viewport_query` (the request about to serialize),
// `stream-issued` (fires once a ticket actually mints -- included, with `dataset`/`streamHandle`
// NORMALIZED OUT since both are per-open/per-request correlation ids, not request/response content),
// and `batch` (rows/vertices DECODED FROM the response). All three are UNCONDITIONAL render-trace
// lines (`diagnostics/renderTrace.ts`) -- never DEV-gated, never gated behind the residency
// instrument's own `enabled` flag -- so they fire identically whichever arm of this comparison is
// running.
//
// **What is explicitly excluded (M11):** the `residency` push/clear lines (`traceResidency`) --
// canvas-side bookkeeping, not wire content; and two REQUEST fields `render-trace` never logs at all
// -- `limit` and `filter` (`viewportQuery`'s own wire call carries both, but `traceViewportQuery`
// only ever logs `{dataset, bbox, bboxCrs}` -- see `viewportStreamManager.ts`). A change to either
// excluded field would NOT be caught by this proxy; both are named here so a reader never has to
// infer the gap from the comparison's own silence.
// ---------------------------------------------------------------------------------------

const FIELD_SEQUENCE_STEP_LIMIT = 3; // "a short trace" (piece text) -- steps 1-3, matching --smoke's own scope
const FIELD_SEQUENCE_EVENTS = ["viewport_query", "stream-issued", "batch"];
const EXCLUDED_LINE_TYPES = ["residency (push/clear -- traceResidency, canvas-side bookkeeping, not wire content)"];
const EXCLUDED_REQUEST_FIELDS = [
  "limit (viewportQuery's own call carries it; traceViewportQuery never logs it)",
  "filter (viewportQuery's own call carries it; traceViewportQuery never logs it)",
];

/** Strips server-minted / per-open correlation ids (`dataset`, `streamHandle`, `batchSeq`) -- a
 * correlation-id normalization, not a weakening of the identity claim itself (each is expected to
 * differ between two separate `viewport_query` calls even with byte-identical inputs). */
function normalizeFieldSequenceLine(line) {
  if (line.event === "viewport_query") {
    return { event: line.event, bbox: line.data.bbox, bboxCrs: line.data.bboxCrs };
  }
  if (line.event === "stream-issued") {
    // S6 fold-in: the EVENT'S OWN OCCURRENCE (its position in the ordered sequence) is what is
    // compared -- both fields this line carries (`dataset`, `streamHandle`) are per-open/per-request
    // correlation ids, normalized out entirely.
    return { event: line.event };
  }
  return {
    event: line.event,
    rows: line.data.rows,
    vertices: line.data.vertices,
    cumulativeRows: line.data.cumulativeRows,
    cumulativeVertices: line.data.cumulativeVertices,
  };
}

/** Runs the short trace once with the instrument in the given `enabled` state, returns the
 * normalized field sequence observed. Reopens the fixture fresh each call (the same "reopen the
 * same path" pattern `admission-remediation.mjs`'s own steps already rely on repeatedly).
 *
 * **Settle fix (P1b, live-verified finding).** P1's own version used a FIXED sleep
 * (`step.settle.quietMs + 1500`) instead of a real quiescence check, disclosed inline as "honest and
 * simpler." Running S4's own OFF-ON-ON-OFF interleave surfaced that this fixed margin is NOT always
 * enough (or is sometimes MORE than enough, letting an extra debounced re-issue land inside the
 * window) -- a live run recorded `off#0` vs `off#3` (both instrument OFF) DIFFERING in observed line
 * count, proof the divergence was run-to-run timing variance in this proxy's own settle mechanism,
 * not an instrument-caused wire difference (the adjacent `off#0`/`on#1` pair WAS byte-identical in
 * that same run). Fixed by reusing the SAME combined settle check (`waitForSettleWithInFlight`, M6)
 * every trace step already uses, rather than a fixed sleep -- still not a hard determinism
 * guarantee (no settle mechanism can be, over a real transport), but a materially stronger one than a
 * blind sleep. */
async function runShortTraceForFieldSequence(page, consoleHandle, enabled) {
  const listener = attachRenderTraceValueListener(page, FIELD_SEQUENCE_EVENTS);
  try {
    await page.evaluate((v) => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(v), enabled);
    await openFixture(page);
    await waitForSettleWithInFlight(page, () => consoleHandle.renderTrace(), { quietMs: SETTLE_QUIET_MS, timeoutMs: 60_000 });
    const steps = CAMERA_TRACE_STEPS.slice(0, FIELD_SEQUENCE_STEP_LIMIT);
    for (const step of steps) {
      await applyStep(page, step);
      await waitForSettleWithInFlight(page, () => consoleHandle.renderTrace(), step.settle);
    }
    // Let any final in-flight console messages resolve their jsonValue() promises.
    await sleep(500);
    return listener.sorted().map(normalizeFieldSequenceLine);
  } finally {
    listener.dispose();
  }
}

/**
 * S4: runs the comparison OFF-ON-ON-OFF (2 OFF, 2 ON, interleaved), never just ON-then-OFF once
 * each. Every pairwise comparison across the 4 runs is recorded (S4: "each comparison recorded"),
 * not only adjacent ones -- 6 comparisons for 4 runs, cheap (a JSON string compare each). S12: this
 * function does NOT write its own evidence file or exit the process -- it returns a plain result for
 * `main()`'s own SHARED `finally` block to write and exit through, the same path every other mode
 * uses (P1's own version duplicated that teardown here; fixed).
 */
async function runFieldSequenceIdentityCheck(page, consoleHandle) {
  // **Warm-up run, live-verified finding (P1b).** The FIRST synthetic gesture ever dispatched
  // against a freshly-mounted `.working-canvas` in a session realizes a measurably different camera
  // position than every later, otherwise-identical gesture -- confirmed live: an initial OFF-ON-ON-
  // OFF run showed `off#0` differing from `on#1`/`on#2`/`off#3` (which were byte-identical to EACH
  // OTHER across BOTH instrument states) in exactly one field, the third step's realized bbox --
  // never in anything the instrument could plausibly influence. Consistent with a one-time
  // synthetic-pointer/first-frame warm-up effect (this file's own disclosed approximation #2: pan
  // realization is not independently verified against a live render), not a wire-bytes divergence.
  // Absorbed here, ONCE, before any of the four MEASURED runs below -- so the anomaly (whatever its
  // exact cause) happens on a run that is never compared against anything.
  console.log("residency-harness --wire-identity: warm-up run (absorbs the first-gesture effect, not measured/compared)...");
  await runShortTraceForFieldSequence(page, consoleHandle, false);

  const order = ["off", "on", "on", "off"];
  const runs = [];
  for (let i = 0; i < order.length; i++) {
    const state = order[i];
    console.log(`residency-harness --wire-identity: run ${i + 1}/${order.length}, instrument ${state.toUpperCase()}...`);
    const sequence = await runShortTraceForFieldSequence(page, consoleHandle, state === "on");
    console.log(`  observed ${sequence.length} field-sequence-relevant render-trace lines`);
    runs.push({ index: i, state, sequence });
  }

  const comparisons = [];
  for (let i = 0; i < runs.length; i++) {
    for (let j = i + 1; j < runs.length; j++) {
      const aJson = JSON.stringify(runs[i].sequence);
      const bJson = JSON.stringify(runs[j].sequence);
      comparisons.push({ a: `${runs[i].state}#${runs[i].index}`, b: `${runs[j].state}#${runs[j].index}`, identical: aJson === bJson });
    }
  }
  const identical = comparisons.every((c) => c.identical);

  console.log("");
  console.log(
    `== render-trace field-sequence identity (proxy): ${identical ? "PASS -- byte-sequence-identical across OFF-ON-ON-OFF" : "FAIL -- sequences differ"} ==`
  );
  if (!identical) {
    for (const c of comparisons.filter((c) => !c.identical)) {
      console.error(`  DIFFERS: ${c.a} vs ${c.b}`);
    }
  }

  return {
    identical,
    order,
    runs: runs.map((r) => ({ index: r.index, state: r.state, sequence: r.sequence })),
    comparisons,
    excludedLineTypes: EXCLUDED_LINE_TYPES,
    excludedRequestFields: EXCLUDED_REQUEST_FIELDS,
  };
}

async function main() {
  const args = process.argv.slice(2);
  const argSet = new Set(args);
  const smoke = argSet.has("--smoke");
  const control = argSet.has("--control");
  const wireIdentity = argSet.has("--wire-identity");
  const stepLimit = smoke ? 3 : undefined;
  const cellArgs = parseCellArgs(args);
  // M9: `arm` (baseline/candidate/control) -- this harness has no `--arm=candidate` PRODUCER yet (P3
  // has not landed the tile-keyed residency this piece measures against), so `--arm` exists for
  // forward compatibility only; `--control` overrides it to the literal "control" (this harness's own
  // disclosed reading of M9's three-value field: today's only real axis besides baseline is
  // instrument on/off, and `--control` IS that axis's off state).
  const arm = control ? "control" : cellArgs.arm;

  const watchdog = setTimeout(() => {
    console.error("residency-harness: overall watchdog exceeded -- presumed hung, failing loudly");
    process.exit(2);
  }, TRIAL_WATCHDOG_MS + 120_000); // trial watchdog + generous headroom for launch/mount
  watchdog.unref();

  if (!existsSync(FIXTURE_FILTER_ZONED)) {
    console.error(`residency-harness: fixture not found: ${FIXTURE_FILTER_ZONED}`);
    console.error(`Regenerate with:\n  ${REGEN_FILTER_ZONED}`);
    process.exitCode = 1;
    return;
  }

  const buildCommit = gitRevParseHead();
  const fixtureSha256AtStart = await sha256File(FIXTURE_FILTER_ZONED);

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`residency-harness: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }
  const { page, browser, launched } = session;
  const consoleHandle = attachConsole(page);

  const evidence = {
    startedAt: new Date().toISOString(),
    mode: wireIdentity ? "wire-identity" : control ? "control" : "instrument-on",
    smoke,
    fixture: FIXTURE_FILTER_ZONED,
    stepLimit: stepLimit ?? CAMERA_TRACE_STEPS.length,
    rows: [],
    invalidated: false,
    inputToPresentProxyDivergence: INPUT_TO_PRESENT_PROXY_DIVERGENCE, // S13
    cell: {
      // M9: the full cell declaration.
      arm,
      tileSize: null, // pre-P3 -- no tile grid exists yet
      buildCommit,
      fixturePath: FIXTURE_FILTER_ZONED,
      fixtureSha256: fixtureSha256AtStart,
      coldOrWarm: cellArgs.coldOrWarm,
      traceVersion: TRACE_VERSION,
      machineAttestation: cellArgs.machineAttestation,
      instrumentEnabledReadback: null, // filled in below, after M10's own off-then-on sequencing
      buildClass: BUILD_CLASS, // M13
    },
  };

  try {
    console.log(`residency-harness: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const mountReady = await waitForMountReady(page);
    console.log(`residency-harness: mount-readiness gate PASSED after ${mountReady.readyAfterMs}ms`);

    await page
      .evaluate(() => {
        document.querySelectorAll(".canvas-refusal button, .error-banner button").forEach((b) => b.click());
      })
      .catch(() => {});

    // M10: asserts off-ness UNCONDITIONALLY, in EVERY mode, before doing anything measurement-shaped
    // -- the enable (in instrument-on modes only) happens strictly AFTER this readback.
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(false));
    let instrumentEnabledReadback = await page.evaluate(
      () => window.__SPATIAL_E2E__.residencyInstrumentIsEnabled?.() ?? false
    );

    if (wireIdentity) {
      // wireIdentity manages its OWN enable/disable per run inside `runFieldSequenceIdentityCheck`
      // (OFF-ON-ON-OFF, S4) -- the readback above still applies (asserted off-ness at run start,
      // before that dance begins), recorded into `evidence.cell` for consistency with every other
      // mode.
      evidence.cell.instrumentEnabledReadback = instrumentEnabledReadback;
      const result = await runFieldSequenceIdentityCheck(page, consoleHandle);
      evidence.fieldSequenceIdentity = result; // M11: renamed evidence key
      process.exitCode = result.identical ? 0 : 1;
      // S12: no separate teardown here -- falls through to the SHARED `finally` block below, the
      // same flush path every other mode exits through (P1's own version duplicated the teardown;
      // fixed).
      return;
    }

    if (!control) {
      await page.evaluate(() => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(true));
      instrumentEnabledReadback = await page.evaluate(() => window.__SPATIAL_E2E__.residencyInstrumentIsEnabled?.() ?? false);
    }
    evidence.cell.instrumentEnabledReadback = instrumentEnabledReadback;

    const instrumentEnabled = !control;
    const viewStateListener = attachRenderTraceValueListener(page, ["view-state"]);

    // M7: the drain gate + the `open-drain` pre-step -- measures the dataset OPEN's own natural
    // query + first-batch paint (G7's real "cold first view" subject), strictly BEFORE step 1
    // ("fit") ever runs, then requires a full drain (in-flight===0 + settle) before continuing.
    // **fitAnchorRef-vs-declared-extent observation (reported here per this piece's own instruction,
    // not resolved in code):** §4b step 1 reads "Fit -- Zoom-to-layer-equivalent fit-to-declared-
    // extent FROM A COLD, EMPTY RESIDENT SET." By the time step 1 actually runs (after this
    // `open-drain` pre-step has already admitted the dataset and let its own first batch settle),
    // the resident set is no longer cold/empty -- `WorkingCanvas.tsx`'s own one-shot auto-fit
    // (`hasAutoFitRef`) has already fired once, and `fitToBounds`'s own `chooseFitTarget
    // (fitAnchorRef.current)` fits the dataset-lifetime UNION extent, not literally "nothing yet."
    // This driver does not resolve that ambiguity (out of this piece's own scope, per its
    // instruction) -- flagged here, and restated in this piece's own report, for the custodian's
    // amendment.
    let openDrainRow = null;
    try {
      openDrainRow = await withTimeout(
        measureOneStep(
          page,
          consoleHandle,
          viewStateListener,
          { id: "open-drain", kind: "open", settle: { quietMs: 300, timeoutMs: 60_000 } },
          {
            instrumentEnabled,
            applyStepFn: () => withTimeout(openFixture(page), 60_000, "open-fixture"),
          }
        ),
        70_000,
        "open-drain"
      );
    } catch (e) {
      openDrainRow = { stepId: "open-drain", kind: "open", status: "unmeasured", reason: e.message };
    }
    evidence.openDrain = openDrainRow;

    const { rows, invalidated, invalidatedAtStep } = await runTrace(page, consoleHandle, viewStateListener, {
      stepLimit,
      instrumentEnabled,
    });
    evidence.rows = rows;
    evidence.invalidated = invalidated;
    evidence.invalidatedAtStep = invalidatedAtStep;
    viewStateListener.dispose();

    if (!control) {
      await page.evaluate(() => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(false));
    }

    console.log("");
    console.log(`== residency-harness (${evidence.mode}${smoke ? ", smoke" : ""}) -- open-drain + per-step summary ==`);
    if (openDrainRow) {
      const fp = openDrainRow.firstPixelMs != null ? `firstPixel=${openDrainRow.firstPixelMs}ms` : `firstPixel=n/a (${openDrainRow.firstPixelReason ?? openDrainRow.reason ?? "n/a"})`;
      console.log(`[open-drain] ${openDrainRow.status} wallMs=${openDrainRow.wallMs ?? "n/a"} ${fp}`);
    }
    for (const r of rows) {
      const featureBit = r.counters ? `features=${r.counters.featuresDecoded} bytes=${r.counters.bytesDecoded}` : "counters=(instrument off)";
      const fp = r.firstPixelMs != null ? `firstPixel=${r.firstPixelMs}ms` : `firstPixel=n/a (${r.firstPixelReason ?? "n/a"})`;
      console.log(`[${r.stepId}] ${r.status} wallMs=${r.wallMs ?? "n/a"} ${fp} ${featureBit}`);
    }

    process.exitCode = evidence.invalidated ? 1 : 0;
  } catch (e) {
    console.error(`residency-harness: harness failure: ${e.stack ?? e.message}`);
    evidence.harnessError = e.message;
    process.exitCode = 1;
  } finally {
    // M9: re-hash the fixture at the end too, matching §8's own "hashed before the trial loop AND
    // re-hashed after the last trial" discipline -- a mismatch is recorded, never silently ignored.
    try {
      evidence.cell.fixtureSha256AtEnd = await sha256File(FIXTURE_FILTER_ZONED);
      evidence.cell.fixtureHashMatchedAcrossRun = evidence.cell.fixtureSha256AtEnd === evidence.cell.fixtureSha256;
    } catch (e) {
      evidence.cell.fixtureHashAtEndError = e.message;
    }
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const suffix = wireIdentity ? "wire-identity" : `${control ? "control" : "instrument-on"}${smoke ? "-smoke" : ""}`;
      const evidencePath = join(OUT_DIR, `residency-harness-${suffix}-${Date.now()}.json`);
      writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));
      console.log(`Evidence file: ${evidencePath}`);
    } catch (e) {
      console.error(`residency-harness: failed to write the evidence file: ${e.message}`);
    }
    consoleHandle.dispose();
    await browser.close().catch(() => {});
    console.log(
      launched
        ? `This run launched the app; it stays RUNNING on CDP port ${CDP_PORT} for further interactive use.`
        : `Attached to an already-running app on CDP port ${CDP_PORT}; leaving it running.`
    );
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
