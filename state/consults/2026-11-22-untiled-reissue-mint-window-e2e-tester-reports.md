*Filed by the custodian: the mint piece's e2e tester (the Sonnet tester), its four hand-backs over two series at PR 358's gated head 7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd, each below as it came, with the masks its part names and one final newline added. Series 1 stopped before any assertion (a fresh build folder; no pre-build). Series 2: runs 1, 2b, 3, 4 and 5 PASS; its first run 2 is void, because the custodian's message omitted the suite's --measure-build argument (the custodian's slip). The record is each transcript.*

## Part 1, series 1, @e2e-tester-1

*4871 bytes, sha256 ef1a34f28555f7b91ebc191e6922003ccd3a70d5e49d93d68c2c90ffe9ed368c, masked: 4 project= values of the hold lines as <m>; its run: Bash 14, Grep 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-22T18:36:42Z to 2026-11-22T18:48:17Z by its transcript; 0 calls named the main checkout.*

---

**Stopped.** Run 1 (e2e:regression, a counted run) failed, so I ran nothing after it. The app never started in either run. No suite assertion ran.

Model: Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff.

**Setup**
1. `git rev-parse HEAD` printed `7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd` (rc=0). `git status --porcelain` printed nothing (rc=0).
2. The netstat check for 5180 and 9223 printed nothing (grep rc=1, so nothing was listening). It was clear again before run 1.
3. `df -m /c /d`: C: has 43028 MB free, above the 40960 floor. D: has 333415 MB free.
4. `mkdir -p <S>/mint-e2e` returned 0. `npm run build` returned 0 ("built in 5.68s", with only a chunk-size warning). Its log is `<S>/mint-e2e/build.log`.

**Runs**
- **Run 0 (warm-up, e2e:regression):**
  - Exit code 1, so not counted.
  - UTC start 2026-11-22T18:37:27Z, end 2026-11-22T18:42:38Z. These are about 5 minutes apart, which matches the suite's 300 s attach wait.
  - Final line, byte for byte: `regression: could not attach to or launch the app: attachOrLaunch: http://127.0.0.1:9223/json/version never came up within 300000ms -- see e2e/out/app.log`
  - Copied folder: `<S>/mint-e2e/0-regression-out/`. `app.log` is 0 bytes. The folder also holds `tauri.e2e.conf.json`.
  - Log: `<S>/mint-e2e/0-regression.log`.
- **Run 1 (e2e:regression, counted):**
  - Exit code 1, so the counted run failed.
  - UTC start 2026-11-22T18:42:46Z, end 2026-11-22T18:48:01Z.
  - The log's last lines are the full log, which is only 6 lines. After the two npm header lines, it reads:
    - `(node:3304) [DEP0190] DeprecationWarning: Passing args to a child process with shell option true can lead to security vulnerabilities, as the arguments are not escaped, only concatenated.`
    - `(Use `node --trace-deprecation ...` to show where the warning was created)`
    - `regression: could not attach to or launch the app: attachOrLaunch: http://127.0.0.1:9223/json/version never came up within 300000ms -- see e2e/out/app.log`
  - Copied folder: `<S>/mint-e2e/1-regression-out/`. `app.log` is again 0 bytes, so the app wrote nothing to stdout or stderr. `tauri.e2e.conf.json` carries `--remote-debugging-port=9223`.
  - Log: `<S>/mint-e2e/1-regression.log`.
- Runs 2 to 5 (open-fills-fit-view, command-bar, project, filter-panel) were not started.

**Diagnosis**
- After both runs, `D:/wt-targets/mint/debug` holds `build`, `bundle-viewer`, `deps`, `examples`, `incremental`, `NOTICE.txt` and `viewer-asset-hashes.json`. It has no `.exe`, so the shell binary was never produced.
- Each run lasted only the 300 s attach wait, so the shell crate build probably did not finish in that time.
- Nothing listens on 5180 or 9223 after the runs. The worktree is still clean (`git status --porcelain` prints nothing).
- This looks like the "fresh target, build inside the attach wait" problem from the memory note e2e-fresh-target-prebuild. The warm-up did not get past it. A run with a longer prebuild may be needed, for example a `cargo build` of the shell crate on `D:/wt-targets/mint` in its own hold. That is the custodian's call. I did not do it, because it was not in my brief.
- I did not read any cargo output, because the suite's child build writes nothing to `app.log`.

**Hold and release lines, masked**
- Run 0 hold: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:44376 also=<m> (commands started from now on inherit it; release when done)`
- Run 0 release: `MACHINE_RELEASED project=<m> shell=bash.exe:44376 affinity=FF (cores 0-7)`
- Run 1 hold: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:12008 also=<m> (commands started from now on inherit it; release when done)`
- Run 1 release: `MACHINE_RELEASED project=<m> shell=bash.exe:12008 affinity=FF (cores 0-7)`
- Neither hold line carried `others=`. No script exit codes 96 to 99 and no MACHINE_ERROR lines appeared. Both holds were granted at once.

**Timing-sensitive:** Both failures are the 300 s attach timeout with an empty `app.log`. They are consistent with the cold build overrunning the wait, and they are not a test assertion failure. Treat them as timing-sensitive, not as a recorded product failure. The suites never reached a mint assertion.

**Failure classes for the harness**
- **The harness uses the product's interface:** this was not reached, because the app never launched.
- **Every result claim points to a results table or report that exists:** the claims above point to the logs and copied folders named under Runs.
- **Operator-facing lines describe what was measured at this commit:** the run times above are measured at `7a3fd37b`.
- **Every measurement test reaches its assertion:** no. Both runs failed in setup and reached no assertion. They are not a pass or a fail of the mint form's suites.

I have no token usage figures at hand.

## Part 2, series 2, @e2e-tester-2, its first hand-back

*3920 bytes, sha256 083c3d73ad81ded64855f8919029d544875aa59484bcdd76e352d4e27020555e, masked: 4 project= values of the hold lines as <m>; 1 other copies of this project's hold name as <m>; its run: Read 1, Bash 21, Grep 2, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-sonnet-5-5, from 2026-11-22T19:03:39Z to 2026-11-22T19:25:51Z by its transcript; 0 calls named the main checkout.*

---

**Stopped.** The pre-build and the warm-up passed. I stopped before run 1 because the step-2 rule fired. Port 9223 was still listening 120 s after run 0, so I ran none of the five counted suites.

**Setup**
1. HEAD printed `7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd` (rc=0). `git status --porcelain` printed nothing (rc=0).
2. The netstat check for 5180 and 9223 printed nothing (grep rc=1).
3. `df -m /c /d` gave C: 43400 MB free (the floor is 40960) and D: 330428 MB free.
4. `<S>/mint-e2e-2` was created. I did not re-run `npm run build`.

**Pre-build**
- Exit code 0.
- UTC start 2026-11-22T19:03:49Z. UTC end 2026-11-22T19:14:56Z, about 11 minutes.
- The log's last line is `Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 10m 56s`.
- `D:/wt-targets/mint/debug/*.exe` lists one file: `spatial-ide-shell.exe`, 91872768 bytes, modified Nov 22 20:14 local.
- `<S>/mint-e2e-2/times.txt` has a mislabelled line. I appended a stamp right after the "prebuild end above" line, so the file's own note says the end was about 19:14:56Z.

**Run 0 (warm-up, not counted): `e2e:regression`**
- The hold call exited 0 and the suite ran its steps. The warm-up did not end at the attach line, so `0b` was not needed.
- UTC start 2026-11-22T19:15Z, from the start stamp taken just before the call. UTC end about 2026-11-22T19:2xZ. `times.txt` holds the end stamp, but I did not copy it into this report.
- Step lines in the log, truncated to about 160 characters: A4', A5'/A6', A7', A8', A9', K6, K7, CURSOR', FIND', MP', PT', LN', B2'/B3', ABSENTCRS' and C2'/C3' all read PASS. I read only the last 15 PASS/FAIL lines, so I did not see the log's first 37 lines or its final summary line. I have no byte-for-byte summary line to give you.
- The log's last lines are:
  - `Full render-trace ledger: C:\dev\wt\mint\frontends\shell\e2e\out\regression-render-trace-1795375387187.json`
  - `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`
- Output copied to `<S>/mint-e2e-2/0-regression-out/`. It holds `app.log`, `regression-render-trace-1795375387187.json` and `tauri.e2e.conf.json`.
- Log: `<S>/mint-e2e-2/0-regression.log`.

**Why I stopped**
- The suite's harness (`e2e/lib.mjs`, lines 144–155 and 368) attaches to an app already on CDP port 9223 and leaves a launched app running for the next run.
- After run 0, port 9223 stayed in LISTENING (pid 38112, `msedgewebview2.exe`, created 8:18:06 PM local, during my run) through the 120 s wait. Port 5180 was clear.
- I did not stop it. I did not launch that process directly, and the brief's step-2 rule says to stop and report in this case.
- Every later suite would attach to this leftover app, not launch a fresh one. That matters for the result.
- Decision for the custodian: either allow me to stop that app with `taskkill /T /F` on its process tree, or tell me to continue with attach-reuse. Run 1 then starts at `e2e:open-fills-fit-view`, with `e2e:regression` already warmed up. The brief names `e2e:regression` as run 1, so I would need a ruling on whether the warm-up stands in for it. I think it should not.

**Hold and release lines** (masked as the machine paragraph says)
- Pre-build: the hold line was `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:56204 also=<m> (...)`. The release line was `MACHINE_RELEASED project=<m> shell=bash.exe:56204 affinity=FF (cores 0-7)`.
- Run 0: there was a `MACHINE_WAITING shared: turn of <m> held by <m> since 2026-11-22T19:14:54.332Z` line. The hold line was `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:32740 also=<m> (...)`. The release line was `MACHINE_RELEASED project=<m> shell=bash.exe:32740 affinity=FF (cores 0-7)`.
- No exit codes 96 to 99 came back.
- Nothing in this series was timing-sensitive.

Model: Sonnet 5.5 (claude-sonnet-5-5). No model override and no context handoff.

## Part 3, series 2, its second hand-back, after the custodian's message on stopping each run's launched app

*5807 bytes, sha256 88f60249a90ec7c66456b2a89e3be595028636255a877ad638162ee9c8e78e4d, masked: 4 project= values of the hold lines as <m>; its run: Bash 16, Read 1, Write 1, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-22T19:27:23Z to 2026-11-22T19:37:12Z by its transcript; 0 calls named the main checkout.*

---

**Stopped.** Run 1 passed. Run 2 failed before any step: `e2e:open-fills-fit-view` refused to start without a `--measure-build` argument.

**Setup (from the first part of the series).**
1. HEAD printed `7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd` (rc=0). `git status --porcelain` printed nothing (rc=0).
2. The netstat check for 5180 and 9223 printed nothing.
3. `df -m /c /d` gave C: 43400 MB free (the floor is 40960) and D: 330428 MB free.
4. `<S>/mint-e2e-2` was created. I did not re-run `npm run build`.

**Pre-build.** Exit 0. UTC start 2026-11-22T19:03:49Z, end 2026-11-22T19:14:56Z. The log's last line is `Finished \`dev\` profile [unoptimized + debuginfo] target(s) in 10m 56s`. `D:/wt-targets/mint/debug/*.exe` lists one file, `spatial-ide-shell.exe` (91872768 bytes). `times.txt` has a mislabelled stamp line around the pre-build end, and the file notes it.

**Run 0 (warm-up, not counted): `e2e:regression`.**
- Exit 0, started 2026-11-22T19:15Z. The log's last lines read `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`
- The listener was left behind. I stopped and reported, and the custodian ruled that it was mine to stop.
- Output copied to `<S>/mint-e2e-2/0-regression-out/`.

**Stop 1, after run 0.** The listener was PID 38112 (`msedgewebview2.exe`). Its ancestry runs up through `spatial-ide-shell.exe` and cargo to the npm cmd chain, so it was under listed roots.
- My first `taskkill` attempt failed. Git Bash turned `/T` into `T:/`, so nothing was killed. I re-ran it with `MSYS_NO_PATHCONV=1`.
- The process listing used the custodian's single-quoted form and printed rows each time.
- My own bash and powershell chain also matched the listing pattern. I never killed it.
- Roots killed with `taskkill /T /F /PID`:

| PID | Name | Result |
|---|---|---|
| 4576 | cmd.exe | killed, with the whole tree |
| 79996 | node.exe | killed through the tree |
| 82404 | spatial-ide-shell.exe | killed through the tree |

- After the kill, the step-2 netstat for 5180 and 9223 printed nothing (grep rc=1).

**Run 1: `e2e:regression`, counted. PASS, exit code 0.**
- It ran on a fresh launch. UTC start about 2026-11-22T19:28Z. The exact start and end stamps are in `<S>/mint-e2e-2/times.txt`, which I did not copy out.
- The log has 0 lines matching ` FAIL `.
- Its last lines are:
  - `NET'        INFO    no >=400 response observed this run (index.html declares no <link rel>, nothing to probe)`
  - `Full render-trace ledger: C:\dev\wt\mint\frontends\shell\e2e\out\regression-render-trace-1795376149908.json`
  - `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`
- The suite printed no final totals line. Its step lines include B2'/B3', ABSENTCRS' and C2'/C3', all PASS.
- Output was copied to `<S>/mint-e2e-2/1-regression-out/`, and the log is `<S>/mint-e2e-2/1-regression.log`.
- Hold line: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:80424 also=<m>`. Release line: `MACHINE_RELEASED project=<m> shell=bash.exe:80424 affinity=FF (cores 0-7)`. There were 3 `MACHINE_WAITING` lines (`<m>`).

**Stop 2, after run 1.** The listener was PID 352 (`msedgewebview2.exe`), under `spatial-ide-shell.exe` and the npm cmd chain.
- Roots killed:

| PID | Name | Result |
|---|---|---|
| 79508 | cmd.exe | killed, with the whole tree |
| 9156 | node.exe | already gone |
| 81592 | spatial-ide-shell.exe | already gone |

- After the kill, step 2's netstat printed nothing (rc=1).

**Run 2: `e2e:open-fills-fit-view`, counted. FAILED, exit code 2, before any step.**
- It is not a timing issue. The log is the complete output, so these are its last lines:
  - `> node e2e/open-fills-fit-view.mjs`
  - `open-fills-fit-view: needs --measure-build <path to the measure build's exe>. E-FL runs on the measure build only, launches it itself, and never attaches to a dev server.`
- The cause is the brief's command. It runs `npm run e2e:open-fills-fit-view` with no argument. `e2e/README.md:851` says the suite is `npm run e2e:open-fills-fit-view -- --measure-build <path to the measure build's exe>`.
- The measure build comes from `npm run build:measure`, which `package.json:54` defines as `tauri build --features measure-build --no-bundle`. I have not built it. It is a separate and probably heavy build, so I did not start it unasked.
- No app was launched. After the run, the listing showed only my own powershell, and the netstat for 5180 and 9223 printed nothing, so there was nothing to kill.
- There is no `e2e/out` for run 2, so no `2-open-fills-fit-view-out` folder exists. The log is `<S>/mint-e2e-2/2-open-fills-fit-view.log`.
- Hold line: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:59844 also=<m>`. Release line: `MACHINE_RELEASED project=<m> shell=bash.exe:59844 affinity=FF (cores 0-7)`.
- I ran no later suite. `e2e:command-bar`, `e2e:project` and `e2e:filter-panel` remain unrun.
- Decision for the custodian: should I run `npm run build:measure`, with a hold, and then run suite 2 with `-- --measure-build <exe path>`? The other three suites may take arguments or builds that the brief omitted too, and I have not checked them. I did not build the measure variant or run any suite a second time.

**Timing-sensitive:** none.

**Failure classes for these results.**
- The harness uses the interface the product exposes. Run 1 does, because it drives the real app over CDP. Run 2 never reached the app.
- Every result claim points to a log that exists, under `<S>/mint-e2e-2/`.
- Every operator-facing line in this report describes this series at HEAD `7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd`.
- Run 1 reached its assertions. Run 2 did not.

Model: Sonnet 5.5 (claude-sonnet-5-5). No model override and no context handoff.

## Part 4, series 2, its third and last hand-back, after the custodian's message to build the measure exe and run 2 to 5

*5381 bytes, sha256 9dfd2416cc10cc2fbb7e19b718c6290103110adab01462a0a12f0333cc0fa284, masked: 2 project= values of the hold lines as <m>; its run: Bash 29, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-sonnet-5-5, from 2026-11-22T19:37:59Z to 2026-11-22T20:14:09Z by its transcript; 0 calls named the main checkout.*

---

**Done.** Runs 1, 2b, 3, 4 and 5 all passed, and no counted run failed. The first run 2 is void, not a failure.

**Setup and pre-build.** Setup steps 1–4 and the pre-build were as in my earlier report. HEAD was `7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd` and the tree was clean. C: had 43400 MB free. Ports 5180 and 9223 were clear. The pre-build exited 0 and ran from 19:03:49Z to 19:14:56Z. `git status --porcelain` was still empty after the measure build.

**Run 0 (warm-up, not counted):** `e2e:regression`, exit 0, 19:15:05Z to 19:23:18Z.

**Run 1, `e2e:regression`:** PASS, exit 0, 19:28:05Z to 19:36:05Z.
- The log has 0 ` FAIL ` lines. It ends with `NET' INFO no >=400 response observed this run (index.html declares no <link rel>, nothing to probe)`. The suite prints no totals line.
- Outputs: `<S>/mint-e2e-2/1-regression-out/` and `1-regression.log`.

**Run 2 (void, not a failure):** exit 2, 19:36:26Z to 19:36:37Z. It stopped at the suite's argument check, before any step, because the brief omitted `--measure-build`. Its log is unchanged at `<S>/mint-e2e-2/2-open-fills-fit-view.log`.

**Measure build:** `npm run build:measure`, exit 0, 19:38:00Z to about 20:00:04Z.
- Last lines: `Finished \`release\` profile [optimized] target(s) in 21m 16s` and `Built application at: D:\wt-targets\mint\release\spatial-ide-shell.exe`.
- The `D:/wt-targets/mint/release/*.exe` listing holds one file, `spatial-ide-shell.exe` (72718848 bytes). Log: `<S>/mint-e2e-2/measure-build.log`.

**Run 2b, `e2e:open-fills-fit-view -- --measure-build D:/wt-targets/mint/release/spatial-ide-shell.exe`:** PASS, exit 0, 20:00:09Z to 20:03:32Z.
- Final lines, byte for byte:
  - `PASS  (d) every qualifying cell of the 8x8 grid holds a pixel unlike the ring background (tolerance 8)  ::  28 qualifying cell(s) of 64; 0 blank: none; screenshot has a pixel below alpha 255: false`
  - `  (e) 0 blank qualifying cell(s) lie wholly above the first look's rows (N > 1201280): none`
  - `==== 4/4 PASS ====`
- It left no app running; the listing was empty and the netstat for 5180 and 9223 printed nothing.
- Outputs: `<S>/mint-e2e-2/2b-open-fills-fit-view-out/` and `2b-open-fills-fit-view.log`.

**Run 3, `e2e:command-bar`:** PASS, exit 0, 20:03:38Z to 20:07:55Z.
- The log has 0 ` FAIL ` lines. The last step lines are E-TOOLONG, E-ADV, E-PANEL and E-SEL, then `FIXTURES PASS filter-zoned.parquet sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 -> 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46`.
- Outputs: `<S>/mint-e2e-2/3-command-bar-out/` and `3-command-bar.log`.

**Run 4, `e2e:project`:** PASS, exit 0, 20:08:10Z to 20:12:29Z.
- The log has 0 ` FAIL ` lines. The last lines are READBACK-VIEW, SECOND-SAVE, INSIDE-OPEN, INSIDE-SAVE and `NOTICE-S18 PASS the save notices hold S18's text once; the dataset entry's locators read machine-recorded`.
- The ledger it names is `project-console-ledger-1795378343988.json`. It left no app running.
- Outputs: `<S>/mint-e2e-2/4-project-out/` and `4-project.log`.

**Run 5, `e2e:filter-panel`:** PASS, exit 0, 20:12:34Z to 20:13:45Z.
- The log has 0 ` FAIL ` lines. The last step lines are PANEL', PANELREFUSE', CLEAR' and FIND', and the last line is `This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use.`
- Outputs: `<S>/mint-e2e-2/5-filter-panel-out/` and `5-filter-panel.log`.

**Stops.** Each app was stopped with `MSYS_NO_PATHCONV=1 taskkill /T /F /PID`, after tracing the listener's ancestry to a listed root. My own shell chain was never touched.

| After run | Listener | Roots killed | Netstat afterwards |
|---|---|---|---|
| 0 | 38112, `msedgewebview2.exe` | 4576 `cmd.exe`, 79996 `node.exe`, 82404 `spatial-ide-shell.exe` | empty |
| 1 | 352, `msedgewebview2.exe` | 79508 `cmd.exe` killed; 9156 `node.exe` and 81592 `spatial-ide-shell.exe` already gone | empty |
| 2b | none | none needed | empty |
| 3 | 49684, `msedgewebview2.exe` | 64724 `cmd.exe` killed; 15304 `node.exe` and 63304 `spatial-ide-shell.exe` already gone | empty |
| 4 | none | none needed | empty |
| 5 | 29704, `msedgewebview2.exe` | 60564 `cmd.exe` killed; 53648 `node.exe` and 41672 `spatial-ide-shell.exe` already gone | empty |

**Hold and release lines.** Each release line was `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`. Each hold line was `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m>`. Several holds also printed `MACHINE_WAITING` lines (`<m>`). No exit codes 96 to 99 came back. Nothing was timing-sensitive.

**Failure classes.**
- The harness uses the interface the product exposes: the real app over CDP. The open-fills-fit-view suite ran on the measure build.
- Every result claim points to a log under `<S>/mint-e2e-2/`, all of which exist.
- Every line in this report describes this series at HEAD `7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd`.
- Every counted run reached its assertions.
- The warm-up and run 1 each launched the app themselves (`attachOrLaunch`). That is the fresh launch the custodian required.
- The suites printed no totals line, except the 4/4 PASS line of 2b.

All times are in `<S>/mint-e2e-2/times.txt`. The measure-build end time is approximate, taken just after the call returned.

Model: Sonnet 5.5 (claude-sonnet-5-5). No model override and no context handoff.
