Reviewed: the stall form's draft text, rst-form-gate-3.txt in the scratch folder (48345 bytes, sha256 e9fe8393e75f020ac0c70e27048054ed3f55a93f1d7544822526b1dff64f0c69), made from attempt 2 by the architect's 23 pairs, with the read checkout D:/wt/read-1124c at cdfebef1eecdda586cd7c9aca41941447b453a99, read only (the custodian's filing note, 2026-11-24: the architect's form gate of the full form, attempt 3, before the form is committed, node:recentre-stall-three-observations@form-gate-architect-3, under ADV-2026-11-24-18 item 2; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T08:43:16Z with its brief byte for byte; its run: Read 27, Grep 25, Glob 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T08:43:54Z to 2026-11-24T08:59:09Z by its transcript; 17 calls named the main checkout (16 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/core there, as the report discloses; 1 Grep of the manifest of deck's untracked installed layers package, frontends/shell/node_modules/@deck.gl/layers/package.json, there, read only and outside its brief's deck folder, as the report discloses, which change nothing); it also grepped the scratch folder broadly once for the words run A, and its report says nothing from the other files matched is used; handed back once, at 2026-11-24T08:59:08Z. Filed below the rule, 21876 bytes, sha256 e119d59e5500bf3d1c9256bb9283a79a843ec9608f74b17f615296fd3e49e610, byte for byte, nothing masked, with one final newline added.)

---

Verdict: FAIL — detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99
Reviewed: rst-form-gate-3.txt sha256 e9fe8393e75f020ac0c70e27048054ed3f55a93f1d7544822526b1dff64f0c69, with D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

I have no Bash, so I did not recompute any hash. I read the diff and the apply log against both texts, and they agree: all 23 pairs are in attempt 3 as the log says.

Attempt 3 meets every attempt-2 finding (table under Check 1). The form still fails, on two Evidence findings in the new words:
- **E1.** O2's new interval starts at the R-span's `layers` line. The first window, though, counts everything since the previous window. So a render shortly before the re-centre can still give a false confirm.
- **E2.** The new lockfile stop leaves out deck's own runtime dependencies that run on the timed path. These include O2's timer library and the tessellator.

None of the sentences below is the human's wording. All of them are the drafting architect's words or a gate's. No red-line text is touched. E1 and E2 change what the reader or the stop does, so whether to re-gate is for the custodian or the advisor to route. The worker applies D1 to D9 with no re-gate, and the PR body lists them.

## Findings

**E1, Evidence: §5.1 O2's confirm (pair P16), and §4.**
- The words read "the first two metrics windows whose page times follow an R-span's t1".
- deck resets its stats at each emission (`dist/lib/deck.js`, lines 1019 to 1021, 9.3.9, package-relative, evidence). So the first window counts everything from the previous window's page time, which can be up to 60 frames before t1.
- The new condition, no other `layers` line between the R-span's `layers` line and the second window's page time, therefore misses any render that falls inside the first window before t1.
- An example. A tile push renders at r < t1 inside that window. Its new layers each add one 'Attributes updated' (`dist/lib/attribute/attribute-manager.js`, lines 142 to 146). The sum then reaches `layerCount` even if the re-centre updated nothing, and O2 confirms.
- This is ordinary use. The tile manager's `coalescedRenderRef` and `clearTile` renders (`WorkingCanvas.tsx`, lines 1833 and 1847 at cdfebef1) follow each reportViewport (line 2200). The suite's settle waits mean a render from the previous step can lie less than 1 s before the next R-span.
- The same contamination reaches the summed `updateAttributesTime`.
- The new branch needs a test whose mutation fails it.

```text
no other `layers` line lies between the R-span's `layers` line and the second window's page time
```
```text
no other `layers` line lies inside the two windows, from the page time of the window before the first of them (or the run's start, if there is none) to the second window's page time, since each window counts from the reset at the one before it (S0 records the lines)
```
```text
| T25 | two long gaps with no R-span near either, whose lines say `visible`, one with a `visibilitychange` line inside it and one with such a line 50 ms after its end, are each recorded VOID | M25: read the gap line's own `visibilityState` only | T25, each gap read as a kill |
```
```text
| T25 | two long gaps with no R-span near either, whose lines say `visible`, one with a `visibilitychange` line inside it and one with such a line 50 ms after its end, are each recorded VOID | M25: read the gap line's own `visibilityState` only | T25, each gap read as a kill |
| T26 | the same pair as T18, with another `layers` line inside the first window but before the R-span's `layers` line, reads neither, with that line's `layerCount` recorded | M26: start the interval at the R-span's `layers` line | T26, read as a confirm |
```
Clause check:
- The reset before emission is at `deck.js:1020-1021`, and the emission at `:1024-1025`.
- The per-layer increment is at `attribute-manager.js:144-145`.
- The render call sites are at `WorkingCanvas.tsx:1605, 1615, 1833, 1847, 1853`.
- M26 leaves T19 passing, because T19's line comes after the R-span and is still caught. It makes T26 read as a confirm.
- The words defer to S0, as §0.2 and O2's preamble already do.

**E2, Evidence: §0.3, the diff before code (pair P6), as the criterion of §5.3's stop (P19, ADV-2026-11-24-21 item 1).**
- The lockfile line covers only the `@deck.gl/*` and `@luma.gl/*` entries.
- O2's timers are `@probe.gl/stats` (`dist/lib/deck.js`, line 21).
- Tessellation is `earcut` and `@math.gl/polygon` (`@deck.gl/layers` `package.json`, lines 45 and 48). S0 itself asks whether tessellation falls inside the attribute timer.
- `readColumn` runs `apache-arrow` (`src/attributes/values.ts`, line 4 at cdfebef1).
- All three heads already change `package-lock.json`, and the caret ranges let any npm install on a held branch re-resolve these packages. A head moved after the runs could then change the timed path with no stop, so §5.3 does not carry item 1 for these parts.

```text
  - the `@deck.gl/*` and `@luma.gl/*` entries of `frontends/shell/package-lock.json` (at cdfebef1, `@deck.gl/core` is 9.3.9, lines 452 to 454).
```
```text
  - the entries of `frontends/shell/package-lock.json` for `@deck.gl/*`, `@luma.gl/*`, `@math.gl/*`, `@probe.gl/*`, `@loaders.gl/*`, `earcut`, `gl-matrix`, `mjolnir.js` and `apache-arrow` (at cdfebef1, `@deck.gl/core` is 9.3.9, lines 452 to 454). These are deck's runtime dependencies by the `package.json` of `@deck.gl/core` (lines 42 to 58) and of `@deck.gl/layers` (lines 39 to 48), read as evidence and package-relative, and the Arrow library `src/attributes/values.ts` imports (line 4 at cdfebef1).
```
Clause check: `@deck.gl/core/package.json:42-58` and `@deck.gl/layers/package.json:39-48` list these packages, and `deck.js:21` imports `Stats` from `@probe.gl/stats`. The reviewer should run the widened list against the three heads by git; I could not.

**D1, Documentation: §4, the mutation procedure.** Several mutations also fail tests other than the one their row names:
- M16 also fails T17;
- M18 also fails T19, T20 and T26;
- M19 also fails T26.

The rows predict only one test each, so the record would show "unpredicted" failures.
```text
4. reverting it.
```
```text
4. reverting it.

The predicted failure names the test each mutation is aimed at. A mutation that also fails another test passing through its branch (M16 also fails T17; M18 also fails T19, T20 and T26; M19 also fails T26) has each failure recorded by name, and that is no departure from the prediction.
```
Clause check:
- Under M16, T17's two non-R spans reach a minimum of two, so O1 is read.
- Under M18, the shared pair's first window counts 0, which is below `layerCount`, so each of those tests reads a kill.
- Under M19, T26's line is not tested, so T26 reads a confirm.

**D2, Documentation: §4, T15 (pair P12).** M15's failure needs a span after the drag's last `view-state` line. As worded, a fixture without one passes under M15.
```text
| T15 | a drag and a seam call whose `view-state` lines show no origin change have no R-span, and nothing is read at them |
```
```text
| T15 | a drag and a seam call whose `view-state` lines show no origin change, with a batch render's span after the drag's last `view-state` line, have no R-span, and nothing is read at them |
```

**D3, Documentation: §4, T24 (pair P12).** M24 fails T24 only if T24's gap has no change line. Otherwise P18's change-line clause still makes the gap VOID.
```text
whose line carries a `visibilityState` of `hidden`, gives no O3 reading
```
```text
whose line carries a `visibilityState` of `hidden`, with no `visibilitychange` line inside it or within 100 ms after its end, gives no O3 reading
```

**D4, Documentation: §5.1 O2's control (P16) and §4 T20 (P12).**
- "Pairs of consecutive windows" does not say whether the pairs overlap.
- T20's "each quiet pair sums to one" is true only if the quiet windows are not next to the R-span's second window. If they are, the pair formed by that second window and the first quiet window sums to `layerCount`.
```text
over pairs of consecutive windows with no `layers` line in either
```
```text
over every pair of consecutive windows (each window with the next) with no `layers` line in either
```
```text
beside five quiet windows counting 0, 1, 0, 1 and 0, reads neither, since each quiet pair sums to one
```
```text
beside five quiet windows before the R-span counting 0, 1, 0, 1 and 0, reads neither, since each of their four pairs sums to one
```

**D5, Documentation: §5 Terms (P13) and T14 (P12).** At 9.3.9, a double-click cannot re-centre on its own ticks:
- deck's double-click handler passes the controller's transition (`dist/controllers/controller.js`, line 538), which is 300 ms for the orthographic view (`dist/controllers/orthographic-controller.js`, lines 316 to 319);
- the first tick starts a transition and the later ticks lie inside it, so `WorkingCanvas.tsx` defers the re-centre (lines 2150 to 2152 and 2192 at cdfebef1);
- the transition's end sets the state with no tick (`dist/controllers/transition-manager.js`, lines 136 to 146).

T14 calls its fixture "a double-click whose settled tick re-centres", a sequence the app cannot produce. The rule is defensive and should say so. This is not the imagined-interface failure: the line formats T14 feeds are the real ones, and the branch is a guard, like recentre-crossing's check (i).
```text
That line is traced before `maybeRecenter` in the same callback (`WorkingCanvas.tsx`, lines 2161, 2192 and 2197 at cdfebef1).
```
```text
That line is traced before `maybeRecenter` in the same callback (`WorkingCanvas.tsx`, lines 2161, 2192 and 2197 at cdfebef1). At deck 9.3.9 every tick of a double-click starts or lies inside the controller's 300 ms transition, so no double-click tick re-centres (lines 2150 to 2152 and 2192 at cdfebef1; deck's `dist/controllers/controller.js`, line 538, `dist/controllers/orthographic-controller.js`, lines 316 to 319, and `dist/controllers/transition-manager.js`, lines 136 to 146, package-relative). A re-centre that is due comes at the next tick with neither, which is a later step's, and belongs to that step. The double-click rule covers a deck that behaves otherwise.
```
```text
| T14 | the R pairing of a double-click whose settled tick re-centres:
```
```text
| T14 | the R pairing of a double-click step that holds an origin change, which deck 9.3.9 does not produce (§5 Terms):
```

**D6, Documentation: §5.1 O2's kill (P16).** The author's reason "extra updates only raise the sum" has one exception. A render that comes before deck's next frame replaces the R-span's queued layers (`dist/lib/layer-manager.js`, lines 129 to 131). If that render has fewer layers, the count falls below `layerCount` even though the trigger held. This needs two renders inside one frame, so it does not block; it is named here.
```text
- Kills the trigger: the summed count is below `layerCount`.
```
```text
- Kills the trigger: the summed count is below `layerCount`. A render that comes before deck's next frame and replaces the R-span's queued layers with fewer could also give this; that needs two renders inside one frame, and it is named here, not tested.
```

**D7, Documentation: §0.1 (P3).** ADV-2026-11-24-21 is already on main (the brief says so), so "files it … before committing" is stale.
```text
It is not in the tree at cdfebef1, and the custodian files it on main before committing this form.
```
```text
It is not in the tree at cdfebef1; it is filed on main (the custodian's fact).
```

**D8, Documentation: §7, ceilings.** The author's own estimate (+250 to 300 lines over attempt 2's plan, before T26) and my rough tally of the Scope both land well above 580. That is an estimate, not a measurement. A ceiling the plan is expected to break should say so before commit. Whether to set it again is for the advisor (item 8 below).
```text
- An overrun is recorded as class 8, and §7 is never edited.
```
```text
- An overrun is recorded as class 8, and §7 is never edited. The drafting architect's estimate at attempt 3, not a measurement, puts the reader tests T14 to T25, their reader branches and the visibility lines at about 250 to 300 lines more than attempt 2's plan, and T26 adds to that; an overrun is expected and is recorded as class 8 at the count.
```

## Outside the changes

**D9, Documentation: §0.3, "A head that moves later".** The form says nothing about a hit found after S0's diff and before the runs. §0.3 covers a hit before code, and §5.3 covers one after the runs.
```text
with the same diff check.
```
```text
with the same diff check. A hit found after S0's diff and before the runs stops the piece before the runs and comes to the advisor, as a hit before code does.
```

Notes (not findings):
- **Spillover into the control.** A render's updates land in the window after its `layers` line only when a window is emitted in the very next frame. That is about one frame in sixty, so pairs of "quiet" windows are seldom contaminated.
- **`rowGroups` and `apache-arrow`.** `rowGroups` caches across a re-centre (`matchGroups.ts`, lines 24 to 29), so `apache-arrow` runs inside an R-span only for a new batch. E2 lists it all the same.

## Concurrency (check 3)

- **P9's change line keeps §2.3's pairing.** The `layers` line and the span line come from one synchronous `render()` (`WorkingCanvas.tsx:1383` and `:1388`). A `visibilitychange` handler is a task of its own, so it cannot fall between them, and like a tick it cannot run inside a synchronous block. Under §2.4 (a)'s single queue, its arrival order is its emission order.
- **The order of the state change and the event.** I accept the author's reading as stated: the state is set and the event fires in one step. On that reading, a tick either reads the old state, or runs after the handler. In both cases each hidden period leaves either a `hidden` end state or a change line inside the gap.
- **P18's margin.** The `ADJACENT_MS` margin after the gap's end covers the other order, provided WebView2 dispatches within 100 ms. That is a hedge and errs toward VOID, which is safe. Dropping the begin-tick state loses no case under either order, so the author's reason holds.
- **T8 and the new lines.** The change line's text holds no `view-state` or `[render-trace]`, which are the suites' filters (`recentre-crossing.mjs:73`, `pan-anchor.mjs:61`, `lib.mjs:393`). T8 covers only the product lines; §8 item 4 covers the harness lines.

## The new words in context (check 2)

- **T14 to T25.** Each mutation's predicted failure is reachable once D2 and D3 are applied. The mutations that fail other tests too are listed in D1.
  - M14 makes T14 pair with the later span.
  - M21 and M22 each remove the only clause that makes their gap near.
  - M20 makes T20's single-window median 0 against a pair median of 1.
  - M24 and M25 do not cross.
- **§5's new readings.** Each is decidable by a mechanical reader, with D4 settling the pair overlap and E1 the interval. P9 provides both gap edges, which P18 and O3's near rule need.
- **The author's item 9.** The form has no "run A"; I read the brief's phrase as M1 to M3.
  - O2 can still kill at every R-span.
  - It can confirm only where no other `layers` line lies inside the two windows, and after E1 that interval runs from the window before them.
  - Whether a tile render falls there depends on how the tile manager answers each step's reportViewport, which this read does not settle.
  - So a confirm is reachable but not assured, and the form records each such case as neither, with the other lines' `layerCount`. That is not a finding beyond E1, but the time reading, which needs a confirm, may go unread.
- **§5.3 and §12 against ADV-2026-11-24-21.**
  - P19 carries items 1, 2 and 4, and leaves out item 3, which binds the advisor.
  - P23's row matches.
  - P1 and P3 cite the ruling by item.
  - Nothing contradicts the ruling, except that the criterion is incomplete (E2).
- **§0.3 against the three heads.** The head ids on lines 44 to 46 match the brief's three. Whether any head touches P5's newly listed files (`matchGroups.ts`, `values.ts`, `style.ts`) or E2's lockfile entries is a git fact for the reviewer.
- **§7.** See D8.

## Cites (check 4)

These hold at cdfebef1:
- `WorkingCanvas.tsx`: 1127 to 1129, 1372 to 1386, 1383, 1388, 1439, 1448, 2069 to 2261 (`useEffect(` at 2069, closing at 2261), 2161, 2192 and 2197;
- `buildLayers.ts`: 113 and 448;
- `matchGroups.ts`: 31 and 34;
- `style.ts`: `groupFor` at 184 and `unmatchedGroup` at 193;
- `limits.ts`: `checkPickCeiling` at 113;
- `values.ts` exists;
- `residencyArm.ts`: 50;
- `candidateArmSession.ts`: 30 imports the tile manager;
- `package-lock.json`: 452 to 454;
- `lib.mjs`: 381 to 393.

The reviewer attempt-2 report holds P7's 66/41.

I could not verify P3's directive path: it is not in the checkout, and the brief bars reading main. The custodian checks it by script.

## Check 1: each attempt-2 finding

| Finding | Met | Note |
|---|---|---|
| Arch E1 | yes | T16 to T25; T21 isolates the kept-gap clause; cross-failures are in D1 |
| Arch E2 | yes | P6 and P20; the list is incomplete (E2) |
| Arch E3 | yes | the edge times and the change line; the author's reason for dropping the begin-tick state holds (Concurrency) |
| Arch D1 | yes | P10, P13, T14 and T17; at 9.3.9 the double-click rule is dead (D5) |
| Arch D2 | yes | P21 |
| Arch D3 | yes | P11 |
| Arch D4 | yes | P2 |
| Arch D5 | yes | P4, verified |
| Arch D6 | yes | P14 and T15 (D2) |
| Rev E1 | in part | P16 closes the false confirm after t1 but not before it (E1). The author's reason holds: the reviewer's three bullets left the case of a sum at or above `layerCount`, no other line and a failed control with no reading |
| Rev E2 | yes | T18 to T25 |
| Rev E3 | yes | P18 is the reviewer's text byte for byte; P9's change-line bullet is too |
| Rev E4 | yes | P5's reason holds (`matchGroups.ts:34` calls both `Style` methods); widened again by E2 |
| Rev E5 | yes | P17's reason holds: `attachConsole` keeps every entry (`lib.mjs:381-383`) and only the filters exclude |
| Rev D1 | yes | P8 |
| Rev D2 | yes | P7's reason holds: §0.3's title makes its git facts the custodian's, and the attribution is now right |
| Rev D3 | yes | P22 |

The settled pairs:
- **P9 with P18:** met.
- **P12:** met, subject to D1 to D3 and E1's T26.
- **P16:** the closing "Otherwise" makes O2 cover every case, but the interval is wrong (E1).

## Check 5: wording that is the advisor's to rule (ADV-2026-11-24-18, item 10)

1. Stays: §12's descriptions of OPEN-6 (A), OPEN-7 (A), OPEN-8 and OPEN-12 (A). Added: P23's new row for ADV-2026-11-24-21.
2. Widened again: §0.3's diff list as what "the functions the criterion names" covers. It now holds P5's files, P6's lockfile line and, under E2, deck's runtime dependencies and `apache-arrow`. A hit stops the piece before code.
3. Stays: D1 has no perturbation control (§5.2 after P17).
4. Stays: case 3's observer-only shape.
5. Changed, not removed: §5.3's stop as P19 words it. Two points need confirming, because the ruling was made from the message without the form: P19 equates the ruling's "timed path" with what §0.3's diff names, and the custodian sends the item-2 material.
6. Stays: the product lines are emitted in every instrumented build (P8, P17).
7. Stays: the reader's test is run only by hand.
8. Changed: thirteen new reader tests (T14 to T26) against §7's 580. Whether the ceiling is set again before commit (D8).
9. Narrowed further by E1: O2 confirms only when no other `layers` line lies inside the two windows.
10. Added, outside the changes: a hit after S0's diff and before the runs (D9).
11. For the custodian to compare against its message: P7's addition that S0 records the `candidateArmSession.ts` and `App.tsx` diffs.

## Files read

Scratch, under `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/`:
- `rst-form-gate-3.txt`
- `rst-form-gate-2-3.diff`
- `apply-rst-3.log`
- `report-rst-pairs-3-arch.md`
- `report-rst-formgate-arch-2.md`
- `report-rst-formgate-rev-2.md`
- One broad grep for "run A" also matched other files in the folder. Nothing from those files is used.

D:/wt/read-1124c @ cdfebef1:
- `frontends/shell/src/canvas/WorkingCanvas.tsx`: lines 1125 to 1130, 1340 to 1464, 1590 to 1619, 1825 to 1859 and 2060 to 2269, plus a grep for render calls
- `frontends/shell/src/canvas/buildLayers.ts` (greps)
- `frontends/shell/src/canvas/matchGroups.ts`
- `frontends/shell/src/canvas/limits.ts` (grep)
- `frontends/shell/src/canvas/pickResolution.ts`: lines 1 to 14
- canvas module imports (grep)
- `frontends/shell/src/attributes/values.ts` (glob and grep)
- `renderer/style-ts/src/style.ts`: lines 180 to 197, plus greps
- `frontends/shell/src/residency/residencyArm.ts`: lines 45 to 52
- `frontends/shell/src/residency/candidateArmSession.ts` (greps)
- `frontends/shell/src/App.tsx` (grep)
- `frontends/shell/package-lock.json`: lines 448 to 457
- `frontends/shell/e2e/recentre-crossing.mjs`: lines 1 to 140
- `frontends/shell/e2e/lib.mjs`: lines 372 to 399
- `e2e/pan-anchor.mjs` and `recentre-crossing.mjs` (greps)

Untracked, read only, as evidence and not Authority, under `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/`:
- `core/dist/lib/deck.js`: lines 1005 to 1044, plus a grep
- `core/dist/lib/layer-manager.js`: lines 118 to 157
- `core/dist/lib/attribute/attribute-manager.js`: lines 95 to 152
- `core/dist/controllers/controller.js`: lines 150 to 189, 214 to 239, 528 to 543 and 615 to 632, plus greps
- `core/dist/controllers/orthographic-controller.js`: lines 306 to 325
- `core/dist/controllers/transition-manager.js`: lines 10 to 149
- `core/package.json` (grep)
- `layers/package.json` (grep)

Model: Opus 5.5 (claude-opus-5-5).
