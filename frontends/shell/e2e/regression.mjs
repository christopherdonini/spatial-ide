#!/usr/bin/env node
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
  const refusalPanel = await page.evaluate(() => document.querySelector(".admission-refusal") !== null);
  if (refusalPanel) throw new Error("A3': .admission-refusal panel present after a successful admission");
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

async function stepA7(page, consoleHandle) {
  const rect = await canvasRect(page);
  if (!rect) throw new Error("A7': .working-canvas not found");
  const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  const stride = Math.max(80, Math.min(300, rect.width / 3));
  for (let i = 0; i < 4; i++) {
    await doPan(page, center, -stride, 0);
  }
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1000, timeoutMs: 15_000 });
  await assertNoRefusalOrBanner(page, "A7' (pan far)");

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
    throw new Error(`A7': pixels non-background fraction ${(frac * 100).toFixed(2)}% <= 2% after "Zoom to layer" (settled=${settle.settled})`);
  }
  return `panned far (4x ${Math.round(stride)}px), clicked "Zoom to layer", pixels ${(frac * 100).toFixed(1)}% non-bg after (settled=${settle.settled})`;
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

async function stepA9(page, consoleHandle) {
  // Fresh grid, taken now (after A7''s re-fit *and* A8''s burst) -- never A4''s, which is
  // stale the moment A5'-A8' start moving the camera (the piece's own ordering note).
  const grid = await page.evaluate((regions) => window.__SPATIAL_E2E__.capturePixels(regions), gridRegions());
  const rect = await canvasRect(page);
  if (!rect) throw new Error("A9': .working-canvas not found");

  const fractions = grid.regions.map(fractionOf);
  let denseIdx = 0;
  let emptyIdx = 0;
  for (let i = 1; i < fractions.length; i++) {
    if (fractions[i] > fractions[denseIdx]) denseIdx = i;
    if (fractions[i] < fractions[emptyIdx]) emptyIdx = i;
  }
  let secondDenseIdx = -1;
  for (let i = 0; i < fractions.length; i++) {
    if (i === denseIdx) continue;
    if (secondDenseIdx === -1 || fractions[i] > fractions[secondDenseIdx]) secondDenseIdx = i;
  }
  if (fractions[denseIdx] <= 0) {
    throw new Error(
      `A9': no non-background grid cell to hover (fractions: ${fractions.map((f) => (f * 100).toFixed(1) + "%").join(", ")})`
    );
  }

  // 2026-08-13 fix: deterministic, read-back-verified targets from `capturePixels`'s new
  // `samplePoint` field, not a heuristic cell-center guess (the failure mode traced to a prior
  // A9' run's own ledger: full delivery, no errors, a guessed center landing in a gap between
  // parcels). Up to 3 distinct candidates, each tried under both plausible row-0 conventions.
  const candidates = [];
  const pushCandidate = (point) => {
    if (point && !candidates.some((c) => samePoint(c, point))) candidates.push(point);
  };
  pushCandidate(grid.regions[denseIdx].samplePoint);
  pushCandidate(grid.samplePoint);
  if (secondDenseIdx >= 0 && fractions[secondDenseIdx] > 0) {
    pushCandidate(grid.regions[secondDenseIdx].samplePoint);
  }
  if (candidates.length === 0) {
    throw new Error(
      "A9': every candidate region reported a non-background fraction > 0 but no samplePoint -- capturePixels contract violated"
    );
  }

  let found = null;
  const attempts = [];
  // `candidates` is already capped at 3 entries by `pushCandidate`'s own three call sites above
  // (dense region, frame-wide, second-densest region) -- no `.slice(0, 3)` needed here; a prior
  // version had one, dead (it could never actually truncate anything).
  outer: for (const point of candidates) {
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
    `hovered a verified non-background pixel (buffer ${found.point.x},${found.point.y}, flipY=${found.flipY}, ` +
    `css ${found.css.x.toFixed(1)},${found.css.y.toFixed(1)}) after ${attempts.length} attempt(s) -> "${found.text}"; ` +
    `moved to emptiest cell (#${emptyIdx}, ${(fractions[emptyIdx] * 100).toFixed(1)}%) -> hover-readout gone`
  );
}

async function stepRefusal(page, stepId, fixturePath, expectedCode, expectedMessage) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), fixturePath);
  if (outcome.kind !== "refused" || outcome.code !== expectedCode) {
    throw new Error(`${stepId}: expected {kind:"refused", code:"${expectedCode}"}, got ${JSON.stringify(outcome)}`);
  }
  if (outcome.message !== expectedMessage) {
    throw new Error(`${stepId}: refusal message mismatch.\nExpected: ${expectedMessage}\nActual:   ${outcome.message}`);
  }
  const panel = await page.evaluate(() => {
    const el = document.querySelector(".admission-refusal");
    return {
      exists: !!el,
      codeText: el?.querySelector(".admission-refusal-code")?.textContent ?? null,
      messageText: el?.querySelector(".admission-refusal-message")?.textContent ?? null,
      cut2Text: el?.querySelector(".admission-cut2-note")?.textContent ?? null,
      hasButton: !!el?.querySelector("button"),
    };
  });
  if (!panel.exists) throw new Error(`${stepId}: .admission-refusal panel not found in the DOM`);
  if (panel.codeText !== expectedCode) throw new Error(`${stepId}: panel code text was "${panel.codeText}", expected "${expectedCode}"`);
  if (panel.messageText !== expectedMessage) {
    throw new Error(`${stepId}: panel message text mismatch.\nExpected: ${expectedMessage}\nActual:   ${panel.messageText}`);
  }
  if (panel.cut2Text === null || !/cut-2/.test(panel.cut2Text)) {
    throw new Error(`${stepId}: cut-2 remediation note missing or unexpected: ${JSON.stringify(panel.cut2Text)}`);
  }
  if (panel.hasButton) throw new Error(`${stepId}: a <button> exists inside .admission-refusal (expected no dismiss control)`);
  // The "No summary" half of the walkthrough's own claim (B2/C2): `AdmissionPanel`'s local `state`
  // is replaced wholesale on a refusal (`state.kind === "admitted"` is what gates rendering
  // `DescribeSummary`), so `.describe-summary` must be gone the instant a refusal lands -- assertable
  // regardless of whether a *previous* admission had shown one. The "no canvas change" half is not
  // asserted here; see `MANUAL-WALKTHROUGH.md`'s own coverage table for that named gap.
  const summaryPresent = await page.evaluate(() => document.querySelector(".describe-summary") !== null);
  if (summaryPresent) throw new Error(`${stepId}: .describe-summary still present after a refusal`);
  return `refused ${expectedCode}; message verbatim; cut-2 note present; no dismiss button on the panel; no describe-summary`;
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
    await runStep("A7'", 60_000, () => stepA7(page, consoleHandle));
    await runStep("A8'", 45_000, () => stepA8(page, consoleHandle));
    // Up to 3 candidate points x 2 orientations x 5s bounded wait each = 30s worst case, plus the
    // grid capture and the empty-space half -- 60s gives comfortable headroom without masking a
    // genuine hang (the per-candidate 5s bound is what actually limits any single wait).
    await runStep("A9'", 60_000, () => stepA9(page, consoleHandle));
    await runStep("B2'/B3'", 30_000, () => stepRefusal(page, "B2'/B3'", FIXTURE_NO_CRS, "engine.crs_undeclared", CRS_UNDECLARED_MESSAGE));
    await runStep("C2'/C3'", 30_000, () =>
      stepRefusal(page, "C2'/C3'", FIXTURE_MISSING_IDENTITY, "engine.identity_unusable", IDENTITY_UNUSABLE_MESSAGE)
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
