# S1's one series at 00bead77 (the form's section 12): npm run verify whole, the five e2e suites and the repository checks, the tester's report

*Filed by the custodian from the subagent transcript, the SubagentHandback input of 2026-11-18T10:55:59.281Z (dispatched in the background; the run 2026-11-18T10:17:36.757Z to 10:55:59.281Z by its transcript, Read 1, Bash 46, Write 1, SubagentHandback 1; its assistant records name claude-sonnet-5-5): 6167 bytes, sha256 d6dee01cf236f005c1023204d0f84ad5990f9c1497905a2250cbbe2df2924b93. One change, under the advisor's ruling ADV-2026-11-18-07 item 2: the exe's modification time gave a time-zone offset, which this copy leaves out and marks so. One final newline is added. Nothing else is changed. It is evidence, not Authority.*

---

Series: shell-tiled-arm-stream-refusal-shown-to-the-user S1 at 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3, tester, port-5400 harness

Result: every step ran and exited rc 0 (setup, npm run verify, 5 e2e suites, 4 repo checks); no STOP, no I4 timing failure, no re-run, fixtures unchanged. Every hold was granted at the first call.

START STATE
- HEAD 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3, porcelain empty. df: C: 50G free, D: 367G free.
- Harness check: eight OK (srf-e2e-run-suite.sh, srf-e2e-load.sh, srf-e2e-app-up.ps1, srf-e2e-app-up-wait.ps1, srf-e2e-app-down.ps1, srf-e2e-busy.ps1, shim/npx.cmd, shim-wait/npx.cmd), rc=0.
- Exe D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe: 91555840 bytes, mtime 2026-11-16 03:00:15 [time zone left out], sha256 01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b (as given).
- Diff check (6f7e744c..00bead77 over the named paths): printed nothing, rc=0.
- I read srf-e2e-run-suite.sh and srf-e2e-app-up.ps1 whole; no harness file changed.

SETUP RCs
- npm ci frontends/shell: 0. npm ci renderer/bundle-viewer: 0. bundle-viewer npm run build: 0. frontends/shell npm run generate:notice: 0. Porcelain empty after each.

npm run verify (once, whole, -Minutes 30): rc=0, 10:19:55Z to 10:23:20Z. One vitest command ran:
 Test Files  114 passed (114)
      Tests  1478 passed (1478)
Its last lines are the test:s5-verdict output, ending "ℹ tests 7 / ℹ pass 7 / ℹ fail 0 / ℹ duration_ms 18.0601" (full 30 lines are in <S>/s5srf-verify.log).

SUITE RUNS (all at HEAD 00bead77; no --measure; source-changed under env -u SPATIAL_E2E_SOURCE_CHANGED_ROUTE)
| tag | start | end | rc | PASS | FAIL |
| s5-regression | 10:24:03Z | 10:29:51Z | 0 | 17 (+1 INFO, NET') | 0 |
| s5-residency-harness | 10:30:59Z | 10:31:26Z | 0 | exit code only | exit code only |
| s5-filter | 10:32:04Z | 10:32:24Z | 0 | 3 | 0 |
| s5-pan-anchor | 10:33:00Z | 10:38:42Z | 0 | 16 | 0 |
| s5-source-changed | 10:39:34Z | 10:40:05Z | 0 | 8 (S1, S2, S3, S4, S5a, S5b, S5c, fixture-integrity) | 0 |
No suite failed, so no "-2" re-run exists.

Last two lines and rc= of each log (byte-copied):
- regression: "This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use." / "rc=0 end 2026-11-18T10:29:51Z"
- residency-harness: same two lines, "rc=0 end 2026-11-18T10:31:26Z" (no figure it prints is recorded or claimed)
- filter: same, "rc=0 end 2026-11-18T10:32:24Z"
- pan-anchor: "==== 16/16 PASS ====" / "rc=0 end 2026-11-18T10:38:42Z"
- source-changed: "This run LAUNCHED the app; it stays running on CDP port 9223." / "rc=0 end 2026-11-18T10:40:05Z"
First lines: "worktree C:/dev/wt/srf head 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3 start <the start time above>" for each. Load lines: regression "load s5-regression 10:23:54Z 47,40,37"; residency-harness "10:30:45Z 66,80,85"; filter "10:31:53Z 63,77,87"; pan-anchor "10:32:50Z 68,51,45"; source-changed "10:39:20Z 80,84,82".
Step result lines for each suite are in <H>/out/srf-e2e-<tag>.log (regression's 17 steps are A1', A3', A4', A5'/A6', A7', A8', A9', K6, K7, CURSOR', FIND', MP', PT', LN', B2'/B3', ABSENTCRS', C2'/C3'; filter's are [OPEN], [FILTER'], [REFUSED']; pan-anchor's 16 are the small/large pixel-spaces-coincide, normal-A x2, paint-vs-event x2, there-and-back-net, recenter-crossing-A x2).
App-down output for each run: two "killed tree <pid>" lines, "port 9223 free", "port 5400 free".
Each app's stderr named a session log; copied to <S>/s5srf-<tag>.session.log (five files); app.err.log copies at <S>/s5srf-<tag>.app.err.log.

HOLDS (asked / granted = command start / ended; hold lines carried also=<m>, release lines shell=<m>; no MACHINE_WAITING/ERROR, no 96-99, no WAIT_TIMEOUT)
- npm ci shell: 10:18:10Z / ~10:18:10Z / 10:18:27Z
- npm ci bundle-viewer: 10:18:41Z / ~same / 10:18:48Z
- bundle-viewer build: 10:18:59Z / ~same / 10:19:05Z
- generate:notice: 10:19:13Z / ~same / 10:19:38Z
- verify: 10:19:53Z / 10:19:55Z / 10:23:20Z
- regression: 10:23:51Z / 10:23:54Z / 10:30:05Z
- residency-harness: 10:30:38Z / 10:30:45Z / 10:31:32Z
- filter: 10:31:49Z / 10:31:53Z / 10:32:30Z
- pan-anchor: 10:32:46Z / 10:32:50Z / 10:38:53Z
- source-changed: 10:39:14Z / 10:39:20Z / 10:40:13Z

REPO CHECKS (C:/dev/wt/srf, no hold)
- verify.mjs rc=0: "verify:plan PASS — C:\dev\wt\srf\governance\PLAN.yaml agrees with the repository."
- verify-cites.mjs rc=0: "verify:cites PASS — every rooted (in-tree) path:line reference across 3169 file(s) resolves. (215 loose reference(s) advised above.)"
- verify-quotes.mjs rc=0: "verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 936 ruling cites resolved, 0 ruling-cite errors."
- node --test (plan/hooks/evidence) rc=0: tests 606, pass 606, fail 0, last line "ℹ duration_ms 119803.9143".

FIXTURES: 34 files before and after (size + sha256) in <S>/s5srf-fix-before.txt and <S>/s5srf-fix-after.txt; cmp rc=0. None regenerated; 5 GB fixture not used. At the end HEAD = 00bead77 and the porcelain is empty.

PROCESSES AT END: ports 9223 and 5400 free; the app and vite trees were killed by the harness's app-down on its recorded PIDs. Three msedgewebview2.exe entries (PIDs 32672, 40088, 12528) remain in tasklist; I did not start them by PID and did not kill them. No background shell or process of mine is running.

FAILURE CLASSES (harness): the suites drove the real debug exe over CDP and the real DOM using the window.__SPATIAL_E2E__ hooks the suites already use; every claim points to a log in <H>/out or <S>; each log's first line names HEAD 00bead77 and start time; PASS lines come from assertion steps. Caveat: the exe was built from 6f7e744c; the diff check shows nothing it is built from differs from F.

NOT NAMED IN THE BRIEF: I wrote the read/copy helper <S>/s5srf-after.sh; I added a date and an rc echo inside each hold call between command and release; source-changed made its scratch parquet under the worktree's ignored e2e/out (fixtures unchanged). No tracked file changed; no commit, push or checkout.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
