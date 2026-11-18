# PR B's series at 6f95993e, stopped at a refused hold before the pan-anchor run: the tester's report

*Filed byte for byte by the custodian from the subagent transcript, the SubagentHandback input of 2026-11-16T08:42:29.205Z (run 2026-11-16T05:25:35.792Z to 08:42:29.205Z, Bash 168, Write 7, Read 3, Grep 3, Monitor 1, SubagentHandback 1): 15355 bytes, sha256 f3928ca0157f28b70c2c2b906619085173516ffdc38ca2a0e66008d6b6694aa0, with one final newline added. Filed on 2026-11-18 after the architect's gate 2 report found that the packet named the series at 6f7e744c as this one. The completion of this series is the report of 2026-11-18. It is evidence, not Authority.*

---

Series: b1-shell-half PR B at 6f95993e37255513bf7f5d78b519bc3a71562fb0, tester, port-5400 harness

Result: STOP, a hold was refused with exit 97 (WAIT_TIMEOUT) before the `pan-anchor` run. The series is incomplete. Two findings stand before the STOP.
1. `selection` failed in `hc-selection` and again in the re-run `hc-selection-2`, on the same step.
2. `colour` failed PB-E4 under the brief's empty `<env>` in `hc-colour` and again in `hc-colour-2`, on EBUSY. The head series at 6f7e744c found the same, with a harness cause (the default non-waiting `npx` shim). I did not run a `SHIMDIR=shim-wait` diagnostic.

Not run:
- `pan-anchor`, `source-watch-idle`, `source-changed-pre`, `source-changed-post` and `source-changed-reopen`.
- `e2e:recentre-crossing`, so its busy check, copies and stamps are also absent.
- Step 9's mutations M-PB-E3 and M-PB-E4, and the step 9 diff check.

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No model override and no context handoff. No usage figures at hand.

**The four failure classes, as they apply to my harness**
1. Interface: every run drives the real debug exe over CDP in WebView2, from the exe whose sha256 I checked. The exception is the `publishPrepareWithDestination` dev seam in `colour` PB-E2, which the suite names itself.
2. Claim points to a record: each run has `<H>/out/m4b-e2e-hc-<tag>.log`, with my extract in `<S>/s327c-harvest-hc-<tag>.txt` and my copy of its session log in `<S>/s327c-hc-<tag>.session.log`.
3. Operator-facing lines: every quoted line is from this commit's runs.
4. Assertion reached: `colour` PB-E4 did not reach its assertion in either run, because the history read stayed EBUSY. `residency-harness` is exit code only, by the brief.

**Start state**
- Worktree `C:/dev/wt/m4b`: HEAD is 6f95993e37255513bf7f5d78b519bc3a71562fb0 and the porcelain is empty. The fetch was rc 0.
- Free disk: C: 50G, D: 375G.
- Form at origin/main: sha256 97cdbaaa88b53bc77ebb52a56c77a7e6e81a0fa55fd541c845fe4b4df0d8e616, 2691 lines. I read §9 and Amendments 2 item 4, 12 item 11, 21 item 5(b) and 24 to 26. I did not read the whole form (departure).
- Harness check: all ten printed `OK` (`m4b-e2e-app-down.ps1`, `m4b-e2e-app-up-wait.ps1`, `m4b-e2e-app-up.ps1`, `m4b-e2e-build-exe.sh`, `m4b-e2e-busy.ps1`, `m4b-e2e-run-suite.sh`, `m4b-e2e-tauri.conf.json`, `shim-wait/npx.cmd`, `shim/npx.cmd`, `m4b-e2e-load.sh`).
- `m4b-rec-onehold.mjs`: 635 bytes, sha256 18677923dc49fe463c072f071a2d74a70fefdec9119f46eff4600564743c28bf.
- The exe diff check printed nothing: `git diff --name-only 6f7e744c 6f95993e -- frontends/shell/src-tauri kernel/src engine/src protocol`, rc 0.
- Exe `D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe`: 91555840 bytes, mtime 2026-11-16 03:00:15 +0100, sha256 01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b.
- `package.json` lists 19 `e2e:` entries plus `e2e:debug`, as given.

**Installs and builds**
- `npm ci` in `frontends/shell`: rc 0 (the log ends with npm `allow-scripts` warnings).
- `npm ci` in `renderer/bundle-viewer`: rc 0.
- `npm run build` in `renderer/bundle-viewer`: rc 0. The scan's last lines:
  - `scan-dist: 3 files scanned, 2 findings, all reviewed; record written`
  - `scan-dist: reviewed row NOTICE.txt credential 19092: matched`
  - `scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched`
  - `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`
- `generate:notice`: rc 0, `src/generated/NOTICE.txt (3506979 bytes)`.
- Measure exe: `build:measure` rc 0, `Finished release profile [optimized] target(s) in 3m 30s`.
  - `D:/wt-targets/m4b-measure/release/spatial-ide-shell.exe` is 72476160 bytes, mtime 2026-11-16 06:44:33 +0100, sha256 2150a8e90907b6f04641a51c8521fa2cb276d7feae0452a94ac686f54f57e95c.
  - The head series' measure exe was 72475648 bytes, so this build is not byte-identical to that one.
- `cargo build -p spatial-kernel --example verify-bundle`: rc 0, `Finished dev profile … in 6.96s`.
- The porcelain stayed empty after every step.

**Fixtures**
- 34 files before and after. `cmp` of `<S>/s327c-fix-before.txt` and `<S>/s327c-fix-after.txt` gave rc 0.
- I wrote the "before" file before step 1 instead of at step 5 (departure; nothing touches fixtures in between).
- sha256, as in both files:
  - `filter-zoned.parquet`: 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
  - `100k-happy-path.parquet`: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
  - `attributes-multitype.parquet`: afbd4b909a22a416f88002dcbd81edf3117a642141954724eac4cc41c459a1d2
  - `attributes-multitype.oracle.json`: 29e54fec6fcb583f2c23fe6767390236724d930452660d24b39590c519f03a75
  - `slow-filter-scan.parquet`: 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5

**Runs.** All times are 2026-11-16 UTC. Start and end are from the log's first line and `rc=` line. The head-series column is the same run's rc at 6f7e744c, from that tester's report.

| tag (hc-) | script | env | rc | start | end | load line | last line or verdict | head series |
|---|---|---|---|---|---|---|---|---|
| regression | regression.mjs | | 0 | 05:50:24 | 05:55:22 | 05:50:14Z 23,29,20 | 17 PASS lines | 0 |
| refusal-contract-baseline | refusal-contract-baseline.mjs | | 0 | 05:58:37 | 05:59:30 | 05:58:28Z 28,22,19 | 3 PASS | 0 |
| admission | admission-remediation.mjs | | 0 | 06:02:12 | 06:02:42 | 06:02:03Z 29,21,17 | 11 PASS | 0 |
| filter | filter.mjs | | 0 | 06:05:22 | 06:05:37 | 06:05:13Z 20,20,22 | 3 PASS | 0 |
| filter-panel | filter-panel.mjs | | 0 | 06:08:21 | 06:08:50 | 06:08:12Z 18,22,14 | 5 PASS | 0 |
| style | style.mjs | | 0 | 06:11:32 | 06:11:43 | 06:11:23Z 22,18,7 | 6 PASS | 0 |
| publish | publish.mjs | | 0 | 06:14:26 | 06:14:40 | 06:14:17Z 16,8,14 | OPEN, APPROVED', REFUSED', FILTERED' PASS; EXPIRED' SKIP | 0 |
| console | console.mjs | | 0 | 06:17:32 | 06:23:45 | 06:17:23Z 14,12,5 | 11 PASS incl. REGRESS' (354609ms) | 1, then 0 on re-run |
| layout | layout.mjs | | 0 | 06:26:34 | 06:27:36 | 06:26:24Z 38,27,26 | 11 PASS, FIXTURES PASS | 0 |
| **selection** | selection.mjs | | **1** | 06:30:27 | 06:40:14 | 06:30:19Z 23,18,9 | `[selection] 17 PASS, 1 FAIL`: E-EXPORT FAIL | 0 |
| **selection-2** | selection.mjs | | **1** | 06:43:04 | 06:50:25 | 06:42:55Z 12,27,27 | `[selection] 16 PASS, 2 FAIL`: E-EXPORT and E-ASK-TWO FAIL | n/a |
| export-view | export-view.mjs | | 0 | 06:53:27 | 06:53:52 | 06:53:18Z 8,14,8 | `[export-view] 4 PASS, 0 FAIL` | 0 |
| recording | recording.mjs | SHIMDIR=shim-wait | 0 | 06:57:13 | 06:57:23 | 06:57:04Z 27,56,15 | 5 PASS (RECORD last) | 0 |
| command-bar | command-bar.mjs | | 0 | 07:00:05 | 07:01:38 | 06:59:56Z 19,18,20 | 14 PASS, FIXTURES PASS | 0 |
| attributes | attributes.mjs | | 0 | 07:04:18 | 07:06:44 | 07:04:09Z 25,21,18 | `[attributes] 2 PASS, 0 FAIL` | 0 |
| table | table.mjs | SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]' | 0 | 07:09:36 | 07:10:32 | 07:09:27Z 17,31,24 | `[table] 4 PASS, 0 FAIL` | 0 |
| project | project.mjs | | 0 | 07:19:25 | 07:19:51 | 07:19:15Z 24,31,28 | 12 PASS | 0 |
| residency-harness | residency-harness.mjs | | 0 | 07:32:28 | 07:32:47 | 07:32:19Z 15,11,11 | exit code only, no figure recorded | 2, then 0 on re-run |
| **colour** | colour.mjs | | **1** | 07:35:25 | 07:36:27 | 07:35:17Z 8,23,9 | PB-E1, E5, E2, E3 PASS; PB-E4 FAIL | 1 |
| **colour-2** | colour.mjs | | **1** | 08:24:28 | 08:25:30 | 08:24:18Z 16,23,15 | same: PB-E4 FAIL | 1 |
| pan-anchor | | | not run | | | | STOP (hold exit 97) | 0 |
| source-watch-idle, source-changed-pre, -post, -reopen | | | not run | | | | STOP | 0, 0, 3, 0 |
| recentre-crossing | | | not run | | | | STOP | 0 |

In every run that completed:
- The app-down output showed `killed tree <pid>` twice, `port 9223 free` and `port 5400 free`.
- The `skp.projection_` count in the `app.err.log` copy was 0.
- Every log's first line began `worktree C:/dev/wt/m4b head 6f95993e37255513bf7f5d78b519bc3a71562fb0 start …`.

Each `rc=` line is `rc=<n> end <time>`. The result lines, the last two lines and the session-log copy for each run are in `<S>/s327c-harvest-hc-<tag>.txt`. The harvest scripts print the `rc=` line, but I did not print every line in this report. For `residency-harness` I read only the first line, the last two and `rc=`: the last two are `Evidence file: C:\dev\wt\m4b\frontends\shell\e2e\out\residency-harness-instrument-on-1794814367196.json` and `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.` Session logs copied, in bytes:

| tag | bytes |
|---|---|
| regression | 855077 |
| refusal-contract-baseline | 3977 |
| admission | 9364 |
| filter | 1995 |
| filter-panel | 4114 |
| style | 1005 |
| publish | 1472 |
| console | 650000 |
| layout | 25330 |
| selection | 91142 |
| selection-2 | 83348 |
| export-view | 17317 |
| recording | 1192 |
| command-bar | 16399 |
| attributes | 19696 |
| table | 8936 |
| project | 7488 |
| residency-harness | 988 |
| colour | 6260 |
| colour-2 | 6260 |

**Failures, byte-copied**

`hc-selection`, rc 1:
- `[E-EXPORT] FAIL (11585ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 73ms, T 600000ms); prepare-to-execute 0ms`
- The tally line is `[selection] 17 PASS, 1 FAIL: …`, and `rc=1 end 2026-11-16T06:40:14Z`.

`hc-selection-2` (the one re-run, alone in its own hold), rc 1:
- `[E-EXPORT] FAIL (13140ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 22ms, T 600000ms); prepare-to-execute 0ms 0ms`
- `[E-ASK-TWO] FAIL (15673ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 12613ms, T 600000ms); prepare-to-execute 0ms`
- The tally line is `[selection] 16 PASS, 2 FAIL: …`, and `rc=1 end 2026-11-16T06:50:25Z`.

What I can say about it:
- Whether this is I3 is the custodian's reading.
- No harness cause shows in the launcher's output, the load lines, the busy check or the app-down output. The `app.err.log` copy of the re-run is 257 bytes, with no attempt, audit or publish lines.
- At the head series (6f7e744c) `selection` ended `[selection] 18 PASS, 0 FAIL`.
- `publish` passed in this series (its `[APPROVED']` run executes a prepared attempt).
- Both E-EXPORT FAILs are in the selection suite's export steps; E-ASK-TWO failed only in the re-run.

`hc-colour`, rc 1:
- PB-E1, PB-E5, PB-E2 and PB-E3 PASS.
- `[PB-E4] FAIL (31977ms): PB-E4: waited 30000ms for a readable history.jsonl in the one store folder; the last reading was {"readFailed":"EBUSY: resource busy or locked, read"}`
- `rc=1 end 2026-11-16T07:36:27Z`

`hc-colour-2` (the one re-run, alone in its own hold), rc 1:
- The same four PASS lines.
- `[PB-E4] FAIL (32050ms): PB-E4: waited 30000ms for a readable history.jsonl in the one store folder; the last reading was {"readFailed":"EBUSY: resource busy or locked, read"}`
- `rc=1 end 2026-11-16T08:25:30Z`

For `colour`:
- The cause shows in the head series' report (6f7e744c): the default non-waiting `npx` shim leaves the app alive, so it keeps the history lock. That run passed 5/5 under `SHIMDIR=shim-wait`.
- The `colour` README entry says PB-E4 needs the waiting shim.
- The brief's `<env>` for `colour` is empty.
- I ran the brief's `<env>` both times and ran no `shim-wait` diagnostic, so I have no run of `colour` at this head that reaches PB-E4's assertion.

**The STOP**
- The hold for `hc-pan-anchor` (hold 31) was requested at 2026-11-16T08:36:32Z. The status read before it, at 08:35:24Z, showed no project line (reading: quiet=False, average=27.0%, peaks-over-25=28).
- The hold waited and ended `MACHINE_ERROR WAIT_TIMEOUT earlier request of <m> waiting, pid <m>`, and the script exited 97 at 08:40:37Z. The command did not run. Its `MACHINE_WAITING` lines are `<m>`.
- Under the brief's stop rule I stopped. I did not retry or route around it, and I made no mutation, so none had to be reverted.

**Other holds**
- Four holds ended exit 95, so their commands did not run, as the brief provides:
  - the `project` hold at 07:12:22Z, which showed 3 holds after the grant;
  - the `residency-harness` hold at 07:25:36Z, 2 holds;
  - the `colour-2` hold at 08:03:11Z (after a first colour-2 attempt that the classifier error stopped before the hold), 3 holds;
  - the `colour-2` hold of 07:39:49Z, also 3 holds.
- Each time I yielded as the brief says, waiting in a loop until a status showed no project line, then 120 s, then a fresh status in its own call, then holding again. Total yielded time was roughly 1.5 hours.
- Every executed run was preceded by a status with no project line, and after its grant the re-read said `holds of this project after the grant: 1`.
- The hold at 08:21:54Z printed `MACHINE_WAITING` and was then granted with count 1.
- Every executed run also had its own pre-hold status read:
  - `s327c-status-<n>.txt`, with the re-read in `s327c-status-<n>b.txt`.
  - The three `colour-2` and `project` reads that showed holds are in `s327c-status-23b.txt`, `-26b`, `-30b` and `-33b`.
- I did not start a heavy run beside another hold. I took no hold-with-run once a re-read showed more than one.
- The `reading` fields ranged from average=17.3% to 73.1% (peaks-over-25 up to 59) across the pre-hold reads.
- Two of the classifier's "no verdict" errors delayed one hold call; they did not change a command.
- Start and end stamps for every hold are in `<S>/s327c-h<n>.start` and `.end`.

**Mutations (step 9).** Not run.
- Prepared only: `<S>/s327c-mutate.mjs` (refuses unless the anchor occurs exactly once) and the specs `<S>/s327c-spec-e3.json` and `<S>/s327c-spec-e4.json`.
- Their anchors occur once each, by Grep: `const next = { ...style, fillMatch: null };` at `StylePanel.tsx:230`, and `for (const transition of transitions) stepQueue.enqueue(dataset, transition);` at `App.tsx:2051`. The script was not run against either file.
- The step 9 diff check (`6f7e744c..6f95993e` on `e2e`, `matchGroups.ts`, `saveProject.ts`, `publish.rs`, `PublishPanel.tsx`) was not shown, so M-PB-E1, M-PB-E5 and M-PB-E2 are unconfirmed as unchanged.
- Important for the re-dispatch: under the brief's empty `<env>`, M-PB-E4 cannot be observed by `colour`, because PB-E4 fails on EBUSY regardless. It needs `SHIMDIR=shim-wait`.

**End state**
- Every process I started was stopped by the suites' own app-down. No background shell or process of mine remains (all background tasks completed).
- The busy check printed `FREE` (`<S>/s327c-final.busy.txt`, rc 0).
- HEAD is 6f95993e37255513bf7f5d78b519bc3a71562fb0 and the porcelain is empty.
- The fixture `cmp` is identical (rc 0).

**Departures and extras**
- The fixtures "before" file was written before step 1.
- I did not read the form whole (departure from "read whole").
- Written in `<S>` and none tracked: `s327c-harvest.sh`, `s327c-wh.sh`, `s327c-yield.sh`, `s327c-yield-long.sh`, `s327c-mutate.mjs`, the two spec JSONs, the harvest files, status files, session-log copies, fixture lists, and the unmodified form copy.
- The scripts only read, copy into `<S>`, or poll the status; none changed a harness file.
- The selection suite writes under `C:\dev\wt\m4b\target\e2e-selection-out` (the worktree's ignored output).
- Two foreground waits were auto-moved to the background by the harness after 180 s. They ended normally.
- No usage figures at hand.
