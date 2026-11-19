Series: open-first-look-fills-fit-view S9 at e1fd84957b7ae042a075e7ccc5628a3de5670eb7, tester, port-5400 harness (the custodian's filing note, 2026-11-19: the Sonnet tester, model claude-sonnet-5-5, its run 2026-11-19T01:05:43Z to 02:32:54Z by its transcript, Read 4, Bash 141, Write 3, 2 of them errored; 20367 bytes, sha256 5b37f7da64e5ced7f8cefe4a9f4e4b9dae654fdaa69d31af283cefa2d96928e2; below byte for byte, with this note and one final newline)

Result: E-FL and recentre-crossing passed (P-head met), and all 23 run-suite suites ran once. 18 exited 0. No I8, no STOP. Six suites did not pass:
- `selection` (4 steps: the known failure).
- `console`, `command-bar` and `project`: one failure each, recorded as seen.
- `source-changed-post`: rc 3, S5d INCONCLUSIVE.
- `console`'s failure is its nested `regression`'s K7.
- I made no re-run, so I4 is not engaged.

Model: Sonnet 5.5 (claude-sonnet-5-5, as the harness reports it). No override, no context handoff. Usage figures are not at hand.

Paths: `<S>` is the session scratchpad. `<H>` is `<S>/fl-e2e-h`. `<u>` is the app's per-user folder. `<m>` marks masked hold-line values.

## Four failure classes, for my harness
- **Interface:** E-FL and recentre-crossing drive the release measure exe through its CDP hook. The suites drive the debug exe through the real panel DOM and `window.__SPATIAL_E2E__`. Both match the earlier series.
- **Result claims point to files that exist:** per run, `<S>/fl9-harvest-<name>.txt`, `<H>/out/fl-e2e-s9-<name>.*` and `<S>/fl9-s9-<name>.session.log`. The harvest scripts are `<S>/fl9-harvest.sh` and `<S>/fl9-post.sh`.
- **Operator-facing lines describe this commit:** every suite log's first line reads `head e1fd84957b7ae042a075e7ccc5628a3de5670eb7`.
- **Measurement reaches its assertion:** every log ends with its own summary or `==== N/N PASS ====` and its `rc=` line, except the failed steps below, which stopped at their own assertion. No timed claim is made. Each result is a single run (n=1) on a shared laptop.

## Start state
- HEAD in `C:/dev/wt/fl` was e1fd84957b7ae042a075e7ccc5628a3de5670eb7 and the porcelain was empty.
- Every script the brief names is present under `frontends/shell/e2e/`.
- `df -h`: C: 48G free, D: 359G free.
- Harness `sha256sum -c <S>/fl-harness.sha256` printed ten OK: `fl-e2e-run-suite.sh`, `fl-e2e-load.sh`, `fl-e2e-app-up.ps1`, `fl-e2e-app-up-wait.ps1`, `fl-e2e-app-down.ps1`, `fl-e2e-busy.ps1`, `shim/npx.cmd`, `shim-wait/npx.cmd`, `fl-e2e-tauri.conf.json`, `fl-e2e-build-exe.sh`. rc=0. I read run-suite, app-up and busy whole.
- The diff check (C..F over the listed paths) printed nothing, rc 0.
- Debug exe: 91534848 bytes, sha256 5a347ec80c9fee3a964487bfd11e774adca1c6c9d9e3fad4149c909d0a2adcc5. Equal to the brief.
- Measure exe: 72477184 bytes, sha256 8778c25a9cf9a6e56c05c5d9d37e1308c3eaa8ce11b4c90eca00e2cd86f4515e. Equal to the brief.
- Fixtures: 34 files before and 34 after. `cmp <S>/fl9-fix-before.txt <S>/fl9-fix-after.txt` rc=0, so they are identical. None was regenerated. The 5 GB fixture was not used.

## E-FL (hold 1, rc 0, `<S>/fl9-efl.log`, nothing cut)
```

> spatial-ide-shell@0.1.0 e2e:open-fills-fit-view
> node e2e/open-fills-fit-view.mjs --measure-build D:/wt-targets/fl/release/spatial-ide-shell.exe

precondition: first stream-issued sh_25da7a7f0cafdb6bfa7cbd2dd9bfa87c, its batch rows 10000 (need 10000), fit view-state seen, describe.extent basis not-established-at-open, value null
  fixture sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49; fit view-state {"targetX":0,"targetY":0,"zoom":-3.692532927362801,"originX":2603460.114163697,"originY":1200019.902370003}
PASS  (b) settle: no viewport_query, stream-issued or batch line for 3 s within 180 s  ::  quiet after 5425 ms of waiting; 150 wire lines in all
PASS  (a) a further stream-issued line arrives after the first look's last batch, with no input  ::  first look sh_25da7a7f0cafdb6bfa7cbd2dd9bfa87c, last batch at line 28; 42 further stream-issued line(s), 42 viewport_query line(s) after it
PASS  (c) .residency-status reads the complete-in-view sentence  ::  .residency-status is "Showing all 30443 features in view"; pattern /^Showing all \d+ features in view$/
  image: C:\dev\wt\fl\frontends\shell\e2e\out\open-fills-fit-view-efl-1795050895533.png 107990 bytes sha256 cf7fd271ad7847389f4e0dd213d2d537171467ab061d34615974bc570593f519
PASS  (d) every qualifying cell of the 8x8 grid holds a pixel unlike the ring background (tolerance 8)  ::  28 qualifying cell(s) of 64; 0 blank: none; screenshot has a pixel below alpha 255: false
  (e) 0 blank qualifying cell(s) lie wholly above the first look's rows (N > 1201280): none
  REPORT  alpha reading (decides nothing; ring B 255,255,255): qualifying cells with no pixel above alpha 0: none
  REPORT  qualifying cells: (1,0)o+ (2,0)o+ (3,0)o+ (4,0)o+ (5,0)o+ (6,0)o+ (7,0)o+ (1,1)o+ (2,1)o+ (3,1)o+ (4,1)o+ (5,1)o+ (6,1)o+ (7,1)o+ (1,2)i+ (2,2)i+ (3,2)i+ (4,2)i+ (5,2)i+ (6,2)i+ (7,2)i+ (1,3)i+ (2,3)i+ (3,3)i+ (4,3)i+ (5,3)i+ (6,3)i+ (7,3)i+

==== 4/4 PASS ====
```
- **P-head:** met. The precondition holds, (a) to (d) PASS, and the npm exit code is 0.
- **Against S7's E-FL at C:** every verdict is the same, and so are the figures:
  - the cell counts (28 qualifying, 0 blank);
  - the status sentence (30443 features);
  - the image sha256 (cf7fd271...);
  - 42 further `stream-issued` lines.
- **Values that differ:**
  - the first stream handle (sh_25da7a7f... against sh_9e0ae5c8...);
  - the settle's quiet time (5425 ms of waiting against 2885 ms);
  - the image file's timestamped name.

## recentre-crossing (hold 2, rc 0, `<S>/fl9-recentre.log`)
Result lines, byte-copied (the report lines are included):
```
PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)
PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395
REPORT  case 1 (c): the start and end images do not differ  ::  do not differ: N 127606 -> 127606, C shift 0.00 buffer px
PASS  case 1 (d): the drawn data's inner edges do not move  ::  do not differ: start box [left 66, right 667, top 0, bottom 357], end box [left 66, right 667, top 0, bottom 357]; K {left, bottom}; moves left 0.00, bottom 0.00 buffer px (tol 4)
PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true
PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)
PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)
```
Last line: `==== 6/6 PASS ====`. Case 1's start and end images are the same file hash (cf7fd271...), which is the E-FL image's hash.

## Run-suite runs (24 holds in all; every run's busy-at-launch was FREE and every app-down showed ports 9223 and 5400 free)
PASS and FAIL counts are counts of result lines. `pan-anchor`'s count is its 16 PASS lines. Load is the three Win32_Processor samples.

| tag (s9-) | start (UTC) | end | rc | PASS / FAIL | load line |
|---|---|---|---|---|---|
| regression | 01:19:45 | 01:24:53 | 0 | 17 / 0 | 29,17,21 |
| refusal-contract-baseline | 01:26:37 | 01:27:43 | 0 | 3 / 0 | 81,88,87 |
| admission | 01:28:19 | 01:29:01 | 0 | 11 / 0 | 21,16,7 |
| filter | 01:29:53 | 01:30:11 | 0 | 3 / 0 | 22,18,18 |
| filter-panel | 01:31:09 | 01:31:51 | 0 | 5 / 0 | 26,19,20 |
| style | 01:32:29 | 01:32:43 | 0 | 6 / 0 | 20,28,9 |
| publish | 01:33:21 | 01:45:36 | 0 | 4 / 0, 1 SKIP | 12,22,11 |
| **console** | 01:46:36 | 01:53:30 | **1** | 10 / 2 (REGRESS', K7) | 23,23,36 |
| layout | 01:55:27 | 01:56:27 | 0 | 11 / 0 | 17,20,19 |
| **selection** | 01:57:06 | 02:05:17 | **1** | 14 / 4 | 19,13,14 |
| export-view | 02:06:00 | 02:06:27 | 0 | 4 / 0 | 15,39,13 |
| recording | 02:07:05 | 02:07:25 | 0 | 5 / 0 | 20,12,14 |
| **command-bar** | 02:08:18 | 02:10:57 | **1** | 13 / 1 (E-AND) | 68,74,77 |
| attributes | 02:11:55 | 02:14:18 | 0 | 2 / 0 | 7,9,7 |
| table | 02:15:14 | 02:16:26 | 0 | 4 / 0 | 14,12,12 |
| **project** | 02:17:03 | 02:17:53 | **1** | 2 / 1 (STYLE) | 12,16,13 |
| residency-harness | 02:19:10 | 02:19:30 | 0 | exit code only | 60,26,26 |
| pan-anchor | 02:20:47 | 02:23:42 | 0 | 16 / 0 | 15,18,12 |
| source-watch-idle | 02:24:22 | 02:24:43 | 0 | 8 / 0 | 21,16,7 |
| source-changed-pre | 02:25:23 | 02:25:49 | 0 | 7 / 0 | 35,23,25 |
| **source-changed-post** | 02:26:30 | 02:26:57 | **3** | 6 / 0, S5d INCONCLUSIVE | 23,23,26 |
| source-changed-reopen | 02:27:36 | 02:28:33 | 0 | 11 / 0 | 26,17,12 |
| colour | 02:29:09 | 02:29:54 | 0 | 5 / 0 | 23,21,25 |

Comparisons the brief asks for (verdicts; durations are single readings on a shared laptop):
- **filter-panel:** all five steps PASS, as at C. FIND' took 14760 ms against 17366 ms at C.
- **table:** PC-E1 to PC-E4 PASS, as at C. PC-E4 took 19706 ms against 22927 ms. The `[table] 4 PASS, 0 FAIL` summary and the fixtures-hash line are the same.
- **regression:** all 17 PASS, as at C. PT' is PASS (4940 ms against 6338 ms at C). LN' is PASS (4981 ms against 5526 ms at C). FIND' took 27862 ms against 39473 ms at C.
- **layout** against `<H>/out/fl-e2e-layout-s8b.log` (2272cce8): all 11 steps have the same verdicts.
  - FILL PASS is 17396 ms against 17694 ms.
  - RESIZEQ PASS is 17191 ms against 17231 ms.
  - FILL's line still reads `qualifying cells 2 before the toggle (480+312px wide) and 2 after (758x552 measured)`.
- **Other suites, in earlier series:**
  - The PR B head series exited 0 for `console`, `selection`, `command-bar` and `project`. Here they exit 1 (details in Failures).
  - `source-changed-post` was rc 3 (S5d INCONCLUSIVE) in PR B's series too.

Byte-copied lines of the runs (result lines at most 700 characters, the cut marked `<CUT>`; per-run files hold them all). All hover-barrier trace lines are left out.
- **First lines:** every log's first line is `worktree C:/dev/wt/fl head e1fd84957b7ae042a075e7ccc5628a3de5670eb7 start <time>`. The `start` is in the table.
- **Last two lines and rc:**
  - regression: `Full render-trace ledger: C:\dev\wt\fl\frontends\shell\e2e\out\regression-render-trace-1795051492806.json`, `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`, `rc=0 end 2026-11-19T01:24:53Z`.
  - filter: `Full render-trace ledger: ...filter-render-trace-1795051810987.json`, same second line, `rc=0 end 2026-11-19T01:30:11Z`.
  - export-view: `[E-CV-RESIZE] PASS (6798ms): F' [2599780.0746867373, 1198925.9364673186, 2602019.8486103383, 1201313.2404098392], R [2600095.2524544294, 1199127.1137658455, 2601704.670842646, 1201112.0631113122] at 1088x680`, then `[export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS`.
  - table: `[table] fixtures hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5d, slow-filter-scan.parquet 3fd819cb35aa`, then `[table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS`.
  - pan-anchor: last lines are an empty line then `==== 16/16 PASS ====`.
  - residency-harness: `Evidence file: C:\dev\wt\fl\frontends\shell\e2e\out\residency-harness-instrument-on-1795054770071.json`, `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`, `rc=0 end 2026-11-19T02:19:30Z`. No figure from it is recorded or claimed.
  - Others: each log ends with its own summary (as the PASS counts show) and an `rc=` line.
- **App-down output:** for each run it shows two `killed tree <pid>` lines and `port 9223 free` and `port 5400 free`. The files `<H>/out/fl-e2e-s9-<name>.down.txt` hold them.
- **Load lines:** in the table.
- **Session logs:** every app named one in its stderr, and each is copied to `<S>/fl9-s9-<name>.session.log`.
- **Result lines of the 18 passing runs and the failing ones:** in `<S>/fl9-harvest-<name>.txt`; all are in the transcript.
- Some of the long PASS lines are cut; the cuts are marked and the files hold the 700-character form.
- The sed-trimmed views in my transcript are cut at 230 characters; those are not the quoted form.

## Failures, each with its class
No failure is an I8 (FIND' in `filter-panel`, PC-E4 in `table`, PT' and LN' in `regression` all PASS). I made no re-run. A cause is not claimed for any of them.

1. **`selection` (rc 1; 14 PASS, 4 FAIL): the known failure** of ADV-2026-11-18-05 item 1, node id `selection-export-unknown-attempt`. All four failing steps end `unknown-attempt`, so none was re-run:
   - `[E-EXPORT] FAIL (12647ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 64ms, T 600000ms); prepare-to-execute 0ms`
   - `[E-ASK] FAIL (132379ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 13303ms, T 600000ms); prepare-to-execute 0ms 0ms`
   - `[E-ASK-STATEMENT] FAIL (19242ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 12799ms, T 600000ms); prepare-to-execute 0ms`
   - `[E-ASK-TWO] FAIL (113333ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 20ms, T 600000ms); prepare-to-execute 0ms 0ms`
   - The other 14 steps PASS, including E-SCOPE and E-KINDS. The `EXPORT-TODAY` line is SKIP.
2. **`console` (rc 1), recorded as seen, not an I4 on my reading.** Two FAIL lines:
   - `[REGRESS'] FAIL (391984ms): REGRESS': npm run e2e:regression exited 1 (391984ms). Tail:` Its tail shows MP', PT', LN', B2'/B3', ABSENTCRS', C2'/C3' and NET' all PASS or INFO, so PT' and LN' are not the failure.
   - `[K7] FAIL (157125ms): K7: expected .residency-status after the last zoom-out notch to be the declared partial-view status verbatim (residencyStatus.ts's SETTLED_PARTIAL_WITHIN_BUDGET_TEXT) but it was null (per-notch snapshot at the end of the loop: null); expected "Filling has finished for this view — some areas were not loaded; pan or zoom to load them."`
   - That K7 line is the nested `regression`'s own K7, printed in the nested summary. The same K7 step PASSed in my standalone `regression` run (rc 0, 140 s, `[K7] PASS (140233ms)`) and in S7's. The 10-second status wait in `regression.mjs` (`K7_STATUS_SETTLE_TIMEOUT_MS = 10_000`) is a timing bound.
   - I did not show that this failure depends on timing in the shared run. Load at the start was 23,23,36. So I did not treat it as I4 and did not re-run it. Whether it is I4 is the custodian's call.
   - The other 10 steps PASS: HEADER', ECHO', TWOCMD', HEXLIM', REFUSAL', CLASSB', CLASSC', GROUP', COPYTRUNC', UNCLASS'.
3. **`command-bar` (rc 1), as seen.** Load at the start was 68,74,77, the highest of the series. The failure:
   - `[E-AND] FAIL (49669ms): E-AND: after card B was added the console holds 1 record_step rows against 1 + 1, the last carrying the combined text: true`
   - The step waits 30 s for the row count to reach the earlier count plus one. The other 13 steps PASS.
4. **`project` (rc 1), as seen.** Load at the start was 12,16,13. The failure:
   - `[STYLE] FAIL (30273ms): STYLE: waited 30000ms for at least 5 record_step rows, all ok (after the opacity); the last reading was ["ok","ok"]`
   - OPEN and CLAUSES PASS. CLAUSES' line says `4 record_step rows reached ok`.
   - **Not diagnosed:** E-AND and STYLE are the same kind of failure, the console's `record_step` row count not reaching what the step expects. This is not shown to be an effect of this change.
   - A rerun of either would show whether the failure repeats. A diff against the base is also open.
   - If this node's extra open-time queries are the cause, E-AND (command-bar) and STYLE (project) could be a console-list effect. Nothing I ran shows that.
5. **`source-changed-post` (rc 3):** `[S5d-post-check-route-confirmed] INCONCLUSIVE: S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the cha<CUT>`. All other steps PASS. Its README entry says that outcome reads INCONCLUSIVE with exit code 3. PR B's series had the same outcome.
6. **I4:** none declared, so there are no `s9-<name>-2` tags.
   - The brief's I4 needs the failure to depend on timing in the shared run, and I could not show that for any of the three.
   - The custodian may rule the console K7 or E-AND an I4 and have them run once more alone.

## Holds (25 shared holds, 1 command each; `<M>` is `<S>`'s machine script; times in UTC from files `<S>/fl9-h<n>.asked`, `.granted`, `.ended`)
Every hold exited 0 and every release printed `MACHINE_RELEASED project=<m> ...`. There was no 96, 98 or 99 and no second 97. Hold lines carried `also=<m>`.

| n | what | asked | granted (command start) | ended |
|---|---|---|---|---|
| 1 | E-FL | 01:07:28 | 01:14:53 | 01:15:05 |
| 2 | recentre-crossing | 01:15:23 | 01:15:25 | 01:19:04 |
| 3 | regression | 01:19:31 | 01:19:34 | 01:25:04 |
| 4 | refusal-contract-baseline | 01:25:57 | 01:26:23 | 01:27:47 |
| 5 | admission | 01:28:09 | 01:28:10 | 01:29:06 |
| 6 | filter | 01:29:40 | 01:29:42 | 01:30:17 |
| 7 | filter-panel | 01:30:58 | 01:30:59 | 01:31:56 |
| 8 | style | 01:32:17 | 01:32:19 | 01:32:47 |
| 9 | publish | 01:33:09 | 01:33:11 | 01:45:41 |
| 10 | console | 01:46:23 | 01:46:25 | 01:53:37 |
| 11 | layout | 01:55:15 | 01:55:17 | 01:56:32 |
| 12 | selection | 01:56:54 | 01:56:56 | 02:05:22 |
| 13 | export-view | 02:05:47 | 02:05:49 | 02:06:33 |
| 14 | recording | 02:06:52 | 02:06:55 | 02:07:33 |
| 15 | command-bar | 02:08:00 | 02:08:05 | 02:11:03 |
| 16 | attributes | 02:11:42 | 02:11:44 | 02:14:22 |
| 17 | table | 02:15:03 | 02:15:05 | 02:16:31 |
| 18 | project | 02:16:50 | 02:16:52 | 02:17:58 |
| 19 | residency-harness | 02:18:57 | 02:18:59 | 02:19:34 |
| 20 | pan-anchor | 02:20:36 | 02:20:38 | 02:23:47 |
| 21 | source-watch-idle | 02:24:08 | 02:24:10 | 02:24:48 |
| 22 | source-changed-pre | 02:25:11 | 02:25:13 | 02:25:54 |
| 23 | source-changed-post | 02:26:18 | 02:26:20 | 02:27:02 |
| 24 | source-changed-reopen | 02:27:25 | 02:27:27 | 02:28:38 |
| 25 | colour | 02:28:58 | 02:29:00 | 02:29:59 |

- **Hold 1 queued behind another hold of this project.**
  - It waited about 7.5 minutes. Its output shows seven lines of the form `MACHINE_WAITING shared: turn of <m> held by pid <m> since <m>`.
  - That wait is the only time another hold of this project stood ahead of mine that I saw.
  - Every hold line carries `also=<m>`, which names other shells in the machine script's book. I did not read them further.
- **Load:** the highest start-of-run readings were 81,88,87 (`refusal-contract-baseline`) and 68,74,77 (`command-bar`), with the other agent running beside. Both runs behaved as the table shows.
- **Waits:** the holds in the table beyond hold 1 were granted within seconds, except hold 4 (26 s).

## Processes at the end
- Every background shell I started has exited (each hold's task completed). I started no process that is still running.
- A last `fl-e2e-busy.ps1`, in a call of its own, printed `FREE`.
- HEAD in `C:/dev/wt/fl` is e1fd84957b7ae042a075e7ccc5628a3de5670eb7 and its porcelain is empty.
- `df -h`: C: 47G free, D: 355G free.
- The main checkout's porcelain shows changes that are not mine; I wrote nothing there.

## Things I did that the brief does not name
- In each hold's chain I added `date -u +%FT%TZ > <S>/fl9-h<n>.granted` after the hold and `.ended` plus `echo rc=...` after the command. These were extra writes under `<S>` with `fl9-` names, to stamp the hold times. The hold call is otherwise the brief's shape.
- I redirected run-suite's own stdout (the app-down output and "copied report" lines) to `<S>/fl9-s9-<name>.runout`.
- For the first suite (regression) and the first fixture pass, I combined the harvest with a busy check in one call. From the next run on the busy check was in a call of its own.
- I wrote the helper scripts `<S>/fl9-wait.sh`, `<S>/fl9-harvest.sh` and `<S>/fl9-post.sh`, and `<S>/fl9-harvest-<name>.txt` files.
- I read two source files for the failure notes: `command-bar.mjs` (the E-AND step) and `project.mjs` (STYLE), plus `regression.mjs` around K7. I parsed the project console ledger JSON with `node -e`; it holds no record_step rows, so it shows nothing about the failure.
- `publish.mjs` itself ran `cargo build -p spatial-kernel --example verify-bundle` inside its hold. It took about 12 minutes and wrote under the worktree's ignored `target` folder. I started no build of mine.
- Foreground waits of 180 s or more were moved to the background by the tool. I did not sleep in the foreground.
- I ran no `git` write and changed no tracked file.
