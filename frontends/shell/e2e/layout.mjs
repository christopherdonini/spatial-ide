#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- the Map Studio frame, on real WebView2: E-KEYS, E-FIELD,
// E-LANDMARKS, E-FOCUS, E-FIT, E-FLOOR and E-REOPEN (asserted), from
// SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md section 4; RESIZEQ and FILL (asserted) and BURST (recorded, never
// asserted), from SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md section 4. Fixtures: `filter-zoned.parquet`, plus
// `100k-happy-path.parquet` for the reopen and FILL steps; the suite records each fixture's sha256 before and
// after its run (section 3). Nothing here is a measurement or a performance claim.
//
// What CDP key injection proves and does not (section 0.5, H2): `page.keyboard.press` reaches the
// page's own `keydown` listener; it does NOT cross WebView2's accelerator-key layer, so this suite
// cannot say that a real Ctrl+B, Ctrl+I or Ctrl+J gets there. That is row X3 of the walkthrough's
// layout Part, the human's observation.
//
// `waitForMountReady`/`withTimeout`/`waitForCondition` are duplicated from `filter-panel.mjs` rather
// than imported, this workspace's own convention for sibling suites.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, canvasRect, doWheel, ZOOM_NOTCH_DELTA_Y, CDP_PORT } from "./lib.mjs";
import { loadShellModule } from "./tsModuleLoader.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");
const FIXTURE_DIR = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\";
const FIXTURE_FILTER = `${FIXTURE_DIR}filter-zoned.parquet`;
const FIXTURE_100K = `${FIXTURE_DIR}100k-happy-path.parquet`;
const REGEN_COMMAND =
  "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";

// layout/layoutConstants.ts's MAP_MIN_*: declared there, restated here (an e2e module imports no src).
const MAP_MIN_WIDTH_PX = 480;
const MAP_MIN_HEIGHT_PX = 320;
const MOUNT_READY_TIMEOUT_MS = 90_000;
const SETTLE_MS = 250; // a React commit after a key press; not a timing claim
// e2e-local windows (shell-map-refill-after-resize section 7), harness bounds and not timing claims.
const RESIZEQ_WINDOW_MS = 3_000;
const FILL_WINDOW_MS = 10_000;
const BURST_MOVES = 24; // at least 20 pointer moves
const BURST_STEP_PX = 4;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

function withTimeout(promise, ms, stepId) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${stepId}: timed out after ${ms}ms`)), ms);
    Promise.resolve(promise).then(
      (value) => (clearTimeout(timer), resolve(value)),
      (err) => (clearTimeout(timer), reject(err))
    );
  });
}

async function waitForMountReady(page, timeoutMs = MOUNT_READY_TIMEOUT_MS) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const ready = await page.evaluate(
        () => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function"
      );
      if (ready) return Date.now() - start;
    } catch {
      // the page may be mid-navigation; poll again
    }
    await sleep(300);
  }
  throw new Error(`mount-readiness gate: .app-header and window.__SPATIAL_E2E__.openPath not present within ${timeoutMs}ms`);
}

/** The layout as an operator would read it, from the real DOM. `canvasSame` compares the stored
 * `.working-canvas` node (`window.__layoutE2eCanvas`, set at OPEN) with the live one. */
const readLayout = (page) =>
  page.evaluate(() => {
    const hidden = (selector) => document.querySelector(selector)?.hasAttribute("hidden") ?? null;
    const box = document.querySelector(".canvas-container")?.getBoundingClientRect();
    return {
      layers: hidden('aside[aria-label="Layers"]'),
      inspector: hidden('aside[aria-label="Inspector"]'),
      activity: hidden('section[aria-label="Activity"]'),
      mapHidden: hidden('main[aria-label="Map"]'),
      canvasSame:
        window.__layoutE2eCanvas === document.querySelector(".working-canvas") && window.__layoutE2eCanvas?.isConnected === true,
      width: box?.width ?? 0,
      height: box?.height ?? 0,
    };
  });

async function press(page, chord) {
  await page.keyboard.press(chord);
  await sleep(SETTLE_MS);
}

function assertMapUsable(label, layout) {
  if (layout.mapHidden !== false) throw new Error(`${label}: the map region is hidden or missing (hidden=${layout.mapHidden})`);
  if (!layout.canvasSame) throw new Error(`${label}: the stored .working-canvas node is no longer the live, connected one`);
  if (layout.width < MAP_MIN_WIDTH_PX || layout.height < MAP_MIN_HEIGHT_PX) {
    throw new Error(`${label}: .canvas-container is ${layout.width} x ${layout.height}, below ${MAP_MIN_WIDTH_PX} x ${MAP_MIN_HEIGHT_PX}`);
  }
}

async function stepOpen(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_FILTER);
  if (outcome.kind !== "admitted") throw new Error(`OPEN: openPath(filter fixture) returned ${JSON.stringify(outcome)}`);
  await page.waitForSelector(".working-canvas", { timeout: 30_000 });
  await page.click("#inspector-tab-layer"); // an earlier suite (e2e:style) leaves the Style tab selected
  await page.evaluate(() => {
    window.__layoutE2eCanvas = document.querySelector(".working-canvas");
  });
  return "admitted; .working-canvas node stored for the identity checks";
}

async function stepKeys(page) {
  const chords = [["Control+KeyB", "layers"], ["Control+KeyI", "inspector"], ["Control+KeyJ", "activity"]];
  const notes = [];
  for (const [chord, own] of chords) {
    for (let press_n = 1; press_n <= 2; press_n += 1) {
      const before = await readLayout(page);
      await press(page, chord);
      const after = await readLayout(page);
      for (const region of ["layers", "inspector", "activity"]) {
        const expected = region === own ? !before[region] : before[region];
        if (after[region] !== expected) {
          throw new Error(`E-KEYS: ${chord} press ${press_n}: ${region} hidden=${after[region]}, expected ${expected} (only ${own} may flip)`);
        }
      }
      assertMapUsable(`E-KEYS: ${chord} press ${press_n}`, after);
      notes.push(`${after.width}x${after.height}`);
    }
  }
  return `each chord twice flipped only its own region; map never hidden, canvas node identical, map sizes ${notes.join(" ")}`;
}

async function stepField(page) {
  const text = "zone = 'residential'";
  await page.fill("input.filter-predicate", text);
  await page.focus("input.filter-predicate");
  await press(page, "Control+KeyI");
  const closed = await page.evaluate(() => ({
    inspectorHidden: document.querySelector('aside[aria-label="Inspector"]').hasAttribute("hidden"),
    onMap: document.activeElement === document.querySelector('main[aria-label="Map"]'),
  }));
  if (!closed.inspectorHidden) throw new Error("E-FIELD: Ctrl+I did not hide the Inspector");
  if (!closed.onMap) throw new Error("E-FIELD: focus is not on the map region while the Inspector is hidden");
  await press(page, "Control+KeyI");
  const value = await page.inputValue("input.filter-predicate");
  if (value !== text) throw new Error(`E-FIELD: .filter-predicate text is ${JSON.stringify(value)} after Ctrl+I twice, expected ${JSON.stringify(text)}`);
  return "the predicate text survived Ctrl+I twice; focus was on the map while the Inspector was hidden";
}

async function stepLandmarks(page) {
  await press(page, "Control+KeyJ"); // open Activity so every region is in the tree
  try {
    const dom = await page.evaluate(() => ({
      banner: document.querySelector("header") !== null,
      names: [...document.querySelectorAll("aside[aria-label], main[aria-label], section[aria-label]")].map(
        (el) => `${el.tagName.toLowerCase()}:${el.getAttribute("aria-label")}`
      ),
      contentinfo: document.querySelector("footer") !== null,
    }));
    for (const want of ["aside:Layers", "main:Map", "aside:Inspector", "section:Activity"]) {
      if (!dom.names.includes(want)) throw new Error(`E-LANDMARKS: the DOM has no ${want}; found ${JSON.stringify(dom.names)}`);
    }
    if (!dom.banner || !dom.contentinfo) throw new Error("E-LANDMARKS: no <header> or no <footer> in the DOM");
    let axNote = "accessibility tree not read";
    try {
      const cdp = await page.context().newCDPSession(page);
      const { nodes } = await cdp.send("Accessibility.getFullAXTree");
      const seen = nodes.filter((n) => !n.ignored).map((n) => `${n.role?.value}:${n.name?.value ?? ""}`);
      for (const want of ["banner:", "complementary:Layers", "main:Map", "complementary:Inspector", "region:Activity", "contentinfo:"]) {
        if (!seen.some((s) => s === want || (want.endsWith(":") && s.startsWith(want)))) {
          throw new Error(`E-LANDMARKS: the accessibility tree has no ${want}`);
        }
      }
      axNote = "accessibility tree read over CDP";
    } catch (e) {
      if (String(e?.message).startsWith("E-LANDMARKS")) throw e;
      axNote = `accessibility tree unavailable over this connection (${e?.message}); DOM-level check only`;
    }
    return `banner, complementary Layers and Inspector, main Map, region Activity, contentinfo present; ${axNote}`;
  } finally {
    await press(page, "Control+KeyJ");
  }
}

async function stepFocus(page) {
  await press(page, "Control+KeyJ"); // every region open
  try {
    await page.evaluate(() => { document.body.tabIndex = -1; document.body.focus(); document.body.removeAttribute("tabindex"); }); // sequential focus restarts at the top
    const order = [];
    for (let i = 0; i < 120; i += 1) {
      await page.keyboard.press("Tab");
      const where = await page.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return "none";
        const parts = [
          ["header", "top"],
          ["#region-layers", "layers"],
          [".attention-strip", "attention"],
          ["#region-map", "map"],
          ["#region-inspector", "inspector"],
          ["#region-activity", "activity"],
          ["footer", "status"],
        ];
        for (const [selector, name] of parts) if (document.querySelector(selector)?.contains(el)) return name;
        return "splitter";
      });
      if (where === "none") break;
      if (where === "splitter" || order[order.length - 1] === where) continue;
      if (order.includes(where)) break; // the walk wrapped round to a region it already visited
      order.push(where);
    }
    const expected = ["top", "layers", "map", "inspector", "activity"];
    if (JSON.stringify(order) !== JSON.stringify(expected)) {
      throw new Error(`E-FOCUS: the Tab walk visited ${JSON.stringify(order)}, expected ${JSON.stringify(expected)} (attention strip skipped when empty)`);
    }
    return `the Tab walk visited ${order.join(" > ")}`;
  } finally {
    await page.evaluate(() => document.activeElement?.blur());
    await press(page, "Control+KeyJ");
  }
}

async function stepFit(page) {
  await press(page, "Control+KeyJ"); // every region open
  const cdp = await page.context().newCDPSession(page);
  const noScrollbar = () =>
    page.evaluate(() => ({
      inner: `${window.innerWidth}x${window.innerHeight}`,
      pageScroll: document.documentElement.scrollHeight > window.innerHeight || document.documentElement.scrollWidth > window.innerWidth,
      appScroll: (() => {
        const app = document.querySelector(".app");
        return app.scrollHeight > app.clientHeight || app.scrollWidth > app.clientWidth;
      })(),
    }));
  const notes = [];
  try {
    for (const [label, viewport] of [["native", null], ["1366x768", { width: 1366, height: 768 }]]) {
      if (viewport !== null) {
        try {
          await page.setViewportSize(viewport);
        } catch (e) {
          throw new Error(`E-FIT: page.setViewportSize(${viewport.width}x${viewport.height}) failed (${e.message}); the form's fallback (a launch with a config overlay) is not built into this suite: STOP and report`);
        }
        await sleep(500);
      }
      const fit = await noScrollbar();
      if (viewport !== null && fit.inner !== `${viewport.width}x${viewport.height}`) {
        throw new Error(`E-FIT: inner size is ${fit.inner} after setViewportSize(${viewport.width}x${viewport.height}): STOP and report`);
      }
      if (fit.pageScroll || fit.appScroll) throw new Error(`E-FIT: ${label} (${fit.inner}): a scrollbar is possible (page=${fit.pageScroll}, .app=${fit.appScroll}) with every region open`);
      const layout = await readLayout(page);
      assertMapUsable(`E-FIT ${label}`, layout);
      notes.push(`${label} inner ${fit.inner}: map ${layout.width}x${layout.height} (recorded; only the minimum is asserted)`);
    }
  } finally {
    await cdp.send("Emulation.clearDeviceMetricsOverride").catch(() => {});
    await sleep(400);
    await press(page, "Control+KeyJ");
  }
  return notes.join("; ");
}

// E-FLOOR (PRE-REGISTRATION Amendment 9, item 1; a test added after a gate finding). E-FIT never fills the attention strip or
// the status bar, so it cannot see their real caps. This step holds the real DOM to the declared map minimum (480 x 320) at the
// viewport floor (1024 x 640) with Activity open and BOTH bars filled past their caps. The bars are filled by DOM content added
// here -- 40 marker rows in each, the strip un-hidden -- because the product has no path that fills either past its cap (the
// strip has no items today and the status bar holds a handful). The probe nodes and the `hidden` flag are put back in `finally`.
const FLOOR_VIEWPORT = { width: 1024, height: 640 }; // layout/layoutConstants.ts's VIEWPORT_FLOOR, restated (an e2e module imports no src)
const FLOOR_PROBE_ROWS = 40; // far past either cap: 40 rows of ~1.2 rem is over 700 px against caps of 128 and 48
async function stepFloor(page) {
  await press(page, "Control+KeyJ"); // Activity open
  const cdp = await page.context().newCDPSession(page);
  try {
    try {
      await page.setViewportSize(FLOOR_VIEWPORT);
    } catch (e) {
      throw new Error(`E-FLOOR: page.setViewportSize(${FLOOR_VIEWPORT.width}x${FLOOR_VIEWPORT.height}) failed (${e.message}): STOP and report`);
    }
    await sleep(500);
    await page.evaluate((rows) => {
      const strip = document.querySelector(".attention-strip");
      const bar = document.querySelector(".status-bar");
      window.__floorProbe = { stripHidden: strip.hidden };
      strip.hidden = false;
      for (const host of [strip, bar]) {
        for (let i = 0; i < rows; i++) {
          const row = document.createElement("div");
          row.setAttribute("data-floor-probe", "1");
          row.style.flex = "0 0 100%";
          row.textContent = `E-FLOOR probe row ${i}`;
          host.appendChild(row);
        }
      }
    }, FLOOR_PROBE_ROWS);
    await sleep(500);
    const inner = await page.evaluate(() => `${window.innerWidth}x${window.innerHeight}`);
    if (inner !== `${FLOOR_VIEWPORT.width}x${FLOOR_VIEWPORT.height}`) throw new Error(`E-FLOOR: inner size is ${inner} after setViewportSize: STOP and report`);
    const heights = await page.evaluate(() => ({
      strip: document.querySelector(".attention-strip").getBoundingClientRect().height,
      bar: document.querySelector(".status-bar").getBoundingClientRect().height,
      activityHidden: document.querySelector('section[aria-label="Activity"]').hasAttribute("hidden"),
    }));
    if (heights.activityHidden) throw new Error("E-FLOOR: Activity is not open");
    const layout = await readLayout(page);
    assertMapUsable("E-FLOOR", layout);
    return `at ${inner} with Activity open and both bars filled past their caps (attention strip ${heights.strip}px, status bar ${heights.bar}px): map ${layout.width}x${layout.height}`;
  } finally {
    await page
      .evaluate(() => {
        for (const node of document.querySelectorAll("[data-floor-probe]")) node.remove();
        const strip = document.querySelector(".attention-strip");
        if (strip && window.__floorProbe) strip.hidden = window.__floorProbe.stripHidden;
        delete window.__floorProbe;
      })
      .catch(() => {});
    await cdp.send("Emulation.clearDeviceMetricsOverride").catch(() => {});
    await sleep(400);
    await press(page, "Control+KeyJ");
  }
}

// RESIZEQ and FILL (shell-map-refill-after-resize section 4). The trace lines are read as the suite already reads them:
// `console.debug(PREFIX, "<class>", {...})` arrives as `[render-trace] <class> {key: value, ...}` (view-state parsed as
// regression.mjs's `parseViewStateLine` does).
const traceLines = (consoleHandle, cls) => consoleHandle.renderTrace().filter((e) => e.text.includes(`[render-trace] ${cls} `));
const queryLines = (consoleHandle) => traceLines(consoleHandle, "viewport_query");
function parseViewState(text) {
  const m = /view-state \{targetX: (\S+), targetY: (\S+), zoom: (\S+), originX: (\S+), originY: (\S+)\}/.exec(text);
  return m === null ? null : { targetX: Number(m[1]), targetY: Number(m[2]), zoom: Number(m[3]), originX: Number(m[4]), originY: Number(m[5]) };
}
const lastViewState = (consoleHandle) => parseViewState(traceLines(consoleHandle, "view-state").at(-1)?.text ?? "");
const canvasSize = (page) => page.evaluate(() => ({ width: document.querySelector(".working-canvas").clientWidth, height: document.querySelector(".working-canvas").clientHeight }));
/** How much wider the map becomes when the Inspector closes: the Inspector region plus its splitter, measured from the DOM. */
const inspectorGrowthPx = (page) =>
  page.evaluate(() => document.querySelector('aside[aria-label="Inspector"]').getBoundingClientRect().width + document.querySelector("#splitter-inspector").getBoundingClientRect().width);
/** Quiet trace for 3 s AND no stream in flight or queued -- the same two signals residency-harness.mjs settles on. */
async function settleFully(page, consoleHandle, label) {
  const quiet = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const counts = () => page.evaluate(async () => (await window.__SPATIAL_E2E__.residencyInFlightStreamCount?.() ?? 0) + (await window.__SPATIAL_E2E__.residencyQueuedTileCount?.() ?? 0));
  for (let i = 0; i < 75 && quiet.settled && (await counts()) !== 0; i += 1) await sleep(200);
  const left = await counts();
  if (!quiet.settled || left !== 0) throw new Error(`${label}: the trace did not settle (quiet=${quiet.settled}, in-flight+queued=${left}): invalidator I6, STOP and report`);
}
async function waitForGridFrame(page, label) {
  for (let i = 0; i < 300; i += 1) {
    const frame = await page.evaluate(() => window.__SPATIAL_E2E__.residencyGridFrame?.() ?? null);
    if (frame !== null) return frame;
    await sleep(200);
  }
  throw new Error(`${label}: no grid frame was established within 60000ms: invalidator I3, STOP and report`);
}
async function ensureInspectorOpen(page) {
  if ((await readLayout(page)).inspector) await press(page, "Control+KeyI");
}

async function stepResizeQ(page, consoleHandle) {
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  await page.click(".zoom-to-layer"); // a real click: the fit reports its view, which is what a later growth is compared against
  await settleFully(page, consoleHandle, "RESIZEQ: after Zoom to layer");
  try {
    // The precondition, computed before the toggle: the cells the grown view covers that the current view does not.
    const frame = await waitForGridFrame(page, "RESIZEQ");
    const view = lastViewState(consoleHandle);
    if (view === null) throw new Error("RESIZEQ: no view-state line after Zoom to layer: invalidator I3, STOP and report");
    const { computeAuthoritativeViewportBbox } = await loadShellModule("src/canvas/viewportBbox.ts");
    const { tilesCoveringBbox, tileKeyToString } = await loadShellModule("src/canvas/tileGrid.ts");
    const size = await canvasSize(page);
    const growth = await inspectorGrowthPx(page);
    const coverAt = (widthPx) => new Set(tilesCoveringBbox(frame, frame.level, computeAuthoritativeViewportBbox({ ...view, widthPx, heightPx: size.height })).map(tileKeyToString));
    const before = coverAt(size.width);
    const predictedNew = [...coverAt(size.width + growth)].filter((key) => !before.has(key)).length;
    if (predictedNew < 1) throw new Error(`RESIZEQ: closing the Inspector (+${growth}px) is predicted to cover ${predictedNew} new cells at ${size.width}x${size.height}: invalidator I3, STOP and report`);

    const mark = queryLines(consoleHandle).length;
    await press(page, "Control+KeyI"); // close
    await sleep(RESIZEQ_WINDOW_MS);
    const afterClose = queryLines(consoleHandle).length - mark;
    if (afterClose < 1) throw new Error(`RESIZEQ: closing the Inspector gave ${afterClose} new viewport_query lines within ${RESIZEQ_WINDOW_MS}ms, expected at least 1 (predicted new cells ${predictedNew})`);
    await settleFully(page, consoleHandle, "RESIZEQ: after closing the Inspector");
    const grown = await canvasSize(page);

    const mark2 = queryLines(consoleHandle).length;
    await press(page, "Control+KeyI"); // reopen
    await sleep(RESIZEQ_WINDOW_MS);
    const afterOpen = queryLines(consoleHandle).length - mark2;
    if (afterOpen !== 0) throw new Error(`RESIZEQ: reopening the Inspector gave ${afterOpen} new viewport_query lines, expected 0`);
    return `closing the Inspector gave ${afterClose} new viewport_query lines within ${RESIZEQ_WINDOW_MS}ms (base: 0), reopening gave ${afterOpen}; predicted new cells ${predictedNew} (recorded beside the observed count; ${size.width}x${size.height} -> ${grown.width}x${grown.height} CSS px), the trace settled after the close`;
  } finally {
    await ensureInspectorOpen(page);
  }
}

async function stepReopen(page) {
  const before = await readLayout(page);
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_100K);
  if (outcome.kind !== "admitted") throw new Error(`E-REOPEN: openPath(100k fixture) returned ${JSON.stringify(outcome)}`);
  await page.waitForSelector(".working-canvas", { timeout: 30_000 });
  const after = await readLayout(page);
  if (after.canvasSame) throw new Error("E-REOPEN: the .working-canvas node is the one stored before the reopen; a new handle must remount it");
  const oldConnected = await page.evaluate(() => window.__layoutE2eCanvas?.isConnected ?? false);
  if (oldConnected) throw new Error("E-REOPEN: the old .working-canvas node is still connected after the reopen");
  const same = ["layers", "inspector", "activity"].every((region) => before[region] === after[region]);
  if (!same) throw new Error(`E-REOPEN: the layout changed across the reopen (before ${JSON.stringify(before)}, after ${JSON.stringify(after)})`);
  return "the second fixture replaced the canvas node (a new handle remounts it); the layout was unchanged";
}

// FILL' (shell-map-refill-after-resize Amendment 2, item 4). The parcel area of `100k-happy-path.parquet` in LV95 metres is an
// e2e-local declared value (item 5), not a product constant, read from the generator: kernel/tests/manual_walkthrough_fixtures.rs:43-54
// builds FixtureSpec { features: 100_000 }; its default domain is Lv95Metres (engine/src/fixture.rs:566), whose grid starts at E_LO = 2_600_000.0,
// N_LO = 1_200_000.0 (engine/src/fixture.rs:67-68) in 40.0 m cells (engine/src/fixture.rs:93); `parcel` (engine/src/fixture.rs:1258-1266) puts feature `id`
// in column id % cols and row id / cols with cols = ceil(sqrt(features)) = 317, so 100_000 / 317 gives 315 full rows (315 * 317 = 99_855). The
// area spans all 317 columns (2_600_000 + 317 * 40 = 2_612_680) and the 315 full rows (1_200_000 + 315 * 40 = 1_212_600). Each ring is drawn
// around its parcel's centre (engine/src/fixture.rs:1273), so a grid cell lying wholly inside the area holds parcel centres.
const PARCEL_AREA = { xmin: 2_600_000, ymin: 1_200_000, xmax: 2_612_680, ymax: 1_212_600 };
// regression.mjs's FIND_WITHIN_BUDGET_PATTERN, restated (an e2e module imports no sibling suite): the status shown only when every cell of the last plan is complete.
const WITHIN_BUDGET_PATTERN = /^Showing all \d+ features in view$/;

async function stepFill(page, consoleHandle) {
  const frame = await waitForGridFrame(page, "FILL");
  await settleFully(page, consoleHandle, "FILL: before the notch");
  const { computeAuthoritativeViewportBbox } = await loadShellModule("src/canvas/viewportBbox.ts");
  const { tilesCoveringBbox, tileBbox, tileKeyToString } = await loadShellModule("src/canvas/tileGrid.ts");
  const centre = await canvasRect(page).then((r) => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 }));
  const zoom0 = lastViewState(consoleHandle)?.zoom;
  const markView = consoleHandle.renderTrace().length;
  // One declared wheel notch (the session's first reported view), not a search; the precondition below is computed and recorded.
  await doWheel(page, centre, ZOOM_NOTCH_DELTA_Y);
  await settleFully(page, consoleHandle, "FILL: after the wheel notch");
  const view = lastViewState(consoleHandle);
  if (zoom0 === undefined || view === null || view.zoom === zoom0) throw new Error("FILL: a wheel notch at the canvas centre did not change the zoom: invalidator I3, STOP and report");
  const size = await canvasSize(page);
  const growth = await inspectorGrowthPx(page);
  const status = await page.evaluate(() => document.querySelector(".residency-status")?.textContent ?? null);
  if (!WITHIN_BUDGET_PATTERN.test(status ?? "")) throw new Error(`FILL: .residency-status is ${JSON.stringify(status)} after the notch, not the complete within-budget sentence: invalidator I3, STOP and report`);
  const cover = (v, width, height) => tilesCoveringBbox(frame, frame.level, computeAuthoritativeViewportBbox({ ...v, widthPx: width, heightPx: height }));
  const wholly = (key) => { const b = tileBbox(frame, frame.level, key); return b.xmin >= PARCEL_AREA.xmin && b.xmax <= PARCEL_AREA.xmax && b.ymin >= PARCEL_AREA.ymin && b.ymax <= PARCEL_AREA.ymax; };
  /** Cells the grown view covers that no view-state line since the mark covers at the size before the toggle, lying wholly inside the parcel area. */
  const qualifying = (width, height) => {
    const asked = new Set();
    for (const e of consoleHandle.renderTrace().slice(markView)) {
      const v = e.text.includes("[render-trace] view-state ") ? parseViewState(e.text) : null;
      if (v !== null) for (const key of cover(v, size.width, size.height)) asked.add(tileKeyToString(key));
    }
    return cover(lastViewState(consoleHandle), width, height).filter((key) => !asked.has(tileKeyToString(key)) && wholly(key)).length;
  };
  const qualifyingBefore = qualifying(size.width + growth, size.height);
  if (qualifyingBefore < 1) throw new Error(`FILL: ${qualifyingBefore} qualifying cells before the toggle (zoom ${view.zoom}, ${size.width}x${size.height} + ${growth}px): invalidator I3, STOP and report`);

  const mark = consoleHandle.renderTrace().length;
  try {
    await press(page, "Control+KeyI"); // close: the map grows
    const issued = new Set();
    let rows = 0;
    for (let waited = 0; waited < FILL_WINDOW_MS && (issued.size === 0 || rows === 0); waited += 200) {
      await sleep(200);
      const since = consoleHandle.renderTrace().slice(mark);
      for (const e of since) {
        const issuedMatch = /stream-issued \{dataset: \S+, streamHandle: (\S+)\}/.exec(e.text);
        if (issuedMatch) issued.add(issuedMatch[1]);
      }
      rows = since.reduce((sum, e) => {
        const m = /\[render-trace\] batch \{streamHandle: (\S+), batchSeq: \d+, rows: (\d+)/.exec(e.text);
        return m !== null && issued.has(m[1]) ? sum + Number(m[2]) : sum;
      }, 0);
    }
    const grown = await canvasSize(page);
    const qualifyingAfter = qualifying(grown.width, grown.height); // confirmed at the size measured after the toggle; below one voids the outcome
    if (qualifyingAfter < 1) throw new Error(`FILL: ${qualifyingAfter} qualifying cells at the measured ${grown.width}x${grown.height} after the toggle (${qualifyingBefore} before; ${issued.size} streams, ${rows} rows): outcome void, invalidator I3, STOP and report`);
    if (issued.size < 1 || rows < 1) throw new Error(`FILL: within ${FILL_WINDOW_MS}ms of closing the Inspector ${issued.size} streams were issued and ${rows} rows arrived on them, expected at least 1 stream and 1 row (qualifying cells ${qualifyingBefore} before, ${qualifyingAfter} after; zoom ${view.zoom})`);
    await settleFully(page, consoleHandle, "FILL: after closing the Inspector");
    return `one wheel notch at the canvas centre (zoom ${zoom0} -> ${view.zoom}); qualifying cells ${qualifyingBefore} before the toggle (${size.width}+${growth}px wide) and ${qualifyingAfter} after (${grown.width}x${grown.height} measured); closing the Inspector issued ${issued.size} streams carrying ${rows} rows, and the trace settled`;
  } finally {
    await ensureInspectorOpen(page);
  }
}

// BURST: RECORDED, NOT ASSERTED. A continuous drag of the map | Inspector splitter; the viewport_query lines' times are
// relative to the first move, the last move and the release. Timing on a shared machine is not asserted.
async function stepBurst(page, consoleHandle) {
  await settleFully(page, consoleHandle, "BURST: before the drag");
  const box = await page.evaluate(() => {
    const r = document.querySelector("#splitter-inspector").getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
  const mark = queryLines(consoleHandle).length;
  await page.mouse.move(box.x, box.y);
  await page.mouse.down();
  const firstMove = Date.now();
  for (let i = 1; i <= BURST_MOVES; i += 1) await page.mouse.move(box.x + i * BURST_STEP_PX, box.y);
  const lastMove = Date.now();
  await page.mouse.up();
  const release = Date.now();
  await sleep(RESIZEQ_WINDOW_MS);
  const lines = queryLines(consoleHandle).slice(mark);
  const relative = lines.map((e) => `${e.at - firstMove}`).join(", ");
  // Put the splitter back with a second drag (unrecorded) so the later steps see the layout they expect.
  await page.mouse.move(box.x + BURST_MOVES * BURST_STEP_PX, box.y);
  await page.mouse.down();
  for (let i = BURST_MOVES - 1; i >= 0; i -= 1) await page.mouse.move(box.x + i * BURST_STEP_PX, box.y);
  await page.mouse.up();
  await settleFully(page, consoleHandle, "BURST: after the drag back");
  return `RECORDED, NOT ASSERTED: ${BURST_MOVES} moves of ${BURST_STEP_PX}px; ${lines.length} viewport_query lines at ms after the first move [${relative}] (last move at ${lastMove - firstMove} ms, release at ${release - firstMove} ms)`;
}

async function main() {
  const fixtures = [FIXTURE_FILTER, FIXTURE_100K];
  const missing = fixtures.filter((path) => !existsSync(path));
  if (missing.length > 0) {
    console.error(`layout: fixture(s) not found: ${missing.join(", ")}\nRegenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    return;
  }
  const hashesBefore = fixtures.map(sha256);

  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`layout: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    return;
  }
  const { browser, page, launched } = session;
  const consoleHandle = attachConsole(page);
  const results = [];

  async function runStep(id, timeoutMs, fn) {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(fn(), timeoutMs, id);
      results.push({ id, status: "PASS", note });
      console.log(`[${id}] PASS (${Date.now() - startedAt}ms): ${note}`);
    } catch (e) {
      results.push({ id, status: "FAIL", note: e?.message ?? String(e) });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${e?.message ?? e}`);
    }
  }

  try {
    console.log(`layout: mount-readiness gate passed after ${await waitForMountReady(page)}ms`);
    await runStep("OPEN", 60_000, () => stepOpen(page));
    await runStep("E-KEYS", 60_000, () => stepKeys(page));
    await runStep("E-FIELD", 60_000, () => stepField(page));
    await runStep("E-LANDMARKS", 60_000, () => stepLandmarks(page));
    await runStep("E-FOCUS", 60_000, () => stepFocus(page));
    await runStep("E-FIT", 60_000, () => stepFit(page));
    await runStep("E-FLOOR", 60_000, () => stepFloor(page));
    await runStep("RESIZEQ", 120_000, () => stepResizeQ(page, consoleHandle));
    await runStep("E-REOPEN", 90_000, () => stepReopen(page));
    await runStep("FILL", 180_000, () => stepFill(page, consoleHandle));
    await runStep("BURST", 90_000, () => stepBurst(page, consoleHandle));
    const hashesAfter = fixtures.map(sha256);
    const unchanged = hashesBefore.every((hash, i) => hash === hashesAfter[i]);
    results.push({ id: "FIXTURES", status: unchanged ? "PASS" : "FAIL", note: fixtures.map((path, i) => `${path.split("\\").pop()} sha256 ${hashesBefore[i]} -> ${hashesAfter[i]}`).join("; ") });

    console.log("\n== Summary ==");
    for (const r of results) console.log(`${r.id.padEnd(12)}  ${r.status.padEnd(6)}  ${r.note}`);
    process.exitCode = results.some((r) => r.status === "FAIL") ? 1 : 0;
  } catch (e) {
    console.error(`layout: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(join(OUT_DIR, `layout-results-${Date.now()}.json`), JSON.stringify({ results, entries: consoleHandle.entries }, null, 2));
    } catch (e) {
      console.error(`layout: failed to write the results ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    await browser.close().catch(() => {}); // disconnect only, never stop the app
    console.log(launched ? `This run launched the app; it stays RUNNING on CDP port ${CDP_PORT}.` : `Attached to an already-running app on CDP port ${CDP_PORT}; leaving it running.`);
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
