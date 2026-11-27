Reviewed: the stall form's draft text, rst-form-gate-3.txt in the scratch folder (48345 bytes, sha256 e9fe8393e75f020ac0c70e27048054ed3f55a93f1d7544822526b1dff64f0c69), made from attempt 2 by the architect's 23 pairs, with the read checkout D:/wt/read-1124c at cdfebef1eecdda586cd7c9aca41941447b453a99, read only (the custodian's filing note, 2026-11-24: the reviewer's form gate of the full form, attempt 3, before the form is committed, node:recentre-stall-three-observations@form-gate-reviewer-3, under ADV-2026-11-24-18 item 2; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T08:43:54Z with its brief byte for byte; its run: Bash 38, Read 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T08:43:54Z to 2026-11-24T08:58:14Z by its transcript; 3 calls named the main checkout (3 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/core there, as the report discloses, which change nothing); besides its git, grep, sed, wc and sha256sum calls it ran cat and node -e on the scratch files, read only, the script its check 0 allows; handed back once, at 2026-11-24T08:58:13Z. Filed below the rule, 25430 bytes, sha256 720bf5b211dabcb109116b254d249bb05495a2cf3bdb51ec1e6ae5be782711ef, byte for byte, nothing masked, with one final newline added.)

---

Verdict: FAIL — detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99
Reviewed: rst-form-gate-3.txt sha256 e9fe8393e75f020ac0c70e27048054ed3f55a93f1d7544822526b1dff64f0c69, with D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

All seven scratch files match their briefed sha256 and byte counts. The read checkout's HEAD is cdfebef1. Its origin/main is 4a44acfd. `git diff --name-only 4b17d9da origin/main -- frontends/ renderer/ docs/ kernel/` is empty, and cdfebef1 is an ancestor of main.

There is one Evidence finding (E1), so the verdict is FAIL. None of the sentences below is the human's wording: all are the drafting architect's words or the gates'. E1 changes what the reader computes, so as in attempt 2, the custodian decides whether the form is re-gated.

## Check 0: how attempt 3 was made

- I wrote a `node -e` script that reads the pairs file's 23 `**Pn**` headers and their two ```text fences each:
  - Each old text occurs once in attempt 2, and each new text occurs once in attempt 3.
  - No two old spans overlap.
  - Replaced from the end, the result is byte-identical to `rst-form-gate-3.txt` (48345 bytes, sha256 e9fe8393…0c69).
- `git diff --no-index -U1 rst-form-gate-2.txt rst-form-gate-3.txt` hashes to 2347fb53…bbcc25. That is the briefed diff, with 18 hunks.
- So the diff holds the 23 pairs and nothing else.

## Findings

### Evidence (blocking)

**E1, Evidence, §5.1 O2 (P16) and §4 (P12): both directions of the count reading can be wrong in cases the form's own premise makes reachable.**

- **A false kill.** A later render before deck's next frame replaces the R-span's layers. In deck 9.3.9, `setProps` only sets `_nextLayers` (`dist/lib/layer-manager.js:129-131`), and the layers are processed at the frame (`dist/lib/deck.js:1031`). P12's own reason says so.
  - The confirm excludes that case, but the kill does not.
  - On the default candidate arm (`frontends/shell/src/residency/residencyArm.ts:50`), an ordinary out-of-view supersede clears a tile, and that clear renders synchronously with fewer layers (`frontends/shell/src/residency/candidateArmSession.ts:970-981` → `frontends/shell/src/canvas/WorkingCanvas.tsx:1845-1848`). Evictions do the same (`WorkingCanvas.tsx:1925`).
  - When such a render stands in for the R-span's, its set is smaller. Its updates are then fewer than the R-span's `layerCount` even with the trigger true, and the reading kills the trigger.
  - This is reachable wherever a tile stream is in flight at the R-span: case 2 (its own reload, then a drag-out) and run D.
- **A false confirm.** deck emits a window and resets its stats at the start of a frame, before that frame's `updateLayers` (`deck.js:1019-1031`). So the first window after t1 holds the updates of every frame since the last emission, including updates of layers set before the R-span.
  - The confirm's "no other `layers` line" interval starts at the R-span's own `layers` line, so an earlier render's updates can enter the sum.
  - That is reachable at case 2's wheel tick. The double-click's tile renders (the coalesced schedule at `WorkingCanvas.tsx:1833`) precede the wheel tick, and the settle waits only for 600 ms with no `view-state` lines (`frontends/shell/e2e/recentre-crossing.mjs:131`).
- **The control.** An empty control set, and whether the pairs overlap, are not stated. The second is decidable only by the reader author's choice.

Replacement (§5.1 O2):
```text
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, no other `layers` line lies between the R-span's `layers` line and the second window's page time, and, over pairs of consecutive windows with no `layers` line in either, the median summed count is less than one.
- Kills the trigger: the summed count is below `layerCount`.
- Otherwise: neither. Where another `layers` line lies in that interval, so that another render's attribute updates may be in the sum, each such line's `layerCount` is recorded.
```
```text
- **The interval** runs from the second-last metrics line before the R-span's t1 (or the run's start) to the second window's page time. deck resets its counts when it emits a window, before that frame's layer update, so the first window can hold the updates of layers set just before the last metrics line before t1; and a later render before deck's next frame replaces the R-span's layers (S0 records the lines).
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, no other `layers` line lies in the interval, and, over overlapping pairs of consecutive windows with no `layers` line in either, the median summed count is less than one.
- Kills the trigger: the summed count is below the least `layerCount` of the R-span's `layers` line and every other `layers` line in the interval.
- Otherwise: neither, including a run with no pair for the control. Where another `layers` line lies in the interval, so that another render's attribute updates may be in the sum or may stand in for the R-span's, each such line's `layerCount` is recorded.
```

Replacement (§4, the reader's two new rows after T25):
```text
| T25 | two long gaps with no R-span near either, whose lines say `visible`, one with a `visibilitychange` line inside it and one with such a line 50 ms after its end, are each recorded VOID | M25: read the gap line's own `visibilityState` only | T25, each gap read as a kill |
```
```text
| T25 | two long gaps with no R-span near either, whose lines say `visible`, one with a `visibilitychange` line inside it and one with such a line 50 ms after its end, are each recorded VOID | M25: read the gap line's own `visibilityState` only | T25, each gap read as a kill |
| T26 | O2 with another `layers` line after the second-last metrics line before the R-span's t1 and before the R-span's own `layers` line, a summed count equal to the R-span's `layerCount`, and T18's quiet pairs, reads neither, with that line's `layerCount` recorded | M26: start the interval at the R-span's `layers` line | T26, read as a confirm |
| T27 | O2 with another `layers` line after the R-span's and before the second window's page time, whose `layerCount` is below the R-span's, and a summed count at least that `layerCount` and below the R-span's, reads neither | M27: compare the kill with the R-span's `layerCount` only | T27, read as a kill |
```

Clause check:
- **The reset comes before the update:** `deck.js:1019-1021` (`_getMetrics`, `stats.reset`), then `:1031` (`updateLayers`). This is evidence, not Authority. The form keeps its rule that S0 records the lines.
- **The interval's start.** Layers set between the frame before an emission and that emission are processed after its reset. They lie after the emission before it, so starting at the second-last line is sound and conservative.
- **The kill against the least `layerCount`.** Whichever set deck updates, a true trigger gives at least that set's count, and other updates only add to it. A count below the least therefore means no set was fully regenerated.
- **The old tests still hold:**
  - T18 has no other line, so the least is the R-span's own `layerCount`, as before.
  - T19's sum `layerCount` is at least the least count, so it is not a kill: neither.
  - T20's overlapping pairs give (0,1), (1,0), (0,1) and (1,0), each summing to 1, so the median is 1: neither. M20 still confirms.
- **Each new mutation changes one branch:**
  - M26 moves only the interval's start. T27's other line lies after the R-span's, so M26 leaves T27 alone.
  - M27 changes only the kill's comparison. T19's sum equals the R-span's `layerCount`, so it stays neither under M27.
- **Lines.** About 6 reader lines and 2 tests are added. An overrun of §7's 580 lines is class 8 at the count, and §7 is not edited.

### Documentation (must fix before the merge)

**D1, §4 T15 (P12).** M15's predicted failure needs a span after the drag's last `view-state` line. Without one, the drag rule finds nothing under M15 either, and the mutation survives. The row does not ask for that span.
```text
| T15 | a drag and a seam call whose `view-state` lines show no origin change have no R-span, and nothing is read at them | M15: drop the no-origin-change test, so that each step is paired by its type's rule | T15, on an R-span read at the drag |
```
```text
| T15 | a drag and a seam call whose `view-state` lines show no origin change have no R-span, and nothing is read at them; the drag's last `view-state` line is followed by a batch render's span | M15: drop the no-origin-change test, so that each step is paired by its type's rule | T15, on an R-span read at the drag |
```

**D2, §4 T17 (P12).** "At that R-span" can be read as the open's own R-span. O1 is never read there (§5.1 O1's list excludes the open), so M17 would survive on that reading.
```text
| T17 | the span after the open's fit `view-state` line is an R-span and stays out of the baseline: with it and two non-R spans in the 5% band, O1 is not read at that R-span | M17: count the open's span in the baseline | T17, read at that R-span |
```
```text
| T17 | the span after the open's fit `view-state` line is an R-span and stays out of the baseline: with it and two non-R spans in the 5% band of a drag's R-span, O1 is not read at the drag's R-span | M17: count the open's span in the baseline | T17, read at the drag's R-span |
```

**D3, §5.3 (P19).** §0.3's list now holds lockfile entries (P6), which are neither a function nor a file. "Any function or file" lets a strict reader stop on any lockfile change. Each head already adds fast-check and pure-rand there (`git diff origin/main...<head> -- frontends/shell/package-lock.json`; no `@deck.gl` or `@luma.gl` line).
```text
- A held head merged in after the runs touches any function or file §0.3's diff names:
```
```text
- A held head merged in after the runs touches anything §0.3's diff names (a function, a file, or a `@deck.gl/*` or `@luma.gl/*` lockfile entry):
```

**D4, §7 Values (P21).** The reader computes "with §7's constants" (§2.4), but the O2 control's constant is not in §7.
```text
- O2 thresholds: 50% and 10%, over two windows.
```
```text
- O2 thresholds: 50% and 10%, over two windows; the control's median summed count below 1, over overlapping pairs of windows with no `layers` line.
```

## Check 1: each attempt-2 finding

| Finding | Pairs | Met? | Note |
|---|---|---|---|
| Arch E1 | P12 (T16, T17, T21 to T25), P15 | yes | T21 isolates the kept-gap clause (t1 more than 100 ms before the gap). M21 and M22 each remove the only clause that makes their gap near. T17 wording: D2. |
| Arch E2 | P6, P20 | yes | No head changes a `@deck.gl/*` or `@luma.gl/*` lockfile line (grep count 0 for each head). `package-lock.json:452-454` holds. |
| Arch E3 | P9, P18 | yes | Both edges are page times on the gap line. The begin-tick state is dropped; the change line covers a gap that starts hidden and ends visible (check 3). |
| Arch D1 | P10, P13, P12 (T14, T17) | yes | The double-click shape matches `WorkingCanvas.tsx:2161`, `:2192` and `:2197`. |
| Arch D2 | P21 | yes | Except the O2 control's constant (D4). |
| Arch D3 | P11 | yes | |
| Arch D4 | P2 | yes | The ancestry was checked by me (`merge-base --is-ancestor`, exit 0). |
| Arch D5 | P4 | yes | `useEffect(` is at line 2069 and `}, []);` at 2261. |
| Arch D6 | P14, P12 (T15) | yes | T15 fixture: D1. |
| Rev E1 | P16, P12 (T18 to T20) | in part | Met for later renders. Not met for earlier renders in window 1, and the kill is unguarded (new E1). |
| Rev E2 | P12 | yes | |
| Rev E3 | P9, P18 | yes | |
| Rev E4 | P5 | yes | |
| Rev E5 | P17 | yes | |
| Rev D1 | P8 | yes | |
| Rev D2 | P7 | yes | Each head: `candidateArmSession.ts` +66/−41 (numstat), and App.tsx changed. |
| Rev D3 | P22 | yes | |

The settled pairs:
- **P9 with P18 (gap visibility): meets both.**
  - The architect's edge times and the reviewer's change line are both kept.
  - Dropping the begin-tick state loses no case. A gap whose begin tick reads hidden and whose end tick reads visible must hold the change to visible between the two ticks.
  - P18's "at its end only" is true under P9.
- **P12 (T14 to T25): meets both.**
  - Every predicted failure is reachable as worded, apart from D1 and D2.
  - Each mutation alters one branch only:
    - M14: the fit rule picks the later span;
    - M15: the drag rule, given D1's span;
    - M16: two spans are then enough;
    - M17: the open's span makes three;
    - M18: the first window counts 0, so the reading is a kill;
    - M19: with no test for another line, the reading is a confirm;
    - M20: single windows have a median of 0;
    - M21 and M22: each removes the only near clause for its gap;
    - M23: neither becomes a kill;
    - M24: has no effect in T25, whose lines say `visible`;
    - M25: has no effect in T24, which has no change line.
- **P16 ("Otherwise"): meets Rev E1 in its scope.**
  - The author's reason is true: in the reviewer's words, a sum of at least `layerCount` with no other line and a failed control had no reading.
  - E1 above extends the finding.

The pairs changed from a gate's words:
- **P5.** The reason is true. `matchGroups.ts:34` calls `style.unmatchedGroup()` and `style.groupFor`, which are at `renderer/style-ts/src/style.ts:184` and `:193`; `groupFor` reads only its own fields.
  - The list is now complete for the repository code inside the span: `activeBatches`, `buildLayers` (imports at lines 4 to 11), `buildHighlightLayers`, `traceLayerUpdate`, `pickResolutionExtentFor`, and `begin` and `end`.
  - `readColumn` (`frontends/shell/src/attributes/values.ts:95`) uses apache-arrow, which is outside both "repository code" and P6. It runs only on a `rowGroups` cache miss (`matchGroups.ts:28-29`), which a re-base does not cause. Not a finding.
- **P7.** The reason is true: §0.3's title makes every git fact the custodian's, and the counts were the reviewer gate's.
- **P17.** The reason is true. `attachConsole` keeps every entry (`frontends/shell/e2e/lib.mjs:381-383`). The suites read only `renderTrace()` (`lib.mjs:393`, used at `recentre-crossing.mjs:236`) and the `view-state` filters (`recentre-crossing.mjs:73`, `pan-anchor.mjs:61`). The finding is still met.

## Check 2: the new words in context

- **§4.** See check 1, P12. The only gaps are D1 and D2.
- **§5 decidability.** Each new reading is decidable by the committed reader:
  - the double-click, open and No R-span rules come from node marks and the `view-state` lines;
  - the baseline's minimum;
  - O3's near rule, now that both gap edges are on the gap line;
  - the two VOIDs.
  - O2's control is not decidable without E1's words, which settle the empty control set and the overlapping pairs.
- **The author's item 9 (can O2 still confirm or kill in the planned measure runs M1 to M3?).** Yes, by my reading of the code; I made no run.
  - In case 1:
    - the fixture's 1,885,130 vertices fit under `MAX_RESIDENT_VERTICES` = 2,000,000 (`frontends/shell/src/canvas/limits.ts:73`);
    - a drag renders only at a re-centre (`WorkingCanvas.tsx:2192-2197`);
    - a tile batch that changes nothing schedules no render (`:1822-1833`);
    - the drags are spaced by a 600 ms settle with no `view-state` lines (`recentre-crossing.mjs:131`), and the two crossings fall at drags 35 and 74 (§0.2's S6b/S7 report).
  - So case 1's R-span windows can be free of other `layers` lines, and O2 can confirm or kill there.
  - Neither is likely at case 2's wheel tick and at case 3. It is also likely through run D, where the seam renders on every call (`WorkingCanvas.tsx:2410`).
  - Not a finding. But item 9 cites `:1605` and `:1615` as the other renders, and those are the baseline arm's `pushBatch` and `clearStream`. On the default candidate arm the sources are `:1822` (auto-fit), `:1833` (coalesced), and `:1847`, `:1853` and `:1925`. Correct this before it is sent.
- **§5.3 and §12 against ADV-2026-11-24-21 (P1, P3, P19, P23).**
  - P19 carries items 1, 2 and 4 and leaves out item 3, which binds the advisor. P23's row matches.
  - P19 reads the ruling's "timed path" as §0.3's list. ADV-2026-11-24-21 item 2 itself names "the functions the criterion names", so this contradicts nothing (scope wording: D3).
  - P3's path exists on main, added at 8ed33953.
  - The rulings -18 and -19 were added at d7a126ac, the commit after d5232d0f, as line 22 says.
- **§0.3 after P5, P6 and P7, against the three heads** (three-dot against origin/main; merge base 0bcf5434 for all three):
  - None of the heads changes any listed file, `matchGroups.ts`, `values.ts`, `style.ts`, `src/diagnostics/`, `decodeBatch.ts` or `tileViewportStreamManager.ts`.
  - None changes a `@deck.gl` or `@luma.gl` lockfile line; their lockfile changes are fast-check 4.10.2 and pure-rand 8.4.2.
  - PR A's `limits.ts` change is additions only, after line 128 (`CeilingKind`, `ceilingKindOf`). `checkPickCeiling` (line 113) is untouched.
  - The `WorkingCanvas.tsx` hunks are as §0.3 lists them: none falls in lines 1127-1129, `render()` (1355-1391), `fitToExtent`, `onViewStateChange` or 2069-2261.
- **§7.** The rule holds as written: an overrun is class 8, and §7 is never edited. But the author's own estimate (+250 to 300 lines, in the pairs report, not in the form), plus E1's two tests, makes an overrun of 580 close to certain. The form is not committed yet, so this is the last point at which the ceiling can be set without class 8. That choice is the advisor's (check 5, item 8).

## Check 3: concurrency

- **P9's change line and §2.3's pairing.** The `layers` line (`WorkingCanvas.tsx:1383`) and the span line (`end` in the `finally` at `:1388`) come from one synchronous `render()`. A `visibilitychange` handler is its own task and cannot fall between them, so the pairing holds.
- **One ordered queue (§2.4 (a)).** The change line is a `[stall-obs]` line taken as text with its receipt time, so it is queued in arrival order. Its text contains neither `view-state` nor `[render-trace]`.
- **The order of the state change and the event.** The author's reading is sound as stated. My reading of the HTML standard, not checked on WebView2: "update the visibility state" sets the state and then fires `visibilitychange` within one algorithm. So a timer tick sees either the old state, or the new state with the event already fired.
- **P18's margin.** `ADJACENT_MS` after the gap's end covers the other order in case WebView2 differs. Any error it causes is an extra VOID, never a false reading.
- **Instrument cost.** The handler's cost never lies in a gap that is read, because any such gap is VOID.
- **Note for the code gates.** The gap and change lines must be single-string console arguments, since §2.4 (a) reads them "as text". T5 covers the product lines only.

## Check 4: cites in the new words, at cdfebef1

All of these hold:
- `WorkingCanvas.tsx`: 1127-1129, 1372-1386, 2069, 2261;
- `buildLayers.ts`: 113 and 448;
- `matchGroups.ts`: 31 and 34;
- `style.ts`: 89, 184 and 193;
- `limits.ts`: 113;
- `residencyArm.ts`: 50;
- `package-lock.json`: 452-454.

The author's reasons cite deck package-relative (9.3.9 per `package.json:6`), and these hold too:
- `dist/lib/deck.js:1016-1031` and `:1075`/`:1085`/`:1086`;
- `dist/lib/layer-manager.js:129-131`;
- `dist/lib/attribute/attribute-manager.js:102`, `:143` and `:145` (and `:144`, the `if (updated)`).

The P9 and P17 reasons cite `pan-anchor.mjs:61` and `lib.mjs:381-383` and `:393`, which also hold.

## Check 5: the rulings, and the advisor's wording list (ADV-2026-11-24-18 item 10)

No new word contradicts ADV-2026-11-24-18, -19 or -21. The list, starting from the author's nine:
1. Stays: §12's descriptions of OPEN-6 (A), OPEN-7 (A), OPEN-8 and OPEN-12 (A).
2. Stays, widened: §0.3's list as "the functions the criterion names". It now holds:
   - the deck and luma lockfile entries (P6);
   - `matchGroups.ts`, `values.ts` and `checkPickCeiling` (P5);
   - `groupFor` and `unmatchedGroup` in `style.ts` (P5).

   P7 leaves `candidateArmSession.ts` and `App.tsx` outside the list while recording them as observed.
3. Stays: D1 has no perturbation control (§5.2, §3).
4. Stays: case 3's observer-only shape.
5. Changed, not removed: ADV-2026-11-24-21 rules the stop, but P19's reading of its "timed path" as §0.3's list (with item 2's scope) is the form's own wording, written by the author and not read by the advisor.
6. Stays: the product lines are emitted in every instrumented build (P8, P17).
7. Stays: the reader's test is run only by hand.
8. Changed: P12 adds eleven tests, and E1 adds two more (T26, T27). Whether §7's 580 is set anew before commit, or left to a class 8 at the count, is the advisor's call.
9. Corrected: O2 reads neither where other renders fall in its interval (likely at case 2, case 3 and run D), not at most R-spans. Case 1 can confirm or kill. The render sources are the candidate arm's (`:1822`, `:1833`, `:1847`, `:1853`, `:1925`), not `:1605`/`:1615`. Under E1 the kill compares with the least `layerCount`.

## Outside the changes (Documentation)

**O-1, §0.3, "A head that moves later".** It states no consequence for a hit by a head moved after code and before the runs. Line 67's stop is "before code", and ADV-2026-11-24-21 covers only after the runs. Proposed words, for the advisor's list since they add a stop:
```text
, with the same diff check.
```
```text
, with the same diff check; a head that touches any of them after code and before the runs stops the piece before the runs and comes back to the advisor.
```

**Note, not a finding.** `layerCount` is `layers.length` (`WorkingCanvas.tsx:1383`), but deck receives the highlight layers too (`:1378`). With nothing highlighted those layers are presumably empty; any highlight updates would only raise O2's count.

## Commands run (exit codes)

1. `sha256sum`, then `wc -c` of the seven scratch files; `git -C D:/wt/read-1124c rev-parse HEAD`: 0.
2. `cat` of `apply-rst-3.log` and `report-rst-pairs-3-arch.md`: 0. The output was persisted, and I read it with the Read tool.
3. `cat` of `report-rst-formgate-arch-2.md`: 0. `cat` of `report-rst-formgate-rev-2.md`: 0.
4. `node -e` re-derivation of attempt 3 from attempt 2 and the 23 fences (counts, overlaps, rebuild, sha256): 0.
5. `git diff --no-index -U1` of attempts 2 and 3, piped to `sha256sum`, then to `grep -c '^@@'`: git exit 1 (the files differ), hash equal to the briefed diff, 18 hunks.
6. `cat -n | sed -n` of attempt 3, in three ranges: 0.
7. `git -C D:/wt/read-1124c` (all exit 0):
   - `rev-parse` of HEAD, origin/main, main and the three heads;
   - `log -1` of origin/main;
   - `diff --name-only cdfebef1 origin/main`, and `diff --name-only 4b17d9da origin/main`;
   - `ls-tree` and `cat-file -e` of the three ruling files on origin/main;
   - `log --diff-filter=A`;
   - `merge-base --is-ancestor cdfebef1 origin/main`;
   - `show cdfebef1:` with `sed` or `grep` of `WorkingCanvas.tsx` (1120-1135, 1350-1395, 1590-1620, 1106-1119, 1835-1856, 1915-1927, 1880-1914, 700-745, 1790-1834, 2140-2215, 2392-2412, 1427-1450, 2069, 2261, greps), `buildLayers.ts`, `matchGroups.ts`, `style.ts`, `limits.ts`, `values.ts`, `residencyArm.ts`, `candidateArmSession.ts` (965-985, 1640-1660), `package-lock.json` (452-454), `recentre-crossing.mjs`, `pan-anchor.mjs` and `lib.mjs`;
   - `git grep` for `MAX_RESIDENT_VERTICES` and for the clear and viewport-context callers;
   - per head: `merge-base`, `diff --stat` of the listed paths, the lockfile and `package.json` diff, `diff --numstat` of `candidateArmSession.ts`, `diff --stat` of App.tsx and WorkingCanvas.tsx, `diff -U0` hunks of WorkingCanvas.tsx, the `limits.ts` diff, the lockfile deck/luma grep and `--name-only` for `renderer/` and `src/attributes/`.
8. `sed` and `grep` under `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/` (`package.json`, `dist/lib/layer-manager.js`, `dist/lib/deck.js`, `dist/lib/attribute/attribute-manager.js`): 0.
9. `node -e` uniqueness count of this report's seven old texts against attempt 3: each 1. Then `grep -c -F ', with the same diff check.'`: 1.

## Files read

- Scratch, `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/`: `rst-form-gate-3.txt`, `rst-form-gate-2.txt` (by script), `rst-form-gate-2-3.diff` (by hash), `apply-rst-3.log`, `report-rst-pairs-3-arch.md`, `report-rst-formgate-arch-2.md`, `report-rst-formgate-rev-2.md`.
- D:/wt/read-1124c @ cdfebef1:
  - `frontends/shell/src/canvas/`: `WorkingCanvas.tsx`, `buildLayers.ts`, `matchGroups.ts` and `limits.ts`;
  - `frontends/shell/src/attributes/values.ts`;
  - `frontends/shell/src/residency/residencyArm.ts` and `candidateArmSession.ts`;
  - `renderer/style-ts/src/style.ts`;
  - `frontends/shell/package-lock.json`;
  - `frontends/shell/e2e/`: `recentre-crossing.mjs`, `pan-anchor.mjs` and `lib.mjs`.
- On origin/main, by `ls-tree` and `cat-file` only: the three ruling files' names under `state/directives/`.
- At the three heads: their diffs against origin/main, as listed above.
- Untracked, read only, as evidence and not Authority: `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/` (`package.json`, `dist/lib/deck.js`, `dist/lib/layer-manager.js`, `dist/lib/attribute/attribute-manager.js`).

Model: Opus 5.5 (claude-opus-5-5).
