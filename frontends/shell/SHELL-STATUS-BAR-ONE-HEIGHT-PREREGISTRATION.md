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

### Amendment 1 — the human's rulings on OPEN-1 to OPEN-3, and the form restated for OPEN-1 (d) (class 5)

*Drafted by the architect at main 2cf707a3 and appended by the custodian before any code, with no outcome seen. It holds references and replacement text. Each replacement is followed by a clause check, one entry per sentence (s1, s2 …), checked against the code at 2cf707a3. Nothing above is edited.*

1. **The rulings.**
   - OPEN-1: (d), state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:9 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:60d30eac043c06c6df5c3aa5b9301878a03f0c0f9cd03655c5915d3e8b69b033. Every passage marked [OPEN-1 (a)], [OPEN-1 (b)], [OPEN-1 (c)] or [OPEN-1 (a) or (b)] falls away. Items 2 and 3 below replace the sections it touches.
   - OPEN-2: (b), state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:10 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9caa52ff60d1960ea573af62517ba39c3203e989d2bd46ed2c682fd7600584d4. The piece stays disjoint, in slot 2 before b2-piece-1b-recording.
   - OPEN-3: (b), state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:11 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:213897d57468d922bb7801cbe170876f92aa694740eae102352238cee6a30467. Item 40 is not edited.
   - The attention strip, state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:12 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:d9173f61dc147319e844a1d6b8e7e4e9a75459e8b722e27cecea4d93e6b4a4c6. §1's strip bullet and §8 item 8 stand.

2. **The sections the ruling names, restated for (d).**

   **§2.1 styles.css**
   - (a) The `.app` grid's last row track becomes `var(--status-h)` instead of `auto`. The bar's row never depends on its content.
   - (b) **`.status-bar`:** `height: var(--status-h)` replaces `min-height: 1.5rem` and `max-height: var(--status-max-h)`. The rest of the rule is unchanged: `box-sizing: border-box`, `overflow-y: auto`, `flex-wrap: wrap`, the gap, the padding and the top border. So the items wrap as today, and beyond two lines the bar scrolls inside, as today.
   - (c) No class or rule is added, and no item's rule changes.
   - (d) **Comments.** The comment on the `box-sizing` line says that the height includes the padding and the border, so the fit's 48 px reservation is the bar's real height. These are Documentation.
   - Check:
     - (a) s1: the track is `auto` today: frontends/shell/src/styles.css:34 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:dcb018dbdc37f212e2f6fc2c09bf3bb82d78db0d1d7cd97c2c2503a6204eb1fa. It is the `status` area's row: frontends/shell/src/styles.css:41 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:c938c5c6cdad1670e46ebb9c91f75f0a8f699db4ebbc0ed5115f5348e31a0e10.
     - (a) s2: StudioLayout sets the variable from a constant (§2.4 (a)), and no content enters the style object: frontends/shell/src/layout/StudioLayout.tsx:191-201 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9c1d9b3103c5eed073e7e6ef94504185eafd356fb1405269029b494162798781.
     - (b) s1: frontends/shell/src/styles.css:162-163 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b477c0d6a6c7574a9c53053d927eaf76963952161f7b927627fa3ac22b926285.
     - (b) s2: frontends/shell/src/styles.css:159-172 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7db1301b36d263e867d332a30315f134e0908ab7395a46d8df42b081755705bb (box-sizing :161, overflow-y :164, flex-wrap :166, gap :168, padding :169, border :171).
     - (b) s3: the wrap is :166 and the scroll is :164. Two lines is today's cap: frontends/shell/src/layout/layoutConstants.ts:35-36 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:0ce3175273f93fb9dc8c429c6a36fcb5637d75c8afd1661024c9b13aed4d10eb, whose value §2.2 keeps.
     - (c) s1: no code claim. §8 item 4 (item 3 below) holds it.
     - (d) s1: the comment line is frontends/shell/src/styles.css:161 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:11328fc8d3ea6fdfe73d24f3c9e8dead7a5ed3a8c6544ebc677c487f8a2468fd. The reservation is frontends/shell/src/layout/layoutState.ts:138 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:88eda6c92865430b601742fa59ae070de95728dd3f336e387dff6603ab6d0c6e.
     - (d) s2: a classification.

   **§2.2 layout/layoutConstants.ts**
   - `STATUS_BAR_HEIGHT_PX = 48` replaces `STATUS_BAR_MAX_HEIGHT_PX = 48`; the value is unchanged. Its doc: it bounds the status bar's height, which is fixed at two lines; beyond two lines the bar scrolls inside.
   - No other constant is added.
   - The constant names the quantity it bounds (ADR-010 rule 6).
   - Check:
     - s1: frontends/shell/src/layout/layoutConstants.ts:35-36 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:0ce3175273f93fb9dc8c429c6a36fcb5637d75c8afd1661024c9b13aed4d10eb.
     - s2 (the doc): the fixed height is §2.1 (a) and (b), and the scroll is frontends/shell/src/styles.css:164 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:d8e725cfd024c01d1f4bc5bed9d4756a29680fa40083016cf35e7ee4b88e2502. That two lines fit in 48 px rests on run 5: a two-line bar of 800 − 40 − 715.453125 = 44.546875 px (state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md:17 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f10aa01fd35f6d7d5ff6eedb880b0315686657dce714f8e3e5d8466ad30daeb9, evidence). H2 records it.
     - s3: no code claim.
     - s4: the name says height, and the doc says what it bounds.

   **§2.3 layout/layoutState.ts**
   - The fit's chrome uses `STATUS_BAR_HEIGHT_PX`. Its value is unchanged, so the fit reserves 216 px of chrome as before (40 + 48 + 128), and `effectiveSizes` returns the same sizes for every state and viewport.
   - Where the doc comments say the status bar is at its cap, they now say it is at its fixed height.
   - The reducer and `LayoutState` are unchanged.
   - Check:
     - s1: the import is frontends/shell/src/layout/layoutState.ts:13 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a62c407080797107d6034508b3a7cb05950c42c995a9bc964f3c325bde7fdc29, and the sum is frontends/shell/src/layout/layoutState.ts:138 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:88eda6c92865430b601742fa59ae070de95728dd3f336e387dff6603ab6d0c6e. The values are frontends/shell/src/layout/layoutConstants.ts:33-38 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f8a86ce25c3efbc479d91abcdf53417da88f9bc2edf1a8074a8820961bf39532. The sum is the constant's only use in the fit: frontends/shell/src/layout/layoutState.ts:119-150 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:eba84b6c110b0cb988c78147bcfe00b2a887ccadcd529df9ccaec7d722043d2f.
     - s2: frontends/shell/src/layout/layoutState.ts:97-98 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:be6b8c66d75071a999b17572a2a6f83e41c7be5967b5e3e3e3a83f8122f3d087 and frontends/shell/src/layout/layoutState.ts:108-110 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:cde6fdf88d5a8bddc7767e3eabc72d9258572e49afddec5b3c06931806fcdf99.
     - s3: frontends/shell/src/layout/layoutState.ts:31-90 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:702df1d073aea7a612fd68938276a48b014e6219f75a9b890481e716091ed804 is not edited.

   **§2.4 layout/StudioLayout.tsx**
   - (a) **The CSS variable.** `--status-h` comes from `STATUS_BAR_HEIGHT_PX`, and `--status-max-h` is removed.
   - (b) **The footer is unchanged.** It holds the status items in §2.5 order, as today.
   - (c) There is no new state, observer, button, `recordNamed` call or focus stop. `StudioLayoutProps` is unchanged, and App passes nothing new.
   - (d) The component's doc comment names this form. It says that the status bar's row and height are one value, `STATUS_BAR_HEIGHT_PX`, so a status item coming or going never changes the map's size.
   - Check:
     - (a): the variable is set at frontends/shell/src/layout/StudioLayout.tsx:200 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ea5afe6ef7e3a458aab782139056002c6f1077a020d9eb7bd4eb4657e9643443, and the constant is imported at frontends/shell/src/layout/StudioLayout.tsx:23-29 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:805ffc0447234e11d3317a4b9b201732bb081a5ebb8c0191595ad79bee0fdf9d. Its only CSS reader is frontends/shell/src/styles.css:163 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ec42bf40a2367cbd8060d431f69684e5d3598b937f8c5b867edf3fa6a3f01d30, which §2.1 (b) removes.
     - (b): frontends/shell/src/layout/StudioLayout.tsx:335-339 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:4d1968fdaacfeb237feeeb71fed66557fd389c04af0f07c18128f97f5aee4dc5, over frontends/shell/src/layout/contributions.ts:48-55 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:fb9a9cf0348859f32168e60781819505d9edfdb7ea3568287ec0bb4ba774c5a6.
     - (c) s1: every layout `recordNamed` call is in frontends/shell/src/layout/StudioLayout.tsx:88-110 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:77ac9adbcbbdb339fa8b5473da21b2ca91269537c9a66aa731214f47fa5e2566, and none is added.
     - (c) s2: frontends/shell/src/layout/StudioLayout.tsx:112-125 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7ea13cd4a5240d02a61cc7603b00a94c3c9747f4c8d9540383a2aea5022000f9.
     - (d): the doc comment is frontends/shell/src/layout/StudioLayout.tsx:34-45 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:48c7f3382e87b1cf5a24cb6b7df18bf7f64cafc0266ac2a4b4ef03c7e41d2c83. The map is the `minmax(0, 1fr)` track (frontends/shell/src/styles.css:33-34 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2faa9f3bbb61db1b9c32dbd28ced91f996e08be695c4ba1a15d292c184a2cfe6). The other row tracks are `--top-bar-h`, the strip's `auto`, `--activity-split`, `--activity-h` and, after §2.1, `--status-h`, and none of the variables is set from a status item (StudioLayout.tsx:191-201 above). The strip's `auto` row is the one the human left alone (item 1), and it holds no status item: frontends/shell/src/layout/StudioLayout.tsx:258-262 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:e39f33fdc0a454d515504665d2bf5c52fcc826638bffd65643cece3d2c9d0851.

   **§2.6 console/surfaceRegistry.ts.** Falls away: no class-C row. Check: §2.4 (c), and the ruling's no-console-row clause (item 1, OPEN-1).

   **§4, the rows the ruling fixes**

   | ID | Kind and file | Asserts | Mutation, and its expected failure |
   |---|---|---|---|
   | SB1 | render, src/layout/StudioLayout.test.tsx, a new describe block (the real StudioLayout, slots typed `Slots`, nothing mocked) | `.app`'s `--status-h` is `48px` (`STATUS_BAR_HEIGHT_PX`), and `.app` sets no `--status-max-h` | set `--status-h` from `TOP_BAR_HEIGHT_PX`; fails on the value |
   | SB2 | render, same | Rendered with `status.selectionEnded` absent, then holding a `.selection-ended` element, then absent again: `.app`'s `--status-h` is the same in all three, and the footer holds the notice only in the second | set `--status-h` to 48 px when the `status.selectionEnded` slot has content (`hasContent`) and to 24 px otherwise; fails on the comparison |
   | E-STATUS-HEIGHT | e2e, e2e/selection.mjs, run after E-ASK-TWO and before E-DBLCLICK | See below. | in styles.css, the status row back to `auto`, and `.status-bar` back to `min-height: 1.5rem; max-height: 48px` in place of `height: var(--status-h)`; fails at S3 on the canvas height while the notice stands (B shorter than A) |

   - SB3 to SB7, U-FIT (changed), E-STATUS-FULL and E-FOCUS (changed) fall away. U-FIT and E-FOCUS stand unchanged (item 1, OPEN-1). The [OPEN-1 (b)] and [OPEN-1 (c)] paragraphs fall away.
   - **E-STATUS-HEIGHT, step by step.**
     - **S0.** `openFixture(page, consoleHandle, FIXTURE_FILTER, label)`; `buildScene(page, consoleHandle, label, { want: 1, min: 1 })`; `useTool` with Select; `useMode` with Add only, as E-SEL-FILTER does; one `clickAt` on the scene's first hit. Poll `readTab` with `pollUntil` until `selected` ≥ 1 and `statusItem` is null. Read A: `canvasRect(page)`, and the bounding-box heights of `.status-bar` and `.attention-strip`.
     - **S1.** `openFixture` again. Poll until `statusItem` is not null, wait two animation frames, and read B.
       - **G1** is the ruling's guard (item 1, OPEN-1). Its probe: the top of `.selection-ended`'s box is at or below the bottom of the footer's first element child's box, less 1 px. Both values are recorded.
       - **G2:** the strip's height in B equals A's.
       - If either guard is unmet, the step is INCONCLUSIVE (class 2, never a pass).
     - **S2.** `buildScene` again, then one Select click. Poll until `statusItem` is null and `selected` ≥ 1. Read C, under G2.
     - **S3.** The canvas's width and height are exactly equal in A, B and C, and the bar's height is 48 in all three.
     - **Recorded, not asserted:** A's canvas height (§1 predicts 712 at 1280 × 800), and in B the bar's scrollHeight against its clientHeight (H2).
   - **The proofs:**
     - the human's property: E-STATUS-HEIGHT, on the real app, with the real notice, at the real window;
     - the one value wired into the frame: SB1 and SB2;
     - keyboard order: E-FOCUS, unchanged;
     - the frame's map minimum: U1's property tests and U-FIT, unchanged.
   - Check:
     - the SB harness: frontends/shell/src/layout/StudioLayout.test.tsx:22-73 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1986db86c345deb2e52db6d03b8f9d4af570579c0df44b17e3c804e2d3e59c04;
     - the optional slot: frontends/shell/src/layout/contributions.ts:79-83 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b72904c2f31872b672fe5d5f2d91117eb4e9b1dcefdfa49e11a05b49139f9078;
     - the style object on `.app`: frontends/shell/src/layout/StudioLayout.tsx:225 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:aede39fae0e25293904808929047a59f1f11b042dfa775b2f94da060303b5274;
     - `hasContent`: frontends/shell/src/layout/StudioLayout.tsx:73-76 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2ca9fee9e0dc737ba983a8fe599cec293b6a93198a7b6beef374936faf64b5df;
     - the e2e calls, in their real shapes: frontends/shell/e2e/selection.mjs:199-203 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6feaafb60ce8a164364041a2af483b2177a1c5fa2b0a05b3e278cf33f1b182aa, frontends/shell/e2e/selection.mjs:270-280 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:8b3dc2000e6d99ff6fffb5d5a1e2b6ab7f064c90a861f432308ca550eff3066a, frontends/shell/e2e/selection.mjs:163-164 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:8c123f66cd06ff1f1209590e1064c1299fc5020d1716c51591b00a4d401be95d, frontends/shell/e2e/selection.mjs:186-189 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b36288b255865fb08f60dd666ebc930a005211e572e6d009967e701418530f13, frontends/shell/e2e/selection.mjs:129-138 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6c94973a5995341fc114debba0db2591bc3910d9ae00e324aa20ae2975b47424 and frontends/shell/e2e/selection.mjs:141-160 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:82fd527fdb7e240b6909b877a57b07f4bf359caab15793bc2070d177e1cce3b2;
     - Select and Add only: frontends/shell/e2e/selection.mjs:332 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:07cb10c7a18d598d19a0188da84cb5644707a26695cd904d8eb0efe9e216027f and frontends/shell/e2e/selection.mjs:416 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:24b760b7a25d9616ac2806b6eece41e5e15e6e0b805d8ab6065e8540f7a41d57;
     - the reopen-to-notice pattern: frontends/shell/e2e/selection.mjs:464-468 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:fe69b54d6789c9db6a5ca31b7d90301693b56b8c35c28cffe915794204295f9e;
     - `canvasRect`: frontends/shell/e2e/lib.mjs:572-579 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:000eee7cef2907f0113e7a10e59cb0dd54799317127928d6c1fc250144098128;
     - the notice element: frontends/shell/src/App.tsx:2266-2270 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a634f5cebf8c4098ecabf9af54d4dfbeaab5657358b7a36c982678293931844d;
     - it clears at the next selection transition: frontends/shell/src/App.selection.test.tsx:414-416 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:bf4d96e35b20defa7eee4de38f1b692ead8501abcac55f6391554e0e6e4adb31;
     - the strip's class: frontends/shell/src/layout/StudioLayout.tsx:258 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9c930fff9e3c991320e4b7c8c2f266c904a7998ee37f1e216a758e507a34f921;
     - U-FIT's sizes stay right because the chrome is still 216. At 1280 × 800 with Activity open: 800 − 216 − (200 + 6) = 378, and 1280 − 260 − 340 − 12 = 668. At 1366 × 768: 768 − 216 − 206 = 346, and 1366 − 600 − 12 = 754. The test is frontends/shell/src/layout/layoutState.test.ts:127-134 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:64d6e1f5c9279ae0429d9e58d69e5c4063a0ed34a92e224daef591000bdf5f08, and the fit is frontends/shell/src/layout/layoutState.ts:138-149 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:bb0f99e44ad1511a9a2ec5d164e66e11717994a51516f3166ea8261bcb197c81.

   **§7, restated**
   - **Constants.** `STATUS_BAR_HEIGHT_PX = 48`, renaming `STATUS_BAR_MAX_HEIGHT_PX = 48`, with the value unchanged. No other constant, and no z-index.
   - **Budget.** The command and `<base>` are unchanged.

   | Group | Files (ceiling each) | Lines, at most |
   |---|---|---|
   | P product | styles.css ≤ 12, StudioLayout.tsx ≤ 10, layoutConstants.ts ≤ 6, layoutState.ts ≤ 10 | 38 |
   | T tests | StudioLayout.test.tsx ≤ 70 | 70 |
   | E e2e | selection.mjs ≤ 90, margin 20 | 110 |
   | **Total** | **6 files** | **218** |

   - Each group total is under the original table's (164, 208, 190), as §7 requires of a restatement.
   - **Outside the count:** MANUAL-WALKTHROUGH.md ≤ 30. KNOWN-LIMITATIONS.md and e2e/README.md are not edited.
   - An overrun is class 8, and this section is never edited to match it.
   - Check: the value is frontends/shell/src/layout/layoutConstants.ts:36 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3fa37ac06da8053d9b210e7bcd7940077cf52d5c5f9cace6d58f0396afebdb2e. The rest are declarations.

3. **The consequences, through the rest of the form.**

   **§0.6, restated**
   - **H1.** With the status row and the bar's height both `var(--status-h)` = 48, the canvas's CSS width and height are identical before the ended-selection notice appears, while it stands and after it clears. Discriminator: E-STATUS-HEIGHT and its mutation. If it fails: I10.
   - **H2.** At the WebView2 default font size, two lines of status items fit in the 48 px bar without scrolling. Discriminator: run 5's two-line bar (§2.2's check); E-STATUS-HEIGHT records B's scrollHeight against its clientHeight. Recorded, not asserted. If it fails: I2.
   - **H3 and H4** are unchanged. Amendment 2, RS3, answers H4.
   - **H5** falls away: nothing is cut.

   **§1, restated**
   - May claim: unchanged.
   - May not claim: the first four bullets are unchanged. The fifth becomes: that every status item is in sight without scrolling the bar. Beyond two lines the bar scrolls inside, as it does today.
   - **No change** to the wire, SKP, the kernel, the engine, the renderer, `src/canvas/`, `src/workspace/`, `src/feature/`, `src/publish/`, App.tsx, or any status item's text, order or role.
   - **ADR-006:** the piece adds no state and no action. Nothing enters the workspace, and nothing is sent to the kernel.
   - **ADRs cited:** unchanged.
   - **Strings:** no new or changed operator string.
   - **The Activity consequence falls away** (item 1, OPEN-1). The fit's reservation is unchanged, so Activity's clamp is unchanged.
   - **Declared consequence.** The bar is 48 px tall whatever it holds. Where it held one line it was 24 px, so the map is now 24 px shorter there: at 1280 × 800, with the strip empty and Activity closed, 712 px where run 5 measured 736. This is arithmetic, not a measurement; E-STATUS-HEIGHT records it (A).
   - Check:
     - the scroll: frontends/shell/src/styles.css:164 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:d8e725cfd024c01d1f4bc5bed9d4756a29680fa40083016cf35e7ee4b88e2502;
     - App.tsx: §2.10 below;
     - no state: §2.4 (c);
     - Activity's clamp: frontends/shell/src/layout/layoutState.ts:138-141 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ea636a3cdf9656c6c9f0e1f28a2ffff90e7c455da4aea0574682fb4f6f669fc9;
     - the one line at 24 px: run 5 (frontends/shell's §0.4 arithmetic over state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md:17 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f10aa01fd35f6d7d5ff6eedb880b0315686657dce714f8e3e5d8466ad30daeb9);
     - 712 = 800 − 40 − 0 − 48. The top bar is frontends/shell/src/layout/layoutConstants.ts:34 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2d0e246f7692fef9636a17c608cb9e59693e051dd6781c443ee30f80f41379c5. The strip is hidden when empty (frontends/shell/src/layout/StudioLayout.tsx:258 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9c930fff9e3c991320e4b7c8c2f266c904a7998ee37f1e216a758e507a34f921 with frontends/shell/src/styles.css:53-55 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:92af1ac5a78f5e0b11a21f9b639ee53661a5cb95d658aceaa262c304da0d7d47). Activity is closed by default (frontends/shell/src/layout/layoutState.ts:51 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1a823b58e36c69146854c27e4da4dcd4eafee6f976282754b74bd6ee720346d5), so its rows are 0 (frontends/shell/src/layout/StudioLayout.tsx:196-197 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:d6e18a9b7fc9d074739a39b95ecd9d4d430a378f16441eebc72ba656dfc192b0, frontends/shell/src/layout/layoutState.ts:141 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b13bce130645d42efb0279e3b033c0f9b2afd1a354d8e900eba9b8a9644b6e19).

   **§2.5 layout/regionParts.tsx.** Falls away: with no cut there is no span and no `title`. The file is not edited. Check: §2.1 (b) keeps the wrap.

   **§2.7, restated: no existing test changes.**
   - layoutState.test.ts is not edited. The defaults' predicted map size does not change: `[668, 378]` and `[754, 346]` stand (§4's check).
   - layout.mjs is not edited.
     - E-FOCUS's walk has no `status` stop, and (d) adds none: frontends/shell/e2e/layout.mjs:217 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:c72011cbbc1bd335826ad48322e0b2a2645cc7b1f4acd86b60b581418a1beb5a.
     - E-FLOOR's comment names caps of 128 and 48, which stay true, and its assertion is predicted to pass: frontends/shell/e2e/layout.mjs:268-274 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3c171f619cd5cd48ba3f8d19bc771d45fa9f4c0a6780bf4b673ffe43ed120c9d.
   - e2e/README.md is not edited (item 4).
   - App.tsx is not edited.
   - **New:** SB1 and SB2 in StudioLayout.test.tsx, and E-STATUS-HEIGHT in selection.mjs.

   **§2.8, restated: none.** No new or changed operator string. All four placeholders drop: the toggle's label, the footer's `aria-label`, the class-C statement, and item 40's drafted replacement with its clause list. Check: §2.4 (c), and OPEN-3 (b) (item 1).

   **§2.9, restated.** A new Part, appended at the file's tail with a blank result log, under the letter Z (Amendment 2, RS8).

   **§9's Operator rows (Part Z), restated**
   - **Z0:** read §10, the last amendment first.
   - **Z1:** open `filter-zoned.parquet`, choose Select, and click one feature. Open the file again: the ended-selection notice is in the status bar. **Felt:** did the map move or change size? Click a feature with Select: the notice clears. Did the map move?
   - **Z2:** with a file open and no notice, read the bar. It is two lines tall while it holds one line. Record anything that reads as wrong.
   - **Z3:** with Narrator on, open the file again over a selection. Record whether the whole notice is read.
   - **Z4:** at 1024 × 640 (DevTools device toolbar), open the file again over a selection and read the bar. It stays two lines tall, and if its items need more it scrolls inside. Record whether the notice needed scrolling to be seen.
   - The former Z2, Z3 and Z6 fall away.
   - Check: Z1 is E-STATUS-HEIGHT's felt twin; Z2 is §2.1 (b); Z4 is frontends/shell/src/styles.css:164 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:d8e725cfd024c01d1f4bc5bed9d4756a29680fa40083016cf35e7ee4b88e2502.

   **§2.10, restated**
   - **May edit** (under `frontends/shell/`):
     - `src/styles.css`;
     - `src/layout/StudioLayout.tsx`, `src/layout/layoutConstants.ts` and `src/layout/layoutState.ts`;
     - `src/layout/StudioLayout.test.tsx` (one new describe block, SB1 and SB2);
     - `e2e/selection.mjs` (E-STATUS-HEIGHT before E-DBLCLICK; its name in the header's step list; its recorded-mutation lines);
     - `MANUAL-WALKTHROUGH.md` (Part Z only).
   - **Not edited:**
     - `src/App.tsx`;
     - `src/layout/regionParts.tsx`, `contributions.ts`, `statusItems.ts`, `actionRegistry.ts` and `layoutState.test.ts`;
     - `src/console/surfaceRegistry.ts`;
     - `e2e/layout.mjs` and `e2e/README.md`;
     - `App.selection.test.tsx`, `App.layout.test.tsx`, `package.json` and `src-tauri/**`;
     - everything under `src/canvas/`, `src/skp/`, `src/streaming/`, `src/residency/`, `src/workspace/`, `src/feature/` and `src/publish/`;
     - every walkthrough Part but Z;
     - the root `KNOWN-LIMITATIONS.md`;
     - every file outside `frontends/shell`, records excepted.
   - **Disjoint from the Current view fix** (Amendment 2, item 4). **Placement:** slot 2 before b2-piece-1b-recording (item 1, OPEN-2), with code starting after Amendment 2. No path under `protocol/`.
   - Check: the SB harness's file is frontends/shell/src/layout/StudioLayout.test.tsx:1-18 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:c4b12c54d11a2dbc0cefd2829526ee269dc6b3bc8cba239d56be2de139b30dc1. The step list is frontends/shell/e2e/selection.mjs:7-8 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f8c65f6aba1ae3f2021a1d0a4335172b31baea42ad5b152c99015c9e751658ad.

   **§2.11.** The Not-claimed bullet becomes: whether the bar is a keyboard focus stop when its items need more than two lines and it scrolls. Chromium may make a scrolling element that has no focusable child focusable. This piece does not test it, and in E-FOCUS's run the bar does not scroll (Amendment 2, RS5). The rest of §2.11 is unchanged.

   **§3, restated**
   - **Fixture:** unchanged.
   - **Predicted:**
     - every existing suite passes at the head, with no test edited;
     - SB1, SB2 and E-STATUS-HEIGHT pass;
     - under E-STATUS-HEIGHT's mutation, the reading taken while the notice stands is shorter than A's. Run 5 gives 715.453125 against 736 at 1280 × 800: recorded, not asserted;
     - E-FOCUS's walk is unchanged;
     - H3's diagnostic run passes;
     - wherever the bar held one line, every e2e suite now runs on a map 24 px shorter than at its last green run (§1). They are predicted to pass because they read the live box (frontends/shell/e2e/lib.mjs:572-579 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:000eee7cef2907f0113e7a10e59cb0dd54799317127928d6c1fc250144098128; frontends/shell/e2e/layout.mjs:75-91 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ed6ffeb3cfcf2ea122b68096bf7ba5661d36aa9043d9872d105114a20d653fe7; frontends/shell/e2e/pan-anchor.mjs:130-131 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a50ac717f4635cdaf3813cd32b9f74a700e548173d128255dccc0a904f7109b6). A failure is I7.

   **§5, restated**
   - **Predicted:** H1 to H4 (§0.6 as restated) and §3.
   - **Declared unchanged:**
     - every status item's text, order, class, role and style;
     - the bar's wrap, gap, padding and scroll;
     - `STATUS_ITEMS`, `Slots`, App.tsx and the Feature tab;
     - the attention strip, its row and its cap;
     - `LayoutState`, the reducer, the fit's 216 px of chrome, the map minimum, and U-FIT's sizes;
     - every existing unit and e2e test, E-FOCUS and E-FLOOR included;
     - E-DBLCLICK last;
     - the dependencies and the lockfile.
   - **Declared changed:** the map's height wherever the bar held one line (§1).
   - **Invalidators:**
     - I2 becomes: two lines of items do not fit in the 48 px bar in E-STATUS-HEIGHT's B at the default font size (H2).
     - I4 becomes: the render harness (jsdom, frontends/shell/vitest.config.ts:10 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:01da41a69160e3c74942adc39630cd615223ae0232d19b70d7f7186ebc26ce31) cannot read a CSS custom property that StudioLayout sets on `.app`, so SB1 and SB2 cannot be built as written.
     - I1, I3 (with G1 as restated) and I5 to I10 are unchanged.
   - **Falsification:** the form is wrong if two fixed lines cannot hold the bar's items in the ordinary case at the default font size. The cut clause falls away.

   **§6, restated**
   - **Assertions:** SB1, SB2, E-STATUS-HEIGHT and every existing row.
   - **Observations:** H2's fit, A's canvas height, and H3's diagnostic order run.
   - **Measurements and forced scale factors:** none.
   - **The human's:** Part Z's felt rows. There is no P6 sight, because there is no new string.

   **§8, restated items** (the rest unchanged)
   - 4. A status item's text changed, truncated or removed from the DOM; an item cut by CSS; or the bar's wrap or scroll removed.
   - 5. Any region's size depending on the status bar's content.
   - 9. Any new or changed operator string.
   - 15. E-DBLCLICK moved from last, or any existing test or assertion changed.
   - 16. Any edit to KNOWN-LIMITATIONS.md (OPEN-3 (b)).
   - 17 (new). A button, toggle, console row, focus stop or new string for the status bar (OPEN-1 (d)).
   - 18 (new). Any edit to e2e/README.md (OPEN-2 (b)).

   **§9, restated bullets**
   - The README lines of item 4 are deferred to `e2e-readme-status-bar-steps` (item 1, OPEN-2). Every other Documentation finding is fixed in the PR.
   - The wording-block rule: §2.8 has no strings, and item 40 is not edited. Comments fall under item 2d.
   - The suites are unchanged. The Operator rows are Part Z as restated above.

4. **The README lines that move to `e2e-readme-status-bar-steps` (OPEN-2 (b)), as (d) leaves them.**
   - frontends/shell/e2e/README.md:770 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6da77c9c4dbb5dae1d1679841770791db8ceaac162845e8742248cba51f932f2, the selection entry's Asserted list:
     - (i) E-STATUS-HEIGHT joins the list before E-DBLCLICK;
     - (ii) E-DBLCLICK's parenthetical gives run 5's reason for running it last and names this piece as the move. That clause becomes history when this piece merges: the notice still takes a second line, but the map no longer moves. E-DBLCLICK stays last (§8 item 15).
   - Unchanged under (d):
     - frontends/shell/e2e/README.md:754 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:382acb61fa1fca8c310510df24991d555d530586d43bfb73eb92d9cf073ef03c (E-FOCUS's sentence; E-FOCUS is unchanged);
     - frontends/shell/e2e/README.md:768 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:37ba93945310fec7f2d1aae23e356087323a448b1d2880919ec8fc8b9252b257;
     - frontends/shell/e2e/README.md:774 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:aaea2844e8cac545942f546a9d881d0b7cac8cfcd70cfaab04986d5e3a1b001b.
   - The node lands after both this piece and the Current view fix (§11, OPEN-2 (b)). The window between the merges is accepted (item 1, OPEN-2).

5. **Generation:** the node's generation goes up by one.
   **Superseded index:**
   - §11's OPEN-1 to OPEN-3 → item 1;
   - §2.1 to §2.4, §2.6, §4's rows and §7 → item 2;
   - §0.6, §1, §2.5, §2.7 to §2.11, §3, §5, §6, §8 and §9 → item 3;
   - §0.2's disclosure-pattern bullet, and §0.5's presence, recorder and render-harness bullets → fall away with OPEN-1 (a);
   - §2.7's README bullet → item 4.

Nothing above is edited.

### Amendment 2 — the re-sweep at the code base, main 2cf707a3 (class 3; no class 1)

*Drafted by the architect at main 2cf707a37be51100865999a5bd2991a8d9d1762f, before any code. PR #217 merged at 71fd2c4f (branch head 3d9e42e1), and #215 and #216 have merged since the form was drafted. The custodian adds each pin's sha256 by script. Where a row says the lines are the same, the proof is that the hash at 2cf707a3 equals the form's hash; if it differs, the row is a changed re-pin and is reported.*

1. **RS1 to RS9 at 2cf707a3.**

| Item | Answer |
|---|---|
| RS1 | Yes. `selectionEnded` is the last of `STATUS_ITEMS` (frontends/shell/src/layout/contributions.ts:48-55 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:fb9a9cf0348859f32168e60781819505d9edfdb7ea3568287ec0bb4ba774c5a6) and the one optional slot (frontends/shell/src/layout/contributions.ts:79-83 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b72904c2f31872b672fe5d5f2d91117eb4e9b1dcefdfa49e11a05b49139f9078). App renders one `div.selection-ended` with `role="status"` and the text `noticeText(notice)` (frontends/shell/src/App.tsx:2266-2270 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a634f5cebf8c4098ecabf9af54d4dfbeaab5657358b7a36c982678293931844d; frontends/shell/src/feature/FeatureTab.tsx:68-76 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b98c0ad2f3344414b3866d30a04843ad33fd35fd84e2b2f3e2d16970f70565b0). It clears at the next selection transition (frontends/shell/src/App.selection.test.tsx:414-416 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:bf4d96e35b20defa7eee4de38f1b692ead8501abcac55f6391554e0e6e4adb31, inside RB4). Not I1. |
| RS2 | The props are frontends/shell/src/layout/StudioLayout.tsx:112-125 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7ea13cd4a5240d02a61cc7603b00a94c3c9747f4c8d9540383a2aea5022000f9, as §0.5 says. The footer is frontends/shell/src/layout/StudioLayout.tsx:335-339 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:4d1968fdaacfeb237feeeb71fed66557fd389c04af0f07c18128f97f5aee4dc5. `STATUS_ITEMS` and `Slots` are as in RS1. `STATUS_BAR_MAX_HEIGHT_PX` is declared at frontends/shell/src/layout/layoutConstants.ts:36 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:3fa37ac06da8053d9b210e7bcd7940077cf52d5c5f9cace6d58f0396afebdb2e and read at frontends/shell/src/layout/StudioLayout.tsx:27 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a62c407080797107d6034508b3a7cb05950c42c995a9bc964f3c325bde7fdc29, frontends/shell/src/layout/StudioLayout.tsx:200 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ea5afe6ef7e3a458aab782139056002c6f1077a020d9eb7bd4eb4657e9643443, frontends/shell/src/layout/layoutState.ts:13 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a62c407080797107d6034508b3a7cb05950c42c995a9bc964f3c325bde7fdc29 and frontends/shell/src/layout/layoutState.ts:138 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:88eda6c92865430b601742fa59ae070de95728dd3f336e387dff6603ab6d0c6e. `--status-max-h` is set at StudioLayout.tsx:200 and read at frontends/shell/src/styles.css:163 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ec42bf40a2367cbd8060d431f69684e5d3598b937f8c5b867edf3fa6a3f01d30. No test or e2e file reads either. |
| RS3 | Five items. **Residency:** `.residency-status`, role status (frontends/shell/src/App.tsx:2195-2199 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2f6e19ffd2d8060bfa5aba0102341336b9e166d661581f64d1220682097ba333); its longest text is an over-budget sentence with a suffix (frontends/shell/src/residency/residencyStatus.ts:464-474 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:eefb44a1f952b31b14b530a189e636948db7c5d8c8364a251acc8702e2435171). **Scan mirror:** `.status-scan-liveness`, no role (frontends/shell/src/layout/regionParts.tsx:208-213 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:052fe61f70c736116828dfd94d3c1431e7090d013d930b6549dc36c53f6116ba). **Scan incomplete:** `.scan-incomplete`, role status (frontends/shell/src/App.tsx:2209-2213 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ba3b0fa6168d760e66b4a4eaf9b7bb040aa87ef8500e09d794111aeb40a9afad). **Watcher:** `.status-source-watch`, role status; its longest text is the degraded form (frontends/shell/src/layout/statusItems.ts:27-35 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:4710944952345cae029db5a1211d6fbdd0fd5a9df3df3f2fbc656e6705bfe7e9). **Ended selection:** as in RS1. Every read of a status item is its textContent or its presence (for example frontends/shell/e2e/selection.mjs:155 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b4cd35d2a725b6241efa298cbe2c320ded3b4c7d195044c97007af8b68926264, frontends/shell/e2e/layout.mjs:438 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2620b052278ee849011d12ee3fe2ad1bab96dbf97b698e9cdde5d82c135f3d0d, frontends/shell/e2e/residency-harness.mjs:846-849 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:affc8d7ea1da71380157fb5c2afb7bb901feaff6f02eee6a5d391ffc5c6385ea, frontends/shell/src/App.selection.test.tsx:257 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:e890f13737765edb563f6e60049bcd636833f7f596a1387299ad25cc47700ec7, frontends/shell/src/App.lateResult.test.tsx:606 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b58d64d0cc41f320fad36cf9a0ac9a17c21ba58d5178f96e57896e9745cbbb55). There are two other reads, neither an item read. A page-wide `innerText` filtered to export lines (frontends/shell/e2e/selection.mjs:104-111 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:2889472451f6dad4c962001f6f127963b5cd0236d7e3c71bd209d9107d6402ca) sees the same text, since nothing is cut. E-FLOOR reads the bar's height (frontends/shell/e2e/layout.mjs:303-307 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:d14940156c0e4752dad1be599245f7d9d5fb0ba3fbf18a482d0d962f8133437d); its assertion is the map minimum, predicted to pass. No I7. |
| RS4 | The order is frontends/shell/e2e/selection.mjs:761-787 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:613cb639fc7d14fdf1c6d3aabf27017c21b774ce021ebff2574f5f6f4848c916, with E-DBLCLICK last at frontends/shell/e2e/selection.mjs:787 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9635711c3d226ffb5ae5558a1534bb73276c85c3b0f2ddf1177b1cc8580801ee. `readTab`'s `statusItem` is the textContent of `.selection-ended` (frontends/shell/e2e/selection.mjs:155 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b4cd35d2a725b6241efa298cbe2c320ded3b4c7d195044c97007af8b68926264). `openFixture(page, consoleHandle, path, label)` is frontends/shell/e2e/selection.mjs:199-203 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6feaafb60ce8a164364041a2af483b2177a1c5fa2b0a05b3e278cf33f1b182aa. `buildScene(page, consoleHandle, label, { want, min })` is frontends/shell/e2e/selection.mjs:270-280 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:8b3dc2000e6d99ff6fffb5d5a1e2b6ab7f064c90a861f432308ca550eff3066a and returns `{ hits, rect, notch }`. `useTool(page, name)` and `useMode(page, label)` are frontends/shell/e2e/selection.mjs:163-164 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:8c123f66cd06ff1f1209590e1064c1299fc5020d1716c51591b00a4d401be95d. `canvasRect` is frontends/shell/e2e/lib.mjs:572-579 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:000eee7cef2907f0113e7a10e59cb0dd54799317127928d6c1fc250144098128: the `.working-canvas` box, or null. Amendment 1's E-STATUS-HEIGHT is written in these shapes. |
| RS5 | E-FOCUS's expected walk has no `status` stop (frontends/shell/e2e/layout.mjs:217 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:c72011cbbc1bd335826ad48322e0b2a2645cc7b1f4acd86b60b581418a1beb5a); a focus inside the footer is named `status` at frontends/shell/e2e/layout.mjs:207 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f2146e2ee6adc9c59f3a620f8187487b8c335acf39c2ab0f9a012779810db888. In an ordinary run the bar holds the watcher item: the suite admits filter-zoned (frontends/shell/e2e/layout.mjs:106-115 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:bd6a35c4eebe1a2474ad78ff0f5100cd21e69ed810beff037613a2150614e915), and the item renders for an admitted dataset with no ended session (frontends/shell/src/App.tsx:2217-2219 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:48b6a7e93c608f8b7bcc8e5b5ee879f859af25ce9cd614676c8b6a2cd2de0f9f; frontends/shell/src/layout/statusItems.ts:27-28 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:751a07033c7ad6fd52f1089f0d39baf904f77a375ca52608b66e2fd557ebb9ae). No item holds a focusable element, and the bar does not scroll in that state, so E-FOCUS is unchanged. E-FLOOR's probe is frontends/shell/e2e/layout.mjs:285-299 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f1f040efe7aa3cabbaf901f4041c7dcb8ca09eb141bc12462d4f005bfde777a9, and its assertion is frontends/shell/e2e/layout.mjs:309-310 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a71dcc35eaa35a67a8a52737b4f05e957d02bad514a55fe28328caff0a12fe4d: 480 × 320 at 1024 × 640, unaffected by a fixed 48. |
| RS6 | Not merged: `e2e/export-view.mjs` is absent at 2cf707a3, and the fix enters slot 1 now. Under OPEN-2 (b) this piece does not edit e2e/README.md, so the answer changes nothing. |
| RS7 | The class-C layout rows are frontends/shell/src/console/surfaceRegistry.ts:275-323 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:17b49102d32771843b7772727a4a63c43ec3a8afc3b818f466e6a02a63cc28e2. Under (d) the piece adds no `recordNamed` call and no row (Amendment 1, §2.4 (c) and §2.6), so it needs no tie. |
| RS8 | In use: A to N, P (twice), Q, R, S, T, U, V, X and W (frontends/shell/MANUAL-WALKTHROUGH.md:1808 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1f88d5e46b14ae313cf26b223689c59481b95c6d44985d2000c4ea3e0c52541e is W, the last). Y belongs to the Current view fix (state/consults/2026-10-14-export-current-view-resweep-architect.md:58 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:cfea392dd60e5b70468b444c7394cbd6f8aa4f4cca40f4203c6a8ea6590b9248). Z is unused, so this Part is Z. |
| RS9 | Item 40 is KNOWN-LIMITATIONS.md:382-384 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:e577fa251361c4d398d7ec98781f6379dbd25ba81609aedbe3b209a45fc6a3f2. Its status-bar sentence is KNOWN-LIMITATIONS.md:383 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f51e2e55d1c8cbbab2896ab6b45a9560911082a7e7b366dd8c0feeb4be1c9825, moved 6 lines by item 42 at KNOWN-LIMITATIONS.md:191 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:5e99269df64111a8c264fa9d45ef54394431f182ebb4616ac6f919a14c05ee99. Its words are unapproved (the comment at :384), and the human ruled OPEN-3 (b): they stand as written and are seen at the sitting (Amendment 1, item 1). Not edited. |

2. **Class 3 rows.**

   **The `@ d59f1a6a` branch pins, now pinned on main.** No row changes text; the d59f1a6a text was compared in the worktree only for App.tsx, selection.mjs:787 and item 40.

| Place in the form | Old pin | New pin | Change |
|---|---|---|---|
| §0.4 the footer | line 335-339 of StudioLayout.tsx | frontends/shell/src/layout/StudioLayout.tsx:335-339 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:4d1968fdaacfeb237feeeb71fed66557fd389c04af0f07c18128f97f5aee4dc5 | none |
| §0.4 the list | line 48-55 of contributions.ts | frontends/shell/src/layout/contributions.ts:48-55 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:fb9a9cf0348859f32168e60781819505d9edfdb7ea3568287ec0bb4ba774c5a6 | none |
| §0.4, §0.5 the optional slot and `Slots` | :79-83 @ d59f1a6a; line 79-83 of contributions.ts | frontends/shell/src/layout/contributions.ts:79-83 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b72904c2f31872b672fe5d5f2d91117eb4e9b1dcefdfa49e11a05b49139f9078 | none; the bare `:79-83` gets its path |
| §0.4, §2.8 the render | line 2266-2270 of App.tsx; App.tsx:2266-2270 @ d59f1a6a | frontends/shell/src/App.tsx:2266-2270 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:a634f5cebf8c4098ecabf9af54d4dfbeaab5657358b7a36c982678293931844d | none; §2.8's short path gets its full path (the bullet falls away, Amendment 1 item 3) |
| §0.4 `noticeText` | line 68-76 of FeatureTab.tsx | frontends/shell/src/feature/FeatureTab.tsx:68-76 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b98c0ad2f3344414b3866d30a04843ad33fd35fd84e2b2f3e2d16970f70565b0 | none |
| §0.4, §2.8 the tab | line 128-132; FeatureTab.tsx:128-132 @ d59f1a6a | frontends/shell/src/feature/FeatureTab.tsx:128-132 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ee4d82a73dea399880903ba050fdd5f123faad9065919d107cc97c19fe5edc11 | none; full path, as above |
| §0.4 the style | line 642-652 of styles.css | frontends/shell/src/styles.css:642-652 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:403c97445da0f7e03d1be8e43e097bf50c9af152a3c6a20e485db8bce42bef54 | none |
| §0.4 RB4 | line 399-431 of App.selection.test.tsx | frontends/shell/src/App.selection.test.tsx:399-431 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:97fbc3ff8907f456d8a7bd20b83a976ae0dfa081365a933775a5f4734565fdcb | none |
| §0.4 E-DBLCLICK last | line 787 of selection.mjs | frontends/shell/e2e/selection.mjs:787 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:9635711c3d226ffb5ae5558a1534bb73276c85c3b0f2ddf1177b1cc8580801ee | none |
| §0.4 scan incomplete | line 2209-2213 of App.tsx | frontends/shell/src/App.tsx:2209-2213 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ba3b0fa6168d760e66b4a4eaf9b7bb040aa87ef8500e09d794111aeb40a9afad | none |
| §0.4 item 40 | line 376-378 of KNOWN-LIMITATIONS.md | KNOWN-LIMITATIONS.md:382-384 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:e577fa251361c4d398d7ec98781f6379dbd25ba81609aedbe3b209a45fc6a3f2 | moved +6 (item 42 inserted); text unchanged |
| §2.8 item 40's sentence | line 377 of KNOWN-LIMITATIONS.md | KNOWN-LIMITATIONS.md:383 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f51e2e55d1c8cbbab2896ab6b45a9560911082a7e7b366dd8c0feeb4be1c9825 | moved +6; the bullet falls away |
| §0.5 the props | line 112-125 of StudioLayout.tsx | frontends/shell/src/layout/StudioLayout.tsx:112-125 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:7ea13cd4a5240d02a61cc7603b00a94c3c9747f4c8d9540383a2aea5022000f9 | none |
| §0.5 the render harness | line 174; line 453-457 of App.layout.test.tsx | frontends/shell/src/App.layout.test.tsx:174 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:4bd10d84582eceaacb3c7e0ab966664237252be92850cf0fe4f28a60c0fbe26a; frontends/shell/src/App.layout.test.tsx:453-457 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6d7b3c5390e9034025e8f11a1705535e5338bcfbbb5d185f78116361562c4d49 | none (no longer bears under (d)) |
| §0.5 `readTab` | line 140-160 of selection.mjs | frontends/shell/e2e/selection.mjs:140-160 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:b23b5ffd47fdb4cd56c1bee0b83d8788f3e276a280ab8fbff0dd5e7d47e98add | none |
| §0.5 `useTool`, `useMode` | line 163-164 | frontends/shell/e2e/selection.mjs:163-164 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:8c123f66cd06ff1f1209590e1064c1299fc5020d1716c51591b00a4d401be95d | none |
| §0.5 `openFixture` | line 199-203 | frontends/shell/e2e/selection.mjs:199-203 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:6feaafb60ce8a164364041a2af483b2177a1c5fa2b0a05b3e278cf33f1b182aa | none |
| §0.5 `buildScene` | line 265-280 | frontends/shell/e2e/selection.mjs:265-280 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:1454aba7e20e7c24fc4d3aed4eba87d1e4c026ee023849fb50e2bc93f9367142 | none |
| §0.5 `canvasRect` | line 572-579 of lib.mjs | frontends/shell/e2e/lib.mjs:572-579 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:000eee7cef2907f0113e7a10e59cb0dd54799317127928d6c1fc250144098128 | none |

   **The `@ 117aac6c` pins whose lines moved or changed.**

| Place in the form | Old pin | New pin | Change |
|---|---|---|---|
| §0.4 the CSS variable | frontends/shell/src/layout/StudioLayout.tsx:180 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:ea5afe6ef7e3a458aab782139056002c6f1077a020d9eb7bd4eb4657e9643443 | frontends/shell/src/layout/StudioLayout.tsx:200 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:ea5afe6ef7e3a458aab782139056002c6f1077a020d9eb7bd4eb4657e9643443 | moved +20 by phase B; text unchanged if the hashes match |
| §0.4 the footer | frontends/shell/src/layout/StudioLayout.tsx:306-310 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:4d1968fdaacfeb237feeeb71fed66557fd389c04af0f07c18128f97f5aee4dc5 | frontends/shell/src/layout/StudioLayout.tsx:335-339 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:4d1968fdaacfeb237feeeb71fed66557fd389c04af0f07c18128f97f5aee4dc5 | moved +29 |
| §0.5 the `recordNamed` call sites | frontends/shell/src/layout/StudioLayout.tsx:83-105 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:77ac9adbcbbdb339fa8b5473da21b2ca91269537c9a66aa731214f47fa5e2566 | frontends/shell/src/layout/StudioLayout.tsx:88-110 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:77ac9adbcbbdb339fa8b5473da21b2ca91269537c9a66aa731214f47fa5e2566 | moved +5 |
| §0.5 the focus rule | frontends/shell/src/layout/StudioLayout.tsx:132-144 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:f737b80ed7d16f075e4f2b5d0969baba5ec4d463085bcab504184c4dd695e221 | frontends/shell/src/layout/StudioLayout.tsx:140-152 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:f737b80ed7d16f075e4f2b5d0969baba5ec4d463085bcab504184c4dd695e221 | moved +8 |
| §0.5 the class-C layout rows | frontends/shell/src/console/surfaceRegistry.ts:275-324 @ 117aac6cca967bd43dda2f737ccab536f7a7073b sha256:dc05b341f5abc2dc005e451fcd83e8104e9e75806e350b22fe8c945c8b17afde | frontends/shell/src/console/surfaceRegistry.ts:275-323 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:17b49102d32771843b7772727a4a63c43ec3a8afc3b818f466e6a02a63cc28e2 | the seven rows end at :323, and :324 now opens phase B's `tool.set` row; :300's statement names the Feature tab. The hash comparison names what changed |

   **The `@ 117aac6c` pins read at the same lines** (proved unchanged if the hashes match):
   - styles.css :34 and :159-172;
   - layoutConstants.ts :35-36;
   - layoutState.ts :138;
   - SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md :163-172;
   - the run-5 record, :17;
   - residencyStatus.ts :439-473;
   - regionParts.tsx :177-188, :196-214, :207, :216-225 and :219;
   - statusItems.ts :27-35;
   - MANUAL-WALKTHROUGH.md :215-216, :245 and :247;
   - surfaceRegistry.ts :266-274;
   - layout.mjs :75-91, :190-226 and :268-325;
   - layoutState.test.ts :127-134;
   - EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md :181-197;
   - state/directives/2026-10-06-machine-script-adopted.md :12-22.

3. **Class 1 rows: none.** No interface differs from §0.5, so I1 and I7 do not fire. The plan changes come from Amendment 1 (the ruling), not from this re-sweep.

4. **Disjoint from the Current view fix.**
   - **The fix's paths:** its §2.6 (frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md:181-197 @ 2cf707a37be51100865999a5bd2991a8d9d1762f sha256:08d5801f68f16e73b83f69ac50b86cea251396085c412f862cced1ae809716fb) as its re-sweep reads it, plus the 2026-10-14 ruling's `getViewBox` source comment, which lands in App.tsx or PublishPanel.tsx. They are:
     - App.tsx, PublishPanel.tsx and types.ts;
     - App.selection.test.tsx and PublishPanel.test.ts;
     - new e2e/export-view.mjs and package.json;
     - e2e/README.md;
     - MANUAL-WALKTHROUGH.md (Part Y);
     - the root KNOWN-LIMITATIONS.md (item 42's note);
     - src-tauri/src/publish.rs.
   - **This piece's paths** (Amendment 1, §2.10):
     - styles.css;
     - StudioLayout.tsx, layoutConstants.ts and layoutState.ts;
     - StudioLayout.test.tsx;
     - e2e/selection.mjs;
     - MANUAL-WALKTHROUGH.md (Part Z).
   - **The only file both touch** is MANUAL-WALKTHROUGH.md, and the two Parts count as separate paths (§2.10). Both append at the tail, so the second merge keeps both Parts. Neither piece has a path under `protocol/`.
   - **The zero-size note is unaffected.** With the bar fixed at 48, the map's height reaches 0 at a window up to 24 px taller than before. The fix's added condition (the map has a width and a height) is stated on the map's size, not on a window size, so it is unaffected.

5. **The custodian's hash check,** by script before commit, at main 2cf707a37be51100865999a5bd2991a8d9d1762f:
   - **The form's `@ 117aac6c` pins:** 28 in all. 23 hash equal at the same lines at 2cf707a3. The 5 that differ are exactly the moved rows of item 2's second table.
   - **The `@ d59f1a6a` rows:** d59f1a6a is in main's history, so every row of item 2's first table (19 rows, 20 pins) was compared there, not only the three read in the worktree. Each pin hashes equal at its new pin, item 40's two rows included (moved +6).
   - **The moved rows:** the four StudioLayout.tsx rows hash equal at their new lines. surfaceRegistry.ts's rows (275-324 at 117aac6c; 275-323 at 2cf707a3) differ in one line only, line 300: its statement names the Layer, Style and Feature tabs where it named the Layer and Style tabs. Under OPEN-1 (d) the piece adds no class-C row, so the change bears on nothing here.
   - **Every pin above** carries its full revision and its sha256 over the whole cited lines, computed by the same script.

Nothing above is edited.
