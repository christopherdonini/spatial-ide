Built: open-first-look-fills-fit-view S4 table-base-2 and S2's six-file read (ADV-2026-11-18-21 items 8 and 7 (e)), worker (the custodian's filing note, 2026-11-18: the Sonnet worker, model claude-sonnet-5-5, resumed under ADV-2026-11-18-21 items 8 and 7 (e), its run 2026-11-18T20:48:16Z to 20:51:17Z by its transcript, Bash 10, Read 7, none errored; 6607 bytes, sha256 4698cccae2bcd506d08690b3fb624c0e5dcdd0cfcaadd96c3c8fdb9b8dc10c60; below byte for byte, with this note and one final newline)
Result: table-base-2 PASSED (rc=0, 4 of 4 steps). The six files are read whole. No I7. Nothing edited, committed or pushed. HEAD = ff3c1465eea3724c3840485febb2a5da05765623 (E), `git status --porcelain` empty.

TASK 1 table-base-2 at E
- Before the run, sha256 of C:/dev/spatial-ide/target/fixtures/manual-walkthrough/filter-zoned.parquet (the path table.mjs:48 uses) = 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46. That equals the required value.
- One change only: SPATIAL_E2E_FILTER_ZONE_COUNTS='[402, 392, 389, 421]'. Same harness and hold rules. Hold -Minutes 15 -MaxWaitMinutes 60, timeout 1800, background, `-What "open-first-look-fills-fit-view S4: table-base 2"`. Tag table-base-2.
- Hold lines: MACHINE_HOLD shared project=<m> cores=0-7 affinity=FF shell=bash.exe:58492 also=<m> (commands started from now on inherit it; release when done) / MACHINE_RELEASED project=<m> shell=bash.exe:58492 affinity=FF (cores 0-7). Load line: load table-base-2 20:48:49Z 56,30,39. suite-rc=0.
- Log first line: `worktree C:/dev/wt/fl head ff3c1465eea3724c3840485febb2a5da05765623 start 2026-11-18T20:48:59Z`.
- Step lines, byte-copied:
[PC-E1] PASS (8337ms): all 402 features under zone = 'residential', every row residential, 402 distinct ids (oracle [402, 392, 389, 421])
[PC-E2] PASS (22896ms): 3 selected (288, 382, 423); under id <> 423 the second scope lists 288, 382 ("[P6 placeholder] Showing 2 of 3 selected features that pass the filter; 1 could not be checked against it.") and the third still lists 3
[PC-E3] PASS (3576ms): the first scope reached the limit: "[P6 placeholder] Showing the first 1000 features returned, in no declared order; the file may hold more."; 1000 rows
[PC-E4] PASS (13133ms): the liveness line and Cancel showed; the table's stream sh_4e3c8abcda9ea4c886668254294009a6 was cancelled through the client (class-A cancel row ok); the table issued no other query in 3000ms. The engine releasing the stream is not shown by any operator surface
- Fixture line: [table] fixtures hash-identical before and after: filter-zoned.parquet 92ed800ccbcc, 100k-happy-path.parquet fd0c74ab2d5d, slow-filter-scan.parquet 3fd819cb35aa
- Summary: [table] 4 PASS, 0 FAIL: PC-E1=PASS PC-E2=PASS PC-E3=PASS PC-E4=PASS. Last log line: rc=0 end 2026-11-18T20:50:02Z.
- down.txt: killed tree 77840 / killed tree 78644 / port 9223 free / port 5400 free.
- 100k fixture still fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49 (re-checked 20:50:52Z).

TASK 2 six files at E, no hold, Read tool
The Read tool prints no time. Times below are bracketing `date -u` calls in the same parallel batch, so they are approximate.
- Batch 1, about 20:48:46Z to 20:49:01Z: filter.mjs lines 1-293 (whole), filter-panel.mjs lines 1-530 (whole), colour.mjs lines 1-473 (whole).
- Batch 2, about 20:49:01Z to 20:49:24Z: selection.mjs lines 1-640 (tool truncated at 640 of 919), attributes.mjs lines 1-352 (whole), table.mjs lines 1-418 (whole).
- Batch 3, about 20:49:24Z to 20:49:32Z: selection.mjs lines 641-919 (the rest, so whole).
- Form: §5 is at the base commit's copy of the form. Amendment 1 item 2 is read from main 4a267c0d, since the worktree's copy has no Amendment 1.

Assertions whose expected value a filled first look could change, by line at E
I found none that changes an expected value. The amended table's two rows are still the ones that carry the risk. Exposures, all with expected values unchanged:
- filter-panel.mjs, the Amendment 1 row.
  - FIND': settle at line 311, the 180000 ms in-flight wait at lines 340-349, the incompleteText check at 356-361. The floor at 387-391 is unchanged because the fill adds only matching features.
  - Observed at the base (fp-base): FIND' passed in 21603 ms with 0.28% non-bg against the 0.08% floor.
- table.mjs, the Amendment 1 row.
  - PC-E4: the `stream-issued` count of exactly 1 after traceBefore (338-343), the table-query count of +1 (337), and the no-further-query check (361-362). A fill's `stream-issued` lines can fall inside the lines read at 338-343.
  - Observed at the base: PC-E4 passed in 12771 ms (table-base) and 13133 ms (table-base-2).
- filter.mjs, the fraction comparison.
  - Thresholds at 127 (>0.02), 153-154 (<60% of unfiltered) and 160 (>0.002).
  - Both arms gain features, so the ratio holds; observed at the base 4.4% / 16.5% for the same predicate in filter-panel.
- filter-panel.mjs, the same comparison.
  - 162, 175-176, 182, the 2-point tolerance at 240-242, and the 90% recovery at 264-265.
  - Same reasoning. The tolerance compares two fractions taken after the same fit.
- selection.mjs, the resident counts after an open.
  - E-SEL-FILTER: Selected equals n (430), hidden >= 1 after Apply (431), hidden === 0 after Clear (435-436).
  - A fill only makes more features resident. It cannot draw a feature the filter excludes, so >=1 and 0 hold.
  - E-NODRAG / E-ZOOMSEL: outside >= 1 (382) and outside === 0 (394-395).
  - Selection and view-box counts, not residency.
  - E-ZOOMSEL's opaque-pixel floor (396-398) counts alpha 255 only, which is the highlight, not the data fill.
  - buildScene's notch (276-283) is printed, not asserted. A filled map may give hover hits at an earlier notch.
- table.mjs PC-E2.
  - The second scope lists 2 (291-293) and its line contains "2 of 3 selected features" (295).
  - The hidden feature fails the filter, so a fill cannot load it. The other two can only become more resident.
  - PC-E1 (257-262) and PC-E3 (312-313) are table-stream counts, not map residency.
- colour.mjs: no assertion changes (dominant colour 186, 315; settle 80-82; legend count 173-175). Consistent with Amendment 1 item 8.
- attributes.mjs: PA-E1 (186-198) and PA-E3 (276-298) compare against oracle data, not residency. A fill only brings hover hits in earlier.
- selection.mjs others (E-GEN 466-487, E-EXPORT 587-590, E-SCOPE 604, E-ASK 628-665, E-DBLCLICK 698-715): not residency-bound.
- Verdict: no I7. If the advisor reads "resident count after an open" more widely than the above, the closest candidates are selection.mjs lines 431 and 435-436 and table.mjs lines 291-295.

Machine: the table-base-2 hold and release lines are above. The `project=` and `also=` values are written as <m>. No other heavy command. Session facts: model Sonnet 5.5 (claude-sonnet-5-5), no override; one context handoff received (the compaction summary), none produced. Nothing done that no text names, apart from reading the form's text on main via `git show`.
