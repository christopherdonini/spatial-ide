*Custodian's filing note (2026-10-11): the architect's draft of shell-migration-milestone-2's Amendment 2, from the phase 0 re-sweep, the run 16:22:18Z to 16:33:58Z by its transcript, read-only (Read 29, Grep 14, Glob 1). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 6f280575aa659251dd6b03dceeabf52be1c9dc4f82de7746fd548e7a2ffbe7a4. The amendment is appended to frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md: the draft's text between its separators, with its 9 cites read at 7cde3385 pinned by script and nothing else changed. Its OPEN-11 is a red line, for the human's typed words.*

---

Draft Amendment 2 is below, ready to append. It was read at main 7cde3385, together with the re-sweep at 6de584fa. Hashes are written only where I copied them from the re-sweep. Every cite written "at 7cde3385" still needs your pin by script.

Two decisions, so you can check them before appending:
- **Classes.** I tagged the re-sweep absorption class 1, following map-refill's Amendment 2: an invalidator's report was absorbed before any code, after results were seen. The re-pins are class 3.
- **The view box after the auto-fit.** Inside A10's canvas boundary I could not find an honest way to show the outside-the-view / in-view-not-drawn split after the auto-fit. So it goes to the human as OPEN-11, a red line, because it extends OPEN-8's ruling.

---

### Amendment 2 — the phase 0 re-sweep absorbed before any code: the moved and re-pinned spans (class 3); the view box, the two existing tests, the cursor, HoverReadoutView's exports, the order, H5, A13 and B5 (class 1, written after the re-sweep's results were seen)

*Drafted by the architect at main 7cde3385, before any code of this piece and after the phase 0 re-sweep's results were seen. The re-sweep is state/consults/2026-10-11-shell-migration-milestone-2-phase0-re-sweep.md, read at 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 (B below) and cited by section. Its sha256 from its line 5 to the end is 16a0e4e48c28a78c7cc28a4adb48d135594e2ce6d422b73a668867f4802153d0, as its filing note gives. Every pin is historical (§0.3), and the tree at each phase's base is authoritative for the work. References only; nothing below is a quotation.*

1. **The eight moved pins (class 3).** Each row of the re-sweep's §1 Moved table is carried at its At-B span, at B, with the hash the table gives, which is the form's own. The text is unchanged, so no claim changes. The table is not restated here.

2. **Changed pin 1, the view box (class 1).** At B the props are frontends/shell/src/canvas/WorkingCanvas.tsx:503-548 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:a29cab4355c7272e30604052428ac43ac1ab38cd56000e47f209577f7b1d1557. App's two handlers are frontends/shell/src/App.tsx:1829-1849 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:d4e2ee97804af04deb7c3d1e5ef3e141e660f30c276a71d412286f8efbc12f09 (re-sweep §2, pin 1). I4 is read as covering an interface the plan draws against. §2.3 now draws against both callbacks, as written here before any code, so I4 does not stop the piece.
   - (a) **Sources.** The box §2.3 counts against is fed by `onViewportChanged` and `onViewportWithinLastQuery`, one statement in each of App's two existing handlers, and by nothing else under A10.
     - App holds it beside `lastViewportBboxRef`, never in the workspace reducer, because navigation is not a transition (§2.4).
     - `lastViewportBboxRef` and the Export panel's Current view are unchanged.
   - (b) **Recompute: per reported box, with no debounce.**
     - App keeps the box in a ref with a listener set, so no tick renders App.
     - The Feature tab's summary subscribes and recomputes with §2.3's pure count function, bounded by SELECTION_MAX_FEATURES. It re-renders only when a count changes.
     - No figure is claimed (§1). §2.3's recompute at the box's settle reads: on every reported box.
   - (c) **Freshness.** The split (outside the view; in the view, not drawn) and any reason are shown only from a current box: one reported after the canvas's last camera write and last change of size.
     - Without a current box, the summary shows Selected only (A9), with no split and no reason.
     - §2.2's drawn status of the inspected feature follows the same rule.
     - §8 gains item 33: an outside-the-view or in-view-not-drawn count shown from a box that is not current.
   - (d) **What A10 leaves open.**
     - The auto-fit writes the camera without a report (frontends/shell/src/canvas/WorkingCanvas.tsx:1487 and :1683 at 7cde3385). It runs on the first geometry after an open, and after each reset that App makes around an Apply or Clear.
     - After it, a change of size reports nothing until the next pan or zoom (KNOWN-LIMITATIONS.md item 39).
     - App sees neither. Under A10 it cannot tell a current box from the box before the auto-fit, and that is the moment RB3, E-SEL-FILTER and W4 read the split.
     - That window is OPEN-11. No code of §2.3's split lands before its ruling (I9).
     - The rest of §2.3 and all of phase A do not wait. E-SEL-PAN and UB5 read the Selected count and the members, which need no box, and stand.
   - (e) **Rows.**
     - UB3 also asserts that a null box gives no split and no reason. Second mutation, UB3-b: read a null box as containing every member; it fails on the null case.
     - New RB17 (render, App.selection.test.tsx). One member is selected. Before any report, no split is shown. After the stand-in's `onViewportChanged` reports a box meeting the member's bounds, it counts as in the view. After its `onViewportWithinLastQuery` reports a box that does not meet them, it counts as outside the view, with no timer advanced.
     - RB17 mutation (i): feed the box from `onViewportChanged` only; it fails at the shrink step.
     - RB17 mutation (ii): read a null box as containing every member; it fails at the first step.

3. **Changed pin 2, the fit (class 3; the re-sweep's class (a)).**
   - Re-pinned at frontends/shell/src/canvas/WorkingCanvas.tsx:1326-1356 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:13152c661775673fd416b83faf54e0aa2da184c16c7126b1717cb0a1515755d9. Its signature and step order are unchanged (re-sweep §2, pin 2).
   - `fitToBbox` calls `fitToExtent(bbox, true)`, so it notifies, as `fitToBounds` does at frontends/shell/src/canvas/WorkingCanvas.tsx:1528 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:8cc3bc160e9c7bc4d514869a0b245bb33a01f68e7a19a730489ce98ba2ffbe8d.
   - §8 item 6 stands. The reviewer checks the call at the head.

4. **Changed pin 3, the harness (class 3; the re-sweep's class (a)).**
   - Re-pinned at frontends/shell/src/App.layout.test.tsx:130-171 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:884308b174615e14f33d8c9de6d8eb7363f632af2e6ef523f1d22fc6a34bc648. Its stand-in keeps the props App passed (re-sweep §2, pin 3).
   - Correction: §0.5's description of the harness as stubbing only the WebGL boundary was already loose at dba12b8c. The corrected reference is the file's own header, frontends/shell/src/App.layout.test.tsx:11-13 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:5636fe6d740653edf2a011d83e0c287645ed28b19134dd28b53398ed3f276f07, with its partial publish-client mock at frontends/shell/src/App.layout.test.tsx:121-128 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:e2908d269d87299a36641e1034a3c22d2e3fae5a165e8405f4f4344925055291. The proof is the re-sweep's §2, pin 3 count of mocked modules.
   - The copies in App.workspace.test.tsx and App.selection.test.tsx mock `publish/client` themselves for RB7 and RB8, and their stand-in handles add `fitToBbox`. That module is not `workspace/`, `selection.ts` or `scope.ts`, so I6 does not apply.

5. **Two existing tests phase B makes fail (class 1).** Both edits are within the human's rulings, so neither is an OPEN item.
   - **R4's tab arrays** (frontends/shell/src/App.layout.test.tsx:398-405 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:9fddf2a9021fbaee127a6afb08dee4c7826be1ba08b8749e0d9c48c943d8b4dd).
     - The third tab is §2.6's, under plan §13 item 3 and RULED 2026-10-09, eight forms, item 4 (OPEN-9 approves the label Feature).
     - The three arrays gain the Feature tab's entry, and nothing else in the file changes.
     - App.layout.test.tsx joins §2.7's may-edit list for that edit only, and joins §7 as AM2-T, ≤ 8 lines.
   - **U5's exact-id test** (frontends/shell/src/layout/actionRegistry.test.ts:121-128 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:9ab1acb08bee0f9fdcfe4936bfc2d129eb9991f4b91779a5fd67f65aad6ce996).
     - Question round 66, item 2 was asked and ruled as milestone 1's OPEN-2, on the caller rule, and it placed open and export in milestone 3.
     - Milestone 2's four ids each have a product caller (§2.2) and are neither open nor export. Their keys and labels are the human's (RULED 2026-10-09, eight forms, item 4, OPEN-2's keys and OPEN-9).
     - The test asserts exactly the eight ids, and its title cites both rulings. It counts in B-T as UB10's file, which §2.7 already lists.
   - §3's phase B prediction and §2.8's existing-suites line read: with only G-E's changes and these two edits.
   - frontends/shell/src/layout/layoutState.test.ts:25 at 7cde3385 is not edited. It is predicted to pass unedited, and it does not sample the Feature tab.

6. **The cursor (class 1).** `getCursor` passes only the drag state (frontends/shell/src/canvas/WorkingCanvas.tsx:1946 at 7cde3385), and §2.2 and §7 give the canvas no tool (re-sweep §5).
   - **Shape.**
     - WorkingCanvas gains one prop, `tool: "navigate" | "select"`, mirrored in a ref as its other props are.
     - `getCursor` passes the ref's value to `cursorForPointerState`.
     - If deck does not re-run `getCursor` on a tool change without a pointer event, the worker re-sets that prop in an effect on `tool`, and nothing more.
     - App is the product caller.
   - **Reading.** The cursors the human ruled (A4) cannot reach the canvas any other way. This is therefore read as part of §2.7's cursor-function change, not as a third exception under A10.
   - **Lines.** Within B-C's WorkingCanvas.tsx ≤ 200 and pickResolution.ts ≤ 20; an overrun is class 8.
   - The cursor function's doc comment (frontends/shell/src/canvas/pickResolution.ts:449-459 at 7cde3385) is rewritten in that change: one cursor per tool, grabbing while dragging, never pointer, and the Deck now has a click.
   - Row M18(a) (frontends/shell/MANUAL-WALKTHROUGH.md:890 at 7cde3385) is not edited. Its steps run in Navigate, the tool a view starts in (UB12), so its meaning holds, and §8 item 17 stands. Row W2 also asks the human to look at Select's arrow cursor.

7. **HoverReadoutView's exports (class 1).** At 7cde3385, `idLine` is not exported and the two refusals are inline JSX text, the session-ended one over two lines (frontends/shell/src/canvas/HoverReadoutView.tsx:33-35 and :67-82 at 7cde3385).
   - `idLine` gains `export` only.
   - Each refusal constant equals the rendered text: each JSX line trimmed, and the session-ended text's two lines joined by one space, which is JSX's rule for a line break inside text. The component renders the constants in place of the inline text.
   - The reviewer compares each constant byte for byte with the pinned base span read by that rule. HoverReadoutView.test.tsx passes unedited.
   - Within ≤ 12.

8. **Rule 00 and order (class 1).**
   - **Phase A** edits none of the CRS piece's files (re-sweep §7).
   - **Phase B** shares src/admission/AdmissionPanel.tsx and AdmissionPanel.test.ts (B3, UB13) with frontends/shell/SHELL-CRS-FORM-FOR-FORMAT-DEFAULT-CONTRADICTED-PREREGISTRATION.md.
     - Phase B's branch is cut from main after both phase A's merge (A12) and that piece's merge.
     - At that base, B3's two AdmissionPanel pins are re-read. The same text at new lines joins A12's class 3 row; changed text is I13.
     - Rule 00 is re-checked at each phase's dispatch against both slots and every PR awaiting merge.
   - **The walkthrough.**
     - Each Part is appended at the tail when it lands. If Part X lands first, Part W is appended after it, out of letter order, and its letter stays W (A13).
     - No line another record pins moves.
     - The file already orders Parts by landing: Part P (points) is at frontends/shell/MANUAL-WALKTHROUGH.md:1609 at 7cde3385, after Part S.
   - **Piece e** (protocol/skp/SKP-V0-LIVE-SECTIONS-AREA-C-PREREGISTRATION.md) may move §0.4's two SKP-V0.md pins. If it merges before a phase's base, the custodian recomputes them there: the same text at new lines is a class 3 row; changed text is I4. The same rule applies to any other pinned file that changes between B and a phase's base, before that phase's code.

9. **H5 (class 1).**
   - Not established. Re-sweep §6, H5 records the engine's predicate as covering-bbox intersection (engine/src/index.rs:27-30 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:abdf0c9cd33e16e1b434af3b41c58389275a44050a9e539d8085ed9efda8d89d). It does not establish whether the engine checks that a covering bbox contains its geometry, and this amendment does not either.
   - By H5's own clause, the filter reason is never shown in this piece. H5's pointer to §2.5 for that rule means §2.3 (class 3).
   - §2.3's second group carries no reason.
   - UB3's drafted mutation becomes: produce the filter reason when a filter is applied and the view is reported complete; it fails.
   - §2.8's second new KNOWN-LIMITATIONS item states that the count carries no reason in this milestone (P6).
   - Establishing H5 needs an engine read or check, which is outside this piece (§1).

10. **A13 and B5 (class 1).**
    - **W is free at B.** The last Part is V (frontends/shell/MANUAL-WALKTHROUGH.md:1763 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:69af406c7d03ea71df2f3401dea7b28764651b60da36dad87385b8e74af30ed7), and no other record claims W (re-sweep §3). KNOWN-LIMITATIONS' next free numbers are 40 and 41 (A14).
    - **Renumbering.**
      - V0 to V11 become W0 to W11, keeping their numbers.
      - B3's row becomes W8a, placed after W8, and present only if B3 is built.
      - Every V-row named in §2.8, §2.9, §4, §6 and Amendment 1 reads as the W-row of the same number.
    - **B5 does not apply.** frontends/shell/e2e/lib.mjs exports `hoverIdAfterBarrier` (frontends/shell/e2e/lib.mjs:639 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:55d94a32e634e7c244d4e6bf1ea56e86da6fd933b379269d2311787d25de5ed1; body frontends/shell/e2e/lib.mjs:639-658 @ 6de584fad812a5ebc3a34a60edecee3d3d7ba2a1 sha256:37f18427550308a49a1c0c65b09658c9f7c12fb8cf6b45878142227859db1f78).
      - A2's function is `hoverIdAfterBarrier`, and §8 item 32 reads it by that name.
      - AM1-M is unused.
    - A1's suite run at the base was not part of this read-only re-sweep. It stays owed before any phase A code (B9).

**§7 addition.** Counted by §7's command, in phase B's PR.

| Group | Files (ceiling each) | Lines, at most |
|---|---|---|
| AM2-T | App.layout.test.tsx ≤ 8 (R4's three arrays only) | 8 |

- The piece's ceiling is 7,874 + 8 = 7,882.
- Everything else here lands within existing groups. If OPEN-11 is ruled (A), its lines count in B-C and B-A.
- An overrun is class 8, and neither §7 nor B10 is edited to match it.

**§11 addition.**

| Item | Subject | Recommended | Red line |
|---|---|---|---|
| OPEN-11 | The hidden split after a camera write the canvas does not report | (A) | yes |

**Superseded index.**

| Form passage | Superseded by |
|---|---|
| §0.3, which spans are current | items 1, 3, 4 |
| §0.5, the canvas props, the fit and the harness | items 2, 3, 4 |
| §0.6 H5 | item 9 |
| §2.2, the cursor; the refusal text's constant | items 6, 7 |
| §2.3, the view box, its recompute and the filter reason | items 2, 9 |
| §2.7, the may-edit list | items 5, 6 |
| §2.8, the Part's rows, the existing suites, the second new KNOWN-LIMITATIONS item | items 10, 5, 9 |
| §3, phase B's prediction | item 5 |
| §4 UB3, and new RB17 | items 2, 9 |
| §7 | the §7 addition |
| §8, new item 33 | item 2 |
| §11 | OPEN-11 |
| Amendment 1 A2, A12, A13, B3's pins, B5 | items 10, 8, 10, 8, 10 |

Read the last amendment first.

Nothing above is edited.

---

**Open questions for the human**

1. **OPEN-11 (red line, typed words only, as OPEN-8 was).** How should the outside-the-view and in-view-not-drawn split behave after a camera write that the canvas does not report? Those writes are the auto-fit after an open, Apply or Clear, and a later change of size.
   - **(A), recommended.** WorkingCanvas gains one report-only prop, provisionally `onViewShown(bbox)`. It is called at the auto-fit and at a change of size when no area was last asked for.
     - App's handler feeds only the counts' box. There is no query, and `lastViewportBboxRef`, the Export panel's Current view and item 39 are unchanged.
     - Every camera write is then reported, so "current" is exact. RB3, E-SEL-FILTER and W4 stand as drafted, with RB3's stand-in calling the prop after Apply.
     - It is a third exception under canvas/, beyond A10.
   - **(B), within A10.** After each open, Apply or Clear, the split stays absent until a pan, zoom or Zoom to layer made after that generation's auto-fit.
     - App cannot see the auto-fit, so a conservative stand-in for it is declared before code.
     - RB3 and E-SEL-FILTER add a pan before reading. At W4 the human sees Selected only until they move the map.
   - **(C), within A10.** While no box is current, the summary shows a count that needs no box: selected features not drawn at all, with no split and no reason. This is new P6 text, and RB3, E-SEL-FILTER and W4 read that line.
2. **Notice, not a hold.** Item 6 reads the canvas's `tool` prop as part of the cursor change the human ruled (A4), not as a third exception under A10. If the human reads A10's last sentence as excluding it, I9 applies to the cursor change only.
3. **Information, nothing decided here.** The unreported auto-fit also leaves `lastViewportBboxRef`, which is the Export panel's Current view, at the box from before an Apply or Clear until the next pan or zoom (re-sweep §2, pin 1). The human's map-refill OPEN-1 (A) intends Current view to be the area the map shows. This piece does not change it under any option. Whether it becomes its own node is the human's call.

Files read: `C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md`, `C:/dev/spatial-ide/state/consults/2026-10-11-shell-migration-milestone-2-phase0-re-sweep.md`, `C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md`, `C:/dev/spatial-ide/frontends/shell/src/canvas/WorkingCanvas.tsx`, `C:/dev/spatial-ide/frontends/shell/src/App.tsx`, `C:/dev/spatial-ide/frontends/shell/src/canvas/HoverReadoutView.tsx`, `C:/dev/spatial-ide/frontends/shell/src/canvas/pickResolution.ts`, `C:/dev/spatial-ide/frontends/shell/src/canvas/viewportBbox.ts`, `C:/dev/spatial-ide/frontends/shell/src/layout/actionRegistry.test.ts`, `C:/dev/spatial-ide/frontends/shell/src/App.layout.test.tsx`, `C:/dev/spatial-ide/state/questions/round-66.md`, `C:/dev/spatial-ide/state/directives/2026-10-09-rulings-on-the-eight-forms.md`, `C:/dev/spatial-ide/frontends/shell/MANUAL-WALKTHROUGH.md`, `C:/dev/spatial-ide/KNOWN-LIMITATIONS.md`, `C:/dev/spatial-ide/engine/src/index.rs`
