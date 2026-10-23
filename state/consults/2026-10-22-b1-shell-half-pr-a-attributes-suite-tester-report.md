*Custodian's filing note (2026-10-22): milestone 4 PR A's new suite `e2e:attributes` at 37b9d756, by a tester on the port-5400 harness, ahead of the full series. The run 18:32:59Z to 19:02:01Z by its transcript (Bash 27, Read 2); its claims were read against that transcript's calls before filing: the exe build, the generator, both suite runs with the step lines it quotes, the fixture copy (two files added where absent; every other file in the shared folder unchanged), no edit of a tracked file and no git write. **STOP at PA-E1 for want of a hit (D6), in the run and its re-run; PA-E3 passed; the two e2e mutations were not run.** Its first run ended on its own wrapper's timeout, not on a suite verdict; it is disclosed and counted. The architect's Amendment 4 (in revision) takes PA-E1's aiming as a code change. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is ce766388a253e438d0e75b5be249616ae81a68296b77a670d209f993ffe5e458.*

---

Attributes suite: b1-shell-half PR A at 37b9d756267d25a30d8445615ff4e76de10b6e61, tester, port-5400 harness

Result: STOP, PA-E1 failed for want of a hit (D6), not on a value, in the run and again in its single re-run. PA-E3 passed in the re-run. The two e2e mutations were NOT run (step 5 only follows a passing step 4).

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff. No usage figures.

Failure classes for this harness:
- Interface: the suite drove the real debug exe over CDP with the README-named in-page hooks (`__SPATIAL_E2E__`). The non-product part is the npx shim (see Harness).
- Claim to results: every claim below points to a log in my scratch folder (Copied files).
- Operator-facing lines: they describe what ran at this commit. No tracked file was changed.
- Assertion reached: PA-E1 reached its own assertion and printed its FAIL line. PA-E3 reached its assertion and printed PASS. The fixtures-hash line printed.

**Start state.** `git status --porcelain` was empty before and after everything. HEAD was 37b9d756267d25a30d8445615ff4e76de10b6e61 on cut/b1-shell-half-pr-a. `npm ci` in frontends/shell: rc 0. NOTICE.txt already existed under src/generated.

**Harness as run**
- I copied the custodian's scripts into my scratch folder under m4a-attr- names: app-up, app-up-wait, app-down, busy, build-exe, run-suite, tauri.conf.json, and the two shims (stock `m4a-attr-shim/npx.cmd`; the waiting variant was not used).
- Changes to the copies: names, scratch paths, and the exe name `spatial-ide-shell-m4a-attr.exe` (the base series' exe is left untouched). The run-suite copy runs `npm run e2e:attributes`, not `node` on the file.
- Overlay (via TAURI_CONFIG at build time): `--remote-debugging-port=9223` and `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`. Vite on 127.0.0.1:5400 with `--strictPort`. The stock shim was on PATH for the suite runs only.
- Before each launch the busy check printed FREE. After each run the app-down script killed only the recorded PIDs; ports 9223 and 5400 were reported free.
- Departure from "foreground": the 600 s tool cap is shorter than the suite's own deadline, so the re-run was a background Bash call. It was still inside one hold, with output redirected and rc captured.

**Exe.** Built once at 37b9d756 under a shared hold, CARGO_TARGET_DIR=D:/wt-targets/m4a, CARGO_BUILD_JOBS=8, overlay set. rc 0, "Finished `dev` profile ... in 5m 44s". sha256 295beb0cc6bc623e176bec0c6735963911deb4b665edf27c6eabdc007b958c7b. The copy at D:/wt-targets/m4a/exes/spatial-ide-shell-m4a-attr.exe is byte-identical to D:/wt-targets/m4a/debug/spatial-ide-shell.exe.

**Fixtures**
- Generator: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_attributes_multitype_fixture -- --ignored --nocapture`, under a hold, rc 0. It printed "wrote ... attributes-multitype.parquet (500 features) and ... oracle.json" and "1 passed".
- It wrote to C:/dev/wt/m4a/target/fixtures/manual-walkthrough/.
- attributes-multitype.parquet sha256 afbd4b909a22a416f88002dcbd81edf3117a642141954724eac4cc41c459a1d2.
- attributes-multitype.oracle.json sha256 29e54fec6fcb583f2c23fe6767390236724d930452660d24b39590c519f03a75.
- Neither file was present in the shared folder, so I copied both there with `cp -n`. I re-hashed them there and the hashes match.
- filter-zoned.parquet sha256, before and after: 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 both times.
- The shared folder's listing of hashes was identical before and after, apart from the two added files (before 18 lines, after 20; `cmp` printed FIX-OTHERS-IDENTICAL). Nothing there was overwritten, moved or removed.
- The suite itself printed "fixtures hash-identical before and after".

**Runs of `npm run e2e:attributes`**
- **run1:** rc 124, 2026-10-22T18:41:06Z to 18:49:26Z. This was my wrapper's 500 s `timeout`, set to fit the tool cap. It was not a suite verdict. The suite printed no step line, only 114 `[hover-barrier] PA-E1` lines. I counted it as the first attempt anyway.
- **run2, the single re-run, alone:** rc 1, 2026-10-22T18:50:05Z to 19:00:25Z. Step lines, byte-copied:
  - `[PA-E1] FAIL (517029ms): PA-E1: 0 of the oracle's ids were reached in 120 hovers; at least 2 are needed`
  - `[PA-E3] PASS (96921ms): unfiltered clicks showed ["[P6 placeholder] NULL","residential","industrial"]; under zone = 'residential' 3 clicks all showed residential`
  - `[attributes] fixtures hash-identical before and after: attributes-multitype.parquet afbd4b909a22, attributes-multitype.oracle.json 29e54fec6fcb, filter-zoned.parquet 92ed800ccbcc`
  - `[attributes] 1 PASS, 1 FAIL: PA-E1=FAIL PA-E3=PASS`
  - `rc=1 end 2026-10-22T19:00:25Z`
- **Failure kind: a hit-miss, D6, not a value.** The suite tried its 120 hovers and none confirmed an oracle id. No value or column-order comparison was reached.
- **Ids it did confirm in PA-E1 (120 hovers):** 10, 11, 12, 33, 34, 35, 56, 57, 58 and 80. Hover positions printed for them have y from 1200020 to 1200100 (id 80 was not checked for position). The oracle ids are 240, 241, 242, 263 and 264, which are rows 10 and 11 of the grid. The columns match (10 to 12); the rows do not. The camera the suite aimed at (centre of the canvas, FIT_MARGIN_FRACTION 0.8) was showing the low rows near its centre.
- **My reading, not a measurement:** the vertical position estimate of the fit is wrong for this fixture at this window. I did not diagnose further.
- PA-E3 passing is the only evidence that the zones path works.

**Mutations (PA-E1, PA-E3).** Not run, per step 4 ("fails again, STOP"). No tracked file was edited at any point.

**Copied files** (all under my scratch folder `.../scratchpad/m4a-attr-h/out/`, never overwritten):
- run1: m4a-attr-run1.log (suite stdout, start and rc lines), .app.err.log, .app.out.log, .vite.err.log, .busy.txt, .down.txt, .wrap.txt, .rep.tauri.e2e.conf.json.
- run2: the same set under m4a-attr-run2.*.
- m4a-attr-run2.rep.app.log is STALE. It is a 0-byte e2e/out/app.log with a 17:05 mtime, copied by hand. It is not run2's session log, because the stock shim means attachOrLaunch did not write one. The app's own session log is named in the app.err.log lines (session-1792695009.log for run2); I did not copy it.
- Also m4a-attr-npmci.log, m4a-attr-build-exe.log, m4a-attr-build-wrap.txt, m4a-attr-gen.log, m4a-attr-fix-before.txt and m4a-attr-fix-after.txt.

**Processes.** After the run, the app-down output showed trees 4044 and 48904 killed and ports 9223 and 5400 free. The busy check printed FREE (rc 0). The pids file is gone. `git status --porcelain` is empty at HEAD 37b9d756267d25a30d8445615ff4e76de10b6e61. The D:/wt-targets/m4a folder and the worktree's ignored target/fixtures remain. One check, a PowerShell process-list filter, failed on a regex typo in my command, so the FREE check and the app-down output are the evidence.

**Hold lines** (project SpatialIDE only; each granted, none of exit codes 96 to 99):
- exe build: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...` then `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`.
- generator: the same pair.
- run1: the same pair.
- run2: the same pair.
- The -What texts read "b1-shell-half PR A attributes e2e: <what runs>".

**For the custodian:** PA-E1 is a D6 failure of the suite design, not of the product. It needs a worker to correct the point estimate, or a decision to take the ids' positions differently, before the mutations can be observed. I did not retry beyond the single re-run.
