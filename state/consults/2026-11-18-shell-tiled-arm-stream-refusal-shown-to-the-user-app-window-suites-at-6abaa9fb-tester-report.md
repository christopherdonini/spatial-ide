Series: shell-tiled-arm-stream-refusal-shown-to-the-user S1 app-window suites at 6abaa9fb74de1eee303e3de84f6eafab67df56c6, tester, port-5400 harness (the custodian's filing note, 2026-11-18: the corrected head's run, filed under ADV-2026-11-18-14 item 3; the tester, model claude-sonnet-5-5, 10390 bytes, sha256 aa07f70c579f7233e6a840341ff68bdd4b2b6dd86273692aba7a593497fccf90; its run 2026-11-18T14:02:16.558Z to 14:17:13.570Z by its transcript, Read 4, Bash 24, Write 2, SubagentHandback 1, none errored; below byte for byte, with this note and one final newline)

Result: all five suites ran once and ended rc 0 with no FAIL step. There was no timing failure and no "-2" re-run. No STOP rule fired. Every step matches the series at F, and the fixtures are unchanged.

START STATE
- HEAD 6abaa9fb74de1eee303e3de84f6eafab67df56c6. The porcelain of C:/dev/wt/srf was empty.
- df: C: 47G free, D: 367G free.
- Harness check: eight OK (srf-e2e-run-suite.sh, srf-e2e-load.sh, srf-e2e-app-up.ps1, srf-e2e-app-up-wait.ps1, srf-e2e-app-down.ps1, srf-e2e-busy.ps1, shim/npx.cmd, shim-wait/npx.cmd), rc=0.
- Exe D:/wt-targets/m4b/exes/spatial-ide-shell-m4b.exe: 91555840 bytes, sha256 01073a95deabb32efdc6ac03c3625fd2a5beb22a36ee6c07a5bb92068fb41b9b (as given).
- Diff check (6f7e744c..6abaa9fb over the named paths): printed nothing, rc=0.
- I read srf-e2e-run-suite.sh and srf-e2e-app-up.ps1 whole and changed no harness file. I read the series report whole. I only grepped the form for the Amendment 2 heading; I did not read §5 or Amendment 2 item 7.

SUITE RUNS (no --measure; source-changed under `env -u SPATIAL_E2E_SOURCE_CHANGED_ROUTE`)
| tag | start | end | rc | PASS | FAIL | differs from F |
| s6-regression | 14:03:57Z | 14:09:08Z | 0 | 17 (+1 INFO, NET') | 0 | none (same 17 step names) |
| s6-residency-harness | 14:09:56Z | 14:10:15Z | 0 | exit code only | exit code only | n/a |
| s6-filter | 14:10:48Z | 14:11:02Z | 0 | 3 | 0 | none |
| s6-pan-anchor | 14:11:34Z | 14:14:50Z | 0 | 16 | 0 | none |
| s6-source-changed | 14:15:41Z | 14:16:05Z | 0 | 8 | 0 | none |

Byte-copied lines:
- regression
  - first: "worktree C:/dev/wt/srf head 6abaa9fb74de1eee303e3de84f6eafab67df56c6 start 2026-11-18T14:03:57Z"
  - load: "load s6-regression 14:03:47Z 35,20,48"
  - result lines (first 110 bytes each):
    - [A1'] PASS (2ms): title/header "Spatial IDE" present; "Open GeoParquet…" button present
    - [A3'] PASS (147ms): admitted; DescribeSummary contains the five expected substrings; no refusal panel appears
    - [A4'] PASS (4316ms): overall 7.4% non-bg; 3/9 grid cells > 5%; "Zoom to layer" present (settled=true)
    - [A5'/A6'] PASS (7114ms): pan settled=true, zoom settled=true; no refusal/banner either time; pixels 25.3% non-
    - [A7'] PASS (18787ms): panned off-data (2 drag(s) of 1002px, 0.00% non-bg <= 0.5% threshold), clicked "Zoom to
    - [A8'] PASS (8122ms): 16 alternating pan/zoom gestures, no settle waits between; settled after=true; no refusal
    - [A9'] PASS (13514ms): interior-verified candidate found at zoom notch 4/15 (densest-patch bisection final frac
    - [K6] PASS (59247ms): (i) continuous: hovered "id 21981 @ (2604354.373, 1202780.000)" at zoom-in notch 0, one c
    - [K7] PASS (147255ms): 15/15 discrete zoom-OUT notches from a "Zoom to layer" fit on the candidate arm (readbac
    - [CURSOR'] PASS (429ms): hover cursor "crosshair", mid-drag cursor "grabbing"
    - [FIND'] PASS (27148ms): applied "id > 99900" via the real panel DOM, scan completed on its own; "Zoom to layer
    - [MP'] PASS (3331ms): admitted; DescribeSummary shows the engine's multipolygon encoding and the file's declara
    - [PT'] PASS (3307ms): admitted; DescribeSummary shows the engine's point encoding and the file's declaration; n
    - [LN'] PASS (3310ms): admitted; DescribeSummary shows the engine's linestring encoding and the file's declarati
    - [B2'/B3'] PASS (58ms): refused engine.crs_undeclared; message verbatim; .crs-assertion-form present; no dismis
    - [ABSENTCRS'] PASS (3340ms): refused engine.format_default_contradicted; message verbatim; no button inside the
    - [C2'/C3'] PASS (3373ms): (a) admitted; Identity "session-ordinal:file_row_number — by-construction-within-ge
    - [NET'] INFO (4ms): no >=400 response observed this run (index.html declares no <link rel>, nothing to probe)
  - last two: "This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use." / "rc=0 end 2026-11-18T14:09:08Z"
  - app-down: "killed tree 56632", "killed tree 70964", "port 9223 free", "port 5400 free"
- residency-harness (first line, last two, rc= only)
  - first: "worktree C:/dev/wt/srf head 6abaa9fb74de1eee303e3de84f6eafab67df56c6 start 2026-11-18T14:09:56Z"
  - load: "load s6-residency-harness 14:09:41Z 19,14,12"
  - last two: "This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use." / "rc=0 end 2026-11-18T14:10:15Z"
  - app-down: "killed tree 6168", "killed tree 33996", "port 9223 free", "port 5400 free"
  - No figure it printed is recorded or claimed.
- filter
  - first: "worktree C:/dev/wt/srf head 6abaa9fb74de1eee303e3de84f6eafab67df56c6 start 2026-11-18T14:10:48Z"
  - load: "load s6-filter 14:10:39Z 23,40,6"
  - result lines (first 110 bytes each):
    - [OPEN] PASS (80ms): admitted; window.__SPATIAL_E2E__.queryWithFilter now registered (dataset-scoped)
    - [FILTER'] PASS (7111ms): admitted; unfiltered 16.5% non-bg, filtered 4.4% non-bg (< 60% of unfiltered); filter
    - [REFUSED'] PASS (26ms): refused skp.filter_unknown_column; message verbatim; call resolved (no crash/hang)
  - last two: "This run launched the app; it stays RUNNING on CDP port 9223 for further interactive use." / "rc=0 end 2026-11-18T14:11:02Z"
  - app-down: "killed tree 21056", "killed tree 35200", "port 9223 free", "port 5400 free"
- pan-anchor
  - first: "worktree C:/dev/wt/srf head 6abaa9fb74de1eee303e3de84f6eafab67df56c6 start 2026-11-18T14:11:34Z"
  - load: "load s6-pan-anchor 14:11:24Z 10,9,23"
  - result lines: 16 PASS lines (small and large, each: pixel-spaces-coincide, normal-A dx=±300, paint-vs-event ±, there-and-back-net, recenter-crossing-A dx=±1200). They are saved in `<S>/s6srf-pan-steps.txt`.
  - last two: "==== 16/16 PASS ====" / "rc=0 end 2026-11-18T14:14:50Z"
  - app-down: "killed tree 20552", "killed tree 65228", "port 9223 free", "port 5400 free"
- source-changed
  - first: "worktree C:/dev/wt/srf head 6abaa9fb74de1eee303e3de84f6eafab67df56c6 start 2026-11-18T14:15:41Z"
  - load: "load s6-source-changed 14:15:30Z 15,24,13"
  - result lines (first 110 bytes each):
    - [S1-open] PASS: scratch copy admitted: C:\dev\wt\srf\frontends\shell\e2e\out\source-changed-link\source-change
    - [S2-settle-and-precondition] PASS: resident before the change: 188665 vertices / 10000 features; interior-veri
    - [S3-retarget-junction] PASS: the junction now resolves to C:\dev\wt\srf\frontends\shell\e2e\out\source-changed
    - [S4-issue-one-query] PASS: a viewport_query followed the "pan-beyond-viewport" gesture (17 -> 20 in the render
    - [S5a-status] PASS: status shown, not dismissible; code chip "engine.source_changed"; sentence carries no engin
    - [S5b-residency-cleared] PASS: resident vertices 0, resident features 0
    - [S5c-picks-refused] PASS: hover over the formerly-occupied pixel shows the session-ended refusal, no id
    - fixture-integrity PASS (summary-table line)
  - last two: "This run LAUNCHED the app; it stays running on CDP port 9223." / "rc=0 end 2026-11-18T14:16:05Z"
  - app-down: "killed tree 42064", "killed tree 68832", "port 9223 free", "port 5400 free"
- Session logs are copied to `<S>/s6srf-<tag>.session.log` (five files). The app's stderr named one each: session-1795010642, session-1795011002, session-1795011052, session-1795011099 and session-1795011346 respectively. The app.err.log copies are at `<S>/s6srf-<tag>.app.err.log`.

HOLDS (asked / granted = the load line's time, a few seconds after the command's start / ended). All five were granted at the first call. No 96-99, no WAIT_TIMEOUT, and no MACHINE_WAITING or MACHINE_ERROR lines appeared. Each hold line carried also=<m>, with no others= list. The release lines carried shell=<m>.
- regression: 14:03:34Z / 14:03:47Z / after 14:09:08Z (the hold's command ended after its app-down and release, MACHINE_RELEASED printed). I did not stamp the release time.
- residency-harness: 14:09:26Z / 14:09:41Z / after 14:10:15Z (MACHINE_RELEASED printed)
- filter: 14:10:30Z / 14:10:39Z / after 14:11:02Z (MACHINE_RELEASED printed)
- pan-anchor: 14:11:21Z / 14:11:24Z / after 14:14:50Z (MACHINE_RELEASED printed)
- source-changed: 14:15:16Z / 14:15:30Z / after 14:16:05Z (MACHINE_RELEASED printed)
- For all five, the exact release time is unrecorded; the bound is the run's end plus its app-down and release.

FIXTURES: 34 files, each with size and sha256, in `<S>/s6srf-fix-before.txt` and `<S>/s6srf-fix-after.txt`; `cmp` rc=0. The before file is also byte-identical to `<S>/s5srf-fix-before.txt` (cmp rc=0). None were regenerated and the 5 GB fixture was not used. At the end HEAD = 6abaa9fb74de1eee303e3de84f6eafab67df56c6 and the porcelain is empty (C:/dev/wt/srf).

PROCESSES AT END: netstat shows no LISTEN on 5400 or 9223, only TIME_WAIT sockets. The harness's app-down killed its recorded PIDs after each run. No background shell or process of mine is still running; all my background jobs had exited before this report. Eight node.exe/spatial-ide-shell entries in tasklist are not mine; I did not touch them.

NOT NAMED IN THE BRIEF
- I wrote three helper scripts in `<S>`: s6srf-fix.sh, s6srf-after.sh and s6srf-scripts.txt (a concatenation of the two harness scripts for reading).
- I wrote the output files s6srf-start.txt, s6srf-after-*.txt and s6srf-pan-steps.txt in `<S>`.
- I ran short wait loops (sleep 1-2 s per iteration, hard-bounded) on the log's rc= line or the hold output file.
- source-changed made its scratch parquet under the worktree's ignored e2e/out (fixtures unchanged). Nothing else was written, and no tracked file changed.
- No commit, push, checkout or git stash.

FOUR FAILURE CLASSES (harness)
- The harness used the interface the product exposes: the real exe over CDP and the real DOM, with the window.__SPATIAL_E2E__ hooks the suites already use.
- Every result claim points to a log in `<S>/srf-e2e-h/out/srf-e2e-<tag>.log` or to an `<S>` file.
- Each log's first line names HEAD 6abaa9fb and the start time.
- PASS counts come from the suites' assertion steps, not setup.
- Caveat: the exe was built from 6f7e744c; the diff check shows nothing it is built from differs at H.
- residency-harness is judged by exit code only.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff. Token usage not at hand.
