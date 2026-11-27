Reviewed: the stall form's draft text between its marks, rst-form-gate-2.txt in the scratch folder (41370 bytes, sha256 5435e39f2d10a06be727a7baad780872a0bfd9ec102ca5ceb00d1915f1de0959), with the read checkout D:/wt/read-1124c at cdfebef1eecdda586cd7c9aca41941447b453a99, read only (the custodian's filing note, 2026-11-24: the reviewer's form gate of the full form, attempt 2, before the form is committed, node:recentre-stall-three-observations@form-gate-reviewer-2, under ADV-2026-11-24-18 item 2; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T08:03:59Z; its run: Bash 39, Read 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T08:03:59Z to 2026-11-24T08:14:47Z by its transcript; 2 calls named the main checkout (2 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/core there, as the report discloses, which change nothing); handed back once, at 2026-11-24T08:14:47Z. Filed below the rule, 22031 bytes, sha256 e4aec34f69f2d00b6deba64c9969271b49d6f1b0398572edc38b9e8da0ce2b9f, byte for byte, nothing masked, with one final newline added.)

---

Verdict: FAIL — detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99
Reviewed: rst-form-gate-2.txt sha256 5435e39f2d10a06be727a7baad780872a0bfd9ec102ca5ceb00d1915f1de0959, with D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

I checked the six sha256s first, and all six match. In the checkout, origin/main now reads 44c0cb02. `git diff --name-only cdfebef1 origin/main -- frontends/ docs/ kernel/` is empty, so main's line numbers are still the same as cdfebef1's.

## Check 1: how attempt 2 was made

- **The diff file is real.** `git diff --no-index -U1 rst-form-gate-1.txt rst-form-gate-2.txt` gives the same bytes as `rst-form-gate-1-2.diff` (sha256 44a64325…d57d, 21884 bytes; `diff` exit 0).
- **The fences.** Architect: 15 pairs. Reviewer: 17 pairs.
  - Every line of every old text occurs in attempt 1 (count 1).
  - Every line of every applied new text occurs in attempt 2 (count 1).
  - Every multi-line block is contiguous: architect E1 (attempt 1 lines 240–242, attempt 2 lines 246–249), E2 (232–238 → 238–244), E6 (58–60 → 58–61), E7b (259 → 266–267), D1a (101–105 → 103–111), and reviewer D8 (92 → 93–94).
  - Where an old line still counts 1 in attempt 2, it is a prefix or context line that the new text keeps.
- **The 24 hunks map to the 30 applied pairs, and to nothing else.** Some hunks carry two or three pairs: reviewer D2a, D2c and D2d share one hunk, and D5b with D5c, E2a with E2b, architect E1 with E2, and E7a with E7b share others.
- **The overlaps are settled as the log says.**
  - Architect D1a's old line 2 is byte-equal to reviewer D4's old text. D4's new text is absent from attempt 2 (count 0), and D1a's words meet D4.
  - Architect D1b's old text is byte-equal to reviewer E3's old text. E3's new text is applied, and D1b's new text is absent (count 0).

## Check 2: is each attempt-1 finding met?

Reviewer's findings:
- E1: met.
- E2: met. T12 now has the fit type, and T14 has the confirming side of the adjacency.
- E3: met.
- D1, D2 (a to d), D3, D5, D6 and D7: met.
- D4: met by architect D1a. The t1 read now sits inside the gate.
- D8: met in substance, but the sentence was placed under "Not touched", where it reads as its own negation (new D1 below).

Architect's findings:
- E1: met. The new near rule has untested branches (new E2).
- E2: met. Summing two windows lets another render's updates into the count (new E1).
- E3: met. Its minimum count is untested (new E2).
- E4 and E8: met.
- E5: met. Its words "every added line sits behind the flag" contradict §1's new bullet (new E5).
- E6: met. The list's claim to be "what `render()` runs inside the span" is incomplete (new E4).
- E7: met. A gap's line shows the state at its end only (new E3).
- D1: met (D1a applied; D1b's point is carried by reviewer E3's words).
- D2 and D3: met.

## Check 3: the new words against the code and by git

**Cites at cdfebef1, all hold:**
- WorkingCanvas.tsx:
  - 1127–1129 is `activeBatches`, and 1372–1386 runs from `activeBatches()` to `pickResolutionExtentFor`.
  - 1361 and 1388 are `begin` and `end`. 1439, 1441 and 1448 are in `fitToExtent`.
  - 2086 is `new Deck`, 2257–2258 is the cleanup and 2263 is the capturePixels comment.
- watchdog.ts 27–29, 34–36, 51, 58 and 69. `begin("layer-construct")` has one call site. `admitDataset.ts` begins other phases only.
- regression.mjs 579–590, which ends at `btn.click()` at 588.
- package.json:17 (`verify`) and :54 (`build:measure`). product-ci-shell.yml:216 is `run: npm run verify`. No workflow and no `verify` step runs `e2e/stallObserverRead.test.mjs`.
- pan-anchor.mjs:99 is the seam, and 102–109 is the comment on the wait having no bound.
- The 2026-11-16 directive's path exists, and its line 10 holds the quote byte for byte.
- Stall report lines 185 and 241.

**deck 9.3.9, package-relative, read only, evidence and not Authority:**
- `package.json:6` gives the version.
- `dist/lib/deck.js:1016-1031`: `_onRenderFrame` emits `_onMetrics` every 60th frame, after `stats.reset()` and before `layerManager.updateLayers()`.
- `deck.js:369` and `dist/lib/layer-manager.js:129-131`: `setProps` only queues `_nextLayers`.
- `deck.js:1075` and `:1086` hold `updateAttributesTime` and `updateAttributesCount` ('Attributes updated').
- `dist/lib/attribute/attribute-manager.js:102,143,145` time and count the updates.
- The new O2 and O3 rationales stand on these lines.

**§0.3's widened list against the three heads (three-dot against origin/main):**
- No head changes any listed file. None changes `src/diagnostics/`, `decodeBatch.ts`, `tileViewportStreamManager.ts`, `highlightLayers.ts`, `pickResolution.ts`, `residentSet.ts`, `tileResidentSet.ts`, `buildLayers.ts` or `offsetFrame.ts`.
- The WorkingCanvas.tsx hunks at main's numbering are:
  - PR A: 41, 44, 48, 191–193, 563, 1538–1540 and 1660–1662;
  - PR 365: 165, 191–193 and 1660–1662;
  - PR 366: 191–193 and 1660–1662.
- None of these hunks is in `activeBatches()` (1127–1129), `render()`, `fitToExtent`, `onViewStateChange` or the Deck effect (2086–2261). There is no hit now.
- Two things the list leaves out:
  - `render()` also runs `checkPickCeiling` from `limits.ts` (`buildLayers.ts:448`) and `rowGroups` from `matchGroups.ts` (`buildLayers.ts:113`), and `matchGroups.ts` imports `../attributes/values`. PR A's head changes `limits.ts`, but only by adding `CeilingKind` and `ceilingKindOf` (10 insertions); `checkPickCeiling` is untouched (E4).
  - All three heads change `src/residency/candidateArmSession.ts` (66 insertions, 41 deletions), which owns the tile manager on the default candidate arm (`residencyArm.ts:50`). It is not on the list (D2).
- PR A, PR 365 and PR 366 all also hold the unmerged stacked heads of PRs 353, 358 and 359, through e4e6493d. Their hunks are inside the counts above.

**§7's counting rule, run on real refs:**
- PR 366's head with B = 0bcf5434 (four merges in B..HEAD), and again with B = da55b7a6, PR 366's stacked base. Both runs give the same 8 non-merge commits as `git rev-list --no-merges e4116cad ^2095a7ac`.
- `git show --cc` of merge 4c028ef6 is empty, as a clean merge should be.
- PR A's head with B = 2095a7ac gives 14 commits. That equals both the first-parent count and the full non-merge count, and `--cc` of 6bc40126 is empty.
- So the rule counts as stated, and nothing a merge brings in is counted. What a merge's `--cc` lines count as is not defined (D3).

## Check 4: the tests and mutations the new words touch

**Each predicted failure is reachable as worded:**
- **T3/M3.** With the new order (take, delete, then emit only if an entry was taken), M3 makes a line or a throw, and T3 fails either way.
- **T5/M5.** T5 fails. The T1 clause is conditional, and correctly so.
- **T8/M8.** A `[render-trace]` prefix breaks a match on a leading `[stall-obs]`.
- **T12/M12.** In onViewStateChange, `render()` (2197) runs before any new-origin `view-state` line, so M12 picks a later span.
- **T14/M14.** M14 removes both adjacency clauses, so the first gap is no longer near.

**The added readings, none tested and none declared untested (E2):**
- O2's two-window sum;
- O3's first near clause (t1 within `ADJACENT_MS` before the gap) and its "otherwise" reading;
- the baseline's minimum of three;
- the visibility invalidator on a kept gap.

## Findings

None of these sentences is the human's wording; all are the architect's draft words. E1 to E3 and E5 change what the reader, harness or record does or claims, so by the rule of AUTONOMY §31 that excludes a change to what the code does, they are for the custodian to route.

### Evidence (blocking)

**E1, §5.1 O2: the two-window sum takes in another render's attribute updates.**
- Every rebase is followed by `reportViewport` (WorkingCanvas.tsx:2200).
- Batch arrivals and clears call `render()` (1605, 1615), and the candidate arm's tile pushes call it too.
- So a second `layers` line inside the two windows read is the ordinary case. Its new layers' updates raise the summed count, which gives a false confirm of the trigger.
- The control is also on a different basis: one window against a sum of two.
- A kill still stands, because extra updates only raise the sum.
- Clause check:
  - deck resets the counts at each emission (`deck.js:1019-1021`);
  - the first window after t1 may close before the update (`deck.js:1019-1031`);
  - render call sites are at WorkingCanvas.tsx 1605, 1615, 1847 and 1853.
```text
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, while the median single window with no `layers` line in it shows less than one.
```
```text
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, no other `layers` line lies between the R-span's `layers` line and the second window's page time, and, over pairs of consecutive windows with no `layers` line in either, the median summed count is less than one.
- Neither: the summed count is at least `layerCount`, but another `layers` line lies in that interval, so another render's attribute updates may be in the sum. That is recorded with each such line's `layerCount`.
```

**E2, §4: the readings the new words add have no test.**
- §8 item 10 makes every reading the committed reader's.
- §4 is where that reader's logic is proven, and its four new branches have no test and no declaration that they are untested.
- Clause check: each mutation below changes only the branch its test covers.
```text
| T14 | a long gap that begins within 100 ms after the end of a kept gap holding an R-span is read as confirming, and one that begins more than 100 ms after it, with no R-span inside, is listed as unexplained | M14: drop the adjacency clause, so that only an R-span inside a gap explains it | T14, on the first gap |
```
```text
| T14 | a long gap that begins within 100 ms after the end of a kept gap holding an R-span is read as confirming, and one that begins more than 100 ms after it, with no R-span inside, is listed as unexplained | M14: drop the adjacency clause, so that only an R-span inside a gap explains it | T14, on the first gap |
| T15 | O2 sums the first two windows after an R-span's t1: a first window counting 0 and a second counting the R-span's `layerCount`, with no other `layers` line, confirms the trigger | M15: read the first window only | T15 |
| T16 | the same pair with another `layers` line before the second window's page time reads neither, with that line's `layerCount` recorded | M16: drop the test for another `layers` line | T16 |
| T17 | O3 at two gaps: an R-span whose t1 lies no more than 100 ms before a long gap's start, with `totalPositions` of 1,800,000, confirms; a gap near only an R-span of 1,799,999 reads neither, with that `totalPositions` recorded | M17: read the "otherwise" case as a kill | T17, on the second gap |
| T18 | with two baseline spans O1 is not read at that R-span and that is recorded; with three it is read | M18: lower the minimum to two | T18, on the two-span case |
| T19 | a kept gap whose line says `visible`, with a `visibilitychange` line inside it, is VOID for O3 | M19: read the gap's own `visibilityState` only | T19 |
```

**E3, §2.3 and §5.3: a gap's line carries the visibility state at its end only.**
- The heartbeat sends a gap "at the tick that ends it, with `document.visibilityState`" (§2.3).
- A page hidden and shown again inside one gap ends that gap `visible`, so the new invalidator misses the case it exists for.
- Clause check: the gap line is sent at its ending tick (§2.3, the diagnostic's precedent at its draft's line 32).
- An event queued during a synchronous block runs after the block, which is why the window extends `ADJACENT_MS` past the gap's end.
```text
  - each kept gap is sent once as a console line at the tick that ends it, with `document.visibilityState`.
```
```text
  - each kept gap is sent once as a console line at the tick that ends it, with `document.visibilityState`;
  - each `visibilitychange` event is sent once as a `[stall-obs]` console line, with the new `document.visibilityState` and the handler's `performance.now()`.
```
```text
- A kept gap whose line carries a `visibilityState` other than `visible`: VOID for that gap's O3 reading.
```
```text
- A kept gap whose line carries a `visibilityState` other than `visible`, or with a `visibilitychange` line whose page time lies inside it or no more than `ADJACENT_MS` after its end: VOID for that gap's O3 reading. A gap's own line shows the state at its end only; the change line shows a page hidden and shown again inside the gap.
```

**E4, §0.3: the list claims to be what `render()` runs inside the span, and it is not all of it.**
- `buildLayers` calls `rowGroups` (`buildLayers.ts:113`) and `checkPickCeiling` (`buildLayers.ts:448`).
- `matchGroups.ts:5` imports `../attributes/values`.
- PR A's head adds two exports to `limits.ts` and changes no line of `checkPickCeiling`. My words name the function, not the file, so PR A's head is no stop.
- Clause check: git diff origin/main...806ad308 -- limits.ts shows only additions after line 128.
```text
  - `buildLayers.ts`, `offsetFrame.ts`, `highlightLayers.ts`, `pickResolution.ts`, `residentSet.ts` or `tileResidentSet.ts`: what `render()` runs inside the span (`WorkingCanvas.tsx`, lines 1127 to 1129 and 1372 to 1386 at cdfebef1);
```
```text
  - `buildLayers.ts`, `offsetFrame.ts`, `highlightLayers.ts`, `pickResolution.ts`, `residentSet.ts`, `tileResidentSet.ts`, `matchGroups.ts` or `src/attributes/values.ts`, or `checkPickCeiling` in `limits.ts`: what `render()` runs inside the span, directly (`WorkingCanvas.tsx`, lines 1127 to 1129 and 1372 to 1386 at cdfebef1) or through `buildLayers.ts` (`rowGroups` at line 113 and `checkPickCeiling` at line 448, at cdfebef1). PR A's head adds `CeilingKind` and `ceilingKindOf` to `limits.ts` and changes no line of `checkPickCeiling`; that is recorded and is not a stop;
```

**E5, §5.2: a suite's default path is declared unchanged, but it is not.**
- §1's new bullet says every instrumented build emits the span and metrics lines with or without the flag.
- The product lines sit behind `isInstrumentedBuild()`, not behind the flag. So "every added line sits behind the flag" is untrue.
- M0 itself carries those lines, so M0 against M1 to M3 shows only the harness's perturbation.
- Clause check:
  - `.env.measure:10` and `isInstrumentedBuild.ts:31-33`: both run builds are instrumented;
  - the suites' listeners filter on `view-state` (`recentre-crossing.mjs:73`, `pan-anchor.mjs:59`) and `[render-trace]` (`lib.mjs:393`), which T8 keeps out of the new lines.
```text
- Each suite's default path with no flag. Recentre-crossing's is shown by M0 (§11). Pan-anchor's is shown only by the code gates' read that every added line sits behind the flag, since no unflagged pan-anchor run is made (OPEN-12). D1 therefore has no perturbation control of its own: its suite result is recorded and not compared.
```
```text
- Each suite's default path with no flag, except that every instrumented build emits the product's span and metrics lines on it (§1); the suites' own listeners do not read them (T8). Recentre-crossing's is shown by M0 (§11), which carries those product lines, so M0 against M1 to M3 shows the harness's perturbation only. Pan-anchor's is shown only by the code gates' read that every added harness line sits behind the flag, since no unflagged pan-anchor run is made (OPEN-12). D1 therefore has no perturbation control of its own: its suite result is recorded and not compared.
```

### Documentation (must fix before the merge)

**D1, §1.** My attempt-1 D8 words sit under "Not touched:", where they read as a thing not touched.
```text
  - every instrumented build (dev and measure) emits the span and metrics lines on every run, with or without `--stall-observe`, so a later timing run on those builds carries their emit cost (the carried `prevEmitMs`);
  - no string the app shows changes;
  - the stalls stay S3.
```
```text
  - no string the app shows changes;
  - the stalls stay S3.
- **Changed in every instrumented build, flag or no flag:** the dev and measure builds emit the span and metrics lines on every run, with or without `--stall-observe`, so a later timing run on those builds carries their emit cost (the carried `prevEmitMs`).
```

**D2, §0.3, "What the runs build". This sentence is outside the changes.** "The diff above names them" is untrue: the check names only the code it lists.
- Clause check:
  - all three heads change `candidateArmSession.ts` (+66/−41) and `App.tsx` against main;
  - `candidateArmSession.ts:30` imports `TileViewportStreamManager`;
  - `residencyArm.ts:50` sets the default arm to "candidate".
```text
The held pieces' changes are part of what is observed. The diff above names them, and §5.3 makes them a stop if they reach the path the observations time.
```
```text
The held pieces' changes are part of what is observed. The diff above checks only the code it lists: all three heads also change `src/residency/candidateArmSession.ts` (66 insertions and 41 deletions against main), which owns the tile manager on the default candidate arm (`src/residency/residencyArm.ts`, line 50 at cdfebef1), and `App.tsx`; S0 records those two diffs beside the check. §5.3 makes a change to the listed code by a head merged in after the runs a stop.
```

**D3, §7, the counting rule.** It does not say which lines of a non-empty `--cc` are counted.
```text
is named in the record and those lines are added.
```
```text
is named in the record, and the lines of that output that carry a `+` or `-` in either of their first two columns, its `---` and `+++` header lines excepted, are added.
```

## Commands run (exit codes)

1. `sha256sum` and `wc -c` of the six scratch files: 0.
2. `cat` of the apply log and of my attempt-1 report: 0. The `cat` of the architect's report: 0. The `cat` of the diff: 0.
3. `git diff --no-index` of the two attempts (default context), piped to `sha256sum`, `wc` and a word-diff `grep`: git exit 1 (the files differ), and the hash differed because of the context width. This was read only, outside the read checkout.
4. `git diff --no-index -U1`, piped to `sha256sum`, `wc` and `diff` against the given diff: identical (`diff` exit 0).
5. `grep -n` of the fences in both reports: 0.
6. The per-line `grep -c -F` loop over all 32 pairs: 0.
7. The block-contiguity check by `sed -n` and `diff`, and the overlap equality tests: 0.
8. `git -C D:/wt/read-1124c` (all exit 0), by purpose:
   - Refs and branch facts:
     - `rev-parse` of HEAD, origin/main and the three heads;
     - `merge-base` and `merge-base --is-ancestor` (stacked heads, and the 366 merges against 2095a7ac);
     - `log --first-parent` of PR 366;
     - `log` since 0bcf5434 on main.
   - The heads against main:
     - `diff --name-only` against origin/main for the three heads, filtered and in full;
     - `diff -U0` hunks of WorkingCanvas.tsx;
     - `diff` of limits.ts, of manual_walkthrough_fixtures.rs and of candidateArmSession.ts (stat and hunks);
     - `diff --name-only cdfebef1 origin/main`.
   - Files at cdfebef1:
     - `ls-tree` of the canvas modules;
     - `show` with `grep` or `sed` of WorkingCanvas.tsx (imports, 1120–1135, 1355–1392, 1427–1450, 1596–1616, 2186–2206, the render call sites, the Deck effect);
     - `show` of watchdog.ts, admitDataset.ts, buildLayers.ts, highlightLayers.ts, residentSet.ts, tileResidentSet.ts, pickResolution.ts, offsetFrame.ts, matchGroups.ts, limits.ts, pick.ts, isInstrumentedBuild.ts, renderTrace.ts, residencyArm.ts and candidateArmSession.ts;
     - `show` of recentre-crossing.mjs, pan-anchor.mjs, regression.mjs, package.json, product-ci-shell.yml, the 2026-11-16 directive line 10 and the stall report lines 185 and 241.
   - Greps at cdfebef1: `git grep` of watchdog callers, of limits importers, of candidateArmSession importers and of the workflows.
   - §7's counting rule: three shapes, using `log --merges`, `log --no-merges --numstat HEAD --not …`, `rev-list` and `show --cc`.
9. `sed` and `grep` of deck 9.3.9 (`package.json`, `dist/lib/deck.js`, `dist/lib/layer-manager.js`, `dist/lib/attribute/attribute-manager.js`) under `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/`: 0.
10. `grep -c -F` uniqueness of every old text in this report against attempt 2: each 1.

## Files read

- Scratch, under `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/`:
  - `rst-form-gate-2.txt`
  - `rst-form-gate-1.txt` (by grep)
  - `rst-form-gate-1-2.diff`
  - `apply-rst-2.log`
  - `report-rst-formgate-arch-1.md`
  - `report-rst-formgate-rev-1.md`
- At cdfebef1:
  - `frontends/shell/src/canvas/` (WorkingCanvas.tsx, buildLayers.ts, highlightLayers.ts, residentSet.ts, tileResidentSet.ts, pickResolution.ts, offsetFrame.ts, matchGroups.ts, limits.ts, pick.ts)
  - `frontends/shell/src/diagnostics/watchdog.ts` and `renderTrace.ts`
  - `frontends/shell/src/isInstrumentedBuild.ts`
  - `frontends/shell/src/residency/residencyArm.ts` and `candidateArmSession.ts`
  - `frontends/shell/src/admission/admitDataset.ts`
  - `frontends/shell/e2e/recentre-crossing.mjs`, `pan-anchor.mjs` and `regression.mjs`
  - `frontends/shell/package.json`
  - `.github/workflows/` (grep) and `product-ci-shell.yml`
  - `state/directives/2026-11-16-the-humans-directive-the-target-is-v0-2-record-keeping-repeated-runs-pieces-the-machine-models-focus-for-a-week.md`, line 10
  - `state/consults/2026-11-11-platform-recentre-stall-read-and-profile.md`, lines 185 and 241
- At the three heads: their diffs against origin/main, as listed above.
- Untracked, read only: `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/` (package.json, dist/lib/deck.js, dist/lib/layer-manager.js, dist/lib/attribute/attribute-manager.js).

Model: Opus 5.5 (claude-opus-5-5).
