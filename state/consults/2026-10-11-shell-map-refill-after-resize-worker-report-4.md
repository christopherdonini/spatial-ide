*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 4, phase 2 completed (the same worker-high, resumed after report 3; its run 01:24:53Z to 01:51:11Z by its transcript). The worktrees were C:/dev/wt/refill at 64de82e6 and D:/wt/refill-base at 4fd3259a; nothing was committed. All 14 pairs have run; the RESIZEQ step mutation was observed at 64de82e6 and reverted. Console's K7 difference waits on the custodian's solo base run. It arrived as a message and is extracted here by script from the last SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is a4698740b30612678b075c635aa5bc011a768c0304146a8fb84ed28840892969.*

---

REPORT 4: shell-map-refill-after-resize, phase 2 completed. All 14 pairs have now run (console's base arm was run in the earlier batch). The RESIZEQ mutation (C) was observed and reverted. No stop rule fired in this batch: I2 did not fire, there was no exit code 96 to 99, and I saw no new timing-sensitive failure. I changed no tracked file and made no commit. The model observed is Sonnet 5.5.

## Setup held fixed
- Commits:
  - base `4fd3259a3e274dbc1f0a9c3ad72d168096a20e23`
  - head `64de82e688aac402264d225852c70c752148971a`
- Exe: `D:/wt-targets/reaim-base/exes/spatial-ide-shell-refill.exe` (sha256 `9497bd712c2c9eecb4a5afc9618f1507651f3682c657ac49272384fe3f46c8ae`).
- Each run was in its own shared hold, with the hold granted and released.
  - Each run had a fresh launch, and `app-down` ran before and after it.
  - Each run header line in `refill/out/<suite>-<arm>.log` names the worktree and commit.
- Fixtures: the same two hashes as in reports 2 and 3. The suites that print them, source-changed, source-watch-idle and layout, show them unchanged across the run:
  - `filter-zoned.parquet`: `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`
  - `100k-happy-path.parquet`: `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49`

## Runs in this batch (exit code, hold granted and released for each)

| Suite | base rc | head rc | Failing steps |
|---|---|---|---|
| console | 1 (earlier batch) | 0 | none at the head |
| residency-harness, default | 0 | 0 | none |
| source-changed, default route | 0 | 0 | none |
| source-changed, post route (`SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post`) | 0 | 0 | none |
| source-watch-idle | 0 | 0 | none |
| pan-anchor | 0 | 0 | none |

## Pair comparisons, step by step
- **console, head arm against the base log from report 3:**
  - HEADER', ECHO', TWOCMD', HEXLIM', REFUSAL', CLASSB', CLASSC', COPYTRUNC' and UNCLASS' are PASS at both: same.
  - REGRESS' differs. The base had a FAIL carrying the nested regression's K7. The head has this, byte-copied from `console-head.log`: `[REGRESS'] PASS (333379ms): npm run e2e:regression exited 0 (307981ms); npm run e2e:admission exited 0 (25398ms); both attached to THIS run's own already-launched app (same fresh session)`
  - This is the K7 difference you set aside until the custodian's solo base run. There is no other difference. The head's console rc is 0.
- **residency-harness, default (instrument-on):**
  - It reports a "baseline" arm and `[gridFrame] null` at both.
  - The 12 measured steps are the same: open-drain, fit, pan-north, pan-east, pan-south, pan-west, pan-northeast, zoom-to-layer, zoom-in-1, zoom-in-2, zoom-in-3 and zoom-out-1. They have the same features and bytes, and rc 0 on both arms.
  - The suite claims no verdicts, and its timing values are not compared.
  - Verdict: same.
- **source-changed, default route:** S1-open, S2, S3-retarget-junction, S4-issue-one-query, S5a, S5b, S5c and fixture-integrity are PASS at both. Verdict: same.
  - At the base, the "17 -> 19" in S4 appears in the log as `a viewport_query followed the "pan-beyond-viewport" gesture (17 -> 19 in the render trace)`. The head shows the same text.
- **source-changed, post route:** nine steps with the same statuses. S3-touch-mtime is INFO ("deferred to S4"), and the others, including S5d-post-check-route-confirmed and fixture-integrity, are PASS. Verdict: same.
- **source-watch-idle:** W1 to W4, F0 to F3 and fixture-integrity are all PASS at both. Verdict: same.
  - F0 reads "viewport_query count unchanged at 17" at both arms.
- **pan-anchor:** 16 of 16 PASS at both, with window sizes 328x576 and 788x836. The step lists are identical (a mechanical diff gave no difference). Verdict: same.
- **Earlier pairs (reports 3 and 2):** regression, refusal-contract-baseline, admission, filter, filter-panel, style and publish were the same step for step. Layout differed only as predicted: RESIZEQ passed at the head with 72 queries, FILL failed I3 at the head, and BURST recorded 0 `viewport_query` lines.

## RESIZEQ mutation (C), at the head, commit `64de82e688aac402264d225852c70c752148971a`
- **Edit:** in `frontends/shell/src/canvas/WorkingCanvas.tsx`, I deleted lines 1946 to 1950, the `onResize: () => { … },` handler in the Deck props (5 deletions, nothing else). I ran `layout.mjs`, the tracked file, on a fresh launch, so vite served the edit. The log is `layout-mut-resizeq-head.log` and the exit code was 1.
- **Failing step:** RESIZEQ, byte-copied: `RESIZEQ: closing the Inspector gave 0 new viewport_query lines within 3000ms, expected at least 1 (predicted new cells 96)`. This is the expected close count of 0.
- **Other steps in that run:**
  - FILL failed with the same I3 message as at the head: `FILL: no zoom within 15 further notches satisfies the precondition (growth per side 156px, cell 1584.129979002464): invalidator I3, STOP and report`. I recorded that and nothing more.
  - BURST passed, recorded only: 24 moves, 0 `viewport_query` lines.
  - Every other step passed.
- **Reverted** with `git checkout -- frontends/shell/src/canvas/WorkingCanvas.tsx`. `git status --porcelain` is empty in the head worktree. Nothing was committed.
- The FILL mutation was not run, as you said.

## Invalidators and H1
- **I1:** did not fire. The RESIZEQ mutation shows the check can fail: 0 `viewport_query` lines without `onResize`, against 72 with it.
- **I2:** did not fire in any of the 14 pairs. The only difference is console's REGRESS' (set aside, above).
- **I3:** fired in report 2 and fires again in the mutation run, which is expected (FILL's precondition has no satisfying zoom, per the diagnostic table in report 3).
- **I6:** did not fire.
- **H1:** a region toggled is shown by RESIZEQ (72 lines then 0) and by the mutation run (0 lines without `onResize`). FILL never completed. A splitter dragged is shown by BURST, which recorded 0 lines in each layout run at the head. A window resize has no step that counts queries, and I added none.

## Final state
- Head worktree `C:/dev/wt/refill`: HEAD `64de82e688aac402264d225852c70c752148971a`, `git status --porcelain` empty.
- Base worktree `D:/wt/refill-base`: HEAD `4fd3259a3e274dbc1f0a9c3ad72d168096a20e23`, `git status --porcelain` empty.
- No app, vite or hold of mine is running. Nothing is listening on ports 9223 or 5400, and the holds folder is empty.
- Logs: the scratchpad's `refill/out/`, named `<suite>-<base|head>.log`, plus `layout-mut-resizeq-head.log`, `fill-diag.log` and `fill-diag-head.log`. The diagnostic diff is `refill/layout-diag.diff`. I did not re-run the diagnostic.
