Reviewed: the stall form's draft text between its marks, rst-form-gate-2.txt in the scratch folder (41370 bytes, sha256 5435e39f2d10a06be727a7baad780872a0bfd9ec102ca5ceb00d1915f1de0959), with the read checkout D:/wt/read-1124c at cdfebef1eecdda586cd7c9aca41941447b453a99, read only (the custodian's filing note, 2026-11-24: the architect's form gate of the full form, attempt 2, before the form is committed, node:recentre-stall-three-observations@form-gate-architect-2, under ADV-2026-11-24-18 item 2; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T08:03:30Z; its run: Read 22, Grep 15, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T08:03:59Z to 2026-11-24T08:14:39Z by its transcript; 4 calls named the main checkout (3 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/core there, as the report discloses; one Grep of its state folder for a commit id, read only, which timed out after 20 seconds and returned nothing, as the report discloses, which change nothing); handed back once, at 2026-11-24T08:14:39Z. Filed below the rule, 19140 bytes, sha256 c5a0acc405bbbe7a4ca6a953399b0c4dd95bf88043c39cefcfb8c5e90ec2bffb, byte for byte, nothing masked, with one final newline added.)

---

Verdict: FAIL — detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99
Reviewed: rst-form-gate-2.txt sha256 5435e39f2d10a06be727a7baad780872a0bfd9ec102ca5ceb00d1915f1de0959, with D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

I did not recompute the scratch files' hashes, because I have no Bash. I read the diff and the apply log against both texts. They agree: every attempt-1 replacement is in attempt 2 as the log states.

Every attempt-1 finding is met in its words (table below). The form fails on three Evidence findings, all in the new words:
- the readings the gates added have no test whose mutation fails them;
- nothing shows that B pins the deck version S0 reads;
- the new visibility invalidator samples only one tick of each gap.

None of the sentences below is the human's wording. All are the drafting architect's or the attempt-1 gates' words, so the worker applies the replacements with no re-gate and the PR body lists them (AUTONOMY §31). E1 changes what the reader is tested for, so whether the form is re-gated is the custodian's call, or the advisor's.

Disclosure: deck was read as evidence, read-only, at `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/` (untracked, version 9.3.9 at its `package.json:6`). By mistake, I also started one grep of the main checkout's `state/` for "cdfebef1". It timed out and returned nothing, so nothing from it is used here.

## Findings

**E1, Evidence, §4 (the reader's tests) against §5.1, §5 Terms and §5.3.** The gates' new readings are decidable by a mechanical reader, but none has a test whose mutation fails it:
- O2's two-window sum;
- O3's first adjacency clause ("t1 … no more than `ADJACENT_MS` before the gap's start");
- O3's "otherwise" reading;
- the baseline's minimum of three spans;
- the kept-gap visibility VOID.

T14 also fails to isolate O3's kept-gap clause. If the fixture's t1 lies within 100 ms of the long gap's start, the first clause also explains the gap, so a mutation that drops only the kept-gap clause passes T14. M14's "the adjacency clause" is ambiguous now that "near" has two adjacency clauses. §8 item 10 makes every reading the reader's, so an untested branch is an unproven reading.

```text
| T14 | a long gap that begins within 100 ms after the end of a kept gap holding an R-span is read as confirming, and one that begins more than 100 ms after it, with no R-span inside, is listed as unexplained | M14: drop the adjacency clause, so that only an R-span inside a gap explains it | T14, on the first gap |
```
```text
| T14 | a long gap that begins within 100 ms after the end of a kept gap holding an R-span with `totalPositions` of at least 1,800,000, whose t1 is more than 100 ms before the long gap's start, is read as confirming; a long gap that begins more than 100 ms after such a kept gap, with no R-span inside it or within 100 ms before it, is read as a kill and listed with its nearest step marks | M14: drop O3's kept-gap clause of "near" | T14, on the first gap |
| T15 | a long gap whose start is within 100 ms after the t1 of an R-span that lies in no kept gap, with `totalPositions` of at least 1,800,000, is read as confirming | M15: drop O3's clause "no more than `ADJACENT_MS` before the gap's start" | T15, read as a kill |
| T16 | a long gap near only R-spans with `totalPositions` below 1,800,000 is read as neither, with each near R-span's `totalPositions` recorded | M16: read that case as a kill | T16 |
| T17 | O2: an R-span whose first following metrics window has an `updateAttributesCount` of 0, and whose second window has the R-span's `layerCount`, confirms the trigger | M17: read only the first window | T17, read as a kill |
| T18 | the baseline: with two non-R spans in the 5% band, O1 is not read at that R-span and that is recorded; with three, it is read; the span after the open's fit `view-state` line is not counted in the band | M18: set the minimum to two | T18, on the first R-span |
| T19 | a long gap with no R-span near it, whose kept-gap line carries a `visibilityState` other than `visible` for the tick that begins it or the tick that ends it, gives no O3 reading and is recorded VOID | M19: drop the visibility test | T19, read as a kill |
```
Clause check:
- Each mutation removes exactly the branch its test isolates.
- Each predicted failure follows from §5.1's three-way readings, which are exhaustive: some near R-span is at least 1.8M, none is near, or only R-spans below 1.8M are near.
- T18 relies on the `open` mark of D1.
- T19 relies on E3's words.
- Five more tests add lines. An overrun of §7's 580 is class 8, and §7 is not edited.

**E2, Evidence, §0.3 (the diff before code) and §7 S0.** S0 reads deck 9.3.9, and §5.4 and §2.2's seam rule rest on that read. The only version evidence is the lockfile at cdfebef1 (`frontends/shell/package-lock.json`, lines 452 to 454, version 9.3.9). Attempt 1's reviewer found that all three heads change `package.json` and `package-lock.json`. Nothing shows that B pins the deck the runs will load, so an S0 read in another checkout's `node_modules` could be a read of an interface the run does not have.
```text
  - the tile manager (`src/streaming/tileViewportStreamManager.ts`).
```
```text
  - the tile manager (`src/streaming/tileViewportStreamManager.ts`);
  - the `@deck.gl/*` and `@luma.gl/*` entries of `frontends/shell/package-lock.json` (at cdfebef1, `@deck.gl/core` is 9.3.9, lines 452 to 454).
```
```text
  - Then the worker reads `@deck.gl/core` 9.3.9's `dist/lib/deck.js`: the metrics code, `_onRenderFrame`, and the stat timers they read.
```
```text
  - Then the worker reads `@deck.gl/core`'s `dist/lib/deck.js` as `npm ci` installs it at B in the piece's own worktree, after showing that B's lockfile pins it at 9.3.9: the metrics code, `_onRenderFrame`, and the stat timers they read.
```
Clause check: the lock lines are as cited. The `_onMetrics` call site is at `dist/lib/deck.js:1019-1026`, and the metrics fields are at `:1074-1086`, at 9.3.9.

**E3, Evidence, §2.3 (the gaps) and §5.3 (the kept-gap invalidator).** The new invalidator reads `visibilityState` only at the tick that ends a gap.

My reading of Chromium's documented throttling of timers on hidden pages, which I have not read on WebView2: after a long hidden period, timers wake only about once a minute. The gap that ends when the page returns to view therefore ends on a visible tick, and it can exceed `LONG_GAP_MS`. That is the false kill attempt 1's E7 named, and the new words do not close it.

O3's new "near" rule also needs both gap edges as page times, and §2.3 does not say the gap line carries them.
```text
  - each kept gap is sent once as a console line at the tick that ends it, with `document.visibilityState`.
```
```text
  - each kept gap is sent once as a console line at the tick that ends it. The line carries the page times of the tick that begins the gap and the tick that ends it, and `document.visibilityState` as each of those two ticks read it.
```
```text
- A kept gap whose line carries a `visibilityState` other than `visible`: VOID for that gap's O3 reading.
```
```text
- A kept gap whose line carries a `visibilityState` other than `visible`, for the tick that begins it or the tick that ends it: VOID for that gap's O3 reading.
```
Clause check:
- A tick cannot run inside a synchronous block, so both edges are ticks that did run.
- Reading the state each tick is inside the tick body, so it is inside the tick cost that control (b) times.

**D1, Documentation, §2.4 (a) against §5 Terms.**
- The new mark types include "double-click", but the Terms give it no R-span rule. Case 2 (i) predicts no origin change there, yet the reader still needs a rule if one occurs. Double-click goes through `onViewStateChange` (`WorkingCanvas.tsx`, lines 2161, 2192 and 2197), so the drag rule applies.
- The baseline excludes "the span after the open's fit `view-state` line", but no mark names the open.
```text
Each node mark names its step's type (drag, wheel tick, double-click, fit or seam call):
```
```text
Each node mark names its step's type (open, drag, wheel tick, double-click, fit or seam call):
```
```text
  - For a drag or a wheel tick:
```
```text
  - For a drag, a wheel tick or a double-click:
```

**D2, Documentation, §7 Values.** §2.4 says the reader computes "with §7's constants". These constants are missing from §7: the gates' new two windows and minimum of three, and the older 5% band and 1,800,000.
```text
- O2 thresholds: 50% and 10%.
```
```text
- O2 thresholds: 50% and 10%, over two windows.
- Baseline: the 5% band, and at least three spans.
- O3 threshold: `totalPositions` of 1,800,000.
```

**D3, Documentation, §4 (the reader's proof by hand).** It records the exit code but never says which code passes.
```text
and the run report and the closing amendment record that commit and the exit code.
```
```text
and the run report and the closing amendment record that commit and the exit code, which must be 0; any other code stops every reading.
```

**D4, Documentation, header (the pin rule).**
- "Every line cite … at cdfebef1" is not true of §0.3's cites at 2095a7ac, at PR A's head and at main's numbering. Those are the custodian's facts by git at other commits, and round 15 (e) forbids a hash at a branch commit.
- The note added at commit is the only text by which the committed form differs from the gated bytes. Neither point is stated.
```text
The custodian adds each cited span's sha256 by script (the cited lines with their LF, at that commit) in the note it puts after the title at commit.
```
```text
The custodian adds each cited span's sha256 by script (the cited lines with their LF, at that commit) in the note it puts after the title at commit, after showing that cdfebef1 is an ancestor of main (round 15, item (e)); that note is the only text the committed form adds to the gated bytes. §0.3's line numbers at 2095a7ac, at PR A's head and at main's numbering are the custodian's facts by git, not pins at cdfebef1, and carry no hash.
```

**D5, Documentation, §0.3's diff list.** The words make the Deck-construct effect "§2.2's region", but the region follows that effect (§2.2). At cdfebef1 the effect is lines 2069 to 2261.
```text
or the effect that constructs the Deck (§2.2's region);
```
```text
or the effect that constructs the Deck (lines 2069 to 2261 at cdfebef1; §2.2's region follows it);
```

## Concurrency (check 3)

- **§2.1's rewritten `end` is sound.**
  - The order is: the gate and the phase test, then t1, then take-and-delete, then the emission. So an emission that throws leaves no entry open, and outside the test `end` is byte-for-byte as now (`watchdog.ts:34-36`).
  - The three writers are as stated, and none can run inside the synchronous `render()`:
    - `begin` at `WorkingCanvas.tsx:1361`, its only call site (grep);
    - the reset at `watchdog.ts:51`, which runs under the `setInterval` at `:58`;
    - `__resetForTests` at `:69`, which has test callers only.
  - A re-entry would lose the outer span. It would not corrupt t0. The code gates confirm there is none.
  - This agrees with §6 and with T1 and T3.
- **§2.4 (a)'s one ordered queue holds §2.3's pairing.**
  - The `layers` line (`:1383`) and the span line (`end` in the `finally` at `:1388`) come from one task, nothing logs between them, and CDP delivers them in order. Enqueuing at receipt fixes their order, whatever the `jsonValue()` latency. That latency is the defect `pan-anchor.mjs:102-104` records for its own unqueued listener (`:60-63`).
  - Node marks can fall between those two records, because node's event loop runs between two CDP messages. §2.3's "next console line" skips marks, as it must. The reader should say so in its code.
- **The step types hold as long as each step's lines arrive before node makes the next step's mark.**
  - Fits, seam calls and case 3 are page evaluates, which return after the synchronous handler that traces and renders (`:1439-1448`, `:2404-2410`).
  - For a drag, the old-origin line and the R-span are both in the settled tick's callback (`:2161`, `:2192`, `:2197`), before the input returns.
  - A settle by quietness (`recentre-crossing.mjs:131`) can end during a later block in deck's frame, but that block emits no `view-state` line.
  - Note for the code gates: assign an origin change to the step that holds its last old-origin line, as `recentre-crossing.mjs:273-275` does. Never assign it by settle marks.

## Check 1: each attempt-1 finding

| Finding | Met by attempt 2 | Note |
|---|---|---|
| Arch E1 (O3 near, otherwise) | yes | decidable; untested (E1) |
| Arch E2 (O2 two windows, timer coverage) | yes | `deck.js:1019-1031` confirms the window comes before `updateLayers`; untested (E1) |
| Arch E3 (baseline) | yes | the open needs a mark (D1); the minimum is untested (E1) |
| Arch E4 (run D causal) | yes | both places |
| Arch E5 (pan-anchor default path, §3) | yes | |
| Arch E6 (diff list) | yes | plus the lockfile (E2) |
| Arch E7 (visibility; §5.3 header) | header yes; visibility in part | E3 |
| Arch E8 (sink order) | yes | see Concurrency |
| Arch D1, first pair (§2.1) | yes | |
| Arch D1, second pair (§6) | yes, by Rev E3's words | |
| Arch D2 (pins) | yes in substance | branch-commit cites (D4) |
| Arch D3 (D1 timeout) | yes | `pan-anchor.mjs:102-109` holds |
| Rev E1 (reader's proof) | yes | exit code (D3) |
| Rev E2 (T12, T14) | T12 yes; T14 in part | E1 |
| Rev E3 (§6 magnitude) | yes | |
| Rev D1 (README) | yes | no "pan-anchor" in README at cdfebef1 (grep count 0); lines 858 to 868 as cited |
| Rev D2 (lines, head ids) | yes | custodian's facts by git; not re-run by me |
| Rev D3 (counting rule) | yes | it excludes everything any merge brings in; `--cc` counts conflict resolutions |
| Rev D4 (§2.1 item 1) | yes, by Arch D1's words | |
| Rev D5 (M3, M5, M8) | yes | |
| Rev D6 (regression lines) | yes | `regression.mjs:579-590` includes `btn.click()` at 588 |
| Rev D7 (directive path) | yes | the quote matches line 10 byte for byte, as a sub-line span |
| Rev D8 (disclosure) | yes | true: `isInstrumentedBuild.ts:31-33`; both call sites are gated |

The two overlaps:
- **Arch D1 meets Rev D4: yes.** The first statement is now the gate and phase test, t1 is read inside it, and `end` is unchanged outside it. That matches §6.
- **Rev E3's words meet Arch D1's second pair: yes.** They drop the magnitude claim and make none in its place.

Other checks of the new words:
- §7's counting rule is consistent with the ceilings, and §0.3 is consistent with ADV-2026-11-24-19 items 2 to 4.
- The cites in the new words hold at cdfebef1:
  - `WorkingCanvas.tsx`: 1127-1129, 1361, 1372-1386, 1439, 1448, 2161, 2192, 2197, 2404-2410;
  - `watchdog.ts`: 51, 58, 69;
  - the stall report, line 241;
  - `package.json`, line 17;
  - `product-ci-shell.yml`, line 216;
  - `regression.mjs`, lines 579 to 590;
  - `pan-anchor.mjs`, lines 102 to 109;
  - `README.md`, lines 858 to 868;
  - the 2026-11-16 directive, line 10.
- No CI workflow runs an `e2e/*.test.mjs` file (grep).

## Check 5: the rulings

No new word contradicts ADV-2026-11-24-18 or -19.

Wording that is the advisor's to rule (-18 item 10). The custodian sends it after the gates:
1. §12's descriptions of OPEN-6 (A), OPEN-7 (A), OPEN-8 and OPEN-12 (A). The rulings give letters or "as you recommend".
2. §0.3's diff list as what "the functions the criterion names" covers. It is widened by attempt 1's E6 and by E2 above.
3. §5.2 and §3: D1 has no perturbation control, and its result is recorded with no comparison.
4. Case 3's observer-only shape (§2.4 (c)).
5. §5.3's stop for a head merged in after the runs.
6. §1's disclosure that every instrumented build emits the lines, flag or no flag, in place of a runtime switch.
7. The reader's test run only by hand, because §7 forbids a `package.json` change. The precedent is the four `e2e/*.test.mjs` scripts inside `verify` (`package.json`, lines 17 and 48 to 51).
8. E1's five added tests and their pressure on §7's 580-line ceiling.

## Outside the changes (Documentation)

**D6, §5 Terms.**
- In run D, a seam call to an origin already set has no origin change. Examples are the setCams to (E_C, N_C) after the −1 drags, which do not re-centre (`pan-anchor.mjs:237-239`, `:241`, `:273`). The fit rule then finds no new-origin line.
- O1 says "re-centring … seam calls", but the Terms say nothing about such a step.
```text
- **Long gap:** a kept gap of at least `LONG_GAP_MS`.
```
```text
- **No R-span:** a step whose `view-state` lines show no origin change has none (in run D, a seam call to the origin already set).
- **Long gap:** a kept gap of at least `LONG_GAP_MS`.
```

Notes, not findings:
- **T12's fit side.** It is in T12's data, but no mutation exercises it. M12 mutates only the drag rule.
- **The instruments' share in §6.** It sums the emit costs carried by the lines inside a gap. Each carried cost is the previous line's, so it is off by one line at each edge of the gap. It is recorded only.
- **Existing tests.** In vitest, `isInstrumentedBuild()` is true, so the new effect calls `setProps({ _onMetrics })` on the existing fakes. Both fakes merge props, and their asserts filter on `layers` or on `[render-trace]` lines (`WorkingCanvas.wiring.test.tsx:44-45, 70, 334`; `WorkingCanvas.recentre.test.tsx:64-69, 140`). I expect no breakage. The code gates should confirm it.

## Files read

Scratch, `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/`:
- `rst-form-gate-2.txt`
- `rst-form-gate-1-2.diff`
- `apply-rst-2.log`
- `report-rst-formgate-arch-1.md`
- `report-rst-formgate-rev-1.md`

D:/wt/read-1124c @ cdfebef1:
- `frontends/shell/src/diagnostics/watchdog.ts`
- `frontends/shell/src/diagnostics/renderTrace.ts`
- `frontends/shell/src/isInstrumentedBuild.ts`
- `frontends/shell/src/canvas/WorkingCanvas.tsx`: lines 1120-1134, 1350-1464, 2080-2264, 2395-2414; greps for `useEffect(` and `layer-construct`
- `frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx`: lines 53-92; greps
- greps of `frontends/shell/src/**/*.test.*`
- `frontends/shell/e2e/recentre-crossing.mjs`
- `frontends/shell/e2e/pan-anchor.mjs`
- `frontends/shell/e2e/regression.mjs`: lines 575-592
- `frontends/shell/e2e/README.md`: lines 855-870; grep
- `frontends/shell/package.json` (grep)
- `frontends/shell/package-lock.json`: lines 450-455
- `.github/workflows/product-ci-shell.yml`: lines 212-217
- `.github/workflows/` (grep)
- `state/consults/2026-11-11-platform-recentre-stall-read-and-profile.md`: lines 180-255
- `state/directives/2026-11-16-the-humans-directive-the-target-is-v0-2-record-keeping-repeated-runs-pieces-the-machine-models-focus-for-a-week.md` (grep, line 10)
- `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`: lines 1-20

Untracked evidence, read only, in `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/`:
- `package.json` (grep)
- `dist/lib/deck.js`: lines 1010-1049; grep

Model: Opus 5.5 (claude-opus-5-5).
