*Custodian's filing note (2026-10-12): the worker-high's report on a read-only diagnosis of four e2e failures at 9773d5c0 (the custodian's e2e checkout, read only; no write call in its transcript), the run 2026-10-12T08:34:07Z to 2026-10-12T08:45:14Z by its transcript (Read 3, Bash 47); its one SubagentHandback call, at 08:45:13Z. It arrived as a message and is extracted here by script. 0 rooted path:line cite(s) are de-rooted by script (written as line N of a path, at the head) and one final newline is added; nothing else is changed. The message's sha256 as handed back is b6f35781cead6941cc52008bb32319ba9692c201b5c28068b628cdb0b177d864; this file's, from line 5 to the end, is b6f35781cead6941cc52008bb32319ba9692c201b5c28068b628cdb0b177d864.*

---

DIAGNOSIS (read only; nothing edited, committed or run; C:/dev/wt/mm2b untouched; C:/dev/wt/mm2b-e2e read only at 9773d5c0). Paths are frontends/shell/ unless stated. Q1 is decided: a test defect, fully explained. Q2 is undecided: no id-0 product defect exists on the click path, and the run did not log enough to name the real cause.

## Q1. `.filter-predicate` and `.publish-disclosure` are hidden: TEST DEFECT (decided)

Cause, chain:
1. Both live in the Inspector's Layer tab panel, not in the Feature tab.
   - `.filter-predicate`: `src/filter/FilterPanel.tsx:101`, mounted by `src/App.tsx:1837` (slot `section.filter`).
   - `.publish-disclosure`: `src/publish/PublishPanel.tsx:543`, mounted by `src/App.tsx:2192` (slot `section.export`).
   - Both sections are in `LAYER_SECTIONS`, `src/layout/contributions.ts:34-38`.
   - They render inside the tabpanel `#inspector-panel-layer`, which carries `hidden={state.inspector.tab !== "layer"}` at `src/layout/StudioLayout.tsx:277` @ 9773d5c0. The sections' content div is at `StudioLayout.tsx:292-294`.
   - So while any other tab is active the elements are in the DOM and not visible. That matches the Playwright call log: locator resolved, element is not visible.
2. Nothing in the product switches the tab.
   - The active tab changes only by a tab button click: `src/layout/regionParts.tsx:61`, then `selectTab` at `src/layout/layoutState.ts:76`.
   - The default is Layer: `layoutState.ts:50`.
   - `src/App.tsx` has no `selectTab` dispatch; grep finds none.
   - This is the form's RB14 (a Navigate click leaves the Layer tab active; B6 in Amendment 1, grep line 732 of the form on main). Stage 5's report says the same.
3. The test itself brings the Feature tab forward and never goes back.
   - `e2e/selection.mjs:156` defines `showFeatureTab`.
   - It is called at `selection.mjs:263` (stepClick, with the comment B6) and again at `selection.mjs:444` (stepKinds).
   - E-CLICK now runs for the first time, so the Feature tab stays active for E-SEL-FILTER (`:365`), E-SCOPE (`:531`) and EXPORT-TODAY (`:606`). All three use Playwright `page.fill` or `page.click`, which wait for visibility.
4. This is consistent with every result, in both runs.
   - At d7f61f1c E-SCENE failed, so `showFeatureTab` never ran and the Layer tab stayed active. E-SEL-FILTER, E-SCOPE and EXPORT-TODAY passed.
   - E-EXPORT passes at 9773d5c0 because it uses only `page.evaluate`: `prepareExport` at `:491`, the hook calls, and the sentence read at `:516`. A DOM `.click()` and a `textContent` read both work on a hidden element.
   - `readTab` and `featureAction` also work with the Feature tab hidden (`:124-155` use `textContent` and `.click()` through `evaluate`), so no step needs the Feature tab visible.

Smallest fix (prose, not applied), all in `e2e/selection.mjs`:
- Add next to line 156 a helper `showLayerTab` that does `page.evaluate(() => document.getElementById("inspector-tab-layer")?.click())`. The id format is `${idPrefix}-tab-${tab.id}` at `regionParts.tsx:54`.
- Call it in `runStep`'s `finally` (`selection.mjs:557-559`), after `clearTimeout(timer)`, as `await showLayerTab(page).catch(() => {});`. The `.catch` keeps a broken page from masking the step's own result.
- That one call restores the Layer tab after E-CLICK and E-KINDS. EXPORT-TODAY runs in `main` after `runSelectionSteps` returns, so it is covered too, and so is stage 7's E-ASK.
- The alternative, three explicit calls at the start of stepSelFilter, stepScope and before line 606, is equivalent but longer.
- No product change. A Navigate click must not switch the tab (RB14).

## Q2. E-KINDS (point): the click inspected nothing: UNDECIDED. No id-0 defect found.

Id 0 is not treated as false anywhere on the path. I read each hop:
- `src/canvas/WorkingCanvas.tsx:1236-1244` (`pickCandidateAt`) tests `info.index === undefined || info.index < 0 || !info.layer`. Ordinal 0 passes; there is no truthiness test on the index.
- `src/canvas/clickPick.ts:40-47`: only null tests (`candidate === null`, `pick === null`, `bounds === null`).
- `src/canvas/pick.ts:134-143` (`resolvePick`) uses `Number.isInteger` and range checks only.
- `src/feature/clickEffect.ts:51-72` has no id test.
- `src/workspace/viewTransitions.ts:115-125` sets `inspected` as an object.
- `src/App.tsx:827` uses `inspected === null ? null : inspected.pick.id`.
- `src/canvas/highlightLayers.ts` compares `highlight.inspected === null` and `=== id`; the section I read has no truthiness test.
- `src/feature/FeaturePanel.tsx:61` uses `Set.has(bigint)`.
- `src/canvas/HoverReadoutView.tsx:33-34` (`idLine`) is `pick.id.toString()`. The only truthiness test there is on `pick.anchor`, an array, which is truthy even at 0,0.
- A repo-wide grep over the id path found no `!id`, `||` or bare `0n` test.

The test's own reading is also fine. `readTab` (`selection.mjs:131`) matches `^id (\d+)` and returns the digit string, so id 0 gives the string 0, not null. The oracle string 0 passes `!== null` in `hoverReadoutId` (`e2e/lib.mjs:631-633`). The `pollUntil` predicate at `:446` is `t.id !== null`. A null therefore means `.feature-id` was absent for the whole 5 s poll, which means `inspected` stayed null: the click never inspected. Id 0 is likely just the first row of the point file.

Point data is also not at fault at decode or bounds. A point row is `[[[[x, y]]]]` (`decodeBatch.ts:84-86` doc, 169-175 code), so `boundsOfRow` (`clickPick.ts:36-38`, via `extent.ts` `extentOfBatch`) returns a degenerate non-null box. `rowGeometry` in highlightLayers handles the same shape.

What differs from the passing polygon cases (E-CLICK, and E-KINDS multipolygon in the same step) is the target size. A point is an 8 px disc: `buildLayers.ts` `POINT_RADIUS_PX = 4`, `pickingRadiusFor` is undefined for points at `pickResolution.ts:194-196`, so the pick is exact-pixel. The hover and the tap otherwise share `pickCandidateAt` and the same threshold, so the only systematic difference I found is the pointer pixel:
- Hover: the hover pointer is unrounded. `node_modules/mjolnir.js/dist/inputs/move-input.js:119-122` sets center to `event.clientX` and `event.clientY` as is.
- Tap: the tap center is rounded by Hammer. `node_modules/mjolnir.js/dist/hammerjs/input/get-center.js:9-10` is `Math.round(pointers[0].clientX)`, and `utils/event-utils.js:65-68` subtracts the rect from it. `deck.js:158-161` and `:178` show both paths use `offsetCenter`.
- The test hovers at `bufferPointToCss(...)` (`lib.mjs:408-419`, called at `selection.mjs:223`), a half-pixel-centred fractional CSS point. The click at `selection.mjs:445` uses that same point, but Hammer rounds it, so the tap pixel can differ from the hover pixel by up to 0.5 CSS px per axis.
- By my arithmetic that cannot leave a dot whose 5x5 neighbourhood was verified (`INTERIOR_PATCH_RADIUS = 2`, `lib.mjs:400`), because a verified centre sits within about 1 px of the dot centre. So this is a hypothesis (H1), not a cause. It becomes live only if `hits[0]` was not a verified centre, for example if a wrong-flip hover answered at a dot's edge.

Other candidates I could not exclude by reading (H2): the tap inspected and something cleared it within 400 ms; the tool was not Navigate at the click; `belowPickResolutionNow` flipped between the hover and the click (`averagePointSpacing` is residency-dependent); or the tap was not delivered. None has code evidence at 9773d5c0.

Gap worth recording: no unit or render test of the click path uses a point batch or id 0n. `clickPick.test.ts` and `App.selection.test.tsx` have no point fixture, and the only 0n tests are decode and pick tests (`decodeBatch.test.ts`, `pick.test.ts:93`). So the click on a point is first exercised by this e2e.

What the next run should log (this decides it). Extend the failure message at `selection.mjs:447` to print the whole `inspected` object from `readTab`, not just `.id`:
- `lastClick` and `lastClickClass`: the text no feature there means the tap ran and its pick found nothing (H1 or threshold); the below-resolution class means the threshold flipped; null means no tap was delivered or the tool was not Navigate.
- `selected`, `notice` and `sessionEnded`.
- Which `.tool-switch-button` has `aria-pressed` true.
- The hover readout text at click time.
- `hits[0].css` with its fractions, `window.devicePixelRatio`, and `canvasRect`.
- Optionally one page-side capture listener installed before the click, recording the click event's `clientX` and `clientY`. It shows the rounding delta.

If `lastClick` says no feature there, add a log-only retry on failure: click once at the integer-rounded point and once at the dot's buffer-pixel centre, and print which inspects. That separates H1 from H2.

Fix (conditional on the log showing H1): in `hoverHits` (`selection.mjs:223`) round both coordinates of the CSS point to integers before the hover, so the hover pixel equals Hammer's tap pixel. That is not a barrier and not an establishing read, so §8 item 32 is untouched. If the log shows a non-rounding cause, there is no fix to name yet. If it proves a product defect, the files are in §2.7's list (`src/canvas/clickPick.ts`, `WorkingCanvas.tsx`, `src/feature/clickEffect.ts`); I would then write a failing test first.

If a product defect is proven, the guard I would add:
- Test: `src/canvas/clickPick.test.ts`, a resolveClickPick over a point batch with ids starting at 0n, expecting a feature with the degenerate bounds and id 0n.
- Mutation to observe: make `boundsOfRow` return null for a zero-extent box.
- App-level test: `App.selection.test.tsx`, a Navigate click on id 0n showing id 0 in the Feature tab.

Neither passes or fails differently on the current code by my reading, so they are guards, not repros.

## Allowance and §2.7

- Q1's fix is 2 lines added to `e2e/selection.mjs`. The Q2 diagnostics are about 4 to 6 lines (the rounding fix, if used, is a further line or two), so the total is about 12 counted lines or fewer. The stepfix report put `selection.mjs` at 570 on the §7 count (562 added, 8 deleted). That is about 582 now.
- With stage 7's E-ASK (AM7-E, +70) it is about 652. That is under the about 660 ceiling and the 650-plus-margin G-E line, but with roughly 8 lines to spare, so keep the diagnostics to the minimum. A modified line counts twice in the numstat.
- Every change is in `e2e/selection.mjs`, which is an e2e file of §7 (form §2.8 line 313; G-E and the AM1-E and AM7-E lines). No product file, no `lib.mjs`, no `layoutState.ts` (§2.7 says not edited), no `StudioLayout.tsx`.

Files read: `e2e/selection.mjs`, `e2e/lib.mjs`, `src/layout/{StudioLayout.tsx,layoutState.ts,contributions.ts,regionParts.tsx}`, `src/feature/{FeatureTab.tsx,FeaturePanel.tsx,clickEffect.ts}`, `src/canvas/{WorkingCanvas.tsx,clickPick.ts,pick.ts,pickResolution.ts,highlightLayers.ts,decodeBatch.ts,extent.ts,buildLayers.ts,HoverReadoutView.tsx}`, `src/workspace/{viewTransitions.ts,workspaceState.ts}`, `src/App.tsx`, and mjolnir.js and @deck.gl/core under `node_modules`; all under C:/dev/wt/mm2b-e2e at 9773d5c0.
