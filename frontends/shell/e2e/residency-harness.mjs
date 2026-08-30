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
// programmatic view-state hook -- for every MEASURED cell (`--smoke`, `--control`, plain
// instrument-on runs, i.e. `applyStep`/`runTrace` below).** This is a disclosed engineering choice,
// not a preregistration requirement: it drives the EXACT SAME deck.gl controller code path a real
// operator's drag/scroll would (no new product-code seam needed for camera control at all -- lower
// risk for a piece whose defining constraint is zero product-behavior change), at the cost of two
// approximations flagged here and in this piece's own report for a later piece to calibrate
// against a live app:
//   1. Zoom steps ("x2 magnification") use a fixed wheel-delta constant (`ZOOM_WHEEL_DELTA` below)
//      -- deck.gl/mjolnir.js's own wheel-to-zoom-factor mapping was not empirically calibrated
//      within this piece's own scope, so the resulting zoom factor is approximate, not exactly x2.
//   2. Pan direction's screen-to-world mapping (`PAN_SCREEN_DELTA` below) assumes north-is-up-on-
//      -screen in this fixture's stored CRS; not verified against a live render.
//
// **P1c exception, `--wire-identity`'s identity mode ONLY (RESIDENCY-PREREGISTRATION.md §12
// Amendment 6): a fixed, deterministic PROGRAMMATIC camera script, `IDENTITY_VIEW_STATE_STEPS`
// (`residencyTrace.mjs`), via the DEV-gated `e2eSetViewState` seam -- never a synthetic gesture.**
// P1b's real-gesture identity check could not discriminate instrument effects: CDP-driven pointer
// timing jitter interacting with the shell's own real 120ms pan/zoom debounce made two ON runs
// disagree with each other as much as ON vs OFF (see the committed gate evidence file's own P1b
// record). Realism is not the property under test in the identity mode -- only whether the
// instrument itself perturbs the wire. `applyIdentityViewStateStep` below is the ONLY caller of
// `e2eSetViewState` in this whole file; `applyStep` (measured cells) never references it, and
// `main()`'s own driver assertion (search `MEASURED-MODE VIEW-STATE SEAM ASSERTION` below) fails
// loudly if a measured run's own call counter is ever non-zero.
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
import { execFileSync, spawn } from "node:child_process";
import { createReadStream, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";
import {
  CAMERA_TRACE_STEPS,
  IDENTITY_VIEW_STATE_STEPS,
  percentileNearestRank,
  SETTLE_QUIET_MS,
  TRACE_VERSION,
  TRIAL_WATCHDOG_MS,
} from "./residencyTrace.mjs";

const SHELL_DIR = dirname(dirname(fileURLToPath(import.meta.url)));
const OUT_DIR = join(SHELL_DIR, "e2e", "out");
const MOUNT_READY_TIMEOUT_MS = 90_000;

const FIXTURE_FILTER_ZONED = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";

/** P2 pre-flight (custodian, post-gate, harness-only): §3 names three fixtures but the harness
 * hard-coded one. `--fixture <path>` selects the run's fixture; the default stays the small
 * smoke/identity fixture above. Every existing use site routes through this. */
function resolveFixturePath(argv) {
  const i = argv.indexOf("--fixture");
  if (i !== -1 && argv[i + 1]) return argv[i + 1];
  return FIXTURE_FILTER_ZONED;
}
const FIXTURE_PATH = resolveFixturePath(process.argv.slice(2));
const REGEN_FILTER_ZONED =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_zoned_fixture -- --ignored --nocapture";

// Disclosed approximations -- see this file's own top comment.
const ZOOM_WHEEL_DELTA = -1200; // negative deltaY == "scroll up" == zoom in, in deck.gl's default wheel handling
const ZOOM_OUT_WHEEL_DELTA = 1200;

// M13: a constant, stated honestly, carried into every evidence file's own `cell.buildClass`.
const BUILD_CLASS = "vite-dev (tauri dev; DEV-gated hooks; unminified client)";

// S13 (M4's own divergence, carried into evidence per the fold-in this piece's instructions name):
// the REAL §6 definition of the input-to-present proxy quantity, from
// RESIDENCY-PREREGISTRATION.md §6's own "Input-to-present proxy" table row, followed by this
// harness's own code proxy, stated explicitly as a divergence, never presented as the same thing.
// `real_section_6_definition` below is that row's own INSTRUMENT cell, quoted verbatim (P1d B1/B2's
// own citation-integrity fix corrected its arrow character to match the source exactly).
// `real_section_6_class_and_notes` is P1d nit 18's own relabeling: recomposed from §6's table cells
// (content-faithful, not a single verbatim cell) -- it joins that SAME row's CLASS cell and NOTES
// cell with this comment's own "(class)"/"(notes)" labels added for readability, which an earlier
// version of this comment called "quoted verbatim" despite the added labels and the join across two
// cells making that claim untrue.
const INPUT_TO_PRESENT_PROXY_DIVERGENCE = {
  real_section_6_definition: "client clock, pointer/keyboard event → next composited frame carrying its effect",
  real_section_6_class_and_notes: "reported, never gated (class); proxy only -- not a docs/08 row, no budget attaches (notes)",
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

/** P2-prep2 (viewport-residency cut): a settle-watchdog fire, on its own, only ever named ONE of
 * the two counters that decide whether it fired ("console quiescence not reached" told a reader
 * nothing about whether a stream was still genuinely in flight, or how busy the console actually
 * was) -- diagnosed live against the Polygons over-ceiling fixture (10M vertices, 5x
 * MAX_RESIDENT_VERTICES; the evidence file this fix is named for in this piece's own report), whose
 * `fit` step failed with `inFlightAtSettle: null` and no way to tell, from the evidence file alone,
 * whether that null meant "never checked" or "checked and still nonzero." Captures BOTH at the
 * moment of failure: a best-effort in-flight readback (even on the console-quiescence-never-reached
 * branch, which previously never polled it at all) and every console line (not just
 * `[render-trace]` ones -- `consoleHandle.entries`, unfiltered) observed in the last 5000ms, per
 * this piece's own instruction ("capture 5s of them"). Folded into BOTH the machine-readable
 * `diagnostic` field (kept on the row as `settleFailureDiagnostic`, `measureOneStep` below) and the
 * human-readable `reason` string itself -- a reader scanning only the evidence file's top-level
 * `reason`/`wholeTrialInvalidatedReason` text (never opening the nested diagnostic object) still
 * sees the actual in-flight count and how much console traffic was live, not just "watchdog fired." */
async function captureSettleFailureDiagnostic(page, consoleHandle) {
  let inFlightAtFailure = null;
  try {
    inFlightAtFailure = await page.evaluate(() => window.__SPATIAL_E2E__.residencyInFlightStreamCount?.() ?? null);
  } catch {
    inFlightAtFailure = null; // best-effort -- a failed readback must not itself throw out of the watchdog path
  }
  const cutoffMs = Date.now() - 5000;
  const recentConsoleLines = consoleHandle.entries.filter((e) => e.at >= cutoffMs).map((e) => `[${e.type}] ${e.text}`);
  return { inFlightAtFailure, recentConsoleLineCount: recentConsoleLines.length, recentConsoleLines };
}

/** §4b's own two-part settle criterion, both halves now driver-checked: console-line-count
 * quiescence (`waitForSettle`, `lib.mjs`, unchanged) AND `residencyInFlightStreamCount() === 0`
 * (M6's new driver-visible counter). Loops between the two checks up to `timeoutMs` total -- console
 * quiescence can be satisfied while a stream is still in flight (a stream whose batches have all
 * arrived but whose terminal has not yet reached the manager), in which case this polls again rather
 * than declaring settle early. See this file's own top comment for the control-arm disclosure
 * (in-flight always reads 0 while the instrument is disabled).
 *
 * **P2-prep2: takes `consoleHandle` (not a bare `traceFn`) so a settle failure can also read
 * `consoleHandle.entries` for `captureSettleFailureDiagnostic` above.** */
async function waitForSettleWithInFlight(page, consoleHandle, { quietMs, timeoutMs }) {
  const traceFn = () => consoleHandle.renderTrace();
  const start = Date.now();
  while (true) {
    const remaining = Math.max(200, timeoutMs - (Date.now() - start));
    const consoleSettle = await waitForSettle(traceFn, { quietMs, timeoutMs: remaining });
    if (!consoleSettle.settled) {
      const diagnostic = await captureSettleFailureDiagnostic(page, consoleHandle);
      return {
        settled: false,
        count: consoleSettle.count,
        inFlight: diagnostic.inFlightAtFailure,
        reason:
          `console quiescence not reached (in-flight=${diagnostic.inFlightAtFailure ?? "unknown"}, ` +
          `${diagnostic.recentConsoleLineCount} console line(s) in the last 5000ms)`,
        diagnostic,
      };
    }
    const inFlight = await page.evaluate(() => window.__SPATIAL_E2E__.residencyInFlightStreamCount?.() ?? 0);
    if (inFlight === 0) {
      return { settled: true, count: consoleSettle.count, inFlight };
    }
    if (Date.now() - start >= timeoutMs) {
      const diagnostic = await captureSettleFailureDiagnostic(page, consoleHandle);
      return {
        settled: false,
        count: consoleSettle.count,
        inFlight,
        reason:
          `in-flight never reached 0 (last observed in-flight=${inFlight}, ` +
          `${diagnostic.recentConsoleLineCount} console line(s) in the last 5000ms)`,
        diagnostic,
      };
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
 * "one full viewport diagonal (√2 × the pan distance above, same direction convention)" -- Amendment
 * 1 resolved "the pan distance above" as step 5's WIDTH basis, so `distance = width * sqrt(2)` is the
 * step's declared TOTAL magnitude. P1's own `applyStep` set BOTH the x and y screen components to
 * this full `distance` (one `dyScreen += distance` from the "N" branch, one `dxScreen -= distance`
 * from the "E" branch) -- combined via Pythagoras, that realizes a vector of magnitude
 * `distance * sqrt(2)`, i.e. `2 * width`, not `distance` (`width * sqrt(2)`) as declared: doubly
 * diagonal. Dividing each nonzero component by `Math.SQRT2` when BOTH an x and a y component are set
 * (a genuinely diagonal direction) restores the realized total to exactly `distance` -- see this
 * file's own report for the resulting formula, restated for Amendment 2. */
/** F1 fix (viewport-residency cut P2-prep dry-run; the surfacing evidence file is named in this
 * piece's own report). A ceiling-refusal banner (App.tsx's `canvasRefusal` state, rendered as
 * `.canvas-refusal`, set by `handleCanvasCeilingRefusal` the moment a stream's batch crosses
 * MAX_RESIDENT_VERTICES) visually covers `.zoom-to-layer`: `.canvas-status-stack` (styles.css)
 * spans `left: 0.5rem` to `right: 0.5rem` at `top: 0.5rem` -- the SAME top strip `.zoom-to-layer`
 * (`top: 0.5rem; right: 0.5rem`) sits in -- and neither declares a `pointer-events` override, so
 * the banner intercepts the fit step's own click. Live-confirmed by the dry-run's own evidence
 * file: Playwright's `page.click` call log recorded the `.canvas-refusal` div, inside
 * `.canvas-status-stack`, intercepting pointer events, then timing out after 30s. On a fixture
 * several times over the declared ceiling (Polygons, 5x MAX_RESIDENT_VERTICES), this banner
 * appears on the dataset's own FIRST query -- before the `fit` step's own click ever lands.
 *
 * A real operator hitting this would click the banner's own Dismiss button first -- this does
 * exactly that, via a real, actionability-checked Playwright click (`.first()` handles the rare
 * case both `.canvas-refusal` divs -- `canvasRefusal` and `viewportRefusal`, App.tsx -- are present
 * at once; never `force: true`, which would paper over a genuinely still-obscured element instead
 * of performing the same gesture a real user would). `.canvas-refusal button` is the same selector
 * `regression.mjs`'s own OVERCEIL' step already establishes as this banner's real Dismiss control.
 * Never touches `.residency-status` -- that status has no Dismiss button to find in the first
 * place (rider 1, DECISIONS-PENDING.md entry 0: dismiss hides the banner, never the status
 * indicator). The banner can reappear after a LATER refill also crosses the ceiling (a fresh
 * `.canvas-refusal` mount) -- this is called before every fit-kind step's own click, never only
 * once per trial. Returns whether it found and clicked one, so the caller can record it honestly
 * on the step's own evidence row (`bannerDismissed`). */
async function dismissCeilingBannerIfPresent(page) {
  const locator = page.locator(".canvas-refusal button").first();
  const present = (await locator.count()) > 0;
  if (!present) return false;
  await locator.click();
  return true;
}

async function applyStep(page, step) {
  const box = await page.locator(".working-canvas").boundingBox();
  if (!box) throw new Error(`applyStep(${step.id}): .working-canvas has no bounding box (not mounted/visible?)`);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  if (step.kind === "fit" || step.kind === "zoom-to-layer") {
    // F1: dismiss any intercepting ceiling banner FIRST -- an unrelated real-user action, kept
    // outside the residencyMarkInput/click pair below so the input-to-present proxy still measures
    // only the fit gesture itself, not this cleanup step.
    const bannerDismissed = await dismissCeilingBannerIfPresent(page);
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyMarkInput?.());
    await page.click(".zoom-to-layer");
    return { kind: "fit", bannerDismissed };
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
 * capture pre/post view-state + realized displacement. Shared by the M7 `open-drain` pre-step, every
 * regular trace step below, AND (P1d B3) the `--wire-identity` mode's own three steps -- `applyStepFn`
 * is `null` for `open-drain` (its own "gesture" is `openFixture`, applied by the caller, not by this
 * function).
 *
 * **P1d B5: the arm watchdog is scaled to `step.settle.timeoutMs`, not a fixed 5000.** Passed straight
 * through to `residencyArmFirstPixel` (`WorkingCanvas.tsx`'s own `armFirstPixelRenderHook`'s doc
 * comment carries the full mechanism) -- an armed measurement can no longer self-restore before its
 * OWN step's settle bound has even been reached (the `open-drain` pre-step's 60s settle vs. the old
 * fixed 5s watchdog was exactly this bug, re-review finding B5).
 *
 * **P1d B3: `alwaysCallHooks` (default `false`, preserving every existing caller's behavior).** When
 * `true`, this function calls `residencyBeginStep`/`residencyArmFirstPixel`/`residencyDisarmFirstPixel`/
 * `residencyEndStep` UNCONDITIONALLY, regardless of `instrumentEnabled` -- relying on each exported
 * hook's OWN internal `enabled` check to no-op when the instrument is off
 * (`residencyInstrument.ts`'s "off means zero work" discipline), rather than this driver's own
 * conditional skipping the calls entirely. Only `--wire-identity` sets this (see
 * `runShortTraceForFieldSequence` below) -- the driver-side CALL PATTERN (timing, sequence, CDP round
 * trips) must be identical whether the instrument is ON or OFF for the identity comparison to mean
 * anything; skipping the calls when off (every other mode's existing, intentional behavior --
 * `--control`'s own "instrument compiled out" simulation) would reintroduce exactly the vacuous
 * "ON differs from OFF by a flag gating nothing" defect this fix closes (re-review finding B3).
 * `instrumentEnabled` still governs `frameStats`'/the return shape's OWN reading of `result` (`null`
 * while disabled, since `residencyEndStep` itself returns `null` when off) -- only the CALL DECISION
 * changes, never what a disabled instrument reports.
 *
 * **P1d suggestion 11: `postSettleFlushMs` (default `0`).** When set, sleeps that long AFTER settle
 * resolves but BEFORE capturing `postViewState` -- `waitForSettleWithInFlight` only awaits console-LINE
 * -COUNT quiescence + in-flight===0, not the separate `viewStateListener`'s own async `jsonValue()`
 * resolution for the LAST `view-state` line, so a post-snapshot taken immediately after settle can race
 * that resolution and read a stale (pre-step) view-state. `runShortTraceForFieldSequence` is the only
 * caller that sets this (its own S1 capture is new as of B3 above; every other caller's existing
 * settle-then-snapshot ordering predates this fix and is left unchanged here, out of this piece's own
 * scope to re-verify at that call site).
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
async function measureOneStep(
  page,
  consoleHandle,
  viewStateListener,
  step,
  { instrumentEnabled, applyStepFn, alwaysCallHooks = false, postSettleFlushMs = 0 }
) {
  const callHooks = instrumentEnabled || alwaysCallHooks; // P1d B3
  if (callHooks) {
    await page.evaluate((id) => window.__SPATIAL_E2E__.residencyBeginStep(id), step.id);
  }
  const armPromise = callHooks
    ? page.evaluate((watchdogMs) => window.__SPATIAL_E2E__.residencyArmFirstPixel?.(watchdogMs), step.settle.timeoutMs) // P1d B5
    : Promise.resolve();

  const preViewState = lastViewState(viewStateListener);
  const preCount = consoleHandle.renderTrace().length;
  const stepStartWallMs = Date.now();

  const gestureResult = applyStepFn ? await applyStepFn() : null;
  await armPromise; // ensure the arm has resolved (armed successfully or gave up) before settling

  const settle = await waitForSettleWithInFlight(page, consoleHandle, step.settle);
  const postCount = consoleHandle.renderTrace().length;
  const wallMs = Date.now() - stepStartWallMs;
  if (postSettleFlushMs > 0) {
    await sleep(postSettleFlushMs); // P1d suggestion 11 -- see this function's own doc comment.
  }
  const postViewState = lastViewState(viewStateListener);

  let armDisarmedCleanly = null;
  if (callHooks) {
    armDisarmedCleanly = await page.evaluate(() => window.__SPATIAL_E2E__.residencyDisarmFirstPixel?.() ?? null);
  }

  let result = null;
  if (callHooks) {
    result = await page.evaluate(() => window.__SPATIAL_E2E__.residencyEndStep());
  }

  const frameStats = result
    ? frameTimeStatsMs(result.frameTimestamps, result.frameTimestampsTruncated)
    : { p50: null, p95: null, max: null, sampleCount: 0, truncated: false };

  // S1: pre/post view-state + realized displacement (world units, origin-corrected) + a genuine
  // assertion, not merely a recording -- a `pan` step that SETTLED but realized ZERO displacement is
  // a real anomaly (the camera transform is exactly what `waitForSettle`'s own quiescence is supposed
  // to be waiting to see change), flagged here so a reader never has to notice its own absence by
  // inference.
  const displacement = realizedDisplacement(preViewState, postViewState);
  let viewStateAssertion = "not-applicable"; // non-pan steps (zoom/fit/open/identity) don't carry this
  if (step.kind === "pan" && settle.settled) {
    viewStateAssertion = displacement && displacement.distance > 0 ? "ok" : "FAIL: zero realized displacement for a settled pan step";
  }
  const displacementFailed = typeof viewStateAssertion === "string" && viewStateAssertion.startsWith("FAIL");

  // P1d suggestion 12: a realized-displacement FAIL is a real anomaly, not a footnote -- it now also
  // demotes this row's own `status` to "unmeasured" (never silently left "measured" beside a FAIL
  // string a reader could miss), and `runTrace`/`main()` below fold any such row into the process exit
  // code, not only a settle-watchdog invalidation.
  const status = !settle.settled ? "unmeasured" : displacementFailed ? "unmeasured" : "measured";
  const reason = !settle.settled
    ? `settle watchdog at step (${step.id}): ${settle.reason ?? "unknown"}`
    : displacementFailed
      ? `S1 realized-displacement assertion failed: ${viewStateAssertion}`
      : undefined;

  return {
    stepId: step.id,
    kind: step.kind,
    status,
    reason,
    wallMs,
    settled: settle.settled,
    inFlightAtSettle: settle.inFlight,
    renderTraceLinesDuringStep: postCount - preCount,
    gesture: gestureResult,
    armDisarmedCleanly, // S7: true = disarmed before the arm's own watchdog, false = watchdog already fired, null = hooks not called
    counters: result ? result.counters : undefined,
    firstPixelMs: result ? result.firstPixelMs : undefined,
    firstPixelReason: result ? result.firstPixelReason : undefined,
    frameTimeMs: frameStats,
    inputToPresentProxiesMs: result ? result.inputToPresentProxiesMs : undefined,
    inputToPresentProxiesTruncated: result ? result.inputToPresentProxiesTruncated : undefined,
    residentAtEndStep: result ? result.residentAtEndStep : undefined, // N4, G6 instrument
    viewState: { pre: preViewState, post: postViewState, realizedDisplacement: displacement, assertion: viewStateAssertion },
    // P2-prep2: only ever present on a settle-watchdog failure (`captureSettleFailureDiagnostic`) --
    // in-flight count + last-5000ms console lines at the moment the watchdog fired, kept as structured
    // evidence alongside the same information already folded into `reason` above.
    settleFailureDiagnostic: settle.settled ? undefined : settle.diagnostic,
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
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_PATH);
  if (outcome.kind !== "admitted") {
    throw new Error(`openFixture: expected {kind:"admitted"}, got ${JSON.stringify(outcome)} -- ${FIXTURE_PATH}`);
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

// P1c (Amendment 6): no longer slices CAMERA_TRACE_STEPS -- the identity mode drives
// IDENTITY_VIEW_STATE_STEPS instead (residencyTrace.mjs), which is itself declared at exactly 3
// steps, matching this constant's own original "a short trace" scope. Retained (rather than
// deleted) as the single declared source of that scope, and asserted against
// IDENTITY_VIEW_STATE_STEPS.length below rather than left to drift silently out of sync with it.
const FIELD_SEQUENCE_STEP_LIMIT = 3;
if (IDENTITY_VIEW_STATE_STEPS.length !== FIELD_SEQUENCE_STEP_LIMIT) {
  throw new Error(
    `residency-harness: IDENTITY_VIEW_STATE_STEPS has ${IDENTITY_VIEW_STATE_STEPS.length} steps, expected FIELD_SEQUENCE_STEP_LIMIT=${FIELD_SEQUENCE_STEP_LIMIT}`
  );
}
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

/** P1c (Amendment 6): the identity mode's ONLY caller of `e2eSetViewState` -- dispatches one of
 * `IDENTITY_VIEW_STATE_STEPS`'s declared literal camera poses directly, never a synthetic
 * pointer/wheel gesture (see this file's own top comment). `applyStep` (measured cells) never
 * calls this function and never references `e2eSetViewState` -- the two camera-control paths are
 * kept structurally separate, not merely by convention. Throws if the DEV-gated seam reports it
 * moved nothing (`false` -- no `WorkingCanvas`/`Deck` mounted), the same "loud, not silent" failure
 * shape `openFixture` above already uses. */
async function applyIdentityViewStateStep(page, step) {
  const applied = await page.evaluate(
    ({ targetX, targetY, zoom }) => window.__SPATIAL_E2E__.e2eSetViewState?.(targetX, targetY, zoom) ?? false,
    { targetX: step.targetX, targetY: step.targetY, zoom: step.zoom }
  );
  if (!applied) {
    throw new Error(`applyIdentityViewStateStep(${step.id}): e2eSetViewState returned false (no WorkingCanvas/Deck mounted?)`);
  }
  return { kind: "identity-view-state", targetX: step.targetX, targetY: step.targetY, zoom: step.zoom };
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
 * blind sleep.
 *
 * **P1c (Amendment 6): no synthetic gesture, no debounce-racing.** Every step below now dispatches
 * `applyIdentityViewStateStep` (a literal, declared camera pose via the DEV-gated `e2eSetViewState`
 * seam) instead of `applyStep`'s real pointer/wheel gesture, and waits the FULL
 * `waitForSettleWithInFlight` (quiescence + in-flight===0) before the next step -- never racing the
 * shell's own 120ms pan/zoom debounce the way a fast, real drag could.
 *
 * **P1d B3 fix (re-review finding): every step now goes through `measureOneStep`'s REAL per-step
 * machinery -- `residencyBeginStep` -> arm -> settle -> disarm -> `residencyEndStep` -- exactly as a
 * MEASURED trace step does (`runTrace`'s own regular steps, the `open-drain` pre-step).** An earlier
 * version of this function called ONLY `residencyInstrumentSetEnabled(enabled)` and then drove the
 * gesture/settle loop directly -- it never began a step or armed the render-tick hook at all, so an
 * `enabled=true` ("ON") run and an `enabled=false` ("OFF") run differed by nothing except a flag that
 * gated NO code this function itself ever reached: a vacuous identity proof. `alwaysCallHooks: true`
 * below makes both ON and OFF runs issue the IDENTICAL sequence of driver-side calls (same CDP round
 * trips, same timing) -- it is each exported hook's OWN internal `enabled` check
 * (`residencyInstrument.ts`'s "off means zero work" discipline) that makes an OFF run's calls no-op,
 * never a driver-side skip. That symmetry of CALL PATTERN, with only the instrument's own internal
 * state differing, is what makes "OFF vs ON" an honest comparison of the instrument's OWN wire effect
 * rather than of two structurally different code paths. `postSettleFlushMs: 500` matches this
 * function's own prior end-of-run flush (below), now needed PER STEP too: `measureOneStep`'s S1
 * view-state capture is new to this path as of this fix, and its post-snapshot would otherwise race
 * the separate `view-state` listener's own async `jsonValue()` resolution (suggestion 11). The
 * fixture-open itself is wrapped the same way, as an `identity-open` step, for the same reason
 * `open-drain` wraps the real trial's own fixture-open -- not merely the three camera-pose steps. */
async function runShortTraceForFieldSequence(page, consoleHandle, enabled) {
  const listener = attachRenderTraceValueListener(page, FIELD_SEQUENCE_EVENTS);
  const viewStateListener = attachRenderTraceValueListener(page, ["view-state"]);
  try {
    await page.evaluate((v) => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(v), enabled);

    await measureOneStep(
      page,
      consoleHandle,
      viewStateListener,
      { id: "identity-open", kind: "open", settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: 60_000 } },
      { instrumentEnabled: enabled, applyStepFn: () => openFixture(page), alwaysCallHooks: true, postSettleFlushMs: 500 }
    );
    for (const step of IDENTITY_VIEW_STATE_STEPS) {
      await measureOneStep(
        page,
        consoleHandle,
        viewStateListener,
        { id: step.id, kind: "identity-view-state", settle: { quietMs: SETTLE_QUIET_MS, timeoutMs: 60_000 } },
        {
          instrumentEnabled: enabled,
          applyStepFn: () => applyIdentityViewStateStep(page, step),
          alwaysCallHooks: true,
          postSettleFlushMs: 500,
        }
      );
    }
    // Let any final in-flight console messages resolve their jsonValue() promises.
    await sleep(500);
    return listener.sorted().map(normalizeFieldSequenceLine);
  } finally {
    listener.dispose();
    viewStateListener.dispose();
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
  // **Warm-up run, P1b live-verified finding, ORIGINAL rationale carried forward with a P1c
  // disclosure.** P1b's own account: the FIRST synthetic gesture ever dispatched against a
  // freshly-mounted `.working-canvas` in a session realized a measurably different camera position
  // than every later, otherwise-identical gesture -- confirmed live, and consistent with a one-time
  // synthetic-pointer/first-frame warm-up effect, not a wire-bytes divergence.
  //
  // **P1c (Amendment 6) no longer dispatches any synthetic gesture in this function at all** (see
  // `runShortTraceForFieldSequence`'s own doc comment) -- the ORIGINAL gesture-specific mechanism
  // this warm-up run absorbed no longer runs here, so it may no longer be strictly necessary.
  // Retained anyway, unproven-but-cheap: a first-frame/first-open warm-up effect independent of
  // gestures (a fresh WebGL context's first real draw, a cold dataset-admission path) is still a
  // plausible source of session-position anomalies this file has not independently ruled out, and
  // running one extra, unmeasured trial before the four MEASURED runs costs one trial's wall time
  // against the alternative of re-introducing exactly the kind of anomaly P1b found live. A later
  // piece may remove this once it is shown unnecessary under the new mechanism; not shown here.
  console.log("residency-harness --wire-identity: warm-up run (absorbs any first-open/first-frame effect, not measured/compared)...");
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

// ---------------------------------------------------------------------------------------
// F2 fix (P2-prep dry-run): this harness never attaches to a leftover app -- see
// `sweepStaleCdpProcess`'s own doc comment for the full rationale.
// ---------------------------------------------------------------------------------------

/** Windows-only (this repo's own declared environment, CLAUDE.md: Windows 10 Pro, MSVC), reading
 * `netstat -ano`'s own fixed columnar output -- one `LISTENING` row per bound socket, PID always
 * the last whitespace-delimited token. Returns every distinct PID found listening on `port` (a
 * `Set` de-dupes multiple matching rows, e.g. IPv4 and a loopback-only rebind, that share one PID). */
function findPidsListeningOnPort(port) {
  if (process.platform !== "win32") return [];
  let output;
  try {
    output = execFileSync("netstat", ["-ano"], { encoding: "utf8" });
  } catch (e) {
    console.error(`residency-harness: "netstat -ano" failed while probing CDP port ${port}: ${e.message}`);
    return [];
  }
  const pids = new Set();
  for (const line of output.split(/\r?\n/)) {
    const m = line.match(/^\s*TCP\s+\S*:(\d+)\s+\S+\s+LISTENING\s+(\d+)\s*$/i);
    if (m && Number(m[1]) === port) pids.add(Number(m[2]));
  }
  return [...pids];
}

/** Same bounded-taskkill shape as `lib.mjs`'s own private (unexported) `killTree` -- duplicated
 * here rather than imported, per this piece's own harness-only scope and the sibling-file
 * duplication convention this file's own top comment already names (`admission-remediation.mjs`'s
 * "duplicate rather than cross-import for the identical reason"). A wedged `taskkill` must not hang
 * this driver forever, the same reasoning `lib.mjs`'s own version states for itself. */
function killProcessTreeLoudly(pid) {
  return new Promise((resolve) => {
    if (process.platform !== "win32") {
      try {
        process.kill(pid, "SIGKILL");
      } catch {
        // already gone
      }
      resolve();
      return;
    }
    const k = spawn("taskkill", ["/T", "/F", "/PID", String(pid)], { stdio: "ignore" });
    const timer = setTimeout(() => {
      console.error(`residency-harness: taskkill for PID ${pid} did not exit within 10s -- giving up (best-effort)`);
      resolve();
    }, 10_000);
    k.on("exit", () => {
      clearTimeout(timer);
      resolve();
    });
    k.on("error", () => {
      clearTimeout(timer);
      resolve(); // best-effort -- the process may already be gone
    });
  });
}

/** F2: a stale app already listening on `CDP_PORT` before this run starts makes this run's own
 * trial non-comparable to a fresh launch's own cold-start behaviour -- `lib.mjs`'s own
 * `attachOrLaunch` happily ATTACHES to whatever it finds there instead of launching fresh (its own
 * documented purpose: making REPEATED INTERACTIVE runs fast by reusing a still-running app). This
 * harness measures; every measured cell must start from the same cold state, so it never attaches.
 * Called once, before this driver's own `attachOrLaunch` call: kills (loudly, naming the PID)
 * whatever already answers CDP's `/json/version` probe on `CDP_PORT`, so the subsequent
 * `attachOrLaunch` call finds the port empty and takes its own launch path instead. Returns the
 * swept PIDs, possibly empty (nothing was there -- the common case) -- recorded into
 * `evidence.cell` either way, never silently discarded. */
async function sweepStaleCdpProcess() {
  const cdpUrl = `http://127.0.0.1:${CDP_PORT}`;
  let occupied = false;
  try {
    const res = await fetch(`${cdpUrl}/json/version`);
    occupied = res.ok;
  } catch {
    occupied = false;
  }
  if (!occupied) return [];

  const pids = findPidsListeningOnPort(CDP_PORT);
  if (pids.length === 0) {
    console.error(
      `residency-harness: CDP port ${CDP_PORT} answered /json/version but no owning PID was found via ` +
        `"netstat -ano" -- cannot sweep automatically; the fresh-launch invariant below will fail loudly ` +
        `if this run ends up attaching instead of launching.`
    );
    return [];
  }
  for (const pid of pids) {
    console.error(`residency-harness: sweeping stale app on CDP port ${CDP_PORT} -- killing process tree PID ${pid}`);
    await killProcessTreeLoudly(pid);
  }

  // Live-found (2026-08-30, the Polygons dry-run's hung relaunch): killing the CDP-port tree can
  // strand a vite dev-server on the app's own dev port; the fresh launch then wedges against the
  // stale server (port conflict, or worse: serving STALE client code to the new app). Sweep it too.
  const DEV_SERVER_PORT = 5180;
  const vitePids = findPidsListeningOnPort(DEV_SERVER_PORT).filter((p) => !pids.includes(p));
  for (const pid of vitePids) {
    console.error(
      `residency-harness: sweeping orphaned dev-server on port ${DEV_SERVER_PORT} -- killing process tree PID ${pid}`
    );
    await killProcessTreeLoudly(pid);
  }
  return [...pids, ...vitePids];
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
  // Re-review suggestion 15: the identity-guard run is neither measurement arm -- labelling it
  // with parseCellArgs' "baseline" default would let a scorer mistake guard evidence for a cell.
  const arm = control ? "control" : wireIdentity ? "identity-guard" : cellArgs.arm;

  const watchdog = setTimeout(() => {
    // Live-found (2026-08-30): process.exit inside this callback was observed racing the exit
    // path to a final code of 0 -- a watchdog that fires must never read as success.
    process.exitCode = 2;
    console.error("residency-harness: overall watchdog exceeded -- presumed hung, failing loudly");
    process.exit(2);
  }, TRIAL_WATCHDOG_MS + 120_000); // trial watchdog + generous headroom for launch/mount
  watchdog.unref();

  if (!existsSync(FIXTURE_PATH)) {
    console.error(`residency-harness: fixture not found: ${FIXTURE_PATH}`);
    if (FIXTURE_PATH === FIXTURE_FILTER_ZONED) console.error(`Regenerate with:\n  ${REGEN_FILTER_ZONED}`);
    process.exitCode = 1;
    return;
  }

  const buildCommit = gitRevParseHead();
  const fixtureSha256AtStart = await sha256File(FIXTURE_PATH);

  // F2: sweep BEFORE attaching/launching -- see `sweepStaleCdpProcess`'s own doc comment.
  const sweptPids = await sweepStaleCdpProcess();

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`residency-harness: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }
  const { page, browser, launched } = session;
  // F2: no attach path remains in this harness -- the sweep above must have left CDP_PORT empty,
  // so `attachOrLaunch` should always take its own launch path here. Asserted, not merely assumed:
  // `launched === false` means either the sweep missed a PID (already logged above) or a NEW
  // process raced onto the port between the sweep and this call -- either way a harness/environment
  // defect this run's own evidence must never silently paper over as a normal launch.
  if (!launched) {
    console.error(
      `residency-harness: FRESH-LAUNCH INVARIANT VIOLATED -- attachOrLaunch attached to an existing app ` +
        `on CDP port ${CDP_PORT} instead of launching fresh, even after sweeping ${sweptPids.length} PID(s) ` +
        `(${sweptPids.join(", ") || "none"}). This harness measures; every measured cell must start from a ` +
        `cold, freshly-launched app.`
    );
    await browser.close().catch(() => {});
    process.exitCode = 1;
    return;
  }
  const consoleHandle = attachConsole(page);

  const evidence = {
    startedAt: new Date().toISOString(),
    mode: wireIdentity ? "wire-identity" : control ? "control" : "instrument-on",
    smoke,
    fixture: FIXTURE_PATH,
    stepLimit: stepLimit ?? CAMERA_TRACE_STEPS.length,
    rows: [],
    invalidated: false,
    inputToPresentProxyDivergence: INPUT_TO_PRESENT_PROXY_DIVERGENCE, // S13
    // P1d suggestion 8: client-clock GATED quantities (first pixels, frame time, cancellation --
    // §6's own "client clock"/"client compositor-frame timer" rows) are only ever populated in an
    // instrument-ON cell (`counters`/`firstPixelMs`/`frameTimeMs` are `undefined` in `--control`,
    // since `--control`'s own hooks are never called, per suggestion 7's own invariant above). A
    // `--control` cell exists to guard WIRE BEHAVIOR (the §8 wire-bytes-identity assertion this
    // piece's own `--wire-identity` mode measures) -- it does not, and cannot, supply a
    // control-arm VALUE for any gated quantity to be scored against; there is no control-arm p95.
    // A custodian amendment should restate this at RESIDENCY-PREREGISTRATION.md §6's own table
    // (reported here, not made here -- out of this piece's own scope to amend the preregistration).
    gatedQuantityAvailability:
      "gated client-clock quantities (first pixels, frame time p50/p95, cancellation) exist only in " +
      "instrument-on cells; the --control cell's own readback-hard-throw (suggestion 7) guards that " +
      "the wire is unperturbed when the instrument is off, it does not and cannot supply a control-arm " +
      "value for any gated quantity -- there is no control-arm p95 to compare against",
    cell: {
      // M9: the full cell declaration.
      arm,
      tileSize: null, // pre-P3 -- no tile grid exists yet
      buildCommit,
      fixturePath: FIXTURE_PATH,
      fixtureSha256: fixtureSha256AtStart,
      coldOrWarm: cellArgs.coldOrWarm,
      traceVersion: TRACE_VERSION,
      machineAttestation: cellArgs.machineAttestation,
      instrumentEnabledReadback: null, // filled in below, after M10's own off-then-on sequencing
      buildClass: BUILD_CLASS, // M13
      launchedFresh: launched, // F2: always true -- the fresh-launch invariant above already returned if not
      sweptPids, // F2: PIDs killed on CDP_PORT before this run's own launch, possibly empty
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

    // P1d suggestion 7: `--control` is only a real control cell if the instrument is PROVABLY off --
    // a readback that is anything other than the literal `false` (a stale hook, a race with M10's own
    // off-then-on sequencing, a future regression re-ordering these calls) must fail loudly here,
    // never be silently recorded and measured through anyway.
    if (control && instrumentEnabledReadback !== false) {
      throw new Error(
        `residency-harness: --control INVARIANT VIOLATED -- residencyInstrumentIsEnabled() read back ` +
          `${JSON.stringify(instrumentEnabledReadback)}, not false, for a --control run. A control cell ` +
          `whose own instrument readback is not provably off is not a control cell; this is a ` +
          `harness/product defect, not a data result.`
      );
    }

    const instrumentEnabled = !control;
    const viewStateListener = attachRenderTraceValueListener(page, ["view-state"]);

    // M7: the drain gate + the `open-drain` pre-step -- measures the dataset OPEN's own natural
    // query + first-batch paint (G7's real "cold first view" subject), strictly BEFORE step 1
    // ("fit") ever runs, then requires a full drain (in-flight===0 + settle) before continuing.
    // **fitAnchorRef-vs-declared-extent observation (reported here per this piece's own instruction,
    // not resolved in code):** §4b step 1's own text (paraphrased, not quoted -- P1d B1/B2's own
    // citation-integrity fix: an earlier version of this comment quoted it with a capitalization
    // change the source does not carry) describes Fit as the Zoom-to-layer-equivalent fit to the
    // declared extent, FROM a cold, empty resident set (emphasis this comment's own, not the
    // source's). By the time step 1 actually runs (after this
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

    // F4 fix (P2-prep dry-run, evidence file `residency-harness-instrument-on-smoke-
    // 1788123308934.json`): that run's own open-drain row read `status: "measured"` while
    // `firstPixelMs` was `null` and every `frameTimeMs` figure (p50/p95/max/sampleCount) was also
    // `null`/`0` -- despite `counters` showing real, nonzero work (`batchesReceived: 40`,
    // `featuresDecoded: 19055`). `measureOneStep`'s own `status` computation (this file, above) only
    // ever demotes a row for a settle-watchdog failure or (pan steps only) a zero-displacement
    // assertion -- it never checks whether the render-timing quantities it also reports were
    // actually captured, so a step that settled fine but never observed a paint stayed "measured"
    // beside otherwise-honest `null` fields.
    //
    // **Diagnosed cause (code-read only, this piece's own scope is harness-only -- not a live-
    // instrumented render-diagnosis session, which this piece's own instruction does not authorize).**
    // `firstPixelReason: "no-paint"` (`residencyInstrument.ts`'s own three-way reason) means a stream
    // WAS issued and a batch WAS accepted, yet no `recordFrame` call was ever observed before
    // `endStep` -- i.e. `WorkingCanvas.tsx`'s armed `onAfterRender` hook never fired while armed. The
    // most likely mechanism found reading the code: `App.tsx`'s `residencyArmFirstPixel` E2E hook
    // polls for a live `canvasRef.current`/`deckRef.current` for a FIXED 4000ms before silently
    // giving up (its own comment: "Gave up -- no WorkingCanvas/deck ever became available within the
    // bound... An honest no-op") -- a bound independent of, and much shorter than, the step's own
    // 60_000ms settle timeout passed to `measureOneStep` above. If that poll ever exhausts its 4s
    // bound before a live deck exists (plausible on this fixture: Polygons, 5x MAX_RESIDENT_VERTICES,
    // whose first admit/mount/decode is heavier than the filter-zoned smoke fixture this mechanism was
    // last live-verified against), NOTHING is ever armed for that step. Critically,
    // `WorkingCanvas.tsx`'s own `disarmFirstPixelRenderHook` returns the SAME `true` for "never armed
    // at all" as for "armed and cleanly disarmed before its own internal watchdog"
    // (`!firstPixelTimedOutRef.current`, and both that ref and `firstPixelWatchdogRef.current` are
    // still at their untouched initial values in the never-armed case) -- so this driver's own
    // `armDisarmedCleanly: true` reading cannot currently distinguish the two, which is why this row
    // still looked superficially healthy. This is a real product-code signal-quality gap (the fixed
    // 4s poll bound and the disarm-outcome ambiguity); reported here per this piece's own instruction,
    // not fixed here (no product code in this piece's scope).
    //
    // The fix within this harness's own scope: never leave a row "measured" beside these missing
    // quantities -- if open-drain settled but its own `firstPixelReason` is set at all (any of
    // `"no-query"`/`"no-batch"`/`"no-paint"` -- for a genuine dataset open, every one of the three
    // names a real capture gap, never a legitimate empty result the way it might for a later
    // camera-trace step), demote it to `"unmeasured"` with a reason that names the gap explicitly.
    if (openDrainRow && openDrainRow.status === "measured" && openDrainRow.firstPixelReason != null) {
      const diagnosis =
        openDrainRow.firstPixelReason === "no-paint"
          ? " Diagnosed cause (code-read, not live-confirmed -- see this driver's own inline F4 comment): " +
            "the residencyArmFirstPixel E2E hook's fixed 4s poll bound for a live WorkingCanvas/deck may " +
            "have exhausted before one existed on this fixture, and disarmFirstPixelRenderHook's own " +
            "never-armed and cleanly-disarmed outcomes are indistinguishable from this driver's side."
          : "";
      openDrainRow.reason =
        `open-drain settled and counters show real work, but firstPixelMs/frameTimeMs were never ` +
        `captured (firstPixelReason: "${openDrainRow.firstPixelReason}") -- never recorded "measured" ` +
        `beside None first-pixel/frame-time quantities.${diagnosis}`;
      openDrainRow.status = "unmeasured";
    }

    evidence.openDrain = openDrainRow;

    const { rows, invalidated, invalidatedAtStep } = await runTrace(page, consoleHandle, viewStateListener, {
      stepLimit,
      instrumentEnabled,
    });
    evidence.rows = rows;
    evidence.invalidated = invalidated;
    evidence.invalidatedAtStep = invalidatedAtStep;

    // P1d B4: `evidence.openDrain` is assigned OUTSIDE `rows` (a pre-step, not one of
    // `runTrace`'s own trace steps), so `runTrace`'s S8 rewrite (every row in `rows` demoted to
    // `"unmeasured"` on whole-trial invalidation) never reached it -- the re-review's own finding:
    // a mid-trace watchdog fire invalidates the WHOLE TRIAL per §4b's letter, and `open-drain` is
    // part of that same trial's evidence, not a separate one. Re-stamped here, the same way, the
    // moment `invalidated` is known -- never left at whatever per-step status it individually earned.
    if (invalidated && evidence.openDrain) {
      evidence.openDrain.status = "unmeasured";
      evidence.openDrain.wholeTrialInvalidatedReason = `settle watchdog at step ${invalidatedAtStep} (${
        (stepLimit ? CAMERA_TRACE_STEPS.slice(0, stepLimit) : CAMERA_TRACE_STEPS)[invalidatedAtStep]?.id ?? "?"
      })`;
    }
    viewStateListener.dispose();

    // MEASURED-MODE VIEW-STATE SEAM ASSERTION (P1c, Amendment 6): this whole code path (`open-drain`
    // + `runTrace`/`applyStep`, reached from every mode EXCEPT `--wire-identity`, which returns
    // early above) is a MEASURED cell -- it must never touch the identity-mode-only
    // `e2eSetViewState` seam. Read AFTER the trace, not merely asserted by omission: a call count of
    // exactly 0 is checked and recorded into the evidence file itself, so a future regression (a
    // stray call added to `applyStep` by mistake) fails loudly here rather than silently drifting.
    //
    // **P1d suggestion 9, corrected: the counter's real reset semantics.** `e2eSetViewStateCallCount`
    // (`WorkingCanvas.tsx`) is a `useEffect([])`-scoped closure variable -- it resets to 0 on every
    // MOUNT of a `WorkingCanvas` instance, not merely "on a fresh page load" (an earlier version of
    // this comment, and of `e2e-test-surface.ts`'s own doc comment, claimed the latter). A dataset
    // (re-)admission can remount `WorkingCanvas` (`firstPixelArmedRef`'s own doc comment, above,
    // documents the same remount for a DIFFERENT reason). So this assertion's real WINDOW is "since
    // the currently-mounted `WorkingCanvas` instance's own last mount," not "for this whole run" --
    // in practice that is "since `open-drain`'s own `openFixture` call" for every mode this file
    // drives (nothing re-admits the dataset a second time within one measured run), but this comment
    // no longer overclaims a page-load-scoped guarantee the code does not provide.
    const measuredModeViewStateSeamCallCount = await page.evaluate(
      () => window.__SPATIAL_E2E__.e2eSetViewStateCallCount?.() ?? 0
    );
    evidence.measuredModeViewStateSeamAssertion = {
      expected: 0,
      observed: measuredModeViewStateSeamCallCount,
      ok: measuredModeViewStateSeamCallCount === 0,
    };
    if (measuredModeViewStateSeamCallCount !== 0) {
      throw new Error(
        `residency-harness: MEASURED-MODE INVARIANT VIOLATED -- the identity-mode-only deterministic ` +
          `camera seam (e2eSetViewState) was called ${measuredModeViewStateSeamCallCount} time(s) during a ` +
          `MEASURED run (mode=${evidence.mode}). Amendment 6 restricts this seam to the identity mode only; ` +
          `every measured cell must drive real synthetic gestures (applyStep). This is a harness/product ` +
          `defect, not a data result.`
      );
    }

    // P1d suggestion 10: session-wide total, read once at the end of the run (the counter is not
    // step-scoped -- `residencyInstrument.ts`'s own `supersededBytesDropped` doc comment). A `0`
    // reading here is not suppressed or treated as an error -- a short trace against a small fixture
    // may simply never supersede a stream mid-flight; `0` while `--control`/the instrument was ever
    // disabled is the same disclosed limitation `residencyInFlightStreamCount` already carries.
    evidence.supersededBytesDropped = await page.evaluate(
      () => window.__SPATIAL_E2E__.residencySupersededBytesDropped?.() ?? 0
    );

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
      // P2-prep2: a row `runTrace`'s own early-continue pushed for a step AFTER the one that failed
      // the settle watchdog (`invalidatedAtStep`) never reached `measureOneStep` at all -- it has no
      // `wallMs` (every real `measureOneStep` row always sets one, even on its own settle failure).
      // Printing "counters=(instrument off)" beside such a row was cosmetically dishonest: the
      // instrument was never off, the step was simply never attempted once the trial was already
      // invalidated. Named plainly instead, distinct from a genuine `--control` row (which DOES have
      // a `wallMs` -- it ran, its hooks were just never called).
      if (r.wallMs === undefined) {
        console.log(`[${r.stepId}] skipped (trial invalidated at step ${invalidatedAtStep})`);
        continue;
      }
      const featureBit = r.counters ? `features=${r.counters.featuresDecoded} bytes=${r.counters.bytesDecoded}` : "counters=(instrument off)";
      const fp = r.firstPixelMs != null ? `firstPixel=${r.firstPixelMs}ms` : `firstPixel=n/a (${r.firstPixelReason ?? "n/a"})`;
      console.log(`[${r.stepId}] ${r.status} wallMs=${r.wallMs ?? "n/a"} ${fp} ${featureBit}`);
    }

    // P1d suggestion 12: a realized-displacement FAIL (measureOneStep's own `viewState.assertion`)
    // demotes its row to `status: "unmeasured"` even on an otherwise-settled step -- folded into the
    // exit code here alongside `evidence.invalidated` (the settle-watchdog path, S8) so BOTH honest
    // failure shapes are non-zero-exit, never only the watchdog one.
    const anyRowUnmeasured = [openDrainRow, ...rows].some((r) => r?.status === "unmeasured");
    evidence.anyRowUnmeasured = anyRowUnmeasured;
    process.exitCode = evidence.invalidated || anyRowUnmeasured ? 1 : 0;
  } catch (e) {
    console.error(`residency-harness: harness failure: ${e.stack ?? e.message}`);
    evidence.harnessError = e.message;
    process.exitCode = 1;
  } finally {
    // F3 fix (P2-prep dry-run): a canonical guarantee, in this ONE shared flush path every mode
    // already exits through, that a recorded `harnessError` never exits 0 -- independent of
    // whatever code path set `evidence.harnessError` (the catch block above already also sets
    // `process.exitCode = 1` itself; this is a backstop, not a replacement for it, in case a future
    // call site ever sets the field without remembering the exit code too).
    if (evidence.harnessError && process.exitCode !== 1) {
      console.error(
        `residency-harness: harnessError was recorded (${JSON.stringify(evidence.harnessError)}) but ` +
          `process.exitCode was ${JSON.stringify(process.exitCode)}, not 1 -- correcting it here (F3).`
      );
      process.exitCode = 1;
    }

    // P1d suggestion 9: the measured-mode view-state-seam assertion (above, inside `try`) is normally
    // read right after `runTrace` resolves -- if anything earlier in the `try` block threw first
    // (`waitForMountReady`, `open-drain`, `runTrace` itself), that read never ran, and a genuine seam
    // violation earlier in the run would go completely unrecorded. This finally-block check ALSO runs
    // it, but ONLY if the try block never got there (`evidence.measuredModeViewStateSeamAssertion` is
    // still unset) and this is not `--wire-identity` (which legitimately calls the seam) -- so the
    // assertion is captured regardless of how the try block exited, never only when it completed
    // normally, and is never double-run when the try block already recorded one.
    if (!wireIdentity && !evidence.measuredModeViewStateSeamAssertion) {
      try {
        const observed = await page.evaluate(() => window.__SPATIAL_E2E__.e2eSetViewStateCallCount?.() ?? 0);
        evidence.measuredModeViewStateSeamAssertion = {
          expected: 0,
          observed,
          ok: observed === 0,
          note: "recorded from the finally block -- the try block exited before reaching its own check",
        };
      } catch (e) {
        evidence.measuredModeViewStateSeamAssertionError = e.message;
      }
    }
    // M9: re-hash the fixture at the end too, matching §8's own "hashed before the trial loop AND
    // re-hashed after the last trial" discipline -- a mismatch is recorded, never silently ignored.
    try {
      evidence.cell.fixtureSha256AtEnd = await sha256File(FIXTURE_PATH);
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
