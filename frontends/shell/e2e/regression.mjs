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

import { existsSync } from "node:fs";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

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

async function stepA9(page) {
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
  if (fractions[denseIdx] <= 0) {
    throw new Error(
      `A9': no non-background grid cell to hover (fractions: ${fractions.map((f) => (f * 100).toFixed(1) + "%").join(", ")})`
    );
  }

  const densePoint = bufferRegionToCss(grid.regions[denseIdx], rect, 0.5, 0.5);
  await page.mouse.move(densePoint.x, densePoint.y);
  const appeared = await waitForCondition(
    () => page.evaluate(() => document.querySelector(".hover-readout")?.textContent ?? null),
    (text) => text !== null && /^id \d+/.test(text),
    15_000
  );
  if (!appeared.ok) {
    throw new Error(`A9': .hover-readout did not appear with text matching /^id \\d+/ within 15000ms (last seen: ${JSON.stringify(appeared.last)})`);
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

  return `hovered densest cell (#${denseIdx}, ${(fractions[denseIdx] * 100).toFixed(1)}%) -> "${appeared.last}"; moved to emptiest cell (#${emptyIdx}, ${(fractions[emptyIdx] * 100).toFixed(1)}%) -> hover-readout gone`;
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

async function stepReopen(page, consoleHandle) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_100K);
  if (outcome.kind !== "admitted") {
    throw new Error(`REOPEN': expected {kind:"admitted"} reopening the 100k fixture from a refused state, got ${JSON.stringify(outcome)}`);
  }
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  // `WorkingCanvas` is keyed on `admitted.dataset` (`App.tsx`'s D4 fix -- ADR-010 rule 1 and the
  // 2,012,436 = 1,961,249 + 51,187 evidence it fixes): `open_dataset` mints a fresh dataset handle
  // on every call, this fixture included on a reopen, so React fully unmounts the previous
  // `WorkingCanvas` instance and mounts a new one -- a fresh `ResidentSet`, a fresh
  // `hasAutoFitRef` (starting `false` again), a fresh `OffsetFrame`. The one-shot
  // auto-fit-on-open therefore fires again on *this* reopen, the same as it did for A4', so
  // clicking "Zoom to layer" below is no longer load-bearing for correctness -- kept anyway
  // because it is cheap and exercises the same affordance A7' already covers. The assertion
  // right below this comment, not the click that follows it, is what actually checks the D4 fix:
  // a still-broken reopen (the old, unkeyed canvas reconciling stale residency into the new
  // dataset) would banner a ceiling refusal here, before any click.
  await assertNoRefusalOrBanner(page, "REOPEN' (before Zoom to layer)");
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll("button")).find((b) => b.textContent?.includes("Zoom to layer"));
    btn?.click();
  });
  const settle = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const pixels = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const frac = fractionOf(pixels);
  if (frac <= 0.02) {
    throw new Error(`REOPEN': pixels non-background fraction ${(frac * 100).toFixed(2)}% <= 2% after reopening from refused state (settled=${settle.settled})`);
  }
  return `reopened 100k fixture from refused state -> admitted; canvas ${(frac * 100).toFixed(1)}% non-bg after settle`;
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
    await runStep("A9'", 40_000, () => stepA9(page));
    await runStep("B2'/B3'", 30_000, () => stepRefusal(page, "B2'/B3'", FIXTURE_NO_CRS, "engine.crs_undeclared", CRS_UNDECLARED_MESSAGE));
    await runStep("C2'/C3'", 30_000, () =>
      stepRefusal(page, "C2'/C3'", FIXTURE_MISSING_IDENTITY, "engine.identity_unusable", IDENTITY_UNUSABLE_MESSAGE)
    );
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
