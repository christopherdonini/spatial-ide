*Custodian's filing note (2026-10-24): the tester's follow-up runs on milestone 4 PR C at ec95eacb, on the port-5400 harness: e2e:table three times, PC-E4's mutation once, pan-anchor twice at the head and twice at the base frontend a533a598. It discloses its hold calls ran through small wrapper scripts, in the hold's order. The run 17:50:42Z to 18:09:10Z by its transcript (Read 1, Bash 17). Extracted by script from its SubagentHandback call, with one final newline added; the session scratch folder's path, 1 place(s), written as <the session scratch folder>; nothing else is changed. Its sha256, from line 5 to the end, is 21358f89d3e01b338062ab9d5bad3b372cc9608e774b708b19d334a0dcc8a883.*

---

Follow-up e2e: b1-shell-half PR C at ec95eacb69766759ec454f2f5aae9688b49458b1, tester, port-5400 harness

Model I observe: Sonnet 5.5 (claude-sonnet-5-5). No override. No context handoff. Usage figures: none to hand.

Result: all nine runs came out as the brief predicted. No stop condition.

**Setup**
- Worktree is on branch `cut/b1-shell-half-pr-c`, HEAD ec95eacb69766759ec454f2f5aae9688b49458b1, porcelain empty at the start.
- Exe `D:/wt-targets/m4a/exes/spatial-ide-shell-m4c-hs.exe` sha256 a6c1c608b7bad5ac15e07f95b85dc5325934c08ee9c5dfcad50d4dfd42b44282, shown before the first run. Nothing was rebuilt.
- The harness is a renamed copy of the previous series' scripts (`m4c-t3-*`). Only the names changed.
- Load is three CPU LoadPercentage samples, one second apart, read just before each run, inside the hold.
- The busy check printed FREE at every launch.

**Runs** (start and end UTC, 2026-10-24; load = the three samples at launch)

| Run | Commit | rc | Steps | Failing lines | Start | End | Load |
|---|---|---|---|---|---|---|---|
| `e2e:table` 1, oracle `[402, 392, 389, 421]` | ec95eacb | 0 | PC-E1 to PC-E4 all PASS | none | 17:51:38 | 17:52:29 | 1,0,4 |
| `e2e:table` 2 | ec95eacb | 0 | 4 of 4 PASS | none | 17:52:53 | 17:53:43 | 6,4,0 |
| `e2e:table` 3 | ec95eacb | 0 | 4 of 4 PASS | none | 17:54:01 | 17:54:52 | 1,8,8 |
| `e2e:table` with PC-E4's edit alone | ec95eacb plus edit | 1 | 3 PASS, 1 FAIL | `[PC-E4] FAIL (18831ms): PC-E4: no class-A cancel row carrying sh_9fda24acd874c5544d63b13307974a7b appeared after Cancel (0 such rows)` | 17:55:11 | 17:56:08 | 2,0,5 |
| `pan-anchor` head 1 | ec95eacb | 0 | 16 of 16 | none | 17:56:28 | 17:59:09 | 8,2,3 |
| `pan-anchor` head 2 | ec95eacb | 0 | 16 of 16 | none | 17:59:38 | 18:02:19 | 6,5,0 |
| `pan-anchor` base 1 | a533a598e4e139e2fbd2793ded328472cc977036 (detached) | 0 | 16 of 16 | none | 18:02:44 | 18:05:28 | 4,4,2 |
| `pan-anchor` base 2 | a533a598 (detached) | 0 | 16 of 16 | none | 18:05:50 | 18:08:38 | 3,4,3 |

- The brief says the `e2e:table` runs must pass every step, PC-E4 included. All three did.
- The PC-E4 mutation run failed at assertion 3, as the brief required. PC-E1 to PC-E3 passed in it. The `[table]` summary reads `3 PASS, 1 FAIL`.
- The PC-E4 edit was `sed -i '171d'` on `frontends/shell/src/table/tableSource.ts`. It deleted the `if (handle !== null) void this.cancelHandle(handle);` line in `cancel()`. The identical line in `end()` (line 185) was untouched. The diff was one deletion.
- I reverted it with `git checkout -- frontends/shell/src/table/tableSource.ts` (rc 0). `git status --porcelain` printed nothing.
- After the base runs I ran `git checkout cut/b1-shell-half-pr-c`. HEAD printed ec95eacb69766759ec454f2f5aae9688b49458b1 and the porcelain was empty.
- The pan-anchor failures from the earlier series (14 and 15 of 16) did not reproduce at the head under the low load these runs had (0 to 8). That earlier report's failures came at load 16/31/23 and 84/72/77. This run does not show whether load caused them. Load never exceeded 8 here, so the earlier conditions were not repeated.

**Fixtures:** 34 files under `target/fixtures/manual-walkthrough`. I took sha256 of every file before the first run and after the last, and `diff` of the two lists returned 0 (identical). I regenerated none. The runs themselves also printed "fixtures hash-identical before and after" for filter-zoned, 100k-happy-path and slow-filter-scan.

**Processes check:** the busy check printed FREE after the last run. Ports 9223, 5400, 5180 and 1420 are not listening, and no vite, tauri dev or shell exe process runs. Each run's app-down step killed only the PIDs its app-up step had recorded, and the pids file is gone. I killed nothing else.

**Holds (SpatialIDE only):** 8 shared holds granted and 8 `MACHINE_RELEASED project=SpatialIDE` lines, one per run. No exit code 96 to 99. No exclusive hold.

**Files:**
- Scratch folder: `<the session scratch folder>/m4c-t3-h/`. Everything is in its `out/` folder.
- Per run, files are named `m4c-t3-<tag>.*`:
  - `.log`, `.rc.txt`, `.busy.txt`, `.down.txt`
  - `.app.err.log`, `.app.out.log`, `.vite.err.log`
  - `.session.log`
  - `.rep.<name>`: each run's report copy, which was `tauri.e2e.conf.json`, the only file the suite wrote to `e2e/out` during these runs.
- Tags: `table1`, `table2`, `table3`, `mutE4`, `pan-h1`, `pan-h2`, `pan-b1`, `pan-b2`.
- Also: `m4c-t3-wrap-<tag>.txt`, `m4c-t3-loads.txt`, `m4c-t3-fix-before.txt` and `m4c-t3-fix-after.txt`.
- Nothing was overwritten.
- I made no commit, push or PR action. I wrote no report file.

**One deviation:** my hold calls assigned the script path to a shell variable first, and ran the command through a small wrapper script (`m4c-t3-table.sh`, `m4c-t3-go.sh`) so that the oracle env var and the load reading were set inside the hold. The brief's shape has the script path and the command written out in the one line. The `cd`, hold, command, release and `exit` order was kept, and I did not print `exit $rc`. The `rc` I report is the one from the suite's own `.rc.txt`, which matches.

**The four failure classes, as they apply to this harness:**
- Interface: the harness drives the real debug exe, the real Vite on 5400 and the real CDP page.
- Result claims: each claim points to a log in `out/`.
- Operator-facing lines: no results file was written, and every line above is from this commit.
- Assertions: every run reached its assertions. The pan-anchor runs reached 16 of 16, and the table runs reached PC-E4.
