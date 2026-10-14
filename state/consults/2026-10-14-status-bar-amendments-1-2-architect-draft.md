*Custodian's filing note (2026-10-14): the architect's draft of the status-bar form's Amendment 1 (the human's rulings of 09:18:10Z, item 1, with the form restated for OPEN-1 (d) and a clause check per sentence) and Amendment 2 (the §0.3 re-sweep, RS1 to RS9, at main 2cf707a3); the run 2026-10-14T09:32:56Z to 2026-10-14T09:46:47Z by its transcript (Read 42, Grep 28, Glob 3; zero writes); its one SubagentHandback call, at 09:46:46Z. Extracted by script; 146 rooted path:line cite(s) de-rooted and one final newline added; nothing else changed. The message's sha256 as handed back is 8a1e3e8b6c7e11d75e24bb9bfedad7dfa5ce4e5ce1b00f69b9ab6ad46c0404f3; this file's, from line 5 to the end, is 9eaff30fa9e63ef18a5ed2fa9cfcd340cfd8c629ec38e18edeca189776fa48fb. The two amendments are appended to the form from the message as handed back, each pin given its full revision and sha256 by script, with the custodian's hash check added as Amendment 2's item 5. None of it is the human's wording.*

---

main @ 2cf707a37be51100865999a5bd2991a8d9d1762f. **Verdict: pass with notes.** This is a drafting task, not a gate. In the re-sweep no invalidator fires (I1 to I10), and no interface differs from §0.5. Code may start once both amendments are committed.

**Notes for you (not part of the amendments)**

1. **For the human, not a block.** Under (d) the bar is always 48 px tall. Wherever it used to hold one line (24 px), the map is now 24 px shorter: 712 where run 5 measured 736, at 1280 × 800 with the strip empty. The ruling's reason ("the map still never moves") is still true, but the ruling does not mention this. Amendment 1 adds it to §1 as the new declared consequence and to §3 as a prediction (every e2e suite now runs on the shorter map; a failure is I7).
2. **Item 40's source comment is out of date.** It still says the code is on the phase B branch and not yet on main (KNOWN-LIMITATIONS.md:384 @ 2cf707a3), which stopped being true when #217 merged. Under OPEN-3 (b) this piece edits no part of KNOWN-LIMITATIONS.md, so it needs a docs-lane home.
3. **Test file changed.** The SB rows move into the existing harness in `src/layout/StudioLayout.test.tsx`, which renders the real StudioLayout with typed `Slots` and mocks nothing. The new `statusBar.test.tsx` is dropped. One new risk is named as I4: jsdom may not carry a CSS custom property, which SB1 and SB2 need to read.
4. **Hashes and the d59 reads.** I have no shell, so I computed no hashes. I read the d59f1a6a text only in the worktree `C:/dev/wt/mm2b-e2e` (detached HEAD d59f1a6a), and only for three pins: App.tsx 2266-2270, selection.mjs 787 and item 40. Every other row was read at main. Nothing below is in quotation marks except where it was copied from a file.
5. **The OPEN-2 (b) README lines.** Only line 770 of frontends/shell/e2e/README.md (at 2cf707a3) moves to the follow-up node (Amendment 1, item 4). The layout entry's line 754 is unchanged under (d).
6. **Disjointness.** The piece is disjoint from the Current view fix; the only file both touch is MANUAL-WALKTHROUGH.md, in separate Parts (Amendment 2, item 4).

````markdown
### Amendment 1 — the human's rulings on OPEN-1 to OPEN-3, and the form restated for OPEN-1 (d) (class 5)

*Drafted by the architect at main 2cf707a3 and appended by the custodian before any code, with no outcome seen. It holds references and replacement text. Each replacement is followed by a clause check, one entry per sentence (s1, s2 …), checked against the code at 2cf707a3. Nothing above is edited.*

1. **The rulings.**
   - OPEN-1: (d), line 9 of state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md (at 2cf707a3) @ 2cf707a3. Every passage marked [OPEN-1 (a)], [OPEN-1 (b)], [OPEN-1 (c)] or [OPEN-1 (a) or (b)] falls away. Items 2 and 3 below replace the sections it touches.
   - OPEN-2: (b), line 10 of state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md (at 2cf707a3) @ 2cf707a3. The piece stays disjoint, in slot 2 before b2-piece-1b-recording.
   - OPEN-3: (b), line 11 of state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md (at 2cf707a3) @ 2cf707a3. Item 40 is not edited.
   - The attention strip, line 12 of state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md (at 2cf707a3) @ 2cf707a3. §1's strip bullet and §8 item 8 stand.

2. **The sections the ruling names, restated for (d).**

   **§2.1 styles.css**
   - (a) The `.app` grid's last row track becomes `var(--status-h)` instead of `auto`. The bar's row never depends on its content.
   - (b) **`.status-bar`:** `height: var(--status-h)` replaces `min-height: 1.5rem` and `max-height: var(--status-max-h)`. The rest of the rule is unchanged: `box-sizing: border-box`, `overflow-y: auto`, `flex-wrap: wrap`, the gap, the padding and the top border. So the items wrap as today, and beyond two lines the bar scrolls inside, as today.
   - (c) No class or rule is added, and no item's rule changes.
   - (d) **Comments.** The comment on the `box-sizing` line says that the height includes the padding and the border, so the fit's 48 px reservation is the bar's real height. These are Documentation.
   - Check:
     - (a) s1: the track is `auto` today: line 34 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3. It is the `status` area's row: line 41 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3.
     - (a) s2: StudioLayout sets the variable from a constant (§2.4 (a)), and no content enters the style object: line 191-201 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3.
     - (b) s1: line 162-163 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3.
     - (b) s2: line 159-172 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3 (box-sizing :161, overflow-y :164, flex-wrap :166, gap :168, padding :169, border :171).
     - (b) s3: the wrap is :166 and the scroll is :164. Two lines is today's cap: line 35-36 of frontends/shell/src/layout/layoutConstants.ts (at 2cf707a3) @ 2cf707a3, whose value §2.2 keeps.
     - (c) s1: no code claim. §8 item 4 (item 3 below) holds it.
     - (d) s1: the comment line is line 161 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3. The reservation is line 138 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3.
     - (d) s2: a classification.

   **§2.2 layout/layoutConstants.ts**
   - `STATUS_BAR_HEIGHT_PX = 48` replaces `STATUS_BAR_MAX_HEIGHT_PX = 48`; the value is unchanged. Its doc: it bounds the status bar's height, which is fixed at two lines; beyond two lines the bar scrolls inside.
   - No other constant is added.
   - The constant names the quantity it bounds (ADR-010 rule 6).
   - Check:
     - s1: line 35-36 of frontends/shell/src/layout/layoutConstants.ts (at 2cf707a3) @ 2cf707a3.
     - s2 (the doc): the fixed height is §2.1 (a) and (b), and the scroll is line 164 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3. That two lines fit in 48 px rests on run 5: a two-line bar of 800 − 40 − 715.453125 = 44.546875 px (line 17 of state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md (at 2cf707a3) @ 2cf707a3, evidence). H2 records it.
     - s3: no code claim.
     - s4: the name says height, and the doc says what it bounds.

   **§2.3 layout/layoutState.ts**
   - The fit's chrome uses `STATUS_BAR_HEIGHT_PX`. Its value is unchanged, so the fit reserves 216 px of chrome as before (40 + 48 + 128), and `effectiveSizes` returns the same sizes for every state and viewport.
   - Where the doc comments say the status bar is at its cap, they now say it is at its fixed height.
   - The reducer and `LayoutState` are unchanged.
   - Check:
     - s1: the import is line 13 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3, and the sum is line 138 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3. The values are line 33-38 of frontends/shell/src/layout/layoutConstants.ts (at 2cf707a3) @ 2cf707a3. The sum is the constant's only use in the fit: line 119-150 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3.
     - s2: line 97-98 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3 and line 108-110 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3.
     - s3: line 31-90 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3 is not edited.

   **§2.4 layout/StudioLayout.tsx**
   - (a) **The CSS variable.** `--status-h` comes from `STATUS_BAR_HEIGHT_PX`, and `--status-max-h` is removed.
   - (b) **The footer is unchanged.** It holds the status items in §2.5 order, as today.
   - (c) There is no new state, observer, button, `recordNamed` call or focus stop. `StudioLayoutProps` is unchanged, and App passes nothing new.
   - (d) The component's doc comment names this form. It says that the status bar's row and height are one value, `STATUS_BAR_HEIGHT_PX`, so a status item coming or going never changes the map's size.
   - Check:
     - (a): the variable is set at line 200 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3, and the constant is imported at line 23-29 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3. Its only CSS reader is line 163 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3, which §2.1 (b) removes.
     - (b): line 335-339 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3, over line 48-55 of frontends/shell/src/layout/contributions.ts (at 2cf707a3) @ 2cf707a3.
     - (c) s1: every layout `recordNamed` call is in line 88-110 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3, and none is added.
     - (c) s2: line 112-125 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3.
     - (d): the doc comment is line 34-45 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3. The map is the `minmax(0, 1fr)` track (line 33-34 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3). The other row tracks are `--top-bar-h`, the strip's `auto`, `--activity-split`, `--activity-h` and, after §2.1, `--status-h`, and none of the variables is set from a status item (StudioLayout.tsx:191-201 above). The strip's `auto` row is the one the human left alone (item 1), and it holds no status item: line 258-262 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3.

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
     - the SB harness: line 22-73 of frontends/shell/src/layout/StudioLayout.test.tsx (at 2cf707a3) @ 2cf707a3;
     - the optional slot: line 79-83 of frontends/shell/src/layout/contributions.ts (at 2cf707a3) @ 2cf707a3;
     - the style object on `.app`: line 225 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3;
     - `hasContent`: line 73-76 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3;
     - the e2e calls, in their real shapes: line 199-203 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3, line 270-280 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3, line 163-164 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3, line 186-189 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3, line 129-138 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3 and line 141-160 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3;
     - Select and Add only: line 332 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3 and line 416 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3;
     - the reopen-to-notice pattern: line 464-468 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3;
     - `canvasRect`: line 572-579 of frontends/shell/e2e/lib.mjs (at 2cf707a3) @ 2cf707a3;
     - the notice element: line 2266-2270 of frontends/shell/src/App.tsx (at 2cf707a3) @ 2cf707a3;
     - it clears at the next selection transition: line 414-416 of frontends/shell/src/App.selection.test.tsx (at 2cf707a3) @ 2cf707a3;
     - the strip's class: line 258 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3;
     - U-FIT's sizes stay right because the chrome is still 216. At 1280 × 800 with Activity open: 800 − 216 − (200 + 6) = 378, and 1280 − 260 − 340 − 12 = 668. At 1366 × 768: 768 − 216 − 206 = 346, and 1366 − 600 − 12 = 754. The test is line 127-134 of frontends/shell/src/layout/layoutState.test.ts (at 2cf707a3) @ 2cf707a3, and the fit is line 138-149 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3.

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
   - Check: the value is line 36 of frontends/shell/src/layout/layoutConstants.ts (at 2cf707a3) @ 2cf707a3. The rest are declarations.

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
     - the scroll: line 164 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3;
     - App.tsx: §2.10 below;
     - no state: §2.4 (c);
     - Activity's clamp: line 138-141 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3;
     - the one line at 24 px: run 5 (frontends/shell's §0.4 arithmetic over line 17 of state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md (at 2cf707a3) @ 2cf707a3);
     - 712 = 800 − 40 − 0 − 48. The top bar is line 34 of frontends/shell/src/layout/layoutConstants.ts (at 2cf707a3) @ 2cf707a3. The strip is hidden when empty (line 258 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3 with line 53-55 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3). Activity is closed by default (line 51 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3), so its rows are 0 (line 196-197 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3, line 141 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3).

   **§2.5 layout/regionParts.tsx.** Falls away: with no cut there is no span and no `title`. The file is not edited. Check: §2.1 (b) keeps the wrap.

   **§2.7, restated: no existing test changes.**
   - layoutState.test.ts is not edited. The defaults' predicted map size does not change: `[668, 378]` and `[754, 346]` stand (§4's check).
   - layout.mjs is not edited.
     - E-FOCUS's walk has no `status` stop, and (d) adds none: line 217 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3.
     - E-FLOOR's comment names caps of 128 and 48, which stay true, and its assertion is predicted to pass: line 268-274 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3.
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
   - Check: Z1 is E-STATUS-HEIGHT's felt twin; Z2 is §2.1 (b); Z4 is line 164 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3.

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
   - Check: the SB harness's file is line 1-18 of frontends/shell/src/layout/StudioLayout.test.tsx (at 2cf707a3) @ 2cf707a3. The step list is line 7-8 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3.

   **§2.11.** The Not-claimed bullet becomes: whether the bar is a keyboard focus stop when its items need more than two lines and it scrolls. Chromium may make a scrolling element that has no focusable child focusable. This piece does not test it, and in E-FOCUS's run the bar does not scroll (Amendment 2, RS5). The rest of §2.11 is unchanged.

   **§3, restated**
   - **Fixture:** unchanged.
   - **Predicted:**
     - every existing suite passes at the head, with no test edited;
     - SB1, SB2 and E-STATUS-HEIGHT pass;
     - under E-STATUS-HEIGHT's mutation, the reading taken while the notice stands is shorter than A's. Run 5 gives 715.453125 against 736 at 1280 × 800: recorded, not asserted;
     - E-FOCUS's walk is unchanged;
     - H3's diagnostic run passes;
     - wherever the bar held one line, every e2e suite now runs on a map 24 px shorter than at its last green run (§1). They are predicted to pass because they read the live box (line 572-579 of frontends/shell/e2e/lib.mjs (at 2cf707a3) @ 2cf707a3; line 75-91 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3; line 130-131 of frontends/shell/e2e/pan-anchor.mjs (at 2cf707a3) @ 2cf707a3). A failure is I7.

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
     - I4 becomes: the render harness (jsdom, line 10 of frontends/shell/vitest.config.ts (at 2cf707a3) @ 2cf707a3) cannot read a CSS custom property that StudioLayout sets on `.app`, so SB1 and SB2 cannot be built as written.
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
   - line 770 of frontends/shell/e2e/README.md (at 2cf707a3) @ 2cf707a3, the selection entry's Asserted list:
     - (i) E-STATUS-HEIGHT joins the list before E-DBLCLICK;
     - (ii) E-DBLCLICK's parenthetical gives run 5's reason for running it last and names this piece as the move. That clause becomes history when this piece merges: the notice still takes a second line, but the map no longer moves. E-DBLCLICK stays last (§8 item 15).
   - Unchanged under (d):
     - line 754 of frontends/shell/e2e/README.md (at 2cf707a3) @ 2cf707a3 (E-FOCUS's sentence; E-FOCUS is unchanged);
     - line 768 of frontends/shell/e2e/README.md (at 2cf707a3) @ 2cf707a3;
     - line 774 of frontends/shell/e2e/README.md (at 2cf707a3) @ 2cf707a3.
   - The node lands after both this piece and the Current view fix (§11, OPEN-2 (b)). The window between the merges is accepted (item 1, OPEN-2).

5. **Generation:** the node's generation goes up by one.
   **Superseded index:**
   - §11's OPEN-1 to OPEN-3 → item 1;
   - §2.1 to §2.4, §2.6, §4's rows and §7 → item 2;
   - §0.6, §1, §2.5, §2.7 to §2.11, §3, §5, §6, §8 and §9 → item 3;
   - §0.2's disclosure-pattern bullet, and §0.5's presence, recorder and render-harness bullets → fall away with OPEN-1 (a);
   - §2.7's README bullet → item 4.

Nothing above is edited.
````

````markdown
### Amendment 2 — the re-sweep at the code base, main 2cf707a3 (class 3; no class 1)

*Drafted by the architect at main 2cf707a37be51100865999a5bd2991a8d9d1762f, before any code. PR #217 merged at 71fd2c4f (branch head 3d9e42e1), and #215 and #216 have merged since the form was drafted. The custodian adds each pin's sha256 by script. Where a row says the lines are the same, the proof is that the hash at 2cf707a3 equals the form's hash; if it differs, the row is a changed re-pin and is reported.*

1. **RS1 to RS9 at 2cf707a3.**

| Item | Answer |
|---|---|
| RS1 | Yes. `selectionEnded` is the last of `STATUS_ITEMS` (line 48-55 of frontends/shell/src/layout/contributions.ts (at 2cf707a3) @ 2cf707a3) and the one optional slot (line 79-83 of frontends/shell/src/layout/contributions.ts (at 2cf707a3) @ 2cf707a3). App renders one `div.selection-ended` with `role="status"` and the text `noticeText(notice)` (line 2266-2270 of frontends/shell/src/App.tsx (at 2cf707a3) @ 2cf707a3; line 68-76 of frontends/shell/src/feature/FeatureTab.tsx (at 2cf707a3) @ 2cf707a3). It clears at the next selection transition (line 414-416 of frontends/shell/src/App.selection.test.tsx (at 2cf707a3) @ 2cf707a3, inside RB4). Not I1. |
| RS2 | The props are line 112-125 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3, as §0.5 says. The footer is line 335-339 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3. `STATUS_ITEMS` and `Slots` are as in RS1. `STATUS_BAR_MAX_HEIGHT_PX` is declared at line 36 of frontends/shell/src/layout/layoutConstants.ts (at 2cf707a3) @ 2cf707a3 and read at line 27 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3, line 200 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3, line 13 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3 and line 138 of frontends/shell/src/layout/layoutState.ts (at 2cf707a3) @ 2cf707a3. `--status-max-h` is set at StudioLayout.tsx:200 and read at line 163 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3. No test or e2e file reads either. |
| RS3 | Five items. **Residency:** `.residency-status`, role status (line 2195-2199 of frontends/shell/src/App.tsx (at 2cf707a3) @ 2cf707a3); its longest text is an over-budget sentence with a suffix (line 464-474 of frontends/shell/src/residency/residencyStatus.ts (at 2cf707a3) @ 2cf707a3). **Scan mirror:** `.status-scan-liveness`, no role (line 208-213 of frontends/shell/src/layout/regionParts.tsx (at 2cf707a3) @ 2cf707a3). **Scan incomplete:** `.scan-incomplete`, role status (line 2209-2213 of frontends/shell/src/App.tsx (at 2cf707a3) @ 2cf707a3). **Watcher:** `.status-source-watch`, role status; its longest text is the degraded form (line 27-35 of frontends/shell/src/layout/statusItems.ts (at 2cf707a3) @ 2cf707a3). **Ended selection:** as in RS1. Every read of a status item is its textContent or its presence (for example line 155 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3, line 438 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3, line 846-849 of frontends/shell/e2e/residency-harness.mjs (at 2cf707a3) @ 2cf707a3, line 257 of frontends/shell/src/App.selection.test.tsx (at 2cf707a3) @ 2cf707a3, line 606 of frontends/shell/src/App.lateResult.test.tsx (at 2cf707a3) @ 2cf707a3). There are two other reads, neither an item read. A page-wide `innerText` filtered to export lines (line 104-111 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3) sees the same text, since nothing is cut. E-FLOOR reads the bar's height (line 303-307 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3); its assertion is the map minimum, predicted to pass. No I7. |
| RS4 | The order is line 761-787 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3, with E-DBLCLICK last at line 787 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3. `readTab`'s `statusItem` is the textContent of `.selection-ended` (line 155 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3). `openFixture(page, consoleHandle, path, label)` is line 199-203 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3. `buildScene(page, consoleHandle, label, { want, min })` is line 270-280 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3 and returns `{ hits, rect, notch }`. `useTool(page, name)` and `useMode(page, label)` are line 163-164 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3. `canvasRect` is line 572-579 of frontends/shell/e2e/lib.mjs (at 2cf707a3) @ 2cf707a3: the `.working-canvas` box, or null. Amendment 1's E-STATUS-HEIGHT is written in these shapes. |
| RS5 | E-FOCUS's expected walk has no `status` stop (line 217 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3); a focus inside the footer is named `status` at line 207 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3. In an ordinary run the bar holds the watcher item: the suite admits filter-zoned (line 106-115 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3), and the item renders for an admitted dataset with no ended session (line 2217-2219 of frontends/shell/src/App.tsx (at 2cf707a3) @ 2cf707a3; line 27-28 of frontends/shell/src/layout/statusItems.ts (at 2cf707a3) @ 2cf707a3). No item holds a focusable element, and the bar does not scroll in that state, so E-FOCUS is unchanged. E-FLOOR's probe is line 285-299 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3, and its assertion is line 309-310 of frontends/shell/e2e/layout.mjs (at 2cf707a3) @ 2cf707a3: 480 × 320 at 1024 × 640, unaffected by a fixed 48. |
| RS6 | Not merged: `e2e/export-view.mjs` is absent at 2cf707a3, and the fix enters slot 1 now. Under OPEN-2 (b) this piece does not edit e2e/README.md, so the answer changes nothing. |
| RS7 | The class-C layout rows are line 275-323 of frontends/shell/src/console/surfaceRegistry.ts (at 2cf707a3) @ 2cf707a3. Under (d) the piece adds no `recordNamed` call and no row (Amendment 1, §2.4 (c) and §2.6), so it needs no tie. |
| RS8 | In use: A to N, P (twice), Q, R, S, T, U, V, X and W (line 1808 of frontends/shell/MANUAL-WALKTHROUGH.md (at 2cf707a3) @ 2cf707a3 is W, the last). Y belongs to the Current view fix (line 58 of state/consults/2026-10-14-export-current-view-resweep-architect.md (at 2cf707a3) @ 2cf707a3). Z is unused, so this Part is Z. |
| RS9 | Item 40 is KNOWN-LIMITATIONS.md:382-384 @ 2cf707a3. Its status-bar sentence is KNOWN-LIMITATIONS.md:383 @ 2cf707a3, moved 6 lines by item 42 at KNOWN-LIMITATIONS.md:191 @ 2cf707a3. Its words are unapproved (the comment at :384), and the human ruled OPEN-3 (b): they stand as written and are seen at the sitting (Amendment 1, item 1). Not edited. |

2. **Class 3 rows.**

   **The `@ d59f1a6a` branch pins, now pinned on main.** No row changes text; the d59f1a6a text was compared in the worktree only for App.tsx, selection.mjs:787 and item 40.

| Place in the form | Old pin | New pin | Change |
|---|---|---|---|
| §0.4 the footer | line 335-339 of StudioLayout.tsx | line 335-339 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3 | none |
| §0.4 the list | line 48-55 of contributions.ts | line 48-55 of frontends/shell/src/layout/contributions.ts (at 2cf707a3) @ 2cf707a3 | none |
| §0.4, §0.5 the optional slot and `Slots` | :79-83 @ d59f1a6a; line 79-83 of contributions.ts | line 79-83 of frontends/shell/src/layout/contributions.ts (at 2cf707a3) @ 2cf707a3 | none; the bare `:79-83` gets its path |
| §0.4, §2.8 the render | line 2266-2270 of App.tsx; App.tsx:2266-2270 @ d59f1a6a | line 2266-2270 of frontends/shell/src/App.tsx (at 2cf707a3) @ 2cf707a3 | none; §2.8's short path gets its full path (the bullet falls away, Amendment 1 item 3) |
| §0.4 `noticeText` | line 68-76 of FeatureTab.tsx | line 68-76 of frontends/shell/src/feature/FeatureTab.tsx (at 2cf707a3) @ 2cf707a3 | none |
| §0.4, §2.8 the tab | line 128-132; FeatureTab.tsx:128-132 @ d59f1a6a | line 128-132 of frontends/shell/src/feature/FeatureTab.tsx (at 2cf707a3) @ 2cf707a3 | none; full path, as above |
| §0.4 the style | line 642-652 of styles.css | line 642-652 of frontends/shell/src/styles.css (at 2cf707a3) @ 2cf707a3 | none |
| §0.4 RB4 | line 399-431 of App.selection.test.tsx | line 399-431 of frontends/shell/src/App.selection.test.tsx (at 2cf707a3) @ 2cf707a3 | none |
| §0.4 E-DBLCLICK last | line 787 of selection.mjs | line 787 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3 | none |
| §0.4 scan incomplete | line 2209-2213 of App.tsx | line 2209-2213 of frontends/shell/src/App.tsx (at 2cf707a3) @ 2cf707a3 | none |
| §0.4 item 40 | line 376-378 of KNOWN-LIMITATIONS.md | KNOWN-LIMITATIONS.md:382-384 @ 2cf707a3 | moved +6 (item 42 inserted); text unchanged |
| §2.8 item 40's sentence | line 377 of KNOWN-LIMITATIONS.md | KNOWN-LIMITATIONS.md:383 @ 2cf707a3 | moved +6; the bullet falls away |
| §0.5 the props | line 112-125 of StudioLayout.tsx | line 112-125 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3 | none |
| §0.5 the render harness | line 174; line 453-457 of App.layout.test.tsx | line 174 of frontends/shell/src/App.layout.test.tsx (at 2cf707a3) @ 2cf707a3; line 453-457 of frontends/shell/src/App.layout.test.tsx (at 2cf707a3) @ 2cf707a3 | none (no longer bears under (d)) |
| §0.5 `readTab` | line 140-160 of selection.mjs | line 140-160 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3 | none |
| §0.5 `useTool`, `useMode` | line 163-164 | line 163-164 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3 | none |
| §0.5 `openFixture` | line 199-203 | line 199-203 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3 | none |
| §0.5 `buildScene` | line 265-280 | line 265-280 of frontends/shell/e2e/selection.mjs (at 2cf707a3) @ 2cf707a3 | none |
| §0.5 `canvasRect` | line 572-579 of lib.mjs | line 572-579 of frontends/shell/e2e/lib.mjs (at 2cf707a3) @ 2cf707a3 | none |

   **The `@ 117aac6c` pins whose lines moved or changed.**

| Place in the form | Old pin | New pin | Change |
|---|---|---|---|
| §0.4 the CSS variable | line 180 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 117aac6c | line 200 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3 | moved +20 by phase B; text unchanged if the hashes match |
| §0.4 the footer | line 306-310 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 117aac6c | line 335-339 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3 | moved +29 |
| §0.5 the `recordNamed` call sites | line 83-105 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 117aac6c | line 88-110 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3 | moved +5 |
| §0.5 the focus rule | line 132-144 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 117aac6c | line 140-152 of frontends/shell/src/layout/StudioLayout.tsx (at 2cf707a3) @ 2cf707a3 | moved +8 |
| §0.5 the class-C layout rows | line 275-324 of frontends/shell/src/console/surfaceRegistry.ts (at 2cf707a3) @ 117aac6c | line 275-323 of frontends/shell/src/console/surfaceRegistry.ts (at 2cf707a3) @ 2cf707a3 | the seven rows end at :323, and :324 now opens phase B's `tool.set` row; :300's statement names the Feature tab. The hash comparison names what changed |

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
   - **The fix's paths:** its §2.6 (line 181-197 of frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md (at 2cf707a3) @ 2cf707a3) as its re-sweep reads it, plus the 2026-10-14 ruling's `getViewBox` source comment, which lands in App.tsx or PublishPanel.tsx. They are:
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

Nothing above is edited.
````

No decision is missing, so there is no ADR skeleton.

Files read: C:/dev/spatial-ide/frontends/shell/SHELL-STATUS-BAR-ONE-HEIGHT-PREREGISTRATION.md, C:/dev/spatial-ide/state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md, C:/dev/spatial-ide/frontends/shell/EXPORT-CURRENT-VIEW-AFTER-UNREPORTED-FIT-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-10-14-export-current-view-resweep-architect.md, C:/dev/spatial-ide/frontends/shell/src/styles.css, C:/dev/spatial-ide/frontends/shell/src/layout/{layoutConstants.ts,layoutState.ts,StudioLayout.tsx,StudioLayout.test.tsx,contributions.ts,regionParts.tsx,statusItems.ts,layoutState.test.ts,layoutBoundary.test.ts}, C:/dev/spatial-ide/frontends/shell/src/App.tsx, C:/dev/spatial-ide/frontends/shell/src/App.selection.test.tsx, C:/dev/spatial-ide/frontends/shell/src/feature/FeatureTab.tsx, C:/dev/spatial-ide/frontends/shell/src/console/{surfaceRegistry.ts,surfaceRegistry.test.ts,recorder.test.ts}, C:/dev/spatial-ide/frontends/shell/e2e/{selection.mjs,layout.mjs,lib.mjs,README.md,regression.mjs,residency-harness.mjs}, C:/dev/spatial-ide/frontends/shell/MANUAL-WALKTHROUGH.md, C:/dev/spatial-ide/KNOWN-LIMITATIONS.md, C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-1-PREREGISTRATION.md, C:/dev/spatial-ide/state/consults/2026-10-12-shell-migration-milestone-2-phase-b-e2e-custodian-run-5.md, C:/dev/wt/mm2b-e2e (at d59f1a6a): App.tsx, KNOWN-LIMITATIONS.md, e2e/selection.mjs.
