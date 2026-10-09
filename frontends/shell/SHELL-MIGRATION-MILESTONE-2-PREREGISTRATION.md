# Shell migration, milestone 2 — selection and scope: the Select tool, a selection that survives filter and pan, the hidden count, a stated scope
# (PLAN node shell-migration-milestone-2)

File: frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md
Authority: the RULED 2026-10-07 block for the migration plan's second version (state/directives/2026-10-07-migration-plan-v2-ruled.md:16 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:e3caf819eecb46e50213c7bbe342d72bec7726e59c19d5f27180427e1232ee1a); the plan, state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md, §2, §3, §4 and §6 (state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:147-219 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:03665f53841d76bb3f53f2c2e8882989ce23360ce42e0cba933c9a82108dd703) and §13 items 1 to 8; the human's direction of 2026-10-09, item 2d (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:17-19 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:be9820a8dd2c4979973610f7ce7d83f14e8a1c62ee46fcdf5acb08a04891fcc4): the form and its question round now, the code after e2e-hover-establishing-read-stale, shell-map-refill-after-resize and e2e-failures-present-at-the-base have merged.
Drafted by: the architect agent, alone (no engine or kernel path; the product-first direction, section 1); read at main dba12b8ccac70dd1e7ec50ecc2814a797597836e.
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a: size per §21c, new user-visible behaviour, and properties currently under test; §25(e)).

## §0. Disclosure

0.1 Inputs:
- The plan, whole, and its ruling.
- state/directives/O-07-WALKTHROUGH-2026-10-05.md.
- The layer-model ruling of 2026-09-28 (state/directives/2026-09-28-layer-model-decisions.md, items 3 and 4, and its closing provision). The design reference behind it, state/drafts/design/LAYER-MODEL-DECISIONS-2026-09-28.md §4 and §5, is not Authority.
- The design notebook, state/drafts/design/SPATIAL-IDE-DESIGN-NOTEBOOK.md §3.4 and §12. It is not Authority.
- state/directives/PORTABILITY-2026-09-30.md §2 and §5.
- ADR-001 and its 2026-08-09 amendment; ADR-006; ADR-010 rules 1, 2, 4, 5 and 6; ADR-016; ADR-022; ADR-024.
- ADR-036, which is Proposed and binds nothing, together with b2-piece-1a's form §2.1.
- state/directives/B2-BRIEF-2026-10-07.md §8 and §9.
- Milestone 1's form, Amendments 1 to 13.
- The pick-paths diagnosis, state/consults/2026-10-08-shell-pick-paths-disagree-at-1280x801-diagnosis-report.md, whole. Its runs are the worker's: they are evidence, not Authority.
- The product-first direction, sections 1, 2 and 4.
- The shell's code, styles, e2e suites, MANUAL-WALKTHROUGH.md and KNOWN-LIMITATIONS.md at dba12b8c.
- The installed `@deck.gl/core` 9.3.9 (frontends/shell/package-lock.json:452-453 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:f1ae4317359d42c653a8125c3da5b15ade19becebb5726d63badf41e5ec2401a), `dist/lib/deck.js` lines 174-243. This was read from node_modules, which is untracked. It is evidence, not Authority.
- The v7 mock, state/drafts/design/map-studio-v7-codex.html. It is a design reference only.

No pilot, no spike, nothing measured.

0.2 The reuse index (the standing step, the 2026-10-09 direction item 5).
- **The run.** The custodian ran `node tools/reuse.mjs <words>` in christopherdonini/spatial-ide-reuse at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, the tool at that commit.
  - `selection` printed two capabilities: `selection-scope-table` (open, P0) and `lod-selection-metric` (worth-owning, P1).
  - `pick` printed `spatial-index` (open, WATCH, closed by measurement).
  - `hover pick` printed a miss.
  - The custodian appends the printed lines, byte-copied by script and marked, beneath this item.
- **What this form takes from it:**
  - `selection-scope-table`'s row (christopherdonini/spatial-ide-reuse @ 89bbac37, REUSE-ROUND-1.md, row `selection-scope-table`) is CONCEPTUAL. Its consumer is b1-shell-half (milestone 4's table scope). It informs §2.6's scope words only, and no code is taken.
  - `lod-selection-metric` is level-of-detail selection, a different meaning of the word, and is not used.
  - `spatial-index` is not used: picking here is deck's GPU pick, through ADR-010 rule 2's indirection.
  - The miss for `hover pick` is noted and does not block.
- **No dependency** is proposed.

0.3 Pins.
- **What the pins mean.** Every `@ dba12b8c…` pin is historical. Three pieces merge before any code here, and they may change `e2e/regression.mjs` (K6 and A9′), the e2e fixtures and the shell's resize path.
- **The re-sweep.** At the code's base commit, after the three have merged, the custodian re-sweeps every pin, as milestone 1's Amendment 2 did at the lines cut's merge. A moved cite is class 3. An interface that differs from §0.5 is I4, or I10 if it changes a seam's shape.
- **Which is authoritative.** For the work, the tree at that base is authoritative. For what this form read, the pin is (round 14).

0.4 The shell as read.
- **One dataset.** It is held in `App` as `admitted`, with hover, style and filter beside it:
  - frontends/shell/src/App.tsx:770-771 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:926628a310bcb910faa69e6eea3314f8c2063420dec667426627f80e587e6b18;
  - frontends/shell/src/App.tsx:805 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:1ec080782840fb040e4bcc6d784d1abba5f03db2bfc3d115613fa0b636dc96a6;
  - frontends/shell/src/App.tsx:816-817 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:e31b73713cf72e6828950b94c2f475d832e4972e89f59feacf6df5f109f35385.
- **The admission reset** clears the filter and keeps the style: frontends/shell/src/App.tsx:163-205 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:4a7f625569a73453b2f2941954520a2d7d73f1b238ab8bf1b90baf844959b4a2.
- **The dataset is closed unconditionally in the `[admitted]` effect's cleanup, in both arms:**
  - frontends/shell/src/App.tsx:1447 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:8fac38b0012a99701e685c6e1a23f4feb0ff3639ebaf656e8036b3ee876db797;
  - frontends/shell/src/App.tsx:1640 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:91fb8ae7100bbab6ee8a8de5657bac32b5751fa80d7ddb2055510a74ad21b0d2.
- **The map is keyed on the dataset handle** (ADR-010 rule 1): frontends/shell/src/App.tsx:1782-1796 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:68d6f2c33954a69ca0100abbe97ddbf607a3c196a01112d6ccf9b50ccf09f8a6.
- **Hover only; no click.** The Deck is built with no `onClick` (frontends/shell/src/canvas/WorkingCanvas.tsx:1907-1918 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:f59050a21971beb2e42365303dde383956c94c5a2485fb1a25e1602a3cbcde08). The cursor function states that there is no click affordance (frontends/shell/src/canvas/pickResolution.ts:454-462 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:b262078faa691124861853b2414bfd76b184a00eb587b435758dff6838bb60f5).
- **The export never applies the filter.** It sends only a flag: frontends/shell/src/App.tsx:1969-1978 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:a8d9b976d89d4f7ec2cac70e5ea711c6771e40729d00e2120bf96aaa4db25c85, frontends/shell/src/publish/PublishPanel.tsx:292-295 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:d0c2749ac08ca532f17a95c37ebfe07ac13bc0deb6ff2d47cee2ee3c77aa23f7. Its panel says so (frontends/shell/src/publish/types.ts:127-129 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:3c8a5d3511d21c34405652c33a282b8c61963e8e3ea25ece4aac6e0eb0b71db7), under ADR-024's row-scope rule (docs/adr/ADR-024-class-3-permission-boundary-and-first-exposure.md:217-227 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:96ccfdd55fca6e7e55896f8f8568c6eaa2306ea0c66bc49b9decc6bdc2916698). See OPEN-4.
- **The generation.** It is the dataset-session generation that `open_dataset` mints, together with its `SessionRef` (protocol/skp/SKP-V0.md:175 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:08b41f7aeee637c0593c4ca2fb77f6b56c76397aadd8df7cf946d1e58ffbf3ff). Every handle is session-scoped (protocol/skp/SKP-V0.md:177-179 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:e65cbd91b85684dc2c4b469354ab7da09e539d8fa40f261e510c98bf59a880be).
  - In this form, generation always means that generation.
  - It never means the filter generation that `resetFitForNewGeneration` names.

0.5 Consuming-side interfaces, read before any seam is drafted.
- **The settle re-pick's pick:** `deck.pickObject` at a pixel, then `batchForLayerId`, then `resolvePick`:
  - frontends/shell/src/canvas/WorkingCanvas.tsx:1186-1195 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:d7c0f270c18110972bdde2934ea2c8b0b40982242117ffb7f015fdf6fe6825e9;
  - frontends/shell/src/canvas/buildLayers.ts:14-23 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:d8ed27c191c2aa3d410a29417138b789301c055f25f0bf62487acfb73214a8a2;
  - frontends/shell/src/canvas/pick.ts:134-143 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:ce156d3a79730919f8a921ef027f38be4c518ef9b749201048ea4eecb1fd5606.
- **The hover path:** frontends/shell/src/canvas/WorkingCanvas.tsx:1989-2021 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:4385c48fc726075627f5ca66b9c9511b7ecc529f42ad63a2b5eb758b0b9ff7fb.
- **The threshold and the line radius:**
  - frontends/shell/src/canvas/pickResolution.ts:194-206 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:8c2f8ea7c5ebaa63c88b1496ce3b771e0429630a264d2ade74c7cd19b4e3d7b8;
  - the pick latch, frontends/shell/src/canvas/pick.ts:104-106 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:07368a6681b10fb24575938b87d6c0ec2cef939e9da3d436f5c4f32ba2441329.
- **A batch's authoritative f64 parts, ids and partToRow:** frontends/shell/src/canvas/decodeBatch.ts:96-114 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:3a19ebcb554e08b18826e655697853cc4e1e4b27cab1ea5caf222fbbf246f96b.
- **The canvas handle and props:**
  - frontends/shell/src/canvas/WorkingCanvas.tsx:106-130 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:67da566ecdff3c9356767ec4200d8282a3dc3ba70d95c1dd6e6d6fc613124588;
  - frontends/shell/src/canvas/WorkingCanvas.tsx:499-539 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:54918179f17c8b78beb4fb0d11672347f15fe6672715c250db72e04b02b1f6cc.
- **The fit:** frontends/shell/src/canvas/WorkingCanvas.tsx:1302-1329 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:4a5e00884b3bcef88b0f42ed7598bad1af915a6501a8b335c251cfe00af33830. Render, per frame: frontends/shell/src/canvas/WorkingCanvas.tsx:1242-1269 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:14486a2402a1f595ba28640208aa6702576a0d08302c7a873e9a2d0962c78d0d.
- **The frame's seams:**
  - StudioLayout's props, frontends/shell/src/layout/StudioLayout.tsx:107-117 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:1ac2231a88254131218f77839e38f362d1b6657b11b4b15fc5d38c8262b636b7, and its listener, frontends/shell/src/layout/StudioLayout.tsx:155-164 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:4b9de67548a5b1c31ef012bdd8f09ec01b4081f7eb0c0401b6e0a1d2223698a6;
  - the tabs and slots, frontends/shell/src/layout/contributions.ts:25-28 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:8b5519a964fb5d905cec7c59150329d556e060672a941c5f6c814da74c11de08 and frontends/shell/src/layout/contributions.ts:66-72 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:a077987dda7001deb0e34b93de6f8969dd3f7c654fa73773f3e23dfbb4051044;
  - the registry, frontends/shell/src/layout/actionRegistry.ts:14-35 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:9b8c11b2ba6297b5b433f826ff3166e88635dbde4a0747e4148f9f09f1a44abb and frontends/shell/src/layout/actionRegistry.ts:73-84 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:93c3a34180377b4260810cc0a132fdb11de42d0187b520c3b7a16e983f304a05.
- **The class-C row shape:** frontends/shell/src/console/surfaceRegistry.ts:275-324 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:dc05b341f5abc2dc005e451fcd83e8104e9e75806e350b22fe8c945c8b17afde. The recorder allowlist already holds `App.tsx` (frontends/shell/src/console/soleCaptureSite.test.ts:49-61 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:ee3ab0d4b8f949e2758c84e2f47de04a40b207945c78cb0a498ccc771fb17dbc).
- **The export's execute seam** (the dialog takes `execute` as a prop): frontends/shell/src/publish/PublishDialog.tsx:119-136 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:6d9672d2cf712ef38d8f495880efacb319dfc8d72d3839f968a306e05ed4f6a4.
- **The only open:**
  - frontends/shell/src/admission/admitDataset.ts:46-48 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:4152bd51cb69601bbf0b2832319e073fdcdf09a4518a3e655b07e7454baaa1be;
  - frontends/shell/src/skp/client.ts:76-82 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:5b7c2aa4509143a60f603b839e8970ca744d91849dc71330c503812272799392.
- **The real-App render harness,** which stubs only the WebGL boundary: frontends/shell/src/App.layout.test.tsx:110-150 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:b164374b54013a9c33a465cd1bb7d99e202813d81d2c4dc24d43d47a46c4427d.
- **B2's consumer of the transitions:** ADR-036 §6's `intent` and `scope` members (docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:112-115 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:d56cbf7c4e59ee7508ddd927da09766c8aff313557b5b155904432d8f315d717 and docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:129-131 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:660b7ba4d0d9aef09c7ad38c491a8052421f06ee306f84ca8bbf93c5190103e6).
  - They are Proposed and bind nothing.
  - Piece 1b registers its actions against the transitions as they exist when 1b is formed (kernel/B2-1A-STEP-RECORD-AND-DATASET-REFERENCE-PREREGISTRATION.md:38-40 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:c05a526edd4e2492f7724b33317babe6e5bb668d59624ca173e8cde5f7b4cd6e).
- **The establishing helper.** Whatever helper `e2e-hover-establishing-read-stale` lands is read at the code base. It is not drafted here.

0.6 Hypotheses. Each carries its discriminator.
- **H1.** Deck's `onClick` fires for a tap and never at the end of a drag pan: deck's tap recognizer, deck.js 174-199. Discriminator: E-NODRAG. If it fails: I8.
- **H2.** No existing suite presses and releases on the canvas without moving.
  - Every press read is a drag: regression.mjs `doPan` and CURSOR′, console.mjs HEXLIM′, pan-anchor.mjs, source-changed.mjs, residency-harness.mjs.
  - Discriminator: a re-read at the code base, then the suites run.
- **H3.** Phase A changes nothing visible. Discriminator: every suite at the base passes unedited at phase A's head. If it fails: I7.
- **H4, today's behaviour, untraced** (plan §6.1). If the dataset is replaced while an export runs, the predicted outcome is:
  - the host's export runs on, since it holds its own `Arc<Dataset>`;
  - the export panel, keyed on the old handle, unmounts, so its progress, Cancel and outcome leave the screen;
  - nothing says so.

  Discriminator: EXPORT-TODAY, recorded and not asserted. Outcome route: OPEN-5.
- **H5.** When the candidate arm reports the view complete (its within-budget state) and a filter is applied, a selected feature whose kept bounds meet the view and that is not resident is excluded by the filter. Discriminator: a code read at the base of `isFillComplete` and of the engine's bbox predicate, recorded in the re-sweep amendment. If it is not established, that reason is never shown (§2.5).
- **H6.** A batch carries the feature's full geometry, with no simplification: SKP-V0 has no level-of-detail member. So bounds computed from a resident row are the feature's bounds. Discriminator: the same re-sweep read of `decodeBatch`.
- **H7.** Real mouse clicks reach deck's tap in WebView2. Discriminator: walkthrough row V2.

0.7 Fixtures.
- Nothing is measured.
- If a suite reads the 5 GB fixture, its drive is recorded as a confound.

## §1. May and may not claim

- **May claim:** §2's behaviour and the properties §4 tests.
- **May not claim:**
  - any performance figure or docs/08 row (the ADR-001 amendment's no-claim; the plan §6.6);
  - macOS or Linux above L1 (PORTABILITY R5);
  - that the export applies the layer's filter (ADR-024; OPEN-4);
  - that anything here is undoable, logged or saved: no transition is recorded, and the selection is not persisted (plan §6.5; ADR-006; ADR-022);
  - a selection across generations, or across a reopen;
  - a hidden-count reason whose fact the shell does not hold;
  - a count of selected features that pass the filter (OPEN-7).
- **No change** to the wire, the kernel, the engine, the protocol, src-tauri or the renderer.
- **ADRs cited, none amended:** 001, 006, 010, 016, 021, 022 and 024. ADR-036 is read as a Proposed design input, never as a binding.
- **Principle 4.** Every new GUI action records a class-C console row stating that it has no API equivalent and is view state. These are the existing precedent's rows.
- **Strings.** Every new operator string is the human's at P6 (plan §2 rule 7).

## §2. The change

Phase A is its own commit, or its own PR under OPEN-10. It is read on its own at the gate and is visibly a no-op. Phase B follows it. A part marked [OPEN-n] is binding only as Amendment 1 rules it.

### 2.1 Phase A — state keyed by view (seam 4), no visible change

**(a) New module `src/workspace/`.**
- **`workspaceState.ts`.** It holds the types, one reducer and the selectors.
- **The three identities, kept apart:**
  - `ViewId`: minted by the shell as `view-<n>`, per session, never persisted;
  - `ResourceKey`: the dataset handle, with its `Admitted` (handle, `describe`, `session`);
  - the generation: `session` plus an `ended` flag.
- **The state:**
  - `views: Record<ViewId, ViewState>`, where `ViewState` in phase A is `{ id, resource, filter, style }`;
  - `resources: Record<ResourceKey, ResourceEntry>`, where an entry is `{ admitted, generationEnded, consumers, closed }`;
  - `drawOrder: readonly ViewId[]`.
- **Actions:**
  - `resource.admitted`:
    - mints the one view on the first admission and rebinds it on every later one;
    - resets the view's filter, as today, and keeps its style, as today;
    - adds the view to the new resource's consumers and removes it from the old one's.
  - `resource.generationEnded`: written where `endSession` already runs today.
  - `consumer.released`.
  - `resource.closed`: written once, when the close has been issued.
  - `view.transition` (§2.1(b)).
- **No action adds a second view or reorders `drawOrder`.** No product needs one yet (plan §2 rule 9; the caller rule).
- **`viewTransitions.ts`.** The pure, typed transitions of seam 3 (§2.4).
- **Imports.** Nothing under `workspace/` imports React, `skp/client`, `streaming/`, `residency/` or `canvas/`, except type-only imports of `AuthoritativeBbox`, `Filter`, `StyleState` and `Admitted`.

**(b) App.tsx, phase A.** Edits above `return (` are allowed in this milestone and are declared here.
- **The store.** One `useReducer(workspaceReducer)`.
- **Where values come from:**
  - `admitted` becomes a selector over the view's resource. The same `Admitted` object is stored, so the `[admitted]` effect's dependency identity is unchanged.
  - `style` is read from the view.
  - `activeFilter` is read from the view. `activeFilterRef` stays, written in the same function as today.
- **Filter.** `commitActiveFilter` dispatches `filter.apply` in place of `setActiveFilter`. `admitAndResetStaleUiState` keeps its signature and its order.
- **Style.** StylePanel is unchanged. Its `onChange` dispatches one `style.set` per property that changed.
- **The close.**
  - The two cleanup calls to `closeDataset` (§0.4) become `consumer.released`.
  - One effect closes each resource whose consumer set is empty and that is not yet closed, exactly once, then dispatches `resource.closed`.
  - With one view, the order matches today: the new dataset is admitted, then the old one is released and closed.
- **The map slot.** It renders `drawOrder`, one entry, with each canvas keyed on its resource's handle exactly as today. This is `drawOrder`'s product reader.
- **Out of the workspace.** Hover, refusals, residency, scan state and the session latch stay where they are. They are not transitions.

**(c) Export as a consumer.**
- **H4 false:** today the export already waits or asks and never cancels silently. Then the export joins as an operation consumer in phase A, with no visible change.
- **H4 holds:** the operation consumer, its acquire and release actions, and the export's caller all land in phase B, under OPEN-5.

### 2.2 Phase B — tools and inspection

**Tools** (plan §6.2).
- `ViewState` gains `tool: "navigate" | "select"` (default `navigate`) and `selectionMode: "toggle" | "replace" | "add" | "remove"`. The default mode is set by [OPEN-2].
- **The tool switch** (`src/feature/ToolSwitch.tsx`, new) is in the top bar, through a new slot `topBar.tools`. It is never over the map (rule 11).
  - It shows the active tool (`aria-pressed`).
  - It states in one line what a click does in each tool.
  - The mode picker is shown only while Select is active.
- **The registry** gains `tool.navigate` and `tool.select`. Their keys are [OPEN-2].
  - The proposal is bare keys. They are matched by a second pure matcher, `matchToolKey`.
  - It ignores any modifier, `repeat` and `isComposing`, and it ignores any key while an input, textarea, select or contenteditable has the focus.
  - The registry also gains `selection.zoomTo` and `selection.clear`, with no shortcut.
- **The cursor** (`cursorForPointerState`) gains the tool:
  - Navigate keeps `crosshair`, so CURSOR′ is unchanged;
  - Select uses one other declared keyword [OPEN-2];
  - a drag keeps `grabbing`.

**The click** (seam: canvas to App).
- **Picking** [OPEN-1, recommended (A)].
  - WorkingCanvas sets Deck's `onClick`. It takes the tap's own `event.offsetCenter` and calls one shared `pickCandidateAt(x, y)`.
  - That function is the settle re-pick's body today, moved to a named function that both callers use. Its steps do not change.
  - Then the threshold is checked, and only above it are `resolvePick` and the row's bounds computed.
  - The pure `resolveClickPick(deps, x, y)` lives in `canvas/clickPick.ts` (new). Its `deps` type has no readout member. It never reads the hover readout and never reads deck's pointer-down info.
  - The result is `{kind:"feature", pick, bounds}`, `{kind:"below-pick-resolution"}` or `{kind:"nothing"}`. `bounds` is the authoritative f64 box over every part of the picked row (ADR-010 rule 2: looked up, never unprojected).
  - It is emitted through a new prop, `onClickPick`. App latches it as it latches the hover (`latchedHoverReadout`'s rule): once the session has ended, the result is the named session-ended state.
  - The pick is made at the tap's own pixel against the current framebuffer, in the same handler, so no screen coordinate crosses a boundary or a moment (ADR-010 rule 1).
- **In Navigate,** a feature click inspects. The Feature tab shows it, and it can be pinned [OPEN-3]. The selection is unchanged.
- **In Select,** a feature click changes the selection by the mode. Whether it also inspects is [OPEN-2], recommended no. A multi-part feature is one id, so any part selects the row.
- **A click on nothing** changes nothing in any mode [OPEN-2, recommended].
- **A refused pick** (below the 9 px rule) changes no selection and no inspection. It shows its existing named state in the Feature tab's last-click line, with the same text as HoverReadoutView's refusal (rendered from an exported constant).

**Highlight drawing** (plan §6.6; ADR-010 rule 4: a small separate layer drawn last).
- WorkingCanvas gains a prop, `highlight: {selected: ReadonlySet<bigint>, inspected: bigint | null}`.
- `render()` appends layers from `buildHighlightLayers(batches, frame, highlight, kind)` (`canvas/highlightLayers.ts`, new) after the data layers.
  - They are `pickable: false`, and their ids are prefixed `highlight:`, so `batchForLayerId` can never resolve them.
  - They draw every part of each highlighted resident row: a polygon or line outline, or a point ring.
  - Selected and inspected features are drawn in two declared encodings (§7) [OPEN-2].
- **The same single pass** returns the set of selected ids that are resident. WorkingCanvas emits it through a new prop, `onSelectionDrawnChange`, only when the set changes.
- **When the highlight is empty,** `render()` does nothing beyond one emptiness check.
- **Data layers** keep their buffers: no data layer is rebuilt for a selection.
- A highlight change schedules the coalesced render, as a style change does.

**Inspection.**
- `ViewState` gains `inspected: {pick, bounds} | null` and `pinned: boolean` [OPEN-3].
- The inspected feature is cleared, and unpinned, when its generation ends.
- The Feature tab states whether it is drawn, with the same reasons as §2.3.

### 2.3 The selection contract (seam 5), `src/workspace/selection.ts`

- **A selection** is `{resource, generation, members: ReadonlyMap<bigint, AuthoritativeBbox>}`, bound to one view. `bounds` are kept from the click.
- **The four modes:**
  - toggle: add an absent id, remove a present one;
  - replace: the set becomes this id alone;
  - add: add only;
  - remove: remove only.
- **The ceiling.** An add that would exceed SELECTION_MAX_FEATURES (§7) is refused by name, and the set is unchanged. Nothing is ever silently dropped.
- **It survives** `filter.apply`, `style.set`, a pan, a zoom, a resize and every layout action. None of them touches it. A feature that is no longer drawn stays selected.
- **The counts:**
  - selected is the member count, the set §3 labels Selected, ignoring filter;
  - hidden is the members not visible, in two groups:
    - outside the view: the kept bounds do not meet the current authoritative view box (from `onViewportChanged`);
    - in the view, not drawn: the bounds meet the view, but the id is not in the drawn set.
  - The second group carries the reason *excluded by the filter* only when H5 holds, the view is reported complete and a filter is applied. Otherwise it carries no reason.
  - No scan, no query and no reason without its fact (plan §6.3).
  - The counts are recomputed when the selection changes, when the view box settles, and when `onSelectionDrawnChange` fires.
- **The end of a generation ends the selection** (plan §6.3; ADR-010 rule 5; the ended session's ids name nothing, pick.ts:49-65).
  - The trigger is `resource.generationEnded` (the source changed) or `resource.admitted` (a reopen or a new open), whichever comes first.
  - A named notice states the count dropped and which of the two ended it. It is P6 text, stated by the shell as the selection's owner.
  - It shows in the Feature tab and as a status bar item, `status.selectionEnded`.
  - It stands until the next selection transition. It has no timer (ADR-018).
  - With nothing selected, there is no notice.
  - No selection is ever carried across generations.

### 2.4 Typed transitions (seam 3), `src/workspace/viewTransitions.ts`

- **A closed union** of `{action, params}` objects, applied by a pure `applyViewTransition(view, t)`:
  - `filter.apply {filter: Filter | null}`;
  - `style.set {property, value}`: one transition per changed StyleState property, with `outlineWidth` carried as `{value, unit:"px"}`. The style document's unit is confirmed in the re-sweep.
  - `tool.set {tool}`, `mode.set {mode}`;
  - `selection.apply {mode, id, bounds}`, `selection.clear {}`, `selection.end {reason, dropped}`;
  - `inspect.set {pick, bounds} | null`, `inspect.pin {pinned}`.
- **Shaped for B2.** The `{action, params}` shape is ADR-036 §6's `intent` member, as Proposed. `filter.apply` and `style.set` are the ones B2 records.
  - This milestone lands no B2 registry, no `kind` or collapse-key table and no converter. Piece 1b registers them (ADR-036 §6; the caller rule).
- **Not transitions:** keystrokes, hover, navigation and layout.
- **No log, no undo** (plan §6.5).

### 2.5 Scope (seam 6), `src/workspace/scope.ts`

- **The resolved scope:** `ResolvedScope = {view, resource, generation, filterAsApplied, selection: ReadonlySet<bigint> | "none"}`.
- **`resolveScope(state, view, uses)`** builds it. **`checkScope(staged, current)`** returns ok, or the list of what changed: view, resource, generation, filter or selection. The camera is not part of a scope, so a pan never refuses.
- **Each action declares its scope in the registry** and states it in words (P6):
  - `selection.zoomTo` uses Selected, ignoring filter. It is staged and run in one handler: it fits the union of the kept bounds through a new handle method, `fitToBbox` [OPEN-8], and is disabled while the selection is empty.
  - `layer.zoomToLayer` (milestone 1) declares the layer as its scope and shows no new words.
  - Export uses its own scope [OPEN-4] and never the selection.
  - Layout actions take no scope (plan §6.4).
- **The export is staged at prepare.**
  - PublishPanel gains props `stageScope` and `checkStagedScope` from App.
  - At execute, it wraps PublishDialog's `execute` prop. If the scope changed since staging, it does not call `publishExecute`; it returns a refused outcome, rendered by the panel's existing refusal path, in the shell's own P6 words. The `publishExecute` dev hook goes through the same wrapper.
  - PublishDialog, the host prompt and src-tauri are unchanged.
- **The export as a consumer** [OPEN-5]. While an export runs, PublishPanel reports it to App through `onExportRunning`, and App holds an operation consumer on the resource. Replacing or closing the dataset then follows the ruled option, and never cancels silently.

### 2.6 Surfaces

- **The Feature tab** (`src/feature/FeatureTab.tsx`, new):
  - a third Inspector tab, `feature`, through INSPECTOR_TABS and the slot `inspector.feature` (plan §13 item 3);
  - the inspected feature: the id line from HoverReadoutView's exported `idLine`, the pin, and its drawn status;
  - the last-click line;
  - the selection summary, with its counts and reasons;
  - Zoom to selection, Clear selection, and the notice.
  - It never renders an element with the class `hover-readout`.
- **Whether a Navigate click switches the Inspector to the Feature tab:** [OPEN-2].
- **The hover readout** stays over the map, as today [OPEN-6].
- **New class-C console rows, recorded in App.tsx's handlers** (already allowlisted), each with a P6 no-API-equivalent statement: `tool.set`, `selection.change`, `selection.clear`, `selection.zoomTo`, `feature.inspect` and `feature.pin`.
- **`styles.css`:** the tool switch, the Feature tab and the notice.

### 2.7 Boundaries

- **May edit:**
  - `src/App.tsx`, above and below `return (`;
  - new files under `src/workspace/` and `src/feature/`;
  - under `src/layout/`: `contributions.ts`, `actionRegistry.ts` and `StudioLayout.tsx`;
  - under `src/canvas/`: `WorkingCanvas.tsx` (the click, the highlight props, the shared `pickCandidateAt`, `fitToBbox` [OPEN-8]), the new `clickPick.ts` and `highlightLayers.ts`, `pickResolution.ts` (the cursor function only), and `HoverReadoutView.tsx` (exports only: `idLine` and its two refusal texts as constants, with the rendered text unchanged) [OPEN-8];
  - `src/publish/PublishPanel.tsx`;
  - `src/console/surfaceRegistry.ts` (rows only);
  - `styles.css`;
  - `package.json` (one script line);
  - the tests and e2e files of §7.
- **Not edited:**
  - every file outside `frontends/shell` (records excepted), and `frontends/shell/src-tauri/**`;
  - `src/skp/`, `src/streaming/` and `src/residency/`;
  - every other file under `src/canvas/`, including the bodies of `onHover` and the settle scheduler, apart from the shared-function move;
  - `layout/layoutState.ts`;
  - AdmissionPanel, DescribeSummary, FilterPanel, StylePanel, PublishDialog, ConsolePanel, NoticesPanel, RefusalBlock, ErrorBanner and OriginMismatchState.

### 2.8 End-to-end suites and operator rows

- **New suite:** `e2e/selection.mjs`, with one `e2e:selection` script line. The dependencies are unchanged. Its steps are in §4.
  - It finds a feature pixel with `capturePixels`.
  - It takes its oracle id only through the establishing helper that e2e-hover-establishing-read-stale lands. It never takes the first poll.
- **Existing suites.** None is expected to change (H2). Each file allowed in §7 G-E may change only for the reason named there; any other edit is I3.
- **MANUAL-WALKTHROUGH.md:**
  - Existing rows are updated in place only where a location word or label changes, with no row's meaning changed and no result-log text edited. None is expected under OPEN-6 (b). Any found is listed in the PR body with its old and new words.
  - **New Part, the next unused letter at the code base** (V at dba12b8c). It is O-07 steps 4, 5 and 6 on the real app, at 1366 × 768, with a blank result log:
    - V0: read §10, the last amendment first.
    - V1: open `filter-zoned.parquet`, read the tool switch and its statements.
    - V2 (step 4): Select, Replace, click five features, then Add only for one more. Felt: are the four modes clear without trying them, and can you say how the selection differs from the filter? This row also observes H7.
    - V3 (step 5): Navigate, click a selected feature, then an unselected one, open the Feature tab and try Pin. Felt: did you think the selection had changed, and are the two encodings enough to tell selected from inspected?
    - V4 (step 6): apply `zone = 'residential'` and read the summary. Felt: is the hidden count explained where you looked?
    - V5: Zoom to selection.
    - V6: pan away and back, then Clear the filter. The selection is intact.
    - V7: zoom out until the readout shows the below-resolution state, then click in Select. Nothing changes, and the state is shown.
    - V8: read the Export section's scope statement with a selection standing. Felt: did you expect export to use the selection?
    - V9: reopen. The notice names the count dropped.
    - V10: `point-p1.parquet`, `line-l1.parquet` and `multipolygon-f1.parquet`. One click selects one feature, and every part highlights.
    - V11: the P6 sight of the new strings.
  - O-07 step 5's `#` search and step 6's Table are milestones 3 and 4, and are not in this Part.
- **KNOWN-LIMITATIONS** (conditional; wording P6):
  - items 36 and 38 extend to a click under OPEN-1 (A);
  - a new item: the selection ends when its dataset is reopened or its source changes;
  - a new item: the in-view-not-drawn count may carry no reason.

### 2.9 Portability (R1 to R6)

- **No new OS boundary.**
- **Tool keys** need no platform read. Any Mod chord stays in `actionRegistry.ts`, milestone 1's one platform read.
- **The click** is deck's tap, the same for mouse, pen and touch.
- **Cursor keywords** are standard CSS.
- **Levels:**
  - Windows: supported, tested by unit, render and e2e tests and by rows V1 to V10;
  - macOS and Linux: supported by construction, L1 by unit test only;
  - L2 is deferred to PLAN node `shell-real-app-run-macos-linux`.
- **Paths:** none parsed or built.
- **No OS-conditional code, and no new ignore.**
- **Expected reduction:** none.

## §3. Fixtures and predicted outcomes

- **No new fixture:**
  - `filter-zoned.parquet`: 2,000 polygons with the `zone` column (walkthrough Part E);
  - `multipolygon-f1.parquet`, `point-p1.parquet`, `line-l1.parquet` and `multilinestring-ml1.parquet`;
  - `100k-happy-path.parquet`, for the reopen step.
- **Fixture hashes:** each fixture's sha256 is recorded before and after the run.
- **Predicted outcomes:**
  - every existing suite: PASS unedited at phase A's head (H3), and at phase B's head with only G-E's changes;
  - `e2e:selection`: PASS on every asserted step;
  - EXPORT-TODAY: H4's outcome.

## §4. Tests, and one mutation each

Every mutation is observed:
- by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it;
- a `verify-mutation` run is not an observation;
- each recorded-mutation comment is counted in §7.

| ID | Kind and file | Asserts | Mutation, and its expected failure |
|---|---|---|---|
| UA1 | unit, workspace/workspaceState.test.ts | The view is minted once and rebound on a reopen; filter reset, style kept | rebind mints a second view; fails on the view count |
| UA2 | unit, same | A resource is closable only when its consumer set is empty; it is closed once | drop the `closed` guard; fails on the second close |
| UA3 | unit, same | Permuting `drawOrder` in a constructed two-view state leaves every view's filter, resource binding and (phase B) `resolveScope` deep-equal | make `resolveScope` take `drawOrder[0]`; fails |
| UA4 | unit, workspace/viewTransitions.test.ts | Transitions are pure (frozen input); the union is exactly §2.4's names; `style.set` emits one transition per changed property | emit one whole-style transition; fails on the count |
| UA5 | unit, workspace/openDatasetBoundary.test.ts | `openDataset` is imported only by admission/admitDataset.ts, and `admitDataset` only by AdmissionPanel | add an `openDataset` import to App.tsx; fails naming it |
| UA6 | unit, workspace/workspaceBoundary.test.ts | §2.1(a)'s import rule | add a value import of canvas/extent; fails |
| RA1 | render, src/App.workspace.test.tsx (the harness of App.layout.test.tsx) | Across admissions, Apply, style edits and every layout action: openDataset calls equal the admissions; closeDataset is called once per replaced handle, after the new admission; the map is mounted once per handle | close on release without the empty-set check; fails |
| RA2 | render, same | A reopen resets the filter and keeps the style, through the real App | keep the filter on rebind; fails |
| EXPORT-TODAY | e2e, e2e/selection.mjs, recorded not asserted | H4: start an export, reopen, record the panel, the host outcome and any text | none: an observation |
| UB1 | unit, workspace/selection.test.ts | The four modes; one id per multi-part row | make toggle add only; fails |
| UB2 | unit, same | The ceiling refuses by name and leaves the set unchanged | drop the check; fails at ceiling + 1 |
| UB3 | unit, same | Counts by reason: outside view from bounds; in view, not drawn; the filter reason only under H5's facts; never without them | show the filter reason with no filter; fails |
| UB4 | unit, same | Generation end and rebind end the selection with the dropped count and the reason; none when empty | carry members across rebind; fails |
| UB5 | unit, same | `filter.apply`, `style.set` and a view-box change leave members unchanged | clear on `filter.apply`; fails |
| UB6 | unit, workspace/scope.test.ts | `checkScope` names each of the five changes and ignores the camera | omit the filter comparison; fails |
| UB7 | unit, canvas/clickPick.test.ts | Below threshold: the refusal, with no resolution run; no candidate: nothing; a candidate: the pick plus bounds over all parts | compute bounds from the picked part only; fails on a two-part row |
| UB8 | unit, same | With a readout standing on A and the candidate on B, the result is B; `deps` has no readout member (structural) | add a readout dep and prefer it; fails |
| UB9 | unit, canvas/highlightLayers.test.ts | An empty highlight builds nothing; layers are non-pickable, prefixed and appended last; every part is drawn; the drawn set is correct | set `pickable: true`; fails |
| UB10 | unit, layout/actionRegistry.test.ts | Tool keys map; they are ignored in text fields, with any modifier, on repeat and while composing; ids are unique | drop the text-field guard; fails |
| UB11 | unit, canvas/pickResolution.test.ts | The cursor per tool; Navigate stays `crosshair` | swap the two tools' cursors; fails |
| RB1 | render, src/App.selection.test.tsx | A Navigate click inspects, and the selection is unchanged; one `feature.inspect` row | route Navigate to select; fails |
| RB2 | render, same | A Select click in each mode changes the selection; one `selection.change` row | ignore the mode; fails |
| RB3 | render, same | Apply through FilterPanel: the count is unchanged and the hidden count is shown | clear on Apply; fails |
| RB4 | render, same | Reopen, and session ended: the notice with the count, and the selection empty | no notice; fails |
| RB5 | render, same | A refused click changes nothing, and the named state is shown | select on refusal; fails |
| RB6 | render, same | Zoom to selection calls `fitToBbox` once with the union; it is disabled when the selection is empty | fit the first member only; fails |
| RB7 | render, same | Export: staged, then the filter changes, then execute is refused and `publishExecute` is not called; unchanged scope, it is called | skip the check; fails |
| RB8 | render, same | Export with and without a selection: identical `publishPrepare` arguments; the statement is shown | pass the selection; tsc or the assertion fails |
| RB9 | render, same | The tool switch is outside the map region, with `aria-pressed`; a tool key typed in the filter input does nothing | mount the switch inside `.region-map`; fails |
| RB10 | render, same | The map is mounted once per handle across tool, selection and inspection actions | key the map on `tool`; the count reaches 2 |
| RB11 | render, same [OPEN-3] | Pin as ruled | ignore pin; fails |
| RB12 | render, same [OPEN-5] | Export during a reopen, as ruled; never a silent cancel | release the consumer on unmount; fails |
| E-CLICK | e2e, selection.mjs | Navigate, on a polygon: the Feature tab's id equals the oracle id at that pointer | resolve ordinal + 1; fails |
| E-SELECT | e2e, same | A Select click: count 1, and the highlight colour in the pixel region | make the highlight transparent; fails |
| E-NODRAG | e2e, same | A drag pan in Select changes no selection (H1) | select on `pointerup`; fails |
| E-SEL-FILTER | e2e, same | Apply `zone = 'residential'`: count unchanged, hidden ≥ 1; Clear: hidden 0 | clear on Apply; fails |
| E-SEL-PAN | e2e, same | A pan away and back: count unchanged | clear on view change; fails |
| E-GEN | e2e, same | A reopen: the notice and its count, selection 0 | carry members; fails |
| E-REFUSED | e2e, same | Below threshold: a click changes nothing, and the state is shown | select on refusal; fails |
| E-ZOOMSEL | e2e, same | After panning off, Zoom to selection puts the selected feature's pixel back on screen | fit the anchor instead; fails |
| E-EXPORT | e2e, same | With a selection, the prompt's row scope and the bundle's row count equal the run without | send selected ids; fails |
| E-SCOPE | e2e, same | Prepare, change the filter, execute: refused, and no bundle written | skip the check; fails |
| E-KINDS | e2e, same | Point, line and multipolygon: one id per click; a second part of the same feature gives the same id | resolve the part ordinal as the row; fails on F-1 |
| E-CLICK-FAST | e2e, same [OPEN-1 (A)] | A move from the centre feature to the candidate, clicked at once, selects the candidate's id | read the readout; fails where the stale read reproduces (an odd map height, set by `setViewportSize`). It is race-dependent: if three runs do not fail, that is recorded as class 2, and UB8 is the deterministic proof |

**Each acceptance item of plan §6.8, and what proves it:**
- **The selection survives a filter change, with the hidden count:** UB5 and UB3 (unit), RB3 (render), E-SEL-FILTER (e2e), and V4 (felt).
- **It survives a pan:** UB5, E-SEL-PAN and V6.
- **A new generation ends it, with the notice:** UB4, RB4, E-GEN and V9.
- **A refused pick selects nothing:** UB7, RB5, E-REFUSED and V7.
- **A scope that changed between staging and running refuses:** UB6, RB7 and E-SCOPE.
- **Export states the filter scope and ignores the selection:** RB8, E-EXPORT and V8.
- **The human's sitting:** V2 to V4, for O-07 steps 4, 5 and 6, felt.

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H7 as stated, and §3.

**Declared unchanged:**
- §2.7's not-edited list;
- the map's key, and the remount on a new handle;
- the bodies of the hover pick and the settle re-pick, the 9 px threshold and the 4 px line radius;
- every existing string except §2.8's and OPEN-9's;
- the approval dialog and the host prompt;
- ADR-021's liveness and Cancel;
- tauri.conf.json, the dependencies and the lockfile;
- the class A and B rows;
- every KNOWN-LIMITATIONS item except §2.8's.

**Invalidators.** Each one means STOP and report.
- **I1:** an edit is needed in a declared-unchanged area.
- **I2:** a dependency seems necessary, for example a dashed line. That is the human's question.
- **I3:** an e2e failure not caused by a §7 G-E change. It is recorded as class 2, and the human is asked.
- **I4:** a §0.5 interface differs at the code base.
- **I5:** ADR-036 is accepted with a different `intent` shape before the transition code.
- **I6:** a test can pass only by mocking `workspace/`, `selection.ts` or `scope.ts`.
- **I7:** H3 fails.
- **I8:** H1 fails.
- **I9:** code of an OPEN item is needed before its ruling.
- **I10:** a prerequisite piece changes a seam this form drafts against beyond what a class 3 re-sweep can carry.

**Falsification.** The form is wrong if, at the code base, either:
- a selection cannot be kept outside the keyed canvas without editing `streaming/` or `skp/`; or
- a click cannot be resolved through `pickCandidateAt` and `resolvePick` without deck's unprojected coordinate.

## §6. Instruments

- **Assertions:** every U, R and E row.
- **Observation:** EXPORT-TODAY.
- **Measurements:** none.
- **The human's:** V2 (also H7), and V3, V4 and V8 (felt).

## §7. Declared values and ceilings

**Constants.** They are declared in `workspace/selectionConstants.ts` and `canvas/highlightLayers.ts`, each with what it bounds (ADR-010 rule 6).

| Constant | Value | Bounds |
|---|---|---|
| SELECTION_MAX_FEATURES | 10,000 | members of one selection; refusal by name above it |
| SELECTED_OUTLINE_RGBA / INSPECTED_OUTLINE_RGBA | [0, 90, 255, 255] / [255, 170, 0, 255], P6 placeholders | the two encodings, solid (a dashed line needs a dependency, I2) |
| HIGHLIGHT_OUTLINE_WIDTH_PX | 3 | the polygon and line outline |
| HIGHLIGHT_POINT_RING_RADIUS_PX | 7 (POINT_RADIUS_PX + 3) | the point ring |
| Defaults | Navigate; the mode per OPEN-2; nothing pinned | the first state of a view |

**Budget.** Insertions plus deletions, tests included, by `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`.
- `<base>` is the merge base with origin/main when the code branch is cut.
- If main is merged into the branch, the count is taken from the merge base after that merge, and the record names it (milestone 1, Amendment 9, item 7).
- Under OPEN-10 (b), each PR counts its own phase's groups from its own base.

**How the figures were built.** They are bottom-up, per file, and do not come from the plan.
- The test groups include about 3 recorded-mutation comment lines per test.
- G-E names every e2e file that may change, with a disclosed margin of 100 lines for steps added after a gate finding (E-FLOOR's precedent).
- A re-aim ruled later is class 9 for its scope and class 8 for its lines.

| Group | Files (ceiling each) | Lines, at most |
|---|---|---|
| A-P phase A product | workspace/workspaceState.ts ≤ 260, workspace/viewTransitions.ts ≤ 120, App.tsx ≤ 220 | 600 |
| A-T phase A tests | UA1–UA6 (4 files) ≤ 450, App.workspace.test.tsx ≤ 350 | 800 |
| B-W workspace | selection.ts ≤ 300, scope.ts ≤ 140, selectionConstants.ts ≤ 30, and the two phase A files ≤ 160 more | 630 |
| B-C canvas | WorkingCanvas.tsx ≤ 200, clickPick.ts ≤ 120, highlightLayers.ts ≤ 220, pickResolution.ts ≤ 20, HoverReadoutView.tsx ≤ 12 | 572 |
| B-A App.tsx | phase B | 420 |
| B-L layout and feature | contributions.ts ≤ 30, actionRegistry.ts ≤ 90, StudioLayout.tsx ≤ 140, FeatureTab.tsx ≤ 300, ToolSwitch.tsx ≤ 140 | 700 |
| B-X other product | PublishPanel.tsx ≤ 100, surfaceRegistry.ts ≤ 60, package.json ≤ 2 | 162 |
| B-S styles.css | | 200 |
| B-T phase B tests | UB1–UB11 (7 files) ≤ 1,050, App.selection.test.tsx ≤ 700 | 1,750 |
| G-E e2e | selection.mjs ≤ 650 (phase A ≤ 100), layout.mjs ≤ 20 (the Inspector's third tab only), regression.mjs ≤ 20 (only if H2 fails at the re-sweep), publish.mjs ≤ 20 (only if a fixture path is shared), margin 100 | 810 |
| **Total** | **about 30** | **6,644** |

**Outside the count, declared for the record:**
- MANUAL-WALKTHROUGH.md ≤ 140;
- e2e/README.md ≤ 30;
- KNOWN-LIMITATIONS.md ≤ 30.

An overrun is class 8, and this section is never edited to match.

## §8. Block-on-sight

1. A file edited outside §2.7's may-edit list, records excepted.
2. A dependency or lockfile change.
3. A selection or inspection taken from the hover readout or from deck's pointer-down info [OPEN-1 (A)].
4. A new element over the map (rule 11).
5. The map keyed or remounted by anything but its handle.
6. A selection or tool action that calls SKP. Zoom to selection's fit issues only the query any fit issues.
7. A count explained by a scan or a query, or a reason shown without its fact.
8. A selection carried across generations, or persisted.
9. The export receiving the selection, or any change to the host prompt or to src-tauri.
10. A refused pick that changes the selection.
11. An action run against a scope that differs from its staged scope.
12. A transition log, an undo, or the word undoable.
13. A layout action with a scope, or layout state in the workspace.
14. Highlight layers that are pickable.
15. The Feature tab rendering the class `hover-readout`.
16. A phase A commit with a visible change.
17. An e2e edit outside G-E; a walkthrough row whose meaning changes; a result-log edit.
18. A new operator string outside §2.8 and OPEN-9, or one neither marked nor sighted.
19. A registry entry, callback, option, prop or export without a product caller; the instrument exemption only as defined.
20. A path parsed or built in TypeScript, or a platform read outside actionRegistry.ts.
21. A performance claim.
22. A quote of the human's words marked verbatim that does not match its source.
23. A new test without its observed mutation.
24. Code of an OPEN item before its ruling is recorded.

## §9. Gates

- **Architect and reviewer,** full gating. Verdicts follow the product-first direction, section 2:
  - Correctness or Evidence blocks;
  - a Documentation finding is fixed in the same PR before the merge;
  - each gate checks §8 item by item.
- **Suites,** green first:
  - `npm run verify`;
  - every e2e suite at the code base, listed in the PR body, plus `e2e:selection`;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each named with its commit.
- **Operator.** The new Part, committed with a blank log and queued to the sitting. The felt verdict and the P6 sight are the human's.
- **Owner's index.** None for frontends/shell was found at milestone 1's base. If the custodian names one at the code base, the worker updates its lines in this PR.

## §10. Amendments

Opens empty, append-only.
- Amendment 1 records the human's rulings.
- A re-sweep amendment at the code base (§0.3) follows before any code.

## §11. Open items for the human

The full options are in the question round.

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | The click's own pick | (A) | no |
| OPEN-2 | Telling inspect from select | the package | yes |
| OPEN-3 | Pin | (a) | yes |
| OPEN-4 | Export's scope against ADR-024 | (A) | yes |
| OPEN-5 | An export during a reopen | (a) ask, after EXPORT-TODAY | yes |
| OPEN-6 | The hover readout and the Feature tab | (b) | yes |
| OPEN-7 | The §3 labels in milestone 2 | (A) | yes |
| OPEN-8 | The canvas boundary exceptions | (A) | yes |
| OPEN-9 | P6 wording | (a) | no |
| OPEN-10 | One PR or two | (b) | no |

Red lines are ruled in typed words only. Each answer is recorded as Amendment 1 before dispatch.

## §12. Heavy runs

The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ dba12b8ccac70dd1e7ec50ecc2814a797597836e sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1. This form names no other rule for builds.
