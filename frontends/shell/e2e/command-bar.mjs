#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- the command bar on real WebView2: E-CTRLK, E-SEARCH, E-HELP, E-BARFOCUS and E-REVEAL (asserted), from
// SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, and E-SLASH, the bare `/` sent by CDP key injection from the map and in the Filter section's input (Amendment 1 item 9; what that injection does not prove is below). Fixture:
// `filter-zoned.parquet`; the suite records its sha256 before and after its run. Nothing here is a measurement or a performance claim.
//
// What CDP key injection proves and does not (section 0.6, H2): `page.keyboard.press` reaches the page's own `keydown` listener; it does NOT cross WebView2's
// accelerator-key layer, so this suite cannot say that a real Ctrl+K gets there. That is the walkthrough's row for it (the human's observation).
//
// MUTATIONS (section 4: every mutation is observed). Written down by the worker; the custodian ran each alone at 7e4ea32a0ccef474b8b05ed582271a4baa24101f and each failed by its named step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md). Each is a replacement of one exact text, found exactly once at the head that adds this file, and each is to be reverted after it is observed:
//   E-CTRLK   frontends/shell/src/layout/StudioLayout.tsx, replace `if (region !== undefined) apply({ kind: "toggle", region });` with `if (region !== undefined) dispatch({ kind: "toggle", region });`
//             (the bar reaches a copy that does not record). Expected: step E-CTRLK fails, "E-CTRLK: 0 layout.toggleLayers rows were recorded, expected exactly 1".
//   E-SEARCH  frontends/shell/src/command/commandDraft.ts, replace `contains(e.label, text) || contains(e.command ?? "", text)` with `contains(e.command ?? "", text)` (search matches words only).
//             Expected: step E-SEARCH fails, "E-SEARCH: the text to lay lists 0 options ([]), expected the one entry Zoom to layer".
//   E-SEARCH-b frontends/shell/src/styles.css, in the `.command-list, .command-note` rule, replace `.command-note {\n  position: fixed;` (two lines, `\n` a newline; found exactly once in that file) with `.command-note {\n  position: static;`
//             (the list is drawn in normal flow). Expected, a prediction until the custodian observes it: step E-SEARCH fails, "E-SEARCH: with the list open, document.elementFromPoint at the first option's centre does not return that option".
//   E-HELP    frontends/shell/src/command/commandDraft.ts, replace `registry.filter((e) => contains(e.label, query) || (e.command !== null && contains(e.command, query)))` with
//             `registry.filter((e) => e.chord !== null && (contains(e.label, query) || (e.command !== null && contains(e.command, query))))` (help leaves out entries with no chord).
//             Expected: step E-HELP fails, "E-HELP: ? lists 4 options, expected 11".
//   E-BARFOCUS frontends/shell/src/command/commandDraft.ts, replace `if (key.shiftKey || state.completed || count === 0) return none;` with `return { pos, effect: none.effect, preventDefault: true };` (Tab is always intercepted; until correction round 1 of PR #233 the guard read `!state.open` in place of `state.completed`).
//             Expected: step E-BARFOCUS fails, "E-BARFOCUS: Tab with no list open left the bar's input holding the focus"; E-CTRLK fails too, on its Tab completion.
//   E-REVEAL  frontends/shell/src/publish/PublishPanel.tsx, replace `reveal() { if (!expanded)` with `reveal() { handlePublishClick(); if (!expanded)` (the panel's click handler is called).
//             Expected: step E-REVEAL fails, either "E-REVEAL: the approval prompt (.publish-dialog) is showing" or, while the host's native picker stands, "E-REVEAL: timed out after 60000ms".
//   E-SLASH   frontends/shell/src/layout/actionRegistry.ts, replace `return event.key === "/" && !isEditable(focus);` with `return event.key === "/";` (an editable focus no longer ignores it).
//             Expected: step E-SLASH fails, "E-SLASH: the focus left the Filter section's input when / was typed in it".
//
// `waitForMountReady`/`withTimeout` are duplicated from `layout.mjs` rather than imported, this workspace's own convention for sibling suites.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT } from "./lib.mjs";
import { loadShellModule } from "./tsModuleLoader.mjs";

const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), "out");
const FIXTURE_FILTER = "C:\\dev\\spatial-ide\\target\\fixtures\\manual-walkthrough\\filter-zoned.parquet";
const REGEN_COMMAND = "cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_filter_fixture -- --ignored --nocapture";
const MOUNT_READY_TIMEOUT_MS = 90_000;
const SETTLE_MS = 250; // a React commit after a key press; not a timing claim
const BAR = ".command-input";

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
      if (await page.evaluate(() => document.querySelector(".app-header") !== null && typeof window.__SPATIAL_E2E__?.openPath === "function")) return Date.now() - start;
    } catch {
      // the page may be mid-navigation; poll again
    }
    await sleep(300);
  }
  throw new Error(`mount-readiness gate: .app-header and window.__SPATIAL_E2E__.openPath not present within ${timeoutMs}ms`);
}

async function press(page, chord) {
  await page.keyboard.press(chord);
  await sleep(SETTLE_MS);
}

/** The bar empty and the focus on the map region, so a step starts with no list open and nothing typed. */
async function resetBar(page) {
  await page.fill(BAR, "");
  await page.focus("#region-map");
  await sleep(SETTLE_MS);
}

const regionHidden = (page, label) => page.evaluate((l) => document.querySelector(`aside[aria-label="${l}"]`)?.hasAttribute("hidden") ?? null, label);
const barFocused = (page) => page.evaluate((selector) => document.activeElement === document.querySelector(selector), BAR);
const canvasSame = (page) => page.evaluate(() => window.__cbCanvas === document.querySelector(".working-canvas") && window.__cbCanvas?.isConnected === true);
const readOptions = (page) =>
  page.evaluate(() =>
    [...document.querySelectorAll(".command-list [role=option]")].map((o) => ({
      word: o.querySelector(".command-option-word")?.textContent ?? "",
      label: o.querySelector(".command-option-label")?.textContent ?? "",
      shortcut: o.querySelector(".command-option-shortcut")?.textContent ?? "",
    }))
  );

/** Activity open and its Console expanded, so the class-C rows are in the DOM. */
async function openConsole(page) {
  if (await page.evaluate(() => document.querySelector('section[aria-label="Activity"]').hasAttribute("hidden"))) await press(page, "Control+KeyJ");
  if ((await page.getAttribute(".console-disclosure", "aria-expanded")) === "false") await page.evaluate(() => document.querySelector(".console-disclosure").click());
  await sleep(SETTLE_MS);
}

/** How many class-C rows carry `statement` (the registry's own text for an action), every coalesced group expanded first. */
async function countRows(page, statement) {
  await openConsole(page);
  for (let i = 0; i < 5; i += 1) {
    const clicked = await page.evaluate(() => {
      const headers = [...document.querySelectorAll('.console-group-header[aria-expanded="false"]')];
      headers.forEach((h) => h.click());
      return headers.length;
    });
    await sleep(SETTLE_MS);
    if (clicked === 0) break;
  }
  return page.evaluate((text) => [...document.querySelectorAll(".console-entry-class-c .console-entry-prose")].filter((p) => p.textContent === text).length, statement);
}

async function stepOpen(page) {
  const outcome = await page.evaluate((p) => window.__SPATIAL_E2E__.openPath(p), FIXTURE_FILTER);
  if (outcome.kind !== "admitted") throw new Error(`OPEN: openPath(filter fixture) returned ${JSON.stringify(outcome)}`);
  await page.waitForSelector(".working-canvas", { timeout: 30_000 });
  await page.click("#inspector-tab-layer"); // an earlier suite (e2e:style) leaves the Style tab selected
  await page.evaluate(() => {
    window.__cbCanvas = document.querySelector(".working-canvas");
  });
  return "admitted; .working-canvas node stored for the identity checks";
}

async function stepCtrlK(page) {
  const { classCRows } = await loadShellModule("src/console/surfaceRegistry.ts");
  const statement = classCRows().find((row) => row.action === "layout.toggleLayers")?.statement;
  if (statement === undefined) throw new Error("E-CTRLK: the surface registry has no class-C row for layout.toggleLayers");
  const activityWasHidden = await page.evaluate(() => document.querySelector('section[aria-label="Activity"]').hasAttribute("hidden"));
  const rowsBefore = await countRows(page, statement);
  const hiddenBefore = await regionHidden(page, "Layers");
  await resetBar(page);
  await press(page, "Control+KeyK");
  if (!(await barFocused(page))) throw new Error("E-CTRLK: Ctrl+K did not focus the bar's input");
  await page.keyboard.type("/lay");
  await press(page, "Tab");
  const completed = await page.inputValue(BAR);
  if (completed !== "/layers") throw new Error(`E-CTRLK: /lay then Tab left ${JSON.stringify(completed)} in the bar, expected "/layers"`);
  await press(page, "Enter");
  const hiddenAfter = await regionHidden(page, "Layers");
  try {
    if (hiddenAfter !== !hiddenBefore) throw new Error(`E-CTRLK: Enter on /layers left the Layers region hidden=${hiddenAfter}, expected ${!hiddenBefore}`);
    const recorded = (await countRows(page, statement)) - rowsBefore;
    if (recorded !== 1) throw new Error(`E-CTRLK: ${recorded} layout.toggleLayers rows were recorded, expected exactly 1`);
    if (!(await canvasSame(page))) throw new Error("E-CTRLK: the stored .working-canvas node is no longer the live, connected one");
  } finally {
    if ((await regionHidden(page, "Layers")) !== hiddenBefore) await press(page, "Control+KeyB");
    if (activityWasHidden) await press(page, "Control+KeyJ");
  }
  return "Ctrl+K focused the bar; /lay, Tab, Enter flipped Layers' hidden; one layout.toggleLayers row; the map node is unchanged";
}

async function stepSearch(page) {
  await resetBar(page);
  await press(page, "Control+KeyK");
  await page.keyboard.type("inspector");
  await sleep(SETTLE_MS);
  const probe = await page.evaluate(() => {
    const option = document.querySelector(".command-list [role=option]");
    if (option === null) return null;
    const box = option.getBoundingClientRect();
    const hit = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
    return { hit: hit !== null && (hit === option || option.contains(hit)), optionTop: box.top, barBottom: document.querySelector("header").getBoundingClientRect().bottom };
  });
  if (probe === null) throw new Error("E-SEARCH: the text inspector lists no option");
  if (!probe.hit) throw new Error("E-SEARCH: with the list open, document.elementFromPoint at the first option's centre does not return that option");
  if (probe.optionTop + 0.5 < probe.barBottom) throw new Error(`E-SEARCH: the first option's top (${probe.optionTop}) is above the top bar's bottom (${probe.barBottom})`);
  const hiddenBefore = await regionHidden(page, "Inspector");
  await press(page, "ArrowDown");
  await press(page, "Enter");
  try {
    if ((await regionHidden(page, "Inspector")) !== !hiddenBefore) throw new Error("E-SEARCH: ArrowDown, Enter on the plain text inspector did not flip the Inspector");
  } finally {
    if ((await regionHidden(page, "Inspector")) !== hiddenBefore) await press(page, "Control+KeyI");
  }
  // A label-only match, in the other letter case: the label Zoom to layer, the word zoom-to-layer.
  await resetBar(page);
  await press(page, "Control+KeyK");
  await page.keyboard.type("TO LAY");
  await sleep(SETTLE_MS);
  const labels = (await readOptions(page)).map((o) => o.label);
  if (labels.length !== 1 || labels[0] !== "Zoom to layer") throw new Error(`E-SEARCH: the text to lay lists ${labels.length} options (${JSON.stringify(labels)}), expected the one entry Zoom to layer`);
  await press(page, "Escape");
  return "the plain text inspector listed its option on top of the map below the top bar, and ArrowDown then Enter flipped the Inspector; a label-only, upper-case text found Zoom to layer";
}

async function stepHelp(page) {
  const { ACTIONS, shortcutLabel, platformOf } = await loadShellModule("src/layout/actionRegistry.ts");
  const platform = platformOf({ platform: await page.evaluate(() => navigator.platform) });
  await resetBar(page);
  await press(page, "Control+KeyK");
  await page.keyboard.type("?");
  await sleep(SETTLE_MS);
  const options = await readOptions(page);
  if (options.length !== ACTIONS.length) throw new Error(`E-HELP: ? lists ${options.length} options, expected ${ACTIONS.length}`);
  const words = options.map((o) => o.word);
  const shortcuts = options.map((o) => o.shortcut);
  for (const entry of ACTIONS) {
    if (entry.command !== null && !words.includes(`/${entry.command}`)) throw new Error(`E-HELP: the word /${entry.command} of ${entry.id} is not listed (${JSON.stringify(words)})`);
    if (entry.chord !== null && !shortcuts.includes(shortcutLabel(entry.chord, platform))) throw new Error(`E-HELP: the chord label ${shortcutLabel(entry.chord, platform)} of ${entry.id} is not listed (${JSON.stringify(shortcuts)})`);
  }
  await press(page, "Escape");
  return `? listed all ${options.length} registry entries, every word and every chord label`;
}

async function stepBarFocus(page) {
  await resetBar(page);
  await press(page, "Control+KeyK");
  const closed = await page.evaluate((selector) => ({ expanded: document.querySelector(selector).getAttribute("aria-expanded"), list: document.querySelector(".command-list") !== null }), BAR);
  if (closed.expanded !== "false" || closed.list) throw new Error(`E-BARFOCUS: focus alone opened the list (${JSON.stringify(closed)})`);
  await press(page, "Tab");
  if (await barFocused(page)) throw new Error("E-BARFOCUS: Tab with no list open left the bar's input holding the focus");
  const next = await page.evaluate(() => document.querySelector("header").contains(document.activeElement));
  if (!next) throw new Error("E-BARFOCUS: Tab from the bar did not move on to the next control in the top bar");
  await press(page, "Control+KeyK");
  await press(page, "Shift+Tab");
  if (await barFocused(page)) throw new Error("E-BARFOCUS: Shift+Tab left the bar's input holding the focus");
  await resetBar(page);
  await press(page, "Control+KeyK");
  await page.keyboard.type("/");
  await sleep(SETTLE_MS);
  if ((await page.getAttribute(BAR, "aria-expanded")) !== "true") throw new Error("E-BARFOCUS: typing / did not open the list");
  await press(page, "Escape");
  if (!(await barFocused(page)) || (await page.getAttribute(BAR, "aria-expanded")) !== "false") throw new Error("E-BARFOCUS: the first Escape did not close the list and keep the focus in the bar");
  await press(page, "Escape");
  const back = await page.evaluate(() => document.activeElement === document.querySelector("#region-map"));
  if (!back) throw new Error("E-BARFOCUS: the second Escape did not return the focus to the element held before (the map region)");
  return "focus alone opened no list; Tab and Shift+Tab left the bar in one press; Escape closed the list, then returned the focus to the map region";
}

async function stepReveal(page, consoleHandle) {
  await waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
  if (!(await regionHidden(page, "Inspector"))) await press(page, "Control+KeyI");
  await page.evaluate(() => document.querySelector("#inspector-tab-style").click()); // so that the bar must also select the Layer tab
  await resetBar(page);
  const run = async () => {
    await press(page, "Control+KeyK");
    await page.keyboard.type("/export");
    await press(page, "Enter");
    await sleep(SETTLE_MS);
    return page.evaluate(() => ({
      inspectorHidden: document.querySelector('aside[aria-label="Inspector"]').hasAttribute("hidden"),
      layerTabHidden: document.querySelector("#inspector-panel-layer").hidden,
      expanded: document.querySelector(".publish-disclosure")?.getAttribute("aria-expanded"),
      onOpen: document.activeElement === document.querySelector(".publish-open"),
      openDisabled: document.querySelector(".publish-open")?.disabled ?? null,
      dialog: document.querySelector(".publish-dialog") !== null,
    }));
  };
  let state = await run();
  for (let waited = 0; state.openDisabled === true && waited < 30_000; waited += 1000) {
    await sleep(1000); // the button is disabled until the map has reported a view; the focus fell to the disclosure meanwhile
    await resetBar(page);
    state = await run();
  }
  try {
    if (state.dialog) throw new Error("E-REVEAL: the approval prompt (.publish-dialog) is showing");
    if (state.inspectorHidden || state.layerTabHidden) throw new Error(`E-REVEAL: /export left the Inspector or its Layer tab hidden (${JSON.stringify(state)})`);
    if (state.expanded !== "true") throw new Error(`E-REVEAL: the Export disclosure is aria-expanded=${state.expanded}, expected "true"`);
    if (!state.onOpen) throw new Error(`E-REVEAL: the focus is not on .publish-open (${JSON.stringify(state)})`);
  } finally {
    if (state.expanded === "true") await page.evaluate(() => document.querySelector(".publish-disclosure").click());
  }
  return "/export opened the Inspector and its Layer tab, expanded Export and focused .publish-open; no approval prompt appeared";
}

async function stepSlash(page) {
  await resetBar(page);
  await press(page, "Slash");
  const fromMap = await page.evaluate((selector) => ({ onBar: document.activeElement === document.querySelector(selector), value: document.querySelector(selector).value }), BAR);
  if (!fromMap.onBar || fromMap.value !== "/") throw new Error(`E-SLASH: / pressed from the map left the bar ${fromMap.onBar ? "focused" : "unfocused"} holding ${JSON.stringify(fromMap.value)}, expected it focused holding "/"`);
  await resetBar(page);
  await page.fill("input.filter-predicate", "");
  try {
    await page.focus("input.filter-predicate");
    await press(page, "Slash");
    const inField = await page.evaluate((selector) => ({ onField: document.activeElement === document.querySelector("input.filter-predicate"), value: document.querySelector("input.filter-predicate").value, bar: document.querySelector(selector).value }), BAR);
    if (!inField.onField) throw new Error("E-SLASH: the focus left the Filter section's input when / was typed in it");
    if (inField.value !== "/") throw new Error(`E-SLASH: / typed in the Filter section's input left it holding ${JSON.stringify(inField.value)}, expected "/"`);
    if (inField.bar !== "") throw new Error(`E-SLASH: / typed in the Filter section's input put ${JSON.stringify(inField.bar)} in the bar`);
  } finally {
    await page.fill("input.filter-predicate", "");
  }
  return "/ pressed from the map focused the bar with / in it; / typed in the Filter section's input stayed there";
}

async function main() {
  if (!existsSync(FIXTURE_FILTER)) {
    console.error(`command-bar: fixture not found: ${FIXTURE_FILTER}\nRegenerate with:\n  ${REGEN_COMMAND}`);
    process.exitCode = 1;
    return;
  }
  const hashBefore = sha256(FIXTURE_FILTER);
  let session;
  try {
    session = await attachOrLaunch();
  } catch (e) {
    console.error(`command-bar: could not attach to or launch the app: ${e.message}`);
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
    console.log(`command-bar: mount-readiness gate passed after ${await waitForMountReady(page)}ms`);
    await runStep("OPEN", 60_000, () => stepOpen(page));
    await runStep("E-CTRLK", 60_000, () => stepCtrlK(page));
    await runStep("E-SEARCH", 60_000, () => stepSearch(page));
    await runStep("E-HELP", 60_000, () => stepHelp(page));
    await runStep("E-BARFOCUS", 60_000, () => stepBarFocus(page));
    await runStep("E-REVEAL", 60_000, () => stepReveal(page, consoleHandle));
    await runStep("E-SLASH", 60_000, () => stepSlash(page));
    const hashAfter = sha256(FIXTURE_FILTER);
    results.push({ id: "FIXTURES", status: hashBefore === hashAfter ? "PASS" : "FAIL", note: `filter-zoned.parquet sha256 ${hashBefore} -> ${hashAfter}` });

    console.log("\n== Summary ==");
    for (const r of results) console.log(`${r.id.padEnd(12)}  ${r.status.padEnd(6)}  ${r.note}`);
    process.exitCode = results.some((r) => r.status === "FAIL") ? 1 : 0;
  } catch (e) {
    console.error(`command-bar: harness failure: ${e.stack ?? e.message}`);
    process.exitCode = 1;
  } finally {
    try {
      mkdirSync(OUT_DIR, { recursive: true });
      writeFileSync(join(OUT_DIR, `command-bar-results-${Date.now()}.json`), JSON.stringify({ results, entries: consoleHandle.entries }, null, 2));
    } catch (e) {
      console.error(`command-bar: failed to write the results ledger: ${e.message}`);
    }
    consoleHandle.dispose();
    await browser.close().catch(() => {}); // disconnect only, never stop the app
    console.log(launched ? `This run launched the app; it stays RUNNING on CDP port ${CDP_PORT}.` : `Attached to an already-running app on CDP port ${CDP_PORT}; leaving it running.`);
    await new Promise((resolve) => process.stdout.write("", resolve));
    process.exit(process.exitCode ?? 0);
  }
}

await main();
