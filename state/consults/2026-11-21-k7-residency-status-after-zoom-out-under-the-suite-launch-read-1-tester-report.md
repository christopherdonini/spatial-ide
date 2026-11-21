*Filed by the custodian: the K7 node's first read (ADV-2026-11-21-03 items 6 to 11), the hand-back of the tester on high effort (claude-sonnet-5-5), 16398 bytes, sha256 e1bbb52b9fd4aa45aa3d38900b8929cb166d40981585e731744589633496c02b, below the rule, with two hold lines' project values written as <m> (the brief's mask). Its calls in the transcript, by unique call ids: Read 11, Bash 70, Grep 6, Write 1, SubagentHandback 1; errored: Grep, Grep, Bash. Its brief was the custodian's, at main 38465949. It goes to the advisor before any fix.*

---

Read: K7 under the suite's own launch, at 38465949

Answer (e): The product ends the fill with the declared sentence but late, 13.9 s and 11.6 s after the last notch in two helper runs (then it stood for 120 s), so the step's 10 s re-read is shorter than the fill under this launch. It does not end it with no status, and the "never" case did not occur. What I could not show is why the fill is about twice as slow here as in the harness's filed runs.

Which answers rest on a run: (b) and (c) for the own launch rest on one suite launch and two helper runs. Reading alone: (a), (d), the harness side of (c), and every claim about the harness.

## Start state and checkout
- Start: HEAD d7f27ef8b41869b2e89fcb849ca20f5244cc9e0b in C:/dev/wt/redact-b, porcelain empty (03:23:05Z).
- Checkout: `git checkout --detach 38465949b56384cbc8174a9b8d16be81cb867d8d`, rc 0.
- The diff stat over frontends, kernel, engine, protocol, renderer, Cargo.toml and Cargo.lock showed 4 files, +266: e2e/README.md (+12), e2e/lib.mjs (+59), e2e/second-open.mjs (+194, new) and shell package.json (+1, the `e2e:second-open` script line). The app's code is unchanged from d7f27ef8.
- No fetch or npm step was run. Ports 5180 and 9223 were free before the launch (netstat, v4 and v6, pattern self-tested on :135).

## Launches and runs (UTC; stamps from `date -u` and file times)
Only one launch was used, of the four allowed.
1. **Launch 1, `npm run e2e:regression` (the suite's own launch):**
   - It ran from about 03:36:24 to 03:44:28Z and ended rc 1.
   - Step lines: 15 PASS, 1 FAIL, 1 INFO.
   - K7 line: `[K7] FAIL (159628ms): K7: expected .residency-status after the last zoom-out notch to be the declared partial-view status verbatim … but it was null (per-notch snapshot at the end of the loop: null)`. This is the fifth own-launch K7 failure, at 38465949 (the four earlier were at 0cc509fe and d7f27ef8).
   - No session log was named. `e2e/out/app.log` was 0 bytes (copy: `<S>/k7r-launch1.app.log`).
   - The app was left running and the helper attached to it.
2. **Helper run l1h1:** 03:47:13.7Z to 03:52:43.2Z, rc 0, on launch 1's app.
3. **Helper run l1h2:** 03:53:56.4Z to 03:59:10.2Z, rc 0, on launch 1's app.
4. **End of use:** at about 04:00Z I killed the `cmd.exe /d /s /c "npx tauri dev …"` launcher, PID 40732, with `taskkill //T //F`. My first try, written `/T /F`, was mangled by Git Bash and killed nothing (rc 1). The second killed the tree: vite, the shell exe, its WebView children and the launchers.

## (a) What differs between the two launches (reading, plus live observation on launch 1)
- **Launcher.**
  - Own launch: `attachOrLaunch` in lib.mjs spawns `npx tauri dev --config e2e/out/tauri.e2e.conf.json`, detached, output to app.log.
  - Harness: the `shim/npx.cmd` stand-in runs `m4a-e2e-app-up.ps1`, which starts vite and the exe by hand.
- **Dev server.**
  - Own launch: `beforeDevCommand` runs `npm run dev` (vite). I observed it listening on `[::1]:5180`, the page at `http://localhost:5180/`.
  - Harness: `node vite.js --host 127.0.0.1 --port 5400 --strictPort`. The exe is told `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`, so the page address is still `http://localhost:5180` but it is served from 127.0.0.1:5400.
- **Exe and its build.**
  - Own launch: `tauri dev` runs `cargo run --no-default-features` (per the earlier reports). I saw `"D:/wt-targets/redact-b\debug\spatial-ide-shell.exe"` as a child of the cargo process.
  - Harness: `m4a-e2e-build-exe.sh` runs plain `cargo build` with `TAURI_CONFIG` set to a JSON overlay, then copies the exe to `exes/spatial-ide-shell-m4a.exe`. It starts it with PowerShell `Start-Process`, working directory src-tauri, output to files.
  - Both are debug profile, and the shell crate defines only the `measure-build` feature, so `--no-default-features` should change nothing for this package. I did not verify that by building.
- **CDP flag.**
  - Own launch: overlay window 1280x800 with `additionalBrowserArgs` = wry's defaults plus `--remote-debugging-port=9223` (copy: `<S>/k7r-launch1.tauri.e2e.conf.json`).
  - Harness: the same window and defaults, plus the host-resolver rule, compiled into the exe. It also sets `WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS`, which lib.mjs documents as ineffective under wry.
- **Environment.** The harness's vite has none of the `TAURI_*` variables `tauri dev` sets for its children. The shell code reads only `import.meta.env.DEV` and `VITE_MEASURE_BUILD`.
- **Window and display** (observed on launch 1, both helper runs):
  - innerWidth 1280, innerHeight 800, outer 1280x800, devicePixelRatio 1, screen 1920x1080.
  - `.working-canvas` rect left 266, top 40, 668x712, drawing buffer 668x712.
  - Browser `Edg/157.0.4341.60` from CDP /json/version. This is the only WebView2 version a log printed.
- **Observed throughput, from the filed reports.**
  - On launch 1 every stream-driven step ran about 2 to 2.5 times slower than the harness's filed run at 51fed8a5 (p4a series). Own launch, launch 1 against that harness run (the harness column names no own-launch run beyond launch 1, so the ranges below are the five own-launch K7 runs' step times):
    - A4' 16.2 s, against 6.5 s.
    - A7' 40.2 s, against 16.1 s.
    - A8' 17.8 s, against 7.1 s.
    - A9' 22.1 s, against 11.6 s.
    - K6 97.8 s, against 55.9 s.
    - FIND' 45.6 s, against 25.3 s.
  - The five own-launch runs gave A4' 12.1 to 16.2 s, A7' 38.2 to 45.8 s, K6 82.9 to 117.2 s and K7 152.5 to 160.1 s.
  - Cause not shown. I cannot separate launcher from machine without a harness launch, and port 5400's approval ended.

## (b) The status line over a longer bound (runs)
- **Both helper runs: the status read null at all 15 notches, then the sentence appeared and stayed.**
  - Run 1: the sentence appeared 13,857 ms after the last notch.
  - Run 2: the sentence appeared 11,565 ms after the last notch.
  - Both runs: null before it, and no flip back during the 120 s poll (about 114 polls each).
  - The queued-tile hook fell 284 to 59 to 0 in run 1 (about 21 tiles a second) and 236 to 8 to 0 in run 2.
  - Run 1 settled at queued=0 at the moment the sentence appeared.
- **Settle per notch.** Settle used quiet 500 ms, bound 10 s, as K7 does.
  - Run 1: settled=false at 15 of 15 notches, each 10.1 to 10.5 s.
  - Run 2: settled=true at notches 3 and 4 only (7,697 ms and 864 ms), false at the other 13.
  - At those two quiet notches the queue still held 282 and 511 tiles, so "trace quiet" is not "fill finished".
- **The suite's own K7 on launch 1** (from the render-trace ledger, a copy of its json):
  - The notch trajectory matches the helper's exactly.
  - From notch 3 on, streams were issued continuously, about 20 per second.
  - 448 streams were issued in the 22 s after notch 15 (the status wait is 10 s), and no pause of 500 ms or more occurs on them until the next "Zoom to layer".
  - It has no poll past 20 s because K7 moves on.
- **Why the late arrival matters.** The status line is silent by design while tiles are tracked (`emitResidencyStatus`: "mid-fill ... absence is honest"). The fill's own drain time follows the queue length (236 to 285 in the helper runs, up to the 512 cap, `MAX_QUEUED_TILES`) divided by the stream rate (about 20 to 21 a second). That puts the sentence at about 11 to 14 s here and at 22 s or more in the suite's own K7.

### Per-notch table, run 1 (l1h1)
`rsEv` = candidate-residency-status events, `truncated` = covering-truncated count.

| notch | settled | trace + | ms | status | queued | rsEv | truncated | zoom |
|---|---|---|---|---|---|---|---|---|
| 1 | F | 481 | 10323 | null | 80 | 26 | 0 | -5.498 |
| 2 | F | 725 | 10437 | null | 154 | 1 | 664 | -6.428 |
| 3 | F | 712 | 10546 | null | 160 | 1 | 4031 | -7.357 |
| 4 | F | 682 | 10145 | null | 175 | 1 | 17038 | -8.287 |
| 5 | F | 667 | 10375 | null | 182 | 1 | 65875 | -9.217 |
| 6 | F | 739 | 10244 | null | 142 | 1 | 243035 | -10.147 |
| 7 | F | 730 | 10391 | null | 150 | 1 | 883847 | -11.077 |
| 8 | F | 642 | 10503 | null | 193 | 1 | 3210354 | -12.007 |
| 9 | F | 606 | 10438 | null | 213 | 1 | 11657395 | -12.937 |
| 10 | F | 623 | 10359 | null | 203 | 1 | 42300894 | -13.867 |
| 11 | F | 630 | 10447 | null | 204 | 1 | 153537665 | -14.797 |
| 12 | F | 506 | 10138 | null | 263 | 1 | 557263053 | -15.727 |
| 13 | F | 529 | 10220 | null | 251 | 1 | 2022486316 | -16.656 |
| 14 | F | 460 | 10133 | null | 285 | 1 | 7340698793 | -17.586 |
| 15 | F | 460 | 10140 | null | 285 | 1 | 26643364895 | -18.516 |

Run 1 first looked like this: pre-state "Showing all 100 features in view", open "Showing all 30443 features in view", Zoom-to-layer settle 37.3 s "Showing all 93186 features in view".

### Per-notch table, run 2 (l1h2)
| notch | settled | trace + | ms | status | queued | truncated |
|---|---|---|---|---|---|---|
| 1 | F | 548 | 10490 | null | 47 | 0 |
| 2 | F | 735 | 10395 | null | 152 | 629 |
| 3 | T | 471 | 7697 | null | 282 | 3994 |
| 4 | T | 3 | 864 | null | 511 | no line |
| 5 | F | 635 | 10279 | null | 197 | 66297 |
| 6 | F | 713 | 10365 | null | 158 | 243474 |
| 7 | F | 744 | 10252 | null | 144 | 884302 |
| 8 | F | 650 | 10408 | null | 189 | 3210804 |
| 9 | F | 631 | 10430 | null | 198 | 11657843 |
| 10 | F | 633 | 10624 | null | 200 | 42301325 |
| 11 | F | 564 | 10380 | null | 233 | 153538097 |
| 12 | F | 599 | 10561 | null | 217 | 557263515 |
| 13 | F | 618 | 10132 | null | 207 | 2022486730 |
| 14 | F | 591 | 10346 | null | 220 | 7340699162 |
| 15 | F | 559 | 10288 | null | 236 | 26643365199 |

Zoom per notch matched run 1 (-5.498 … -18.516). Pre-state was the sentence left by run 1; Zoom-to-layer settle was 32.6 s.

The `inFlight` hook read 0 at every read, even while streams were being issued, so I do not rely on it.

## (c) Whether the fifteen notches end at the same view under both launches
- **Own launch, run:** the end view is the same in the suite's K7 ledger and in both helper runs.
  - Notch 15 is zoom -18.516, target about (0,0), origin (2606339.99, 1202699.997).
  - Fit zoom is -4.568, minus 15 steps of 0.93.
  - residencyGridFrame is level medium, baseSpan 25346.0797, origin (2593667.07, 1187966.98).
  - Window 1280x800, DPR 1, canvas 668x712. `capturePixels` reads 0 non-background of 475616.
- **Harness, reading:**
  - Its conf and exe use the same 1280x800 window and the same wheel and settle code.
  - A canvas rect with left 266 and top 40 appears in a filed harness diagnostic of 2026-10-12.
  - No filed K7 line states the harness's end zoom, canvas size or DPR. The truncated K7 PASS lines carry no view.
- **What needs a harness launch:** the harness's canvas size, fit zoom and end zoom. I read only the files my brief names, and did not read the harness's own run outputs.

## (d) When K7 last passed under the suite's own launch (reading only)
- **The last filed own-launch K7 PASS** is 2026-09-14, 10:31:12Z to 10:36:29Z, at b2c9aace.
  - It is `frontends/shell/e2e/out/find-prime-b2c9aac-2026-09-14.log` in the main checkout (git-ignored, not under state/consults).
  - Line: `[K7] PASS (136814ms) … quiet within its wait bound on 14/15 notches`.
  - The log says "This run launched the app". I take that as the suite's own launch. It does not name the launcher, and the window then was larger (A7' dragged 1920 px).
- **Every K7 result since 2026-10-08 in the filed reports** names the port-5400 harness (ports 9223 and 5400 in their app-down lines, or `shim`). I found no own-launch K7 result between 09-14 and 11-20 in state/consults.
- **The only own-launch K7 results in state/consults** are the five failures: the four named in your brief (the first three at 0cc509fe, the fourth at d7f27ef8) and mine.
- **Merges between b2c9aace and d7f27ef8:**
  - 2,636 first-parent commits, 281 of them merges.
  - 76 touch frontends/shell src, src-tauri, regression.mjs, lib.mjs or package.json (`<S>/k7r-merges-shell.txt`).
  - 26 touch src/residency, canvas or diagnostics (`<S>/k7r-merges-residency.txt`): #341, #335, #330, #327, #311, #307, #295, #253, #246, #243, #220, #217, #207, #203, #188, #185, #182, #127, #112, #97, #100, #90, #86, #79, #78, #64.

### Corrections to the ruling's leads
- **The first K7 failure was not in PR 335's series.** The same null-status failure is filed earlier, all in console-nested regressions on an already-launched app under the shim harness:
  - 2026-10-11, 158101 ms (shell-map-refill-after-resize worker report 3).
  - 2026-11-13, 157821 ms (series at 6649a443).
  - 2026-11-19, 157125 ms (e1fd8495).
  - There is also an unrelated K7 240000 ms timeout on 2026-10-14.
- **"Passed three times" undercounts the harness.** Standalone fresh-launch regression K7 has passed at least 12 times under the shim harness in the filed material: 136.6, 139.1, 147.3, 153.2, 140.2, 133.7 and 130.7 s in the Nov reports, and 145.5, 138.1, 124.0 and 123.4 s in the Oct 9 and 10 custodian solo logs. Those logs show 15/15 and 13/15 quiet notches where legible.
- **The pattern.** Failures sit in two groups: nested console runs under the harness (157 to 158 s), and standalone fresh own launches (152 to 160 s). All the failures took about the same time as a K7 whose every notch ran to its bound.

## Helper, logs and files in `<S>`
- **Helper:** `<S>/k7r-notches.mjs`, sha256 `0315a5431800c869ac222fe6f1ae0f86ddd918f2a8a93c9f8d5acdf567e1fe0e`. It was used twice, with tags l1h1 and l1h2. It attaches only. It imports `attachOrLaunch`, `attachConsole`, `waitForSettle`, `canvasRect` and `doWheel` from the worktree's lib.mjs by file URL, and exits 3 if nothing answers on 9223.
- **Helper results and logs:** `k7r-l1h1.json`, `k7r-l1h1.log`, `k7r-l1h2.json`, `k7r-l1h2.log`.
- **Launch 1 logs:** `k7r-launch1-regression.log` (suite log), `k7r-launch1.app.log` and `k7r-launch1.app.log.final` (both 0 bytes), `k7r-launch1.render-trace.json` (the suite's ledger), `k7r-launch1.tauri.e2e.conf.json`, `k7r-l1-procs.txt` (process command lines).
- **Other files:**
  - `k7r-l1-suite-k7-trace-analysis.txt`
  - `k7r-merges-shell.txt`
  - `k7r-merges-residency.txt`
  - `k7r-k7files.txt`
  - `k7r-checkout.txt`
  - `k7r-kill.txt`
  - the four fixture listings

## Holds
Three shared holds (launch 1, helper 1, helper 2). Each printed one `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:<pid> also=<m> (commands started from now on inherit it; release when done)` line, then `MACHINE_RELEASED project=<m> shell=bash.exe:<pid> affinity=FF (cores 0-7)`. None printed MACHINE_WAITING or MACHINE_ERROR, so each was granted at once. `-Minutes` were 30, 15 and 15. The hold's `-What` text was `k7 read: <what runs>`.

## End state
- HEAD 38465949b56384cbc8174a9b8d16be81cb867d8d, porcelain empty. I made no edit to any tracked file.
- Fixtures: 34 files before and after. `cmp` of the sha256 listings rc 0 and of the size listings rc 0. The sha256 of the before listing is `9fe1f11cfd3afd4afb0fe01277ecdd3fc15bbefe35330b48cb98c905a4a905d7`.
- df: C: 44G free, D: 361G free.
- Ports 5180 and 9223: only a TIME_WAIT entry remains on 9223. No process of mine runs.
- Three `msedgewebview2.exe` (PIDs 32672, 40088, 12528) are not mine and I left them. The 11-18 tester report names the same three as not its own.

## Not done, and departures
- I ran no harness launch, did not read the harness's own run outputs, and did not run the suite a second time (one launch, not four).
- **Reads outside the brief's list, read-only:**
  - `frontends/shell/e2e/out/find-prime-b2c9aac-2026-09-14.log` in the main checkout.
  - `state/drafts` logs and READMEs.
  - governance files, grepped for K7.
  - git history on main.
  - the process list (`wmic`).
- **Broad searches.** An early broad `grep -r` in the main checkout ran in the background and timed out my foreground searches. It finished on its own.
- I wrote no report file.

## Model
claude-sonnet-5-5 (Sonnet 5.5, high effort), no override and no context handoff. I did not stage any measurement for a gate.

## The four failure classes, as they apply to this read
- **Interface:** the suite's own launch and the CDP attach, which is the interface the product exposes.
- **Results:** every claim above points to a file in `<S>` or a filed report.
- **Operator-facing lines:** none.
- **Measurement reaches its assertion:** the suite's K7 reached and failed its assertion. The helper reached its 120 s poll in both runs.
