#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- E1 of RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md section 4.
// Standalone, operator-run, on the MEASURE BUILD only. **NOT wired into `npm run verify` / CI**, its npm script is `e2e:recentre-crossing`, run as `npm run e2e:recentre-crossing -- --measure-build <path>`.
// Run it from frontends/shell:   node e2e/recentre-crossing.mjs --measure-build <path to the measure build's exe>
// With no such argument it says why and exits 2. It launches the exe itself (`attachOrLaunchExe`) and refuses an app that was already running;
// it never attaches to a dev server and is not meant for a dev build.
//
// What it checks: after a pan crosses the re-centring bound the frame's origin moves and the VIEW MUST NOT. The view is read only from the shipped
// `[render-trace] view-state` line (target plus origin; W = target + origin, per axis), the way pan-anchor.mjs reads it, and from two screenshots.
// Page members called: `window.__SPATIAL_E2E__.openPath` (an instrumented-build hook, registered by AdmissionPanel under `isInstrumentedBuild()`, which
// `.env.measure` turns on for the measure build) and DOM reads of `.working-canvas`. No DEV-only hook is called (`e2eSetViewState` and `capturePixels`
// are not in the measure build, and are not used). Input is Playwright's mouse; images come from the devtools method `Page.captureScreenshot`.
//
// Case 1: from the fit, with no camera hook: n1 drags of +L, n1 of -L, then a closing pair (+L, -L). (a) across each origin change the jump of W is
//   within TOLERANCE_BUFFER_PX per axis; (b) |W_end - W_start| <= d per axis; (c) the start and end images by the reproducer's note 5 rule, reported and not counted in the exit code; (d) the drawn data's edges that lie inside both images move by at most TOLERANCE_BUFFER_PX (Amendment 2).
// Case 2: from the fit again (its own reload): drag out until the target is within half of a double-click's shift below the bound, double-click
//   off centre by that shift, settle, one wheel notch out, settle, one wheel notch in, settle. (i) no origin change among the lines from the
//   double-click to its settle; (ii) the zoom after that settle is the zoom before plus 1; (iii) across the origin change at the wheel tick the jump
//   of W is within TOLERANCE_BUFFER_PX.
// Exit codes: 0 all checks pass; 1 a check failed; 2 VOID (a precondition is unmet, or a fatal error): a VOID run is never a PASS.
// Precondition: the fit line arrives, and case 1 has at least one origin change in each leg (the change belongs to the drag whose settled tick moved
// the origin, which the next line shows). Not in the form, and declared here: case 2 is VOID if its drag-out cannot land inside the window.
//
// TOLERANCE_BUFFER_PX is this file's own constant, 4.0 drawing-buffer px. Basis, restated from the frozen tolerance of PAN-ANCHOR-PREREGISTRATION.md
// (its tolerance item): the empirical noise floor on a known-correct reference build was 1.000 buffer px worst case, bounded below by ADR-010 rule 2's
// integer-pixel quantization floor of 1.352 buffer px; 4.0 sits above both, and the defect it guards fails it by thousands of px.

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { attachConsole, attachOrLaunchExe, waitForSettle } from "./lib.mjs";

const TOLERANCE_BUFFER_PX = 4.0;
const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const STEPS = 30; // mouse steps per drag; the pan lags the pointer by one step (the harness deficit, L/STEPS), so a drag nets L - L/STEPS
const EDGE_MARGIN_PX = 2 * TOLERANCE_BUFFER_PX;
const RECENTER_CAP = 131_072; // offsetFrame's cap for every unit; T(z) = min(cap, 2^(23-z)) for this metre fixture
const OUT_DIR = join(dirname(dirname(fileURLToPath(import.meta.url))), "e2e", "out"); // gitignored
const TAG = `e1-${Date.now()}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const argv = process.argv.slice(2);
const exeAt = argv.indexOf("--measure-build");
const EXE = exeAt !== -1 ? argv[exeAt + 1] : null;
if (!EXE) {
  console.error("recentre-crossing: needs --measure-build <path to the measure build's exe>. E1 runs on the measure build only (it uses no DEV-only hook), launches it itself, and never attaches to a dev server.");
  process.exit(2);
}

class Void extends Error {}
const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ::  ${detail}`);
}

async function setup() {
  const session = await attachOrLaunchExe(EXE);
  if (!session.launched) {
    await session.stop().catch(() => {});
    throw new Void("an app was already listening on the CDP port; E1 needs a fresh launch of the measure exe and will not attach");
  }
  const { page, stop } = session;
  // The view-state lines, read as pan-anchor.mjs reads them (the third console argument's JSON), kept in arrival order by a queue.
  const vs = [];
  let queue = Promise.resolve();
  page.on("console", (m) => {
    if (!m.text().includes("view-state")) return;
    const a = m.args();
    queue = queue.then(async () => { try { if (a.length >= 3) vs.push(await a[2].jsonValue()); } catch { /* preview-only line */ } });
  });
  return { page, vs, stop, trace: attachConsole(page), flush: () => queue };
}

async function openFixture(ctx) {
  const { page, vs } = ctx;
  await ctx.flush();
  vs.length = 0;
  await page.reload({ waitUntil: "load" });
  for (let i = 0; i < 240; i++) {
    if (await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false)) break;
    await sleep(500);
  }
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  if (outcome?.kind !== "admitted") throw new Error(`openPath did not admit the fixture: ${JSON.stringify(outcome)}`);
  await sleep(1500);
  for (let i = 0; i < 80 && vs.length === 0; i++) await sleep(250); // a bound, not a claim about how long a fit takes
  await ctx.flush();
  if (vs.length === 0) throw new Void("the fit line never arrived");
  return { ...vs[0] };
}

async function readBox(page) {
  const box = await page.evaluate(() => {
    const el = document.querySelector(".working-canvas");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const gl = el.getContext("webgl2");
    return { left: r.left, top: r.top, cw: el.clientWidth, ch: el.clientHeight,
      bw: gl ? gl.drawingBufferWidth : el.clientWidth, bh: gl ? gl.drawingBufferHeight : el.clientHeight };
  });
  if (!box) throw new Void("no .working-canvas mounted");
  return box;
}

// The drag plan (the reproducer's note 3, STEPS changed to 30): L, the bound T at the fit zoom, d = one drag's net world length, n1.
function dragPlan(zFit, box) {
  const L = 30 * Math.floor(Math.min(300, Math.floor(box.cw / 2) - EDGE_MARGIN_PX) / 30);
  if (!(L > 0)) throw new Void(`the canvas is too narrow for a drag (cw ${box.cw})`);
  const T = Math.min(RECENTER_CAP, 2 ** (23 - zFit));
  const d = (L - L / STEPS) * 2 ** -zFit;
  return { L, T, d, n1: Math.floor(T / d) + 3 };
}

// One drag from the canvas centre, pan-anchor's shape: down, move in STEPS steps, up, settle on the view-state lines. Returns whether it settled.
async function drag(ctx, box, dx) {
  const { page, vs } = ctx;
  await ctx.flush();
  await page.mouse.move(box.left + box.cw / 2, box.top + box.ch / 2);
  await page.mouse.down();
  await page.mouse.move(box.left + box.cw / 2 + dx, box.top + box.ch / 2, { steps: STEPS });
  await page.mouse.up();
  return settleLines(ctx);
}
async function settleLines(ctx) {
  const r = await waitForSettle(() => ctx.vs, { quietMs: 600, timeoutMs: 9000 });
  await sleep(180);
  await ctx.flush();
  return r.settled;
}

const W = (s) => [s.targetX + s.originX, s.targetY + s.originY];
const originOf = (s) => `${s.originX},${s.originY}`;
function originChanges(lines) {
  const at = [];
  for (let j = 1; j < lines.length; j++) if (originOf(lines[j]) !== originOf(lines[j - 1])) at.push(j);
  return at;
}
// The jump of W across consecutive lines, in drawing-buffer px per axis: |dW| * 2^z * (bw/cw), z the later line's.
function jumpPx(lines, j, box) {
  const [a, b] = [W(lines[j - 1]), W(lines[j])];
  const s = 2 ** lines[j].zoom;
  return [Math.abs(b[0] - a[0]) * s * (box.bw / box.cw), Math.abs(b[1] - a[1]) * s * (box.bh / box.ch)];
}
function jumpsWithinTolerance(lines, at, box) {
  const all = at.map((j) => jumpPx(lines, j, box));
  const worst = all.reduce((m, [x, y]) => Math.max(m, x, y), 0);
  return { ok: worst <= TOLERANCE_BUFFER_PX, detail: `${at.length} origin change(s), worst jump ${worst.toFixed(2)} buffer px (tol ${TOLERANCE_BUFFER_PX})` };
}

// ---- images: the reproducer's note 5 rule, carried in code. PNGs are decoded with node:zlib alone. ----
function decodePng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error("not a PNG");
  let p = 8, width = 0, height = 0, colorType = 0;
  const idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), type = buf.toString("latin1", p + 4, p + 8), body = buf.subarray(p + 8, p + 8 + len);
    if (type === "IHDR") {
      width = body.readUInt32BE(0); height = body.readUInt32BE(4); colorType = body[9];
      if (body[8] !== 8 || body[12] !== 0 || (colorType !== 2 && colorType !== 6)) throw new Error("unsupported PNG (need 8-bit RGB/RGBA, not interlaced)");
    } else if (type === "IDAT") idat.push(body);
    p += 12 + len;
  }
  const bpp = colorType === 6 ? 4 : 3, stride = width * bpp, raw = inflateSync(Buffer.concat(idat));
  const px = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, dst = y * stride;
    for (let i = 0; i < stride; i++) {
      const a = i >= bpp ? px[dst + i - bpp] : 0, b = y > 0 ? px[dst - stride + i] : 0, c = i >= bpp && y > 0 ? px[dst - stride + i - bpp] : 0;
      let pred = 0;
      if (f === 1) pred = a; else if (f === 2) pred = b; else if (f === 3) pred = (a + b) >> 1;
      else if (f === 4) { const q = a + b - c, pa = Math.abs(q - a), pb = Math.abs(q - b), pc = Math.abs(q - c); pred = pa <= pb && pa <= pc ? a : pb <= pc ? b : c; }
      px[dst + i] = (raw[src + i] + pred) & 255;
    }
  }
  return { width, height, bpp, px };
}
const rgbAt = ({ width: w, bpp, px }, x, y) => { const o = (y * w + x) * bpp; return [px[o], px[o + 1], px[o + 2]]; };
// B: the most frequent exact RGB on the START image's outermost one-pixel ring; both images are marked against that one B.
function ringB(img) {
  const { width: w, height: h } = img;
  const ring = new Map();
  const bump = (x, y) => { const k = rgbAt(img, x, y).join(","); ring.set(k, (ring.get(k) ?? 0) + 1); };
  for (let x = 0; x < w; x++) { bump(x, 0); if (h > 1) bump(x, h - 1); }
  for (let y = 1; y < h - 1; y++) { bump(0, y); if (w > 1) bump(w - 1, y); }
  return [...ring.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
}
// Marked: any channel differs from B by more than 8. N: the marked count. C: the marked pixels' mean position, scaled to buffer px by bw/cw (x)
// and bh/ch (y). edge: the marked pixels' bounding box (left, right, top, bottom), for rule (d).
function analyze(img, box, bg) {
  const { width: w, height: h } = img;
  let n = 0, sx = 0, sy = 0, left = w, right = -1, top = h, bottom = -1;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const c = rgbAt(img, x, y);
    if (Math.abs(c[0] - bg[0]) > 8 || Math.abs(c[1] - bg[1]) > 8 || Math.abs(c[2] - bg[2]) > 8) {
      n++; sx += x; sy += y; left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
    }
  }
  return { w, h, n, cx: n ? (sx / n) * (box.bw / box.cw) : null, cy: n ? (sy / n) * (box.bh / box.ch) : null, edge: n ? { left, right, top, bottom } : null };
}
function pairVerdict(s, e) {
  if (!s || !e) return { readable: false, why: "a capture failed" };
  if (s.w !== e.w || s.h !== e.h) return { readable: false, why: `unequal dimensions ${s.w}x${s.h} vs ${e.w}x${e.h}` };
  if (s.n === 0 || s.n === s.w * s.h) return { readable: false, why: `N_start ${s.n} of ${s.w * s.h}` };
  const dn = Math.abs(e.n - s.n), shift = s.n > 0 && e.n > 0 ? Math.hypot(e.cx - s.cx, e.cy - s.cy) : 0;
  const differs = dn > 0.10 * Math.max(s.n, e.n) || shift > TOLERANCE_BUFFER_PX;
  return { readable: true, differs, why: `N ${s.n} -> ${e.n}, C shift ${shift.toFixed(2)} buffer px` };
}
// Rule (d) (Amendment 2, item 4): an edge is inner when it is not on the image's outermost ring; K is the edges inner in both images. Unreadable: unequal
// dimensions, N_start 0 or every pixel, or N_end > 0 with K empty. The pair differs when N_end is 0, or when an edge in K moves by more than
// TOLERANCE_BUFFER_PX (scaled by bw/cw on x, bh/ch on y). (d) passes when the pair is readable and does not differ.
function edgeVerdict(s, e, box) {
  if (!s || !e) return { readable: false, why: "a capture failed" };
  if (s.w !== e.w || s.h !== e.h) return { readable: false, why: `unequal dimensions ${s.w}x${s.h} vs ${e.w}x${e.h}` };
  if (s.n === 0 || s.n === s.w * s.h) return { readable: false, why: `N_start ${s.n} of ${s.w * s.h}` };
  const fmt = (g) => (g.edge ? `[left ${g.edge.left}, right ${g.edge.right}, top ${g.edge.top}, bottom ${g.edge.bottom}]` : "none");
  const boxes = `start box ${fmt(s)}, end box ${fmt(e)}`;
  if (e.n === 0) return { readable: true, differs: true, why: `${boxes}; N_end 0, K n/a, no move to read` };
  const inner = (g) => ({ left: g.edge.left > 0, right: g.edge.right < g.w - 1, top: g.edge.top > 0, bottom: g.edge.bottom < g.h - 1 });
  const [si, ei] = [inner(s), inner(e)];
  const K = ["left", "right", "top", "bottom"].filter((k) => si[k] && ei[k]);
  if (!K.length) return { readable: false, why: `${boxes}; K is empty` };
  const moves = K.map((k) => [k, Math.abs(e.edge[k] - s.edge[k]) * (k === "left" || k === "right" ? box.bw / box.cw : box.bh / box.ch)]);
  const differs = moves.some(([, m]) => m > TOLERANCE_BUFFER_PX);
  return { readable: true, differs, why: `${boxes}; K {${K.join(", ")}}; moves ${moves.map(([k, m]) => `${k} ${m.toFixed(2)}`).join(", ")} buffer px (tol ${TOLERANCE_BUFFER_PX})` };
}
async function capture(ctx, box, label) {
  let cdp = null;
  try {
    // Wait for every render-trace line to go quiet (the reproducer's settle) before the capture. Quiet lines do not prove the data is all drawn: at 3df3e57c the start image held less of the fixture than the end image at the same view (Amendment 2 of the fix's form), so case 1 (d) compares only the drawn data's edges that lie inside both images.
    await waitForSettle(() => ctx.trace.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
    cdp = await ctx.page.context().newCDPSession(ctx.page);
    const { data } = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: box.left, y: box.top, width: box.cw, height: box.ch, scale: 1 } });
    const png = Buffer.from(data, "base64");
    mkdirSync(OUT_DIR, { recursive: true });
    const file = join(OUT_DIR, `recentre-crossing-${TAG}-${label}.png`);
    writeFileSync(file, png, { flag: "wx" }); // never overwrites
    console.log(`  image ${label}: ${file} ${png.length} bytes sha256 ${createHash("sha256").update(png).digest("hex")}`);
    return decodePng(png);
  } catch (e) {
    console.log(`  image ${label}: capture failed, not retried: ${e?.message ?? e}`);
    return null;
  } finally {
    await cdp?.detach().catch(() => {});
  }
}

async function case1(ctx) {
  const fit = await openFixture(ctx);
  const box = await readBox(ctx.page);
  const { L, T, d, n1 } = dragPlan(fit.zoom, box);
  console.log(`\n--- case 1: z_fit ${fit.zoom}, canvas ${box.cw}x${box.ch} (buffer ${box.bw}x${box.bh}), L ${L}, T ${T}, d ${d.toFixed(3)}, n1 ${n1}, ${2 * n1 + 2} drags ---`);
  const startPng = await capture(ctx, box, "case1-start");
  const plan = [...Array(n1).fill(L), ...Array(n1).fill(-L), L, -L];
  const starts = [], unsettled = [];
  for (const dx of plan) {
    await ctx.flush();
    starts.push(ctx.vs.length);
    if (!(await drag(ctx, box, dx))) unsettled.push(starts.length);
  }
  const lines = ctx.vs.slice();
  if (unsettled.length) console.log(`  drags that did not settle in the bound (read as they stand): ${unsettled.join(", ")}`);
  const endPng = await capture(ctx, box, "case1-end");
  const [ls, le] = [lines[0], lines.at(-1)];
  console.log(`  REPORT  case 1 view-state lines, as (b) reads them: start target (${ls.targetX}, ${ls.targetY}) origin (${ls.originX}, ${ls.originY}) zoom ${ls.zoom}; end target (${le.targetX}, ${le.targetY}) origin (${le.originX}, ${le.originY}) zoom ${le.zoom}`);
  const bg = startPng ? ringB(startPng) : null;
  const [startImage, endImage] = [startPng, endPng].map((p) => (p && bg ? analyze(p, box, bg) : null));
  const ownerOf = (i) => starts.filter((s) => s <= i).length - 1; // the drag whose lines include line i (-1: before the first drag)
  const at = originChanges(lines);
  const inLeg = (lo, hi) => at.filter((j) => ownerOf(j - 1) >= lo && ownerOf(j - 1) < hi).length;
  const [leg1, leg2] = [inLeg(0, n1), inLeg(n1, 2 * n1)];
  console.log(`  origin changes: ${at.length}; in leg 1 ${leg1}, in leg 2 ${leg2}; at drags ${at.map((j) => ownerOf(j - 1) + 1).join(", ")}`);
  if (leg1 < 1 || leg2 < 1) throw new Void(`case 1 precondition unmet: origin changes in leg 1 ${leg1}, in leg 2 ${leg2}`);
  const a = jumpsWithinTolerance(lines, at, box);
  record("case 1 (a): W is continuous across each origin change", a.ok, a.detail);
  const [ws, we] = [W(lines[0]), W(lines.at(-1))];
  const [ex, ey] = [Math.abs(we[0] - ws[0]), Math.abs(we[1] - ws[1])];
  record("case 1 (b): |W_end - W_start| <= d per axis", ex <= d && ey <= d, `|E| (${ex.toFixed(3)}, ${ey.toFixed(3)}) vs d ${d.toFixed(3)}`);
  const v = pairVerdict(startImage, endImage);
  console.log(`REPORT  case 1 (c): the start and end images do not differ  ::  ${v.readable ? `${v.differs ? "differ" : "do not differ"}: ${v.why}` : `unreadable: ${v.why}`}`);
  const ev = edgeVerdict(startImage, endImage, box);
  record("case 1 (d): the drawn data's inner edges do not move", ev.readable && !ev.differs, ev.readable ? `${ev.differs ? "differ" : "do not differ"}: ${ev.why}` : `unreadable: ${ev.why}`);
}

async function case2(ctx) {
  const fit = await openFixture(ctx);
  const box = await readBox(ctx.page);
  const { L, T, n1 } = dragPlan(fit.zoom, box);
  const shiftPx = L; // the double-click's offset from centre: 300 CSS px where the canvas allows it, else L
  const half = (shiftPx * 2 ** -fit.zoom) / 2; // half of that shift, in world units: the double-click moves the target by this much
  console.log(`\n--- case 2: z_fit ${fit.zoom}, T ${T}, double-click shift ${shiftPx} px, window below T: (0, ${half.toFixed(3)}] ---`);
  let line = fit;
  for (let k = 0; k < n1 + 5; k++) {
    const gap = T - Math.hypot(line.targetX, line.targetY);
    if (gap <= 0) throw new Void("case 2: the drag-out passed the bound before the window");
    if (gap <= half) break;
    // aim at the middle of the window; a drag of px nets px - px/STEPS
    await drag(ctx, box, Math.min(L, Math.max(2, ((gap - half / 2) * 2 ** fit.zoom * STEPS) / (STEPS - 1))));
    line = ctx.vs.at(-1);
  }
  const gap = T - Math.hypot(line.targetX, line.targetY);
  if (!(gap > 0 && gap <= half)) throw new Void(`case 2: the drag-out ended ${gap} below the bound, outside (0, ${half}]`);
  console.log(`  target ${gap.toFixed(3)} below the bound`);

  const before = ctx.vs.at(-1), from = ctx.vs.length - 1;
  await ctx.page.mouse.move(box.left + box.cw / 2 - shiftPx, box.top + box.ch / 2); // the target is on the -x side after +L drags
  await ctx.page.mouse.dblclick(box.left + box.cw / 2 - shiftPx, box.top + box.ch / 2);
  const settled = await settleLines(ctx);
  const dbl = ctx.vs.slice(from);
  const moved = originChanges(dbl);
  record("case 2 (i): no origin change from the double-click to its settle", moved.length === 0, `${dbl.length - 1} line(s), ${moved.length} origin change(s), settled ${settled}`);
  const dz = ctx.vs.at(-1).zoom - before.zoom;
  record("case 2 (ii): the zoom after the double-click is the zoom before plus 1", Math.abs(dz - 1) <= 1e-6, `zoom ${before.zoom} -> ${ctx.vs.at(-1).zoom} (+${dz})`);

  const wheelFrom = ctx.vs.length - 1;
  await ctx.page.mouse.move(box.left + box.cw / 2, box.top + box.ch / 2);
  for (const deltaY of [100, -100]) { await ctx.page.mouse.wheel(0, deltaY); await settleLines(ctx); }
  const wl = ctx.vs.slice(wheelFrom), wat = originChanges(wl);
  const j = wat.length ? jumpsWithinTolerance(wl, wat, box) : { ok: false, detail: "no origin change at the wheel tick: nothing to compare" };
  record("case 2 (iii): W is continuous across the origin change at the wheel tick", j.ok, j.detail);
}

async function main() {
  let ctx = null, voided = null;
  try {
    ctx = await setup();
    await case1(ctx);
    await case2(ctx);
  } catch (e) {
    if (!(e instanceof Void)) throw e;
    voided = e.message;
  } finally {
    await ctx?.stop?.().catch(() => {});
  }
  if (voided) { console.log(`\nVOID  ${voided} -- not a PASS (checks recorded before it: ${results.length})`); process.exit(2); }
  const failed = results.filter((r) => !r.ok);
  console.log(`\n==== ${results.length - failed.length}/${results.length} PASS ====`);
  if (failed.length) { console.log("FAILED:", failed.map((f) => f.name).join("; ")); process.exit(1); }
  process.exit(0);
}

main().catch((e) => { console.error("recentre-crossing.mjs fatal:", e?.stack ?? e); process.exit(2); });
