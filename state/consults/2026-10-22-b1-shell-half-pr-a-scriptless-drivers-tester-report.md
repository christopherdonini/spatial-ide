*Custodian's filing note (2026-10-22): milestone 4 PR A's three scriptless e2e drivers at B 55618ab5 (the architect's F1 (a)), by a tester under the port-5400 harness, on the base series' exe (its sha256 checked, nothing built). The run 16:27:09Z to 16:35:16Z by its transcript (Bash 22, Read 1); its claims were read against that transcript's calls before filing. pan-anchor, source-watch-idle and source-changed's default route pass every step; the post route's S5d is INCONCLUSIVE twice, every other step passing, which milestone 3's Amendment 3 item 12 records beside the runs as neither I12 nor I3 (the PLAN item source-changed-post-route-s5d-race). Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 1588c13ba5ec76238e8e8d4fa49a257484818e0b7e4d6f1842e7c09092e96aa2.*

---

Scriptless drivers: b1-shell-half PR A at 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f, tester, port-5400 harness

Result: all pass except one step. pan-anchor, source-watch-idle and source-changed's default route pass every step. source-changed's post route ended rc 3 twice, with S5d-post-check-route-confirmed INCONCLUSIVE and every other step PASS. Amendment 3 item 12 says an S5d-only failure is recorded beside the base's runs and is neither I12 nor I3, so I did not STOP. Please confirm that reading. I ran the post route last, so nothing was left unrun.

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). There was no override and no context handoff. I have no usage figures.

Failure classes for this harness:
- Interface: the real debug exe, driven through CDP by the drivers themselves. The one non-product part is the npx shim.
- Claim to results: every claim below points to a file in the out folder of my scratch folder (m4a-f1-h, under the session scratchpad). All file names start m4a-f1-.
- Operator-facing lines: they describe what ran at this commit. No tracked file was changed.
- Assertion reached: each driver printed its own step table or PASS/FAIL summary, and I read the final lines.

Harness as run:
- I copied the base series' scripts (app-up, app-up-wait, app-down, busy, run-suite, shim and shim-wait). Only the names and the scratch path changed: m4a-e2e became m4a-f1.
- Vite ran on 127.0.0.1:5400 with --strictPort. The exe ran with CDP on 9223 and `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`. The overlay was baked into the exe at the base series' build, so I built nothing.
- I used the waiting shim (shim-wait) for all four runs, so a driver's own stop() ends the app. The npx shim was on PATH for these runs only.
- Before each launch the read-only busy check printed FREE. After each run, app-down killed only the two PIDs it had recorded, and ports 9223 and 5400 read free.
- Each run was inside its own shared hold, with CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8 set by run-suite. Each run was a foreground call with a timeout and its output redirected to a file.
- The source-changed route variable (SPATIAL_E2E_SOURCE_CHANGED_ROUTE) was unset for the default route (recorded in m4a-f1-routeenv-pre.txt) and `post` for the post route.

Exe: `D:/wt-targets/m4a/exes/spatial-ide-shell-m4a.exe`, sha256 d967ca6066d6e418094e960a2e4c149d1012019dff402c1a2a0e3e04adc0411b. It matches the expected value, so nothing was built. The check is in m4a-f1-exe-sha.txt.

Fixtures:
- I hashed 17 files in target/fixtures/manual-walkthrough: all but slow-filter-scan.parquet, which none of the three drivers uses. I hashed them before the series and after every run, and `cmp` printed FIX-IDENTICAL after all five runs.
- 100k-happy-path.parquet, the only shared fixture the drivers open: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 before and after.
- The drivers' own scratch copies (source-changed-scratch.parquet, source-watch-idle-scratch.parquet) printed `fixture-integrity PASS`, sha256 unchanged, the same fd0c74... value.

Runs (UTC, 2026-10-22; "end" is the driver's own rc line):

| Run | Route | rc | Start | End |
|---|---|---|---|---|
| pan-anchor.mjs | n/a | 0 | 16:28:40 | 16:31:50 |
| source-watch-idle.mjs | n/a | 0 | 16:32:17 | 16:32:33 |
| source-changed.mjs | default (pre-check) | 0 | 16:32:52 | 16:33:11 |
| source-changed.mjs | post | 3 | 16:33:30 | 16:33:48 |
| source-changed.mjs | post, re-run once alone | 3 | 16:34:10 | 16:34:29 |

Last lines:
- pan-anchor: "==== 16/16 PASS ====".
- source-watch-idle: F0 to F3 and fixture-integrity all PASS. Its last lines are "This run LAUNCHED the app and has now torn it down (session.stop()); nothing was left running." and "rc=0 end 2026-10-22T16:32:33Z".
- source-changed default route: S1 to S5c and fixture-integrity all PASS. The last lines are "This run LAUNCHED the app; it stays running on CDP port 9223." and "rc=0 end 2026-10-22T16:33:11Z". That line is the driver's own text, not the harness's: app-down then killed the tree.
- source-changed post route, both runs: S1, S2, S4 (stream-issued 17 -> 21), S5a, S5b, S5c and fixture-integrity PASS; S3 INFO "deferred to S4". The S5d line reads, byte-copied up to the point I cut it:
  "S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check; which kernel route ended the generation is not read by this step, so the post-check route is neither shown nor excluded."
  The evidence in the first run was sessionLogBaselineLineCount 31, newLineCount 9, and one tile-stream-mint-refused line. The step was INCONCLUSIVE both times, not FAIL. The driver's last lines were "This run LAUNCHED the app; it stays running on CDP port 9223." and "rc=3".

Copied files (names unique per run, none overwritten; all in `<scratch>/m4a-f1-h/out/`):
- Per run, with tags pananchor, watchidle, srcchanged-pre, srcchanged-post and srcchanged-post2: m4a-f1-<tag>.log (the driver's output with the start and rc lines), .app.err.log, .app.out.log, .vite.err.log, .busy.txt and .down.txt. The wrapper output is m4a-f1-wrap-<tag>.txt.
- Reports: m4a-f1-watchidle.rep.source-watch-idle-1792686752835.json; m4a-f1-srcchanged-pre.rep.source-changed-1792686791622.json; m4a-f1-srcchanged-post.rep.source-changed-1792686828897.json; m4a-f1-srcchanged-post2.rep.source-changed-1792686869365.json. pan-anchor writes no report JSON; its copy holds only the tauri.e2e.conf.json overlay file.
- Session log: none was copied. The session log (e2e/out/app.log) is written only when a driver spawns its own `npx tauri dev`. Under this harness the shim starts the app, so the log was not written, and the app's stderr (.app.err.log) is the capture.
- Fixture hash lists: m4a-f1-fix-initial.txt and m4a-f1-fix-after-<tag>.txt.

Processes:
- A final process-list filter on the exe, vite and this worktree found no app or vite process. The only matches were my own shells, which match on their working directory.
- The final busy check printed FREE (rc 0), and the pids file is gone.
- `git status --porcelain` in the m4a worktree was empty, rc 0, with HEAD 55618ab54c32f1e0712d4a657d1e3f1b30c0ef8f. I made no commit and no push.
- The drivers wrote ignored files under the worktree's e2e/out (the reports, the scratch copies and the junction folders), as they always do.

Hold lines (project SpatialIDE only; the other shell names are from the script's output). All five holds were granted, and no exit code 96 to 99 occurred:
- MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:23332 ... then MACHINE_RELEASED project=SpatialIDE shell=bash.exe:23332 affinity=FF (cores 0-7). That was pan-anchor.
- MACHINE_HOLD shell=bash.exe:32168, then released. That was source-watch-idle.
- MACHINE_HOLD shell=bash.exe:45052, then released. That was source-changed's default route.
- MACHINE_HOLD shell=bash.exe:7728, then released. That was the post route.
- MACHINE_HOLD shell=bash.exe:19620, then released. That was the post-route re-run.
- The -What texts read "b1-shell-half PR A f1: <driver and route>".

No timing-sensitive failure was seen. No harness-caused attempt occurred.
