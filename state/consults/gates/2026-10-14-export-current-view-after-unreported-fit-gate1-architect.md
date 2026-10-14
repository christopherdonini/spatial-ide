Reviewed: PR #219 at a792293d2df9948b6be7feda789ee9e334817ddc (base f8bc2951)
Verdict: PASS WITH NOTES
Branch: cut/export-current-view-after-unreported-fit @ a792293d2df9948b6be7feda789ee9e334817ddc

Limits of this review: I had no Bash. I did not recompute span hashes, run git diff, or read CI. The file list is the custodian's 11 files. I read each changed file at the head in C:/dev/wt/cvfix and the same file at the base in C:/dev/spatial-ide. Head a792293d is e3a14042 plus one comment-only commit: the header of e2e/export-view.mjs, from the worktree reflog and COMMIT_EDITMSG.

## Correctness: no blocking finding

- **The export reads the counts' box at the click.** `getViewBox()` is called inside `runPrepare` and `runPrepareWithDestination` (frontends/shell/src/publish/PublishPanel.tsx:397, :445). App passes `viewBox.get` and `viewBox.subscribe` (frontends/shell/src/App.tsx:2271-2272).
  - Availability is `useSyncExternalStore` over a boolean snapshot (PublishPanel.tsx:368). `get` and `subscribe` do not use `this` (frontends/shell/src/feature/FeaturePanel.tsx:29-38), so passing them unbound is sound.
- **ADR-010 rule 1.** The box is emptied at an admission (App.tsx:1062). `showBox` drops a superseded canvas's report (App.tsx:2029-2031). The panel is keyed on the dataset (App.tsx:2267).
- **ADR-010 rule 2, ADR-017 §8 and the wire.** The numbers sent are the same f64s as before. The old path was `toWireBbox` followed by a lossless HexF64 decode; the new path copies the four numbers (PublishPanel.tsx:83-95). `PublishScopeInput`, `JsBbox`, `bbox_crs: None` and the covering-bbox query are unchanged.
- **ADR-006.** Publishing stays class 3 and approval-gated. Nothing is called undoable.
- **The Row scope arm.** The format string, joined, equals the directive's line 14 less its three leading spaces (frontends/shell/src-tauri/src/publish.rs:129-133). PRS asserts the filled sentence (publish.rs:1627-1640).
- **The zero-size words of the `getViewBox` doc comment (PublishPanel.tsx:329-330) hold against RS4.**
  - A resize to 0 reports nothing. `viewportAfterResize` returns `none` for a size of 0 (frontends/shell/src/canvas/viewportBbox.ts:77), and the resize handler's last arm needs both sides above 0 (frontends/shell/src/canvas/WorkingCanvas.tsx:2041).
  - A fit at size 0 computes with 1 px (WorkingCanvas.tsx:1378-1379).
  - Neither prepare guards against these cases.
  - Line 328, the sentence before them, is D-1.
- **The two ordinary-use cases the old note excluded.**
  - Item 39's exception (a resize after a fit asks for nothing) leaves the box current through the resize's `onViewShown` arm (WorkingCanvas.tsx:2041-2047).
  - A refit after an Apply or Clear reports through the fit's unreported arm (WorkingCanvas.tsx:1403-1407).

## Evidence: no blocking finding

- **Render tests.** RCV1 to RCV4, RB18 re-aimed, UPP1 with its render case, and PRS. Each has an observed failure by name at 304ba249 (frontends/shell/src/App.selection.test.tsx:708-792; frontends/shell/src/publish/PublishPanel.test.ts:58-68, :427-431; publish.rs:1624-1625). No `verify-mutation` run is called an observation.
- **Seams.** The stand-ins match the real interfaces: the real `SkpCallError(skpError)` was already in the mock, and `requestViewport` is `(bbox, bboxCrs, nowMs, filter)`.
- **E2E.** E-CV, E-CV-RESIZE and E-CV-OPEN passed at e3a14042. Each mutation failed at the step the form names (state/consults/2026-10-14-export-current-view-after-unreported-fit-e2e-custodian-run-2.md, its sections 2 and 4). The worker's E-CV-RESIZE risk did not occur.
- **Ceilings (§7).** The class 8 overruns are recorded in Amendment 5 item 1 and §7 is unedited. The worker's table gives PublishPanel.tsx 72 against 60, publish.rs 26 against 20 (so group R 26 against 20), group P 109 against 110, and a total of 467 against 690.
- **Deviations.** Amendment 5's class 2 items (a) to (d) are within §2.2(c), §4 and Amendment 3 item 5. Item (d) is not a deviation at all: Amendment 3 item 5 already orders the whole line replaced.

## Quotes marked as the human's: all match

- **Amendment 1 item 2's block** equals state/directives/2026-10-12-item-42-current-view-amendment-7-guardian-readme-guardrails-brief.md:14 less three spaces. The code carries the same sentence (publish.rs:130-131 joined).
- **Amendment 3 item 6's clause** equals the text between the quotation marks at state/directives/2026-10-14-status-bar-two-lines-current-view-zero-size-1b-open-9-blocks-provenance.md:14. The built note equals KNOWN-LIMITATIONS.md:194 at the head.
- **Amendment 4's approval of the §2.4 sentence** matches the directive's item 5 (state/directives/2026-10-14-e15-named-i2-live-row-build-24px-provenance-cv-2-4-item-40-comment.md). Amendment 4 references it and does not quote it. The constant (PublishPanel.tsx:70-71) equals §2.4's sentence.

## Documentation findings: fix in this PR before the merge, no re-gate

None of the words below are the human's, so item 2d applies to D-1, D-3 and D-4.

**D-1. Class: Documentation. frontends/shell/src/publish/PublishPanel.tsx:328.**
- **The defect.** The line says the box is `null` until the map has drawn this file's data. That is the reverse of what §2.4's clause check claims, and §2.4 says the reverse is not claimed. Ordinary use reaches a counterexample: a pan before the first batch arrives reports a box through `onViewportChanged` (App.tsx:2091-2097) with no data drawn.
- **The fix.** Replace line 328 with this one line. Lines 329-330 stay as they are, and the §7 count does not change.
```
  /** The box the map shows, at CALL TIME (`App.tsx`'s `viewBox.get`), never a snapshotted value. `null` after each open until the canvas first reports the view it shows (`onViewShown`, `onViewportChanged` or `onViewportWithinLastQuery`, through `App.tsx`'s `showBox`). No data of this file is drawn while it is `null`: the automatic fit reports at the first batch with geometry. A box does not by itself mean that data is drawn: a pan before that batch reports one.
```
- **Clause check.**
  - At call time, through `viewBox.get`: PublishPanel.tsx:397, :445; App.tsx:2271.
  - `null` after each open: App.tsx:1062.
  - Written only by the three reports through `showBox`: App.tsx:2029-2031, :2051, :2097, :2108. These are the only `viewBox.set` calls apart from :1062.
  - The automatic fit reports at the first batch with geometry: WorkingCanvas.tsx:1531-1540, :1738-1740, and :1403-1407 (`onViewShown`).
  - A pan before that batch reports one: App.tsx:2091-2097. §2.4's clause check states that a pan reports even with no geometry.

**D-2. Class: Documentation (record). The form's next amendment, by reference only (record cap).** It must carry four things:
- (a) **Class 2, not yet recorded.** E-CV's mutation reads the ref but falls back to the view box while the ref is null (frontends/shell/e2e/export-view.mjs:15). §4's row has no fallback. The worker's report gives the reason: without it the mutation fails at ev1-fit, not at EV4.
- (b) **§3's third prediction was not run, and does not hold as written.** At main the first prepare is refused before EV4. Run 2 shows this through the E-CV-OPEN mutation, which restores main's availability: E-CV failed at ev1-fit, refused. The E-CV mutation in (a) stands in for that prediction.
- (c) **H3 is undecided.** EV5 recorded Z differing from F (run 2, its export-view block). H3's condition, that all matches arrive before the fit, was not established.
- (d) **§7's count at a792293d,** by §7's own command. By my reading export-view.mjs is 192 lines, under its 220, and the total stays under 690.

**D-3. Class: Documentation. frontends/shell/e2e/README.md:782 and :784.**
- **The defect at :782.** The text "once a feature is resident again" claims more than the step checks. export-view.mjs:88 polls only for a count above 0, and never observes it fall.
  - Replace that phrase with: `once at least one feature is resident after it`.
  - Clause check: export-view.mjs:86-89.
- **The defect at :784.** The last sentence's "marked as observed or not yet observed" no longer matches the header: all three mutations are now marked as observed.
  - Replace it with: `Each step's recorded mutation is in the file's header, with the commit and the run that observed it.`
  - Clause check: export-view.mjs:14-22.

**D-4. Class: Documentation (operator gate). frontends/shell/MANUAL-WALKTHROUGH.md:1860 and :1873.**
- **The defect.** Y3's expected outcome cannot show the resize property. Y3 compares against Y2's residential boxes, and the Clear's refit to the whole file differs from those with or without the shrink. This is my own §9 X3 text.
- **The fix.** Record it as class 2 against §9 X3 in D-2's amendment. Replace Y3's step with:
```
Clear the filter; the map fits itself to the whole file. Click **Export interactive map…** with Current view chosen, read the four numbers, and abandon. Then drag a splitter to shrink the map, export Current view again, read the numbers, and abandon.
```
  Replace its expected outcome with:
```
The numbers after the shrink differ from those before it. Record both sets.
```
  At :1873, change the result-log label to: `**Y3 (both sets of numbers):**`
- **Clause check.** A shrink reaches a box write in two ways: through `onViewportWithinLastQuery` when an area was last asked for, and through `onViewShown` when none was (WorkingCanvas.tsx:2037-2047; App.tsx:2106-2108, :2051). E-CV-RESIZE observed the difference after a Clear.

**D-5. Class: Documentation. The PR body, which I have not read.** Confirm it carries each of the following, and add whatever is missing:
- §9's suites, each named with the commit it ran at. `npm run verify` ran on the 304ba249 tree, cargo test at 304ba249, the e2e at e3a14042, and the verify-* scripts at e3a14042. The head's CI covers the two comment-only commits since.
- The RB18 re-aim and its title edit.
- The PublishPanel.test.ts title edits.
- The record that §2.4's words are the human's, approved on 2026-10-14 (Amendment 4 item 3).

## Observation, no finding

- export-view.mjs:88 can return as soon as features from before the Apply are still resident. Run 2 still settles the property: the product run passed with F differing from A, and the mutation failed with F equal to A.
- Line 548 of frontends/shell/src/canvas/WorkingCanvas.tsx still says the Export panel reads the within report. That stays true through App's `showBox`, and canvas/ is outside §2.6.

## §8, item by item

1. Pass. All 11 files are in §2.6, with the root KNOWN-LIMITATIONS.md under Amendment 3 item 5.
2. Pass. No dependency or lockfile change.
3. Pass.
   - The ref's declaration is unchanged (App.tsx:896), and so are its writers (App.tsx:2096, :2107, :1072-1074).
   - In the admission closure only the `hasSettledView` set left, as §2.1(d) requires.
   - The recovery's reads are unchanged (App.tsx:1018, :1581, :1741).
4. Pass. `showBox` is unchanged and has no new `onViewShown` call site.
5. Pass. The export reads only `getViewBox()`, and only at the click.
6. Pass. Covered by the reset, the guard and the key, and proved by RCV2.
7. Pass. Nothing changed in the wire, SKP, the kernel, the engine or canvas/. src-tauri changed only in the ViewportBbox arm and PRS.
8. Pass. PublishDialog.tsx is not edited.
9. Pass. The only new strings are §2.4's and OPEN-2's, both ruled. The human placed their P6 sight at Y4 (Amendment 4 item 1).
10. Pass. OPEN-1 to OPEN-3 were ruled before code (Amendments 1 to 3). The §2.4 sentence was approved during the build, as Amendment 1 item 1 allows.
11. Pass. `hasSettledView` is gone from App and PublishControls. `getViewBox`, `subscribeViewBox`, `currentViewAvailable` and `CURRENT_VIEW_DISABLED_REASON` each have a product caller.
12. Pass. No performance claim. The millisecond figures are wait bounds.
13. Pass. See the quotes section above.
14. Pass. Every new test has an observed mutation. The e2e mutations were observed at e3a14042 and none is called a verify-mutation observation.
15. Pass. Item 42 is narrowed, not retired, and item 39 is not edited.
