*Custodian's filing note (2026-11-14): the worker-high's report on entry 14's code (fd101297612bbafbd15a1819f44b47335240b425, branch cut/close-races-three-untested-kernel-tests, draft PR #320 opened by the custodian at 2026-11-14T18:19:20Z), built under the form `governance/forms/kernel/CLOSE-RACES-THREE-UNTESTED-KERNEL-TESTS-PREREGISTRATION.md`, from its hand-back (8699 bytes, sha256 87d0e719b7c6c7bda534fec2785580122477a376402d1ec4d49e3f6851f2ba0e), below the rule, byte for byte. Its brief by file (12865 bytes, sha256 9f8020ef6140c6616816185632806dbbc05da48ae96d4d98e94bbb94c7f22429); the run 2026-11-14T17:15:56Z to 2026-11-14T18:17:45Z by its transcript, 82 calls (Bash 56, Read 8, Edit 13, Write 4, SubagentHandback 1), three errored (Edit calls refused because the file had not been read in that call's context, each followed by a read and the edit), its edits in its worktree (the tests, its three mutations, each reverted by git, and the two kernel/README.md lines) and its other writes in the custodian's scratch folder, one push in a call of its own, model claude-sonnet-5-5; by script, every run it claims (the module's base and mutation runs, the crate run, cargo fmt, verify-cites, verify-quotes, verify-test-claims, verify.mjs --offline) has a Bash call behind it whose result is not an error. Its count, 154 against the declared 150, is the form's Amendment 1 (class 6), where its departures 1, 4 and 6 are disclosed for the gates; its departures 2 and 3 (two stray files from its own redirects, deleted by it; two status calls sharing a call) are for round 77. Evidence, not Authority.*

---

Built: close-races-three-untested-kernel-tests at fd101297612bbafbd15a1819f44b47335240b425

The branch is pushed. All checks pass, but the diff is 154 lines against the declared 150 (see the count below). I did not trim it, as the brief says.

**Start state**
- The brief's size and sha256 matched. The form's sha256 matched 303c2ba0… at a9c884ba.
- Worktree `C:/dev/wt/cr3`: HEAD a9c884bac1e9f675784bdc31f285d1e7a981051a, branch `cut/close-races-three-untested-kernel-tests`, empty porcelain.
- `df`: C: 50G free, D: 352G free. `where clang-cl` shows `C:\Program Files\LLVM\bin\clang-cl.exe`.
- S0, `git diff --name-only origin/main...<b>`:

| Branch | Files | skp.rs / README hits |
|---|---|---|
| `origin/cut/b1-shell-half-pr-b` | 49 (frontends/shell, renderer) | 0 |
| `origin/cut/second-open-history-before-1c-step-3` | 11 | 0 |
| `origin/cut/port-2-macos-l1-and-app-dirs` | 15 | 0 |

- `gh pr list --state open` returned only #318, which is the second-open branch above.

**Commits**
- **C1** `b7133d0ab8771c991c5735d2eb4ae2e502f6f6e4`, `test: three in-crate kernel tests for the close-race places no test drove`.
  - Touches kernel/src/skp.rs only: 135 insertions in one hunk (`@@ -4813,0 +4814,135 @@`), after the module's opening line at 3455, with no deletions.
  - U1, U2 and U3 sit between T2 and R2.
  - `cargo fmt --all -- --check` exit 0.
  - A script (`<S>/cr3-literal-check.mjs`, exit 0) confirmed U2's detail literal equals the arm's literal on line 1539, 66 bytes each, byte-equal.
- **C2** `fd101297612bbafbd15a1819f44b47335240b425`, `test: record the three mutations of U1 to U3 and index the form in kernel/README.md`.
  - Touches kernel/src/skp.rs (+15, doc comments only) and kernel/README.md (+2/−2, two long lines).
  - README: the form is added after `VERIFY-BUNDLE-EXAMPLE-PATH-BUILD-DIR-LAYOUT-PREREGISTRATION.md` in the preregistration list. The Last-verified bullet gains `every pointer the three untested close-race tests piece adds or changes (this piece's form in the preregistration list) at b7133d0a; ` directly after the `74fd4f1d;` clause.
  - fmt exit 0.
  - Both messages end with the two given trailer lines. The only sign-off line is the one `-s` added.

**Base run at C1**
- Exit 0. Module result: `test result: ok. 28 passed; 0 failed; 0 ignored; 0 measured; 164 filtered out; finished in 1.67s`.
- U1 `a_ticket_minted_after_the_close_is_cancelled_by_its_failed_attribution ... ok`.
- U2 `an_observed_change_between_mint_and_attribution_refuses_with_the_arms_own_detail ... ok`.
- U3 `an_ended_then_closed_query_checking_after_the_close_refuses_as_unknown_dataset ... ok`.

**Mutations at C1**
Each ran `cargo test -p spatial-kernel --lib --locked skp::ticket_drop_under_lock_regression` and was reverted with `git checkout -- kernel/src/skp.rs`. The porcelain was empty after each revert. All three matched the prediction. Diffs are in `<S>/cr3-m1.diff`, `<S>/cr3-m2.diff` and `<S>/cr3-m3.diff`.
- **M1**
  - Diff: `@@ -1526 +1525,0 @@` removes `self.tickets.cancel(handle.as_str());`.
  - Exit 101, `26 passed; 2 failed`.
  - U1 and U2 both failed at the shared helper's assertion, `panicked at kernel\src\skp.rs:5029:9: the ticket is CancelledBeforeRedeem before the redeem step runs`.
- **M2**
  - Diff: `@@ -1538,2 +1538,3 @@`; the `ObservedChange` branch now builds `SourceCoverageLost` with the `[P6 placeholder] …` detail.
  - Exit 101, `27 passed; 1 failed`.
  - Only U2 failed, at its code assertion at skp.rs:4885:9, with `left: "engine.source_coverage_lost"` and `right: "engine.source_changed"`.
  - T2 passed.
- **M3**
  - Diff: `@@ -830 +829,0 @@` removes `st.invalidated.remove(dataset);`.
  - Exit 101, `27 passed; 1 failed`.
  - Only U3 failed, at its code assertion at skp.rs:4932:9, with `left: "engine.source_changed"` and `right: "skp.unknown_dataset"`.
  - I did not run the optional `session_generation` test.

**Kernel crate run at C2** (`cargo test -p spatial-kernel --locked`)
- Exit 0, no failures in any binary.
- Lib: `191 passed; 0 failed; 1 ignored`.
- The other binaries that ran tests: publish-bundle 5 passed; catalog_replace 2; concurrency_in_situ 2; dataset_ref 5; describe_crs_unit 1; end_to_end 10; narrow_integer_id_stream 1; no_generation_in_persisted_artifacts 9; permission_boundary 16; posix_backslash_in_shared_path_logic 1; post_check_cost_report 1; project_save 15; project_save_crash 1; project_save_skp 5; publish 33; publish_cancellation 6; publish_cli 9; publish_identity_tier 2; publish_partition_golden 1; query_window_attribution 2; record_step_crs 3; record_step_match 2; regenerate_fixture 3; regenerate_fixture_s 6; scale_pass 1; session_end_event 7; session_generation 12; session_history 13; session_history_crash 1; session_reference 1; single_file_bracket_name_open 1; skp_admission 10; skp_admission_remediation 7; skp_cancel_terminal_without_credit 2; skp_filter_cancellation 1; skp_projection 14; source_watch_ordering 16; source_watch_windows 3; trace_spans 6; typed_terminal_codes 8; verify_bundle 3; watcher_first_read_windows 1; wire_bytes_invariant 2. The remaining binaries (slice_host, ignored-only ones, Doc-tests) ran 0 tests.
- The full per-binary log is `<S>/cr3-crate-run.txt`.

**Checks at C2**
- `verify-cites` exit 0: PASS, 3032 files.
- `verify-quotes` (in a hold) exit 0: PASS, 156 checked, 125 verified.
- `verify-test-claims` exit 0: PASS, 802 claimed tests.
- `verify.mjs --offline` exit 0: `verify:plan` PASS.

**Count** (`git diff --numstat origin/main...HEAD`)
- kernel/README.md: 2 insertions, 2 deletions.
- kernel/src/skp.rs: 150 insertions, 0 deletions.
- Total: 152 insertions + 2 deletions = **154**, over the declared 150. The form estimated about 125.
- U1 to U3 are 135 lines and the three mutation paragraphs 15 more; the form estimated 35, 41 and 45 for the three tests.

**Push and cleanup**
- The push got a call of its own: `* [new branch] cut/close-races-three-untested-kernel-tests -> cut/close-races-three-untested-kernel-tests`.
- `origin/cut/close-races-three-untested-kernel-tests` equals HEAD (fd101297…), and the worktree porcelain is empty.
- No PR action and no CI wait.
- Nothing of mine is still running: no cargo or rustc processes, and every background shell finished on its own. I killed nothing.

**Status and holds** (masked: `reading` quiet, average, peaks-over-25)
- Before the base run: quiet=False, 23.6%, 16. No `project=SpatialIDE` line.
- Before M1: quiet=False, 40.2%, 59. None.
- Before M2: quiet=False, 67.3%, 60. None.
- Before M3: quiet=False, 76.3%, 60. None.
- After C2: quiet=False, 55.2%, 60. **A `project=SpatialIDE` line was present** (another session's hold). I waited with a background loop, `<S>/cr3-wait-status.sh`, polling every 60 s. It cleared on turn 5: quiet=False, 30.2%, 60.
- Before verify-quotes: quiet=False, 26.3%, 24. None.
- Holds: base (cold build) and M1 to M3 each came back with `MACHINE_HOLD shared project=SpatialIDE cores=0-7` and `MACHINE_RELEASED`. The crate run and verify-quotes completed with exit 0 under their holds. No exit codes 96 to 99.

**Departures**
1. **U3 does not call `viewport_query_attribute`.**
   - The form says the resolved query "continues through `viewport_query_mint` and `viewport_query_attribute`".
   - In the product, `viewport_query` chains the steps with `?` (skp.rs:1405-1406), so the mint step's live check refuses first and attribute is not reached. U3 calls resolve, close, then mint with `expect_err`, and its doc comment says attribute is not reached.
   - This is my reading of the form; the base run and M3 both ran as predicted.
2. **Stray files from my own redirects.**
   - Two mistaken redirects in S0 shell commands wrote files outside the permitted folders (under the user profile's Temp folder, and at the user-profile root). They held only branch file-name lists.
   - I confirmed each was my own file and deleted both. Neither was a tracked or repository file.
3. **Two status calls shared a call with other commands.** The status before M1 ran in the same call as the M1 `git diff` print, and the one after C2 in the same call as the commit. Neither shared a call with a hold.
4. **No second paragraph on U2.** U2 carries only its M2 `REGISTERED MUTATION:` paragraph. M1's effect on U2 appears above and is not recorded as a doc-comment extra, because the brief asks for one paragraph per test.
5. **The count is over 150** (above); I pushed it as the brief's step 6 allows.
6. **Clause wording.** The README clause naming this piece is my wording ("the three untested close-race tests piece"), in the shape of its neighbours.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5). No model override and no context handoff.
