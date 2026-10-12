# PR #217 gate 1 — architect
Reviewed: cut/shell-migration-milestone-2-phase-b @ 575cd4b3330a89c6303c65655128adcfc3aebd6f

**Verdict: block.** There are two Correctness findings (C-1, C-2) and one Evidence finding (E-1). The Documentation findings D-1 to D-9 are must-fix before the merge and need no re-gate.

Scope of the read: the branch's code (it equals 719568f8, and its product code equals 5d45e2d9), the form's Amendments 10 back to 1 and its body, every stage, step-fix, diagnosis, investigation and patch report, and e2e runs 1 and 2. I have no Bash, so no figure here is recomputed. The §7 counts and every hash are the reviewer's to recompute.

## Correctness

**C-1. The mode picker records no class-C row. This breaks docs/01 principle 4 and the form's own §1.**
- `frontends/shell/src/App.tsx:1833-1836 @ 575cd4b3` (`handleSelectMode`) dispatches `mode.set` and records nothing.
- `frontends/shell/src/console/surfaceRegistry.ts @ 575cd4b3` has no `mode` row.
- docs/01 principle 4 and the docs/03 action-console section say every GUI action shows in the console.
- The form's §1 says every new GUI action records a class-C row. §2.6's list of six is the drafting gap. By lower-number-wins, docs/01 and §1 govern.
- The precedent records far smaller toggles, for example `layout.toggleSection` and `console.toggleGroupExpanded`.
- Amendment 10 item 3(f) records this as class 2. A class 2 record does not cure a principle breach.
- Fix:
  - one class-C row `mode.set`, with a statement marked `[P6 placeholder]` in the form of `tool.set`'s (`surfaceRegistry.ts:326-330 @ 575cd4b3`);
  - `recordNamed("gui-action", "mode.set")` in `handleSelectMode`, recorded only when the mode changes, as `handleSelectTool` does at `App.tsx:1827-1831 @ 575cd4b3`;
  - one render assertion with an observed mutation (RB16 can carry it);
  - lines over budget are class 8.
- Re-check: the reviewer checks the fix commit only.

**C-2. §8 items 1 and 24 are tripped at the head: two files outside §2.7's list, code of an open item before its ruling.**
- The files are `frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx @ 575cd4b3` and `frontends/shell/src/layout/StudioLayout.test.tsx @ 575cd4b3`. Both stand before OPEN-13 is ruled (Amendment 10 item 4(a)).
- The custodian's routing to the human is right. The merge waits for the ruling and its application.
- If the files are dropped, no re-gate is needed.
- If kept, see D-1: as landed, they cannot be kept under class 9.

## Evidence

**E-1. The §9 suites, and §3's phase B prediction (H3: every existing suite PASS at phase B's head), are not run at the head's product code.**
- The product code at 575cd4b3 equals 5d45e2d9's.
- Only publish, admission, console and selection ran at that code (run 2).
- Regression and layout last ran at f60329ef, and style at e4940dbe. Stages 6 and 7 changed App.tsx, PublishPanel.tsx and AdmissionPanel.tsx after those runs. Every suite now opens through `confirmOpen`.
- Never run in phase B: filter, filter-panel, refusal-contract-baseline, residency-harness, source-changed.mjs, source-watch-idle.mjs and pan-anchor.mjs.
  - pan-anchor and residency-harness cover the changed `render()`, `onResize` and `pickCandidateAt` paths.
  - source-changed covers the session-ended route that now ends the selection.
- Amendment 10 item 2's sentence about the base suites accurately says what ran. What ran is not what §9 requires.
- Resolution: run the missing suites at any commit with the head's product code and list them in the PR body. The code needs no re-gate; the reviewer checks the run record.

## Documentation (must-fix before the merge)

**D-1. Amendment 10 item 4(a), OPEN-13: the options are incomplete and inaccurate.** Amendment 9 item 3(a) is superseded into it.
- Keeping the files as landed conflicts with class 9's own text in `docs/PREREGISTRATION-TEMPLATE.md`'s Round 25 additions, class 9: the amendment declares the addition before any code of it. Round 25 item 2 makes code landed before its declaring amendment a gate failure by name.
- Amendment 9 item 3(a) says the three commits "drop cleanly". On a pushed merge-commit branch, that means a rewrite. The available route is a commit that deletes the file.
- Dropping the wiring test leaves OPEN-11's first term (exactly two call places) proven by code read only. No e2e step asserts it, so "proven by e2e only" is untrue. The human's required test, the App side of RB18, is unaffected.
- Dropping StudioLayout.test.tsx lets `Slots` make `status.selectionEnded` required (Amendment 10 item 3(c)).
- Replacement words, in an appended correction (not the human's wording):
  > (a) OPEN-13 is widened: `src/layout/StudioLayout.test.tsx` (178 lines, 6 tests, stage 4) joins `src/canvas/WorkingCanvas.wiring.test.tsx` (345 lines, 13 tests); both are outside §2.7's list and landed before any amendment declared them. (A) Drop both by a commit that deletes them: `Slots` can then make `status.selectionEnded` required, and OPEN-11's first term is then proven by code read only, since no e2e step asserts it. (B) Keep one or both by deleting it now, declaring it in a class 9 amendment with its rows and mutations, and re-landing it after that amendment, its mutations observed again at the re-landing commit and its lines an overrun, class 8. (C) Keep them as landed, which needs the human's typed exception to class 9's declare-before-code order; (C) is a red line.
- Clause check:
  - (A): the `Slots` comment at stage 5, note 1; no RB18 canvas assertion in `e2e/selection.mjs`'s step list (the run 2 Reading).
  - (B) and (C): the class 9 text named above.

**D-2. Amendment 10 item 4(b), OPEN-15: the stated consequence goes beyond the evidence, and the options omit their costs.**
- The investigation's harness was headless Chromium with SwiftShader, not WebView2.
  - At device pixel ratio 1 with .5 coordinates, it found both directions: 13 cases where the hover hits and the click misses, and 13 the reverse.
  - At 1.25 it found 0 hover-hit/click-miss cases and 5 click-hit/hover-miss cases.
  - 150% was never run.
- The options omit their costs:
  - (B) leans on the engine truncating MouseEvent coordinates. That is unverified for the macOS and Linux webviews, which are L1 here (§2.9).
  - (C) needs a tap-only radius, because `pickCandidateAt` is shared with the settle re-pick, whose body §5 declares unchanged. It turns the mismatch the other way: the click can name a point the readout does not.
  - (B) and (C) each change §2.2 as ruled by OPEN-1 (A), so each is class 9. The investigation says vitest cannot reproduce the case, and the e2e now rounds to whole pixels, so each option must name its proof.
- Replacement words for the item's first two sentences (not the human's wording):
  > §2.2 picks at the tap's own rounded pixel (OPEN-1 (A)) and the hover at the truncated one. Where the pointer's CSS coordinate is fractional, which a display scaled above 100% can produce, the two can differ by one pixel, so at a point dot's edge a click can miss the feature the hover readout names, or pick one it does not name; a headless Chromium harness, not WebView2, showed both at device pixel ratio 1 with .5 coordinates and only the second at 1.25.
- Also append to (B): "it relies on the engine truncating mouse coordinates, unverified on macOS and Linux." Append to (C): "it needs a tap-only radius, since the settle re-pick's body is declared unchanged (§5), and the click can then name a point the readout does not." Append after the options: "(B) or (C) is a class 9 change to a ruled rule; its declaration names an e2e step at a fractional coordinate as its proof."
- Clause check: the investigation's evidence-run bullets; `WorkingCanvas.tsx:1236-1244 @ 575cd4b3` (the shared `pickCandidateAt`); step-fix 3 (the rounding).

**D-3. Amendment 10 item 2, the point-click sentence (the custodian's record).** It reads as if observed on the product: no harness is named, and it omits that the e2e no longer exercises the case.
- Correction words, at most three sentences:
  > The point click: in a headless Chromium harness (not WebView2) the hover picked at the truncated pointer pixel and the tap at the rounded one, so at a .5 coordinate the tap landed one pixel off and could miss a point dot's edge. The click code does what §2.2 states; the product question is OPEN-15. The e2e hover point is now rounded to whole CSS pixels, so the e2e does not exercise a fractional coordinate.
- Clause check: the investigation's item 1 and evidence run; `clickPick.ts:58-63 @ 575cd4b3`; step-fix 3.
- Fairness: the finding is otherwise fairly stated.

**D-4. The e2e README entry, a draft that is the human's under item 2e.**
- `frontends/shell/e2e/README.md:772 @ 575cd4b3` says EXPORT-TODAY runs and prints. Since a6607738 it is skipped (step-fix 3).
- `README.md:774 @ 575cd4b3` says a real pointer's tap reaches the click "only here". The suite drives CDP input, and the real pointer is W2's.
- `README.md:770 @ 575cd4b3` describes the old E-CLICK-FAST (step-fix 4 changed it).
- Proposed words for the human, line 772:
  > Recorded, not asserted, and skipped since B3: `EXPORT-TODAY`, phase A's observation of a reopen during an export. Its reopen now meets the ask, which `E-ASK` and `E-ASK-STATEMENT` assert; the suite prints a SKIP line, and the body runs only with `SELECTION_EXPORT_TODAY=1`.
- Proposed words for the human, line 774:
  > **What it proves not.** The suite's pointer is CDP input, not a real mouse: that a real mouse's tap reaches the map's click is the walkthrough's `W2` (the form's H7). Its hover points are whole CSS pixels, so it does not exercise a fractional pointer coordinate. `E-ASK`'s check that the old dataset closes only after the export's outcome cannot fail in a run, because the cancel stops the export almost at once; `RB12b` proves it. The millisecond figures in the file bound waiting; they are not measurements. Each step's recorded mutation is in the file's header, and each other one is applied alone and observed in a run.
- Proposed words for the human, the E-CLICK-FAST clause at line 770:
  > `E-CLICK-FAST` (with the hover standing on one feature, a press and release sent at another with no move between selects the other's id; if that send fails the step falls back to a move and says so, and `UB8` is the deterministic proof)
- Clause check: step-fixes 3 and 4; the run 2 Reading.

**D-5. KNOWN-LIMITATIONS drafts, the human's under item 2e.**
- `KNOWN-LIMITATIONS.md:359 @ 575cd4b3` says "in Select it selects", and `:369 @ 575cd4b3` says "inspects or selects". Add / remove, and Remove only, can remove.
  - Proposed words for :359's second clause: "in Navigate it inspects, and in Select it changes the selection by the mode for, the topmost symbol under the pointer there instead of refusing."
  - The same change goes into :369.
  - Clause check: `clickEffect.ts:56-63 @ 575cd4b3`.
- `KNOWN-LIMITATIONS.md:377 @ 575cd4b3`: "Opening a dataset … ends the selection" is untrue for a refused open, or one dropped with Keep exporting.
  - Proposed words for its second sentence: "Opening a dataset, the same file again or another, ends the selection and clears the inspected feature once the new dataset is open; an open that is refused, or dropped with Keep exporting, leaves both as they were."
  - Clause check: `AdmissionPanel.tsx:203 @ 575cd4b3`; the rebind exists only in `handleAdmitted`.

**D-6. Walkthrough W11's sight list is incomplete** (`frontends/shell/MANUAL-WALKTHROUGH.md:1826 @ 575cd4b3`; the step text is the form's, not the human's, so the worker applies it). It omits the console statements, the edited `layout.selectInspectorTab` statement (Amendment 10 item 3(a): §8 item 18 needs it sighted), the scope-change refusal and the status-bar notice.
- Replacement Step cell:
  > The P6 sight of the new strings: the tool switch, the Feature tab and the status bar's ended-selection notice, the Export section's sentence and its refusal when the scope changed, the ask, the two late-cancel statements, and the console statements of `tool.set`, `mode.set`, `selection.change`, `selection.clear`, `selection.zoomTo`, `feature.inspect`, `feature.pin`, `dataset.openDuringExport` and the edited `layout.selectInspectorTab`.
- Clause check: `surfaceRegistry.ts:298-372 @ 575cd4b3`; `PublishPanel.tsx:56-59 @ 575cd4b3`; `App.tsx:2256-2259 @ 575cd4b3`; C-1's row.

**D-7. Two P6 placeholder strings are untrue in ordinary use.** Name both at the W11 sighting. They are not reworded here (P6).
- In `frontends/shell/src/feature/OpenDuringExportAsk.tsx:40-41 @ 575cd4b3`:
  - "is still running" is false once the run ends while the ask stands. Amendment 7 item 3 says ordinary use reaches that.
  - "the new dataset is opened" is false for a refused open.
- In `ToolSwitch.tsx:22 @ 575cd4b3`, "a click inspects the feature" is false while a feature is pinned.

**D-8. Amendment 10 item 4(c) omits the e2e README entry**, which stage 8 marks as a draft.
- Correction words: "(c) Item 2e: KNOWN-LIMITATIONS items 36, 38, 40 and 41, Part W's expected-outcome cells and the sentences around its table, and the e2e README's Selection spec entry are drafts for the human's words (stage 8)."
- Amendment 10's heading says two items for the human, and item 4 holds three. OPEN-14 (Amendment 9 item 3(b)) is still unruled. The correction notes both.

**D-9. Class 2 rows, judged.**
- Amendment 9 item 2:
  - (a), (c), (e) and (h) change nothing a test proves.
  - (b) misses §3's phase B prediction; class 2 is that class. UA4 now proves more, and its mutation is observed.
  - (d): the facts parameter has no reader. App's `viewComplete` (`App.tsx:2246 @ 575cd4b3`) is the scan machine's state, not H5's within-budget fact. Say so in the row.
  - (f) adds proof.
  - (g) widens the drawn set and changes no count, because `countSelection` reads selected members only (`selection.ts:143-157 @ 575cd4b3`).
- Amendment 10 item 3:
  - (a) misses §5's unchanged-string declaration. Class 2 is correct for that; the string needs the P6 sight (D-6).
  - (b) stays within the ruled bare N and S, on matchChord's precedent.
  - (c), (g), (k), (l) and (m) are record-only.
  - (d): as Amendment 9 item 2(d) above.
  - (e) is an App-level proof gap. The form's required proof, UB14, holds.
  - (f) is C-1, not class 2.
  - (h) adds proof.
  - (i): RB8's mutation still discriminates the property.
  - (j) changes a form promise. Amendment 1 B3 says the ask stands until a choice. A second `confirmOpen` drops the first open with no choice, no row and no test (`App.tsx:1133-1145 @ 575cd4b3`). Record it as a promise change, not a build note. S2 adds the test.

## Checks with no finding

- §2's design matches the code as built.
- OPEN-1 to OPEN-12 are honoured as ruled. OPEN-12 (A) is at `App.tsx:1900-1906 @ 575cd4b3`.
- OPEN-11's terms hold:
  - The two call places are `WorkingCanvas.tsx:1403-1408 @ 575cd4b3` (both auto-fit sites reach it) and `WorkingCanvas.tsx:2035-2041 @ 575cd4b3`.
  - The handler writes the box and nothing else: `App.tsx:2032-2034, 2054 @ 575cd4b3`.
  - Under `canvas/`, only §2.7's list and Amendment 2 are touched, apart from OPEN-13's file.
  - Current view and `hasSettledView` are unchanged.
- A10's reach (Amendment 6) is respected.
- B3 against Amendment 7:
  - The report: `PublishPanel.tsx:390-395, 499-509 @ 575cd4b3`. `ended` never rejects.
  - The consumer: acquired and released in one handler, never on unmount (`App.tsx:1115-1130 @ 575cd4b3`).
  - The statement is decided by the run's own outcome (`OpenDuringExportAsk.tsx:30-34 @ 575cd4b3`; RB12d and E-ASK-STATEMENT are observed).
  - The two strings match Amendment 7 item 3.
  - §8 items 34 to 37 hold.
- ADR-006 and ADR-024: the ask says "asked to stop", no word implies undone, and the export scope and approval prompt are unchanged (RB8, E-EXPORT).
- §2.9's portability rules R1 to R6: no OS-conditional code, no path parsed, keys only in `actionRegistry.ts`.
- §8 items 2 to 23 hold, apart from C-1 and C-2.
- Phase A's producer now has its consumer, so the second exemption is discharged (UB4, RB4, E-GEN).
- Every e2e mutation is observed, as run 2 lists. E-ASK (2) is a header extra; the form's E-ASK mutation, (1), is observed.

## Suggestions

- **S1.** Three seams default to a branch only the tests reach: PublishControls `execute = publishExecute` (`PublishPanel.tsx:640 @ 575cd4b3`), `AdmitPathDeps.confirmOpen?` and the canvas handle's `fitToBbox?`. The `execute` default skips the staged-scope check (§8 item 11) for any future caller that omits it. Make each required when the base suites may be edited.
- **S2.** Add RB12f: a second open while the ask stands drops the first, records one row, and asks again.
- **S3.** OPEN-14 (double-click) should be ruled before the sitting. If it is accepted as built, add a W row for it.
- **S4.** EXPORT-TODAY's env-guarded body is kept only to spare §7 its deletions. Delete it in a later lane and count the deletions.
- **S5.** The PR body should name verify-cites, verify-quotes and verify-test-claims at 575cd4b3 (§9).

## Files read

- C:/dev/spatial-ide/frontends/shell/SHELL-MIGRATION-MILESTONE-2-PREREGISTRATION.md (body, Amendments 1 to 10)
- The 2026-10-12 phase B records in C:/dev/spatial-ide/state/consults/:
  - worker reports, stages 1 to 8;
  - step fixes 1 to 4;
  - the e2e diagnosis;
  - the point-click investigation;
  - the mutation-patches report;
  - e2e custodian runs 1 and 2.
- C:/dev/spatial-ide/state/directives/2026-10-11-open-11-a-piece-f-opens-ported-notices-required.md
- C:/dev/spatial-ide/state/directives/2026-10-11-harness-approval-open-9-i-withdrawn-a10-late-cancel-adr-029.md
- C:/dev/spatial-ide/docs/01_Principles.md
- C:/dev/spatial-ide/docs/03_UX.md (action console)
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md (Round 25 additions)
- C:/dev/spatial-ide/AUTONOMY.md (§22, §25)
- In the worktree C:/dev/wt/mm2b:
  - frontends/shell/src/App.tsx
  - frontends/shell/src/canvas/WorkingCanvas.tsx and clickPick.ts
  - frontends/shell/src/feature/OpenDuringExportAsk.tsx, clickEffect.ts, FeaturePanel.tsx, FeatureTab.tsx and ToolSwitch.tsx
  - frontends/shell/src/workspace/selection.ts, workspaceState.ts and viewTransitions.ts
  - frontends/shell/src/publish/PublishPanel.tsx, PublishDialog.tsx (settleExecuteOutcome) and client.ts
  - frontends/shell/src/admission/AdmissionPanel.tsx
  - frontends/shell/src/console/surfaceRegistry.ts and surfaceCompleteness.test.ts
  - KNOWN-LIMITATIONS.md
  - frontends/shell/MANUAL-WALKTHROUGH.md (Part W)
  - frontends/shell/e2e/README.md (Selection spec)
