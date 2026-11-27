Reviewed: the stall form's draft text between its marks, rst-form-gate-1.txt in the scratch folder (36348 bytes, sha256 55dbf8bbbe6ed0d6724defa280e9fda756fa17ccf2e15d1342f8e2e229a6f9af), with the read checkout D:/wt/read-1124c at cdfebef1eecdda586cd7c9aca41941447b453a99, read only (the custodian's filing note, 2026-11-24: the architect's form gate of the full form, attempt 1, before the form is committed, node:recentre-stall-three-observations@form-gate-architect-1, under ADV-2026-11-24-18 item 2; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T07:44:48Z; its run: Read 38, Grep 25, Glob 3, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T07:45:09Z to 2026-11-24T07:57:39Z by its transcript; 14 calls named the main checkout (14 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/core there, as the report discloses, which change nothing); handed back once, at 2026-11-24T07:57:38Z. Filed below the rule, 24278 bytes, sha256 04e13781ef3801b0d6d978b53d1bc3e59de6b00a217b51e93874a71ca434fa93, byte for byte, nothing masked, with one final newline added.)

---

Verdict: FAIL
Reviewed: rst-form-gate-1.txt sha256 55dbf8bbbe6ed0d6724defa280e9fda756fa17ccf2e15d1342f8e2e229a6f9af, with D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

The form passes on most points: the rulings are carried, the verbatim quotes match, the release boundary holds, the watchdog's t0 is safe and the cites resolve. It fails on eight Evidence findings, all in readings, the base diff and the sink. Each one has exact replacement words below. None of the sentences is the human's wording: they are the architect's draft. Several replacements change what the harness and the reader will do (E3, E6, E8 and D1), so I read them as outside the no-re-gate path of AUTONOMY §31. Whether the form is re-gated is the custodian's call, or the advisor's.

Disclosure: deck's source is not in the read checkout. I read `@deck.gl/core` 9.3.9 read-only in the main checkout, at `frontends/shell/node_modules/@deck.gl/core/dist/` (untracked; version from its `package.json:6`). It is cited here package-relative with no hash, as the fix's form does at its §0.4 (`governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md:127`). It is evidence, not Authority. Two facts from it matter below:
- `deck.setProps` hands the layers to `layerManager.setProps` (`dist/lib/deck.js:369`), which only queues them (`dist/lib/layer-manager.js:129-132`). deck updates the layers in the next `_onRenderFrame` (`deck.js:1031`), after that frame has already emitted its metrics window (`deck.js:1017-1026`).
- deck sets `updateAttributesCount` twice; the second write, 'Attributes updated', wins (`deck.js:1085-1086`). The attribute timer covers the attribute updaters and their buffer writes (`dist/lib/attribute/attribute-manager.js:101-146`; `attribute.js:110-153`; `data-column.js:303, 312, 338`).

## Findings

**E1, Evidence, §5.1 O3.** The confirm reading misses the shape candidate 1 most predicts at 9.3.9. A re-centre's R-span can end before the long gap opens, because deck's layer update runs in the next frame. If a heartbeat tick runs between the two tasks, and the R-span is under `KEEP_GAP_MS`, the long gap neither holds the R-span nor follows a kept gap that holds it. The kill reading does not fire either, because the R-span is within `ADJACENT_MS`. O3 has no "otherwise" reading, so the committed reader cannot decide such a gap.
```text
**O3, the line against the gaps.**
- Confirms: each long gap either holds an R-span with `totalPositions` of at least 1,800,000, or begins within `ADJACENT_MS` after the end of a kept gap that holds one.
- Kills candidate 1 as a gap's cause: a long gap with no R-span in it and none within `ADJACENT_MS` before it. That gap is listed with its nearest step marks.
```
```text
**O3, the line against the gaps.** Read per long gap. An R-span is near a long gap when its t1 lies inside the gap or no more than `ADJACENT_MS` before the gap's start, or when it lies inside a kept gap that ends no more than `ADJACENT_MS` before the long gap's start. Near is defined this way because deck queues the layers in `setProps` and updates them in its next frame (S0 records the lines), so a re-centre can end its R-span before the gap opens.
- Confirms, for that gap: an R-span with `totalPositions` of at least 1,800,000 is near it.
- Kills candidate 1 as that gap's cause: no R-span is near it. That gap is listed with its nearest step marks.
- Otherwise (only R-spans with `totalPositions` below 1,800,000 are near it): neither, recorded with each near R-span's `totalPositions`.
```
Clause check:
- "queues ... updates them in its next frame": `deck.js:369`, `layer-manager.js:129-132`, `deck.js:1031`.
- The rest are definitions the reader computes from page times, which the JSONL carries (§2.3, §2.4 (a)).

**E2, Evidence, §5.1 O2.** There are two defects.
- (a) The pairing. deck emits a window at the start of `_onRenderFrame`, before that frame's layer update (`deck.js:1017-1031`). When the first frame after `render()` is a metrics frame, the first window after t1 does not hold that render's update, and the reader reads a false kill.
- (b) The time reading. "The multiplier is in deck's attribute CPU work" is a diagnosis the timer cannot support. The timer also spans the buffer writes, so a wait on the GPU process during upload (candidate 2) reads as CPU work. This conflicts with §1 and with ADR-010 rule 7 (`docs/adr/ADR-010-render-frames-origins-boundaries.md:85`).
```text
**O2, the counter.** Read at the first metrics window whose page time follows an R-span's t1.
- Confirms the trigger: the window's `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, while the median window with no `layers` line in it shows less than one.
- Kills the trigger: the count is below `layerCount`.
- When the trigger holds and a long gap ends inside that window, the window's `updateAttributesTime` reads one of three ways:
  - at least 50% of that gap: the multiplier is in deck's attribute CPU work;
  - at most 10%: the multiplier is outside that timer (candidate 2 or 3, or deck work the timer does not cover, as S0 records);
  - between: neither.
```
```text
**O2, the counter.** Read over the first two metrics windows whose page times follow an R-span's t1, their counts and times summed. Two windows are read because deck emits a window at the start of a frame, before that frame's layer update (S0 records the lines), so the first window can close before deck has updated the R-span's layers.
- Confirms the trigger: the summed `updateAttributesCount` (by S0's reading) is at least the R-span's `layerCount`, while the median single window with no `layers` line in it shows less than one.
- Kills the trigger: the summed count is below `layerCount`.
- When the trigger holds and a long gap ends inside those two windows, their summed `updateAttributesTime` reads one of three ways:
  - at least 50% of that gap: the multiplier lies inside deck's attribute timer. That timer covers the attribute updaters and the buffer writes they make (S0 records it), so this supports candidate 1's deck part and does not exclude a wait on the GPU process during those writes;
  - at most 10%: the multiplier lies outside that timer (candidate 2 or 3 away from those writes, or deck work the timer does not cover, as S0 records);
  - between: neither.
```
Clause check:
- Window before the update: `deck.js:1017-1031`.
- The timer covers the updaters and the writes: `attribute-manager.js:101-146`, `attribute.js:110-153`, `data-column.js:303, 312, 338`.
- Which field the count is read from is left to S0's reading, as the form has it.

**E3, Evidence, §5 Terms, the baseline.** "Other spans" lets other R-spans into the baseline: the open's fit, the other re-centres and run D's seam calls are all cache-miss renders. With all resident data loaded, few renders that are not R-spans may reach the 5% band. That can pull the ratio towards 1 and give a false kill. No minimum count is set either.
```text
- **Baseline:** the median of the same run's other spans whose `totalPositions` is within 5% of the R-span's.
```
```text
- **Baseline:** the median of the same run's spans that are not R-spans, counting the span after the open's fit `view-state` line as one, and whose `totalPositions` is within 5% of the R-span's. With fewer than three such spans, O1 is not read at that R-span, and that is recorded.
```
Clause check: the open's fit re-centres and renders (`WorkingCanvas.tsx:1439, 1448`), and `render()` is the only source of span lines (`WorkingCanvas.tsx:1361, 1388`).

**E4, Evidence, §5.1 "A run that matches neither", and §10.** "Tied to the dev build's path" is a causal reading the series cannot support. Run D differs from M1 to M3 in its build and also in its suite: pan-anchor's cases and its DEV-only seam (`e2e/pan-anchor.mjs:99`).
```text
- No long gap in any measure-build run, but long gaps under run D: the stall is tied to the dev build's path, and is not shown on the release-shaped one.
```
```text
- No long gap in any measure-build run, but long gaps under run D: the stall was seen on run D and not on M1 to M3. Run D differs from them both in its build (dev) and in its suite (pan-anchor's cases and its DEV-only seam), and these runs do not separate the two.
```
```text
  - if no long gap appears on the measure build but long gaps appear under run D: a node on what the dev build adds;
```
```text
  - if no long gap appears on the measure build but long gaps appear under run D: a node on what run D adds (the dev build, pan-anchor's cases or its seam);
```

**E5, Evidence, §5.2 and §3.** The claim "each suite's default path ... shown by M0" is false for pan-anchor. M0 runs recentre-crossing only (§11), and OPEN-12 (A) is M0 and M1 to M3. "Pan-anchor runs as at its base" predicts against a run that is not made. D1 has no control for perturbation.
```text
- Each suite's default path with no flag, shown by M0 (§11).
```
```text
- Each suite's default path with no flag. Recentre-crossing's is shown by M0 (§11). Pan-anchor's is shown only by the code gates' read that every added line sits behind the flag, since no unflagged pan-anchor run is made (OPEN-12). D1 therefore has no perturbation control of its own: its suite result is recorded and not compared.
```
```text
admitted; E1's six checks pass (§5.2); pan-anchor runs as at its base
```
```text
admitted; E1's six checks pass (§5.2); pan-anchor's result under D1 is recorded, with no prediction and no comparison
```

**E6, Evidence, §0.3, the diff before code.** The list leaves out code that runs inside the R-span:
- `activeBatches()`, at `WorkingCanvas.tsx:1127-1129`, which reaches `residentSet.ts` and `tileResidentSet.ts`;
- `buildHighlightLayers`, at `:1376`, from `highlightLayers.ts`;
- `pickResolutionExtentFor`, at `:1386`, from `pickResolution.ts`;
- the watchdog, `src/diagnostics/`;
- the Deck-construct effect, which is §2.2's region.

PR A changes the import block at main's lines 41 to 49, and that block includes `highlightLayers` (`WorkingCanvas.tsx:49`). So the gap is live.
```text
- **The diff before code.** Before S0's code, the worker shows by `git diff` that none of the three heads changes, against main:
  - `render()`, `onViewStateChange` or `fitToExtent` in `WorkingCanvas.tsx`;
  - `buildLayers.ts` or `offsetFrame.ts`;
```
```text
- **The diff before code.** Before S0's code, the worker shows by `git diff` that none of the three heads changes, against main:
  - `render()`, `onViewStateChange`, `fitToExtent` or `activeBatches()` in `WorkingCanvas.tsx`, or the effect that constructs the Deck (§2.2's region);
  - `buildLayers.ts`, `offsetFrame.ts`, `highlightLayers.ts`, `pickResolution.ts`, `residentSet.ts` or `tileResidentSet.ts`: what `render()` runs inside the span (`WorkingCanvas.tsx`, lines 1127 to 1129 and 1372 to 1386 at cdfebef1);
  - `src/diagnostics/`;
```

**E7, Evidence and Documentation, §5.3.**
- Evidence: visibility is checked only at the controls. A kept gap during the run carries `visibilityState`, but no rule acts on a value that is not `visible`. A mid-run occlusion can therefore produce long gaps with no block, and those read as kills.
- Documentation: the header says each item stops a reading, but the 1% item stops nothing.
```text
**5.3 Invalidators** (each stops that reading for the run and is recorded by name).
```
```text
**5.3 Invalidators** (each is recorded by name, and each stops the reading it names; the instrument-share item stops nothing).
```
```text
- `visibilityState` is hidden at a control: VOID for O3.
```
```text
- `visibilityState` is hidden at a control: VOID for O3.
- A kept gap whose line carries a `visibilityState` other than `visible`: VOID for that gap's O3 reading.
```

**E8, Evidence, §2.4 (a).** §2.3's pairing ("the next console line") holds on the page: nothing logs between `WorkingCanvas.tsx:1383` and `:1388`, and `pickResolutionExtentFor` logs nothing (`src/canvas/pickResolution.ts:173`). It does not hold in the JSONL unless the sink keeps that order. The spec names an ordered queue only for the lines read by `jsonValue()`; `[stall-obs]` lines are kept "as text", which allows a span line to be written before its `layers` line. Assigning a step type from "the step's node mark" also needs the marks in the same order, and each mark must name its type.
```text
- **(a) The sink.** In node, a sink appends to `e2e/out/stall-<tag>.jsonl` (opened with `wx`, never overwritten):
```
```text
- **(a) The sink.** In node, a sink appends to `e2e/out/stall-<tag>.jsonl` (opened with `wx`, never overwritten). Every record below, console lines and node marks alike, goes through one ordered queue in the order node receives or makes it, and carries its arrival number. §2.3's pairing, and the step each origin change belongs to, are read from that order. Each node mark names its step's type (drag, wheel tick, double-click, fit or seam call):
```

**D1, Documentation, §2.1 and §6.**
- §2.1 item 1 makes t1 `end`'s first statement, but §6 puts the gate and the compare before t1. The two are inconsistent, and an unconditional read would be an ungated call site (§8 item 1).
- "Only `check()`'s reset rewrites `beganAt`" leaves out `begin`, whose one call site for this phase is `WorkingCanvas.tsx:1361`, and leaves out the test reset (`watchdog.ts:69`).
- Emitting before the delete leaves the entry open if the emission throws.

The conclusion holds: `render()` has no re-entry path, and `deck.setProps` calls no app callback (`deck.js:315-376`, `718-734`).
```text
- The change is in `end`, under `isInstrumentedBuild()` and for the phase `layer-construct` only:
  1. Its first statement reads `performance.now()` as t1.
  2. If an entry exists, it emits one span line with that entry's `beganAt` as t0.
  3. It then deletes the entry as now.
- **Why the stored t0 is valid.** Only `check()`'s reset (`watchdog.ts`, line 51 at cdfebef1) rewrites `beganAt`. `check()` runs on a `setInterval` on the same thread (line 58 at cdfebef1), so it cannot run inside the synchronous `render()`. That same fact is why the watchdog cannot see the stall (the stall report, line 241 at cdfebef1). The span line turns the same pair into a measurement taken after the fact.
```
```text
- The change is in `end`. Its first statement tests `isInstrumentedBuild()` and the phase `layer-construct`; outside that test, `end` is as now. Inside it:
  1. it reads `performance.now()` as t1;
  2. it takes the entry, if one exists, and deletes it as now;
  3. if it took an entry, it emits one span line with that entry's `beganAt` as t0.
- **Why the stored t0 is valid.** Three things write the entry, and none can run between `begin` and `end` in one `render()`:
  - `begin("layer-construct")` has one call site, inside `render()` (`WorkingCanvas.tsx`, line 1361 at cdfebef1). `render()` is not re-entered from its own callees, and the code gates confirm it;
  - `check()`'s reset (`watchdog.ts`, line 51 at cdfebef1) runs on a `setInterval` on the same thread (line 58 at cdfebef1), so it cannot run inside the synchronous `render()`. That same fact is why the watchdog cannot see the stall (the stall report, line 241 at cdfebef1);
  - `__resetForTests` (line 69 at cdfebef1) has no product caller.
  The span line turns the same pair into a measurement taken after the fact.
```
```text
  - Added inside the span: the gate's call and one string compare before t1. That is below the timer's resolution, which the control records.
```
```text
  - Added inside the span: the gate's call and one string compare before t1. Their cost is not measured; it is set beside the timer's resolution, which the control records.
```

**D2, Documentation, header line 8.** The verbatim quotes and the line cites carry no span sha256 and no statement of which is authoritative when the tree differs from a pin (round 12, (b); round 14). The precedent is `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md:15`.
```text
*Every line cite in this form is at cdfebef1. The base (§0.3) adds the held pieces' hunks to `WorkingCanvas.tsx`, so its lines move there. §2.2's region and §8 item 12 are therefore named by the code around them, with the cdfebef1 lines given only as a reading aid.*
```
```text
*Every line cite in this form is a historical pin at cdfebef1eecdda586cd7c9aca41941447b453a99. The custodian adds each cited span's sha256 by script (the cited lines with their LF, at that commit) in the note it puts after the title at commit. Where the tree at B differs from a pin, the pin is authoritative for what was read. For where the piece's code goes, the code named by its neighbours is authoritative (§2.2's region and §8 item 12), because the base adds the held pieces' hunks to `WorkingCanvas.tsx` and its lines move there.*
```

**D3, Documentation, §11.** D1 is not stated as running under a hard timeout. Pan-anchor's `setCam` wait has no bound of its own and asks for one (`e2e/pan-anchor.mjs:102-109`).
```text
  - D1: one pan-anchor run with `--stall-observe` on the dev build.
```
```text
  - D1: one pan-anchor run with `--stall-observe` on the dev build, under a hard timeout (its `setCam` wait has no bound of its own, `pan-anchor.mjs` lines 102 to 109 at cdfebef1).
```

## Notes (no class)
- **The seam.** T9 to T11's fake deck is written against an interface the real deck has:
  - `_onMetrics` defaults to null (`deck.js:72`);
  - it is read at call time, every 60th `_onRenderFrame` (`deck.js:1019-1026`);
  - a prop set by `setProps` lands there (`deck.js:330`).

  The end-to-end proof is the real deck's lines in M1 to M3 and D1, and §4 makes their absence VOID for O2. The seam is not imagined.
- **Fields for S0.** `updateAttributesCount` exists but holds 'Attributes updated' (`deck.js:1086`). It counts once per attribute manager that ran an updater (`attribute-manager.js:138-146`), so per primitive layer, sublayers included. Both of S0's stop fields are present, so §5.4's stop does not fire on this read.
- **T12** tests only the drag-type pairing. The fit and seam type, which case 3 and run D use, has no test. Consider one more case.
- **`stallObserverRead.test.mjs`** is outside `vitest.config.ts:11`'s include and outside `npm run verify`, so it runs only by hand. That is as the form states.
- **§0.1** says both rulings are filed "in the commit after d5232d0f". In this session's starting git status they were staged and not yet committed; the custodian checks that sentence at commit.
- **Release boundary (check 4) holds as written:**
  - `isInstrumentedBuild` folds to false in a plain build (`src/isInstrumentedBuild.ts:31-33`);
  - the measure build sets it (`.env.measure:10`);
  - `check:dist-clean`'s list is at `e2e/checkDistClean.mjs:55-128`, and its one-way proof is in that script's header at lines 22 to 37;
  - an existing `isInstrumentedBuild()`-gated entry already passes there (`:86-87`, `:125-127`).

## Check 1, the rulings
| Ruling item | Where the form carries it | Carried truly |
|---|---|---|
| ADV-2026-11-24-18 item 1 (prepare now; the gates only read; S0, code and runs wait for the end of the sitting; merges after the tag) | header, §8 item 13, §9, §11, §0.3 | yes |
| -18 item 2 (full form, both gates) | §0.5, §12 | yes |
| -18 item 3, in the points -19 leaves standing (diff before code; a moved head merged in and read narrowly; the runs measure main after the tag; README entries are separate paths) | §0.3, §7 Scope | yes, but the diff's list is incomplete (E6) |
| -18 item 4 (run D, no scale point, case 3) | §2.4, §3, §7, §12 | yes |
| -18 items 5 to 8 | §2.4, §9, §10, §12, §7 | yes |
| -18 item 9 (S0's stop) | §5.4 | yes |
| -18 item 10 (what goes to the advisor) | §9 | yes |
| -18 item 11 (no dependency, or stop) | §0.5, §5.3 | yes |
| -19 items 1 to 4 (the correction; the three heads recorded; merges after all three; the diff and moved-head rule) | §0.3, §9, §12 | yes |
| -19 item 5 (PR A's own work) | not the piece's | correctly left out |
| -19 item 6 | — | — |

Wording for the advisor (item 10):
1. §12's descriptions of OPEN-6 (A), OPEN-7 (A), OPEN-8 and OPEN-12 (A). The rulings give only letters, or "as you recommend".
2. What "the functions the criterion names" covers (E6 widens the list).
3. Whether D1 needs an unflagged control (E5), which is inside the cap of item 6.
4. Case 3's observer-only shape.
5. §5.3's rule for a head that moves after the runs (check 9).

## Check 9, the draft's question (a question for the advisor; I rule nothing)
My reading:
- A head that moves after the runs does not void what was observed on B plus the piece. It voids only the reading "as main will hold it after the tag" (ADV-2026-11-24-18, item 3).
- So the stop before the record is the cautious choice that fits that purpose.
- Another option is to record the readings for the build they ran on, with the moved head's diff named.
- Whether to run again is a question about the run series, inside the cap of ADV-2026-11-18-01 and -02. That is the advisor's to rule.

## Line cites (check 8)
Every cite I relied on holds at cdfebef1, including the form's verbatim quotes, which match their sources byte for byte.

## Files read
- `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/rst-form-gate-1.txt`
- `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/report-rst-form-arch2.md`, from line 435
- In D:/wt/read-1124c @ cdfebef1:
  - `frontends/shell/src/diagnostics/watchdog.ts`
  - `frontends/shell/src/diagnostics/renderTrace.ts`
  - `frontends/shell/src/diagnostics/watchdog.test.ts` (grep)
  - `frontends/shell/src/isInstrumentedBuild.ts`
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`: lines 20-59, 1127-1129, 1290-1469, 1528-1543, 1650-1665, 2080-2424
  - `frontends/shell/src/canvas/WorkingCanvas.recentre.test.tsx`: lines 40-89
  - `frontends/shell/src/canvas/buildLayers.ts` (grep)
  - `frontends/shell/src/canvas/pickResolution.ts` (grep)
  - `frontends/shell/e2e/checkDistClean.mjs`
  - `frontends/shell/e2e/recentre-crossing.mjs`
  - `frontends/shell/e2e/pan-anchor.mjs`: lines 1-130 and 270-314
  - `frontends/shell/e2e/regression.mjs`: lines 572-591
  - `frontends/shell/e2e/lib.mjs` (grep)
  - `frontends/shell/e2e/README.md`: lines 855-870
  - `frontends/shell/.env.measure`
  - `frontends/shell/package.json` (grep)
  - `frontends/shell/package-lock.json`: lines 451-454
  - `frontends/shell/vitest.config.ts` (grep)
  - `kernel/tests/manual_walkthrough_fixtures.rs`: lines 40-81
  - `docs/08_Testing.md`
  - `docs/adr/ADR-010-render-frames-origins-boundaries.md`: lines 60-86
  - `governance/PLAN.yaml`: lines 7140-7163
  - `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md`: lines 120-129, plus headings
  - `governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md` (grep)
  - `state/directives/2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md`: lines 40-54
  - `state/directives/2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`, whole
  - ADV-2026-11-23-01, ADV-2026-11-16-06 and the human's directive of 2026-11-16 (grep of the cited lines)
  - `state/consults/2026-11-11-platform-recentre-stall-read-and-profile.md`: lines 150-259 and 436-457
  - `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-form-architect-draft.md`: lines 30-43
  - `state/consults/2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md`: lines 144-151
  - `state/consults/2026-11-12-recentre-crossing-view-displaced-fix-s6b-s7-worker-report.md`: lines 98-107
- Untracked, read-only, in the main checkout: `frontends/shell/node_modules/@deck.gl/core/`
  - `package.json`
  - `dist/lib/deck.js`: lines 315-376, 718-759, 990-1099, plus grep
  - `dist/lib/layer-manager.js`: lines 110-169
  - `dist/lib/attribute/attribute-manager.js`: lines 90-154
  - `dist/lib/attribute/attribute.js`: lines 108-157
  - `dist/lib/attribute/data-column.js` (grep)

Model: Opus 5.5 (claude-opus-5-5).
