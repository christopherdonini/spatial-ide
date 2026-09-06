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

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");

const FIXTURE_100K = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const FIXTURE_NO_CRS = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\no-crs-refused.parquet";
const FIXTURE_MISSING_IDENTITY =
  "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\missing-identity-refused.parquet";
const FIXTURE_OVER_CEILING =
  "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\over-ceiling-refused.parquet";
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

async function stepA7(page, consoleHandle) {
  const rect = await canvasRect(page);
  if (!rect) throw new Error("A7': .working-canvas not found");
  const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

  const offData = await panUntilOffData(page, consoleHandle, rect, center);
  await assertNoRefusalOrBanner(page, "A7' (pan off-data)");

  const clicked = await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("Zoom to layer"));
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!clicked) throw new Error('A7\': "Zoom to layer" button not found to click');

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
// K6 (residency-debt cut 1b, Item C; DECISIONS-PENDING entry 29; `RESIDENCY-DEBT-1B.md`): the
// sub-pixel-hover pick refusal re-evaluated on a camera change while the pointer stays put.
// Repro: hover a feature fully zoomed in (its id shows), keep the pointer stationary, zoom OUT
// past `pickResolution.ts`'s declared threshold via real wheel events with NO interceding
// `page.mouse.move` -- `WorkingCanvas.tsx`'s own `onHover` only fires on pointer MOVE, so before
// the fix the stale id readout would persist past the zoom where a fresh hover would refuse by
// name. This is the reason `page.mouse.wheel` is called directly below rather than through
// `doWheel`/`zoomInOneNotch` (both of which `page.mouse.move` the pointer to `center` first) --
// any pointer move here would let a real `onHover` re-fire and re-pick normally, which would mask
// exactly the gap this step exists to catch (the fix under test is the camera-change
// re-evaluation, not the ordinary pointer-move pick path A9' already covers).
// ---------------------------------------------------------------------------------------
const K6_ZOOM_OUT_NOTCHES_MIN = 8; // floor on zoom-OUT notches applied after finding an
// above-threshold candidate, independent of how many zoom-IN notches that search itself needed --
// guards the case where a hoverable candidate is found at a low notch, which would otherwise leave
// too few zoom-out notches to reliably cross back below the threshold.
const K6_ZOOM_OUT_NOTCH_DELTA_Y = -ZOOM_NOTCH_DELTA_Y; // reverses A9''s own zoom-in notch magnitude
// (positive deltaY = wheel-down = zoom out, the opposite of `ZOOM_NOTCH_DELTA_Y`'s zoom-in).

async function stepK6(page, consoleHandle) {
  const initialRect = await canvasRect(page);
  if (!initialRect) throw new Error("K6: .working-canvas not found");
  const center = { x: initialRect.left + initialRect.width / 2, y: initialRect.top + initialRect.height / 2 };

  // Reuses A9''s own densest-patch bisection + interior verification (`findInteriorCandidate`/
  // `verifyInteriorCandidate`, UNCHANGED) to find a real, confidently-pickable feature -- the
  // below-threshold repro needs to START from an above-threshold hover (a real id showing), exactly
  // as A9' establishes one, before this step's own zoom-out half exercises the fix.
  let found = null;
  let notchesUsed = 0;
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES && !found; notch++) {
    if (notch > 0) {
      await zoomInOneNotch(page, consoleHandle, center);
      await assertNoRefusalOrBanner(page, `K6 (zoom-in notch ${notch})`);
    }
    notchesUsed = notch;
    const rect = await canvasRect(page);
    if (!rect) throw new Error("K6: .working-canvas not found after zoom");
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
      `K6: no above-threshold hoverable candidate found after trying notch 0 plus ${MAX_ZOOM_NOTCHES} zoom-in notch(es) -- ` +
        `cannot exercise the below-threshold repro without first establishing a real id readout`
    );
  }

  // The repro itself: zoom OUT past the declared threshold with NO further `page.mouse.move` (see
  // this section's own top comment for why) -- `zoomOutNotches` deliberately exceeds however many
  // zoom-IN notches it took to find `found`, so the camera provably crosses back below whatever
  // notch first made the candidate resolvable.
  const zoomOutNotches = Math.max(notchesUsed, K6_ZOOM_OUT_NOTCHES_MIN);
  for (let i = 0; i < zoomOutNotches; i++) {
    await page.mouse.wheel(0, K6_ZOOM_OUT_NOTCH_DELTA_Y);
  }
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });

  const refusal = await waitForCondition(
    () =>
      page.evaluate(() => ({
        text: document.querySelector(".hover-readout")?.textContent ?? null,
        belowResolution: document.querySelector(".hover-readout-below-resolution") !== null,
      })),
    (v) => v.belowResolution,
    10_000
  );

  if (!refusal.ok) {
    throw new Error(
      `K6: stationary-pointer zoom-out past the declared pick-resolution threshold did not re-evaluate to the named ` +
        `refusal within 10000ms (hovered "${found.text}" at zoom-in notch ${notchesUsed}, then ${zoomOutNotches} ` +
        `zoom-out notch(es) with no pointer move; last seen: ${JSON.stringify(refusal.last)})`
    );
  }

  return (
    `hovered a real feature ("${found.text}") at zoom-in notch ${notchesUsed}, then ${zoomOutNotches} stationary-pointer ` +
    `zoom-out notch(es) -> .hover-readout re-evaluated to the named below-pick-resolution refusal (never a stale id)`
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

/**
 * Rider 1 of the human's 2026-08-13 entry-0 decision (`DECISIONS-PENDING.md`, option (a)): the
 * declared `MAX_RESIDENT_VERTICES` ceiling is a designed refusal, not a bug (`limits.ts`: refuse,
 * never silently evict), and it deserves its own deliberate acceptance step rather than the happy
 * path accidentally tripping it. `over-ceiling-refused.parquet` is a VALID GeoParquet file -- the
 * refusal is render-side (mid-stream, once resident vertices would cross the ceiling), never
 * admission-side, so `openPath` must return `{kind:"admitted"}` here, not `{kind:"refused"}`.
 *
 * The core assertion is rider 1's own words, quoted in `App.tsx`'s `nextResidencyStatus` doc
 * comment: "dismiss hides the banner, never the status indicator" -- `.canvas-refusal`'s Dismiss
 * button only ever calls `setCanvasRefusal(null)`; `.residency-status` clears only on a later full
 * delivery or a dataset change (asserted separately, by `REOPEN'` immediately after this step).
 */
async function stepOverCeiling(page, consoleHandle) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_OVER_CEILING);
  if (outcome.kind !== "admitted") {
    throw new Error(
      `OVERCEIL': openPath(over-ceiling fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"} -- ` +
        `this fixture is a VALID file; the refusal is render-side, not admission-side`
    );
  }
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });

  const before = await page.evaluate(() => ({
    canvasRefusalText: document.querySelector(".canvas-refusal")?.textContent ?? null,
    residencyStatusText: document.querySelector(".residency-status")?.textContent ?? null,
  }));
  if (before.canvasRefusalText === null) {
    throw new Error(`OVERCEIL': .canvas-refusal not present after admitting the over-ceiling fixture (settled=${settle.settled})`);
  }
  if (before.residencyStatusText === null) {
    throw new Error(`OVERCEIL': .residency-status not present after admitting the over-ceiling fixture (settled=${settle.settled})`);
  }
  // Plain digits, no thousands separators -- `App.tsx`'s own `ResidencyStatus` doc comment:
  // `datasetRowCount` is a wire `DecU64` string, never narrowed to `Number`. `100000` here is a
  // literal, not a variable, because this fixture shares the happy path's exact `features:
  // 100_000` spec (`manual_walkthrough_fixtures.rs`'s own doc comment on the generator).
  const statusPattern = /^(\d+) of 100000 features rendered — declared ceiling reached \(MAX_RESIDENT_VERTICES\)$/;
  const match = statusPattern.exec(before.residencyStatusText);
  if (!match) {
    throw new Error(
      `OVERCEIL': .residency-status text did not match the expected pattern. Actual: ${JSON.stringify(before.residencyStatusText)}`
    );
  }
  const renderedCount = Number(match[1]);

  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const frac = fractionOf(pixels);
  if (frac <= 0.02) {
    throw new Error(
      `OVERCEIL': pixels non-background fraction ${(frac * 100).toFixed(2)}% <= 2% -- expected most features to have rendered before the ceiling refusal (rendered count per the status line: ${renderedCount})`
    );
  }

  const clicked = await page.evaluate(() => {
    const btn = document.querySelector(".canvas-refusal button");
    if (!btn) return false;
    btn.click();
    return true;
  });
  if (!clicked) throw new Error("OVERCEIL': no Dismiss button found inside .canvas-refusal to click");

  const after = await page.evaluate(() => ({
    canvasRefusalPresent: document.querySelector(".canvas-refusal") !== null,
    residencyStatusText: document.querySelector(".residency-status")?.textContent ?? null,
  }));
  if (after.canvasRefusalPresent) {
    throw new Error("OVERCEIL': .canvas-refusal still present after clicking its Dismiss button");
  }
  if (after.residencyStatusText === null) {
    throw new Error(
      'OVERCEIL\': .residency-status disappeared after dismissing the banner -- rider 1\'s core claim ' +
        '("dismiss hides the banner, never the status indicator") violated'
    );
  }
  if (after.residencyStatusText !== before.residencyStatusText) {
    throw new Error(
      `OVERCEIL': .residency-status text changed across the Dismiss click. Before: ${JSON.stringify(before.residencyStatusText)}, after: ${JSON.stringify(after.residencyStatusText)}`
    );
  }

  return (
    `admitted (render-side refusal, not admission-side); .canvas-refusal and .residency-status both present after settle; ` +
    `${renderedCount} of 100000 features rendered (${(frac * 100).toFixed(1)}% pixels non-bg); ` +
    `Dismiss removed the banner but .residency-status remained: "${after.residencyStatusText}"`
  );
}

async function stepReopen(page, consoleHandle) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_100K);
  if (outcome.kind !== "admitted") {
    throw new Error(`REOPEN': expected {kind:"admitted"} reopening the 100k fixture, got ${JSON.stringify(outcome)}`);
  }
  // Rider 1 (DECISIONS-PENDING.md entry 0): `admitAndResetStaleUiState`'s "dataset-changed"
  // transition unconditionally nulls `residencyStatus` on every admission -- this reopen runs
  // immediately after `OVERCEIL'` left `.residency-status` present (deliberately, post-Dismiss),
  // so it is that transition's own assertion: a dataset change, not a banner dismiss, is what
  // must clear it. Checked before `waitForSettle` below, with no separate wait -- but not because
  // the reset itself is synchronous end-to-end: `setResidencyStatus(null)` is a synchronous JS
  // *call*, but React's own commit (re-rendering and actually updating the DOM) is not synchronous
  // with it -- React 18 flushes a batch of updates at the next microtask checkpoint, even outside
  // an event handler. What makes checking immediately safe is the `await page.evaluate(...)` this
  // line already crossed: a CDP round trip (browser IPC, not an in-page call) cannot resolve
  // before at least one full microtask checkpoint on the page has passed, so by the time this
  // step's own next `page.evaluate` below runs, React's commit is certainly already done -- the
  // ordering guarantee comes from the round trip already paid for above, not from the setter call
  // being synchronous. A still-present status at this point would be the state surviving the wrong
  // event, not a timing gap this script failed to wait out.
  const residencyStatusAfterReopen = await page.evaluate(() => document.querySelector(".residency-status")?.textContent ?? null);
  if (residencyStatusAfterReopen !== null) {
    throw new Error(
      `REOPEN': .residency-status still present after reopening the happy-path fixture (a dataset change must clear it, not just a banner dismiss). Text: ${JSON.stringify(residencyStatusAfterReopen)}`
    );
  }
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  // `WorkingCanvas` is keyed on `admitted.dataset` (`App.tsx`'s D4 fix, ADR-010 rule 1: a new
  // dataset is a new frame/identity space, so every canvas ref built against the old one must
  // reset, not survive as an untagged carryover -- see `App.tsx`'s own key comment for the
  // 2026-08-13 correction to what this fix's original evidence sentence claimed, since refuted:
  // "2,012,436 = the old dataset's still-resident 1,961,249 + the new dataset's first batch" was
  // never actually true -- both numbers were the *same* stream's own partial sum at its own
  // refusal moment (a stream then cancelled), not two different datasets' residency. The remount
  // itself was never resting on that arithmetic and stays correct regardless.
  //
  // `open_dataset` mints a fresh dataset handle on every call, this fixture included on a reopen,
  // so React fully unmounts the previous `WorkingCanvas` instance and mounts a new one -- a fresh
  // `ResidentSet`, a fresh `hasAutoFitRef` (starting `false` again), a fresh `OffsetFrame`. The
  // one-shot auto-fit-on-open therefore fires again on *this* reopen, the same as it did for A4',
  // so clicking "Zoom to layer" below is no longer load-bearing for correctness -- kept anyway
  // because it is cheap and exercises the same affordance A7' already covers. The assertion right
  // below this comment, not the click that follows it, is what actually checks the remount fix: a
  // still-broken reopen (the old, unkeyed canvas reconciling stale residency into the new dataset)
  // would banner a ceiling refusal here, before any click.
  await assertNoRefusalOrBanner(page, "REOPEN' (before Zoom to layer)");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("Zoom to layer"));
    btn?.click();
  });
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const frac = fractionOf(pixels);
  if (frac <= 0.02) {
    throw new Error(`REOPEN': pixels non-background fraction ${(frac * 100).toFixed(2)}% <= 2% after reopening (settled=${settle.settled})`);
  }
  return `reopened 100k fixture -> admitted; .residency-status cleared immediately (dataset change, not Dismiss); canvas ${(frac * 100).toFixed(1)}% non-bg after settle`;
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
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 600_000);
  const watchdog = setTimeout(() => {
    console.error(`regression: SPATIAL_E2E_DEADLINE_MS (default 600000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  for (const [label, path] of [
    ["100k happy path", FIXTURE_100K],
    ["no CRS", FIXTURE_NO_CRS],
    ["missing identity", FIXTURE_MISSING_IDENTITY],
    ["over-ceiling (deliberate)", FIXTURE_OVER_CEILING],
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
    // Residency-debt cut 1b, Item C (K6): its own zoom-in half reuses A9''s already-proven
    // candidate-finding, bounded the same way; the zoom-out half is a small, fixed number of wheel
    // notches with no settle-dependent search, so 90s gives comfortable headroom without masking a
    // genuine hang.
    await runStep("K6", 90_000, () => stepK6(page, consoleHandle));
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
    await runStep("OVERCEIL'", 60_000, () => stepOverCeiling(page, consoleHandle));
    await runStep("REOPEN'", 60_000, () => stepReopen(page, consoleHandle));

    // Final sweep, not just A8''s own point-in-time check: "anywhere in the run" includes
    // whatever B'/C'/REOPEN' logged after A8' finished.
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
