*Custodian's filing note (2026-10-09): `skp-drained-stream-helper-post-check-race`'s worker report 1 (Parts A and B under Amendment 1), the worker-high run 15:06:05Z to 15:26:21Z by its transcript, on `cut/skp-drained-stream-helper-post-check-race` from b8ad22ff, head be7eecb37327c3ae0d1b5a5c800fcc0a3b4f84c2, published. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 7b3d139d14981143246be6f51dfb74285b93c1d798f131f8c4a23970879c8362. The custodian checked: the worktree is clean at that head and origin holds it; `git diff --numstat b8ad22ff...be7eecb3` is kernel/src/skp.rs 58 and 9 and engine/tests/session_identity.rs 54 and 12. The rest is the worker's.*

---

REPORT: skp-drained-stream-helper-post-check-race (slot 2). Part A and Part B built and published. P-1 is NOT established: run 3 of 20 failed in a way that may depend on timing (details below). I ran as Sonnet 5.5 with no model override and no context handoff.

COMMITS (branch cut/skp-drained-stream-helper-post-check-race, cut from b8ad22ff50f11538f46bf308e5680faeb69912e1, all signed off, all with the Co-Authored-By trailer)
- ff7852fa: Part A, A1 to A4 and the ordering argument of A5. fixture_with_features, drained_stream_fixture at 5_000, the seven calls switched, `batches > MAX_QUEUED_BATCHES` asserted before the guard.
- 7469a801: Part B, B1 and B2 in engine/tests/session_identity.rs.
- be7eecb3: the observed M-1 and M-2 lines in the helper's doc (A5), and M-B1 and M-B2 notes in the two session_identity tests. Each names 7469a801 as the commit observed over.
- The branch is published (`git push -u`, once, no force). HEAD is be7eecb37327c3ae0d1b5a5c800fcc0a3b4f84c2. `git status --porcelain` is empty. No PR was opened.

§7 COUNTS
- Command: `git diff --numstat B H -- kernel/src/skp.rs engine/tests/session_identity.rs`, with B = `git merge-base origin/main HEAD` = b8ad22ff50f11538f46bf308e5680faeb69912e1.
- Part A, kernel/src/skp.rs: 58 added, 9 deleted, so 67 changed lines against a ceiling of 110. Every hunk starts at line 3405 or later, inside mod ticket_drop_under_lock_regression.
- Part B, engine/tests/session_identity.rs: 54 added, 12 deleted, so 66 changed lines against a ceiling of 70.
- No overrun, so no class 8.

MUTATIONS
- Each was applied to a clean tree at HEAD 7469a801, run in a hold, then reverted with `git checkout --`. `git status --porcelain` was empty after each revert.
- No `verify-mutation` run was used or called an observation.
- M-0: the recorded mutation (A) in StreamRegistry::cancel (kernel/src/skp.rs, around line 334).
  - Edit: replace `retired = Some(std::mem::replace(state, ...))` with `*state = TicketState::CancelledBeforeRedeem { cancelled_at: Instant::now() }`.
  - Failed: `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang`. Message: "StreamRegistry::cancel did not return within 5s — its dropped EngineSource re-locked the same Mutex from inside cancel() (DECISIONS-PENDING.md entry 132; ...)".
  - Also failed: `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`. Message: "StreamRegistry::cancel did not return within 5s". The existing doc on the M-0 test already records that this second test fails under this mutation.
  - Result line: 20 passed, 2 failed.
- M-1: change drained_stream_fixture's `5_000` to `50`.
  - All nine failed at the A4 assertion (skp.rs:3495) with "the ordering argument needs more batches than the queue holds (2); got 1".
  - The nine, with no other test failing (13 passed, 9 failed):
    - cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang
    - sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang
    - cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang
    - after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name
    - a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang
    - a_pending_drop_inside_close_emits_once_with_its_session_reference
    - an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard
    - an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard
    - an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard
- M-2: move `touch_modification_time(path)` to just after the drain loop.
  - The same nine failed, at the existing guard (skp.rs:3500, past A4's line 3495), with "setup did not force a real post-check finding — every test in this module would pass vacuously".
  - `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name` is among them: it passed A4 and failed at the guard. 13 passed, 9 failed.
- M-B1: change the clean test's `5_000` to `500`.
  - `a_clean_stream_whose_source_changed_terminates_as_source_changed` failed at the B1 assertion (session_identity.rs:497): "the ordering argument needs more batches than the queue holds (2); got 2". 17 passed, 1 failed.
- M-B2: move `cancel.cancel()` after the drain loop.
  - `a_cancelled_stream_keeps_its_cancelled_terminal_while_the_change_is_still_recorded` failed at its first assertion (session_identity.rs:551): "a cancel is never reported as a source change, got Some(SourceChanged { detail: "{mtime}" })". 17 passed, 1 failed.
- All five observations were made at 7469a801.
- M-0 is not recorded in any doc. The form asks only for M-1 and M-2 there.

PREDICTIONS
- P-3 (`cargo test -p spatial-engine --test session_identity`, 20 runs in one hold): 20 of 20 passed, each "18 passed; 0 failed".
- P-1 (`cargo test -p spatial-kernel --lib ticket_drop_under_lock_regression`, 20 runs in one hold): 19 of 20 passed, each "22 passed". Run 3 failed (21 passed, 1 failed).
  - The failure was `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name`, panicking at the cancel-timeout site (skp.rs:3783): "StreamRegistry::cancel did not return within 5s".
  - It is the 5 s HANG_TIMEOUT bound. It may depend on timing, because the machine was visibly loaded: the harness-printed wall times of the runs, which I did not measure or rely on, were many times those of the first unloaded run. The log also shows the session-end line for that dataset printed, which suggests cancel finished slowly rather than deadlocked, but I did not establish that.
  - I am not recording it as a failure and I did not re-run it. The custodian should re-run P-1 alone on the machine.
  - It is not A4 (the batch count) and not the guard. No invalidator fired in any run, and no run had A4 hold and the guard fail.
  - M-0 shows this same test timing out when cancel really deadlocks.

FMT AND CLIPPY
- `cargo fmt --all --check`: rc 0 after the final commit.
- `cargo clippy -p spatial-kernel -p spatial-engine --all-targets`: rc 0. The only hit in either touched file is kernel/src/skp.rs:277, which is not an added line and is outside the test module. There is no warning on any added line.

HEAVY COMMANDS
- All used the shared-hold shape, with CARGO_TARGET_DIR=D:/wt-targets/cov, CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8. All were granted. None returned 96 to 99.
- The 20-run sets went through a small loop script in my scratch folder, run as the command in a single call.
- Exit codes:
  - First kernel run: rc 0. After release I added an `echo` and a `tail` before the `exit`, a small departure from the call shape.
  - First engine run: rc 0.
  - M-0, M-1, M-2, M-B1, M-B2: rc 101 each, as expected.
  - P-1 loop: rc 1, meaning one failed run (run 3, described above).
  - P-3 loop: rc 0.
  - Clippy: rc 0.

§8, ITEM BY ITEM
1. Code started after the form was committed and after PR #197's merge: b8ad22ff is the base.
2. No edit under protocol/, frontends/ or engine/src. In kernel/src, only inside mod ticket_drop_under_lock_regression. No wire fixture, Cargo.lock or package-lock.json touched.
3. The diff is two files only: kernel/src/skp.rs and engine/tests/session_identity.rs.
4. No sleep, no new or changed timeout, no timing assertion. HANG_TIMEOUT, run_with_timeout and every recv_timeout bound are untouched.
5. No path:line cite in any code comment. Symbols are named.
6. A4 sits before the guard and B1 before the terminal match. Both count Ok items only.
7. fixture() delegates to fixture_with_features(name, 50), so its output is unchanged. keyless() and both touch functions are unchanged. No test changed beyond §4's list.
8. No claim that the flake is fixed or that CI's cause was observed. The M-2 note says it is consistent with the CI failure and does not show it was the cause.
9. Part B was built after Amendment 1 settled OPEN-1 to (1).
10. No §7 overrun and no scope addition. No `verify-mutation` run was used. No hash pin on a branch-only test span.

DIFFERENCES FROM THE FORM
- B2's argument is stated in the rewritten comment paragraph where the old lines 523-527 were, as the form says. The clean test's argument is in its doc.
- The form requires observed lines only in the helper's doc. I also added short M-B1 and M-B2 notes in the session_identity tests, and the 66-line count includes them.
- The mutation notes say "applied to a clean tree of 7469a801". I did not copy the sibling's "uncommitted tree of the commit that adds this line" wording, because it would be inaccurate here.

NOT DONE (as briefed)
- The owner's-index updates to kernel/README.md and engine/README.md come after lead-data's report.
- The PLAN row and the PR body's Timing line are the custodian's. The Timing line should say no timing was introduced and the existing bounds are unchanged.
- The pre-gate self-check on interface use and caller grep is not applicable. Everything is test-only inside existing modules, with no new pub item and no cross-module seam.
