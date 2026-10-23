*Custodian's filing note (2026-10-22): #241's R1 by a tester at 2fc01f59, under the port-5400 harness approval of 2026-10-11 (the human's word of 2026-10-22): as predicted, on its second suite attempt. The first died at the suite's 15-minute deadline in a cold cargo build of the verify-bundle example, which ran without the piece's target folder (the tester's harness omission, disclosed); the app never launched then. The run 12:39:52Z to 13:10:25Z by its transcript (Bash 21); its claims were read against that transcript's calls before filing. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 8b3d7853c199ee7163aaa22a151ccd45da820fb549a3855092f430af7bdd501b.*

---

R1: bundle-redaction-scan-not-in-product-publish at 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d, tester, port-5400 harness
Result: as predicted (on the second suite attempt; the first died from my harness omission, see step 4)

Model: the harness states I run as Sonnet 5.5 (claude-sonnet-5-5). No override, no context handoff. No usage figures at hand.

Four failure classes for this harness:
- Interface: it drives the real debug app and its real IPC. The suite uses the dev-only destination seam its header documents (the native save dialog is not exercised). The viewer files come from the real publish path.
- Result claims: every one below points to a file in the scratchpad folder, all named rds-r1b-*. Folder: <the session scratch folder>/
- Operator-facing lines: the suite's own lines were byte-copied from rds-r1b-suite.log, which this run wrote at this commit.
- Assertions: APPROVED' and REFUSED' reached their assertions (bundle verified by verify-bundle; audit lines read back).

Steps (each in the foreground with a timeout, output to a file, rc printed):
1. `git status --porcelain` was empty (0 bytes, rc 0) before the run, and empty again after. `git rev-parse HEAD` = 2fc01f5955a0dc21d51ee4cdffc3e5c55800959d.
2. `npm run build` in renderer/bundle-viewer: rc 0. Last four scan lines (log: rds-r1b-viewer-build.log):
   - scan-dist: 3 files scanned, 2 findings, all reviewed; record written
   - scan-dist: reviewed row NOTICE.txt credential 19092: matched
   - scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched
   - scan-dist: reviewed row app.js local-filesystem-path 7291: not found
   viewer-asset-hashes.json against sha256sum of dist/ (each 64 lowercase hex, all equal):
   - NOTICE.txt 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
   - app.js 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8
   - index.html 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c
3. The fixture filter-zoned.parquet exists (409872 bytes). Its sha256 is 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 (rds-r1b-fixture-sha.txt). I did not regenerate it.
4. The suite, `npm run e2e:publish` in frontends/shell, under the harness:
   - Attempt 1: died with rc 2. The suite's own `cargo build -p spatial-kernel --example verify-bundle` ran without CARGO_TARGET_DIR (my script omitted it), so it compiled cold into the worktree's ignored target/, which the Never list permits. The 15-minute SPATIAL_E2E_DEADLINE_MS expired during that build. The app never launched and no audit log was written (rds-r1b-suite-attempt1.log). I retried once without changing anything else, because the example was by then built in the worktree target/. The suite's cargo call therefore used the worktree's own target/ and not D:/wt-targets/rds, which deviates from the brief. I did not touch tracked files.
   - Attempt 2: rc 0 (rds-r1b-suite.log, 13:07:50Z to 13:08:57Z). SPATIAL_IDE_AUDIT_LOG was a new file in my scratch folder, and the suite printed that path, so it reached the launched app. Lines, byte-copied (the REFUSED' line is cut here at the audit pair's end; its full line is in the log):
     - [APPROVED'] PASS (10946ms): prepared+executed with attempt d05bc0db15b6f60d9e6834e95e43b148; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination "C:/dev/wt/rds/target/e2e-publish-out/approved-1792674509828-518627/bundle", no credential needle); prepare-to-execute 82ms
     - [REFUSED'] PASS (445ms): prepared with attempt 231801f0ffdca31857bc493f8ce66bd9, refused on the wrong phrase; no bundle directory, no .staging-* debris under C:\dev\wt\rds\target\e2e-publish-out\refused-1792674520775-668148; audit pair intent+outcome refused, error_kind ApprovalRefused; prepare-to-execute 17ms
   - Also: OPEN PASS, FILTERED' PASS (2000 rows, whole-file), EXPIRED' SKIP with the suite's stated reason (no TTL knob).
5. The bundle's viewer/ files under target/e2e-publish-out/approved-1792674509828-518627/bundle/ (rds-r1b-bundle-viewer-sha.txt). All three equal the build record's entry for the same path:
   - NOTICE.txt 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb. This matches the prediction.
   - app.js 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8
   - index.html 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c
   verify-bundle's JSON: verified true, viewer_assets 3, rows 2000 (rds-r1b-verify-approved.json). No refusal occurred at any viewer/ file.
6. Audit pairs, from rds-r1b-audit.jsonl:
   - APPROVED' attempt d213c6d75aeb2b45: outcome `success`, error_kind null.
   - REFUSED' attempt bba0acb9a549d167: outcome `refused`, error_kind `ApprovalRefused`.
   - A third pair (FILTERED', attempt 5fbc3e060eca8848) is outcome `success`, error_kind null.
7. Copies in the scratchpad folder:
   - App stderr: rds-r1b-app.err.log (203 bytes, 2 lines, naming the session log and the data-plane origin). rds-r1b-app.out.log is empty.
   - Session log: rds-r1b-session.log (2816 bytes). Its only line matching "error" or "panic" is the line "policy recovery policy: none -- fail visibly and terminate the canvas with a surfaced error".
   - The suite writes no separate JSON report. Its report is the printed summary in rds-r1b-suite.log, plus the verify-bundle outputs rds-r1b-verify-approved.json and rds-r1b-verify-filtered.json. e2e/out/app.log is an empty stale file, copied as rds-r1b-e2e-out-app.log.
   - Also: rds-r1b-vite.out.log, rds-r1b-vite.err.log, rds-r1b-hold-*.txt, rds-r1b-release-*.txt, rds-r1b-build-exe.log.

Harness as run (copies of the mm2a scripts with paths and names changed; mm2a itself untouched):
- Scripts: rds-r1b-build-exe.sh, rds-r1b-app-up.ps1, rds-r1b-app-down.ps1, rds-r1b-busy.ps1, rds-r1b-tauri.conf.json, rds-r1b-shim/npx.cmd, and my rds-r1b-run-suite.sh.
- Overlay: window additionalBrowserArgs adds `--remote-debugging-port=9223` and `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`.
- Exe: built with `TAURI_CONFIG` from that overlay, `CARGO_TARGET_DIR=D:/wt-targets/rds`, `CARGO_BUILD_JOBS=8`. The build took 4m12s, rc 0, from `frontends/shell/src-tauri` at this HEAD. The exe was copied to D:/wt-targets/rds/exes/.
- Vite on 127.0.0.1:5400 with `--strictPort`; the shim `npx.cmd` stands in for `npx tauri dev` on PATH for this run only.
- The busy check read FREE before the run and after it.

Processes: the app-down script killed the two process trees it had started, by PID (16052 and 35456, recorded by the app-up script). Afterwards it printed "port 9223 free" and "port 5400 free". The busy check printed FREE and `Get-Process` for both PIDs counted 0. No tracked file was changed (git status empty after), nothing was committed or pushed, and I made no claude command or port or service change.

Hold lines (SpatialIDE only):
- Build: "MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ..." and "MACHINE_RELEASED project=SpatialIDE ...".
- Suite attempt 1: the same hold and release pair (rds-r1b-hold-run-attempt1.txt, rds-r1b-release-run-attempt1.txt).
- Suite attempt 2: the same hold and release pair (rds-r1b-hold-run.txt, rds-r1b-release-run.txt).
- No exit code 96 to 99. No timing-sensitive failure was seen: attempt 1's deadline hit came from the cold cargo build, not from the product.

Ignored build outputs I wrote: target/e2e-publish-out/ and the worktree target/debug (about 2 GB, from the suite's cargo build), and frontends/shell/e2e/out/ verify JSONs. All are ignored.
