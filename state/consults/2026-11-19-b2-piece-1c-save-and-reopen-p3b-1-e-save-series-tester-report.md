*Filed by the custodian: the tester's last hand-back (claude-sonnet-5-5), 6101 bytes, sha256 cc4ed7e203b919efb8dfe292109042394ef221cc800b166e73f6d22432d532ea, below the rule, byte for byte but for five maskings (one remark on the local file times, two local file times as <t>, one hold-line project value as <m>, one scratch-folder path as <S>), with one final newline added. Calls Read 4, Bash 12, SubagentHandback 2, none errored, from 2026-11-19T18:48:46Z to 18:53:35Z by its transcript. Its first hand-back (2545 bytes, sha256 973427af78ee2588f81858c90a69ae306d48c9a2aa1367b626871f6f398be75a) came while the exe build's hold still ran, with no result; the custodian resumed it by message, and this report covers the whole run. P3b-1's one series report (ADV-2026-11-16-06), at the final candidate 4b8d67023461320c44f5ef70631d5057133eab6d (the 1c form's Amendment 47 item 7).*

---

Series: b2-piece-1c-save-and-reopen P3b-1 E-SAVE at 4b8d67023461320c44f5ef70631d5057133eab6d, tester, port-5400 harness

Result: PASS. E-SAVE ran once on port 5400 and exited rc=0, with all 12 steps PASS. No `--measure`, no re-run, nothing routed around.

**Start state**
- HEAD of C:/dev/wt/1c-p3b-1 was 4b8d67023461320c44f5ef70631d5057133eab6d, with an empty porcelain.
- `git ls-remote origin cut/b2-piece-1c-p3b-1` printed the same hash.
- `df -h`: C: 47G free, D: 368G free.
- `sha256sum -c` printed OK for all ten harness files.
- I read `p3b1-e2e-run-suite.sh`, `p3b1-e2e-app-up.ps1` and `p3b1-e2e-build-exe.sh` whole and changed no harness file.

**Step 1 checks**
- The diff from 70335c37 to HEAD listed only `frontends/shell/src-tauri/src/commands.rs` and `kernel/src/project/mod.rs`.
- `NOTICE.txt` exists: 3506979 bytes, <t>.
- `node_modules` exists in `frontends/shell` and in `renderer/bundle-viewer`.
- The porcelain was empty.

**Exe build (step 2)**
- Hold rc 0 and build rc 0. The last lines it printed:
```
   Compiling spatial-ide-shell v0.1.0 (C:\dev\wt\1c-p3b-1\frontends\shell\src-tauri)
   Compiling spatial-kernel v0.0.0 (C:\dev\wt\1c-p3b-1\kernel)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1m 49s
copied exe
MACHINE_RELEASED project=<m> shell=bash.exe:49752 affinity=FF (cores 0-7)
```
- Exe `D:/wt-targets/1c-p3b-1/exes/spatial-ide-shell-p3b1.exe`: 91578880 bytes, mtime <t>, sha256 2dd2a1b21def166e29a988ad4549a55eef2dcebf48e1d62d8fbf05eaf9b1e3fc.
- (a remark on the local file times, masked by the custodian)

**E-SAVE (step 3)**
- The busy check before it printed FREE, rc=0.
- Load line: `load e-save 18:52:08Z 30,9,7`.
- Log header: `worktree C:/dev/wt/1c-p3b-1 head 4b8d67023461320c44f5ef70631d5057133eab6d start 2026-11-19T18:52:18Z`. Last line: `rc=0 end 2026-11-19T18:52:53Z`.
- The fixture sha256 was 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 before and after the run (unchanged).
- Step lines, byte-copied:
```
[OPEN] PASS (5261ms): admitted; the Save control and the first pixels are there
[CLAUSES] PASS (7940ms): three clauses, the second off; the Filter section reads Applied: ("zone" = 'residential') AND ("zone" IS NOT NULL); their 4 record_step rows reached ok
[STYLE] PASS (3567ms): opacity 0.37 and colour #112233 committed; their record_step rows reached ok
[POSE] PASS (3252ms): camera set to centre (2600900.3333333335, 1200900.2857142857), zoom -0.8571428571428572
[SAVE] PASS (37ms): answered "asked"; the folder holds project.spatial alone (2497 characters); spatial://project/aecc489b5da0fd7c7a2772e0bb447735
[READBACK-FILTER] PASS (0ms): the file holds the three clauses in order, the second off, and the filter ("zone" = 'residential') AND ("zone" IS NOT NULL)
[READBACK-STYLE] PASS (0ms): the file's style holds the fill colour #112233 and the applied opacity 0.37
[READBACK-VIEW] PASS (1ms): the file's view holds the pose's patterns: centre 4143d7e22aaaaaab, 4132530449249249, zoom bfeb6db6db6db6dc
[SECOND-SAVE] PASS (44ms): answered "not-asked"; the second folder stays empty; the first folder's project.spatial still reads back
[INSIDE-OPEN] PASS (6212ms): the copy under "parcels.parquet" in the third folder was admitted
[INSIDE-SAVE] PASS (36ms): answered "asked"; the third folder holds project.spatial and the copy; spatial://project/51ad885e3c7d820400df41cd61b119ab
[NOTICE-S18] PASS (13ms): the save notices hold S18's text once; the dataset entry's locators read machine-recorded
```
- Suite teardown: killed tree 38984 and 72224; ports 9223 and 5400 free.
- Copies in `<S>` (the scratchpad folder, <S>):
  - `p3b1e2-e-save.log`
  - `p3b1e2-e-save.app.err.log`
  - `p3b1e2-e-save.session.log`, copied from the session-1795114343.log that the stderr names.
- The audit log path `p3b1e2-e-save.audit.jsonl` was set in the environment. I did not check whether it was written.
- The harness's own copy of the console ledger is `<S>/p3b1-e2e-h/out/p3b1-e2e-e-save.rep.project-console-ledger-1795114372646.json`.
- There was no failure and no timing-dependent failure.

**Holds**
- Hold 1, the build: asked 2026-11-19T18:49:16Z (from `p3b1e2-h1.asked`), granted, with `also=<m>`, rc 0, released.
- Hold 2, E-SAVE: asked 2026-11-19T18:52:06Z (from `p3b1e2-h2.asked`), granted, with `also=<m>`, rc 0, released.
- The first, interrupted turn handed back while hold 1 was still running. The coordinator's message and this report cover that.

**Processes at the end**
- The last busy check printed FREE, rc=0.
- The suite's down step killed the app and vite trees it had started.
- Both background shells (b3fq2rut2 and bql0u515e) completed. No process of mine is still running, and I killed nothing myself.
- HEAD is still 4b8d67023461320c44f5ef70631d5057133eab6d with an empty porcelain.
- `df -h`: C: 47G free, D: 370G free.

**Failure classes as they apply to this harness**
- Interface: the suite drives the real shell debug exe through its app window (WebView2 over CDP on 9223, vite on 5400 mapped from 5180), the surface the product exposes.
- Results table: every result claim here points to `p3b1e2-e-save.log` or the harness copy of it, both of which exist.
- Operator-facing lines: the step lines describe this run at 4b8d6702, whose log header names that HEAD.
- Assertions: each step line is a PASS emitted by the suite after its checks, not only after setup.
- I did not compare this run against the 70335c37 run's output in `<H>/out-70335c37`. I noted no regression, but I made no comparison either.

**Anything I did that the brief does not name:** nothing, apart from the scratch files `p3b1e2-start.txt`, `p3b1e2-sha.txt`, `p3b1e2-busy1.txt` and `p3b1e2-busy2.txt`, all under `<S>`.

**Model:** Sonnet 5.5 (claude-sonnet-5-5), as my harness gives it. No override and no context handoff. I have no token figures at hand.
