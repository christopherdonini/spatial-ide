*Custodian's filing note (2026-10-12): the worker-high's report on milestone 2's phase B, stage 4 of 8, branch cut/shell-migration-milestone-2-phase-b, at e4940dbe3fb234fc103a60c4b504575a2c70fd5e, the run 2026-10-12T06:25:39Z to 2026-10-12T06:49:55Z by its transcript (Read 7, Bash 84, Write 8); its one SubagentHandback call, at 06:49:54Z. It arrived as a message and is extracted here by script, with no rooted path:line cite and no profile path in it; one final newline is added and nothing else is changed. Its sha256, from this file's line 5 to the end, is aced38fa61e7cedac710d0f01088c8f1941da7fca49a2c1c5af4630fdb786c71.*

---

STAGE 4 of 8, phase B (the layout surfaces), is built, verified and pushed. I ran no e2e suite. Model: Sonnet 5.5 as the harness states, no override, no context handoff.

**HEAD**
- Head is e4940dbe3fb234fc103a60c4b504575a2c70fd5e, equal to origin/cut/shell-migration-milestone-2-phase-b after a plain push. It was cut from 1de68a61 and the porcelain was empty at the start.
- f49599353db52445c07e941e326c73f0c44a8925 is the code and tests commit: "feat: phase B stage 4, the layout surfaces ...".
- e4940dbe is the comments-only commit: "feat: phase B stage 4, the observed mutation of each test recorded (comments only)".
- Both are signed off and end with the Co-Authored-By trailer.
- f4959935 was amended once, locally and before any push, to move mutation-comment placement. No merge, rebase or force-push.

**CHANGES BY FILE** (all under frontends/shell/src)
- layout/contributions.ts:
  - The Feature tab is added as the third entry of INSPECTOR_TABS.
  - `topBar.tools` joins SlotId.
  - New INSPECTOR_SLOT_TABS lists every tab except Layer.
  - INSPECTOR_SLOT_IDS is now derived from it, so it includes `inspector.feature`.
- layout/actionRegistry.ts:
  - New ids `tool.navigate` and `tool.select` (bare `N` and `S`, labels Navigate and Select), `selection.zoomTo` (label Zoom to selection) and `selection.clear` (label Clear selection).
  - ActionEntry gains `bareKey` and `scopeWords`. `scopeWords` is "Selected, ignoring filter" for zoomTo and null for the rest.
  - New exports: `actionEntry`, `ToolActionId`, `FocusLike` and `matchToolKey(event, focus)`.
  - matchToolKey ignores any of Ctrl, Meta, Alt or Shift; ignores `repeat` and `isComposing`; and ignores any key while an input, textarea, select or contenteditable holds it.
- layout/StudioLayout.tsx:
  - Renders the `topBar.tools` slot inside the header, after the title and before the toggles. No wrapper is rendered when the slot is empty.
  - Renders one tabpanel per slot tab, so the Feature panel is `#inspector-panel-feature`.
  - New optional prop `onSelectTool(tool)`. The one keydown listener calls matchToolKey after matchChord. It reads `event.target` when that is an Element and falls back to `document.activeElement`.
  - With no handler, a bare tool key is left alone, not consumed.
- feature/ToolSwitch.tsx (new view):
  - Two `aria-pressed` tool buttons, labelled and keyed from the registry.
  - One statement line per tool.
  - The mode picker shows only while Select is active: Add / remove, Replace, Add only, Remove only.
- feature/FeatureTab.tsx (new view):
  - The id line from `idLine`, the Pin button, the drawn status, and the last-click line (both refusals use HoverReadoutView's own constants).
  - "Selected, ignoring filter: N" plus the outside-the-view and in-view-not-drawn lines, shown only when known, with no reason.
  - The notice, Zoom to selection and Clear selection (both disabled while nothing is selected), and Zoom to selection's scope line. It never renders `hover-readout`.
  - Exports the prop contract stage 5 consumes: FeatureTabProps, InspectedStatus ("drawn" | "outside-view" | "in-view-not-drawn") and LastClick.
- console/surfaceRegistry.ts:
  - Six class-C rows: `tool.set`, `selection.change`, `selection.clear`, `selection.zoomTo`, `feature.inspect` and `feature.pin`.
  - Edited an existing string: the `layout.selectInspectorTab` statement now says "Layer, Style and Feature tabs" (see NOTES).
- styles.css: +92 lines for the tool switch (two rows inside the 40px bar) and the Feature tab.
- App.tsx: +5 lines, `"topBar.tools": null` and `"inspector.feature": null`. This is the minimum its `Record<SlotId, ReactNode>` needs to compile. No other App change.
- Amendment 2 item 5's two edits:
  - App.layout.test.tsx R4's three arrays (+3/-3).
  - actionRegistry.test.ts, the U5 exact-id test, now eight ids with a title citing "question round 66, item 2" and "RULED 2026-10-09, eight forms, item 4".
  - Both are as written, and the first landed unedited otherwise.
- New tests:
  - actionRegistry.test.ts: UB10 added.
  - layout/StudioLayout.test.tsx: new, 6 tests.
  - feature/ToolSwitch.test.tsx: new, 5 tests.
  - feature/FeatureTab.test.tsx: new, 9 tests.

**CALLER RULE** (grep in my working notes)
- Live in the product build at this head:
  - INSPECTOR_SLOT_TABS: StudioLayout.tsx:299 and contributions.ts:88.
  - `topBar.tools` and `inspector.feature`: rendered by StudioLayout, filled with null by App.tsx:2026-2027.
- Reachable only through the stage-5 consumer, so under the second exemption. The consumer is App.tsx, named by form §2.2, §2.6 and §7 B-A:
  - `ToolSwitch` and `FeatureTab` with their types. Consumer: App fills the two slots.
  - StudioLayout's `onSelectTool`. App does not pass it yet, so bare N and S are inert.
  - `matchToolKey`, `actionEntry`, `ToolActionId`, `bareKey` and `scopeWords`. Their callers today are StudioLayout's listener and the two views, which App does not mount yet.
  - The six surfaceRegistry rows. Per §2.6 they are "recorded in App.tsx's handlers" (stage 5). The registry's ids `selection.zoomTo` and `selection.clear` are likewise called through the FeatureTab buttons by App's handlers.
- `FocusLike` is a type exported for the matcher's signature and the test.

**TESTS AND MUTATIONS**
- Each mutation was applied to the tree of f4959935, the test file run, the failing test read, and the file restored. The script confirmed each file clean afterwards. The failures are recorded in each test's comment.
- actionRegistry.test.ts (9):
  - U5 eight ids: delete the `selection.clear` entry. Failed on the eight-ids test: expected 7 ids to equal 8.
  - UB10 keys: give Navigate the S key. Failed: expected null to be 'tool.navigate'.
  - UB10 code fallback: match on `key` alone. Failed: Cyrillic physical N gave null.
  - UB10 Latin never falls back: match on key OR code. Failed: expected 'tool.navigate' to be null.
  - UB10 modifier, repeat and composition: drop altKey. Failed: "alt + n: expected 'tool.navigate' to be null".
  - UB10 chord is not a tool key: give tool.select the chord Mod+S. Failed: expected 'tool.select' to be null.
  - UB10 text-field guard: delete the guard. Failed: `{"tagName":"INPUT"}` returned 'tool.navigate'.
  - UB10 four entries: relabel Zoom to Selection. Failed on the labels array.
  - UB10 scope words: give Zoom to layer scope words. Failed on the scope list.
- StudioLayout.test.tsx (6):
  - Move the tools slot out of the header. Failed: expected false to be true.
  - Render the style slot in every tab panel. Failed: expected 'the style panel' to contain 'the feature panel'.
  - Drop `inspector.feature` from INSPECTOR_SLOT_IDS. Failed: the empty-Inspector text length was 3 where 0 was expected.
  - Swap the tool mapping. Failed: ['select','navigate'] vs ['navigate','select'].
  - Pass a null focus to the matcher. Failed: expected true to be false.
  - preventDefault before the handler check. Failed: expected true to be false.
- ToolSwitch.test.tsx (5):
  - Inverted aria-pressed: expected [false,true] to equal [true,false].
  - Navigate given Select's statement: the line did not contain the Navigate statement.
  - onClick hands over the other tool: ['navigate','select'] vs ['select','navigate'].
  - Picker always shown: expected the picker to be null.
  - onSelectMode(mode) instead of the clicked mode: ['add','add'] vs ['replace','remove'].
- FeatureTab.test.tsx (9):
  - `onPin(pinned)`: ['pin false','pin true'] vs ['pin true','pin false'].
  - Pin button in the empty branch: the button was not null.
  - Status shown with a null status: `.feature-status` was not null.
  - Below-resolution shows the session-ended text: the strings differ.
  - `hover-readout` class on the id line: "state 1: ... length of +0 but got 1".
  - `outsideView !== undefined`: `.feature-outside-view` was not null.
  - Zoom's `disabled` removed: [false,true] vs [true,true].
  - Scope words read from the Clear entry: the strings differ.
  - Reasons swapped: the strings differ.
- Cross-module seam: StudioLayout.test.tsx uses the real StudioLayout. App.layout.test.tsx (the real App) covers the Feature tab. The end-to-end tests from App for the tool switch and Feature tab (RB1, RB9, RB11, RB16 and so on) are stage 5's, where the views are mounted.

**H3**
- `npm run verify` exited 0 at e4940dbe, under a shared hold (MACHINE_HOLD, then MACHINE_RELEASED). Output: 92 test files, 1303 tests, all passed. Residency-trace, citation-integrity and dist checks passed.
- Base test files edited since B, all within what you allowed:
  - App.layout.test.tsx: R4 only.
  - actionRegistry.test.ts: the U5 test, and the import lines widened for UB10.
  - viewTransitions.test.ts: the accepted UA4 line.
  - pickResolution.test.ts and workspaceState.test.ts: additions only (+29/0 and +67/0).
- No e2e file was changed.

**GOVERNANCE**
- At e4940dbe: verify-cites PASS (1812 files), verify-quotes PASS (121 checked, 30 baselined), verify-test-claims PASS (545 claimed tests), verify.mjs PASS.
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs`: 457 pass, 0 fail.

**§7** (`git diff --numstat c96e5329...HEAD -- frontends/shell` with the three excludes)
- Cumulative at the head: 3,222 insertions plus 85 deletions, 3,307 lines. At 1de68a61 it was 2,158, so this stage is +1,149.
- Per file, cumulative (insertions/deletions):

| File | Ins/Del |
|---|---|
| App.layout.test.tsx | 3/3 |
| App.tsx | 5/0 |
| HoverReadoutView.tsx | 9/8 |
| WorkingCanvas.tsx | 98/14 |
| WorkingCanvas.wiring.test.tsx | 345/0 |
| clickPick.test.ts | 150/0 |
| clickPick.ts | 64/0 |
| highlightLayers.test.ts | 215/0 |
| highlightLayers.ts | 201/0 |
| pickResolution.test.ts | 29/0 |
| pickResolution.ts | 8/11 |
| surfaceRegistry.ts | 43/1 |
| FeatureTab.test.tsx | 211/0 |
| FeatureTab.tsx | 144/0 |
| ToolSwitch.test.tsx | 108/0 |
| ToolSwitch.tsx | 92/0 |
| StudioLayout.test.tsx | 178/0 |
| StudioLayout.tsx | 38/9 |
| actionRegistry.test.ts | 124/3 |
| actionRegistry.ts | 71/9 |
| contributions.ts | 12/3 |
| styles.css | 92/0 |
| scope.test.ts | 139/0 |
| scope.ts | 85/0 |
| selection.test.ts | 285/0 |
| selection.ts | 140/0 |
| selectionConstants.ts | 21/0 |
| viewTransitions.test.ts | 78/4 |
| viewTransitions.ts | 99/10 |
| workspaceState.test.ts | 67/0 |
| workspaceState.ts | 68/10 |

- Against the B-L group ceilings (700 total): contributions 15 of 30, actionRegistry 80 of 90, StudioLayout 47 of 140, FeatureTab 144 of 300, ToolSwitch 92 of 140. B-X surfaceRegistry is 44 of 60, B-S styles 92 of 200, and AM2-T is 6 of 8.
- Three test files this stage are in no §4 or §7 row: StudioLayout.test.tsx (178), FeatureTab.test.tsx (211) and ToolSwitch.test.tsx (108), 497 lines in all. That is a scope and lines question (class 9 and class 8) for you or the architect to rule. Stage 3's WorkingCanvas.wiring.test.tsx is still pending as you said, and I did not touch it.

**E2E FOR THE CUSTODIAN** (I ran none)
- Required: `npm run e2e:layout`. The visible product change at this head is the Inspector's third tab, `#inspector-tab-feature`, with an empty panel. That suite covers E-KEYS, E-LANDMARKS, E-FOCUS, E-FIT, E-FLOOR and E-REOPEN.
- Recommended: `npm run e2e:console` and `npm run e2e:style`. Both click `#inspector-tab-layer` and `#inspector-tab-style` and read class-C rows.
- No e2e edit was needed or made. From a code read, layout.mjs has no tab-count assertion, so its G-E "third tab only" allowance should not be needed. The run will confirm.
- Not needed at this head: regression, selection, publish, filter, admission and residency. No canvas code changed in this stage.

**NOTES, for the architect and the human**
- The `layout.selectInspectorTab` statement edit (surfaceRegistry.ts) changes an existing string that §5 declares unchanged. I changed it because the old text ("its Layer and Style tabs") would have been false with a third tab. No test or e2e pins it. Revert it if you read §5 strictly.
- The `status.selectionEnded` status-bar item from §2.3 is not added. It is not in the stage list, and a new StatusItemId would force a second App edit.
- Decision: matchToolKey has the same code fallback as matchChord, so a non-Latin layout can still reach N and S. It is tested, with its own mutation. Drop it if unwanted.
- Decision: the count line is labelled "Selected, ignoring filter" (plan §3, Amendment 1 A9). The plain "Selected" label means the filtered count in the plan, so I did not use it.
- Every new string is `[P6 placeholder]` except the approved ones: Feature, Navigate, Select, the four mode labels, Pin, Zoom to selection and Clear selection. The tool switch's one-line statements are by me, for the sighting.
- The top bar is not checked in a browser. The two-row tool switch (tools plus modes, then the statements) fits the 40px bar by CSS reasoning only. It is for walkthrough row W1, and e2e:layout will show any clipping.
- Until stage 5, the Feature tab is visible but empty. This is the intended interim state.
- The Amendment 8 points are untouched here: OPEN-12 (A) and Amendment 7's strings concern B3 (stage 7 or so).

**NOT DONE AS WRITTEN**
- Nothing in the stage list was skipped.
- Beyond the list, only the 5-line App.tsx null slots, the one existing-string edit above, and the three extra test files.

**FINAL PORCELAIN:** empty (`git status --porcelain` prints nothing). Local head equals origin head at e4940dbe.
