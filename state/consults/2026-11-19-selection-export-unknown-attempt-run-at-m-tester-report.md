*Filed by the custodian: the tester's hand-back (claude-sonnet-5-5), 8348 bytes, sha256 7a100ee2ed7954496e45ca04af0329d18b97a53f03abe87e3130e3630bacc69c, below the rule, byte for byte, nothing masked by the custodian (the tester wrote the hold lines' values as <m> itself), and one final newline added. Calls Read 5, Bash 17, Monitor 1, SubagentHandback 1, one errored, from 2026-11-19T11:32:44Z to 11:50:07Z by its transcript. The run is the one ADV-2026-11-19-20 item 4 asked for, by a tester as that item names. The suite's log, the build log and the app's session log stay in the custodian's scratch folder.*

---

Run: selection-export-unknown-attempt at 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 (M), tester, port-5400 harness
Result: the selection suite ran once on an app built at M, rc 0, 18 PASS, 0 FAIL, 1 SKIP (EXPORT-TODAY). No export step ended unknown-attempt, and every step matches the series at 9a4c5833.

**Start state**
- HEAD was 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 and the porcelain was empty.
- `git log -1 --format=%P HEAD` printed `40173dfe3a077cbc54694559bc01ade3bfda6ac0 7c3ccbcfc8f71d6535a3f7134f034874ecb29167`.
- `git diff --name-only 7c3ccbcf... HEAD` printed only `frontends/shell/e2e/README.md` and `frontends/shell/e2e/selection.mjs`.
- `df -h`: C: 46G free, D: 361G free.
- `D:/wt-targets/sel` existed, holding `CACHEDIR.TAG`, `debug` and `exes`.
- `<H>/out` held no `sel-e2e-build-` log and no `sel-e2e-sel-m` file. It still held the series' `sel-head` and `selb-base` run files and `sel-e2e-loads.txt`, which the brief does not mention. That is not a stop condition.
- The harness check printed ten OK lines: run-suite, load, app-up, app-up-wait, app-down, busy, the two shim `npx.cmd` files, `sel-e2e-tauri.conf.json` and build-exe. rc 0.
- I read build-exe, run-suite, app-up and busy whole and changed no harness file.
- I did not read `sel-e2e-load.sh`, which the suite hold calls.

**Build** (hold 1, `<S>/selm-build.log`)
- Log, whole:
```
viewer build rc=0
shell build rc=0
exe build rc=0
   Compiling spatial-ide-shell v0.1.0 (C:\dev\wt\sel\frontends\shell\src-tauri)
   Compiling spatial-kernel v0.0.0 (C:\dev\wt\sel\kernel)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 2m 14s
copied exe
```
- The last lines of `<H>/out/sel-e2e-build-exe.log` were the same three lines (two Compiling, one Finished in 2m 14s).
- The exe, `D:/wt-targets/sel/exes/spatial-ide-shell-sel.exe`, is 91557888 bytes, sha256 3040062fa73186a13517989832ad3afd01469504074c9eb9a9f0bba8315b008e. The series' exe at 9a4c5833 was 91553792 bytes, sha256 f62fb9fe...08d7, so this is a different build.
- The porcelain after the build was empty.
- The busy check before each hold printed FREE, rc 0, in a call of its own.

**Suite** (hold 2)
- Tag `sel-m`.
- Start 2026-11-19T11:37:53Z, end 11:48:48Z, rc 0.
- 18 PASS, 0 FAIL, 1 SKIP.
- First line, byte-copied: `worktree C:/dev/wt/sel head 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 start 2026-11-19T11:37:53Z`
- Load line, byte-copied: `load sel-m 11:37:40Z 22,100,100`
- App-down output, byte-copied: `killed tree 24728`, `killed tree 59164`, `port 9223 free`, `port 5400 free`.
- The app named a session log. I copied it to `<S>/selm-m.session.log`, cp rc 0.
- The audit log path was `<S>/selm-m.audit.jsonl`. I did not check whether the app wrote it.
- Step results, byte-copied beside the series at 9a4c5833 (one of the two `[E-KINDS]` lines is a point-step note, not a result):

| Step | This run (M) | Series at 9a4c5833 |
|---|---|---|
| E-SCENE | PASS (23874ms) | PASS (16710ms) |
| E-CLICK | PASS (600ms) | PASS (512ms) |
| E-CLICK-FAST | PASS (913ms) | PASS (896ms) |
| E-SELECT | PASS (875ms) | PASS (691ms) |
| E-NODRAG | PASS (1474ms) | PASS (1350ms) |
| E-ZOOMSEL | PASS (2244ms) | PASS (2061ms) |
| E-SEL-PAN | PASS (1308ms) | PASS (1126ms) |
| E-SEL-FILTER | PASS (29443ms) | PASS (22091ms) |
| E-REFUSED | PASS (8740ms) | PASS (9391ms) |
| E-GEN | PASS (19539ms) | PASS (14724ms) |
| E-KINDS | PASS (71958ms) | PASS (60377ms) |
| E-EXPORT | PASS (15888ms) | PASS (14742ms) |
| E-SCOPE | PASS (4297ms) | PASS (2639ms) |
| E-ASK | PASS (104799ms) | PASS (112906ms) |
| E-ASK-STATEMENT | PASS (97157ms) | PASS (109355ms) |
| E-ASK-TWO | PASS (183703ms) | PASS (245553ms) |
| E-STATUS-HEIGHT | PASS (50028ms) | PASS (41129ms) |
| E-DBLCLICK | PASS (18284ms) | PASS (16575ms) |
| EXPORT-TODAY | SKIP | SKIP |

- No step's result differs from the series. The milliseconds differ and none is a timing claim; the run was shared and the load line shows 100 and 100 on the last two figures.
- Prepare-to-execute readings on the export steps, byte-copied:
  - E-EXPORT: `5ms 3ms`
  - E-SCOPE: `272ms`
  - E-ASK: `5ms 4ms`
  - E-ASK-STATEMENT: `3ms`
  - E-ASK-TWO: `4ms 4ms`
- Last two lines and `rc=`, byte-copied:
```
[selection] 18 PASS, 0 FAIL: E-SCENE=PASS E-CLICK=PASS E-CLICK-FAST=PASS E-SELECT=PASS E-NODRAG=PASS E-ZOOMSEL=PASS E-SEL-PAN=PASS E-SEL-FILTER=PASS E-REFUSED=PASS E-GEN=PASS E-KINDS=PASS E-EXPORT=PASS E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=PASS E-ASK-TWO=PASS E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS
[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover.
rc=0 end 2026-11-19T11:48:48Z
```
- First-look change: the map's tile requests after each open and each filter change did not break any step. The oracle-dependent steps (E-CLICK, E-SELECT, E-SEL-FILTER, E-GEN, E-KINDS) all passed.

**Failures:** none, so there is no class to give. The worker's residual (the dialog in the DOM a moment before the ref is set) did not show. One pass does not prove the window closed.

**Holds**
- Hold 1:
  - Asked 2026-11-19T11:34:02Z (`<S>/selm-h1.asked`).
  - Granted at once; the grant line was `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`.
  - Ended at the build's finish, with `MACHINE_RELEASED`.
  - The build ran 2m 14s of cargo plus the two npm builds.
- Hold 2:
  - Asked 2026-11-19T11:37:37Z (`<S>/selm-h2.asked`).
  - The grant line carried `also=<m>`. The suite's load line stamp was 11:37:40Z, so it was granted at once, with no MACHINE_WAITING lines.
  - Ended after the suite's `rc=0 end 11:48:48Z`, with `MACHINE_RELEASED`.
- Both holds exited 0. None exited 96 to 99.
- Neither hold waited on another hold. Each grant line showed `also=<m>`, which names another process. I cannot say from the lines whether that process was running a heavy command then, so I cannot say whether my holds stood beside another hold of this project. The load figures of 100 on the last two readings point to a busy machine.

**Fixtures**
- 34 files under `target/fixtures/manual-walkthrough`, each with size and sha256, in `<S>/selm-fix-before.txt` and `<S>/selm-fix-after.txt`.
- `cmp` printed nothing, rc 0, so the two lists are identical.
- No fixture was regenerated and the 5 GB fixture was not used.

**End state**
- HEAD was 3bbe2ab0831233e5bebc8d5fc6951003aba6b1a6 and the porcelain was empty.
- `df -h`: C: 46G free, D: 361G free.
- `du -sm D:/wt-targets/sel`: 7463 MB.
- The last `sel-e2e-busy.ps1`, in a call of its own, printed FREE.
- App-down showed ports 9223 and 5400 free, as above.
- No process I started is still running. The harness's app-down killed the app and vite trees. My own wait loops, which the tool moved to the background, ended on their own.

**Done that the brief does not name**
- I ran two bounded wait loops in the foreground, and the tool moved them to the background. They only read the hold's output file.
- I read the app's stderr in `<H>/out` to find the session log's name.
- I tried a Monitor tool for waiting; it does not exist here.
- The suite itself wrote `selection-scratch.parquet` and `tauri.e2e.conf.json` copies into `<H>/out`.

**Process classes for the gate**
- Harness uses the product's interface: the debug exe is driven through WebView2 CDP with vite on 5400, the harness's own route. The export steps call the dev hook `publishExecute`; a person's confirm does not go through that hook. The README's claim that the wait hides nothing a person can meet is the worker's code reading, which I did not test.
- Every result claim points to a table or report that exists: the figures above are from `<H>/out/sel-e2e-sel-m.log`, and the comparison column is from the series report at 9a4c5833.
- Operator-facing lines describe this commit: the log's first line names 3bbe2ab0.
- The measurement reaches its assertion: all 18 steps ran to their PASS lines, including the five export steps that execute.
- This is a pass/fail run with no timing claim.

**Model:** claude-sonnet-5-5 (Sonnet 5.5), no override, no context handoff.

Files, all in `<S>`: `selm-fix-before.txt`, `selm-fix-after.txt`, `selm-build.log`, `selm-m.session.log`, `selm-h1.asked`, `selm-h2.asked`, `selm-busy1.txt`, `selm-busy2.txt`, `selm-busy3.txt`. The suite log is `<H>/out/sel-e2e-sel-m.log`.
