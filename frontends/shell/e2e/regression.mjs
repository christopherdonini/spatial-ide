#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- encodes the automatable steps of
// `MANUAL-WALKTHROUGH.md` as a regression script. Same attach-or-launch path as
// `debug-session.mjs` (`lib.mjs`'s `attachOrLaunch`), same in-page hooks
// (`src/e2e-test-surface.ts`: `openPath`, `capturePixels`), same evidence-class limit --
// this proves what a machine can assert about the DOM and the rendered canvas. The native
// file-picker step (A2) and every look-and-feel judgment call (smoothness, no
// tearing/jitter/ghosting, exit behavior) are NOT covered here and stay operator-verified;
// see the table this script's sibling change adds to `MANUAL-WALKTHROUGH.md`.
//
// Each step below is independently bounded (`withTimeout`) and independently caught: one
// step failing does not stop the rest from running, so the summary table at the end is
// always as complete as the harness itself allows. Exit code is non-zero iff any step
// FAILed; `NET'` is informational only and never fails the run.
//
// `waitForMountReady` gates every run, launch path and attach path alike, before A1' or
// anything else touches the page -- see its own doc comment for the fresh-launch race it
// closes (a WebView2 page target existing is not the same fact as React having mounted).
//
// RELEASE-0.1 item 7 (2026-09-07, MUST-FIX 1, reviewer gate): this file runs on the SHIPPED DEFAULT
// residency arm (candidate) with NO pin of its own -- the whole-suite baseline pin an earlier version
// of this piece added here was over-broad (it left the shipped default with zero regression coverage
// from this suite) and has been REMOVED. `OVERCEIL'`/`REOPEN'` (rider 1's baseline-arm-only
// ceiling-refusal acceptance test) moved to their own process, `e2e/refusal-contract-baseline.mjs` --
// see that file's own top comment for the full account, including why a `page.reload()` mid-script
// was rejected in favor of a separate launch (the `residency-harness.mjs` S4 precedent).

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");

const FIXTURE_100K = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const FIXTURE_NO_CRS = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\no-crs-refused.parquet";
const FIXTURE_MISSING_IDENTITY =
  "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\missing-identity-refused.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures -- --ignored --nocapture";

// Verbatim from `engine/src/error.rs`'s `Display` impl (traced through `kernel/src/skp.rs`'s
// `error_of`, `message = e.to_string()`) -- the same text `MANUAL-WALKTHROUGH.md`'s B2/C2
// rows quote and that `formatRefusal.ts` carries through with no rewording.
const CRS_UNDECLARED_MESSAGE =
  "refused: the file declares no CRS and none was asserted by the caller (no `geo` metadata CRS " +
  "on the primary geometry column). This engine does not apply GeoParquet's OGC:CRS84 default " +
  "(docs/05, no silent conversion)";
const IDENTITY_UNUSABLE_MESSAGE =
  "refused: `id` cannot serve as stable feature identity — the file has no such column, and no " +
  "identity mapping was declared. Stable per-feature identity is required (docs/11); declare a " +
  "mapping to a column that carries it. Synthesizing a row ordinal instead is the hazard ADR-010 " +
  "rule 2 exists to prevent";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Bounds one step's whole async body. Never leaves the raced-out promise's eventual
 * settlement unhandled (attaching `.then(success, failure)` to it directly, not a bare
 * `.catch()`) -- an operation that outlives its timeout keeps running in the page, but this
 * script never awaits it again. */
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

async function waitForCondition(getValue, predicate, timeoutMs, pollMs = 200) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await getValue();
    if (predicate(last)) return { ok: true, last };
    await sleep(pollMs);
  }
  return { ok: false, last };
}

const MOUNT_READY_TIMEOUT_MS = 90_000;

/**
 * Bounded pre-flight gate, run before every step (A1' included) on the launch path and the
 * attach path alike. A 2026-08-12 fresh-launch run found `findAppPage` (`lib.mjs`) returning
 * the moment the WebView2 page *target* exists -- which can be well before React has actually
 * mounted (`e2e/out/app.log` showed cargo still finishing a 26s recompile at that point), so
 * `.app-header` evaluated `null`, every hook-dependent step reported the hooks absent, and the
 * run looked like an app defect when it was actually "too early," not "never." Every previous
 * run in this script's history attached to an already-loaded app, which masked this.
 *
 * Polls with a *fresh* `page.evaluate` call every tick, never holding a handle across
 * iterations -- so a stray navigation mid-mount (vite's client can trigger one; the second,
 * related risk this gate also has to tolerate) costs this loop one tick's `catch`, not a
 * stale-context throw or a wedge. On timeout it fails loudly, naming exactly what never
 * appeared and dumping enough of the page's own state to diagnose why without a second run.
 */
async function waitForMountReady(page, timeoutMs = MOUNT_READY_TIMEOUT_MS) {
  const start = Date.now();
  let lastHeader = null;
  let lastHookPresent = false;
  let lastEvalError = null;

  while (Date.now() - start < timeoutMs) {
    try {
      const info = await page.evaluate(() => ({
        header: document.querySelector(".app-header")?.textContent ?? null,
        hookPresent: typeof window.__SPATIAL_E2E__?.openPath === "function",
      }));
      lastHeader = info.header;
      lastHookPresent = info.hookPresent;
      lastEvalError = null;
      if (lastHeader !== null && lastHookPresent) {
        return { readyAfterMs: Date.now() - start };
      }
    } catch (e) {
      // Most likely "Execution context was destroyed" from a mid-poll navigation -- the next
      // iteration's `evaluate` resolves a fresh context from `page` automatically, since
      // nothing here holds a handle that could go stale across iterations.
      lastEvalError = e?.message ?? String(e);
    }
    await sleep(300);
  }

  let readyState = "(unavailable -- evaluate itself failed; see last evaluate error below)";
  let bodySnippet = "(unavailable)";
  try {
    const diag = await page.evaluate(() => ({
      readyState: document.readyState,
      bodySnippet: document.body ? document.body.innerHTML.slice(0, 200) : "(no body element)",
    }));
    readyState = diag.readyState;
    bodySnippet = diag.bodySnippet;
  } catch {
    // Page is truly wedged; the fallback strings above and `lastEvalError` are what's left to report.
  }

  const missing = [];
  if (lastHeader === null) missing.push(".app-header non-null");
  if (!lastHookPresent) missing.push("window.__SPATIAL_E2E__.openPath present");

  throw new Error(
    `mount-readiness gate: timed out after ${timeoutMs}ms waiting for ${missing.join(" and ")}. ` +
      `document.readyState=${readyState}, page url=${page.url()}` +
      (lastEvalError ? `, last evaluate error=${lastEvalError}` : "") +
      `, body.innerHTML (first 200 chars)=${JSON.stringify(bodySnippet)}`
  );
}

/** The fixed 3x3 grid `debug-session.mjs` already uses -- kept identical so a report from
 * either tool means the same regions. Fractions are in `PixelRegion`'s own convention
 * (`e2e-test-surface.ts`): the WebGL `readPixels` origin, bottom-left. */
function gridRegions() {
  const regions = [];
  for (let gy = 0; gy < 3; gy++) {
    for (let gx = 0; gx < 3; gx++) {
      regions.push({ x: gx / 3, y: gy / 3, w: 1 / 3, h: 1 / 3 });
    }
  }
  return regions;
}

function fractionOf(summary) {
  return summary.totalPixels > 0 ? summary.nonBackgroundCount / summary.totalPixels : 0;
}

/** Maps a fractional point *inside* a grid region (`fx`/`fy` in 0..1, region-local) to a CSS
 * point on the page. `region.x`/`region.y` are WebGL buffer fractions (0,0 = bottom-left);
 * `getBoundingClientRect()` is CSS-pixel, top-left origin, and may differ from the drawing
 * buffer's own pixel size under DPR scaling -- fractions of each are what actually line up,
 * raw pixel counts from one do not transfer to the other. */
function bufferRegionToCss(region, canvasRect, fx, fy) {
  const xFrac = region.x + region.w * fx;
  const yFracBuffer = region.y + region.h * fy;
  const yFracCss = 1 - yFracBuffer; // flip: buffer 0=bottom, CSS 0=top
  return {
    x: canvasRect.left + xFrac * canvasRect.width,
    y: canvasRect.top + yFracCss * canvasRect.height,
  };
}

async function canvasRect(page) {
  return page.evaluate(() => {
    const el = document.querySelector(".working-canvas");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { left: r.left, top: r.top, width: r.width, height: r.height };
  });
}

async function assertNoRefusalOrBanner(page, stepId) {
  const found = await page.evaluate(() => ({
    canvasRefusalText: document.querySelector(".canvas-refusal")?.textContent ?? null,
    errorBannerText: document.querySelector(".error-banner")?.textContent ?? null,
  }));
  if (found.canvasRefusalText !== null) throw new Error(`${stepId}: .canvas-refusal present: ${found.canvasRefusalText}`);
  if (found.errorBannerText !== null) throw new Error(`${stepId}: .error-banner present: ${found.errorBannerText}`);
}

async function doPan(page, center, dx, dy) {
  await page.mouse.move(center.x, center.y);
  await page.mouse.down();
  await page.mouse.move(center.x + dx, center.y + dy, { steps: 8 });
  await page.mouse.up();
}

async function doWheel(page, center, deltaY) {
  await page.mouse.move(center.x, center.y);
  await page.mouse.wheel(0, deltaY);
}

function hasFreshRenderTraceMotion(entries, sinceCount) {
  return entries.length > sinceCount && entries.slice(sinceCount).some((e) => /view-state|viewport_query/.test(e.text));
}

/**
 * 2026-08-13 fix (coordinator-authorized instrument round): converts one of `capturePixels`'s new
 * `samplePoint` drawing-buffer coordinates to a CSS page point, deriving the scale from the actual
 * buffer/box dimensions rather than assuming DPR -- `bufferWidth`/`bufferHeight` are
 * `capturePixels`'s own `width`/`height` fields, which are literally `gl.drawingBufferWidth`/
 * `gl.drawingBufferHeight` (`WorkingCanvas.tsx`'s `capturePixels` closure), not re-derived here.
 * `flipY` toggles between the two plausible row-0 conventions -- WebGL's own `readPixels` spec says
 * row 0 is the *bottom* of the buffer (the `flipY: true` case), but `stepA9` verifies this
 * empirically per point rather than assuming it, per the coordinator's own note.
 *
 * Half-pixel centering (nit, reviewer round): `point.x`/`point.y` are integer buffer pixel
 * *indices*, not fractional positions -- mapping index 0 straight through (`0 * scaleX`) lands
 * exactly on the box's outer edge (for `flipY`, one full row *outside* the box, since the bottom
 * edge is `canvasRect.top + canvasRect.height`, not a point inside it), not the centre of that
 * pixel's own footprint, which is where a real mouse-move needs to land for deck.gl's own
 * hit-testing to see the same pixel `capturePixels` read back. `+ 0.5` fixes that. Clamped into the
 * box afterward as a floor/ceiling, not a correctness dependency of the centering itself -- every
 * `point.x`/`point.y` this function is actually called with is a valid buffer index
 * (`0..width-1`/`0..height-1`), so the clamp should never actually trigger.
 */
function bufferPointToCss(point, canvasRect, bufferWidth, bufferHeight, flipY) {
  const scaleX = canvasRect.width / bufferWidth;
  const scaleY = canvasRect.height / bufferHeight;
  const cssX = canvasRect.left + (point.x + 0.5) * scaleX;
  const cssY = flipY
    ? canvasRect.top + canvasRect.height - (point.y + 0.5) * scaleY
    : canvasRect.top + (point.y + 0.5) * scaleY;
  return {
    x: Math.min(canvasRect.left + canvasRect.width, Math.max(canvasRect.left, cssX)),
    y: Math.min(canvasRect.top + canvasRect.height, Math.max(canvasRect.top, cssY)),
  };
}

function samePoint(a, b) {
  return !!a && !!b && a.x === b.x && a.y === b.y;
}

/**
 * A9' interior-pixel hardening (action-console cut, P5c fix 2). Diagnosed by P5b
 * (`e2e/README.md`'s own EXPECTED-FAIL note, and this piece's own state file): `stepA9`'s old
 * "first non-background pixel" test (`nonBackgroundCount > 0`, i.e. *any* channel nonzero) is
 * satisfied by a low-alpha anti-aliased boundary pixel (the diagnosed miss: `12,23,43,45`) just as
 * readily as by a fully-covered interior one -- deck.gl's own pick layer can miss the former while
 * the fill layer still draws it, so `capturePixels`' "first pixel scanned" or "densest histogram
 * bin" heuristics can hand `stepA9` an edge pixel that LOOKS non-background but was never a safe
 * hover target. This never changes what `stepA9` asserts (hover -> pick -> `.hover-readout` shows
 * the feature id) -- only how candidate points are ORDERED/filtered before the existing mouse-move
 * loop tries them, and entirely from e2e code: it reuses the ALREADY-exposed
 * `capturePixels(regions)` hook (`e2e-test-surface.ts`), never touching `WorkingCanvas.tsx`'s own
 * `summarizePixels`/`capturePixels` implementation, which has no per-pixel alpha exposed to a
 * `PixelRegion` scan (`nonBackgroundCount` is a count of "any channel nonzero" pixels, not an
 * alpha-thresholded one) -- so this can only combine two signals BOTH already reachable through
 * that hook, not invent a third.
 *
 * **Signal 1, INTERIOR (per-candidate, exact):** every pixel in a 5x5 patch centred on the
 * candidate (clamped at the buffer edge) is independently confirmed non-background via a batch of
 * 1x1-pixel `PixelRegion`s in one `capturePixels` call -- `nonBackgroundCount === totalPixels` for
 * every one of them. A genuinely anti-aliased/AA-blended boundary pixel fails this by construction
 * (a boundary pixel, by definition, has at least one neighbour still on the background side); a
 * pixel several pixels deep inside a filled polygon passes it.
 *
 * **Signal 2, ALPHA (frame-wide, best-effort):** `topColors` already carries the EXACT
 * (non-quantized) rgba sample the frame-wide `samplePoint` was drawn from
 * (`WorkingCanvas.tsx::summarizePixels`: `overallSamplePoint` IS `densestNonBackgroundBin
 * .samplePoint`, and `topColors` is that same `sortedBins` list in the same order) -- so this reads
 * a REAL alpha value off real data, never a guess, for whichever non-background colour is densest
 * in the captured frame. `ALPHA_INTERIOR_THRESHOLD` below is picked from that same real data, not
 * the task's own illustrative "e.g. >= 200": `style/document.ts`'s `DEFAULT_STYLE_STATE.fillOpacity`
 * is `180 / 255` (a fully-covered fill pixel over a cleared/transparent buffer therefore renders at
 * EXACTLY alpha 180, confirmed against `buildLayers.test.ts`'s own `toResolvedDrawParams` fixture --
 * this suite never touches the style panel, so this is the alpha every A9' run actually renders at),
 * and the diagnosed edge-pixel miss was alpha 45 -- a threshold of 200 would wrongly reject this
 * app's own genuine, fully-opaque interior pixels. 150 sits comfortably between (105 above the
 * diagnosed edge case, 30 below full fill), so it is used here instead, with this paragraph as its
 * own "picked from the data, commented" justification.
 *
 * Because a `PixelRegion` scan cannot attribute an exact alpha to an arbitrary REGION-LOCAL
 * candidate (only the frame-wide densest bin gets that exact cross-reference), signal 2 is applied
 * as a frame-wide sanity check (does the current frame have a genuinely high-alpha non-background
 * colour anywhere at all, not "was this exact candidate drawn from it") alongside signal 1's own
 * exact per-candidate interior guarantee, rather than overclaimed as an exact per-pixel alpha read
 * for every candidate -- disclosed here rather than silently narrowed.
 */
const INTERIOR_PATCH_RADIUS = 2; // 5x5 patch (task's own "or a 5x5 patch" option) -- one pixel
// wider than a bare 3x3/8-neighbourhood, for margin against a 2px-wide AA transition band.
const ALPHA_INTERIOR_THRESHOLD = 150; // of 255 -- see this section's own doc comment for the data.

/** Builds up to (2*radius+1)^2 single-pixel `PixelRegion`s (fractional, `capturePixels`' own
 * convention) covering the patch centred on `point`, clamped to the buffer bounds -- a candidate
 * near the buffer edge simply gets fewer regions, which only makes the interior check MORE strict
 * (every requested region must still be fully non-background), never silently lenient. */
function neighborhoodRegions(point, bufferWidth, bufferHeight, radius) {
  const regions = [];
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const x = point.x + dx;
      const y = point.y + dy;
      if (x < 0 || y < 0 || x >= bufferWidth || y >= bufferHeight) continue;
      regions.push({ x: x / bufferWidth, y: y / bufferHeight, w: 1 / bufferWidth, h: 1 / bufferHeight });
    }
  }
  return regions;
}

function parseAlpha(rgba) {
  const parts = rgba.split(",").map(Number);
  return parts.length === 4 ? parts[3] : NaN;
}

/** Runs both signals above for one candidate point, in a single fresh `capturePixels` call (the
 * hook forces its own synchronized re-render/readback per call -- see its own doc comment -- so
 * this is one atomic read of the current frame, not a race against a later one). Returns a reason
 * string either way, for the loud fallback log line this function's own caller writes when no
 * candidate verifies. */
async function verifyInteriorCandidate(page, point, bufferWidth, bufferHeight) {
  const regions = neighborhoodRegions(point, bufferWidth, bufferHeight, INTERIOR_PATCH_RADIUS);
  if (regions.length === 0) {
    return { ok: false, reason: "no in-bounds neighbourhood pixels (candidate at the buffer's own corner)" };
  }
  const summary = await page.evaluate((r) => window.__SPATIAL_E2E__.capturePixels(r), regions);
  const allInterior = summary.regions.every((r) => r.totalPixels > 0 && r.nonBackgroundCount === r.totalPixels);
  if (!allInterior) {
    const missCount = summary.regions.filter((r) => r.nonBackgroundCount !== r.totalPixels).length;
    return { ok: false, reason: `${missCount}/${summary.regions.length} neighbourhood pixels touch background (edge-adjacent)` };
  }
  const highAlphaBin = (summary.topColors ?? []).find((c) => c.rgba !== "0,0,0,0" && parseAlpha(c.rgba) >= ALPHA_INTERIOR_THRESHOLD);
  if (!highAlphaBin) {
    return {
      ok: false,
      reason: `neighbourhood fully non-background but no captured colour has alpha >= ${ALPHA_INTERIOR_THRESHOLD} (topColors: ${(summary.topColors ?? []).map((c) => c.rgba).join(" | ")})`,
    };
  }
  return { ok: true, reason: `${regions.length}-pixel neighbourhood entirely non-background; alpha ${parseAlpha(highAlphaBin.rgba)} >= ${ALPHA_INTERIOR_THRESHOLD} (${highAlphaBin.rgba})` };
}

// ---------------------------------------------------------------------------------------
// Steps. Each returns a short PASS note (string) or throws with a message naming its own
// step ID (per-step `withTimeout` bounds every one of these, so a hang inside becomes a
// FAIL with a timeout message rather than a silent wait).
// ---------------------------------------------------------------------------------------

async function stepA1(page) {
  const info = await page.evaluate(() => ({
    title: document.title,
    header: document.querySelector(".app-header")?.textContent ?? null,
    hasOpenButton: Array.from(document.querySelectorAll("button")).some((b) => b.textContent?.includes("Open GeoParquet")),
  }));
  if (info.title !== "Spatial IDE") throw new Error(`A1': document.title was "${info.title}", expected "Spatial IDE"`);
  if (info.header !== "Spatial IDE") throw new Error(`A1': .app-header text was "${info.header}", expected "Spatial IDE"`);
  if (!info.hasOpenButton) throw new Error(`A1': no button containing "Open GeoParquet" found in the DOM`);
  return 'title/header "Spatial IDE" present; "Open GeoParquet…" button present';
}

async function stepA3(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_100K);
  if (outcome.kind !== "admitted") {
    throw new Error(`A3': openPath(100k fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  }
  const summaryText = await page.evaluate(() => document.querySelector(".describe-summary")?.textContent ?? null);
  if (summaryText === null) throw new Error("A3': .describe-summary not found in DOM after admission");
  // Exact strings DescribeSummary.tsx actually renders (`{crs.identifier} — {crs.source}, axis
  // order {axis_order}`, `{geometry.column} ({geometry.encoding})`, `{identity.source} —
  // {identity.uniqueness}`, `{row_count.value} ({row_count.basis})`, license fallback "not
  // declared") -- not guessed, read from the component and cross-checked against
  // `engine/src/fixture.rs`'s `FixtureSpec::default()`.
  const expected = ["EPSG:2056", "geometry (geoarrow.polygon)", "file:id", "100000", "not declared"];
  const missing = expected.filter((s) => !summaryText.includes(s));
  if (missing.length) throw new Error(`A3': DescribeSummary missing expected text: ${missing.join(", ")}. Full text: ${summaryText}`);
  // P6 review, nit: scoped to `.admission-panel .admission-refusal` -- `FilterPanel`'s own refusal
  // display (`.filter-refusal`) wraps the SAME shared `RefusalBlock` component (`.admission-refusal`
  // class names preserved byte-exactly, CUT-STATE.md P3), so a bare `.admission-refusal` selector can
  // now match either render site, making this assertion fragile to DOM order rather than actually
  // checking the admission panel specifically.
  const refusalPanel = await page.evaluate(() => document.querySelector(".admission-panel .admission-refusal") !== null);
  if (refusalPanel) throw new Error("A3': .admission-panel .admission-refusal panel present after a successful admission");
  // "these five expected substrings" -- checking `summaryText.includes(...)` five times is not the
  // same claim as "verbatim" (a full-text match of the whole summary block); see
  // `MANUAL-WALKTHROUGH.md`'s own coverage table for the corrected wording.
  return "admitted; DescribeSummary contains the five expected substrings; no refusal panel appears";
}

async function stepA4(page, consoleHandle) {
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const overall = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const grid = await page.evaluate((regions) => window.__SPATIAL_E2E__.capturePixels(regions), gridRegions());
  const overallFraction = fractionOf(overall);
  const gridFractions = grid.regions.map(fractionOf);
  const populatedCells = gridFractions.filter((f) => f > 0.05).length;
  const hasZoomButton = await page.evaluate(() =>
    Array.from(document.querySelectorAll("button")).some((b) => b.textContent?.includes("Zoom to layer"))
  );
  if (overallFraction <= 0.02) {
    throw new Error(`A4': overall non-background fraction ${(overallFraction * 100).toFixed(2)}% <= 2% (settled=${settle.settled})`);
  }
  if (populatedCells < 3) {
    throw new Error(
      `A4': only ${populatedCells}/9 grid cells > 5% non-background (fractions: ${gridFractions.map((f) => (f * 100).toFixed(1) + "%").join(", ")})`
    );
  }
  if (!hasZoomButton) throw new Error('A4\': "Zoom to layer" button not found');
  return `overall ${(overallFraction * 100).toFixed(1)}% non-bg; ${populatedCells}/9 grid cells > 5%; "Zoom to layer" present (settled=${settle.settled})`;
}

async function stepA5A6(page, consoleHandle) {
  const rect = await canvasRect(page);
  if (!rect) throw new Error("A5'/A6': .working-canvas not found");
  const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

  const beforePan = consoleHandle.renderTrace().length;
  await doPan(page, center, 120, 60);
  const panSettle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });
  await assertNoRefusalOrBanner(page, "A5'/A6' (pan)");
  if (!hasFreshRenderTraceMotion(consoleHandle.renderTrace(), beforePan)) {
    throw new Error("A5'/A6': no fresh [render-trace] view-state/viewport_query entry after pan");
  }

  const beforeZoom = consoleHandle.renderTrace().length;
  await doWheel(page, center, -300); // in
  await doWheel(page, center, 300); // out
  const zoomSettle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });
  await assertNoRefusalOrBanner(page, "A5'/A6' (zoom)");
  if (!hasFreshRenderTraceMotion(consoleHandle.renderTrace(), beforeZoom)) {
    throw new Error("A5'/A6': no fresh [render-trace] view-state/viewport_query entry after zoom");
  }

  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const frac = fractionOf(pixels);
  if (frac <= 0.02) throw new Error(`A5'/A6': pixels non-background fraction ${(frac * 100).toFixed(2)}% <= 2% after pan+zoom`);

  return `pan settled=${panSettle.settled}, zoom settled=${zoomSettle.settled}; no refusal/banner either time; pixels ${(frac * 100).toFixed(1)}% non-bg after`;
}

/**
 * 2026-08-14 walkthrough fix: the original A7' panned a *fixed* 4x300px, which never actually left
 * the data extent -- masking the operator-found defect (`fitToBounds` fit only current residency,
 * and the supersede-on-pan clearing (2026-08-13 D2 fix) empties residency once the viewport leaves
 * the data, leaving "Zoom to layer" with no target exactly when the user is lost). This drags
 * repeatedly in one consistent direction, each time re-checking `capturePixels` for the whole
 * canvas, until the viewport is *provably* off the data (non-background fraction at or below
 * `OFF_DATA_THRESHOLD`) -- not a fixed drag count. Bounded at `maxDrags` and fails loudly, naming
 * the last observed fraction, rather than silently accepting "still on data" as good enough to
 * proceed (a pass here would no longer mean what A7's own scenario -- "panned fully out of view" --
 * requires).
 */
const OFF_DATA_THRESHOLD = 0.005; // 0.5% non-background counts as "provably empty" for this purpose
const OFF_DATA_MAX_DRAGS = 10;

async function panUntilOffData(page, consoleHandle, rect, center) {
  // Deliberately larger than the old fixed 300px stride (and than `rect.width`, so even a single
  // drag covers more than one full canvas width of world-space at the current zoom) -- the old
  // stride's own failure to leave the extent is exactly what this fix responds to.
  const dragPx = Math.max(600, Math.round(rect.width * 1.5));
  let fraction = 1;
  let drags = 0;
  for (; drags < OFF_DATA_MAX_DRAGS; drags++) {
    await doPan(page, center, -dragPx, 0);
    await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 800, timeoutMs: 10_000 });
    const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
    fraction = fractionOf(pixels);
    if (fraction <= OFF_DATA_THRESHOLD) {
      drags += 1;
      break;
    }
  }
  if (fraction > OFF_DATA_THRESHOLD) {
    throw new Error(
      `A7': failed to pan off the data extent after ${OFF_DATA_MAX_DRAGS} drags of ${dragPx}px each ` +
        `(still ${(fraction * 100).toFixed(2)}% non-bg, threshold ${(OFF_DATA_THRESHOLD * 100).toFixed(1)}%) -- ` +
        `cannot exercise A7's own "panned fully out of view" scenario`
    );
  }
  return { drags, dragPx, fraction };
}

/** [Post-PASS sweep nit] Finds and clicks the "Zoom to layer" button via a plain DOM `btn.click()`,
 * never a real `page.mouse.click()` at its screen position -- the pointer must never move for K6's
 * own "pointer stationary" premise to hold when this is reused there. One find-and-click, shared by
 * `stepA7` and `clickZoomToLayer` below -- each call site settles and asserts on its own terms
 * afterward, unchanged by this extraction. */
async function clickZoomToLayerButton(page, label) {
  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("Zoom to layer"));
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!clicked) throw new Error(`${label}: "Zoom to layer" button not found to click`);
}

async function stepA7(page, consoleHandle) {
  const rect = await canvasRect(page);
  if (!rect) throw new Error("A7': .working-canvas not found");
  const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

  const offData = await panUntilOffData(page, consoleHandle, rect, center);
  await assertNoRefusalOrBanner(page, "A7' (pan off-data)");

  await clickZoomToLayerButton(page, "A7'");

  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const frac = fractionOf(pixels);
  if (frac <= 0.02) {
    throw new Error(
      `A7': pixels non-background fraction ${(frac * 100).toFixed(2)}% <= 2% after "Zoom to layer" ` +
        `(settled=${settle.settled}; was provably off-data first: ${(offData.fraction * 100).toFixed(2)}% non-bg ` +
        `after ${offData.drags} drag(s) of ${offData.dragPx}px)`
    );
  }
  return (
    `panned off-data (${offData.drags} drag(s) of ${offData.dragPx}px, ${(offData.fraction * 100).toFixed(2)}% non-bg ` +
    `<= ${(OFF_DATA_THRESHOLD * 100).toFixed(1)}% threshold), clicked "Zoom to layer", pixels ${(frac * 100).toFixed(1)}% ` +
    `non-bg after (settled=${settle.settled})`
  );
}

async function stepA8(page, consoleHandle) {
  const rect = await canvasRect(page);
  if (!rect) throw new Error("A8': .working-canvas not found");
  const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

  // >=15 alternating pan/zoom gestures, no settle waits between -- and net-zero-ish drift on
  // both axes, so a genuinely working app should still show *something* by the time A9'
  // looks for a feature to hover a few steps later (an intentionally impatient-use burst,
  // not a "throw the camera away" one).
  const panDx = [100, -100, 60, -60, 80, -80, 40, -40];
  const wheelDy = [-150, 150, -100, 100, -200, 200, -120, 120];
  for (let i = 0; i < 16; i++) {
    if (i % 2 === 0) {
      await doPan(page, center, panDx[i / 2], 0);
    } else {
      await doWheel(page, center, wheelDy[(i - 1) / 2]);
    }
  }

  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 30_000 });
  await assertNoRefusalOrBanner(page, "A8'");
  const domText = await page.evaluate(() => document.body.textContent ?? "");
  const hitConsole = consoleHandle.entries.some((e) => e.text.includes("too_many_pending_streams"));
  const hitDom = domText.includes("too_many_pending_streams");
  if (hitConsole || hitDom) {
    throw new Error(`A8': "too_many_pending_streams" observed (console=${hitConsole}, dom=${hitDom})`);
  }
  return `16 alternating pan/zoom gestures, no settle waits between; settled after=${settle.settled}; no refusal/banner; no too_many_pending_streams`;
}

// A9' candidate selection fix (action-console cut P11, DECISIONS-PENDING.md entries 20/21,
// CUT-STATE.md's own P10 record). P10's evidence-driven zoom search (its own shape kept below,
// notch budget unchanged) exhausted all 15 notches on both fresh runs: frame-wide non-background
// pixels climbed to 90,250/256,000 at notch 2, then fell to exactly 0 by notch 7 -- and EVERY
// candidate along the way sat at buffer row y=0, the frame's own top edge. That is not P9's own
// scale diagnosis failing (entry 21 stays uncontradicted) -- it is a candidate-SELECTION defect:
// `WorkingCanvas.tsx`'s `summarizePixels` documents its own `samplePoint` (per-region AND
// frame-wide alike) as "the first non-background pixel encountered in that region's row-major
// scan" -- structurally the TOP EDGE of whatever content a region contains, at every zoom, never
// an interior pixel by construction. `verifyInteriorCandidate` (P5c, kept UNCHANGED below)
// demands a full 5x5-interior patch; a structurally-top-edge point can only ever supply one by
// accident. (The pre-P5c green worked through deck.gl's own pick tolerance around an edge pixel,
// never because an interior pixel was actually sampled -- P10's own CUT-STATE.md synthesis.)
//
// The fix, entirely e2e-side, never touching `WorkingCanvas.tsx`: `findInteriorCandidate` (below)
// replaces `samplePoint`-based selection with densest-PATCH bisection, reusing the same
// already-exposed `capturePixels(regions)` hook P9 drove per-row. A coarse grid over the whole
// buffer picks its densest region; that region is subdivided and the densest sub-region kept;
// repeated once more only if the patch is still bigger than ~12x12px. The FINAL patch's CENTER
// pixel is the candidate -- interior by construction whenever the patch's own non-background
// fraction is high, unlike a row-major "first pixel" scan. The densest grid region's own
// `samplePoint` rides along as a second, fallback candidate; `verifyInteriorCandidate` still
// decides, unchanged, so a wrong bisection guess can never silently pass.
//
// The zoom search keeps P10's shape (one notch at a time, re-verifying after each) with two
// changes: notch 0 (the CURRENT camera, no zoom yet) is tried FIRST -- P10 never tried pre-zoom
// at all -- and an early-stop: if the frame's own non-background pixel count decreases for two
// consecutive notches, the search stops (P10's own rise-then-fall-to-zero curve is exactly that
// signature -- zooming further only walks the viewport away from data, never named a fix target
// here since this piece is selection-only). A miss even after that still fails loudly with full
// per-notch evidence, never silently falling back to the old first-non-background heuristic.
const ZOOM_NOTCH_DELTA_Y = -300; // one "zoom in" wheel notch -- the same magnitude A5'/A6'/A8'
// already use for their own zoom gestures, just repeated here rather than reinvented.
const MAX_ZOOM_NOTCHES = 15; // entry 21/P10's own bound, unchanged by this fix -- the search below
// tries notch 0 (no zoom) FIRST, then up to this many zoom-in notches, so up to 16 attempts total.

/** Wheels in ONE notch from the canvas centre (`doWheel`'s own mechanics, unchanged), settles,
 * and reports whether the render trace actually moved -- evidence for the per-notch report
 * either way. Settling once per notch, not once per fixed-size batch (the attempt this replaces),
 * is what "evidence-driven" means here: the loop below re-evaluates the interior check against a
 * fully-settled frame before ever deciding whether to zoom again. */
async function zoomInOneNotch(page, consoleHandle, center) {
  const before = consoleHandle.renderTrace().length;
  await doWheel(page, center, ZOOM_NOTCH_DELTA_Y);
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });
  return { motion: hasFreshRenderTraceMotion(consoleHandle.renderTrace(), before), settled: settle.settled };
}

const BISECTION_COARSE_COLS = 8; // task's own "e.g. 8x5" coarse grid
const BISECTION_COARSE_ROWS = 5;
const BISECTION_SUBDIVIDE = 4; // 4x4, both bisection levels
const BISECTION_FINAL_PATCH_MAX_PX = 12; // "repeat once more if the sub-region is still larger
// than ~12x12 px" -- task's own stopping bound.
const BISECTION_DENSE_FRACTION_TARGET = 0.9; // task's own confidence bar for the final patch;
// not a loop-control value -- `findInteriorCandidate` always runs its full 2-3 levels and simply
// reports whether this bar was met, leaving the actual accept/reject call to
// `verifyInteriorCandidate` (unchanged) as before.

/** Splits `region` (a `PixelRegion`-shaped fractional rectangle, `capturePixels`' own convention)
 * into a `cols`x`rows` grid of equal-sized sub-regions, same convention throughout. */
function subdivideRegion(region, cols, rows) {
  const out = [];
  for (let gy = 0; gy < rows; gy++) {
    for (let gx = 0; gx < cols; gx++) {
      out.push({
        x: region.x + (gx / cols) * region.w,
        y: region.y + (gy / rows) * region.h,
        w: region.w / cols,
        h: region.h / rows,
      });
    }
  }
  return out;
}

/** One `capturePixels(regions)` call, returning the densest (highest non-background fraction)
 * region among them alongside the full summary -- callers need `summary.width`/`summary.height`
 * to convert the winning region's own fractional rectangle to buffer pixels. */
async function captureDensest(page, regions) {
  const summary = await page.evaluate((r) => window.__SPATIAL_E2E__.capturePixels(r), regions);
  let idx = 0;
  for (let i = 1; i < summary.regions.length; i++) {
    if (fractionOf(summary.regions[i]) > fractionOf(summary.regions[idx])) idx = i;
  }
  return { summary, region: regions[idx], fraction: fractionOf(summary.regions[idx]) };
}

/**
 * Densest-patch bisection (action-console P11 -- see this section's own top comment for the full
 * account of why `samplePoint` alone cannot supply an interior candidate). Never touches
 * `WorkingCanvas.tsx`; only calls the already-exposed `capturePixels(regions)` hook, same as every
 * other candidate-selection fix in this file. (a) coarse grid over the whole buffer, densest
 * region kept; (b) that region subdivided, densest sub-region kept; (c) repeated once more only if
 * the sub-region from (b) is still bigger than `BISECTION_FINAL_PATCH_MAX_PX` per side; (d) the
 * final patch's CENTER pixel (buffer coordinates) is returned as `candidate`, interior by
 * construction whenever `finalFraction` is high -- `denseEnough` names the task's own 0.9 bar,
 * reported for evidence but never itself gating anything (`verifyInteriorCandidate` decides).
 */
async function findInteriorCandidate(page) {
  const levels = [];
  const whole = { x: 0, y: 0, w: 1, h: 1 };

  // (a) coarse grid over the whole buffer.
  let picked = await captureDensest(page, subdivideRegion(whole, BISECTION_COARSE_COLS, BISECTION_COARSE_ROWS));
  levels.push({ label: `coarse ${BISECTION_COARSE_COLS}x${BISECTION_COARSE_ROWS}`, fraction: picked.fraction });
  let bufferWidth = picked.summary.width;
  let bufferHeight = picked.summary.height;
  let bestRegion = picked.region;
  let bestFraction = picked.fraction;

  if (picked.fraction > 0) {
    // (b) subdivide the densest coarse region.
    picked = await captureDensest(page, subdivideRegion(bestRegion, BISECTION_SUBDIVIDE, BISECTION_SUBDIVIDE));
    levels.push({ label: `subdivide ${BISECTION_SUBDIVIDE}x${BISECTION_SUBDIVIDE} (level 1)`, fraction: picked.fraction });
    bufferWidth = picked.summary.width;
    bufferHeight = picked.summary.height;
    bestRegion = picked.region;
    bestFraction = picked.fraction;

    // (c) repeat once more only if that sub-region is still bigger than ~12x12px.
    const patchPxW = bestRegion.w * bufferWidth;
    const patchPxH = bestRegion.h * bufferHeight;
    if (bestFraction > 0 && (patchPxW > BISECTION_FINAL_PATCH_MAX_PX || patchPxH > BISECTION_FINAL_PATCH_MAX_PX)) {
      picked = await captureDensest(page, subdivideRegion(bestRegion, BISECTION_SUBDIVIDE, BISECTION_SUBDIVIDE));
      levels.push({ label: `subdivide ${BISECTION_SUBDIVIDE}x${BISECTION_SUBDIVIDE} (level 2)`, fraction: picked.fraction });
      bufferWidth = picked.summary.width;
      bufferHeight = picked.summary.height;
      bestRegion = picked.region;
      bestFraction = picked.fraction;
    }
  }

  // (d) the final patch's CENTER pixel is the candidate.
  const centerXFrac = bestRegion.x + bestRegion.w / 2;
  const centerYFrac = bestRegion.y + bestRegion.h / 2;
  const candidate = {
    x: Math.min(bufferWidth - 1, Math.max(0, Math.round(centerXFrac * bufferWidth))),
    y: Math.min(bufferHeight - 1, Math.max(0, Math.round(centerYFrac * bufferHeight))),
  };

  return {
    candidate,
    bufferWidth,
    bufferHeight,
    finalFraction: bestFraction,
    denseEnough: bestFraction >= BISECTION_DENSE_FRACTION_TARGET,
    levels,
  };
}

async function stepA9(page, consoleHandle) {
  const initialRect = await canvasRect(page);
  if (!initialRect) throw new Error("A9': .working-canvas not found");
  const center = { x: initialRect.left + initialRect.width / 2, y: initialRect.top + initialRect.height / 2 };

  let notchesUsed = 0;
  let rect = initialRect;
  let grid, fractions, denseIdx, emptyIdx, interiorVerified, orderedCandidates;
  let successBisectionFraction = null;
  const notchEvidence = [];
  let previousNonBackgroundCount = null;
  let declineStreak = 0;
  let overshootStopped = false;

  // Notch 0 = the CURRENT camera, tried FIRST (P10 never tried pre-zoom at all); notches
  // 1..MAX_ZOOM_NOTCHES are real wheel-zoom-ins, exactly as P10 drove them.
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES; notch++) {
    let zoomMotion = null;
    let zoomSettled = null;
    if (notch > 0) {
      const zoomResult = await zoomInOneNotch(page, consoleHandle, center);
      zoomMotion = zoomResult.motion;
      zoomSettled = zoomResult.settled;
      await assertNoRefusalOrBanner(page, `A9' (zoom notch ${notch})`);
      rect = await canvasRect(page);
      if (!rect) throw new Error("A9': .working-canvas not found after zoom");
    }

    // Fresh grid, taken now -- never a stale one from before this notch's own zoom (the piece's
    // own original ordering note, still true here). Still used for the emptiest-cell move-away
    // check at the end, and for its own densest region's `samplePoint` as the fallback candidate.
    grid = await page.evaluate((regions) => window.__SPATIAL_E2E__.capturePixels(regions), gridRegions());
    fractions = grid.regions.map(fractionOf);
    denseIdx = 0;
    emptyIdx = 0;
    for (let i = 1; i < fractions.length; i++) {
      if (fractions[i] > fractions[denseIdx]) denseIdx = i;
      if (fractions[i] < fractions[emptyIdx]) emptyIdx = i;
    }

    const nonBackgroundCount = grid.nonBackgroundCount;
    // Early-stop: two consecutive notch-over-notch DECREASES in frame-wide non-background pixels
    // is P10's own rise-then-fall-to-zero signature (peak at notch 2, zero by notch 7 in both of
    // its runs) -- content is leaving the viewport, so further zooming cannot help.
    if (previousNonBackgroundCount !== null) {
      declineStreak = nonBackgroundCount < previousNonBackgroundCount ? declineStreak + 1 : 0;
    }
    previousNonBackgroundCount = nonBackgroundCount;
    notchesUsed = notch;

    if (nonBackgroundCount <= 0) {
      notchEvidence.push({
        notch,
        zoomMotion,
        zoomSettled,
        bufferSize: `${grid.width}x${grid.height}`,
        nonBackgroundCount,
        declineStreak,
        best: "(no non-background pixel at all this notch -- nothing to bisect)",
      });
      if (declineStreak >= 2) {
        overshootStopped = true;
        break;
      }
      continue;
    }

    // The fix itself: densest-patch bisection candidate, plus the densest grid region's own
    // `samplePoint` as a fallback second candidate (task's own spec) -- `verifyInteriorCandidate`
    // (UNCHANGED below) still decides between them, never a silent trust of either.
    const bisection = await findInteriorCandidate(page);
    const candidates = [];
    const pushCandidate = (point) => {
      if (point && !candidates.some((c) => samePoint(c, point))) candidates.push(point);
    };
    pushCandidate(bisection.candidate);
    pushCandidate(grid.regions[denseIdx].samplePoint);

    const verifications = [];
    for (const point of candidates) {
      const verdict = await verifyInteriorCandidate(page, point, grid.width, grid.height);
      verifications.push({ point, ...verdict });
    }
    interiorVerified = verifications.filter((v) => v.ok).map((v) => v.point);
    orderedCandidates =
      interiorVerified.length > 0
        ? [...interiorVerified, ...candidates.filter((c) => !interiorVerified.some((v) => samePoint(v, c)))]
        : candidates;

    // Best candidate this notch, for the per-notch evidence line -- "best" = fewest neighbourhood
    // misses (0 for an interior-verified one), read straight out of `verifyInteriorCandidate`'s
    // own "N/M neighbourhood pixels touch background" reason string, never recomputed separately.
    const missCountOf = (v) => {
      if (v.ok) return 0;
      const m = /^(\d+)\/\d+ neighbourhood/.exec(v.reason);
      return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
    };
    const best = verifications.reduce((a, b) => (missCountOf(b) < missCountOf(a) ? b : a));

    notchEvidence.push({
      notch,
      zoomMotion,
      zoomSettled,
      bufferSize: `${grid.width}x${grid.height}`,
      nonBackgroundCount,
      declineStreak,
      bisectionLevels: bisection.levels.map((l) => `${l.label}: ${(l.fraction * 100).toFixed(1)}%`).join(" -> "),
      bisectionFinalFraction: bisection.finalFraction,
      best: `buffer(${best.point.x},${best.point.y}): ${best.ok ? "OK" : "MISS"} -- ${best.reason}`,
    });

    if (interiorVerified.length > 0) {
      successBisectionFraction = bisection.finalFraction;
      break;
    }
    if (declineStreak >= 2) {
      overshootStopped = true;
      break;
    }
  }

  if (!interiorVerified || interiorVerified.length === 0) {
    // Loud and evidence-carrying either way: an early overshoot stop names itself as such (P10's
    // own signature, not a new render-defect claim); an exhausted budget is still, as P10 named
    // it, evidence worth surfacing rather than silently falling back to the old heuristic.
    throw new Error(
      `A9': no interior-verified candidate found ${
        overshootStopped
          ? `-- stopped early at notch ${notchesUsed} after 2 consecutive notch-over-notch non-background pixel decreases ` +
            `(overshoot: content leaving the viewport, P10's own rise-then-fall signature)`
          : `after trying notch 0 (no zoom) plus ${MAX_ZOOM_NOTCHES} zoom-in notch(es)`
      }. Per-notch evidence (densest-patch bisection, action-console P11):\n\n` +
        notchEvidence
          .map(
            (e) =>
              `notch ${e.notch} (buffer ${e.bufferSize}, motion=${e.zoomMotion}, settled=${e.zoomSettled}, ` +
              `frame-wide non-bg=${e.nonBackgroundCount}px, declineStreak=${e.declineStreak}` +
              `${e.bisectionLevels ? `, bisection [${e.bisectionLevels}]` : ""}): best candidate ${e.best}`
          )
          .join("\n")
    );
  }

  let found = null;
  const attempts = [];
  // `candidates` is capped at 2 entries by `pushCandidate`'s own two call sites above (bisection
  // patch centre, densest-region samplePoint fallback). `orderedCandidates` is the same set, just
  // reordered (interior-verified first) by the block above.
  outer: for (const point of orderedCandidates) {
    for (const flipY of [true, false]) {
      const css = bufferPointToCss(point, rect, grid.width, grid.height, flipY);
      const attemptStart = Date.now();
      await page.mouse.move(css.x, css.y);
      const result = await waitForCondition(
        () => page.evaluate(() => document.querySelector(".hover-readout")?.textContent ?? null),
        (text) => text !== null && /^id \d+/.test(text),
        5_000
      );
      attempts.push({ point, flipY, css, ok: result.ok, last: result.last, attemptStart });
      if (result.ok) {
        found = { point, flipY, css, text: result.last };
        break outer;
      }
    }
  }

  if (!found) {
    // Per the coordinator's own escalation: exhausting every read-back-verified non-background
    // pixel is no longer an instrument miss, it is evidence of a genuine pick/hover defect (deck
    // picking layer vs fill rendering divergence) -- gather everything the report needs. The
    // `topColors` cross-reference is best-effort, named as such: the densest-non-background bin a
    // `samplePoint` was drawn from is *usually*, not provably, still in a fresh recapture's top 8.
    const recapture = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels()).catch(() => null);
    const nonBackgroundColor =
      recapture?.topColors?.find((c) => c.rgba !== "0,0,0,0")?.rgba ?? "(none found in a fresh top-8 recapture)";
    const windowStart = attempts[0]?.attemptStart ?? Date.now();
    const traceWindow = consoleHandle.entries.filter((e) => e.at >= windowStart).map((e) => `[${e.kind}/${e.type}] ${e.text}`);
    const attemptLines = attempts
      .map(
        (a, i) =>
          `  #${i + 1} buffer(${a.point.x},${a.point.y}) flipY=${a.flipY} -> css(${a.css.x.toFixed(1)},${a.css.y.toFixed(1)}): ${
            a.ok ? "HIT" : `miss (last seen: ${JSON.stringify(a.last)})`
          }`
      )
      .join("\n");
    throw new Error(
      `A9': .hover-readout never appeared over any of ${attempts.length} read-back-verified non-background pixel attempts:\n` +
        `${attemptLines}\n` +
        `best-effort non-background color from a fresh recapture: ${nonBackgroundColor}\n` +
        `console/trace entries from the wait window (${traceWindow.length}):\n${traceWindow.join("\n")}`
    );
  }

  const emptyPoint = bufferRegionToCss(grid.regions[emptyIdx], rect, 0.08, 0.08);
  await page.mouse.move(emptyPoint.x, emptyPoint.y);
  const gone = await waitForCondition(
    () => page.evaluate(() => document.querySelector(".hover-readout")?.textContent ?? null),
    (text) => text === null,
    15_000
  );
  if (!gone.ok) {
    throw new Error(`A9': .hover-readout did not disappear over the emptiest cell within 15000ms (last seen: ${JSON.stringify(gone.last)})`);
  }

  return (
    `interior-verified candidate found at zoom notch ${notchesUsed}/${MAX_ZOOM_NOTCHES} ` +
    `(densest-patch bisection final fraction ${
      successBisectionFraction !== null ? (successBisectionFraction * 100).toFixed(1) + "%" : "n/a (fallback samplePoint verified instead)"
    }); hovered a verified non-background pixel (buffer ${found.point.x},${found.point.y}, flipY=${found.flipY}, ` +
    `css ${found.css.x.toFixed(1)},${found.css.y.toFixed(1)}) after ${attempts.length} attempt(s) -> "${found.text}"; ` +
    `moved to emptiest cell (#${emptyIdx}, ${(fractions[emptyIdx] * 100).toFixed(1)}%) -> hover-readout gone`
  );
}

// ---------------------------------------------------------------------------------------
// K6 (entry 47, `frontends/shell/HOVER-REPICK-PREREGISTRATION.md`; originally residency-debt cut 1b
// Item C, DECISIONS-PENDING entry 29): the standing hover readout across a camera change, with the
// pointer never moving. `WorkingCanvas.tsx`'s `onHover` fires only on pointer MOVE, so a camera
// change alone re-evaluates nothing by itself -- what the operator is shown between the change and
// the next real pointer move is entirely this contract's business.
//
// THE CONTRACT THIS STEP NOW ASSERTS (entry 47, ruled (b) by the human on 2026-09-06 -- "re-pick on
// camera settle" -- and sharpened on 2026-09-07 by the failing case in the human's own words: a
// screen-sized feature must not lose its id on a one-step zoom-out, "as long as I can tell on which
// feature I'm hovering, there's no reasono to remove the id"): while camera changes keep arriving
// the readout is refused by name below the declared pick-resolution threshold and cleared above it
// (unchanged mid-gesture behaviour); once the burst STOPS, exactly one fresh pick at the stored
// pixel decides what the operator sees. An id shown after a camera change is therefore always an id
// some fresh GPU-ordinal-to-stable-id resolution stands behind (ADR-010 rules 2 and 5), never a
// retained string re-asserted across the change.
//
// The five cases below are the ones pre-committed in that preregistration's section 5 -- (v) added
// by that document's own section 12 Amendment 4, after the same section's design passed its third
// architect gate: a test addition, changing no design and no product line. `stepK6`'s
// previous two assertions are cases (i) and (ii): both still pass, restated under the new mechanism,
// exactly as the file this step replaces required of its successor. Case (ii)'s old falsifier ("the
// pre-zoom id after any notch = failure") is GONE by design -- a re-confirmed id is now the correct
// answer -- and is replaced by a strictly stronger one: no readout may ever be an id without a
// confirming re-pick trace since this step's mark.
//   (i)   CONTINUOUS -- one coalesced camera change crossing the threshold ("Zoom to layer" from a
//         real above-threshold hover) -> the named refusal, text verbatim, after settle. The refusal
//         always wins over any id (ADR-028 Decision item 4).
//   (ii)  DISCRETE -- >= 8 separate wheel notches, no interceding pointer move: at every notch, if
//         the readout is an id, a `readout_confirmed` re-pick line naming that id must exist at that
//         camera.
//   (iii) THE HUMAN'S OWN FAILING CASE -- zoom in to a feature, hover it, then ONE discrete zoom-out
//         step with the pointer stationary: the SAME id must still be shown, and the trace must name
//         it re-picked. (A wheel zoom is anchored at the pointer, so the same world point stays
//         under the same pixel -- the feature really is still the one under the cursor.)
//   (iv)  THE DISCRIMINATOR (the preregistration's condition 13, and the reason (ii)'s old falsifier
//         could be removed without losing coverage): a camera change chosen so a DIFFERENT feature
//         lies under the same stationary pixel -- a PAN, which translates the world under the
//         pointer instead of holding it fixed. **As corrected by the preregistration's own section
//         12 Amendment 2 and the reviewer gate:** exactly two outcomes end this case successfully --
//         an id that DIFFERS from the retained one, or an ABSENCE -- and each must carry a
//         confirming `readout_confirmed` re-pick line since this step's mark. The named refusal is
//         NON-TERMINAL (the mid-gesture rule emits it with no pick behind it, so it cannot
//         discriminate anything); the case keeps panning through refusals and fails by name if it
//         exhausts having seen only those. An implementation that emitted the confirming trace while
//         re-asserting the retained id passes (i), (ii) and (iii) and fails this.
//   (v)   THE RELEASE EDGE (the preregistration's own section 12 Amendment 5, which re-aimed this
//         case onto the falsifier's own start state): from an above-threshold hover, wheel OUT with
//         the pointer stationary until the named refusal STANDS -- the one readout the mid-gesture
//         rule leaves standing across a drag, and the only start state from which the residual
//         Amendment 3 closes is reachable at all -- then a real mouse drag (button down, pointer
//         moved, button up) and ONE wheel notch back IN, above the threshold again, with the pointer
//         never moved. deck.gl delivers no `onHover` while a button is held, so nothing has answered
//         "where is the pointer" for the whole gesture; the standing refusal means the first
//         post-release camera change ARMS, and the settle it starts must still emit nothing. The
//         readout must NOT be an id (an ABSENCE and the named refusal both pass) and no confirming
//         `readout_confirmed` line may name an id since this case's own mark. An id here could only
//         have come from a pick at the PRE-DRAG pixel -- a feature the pointer left behind. This is
//         the only level that runs the real window `pointerup` listener.
//
// **No timing figure is asserted, reported or derivable here** -- every `timeoutMs`/`quietMs` below
// is a harness BOUND, exactly as this file's other steps already use them (ADR-018), and the settle
// mechanism's own cadence is never measured, printed or compared against anything.
//
// Realising (i): NEITHER a single real `page.mouse.wheel` call NOR an arbitrary absolute jump
// through the DEV-only `e2eSetViewState` camera seam (`src/e2e-test-surface.ts`) is safe here, for
// two DIFFERENT reasons, both verified against this repo's own installed/shipped code (not assumed):
// (a) a single wheel event cannot reliably realise "sufficient delta" at all -- deck.gl's default
// `scrollZoom` handler (`@deck.gl/core`'s `Controller._onWheel`, the installed
// `node_modules/@deck.gl/core/dist/controllers/controller.js`) maps EVERY wheel event's own delta
// through `scale = 2 / (1 + Math.exp(-Math.abs(delta * speed)))` (default `speed` 0.01), which
// asymptotically saturates at 2.0 (a single doubling/halving) as `|delta|` grows -- e.g. deltaY=300
// (this file's own `ZOOM_NOTCH_DELTA_Y` magnitude) already yields scale~=1.905, and an arbitrarily
// larger deltaY buys almost nothing further, so one real wheel event is capped at roughly one
// `ZOOM_NOTCH_DELTA_Y`-notch's worth of zoom change regardless of magnitude; (b) an ARBITRARY,
// EXTREME `e2eSetViewState` zoom is actively DANGEROUS, not merely insufficient -- proven live (the
// first run of the piece that wrote this step: K6 wedged the whole page unresponsive to CDP at
// zoom=-64, since `pixelsPerWorldUnitAtZoom(zoom) === 2 ** zoom` inflates the viewport's own
// world-space bbox by the same astronomical factor and the covering-tile enumeration then attempted
// an absurd allocation; that finding is DECISIONS-PENDING entry 60, fixed by the bound-before-
// allocate change stepK7 exercises). A MODEST, computed seam jump would in fact have been safe, and
// was the K6 re-aim preregistration's own other named route; it is not used regardless, because a
// REAL product action -- "Zoom to layer", the same `fitToExtent` path a human's click drives -- was
// preferred over any DEV-only seam. That fit is independently already known to sit below the
// pick-resolution threshold on this fixture (this suite's own P9 diagnosis, `e2e/README.md`'s "Entry
// 21 (2026-08-19), P9 instrumented session": at that camera "individual features are near-sub-pixel,
// so no 5x5 interior patch...can exist for ANY feature"), and `isBelowPickResolution` is monotonic
// in zoom, so any camera this step's own search established as ABOVE threshold is more zoomed-in
// than the whole-dataset fit -- fitting from there can only cross the threshold, never stay above
// it.
//
// Realising (ii)/(iii): `page.mouse.wheel` is called directly (not through `doWheel`/`zoomInOneNotch`,
// both of which `page.mouse.move` the pointer first) -- any pointer move would let a real `onHover`
// re-fire and re-pick normally (and cancel the pending settle re-pick), masking exactly the
// mechanism this step exists to check.
//
// Realising (iv): the pan is deck.gl's own KEYBOARD pan -- `ArrowRight` on the focused canvas,
// `Controller._onKeyDown` -> `OrthographicState.moveRight(50)` in the installed
// `node_modules/@deck.gl/core/dist/controllers/orthographic-controller.js`, a shipped interaction of
// this app's own `controller: true`, not a test-only seam. It is the one camera change available
// that translates the world under a STATIONARY pointer: a wheel zoom is anchored AT the pointer (so
// the same world point stays under the same pixel, which is what makes (iii) a same-id case), and a
// drag pan moves the pointer by construction. The canvas is focused through `.focus()` (mjolnir.js's
// own `KeyInput` sets `tabIndex = 0` on it), never by clicking it -- a click would move the pointer.
// The step fails loudly and by name if the key presses produce no camera change at all, so a future
// deck.gl/mjolnir change that removes keyboard panning reads as exactly that rather than as a
// contract failure.
//
// **Case (iv) is written against `HOVER_REPICK_ON_PAN`'s built value** (`src/canvas/hoverRepickConstants.ts`,
// `true`: pan and zoom settle alike, the reading the ruling's words force). That value is PROPOSED
// PENDING THE HUMAN'S SIGHT (DECISIONS-PENDING entry 75). If the human selects the zoom-only value
// instead, this case must be RE-AIMED onto a camera change that both translates and zooms -- it must
// not be quietly deleted, since it is the only case here whose correct answer is a different id.
// ---------------------------------------------------------------------------------------
const K6_ZOOM_OUT_NOTCHES_MIN = 8; // floor on zoom-OUT notches applied after finding an
// above-threshold candidate, independent of how many zoom-IN notches that search itself needed --
// guards the case where a hoverable candidate is found at a low notch, which would otherwise leave
// too few zoom-out notches to reliably cross back below the threshold (assertion (ii), discrete).
const K6_ZOOM_OUT_NOTCH_DELTA_Y = -ZOOM_NOTCH_DELTA_Y; // reverses A9''s own zoom-in notch magnitude
// (positive deltaY = wheel-down = zoom out, the opposite of `ZOOM_NOTCH_DELTA_Y`'s zoom-in).
const K6_REFUSAL_TEXT = "Features here are below pick resolution — zoom in to inspect them."; // App.tsx:1417, verbatim.

/**
 * Shared by K6's cases (i), (ii) and (iii): reuses A9''s own densest-patch bisection + interior
 * verification (`findInteriorCandidate`/`verifyInteriorCandidate`, UNCHANGED) to find a real,
 * confidently-pickable feature and hover it for real -- each of those cases needs to START from a
 * real, above-threshold hover (an id showing), exactly as A9' establishes one; case (iv) continues
 * from the hover case (iii) established rather than seeking its own. Runs from WHATEVER camera state the page
 * is currently in (the caller decides that -- e.g. after `clickZoomToLayer` below), zooming further
 * in from there as needed.
 */
async function establishAboveThresholdHoverK6(page, consoleHandle, label) {
  const initialRect = await canvasRect(page);
  if (!initialRect) throw new Error(`${label}: .working-canvas not found`);
  const center = { x: initialRect.left + initialRect.width / 2, y: initialRect.top + initialRect.height / 2 };

  let found = null;
  let notchesUsed = 0;
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES && !found; notch++) {
    if (notch > 0) {
      await zoomInOneNotch(page, consoleHandle, center);
      await assertNoRefusalOrBanner(page, `${label} (zoom-in notch ${notch})`);
    }
    notchesUsed = notch;
    const rect = await canvasRect(page);
    if (!rect) throw new Error(`${label}: .working-canvas not found after zoom`);
    const bisection = await findInteriorCandidate(page);
    if (bisection.finalFraction <= 0) continue;
    const verdict = await verifyInteriorCandidate(page, bisection.candidate, bisection.bufferWidth, bisection.bufferHeight);
    if (!verdict.ok) continue;

    for (const flipY of [true, false]) {
      const css = bufferPointToCss(bisection.candidate, rect, bisection.bufferWidth, bisection.bufferHeight, flipY);
      await page.mouse.move(css.x, css.y);
      const result = await waitForCondition(
        () => page.evaluate(() => document.querySelector(".hover-readout")?.textContent ?? null),
        (text) => text !== null && /^id \d+/.test(text),
        5_000
      );
      if (result.ok) {
        found = { css, text: result.last };
        break;
      }
    }
  }

  if (!found) {
    throw new Error(
      `${label}: no above-threshold hoverable candidate found after trying notch 0 plus ${MAX_ZOOM_NOTCHES} zoom-in notch(es) -- ` +
        `cannot exercise the below-threshold repro without first establishing a real id readout`
    );
  }
  return { ...found, notchesUsed };
}

/** Clicks "Zoom to layer" (the same real button `A7'` already drives) to refit the WHOLE dataset
 * into view via `fitToExtent` (one atomic camera change, `WorkingCanvas.tsx:1050`), then settles
 * -- never `page.reload()` (this suite's own established precedent: `residency-harness.mjs`'s own
 * "P3i-b B4" paragraph of the block labelled S4, `e2e/residency-harness.mjs:1971-1977` (first
 * paragraph labelled at `:1952`), treats a mid-script reload as riskier than this). A plain DOM `btn.click()`, not a
 * real `page.mouse.click()` at the button's own screen position -- the pointer is NEVER moved by
 * this call, which is exactly what K6's own "pointer stationary" premise (this section's own top
 * comment) needs whether this is used to CROSS the threshold (assertion (i)) or merely to RESET the
 * camera before the discrete case's own setup (assertion (ii)) -- the SAME find-and-click as `stepA7`
 * (`clickZoomToLayerButton` above), same real product action either way, `label` names which. */
async function clickZoomToLayer(page, consoleHandle, label) {
  await clickZoomToLayerButton(page, label);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 45_000 });
  await assertNoRefusalOrBanner(page, label);
}

/** The stable feature id inside a `.hover-readout` id string -- `App.tsx` renders `id <stable id>`
 * followed, when the pick carried one, by its authoritative anchor. `null` when the readout is not
 * an id at all (nothing shown, or the named refusal). */
function hoverReadoutId(text) {
  const m = /^id (\d+)/.exec(text ?? "");
  return m ? m[1] : null;
}

async function readHoverReadout(page) {
  return page.evaluate(() => document.querySelector(".hover-readout")?.textContent ?? null);
}

/** D9's confirming line for a settle re-pick, looked for only among render-trace entries that
 * arrived SINCE `sinceIndex` -- the caller's own mark, taken immediately before the camera change it
 * is about to assert on.
 *
 * **What the mechanism actually checks, stated as what it is** (reviewer gate, entry 47): the scope
 * is the trace ARRAY INDEX, not the camera. This answers "a confirming line arrived after my mark",
 * which is only "at the camera the caller just produced" because every caller takes its mark
 * immediately before its own camera change and waits for the trace to go quiet before reading. The
 * `zoom` the line itself carries (`traceReadoutConfirmed`) is NOT compared against anything here, so
 * this function cannot by itself tell two settles apart within one caller's window -- read it as
 * "since the mark", never as a camera identity check.
 *
 * `resolved` is the readout in the operator's own terms, exactly as `renderTrace.ts`'s
 * `traceReadoutConfirmed` names it (`id <n>`, `below-pick-resolution`, `cleared`); it is matched to
 * a word boundary so `id 42` can never be satisfied by `id 421`. */
function hasConfirmingRepickTrace(consoleHandle, sinceIndex, resolved) {
  const pattern = new RegExp(`readout_confirmed camera-settle-repick ${resolved}(\\s|$)`);
  return consoleHandle
    .renderTrace()
    .slice(sinceIndex)
    .some((e) => pattern.test(e.text));
}

/** The FIRST `readout_confirmed` re-pick line naming ANY id since `sinceIndex`, as its own text, or
 * `null` when no such line arrived -- case (v)'s question, which `hasConfirmingRepickTrace` above
 * cannot ask: that one is handed the exact readout its caller expects, and case (v)'s whole point is
 * that NO id was confirmed at all. Same `renderTrace.ts` `traceReadoutConfirmed` shape, same
 * "since the mark" scope (an array index, never a camera identity), same word boundary. */
function confirmingIdRepickTraceSince(consoleHandle, sinceIndex) {
  const pattern = /readout_confirmed camera-settle-repick id \d+(\s|$)/;
  const hit = consoleHandle
    .renderTrace()
    .slice(sinceIndex)
    .find((e) => pattern.test(e.text));
  return hit ? hit.text : null;
}

/** One wheel notch with the pointer NEVER moved (this section's own "Realising (ii)/(iii)" note),
 * then a wait for the render trace to go quiet -- the settle re-pick's own trace line is itself a
 * render-trace line, so quiet here means the re-pick has already had its say. */
async function wheelWithoutMoving(page, consoleHandle, deltaY) {
  await page.mouse.wheel(0, deltaY);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 500, timeoutMs: 10_000 });
}

/** How many `ArrowRight` presses case (iv) will spend looking for a different feature under the same
 * stationary pixel before calling the contract broken. Each press is deck.gl's own 50-screen-pixel
 * orthographic keyboard pan (this section's own "Realising (iv)" note); a hover candidate this
 * suite's search accepts is close to the smallest feature that is hoverable at all at that camera,
 * so a few presses translate the world well past one feature's own width. */
const K6_PAN_KEY_PRESSES_MAX = 8;

/** How far case (v)'s drag moves the pointer, as a fraction of the canvas's own width and height,
 * and always TOWARD the canvas centre so the pointer can never be dragged off the element (a
 * pointer that ended outside would leave the following wheel notch nowhere to land, and the case
 * would pass having exercised nothing). The drag itself is `doPan` above -- the SAME real
 * button-down / move / button-up mechanism `A7'` already drives; only the magnitude is this case's
 * own, and it is a fraction of the canvas rather than a pixel count so it means the same thing at
 * any window size. Deliberately MODEST: the drag has to move the camera for real, and it also has
 * to leave the pre-drag pixel somewhere a pick could still answer, since what this case forbids is
 * a settle answering there at all. */
const K6_RELEASE_DRAG_FRACTION = 0.1;

async function stepK6(page, consoleHandle) {
  // ASSERTION (i) -- CONTINUOUS: one coalesced camera change crossing the threshold (the
  // walkthrough's own L7 gesture, realised here via "Zoom to layer" -- this section's own top
  // comment has the full account of why, including the live-proven danger of the alternatives) ->
  // the named refusal, text verbatim, asserted AFTER settle.
  const continuousHover = await establishAboveThresholdHoverK6(page, consoleHandle, "K6/continuous");
  await clickZoomToLayer(page, consoleHandle, "K6/continuous (zoom to layer)");

  const continuousResult = await waitForCondition(
    () =>
      page.evaluate(() => ({
        text: document.querySelector(".hover-readout")?.textContent ?? null,
        belowResolution: document.querySelector(".hover-readout-below-resolution") !== null,
      })),
    (v) => v.belowResolution && v.text === K6_REFUSAL_TEXT,
    10_000
  );
  if (!continuousResult.ok) {
    throw new Error(
      `K6/continuous: one coalesced camera change ("Zoom to layer" from a real above-threshold hover) did not show ` +
        `the named refusal text verbatim within 10000ms (hovered "${continuousHover.text}" at zoom-in notch ` +
        `${continuousHover.notchesUsed}; last seen: ${JSON.stringify(continuousResult.last)})`
    );
  }

  // Reset before the remaining cases' own setup: the SAME "Zoom to layer" click again -- see
  // `clickZoomToLayer`'s own doc comment for why this is safe and deliberate to call twice.
  await clickZoomToLayer(page, consoleHandle, "K6/reset");

  // ASSERTION (iii) -- THE HUMAN'S OWN FAILING CASE, in the human's own order: zoom in to a feature
  // and hover it, then zoom out by just one step with the pointer stationary. The zoom-IN notch
  // first is what makes the zoom-OUT land back on a camera a real hover has ALREADY proven to be
  // above the declared threshold, so this case tests the re-pick rather than the threshold.
  const repickHover = await establishAboveThresholdHoverK6(page, consoleHandle, "K6/re-pick");
  const repickId = hoverReadoutId(repickHover.text);
  if (repickId === null) {
    throw new Error(`K6/re-pick: expected a real id readout to start from, got ${JSON.stringify(repickHover.text)}`);
  }
  await wheelWithoutMoving(page, consoleHandle, ZOOM_NOTCH_DELTA_Y); // "Once i zoom in to a feature and hover over one"
  const beforeStepOut = consoleHandle.renderTrace().length;
  await wheelWithoutMoving(page, consoleHandle, K6_ZOOM_OUT_NOTCH_DELTA_Y); // "...if i zoom out by just one step"
  const sameId = await waitForCondition(
    () => readHoverReadout(page),
    (text) => hoverReadoutId(text) === repickId,
    10_000
  );
  if (!sameId.ok) {
    throw new Error(
      `K6/re-pick: after ONE discrete zoom-out step with the pointer stationary, .hover-readout no longer names the ` +
        `feature the pointer is still over (expected id ${repickId}, last seen ${JSON.stringify(sameId.last)}) -- ` +
        `the sharpened criterion (entry 47, 2026-09-07) is that the id stays for as long as the operator can tell ` +
        `which feature is under the pointer`
    );
  }
  if (!hasConfirmingRepickTrace(consoleHandle, beforeStepOut, `id ${repickId}`)) {
    throw new Error(
      `K6/re-pick: .hover-readout shows id ${repickId} after the zoom-out step, but no readout_confirmed re-pick line ` +
        `names it since this step's mark -- an id no fresh pick stands behind is exactly the staleness this contract forbids`
    );
  }

  // ASSERTION (iv) -- THE DISCRIMINATOR: a PAN, with the pointer never moved, until a different
  // feature (or nothing) lies under that same pixel. See this section's own "Realising (iv)" note
  // for why the pan is deck.gl's own keyboard pan and why no other camera change can do this.
  const focusedClass = await page.evaluate(() => {
    const el = document.querySelector(".working-canvas");
    if (el) el.focus();
    return document.activeElement ? document.activeElement.className : null;
  });
  if (typeof focusedClass !== "string" || !focusedClass.includes("working-canvas")) {
    throw new Error(
      `K6/discriminator: could not focus .working-canvas (document.activeElement is ${JSON.stringify(focusedClass)}) -- ` +
        `the keyboard pan is what moves the camera while the pointer stays exactly where it is`
    );
  }
  let discriminatorOutcome = null;
  let pressesUsed = 0;
  let refusalsSeen = 0;
  let unconfirmedAbsences = 0;
  for (let press = 1; press <= K6_PAN_KEY_PRESSES_MAX && discriminatorOutcome === null; press++) {
    const beforePress = consoleHandle.renderTrace().length;
    await page.keyboard.press("ArrowRight");
    await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 500, timeoutMs: 10_000 });
    pressesUsed = press;
    if (!hasFreshRenderTraceMotion(consoleHandle.renderTrace(), beforePress)) {
      throw new Error(
        `K6/discriminator: ArrowRight (press ${press}) produced NO camera change at all -- deck.gl's own keyboard pan ` +
          `(Controller._onKeyDown -> moveRight) is what this case is built on; without it this case cannot put a ` +
          `different feature under the stationary pixel`
      );
    }
    const afterPress = await readHoverReadout(page);
    const afterId = hoverReadoutId(afterPress);

    if (afterPress !== null && afterId === null && afterPress !== K6_REFUSAL_TEXT) {
      throw new Error(`K6/discriminator: unrecognised .hover-readout state after a pan: ${JSON.stringify(afterPress)}`);
    }

    // THE REFUSAL IS NON-TERMINAL (preregistration section 12 Amendment 2). The mid-gesture rule
    // emits the named refusal on its own, with no pick behind it, so it cannot tell a fresh re-pick
    // apart from a re-emitted retained readout -- accepting it here would let this case pass against
    // exactly the build block-on-sight condition 13 exists to catch. Keep panning instead.
    if (afterPress === K6_REFUSAL_TEXT) {
      refusalsSeen++;
      continue;
    }

    // AN ABSENCE is a success only WITH a confirming re-pick line naming `cleared` at this camera
    // (reviewer R4). Without one, the readout being empty says nothing about whether a pick ran: the
    // mid-gesture rule clears a standing id by itself. Keep panning in that case too.
    if (afterPress === null) {
      if (hasConfirmingRepickTrace(consoleHandle, beforePress, "cleared")) {
        discriminatorOutcome = "an absence, confirmed re-picked (nothing resident under that pixel)";
      } else {
        unconfirmedAbsences++;
      }
      continue;
    }

    if (afterId !== repickId) {
      if (!hasConfirmingRepickTrace(consoleHandle, beforePress, `id ${afterId}`)) {
        throw new Error(
          `K6/discriminator: .hover-readout shows id ${afterId} after a pan, but no readout_confirmed re-pick line ` +
            `names it since this step's mark`
        );
      }
      discriminatorOutcome = `a different id (${repickId} -> ${afterId}), confirmed re-picked`;
    }
  }
  if (discriminatorOutcome === null) {
    throw new Error(
      `K6/discriminator: ${K6_PAN_KEY_PRESSES_MAX} keyboard pan presses with the pointer stationary produced no ` +
        `outcome that can discriminate a fresh pick from a retained readout ` +
        `(${refusalsSeen} refusal-only press(es), ${unconfirmedAbsences} absence(s) with no confirming re-pick trace, ` +
        `the rest still naming the SAME feature id ${repickId} the readout named before the world moved underneath ` +
        `it). A retained id re-asserted across a camera change, a settle that never ran, and a run where only the ` +
        `mid-gesture refusal ever spoke are all failures of this case, by name -- section 5 (iv) as corrected by the ` +
        `preregistration's own Amendment 2.`
    );
  }

  // ASSERTION (ii) -- DISCRETE: >= 8 separate wheel notches, no interceding `page.mouse.move`. The
  // contract asserted per notch is the NEW one (entry 47): a readout may be an id only where a
  // confirming re-pick trace names that id since this step's mark. The old falsifier ("the pre-zoom id after
  // any notch = failure") is deliberately gone -- under this mechanism a re-confirmed id is the
  // correct answer, which is what case (iv) above exists to keep honest.
  const discreteHover = await establishAboveThresholdHoverK6(page, consoleHandle, "K6/discrete");
  const zoomOutNotches = Math.max(discreteHover.notchesUsed, K6_ZOOM_OUT_NOTCHES_MIN);
  let notchesShowingAnId = 0;
  for (let notch = 1; notch <= zoomOutNotches; notch++) {
    const beforeNotch = consoleHandle.renderTrace().length;
    await page.mouse.wheel(0, K6_ZOOM_OUT_NOTCH_DELTA_Y);
    await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 500, timeoutMs: 10_000 });
    const afterNotch = await readHoverReadout(page);
    const afterId = hoverReadoutId(afterNotch);
    if (afterId === null) continue;
    notchesShowingAnId++;
    if (!hasConfirmingRepickTrace(consoleHandle, beforeNotch, `id ${afterId}`)) {
      throw new Error(
        `K6/discrete: .hover-readout showed "id ${afterId}" after discrete notch ${notch}/${zoomOutNotches} with NO ` +
          `confirming readout_confirmed re-pick line since this step's mark -- an id no fresh pick stands behind`
      );
    }
  }

  // ASSERTION (v) -- THE RELEASE EDGE, from the falsifier's OWN start state (the preregistration's
  // section 12 Amendment 5, which re-aimed this case after its first construction was built and
  // shown not to bind: an above-threshold start cannot reach the residual at all, because the
  // drag's own camera changes CLEAR a standing id, so the first post-release change finds nothing
  // standing, never arms, and the settle returns before the capture is ever read).
  //
  // The reachable state is a standing below-pick-resolution REFUSAL -- the one readout the
  // mid-gesture rule leaves standing across a drag. So: an above-threshold hover, then wheel OUT
  // with the pointer stationary until that refusal stands; the mark; a real mouse drag -- button
  // down, pointer moved, button up; then ONE wheel notch back IN, above the threshold again, with
  // the pointer never moved.
  //
  // deck.gl delivers no `onHover` while a button is held (Amendment 2), so nothing has answered
  // "where is the pointer" for the whole gesture. The refusal is still standing when that notch
  // arrives, so the first post-release camera change ARMS exactly as D1/D3 say -- and the settle it
  // starts must still emit NOTHING, because the release edge dropped the stored pixel (Amendment 3,
  // `WorkingCanvas.tsx`'s own `onPointerRelease`). An absence and the named refusal both pass; an id
  // fails, since at this point it could only have come from a pick at the PRE-DRAG pixel, over a
  // feature the pointer has left.
  //
  // This is the only level that runs the real window `pointerup` listener. The unit case that
  // mirrors it (`WorkingCanvas.test.ts`, the D11 describe) is seam-scoped by section 5's own
  // declaration and nulls the capture itself, so it exercises the scheduler's null-capture return
  // rather than the listener that produces it.
  await clickZoomToLayer(page, consoleHandle, "K6/release-edge (reset)");
  const releaseHover = await establishAboveThresholdHoverK6(page, consoleHandle, "K6/release-edge");
  const releaseId = hoverReadoutId(releaseHover.text);
  if (releaseId === null) {
    throw new Error(
      `K6/release-edge: expected a real id readout to start from, got ${JSON.stringify(releaseHover.text)}`
    );
  }

  // Wheel OUT with the pointer stationary until the named refusal STANDS -- case (ii)'s own
  // mechanism (`wheelWithoutMoving`) under case (ii)'s own notch bound, stopping at the FIRST notch
  // that refuses; the single notch back in below then lands one notch in from the first refusing
  // camera (not necessarily on the camera the hover was established at -- more than one notch out
  // may have been needed).
  const releaseOutNotchesMax = Math.max(releaseHover.notchesUsed, K6_ZOOM_OUT_NOTCHES_MIN);
  let releaseOutNotches = 0;
  let standingBeforeDrag = null;
  for (let notch = 1; notch <= releaseOutNotchesMax && standingBeforeDrag !== K6_REFUSAL_TEXT; notch++) {
    await wheelWithoutMoving(page, consoleHandle, K6_ZOOM_OUT_NOTCH_DELTA_Y);
    releaseOutNotches = notch;
    standingBeforeDrag = await readHoverReadout(page);
  }
  if (standingBeforeDrag !== K6_REFUSAL_TEXT) {
    throw new Error(
      `K6/release-edge: the named refusal never STOOD within ${releaseOutNotchesMax} zoom-out notch(es) from the ` +
        `hover (id ${releaseId}), pointer stationary throughout -- last readout ${JSON.stringify(standingBeforeDrag)}. ` +
        `A standing refusal is this case's whole premise: it is the one readout the mid-gesture rule leaves standing ` +
        `across a drag, and the only start state the release edge's own residual is reachable from (section 12 ` +
        `Amendment 5)`
    );
  }

  const releaseRect = await canvasRect(page);
  if (!releaseRect) throw new Error("K6/release-edge: .working-canvas not found");
  const dragToward = {
    x: releaseRect.left + releaseRect.width / 2 - releaseHover.css.x,
    y: releaseRect.top + releaseRect.height / 2 - releaseHover.css.y,
  };
  const releaseDrag = {
    dx: (dragToward.x >= 0 ? 1 : -1) * Math.round(releaseRect.width * K6_RELEASE_DRAG_FRACTION),
    dy: (dragToward.y >= 0 ? 1 : -1) * Math.round(releaseRect.height * K6_RELEASE_DRAG_FRACTION),
  };
  // THIS STEP'S MARK for the case, taken immediately before the gesture it asserts on -- the same
  // discipline every other case here follows (`hasConfirmingRepickTrace`'s own doc comment states
  // what "since the mark" checks and what it does not).
  const beforeRelease = consoleHandle.renderTrace().length;
  await doPan(page, releaseHover.css, releaseDrag.dx, releaseDrag.dy); // down ON the hovered pixel, move, up
  // ONE notch back IN -- the exact reverse of the last zoom-out notch above, so this lands on a
  // camera the hover was already proven above the threshold at, and the first camera change after
  // the release arms (the refusal was standing when it arrived).
  await wheelWithoutMoving(page, consoleHandle, ZOOM_NOTCH_DELTA_Y);
  const afterRelease = await readHoverReadout(page);
  const confirmedIdSinceRelease = confirmingIdRepickTraceSince(consoleHandle, beforeRelease);
  // The drag and the notch must really have moved the camera, or this case would pass having
  // asserted nothing at all -- the same guard case (iv) puts on its own pan, by name.
  if (!hasFreshRenderTraceMotion(consoleHandle.renderTrace(), beforeRelease)) {
    throw new Error(
      `K6/release-edge: the drag (${releaseDrag.dx}, ${releaseDrag.dy} px from the hovered pixel) and the wheel notch ` +
        `after it produced NO camera change at all -- without one there is no settle for the release edge to refuse, ` +
        `and this case cannot pin anything`
    );
  }
  const afterReleaseAllowed = afterRelease === null || afterRelease === K6_REFUSAL_TEXT;
  if (!afterReleaseAllowed || confirmedIdSinceRelease !== null) {
    throw new Error(
      `K6/release-edge: with the named refusal STANDING, a real drag (button down, pointer moved, button up) and ` +
        `then ONE wheel notch back in with the pointer never moved, the readout must NOT be an id -- nothing has ` +
        `re-answered where the pointer is since the button went down, so the settle this armed change starts may ` +
        `only refuse to act (an absence and the named refusal both pass). ` +
        `.hover-readout showed ${JSON.stringify(afterRelease)} (the hover before the ${releaseOutNotches} zoom-out ` +
        `notch(es) was id ${releaseId})` +
        (confirmedIdSinceRelease === null
          ? ""
          : `, and a confirming re-pick line named an id since this step's mark: ${JSON.stringify(confirmedIdSinceRelease)}`) +
        ` -- a settle that picks at the PRE-DRAG pixel is exactly what the release edge (section 12 Amendment 3) forbids`
    );
  }

  return (
    `(i) continuous: hovered "${continuousHover.text}" at zoom-in notch ${continuousHover.notchesUsed}, one coalesced ` +
      `camera change ("Zoom to layer") -> refusal text verbatim ("${K6_REFUSAL_TEXT}"); ` +
    `(iii) re-pick: hovered id ${repickId}, one zoom-in notch then ONE discrete zoom-out step, pointer stationary -> ` +
      `the same id, named re-picked by its own confirming trace since this step's mark; ` +
    `(iv) discriminator: ${pressesUsed} keyboard pan press(es), pointer stationary (${refusalsSeen} refusal-only press(es) passed over as non-terminal) -> ${discriminatorOutcome}; ` +
    `(ii) discrete: hovered "${discreteHover.text}" at zoom-in notch ${discreteHover.notchesUsed}, ${zoomOutNotches} ` +
      `discrete zoom-out notch(es) -> ${notchesShowingAnId} notch(es) showed an id, every one of them with a ` +
      `confirming re-pick trace at its own camera; ` +
    `(v) release edge: hovered id ${releaseId}, ${releaseOutNotches} zoom-out notch(es) to a STANDING refusal, then a ` +
      `real drag (button down, ${releaseDrag.dx}, ${releaseDrag.dy} px, button up) and ONE wheel notch back in with ` +
      `the pointer never moved -> readout ${JSON.stringify(afterRelease)}, and no confirming re-pick line naming an id ` +
      `since that case's own mark.`
  );
}

// ---------------------------------------------------------------------------------------
// K7 "wheel far out" (DECISIONS-PENDING entry 60, ruled (a) by the human on 2026-09-08 -- "60 = (a):
// bound-before-allocate fix in this cut, unit test + 15-notch E2E step"; RELEASE-0.1.md Amendment
// 10's own preregistration, which names this step's shape verbatim: "one E2E step in `regression.mjs`
// zooming 15 notches past "Zoom to layer" on the shipped default: the canvas stays responsive (the
// readout/hover still answers; the declared partial-view status shows), no hang, bounded by the
// suite's existing timeouts (a bound, not a timing claim -- ADR-018)".
//
// What entry 60 found, in this suite's own words (`stepK6`'s top comment recorded it before entry
// 47 rewrote that step; the finding itself is unchanged): `tilesCoveringBbox`
// enumerated the WHOLE cover with a plain nested loop on every debounced camera settle, and
// `MAX_QUEUED_TILES` truncated only afterwards -- so an ordinary wheel gesture far enough out made
// that loop's iteration count a function of the camera alone. The fix bounds the cover BEFORE it is
// allocated, against a DECLARED bound (`MAX_COVERING_TILES`, 65,536 = 128 x `MAX_QUEUED_TILES`,
// `src/canvas/tileGridConstants.ts`, ADR-010 rule 6 -- that file states how the multiple was arrived
// at, including the 32x first choice this comment used to name), and reports the same truncated/
// partial-view outcome the stream manager already had.
//
// The gesture is deliberately ordinary: 15 discrete zoom-OUT notches from a real "Zoom to layer"
// fit, the same notch magnitude every other step here wheels with (`ZOOM_NOTCH_DELTA_Y`) and the
// same count `A9'` already drives in the other direction. Entry 60's own arithmetic put ~12 notches
// past the fit at ~3x10^8 `TileKey` objects before truncation.
//
// What this step asserts is that the canvas keeps ANSWERING, never how fast it answers (ADR-018: no
// timing claim is made anywhere here; every wait below is a BOUND, and the step's own `runStep`
// timeout is the outer one). The probe is a fresh `page.evaluate` after each notch: it can only
// resolve when the page's own JS thread is free, so the pre-fix wedge -- the state that hung the
// K6 worker's page and killed the app -- shows up as this step FAILing on its bound, not as a
// silent pass. Then: no refusal/banner, a real pointer move still produces one of the three readout
// states the hover contract admits, and one more "Zoom to layer" restores a drawn view.
// ---------------------------------------------------------------------------------------
const K7_ZOOM_OUT_NOTCHES = 15; // the ruled figure (entry 60 (a), "15-notch E2E step"); A9' drives
// the same count zooming in.
const K7_MIN_RESTORED_NON_BG_FRACTION = 0.02; // the SAME "something is actually drawn" floor stepA7
// already uses after its own "Zoom to layer" click -- restated, not re-derived.
// The preregistration's own "the declared partial-view status shows" half, now ASSERTED rather than
// merely recorded (reviewer gate should-fix 4). Duplicated verbatim from
// `src/residency/residencyStatus.ts:429-430` (`SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`) rather than
// imported: this harness is Node-side and imports nothing from `src/` -- the same convention
// `K6_REFUSAL_TEXT` above follows ("App.tsx:1417, verbatim"). If that string is ever re-worded (it is
// a DRAFT awaiting the human's own 24(b) sight, per its doc comment), this copy must move with it,
// and this step failing loudly is how that gets noticed.
const K7_SETTLED_PARTIAL_TEXT = "Filling has finished for this view — some areas were not loaded; pan or zoom to load them.";
// Re-review should-fix 3: the bound the status assertion re-reads `.residency-status` under, once the
// notch loop is done. The SAME 10s magnitude each notch's own settle wait already uses -- a BOUND, not
// a timing claim and not a duration this step reports (ADR-018).
const K7_STATUS_SETTLE_TIMEOUT_MS = 10_000;

async function stepK7(page, consoleHandle) {
  // The shipped default arm, asserted per this step rather than inherited (the same non-pinning
  // readback `main` performs once, restated here so this step's own verdict names the arm it ran on).
  const arm = await page.evaluate(() => window.__SPATIAL_E2E__.getResidencyArm?.());
  if (arm !== "candidate") {
    throw new Error(`K7: expected the shipped default residency arm ("candidate") but readback was ${JSON.stringify(arm)}`);
  }

  await clickZoomToLayer(page, consoleHandle, "K7 (zoom to layer: the fit this gesture starts from)");
  const rect = await canvasRect(page);
  if (!rect) throw new Error("K7: .working-canvas not found");
  const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

  let notchesAnswered = 0;
  let lastStatus = null;
  // Nit (reviewer gate): `waitForSettle` already returns `{settled, count}` and this step used to
  // throw both away. `settled: false` means the render trace was still changing when the wait's own
  // BOUND expired -- not a duration, not a timing claim (ADR-018), just which of the two documented
  // exits each notch took; recorded in the summary as free evidence.
  let notchesQuiesced = 0;
  let lastTraceCount = null;
  for (let notch = 1; notch <= K7_ZOOM_OUT_NOTCHES; notch++) {
    await doWheel(page, center, K6_ZOOM_OUT_NOTCH_DELTA_Y); // positive deltaY = wheel-down = zoom OUT
    const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 500, timeoutMs: 10_000 });
    if (settle.settled) notchesQuiesced++;
    lastTraceCount = settle.count;
    // The round trip IS the responsiveness assertion -- a wedged JS thread never answers this.
    const probe = await page.evaluate(() => ({
      status: document.querySelector(".residency-status")?.textContent ?? null,
      canvasPresent: document.querySelector(".working-canvas") !== null,
    }));
    if (!probe.canvasPresent) throw new Error(`K7: .working-canvas disappeared at zoom-out notch ${notch}/${K7_ZOOM_OUT_NOTCHES}`);
    lastStatus = probe.status;
    notchesAnswered = notch;
  }
  await assertNoRefusalOrBanner(page, `K7 (after ${K7_ZOOM_OUT_NOTCHES} zoom-out notches)`);

  // The preregistration's second half, ASSERTED (should-fix 4): "the declared partial-view status
  // shows". At this camera the cover is far past `MAX_COVERING_TILES`, so the plan is truncated, the
  // fill settles, and the candidate arm's within-budget partial sentence is what must be on screen --
  // byte-for-byte, no substring match, so a re-worded or differently-derived status fails here rather
  // than passing as "some status showed".
  //
  // Re-review should-fix 3: this RE-READS the element under a bounded wait rather than asserting over
  // `lastStatus`, the loop's own snapshot. That snapshot is taken the moment the last notch's settle
  // wait returns -- and that wait is a BOUND, so it can return with the render trace still changing
  // (`settle.settled === false`), i.e. on a status the fill had not finished producing. The re-read
  // below is a bound too (ADR-018: no duration is claimed or reported anywhere here, and `runStep`'s
  // own outer timeout still backstops a genuinely wedged page); what it buys is that the assertion
  // reads the DOM as it stands once the status has settled, or fails naming whatever was last there.
  const statusRead = await waitForCondition(
    () => page.evaluate(() => document.querySelector(".residency-status")?.textContent ?? null),
    (v) => v === K7_SETTLED_PARTIAL_TEXT,
    K7_STATUS_SETTLE_TIMEOUT_MS
  );
  const settledStatus = statusRead.last;
  if (settledStatus !== K7_SETTLED_PARTIAL_TEXT) {
    throw new Error(
      `K7: expected .residency-status after the last zoom-out notch to be the declared partial-view status ` +
        `verbatim (residencyStatus.ts:429-430) but it was ${JSON.stringify(settledStatus)} (per-notch snapshot ` +
        `at the end of the loop: ${JSON.stringify(lastStatus)}); expected ${JSON.stringify(K7_SETTLED_PARTIAL_TEXT)}`
    );
  }

  // A real pointer move, and the page still ANSWERS a read of the hover state. Any of the three
  // states the hover contract admits at this camera is a pass -- nothing (an empty readout), the
  // named below-pick-resolution refusal, or a real id. A hung page produces none of them within the
  // bound and fails loudly. What the empty branch shows is that the page answered, NOT that picking
  // resolved anything: `null` is equally consistent with no feature under the pointer and with a
  // pick that found nothing to say, and this step does not distinguish them (nor need it -- entry
  // 60's subject is the hang, not the pick contract, which K6 covers).
  await page.mouse.move(center.x + 1, center.y + 1);
  const hover = await waitForCondition(
    () =>
      page.evaluate(() => ({
        readout: document.querySelector(".hover-readout")?.textContent ?? null,
        status: document.querySelector(".residency-status")?.textContent ?? null,
        answered: true,
      })),
    (v) => v?.answered === true,
    15_000
  );
  if (!hover.ok) {
    throw new Error(`K7: the page did not answer a hover-state read within 15000ms after ${K7_ZOOM_OUT_NOTCHES} zoom-out notches`);
  }
  const readout = hover.last.readout;
  if (readout !== null && readout !== K6_REFUSAL_TEXT && !/^id \d+/.test(readout)) {
    throw new Error(`K7: .hover-readout showed an unrecognised state after the zoom-out gesture: ${JSON.stringify(readout)}`);
  }

  // A subsequent "Zoom to layer" restores the view -- the same real product action and the same
  // drawn-pixels floor stepA7 asserts after its own click.
  await clickZoomToLayer(page, consoleHandle, "K7 (zoom to layer: restore)");
  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const frac = fractionOf(pixels);
  if (frac <= K7_MIN_RESTORED_NON_BG_FRACTION) {
    throw new Error(
      `K7: "Zoom to layer" after the zoom-out gesture left pixels ${(frac * 100).toFixed(2)}% non-background ` +
        `<= ${(K7_MIN_RESTORED_NON_BG_FRACTION * 100).toFixed(1)}% -- the view did not come back`
    );
  }

  return (
    `${notchesAnswered}/${K7_ZOOM_OUT_NOTCHES} discrete zoom-OUT notches from a "Zoom to layer" fit on the ` +
    `candidate arm (readback asserted); the page answered a fresh DOM read after every notch (no hang), no ` +
    `refusal/banner; render trace went quiet within its wait bound on ${notchesQuiesced}/${K7_ZOOM_OUT_NOTCHES} ` +
    `notches (last trace count ${lastTraceCount}); .residency-status re-read under its own bound after the last ` +
    `notch and asserted verbatim = ${JSON.stringify(settledStatus)} (per-notch snapshot at that point: ` +
    `${JSON.stringify(lastStatus)}); .hover-readout after a real pointer move: ${JSON.stringify(readout)}; ` +
    `"Zoom to layer" restored ${(frac * 100).toFixed(1)}% non-bg pixels`
  );
}

/**
 * P5 repair (admission-remediation cut): known-broken since P3 removed the blanket cut-2 note
 * (`RefusalBlock.tsx`'s own top comment -- "the blanket cut-2 note this block used to render ... is
 * gone entirely, NEXT-CUT.md P3 item G") -- `.admission-cut2-note` no longer exists anywhere in the
 * DOM, so the assertion this function used to make here could never pass again. Repaired to assert
 * what actually replaced it: the refusal code/message as before, PLUS the correct remediation form
 * now rendering for that code (`formSelector` -- `.crs-assertion-form` for B2', `.identity-
 * declaration-form` for C2') instead of the note text. `expectedCandidates`, when given, additionally
 * asserts each named column appears among `.identity-declaration-candidate` (C2' only -- B2' passes
 * nothing, since the CRS form has no candidate list). No other step's assertions are touched.
 */
async function stepRefusal(page, stepId, fixturePath, expectedCode, expectedMessage, formSelector, expectedCandidates) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), fixturePath);
  if (outcome.kind !== "refused" || outcome.code !== expectedCode) {
    throw new Error(`${stepId}: expected {kind:"refused", code:"${expectedCode}"}, got ${JSON.stringify(outcome)}`);
  }
  if (outcome.message !== expectedMessage) {
    throw new Error(`${stepId}: refusal message mismatch.\nExpected: ${expectedMessage}\nActual:   ${outcome.message}`);
  }
  // P6 review, nit: scoped to `.admission-panel .admission-refusal` -- see this file's own A3' comment
  // for why a bare `.admission-refusal` selector is fragile now that `FilterPanel` can render the same
  // shared component too.
  const panel = await page.evaluate(() => {
    const el = document.querySelector(".admission-panel .admission-refusal");
    return {
      exists: !!el,
      codeText: el?.querySelector(".admission-refusal-code")?.textContent ?? null,
      messageText: el?.querySelector(".admission-refusal-message")?.textContent ?? null,
      hasButton: !!el?.querySelector("button"),
    };
  });
  if (!panel.exists) throw new Error(`${stepId}: .admission-panel .admission-refusal panel not found in the DOM`);
  if (panel.codeText !== expectedCode) throw new Error(`${stepId}: panel code text was "${panel.codeText}", expected "${expectedCode}"`);
  if (panel.messageText !== expectedMessage) {
    throw new Error(`${stepId}: panel message text mismatch.\nExpected: ${expectedMessage}\nActual:   ${panel.messageText}`);
  }
  if (panel.hasButton) throw new Error(`${stepId}: a <button> exists inside .admission-refusal (expected no dismiss control)`);
  // The repair itself: the correct remediation form (NOT the removed cut-2 note) is what now
  // reaches the operator for this code (AdmissionPanel.tsx's formFamilyForCode/nextFormFamily).
  const form = await page.evaluate((sel) => {
    const present = document.querySelector(sel) !== null;
    const candidates = Array.from(document.querySelectorAll(".identity-declaration-candidate")).map(
      (el) => el.textContent?.trim()
    );
    return { present, candidates };
  }, formSelector);
  if (!form.present) throw new Error(`${stepId}: ${formSelector} not present after the refusal (the correct remediation form must render)`);
  for (const candidate of expectedCandidates ?? []) {
    if (!form.candidates.includes(candidate)) {
      throw new Error(`${stepId}: candidate list missing "${candidate}". Actual: ${JSON.stringify(form.candidates)}`);
    }
  }
  // The "No summary" half of the walkthrough's own claim (B2/C2): `AdmissionPanel`'s local `state`
  // is replaced wholesale on a refusal (`state.kind === "admitted"` is what gates rendering
  // `DescribeSummary`), so `.describe-summary` must be gone the instant a refusal lands -- assertable
  // regardless of whether a *previous* admission had shown one. The "no canvas change" half is not
  // asserted here; see `MANUAL-WALKTHROUGH.md`'s own coverage table for that named gap.
  const summaryPresent = await page.evaluate(() => document.querySelector(".describe-summary") !== null);
  if (summaryPresent) throw new Error(`${stepId}: .describe-summary still present after a refusal`);
  return `refused ${expectedCode}; message verbatim; ${formSelector} present${
    expectedCandidates?.length ? ` (candidates include ${expectedCandidates.join(", ")})` : ""
  }; no dismiss button on the panel; no describe-summary`;
}

async function stepNet(page, badResponses) {
  const linkHrefs = await page.evaluate(() =>
    Array.from(document.querySelectorAll("link[rel]")).map((l) => ({ rel: l.getAttribute("rel"), href: l.getAttribute("href") }))
  );
  if (badResponses.length === 0) {
    return `no >=400 response observed this run (${linkHrefs.length === 0 ? "index.html declares no <link rel>, nothing to probe" : `declared links: ${JSON.stringify(linkHrefs)}`})`;
  }
  const summary = badResponses.map((b) => `${b.status} ${b.url}`).join("; ");
  return `${badResponses.length} response(s) >= 400 this run: ${summary}`;
}

// ---------------------------------------------------------------------------------------

async function main() {
  // Same knob/pattern as `debug-session.mjs`'s watchdog: unref'd, fires only if the process
  // is otherwise still alive, backstops the 2026-08-12 ~16h-hang class of bug and anything
  // else in this file that ends up wedged for an unanticipated reason.
  // 900s since K7 joined the run (entry 60's own step, bounded at 240s of its own): the whole-run
  // watchdog has to stay ABOVE the sum this file's steps can legitimately spend, or a slow-but-
  // working run dies here instead of reporting. 900_000 is the same default `filter-panel.mjs` and
  // `admission-remediation.mjs` already carry. A bound, not a timing claim (ADR-018).
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 900_000);
  const watchdog = setTimeout(() => {
    console.error(`regression: SPATIAL_E2E_DEADLINE_MS (default 900000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  for (const [label, path] of [
    ["100k happy path", FIXTURE_100K],
    ["no CRS", FIXTURE_NO_CRS],
    ["missing identity", FIXTURE_MISSING_IDENTITY],
  ]) {
    if (!existsSync(path)) {
      console.error(`regression: ${label} fixture not found: ${path}`);
      console.error(`Regenerate the manual-walkthrough fixtures with:\n  ${REGEN_COMMAND}`);
      process.exitCode = 1;
      return;
    }
  }

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`regression: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);
  const badResponses = [];
  page.on("response", (response) => {
    const status = response.status();
    if (status >= 400) badResponses.push({ url: response.url(), status });
  });

  /** @type {Array<{id: string, status: "PASS"|"FAIL"|"INFO", note: string}>} */
  const results = [];

  async function runStep(id, timeoutMs, fn, passStatus = "PASS") {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(fn(), timeoutMs, id);
      results.push({ id, status: passStatus, note });
      console.log(`[${id}] ${passStatus} (${Date.now() - startedAt}ms): ${note}`);
    } catch (e) {
      const note = e?.message ?? String(e);
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
    }
  }

  try {
    // Gate, not a walkthrough step: runs before A1' on the launch path and the attach path
    // alike (`waitForMountReady`'s own doc comment has the 2026-08-12 fresh-launch finding
    // this closes). Its own thrown message already names what never appeared; let it
    // propagate to the outer `catch` below rather than wrapping it again here.
    console.log(`regression: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const mountReady = await waitForMountReady(page);
    console.log(
      `regression: mount-readiness gate PASSED after ${mountReady.readyAfterMs}ms (.app-header and window.__SPATIAL_E2E__.openPath both present)`
    );

    // RELEASE-0.1 item 7 (2026-09-07, MUST-FIX 1, reviewer gate): NO arm pin here any more -- this
    // run exercises the SHIPPED DEFAULT residency arm (candidate), unpinned, the same as an ordinary
    // operator would get. An earlier version of this piece pinned the whole file to baseline; the
    // reviewer found that over-applied the human's ruling ("every test encoding the refusal
    // contract", not the suites containing one) and left the shipped default with zero regression
    // coverage from this file. `OVERCEIL'`/`REOPEN'` (the two steps that DID need baseline) moved to
    // `e2e/refusal-contract-baseline.mjs`'s own process; see that file's own top comment.
    //
    // Post-PASS sweep S-c (2026-09-08, reviewer gate): "no pin" is not "no assumption" -- on the
    // ATTACH path (a previous script's own instance, still running), this run inherits whatever arm
    // that prior script left the app pinned to. `e2e/refusal-contract-baseline.mjs` deliberately
    // leaves a BASELINE-pinned app running when it finishes, exactly the class MUST-FIX 2 fixed for
    // `residency-harness.mjs` (a harness inferring its arm instead of asserting it). A non-pinning
    // READBACK, asserted, closes the same gap here: fails loudly, naming the actual value, rather
    // than silently exercising the wrong arm under the "shipped default" label.
    const armReadback = await page.evaluate(() => window.__SPATIAL_E2E__.getResidencyArm?.());
    if (armReadback !== "candidate") {
      throw new Error(
        `regression: expected the shipped default residency arm ("candidate") but readback was ${JSON.stringify(armReadback)} -- ` +
          `this run attached to an app a prior script left pinned to a different arm (no pin is applied here by design; ` +
          `see this file's own comment above)`
      );
    }

    // Harness hygiene, not a walkthrough step: a previous run (or prior interactive use)
    // may have left a dismissable refusal banner up from before this run started. Clearing
    // it here means A5'/A6'-A8' see only what *this* run's own gestures produced, not a
    // stale leftover from a session this script merely attached to.
    await page
      .evaluate(() => {
        document.querySelectorAll(".canvas-refusal button, .error-banner button").forEach((b) => b.click());
      })
      .catch(() => {});

    await runStep("A1'", 15_000, () => stepA1(page));
    await runStep("A3'", 40_000, () => stepA3(page));
    await runStep("A4'", 60_000, () => stepA4(page, consoleHandle));
    await runStep("A5'/A6'", 60_000, () => stepA5A6(page, consoleHandle));
    // Up to `OFF_DATA_MAX_DRAGS` (10) drag+settle+capture rounds to provably leave the data
    // extent, then the "Zoom to layer" click and its own settle -- generously bounded above what
    // 10 rounds of a ~10s settle bound could ever actually need in practice.
    await runStep("A7'", 150_000, () => stepA7(page, consoleHandle));
    await runStep("A8'", 45_000, () => stepA8(page, consoleHandle));
    // P8 zoom-in fix: up to 2 zoom attempts, each bounded at a 15s settle, ahead of the original
    // budget below -- up to 3 candidate points x 2 orientations x 5s bounded wait each = 30s worst
    // case, plus the grid capture and the empty-space half. 120s gives comfortable headroom without
    // masking a genuine hang (every individual wait inside stays independently bounded).
    await runStep("A9'", 120_000, () => stepA9(page, consoleHandle));
    // K6, entry 47 (the hover readout's re-pick on camera settle -- `stepK6`'s own top comment has
    // the full account of all four cases, including why case (i) uses "Zoom to layer" rather than an
    // extreme camera jump and why case (iv)'s pan is deck.gl's own keyboard pan). This now runs the
    // A9'-proven candidate-finding search THREE times (case (i); case (iii), which case (iv) then
    // continues from; case (ii)), two "Zoom to layer" clicks, two single wheel notches for case
    // (iii), a key-press loop for case (iv), and a per-notch settle loop for case (ii)'s own >= 8
    // notches.
    //
    // The bound below is UNCHANGED across that widening, and the reason is structural, not measured:
    // every wait this step performs is already independently bounded -- each candidate search, each
    // settle wait, each readout poll, and both loops are counted rather than open-ended -- so a hang
    // cannot hide inside it, and this bound is a backstop on the composition as a whole rather than
    // a budget to tune. Widening it would eat the WHOLE run's own `SPATIAL_E2E_DEADLINE_MS`, which
    // every later step depends on; if a legitimately slow composition ever reaches it, the answer is
    // to split the step, not to raise the ceiling. Not a timing claim (ADR-018), just a bound.
    await runStep("K6", 240_000, () => stepK6(page, consoleHandle));
    // K7 (DECISIONS-PENDING entry 60, ruled (a) 2026-09-08; RELEASE-0.1.md Amendment 10): 15 discrete
    // zoom-OUT notches from a "Zoom to layer" fit on the shipped default -- the ordinary gesture that
    // reached the unbounded covering enumeration this cut's fix bounds (`MAX_COVERING_TILES`). Its
    // own composition: two "Zoom to layer" clicks (each settling under a 45s bound), 15 notches each
    // settling under a 10s bound, one 10s status re-read (re-review should-fix 3), one 15s hover read
    // -- each of those a BOUND rather than a timing claim (ADR-018), none of them a duration this step
    // reports. 240s is the outer backstop for a wedged page, not the sum of the inner bounds (whose
    // worst case would exceed it; the step fails loudly on whichever bound it reaches first).
    await runStep("K7", 240_000, () => stepK7(page, consoleHandle));
    await runStep("B2'/B3'", 30_000, () =>
      stepRefusal(page, "B2'/B3'", FIXTURE_NO_CRS, "engine.crs_undeclared", CRS_UNDECLARED_MESSAGE, ".crs-assertion-form")
    );
    await runStep("C2'/C3'", 30_000, () =>
      stepRefusal(
        page,
        "C2'/C3'",
        FIXTURE_MISSING_IDENTITY,
        "engine.identity_unusable",
        IDENTITY_UNUSABLE_MESSAGE,
        ".identity-declaration-form",
        ["parcel_key"]
      )
    );
    // OVERCEIL'/REOPEN' moved to `e2e/refusal-contract-baseline.mjs` (RELEASE-0.1 item 7, MUST-FIX 1).

    // Final sweep, not just A8''s own point-in-time check: "anywhere in the run" includes
    // whatever B'/C' logged after A8' finished.
    const finalDomText = await page.evaluate(() => document.body.textContent ?? "").catch(() => "");
    const hitConsole = consoleHandle.entries.some((e) => e.text.includes("too_many_pending_streams"));
    const hitDom = finalDomText.includes("too_many_pending_streams");
    if (hitConsole || hitDom) {
      const a8 = results.find((r) => r.id === "A8'");
      const note = `too_many_pending_streams observed somewhere in the full run (console=${hitConsole}, dom=${hitDom}, final sweep)`;
      if (a8) {
        if (a8.status !== "FAIL") {
          a8.status = "FAIL";
          a8.note = `${a8.note}; FINAL SWEEP: ${note}`;
          console.error(`[A8'] downgraded to FAIL by final sweep: ${note}`);
        }
      } else {
        results.push({ id: "A8'", status: "FAIL", note });
      }
    }

    // "INFO" (not "PASS"/"FAIL"): informational only, never fails the run.
    await runStep("NET'", 10_000, () => stepNet(page, badResponses), "INFO");

    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    const statusWidth = 6;
    console.log(`${"Step".padEnd(idWidth)}  ${"Status".padEnd(statusWidth)}  Note`);
    console.log(`${"-".repeat(idWidth)}  ${"-".repeat(statusWidth)}  ${"-".repeat(40)}`);
    for (const r of results) {
      console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(statusWidth)}  ${r.note}`);
    }

    const anyFail = results.some((r) => r.status === "FAIL");
    process.exitCode = anyFail ? 1 : 0;
  } catch (e) {
    console.error(`regression: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    // DECISIONS-PENDING.md entry 0's evidence extraction: this script otherwise never persists
    // the full console/render-trace ledger it already captured in-memory (only step-level
    // pass/fail notes reach stdout) -- same write-a-JSON-report pattern as `debug-session.mjs`,
    // added here so the one authorized instrumented run leaves a durable, complete ledger.
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `regression-render-trace-${Date.now()}.json`);
      writeFileSync(
        ledgerPath,
        JSON.stringify({ renderTrace: consoleHandle.renderTrace(), allConsoleEntries: consoleHandle.entries }, null, 2)
      );
      console.log(`Full render-trace ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`regression: failed to write the render-trace ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    // Disconnects only -- `session.stop()` is never called here, success or failure: this
    // app is already running and must stay running (task constraint), and a launched
    // fallback session follows `debug-session.mjs`'s own policy of leaving itself up too.
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
