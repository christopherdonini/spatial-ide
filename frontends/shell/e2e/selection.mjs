#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md section 4).
//
// Phase B stages 5 and 6: the click, the selection, the inspection and the export's scope on real WebView2, asserted: E-CLICK, E-CLICK-FAST, E-SELECT,
// E-NODRAG, E-ZOOMSEL, E-SEL-PAN, E-SEL-FILTER, E-REFUSED, E-GEN, E-KINDS, E-EXPORT, E-SCOPE and, run after E-ASK-TWO and before E-DBLCLICK, E-STATUS-HEIGHT. Fixtures: `filter-zoned.parquet` (and a scratch copy of it, touched by
// mtime only for E-GEN's source change, as source-watch-idle.mjs does), `100k-happy-path.parquet` for the reopen, and `multipolygon-f1.parquet`,
// `point-p1.parquet` and `line-l1.parquet` for E-KINDS. Every oracle id is taken through `hoverIdAfterBarrier` from lib.mjs (Amendment 1 A2): this file
// has no barrier of its own and never takes a first poll (section 8 item 32). The Feature tab, the tool switch and the status bar item are read from the
// real DOM; the highlight is read from the drawing buffer (`capturePixels`: the highlight outlines are alpha 255, the data fill is not).
//
// EXPORT-TODAY (phase A) is SKIPPED since B3 (the body below is unused; see the SKIP line in main): it RECORDS what happens when a dataset is replaced while an export runs, and asserts nothing
// (Amendment 1, A7). It starts a whole-file export of the 100k fixture through the real dialog (the prepare through the dev destination seam, as
// publish.mjs does; the phrase typed and Submit clicked as an operator would), reopens another fixture at once, and prints the panel, the host outcome
// and any export text before, after the open and after the export settles. If the export had already settled when the open returned, the record says so
// and the observation is inconclusive. E-ASK and E-ASK-STATEMENT (stage 7) run before it, in their own functions.
//
// What none of this proves: a timing, a rate or a performance figure (there are none here; the millisecond numbers are bounds on waiting). A tap from a
// real WebView2 pointer is first exercised here: no earlier suite presses and releases without moving.
//
// RECORDED MUTATIONS. Each is named for the custodian to observe in a run at the stage's head; this stage applied none (port 5180 is reserved on the
// machine that wrote them). Apply one alone, run `npm run e2e:selection`, record the failing step by name with the commit, and revert it.
//   E-CLICK        src/canvas/WorkingCanvas.tsx, the tap's `resolveCandidate` dep: `resolvePick(candidate.batch, candidate.gpuOrdinal + 1)`.
//                  Expected: E-CLICK fails on the id (or a TypeError from the resolver).
//   E-CLICK-FAST   src/canvas/WorkingCanvas.tsx: the tap emits the hover readout's pick instead of the one `pickCandidateAt` resolves at the tap's pixel (the tap's
//                  `resolveCandidate` returns `lastHoverReadoutRef.current` when it holds an id). The step presses and releases at B over CDP with no pointer move to B
//                  first, so the hover readout still stands on A. Expected: E-CLICK-FAST fails on the id (A's, not B's). If the readout had moved to B by the click, the
//                  PASS note says so and the mutation is not discriminated in that run: that is recorded as class 2, and UB8 is the deterministic proof.
//   E-SELECT       src/canvas/highlightLayers.ts: SELECTED_OUTLINE_RGBA alpha 0. Expected: E-SELECT fails on the pixel assertion.
//   E-NODRAG (1)   src/canvas/WorkingCanvas.tsx: add `onDragEnd: (_info, event) => onTap(event)` to the Deck props (select on the pointer's release).
//                  Expected: E-NODRAG fails on the selection count after the out-and-back drag. The step sets Add / remove for it (a stray tap at the release over the selected
//                  feature then deselects it), makes the pan's first move one jump onto the feature's pixel so the pan is anchored there, and restores the mode after.
//   E-NODRAG (2)   src/canvas/WorkingCanvas.tsx: in the Deck props, controller: toolRef.current === "select" ? { dragPan: false } : true; and, because the Deck is built once, after
//                  toolRef.current = tool, useEffect(() => { deckRef.current?.setProps({ controller: tool === "select" ? { dragPan: false } : true }); }, [tool]). Expected: E-NODRAG
//                  fails on the view box (the selected feature never leaves the view).
//   E-ZOOMSEL      src/App.tsx, `handleZoomToSelection`: fit a point box at the union's corner (`{xmin: u.xmin, ymin: u.ymin, xmax: u.xmin, ymax: u.ymin}`).
//                  Expected: E-ZOOMSEL fails on the highlight pixels: a zero-span box falls back to zoom 0 (`fitViewStateForBbox`), so the outline is smaller than the floor,
//                  FIT_OUTLINE_MIN_PER_SIDE times the drawing buffer's shorter side (the outside-the-view count alone is not enough: a point box still touches the view).
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
//   E-ASK (1)      src/App.tsx, `confirmOpen`: `return Promise.resolve(true);` as its first statement. Expected: E-ASK fails on the absent ask (no run is then asked about).
//   E-ASK (2)      is proven by RB12b at unit level (App.selection.test.tsx) and is not observable in e2e: Cancel and go on stops the export almost at once.
//   E-ASK-STATEMENT src/App.tsx, `answerOpenAsk`: show the statement only when `cancel()` answers true (the loop body becomes `run.cancelChosen = false;
//                  void run.cancel().then((answer) => { run.cancelChosen = answer; });`). The run has ended, so the host answers false. Expected: E-ASK-STATEMENT fails on the absent statement.
//   Both steps are INCONCLUSIVE (class 2, never a pass) when the export had ended before the ask was read: the step then fails with that word in its message.
//   E-DBLCLICK     src/canvas/WorkingCanvas.tsx, the Deck props' `onClick`: remove the `if (event.type === "dblclick") return;` line. Expected: E-DBLCLICK fails on its first assertion (the Navigate double-click inspected an id); the Select count would fail next.
//   E-ASK-TWO      src/App.tsx, `answerOpenAsk`: `setLateCancel([finished])` in place of the append. Expected: E-ASK-TWO fails on the statements' paths (only the second bundle_path is shown). INCONCLUSIVE, as above, when the ask or the open is not standing before the choice.
//   E-KINDS (point) src/canvas/clickPick.ts, `tapPixel`'s return line: `Math.round` in place of both `Math.trunc` calls. Expected: E-KINDS fails on the point's Navigate click (the inspected id is not the hover's), as the rounded tap did before OPEN-15; a pass means the position was not at the dot's edge in that run, and shows nothing about rounding.
//   E-STATUS-HEIGHT styles.css, the status row back to `auto` and `.status-bar` back to `min-height: 1.5rem; max-height: 48px` in place of `height: var(--status-h)`. Expected: E-STATUS-HEIGHT fails
//                  at S3 on the canvas height while the notice stands (B shorter than A). Observed at d9e9b817 by the custodian's e2e: it failed at S3 with the message beginning E-STATUS-HEIGHT: the canvas is 388 x 736 before the notice, 388 x 718.640625 while it stands and 388 x 736 after it clears
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
// Zoom to selection leaves a 10% margin on each side (`fitViewStateForBbox`), so the outline spans 80% of the limiting side of the drawing buffer and crosses every pixel
// column (or row) of that span twice, with at least one alpha-255 pixel per crossing: at least 1.6 times the shorter side. 1.5 is below that bound, whatever the margin
// up to 10%; a zero-span box falls back to zoom 0 and its outline is a small fraction of a side.
const FIT_OUTLINE_MIN_PER_SIDE = 1.5;
const PAN_JUMP_PX = 12; // a drag pan's first move: past the recogniser's threshold in one jump, so the pan is anchored at that move's end
const SCRATCH_TOUCH_OFFSET_MS = 120_000; // the same offset source-changed.mjs uses for its touch
const KINDS_ROWS_IN_F1 = 3; // multipolygon-f1.parquet holds three MultiPolygon rows (regression.mjs, MP')
const REFUSAL_ZOOM_OUT_NOTCHES_MAX = 8; // K6's re-aim zooms out at least this far to cross the pick threshold
const HOVER_ATTEMPTS_MAX = 40; // hovers one search makes, whatever they give
const HOVER_MISSES_MAX = 4; // candidates in a row that answer nothing before a search gives up at its camera

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
const showLayerTab = (page) => page.evaluate(() => document.getElementById("inspector-tab-layer")?.click());
/** Frame-wide count of alpha-255 pixels: the highlight outlines, never the data fill (alpha 180). */
const opaquePixels = async (page) => (await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels([]))).opaqueCount;
/** The same count with the shorter side of the drawing buffer it was taken from. */
const framePixels = async (page) => {
  const frame = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels([]));
  return { opaque: frame.opaqueCount, minSide: Math.min(frame.width, frame.height) };
};
/** The label of the selection mode in force (Select only), or null. */
const pressedMode = (page) => page.evaluate(() => [...document.querySelectorAll(".tool-switch-mode")].find((b) => b.getAttribute("aria-pressed") === "true")?.textContent ?? null);
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

/**
 * Candidate drawing-buffer points of the current frame, each verified only when the caller asks for the next: the densest-patch candidate, a coarse lattice and a finer one, each
 * yielded only when its 5 x 5 neighbourhood is non-background (`verifyInteriorCandidate`); then, for features too thin to have an interior (a line), the first
 * non-background pixel of each cell of an 8 x 6 grid (an edge pixel: the last resort). Yields `{ point, bw, bh }`.
 */
async function* candidatePoints(page) {
  const { candidate, bufferWidth: bw, bufferHeight: bh } = await findInteriorCandidate(page);
  const lattice = [candidate];
  for (const fy of [0.25, 0.5, 0.75]) for (const fx of [0.2, 0.35, 0.5, 0.65, 0.8]) lattice.push({ x: Math.round(fx * bw), y: Math.round(fy * bh) });
  for (let gy = 0; gy < 7; gy += 1) for (let gx = 0; gx < 7; gx += 1) lattice.push({ x: Math.round(((gx + 0.5) / 7) * bw), y: Math.round(((gy + 0.5) / 7) * bh) });
  for (const point of lattice) if ((await verifyInteriorCandidate(page, point, bw, bh)).ok) yield { point, bw, bh };
  const frame = await page.evaluate((r) => window.__SPATIAL_E2E__.capturePixels(r), subdivideRegion({ x: 0, y: 0, w: 1, h: 1 }, 8, 6));
  for (const region of frame.regions) if (region.samplePoint !== null) yield { point: region.samplePoint, bw, bh };
}

/**
 * Hovers `candidatePoints` for confirmed ids, through `hoverIdAfterBarrier` only: until `want` hits (with distinct ids when `distinct`), HOVER_ATTEMPTS_MAX hovers, or
 * HOVER_MISSES_MAX candidates in a row that answered nothing. The buffer's row order is learned from the first answer (both are tried until then). A hover that ends in the
 * below-resolution refusal ends the search at once: the camera refuses, and that point (a candidate the hover found) is `refusedAt`.
 * Returns `{ hits: [{ css, id }], rect, tried, refusedAt }`; the pointer is left where the last hover put it.
 */
async function hoverHits(page, label, want, distinct, unrounded = false) {
  const rect = await canvasRect(page);
  const hits = [];
  let flipY = null;
  let tried = 0;
  let misses = 0;
  search: for await (const { point, bw, bh } of candidatePoints(page)) {
    if (misses >= HOVER_MISSES_MAX) break;
    let answered = false;
    for (const fy of flipY === null ? [true, false] : [flipY]) {
      if (tried >= HOVER_ATTEMPTS_MAX) break search;
      tried += 1;
      // Whole CSS pixels, as a real mouse at 100% scaling gives; `unrounded` (E-KINDS' point step only) keeps the fractional position, where the tap must read the hover's pixel (OPEN-15).
      const exact = bufferPointToCss(point, rect, bw, bh, fy);
      const css = unrounded ? exact : { x: Math.round(exact.x), y: Math.round(exact.y) };
      const result = await hoverIdAfterBarrier(page, css, label);
      if (result.last.state === "refusal") return { hits, rect, tried, refusedAt: css };
      if (!result.ok) continue;
      flipY = fy;
      answered = true;
      if (!distinct || !hits.some((h) => h.id === result.last.id)) hits.push({ css, id: result.last.id });
      break;
    }
    misses = answered ? 0 : misses + 1;
    if (hits.length >= want) break;
  }
  return { hits, rect, tried, refusedAt: null };
}

/**
 * The scene the click steps run in: the least-zoomed camera (zoom-in notches from the current one, as A9' does) at which hovers answer with confirmed ids for at least `min`
 * features with distinct ids, and up to `want` of them as `{css, id}` (a CSS page point and the oracle id `hoverIdAfterBarrier` took there). A camera that gives fewer is
 * zoomed in from, not accepted: features small at one notch are large at the next. The pointer is never moved by this function afterwards. Throws, naming what each notch gave.
 */
async function buildScene(page, consoleHandle, label, { want, min }) {
  const c = center(await canvasRect(page));
  const gave = [];
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES; notch += 1) {
    if (notch > 0) await zoomInOneNotch(page, consoleHandle, c);
    const { hits, rect, tried, refusedAt } = await hoverHits(page, `${label} (notch ${notch})`, want, true);
    if (hits.length >= min) return { hits, rect, notch };
    gave.push(`notch ${notch}: ${hits.length} distinct id(s) in ${tried} hover(s)${refusedAt === null ? "" : ", refused as below the pick resolution"}`);
  }
  throw new Error(`${label}: no camera within ${MAX_ZOOM_NOTCHES} zoom-in notches gave ${min} features with distinct confirmed ids (${gave.join("; ")})`);
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

/** E-CLICK-FAST: stand on feature A (the hover readout reads A), then press and release at B over CDP with no pointer move to B first: the inspected id is B's, which a tap that read the hover readout would not give. */
async function stepClickFast(page, scene) {
  const [a, b] = scene.hits;
  expect(b !== undefined, "E-CLICK-FAST: the scene has one feature only");
  await useTool(page, "Navigate");
  await page.mouse.move(a.css.x, a.css.y);
  await sleep(CLICK_SETTLE_MS); // the hover readout now stands on A
  const readoutId = () => page.evaluate(() => /^id (\d+)/.exec(document.querySelector(".hover-readout")?.textContent ?? "")?.[1] ?? null);
  const standing = await readoutId();
  let cdp = null;
  let how = "pressed at B with no move to B first";
  try {
    cdp = await page.context().newCDPSession(page);
    const at = { x: b.css.x, y: b.css.y, button: "left", clickCount: 1 };
    await cdp.send("Input.dispatchMouseEvent", { ...at, type: "mousePressed", buttons: 1 }); // a move would be a hover and update the readout
    await cdp.send("Input.dispatchMouseEvent", { ...at, type: "mouseReleased", buttons: 0 });
  } catch (e) {
    how = `CDP press unavailable (${e?.message}); moved to B first, so race-dependent`;
    await page.mouse.move(b.css.x, b.css.y);
    await page.mouse.down();
    await page.mouse.up();
  } finally {
    await cdp?.detach().catch(() => {});
  }
  await sleep(CLICK_SETTLE_MS);
  const tab = (await pollUntil(() => readTab(page), (t) => t.id === b.id, 5000)).last;
  expect(tab.id === b.id, `E-CLICK-FAST: the click at B inspected id ${tab.id}; B's oracle id is ${b.id} (A's is ${a.id}; the readout stood on ${standing}); ${how}`);
  const stale = standing === a.id && (await readoutId()) === a.id;
  return `a click at ${b.id} (${how}) inspected ${tab.id}; ${stale ? "the hover readout stood on " + a.id + " through the click" : "the hover readout had moved off " + a.id + ", so the stale read was not reproduced"}`;
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

/** E-NODRAG (H1): a drag pan in Select changes no selection, and the view box does change. Run in Add / remove, where a tap at a drag's release over the selected feature deselects it. */
async function stepNoDrag(page, scene) {
  const p = scene.hits[0].css;
  const c = center(scene.rect);
  const sign = p.x < c.x ? 1 : -1;
  await useTool(page, "Select");
  const priorMode = await pressedMode(page);
  await useMode(page, "Add / remove");
  try {
    return await noDragIn(page, scene, p, c, sign);
  } finally {
    if (priorMode !== null && priorMode !== "Add / remove") await useMode(page, priorMode);
  }
}

async function noDragIn(page, scene, p, c, sign) {
  // The pan is anchored where its first move ends, so the first move is one jump onto p: out and back, the content under p at the release is the selected feature.
  await page.mouse.move(p.x + sign * PAN_JUMP_PX, p.y);
  await page.mouse.down();
  await page.mouse.move(p.x, p.y);
  await page.mouse.move(p.x + sign * 60, p.y, { steps: 8 });
  await page.mouse.move(p.x, p.y, { steps: 8 });
  await page.mouse.up();
  await sleep(CLICK_SETTLE_MS);
  const held = await readTab(page);
  expect(held.selected === 1, `E-NODRAG: a drag pan released over the selected feature left Selected ${held.selected}, expected 1`);
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
  const floorOf = (f) => Math.max(HIGHLIGHT_MIN_OPAQUE_PX, Math.ceil(FIT_OUTLINE_MIN_PER_SIDE * f.minSide));
  const framed = (await pollUntil(() => framePixels(page), (f) => f.opaque - before >= floorOf(f), 10_000)).last;
  expect(framed.opaque - before >= floorOf(framed), `E-ZOOMSEL: alpha-255 pixels ${before} -> ${framed.opaque}; a fit that frames the selected feature draws at least ${floorOf(framed)} (${FIT_OUTLINE_MIN_PER_SIDE} times the buffer's shorter side, ${framed.minSide})`);
  return `outside ${away.outside} -> 0; alpha-255 pixels ${before} -> ${framed.opaque} (floor ${floorOf(framed)})`;
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

/** E-REFUSED: below the pick resolution, a Select click changes nothing and the named state is shown. The pixel is one at which the hover barrier confirmed the refusal. */
async function stepRefused(page, consoleHandle) {
  await zoomToLayer(page, consoleHandle, "E-REFUSED");
  await useTool(page, "Select");
  const before = (await readTab(page)).selected;
  const c = center(await canvasRect(page));
  let refused = null;
  for (let notch = 0; notch <= REFUSAL_ZOOM_OUT_NOTCHES_MAX && refused === null; notch += 1) {
    if (notch > 0) {
      await doWheel(page, c, -ZOOM_NOTCH_DELTA_Y); // one zoom-out notch
      await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 });
    }
    refused = (await hoverHits(page, `E-REFUSED (notch ${notch})`, 1, true)).refusedAt;
  }
  expect(refused !== null, "E-REFUSED: no hover within the zoom-out notches ended in the below-resolution refusal after the hover barrier, so no refused click could be made");
  await clickAt(page, refused);
  const tab = await readTab(page);
  const where = `at CSS (${refused.x}, ${refused.y}), where the hover barrier had confirmed the below-resolution readout (so the hover found a candidate)`;
  expect(tab.lastClickClass?.includes("feature-last-click-below-resolution") === true, `E-REFUSED: the last-click line is "${tab.lastClick}" (${tab.lastClickClass}), not the named below-resolution state, ${where}`);
  expect(tab.selected === before, `E-REFUSED: a click below the pick resolution changed Selected from ${before} to ${tab.selected}, ${where}`);
  return `refused click at CSS (${refused.x}, ${refused.y}): the named state shown, Selected ${before} -> ${tab.selected}`;
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

/** E-KINDS: point, line and multipolygon: one id per click, and a second part of the same feature gives the same id. */
async function stepKinds(page, consoleHandle) {
  const notes = [];
  for (const [kind, path] of [["multipolygon", FIXTURE_MULTIPOLYGON], ["point", FIXTURE_POINT], ["line", FIXTURE_LINE]]) {
    const label = `E-KINDS (${kind})`;
    await openFixture(page, consoleHandle, path, label);
    const found = await hoverHits(page, label, 16, false, kind === "point");
    const hits = found.hits;
    const ids = [...new Set(hits.map((h) => h.id))];
    expect(hits.length >= 2, `${label}: only ${hits.length} hovered feature pixel(s) found in ${found.tried} hover(s)${found.refusedAt === null ? "" : "; the hover was refused as below the pick resolution"}`);
    if (kind === "point") { // OPEN-15: the click is at the hover's unrounded position, which must be fractional on both axes, or a pass would show nothing
      const at = hits[0].css;
      console.log(`[E-KINDS] point step: hover and click at (${at.x}, ${at.y}) CSS px`);
      expect(!Number.isInteger(at.x) && !Number.isInteger(at.y), `${label}: the position (${at.x}, ${at.y}) is not fractional on both axes`);
    }
    // Navigate: the click's id is the hover's.
    await useTool(page, "Navigate");
    await showFeatureTab(page);
    await clickAt(page, hits[0].css);
    const inspected = (await pollUntil(() => readTab(page), (t) => t.id !== null, 5000)).last;
    if (inspected.id !== hits[0].id) { // log-only: the facts that decide a missed point click, and two retries; the step still fails
      const p = hits[0].css;
      const facts = { oracle: hits[0].id, point: p, tab: inspected, ...(await page.evaluate(() => ({ pressed: [...document.querySelectorAll(".tool-switch-button")].filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => b.textContent), hover: document.querySelector(".hover-readout")?.textContent ?? null, dpr: window.devicePixelRatio, rect: document.querySelector(".working-canvas")?.getBoundingClientRect().toJSON() }))), retries: {} };
      for (const [name, q] of [["rounded", { x: Math.round(p.x), y: Math.round(p.y) }], ["bufferCentre", { x: (Math.floor(p.x * facts.dpr) + 0.5) / facts.dpr, y: (Math.floor(p.y * facts.dpr) + 0.5) / facts.dpr }]]) { await clickAt(page, q); facts.retries[name] = { at: q, id: (await readTab(page)).id }; }
      expect(false, `${label}: a Navigate click inspected id ${inspected.id}; the oracle id there is ${hits[0].id}; ${JSON.stringify(facts)}`);
    }
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

/**
 * E-ASK's driver: opens the 100k fixture, starts a whole-file execute of it through the dev hook and, with it running, an open of filter-zoned; neither is awaited (the open waits on
 * the ask). `window.__askRun` and `window.__askOpen` hold the two promises. Throws INCONCLUSIVE (class 2, never a pass) when the export has ended by the time the ask is read.
 */
async function startExportThenOpen(page, consoleHandle, label) {
  await openFixture(page, consoleHandle, FIXTURE_100K, label);
  const prepared = await prepareExport(page, freshDestination("ask"));
  expect(prepared.status === "prompt", `${label}: prepare returned ${JSON.stringify(prepared)}`);
  await page.evaluate(([phrase, path]) => {
    const run = (window.__askRun = { done: false });
    run.promise = window.__SPATIAL_E2E__.publishExecute(phrase).then((o) => ((run.done = true), o));
    const opened = (window.__askOpen = {});
    opened.promise = window.__SPATIAL_E2E__.openPath(path);
  }, [basename(prepared.prompt.destination_display), FIXTURE_FILTER]);
  const shown = await pollUntil(() => page.evaluate(() => document.querySelector(".open-during-export-ask") !== null), (v) => v === true, 10_000, 100);
  if (await page.evaluate(() => window.__askRun.done)) throw new Error(`${label}: INCONCLUSIVE (class 2, never a pass): the export had ended when the ask was read (ask shown: ${shown.ok})`);
  expect(shown.ok, `${label}: no ask was shown while the export ran`);
}

const askLayer = (page) => page.evaluate(() => document.querySelector(".layers-row-label")?.textContent ?? "");
/** The newest of the console's open_dataset and close_dataset rows (the console is expanded here, with its groups): the old handle's close follows the new open's row. */
async function lastLifecycleRow(page) {
  await page.evaluate(() => {
    const b = document.querySelector(".console-disclosure");
    if (b?.getAttribute("aria-expanded") !== "true") b.click();
    document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click());
  });
  await sleep(300);
  return page.evaluate(() => [...document.querySelectorAll(".console-entry-class-a .console-entry-header")].map((h) => h.textContent).filter((t) => t === "open_dataset" || t === "close_dataset").at(-1) ?? null);
}

/** E-ASK: with a whole-file export of the 100k fixture running, opening filter-zoned shows the ask. Keep exporting leaves the handle and the export reaches its outcome; Cancel the export and go on admits the new dataset, and the old close_dataset row follows the run's outcome. */
async function stepAsk(page, consoleHandle) {
  await startExportThenOpen(page, consoleHandle, "E-ASK (keep)");
  await page.click(".open-during-export-keep");
  const dropped = await page.evaluate(() => window.__askOpen.promise);
  expect(dropped.kind === "refused" && dropped.code === "open.dropped", `E-ASK: Keep exporting gave the open ${JSON.stringify(dropped)}`);
  expect((await askLayer(page)).includes("100k-happy-path"), `E-ASK: after Keep exporting the layer is ${JSON.stringify(await askLayer(page))}, not the 100k fixture`);
  const kept = await page.evaluate(() => window.__askRun.promise);
  expect(kept.status === "success", `E-ASK: after Keep exporting the export's outcome is ${JSON.stringify(kept)}`);
  expect(await page.evaluate(() => document.querySelector(".late-cancel-statement") === null), "E-ASK: a late-cancel statement after Keep exporting");

  await startExportThenOpen(page, consoleHandle, "E-ASK (cancel)");
  await page.click(".open-during-export-cancel");
  const admitted = await page.evaluate(() => window.__askOpen.promise);
  expect(admitted.kind === "admitted", `E-ASK: Cancel the export and go on gave the open ${JSON.stringify(admitted)}`);
  expect((await askLayer(page)).includes("filter-zoned"), `E-ASK: after Cancel and go on the layer is ${JSON.stringify(await askLayer(page))}`);
  const newest = await lastLifecycleRow(page); // read first, then whether the run had ended: done never goes back, so a close seen with done false preceded the outcome
  expect(!(newest === "close_dataset" && !(await page.evaluate(() => window.__askRun.done))), "E-ASK: the old handle was closed before the export's outcome");
  const outcome = await page.evaluate(() => window.__askRun.promise);
  expect((await pollUntil(() => lastLifecycleRow(page), (row) => row === "close_dataset", 20_000)).ok, "E-ASK: no close_dataset row followed the export's outcome");
  const finished = outcome.status === "success" || outcome.status === "succeeded-unaudited";
  expect((await page.evaluate(() => document.querySelector(".late-cancel-statement") !== null)) === finished, `E-ASK: the export's outcome is ${outcome.status}; the statement must show exactly when a bundle was written`);
  await page.evaluate(() => document.querySelector(".console-disclosure")?.click());
  return `the ask showed; Keep exporting left the 100k layer and the export ended ${kept.status}; Cancel and go on admitted filter-zoned, the old close_dataset row followed the outcome (${outcome.status})`;
}

/** E-ASK, third step (Amendment 7 item 6): the ask stands while the export finishes; after its outcome, Cancel the export and go on shows the statement with the outcome's bundle_path, the manifest is on disk there, and the new dataset is admitted. */
async function stepAskStatement(page, consoleHandle) {
  await startExportThenOpen(page, consoleHandle, "E-ASK-STATEMENT");
  const outcome = await page.evaluate(() => window.__askRun.promise);
  expect(outcome.status === "success", `E-ASK-STATEMENT: the export's outcome is ${JSON.stringify(outcome)}; a finished bundle was needed`);
  await page.click(".open-during-export-cancel");
  const admitted = await page.evaluate(() => window.__askOpen.promise);
  expect(admitted.kind === "admitted", `E-ASK-STATEMENT: Cancel the export and go on gave the open ${JSON.stringify(admitted)}`);
  const statement = (await pollUntil(() => page.evaluate(() => ({ text: document.querySelector(".late-cancel-text")?.textContent ?? null, path: document.querySelector(".late-cancel-path")?.textContent ?? null })), (s) => s.path !== null, 10_000)).last;
  expect(statement.path === outcome.bundle_path, `E-ASK-STATEMENT: the statement names ${JSON.stringify(statement.path)}; the outcome's bundle_path is ${JSON.stringify(outcome.bundle_path)}`);
  expect(/^The export was not cancelled: it finished before the cancel could stop it/.test(statement.text ?? ""), `E-ASK-STATEMENT: the statement reads ${JSON.stringify(statement.text)}`);
  expect(existsSync(join(outcome.bundle_path, "manifest.json")), `E-ASK-STATEMENT: no manifest.json under ${outcome.bundle_path}`);
  expect((await askLayer(page)).includes("filter-zoned"), `E-ASK-STATEMENT: the layer is ${JSON.stringify(await askLayer(page))}, not filter-zoned`);
  return `the statement named ${outcome.bundle_path}, whose manifest.json exists; filter-zoned was admitted`;
}

/** E-DBLCLICK (OPEN-14): on a fresh open (nothing inspected, nothing selected) a real double-click only zooms, in Navigate and in Select; a single click still inspects, after the tap delay. */
async function stepDblClick(page, consoleHandle) {
  await openFixture(page, consoleHandle, FIXTURE_FILTER, "E-DBLCLICK");
  const p = (await buildScene(page, consoleHandle, "E-DBLCLICK", { want: 1, min: 1 })).hits[0];
  const zoomNow = () => consoleHandle.renderTrace().map((e) => Number(/view-state \{[^}]*zoom: ([^,}\s]+)/.exec(e.text)?.[1])).filter(Number.isFinite).at(-1);
  const doubleClick = async () => {
    await page.mouse.dblclick(p.css.x, p.css.y);
    await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 1500, timeoutMs: 15_000 }); // past the tap delay and the zoom's transition
  };
  await useTool(page, "Navigate");
  await showFeatureTab(page);
  const before = await readTab(page);
  expect(before.id === null && before.selected === 0, `E-DBLCLICK: precondition (a fresh open): the Feature tab shows id ${before.id}, Selected ${before.selected}`);
  const zoom0 = zoomNow();
  await doubleClick();
  const nav = await readTab(page);
  expect(nav.id === null, `E-DBLCLICK: a Navigate double-click on id ${p.id} left the Feature tab showing id ${nav.id}; none was expected`);
  expect(nav.selected === before.selected, `E-DBLCLICK: a Navigate double-click changed Selected from ${before.selected} to ${nav.selected}`);
  expect(zoom0 !== undefined && zoomNow() > zoom0, `E-DBLCLICK: the view did not zoom (view-state zoom ${zoom0} -> ${zoomNow()})`);
  await useTool(page, "Select");
  await useMode(page, "Add only");
  await doubleClick();
  const sel = await readTab(page);
  expect(sel.selected === before.selected, `E-DBLCLICK: a Select double-click on id ${p.id} changed Selected from ${before.selected} to ${sel.selected}`);
  await useTool(page, "Navigate");
  const oracle = await hoverIdAfterBarrier(page, p.css, "E-DBLCLICK (after the zooms)");
  expect(oracle.ok, `E-DBLCLICK: no confirmed id at the click point after the zooms (${JSON.stringify(oracle.last)}), so the single click cannot be judged`);
  await clickAt(page, p.css);
  const tab = (await pollUntil(() => readTab(page), (t) => t.id !== null, 5000)).last;
  expect(tab.id === oracle.last.id, `E-DBLCLICK: a single click inspected id ${tab.id}; the oracle id there is ${oracle.last.id}`);
  return `a double-click zoomed (${zoom0} -> ${zoomNow()}), inspected nothing in Navigate and selected nothing in Select; a single click inspected id ${tab.id}`;
}

/** E-ASK-TWO (item (a)): two bundles finish under one ask (the second export is started while it stands); Cancel the export and go on shows a statement for each, in the order the runs ended. */
async function stepAskTwo(page, consoleHandle) {
  await startExportThenOpen(page, consoleHandle, "E-ASK-TWO");
  const first = await page.evaluate(() => window.__askRun.promise);
  expect(first.status === "success", `E-ASK-TWO: the first export's outcome is ${JSON.stringify(first)}; a finished bundle was needed`);
  const prepared = await prepareExport(page, freshDestination("ask-two"));
  expect(prepared.status === "prompt", `E-ASK-TWO: the second prepare returned ${JSON.stringify(prepared)}`);
  const second = await executeExport(page, prepared.prompt);
  expect(second.status === "success", `E-ASK-TWO: the second export's outcome is ${JSON.stringify(second)}; a finished bundle was needed`);
  const standing = await page.evaluate(async () => ({ ask: document.querySelector(".open-during-export-ask") !== null, open: await Promise.race([window.__askOpen.promise.then(() => "settled"), new Promise((r) => setTimeout(() => r("pending"), 100))]) }));
  if (!standing.ask || standing.open !== "pending") throw new Error(`E-ASK-TWO: INCONCLUSIVE (class 2, never a pass): before the choice the ask shown is ${standing.ask} and the open is ${standing.open}`);
  await page.click(".open-during-export-cancel");
  const admitted = await page.evaluate(() => window.__askOpen.promise);
  expect(admitted.kind === "admitted", `E-ASK-TWO: Cancel the export and go on gave the open ${JSON.stringify(admitted)}`);
  const read = () => page.evaluate(() => ({ paths: [...document.querySelectorAll(".late-cancel-path")].map((e) => e.textContent), texts: [...document.querySelectorAll(".late-cancel-text")].map((e) => e.textContent) }));
  const shown = (await pollUntil(read, (s) => s.paths.length >= 2, 10_000)).last;
  const bundles = [first.bundle_path, second.bundle_path];
  expect(JSON.stringify(shown.paths) === JSON.stringify(bundles), `E-ASK-TWO: the statements name ${JSON.stringify(shown.paths)}; the outcomes' bundle_paths, in the order the runs ended, are ${JSON.stringify(bundles)}`);
  expect(shown.texts.length === 2 && shown.texts.every((t) => /^The export was not cancelled: it finished before the cancel could stop it/.test(t ?? "")), `E-ASK-TWO: the statements read ${JSON.stringify(shown.texts)}`);
  for (const b of bundles) expect(existsSync(join(b, "manifest.json")), `E-ASK-TWO: no manifest.json under ${b}`);
  return `two statements, ${bundles.join(" then ")}, both manifests on disk; filter-zoned was admitted`;
}

/** E-STATUS-HEIGHT (SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md Amendment 1; its window, Amendment 3): the status bar keeps one height, so the ended-selection notice coming (a second line) and going never changes the canvas's size. `stepStatusHeight` below runs this body at a window of 880 x 800 set over CDP and restores the window after. */
async function stepStatusHeightAt880(page, consoleHandle) {
  const read = async () => {
    const canvas = await canvasRect(page);
    const boxes = await page.evaluate(() => {
      const box = (selector) => document.querySelector(selector)?.getBoundingClientRect() ?? null;
      const bar = document.querySelector(".status-bar");
      const notice = box(".selection-ended");
      const first = bar?.firstElementChild?.getBoundingClientRect() ?? null;
      return { barHeight: bar?.getBoundingClientRect().height ?? null, stripHeight: box(".attention-strip")?.height ?? 0, scrollHeight: bar?.scrollHeight ?? null, clientHeight: bar?.clientHeight ?? null, residency: document.querySelector(".residency-status") !== null, noticeTop: notice?.top ?? null, firstBottom: first?.bottom ?? null };
    });
    return { width: canvas?.width ?? null, height: canvas?.height ?? null, ...boxes };
  };
  // S0: a selection stands and no notice: read A.
  await openFixture(page, consoleHandle, FIXTURE_FILTER, "E-STATUS-HEIGHT (S0)");
  await buildScene(page, consoleHandle, "E-STATUS-HEIGHT (S0)", { want: 1, min: 1 }).then(async (scene) => {
    await useTool(page, "Select");
    await useMode(page, "Add only");
    await clickAt(page, scene.hits[0].css);
  });
  const standing = (await pollUntil(() => readTab(page), (t) => t.selected >= 1 && t.statusItem === null, 10_000)).last;
  expect(standing.selected >= 1 && standing.statusItem === null, `E-STATUS-HEIGHT: S0 needs a selection and no notice (Selected ${standing.selected}, notice ${JSON.stringify(standing.statusItem)})`);
  const a = await read();
  // S1: a reopen ends the selection with a notice: read B.
  await openFixture(page, consoleHandle, FIXTURE_FILTER, "E-STATUS-HEIGHT (S1)");
  const noticed = (await pollUntil(() => readTab(page), (t) => t.statusItem !== null, 15_000)).last;
  expect(noticed.statusItem !== null, "E-STATUS-HEIGHT: S1 the reopen showed no ended-selection notice");
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
  const b = await read();
  // G1: the notice is on a second line (its top is at or below the bottom of the footer's first element child, less 1 px). G2: the strip's height is the same in A and B.
  if (b.noticeTop === null || b.firstBottom === null || b.noticeTop < b.firstBottom - 1) throw new Error(`E-STATUS-HEIGHT: INCONCLUSIVE (class 2, never a pass): G1, the notice is not on a second line (its top ${b.noticeTop}, the first item's bottom ${b.firstBottom})`);
  if (b.stripHeight !== a.stripHeight) throw new Error(`E-STATUS-HEIGHT: INCONCLUSIVE (class 2, never a pass): G2, the attention strip's height changed (A ${a.stripHeight}, B ${b.stripHeight})`);
  // S2: a Select click ends the notice: read C.
  const scene = await buildScene(page, consoleHandle, "E-STATUS-HEIGHT (S2)", { want: 1, min: 1 });
  await useTool(page, "Select");
  await clickAt(page, scene.hits[0].css);
  const cleared = (await pollUntil(() => readTab(page), (t) => t.statusItem === null && t.selected >= 1, 10_000)).last;
  expect(cleared.statusItem === null && cleared.selected >= 1, `E-STATUS-HEIGHT: S2 the Select click left the notice ${JSON.stringify(cleared.statusItem)} with Selected ${cleared.selected}`);
  const c = await read();
  if (c.stripHeight !== a.stripHeight) throw new Error(`E-STATUS-HEIGHT: INCONCLUSIVE (class 2, never a pass): G2, the attention strip's height changed (A ${a.stripHeight}, C ${c.stripHeight})`);
  // S3: the canvas is the same size in A, B and C, and the bar is 48 px in all three.
  const size = (r) => `${r.width} x ${r.height}`;
  expect(a.width !== null && a.width === b.width && b.width === c.width && a.height === b.height && b.height === c.height, `E-STATUS-HEIGHT: the canvas is ${size(a)} before the notice, ${size(b)} while it stands and ${size(c)} after it clears`);
  expect(a.barHeight === 48 && b.barHeight === 48 && c.barHeight === 48, `E-STATUS-HEIGHT: the status bar is ${a.barHeight}, ${b.barHeight} and ${c.barHeight} px tall, not 48 in all three`);
  return `the canvas stayed ${size(a)} (A, B, C) and the bar 48 px; recorded, not asserted: A's canvas height ${a.height}; in B the bar's scrollHeight ${b.scrollHeight} against its clientHeight ${b.clientHeight}; the residency item present in B: ${b.residency}`;
}

async function stepStatusHeight(page, consoleHandle) {
  const inner = () => page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const sized = (w, h) => pollUntil(inner, (s) => s.w === w && s.h === h, 5000);
  const was = await inner(), cdp = await page.context().newCDPSession(page);
  let windowId = null, bounds = null, ran = false, failure = null, restoreError = null, note = "", result;
  try {
    windowId = (await cdp.send("Browser.getWindowForTarget")).windowId;
    bounds = (await cdp.send("Browser.getWindowBounds", { windowId })).bounds;
    await cdp.send("Browser.setWindowBounds", { windowId, bounds: { width: 880, height: 800, windowState: "normal" } });
    const set = await sized(880, 800);
    if (!set.ok) throw new Error(`the inner size is ${set.last.w} x ${set.last.h} after the resize`);
    note = `; inner size after the resize ${set.last.w} x ${set.last.h}`; ran = true;
    result = await stepStatusHeightAt880(page, consoleHandle);
  } catch (e) {
    failure = ran ? e : new Error(`E-STATUS-HEIGHT: INCONCLUSIVE (class 2, never a pass): the window could not be set to 880 x 800 over CDP (${e?.message})`);
    throw failure;
  } finally {
    if (bounds !== null) try {
      await cdp.send("Browser.setWindowBounds", { windowId, bounds });
      const back = await sized(was.w, was.h);
      note += `; inner size after the restore ${back.last.w} x ${back.last.h}`;
      if (!back.ok) throw new Error(`E-STATUS-HEIGHT: the restore did not take: the inner size is ${back.last.w} x ${back.last.h}, it was ${was.w} x ${was.h} before the resize`);
    } catch (e) { restoreError = e; }
    await cdp.detach().catch(() => {});
    if (restoreError !== null && failure !== null) failure.message += ` (and the restore failed: ${restoreError.message})`;
    else if (restoreError !== null) throw restoreError;
  }
  return result + note;
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
      await showLayerTab(page).catch(() => {});
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
  await runStep("E-REFUSED", 600_000, () => stepRefused(page, consoleHandle));
  await runStep("E-GEN", 900_000, () => stepGen(page, consoleHandle));
  await runStep("E-KINDS", 1_200_000, () => stepKinds(page, consoleHandle));
  await runStep("E-EXPORT", 900_000, () => stepExport(page, consoleHandle));
  await runStep("E-SCOPE", 300_000, () => stepScope(page, consoleHandle));
  await runStep("E-ASK", 600_000, () => stepAsk(page, consoleHandle));
  await runStep("E-ASK-STATEMENT", 300_000, () => stepAskStatement(page, consoleHandle));
  await runStep("E-ASK-TWO", 600_000, () => stepAskTwo(page, consoleHandle));
  await runStep("E-STATUS-HEIGHT", 600_000, () => stepStatusHeight(page, consoleHandle));
  await runStep("E-DBLCLICK", 600_000, () => stepDblClick(page, consoleHandle));
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
    console.log("[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover.");
    if (process.env.SELECTION_EXPORT_TODAY === "1") {
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
    }
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
