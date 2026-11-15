*Custodian's filing note (2026-10-23): milestone 4 PR C's base e2e series at C a533a598 (the form's section 0.3), by a tester under the port-5400 harness, on an exe built at C. The run 19:12:54Z to 19:58:05Z by its transcript (Read 5, Bash 42); its claims were read against that transcript's calls before filing: no commit, push or PR call; its Edit and Write calls only on its `m4c-e2e-` scratch files; the worktree's porcelain empty after. Every suite passes, and the three scriptless drivers on their default routes; source-changed's post route ends INCONCLUSIVE twice, as PR A's scriptless-drivers record gives it, so I3 does not fire. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder, and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 4ae2519fbe32648839bd0501df84d891f818a68b2bf0ae46433268de7e851c63.*

---

Base e2e: b1-shell-half PR C at a533a598e4e139e2fbd2793ded328472cc977036, tester, port-5400 harness

Result: all pass. The one exception is source-changed's post route, which ended rc 3 twice with S5d INCONCLUSIVE. That is the result PR A's scriptless-drivers record gives for that route, so I did not STOP. No timing-sensitive failure and no harness-caused attempt occurred. No `skp.projection_` line appeared in any run's app stderr (count 0 in all 20).

**Model and failure classes**
- I observe myself as Sonnet 5.5 (claude-sonnet-5-5). There was no override and no context handoff. I have no usage figures.
- Interface: every suite and driver ran against the real debug exe over CDP. The npx stand-in shim is the one non-product part. Publish's destination seam is the README-declared exception.
- Claim to results: every claim below points to a file in `out/` under my scratch folder `m4c-e2e-h/`. The folder is under the session scratchpad and every name starts `m4c-e2e-`.
- Operator-facing lines: they describe what ran at this commit. HEAD was a533a598 throughout and the porcelain was empty at the start and end.
- Assertion reached: each suite printed its own PASS/FAIL end line. `residency-harness` was read by exit code only, by instruction.

**Start state**
- `git status --porcelain` was empty. `git rev-parse HEAD` printed a533a598e4e139e2fbd2793ded328472cc977036, branch cut/b1-shell-half-pr-c.
- `npm ci` in frontends/shell: rc 0. `npm ci` in renderer/bundle-viewer: rc 0. I also ran `npm run build` there (rc 0) for publish's viewer dist.
- The porcelain was still empty afterwards.

**Harness as run**
- Scripts: copies of the custodian's harness-5400 scripts, renamed by sed. The names are `m4c-e2e-` plus the original: app-up, app-up-wait, app-down, busy, build-exe, run-suite, tauri.conf.json, `m4c-e2e-shim/npx.cmd` and `m4c-e2e-shim-wait/npx.cmd`.
- What the sed changed: `m4a-e2e` to `m4c-e2e`, `M4A_WT` to `M4C_WT`, `wt/m4a` to `wt/m4c`, and the exe name to `spatial-ide-shell-m4c.exe`. The shim default in run-suite became `m4c-e2e-shim`. The target folder stays `D:/wt-targets/m4a`.
- Two changes beyond the rename, both mine:
  - run-suite also copies the app's own session log (the path named in its stderr), prints the `skp.projection_` count of the app stderr copy, and writes the rc to a file.
  - run-suite ends with `exit $rc`, so I deleted the old last line and appended the new ones above it.
- Overlay: `TAURI_CONFIG` at build time adds `--remote-debugging-port=9223` and `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"` to the window's additionalBrowserArgs.
- Vite: 127.0.0.1:5400 with `--strictPort`, started by hand by app-up together with the exe. Each run got a fresh vite and a fresh app.
- Shims: the waiting shim for recording and for the four driver runs, via `SHIMDIR`. The stock shim for every other suite. The npx shim was on PATH for those runs only.
- Before each launch the busy check printed FREE. app-down killed only the PIDs app-up recorded, and "port 9223 free" and "port 5400 free" printed after every run.
- `CARGO_TARGET_DIR=D:/wt-targets/m4a`, `CARGO_BUILD_JOBS=8` and `RUST_TEST_THREADS=8` were set for every cargo command and every suite run.
- Nothing was refused to me. I made no commit and no push, and I edited no tracked file.

**Exe**
- The first build call failed with rc 101: `resource path ..\src\generated\NOTICE.txt doesn't exist` (`m4c-e2e-build-exe.attempt1-failed.log`).
- I ran `npm run generate:notice` (rc 0). It wrote the gitignored `frontends/shell/src/generated/NOTICE.txt`, 3427745 bytes, and printed that it was a provisional bootstrap NOTICE. The porcelain stayed empty.
- The second build, in a shared hold, finished rc 0: "Finished `dev` profile [unoptimized + debuginfo] target(s) in 7m 56s". Log: `m4c-e2e-build-exe.log`.
- Built at a533a598e4e139e2fbd2793ded328472cc977036 with the overlay.
- sha256 01a58d5448c8cd09eade56c3164570333508be857f1ba723aa894da8e043cec5. `D:/wt-targets/m4a/exes/spatial-ide-shell-m4c.exe` and `D:/wt-targets/m4a/debug/spatial-ide-shell.exe` are byte-identical.
- Publish's `verify-bundle` example was built in its own hold: `cargo build -p spatial-kernel --example verify-bundle`, rc 0, 1m 08s.

**Fixtures**
- I hashed all 34 files under `target/fixtures/manual-walkthrough/` (recursive), before the series (`m4c-e2e-fix-before.txt`) and after it (`m4c-e2e-fix-after.txt`). `cmp` printed FIX-IDENTICAL. I regenerated nothing and wrote nothing there. The 5 GB fixture was not used.
- Key hashes, before and after:
  - filter-zoned.parquet 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
  - 100k-happy-path.parquet fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
  - attributes-multitype.parquet afbd4b909a22a416f88002dcbd81edf3117a642141954724eac4cc41c459a1d2
  - attributes-multitype.oracle.json 29e54fec6fcb583f2c23fe6767390236724d930452660d24b39590c519f03a75
  - slow-filter-scan.parquet 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5
- The layout, export-view, command-bar and attributes suites printed their own fixtures-hash-identical PASS lines. The drivers printed `fixture-integrity PASS`.

**Suites and drivers** (2026-10-23, UTC, from each run log's start and `rc=... end` lines; each in its own shared hold; fixtures unchanged in every case, per the cmp above)

| Run | rc | Start | End | Last line / verdict |
|---|---|---|---|---|
| regression | 0 | 19:26:44 | 19:31:14 | all steps PASS, none FAIL; A9' PASS; the app stayed running per the suite's own text |
| refusal-contract-baseline | 0 | 19:31:54 | 19:32:36 | OVERCEIL', REOPEN', SLOW'/CANCEL' PASS |
| admission | 0 | 19:32:50 | 19:33:17 | OVERBOUND' PASS (last step) |
| filter | 0 | 19:33:29 | 19:33:40 | FILTER', REFUSED' PASS |
| filter-panel | 0 | 19:33:53 | 19:34:22 | CLEAR', FIND' PASS |
| style | 0 | 19:34:35 | 19:34:43 | DOC', RESET' PASS |
| publish | 0 | 19:34:58 | 19:35:05 | APPROVED', REFUSED', FILTERED' PASS; EXPIRED' SKIP by the suite's stated reason |
| console | 0 | 19:35:18 | 19:40:42 | `REGRESS' PASS npm run e2e:regression exited 0 (284680ms); npm run e2e:admission exited 0 (24499ms)`; UNCLASS' PASS |
| layout | 0 | 19:41:07 | 19:41:59 | FILL, BURST (recorded, not asserted), FIXTURES PASS |
| selection | 0 | 19:42:12 | 19:46:13 | `[selection] 18 PASS, 0 FAIL`, then `[EXPORT-TODAY] SKIP` (the suite's own design) |
| export-view | 0 | 19:46:36 | 19:47:03 | `[export-view] 4 PASS, 0 FAIL` |
| recording (waiting shim) | 0 | 19:47:20 | 19:47:27 | RESET, RECORD PASS |
| command-bar | 0 | 19:47:41 | 19:49:09 | E-SEL, FIXTURES PASS |
| attributes | 0 | 19:49:21 | 19:51:32 | `[attributes] 2 PASS, 0 FAIL: PA-E1=PASS PA-E3=PASS` |
| residency-harness (exit code only) | 0 | 19:51:47 | 19:52:02 | no figure recorded or claimed |
| pan-anchor.mjs | 0 | 19:52:16 | 19:54:56 | `==== 16/16 PASS ====` |
| source-watch-idle.mjs | 0 | 19:55:11 | 19:55:26 | F0 to F3 and fixture-integrity PASS |
| source-changed.mjs, default route | 0 | 19:55:42 | 19:56:01 | S1 to S5c and fixture-integrity PASS |
| source-changed.mjs, post route | 3 | 19:56:16 | 19:56:35 | S5d INCONCLUSIVE, every other step PASS |
| source-changed.mjs, post route, re-run once alone | 3 | 19:56:50 | 19:57:09 | same |

- Every suite passed on its first run, and no re-run was needed except the post route.
- The route variable was unset for the default route (printed "route env: [unset]" and `env -u`) and `post` for the post route.
- Post route, both runs: S1, S2, S4 (17 -> 21 in the render trace), S5a, S5b, S5c and fixture-integrity PASS; S3 INFO "deferred to S4". The S5d line starts, byte-copied: `S5d-post-check-route-confirmed           INCONCLUSIVE  S5d: INCONCLUSIVE (never a pass): a tile mint was refused with engine.source_changed and the pre-check's own descriptor detail ({mtime}) -- a sibling tile's pre-check found the change while the generation was live at its live check;`. This matches PR A's scriptless-drivers record (rc 3, INCONCLUSIVE twice, the same steps passing). It is not an I3 reading.
- I did not diagnose it. It is the same result PR A's record gives for the post route; the PLAN item source-changed-post-route-s5d-race is the custodian's.

**Copied files** (all in `m4c-e2e-h/out/`, unique per run, none overwritten; 238 files)
- Tags: regression, refusal, admission, filter, filter-panel, style, publish, console, layout, selection, export-view, recording, command-bar, attributes, residency, pananchor, watchidle, srcchanged-pre, srcchanged-post, srcchanged-post2.
- Per tag: `m4c-e2e-<tag>.log` (stdout with start and `rc=... end` lines), `.app.err.log`, `.app.out.log`, `.vite.err.log`, `.session.log`, `.busy.txt`, `.down.txt`, `.rc.txt`, and `m4c-e2e-wrap-<tag>.txt`.
- Reports are `m4c-e2e-<tag>.rep.<name>`. Examples:
  - `m4c-e2e-regression.rep.regression-render-trace-1792783874396.json`
  - `m4c-e2e-srcchanged-post.rep.source-changed-1792785395609.json`
  - `m4c-e2e-srcchanged-post2.rep.source-changed-1792785429034.json`
- Others:
  - `m4c-e2e-npmci.log`, `m4c-e2e-bvci.log`, `m4c-e2e-bvbuild.log`, `m4c-e2e-gennotice.log`
  - `m4c-e2e-build-exe.log`, `m4c-e2e-build-exe.attempt1-failed.log`, `m4c-e2e-verify-example-build.log`
  - `m4c-e2e-fix-before.txt`, `m4c-e2e-fix-after.txt`, `m4c-e2e-final-busy.txt`
- The scratch folder is `<the session scratch folder>/m4c-e2e-h/`.
- I also wrote `m4c-e2e-sum.sh` there, a read-only summarising helper.
- The suites left ignored files under the worktree's `frontends/shell/e2e/out/`, `frontends/shell/src/generated/`, `target/e2e-publish-out`, and the bundle-viewer dist. The porcelain stays empty.

**Processes**
- Each run's down script killed its two recorded PIDs and printed "port 9223 free" and "port 5400 free".
- After the series the busy check printed FREE (rc 0) and the pids file is gone.
- I started no other long-lived process.
- Final `git status --porcelain`: empty (rc 0). HEAD a533a598e4e139e2fbd2793ded328472cc977036.

**Hold lines** (SpatialIDE only; every hold was granted and no exit code 96 to 99 occurred)
- One pair per heavy command: exe build (twice, the first failing at rc 101), the verify-bundle example build, the 15 suites, the 3 drivers, source-changed's post route, and its post-route re-run.
- The -What texts begin "b1-shell-half PR C base series: ".
- Byte-copied example, the regression run: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:20980 also=bash.exe:8832 (commands started from now on inherit it; release when done)` and `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:20980 affinity=FF (cores 0-7)`.

**For the custodian**
- I3 does not fire for any suite at C. The post route's INCONCLUSIVE S5d repeats from PR A's record.
- Nothing was run against the 5 GB fixture, and nothing was regenerated in the shared folder.
