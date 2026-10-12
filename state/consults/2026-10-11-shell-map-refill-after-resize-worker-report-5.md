*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 5, phase 3 (FILL-prime under the form's Amendment 2), the worker-high run 02:06:36Z to 02:17:18Z by its transcript, on cut/shell-map-refill-after-resize, fix head cf24f9b41b218e798d365587db57bb82230a0ed4, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 4e38a7815e6f67ad5885b2494aad3b999238f9520ca34eaf84f18be45d8d2465.*

---

REPORT: shell-map-refill-after-resize, phase 3 (FILL′ under Amendment 2). Done. No stop condition fired: I1, I2, I3 and I6 did not fire, no §8 item was breached, no path outside item 13's three files was needed, no timing-sensitive failure appeared, and no exit code 96 to 99 came back. I observed myself running as Sonnet 5.5. I got no context handoff and produced none. The form governs and I followed it. Differences from it are listed near the end.

## Commits (branch cut/shell-map-refill-after-resize, on top of 64de82e6, all `git commit -s`, each ending with the Co-Authored-By trailer)
- 6776dcb5: test: FILL′ replaces FILL's search and precondition. This commit is layout.mjs only.
- d6115bcf: docs: walkthrough Part V's V1 is one wheel notch (item 11).
- cf24f9b4: docs: e2e README's FILL sentence restated for FILL′ (item 12).
- **Fix head = cf24f9b41b218e798d365587db57bb82230a0ed4.** `git diff --name-only 64de82e6 HEAD` lists exactly three paths: `frontends/shell/MANUAL-WALKTHROUGH.md`, `frontends/shell/e2e/README.md` and `frontends/shell/e2e/layout.mjs`. Item 13's condition holds, so the pairs recorded at 64de82e6 stand.
- The branch is published: origin/cut/shell-map-refill-after-resize is at cf24f9b4. I opened no pull request.

## FILL′ as written (layout.mjs)
- After E-REOPEN it waits for the grid frame and settles fully. It marks the trace (`markView`) and makes one declared wheel notch at the canvas centre (`ZOOM_NOTCH_DELTA_Y`), then settles fully.
- If the zoom did not change, it stops with I3. The old check for that stays.
- Precondition part (i): `.residency-status` must match `/^Showing all \d+ features in view$/`. This is a restatement of regression.mjs's FIND_WITHIN_BUDGET_PATTERN (regression.mjs:1993 reads `const FIND_WITHIN_BUDGET_PATTERN = /^Showing all \d+ features in view$/;`). The comment says it is restated because an e2e module imports no sibling suite. A mismatch stops with I3.
- Precondition part (ii), the qualifying-cell count:
  - take `tilesCoveringBbox(frame, frame.level, ...)` for the last view-state line at width `size.width + inspectorGrowthPx`;
  - remove every cell covered by any view-state line after the mark, at the size before the toggle;
  - keep only cells whose `tileBbox` lies wholly inside PARCEL_AREA.
- The count is taken before the toggle. It is taken again at the canvas size measured after the toggle, after the 10 s assertion loop and before the assertion is thrown. Below one on that confirmation throws "outcome void ... I3, STOP", ahead of the assertion error.
- The assertion (at least 1 `stream-issued`, and at least 1 `batch` line with rows > 0 on those handles, within `FILL_WINDOW_MS`), the settle and the `finally` restore are unchanged.
- `MAX_FILL_NOTCHES` is removed. `lastViewState` is split into `parseViewState(text)` plus a one-line `lastViewState`, so the lines after the mark can be parsed. RESIZEQ still calls `lastViewState` as before.
- The result line records the zoom before and after, both qualifying counts, the stream count and the row count.
- PARCEL_AREA is `{ xmin: 2_600_000, ymin: 1_200_000, xmax: 2_612_680, ymax: 1_212_600 }`, an e2e-local declared value. The comment above it cites these lines. I read every number from the files at the branch (identical to main's 76c3ea34 for these files), and I checked the arithmetic with node:
  - kernel/tests/manual_walkthrough_fixtures.rs:43-54: `features: 100_000` (line 48);
  - engine/src/fixture.rs:566: `domain: CoordinateDomain::Lv95Metres`;
  - engine/src/fixture.rs:67-68: `E_LO = 2_600_000.0` and `N_LO = 1_200_000.0`;
  - engine/src/fixture.rs:93: `Self::Lv95Metres => (E_LO, N_LO, 40.0)`;
  - engine/src/fixture.rs:1258-1266: `cols = ceil(sqrt(features))`, `gx = id % cols`, `gy = id / cols`, `cx = x_lo + gx*cell + cell/2`, `cy = y_lo + gy*cell + cell/2`;
  - engine/src/fixture.rs:1273: the ring is drawn around `(cx, cy)` with radius `cell * 0.42`;
  - node result: ceil(sqrt(100000)) = 317, 317 × 40 = 12680, floor(100000/317) = 315, 315 × 40 = 12600, 315 × 317 = 99,855. The partial row holds 145 parcels and lies outside the area.

## The layout run at the fix head
- Log: the scratchpad's `refill/out/p3-layout-head.log`, plus the saved entries in `p3-layout-head-results.json`.
- Run header: worktree C:/dev/wt/refill, head cf24f9b41b218e798d365587db57bb82230a0ed4, the same exe. The hold was shared, granted and released. rc=0. The script returned no code from 96 to 99, and app-down reported ports 9223 and 5400 free.
- Step status: OPEN, E-KEYS, E-FIELD, E-LANDMARKS, E-FOCUS, E-FIT, E-FLOOR, RESIZEQ, E-REOPEN, FILL, BURST and FIXTURES are all PASS.
- FILL, byte-copied from the log: `[FILL] PASS (12664ms): one wheel notch at the canvas centre (zoom -4.169346624228335 -> -3.2394433553937008); qualifying cells 2 before the toggle (480+312px wide) and 2 after (758x576 measured); closing the Inspector issued 10 streams carrying 810 rows, and the trace settled`
  - The notch landed at zoom −3.2394, as predicted.
  - The qualifying count was 2 before and 2 after, as predicted.
  - The DOM growth was 312 px. The measured canvas went 480 → 758 px, the same as RESIZEQ.
- The trace lines after the toggle, from the saved entries. Times are relative to the first line after the 3343 ms quiet gap that follows the notch's settle. The gap's end is the first trace activity after the toggle; the trace carries no entry for the key press itself.
  - The first `stream-issued` is at +7 ms (handle sh_5feadb0f…). Ten `stream-issued` lines in all, by +220 ms.
  - The first `batch` line with rows > 0 is at +182 ms: `[render-trace] batch {streamHandle: sh_cd4de158be74edaf52e9bc9c0bebd61a, batchSeq: 0, rows: 162, vertices: 3161, cumulativeRows: 162}`. That handle was issued at +54 ms.
  - Four batches on issued handles (162, 485, 2 and 161 rows) had arrived by the poll that ended the assertion loop. That sum is the 810 in the note.
  - By +534 ms, batches on those ten handles had delivered 3902 rows in total (my sum of the saved lines).
  - The assertion window is 10 s, so it passed well inside it. The two lines the assertion needs are both within about 0.2 s of the first post-toggle line.
- BURST, byte-copied: `[BURST] PASS (9934ms): RECORDED, NOT ASSERTED: 24 moves of 4px; 0 viewport_query lines at ms after the first move [] (last move at 399 ms, release at 401 ms)`.
- Fixture hashes printed by the suite (equal before and after):
  - filter-zoned.parquet: `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`.
  - 100k-happy-path.parquet: `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49`.

## Comparison with report 2's head run (step by step, after stripping the elapsed times)
- OPEN, E-KEYS (map sizes 934x736 668x736 1014x736 668x736 668x530 668x736), E-FIELD, E-LANDMARKS, E-FOCUS, E-FIT (668x530 and 754x498), E-FLOOR (480x320), RESIZEQ (72 new `viewport_query` lines, reopen 0, predicted 96 cells, 480x576 → 758x576), E-REOPEN and FIXTURES are identical in status and note text.
- FILL changed from FAIL (I3) to PASS. This is the intended change.
- BURST has the same outcome and the same 0 lines. Only the last-move and release timings differ: 399/401 ms against 397/400 ms.
- Nothing else differs, so I2 did not fire.

## Mutations (each on a fresh launch with vite serving the edit, at HEAD cf24f9b4, each in its own shared hold with rc 1; both reverted, `git status --porcelain` empty after each)
- **RESIZEQ.** The edit deleted the `onResize: () => {...},` property (five lines, 1946-1950) from the Deck props in `frontends/shell/src/canvas/WorkingCanvas.tsx`. Log: `p3-mut-resizeq-head.log`.
  - Failing step: `[RESIZEQ] FAIL (11974ms): RESIZEQ: closing the Inspector gave 0 new viewport_query lines within 3000ms, expected at least 1 (predicted new cells 96)`. The close count is 0, as expected.
  - FILL also failed under this edit, as it must with no resize handler: `[FILL] FAIL (18657ms): FILL: within 10000ms of closing the Inspector 0 streams were issued and 0 rows arrived on them, expected at least 1 stream and 1 row (qualifying cells 2 before, 2 after; zoom -3.2394433553937008)`. BURST and the other steps passed.
- **FILL′.** The edit changed line 1948 from `reportViewport(decision.bbox)` to `reportViewport(lastQueriedRef.current!)`. Log: `p3-mut-fill-head.log`.
  - Failing step, byte-copied: `[FILL] FAIL (18892ms): FILL: within 10000ms of closing the Inspector 0 streams were issued and 0 rows arrived on them, expected at least 1 stream and 1 row (qualifying cells 2 before, 2 after; zoom -3.2394433553937008)`. This is the expected failure on 0 streams, with the precondition holding (2 and 2).
  - **RESIZEQ also failed under this mutation:** `RESIZEQ: closing the Inspector gave 0 new viewport_query lines within 3000ms, expected at least 1 (predicted new cells 96)`. Reporting `lastQueried` issues no new lines, so RESIZEQ cannot pass either. The form expected only FILL to fail; this is an observation, not a conflict.
- Neither mutation was committed. After each revert, `git status --porcelain` was empty and HEAD was cf24f9b4.

## `npm run verify` (frontends/shell, fix head, one shared hold)
- Log: `p3-verify.log`. The hold was granted and released. The script's overall rc=0, with every part passing:
  - typecheck;
  - check:dev-origin;
  - check:origin-event;
  - verify:adr-index;
  - build;
  - check:dist-clean;
  - check:dist-notice;
  - test: 78 files and 1193 tests passed;
  - test:residency-trace: 76 passed, 0 failed;
  - test:citation-integrity: 30 passed, 0 failed.
- The log does not give separate exit codes for each part. `npm run verify` chains them with `&&`, so rc=0 means each one passed.
- `node scripts/plan/verify-quotes.mjs --show-cites` on layout.mjs alone passes. Over all three changed files it reports 28 "quote not found" lines in MANUAL-WALKTHROUGH.md at lines 122 to 1433. None is at the line I edited (1769), and none is in Part V. I did not investigate them. They look like older Parts' entries that need the repo-wide baseline.

## §7 count (form's command, base 4fd3259a, at cf24f9b4; insertions + deletions)
- G1: viewportBbox.ts 31 (limit ≤ 45), WorkingCanvas.tsx 40+7 = 47 (limit ≤ 90), App.tsx 6 (limit ≤ 15). Group total 84 (limit 150).
- G2: viewportBbox.test.ts 52 (limit ≤ 120), WorkingCanvas.test.ts 19 (limit ≤ 40), App.layout.test.tsx 63 (limit ≤ 90). Group total 134 (limit 250).
- G3: layout.mjs 178+13 = 191 (ceiling 200 per item 8, so within it). Group total 191.
- Total: 387 added + 22 removed = 409 (limit 600), over 7 files.
- Outside the count: MANUAL-WALKTHROUGH.md 28 added, 0 removed = 28 (limit ≤ 30); e2e/README.md 1+1 = 2 (limit ≤ 12); KNOWN-LIMITATIONS.md 2+3 = 5 (limit ≤ 8).
- There is no overrun. I trimmed nothing.

## §8, item by item (read from the diff 4fd3259a...HEAD and from this phase's three files)
1. No timer, debounce, throttle or new constant in the resize path. The only timer text in added lines is a 300 ms wait in the App.layout test, and it is not in the product resize path.
2. `onViewportChangedRef.current` is called once, in `reportViewport` (WorkingCanvas.tsx:1023). The other two matches are the ref assignment and a doc comment.
3. A size change inside the last asked box gives `within`, which issues no query (RF2 and RF6 are the unit tests). The e2e reopen count of 0 agrees.
4. Before the first reported view, `lastQueried` is null and the result is `none` (RF4).
5. The added WorkingCanvas lines contain no `viewManager`, `getViewports`, `viewState` read, `unproject` or `pickObject`.
6. The handler calls only `reportViewport` or the within prop. It does not touch hover, re-pick or the origin.
7. Changed paths are the ten listed in §2.8 plus KNOWN-LIMITATIONS.md. Nothing is under engine/, kernel/, protocol/, src-tauri/, skp/, streaming/ or residency/.
8. The App.tsx hunk is at line 1844, below `return (` at line 1652.
9. No package or lockfile change.
10. `onViewportWithinLastQuery` has a product caller (App.tsx). `ViewportCamera` and `viewportAfterResize` are exported and used. `ResizeViewport` is not exported (commit 64de82e6).
11. The only e2e files changed are layout.mjs and README.md. No threshold value changed. The FILL_WINDOW_MS line differs only in the message text I appended. `e2eSetViewState` and `setViewState` do not appear in layout.mjs.
12. No performance claim or docs/08 row in the added lines. The only hits for performance-claim words are the walkthrough's existing "No duration appears" disclaimer and an existing "within 60000ms" error message.
13. This phase changed only V1 in the walkthrough, and the sentence claims nothing beyond §4. Item 39 is unchanged in this phase.
14. The added product code contains only comments, no new strings.
15. I wrote no quote of the human's words in this phase.
16. FILL′, the only new test of this phase, has its mutation observed above, at cf24f9b4. The unit tests' mutations were recorded earlier in 4769dc33. I read only that commit's subject.

## Differences from the form or brief
- FILL′ is as item 4 declares. The only liberty is where the confirmation sits (after the 10 s loop and before the assertion is thrown), so that a void I3 takes precedence over a FAIL, as item 4 step 5 says.
- The note's "810 rows" is the count at the poll that ended the assertion loop. The same 10 streams delivered 3902 rows in the trace by +534 ms.
- The FILL′ mutation also fails RESIZEQ (see above).
- The brief's single trailer was used. I did not add a Claude-Session trailer.
- The scratchpad's `out/` already held `layout-mut-resizeq-head.log` from before this phase. I did not touch it. My logs are tagged `p3-`.

## Final state
- Branch `cut/shell-map-refill-after-resize`: HEAD cf24f9b41b218e798d365587db57bb82230a0ed4, `git status --porcelain` empty, published (origin is at the same id).
- No app, vite or hold of mine is running. Ports 9223 and 5400 are free, and the holds folder is empty. I did not touch the base worktree, main, `layout-diag.mjs`, the earlier logs, or `crs/`, `reaim2/` and `cust2/`.
- The logs are in the scratchpad's `refill/out/`: `p3-layout-head.log`, `p3-layout-head-results.json`, `p3-mut-resizeq-head.log`, `p3-mut-fill-head.log`, `p3-verify.log`, and the matching `.down.txt` files.
