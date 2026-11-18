Built: open-first-look-fills-fit-view S4 steps D to F (the harness check, the debug exe, the two base suites), worker (the custodian's filing note, 2026-11-18: the Sonnet worker, model claude-sonnet-5-5, its run 2026-11-18T19:40:50Z to 20:06:37Z by its transcript, Bash 9, none errored; 3615 bytes, sha256 9065c8a9b2928ecdf39728b0c997fee211323fd447f537ded055f11edd1cbbf0; below byte for byte, with the hold lines' two project values written as <m>, with this note and one final newline)
Result: STOP at F. fp-base passed (rc=0). table-base failed (rc=1): PC-E1 did not run because SPATIAL_E2E_FILTER_ZONE_COUNTS was not set. P-S-base is not met. I did not re-run, and I did nothing of S5.

D. `sha256sum -c fl-harness.sha256` printed ten OK. I read fl-e2e-run-suite.sh, fl-e2e-app-up.ps1, fl-e2e-build-exe.sh and fl-e2e-load.sh whole and changed no harness file.

E. Hold: MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:47364 also=<m> ... MACHINE_RELEASED project=<m> shell=bash.exe:47364 affinity=FF (cores 0-7). rc=0. Printed lines: "viewer build rc=0", "shell build rc=0", "exe build rc=0", "Finished `dev` profile [unoptimized + debuginfo] target(s) in 20m 14s", "copied exe". The exe is D:/wt-targets/fl/exes/spatial-ide-shell-fl.exe: 91534848 bytes, mtime 2026-11-18T20:02:54Z, sha256 3be457bc3ee5cecb5b0873a0f37118b625dfc4ecf58362498892a379b78614e5.

F1 fp-base (e2e/filter-panel.mjs). Hold shell=bash.exe:60508 also=<m>, released with the same shell and FF. Load: "load fp-base 20:03:18Z 31,21,31". rc=0, `down.txt` is "killed tree 59500, killed tree 65308, port 9223 free, port 5400 free".
Log first line: `worktree C:/dev/wt/fl head ff3c1465eea3724c3840485febb2a5da05765623 start 2026-11-18T20:03:27Z`.
Steps, byte-copied: 
- `[OPEN] PASS (78ms)`
- `[PANEL'] PASS (7177ms)`
- `[PANELREFUSE'] PASS (3451ms)`
- `[CLEAR'] PASS (3424ms)`
- `[FIND'] PASS (21603ms)`: scan completed, camera landed on the matches, 0.28% non-bg against a 0.08% floor, settled=true
Last line: `rc=0 end 2026-11-18T20:04:17Z`.

F2 table-base (e2e/table.mjs). Hold shell=bash.exe:51112 also=<m>, released with the same shell and FF. Load: "load table-base 20:04:51Z 34,33,33". rc=1, `down.txt` is "killed tree 33932, killed tree 54260, port 9223 free, port 5400 free".
Log first line: `worktree C:/dev/wt/fl head ff3c1465eea3724c3840485febb2a5da05765623 start 2026-11-18T20:05:01Z`.
Steps, byte-copied: 
- `[PC-E1] FAIL (1ms): PC-E1: SPATIAL_E2E_FILTER_ZONE_COUNTS is not set. Give the generator's printed zone_counts (generate_the_filter_fixture), e.g. [517, 498, 480, 505]; the oracle count is not guessed`
- `[PC-E2] PASS (24478ms)`: 3 selected, scope counts as expected
- `[PC-E3] PASS (3376ms)`: first scope reached the 1000-row limit
- `[PC-E4] PASS (12771ms)`: stream cancelled through the client, no other query in 3000ms
Summary: `[table] 3 PASS, 1 FAIL: PC-E1=FAIL PC-E2=PASS PC-E3=PASS PC-E4=PASS`. Last line: `rc=1 end 2026-11-18T20:05:58Z`.
Fixtures were hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5d, slow-filter-scan.parquet 3fd819cb35aa.

My reading, not a new run: the PC-E1 failure is a setup gap, not a timing failure (not I4). The suite needs the generator's printed zone_counts in SPATIAL_E2E_FILTER_ZONE_COUNTS, and neither my brief nor the harness sets it. I did not guess the value. The advisor has to supply the value or change the table step's setup before the row can be re-run.

End state: HEAD = ff3c1465eea3724c3840485febb2a5da05765623 and `git status --porcelain` is empty. The fixture is 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49, unchanged.
Done that no text names: reading fl-e2e-load.sh whole (it is in the harness) and `cat` of the task output files. Both suite runs copied reports into `<H>/out`, which is a named write.
Model: Sonnet 5.5 (claude-sonnet-5-5), no override, one context handoff received (compaction summary).
