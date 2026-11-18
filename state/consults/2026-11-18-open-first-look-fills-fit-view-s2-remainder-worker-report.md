Built: open-first-look-fills-fit-view S2's remainder (step B), worker (the custodian's filing note, 2026-11-18: the Sonnet worker, model claude-sonnet-5-5, resumed 2026-11-18T19:35:33Z, its report at 19:40:16Z by its transcript; 7515 bytes, sha256 30b3b76dc4326a0490c259a4c4f86106f8f951e99d22d7956df84c5548e7c2d7; below byte for byte; one span masked, each marked where it stood, with this note and one final newline)
Result: step B is done now, from a whole read of both files. I found no assertion in either file whose expected value changes, so I7 is not hit. One exposure sits outside the table's reach (R8, item 1). My first reading was not whole (item 2) and my last report omitted B entirely. Nothing was written, committed, built or held in this round.

1. Assertions a filled first look could change. Lines are at B (349cec82). Both files are byte-identical at HEAD ff3c1465: `git diff --stat 349cec82 HEAD -- frontends/shell/e2e` shows only the new open-fills-fit-view.mjs. Paths are under `frontends/shell/e2e/`. The table is §5 as widened by Amendment 1 item 2, which adds only the FIND' and PC-E4 rows.
regression.mjs:
- R1. Lines 496-503 (A4'): overall non-background >2%, at least 3 of 9 cells >5%. A fill only adds features and both are lower bounds. Value changes, verdict does not. Covered by the `regression.mjs` row ("more filled", no).
- R2. Lines 532, 564 (`OFF_DATA_THRESHOLD` 0.005), 607 (A7'): A5'/A6', the A7' off-data pan and the A7' >2% after Zoom to layer. Lower bounds, or a pan that leaves the data. A fill resides in the fit view. Covered by the same row, which also names the anchor growth of item 61.
- R3. Lines 756-889 (A9'), 1285-1721 (K6): hover and pick contracts. The notch at which a hover answers can move. The assertions are keyed to camera zoom, not to residency. The numbers at 886-888 (43%, notch 4) are comment only. Covered by the same row.
- R4. Lines 1297 and 1559-1568 (K6 refusal text, marker sighting): zoom-based, with the Zoom to layer fit only getting wider. Covered by the same row.
- R5. Lines 1827-1833 (K7 verbatim partial-status text after 15 notches): the plan is truncated far past `MAX_COVERING_TILES`, so the open's plan is not in play. Covered, no.
- R6. Lines 2237 and 2314 (FIND' ratio comparisons), 2279-2293 (status sentence), 2187-2196 (scan liveness gone, 120 s). This is an Apply on the 100k fixture with `id > 99900`. Both ratios compare images of the same 100 rows, and I reasoned (not observed) that the fill returns the same rows. The status is read after the zoom-out plan. The 120 s scan wait gets longer by the fill's filtered scans, which is I6 territory and is not a changed value. The `regression.mjs` row does not name this Apply, but it holds no changed value. The table's filter and filter-panel row ("a fraction comparison is re-read") is the one that is analogous.
- R7. Lines 2743-2757 (the whole-run `too_many_pending_streams` sweep) now also spans each open's fill streams. The manager caps in-flight streams, so I expect no change. Covered, no.
- R8. Lines 446-459 (PT') and 471-484 (LN'), assertions at 457 and 482 (`assertNoRefusalOrBanner`). PT' and LN' open fixtures with a covering (`kernel/tests/manual_walkthrough_fixtures.rs:247,356`, `with_covering_bbox: true`). A fill issues bboxed tile queries at the open, which no step of this file issued before. The expected value (no refusal) does not change, and I do not claim I7. It is a new product path under a no-refusal assertion, and the table's `regression.mjs` row says "no" by reading only. MP' (421-434) loads F-1 with no covering (`manual_walkthrough_fixtures.rs:222`). A viewport query there refuses, so the first look has no `Completed` terminal and no fill is planned (form U-FL2 (c)). The form's file is untracked at B but is on main at 4a267c0d; I read it from main.
residency-harness.mjs:
- H1. Lines 1318, 1352-1366, 3174-3176 (every step's settle bound and the `unmeasured` exit code), plus 2881-2894 (`open-drain` demoted if `firstPixelReason != null`). The settle now includes the fill's streams (I6 if a bound is hit). Covered by the row ("`open-drain` drains the fill too", I5).
- H2. Lines 2108-2114 and 2773 (the identity guard: a multiset of `viewport_query`, `stream-issued` and `batch` lines must match across OFF, ON, ON, OFF for the candidate arm). `identity-open` now carries the fill's lines in all four runs. The `viewport_query` bbox in a line depends on the shown view at the terminal. Covered by the row (`identity-open`, I5). The baseline arm has no fill.
- H3. Lines 1743-1768 and 903-1011 (the entry-44 in-viewport eviction check at `zoom-out-1`). The tiles resident at that step change, so the "exercised" state can change. The rule is unchanged, so the verdict is not. No table row names it. Not an assertion change.
- H4. Lines 1353 (a pan must realize displacement), 1776-1782 (`traceDefect`, report only), 1798-1801 and 3041 (smoke hover must resolve an id), 2156 and 2134 (printed warnings). The first is unaffected. The `traceDefect` marker and the printed warnings are recorded values, not verdicts. The hover has more resident features after a fill. No change in verdict.
- H5. Lines 2701, 2790, 3090 (arm readback, control invariant, seam call count) and the fixture hash are unrelated to the fill.
Verdict: I7 is not hit. R8 is the one exposure. A lone `.canvas-refusal` there would show as an I8-type failure in a regression run, which this piece does not schedule.

2. Reading, with the calls (UTC from the transcript):
- Before: regression.mjs was NOT read whole. I read 380-1079 whole (Read at 19:00:10Z, offset 380, limit 700). I read non-comment lines only for 1-379 (cut at 170 columns, `head -230`, 19:01:32Z) and for 1080-2808 (19:00:18Z; the same lines saved to `fl1b-reg.txt` and read at 19:00:34Z-19:00:51Z, cut at 200 columns). Comment-only lines outside 380-1079 were not read.
- Before: residency-harness.mjs was NOT read whole. I read non-comment lines only (`fl1b-rh.txt`, built 19:00:33Z and read 19:01:03Z-19:01:14Z, cut at 200 columns). Comments were not read.
- Now: both are read whole. regression.mjs by four Reads at 19:36:28Z, 19:36:32Z, 19:36:39Z and 19:36:46Z (offsets 1, 701, 1401, 2101; 1-2808). residency-harness.mjs by four Reads at 19:37:51Z, 19:37:55Z, 19:38:00Z and 19:38:07Z (1-800, 801-1650, 1651-2500, 2501-3278).

3. `package.json` suites (e2e scripts; `pan-anchor.mjs` is not run by package.json):
- read whole: regression, residency-harness; open-fills-fit-view (authored by me).
- not read whole: debug-session, refusal-contract-baseline, admission-remediation, filter, filter-panel, style, publish, console, layout, selection, export-view, recording, command-bar, attributes, table, project, recentre-crossing, colour. For filter-panel, table, layout, recentre-crossing and colour I read relevant parts only.
- `test:` residencyTrace.test, citationIntegrity.test, exportElapsed.test, s5dVerdict.test and `check:` dist-clean, dev-origin, origin-event (`check:dist-notice` runs `scripts/checkDistNotice.mjs`, not e2e): not read.
- Not read whole is not the same as unread: the table's "re-read at S2" rows (filter, selection, attributes, colour) are met only by my first-run greps and parts reading.

4. Times (UTC):
- Step B began 2026-11-18T19:00:10.569Z (first Read of regression.mjs).
- Step B ended 2026-11-18T19:01:32.651Z (last B call; the next calls, 19:02:22Z onward, are S4 research).
- The commit of E ran 2026-11-18T19:04:25.792Z (committer time 19:04:27Z, ff3c1465).
- The measure exe's mtime was 2026-11-18T19:27:32.271Z. Earlier I gave it <masked under ADV-2026-11-18-07 item 2>.
- This was before the base run. The build finished a few minutes before the 19:30Z hand-back.

Model: Sonnet 5.5 (claude-sonnet-5-5), no override. Context handoff: the compaction summary of the first session. The earlier E-FL VOID stop stands as reported.
