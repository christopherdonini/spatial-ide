#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- E-FL of OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md section 4 (step S4).
// Standalone, operator-run, on the MEASURE BUILD only. NOT wired into `npm run verify` / CI. Run it from frontends/shell:
//   npm run e2e:open-fills-fit-view -- --measure-build <path to the measure build's exe>
// With no such argument it says why and exits 2. It launches the exe itself (`attachOrLaunchExe`) and refuses an app already listening on the CDP port.
//
// What it asserts: after a fresh launch and ONE open of 100k-happy-path.parquet, with no input after the open and no arm or level call,
//   (a) after the open's first stream (the first look) delivers its last batch, at least one further `stream-issued` render-trace line arrives;
//   (b) the render trace then goes quiet (no `viewport_query`, `stream-issued` or `batch` line for 3 s) within 180 s;
//   (c) `.residency-status` then reads the complete-in-view sentence (a pattern built from residencyStatusText's `candidate-within-budget` template);
//   (d) a screenshot clipped to `.working-canvas`, cut into an 8x8 grid, shows a pixel unlike the ring background in every cell whose world rectangle lies
//       wholly inside the fixture's parcel area (the world rectangle is computed from the fit's first `view-state` line).
// Exit codes: 0 when (a) to (d) pass; 1 when any fails; 2 VOID (a precondition is unmet, or (e) fails, or a fatal error): a VOID run is never a PASS.
// Precondition (else VOID): the first `stream-issued` line arrives with its `batch` rows reaching 10,000 (the first look's limit), the fit's `view-state`
//   line arrives, and the fixture file's sha256 is the one the parcel area is valid under (describe.extent is printed and decides nothing).
// (e), my reading of the form: a failure of (d) is only attributable to the defect when at least one failing cell lies outside the first look's rows, so
//   the run is VOID when (d) fails and no blank qualifying cell lies wholly above the first 10,000 rows of the fixture (file order, 317 columns of 40 m
//   cells from N 1,200,000 -- the generator's constants, restated as layout.mjs restates them). With (d) passing, (e) is reported and decides nothing.
// Page members called: `window.__SPATIAL_E2E__.openPath` only (the instrumented-build hook AdmissionPanel registers under `isInstrumentedBuild()`),
// plus DOM reads of `.working-canvas` and `.residency-status`. Input: none after the open. Images come from the devtools method `Page.captureScreenshot`.
// The console lines are read as recentre-crossing.mjs reads them: the render-trace arguments' JSON, kept in arrival order by a queue.
//
// What this does not prove: any docs/08 figure, macOS or Linux, a file other than this fixture, the arm or level other than the shipped default, the
// complete-in-view claim for any view but the fit, or that a pixel unlike the ring background is a feature (a blank cell has no pixel off the ring's commonest colour by more than 8 on any
// channel). The screenshot is composited and opaque, so the alpha reading is printed and decides nothing.
// The REPORT lines give the first look's side of each qualifying cell (o above its rows, i not) and whether it holds a marked pixel (+ or -).

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { inflateSync } from "node:zlib";
import { attachOrLaunchExe } from "./lib.mjs";

const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\100k-happy-path.parquet";
const FIRST_LOOK_ROWS = 10_000; // UNTILED_FIRST_LOOK_ROW_LIMIT (src/canvas/tileGridConstants.ts), restated: an e2e module imports no product constant
const QUIET_MS = 3000;
const SETTLE_TIMEOUT_MS = 180_000;
const PRECONDITION_TIMEOUT_MS = 120_000;
const GRID = 8;
const COLS = 317, CELL_M = 40, N_LO = 1_200_000; // the generator's constants (engine/src/fixture.rs, as layout.mjs restates them)
const FIRST_LOOK_YMAX = N_LO + Math.ceil(FIRST_LOOK_ROWS / COLS) * CELL_M; // above this the first look holds no row
// the fixture's parcel area in EPSG:2056 m, restated from the generator (engine/src/fixture.rs:67-68,93,1404-1412) as layout.mjs:419 restates it; valid only under FIXTURE_SHA256
const PARCEL = { xmin: 2_600_000, ymin: 1_200_000, xmax: 2_612_680, ymax: 1_212_600 };
const FIXTURE_SHA256 = "fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49";
const OUT_DIR = join(dirname(dirname(fileURLToPath(import.meta.url))), "e2e", "out"); // gitignored
const TAG = `efl-${Date.now()}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const argv = process.argv.slice(2);
const exeAt = argv.indexOf("--measure-build");
const EXE = exeAt !== -1 ? argv[exeAt + 1] : null;
if (!EXE) {
  console.error("open-fills-fit-view: needs --measure-build <path to the measure build's exe>. E-FL runs on the measure build only, launches it itself, and never attaches to a dev server.");
  process.exit(2);
}

class Void extends Error {}
const results = [];
function record(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ::  ${detail}`);
}

// The residencyStatusText `candidate-within-budget` case (src/residency/residencyStatus.ts) returns `Showing all ${n} features in view` when not settled
// partial; this pattern is that template with its count replaced by digits.
const WITHIN_BUDGET_TEMPLATE = (n) => `Showing all ${n} features in view`;
const WITHIN_BUDGET_PATTERN = new RegExp(`^${WITHIN_BUDGET_TEMPLATE("@@N@@").replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace("@@N@@", "\\d+")}$`);

const decodeHexF64 = (hex) => Buffer.from(hex, "hex").readDoubleBE(0);

// Every render-trace line, in arrival order: { seq, t, event, data }. t is Date.now() at the console event.
function listen(page) {
  const lines = [];
  let queue = Promise.resolve();
  page.on("console", (m) => {
    const t = Date.now();
    if (!m.text().includes("[render-trace]")) return;
    const a = m.args();
    queue = queue.then(async () => {
      try {
        const vals = await Promise.all(a.map((x) => x.jsonValue().catch(() => undefined)));
        if (vals[0] === "[render-trace]") lines.push({ seq: lines.length, t, event: vals[1], data: vals[2] });
      } catch { /* a line that cannot be read is skipped */ }
    });
  });
  return { lines, flush: () => queue };
}

// ---- PNG: node:zlib alone, as recentre-crossing.mjs decodes it, with the alpha byte kept. ----
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
const alphaAt = ({ width: w, bpp, px }, x, y) => (bpp === 4 ? px[(y * w + x) * 4 + 3] : 255);
const rgbAt = ({ width: w, bpp, px }, x, y) => { const o = (y * w + x) * bpp; return [px[o], px[o + 1], px[o + 2]]; };

async function main() {
  const session = await attachOrLaunchExe(EXE);
  try {
    if (!session.launched) throw new Void("an app was already listening on the CDP port; E-FL needs a fresh launch of the measure exe and will not attach");
    const { page } = session;
    const trace = listen(page);
    for (let i = 0; i < 240; i++) {
      if (await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false)) break;
      await sleep(500);
    }
    const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
    if (outcome?.kind !== "admitted") throw new Void(`openPath did not admit the fixture: ${JSON.stringify(outcome)}`);
    const openedAt = Date.now();

    // ---- the precondition ----
    const read = async () => {
      await trace.flush();
      const L = trace.lines;
      const issued0 = L.find((l) => l.event === "stream-issued");
      const h0 = issued0?.data?.streamHandle;
      const rows0 = issued0 ? L.filter((l) => l.event === "batch" && l.data?.streamHandle === h0).reduce((m, l) => Math.max(m, l.data.cumulativeRows ?? 0), 0) : 0;
      return { issued0, h0, rows0, fit: L.find((l) => l.event === "view-state"), ext: L.find((l) => l.event === "describe.extent") };
    };
    let pre = await read();
    for (let i = 0; i < PRECONDITION_TIMEOUT_MS / 250 && !(pre.issued0 && pre.rows0 >= FIRST_LOOK_ROWS && pre.fit); i++) { await sleep(250); pre = await read(); }
    const extentHex = pre.ext?.data?.value;
    console.log(`precondition: first stream-issued ${pre.issued0 ? pre.h0 : "NOT SEEN"}, its batch rows ${pre.rows0} (need ${FIRST_LOOK_ROWS}), fit view-state ${pre.fit ? "seen" : "NOT SEEN"}, describe.extent ${pre.ext ? `basis ${pre.ext.data?.basis}, value ${extentHex ? "present" : "null"}` : "NOT SEEN"}`);
    if (!(pre.issued0 && pre.rows0 >= FIRST_LOOK_ROWS && pre.fit)) throw new Void("the precondition is unmet");
    const fixtureSha = createHash("sha256").update(readFileSync(FIXTURE)).digest("hex");
    console.log(`  fixture sha256 ${fixtureSha}; fit view-state ${JSON.stringify(pre.fit.data)}`);
    if (fixtureSha !== FIXTURE_SHA256) throw new Void(`the fixture's sha256 is not ${FIXTURE_SHA256}: the parcel area is not valid for it`);

    // ---- (b) settle: no viewport_query, stream-issued or batch line for QUIET_MS, within SETTLE_TIMEOUT_MS ----
    const wire = (l) => l.event === "viewport_query" || l.event === "stream-issued" || l.event === "batch";
    let settled = false;
    const settleStart = Date.now();
    while (Date.now() - settleStart < SETTLE_TIMEOUT_MS) {
      await sleep(200);
      await trace.flush();
      const lastT = trace.lines.filter(wire).reduce((m, l) => Math.max(m, l.t), openedAt);
      if (Date.now() - lastT >= QUIET_MS) { settled = true; break; }
    }
    await trace.flush();
    const wireLines = trace.lines.filter(wire);
    const settleMs = Date.now() - settleStart;
    record("(b) settle: no viewport_query, stream-issued or batch line for 3 s within 180 s", settled, `${settled ? "quiet" : "never quiet"} after ${settleMs} ms of waiting; ${wireLines.length} wire lines in all`);

    // ---- (a) a further stream-issued line after the first look's last batch ----
    const lastFirstBatch = trace.lines.filter((l) => l.event === "batch" && l.data?.streamHandle === pre.h0).reduce((m, l) => Math.max(m, l.seq), -1);
    const further = trace.lines.filter((l) => l.event === "stream-issued" && l.seq > lastFirstBatch);
    const queries = trace.lines.filter((l) => l.event === "viewport_query" && l.seq > lastFirstBatch).length;
    record("(a) a further stream-issued line arrives after the first look's last batch, with no input", further.length >= 1, `first look ${pre.h0}, last batch at line ${lastFirstBatch}; ${further.length} further stream-issued line(s), ${queries} viewport_query line(s) after it`);

    // ---- (c) .residency-status ----
    const status = await page.evaluate(() => document.querySelector(".residency-status")?.textContent ?? null);
    record("(c) .residency-status reads the complete-in-view sentence", status !== null && WITHIN_BUDGET_PATTERN.test(status), `.residency-status is ${JSON.stringify(status)}; pattern ${WITHIN_BUDGET_PATTERN}`);

    // ---- (d) the screenshot, 8x8 ----
    const box = await page.evaluate(() => {
      const el = document.querySelector(".working-canvas");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top, cw: el.clientWidth, ch: el.clientHeight };
    });
    if (!box) throw new Void("no .working-canvas mounted");
    const views = trace.lines.filter((l) => l.event === "view-state");
    const fit = pre.fit.data;
    if (views.length > 1 && views.some((v) => JSON.stringify(v.data) !== JSON.stringify(fit))) console.log(`  NOTE: ${views.length} view-state lines; they are not all the fit's (the world rectangles below use the first)`);
    const s = 2 ** fit.zoom; // CSS px per world unit
    const [wx, wy] = [fit.targetX + fit.originX, fit.targetY + fit.originY];
    const cdp = await page.context().newCDPSession(page);
    let img;
    try {
      const { data } = await cdp.send("Page.captureScreenshot", { format: "png", clip: { x: box.left, y: box.top, width: box.cw, height: box.ch, scale: 1 } });
      const png = Buffer.from(data, "base64");
      mkdirSync(OUT_DIR, { recursive: true });
      const file = join(OUT_DIR, `open-fills-fit-view-${TAG}.png`);
      writeFileSync(file, png, { flag: "wx" }); // never overwrites
      console.log(`  image: ${file} ${png.length} bytes sha256 ${createHash("sha256").update(png).digest("hex")}`);
      img = decodePng(png);
    } finally {
      await cdp.detach().catch(() => {});
    }
    // B: the most frequent exact RGB on the image's outermost ring (REPORT only).
    const ring = new Map();
    const bump = (x, y) => { const k = rgbAt(img, x, y).join(","); ring.set(k, (ring.get(k) ?? 0) + 1); };
    for (let x = 0; x < img.width; x++) { bump(x, 0); bump(x, img.height - 1); }
    for (let y = 1; y < img.height - 1; y++) { bump(0, y); bump(img.width - 1, y); }
    const bg = [...ring.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
    const cells = [];
    let anyAlphaBelow255 = false;
    for (let j = 0; j < GRID; j++) for (let i = 0; i < GRID; i++) {
      const [x0, x1, y0, y1] = [Math.floor((i * img.width) / GRID), Math.floor(((i + 1) * img.width) / GRID), Math.floor((j * img.height) / GRID), Math.floor(((j + 1) * img.height) / GRID)];
      let hasAlpha = false, hasMarked = false;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
        const a = alphaAt(img, x, y);
        if (a < 255) anyAlphaBelow255 = true;
        if (a > 0) hasAlpha = true;
        const c = rgbAt(img, x, y);
        if (Math.abs(c[0] - bg[0]) > 8 || Math.abs(c[1] - bg[1]) > 8 || Math.abs(c[2] - bg[2]) > 8) hasMarked = true;
      }
      // the cell's world rectangle: CSS x grows right, CSS y grows down, world y grows up; W is the canvas centre
      const [cxL, cxR, cyT, cyB] = [(i * box.cw) / GRID, ((i + 1) * box.cw) / GRID, (j * box.ch) / GRID, ((j + 1) * box.ch) / GRID];
      const world = { xmin: wx + (cxL - box.cw / 2) / s, xmax: wx + (cxR - box.cw / 2) / s, ymax: wy - (cyT - box.ch / 2) / s, ymin: wy - (cyB - box.ch / 2) / s };
      const qualifying = world.xmin >= PARCEL.xmin && world.xmax <= PARCEL.xmax && world.ymin >= PARCEL.ymin && world.ymax <= PARCEL.ymax;
      cells.push({ i, j, world, qualifying, hasAlpha, hasMarked, outsideFirstLook: qualifying && world.ymin >= FIRST_LOOK_YMAX });
    }
    const qual = cells.filter((c) => c.qualifying);
    const blank = qual.filter((c) => !c.hasMarked);
    const dPass = qual.length > 0 && blank.length === 0;
    record("(d) every qualifying cell of the 8x8 grid holds a pixel unlike the ring background (tolerance 8)", dPass, `${qual.length} qualifying cell(s) of ${GRID * GRID}; ${blank.length} blank: ${blank.map((c) => `(${c.i},${c.j})`).join(" ") || "none"}; screenshot has a pixel below alpha 255: ${anyAlphaBelow255}`);
    const eCells = blank.filter((c) => c.outsideFirstLook);
    console.log(`  (e) ${eCells.length} blank qualifying cell(s) lie wholly above the first look's rows (N > ${FIRST_LOOK_YMAX}): ${eCells.map((c) => `(${c.i},${c.j})`).join(" ") || "none"}`);
    console.log(`  REPORT  alpha reading (decides nothing; ring B ${bg.join(",")}): qualifying cells with no pixel above alpha 0: ${qual.filter((c) => !c.hasAlpha).map((c) => `(${c.i},${c.j})`).join(" ") || "none"}`);
    console.log(`  REPORT  qualifying cells: ${qual.map((c) => `(${c.i},${c.j})${c.outsideFirstLook ? "o" : "i"}${c.hasMarked ? "+" : "-"}`).join(" ")}`);
    if (!dPass && eCells.length === 0) throw new Void("(d) failed and no blank qualifying cell lies outside the first look's rows: the failure cannot be attributed (e)");
  } finally {
    await session.stop().catch(() => {});
  }
}

let voided = null;
try {
  await main();
} catch (e) {
  if (!(e instanceof Void)) { console.error("open-fills-fit-view.mjs fatal:", e?.stack ?? e); process.exit(2); }
  voided = e.message;
}
if (voided) { console.log(`\nVOID  ${voided} -- not a PASS (checks recorded before it: ${results.length})`); process.exit(2); }
const failed = results.filter((r) => !r.ok);
console.log(`\n==== ${results.length - failed.length}/${results.length} PASS ====`);
if (failed.length) { console.log("FAILED:", failed.map((f) => f.name).join("; ")); process.exit(1); }
process.exit(0);
