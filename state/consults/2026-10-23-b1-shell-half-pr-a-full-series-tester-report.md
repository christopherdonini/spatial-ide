*Custodian's filing note (2026-10-23): milestone 4 PR A's full series at 35085072 (Amendment 4, row 16, item 3), by a tester on the human's port-5400 harness. The run 09:02:11Z to 09:48:46Z by its transcript (Bash 49); its claims were read against that transcript's calls before filing: no commit, push or PR call; no Write or Edit; the two mutation reverts by `git checkout -- <file>` of the two files the first worker's report names; the shared fixture folder read only (hashed, never written); the porcelain empty at the end. Its one change to the harness beyond the rename (run-suite also copies the app's own session log and prints the projection-refusal count) is its own disclosure. H2 holds at this head, H1 and H7 by PA-E1's pass, and each e2e mutation is caught by its own test. The extra attributes run after the reverts is outside the series and disclosed. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is ee4781545025c4600f95f51430fdb805721a7b18d24fcc47376027ec863d07a7.*

---

Full series: b1-shell-half PR A at 35085072824b5bcd657c37e3ca1603cbb1693e93, tester, port-5400 harness

Result: all pass, both mutations caught

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). There was no override and no context handoff. I have no usage figures.

**The four failure classes, as they apply to this harness**
- Interface: every suite drove the real debug exe over CDP, with the in-page hooks that e2e/README.md names. The one non-product part is the npx stand-in shim. Publish's destination seam and the native dialogs are the README-declared exceptions.
- Claim to results: every claim below points to a file in the `out/` folder under my scratch folder (`m4a-fs-h/`). The names are in "Copied files".
- Operator-facing lines: the lines here describe what ran at this commit. HEAD was 35085072 throughout.
- Assertion reached: every suite printed its own PASS/FAIL end line. The one exception is `residency-harness`, by instruction, read by exit code only.

**Start state**
- `git status --porcelain` was empty and HEAD was 35085072824b5bcd657c37e3ca1603cbb1693e93, branch cut/b1-shell-half-pr-a.
- `npm ci` in frontends/shell and in renderer/bundle-viewer: rc 0 each. In bundle-viewer I also ran `npm run build` (rc 0), for publish's viewer dist. It writes ignored output only.
- Free space on C: was 27 GB before and after. No run wrote more than 5 GB there.

**Harness as run** (scratch `m4a-fs-h/`, all files named m4a-fs-*)
- Scripts: copies of the previous evidence run's scripts, renamed by sed. They are app-up, app-up-wait, app-down, busy, build-exe, run-suite, the tauri.conf.json overlay, `m4a-fs-shim/npx.cmd` and `m4a-fs-shim-wait/npx.cmd`.
- One change beyond the rename: run-suite now also copies the app's own session log (the path named in its stderr), writes the suite's rc to a file, and prints the `skp.projection_` count of the run's stderr copy.
- Overlay: `TAURI_CONFIG` at build time adds `--remote-debugging-port=9223` and `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"` to the window's additionalBrowserArgs.
- Vite ran on 127.0.0.1:5400 with `--strictPort`, started by hand by the app-up script together with the exe. It was a fresh vite and a fresh app for every run, so every run served the source as it stood on disk.
- Shims: the waiting shim for `recording` only (the log line reads `shim m4a-fs-shim-wait`). The stock shim for every other run.
- Publish's verify-bundle example: built before the publish run, in its own hold (`cargo build -p spatial-kernel --example verify-bundle`, rc 0, 1.63 s because the target was warm), with the same CARGO_TARGET_DIR=D:/wt-targets/m4a.
- Every run: the busy check printed FREE at launch. The down script killed only the PIDs the up script recorded, and ports 9223 and 5400 were free after every run. No part of the harness was refused to me.
- `CARGO_TARGET_DIR=D:/wt-targets/m4a`, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8 were set for every cargo command and every suite run. Nothing was committed, pushed or opened as a PR.

**Exe**
- Built once at 35085072, with the overlay, in a shared hold. rc 0; "Finished `dev` profile [unoptimized + debuginfo] target(s) in 7m 54s".
- sha256 338eeb0303bfca906dd614139fa6b2c3b587a0c214330695a9bd70ce90b661fb. `D:/wt-targets/m4a/exes/spatial-ide-shell-m4a-fs.exe` and `D:/wt-targets/m4a/debug/spatial-ide-shell.exe` are byte-identical.

**Fixtures, step (a), done before any suite**
- Generator: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_attributes_multitype_fixture -- --ignored --nocapture`, in a hold, rc 0, "1 passed", "(500 features)". It wrote under the worktree's own `target/fixtures/manual-walkthrough/`.
- Generated attributes-multitype.parquet: afbd4b909a22a416f88002dcbd81edf3117a642141954724eac4cc41c459a1d2. This equals the recorded hash.
- Generated attributes-multitype.oracle.json: 29e54fec6fcb583f2c23fe6767390236724d930452660d24b39590c519f03a75. This equals the recorded hash.
- The shared folder's two copies carry the same two hashes. I wrote nothing in the shared folder.
- I recorded the sha256 of all 20 files in the shared folder's top level before the series (`m4a-fs-fix-before.txt`) and after it (`m4a-fs-fix-after.txt`). `cmp` printed FIX-IDENTICAL.
- Key hashes, before and after: filter-zoned 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46; 100k-happy-path fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49; slow-filter-scan 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5.
- The attributes, layout, export-view and command-bar suites also printed their own fixtures-hash-identical PASS lines.

**Suites** (each run alone, in its own shared hold; times UTC, 2026-10-23, from the run log's own stamps)

| Suite | rc | Start | End | `skp.projection_` count in app stderr | Re-run |
|---|---|---|---|---|---|
| regression | 0 | 09:13:50 | 09:18:36 | 0 | none |
| refusal-contract-baseline | 0 | 09:19:22 | 09:20:15 | 0 | none |
| admission | 0 | 09:20:30 | 09:20:58 | 0 | none |
| filter | 0 | 09:21:13 | 09:21:25 | 0 | none |
| filter-panel | 0 | 09:21:43 | 09:22:14 | 0 | none |
| style | 0 | 09:22:26 | 09:22:35 | 0 | none |
| publish | 0 | 09:23:04 | 09:23:13 | 0 | none (example pre-built) |
| console | 0 | 09:23:27 | 09:29:16 | 0 | none |
| layout | 0 | 09:29:42 | 09:30:36 | 0 | none |
| selection | 0 | 09:30:55 | 09:34:52 | 0 | none |
| export-view | 0 | 09:35:05 | 09:35:27 | 0 | none |
| recording (waiting shim) | 0 | 09:35:42 | 09:35:49 | 0 | none |
| command-bar | 0 | 09:36:03 | 09:37:32 | 0 | none |
| attributes | 0 | 09:37:44 | 09:39:54 | 0 | none |
| residency-harness (exit code only; no figure recorded or claimed) | 0 | 09:40:08 | 09:40:23 | 0 | none |

- Every suite passed on its first run. There was no failure, no harness-cause attempt, and no I3, I6 or timing-sensitive case.
- The `skp.projection_` count is 0 in all 18 runs' app stderr copies and in all 18 session-log copies, mutation runs included.
- Last lines, byte-copied:
  - attributes: `[attributes] 2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS`.
  - selection: `[selection] 18 PASS, 0 FAIL: ...`, then `[EXPORT-TODAY] SKIP` (the suite's own design).
  - export-view: `[export-view] 4 PASS, 0 FAIL: E-CV-OPEN=PASS E-CV=PASS E-CV-RESIZE=PASS FIXTURES=PASS`.
  - console: `REGRESS' PASS npm run e2e:regression exited 0 (306911ms); npm run e2e:admission exited 0 (24777ms); ...`.
  - recording: `RECORD PASS ... a header and five steps, in order and chained; the filter names the field zone; ...`.
  - publish: REFUSED' PASS, FILTERED' PASS, and EXPIRED' SKIP by the suite's own stated reason.
- H1 and H7 come from PA-E1's pass in the unmutated attributes run: `[PA-E1] PASS (10574ms): 2 oracle ids (242 at notch 0, 240 at notch 0) reached by click showed the oracle's values in declared order, a NULL zone as the marker, in 12 hovers`.
- PA-E3's pass line in that run: `[PA-E3] PASS (115145ms): unfiltered clicks showed ["[P6 placeholder] NULL","residential","industrial"]; ids ["158","20","22","247","335","337"] each read the same zone again under id = N; under zone = 'residential' 3 clicks all showed residential`.

**Mutations** (each applied alone, by the exact edit in the first worker's report, run with `npm run e2e:attributes`, then reverted with `git checkout -- <file>`; commit 35085072824b5bcd657c37e3ca1603cbb1693e93)
- PA-E1, `frontends/shell/src/attributes/projection.ts`, `projectionFor`: `names.slice(0, ATTRIBUTE_PROJECTION_MAX)` became `names.slice(0, Math.min(ATTRIBUTE_PROJECTION_MAX, names.length - 1))`. The diff is in `m4a-fs-mut1.diff.txt`.
  - Run: rc 1, 09:40:54 to 09:42:52.
  - Caught by PA-E1: `[PA-E1] FAIL (8409ms): PA-E1: the projected columns are ["zone","area","f32","i64","flag"], expected ["zone","area","f32","i64","flag","text"] in declared order (d32 is not projected)`.
  - PA-E3 also failed in this run, with the same camera-search text the previous evidence run saw: `[PA-E3] FAIL (103880ms): PA-E3 unfiltered: no camera within 15 zoom-in notches gave 6 features with distinct confirmed ids (notch 0: 0; ... notch 15: 0)`. Final line `0 PASS, 2 FAIL`. It repeats as before and I did not diagnose it. I found no `skp.projection_` line in that run's stderr or session log. I make no cause claim.
  - After the revert: `git checkout` rc 0 and the porcelain empty.
- PA-E3, `frontends/shell/src/canvas/clickPick.ts`, `resolveClickPick`: `readRow(candidate.batch, row)` became `readRow(candidate.batch, 0)`. The diff is in `m4a-fs-mut2.diff.txt`.
  - Run: rc 1, 09:43:26 to 09:44:40.
  - Caught by PA-E3, whose new id-equals-N half now fails: `[PA-E3] FAIL (54316ms): PA-E3: clicked unfiltered, id 158 shows zone "residential"; under id = 158 the same pointer shows id 158 with zone "[P6 placeholder] NULL"`.
  - PA-E1 also failed on this mutation: `[PA-E1] FAIL (11756ms): PA-E1: id 242 shows ["industrial","2812.2943300163547","0.1","-1904788702577245303","false","row-0000...`. Final line `0 PASS, 2 FAIL`.
  - After the revert: `git checkout` rc 0 and the porcelain empty.
- Reverted code served: each run starts a fresh vite on the working tree. After both reverts I ran `npm run e2e:attributes` once more, extra to the series (tag `attributes-after-revert`, rc 0, 09:45:08 to 09:47:39, `2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS`). The porcelain was empty after it.

**Copied files** (all in `m4a-fs-h/out/`, unique per run, none overwritten; 208 files)
- Tags: regression, refusal, admission, filter, filter-panel, style, publish, console, layout, selection, export-view, recording, command-bar, attributes, residency, attributes-mut-pae1, attributes-mut-pae3, attributes-after-revert.
- Per tag:
  - `m4a-fs-<tag>.log`: the suite's stdout, with its head/start line and `rc=... end ...` line.
  - `.app.err.log`, `.app.out.log`, `.vite.err.log`.
  - `.session.log`: the app's own session log, copied for all 18 runs.
  - `.busy.txt`, `.down.txt`, `.wrap.txt`, `.rc.txt`.
  - `.rep.<name>`: the suite's reports from e2e/out, for example `m4a-fs-regression.rep.regression-render-trace-1792747114837.json`.
- Others: m4a-fs-npmci.log, m4a-fs-bvci.log, m4a-fs-bvbuild.log, m4a-fs-build-exe.log, m4a-fs-build-wrap.txt, m4a-fs-build-rc.txt, m4a-fs-gen.log, m4a-fs-verify-example-build.log, m4a-fs-fix-before.txt, m4a-fs-fix-after.txt, m4a-fs-mut1.diff.txt, m4a-fs-mut2.diff.txt.
- The suites left ignored files in the worktree's `frontends/shell/e2e/out/` and `target/e2e-publish-out`. The porcelain stays empty.

**Processes**
- Each run's down script killed its recorded PIDs and printed "port 9223 free" and "port 5400 free". After the series the busy check printed FREE (rc 0) and the pids file is gone. I started no other long-lived process.
- Final `git status --porcelain`: empty. HEAD 35085072824b5bcd657c37e3ca1603cbb1693e93.

**Hold lines** (SpatialIDE only; every hold was granted, none of exit codes 96 to 99)
- One pair per heavy command: exe build, generator, verify-example build, the 15 suites, the two mutation runs and the after-revert run. The `-What` texts begin "b1-shell-half PR A full series: ...".
- Byte-copied example: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:48216 also=bash.exe:48820 (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:48216 affinity=FF (cores 0-7)`.

**For the custodian**
- Nothing was run against the 5 GB fixture, and nothing was regenerated in the shared folder.
- H2 holds at this head: all existing suites pass with no projection refusal.
- H1 and H7 hold per PA-E1's pass.
- PA-E1 and PA-E3 each fail on their own mutation. The PA-E3 mutation is now caught by PA-E3 itself (row 15's fix works), as well as by PA-E1.
- PA-E3's camera-search failure under the PA-E1 mutation repeats from the earlier run. The custodian's reading of it as that mutation's own effect stands as their reading. I did not verify it.
