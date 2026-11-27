*Filed by the custodian: the ADV-2026-11-23-06 grid tester (tester-high, Sonnet), node:operator-sitting-queue@grid358-tester-1, dispatched at 2026-11-23T07:50:52.072Z, its hand-back as it came, extracted from its transcript (18268 bytes, sha256 6255dbaa7c9ff3926791e20436d167fbf8c134ad32720902ad1f25624171afa0), with the masks named here; the advisor ruled on it in ADV-2026-11-23-09 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-09-the-grid-run-step-358-changed-no-further-run-grid358-freed-the-slip-and-one-finding.md`). Masked: 2 `project=` values and 2 `shell=` values of the hold's lines written `<m>`; 2 user-profile paths written `<u>\AppData\Local\` in the report are written `%LOCALAPPDATA%\` here. Its run: Bash 87, Edit 3, Read 15, SubagentHandback 1, Write 2, by unique call ids, 3 calls errored; model claude-sonnet-5-5; from 2026-11-23T07:50:52.210Z to 2026-11-23T08:55:51.372Z by its transcript, the hand-back at 2026-11-23T08:55:51.244Z; 0 calls named the main checkout. One slip is recorded on the ruling's item 8 in the ledger entry of this commit.*

---

**Tag: node:operator-sitting-queue@grid358-tester-1.** DONE. Both series ran to their end; nothing stopped the run. Report time is 08:55Z, well inside the 19:30Z limit. No try was started after 19:00Z (none could have been).

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No model override, no context handoff. I read `.claude/agents/tester.md` from the worktree copy at main's head, not the main checkout.

Evidence folder `<E>` = `C:/dev/spatial-ide-local/evidence/2026-11-23-grid358`. It holds: isolation.txt, the three npm logs, series-1.log, series-2.log, series-1-summary.json, series-2-summary.json, try-<s>-<n>.json and try-<s>-<n>-log-lines.txt for all 20 counted tries, the two session logs copied, met-sequence.json, met-zoom-to-layer.png, met-zoom-in.png, series-1-out/ and series-2-out/ (each with app.log, which came out empty: the detached spawn does not deliver stderr), and smoke-attempt2/, smoke-attempt3/ (script checks, not counted).

## 1. What differs from Step 358's text

The headline: the grid case was met once in 20 counted tries, only in series 2, and the expected text matched where I saw it. The differences below are what the advisor asked for.

1. **`baseSpan` values near neither about 160000 nor about 20800.**
   - Series 1, tries 3, 4, 6, 8, 9: 103331.8 (5 of 10). Step 358.5 puts these under "anything between: the try shows nothing visible". I did not run Zoom to layer on any of them, so "shows nothing visible" is untested here.
   - Series 2, try 2: 82371.5.
   - The met try's value is 33168.2 (series 2, try 6). That is under 50000, but not "about 20800".
   - The other values were 159976 to 159981, which fit "about 160000".
   - Several about-160000 frames came from a thin union, not the full one. For example `ymax` is 1200197, not 1278197. So "about 160000" does not mean the whole filtered union was seen. In series 1, tries 2, 5 and 10 were frames from a thin union (about 193 m tall) with `baseSpan` 159980.8.
2. **Held Enter did not empty the bar in 4 of the 10 series-1 tries (tries 1, 2, 5, 10).**
   - The loop held Enter about every 33 ms for 60 s after the open resolved as admitted (1830 to 1833 presses). The bar still held `/filter id < 1000 OR id >= 3900000`.
   - The line under the bar at the end was: "[P6 placeholder] Not applied: the card id < 1000 OR id >= 3900000 can only be used on its own. Turn it off first."
   - Try 1 had no earlier card, and that line still named the card. My reading is that a first Enter after admission added the card and the later held Enters were refused. Series 1 did not record the card list, so this is inference.
   - All four of these tries had `baseSpan` 159980.x. This is the case the step's last sentence names ("the try has failed in a way the step does not expect"). It is 4 of 10 under CDP-injected Enter, not under OS key repeat.
   - In series 2, with the first Enter delayed and only 1 to 5 presses, the bar emptied in all 10 tries.
3. **Pre-admission note.** Before admission the first Enters showed "That command is not available right now." (series 1, try 1). That matches "each Enter only shows a note".
4. **"While the app checks the file (this can take a while)".**
   - Here the open's promise resolved 323 to 542 ms after the call in every counted try (file just copied, so likely in the OS cache).
   - The first look then ended 0.62 to 1.2 s after the call.
   - So the filter went out after about 0.4 s, and the whole load was over in 3 to 5 s. A cold file or a slower disk may behave differently.
5. **The status line's two sentences.**
   - Met try, after Zoom to layer: "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." This is exactly the step's "If the case shows" sentence.
   - Smoke try, filter applied, not met, after Zoom to layer: "Showing all 101000 features in view". This is the step's "If it does not show" shape.
   - No other sentence was seen at those two points.
6. **358.6 and 358.7 in the met try.** The screenshot shows a thin dotted line at the top edge of the canvas, nothing above it, and a faint line at lower left. This matches the step. Time to still was 315.9 s (5 min 16 s), which matches "several minutes".
7. **358.8 in the met try.** Three wheel notches over the top edge filled the band across the full width, and the status line then read "Showing all 29157 features in view". This matches the step.
8. **358.3 ("a short strip of parcels at the bottom-left of the data") was not compared.** I took no screenshot between the try and Zoom to layer. The status line then read "Showing all 10415 features in view".
9. **Series 1 recorded less than series 2.** It did not record the filter card list. Series 2 did: at admission, tries 2 to 10 still showed one card, "Applied: id < 1000 OR id >= 3900000", left over from the previous try, and the bar still emptied.

## 2. Setup steps 1 to 6

1. `git -C <W> rev-parse HEAD` printed `ec9097e47ed8088f565e2a32e81c42b4ab9dc169`. `git status --porcelain` printed nothing. rc=0 for both.
2. `mkdir -p <E>`: rc=0.
3. The isolation record, whole (`<u>` for the user profile):
   - dir /AL output: "Directory of C:\dev\wt\grid358: File Not Found" and "Directory of C:\dev\wt\grid358\frontends\shell\src-tauri: File Not Found". No junction is listed.
   - `3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5 *D:/wt-data/grid358/slow-filter-scan.parquet`
   - `CARGO_TARGET_DIR=D:/wt-targets/grid358`
   - Per launch, the running shell's executable path, all under `<T>`:

   | Series | Launch (UTC) | Shell process path | Session log read |
   |---|---|---|---|
   | smoke 1 | 07:57:47Z | `D:\wt-targets\grid358\debug\spatial-ide-shell.exe` (pid 73924) | `%LOCALAPPDATA%\dev.spatialide.shell\logs\session-1795421848.log` |
   | smoke 2 | 08:25:22Z | same path | session-1795422493.log |
   | smoke 3 | 08:32:07Z | same path | session-1795422736.log |
   | series 1 | 08:34:25Z | same path | session-1795422875.log |
   | series 2 | 08:42:26Z | same path | session-1795423356.log |

   The file selects the newest `session-<epoch>.log` with epoch at or after the launch minus 5 s, as the residency harness's resolver does.
4. Port check, before setup and before every launch (smoke, series 1, series 2, and the ports-free check after each series): the grep for ports 5180 or 9223 LISTENING printed nothing. After each series the ports were free within 5 s.
5. `df -m /c /d` at setup: C: had 42007 MB free (the floor of 40960 MB held), D: 299466 MB.
   - **During and after the run, C: free ranged 40295 to 41741 MB and was 40935 MB at the end, which is under 40960.** It moved up and down, so it is not all mine. I could not attribute it. Candidates are npm caches, the WebView2 data folder under `%LOCALAPPDATA%\dev.spatialide.shell` (747 MB, shared with any other run of the app), and other users of the machine. I deleted nothing. A sweep of `<T>` and `D:/wt-data/grid358` is the custodian's to do.
6. Three holds, each exit 0:
   - `npm ci` in `<SH>`
   - `npm ci` in `<W>/renderer/bundle-viewer`
   - `npm run build` in `<SH>`

   The tracked tree stayed clean.

## 3. The script and the runs

- **Script:** `<E>/grid358-try.mjs`, sha256 `3ebf5ee0e3b6a7252fc935dbb741df3af58a8fb04d8f9d257ca9295a564eb8ba`. The folder `e2e/out` was confirmed ignored (`git check-ignore` rc=0), and I had to `mkdir` it first because a Write into the missing folder was refused ("path cannot be placed").
  - Series 2 ran this version.
  - **Series 1 ran an earlier version**, sha256 `7123a6276133173d9de7163d710f9684c50d3c4fd7f112cb2612ccba9b401190` (copy in `<E>/series-1-out/`). The only change between them was adding the filter-card readout (`cardsAtAdmission`, `cardsAtEnd`).
  - Earlier edits:
    - After smoke 1 I excluded the once-a-second `producer-pool-poll` lines from the still test. I killed that smoke run and the process tree I had started (launch tree under `<T>`).
    - Before smoke 3 I moved the top-edge find to the frame's own read-back, matched to the screenshot. The command bar's note box overlaps the canvas's top 32 rows, so the screenshot alone found a false edge at the first row.
- **Method.**
  - The suites' own `attachOrLaunch` with `timeoutMs` 2,700,000. A fresh `<T>` meant the first launch built inside that wait: 1181 s.
  - Ctrl+K, then the draft typed without Enter.
  - `window.__SPATIAL_E2E__.openPath(<F>)` started in the page without awaiting it.
  - Series 1: Enter every 33 ms from the open's call. Series 2: from admitted plus the stated delay.
  - Stopping rules as briefed: bar empty, or 60 s after admitted.
  - Still = status bar text, render-trace count and non-poll session-log line count all unchanged for 10 s, cap 15 min.
  - `baseSpan` and `observedUnion` come only from the session log, the last `candidate-grid-frame-established` line.
- **Series 1:**
  - Launch call 08:34:25.7Z, finished 08:40:57.2Z, exit 0, started under hold `-Minutes 150 -MaxWaitMinutes 120`.
  - Hold line: `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m> (commands started from now on inherit it; release when done)`
  - Release line: `MACHINE_RELEASED project=<m> shell=<m> affinity=FF (cores 0-7)`
- **Series 2:** launch call 08:42:26.3Z, finished 08:52:52.9Z, exit 0, same hold and release shape.
- **Other holds, all granted at once with the same line shape:** the three setup holds, and the three smoke holds (smoke 1 killed by me after the build and one try had run, as above; smoke 2 and 3 exit 0). Their `-What` texts were "grid358 tester: npm ci shell", "npm ci viewer", "npm run build shell", "node e2e/out/grid358-try.mjs smoke", and for the series "grid358 tester: node e2e/out/grid358-try.mjs". No exit code 96 to 99 came back.
- **Smoke checks (not counted):** smoke 2 and 3 each did one try (baseSpan 159980.3, not met). Smoke 3 also ran the zoom sequence on that try to test the code. Its screenshots show the "Showing all 101000 features in view" case.
- **Stray process I started and stopped:** a read-only `du` scan of the user's Temp folder, run outside a hold, ran for about 20 minutes. I killed it. Nothing else of mine remains: no shell process under `<T>`, no listener on 5180 or 9223.
- **`git -C <W> status --porcelain` at the end printed nothing.** HEAD is still `ec9097e47ed8088f565e2a32e81c42b4ab9dc169`.

## 4. Each try

Times are ms after the open's call.

**Event names used.**
- **Admission:** no session-log line. Script-side: the in-page open promise resolved.
- **Filter's send:** no session-log line. Script-side: first and last Enter press and the moment the bar was first read empty. The bar empties after the apply outcome, so it is later than the send. In met try 6 the first Enter went at 817 and the bar read empty at 1162.
- **End of the open's own load:** the first `candidate-untiled-terminal` line of the try (stream `initial-untiled-look`). I took the first as the open's and the last as the filter's by order. The log's handles do not label which request each belongs to.
- **End of the filter's load:** the last `candidate-untiled-terminal` line.
- **Also given:** the `candidate-grid-frame-established` line's own time ("frame").
- **Never present:** no `stream-terminal-self-cancelled` line appeared in any try. The "(superseded …)" wording is on some terminal lines and is marked below.

**Series 1** (Enter from the open's call; `baseSpan` / observedUnion, rounded here, exact in the try-*.json files):

| Try | baseSpan | observedUnion | admitted | Enter first..last (count) | bar read empty | open's load end | filter's load end | frame | met |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 159980.3 | x 2600005..2679996, y 1200003..1278197 | 368 | 4..60373 (1830) | never | 652 (superseded) | 2850 | 2852 | no |
| 2 | 159980.8 | x 2600005..2679995, y 1200003..1200197 | 396 | 4..60407 (1831) | never | 1139 | 3116 (superseded) | 1140 | no |
| 3 | 103331.8 | x 2600007..2651673, y 1200003..1200037 | 381 | 3..545 (17) | 809 | 746 (superseded) | 2509 | 747 | no |
| 4 | 103331.8 | same as 3 | 419 | 3..572 (18) | 874 | 697 (superseded) | 2681 | 698 | no |
| 5 | 159980.8 | same as 2 | 462 | 3..60469 (1833) | never | 1048 | 2940 (superseded) | 1049 | no |
| 6 | 103331.8 | same as 3 | 381 | 3..637 (16) | 806 | 849 (superseded) | 2620 | 850 | no |
| 7 | 159980.3 | same as 1 | 518 | 4..633 (20) | 881 | 718 (superseded) | 2791 | 2792 | no |
| 8 | 103331.8 | same as 3 | 380 | 3..497 (16) | 566 | 621 (superseded) | 2465 | 621 | no |
| 9 | 103331.8 | same as 3 | 387 | 4..644 (17) | 898 | 706 (superseded) | 2493 | 707 | no |
| 10 | 159980.8 | same as 2 | 419 | 3..60435 (1832) | never | 1095 | 3211 (superseded) | 1097 | no |

**Series 2** (Enter from admitted plus the delay):

| Try (delay) | baseSpan | observedUnion | admitted | Enter first..last (count) | bar read empty | open's load end | filter's load end | frame | met |
|---|---|---|---|---|---|---|---|---|---|
| 1 (100 ms) | 159980.3 | x 2600005..2679996, y 1200003..1278197 | 419 | 521..596 (2) | 634 | 693 (superseded) | 2732 | 2733 | no |
| 2 (100 ms) | 82371.5 | x 2610487..2651673, y 1200003..1200037 | 405 | 506..651 (2) | 668 | 724 (superseded) | 2802 | 724 | no |
| 3 (200 ms) | 159976.4 | x 2600007..2679995, y 1200003..1200117 | 403 | 617..617 (1) | 1075 | 938 (superseded) | 2922 | 939 | no |
| 4 (200 ms) | 159976.9 | x 2600005..2679993, y 1200083..1200197 | 323 | 538..538 (1) | 999 | 871 | 3986 | 872 | no |
| 5 (400 ms) | 159980.3 | x 2600005..2679996, y 1200003..1278197 | 388 | 801..801 (1) | 992 | 894 (superseded) | 2808 | 2808 | no |
| **6 (400 ms)** | **33168.2** | **x 2663407..2679991, y 1200163..1200197** | 416 | 817..817 (1) | 1162 | 965 | 4455 | 967 | **MET** |
| 7 (800 ms) | 159980.8 | x 2600005..2679996, y 1200003..1278197 | 405 | 1208..1316 (2) | 1356 | 872 | 3506 | 3507 | no |
| 8 (800 ms) | 159980.8 | same as 7 | 445 | 1248..1410 (5) | 1428 | 1210 | 3376 | 3377 | no |
| 9 (1600 ms) | 159980.8 | same as 7 | 475 | 2077..2077 (1) | 3001 | 909 | 4618 | 4618 | no |
| 10 (1600 ms) | 159980.8 | same as 7 | 542 | 2153..2153 (1) | 2998 | 1091 | 4626 | 4626 | no |

Every number above is read from the try-*.json files in `<E>`. The exact `observedUnion` strings (full precision) are in `<E>/series-1-summary.json` and `<E>/series-2-summary.json`.

**Met in how many tries:** series 1: 0 of 10. Series 2: 1 of 10 (try 6, delay 400 ms; both tries at the other delays missed). Overall 1 of 20. Series 2 ran because series 1 had no try under 50000.

**What the met try shows in the log:** the frame line is at 967 ms. It sits at the first stream's terminal, listed current, and was established from a union of only part of the data: x 2663407..2679991, y 1200163..1200197. The filter's own stream ended at 4455 ms and re-established no frame (`framesInWindow` = 1). The first Enter went at 817 ms and the bar emptied at 1162 ms, so the filter's apply was still in flight when the first stream finished. Tries 7 to 10 differ: the first look ended before the filter was sent, and the filter's stream then re-established a full-union frame.

## 5. The met try (series 2, try 6)

- **Zoom to layer:** clicked at 08:44:53Z (epoch 1795423493272 ms).
  - Time from click until the status line stopped changing: 315.9 s. The still detector fired at 326.2 s.
  - Status line before the click: `Showing all 10415 features in view`
  - Status line after: `Filling has finished for this view — some areas were not loaded; pan or zoom to load them.`
  - Whole status-bar text after: that sentence followed by `[P6 placeholder] source watch: watching`, with no space between them.
  - Screenshot: `<E>/met-zoom-to-layer.png`.
- **Top edge:** found on the frame's read-back at strip 12 of 96 from the top, at CSS (553.0, 132.7). The screenshot agrees: the thin line at about y=134, a faint line at about y=657. The orientation test between the two was ambiguous because those two strips are symmetric about the canvas centre. Either orientation gives the same edge.
- **Zoom in:** three wheel notches at that point (the suites' `zoomInOneNotch`, each `motion=true`, `settled=true`).
  - Time from the last notch until the status line stopped changing: 53.1 s.
  - The band filled across the full width of the canvas, with strips 3 to 16 holding 70 to 79 % non-background. Before the zoom only strip 12 held data, at 9 %.
  - Status line after: `Showing all 29157 features in view`
  - Screenshot: `<E>/met-zoom-in.png`.
  - The suites' helper does not fix a notch count. I chose three.

## 6. What this run does not show

- **A hand at the keyboard.** Enter and Ctrl+K were CDP key injection, not WebView2 accelerators or OS key repeat. The 33 ms pace is the script's pacing. A person's first Enter arrives later than the script's first press, and the first held Enter in series 2 came 100 ms to 1.6 s after admission.
- **The native file picker.** The open went through the suites' `openPath` hook with the path.
- **The app as the sitting starts it.** This was a `tauri dev` debug build with the CDP overlay, from main's source without PR 358, on a freshly built `<T>`. The 4M-row fixture was already in the OS cache from my own copy.
- **How often a user meets the case.** The numbers here are 1 of 20 with this script's timing and the machine's speed. They say the case can occur; they do not say a user would meet it.
- **Not tested:** what a `baseSpan` of 103331.8 or 82371.5 looks like after Zoom to layer. The advisor may want it.
- **Not run:** the Step 68 case. Nothing from the main checkout was read or written.

## 7. Four failure classes (tester rule)

- **Interface the product exposes:** the suites' own launch, `openPath` hook, command bar input, Zoom to layer button and wheel helpers. The picker and OS key path are not covered, as stated above.
- **Result claims point to existing files:** every number above is in a try-*.json, series-*.log or session-log copy in `<E>`.
- **Operator-facing lines describe this commit:** this is main `ec9097e4` without PR 358.
- **Measurement tests reach their assertion:** there are no pass/fail assertions. Every counted try reached its record. No claim of a perf measurement is made here.

Model: Sonnet 5.5 (claude-sonnet-5-5).
