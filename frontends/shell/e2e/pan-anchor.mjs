#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- DECISIONS-PENDING entry 95, the pan drag-anchor drift.
// Standalone, operator-run instrument. **NOT wired into `npm run verify` / CI** -- like entry-86's
// `test:e2e` and this repo's other `e2e/*.mjs`, it needs the 100k fixture, a real WebView2, and a
// real display none of which CI carries. Run it by hand against a `tauri dev --config
// e2e/out/tauri.e2e.conf.json` (or let `attachOrLaunch` spawn one): `node e2e/pan-anchor.mjs`.
//
// Two complementary instruments (PAN-ANCHOR-PREREGISTRATION.md §1):
//   A -- trace-derived grab-point invariant. The world point under a fixed pixel is computed from
//        the shell's OWN authoritative model, `world = (target + origin) + (pixel - center)/2^zoom`
//        (`center = (clientWidth/2, clientHeight/2)`, Y per `flipY:false`), reading target/origin/
//        zoom off the always-on `[render-trace] view-state` line. deck.gl's own `info.coordinate`/
//        `unproject` is NEVER read -- ADR-010 rule 1, quoted: deck.gl's bare `info.coordinate` "is a
//        renderer-local value with no tag, so it is renderer-internal and may not cross a boundary at
//        all". Grab pixel p -> W0; drag
//        N CSS px; after settle the world under the ENDING pointer pixel (p+N) must equal W0 -- a
//        grabbed point stays under the moving pointer. Residual localizes the shell's own
//        target/origin bookkeeping.
//   B -- painted-pixel truth. With the finite 100k dataset seated fully in frame, its non-background
//        column centroid translates rigidly under a pan; the painted shift must equal deck's own
//        target shift (paint == event). Uses `capturePixels` region non-background counts only; the
//        raw framebuffer never leaves the page (docs/09).
//
// **Measurement note (a mechanically-known harness artifact, subtracted -- not the app):** a
// synthetic Playwright drag loses the mousedown->first-`pointermove` segment, because deck's
// controller registers its pan-start on the first move, not on pointerdown. Measured: the deficit is
// EXACTLY one step, `dx/steps`, with zero excess, across steps=1,2,4,8,16,32 (residual ratio ==
// 1/steps to 5 decimals). A real continuous mouse drag has no such discrete first step. Instrument A
// therefore subtracts `dx/steps`; the leftover is the app's own residual (validated: ~0 on a
// known-correct build across every condition). Instrument B needs no such correction -- it compares
// the painted shift to deck's OWN target shift, and both carry the same deficit.

import { attachOrLaunch, waitForSettle } from "./lib.mjs";

// Frozen tolerance, drawing-buffer px (PAN-ANCHOR-PREREGISTRATION.md §5.1). Basis: empirical noise
// floor 1.0 px on a KNOWN-CORRECT reference build across every condition (both directions, both
// axes, there-and-back), bounded below by ADR-010 rule 2's integer-pixel quantization floor of
// 1.352 px ("M3 measured the dead-centre residual at 0.1789 m (1.352 px) ... entirely attributable
// to integer-pixel click quantization" -- quoted from ADR-010 rule 2). 4.0 px sits above both and
// asserts no sub-pixel anchoring (ADR-010 rule 6). The measured cause (candidate 3) fails it by
// thousands of px pre-fix, so the separation is not marginal.
const TOLERANCE_BUFFER_PX = 4.0;

const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
// Dataset centre in EPSG:2056, derived from `engine/src/fixture.rs`: E_LO=2_600_000, N_LO=1_200_000,
// 40 m grid cell, 100_000 features -> 317x316 cells -> centre (E_LO + 317*40/2, N_LO + 316*40/2).
const E_C = 2_606_340, N_C = 1_206_320;
const Y_SIGN = -1; // OrthographicView flipY:false: screen-y-down vs world-y-up (verified: a pure-y
// drag produces a y-only residual, x untouched -- PAN-ANCHOR-PREREGISTRATION.md §1 axis check).

const MEASURE = process.argv.includes("--measure");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function setup() {
  const { page, stop } = await attachOrLaunch({ timeoutMs: 1_500_000 });
  const vs = [];
  page.on("console", async (m) => {
    if (!m.text().includes("view-state")) return;
    try { const a = m.args(); if (a.length >= 3) vs.push(await a[2].jsonValue()); } catch { /* preview-only line */ }
  });
  await page.reload({ waitUntil: "load" });
  for (let i = 0; i < 240; i++) {
    const ok = await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false);
    if (ok) break;
    await sleep(500);
  }
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  if (outcome?.kind !== "admitted") throw new Error(`openPath did not admit the fixture: ${JSON.stringify(outcome)}`);
  await sleep(1500);
  return { page, vs, stop };
}

async function readBox(page) {
  return page.evaluate(() => {
    const el = document.querySelector(".working-canvas");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const gl = el.getContext("webgl2");
    return {
      left: r.left, top: r.top,
      cw: el.clientWidth, ch: el.clientHeight,
      bw: gl ? gl.drawingBufferWidth : el.clientWidth,
      bh: gl ? gl.drawingBufferHeight : el.clientHeight,
      dpr: window.devicePixelRatio,
    };
  });
}

let jit = 0;
async function setCam(page, vs, tx, ty, z) {
  // Jitter the zoom so deck's uncontrolled `initialViewState` deep-equal guard (this file's own
  // WorkingCanvas header, entry 85) never drops a repeated identical reset.
  jit += 1;
  vs.length = 0;
  await page.evaluate((a) => window.__SPATIAL_E2E__.e2eSetViewState(a[0], a[1], a[2]), [tx, ty, z + jit * 1e-5]);
  await sleep(500);
  return vs[vs.length - 1];
}
const last = (vs) => vs[vs.length - 1];

async function drag(page, vs, box, gpx, gpy, dx, dy, steps) {
  const before = vs.length;
  await page.mouse.move(box.left + gpx, box.top + gpy);
  await page.mouse.down();
  await page.mouse.move(box.left + gpx + dx, box.top + gpy + dy, { steps });
  await page.mouse.up();
  await waitForSettle(() => vs, { quietMs: 600, timeoutMs: 9000 });
  await sleep(180);
  return before;
}

// Instrument A residual (drawing-buffer px) for a single drag, with the mechanically-known
// harness artifact `dx/steps` (deck's pan-start-on-first-move deficit) subtracted -- see header.
function instrumentA(box, s0, s1, dx, dy, steps) {
  const z = s1.zoom;
  const residCssX = ((s1.targetX + s1.originX) - (s0.targetX + s0.originX)) * 2 ** z + dx - dx / steps;
  const residCssY = ((s1.targetY + s1.originY) - (s0.targetY + s0.originY)) * 2 ** z + Y_SIGN * (dy - dy / steps);
  const ratio = box.bw / box.cw; // element-measured buffer/CSS ratio -- never an assumed DPR
  return { bx: residCssX * ratio, by: residCssY * (box.bh / box.ch) };
}

const NSTRIP = 128;
async function columnCentroid(page) {
  const regions = [];
  for (let i = 0; i < NSTRIP; i++) regions.push({ x: i / NSTRIP, y: 0, w: 1 / NSTRIP, h: 1 });
  const s = await page.evaluate((r) => window.__SPATIAL_E2E__.capturePixels(r), regions);
  let num = 0, den = 0;
  s.regions.forEach((rg, i) => { const cx = ((i + 0.5) / NSTRIP) * s.width; num += cx * rg.nonBackgroundCount; den += rg.nonBackgroundCount; });
  return { cx: den > 0 ? num / den : null, total: den };
}

async function resizeWindow(page, w, h) {
  try {
    const client = await page.context().newCDPSession(page);
    const { windowId } = await client.send("Browser.getWindowForTarget");
    await client.send("Browser.setWindowBounds", { windowId, bounds: { width: w, height: h, windowState: "normal" } });
    await sleep(700);
    return true;
  } catch (e) {
    console.log(`  (window resize to ${w}x${h} unavailable: ${e?.message ?? e} -- measuring at the host's actual size)`);
    return false;
  }
}

// deck defers its drawing-buffer resize to the render loop, so right after a window resize the buffer
// can still be the OLD size while the CSS box already changed. `capturePixels` forces a redraw;
// loop until the buffer matches the client (pixel spaces coincide) before measuring, or give up.
async function settleCanvasSize(page) {
  for (let i = 0; i < 20; i++) {
    await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels()).catch(() => {});
    await sleep(200);
    const box = await readBox(page);
    if (box && box.bw === box.cw && box.bh === box.ch) return box;
  }
  return readBox(page);
}

const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ::  ${detail}`);
}

async function runCasesForSize(page, vs, sizeLabel) {
  const box = await settleCanvasSize(page);
  if (!box) { record(`${sizeLabel}: canvas`, false, "no .working-canvas mounted"); return; }
  const gpx = box.cw / 2, gpy = box.ch / 2;
  console.log(`\n--- window ${sizeLabel}: client ${box.cw}x${box.ch}, buffer ${box.bw}x${box.bh}, DPR ${box.dpr} ---`);
  // Four-width refutation of candidate 1/2 (deck logical viewport read via the throwaway diagnostic
  // during investigation was also 1280 == client; recorded in PAN-ANCHOR-PREREGISTRATION.md results).
  record(`${sizeLabel}: pixel-spaces-coincide`, box.bw === box.cw && box.bh === box.ch,
    `client==buffer (${box.cw}x${box.ch} == ${box.bw}x${box.bh}), ratio ${(box.bw / box.cw).toFixed(3)}`);

  // Normal-use anchor (regression guard): Instrument A + B, both directions. No recenter fires here
  // (threshold is huge at these zooms), so this passes pre- and post-fix -- it guards that the fix
  // did not break the common case.
  for (const dx of [300, -300]) {
    const s0 = await setCam(page, vs, E_C, N_C, -1);
    await drag(page, vs, box, gpx, gpy, dx, 0, 40);
    const s1 = last(vs);
    const a = instrumentA(box, s0, s1, dx, 0, 40);
    record(`${sizeLabel}: normal-A dx=${dx}`, Math.abs(a.bx) <= TOLERANCE_BUFFER_PX,
      `grab-point residual ${a.bx.toFixed(2)} buffer px (tol ${TOLERANCE_BUFFER_PX})`);
  }
  // Instrument B (paint == event): whole dataset in frame at z=-6.5; small drag keeps it in frame.
  for (const dx of [250, -250]) {
    const s0 = await setCam(page, vs, E_C, N_C, -6.5);
    const c0 = await columnCentroid(page);
    await drag(page, vs, box, gpx, gpy, dx, 0, 40);
    const s1 = last(vs);
    const c1 = await columnCentroid(page);
    const deckShiftPx = -((s1.targetX + s1.originX) - (s0.targetX + s0.originX)) * 2 ** s1.zoom * (box.bw / box.cw);
    const paintedShift = (c0.cx != null && c1.cx != null) ? (c1.cx - c0.cx) : null;
    const ok = paintedShift != null && Math.abs(paintedShift - deckShiftPx) <= TOLERANCE_BUFFER_PX;
    record(`${sizeLabel}: paint-vs-event dx=${dx}`, ok,
      paintedShift == null ? "centroid unavailable (content left frame)"
        : `painted ${paintedShift.toFixed(1)} vs deck ${deckShiftPx.toFixed(1)} -> ${(paintedShift - deckShiftPx).toFixed(2)} buffer px (tol ${TOLERANCE_BUFFER_PX})`);
  }
  // There-and-back: net ~0.
  {
    const s0 = await setCam(page, vs, E_C, N_C, -1);
    await drag(page, vs, box, gpx, gpy, 300, 0, 40);
    await drag(page, vs, box, gpx + 300, gpy, -300, 0, 40);
    const s1 = last(vs);
    const net = ((s1.targetX + s1.originX) - (s0.targetX + s0.originX)) * 2 ** s1.zoom * (box.bw / box.cw);
    record(`${sizeLabel}: there-and-back-net`, Math.abs(net) <= TOLERANCE_BUFFER_PX,
      `net residual ${net.toFixed(2)} buffer px (tol ${TOLERANCE_BUFFER_PX})`);
  }
  // THE DISCRIMINATOR (candidate 3): a zoomed-out pan that crosses the recenter threshold mid-drag.
  // Pre-fix this desynchronizes deck's pan-start into a runaway (measured -18160 buffer px, 15 origin
  // jumps); post-fix the recenter is deferred to gesture end and the grab-point invariant holds.
  // Instrument B is infeasible here -- the finite dataset leaves the frame -- so this is A only.
  for (const dx of [1200, -1200]) {
    const s0 = await setCam(page, vs, E_C, N_C, -7);
    await drag(page, vs, box, gpx, gpy, dx, 0, 12);
    const s1 = last(vs);
    const a = instrumentA(box, s0, s1, dx, 0, 12);
    record(`${sizeLabel}: recenter-crossing-A dx=${dx}`, Math.abs(a.bx) <= TOLERANCE_BUFFER_PX,
      `grab-point residual ${a.bx.toFixed(2)} buffer px (tol ${TOLERANCE_BUFFER_PX})`);
  }
}

async function main() {
  const { page, vs, stop } = await setup();
  try {
    // Two window sizes (PAN-ANCHOR-PREREGISTRATION.md §1 conditions). Candidate 1 (viewport vs box)
    // is refuted, so size is a regression breadth check, not the discriminator.
    await resizeWindow(page, 820, 640);
    await runCasesForSize(page, vs, "small");
    await resizeWindow(page, 1400, 900);
    await runCasesForSize(page, vs, "large");
  } finally {
    await stop?.().catch(() => {});
  }
  const failed = results.filter((r) => !r.ok);
  console.log(`\n==== ${results.length - failed.length}/${results.length} PASS ====`);
  if (failed.length && !MEASURE) {
    console.log("FAILED:", failed.map((f) => f.name).join(", "));
    process.exit(1);
  }
  process.exit(0);
}

main().catch((e) => { console.error("pan-anchor.mjs fatal:", e?.stack ?? e); process.exit(2); });
