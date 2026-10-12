#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4).
//
// Phase B stages 5 and 6: the click, the selection, the inspection and the export's scope on real WebView2, asserted: E-CLICK, E-CLICK-FAST, E-SELECT,
// E-NODRAG, E-ZOOMSEL, E-SEL-PAN, E-SEL-FILTER, E-REFUSED, E-GEN, E-KINDS, E-EXPORT and E-SCOPE. Fixtures: `filter-zoned.parquet` (and a scratch copy of it, touched by
// mtime only for E-GEN's source change, as source-watch-idle.mjs does), `100k-happy-path.parquet` for the reopen, and `multipolygon-f1.parquet`,
// `point-p1.parquet` and `line-l1.parquet` for E-KINDS. Every oracle id is taken through `hoverIdAfterBarrier` from lib.mjs (Amendment 1 A2): this file
// has no barrier of its own and never takes a first poll (section 8 item 32). The Feature tab, the tool switch and the status bar item are read from the
// real DOM; the highlight is read from the drawing buffer (`capturePixels`: the highlight outlines are alpha 255, the data fill is not).
//
// EXPORT-TODAY (phase A) follows, unchanged: it RECORDS what happens when a dataset is replaced while an export runs, and asserts nothing
// (Amendment 1, A7). It starts a whole-file export of the 100k fixture through the real dialog (the prepare through the dev destination seam, as
// publish.mjs does; the phrase typed and Submit clicked as an operator would), reopens another fixture at once, and prints the panel, the host outcome
// and any export text before, after the open and after the export settles. If the export had already settled when the open returned, the record says so
// and the observation is inconclusive. E-ASK follows in its own stage.
//
// What none of this proves: a timing, a rate or a performance figure (there are none here; the millisecond numbers are bounds on waiting). A tap from a
// real WebView2 pointer is first exercised here: no earlier suite presses and releases without moving.
//
// RECORDED MUTATIONS. Each is named for the custodian to observe in a run at the stage's head; this stage applied none (port 5180 is reserved on the
// machine that wrote them). Apply one alone, run `npm run e2e:selection`, record the failing step by name with the commit, and revert it.
//   E-CLICK        src/canvas/WorkingCanvas.tsx, the tap's `resolveCandidate` dep: `resolvePick(candidate.batch, candidate.gpuOrdinal + 1)`.
//                  Expected: E-CLICK fails on the id (or a TypeError from the resolver).
//   E-CLICK-FAST   src/canvas/WorkingCanvas.tsx: the tap emits the hover readout's pick instead of the one `pickCandidateAt` resolves at the tap's pixel.
//                  Run at an odd map height (set by `setViewportSize`, as K6's re-aim does). Expected: E-CLICK-FAST fails where the stale read reproduces.
//                  It is race-dependent: if three runs do not fail, that is recorded as class 2, and UB8 is the deterministic proof.
//   E-SELECT       src/canvas/highlightLayers.ts: SELECTED_OUTLINE_RGBA alpha 0. Expected: E-SELECT fails on the pixel assertion.
//   E-NODRAG (1)   src/canvas/WorkingCanvas.tsx: add `onDragEnd: (_info, event) => onTap(event)` to the Deck props (select on the pointer's release).
//                  Expected: E-NODRAG fails on the selection count after the out-and-back drag, which releases over the pressed feature.
//   E-NODRAG (2)   src/canvas/WorkingCanvas.tsx: `controller: tool === "select" ? { dragPan: false } : true`. Expected: E-NODRAG fails on the view box
//                  (the selected feature never leaves the view).
//   E-ZOOMSEL      src/App.tsx, `handleZoomToSelection`: fit a point box at the union's corner (`{xmin: u.xmin, ymin: u.ymin, xmax: u.xmin, ymax: u.ymin}`).
//                  Expected: E-ZOOMSEL fails on the outside-the-view count or on the highlight pixels.
//   E-SEL-PAN      src/App.tsx, `onViewportChanged`: dispatch `selection.clear` on the view. Expected: E-SEL-PAN fails on the count.
//   E-SEL-FILTER   src/App.tsx, `commitActiveFilter`: also dispatch `selection.clear`. Expected: E-SEL-FILTER fails on the count after the Apply.
//   E-REFUSED      src/feature/clickEffect.ts: a click below the pick resolution returns a `selection.apply`. Expected: E-REFUSED fails on the count.
//   E-GEN          src/workspace/workspaceState.ts: in `admit` keep the selection on a rebind (`const bound = view`), and in `endGeneration` leave the views
//                  as they are. Expected: E-GEN fails on the reopen's notice, and on the source change's notice.
//   E-KINDS        src/canvas/pick.ts, `resolvePick`: use the part ordinal as the row. Expected: E-KINDS fails on the multipolygon (more than three ids).
//   E-EXPORT       src/App.tsx, the PublishPanel element: `filterActive={activeFilter !== null || selection.size > 0}` (the selection reaches the prepare). Expected: E-EXPORT fails
//                  on the run with a selection (its prompt carries a filter scope sentence, none being expected).
//   E-SCOPE        src/publish/PublishPanel.tsx, `executeInStagedScope`: `const check: ScopeCheck = { ok: true };`. Expected: E-SCOPE fails because the execute is sent
//                  and returns a success, where the shell's refusal is expected. Clean it up: the bundle that mutation writes is under target/e2e-selection-out.
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, utimesSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  attachOrLaunch,
  attachConsole,
  waitForSettle,
  canvasRect,
  doWheel,
  zoomInOneNotch,
  findInteriorCandidate,
  verifyInteriorCandidate,
  bufferPointToCss,
  subdivideRegion,
  hoverIdAfterBarrier,
  MAX_ZOOM_NOTCHES,
  ZOOM_NOTCH_DELTA_Y,
} from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..", "..");
const FIXTURES = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\";
const FIXTURE_100K = `${FIXTURES}100k-happy-path.parquet`;
const FIXTURE_FILTER = `${FIXTURES}filter-zoned.parquet`;
const FIXTURE_MULTIPOLYGON = `${FIXTURES}multipolygon-f1.parquet`;
const FIXTURE_POINT = `${FIXTURES}point-p1.parquet`;
const FIXTURE_LINE = `${FIXTURES}line-l1.parquet`;
const SCRATCH_COPY = join(HERE, "out", "selection-scratch.parquet"); // under e2e/out, which is gitignored
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Harness bounds and counts, not measurements and not claims (ADR-018).
const CLICK_SETTLE_MS = 400; // a React commit and a coalesced render after a click
const HIGHLIGHT_MIN_OPAQUE_PX = 8; // an outline is far more than this; the data fill is never alpha 255
const SCRATCH_TOUCH_OFFSET_MS = 120_000; // the same offset source-changed.mjs uses for its touch
const KINDS_ROWS_IN_F1 = 3; // multipolygon-f1.parquet holds three MultiPolygon rows (regression.mjs, MP')
const REFUSAL_ZOOM_OUT_NOTCHES_MAX = 8; // K6's re-aim zooms out at least this far to cross the pick threshold

/** The export UI as an operator sees it: the panel's text, the executing line and its Cancel, and every line of the page that names an export. */
const readExportUi = (page) =>
  page.evaluate(() => ({
    panels: document.querySelectorAll(".publish-panel").length,
    panelText: document.querySelector(".publish-panel")?.innerText ?? null,
    executing: document.querySelector(".publish-dialog-executing")?.innerText ?? null,
    cancelShown: document.querySelector(".publish-dialog-cancel-execution") !== null,
    exportLines: document.body.innerText.split("\n").filter((l) => /export|publish|bundle/i.test(l)).map((l) => l.trim()).slice(0, 12),
  }));

function auditRecords(tag) {
  const log = process.env.SPATIAL_IDE_AUDIT_LOG ?? join(process.env.LOCALAPPDATA ?? "", "spatial-ide", "audit", "publish.jsonl");
  if (!existsSync(log)) return `no audit log at ${log}`;
  const records = readFileSync(log, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
  const intent = records.find((r) => r.phase === "intent" && typeof r.destination === "string" && r.destination.includes(tag));
  return intent ? records.filter((r) => r.attempt === intent.attempt).map((r) => `${r.phase}:${r.outcome ?? ""}@${r.at}`) : [];
}

// ------------------------------------------------------------------------------------------------
// Phase B stage 5: readers, drivers and the scene.
// ------------------------------------------------------------------------------------------------

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

async function pollUntil(read, predicate, timeoutMs, pollMs = 200) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await read();
    if (predicate(last)) return { ok: true, last };
    await sleep(pollMs);
  }
  return { ok: false, last };
}

/** The Feature tab, the status bar item and the last-click line, read from the DOM: counts are the trailing number of their line, `id` the digits of the id line. */
const readTab = (page) =>
  page.evaluate(() => {
    const text = (selector) => document.querySelector(selector)?.textContent ?? null;
    const count = (selector) => {
      const m = /(\d+)\s*$/.exec(text(selector) ?? "");
      return m ? Number(m[1]) : null;
    };
    const id = /^id (\d+)/.exec(text(".feature-id") ?? "");
    return {
      id: id ? id[1] : null,
      selected: count(".feature-selected"),
      outside: count(".feature-outside-view"),
      notDrawn: count(".feature-in-view-not-drawn"),
      notice: text(".feature-notice"),
      statusItem: text(".selection-ended"),
      lastClick: text(".feature-last-click"),
      lastClickClass: document.querySelector(".feature-last-click")?.className ?? null,
      sessionEnded: document.querySelector(".canvas-session-ended") !== null,
    };
  });

const hiddenOf = (tab) => (tab.outside === null || tab.notDrawn === null ? null : tab.outside + tab.notDrawn);
const useTool = (page, name) => page.locator(".tool-switch-button", { hasText: name }).click();
const useMode = (page, label) => page.locator(".tool-switch-mode", { hasText: label }).click();
/** Clicks a Feature tab action by its label; false when it is absent or disabled. */
const featureAction = (page, label) =>
  page.evaluate((l) => {
    const button = [...document.querySelectorAll(".feature-actions button")].find((b) => b.textContent === l);
    if (!button || button.disabled) return false;
    button.click();
    return true;
  }, label);
const showFeatureTab = (page) => page.evaluate(() => document.getElementById("inspector-tab-feature")?.click());
/** Frame-wide count of alpha-255 pixels: the highlight outlines, never the data fill (alpha 180). */
const opaquePixels = async (page) => (await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels([]))).opaqueCount;
const center = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

async function clickAt(page, point) {
  await page.mouse.click(point.x, point.y);
  await sleep(CLICK_SETTLE_MS);
}

async function drag(page, from, to) {
  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  await page.mouse.move(to.x, to.y, { steps: 8 });
  await page.mouse.up();
  await sleep(CLICK_SETTLE_MS);
}

async function openFixture(page, consoleHandle, path, label) {
  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), path);
  expect(opened.kind === "admitted", `${label}: openPath(${basename(path)}) returned ${JSON.stringify(opened)}`);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 45_000 });
}

async function zoomToLayer(page, consoleHandle, label) {
  const clicked = await page.evaluate(() => {
    const button = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Zoom to layer"));
    button?.click();
    return button !== undefined;
  });
  expect(clicked, `${label}: the "Zoom to layer" button was not found`);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 45_000 });
}

/** Interior-verified drawing-buffer points of the current frame: the densest-patch candidate, then a lattice. */
async function interiorCandidates(page) {
  const bisection = await findInteriorCandidate(page);
  const { bufferWidth: bw, bufferHeight: bh } = bisection;
  const lattice = [];
  for (const fy of [0.25, 0.5, 0.75]) for (const fx of [0.2, 0.35, 0.5, 0.65, 0.8]) lattice.push({ x: Math.round(fx * bw), y: Math.round(fy * bh) });
  const points = [];
  for (const p of [bisection.candidate, ...lattice]) if ((await verifyInteriorCandidate(page, p, bw, bh)).ok) points.push(p);
  return { points, bw, bh };
}

/**
 * The scene the click steps run in: the least-zoomed camera (zoom-in notches from the current one, as A9' does) at which a hover answers with a confirmed id,
 * and up to `want` features at it with distinct ids, each as `{css, id}` (a CSS page point and the oracle id `hoverIdAfterBarrier` took there). The pointer is
 * never moved by this function afterwards. Throws when fewer than `min` are found.
 */
async function buildScene(page, consoleHandle, label, { want, min }) {
  const c = center(await canvasRect(page));
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES; notch += 1) {
    if (notch > 0) await zoomInOneNotch(page, consoleHandle, c);
    const rect = await canvasRect(page);
    const { points, bw, bh } = await interiorCandidates(page);
    if (points.length === 0) continue;
    const hits = [];
    let flipY = null;
    for (const [i, p] of points.slice(0, 14).entries()) {
      if (i > 0 && flipY === null) break; // the first candidate did not answer at this camera: zoom in one more notch
      for (const fy of flipY === null ? [true, false] : [flipY]) {
        const css = bufferPointToCss(p, rect, bw, bh, fy);
        const result = await hoverIdAfterBarrier(page, css, `${label} (notch ${notch})`);
        if (!result.ok) continue;
        flipY = fy;
        if (!hits.some((h) => h.id === result.last.id)) hits.push({ css, id: result.last.id });
        break;
      }
      if (hits.length >= want) break;
    }
    if (hits.length === 0) continue;
    expect(hits.length >= min, `${label}: only ${hits.length} feature(s) with distinct ids at the first camera that answers (notch ${notch}); ${min} needed`);
    return { hits, rect, flipY, notch };
  }
  throw new Error(`${label}: no camera within ${MAX_ZOOM_NOTCHES} zoom-in notches answered a hover with a confirmed id`);
}

// ------------------------------------------------------------------------------------------------
// The steps. Each throws on its first failed assertion and returns the note its PASS line prints.
// ------------------------------------------------------------------------------------------------

/** E-CLICK: Navigate, on a polygon: the Feature tab's id equals the oracle id at that pointer; the selection is unchanged. */
async function stepClick(page, scene) {
  const [p] = scene.hits;
  await useTool(page, "Navigate");
  await showFeatureTab(page); // B6: this step brings the Feature tab forward itself, the product does not
  await clickAt(page, p.css);
  const tab = (await pollUntil(() => readTab(page), (t) => t.id !== null, 5000)).last;
  expect(tab.id === p.id, `E-CLICK: the Feature tab shows id ${tab.id}; the oracle id at that pointer is ${p.id}`);
  expect(tab.selected === 0, `E-CLICK: a Navigate click changed the selection (Selected ${tab.selected})`);
  return `Navigate click inspected id ${tab.id}, equal to the oracle; selection 0`;
}

/** E-CLICK-FAST: stand on feature A, then move to B and click at once: the inspected id is B's. Race-dependent (see the header). */
async function stepClickFast(page, scene) {
  const [a, b] = scene.hits;
  expect(b !== undefined, "E-CLICK-FAST: the scene has one feature only");
  await useTool(page, "Navigate");
  await page.mouse.move(a.css.x, a.css.y);
  await sleep(CLICK_SETTLE_MS); // the hover readout now stands on A
  await page.mouse.move(b.css.x, b.css.y);
  await page.mouse.down();
  await page.mouse.up(); // nothing between the move and the click
  await sleep(CLICK_SETTLE_MS);
  const tab = (await pollUntil(() => readTab(page), (t) => t.id !== null, 5000)).last;
  expect(tab.id === b.id, `E-CLICK-FAST: the click at B inspected id ${tab.id}; B's oracle id is ${b.id} (A's is ${a.id})`);
  return `a move from ${a.id} to ${b.id} clicked at once inspected ${tab.id}`;
}

/** E-SELECT: a Select click: count 1, and the highlight's alpha-255 pixels appear. */
async function stepSelect(page, scene) {
  const [p] = scene.hits;
  await useTool(page, "Select");
  const before = await opaquePixels(page);
  await clickAt(page, p.css);
  const tab = (await pollUntil(() => readTab(page), (t) => t.selected === 1, 5000)).last;
  expect(tab.selected === 1, `E-SELECT: a Select click gave Selected ${tab.selected}, expected 1`);
  const after = (await pollUntil(() => opaquePixels(page), (n) => n - before >= HIGHLIGHT_MIN_OPAQUE_PX, 5000)).last;
  expect(after - before >= HIGHLIGHT_MIN_OPAQUE_PX, `E-SELECT: alpha-255 pixels ${before} -> ${after}; the highlight did not reach the screen`);
  return `Selected 1; alpha-255 pixels ${before} -> ${after}`;
}

/** E-NODRAG (H1): a drag pan in Select changes no selection, and the view box does change. */
async function stepNoDrag(page, scene) {
  const p = scene.hits[0].css;
  const c = center(scene.rect);
  const sign = p.x < c.x ? 1 : -1;
  await page.mouse.move(p.x, p.y); // out and back, released over the pressed feature
  await page.mouse.down();
  await page.mouse.move(p.x + sign * 60, p.y, { steps: 8 });
  await page.mouse.move(p.x, p.y, { steps: 8 });
  await page.mouse.up();
  await sleep(CLICK_SETTLE_MS);
  const held = await readTab(page);
  expect(held.selected === 1, `E-NODRAG: a drag that began and ended on the selected feature left Selected ${held.selected}, expected 1`);
  // Pan the selected feature out of the view, away from the edge nearest to it, and read that the view box moved.
  const away = p.x >= c.x ? 1 : -1;
  const w = scene.rect.width;
  let tab = held;
  let drags = 0;
  while (drags < 4 && !(tab.outside >= 1)) {
    const from = { x: c.x - away * 0.225 * w, y: c.y };
    await drag(page, from, { x: from.x + away * 0.45 * w, y: c.y });
    tab = (await pollUntil(() => readTab(page), (t) => t.outside !== null, 3000)).last;
    drags += 1;
  }
  expect(tab.outside >= 1, `E-NODRAG: after ${drags} drag(s) the selected feature is not reported outside the view (outside ${tab.outside}): the view box did not change`);
  expect(tab.selected === 1, `E-NODRAG: the pan changed the selection (Selected ${tab.selected})`);
  return `out-and-back drag kept Selected 1; ${drags} pan(s) moved the box (outside ${tab.outside}); Selected ${tab.selected}`;
}

/** E-ZOOMSEL: after panning off, Zoom to selection puts the selected feature back on the screen. */
async function stepZoomSel(page, consoleHandle) {
  const away = await readTab(page);
  expect(away.selected === 1 && away.outside >= 1, `E-ZOOMSEL: precondition (a selected feature panned off): Selected ${away.selected}, outside ${away.outside}`);
  const before = await opaquePixels(page);
  expect(await featureAction(page, "Zoom to selection"), "E-ZOOMSEL: Zoom to selection is absent or disabled with a selection standing");
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 30_000 });
  const back = (await pollUntil(() => readTab(page), (t) => t.outside === 0, 10_000)).last;
  expect(back.outside === 0, `E-ZOOMSEL: after Zoom to selection the feature is still reported outside the view (outside ${back.outside})`);
  const after = (await pollUntil(() => opaquePixels(page), (n) => n - before >= HIGHLIGHT_MIN_OPAQUE_PX, 10_000)).last;
  expect(after - before >= HIGHLIGHT_MIN_OPAQUE_PX, `E-ZOOMSEL: alpha-255 pixels ${before} -> ${after}; the selected feature's outline is not on the screen`);
  return `outside ${away.outside} -> 0; alpha-255 pixels ${before} -> ${after}`;
}

/** E-SEL-PAN: a pan away and back: the count is unchanged. */
async function stepSelPan(page) {
  const rect = await canvasRect(page);
  const c = center(rect);
  const dx = 0.2 * rect.width;
  await drag(page, { x: c.x - dx, y: c.y }, { x: c.x + dx, y: c.y });
  const away = await readTab(page);
  await drag(page, { x: c.x + dx, y: c.y }, { x: c.x - dx, y: c.y });
  const back = await readTab(page);
  expect(away.selected === 1 && back.selected === 1, `E-SEL-PAN: Selected was ${away.selected} after the pan away and ${back.selected} after the pan back, expected 1 and 1`);
  return "Selected 1 after the pan away and after the pan back";
}

/** E-SEL-FILTER: Apply zone = 'residential': the count is unchanged and the hidden count is at least 1; Clear: the hidden count is 0. */
async function stepSelFilter(page, consoleHandle, scene) {
  await featureAction(page, "Clear selection");
  await useTool(page, "Select");
  await useMode(page, "Add only");
  for (const h of scene.hits) await clickAt(page, h.css);
  const n = scene.hits.length;
  const selected = (await pollUntil(() => readTab(page), (t) => t.selected === n, 5000)).last;
  expect(selected.selected === n, `E-SEL-FILTER: ${n} Add only clicks on distinct features gave Selected ${selected.selected}`);
  await page.fill(".filter-predicate", "zone = 'residential'");
  await page.click(".filter-apply");
  const applied = await pollUntil(() => page.evaluate(() => document.querySelector(".filter-active")?.textContent ?? null), (t) => t !== null, 20_000);
  expect(applied.ok, "E-SEL-FILTER: the Applied line never appeared");
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 45_000 });
  const hidden = (await pollUntil(() => readTab(page), (t) => t.selected === n && hiddenOf(t) >= 1, 30_000)).last;
  expect(hidden.selected === n, `E-SEL-FILTER: Selected ${hidden.selected} after the Apply, expected ${n}`);
  expect(hiddenOf(hidden) >= 1, `E-SEL-FILTER: the hidden count after the Apply is ${hiddenOf(hidden)} (outside ${hidden.outside}, not drawn ${hidden.notDrawn}); at least 1 expected`);
  await page.click(".filter-clear");
  await pollUntil(() => page.evaluate(() => document.querySelector(".filter-active") === null), (gone) => gone === true, 20_000);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 45_000 });
  const cleared = (await pollUntil(() => readTab(page), (t) => t.selected === n && hiddenOf(t) === 0, 40_000)).last;
  expect(cleared.selected === n && hiddenOf(cleared) === 0, `E-SEL-FILTER: after Clear, Selected ${cleared.selected}, hidden ${hiddenOf(cleared)} (outside ${cleared.outside}, not drawn ${cleared.notDrawn}); ${n} and 0 expected`);
  return `Selected ${n}; hidden ${hiddenOf(hidden)} under the filter and 0 after Clear`;
}

/** E-REFUSED: below the pick resolution, a Select click changes nothing and the named state is shown. */
async function stepRefused(page, consoleHandle) {
  await zoomToLayer(page, consoleHandle, "E-REFUSED");
  await useTool(page, "Select");
  const before = (await readTab(page)).selected;
  const rect = await canvasRect(page);
  const c = center(rect);
  let refused = null;
  for (let notch = 0; notch <= REFUSAL_ZOOM_OUT_NOTCHES_MAX && refused === null; notch += 1) {
    if (notch > 0) {
      await doWheel(page, c, -ZOOM_NOTCH_DELTA_Y); // one zoom-out notch
      await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });
    }
    const frame = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels([]));
    if (frame.samplePoint === null) continue;
    for (const flipY of [true, false]) {
      const css = bufferPointToCss(frame.samplePoint, rect, frame.width, frame.height, flipY);
      await page.mouse.move(css.x, css.y);
      const shown = await pollUntil(() => page.evaluate(() => document.querySelector(".hover-readout-below-resolution") !== null), (v) => v === true, 3000);
      if (shown.ok) {
        refused = css;
        break;
      }
    }
  }
  expect(refused !== null, "E-REFUSED: no pointer within the zoom-out notches showed the below-resolution hover readout, so no refused click could be made");
  await clickAt(page, refused);
  const tab = await readTab(page);
  expect(tab.lastClickClass?.includes("feature-last-click-below-resolution") === true, `E-REFUSED: the last-click line is "${tab.lastClick}" (${tab.lastClickClass}), not the named below-resolution state`);
  expect(tab.selected === before, `E-REFUSED: a click below the pick resolution changed Selected from ${before} to ${tab.selected}`);
  return `refused click: the named state shown, Selected ${before} -> ${tab.selected}`;
}

/** E-GEN: a reopen, then a source change through the real dataset_session_ended route: each ends the selection with a notice naming the count. */
async function stepGen(page, consoleHandle) {
  const standing = await readTab(page);
  expect(standing.selected >= 1, `E-GEN: no selection stands to be ended (Selected ${standing.selected})`);
  await openFixture(page, consoleHandle, FIXTURE_100K, "E-GEN (reopen)");
  const reopened = (await pollUntil(() => readTab(page), (t) => t.notice !== null, 15_000)).last;
  expect(reopened.selected === 0, `E-GEN: after the reopen Selected ${reopened.selected}, expected 0`);
  expect(reopened.notice?.includes("a dataset was opened") === true && reopened.notice.includes(`${standing.selected} selected`), `E-GEN: the reopen's notice is "${reopened.notice}"; it should name ${standing.selected} dropped and that a dataset was opened`);
  expect(reopened.statusItem === reopened.notice, `E-GEN: the status bar item is "${reopened.statusItem}", not the notice`);

  // The source changes under the open dataset: a scratch copy of the filter fixture, its mtime touched while the app is idle (bytes untouched).
  mkdirSync(join(HERE, "out"), { recursive: true });
  copyFileSync(FIXTURE_FILTER, SCRATCH_COPY);
  await openFixture(page, consoleHandle, SCRATCH_COPY, "E-GEN (scratch)");
  const scene = await buildScene(page, consoleHandle, "E-GEN", { want: 1, min: 1 });
  await useTool(page, "Select");
  await clickAt(page, scene.hits[0].css);
  const one = (await pollUntil(() => readTab(page), (t) => t.selected === 1, 5000)).last;
  expect(one.selected === 1, `E-GEN: a Select click on the scratch copy gave Selected ${one.selected}`);
  const later = new Date(Date.now() + SCRATCH_TOUCH_OFFSET_MS);
  utimesSync(SCRATCH_COPY, later, later);
  const ended = (await pollUntil(() => readTab(page), (t) => t.sessionEnded && t.notice !== null, 60_000)).last;
  expect(ended.sessionEnded, "E-GEN: the session-ended block never appeared after the mtime touch");
  expect(ended.selected === 0, `E-GEN: after the source change Selected ${ended.selected}, expected 0`);
  expect(ended.notice?.includes("the source file changed") === true && ended.notice.includes("1 selected feature"), `E-GEN: the source change's notice is "${ended.notice}"`);
  return `reopen: ${standing.selected} dropped, a dataset was opened; source change: 1 dropped, the source file changed`;
}

/** The hits E-KINDS clicks: the first non-background pixel of each cell of an 8 x 6 grid over the frame, hovered for a confirmed id. */
async function sampleHits(page, label, max) {
  const rect = await canvasRect(page);
  const frame = await page.evaluate((r) => window.__SPATIAL_E2E__.capturePixels(r), subdivideRegion({ x: 0, y: 0, w: 1, h: 1 }, 8, 6));
  const hits = [];
  let flipY = null;
  let tried = 0;
  for (const region of frame.regions) {
    if (region.samplePoint === null || hits.length >= max) continue;
    if (flipY === null && tried >= 5) break;
    tried += 1;
    for (const fy of flipY === null ? [true, false] : [flipY]) {
      const css = bufferPointToCss(region.samplePoint, rect, frame.width, frame.height, fy);
      const result = await hoverIdAfterBarrier(page, css, label);
      if (!result.ok) continue;
      flipY = fy;
      hits.push({ css, id: result.last.id });
      break;
    }
  }
  return hits;
}

/** E-KINDS: point, line and multipolygon: one id per click, and a second part of the same feature gives the same id. */
async function stepKinds(page, consoleHandle) {
  const notes = [];
  for (const [kind, path] of [["multipolygon", FIXTURE_MULTIPOLYGON], ["point", FIXTURE_POINT], ["line", FIXTURE_LINE]]) {
    const label = `E-KINDS (${kind})`;
    await openFixture(page, consoleHandle, path, label);
    const hits = await sampleHits(page, label, 16);
    const ids = [...new Set(hits.map((h) => h.id))];
    expect(hits.length >= 2, `${label}: only ${hits.length} hovered feature pixel(s) found`);
    // Navigate: the click's id is the hover's.
    await useTool(page, "Navigate");
    await showFeatureTab(page);
    await clickAt(page, hits[0].css);
    const inspected = (await pollUntil(() => readTab(page), (t) => t.id !== null, 5000)).last;
    expect(inspected.id === hits[0].id, `${label}: a Navigate click inspected id ${inspected.id}; the oracle id there is ${hits[0].id}`);
    // Select, Add only: one id per click, and a repeated click on the same feature adds nothing.
    await useTool(page, "Select");
    await useMode(page, "Add only");
    await featureAction(page, "Clear selection");
    if (kind === "multipolygon") {
      expect(ids.length <= KINDS_ROWS_IN_F1, `${label}: ${ids.length} distinct ids over the features hovered (${ids.join(", ")}); the file holds ${KINDS_ROWS_IN_F1} rows, so a part was resolved as a row`);
      let pair = null; // two hits of one id, as far apart as the sample allows: the likeliest second part
      for (const a of hits) for (const b of hits) if (a.id === b.id && (pair === null || Math.hypot(a.css.x - b.css.x, a.css.y - b.css.y) > Math.hypot(pair[0].css.x - pair[1].css.x, pair[0].css.y - pair[1].css.y))) pair = [a, b];
      expect(pair !== null && pair[0] !== pair[1], `${label}: no two hovered pixels share an id`);
      await clickAt(page, pair[0].css);
      await clickAt(page, pair[1].css);
      const same = (await readTab(page)).selected;
      expect(same === 1, `${label}: two pixels of id ${pair[0].id} gave Selected ${same}, expected 1`);
      notes.push(`${kind}: ${ids.length} id(s) over ${hits.length} pixels; two pixels of id ${pair[0].id} gave Selected 1`);
    } else {
      expect(ids.length >= 2, `${label}: ${ids.length} distinct id(s) over ${hits.length} hovered pixels; two needed`);
      let k = 0;
      for (const id of ids.slice(0, 3)) {
        await clickAt(page, hits.find((h) => h.id === id).css);
        k += 1;
        const tab = (await pollUntil(() => readTab(page), (t) => t.selected === k, 5000)).last;
        expect(tab.selected === k, `${label}: ${k} clicks on distinct features gave Selected ${tab.selected}`);
      }
      await clickAt(page, hits.find((h) => h.id === ids[0]).css);
      expect((await readTab(page)).selected === k, `${label}: a repeated Add only click changed the count`);
      notes.push(`${kind}: ${k} clicks, ${k} ids`);
    }
    await featureAction(page, "Clear selection");
  }
  return notes.join("; ");
}

/** A fresh bundle destination under target/ (ignored by git), as publish.mjs makes one; its parent holds nothing else. */
function freshDestination(tag) {
  const parent = join(REPO_ROOT, "target", "e2e-selection-out", `${tag}-${Date.now()}`);
  mkdirSync(parent, { recursive: true });
  return join(parent, "bundle");
}

/** Opens the Export section, and prepares a whole-file export through the dev destination seam; the host's outcome. */
async function prepareExport(page, destination) {
  const hook = await pollUntil(() => page.evaluate(() => typeof window.__SPATIAL_E2E__?.publishPrepareWithDestination === "function"), (ok) => ok === true, 20_000);
  expect(hook.ok, "the publishPrepareWithDestination hook never appeared");
  await page.evaluate(() => { const b = document.querySelector(".publish-disclosure"); if (b?.getAttribute("aria-expanded") !== "true") b.click(); });
  return page.evaluate((d) => window.__SPATIAL_E2E__.publishPrepareWithDestination(d, "whole"), destination);
}

/** Executes the prepared attempt with the phrase an operator types (the destination's final path component), through the dev hook that shares the dialog's path. */
const executeExport = (page, prompt) => page.evaluate((p) => window.__SPATIAL_E2E__.publishExecute(p), basename(prompt.destination_display));

/** E-EXPORT: with a selection standing and without one, the prompt's row scope and the bundle's row count are equal, and the section says the selection is not used. */
async function stepExport(page, consoleHandle) {
  await openFixture(page, consoleHandle, FIXTURE_FILTER, "E-EXPORT");
  const scene = await buildScene(page, consoleHandle, "E-EXPORT", { want: 1, min: 1 });
  await useTool(page, "Select");
  await useMode(page, "Add only");
  await clickAt(page, scene.hits[0].css);
  expect((await pollUntil(() => readTab(page), (t) => t.selected === 1, 5000)).last.selected === 1, "E-EXPORT: a Select click did not give Selected 1");
  const runs = [];
  for (const selected of [1, 0]) {
    if (selected === 0) {
      await featureAction(page, "Clear selection");
      expect((await pollUntil(() => readTab(page), (t) => t.selected === 0, 5000)).last.selected === 0, "E-EXPORT: Clear selection did not give Selected 0");
    }
    const prepared = await prepareExport(page, freshDestination(`export-selected-${selected}`));
    expect(prepared.status === "prompt", `E-EXPORT: prepare (Selected ${selected}) returned ${JSON.stringify(prepared)}`);
    const executed = await executeExport(page, prepared.prompt);
    expect(executed.status === "success", `E-EXPORT: execute (Selected ${selected}) returned ${JSON.stringify(executed)}`);
    const sentence = await page.evaluate(() => document.querySelector(".publish-selection-sentence")?.textContent ?? null);
    expect(/selection is not used/.test(sentence ?? ""), `E-EXPORT: the Export section's sentence is ${JSON.stringify(sentence)} (Selected ${selected})`);
    expect(prepared.prompt.filter_scope === null, `E-EXPORT: with Selected ${selected} and no filter, the prompt carries the filter scope ${JSON.stringify(prepared.prompt.filter_scope)}`);
    runs.push({ rowScope: prepared.prompt.row_scope, rows: executed.rows });
  }
  expect(runs[0].rowScope === runs[1].rowScope && runs[0].rows === runs[1].rows, `E-EXPORT: with a selection ${JSON.stringify(runs[0])}, without ${JSON.stringify(runs[1])}`);
  return `row scope "${runs[0].rowScope}" and ${runs[0].rows} rows with a selection and without`;
}

/** E-SCOPE: prepare, change the filter, execute: refused in the shell's words, and no bundle written. */
async function stepScope(page, consoleHandle) {
  await openFixture(page, consoleHandle, FIXTURE_FILTER, "E-SCOPE");
  const destination = freshDestination("scope");
  const prepared = await prepareExport(page, destination);
  expect(prepared.status === "prompt", `E-SCOPE: prepare returned ${JSON.stringify(prepared)}`);
  await page.fill(".filter-predicate", "zone = 'residential'");
  await page.click(".filter-apply");
  expect((await pollUntil(() => page.evaluate(() => document.querySelector(".filter-active") !== null), (v) => v === true, 20_000)).ok, "E-SCOPE: the Applied line never appeared");
  const executed = await executeExport(page, prepared.prompt);
  expect(executed.status === "refused" && /changed after it was prepared/.test(executed.message), `E-SCOPE: execute after the filter changed returned ${JSON.stringify(executed)}`);
  const shown = await page.evaluate(() => document.querySelector(".publish-panel .admission-refusal-message")?.textContent ?? null);
  expect(shown === executed.message, `E-SCOPE: the panel shows ${JSON.stringify(shown)}, not the refusal`);
  const staging = readdirSync(dirname(destination)).filter((n) => n.includes(".staging-"));
  expect(!existsSync(destination) && staging.length === 0, `E-SCOPE: a bundle or staging debris exists under ${dirname(destination)} (${staging.join(", ")})`);
  await page.click(".filter-clear");
  return "execute refused after the filter changed; no bundle directory, no staging debris";
}

async function runSelectionSteps(page, consoleHandle) {
  const results = [];
  async function runStep(id, timeoutMs, fn) {
    const startedAt = Date.now();
    let timer;
    try {
      const note = await Promise.race([fn(), new Promise((_, reject) => (timer = setTimeout(() => reject(new Error(`${id}: timed out after ${timeoutMs}ms`)), timeoutMs)))]);
      results.push({ id, status: "PASS", note });
      console.log(`[${id}] PASS (${Date.now() - startedAt}ms): ${note}`);
    } catch (e) {
      results.push({ id, status: "FAIL", note: e?.message ?? String(e) });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${e?.message ?? e}`);
      process.exitCode = 1;
    } finally {
      clearTimeout(timer);
    }
  }
  for (const [label, path] of [["filter-zoned", FIXTURE_FILTER], ["100k", FIXTURE_100K], ["multipolygon F-1", FIXTURE_MULTIPOLYGON], ["point P-1", FIXTURE_POINT], ["line L-1", FIXTURE_LINE]]) {
    if (!existsSync(path)) throw new Error(`selection: the ${label} fixture is not at ${path}; regenerate the manual-walkthrough fixtures (kernel/tests/manual_walkthrough_fixtures.rs, --ignored)`);
  }
  let scene = null;
  await runStep("E-SCENE", 600_000, async () => {
    await openFixture(page, consoleHandle, FIXTURE_FILTER, "E-SCENE");
    scene = await buildScene(page, consoleHandle, "E-SCENE", { want: 2, min: 2 });
    return `camera at zoom-in notch ${scene.notch}; features ${scene.hits.map((h) => h.id).join(", ")}`;
  });
  if (scene !== null) {
    await runStep("E-CLICK", 60_000, () => stepClick(page, scene));
    await runStep("E-CLICK-FAST", 60_000, () => stepClickFast(page, scene));
    await runStep("E-SELECT", 60_000, () => stepSelect(page, scene));
    await runStep("E-NODRAG", 120_000, () => stepNoDrag(page, scene));
    await runStep("E-ZOOMSEL", 120_000, () => stepZoomSel(page, consoleHandle));
    await runStep("E-SEL-PAN", 60_000, () => stepSelPan(page));
  }
  await runStep("E-SEL-FILTER", 900_000, async () => {
    await zoomToLayer(page, consoleHandle, "E-SEL-FILTER");
    const filterScene = await buildScene(page, consoleHandle, "E-SEL-FILTER", { want: 6, min: 4 });
    return stepSelFilter(page, consoleHandle, filterScene);
  });
  await runStep("E-REFUSED", 300_000, () => stepRefused(page, consoleHandle));
  await runStep("E-GEN", 900_000, () => stepGen(page, consoleHandle));
  await runStep("E-KINDS", 1_200_000, () => stepKinds(page, consoleHandle));
  await runStep("E-EXPORT", 900_000, () => stepExport(page, consoleHandle));
  await runStep("E-SCOPE", 300_000, () => stepScope(page, consoleHandle));
  console.log(`[selection] ${results.filter((r) => r.status === "PASS").length} PASS, ${results.filter((r) => r.status === "FAIL").length} FAIL: ${results.map((r) => `${r.id}=${r.status}`).join(" ")}`);
}

async function main() {
  const { browser, page, launched } = await attachOrLaunch();
  const consoleHandle = attachConsole(page);
  try {
    for (let i = 0; i < 300 && !(await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false)); i += 1) await sleep(300);
    await runSelectionSteps(page, consoleHandle).catch((e) => {
      console.error(`[selection] harness failure: ${e.stack ?? e.message}`);
      process.exitCode = 1;
    });
    const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_100K);
    if (opened.kind !== "admitted") throw new Error(`EXPORT-TODAY: openPath(100k) returned ${JSON.stringify(opened)}`);
    for (let i = 0; i < 100 && !(await page.evaluate(() => typeof window.__SPATIAL_E2E__?.publishPrepareWithDestination === "function")); i += 1) await sleep(200);
    const parent = join(REPO_ROOT, "target", "e2e-selection-out", `export-today-${Date.now()}`);
    mkdirSync(parent, { recursive: true });
    const destination = join(parent, "bundle");
    await page.click(".publish-disclosure");
    const prepared = await page.evaluate((d) => window.__SPATIAL_E2E__.publishPrepareWithDestination(d, "whole"), destination);
    if (prepared.status !== "prompt") throw new Error(`EXPORT-TODAY: prepare returned ${JSON.stringify(prepared)}`);
    await page.fill(".publish-dialog-phrase", basename(destination));
    await page.click(".publish-dialog-submit");
    const duringExport = await readExportUi(page);
    const openCalledAt = new Date().toISOString();
    const reopened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_FILTER);
    const openReturnedAt = new Date().toISOString();
    const afterOpen = await readExportUi(page);
    await sleep(15_000);
    const afterWait = await readExportUi(page);
    const host = { bundleDirExists: existsSync(destination), audit: auditRecords(basename(parent)) };
    const verdict = duringExport.executing === null ? "inconclusive: the export was not executing when the open began" : "the export was executing when the open began; compare openReturnedAt with the outcome time in host.audit (whole seconds), and read afterOpen, afterWait and host";
    console.log(`[EXPORT-TODAY] OBSERVED (recorded, not asserted; fresh launch: ${launched}): ${JSON.stringify({ reopened: reopened.kind, openCalledAt, openReturnedAt, duringExport, afterOpen, afterWait, host, verdict }, null, 2)}`);
  } catch (e) {
    console.error(`[EXPORT-TODAY] harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    consoleHandle.dispose();
    await browser.close().catch(() => {});
    process.exit(process.exitCode ?? 0);
  }
}

await main();
