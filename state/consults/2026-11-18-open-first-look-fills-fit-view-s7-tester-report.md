Built: open-first-look-fills-fit-view S7, tester (the custodian's filing note, 2026-11-18: the tester, model claude-sonnet-5-5, its run 2026-11-18T22:36:04Z to 22:58:10Z by its transcript, Bash 38, Read 3, none errored; 15434 bytes, sha256 b32123215a0797c55aff5668b86850147661d3973e83b378c0f8d224fda103b7; below byte for byte, with the project's name in its hold lines written as <m> in 3 places and the local time of two file times as <local> in 2, with this note and one final newline)

Result: all four runs at C passed. E-FL exited 0 (4 of 4, P-head met), and filter-panel, table and regression each exited 0. No I8, no I4, no STOP. I made no re-run.

Paths: `<S>` is the session scratchpad and `<H>` is `<S>/fl-e2e-h`. `<u>` is the app's per-user folder.

START STATE
- HEAD is e4c1dfba36cca15dbfa5dd6105cd2c4028f27221 (= C), and the porcelain is empty.
- `git ls-remote origin cut/open-first-look-fills-fit-view` printed e4c1dfba36cca15dbfa5dd6105cd2c4028f27221.
- `df -h`: C: 48G free, D: 360G free.
- `sha256sum -c` printed ten `OK`.
- The base measure exe was d8309b1e...148d9 and the base debug exe was 3be457bc...4e5, both as the brief says.
- The fixtures were:
  - filter-zoned: 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
  - 100k-happy-path: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
  - slow-filter-scan: 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5

BUILDS
- Measure build (step 1):
  - rc=0, `Finished `release` profile [optimized] target(s) in 2m 59s`.
  - The log's last lines are `Compiling spatial-ide-shell v0.1.0 (C:\dev\wt\fl\frontends\shell\src-tauri)`, that Finished line, and `Built application at: D:\wt-targets\fl\release\spatial-ide-shell.exe`. The log is `<S>/fl7-measure-build.log`.
  - `D:/wt-targets/fl/release/spatial-ide-shell.exe`: 72477184 bytes, mtime 2026-11-18 <local> (22:40:42Z), sha256 8778c25a9cf9a6e56c05c5d9d37e1308c3eaa8ce11b4c90eca00e2cd86f4515e. This differs from the base build's.
- Debug exe (step 2):
  - It printed `viewer build rc=0`, `shell build rc=0`, `exe build rc=0`, `Finished `dev` profile [unoptimized + debuginfo] target(s) in 3m 09s`, `copied exe`, `build-exe rc=0`.
  - `D:/wt-targets/fl/exes/spatial-ide-shell-fl.exe`: 91534848 bytes, mtime 2026-11-18 <local> (22:45:19Z), sha256 5a347ec80c9fee3a964487bfd11e774adca1c6c9d9e3fad4149c909d0a2adcc5. This differs from the base build's.
- The porcelain stayed empty after both builds.

BUSY CHECKS
Each was run in a call of its own, and each printed `FREE`. They ran before the head debug exe was used, after the debug build, before E-FL, after E-FL, and at the end. Only one was run before the debug-exe build was in use, and I did not run one before the measure build (the brief did not ask for one).

E-FL AT C (P-head)
- The log is `<S>/fl7-efl-head.log`, 1949 bytes, sha256 2f5bd936aaebb57be79a67207c7338c7064819b0dd76b40389b1d63972bcfe43. The npm rc was 0. Every line it holds:
```

> spatial-ide-shell@0.1.0 e2e:open-fills-fit-view
> node e2e/open-fills-fit-view.mjs --measure-build D:/wt-targets/fl/release/spatial-ide-shell.exe

precondition: first stream-issued sh_9e0ae5c88246d4794dd26c1979aee422, its batch rows 10000 (need 10000), fit view-state seen, describe.extent basis not-established-at-open, value null
  fixture sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49; fit view-state {"targetX":0,"targetY":0,"zoom":-3.692532927362801,"originX":2603460.114163697,"originY":1200019.902370003}
PASS  (b) settle: no viewport_query, stream-issued or batch line for 3 s within 180 s  ::  quiet after 2885 ms of waiting; 150 wire lines in all
PASS  (a) a further stream-issued line arrives after the first look's last batch, with no input  ::  first look sh_9e0ae5c88246d4794dd26c1979aee422, last batch at line 28; 42 further stream-issued line(s), 42 viewport_query line(s) after it
PASS  (c) .residency-status reads the complete-in-view sentence  ::  .residency-status is "Showing all 30443 features in view"; pattern /^Showing all \d+ features in view$/
  image: C:\dev\wt\fl\frontends\shell\e2e\out\open-fills-fit-view-efl-1795041972072.png 107990 bytes sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519
PASS  (d) every qualifying cell of the 8x8 grid holds a pixel unlike the ring background (tolerance 8)  ::  28 qualifying cell(s) of 64; 0 blank: none; screenshot has a pixel below alpha 255: false
  (e) 0 blank qualifying cell(s) lie wholly above the first look's rows (N > 1201280): none
  REPORT  alpha reading (decides nothing; ring B 255,255,255): qualifying cells with no pixel above alpha 0: none
  REPORT  qualifying cells: (1,0)o+ (2,0)o+ (3,0)o+ (4,0)o+ (5,0)o+ (6,0)o+ (7,0)o+ (1,1)o+ (2,1)o+ (3,1)o+ (4,1)o+ (5,1)o+ (6,1)o+ (7,1)o+ (1,2)i+ (2,2)i+ (3,2)i+ (4,2)i+ (5,2)i+ (6,2)i+ (7,2)i+ (1,3)i+ (2,3)i+ (3,3)i+ (4,3)i+ (5,3)i+ (6,3)i+ (7,3)i+

==== 4/4 PASS ====
```
- P-head is met. The precondition holds with the fixture hash equal to fd0c74ab..., (a) to (d) PASS, and the exit is 0. (e) is not a check at the head. It read 0 blank qualifying cells wholly above the first look's rows.
- Amendment 2 item 8's reading: every qualifying cell holds a marked pixel, all 28. That includes the 14 `o` cells, (1..7,0) and (1..7,1), which were blank (`o-`) at E'. The 14 `i` cells are `i+`. The alpha reading shows no cell without alpha above 0.
- At E' the same log had (a), (c) and (d) failing, 0 further stream-issued lines, and a null `.residency-status`. At C it has 42 further stream-issued lines and the sentence "Showing all 30443 features in view".

SUITES (hard `timeout` note: I put `timeout 1800` on `fl-e2e-load.sh` only, not on the run-suite command. Each run-suite call has its own `timeout 1500` inside the script. The brief asked for 1800 on the whole call.)

fp-head, `e2e/filter-panel.mjs`, rc=0.
- First line: `worktree C:/dev/wt/fl head e4c1dfba36cca15dbfa5dd6105cd2c4028f27221 start 2026-11-18T22:47:21Z`
- Load line: `load fp-head 22:47:11Z 39,40,40`
- Step lines, byte-copied up to the "::" prefix, with the rest cut:
  - `[OPEN] PASS (88ms): admitted; .filter-panel now mounted (keyed on the dataset handle)`
  - `[PANEL'] PASS (10274ms): typed + Apply via the real DOM; unfiltered 16.5% non-bg, filtered 4.4% non-bg (< 60% of unfiltered)`
  - `[PANELREFUSE'] PASS (4830ms): refused skp.filter_unknown_column; message verbatim; previous filtered view still rendered (4.38% non-bg, within 2 pts of PANEL''s own fraction)`
  - `[CLEAR'] PASS (4813ms): unfiltered fraction restored (16.5% non-bg, >= 90% of original); .filter-refusal and .filter-active both cleared`
  - `[FIND'] PASS (17366ms): fresh open; applied "id > 3999900" via the real DOM; scan completed on its own (liveness/Cancel both gone, no .scan-incomplete); camera landed on the matches (0.28% non-bg, > 0.08% floor for 668 x 712, settled=true)`
- Last line: `rc=0 end 2026-11-18T22:48:12Z`.
- `down.txt`: `killed tree 75552`, `killed tree 40128`, `port 9223 free`, `port 5400 free`.
- Files run-suite copied: `filter-panel-render-trace-1795042092618.json` and `tauri.e2e.conf.json`. Both are in `<H>/out` as `fl-e2e-fp-head.rep.*`. The log, busy, down, app.err, app.out and vite.err copies are there too.
- Session log `<u>/dev.spatialide.shell/logs/session-1795042049.log` is copied to `<S>/fl7-fp-head.session.log`.

table-head, `e2e/table.mjs`, with `SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]'` set on the run-suite command only. rc=0.
- First line: `worktree C:/dev/wt/fl head e4c1dfba36cca15dbfa5dd6105cd2c4028f27221 start 2026-11-18T22:48:52Z`
- Load line: `load table-head 22:48:41Z 31,48,45`
- Step lines:
  - `[PC-E1] PASS (11317ms): all 402 features under zone = 'residential', every row residential, 402 distinct ids (oracle [402, 392, 389, 421])`
  - `[PC-E2] PASS (24178ms): 3 selected (288, 382, 423); under id <> 423 the second scope lists 288, 382 ("[P6 placeholder] Showing 2 of 3 selected features that pass the filter; 1 could not be checked against it.") and the third still lists 3`
  - `[PC-E3] PASS (5619ms): the first scope reached the limit: "[P6 placeholder] Showing the first 1000 features returned, in no declared order; the file may hold more."; 1000 rows`
  - `[PC-E4] PASS (22927ms): the liveness line and Cancel showed; the table's stream sh_47b09973d2a79dee820bbd94806b0c07 was cancelled through the client (class-A cancel row ok); the table issued no other query in 3000ms. The engine releasing the stream is not shown by any operator surface`
- Summary: `[table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS`. Fixtures line: `[table] fixtures hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5d, slow-filter-scan.parquet 3fd819cb35aa`. Last line: `rc=0 end 2026-11-18T22:50:11Z`.
- `down.txt`: `killed tree 78892`, `killed tree 22752`, `port 9223 free`, `port 5400 free`.
- Files copied: `tauri.e2e.conf.json` only. Nothing else was written, so there is no render-trace file for this suite.
- Session log `<u>/dev.spatialide.shell/logs/session-1795042138.log` is copied to `<S>/fl7-table-head.session.log`.

regression-head, `e2e/regression.mjs`, rc=0.
- First line: `worktree C:/dev/wt/fl head e4c1dfba36cca15dbfa5dd6105cd2c4028f27221 start 2026-11-18T22:50:49Z`
- Load line: `load regression-head 22:50:38Z 51,33,35`
- Step lines (the long ones are cut at 330 characters in my read, so they are not whole; the part shown is byte-copied):
  - `[A1'] PASS (2ms)`, `[A3'] PASS (181ms)`, `[A4'] PASS (8987ms)`, `[A5'/A6'] PASS (4598ms)`, `[A7'] PASS (22351ms)`, `[A8'] PASS (9189ms)`, `[A9'] PASS (13555ms)`
  - `[K6] PASS (62199ms)`, `[K7] PASS (139055ms)`, `[CURSOR'] PASS (465ms)`, `[FIND'] PASS (39473ms)`, `[MP'] PASS (4518ms)`
  - `[PT'] PASS (6338ms): admitted; DescribeSummary shows the engine's point encoding and the file's declaration; no refusal or banner after the stream (settled=true)`
  - `[LN'] PASS (5526ms): admitted; DescribeSummary shows the engine's linestring encoding and the file's declaration; no refusal or banner after the stream (settled=true)`
  - `[B2'/B3'] PASS (138ms)`, `[ABSENTCRS'] PASS (5785ms)`, `[C2'/C3'] PASS (5977ms)`, `[NET'] INFO (3ms)`
- Last line: `rc=0 end 2026-11-18T22:56:28Z`.
- `down.txt`: `killed tree 4700`, `killed tree 44696`, `port 9223 free`, `port 5400 free`.
- Files copied: `regression-render-trace-1795042586868.json` and `tauri.e2e.conf.json`.
- Session log `<u>/dev.spatialide.shell/logs/session-1795042255.log` is copied to `<S>/fl7-regression-head.session.log`.

THE THREE READINGS (step 5)
1. PC-E4's placement.
   - What the run wrote cannot say this directly. The `stream-issued` lines live in the page's console trace, which table.mjs holds in memory and does not write out. The session log has no `stream-issued` lines (grep count 0). I added no logging.
   - What the files do show, from `<S>/fl7-table-head.session.log`, lines 495 to 531:
     - The Apply's first look ended `Completed` at line 516, and `candidate-first-look-view-planned` followed at line 518 (+4 ms).
     - The fill's tile terminals ran from line 519 (+69 ms) to the last one, `15:11`, at line 520-area, timestamp 1795042201066 (about 2.5 s after the plan).
     - `table-terminal-self-cancelled` for the table's stream sh_47b09973... is at line 531, timestamp 1795042207173.
   - `applyFilter` (table.mjs lines 91-95) waits for the render trace to be quiet for 3000 ms before the step marks `traceBefore` (line 335) and shows the Table tab (line 336). So, by reading the fill's timestamps against that wait, the fill's `stream-issued` lines fell before the point the step marks, not inside the lines it reads (338-343) and not after them. This is an inference from the session log's timestamps and the code, not an observed trace line.
   - Under Amendment 1 item 3 (d): on this trace's timing the fill's lines could not fall inside, so it goes to the advisor as information, not as a question.
2. FIND' durations. Base 21603 ms (D-to-F report, `fp-base` at E). Head 17366 ms (`fp-head`). Both PASS, and the head is 4237 ms shorter. At the head, `regression.mjs`'s own FIND' took 39473 ms. Its base in the d144373b report was 29050 ms.
3. `regression.mjs` PT' and LN'. Base, from the d144373b report: PT' PASS (3506ms) and LN' PASS (3321ms). Head: PT' PASS (6338ms) and LN' PASS (5526ms). Both pass at the head and both are slower. The text of each line is the same up to the cut shown in the base report.

HOLDS
All holds were `shared`. The hold line's value after `also=` is written `<m>`.
- Measure build: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:19416 also=<m> (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=<m> shell=bash.exe:19416 affinity=FF (cores 0-7)`, `date -u` Wed Nov 18 22:40:48 UTC 2026.
- Debug exe build: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:52000 also=<m> ...` and `MACHINE_RELEASED ... shell=bash.exe:52000 ...`, 22:45:22.
- E-FL: `... shell=bash.exe:79072 also=<m> ...` and `MACHINE_RELEASED ... shell=bash.exe:79072 ...`, 22:46:28.
- fp-head: `... shell=bash.exe:71112 also=<m> ...` and `MACHINE_RELEASED ... shell=bash.exe:71112 ...`, 22:48:20.
- table-head: `... shell=bash.exe:52932 also=<m> ...` and `MACHINE_RELEASED ... shell=bash.exe:52932 ...`, 22:50:21.
- regression-head: `... shell=bash.exe:49200 also=<m> ...` and `MACHINE_RELEASED ... shell=bash.exe:49200 ...`, 22:56:48.
- Every hold exit was 0, with no 96 to 99. No hold printed MACHINE_WAITING or MACHINE_ERROR.

END STATE
- HEAD is e4c1dfba36cca15dbfa5dd6105cd2c4028f27221 and the porcelain is empty.
- The three fixtures' sha256 are the same as at the start.
- `df -h`: C: 47G free, D: 360G free.
- A last `fl-e2e-busy.ps1` in a call of its own printed `FREE`.
- No process I started is still running. Each suite's app was stopped by run-suite (see each `down.txt`), and E-FL's by its own script.

FOUR FAILURE CLASSES, for my harness
- The interface the product exposes: E-FL drives the measure build through its CDP hook and `openPath`, and the three suites drive the debug exe through the real panel DOM and `window.__SPATIAL_E2E__`. Both are the same ways the base runs used.
- Every result claim points to a file that exists: `<S>/fl7-efl-head.log`, `<S>/fl7-measure-build.log`, the three `<S>/fl7-*.session.log` files, and the `fl-e2e-fp-head`, `fl-e2e-table-head` and `fl-e2e-regression-head` log, `down.txt`, `busy.txt` and `rep.*` files in `<H>/out`.
- The operator-facing lines describe this commit: every `worktree ... head` line in a suite log reads e4c1dfba, and the E-FL log's precondition line shows the head's fixture hash.
- Every measurement reaches its assertion: each log ends with its own summary or `==== 4/4 PASS ====`, and its `rc=` line. For PC-E4's placement the assertion is not reached by a log; I say so above.
- Caveat: p50/p95 does not apply. Each of these is a single run (n=1), so the FIND', PT' and LN' durations are single readings on a shared laptop. The load lines are 31 to 51 percent CPU. They are not a timing claim.

THINGS I DID THAT THE BRIEF DOES NOT NAME
- I read the form, the four base reports and the harness scripts, and copied them into `<S>/fl7-*.md` for reading. I also wrote `<S>/fl7-fetch.log`.
- I read the three session logs and `table.mjs` to make the PC-E4 reading.
- I ran `sha256sum` on the exes and fixtures at the end, and one `ls` of `e2e/out`.
- I used short background wait loops (`until grep -q ...; do sleep 10`, hard `timeout` inside) to wait for the notifications. Some were moved to the background by the harness and completed.
- The `timeout 1800` placement noted under SUITES.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.
