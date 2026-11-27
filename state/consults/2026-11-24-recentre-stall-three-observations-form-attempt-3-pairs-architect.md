# recentre-stall-three-observations: the attempt-3 replacement pairs, the architect as the form's author (not a gate)

*Filed by the custodian: node:recentre-stall-three-observations@form-attempt-3-pairs-architect. It is not a gate and gives no verdict. Both attempt-2 form gates failed, giving different words for the added tests and the gap visibility; the architect, as the form's author for this round, was asked for one set of old and new texts meeting every finding of both, with §5.3 carrying ADV-2026-11-24-21. It gives 23 pairs, P1 to P23, and no question. The custodian checked by script that each old text occurs once in attempt 2 (rst-form-gate-2.txt in the scratch folder, 41370 bytes, sha256 5435e39f2d10a06be727a7baad780872a0bfd9ec102ca5ceb00d1915f1de0959) and that no two overlap, and applied them from the end, byte for byte: attempt 3 (48345 bytes, sha256 e9fe8393e75f020ac0c70e27048054ed3f55a93f1d7544822526b1dff64f0c69) is re-derived by this commit's script, and it goes to its two form gates, the architect and the reviewer, which only read, before the custodian commits the form. It ran during no build, in the sitting. Dispatched at 2026-11-24T08:17:35Z; its run: Read 20, Grep 18, Glob 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T08:17:35Z to 2026-11-24T08:27:57Z by its transcript; 3 calls named the main checkout (3 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/core there, as the report discloses, which change nothing); handed back at 2026-11-24T08:27:57Z. 28473 bytes, sha256 c3d297f53b097ec7002eb8ec3d50de77c60f8168abe1d1496c43b39bb0593390, byte for byte, nothing masked, with one final newline added.*


---

Not a gate (attempt-3 replacement pairs) — detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99
Applies to: `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/rst-form-gate-2.txt`. I have no Bash, so I did not recompute that file's sha256 (5435e39f…0959, as briefed).

**Summary.** There are 23 pairs, P1 to P23, in form order, and they meet every finding of both attempt-2 reports. I checked each old text with one Grep over attempt 2: each pattern hit exactly one line, and no two pairs touch the same line. No pair touches the human's wording. Every sentence changed here is the drafting architect's or a gate's. Nothing here is settled by ADV-2026-11-24-18 or -19.

## How I settled the overlaps

- **The T14 row** (architect E1 against reviewer E2) is P12. Old T14 becomes twelve rows, T14 to T25, in the order of §5:
  - the two new pairing terms (double-click; no R-span);
  - the baseline's two branches;
  - O2's three branches;
  - O3's three branches;
  - the two visibility VOIDs.

  The architect's T14, T15 and T16 are kept word for word as T21, T22 and T23. The reviewer's T15 to T19 are merged in where they test a different branch.
- **The kept-gap visibility** (architect E3 against reviewer E3) is P9 and P18. I took:
  - the architect's two edge page times, which O3's "near" rule needs;
  - the reviewer's `visibilitychange` line and his VOID wording, as written.

  I dropped the begin-tick state. Every case it was meant to catch, the ending-tick state or a change line catches (reasoning under P9).
- **O2** is P16: the reviewer's E1 confirm, plus a single closing "Otherwise: neither". That makes O2 cover every case, which it no longer did once the confirm got two extra conditions.

## Pairs

**P1** (my own, for ADV-2026-11-24-21; header, line 5)
```text
The advisor's rulings ADV-2026-11-24-18 and -19 are folded in.
```
```text
The advisor's rulings ADV-2026-11-24-18, -19 and -21 are folded in.
```

**P2** (as written, architect D4)
```text
The custodian adds each cited span's sha256 by script (the cited lines with their LF, at that commit) in the note it puts after the title at commit.
```
```text
The custodian adds each cited span's sha256 by script (the cited lines with their LF, at that commit) in the note it puts after the title at commit, after showing that cdfebef1 is an ancestor of main (round 15, item (e)); that note is the only text the committed form adds to the gated bytes. §0.3's line numbers at 2095a7ac, at PR A's head and at main's numbering are the custodian's facts by git, not pins at cdfebef1, and carry no hash.
```

**P3** (my own, for ADV-2026-11-24-21; §0.1)
```text
- Both rulings are filed on main in the commit after d5232d0f (the custodian's fact). They are not in the tree at cdfebef1, so this form reproduces no text from them.
```
```text
- Both rulings are filed on main in the commit after d5232d0f (the custodian's fact). They are not in the tree at cdfebef1, so this form reproduces no text from them.
- The advisor's ruling ADV-2026-11-24-21: `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-21-recentre-stall-three-observations-a-head-moved-after-the-runs-the-stop-stays-no-run-repeated-before-the-ruling.md`. It rules the form's own question, a held head merged in after the runs that touches the timed path (§5.3). It is cited by item, paraphrased. It is not in the tree at cdfebef1, and the custodian files it on main before committing this form.
```
- The path is the one the session's git status shows staged. I did not read the file; reading it was outside the brief.

**P4** (as written, architect D5)
```text
or the effect that constructs the Deck (§2.2's region);
```
```text
or the effect that constructs the Deck (lines 2069 to 2261 at cdfebef1; §2.2's region follows it);
```
- Check: `useEffect(` is at `WorkingCanvas.tsx:2069` and the effect closes at `:2261`.

**P5** (changed from reviewer E4). Why: `rowGroups` also calls `Style.groupFor` and `unmatchedGroup` in `renderer/style-ts`, which the reviewer's list leaves out. Without them, the claim "what `render()` runs" is still incomplete.
```text
  - `buildLayers.ts`, `offsetFrame.ts`, `highlightLayers.ts`, `pickResolution.ts`, `residentSet.ts` or `tileResidentSet.ts`: what `render()` runs inside the span (`WorkingCanvas.tsx`, lines 1127 to 1129 and 1372 to 1386 at cdfebef1);
```
```text
  - `buildLayers.ts`, `offsetFrame.ts`, `highlightLayers.ts`, `pickResolution.ts`, `residentSet.ts`, `tileResidentSet.ts`, `matchGroups.ts` or `src/attributes/values.ts`, or `checkPickCeiling` in `limits.ts`, or `groupFor` and `unmatchedGroup` in `renderer/style-ts/src/style.ts`: the repository code `render()` runs inside the span, as read at cdfebef1, directly (`WorkingCanvas.tsx`, lines 1127 to 1129 and 1372 to 1386 at cdfebef1) or through `buildLayers.ts` (`rowGroups` at line 113 and `checkPickCeiling` at line 448, at cdfebef1) and `matchGroups.ts` (`readColumn` at line 31 and `unmatchedGroup` and `groupFor` at line 34, at cdfebef1). PR A's head adds `CeilingKind` and `ceilingKindOf` to `limits.ts` and changes no line of `checkPickCeiling`; that is recorded and is not a stop;
```
- Check, part 1 (the direct calls and `buildLayers.ts`):
  - `buildLayers.ts:9-10` imports both functions; `:113` and `:448` are the calls.
  - `matchGroups.ts:5` imports `readColumn`; `:31` calls it and `:34` calls `style.unmatchedGroup()` and `style.groupFor`.
  - `style.ts:89` declares `class Style`; `:184` is `groupFor` and `:193` is `unmatchedGroup`.
  - `limits.ts:113` is `checkPickCeiling`.
- Check, part 2 (the other listed files):
  - `pickResolutionExtentFor` (`pickResolution.ts:173-174`) calls only same-file functions (`:90` and `:137`).
  - `highlightLayers.ts:7` imports from `buildLayers` only, besides deck.
- Check, part 3 (what is listed elsewhere):
  - deck and luma code inside the span is P6's lockfile line.
  - `traceLayerUpdate` is `src/diagnostics/`, already listed.
- The PR A fact about `limits.ts` is the reviewer's by git; I did not re-run it.

**P6** (as written, architect E2, first pair)
```text
  - the tile manager (`src/streaming/tileViewportStreamManager.ts`).
```
```text
  - the tile manager (`src/streaming/tileViewportStreamManager.ts`);
  - the `@deck.gl/*` and `@luma.gl/*` entries of `frontends/shell/package-lock.json` (at cdfebef1, `@deck.gl/core` is 9.3.9, lines 452 to 454).
```
- Check: `package-lock.json:452-454` reads `node_modules/@deck.gl/core`, `"version": "9.3.9"`, then the resolved URL.

**P7** (changed from reviewer D2). Why: the 66/41 counts are the reviewer gate's by git, and §0.3's title otherwise makes every git fact the custodian's.
```text
The held pieces' changes are part of what is observed. The diff above names them, and §5.3 makes them a stop if they reach the path the observations time.
```
```text
The held pieces' changes are part of what is observed. The diff above checks only the code it lists: all three heads also change `src/residency/candidateArmSession.ts` (66 insertions and 41 deletions against main, the reviewer gate's count by git), which owns the tile manager on the default candidate arm (`src/residency/residencyArm.ts`, line 50 at cdfebef1), and `App.tsx`; S0 records those two diffs beside the check. §5.3 makes a change to the listed code by a head merged in after the runs a stop.
```
- Check: `residencyArm.ts:50` sets `DEFAULT_RESIDENCY_ARM` to `"candidate"`, and `candidateArmSession.ts:30` imports `TileViewportStreamManager`.

**P8** (as written, reviewer D1)
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

**P9** (settled: architect E3, first pair, with reviewer E3, first pair; changed from both). Why: it keeps the architect's edge page times and the reviewer's change line, and drops the begin-tick state, which adds no case the other two miss.
```text
  - each kept gap is sent once as a console line at the tick that ends it, with `document.visibilityState`.
```
```text
  - each kept gap is sent once as a console line at the tick that ends it. The line carries the page times of the tick that begins the gap and the tick that ends it, and `document.visibilityState` as the ending tick reads it;
  - each `visibilitychange` event is sent once as a `[stall-obs]` console line, with the new `document.visibilityState` and the handler's `performance.now()`.
```
- How it meets architect E3:
  - Both edges are now page times on the line, which O3's near rule needs.
  - The false kill he names is closed. A page hidden for a long time and then shown leaves a change line inside the gap that ends at the visible tick. A gap between two hidden ticks ends `hidden`.
  - The one case the begin-tick state would add is a gap that starts hidden and ends visible. A change to visible must lie between those two ticks, so P18's change-line clause catches it.
- How it meets reviewer E3: a page hidden and shown again inside one gap leaves change lines inside it.
- The concurrency reasoning:
  - My reading of the HTML standard, not read on WebView2: "update the visibility state" sets the state and fires the event in one synchronous step. So either the ending tick reads `hidden`, or the handler ran before that tick.
  - P18's `ADJACENT_MS` margin after the gap's end covers the other order, in case WebView2 differs.
  - The handler cannot run inside a synchronous block, just as a tick cannot.
- The instrument cost: the handler runs only at a change, and any long gap holding one (or followed by one within `ADJACENT_MS`) is VOID. So its cost never lies in a gap that is read. The state is read only in the ending tick's sending branch, after the gap.
- What the suites see:
  - `visibilityState` does not contain `view-state`, so the suites' filters do not match these lines (`recentre-crossing.mjs:73`, `pan-anchor.mjs:61`).
  - A change line comes from its own task, so it can never fall between a `layers` line and its span line (`WorkingCanvas.tsx:1383` and `:1388`, one synchronous `render()`). §2.3's pairing holds.

**P10** (as written, architect D1, first pair)
```text
Each node mark names its step's type (drag, wheel tick, double-click, fit or seam call):
```
```text
Each node mark names its step's type (open, drag, wheel tick, double-click, fit or seam call):
```

**P11** (as written, architect D3)
```text
and the run report and the closing amendment record that commit and the exit code.
```
```text
and the run report and the closing amendment record that commit and the exit code, which must be 0; any other code stops every reading.
```

**P12** (settled: architect E1 with reviewer E2. T21 to T23 are changed from architect E1's T14 to T16 by renumbering only. The rest are changed from both, or new, as noted below.)
```text
| T14 | a long gap that begins within 100 ms after the end of a kept gap holding an R-span is read as confirming, and one that begins more than 100 ms after it, with no R-span inside, is listed as unexplained | M14: drop the adjacency clause, so that only an R-span inside a gap explains it | T14, on the first gap |
```
```text
| T14 | the R pairing of a double-click whose settled tick re-centres: the first span after its last old-origin `view-state` line, with a later span after its first new-origin line | M14: pair a double-click by the fit rule | T14, on the double-click |
| T15 | a drag and a seam call whose `view-state` lines show no origin change have no R-span, and nothing is read at them | M15: drop the no-origin-change test, so that each step is paired by its type's rule | T15, on an R-span read at the drag |
| T16 | the baseline's minimum: with two non-R spans in the 5% band, O1 is not read at that R-span and that is recorded; with three, it is read | M16: set the minimum to two | T16, on the two-span case |
| T17 | the span after the open's fit `view-state` line is an R-span and stays out of the baseline: with it and two non-R spans in the 5% band, O1 is not read at that R-span | M17: count the open's span in the baseline | T17, read at that R-span |
| T18 | O2 sums the first two windows after an R-span's t1: a first window counting 0 and a second counting the R-span's `layerCount`, with no other `layers` line in that interval and quiet pairs whose median summed count is 0, confirms the trigger | M18: read the first window only | T18, read as a kill |
| T19 | the same pair with another `layers` line before the second window's page time reads neither, with that line's `layerCount` recorded | M19: drop the test for another `layers` line | T19, read as a confirm |
| T20 | O2's control: the same pair as T18, beside five quiet windows counting 0, 1, 0, 1 and 0, reads neither, since each quiet pair sums to one | M20: take the control's median over single windows | T20, read as a confirm |
| T21 | a long gap that begins within 100 ms after the end of a kept gap holding an R-span with `totalPositions` of at least 1,800,000, whose t1 is more than 100 ms before the long gap's start, is read as confirming; a long gap that begins more than 100 ms after such a kept gap, with no R-span inside it or within 100 ms before it, is read as a kill and listed with its nearest step marks | M21: drop O3's kept-gap clause of "near" | T21, on the first gap |
| T22 | a long gap whose start is within 100 ms after the t1 of an R-span that lies in no kept gap, with `totalPositions` of at least 1,800,000, is read as confirming | M22: drop O3's clause "no more than `ADJACENT_MS` before the gap's start" | T22, read as a kill |
| T23 | a long gap near only R-spans with `totalPositions` below 1,800,000 is read as neither, with each near R-span's `totalPositions` recorded | M23: read that case as a kill | T23 |
| T24 | a long gap with no R-span near it, whose line carries a `visibilityState` of `hidden`, gives no O3 reading and is recorded VOID | M24: drop the test of the gap line's own `visibilityState` | T24, read as a kill |
| T25 | two long gaps with no R-span near either, whose lines say `visible`, one with a `visibilitychange` line inside it and one with such a line 50 ms after its end, are each recorded VOID | M25: read the gap line's own `visibilityState` only | T25, each gap read as a kill |
```
- **Where each row comes from:**
  - T14 is new, for architect D1's double-click rule.
  - T15 is new, for architect D6's No R-span term.
  - T16 splits architect T18 and reviewer T18.
  - T17 is the other half of architect T18. It is a separate row because that half had no mutation of its own.
  - T18 is architect T17 with reviewer T15's no-other-line condition and the control.
  - T19 is reviewer T16, with its prediction made exact.
  - T20 is new, for reviewer E1's changed control.
  - T21 to T23 are architect T14 to T16.
  - T24 is architect T19, limited to the ending tick (P9).
  - T25 is reviewer T19, with "no R-span near", so that the prediction is definite, and P18's after-end margin.
- **Each mutation changes only its own branch:**
  - M14: under the fit rule, the double-click pairs with the later span. That span follows the first new-origin line, because the R-span comes from the render at `WorkingCanvas.tsx:2197`, after the old-origin trace at `:2161`.
  - M15: without the test, the drag rule picks a span after the drag's last line, which shows its unchanged origin.
  - M16: two spans are then enough, so O1 is read where it should not be.
  - M17: the open's span makes three in the band, so O1 is read.
  - M18: the first window alone sums to 0, below `layerCount`, so the reading is a kill.
  - M19: without the test, the case reads as a confirm.
  - M20: the single windows have a median of 0, which is less than one, so the reading is a confirm. The overlapping pairs (0,1), (1,0), (0,1) and (1,0) sum to 1 each, so the form reads neither.
  - M21 and M22: each removes the only clause that makes its gap near. T21's t1 is more than 100 ms before the gap, and T22's R-span lies in no kept gap.
  - M23: the case reads as a kill.
  - M24: T25's lines say `visible`, so M24 changes nothing in T25.
  - M25: T24 has no change line, so M25 changes nothing in T24.
- **The deck behaviour behind T18 to T20** (read only, evidence not Authority):
  - deck emits the window before `updateLayers` in the same frame (`deck.js:1019-1031`).
  - `setProps` only queues `_nextLayers` (`layer-manager.js:129-131`). So a second `render()` before deck's next frame replaces the R-span's layers, which is why reviewer E1's neither is right.
  - `updateAttributesCount` is overwritten at `deck.js:1086` with `'Attributes updated'`. `attribute-manager.js:144-145` increments that once per layer update that changed something. So comparing it with `layerCount` is sound at 9.3.9.
- **Where other renders come from:** `reportViewport` at `WorkingCanvas.tsx:2200`, and `render()` at `:1605` and `:1615`.

**P13** (as written, architect D1, second pair)
```text
  - For a drag or a wheel tick:
```
```text
  - For a drag, a wheel tick or a double-click:
```
- Check: a double-click's settled tick comes through `onViewStateChange`. The trace is at `:2161`, `maybeRecenter` at `:2192`, and the render at `:2197`. A transition defers the re-centre to a tick that has none (`:2192`).

**P14** (as written, architect D6)
```text
- **Long gap:** a kept gap of at least `LONG_GAP_MS`.
```
```text
- **No R-span:** a step whose `view-state` lines show no origin change has none (in run D, a seam call to the origin already set).
- **Long gap:** a kept gap of at least `LONG_GAP_MS`.
```

**P15** (my own, for architect D1 and E1). Why: "as one" could be read as "as one of the non-R spans", the opposite of what architect attempt-1 E3 meant. T17 needs the meaning fixed.
```text
counting the span after the open's fit `view-state` line as one,
```
```text
counting the span after the open's fit `view-state` line as an R-span,
```
- Check: the open's fit re-bases (`forceRecenter`, `WorkingCanvas.tsx:1439`) and renders (`:1448`), so it falls within the Terms' own definition of an R-span.

**P16** (changed from reviewer E1). Why: his two added conditions left O2 with no reading when the control fails, so I add an exhaustive "Otherwise: neither". The record of each other line's `layerCount` is kept.
```text
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, while the median single window with no `layers` line in it shows less than one.
- Kills the trigger: the summed count is below `layerCount`.
```
```text
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, no other `layers` line lies between the R-span's `layers` line and the second window's page time, and, over pairs of consecutive windows with no `layers` line in either, the median summed count is less than one.
- Kills the trigger: the summed count is below `layerCount`.
- Otherwise: neither. Where another `layers` line lies in that interval, so that another render's attribute updates may be in the sum, each such line's `layerCount` is recorded.
```
- Check: the same deck lines as P12. The kill still stands: extra updates only raise the sum.

**P17** (changed from reviewer E5). Why: "the suites' own listeners do not read them" is untrue. `attachConsole` keeps every entry (`lib.mjs:381-383`). What is true is that no filter the suites read matches the new lines.
```text
- Each suite's default path with no flag. Recentre-crossing's is shown by M0 (§11). Pan-anchor's is shown only by the code gates' read that every added line sits behind the flag, since no unflagged pan-anchor run is made (OPEN-12). D1 therefore has no perturbation control of its own: its suite result is recorded and not compared.
```
```text
- Each suite's default path with no flag, except that every instrumented build emits the product's span and metrics lines on it (§1); no line filter the suites read matches them (T8). Recentre-crossing's is shown by M0 (§11), which carries those product lines, so M0 against M1 to M3 shows the harness's perturbation only. Pan-anchor's is shown only by the code gates' read that every added harness line sits behind the flag, since no unflagged pan-anchor run is made (OPEN-12). D1 therefore has no perturbation control of its own: its suite result is recorded and not compared.
```
- Check, the filters: the suites read entries only through `renderTrace()` (`lib.mjs:393`, used at `recentre-crossing.mjs:236`) and the `view-state` filters (`recentre-crossing.mjs:73`, `pan-anchor.mjs:61`). `hasFreshRenderTraceMotion` (`lib.mjs:648`) is used only by `regression.mjs` and `residency-harness.mjs`.
- Check, the builds: both run builds are instrumented (`isInstrumentedBuild.ts:31-33`; `.env.measure:10` per both gates).

**P18** (as written, reviewer E3, second pair; it settles architect E3's second pair)
```text
- A kept gap whose line carries a `visibilityState` other than `visible`: VOID for that gap's O3 reading.
```
```text
- A kept gap whose line carries a `visibilityState` other than `visible`, or with a `visibilitychange` line whose page time lies inside it or no more than `ADJACENT_MS` after its end: VOID for that gap's O3 reading. A gap's own line shows the state at its end only; the change line shows a page hidden and shown again inside the gap.
```
- "At its end only" is true under P9.

**P19** (my own, for ADV-2026-11-24-21, items 1, 2 and 4, in the ruling's words where they fit, unquoted and cited by item)
```text
- A held head merged in after the runs touches any function or file §0.3's diff names: the piece stops and returns to the advisor before its record.
```
```text
- A held head merged in after the runs touches any function or file §0.3's diff names: the piece stops before its record and comes to the advisor, and no run is repeated before the advisor rules (ADV-2026-11-24-21, item 1). The custodian sends the advisor the moved head's diff on what §0.3's diff names, the architect's reading of whether that diff can change any of the three observations and which, and what a second series would cost in runs inside the cap of ADV-2026-11-18-01 and -02 (item 2). A held head merged in after the runs that touches none of them is merged in and read narrowly, as ADV-2026-11-24-19 item 4 has it, with no stop (item 4).
```
- The criterion "§0.3's diff names" is the ruling's "the functions the criterion names". After P5 and P6 it covers the lockfile's deck and luma entries and the `render()` call graph.
- I leave out item 3 (how the advisor chooses). It binds the advisor, not the piece.

**P20** (as written, architect E2, second pair)
```text
  - Then the worker reads `@deck.gl/core` 9.3.9's `dist/lib/deck.js`: the metrics code, `_onRenderFrame`, and the stat timers they read.
```
```text
  - Then the worker reads `@deck.gl/core`'s `dist/lib/deck.js` as `npm ci` installs it at B in the piece's own worktree, after showing that B's lockfile pins it at 9.3.9: the metrics code, `_onRenderFrame`, and the stat timers they read.
```

**P21** (as written, architect D2)
```text
- O2 thresholds: 50% and 10%.
```
```text
- O2 thresholds: 50% and 10%, over two windows.
- Baseline: the 5% band, and at least three spans.
- O3 threshold: `totalPositions` of 1,800,000.
```

**P22** (as written, reviewer D3)
```text
is named in the record and those lines are added.
```
```text
is named in the record, and the lines of that output that carry a `+` or `-` in either of their first two columns, its `---` and `+++` header lines excepted, are added.
```

**P23** (my own, for ADV-2026-11-24-21; §12)
```text
| OPEN-12 | (A): M0 and M1 to M3 | ADV-2026-11-24-18, item 5 |
```
```text
| OPEN-12 | (A): M0 and M1 to M3 | ADV-2026-11-24-18, item 5 |
| The form's own question (§5.3) | (a): the stop stays; what goes to the advisor; no stop for a head that does not touch the timed path | ADV-2026-11-24-21, items 1, 2 and 4 |
```

**What the pairs change elsewhere in the form, and what needs no pair:**
- **Test and mutation counts:** the form states none as a number, so no pair is owed. §4 grows from 14 tests and 14 mutations to 25 and 25.
- **§7's ceiling:** P12 adds eleven reader tests and their reader branches, and P9 adds a few harness lines. My estimate, not a measurement, is about 250 to 300 more lines than attempt 2's plan. An overrun of 580 is recorded as class 8 at the count, and §7 is not edited. Scope stays at 13 files: the new tests are in `stallObserverRead.test.mjs`, which is already in Scope.
- **Cross-references:**
  - "(§1)" in P17 still points to §1 after P8.
  - "(T8)" still holds.
  - §8 item 4 covers the new harness lines.
  - §2.4 (a)'s "every `[stall-obs]` line" carries P9's change line.
  - No §-reference changes.
- **T12:** left as written. Its fit side still has no mutation of its own (an architect note, not a finding).

## Findings and the pairs that meet them

| Finding | Pairs |
|---|---|
| Arch E1 | P12 (T16 to T25), P15, P16 |
| Arch E2 | P6, P20 |
| Arch E3 | P9, P18 |
| Arch D1 | P10, P13; tests T14 and T17 in P12 |
| Arch D2 | P21 |
| Arch D3 | P11 |
| Arch D4 | P2 |
| Arch D5 | P4 |
| Arch D6 | P14; test T15 in P12 |
| Rev E1 | P16; tests T18 to T20 in P12 |
| Rev E2 | P12 |
| Rev E3 | P9, P18 |
| Rev E4 | P5 |
| Rev E5 | P17 |
| Rev D1 | P8 |
| Rev D2 | P7 |
| Rev D3 | P22 |
| ADV-2026-11-24-21 | P1, P3, P19, P23 |

## Wording items for the advisor (architect's check 5)

1. Stays: §12's descriptions of OPEN-6 (A), OPEN-7 (A), OPEN-8 and OPEN-12 (A).
2. Stays, and is widened again: §0.3's diff list as what "the functions the criterion names" covers. It now holds the deck and luma lockfile entries (P6), `matchGroups.ts`, `values.ts` and `checkPickCeiling` (P5), and `Style.groupFor` and `unmatchedGroup` in `renderer/style-ts` (P5). A head that changes any of these stops the piece before code.
3. Stays: D1 has no perturbation control (§5.2 after P17; §3).
4. Stays: case 3's observer-only shape.
5. Removed: §5.3's stop for a head merged in after the runs. ADV-2026-11-24-21 rules it (P19).
6. Stays: the product lines are emitted in every instrumented build, now under their own heading (P8) and as §5.2's exception (P17).
7. Stays: the reader's test is run only by hand.
8. Changed: P12 adds eleven tests, not five, which raises the pressure on §7's 580 lines (class 8 at the count).
9. Added: O2 now gives no confirm when another `layers` line falls within the two windows (P16). After a re-base that may be the ordinary case (`reportViewport` at `WorkingCanvas.tsx:2200`; batch renders at `:1605` and `:1615`), so O2 may read neither at most R-spans.

## Question

None. The pairs meet both reports without one.

## Read
- Scratch, read only: `rst-form-gate-2.txt`, `report-rst-formgate-arch-2.md`, `report-rst-formgate-rev-2.md`, and `report-rst-formgate-arch-1.md` (by grep).
- `D:/wt/read-1124c` @ cdfebef1, read only:
  - `frontends/shell/src/diagnostics/watchdog.ts`
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`: lines 1127-1129, 1350-1459, 1595-1616, 2064-2089, 2150-2219 and 2250-2265
  - `src/canvas/` imports, by grep: `buildLayers.ts`, `matchGroups.ts`, `limits.ts`, `pickResolution.ts`
  - `src/residency/residencyArm.ts` and `candidateArmSession.ts` (grep)
  - `src/isInstrumentedBuild.ts`
  - `renderer/style-ts/src/style.ts` (grep)
  - `frontends/shell/e2e/lib.mjs`: lines 360-400 and 630-654
  - `frontends/shell/e2e/recentre-crossing.mjs`: lines 60-139 and greps
  - `frontends/shell/e2e/pan-anchor.mjs`: lines 50-129
  - `frontends/shell/package-lock.json`: lines 450-455
- deck 9.3.9, untracked, read only, as evidence and not Authority, at `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/`:
  - `dist/lib/deck.js`: lines 1005-1094
  - `dist/lib/layer-manager.js`: lines 120-134
  - `dist/lib/attribute/attribute-manager.js`: lines 90-154

Model: Opus 5.5 (claude-opus-5-5).
