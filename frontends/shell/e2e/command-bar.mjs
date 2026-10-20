#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later
// Copyright (C) 2026 Christopher Donini and the Spatial IDE contributors

// E2E TEST SURFACE (e2e/README.md) -- the command bar on real WebView2: E-CTRLK, E-SEARCH, E-HELP, E-BARFOCUS and E-REVEAL (asserted), from
// SHELL-MIGRATION-MILESTONE-3-PREREGISTRATION.md section 4, and E-SLASH, the bare `/` sent by CDP key injection from the map and in the Filter section's input (Amendment 1 item 9; what that injection does not prove is below). PR B adds E-FIELD, E-AND, E-REFUSE, E-TOOLONG, E-ADV, E-PANEL and E-SEL, the filter cards and
// `/filter` (section 4; Amendment 3 item 4(d)): each starts from the Filter section's Clear and sets its own cards through the bar. Fixture:
// `filter-zoned.parquet`; the suite records its sha256 before and after its run. Nothing here is a measurement or a performance claim.
//
// What CDP key injection proves and does not (section 0.6, H2): `page.keyboard.press` reaches the page's own `keydown` listener; it does NOT cross WebView2's
// accelerator-key layer, so this suite cannot say that a real Ctrl+K gets there. That is the walkthrough's row for it (the human's observation).
//
// MUTATIONS (section 4: every mutation is observed). Written down by the worker. Each is a replacement of one exact text, found exactly once at 2fa7c8d09df2e8f21370c1bf68b23213a25615a0, and each is to be reverted after it is observed. The custodian ran all eight alone at that head, and each failed the step its entry names (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md):
//   E-CTRLK   frontends/shell/src/layout/StudioLayout.tsx, replace `if (region !== undefined) apply({ kind: "toggle", region });` with `if (region !== undefined) dispatch({ kind: "toggle", region });`
//             (the bar reaches a copy that does not record). Expected: step E-CTRLK fails, "E-CTRLK: 0 layout.toggleLayers rows were recorded, expected exactly 1".
//   E-SEARCH  frontends/shell/src/command/commandDraft.ts, replace `contains(e.label, text) || contains(e.command ?? "", text)` with `contains(e.command ?? "", text)` (search matches words only).
//             Expected: step E-SEARCH fails, "E-SEARCH: the text to lay lists 0 options ([]), expected the one entry Zoom to layer".
//   E-SEARCH-b frontends/shell/src/styles.css, in the `.command-list, .command-note` rule, replace `.command-note {\n  position: fixed;` (two lines, `\n` a newline; found exactly once in that file) with `.command-note {\n  position: static;`
//             (the list is drawn in normal flow). Predicted: step E-SEARCH fails on its elementFromPoint line. Observed at 621cd1f3: step E-SEARCH fails, "E-SEARCH: the first option's top (18.890625) is above the top bar's bottom (40)", the next assertion (class 2, the form's Amendment 6 item 4); the elementFromPoint line is E-SEARCH-c's.
//   E-SEARCH-c frontends/shell/src/styles.css, replace `.top-bar {\n  grid-area: top;` (two lines, `\n` a newline; found exactly once in that file) with `.top-bar {\n  transform: translateZ(0);\n  grid-area: top;`
//             (the top bar becomes the list's containing block, and with the rule's own `overflow: hidden` it clips the list). Predicted, and observed at 2fa7c8d0: step E-SEARCH fails, "E-SEARCH: with the list open, document.elementFromPoint at the first option's centre does not return that option".
//   E-HELP    frontends/shell/src/command/commandDraft.ts, replace `registry.filter((e) => contains(e.label, query) || (e.command !== null && contains(e.command, query)))` with
//             `registry.filter((e) => e.chord !== null && (contains(e.label, query) || (e.command !== null && contains(e.command, query))))` (help leaves out entries with no chord).
//             Expected: step E-HELP fails, "E-HELP: ? lists 4 options, expected 12".
//   E-BARFOCUS frontends/shell/src/command/commandDraft.ts, replace `if (key.shiftKey || state.completed || count === 0) return none;` with `return { pos, effect: none.effect, preventDefault: true };` (Tab is always intercepted; until correction round 1 of PR #233 the guard read `!state.open` in place of `state.completed`).
//             Expected: step E-BARFOCUS fails, "E-BARFOCUS: Tab with no list open left the bar's input holding the focus"; E-CTRLK fails too, on its Tab completion.
//   E-REVEAL  frontends/shell/src/publish/PublishPanel.tsx, replace `reveal() { if (!expanded)` with `reveal() { handlePublishClick(); if (!expanded)` (the panel's click handler is called).
//             Expected: step E-REVEAL fails, either "E-REVEAL: the approval prompt (.publish-dialog) is showing" or, while the host's native picker stands, "E-REVEAL: timed out after 60000ms".
//             Step E-SLASH fails too, and this is expected (Amendment 8 item 7; the round 2 record, state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md): the handler the mutation calls has opened the host's native picker, which stands
//             over the page while E-SLASH runs, so its first assertion fails with `E-SLASH: / pressed from the map left the bar focused holding "", expected it focused holding "/"`. Two steps fail for this one mutation.
//   E-SLASH   frontends/shell/src/layout/actionRegistry.ts, replace `return event.key === "/" && !isEditable(focus);` with `return event.key === "/";` (an editable focus no longer ignores it).
//             Expected: step E-SLASH fails, "E-SLASH: the focus left the Filter section's input when / was typed in it".
//
// PR B's MUTATIONS (section 4; Amendment 3 item 4(d)). Written down by the worker and not run: the app is the custodian's. Each is a replacement of one exact text, found exactly once at 984d7e34d060af384d59e9abdab0bbb8993876e6, and each is to be reverted after it is observed.
//   E-FIELD   frontends/shell/src/command/fieldCompletion.ts, replace `export const quoteName = (name: string): string => \`"${name.replace(/"/g, '""')}"\`;` with `export const quoteName = (name: string): string => \`${name}\`;` (the name is put in unquoted).
//             Expected: step E-FIELD fails, `E-FIELD: /filter @zo then Tab left "/filter zone" in the bar, expected "/filter \"zone\""`.
//   E-AND     frontends/shell/src/workspace/filterClauses.ts, replace `.join(" AND ")` with `.join(" OR ")` (the cards are joined with OR).
//             Expected: step E-AND fails on its empty-map check, `E-AND: with A and B on the map is NN.NN% non-background, expected it empty (at most 0.2%)`.
//   E-AND-b   frontends/shell/src/App.tsx, replace `if (dataset !== null) stepQueue.enqueue(dataset, { action: "filter.apply", params: { filter } });` with `if (dataset !== null && transition.action === "filter.apply") stepQueue.enqueue(dataset, { action: "filter.apply", params: { filter } });` (a card change records no step).
//             Expected: step E-AND fails on its record_step check, `E-AND: after card B was added the console holds N record_step rows against N + 1, the last carrying the combined text: ...` (N the count before B).
//   E-REFUSE  frontends/shell/src/App.tsx, replace `    try {\n      const outcome = await applyFilterWith(filter, (f) =>` (two lines, `\n` a newline; found exactly once in that file) with `    dispatch({ type: "view.transition", view: current.id, transition: { action: "filter.clauses.set", params: { clauses, step } } });\n    try {\n      const outcome = await applyFilterWith(filter, (f) =>` (the card is added before the outcome).
//             Expected: step E-REFUSE fails, `E-REFUSE: after the refusal the cards read {...}, expected one card "zone" = 'residential', Applied it, and the bar holding /filter "nope" = 1` (the cards read two texts).
//   E-TOOLONG frontends/shell/src/App.tsx, replace `    const { clauses, filter, step } = proposal;\n` (one line and its newline; found exactly once in that file) with `    const { clauses, filter, step } = proposal;\n    if (filter !== null && filter.predicate.length > 4096) return { kind: "not-applied" };\n` (the shell drops a change above 4,096 bytes).
//             Expected: step E-TOOLONG fails, `E-TOOLONG: card B (2102 bytes, 4209 combined) showed {"cleared":false,"code":null,"line":"[P6 placeholder] Not applied. Try again."}, expected the refusal code skp.filter_too_long`.
//   E-ADV     frontends/shell/src/workspace/filterClauses.ts, replace `return recognizeSimple(candidate.text) ? on.find((clause) => !recognizeSimple(clause.text)) : on[0];` with `return on.length < 0 ? on[0] : undefined;` (no change is refused, so the expression is sent).
//             Expected: step E-ADV fails on .filter-active, `E-ADV: .filter-active changed: the cards read {...}, expected card A alone and Applied it`.
//   E-PANEL   frontends/shell/src/workspace/viewTransitions.ts, replace `clauses: [{ id: \`clause-${number}\`, text: filter.predicate, enabled: true }]` with `clauses: [...viewClauses(view), { id: \`clause-${number}\`, text: filter.predicate, enabled: true }]` (the panel's Apply appends a card).
//             Expected: step E-PANEL fails, `E-PANEL: after the panel's Apply there are 3 cards [...], expected exactly 1 holding "zone" <> 'residential'`.
//   E-SEL     frontends/shell/src/workspace/viewTransitions.ts, replace `return { ...view, filter: combineClauses(clauses), clauses, clauseCounter: counter };` with `return { ...view, filter: combineClauses(clauses), clauses, clauseCounter: counter, selection: NO_MEMBERS };` (a card change clears the selection).
//             Expected: step E-SEL fails, `E-SEL: after the card was switched off the selection count is 0, expected 1`.
//
// `waitForMountReady`/`withTimeout` are duplicated from `layout.mjs` rather than imported, this workspace's own convention for sibling suites.

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { attachOrLaunch, attachConsole, waitForSettle, CDP_PORT, bufferPointToCss, canvasRect, findInteriorCandidate, fractionOf, hoverIdAfterBarrier, zoomInOneNotch, MAX_ZOOM_NOTCHES } from "./lib.mjs";
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

// ------------------------------------------------------------------------------------------------
// PR B: the filter cards and /filter (E-FIELD, E-AND, E-REFUSE, E-TOOLONG, E-ADV, E-PANEL, E-SEL).
// ------------------------------------------------------------------------------------------------

const ZONE_A = `"zone" = 'residential'`;
const ZONE_B = `"zone" <> 'residential'`;
const ZONE_AB = `(${ZONE_A}) AND (${ZONE_B})`;
const ADVANCED_TEXT = `"zone" = 'residential' OR "zone" IS NULL`;
const FRACTION_MARGIN = 0.6; // filter.mjs's own margin: a filtered map is under this share of the unfiltered one
const FRACTION_BLANK = 0.002; // filter-panel.mjs's own floor: at or under it the map is effectively blank
const FRACTION_TOLERANCE = 0.02; // filter-panel.mjs's own: the same camera and the same filter, up to readback noise
const KERNEL_FILTER_CEILING_BYTES = 4096; // engine/src/predicate.rs MAX_PREDICATE_BYTES, read here only to size the long cards (the kernel refuses; the shell has no ceiling)

/** `"zone" <operator> ('<prefix>0000', ..., )` with `count` literals: a simple card (an IN list the kernel admits) of about 9 bytes a literal. */
const longList = (operator, prefix, count) => `"zone" ${operator} (${Array.from({ length: count }, (_, i) => `'${prefix}${String(i).padStart(4, "0")}'`).join(", ")})`;

async function waitFor(read, predicate, timeoutMs, pollMs = 200) {
  const start = Date.now();
  let last;
  while (Date.now() - start < timeoutMs) {
    last = await read();
    if (predicate(last)) return { ok: true, last };
    await sleep(pollMs);
  }
  return { ok: false, last };
}

const settleMap = (consoleHandle) => waitForSettle(() => consoleHandle.renderTrace(), { quietMs: 3000, timeoutMs: 45_000 });
const mapFraction = async (page) => fractionOf(await page.evaluate(() => window.__SPATIAL_E2E__.capturePixels()));
/** The cards (texts and switch states), the Filter section's Applied line, and the bar's text. */
const readCards = (page) =>
  page.evaluate((selector) => ({
    texts: [...document.querySelectorAll(".clause-card .clause-text")].map((e) => e.textContent),
    on: [...document.querySelectorAll(".clause-switch")].map((b) => b.getAttribute("aria-checked")),
    applied: document.querySelector(".filter-active")?.textContent ?? null,
    bar: document.querySelector(selector).value,
  }), BAR);

/** Every rendered class-A `record_step` row, oldest first, with every group expanded: its request text and its outcome (recording.mjs reads them the same way). */
async function readRecordStepRows(page) {
  await page.evaluate(() => {
    const panel = document.querySelector(".console-disclosure");
    if (panel && panel.getAttribute("aria-expanded") !== "true") panel.click();
  });
  await page.evaluate(() => document.querySelectorAll('.console-group-header[aria-expanded="false"]').forEach((el) => el.click()));
  return page.evaluate(() =>
    [...document.querySelectorAll(".console-entry-class-a")]
      .filter((el) => el.querySelector(".console-entry-header")?.textContent === "record_step")
      .map((el) => ({ request: el.querySelector(".console-request-text")?.textContent ?? null, outcome: el.querySelector(".console-outcome")?.textContent ?? null }))
  );
}

/** The Filter section's Clear: every card goes. A step starts from here. */
async function clearCards(page, consoleHandle) {
  await page.click("button.filter-clear");
  const gone = await waitFor(() => page.evaluate(() => document.querySelectorAll(".clause-card").length), (n) => n === 0, 30_000);
  if (!gone.ok) throw new Error(`the Filter section's Clear left ${gone.last} cards`);
  await settleMap(consoleHandle);
}

/** `/filter <condition>` typed into the bar (set in one fill: a 2,100-byte text is not typed key by key) and Enter. Answers what the bar then showed: cleared (applied), a refusal code, or the shell's line. */
async function sendCondition(page, condition) {
  await page.focus(BAR);
  await page.fill(BAR, `/filter ${condition}`);
  await sleep(SETTLE_MS);
  await page.keyboard.press("Enter");
  const outcome = await waitFor(
    () => page.evaluate((selector) => ({ cleared: document.querySelector(selector).value === "", code: document.querySelector(".command-result .admission-refusal-code")?.textContent ?? null, line: document.querySelector(".command-note:not(.command-result)")?.textContent ?? null }), BAR),
    (o) => o.cleared || o.code !== null || o.line !== null,
    30_000
  );
  if (!outcome.ok) throw new Error(`/filter ${condition.slice(0, 40)}...: the bar showed neither an applied change nor a refusal nor a line within 30 s`);
  return outcome.last;
}

async function expectApplied(step, page, texts) {
  const read = await waitFor(() => readCards(page), (c) => c.texts.length === texts.length, 30_000);
  const expectedApplied = texts.length === 0 ? null : `Applied: ${texts.length === 1 ? texts[0] : `(${texts.join(") AND (")})`}`;
  if (!read.ok || JSON.stringify(read.last.texts) !== JSON.stringify(texts)) throw new Error(`${step}: the cards read ${JSON.stringify(read.last?.texts)}, expected ${JSON.stringify(texts)}`);
  return { cards: read.last, expectedApplied };
}

async function stepField(page) {
  await resetBar(page);
  await press(page, "Control+KeyK");
  await page.keyboard.type("/filter @zo");
  await sleep(SETTLE_MS);
  const names = await page.evaluate(() => [...document.querySelectorAll(".command-list .command-field-name")].map((e) => e.textContent));
  if (!names.includes("zone")) throw new Error(`E-FIELD: /filter @zo lists the field names ${JSON.stringify(names)}, expected "zone" among them`);
  await press(page, "Tab");
  const value = await page.inputValue(BAR);
  if (value !== `/filter "zone"`) throw new Error(`E-FIELD: /filter @zo then Tab left ${JSON.stringify(value)} in the bar, expected ${JSON.stringify(`/filter "zone"`)}`);
  if (await page.evaluate(() => document.querySelector(".command-list") !== null)) throw new Error("E-FIELD: the list is still open after the completion");
  await resetBar(page);
  return `/filter @zo listed the field names (${names.length}); Tab put "zone" in double-quoted and removed the @; the list closed`;
}

async function stepAnd(page, consoleHandle) {
  await clearCards(page, consoleHandle);
  const unfiltered = await mapFraction(page);
  if (unfiltered <= 0.02) throw new Error(`E-AND: the unfiltered map is ${(unfiltered * 100).toFixed(2)}% non-background; nothing rendered to filter against`);
  const sentA = await sendCondition(page, ZONE_A);
  if (!sentA.cleared) throw new Error(`E-AND: card A was not applied (${JSON.stringify(sentA)})`);
  await expectApplied("E-AND", page, [ZONE_A]);
  await settleMap(consoleHandle);
  const fractionA = await mapFraction(page);
  if (fractionA >= unfiltered * FRACTION_MARGIN || fractionA <= FRACTION_BLANK) throw new Error(`E-AND: card A's map is ${(fractionA * 100).toFixed(2)}% non-background against ${(unfiltered * 100).toFixed(2)}% unfiltered; expected under ${FRACTION_MARGIN * 100}% of it and not blank`);
  const settledRows = await waitFor(() => readRecordStepRows(page), (r) => r.every((row) => row.outcome === "ok"), 30_000);
  if (!settledRows.ok) throw new Error(`E-AND: record_step rows had not all reached ok before card B (${JSON.stringify(settledRows.last?.map((row) => row.outcome))})`);
  const rowsBefore = settledRows.last.length;
  const sentB = await sendCondition(page, ZONE_B);
  if (!sentB.cleared) throw new Error(`E-AND: card B was not applied (${JSON.stringify(sentB)})`);
  const both = await expectApplied("E-AND", page, [ZONE_A, ZONE_B]);
  await settleMap(consoleHandle);
  const fractionAB = await mapFraction(page);
  if (fractionAB > FRACTION_BLANK) throw new Error(`E-AND: with A and B on the map is ${(fractionAB * 100).toFixed(2)}% non-background, expected it empty (at most ${FRACTION_BLANK * 100}%)`);
  if (both.cards.applied !== both.expectedApplied || both.cards.on.join() !== "true,true") throw new Error(`E-AND: .filter-active reads ${JSON.stringify(both.cards.applied)} with the cards ${both.cards.on.join()}, expected ${JSON.stringify(both.expectedApplied)} with true,true`);
  const rows = await waitFor(() => readRecordStepRows(page), (r) => r.length === rowsBefore + 1 && r.every((row) => row.outcome === "ok"), 30_000);
  if (!rows.ok || !rows.last.at(-1)?.request?.includes(JSON.stringify(ZONE_AB).slice(1, -1))) throw new Error(`E-AND: after card B was added the console holds ${rows.last?.length} record_step rows against ${rowsBefore} + 1, the last carrying the combined text: ${rows.last?.at(-1)?.request?.includes(JSON.stringify(ZONE_AB).slice(1, -1))}`);
  await page.click(".clause-card:nth-child(2) .clause-switch");
  const off = await waitFor(() => readCards(page), (c) => c.on.join() === "true,false" && c.applied === `Applied: ${ZONE_A}`, 30_000);
  if (!off.ok) throw new Error(`E-AND: with B switched off the cards read ${JSON.stringify(off.last)}, expected on true,false and Applied: ${ZONE_A}`);
  await settleMap(consoleHandle);
  const fractionOff = await mapFraction(page);
  if (Math.abs(fractionOff - fractionA) > FRACTION_TOLERANCE) throw new Error(`E-AND: with B off the map is ${(fractionOff * 100).toFixed(2)}% non-background, A's was ${(fractionA * 100).toFixed(2)}%: over ${FRACTION_TOLERANCE * 100} points apart`);
  return `A ${(fractionA * 100).toFixed(1)}% non-bg (unfiltered ${(unfiltered * 100).toFixed(1)}%); A and B on: ${(fractionAB * 100).toFixed(2)}%, Applied the exact AND text, one more record_step row reached ok; B off: ${(fractionOff * 100).toFixed(1)}%, Applied A's text`;
}

async function stepRefuse(page, consoleHandle) {
  await clearCards(page, consoleHandle);
  await sendCondition(page, ZONE_A);
  await expectApplied("E-REFUSE", page, [ZONE_A]);
  await settleMap(consoleHandle);
  const before = await mapFraction(page);
  const draft = `/filter "nope" = 1`;
  const refused = await sendCondition(page, `"nope" = 1`);
  if (refused.code !== "skp.filter_unknown_column") throw new Error(`E-REFUSE: the bar showed ${JSON.stringify(refused)}, expected the refusal code skp.filter_unknown_column`);
  const after = await readCards(page);
  if (JSON.stringify(after.texts) !== JSON.stringify([ZONE_A]) || after.applied !== `Applied: ${ZONE_A}` || after.bar !== draft) throw new Error(`E-REFUSE: after the refusal the cards read ${JSON.stringify(after)}, expected one card ${ZONE_A}, Applied it, and the bar holding ${draft}`);
  await settleMap(consoleHandle);
  const fraction = await mapFraction(page);
  if (Math.abs(fraction - before) > FRACTION_TOLERANCE) throw new Error(`E-REFUSE: the map is ${(fraction * 100).toFixed(2)}% non-background after the refusal, ${(before * 100).toFixed(2)}% before: over ${FRACTION_TOLERANCE * 100} points apart`);
  await resetBar(page);
  return `skp.filter_unknown_column shown by name in the bar; the cards and .filter-active unchanged; the map within ${FRACTION_TOLERANCE * 100} points (${(before * 100).toFixed(1)}% -> ${(fraction * 100).toFixed(1)}%)`;
}

async function stepTooLong(page, consoleHandle) {
  const [cardA, cardB] = [longList("IN", "a", 232), longList("NOT IN", "b", 232)];
  const lengths = [cardA.length, cardB.length, `(${cardA}) AND (${cardB})`.length];
  if (!(lengths[0] < KERNEL_FILTER_CEILING_BYTES && lengths[1] < KERNEL_FILTER_CEILING_BYTES && lengths[2] > KERNEL_FILTER_CEILING_BYTES)) throw new Error(`E-TOOLONG: the harness texts are ${lengths.join(", ")} bytes; each card must be under ${KERNEL_FILTER_CEILING_BYTES} and the combination over`);
  await clearCards(page, consoleHandle);
  const sentA = await sendCondition(page, cardA);
  if (!sentA.cleared) throw new Error(`E-TOOLONG: card A (${lengths[0]} bytes) was not admitted (${JSON.stringify(sentA)})`);
  await expectApplied("E-TOOLONG", page, [cardA]);
  const refused = await sendCondition(page, cardB);
  if (refused.code !== "skp.filter_too_long") throw new Error(`E-TOOLONG: card B (${lengths[1]} bytes, ${lengths[2]} combined) showed ${JSON.stringify(refused)}, expected the refusal code skp.filter_too_long`);
  const after = await readCards(page);
  if (JSON.stringify(after.texts) !== JSON.stringify([cardA]) || after.applied !== `Applied: ${cardA}`) throw new Error(`E-TOOLONG: after the refusal the cards read ${after.texts.length} card(s) and Applied ${JSON.stringify(after.applied?.slice(0, 60))}; card A alone was expected`);
  await resetBar(page);
  return `card A (${lengths[0]} bytes) admitted; card B refused skp.filter_too_long by name at ${lengths[2]} combined bytes; A stays`;
}

async function stepAdvanced(page, consoleHandle) {
  await clearCards(page, consoleHandle);
  await sendCondition(page, ZONE_A);
  await expectApplied("E-ADV", page, [ZONE_A]);
  const shown = await sendCondition(page, ADVANCED_TEXT);
  await sleep(SETTLE_MS);
  const after = await readCards(page);
  if (JSON.stringify(after.texts) !== JSON.stringify([ZONE_A]) || after.applied !== `Applied: ${ZONE_A}`) throw new Error(`E-ADV: .filter-active changed: the cards read ${JSON.stringify(after)}, expected card A alone and Applied it`);
  if (shown.cleared || shown.code !== null || shown.line === null || !shown.line.includes("Not applied")) throw new Error(`E-ADV: the bar showed ${JSON.stringify(shown)}, expected the shell's line (Not applied ...) and no refusal`);
  await resetBar(page);
  return "an expression beside a card that is on: the shell's line in the bar, nothing sent; the cards and .filter-active unchanged";
}

async function stepPanel(page, consoleHandle) {
  await clearCards(page, consoleHandle);
  await sendCondition(page, ZONE_A);
  await sendCondition(page, ZONE_B);
  await expectApplied("E-PANEL", page, [ZONE_A, ZONE_B]);
  await page.fill("input.filter-predicate", ZONE_B);
  await page.click("button.filter-apply");
  const one = await waitFor(() => readCards(page), (c) => c.applied === `Applied: ${ZONE_B}`, 30_000);
  if (!one.ok || one.last.texts.length !== 1 || one.last.texts[0] !== ZONE_B) throw new Error(`E-PANEL: after the panel's Apply there are ${one.last?.texts.length} cards ${JSON.stringify(one.last?.texts)}, expected exactly 1 holding ${ZONE_B}`);
  await page.click("button.filter-clear");
  const none = await waitFor(() => readCards(page), (c) => c.texts.length === 0, 30_000);
  if (!none.ok) throw new Error(`E-PANEL: after the panel's Clear there are ${none.last?.texts.length} cards, expected none`);
  await settleMap(consoleHandle);
  return "with two cards, the panel's Apply left exactly one card holding its text; its Clear left none";
}

/**
 * A CSS point of the page on a drawn feature: the interior candidate of the frame, tried in both row orders, taken only when the hover reads a confirmed id there (hoverIdAfterBarrier).
 * When neither order gives one, zoom in one notch at the canvas centre (as buildScene in selection.mjs does) and try a fresh candidate, up to MAX_ZOOM_NOTCHES.
 */
async function findFeaturePoint(page, consoleHandle) {
  const gave = [];
  for (let notch = 0; notch <= MAX_ZOOM_NOTCHES; notch += 1) {
    if (notch > 0) {
      const r = await canvasRect(page);
      await zoomInOneNotch(page, consoleHandle, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    const { candidate, bufferWidth, bufferHeight } = await findInteriorCandidate(page);
    const rect = await canvasRect(page);
    for (const flipY of [true, false]) {
      const exact = bufferPointToCss(candidate, rect, bufferWidth, bufferHeight, flipY);
      const css = { x: Math.round(exact.x), y: Math.round(exact.y) };
      if ((await hoverIdAfterBarrier(page, css, "E-SEL")).ok) return css;
    }
    gave.push(`notch ${notch}: no confirmed id at the interior candidate in either row order`);
  }
  throw new Error(`E-SEL: no point of the map answers the hover with a confirmed feature id (${gave.join("; ")})`);
}

const selectedCount = (page) => page.evaluate(() => Number(/(\d+)\s*$/.exec(document.querySelector(".feature-selected")?.textContent ?? "")?.[1] ?? NaN));

async function stepSelection(page, consoleHandle) {
  await clearCards(page, consoleHandle);
  await sendCondition(page, ZONE_A);
  await expectApplied("E-SEL", page, [ZONE_A]);
  await settleMap(consoleHandle);
  const point = await findFeaturePoint(page, consoleHandle);
  await page.locator(".tool-switch-button", { hasText: "Select" }).click();
  await page.mouse.click(point.x, point.y);
  const one = await waitFor(() => selectedCount(page), (n) => n === 1, 5000);
  if (!one.ok) throw new Error(`E-SEL: a Select click at (${point.x}, ${point.y}) gave a selection count of ${one.last}, expected 1`);
  await page.click(".clause-card .clause-switch");
  const off = await waitFor(() => readCards(page), (c) => c.on.join() === "false", 30_000);
  if (!off.ok) throw new Error(`E-SEL: the card did not switch off: ${JSON.stringify(off.last)}`);
  await settleMap(consoleHandle);
  const kept = await selectedCount(page);
  await page.locator(".tool-switch-button", { hasText: "Navigate" }).click();
  if (kept !== 1) throw new Error(`E-SEL: after the card was switched off the selection count is ${kept}, expected 1`);
  return "one feature selected with a Select click; the card switched off; the count is still 1";
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
    await runStep("E-FIELD", 60_000, () => stepField(page));
    await runStep("E-AND", 240_000, () => stepAnd(page, consoleHandle));
    await runStep("E-REFUSE", 180_000, () => stepRefuse(page, consoleHandle));
    await runStep("E-TOOLONG", 180_000, () => stepTooLong(page, consoleHandle));
    await runStep("E-ADV", 120_000, () => stepAdvanced(page, consoleHandle));
    await runStep("E-PANEL", 120_000, () => stepPanel(page, consoleHandle));
    await runStep("E-SEL", 180_000, () => stepSelection(page, consoleHandle));
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
