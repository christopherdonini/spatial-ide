*Custodian's filing note (2026-10-23): #241's R1 at 147ef82c by a tester under the port-5400 harness (the redaction form's Amendment 9 item 4). The run 18:03:31Z to 18:20:16Z by its transcript (Bash 14); its claims were read against that transcript's calls before filing: no commit, push or PR call; its Write calls only on its `rds-r1c-` scratch files. Its STOP is a step outside R1's predictions, FILTERED', failing in a shared run, with APPROVED' and REFUSED' as predicted; by the machine rule the custodian re-runs it alone, and the form's Amendment 11 records the order. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder, and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 7f2bd2fa222b8cacd9d95fc3f622903d0aed7e3ba3d03b4b7dbed4b1d5131ae7.*

---

R1: bundle-redaction-scan-not-in-product-publish at 147ef82c7d14b537b5c3fc51673090c9b082a1f5, tester, port-5400 harness
Result: STOP, the suite exited 1 because FILTERED' FAILED (filter_scope was null where the step expects a text). APPROVED' and REFUSED' passed as predicted, and every viewer/ hash equals the record. Nothing was changed or retried. The custodian decides what FILTERED' means.

Model: the harness states I run as Sonnet 5.5 (claude-sonnet-5-5). No override, no context handoff. No usage figures at hand.

Four failure classes for this harness:
- Interface: it drives the real debug app and its real IPC. The suite uses its documented dev-only destination seam, so the native save dialog is not exercised. The viewer files come from the real publish path.
- Result claims: every claim below points to a file named rds-r1c-* in the scratchpad folder (<scratch>/).
- Operator-facing lines: the suite lines are byte-copied from rds-r1c-suite.log, written by this run at this commit.
- Assertions: APPROVED' and REFUSED' reached their assertions. FILTERED' reached its assertion and failed there.

Steps (each in the foreground with a timeout and output to a file):
1. `git status --porcelain` was 0 bytes before the run and 0 bytes after. `git rev-parse HEAD` = 147ef82c7d14b537b5c3fc51673090c9b082a1f5 (rds-r1c-head.txt, rds-r1c-status0.txt).
2. `npm run build` in renderer/bundle-viewer: rc 0 (rds-r1c-viewer-build.log). Last four scan lines:
   - scan-dist: 3 files scanned, 2 findings, all reviewed; record written
   - scan-dist: reviewed row NOTICE.txt credential 19092: matched
   - scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched
   - scan-dist: reviewed row app.js local-filesystem-path 7291: not found
   viewer-asset-hashes.json equals `sha256sum` of dist/, each 64 lowercase hex:
   - NOTICE.txt 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
   - app.js 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8
   - index.html 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c
3. The fixture filter-zoned.parquet exists. Its sha256 is 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46 (rds-r1c-fixture-sha.txt). I did not regenerate it.
4. Exe build: under a shared hold, `rds-r1c-build-exe.sh` with `CARGO_TARGET_DIR=D:/wt-targets/rds`, `CARGO_BUILD_JOBS=8` and the TAURI_CONFIG overlay. rc 0, "Finished `dev` profile ... in 12m 01s", exe copied to D:/wt-targets/rds/exes (rds-r1c-build-exe.log, rds-r1c-build-wrap.txt).
   Suite: under a second shared hold, `rds-r1c-run-suite.sh` ran `npm run e2e:publish` in frontends/shell with `timeout 1500`. Exit code 1 (rds-r1c-suite.log, "rc=1 end 2026-10-23T18:19:23Z", started 18:17:06Z). The suite printed the path of the new audit log rds-r1c-audit.jsonl, so SPATIAL_IDE_AUDIT_LOG reached the launched app. Cargo used the piece's target folder this time, so the verify-bundle example built quickly.
   Lines for APPROVED' and REFUSED', byte-copied:
   - [APPROVED'] PASS (3618ms): prepared+executed with attempt 00195183c97fb917cd376c625437749e; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination "C:/dev/wt/rds/target/e2e-publish-out/approved-1792779559234-84514/bundle", no credential needle); prepare-to-execute 4ms
   - [REFUSED'] PASS (41ms): prepared with attempt e83c49be17e2ce4968775c1382a042a3, refused on the wrong phrase; no bundle directory, no .staging-* debris under C:\dev\wt\rds\target\e2e-publish-out\refused-1792779562851-407304; audit pair intent+outcome refused, error_kind ApprovalRefused; prepare-to-execute 4ms
   Other steps: OPEN PASS, EXPIRED' SKIP (no TTL knob, as before). The FAILURE, byte-copied:
   - [FILTERED'] FAIL (111ms): FILTERED': filter_scope mismatch.
   - Expected: this bundle format cannot record a row predicate (ADR-017 §8, bundle_version 1); publishing publishes the viewport extent, not your filter
   - Actual:   null
   At 2fc01f59 FILTERED' passed (2000 rows, whole-file). This is the one difference from that run. The head's only change is a doc comment in publish.rs, so I cannot explain it. I did not investigate or retry. It may be a state-dependent or flaky step in a shared run, or a real change in what the prepare returns; I have no evidence which. A single alone-on-the-machine re-run would tell.
5. The viewer/ files of APPROVED's bundle (target/e2e-publish-out/approved-1792779559234-84514/bundle/viewer, rds-r1c-bundle-viewer-sha.txt). Each equals the build record's entry for the same path, and NOTICE.txt matches the prediction:
   - NOTICE.txt 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
   - app.js 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8
   - index.html 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c
   verify-bundle JSON: verified true, viewer_assets 3, rows 2000 (rds-r1c-verify-approved.json). No refusal occurred at any viewer/ file.
6. Audit pairs from rds-r1c-audit.jsonl (4 lines, 2 pairs; the audit log has no FILTERED' pair because that step failed before executing). The audit attempt ids differ from the ids the suite prints; the last R1's report showed the same difference:
   - Pair 1 (attempt 7237f6b1e015013c, the APPROVED' pair): outcome `success`, error_kind null.
   - Pair 2 (attempt 96b1dc5090da7463, the REFUSED' pair): outcome `refused`, error_kind `ApprovalRefused`.
7. Copies in the scratch folder:
   - App stderr: rds-r1c-app.err.log (2 lines, naming the session log and the data-plane origin). rds-r1c-app.out.log is empty.
   - Session log: rds-r1c-session.log (1416 bytes). Its only line matching "error" or "panic" is the line "policy recovery policy: none -- fail visibly and terminate the canvas with a surfaced error".
   - The suite's report is the printed summary in rds-r1c-suite.log. Also copied: rds-r1c-verify-approved.json, rds-r1c-e2e-out-app.log (stale), rds-r1c-vite.out.log, rds-r1c-vite.err.log, and the hold and release files.
   Processes: the app-down script killed the two process trees it started, by PID (50832 and 46332). It printed "port 9223 free" and "port 5400 free". The busy check afterwards printed FREE. `Get-Process` for both PIDs counted 0. Note the suite's own line "This run launched the app; it stays RUNNING on CDP port 9223" was about the app, which the down script then stopped.

Harness as run: copies of the r1b scripts with `r1b` changed to `r1c` (rds-r1c-build-exe.sh, rds-r1c-app-up.ps1, rds-r1c-app-down.ps1, rds-r1c-busy.ps1, rds-r1c-tauri.conf.json, rds-r1c-shim/npx.cmd, rds-r1c-run-suite.sh).
- One change beyond the names: rds-r1c-run-suite.sh also exports CARGO_TARGET_DIR=D:/wt-targets/rds, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. The r1b copy omitted the target folder and caused the earlier cold-build death.
- Overlay: window additionalBrowserArgs adds `--remote-debugging-port=9223` and `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`.
- Vite on 127.0.0.1:5400 with `--strictPort`, and the npx shim on PATH for this run only.
- The busy check read FREE before and after.

Hold lines (SpatialIDE only):
- Build: "MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ..." and "MACHINE_RELEASED project=SpatialIDE ...".
- Suite: the same pair.
- No exit code 96 to 99.
- The FILTERED' failure is a suite exit 1 in a shared run, which the rules would have me report rather than record as a failure. I am reporting it for a re-run alone on the machine.

Never-list: no tracked file changed (git status empty after), no commit or push, no claude command, no port or service change. Ignored outputs written: target/e2e-publish-out/ and frontends/shell/e2e/out/ verify JSONs in the worktree, and D:/wt-targets/rds.
