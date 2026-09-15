#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- DECISIONS-PENDING entry 95, the pan drag-anchor drift.
// **Pre-fix recorder** (PAN-ANCHOR-PREREGISTRATION.md §1: reproduce & MEASURE before any fix). This
// is the initial instrument committed BEFORE the fix; it MEASURES and PRINTS, it does not assert.
// The tolerance-gated named-case assertions and the mutation check are added in the E2E/tests commit,
// once the fix has landed. Standalone, operator-run, NOT wired into `npm run verify` / CI (needs the
// 100k fixture, a real WebView2, a real display): `node e2e/pan-anchor.mjs`.
//
// Two complementary instruments (§1):
//   A -- trace-derived grab-point invariant, computed from the shell's OWN authoritative model,
//        `world = (target + origin) + (pixel - center)/2^zoom`, reading target/origin/zoom off the
//        always-on `[render-trace] view-state` line. deck.gl's own `info.coordinate`/`unproject` is
//        NEVER read -- ADR-010 rule 1, quoted: deck.gl's bare `info.coordinate` "is a renderer-local
//        value with no tag, so it is renderer-internal and may not cross a boundary at all". A
//        synthetic Playwright drag loses the mousedown->first-`pointermove` segment (deck's controller
//        registers its pan-start on the first move, not on pointerdown) -- measured EXACTLY `dx/steps`,
//        zero excess, across steps=1,2,4,8,16,32; a real continuous mouse drag has no such step, so it
//        is subtracted.
//   B -- painted-pixel truth. With the finite dataset seated fully in frame, its non-background column
//        centroid translates rigidly; the painted shift is compared to deck's OWN target shift
//        (paint == event). `capturePixels` region counts only; the raw framebuffer never leaves the
//        page (docs/09).
//
// Recorded pre-fix state (2026-09-15, DPR 1.0 host): four widths all coincide (deck logical == deck
// == client == drawing buffer == canvas attr, `1280x200`, buffer/CSS ratio 1.000) -> candidate 1/2
// refuted; paint == event within ~1 buffer px -> no paint/event split; normal-use Instrument A excess
// == 0.000 at every zoom and both directions, there-and-back nets ~0 -> the app anchors correctly in
// normal use. The ONLY drift is candidate 3: a zoomed-out pan that crosses the origin-recenter
// threshold breaks the grab-point invariant by ~1100 buffer px (single crossing) to ~18160 buffer px
// (repeated), a runaway. See PAN-ANCHOR-PREREGISTRATION.md's Measured results.

import { attachOrLaunch, waitForSettle } from "./lib.mjs";

const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
// Dataset centre in EPSG:2056, from `engine/src/fixture.rs`: E_LO=2_600_000, N_LO=1_200_000, 40 m
// cell, 100_000 features -> 317x316 cells -> centre (E_LO + 317*40/2, N_LO + 316*40/2).
const E_C = 2_606_340, N_C = 1_206_320;
const Y_SIGN = -1; // OrthographicView flipY:false (verified: a pure-y drag yields a y-only residual).

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
    if (await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false)) break;
    await sleep(500);
  }
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  if (outcome?.kind !== "admitted") throw new Error(`openPath did not admit: ${JSON.stringify(outcome)}`);
  await sleep(1500);
  return { page, vs, stop };
}

async function readBox(page) {
  return page.evaluate(() => {
    const el = document.querySelector(".working-canvas");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const gl = el.getContext("webgl2");
    return { left: r.left, top: r.top, cw: el.clientWidth, ch: el.clientHeight,
      bw: gl ? gl.drawingBufferWidth : el.clientWidth, bh: gl ? gl.drawingBufferHeight : el.clientHeight, dpr: window.devicePixelRatio };
  });
}

let jit = 0;
async function setCam(page, vs, tx, ty, z) {
  // Jitter zoom so deck's uncontrolled `initialViewState` deep-equal guard never drops a repeat reset.
  jit += 1; vs.length = 0;
  await page.evaluate((a) => window.__SPATIAL_E2E__.e2eSetViewState(a[0], a[1], a[2]), [tx, ty, z + jit * 1e-5]);
  await sleep(500);
  return vs[vs.length - 1];
}
const last = (vs) => vs[vs.length - 1];

async function drag(page, vs, box, gpx, gpy, dx, dy, steps) {
  await page.mouse.move(box.left + gpx, box.top + gpy);
  await page.mouse.down();
  await page.mouse.move(box.left + gpx + dx, box.top + gpy + dy, { steps });
  await page.mouse.up();
  await waitForSettle(() => vs, { quietMs: 600, timeoutMs: 9000 });
  await sleep(180);
}

// Instrument A residual (drawing-buffer px), harness `dx/steps` deficit subtracted.
function instrumentA(box, s0, s1, dx, dy, steps) {
  const z = s1.zoom;
  const rcx = ((s1.targetX + s1.originX) - (s0.targetX + s0.originX)) * 2 ** z + dx - dx / steps;
  const rcy = ((s1.targetY + s1.originY) - (s0.targetY + s0.originY)) * 2 ** z + Y_SIGN * (dy - dy / steps);
  return { bx: rcx * (box.bw / box.cw), by: rcy * (box.bh / box.ch) };
}

const NSTRIP = 128;
async function columnCentroid(page) {
  const regions = [];
  for (let i = 0; i < NSTRIP; i++) regions.push({ x: i / NSTRIP, y: 0, w: 1 / NSTRIP, h: 1 });
  const s = await page.evaluate((r) => window.__SPATIAL_E2E__.capturePixels(r), regions);
  let num = 0, den = 0;
  s.regions.forEach((rg, i) => { const cx = ((i + 0.5) / NSTRIP) * s.width; num += cx * rg.nonBackgroundCount; den += rg.nonBackgroundCount; });
  return den > 0 ? num / den : null;
}

async function main() {
  const { page, vs, stop } = await setup();
  try {
    const box = await readBox(page);
    console.log(`\n[four-width] client ${box.cw}x${box.ch}  buffer ${box.bw}x${box.bh}  ratio ${(box.bw / box.cw).toFixed(3)}  DPR ${box.dpr}  (deck logical viewport read == client during investigation)`);
    const gpx = box.cw / 2, gpy = box.ch / 2;

    console.log("\n[Instrument A -- normal use, excess over the dx/steps harness deficit]");
    for (const [z, dx, steps] of [[-1, 320, 40], [-1, -320, 40], [-4, 500, 60], [2, 200, 60], [-1, 0, 40]]) {
      const s0 = await setCam(page, vs, E_C, N_C, z);
      const dy = dx === 0 ? 120 : 0;
      await drag(page, vs, box, gpx, gpy, dx, dy, steps);
      const a = instrumentA(box, s0, last(vs), dx, dy, steps);
      console.log(`  z=${z} d=(${dx},${dy}) steps=${steps}: residual (${a.bx.toFixed(2)}, ${a.by.toFixed(2)}) buffer px`);
    }

    console.log("\n[Instrument A -- off-centre grab, +x160, z=-1 (residual independent of grab position)]");
    for (const f of [0.2, 0.5, 0.8]) {
      const s0 = await setCam(page, vs, E_C, N_C, -1);
      await drag(page, vs, box, box.cw * f, gpy, 160, 0, 40);
      console.log(`  grab x-frac ${f}: residual ${instrumentA(box, s0, last(vs), 160, 0, 40).bx.toFixed(2)} buffer px`);
    }

    console.log("\n[Instrument A -- there-and-back, z=-1]");
    {
      const s0 = await setCam(page, vs, E_C, N_C, -1);
      await drag(page, vs, box, gpx, gpy, 300, 0, 40);
      await drag(page, vs, box, gpx + 300, gpy, -300, 0, 40);
      const net = ((last(vs).targetX + last(vs).originX) - (s0.targetX + s0.originX)) * 2 ** last(vs).zoom * (box.bw / box.cw);
      console.log(`  net residual ${net.toFixed(2)} buffer px`);
    }

    console.log("\n[Instrument B -- paint vs event, z=-6.5 (dataset fully in frame)]");
    for (const dx of [250, -250]) {
      const s0 = await setCam(page, vs, E_C, N_C, -6.5);
      const c0 = await columnCentroid(page);
      await drag(page, vs, box, gpx, gpy, dx, 0, 40);
      const c1 = await columnCentroid(page);
      const deckShift = -((last(vs).targetX + last(vs).originX) - (s0.targetX + s0.originX)) * 2 ** last(vs).zoom * (box.bw / box.cw);
      const painted = (c0 != null && c1 != null) ? c1 - c0 : null;
      console.log(`  dx=${dx}: painted ${painted == null ? "n/a" : painted.toFixed(1)} vs deck ${deckShift.toFixed(1)} -> ${painted == null ? "n/a" : (painted - deckShift).toFixed(2)} buffer px`);
    }

    console.log("\n[candidate 3 -- zoomed-out pan crossing the recenter threshold, z=-7]");
    for (const [dx, steps] of [[1200, 12], [-1200, 12]]) {
      const s0 = await setCam(page, vs, E_C, N_C, -7);
      await drag(page, vs, box, gpx, gpy, dx, 0, steps);
      console.log(`  dx=${dx} steps=${steps}: grab-point residual ${instrumentA(box, s0, last(vs), dx, 0, steps).bx.toFixed(2)} buffer px  (0 == anchored; large == candidate-3 drift)`);
    }
    console.log("\nRecorded. See PAN-ANCHOR-PREREGISTRATION.md's Measured results for the pre-fix figures.");
  } finally {
    await stop?.().catch(() => {});
  }
  process.exit(0);
}

main().catch((e) => { console.error("pan-anchor.mjs fatal:", e?.stack ?? e); process.exit(2); });
