Reviewed: the stall form's draft text between its marks, rst-form-gate-1.txt in the scratch folder (36348 bytes, sha256 55dbf8bbbe6ed0d6724defa280e9fda756fa17ccf2e15d1342f8e2e229a6f9af), with the read checkout D:/wt/read-1124c at cdfebef1eecdda586cd7c9aca41941447b453a99, read only (the custodian's filing note, 2026-11-24: the reviewer's form gate of the full form, attempt 1, before the form is committed, node:recentre-stall-three-observations@form-gate-reviewer-1, under ADV-2026-11-24-18 item 2; it only reads, so it ran in the sitting, during no build; dispatched at 2026-11-24T07:45:09Z; its run: Bash 66, Read 1, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-24T07:45:09Z to 2026-11-24T07:59:10Z by its transcript; 4 calls named the main checkout (4 calls reading deck's untracked installed source under frontends/shell/node_modules/@deck.gl/core there, as the report discloses, which change nothing); handed back once, at 2026-11-24T07:59:09Z. Filed below the rule, 25860 bytes, sha256 076aef59d9c0554ab700d1ea9eabe198a5c5cc2eb9a96d6d0e7914b31b909141, byte for byte, nothing masked, with one final newline added.)

---

Verdict: FAIL — (detached read checkout D:/wt/read-1124c) @ cdfebef1eecdda586cd7c9aca41941447b453a99
Reviewed: rst-form-gate-1.txt sha256 55dbf8bbbe6ed0d6724defa280e9fda756fa17ccf2e15d1342f8e2e229a6f9af, with D:/wt/read-1124c @ cdfebef1eecdda586cd7c9aca41941447b453a99

I checked the sha256 first. It matches. The notes file also matches its hash (c800ae33…392d), and the read checkout's HEAD is cdfebef1. Refs are origin/* as they stand in the checkout, with no fetch: origin/main = d5232d0f004d20b42f0ef2c376de0d51ac2f3f09.

Three things I did not or could not resolve:
- ADV-2026-11-24-18 is not in the tree, so I did not read it. Every cite to it by item is unresolved by me.
- §0.4's byte-copied reuse block comes from the custodian's brief, which I do not have.
- §0.1's statement that both rulings are filed "in the commit after d5232d0f" is about a commit that does not exist yet.

## Check 1: the custodian's facts in §0.3, by git

**Heads.**
- PR A = 806ad30843269f8012ec1d89f0224703a8078ad7.
- PR 365 = 639a96cc25873c99d606b4d75541bd8f3de37543.
- PR 366 = e4116cadbedcd6916dd38bab2681592909a85e4a.
- All three match the form.

**What each branch holds.**
- The merge base of every pair is 2095a7ac, and each branch's merge base with main is 0bcf5434.
- e4e6493d is the head of origin/cut/relink-after-refusal and is an ancestor of 2095a7ac, so all three heads hold it. The form says this only of PR A. That is true but incomplete; it is not a defect.
- PR 365 has 4 commits after 2095a7ac: 480445f9, c60660bd, d636c3b6, 639a96cc. The parent of 480445f9 is 2095a7ac.
- PR 366 merged 2095a7ac at 4c028ef6. None of its non-merge commits in 2095a7ac..e4116cad touches WorkingCanvas.tsx. The form's fact holds.

**Trial merges** (`merge-tree --write-tree`, all exit 0):
- A with 365: clean (tree 4a10859f).
- 365 with 366: clean (tree 4db2c82d).
- A with 366: clean.
- The actual sequence, (A+365) then 366 with merge base 2095a7ac: clean (tree 65b9489a).

**WorkingCanvas.tsx hunks, three-dot against origin/main.** WorkingCanvas.tsx is unchanged between 0bcf5434 and main, so these are main's line numbers.
- PR A: 41–49, 191–193, 563, 1538–1540, 1660–1662.
- PR 365: 165, 191–193, 1660–1662.
- PR 366: 191–193, 1660–1662.
- What the code at those lines is:
  - 1538–1540: the ceiling-refusal catch.
  - 1660–1662: `resetFitForNewGeneration`.
  - 563: a props doc comment.
  - 165 and 191–193: the handle's doc comment.
- None of these is in `render()` (1358–1391), `fitToExtent` (1427–1458), `onViewStateChange` (2128–2212) or §2.2's region (2254–2263). The trial base tree 65b9489a shows the same hunk set against cdfebef1.
- Two of the form's numbers are wrong (D2):
  - "lines 165 to 198": on main's side the hunks end at 193.
  - "lines 165 and 193 to 195 at PR A's head": at PR A's head these lines are 166 and 194–196. 165 and 193–195 are the numbers at 2095a7ac.

**§0.3's paths.**
- No unmerged origin branch changes `buildLayers.ts`, `offsetFrame.ts`, `src/diagnostics/`, `recentre-crossing.mjs`, `checkDistClean.mjs`, `pan-anchor.mjs`, `decodeBatch.ts` or `tileViewportStreamManager.ts`.
- e2e/README.md is changed by five unmerged branches: PR A, 365, 366, relink-after-refusal and console-stream-lane. Their hunks are at 280 and 888–908. None falls in the recentre entry (858–868).
- `git diff --name-only cdfebef1 4b17d9da -- frontends/ docs/ kernel/` is empty. So is the same diff against d5232d0f.
- All three heads change package.json and package-lock.json (fast-check).

## Check 2: line cites and verbatim quotations

**Line cites.** I checked 68 at cdfebef1. Three fail:
- (a) §0.3: "165 and 193 to 195 at PR A's head" should be 166 and 194–196 (D2).
- (b) §0.3: "165 to 198" at main's numbering should be 165 and 191–193 (D2).
- (c) §2.4(c): regression.mjs "579 to 586" stops before the `btn.click()` at line 588 (D6).

**Verbatim quotations.** I checked 8 against their sources, byte for byte. All 8 match:
- 2026-11-12 directive, line 48.
- 2026-11-23 directive, lines 24 and 25 (line 25 is a sub-line span; no negation or condition is dropped).
- ADV-2026-11-23-01, line 33.
- ADV-2026-11-16-06, line 25 (both clauses).
- docs/08, line 11.
- ADR-010, line 85.
- 2026-11-16 directive, line 10. Its source is not named by path in the form, and 17 files in state/directives are dated 2026-11-16 (D7).

The two code spans quoted in §2.2 match WorkingCanvas.tsx line 28 and a prefix of line 2263.

## Check 3: the code the design stands on

**§2.1 (watchdog).**
- watchdog.ts lines 27–29 (`begin` stores `performance.now()`), 34–36 (`end` deletes the entry), 51 (the reset in `check`) and 58 (`setInterval`): as the form says.
- `begin("layer-construct")` and `end` have one caller each, render() at 1361 and 1388. `end` runs in a `finally`.
- `begin` also writes `beganAt`. That is harmless here.
- T1–T4 are feasible. There is a gap in the precedent, though: the existing watchdog tests mock neither `performance.now` nor `isInstrumentedBuild`; they use the real clock and `__checkForTests`.
- No test anywhere uses `vi.mock` of `isInstrumentedBuild`. The precedent is `vi.stubEnv("DEV", false)` in `residencyArm.test.ts:108`.
- Both approaches work once watchdog.ts imports `../isInstrumentedBuild`, which it does not today.
- §2.1 item 1 contradicts §6 (D4).

**§2.2 (the Deck effect).**
- Lines 2086, 2254, 2257–2258 and 2261 match. 2263 is the capturePixels comment.
- Line 29 already imports `isInstrumentedBuild`, so the new import goes between 28 and 29.
- `WorkingCanvas.recentre.test.tsx:53-90` and `WorkingCanvas.wiring.test.tsx:33-54` replace `Deck` with `vi.mock("@deck.gl/core", importOriginal → {...actual, Deck: FakeDeck})`. A third file of the same shape, with a fake `setProps` that records its calls, makes T9–T11 feasible.
- Evidence read outside the read checkout: I ran a read-only grep of the untracked `frontends/shell/node_modules/@deck.gl/core/dist/lib/deck.js` (9.3.9) in the main checkout.
  - `_onMetrics` is called every 60th frame, after `stats.reset()` (lines 1019–1025).
  - `updateAttributesCount` is written twice, at 1085 ('Layers updated') and then at 1086 ('Attributes updated').
  - `attribute-manager.js:145` increments that counter once per `update()` that updated anything.
  - So §5.4's two fields exist. The count is per attribute manager (sub-layers included), not per attribute, so O2's "at least layerCount" is a usable threshold. S0 should still record this.

**§2.3 (the `layers` line).**
- `traceLayerUpdate` is at 1383. Line 1386 is `pickResolutionExtentFor`, and pickResolution.ts has no console call. `end` is at 1388.
- So in an instrumented build the next console line after `layers` is the span line, within one synchronous task. Confirmed.

**§2.4 (the harness).**
- recentre-crossing.mjs:
  - The ordered queue is at 72–76.
  - `openFixture`'s reload is at 84 and `openPath` at 89, so the install goes between them.
  - `main`'s `finally` is at 337–338.
- pan-anchor.mjs:
  - It has one reload, in `setup()` at 64, and `openPath` at 70.
  - The DEV seam is at 99. Its own console listener (60–63) is not queued.
  - Its `finally` is at 304–305.
- regression.mjs 584–590 finds the button by `textContent` and calls `btn.click()`.
- The button exists at cdfebef1 and at PR A's head (`regionParts.tsx:183`; label at `actionRegistry.ts:75`).
- The R-span rules match the code:
  - drag: `traceViewState` at 2161 with the old origin, then `maybeRecenter` at 2192, then `render()` at 2197;
  - fit: `forceRecenter` at 1439, the new-origin trace at 1441, `render` at 1448;
  - seam: 2404, 2406, 2410.

**§2.5 (release or DEV).**
- `isInstrumentedBuild.ts` 31–33: as cited.
- `.env.measure:10`: `VITE_MEASURE_BUILD=1`.
- checkDistClean.mjs: the list is at 55–128 and the one-directional header at 22–37.

**What the design leaves undeclared (D8).** The product emission is gated only by `isInstrumentedBuild()`, so every dev and measure-build run of every suite will emit span and metrics lines, flag or no flag. The form does not say so.

## Check 4: the mutations of §4

These would fail their own test as predicted: M1, M2, M4, M6 (if the mocked clock gives a non-zero emit cost), M7, M9, M10, M11, M12 and M13.

These predictions cannot be reached as written:
- **M3** ("T3, on a NaN line"). T5's fields are `t0=`, `t1=` and `prevEmitMs=`, with no difference field. Emitting with the entry absent gives `undefined`, or a TypeError on `entry.beganAt`/`toFixed`. It does not give NaN. T3 still fails, but on a different line (D5).
- **M14** ("drop the adjacency window"). If the adjacency clause is removed, T14's case (no R-span within 100 ms) is still listed as unexplained, so T14 passes. T14 catches M14 only if "drop" means an unbounded window and the data has an R-span more than 100 ms earlier. No test covers the confirming side of the adjacency: a 19 s gap one tick after a gap that holds the R-span. That is the stall report's own pattern (line 185 at cdfebef1) (E2).
- **M5 and M8** probably also fail T1, and M8 probably also fails T9, wherever those tests read the line's text or find it by a leading `[stall-obs]`. The form predicts only their own tests (D5).

## Check 5: `e2e/stallObserverRead.test.mjs`

- No CI workflow and no npm script runs it.
- vitest covers only `src/**` (vitest.config.ts:11).
- `npm run verify` (package.json:17) runs four named `e2e/*.test.mjs` through scripts. This file would not be one of them.
- product-ci-shell.yml:216 runs `npm run verify`. governance-ci.yml:150 runs only `scripts/plan|hooks|evidence`.
- So nothing proves T12–T14 at any push after S1. The form names no record that ties a test run to the reader commit that computes the readings (E1).

## Check 6: the counting rule in §7

`HEAD --not B <held heads merged after B>` counts the piece's own non-merge commits correctly when only held heads come in. It miscounts in two cases:
- **(a) Overcount.** If main is merged into the branch, main's commits after B that touch a Scope path are counted. The branch must merge after three PRs and the tag, and a newly required check is normally fixed by merging main. For example, console-stream-lane changes e2e/README.md (hunks 280 and 896) and is in none of the three heads.
- **(b) Undercount.** Lines the piece writes while resolving a conflict in a merge commit on a Scope path are never counted, because merges are excluded.

D3 gives a rule that excludes everything any merge brings in and counts conflict resolutions.

## Check 7: Scope

- The 13 paths: the 6 new ones are absent at cdfebef1 and at all three heads. The 7 changed ones exist at all four refs.
- The recentre entry is at e2e/README.md:858–868, and line 868 says "It takes no timing".
- There is no pan-anchor entry in e2e/README.md at cdfebef1, at PR A's head, at PR 365's head or at PR 366's head (D1).

## Findings

None of these sentences is the human's wording. All are the architect's draft words. Each one sits in its own bullet below, with its old text first and then its new text.

### Evidence (blocking)

- **E1, §4, `stallObserverRead.test.mjs`.** No CI run and no `verify` step runs the reader's test. The form ties no record to the commit at which the readings are computed, so the readings rest on a reader whose test is proven only once, by hand.
  - Clause check:
    - package.json:17 has no such step;
    - product-ci-shell.yml:216 runs only `npm run verify`;
    - §8 item 10 requires every reading to come from the committed reader.
```text
**`e2e/stallObserverRead.test.mjs` (new).** It is run with `node`, and no package.json line is added. It feeds synthetic JSONL with a known answer.
```
```text
**`e2e/stallObserverRead.test.mjs` (new).** It is run with `node`, and no package.json line is added, so neither `npm run verify` nor any CI workflow runs it (`frontends/shell/package.json`, line 17, and `.github/workflows/product-ci-shell.yml`, line 216, at cdfebef1). Its proof is by hand: the worker runs `node e2e/stallObserverRead.test.mjs` at the commit whose reader computes the readings, and the run report and the closing amendment record that commit and the exit code. A reader changed after that run is tested again before any reading is computed with it. It feeds synthetic JSONL with a known answer.
```

- **E2, §4, T12 and T14.**
  - O3's confirming adjacency path has no test that fails when the clause is removed, and M14's predicted failure is not reachable as worded (check 4). This is the stall report's own case: a ~19 s gap one tick after a ~0.7 s gap.
  - The fit-type pairing, used for case 3 and the run D seam, is also untested. A drag rule applied to a fit picks an earlier batch render's span whenever one lies between the last old-origin line and the fit.
  - Clause check: fitToExtent traces the new origin at 1441 and then calls `render()` at 1448. Batch-driven renders emit no `view-state` line.
```text
| T12 | the drag-type R pairing | M12: take the first span after the first new-origin line | T12 |
```
```text
| T12 | the R pairing of both types: for a drag, the first span after the last old-origin `view-state` line; for a fit, the first span after the first new-origin line, with a batch render's span between the last old-origin line and the fit | M12: for a drag, take the first span after the first new-origin line | T12, on the drag |
```
```text
| T14 | a long gap with no R-span within 100 ms before it is listed as unexplained | M14: drop the adjacency window | T14 |
```
```text
| T14 | a long gap that begins within 100 ms after the end of a kept gap holding an R-span is read as confirming, and one that begins more than 100 ms after it, with no R-span inside, is listed as unexplained | M14: drop the adjacency clause, so that only an R-span inside a gap explains it | T14, on the first gap |
```

- **E3, §6, O1 span.** "That is below the timer's resolution" is a magnitude claim that nothing measures. The control records the resolution, not the cost of the gate and the compare (docs/08: no numbers, no claim).
```text
  - Added inside the span: the gate's call and one string compare before t1. That is below the timer's resolution, which the control records.
```
```text
  - Added inside the span: the gate's call and one string compare before t1. Their cost is not measured and no claim is made about it; the control records the timer's resolution.
```

### Documentation (must fix before the merge)

- **D1, §7 Scope, README.** No pan-anchor entry exists to put the observe mode in (check 7). Clause check: `grep -ci pan-anchor` on e2e/README.md returns 0 at all four refs.
```text
  - `frontends/shell/e2e/README.md`: the observe mode, inside the recentre entry and the pan-anchor entry only. Each entry is a separate path by the standing rule. The recentre entry is at lines 858 to 868 at cdfebef1; its line 868 says the suite takes no timing.
```
```text
  - `frontends/shell/e2e/README.md`: the observe mode, inside the recentre entry only, at lines 858 to 868 at cdfebef1; its line 868 says the suite takes no timing. The README has no pan-anchor entry at cdfebef1 or at any of the three heads, so pan-anchor's flag is described in `pan-anchor.mjs`'s own header comment and no README entry is added.
```

- **D2, §0.3.** Line numbers and head ids. 480445f9's parent is 2095a7ac, and its hunks are doc-comment lines (` * ...`).
```text
One of them (480445f9) changes `WorkingCanvas.tsx` at the handle's interface: lines 165 and 193 to 195 at PR A's head.
```
```text
One of them (480445f9) changes `WorkingCanvas.tsx` at the handle's interface, in comments only: lines 165 and 193 to 195 at its parent 2095a7ac, which are lines 166 and 194 to 196 at PR A's head.
```
```text
  - lines 165 to 198;
```
```text
  - line 165 (PR 365 only) and lines 191 to 193 (all three);
```
```text
- PR 365, `cut/colour-by-refill-keeps-the-view`, head 639a96cc. Four commits follow 2095a7ac.
```
```text
- PR 365, `cut/colour-by-refill-keeps-the-view`, head 639a96cc25873c99d606b4d75541bd8f3de37543. Four commits follow 2095a7ac.
```
```text
- PR 366, `cut/partitioned-ordinal-refusal-opens-the-identity-form`, head e4116cad. It holds
```
```text
- PR 366, `cut/partitioned-ordinal-refusal-opens-the-identity-form`, head e4116cadbedcd6916dd38bab2681592909a85e4a. It holds
```

- **D3, §7 Ceilings, the counting rule.** The two miscount cases are in check 6.
```text
The count is the sum of `git log --no-merges --numstat HEAD --not B <each held head merged in after B> -- <Scope paths>`. Merge commits, and the held pieces' commits they bring in, are not counted.
```
```text
The count is the sum of `git log --no-merges --numstat HEAD --not B <every parent but the first of each merge commit in B..HEAD> -- <Scope paths>`, so nothing a merge brings in is counted, whether a held head or main. Merge commits are not counted, except that a merge whose combined diff in a Scope path is not empty (`git show --cc <merge> -- <Scope paths>`) is named in the record and those lines are added.
```

- **D4, §2.1 item 1.** Item 1 says t1 is the first statement of `end`. §6 says the gate and the compare come before t1. Read literally, item 1 puts an ungated `performance.now()` call into `end` in every build.
```text
  1. Its first statement reads `performance.now()` as t1.
```
```text
  1. Inside the gate and the phase test, the first statement reads `performance.now()` as t1; outside them `end` is unchanged.
```

- **D5, §4.** Predicted failure lines (check 4).
```text
| T3 | `end("layer-construct")` with no `begin` emits nothing and does not throw | M3: emit when the entry is absent | T3, on a NaN line |
```
```text
| T3 | `end("layer-construct")` with no `begin` emits nothing and does not throw | M3: emit when the entry is absent | T3, on an emitted line or a throw |
```
```text
| T5 | the span line is a single string argument carrying `t0=`, `t1=` and `prevEmitMs=` | M5: pass an object argument | T5 |
```
```text
| T5 | the span line is a single string argument carrying `t0=`, `t1=` and `prevEmitMs=` | M5: pass an object argument | T5 (and T1 where it reads t0 from the line's text) |
```
```text
| M8: prefix the lines with `[render-trace]` | T8 |
```
```text
| M8: prefix the lines with `[render-trace]` | T8 (and T1 and T9 where they find a line by a leading `[stall-obs]`) |
```

- **D6, §2.4(c).** The cite stops before the click at line 588.
```text
as `e2e/regression.mjs` does (lines 579 to 586 at cdfebef1).
```
```text
as `e2e/regression.mjs` does (lines 579 to 590 at cdfebef1).
```

- **D7, §11.** The verbatim quote's source is not named.
```text
The directive of 2026-11-16, line 10 at cdfebef1, verbatim:
```
```text
The human's directive of 2026-11-16 (`state/directives/2026-11-16-the-humans-directive-the-target-is-v0-2-record-keeping-repeated-runs-pieces-the-machine-models-focus-for-a-week.md`), line 10 at cdfebef1, verbatim:
```

- **D8, §1 "Not touched".** Every instrumented-build run will carry the new lines, flag or no flag. The architect may prefer a design answer here, a runtime switch tied to the flag, over this disclosure.
```text
  - nothing changes on the wire;
```
```text
  - nothing changes on the wire;
  - every instrumented build (dev and measure) emits the span and metrics lines on every run, with or without `--stall-observe`, so a later timing run on those builds carries their emit cost (the carried `prevEmitMs`);
```

## Commands run (exit codes)

1. `sha256sum` and `wc -c` of both scratch files; `git rev-parse HEAD`: 0.
2. `awk` over the notes after `---END OF FORM---`: 0.
3. `git rev-parse` of the four origin refs and the named commits: 0.
4. `git merge-base` (pairs, and each head with main), `merge-base --is-ancestor` loops, `git log --oneline 2095a7ac..<365|366>`, `git log -3 cdfebef1`: 0.
5. Ancestry of e4e6493d; `git branch -r --contains e4e6493d`; `git log --first-parent 2095a7ac..PR A`: 0.
6. `git rev-parse origin/cut/relink-after-refusal`; `git merge-tree --write-tree` ×3: 0. This writes tree objects into the object store; it writes no ref and no working tree.
7. `git merge-tree --write-tree --merge-base=2095a7ac 4a10859f <366>`: 0.
8. `git diff --stat` between the merge base and main; `git diff --name-only cdfebef1 4b17d9da|origin/main`; three-dot hunk lists for WorkingCanvas.tsx: 0.
9. `git show 480445f9`; `git log` on WorkingCanvas.tsx per branch: 0.
10. `git show … | grep -n` of 480445f9's lines at PR A, 2095a7ac and 639a96cc: 0.
11. `git show cdfebef1:WorkingCanvas.tsx | grep -n` of the functions: 0.
12. The hunks at 1538 and 1660: 0.
13. `sed -n 1355,1460p` (render and fitToExtent): 0.
14. watchdog.ts and renderTrace.ts: 0.
15. `git grep` for layer-construct and watchdog importers; watchdog.test.ts: 0.
16. `git ls-tree` canvas tests; `git grep` for the `vi.mock` of deck: 0.
17. The FakeDeck setup in WorkingCanvas.recentre.test.tsx: 0.
18. `ls` of node_modules deck.js in the read checkout (absent) and in the main checkout: 0.
19–21. `grep` and `sed` of deck 9.3.9 deck.js and attribute-manager.js (untracked, main checkout, read only): 0.
22. Stall report lines 180–190, 236–256 and 437–457: 0.
23. pickResolution.ts grep and `sed`: 0.
24–25. isInstrumentedBuild.ts, .env.measure; `git grep` for isInstrumentedBuild in tests, `stubEnv` and the spy on `performance.now`: 0.
26. WorkingCanvas.tsx 2078–2135 and 2240–2275: 0.
27. recentre-crossing.mjs head, main, finally: 0.
28. pan-anchor.mjs reads: 0.
29. regression.mjs 572–590 and lib.mjs 270–276 and 388–396: 0.
30. "Zoom to layer" greps (×3) and LayersRow at two refs: 0.
31. checkDistClean.mjs 1–140: 0.
32. package.json scripts, the expanded verify line, vitest.config.ts, `ls-tree` of the shell: 0.
33. Workflow `ls-tree` and `git grep`: 0.
34. Held branches' guarded-path name diffs: 0.
35. Scans of unmerged branches (guarded paths; WorkingCanvas, decodeBatch and the tile manager): 0.
36. README `wc`, the grep for headings, the `sed` of 856–870, `grep -i anchor`, hunks per branch: 0.
37. AUTONOMY.md grep for §22: 0.
38. Directive lines (2026-11-12:48; 2026-11-23:17–26), PLAN.yaml 7142–7162, PR 311 ancestry: 0.
39. Diagnostic draft 32 and 42, build report 146–149, S6b/S7 report 100–106: 0.
40. visibilityState, package-lock 450–455, fix form 125–128 and its headings: 0.
41. Held branches' package diffs: 0.
42. ADV-23-01:33, ADV-16-06:23–27, docs/08:11, ADR-010:85: 0.
43. Search for the 2026-11-16 directive quote: 1. The loop's last `[ -n ]` test was false; the match was found at line 10.
44. That directive's line 10; the count of 2026-11-16 files: 0.
45. manual_walkthrough_fixtures.rs 40–80: 0.
46. Trial base tree grep and guarded-path diff: 0.
47. WorkingCanvas hunks, cdfebef1 against the trial base: 0.
48. The `grep -c -F` uniqueness check of every old text; `git log -1 480445f9` parents: 0.
49. Stall report "one heartbeat tick after"; product-ci-shell.yml 214–217: 0.
50. `grep -ci pan-anchor` on README at the 365 and 366 heads: 1 (count 0, as expected); `grep -c stall` on pan-anchor.mjs: 1 (count 0).

## Files read

The scratch files (outside the repository):
- `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/rst-form-gate-1.txt`
- `<u>/AppData/Local/Temp/claude/3eed48519155ece4/da685a21-245c-4f3e-8f40-060e581f487c/scratchpad/report-rst-form-arch2.md`

At cdfebef1 unless noted. The main path is `frontends/shell/src/canvas/WorkingCanvas.tsx`, also read at origin/cut/shell-migration-milestone-5-pr-a, at 2095a7ac, at 639a96cc and in trial tree 65b9489a. The rest:
- `frontends/shell/src/`:
  - `diagnostics/watchdog.ts`
  - `diagnostics/watchdog.test.ts`
  - `diagnostics/renderTrace.ts`
  - `isInstrumentedBuild.ts`
  - `canvas/pickResolution.ts`
  - `canvas/WorkingCanvas.recentre.test.tsx`
  - `layout/regionParts.tsx` (also at PR A)
  - `layout/actionRegistry.ts` (also at PR A)
- `frontends/shell/e2e/`:
  - `recentre-crossing.mjs`
  - `pan-anchor.mjs`
  - `regression.mjs`
  - `lib.mjs`
  - `checkDistClean.mjs`
  - `README.md` (also at the three heads)
- `frontends/shell/` root files:
  - `.env.measure`
  - `package.json`
  - `package-lock.json`
  - `vitest.config.ts`
- `.github/workflows/product-ci-shell.yml`
- `kernel/tests/manual_walkthrough_fixtures.rs`
- `docs/08_Testing.md`
- `docs/adr/ADR-010-render-frames-origins-boundaries.md`
- `governance/PLAN.yaml`
- `governance/AUTONOMY.md` (§22)
- `governance/forms/frontends/RECENTRE-CROSSING-VIEW-DISPLACED-FIX-PREREGISTRATION.md`
- `state/consults/`:
  - `2026-11-11-platform-recentre-stall-read-and-profile.md`
  - `2026-11-11-pan-anchor-there-and-back-residual-diagnostic-form-architect-draft.md`
  - `2026-11-11-pan-anchor-there-and-back-residual-diagnostic-run-build-worker-report.md`
  - `2026-11-12-recentre-crossing-view-displaced-fix-s6b-s7-worker-report.md`
- `state/directives/`:
  - `2026-11-12-s1-fix-open-a-c-s6b-now-pr-b-class-9-now-1c-five-308-c1-words-platform-reports-order-no-git-stash.md`
  - `2026-11-23-the-humans-message-never-idle-product-first-what-to-build-now-the-pauses-lifted-for-product-pieces-what-does-not-change.md`
  - `2026-11-23-advisor-ruling-adv-2026-11-23-01-the-humans-four-lines-in-force-the-sitting-step-the-2026-11-16-directive-to-the-tag-the-spend-limit.md`
  - `2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md`
  - `2026-11-16-the-humans-directive-the-target-is-v0-2-record-keeping-repeated-runs-pieces-the-machine-models-focus-for-a-week.md`

Untracked evidence, read only:
- `C:/dev/spatial-ide/frontends/shell/node_modules/@deck.gl/core/dist/lib/deck.js` and `dist/lib/attribute/attribute-manager.js` (9.3.9).

Model: claude-opus-5-5 (Opus 5.5).
