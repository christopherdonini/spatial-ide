*Custodian's filing note (2026-11-12): the five e2e drivers of slot 1's b2-piece-1c-save-and-reopen, step 1, that R4's run at its head left out because the custodian's brief named only the README's npm scripts; from its hand-back (14968 bytes, sha256 baa477f68f363afe27bc00c1ee6f09b28567a2d5474a738622a76487c3b13be2), below the rule. **Two spans are changed:** the session folder's scratch path, in the Paths list, is written `<S>/`; and one bullet, on processes on the machine the tester did not start, is elided, marked where it stood. Nothing else is changed, and one final newline is added. Its brief by file (10636 bytes, sha256 9492fe094e732abec1e84f7ae6ff0c903d665a6a03552f14e2e65e3b94b8c6f3); the run 03:52:45Z to 04:03:09Z by its transcript, 30 calls (Bash 28, Read 1, the hand-back), none errored, 5 shared holds, model claude-sonnet-5-5. The custodian read each run's last line. Pan-anchor's one failing case is the line the record holds since `state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md`, byte for byte; #307's one change to `WorkingCanvas.tsx` is the read-only `currentView`. A report, a reading and not Authority.*

---

Drivers: PR #307 at 708a3d5c38d57c772c66b82e16a4b501e6aca563, the five runs R4 left out, tester, port-5400 harness

Result: findings. Two runs differ from the brief's known results (pan-anchor and source-changed post). The fixtures were unchanged. None of the brief's stop conditions was hit.
- pan-anchor: rc 1, 15/16 PASS. The one failure is "large: recenter-crossing-A dx=-1200", recorded as is and not re-run.
- source-changed post route: rc 0 with S5d PASS. The brief expected rc 3 with only S5d INCONCLUSIVE, so this does not match PR A's record.
- The residency harness, source-watch-idle and the reopen route are rc 0.

**Four failure classes, as they apply to my harness**
- The harness uses the interface the product exposes. It is the port-5400 harness driving the debug app over CDP 9223. It is not the packaged exe, though the exe was hash-checked.
- Every result claim points to the log lines below. The files are in `<H>/out/` and `<S>`.
- Every operator-facing line below describes what was measured at this commit, 708a3d5c.
- Every measurement test reaches its assertion. Residency was run for its exit code only. It exited 0 after about 23 s, and I read no assertion from it.

**Start state**
- HEAD is 708a3d5c38d57c772c66b82e16a4b501e6aca563 and the porcelain is empty.
- D: has 191G free (the brief asks for at least 40 GiB).
- `node_modules/` is present in `frontends/shell` and in `renderer/bundle-viewer`.
- All 10 harness files match the brief's sizes and sha256 values (checked by command).
- I read `b2c-e2e-run-suite.sh` whole and changed no harness file.
- The exe is 91545088 bytes with sha256 ecfff91eb6ada287fa09f96a4d99b19e629643e711fc0c96b4796ea1c8bf59aa, as given.

**Fixtures** (the only two the five runs name; byte-identical before and after, checked by diff)
- `100k-happy-path.parquet`: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49.
- `filter-zoned.parquet`: 409872 bytes, sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46. The residency harness uses it by default.

**Runs** (tag, script, route, rc, start, end, load)

| tag | script | route | rc | start | end | load line |
|---|---|---|---|---|---|---|
| r4c-residency | residency-harness.mjs | n/a | 0 | 03:53:59Z | 03:54:22Z | `load r4c-residency 03:53:45Z 83,76,85` |
| r4c-pan-anchor | pan-anchor.mjs | n/a | 1 | 03:55:13Z | 03:58:47Z | `load r4c-pan-anchor 03:55:04Z 31,54,35` |
| r4c-source-watch-idle | source-watch-idle.mjs | n/a | 0 | 03:59:23Z | 03:59:42Z | `load r4c-source-watch-idle 03:59:12Z 12,23,23` |
| r4c-source-changed-post | source-changed.mjs | post | 0 | 04:00:14Z | 04:00:38Z | `load r4c-source-changed-post 04:00:05Z 21,18,15` |
| r4c-source-changed-reopen | source-changed.mjs | reopen | 0 | 04:01:14Z | 04:02:06Z | `load r4c-source-changed-reopen 04:01:05Z 42,12,15` |

The residency run started under a load of 83/76/85. It passed, so this does not matter for it. The pan-anchor failure was under a load of 31/54/35. The brief says a timing-sensitive failure is reported with its load line and not recorded as a failure. Whether pan-anchor's failure is timing-sensitive is for the custodian.

**Run lines** (byte-copied from `<H>/out/b2c-e2e-<tag>.log`)

*r4c-residency*
- First line: `worktree C:/dev/wt/b2c head 708a3d5c38d57c772c66b82e16a4b501e6aca563 start 2026-11-12T03:53:59Z`
- Last two lines: `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.` and `rc=0 end 2026-11-12T03:54:22Z`
- Reports copied: `residency-harness-instrument-on-1794455662404.json` and `tauri.e2e.conf.json`.

*r4c-pan-anchor*
- First line: `worktree C:/dev/wt/b2c head 708a3d5c38d57c772c66b82e16a4b501e6aca563 start 2026-11-12T03:55:13Z`
- Result lines, which are all 16 checks:
```
PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000
PASS  small: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  small: paint-vs-event dx=85  ::  painted 83.0 vs deck 83.0 -> 0.01 buffer px (tol 4)
PASS  small: paint-vs-event dx=-85  ::  painted -83.0 vs deck -83.0 -> -0.01 buffer px (tol 4)
PASS  small: there-and-back-net  ::  net residual 0.00 buffer px (tol 4)
PASS  small: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
PASS  small: recenter-crossing-A dx=-1200  ::  grab-point residual 0.00 buffer px (tol 4)
PASS  large: pixel-spaces-coincide  ::  client==buffer (788x812 == 788x812), ratio 1.000
PASS  large: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)
PASS  large: paint-vs-event dx=250  ::  painted 243.9 vs deck 244.0 -> -0.08 buffer px (tol 4)
PASS  large: paint-vs-event dx=-250  ::  painted -244.0 vs deck -244.0 -> 0.03 buffer px (tol 4)
PASS  large: there-and-back-net  ::  net residual 1.00 buffer px (tol 4)
PASS  large: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)
FAIL  large: recenter-crossing-A dx=-1200  ::  grab-point residual 1100.01 buffer px (tol 4)
```
- Last two lines: `FAILED: large: recenter-crossing-A dx=-1200` and `rc=1 end 2026-11-12T03:58:47Z`. Just above them is `==== 15/16 PASS ====`.
- The only report copied was `tauri.e2e.conf.json`.

*r4c-source-watch-idle*
- First line: `worktree C:/dev/wt/b2c head 708a3d5c38d57c772c66b82e16a4b501e6aca563 start 2026-11-12T03:59:23Z`
- Step result lines:
```
[W1-open] PASS: scratch copy admitted: C:\dev\wt\b2c\frontends\shell\e2e\out\source-watch-idle-scratch.parquet
[W2-settle-and-precondition] PASS: resident before the change: 188665 vertices / 10000 features; interior-verified pixel buffer(86,547) at notch 2 -- 25-pixel neighbourhood entirely non-background; alpha 180 >= 150 (47,94,172,180)
[W3-touch-mtime-while-idle] PASS: modification time moved forward while idle; sha256 unchanged, so no byte was edited
[W4-wait-for-idle-end] PASS: .canvas-session-ended appeared
[F0-no-new-viewport-query] PASS: viewport_query count unchanged at 17 -- the event route ended the session, not a re-issued query
[F1-status] PASS: status shown, not dismissible; code chip "engine.source_changed"; sentence carries no engine. prefix
[F2-residency-cleared] PASS: resident vertices 0, resident features 0
[F3-picks-refused] PASS: hover over the formerly-occupied pixel shows the session-ended refusal, no id
fixture-integrity   PASS    sha256 unchanged across the run: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
```
- Last two lines: `This run LAUNCHED the app and has now torn it down (session.stop()); nothing was left running.` and `rc=0 end 2026-11-12T03:59:42Z`
- Reports copied: `source-watch-idle-1794455982062.json`, `source-watch-idle-scratch.parquet` and `tauri.e2e.conf.json`.

*r4c-source-changed-post* (expected rc 3 with S5d INCONCLUSIVE; seen rc 0 with S5d PASS)
- First line: `worktree C:/dev/wt/b2c head 708a3d5c38d57c772c66b82e16a4b501e6aca563 start 2026-11-12T04:00:14Z`
- Step result lines (S5d is the one that differs from the known record):
```
[S1-open] PASS: scratch copy admitted: C:\dev\wt\b2c\frontends\shell\e2e\out\source-changed-link\source-changed-scratch.parquet
[S2-settle-and-precondition] PASS: resident before the change: 188665 vertices / 10000 features; interior-verified pixel buffer(86,547) at notch 2 -- 25-pixel neighbourhood entirely non-background; alpha 180 >= 150 (47,94,172,180); the hover there answers with the below-pick-resolution refusal; precondition: formerly occupied AND formerly hovered
[S3-retarget-junction] INFO: deferred to S4 (POST route): repointed only after a mint succeeds
[S4-issue-one-query-and-retarget-on-mint] PASS: a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 23 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture
[S5a-status] PASS: status shown, not dismissible; code chip "engine.source_changed"; sentence carries no engine. prefix
[S5b-residency-cleared] PASS: resident vertices 0, resident features 0
[S5c-picks-refused] PASS: hover over the formerly-occupied pixel shows the session-ended refusal, no id
[S5d-post-check-route-confirmed] PASS: "tile-session-ended-source-changed" present and no "tile-stream-mint-refused" since this run's own baseline -- a session ended and no tile mint refusal was logged; which kernel route ended the generation is not read by this step
fixture-integrity   PASS    sha256 unchanged across the run: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
```
- Last two lines: `This run LAUNCHED the app; it stays running on CDP port 9223.` and `rc=0 end 2026-11-12T04:00:38Z`
- The app's stderr has the line `session ended for dataset `ds_26248923141a6d1a5416e6ba8f17adbb`: the source changed during use ({mtime}); 23 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)`.
- Reports copied: `source-changed-1794456038053.json`, `source-changed-scratch.parquet`, `source-watch-idle-scratch.parquet` and `tauri.e2e.conf.json`.
- `source-watch-idle-scratch.parquet` was copied as a "report" because it is newer than the busy file. This run did not create it.

*r4c-source-changed-reopen*
- First line: `worktree C:/dev/wt/b2c head 708a3d5c38d57c772c66b82e16a4b501e6aca563 start 2026-11-12T04:01:14Z`
- Step result lines, all PASS: S1-open, S2-settle-and-precondition, S3-retarget-junction, S4-issue-one-query, S5a-status, S5b-residency-cleared, S5c-picks-refused, R1-failed-reopen-does-not-clear, R2-successful-reopen-clears-and-identifies, R3-zoom-to-layer-clickable-and-effective, R4-second-source-change-ends-the-new-session. The log is 35 lines. Their full text is in `b2c-e2e-r4c-source-changed-reopen.log` lines 7 to 17. The R4 line reads: `[R4-second-source-change-ends-the-new-session] PASS: the junction was repointed to a; the session stayed up while idle; the next query's pre-check refused with {mtime}; .canvas-session-ended reproduced on the new generation`
- Last two lines: `This run LAUNCHED the app; it stays running on CDP port 9223.` and `rc=0 end 2026-11-12T04:02:06Z`
- Reports copied: `source-changed-1794456126782.json`, `source-changed-scratch.parquet`, `source-watch-idle-scratch.parquet` and `tauri.e2e.conf.json`.

**App-down output** (the same four lines after every run: "killed tree X", "killed tree Y", then both ports free)
- Residency: `killed tree 60080`, `killed tree 68568`, `port 9223 free`, `port 5400 free`.
- Pan-anchor: `killed tree 52116`, `killed tree 73840`, then both ports free.
- Source-watch-idle: `killed tree 32076`, `killed tree 75356`, then both ports free.
- Source-changed post: `killed tree 31728`, `killed tree 70676`, then both ports free.
- Source-changed reopen: `killed tree 40884`, `killed tree 81760`, then both ports free.

**app.err.log first and last 20 lines**
- Each file holds only 2 lines for the residency, pan-anchor and reopen runs: `[spatial-ide-shell] session log: …\session-<id>.log` and `[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180`. The first 20 and last 20 are the same lines.
- Source-watch-idle adds `the advisory source watcher signalled observed-change`.
- Source-changed post adds the `session ended for dataset …` line quoted above.

**Session logs.** The app wrote one per run, and I copied each right after its run to `<S>/1c-r4c-<tag>.session.log`:
- `session-1794455647.log` for r4c-residency
- `session-1794455718.log` for r4c-pan-anchor
- `session-1794455968.log` for r4c-source-watch-idle
- `session-1794456019.log` for r4c-source-changed-post
- `session-1794456079.log` for r4c-source-changed-reopen

**Audit logs.** I set `SPATIAL_IDE_AUDIT_LOG=<S>/1c-r4c-<tag>.audit.jsonl`, with the tag written as r4c-<name>. Following the brief's shape literally gives file names like `1c-r4c-r4c-residency.audit.jsonl`. None of these files exists afterward, so the app or driver wrote no audit log there.

**Processes and ports**
- Ports 9223 and 5400 have no listener, only TIME_WAIT entries. The app-down script reported both free after each run.
- Every process I started was stopped by the harness's app-down, which killed trees by their own PIDs (listed above). I killed nothing else.
- The source-changed repoint helper (PID 13784 in the post run) exited by itself with code 0.
- *[One bullet elided by the custodian: it listed processes on the machine that the tester did not start.]*
- The worktree porcelain is empty and HEAD is unchanged.

**Harness disclosure.** This is the port-5400 harness under item 1 of the approval of 2026-10-11. Port 5180 was not touched or freed.
- The harness wrote `<H>/out/` (logs, busy and down files, `b2c-e2e-loads.txt`, and the copied reports) and `<S>/1c-r4c-*` (fixtures before and after, and the session logs).
- The drivers wrote `C:/dev/wt/b2c/frontends/shell/e2e/out/` (reports, scratch parquets, the junction, the targets folders and the tauri overlay config).
- The app wrote its per-user logs.
- Nothing was written in the main checkout or in other worktrees, and no tracked file was changed.

**Hold lines** (my own project's only, `also=` elided)
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:69916`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:69916 affinity=FF (cores 0-7)`
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:33064`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:33064 affinity=FF (cores 0-7)`
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:1528`, then `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:1528 affinity=FF (cores 0-7)`
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:65748 affinity=FF`: I did not capture the hold line for this run. Only its `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:65748 affinity=FF (cores 0-7)` is in the output, which I read as tail only.
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:51932 …`: the same applies. Only `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:51932 affinity=FF (cores 0-7)` was captured.

**Background shells left:** none. The five run shells completed. Three wait loops were moved to the background by the harness and each completed.

**Model:** Sonnet 5.5, ID claude-sonnet-5-5, as the harness reports it. No override and no context handoff.

**Paths**
- Run logs and app logs: `<S>/b2c-e2e-h/out/b2c-e2e-r4c-*`
- Fixture hashes before and after: `…/scratchpad/1c-r4c-fixtures-before.txt` and `…/scratchpad/1c-r4c-fixtures-after.txt`
- Session logs: `…/scratchpad/1c-r4c-r4c-*.session.log`
