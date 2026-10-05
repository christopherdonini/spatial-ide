*Custodian's filing note (2026-10-05): the worker-high's report 1 for `data-plane-terminal-without-credit` (run 07:29Z to 08:41Z; 246,915 subagent tokens, 88 tool uses), written to the custodian's scratchpad and copied here below the rule with one change: two panic locations in the new kernel test file, which exists only on the branch, are de-rooted (the `kernel/tests/` prefix dropped, the file name and line kept), so that verify-cites on main does not read them as rooted cites. Its sha256 as written, before that change, from this file's line 5 to the end, is 38e650364d73d2228912b94daf74b1d4205da1484d5df1432af8e4b4ae56afca. The branch `cut/data-plane-terminal-without-credit` stands at d60a0bed4e96b8e92e3cbeefb848e46e2faac2a4, clean, its four commits as the report lists them. M4's pass at the remedy commit is a class-2 result, recorded as the form's Amendment 3. Profile paths redacted at filing: none.

---

# dptwc worker report 1 (data-plane-terminal-without-credit)

Branch cut/data-plane-terminal-without-credit, cut from e4b49efacde8f9c667ac9a5bc354410328de2161. Not pushed. Worktree clean at head. Model observed: Sonnet 5.5, no override, no context handoff. Quotes below are byte-copied from run logs (kept in this scratchpad's subfolders m0, mut1, mut2, rep, suites, gov), not from the repository.

## Commits

1. ced0450bad62c75131172d4d33f8d5637181817e (tests commit, no product change): T1, T1b in the new kernel/tests/skp_cancel_terminal_without_credit.rs; T2, T3a, T3b and the FailsAfter fixture in protocol/data-plane/tests/candidate_a.rs (start made generic over the factory).
2. 237af6fed01c545c0b64b20ec662293deee472e0 (remedy commit): Part 1 (writer receives the pump item first, credit gates batch frames only), Part 2 (SourceCancel::on_cancel provided method, EngineCancel with one mutex over the notify slot and the cancelled mark, pump failure notice, owner-cancel notice, is_cancelled deferral, discard drain, StreamState::note_discarded and batches_discarded() with its round 5, item 4 doc), T4, T5, T6, the batches_discarded assertions in T1, T1b, T3b, T5, and protocol/data-plane/README.md (mechanism, discard policy, residual, START_TIMEOUT 10 s corrected to 120 s). No engine/ line, no owner's-index text, no kernel/README.md change.
3. 8f5e622ef478a5b668225d7a741ac0097880fee5 (test fix): T4's fixture runs the owner notice from its own thread (see deviation 1).
4. d60a0bed4e96b8e92e3cbeefb848e46e2faac2a4 (final head): RECORDED MUTATION doc comments in the test files, comment text only (the verify-mutation floor).

## M0 (at ced0450b, each test alone, 3 runs, all 15 failed; none passed)

Each run exited 101 and failed at the liveness deadline, as the form predicts.
- an_skp_cancel_reaches_the_client_as_a_terminal_with_no_credit_granted, runs 1 to 3: panicked at skp_cancel_terminal_without_credit.rs:87:23, message "timed out after 60s waiting for the terminal after the owner's act" (69.5 s, 70.1 s, 71.5 s). The plateau precondition passed before it.
- a_close_dataset_reaches_the_client_as_a_terminal_with_no_credit_granted, runs 1 to 3: the same panic site and message (68.7 s, 69.4 s, 68.4 s).
- credit_equal_to_the_batch_count_delivers_every_batch_then_the_terminal, runs 1 to 3: panicked at protocol/data-plane/tests/candidate_a.rs:242:19, message "timed out after 30s waiting for a frame, or the connection to end".
- a_producer_failure_with_no_batch_ahead_is_a_terminal_with_no_credit_granted, runs 1 to 3: the same site and message.
- a_producer_failure_behind_queued_batches_is_a_terminal_with_no_credit_granted, runs 1 to 3: the same site and message.
Not observable: the form's "after 12 batches" (T2) and "with 0 batches" (T3a, T3b). recv_by's panic carries no batch count, so M0 shows the deadline, not the count. No finding: no run passed where a failure was predicted.

## Mutations (applied, test run alone, failure recorded, reverted; no verify-mutation run is called an observation)

At 237af6fe (remedy commit), first pass, in full:
- M1, an_skp_cancel_...: failed, skp_cancel_terminal_without_credit.rs:88:23, "timed out after 60s waiting for the terminal after the owner's act". M1, a_close_dataset_...: failed, the same message. As predicted. I-3 not triggered.
- M2, credit_equal_...: failed, candidate_a.rs:242:19, "timed out after 30s waiting for a frame, or the connection to end". M2, a_producer_failure_with_no_batch_ahead_...: failed, the same message.
- M3, a_producer_failure_behind_queued_batches_...: failed, the same 30 s message.
- M4, a_data_plane_cancel_still_ends_cancelled_when_the_owner_notice_fires_first: PASSED (rc 0). A P-7 and P-10 miss at 237af6fe, a class-2 recorded result, not a §5 invalidator.
- M5, an_owner_cancel_on_a_source_...: failed, "assertion `left == right` failed: detail was: " with left 0, right 2 (TERM_COMPLETED in place of TERM_PRODUCER_FAILED).
- M6, cancel_notice_tests::engine_cancel_runs_the_registered_notice_once_in_either_order: failed, kernel/src/lib.rs line 779 at that commit, "assertion `left == right` failed: run at registration", left 0, right 1. As predicted (order (ii), first count).
- M7, a_producer_failure_behind_queued_batches_...: failed, "assertion `left == right` failed: the three queued batches were discarded", left 0, right 3.
- M8, an_owner_cancel_on_a_source_...: failed at the prefix assertion, "the detail carries the placeholder mark and no brace: the source ended without reporting a failure after its owner cancelled the stream; batches already generated were discarded and not delivered".

M4 diagnosis (temporary debug prints, reverted, never committed): the notice ran, but the writer's owner arm did not run until after the 2 s delay. The fixture ran the notice inside the runtime worker its cancel then blocked, so the writer's wake waited in that worker's local scheduler slot and the halt signal arrived first, whatever the writer's arm did. T4 therefore could not discriminate. Fix: commit 8f5e622e.

Re-observed at 8f5e622e (the head of the test files used by M2, M3, M4, M5, M7, M8; M1 and M6 stand at 237af6fe, their tests and the product code being unchanged by 8f5e622e):
- M2, credit_equal_...: failed, candidate_a.rs:258:19, "timed out after 30s waiting for a frame, or the connection to end"; M2, a_producer_failure_with_no_batch_ahead_...: failed, the same message.
- M3: failed, the same 30 s message.
- M4: failed, candidate_a.rs:954:5, "assertion `left == right` failed: detail was: [P6 placeholder] the source ended without reporting a failure after its owner cancelled the stream; batches already generated were discarded and not delivered", left 2, right 1 (TERM_PRODUCER_FAILED in place of TERM_CANCELLED). As predicted.
- M5: failed, "assertion `left == right` failed: detail was: ", left 0, right 2.
- M7: failed, "assertion `left == right` failed: the three queued batches were discarded", left 0, right 3.
- M8: failed at the prefix assertion, the same message as above.
Each mutation was reverted; porcelain was clean after each.

## Repeat runs at 8f5e622e (alone, through cargo test)

All passed: T1 10/10, T1b 10/10, T2 10/10, T3a 10/10, T3b 10/10, T4 10/10, T5 10/10, T6 10/10 (P-2, P-8); withholding_credit_bounds_producer_memory 10/10 and h3_a_consumer_that_withholds_credit_bounds_producer_memory 10/10 (P-3); the skp cancel test cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock 20/20 (P-4); h2_cancellation_is_observed_by_the_producer_inside_the_budget 10/10, h2_a_cancel_before_the_first_batch_still_stops_the_query 10/10, a_cancel_control_frame_reaches_the_source_and_is_observed_producer_side 10/10, a_peer_that_closes_without_cancelling_still_stops_the_producer 10/10 (P-5). I-1 to I-7: none triggered (T1, T1b, T3b and T5 assert batches_discarded equals batches_generated with 0 sent, and the plateau assertion held at 4 to 5).

## Suites at d60a0bed, exit codes

- cargo test -p spatial-data-plane: rc 0 (unit 24 passed; candidate_a 16 passed; no_transport_leakage 4; origin_header_encoding 5; stream_registry_bound 3).
- cargo test -p spatial-kernel --test skp_cancel_terminal_without_credit --test skp_admission --test skp_filter_cancellation --test end_to_end: rc 0 (10 + 10 + 2 + 1 passed, 0 failed; the 2 are T1 and T1b).
- cargo test -p spatial-kernel --lib: rc 0 (142 passed, T6 included).
- cargo fmt --all --check: rc 0. cargo clippy -p spatial-data-plane -p spatial-kernel --all-targets: rc 0, warnings only; none in a changed data-plane file, none in the new test file, and the two in kernel/src/lib.rs are at lines 397 and 472, outside this piece's lines. With -D warnings it fails in the renderer crate (untouched), so the -D form was not usable.
- node --test scripts/plan and scripts/hooks: rc 0 (440 of 440). verify-cites rc 0; verify-quotes rc 0; verify-test-claims rc 0; verify.mjs (verify:plan) rc 0; verify-mutation (run as --base e4b49efa --head HEAD, since origin/main has moved to 792c685a) rc 0, 8 of 8 new tests name a mutation.

## Section 7 figures at d60a0bed (counted by the form's own commands against origin/main...HEAD; merge-base e4b49efa)

- Product (protocol/data-plane/src, kernel/src): 254 (ceiling 310).
- Tests (protocol/data-plane/tests, kernel/tests): 478 (ceiling 490).
- Documentation (protocol/data-plane/README.md, kernel/README.md): 26 (ceiling 45). The owner's-index update is still to come and counts against the remaining 19.
- Non-generated files touched: 8 in this branch (lib.rs, adapter_ws.rs, pump.rs, server.rs, transport.rs, candidate_a.rs, the new kernel test file, protocol/data-plane/README.md). With the form, PLAN.yaml and kernel/README.md that others touch, 11 (ceiling 11).
- Must-print-nothing command: printed nothing. No new product constant.

## Deviations from the form (one line each)

1. M4 passed at 237af6fe (fixture defect); T4's fixture was fixed in a fourth-listed commit 8f5e622e and M4 re-observed there; M2, M3, M5, M7, M8 were re-run at 8f5e622e as well.
2. Two commits beyond the tests and remedy commits: 8f5e622e (T4 fixture fix) and d60a0bed (RECORDED MUTATION doc comments in the test files, added so verify-mutation passes as a floor).
3. T4 and T5 use the existing Flag type, extended with a notify slot and a delay field, rather than a separate test SourceCancel type (the form's wording is "a test SourceCancel").
4. Flag::cancel runs the notice via std::thread::spawn(notify).join() (the fixture change of deviation 1); the form says the cancel "runs notify".
5. discard_queued keeps the form's "Completed when nothing was discarded" branch, but the writer always holds a batch when it enters the drain, so that branch is unreachable from the credit wait and has no test.
6. M0's "after 12 batches" and "with 0 batches" are not visible in the panic message (no batch count in recv_by's panic).
7. The batches_discarded() doc names T1, T1b, T3b and T5 by their full test names; the form says it names them.
8. A plateau helper in T1 and T1b requires 50 stable 10 ms samples (candidate_a's own wait_for_plateau uses 25); a premature plateau could only fail the 4-to-5 assertion, never pass it.
9. The notice slot lives in a private CancelNotice struct inside kernel/src/lib.rs; EngineCancel changed from a tuple struct to a named struct with a new() constructor.
10. cargo clippy was run without -D warnings (the -D form fails in the untouched renderer crate).

Off-scope noticed, not done: none beyond the above. The owner's-index update (both READMEs, kernel/README.md's preregistrations bullet), the form's closing amendment and PLAN.yaml are not mine and are untouched.

Caller grep (no product item without a caller): on_cancel is called by adapter_ws.rs's drive and implemented by EngineCancel in kernel/src/lib.rs; note_discarded is called by discard_queued in adapter_ws.rs; batches_discarded() has only test callers and its doc declares it; the pump's failure receiver is passed by server.rs to drive.

Pre-gate self-check: cross-module code uses the interface the other side exposes (SourceCancel in transport.rs, EngineCancel in kernel/src/lib.rs), proven end to end by T1 and T1b from the real shape; every completion claim names a passing test; no user-facing message beyond the one P6 placeholder detail; each test reaches its terminal assertion (the M0 and mutation runs fail at the assertions named above, not at setup).

State: `git status --porcelain` empty at d60a0bed4e96b8e92e3cbeefb848e46e2faac2a4.
