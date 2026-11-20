*Filed by the custodian: P4b's one series report (ADV-2026-11-16-06), at the final candidate 0c74eeab7e0c100a5a193e5109e272025ca43bb6, by the standard tester (claude-sonnet-5-5): its final message, 8771 bytes, sha256 9038d93e8ecca8a2505e5e630b72d5e8d17013468687decb132d3929a5438f3b, below the rule byte for byte but for two maskings by the custodian (the hold lines' project value, twice, as <m>), with one final newline added. An interim hand-back at 2026-11-20T18:32Z said only that the first run was going and is not filed. Calls Read 1, Bash 13, Grep 1, SubagentHandback 1, none errored, by unique call ids, from 2026-11-20T18:32:04Z to 2026-11-20T18:36:13Z by its transcript. The custodian's checks: each of its 15 bracketed result lines is a line of the log it names, but INSIDE-OPEN's, whose file name in the log holds a U+007F between its third and fourth letters that the report drops; its reopen rows leave out their Console counts, as the report says. The cleanup line stays a warning (ADV-2026-11-20-21 item 2).*

---

Series: b2-piece-1c-save-and-reopen P4b at 0c74eeab7e0c100a5a193e5109e272025ca43bb6, tester, port 5180

Result: all three suites ended rc 0 with every row PASS (project 11, reopen 10, second-open 2, none FAIL). One cleanup line appeared at the end of `second-open`: it could not remove one temp folder (EPERM).

**Start state**
- Checked at 18:32Z in `C:/dev/wt/1c-p4b`.
- HEAD was H and the porcelain was empty.
- `git ls-remote origin refs/heads/cut/b2-piece-1c-p4b` printed H.
- `ls` of both `node_modules` folders returned rc 0.
- `NOTICE.txt` was present (3506979 bytes).
- Free space was C: 45G and D: 378G, so no STOP.
- Env on every run: `TMP=TEMP=D:/wt-data/1c-p4b`, `CARGO_TARGET_DIR=D:/wt-targets/1c-p4b`, `CARGO_BUILD_JOBS=8`, `RUST_TEST_THREADS=8`.

**The three runs**

| name | start (Z) | end (Z) | rc | PASS | FAIL |
|---|---|---|---|---|---|
| project | 18:32:35 | 18:33:43 | 0 | 11 | 0 |
| reopen | 18:34:06 | 18:35:19 | 0 | 10 (R1 to R9, E-CHANGED) | 0 |
| second-open | 18:35:36 | 18:35:59 | 0 | 2 (E-SECOND, E-CRASH-UNLOCK) | 0 |

The `rc=` line at the end of each log was appended by my wrapper command, not printed by the suite. Logs are `<S>/p4bs-project.log`, `<S>/p4bs-reopen.log` and `<S>/p4bs-second-open.log`.

**project (E-SAVE).** First line: `> spatial-ide-shell@0.1.0 e2e:project`. The last two lines of the log are the console-ledger path line (in the worktree's `e2e/out`) and `rc=0`.
- `[OPEN] PASS (5231ms): admitted; the Save control and the first pixels are there`
- `[CLAUSES] PASS (8165ms): three clauses, the second off; the Filter section reads Applied: ("zone" = 'residential') AND ("zone" IS NOT NULL); their 4 record_step rows reached ok`
- `[STYLE] PASS (3522ms): opacity 0.37 and colour #112233 committed; their record_step rows reached ok`
- `[POSE] PASS (3257ms): camera set to centre (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572`
- `[SAVE] PASS (49ms): answered "asked"; the folder holds project.spatial alone (2497 characters); spatial://project/7ed7c2de6b0c934b723faa1ceffb5ff9`
- `[READBACK-FILTER] PASS (0ms): the file holds the three clauses in order, the second off, and the filter ("zone" = 'residential') AND ("zone" IS NOT NULL)`
- `[READBACK-STYLE] PASS (1ms): the file's style holds the fill colour #112233 and the applied opacity 0.37`
- `[READBACK-VIEW] PASS (0ms): the file's view holds the pose's patterns: centre 4143d7e22aaaaaab, 4132530449249249, zoom bfeb6db6db6db6dc`
- `[SECOND-SAVE] PASS (57ms): answered "not-asked"; the second folder stays empty; the first folder's project.spatial still reads back`
- `[INSIDE-OPEN] PASS (6024ms): the copy under "parcels.parquet" in the third folder was admitted`
- `[INSIDE-SAVE] PASS (33ms): answered "asked"; the third folder holds project.spatial and the copy; spatial://project/391d8229257c0439018c26fb33348f0d`
- `[NOTICE-S18] PASS (10ms): the save notices hold S18's text once; the dataset entry's locators read machine-recorded`
- The suite also printed `project: fixture sha256 after 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 (unchanged)`.

**reopen (E-REOPEN and E-CHANGED).** First line: `> spatial-ide-shell@0.1.0 e2e:reopen`. The last two lines of the log are the ledger path line and `rc=0`.
- `R1` PASS (5167ms): F1 (parcels.parquet in folder P) admitted; the Save control and the first pixels are there.
- `R2` PASS (8745ms): two clauses (the second off), the fill colour #112233 and the camera at (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572.
- `R3` PASS (50ms): saved into P through the hook; spatial://project/164f699820056ca47532bbdd6eea8264; locators machine-recorded,project-relative.
- `R4` PASS (19ms): refused as skp.project_open_elsewhere with S9's own-window place; the run ended; the open and its two clauses are kept.
- `R5` PASS (6229ms): another file opened; the first handle's close_dataset row is at ok.
- `R6` PASS (4502ms): opened; the open_project request carries answer and relink null, outcome ok; filter, clauses, fill colour, opacity and view equal the file's, the view bit for bit.
- `R7` PASS (28ms): the save answered not-asked (no picker slot used); the file's identity and workspace are unchanged.
- `R8` PASS (6401ms): P's handle closed; Q (a hand copy of P) gave S8 with its text; the same choice opened it; folders.json lists both folders.
- `R9` PASS (12405ms): P2's handle closed; P2's data moved; S11 named moved-away.parquet; the re-link slot's file opened the project.
- `E-CHANGED` PASS (13645ms): F4's predecessor handle closed; F4 (F1 with its mtime 60 s later) opened; the notice names mtime alone: `["[P6 placeholder] The data differs from what the project recorded when it was saved. In the file: mtime. The project was opened on the data as it is now."]`
- The parenthetical console-row counts in R5 to R9 and E-CHANGED are not copied here; they are in `<S>/p4bs-reopen.log`.

**second-open (E-SECOND, E-CRASH-UNLOCK).** First line: `> spatial-ide-shell@0.1.0 e2e:second-open`. The last two lines of the log are the EPERM cleanup line (below) and `rc=0`. The tries and times are evidence, not a measurement.
- `[E-SECOND] PASS: B's first try was refused as skp.project_open_elsewhere with S9's other-window place; after A opened another file B's reopen was admitted on try 1 (99ms; evidence, not a measurement)`
- `[E-CRASH-UNLOCK] A reopened P on try 1 (86ms); killing A's process tree`
- `[E-CRASH-UNLOCK] PASS: B's reopen of P was admitted on try 2 (413ms; evidence, not a measurement) after A's process tree was killed`
- Last log line before `rc=0`: `second-open: could not remove D:\wt-data\1c-p4b\spatial-second-wv2b-9uOl4P: EPERM, Permission denied: \\?\D:\wt-data\1c-p4b\spatial-second-wv2b-9uOl4P '\\?\D:\wt-data\1c-p4b\spatial-second-wv2b-9uOl4P'`

**Failures.** None, so nothing was re-run. The EPERM line is a cleanup warning from the suite and the exit code stayed 0. The folder `D:/wt-data/1c-p4b/spatial-second-wv2b-9uOl4P` is still there. I did not investigate or remove it.

**Logs.**
- `e2e/out/app.log` is 0 bytes (mtime 18:13) and was not rewritten by any of the three runs. It is copied to `<S>/p4bs-project.app.log`, `<S>/p4bs-reopen.app.log` and `<S>/p4bs-second-open.app.log`.
- None of the three logs names a session log, so no `.session.log` was copied.
- `second-open` wrote `e2e/out/second-app.log` (1218 bytes), which I did not copy. It is still in `e2e/out`, which is not tracked.

**Holds.** Each was asked once with `-MaxWaitMinutes 120` (`-Minutes` 25, 20 and 20) and granted at the first call, with no 97 and no retry. Each ended with a release line. Each hold line read `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, and each release line read `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`. No `others=` and no MACHINE_WAITING or MACHINE_ERROR lines.

**Port checks.** I ran one before each run and one at the end. Before `project` the output was clean. Before `reopen` and `second-open` and at the end, only TIME_WAIT entries on 5180 and 9223 remained, with no listener (`<S>/p4bs-ns0.txt` to `p4bs-ns3.txt`).

**End state**
- HEAD is H and the porcelain is empty.
- `git diff --quiet HEAD -- frontends/shell/src-tauri/Cargo.lock frontends/shell/package-lock.json renderer/bundle-viewer/package-lock.json` returned rc 0.
- Free space is C: 45G and D: 378G.
- A command-line check for processes naming `wt-data/1c-p4b` or `wt-targets/1c-p4b` found only shell processes (three `bash.exe`, one `powershell.exe`). I started the suite's app and node processes through my background calls. I did not look for or kill anything else, and no listener remains.
- `tasklist` shows `msedgewebview2.exe` and `node.exe` processes. I cannot attribute them to this series and did not touch them.

**Outside the brief.** I appended `rc=` to each log, wrote `.start` and `.end` time files and `p4bs-ns*.txt` port-check files in `<S>`, and copied `app.log` three times. I changed no tracked file and made no commit or push.

**Model.** Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

**Four failure classes**
- **Harness.** All three suites use their own launch on 5180 through the app's real interface (the project-open and save path the product exposes). `second-open` kills A's process tree for E-CRASH-UNLOCK.
- **Result claims.** Every claim above points to the log files named in this report.
- **Operator-facing lines.** The lines I quote are what the suites printed at H in this run. I added nothing to a results file.
- **Assertion reach.** Each row is printed as PASS after its own check. The `project` row text states the read-back values compared, and `second-open` prints a PASS that names the refusal and the admission.
