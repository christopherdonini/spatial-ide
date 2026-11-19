*Filed by the custodian: the tester's hand-back (claude-sonnet-5-5), 7604 bytes, sha256 062620b27155d6be52ba10d2d8e48f0e128d1a71db9dd008b6a8ec44f6c308c4, below the rule with two masks applied (a local clock time with its zone, and this project's name in a hold line, each written <m>, ADV-2026-11-18-07) and one final newline added if missing; calls Bash 25, Read 2, Grep 1, SubagentHandback 1, one errored, from 2026-11-19T07:00:12Z to 07:36:52Z. Its log, checked by the custodian: the head line names 9a4c58332661b6fd69fb477b1184f0147f38df2b, 18 PASS lines, rc=0 at 07:35:26Z. The tester's own departure: the last busy check ran in the same call as the end-state checks.*

---

Series: selection-export-unknown-attempt at 9a4c58332661b6fd69fb477b1184f0147f38df2b, tester, port-5400 harness
Result: the selection suite ran once at the piece's head, rc 0, 18 PASS, 0 FAIL, 1 SKIP (EXPORT-TODAY). No export step ended unknown-attempt.

**Start state**
- HEAD was 9a4c58332661b6fd69fb477b1184f0147f38df2b and the porcelain was empty.
- `git diff --name-only f5584f28...HEAD` printed only `frontends/shell/e2e/README.md` and `frontends/shell/e2e/selection.mjs`.
- `df -h`: C: 47G free, D: 371G free.
- `D:/wt-targets/sel` did not exist.
- The harness check printed ten OK lines. Those are the six scripts and `sel-e2e-tauri.conf.json`, plus `sel-e2e-app-up-wait.ps1`, `sel-e2e-app-down.ps1` and the two `shim` npx.cmd files.
- I read `sel-e2e-build-exe.sh`, `sel-e2e-run-suite.sh`, `sel-e2e-app-up.ps1` and `sel-e2e-busy.ps1` whole. I changed no harness file.

**Build** (hold 1, `<S>/selser-build.log`)
- The build log reads:
```
viewer build rc=0
shell build rc=0
exe build rc=0
   Compiling open v5.4.1
   Compiling duckdb v1.10505.0
   Compiling spatial-engine v0.0.0 (C:\dev\wt\sel\engine)
   Compiling spatial-kernel v0.0.0 (C:\dev\wt\sel\kernel)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 18m 05s
copied exe
```
- The last lines of `<H>/out/sel-e2e-build-exe.log` end with the same "Finished `dev` profile ... in 18m 05s" line. The compile lines above it are the same as in the build log.
- The exe is `D:/wt-targets/sel/exes/spatial-ide-shell-sel.exe`, 91553792 bytes, sha256 f62fb9feae7279a678b72dd8e7ed88b6820cc982b600627ef83d05cc074608d7.
- The porcelain after the build was empty.

**Suite** (hold 2)
- Tag: `sel-head`.
- Log first line: `worktree C:/dev/wt/sel head 9a4c58332661b6fd69fb477b1184f0147f38df2b start 2026-11-19T07:24:04Z`.
- Last line: `rc=0 end 2026-11-19T07:35:26Z`.
- Counts: 18 PASS, 0 FAIL, 1 SKIP.
- Load line: `load sel-head 07:23:55Z 19,24,26`.
- App-down output: `killed tree 29460`, `killed tree 55692`, `port 9223 free`, `port 5400 free`.
- The app named a session log. I copied it to `<S>/selser-head.session.log`, cp rc 0.
- The audit log is `<S>/selser-head.audit.jsonl`.
- The first log line after the head line is a Node deprecation warning (DEP0190). The next line is `[selection] PENDING_ATTEMPT_TTL 600000ms, read from src-tauri/src/publish.rs`.
- Byte-copied result lines, each with its milliseconds, beside S9 finding 1:

| Step | Result this run | S9 |
|---|---|---|
| E-SCENE | PASS (16710ms) | PASS |
| E-CLICK | PASS (512ms) | PASS |
| E-CLICK-FAST | PASS (896ms) | PASS |
| E-SELECT | PASS (691ms) | PASS |
| E-NODRAG | PASS (1350ms) | PASS |
| E-ZOOMSEL | PASS (2061ms) | PASS |
| E-SEL-PAN | PASS (1126ms) | PASS |
| E-SEL-FILTER | PASS (22091ms) | PASS |
| E-REFUSED | PASS (9391ms) | PASS |
| E-GEN | PASS (14724ms) | PASS |
| E-KINDS | PASS (60377ms) | PASS |
| **E-EXPORT** | **PASS (14742ms)** | FAIL (12647ms), unknown-attempt |
| E-SCOPE | PASS (2639ms) | PASS |
| **E-ASK** | **PASS (112906ms)** | FAIL (132379ms), unknown-attempt |
| **E-ASK-STATEMENT** | **PASS (109355ms)** | FAIL (19242ms), unknown-attempt |
| **E-ASK-TWO** | **PASS (245553ms)** | FAIL (113333ms), unknown-attempt |
| E-STATUS-HEIGHT | PASS (41129ms) | PASS |
| E-DBLCLICK | PASS (16575ms) | PASS |
| EXPORT-TODAY | SKIP | SKIP |

- The four differing steps are E-EXPORT, E-ASK, E-ASK-STATEMENT and E-ASK-TWO. All four failed with unknown-attempt in S9 and passed here. The other 14 PASS and the SKIP match S9.
- The prepare-to-execute figures on the four export steps were 5ms 5ms (E-EXPORT), 3ms 4ms (E-ASK), 5ms (E-ASK-STATEMENT) and 4ms 4ms (E-ASK-TWO).
- Byte-copied tail lines:
```
[selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS
[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover.
rc=0 end 2026-11-19T07:35:26Z
```
- This is one run. The worker's residual (the dialog element can sit in the DOM a moment before the ref is set) did not show in it. One pass does not prove the window closed.

**Failures:** none.

**Holds** (stamps from the `selser-h<n>.asked` files and the logs)
- Hold 1:
  - Asked 2026-11-19T07:01:27Z.
  - Granted at once. The line carried `also=<m>`.
  - Ended when the build finished. The build log was last written at 07:20:24Z (<m> by its mtime). A 18m 05s cargo build started after the two npm builds fits that.
  - The release line was `MACHINE_RELEASED`.
- Hold 2:
  - Asked 2026-11-19T07:21:01Z.
  - It waited behind another hold of this project. Three `MACHINE_WAITING shared: turn of <m> held by pid <m> since <m>` lines came back.
  - It was granted before 07:23:55Z, the load line's stamp. The grant line carried `also=<m>`.
  - Ended after the suite's rc line at 07:35:26Z. Release line `MACHINE_RELEASED`.
- Hold 2 stood behind another hold of this project and did not run beside it. The `also=` field names another process, and I can't say from the lines whether that process was running a heavy command then. My own holds did not overlap each other.
- Neither hold exited 97, 96, 98 or 99.

**Fixtures**
- There were 34 files in `target/fixtures/manual-walkthrough`, each with size and sha256, in `<S>/selser-fix-before.txt` and `<S>/selser-fix-after.txt`.
- `cmp` printed nothing, rc 0, so the two lists are identical.
- None were regenerated and the 5 GB fixture was not used.

**End state**
- HEAD was 9a4c58332661b6fd69fb477b1184f0147f38df2b and the porcelain was empty.
- `df -h`: C: 46G free, D: 362G free.
- `du -sm D:/wt-targets/sel` was 7066 MB.
- The last `sel-e2e-busy.ps1` printed FREE. It ran in the same call as the end-state checks, not in a call of its own.
- App-down showed ports 9223 and 5400 free. No background shell or process I started is still running: the waiter shells all completed, and the suite's app and vite trees were killed by the harness's app-down.

**Things done that the brief does not name**
- I ran the busy check before hold 2 twice. The first run was combined with the post-build checks, and I repeated it in a call of its own.
- I used bash wait loops with a hard timeout to follow the background builds. Some were moved to the background by the tool after 180 s and completed on their own.
- I read the app's stderr in `<H>/out` only to find the session log's name.

**Process classes for the gate**
- **Harness uses the product's interface:** the debug exe is driven through WebView2 CDP with vite on 5400, the harness's own route. The export steps call the dev hook `publishExecute`, and a person's confirm does not go through that hook. The README claim that the wait hides nothing a person can meet is the worker's code reading, which I did not test.
- **Every result claim points to a table or report that exists:** the figures above are from `<H>/out/sel-e2e-sel-head.log`, and the S9 column comes from finding 1 of the S9 report.
- **Operator-facing lines describe this commit:** the head line of the log names 9a4c5833.
- **The measurement reaches its assertion:** all 18 steps ran to their PASS lines, including the four export steps that execute.
- This is a pass/fail series with no timing claim. The shared run is not a timing measurement.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.
