#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- STYLE'/OPACITY'/OUTLINE'/DOC'/RESET' steps for NEXT-CUT.md's
// style-panel cut, phase P6. Sibling to `regression.mjs`/`filter-panel.mjs`, not folded into either
// (same "an unrelated defect never entangles with this piece's own" reasoning `filter.mjs`'s and
// `filter-panel.mjs`'s own headers already state) -- drives the real rendered `.style-panel` DOM
// NEXT-CUT.md P6 names: `.style-panel`/`.style-disclosure` (collapsed by default), `input.style-
// fill-color`, `input.style-fill-opacity`, `input.style-outline-color`, `input.style-outline-width`,
// `button.style-reset`, `pre.style-document` (verified against `frontends/shell/src/style/
// StylePanel.tsx`/`document.ts` before writing the assertions below).
//
// **The colour-input event mechanism -- verified empirically, not assumed (this file's whole reason
// to exist per NEXT-CUT.md P6's own instruction to "find what works and record it").** A live probe
// (disposed after this finding was recorded; not part of this suite) drove `input.style-fill-color`
// (type=color) and `input.style-fill-opacity` (type=range) two ways against the real running app:
// plain `page.fill(selector, value)`, and a native-setter-bypass + synthetic `input`/`change` event
// dispatch (the classic workaround for a React "controlled" input's value tracker silently
// swallowing a directly-assigned `.value`, per React's `packages/react-dom/src/client/
// inputValueTracking.js`). **Both worked** on the installed playwright-core@1.62.1 + this app's
// React 18.3.1 (verified by reading `pre.style-document`'s own live text after each attempt, not by
// assumption): `playwright-core`'s own `fill()` implementation for `type="color"`/`type="range"`
// (`kInputTypesToSetValue` in `coreBundle.js`) already does `input.focus(); input.value = value;
// element.dispatchEvent(new Event("input", {bubbles:true, composed:true}));
// element.dispatchEvent(new Event("change", {bubbles:true}))` -- the resulting `.style-document`
// text updated correctly every time in this probe, so plain `page.fill()` (`stepStyle`/`stepOpacity`/
// `stepOutline`/`stepReset` below all use it, matching `filter-panel.mjs`'s own `input.filter-
// predicate` precedent) is what this suite actually uses; the native-setter-bypass path was
// confirmed as a working FALLBACK, not needed here, and is not carried into this file.
//
// **Layout: every `capturePixels` call in this suite happens with the panel EXPANDED, kept expanded
// for the whole run (reviewer gate, style-panel cut P7 fixes, S4 -- simplified from this file's
// original collapse-before-every-capture design).** S4 moved `StylePanel` BELOW `.canvas-container`
// in `App.tsx`; `styles.css`'s own re-measurement after that move (CUT-STATE.md) found
// `.canvas-container`'s own top/height are now IDENTICAL collapsed or expanded (flexbox distributes
// space by the sum of ALL siblings' sizes regardless of visual order, and the canvas comes first in
// visual order either way) -- the collapse-before-capture dance this file originally needed (when
// the panel sat ABOVE the canvas and expanding pushed it toward, then past, the 200px floor) is no
// longer necessary. One real, measured difference remains and is handled, not ignored: expanding
// makes the page's total content height exceed the 800px viewport, so `.app-main`'s own vertical
// scrollbar appears and narrows `.canvas-container`'s `clientWidth` by ~15px (1280 -> 1265 at
// 1280x800) -- comparing a collapsed-width baseline against expanded-width later captures within one
// test would itself be a (small) inconsistency, so this suite expands ONCE, before its very first
// capture (`stepStyle`'s own baseline), and never collapses again: every capture in this file,
// baseline included, is over the SAME (expanded) canvas width.
//
// `waitForMountReady`/`withTimeout`/`waitForCondition`/`sleep` duplicated from `filter-panel.mjs`
// rather than imported -- this workspace's own established convention for sibling E2E files
// (`filter-panel.mjs`'s own header names the identical precedent for its own Rust integration tests).
//
// **A real race found and fixed while verifying the reviewer gate's S5 fix (rAF-coalesced style
// rendering), disclosed here rather than silently worked around.** `pre.style-document`'s own text
// updates as soon as React commits the NEW `style` state (`StylePanel` is a pure function of that
// prop) -- but `WorkingCanvas`'s OWN re-render of the CANVAS ITSELF happens in a SEPARATE, passive
// `useEffect([style])`, scheduled to run AFTER that commit, not synchronously with it. Before S5,
// that effect called the real GPU `render()` directly; after S5, it schedules a coalesced frame
// instead (`coalesceOncePerFrame`). Waiting only for `pre.style-document`'s text (this file's
// existing `waitForCondition` checks) proves the STYLE STATE updated; it does NOT prove
// `WorkingCanvas`'s own effect has even RUN yet, let alone that its (possibly still-pending)
// coalesced render has painted -- two different React subtrees, two different schedules. Every
// `render()` call, coalesced or not, already logs `[render-trace] layers` (`traceLayerUpdate`) --
// `waitForFreshLayerUpdate` below polls for a NEW one of those after each input change, before ever
// capturing pixels, closing this gap structurally rather than by timing luck.

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");

// Same fixture `filter-panel.mjs`'s `OPEN`/`PANEL'` steps use (`generate_the_filter_fixture`: 2,000
// features, avg 12 vertices, categorical zone attribute) -- style v0 has no filter/attribute
// dependency of its own, so any admitted dataset with visible geometry would do; reusing this one
// avoids adding a THIRD fixture generator for the same shape of need.
const FIXTURE_STYLE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

// `document.ts`'s own `DEFAULT_STYLE_STATE` (`frontends/shell/src/style/document.ts`) restated here
// as plain literals -- this script cannot import a TS module directly, and duplicating a few known
// constants is this repo's own established sibling-file convention (see this file's top comment).
const DEFAULT_FILL_COLOR = "#4285f4";
const DEFAULT_FILL_OPACITY = 180 / 255; // kept as the exact fraction -- see document.ts's own comment
const DEFAULT_OUTLINE_COLOR = "#000000";
const DEFAULT_OUTLINE_WIDTH = 0;

// The panel's structurally-guaranteed grammar (NEXT-CUT.md binding note 5): `#rrggbb`, lowercase.
const SET_FILL_COLOR = "#cc2200"; // 204, 34, 0
const SET_FILL_COLOR_RGBA_OPAQUE = "204,34,0,255"; // opacity 1.0: no blending, exact match
const SET_FILL_OPACITY_FULL = "1";
const SET_FILL_OPACITY_PARTIAL = "0.4";
const SET_OUTLINE_COLOR = "#00ccff"; // 0, 204, 255 -- deliberately distinct from both fill families
const SET_OUTLINE_COLOR_RGBA = "0,204,255,255"; // outline alpha is always 255 (ResolvedDrawParams)
const SET_OUTLINE_WIDTH = "8";

/** Bounds one step's whole async body -- identical to `regression.mjs`'s/`filter-panel.mjs`'s own
 * helper. */
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

/** Polls `getValue()` until `predicate(value)` holds or `timeoutMs` elapses -- identical to
 * `filter-panel.mjs`'s own helper. A bounded-timeout poll is a readiness gate (has React committed
 * this state yet), never a claim about how fast anything happened (ADR-018). */
async function waitForCondition(getValue, predicate, timeoutMs, pollMs = 150) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await getValue();
    if (predicate(last)) return { ok: true, last };
    await sleep(pollMs);
  }
  return { ok: false, last };
}

/** This file's own top comment has the full account of the race this closes: `pre.style-document`'s
 * text updating proves the STYLE STATE changed, never that `WorkingCanvas`'s own (now rAF-coalesced)
 * re-render of the CANVAS has actually happened yet. `render()` logs `[render-trace] layers` on
 * EVERY call, coalesced or not (`traceLayerUpdate`) -- this polls for a NEW one beyond `sinceCount`,
 * a real, direct signal that a GPU render has actually occurred since this step's own input change,
 * never a timing claim (ADR-018): bounded, and it says "a render happened," not "how fast." */
async function waitForFreshLayerUpdate(consoleHandle, sinceCount, timeoutMs = 5_000) {
  const layerLines = () => consoleHandle.renderTrace().filter((e) => e.text.includes("layers"));
  const result = await waitForCondition(() => layerLines().length, (n) => n > sinceCount, timeoutMs, 50);
  if (!result.ok) {
    throw new Error(
      `waitForFreshLayerUpdate: no fresh [render-trace] layers line within ${timeoutMs}ms (had ${sinceCount}, still ${result.last})`
    );
  }
  return layerLines().length;
}

const MOUNT_READY_TIMEOUT_MS = 90_000;

/** Same gate `regression.mjs`/`filter-panel.mjs` use, before the first step. */
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
      lastEvalError = e?.message ?? String(e);
    }
    await sleep(300);
  }

  const missing = [];
  if (lastHeader === null) missing.push(".app-header non-null");
  if (!lastHookPresent) missing.push("window.__SPATIAL_E2E__.openPath present");
  throw new Error(
    `mount-readiness gate: timed out after ${timeoutMs}ms waiting for ${missing.join(" and ")}. page url=${page.url()}` +
      (lastEvalError ? `, last evaluate error=${lastEvalError}` : "")
  );
}

/** The first `topColors` entry (already sorted most-populous-first by `summarizePixels`) that is not
 * the exact background sample `"0,0,0,0"` -- the same `isBackgroundSample` check
 * `WorkingCanvas.tsx`'s own `summarizePixels` uses internally for its frame-wide `samplePoint`,
 * applied here to the already-public `topColors` array instead. */
function dominantNonBackground(summary) {
  return summary.topColors.find((c) => c.rgba !== "0,0,0,0") ?? null;
}

function hasColorFamily(summary, rgba) {
  return summary.topColors.some((c) => c.rgba === rgba);
}

/** "Family", not literal equality (RESET' only) -- small per-channel tolerance, since GPU blend/
 * rounding behaviour is not something this suite claims to pin bit-for-bit across machines (only the
 * opacity-1.0 case, asserted separately in STYLE', is claimed exact, and for the documented reason:
 * no blending occurs when srcAlpha=1). */
function sameColorFamily(rgbaA, rgbaB, tolerance = 3) {
  const a = rgbaA.split(",").map(Number);
  const b = rgbaB.split(",").map(Number);
  return a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) <= tolerance);
}

/** `.style-disclosure`'s own `aria-expanded` -- toggled only if it does not already match `want`. */
async function setExpanded(page, want) {
  const current = await page.evaluate(
    () => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded") === "true"
  );
  if (current === want) return;
  await page.click(".style-disclosure");
  const settled = await waitForCondition(
    () =>
      page.evaluate(() => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded") === "true"),
    (v) => v === want,
    5_000
  );
  if (!settled.ok) {
    throw new Error(`setExpanded(${want}): .style-disclosure aria-expanded never reached "${want}"`);
  }
}

/** Bounded poll for `.canvas-container`'s own client box to stop changing across two 150ms-apart
 * reads -- a readiness gate for the ONE-TIME CSS reflow the very first expand triggers (post-S4,
 * `.app-main`'s own vertical scrollbar appearing narrows `.canvas-container` by ~15px, this file's
 * own top comment), never a timing claim (ADR-018): this only says "layout is no longer visibly
 * moving," not "how fast." Called exactly once now (`stepStyle`, right after the suite's one and
 * only `setExpanded(page, true)`) -- collapsed/expanded no longer alternate within this suite (S4),
 * so there is no further reflow later steps would need to wait out. */
async function waitForCanvasLayoutStable(page, timeoutMs = 8_000) {
  const start = Date.now();
  let last = null;
  while (Date.now() - start < timeoutMs) {
    const dims = await page.evaluate(() => {
      const el = document.querySelector(".canvas-container");
      return el ? { w: el.clientWidth, h: el.clientHeight } : null;
    });
    if (dims && last && dims.w === last.w && dims.h === last.h) return dims;
    last = dims;
    await sleep(150);
  }
  return last;
}

async function readStyleDocument(page) {
  const text = await page.evaluate(() => document.querySelector("pre.style-document")?.textContent ?? null);
  if (text === null) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

async function stepOpen(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_STYLE);
  if (outcome.kind !== "admitted") {
    throw new Error(`OPEN: openPath(style fixture) returned ${JSON.stringify(outcome)}, expected {kind:"admitted"}`);
  }
  const expandedInitially = await page.evaluate(
    () => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded")
  );
  if (expandedInitially !== "false") {
    throw new Error(
      `OPEN: .style-disclosure aria-expanded is ${JSON.stringify(expandedInitially)} on a freshly admitted ` +
        `dataset -- expected "false" (collapsed by default, NEXT-CUT.md binding note 6)`
    );
  }
  return "admitted; .style-panel mounted collapsed by default";
}

/**
 * `STYLE'`: capture the baseline (default-style) render first, then set fill colour + opacity 1.0
 * through the real panel DOM and assert the dominant non-background bin is an EXACT match --
 * NEXT-CUT.md P6's own designed case: "opacity 1.0 = no blending".
 */
async function stepStyle(page, consoleHandle, ctx) {
  // The dataset's own first, unfiltered look streams in over IPC (`App.tsx`'s own "The first look
  // is unfiltered" comment) -- settle out that stream before reading a "baseline" that would
  // otherwise race an empty canvas, same discipline `filter-panel.mjs`'s own `stepPanel` uses.
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });

  // S4 (this file's own top comment): expand ONCE, here, before the very first capture -- every
  // capture in this suite, baseline included, is over the SAME (expanded) canvas width. Waits for
  // the one-time CSS reflow (the scrollbar appearing) to settle before reading anything.
  await setExpanded(page, true);
  await waitForCanvasLayoutStable(page);

  const baseline = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const baselineDominant = dominantNonBackground(baseline);
  if (!baselineDominant) {
    throw new Error(
      `STYLE': baseline capture has no non-background pixels to style against (topColors: ${JSON.stringify(baseline.topColors)})`
    );
  }
  ctx.baselineDominant = baselineDominant;

  const layersBefore = consoleHandle.renderTrace().filter((e) => e.text.includes("layers")).length;
  await page.fill("input.style-fill-color", SET_FILL_COLOR);
  await page.fill("input.style-fill-opacity", SET_FILL_OPACITY_FULL);
  const committed = await waitForCondition(
    () => readStyleDocument(page),
    (doc) => doc?.layer?.fill_color?.literal === SET_FILL_COLOR && doc?.layer?.fill_opacity?.literal === 1,
    10_000
  );
  if (!committed.ok) {
    throw new Error(
      `STYLE': pre.style-document never reflected fill_color=${SET_FILL_COLOR}/fill_opacity=1 within 10s. ` +
        `Last seen: ${JSON.stringify(committed.last)}`
    );
  }
  // This file's own top comment: the document text updating is NOT proof `WorkingCanvas`'s own
  // (rAF-coalesced) render of the CANVAS has happened yet -- wait for real evidence it has.
  await waitForFreshLayerUpdate(consoleHandle, layersBefore);

  // No collapse -- capture directly (S4's own layout fix removed the need; this file's own top
  // comment has the full account).
  const styled = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const dominant = dominantNonBackground(styled);
  if (!dominant || dominant.rgba !== SET_FILL_COLOR_RGBA_OPAQUE) {
    throw new Error(
      `STYLE': dominant non-background bin ${JSON.stringify(dominant)} !== exact "${SET_FILL_COLOR_RGBA_OPAQUE}" ` +
        `-- at fill_opacity=1 the buffer blends over transparent black with srcAlpha=1, so the result must equal ` +
        `the set colour byte for byte. Full topColors: ${JSON.stringify(styled.topColors)}`
    );
  }
  ctx.styleDominant = dominant;

  return (
    `baseline dominant ${baselineDominant.rgba}; set fill_color=${SET_FILL_COLOR}/fill_opacity=1 via the real DOM ` +
    `(input.style-fill-color + input.style-fill-opacity); dominant non-bg bin EXACTLY "${dominant.rgba}" ` +
    `(count ${dominant.count}/${styled.totalPixels})`
  );
}

/**
 * `OPACITY'`: lower opacity to ~0.4 -- asserts CHANGE only, never a literal (NEXT-CUT.md P6: "the
 * buffer blends over transparent black").
 */
async function stepOpacity(page, consoleHandle, ctx) {
  // Already expanded by `stepStyle` and never collapsed since (S4, this file's own top comment) --
  // `setExpanded`'s own no-op-if-already-`want` guard makes this call cheap and harmless either way.
  await setExpanded(page, true);
  const layersBefore = consoleHandle.renderTrace().filter((e) => e.text.includes("layers")).length;
  await page.fill("input.style-fill-opacity", SET_FILL_OPACITY_PARTIAL);
  const committed = await waitForCondition(
    () => readStyleDocument(page),
    (doc) => doc?.layer?.fill_opacity?.literal === 0.4,
    10_000
  );
  if (!committed.ok) {
    throw new Error(`OPACITY': pre.style-document never reflected fill_opacity=0.4 within 10s. Last seen: ${JSON.stringify(committed.last)}`);
  }
  await waitForFreshLayerUpdate(consoleHandle, layersBefore);

  const summary = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const dominant = dominantNonBackground(summary);
  if (!dominant) {
    throw new Error(`OPACITY': no non-background pixels after lowering opacity (topColors: ${JSON.stringify(summary.topColors)})`);
  }
  if (dominant.rgba === ctx.styleDominant.rgba) {
    throw new Error(
      `OPACITY': dominant non-bg bin unchanged (${dominant.rgba}) after fill_opacity 1 -> 0.4 -- expected a CHANGE ` +
        `(never asserting a literal here, per NEXT-CUT.md P6: the buffer blends over transparent black)`
    );
  }
  ctx.opacitySummary = summary;

  return `set fill_opacity=0.4 via the real DOM; dominant non-bg bin CHANGED ${ctx.styleDominant.rgba} -> ${dominant.rgba}`;
}

/**
 * `OUTLINE'`: outline width > 0 with a distinctive colour -> a new colour family appears in
 * `topColors`; width back to 0 -> it disappears. Change-assertion both directions, matching
 * NEXT-CUT.md P6's own wording.
 */
async function stepOutline(page, consoleHandle, ctx) {
  const beforeFamilies = new Set(ctx.opacitySummary.topColors.map((c) => c.rgba));
  if (beforeFamilies.has(SET_OUTLINE_COLOR_RGBA)) {
    throw new Error(
      `OUTLINE': "${SET_OUTLINE_COLOR_RGBA}" was already present in topColors BEFORE the outline was enabled -- ` +
        `not a distinguishing colour choice for this fixture/camera`
    );
  }

  await setExpanded(page, true);
  let layersBefore = consoleHandle.renderTrace().filter((e) => e.text.includes("layers")).length;
  await page.fill("input.style-outline-color", SET_OUTLINE_COLOR);
  await page.fill("input.style-outline-width", SET_OUTLINE_WIDTH);
  const committedOn = await waitForCondition(
    () => readStyleDocument(page),
    (doc) =>
      doc?.layer?.outline_color?.literal === SET_OUTLINE_COLOR &&
      doc?.layer?.outline_width?.literal === Number(SET_OUTLINE_WIDTH),
    10_000
  );
  if (!committedOn.ok) {
    throw new Error(
      `OUTLINE': pre.style-document never reflected outline_color=${SET_OUTLINE_COLOR}/outline_width=${SET_OUTLINE_WIDTH} ` +
        `within 10s. Last seen: ${JSON.stringify(committedOn.last)}`
    );
  }
  await waitForFreshLayerUpdate(consoleHandle, layersBefore);

  const withOutline = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  if (!hasColorFamily(withOutline, SET_OUTLINE_COLOR_RGBA)) {
    throw new Error(
      `OUTLINE': expected a new colour family "${SET_OUTLINE_COLOR_RGBA}" in topColors after outline_width=` +
        `${SET_OUTLINE_WIDTH} -- topColors: ${JSON.stringify(withOutline.topColors)}`
    );
  }

  await setExpanded(page, true);
  layersBefore = consoleHandle.renderTrace().filter((e) => e.text.includes("layers")).length;
  await page.fill("input.style-outline-width", "0");
  const committedOff = await waitForCondition(
    () => readStyleDocument(page),
    (doc) => doc?.layer?.outline_width?.literal === 0,
    10_000
  );
  if (!committedOff.ok) {
    throw new Error(`OUTLINE': pre.style-document never reflected outline_width=0 within 10s. Last seen: ${JSON.stringify(committedOff.last)}`);
  }
  await waitForFreshLayerUpdate(consoleHandle, layersBefore);

  const withoutOutline = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  if (hasColorFamily(withoutOutline, SET_OUTLINE_COLOR_RGBA)) {
    throw new Error(
      `OUTLINE': "${SET_OUTLINE_COLOR_RGBA}" still present in topColors after outline_width -> 0 -- ` +
        `topColors: ${JSON.stringify(withoutOutline.topColors)}`
    );
  }

  return (
    `outline_color=${SET_OUTLINE_COLOR}/outline_width=${SET_OUTLINE_WIDTH} via the real DOM -> "${SET_OUTLINE_COLOR_RGBA}" ` +
    `appeared in topColors; outline_width=0 -> it disappeared`
  );
}

/**
 * `DOC'`: `pre.style-document` (parsed from `textContent`, never re-derived) matches the CURRENT
 * controls left by `OUTLINE'` -- fill_color/fill_opacity from `STYLE'`/`OPACITY'`, outline_color
 * still set but outline_width back to 0.
 */
async function stepDoc(page) {
  await setExpanded(page, true);
  const doc = await readStyleDocument(page);
  if (!doc) {
    throw new Error("DOC': pre.style-document missing or unparsable while expanded");
  }

  const expected = {
    "style_version": 1,
    "layer.geometry": "polygon",
    "layer.fill_color.literal": SET_FILL_COLOR,
    "layer.fill_opacity.literal": 0.4,
    "layer.outline_color.literal": SET_OUTLINE_COLOR,
    "layer.outline_width.literal": 0,
  };
  const actual = {
    "style_version": doc.style_version,
    "layer.geometry": doc.layer?.geometry,
    "layer.fill_color.literal": doc.layer?.fill_color?.literal,
    "layer.fill_opacity.literal": doc.layer?.fill_opacity?.literal,
    "layer.outline_color.literal": doc.layer?.outline_color?.literal,
    "layer.outline_width.literal": doc.layer?.outline_width?.literal,
  };
  const mismatches = Object.keys(expected).filter((k) => expected[k] !== actual[k]);
  if (mismatches.length > 0) {
    throw new Error(
      `DOC': mismatch on ${mismatches.join(", ")}. Expected: ${JSON.stringify(expected)}. Actual: ${JSON.stringify(actual)}`
    );
  }

  return `pre.style-document matches the current controls exactly (fill_color literal "${doc.layer.fill_color.literal}" among them)`;
}

/**
 * `RESET'`: `button.style-reset` -> the document returns to `DEFAULT_STYLE_STATE` (exact literal
 * fields -- the default IS a fixed, known document, unlike an opacity blend) and pixels return to the
 * baseline COLOUR FAMILY captured in `STYLE'` (a small per-channel tolerance, not bit-for-bit, since
 * this suite only claims exactness for the alpha=1 no-blend case asserted in `STYLE'` itself).
 */
async function stepReset(page, consoleHandle, ctx) {
  await setExpanded(page, true);
  const layersBefore = consoleHandle.renderTrace().filter((e) => e.text.includes("layers")).length;
  await page.click("button.style-reset");

  const committed = await waitForCondition(
    () => readStyleDocument(page),
    (doc) => doc?.layer?.fill_color?.literal === DEFAULT_FILL_COLOR,
    10_000
  );
  if (!committed.ok) {
    throw new Error(`RESET': pre.style-document never returned to fill_color=${DEFAULT_FILL_COLOR} within 10s. Last seen: ${JSON.stringify(committed.last)}`);
  }
  await waitForFreshLayerUpdate(consoleHandle, layersBefore);
  const doc = committed.last;
  const expected = {
    "style_version": 1,
    "layer.geometry": "polygon",
    "layer.fill_color.literal": DEFAULT_FILL_COLOR,
    "layer.fill_opacity.literal": DEFAULT_FILL_OPACITY,
    "layer.outline_color.literal": DEFAULT_OUTLINE_COLOR,
    "layer.outline_width.literal": DEFAULT_OUTLINE_WIDTH,
  };
  const actual = {
    "style_version": doc.style_version,
    "layer.geometry": doc.layer?.geometry,
    "layer.fill_color.literal": doc.layer?.fill_color?.literal,
    "layer.fill_opacity.literal": doc.layer?.fill_opacity?.literal,
    "layer.outline_color.literal": doc.layer?.outline_color?.literal,
    "layer.outline_width.literal": doc.layer?.outline_width?.literal,
  };
  const mismatches = Object.keys(expected).filter((k) => expected[k] !== actual[k]);
  if (mismatches.length > 0) {
    throw new Error(
      `RESET': document mismatch on ${mismatches.join(", ")} after clicking button.style-reset. ` +
        `Expected: ${JSON.stringify(expected)}. Actual: ${JSON.stringify(actual)}`
    );
  }

  const summary = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const dominant = dominantNonBackground(summary);
  if (!dominant) {
    throw new Error(`RESET': no non-background pixels after reset (topColors: ${JSON.stringify(summary.topColors)})`);
  }
  if (!sameColorFamily(dominant.rgba, ctx.baselineDominant.rgba)) {
    throw new Error(
      `RESET': dominant non-bg bin ${dominant.rgba} is not in the same colour family as STYLE''s own baseline ` +
        `${ctx.baselineDominant.rgba} (tolerance 3/channel). Full topColors: ${JSON.stringify(summary.topColors)}`
    );
  }

  return (
    `button.style-reset clicked; document returned to DEFAULT_STYLE_STATE exactly (fill_color=${DEFAULT_FILL_COLOR}, ` +
    `fill_opacity=${DEFAULT_FILL_OPACITY}, outline_width=0); dominant non-bg bin ${dominant.rgba} back in the ` +
    `baseline family (${ctx.baselineDominant.rgba})`
  );
}

async function main() {
  const DEADLINE_MS = Number(process.env.SPATIAL_E2E_DEADLINE_MS ?? 600_000);
  const watchdog = setTimeout(() => {
    console.error(`style: SPATIAL_E2E_DEADLINE_MS (default 600000) exceeded -- presumed hung, failing loudly`);
    process.exit(2);
  }, DEADLINE_MS);
  watchdog.unref();

  if (!existsSync(FIXTURE_STYLE)) {
    console.error(`style: fixture not found: ${FIXTURE_STYLE}`);
    console.error(`Regenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    return;
  }

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`style: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }

  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);

  /** @type {Array<{id: string, status: "PASS"|"FAIL", note: string}>} */
  const results = [];
  const ctx = {};

  async function runStep(id, timeoutMs, fn) {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(fn(), timeoutMs, id);
      results.push({ id, status: "PASS", note });
      console.log(`[${id}] PASS (${Date.now() - startedAt}ms): ${note}`);
    } catch (e) {
      const note = e?.message ?? String(e);
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
    }
  }

  try {
    console.log(`style: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    const mountReady = await waitForMountReady(page);
    console.log(`style: mount-readiness gate PASSED after ${mountReady.readyAfterMs}ms`);

    await runStep("OPEN", 40_000, () => stepOpen(page));
    await runStep("STYLE'", 60_000, () => stepStyle(page, consoleHandle, ctx));
    await runStep("OPACITY'", 40_000, () => stepOpacity(page, consoleHandle, ctx));
    await runStep("OUTLINE'", 40_000, () => stepOutline(page, consoleHandle, ctx));
    await runStep("DOC'", 20_000, () => stepDoc(page));
    await runStep("RESET'", 40_000, () => stepReset(page, consoleHandle, ctx));

    console.log("");
    console.log("== Summary ==");
    const idWidth = Math.max(...results.map((r) => r.id.length), "Step".length);
    const statusWidth = 6;
    console.log(`${"Step".padEnd(idWidth)}  ${"Status".padEnd(statusWidth)}  Note`);
    console.log(`${"-".repeat(idWidth)}  ${"-".repeat(statusWidth)}  ${"-".repeat(40)}`);
    for (const r of results) {
      console.log(`${r.id.padEnd(idWidth)}  ${r.status.padEnd(statusWidth)}  ${r.note}`);
    }

    process.exitCode = results.some((r) => r.status === "FAIL") ? 1 : 0;
  } catch (e) {
    console.error(`style: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `style-render-trace-${Date.now()}.json`);
      writeFileSync(
        ledgerPath,
        JSON.stringify({ renderTrace: consoleHandle.renderTrace(), allConsoleEntries: consoleHandle.entries }, null, 2)
      );
      console.log(`Full render-trace ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`style: failed to write the render-trace ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    // Same policy as every sibling script: disconnect only, never stop the app.
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
