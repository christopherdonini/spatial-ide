# Shell migration, milestone 1 — the frame: Map Studio regions, panel toggles, separated sections, an attention strip and a status bar
# (PLAN node shell-migration-milestone-1)

File: frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md
Authority: the RULED 2026-10-07 block for the migration plan's second version (state/directives/2026-10-07-migration-plan-v2-ruled.md:16 @ 30e77c10 sha256:e3caf819eecb46e50213c7bbe342d72bec7726e59c19d5f27180427e1232ee1a and state/directives/2026-10-07-migration-plan-v2-ruled.md:25-26 @ 30e77c10 sha256:098b3cc70038e19acd4c3cc7336617abcb0d2b2c88d2ab807fc96fea91076628); the plan, state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md, §2, §5 and §13 items 1 to 8; item 3 of the 2026-10-07 awaiting-merge direction (code starts after geometry-lines-cut merges); drafting: question round 43, item 2.
Drafted by: the architect agent, alone (the product-first direction, section 1); code read at main 30e77c10.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a: size per §21c, and a property currently under test; §25(e)).

## §0. Disclosure

0.1 Inputs. The plan (whole); state/directives/O-07-WALKTHROUGH-2026-10-05.md; the 2026-09-23 shell direction (state/directives/2026-09-23-entry-119-and-map-studio.md) and entry 120's ruling (state/directives/2026-09-23-entry-120.md); state/directives/2026-09-28-layer-model-decisions.md; the design notebook (state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md, §3.1–§3.4 and §12; a non-authoritative reference); state/directives/PORTABILITY-2026-09-30.md §2 and §5; ADR-001 and its 2026-08-09 amendment; ADR-010; ADR-021; the product-first direction, sections 1, 2 and 4; the shell's code, styles, e2e suites and MANUAL-WALKTHROUGH.md at 30e77c10. The v7 prototype was not read: it is a design reference, not Authority. No pilot, no spike and nothing measured.

0.2 Pins. Every `@ 30e77c10` pin is historical. The lines cut merges before any code here, so the worker re-derives every cite at the code's base commit. For the work, the tree at that base is authoritative; for what this form read, the pin is (round 14). The lines cut touches skp/types.ts and WorkingCanvas.tsx (engine/GEOMETRY-LINES-PREREGISTRATION.md, its file list), so those pins may move.

0.3 The shell as read.
- One return block: frontends/shell/src/App.tsx:1649-2024 @ 30e77c10 sha256:aebdb8c538189b5595d5aa14e3d4d8a3edf569703024682e69c87fe1b505f3a9. Everything above it is state and handlers.
- The map is keyed on the dataset handle: frontends/shell/src/App.tsx:1777-1778 @ 30e77c10 sha256:ca10262512f969b27c085e3f8f1f7e7ea93d451d78b976d0d7fa7120533ee634 (ADR-010 rule 1).
- Two scrolling rails around the map: frontends/shell/src/App.tsx:1660 @ 30e77c10 sha256:87a7254bb86c2ff621ec72a0ad4b0b1d159ee341ad878817109ad367566d6179 and frontends/shell/src/App.tsx:1962 @ 30e77c10 sha256:1c582df21680fbd09800dafbdcab0a97d815e1308ba52163a8019233f32ae6fb.
- A status stack drawn over the map: frontends/shell/src/App.tsx:1865-1953 @ 30e77c10 sha256:78c5c1143022c5c8f99da41402613763953529124ed40af37d9def78ccc4174c, positioned by frontends/shell/src/styles.css:249-267 @ 30e77c10 sha256:325bd8ab8487a0c60079f568a899e925aa84ef5ad2758bf447b68a3d429034e7.
- Zoom to layer, drawn over the map: frontends/shell/src/App.tsx:1840-1846 @ 30e77c10 sha256:4e1af7f9c2fc526ff7f1de85ee239248cf5344a0b6e2bb9a459fa7d337151e43.
- DescribeSummary is rendered by AdmissionPanel from AdmissionPanel's own state, not App's: frontends/shell/src/admission/AdmissionPanel.tsx:411 @ 30e77c10 sha256:670ff11c762df34b49398132184363c9baeb1808add844dfe1c4f742510c0749 and frontends/shell/src/admission/AdmissionPanel.tsx:14 @ 30e77c10 sha256:684cd1dba8195d78af7493866ec990efad14467b27ee64145ff83c6e1c0047e9.
- The filter's liveness line and its Cancel are inside FilterPanel: frontends/shell/src/filter/FilterPanel.tsx:126 @ 30e77c10 sha256:2ae2aa39267d0c1911e147c0350d21e0c2101c47c6f8c34a865bb9d9664f5d48.
- PublishPanel owns its own collapsed disclosure, labelled Publish: frontends/shell/src/publish/PublishPanel.tsx:325 @ 30e77c10 sha256:21189cbd2e2b67dd867b9107577692f69f55a00e242988f5935f5cda5e5a533f and frontends/shell/src/publish/PublishPanel.tsx:510 @ 30e77c10 sha256:2ee39a95704421465d2e954ee88d6f337c6a730de4e996fd60224e083b9a2732.
- The window is 1280 × 800: frontends/shell/src-tauri/tauri.conf.json:16-18 @ 30e77c10 sha256:498217551140a3559144b1a3d13f4ae7443ba8a1abdfc1817fb63c42bf81dba0.
- No state or layout library: frontends/shell/package.json:41-62 @ 30e77c10 sha256:0dbf450f81e7c7f6fb4cb979194faecbfc2f2fbaa15227ba559363cd6e4c2ed3.
- No keydown listener outside two inputs' Enter handlers (FilterPanel.tsx:71-75, PublishDialog.tsx:204-206).

0.4 Consuming-side interfaces, read before any seam is drafted.
- DescribeSummary takes `{ describe: DescribeResponse }`: frontends/shell/src/admission/DescribeSummary.tsx:20 @ 30e77c10 sha256:27969437a634588fef852db65ed13caee97a26d28500ade3d963941855884b33.
- The canvas handle's fit is `canvasRef.current?.fitToBounds()`: frontends/shell/src/App.tsx:1843 @ 30e77c10 sha256:076eb7820407d1721e8f406e256b310120124f265526034b001100cc498b6284.
- The console's name-only recorder: frontends/shell/src/console/recorder.ts:360 @ 30e77c10 sha256:9e23d983afac61af41be0a52053e92bee65328003d070e5285a2704b8c3583aa.
- The class-C row shape, pure view state: frontends/shell/src/console/surfaceRegistry.ts:207-214 @ 30e77c10 sha256:aa7e091799a77d55e342a196b9e887cf4cfb6cce84eaa11bcb09f480dc32d075.
- The recorder import allowlist: frontends/shell/src/console/soleCaptureSite.test.ts:49-60 @ 30e77c10 sha256:2add4abef1f0b32113ea4e464643285e7b50dbe27441a65367e2c39a5e1b5dd3.
- The watcher facts: frontends/shell/src/skp/types.ts:200-203 @ 30e77c10 sha256:0826f8bfe11e0092b5c38300b4e04c770e125ea64b9577478cfbaae03e73da7c and frontends/shell/src/skp/types.ts:209-230 @ 30e77c10 sha256:6a80c6030d06b391fe6929ea403942a5630ee54261ee865cae1adba9cba7cb08.
- The backend-rendered path display: frontends/shell/src/skp/types.ts:66-69 @ 30e77c10 sha256:5089327c772600795937d03a55f28f199bc88219f9f9140473f7246517678a79.
- App's exported liveness functions: frontends/shell/src/App.tsx:484 @ 30e77c10 sha256:e4f112a76e54d912430fa1d03e1c45cecb41b5b58dbaebd0a04fa6aff1ed1d68 and frontends/shell/src/App.tsx:493 @ 30e77c10 sha256:4784cac5fe8a7131ce2ea5fd3c437499e00ffd91ccd93456a9ddbdbd42ab6cda, already imported by FilterPanel (frontends/shell/src/filter/FilterPanel.tsx:10 @ 30e77c10 sha256:4bfa10f9dc9f1daffec1cee77b67b210bfdebfbc2869d70638545f93b0f4a4a2).
- The real-App render harness that stubs only the WebGL boundary: frontends/shell/src/App.lateResult.test.tsx:324-360 @ 30e77c10 sha256:27be5a9536bd109a50fbe9bdecc46bef0a12aa853d980052bc8eb74a72251f70.

0.5 Hypotheses. Each is labelled and carries its discriminator.
- **H1.** A layout change that resizes the map issues no viewport_query. WorkingCanvas reports the viewport only from the view-state handler and from fits, never from a resize (frontends/shell/src/canvas/WorkingCanvas.tsx:1912 @ 30e77c10 sha256:ea6f15792e304e015f37780803586fc11f7ed55dcec2f5d8c72243bcdc5957f7, frontends/shell/src/canvas/WorkingCanvas.tsx:1323 @ 30e77c10 sha256:f1b442b78808d6b8fee262e8cbf7055e2595f3a8d5db251d0e89f20532218717, frontends/shell/src/canvas/WorkingCanvas.tsx:2176 @ 30e77c10 sha256:d39b05e418bdc7a8bbcfb04961c45d862bf8d4f31eae3a85bc765c1beb70680c). If so, the area a layout change uncovers fills only on the next pan or zoom, as after a window resize today.
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
| AdmissionPanel (frontends/shell/src/App.tsx:1661 @ 30e77c10 sha256:d732502c6da85ed353fface39cd9722f2f2956d5c55c69fffcbe10a9313360c6) | Layers | none, except under OPEN-1 |
| DescribeSummary (frontends/shell/src/admission/AdmissionPanel.tsx:411 @ 30e77c10 sha256:670ff11c762df34b49398132184363c9baeb1808add844dfe1c4f742510c0749) | Inspector, Layer, Source | its binding: OPEN-1 |
| FilterPanel (frontends/shell/src/App.tsx:1668-1755 @ 30e77c10 sha256:b5fa72609d2dacc664c820aa0aad8d1a9167d3e7cf405a3efd7e4ed8a71c9710) | Inspector, Layer, Filter | none; its liveness and Cancel stay in it (ADR-021, docs/adr/ADR-021-row-filter-on-viewport-query.md:11-18 @ 30e77c10 sha256:66b1a9cc22021f25c85f527997a2a757c57e4f8786a337e8d37019560babf740) |
| StylePanel (frontends/shell/src/App.tsx:1985 @ 30e77c10 sha256:c2327e011870a1eb3e60fe405f542293369bacbe926bf64cfe027e8882e3c0bd) | Inspector, Style tab | none; its own disclosure stays |
| PublishPanel and PublishDialog (frontends/shell/src/App.tsx:1997-2006 @ 30e77c10 sha256:f62611f5ba6bae4693a0dd66f4b34d7982401e6d04ae0a57eb0282b03349bf1b) | Inspector, Layer, Export | label and one-line purpose only (OPEN-4); the approval dialog's text is unchanged |
| HoverReadoutView (frontends/shell/src/App.tsx:1854 @ 30e77c10 sha256:8360c876243c74a05bfc77d49aab926b5920c154ff67ef5234cf50396b4b9332) | stays over the map | none |
| Zoom to layer (frontends/shell/src/App.tsx:1840-1846 @ 30e77c10 sha256:4e1af7f9c2fc526ff7f1de85ee239248cf5344a0b6e2bb9a459fa7d337151e43) | the Layers row | position only |
| Session ended, canvas refusal, viewport refusal (frontends/shell/src/App.tsx:1884-1926 @ 30e77c10 sha256:13727fe30979077ebfe35481ff6f7feaaa65333041d07c5e0cc5e0fe436f0ae9) | attention strip | position and colours; classes and content unchanged |
| Residency status, scan incomplete (frontends/shell/src/App.tsx:1935-1951 @ 30e77c10 sha256:002b29b345ce5171524785ebdd6f48dc34a88402f742caded783f9e5b70f8eaa) | status bar | position only; classes unchanged |
| The watcher's state | a new status bar item (§2.5); DescribeSummary's two rows (frontends/shell/src/admission/DescribeSummary.tsx:79-97 @ 30e77c10 sha256:a70f601446a50c74be2e0f36a37124ef8a47fd302ff61124d0b76237e199130e) stay in Source | the display held since 2026-09-23 gets its home |
| ConsolePanel, NoticesPanel (frontends/shell/src/App.tsx:2014-2020 @ 30e77c10 sha256:9cfe6b12be7fec0828076ebd2678695116e3bf5e9c129021e1a8d14fd14d93d9) | Activity, Console tab and Notices tab | none; their own disclosures stay |
| ErrorBanner, OriginMismatchState (fixed overlays, frontends/shell/src/styles.css:76-112 @ 30e77c10 sha256:2215817236a2c8bcb036ddb3287946b7fe663bf14fe9a392de30d467587df515) | unchanged | not in §5.2; home named for milestone 5 (typed conditions) |

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

- **App.tsx:** edits only from its `return (` (frontends/shell/src/App.tsx:1649 @ 30e77c10 sha256:e7216e8e9c0a1a68d06c2fbaa5fd2139482b8efd0a19315b915e6cce849d89dc) on. The state and handlers above are untouched, apart from imports.
- **Not edited:** WorkingCanvas.tsx, and nothing under `canvas/`, `streaming/`, `residency/` or `skp/`.
- **No change outside `frontends/shell`.**
- **Other files that change:**
  - new code in `frontends/shell/src/layout/`;
  - `styles.css`, reworked for the regions;
  - the files §7 lists.
- **Rules held to throughout:**
  - §2 rule 11: no new permanent element over the map;
  - §2 rule 3: every status and attention item binds to App's `admitted` (frontends/shell/src/App.tsx:767 @ 30e77c10 sha256:5f456cf6eba7a47a020f7468d38498076814ab35d5bb50b684dd98bbf903177d), the dataset on the map.

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

### 2.6 Console rows (docs/01 principle 4; the class-C precedent at frontends/shell/src/console/surfaceRegistry.ts:241-274 @ 30e77c10 sha256:606fb966a29a375c9b37dcd72825a9a0786c7df7bb21acd7c1310428503621c0)

- **New class-C rows:**
  - `layout.toggleLayers`, `layout.toggleInspector` and `layout.toggleActivity`;
  - `layout.selectInspectorTab` and `layout.selectActivityTab`;
  - `layout.toggleSection`;
  - `layout.resizeRegion`, recorded once per finished drag and once per keyboard step, never per pointer move.
- **Each row's text.** Each is a no-API-equivalent statement saying the layout is pure view state for this session, never sent to the kernel. Its owner is cited as docs/03's action console, as the existing rows are, and it is P6 text.
- **Allowlist.** `layout/StudioLayout.tsx`, the only layout file that imports `recordNamed`, joins soleCaptureSite.test.ts's allowlist.

### 2.7 End-to-end suites

- **Selector changes,** the complete list:
  - `.canvas-status-stack` becomes `.attention-strip` at frontends/shell/e2e/source-changed.mjs:471 @ 30e77c10 sha256:c074fbadd3981ea219e469905350d65bbf68ce5c0180f6a02c85dbf44ebe5187 and frontends/shell/e2e/source-watch-idle.mjs:249 @ 30e77c10 sha256:c074fbadd3981ea219e469905350d65bbf68ce5c0180f6a02c85dbf44ebe5187;
  - `.app`, `.app-header` (text Spatial IDE, asserted at frontends/shell/e2e/regression.mjs:364 @ 30e77c10 sha256:746b8a236d267c7ec4bcc5db1379ce1f75f25e28b514b267e68696d55ef47133) and `.canvas-container` are unchanged;
  - `.app-main` is retired, and no suite selects it.
- **Conditional changes:**
  - under OPEN-1 (A), the absence assertions at frontends/shell/e2e/regression.mjs:2258-2264 @ 30e77c10 sha256:ccd5e92c4524f09e8aa0916622af3ab3bd8e45d9e7cde28fec03c7ba9f83cf8b and frontends/shell/e2e/regression.mjs:2319-2320 @ 30e77c10 sha256:9a017bb7a9aeb187ef982c8161eacbe4cc8c84742d3de7e69a8832793dbdeb4b are re-aimed;
  - under OPEN-3 (a), one Style-tab click is added before frontends/shell/e2e/style.mjs:225 @ 30e77c10 sha256:5d656e3eeada4bb78aec290583323fe5ce24603783180d99a9430c8bfbfb3835.
- **Clicks that need visibility** must still find their targets in the default layout:
  - `.zoom-to-layer` (frontends/shell/e2e/residency-harness.mjs:809 @ 30e77c10 sha256:54b29c5e1ddcce1dbdb0cc0822eb5af893a5f64f06dfd4a2fc6d8d44460695ed, frontends/shell/e2e/source-changed.mjs:1054 @ 30e77c10 sha256:8d288eb847efae799e5f7cf2ffb45087af26605247b8ffe39d3f3a95085c052a): Layers is open by default;
  - `button.filter-apply` (frontends/shell/e2e/filter-panel.mjs:169 @ 30e77c10 sha256:68085733dae76d776af0ca2aee7ecaf6957582afd6c1f009107bb9cf5b66b4ca): the Inspector and its Filter section are open by default.
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
| 1. The Display convention row (PLAN.yaml node adr-013-display-statement, its summary; frontends/shell/src/admission/DescribeSummary.tsx:72-77 @ 30e77c10 sha256:8cd8de7267d87a56fc39e9db2cd13ecc67ac95edff422af2321054d383e1b201) | here: moves with DescribeSummary to Source |
| 2. The checks-only Source watch row (frontends/shell/src/admission/DescribeSummary.tsx:79-90 @ 30e77c10 sha256:b563f3090f9fb7d7a42832bfefb7c16d4db7c5fbe56b71925d4a282b2b82adf1; frontends/shell/src/admission/describeSummaryText.ts:71-82 @ 30e77c10 sha256:6b5dd6300e716b9f6cd2fa81fdbf601749ad9542c132c56fffeb91612f45dfb9; engine/SOURCE-WATCHER-PREREGISTRATION.md §2d) | here: stays in Source; the status bar gains the watcher item |
| 3. The degraded-checks row (frontends/shell/src/admission/DescribeSummary.tsx:92-97 @ 30e77c10 sha256:45d90736b5c4e4ee00fbb4edec4e2d7ad1ca9e1a6f50a3daf2b62f92b52bc387; frontends/shell/src/admission/describeSummaryText.ts:84-95 @ 30e77c10 sha256:7dffe243f53850963fd0db48396ed6acb26324e824cf2700165ec2da08bef929) | here: as item 2 |
| 4. The stale `.admission-panel` width measurement (state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md, the 2026-09-23 (later) entry; frontends/shell/src/styles.css:379-416 @ 30e77c10 sha256:23ed127aad80f07032447a228c8ab6fb0f2ae437723b8c7efa09d1093b360e96) | here: §2.4's styles rework marks every old-layout measurement comment (frontends/shell/src/styles.css:29-48 @ 30e77c10 sha256:66bc2024387de62e6f174e58bcf8567d2647c853340f928ed799d15c80d522cf, frontends/shell/src/styles.css:379-416 @ 30e77c10 sha256:23ed127aad80f07032447a228c8ab6fb0f2ae437723b8c7efa09d1093b360e96, frontends/shell/src/styles.css:466-501 @ 30e77c10 sha256:67c7afa67820cbcae2ba40dbbca7a84151566837654fd986ca92f3389ba012aa, frontends/shell/src/styles.css:717-751 @ 30e77c10 sha256:c22a5b5a577833dc70f5bfa662a28bedb545459ebb9363a7e6f95fc86a340309) as history |
| 5. Entry 120 (2): fact displays bind to the dataset on the map (KNOWN-LIMITATIONS.md:212-216 @ 30e77c10 sha256:023c949c7b5dc4a0114b1e24ff14b3c84ff9cffdaa7c5e4d4a06863b30e6ebdb) | OPEN-1: here under (A); milestone 2, phase A under (B) |
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
| MAP_MIN_WIDTH_PX × MAP_MIN_HEIGHT_PX | 480 × 320 | the map region's minimum CSS size at every viewport at or above the floor (replaces the 200 px floor at frontends/shell/src/styles.css:182-193 @ 30e77c10 sha256:b08ffcba7b4727fd527b5a314470dec1e515af9d9690f4f1805563db075435ce) |
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

The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 30e77c10 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1. This form names no other rule for builds.

### Amendment 1 — question rounds 66 and 67's rulings (OPEN-1 to OPEN-7), with the human's two clarifications

*Written by the custodian after the rounds were answered and before any code: no branch exists. It is appended at the file's end and belongs to §10. The rulings are `state/directives/2026-10-07-round-66-and-67-rulings.md` at the commit that adds it: lines 6-12, sha256 93303ab09414917295841ccf30b289f391d8f02fadd92689dc73b425794ad2a6; lines 13-23, sha256 1ab500f879476da9e4669a9502298b1029babf89e0154b28e2f16fa0b172d903; lines 24-29, sha256 479cf1dcc5e450af01e47b4ecdeec9219d65105380471aa4a79402f03adfe077. Their RULED block is in `DECISIONS-PENDING.md`, referenced and not restated. Nothing below is a quotation.*

1. **OPEN-1, (A).** App renders DescribeSummary from the dataset on the map, and KNOWN-LIMITATIONS 18 retires. The parts marked for OPEN-1 (A) are binding. The clarification adds that walkthrough row I1, which carries the same no-summary wording, is updated with row B2. The PR body lists both rows.
2. **OPEN-2, (a).** The registry holds the three toggles and Zoom to layer only. Open and export join in milestone 3.
3. **OPEN-3, (a).** style.mjs gains one real click on the Style tab.
4. **OPEN-4, (a), as clarified:**
   - Sighted now: only the eleven headings and the export label. The Export section's heading is the plain word Export, and the button reads Export interactive map followed by an ellipsis.
   - The toggle labels, the empty-Inspector text and the console row statements stay P6 markers until the human has read their text.
   - The purpose line, the colours and the watcher texts are sighted at the sitting.
   - The success headline changes from Published. to Exported., because the export writes a folder and publishes nothing. The walkthrough rows that quote the old headline are updated.
   - The approval dialog, and the headline beginning Bundle written, but, stay as they are.
   - §2.8's list is read this way, and §8 item 10 applies to it.
5. **OPEN-5, (a).** One piece, at §7's declared figure.
6. **OPEN-6, (a).** A read-only scan-liveness mirror in the status bar. Cancel stays in FilterPanel.
7. **OPEN-7, (a), as clarified.** If H1 holds:
   - the KNOWN-LIMITATIONS line says what the human will see, and that a pan or zoom fills the area;
   - the fix does not wait for milestone 2. It is its own small piece, the proposed node `shell-map-refill-after-resize`, placed directly after this milestone merges;
   - milestone 2's form and question round are prepared meanwhile, and its code starts when that piece has merged.
8. **Generation 2.** Dispatch waits only for the lines cut's merge (§0.2; the awaiting-merge direction, item 3).

**Superseded index.** §11's OPEN list and every OPEN-conditional part → items 1 to 7, binding. §2.8's placeholder list → item 4. §2.11's conditional line → item 7.
