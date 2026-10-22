#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PR A): the attributes of the inspected feature, on real WebView2.
//
//   PA-E1  `attributes-multitype.parquet` (500 polygons; seven columns, six projectable). A click at a point whose id `hoverIdAfterBarrier` took shows, in the Feature tab, the
//          oracle's value for every projected column, in declared order: `i64` exactly, `f32` as the oracle's text (H7), a NULL as the marker. `d32` is named as not projected and shown nowhere.
//          The oracle is `attributes-multitype.oracle.json`, which the generator (`kernel/tests/manual_walkthrough_fixtures.rs`) reads out of the file through DuckDB: five ids at the middle of the grid.
//   PA-E3  `filter-zoned.parquet`. Unfiltered, the features clicked show at least two different zones (a click that read one row for every feature would show one). Under `zone = 'residential'`,
//          every feature clicked shows that zone.
//
// No id is taken from a first poll: every id comes through `hoverIdAfterBarrier` from lib.mjs. The Feature tab is read from the real DOM. Each fixture's sha256 is read before and after the run
// and must be equal. What none of this proves: a timing, a rate or a performance figure. The millisecond numbers are bounds on waiting.
//
// RECORDED MUTATIONS. Each is named for the custodian to observe in a run at the PR's head. Apply one alone, run `npm run e2e:attributes`, record the failing step by name with the commit, and revert it.
//   PA-E1  src/attributes/projection.ts, `projectionFor`: `names.slice(0, ATTRIBUTE_PROJECTION_MAX)` becomes `names.slice(0, Math.min(ATTRIBUTE_PROJECTION_MAX, names.length - 1))`.
//          Expected: PA-E1 fails on the names of the projected columns (`text`, the last, is missing).
//   PA-E3  src/canvas/clickPick.ts, `resolveClickPick`: `readRow(candidate.batch, row)` becomes `readRow(candidate.batch, 0)`. Expected: PA-E3 fails because every feature clicked unfiltered shows one zone.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import {
  attachOrLaunch,
  attachConsole,
  waitForSettle,
  canvasRect,
  zoomInOneNotch,
  findInteriorCandidate,
  verifyInteriorCandidate,
  bufferPointToCss,
  subdivideRegion,
  hoverIdAfterBarrier,
  MAX_ZOOM_NOTCHES,
} from "./lib.mjs";

const FIXTURES = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\";
const FIXTURE_MULTITYPE = `${FIXTURES}attributes-multitype.parquet`;
const FIXTURE_ORACLE = `${FIXTURES}attributes-multitype.oracle.json`;
const FIXTURE_FILTER = `${FIXTURES}filter-zoned.parquet`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Harness bounds and counts, not measurements and not claims (ADR-018).
const CLICK_SETTLE_MS = 400; // a React commit after a click
const HOVER_ATTEMPTS_MAX = 60; // hovers one search makes, whatever they give
const HOVER_MISSES_MAX = 4; // candidates in a row that answer nothing before a camera search gives up
const GRID_COLUMNS = 23; // attributes-multitype.parquet: 500 features, ceil(sqrt(500)) columns, 22 rows
const GRID_ROWS = 22;
const FIT_MARGIN_FRACTION = 0.8; // the auto-fit leaves about 10% on each side; the search starts from this estimate and widens, so the estimate need not be exact
const NULL_MARKER = "[P6 placeholder] NULL"; // the Feature tab's marker for a NULL (attributes/values.ts), read from the DOM as shown
const PROJECTED = ["zone", "area", "f32", "i64", "flag", "text"]; // MultiType's projectable columns in file order; d32 (Date32) is not admitted

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

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

/** The Feature tab's Attributes section as an operator sees it: the id line, each column's name and shown value, and the not-projected line. */
const readTab = (page) =>
  page.evaluate(() => {
    const texts = (selector) => [...document.querySelectorAll(selector)].map((e) => e.textContent ?? "");
    const id = /^id (\d+)/.exec(document.querySelector(".feature-id")?.textContent ?? "");
    return {
      id: id ? id[1] : null,
      names: texts(".feature-attribute-name"),
      values: texts(".feature-attribute-value"),
      unprojected: document.querySelector(".feature-attributes-unprojected")?.textContent ?? null,
      notHeld: document.querySelector(".feature-attributes-not-held") !== null,
    };
  });

const showFeatureTab = (page) => page.evaluate(() => document.getElementById("inspector-tab-feature")?.click());
const useNavigate = (page) => page.locator(".tool-switch-button", { hasText: "Navigate" }).click();
const center = (rect) => ({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });

async function openFixture(page, consoleHandle, path, label) {
  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), path);
  expect(opened.kind === "admitted", `${label}: openPath(${basename(path)}) returned ${JSON.stringify(opened)}`);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 45_000 });
}

/** Clicks at a CSS point and returns the Feature tab once it shows an inspected id. */
async function clickAndRead(page, point) {
  await page.mouse.click(point.x, point.y);
  await sleep(CLICK_SETTLE_MS);
  return (await pollUntil(() => readTab(page), (t) => t.id !== null, 5000)).last;
}

// ------------------------------------------------------------------------------------------------
// PA-E1
// ------------------------------------------------------------------------------------------------

/**
 * CSS points to hover for the oracle's five features, the cells at the middle of the grid (ids 240 to 242 and 263, 264: columns 10 to 12 of rows 10 and 11, which the
 * fit centres between). First the centres of those cells with row 10 below the middle, as a y-up camera draws them, then with the rows swapped, then a spiral at a third
 * of the estimated cell around the middle for a fit that is not the estimate.
 */
function pointsAroundCentre(rect) {
  const cell = FIT_MARGIN_FRACTION * Math.min(rect.width / GRID_COLUMNS, rect.height / GRID_ROWS);
  const step = cell / 3;
  const mid = center(rect);
  const cells = [[-1, 0.5], [0, 0.5], [1, 0.5], [-1, -0.5], [0, -0.5]];
  const aimed = [...cells, ...cells.map(([dx, dy]) => [dx, -dy])].map(([dx, dy]) => ({ x: mid.x + dx * cell, y: mid.y + dy * cell }));
  const reach = Math.ceil((2 * cell) / step);
  const spiral = [];
  for (let dy = -reach; dy <= reach; dy += 1) for (let dx = -reach; dx <= reach; dx += 1) spiral.push({ x: mid.x + dx * step, y: mid.y + dy * step, d: Math.hypot(dx, dy) });
  return [...aimed, ...spiral.sort((a, b) => a.d - b.d)];
}

async function stepAttributesMultitype(page, consoleHandle) {
  await openFixture(page, consoleHandle, FIXTURE_MULTITYPE, "PA-E1");
  await useNavigate(page);
  await showFeatureTab(page);
  const oracle = new Map(JSON.parse(readFileSync(FIXTURE_ORACLE, "utf8")).map((row) => [row.id, row]));
  expect(oracle.size === 5, `PA-E1: the oracle holds ${oracle.size} ids, expected 5`);
  const checked = [];
  let tried = 0;
  for (const point of pointsAroundCentre(await canvasRect(page))) {
    if (tried >= HOVER_ATTEMPTS_MAX * 2) break;
    tried += 1;
    const hover = await hoverIdAfterBarrier(page, point, "PA-E1");
    expect(hover.last.state !== "refusal", "PA-E1: a hover ended in the below-resolution refusal; the camera is too far out for this fixture");
    const id = hover.ok ? hover.last.id : null;
    const expected = id === null ? undefined : oracle.get(id);
    if (expected === undefined || checked.some((c) => c.id === id)) continue;
    const tab = await clickAndRead(page, point);
    expect(tab.id === id, `PA-E1: the Feature tab shows id ${tab.id}; the oracle id at that pointer is ${id}`);
    expect(JSON.stringify(tab.names) === JSON.stringify(PROJECTED), `PA-E1: the projected columns are ${JSON.stringify(tab.names)}, expected ${JSON.stringify(PROJECTED)} in declared order (d32 is not projected)`);
    const want = PROJECTED.map((name) => (expected[name] === null ? NULL_MARKER : expected[name]));
    expect(JSON.stringify(tab.values) === JSON.stringify(want), `PA-E1: id ${id} shows ${JSON.stringify(tab.values)}; the oracle's values are ${JSON.stringify(want)}`);
    expect(tab.unprojected !== null && tab.unprojected.includes("d32"), `PA-E1: the not-projected line is ${JSON.stringify(tab.unprojected)}; it should name d32`);
    expect(!tab.notHeld, "PA-E1: the Feature tab says the attributes are not held");
    checked.push({ id, nullZone: expected.zone === null });
    if (checked.length >= 2 && checked.some((c) => c.nullZone) && checked.some((c) => !c.nullZone)) break;
  }
  expect(checked.length >= 2, `PA-E1: ${checked.length} of the oracle's ids were reached in ${tried} hovers; at least 2 are needed`);
  expect(checked.some((c) => c.nullZone), `PA-E1: no oracle id with a NULL zone was reached in ${tried} hovers, so the NULL marker was not exercised`);
  return `${checked.length} oracle ids (${checked.map((c) => c.id).join(", ")}) showed the oracle's values in declared order, a NULL zone as the marker, in ${tried} hovers`;
}

// ------------------------------------------------------------------------------------------------
// PA-E3
// ------------------------------------------------------------------------------------------------

/**
 * Candidate drawing-buffer points of the current frame, each verified only when the caller asks for the next: the densest-patch candidate and a lattice, each yielded only when
 * its 5 x 5 neighbourhood is non-background (`verifyInteriorCandidate`). Yields `{ point, bw, bh }`.
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
 * Hovers `candidatePoints` for confirmed ids, through `hoverIdAfterBarrier` only, until `want` features with distinct ids, HOVER_ATTEMPTS_MAX hovers, or HOVER_MISSES_MAX candidates in a
 * row that answered nothing. The buffer's row order is learned from the first answer (both are tried until then). Returns `{ found: [{ point, id }], refused }`.
 */
async function hoverFeatures(page, label, want) {
  const rect = await canvasRect(page);
  const found = [];
  let flipY = null;
  let tried = 0;
  let misses = 0;
  for await (const { point, bw, bh } of candidatePoints(page)) {
    if (misses >= HOVER_MISSES_MAX || found.length >= want) break;
    let answered = false;
    for (const flip of flipY === null ? [true, false] : [flipY]) {
      if (tried >= HOVER_ATTEMPTS_MAX) return { found, refused: false };
      tried += 1;
      const exact = bufferPointToCss(point, rect, bw, bh, flip);
      const css = { x: Math.round(exact.x), y: Math.round(exact.y) }; // whole CSS pixels, as a real mouse at 100% scaling gives
      const result = await hoverIdAfterBarrier(page, css, label);
      if (result.last.state === "refusal") return { found, refused: true };
      if (!result.ok) continue;
      flipY = flip;
      answered = true;
      if (!found.some((f) => f.id === result.last.id)) found.push({ point: css, id: result.last.id });
      break;
    }
    misses = answered ? 0 : misses + 1;
  }
  return { found, refused: false };
}

/** Zooms in from the current camera, a notch at a time, until a hover search gives `want` features with distinct ids; returns them as `{ point, id }`. */
async function distinctFeatures(page, consoleHandle, label, want) {
  const mid = center(await canvasRect(page));
  const gave = [];
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES; notch += 1) {
    if (notch > 0) await zoomInOneNotch(page, consoleHandle, mid);
    const { found, refused } = await hoverFeatures(page, `${label} (notch ${notch})`, want);
    if (found.length >= want) return found;
    gave.push(`notch ${notch}: ${found.length}${refused ? ", refused as below the pick resolution" : ""}`);
  }
  throw new Error(`${label}: no camera within ${MAX_ZOOM_NOTCHES} zoom-in notches gave ${want} features with distinct confirmed ids (${gave.join("; ")})`);
}

async function stepZones(page, consoleHandle) {
  await openFixture(page, consoleHandle, FIXTURE_FILTER, "PA-E3");
  await useNavigate(page);
  await showFeatureTab(page);
  const zoneOf = async (point) => {
    const tab = await clickAndRead(page, point);
    expect(JSON.stringify(tab.names) === JSON.stringify(["zone"]), `PA-E3: the projected columns are ${JSON.stringify(tab.names)}, expected ["zone"]`);
    return { id: tab.id, zone: tab.values[0] };
  };
  const unfiltered = [];
  for (const { point, id } of await distinctFeatures(page, consoleHandle, "PA-E3 unfiltered", 6)) {
    const shown = await zoneOf(point);
    expect(shown.id === id, `PA-E3: the Feature tab shows id ${shown.id}; the oracle id at that pointer is ${id}`);
    unfiltered.push(shown);
  }
  const zones = new Set(unfiltered.map((f) => f.zone));
  expect(zones.size >= 2, `PA-E3: ${unfiltered.length} features clicked unfiltered all show ${JSON.stringify([...zones])}; their zones differ in the file, so one row was read for every feature`);

  const applied = await page.evaluate((predicate) => window.__SPATIAL_E2E__.queryWithFilter(predicate), "zone = 'residential'");
  expect(applied.kind === "applied", `PA-E3: queryWithFilter("zone = 'residential'") returned ${JSON.stringify(applied)}, expected {kind:"applied"}`);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const filtered = [];
  for (const { point } of await distinctFeatures(page, consoleHandle, "PA-E3 filtered", 3)) filtered.push(await zoneOf(point));
  expect(filtered.every((f) => f.zone === "residential"), `PA-E3: under zone = 'residential' the features clicked show ${JSON.stringify(filtered.map((f) => f.zone))}`);
  return `unfiltered clicks showed ${JSON.stringify([...zones])}; under zone = 'residential' ${filtered.length} clicks all showed residential`;
}

// ------------------------------------------------------------------------------------------------

async function runSteps(page, consoleHandle) {
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
  const fixtures = [FIXTURE_MULTITYPE, FIXTURE_ORACLE, FIXTURE_FILTER];
  for (const path of fixtures) {
    if (!existsSync(path)) throw new Error(`attributes: ${path} is not there; regenerate the manual-walkthrough fixtures (kernel/tests/manual_walkthrough_fixtures.rs, --ignored)`);
  }
  const before = fixtures.map(sha256);
  await runStep("PA-E1", 900_000, () => stepAttributesMultitype(page, consoleHandle));
  await runStep("PA-E3", 1_200_000, () => stepZones(page, consoleHandle));
  const after = fixtures.map(sha256);
  const same = before.every((hash, i) => hash === after[i]);
  console.log(`[attributes] fixtures ${same ? "hash-identical before and after" : "CHANGED during the run"}: ${fixtures.map((p, i) => `${basename(p)} ${before[i].slice(0, 12)}`).join(", ")}`);
  if (!same) process.exitCode = 1;
  console.log(`[attributes] ${results.filter((r) => r.status === "PASS").length} PASS, ${results.filter((r) => r.status === "FAIL").length} FAIL: ${results.map((r) => `${r.id}=${r.status}`).join(" ")}`);
}

async function main() {
  const { browser, page } = await attachOrLaunch();
  const consoleHandle = attachConsole(page);
  try {
    for (let i = 0; i < 300 && !(await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false)); i += 1) await sleep(300);
    await runSteps(page, consoleHandle).catch((e) => {
      console.error(`[attributes] harness failure: ${e.stack ?? e.message}`);
      process.exitCode = 1;
    });
  } finally {
    consoleHandle.dispose();
    await browser.close().catch(() => {});
    process.exit(process.exitCode ?? 0);
  }
}

await main();
