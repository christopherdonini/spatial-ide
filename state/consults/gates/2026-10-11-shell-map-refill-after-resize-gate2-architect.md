# PR #207 gate 2 — architect
Reviewed: cut/shell-map-refill-after-resize @ 9e657db1f5e2f155ba6704b46db1964a2c3925e3

**Verdict: PASS with Documentation findings.** Gate 1's C1 and E1 are both closed. Nothing fails on Correctness or Evidence. Findings D1 to D6 are must-fix before the merge, with no re-gate. Correction round 1 of 2 closes with this gate, and no round 2 is needed.

How I read it:
- The local ref and origin are both at 9e657db1. I took the tree as clean at that commit, as report 6's "Final state" section says.
- Code cites are at 9e657db1. The form is cited by amendment and item. The PR body is cited by its line numbers.
- I have no shell, so the reviewer has to recompute four things:
  1. the paths the four commits touch;
  2. that `git diff da0fc49e 9e657db1` changes only comment lines in WorkingCanvas.test.ts;
  3. the hash pins in Amendment 3 at 771fc1a3;
  4. the four tool commits.

## Correctness: none

**C1 is closed.** The product lines match Amendment 3 item 3.
- `fitToExtent`'s `else` clears the box. Byte-copied from frontends/shell/src/canvas/WorkingCanvas.tsx:1352:
  `      lastQueriedRef.current = null; // a write that does not report leaves no area "last asked for"`
- `resetFitForNewGeneration` clears it at :1533, beside the two lines that were already there.
- Both doc comments are updated: `lastQueriedRef` at :1018-1019, and the handle at :156-157.
- App.tsx, `viewportAfterResize` and `reportViewport` are unchanged. `notifyViewport` is still `false` at both auto-fit sites (:1485 and :1681) and still `true` for Zoom to layer (:1526).

**The invariant holds: every camera write either reports or clears `lastQueried`.**
- **Camera writes.** `cameraRef.current = ` occurs exactly three times:
  - :1339 `fitToExtent`, which reports at :1350 or clears at :1352;
  - :1988 the interactive handler, which always reports at :2015;
  - :2220 the DEV seam, which always reports at :2224.
- **No other camera change.** deck's `initialViewState` is written only at :1344, :2011 and :2222:
  - :2011 is the recenter, which re-expresses the same authoritative camera;
  - :1344 and :2222 are part of the fit and seam writes above.
- **Resize.** `query` resets the box through `reportViewport`. `within` leaves it unchanged.
- **Other code that touches the shown view.** Neither clears nor sets the box:
  - Apply does not touch `lastViewportBboxRef` (frontends/shell/src/App.tsx:300-342);
  - a remount resets every ref.
- **Result.** So while `lastQueried` is non-null it contains the box the map shows. Paths (a) and (b) both end with a cleared box, and §8 item 4 as amended holds.
- **A conservative edge, recorded only.** A pan made during the Apply's awaited issue (App.tsx:305) is reported and then cleared at :338. The only effect is that a growth asks nothing until the next report.

## Evidence: none

**RF10 against Amendment 3 item 4:**
- **Assertion (i).** frontends/shell/src/canvas/WorkingCanvas.test.ts:855-856 slices from the first `resetFitForNewGeneration() {`, which is the implementation at :1530: the interface at :159 is `(): void;`. The slice ends at the first `},`, at :1534.
- **Assertion (ii).** WorkingCanvas.test.ts:857-858 slices to the first `\n  }\n`, which closes `fitToExtent` at :1354. The `if` block's own braces are indented 4 spaces, so they do not end the slice early. The pattern needs `} else {` followed by the clear.
- **Assertion (iii).** WorkingCanvas.test.ts:859 requires the count of camera writes to be 3. The source has exactly 3, none of them in a comment.
- **Mutations.** Deleting either clear fails (i) or (ii). Duplicating a camera write fails (iii). So RF10 catches a regression of either clear.
- **Observation.** All three mutations were observed at da0fc49e (report 6, "RF10 mutations"), and the test records that commit (WorkingCanvas.test.ts:850). This is not a `verify-mutation` run.
- **Comment elisions.** The test comment's failure messages are elided with "...". The spans kept match report 6's byte-copied messages, and no negation or condition is cut. This is honest elision.
- **Note, no action:**
  - (iii) catches a new site that writes the camera. It does not pin that the two existing reporting sites keep reporting. That rests on RF7 and on every e2e suite that pans.
  - As declared, no e2e step shows path (a) or (b). The PR body says so at line 88.

**Re-runs against item 6:**
- All 14 head-arm logs record head 9e657db1, and each ends `rc=0` with no FAIL.
- The layout log's RESIZEQ, FILL′ and BURST lines are byte-identical to the PR body's lines 80-81. BURST is summarised at line 82.
- **Both e2e mutations ran at 9e657db1.** Each ends `rc=1`, with RESIZEQ failing on 0 lines and FILL′ failing on 0 streams.
- No path under `src-tauri/` and no Rust input changed (report 6).
- `npm run verify` exited 0, with 1194 tests.

**E1 is closed:**
- The governance suites are in the PR body at lines 94-98, with the commits of verify-cites, verify-quotes and verify-test-claims. The node --test line has no commit: see D4.
- **The 28 `--show-cites` findings are on no added line:**
  - they all fall in MANUAL-WALKTHROUGH.md lines 122 to 1433;
  - the walkthrough's whole §7 count is 28, and Part V spans lines 1762-1789, which is 28 lines;
  - so the PR adds nothing and deletes nothing above line 1762, and the 28 lines are the same at the base.

**§7 against item 5:** G1 is 91, G2 is 147, G3 is 195 and the total is 433. No ceiling is exceeded, so there is no class 8. G3 rose by 4 because of the reviewer's D4 comment fix inside Scope. That is not a scope addition, so it is not class 9.

## Earlier Documentation findings
- **Architect D1 to D3:** fixed at PR body lines 3, 56 and 71-77.
- **Reviewer D1 to D3:** fixed at lines 94-99, 56 and 50.
- **Reviewer D4:** fixed at frontends/shell/e2e/layout.mjs:35 and :273.
- **Reviewer D5:** fixed as it was worded. The remaining gap is D1 below.

**Item 39 is unchanged.** KNOWN-LIMITATIONS.md:367 reads the same as form §2.5's item text. The path (b) question is put to the human at PR body line 124; D3 covers what it leaves out.

**The PR body against item 7:**
- The opening (line 2) is in scope.
- The shrink claim (line 2) has no condition, as item 7 allows.
- The Export note (line 89) is accurate: Apply never writes `lastViewportBboxRef`.
- The exception is D2.

## Documentation (must fix before the merge; no re-gate)

- **D1.** Two code comments now say more than the code does:
  - The doc at WorkingCanvas.tsx:531, byte-copied:
    `  /** Fired on every view change -- each pan or zoom tick, an origin recenter, Zoom to layer's fit -- not only a`
    The auto-fit is a view change that does not fire it. Change "every view change" to say that the auto-fit never fires it.
  - :1946, "A size change that uncovers map area asks for it": add "once a view has been reported (`lastQueried` non-null)".
- **D2.** PR body line 33, byte-copied:
  `- **`src/App.tsx`:** one JSX prop. After a shrink, the Export panel's Current view carries the new box (OPEN-1 (A)).`
  - After an Apply, a Clear or an auto-fit, a shrink gives `none`, and Current view keeps the last reported box (item 7, third bullet; the body's own line 89).
  - Scope the sentence to "once a view has been reported". This is Documentation rather than Evidence because the same body states the limit at line 89, and the code comments (App.tsx:1844-1846, WorkingCanvas.tsx:535-537) are already scoped.
- **D3.** PR body line 124 asks only about path (b). Item 8's last bullet also leaves Apply and Clear to the human: sentence 1 holds there only on the reading that the area last asked for was unrestricted, and the untiled first look is capped. Add that half of the question.
- **D4.** PR body line 98: the `node --test` line has no tool commit. Report 6 gives c813c6ab, the last commit across the three folders. Add it, per round 15, item (c).
- **D5.** PR body line 77 says "the shared-run failure is not recorded". The rule, at state/directives/2026-10-06-machine-script-adopted.md:20, says a timing-sensitive failure is not recorded *as a failure*, and the body does describe it. Say "is not recorded as a failure".
- **D6.** Walkthrough Part V, V1 (frontends/shell/MANUAL-WALKTHROUGH.md:1769) does not say to wait for features before the notch.
  - A notch made before the first batch is Amendment 3's path (b): the auto-fit clears the box, and V2's strip then stays empty by design. That could be recorded as a defect.
  - Fix: "once features appear, zoom in one wheel notch". The line was added by this PR, so the edit does not change §7's count of 28.

## Changed files
- C:/dev/wt/refill/frontends/shell/src/canvas/WorkingCanvas.tsx
- C:/dev/wt/refill/frontends/shell/src/canvas/WorkingCanvas.test.ts
- C:/dev/wt/refill/frontends/shell/e2e/layout.mjs
- C:/dev/wt/refill/frontends/shell/MANUAL-WALKTHROUGH.md (D6)
- C:/dev/spatial-ide/frontends/shell/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md (Amendment 3)
- C:/dev/spatial-ide/state/consults/2026-10-11-shell-map-refill-after-resize-worker-report-6.md
