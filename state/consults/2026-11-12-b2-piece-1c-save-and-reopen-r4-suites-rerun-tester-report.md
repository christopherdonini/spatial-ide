*Custodian's filing note (2026-11-12): the re-run of two e2e suites of slot 1's b2-piece-1c-save-and-reopen, step 1, at R4's head, recording with the waiting shim and table with its oracle value, the two settings the custodian's R4 brief left out; from its hand-back (7839 bytes, sha256 bdd4f71d453f191fdf3867b2dfc2b049b34750b088cfe8c93ef1c0adf6d895fb), below the rule. **Two spans are changed:** the session folder's scratch path, in the two session-log lines, is written `<S>/`. Nothing else is changed, and one final newline is added. Its brief by file (9841 bytes, sha256 3547bf441908cfe4679a6fdaff8ab22df1fc3f7e353649fa1c16eb25101dedf3); the run 03:45:09Z to 03:51:58Z by its transcript, 14 calls (Bash 12, Read 1, the hand-back), none errored, 2 shared holds, model claude-sonnet-5-5. The custodian read each run's log and the harness's busy check after it. A report, a reading and not Authority.*

---

Suites: PR #307 at 708a3d5c38d57c772c66b82e16a4b501e6aca563, recording and table again, tester, port-5400 harness
Result: both pass

**Model:** claude-sonnet-5-5 (Sonnet 5.5), as the harness reports it. No override. No context handoff.

**Start state (by command)**
- The worktree `C:/dev/wt/b2c` HEAD was 708a3d5c38d57c772c66b82e16a4b501e6aca563 and the porcelain was empty. It was empty again at the end.
- D: had 191G free.
- `node_modules` is present in `frontends/shell` and in `renderer/bundle-viewer`.
- The brief's sha256 was 3547bf44...dedf3, as given.

**Harness files:** all ten matched the brief's sizes and sha256 exactly. They were `app-down.ps1`, `app-up-wait.ps1`, `app-up.ps1`, `build-exe.sh`, `busy.ps1`, `run-suite.sh`, `tauri.conf.json`, `load.sh`, `shim/npx.cmd` and `shim-wait/npx.cmd`. I read `run-suite.sh` and `load.sh` whole and changed no harness file.

**Exe:** `D:/wt-targets/b2c/exes/spatial-ide-shell-b2c.exe` is 91545088 bytes, sha256 ecfff91eb6ada287fa09f96a4d99b19e629643e711fc0c96b4796ea1c8bf59aa, as given. I did not rebuild it.

**Fixtures, before and after (identical both times)**
- `filter-zoned.parquet`: 409872 bytes, sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46, which matches the brief.
- `100k-happy-path.parquet`: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49.
- `slow-filter-scan.parquet`: 766186557 bytes, sha256 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5.
- I regenerated none and did not run the generator.

**Runs**

| tag | script | rc | start | end | load (%) |
|---|---|---|---|---|---|
| r4b-recording | e2e/recording.mjs, with `SHIMDIR=shim-wait` | 0 | 2026-11-12T03:47:18Z | 2026-11-12T03:47:28Z | `load r4b-recording 03:47:07Z 31,49,41` |
| r4b-table | e2e/table.mjs, with `SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]'` | 0 | 2026-11-12T03:49:58Z | 2026-11-12T03:50:57Z | `load r4b-table 03:49:48Z 43,24,55` |

I did not pass `--measure`. Both runs were in background mode, in their own shared holds, and neither was re-run.

**Recording log** (`b2c-e2e-r4b-recording.log`, 20 lines)
- First line: `worktree C:/dev/wt/b2c head 708a3d5c38d57c772c66b82e16a4b501e6aca563 start 2026-11-12T03:47:18Z`
- Step lines:
  - `[OPEN] PASS (75ms): admitted`
  - `[APPLY] PASS (701ms): applied, and one record_step row reached ok`
  - `[STYLE] PASS (365ms): opacity 0.37 and colour #112233 committed; three record_step rows reached ok`
  - `[RESET] PASS (232ms): Reset committed; five record_step rows reached ok`
  - `[RECORD] PASS (871ms): unsaved-8fd060e006e96054f57b6d579136d6ec: a header and five steps, in order and chained; the filter names the field zone; the recorded opacities 0.37 and 0.7058823529411765 equal the applied values bit for bit (H6)`
- The log's last two lines are the console-ledger line and `rc=0 end 2026-11-12T03:47:28Z`. The ledger line names `recording-console-ledger-1794455248375.json` in the worktree's `e2e/out` folder. The line before those is the RECORD summary line, which repeats the RECORD result above.

**Table log** (`b2c-e2e-r4b-table.log`, 14 lines)
- First line: `worktree C:/dev/wt/b2c head 708a3d5c38d57c772c66b82e16a4b501e6aca563 start 2026-11-12T03:49:58Z`
- Step lines:
  - `[PC-E1] PASS (8327ms): all 402 features under zone = 'residential', every row residential, 402 distinct ids (oracle [402, 392, 389, 421])`
  - `[PC-E2] PASS (22008ms): 3 selected (288, 382, 423); under id <> 423 the second scope lists 288, 382 ("[P6 placeholder] Showing 2 of 3 selected features that pass the filter; 1 could not be checked against it.") and the third still lists 3`
  - `[PC-E3] PASS (3361ms): the first scope reached the limit: "[P6 placeholder] Showing the first 1000 features returned, in no declared order; the file may hold more."; 1000 rows`
  - `[PC-E4] PASS (12674ms): the liveness line and Cancel showed; the table's stream sh_88a230b76a3d31e2b29da25856230923 was cancelled through the client (class-A cancel row ok); the table issued no other query in 3000ms. The engine releasing the stream is not shown by any operator surface`
- Last two lines: `[table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS` and `rc=0 end 2026-11-12T03:50:57Z`. The same `[table] 4 PASS, 0 FAIL` line also appears just above them.

**App stderr**
- Each run's `app.err.log` is 2 lines, so the first 20 and last 20 lines are the same two lines. They are the same shape in both runs.
- Line 1 is `[spatial-ide-shell] session log: <path in the app's per-user log folder>\session-<number>.log`. I elide the path because it contains the user profile.
- Line 2 is `[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180`. This is a config-mirror string the app prints. The port-5400 harness ran the suites, and nothing bound 5180.
- The session numbers were 1794455243 for recording and 1794455403 for table.

**Files copied**
- In `<H>/out/`, for each tag: `.log`, `.busy.txt`, `.down.txt`, `.app.err.log`, `.app.out.log` and `.vite.err.log`.
- Reports: `b2c-e2e-r4b-recording.rep.recording-console-ledger-1794455248375.json`, `b2c-e2e-r4b-recording.rep.tauri.e2e.conf.json` and `b2c-e2e-r4b-table.rep.tauri.e2e.conf.json`.
- Session logs copied right after each run, in the scratchpad folder:
  - `<S>/1c-r4b-recording.session.log` (1192 bytes)
  - `<S>/1c-r4b-table.session.log` (9104 bytes)
- The two `SPATIAL_IDE_AUDIT_LOG` files (`1c-r4b-recording.audit.jsonl` and `1c-r4b-table.audit.jsonl`) do not exist in the scratchpad folder. The runs set the variable, but I never opened the files, so I do not know why they were not written.

**Processes and ports**
- Each run's app-down step printed `killed tree` twice, then `port 9223 free` and `port 5400 free`.
- At the end, `b2c-e2e-busy.ps1` printed `FREE` with exit 0.
- `netstat` showed no listener on 9223 or 5400, only TIME_WAIT entries.
- I started no process of my own outside the suites, so none needed stopping by PID.

**Harness disclosure:** this is the port-5400 harness under item 1 of the 2026-10-11 approval. Port 5180 was not used and no exclusion or port was changed. Places written:
- `<H>/out/` and `<H>/b2c-e2e-app.{err,out}.log` and `<H>/b2c-e2e-vite.err.log`, which the harness writes itself.
- `C:/dev/wt/b2c/frontends/shell/e2e/out/`, where the suites write reports.
- The scratchpad folder, for the two session-log copies.
- The app's own per-user log folder, as any run of the app writes it.

I made no write to tracked files, no commit, no push and no rebuild.

**Hold lines (SpatialIDE only, `also=` elided)**
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:71164` was followed by `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:71164 affinity=FF (cores 0-7)`.
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:33732` was followed by `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:33732 affinity=FF (cores 0-7)`.

**Background shells left:** none. Both background calls (bom9suqmg and b2usb6tqi) exited with code 0.

**Four failure classes**
- **Interface:** the app was the real debug exe driven through the product's own e2e hooks on the port-5400 harness, with the waiting shim for recording.
- **Claims point to something that exists:** the logs and reports above are in `<H>/out/`.
- **Operator-facing lines describe this commit:** each log's first line shows HEAD 708a3d5c.
- **Assertions reached:** every step reached its assertion and gave PASS.

No timing-sensitive failures. Local load samples are in the table above. No usage figures at hand.
