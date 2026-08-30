#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- viewport-residency cut P1, the measurement harness.
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
// **Settle-criterion signal, chosen and disclosed (RESIDENCY-PREREGISTRATION.md §4b names TWO
// conditions: camera-transform-unchanged-300ms AND zero-in-flight-viewport_query-streams).** This
// driver detects both together via ONE proxy: `waitForSettle` (`lib.mjs`, already used by every
// sibling suite for exactly this purpose) polling `[render-trace]` console-line COUNT quiescence --
// `traceViewState` (WorkingCanvas.tsx, fires on every camera transform change) and `traceStreamBatch`
// (fires on every batch arrival) are BOTH always-on render-trace lines (never DEV-gated, never
// gated behind the residency instrument's own `enabled` flag), so "no new render-trace line for
// `quietMs`" is quiet on the camera transform AND on batch delivery simultaneously -- a reasonable,
// already-precedented proxy for the preregistration's own two-part criterion, not a literal
// implementation of "zero in-flight streams" (which would need new product-side stream-count
// instrumentation this piece does not add). Flagged here as the chosen observable, per this piece's
// own instruction to document such choices.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";
import { CAMERA_TRACE_STEPS, TRIAL_WATCHDOG_MS } from "./residencyTrace.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");
const MOUNT_READY_TIMEOUT_MS = 90_000;

const FIXTURE_FILTER_ZONED = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_FILTER_ZONED =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_zoned_fixture -- --ignored --nocapture";

// Disclosed approximations -- see this file's own top comment.
const ZOOM_WHEEL_DELTA = -1200; // negative deltaY == "scroll up" == zoom in, in deck.gl's default wheel handling
const ZOOM_OUT_WHEEL_DELTA = 1200;

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

/** Offline p50/p95 (RESIDENCY-PREREGISTRATION.md §6: "p50/p95 computed OFFLINE by the driver, never
 * in-page"), computed from FRAME-TIME DELTAS (consecutive-frame-timestamp differences), not the raw
 * timestamps themselves -- G4's own "frame time p50/p95 vs vsync interval" wording is about the time
 * BETWEEN frames. Returns `null` for both when fewer than 2 timestamps were observed (no delta to
 * compute) -- an honest absence, never a fabricated 0. */
function frameTimeStatsMs(frameTimestamps) {
  if (!Array.isArray(frameTimestamps) || frameTimestamps.length < 2) {
    return { p50: null, p95: null, max: null, sampleCount: 0 };
  }
  const deltas = [];
  for (let i = 1; i < frameTimestamps.length; i++) {
    deltas.push(frameTimestamps[i] - frameTimestamps[i - 1]);
  }
  deltas.sort((a, b) => a - b);
  const pct = (p) => deltas[Math.min(deltas.length - 1, Math.floor((p / 100) * deltas.length))];
  return { p50: pct(50), p95: pct(95), max: deltas[deltas.length - 1], sampleCount: deltas.length };
}

/** Dispatches the real pointer/wheel gesture a trace step's `kind` names, against `.working-canvas`'s
 * own bounding box -- see this file's top comment for the disclosed direction/magnitude
 * approximations. `zoomToLayerSelector` is `.zoom-to-layer` (App.tsx), reused by BOTH the `fit` step
 * (per §4b step 1: "Zoom-to-layer-equivalent fit-to-declared-extent") and the `zoom-to-layer` step
 * itself (step 11) -- the SAME real button a real operator would click, never a parallel path. */
async function applyStep(page, step) {
  const box = await page.locator(".working-canvas").boundingBox();
  if (!box) throw new Error(`applyStep(${step.id}): .working-canvas has no bounding box (not mounted/visible?)`);
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;

  if (step.kind === "fit" || step.kind === "zoom-to-layer") {
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyMarkInput?.());
    await page.click(".zoom-to-layer");
    return;
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
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyMarkInput?.());
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + dxScreen, cy + dyScreen, { steps: 10 });
    await page.mouse.up();
    return;
  }

  if (step.kind === "zoom") {
    const delta = step.params.factor >= 1 ? ZOOM_WHEEL_DELTA : ZOOM_OUT_WHEEL_DELTA;
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyMarkInput?.());
    await page.mouse.move(cx, cy);
    await page.mouse.wheel(0, delta);
    return;
  }

  throw new Error(`applyStep(${step.id}): unknown kind "${step.kind}"`);
}

/**
 * Runs the committed trace (or its first `stepLimit` steps, for `--smoke`) against the currently
 * admitted dataset. Per §4b: a step that does not settle within its own `timeoutMs` invalidates the
 * WHOLE TRIAL from that point on -- this function stops issuing further steps and marks every
 * remaining step (including the one that failed to settle) `unmeasured`, rather than recording a
 * partial success (§4b: "the trial is recorded unmeasured -- settle watchdog at step N").
 */
async function runTrace(page, consoleHandle, { stepLimit, instrumentEnabled }) {
  const steps = stepLimit ? CAMERA_TRACE_STEPS.slice(0, stepLimit) : CAMERA_TRACE_STEPS;
  const rows = [];
  let invalidatedAtStep = null;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (invalidatedAtStep !== null) {
      rows.push({ stepId: step.id, kind: step.kind, status: "unmeasured", reason: `settle watchdog at step ${invalidatedAtStep}` });
      continue;
    }

    const stepStartWallMs = Date.now();
    if (instrumentEnabled) {
      await page.evaluate((id) => window.__SPATIAL_E2E__.residencyBeginStep(id), step.id);
      await page.evaluate(() => window.__SPATIAL_E2E__.residencyArmFirstPixel?.());
    }

    const preCount = consoleHandle.renderTrace().length;
    await applyStep(page, step);
    const settle = await waitForSettle(() => consoleHandle.renderTrace(), {
      quietMs: step.settle.quietMs,
      timeoutMs: step.settle.timeoutMs,
    });
    const postCount = consoleHandle.renderTrace().length;
    const wallMs = Date.now() - stepStartWallMs;

    let result = null;
    if (instrumentEnabled) {
      result = await page.evaluate(() => window.__SPATIAL_E2E__.residencyEndStep());
    }

    const frameStats = result ? frameTimeStatsMs(result.frameTimestamps) : { p50: null, p95: null, max: null, sampleCount: 0 };

    rows.push({
      stepId: step.id,
      kind: step.kind,
      status: settle.settled ? "measured" : "unmeasured",
      reason: settle.settled ? undefined : `settle watchdog at step ${i} (${step.id})`,
      wallMs,
      settled: settle.settled,
      renderTraceLinesDuringStep: postCount - preCount,
      counters: result ? result.counters : undefined,
      firstPixelMs: result ? result.firstPixelMs : undefined,
      frameTimeMs: frameStats,
      inputToPresentProxiesMs: result ? result.inputToPresentProxiesMs : undefined,
    });

    if (!settle.settled) {
      invalidatedAtStep = i;
    }
  }

  return { rows, invalidated: invalidatedAtStep !== null, invalidatedAtStep };
}

async function openFixture(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_FILTER_ZONED);
  if (outcome.kind !== "admitted") {
    throw new Error(`openFixture: expected {kind:"admitted"}, got ${JSON.stringify(outcome)} -- ${FIXTURE_FILTER_ZONED}`);
  }
}

// ---------------------------------------------------------------------------------------
// Part C: the wire-bytes-identity assertion (RESIDENCY-PREREGISTRATION.md §6/§8).
//
// **Chosen observable, and why it suffices.** The cheapest honest observable available without any
// new product-side byte counter: the `[render-trace]` console lines `traceViewportQuery` (fires with
// the exact `{dataset, bbox, bboxCrs}` about to be serialized onto the wire, BEFORE the SKP call) and
// `traceStreamBatch` (fires with the exact `{rows, vertices, cumulativeRows, cumulativeVertices}`
// DECODED FROM the wire's response bytes, AFTER `decodeBatch` parses them) already emit,
// UNCONDITIONALLY -- neither is gated behind `import.meta.env.DEV` nor behind the residency
// instrument's own `enabled` flag (`diagnostics/renderTrace.ts`), so they are identical whichever
// arm of this comparison is running. A divergence in either sequence between an instrument-ON and an
// instrument-OFF run of the SAME trace would mean the wire bytes differed: the outgoing bbox values
// are exactly what gets serialized into the `viewport_query` request, and the decoded rows/vertices
// counts are exactly what `decodeBatch` extracted from the response's IPC bytes. Comparing the full
// ORDERED sequence of these lines is therefore a legitimate byte-identity proxy, cheaper than
// capturing raw wire bytes directly and already-instrumented -- the same "proof by byte comparison"
// pattern ADR-004 Amendment 4 established at the wire level, applied here at the client clock (§6's
// own framing). `streamHandle`/`batchSeq` are EXCLUDED from the comparison -- both are server-minted
// per-request identifiers, expected to differ between two separate `viewport_query` calls even with
// byte-identical FILTER/bbox inputs and byte-identical response payload shapes; excluding them is a
// correlation-id normalization, not a weakening of the byte-identity claim itself.
// ---------------------------------------------------------------------------------------

const WIRE_TRACE_STEP_LIMIT = 3; // "a short trace" (piece text) -- steps 1-3, matching --smoke's own scope

/** Attaches a console listener that resolves each line's REAL argument values via `jsHandle.jsonValue()`
 * (not `msg.text()`'s own string formatting, which does not reliably serialize object arguments) --
 * an independent listener from `lib.mjs`'s `attachConsole` (which only keeps `.text()`), so this
 * function owns exactly the data it needs without changing that shared helper. */
function attachWireTraceListener(page) {
  const lines = [];
  const onConsole = (msg) => {
    const args = msg.args();
    if (args.length < 2) return;
    Promise.all(args.map((a) => a.jsonValue().catch(() => undefined))).then((values) => {
      if (values[0] !== "[render-trace]") return;
      const event = values[1];
      if (event !== "viewport_query" && event !== "batch") return;
      lines.push({ event, data: values[2] });
    });
  };
  page.on("console", onConsole);
  return {
    lines,
    dispose: () => page.off("console", onConsole),
  };
}

/** Strips server-minted / per-open correlation ids (`dataset`, `streamHandle`, `batchSeq`) -- see
 * this section's own doc comment for why that exclusion does not weaken the byte-identity claim.
 * **`dataset` found live, this piece's own first `--wire-identity` run**: each `openPath` call mints
 * a FRESH dataset handle (`ds_<hex>`) even for the identical fixture path, so two separate opens
 * (one per arm, `runShortTraceForWire`'s own doc comment) never share one -- confirmed live: the
 * first real run of this comparison differed ONLY in `dataset`, every `bbox`/`rows`/`vertices`
 * figure byte-identical, which is itself the positive result this assertion exists to produce
 * (excluding a correlation id that provably varies by open-instance, not by instrument state). */
function normalizeWireLine(line) {
  if (line.event === "viewport_query") {
    return { event: line.event, bbox: line.data.bbox, bboxCrs: line.data.bboxCrs };
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
 * normalized wire-line sequence observed. Reopens the fixture fresh each call (the same "reopen the
 * same path" pattern `admission-remediation.mjs`'s own steps already rely on repeatedly). */
async function runShortTraceForWire(page, enabled) {
  const wire = attachWireTraceListener(page);
  try {
    await page.evaluate((v) => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(v), enabled);
    await openFixture(page);
    const steps = CAMERA_TRACE_STEPS.slice(0, WIRE_TRACE_STEP_LIMIT);
    for (const step of steps) {
      await applyStep(page, step);
      // A plain settle wait, not `waitForSettle` against `attachConsole` (a separate listener) --
      // this loop only needs "long enough for this step's wire traffic to have landed," a generous
      // fixed margin is honest and simpler than wiring a second quiescence poll against `wire.lines`.
      await sleep(step.settle.quietMs + 1500);
    }
    await page.evaluate(() => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(false));
    // Let any final in-flight console messages resolve their jsonValue() promises.
    await sleep(500);
    return wire.lines.map(normalizeWireLine);
  } finally {
    wire.dispose();
  }
}

async function runWireIdentityCheck(page) {
  console.log("residency-harness --wire-identity: running the short trace with the instrument ON...");
  const onSequence = await runShortTraceForWire(page, true);
  console.log(`  observed ${onSequence.length} wire-relevant render-trace lines`);

  console.log("residency-harness --wire-identity: running the short trace with the instrument OFF...");
  const offSequence = await runShortTraceForWire(page, false);
  console.log(`  observed ${offSequence.length} wire-relevant render-trace lines`);

  const onJson = JSON.stringify(onSequence);
  const offJson = JSON.stringify(offSequence);
  const identical = onJson === offJson;

  console.log("");
  console.log(`== wire-bytes-identity assertion: ${identical ? "PASS -- byte-identical" : "FAIL -- sequences differ"} ==`);
  if (!identical) {
    console.error("instrument-ON sequence:", onJson);
    console.error("instrument-OFF sequence:", offJson);
  }
  return { identical, onSequence, offSequence };
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const smoke = args.has("--smoke");
  const control = args.has("--control");
  const wireIdentity = args.has("--wire-identity");
  const stepLimit = smoke ? 3 : undefined;

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

    if (wireIdentity) {
      const result = await runWireIdentityCheck(page);
      evidence.wireIdentity = result;
      process.exitCode = result.identical ? 0 : 1;
      mkdirSync(OUT_DIR, { recursive: true });
      const evidencePath = join(OUT_DIR, `residency-harness-wire-identity-${Date.now()}.json`);
      writeFileSync(evidencePath, JSON.stringify(evidence, null, 2));
      console.log(`Evidence file: ${evidencePath}`);
      consoleHandle.dispose();
      await browser.close().catch(() => {});
      process.exit(process.exitCode ?? 0);
      return;
    }

    if (!control) {
      await page.evaluate(() => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(true));
    }

    await withTimeout(openFixture(page), 60_000, "open-fixture");

    const { rows, invalidated, invalidatedAtStep } = await runTrace(page, consoleHandle, {
      stepLimit,
      instrumentEnabled: !control,
    });
    evidence.rows = rows;
    evidence.invalidated = invalidated;
    evidence.invalidatedAtStep = invalidatedAtStep;

    if (!control) {
      await page.evaluate(() => window.__SPATIAL_E2E__.residencyInstrumentSetEnabled(false));
    }

    console.log("");
    console.log(`== residency-harness (${evidence.mode}${smoke ? ", smoke" : ""}) -- per-step summary ==`);
    for (const r of rows) {
      const featureBit = r.counters ? `features=${r.counters.featuresDecoded} bytes=${r.counters.bytesDecoded}` : "counters=(instrument off)";
      const fp = r.firstPixelMs != null ? `firstPixel=${r.firstPixelMs}ms` : "firstPixel=n/a";
      console.log(`[${r.stepId}] ${r.status} wallMs=${r.wallMs ?? "n/a"} ${fp} ${featureBit}`);
    }

    process.exitCode = evidence.invalidated ? 1 : 0;
  } catch (e) {
    console.error(`residency-harness: harness failure: ${e.stack ?? e.message}`);
    evidence.harnessError = e.message;
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const suffix = `${control ? "control" : "instrument-on"}${smoke ? "-smoke" : ""}`;
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
