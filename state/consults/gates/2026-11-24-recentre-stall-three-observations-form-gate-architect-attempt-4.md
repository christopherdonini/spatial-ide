Reviewed: the stall form's draft text, rst-form-gate-4.txt in the scratch folder (53669 bytes, sha256 e7b93c631330134348bcb0b6476e20e403a26f9c97fe544057f58c3f08161399), made from attempt 3 by the architect's 18 pairs and one correction, with the read checkout D:/wt/read-1124c at cdfebef1eecdda586cd7c9aca41941447b453a99, read only (the custodian's filing note, 2026-11-24: the architect's form gate of the full form, attempt 4, narrow under ADV-2026-11-24-22 item 5, before the form is committed, node:recentre-stall-three-observations@form-gate-architect-4, under ADV-2026-11-24-18 item 2; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T09:45:16Z with its brief byte for byte; its run: Read 29, Grep 10, Glob 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-24T09:45:17Z to 2026-11-24T09:54:28Z by its transcript; 19 calls named the main checkout (18 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/ there, read only, which its brief allows; 1 Read of the manifest of deck's untracked installed layers package, frontends/shell/node_modules/@deck.gl/layers/package.json, there, read only and inside the deck folder its brief names, which change nothing); handed back once, at 2026-11-24T09:54:28Z. Filed below the rule, 17006 bytes, sha256 a66946a6dd7ff4af8817cbce994b83d9894229d7c72e19483f199d7438cbde55, byte for byte, nothing masked, with one final newline added.)

---

Verdict: PASS WITH NOTES (detached read checkout D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99)
Reviewed: rst-form-gate-4.txt sha256 e7b93c631330134348bcb0b6476e20e403a26f9c97fe544057f58c3f08161399, with D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

I have no Bash, so I recomputed no hash. I read the 3-to-4 diff against attempt 4. It has 16 hunks. P6 and P7 share one hunk, and so do P9 and P10, which gives 18 pairs. Each new text in the diff is the same as the pairs file's new text (P17 from the second P17 file). This gate is narrow (ADV-2026-11-24-22 item 5).

I found no Correctness or Evidence finding. There are three Documentation findings, D1 to D3, and each must be fixed before the commit. None of the three sentences is the human's wording: all are the drafting architect's or a gate's. Under ADV-2026-11-21-20 and §31, the worker applies the words below with no re-gate, and the record lists them.

## Findings

**D1, Documentation: §4, T28 (P12), with P5's list.** Whether M20 also fails T28 depends on the fixture's counts, and P5's list does not name it.
- In the fixture P12 describes, the free single windows are the one just before the first window (count c) and the second window (count n_R, the R-span's `layerCount`, from T18).
- Under M20 the control is the median of those singles, (c + n_R)/2. With c = 0 and n_R = 1 that is 0.5, below 1, so T28 reads a confirm and fails under M20.
- P5's general clause would still record that as no departure. But the prediction would then rest on a fixture value the row does not fix. Fixing the counts makes the list exact.
```text
in a run where every pair of consecutive windows holds a `layers` line, reads neither
```
```text
in a run where every pair of consecutive windows holds a `layers` line and every window with no `layers` line counts at least one, reads neither
```
Clause check:
- **Correct reading:** there is no free pair, so the reading is neither (§5.1 O2, "including a run with no pair for the control"). There is no kill, since the sum n_R is not below n_R.
- **M28:** the control counts as passed, and the sum is at least n_R with no other line, so it reads a confirm. The predicted failure stands.
- **M18:** the first window counts 0, below n_R, so it reads a kill. That is listed.
- **M20:** every free single counts at least 1, so the median is at least 1 and the reading stays neither. M20 no longer crosses.
- **M19, M26 and M27:** T28 has no other line in the interval, so none of them changes the reading.

**D2, Documentation: §0.1, the ADV-2026-11-24-22 bullet (P2).** Every other ruling in §0.1 is cited by its file. This one names none, so a reader cannot resolve it. The path below is the custodian's (from the brief, filed at 20ed759b). It is not in the tree at cdfebef1 and I could not read it, so the custodian checks it by script before commit.
```text
- The advisor's ruling ADV-2026-11-24-22, given to the custodian on 2026-11-24.
```
```text
- The advisor's ruling ADV-2026-11-24-22: `state/directives/2026-11-24-advisor-ruling-adv-2026-11-24-22-recentre-stall-three-observations-the-ceiling-from-the-line-plan-a-head-moved-before-the-runs-merged-in-and-read-narrowly.md`.
```

**D3, Documentation: §5 Terms, the double-click sentence (P13).** The claim is true. One tick needs a cite the sentence lacks: the transition's last tick.
- The cited `transition-manager.js:136-146` shows that the end sets only the interaction state.
- That the last update tick still carries `inTransition: true` depends on `dist/transitions/transition.js`: `onUpdate` at line 77 runs before `end()` at lines 80 to 81.
```text
`dist/controllers/orthographic-controller.js`, lines 316 to 319, and `dist/controllers/transition-manager.js`, lines 136 to 146, package-relative)
```
```text
`dist/controllers/orthographic-controller.js`, lines 316 to 319, `dist/controllers/transition-manager.js`, lines 136 to 146, and `dist/transitions/transition.js`, lines 77 to 81, which sends the last update before it ends the transition, package-relative)
```
Clause check: at `transition.js:77`, `onUpdate` is called. At `:80-81`, `isFinished` leads to `end()`. `end()` calls `onEnd` (`:41`), which is `_onTransitionEnd` (`transition-manager.js:130`, `:136-146`).

## Notes (not findings)
- **The §0.2 exception.** §0.2's exception for untracked deck source names `@deck.gl/core` only. P3 also cites `@deck.gl/layers`' `package.json`, and says at the cite that it is "read as evidence and package-relative". The custodian's hash script must not resolve that cite against `frontends/shell/package.json:39-48`, which exists in the tree.
- **P13, a double-click that deck ignores.** If deck ignores a double-click because nothing changes (`transition-manager.js:101-103`, for example at the zoom limit), no deck transition starts. The tick still starts one by `WorkingCanvas.tsx:2152`'s own test, so it is deferred and the conclusion holds.

## Check 1: each attempt-3 finding

| Finding | Met | How, and whether the reason is true |
|---|---|---|
| Arch E1 | yes | P14 starts the interval at the second-last metrics line. My attempt-3 start, the last metrics line, was wrong: a `layers` line between those two metrics lines is processed at the later one's frame, after the reset (`deck.js:1019-1021` before `:1031`). M26 tests exactly that start (T26). |
| Arch E2 | yes | P3 widens the lockfile list beyond my proposal. Verified complete at cdfebef1 (below). |
| Arch D1 | yes, with D1 above | P5's list is exact for M16, M18 and M19 (each checked). M20 can cross T28 (D1). |
| Arch D2 | yes | P7, the reviewer's words. They give the same span my D2 asked for. |
| Arch D3 | yes | P11, as written. |
| Arch D4 | yes | P14 and P16 ("each window with the next"); P10. Under the correct reading T20's four pairs sum to 1 each, and the pair of the fifth quiet window with the first window is excluded because the first window holds the R-span's line. Under M20 the median is 0.5, so T20 reads a confirm. |
| Arch D5 | yes | P13 and P6, verified (Concurrency). Cite gap: D3. |
| Arch D6 | yes | The least-count kill replaces the note and is sound (Concurrency). |
| Arch D7 | yes | P2's first sentence. |
| Arch D8 | yes, superseded | ADV-2026-11-24-22 item 1 sets the ceiling. P17's reason is true: a "an overrun is expected" sentence would now be untrue. |
| Arch D9 | yes | P4's "Before code" sentence covers the window between S0's diff and code with the existing stop. |
| Rev E1 | yes | P14: false confirm (start at the second-last metrics line), false kill (least `layerCount`), empty control (neither), pairs each window with the next. P12 adds T26 to T28. P9 makes T19 exact. |
| Rev D1 | yes | P7. |
| Rev D2 | yes | P8. |
| Rev D3 | yes | P15 generalises the wording to "a lockfile entry it lists", in line with P3. |
| Rev D4 | yes | P16. |
| Rev O-1 | yes | P4 carries ADV-2026-11-24-22 item 2 clause for clause: merged in; a narrow read if it touches §0.3's list; the runs on that base; a stop only if the instrument's place or what it times has changed. |

**The settled pairs, and P9:**
- **P14 (O2): settled and sound.** Its reason's deck cites hold: `deck.js:784`, `:1019-1021`, `:1024-1025`, `:1031` (the only `updateLayers()` call), `:369` and `:1086`; `layer-manager.js:129-131` and `:156`; `attribute-manager.js:144-145`.
- **P12 (T26 to T28):**
  - **T26** is reachable as worded. T18's quiet pairs are plural, and at most one pair can contain the window that closes at the last metrics line, so one free pair survives. Under M26 the reading is a confirm.
  - **T27:** M27 reads a kill, and M19 leaves it neither.
  - **T28:** see D1.
- **P7 (T15):** M15 pairs the batch span to the drag, so the reading fails at the drag.
- **P4 (the moved head):** met (Rev O-1).
- **P3 with P15 (the lockfile entries):** consistent with each other. §5.3 points to §0.3's list.
- **P9 (T19):** with the other line after the R-span's line and T18's quiet pairs, M19 reads a confirm, and M18 reads a kill (0 below a least count of at least 1). The reason is true.

**The pairs changed from a gate's words (P3, P4, P5, P14, P15, P16), and the author's own (P1, P2, P9, P17, P18):** each meets its finding, and each stated reason is true. The exceptions are D1 (P5's list) and D2 (P2's missing path). P1 and P18 match ADV-2026-11-24-22.

## Check 2: the new words in context

**§4, mutations.**
- M16 adds T17. M18 adds T19, T20, T26, T27 and T28. M19 adds T26.
- M26, M27 and M28 each fail only their own test.
- M20 can add T28 (D1).
- T14's fixture can be built with a span after the last old-origin line and a later span after the first new-origin line, and M14 then picks the later span.
- T17 is read at the drag's R-span, so M16 and M17 both fail it.

**§5.1 O2, decidability.** Each reading can be decided from the ordered queue:
- metrics lines carry page times;
- a `layers` line takes its render's span time (§2.3), and no metrics line can fall between the two in one synchronous `render()`;
- the second-last metrics line before t1, the interval, the least count and the empty control are all mechanical.

**§0.3 lockfile list (P3), at cdfebef1.**
- The two deck packages' dependency lists are at `package-lock.json:457-473` and `:481-491`. They match `core/package.json:42-58` and `layers/package.json:39-48` (package-relative, 9.3.9).
- The dependencies of those dependencies:
  - loaders: `:996-1002`, `:1009-1011`, `:1021-1026`, `:1033-1036`, `:1043-1048`;
  - luma: `:1067-1073`, `:1080-1085`, `:1096-1099`, `:1109-1112`;
  - math.gl and probe.gl: `:1128-1130`, `:1137-1139`, `:1158-1160`, `:1203-1205`;
  - `apache-arrow`: `:2335-2340`.
- The leaf packages have no dependencies: `:1117-1122`, `:2586-2591`, `:2758-2763`, `:2855-2860`, `:3037-3042`, `:3394-3399`, `:3838-3843`.
- `values.ts:4` imports `apache-arrow`.
- The list is complete. The only packages it leaves out are `@types/*`.
- I could not run the list against the three heads by git; that is the reviewer's.

**§7 (P17) against ADV-2026-11-24-22 item 1.**
- There is one figure per Scope file, 13 files: 88 + 170 + 197 + 475 = 930.
- 1,020 is within a tenth of the plan (930 × 1.1 = 1,023; the margin, 90, is 9.7%).
- The plan's total is under 1,000.
- The files that ship total 88: 20, 50 and 18. Attempt 2 carried only the 580 total and no figure per file (`rst-form-gate-2.txt`, its §7 ceiling line). So "not above attempt 2" is checked against the author's reconstruction. That is for the advisor (check 5, item 8).
- Can the plan hold §4 and §5? Plausible:
  - the reader's 250 lines must hold every branch of three pairing rules, the baseline, O1, O2 with its interval, kill and control, O3's three near clauses, the two VOIDs and the invalidators;
  - the reader's test's 225 lines must hold 17 tests, about 13 lines each with shared builders.
  - That is tight. The 90-line margin is the slack, and an overrun is class 8. Not a finding.

**§0.1, §0.3, §5.3 and §12 (P1, P2, P4, P15, P18).** They carry ADV-2026-11-24-21 items 1, 2 and 4, and ADV-2026-11-24-22 items 1 to 3, and contradict neither. P4 copies the ruling's own boundary, "after code and before the runs". A head that moves while S1 is under way falls under "after code".

## Concurrency (check 3)

**P14's interval.**
- At deck 9.3.9 one frame runs in this order: emit and reset (`deck.js:1019-1025`), then `updateLayers` (`:1031`), then picking, redraw and view-state transitions (`:1033-1040`).
- A `layers` line written before the second-last metrics line is processed at that line's frame or earlier, so its updates fall at the latest in the window just before the first window.
- A line between the second-last and the last metrics line can be processed at the last one's frame, after the reset, and so counted in the first window. That includes an app `requestAnimationFrame` callback that runs before deck's own in the same frame, such as the coalesced schedule at `WorkingCanvas.tsx:1833`.
- The R-span's set is processed at the first frame after t1. That frame is at or before the first window's frame, so its updates land in the first window or, at that frame, in the second.
- A replacement must arrive before that processing, and so it is processed at the same frame. The sum is then at least the replacing set's count, which is at least the least count. The kill holds.
- No render runs between the emission and `updateLayers` (`:1028`), and the only `setProps({ layers })` is `WorkingCanvas.tsx:1378`.
- Sound.

**P13's double-click.**
- `_onDoubleClick` passes the transition props (`controller.js:538`; `_getTransitionProps`, `:615-630`), 300 ms for the orthographic view (`orthographic-controller.js:316-319`; the view is orthographic, `WorkingCanvas.tsx:2089`). So the first tick starts a transition by `:2152`.
- `_triggerTransition` sets `inTransition: true` before its first update (`transition-manager.js:133-134`), and every update tick goes through `_onTransition` with that state (`controller.js:45-46`, `:241-242`).
- The last update runs before `end()` (`transition.js:77-81`), and the end sends no view-state tick (`transition-manager.js:136-146`).
- So no double-click tick re-centres. The reading holds (cite gap: D3).

## Cites (check 4)

These hold at cdfebef1:
- `WorkingCanvas.tsx`: 2150-2152, 2161, 2192 and 2197;
- `package-lock.json`: 452-454;
- `values.ts`: 4.

The deck cites, package-relative at 9.3.9:
- `controller.js:538`;
- `orthographic-controller.js:316-319`;
- `transition-manager.js:136-146`;
- `core/package.json:42-58` and `layers/package.json:39-48`.

The ruling cites by item match the rulings as briefed. No new word is marked verbatim.

## Check 5: the rulings, and the advisor's wording list (ADV-2026-11-24-18 item 10)

No new word contradicts ADV-2026-11-24-18, -19, -21 or -22. The list, from the author's twelve:

1. **Stays:** §12's descriptions of OPEN-6 (A), OPEN-7 (A), OPEN-8 and OPEN-12 (A). Added: the -21 and -22 rows (P18).
2. **Widened:** §0.3's list now holds the full lockfile closure (P3). That goes beyond both attempt-3 gates' proposals, by `@mapbox/tiny-sdf`, `flatbuffers`, `json-with-bigint` and `tslib`. -22 item 3 reads the timed path as this list, and the advisor has not read its words. Verified complete at cdfebef1.
3. **Stays:** D1 has no perturbation control.
4. **Stays:** case 3 is observer-only.
5. **Changed:** §5.3's wording, "a function, a file, or a lockfile entry it lists" (P15). The custodian sends the item-2 material.
6. **Stays:** the product lines are emitted in every instrumented build.
7. **Stays:** the reader's test is run only by hand.
8. **Worded:** 1,020 from a plan of 930.
   - Attempt 2 filed no figure per file, so the shipped files' "attempt 2" figures (20, 50 and 18) are the author's reconstruction.
   - `stallObserver.mjs` grows by 12 lines, outside "the reader and its tests" (custodian note 2).
9. **Corrected:** O2 reads neither wherever another render falls in the widened interval. That is likely at case 2's wheel tick, at case 3 and through run D. The render sources on the candidate arm are `WorkingCanvas.tsx:1819` (rendering at `:1448`), `:1833`, `:1847`, `:1853`, `:1925` and `:2197`, all verified. `:1822` is blank.
10. **Worded:** P4 is -22 item 2 in the form's words. Its "after code" covers a head that moves while S1 is under way.
11. **For the custodian to compare with its message:** S0 records the `candidateArmSession.ts` and `App.tsx` diffs.
12. **Changed by D2:** -22 is cited with its path.

## Outside the changes

Nothing that the changes break.

## Files read

- **Scratch** (`<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/`): `rst-form-gate-4.txt`, `rst-form-gate-3-4.diff`, `apply-rst-4.log`, `report-rst-pairs-4-arch.md`, `report-rst-pairs-4-p17.md`, `report-rst-formgate-arch-3.md` and `report-rst-formgate-rev-3.md`, plus a grep over `rst-*` for the §7 ceiling, which read lines of `rst-form-gate-1.txt`, `-2.txt`, `-3.txt` and `-4-p17first.txt`.
- **D:/wt/read-1124c @ cdfebef1:**
  - `frontends/shell/src/canvas/WorkingCanvas.tsx`: 1352-1393, 1436-1449, 1690-1704, 1814-1858, 1920-1927 and 2130-2219, plus greps for `setProps(` and the view;
  - `frontends/shell/src/attributes/values.ts`: 1-8;
  - `frontends/shell/package-lock.json`: 445-494, 988-1219 and 2328-2345, plus greps.
- **Untracked, read only, as evidence and not Authority** (`C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/`):
  - `core/dist/lib/deck.js`: 995-1094, plus a grep;
  - `core/dist/lib/layer-manager.js`: 86-169;
  - `core/dist/lib/layer.js`: 755-792;
  - `core/dist/lib/attribute/attribute-manager.js`: 95-154;
  - `core/dist/controllers/controller.js`: 150-249 and 525-633, plus greps;
  - `core/dist/controllers/orthographic-controller.js`: 296-330;
  - `core/dist/controllers/transition-manager.js` and `core/dist/transitions/transition.js`, whole;
  - `core/package.json` and `layers/package.json`.

Model: Opus 5.5 (claude-opus-5-5).
