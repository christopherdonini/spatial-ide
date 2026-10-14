# The status bar keeps one height, so a status notice coming or going never changes the map's size; a notice that does not fit is cut, and its full text stays reachable
# (PLAN node shell-status-bar-one-height)

File: frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md
Authority: the human's direction of 2026-10-12, `state/directives/2026-10-12-open-15-wording-webview2-scale-runs-status-bar-piece.md`, item 3, with its RULED block in `DECISIONS-PENDING.md`. That item makes this its own piece, graded S2. It changes the existing wrapping design by the human's word. It sets the placement and requires the e2e step. Cited by item; nothing below quotes it.
Drafted by: the architect agent, alone (no engine or kernel path; the product-first direction, section 1). Read at main 117aac6cca967bd43dda2f737ccab536f7a7073b and at the phase B branch `cut/shell-migration-milestone-2-phase-b` @ d59f1a6abc0577a952940e1a34cbb76528ff1acc (PR #217), while phase B is in its correction rounds (forms ahead).
Committed before any code. Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a: a property currently under test, namely the frame's map minimum and the fit that guarantees it; §21c: new user-visible behaviour and size; §25(e)).
Code starts only after PR #217 (shell-migration-milestone-2, phase B) has merged (item 3), in the slot §2.10 names. The re-sweep of §0.3 comes first.

## §0. Disclosure

0.1 Inputs.
- The 2026-10-12 direction, item 3. Item 2 is read only for its bound: the forced-scale-factor approval covers the E-KINDS point step, and this piece does not use it (§6).
- The custodian's run 5 record, `state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md`, its first section (the E-SEL-FILTER diagnosis, measured at f18dbefb). Its runs are evidence, not Authority.
- Milestone 1's form, frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md: §2.5's status bar (the wrapping design this piece replaces) and §2.6's class-C rows.
- Milestone 2's form header, and its §2.3, which makes the ended-selection notice a status item.
- The Current view fix's form, frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md, §2.6 and §9, read last amendment first (Amendment 1).
- docs/01 principle 4; docs/03's action console; ADR-001 and its 2026-08-09 amendment; ADR-006; ADR-010 rule 6.
- docs/PREREGISTRATION-TEMPLATE.md; AUTONOMY.md §21a, §21c, §22, §25(e) and §31.
- The product-first direction, sections 1, 2 and 4; the 2026-10-11 direction, item 2.
- Fable's guardrails brief, `state/consults/GUARDRAILS-EPOCHS-HEIGHTS-DGGS-2026-10-12.md`, section 3. This piece touches none of the surfaces it names: no CRS, epoch, height, step record, project file, snapshot, bundle, SKP field, tier identity or geometry admission. So none of its rules applies.
- The port-5400 harness approval (`state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md`, item 1).
- The shell's code, styles, tests, e2e suites, MANUAL-WALKTHROUGH.md and KNOWN-LIMITATIONS.md at 117aac6c, and the phase B files named in §0.4 at d59f1a6a.
- No pilot, no spike. This draft measured nothing.

0.2 The reuse index (the standing step, the human's direction of 2026-10-09).
- **The run.** The custodian ran `node tools/reuse.mjs status bar` and `node tools/reuse.mjs notice` in the reuse index at `C:/dev/spatial-ide-reuse`, at commit 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, with the tool at that commit.
- **The printed lines.** These are as the custodian's brief carries them from that run. The custodian's script re-copies them byte for byte before commit and marks the block.

  ```text
  No prior art recorded for "status bar". Research it before planning an implementation.
  No prior art recorded for "notice". Research it before planning an implementation.
  ```

- **The misses.** Both are misses; they are noted and do not block.
  - The piece has no algorithm to research. It uses CSS overflow with an ellipsis, a fixed grid track, and (under OPEN-1 (a)) the WAI-ARIA disclosure pattern, a button with `aria-expanded` and `aria-controls`.
- **What this form takes from it:** nothing. **No dependency** is proposed.

0.3 Pins, hashes and the re-sweep.
- **What the pins mean.** Every `@ 117aac6c` pin is historical (round 14). For the work, the tree at the code base is authoritative; for what this form read, the pin is.
- **Hashes.** The drafter has no shell.
  - Before commit, the custodian's script adds to each `@ 117aac6c` pin its sha256 over the whole cited lines (LF bytes), written as `path:line[-line] @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:<hex>` on one line (round 15 (d)).
  - A pin the script cannot resolve is corrected before commit.
- **Branch pins.** A `@ d59f1a6a` pin carries no hash, because d59f1a6a is a branch commit (round 15 (e); round 25, item 2).
  - Each names what this form read in the worktree `C:/dev/wt/mm2b`, whose branch ref is d59f1a6a. Its uncommitted state was not checked.
  - Each is re-swept at the code base and pinned on main there.
- **The re-sweep.** At the code base (after #217 merges), before any code, the custodian answers RS1 to RS9 in a class 3 / class 1 amendment.
  - A moved pin is class 3.
  - An interface that differs from §0.5 is I1 or I7, as named.

| Item | Question at the code base |
|---|---|
| RS1 | Is the ended-selection notice still the slot `status.selectionEnded`? Is it rendered by App as one element with class `selection-ended` and `role="status"`, with its text from `noticeText`, and cleared at the next selection transition? Give file:line. If it is not a status-bar item, that is I1. |
| RS2 | Give StudioLayout's props, the footer's markup, `STATUS_ITEMS` and `Slots`, and every reader of `STATUS_BAR_MAX_HEIGHT_PX` and `--status-max-h`. |
| RS3 | List every status item the shell renders: its class, its role and its longest text. Does any unit test or e2e step read a status item by anything but its textContent (a visible extent, a visibility check, a click, `innerText` of a cut item)? Any such read is I7 unless §2.7 lists it. |
| RS4 | In selection.mjs: the step order (E-DBLCLICK last); `readTab`'s `statusItem`; `openFixture`, `buildScene`, `useTool` and `useMode`; and lib.mjs's `canvasRect`. |
| RS5 | In layout.mjs: E-FOCUS's expected walk, and whether the bar holds an item when E-FOCUS runs in an ordinary run of the suite. E-FLOOR's probe and its assertion. |
| RS6 | Has export-current-view-after-unreported-fit merged? If it has, `e2e/README.md` is not shared with an open piece, and OPEN-2 (a) costs nothing in placement. |
| RS7 | surfaceRegistry.ts's class-C layout rows, and the test that ties every `recordNamed` name to a registry row. |
| RS8 | Which walkthrough Part letters are in use? Which letter does the Current view fix's Part take (its §9)? |
| RS9 | KNOWN-LIMITATIONS item 40's text at the code base, and whether the human has approved its words (OPEN-3). |

0.4 The defect as read.
- **The grid.** The frame's last row track, the status bar's, is `auto`: frontends/shell/src/styles.css:34 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:dcb018dbdc37f212e2f6fc2c09bf3bb82d78db0d1d7cd97c2c2503a6204eb1fa (the area at :41).
- **The bar.** frontends/shell/src/styles.css:159-172 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:7db1301b36d263e867d332a30315f134e0908ab7395a46d8df42b081755705bb:
  - a minimum height of 1.5rem (:162);
  - a cap of `var(--status-max-h)` (:163);
  - it wraps (:166);
  - it is border-box, so that the fit's 48 px budget is the real cap (:161).
- **The cap.** frontends/shell/src/layout/layoutConstants.ts:35-36 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:0ce3175273f93fb9dc8c429c6a36fcb5637d75c8afd1661024c9b13aed4d10eb: 48 px, two lines, then it scrolls.
  - StudioLayout sets it as a CSS variable: frontends/shell/src/layout/StudioLayout.tsx:180 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:ea5afe6ef7e3a458aab782139056002c6f1077a020d9eb7bd4eb4657e9643443.
  - The fit reserves it: frontends/shell/src/layout/layoutState.ts:138 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:88eda6c92865430b601742fa59ae070de95728dd3f336e387dff6603ab6d0c6e.
- **The design behind it.** frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md:163-172 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:27b4d468e8a6318f4196a6c7f78f4a96938120dd77d4deebd4800f69bd889189, the status bar's items, wrap and cap (:172).
  - The human's item 3 replaces this for the status bar.
  - Milestone 1's form is not edited.
- **The footer.** frontends/shell/src/layout/StudioLayout.tsx:306-310 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:4d1968fdaacfeb237feeeb71fed66557fd389c04af0f07c18128f97f5aee4dc5; on the phase B branch, line 335-339 of frontends/shell/src/layout/StudioLayout.tsx (at d59f1a6a, the phase B branch).
- **Phase B's fifth item, the ended-selection notice.**
  - Declared last in the list at line 48-55 of frontends/shell/src/layout/contributions.ts (at d59f1a6a, the phase B branch), as an optional slot at :79-83 @ d59f1a6a.
  - Rendered at line 2266-2270 of frontends/shell/src/App.tsx (at d59f1a6a, the phase B branch).
  - Its words are `noticeText`, line 68-76 of frontends/shell/src/feature/FeatureTab.tsx (at d59f1a6a, the phase B branch). The Feature tab shows the same words whole, at line 128-132 of frontends/shell/src/feature/FeatureTab.tsx (at d59f1a6a, the phase B branch).
  - Styled at line 642-652 of frontends/shell/src/styles.css (at d59f1a6a, the phase B branch).
  - It clears at the next selection transition (RB4, line 399-431 of frontends/shell/src/App.selection.test.tsx (at d59f1a6a, the phase B branch)).
- **The observation.** From state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md:17 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:f10aa01fd35f6d7d5ff6eedb880b0315686657dce714f8e3e5d8466ad30daeb9, at 1280 × 800:
  - the notice wrapped the bar to a second line, and the canvas was 715.453125 CSS px tall;
  - when the notice cleared, the canvas was 736, and the next clicks landed on stale points.
  - The canvas top was 40, so 800 − 40 − 736 = 24: the one-line bar sat at its 1.5rem minimum. With two lines the bar was 44.546875 px, under the 48 px cap.
- **The workaround in force.** E-DBLCLICK runs last (line 787 of frontends/shell/e2e/selection.mjs (at d59f1a6a, the phase B branch)), which item 3 accepts for now.
- **The other items' texts.**
  - The residency texts: frontends/shell/src/residency/residencyStatus.ts:439-473 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:7ccde57834011f83f358f59a8a5a642366d3a0d1703a326744040c8226f0958e.
  - Scan incomplete: line 2209-2213 of frontends/shell/src/App.tsx (at d59f1a6a, the phase B branch).
  - The scan mirror: frontends/shell/src/layout/regionParts.tsx:196-214 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:54f651274a0cc9ec0aa9485dc4873dbae156601eae3046c28ff2a080ba896cd8.
  - The watcher: frontends/shell/src/layout/regionParts.tsx:216-225 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:b1df04d3b16a303318dc7bc04dcbf274b32992eab9f55f0e0ab9bbe6d87b0b8a and frontends/shell/src/layout/statusItems.ts:27-35 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:4710944952345cae029db5a1211d6fbdd0fd5a9df3df3f2fbc656e6705bfe7e9.
- **Rows that read a status line's text.**
  - Walkthrough: Part D's D2 and D3 (frontends/shell/MANUAL-WALKTHROUGH.md:215-216 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:b97df274369a793909fe112d9a1f2340af1cc346af5614a4f1757161cadabd9c) and Part E's E5 and E7 (frontends/shell/MANUAL-WALKTHROUGH.md:245 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:e44aad555c9ffef8b5e3f3420a9a469e64868291a47260f5dcd04810d1925141, frontends/shell/MANUAL-WALKTHROUGH.md:247 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:3ee4ea38cc6a53c2c1fc2ace8aa6bdabc4c368d7f919e09bbeaeb4508a63f4a8).
  - KNOWN-LIMITATIONS on main has no status-bar item. Item 40, on the branch, names the status bar: line 376-378 of KNOWN-LIMITATIONS.md (at d59f1a6a, the phase B branch).

0.5 Consuming-side interfaces, read before any seam is drafted.
- **StudioLayout's props:** line 112-125 of frontends/shell/src/layout/StudioLayout.tsx (at d59f1a6a, the phase B branch) (`overlays`, `slots`, `layersRow`, `onZoomToLayer`, optional `onSelectTool`).
  - **Unchanged by this piece.** The new state lives inside StudioLayout, and App passes nothing new.
- **`Slots`:** line 79-83 of frontends/shell/src/layout/contributions.ts (at d59f1a6a, the phase B branch).
  - A slot can hold a component that renders nothing. The mirror returns null (frontends/shell/src/layout/regionParts.tsx:207 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:8a4105c5ce06add4dd35dc82552b12ac028a4410dec03e7706d159e54e2ff012), and so does the watcher (frontends/shell/src/layout/regionParts.tsx:219 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:8a4105c5ce06add4dd35dc82552b12ac028a4410dec03e7706d159e54e2ff012).
  - So slot content does not say whether the bar shows an item, and presence is read from the DOM (§2.4 (c)).
- **The recorder.**
  - StudioLayout's literal `recordNamed("gui-action", …)` call sites: frontends/shell/src/layout/StudioLayout.tsx:83-105 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:77ac9adbcbbdb339fa8b5473da21b2ca91269537c9a66aa731214f47fa5e2566.
  - The registry's class-C layout rows: frontends/shell/src/console/surfaceRegistry.ts:275-324 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:dc05b341f5abc2dc005e451fcd83e8104e9e75806e350b22fe8c945c8b17afde.
  - The precedent for a disclosure recorded as class C is `notices.togglePanelExpanded`: frontends/shell/src/console/surfaceRegistry.ts:266-274 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:5fd69bfd73b4fc584d2ec9a0199ed55a0152082d77cb0168a44a056148140881.
- **The focus rule for a closing region:** frontends/shell/src/layout/StudioLayout.tsx:132-144 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:f737b80ed7d16f075e4f2b5d0969baba5ec4d463085bcab504184c4dd695e221.
- **The render harness reads gui-action rows** through `consoleRecorder` and `isGuiActionEntry`: line 174 of frontends/shell/src/App.layout.test.tsx (at d59f1a6a, the phase B branch), and R7 at line 453-457 of frontends/shell/src/App.layout.test.tsx (at d59f1a6a, the phase B branch).
- **The e2e readers.**
  - `readTab`: line 140-160 of frontends/shell/e2e/selection.mjs (at d59f1a6a, the phase B branch).
  - `useTool` and `useMode`: line 163-164 of frontends/shell/e2e/selection.mjs (at d59f1a6a, the phase B branch).
  - `openFixture`: line 199-203 of frontends/shell/e2e/selection.mjs (at d59f1a6a, the phase B branch).
  - `buildScene`: line 265-280 of frontends/shell/e2e/selection.mjs (at d59f1a6a, the phase B branch).
  - `canvasRect`: line 572-579 of frontends/shell/e2e/lib.mjs (at d59f1a6a, the phase B branch). It reads `.working-canvas`'s bounding box, the reading run 5 used.
- **layout.mjs.**
  - E-FOCUS: frontends/shell/e2e/layout.mjs:190-226 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:63eb1539a1d18733e7f7aa2e82f9fb1f24bc99c3d57a5b1f5310d3a00a415ca0. A focus inside `footer` is named `status` at :207, and the expected walk is at :217.
  - E-FLOOR: frontends/shell/e2e/layout.mjs:268-325 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:0cb1056024dc14d33b6d9f78acd1ed0aa826b67d5a0d80c389b07a5d843e2832.
  - `readLayout`: frontends/shell/e2e/layout.mjs:75-91 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:ed6ffeb3cfcf2ea122b68096bf7ba5661d36aa9043d9872d105114a20d653fe7.

0.6 Hypotheses.
- **H1.** With the status row a fixed track of `STATUS_BAR_HEIGHT_PX` and the items on one unwrapped line, the canvas's CSS width and height are identical before the ended-selection notice appears, while it stands, and after it clears.
  - Discriminator: E-STATUS-HEIGHT, and its mutation.
  - If it fails: I10.
- **H2.** At the WebView2 default font size, one 24 px line holds every status item with no vertical clipping.
  - Discriminator: run 5's one-line bar measured 24 px; E-STATUS-HEIGHT also records each item's box against the bar's box. Recorded, not asserted.
  - If it fails: I2.
- **H3.** With the bar at one height, the run-5 order (E-DBLCLICK before E-SEL-FILTER) passes.
  - Discriminator: one diagnostic run with a scratch patch that restores that order. Recorded, not asserted; the patch is reverted. The committed order is unchanged (§8 item 15).
- **H4.** Every existing test and e2e step reads a status item by its textContent, which a CSS cut leaves whole.
  - Discriminator: RS3, then every suite at the head.
- **H5.** At 1280 × 800, one residency line alone fits uncut, so the walkthrough rows that read one status line read it whole.
  - Discriminator: E-STATUS-HEIGHT records, before the notice, the residency item's scrollWidth against its clientWidth. Recorded.

## §1. May and may not claim

- **May claim:** §2's behaviour and the properties §4 tests.
- **May not claim:**
  - any performance figure or docs/08 row;
  - macOS or Linux above L1;
  - anything at a forced device scale factor (none is run here; §6);
  - that the map keeps its size when an attention-strip item comes or goes. The strip's row stays sized to its content, by milestone 1's design, and this piece does not touch it;
  - that a cut line is legible in the bar itself. The claim is only that its full text is reachable (OPEN-1).
- **No change** to the wire, SKP, the kernel, the engine, the renderer, `src/canvas/`, `src/workspace/`, `src/feature/`, `src/publish/`, App.tsx (under OPEN-1 (a) or (b)), or any status item's text, order or role.
- **ADR-006:** the full-status toggle is pure view state for the session, like the layout's existing toggles. No undo class applies, nothing enters the workspace, and nothing is sent to the kernel.
- **ADRs cited, none amended:** 001, 006, 010 (rule 6).
- **Strings.** Every new operator string is a P6 placeholder (§2.8).
- **Declared consequence.** The fit now reserves 24 px for the bar instead of 48. So at a viewport where the fit clamps Activity, Activity may be up to 24 px taller than before, and the map minimum still holds (U1's property tests).

## §2. The change

### 2.1 styles.css
- (a) The `.app` grid's last row track becomes `var(--status-h)` instead of `auto`. The bar's row never depends on its content.
- (b) **`.status-bar`:**
  - `height: var(--status-h)` replaces `min-height: 1.5rem` and `max-height: var(--status-max-h)`;
  - `position: relative`, and no `flex-wrap`;
  - `overflow: visible`, so that the expanded list (d) can be drawn above it.
- (c) **The new `.status-bar-items` holds the items on one line:**
  - the container: `flex: 1 1 auto; min-width: 0; display: flex; flex-wrap: nowrap; align-items: center; overflow: hidden`;
  - each item, as a direct child: `flex: 0 1 auto; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis`;
  - the mirror's text span gets the same cut (§2.5).
- (d) **[OPEN-1 (a) or (b)] The expanded list.**
  - **Layout:** `.status-bar-items` expanded is `position: absolute; left: 0; right: 0; bottom: 100%`. Its items wrap, and none is cut (`white-space: normal; overflow-wrap: anywhere`).
  - **Size:** `max-height: var(--status-detail-max-h)`, then it scrolls inside.
  - **Look:** an opaque background (`Canvas`/`CanvasText`) and a top border.
  - **Stacking:** `z-index: 10`, below the error banner (1000) and the origin mismatch state (2000).
  - **Never a grid track:** no region changes size when it opens or closes.
  - Under (a) it is expanded by `[data-expanded="true"]`; under (b) by `.status-bar:hover` and `.status-bar:focus-within`.
- (e) [OPEN-1 (a)] `.status-bar-detail-toggle` is `flex: none`, at the bar's end, sized to fit the 24 px line.
- (f) **Comments.** The comment at :161 and the bar's design comment say that the human's item 3 replaced the wrap. The 48 px budget is history. These are Documentation.

### 2.2 layout/layoutConstants.ts
- `STATUS_BAR_HEIGHT_PX = 24` replaces `STATUS_BAR_MAX_HEIGHT_PX = 48`. Its doc: it bounds the status bar's height, one line always, and a longer line is cut.
  - 24 is the bar's existing 1.5rem minimum at the 16 px default, the one-line height run 5 measured.
- [OPEN-1 (a) or (b)] `STATUS_DETAIL_MAX_HEIGHT_PX = 128`. It bounds the full-status list drawn over the map, which then scrolls inside. 128 is the attention strip's cap, about six lines.
- Each constant names the quantity it bounds (ADR-010 rule 6).

### 2.3 layout/layoutState.ts
- The fit's chrome uses `STATUS_BAR_HEIGHT_PX`.
- Its doc comments say the status bar is at its one height, where they now say it is at its cap.
- The reducer and `LayoutState` are unchanged.

### 2.4 layout/StudioLayout.tsx
- (a) **CSS variables.** `--status-h` comes from `STATUS_BAR_HEIGHT_PX`, and [OPEN-1 (a) or (b)] `--status-detail-max-h` from `STATUS_DETAIL_MAX_HEIGHT_PX`. `--status-max-h` is removed.
- (b) **The footer.** It holds `<div id="status-bar-items" className="status-bar-items">` with the items in §2.5 order, unchanged, and [OPEN-1 (a)] the toggle after it.
- (c) **[OPEN-1 (a)] Presence.**
  - The toggle is rendered only while the items container has at least one element child.
  - Presence is read by one `MutationObserver` (`childList`) on the container plus a first read after mount, not from slot content (§0.5).
- (d) **[OPEN-1 (a)] The toggle.**
  - Markup: `<button type="button" className="status-bar-detail-toggle" aria-expanded aria-controls="status-bar-items">`, labelled with §2.8's string.
  - Pressing it flips a local `useState` flag, written to the container as `data-expanded`. The flag is not in `LayoutState`.
  - Each press records `recordNamed("gui-action", "layout.toggleStatusDetail")`, written as a literal.
  - Escape, with the focus inside the footer and the list expanded, closes it, keeps the focus on the toggle, and records the same row.
- (e) **[OPEN-1 (a)] When the last item clears:**
  - the flag resets to closed and nothing is recorded;
  - if the toggle held the focus, the focus moves to the map region, by the rule a closing region already follows (§0.5).
- (f) **[OPEN-1 (b)] instead of (c) to (e):**
  - the footer gets `tabIndex={0}` and an `aria-label` (§2.8);
  - there is no flag, no toggle and no console row.
- (g) The doc comment names this form.

### 2.5 layout/regionParts.tsx
- The scan mirror's text is wrapped in a `<span>`, so the cut can show its ellipsis. A flex container's bare text cannot carry one.
- [OPEN-1 (c) only] `ScanLivenessMirror` and `WatcherStatusItem` set `title` to their text.

### 2.6 console/surfaceRegistry.ts [OPEN-1 (a) only]
- One class-C row, `layout.toggleStatusDetail`. Owner: docs/03's action console, pure view state, as the layout rows are. Statement: §2.8's string.

### 2.7 Tests that change
- **frontends/shell/src/layout/layoutState.test.ts:127-134 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:64d6e1f5c9279ae0429d9e58d69e5c4063a0ed34a92e224daef591000bdf5f08** (the defaults' predicted map size).
  - `[668, 378]` becomes `[668, 402]`, and `[754, 346]` becomes `[754, 370]`: the fit's chrome is 192 instead of 216.
  - Its comment follows. Listed in the PR body.
- **layout.mjs E-FOCUS.**
  - The expected walk gains `status` after `activity` when the toggle is present at the step's start; the step records which case ran.
  - It also asserts that the toggle is present exactly when the items container has an element child.
  - [OPEN-1 (b)]: `status` always.
- **layout.mjs E-FLOOR.** Comment only: the bar's cap is now its one height. The assertion is unchanged and predicted to pass.
- **[OPEN-2 (a)] e2e/README.md:**
  - the layout entry's E-FOCUS sentence;
  - the selection entry's list gains E-STATUS-HEIGHT and E-STATUS-FULL, with E-DBLCLICK still last.
- **[OPEN-1 (c) only] App.tsx:** the three status items it renders (residency, scan incomplete, ended selection) set `title` to their text. This path is shared with the Current view fix (§2.10).

### 2.8 Words (item 2e of the 2026-10-11 direction). Each is a P6 placeholder, the human's to approve or replace at the sitting.
- **[OPEN-1 (a)] The toggle's label:** `[P6 placeholder] Full status`.
- **[OPEN-1 (b)] The footer's `aria-label`:** `[P6 placeholder] Status`.
- **[OPEN-1 (a)] The class-C statement:** `[P6 placeholder] no API equivalent exists -- showing the status bar's full text over the map is pure view state for this session, never sent to the kernel.`
  - *no API equivalent exists*: no SKP call is made (§2.4 (d)).
  - *showing the status bar's full text over the map*: the list is drawn above the bar, over the map's bottom edge, uncut (§2.1 (d)).
  - *pure view state for this session*: a local flag, not in `LayoutState` and not in the workspace (§2.4 (d)).
  - *never sent to the kernel*: as above.
- **[OPEN-3 (a)] KNOWN-LIMITATIONS item 40's sentence.** The sentence (line 377 of KNOWN-LIMITATIONS.md (at d59f1a6a, the phase B branch)) says the Feature tab and the status bar say how many selected features were dropped and why. Replacement drafted for the human to approve or replace:
  `If a selection stood, the Feature tab says how many selected features were dropped and why; the status bar says it too, cut short when its line is full, with the whole text shown by the button at the end of the bar.`
  - *the Feature tab says how many … and why*: `noticeText` is shown whole at FeatureTab.tsx:128-132 @ d59f1a6a.
  - *the status bar says it too*: the same `noticeText`, at App.tsx:2266-2270 @ d59f1a6a.
  - *cut short when its line is full*: §2.1 (c).
  - *the whole text shown by the button*: §2.4 (d), proved by E-STATUS-FULL.
  - Under OPEN-1 (b) or (c) the last clause changes to the ruled mechanism, and the custodian's Amendment 1 carries the words.

### 2.9 The walkthrough Part (§9's rows)
- A new Part, appended at the file's tail with a blank result log, under the letter RS8 confirms. This form reserves Z; Y is the Current view fix's under its §9.

### 2.10 Boundaries and placement
- **May edit** (under `frontends/shell/` unless rooted):
  - `src/styles.css`;
  - `src/layout/StudioLayout.tsx`, `src/layout/layoutConstants.ts`, `src/layout/layoutState.ts` and `src/layout/regionParts.tsx`;
  - `src/console/surfaceRegistry.ts` [OPEN-1 (a)];
  - new `src/layout/statusBar.test.tsx`, and `src/layout/layoutState.test.ts` (§2.7);
  - `e2e/selection.mjs` (two new steps before E-DBLCLICK; header mutation lines);
  - `e2e/layout.mjs` (§2.7);
  - `MANUAL-WALKTHROUGH.md` (the new Part only);
  - `KNOWN-LIMITATIONS.md` at the repo root (item 40's sentence only) [OPEN-3 (a)];
  - `e2e/README.md` [OPEN-2 (a) only];
  - `src/App.tsx` (§2.7's three `title` attributes) [OPEN-1 (c) only].
- **Not edited:**
  - `src/App.tsx` (except under OPEN-1 (c));
  - everything under `src/canvas/`, `src/skp/`, `src/streaming/`, `src/residency/`, `src/workspace/`, `src/feature/` and `src/publish/`;
  - `src/layout/contributions.ts`, `src/layout/statusItems.ts` and `src/layout/actionRegistry.ts`;
  - `App.selection.test.tsx`, `App.layout.test.tsx`, `package.json` and `src-tauri/**`;
  - every walkthrough Part but the new one, and every KNOWN-LIMITATIONS item but 40;
  - every file outside `frontends/shell`, except item 40 and records.
- **Disjointness from the Current view fix's §2.6** (frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:181-197 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:08d5801f68f16e73b83f69ac50b86cea251396085c412f862cced1ae809716fb).
  - Its paths: App.tsx, PublishPanel.tsx, types.ts, App.selection.test.tsx, PublishPanel.test.ts, new export-view.mjs, package.json, e2e/README.md, a new walkthrough Part, item 42, and publish.rs.
  - **Under OPEN-1 (a) or (b), with OPEN-2 (b): disjoint.** No path is shared.
    - The two new walkthrough Parts and items 40 and 42 count as separate paths (the custodian's rule of 2026-10-10).
    - Both Parts append at MANUAL-WALKTHROUGH.md's tail, so the second merge resolves a textual conflict there by keeping both Parts.
  - **Under OPEN-2 (a): shared,** `e2e/README.md`.
  - **Under OPEN-1 (c): shared,** `src/App.tsx`, and `e2e/README.md` as well if OPEN-2 (a).
- **Placement, by item 3.**
  - Disjoint: slot 2 before b2-piece-1b-recording, starting when #217 has merged.
  - Shared: slot 1 after the Current view fix. In that case the custodian adds `export-current-view-after-unreported-fit` to the node's `depends_on`.
  - RS6 can remove the README overlap if the fix has already merged.
- **No path** under `protocol/`.

### 2.11 Portability (R1 to R6)
- No new OS boundary. No paths parsed or built. No OS-conditional code, and no new ignore.
- **Levels:**
  - Windows: unit, render and e2e tests, and the Part's rows;
  - macOS and Linux: by construction, L1 unit only. L2 is deferred to PLAN node `shell-real-app-run-macos-linux`.
- **Not claimed:** whether a scrolling expanded list is keyboard-focusable. Chromium runtimes make a scroller focusable, but this piece does not test it.
- **Expected reduction:** none.

## §3. Fixtures and predicted outcomes
- **Fixture:** `filter-zoned.parquet`, the suite's own, its sha256 recorded before and after as selection.mjs already does. No new fixture.
- **Predicted:**
  - every existing suite passes at the head, with only §2.7's edits;
  - E-STATUS-HEIGHT and E-STATUS-FULL pass;
  - under E-STATUS-HEIGHT's mutation, the reading taken while the notice stands is shorter than the one before it. Run 5 gives 715.453125 against 736 at 1280 × 800: recorded, not asserted;
  - E-FOCUS visits `status` last [OPEN-1 (a)];
  - H3's diagnostic run passes.

## §4. Tests, and one mutation each

Every mutation is observed:
- by applying it, running the named test, recording its failure by name with the commit it was observed at, and reverting it;
- a `verify-mutation` run is not an observation;
- recorded-mutation comment lines count in §7.

| ID | Kind and file | Asserts | Mutation, and its expected failure |
|---|---|---|---|
| SB1 [a] | render, src/layout/statusBar.test.tsx (the real StudioLayout, with `Slots` as contributions.ts types them) | With no status item element, there is no toggle. With one item, the toggle shows `aria-expanded="false"` and `aria-controls="status-bar-items"`. | render the toggle unconditionally; fails on the empty case |
| SB2 [a] | render, same | A click flips `aria-expanded` and the container's `data-expanded`. Each press records exactly one `layout.toggleStatusDetail` gui-action, read through `consoleRecorder`. | delete the `recordNamed` call; fails on the row count |
| SB3 [a] | render, same | Escape with the list open closes it, records one row and leaves the focus on the toggle. | remove the Escape branch; fails on `aria-expanded` |
| SB4 [a] | render, same | Open the list with the focus on the toggle, then rerender with the item's slot null. The toggle is gone and the focus is on the map region. Re-adding an item shows `aria-expanded="false"`. | omit the focus move; fails (the focus is on `body`) |
| SB5 [a] | render, same | A slot holding a component that renders nothing gives no toggle. | read presence from slot content (`hasContent`); fails |
| SB6 [a, b] | render, same | The `role="status"` element of an item is the same node, with the same whole textContent, collapsed and expanded. There is one such node per item. | render the items a second time inside the expanded list; fails on the node count |
| SB7 | render, same | The `.app` element's CSS variables are identical before and after a toggle [a], and `--status-h` equals `STATUS_BAR_HEIGHT_PX` px. | make `--status-h` follow the flag; fails |
| U-FIT (changed) | unit, layoutState.test.ts | §2.7's two predicted sizes | the fit's chrome back to 48; fails with `[668, 378]` |
| E-STATUS-HEIGHT | e2e, e2e/selection.mjs, before E-DBLCLICK | See below. | in styles.css, restore the wrap: the status row back to `auto`, `.status-bar` back to `min-height: 1.5rem; max-height: 48px`, and `.status-bar-items` and its items back to `flex-wrap: wrap` and `white-space: normal`. Fails at S3, on the height while the notice stands. |
| E-STATUS-FULL [a] | e2e, same, after E-STATUS-HEIGHT, before E-DBLCLICK | See below. | delete §2.1 (d)'s expanded rule; fails at F1 on the cut |
| E-FOCUS (changed) | e2e, e2e/layout.mjs | §2.7 | the toggle gets `tabIndex={-1}`; fails (no `status` stop) |

**E-STATUS-HEIGHT, step by step.**
- **S0.** `openFixture(filter-zoned)`; `buildScene` with want 1 and min 1; Select, Add only; one click.
  - Poll until Selected ≥ 1 and `statusItem` is null.
  - Read A: the canvas box (`canvasRect`), the bar's height and the attention strip's height.
- **S1.** `openFixture(filter-zoned)` again. Poll until `statusItem` is not null; wait two animation frames; read B.
  - **Guard G1:** the sum of the container's children's scrollWidth, plus the gaps, exceeds the container's clientWidth. Both are recorded. That is, the notice does not fit on one line beside the others.
  - **Guard G2:** the strip's height in B equals A's.
  - Either guard unmet makes the step INCONCLUSIVE (class 2, never a pass).
- **S2.** `buildScene` again; a Select click. Poll until `statusItem` is null and Selected ≥ 1. Read C, under G2.
- **S3.** The canvas's width and height are exactly equal in A, B and C. The bar's height is 24 in all three.
- **Recorded:** H2's item boxes and H5's residency fit.

**E-STATUS-FULL, step by step.**
- **F0.** If no selection stands, select one as in S0. Then `openFixture(filter-zoned)` and poll until the notice stands. Read A.
  - **Guard:** `.selection-ended`'s scrollWidth is more than its clientWidth + 1 (it is cut); else INCONCLUSIVE.
- **F1.** Focus the toggle and press Enter. Then:
  - `aria-expanded` is `"true"`;
  - `.selection-ended`'s scrollWidth is at most its clientWidth + 1, and its box is inside the viewport;
  - the canvas box equals A.
- **F2.** Press Escape. `aria-expanded` is `"false"`, the focus is on the toggle, and the canvas box equals A.

**[OPEN-1 (b)]:** SB1 to SB5 become one render case: the footer is focusable and labelled, with no toggle and no console row. F1 focuses the footer by Tab instead.

**[OPEN-1 (c)]:**
- SB1 to SB5 become one render case per item: its `title` equals its textContent.
- E-STATUS-FULL becomes a check of `title`.
- No keyboard path is tested, because none exists.

**The proofs:**
- the human's property: E-STATUS-HEIGHT, on the real app, with the real notice, at the real window;
- reachability: E-STATUS-FULL and SB2 to SB4;
- no duplicate announcement: SB6;
- keyboard order: E-FOCUS;
- the frame's map minimum: U1's existing property tests, unchanged, with U-FIT.

The e2e runs are the custodian's, under the port-5400 harness approval (§0.1).

## §5. Predictions, declared unchanged, invalidators, falsification

**Predicted:** H1 to H5 and §3.

**Declared unchanged:**
- every status item's text, order, class and role;
- `STATUS_ITEMS`, `Slots`, App.tsx (outside OPEN-1 (c)) and the Feature tab;
- the attention strip, its row and its cap;
- `LayoutState`, the reducer and the map minimum;
- every e2e and unit assertion except §2.7's;
- E-DBLCLICK last;
- the dependencies and the lockfile.

**Invalidators.** Each one means STOP and report.
- **I1:** at the code base the ended-selection notice is not a status-bar item, or differs from §0.4 beyond a class 3 rename (RS1).
- **I2:** one 24 px line clips an item vertically at the default font size (H2).
- **I3:** E-STATUS-HEIGHT's G1 is unmet in two runs at the native window, so the step would not discriminate.
- **I4:** the expanded list cannot be drawn without changing a grid track or a region's size.
- **I5:** an edit is needed outside §2.10's May edit list. In particular App.tsx, `src/canvas/` or package.json would change the placement.
- **I6:** a dependency seems necessary.
- **I7:** an existing suite fails for a reason not in §2.7, or a test reads a status item by its visible extent (RS3).
- **I8:** a test can pass only by mocking StudioLayout or the recorder.
- **I9:** code of an OPEN item is needed before its ruling.
- **I10:** the canvas's size differs between any two of A, B and C with the change in place (H1 false).

**Falsification.** The form is wrong if either of these holds:
- a status item can be cut only by changing its text, not by CSS;
- one fixed line cannot hold the bar's items at the default font size.

## §6. Instruments
- **Assertions:** every SB, U and E row.
- **Observations:** H2's item boxes, H5's residency fit, and H3's diagnostic order run.
- **Measurements:** none.
- **Forced scale factors:** none run. Item 2's bound covers the E-KINDS point step only.
- **The human's:** the new Part's felt rows and the P6 sight.

## §7. Declared values and ceilings

**Constants.**
- `STATUS_BAR_HEIGHT_PX = 24`, replacing `STATUS_BAR_MAX_HEIGHT_PX = 48`.
- `STATUS_DETAIL_MAX_HEIGHT_PX = 128` [OPEN-1 (a) or (b)].
- The expanded list's z-index, 10 (CSS).

**Budget.** Insertions plus deletions, tests included, by `git diff --numstat <base>...HEAD -- frontends/shell ':(exclude)frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md' ':(exclude)frontends/shell/MANUAL-WALKTHROUGH.md' ':(exclude)frontends/shell/e2e/README.md'`.
- `<base>` is the merge base with origin/main when the branch is cut.
- After a merge of main, the count is taken from the new merge base, and the record names it.

| Group | Files (ceiling each) | Lines, at most |
|---|---|---|
| P product | styles.css ≤ 60, StudioLayout.tsx ≤ 70, layoutConstants.ts ≤ 10, layoutState.ts ≤ 8, regionParts.tsx ≤ 8, surfaceRegistry.ts ≤ 8 | 164 |
| T tests | statusBar.test.tsx ≤ 200, layoutState.test.ts ≤ 8 | 208 |
| E e2e | selection.mjs ≤ 130, layout.mjs ≤ 30, margin 30 | 190 |
| **Total** | **10 files** | **562** |

- The table is for OPEN-1 (a). Under (b) or (c), Amendment 1 restates the per-file ceilings, never above these group totals. Under (c), App.tsx ≤ 12 joins group P inside its 164.
- **Outside the count:** MANUAL-WALKTHROUGH.md ≤ 45; KNOWN-LIMITATIONS.md ≤ 4 [OPEN-3 (a)]; e2e/README.md ≤ 12 [OPEN-2 (a)].
- An overrun is class 8, and this section is never edited to match it.

## §8. Block-on-sight
1. A file edited outside §2.10.
2. A dependency or lockfile change.
3. A grid track changed other than the status row, or the status row set to anything but `var(--status-h)`.
4. A status item's text changed, truncated in code, or removed from the DOM. The cut is CSS only.
5. The full-status view in the grid flow, or changing any region's size.
6. A second copy of any status item rendered.
7. Any change to the wire, SKP, the kernel, the engine, `src/canvas/`, `src/workspace/`, `src/feature/` or `src/publish/`; App.tsx outside OPEN-1 (c).
8. Any change to the attention strip.
9. A new operator string outside §2.8, or one that is unruled or unsighted.
10. Code of an OPEN item before its ruling.
11. A prop, state, export or callback without a product caller.
12. A performance claim, or a macOS or Linux claim above L1.
13. A quote of the human's words marked verbatim that does not match its source.
14. A new test without its observed mutation, or a `verify-mutation` run called an observation.
15. E-DBLCLICK moved from last, or any existing assertion changed except §2.7's.
16. A KNOWN-LIMITATIONS item other than 40 edited, or item 40 edited except under OPEN-3 (a).

## §9. Gates
- **Architect and reviewer,** full gating. Verdicts follow the product-first direction, section 2:
  - Correctness or Evidence blocks;
  - a Documentation finding is fixed in the same PR before the merge, except what OPEN-2 (b) defers once the human has ruled it;
  - each gate checks §8 item by item.
- **Wording-block rule** (the 2026-10-11 direction, item 2; AUTONOMY.md §31):
  - §2.8's app strings are under P6 and outside the rule (item 2f);
  - item 40's sentence is answered as item 2b says if the human's, and as item 2d says if not;
  - comments and README lines fall under item 2d.
- **Suites,** green first:
  - `npm run verify`;
  - every e2e suite at the code base, listed in the PR body;
  - the governance scripts' `node --test`;
  - verify-cites, verify-quotes and verify-test-claims, each named with its commit.
- **Operator.** Part Z (§2.9), with a blank result log, queued to the sitting:
  - **Z0:** read §10, the last amendment first.
  - **Z1:** open `filter-zoned.parquet`, choose Select, and click one feature. Open the file again: the ended-selection notice is in the status bar. **Felt:** did the map move or change size? Click a feature with Select: the notice clears. Did the map move?
  - **Z2 [OPEN-1 (a)]:** if the notice ends in an ellipsis, press the button at the bar's end. The full text shows above the bar. Press it again and it goes. The map does not move.
  - **Z3 [OPEN-1 (a)]:** with keys only, Tab to that button (the last stop), press Enter to open and Escape to close. The focus stays on the button.
  - **Z4:** with Narrator on, open the file again over a selection. Record whether the whole notice is read.
  - **Z5:** at 1024 × 640 (DevTools device toolbar), read the bar. It stays one line, and long items end in an ellipsis. A row in an earlier Part that reads a status line's text reads it this way when it is cut.
  - **Z6:** the P6 sight of §2.8's strings. Under (a), the Console row after one press.

## §10. Amendments
Opens empty, append-only.
- Amendment 1 records the human's rulings on OPEN-1 to OPEN-3 and the resulting slot.
- Amendment 2 is the re-sweep at the code base (§0.3), before any code.

## §11. Open items for the human

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-1 | How a cut status line's full text stays reachable | (a) | no |
| OPEN-2 | e2e/README.md: in this piece, or a docs-lane follow-up | (b) | no |
| OPEN-3 | KNOWN-LIMITATIONS item 40's status-bar sentence | (a) | no |

**OPEN-1.** In every option, the line is cut by CSS with an ellipsis and its text stays whole in the DOM. So the `role="status"` announcements carry the full notice whatever the cut.

- **(a) A disclosure button at the bar's end** (§2.4 (c) to (e)). It shows while any item is present, and opens the full list above the bar, over the map.
  - **Keyboard:** one Tab stop, the last, while an item shows. Enter or Space opens, Escape closes, and the focus stays put.
  - **Screen reader:** a button with its expanded state, plus the whole live-region text.
  - **Cost:** one P6 label and one class-C row (principle 4; the Notices precedent). E-FOCUS gains a stop.
  - **Cost:** while open, the list covers the bottom of the map, including the hover readout, and blocks the pointer there.
  - **Cost:** the button shows whenever an item is present, not only when one is cut. Detecting a cut needs layout measurement that only the e2e could prove.
  - **Paths:** disjoint from the Current view fix.
- **(b) The bar itself is focusable.** Hovering it or giving it the focus shows the same list (CSS only).
  - **Keyboard:** one Tab stop, always. The list shows while the bar holds the focus, and Tab away hides it.
  - **Screen reader:** what a screen reader reads when a landmark gets the focus varies, and is not claimed. The live-region text stays whole.
  - **Cost:** no action and no console row. But a pointer crossing the bar opens the list unasked, there is no touch path, and a focusable landmark has no control role.
  - **Paths:** disjoint.
- **(c) A `title` on each item, the Layers row's precedent** (frontends/shell/src/layout/regionParts.tsx:177-188 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:0d4687280b0aa0f71b55486b295709df9a9afd5bdb9ba36a0d659880d9f106c6).
  - **Keyboard:** a sighted keyboard user has no way to see a cut line. The Feature tab carries the selection notice whole, but the residency, scan and watcher lines have no second place.
  - **Screen reader:** the whole live-region text; the title adds nothing to an item that cannot take the focus.
  - **Cost:** the least code. But it needs App.tsx, which the Current view fix shares, so it goes in slot 1 after the fix.

**OPEN-2.**
- **(a)** This piece edits e2e/README.md. That path is shared with the Current view fix, so it goes in slot 1 after the fix, unless RS6 finds the fix already merged.
- **(b)** The README lines (§2.7) go in a docs-lane follow-up node, proposed as `e2e-readme-status-bar-steps`, landing after both pieces. This piece is then disjoint and takes slot 2 before b2-piece-1b-recording.
  - **Cost:** between the merges, the README's layout and selection entries omit the two new steps and E-FOCUS's new stop.
  - That window is an exception to the rule that Documentation is fixed in the same PR (the product-first direction, section 2), so it needs the human's word.

**OPEN-3.**
- **(a)** Item 40's sentence takes §2.8's drafted words, as its own path (not item 42).
- **(b)** It stands as written. A cut line may then hide the cause until the button is pressed, and the gap is recorded in its source comment.

**Information, not an OPEN item.** The attention strip's row is still sized to its content (milestone 1's design), so the map changes size when a session-ended or refusal item comes or goes. This piece does not touch it (§1, §8 item 8).

## §12. Heavy runs
The worker's and tester's briefs carry, as written, the paragraph at state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1. This form names no other rule for running builds.
