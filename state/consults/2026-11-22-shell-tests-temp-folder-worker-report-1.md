*The worker's report for the node shell-tests-temp-folder-of-the-runs-own (the five-line form `governance/forms/frontends/SHELL-TESTS-TEMP-FOLDER-OF-THE-RUNS-OWN-PREREGISTRATION.md`), its first hand-back, a stop at the size check (48 changed lines against the budget of 40), unpushed. Filed by the custodian below the rule from that hand-back in its transcript, 3904 bytes, sha256 410eaed6a7a8a1587e9af2444aa7be3e07d2f9b63c93ffa4c6f4cd88abbf417e, byte for byte but for masks: the system temporary folder's path is written as <TMP> (2 places) and the hold lines' project value as <m>. Its run: Read 8, Bash 17, Grep 3, Edit 4, Write 1, SubagentHandback 1, by unique call ids, 1 call errored; model claude-sonnet-5-5, from 2026-11-22T14:31:28Z to 2026-11-22T14:48:14Z by its transcript; 0 calls named the main checkout; no compaction.*

---

Built: the shell tests' folder of the run's own at 6342c895a118289e524d4e732d0841dd573eeff2 (committed locally, NOT pushed)
Result: STOP size over the budget. The diff is 48 changed lines against the form's 40. I stopped at the size check, so M1, fmt, clippy and the push were not run.

- Start state: HEAD was 08783d07, status empty, branch cut/shell-tests-temp-folder. The npm steps (renderer/bundle-viewer `npm ci`, shell `npm ci`, shell `npm run build`) exited 0, 0, 0, and status stayed empty.
- Step 1 (red), exit 101, `<S>/stmp-red.log`. Each test failed at its own second assertion, after the temp_dir assertion passed. Failure lines:
  - `thread 'publish::tests::a_publish_workspace_is_the_test_runs_own' (72232) panicked at src\publish.rs:1774:9:`
  - `assertion `left == right` failed: the workspace "<TMP>\\spatial-ide-shell-publish-tests\\folder-of-the-runs-own" is not under a component equal to the process id`
  - `  left: Some("spatial-ide-shell-publish-tests")`
  - ` right: Some("51520")`
  - `thread 'commands::tests::a_session_log_folder_is_the_test_runs_own' (63912) panicked at src\commands.rs:741:9:`
  - `assertion `left == right` failed: the folder "<TMP>\\spatial-ide-shell-session-log-tests\\folder-of-the-runs-own" is not under a component equal to the process id`
  - `  left: Some("spatial-ide-shell-session-log-tests")`
  - `right: Some("51520")`
  - `test result: FAILED. 0 passed; 2 failed; 0 ignored; 0 measured; 80 filtered out; finished in 0.00s`
- Step 2 (green): both new tests passed, exit 0 (2 passed, 0 failed, 80 filtered out). The whole lib suite passed, exit 0 (82 passed, 0 failed, finished in 9.07s). Each helper gained one line, `.join(std::process::id().to_string())`, and nothing else in either helper changed.
- Commit 6342c895a118289e524d4e732d0841dd573eeff2, subject: `test: shell: the session-log and publish tests make their folders under one of the test run's own`. Status is clean after the commit. The trailers are as the brief gave them.
- Size: `git diff --numstat 08783d07...HEAD` gives 24 0 commands.rs and 24 0 publish.rs, total 48 insertions and 0 deletions. That is 8 over the cap. Each new test is 22 lines (about 18 with the shared assertion structure), plus the 1-line helper change.
- Hunk headers, `git diff -U0`:
  - commands.rs: `@@ -724,0 +725 @@` and `@@ -731,0 +733,23 @@`
  - publish.rs: `@@ -1758,0 +1759 @@` and `@@ -1764,0 +1766,23 @@`
  - All four hunks lie inside the `mod tests` modules (commands.rs's starts at line 711, publish.rs's at line 1701).
- Not run: M1, `cargo fmt --all -- --check`, `cargo clippy`, and the push.
- Holds (4 granted and released, all on the `<m>` shape): each MACHINE_HOLD line read `shared project=<m> cores=0-7 affinity=FF shell=<m> also=<m>`, and each MACHINE_RELEASED line read `project=<m> shell=<m> affinity=FF (cores 0-7)`. There were no MACHINE_WAITING or MACHINE_ERROR lines and no 96-99 codes.
- Off-scope noticed, not acted on: the form's budget of 40 cannot hold two tests that carry assertion messages plus two helper lines. The fix is either a smaller test (for example one assertion on `dir.parent().file_name() == pid`, about 8 lines each) or a custodian ruling to class 8, with the form's §7 line left unedited. The custodian decides, and the tests can be trimmed on request.
- Caller-grep and cross-module note: the only interface read was `SessionLog.path`, a pub field at state.rs:37. The two tests are test-only code with no cross-module seam.
- Pre-gate classes: cross-module use matches the real field; completion claims are backed by the logs `<S>/stmp-red.log`, `<S>/stmp-green.log` and `<S>/stmp-lib.log`; there is no user-facing message; both tests reach their intended assertions (shown by the red run).
- Model: Sonnet 5.5 (claude-sonnet-5-5), no override, no handoff.
