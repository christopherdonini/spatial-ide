*Custodian's filing note (2026-11-14): the worker's report for the filler slot's `pan-anchor-setcam-waits-for-its-own-reset`: P0 again at B′ under new tags (the advisor's ruling ADV-2026-11-14-07 item 4 (b), `state/directives/2026-11-14-advisor-ruling-adv-2026-11-14-07-no-further-booking-pr-b-run-alone-owed-on-a-quiet-machine-nothing-else-waits-for-it-p0-now-three-refusals-recorded.md`), then commits 2 and 3 and the runs of Amendment 5 item 4, from its brief by file (15984 bytes, sha256 3a746ac7374b144d407feeac33e816f8f38aa39bafd21200cddd7883058087c4). Dispatched at 2026-11-14T04:44:18Z by its transcript; handed back at 2026-11-14T05:52:38Z (claude-sonnet-5-5, worker; calls Bash 63, Read 7, Edit 6, Write 3 and the hand-back, 80 in all; one errored: an Edit before a Read at 2026-11-14T04:54:48Z, redone). Its Write and Edit calls are scratch files and, in its worktree, `frontends/shell/e2e/pan-anchor.mjs` and, for M-TRACE alone and reverted, `frontends/shell/src/canvas/WorkingCanvas.tsx`. Its push was a call of its own, at 2026-11-14T05:51:40Z. At this filing the custodian read the remote branch at 08bed11cd25066976a116cc6e2dbfb9aa8d647ac, equal to the worktree's head, with its porcelain empty. The report below was extracted by script from the hand-back in that transcript (9887 bytes, sha256 0bbc1c6a2d1e8ebe09e8dce2b3004eea110108065924ff0e0cdc5326cdeb5e8a); nothing is changed. The form's Amendment 7 records the runs.*

---

Built: pan-anchor-setcam-waits-for-its-own-reset at 08bed11cd25066976a116cc6e2dbfb9aa8d647ac (pushed; origin's branch equals HEAD; porcelain empty; no PR, no CI wait)

All predictions held. No STOP. P0 ran once and reached its checks; no retry anywhere.

**Start state.** Form sha256 a9097865a23d0e45a3314517f4424e28674a1fa8dd6226c34bbb270b50634566 at 54ee3522. B′ = 695e1303794ed390d305d07fca592694f33f589e. Worktree C:/dev/wt/pa at 1427596d5c9edae8b9248b13d8b3525b4c43c55c (parents 624b2e68, 695e1303), ls-remote empty, porcelain empty. Disk C: 45G, D: 168G. Every tauri.conf `resources` path exists: dist/NOTICE.txt 163998, dist/app.js 333011, dist/index.html 6463, viewer-asset-hashes.json 261, src/generated/NOTICE.txt 3427745. Exe D:/wt-targets/pa/exes/spatial-ide-shell-pa.exe is 91529728 bytes, mtime 2026-11-14 01:39.

**Harness** (`<H>` = `<S>/pa-e2e-h`; all 9 files read whole, none changed; size and sha256 matched the brief):
- pa-e2e-run-suite.sh 1556, 1f79a7d3...ae609 (all runs used it)
- app-down.ps1 880, 63bc2377...
- app-up-wait.ps1 208, b92fcaec...
- app-up.ps1 1822, d92e43f6...
- build-exe.sh 616, c84fb6a6...
- busy.ps1 983, 13486694...
- tauri.conf.json 293, 0dc02596...
- shim/npx.cmd 220, 00d937b8...
- shim-wait/npx.cmd 301, b3a554f2...

pa-p0.patch is 901 bytes, sha256 250581c780d209a2321545a788f954fd43d33a5fd4022d44bf6fbfdb64f51f39. Fixture is 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49, identical before and after every run; never regenerated.

**Status readings before each run** (quiet / average / peaks-over-25 / others): every one was quiet=False and others non-empty (names not copied).

| Run | Average | Peaks |
|---|---|---|
| p0 | 77.2% | 60 |
| mtrace | 55.9% | 60 |
| p1 | 46.2% | 60 |
| r1 | 37.1% | 59 |
| l1 | 59.4% | 60 |

**Runs.** Timeouts: 1500 s except mtrace at 600 s. Every busy check printed FREE, no run exited 90, and the audit log was absent before each run and never written (`--measure` never passed).
- **a6-p0** (B′ bytes plus pa-p0.patch; `git diff HEAD` shown as commit 1's removal plus the wrapper): started 04:48:22Z, ended 04:51:49Z. Exit 1; both `pixel-spaces-coincide` checks PASS and the other 14 FAIL by name; `==== 2/16 PASS ====`, `rc=1`. First line: `worktree C:/dev/wt/pa head 1427596d5c9edae8b9248b13d8b3525b4c43c55c start 2026-11-14T04:48:22Z`. App-down: killed tree 69480, killed tree 54640, port 9223 free, port 5400 free. Reverted with `git checkout HEAD -- frontends/shell/e2e/pan-anchor.mjs`; porcelain empty.
- **a6-mtrace** at 39d724fc: `grep -c` of the call = 1, at WorkingCanvas.tsx:2369, given `zoom + 1e-6` (diff shown). Started 04:56:37Z, ended 05:06:37Z. Lines: `PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000`; then 19 progress lines, 30 s to 570 s, the last being `setCam: still waiting for the view-state line with zoom -0.99999: 570 s after the 500 ms minimum, 1 other lines arrived`; last line `rc=124 end 2026-11-14T05:06:37Z`. No further check line. Reverted with `git checkout --`; porcelain empty.
- **a6-p1** (head 08bed11c plus wrapper, `git apply pa-p0.patch`; patch check passed): 05:09:11Z to 05:14:16Z. Exit 0, `==== 16/16 PASS ====`, no `fatal` line. Two progress lines as observed: `...zoom -6.99993: 30 s after the 500 ms minimum, 1 other lines arrived` (small, recenter-crossing dx=-1200) and `...zoom -6.99986: 30 s...` (large dx=-1200). Reverted; porcelain empty.
- **a6-r1**: 05:16:01Z to 05:21:33Z. Exit 0, `==== 16/16 PASS ====`, no progress lines.
- **a6-l1**: stamps below. `<S>/pa7-l1-run.sh` follows the run-build report's shape. Exit 0, `==== 16/16 PASS ====`, no fatal line, run 05:23:33Z to 05:29:47Z. First Compiling line: `   Compiling proc-macro2 v1.0.107`. The build was alive at the suite's start (windows pid 60168, rows 1, cargo and rustc listed) and at its end (rows 1, cargo listed, rustc none). Last Compiling line: spatial-data-plane. Its `taskkill //T //F //PID 60168` terminated the tree, but pid 48884 returned "could not be terminated ... operation not supported", so the script's rc was 255. After the kill: pid 60168 rows 0, `msys pid 64459 gone`, `load target absent`.
  - Stamps file (281 bytes, sha256 18c22674c9a70783ec7e4f98552cbcd50ad0b4281871f7b239ce4f1adeb5571e):
```
script-start 2026-11-14T05:23:17Z
build-start 2026-11-14T05:23:17Z
build msys pid 64459, windows pid 60168
compiling-line-seen 2026-11-14T05:23:19Z
suite-start 2026-11-14T05:23:22Z
suite-end 2026-11-14T05:30:06Z
build-checked-after 2026-11-14T05:30:08Z
killed 2026-11-14T05:30:09Z
target-removed 2026-11-14T05:30:19Z
```
  - Departure from the prediction text: the script's "processes naming the load target" count printed 1. I read that as the counting powershell matching its own command line (my reading, not an observation). A separate query with a self-excluding pattern, `pa-lo[a]d`, found 0 processes, and D:/wt-targets has no pa-load. Two cargo.exe (17568, 24820) remain; both were already listed in the start-of-suite listing and are not mine.

For every run, `<H>/out/pa-e2e-<tag>.log` holds the first line, check lines, progress lines and last two lines; `.down.txt`, `.busy.txt` and `.app.err.log` sit beside it. app.err.log is 2 lines every time (session-log path, then `data-plane expected origin (config mirror): http://localhost:5180`), so the first and last 20 lines are those two. The run-suite printed "port 9223 still listening, owner pid 65696" once, in l1's app-down, with 5400 free. The port was free afterwards, same as the first worker's note. Session logs are copied to `<S>/pa-a6-{p0,mtrace,p1,r1,l1}.session.log`. The audit log was written by none.

**Commit 2 = 39d724fc67958dd199ccb2ac140334e6c298bc66** (+12/-9): deleted line 93 (`SETCAM_BOUND_MS`) and lines 109-110. setCam now reads the seam's resolved value and throws `setCam: the seam resolved <value>, not true, for zoom <zoom>` unless it is `true`. It waits with `for (let turn = 1; !own(); turn++) { await sleep(1000); if (!own() && turn % 30 === 0) console.log(...) }`, and returns `own()`. The progress line is `setCam: still waiting for the view-state line with zoom <z>: <turn> s after the 500 ms minimum, <n> other lines arrived`, with no PASS, FAIL or `====`. The comment (old lines 102-106) is rewritten to cover the five points plus the progress line. `node --check` rc 0. Subject: `fix: pan-anchor-setcam-waits-for-its-own-reset, setCam waits for its own view-state line with no wall-clock bound and throws when the seam does not resolve true`.

**Commit 3 = 08bed11cd25066976a116cc6e2dbfb9aa8d647ac** (+4): the header's RECORDED MUTATION entry for M-TRACE (mutation, Expected, Observed naming 39d724fc67958dd199ccb2ac140334e6c298bc66). Subject: `docs: pan-anchor-setcam-waits-for-its-own-reset, M-TRACE recorded as observed at 39d724fc`.

**Readiness at 08bed11c.**
- `npm run verify` in frontends/shell, in a shared hold: rc 0; its log shows tests 5/5 and 7/7 pass.
- `node --test` over plan, hooks and evidence: 598 tests, 598 pass, 0 fail.
- verify-cites PASS, verify-quotes PASS (shared hold), verify-test-claims PASS, `verify.mjs --offline` PASS.

**Numstat** (`git diff --numstat 695e1303... HEAD -- frontends/shell/e2e/pan-anchor.mjs`): `20 6`. Total 26, against the budget of 40 and the estimate of 20 to 28. `--name-only` over the range lists pan-anchor.mjs only. No overrun.

**Harness disclosure.** The port-5400 harness under item 1 of the 2026-10-11 approval: debug exe with a TAURI_CONFIG overlay (CDP 9223, localhost:5180 mapped to 127.0.0.1:5400), Vite on 5400 with `--strictPort`, and the npx shim on PATH for the run only. Writes: `<H>/out/`, `<H>` log and pid files, `<S>` scratch files named `pa7-*` and `pa-a6-*`, `D:/wt-targets/pa` (unchanged by me), `D:/wt-targets/pa-load` (created and removed), the worktree's gitignored output, and the app's per-user session folders. WorkingCanvas.tsx was edited and reverted for M-TRACE only.

**Hold lines** (`also=` field contains `<m>` names, not copied): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF` for p0 (shell bash.exe:28968), mtrace (58308), p1 (21840), r1 (32044), l1 (53364), verify (the hold line was not read: output went to its own log) and verify-quotes (78236). Each was released with `MACHINE_RELEASED`. No refusal, no 96-99.

**Push.** The call held only `git -C C:/dev/wt/pa push -u origin cut/pan-anchor-setcam-waits-for-its-own-reset`. `ls-remote` shows 08bed11c... equal to HEAD.

**Background shells left:** none. All my background shells completed. The L1 build was killed by its own windows PID 60168 and no process naming it remains.

**Departures from the brief** (mine to disclose):
1. I first wrote an edit script `pa7-edit.mjs` with a heredoc, then removed it unused and made the edit with the Edit tool.
2. I used `git add` of pan-anchor.mjs by name; git `-s` added the Signed-off-by from config (the message files hold none, and the one `@` is in the first trailer line).
3. Foreground wait loops hit the tool's 170 s limit and were moved to the background by the harness. All were bounded and contained no foreground `sleep`.

**Pre-gate self-check.** (1) Cross-module: no product code touched; the seam's real shape (`e2eSetViewState` returning `true`, logging one `[render-trace] view-state` line) was exercised end to end by R1 and L1. (2) Completion claims: each points to a log in `<H>/out` or to a command shown above. (3) User-facing messages: the progress line and the throw are what the code at 39d724fc prints (the progress line was seen in mtrace and p1). (4) Required tests: R1 and L1 reached 16/16 PASS and M-TRACE reached its assertion. The setCam throw (seam value not `true`) is untested by any run; the form does not call for it.

**Model:** claude-sonnet-5-5 (Sonnet 5.5) as the harness reports it; no override; no context handoff received or produced.
