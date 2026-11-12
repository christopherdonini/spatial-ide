*Custodian's filing note (2026-11-12): the worker's report for S3's run at the base, in slot 2's recentre-crossing-view-displaced-fix (E1's npm script line, the base measure build and E1 once; the S2 and S3 report filed E1 written and not run), from its hand-back (7142 bytes, sha256 da7068a32e088f9ae60a8c24aa03bab38c98e8e824089d9681575d0de1558ac8), below the rule with two changes at filing, each marked: the scratch folder's path is written `<S>`, and one process image name of no part of this project is elided in place; one final newline is added. Its brief by file (13669 bytes, sha256 6ff6f2e6335a4fb88328d7a8f7ec0ed024b4c32d197dfbf182af27bea9cb5bf0); the run 06:06:23Z to 06:40:15Z by its transcript, 45 calls (Read 3, Bash 37, Edit 2, Write 2, the hand-back), one errored (an Edit the harness refused because the file had not been read; a second Edit of the same file followed; the report does not name it), two shared holds, model claude-sonnet-5-5. Checked by script at this commit: the branch's tip is 8cbc250ba568cd29485663990f27c63451f2a67f (by git ls-remote), and its numstat from 9398efc6 names the three files at 317, 1 and 218 lines, each within its ceiling; the base exe (72487424 bytes), the two images, the app and session logs, the build log and E1's log each hash as the report says. A report, a reading and not Authority; its departures are for the piece's gates.*

---

Observed: recentre-crossing-view-displaced-fix S3, the run at the base, at 8cbc250ba568cd29485663990f27c63451f2a67f
E1 rc 1: precondition met; case 1 (a)(b)(c) FAIL, case 2 (i) FAIL, (ii) PASS, (iii) FAIL. Matches P-E1-base. No I2/I3.

**Where checks (all as given):** form sha256 bb654dfc...602e9 at main 9398efc6. Brief sha 6ff6f2e6...bf0 matched. Worktree HEAD dce9d6a2 and parents a74a9d5c 9398efc6 before the edit, branch cut/recentre-crossing-view-displaced-fix, porcelain empty. diff --name-only vs 9398efc6 = exactly WorkingCanvas.recentre.test.tsx + recentre-crossing.mjs. Lockfile diff vs a74a9d5c rc=0. deck "version": "9.3.9". C: 21G free, D: 231G free; D:/wt-targets/rcf-base did not exist. Fixture 29933646 bytes sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 (same after the run).

**Commit** 8cbc250ba568cd29485663990f27c63451f2a67f, "test: e2e:recentre-crossing, E1's npm script", parent dce9d6a2. Two files, 2 insertions, 1 deletion: package.json gets the one line after e2e:residency-harness (node -e JSON.parse rc=0); the header's "and no npm script names it." is replaced by "its npm script is `e2e:recentre-crossing`, run as `npm run e2e:recentre-crossing -- --measure-build <path>`." (diff shown in the transcript). Checks: node --check rc=0, profile-path-scan --staged clean rc=0, git diff --check 9398efc6 HEAD rc=0, verify-cites rc=0, verify-test-claims rc=0. Diff vs 9398efc6 names the 3 files (2 + the S2 test). Message file shown before commit; it has no sign-off or email.

**Build** (hold, CARGO_TARGET_DIR=D:/wt-targets/rcf-base): rc 0. Line 447: "Finished `release` profile [optimized] target(s) in 21m 22s"; the last line is "Built application at: D:\wt-targets\rcf-base\release\spatial-ide-shell.exe". Log rcf-s3b-build.log 15484 B sha 3112e93b...ff9af5. Exe 72487424 B, sha ac400813d03052bdd3596200070a33fee3e2bce15ad9cdcd5967ba88717ed323, mtime 2026-11-12 07:32:20 +0100. HEAD unchanged, porcelain empty.

**Before the run:** procs-before (rcf-s3b.procs-before.txt): only [one process image name elided at filing] processes of other tools; no spatial-ide-shell; listing taken at 06:32:54Z. port-before empty (grep found nothing on :9223). One first listing attempt failed on a PowerShell syntax error (it wrote an error file); re-done via a script file.

**Run** (hold, timeout 1800): stamps 2026-11-12T06:33:02Z to 2026-11-12T06:36:35Z. rc=1. Log rcf-s3b-e1.log 1910 B, sha 78efa0be16932decfbd18bd0653a639c739612a5204643d2c43f9dcb340b705b. Byte-copied lines:
--- case 1: z_fit -3.692532927362801, canvas 668x712 (buffer 668x712), L 300, T 131072, d 3749.395, n1 37, 76 drags ---
  image case1-start: C:\dev\wt\rcf\frontends\shell\e2e\out\recentre-crossing-e1-1794465184091-case1-start.png 34623 bytes sha256 102996b14908f10ff21f6afb7bbb1ec30dfacfdd7997510285c082331159f3f2
  image case1-end: C:\dev\wt\rcf\frontends\shell\e2e\out\recentre-crossing-e1-1794465184091-case1-end.png 3169 bytes sha256 4ad952620d75ab9051ed77c8ad3d8630eab8078e9f870e53e54eddf40d16f062
  origin changes: 5; in leg 1 3, in leg 2 2; at drags 35, 36, 37, 38, 39
FAIL  case 1 (a): W is continuous across each origin change  ::  5 origin change(s), worst jump 10730.00 buffer px (tol 4)
FAIL  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (671141.663, 0.000) vs d 3749.395
FAIL  case 1 (c): the start and end images do not differ  ::  differ: N 35248 -> 0, C shift 0.00 buffer px
--- case 2: z_fit -3.692532927362801, T 131072, double-click shift 300 px, window below T: (0, 1939.342] ---
FAIL  case 2 (i): no origin change from the double-click to its settle  ::  11 line(s), 1 origin change(s), settled true
PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)
FAIL  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  2 origin change(s), worst jump 20426.00 buffer px (tol 4)
==== 1/6 PASS ====
FAILED: case 1 (a)...; case 1 (b)...; case 1 (c)...; case 2 (i)...; case 2 (iii)... (full line in the log). No VOID or fatal line. rc=1.

**Reading vs P-E1-base:** precondition met (origin changes in leg 1 = 3, leg 2 = 2; five total, same count as run rc). Case 1 (a), (b), (c) fail as predicted. Case 2 (i) fails, (ii) passes, as predicted. Case 2 (iii) as seen: fails, 2 origin changes, worst jump 20426.00 buffer px. I2 and I3 not raised; I4 not applicable. Nothing re-run.

**After the run:** procs-after: no spatial-ide-shell, listed at 06:36:47Z. port-after shows one line, "TCP 127.0.0.1:9223 127.0.0.1:11108 TIME_WAIT 0": a closing socket, no listener. Copies in the scratch folder: rcf-s3b.app.log 277 B sha 51cad603...adb8; rcf-s3b.session.log 210540 B sha 63364dc3...59936b8 (from the app's session-1794465184.log); the case1-start and case1-end PNGs as rcf-s3b-recentre-crossing-e1-1794465184091-case1-{start,end}.png with the same sizes and shas as the log's image lines. Also stamps.txt, procs-before/after, port-before/after (rcf-s3b.port-before.txt empty, sha e3b0c442...).

**numstat vs 9398efc6...HEAD, frontends/shell:** recentre-crossing.mjs 317/0 = 317 (ceiling 450); package.json 1/0 = 1 (ceiling 2); WorkingCanvas.recentre.test.tsx 218/0 = 218 (ceiling 300). No overrun, so no class 8.

**Disclosures and departures:** (1) My check commands redirected verify-cites output to /tmp/null, which wrote a 37 KB file at the Git Bash /tmp (outside the allowed places). I deleted it and confirmed it is gone. Both checks returned rc 0. (2) I ran one `find` over the app's per-user folders to look for the session log (not needed; the app.log named the path). It lingered as a background process; I killed it by its own PID 68244. (3) Scratch files not named in the brief: rcf-s3b-msg.txt, rcf-s3b-procs.ps1. (4) Several of my wait loops ran as background tasks; all ended by their own timeouts or completion. The form was read whole; the brief said "again" for §§4-13, nothing departed from it. Nothing else departed.

**Hold lines** (also= elided): build "MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:63016" then "MACHINE_RELEASED project=SpatialIDE shell=bash.exe:63016 affinity=FF (cores 0-7)"; run "MACHINE_HOLD ... shell=bash.exe:72204" then "MACHINE_RELEASED ... shell=bash.exe:72204". Neither was refused.

**Push:** `git push origin cut/recentre-crossing-view-displaced-fix` in its own call: dce9d6a2..8cbc250b. ls-remote: 8cbc250ba568cd29485663990f27c63451f2a67f refs/heads/cut/recentre-crossing-view-displaced-fix. Porcelain empty. No PR action or CI wait.

**Pre-gate classes:** cross-module seam: none crossed (a script line and a comment; the E1 file's seams with lib.mjs and the app were not touched). Completion claims: each backed by a command above. Messages: no user-facing text changed. Required tests: E1 ran to its tally line and every assertion line; it did not stop at setup. No mutation observed this round.
Model: Sonnet 5.5 (claude-sonnet-5-5); no override; no context handoff. Background shells left: none.
Scratch folder: <S>/ (rcf-s3b* files).
