*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 6, correction round 1 of 2 under the form's Amendment 3 (the worker-high run 02:47:30Z to 03:21:19Z by its transcript), on cut/shell-map-refill-after-resize, final head 9e657db1f5e2f155ba6704b46db1964a2c3925e3, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 0ba51c06f374e3c0f50d95912a89e2ab6e38f3a04679e51c6c2b23d7120f3817.*

---

REPORT: shell-map-refill-after-resize, correction round 1 (Amendment 3 item 3 and the two comment fixes). I observed myself running as Sonnet 5.5. No stop rule fired: not I1, I2, I3, I6 or I8, no exit code 96 to 99, no §8 breach, no path outside item 5, no timing-sensitive failure. The scratchpad's refill/out/ holds every log, tagged r1-.

## Commits (cf24f9b4 to the final head)
- da28d15e fix: lastQueried is cleared at a new filter generation and at the unreported auto-fit (Amendment 3 item 3). This commit also carries the D5 doc fix.
- cbee3688 test: RF10 reads the source for the two lastQueried clears and the three camera writes.
- da0fc49e docs: layout.mjs's two comments state that the file loads shell modules through loadShellModule (D4).
- 9e657db1 test: record the observed mutations of RF10 with the commit they were observed at.
- **Final head: 9e657db1f5e2f155ba6704b46db1964a2c3925e3.** Each commit is signed off and carries the trailer.

## Product lines as committed (WorkingCanvas.tsx, 8 added and 3 removed)
- `lastQueriedRef` doc now reads: `The box last passed to onViewportChanged, or null. Non-null only while the camera's last write was reported: the auto-fit and resetFitForNewGeneration (a new filter generation) clear it.`
- `fitToExtent`: the `if (notifyViewport) { ... }` block gained `} else {` followed by `lastQueriedRef.current = null; // a write that does not report leaves no area "last asked for"`.
- `resetFitForNewGeneration()`: a third line, `lastQueriedRef.current = null;`, after `fitAnchorRef.current = null;` and `hasAutoFitRef.current = false;`. The handle's doc gained two lines, "It also clears the area last reported, so a size change asks nothing until the next report (the auto-fit that follows does not report)."
- D5: the `onViewportChanged` doc now says `... an origin recenter, Zoom to layer's fit -- not only a`.
- App.tsx, `viewportAfterResize` and `reportViewport` are untouched.

## RF10 as committed
It sits inside RF7's describe, in `src/canvas/WorkingCanvas.test.ts`. Three expects, in order:
1. `source.slice(reset, source.indexOf("},", reset))` contains `lastQueriedRef.current = null;`, where `reset = source.indexOf("resetFitForNewGeneration() {")`.
2. `source.slice(fit, source.indexOf("\n  }\n", fit))` matches `/if \(notifyViewport\) \{[\s\S]*?\} else \{[^}]*lastQueriedRef\.current = null;/`, where `fit = source.indexOf("function fitToExtent(")`.
3. `source.match(/cameraRef\.current = /g)?.length` is 3.

The test name is "RF10: a new filter generation and the unreported fit clear lastQueriedRef, and the camera is written in exactly three places". Its comment (4 lines) records the mutations in the pattern of RF7's comment. In that comment the failure messages are abbreviated with "..." and are not marked verbatim.

## RF10 mutations
All three were observed at da0fc49ef4f75d0c9c1b46977323e7a4daef5f45. Each was run with `npx vitest run src/canvas/WorkingCanvas.test.ts -t "RF10"`, reverted with `git checkout --`, and `git status --porcelain` was empty after each. The file's unmutated run at the final head is 41 of 41 passed.
- **(a)** I deleted the `lastQueriedRef.current = null;` line in `resetFitForNewGeneration` (-1). RF10 failed. Byte-copied: `AssertionError: expected 'resetFitForNewGeneration() {\n       …' to contain 'lastQueriedRef.current = null;'`.
- **(b)** I deleted the 3-line `else` branch in `fitToExtent` (-2 net). RF10 failed. Byte-copied: `AssertionError: expected 'function fitToExtent(bbox: Authoritat…' to match /if \(notifyViewport\) \{[\s\S]*?\} el…/`.
- **(c)** I duplicated the fit's `cameraRef.current = {...}` line (+1). RF10 failed with `AssertionError: expected 4 to be 3 // Object.is equality`.

## Head arm of all 14 suites
The head was 9e657db1 (the exe's sha256 is unchanged: 9497bd71...46c8ae). Each run was in its own shared hold, on a fresh launch, with the hold granted and released. All exited 0.

Step-by-step comparisons use the standing base logs, with step name and status compared and the detail text compared with ms masked.

1. **layout:** rc 0, 11 steps, all PASS. Against `layout-base.log` the statuses are the same for the base's 9 steps. The head adds FILL and BURST, and RESIZEQ goes from recorded to asserted (details below). The step-by-step comparison is identical to report 4's and 5's prediction.
2. **regression:** rc 0, 18 steps, statuses identical. Only the K7 detail figure differs: "went quiet within its wait bound on 11/15 notches (last trace count 16027)" at the base, 15/15 (16847) at this head. Across the standing logs the figure takes the values 11/15, 12/15 and 15/15, so it varies from run to run. The outcome is PASS at both.
3. **refusal-contract-baseline:** rc 0, 3 steps, statuses identical. Only the stream handle id differs.
4. **admission (`admission-remediation.mjs`):** rc 0, 11 steps, statuses identical. Only the ASSERT' provenance timestamp differs.
5. **filter:** rc 0, 3 steps, identical to the detail.
6. **filter-panel:** rc 0, 5 steps, identical to the detail.
7. **style:** rc 0, 6 steps, identical to the detail.
8. **publish:** rc 0, 5 steps, statuses identical. Only attempt ids, paths and timestamps differ.
9. **console** (against `console-solo-base.log`): rc 0, 11 steps, statuses identical. REGRESS' is PASS at both. Its durations differ (regression 287102 ms against 301394 ms, admission 24227 ms against 24231 ms).
10. **residency-harness, default:** rc 0. The "baseline" arm and `[gridFrame] null` match at both. The 12 steps match in features and bytes: open-drain, fit, pan-north, pan-east, pan-south, pan-west, pan-northeast, zoom-to-layer, zoom-in-1 to 3, zoom-out-1. Only the timings differ, and they are not compared.
11. **source-changed, default route:** rc 0, 7 steps, statuses identical. S4 still reads "17 -> 19 in the render trace". Only paths and the mtime stamp differ.
12. **source-changed, post route:** rc 0, 8 steps, statuses identical. S5d-post-check-route-confirmed is PASS at both. Only paths differ.
13. **source-watch-idle:** rc 0, 8 steps, statuses identical. F0 reads "viewport_query count unchanged at 17" at both. Only the path differs.
14. **pan-anchor:** rc 0, 16 of 16 PASS (window sizes 328x576 and 788x836). A mechanical diff of base against head, with ms and process ids masked, is empty.

I2 did not fire in any of them. The differences above are ids, paths, stamps, durations, and K7's quiet-notch count.

## Layout lines (byte-copied from `r1-layout-head.log`)
- `RESIZEQ PASS closing the Inspector gave 72 new viewport_query lines within 3000ms (base: 0), reopening gave 0; predicted new cells 96 (recorded beside the observed count; 480x576 -> 758x576 CSS px), the trace settled after the close`
- `FILL PASS one wheel notch at the canvas centre (zoom -4.169346624228335 -> -3.2394433553937008); qualifying cells 2 before the toggle (480+312px wide) and 2 after (758x576 measured); closing the Inspector issued 10 streams carrying 649 rows, and the trace settled`
- `BURST PASS RECORDED, NOT ASSERTED: 24 moves of 4px; 0 viewport_query lines at ms after the first move [] (last move at 465 ms, release at 469 ms)`
- Fixtures, unchanged before and after: `filter-zoned.parquet` sha256 `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`; `100k-happy-path.parquet` sha256 `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49`.
- The same layout.mjs at 64de82e6-era head (`p3-layout-head`) gave 810 rows on the same 10 streams. The row count is a recorded figure and varies; the assertion needs at least 1.

## Both e2e step mutations (with layout.mjs, final head 9e657db1, fresh launch each, own hold each, rc 1 each)
1. **Remove `onResize`:** I deleted the 5-line `onResize: () => {...},` property from the Deck props (WorkingCanvas.tsx lines 1951 to 1955). Log: `r1-mut-resizeq-head.log`.
   - RESIZEQ FAIL, byte-copied: `RESIZEQ: closing the Inspector gave 0 new viewport_query lines within 3000ms, expected at least 1 (predicted new cells 96)`.
   - FILL also FAIL: `FILL: within 10000ms of closing the Inspector 0 streams were issued and 0 rows arrived on them, expected at least 1 stream and 1 row (qualifying cells 2 before, 2 after; zoom -3.2394433553937008)`.
   - BURST and every other step PASS.
2. **Report `lastQueried` instead of the new box:** I changed `reportViewport(decision.bbox)` to `reportViewport(lastQueriedRef.current!)` at WorkingCanvas.tsx line 1953. Log: `r1-mut-fill-head.log`.
   - RESIZEQ FAIL with the same message as above.
   - FILL FAIL with the same message as above.
   - Every other step PASS. As report 5 saw, this mutation fails RESIZEQ as well as FILL.
3. Each edit was reverted with `git checkout --`, and `git status --porcelain` was empty after each.

## `npm run verify` (`frontends/shell`, own hold)
- It exited 0. The log is `r1-verify.log`.
- Parts that ran in order, all passing:
  1. typecheck;
  2. check:dev-origin;
  3. check:origin-event;
  4. verify:adr-index;
  5. build;
  6. check:dist-clean;
  7. check:dist-notice;
  8. test: 78 files and 1194 tests passed;
  9. test:residency-trace: 76 passed, 0 failed;
  10. test:citation-integrity: 30 passed, 0 failed.

## Governance suites (own hold, in the worktree at 9e657db1)
Each tool's commit is the last commit touching its script in this tree.
- `node scripts/plan/verify-cites.mjs` (tool commit 04f6332b35271afd234fd931f9df9993a9cd06f3): rc 0. "verify:cites PASS — every rooted (in-tree) path:line reference across 1685 file(s) resolves. (49 loose reference(s) advised above.)"
- `node scripts/plan/verify-quotes.mjs` (tool commit f9444a4d99a9087394c55d4b1d4c414a8b11f980): rc 0. "121 checked, 90 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined)".
- `node scripts/plan/verify-test-claims.mjs` (tool commit e9735d4749f094f03b69a8b570e8bf10f511c279): rc 0. "all 534 claimed test(s) across 156 file(s) exist or are planned, superseded or withdrawn".
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs scripts/evidence/*.test.mjs` (the three folders' last commit is c813c6ab74ce4c8e32eb63a6357930a4715880a3): rc 0. 457 tests, 457 pass, 0 fail.
- `verify-quotes --show-cites` over the 10 changed files: rc 1. The 28 findings are all "quote not found" in `frontends/shell/MANUAL-WALKTHROUGH.md`, at lines 122 to 1433. It is the same kind of finding report 5 saw over its three files. **None is on a line this PR adds.** The PR adds MANUAL-WALKTHROUGH.md lines 1762 to 1789 (Part V), and no finding falls in that range. There is no finding in any other changed file. The repo-wide run, with its baseline, passes (rc 0 above).

## §7 count (the form's command, base 4fd3259a, at 9e657db1)
Round 1's added lines are in the right-hand column.

| File | Lines | This round |
|---|---|---|
| viewportBbox.ts | 31 | 0 |
| WorkingCanvas.tsx | 54 | +7 |
| App.tsx | 6 | 0 |
| viewportBbox.test.ts | 52 | 0 |
| WorkingCanvas.test.ts | 32 | +13 |
| App.layout.test.tsx | 63 | 0 |
| layout.mjs | 195 | +4 |

- **G1** (viewportBbox.ts, WorkingCanvas.tsx and App.tsx): 91, at most 97 expected, ceiling 150.
- **G2** (the three test files): 147, at most 155 expected, ceiling 250.
- **G3** (layout.mjs): 195, ceiling 200. Amendment 3 expected no change to G3. It rose from 191 to 195 because the D4 comment rewording changes 2 lines (2 added, 2 removed).
- **Total:** 433, at most 443 expected, ceiling 600.
- WorkingCanvas.tsx at 54 is within the expected 60. WorkingCanvas.test.ts at 32 is within the expected 40. No ceiling is exceeded and there is no overrun.
- Outside the count: KNOWN-LIMITATIONS.md 5 lines, MANUAL-WALKTHROUGH.md 28, e2e/README.md 2. This round touches none of them.

## §8 items 1 to 16, as amended
1. A timer, debounce, throttle or constant in the resize path: none. This round's product change is two assignments and comments.
2. A second call site of `onViewportChangedRef.current`: none. RF7 passes (count 1).
3. A query on a size change whose box lies inside the last asked box: none. `viewportAfterResize` is unchanged and RF2 and RF6 pass. RF10 holds the invariant.
4. A query before any view reported since the open, the last Apply or Clear, or the last auto-fit (amended): held by the two clears. RF10 guards the clears, RF4 guards the null case. No e2e step shows paths (a) or (b), as Amendment 3 item 4 states.
5. A read of deck's view state: none added.
6. A size change that arms a re-pick, changes a hover readout or moves the origin: none. The handler is untouched.
7. A file outside §2.8, or a forbidden path: none. This round edited WorkingCanvas.tsx, WorkingCanvas.test.ts and layout.mjs (comments only).
8. An App.tsx edit above `return (`: none. App.tsx is untouched this round.
9. A dependency or lockfile change: none.
10. A callback, option or export without a product caller: none added.
11. An e2e file other than layout.mjs edited, a threshold edited, or `e2eSetViewState` called from layout.mjs: none this round. layout.mjs changed in two comment lines only, with no executable line changed (`node --check` passes).
12. A performance claim or a docs/08 row: none.
13. A KNOWN-LIMITATIONS or walkthrough sentence claiming more than §4 shows: untouched this round.
14. A new product string: none.
15. A quote marked verbatim that does not match its source: none written. The RF10 comment's failure messages are abbreviated with "..." and are not marked verbatim.
16. A new test without its observed mutation: RF10's three are observed above, at da0fc49e.

## Differences from the form
- The mutations were observed at da0fc49e, the head before the comment-only commit 9e657db1. The e2e mutations were observed at the final head 9e657db1.
- G3 rose by 4 (see §7 above), within the ceiling.
- FILL′'s row count (649) differs from the earlier head run's 810. Both exceed the required minimum of 1.
- K7's quiet-notch count differs between runs (see run 2). Neither is a step difference.
- One of my polling loops raced the log's creation. It printed a grep error once, and the run itself was unaffected.
- The brief said to stop if a step needs a path outside item 5, and none did.
- Off-scope, noticed but not done: layout.mjs line 420's comment ("an e2e module imports no sibling suite") is still true, so I left it. Gate 1's D4 named only the lines at 35 and 273.

## Final state
- Branch `cut/shell-map-refill-after-resize`, HEAD 9e657db1f5e2f155ba6704b46db1964a2c3925e3.
- `git status --porcelain` is empty.
- The branch is published: `origin/cut/shell-map-refill-after-resize` equals HEAD.
- `git diff --name-only 4fd3259a HEAD` lists nothing under `src-tauri/` and no Rust input.
- No pull request was opened and the PR body is unedited. The base worktree was not touched.
- No app, vite or hold of mine is running. Ports 9223 and 5400 are free and the holds folder is empty.
