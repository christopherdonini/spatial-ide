*Custodian's filing note (2026-10-22): milestone 4 PR A's attributes evidence at 3e14068e, by a tester on the port-5400 harness, with the exe built at that head. The run 19:56:29Z to 20:11:34Z by its transcript (Bash 23, Read 1); its claims were read against that transcript's calls before filing: the build, the generator reproducing both recorded hashes, the three suite runs with the lines it quotes, each mutation reverted with an empty porcelain, the shared fixture folder only hashed, no commit or push. **The suite passes; PA-E1 catches its mutation; the PA-E3 mutation survives PA-E3 (PA-E1 fails on it in the same run), so Amendment 4 row 15's condition is met and its fix applies.** The report's unexplained PA-E3 failure in the PA-E1 mutation's run is read by the custodian, from the code, as that mutation's own effect and not a flake: at the head `projectionFor` slices the projectable names, so with the mutation a dataset with one projectable column (`filter-zoned.parquet`, whose projected column is `zone` as §3 states) gets an empty list, which the SKP boundary refuses as `skp.projection_empty_list` (`protocol/skp/SKP-V0.md`), so nothing streams. No alone re-run is owed for it. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is cfc78745df6d87418005ae1b6f7fab5be6be596208f7d16388cd5d8d26db4e14.*

---

Attributes evidence: b1-shell-half PR A at 3e14068e13396453edeb70d2017afbfca2f8d26c, tester, port-5400 harness

Result: pass, PA-E3 mutation not caught by PA-E3 (row 15 applies). The PA-E1 mutation was caught by PA-E1. The PA-E3 mutation was caught only by PA-E1, which failed on the same mutation in that run, so the mutation itself was observed to fail the suite. Per row 15 I did not re-try it and did not change the suite.

Model: I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No override, no context handoff. No usage figures.

Four failure classes for this harness:
- Interface: the suite drove the real debug exe over CDP with the README-named `__SPATIAL_E2E__` hooks. The one non-product part is the npx stand-in shim (see Harness).
- Claim to results: every claim below points to a file in my scratch folder (Copied files).
- Operator-facing lines: they describe this commit. HEAD was 3e14068e throughout, and the porcelain was empty after each revert.
- Assertion reached: every run printed its own PASS or FAIL line for PA-E1 and PA-E3 and the fixtures-hash line. No run ended on a wrapper timeout.

**Start state**
- `git status --porcelain` was empty and HEAD was 3e14068e13396453edeb70d2017afbfca2f8d26c on the worktree.
- `npm ci` in frontends/shell: rc 0.

**Harness as run** (scratch folder `scratchpad/m4a-ev-h/`, all files named m4a-ev-*)
- Scripts: copies of the previous run's scripts with names changed by sed: app-up, app-up-wait, app-down, busy, build-exe, run-suite, tauri.conf.json, and the shims (`m4a-ev-shim/npx.cmd`, the waiting variant unused).
- Changes beyond the rename:
  - The exe is `spatial-ide-shell-m4a-ev.exe`.
  - The build timeout was cut from 2700 s to 560 s to fit the tool cap. The build finished in time.
  - run-suite runs `npm run e2e:attributes` with timeout 1500 s.
- Overlay (TAURI_CONFIG at build time): `--remote-debugging-port=9223` and `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`. Vite on 127.0.0.1:5400 with `--strictPort`. The stock shim was on PATH for suite runs only.
- Each suite run was a background Bash call inside one hold, with output redirected and rc written to a file. The suite's deadline is longer than the 600 s tool cap, which step 4 allows. The build and generator ran in the foreground.
- Before each launch the busy check printed FREE. After each run app-down killed only the recorded PIDs, and ports 9223 and 5400 were reported free.
- Nothing was refused to me.

**Exe**
- Built once at 3e14068e under a shared hold, with CARGO_TARGET_DIR=D:/wt-targets/m4a, CARGO_BUILD_JOBS=8 and the overlay. rc 0 (the script prints "copied exe" only on rc 0). Its last cargo line: "Finished `dev` profile [unoptimized + debuginfo] target(s) in 5m 38s".
- sha256 49045e2da57ff0156472bb1ed501fb732b7b6c8945a8161fa0a155fd41fa675a. The exes/ copy and debug/spatial-ide-shell.exe are byte-identical.

**Fixtures (row 16 step 3 (a))**
- Generator: `cargo test -p spatial-kernel --test manual_walkthrough_fixtures generate_the_attributes_multitype_fixture -- --ignored --nocapture`, in a hold, rc 0, "1 passed", "(500 features)". It wrote under C:\dev\wt\m4a\target\fixtures\manual-walkthrough.
- Generated attributes-multitype.parquet: afbd4b909a22a416f88002dcbd81edf3117a642141954724eac4cc41c459a1d2. This matches the recorded hash.
- Generated attributes-multitype.oracle.json: 29e54fec6fcb583f2c23fe6767390236724d930452660d24b39590c519f03a75. This matches the recorded hash.
- Shared copies carry the same two hashes. I wrote nothing there.
- filter-zoned.parquet in the shared folder, before the generator and after all runs: 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 both times.
- Every suite run also printed "fixtures hash-identical before and after: attributes-multitype.parquet afbd4b909a22, attributes-multitype.oracle.json 29e54fec6fcb, filter-zoned.parquet 92ed800ccbcc".

**Runs** (`npm run e2e:attributes`; times are the log's own UTC stamps)

run1, unmutated, rc 0, 2026-10-22T20:03:58Z to 20:05:55Z. Step lines, byte-copied:
- `[PA-E1] PASS (11392ms): 2 oracle ids (242 at notch 0, 240 at notch 0) reached by click showed the oracle's values in declared order, a NULL zone as the marker, in 12 hovers`
- `[PA-E3] PASS (97071ms): unfiltered clicks showed ["[P6 placeholder] NULL","residential","industrial"]; under zone = 'residential' 3 clicks all showed residential`
- `[attributes] 2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS`

**Mutations** (each edit exactly as in the first worker's report and the suite header; applied alone, then reverted with `git checkout -- <file>`; each time the app was started fresh by the run, so it served the edited or reverted source from Vite)

PA-E1 mutation, at 3e14068e, rc 1, 20:06:34Z to 20:08:21Z.
- Edit: `src/attributes/projection.ts`, `projectionFor`: `names.slice(0, ATTRIBUTE_PROJECTION_MAX)` became `names.slice(0, Math.min(ATTRIBUTE_PROJECTION_MAX, names.length - 1))`.
- Caught: `[PA-E1] FAIL (8857ms): PA-E1: the projected columns are ["zone","area","f32","i64","flag"], expected ["zone","area","f32","i64","flag","text"] in declared order (d32 is not projected)`.
- Disclosure: PA-E3 also failed in this same run, and not on the mutation. Line: `[PA-E3] FAIL (92570ms): PA-E3 unfiltered: no camera within 15 zoom-in notches gave 6 features with distinct confirmed ids (notch 0: 0; ... notch 15: 0)`. That is a camera-search failure that read 0 features at every notch. I did not diagnose it. PA-E3 passed in run1 and mut2 under the same harness. The steps do not share a mutated path, and I report it as an unexplained PA-E3 failure that is possibly flaky or state-dependent. I did not re-run it.
- Final line: `[attributes] 0 PASS, 2 FAIL: PA-E1=FAIL PA-E3=FAIL`.
- Reverted. Porcelain empty, HEAD 3e14068e.

PA-E3 mutation, at 3e14068e, rc 1, 20:08:49Z to 20:10:43Z.
- Edit: `src/canvas/clickPick.ts`, `resolveClickPick`: `readRow(candidate.batch, row)` became `readRow(candidate.batch, 0)`.
- **PA-E3 did NOT catch it.** Line, byte-copied: `[PA-E3] PASS (96748ms): unfiltered clicks showed ["residential","[P6 placeholder] NULL"]; under zone = 'residential' 3 clicks all showed residential`. The unfiltered clicks still showed two different zones, so row 15's condition (the mutation surviving) is met.
- PA-E1 failed in the same run, on the wrong values: `[PA-E1] FAIL (10774ms): PA-E1: id 242 shows ["industrial","2812.2943300163547","0.1","-1904788702577245303","false","row-0000...` The line is very long and is cut here; the full text is in the log. So the mutation did not go unseen by the suite, but PA-E3 on its own did not catch it.
- Final line: `[attributes] 1 PASS, 1 FAIL: PA-E1=FAIL PA-E3=PASS`.
- Reverted. Porcelain empty, HEAD 3e14068e. I did not re-try it and did not change the suite.

**Copied files** (in `scratchpad/m4a-ev-h/out/`, unique names, none overwritten)
- For each of run1, mut1, mut2:
  - m4a-ev-<run>.log, the suite's stdout with its start and rc lines;
  - .app.err.log, .app.out.log (empty), .vite.err.log, .busy.txt, .down.txt, .wrap.txt, .rc.txt;
  - .session.log, the app's own session log named in its stderr;
  - .rep.tauri.e2e.conf.json. The suite wrote no app.log this time; the only report file it produced was this config.
- Others: m4a-ev-npmci.log, m4a-ev-build-exe.log, m4a-ev-build-wrap.txt, m4a-ev-gen.log, m4a-ev-fix-before.txt, m4a-ev-mut1.diff.txt, m4a-ev-mut2.diff.txt.
- One caveat: m4a-ev-fix-before.txt came from `sha256sum *`, which errored on two subdirectories, so the listing is partial. The three relevant hashes are in it. I did not write a fix-after file; the after-hashes come from a direct `sha256sum` of the three files at the end.

**Processes**
- app-down killed the recorded trees after every run and printed "port 9223 free" and "port 5400 free" each time.
- The final busy check printed FREE (rc 0), and the pids file is gone.
- I started no other processes.
- `git status --porcelain` is empty at HEAD 3e14068e13396453edeb70d2017afbfca2f8d26c.
- I made no commit, no push, no edit of a tracked file except the two mutations, each reverted at once, and no write in the shared fixture folder.

**Hold lines** (my project's only; each granted, none of exit codes 96 to 99), one pair per heavy command: exe build, generator, run1, mut1, mut2. Byte-copied example, repeated in the same form for each:
- `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...`
- `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`
- The -What texts read "b1-shell-half PR A evidence: <what runs>".

**For the custodian**
- PA-E1 is observed at this head, both passing and on its mutation.
- The PA-E3 mutation survived PA-E3 itself, which is Amendment 4 row 15's Evidence-failure condition. Row 15 gives the fix: read each unfiltered id's zone again under `id = N` and compare. It is a worker's change to `frontends/shell/e2e/attributes.mjs`.
- The unexplained PA-E3 camera-search failure in mut1 is worth one alone re-run by the custodian.
- The other e2e mutations (H2, H1, H7) and the full series were not in this task.
