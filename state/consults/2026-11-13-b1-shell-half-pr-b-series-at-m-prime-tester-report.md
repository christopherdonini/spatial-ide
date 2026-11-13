*Custodian's filing note (2026-11-13): the tester's e2e series for milestone 4 PR B at M′ 6649a443 (the form's Amendment 12 item 11 and Amendment 12, continued), from its hand-back (19271 bytes, sha256 d0c19c756a4a9d4b9970e663c1456e9e1c826101745b744bfb673b15b3f3c9f5), below the rule. The scratch folder's path, on its line 13, is written as <the custodian's scratchpad>, and a final newline is added; nothing else is changed. Its brief by file (13664 bytes, sha256 b38ca17789fe12b8ca71fec5180af6e1baaa11165994c8709c29dddc75603291); the run 06:46:11Z to 08:51:51Z by its transcript, 150 calls (Read 3, Bash 141, Write 5, SubagentHandback 1), model claude-sonnet-5-5. One call errored, at 08:20:25Z: a Bash call of the harness's app-down after residency-harness's first run, exit 1, whose output the report gives. Checked by script: 25 run logs under the harness's out folder, each opening at M′, with the rc the report's table gives (all 0 but console 1, pan-anchor 1, pan-anchor-2 1, residency-harness 2); 25 session-log copies; with `e2e:recentre-crossing` on the measure build, 26 runs. Pan-anchor's two failures came at 90 to 100% load in shared holds. By the machine rule a timing-sensitive failure seen in a shared run is not recorded as a failure; the custodian re-runs it alone on the machine, and the form's Amendment 13 reads both.*

---

Series at M′: b1-shell-half PR B at 6649a443a38763759339c7813e3fdbe9eca09be0, tester, port-5400 harness

Result: findings. `e2e:recentre-crossing` passed 6/6. `pan-anchor` failed twice (15/16 each time), both on `recenter-crossing-A dx=-1200` with residual 1100.01 buffer px. `console` (nested `regression` K7) and `residency-harness` (rc 2, watchdog) each failed once and passed on their one re-run. Every other run ended rc 0. No stop rule was hit.

**Model, handoff, usage.** I am Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No model override, no context handoff. No usage figures at hand.

**The four failure classes, as they apply here**
- Interface: the series drives the debug exe over CDP 9223, with Vite on 5400 and localhost:5180 mapped to it. It is not the packaged exe. `recentre-crossing` drives the measure build's exe and its shipped `[render-trace]` lines.
- Claims point to files: every result below is in `<H>/out/m4b-e2e-<tag>.log`, or in the `m4b-mp-recentre-crossing.*` files in `<S>`.
- Operator-facing lines: they describe what was measured at 6649a443. I cut result lines to about 130 to 170 columns for reading, and the full lines are in the logs. The load lines are one 3-sample reading taken just before each run. The shared machine ran at 90 to 100% load for most of the second half of the series.
- Reaches its assertion: `residency-harness` is read by exit code only, and no figure it printed is recorded or claimed. Every other claim is a PASS or FAIL line the run printed.

Paths: `<S>` = <the custodian's scratchpad>. `<H>` = `<S>/m4b-e2e-h`.

**Start state**
- HEAD 6649a443a38763759339c7813e3fdbe9eca09be0 and porcelain empty. The fetch was rc 0.
- `df -h`: C: 17G free, D: 222G free.
- The form's sha256 is 51f7eef512eac8e9d0352f142b4f9a8aad59ea49db68f35d068fb8a0bae2acb6, as the brief gives.
- `sha256sum -c`, all ten `OK`: m4b-e2e-app-down.ps1, m4b-e2e-app-up-wait.ps1, m4b-e2e-app-up.ps1, m4b-e2e-build-exe.sh, m4b-e2e-busy.ps1, m4b-e2e-run-suite.sh, m4b-e2e-tauri.conf.json, shim-wait/npx.cmd, shim/npx.cmd, m4b-e2e-load.sh.
- I read `m4b-e2e-run-suite.sh`, `m4b-e2e-build-exe.sh` and `m4b-e2e-app-up.ps1` whole and changed no harness file.
- The `e2e:` entries in package.json are the 18 listed plus `e2e:debug`.

**Builds**

| step | rc | result |
|---|---|---|
| `npm ci`, frontends/shell | 0 | porcelain empty |
| `npm ci`, renderer/bundle-viewer | 0 | porcelain empty |
| viewer `npm run build` | 0 | scan lines below |
| `generate:notice` | 0 | `src/generated/NOTICE.txt (3506979 bytes)` |
| `npm run typecheck` | 0 | `tsc --noEmit`, no errors printed |
| `npm test` | 0 | Test Files 112 passed (112); Tests 1464 passed (1464); 0 failed |
| debug exe (`m4b-e2e-build-exe.sh`) | 0 | `Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 2m 18s`, then `copied exe` |
| measure exe (`build:measure`) | 0 | `Finished \`release\` profile [optimized] target(s) in 22m 37s` and `Built application at: D:\wt-targets\m4b-measure\release\spatial-ide-shell.exe` |
| `verify-bundle` example | 0 | `Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 24.15s` |

- Viewer scan, last lines byte-copied:
  - `scan-dist: 3 files scanned, 2 findings, all reviewed; record written`
  - `scan-dist: reviewed row NOTICE.txt credential 19092: matched`
  - `scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched`
  - `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`
  - The last line is the same as in the series at M″. I did not investigate it.
- Debug exe `D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe`: 91547648 bytes, mtime 2026-11-13 07:54:30 +0100, sha256 bb4bee07557c7c26df31d5c17cc585f78a00cb1165fce24059b50666b498f41b. At M″ it was dbab2eef33cd….
- Measure exe: 72487936 bytes, mtime 2026-11-13 08:18:18 +0100, sha256 a0ae8792956e1c5d51bc0addc7f3b9f0dbb3939be974a9518c8dcd23b25d1a66.
- Porcelain stayed empty after the installs, the viewer build and the measure build.
- `npm test` printed "Blocking waiting for file lock on package cache" lines. All 1464 tests still passed.
- The `generate:notice` call this time did not print the "dist-metafile.json not found" line the M″ report mentions.

**Fixtures.** 34 files, recursive. `m4b-mp-fix-before.txt` and `m4b-mp-fix-after.txt` are in `<S>`, and `cmp` returned 0 with no output. The before file equals the M″ series' before file column for column. Nothing was regenerated and the 5 GB fixture was not used.
- `filter-zoned.parquet`: 409872 bytes, 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
- `100k-happy-path.parquet`: 29933646 bytes, fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
- `attributes-multitype.parquet`: 610134 bytes, afbd4b909a22a416f88002dcbd81edf3117a642141954724eac4cc41c459a1d2
- `attributes-multitype.oracle.json`: 5971 bytes, 29e54fec6fcb583f2c23fe6767390236724d930452660d24b39590c519f03a75
- `slow-filter-scan.parquet`: 766186557 bytes, 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5

**Runs.** Tag = `mp-` + name. UTC on 2026-11-13. `<env>` is empty unless shown. The M″ rc is from the report at c85788f1. Each run's first line is `worktree C:/dev/wt/m4b head 6649a443a38763759339c7813e3fdbe9eca09be0 start <start>`.

| tag | script | env | rc | start | end | load (3 samples) | last line or verdict | M″ rc |
|---|---|---|---|---|---|---|---|---|
| mp-regression | regression.mjs | | 0 | 07:19:45 | 07:24:53 | 19,21,35 | 17 PASS lines | 0 |
| mp-refusal-contract-baseline | refusal-contract-baseline.mjs | | 0 | 07:25:54 | 07:26:54 | 43,43,33 | 3 PASS | 0 |
| mp-admission | admission-remediation.mjs | | 0 | 07:27:35 | 07:28:07 | 27,43,40 | 11 PASS | 0 |
| mp-filter | filter.mjs | | 0 | 07:28:48 | 07:29:03 | 26,48,32 | 3 PASS | 0 |
| mp-filter-panel | filter-panel.mjs | | 0 | 07:29:42 | 07:30:13 | 40,40,31 | 5 PASS | 0 |
| mp-style | style.mjs | | 0 | 07:30:52 | 07:31:06 | 32,37,57 | 6 PASS | 0 |
| mp-publish | publish.mjs | | 0 | 07:31:47 | 07:32:06 | 57,42,37 | 4 PASS, 1 SKIP | 0 |
| **mp-console** | console.mjs | | **1** | 07:32:48 | 07:39:08 | 48,47,46 | 10 PASS, `[REGRESS'] FAIL` | 0 |
| mp-console-2 | console.mjs | | 0 | 07:40:09 | 07:47:16 | 23,37,43 | 11 PASS incl. REGRESS' | n/a |
| mp-layout | layout.mjs | | 0 | 07:48:08 | 07:49:07 | 8,15,12 | 11 PASS | 0 |
| mp-selection | selection.mjs | | 0 | 07:50:22 | 08:05:46 | 54,93,66 | 18 PASS, 1 SKIP | 0 |
| mp-export-view | export-view.mjs | | 0 | 08:06:34 | 08:07:01 | 100,38,43 | `[export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS` | 0 |
| mp-recording | recording.mjs | `SHIMDIR=shim-wait` | 0 | 08:07:56 | 08:08:09 | 17,51,17 | 5 PASS | 0 |
| mp-command-bar | command-bar.mjs | | 0 | 08:09:10 | 08:10:45 | 60,80,33 | 14 PASS | 0 |
| mp-attributes | attributes.mjs | | 0 | 08:11:21 | 08:14:01 | 23,23,27 | `[attributes] 2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS` | 0 |
| mp-table | table.mjs | `SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]'` | 0 | 08:14:33 | 08:16:06 | 100,99,100 | `[table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS` | 0 |
| mp-project | project.mjs | | 0 | 08:16:54 | 08:17:46 | 83,100,100 | 12 PASS | 0 |
| **mp-residency-harness** | residency-harness.mjs | | **2** | 08:18:34 | 08:19:40 | 100,100,100 | `residency-harness: overall watchdog exceeded -- presumed hung, failing loudly` | 0 |
| mp-residency-harness-2 | residency-harness.mjs | | 0 | 08:21:08 | 08:21:58 | 97,100,100 | exit code only | n/a |
| **mp-pan-anchor** | pan-anchor.mjs | | **1** | 08:22:53 | 08:28:33 | 99,99,100 | `==== 15/16 PASS ====`, `FAILED: large: recenter-crossing-A dx=-1200` | 0 (16/16) |
| **mp-pan-anchor-2** | pan-anchor.mjs | | **1** | 08:29:45 | 08:36:47 | 100,93,100 | `==== 15/16 PASS ====`, `FAILED: small: recenter-crossing-A dx=-1200` | n/a |
| mp-source-watch-idle | source-watch-idle.mjs | | 0 | 08:37:36 | 08:38:08 | 70,70,62 | 8 PASS | 0 |
| mp-source-changed-pre | source-changed.mjs | `env -u SPATIAL_E2E_SOURCE_CHANGED_ROUTE` | 0 | 08:38:54 | 08:39:44 | 99,90,96 | 7 PASS | 0 |
| mp-source-changed-post | source-changed.mjs | `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post` | 0 | 08:40:29 | 08:41:26 | 85,71,82 | 7 PASS, including `[S5d-post-check-route-confirmed] PASS` | 3 (S5d INCONCLUSIVE) |
| mp-source-changed-reopen | source-changed.mjs | `SPATIAL_E2E_SOURCE_CHANGED_ROUTE=reopen` | 0 | 08:42:13 | 08:43:56 | 100,100,82 | 11 PASS | 0 |
| recentre-crossing | recentre-crossing.mjs, measure exe, outside `run-suite` | | 0 | 08:44:42 | 08:48:37 | busy check FREE | `==== 6/6 PASS ====` | did not run |

**Per run (steps 9 and 10)**
- Every run's down output was `killed tree <pid>` twice, then `port 9223 free` and `port 5400 free`. The one exception is `mp-residency-harness`, below.
- The `skp.projection_` count in each run's `app.err.log` copy is 0 for all 26 runs, and 0 in the measure app's log.
- Every app named a session log, and each is copied to `<S>/m4b-mp-<tag>.session.log`. For example, `<S>/m4b-mp-mp-regression.session.log` is 833559 bytes. Sizes run from 389 bytes (`residency-harness`) to 833559 bytes (`regression`). I have a cap file per run in `<S>/m4b-mp-cap-<tag>.txt` with the first line, result lines, last two lines, rc, load, session path and down output.
- Last two lines, in the same form as at M″: the closing banner, then `rc=<n> end <time>`. The banners are `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`, its shorter variants, `This run LAUNCHED the app; it stays running on CDP port 9223.`, `Full render-trace ledger: ...` or `Full console ledger: ...`. `source-watch-idle` ends `This run LAUNCHED the app and has now torn it down (session.stop()); nothing was left running.`
- `selection`: the second-to-last line is `[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover.`
- `publish`: `[EXPIRED'] SKIP: no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (600s, publish.rs); ...`. Its audit log is `<S>/m4b-mp-mp-publish.audit.jsonl`. `selection` wrote `<S>/m4b-mp-mp-selection.audit.jsonl`. No other run wrote an audit log.
- Load lines: all sampled in `<H>/out/m4b-e2e-loads.txt`, with the tag as given in the table.
- `mp-source-changed-post` S5d line, cut: `[S5d-post-check-route-confirmed] PASS: "tile-session-ended-source-changed" present and no "tile-stream-mint-refused" since this run's own baseline -- a session ended and ...`

**`e2e:recentre-crossing`** (step 9)
- The busy check printed `FREE` (`<S>/m4b-mp-rc.busy.txt`). The run was a shared hold, `timeout 1800`, from `C:/dev/wt/m4b/frontends/shell`, with `--measure-build D:/wt-targets/m4b-measure/release/spatial-ide-shell.exe`.
- Stamps (`<S>/m4b-mp-recentre-crossing.stamps`): `2026-11-13T08:44:42Z`, `2026-11-13T08:48:37Z`, `rc=0`. The log is `<S>/m4b-mp-recentre-crossing.log`.
- `e2e/out/` before and after are in `<S>/m4b-mp-recentre-out-before.txt` and `<S>/m4b-mp-recentre-out-after.txt`. The diff shows three new files: `measure-app.log` (277 bytes) and the two images below.
- Copies, each with its sha256 (the images' sha256 match the log's own lines):
  - `<S>/m4b-mp-recentre-crossing.app.log`: 277 bytes, fe694f59b0d994118375ad2af1e6db30d4a27bae8fbe882a4495016737e404fb. It holds `session log: ...session-1794559492.log`, `data-plane expected origin (config mirror): http://tauri.localhost` and `measure-build: CDP remote-debugging port 9223 opened`.
  - `<S>/m4b-mp-recentre-crossing.session.log`: 138721 bytes, feb2a493921d89e86aea9360b119aa8877d2958769bef89219c9d01d22dc3555.
  - `<S>/m4b-mp-recentre-crossing-e1-1794559490943-case1-start.png`: 34623 bytes, 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2.
  - `<S>/m4b-mp-recentre-crossing-e1-1794559490943-case1-end.png`: 107990 bytes, cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519.
- Byte-copied from its log:
  - `--- case 1: z_fit -3.692532927362801, canvas 668x712 (buffer 668x712), L 300, T 131072, d 3749.395, n1 37, 76 drags ---`
  - `PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)`
  - `PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395`
  - `REPORT  case 1 (c): the start and end images do not differ  ::  differ: N 35248 -> 127606, C shift 129.55 buffer px`
  - `PASS  case 1 (d): the drawn data's inner edges do not move  ::  do not differ: start box [left 66, right 667, top 258, bottom 357], end box [left 66, right 667, top 0, bottom 357]; K {left, bottom}; moves left 0.00, bottom 0.00 buffer px (tol 4)`
  - `--- case 2: z_fit -3.692532927362801, T 131072, double-click shift 300 px, window below T: (0, 1939.342] ---`
  - `PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true`
  - `PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)`
  - `PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)`
  - `==== 6/6 PASS ====`
- The `REPORT` lines are reported and not asserted, as the README says. The run printed no FAIL, VOID or fatal line.

**Failures and their re-runs**

1. `console` (`mp-console`, rc 1; load 48,47,46). Its own steps HEADER' to UNCLASS' all passed. The failing step was the nested regression. Byte-copied from the log (full failing lines are in `<S>/m4b-mp-console-fail-lines.txt`):
   - `[REGRESS'] FAIL (356637ms): REGRESS': npm run e2e:regression exited 1 (356637ms). Tail:`
   - `[K7] FAIL (157821ms): K7: expected .residency-status after the last zoom-out notch to be the declared partial-view status verbatim (residencyStatus.ts's SETTLED_PARTIAL_WITHIN_BUDGET_TEXT) but it was null (per-notch snapshot at the end of the loop: null); expected "Filling has finished for this view — some areas were not loaded; pan or zoom to load them."`
   - Re-run `mp-console-2`, alone in its own hold, load 23,37,43: rc 0. Its line is `[REGRESS'] PASS (405838ms): npm run e2e:regression exited 0 (381022ms); npm run e2e:admission exited 0 (24816ms); both attached to THIS run's own already-launched app ...`.
   - The standalone `mp-regression` passed K7 earlier (`[K7] PASS (136577ms)`), at load 19,21,35.
2. `residency-harness` (`mp-residency-harness`, rc 2; load 100,100,100). The log is only: `residency-harness: waiting for the app to mount (up to 90000ms)...`, `residency-harness: overall watchdog exceeded -- presumed hung, failing loudly`, `rc=2 end 2026-11-13T08:19:40Z`.
   - The app-down output was `killed tree 68040`, `killed tree 40168`, `port 9223 still listening, owner pid 79276`, `port 5400 free`.
   - I looked for the pid and the port afterwards. There was no process 79276 and no listener on 9223, and the busy check printed `FREE` (`<S>/m4b-mp-busy-after-residency.txt`). I killed nothing.
   - Re-run `mp-residency-harness-2`, load 97,100,100: rc 0, with `Evidence file: ...residency-harness-instrument-on-1794558118331.json` and no figure recorded.
3. `pan-anchor` (`mp-pan-anchor`, rc 1; load 99,99,100), failing lines byte-copied (`<S>/m4b-mp-pan-anchor-fail-lines.txt`):
   - `FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)`
   - `==== 15/16 PASS ====`
   - `FAILED: large: recenter-crossing-A dx=-1200`
   - Re-run `mp-pan-anchor-2`, alone in its own hold, load 100,93,100: rc 1 (`<S>/m4b-mp-pan-anchor-2-fail-lines.txt`):
     - `FAIL  small: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)`
     - `==== 15/16 PASS ====`
     - `FAILED: small: recenter-crossing-A dx=-1200`
   - The same case failed in both runs, with the same residual 1100.01, once on the large window (788x812) and once on the small one. In both, `recenter-crossing-A dx=1200` passed and every other step passed.
   - Harness cause: I saw none in the launcher's, the build's or the busy check's output. The load was 99 to 100% in both, from the shared machine. Whether this is I3 is the custodian's reading, and the machine rule says a timing-sensitive failure seen in a shared run is the custodian's to re-run alone.
   - At M″ `pan-anchor` passed 16/16 (load 16,11,11). `recentre-crossing` on the measure build passed in this series.

Not re-run, and not failures: `source-changed-post` ended rc 0 with S5d PASS at M′. At M″ it ended rc 3 with S5d INCONCLUSIVE. Both are single runs.

**End state**
- No process of mine is running. No `spatial-ide-shell` or vite process was listed, and nothing was killed by PID. Port 9223 shows only a TimeWait entry (owner 0), and nothing listens on 5400.
- The busy check printed `FREE` (rc 0, `<S>/m4b-mp-end.busy.txt`).
- HEAD 6649a443a38763759339c7813e3fdbe9eca09be0, porcelain empty.
- At the end C: has 17G free and D: has 203G free.

**Hold lines** (`also=` elided), all `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid>`, with no hold refused (no exit 96 to 99) and no exit 90 or 94:
- Installs, scan, notice, typecheck, tests, builds: 20880, 80724, 38632, 81556, 78172, 34332, 75604 (debug exe), 50908 (measure exe), 81860 (example).
- Suites: 43460, 61868, 60536, 5656, 18568, 45796, 24904, 27200 (console), 21016 (console-2), 72668, 62612, 13392, 34336, 52340, 78312, 56844, 74492, 39624 (residency-harness), 43312 (residency-harness-2), 33664 (pan-anchor), 67524 (pan-anchor-2), 39508, 7012, 70544, 50220.
- `recentre-crossing`: 75664.

**Things I did that the brief does not name, and departures**
- I wrote helper scripts in `<S>` with the Write tool: `m4b-mp-wait.sh`, `m4b-mp-wait2.sh`, `m4b-mp-waitlog.sh`, `m4b-mp-capture.sh` and `m4b-mp-fix.sh`. All are read-only apart from the session-log copies. I wrote none in `<H>`.
- `m4b-mp-capture.sh` also matches the `====` lines when it extracts result lines.
- The brief's order puts the fixtures' "before" at step 7. I took it after step 6, before the first run, as the order says.
- I passed `SPATIAL_IDE_AUDIT_LOG=<S>/m4b-mp-mp-<name>.audit.jsonl` on every `run-suite` run, so the names double the `mp`, as at M″.
- For `recentre-crossing` I stamped the times and `rc=` inside the same hold call with `&&` and `;` around the one command. `rc=` is in the stamps file as well as in the exit code. For the other holds the tool's exit code is the rc I report.
- `grep -h` on the tasks folder returned lines from other sessions' task files (hold-line text only). I did not quote them, and the hold lines above come from my own task ids.
- Wait loops slept 1 s per poll with a hard cap. Foreground loops past 180 s were moved to the background by the harness, as the M″ report also notes.
- No commit, push, merge, stash, `claude` command or network use beyond the fetch and the two `npm ci` calls. No tracked file was edited. I wrote only in `<S>`, `C:/dev/wt/m4b` (ignored build and e2e output), `D:/wt-targets/m4b`, `D:/wt-targets/m4b-measure` and the app's own per-user session-log folder.
