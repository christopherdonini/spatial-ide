#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E (SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md section 4, PR C): the table in Activity, on real WebView2.
//
//   PC-E1  `filter-zoned.parquet` under `zone = 'residential'`. The first scope ends Completed below the limit: its line says "all N" with N equal to the oracle's count, the grid's row count is N, and every row, read
//          by scrolling the windowed grid through its whole height, shows the zone `residential`, with N distinct ids. The oracle is the generator's printed `zone_counts`
//          (`kernel/tests/manual_walkthrough_fixtures.rs`, `generate_the_filter_fixture`, run by the tester into its own folder, whose file's sha256 equals the shared copy's): give it as
//          SPATIAL_E2E_FILTER_ZONE_COUNTS, the printed array, e.g. `[517, 498, 480, 505]` (ZONE_VALUES order, `residential` first). Without it PC-E1 fails and says so; it is never skipped.
//   PC-E2  O-07 step 6. On `filter-zoned.parquet`, three features are selected with the Select tool (found through `hoverIdAfterBarrier`, as attributes.mjs finds them). The third scope lists the three; the filter
//          `id <> <the third id>` then hides exactly one of them. The second scope lists the other two (the map holds them from streams asked for under that filter) and its line names 2 of 3 selected features; the third scope still lists three.
//   PC-E3  `100k-happy-path.parquet`, no filter. The first scope reaches the limit: its line names the first 1,000 features returned and says more may be there, and the grid holds 1,000 rows.
//   PC-E4  `slow-filter-scan.parquet` with `id > 3999900` applied (the late-matching scan filter-panel.mjs uses), the Table tab shown with the first scope, after the map settles: (1) the liveness line shows, with Cancel;
//          (2) the table's handle is the one the `stream-issued` render-trace line names after the table's class-A `viewport_query` row (bbox null, limit "1000", against the first look's 10000); (3) after Cancel a class-A
//          `cancel` row whose request carries that handle shows, with outcome ok; (4) the liveness line and Cancel are gone, and no further `viewport_query` row with the table's request appears within the settle window.
//          What this does not show: the engine releasing the stream. No SKP reply or operator surface shows that (Amendment 8 item 6); the table's one stream was cancelled through the client, the kernel accepted the cancel,
//          and the table issued no other.
//
// The Table tab, the scope selector, the liveness line and the grid are read from the real DOM. Each fixture's sha256 is read before and after the run and must be equal. No step is designed to reach the
// first scope's held-bytes ceiling (Amendment 7 item 5): a stopped line in any step is a prediction miss. The millisecond numbers below are bounds on waiting, not measurements.
//
// RECORDED MUTATIONS. Each is named for the tester to observe in a run at the PR's head. Apply one alone, run `npm run e2e:table`, record the failing step by name with the commit, and revert it.
//   PC-E1  src/table/tableSource.ts, `start`: `encodeDecU64(BigInt(TABLE_MAX_ROWS)), filter, this.opts.projection` becomes `encodeDecU64(BigInt(TABLE_MAX_ROWS)), null, this.opts.projection` (send `filter: null`).
//          Expected: PC-E1 fails, because the unfiltered first scope reaches the limit and its line is not "all N".
//   PC-E2  src/table/tableScope.ts, `secondScope`: `if (viewFilter === null || sameFilter(member.filter, viewFilter) || residentUnderView.has(id) || (firstForView && first.ids.has(id))) listed.push(id);`
//          becomes `if (true) listed.push(id);` (the second scope equals the third). Expected: PC-E2 fails, because the second scope lists three features where two were expected.
//   PC-E3  src/table/tableSource.ts, `tableLine`, the `completed` case: `n < TABLE_MAX_ROWS` becomes `true`. Expected: PC-E3 fails, because the line at the limit says "Showing all 1000 features".
//   PC-E4  src/table/tableSource.ts, `cancel` (not `end`): delete the line `if (handle !== null) void this.cancelHandle(handle);` that precedes `if (this.phase === "loading") {`. Expected: PC-E4 fails at assertion 3, because no class-A `cancel` row carrying the table's handle shows.
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
const FIXTURE_ZONED = `${FIXTURES}filter-zoned.parquet`;
const FIXTURE_100K = `${FIXTURES}100k-happy-path.parquet`;
const FIXTURE_SLOW = `${FIXTURES}slow-filter-scan.parquet`;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Harness bounds and counts, not measurements and not claims (ADR-018).
const TABLE_SETTLE_MS = 30_000; // how long a first scope may take to reach its line
const CLICK_SETTLE_MS = 400; // a React commit after a click
const NO_FURTHER_QUERY_MS = 3000; // PC-E4: the settle window in which no further table query may appear
const HOVER_ATTEMPTS_MAX = 60; // hovers one search makes, whatever they give
const HOVER_MISSES_MAX = 4; // candidates in a row that answer nothing before a camera search gives up
const TABLE_LIMIT = 1000; // TABLE_MAX_ROWS (src/table/tableConstants.ts), the first scope's limit
const ROW_PX = 24; // TABLE_ROW_HEIGHT_PX
const SLOW_PREDICATE = "id > 3999900"; // 4,000,000 features, the last 100 match (filter-panel.mjs)

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

let hoverCount = 0;
const hoverAt = (page, point, label) => {
  hoverCount += 1;
  return hoverIdAfterBarrier(page, point, label);
};
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

async function openFixture(page, consoleHandle, path, label) {
  const opened = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), path);
  expect(opened.kind === "admitted", `${label}: openPath(${basename(path)}) returned ${JSON.stringify(opened)}`);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 2000, timeoutMs: 45_000 });
}

async function applyFilter(page, consoleHandle, predicate, label) {
  const applied = await page.evaluate((p) => window.__SPATIAL_E2E__.queryWithFilter(p), predicate);
  expect(applied.kind === "applied", `${label}: queryWithFilter(${JSON.stringify(predicate)}) returned ${JSON.stringify(applied)}, expected {kind:"applied"}`);
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
}

/** Opens Activity if it is closed, as an operator does: the top bar's toggle. */
async function openActivity(page) {
  const closed = await page.evaluate(() => document.getElementById("region-activity")?.hasAttribute("hidden") ?? true);
  if (closed) await page.locator('.top-bar-toggle[aria-controls="region-activity"]').click();
}

/** Opens Activity if it is closed and selects the Table tab, as an operator does. */
async function showTable(page) {
  await openActivity(page);
  await page.locator("#activity-tab-table").click();
  await sleep(CLICK_SETTLE_MS);
}

const selectScope = async (page, value) => {
  await page.locator(".table-scope select").selectOption(value);
  await sleep(CLICK_SETTLE_MS);
};

/** The Table tab as an operator sees it. */
const readTable = (page) =>
  page.evaluate(() => {
    const text = (selector) => document.querySelector(selector)?.textContent ?? null;
    const grid = document.querySelector(".table-grid");
    return {
      line: text(".table-line"),
      liveness: text(".table-liveness span"),
      cancelShown: document.querySelector(".table-cancel") !== null,
      note: text(".table-note"),
      rowCount: grid ? Number(grid.getAttribute("aria-rowcount")) - 1 : null,
      scope: document.querySelector(".table-scope select")?.value ?? null,
    };
  });

/** Every row of the grid, read by scrolling its windowed body through the whole height: `{ rows: [[cell, ...]], distinct }`, rows in order. */
const readAllRows = (page) =>
  page.evaluate(
    async ({ rowPx }) => {
      const grid = document.querySelector(".table-grid");
      const total = Number(grid.getAttribute("aria-rowcount")) - 1;
      const frames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const rows = new Map();
      for (let top = 0; top <= total * rowPx; top += rowPx * 8) {
        grid.scrollTop = top;
        await frames();
        for (const row of grid.querySelectorAll('[role="row"]')) {
          const index = Number(row.getAttribute("aria-rowindex")) - 2;
          if (index >= 0) rows.set(index, [...row.querySelectorAll('[role="gridcell"]')].map((cell) => cell.textContent ?? ""));
        }
      }
      grid.scrollTop = 0;
      return { total, rows: [...rows.entries()].sort((a, b) => a[0] - b[0]).map(([, cells]) => cells) };
    },
    { rowPx: ROW_PX }
  );

// ------------------------------------------------------------------------------------------------
// Console rows (class A): read from the rendered Console panel, never from the recorder
// ------------------------------------------------------------------------------------------------

/** Expands the Console panel (while its tab is the selected one) so its entries are in the DOM; they stay there, hidden, when another tab is selected. */
async function exposeConsole(page) {
  await openActivity(page);
  await page.locator("#activity-tab-console").click();
  const expanded = await page.evaluate(() => document.querySelector(".console-disclosure")?.getAttribute("aria-expanded") === "true");
  if (!expanded) await page.locator(".console-disclosure").click();
  await sleep(CLICK_SETTLE_MS);
}

/** Every class-A row now in the DOM, oldest first, after expanding every coalesced group: `{ command, request, outcome }`. */
async function classARows(page) {
  return page.evaluate(async () => {
    const frames = () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click());
    await frames();
    return [...document.querySelectorAll(".console-entry-class-a")].map((el) => {
      const pre = el.querySelector(".console-request-text");
      let request = null;
      try {
        request = pre && !pre.classList.contains("console-request-truncated") ? JSON.parse(pre.textContent ?? "") : null;
      } catch {
        request = null;
      }
      return { command: el.querySelector(".console-entry-header")?.textContent ?? null, request, outcome: el.querySelector(".console-outcome")?.textContent ?? null };
    });
  });
}

const isTableQuery = (row) => row.command === "viewport_query" && row.request !== null && row.request.bbox === null && row.request.limit === String(TABLE_LIMIT);

// ------------------------------------------------------------------------------------------------
// Finding features (attributes.mjs's mechanism: capturePixels pixels, each confirmed through hoverIdAfterBarrier)
// ------------------------------------------------------------------------------------------------

async function* candidatePoints(page) {
  const { candidate, bufferWidth: bw, bufferHeight: bh } = await findInteriorCandidate(page);
  const lattice = [candidate];
  for (const fy of [0.25, 0.5, 0.75]) for (const fx of [0.2, 0.35, 0.5, 0.65, 0.8]) lattice.push({ x: Math.round(fx * bw), y: Math.round(fy * bh) });
  for (let gy = 0; gy < 7; gy += 1) for (let gx = 0; gx < 7; gx += 1) lattice.push({ x: Math.round(((gx + 0.5) / 7) * bw), y: Math.round(((gy + 0.5) / 7) * bh) });
  for (const point of lattice) if ((await verifyInteriorCandidate(page, point, bw, bh)).ok) yield { point, bw, bh };
  const frame = await page.evaluate((r) => window.__SPATIAL_E2E__.capturePixels(r), subdivideRegion({ x: 0, y: 0, w: 1, h: 1 }, 8, 6));
  for (const region of frame.regions) if (region.samplePoint !== null) yield { point: region.samplePoint, bw, bh };
}

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
      const css = { x: Math.round(exact.x), y: Math.round(exact.y) };
      const result = await hoverAt(page, css, label);
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

async function distinctFeatures(page, consoleHandle, label, want) {
  const rect = await canvasRect(page);
  const mid = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  const gave = [];
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES; notch += 1) {
    if (notch > 0) await zoomInOneNotch(page, consoleHandle, mid);
    const { found, refused } = await hoverFeatures(page, `${label} (notch ${notch})`, want);
    if (found.length >= want) return found;
    gave.push(`notch ${notch}: ${found.length}${refused ? ", refused as below the pick resolution" : ""}`);
  }
  throw new Error(`${label}: no camera within ${MAX_ZOOM_NOTCHES} zoom-in notches gave ${want} features with distinct confirmed ids (${gave.join("; ")})`);
}

// ------------------------------------------------------------------------------------------------
// PC-E1
// ------------------------------------------------------------------------------------------------

async function stepZoneComplete(page, consoleHandle) {
  const printed = process.env.SPATIAL_E2E_FILTER_ZONE_COUNTS;
  expect(printed !== undefined && printed !== "", "PC-E1: SPATIAL_E2E_FILTER_ZONE_COUNTS is not set. Give the generator's printed zone_counts (generate_the_filter_fixture), e.g. [517, 498, 480, 505]; the oracle count is not guessed");
  const counts = JSON.parse(printed);
  expect(Array.isArray(counts) && counts.length === 4 && counts.every((n) => Number.isInteger(n) && n > 0), `PC-E1: SPATIAL_E2E_FILTER_ZONE_COUNTS is ${printed}, expected four positive integers`);
  const oracle = counts[0]; // ZONE_VALUES[0] is residential
  expect(oracle < TABLE_LIMIT, `PC-E1: the oracle count ${oracle} is not below the limit ${TABLE_LIMIT}, so the first scope cannot be complete (a class-2 miss of section 3)`);
  await openFixture(page, consoleHandle, FIXTURE_ZONED, "PC-E1");
  await applyFilter(page, consoleHandle, "zone = 'residential'", "PC-E1");
  await showTable(page);
  const done = await pollUntil(() => readTable(page), (t) => t.line !== null && !t.cancelShown, TABLE_SETTLE_MS);
  const t = done.last;
  expect(done.ok, `PC-E1: the first scope did not reach its line: ${JSON.stringify(t)}`);
  expect(t.line === `[P6 placeholder] Showing all ${oracle} features that pass the filter.`, `PC-E1: the line is ${JSON.stringify(t.line)}; the oracle count is ${oracle}`);
  expect(t.rowCount === oracle, `PC-E1: the grid has ${t.rowCount} rows; the oracle count is ${oracle}`);
  const all = await readAllRows(page);
  expect(all.rows.length === oracle, `PC-E1: scrolling the grid read ${all.rows.length} rows of ${all.total}`);
  expect(all.rows.every((cells) => cells.length === 2 && cells[1] === "residential"), `PC-E1: a row does not show zone residential: ${JSON.stringify(all.rows.find((cells) => cells[1] !== "residential"))}`);
  expect(new Set(all.rows.map((cells) => cells[0])).size === oracle, "PC-E1: the rows' ids are not all distinct");
  return `all ${oracle} features under zone = 'residential', every row residential, ${oracle} distinct ids (oracle ${printed})`;
}

// ------------------------------------------------------------------------------------------------
// PC-E2
// ------------------------------------------------------------------------------------------------

async function stepSelectionScopes(page, consoleHandle) {
  await openFixture(page, consoleHandle, FIXTURE_ZONED, "PC-E2");
  await page.locator(".tool-switch-button", { hasText: "Select" }).click();
  const features = await distinctFeatures(page, consoleHandle, "PC-E2", 3);
  const picked = features.slice(0, 3);
  for (const { point } of picked) {
    await page.mouse.click(point.x, point.y);
    await sleep(CLICK_SETTLE_MS);
  }
  const selected = await pollUntil(() => page.evaluate(() => document.querySelector(".feature-selected")?.textContent ?? ""), (text) => /\b3\b/.test(text), 5000);
  expect(selected.ok, `PC-E2: the Feature tab's selected count is ${JSON.stringify(selected.last)}, expected 3 selected`);
  const ids = picked.map((f) => String(f.id));

  await showTable(page);
  await selectScope(page, "selected-ignoring-filter");
  const third = await readAllRows(page);
  expect(JSON.stringify(third.rows.map((cells) => cells[0]).sort()) === JSON.stringify([...ids].sort()), `PC-E2: the third scope lists ${JSON.stringify(third.rows.map((cells) => cells[0]))}, the selected ids are ${JSON.stringify(ids)}`);

  const hidden = ids[2];
  await applyFilter(page, consoleHandle, `id <> ${hidden}`, "PC-E2");
  await selectScope(page, "selected");
  const second = await pollUntil(() => readAllRows(page), (r) => r.rows.length === 2, 10_000);
  const listed = second.last.rows.map((cells) => cells[0]);
  expect(second.ok && !listed.includes(hidden) && ids.slice(0, 2).every((id) => listed.includes(id)), `PC-E2: after id <> ${hidden} hides one, the second scope lists ${JSON.stringify(listed)}; the two that pass are ${JSON.stringify(ids.slice(0, 2))}`);
  const line = (await readTable(page)).line;
  expect(line !== null && line.includes("2 of 3 selected features"), `PC-E2: the second scope's line is ${JSON.stringify(line)}`);
  await selectScope(page, "selected-ignoring-filter");
  const thirdAgain = await readAllRows(page);
  expect(thirdAgain.rows.length === 3, `PC-E2: with the filter in force the third scope lists ${thirdAgain.rows.length} features, expected 3`);
  return `3 selected (${ids.join(", ")}); under id <> ${hidden} the second scope lists ${listed.join(", ")} (${JSON.stringify(line)}) and the third still lists 3`;
}

// ------------------------------------------------------------------------------------------------
// PC-E3
// ------------------------------------------------------------------------------------------------

async function stepLimit(page, consoleHandle) {
  await openFixture(page, consoleHandle, FIXTURE_100K, "PC-E3");
  await showTable(page);
  const done = await pollUntil(() => readTable(page), (t) => t.line !== null && !t.cancelShown, TABLE_SETTLE_MS);
  const t = done.last;
  expect(done.ok, `PC-E3: the first scope did not reach its line: ${JSON.stringify(t)}`);
  expect(/^\[P6 placeholder\] Showing the first 1000 features returned, in no declared order; (more may pass the filter|the file may hold more)\.$/.test(t.line), `PC-E3: the line at the limit is ${JSON.stringify(t.line)}`);
  expect(t.rowCount === TABLE_LIMIT, `PC-E3: the grid has ${t.rowCount} rows, expected ${TABLE_LIMIT}`);
  return `the first scope reached the limit: ${JSON.stringify(t.line)}; ${t.rowCount} rows`;
}

// ------------------------------------------------------------------------------------------------
// PC-E4
// ------------------------------------------------------------------------------------------------

async function stepSlowCancel(page, consoleHandle) {
  await openFixture(page, consoleHandle, FIXTURE_SLOW, "PC-E4");
  await applyFilter(page, consoleHandle, SLOW_PREDICATE, "PC-E4");
  await exposeConsole(page);
  const queriesBefore = (await classARows(page)).filter(isTableQuery).length;
  const traceBefore = consoleHandle.entries.length;
  await showTable(page);

  // 1. The liveness line shows, with Cancel.
  const live = await pollUntil(() => readTable(page), (t) => t.liveness !== null && t.cancelShown, 15_000);
  expect(live.ok, `PC-E4: the liveness line and Cancel did not show: ${JSON.stringify(live.last)}`);
  expect(live.last.liveness.includes("Loading features"), `PC-E4: the liveness line is ${JSON.stringify(live.last.liveness)}`);

  // 2. The table's handle: the one stream-issued line after the table's class-A viewport_query row.
  const rows = await classARows(page);
  const queries = rows.filter(isTableQuery);
  expect(queries.length === queriesBefore + 1, `PC-E4: ${queries.length - queriesBefore} class-A viewport_query rows with bbox null and limit "${TABLE_LIMIT}" appeared when the tab was shown, expected 1`);
  const issued = consoleHandle.entries
    .slice(traceBefore)
    .map((e) => /stream-issued \{dataset: \S+, streamHandle: (\S+)\}/.exec(e.text))
    .filter((m) => m !== null)
    .map((m) => m[1]);
  expect(issued.length === 1, `PC-E4: ${issued.length} stream-issued lines followed the table's query, expected 1: ${JSON.stringify(issued)}`);
  const handle = issued[0];

  // 3. After Cancel, a class-A cancel row carrying that handle shows, with outcome ok.
  const cancelsBefore = rows.filter((r) => r.command === "cancel" && r.request?.handle === handle).length;
  await page.locator(".table-cancel").click();
  const cancelled = await pollUntil(
    async () => (await classARows(page)).filter((r) => r.command === "cancel" && r.request?.handle === handle),
    (found) => found.length === cancelsBefore + 1 && found.at(-1).outcome !== "pending",
    10_000
  );
  expect(cancelled.ok, `PC-E4: no class-A cancel row carrying ${handle} appeared after Cancel (${cancelled.last.length} such rows)`);
  expect(cancelled.last.at(-1).outcome === "ok", `PC-E4: the cancel row's outcome is ${JSON.stringify(cancelled.last.at(-1).outcome)}, expected ok`);

  // 4. The liveness line and Cancel are gone, and the table issues no other query within the settle window.
  const gone = await pollUntil(() => readTable(page), (t) => t.liveness === null && !t.cancelShown, 5000);
  expect(gone.ok, `PC-E4: the liveness line or Cancel is still shown after Cancel: ${JSON.stringify(gone.last)}`);
  await sleep(NO_FURTHER_QUERY_MS);
  const after = (await classARows(page)).filter(isTableQuery).length;
  expect(after === queries.length, `PC-E4: ${after - queries.length} further table viewport_query rows appeared after Cancel`);
  return `the liveness line and Cancel showed; the table's stream ${handle} was cancelled through the client (class-A cancel row ok); the table issued no other query in ${NO_FURTHER_QUERY_MS}ms. The engine releasing the stream is not shown by any operator surface`;
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
  const fixtures = [FIXTURE_ZONED, FIXTURE_100K, FIXTURE_SLOW];
  for (const path of fixtures) {
    if (!existsSync(path)) throw new Error(`table: ${path} is not there; regenerate the manual-walkthrough fixtures (kernel/tests/manual_walkthrough_fixtures.rs, --ignored)`);
  }
  const before = fixtures.map(sha256);
  await runStep("PC-E1", 300_000, () => stepZoneComplete(page, consoleHandle));
  await runStep("PC-E2", 900_000, () => stepSelectionScopes(page, consoleHandle));
  await runStep("PC-E3", 300_000, () => stepLimit(page, consoleHandle));
  await runStep("PC-E4", 300_000, () => stepSlowCancel(page, consoleHandle));
  const after = fixtures.map(sha256);
  const same = before.every((hash, i) => hash === after[i]);
  console.log(`[table] fixtures ${same ? "hash-identical before and after" : "CHANGED during the run"}: ${fixtures.map((p, i) => `${basename(p)} ${before[i].slice(0, 12)}`).join(", ")}`);
  if (!same) process.exitCode = 1;
  console.log(`[table] ${results.filter((r) => r.status === "PASS").length} PASS, ${results.filter((r) => r.status === "FAIL").length} FAIL: ${results.map((r) => `${r.id}=${r.status}`).join(" ")}`);
}

async function main() {
  const { browser, page } = await attachOrLaunch();
  const consoleHandle = attachConsole(page);
  try {
    for (let i = 0; i < 300 && !(await page.evaluate(() => typeof window.__SPATIAL_E2E__?.openPath === "function").catch(() => false)); i += 1) await sleep(300);
    await runSteps(page, consoleHandle).catch((e) => {
      console.error(`[table] harness failure: ${e.stack ?? e.message}`);
      process.exitCode = 1;
    });
  } finally {
    consoleHandle.dispose();
    await browser.close().catch(() => {});
    process.exit(process.exitCode ?? 0);
  }
}

await main();
