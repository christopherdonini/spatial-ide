Reviewed: PR #330 at 6abaa9fb74de1eee303e3de84f6eafab67df56c6, gate, reviewer, attempt 2 (the custodian's filing note, 2026-11-18: the reviewer, model claude-opus-5-5, 15557 bytes, sha256 9d62b54df90a42a7805703863130448cdcebf92d104b2a52eeb7134aa80a3e95; its run 2026-11-18T13:38:26.471Z to 13:57:33.551Z by its transcript, Bash 54, Read 9, SubagentHandback 1, 2 errored; below byte for byte, with this note and one final newline)
Branch: cut/shell-tiled-arm-stream-refusal-s1 @ 6abaa9fb74de1eee303e3de84f6eafab67df56c6
Verdict: PASS WITH NOTES

Runs reused: the worker's runs at 6abaa9fb (third report). They are the six named files (231/231), the whole `npm run verify` in a hold (114 files, 1481 tests, rc 0), `npm run typecheck` rc 0, and M-C1a and M-C1b. Also reused: the worker's P-base at b53d14ff (3 failed, 12 passed, at :483, :499 and :514).
Runs reproduced: M-M1 and M-C1c at H, in shared holds. I also ran three new probes of my own (G330R2-RACE, G330R2-ORPH, G330R2-PAIR) and read CI at H myself. Every mutation and probe was applied by one anchored `node` command (anchor count exactly 1), then reverted with `git checkout --`. After each revert, `git diff --quiet` gave rc 0. The file hashes then equalled H's: candidateArmSession.ts d9d17d6567a31d418f395404a20329a37bdb26f585030952dbb7d013e7556b75 and the refusal test file ffb6aa94170c4142f8a26452f54597ec53d398f081357d18ce6efb8c82b24977.

# Findings

## Correctness (blocks)
None.

## Evidence (blocks)
None.

## Documentation (must fix before the merge)

**D-A. The fix branch's reworded comment at `frontends/shell/src/residency/candidateArmSession.ts:1453-1457 at H` misses a timing case, and one of its clauses overclaims.** This is worker text, not the human's wording: the worker applies the words with no re-gate, and the PR body lists them.
- **The timing case (AUTONOMY §31).** `reissueUnrestricted` never clears `untiledStreamHandle` (:1677-1745 at H). `issueUntiledQuery` sets the new handle only after its two awaits (:1294-1312). So an earlier look whose terminal lands inside the next look's mint window has `wasCurrent` true (:1348). If a plan ran and its tiles ended in that window, the fix now recomputes the status with the untiled stream read as not running. Probe G330R2-RACE at H shows this.
  - The output after the earlier look's `Completed`, with the new ticket still pending, was `"afterOld":{"text":"Showing all 3 features in view","scan":"idle"}`.
  - After the mint resolved it was `"afterMint":{"text":"Showing all 3 features in view","scan":"issuing"}`.
  - The events were `[{"kind":"candidate-within-budget","residentFeatureCount":3,"settled":"complete"},{"kind":"candidate-fill-progress"},{"kind":"candidate-within-budget","residentFeatureCount":3,"settled":"complete"}]`. The new look's first batch clears the claim through ingest's trailing emit (:1210 → :843-847), and its terminal recomputes it.
  - With the fix removed (M-M1 applied), the same probe stays `text: null` throughout. The fix therefore turns silence into an early settled claim inside that window.
  - Getting there needs timing inside one request round trip, so it does not block. It must still be named in the source comment.
- **The overclaim.** "so this is the settling moment" holds only when nothing else is outstanding. `emitResidencyStatus` stays silent if a tile is still tracked or a re-plan is pending (`residencyStatus.ts:339-341 at H`).
- **Replacement** for :1453-1457 at H. This makes the file 44 of 60 lines, product 84 of 120 and the total 964 of 1,130, with no class 8:
```
        // The stream-refusal piece S1 (§2.2 (b); Amendment 2 item 2, C-1): this generation's own first
        // look ended. After a plan, whatever its kind, the existing settled path recomputes the status:
        // when the last tile ended while this look ran, it found the view not settled, so with nothing
        // else outstanding this is the settling moment. Before any plan, only a failure speaks: nothing
        // else would ever settle the bar, so it says what is left.
        // Not covered (AUTONOMY §31), timing inside one request round trip: an earlier look whose
        // terminal arrives after a reissue but before the new look's ticket is minted is read as current;
        // if a plan ran and its tiles ended in that window, the status can read settled until the new
        // look's first batch or its terminal recomputes it.
```
- **Clause check, at H:**
  - "this generation's own first look ended": `wasCurrent` (:1348). The exception is named in the Not-covered lines.
  - "After a plan, whatever its kind, … recomputes the status": `(hasPlanned || terminal.kind !== "Completed")` and then `if (hasPlanned) { emitResidencyStatus();` (:1458-1460).
  - "when the last tile ended while this look ran, it found the view not settled": the tile paths emit only at `manager.trackedTileCount === 0` (:1001, :1058, :1065). `untiledStreamRunning: untiledStreamHandle !== null` (:713) then gives not-settled (`residencyStatus.ts:339-341`).
  - "with nothing else outstanding this is the settling moment": the handle is cleared at :1349, before the emit. Settled needs no tracked tile and no pending change (:339-341).
  - "Before any plan, only a failure speaks": with `hasPlanned` false, the guard needs `terminal.kind !== "Completed"`.
  - "read as current": :1677-1745, :1294-1312, :1348.
  - "the status can read settled": G330R2-RACE `afterOld` and `afterMint`, above.
  - "until the new look's first batch or its terminal recomputes it": :1210 and :843-847, and the probe's event order.
  - "timing inside one request round trip": the window closes at :1312, after one `viewportQuery` and one `dataPlaneAttach`.

**D-B. ADV-2026-11-18-09 item 8's new on-main text: one clause does not hold in every case at H.** This is the advisor's wording under the delegation, not the human's, so it goes back to the advisor (item 8: "A clause that does not hold there comes back to me"). It is not in this diff, and the records step applies it later. Draft in the drafts section, item 2.

## Observation
- **O-1.** The five app-window suites that Amendment 2 item 7 orders at the corrected head have not run yet. The third report says "I opened no PR, ran no e2e". They are owed before the merge and are not a finding of this gate.
- **O-2.** G330R2-ORPH: an earlier look's `Completed` that arrives after the next look's ticket is minted emits nothing (`"atOrphan":{"text":null,"scan":"issuing","events":[]}`), and the view settles at the new look's terminal. A truly superseded terminal stays silent.
- **O-3.** On the hasPlanned arm, `!wasSelfCancelled` and `!relinquishedReEmitted` are redundant by construction. `cancelUntiledStream` clears the handle before `skpCancel` (:1273-1279). Every relinquish sets `hasPlanned = false` (:1821), and the next plan resets `lastEmittedRelinquishedUntiled` (:1539). No mutation can tell them apart on this arm, so they are kept as defensive guards, as the architect's attempt-1 O-1 said.

# Checks
1. **C-1 closed: holds.**
   - The condition at :1458 at H is `if (wasCurrent && !wasSelfCancelled && !relinquishedReEmitted && (hasPlanned || terminal.kind !== "Completed")) {`. Branches 2 and 3 (:1461-1470) are reached only with `hasPlanned` false, so only on a non-`Completed` terminal.
   - G330R-SIB settles to `WITHIN_PARTIAL`, text "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." (SR-A-apply-refused).
   - G330R-PRE settles to `{candidate-within-budget, 3, partial-failure}`, the failure sentence (SR-A-apply-failed).
   - The success case settles to `{candidate-within-budget, 3, complete}`, "Showing all 3 features in view" (SR-A-apply-success).
   - The new tests follow the same steps as my attempt-1 probes (`<S>/g330r-probe-diff.txt`, `<S>/g330r-probe2-diff.txt`). The only difference is one mid-step text check dropped in SIB, so I did not re-run the probes.
   - After a plan, a terminal can still be silent: when a tile is still tracked or a re-plan is pending. That is honest, and the last tile terminal or the plan's trailing emit settles the view.
   - Self-cancelled: no emit (`wasCurrent` is false by construction).
   - Superseded after the next mint: no emit (O-2).
   - Inside the mint window: an early settled reading is possible (D-A, a timing case).
   - After a relinquish's re-emit: no emit, because `hasPlanned` is false and the guard excludes it.
   - Session-ended: returns at :1366-1369.
2. **What the fix adds: holds.**
   - Each new test's first status assertion fails when the emit is missing ("expected undefined to deeply equal { …(3) }"). With the probe inserted, M-M1 fails at refusal :540, :556 and :571, which are :483, :499 and :514 at H. The text assertions follow from the reducer.
   - The scan assertions held before the fix too, so they do not test the fix. They would fail without :1472's `syncScanLiveness()`; that is by reading, not observed.
   - M1 (a) and (e): F's lines 2172-2243 and H's are byte-equal (`diff` rc 0). The last step is equal too (F's 2251-2266 against H's 2257-2272, rc 0). The numstat is 10/4.
   - M1 (b): `toHaveBeenCalledTimes(2)` fails under M-M1 ("expected "vi.fn()" to be called 2 times, but got 1 times", cas :2249). `toHaveBeenLastCalledWith` pins the payload; that is by reading.
   - M-M1 reproduced: 4 failed of 98 (96 plus my two probes without assertions). The failures are the three new tests and M1, as the worker reported.
   - M-C1c reproduced: 1 failed of 98, SR-A-apply-success only.
   - M-C1a and M-C1b were not re-applied. The worker's results agree with the code: M1 settles partial, so M-C1a also failing M1 is expected.
3. **The words: hold.**
   - Script `<S>/g330r2-words.mjs` read both attempt-1 reports at origin/main; their sha256 equals the one at e45cf5e8. Each anchor occurs once in its report, and each replacement occurs in the code at H:
     - D-1 doc: once.
     - D-1 test comment: once.
     - D-3: once.
     - D-4 test comment: once.
     - D-5: twice, the last line of both constants' comments.
     - D-4 doc: equal to the report's words once the one line break is joined.
   - The reworded fix comment is true apart from D-A.
4. **The on-main pair.**
   - The old text stands once in `KNOWN-LIMITATIONS.md` at origin/main cd8c43a9 (now its line 193), and the new text is absent.
   - Clauses of the new text at H:
     - "is logged": `logMintRefused(tileKey, err);` at TVSM :958.
     - "still in view": `(membership === null || membership.has(tileKey))` at :993.
     - "within its render budget": `!this.overBudgetFlag` at :990.
     - "tile queue has room": `this.queue.length < MAX_QUEUED_TILES` at :994.
     - "asked for again once": `!this.requeuedTiles.has(tileKey)` at :992.
     - "names the render budget instead": the over-budget branch at cas :733-763, plus `SETTLED_PARTIAL_SUFFIX` (`residencyStatus.ts:422`), per SR-C and SR-C2.
     - "reported as not loaded, in the words above": holds for a refusal alone, in both orders (SR-A1..A4, APP-SR2, SR-A-apply-refused). It fails when another part of the view has also failed since the last plan. Probe G330R2-PAIR (three tiles, one ending `ProducerFailed`, the refused one last) printed `"text":"Filling has finished for this view, but part of this view failed to load; pan or zoom to retry."`, from `settledState`'s precedence (`residencyStatus.ts:343`) and cas :783-791. Ordinary use can reach this with two faults. Replacement in the drafts.
5. **§7's counts: hold.**
   - numstat 2a8907b8...H: TVSM.ts 10/0, cas.ts 39/1, rs.ts 28/2, refusal 519/0, TVSM.test 78/0, rs.test 18/0, App.streamFailure 251/0, cas.test 10/4. All of them are under `frontends/shell`.
   - Product 80 of 120. Unit 880 of 1,010. Total 960 of 1,130.
   - Every file is under its ceiling, and the cas.test row counts against the unit total (Amendment 3 item 2). This equals the third report's table. No class 8.
6. **Paths changed on main: none shared.**
   - After `git fetch -q origin`, origin/main is cd8c43a9. It changes 113 paths since 2a8907b8, and `comm -12` with the PR's 8 paths is empty.
   - Main's nearby changes are App.tsx (PR B's colour-column reissue, §8's named adjacency), App.lateResult.test.tsx, WorkingCanvas.tsx and KNOWN-LIMITATIONS.md (the pair's old text is intact).
   - The PR's `pull_request` CI runs at H passed: DCO, Exposure scan, Ported notices, and Product CI (44313731555). So did the push runs.
7. **Discharge claims and verbatim quotes: hold.**
   - The added text has no "done" or "discharged" clause, and no words of the human's.
   - The commit messages' claims resolve:
     - "copied by script": check 3.
     - "the strings are unchanged": the diff touches no string literal line.
     - "Its last step is unchanged": check 2.
     - b53d14ff's "No product change": its stat is the test file only.
   - "predicted to fail here" rests on the worker's P-base, which I did not reproduce.

# Holds
- Five shared holds, `-Project SpatialIDE`, one per run: probes (twice; the first run printed no console output and was re-run with `--reporter=verbose --silent=false`), M-M1, M-C1c, and probe 3.
- Each hold line read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, and each release line `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`.
- There was no MACHINE_WAITING or MACHINE_ERROR line, and no exit code 96 to 99. The exit 1 under each mutation was the expected test failure.

End state: `<W>` HEAD 6abaa9fb74de1eee303e3de84f6eafab67df56c6, porcelain 0 bytes. I wrote nothing in the main checkout and left no background process.

# Drafts for the advisor
1. **The D-5 window after the fix (D-A).** The architect's attempt-1 draft says of (a): "Overwrites a newer status: no. It recomputes live state." G330R2-RACE shows that the live state reads the untiled stream as not running during the next look's mint. So "Showing all N" can stand from an earlier look's terminal until the new look's first batch. Before the fix the same order showed no status at all. D-A's words record this in the fix's source comment. If you want it on the "Showing all {N} features in view" constant's comment too, the same two clauses fit there.
2. **ADV-2026-11-18-09 item 8, second sentence.** Replacement for the new text's second sentence:
   > An area whose tile is refused after that retry is reported as not loaded, in the words above, or, when another part of the view also failed to load, by the sentence that says part of the view failed to load; when the view is over its render budget, the status names the render budget instead.

   Clause check, at H:
   - "reported as not loaded, in the words above": `settled-partial` → `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` (`residencyStatus.ts:442-443`, :486), per SR-A1..A4, APP-SR2 and SR-A-apply-refused.
   - "when another part of the view also failed to load, by the sentence that says part of the view failed to load": `hasCoveringFailure ? "settled-partial-failure"` (:343), checked first at cas :783-791, → `SETTLED_PARTIAL_FAILURE_TEXT` (:430). The failure record comes from a tile's non-`Completed` terminal (cas :1053) or from the current first look's failure (:1396-1398). Probe G330R2-PAIR shows it.
   - "names the render budget instead": cas :733-763 and `residencyStatus.ts:422`, per SR-C and SR-C2.
   - No clause needs request-level timing or a dev switch.

Scratch files, all in `<S>`:
- the scripts `g330r2-words.mjs` and `g330r2-apply.mjs`, with their anchor and insert texts;
- the logs `g330r2-probe.log`, `g330r2-mm1.log`, `g330r2-mc1c.log` and `g330r2-probe3.log`;
- the diffs `g330r2-mm1-diff.txt`, `g330r2-mc1c-diff.txt`, `g330r2-probe-diff.txt` and `g330r2-probe3-diff.txt`;
- the path lists `g330r2-main-paths.txt` and `g330r2-pr-paths.txt`;
- `g330r2-kl-om.md` and `g330r2-adv09.md`.

Model: Opus 5.5 (claude-opus-5-5).
