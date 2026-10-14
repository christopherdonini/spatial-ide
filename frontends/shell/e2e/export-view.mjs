#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md section 4): the Export panel's Current view sends the box the map shows now, on real WebView2 with the
// real host prompt. Fixture: `filter-zoned.parquet` (2,000 polygons, `zone`); its sha256 is recorded before and after the run. Asserted, each as a named step:
//   E-CV-OPEN    EV0 open, first pixels; EV1 before any input, `input[value=current]` is not disabled.
//   E-CV         EV2 a corner view through `e2eSetViewState`, then prepare Current view through `publishPrepareWithDestination`: box A is parsed from the prompt's `row_scope`
//                (the human's sentence, matched whole) and the dialog is abandoned. EV3 Apply `zone = 'residential'` through the `queryWithFilter` seam (applied), then wait until the
//                resident count is above 0 after it. EV4 prepare Current view gives F, and F differs from A. EV5 click Zoom to layer, prepare, Z; whether Z equals F is RECORDED, never asserted (H3).
//   E-CV-RESIZE  EV6 Clear through the same seam and wait for the refit; prepare gives F'. Shrink the map (`page.setViewportSize`, as layout.mjs does); prepare gives R, and R differs from F'.
// Nothing here is a measurement or a performance claim: the millisecond figures bound waiting. The prepare never executes; no bundle is written.
//
// RECORDED MUTATIONS, each applied alone, the suite run, the failing step recorded by name with the commit, then reverted. NOT YET OBSERVED: the custodian observes them (the e2e runs are the custodian's).
//   E-CV         src/App.tsx, the PublishPanel element: `getViewBox={() => { const b = lastViewportBboxRef.current; return b === null ? viewBox.get() : fromWireBbox(b, null); }}`.
//                Expected: E-CV fails at EV4, F equal to A (a fit that reports only to `onViewShown` leaves the ref at the corner view).
//   E-CV-RESIZE  src/canvas/WorkingCanvas.tsx, the `onResize` handler: remove the `onViewShownRef.current?.(...)` call of the last arm. Expected: E-CV-RESIZE fails, R equal to F'.
//   E-CV-OPEN    src/App.tsx, the PublishPanel element: availability from the old `hasSettledView` signal (a state set by `onViewportChanged` only; `getViewBox={() => (hasSettledView ? viewBox.get() : null)}`).
//                Expected: E-CV-OPEN fails, the Current view radio disabled after the first pixels.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { attachOrLaunch, attachConsole, waitForSettle, canvasRect } from "./lib.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..", "..");
const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

// Harness bounds, not measurements and not claims (ADR-018).
const READY_TIMEOUT_MS = 90_000;
const RESIDENT_TIMEOUT_MS = 60_000;
const SETTLE = { quietMs: 2000, timeoutMs: 45_000 };
const RESIZE_SETTLE_MS = 1500; // a ResizeObserver tick and a React commit after the window changes size
const DIFFERS_FRACTION = 1e-3; // two boxes differ when a side moves by more than this fraction of the larger extent
const FLOOR = { width: 1024, height: 640 }; // layout/layoutConstants.ts's VIEWPORT_FLOOR, restated: the smallest window the layout keeps a usable map in
// The human's Row scope sentence (Amendment 1 item 2 of the form), with its four numbers: xmin, ymin, xmax, ymax.
const ROW_SCOPE = /^row scope: the map's extent when Export interactive map… was clicked \(xmin (\S+), ymin (\S+), xmax (\S+), ymax (\S+)\) — not the whole file$/u;

async function pollUntil(read, predicate, timeoutMs, pollMs = 250) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await read();
    if (predicate(last)) return { ok: true, last };
    await sleep(pollMs);
  }
  return { ok: false, last };
}

const differs = (a, b) => {
  const extent = Math.max(a.xmax - a.xmin, a.ymax - a.ymin);
  return ["xmin", "ymin", "xmax", "ymax"].some((k) => Math.abs(a[k] - b[k]) > DIFFERS_FRACTION * extent);
};
const fmt = (b) => `[${b.xmin}, ${b.ymin}, ${b.xmax}, ${b.ymax}]`;

/** Opens the Export section if it is closed. The Current view radio exists only while it is open. */
const openExportSection = (page) => page.evaluate(() => { const b = document.querySelector(".publish-disclosure"); if (b?.getAttribute("aria-expanded") !== "true") b.click(); });
const residentFeatures = (page) => page.evaluate(async () => (await window.__SPATIAL_E2E__.residentCounts())?.totalResidentFeatures ?? 0);

/** Prepares Current view through the dev destination seam (the host's real prompt), parses the box from the prompt's row scope, and abandons the dialog. */
async function prepareCurrent(page, label) {
  await openExportSection(page);
  const destination = join(REPO_ROOT, "target", "e2e-export-view-out", `${label}-${Date.now()}`, "bundle");
  mkdirSync(dirname(destination), { recursive: true });
  const prepared = await page.evaluate((d) => window.__SPATIAL_E2E__.publishPrepareWithDestination(d, "current"), destination);
  expect(prepared.status === "prompt", `${label}: prepare returned ${JSON.stringify(prepared)}`);
  const m = ROW_SCOPE.exec(prepared.prompt.row_scope);
  expect(m !== null, `${label}: the prompt's row scope is not the human's sentence: ${JSON.stringify(prepared.prompt.row_scope)}`);
  await page.evaluate(() => document.querySelector(".publish-dialog-cancel")?.click());
  const [xmin, ymin, xmax, ymax] = m.slice(1).map(Number);
  expect([xmin, ymin, xmax, ymax].every(Number.isFinite) && xmax > xmin && ymax > ymin, `${label}: the box ${m[0]} is not a box`);
  return { xmin, ymin, xmax, ymax };
}

/** Applies `predicate` (empty clears) through the `queryWithFilter` seam, then waits for the first batch to be resident, and for the render to settle. */
async function applyAndRefit(page, consoleHandle, predicate, label) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.queryWithFilter(p), predicate);
  expect(outcome.kind === "applied", `${label}: queryWithFilter(${JSON.stringify(predicate)}) returned ${JSON.stringify(outcome)}`);
  expect((await pollUntil(() => residentFeatures(page), (n) => n > 0, RESIDENT_TIMEOUT_MS)).ok, `${label}: no feature was resident after the query`);
  await waitForSettle(() => consoleHandle.renderTrace(), SETTLE);
}

/** EV0 and EV1. */
async function stepOpen(page, consoleHandle) {
  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  expect(opened.kind === "admitted", `E-CV-OPEN: openPath returned ${JSON.stringify(opened)}`);
  const drawn = await pollUntil(() => page.evaluate(async () => (await window.__SPATIAL_E2E__.capturePixels([])).nonBackgroundCount), (n) => n > 0, RESIDENT_TIMEOUT_MS);
  expect(drawn.ok, "E-CV-OPEN: no pixel was drawn after the open");
  await waitForSettle(() => consoleHandle.renderTrace(), SETTLE);
  await openExportSection(page);
  const radio = await page.evaluate(() => { const r = document.querySelector('input[name="publish-scope"][value="current"]'); return r === null ? null : { disabled: r.disabled }; });
  expect(radio !== null, "E-CV-OPEN: the Current view radio is absent");
  expect(radio.disabled === false, "E-CV-OPEN: the Current view radio is disabled after the first pixels, before any input");
  return "Current view is available after the first pixels, with no pan or zoom";
}

/** EV2 to EV5. */
async function stepCv(page, consoleHandle) {
  const fit = await prepareCurrent(page, "ev1-fit");
  const rect = await canvasRect(page);
  // A corner view: centred on the fit box's lower-left corner, one zoom level in (2^zoom CSS px per world unit, as computeAuthoritativeViewportBbox reads it).
  const zoom = Math.log2(rect.width / (fit.xmax - fit.xmin)) + 1;
  expect(await page.evaluate(([x, y, z]) => window.__SPATIAL_E2E__.e2eSetViewState(x, y, z), [fit.xmin, fit.ymin, zoom]), "E-CV: e2eSetViewState moved nothing");
  await waitForSettle(() => consoleHandle.renderTrace(), SETTLE);
  const a = await prepareCurrent(page, "ev2-corner");
  expect(differs(a, fit), `E-CV: the corner view ${fmt(a)} equals the fit ${fmt(fit)}; the seam moved the view by nothing`);
  await applyAndRefit(page, consoleHandle, "zone = 'residential'", "E-CV EV3");
  const f = await prepareCurrent(page, "ev4-fit");
  expect(differs(f, a), `E-CV: after the Apply and its fit, Current view still sends the earlier box: F ${fmt(f)} equals A ${fmt(a)}`);
  const zoomed = await page.evaluate(() => { const b = [...document.querySelectorAll("button")].find((x) => x.textContent?.includes("Zoom to layer")); b?.click(); return b !== undefined; });
  expect(zoomed, 'E-CV: the "Zoom to layer" button was not found');
  await waitForSettle(() => consoleHandle.renderTrace(), SETTLE);
  const z = await prepareCurrent(page, "ev5-zoom");
  return `A ${fmt(a)}, F ${fmt(f)}; EV5 (recorded, not asserted): Z ${fmt(z)} ${differs(z, f) ? "differs from" : "equals"} F`;
}

/** EV6 and the shrink. */
async function stepResize(page, consoleHandle) {
  await applyAndRefit(page, consoleHandle, "", "E-CV-RESIZE EV6");
  const before = await prepareCurrent(page, "ev6-refit");
  const inner = await page.evaluate(() => ({ width: window.innerWidth, height: window.innerHeight }));
  const target = { width: Math.max(FLOOR.width, Math.floor(inner.width * 0.85)), height: Math.max(FLOOR.height, Math.floor(inner.height * 0.85)) };
  expect(target.width < inner.width || target.height < inner.height, `E-CV-RESIZE: the window is ${inner.width}x${inner.height}, already at the floor ${FLOOR.width}x${FLOOR.height}; there is nothing to shrink (inconclusive)`);
  const cdp = await page.context().newCDPSession(page);
  try {
    await page.setViewportSize(target);
    await sleep(RESIZE_SETTLE_MS);
    const after = await prepareCurrent(page, "ev6-shrunk");
    expect(differs(after, before), `E-CV-RESIZE: after the map shrank (${inner.width}x${inner.height} to ${target.width}x${target.height}), Current view still sends the earlier box: R ${fmt(after)} equals F' ${fmt(before)}`);
    return `F' ${fmt(before)}, R ${fmt(after)} at ${target.width}x${target.height}`;
  } finally {
    await cdp.send("Emulation.clearDeviceMetricsOverride").catch(() => {});
    await sleep(RESIZE_SETTLE_MS);
  }
}

async function main() {
  if (!existsSync(FIXTURE)) {
    console.error(`export-view: fixture not found: ${FIXTURE}\nRegenerate: cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture`);
    process.exitCode = 1;
    return;
  }
  const hashBefore = sha256(FIXTURE);
  const { browser, page } = await attachOrLaunch();
  const consoleHandle = attachConsole(page);
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
  try {
    const ready = await pollUntil(() => page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false), (ok) => ok === true, READY_TIMEOUT_MS, 300);
    expect(ready.ok, "export-view: window.__SPATIAL_E2E__.openPath never appeared");
    await runStep("E-CV-OPEN", 180_000, () => stepOpen(page, consoleHandle));
    await runStep("E-CV", 300_000, () => stepCv(page, consoleHandle));
    await runStep("E-CV-RESIZE", 300_000, () => stepResize(page, consoleHandle));
    const hashAfter = sha256(FIXTURE);
    results.push({ id: "FIXTURES", status: hashBefore === hashAfter ? "PASS" : "FAIL", note: `filter-zoned.parquet sha256 ${hashBefore} -> ${hashAfter}` });
    if (hashBefore !== hashAfter) process.exitCode = 1;
    console.log(`[export-view] ${results.filter((r) => r.status === "PASS").length} PASS, ${results.filter((r) => r.status === "FAIL").length} FAIL: ${results.map((r) => `${r.id}=${r.status}`).join(" ")}`);
  } catch (e) {
    console.error(`[export-view] harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    consoleHandle.dispose();
    await browser.close().catch(() => {});
    process.exit(process.exitCode ?? 0);
  }
}

await main();
