*Custodian's filing note (2026-10-23): #241's R1 at its final head 50c634a8 by a tester under the port-5400 harness, with F7's section 4 item 4 at the same head (the redaction form's Amendment 12). The run 18:54:47Z to 19:01:31Z by its transcript (Bash 16, Read 2); its claims were read against that transcript's calls before filing: no commit, push or PR call; its Write calls only on its `rds-r1d-` scratch files. As predicted; FILTERED' passed, so the custodian's solo re-run (Amendment 11 item 1) is not owed. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder, and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is e32d4f4fb7b2a252f7196a616ec139498212d2349a2a376c9975384ce88c0167.*

---

R1: bundle-redaction-scan-not-in-product-publish at 50c634a85e0486bba0d7bff425defd91fcbab788, tester, port-5400 harness
Result: as predicted. The suite exited 0. APPROVED', REFUSED' and FILTERED' all passed, and F7's section 4 item 4 passed in all its checks.

Model: the harness reports me as Sonnet 5.5 (claude-sonnet-5-5). No override and no context handoff. No usage figures at hand.

Four failure classes for this harness:
- Interface: it drives the real debug app and its real IPC. The suite uses its documented dev-only destination seam, so the native save dialog is not exercised. R2 covers that.
- Result claims: every claim below points to a file named rds-r1d-* in the scratch folder `<the session scratch folder>/`, or to the transcript.
- Operator-facing lines: the suite lines are byte-copied from rds-r1d-suite.log, written at this commit.
- Assertions: all three steps reached their assertions.

**Machine reading** (`<M> status -Project SpatialIDE`, read only):
- The command printed one line and then did not return. My `timeout 60` ended it with rc 124.
- Line, byte-copied: `hold project=SpatialIDE mode=shared kind=hold pid=16136 started=2026-10-23T18:54:48.494Z what="port-2 build: mutation M2 on A2" expectedMinutes=15 cores=0-7`, then `bookings none`.
- So this project had another shared heavy hold running (the port-2 build). I did not wait for it or stop it. My shared holds were granted alongside it (rds-r1d-status0.txt).

**Steps**
1. `git status --porcelain` was 0 bytes before and 0 bytes after (rds-r1d-status1.txt). `git rev-parse HEAD` = 50c634a85e0486bba0d7bff425defd91fcbab788.
2. `npm run build` in renderer/bundle-viewer: rc 0 (rds-r1d-viewer-build.log). Last four lines, byte-copied:
   - `scan-dist: 3 files scanned, 2 findings, all reviewed; record written`
   - `scan-dist: reviewed row NOTICE.txt credential 19092: matched`
   - `scan-dist: reviewed row NOTICE.txt local-filesystem-path 111337: matched`
   - `scan-dist: reviewed row app.js local-filesystem-path 7291: not found`
   - viewer-asset-hashes.json equals `sha256sum` of dist/, each 64 lowercase hex:
     - NOTICE.txt 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb
     - app.js 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8
     - index.html 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c
3. The fixture filter-zoned.parquet exists (409872 bytes). Its sha256 is 92ed800ccbcc335e9078406bc0893d5b3c375b404e7e96b36ed43c4515112e46, the same as at the last R1 (rds-r1d-fixture-sha.txt). I did not regenerate it.
4. Exe build:
   - Run in a shared hold with `rds-r1d-build-exe.sh` (CARGO_TARGET_DIR=D:/wt-targets/rds, CARGO_BUILD_JOBS=8, TAURI_CONFIG overlay). rc 0, "Finished `dev` profile [unoptimized + debuginfo] target(s) in 3m 41s", exe copied.
   - One deviation: this call ran in the background (the tool's foreground limit is 10 minutes and the last build took 12). I waited on its rc file (rds-r1d-build-wrap.txt, rds-r1d-build-rc.txt).
   - Suite: `rds-r1d-run-suite.sh` in a second shared hold, foreground. It ran `npm run e2e:publish` in frontends/shell, `timeout 1500`. Exit code 0 ("rc=0 end 2026-10-23T19:00:36Z", started 19:00:26Z).
   - The suite printed the audit log path rds-r1d-audit.jsonl, so SPATIAL_IDE_AUDIT_LOG reached the launched app. The mount gate passed after 1564ms.
   - Every step line, byte-copied:
     - `[OPEN] PASS (381ms): admitted; window.__SPATIAL_E2E__.publishPrepareWithDestination now registered (dataset-scoped)`
     - `[APPROVED'] PASS (1619ms): prepared+executed with attempt 592f4435399ba160bd720df1c3bac6a0; bundle verified (2000 rows, 1 partitions); 2 audit lines (intent+outcome success, approval_route shell-dialog, destination "C:/dev/wt/rds/target/e2e-publish-out/approved-1792782033300-48214/bundle", no credential needle); prepare-to-execute 3ms`
     - `[REFUSED'] PASS (35ms): prepared with attempt 127bcb133e4556ff50a73872d5e65c22, refused on the wrong phrase; no bundle directory, no .staging-* debris under C:\dev\wt\rds\target\e2e-publish-out\refused-1792782034919-826300; audit pair intent+outcome refused, error_kind ApprovalRefused; prepare-to-execute 3ms`
     - `[EXPIRED'] SKIP: no TTL-shortening env/test knob exists for PENDING_ATTEMPT_TTL (600s, publish.rs); ...` (as before; the full line is in rds-r1d-suite.log)
     - `[FILTERED'] PASS (1659ms): filter-scope sentence present verbatim; manifest.operation.filter={"kind":"whole-file"}; bundle rows=2000 == full dataset (2000) both by the manifest's own claim and the reader's independent decode -- the filter did not leak; prepare-to-execute 3ms`
   - FILTERED' passed in this run, alone of my own work but in a shared hold alongside the other hold above. The earlier failure did not recur. I have no explanation for the earlier failure, and one pass does not show what caused it.
5. The viewer/ files of APPROVED's bundle (target/e2e-publish-out/approved-1792782033300-48214/bundle/viewer, rds-r1d-bundle-viewer-sha.txt). Each equals the build record's entry for the same path:
   - NOTICE.txt 826e55d1f585edef8431791033a6beacd6379dc0615ad749a97a7467ab4805fb (the prediction's value)
   - app.js 778198dd07180c597db8a444721b192c679b4ef37a0f5d4652f41c52ee899af8
   - index.html 622604f482af8c4551ca406c42fee9298b429d8e2213460effee38ff4d3aa58c
   - No refusal at any viewer/ file.
6. Audit log: 6 lines, 3 pairs (the attempt ids differ from the ones the suite prints, as in earlier reports):
   - Pair 1 (APPROVED'), attempt a18b2fda0b75a4ca: outcome `success`, error_kind null.
   - Pair 2 (REFUSED'), attempt 19f38bf7d43b4643: outcome `refused`, error_kind `ApprovalRefused`.
   - Pair 3 (FILTERED'), attempt 7cb4eb56f3c3b985: outcome `success`, error_kind null.
7. Copies in the scratch folder:
   - rds-r1d-app.err.log: 2 lines, naming the session log and the data-plane origin. rds-r1d-app.out.log is empty.
   - rds-r1d-suite.log: the suite's printed output, with its summary.
   - rds-r1d-session.log (1360 bytes): its only line matching "error" or "panic" is the line `1792782031293 policy recovery policy: none -- fail visibly and terminate the canvas with a surfaced error`.
   - Also rds-r1d-audit.jsonl, rds-r1d-bundle-viewer-sha.txt, rds-r1d-vite.out.log and rds-r1d-vite.err.log.
   - Processes: rds-r1d-app-down.ps1 killed the two trees it started, by PID (8520 and 39048). It printed `port 9223 free` and `port 5400 free`. The busy check afterwards printed FREE (rds-r1d-busy-after.txt). `Get-Process` for both PIDs counted 0. `git status --porcelain` is 0 bytes after the run.

**F7's section 4 item 4 at 50c634a85e0486bba0d7bff425defd91fcbab788** (for #244's record):
- Script: rds-r1d-check4.mjs, copied from the reviewer's script. I read it whole first. The only change is the head commit constant (diff shows the one line). The output name is rds-r1d-check4.out. It exited rc 0. Its W12 form block is still read from main 384de54b, as in the original script, which I left unchanged (the form block is the same 807-818 lines).
- The script covers the W12 paragraph, `ViewerAssets::`, `with_build_record` and `run_inner`'s skip. The two NOTICE.txt rows and the LICENSES diff are not in it; I ran them as separate commands.
- Each [F7] result:
  - W12: the self-test OK. The paragraph is at kernel/src/bin/publish-bundle.rs lines 47-58 and is byte-equal to the form's W12 block (12 lines). OK.
  - `ViewerAssets::` in the code lines of publish-bundle.rs: only `[[533,"from_dir"]]`, with the self-test positive. OK.
  - `with_build_record`: zero matches in the CLI file, comments included, with the self-test positive. OK.
  - `run_inner`: `kernel/src/publish/mod.rs` lines 691 to 989. Line 957 is `|rel, bytes| req.viewer.is_built_asset(rel, bytes),`, passed as the skip argument to `redaction::first_undeclared_findings`. OK.
  - redaction-reviewed.json at the head, via rds-r1d-rows.mjs (rc 0, self-test positive): 3 rows, 2 of them NOTICE.txt, `credential` at 19092 and `local-filesystem-path` at 111337. OK.
  - LICENSES: `git diff c7d02156d042c25f14d84c841ac89268ea5cec78..50c634a85e0486bba0d7bff425defd91fcbab788 -- LICENSES renderer/bundle-viewer/notice.mjs renderer/bundle-viewer/portedNotices.mjs` gives rc 0 and 0 bytes. 40 tracked paths exist there. The positive control, the same diff with build.mjs added, is 875 bytes (rds-r1d-lic.diff and rds-r1d-lic-ctl.diff). OK.

**Harness as run:** copies of the rds-r1c- scripts with `r1c` changed to `r1d`, and nothing else changed:
- Files: rds-r1d-build-exe.sh, rds-r1d-run-suite.sh, rds-r1d-app-up.ps1, rds-r1d-app-down.ps1, rds-r1d-busy.ps1, rds-r1d-tauri.conf.json, rds-r1d-shim/npx.cmd.
- Overlay: window additionalBrowserArgs adds `--remote-debugging-port=9223` and `--host-resolver-rules="MAP localhost:5180 127.0.0.1:5400"`.
- Vite on 127.0.0.1:5400 with `--strictPort`. The npx shim was on PATH for the suite run only. The run-suite script exports CARGO_TARGET_DIR=D:/wt-targets/rds, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8.
- The busy check read FREE before and after.
- Nothing was refused to me.

**Hold lines** (SpatialIDE only; no exit code 96 to 99):
- Build: `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF ...` then `MACHINE_RELEASED project=SpatialIDE ... affinity=FF (cores 0-7)`.
- Suite: the same pair.

Never-list: no tracked file changed, no commit or push, no claude command, no port or service change. Ignored outputs written: renderer/bundle-viewer/dist and its generated files, target/e2e-publish-out/, frontends/shell/e2e/out/ and D:/wt-targets/rds. Other writes were rds-r1d- files in the scratch folder.
