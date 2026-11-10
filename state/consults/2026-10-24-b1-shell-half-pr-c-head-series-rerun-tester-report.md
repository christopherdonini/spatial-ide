*Custodian's filing note (2026-10-24): the tester's re-run of milestone 4 PR C's e2e series at its head bc315fb9 (draft PR #253), on the port-5400 harness, the machine's load read before each suite. The run 16:01:38Z to 17:20:21Z by its transcript (Read 1, Bash 87; writes only to its own scratch files; the four PC-E edits made in the worktree by sed and reverted with git checkout, the porcelain empty after each; no commit, push or PR action). Extracted by script from its SubagentHandback call, with one final newline added; the session scratch folder's path, 1 place(s), written as <the session scratch folder>; nothing else is changed. The custodian's reading: PC-E4's failure is a defect in PR C's own new suite (`e2e/table.mjs` step 3 reads the cancel row's outcome before it leaves pending), so not I3, which names existing suites; pan-anchor's two failures (the base passed it 16 of 16) are not yet explained. Its sha256, from line 5 to the end, is 0917bd226e4af1c3815499ae21bf4be6d498056bf7a8009ed8323d1de9b8e34c.*

---

Head e2e (re-run): b1-shell-half PR C at bc315fb9d163dc292501618836bc25353c467bd8, tester, port-5400 harness

Result: STOP. The unmutated `e2e:table` fails at PC-E4 assertion 3 intermittently, including at low load. It passed once and failed once alone on the machine at load 3,5,7. Per step 7 that is I3, so I stopped. The cause is a read race in the suite, shown by the code and the reading below. Everything else is listed per suite below, and the later parts of the series ran in full.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No override. No context handoff.

**Findings you act on**
1. **`e2e:table` PC-E4 is racy, and load does not explain it.** Step 3 (`table.mjs:350-356`) polls only until a class-A `cancel` row carrying the handle exists. It then asserts `outcome === "ok"` on that same sampled row. Failing runs read `"pending"`.
   - Unmutated, load 25,26,37: PASS (rc 0), PC-E4 took 18282 ms.
   - Unmutated again alone, load 3,5,7 (`table2`): PC-E4 FAIL, `the cancel row's outcome is "pending", expected ok`, 8616 ms. PC-E1 to PC-E3 passed.
   - The PC-E2 edit run (load 96,100,100) and the PC-E3 edit run (load 10,8,11) failed PC-E4 the same way. Neither edit touches `cancel`. So PC-E4 failed 3 of the 4 times it reached step 3 without its own edit.
   - My reading, not a proof: the poll predicate counts rows and never waits for the row to leave `pending`. The fix would be for the poll to wait on the outcome.
   - I did not edit `table.mjs`.
2. **Timing-sensitive failures, each passing on its one re-run, so not recorded as failures:**
   - `e2e:layout` FILL at load 100,100,100: `.residency-status is null after the notch ... invalidator I3, STOP and report`. The re-run at load 84,100,100 passed.
   - `e2e:selection` E-ASK-TWO at load 100,100,100: `execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt`. The re-run at load 5,5,2 passed 18 of 18.
3. **`pan-anchor.mjs`: fails twice, load not low on the re-run. I report it as timing-sensitive under load and did not stop on it.**
   - First run, load 16,31,23 at launch: `recenter-crossing-A dx=-1200` failed for small and large, `grab-point residual 1100.01 buffer px (tol 4)`, 14 of 16.
   - Re-run alone, load 84,72,77: the same step failed for small only, 15 of 16.
   - The base series passed 16 of 16.
   - The first run's launch reading was low, so the load reading does not clearly explain it. I did not run a third time.
4. **`e2e:refusal-contract-baseline` (the suite that stopped the first head series) passed rc 0 on its first run, with the machine loaded at 76,80,88.** I3 did not appear in it.
5. **Harness note, a harness error of mine and not a product failure.** `e2e:recording` failed twice with the default npx shim: `no readable history.jsonl ... a live lock would read as this`.
   - Cause: the suite's `stop()` kills the npx process tree, but the default shim starts the app outside that tree. The app kept the history lock for the whole 30 s poll.
   - With the waiting shim (`SHIMDIR=m4c-hs2-shim-wait`) it passed, rc 0.
   - Both shims are in the approved harness. The line for `recording-w` is the recorded result.

**Harness as run**
- Scripts: copies of the earlier head series' scripts, renamed `m4c-hs2-*`, in the folder `<the session scratch folder>/m4c-hs2-h/` (`...-run-suite.sh`, `-app-up.ps1`, `-app-up-wait.ps1`, `-app-down.ps1`, `-busy.ps1`, `-tauri.conf.json`, `-shim/`, `-shim-wait/`). I added `m4c-hs2-load.sh`, `m4c-hs2-go.sh` and `m4c-hs2-wait.sh`.
- Overlay: WebView2 args `--remote-debugging-port=9223 --host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`.
- Vite: `--host 127.0.0.1 --port 5400 --strictPort`, with the npx shim on PATH for the runs only.
- Exe: no rebuild. `D:/wt-targets/m4a/exes/spatial-ide-shell-m4c-hs.exe`, sha256 a6c1c608b7bad5ac15e07f95b85dc5325934c08ee9c5dfcad50d4dfd42b44282. It is identical to `D:/wt-targets/m4a/debug/spatial-ide-shell.exe`, and I checked it before the first run.
- Worktree: HEAD bc315fb9d163dc292501618836bc25353c467bd8, `git status --porcelain` empty at the start.
- `npm ci` in `frontends/shell` and in `renderer/bundle-viewer` both returned rc 0, then `npm run build` in `bundle-viewer`, rc 0. No tracked file changed.
- Load reading: three samples of the CPU's LoadPercentage, one second apart, taken at suite launch inside the hold, before the app starts. Each line lists them in order. The brief's busy check (`m4c-hs2-busy.ps1`) ran at every launch and printed FREE each time. The regression reading was taken by hand 18 s before launch.

**Fixtures** (34 files under `target/fixtures/manual-walkthrough`, sha256 of each file recorded before and after): identical, checked with `diff`. None regenerated. The 5 GB fixture was not used.

**Oracle** (the generator was not re-run, as you directed): the shared `filter-zoned.parquet` is still sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46. `SPATIAL_E2E_FILTER_ZONE_COUNTS="[402, 392, 389, 421]"` went to every table run. PC-E1 reports `all 402 features ... oracle [402, 392, 389, 421]`.

**Suites** (start and end UTC, 2026-10-24; load at launch; fixtures unchanged in every run; the stopped line appears in none of the runs)

| Suite | rc | Start | End | Load at launch |
|---|---|---|---|---|
| regression | 0 | 16:05:03 | 16:10:23 | 14,12,6 |
| refusal-contract-baseline | 0 | 16:14:54 | 16:16:00 | 76,80,88 |
| admission | 0 | 16:16:30 | 16:17:08 | 83,88,85 |
| filter | 0 | 16:17:33 | 16:17:45 | 6,7,3 |
| filter-panel | 0 | 16:18:16 | 16:18:49 | 1,7,2 |
| style | 0 | 16:19:19 | 16:19:28 | 1,1,2 |
| publish | 0 | 16:19:52 | 16:20:07 | 0,8,1 |
| console | 0 | 16:20:35 | 16:28:12 | 0,14,2 |
| layout (first) | 1 | 16:29:09 | 16:31:58 | 100,100,100 |
| layout (re-run) | 0 | 16:32:48 | 16:35:42 | 84,100,100 |
| selection (first) | 1 | 16:36:24 | 16:40:57 | 100,100,100 |
| selection (re-run) | 0 | 16:41:19 | 16:45:15 | 5,5,2 |
| export-view | 0 | 16:45:44 | 16:46:06 | 6,6,8 |
| recording (default shim, 1st) | 1 | 16:46:42 | 16:47:25 | 4,6,58 |
| recording (default shim, 2nd) | 1 | 16:47:56 | 16:48:33 | 9,6,11 |
| recording (waiting shim) | 0 | 16:49:17 | 16:49:23 | 0,1,8 |
| command-bar | 0 | 16:49:51 | 16:51:19 | 5,8,7 |
| attributes | 0 | 16:51:46 | 16:54:10 | 61,28,38 |
| table (unmutated) | 0 | 16:54:48 | 16:56:03 | 25,26,37 |
| residency-harness (exit code only, no figure recorded) | 0 | 16:56:41 | 16:57:01 | 35,48,37 |
| pan-anchor (1st) | 1 | 16:57:34 | 17:01:17 | 16,31,23 |
| pan-anchor (re-run) | 1 | 17:01:59 | 17:05:39 | 84,72,77 |
| source-watch-idle | 0 | 17:06:17 | 17:06:46 | 5,10,68 |
| source-changed, default route | 0 | 17:07:22 | 17:08:08 | 46,39,94 |
| source-changed, post route | 3 | 17:08:49 | 17:09:38 | 93,100,100 |
| table (unmutated, extra run, after the edits) | 1 | 17:18:13 | 17:19:02 | 3,5,7 |

- `e2e:console` ran `e2e:regression` and `e2e:admission` inside itself, and both exited 0.
- The post route returned rc 3 with S5d INCONCLUSIVE and every other step passing. That matches the base series' record, so it is not a stop.

**PC-E1 to PC-E4**
Each edit was made by `sed` on the exact line, applied alone, with `e2e:table` in its own hold. The exe was not rebuilt, because Vite serves the edited source. Each was reverted with `git checkout -- <file>`, and the porcelain was empty after each revert.

- **PC-E1** (`tableSource.ts:131`, `filter` becomes `null`), load 100,100,100. Failed at the named step:
  `[PC-E1] FAIL: the line is "[P6 placeholder] Showing the first 1000 features returned, in no declared order; more may pass the filter."; the oracle count is 402`.
  PC-E4 also failed in that run because no filter was sent: `the liveness line and Cancel did not show`. PC-E2 and PC-E3 passed.
- **PC-E2** (`tableScope.ts:47` becomes `if (true) listed.push(id);`), load 96,100,100. Failed at the named step:
  `[PC-E2] FAIL: after id <> 423 hides one, the second scope lists ["288","382","423"]; the two that pass are ["288","382"]`.
  PC-E4 also failed (finding 1).
- **PC-E3** (`tableSource.ts:63`, `n < TABLE_MAX_ROWS` becomes `true`), load 10,8,11. Failed at the named step:
  `[PC-E3] FAIL: the line at the limit is "[P6 placeholder] Showing all 1000 features."`.
  PC-E4 also failed (finding 1).
- **PC-E4** (`tableSource.ts:171`, the `cancel` line deleted; the `end` copy at line 185 untouched), load 27,8,10. Failed at assertion 3:
  `[PC-E4] FAIL: no class-A cancel row carrying sh_66e2b975a556432a0492913c41c8ee14 appeared after Cancel (0 such rows)`.
  PC-E1 to PC-E3 passed.

All four edits fail at their named steps. The finding 1 race can fail PC-E4 at the later outcome check in a run where the cancel row does appear. That makes the PC-E4 mutation a weaker discriminator than it reads, because the named failure and the race failure can both occur.

**Copied files** (all under the `m4c-hs2-h` folder's `out/`, names `m4c-hs2-<tag>.*`; tags as in the table, plus `mutE1` to `mutE4` and `table2`):
- Per run: `.log`, `.rc.txt`, `.busy.txt`, `.down.txt`, `.app.err.log`, `.app.out.log`, `.vite.err.log`, `.session.log`, and `.rep.<report name>` for each report.
- Also: `m4c-hs2-wrap-<tag>.txt`, `m4c-hs2-hold-<tag>.txt`, `m4c-hs2-loads.txt`, `m4c-hs2-fix-before.txt`, `m4c-hs2-fix-after.txt`, `m4c-hs2-npmci-shell.log`, `m4c-hs2-npmci-bv.log` and `m4c-hs2-bvbuild.log`.
- Nothing was overwritten.

**Processes and state at the end**
- The busy check prints FREE: ports 9223, 5400, 5180 and 1420 are not listening, and no vite, tauri dev or shell exe process runs.
- Each run's app and Vite were stopped by the PIDs the app-up script recorded; I killed nothing else.
- `git status --porcelain` is empty and HEAD is bc315fb9d163dc292501618836bc25353c467bd8.
- Suite side effects, all in ignored or temp locations:
  - `target/e2e-publish-out` in the worktree (publish suite).
  - `e2e/out` files in the worktree.
  - `spatial-recording-*` scratch stores in the temp folder (the recording suite keeps them on failure and by design; three came from my runs).

**Holds** (SpatialIDE only): 30 shared holds were granted and 30 `MACHINE_RELEASED project=SpatialIDE` lines were written. One hold covers each of the 25 suite runs above, the 4 edit runs and the extra table run. No exit code 96 to 99 came back, and there was no exclusive hold.

**The four failure classes, as they apply to this harness**
- Interface: the harness uses the real debug exe, the real Vite and the real CDP page. Each suite drives the shipped UI.
- Result claims: each claim points to a log in the `out/` folder named above.
- Operator-facing lines: no results file was written, and every line above is from this commit.
- Assertions: every suite reached its assertions, except that the recording default-shim runs reached RECORD and failed there for the harness reason in finding 5.

Usage figures: none to hand.
