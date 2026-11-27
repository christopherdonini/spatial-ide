Reviewed: the stall form's draft text, rst-form-gate-4.txt in the scratch folder (53669 bytes, sha256 e7b93c631330134348bcb0b6476e20e403a26f9c97fe544057f58c3f08161399), made from attempt 3 by the architect's 18 pairs and one correction, with the read checkout D:/wt/read-1124c at cdfebef1eecdda586cd7c9aca41941447b453a99, read only (the custodian's filing note, 2026-11-24: the reviewer's form gate of the full form, attempt 4, narrow under ADV-2026-11-24-22 item 5, before the form is committed, node:recentre-stall-three-observations@form-gate-reviewer-4, under ADV-2026-11-24-18 item 2; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T09:46:26Z with its brief byte for byte; its run: Bash 33, Read 5, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T09:46:26Z to 2026-11-24T10:00:14Z by its transcript; 9 calls named the main checkout (9 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/ there, read only, which its brief allows, which change nothing); besides the commands its brief lists it ran git ls-tree, git cat-file -t, cat, file, ls, tr, cut and head, all read only, as its report discloses; handed back once, at 2026-11-24T10:00:14Z. Filed below the rule, 23538 bytes, sha256 033acf14fc3dfc827557f2dfd2991d27b4b2c4f959e11709e6791b065da81397, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS WITH NOTES — detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99
Reviewed: rst-form-gate-4.txt sha256 e7b93c631330134348bcb0b6476e20e403a26f9c97fe544057f58c3f08161399, with D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

I found no Correctness or Evidence finding, and three Documentation findings (D1 to D3), each with replacement words. None of the sentences involved is the human's wording: all are the drafting architect's or a gate's, and no red-line text is touched. Under the proportional-gates rule the worker applies D1 to D3 before the commit, with no re-gate, and lists them in the PR body.

## Check 0: how attempt 4 was made

- All eight scratch files match their briefed sha256 and byte counts. The read checkout's HEAD is cdfebef1.
- The supplied diff is the real diff. I ran `git diff --no-index -U0` on attempts 3 and 4 (exit 1, the files differ). Its `-` lines hash to 3604bf4c…1ee4, the same as the plain diff's `<` lines. Its `+` lines hash to c8d2e23c…a707, the same as the `>` lines. There are 18 hunks, at the 18 lines in the apply log.
- I re-derived attempt 4 in shell memory, writing no file. I took P1 to P16 and P18 from the fences in `report-rst-pairs-4-arch.md` (P14's new text at lines 190 to 193) and P17 from `report-rst-pairs-4-p17.md` (old text line 5, new text lines 8 to 14).
  - Each old text occurs exactly once in attempt 3, and each new text exactly once in attempt 4. The byte counts match the log.
  - Applying the 18 substitutions in turn gives 53669 bytes with sha256 e7b93c63…1399, identical to `rst-form-gate-4.txt`.
  - So no two old texts overlap, and the diff holds the 18 pairs and nothing else.

## Findings

### Correctness: none. Evidence: none.

### Documentation (must fix before the commit)

**D1, Documentation, §4 T28 (P12) and the cross-failure list (P5).** T28's fixture leaves its free windows' counts open. As T28 is worded, a run built as the author describes has two windows with no `layers` line: the one before the first window and the second window. The second window counts the R-span's `layerCount`.
- Under M20 (the median over single windows), that set's median is half the sum of the two counts. With a `layerCount` of 1 and a free window of 0, the median is 0.5, below 1, so the control passes and T28 reads a confirm.
- So M20 can also fail T28. P5's list does not name that case, although P5's general sentence covers recording it.
- Pinning the fixture makes P5's list exact:
```text
| T28 | the same pair as T18, with no other `layers` line in the interval, in a run where every pair of consecutive windows holds a `layers` line, reads neither | M28: read the control as passed when it has no pair | T28, read as a confirm |
```
```text
| T28 | the same pair as T18, with the R-span's `layerCount` at least two and no other `layers` line in the interval, in a run where every pair of consecutive windows holds a `layers` line and the only windows with no `layers` line are the window before the first window, counting 0, and the second window, reads neither | M28: read the control as passed when it has no pair | T28, read as a confirm |
```
Clause check:
- **The fixture can be built.** The window before the first window lies inside the interval, which starts at the second-last metrics line before t1. It must hold no line, and it holds none. The window before that one holds a line before the interval. The first window holds the R-span's line. So every pair of consecutive windows holds a line.
- **The correct reader** finds the control empty and reads neither (§5.1 O2, "Otherwise").
- **M28** treats the empty control as passed. The sum equals the `layerCount` and there is no other line, so T28 reads a confirm, as predicted.
- **M20** takes single windows {0, n_R}, whose median n_R/2 is at least 1. The control does not pass, the reading is neither, and T28 passes. P5's list then stays exact.
- **M18** reads 0, which is below n_R, so T28 reads a kill. P5 already lists that.
- **M19, M26 and M27** change nothing, because T28 has no other line.

**D2, Documentation, §0.1 (P2).** The bullet for -22 gives no path, although the other three rulings give theirs. The author's custodian note 1 asks for one. The file exists at main 20ed759b (`git ls-tree`), it was added in that commit (`git log --diff-filter=A`), and cdfebef1 is an ancestor of 20ed759b (exit 0).
```text
- The advisor's ruling ADV-2026-11-24-22, given to the custodian on 2026-11-24.
```
```text
- The advisor's ruling ADV-2026-11-24-22: `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-22-recentre-stall-three-observations-the-ceiling-from-the-line-plan-a-head-moved-before-the-runs-merged-in-and-read-narrowly.md`, given to the custodian on 2026-11-24.
```
Clause check: the path is the one `git ls-tree 20ed759b -- state/directives/` lists. The bullet's next sentences, "not in the tree at cdfebef1; it is filed on main", stay true.

**D3, Documentation, §7, the line plan (P17).** Brief check 2 asks whether the plan can hold the tests that §4 names. One figure is below what this repository's own tests show. `WorkingCanvas.stallObservation.test.tsx` is planned at 70 lines. It has to mount the real `WorkingCanvas` (T9 to T11) with a fake `Deck` given by `vi.mock("@deck.gl/core")`, mock `isInstrumentedBuild`, and cite S0's dist line in a comment (§4). The two existing tests that mount the real component this way spend 121 lines (`frontends/shell/src/canvas/WorkingCanvas.wiring.test.tsx`, first `describe` at line 122, mock at line 34, at cdfebef1) and 180 lines (`WorkingCanvas.recentre.test.tsx`, first `describe` at line 181, mock at line 53) before their first test. A minimal file is about 100 lines. Raising that one test file leaves the shipped files at 88 and keeps the total under 1,000:
```text
- At most 13 files and 1,020 changed lines, this form exempt. The ceiling is the line plan's total, 930, with a margin under a tenth of it (ADV-2026-11-24-22, item 1).
```
```text
- At most 13 files and 1,050 changed lines, this form exempt. The ceiling is the line plan's total, 960, with a margin under a tenth of it (ADV-2026-11-24-22, item 1).
```
```text
  - their tests: `watchdog.test.ts` 55, `stallTrace.test.ts` 45, `WorkingCanvas.stallObservation.test.tsx` 70;
```
```text
  - their tests: `watchdog.test.ts` 55, `stallTrace.test.ts` 45, `WorkingCanvas.stallObservation.test.tsx` 100;
```
Clause check:
- The parts add up: 88 + 200 + 197 + 475 = 960.
- The margin is 90, which is less than a tenth of 960 (96). So 1,050 is within the most allowed, 1,056.
- 960 is under 1,000, so nothing goes to the advisor for size.
- The shipped figures (20, 50 and 18) are unchanged. Scope stays at 13 files.
- 930 and 1,020 occur nowhere else in the form (grep).
- The other figures are plausible but thin, a view and not a finding. The reader at 250 lines has to carry six pairing rules, the baseline, O1, O2's interval, control and kill, O3's near rule and four VOIDs. Its test at 225 lines carries 17 tests. Both are counted with comments.
- This changes a figure under an advisor's ruling, so it is on the check 5 list (item 8).

## Check 1: each attempt-3 finding

| Finding | Pairs | Met? | Note |
|---|---|---|---|
| Arch E1 (false confirm before t1) | P14, P12 (T26), P9, P5 | yes | The interval starts at the second-last metrics line. At deck 9.3.9 the reset and the emission come before `updateLayers` (`dist/lib/deck.js:1019-1025`, then `:1031`; `:1031` is the only `updateLayers()` call in `deck.js`), so the start is sound and conservative. |
| Arch E2 (lockfile list incomplete) | P3, P15 | yes | The closure is complete by the lockfile at cdfebef1 (check 2). |
| Arch D1 (cross-failures) | P5, P9, P12 | yes, but see D1 | M16→T17, M18→T19, T20, T26, T27 and T28, and M19→T26 are each reachable as worded. M20→T28 depends on the fixture (D1). |
| Arch D2 (T15) | P7 | yes | The reviewer's words. Under M15 the drag rule takes the batch render's span after the last old-origin line, so T15 fails as predicted. |
| Arch D3 (T24) | P11 | yes | The architect's words verbatim. Under M24 no VOID clause is left, and the gap reads a kill. |
| Arch D4 (pair overlap, T20) | P14, P16, P10 | yes | (Q1,Q2) through (Q4,Q5) each sum to 1, so the median is 1 and the reading is neither. (Q5, first window) is excluded. Under M20 the median is 0.5 or 0, a confirm. |
| Arch D5 (double-click) | P13, P6 | yes | Cites verified (check 4). |
| Arch D6 (kill exception) | P14 | yes | The least-count kill covers the replacement case (`layer-manager.js:129-131`, `:156`). The reason is true. |
| Arch D7 (stale filing) | P2 | yes | -21 is on main at 20ed759b (`ls-tree`). |
| Arch D8 (ceiling) | P17 | yes | Replaced by -22 item 1. D8's words that an overrun is expected would now be untrue. See D3 for the figure. |
| Arch D9 (hit after S0's diff) | P4 | yes | S0 comes before code, so "Before code … stops the piece as above" covers it. |
| Rev E1 | P14, P12 (T26 to T28), P9 | yes | The start, the least-count kill and the empty control (neither) are each worded and tested. "Each window with the next" means the same as my "overlapping". |
| Rev D1 | P7 | yes | My words verbatim. |
| Rev D2 | P8 | yes | My words verbatim. Under M17 there are three spans, so T17 reads at the drag's R-span. |
| Rev D3 | P15 | yes | It is changed to point at §0.3's list. The reason is true, and the pair agrees with P3. |
| Rev D4 | P16 | yes | It uses the same phrase as P14. |
| Rev O-1 | P4 | yes | It follows -22 item 2 clause by clause: merged in, a narrow read if a listed item is touched, the runs on that base, and a stop only if the instrument's place or what it times has changed. |

The settled pairs:
- **P14 (O2): met.** Each reading is decidable from page times and arrival order. The interval's start is checked against deck 9.3.9 under check 2.
- **P12 (T26 to T28): met.**
  - T26: the line lies in the interval and the sum is n_R, so the reading is neither. Under M26 the line falls outside the interval, so T26 reads a confirm. M26 fails no other test, because the other lines of T19 and T27 come after the R-span.
  - T27: the sum is n_o, and the least is n_o, so the reading is neither. Under M27, n_o is below n_R, so T27 reads a kill. M27 fails no other test, because the sums of T19 and T26 are n_R.
  - T28: met, subject to D1.
- **P7 (T15): met.**
- **P4 (the moved head): met** (Rev O-1).
- **P3 with P15 (the lockfile entries): met.**

Pairs changed from a gate's words, and their reasons:
- **P3.** The reason is true. `@mapbox/tiny-sdf` is at `@deck.gl/layers` `package.json:43`. `flatbuffers`, `json-with-bigint` and `tslib` are Arrow's dependencies (lockfile `:2335-2340`). The `@types/*` packages carry no runtime code.
  - One slip in the reason, not in the form: core's dependency list in the lockfile runs through line 473 (`mjolnir.js`), not 472.
- **P4.** The reason is true.
- **P5.** The reason is true, except for the M20 case (D1).
- **P14.** The reason is true.
- **P15.** The reason is true.
- **P16.** The reason is true.

The author's own pairs, and their reasons:
- **P1 and P2:** true (D2 adds the path).
- **P9:** true. Without control pairs, the empty-control rule would make M19 read neither.
- **P17:** the arithmetic is true (930, and 1,020 within 1,023). D3 is about one figure.
- **P18:** true.

## Check 2: the new words in context

**§4, mutation by mutation.**
- T14 (P6): M14 picks the span after the first new-origin line, so T14 fails.
- T15 (P7) and T17 (P8): as in the table above.
- T19 (P9): correct reading neither. Under M19, a confirm. Under M27 the sum n_R is not below n_R, so the reading stays neither and T19 passes.
- T20 (P10): as in the table above.
- T26 to T28 (P12): as above.
- Each mutation fails only its own test, or the extra failures P5 names, except M20 on T28 (D1).

**§5.1 O2 (P14), against deck 9.3.9.**
- `_onRenderFrame` is the loop's `onRender` (`deck.js:784`).
- Every 60th frame it gets the metrics, resets the stats and calls `_onMetrics` (`:1019-1025`), and only then calls `updateLayers` (`:1031`).
- View-state transition updates come at the end of the frame (`:1038-1040`), so any render they cause sets layers for the next frame.
- `setProps` only queues `_nextLayers` (`layer-manager.js:129-131`), and `updateLayers` takes the latest queued set (`:156`).
- `Attributes updated` is incremented per updated layer (`attribute/attribute-manager.js:144-145`), and `updateAttributesCount` reads it (`deck.js:1086`).
- So the first window after t1 counts the updates processed from the last emission frame before t1 onward. The layers behind those updates were set after the second-last metrics line. The start is sound, the kill against the least count is sound, and every reading is decidable.

**§0.3's lockfile list (P3), against `frontends/shell/package-lock.json` at cdfebef1.**
- The `dependencies` of each entry close over exactly the listed families and names:
  - core at 457-473 and layers at 481-490;
  - `@loaders.gl` core, images, loader-utils, schema, schema-utils and worker-utils at 991-1061;
  - luma at 1062-1116;
  - math at 1123-1158;
  - probe at 1192-1211;
  - `apache-arrow` at 2330-2344;
  - the leaf entries `earcut`, `flatbuffers`, `gl-matrix`, `json-with-bigint`, `mjolnir.js`, `tslib` and `@mapbox/tiny-sdf`, none of which has dependencies.
- No nested copy of any listed package exists (grep, exit 1).
- `src/attributes/values.ts:4` and `canvas/decodeBatch.ts` import `apache-arrow`. `buildLayers.ts` and `highlightLayers.ts` import only from `@deck.gl/*`.

**The widened list against the three heads (merge base 0bcf5434 for all three).**
- The lockfile at cdfebef1, at 0bcf5434 and at origin/main 20ed759b is the same (`diff --stat`, empty).
- Each head's lockfile diff is identical (0 diff lines between PR A's head and each of the other two). It is insertions only (hunks at 26, 2741 and 3573): `fast-check` 4.10.2 and `pure-rand` 8.4.2, both dev. None touches a listed entry.
- None of the heads changes a listed file, `src/diagnostics/` or `decodeBatch.ts`. PR A also changes `limits.ts`, as §0.3 records, and all three change `WorkingCanvas.tsx`, as §0.3 lists.
- The one-line insertion at 26 moves `@deck.gl/core` to line 453 at each head. The form pins line 452 at cdfebef1, and its header says the pin is authoritative.

**§7 (P17), against -22 item 1.**
- There is one figure per file for the 13 Scope files, and the total is 930.
- 1,020 is within a tenth of 930.
- The shipped figures (88 in all) equal the author's estimate of attempt 2. Attempt 2 had no figure for each file: its §7 gave only the 580 total (scratch `rst-form-gate-2.txt:327`). So the comparison rests on the author's estimate made afterwards (check 5, item 8).
- The total is under 1,000.
- Whether the plan holds the tests: see D3.

**§0.1, §0.3, §5.3 and §12 (P1, P2, P4, P15, P18).**
- They carry -21 items 1, 2 and 4, and -22 items 1 to 3. They contradict neither ruling.
- §7's "An overrun is recorded as class 8, and §7 is never edited." (line 359) stays, as -22 item 1's last bullet requires.

## Check 3: concurrency

- **P14's interval.** One thread runs both callbacks. The metrics line and `updateLayers` come from one synchronous frame callback, and `render()`, with its `layers` and span lines, is synchronous too, so neither can interleave with the other. A `layers` line before the second-last metrics line was processed at that frame or earlier. Spillover into a control pair raises the pair's sum, so it errs toward neither and never toward a false confirm. Sound as stated.
- **P13, the double-click transition.**
  - `_onDoubleClick` passes `_getTransitionProps({around})`, which holds `transitionDuration` 300 and an interpolator (`controller.js:538`, `:615-621`; `orthographic-controller.js:316-319`). So the first tick starts a transition (`WorkingCanvas.tsx:2152`).
  - The transition's ticks carry the controller's `_interactionState`, with `inTransition` set (`controller.js:241-242`; `transition-manager.js:16-30`), the last tick included (`transitions/transition.js:75-80`). So `WorkingCanvas.tsx:2150` and `:2192` defer each one.
  - The end sets only the interaction state (`transition-manager.js:136-146`).
  - A wheel tick at deck's default `smooth=false` starts no transition (`controller.js:379-381`), so case 2's wheel tick can re-centre.
  - Sound as stated.

## Check 4: cites in the new words, at cdfebef1

All of these hold:
- `WorkingCanvas.tsx`: 2150 to 2152, 2161, 2192, 2197;
- `package-lock.json`: 452 to 454;
- `src/attributes/values.ts`: 4.

The deck cites hold at 9.3.9 (`core/package.json:6`), package-relative:
- `@deck.gl/core/package.json`: 42 to 58;
- `@deck.gl/layers/package.json`: 39 to 48;
- `dist/controllers/controller.js`: 538;
- `dist/controllers/orthographic-controller.js`: 316 to 319;
- `dist/controllers/transition-manager.js`: 136 to 146.

## Check 5: the rulings, and the wording that is the advisor's to rule (ADV-2026-11-24-18 item 10)

No new word contradicts -18, -19, -21 or -22. Starting from the author's twelve items:
1. **Stays:** §12's descriptions of OPEN-6 (A), OPEN-7 (A), OPEN-8 and OPEN-12 (A). The -21 row and the -22 row (P18) are the author's words, which the advisor has not read.
2. **Widened again:** §0.3's list (P3), which -22 item 3 reads as the timed path. The advisor has not read the list's words. A hit stops the piece before code.
3. **Stays:** D1 has no perturbation control.
4. **Stays:** case 3's observer-only shape.
5. **Changed, not removed:** §5.3's stop, now "anything §0.3's diff names (a function, a file, or a lockfile entry it lists)" (P15). The custodian sends the item-2 material.
6. **Stays:** the product lines are emitted in every instrumented build.
7. **Stays:** the reader's test is run only by hand.
8. **Ruled, now worded:** §7's ceiling. As gated it is 1,020 from 930; with D3 it is 1,050 from 960, and the shipped files are unchanged at 88. Two more points:
   - Attempt 2 planned no figure for each file, so "not above attempt 2" rests on the author's estimate made afterwards.
   - `stallObserver.mjs` grows by 12 lines (harness, not shipped), per the author's custodian note 2.
9. **Corrected:** O2. The author's render sources hold at cdfebef1:
   - `:1819` (auto-fit, rendering at `:1448`);
   - `:1833`, `:1847`, `:1853`, `:1925` and `:2197`.
   My attempt-3 `:1822` is a blank line.
10. **Ruled, now worded:** P4 puts -22 item 2 in the form's words. The advisor has not read P4.
11. **For the custodian to compare with its message:** attempt-3 P7's addition that S0 records the `candidateArmSession.ts` and `App.tsx` diffs.
12. **Cited without a path:** P2 cites -22 by item only; D2 adds the path.
13. **New, a note:** a head that moves during the series (between M0 and M3) falls between P4 ("before the runs") and §5.3 ("after the runs"). The natural reading is that its merge waits until the series ends, so §5.3 applies. The form does not say so.

## Notes (not findings)

- **T14's words (P6).** "which deck 9.3.9 does not produce" is shorthand. Strictly, it is the app's deferral (`WorkingCanvas.tsx:2192`) of deck's transition ticks; §5 Terms says so in full.
- **P5's cross-failure list.** It does not try to cover mutations whose extra failures depend on a fixture's figures, for example M13 on the O2 tests' equality edges. The general sentence covers them.

## Commands run (exit codes)

1. `sha256sum`, then `wc -c`, of the eight scratch files: 0.
2. `cat` of `apply-rst-4.log` and `rst-form-gate-3-4.diff`: 0.
3. `git diff --no-index -U0` of attempts 3 and 4, piped through `grep`, `sed` and `sha256sum`, and the `@@` hunk list: git exit 1 (the files differ). Both hashes are equal to the plain diff's.
4. `grep -n` of the fence lines in both pairs reports; `file`; `grep -c $'\r'`: exit 1 (no CR in any of the four files).
5. The shell re-derivation (`sed -n` of the fences, bash literal substitution and counting, `sha256sum`, `wc -c`): 0. The result is e7b93c63…1399, 53669 bytes.
6. `git -C D:/wt/read-1124c rev-parse HEAD`, then `git show cdfebef1:` with `sed` or `grep` (all 0) for:
   - `WorkingCanvas.tsx`: 2140-2200, 1446-1449, 1816-1834, 1845-1854, 1923-1926, and greps;
   - `values.ts` and `decodeBatch.ts`, the import lines of the listed files, and `style-ts/package.json`;
   - `package-lock.json`: 450-492, 991-1215, the Arrow and leaf entries, the nested-copy grep (exit 1, no match), and the mjolnir grep;
   - the line counts and first `describe` lines of `WorkingCanvas.wiring.test.tsx` and `WorkingCanvas.recentre.test.tsx`.
7. `sed` and `grep` under `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/` (evidence, not Authority): 0.
   - `core/package.json` and `layers/package.json`;
   - `core/dist/lib/deck.js`: 360-372, 1005-1045, 1080-1090, and greps;
   - `layer-manager.js`: 125-160;
   - `attribute/attribute-manager.js`: 138-148;
   - `controllers/controller.js`: 525-542, 612-624, 226-247, 379-394;
   - `orthographic-controller.js`: 312-322;
   - `transition-manager.js`: 14-34, 95-149;
   - `transitions/transition.js`: 30-95.
8. Per head (806ad308, 639a96cc and e4116cad), all exit 0:
   - `cat-file -t`, `merge-base origin/main`;
   - `diff --stat` and `diff -U0` of the lockfile and `package.json`, and the added lines;
   - `diff` of PR A's head against the other two, piped to `wc -l`;
   - `diff --name-only` of the listed files, `ls-tree` for `decodeBatch.ts`.
   Then `diff --stat` from cdfebef1 to 0bcf5434 and to origin/main; `rev-parse origin/main`.
9. `git ls-tree` of the ruling files at 20ed759b, `log --diff-filter=A -1`, `merge-base --is-ancestor cdfebef1 20ed759b`: 0.
10. `ls` and `grep` of scratch `rst-form-gate-2.txt` and `rst-form-gate-1.txt` for §7's ceiling; `git diff --no-index -U0` of attempts 2 and 4, hunk list only: 0, git exit 1.
11. Uniqueness counts of this report's four old texts in attempt 4 (bash counting, and `grep -c -x -F`): each occurs once. Then `grep -n -F` for 930 and 1,020: 0.

Outside the brief's command list: besides git show, log, diff, rev-parse and merge-base, I used `git ls-tree` and `git cat-file -t`, and besides grep, sed, wc and sha256sum, I used `cat`, `file`, `ls`, `tr`, `cut` and `head`. All are read-only. Nothing was written, checked out or built.

## Files read

- Scratch, `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/`:
  - `rst-form-gate-4.txt` (whole);
  - `rst-form-gate-3.txt` (by script);
  - `rst-form-gate-3-4.diff`;
  - `apply-rst-4.log`;
  - `report-rst-pairs-4-arch.md`;
  - `report-rst-pairs-4-p17.md`;
  - `report-rst-formgate-arch-3.md`;
  - `report-rst-formgate-rev-3.md`;
  - `rst-form-gate-2.txt` and `rst-form-gate-1.txt` (grep only).
- D:/wt/read-1124c @ cdfebef1:
  - `frontends/shell/src/canvas/`: `WorkingCanvas.tsx`, `WorkingCanvas.wiring.test.tsx` and `WorkingCanvas.recentre.test.tsx` (ranges as above), plus the import lines of `buildLayers.ts`, `highlightLayers.ts`, `decodeBatch.ts` and the other listed files;
  - `frontends/shell/src/attributes/values.ts`;
  - `frontends/shell/package-lock.json`;
  - `renderer/style-ts/package.json`.
- At the three heads and 0bcf5434: diffs only. At 20ed759b: the `state/directives/` names only.
- Untracked, read only, as evidence and not Authority: `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/` and `@deck.gl/layers/` (files as in command 7).

Model: Opus 5.5 (claude-opus-5-5).
