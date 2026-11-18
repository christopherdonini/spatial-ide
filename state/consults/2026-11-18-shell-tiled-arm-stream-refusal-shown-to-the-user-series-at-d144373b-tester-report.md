Series: shell-tiled-arm-stream-refusal-shown-to-the-user S1 final head at d144373be9e0cc587b26d22bfe87da720917b135, tester, port-5400 harness (the custodian's filing note, 2026-11-18: the one series at the merge request's head, under ADV-2026-11-18-14; the tester, model claude-sonnet-5-5, 13057 bytes, sha256 23a0172847254749840d3dd5f56f5779d40947cfa813e8d53eb3e37eb1af2641; its run 2026-11-18T15:14:48.257Z to 15:36:33.200Z by its transcript, Read 1, Bash 35, Write 2, SubagentHandback 1, none errored; below byte for byte, with the user-profile folder written as <u> in 1 places, with this note and one final newline)

Result: `npm run verify` ran whole once and ended rc 0. All six app-window suites ran once and ended rc 0 with no FAIL step. No timing failure, no "-2" re-run, no STOP rule fired. Every step name and result matches the run at 6abaa9fb, and the fixtures are unchanged.

START STATE
- HEAD d144373be9e0cc587b26d22bfe87da720917b135. Porcelain of C:/dev/wt/srf was empty.
- df: C: 49G free, D: 367G free.
- Harness `sha256sum -c`: eight OK (srf-e2e-run-suite.sh, srf-e2e-load.sh, srf-e2e-app-up.ps1, srf-e2e-app-up-wait.ps1, srf-e2e-app-down.ps1, srf-e2e-busy.ps1, shim/npx.cmd, shim-wait/npx.cmd), rc=0.
- I read srf-e2e-run-suite.sh and srf-e2e-app-up.ps1 whole and changed no harness file. I read `<S>/s6srf-tester-report.md` whole. I read the colour entry in e2e/README.md and the form's §5 and Amendment 4 item 7.
- Exe D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe: 91555840 bytes, sha256 01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b (as given).
- Diff check (6f7e744c..d144373b over the named paths): printed nothing, rc=0.

NPM RUN VERIFY (hold 1, whole, once, not re-run; log `<S>/s7srf-verify.log`)
- rc 0.
- Tally lines: the chain runs vitest once (`npm run test`, `vitest run`): "Test Files  120 passed (120)" and "     Tests  1527 passed (1527)".
- The later node --test commands each printed their own tally, 7 tests and 7 pass in the last. I did not tally the others.
- Last 10 lines, byte-copied:
```
✔ T6 a refusal carrying the could-not-re-read detail, prefix read from the real descriptor.rs, reads FAIL, R (0.2691ms)
✔ T7 a {mtime} refusal beside a refusal of another code reads FAIL, C3 (0.3166ms)
ℹ tests 7
ℹ suites 0
ℹ pass 7
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 15.3441
```

SUITE RUNS (no --measure; source-changed under `env -u SPATIAL_E2E_SOURCE_CHANGED_ROUTE`; colour under `SHIMDIR=shim-wait`)
| tag | start | end | rc | PASS | FAIL | differs from 6abaa9fb |
| s7-regression | 15:21:59Z | 15:27:36Z | 0 | 17 (+1 INFO, NET') | 0 | none (same 17 step names) |
| s7-residency-harness | 15:28:17Z | 15:28:36Z | 0 | exit code only | exit code only | n/a |
| s7-filter | 15:29:05Z | 15:29:19Z | 0 | 3 | 0 | none |
| s7-pan-anchor | 15:29:50Z | 15:33:13Z | 0 | 16 | 0 | none (same 16 names, checked by diff of the first 70 bytes of each line against `<S>/s6srf-pan-steps.txt`) |
| s7-source-changed | 15:33:52Z | 15:34:17Z | 0 | 8 | 0 | none |
| s7-colour | 15:34:52Z | 15:35:24Z | 0 | 5 | 0 | new at this head; not in the 6abaa9fb run |

colour steps: PB-E1 PASS (17242ms), PB-E5 PASS (31ms), PB-E2 PASS (3710ms), PB-E3 PASS (2245ms), PB-E4 PASS (2390ms). The fixture sha256 of its own input was unchanged across the run.

Byte-copied lines (full step lines are in `<H>/out/srf-e2e-<tag>.log`; result lines cut to 110 bytes):
- regression
  - first: "worktree C:/dev/wt/srf head d144373be9e0cc587b26d22bfe87da720917b135 start 2026-11-18T15:21:59Z"
  - load: "load s7-regression 15:21:48Z 59,63,59"
  - steps:
    - [A1'] PASS (9ms): title/header "Spatial IDE" present; "Open GeoParquet…" button present
    - [A3'] PASS (178ms): admitted; DescribeSummary contains the five expected substrings; no refusal panel appears
    - [A4'] PASS (4585ms): overall 7.4% non-bg; 3/9 grid cells > 5%; "Zoom to layer" present (settled=true)
    - [A5'/A6'] PASS (7748ms): pan settled=true, zoom settled=true; no refusal/banner either time; pixels 25.3% non-
    - [A7'] PASS (24513ms): panned off-data (2 drag(s) of 1002px, 0.00% non-bg <= 0.5% threshold), clicked "Zoom to
    - [A8'] PASS (9281ms): 16 alternating pan/zoom gestures, no settle waits between; settled after=true; no refusal
    - [A9'] PASS (14001ms): interior-verified candidate found at zoom notch 4/15 (densest-patch bisection final frac
    - [K6] PASS (65746ms): (i) continuous: hovered "id 21981 @ (2604354.373, 1202780.000)" at zoom-in notch 0, one c
    - [K7] PASS (153222ms): 15/15 discrete zoom-OUT notches from a "Zoom to layer" fit on the candidate arm (readbac
    - [CURSOR'] PASS (477ms): hover cursor "crosshair", mid-drag cursor "grabbing"
    - [FIND'] PASS (29050ms): applied "id > 99900" via the real panel DOM, scan completed on its own; "Zoom to layer
    - [MP'] PASS (3388ms): admitted; DescribeSummary shows the engine's multipolygon encoding and the file's declara
    - [PT'] PASS (3506ms): admitted; DescribeSummary shows the engine's point encoding and the file's declaration; n
    - [LN'] PASS (3321ms): admitted; DescribeSummary shows the engine's linestring encoding and the file's declarati
    - [B2'/B3'] PASS (92ms): refused engine.crs_undeclared; message verbatim; .crs-assertion-form present; no dismis
    - [ABSENTCRS'] PASS (3353ms): refused engine.format_default_contradicted; message verbatim; no button inside the
    - [C2'/C3'] PASS (3402ms): (a) admitted; Identity "session-ordinal:file_row_number — by-construction-within-ge
    - [NET'] INFO (5ms): no >=400 response observed this run (index.html declares no <link rel>, nothing to probe)
  - last two: "This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use." / "rc=0 end 2026-11-18T15:27:36Z"
  - app-down: "killed tree 41724", "killed tree 79444", "port 9223 free", "port 5400 free"
- residency-harness (first line, last two, rc= only; no printed figure recorded or claimed)
  - first: "worktree C:/dev/wt/srf head d144373be9e0cc587b26d22bfe87da720917b135 start 2026-11-18T15:28:17Z"
  - load: "load s7-residency-harness 15:28:03Z 48,23,45"
  - last two: "This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use." / "rc=0 end 2026-11-18T15:28:36Z"
  - app-down: "killed tree 55204", "killed tree 4012", "port 9223 free", "port 5400 free"
- filter
  - first: "worktree C:/dev/wt/srf head d144373be9e0cc587b26d22bfe87da720917b135 start 2026-11-18T15:29:05Z"
  - load: "load s7-filter 15:28:56Z 33,16,25"
  - steps:
    - [OPEN] PASS (74ms): admitted; window.__SPATIAL_E2E__.queryWithFilter now registered (dataset-scoped)
    - [FILTER'] PASS (6940ms): admitted; unfiltered 16.5% non-bg, filtered 4.4% non-bg (< 60% of unfiltered); filter
    - [REFUSED'] PASS (26ms): refused skp.filter_unknown_column; message verbatim; call resolved (no crash/hang)
  - last two: "This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use." / "rc=0 end 2026-11-18T15:29:19Z"
  - app-down: "killed tree 29452", "killed tree 49756", "port 9223 free", "port 5400 free"
- pan-anchor
  - first: "worktree C:/dev/wt/srf head d144373be9e0cc587b26d22bfe87da720917b135 start 2026-11-18T15:29:50Z"
  - load: "load s7-pan-anchor 15:29:41Z 8,14,8"
  - steps: the 16 PASS lines (small and large: pixel-spaces-coincide, normal-A dx=±300, paint-vs-event, there-and-back-net, recenter-crossing-A dx=±1200) are in `<S>/s7srf-pan-steps.txt`.
  - last two: "==== 16/16 PASS ====" / "rc=0 end 2026-11-18T15:33:13Z"
  - app-down: "killed tree 59044", "killed tree 71156", "port 9223 free", "port 5400 free"
- source-changed
  - first: "worktree C:/dev/wt/srf head d144373be9e0cc587b26d22bfe87da720917b135 start 2026-11-18T15:33:52Z"
  - load: "load s7-source-changed 15:33:41Z 23,28,4"
  - steps:
    - [S1-open] PASS: scratch copy admitted: C:\dev\wt\srf\frontends\shell\e2e\out\source-changed-link\source-change
    - [S2-settle-and-precondition] PASS: resident before the change: 188665 vertices / 10000 features; interior-veri
    - [S3-retarget-junction] PASS: the junction now resolves to C:\dev\wt\srf\frontends\shell\e2e\out\source-changed
    - [S4-issue-one-query] PASS: a viewport_query followed the "pan-beyond-viewport" gesture (17 -> 20 in the render
    - [S5a-status] PASS: status shown, not dismissible; code chip "engine.source_changed"; sentence carries no engin
    - [S5b-residency-cleared] PASS: resident vertices 0, resident features 0
    - [S5c-picks-refused] PASS: hover over the formerly-occupied pixel shows the session-ended refusal, no id
    - fixture-integrity           PASS    sha256 unchanged across the run: fd0c74ab2d5df1e1df084802134d2a6678278e764
  - last two: "This run LAUNCHED the app; it stays running on CDP port 9223." / "rc=0 end 2026-11-18T15:34:17Z"
  - app-down: "killed tree 57296", "killed tree 63416", "port 9223 free", "port 5400 free"
- colour
  - first: "worktree C:/dev/wt/srf head d144373be9e0cc587b26d22bfe87da720917b135 start 2026-11-18T15:34:52Z"
  - load: "load s7-colour 15:34:43Z 29,19,19"
  - steps (first 110 bytes):
    - [PB-E1] PASS (17242ms): coloured by zone through the Style tab (4 cases); legend agricultural | civic | industria
    - [PB-E5] PASS (31ms): the saved project.spatial holds the match on zone with 4 cases, equal to the page's style document
    - [PB-E2] PASS (3710ms): bundle <u>/AppData\Local\Temp\spatial-colour-bundle-7VfAho\bundle; (i) the prompt na
    - [PB-E3] PASS (2245ms): fill_color is the literal #4285f4; no legend; the layers lines went from 26 to 27 after the click;
    - [PB-E4] PASS (2390ms): 9 steps; the colour by step records the match on zone (4 cases) with the dependency zone: Utf8; the One colour step after it is the literal #4285f4
  - last two: "Full console ledger: C:\dev\wt\srf\frontends\shell\e2e\out\colour-console-ledger-1795016124334.json" / "rc=0 end 2026-11-18T15:35:24Z"
  - app-down: "killed tree 79472", "killed tree 78032", "port 9223 free", "port 5400 free"
- Session logs copied to `<S>/s7srf-<tag>.session.log` and the app.err.log copies to `<S>/s7srf-<tag>.app.err.log` for all six tags. The app's stderr named session-1795015326 (regression), session-1795015702 (residency-harness), session-1795015750 (filter), session-1795015795 (pan-anchor), session-1795016038 (source-changed) and session-1795016096 (colour).

HOLDS (seven, each granted at the first call; no 96 to 99, no WAIT_TIMEOUT, no MACHINE_WAITING or MACHINE_ERROR line). Each hold line carried also=<m> and no others= list. Each release printed MACHINE_RELEASED with shell=<m>.
- Asked times come from `<S>/s7srf-h<n>.asked`. The granted time is the load line's time (a few seconds after the command's start; for verify I did not stamp one). Release times were not stamped.
- h1 verify: asked 15:16:13Z, granted not stamped, ended after the 15:27 regression ask (the log's rc file is `<S>/s7srf-verify.rc`, verify-rc=0)
- h2 regression: asked 15:21:45Z, granted 15:21:48Z, ended after 15:27:36Z
- h3 residency-harness: asked 15:27:59Z, granted 15:28:03Z, ended after 15:28:36Z
- h4 filter: asked 15:28:53Z, granted 15:28:56Z, ended after 15:29:19Z
- h5 pan-anchor: asked 15:29:38Z, granted 15:29:41Z, ended after 15:33:13Z
- h6 source-changed: asked 15:33:39Z, granted 15:33:41Z, ended after 15:34:17Z
- h7 colour: asked 15:34:40Z, granted 15:34:43Z, ended after 15:35:24Z
- Correction on h1: its ask was 15:16:13Z and h2's ask was 15:21:45Z, so verify ended before 15:21:45Z. My "ended after the 15:27 regression ask" above is wrong. Verify ended before h2 was asked.

FIXTURES: 34 files, each with size and sha256, in `<S>/s7srf-fix-before.txt` and `<S>/s7srf-fix-after.txt`; `cmp` rc=0. The before file is also byte-identical to `<S>/s6srf-fix-before.txt` (cmp rc=0). None regenerated and the 5 GB fixture was not used. At the end HEAD = d144373be9e0cc587b26d22bfe87da720917b135 and the porcelain is empty.

PROCESSES AT END: netstat shows no LISTEN on 5400 or 9223. The harness's app-down killed its recorded PIDs after each run. My hold calls and wait loops have all exited, so no background shell or process of mine is still running and I killed none. The tasklist shows several node.exe and node_repl.exe entries that are not mine, and I did not touch them.

FOUR FAILURE CLASSES (harness)
- The harness used the interface the product exposes: the real exe over CDP and the real DOM, with the `window.__SPATIAL_E2E__` hooks the suites already use.
- Every result claim points to a log in `<H>/out/srf-e2e-<tag>.log` or to an `<S>` file.
- Each log's first line names HEAD d144373b and the start time.
- The PASS counts come from the suites' assertion steps, not setup.
- Caveat: the exe was built from 6f7e744c. The diff check shows nothing it is built from differs at d144373b.
- residency-harness is judged by exit code only.

NOT NAMED IN THE BRIEF
- I wrote the helper scripts `<S>/s7srf-fix.sh` and `<S>/s7srf-after-run.sh`.
- I wrote the output files `<S>/s7srf-fixb.out`, `s7srf-fixa.out`, `s7srf-x-regression.txt`, `s7srf-pan-steps.txt` and `s7srf-verify.rc`.
- I ran bounded wait loops (sleep 2 s per iteration). Some auto-moved to background after 180 s and then completed.
- npm run verify rewrote its ignored build outputs, and source-changed made its scratch parquet under the worktree's ignored e2e/out. The porcelain stayed empty.
- No commit, push, checkout or git stash.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. Token usage not at hand.
