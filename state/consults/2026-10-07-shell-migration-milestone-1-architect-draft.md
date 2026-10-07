*Custodian's filing note (2026-10-07): the architect's draft of `shell-migration-milestone-1`'s preregistration, on the custodian's brief at main 30e77c10, drafted alone. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is c6c1fd85e55198189a5b2160c69966fe3e1b05403e2fcb325a4f87cfdd350ad6. Write audit PASS: zero write calls (Read 50, Grep 59, Glob 9, SubagentHandback 1). Run window from the transcript: 2026-10-07T19:35:13.756Z to 2026-10-07T19:54:40.098Z. The form as committed, `frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md`, is part 2's block with its 69 pins computed at 30e77c10. Two mechanical changes make every pin a rooted, single-span reference: 37 pins written as a bare file name, or as a continuation (":N" after an earlier path), are rewritten with their full repository path, each resolved by script and its span read back; and one cell that gave four styles.css spans a single shared hash is written as four pins. Nothing else changed. The pins in parts 1 and 3 below are left as returned.*

---

Reviewed: main @ 30e77c10

(I read the working tree. The session's git status gives it as main @ 30e77c10, clean apart from two untracked files. I have no shell, so I ran no git command, and the custodian computes every HASH-TBD.)

## 1. The form, and why

**Full form, with full two-agent gating.** Four reasons:
- **Size.** By §21c's counting, tests included, the piece is about 3,250 changed lines over 25 code and test files. That is far past 150 lines and 8 files.
- **New user-visible behaviour.** This is one of §21c's four bounds.
- **A property currently under test.** §21a counts this as a guarantee category. The e2e step that checks `.describe-summary` is absent after a refusal is one example. ADR-021's filter-panel liveness obligation is another, which this piece keeps.
- **§25(e).** The Out-of-scope line could not claim that no §21a category is touched.

No ADR, security-posture or wire category is touched.

**Size against the plan.** The plan's §5.5 estimated at most 1,500 lines over about 25 files. My figure is about twice that. Group by group, the extra comes from:
- the App.tsx return block: deletions count, and its blocks carry long comments;
- `styles.css`: its old-layout measurement comments must be marked as history;
- an App-level render test that has to copy the existing WebGL-boundary mocks;
- a new e2e suite that needs its own launch boilerplate.

The plan named its figure as an estimate for the form to declare, so this goes to the human as OPEN-5. It is not a block.

**What is the human's:**
- the seven OPEN items below;
- every new string and the banner colours, at P6;
- the felt verdict at 1366 × 768;
- the wording of KNOWN-LIMITATIONS 18's retirement and of any new KNOWN-LIMITATIONS line;
- the merge click.

**Plan conflicts I found.** In each case the constitution wins over the plan:
- **Scan liveness.** §5.2 moves scan liveness to the status bar. ADR-021's binding acceptance condition requires the filter panel to show liveness and Cancel. Liveness stays in FilterPanel, and a status-bar mirror goes to the human as OPEN-6.
- **DescribeSummary.** It is rendered inside AdmissionPanel from AdmissionPanel's own state, not from App's. So it cannot reach the Inspector without editing AdmissionPanel. Doing so turns into §2 rule 3 against §5.2's "none" and §5.6's selector-only limit. That is OPEN-1.
- **Action registry.** Two of §5.3's registry entries, open dataset and export, would have no product caller in this milestone (the caller rule). That is OPEN-2.
- **Console rows.** docs/01 principle 4 and the console registry's precedent require class-C console rows for the new layout actions. This is drafted as a derived requirement, not as an OPEN item.

No ADR is needed. Layout state is session-only and keeps no durable format.

## 2. The draft

````markdown
# Shell migration, milestone 1 — the frame: Map Studio regions, panel toggles, separated sections, an attention strip and a status bar
# (PLAN node shell-migration-milestone-1)

File: frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md
Authority: the RULED 2026-10-07 block for the migration plan's second version (state/directives/2026-10-07-migration-plan-v2-ruled.md:16 @ 30e77c10 sha256:HASH-TBD and :25-26 @ 30e77c10 sha256:HASH-TBD); the plan, state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md, §2, §5 and §13 items 1 to 8; item 3 of the 2026-10-07 awaiting-merge direction (code starts after geometry-lines-cut merges); drafting: question round 43, item 2.
Drafted by: the architect agent, alone (the product-first direction, section 1); code read at main 30e77c10.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a: size per §21c, and a property currently under test; §25(e)).

## §0. Disclosure

0.1 Inputs. The plan (whole); state/directives/O-07-WALKTHROUGH-2026-10-05.md; the 2026-09-23 shell direction (state/directives/2026-09-23-entry-119-and-map-studio.md) and entry 120's ruling (state/directives/2026-09-23-entry-120.md); state/directives/2026-09-28-layer-model-decisions.md; the design notebook (state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md, §3.1–§3.4 and §12; a non-authoritative reference); state/directives/PORTABILITY-2026-09-30.md §2 and §5; ADR-001 and its 2026-08-09 amendment; ADR-010; ADR-021; the product-first direction, sections 1, 2 and 4; the shell's code, styles, e2e suites and MANUAL-WALKTHROUGH.md at 30e77c10. The v7 prototype was not read: it is a design reference, not Authority. No pilot, no spike and nothing measured.

0.2 Pins. Every `@ 30e77c10` pin is historical. The lines cut merges before any code here, so the worker re-derives every cite at the code's base commit. For the work, the tree at that base is authoritative; for what this form read, the pin is (round 14). The lines cut touches skp/types.ts and WorkingCanvas.tsx (engine/GEOMETRY-LINES-PREREGISTRATION.md, its file list), so those pins may move.

0.3 The shell as read.
- One return block: frontends/shell/src/App.tsx:1649-2024 @ 30e77c10 sha256:HASH-TBD. Everything above it is state and handlers.
- The map is keyed on the dataset handle: frontends/shell/src/App.tsx:1777-1778 @ 30e77c10 sha256:HASH-TBD (ADR-010 rule 1).
- Two scrolling rails around the map: frontends/shell/src/App.tsx:1660 @ 30e77c10 sha256:HASH-TBD and :1962 @ 30e77c10 sha256:HASH-TBD.
- A status stack drawn over the map: frontends/shell/src/App.tsx:1865-1953 @ 30e77c10 sha256:HASH-TBD, positioned by frontends/shell/src/styles.css:249-267 @ 30e77c10 sha256:HASH-TBD.
- Zoom to layer, drawn over the map: frontends/shell/src/App.tsx:1840-1846 @ 30e77c10 sha256:HASH-TBD.
- DescribeSummary is rendered by AdmissionPanel from AdmissionPanel's own state, not App's: frontends/shell/src/admission/AdmissionPanel.tsx:411 @ 30e77c10 sha256:HASH-TBD and :14 @ 30e77c10 sha256:HASH-TBD.
- The filter's liveness line and its Cancel are inside FilterPanel: frontends/shell/src/filter/FilterPanel.tsx:126 @ 30e77c10 sha256:HASH-TBD.
- PublishPanel owns its own collapsed disclosure, labelled Publish: frontends/shell/src/publish/PublishPanel.tsx:325 @ 30e77c10 sha256:HASH-TBD and :510 @ 30e77c10 sha256:HASH-TBD.
- The window is 1280 × 800: frontends/shell/src-tauri/tauri.conf.json:16-18 @ 30e77c10 sha256:HASH-TBD.
- No state or layout library: frontends/shell/package.json:41-62 @ 30e77c10 sha256:HASH-TBD.
- No keydown listener outside two inputs' Enter handlers (FilterPanel.tsx:71-75, PublishDialog.tsx:204-206).

0.4 Consuming-side interfaces, read before any seam is drafted.
- DescribeSummary takes `{ describe: DescribeResponse }`: frontends/shell/src/admission/DescribeSummary.tsx:20 @ 30e77c10 sha256:HASH-TBD.
- The canvas handle's fit is `canvasRef.current?.fitToBounds()`: frontends/shell/src/App.tsx:1843 @ 30e77c10 sha256:HASH-TBD.
- The console's name-only recorder: frontends/shell/src/console/recorder.ts:360 @ 30e77c10 sha256:HASH-TBD.
- The class-C row shape, pure view state: frontends/shell/src/console/surfaceRegistry.ts:207-214 @ 30e77c10 sha256:HASH-TBD.
- The recorder import allowlist: frontends/shell/src/console/soleCaptureSite.test.ts:49-60 @ 30e77c10 sha256:HASH-TBD.
- The watcher facts: frontends/shell/src/skp/types.ts:200-203 @ 30e77c10 sha256:HASH-TBD and :209-230 @ 30e77c10 sha256:HASH-TBD.
- The backend-rendered path display: frontends/shell/src/skp/types.ts:66-69 @ 30e77c10 sha256:HASH-TBD.
- App's exported liveness functions: frontends/shell/src/App.tsx:484 @ 30e77c10 sha256:HASH-TBD and :493 @ 30e77c10 sha256:HASH-TBD, already imported by FilterPanel (frontends/shell/src/filter/FilterPanel.tsx:10 @ 30e77c10 sha256:HASH-TBD).
- The real-App render harness that stubs only the WebGL boundary: frontends/shell/src/App.lateResult.test.tsx:324-360 @ 30e77c10 sha256:HASH-TBD.

0.5 Hypotheses. Each is labelled and carries its discriminator.
- **H1.** A layout change that resizes the map issues no viewport_query. WorkingCanvas reports the viewport only from the view-state handler and from fits, never from a resize (frontends/shell/src/canvas/WorkingCanvas.tsx:1912 @ 30e77c10 sha256:HASH-TBD, :1323 @ 30e77c10 sha256:HASH-TBD, :2176 @ 30e77c10 sha256:HASH-TBD). If so, the area a layout change uncovers fills only on the next pan or zoom, as after a window resize today.
  - Discriminator: e2e step RESIZEQ (§4), recorded and not asserted.
  - Outcome route: OPEN-7.
- **H2.** Real Ctrl+B, Ctrl+I and Ctrl+J keystrokes reach the page in WebView2. CDP key injection, which the e2e uses, does not cross WebView2's accelerator-key layer.
  - Discriminator: row X3 of the new walkthrough Part.
  - If the hypothesis fails: STOP and ask the human.
- **H3.** Every existing e2e suite passes on the new geometry with only the §2.7 changes.
  - Discriminator: the suite runs.
  - A failure not caused by a listed change is invalidator I3.

0.6 Fixture drive. Nothing is measured. If a suite reads the 5 GB fixture, its drive is recorded as a confound, and no number is compared with an earlier record. The map's size changes in this piece, so the residency harness's numbers are not comparable across it.

## §1. May and may not claim

- **May claim:** the frame of §2, the three seams, and the properties §4 tests.
- **May not claim:**
  - any performance figure or docs/08 row (the ADR-001 amendment's no-claim stands);
  - any macOS or Linux level above L1 (PORTABILITY R5);
  - anything about watching beyond the at-open wire fact (KNOWN-LIMITATIONS 24 to 26).
- **No wire, kernel, engine or protocol change.**
- **ADRs.** ADR-001, -006, -010, -017 and -021 are cited, and none is amended.
- **Strings.** Every new operator string is the human's at P6.
- **Layout is not workspace** (plan §2 rule 10): no history step and no unsaved mark. Saving the layout is B2's preferences.

## §2. The change

### 2.1 Regions

DOM order is focus order. A region that is closed, or a tab or section that is inactive, keeps its content mounted and hidden with the `hidden` attribute. It is never unmounted.

| Region | Element and landmark | Class | Default |
|---|---|---|---|
| Top bar | `<header>` (banner). Holds the title element `.app-header`, its text unchanged, and the three toggle buttons (`aria-pressed`, `aria-controls`, `aria-keyshortcuts`) | `.top-bar` | always shown |
| Layers | `<aside aria-label>` (complementary): AdmissionPanel, then one row for the dataset on the map | `.region-layers` | open |
| Attention strip | `<section aria-label>`: its items in §2.5 order | `.attention-strip` | no height when empty |
| Map | `<main aria-label>`, tabIndex 0, containing `.canvas-container` | `.region-map` | cannot be closed |
| Inspector | `<aside aria-label>`, tablist Layer / Style. The Layer tab holds three sections: Source and Filter (layout-owned headings, `aria-expanded`), and Export (its heading is PublishPanel's own disclosure, so it is closed by default as today) | `.region-inspector` | open, Layer tab, Source and Filter open |
| Activity | `<section aria-label>`, tablist Console / Notices, in the centre column below the map | `.region-activity` | closed, Console tab |
| Status bar | `<footer>` (contentinfo): items in §2.5 order | `.status-bar` | always shown |

- The root keeps `.app` and becomes a CSS grid.
- `.app-main`, `.app-rail-top` and `.app-rail-bottom` are retired.
- Three focusable splitters with `role="separator"` (Layers | map, map | Inspector, map / Activity) resize by pointer drag and by arrow keys.
- The tabs follow the ARIA tabs pattern, with arrow keys between tabs.
- The Layers row is labelled with `describe.source.path_display` verbatim, cut with an ellipsis and given its full text in `title`; the frontend never parses a path. Its button keeps `.zoom-to-layer`. There is no row before a dataset is admitted.

### 2.2 Each component's new home, moved whole

| Component (mount site) | Home | Change |
|---|---|---|
| AdmissionPanel (App.tsx:1661 @ 30e77c10 sha256:HASH-TBD) | Layers | none, except under OPEN-1 |
| DescribeSummary (AdmissionPanel.tsx:411 @ 30e77c10 sha256:HASH-TBD) | Inspector, Layer, Source | its binding: OPEN-1 |
| FilterPanel (App.tsx:1668-1755 @ 30e77c10 sha256:HASH-TBD) | Inspector, Layer, Filter | none; its liveness and Cancel stay in it (ADR-021, docs/adr/ADR-021-row-filter-on-viewport-query.md:11-18 @ 30e77c10 sha256:HASH-TBD) |
| StylePanel (App.tsx:1985 @ 30e77c10 sha256:HASH-TBD) | Inspector, Style tab | none; its own disclosure stays |
| PublishPanel and PublishDialog (App.tsx:1997-2006 @ 30e77c10 sha256:HASH-TBD) | Inspector, Layer, Export | label and one-line purpose only (OPEN-4); the approval dialog's text is unchanged |
| HoverReadoutView (App.tsx:1854 @ 30e77c10 sha256:HASH-TBD) | stays over the map | none |
| Zoom to layer (App.tsx:1840-1846 @ 30e77c10 sha256:HASH-TBD) | the Layers row | position only |
| Session ended, canvas refusal, viewport refusal (App.tsx:1884-1926 @ 30e77c10 sha256:HASH-TBD) | attention strip | position and colours; classes and content unchanged |
| Residency status, scan incomplete (App.tsx:1935-1951 @ 30e77c10 sha256:HASH-TBD) | status bar | position only; classes unchanged |
| The watcher's state | a new status bar item (§2.5); DescribeSummary's two rows (DescribeSummary.tsx:79-97 @ 30e77c10 sha256:HASH-TBD) stay in Source | the display held since 2026-09-23 gets its home |
| ConsolePanel, NoticesPanel (App.tsx:2014-2020 @ 30e77c10 sha256:HASH-TBD) | Activity, Console tab and Notices tab | none; their own disclosures stay |
| ErrorBanner, OriginMismatchState (fixed overlays, styles.css:76-112 @ 30e77c10 sha256:HASH-TBD) | unchanged | not in §5.2; home named for milestone 5 (typed conditions) |

The keys stay as they are: the map keyed by handle, and the panels' prefixed keys.

### 2.3 The three seams

**(a) The layout reducer** (seam 9), in `layout/layoutState.ts`.
- **State:** `layers {open, width}`, `inspector {open, width, tab}`, `activity {open, height, tab}`, and `sections {source, filter}`.
- **Actions:** `toggle(region)`, `selectTab(region, tab)`, `toggleSection(section)` and `resize(region, px)`, clamped to §7.
- **No field and no action names the map.**
- **The fit function.** A pure `effectiveSizes(state, viewport)` shrinks the open side regions in proportion, and then Activity, so that the map keeps its §7 minimum at every viewport at or above the §7 floor.
- **Lifetime and placement:**
  - it lives for the session, in a `useReducer` inside `StudioLayout`;
  - StudioLayout is not keyed on the dataset, so the layout survives a reopen;
  - no import from skp/, streaming/, residency/ or canvas/;
  - it makes no SKP call and adds no history step.

**(b) Registered contributions** (seam 7), in `layout/contributions.ts`.
- Static typed lists: REGIONS, INSPECTOR_TABS, LAYER_SECTIONS, ACTIVITY_TABS, ATTENTION_ITEMS and STATUS_ITEMS.
- A `SlotId` union is derived from them. App's return passes `slots: Record<SlotId, ReactNode>`, so a missing slot is a tsc error.
- There is no loader and no plugin mechanism.

**(c) The action registry** (seam 1, minimal), in `layout/actionRegistry.ts`.
- **Entries** under OPEN-2 (a):
  - `layout.toggleLayers` (Mod+B), `layout.toggleInspector` (Mod+I) and `layout.toggleActivity` (Mod+J);
  - `layer.zoomToLayer`, with no shortcut. Its run is App's existing `canvasRef.current?.fitToBounds()`, passed in from the return.
- **Callers:** one keydown listener on `window` in StudioLayout, the three toggle buttons, and the Layers row's button.
- **Mod** is Meta on macOS and Ctrl elsewhere. This file is the one place the shell reads the platform (§2.10).
- **Matching:**
  - a chord matches on `event.key`, case-insensitive, falling back to `event.code` (KeyB, KeyI, KeyJ) when `key` is not a Latin letter;
  - Mod must be down, with Alt, Shift and the other of Ctrl and Meta up, so AltGr (Ctrl+Alt) never matches;
  - `event.repeat` and `event.isComposing` are ignored;
  - a match calls `preventDefault` and dispatches.
- **While a text field has the focus** (input, textarea, select or contenteditable), the shortcuts still act:
  - the three chords insert no character in such a field, and the shell has no rich-text field;
  - IME composition is excluded;
  - if the region being closed contains `document.activeElement`, focus moves to the map region first, and the field's text survives because its content stays mounted.
- **Each dispatched layout action records one class-C console entry (§2.6).**

### 2.4 Boundaries

- **App.tsx:** edits only from its `return (` (App.tsx:1649 @ 30e77c10 sha256:HASH-TBD) on. The state and handlers above are untouched, apart from imports.
- **Not edited:** WorkingCanvas.tsx, and nothing under `canvas/`, `streaming/`, `residency/` or `skp/`.
- **No change outside `frontends/shell`.**
- **Other files that change:**
  - new code in `frontends/shell/src/layout/`;
  - `styles.css`, reworked for the regions;
  - the files §7 lists.
- **Rules held to throughout:**
  - §2 rule 11: no new permanent element over the map;
  - §2 rule 3: every status and attention item binds to App's `admitted` (App.tsx:767 @ 30e77c10 sha256:HASH-TBD), the dataset on the map.

### 2.5 Attention and status items

**Attention strip,** in this order:
1. Session ended (`.canvas-session-ended`, RefusalBlock, cannot be dismissed).
2. Canvas refusal (`.canvas-refusal`, with Dismiss).
3. Viewport refusal, suppressed while session ended stands, as today.

The strip's height is capped at ATTENTION_MAX_HEIGHT_PX, and its content scrolls inside it. Its colours are CSS custom properties, with light and dark variants, and they are the human's at P6.

**Status bar,** in this order:
1. Residency status (`.residency-status`).
2. Under OPEN-6: a read-only scan-liveness mirror (`.status-scan-liveness`), using App's own `scanLivenessText` and `scanLivenessTextShouldShow`. It has no Cancel; Cancel stays in FilterPanel.
3. Scan incomplete (`.scan-incomplete`).
4. The watcher item (`.status-source-watch`):
   - its text comes from `describe.coverage` and `describe.checks` of the dataset on the map, with the engine's values as written;
   - it is hidden while the session-ended item stands;
   - its wording is a P6 placeholder (§2.8).

The bar wraps to at most STATUS_BAR_MAX_HEIGHT_PX and then scrolls inside.

### 2.6 Console rows (docs/01 principle 4; the class-C precedent at surfaceRegistry.ts:241-274 @ 30e77c10 sha256:HASH-TBD)

- **New class-C rows:**
  - `layout.toggleLayers`, `layout.toggleInspector` and `layout.toggleActivity`;
  - `layout.selectInspectorTab` and `layout.selectActivityTab`;
  - `layout.toggleSection`;
  - `layout.resizeRegion`, recorded once per finished drag and once per keyboard step, never per pointer move.
- **Each row's text.** Each is a no-API-equivalent statement saying the layout is pure view state for this session, never sent to the kernel. Its owner is cited as docs/03's action console, as the existing rows are, and it is P6 text.
- **Allowlist.** `layout/StudioLayout.tsx`, the only layout file that imports `recordNamed`, joins soleCaptureSite.test.ts's allowlist.

### 2.7 End-to-end suites

- **Selector changes,** the complete list:
  - `.canvas-status-stack` becomes `.attention-strip` at frontends/shell/e2e/source-changed.mjs:471 @ 30e77c10 sha256:HASH-TBD and frontends/shell/e2e/source-watch-idle.mjs:249 @ 30e77c10 sha256:HASH-TBD;
  - `.app`, `.app-header` (text Spatial IDE, asserted at frontends/shell/e2e/regression.mjs:364 @ 30e77c10 sha256:HASH-TBD) and `.canvas-container` are unchanged;
  - `.app-main` is retired, and no suite selects it.
- **Conditional changes:**
  - under OPEN-1 (A), the absence assertions at frontends/shell/e2e/regression.mjs:2258-2264 @ 30e77c10 sha256:HASH-TBD and :2319-2320 @ 30e77c10 sha256:HASH-TBD are re-aimed;
  - under OPEN-3 (a), one Style-tab click is added before frontends/shell/e2e/style.mjs:225 @ 30e77c10 sha256:HASH-TBD.
- **Clicks that need visibility** must still find their targets in the default layout:
  - `.zoom-to-layer` (frontends/shell/e2e/residency-harness.mjs:809 @ 30e77c10 sha256:HASH-TBD, source-changed.mjs:1054 @ 30e77c10 sha256:HASH-TBD): Layers is open by default;
  - `button.filter-apply` (frontends/shell/e2e/filter-panel.mjs:169 @ 30e77c10 sha256:HASH-TBD): the Inspector and its Filter section are open by default.
- **New suite:** `e2e/layout.mjs`, and one `e2e:layout` script line in package.json. The dependencies are unchanged.

### 2.8 Operator rows and strings

- **MANUAL-WALKTHROUGH.md, location words.** Location words in the step and expected-outcome cells are updated in place: below the summary or the canvas, at the bottom of the window, top-right of the canvas, drawer, rail, status stack, and on the canvas when said of a banner or status. Rows known to need it: A1, A3, A4, D2, D3, E1, E5, E7, F1, J1, J3, J4, the G rows and the N, Q, S and points rows that name the status stack, plus the coverage tables' location prose.
  - No row's meaning changes.
  - No result-log text is edited.
  - The PR body lists every changed row, with its old and new location words.
  - B2's "No summary" follows OPEN-1.
- **New Part.** One new Part takes the next unused letter at the base commit: the human's felt verdict at 1366 × 768, with a blank result log.
  - **X1:** launch, then set DevTools' device toolbar to 1366 × 768 at 100%.
  - **X2:** open `filter-zoned.parquet`, then read the regions.
  - **X3:** press Ctrl+B, Ctrl+I and Ctrl+J, each twice, with real keys (H2). Each toggles only its own region, the map never disappears, and its view does not reset.
  - **X4:** type a predicate, then press Ctrl+I twice. The text survives, and focus goes to the map.
  - **X5:** Tab through the window. Focus visits the regions in order.
  - **X6:** drag each splitter.
  - **X7, felt:** do Source, Filter and Style read as separate things?
  - **X8:** with every region open, there is no page scrollbar and the map is workable.
  - **X9:** read the banner colours, using Part Q's procedure.
- **Placeholder strings for P6** (OPEN-4):
  - the region, tab and section headings;
  - the three toggle labels, each with its shortcut;
  - the empty-Inspector text;
  - the export label and its one-line purpose;
  - the watcher item's texts;
  - the §2.6 row statements;
  - the banner colours;
  - whether the "Publish…" button and the "Published." headline follow the export label.
- **Read the last amendment first** joins the P6 sight list (round 12 (e)).

### 2.9 Migration inventory (§5.6)

| Item (where it is marked) | Home |
|---|---|
| 1. The Display convention row (PLAN.yaml node adr-013-display-statement, its summary; DescribeSummary.tsx:72-77 @ 30e77c10 sha256:HASH-TBD) | here: moves with DescribeSummary to Source |
| 2. The checks-only Source watch row (DescribeSummary.tsx:79-90 @ 30e77c10 sha256:HASH-TBD; describeSummaryText.ts:71-82 @ 30e77c10 sha256:HASH-TBD; engine/SOURCE-WATCHER-PREREGISTRATION.md §2d) | here: stays in Source; the status bar gains the watcher item |
| 3. The degraded-checks row (DescribeSummary.tsx:92-97 @ 30e77c10 sha256:HASH-TBD; describeSummaryText.ts:84-95 @ 30e77c10 sha256:HASH-TBD) | here: as item 2 |
| 4. The stale `.admission-panel` width measurement (state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md, the 2026-09-23 (later) entry; styles.css:379-416 @ 30e77c10 sha256:HASH-TBD) | here: §2.4's styles rework marks every old-layout measurement comment (styles.css:29-48, :379-416, :466-501, :717-751, each @ 30e77c10 sha256:HASH-TBD) as history |
| 5. Entry 120 (2): fact displays bind to the dataset on the map (KNOWN-LIMITATIONS.md:212-216 @ 30e77c10 sha256:HASH-TBD) | OPEN-1: here under (A); milestone 2, phase A under (B) |
| 6. The held displays of 2026-09-23 item (b) | the watcher's display here; B1's shell half at milestone 4; B2's screens at B2 (§13 item 7) |
| 7. Items the lines cut adds | re-swept at its merge commit; each gets a home by amendment before code |

The watcher consult notes ledger entries for items 2 and 3 as owed under rule (d). This table is their record.

### 2.10 Portability (R3)

- **Owning boundary:** the shell's keyboard adapter, the platform read in `layout/actionRegistry.ts`. The architect adds it as the shell-side boundary for this concern.
- **Windows:** supported. Tested by unit tests, the e2e suite and row X3.
- **macOS:** supported by construction, with Cmd as the modifier. L1 by unit test only.
- **Linux:** supported by construction, with Ctrl. L1 by unit test only.
- **L2 for macOS and Linux** is deferred to PLAN node `shell-real-app-run-macos-linux`, together with the screen-reader checks (PORTABILITY §5).
- **Paths:** none is parsed or built in TypeScript.
- **Display scaling:** unchanged, owned by WorkingCanvas.
- **Expected reduction:** none. Any reduction that run finds goes into KNOWN-LIMITATIONS.

### 2.11 KNOWN-LIMITATIONS (conditional; the wording is for the human's sight)

- Item 18 is retired under OPEN-1 (A).
- Under OPEN-7 (a), one line is added if H1 holds.

## §3. Fixtures and predicted outcomes

- **No new fixture.** `e2e/layout.mjs` uses `filter-zoned.parquet`, plus `100k-happy-path.parquet` for the reopen step.
- **Fixture hashes.** The suite records each fixture's sha256 before and after its run.
- **Predicted outcomes:**
  - every existing e2e suite: PASS, with only the §2.7 changes;
  - `e2e:layout`: PASS on every asserted step;
  - RESIZEQ: zero new viewport_query lines, per H1.

## §4. Tests, and one mutation each

Every mutation is observed by applying it, running the named test, recording its failure by name together with the commit it was observed at, and reverting it. A verify-mutation run is not an observation.

| ID | Kind and file | Asserts | Mutation, and its expected failure |
|---|---|---|---|
| U1 | unit, layout/layoutState.test.ts | No reachable state hides the map. Checked over every open combination × tabs × sections × size extremes, plus 2,000 seeded random sequences of up to 40 actions, at viewports {1024, 1280, 1366, 1600, 1920} × {640, 720, 768, 800, 1080}. The map is at least 480 × 320 in every case | delete effectiveSizes' shrink step; fails at 1024 × 640 |
| U2 | unit, same file | Each toggle changes only its own region's `open`; everything else stays deep-equal | `toggle("layers")` also closes Activity (the v7 defect, walkthrough step 10) |
| U3 | unit, same file | `resize` clamps to §7's range, and the state has no map key | remove the max clamp |
| U4 | unit, layout/layoutBoundary.test.ts | No file under src/layout/ imports from skp/, streaming/, residency/ or canvas/ | add an import of ../skp/client to layoutState.ts; fails naming the file |
| U5 | unit, layout/actionRegistry.test.ts | Ctrl+B, Ctrl+I and Ctrl+J map to the three toggles; Meta on macOS; Ctrl does not match on macOS; Alt, Shift and Ctrl+Alt do not match; repeat and isComposing are ignored; the code fallback works; ids and shortcuts are unique | swap the I and J bindings; fails naming Mod+I |
| U6 | unit, layout/statusItems.test.ts | The watcher texts for watching, checks-only with its reason, and degraded with its components; null while session ended; null with no dataset. The mirror gate equals `scanLivenessTextShouldShow` (OPEN-6) | drop the session-ended guard |
| R1 | render, src/App.layout.test.tsx (the real App, WebGL boundary mocked as App.lateResult.test.tsx does, admission through the real openPath hook) | The map is mounted exactly once per handle across every layout action, driven through the real listener, buttons, tabs, sections and splitter keys. A reopen mounts the new handle once and unmounts the old one once | key the map region on `inspector.open`; the count reaches 2 |
| R2 | render, same file | After Ctrl+I twice, the FilterPanel input's text and PublishPanel's `aria-expanded` survive | render closed content as null |
| R3 | render, same file | With focus in the filter input, Ctrl+I hides the Inspector, focus is on the map region, and the text is kept | remove the focus relocation |
| R4 | render, same file | Landmark roles and names; the DOM order of the regions; `hidden` on closed regions and never on the map | place the Inspector before the map in the DOM |
| R5 | render, same file | The Layers row's `.zoom-to-layer` calls `fitToBounds` once; there is no row before admission | wire the row to a no-op |
| R6 | render, same file | Layout survives a reopen; the SKP client's call count is unchanged across every layout action | key StudioLayout on the dataset |
| R7 | render, same file | Ctrl+B records one `layout.toggleLayers` gui-action | delete the recordNamed call |
| R8 | render, same file (OPEN-1 (A) only) | After a refused second open, Source still shows the first dataset's summary while Layers shows the refusal | restore AdmissionPanel.tsx:411 and drop App's render |
| E-KEYS | e2e, e2e/layout.mjs | On real WebView2, each chord pressed twice flips only its own region's `hidden`; the stored `.working-canvas` node is still connected and identical; `.canvas-container` is at least 480 × 320 | swap the I and J bindings |
| E-FIELD | e2e, same | The `.filter-predicate` text survives Ctrl+I twice, and focus is on the map while the Inspector is hidden | remove the focus relocation |
| E-FOCUS | e2e, same | A Tab walk visits the regions in §2.1 order (the attention strip is skipped when empty) | place the Inspector before the map in the DOM |
| E-LANDMARKS | e2e, same | The landmark roles and accessible names on the real DOM | drop the Inspector's aria-label |
| E-FIT | e2e, same | At 1280 × 800 natively, and at 1366 × 768 by `page.setViewportSize` (fallback: a launch with a config overlay; STOP if neither works), with every region open: no page scrollbar, and the map at least 480 × 320 | Inspector default width 900 |
| E-REOPEN | e2e, same | Opening the second fixture replaces the canvas node (only a new handle remounts) | key the map region on a layout value; E-KEYS fails first, with the node replaced |
| RESIZEQ | e2e, same, recorded and not asserted | The count of viewport_query lines within 3 s after Ctrl+I with the pointer still (H1) | none: an observation, not a test |

**Assertion, e2e or felt, per acceptance item:**
- **The map is never hidden:** U1 and E-KEYS (assertions).
- **The map is never remounted by layout:** R1 and E-KEYS / E-REOPEN (assertions).
- **Each toggle changes only its own panel:** U2 and E-KEYS (assertions).
- **The shortcuts:** U5 and E-KEYS (assertions), plus X3, which is the human's observation of H2.
- **Focus order and landmarks:** R4, E-FOCUS and E-LANDMARKS (assertions).
- **The fit:** U1 and E-FIT (assertions), plus X8, felt.
- **Source, Filter and Style read as separate:** X7, the human's felt verdict only.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:**
- H1, H2 and H3 as stated in §0.5.
- E-FIT's map sizes at the defaults, with the attention strip and status bar at their caps: 668 × 378 at 1280 × 800, and 754 × 346 at 1366 × 768. The exact pixels are recorded, and only the minimum is asserted.

**Declared unchanged:**
- Every file outside frontends/shell.
- WorkingCanvas.tsx, and canvas/, streaming/, residency/ and skp/.
- App.tsx above line 1649, apart from imports.
- These components move whole, with the exceptions §2.2 names: AdmissionPanel, DescribeSummary, FilterPanel, StylePanel, PublishPanel, PublishDialog, RefusalBlock, HoverReadoutView, ConsolePanel, NoticesPanel, ErrorBanner and OriginMismatchState.
- The keys, and the remount on a new handle.
- Every existing string, apart from OPEN-4's.
- The approval dialog's text.
- ADR-021's liveness and Cancel, in FilterPanel.
- tauri.conf.json.
- package.json's dependencies and devDependencies; the lockfile.
- The console's class-A and class-B rows.
- Every KNOWN-LIMITATIONS item apart from §2.11.

**Invalidators.** Each one means STOP and report.
- **I1:** any edit needed in a declared-unchanged area.
- **I2:** a dependency seems necessary (§2 rule 4). That is a question for the human.
- **I3:** an e2e failure not caused by a §2.7 change. No threshold is edited; it is recorded as class 2, and the human is asked.
- **I4:** a seam's consuming interface differs at the base commit from §0.4.
- **I5:** H2 fails.
- **I6:** a test can pass only by mocking the layout itself.

**Falsification.** The form is wrong if, at the base commit, the map cannot keep a stable tree position across layout changes without editing WorkingCanvas.

## §6. Instruments

- **Assertions:** every U, R and E row above.
- **Observation, not asserted:** RESIZEQ.
- **Measurements:** none.
- **The human's:** X3 (an observation) and X7 and X8 (felt).

## §7. Declared values and ceilings

These are declared in `layout/layoutConstants.ts`, each with the quantity it bounds (ADR-010 rule 6).

| Constant | Value | Bounds |
|---|---|---|
| MAP_MIN_WIDTH_PX × MAP_MIN_HEIGHT_PX | 480 × 320 | the map region's minimum CSS size at every viewport at or above the floor (replaces the 200 px floor at styles.css:182-193 @ 30e77c10 sha256:HASH-TBD) |
| VIEWPORT_FLOOR | 1024 × 640 | the smallest viewport U1 proves the minimum for; below it the map takes what remains, and nothing is claimed |
| LAYERS_WIDTH_PX | default 260, min 200, max 480 | the Layers column |
| INSPECTOR_WIDTH_PX | default 340, min 280, max 560 | the Inspector column |
| ACTIVITY_HEIGHT_PX | default 200, min 120, max 480 | the Activity row |
| TOP_BAR_HEIGHT_PX | 40 | the top bar |
| STATUS_BAR_MAX_HEIGHT_PX | 48 | the status bar, two lines, then internal scroll |
| ATTENTION_MAX_HEIGHT_PX | 128 | the attention strip, then internal scroll |
| SPLITTER_PX | 6 | each splitter |
| RESIZE_STEP_PX | 16 | one arrow-key resize step |
| Defaults | Layers open; Inspector open on Layer with Source and Filter open; Export closed by its own panel; Activity closed on Console | the first layout of a session |

**Budget.** Insertions plus deletions per §21c, tests included. The count is taken at a named commit with `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`, where `<base>` is the merge base with origin/main when the code branch is cut.

| Group | Files | Lines, at most |
|---|---|---|
| G1 src/layout/ (layoutState, layoutConstants, contributions, actionRegistry, StudioLayout, regionParts, statusItems) | 7 | 1,000 |
| G2 App.tsx return block | 1 | 450 |
| G3 styles.css | 1 | 400 |
| G4 AdmissionPanel.tsx (≤ 6 under OPEN-1 (A)), PublishPanel.tsx (≤ 12), surfaceRegistry.ts (≤ 70), package.json (≤ 2) | 4 | 100 |
| G5 unit and render tests (U1–U6, R1–R8; soleCaptureSite.test.ts ≤ 4; PublishPanel.test.ts ≤ 4) | 7 | 900 |
| G6 e2e (layout.mjs ≤ 360; source-changed.mjs, source-watch-idle.mjs ≤ 4 each; style.mjs ≤ 8; regression.mjs ≤ 24) | 5 | 400 |
| **Total** | **25** | **3,250** |

Outside the count, declared for the record: MANUAL-WALKTHROUGH.md ≤ 180, e2e/README.md ≤ 40, and KNOWN-LIMITATIONS.md ≤ 20. An overrun is class 8, and this section is never edited to match it.

## §8. Block-on-sight

1. An App.tsx edit above `return (` other than an import.
2. Any edit to WorkingCanvas.tsx, or under canvas/, streaming/, residency/ or skp/.
3. Any file changed outside frontends/shell, apart from records.
4. A dependency or lockfile change.
5. A layout field or action able to hide the map, or a map region keyed or conditionally placed on layout state.
6. Closed content unmounted.
7. A layout action that calls SKP, marks workspace state, or records anything other than a §2.6 row.
8. An e2e edit outside §2.7.
9. A walkthrough row whose meaning changes, or a result-log edit.
10. A new operator string outside §2.8's list, or one neither marked nor sighted.
11. A registry entry, callback, option or export without a product caller.
12. A path parsed or built in TypeScript, or a platform read outside actionRegistry.ts.
13. An old-layout measurement comment left reading as current.
14. A performance claim.
15. A quote of the human's words marked verbatim that does not match its source.
16. A new test without its observed mutation.

## §9. Gates

- **Architect and reviewer,** full gating, verdicts per the product-first direction, section 2:
  - Correctness or Evidence blocks;
  - a documentation or record finding is fixed in the same PR before the merge;
  - each reviewer checks §8 item by item.
- **Suites,** green first:
  - frontends/shell `npm run verify`;
  - every e2e suite at the base commit, listed in the PR body, plus `e2e:layout`;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each tool named with its commit.
- **Operator:** the new Part, committed with a blank log and queued to the sitting. The felt verdict and the P6 sight are the human's.
- **Owner's index:** none for frontends/shell was found at 30e77c10. If the custodian names one, the worker updates it in this PR (product-first direction, section 1).

## §10. Amendments

Opens empty, append-only.

## §11. Open items for the human

Full options are in the question round. In short:
- **OPEN-1:** DescribeSummary's binding. Recommended: (A).
- **OPEN-2:** registry entries without a product caller. Recommended: (a).
- **OPEN-3:** the Style-tab step in style.mjs. Recommended: (a).
- **OPEN-4:** P6 wording. Recommended: sight the plain names now.
- **OPEN-5:** size. Recommended: one piece.
- **OPEN-6:** a status-bar liveness mirror. Recommended: yes.
- **OPEN-7:** if H1 holds. Recommended: (a).

None is a red line. Each answer is recorded as Amendment 1 before dispatch.

## §12. Heavy runs

The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 30e77c10 sha256:HASH-TBD. This form names no other rule for builds.
````

## 3. Open items

**OPEN-1: what DescribeSummary binds to.**
- **The conflict.** DescribeSummary renders from AdmissionPanel's state (AdmissionPanel.tsx:411). It cannot reach the Inspector without an AdmissionPanel edit, and every possible binding crosses a ruled line.
  - §2 rule 3 and entry 120 (2) say fact displays bind to the dataset on the map.
  - §5.2 says DescribeSummary does not change.
  - §5.6 limits e2e changes to selectors and keeps every walkthrough row's meaning.
- **Options:**
  - **(A)** App renders it from `admitted.describe`, and AdmissionPanel loses line 411 and its import.
    - KNOWN-LIMITATIONS 18 is retired.
    - regression.mjs's absence checks (lines 2258-2264 and 2319-2320) are re-aimed.
    - B2's "No summary" changes meaning.
  - **(B)** AdmissionPanel gains a target prop and renders the summary into Source through a React portal.
    - The binding stays tied to the open attempt, and KNOWN-LIMITATIONS 18 stands.
    - Milestone 2's phase A rebinds it.
  - **(C)** The summary stays in Layers for milestone 1. This contradicts §13 item 3.
- **Recommendation:** (A). It is the human's own migration requirement, it needs the smaller edit, and it removes a known limitation.
- **Red line:** no. The KNOWN-LIMITATIONS wording is for the human's sight.
- **What waits:** dispatch, specifically the Source wiring, R8, the regression.mjs edits, row B2 and KNOWN-LIMITATIONS 18.

**OPEN-2: open dataset and export in the registry.**
- **The conflict.** Their handlers live inside AdmissionPanel and PublishPanel. In milestone 1 nothing but the panels' own buttons calls them, and the command bar is milestone 3. The caller rule therefore applies.
  - The round-8 exemption does not apply: it exempts nothing whose consumer is undesigned, and milestone 3 is bounded but not designed.
- **Options:**
  - **(a)** Milestone 1 registers only the three toggles and zoom to layer, which the Layers row button calls. Open and export join in milestone 3.
  - **(b)** Expose both handlers now and give them new shortcuts. That adds behaviour the plan does not name.
  - **(c)** The human names milestone 3 and its gate as the pre-committed consumer. Ids and labels only land now.
- **Recommendation:** (a).
- **Red line:** no.
- **What waits:** the registry's contents.

**OPEN-3: an e2e step beyond selectors.**
- **The problem.** style.mjs clicks `.style-disclosure` and `button.style-reset` with real clicks (lines 225 and 501). With Style on its own tab, those clicks fail unless the tab is active first. No selector change can make them pass.
- **Options:**
  - **(a)** One added step in style.mjs that clicks the Style tab through the real UI.
  - **(b)** An instrumented-build hook that sets the layout.
- **Recommendation:** (a). It also exercises the tab.
- **Red line:** no.
- **What waits:** the style.mjs edit, at dispatch.

**OPEN-4: P6 wording, and when to sight it.**
- **The strings and colours:**
  - the headings Layers, Map, Inspector, Layer, Style, Source, Filter, Export, Activity, Console and Notices (the plan's names);
  - the toggle labels;
  - the empty-Inspector text;
  - the export label "Export interactive map" and a one-line purpose;
  - the watcher item's texts;
  - the class-C row statements;
  - the banner colours.
- **Label scope.** Should the "Publish…" button and the "Published." headline (PublishPanel.tsx:605 and :666; the "Publish…" text is asserted at PublishPanel.test.ts:458) change too?
- **The purpose line must claim nothing ADR-017 does not support.** For example, "open in a web browser" may overclaim, because a bundle is served by HTTP.
- **Options:**
  - **(a)** Sight the plain names now, so the build ships without markers. The purpose line, the colours and the watcher texts come at the sitting.
  - **(b)** Ship everything with markers, and sight it all at the sitting.
  - Separately, the label covers the disclosure only, or the disclosure and the button.
- **Recommendation:** (a). Change the disclosure and the button, and keep "Published." and the approval dialog unchanged. Sight-list note: StylePanel, ConsolePanel and NoticesPanel keep their own collapsed disclosures inside their tabs, which is a double step the human sees.
- **Red line:** no. It is P6 wording.
- **What waits:** the strings; the merge waits on sight.

**OPEN-5: size.**
- **The figures.** The form declares at most 3,250 lines over 25 files, tests included. The plan estimated at most 1,500 over about 25.
- **Options:**
  - **(a)** One piece at the declared figure.
  - **(b)** Split into 1a (the seams, the frame and the unit tests) and 1b (the e2e suite and the walkthrough). That means two gate cycles and an intermediate shell that has no e2e proof.
- **Recommendation:** (a).
- **Red line:** no.
- **What waits:** dispatch.

**OPEN-6: a scan-liveness mirror in the status bar.**
- **The problem.** ADR-021 keeps liveness and Cancel in FilterPanel. With the Inspector closed, a scan that has returned no batch yet would show nothing.
- **Options:**
  - **(a)** A read-only mirror in the status bar, with the same strings and the same delay gate, through App's exported functions.
  - **(b)** No mirror.
- **Recommendation:** (a). It keeps docs/01 principle 7 visible whatever the layout.
- **Red line:** no.
- **What waits:** the status-bar list, U6 and G1.

**OPEN-7: if H1 holds (a layout resize issues no query).**
- **Options:**
  - **(a)** A KNOWN-LIMITATIONS line now: the uncovered area fills on the next pan or zoom, as after a window resize. The fix goes to milestone 2, which already edits canvas/.
  - **(b)** Allow a WorkingCanvas edit in milestone 1. This breaks §5.5, which is ruled.
- **Recommendation:** (a). Ruling now saves a later round.
- **Red line:** no. The line's wording is for the human's sight.
- **What waits:** nothing until the RESIZEQ observation; after it, §2.11's line.

## 4. Files read

- C:\dev\spatial-ide\state\directives\SHELL-MIGRATION-PLAN-2026-10-07.md
- C:\dev\spatial-ide\state\directives\2026-10-07-migration-plan-v2-ruled.md
- C:\dev\spatial-ide\state\directives\O-07-WALKTHROUGH-2026-10-05.md
- C:\dev\spatial-ide\state\directives\2026-09-23-entry-119-and-map-studio.md
- C:\dev\spatial-ide\state\directives\2026-09-23-entry-120.md
- C:\dev\spatial-ide\state\directives\2026-09-28-layer-model-decisions.md
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
- C:\dev\spatial-ide\state\directives\2026-10-05-product-first-direction.md
- C:\dev\spatial-ide\state\directives\2026-10-06-machine-script-adopted.md
- C:\dev\spatial-ide\state\drafts\design\SPATIAL-IDE-DESIGN-NOTEBOOK.md (§3, §12)
- C:\dev\spatial-ide\state\cut-archive\CUT-STATE-2026-09-24-post-tag-arc.md (lines 303-320)
- C:\dev\spatial-ide\DECISIONS-PENDING.md (lines 32-71 and 1000-1060)
- C:\dev\spatial-ide\PLAN.yaml (the node blocks for milestones 1, 2, 3 and 5, the macOS/Linux run, shell-redesign-map-studio and geometry-lines-cut)
- C:\dev\spatial-ide\AUTONOMY.md (§21 to §22, §25 to §27)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md
- C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (items 17 to 26)
- C:\dev\spatial-ide\docs\03_UX.md
- C:\dev\spatial-ide\docs\08_Testing.md (lines 1-40)
- C:\dev\spatial-ide\docs\adr\ADR-001-frontend-stack.md
- C:\dev\spatial-ide\docs\adr\ADR-010-render-frames-origins-boundaries.md (grep)
- C:\dev\spatial-ide\docs\adr\ADR-021-row-filter-on-viewport-query.md
- C:\dev\spatial-ide\kernel\TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md (form style only)
- C:\dev\spatial-ide\engine\GEOMETRY-LINES-PREREGISTRATION.md (its shell file list)
- C:\dev\spatial-ide\frontends\shell\src\App.tsx (lines 1600-2025, plus greps)
- C:\dev\spatial-ide\frontends\shell\src\admission\AdmissionPanel.tsx
- C:\dev\spatial-ide\frontends\shell\src\admission\DescribeSummary.tsx
- C:\dev\spatial-ide\frontends\shell\src\admission\describeSummaryText.ts
- C:\dev\spatial-ide\frontends\shell\src\ErrorBanner.tsx
- C:\dev\spatial-ide\frontends\shell\src\styles.css
- C:\dev\spatial-ide\frontends\shell\src\console\surfaceCompleteness.test.ts
- C:\dev\spatial-ide\frontends\shell\src\console\surfaceRegistry.ts (lines 180-302)
- C:\dev\spatial-ide\frontends\shell\src\console\soleCaptureSite.test.ts (lines 1-80)
- C:\dev\spatial-ide\frontends\shell\src\App.lateResult.test.tsx (lines 320-450)
- greps only: C:\dev\spatial-ide\frontends\shell\src\filter\FilterPanel.tsx, C:\dev\spatial-ide\frontends\shell\src\publish\PublishPanel.tsx, C:\dev\spatial-ide\frontends\shell\src\publish\PublishDialog.tsx, C:\dev\spatial-ide\frontends\shell\src\console\recorder.ts, C:\dev\spatial-ide\frontends\shell\src\skp\types.ts, C:\dev\spatial-ide\frontends\shell\src\admission\admitDataset.ts, C:\dev\spatial-ide\frontends\shell\src\canvas\WorkingCanvas.tsx
- C:\dev\spatial-ide\frontends\shell\package.json
- C:\dev\spatial-ide\frontends\shell\vitest.config.ts
- C:\dev\spatial-ide\frontends\shell\src-tauri\tauri.conf.json (grep)
- C:\dev\spatial-ide\frontends\shell\e2e\filter.mjs (lines 1-110)
- C:\dev\spatial-ide\frontends\shell\e2e\regression.mjs (lines 352-367 and 2225-2333)
- C:\dev\spatial-ide\frontends\shell\e2e\source-changed.mjs (lines 460-489)
- C:\dev\spatial-ide\frontends\shell\e2e\source-watch-idle.mjs (lines 240-264)
- C:\dev\spatial-ide\frontends\shell\e2e\residency-harness.mjs (lines 688-720)
- C:\dev\spatial-ide\frontends\shell\e2e\admission-remediation.mjs (lines 690-729)
- greps only: C:\dev\spatial-ide\frontends\shell\e2e\lib.mjs, the other e2e suites
- C:\dev\spatial-ide\frontends\shell\MANUAL-WALKTHROUGH.md (lines 150-310 and 640-664, plus heading and location-word greps)
