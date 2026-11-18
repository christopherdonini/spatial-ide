# PR B's series completion at 6f95993e, and one selection run at the first gates' head: the tester-high's report

*Filed byte for byte by the custodian from the subagent transcript, the SubagentHandback input of 2026-11-18T09:02:02.624Z (the agent stopped on 2026-11-16 at the usage limit and was resumed by message, ADV-2026-11-18-01 item 4): 28525 bytes, sha256 c2752f8875a3ba9911045662e5a26196bc9587616846099deb27ed3be92928e0, with one final newline added. It is evidence, not Authority.*

---

Series completion: b1-shell-half PR B at 6f95993e37255513bf7f5d78b519bc3a71562fb0, tester-high, port-5400 harness
Result: findings, selection at the gate head 6f7e744c fails E-EXPORT (and E-ASK-STATEMENT) with the same `unknown-attempt` outcome seen at H, so no other commit was run. All six step-1 runs ended rc 0, recentre-crossing ended rc 0, and both mutations failed where their comments say.

**Model.** The harness reports me as Opus 5.5 (claude-opus-5-5). The tester definition's model line is `sonnet`; this is the tester-high variant, and I made no override of my own. There was no context handoff. No usage figures are at hand.

**Four failure classes, as they apply to this harness**
1. Interface: every suite drives the real debug exe over CDP in WebView2, and recentre-crossing drives the measure exe. The exception is `colour` PB-E2's dev seam `publishPrepareWithDestination`, which the suite names itself.
2. Claim to a record: each run has `<H>/out/m4b-e2e-<tag>.log`, my extract `<S>/s327d-harvest-<tag>.txt` and its session-log copy. Recentre-crossing has `<S>/s327d-recentre-crossing.{log,stamps,rc,app.log,session.log}`.
3. Operator-facing lines: every quoted line is from these runs. `e2e/out/measure-app.log` appends across runs and holds two older session-log lines.
4. Assertion reached: every step in every run reached its assertion. `colour` PB-E4 reached it in hc-colour-3 and both mutation runs (waiting shim). E-EXPORT failed at its execute-outcome assertion.

**Start state** (2026-11-16)
- `git -C C:/dev/spatial-ide fetch -q origin`: rc 0. origin/main is 03e946a8756dc60101f7cf73f5df11d6439fa8ed.
- Worktree at 08:53:11Z: HEAD 6f95993e37255513bf7f5d78b519bc3a71562fb0 on `cut/b1-shell-half-pr-b`, porcelain 0 bytes.
- `df -h`: `C:              476G  427G   49G  90% /c` and `D:              466G   99G  368G  22% /d`.
- Form at origin/main: sha256 `50e3ba3a4662df35d96673cb63e1854ad19ad9a0cbc7aeb8d74b9c879757ecd9`, 2708 lines. I read §9, Amendment 2 item 4, Amendment 12 item 11, Amendment 21 item 5 (b), Amendments 24 to 26, and also 27.
- Harness check, `sha256sum -c`, rc 0:
  - `m4b-e2e-app-down.ps1: OK`
  - `m4b-e2e-app-up-wait.ps1: OK`
  - `m4b-e2e-app-up.ps1: OK`
  - `m4b-e2e-build-exe.sh: OK`
  - `m4b-e2e-busy.ps1: OK`
  - `m4b-e2e-run-suite.sh: OK`
  - `m4b-e2e-tauri.conf.json: OK`
  - `shim-wait/npx.cmd: OK`
  - `shim/npx.cmd: OK`
  - `m4b-e2e-load.sh: OK`
- Diff check (package files, e2e, src-tauri, kernel/src, engine/src, protocol, 6f7e744c..6f95993e): rc 0, printed nothing.
- Exes:
  - `91555840 2026-11-16 03:00:15.424284100 +0100 D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe`, sha256 `01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b`
  - `72476160 2026-11-16 06:44:33.926005200 +0100 D:/wt-targets/m4b-measure/release/spatial-ide-shell.exe`, sha256 `2150a8e90907b6f04641a51c8521fa2cb276d7feae0452a94ac686f54f57e95c`

**Fixtures**
- 34 files before and after. `cmp <S>/s327d-fix-before.txt <S>/s327d-fix-after.txt`: rc 0.
- The before file is also byte-identical to `<S>/s327c-fix-before.txt` (cmp rc 0).
- sha256 values:
  - filter-zoned.parquet: 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
  - 100k-happy-path.parquet: fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
  - attributes-multitype.parquet: afbd4b909a22a416f88002dcbd81edf3117a642141954724eac4cc41c459a1d2
  - attributes-multitype.oracle.json: 29e54fec6fcb583f2c23fe6767390236724d930452660d24b39590c519f03a75
  - slow-filter-scan.parquet: 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5

**Runs.** Times are UTC. The first two rows are 2026-11-16, the rest 2026-11-18. Start and end come from the log's first line and `rc=` line (the stamps for recentre-crossing).

| tag | script | commit | env | rc | start | end | load line | last line / verdict | at 6f7e744c |
|---|---|---|---|---|---|---|---|---|---|
| hc-colour-3 | e2e/colour.mjs | 6f95993e | SHIMDIR=shim-wait | 0 | 08:57:39 | 08:58:15 | `load hc-colour-3 08:57:30Z 12,21,26` | 5 PASS | 1 (empty env); 0 in its shim-wait diagnostic |
| hc-pan-anchor | e2e/pan-anchor.mjs | 6f95993e | | 0 | 09:00:40 | 09:04:22 | `load hc-pan-anchor 09:00:31Z 28,4,19` | `==== 16/16 PASS ====` | 0 |
| hc-source-watch-idle | e2e/source-watch-idle.mjs | 6f95993e | | 0 | 08:32:33 | 08:32:59 | `load hc-source-watch-idle 08:32:23Z 33,18,65` | 8 PASS | 0 |
| hc-source-changed-pre | e2e/source-changed.mjs | 6f95993e | env -u SPATIAL_E2E_SOURCE_CHANGED_ROUTE | 0 | 08:33:37 | 08:34:02 | `load hc-source-changed-pre 08:33:27Z 39,63,25` | S1 to S5c PASS | 0 |
| hc-source-changed-post | e2e/source-changed.mjs | 6f95993e | SPATIAL_E2E_SOURCE_CHANGED_ROUTE=post | 0 | 08:35:16 | 08:35:48 | `load hc-source-changed-post 08:35:05Z 54,60,46` | all PASS incl. S5d | 3 (S5d INCONCLUSIVE) |
| hc-source-changed-reopen | e2e/source-changed.mjs | 6f95993e | SPATIAL_E2E_SOURCE_CHANGED_ROUTE=reopen | 0 | 08:37:25 | 08:38:47 | `load hc-source-changed-reopen 08:37:14Z 71,66,68` | S1 to S5c, R1 to R4 PASS | 0 |
| **hc-selection-at-6f7e744c** | e2e/selection.mjs | **6f7e744c** | | **1** | 08:40:21 | 08:51:05 | `load hc-selection-at-6f7e744c 08:40:11Z 57,66,76` | `[selection] 16 PASS, 2 FAIL` | 0 (18 PASS), at 2026-11-16T00:20 to 00:30Z |
| recentre-crossing | npm run e2e:recentre-crossing, measure exe | 6f95993e | | 0 | 08:52:16 | 08:55:41 | busy check FREE | `==== 6/6 PASS ====` | 0 |
| hc-m-pb-e3 | e2e/colour.mjs + M-PB-E3 | 6f95993e + mutation | SHIMDIR=shim-wait | 1 | 08:56:39 | 08:57:26 | `load hc-m-pb-e3 08:56:27Z 15,23,23` | PB-E3, PB-E4 FAIL | 1 |
| hc-m-pb-e4 | e2e/colour.mjs + M-PB-E4 | 6f95993e + mutation | SHIMDIR=shim-wait | 1 | 08:58:12 | 08:58:46 | `load hc-m-pb-e4 08:58:03Z 39,26,41` | PB-E4 FAIL | 1 |

Common to every run-suite run:
- The busy check at launch printed `FREE`.
- The app-down printed `killed tree <pid>` twice, then `port 9223 free` and `port 5400 free`.
- The `skp.projection_` count in the `app.err.log` copy is 0.
- The app named one session log, and I copied it to `<S>/s327d-<tag>.session.log`.
- First lines begin `worktree C:/dev/wt/m4b head 6f95993e37255513bf7f5d78b519bc3a71562fb0 start …`, except the selection run's, which is `worktree C:/dev/wt/m4b head 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a start 2026-11-18T08:40:21Z`.

**Per run** (long lines cut where marked; user-profile paths masked as `<u>`)

hc-colour-3. Session log session-1794819464.log, 4692 bytes, sha256 08c603c07e12fa50af0e4781e998435d3a75c471079a1e640ce3278110d55831.
- `worktree C:/dev/wt/m4b head 6f95993e37255513bf7f5d78b519bc3a71562fb0 start 2026-11-16T08:57:39Z`
- `[PB-E1] PASS (17243ms): coloured by zone through the Style tab (4 cases); legend agricultural | civic | industrial | residential | [P6 placeholder] No value | [P6 placeholder] Other; the dominant colour under each filter equals its swatch: agricultural 166,206,227,255; civic 31,120,180,255; industrial 178,223,138,255; residential 51,160,44,255; NULL 158,158,158,255`
- `[PB-E5] PASS (42ms): the saved project.spatial holds the match on zone with 4 cases, equal to the page's style document`
- `[PB-E2] PASS (5811ms): bundle <u>\spatial-colour-bundle-HLEpQm\bundle; (i) the prompt names zone; (ii) the dialog shows the prompt's line; (iii) the manifest publishes zone; (iv) style.json carries the match; (v) the viewer draws the legend's colours`
- `[PB-E3] PASS (2613ms): fill_color is the literal #4285f4; no legend; the layers lines went from 26 to 27 after the click; the dominant colour is 66,133,244,255`
- `[PB-E4] PASS (2856ms): 9 steps; the colour by step records the match on zone (4 cases) with the dependency zone: Utf8; the One colour step after it is the literal #4285f4`
- Last two lines: `PB-E4  PASS    9 steps; the colour by step records …` (cut), then `Full console ledger: C:\dev\wt\m4b\frontends\shell\e2e\out\colour-console-ledger-1794819495060.json`
- `rc=0 end 2026-11-16T08:58:15Z`
- App-down: `killed tree 37772`, `killed tree 38508`, `port 9223 free`, `port 5400 free`.

hc-pan-anchor. Session log session-1794819646.log, 156959 bytes, sha256 b515534a788641d3e5b04a24dc8b7f6460754058be1510c6d655b54513cf3ca9, copied on 2026-11-18 (see departures).
- First line `… start 2026-11-16T09:00:40Z`.
- The 16 PASS lines:
  - `PASS  small: pixel-spaces-coincide  ::  client==buffer (328x552 == 328x552), ratio 1.000`
  - `PASS  small: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)`
  - `PASS  small: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)`
  - `PASS  small: paint-vs-event dx=85  ::  painted 83.0 vs deck 83.0 -> 0.01 buffer px (tol 4)`
  - `PASS  small: paint-vs-event dx=-85  ::  painted -83.0 vs deck -83.0 -> -0.01 buffer px (tol 4)`
  - `PASS  small: there-and-back-net  ::  net residual 0.00 buffer px (tol 4)`
  - `PASS  small: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)`
  - `PASS  small: recenter-crossing-A dx=-1200  ::  grab-point residual 0.00 buffer px (tol 4)`
  - `PASS  large: pixel-spaces-coincide  ::  client==buffer (788x812 == 788x812), ratio 1.000`
  - `PASS  large: normal-A dx=300  ::  grab-point residual 0.50 buffer px (tol 4)`
  - `PASS  large: normal-A dx=-300  ::  grab-point residual 0.50 buffer px (tol 4)`
  - `PASS  large: paint-vs-event dx=250  ::  painted 243.9 vs deck 244.0 -> -0.08 buffer px (tol 4)`
  - `PASS  large: paint-vs-event dx=-250  ::  painted -244.0 vs deck -244.0 -> 0.03 buffer px (tol 4)`
  - `PASS  large: there-and-back-net  ::  net residual 1.00 buffer px (tol 4)`
  - `PASS  large: recenter-crossing-A dx=1200  ::  grab-point residual -0.00 buffer px (tol 4)`
  - `PASS  large: recenter-crossing-A dx=-1200  ::  grab-point residual -0.00 buffer px (tol 4)`
- Last two lines: an empty line, then `==== 16/16 PASS ====`.
- `rc=0 end 2026-11-16T09:04:22Z`
- App-down: `killed tree 55612`, `killed tree 67536`, both ports free.

hc-source-watch-idle. Session log session-1794990763.log, 3394 bytes, sha256 2b982ea1b114ff38ce4ac46c783a4fb8550ac0a9b1fd0f14a7fa81870a2d735d.
- First line `… start 2026-11-18T08:32:33Z`.
- `[W1-open] PASS: scratch copy admitted: C:\dev\wt\m4b\frontends\shell\e2e\out\source-watch-idle-scratch.parquet`
- `[W2-settle-and-precondition] PASS: resident before the change: 188665 vertices / 10000 features; interior-verified pixel buffer(86,547) at notch 2 -- 25-pixel neighbourhood entirely non-background; alpha 180 >= 150 (47,94,172,180)`
- `[W3-touch-mtime-while-idle] PASS: modification time moved forward while idle; sha256 unchanged, so no byte was edited`
- `[W4-wait-for-idle-end] PASS: .canvas-session-ended appeared`
- `[F0-no-new-viewport-query] PASS: viewport_query count unchanged at 17 -- the event route ended the session, not a re-issued query`
- `[F1-status] PASS: status shown, not dismissible; code chip "engine.source_changed"; sentence carries no engine. prefix`
- `[F2-residency-cleared] PASS: resident vertices 0, resident features 0`
- `[F3-picks-refused] PASS: hover over the formerly-occupied pixel shows the session-ended refusal, no id`
- Last two lines: `Report: C:\dev\wt\m4b\frontends\shell\e2e\out\source-watch-idle-1794990779117.json`, then `This run LAUNCHED the app and has now torn it down (session.stop()); nothing was left running.`
- `rc=0 end 2026-11-18T08:32:59Z`
- App-down: `killed tree 51136`, `killed tree 48072`, both ports free.

hc-source-changed-pre. Session log session-1794990823.log, 3826 bytes, sha256 ec21f66ca1b178a8f53e2ac78cbba47ca0a62c41600390d016f251762b027b83.
- First line `… start 2026-11-18T08:33:37Z`.
- `[S1-open] PASS: scratch copy admitted: C:\dev\wt\m4b\frontends\shell\e2e\out\source-changed-link\source-changed-scratch.parquet`
- `[S2-settle-and-precondition] PASS: resident before the change: 188665 vertices / 10000 features; …` (cut)
- `[S3-retarget-junction] PASS: the junction now resolves to C:\dev\wt\m4b\frontends\shell\e2e\out\source-changed-targets\b\source-changed-scratch.parquet; both copies still hash to the fixture's sha256, so they differ in mtime only`
- `[S4-issue-one-query] PASS: a viewport_query followed the "pan-beyond-viewport" gesture (17 -> 20 in the render trace); pre-check line: 1794990839567 tile-stream-mint-refused 6:14: engine.source_changed {"detail":"{mtime}"}`
- `[S5a-status] PASS: status shown, not dismissible; code chip "engine.source_changed"; sentence carries no engine. prefix`
- `[S5b-residency-cleared] PASS: resident vertices 0, resident features 0`
- `[S5c-picks-refused] PASS: hover over the formerly-occupied pixel shows the session-ended refusal, no id`
- Last two lines: `Report: C:\dev\wt\m4b\frontends\shell\e2e\out\source-changed-1794990842459.json`, then `This run LAUNCHED the app; it stays running on CDP port 9223.`
- `rc=0 end 2026-11-18T08:34:02Z`
- App-down: `killed tree 68720`, `killed tree 68300`, both ports free.

hc-source-changed-post. Session log session-1794990926.log, 4205 bytes, sha256 90b73b5a79ca57955519e90068b9b92ec9db950974e708ce22a1a4098f9b0a5f.
- First line `… start 2026-11-18T08:35:16Z`.
- S1, S2 PASS as in the pre route.
- `[S4-issue-one-query-and-retarget-on-mint] PASS: a stream-issued line followed the "pan-beyond-viewport" gesture (17 -> 23 in the render trace); the junction was repointed to b on that signal; both copies still hash to the fixture`
- S5a, S5b and S5c PASS, with the same text as in the pre route.
- `[S5d-post-check-route-confirmed] PASS: "tile-session-ended-source-changed" present and no "tile-stream-mint-refused" since this run's own baseline -- a session ended and no tile mint refusal was logged; which kernel route ended the generation is not read by this step`
- The kernel's stderr line (the README's route evidence), from the `app.err.log` copy: `session ended for dataset `ds_9ea09449a510f4fa9943c24cd0dfa965`: the source changed during use ({mtime}); 23 in-flight stream(s) cancelled; post_check_bytes=4032 (bound FOOTER_DESCRIPTOR_MAX_BYTES=8388608)`
- Last two lines: `Report: C:\dev\wt\m4b\frontends\shell\e2e\out\source-changed-1794990948408.json`, then `This run LAUNCHED the app; it stays running on CDP port 9223.`
- `rc=0 end 2026-11-18T08:35:48Z`
- App-down: `killed tree 27324`, `killed tree 54544`, both ports free.
- This route was rc 3 (S5d INCONCLUSIVE) at 6f7e744c. Here S5d found no mint refusal, which is the case the README says passes.

hc-source-changed-reopen. Session log session-1794991055.log, 21656 bytes, sha256 9089b422a0349d4fb131eb5b50116b354409b4f11185428ee05b55cf3d5b61eb.
- First line `… start 2026-11-18T08:37:25Z`.
- S1 to S5c PASS. S4's pre-check line is `1794991080245 tile-stream-mint-refused 7:13: engine.source_changed {"detail":"{mtime}"}`.
- `[R1-failed-reopen-does-not-clear] PASS: openPath refused (code=engine.source, message="source: C:\\dev\\wt\\m4b\\frontends\\shell\\e2e\\out\\source-changed-scratch.parquet.reopen-missing-n8 is not a readable file"); .canvas-session-ended and the hover latch both survived the failed reopen`
- `[R2-successful-reopen-clears-and-identifies] PASS: reopened; .canvas-session-ended cleared; 188665 vertices resident; …` (cut)
- `[R3-zoom-to-layer-clickable-and-effective] PASS: "Zoom to layer" click landed (not intercepted) and produced 1 new view-state line(s)`
- `[R4-second-source-change-ends-the-new-session] PASS: the junction was repointed to a; the session stayed up while idle; the next query's pre-check refused with {mtime}; .canvas-session-ended reproduced on the new generation`
- Last two lines: `Report: C:\dev\wt\m4b\frontends\shell\e2e\out\source-changed-1794991126896.json`, then `This run LAUNCHED the app; it stays running on CDP port 9223.`
- `rc=0 end 2026-11-18T08:38:47Z`
- App-down: `killed tree 79760`, `killed tree 44676`, both ports free.

hc-selection-at-6f7e744c. Session log session-1794991228.log, 94054 bytes, sha256 d3db27781b92119b993028bd8326335173292c3af6cde6da5b0b2420345146ac.
- First line `worktree C:/dev/wt/m4b head 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a start 2026-11-18T08:40:21Z`.
- `[E-SCENE] PASS (17798ms): camera at zoom-in notch 1; features 836, 333`
- `[E-CLICK] PASS (1979ms): …` (cut), `[E-CLICK-FAST] PASS (2368ms): …` (cut)
- `[E-SELECT] PASS (712ms): Selected 1; alpha-255 pixels 129 -> 206`
- `[E-NODRAG] PASS (1361ms): …` (cut)
- `[E-ZOOMSEL] PASS (2117ms): outside 1 -> 0; alpha-255 pixels 129 -> 3968 (floor 1002)`
- `[E-SEL-PAN] PASS (1116ms): Selected 1 after the pan away and after the pan back`
- `[E-SEL-FILTER] PASS (23768ms): Selected 6; hidden 4 under the filter and 0 after Clear`
- `[E-REFUSED] PASS (9527ms): …` (cut), `[E-GEN] PASS (15109ms): …` (cut), `[E-KINDS] PASS (70535ms): …` (cut)
- `[E-EXPORT] FAIL (12064ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 229ms, T 600000ms); prepare-to-execute 0ms`
- `[E-SCOPE] PASS (2694ms): execute refused after the filter changed; no bundle directory, no staging debris; prepare-to-execute 289ms`
- `[E-ASK] PASS (164482ms): the ask showed; Keep exporting left the 100k layer and the export ended success; Cancel and go on admitted filter-zoned, the old close_dataset row followed the outcome (refused); prepare-to-execute 0ms 0ms`
- `[E-ASK-STATEMENT] FAIL (16561ms): execute returned {"status":"unknown-attempt"}; the TTL did not end the attempt (L 0ms, U 13418ms, T 600000ms); prepare-to-execute 0ms`
- `[E-ASK-TWO] PASS (226700ms): two statements, … both manifests on disk; filter-zoned was admitted; prepare-to-execute 0ms 0ms` (cut)
- `[E-STATUS-HEIGHT] PASS (46931ms): the canvas stayed 388 x 712 (A, B, C) and the bar 48 px; …` (cut)
- `[E-DBLCLICK] PASS (17422ms): a double-click zoomed (-0.8155298414577508 -> 1.1844701585422492), inspected nothing in Navigate and selected nothing in Select; a single click inspected id 836`
- Last two lines: `[selection] 16 PASS, 2 FAIL: E-SCENE=PASS … E-EXPORT=FAIL E-SCOPE=PASS E-ASK=PASS E-ASK-STATEMENT=FAIL E-ASK-TWO=PASS E-STATUS-HEIGHT=PASS E-DBLCLICK=PASS` (cut), then `[EXPORT-TODAY] SKIP: phase A's recorded observation (the form's Amendment 4 item 2); after B3 the reopen meets the open-during-export ask, which E-ASK and E-ASK-STATEMENT cover.`
- `rc=1 end 2026-11-18T08:51:05Z`
- App-down: `killed tree 43408`, `killed tree 48740`, both ports free.
- The `app.err.log` copy is 257 bytes: the session-log line, `[spatial-ide-shell] data-plane expected origin (config mirror): http://localhost:5180` and `the advisory source watcher signalled observed-change`.
- The run's audit log, `<S>/s327d-hc-selection-at-6f7e744c.audit.jsonl`, holds four intent/outcome pairs, from 08:43:18Z to 08:50:00Z. Each pair's `source_name` begins `100k-hap`, and their outcomes are success, cancelled, success, success. It holds no line for a filter-zoned attempt.

recentre-crossing (step 3)
- Busy check `<S>/s327d-rc.busy.txt`: `FREE`, rc 0.
- Stamps: `2026-11-18T08:52:16Z` and `2026-11-18T08:55:41Z`. `<S>/s327d-recentre-crossing.rc` holds `rc=0`.
- Case headers and results:
  - `--- case 1: z_fit -3.692532927362801, canvas 668x712 (buffer 668x712), L 300, T 131072, d 3749.395, n1 37, 76 drags ---`
  - `PASS  case 1 (a): W is continuous across each origin change  ::  2 origin change(s), worst jump 0.00 buffer px (tol 4)`
  - `PASS  case 1 (b): |W_end - W_start| <= d per axis  ::  |E| (0.000, 0.000) vs d 3749.395`
  - `REPORT  case 1 (c): the start and end images do not differ  ::  differ: N 35248 -> 127606, C shift 129.55 buffer px`
  - `PASS  case 1 (d): the drawn data's inner edges do not move  ::  do not differ: start box [left 66, right 667, top 258, bottom 357], end box [left 66, right 667, top 0, bottom 357]; K {left, bottom}; moves left 0.00, bottom 0.00 buffer px (tol 4)`
  - `--- case 2: z_fit -3.692532927362801, T 131072, double-click shift 300 px, window below T: (0, 1939.342] ---`
  - `PASS  case 2 (i): no origin change from the double-click to its settle  ::  20 line(s), 0 origin change(s), settled true`
  - `PASS  case 2 (ii): the zoom after the double-click is the zoom before plus 1  ::  zoom -3.692532927362801 -> -2.692532927362801 (+1)`
  - `PASS  case 2 (iii): W is continuous across the origin change at the wheel tick  ::  1 origin change(s), worst jump 0.00 buffer px (tol 4)`
  - `==== 6/6 PASS ====`
  - No FAIL, VOID or fatal line.
- Copies:
  - `<S>/s327d-recentre-crossing.app.log`: 831 bytes, sha256 50584deedf42b41d9e977d7c63d4d639b1aea60e4d8d3f83cc56c40c2e909845. It holds three session-log lines; the last, session-1794991940.log, is this run's.
  - `<S>/s327d-recentre-crossing.session.log`: 137264 bytes, sha256 77a47640aa66b1837394f0a31997154c54c553f633202665705222ef52c4f4a7.

**Step 2: checkouts, and where E-EXPORT's failure starts**
- Before: porcelain 0 bytes.
- `git checkout --detach 6f7e744c…`: rc 0, `HEAD is now at 6f7e744c style: rustfmt on the style agreement test, so that the format check passes`. HEAD 6f7e744cf6a1c1337fdaf62bfdc113c1de531f1a, porcelain 0 bytes.
- Return, before any other step: `git checkout cut/b1-shell-half-pr-b`, rc 0, `Switched to branch 'cut/b1-shell-half-pr-b'`. HEAD 6f95993e37255513bf7f5d78b519bc3a71562fb0, porcelain 0 bytes.
- The run at 6f7e744c failed on E-EXPORT, so under the brief I ran no other commit (9beac0eb, 676553db and 09bba48e not run).
- In one sentence: at 6f7e744c, on the same debug exe, E-EXPORT failed with the same `execute returned {"status":"unknown-attempt"}` outcome it showed twice at H, though the series at 6f7e744c passed it on 2026-11-16, so these runs do not place the start of the failure between the two heads.

**Step 5: mutations**
- Diff check (e2e, matchGroups.ts, saveProject.ts, publish.rs, PublishPanel.tsx, 6f7e744c..6f95993e): rc 0, printed nothing. So M-PB-E1, M-PB-E5, M-PB-E2 and M-PB-E2c stand from the series at 6f7e744c.
- Both mutations used `<S>/s327c-mutate.mjs` (817 bytes, sha256 86d25508eb4c0a68d45dfe29fd07431b2b2aca1a0582f52fac93748f93223928) with its specs, unchanged. Each applies the change its comment names, and the script refuses unless the anchor occurs exactly once. The porcelain was empty before each apply.

M-PB-E3: `node s327c-mutate.mjs s327c-spec-e3.json`, rc 0, `mutated C:/dev/wt/m4b/frontends/shell/src/style/StylePanel.tsx: 1 occurrence replaced`.
- Diff, in `handleOneColour`: `-    const next = { ...style, fillMatch: null };` / `+    const next = { ...style };`
- hc-m-pb-e3 lines:
  - PB-E1, PB-E5 and PB-E2 PASS.
  - `[PB-E3] FAIL (15127ms): PB-E3: waited 15000ms for a style document whose fill_color is a literal; the last reading was {"style_version":1,"layer":{"geometry":"polygon","fill_color":{"match":{"column":"zone",…` (cut)
  - `[PB-E4] FAIL (2479ms): PB-E4: the history holds 1 fillColor steps, expected 2 (the colour by, then One colour): [{"action":"style.set",…` (cut)
  - `rc=1 end 2026-11-18T08:57:26Z`
- Both failures are as the comment records (PB-E3, and PB-E4 also).
- Session log session-1794992204.log, 5252 bytes, sha256 8a4866f0183db4f388a9e03d06cae67cf00b2e51921a389e91f0e9728eb51180. `skp.projection_` count 0. App-down: two trees killed, both ports free.
- Revert: `git checkout -- frontends/shell/src/style/StylePanel.tsx` rc 0, diff 0 bytes, porcelain 0. The file's sha256 is 41ffe1d5907265f7930d4b6d9dd1f3edf22309e0037bdd6dd047afa636072d38, equal to `git show H:` of the file.

M-PB-E4: `node s327c-mutate.mjs s327c-spec-e4.json`, rc 0, `mutated C:/dev/wt/m4b/frontends/shell/src/App.tsx: 1 occurrence replaced`.
- Diff, in `handleStyleCommit`: `-    for (const transition of transitions) stepQueue.enqueue(dataset, transition);` / `+    for (const transition of transitions) stepQueue.enqueue(dataset, transition.params.property === "fillColor" ? { ...transition, params: { ...transition.params, value: next.fillColor } } : transition);`
- hc-m-pb-e4 lines:
  - PB-E1, PB-E5, PB-E2 and PB-E3 PASS.
  - `[PB-E4] FAIL (2433ms): PB-E4: the colour by step's value reads "#4285f4", expected the match`
  - `rc=1 end 2026-11-18T08:58:46Z`
- This is the failure the comment records.
- Session log session-1794992297.log, 4524 bytes, sha256 5538411d7662cf5648b3961000f4539ed7dc859709345ce1d032ef5e84b97b90. `skp.projection_` count 0. App-down: two trees killed, both ports free.
- Revert: `git checkout -- frontends/shell/src/App.tsx` rc 0, diff 0 bytes, porcelain 0. The file's sha256 is 8d0ca63660a863cc6ffcede89eb0ff065fe3d6e14b13211ac22499e2b7401515, equal to `git show H:` of the file.

There is no coverage finding.

**Failures and re-runs.** No step-1 run failed, so nothing was re-run. The only failure outside the mutations is the step-2 selection run (lines above). By the brief it is not re-run.

**Holds.** Every hold was granted with no exit code 95 to 99 and no refusal. "Granted" here is the load line's stamp, the first command after the grant; the script prints no grant time. Ended is the run's `rc=` line, and release follows. Every hold line was `MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=… also=<m> …`, each followed by `MACHINE_RELEASED project=<m> …`.

| n | what | asked | granted | ended | waiting lines |
|---|---|---|---|---|---|
| 1 | hc-colour-3 | 2026-11-16T08:54:18Z | 08:57:30Z | 08:58:15Z | 3 × MACHINE_WAITING `<m>` |
| 2 | hc-pan-anchor | 2026-11-16T08:58:45Z | 09:00:31Z | 09:04:22Z | 2 × MACHINE_WAITING `<m>` |
| 3 | hc-source-watch-idle | 2026-11-18T08:32:11Z | 08:32:23Z | 08:32:59Z | none |
| 4 | hc-source-changed-pre | 08:33:18Z | 08:33:27Z | 08:34:02Z | none |
| 5 | hc-source-changed-post | 08:34:54Z | 08:35:05Z | 08:35:48Z | none |
| 6 | hc-source-changed-reopen | 08:37:01Z | 08:37:14Z | 08:38:47Z | none |
| 7 | hc-selection-at-6f7e744c | 08:39:58Z | 08:40:11Z | 08:51:05Z | none |
| 8 | recentre-crossing | 08:52:01Z | 08:52:16Z (stamp) | 08:55:41Z | none |
| 9 | hc-m-pb-e3 | 08:56:15Z | 08:56:27Z | 08:57:26Z | none |
| 10 | hc-m-pb-e4 | 08:57:52Z | 08:58:03Z | 08:58:46Z | none |

**End state** (2026-11-18T08:59:44Z)
- No process I started is running. Every app tree was stopped by run-suite's app-down (by its PIDs), and `m4b-e2e-app-pids.txt` is absent.
- Every background task I started has completed and notified, including the 2026-11-16 wait loop, which ended `found after 327s at 2026-11-16T09:04:25Z`. So I killed nothing.
- Busy check `<S>/s327d-final.busy.txt`: `FREE`, rc 0.
- HEAD is 6f95993e37255513bf7f5d78b519bc3a71562fb0 on `cut/b1-shell-half-pr-b`, porcelain 0 bytes.

**Departures and extras**
- **The 2026-11-16 stop.**
  - My calls show hold 2 asked at 08:58:45Z, then a foreground wait loop for pan-anchor's `rc=` line. The harness moved that loop to the background after 180 s.
  - My run then stopped on the usage limit, by the custodian's message. The pan-anchor run ended at 09:04:22Z inside its hold, and the loop at 09:04:25Z.
  - My next call was at 2026-11-18T08:31:35Z. There I checked HEAD, the porcelain (0 bytes), the busy check (`FREE`, `<S>/s327d-resume.busy.txt`), the out folder's hc-colour-3 and hc-pan-anchor files and hold 2's output.
  - So pan-anchor's harvest and its session-log copy came about 47 hours after the run, not right after it. The session log was still there and was copied.
  - The second half of the series (holds 3 to 10) ran on 2026-11-18.
- I read `.claude/agents/tester.md` in the same call as the brief, as the system instruction required, rather than strictly after the brief.
- In the recentre-crossing hold, the after-stamp and the rc file are written after `rc=$?` and before the release, inside the same call.
- Scripts I wrote with the Write tool:
  - `<S>/s327d-fix.sh`: fixture listing.
  - `<S>/s327d-harvest.sh`: read-only extract plus the session-log copy.
  - `<S>/s327d-await.sh`: a wait loop of 5 s per turn with a 590 s hard limit. Used once, for pan-anchor.
- Other `<S>/s327d-*` files:
  - start and checkout records
  - `s327d-form.md`, `s327d-form-heads.txt`
  - the harvests, the session-log copies and the audit logs the runs wrote
  - `s327d-m3.diff`, `s327d-m4.diff`, the revert diffs, and `s327d-m3-H.tsx` / `s327d-m4-H.tsx` (H's blobs, for the hash comparison)
- I read the selection run's audit log (above) and the post route's `app.err.log` copy, which the brief does not name.
- run-suite copies files newer than the launch, including the scratch parquet copies, into `<H>/out/` as `rep.*`. That is the harness's own behaviour.
- The selection suite wrote bundles under `C:\dev\wt\m4b\target\e2e-selection-out` (ignored).
- In the results, masked values are written `<m>`, and user-profile paths `<u>` or the session-log file name alone.
