# recentre-stall-three-observations: the attempt-4 replacement pairs, the architect as the form's author (not a gate)

*Filed by the custodian: node:recentre-stall-three-observations@form-attempt-4-pairs-architect. It is not a gate and gives no verdict. Both attempt-3 form gates failed (rows 904 and 905); the architect, as the form's author for this round, was asked for one set of old and new texts meeting every finding of both. While it ran, the custodian sent it the advisor's ADV-2026-11-24-22 byte for byte (filed by this commit at `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-22-recentre-stall-three-observations-the-ceiling-from-the-line-plan-a-head-moved-before-the-runs-merged-in-and-read-narrowly.md`), with what it changed in the brief: section 7's ceiling set from a line plan, and the pair for the reviewer's O-1 and the architect's D9 carrying the ruling's item 2 (msg-arch-p4-22.txt in the scratch folder, 4167 bytes, sha256 cc6804f42ff269b8ee98bf66b2fec24e661b27a77c90f3a15f235a913c6cfa16, sent at 2026-11-24T09:19:17Z). It gives 18 pairs, P1 to P18, a line plan of 930 lines with the ceiling at 1,020, and no question. Applied by script, P17's old text was only the first sentence of attempt 3's line 345, so the rest of that line, the counting rule, came to end the plan's last sub-bullet; the custodian asked it for P17 again with the whole line as its old text (msg-arch-p4-p17.txt, 993 bytes, sha256 2e370f2dd2c6150c7f0b3dcfb6a9e8af068e140f710c7dd3d0f321cb4ec8a4d1, sent at 2026-11-24T09:28:04Z), and its second hand-back gives that pair, filed below the first report. The custodian checked by script that each old text, P17's from the correction, occurs once in attempt 3 (rst-form-gate-3.txt in the scratch folder, 48345 bytes, sha256 e9fe8393e75f020ac0c70e27048054ed3f55a93f1d7544822526b1dff64f0c69) and that no two overlap, and applied them from the end, byte for byte: attempt 4 (53669 bytes, sha256 e7b93c631330134348bcb0b6476e20e403a26f9c97fe544057f58c3f08161399) is re-derived by this commit's script, and it goes to its two form gates, the architect and the reviewer, which only read and read narrowly (the ruling's item 5), before the custodian commits the form. It ran during no build, in the sitting. Dispatched at 2026-11-24T09:16:33Z with its brief byte for byte; its run: Read 19, Grep 11, SubagentHandback 2, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T09:16:33Z to 2026-11-24T09:28:29Z by its transcript; 13 calls named the main checkout (12 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/core there, as the report discloses; 1 Read of the manifest of deck's untracked installed layers package, frontends/shell/node_modules/@deck.gl/layers/package.json, there, read only and inside the deck folder its brief names, which change nothing); handed back at 2026-11-24T09:26:25Z and, after the correction, at 2026-11-24T09:28:29Z. The first report: 30151 bytes, sha256 47f362c78cb5c14d6e165a7483033566e9257563f241c619fe4bcc1218f3f56f, byte for byte, nothing masked, with one final newline added. The second: 3098 bytes, sha256 7051d2fd198ad5952246c3492ecacf232e743996abc81d32fe8694ff233bf050, byte for byte, nothing masked, with one final newline added.*


---

Not a gate (attempt-4 replacement pairs): detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99
Applies to: `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/rst-form-gate-3.txt`. I have no Bash, so I did not recompute its sha256 (e9fe8393…0c69, as briefed).

**Summary.**
- There are 18 pairs, P1 to P18, in form order. Together they meet every finding of both attempt-3 reports, including architect D9 and reviewer O-1.
- They also carry ADV-2026-11-24-22 as your change asks: §7's ceiling now comes from a line plan (P17), the moved-head sentence uses the ruling's item 2 (P4), and the ruling is folded into the header, §0.1 and §12 (P1, P2, P18).
- I checked every old text with Grep over attempt 3. Each one hits exactly one line, and no two pairs share a line.
- No pair touches the human's wording, and nothing that -18, -19 or -21 settles is changed. Every sentence changed here is the drafting architect's or a gate's.
- Line plan: the total is 930, so the ceiling is set at 1,020. That is under 1,000, so the form does not need to go to the advisor for its size. The three files that ship in the app keep their attempt-2 figures.

## How the overlaps are settled

- **O2 (P14).**
  - **Interval start: the reviewer's.** The architect's start, the last metrics line before t1, misses a render whose `layers` line falls between the frame before that emission and the emission itself. deck processes that render at the emission frame, after the reset (`deck.js:1019-1021` before `:1031`), so its updates land in the first window.
  - **Kill: the reviewer's least `layerCount`.** This makes the architect's D6 note unnecessary, and the reason is now in the interval bullet.
  - **Control: the architect's D4 phrase** ("each window with the next"). §7 Values uses the same phrase (P16).
  - **Empty control: neither,** from reviewer E1.
- **New rows after T25 (P12).** T26 tests the interval start, T27 the kill, and T28 the empty control.
  - T26 is changed from both gates. Its other line sits between the second-last and the last metrics line before t1, the one band where the two gates' starts differ. M26 therefore starts the interval at the last metrics line, and that also catches a start at the R-span's own line.
  - T27 is changed from reviewer E1. It fixes the split between the two windows, so that M18's extra failures are exact.
  - T28 is new: the "no pair for the control" reading needs its own test (architect D1's rule).
- **T15 (P7).** The reviewer's D1 words, as written. They settle architect D2, which asks for the same span.
- **"with the same diff check" (P4).** Neither gate's stop is used. ADV-2026-11-24-22 item 2 rules this case, and P4 carries it in the place O-1 names.
  - Architect D9's stretch from S0's diff to code: the stop before code already applies there, and P4 now says so.
- **Lockfile entries (P3 with P15).** §0.3 lists the full runtime closure of the two deck packages and of Arrow, read from the lockfile. §5.3 points to that list rather than repeating it, so the two cannot disagree.
- **T19 (P9).** This pair is my own. It places T19's line after the R-span's, gives that line a `layerCount` of at least one, and gives T19 T18's quiet pairs. Without those quiet pairs, M19 would read neither instead of a confirm, and M19 would survive.

## Pairs

**P1** (my own, for ADV-2026-11-24-22; header)
```text
ADV-2026-11-24-18, -19 and -21 are folded in.
```
```text
ADV-2026-11-24-18, -19, -21 and -22 are folded in.
```

**P2** (as written, architect D7, then a new bullet of my own for ADV-2026-11-24-22; §0.1)
```text
It is not in the tree at cdfebef1, and the custodian files it on main before committing this form.
```
```text
It is not in the tree at cdfebef1; it is filed on main (the custodian's fact).
- The advisor's ruling ADV-2026-11-24-22, given to the custodian on 2026-11-24. It sets §7's ceiling from the line plan before commit (item 1), rules a head that moves after code and before the runs (§0.3, item 2), and reads the timed path of ADV-2026-11-24-21 as §0.3's list as the gates widened it (item 3). It is cited by item, paraphrased. It is not in the tree at cdfebef1; it is filed on main (the custodian's fact).
```
- I was given no file path for -22, so the bullet names none (see the custodian notes).

**P3** (changed from architect E2). Why: by the lockfile, the closure also holds `@mapbox/tiny-sdf` (a dependency of `@deck.gl/layers`) and Arrow's own `flatbuffers`, `json-with-bigint` and `tslib`. The `@types/*` packages hold no runtime code.
```text
  - the `@deck.gl/*` and `@luma.gl/*` entries of `frontends/shell/package-lock.json` (at cdfebef1, `@deck.gl/core` is 9.3.9, lines 452 to 454).
```
```text
  - the entries of `frontends/shell/package-lock.json` for `@deck.gl/*`, `@luma.gl/*`, `@math.gl/*`, `@probe.gl/*`, `@loaders.gl/*`, `@mapbox/tiny-sdf`, `earcut`, `gl-matrix`, `mjolnir.js`, `apache-arrow`, `flatbuffers`, `json-with-bigint` and `tslib` (at cdfebef1, `@deck.gl/core` is 9.3.9, lines 452 to 454). These are the runtime dependencies, direct and through one another, of `@deck.gl/core` and `@deck.gl/layers` (their `package.json`, lines 42 to 58 and 39 to 48, read as evidence and package-relative, and each entry's `dependencies` list in that lockfile at cdfebef1), and of the Arrow library `src/attributes/values.ts` imports (line 4 at cdfebef1). The `@types/*` packages they also list carry no code that runs and are not listed.
```
- Check, the two deck packages: `@deck.gl/core/package.json:42-58` and `@deck.gl/layers/package.json:39-48` list them (`layers` also lists `@mapbox/tiny-sdf` at :43). The lockfile at cdfebef1 agrees at :457-472 and :481-490.
- Check, what those depend on, by the lockfile at cdfebef1:
  - the luma packages need only `@math.gl`, `@probe.gl` and `@types` (:1067-1073, :1080-1085, :1096-1099, :1109-1112);
  - the loaders packages need `@loaders.gl`, `@probe.gl`, `@math.gl/types`, `apache-arrow` and `@types/geojson` (:996-1001, :1009-1011, :1021-1026, :1033-1036, :1043-1048);
  - `apache-arrow` needs `flatbuffers`, `json-with-bigint`, `tslib` and `@types/node` (:2335-2340);
  - the `@math.gl` and `@probe.gl` packages need only their own families (:1128-1130, :1137-1139, :1158-1160, :1203-1205);
  - `earcut`, `gl-matrix`, `mjolnir.js`, `@mapbox/tiny-sdf`, `flatbuffers`, `json-with-bigint` and `tslib` have none (:2586-2591, :2855-2860, :3394-3399, :1117-1122, :2758-2763, :3037-3042, :3838-3843).
- Check, Arrow in the shell: `values.ts:4` imports `apache-arrow`.
- `@deck.gl/core` and `@deck.gl/layers` are the only `@deck.gl` entries in the lockfile.
- The reviewer gate should run the widened list against the three heads by git. The reviewer's attempt-3 fact is that the heads change only fast-check and pure-rand in the lockfile, and neither is on this list.

**P4** (changed from reviewer O-1 and architect D9, as your change asks). Why: ADV-2026-11-24-22 item 2 replaces both gates' proposed stop. The sentence "Before code" keeps D9's stretch from S0's diff to code under the existing stop.
```text
, with the same diff check.
```
```text
, with the same diff check. Before code, a moved head that touches any of them stops the piece as above. A head that moves after code and before the runs is merged in; if it touches anything that diff names, the reviewer reads narrowly that the instrument still sits where this form places it, and the runs are then made on that base. It stops the piece and comes to the advisor only if that read finds that the instrument's place or what it times has changed (ADV-2026-11-24-22, item 2).
```
- Check: no code is involved. "As above" means the stop before code in §0.3, the sentence just before. After the runs, §5.3 governs.

**P5** (changed from architect D1). Why: T26 to T28 change M18's list.
```text
4. reverting it.
```
```text
4. reverting it.

The predicted failure names the test each mutation is aimed at. A mutation that also fails another test passing through its branch (M16 also fails T17; M18 also fails T19, T20, T26, T27 and T28; M19 also fails T26) has each failure recorded by name, and that is no departure from the prediction.
```
- **M16** makes two spans enough, so T17 (as worded in P8) reads O1.
- **M18** reads the first window only, so each of T19, T20 and T26 to T28 sums to 0.
  - That is below the least `layerCount` in each of them, because P9, P12 and T18 give every count in those fixtures a value of at least one.
  - So each reads a kill, where neither is expected.
- **M19** drops the other-line test:
  - T26 then reads a confirm (its sum equals the R-span's `layerCount` and its control passes);
  - T27 stays neither (its sum is below the R-span's count and not below the least);
  - T28 holds no other line.
- **M26, M27 and M28** fail only their own tests:
  - M26: T19's and T27's other lines come after the R-span.
  - M27: T19's and T26's sums equal the R-span's `layerCount`.
  - M28: every other O2 fixture has control pairs.

**P6** (as written, architect D5, second pair)
```text
| T14 | the R pairing of a double-click whose settled tick re-centres:
```
```text
| T14 | the R pairing of a double-click step that holds an origin change, which deck 9.3.9 does not produce (§5 Terms):
```

**P7** (as written, reviewer D1; it settles architect D2)
```text
| T15 | a drag and a seam call whose `view-state` lines show no origin change have no R-span, and nothing is read at them | M15: drop the no-origin-change test, so that each step is paired by its type's rule | T15, on an R-span read at the drag |
```
```text
| T15 | a drag and a seam call whose `view-state` lines show no origin change have no R-span, and nothing is read at them; the drag's last `view-state` line is followed by a batch render's span | M15: drop the no-origin-change test, so that each step is paired by its type's rule | T15, on an R-span read at the drag |
```

**P8** (as written, reviewer D2)
```text
| T17 | the span after the open's fit `view-state` line is an R-span and stays out of the baseline: with it and two non-R spans in the 5% band, O1 is not read at that R-span | M17: count the open's span in the baseline | T17, read at that R-span |
```
```text
| T17 | the span after the open's fit `view-state` line is an R-span and stays out of the baseline: with it and two non-R spans in the 5% band of a drag's R-span, O1 is not read at the drag's R-span | M17: count the open's span in the baseline | T17, read at the drag's R-span |
```

**P9** (my own, for architect D1 and reviewer E1). Why: this makes T19's predictions exact under P14's new interval, M18 and M19.
```text
| T19 | the same pair with another `layers` line before the second window's page time
```
```text
| T19 | the same pair and quiet pairs as T18, with another `layers` line with a `layerCount` of at least one after the R-span's and before the second window's page time,
```
- The row's text after the old span, "reads neither, with that line's `layerCount` recorded | M19 … |", is unchanged.

**P10** (as written, architect D4, second pair)
```text
beside five quiet windows counting 0, 1, 0, 1 and 0, reads neither, since each quiet pair sums to one
```
```text
beside five quiet windows before the R-span counting 0, 1, 0, 1 and 0, reads neither, since each of their four pairs sums to one
```
- Check under P14's control:
  - The pairs (Q1,Q2), (Q2,Q3), (Q3,Q4) and (Q4,Q5) sum to 1 each, so the median is 1 and the reading is neither.
  - The pair (Q5, first window) is excluded, because that window holds the R-span's line.
  - Under M20, the single free windows give [0,1,0,1,0] plus the second window's count n of at least 1. The median is 0.5, which is below 1, so the reading is a confirm.

**P11** (as written, architect D3)
```text
whose line carries a `visibilityState` of `hidden`, gives no O3 reading
```
```text
whose line carries a `visibilityState` of `hidden`, with no `visibilitychange` line inside it or within 100 ms after its end, gives no O3 reading
```

**P12** (settled: reviewer E1 and architect E1. T26 and T27 are changed from reviewer E1, T26 also from architect E1, and T28 is new.)
```text
| T25 | two long gaps with no R-span near either, whose lines say `visible`, one with a `visibilitychange` line inside it and one with such a line 50 ms after its end, are each recorded VOID | M25: read the gap line's own `visibilityState` only | T25, each gap read as a kill |
```
```text
| T25 | two long gaps with no R-span near either, whose lines say `visible`, one with a `visibilitychange` line inside it and one with such a line 50 ms after its end, are each recorded VOID | M25: read the gap line's own `visibilityState` only | T25, each gap read as a kill |
| T26 | the same pair and quiet pairs as T18, with another `layers` line with a `layerCount` of at least one after the second-last metrics line before the R-span's t1 and before the last one, reads neither, with that line's `layerCount` recorded | M26: start the interval at the last metrics line before the R-span's t1 | T26, read as a confirm |
| T27 | O2 with another `layers` line after the R-span's and before the second window's page time, whose `layerCount` is at least one and below the R-span's, a first window counting 0 and a second counting that `layerCount`, and T18's quiet pairs, reads neither | M27: compare the kill with the R-span's `layerCount` only | T27, read as a kill |
| T28 | the same pair as T18, with no other `layers` line in the interval, in a run where every pair of consecutive windows holds a `layers` line, reads neither | M28: read the control as passed when it has no pair | T28, read as a confirm |
```
- **T26.**
  - Correct reading: the other line is in the interval, so there is no confirm. The sum is n_R, which is at least the least count, so there is no kill. The reading is neither.
  - Under M26 the line falls outside the interval, and the control passes, so T26 reads a confirm.
- **T27.**
  - Correct reading: the sum is n_o, which is below n_R, so there is no confirm. It is not below the least, min(n_o, n_R) = n_o, so there is no kill. The reading is neither.
  - Under M27 the sum is below n_R, so T27 reads a kill.
- **T28.**
  - The fixture can be built: the window two before the first window holds a line before the interval. The window just before the first window is free. The first window holds the R-span's line, and there is no window after the second. So no free pair exists.
  - Correct reading: the control is empty, so the reading is neither.
  - Under M28 the control counts as passed, so T28 reads a confirm.

**P13** (as written, architect D5, first pair)
```text
That line is traced before `maybeRecenter` in the same callback (`WorkingCanvas.tsx`, lines 2161, 2192 and 2197 at cdfebef1).
```
```text
That line is traced before `maybeRecenter` in the same callback (`WorkingCanvas.tsx`, lines 2161, 2192 and 2197 at cdfebef1). At deck 9.3.9 every tick of a double-click starts or lies inside the controller's 300 ms transition, so no double-click tick re-centres (lines 2150 to 2152 and 2192 at cdfebef1; deck's `dist/controllers/controller.js`, line 538, `dist/controllers/orthographic-controller.js`, lines 316 to 319, and `dist/controllers/transition-manager.js`, lines 136 to 146, package-relative). A re-centre that is due comes at the next tick with neither, which is a later step's, and belongs to that step. The double-click rule covers a deck that behaves otherwise.
```
- Check:
  - `controller.js:538` passes `_getTransitionProps` (`:615-621`). That returns `this.transition`, which is 300 ms for the orthographic controller (`orthographic-controller.js:316-319`).
  - `WorkingCanvas.tsx:2152` detects that a tick starts a transition, and `:2150` that a tick lies inside one. `:2192` defers the re-centre in both cases.
  - At the transition's end, `transition-manager.js:136-146` sets only the interaction state, with no view-state tick.

**P14** (settled: reviewer E1, architect E1, D4 and D6; changed from reviewer E1). Why: the control's wording is the architect's D4 phrase, so that the control is read the same way here and in §7 Values. Everything else is the reviewer's words.
```text
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, no other `layers` line lies between the R-span's `layers` line and the second window's page time, and, over pairs of consecutive windows with no `layers` line in either, the median summed count is less than one.
- Kills the trigger: the summed count is below `layerCount`.
- Otherwise: neither. Where another `layers` line lies in that interval, so that another render's attribute updates may be in the sum, each such line's `layerCount` is recorded.
```
```text
- **The interval** runs from the second-last metrics line before the R-span's t1 (or the run's start) to the second window's page time. deck resets its counts when it emits a window, before that frame's layer update, so the first window can hold the updates of layers set just before the last metrics line before t1; and a later render before deck's next frame replaces the R-span's layers (S0 records the lines).
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, no other `layers` line lies in the interval, and, over every pair of consecutive windows (each window with the next) with no `layers` line in either, the median summed count is less than one.
- Kills the trigger: the summed count is below the least `layerCount` of the R-span's `layers` line and every other `layers` line in the interval.
- Otherwise: neither, including a run with no pair for the control. Where another `layers` line lies in the interval, so that another render's attribute updates may be in the sum or may stand in for the R-span's, each such line's `layerCount` is recorded.
```
Clause check (deck is evidence, package-relative, 9.3.9):
- **The window is emitted, then the layers are updated.**
  - `_onRenderFrame` is the animation loop's `onRender` (`deck.js:784`).
  - Every 60th call, it reads the metrics, resets, and emits (`:1019-1021`, `:1024-1025`), and only then calls `updateLayers` (`:1031`).
  - `:1031` is the only `updateLayers()` call in `deck.js`.
- **The interval start is sound.**
  - A `layers` line before the second-last metrics line was written before that frame's callback, because one thread cannot interleave the two. Its layers are therefore processed at that frame or earlier.
  - That puts its updates, at the latest, in the window just before the first window.
  - A line between the second-last and the last metrics line can be processed at the last one's frame, after the reset, and so counted in the first window. That is the case T26 covers.
- **Replacement.**
  - `Deck.setProps` passes the layers to `layerManager.setProps` (`deck.js:369`).
  - That only sets `_nextLayers` (`layer-manager.js:129-131`), and `updateLayers` takes the latest set (`:156`).
- **The count.** `Attributes updated` is incremented once per layer update that changed something (`attribute-manager.js:144-145`), and `updateAttributesCount` reads it (`deck.js:1086`).
- **The kill against the least count.** If the trigger is true, the set that deck processes with the new origin is the R-span's or a later one in the interval. Either way the sum is at least that set's `layerCount`, and so at least the least count. Earlier sets only add to it.
- **What `layerCount` counts.** It is `layers.length` (`WorkingCanvas.tsx:1383`). deck also receives the highlight layers (`:1378`), and those can only add.
- **Spillover into the control.**
  - The R-span's second window holds its updates only when the frame after t1 emits. Paired with a free next window, it raises that pair's sum.
  - That errs toward neither, never toward a false confirm. I take it as the architect's attempt-3 note: not a finding.
- **Each reading has a test:** the start (T26, M26), the confirm's other line (T19, M19), the kill (T27, M27), the empty control (T28, M28), and pairs taken each window with the next (T20, M20).
- **How it meets each finding.**
  - Architect E1 and reviewer E1: the false confirm before t1 (the start) and the false kill (the least count).
  - Architect D4: the pairs are taken each window with the next.
  - Architect D6: the exception is covered by the least count rather than noted.
  - Reviewer E1's empty control: neither.

**P15** (changed from reviewer D3). Why: it points to §0.3's list rather than naming deck and luma, so that it agrees with P3.
```text
- A held head merged in after the runs touches any function or file §0.3's diff names:
```
```text
- A held head merged in after the runs touches anything §0.3's diff names (a function, a file, or a lockfile entry it lists):
```

**P16** (changed from reviewer D4). Why: the same control phrase as P14.
```text
- O2 thresholds: 50% and 10%, over two windows.
```
```text
- O2 thresholds: 50% and 10%, over two windows; the control's median summed count below 1, over every pair of consecutive windows (each window with the next) with no `layers` line in either.
```

**P17** (my own, for ADV-2026-11-24-22 item 1; it meets architect D8 in place of D8's words). Why: with the ceiling set from the plan, D8's sentence that an overrun is expected would be untrue.
```text
- At most 13 files and 580 changed lines, this form exempt.
```
```text
- At most 13 files and 1,020 changed lines, this form exempt. The ceiling is the line plan's total, 930, with a margin under a tenth of it (ADV-2026-11-24-22, item 1). The plan is the drafting architect's estimate, comments counted, not a measurement; by Scope file:
  - shipped in the app: `watchdog.ts` 20, `stallTrace.ts` 50, `WorkingCanvas.tsx` 18;
  - their tests: `watchdog.test.ts` 55, `stallTrace.test.ts` 45, `WorkingCanvas.stallObservation.test.tsx` 70;
  - the harness: `stallObserver.mjs` 132, `recentre-crossing.mjs` 32, `pan-anchor.mjs` 22, `checkDistClean.mjs` 4, `e2e/README.md` 7;
  - the reader and its test: `stallObserverRead.mjs` 250, `stallObserverRead.test.mjs` 225.
```
- Check: 88 + 170 + 197 + 475 = 930, and 930 × 1.1 = 1,023, so 1,020 is within the margin. Scope is 13 files (6 new and 7 changed), unchanged. The next bullet ("An overrun is recorded as class 8, and §7 is never edited.") stays.

**P18** (my own, for ADV-2026-11-24-22; §12)
```text
| The form's own question (§5.3) | (a): the stop stays; what goes to the advisor; no stop for a head that does not touch the timed path | ADV-2026-11-24-21, items 1, 2 and 4 |
```
```text
| The form's own question (§5.3) | (a): the stop stays; what goes to the advisor; no stop for a head that does not touch the timed path | ADV-2026-11-24-21, items 1, 2 and 4 |
| §7's ceiling; a head that moves after code and before the runs; the timed path of §5.3 | the ceiling from the line plan, with a margin under a tenth; such a head merged in and read narrowly, a stop only if the instrument's place or what it times has changed; the timed path is §0.3's list as the gates widened it | ADV-2026-11-24-22, items 1 to 3 |
```

**What the pairs leave true elsewhere.**
- §12's closing line, "Nothing is left open except S0's amendment", still holds.
- §2.4's "with §7's constants" now takes in the control's constant (P16).
- T18's "that interval" now means P14's interval.
- §5.3's later "touches none of them" now refers to P15's list.
- §10's "each metrics window around an R-span" covers P14's records.
- No §-reference moves, and the form gains no line cite into itself.
- §4 grows to 28 tests and 28 mutations. The form states no count, so no count needs correcting.

## Line plan (ADV-2026-11-24-22 item 1)

| Scope file | Attempt 4 | Attempt 2, my estimate | Ships |
|---|---|---|---|
| `src/diagnostics/watchdog.ts` | 20 | 20 | yes |
| `src/diagnostics/stallTrace.ts` | 50 | 50 | yes |
| `src/canvas/WorkingCanvas.tsx` | 18 | 18 | yes |
| `src/diagnostics/watchdog.test.ts` | 55 | 55 | no |
| `src/diagnostics/stallTrace.test.ts` | 45 | 45 | no |
| `src/canvas/WorkingCanvas.stallObservation.test.tsx` | 70 | 70 | no |
| `e2e/stallObserver.mjs` | 132 | 120 | no |
| `e2e/recentre-crossing.mjs` | 32 | 32 | no |
| `e2e/pan-anchor.mjs` | 22 | 22 | no |
| `e2e/checkDistClean.mjs` | 4 | 4 | no |
| `e2e/README.md` | 7 | 7 | no |
| `e2e/stallObserverRead.mjs` | 250 | 90 | no |
| `e2e/stallObserverRead.test.mjs` | 225 | 45 | no |
| **Total** | **930** | **578** | |

- **Shipped files.** None rises above my estimate of attempt 2. No pair in attempt 3 or attempt 4 changes §2.1 or §2.2's code.
- **The growth.** Of the 352 added lines, 340 are in the reader and its tests (T14 to T28 and their branches). The other 12 are in `stallObserver.mjs`, for attempt-3 P9's gap edges and its `visibilitychange` line. That file is harness and does not ship (see custodian note 2).
- **The 1,000-line check.** The total is 930, under 1,000, so no view on reading fewer cases is owed. If the advisor wants room, O3's near rule and the T21 to T23 branches are the reader's largest single block.

## Findings and the pairs that meet them

| Finding | Pairs |
|---|---|
| Arch E1 | P14; P12 (T26); P9; P5 |
| Arch E2 | P3; P15 |
| Arch D1 | P5; P9 and P12 (exact fixtures) |
| Arch D2 | P7 |
| Arch D3 | P11 |
| Arch D4 | P14 and P16 (the pairs); P10 (T20) |
| Arch D5 | P13; P6 |
| Arch D6 | P14 (the least-count kill) |
| Arch D7 | P2 |
| Arch D8 | P17 (the ceiling set from the plan, by ADV-2026-11-24-22 item 1, in place of D8's words) |
| Arch D9 | P4 |
| Rev E1 | P14; P12 (T26 to T28); P9 |
| Rev D1 | P7 |
| Rev D2 | P8 |
| Rev D3 | P15 |
| Rev D4 | P16 |
| Rev O-1 | P4 (by ADV-2026-11-24-22 item 2) |
| ADV-2026-11-24-22 | P1, P2, P4, P17, P18 |

## Wording items for the advisor (ADV-2026-11-24-18 item 10; architect 1 to 11 and reviewer 1 to 9, merged)

1. **Stays:** §12's descriptions of OPEN-6 (A), OPEN-7 (A), OPEN-8 and OPEN-12 (A). Added: the -21 row (attempt 3) and the -22 row (P18).
2. **Widened again:** §0.3's diff list.
   - It now holds:
     - P5's files of attempt 3;
     - `candidateArmSession.ts` and `App.tsx`, recorded but not stops;
     - the lockfile closure in P3: the deck, luma, math.gl, probe.gl and loaders.gl families, `@mapbox/tiny-sdf`, `earcut`, `gl-matrix`, `mjolnir.js`, `apache-arrow`, `flatbuffers`, `json-with-bigint` and `tslib`.
   - ADV-2026-11-24-22 item 3 reads the timed path as this list, but the advisor has not read the list's words.
   - A hit stops the piece before code.
3. **Stays:** D1 has no perturbation control (§5.2).
4. **Stays:** case 3's observer-only shape.
5. **Changed, not removed:** §5.3's stop.
   - Its reading of the timed path is confirmed by -22 item 3.
   - Its wording is now "anything §0.3's diff names (a function, a file, or a lockfile entry it lists)" (P15).
   - The custodian sends the item-2 material.
6. **Stays:** the product lines are emitted in every instrumented build.
7. **Stays:** the reader's test is run only by hand.
8. **Ruled, and now worded:** §7's ceiling is 1,020, from a plan of 930 (P17).
   - The gates check the figures.
   - The shipped files' figures equal my estimate of attempt 2's.
9. **Corrected:** O2.
   - It reads neither wherever another render's `layers` line falls in its interval, which now starts at the second-last metrics line before t1. That is likely at case 2's wheel tick, at case 3 and through run D. Case 1 can still confirm or kill.
   - The kill compares with the least `layerCount`, and an empty control reads neither.
   - Corrected render sources on the default candidate arm, at cdfebef1:
     - auto-fit at `WorkingCanvas.tsx:1819` (`fitToExtent`, which renders at `:1448`; the reviewer's `:1822` is a blank line);
     - the coalesced schedule at `:1833`;
     - `clearTile` at `:1847`;
     - `clearAllTiles` at `:1853`;
     - eviction at `:1925`;
     - the re-centre's own render at `:2197`.
   - `:1605` and `:1615` belong to the baseline arm.
10. **Ruled, and now worded:** a head that moves after code and before the runs. P4 is -22 item 2 in the form's words; the advisor has not read P4.
11. **For the custodian to compare with its message:** attempt-3 P7's addition that S0 records the `candidateArmSession.ts` and `App.tsx` diffs.
12. **Added by these pairs:** P2 cites -22 by item, without a file path.

## Question

None for the advisor: the pairs meet both reports without one.

Custodian notes:
1. **P2's -22 bullet** says the ruling is filed on main and gives no path; I was given none. Before commit, confirm it is filed. If a path is wanted, give one, and a gate reads that one clause.
2. **`stallObserver.mjs` +12.** -22 item 1's heading puts the growth in the reader and its tests, and binds only shipped files to attempt 2. This harness file grows 12 lines for attempt-3 P9 and does not ship. I read that as within the ruling; whether the advisor hears of it is yours to decide.

## Read

- **Scratch, `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/`:** `rst-form-gate-3.txt`, `report-rst-formgate-arch-3.md`, `report-rst-formgate-rev-3.md`, `report-rst-pairs-3-arch.md`.
- **D:/wt/read-1124c @ cdfebef1:**
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`: 1370-1391, 1600-1616, 1818-1857, 1918-1926 and 2140-2209;
  - `frontends/shell/src/diagnostics/watchdog.ts`;
  - `frontends/shell/src/attributes/values.ts` (imports);
  - `frontends/shell/package-lock.json` (greps of the deck closure's entries).
- **Untracked, read only, as evidence and not Authority, under `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/`:**
  - `core/dist/lib/deck.js`: 1000-1094, plus greps;
  - `core/dist/lib/layer-manager.js`: 115-159;
  - `core/dist/lib/attribute/attribute-manager.js`: 95-154;
  - `core/dist/controllers/controller.js`: 520-544, plus a grep;
  - `core/dist/controllers/orthographic-controller.js`: 300-327;
  - `core/dist/controllers/transition-manager.js`: 90-149;
  - `core/package.json`;
  - `layers/package.json`.

Model: Opus 5.5 (claude-opus-5-5).

---

*The second hand-back, the P17 correction:*

Here is P17 again. Its old text is now the whole of attempt 3's line 345, and the counting rule is a top-level bullet of its own, placed before the line plan.

**P17** (my own, for ADV-2026-11-24-22 item 1; it meets architect D8 in place of D8's words). With the ceiling set from the plan, D8's sentence that an overrun is expected would be untrue.
```text
- At most 13 files and 580 changed lines, this form exempt. Lines are insertions plus deletions, comments counted, in the piece's own commits only. The count is the sum of `git log --no-merges --numstat HEAD --not B <every parent but the first of each merge commit in B..HEAD> -- <Scope paths>`, so nothing a merge brings in is counted, whether a held head or main. Merge commits are not counted, except that a merge whose combined diff in a Scope path is not empty (`git show --cc <merge> -- <Scope paths>`) is named in the record, and the lines of that output that carry a `+` or `-` in either of their first two columns, its `---` and `+++` header lines excepted, are added.
```
```text
- At most 13 files and 1,020 changed lines, this form exempt. The ceiling is the line plan's total, 930, with a margin under a tenth of it (ADV-2026-11-24-22, item 1).
- Lines are insertions plus deletions, comments counted, in the piece's own commits only. The count is the sum of `git log --no-merges --numstat HEAD --not B <every parent but the first of each merge commit in B..HEAD> -- <Scope paths>`, so nothing a merge brings in is counted, whether a held head or main. Merge commits are not counted, except that a merge whose combined diff in a Scope path is not empty (`git show --cc <merge> -- <Scope paths>`) is named in the record, and the lines of that output that carry a `+` or `-` in either of their first two columns, its `---` and `+++` header lines excepted, are added.
- The line plan is the drafting architect's estimate, comments counted, not a measurement; by Scope file:
  - shipped in the app: `watchdog.ts` 20, `stallTrace.ts` 50, `WorkingCanvas.tsx` 18;
  - their tests: `watchdog.test.ts` 55, `stallTrace.test.ts` 45, `WorkingCanvas.stallObservation.test.tsx` 70;
  - the harness: `stallObserver.mjs` 132, `recentre-crossing.mjs` 32, `pan-anchor.mjs` 22, `checkDistClean.mjs` 4, `e2e/README.md` 7;
  - the reader and its test: `stallObserverRead.mjs` 250, `stallObserverRead.test.mjs` 225.
```
- The figures still add up: 88 + 170 + 197 + 475 = 930. With the margin, the most allowed is 1,023, so 1,020 fits. Scope stays at 13 files.
- The next line of attempt 3 ("- An overrun is recorded as class 8, and §7 is never edited.") is untouched and still follows the line plan.
- The old text is copied from line 345 as I read it with the Read tool. I have no Bash, so I did not check its bytes by script.

What changed from my first P17: the old text is now the whole of line 345, not just its first sentence. The counting rule is carried over word for word as its own bullet, outside the line plan's sub-bullets. "The plan is …" now opens the plan's own bullet as "The line plan is …".

Model: Opus 5.5 (claude-opus-5-5).
