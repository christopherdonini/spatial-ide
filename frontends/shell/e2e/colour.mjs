#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PR B): colour by a column, on real WebView2. `filter-zoned.parquet` (2,000 features; `zone` has four values and NULL).
//
//   PB-E1  Colour by `zone` through the Style tab's own controls, at fill opacity 1. The legend lists the zone cases, then No value, then Other. Under one filter per zone (`zone = '<case>'`) and under
//          `zone IS NULL`, the frame's dominant non-background colour is that entry's legend swatch (a per-channel tolerance of 3). `capturePixels` reads frame-wide bins, so one zone is shown at a time.
//   PB-E5  A project saved after the colour by (`e2eSaveProjectToFolder`) holds the match, equal to the style document the page shows, in `workspace.style.layer.fill_color`.
//   PB-E2  Export through the dev seam `publishPrepareWithDestination`, then the bundle. (i) the prompt's `published_columns` is the composer's attributes line; (ii) the open dialog's `.publish-dialog-columns`
//          shows the prompt's value; (iii) the manifest schema's names after `id` and the geometry are `["zone"]`; (iv) `style.json` carries the match the page shows; (v) the viewer's own resolver
//          (`renderer/style-ts`, bundled for node) draws each case in the legend's swatch colour and a NULL in the No value colour. The sub-checks run independently; the failure names the ones that failed.
//   PB-E3  One colour: the style document returns to a literal fill, the legend is gone, and, once a `[render-trace] layers` line has followed the click, the frame's dominant colour is the default fill.
//   PB-E4  Last, because it ends the app: the session history, read after the process tree is stopped, holds a `style.set` of `fillColor` whose value is the match (column, cases, on_null, on_unmatched as
//          the page showed them), its dependencies name `zone` with a type, and the One colour step after it is the literal fill.
//
// The app's store is a scratch `LOCALAPPDATA` (as `recording.mjs`). Each fixture sha256 is read before and after the run and must be equal. Waits are harness bounds on readiness, not measurements.
// What none of this proves: a per-feature colour (the pixel read is the dominant bin of a frame showing one zone), the Other colour on screen, a timing, or the native save dialog.
//
// RECORDED MUTATIONS are placed above the assertion each one fails, by the commit that observes them.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// `LOCALAPPDATA` must be in place before `lib.mjs` reads the environment for the spawn it makes.
const TEMP_BASE = realpathSync.native(tmpdir());
const SCRATCH = mkdtempSync(join(TEMP_BASE, "spatial-colour-"));
process.env.LOCALAPPDATA = SCRATCH;
const STORE_ROOT = join(SCRATCH, "spatial-ide", "sessions");

const { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } = await import("./lib.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "out");
const STYLE_TS = join(HERE, "..", "..", "..", "renderer", "style-ts", "src", "style.ts");
const FIXTURE = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";
const MOUNT_READY_TIMEOUT_MS = 90_000;
const COLUMN = "zone";
const LABEL_NO_VALUE = "[P6 placeholder] No value"; // Legend.tsx's two fixed labels, read from the DOM as shown
const LABEL_OTHER = "[P6 placeholder] Other";
const COLUMNS_LINE = "Columns published: id, the geometry, and zone."; // publish.rs's composer, for one attribute
const DEFAULT_FILL = "#4285f4"; // document.ts's DEFAULT_STYLE_STATE fill colour

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const sha256 = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");
const expect = (condition, message) => {
  if (!condition) throw new Error(message);
};

function withTimeout(promise, ms, stepId) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${stepId}: timed out after ${ms}ms`)), ms);
    Promise.resolve(promise).then(
      (value) => (clearTimeout(timer), resolve(value)),
      (err) => (clearTimeout(timer), reject(err))
    );
  });
}

/** Polls `read` until `predicate` holds; the bound is a readiness gate, and its failure names what was waited for and the last reading. */
async function waitFor(what, read, predicate, timeoutMs, pollMs = 200) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    try {
      last = await read();
      if (predicate(last)) return last;
    } catch (e) {
      last = { readFailed: e.message };
    }
    await sleep(pollMs);
  }
  throw new Error(`waited ${timeoutMs}ms for ${what}; the last reading was ${JSON.stringify(last)}`);
}

async function settle(consoleHandle, what) {
  const outcome = await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 45_000 });
  expect(outcome.settled, `the render trace was not quiet for 2000ms within 45000ms (${what})`);
}

/** The `[render-trace] layers` lines so far: `WorkingCanvas` traces one on every render, coalesced or not (as `style.mjs` reads them). */
const layerLineCount = (consoleHandle) => consoleHandle.renderTrace().filter((e) => e.text.includes("layers")).length;

/** Waits for a `[render-trace] layers` line beyond `sinceCount`, in the shape of `style.mjs`'s `waitForFreshLayerUpdate`: bounded, and a harness bound, not a measurement. A timeout names both counts. */
async function waitForFreshLayerUpdate(consoleHandle, sinceCount, timeoutMs = 10_000) {
  const start = Date.now();
  let last = layerLineCount(consoleHandle);
  while (last <= sinceCount && Date.now() - start < timeoutMs) {
    await sleep(50);
    last = layerLineCount(consoleHandle);
  }
  expect(last > sinceCount, `no fresh [render-trace] layers line within ${timeoutMs}ms (had ${sinceCount} before the click, still ${last})`);
  return last;
}

const readStyleDocument = (page) =>
  page.evaluate(() => {
    const text = document.querySelector("pre.style-document")?.textContent;
    return text ? JSON.parse(text) : null;
  });

/** The legend as an operator sees it: each entry's label and swatch colour, in order. */
const readLegend = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".style-legend-entry")].map((li) => ({
      label: li.querySelector(".style-legend-label")?.textContent ?? null,
      swatch: li.querySelector(".style-legend-swatch")?.style.backgroundColor ?? null,
    }))
  );

/** "rgb(166, 206, 227)" as [166, 206, 227]. */
const rgbOf = (css) => {
  const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(css ?? "");
  expect(m !== null, `a swatch colour reads ${JSON.stringify(css)}, expected rgb(r, g, b)`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
};
const hexOfRgb = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/** The first `topColors` entry that is not the background sample. */
const dominantNonBackground = (summary) => summary.topColors.find((c) => c.rgba !== "0,0,0,0") ?? null;

/** A pixel against a colour, per channel within a tolerance (alpha 255 at opacity 1). */
const sameColour = (rgba, rgb, tolerance = 3) => {
  const got = rgba.split(",").map(Number);
  return got.length === 4 && got[3] === 255 && rgb.every((v, i) => Math.abs(v - got[i]) <= tolerance);
};

const dominantOf = async (page, what) => {
  const summary = await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels());
  const dominant = dominantNonBackground(summary);
  expect(dominant !== null, `${what}: no non-background pixels (topColors ${JSON.stringify(summary.topColors)})`);
  return { dominant, summary };
};

const quote = (value) => `'${value.replaceAll("'", "''")}'`;

async function applyFilter(page, consoleHandle, predicate) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.queryWithFilter(p), predicate);
  expect(outcome.kind === "applied", `queryWithFilter(${JSON.stringify(predicate)}) returned ${JSON.stringify(outcome)}, expected {kind:"applied"}`);
  await settle(consoleHandle, `after the filter ${predicate}`);
}

async function showStyleControls(page) {
  await page.click("#inspector-tab-style");
  const expanded = await page.evaluate(() => document.querySelector(".style-disclosure")?.getAttribute("aria-expanded") === "true");
  if (!expanded) await page.click(".style-disclosure");
  await waitFor("the style controls (.style-fill-opacity)", () => page.evaluate(() => document.querySelector(".style-fill-opacity") !== null), (present) => present, 5_000);
}

// ------------------------------------------------------------------------------------------------
// PB-E1
// ------------------------------------------------------------------------------------------------

async function stepColourByZone(page, consoleHandle, ctx) {
  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE);
  expect(opened.kind === "admitted", `openPath(fixture) returned ${JSON.stringify(opened)}, expected {kind:"admitted"}`);
  await waitFor("the first pixels", () => page.evaluate(async () => (await window.__SPATIAL_E2E__.capturePixels([])).nonBackgroundCount), (n) => n > 0, 60_000, 500);
  await settle(consoleHandle, "after the first look");
  await showStyleControls(page);
  await page.fill("input.style-fill-opacity", "1");
  await waitFor(`the column choice ${COLUMN}`, () => page.evaluate((c) => [...document.querySelectorAll("select.style-colour-column option")].some((o) => o.value === c), COLUMN), (present) => present, 30_000);
  await page.selectOption("select.style-colour-column", COLUMN);
  await page.click("button.style-colour-apply");
  const doc = await waitFor("a style document whose fill_color is a match", () => readStyleDocument(page), (d) => d?.layer?.fill_color?.match !== undefined, 60_000);
  const match = doc.layer.fill_color.match;
  expect(match.column === COLUMN, `the match column reads ${JSON.stringify(match.column)}, expected ${COLUMN}`);
  expect(match.cases.length >= 2, `the match holds ${match.cases.length} cases, expected at least 2`);
  ctx.match = match;
  const legend = await waitFor("the legend entries", () => readLegend(page), (l) => l.length === match.cases.length + 2, 10_000);
  const labels = [...match.cases.map((c) => c.when), LABEL_NO_VALUE, LABEL_OTHER];
  expect(JSON.stringify(legend.map((e) => e.label)) === JSON.stringify(labels), `the legend labels read ${JSON.stringify(legend.map((e) => e.label))}, expected ${JSON.stringify(labels)}`);
  ctx.swatches = legend.map((e) => rgbOf(e.swatch));
  const seen = [];
  const entries = [...match.cases.map((c, i) => ({ name: c.when, predicate: `${COLUMN} = ${quote(c.when)}`, index: i })), { name: "NULL", predicate: `${COLUMN} IS NULL`, index: match.cases.length }];
  for (const entry of entries) {
    await applyFilter(page, consoleHandle, entry.predicate);
    const { dominant } = await dominantOf(page, `under ${entry.predicate}`);
    const want = ctx.swatches[entry.index];
    // RECORDED MUTATION M-PB-E1, applied alone: in `rowGroups` (src/canvas/matchGroups.ts) a NULL value takes `style.unmatchedGroup()`, the Other group, in place of the No value group.
    // Expected failure: under the NULL filter the dominant colour is the Other swatch's, not the No value swatch's.
    // OBSERVED AT dfb96279f7531b27a29827be0e6bd0bf630bc9b5: FAILED -- "PB-E1: under zone IS NULL the dominant colour is 97,97,97,255, expected the No value swatch 158,158,158,255". Reverted after observing.
    expect(sameColour(dominant.rgba, want), `under ${entry.predicate} the dominant colour is ${dominant.rgba}, expected the ${entry.name === "NULL" ? "No value" : entry.name} swatch ${want.join(",")},255`);
    seen.push(`${entry.name} ${dominant.rgba}`);
  }
  await applyFilter(page, consoleHandle, "");
  return `coloured by ${COLUMN} through the Style tab (${match.cases.length} cases); legend ${labels.join(" | ")}; the dominant colour under each filter equals its swatch: ${seen.join("; ")}`;
}

// ------------------------------------------------------------------------------------------------
// PB-E5
// ------------------------------------------------------------------------------------------------

async function stepSaveProject(page, ctx) {
  expect(ctx.match !== undefined, "no colour by was applied (PB-E1 did not reach its apply)");
  const folder = mkdtempSync(join(TEMP_BASE, "spatial-colour-save-"));
  ctx.folders.push(folder);
  const answer = await withTimeout(page.evaluate((f) => window.__SPATIAL_E2E__.e2eSaveProjectToFolder(f), folder), 60_000, "e2eSaveProjectToFolder");
  expect(answer === "asked", `e2eSaveProjectToFolder answered ${JSON.stringify(answer)}, expected "asked"`);
  const names = readdirSync(folder);
  expect(names.includes("project.spatial"), `the folder lists ${JSON.stringify(names)}, with no project.spatial`);
  const fill = JSON.parse(readFileSync(join(folder, "project.spatial"), "utf8")).workspace?.style?.layer?.fill_color;
  // RECORDED MUTATION M-PB-E5, applied alone: in `workspaceOf` (src/project/saveProject.ts) the saved style is `toStyleDocument({ ...input.style, fillMatch: null })`.
  // Expected failure: the saved file's fill_color is a literal, not the match.
  // OBSERVED AT dfb96279f7531b27a29827be0e6bd0bf630bc9b5: FAILED -- "PB-E5: the file's fill_color reads {"literal":"#4285f4"}, expected the match". Reverted after observing.
  expect(fill?.match !== undefined, `the file's fill_color reads ${JSON.stringify(fill)}, expected the match`);
  expect(JSON.stringify(fill.match) === JSON.stringify(ctx.match), `the file's match reads ${JSON.stringify(fill.match)}, expected the page's ${JSON.stringify(ctx.match)}`);
  return `the saved project.spatial holds the match on ${fill.match.column} with ${fill.match.cases.length} cases, equal to the page's style document`;
}

// ------------------------------------------------------------------------------------------------
// PB-E2
// ------------------------------------------------------------------------------------------------

/** The viewer's resolver (`renderer/style-ts/src/style.ts`), bundled in memory and imported as a module. */
async function loadViewerStyle() {
  const { build } = await import("esbuild");
  const built = await build({ entryPoints: [STYLE_TS], bundle: true, format: "esm", platform: "node", write: false, logLevel: "silent" });
  const mod = await import(`data:text/javascript;base64,${Buffer.from(built.outputFiles[0].text).toString("base64")}`);
  return mod.Style;
}

async function stepExportBundle(page, consoleHandle, ctx) {
  expect(ctx.match !== undefined && ctx.swatches !== undefined, "no colour by was applied (PB-E1 did not reach its apply)");
  await settle(consoleHandle, "before the export");
  await waitFor("the publishPrepareWithDestination hook", () => page.evaluate(() => typeof window.__SPATIAL_E2E__?.publishPrepareWithDestination), (t) => t === "function", 20_000);
  await page.evaluate(() => {
    const button = document.querySelector(".publish-disclosure");
    if (button && button.getAttribute("aria-expanded") !== "true") button.click();
  });
  const parent = mkdtempSync(join(TEMP_BASE, "spatial-colour-bundle-"));
  ctx.folders.push(parent);
  const destination = join(parent, "bundle");
  const prepared = await page.evaluate((d) => window.__SPATIAL_E2E__.publishPrepareWithDestination(d, "whole"), destination);
  expect(prepared.status === "prompt", `prepare returned ${JSON.stringify(prepared)}, expected {status:"prompt"}`);
  const { prompt } = prepared;
  const checks = [];
  const check = async (id, run) => {
    try {
      checks.push({ id, ok: true, detail: await run() });
    } catch (e) {
      checks.push({ id, ok: false, detail: e.message });
    }
  };
  // RECORDED MUTATION M-PB-E2c, applied alone: in `prepare_with_query` (src-tauri/src/publish.rs) `published_columns` is composed from `&[]` in place of `&attributes`; the shell exe is rebuilt with it and rebuilt again after the revert.
  // Expected failure: (i) alone: the prompt's line names the id and the geometry only; (ii) to (v) pass.
  // OBSERVED AT dfb96279f7531b27a29827be0e6bd0bf630bc9b5: FAILED -- "PB-E2: (i) FAILED: published_columns is "Columns published: id and the geometry only.", expected "Columns published: id, the geometry, and zone." ; passed: (ii) (iii) (iv) (v)". Reverted after observing.
  await check("(i)", () => {
    expect(prompt.published_columns === COLUMNS_LINE, `published_columns is ${JSON.stringify(prompt.published_columns)}, expected ${JSON.stringify(COLUMNS_LINE)}`);
    return "the prompt names zone";
  });
  await check("(ii)", async () => {
    const shown = await waitFor("the open dialog's .publish-dialog-columns", () => page.evaluate(() => document.querySelector(".publish-dialog-columns")?.textContent ?? null), (t) => t !== null, 20_000);
    expect(shown === prompt.published_columns, `.publish-dialog-columns reads ${JSON.stringify(shown)}, the prompt carried ${JSON.stringify(prompt.published_columns)}`);
    return "the dialog shows the prompt's line";
  });
  const phrase = basename(prompt.destination_display);
  await waitFor("the publishExecute hook", () => page.evaluate(() => typeof window.__SPATIAL_E2E__?.publishExecute), (t) => t === "function", 20_000);
  const executed = await page.evaluate((p) => window.__SPATIAL_E2E__.publishExecute(p), phrase);
  expect(executed.status === "success", `execute returned ${JSON.stringify(executed)}, expected {status:"success"}`);
  const bundle = executed.bundle_path;
  await check("(iii)", () => {
    const schema = JSON.parse(readFileSync(join(bundle, "manifest.json"), "utf8")).schema;
    expect(Array.isArray(schema) && schema[0]?.name === "id", `manifest schema reads ${JSON.stringify(schema)}, expected id first`);
    const rest = schema.slice(2).map((s) => s.name);
    expect(JSON.stringify(rest) === JSON.stringify([COLUMN]), `manifest schema names after the first two read ${JSON.stringify(rest)}, expected ${JSON.stringify([COLUMN])}`);
    return "the manifest publishes zone";
  });
  const styleText = readFileSync(join(bundle, "style.json"), "utf8");
  // RECORDED MUTATION M-PB-E2, applied alone: in `runPrepareWithDestination` (src/publish/PublishPanel.tsx) the style document sent to the prepare is `toStyleDocument({ ...style, fillMatch: null })`.
  // Expected failure: (iv) fails: style.json holds the literal; the published columns follow the document, so (i), (iii) and (v) fail with it and (ii) passes.
  // OBSERVED AT dfb96279f7531b27a29827be0e6bd0bf630bc9b5: FAILED -- "PB-E2: (i) FAILED: published_columns is "Columns published: id and the geometry only.", expected "Columns published: id, the geometry, and zone." | (iii) FAILED: manifest schema names after the first two read [], expected ["zone"] | (iv) FAILED: style.json fill_color reads {"literal":"#4285f4"}, expected the match | (v) FAILED: the viewer draws ["#4285f4","#4285f4","#4285f4","#4285f4","#4285f4"], the legend's swatches are ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#9e9e9e"] ; passed: (ii)". Reverted after observing.
  await check("(iv)", () => {
    const match = JSON.parse(styleText).layer?.fill_color?.match;
    expect(match !== undefined, `style.json fill_color reads ${JSON.stringify(JSON.parse(styleText).layer?.fill_color)}, expected the match`);
    expect(JSON.stringify(match) === JSON.stringify(ctx.match), `style.json's match reads ${JSON.stringify(match)}, expected the page's ${JSON.stringify(ctx.match)}`);
    return "style.json carries the match";
  });
  await check("(v)", async () => {
    const Style = await loadViewerStyle();
    const style = Style.parse(styleText, join(bundle, "style.json"));
    const drawn = [...ctx.match.cases.map((c) => style.resolve(c.when).fillColor), style.resolve(null).fillColor];
    const want = ctx.swatches.slice(0, ctx.match.cases.length + 1).map(hexOfRgb);
    expect(JSON.stringify(drawn) === JSON.stringify(want), `the viewer draws ${JSON.stringify(drawn)}, the legend's swatches are ${JSON.stringify(want)}`);
    return "the viewer draws the legend's colours";
  });
  const failed = checks.filter((c) => !c.ok);
  expect(failed.length === 0, `${failed.map((c) => `${c.id} FAILED: ${c.detail}`).join(" | ")} ; passed: ${checks.filter((c) => c.ok).map((c) => c.id).join(" ") || "none"}`);
  return `bundle ${bundle}; ${checks.map((c) => `${c.id} ${c.detail}`).join("; ")}`;
}

// ------------------------------------------------------------------------------------------------
// PB-E3
// ------------------------------------------------------------------------------------------------

async function stepOneColour(page, consoleHandle) {
  await showStyleControls(page);
  const layersBefore = layerLineCount(consoleHandle);
  await page.click("button.style-one-colour");
  // RECORDED MUTATION M-PB-E3, applied alone: in `handleOneColour` (src/style/StylePanel.tsx) the next style keeps its match (`{ ...style }` in place of `{ ...style, fillMatch: null }`).
  // Expected failure: the style document keeps its match, so the wait for a literal fill_color times out.
  // OBSERVED AT dfb96279f7531b27a29827be0e6bd0bf630bc9b5: FAILED -- "PB-E3: waited 15000ms for a style document whose fill_color is a literal; the last reading was {"style_version":1,"layer":{"geometry":"polygon","fill_color":{"match":{"column":"zone","cases":[{"when":"agricultural","then":"#a6cee3"},{"when":"civic","then":"#1f78b4"},{"when":"industrial","then":"#b2df8a"},{"when":"residential","then":"#33a02c"}],"on_null":"#9e9e9e","on_unmatched":"#616161"}},"fill_opacity":{"literal":1},"outline_color":{"literal":"#000000"},"outline_width":{"literal":0}}}". Reverted after observing. The same mutation also failed PB-E4 in that run: OBSERVED AT dfb96279f7531b27a29827be0e6bd0bf630bc9b5: FAILED -- "PB-E4: the history holds 1 fillColor steps, expected 2 (the colour by, then One colour): [{"action":"style.set","params":{"property":"fillColor","value":{"match":{"column":"zone","cases":[{"when":"agricultural","then":"#a6cee3"},{"when":"civic","then":"#1f78b4"},{"when":"industrial","then":"#b2df8a"" (the line cut at 300 bytes).
  const doc = await waitFor("a style document whose fill_color is a literal", () => readStyleDocument(page), (d) => d?.layer?.fill_color?.literal !== undefined, 15_000);
  expect(doc.layer.fill_color.literal === DEFAULT_FILL, `fill_color reads ${JSON.stringify(doc.layer.fill_color)}, expected the literal ${DEFAULT_FILL}`);
  const legend = await readLegend(page);
  expect(legend.length === 0, `the legend still lists ${legend.length} entries after One colour`);
  const disabled = await page.evaluate(() => document.querySelector("button.style-one-colour")?.disabled === true);
  expect(disabled, "the One colour button is still enabled");
  await settle(consoleHandle, "after One colour");
  const layersAfter = await waitForFreshLayerUpdate(consoleHandle, layersBefore);
  const { dominant } = await dominantOf(page, "after One colour");
  expect(sameColour(dominant.rgba, hexToRgb(DEFAULT_FILL)), `the dominant colour is ${dominant.rgba}, expected ${DEFAULT_FILL} at opacity 1`);
  return `fill_color is the literal ${DEFAULT_FILL}; no legend; the layers lines went from ${layersBefore} to ${layersAfter} after the click; the dominant colour is ${dominant.rgba}`;
}

// ------------------------------------------------------------------------------------------------
// PB-E4
// ------------------------------------------------------------------------------------------------

/** Every rendered `record_step` row's outcome, the console group expanded. */
async function readRecordStepRows(page) {
  await page.evaluate(() => {
    const panel = document.querySelector(".console-disclosure");
    if (panel && panel.getAttribute("aria-expanded") !== "true") panel.click();
    document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click());
  });
  return page.evaluate(() =>
    [...document.querySelectorAll(".console-entry-class-a")]
      .filter((el) => el.querySelector(".console-entry-header")?.textContent === "record_step")
      .map((el) => el.querySelector(".console-outcome")?.textContent ?? null)
  );
}

async function stepHistory(page, session, ctx) {
  expect(ctx.match !== undefined, "no colour by was applied (PB-E1 did not reach its apply)");
  let previous = -1;
  await waitFor("every record_step row ok and their count unchanged across a poll", async () => {
    const rows = await readRecordStepRows(page);
    const settled = rows.length === previous && rows.length > 0 && rows.every((o) => o === "ok");
    previous = rows.length;
    return settled;
  }, (settled) => settled === true, 30_000, 1_500);
  await session.stop();
  // The operating system frees the kernel's lock when its holder ends; the history reads once it has.
  const text = await waitFor(
    "a readable history.jsonl in the one store folder",
    () => {
      const dirs = existsSync(STORE_ROOT) ? readdirSync(STORE_ROOT) : [];
      return dirs.length === 1 ? readFileSync(join(STORE_ROOT, dirs[0], "history.jsonl"), "utf8") : null;
    },
    (t) => t !== null,
    30_000,
    500
  );
  const steps = text.split("\n").filter((line) => line.length > 0).map((line) => JSON.parse(line)).filter((row) => row.step !== undefined).map((row) => row.step);
  const fills = steps.filter((s) => s.intent.action === "style.set" && s.intent.params.property === "fillColor");
  expect(fills.length === 2, `the history holds ${fills.length} fillColor steps, expected 2 (the colour by, then One colour): ${JSON.stringify(fills.map((s) => s.intent))}`);
  const [colourBy, oneColour] = fills;
  const value = colourBy.intent.params.value;
  // RECORDED MUTATION M-PB-E4, applied alone: in `handleStyleCommit` (src/App.tsx) a `fillColor` transition is enqueued to the recorder with `next.fillColor` as its value, so the recorder is sent the literal.
  // Expected failure: the colour by step's value is the literal, not the match.
  // OBSERVED AT dfb96279f7531b27a29827be0e6bd0bf630bc9b5: FAILED -- "PB-E4: the colour by step's value reads "#4285f4", expected the match". Reverted after observing.
  expect(typeof value === "object" && value !== null && value.match !== undefined, `the colour by step's value reads ${JSON.stringify(value)}, expected the match`);
  expect(JSON.stringify(value.match) === JSON.stringify(ctx.match), `the recorded match reads ${JSON.stringify(value.match)}, expected the page's ${JSON.stringify(ctx.match)}`);
  const field = (colourBy.dependencies?.fields ?? []).find((f) => f.name === COLUMN);
  expect(field !== undefined && typeof field.type === "string" && field.type.length > 0, `the colour by step's dependencies read ${JSON.stringify(colourBy.dependencies)}, expected ${COLUMN} with a type`);
  expect(oneColour.intent.params.value === DEFAULT_FILL, `the One colour step's value reads ${JSON.stringify(oneColour.intent.params.value)}, expected the literal ${DEFAULT_FILL}`);
  expect(steps.indexOf(oneColour) === steps.length - 1 && steps.indexOf(colourBy) < steps.indexOf(oneColour), "the One colour step is not the history's last step, after the colour by");
  return `${steps.length} steps; the colour by step records the match on ${COLUMN} (${value.match.cases.length} cases) with the dependency ${field.name}: ${field.type}; the One colour step after it is the literal ${DEFAULT_FILL}`;
}

// ------------------------------------------------------------------------------------------------

function dropFolders(folders) {
  for (const path of [...folders, SCRATCH]) {
    try {
      rmSync(path, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
    } catch (e) {
      console.error(`colour: could not remove ${path}: ${e.message}`);
    }
  }
}

async function main() {
  const ctx = { folders: [] };
  if (!existsSync(FIXTURE)) {
    console.error(`colour: fixture missing: ${FIXTURE}\nRegenerate with: ${REGEN_COMMAND}`);
    process.exitCode = 1;
    dropFolders(ctx.folders);
    return;
  }
  const hashBefore = sha256(FIXTURE);
  console.log(`colour: fixture sha256 ${hashBefore}; the store for this run is ${STORE_ROOT} (LOCALAPPDATA=${SCRATCH})`);
  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`colour: could not attach to or launch the app: ${e.message}`);
    process.exitCode = 1;
    dropFolders(ctx.folders);
    return;
  }
  const { page, launched } = session;
  if (!launched) {
    console.error(`colour: an app is already listening on CDP port ${CDP_PORT}, started with another LOCALAPPDATA; stop it (and its process tree) and run again.`);
    await session.browser.close().catch(() => {});
    process.exitCode = 1;
    dropFolders(ctx.folders);
    return;
  }
  const consoleHandle = attachConsole(page);
  const results = [];

  async function runStep(id, timeoutMs, fn) {
    const startedAt = Date.now();
    try {
      const note = await withTimeout(Promise.resolve().then(fn), timeoutMs, id);
      results.push({ id, status: "PASS", note });
      console.log(`[${id}] PASS (${Date.now() - startedAt}ms): ${note}`);
    } catch (e) {
      const note = `${id}: ${e?.message ?? String(e)}`;
      results.push({ id, status: "FAIL", note });
      console.error(`[${id}] FAIL (${Date.now() - startedAt}ms): ${note}`);
    }
  }

  try {
    console.log(`colour: waiting for the app to mount (up to ${MOUNT_READY_TIMEOUT_MS}ms)...`);
    await waitFor(
      "the app header and the openPath hook",
      () => page.evaluate(() => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function"),
      (ready) => ready === true,
      MOUNT_READY_TIMEOUT_MS,
      300
    );
    // The steps are independent once PB-E1 has set `ctx`; PB-E4 is last because it stops the app.
    await runStep("PB-E1", 300_000, () => stepColourByZone(page, consoleHandle, ctx));
    await runStep("PB-E5", 120_000, () => stepSaveProject(page, ctx));
    await runStep("PB-E2", 240_000, () => stepExportBundle(page, consoleHandle, ctx));
    await runStep("PB-E3", 120_000, () => stepOneColour(page, consoleHandle));
    await runStep("PB-E4", 180_000, () => stepHistory(page, session, ctx));

    const hashAfter = sha256(FIXTURE);
    console.log(`colour: fixture sha256 after ${hashAfter}${hashAfter === hashBefore ? " (unchanged)" : " (CHANGED)"}`);
    console.log("");
    console.log("== Summary ==");
    for (const r of results) console.log(`${r.id}  ${r.status.padEnd(6)}  ${r.note}`);
    process.exitCode = results.some((r) => r.status === "FAIL") || hashAfter !== hashBefore ? 1 : 0;
  } catch (e) {
    console.error(`colour: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      const ledgerPath = join(OUT_DIR, `colour-console-ledger-${Date.now()}.json`);
      writeFileSync(ledgerPath, JSON.stringify({ allConsoleEntries: consoleHandle.entries }, null, 2));
      console.log(`Full console ledger: ${ledgerPath}`);
    } catch (e) {
      console.error(`colour: failed to write the ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    await session.stop().catch(() => {});
    dropFolders(ctx.folders);
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
