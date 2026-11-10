*Custodian's filing note (2026-10-24): the tester's e2e series at milestone 4 PR C's head bc315fb9d163dc292501618836bc25353c467bd8 (draft PR #253), on the port-5400 harness. The run 14:36:00Z to 15:05:23Z by its transcript (Bash 41, Read 1; no write tool, no git verb that changes a tree, no PR action). It stopped at `e2e:refusal-contract-baseline`, failed on its first run and its one re-run, with the machine under heavy load; the custodian has not recorded it as I3, and a tester-high's diagnosis (the base frontend under the same load, then a bisect over PR C's four commits) follows. Extracted by script from its SubagentHandback call, with one final newline added; the session scratch folder's path, 2 place(s), written as <the session scratch folder>; nothing else is changed. Its sha256, from line 5 to the end, is 80811ccf7482c733c098999f6e7b5eada8471772acc858889344fc4aa5b6a885.*

---

Head e2e: b1-shell-half PR C at bc315fb9d163dc292501618836bc25353c467bd8, tester, port-5400 harness

Result: STOP, `e2e:refusal-contract-baseline` fails on two runs in a row (the first run and the one allowed re-run). Per step 7 that is I3 unless it is timing. The machine was at 100% CPU load from processes I did not start, so I cannot rule timing out. I ran no other suite and no driver, and none of PC-E1 to PC-E4's mutations. The custodian should re-run this suite alone on a quiet machine before anything is recorded as I3.

**Model and the four failure classes**
- I observe myself as Sonnet 5.5 (claude-sonnet-5-5). No override, no context handoff. I have no usage figures.
- Interface: the suites drive the real debug exe over CDP. The npx stand-in shim is the one non-product part.
- Claim to results: every claim below points to a file under my scratch folder `m4c-hs-h/out/`. Its full path is `<the session scratch folder>/m4c-hs-h/out/`, and every name starts `m4c-hs-`.
- Operator-facing lines: they describe this commit. HEAD was bc315fb9 throughout.
- Assertion reached: the refusal suite reached its assertions; it printed its own FAIL lines. The generator and `e2e:regression` printed their own end lines.

**Start state**
- `git status --porcelain` empty, `git rev-parse HEAD` printed bc315fb9d163dc292501618836bc25353c467bd8, branch cut/b1-shell-half-pr-c.
- `npm ci` in frontends/shell: rc 0. `npm ci` in renderer/bundle-viewer: rc 0. `npm run build` there: rc 0. The porcelain stayed empty.
- `frontends/shell/src/generated/NOTICE.txt` (gitignored) already existed from the base series, so I did not regenerate it.

**Harness as run**
- Scripts: `sed` copies of the harness-5400 scripts, in `m4c-hs-h/`: `m4c-hs-app-up.ps1`, `-app-up-wait.ps1`, `-app-down.ps1`, `-busy.ps1`, `-build-exe.sh`, `-run-suite.sh`, `-tauri.conf.json`, `m4c-hs-shim/npx.cmd` and `m4c-hs-shim-wait/npx.cmd`.
- Renames: `m4a-e2e` to `m4c-hs`, `M4A_WT` to `M4C_WT`, `C:/dev/wt/m4a` to `C:/dev/wt/m4c`, exe name `spatial-ide-shell-m4c-hs.exe`, and the shim default `m4c-hs-shim`. `CARGO_TARGET_DIR` stays `D:/wt-targets/m4a`.
- One addition beyond the renames, copied from the base series: run-suite also copies the app's session log, prints the count of lines containing "stopped" in the suite log, and writes the rc to a file. I appended it after deleting the old last line.
- Overlay: `TAURI_CONFIG` at build time adds CDP on 9223 and `MAP localhost:5180 127.0.0.1:5400` to the window's additionalBrowserArgs. Vite runs on 127.0.0.1:5400 with `--strictPort`. The npx shim was on PATH only for the suite runs. No waiting shim was needed, because I got no further than the refusal suite.
- Before each launch the busy check printed FREE.

**Exe**
- Build log: `m4c-hs-build-exe.log`. The build ran in a shared hold, `cargo build` rc 0, "Finished `dev` profile ... in 6m 00s". It was built at bc315fb9 with the overlay.
- sha256 a6c1c608b7bad5ac15e07f95b85dc5325934c08ee9c5dfcad50d4dfd42b44282. The copy in `exes/` and `debug/spatial-ide-shell.exe` are byte-identical.

**Fixtures**
- 34 files hashed recursively, before (`m4c-hs-fix-before.txt`) and after (`m4c-hs-fix-after.txt`). `cmp` printed FIX-IDENTICAL. I regenerated nothing there and did not use the 5 GB fixture.
- filter-zoned.parquet 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46
- 100k-happy-path.parquet fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49
- slow-filter-scan.parquet 3fd819cb35aafa309c0c4c8452283ac4ccd5825f00d24894aa12d5ffc86f5ce5

**Oracle (PC-E1)**
- Command: `cargo test -p spatial-kernel --locked --test manual_walkthrough_fixtures -- --ignored --exact generate_the_filter_fixture --nocapture`, in a shared hold. Log: `m4c-hs-oracle.log`, rc 0.
- Printed line, byte-copied: "wrote C:\dev\wt\m4c\kernel\../target/fixtures/manual-walkthrough\filter-zoned.parquet (2000 features, 24014 vertices, zone_counts=[402, 392, 389, 421], zone_nulls=396)".
- The worktree's file has sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46. The shared copy has the same sha256, so they are equal.
- `residential` is 402, below 1,000, so there is no class-2 miss. `SPATIAL_E2E_FILTER_ZONE_COUNTS` would have been `[402, 392, 389, 421]`; it was never used because `e2e:table` was not reached.

**Suites run (each in its own shared hold; fixtures unchanged by the final cmp)**

| Run | rc | Start (UTC, 2026-10-24) | End | Notes |
|---|---|---|---|---|
| regression | 0 | 14:46:01 | 14:51:42 | last lines "This run launched the app..."; the rc line follows; stopped-line count 0 |
| refusal-contract-baseline, run 1 | 1 | 14:52:39 | 14:56:19 | OVERCEIL' FAIL, REOPEN' FAIL, SLOW'/CANCEL' FAIL; stopped-line count 0 |
| refusal-contract-baseline, re-run once | 1 | 14:57:45 | 15:02:26 | OVERCEIL' FAIL, REOPEN' FAIL, SLOW'/CANCEL' PASS; stopped-line count 0 |

I did not run the other suites, the residency-harness, the three scriptless drivers or `e2e:table`.

**The failure (`m4c-hs-refusal.log`, `m4c-hs-refusal2.log`)**
- OVERCEIL' (both runs), byte-copied: "OVERCEIL': .canvas-refusal not present after admitting the over-ceiling fixture (settled=true)".
- REOPEN' (both runs): "REOPEN': timed out after 60000ms".
- SLOW'/CANCEL' run 1: "SLOW'/CANCEL': .canvas-refusal not present after admitting the slow fixture -- declared precondition (this fixture overflows MAX_RESIDENT_VERTICES on the unfiltered first look) not observed (settled=true)". In run 2 it passed.
- The base series at a533a598 passed this suite in 42 s, with all three steps PASS (`m4c-e2e-refusal.log`).
- Comparison of the render-trace reports (`m4c-hs-refusal.rep.refusal-contract-baseline-render-trace-*.json`, `m4c-hs-refusal2.rep.*`, and the base's `m4c-e2e-refusal.rep.*`): the per-stream residency pushes and clears are identical. The over-ceiling stream stops at the same place in all three, with 1,961,249 vertices resident and the next push refused. That is not a count difference. The DOM `.canvas-refusal` is what is missing at the head.
- I did not diagnose the cause. Diffs from a533a598 to HEAD that I looked at did not show it: App.tsx, WorkingCanvas.tsx, the stream managers and StudioLayout.
- Timing: the machine's CPU load read 100% in three samples after the runs, with none of my processes running. Both runs were slower than the base (mount-readiness 12 to 26 s, whole suite 3.5 to 4.7 min). The identical engine trace speaks against a pure timing cause. It does not settle it, so I report it to the custodian and do not record it as an I3 failure.
- The stopped line (Amendment 7 item 5) appeared in none of the three runs (count 0 in each suite log).

**PC-E1 to PC-E4**
Not run. The series stopped before `e2e:table`. No tracked file was edited, so there is nothing to revert.

**Copied files (all in the `out/` folder above)**
- Per run (tags `regression`, `refusal`, `refusal2`): `m4c-hs-<tag>.log`, `.busy.txt`, `.down.txt`, `.rc.txt`, `.app.err.log`, `.app.out.log`, `.vite.err.log`, `.session.log`, and `.rep.*` files.
- Other: `m4c-hs-build-exe.log`, `m4c-hs-build-wrap.txt`, `m4c-hs-oracle.log`, `m4c-hs-oracle-wrap.txt`, `m4c-hs-npmci-shell.log`, `m4c-hs-npmci-bv.log`, `m4c-hs-bvbuild.log`, `m4c-hs-fix-before.txt`, `m4c-hs-fix-after.txt`.
- Hold and wrapper outputs: `m4c-hs-hold-regression.txt`, `m4c-hs-hold-refusal.txt`, `m4c-hs-hold-refusal2.txt`, `m4c-hs-wrap-<tag>.txt`.

**Processes and state at the end**
- Each run's app-down killed only the PID trees that app-up recorded (e.g. "killed tree 15428", "killed tree 42968").
- app-down's own port line right after two kills said "port 9223 still listening, owner pid ..." (a WebView2 child still exiting). My later check printed port 9223 free and port 5400 free.
- The busy script printed FREE, so no process I started is still running.
- `git status --porcelain` is empty and HEAD is bc315fb9d163dc292501618836bc25353c467bd8. I made no commit and no push.

**Hold lines (my project's only; the full MACHINE_HOLD lines are in the hold files above)**
- The build, oracle and regression holds, and the refusal run 1 and re-run holds, each printed one `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...` line, granted at once, and one `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)` line.
- Deviation from the prescribed call shape, disclosed: for the build and the generator run I added an `echo` of the rc to a scratch file between `release` and `exit $rc`. For the suite runs I redirected the hold and release output into files.
- Harness caveat: the first suite call used a run-suite whose default timeout was 400 s. Neither refusal run hit it.

Absolute path of the scratch folder (no tracked file was written): `<the session scratch folder>/m4c-hs-h/`.
