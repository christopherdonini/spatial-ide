#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- the Map Studio frame, on real WebView2: E-KEYS, E-FIELD,
// E-LANDMARKS, E-FOCUS, E-FIT, E-FLOOR and E-REOPEN (asserted) and RESIZEQ (recorded, never asserted), from
// SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md section 4. Fixtures: `filter-zoned.parquet`, plus
// `100k-happy-path.parquet` for the reopen step; the suite records each fixture's sha256 before and
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

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";

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

async function stepResizeQ(page, consoleHandle) {
  const queries = () => consoleHandle.renderTrace().filter((e) => /viewport_query/.test(e.text)).length;
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  const before = queries();
  await press(page, "Control+KeyI");
  await sleep(3000);
  const afterClose = queries();
  await press(page, "Control+KeyI");
  await sleep(3000);
  const afterOpen = queries();
  return `RECORDED, NOT ASSERTED (H1): viewport_query lines within 3 s of Ctrl+I with the pointer still: ${afterClose - before} after closing the Inspector, ${afterOpen - afterClose} after reopening it`;
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
