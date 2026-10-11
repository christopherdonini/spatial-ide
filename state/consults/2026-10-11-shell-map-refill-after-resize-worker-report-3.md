*Custodian's filing note (2026-10-11): shell-map-refill-after-resize worker report 3, phase 2 continued on the custodian's word (the same worker-high, resumed; its run 00:19:57Z to 01:24:53Z by its transcript, after report 2). The worktrees were C:/dev/wt/refill at 64de82e6 and D:/wt/refill-base at 4fd3259a; nothing was committed. It stopped at the console pair on a K7 failure in the shared base run, which the machine rule sends to the custodian for a solo re-run. It arrived as a message and is extracted here by script from the last SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 5b78111645b3efbac7364ea545272dd796474d7fe113a9821bc3895d64728f84. The diagnostic table corrects the custodian's reading in report 2's PLAN record: the grid level stays medium at every zoom, so a stale level is not the cause of I3.*

---

REPORT 3: shell-map-refill-after-resize, phase 2 continued. The FILL diagnostic ran (A). Pairs 2 to 8 ran and are step-for-step the same (B). I stopped at the console pair because a K7 failure appeared in the shared console run at the base (see "Stop"). Pairs 9 to 14 and the RESIZEQ mutation (C) have not run. I changed no tracked file and made no commit. The model observed is Sonnet 5.5.

## Stop (not recorded as a failure, needs the custodian's word)
- **What failed:** console at the base, rc 1. The only FAIL step is REGRESS', which runs `npm run e2e:regression` inside console. Byte-copied from `console-base.log`:
  `[K7] FAIL (158101ms): K7: expected .residency-status after the last zoom-out notch to be the declared partial-view status verbatim (residencyStatus.ts:429-430) but it was null (per-notch snapshot at the end of the loop: null); expected "Filling has finished for this view — some areas were not loaded; pan or zoom to load them."`
- **Everything else in console's summary is PASS or INFO:** HEADER', ECHO', TWOCMD', HEXLIM', REFUSAL', CLASSB', CLASSC', COPYTRUNC' and UNCLASS' passed. The nested regression's other steps passed too.
- **Why I think it may be a timing-sensitive failure in a shared run:**
  - The standalone regression passed K7 at the base and at the head, both rc 0.
  - The nested regression printed "Attached to an already-running app on CDP port 9223; leaving it running." So it ran on console's app, not a fresh launch.
  - I did not re-run it, as the brief says. I did not run the head console.
- **I2:** it did not fire, because only the base arm of console has run.

## Diagnostic (A)
- **Copy and run:** the copy is `refill/layout-diag.mjs` in the scratchpad. The run was at the head 64de82e6, in a shared hold, on a fresh launch, with the same exe. The suite log is `out/fill-diag-head.log` and the output is `out/fill-diag.log`.
- **Status:** the output file has 27 lines and has neither `DIAG END` nor `DIAG FAILED`.
  - The suite's own 180000 ms FILL step timeout fired during zoom-out notch 11. The log says `[FILL] FAIL (180001ms): FILL: timed out after 180000ms`.
  - The copy keeps layout.mjs's step timeouts, so zoom-out notches 11 to 15 were not printed.
  - That is a limit of my copy. I did not re-run it. The earlier steps ran as they are: RESIZEQ passed with 72 new queries and a predicted 96 new cells, and E-REOPEN passed.
- **Diff against the tracked file:** the full `diff -u` is `refill/layout-diag.diff` (134 lines). It has four changes:
  1. `appendFileSync` is added to the `node:fs` import.
  2. The `./lib.mjs` and `./tsModuleLoader.mjs` imports become `file:///C:/dev/wt/refill/frontends/shell/e2e/...` URLs.
  3. `stepFill` (tracked lines 413 to 470) is replaced by the diagnostic.
  4. The `BURST` runStep line is removed.
- **Every table row:** `level` is medium and `baseSpan` is 25346.08 (originX 2593667.07, originY 1187966.98). `cellSize` is 1584.13, the growth per side is 156 and the canvas is 480x576. The anchor box is the same in every row: x 2600003.59 to 2612676.63, y 1194303.50 to 1206976.54.

| State | zoom | cellPx | Grown view box (xmin,ymin to xmax,ymax) | inside | cell < 156 | both |
|---|---|---|---|---|---|---|
| fit | -4.169 | 88.0 | 2596335.0,1194838.0 to 2610585.3,1205201.8 | false | true | false |
| zoom-in 1 | -3.239 | 167.7 | 2599720.2,1197299.9 to 2607200.1,1202739.9 | false | false | false |
| zoom-in 2 | -2.310 | 319.6 | 2601497.0,1198592.2 to 2605423.2,1201447.6 | true | false | false |
| zoom-in 3 | -1.380 | 608.8 | 2602429.7,1199270.5 to 2604490.5,1200769.3 | true | false | false |
| zoom-in 4 | -0.450 | 1159.9 | 2602919.3,1199626.6 to 2604001.0,1200413.2 | true | false | false |
| zoom-in 5 | 0.480 | 2209.7 | 2603176.2,1199813.4 to 2603744.0,1200226.4 | true | false | false |
| zoom-in 6 | 1.410 | 4209.8 | 2603311.1,1199911.5 to 2603609.1,1200128.3 | true | false | false |
| zoom-in 7 | 2.340 | 8020.4 | 2603381.9,1199963.0 to 2603538.3,1200076.8 | true | false | false |
| zoom-in 8 | 3.270 | 15280.0 | 2603419.1,1199990.0 to 2603501.2,1200049.8 | true | false | false |
| zoom-in 9 | 4.200 | 29110.6 | 2603438.6,1200004.2 to 2603481.7,1200035.6 | true | false | false |
| zoom-in 10 | 5.130 | 55460.0 | 2603448.8,1200011.7 to 2603471.4,1200028.1 | true | false | false |
| zoom-in 11 | 6.060 | 105659.6 | 2603454.2,1200015.6 to 2603466.1,1200024.2 | true | false | false |
| zoom-in 12 | 6.989 | 201297.2 | 2603457.0,1200017.6 to 2603463.2,1200022.2 | true | false | false |
| zoom-in 13 | 7.919 | 383501.0 | 2603458.5,1200018.7 to 2603461.7,1200021.1 | true | false | false |
| zoom-in 14 | 8.849 | 730626.3 | 2603459.3,1200019.3 to 2603461.0,1200020.5 | true | false | false |
| zoom-in 15 | 9.779 | 1391951.4 | 2603459.7,1200019.6 to 2603460.6,1200020.2 | true | false | false |
| after zoom-to-layer | -5.045 | 48.0 | 2593270.7,1192415.0 to 2619409.3,1211424.9 | false | true | false |
| zoom-out 1 | -5.974 | 25.2 | 2581441.0,1183811.6 to 2631239.0,1220028.3 | false | true | false |
| zoom-out 2 | -6.904 | 13.2 | 2558903.7,1167420.8 to 2653776.3,1236419.1 | false | true | false |
| zoom-out 3 | -7.834 | 6.9 | 2515966.8,1136194.0 to 2696713.2,1267645.9 | false | true | false |
| zoom-out 4 | -8.764 | 3.6 | 2434165.6,1076702.2 to 2778514.4,1327137.7 | false | true | false |
| zoom-out 5 | -9.694 | 1.9 | 2278322.3,963361.6 to 2934357.7,1440478.3 | false | true | false |
| zoom-out 6 | -10.624 | 1.0 | 1981417.6,747431.0 to 3231262.3,1656408.9 | false | true | false |
| zoom-out 7 | -11.554 | 0.5 | 1415770.3,336051.0 to 3796909.7,2067788.8 | false | true | false |
| zoom-out 8 | -12.484 | 0.3 | 338128.1,-447688.7 to 4874551.8,2851528.6 | false | true | false |
| zoom-out 9 | -13.414 | 0.1 | -1714939.9,-1940829.0 to 6927619.8,4344668.9 | false | true | false |
| zoom-out 10 | -14.344 | 0.1 | -5626338.8,-4785482.8 to 10839018.7,7189322.7 | false | true | false |

- **No state satisfies both terms.** The whole diagnostic shows no zoom with both terms true. `bothHold` is false in all 26 rows.
  - The cell term (cell under 156 px) holds only at zoom of about -3.34 or lower. The inside term holds only from zoom-in notch 2, at -2.31 and higher.
  - The notch steps are about 0.93 in zoom, and notch 1 (-3.24) misses both terms.
- **The grid level does not change.** `level` is medium in every row, and `baseSpan`, `originX` and `originY` do not change across zoom. So the problem is not a level that went stale. The two terms have no common zoom, in this geometry.
- **Fit state differs from zoom to layer.**
  - The `fit` row (auto-fit at E-REOPEN) is at zoom -4.169.
  - After a real Zoom to layer, the zoom is -5.045, with the same canvas of 480x576.
  - The anchor box is not centred on the grown view. At fit the grown box centre x is 2603460 and the anchor centre x is 2606340. This is my arithmetic from the table, not a measurement.

## Pairs 2 to 8, exit codes and holds
Every run used the exe `D:/wt-targets/reaim-base/exes/spatial-ide-shell-refill.exe`, a fresh launch, and `app-down` before and after. Each was in its own shared hold, with the hold granted and released. The base is `4fd3259a3e274dbc1f0a9c3ad72d168096a20e23` and the head is `64de82e688aac402264d225852c70c752148971a`. The run header line in each log names the worktree and commit.

| Pair | base rc | head rc | Steps, compared mechanically | Verdict |
|---|---|---|---|---|
| regression | 0 | 0 | 18: PASS 17, INFO 1 (NET') | same |
| refusal-contract-baseline | 0 | 0 | 3, all PASS | same |
| admission (`admission-remediation.mjs`) | 0 | 0 | 11, all PASS | same |
| filter | 0 | 0 | 3, all PASS | same |
| filter-panel | 0 | 0 | 5, all PASS | same |
| style | 0 | 0 | 6, all PASS | same |
| publish | 0 | 0 | 5: PASS 4, SKIP 1 (EXPIRED', as documented) | same |

- **No failing step** in any of these runs, so there are no messages to copy.
- **Fixture hashes the suites print:** only layout prints them (see report 2): `filter-zoned.parquet` is `92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46` and `100k-happy-path.parquet` is `fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49`. Both were equal before and after, and the diagnostic run printed the same pair.
- **Console, base only:** rc 1, hold granted and released, K7 as in "Stop". Its worktree commit is the base commit above.
- **Not yet run:** console at the head, residency-harness (default), source-changed (default route and post route), source-watch-idle, pan-anchor, and the RESIZEQ mutation (C).
- **Layout (from report 2):** FILL is unchanged. The tracked `layout.mjs` still throws I3, and the diagnostic above gives the numbers.

## Invalidators
- **I1:** not fired (RESIZEQ at the head, 72 new `viewport_query` lines).
- **I2:** not fired for pairs 1 to 8. Console's head arm has not run.
- **I3:** fired in report 2 and is explained by the diagnostic table.
- **I6:** not fired.
- **No exit code 96 to 99 was returned** in any run.

## Final state
- Head worktree: HEAD `64de82e688aac402264d225852c70c752148971a`, `git status --porcelain` empty. This was checked after the console run, and the publish runs left it empty too.
- Base worktree: HEAD `4fd3259a3e274dbc1f0a9c3ad72d168096a20e23`, `git status --porcelain` empty.
- No app, vite or hold of mine is running.
  - `app-down` reported "port 9223 free" and "port 5400 free" after every run, and nothing is listening on either port.
  - The holds folder is empty.
  - The `msedgewebview2.exe` processes seen earlier are not mine, and I left them alone.
- All logs are in the scratchpad's `refill/out/`, named `<suite>-<base|head>.log`, with `fill-diag.log`. The diff is `refill/layout-diag.diff`.
