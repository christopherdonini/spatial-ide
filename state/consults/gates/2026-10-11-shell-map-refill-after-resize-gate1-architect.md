# PR #207 gate 1 — architect
Reviewed: cut/shell-map-refill-after-resize @ cf24f9b41b218e798d365587db57bb82230a0ed4

**Verdict: BLOCK**, on one Correctness finding (C1) and one Evidence finding (E1). There are three Documentation findings (D1 to D3). All three must be fixed in this PR before the merge, with no re-gate for them. After the C1 fix, correction round 1 of 2 opens.

Line cites into code are at the reviewed commit. The form is cited by section, amendment and item.

## Correctness

**C1. After a filter Apply or Clear, a resize compares the camera against the previous generation's box. So the "a shrink asks nothing" guarantee and OPEN-2 (A)'s guard both fail on a path users can reach.**

- **The code.** `lastQueriedRef` is set only in `reportViewport` (frontends/shell/src/canvas/WorkingCanvas.tsx:1018-1024). Nothing resets it except a remount, and the canvas is keyed only on the dataset.
- **What a new generation does.** `resetFitForNewGeneration` (WorkingCanvas.tsx:1526-1529) re-arms the auto-fit. That fit is `fitToExtent(…, false)`: it writes `cameraRef` (WorkingCanvas.tsx:1337) but reports nothing.
- **The code documents a new generation as an open.**
  - Apply and Clear issue an unrestricted first look and re-fit, "exactly like opening a dataset" (frontends/shell/src/App.tsx:279-288).
  - In the candidate arm, the re-issue is "symmetric with" the open (frontends/shell/src/residency/candidateArmSession.ts:222-233).
  - The fit does not report "precisely so it does not race the very stream that is still delivering" (candidateArmSession.ts:65-76).
- **The path:**
  1. Pan, so `lastQueried` is V1.
  2. Apply a filter whose matches lie outside V1 (the E5 case that App.tsx:279-288 describes).
  3. The auto-fit moves the camera to F, with no report.
  4. Open Activity (Ctrl+J), so the map shrinks.
  5. `viewportAfterResize(F, V1, …)` returns `query`, because F's box is not inside V1.
- **Effect:**
  - A shrink issues a query. That contradicts H2, §4's acceptance item "A shrink asks nothing", and item 39's second sentence (KNOWN-LIMITATIONS.md:367).
  - A size change in either direction can start the new generation's tiled plan, or (baseline) supersede its unrestricted first look mid-flight. That is the race OPEN-2 (A) excludes on an open.
  - The PR body repeats the claim without conditions ("A shrink asks nothing."). Its opening sentence also says a growth "is now asked for" with no OPEN-2 exception.
- **Whose gap.** The form's design gap is mine (§2.1 defines `lastQueried` with no generation). Worker report 1 flagged it under "Differences from the form" (its "Auto-fit after a filter" bullet). Neither Amendment 2 nor the PR body disposed of it.
- **Remedy (A), recommended:**
  - `resetFitForNewGeneration` also sets `lastQueriedRef.current = null`. That is one line in WorkingCanvas.tsx, inside §2.8. A new generation is then treated like an open, as App.tsx:279-288 already says it is.
  - All three sentences of item 39 then hold as the human approved them. After Apply, the area last asked for is unrestricted, so sentence 1 still reads true. No word of theirs changes.
  - It needs:
    - Amendment 3, declared before the code;
    - one test with an observed mutation (a source-text test in the RF7 pattern is acceptable, because the canvas cannot mount in jsdom);
    - every pair re-run, per Amendment 2 item 13's last bullet;
    - the §7 count taken again.
- **Remedy (B):** keep the code, and narrow item 39's second sentence and H2's reading for Apply. That changes the human's approved wording (Amendment 1 item 4), so it needs their sight. It also leaves the first-look race in place. Not recommended.
- **Either way,** the PR body's two summary sentences are scoped to what holds: growth after the first reported view, and the shrink claim as C1 resolves.

## Evidence

**E1. The governance suites §9 requires "green first" are not in the record.**
- §9 lists the governance scripts' `node --test`, plus verify-cites, verify-quotes and verify-test-claims, each tool named with its commit (round 15 (c)). None of them appears in the PR body or in reports 1 to 5.
- Worker report 5 (its `npm run verify` section, last bullet) shows `verify-quotes --show-cites` reporting 28 "quote not found" lines in MANUAL-WALKTHROUGH.md. The worker did not investigate them.
- **Fix:**
  - run the four at the fix head, or cite the PR's CI run at that head, with the tool commit;
  - show the 28 lines are the same at base 4fd3259a, or fix them;
  - add the results to the PR body.

## Documentation (must fix before the merge; no re-gate)

- **D1.** The PR body's first paragraph says the report goes "through the one existing reporting function". `reportViewport` is new in this PR (§2.2). Only the debounce existed before.
- **D2.** The PR body's layout row lists `RESIZEQ PASS` under "Steps the same at both arms". The step's content differs:
  - at the base it is recorded with 0 lines;
  - at the head it is asserted, with 72 lines.
  Move RESIZEQ to Differences.
- **D3.** The console paragraph applies the machine rule without saying why the failure counts as timing-sensitive. State the basis:
  - the K7 status read was null at the snapshot;
  - the standalone regression passed K7 at both arms (report 3, Stop);
  - the failing arm was the base, which has none of this piece's code.

## Gate items, checked against the brief

- **§2.1 to §2.4:**
  - `viewportAfterResize` is pure, uses closed containment and reuses `computeAuthoritativeViewportBbox`. Pass.
  - The camera ref is written at the three sites, with the interactive handler's pre-recenter origin (WorkingCanvas.tsx:1983). Pass.
  - The one reporting function is the only call of `onViewportChangedRef.current(`. Pass.
  - `onResize` is passed to the Deck constructor, reads the CSS client size, has no await and no timer, and touches nothing of hover, re-pick or origin (WorkingCanvas.tsx:1941-1950). Pass.
  - The prop doc is corrected. Pass.
  - The App JSX prop is query-free and leaves `hasSettledView` alone. Pass.
  - OPEN-1 (A) passes, through RF8.
  - OPEN-2 (A) passes on an open (RF4; a remount resets the refs). On a filter generation it fails: C1.
- **H1 to H3:**
  - H1 is shown in e2e for a region toggle. A splitter drag and a window resize hold by construction (a canvas-size trigger) and wait on V3 and V4. The PR body says this honestly.
  - H2 holds except for C1.
  - H3 held: 96 cells predicted.
- **§8, items 1 to 16:**
  - Items 1, 2, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15 and 16: clear.
  - Items 3 and 4: clear as the form defines them. The failure on a new generation is C1.
  - Item 13: clear apart from C1's shrink sentence.
  - `e2e/README.md` is edited under §2.7 and §2.8, which take it outside item 11's suite meaning.
- **FILL′ against Amendment 2, items 4 to 8:**
  - One declared notch, no search, and `MAX_FILL_NOTCHES` is gone.
  - Precondition (i): the pattern is byte-equal to `frontends/shell/e2e/regression.mjs:1993`.
  - Precondition (ii): it works as declared, over the union of view-state lines after the mark, at the size before the toggle, keeping only cells wholly inside the parcel area.
  - The parcel area's derivation comment checks against the generator's arithmetic (317 columns, 315 full rows, 99,855).
  - The confirmation runs at the measured size after the toggle.
  - Nothing is tuned to pass.
  - The observed result matches item 6's prediction: zoom −3.239, 2 and 2 cells.
  - The mutation fails on 0 streams at cf24f9b4 (report 5).
  - Note, no action: when the confirmation voids the run, the step is recorded as FAIL with "outcome void" in its message. Item 4 step 5 says neither PASS nor FAIL. This is conservative, because it never gives a false PASS.
- **Amendment 2 item 13:**
  - The diff 64de82e6..cf24f9b4 touches only the three named files (report 5).
  - No suite imports layout.mjs.
  - Layout was re-run at the fix head, and both e2e mutations were observed there.
  - The pairs at 64de82e6 stand, for now. C1's remedy (A) touches WorkingCanvas.tsx, and then every pair re-runs.
- **Item 39** (KNOWN-LIMITATIONS.md:367-368):
  - the item line is byte-equal to the form's §2.5 text;
  - only the comment's draft note changed, per Amendment 1 item 4;
  - the content of sentence 2 is C1.
- **Part V:**
  - V1 is one notch, per Amendment 2 item 11.
  - There are no durations and the log is blank.
  - The README's FILL′ sentence is accurate, per item 12.
- **§4 as amended:** the BURST clause is superseded by item 10. The PR body claims no coalescing from BURST's 0. Pass.
- **Console K7:**
  - The failure was in the shared base arm only.
  - The custodian's solo re-run used an exclusive hold, adopted at check 4 on 2026-10-06, and passed.
  - The head passed REGRESS′.
  - This is consistent with the machine rule (state/directives/2026-10-06-machine-script-adopted.md:20). See D3.
- **The workers' differences:**
  - RF1's mutation is realised through `lastQueried`'s size, and disclosed.
  - The FILL′ mutation also fails RESIZEQ, which is explained.
  - The confirmation's placement is disclosed.
  - The trailer is noted.
  - None blocks except report 1's auto-fit flag, which is C1.
- **PR body against the reports:**
  - the per-suite statuses, §7 figures, verify counts, mutation outcomes and commits match reports 1 to 5;
  - the exceptions are D1, D2, D3 and C1's two sentences.

## Amendment 3 skeleton (for C1, remedy (A))

- **Context:**
  - C1.
  - `lastQueried` has no generation. A filter generation is documented as an open (App.tsx:279-288; candidateArmSession.ts:222-233).
  - Report 1 flagged it.
- **Decision:**
  - `resetFitForNewGeneration` clears `lastQueriedRef`.
  - §2.1's `lastQueried` becomes "the box last passed to `onViewportChanged` in this generation, or null".
  - §8 item 4 reads "before the first reported view of the open or of a filter generation".
  - One test with its mutation observed.
  - Item 39's wording is unchanged.
- **Consequences:**
  - Every pair re-runs (Amendment 2 item 13).
  - The §7 count is taken again.
  - The PR body's claims are rescoped.
  - Export's Current view after Apply stays as it was before this piece (the un-notified fit writes no box). That is out of scope and recorded, not fixed.
