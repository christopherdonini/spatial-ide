*Custodian's filing note (2026-11-10): the worker's three reports for `publish-e2e-filtered-step-shared-run-failure` (slot 2), under its five-line form (`governance/forms/frontends/PUBLISH-E2E-FILTERED-STEP-SHARED-RUN-FAILURE-PREREGISTRATION.md`) and the human's rulings of 2026-11-09. Its brief was given by file (15921 bytes, sha256 611e47c186b3b4bc62cf97e9e309543db61f726106ec380b234b959c1a790f97). Dispatched at 2026-11-09T23:36:39Z by its transcript; the run went to 2026-11-10T00:26:24Z (claude-sonnet-5-5; unique calls: Read 4, Bash 67, the three hand-backs, 74 in all; no errored call). The worker stopped twice at step 1, the exe build, and both stops were right. Their cause was the custodian's brief: it did not name two gitignored build products that the shell's tauri resources list and a fresh worktree lacks, the viewer's `dist/` and the shell's generated `NOTICE.txt`. Addendum 1 (1066 bytes, sha256 b834f7278f8a2d390aabd61f58c9c63a3ee12ef8999bff4c690714d587fd9460), building the viewer's dist first, reached the worker at 2026-11-09T23:52:50Z by its transcript; Addendum 2 (1282 bytes, sha256 ad2b79d5368f5c2e18aae9866020a8d74643c47bf6cbd63ebec76053c2d24a98), generating the shell's notice and showing all three resource paths, at 2026-11-09T23:54:13Z. The custodian keeps the two failed builds' logs as `<S>/pef-a1-build-exe.log` and `<S>/pef-a2-build-exe.log`. The three reports below were extracted by script from the three hand-backs in that transcript, in order, each unchanged under the custodian's heading; scratch paths in them are the custodian's scratch folder, `<S>` in these records, and `<H>` is the harness copy at `<S>/pef-e2e-h`. The custodian checked by script: origin's branch head is 6bb26b0ce94b45b15435638dea9ffea3a9346ab8, two commits on 391f5934 (C1 d532cf7d240314e178182263bf935c86fa08acf9, then the doc commit), and its only file is `frontends/shell/e2e/publish.mjs`, 26 lines added and 5 deleted. The four run logs under `<H>/out/` start at the heads the report gives (p0 at 391f5934, p1 and m-flag at d532cf7d, r1 at 6bb26b0c) and end as it says: p0 rc=1, FILTERED' failing at the execute on the filter-changed refusal; p1 rc=0; m-flag rc=1 at the wait's 20000ms bound; r1 rc=0. 11 hold-shaped calls each carry a shared hold line and its release; 9 of them ran in the Bash tool's background mode, so their lines are in their output files, not in the immediate results.*

---

## Report 1 (hand-back at 2026-11-09T23:52:16Z, 3084 bytes, sha256 affdc239b5e4871c108dfc55db05ed8bc25c38f89ae3039ab17495844179cb8b)

Stopped: publish-e2e-filtered-step-shared-run-failure, harness failure at step 1 (the exe build). No code written, no commit, no push, no run.

What was done:
- origin/main is 391f5934bc960d39be07140ecf3c6d9f0abeab8c (git fetch rc=0). The form's sha256 at it is 712d763ff24b432f4cc0afa54d750f1a890dc2c4302f676e7cd3508fad2d1014, as given.
- Worktree C:/dev/wt/pef created on branch cut/publish-e2e-filtered-step-shared-run-failure at 391f5934.
- `npm ci` rc=0 in frontends/shell and rc=0 in renderer/bundle-viewer. Each printed only the esbuild allow-scripts warning.
- All 9 harness files match the given sizes and sha256 (884/4e49f5df..., 210/e1050d11..., 1833/5581b704..., 626/b26c2360..., 983/13486694..., 1583/0ccf5555..., 293/0dc02596..., 224/bc7ae0db..., 304/73dd21a1...). I read each whole and changed none.
- Fixture C:/dev/spatial-ide/target/fixtures/manual-walkthrough/filter-zoned.parquet: 409872 bytes, sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46. Read only.
- The form and both directives were read whole.

The failure:
- `pef-e2e-build-exe.sh` ran inside a shared hold. Hold line: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:5804`. Release: `MACHINE_RELEASED project=SpatialIDE shell=bash.exe:5804 affinity=FF (cores 0-7)`.
- cargo exited 101 in the spatial-ide-shell build script. The line in `<H>/out/pef-e2e-build-exe.log` is: `glob pattern ../../../renderer/bundle-viewer/dist/* path not found or didn't match any files.`
- `frontends/shell/src-tauri/tauri.conf.json:41` lists `../../../renderer/bundle-viewer/dist/*` as a bundled resource.
- A fresh worktree has no `renderer/bundle-viewer/dist`. It is a gitignored build product, and the harness's build script does not produce it.
- My reading, not verified by any run: building bundle-viewer first (probably `npm run build` there, from the `build.mjs` in that folder) would let the exe build proceed.
- I did not do it, because the brief's stop rule covers "a harness failure" and says never to route around one.

Decision for you: tell me whether building bundle-viewer's dist in `C:/dev/wt/pef` (gitignored, no tracked file touched) is allowed as a step before the exe build. If it is, I redo step 1 onward. A fresh worker can also redo it from the start.

State left:
- Worktree C:/dev/wt/pef at 391f5934, `git status --porcelain` empty.
- `D:/wt-targets/pef` holds a partial cargo build, with no exe and no `exes/` folder.
- `<H>/out/` holds only `pef-e2e-build-exe.log`.
- Pushed nothing. No port or suite process was started.
- Background shells: the two wait-loops I started for notifications have both completed. The build shell (task id bc89przzo) has exited. None are running. I killed no process by PID, because none was left.
- Off-scope noticed, not done: the exe build's prerequisite (bundle-viewer dist) is missing from the brief and the harness.

Self-check before gate: not applicable (no code, no gate requested).
Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it. No override. No context handoff received or produced.

## Report 2 (hand-back at 2026-11-09T23:53:44Z, 2910 bytes, sha256 70c53a12a2e96198ee065699e4efcaeda77075827d28b3eb20f97c05a12f350f)

Stopped: publish-e2e-filtered-step-shared-run-failure, harness failure at step 1 again (the exe build, second attempt). No code, no commit, no push, no suite run.

First attempt (as reported earlier):
- Worktree C:/dev/wt/pef created at 391f5934bc960d39be07140ecf3c6d9f0abeab8c.
- origin/main was 391f5934bc960d39be07140ecf3c6d9f0abeab8c. The form's sha256 was 712d763ff24b432f4cc0afa54d750f1a890dc2c4302f676e7cd3508fad2d1014, as given.
- `npm ci` rc=0 in frontends/shell and rc=0 in renderer/bundle-viewer.
- All 9 harness files matched their given sizes and sha256.
- Fixture filter-zoned.parquet: 409872 bytes, sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46.
- The first exe build failed with: `glob pattern ../../../renderer/bundle-viewer/dist/* path not found or didn't match any files.` (exit 101).

Addendum 1, step 1 (the viewer's dist):
- Ran `npm run build` in renderer/bundle-viewer inside a shared hold, rc=0.
- Last lines: `scan-dist: 3 files scanned, 2 findings, all reviewed; record written`, then the lines for the NOTICE.txt credential row (matched), the NOTICE.txt local-filesystem-path row (matched) and the app.js local-filesystem-path row (not found).
- `dist/` holds NOTICE.txt (163998 bytes), app.js (333011) and index.html (6463).
- `git status --porcelain` was empty after it.

Second exe build (Order step 1, redone, shared hold, exit 101):
- The log's last lines are: `resource path `..\src\generated\NOTICE.txt` doesn't exist`, then `warning: build failed, waiting for other jobs to finish...`
- Hold granted and released cleanly (shell bash.exe:59932). No cargo or rustc process of mine remains.
- The shell's tauri resources list `frontends/shell/src/generated/NOTICE.txt`. That is another gitignored build product, and `frontends/shell/src/generated` does not exist in the worktree.
- From package.json (not run): `generate:notice` is `node scripts/generateNotice.mjs`, and the `prebuild` and `pretypecheck` hooks run `node scripts/buildViewerFirst.mjs && npm run generate:notice`.
- I did not run it. Addendum 1 allows only the viewer's dist, and the stop rule says never to route around a harness failure.

State left:
- Worktree C:/dev/wt/pef at 391f5934, porcelain empty. Gitignored additions are renderer/bundle-viewer/dist and the node_modules.
- D:/wt-targets/pef holds a partial cargo build and no exe.
- Pushed nothing. No port or suite process was started.
- Background shells: all finished, none running, and I killed no process by PID.

Decision for you: allow `npm run generate:notice` in C:/dev/wt/pef/frontends/shell (writes the gitignored src/generated/NOTICE.txt) before the exe build. Then I redo step 1 onward. The shell's `npm run verify` builds both products itself, so the verify step later should not hit this.

Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it. No override. No context handoff received or produced.

## Report 3 (hand-back at 2026-11-10T00:26:23Z, 6500 bytes, sha256 e98f8ee4d07811aacb7a42197526f9cc7595ef489a5d33bc20259c669acd9b95)

Built: publish-e2e-filtered-step-shared-run-failure at 6bb26b0ce94b45b15435638dea9ffea3a9346ab8 (pushed; origin's branch equals HEAD; `git status --porcelain` empty)

Earlier attempts (as reported to you):
- Attempt 1: exe build exit 101, `glob pattern ../../../renderer/bundle-viewer/dist/* path not found`.
- Attempt 2, after Addendum 1's viewer `npm run build` (rc=0; dist holds NOTICE.txt, app.js, index.html; porcelain empty): exit 101, `resource path `..\src\generated\NOTICE.txt` doesn't exist`.
- Addendum 2: `npm run generate:notice` in frontends/shell, rc=0, wrote src/generated/NOTICE.txt (3427745 bytes), porcelain empty.
- All three resource paths then existed: dist/ (163998 + 333011 + 6463 bytes), viewer-asset-hashes.json (261 bytes), src/generated/NOTICE.txt (3427745 bytes).

Setup:
- origin/main was 391f5934bc960d39be07140ecf3c6d9f0abeab8c. The form's sha256 at it is 712d763f...1014.
- Worktree C:/dev/wt/pef; `npm ci` rc=0 in frontends/shell and in renderer/bundle-viewer.
- All 9 harness files matched the given sizes and sha256. The fixture is 409872 bytes, sha256 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46.
- Exe build (shared hold) exit 0, `Finished dev profile ... in 3m 20s`, `copied exe`. The exe is 90920448 bytes, mtime 2026-11-10 00:58:03 +0100.

Runs (each in a shared hold; all matched their predictions):
- **p0 at B:** exit 1.
  - OPEN, APPROVED' and REFUSED' PASS; EXPIRED' SKIP.
  - FILTERED' FAIL: `execute returned {"status":"refused","message":"[P6 placeholder] The export was not run, because the filter changed after it was prepared. Nothing was written. Prepare it again."}, expected {status:"success"}`.
  - Last line `rc=1 end 2026-11-10T00:10:59Z`. App-down: both ports free.
  - Patch at `<S>/pef-p0.patch`, reverted, porcelain empty. Audit log 2061 bytes. Session log copied to `<S>/pef-p0.session.log`.
- **p1 (patch `<S>/pef-p1.patch`):** exit 0.
  - OPEN, APPROVED', REFUSED' PASS; EXPIRED' SKIP.
  - FILTERED' PASS: `filter_scope null under whole-file with the filter on; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000)...`.
  - Last line `rc=0 end 2026-11-10T00:12:27Z`. Ports free. Reverted, porcelain empty. Audit log 3153 bytes. Session log copied.
- **m-flag** (App.tsx diff: `filterActive={activeFilter !== null}` to `filterActive={false}`, exactly one occurrence): exit 1.
  - OPEN, APPROVED', REFUSED' PASS; EXPIRED' SKIP.
  - `[FILTERED'] FAIL (20101ms): FILTERED': the wait for the prepare hook to be replaced after the Apply did not end within 20000ms`.
  - Last line `rc=1 end 2026-11-10T00:13:25Z`. Ports free. Reverted, porcelain empty. Audit log 2061 bytes. Session log copied.
- **r1 at the head:** exit 0. OPEN, APPROVED', REFUSED', FILTERED' PASS; EXPIRED' SKIP. Last line `rc=0 end 2026-11-10T00:14:37Z`. Ports free. Audit log 3153 bytes. Session log copied.
- For every run the first line, result lines, app.err.log head, reports copied and the full logs are in `<H>/out/pef-e2e-<tag>.*`. The app.err.log has only 2 lines, so its first and last 20 lines are the same two: the session-log path and `data-plane expected origin (config mirror): http://localhost:5180`.

Code and commits:
- **Commit 1:** d532cf7d240314e178182263bf935c86fa08acf9, `fix: publish-e2e-filtered-step-shared-run-failure, FILTERED' waits for the prepare hook's re-registration after the Apply before it prepares`.
  - `stepFiltered` makes one `page.evaluate` that captures the hook, awaits `queryWithFilter`, and on `applied` polls until the hook differs. Each turn sleeps 1000 ms, inside a 20000 ms deadline. It returns the outcome and whether the hook was replaced.
  - The `applied` check is unchanged. A new throw names FILTERED', the wait and 20000ms. The prepare stays its own `pairEvaluate`.
  - The doc comment is adjusted, and the header gains a section covering what the wait waits on and why, the timeout and what its failure names, and that it is a precondition.
- **Commit 2:** 6bb26b0ce94b45b15435638dea9ffea3a9346ab8, `docs: publish-e2e-filtered-step-shared-run-failure, M-FLAG recorded as observed at d532cf7d`. The header gains a RECORDED MUTATION entry with the Observed line byte-copied by script from m-flag's log, naming C1's 40-hex id.
- Both are signed off; no `@` outside the first trailer line.

Step 7 at the head (6bb26b0c), exit codes:
- `npm run verify` (shell, shared hold): 0. Last printed line is `ℹ duration_ms 11.9503`.
- Scripts `node --test`: 0; tests 598, pass 598, fail 0.
- `verify-cites`: 0. `verify-quotes` (shared hold): 0, `155 checked, 124 verified ...`. `verify-test-claims`: 0. `verify:plan --offline`: 0.
- `git diff --numstat B...HEAD`: `26 5 frontends/shell/e2e/publish.mjs`. `--name-only`: that file only. Total 31 against the declared 40, no overrun.

Pre-gate self-check:
- The cross-module path uses the real `E2eTestSurface` hooks: `registerE2eHook` in `e2e-test-surface.ts` and the PublishPanel effect.
- Every completion claim is backed by a log.
- No user-facing app message was added.
- Every required run reached its assertion: p0 at the execute, m-flag at the wait's timeout, p1 and r1 through to FILTERED''s manifest checks.

Harness disclosure (item 1 of the approval of 2026-10-11): debug exe built with the TAURI_CONFIG overlay (CDP 9223, localhost:5180 mapped to 127.0.0.1:5400); Vite on 5400 with --strictPort; the npx shim on PATH for those runs only. It wrote only:
- `<S>/pef-*` scratch files and `<H>/out/` (by the harness itself).
- `D:/wt-targets/pef`.
- The worktree's gitignored `target/`, `node_modules/`, `dist/`, `src/generated/` and `e2e/out/`.
- The app's own per-user log folder.
- No tracked file changed except publish.mjs (App.tsx was mutated and reverted).

Hold lines: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF shell=bash.exe:<pid>` each, with a matching `MACHINE_RELEASED` after the viewer build, notice, exe build, p0, p1, m-flag, r1, verify and verify-quotes. No refusals.

Push: `git push -u origin cut/publish-e2e-filtered-step-shared-run-failure` in its own call. Branch is new, origin equals 6bb26b0c. No PR opened.

Background shells: none running. Every background call exited, including the wait-loops, and no app process remains. I killed nothing by PID.

Noticed, not done: the brief's "show it has no @" check was done by grep on the message files, not shown separately.

Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it; no override; no context handoff.
