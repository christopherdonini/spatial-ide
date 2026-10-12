*Custodian's filing note (2026-10-09): the architect's draft of `skp-drained-stream-helper-post-check-race`'s preregistration, on the custodian's brief at main a23e709b, after lead-data's impact read (measured piece 6 of the second pilot). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 7a55e4741e981c350c3f5e3aa259551e9d3c3448ea274b76eb80c1235d5a1d5a. Write audit PASS: zero write calls (Read 45, Grep 24, SubagentHandback 1). Run window from the transcript: 2026-10-09T06:22:01Z to 06:32:58Z. The form as committed, `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, is part 2's block with its 66 pins computed at a23e709b, each pinned span's first and last line checked by the custodian; nothing else in it is changed (sha256 1354bb76118a6ab9943cc976701554cdfe8e561da3d8a905ffd151ef53f7acb2).*

---

Reviewed: main @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5

## 1. Form, gating, and what the human decides

**Full form, with full gating from dispatch (AUTONOMY.md §21a, a property currently under test; §25(e)).** The file is `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`, next to the sibling form.

- **Size does not force the full form.** By §21c's count, tests included, I estimate Part A at about 70 to 80 lines and Part B at about 45. That stays under 150 lines and 8 files.
- **The category does force it.**
  - The helper's guard is the vacuity check for nine tests.
  - Those tests pin properties that are under test now: the post-check as the during-query detector (KNOWN-LIMITATIONS 19), ADR-035's emit-once events, and the hang tests that cite ADR-018.
  - Part B's two engine tests pin rule (i) and rule (ii) of the post-check.
  - The piece changes the setup that makes all of those tests non-vacuous. An Out-of-scope line could say that no guarantee is touched only with a hedge.
  - Under §25(e), anything short of asserting that the piece touches none of the four categories means the full form from dispatch.
- **Precedent.** The sibling took the full form on the same reading (`kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md`, its header's Form line). I give no five-line text.
- **Gates.** Architect and reviewer. They block only on Correctness or Evidence, under the product-first direction's section 2.

**Left to the human:**
- OPEN-1: whether Part B (two tests in `engine/tests/session_identity.rs`) is in scope. Part A does not wait on it.
- §21c's threshold stays the custodian's. The custodian also records the PLAN budget deviation (the node declares 60 minutes).

## 2. The draft

````markdown
# skp.rs's drained-stream helper made unable to lose its post-check race
# (PLAN node skp-drained-stream-helper-post-check-race)

File: kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md
Authority: the human's direction of 2026-10-09, item 3b, slot 2 item b (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:23 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD; its RULED block in DECISIONS-PENDING.md); the node's finding F-1 (state/consults/2026-10-07-typed-terminal-codes-post-check-race-architect-draft.md:260 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD); the sibling-search default (AUTONOMY.md:215 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
Drafted by: the architect agent, from lead-data's impact read (state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-impact-read.md, whole-file sha256 9ed71a48a8377c55b55a15b6b9b15af25cb771d78f352d8cdf6118d0584a8a6c), under the second pilot's §2 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:17-21 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD); code read at main a23e709b.
Committed before any code. No code starts before slot 2's item a (covering-names-missing-column) has merged. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a property currently under test; §25(e)).
Pins: every pin below is a historical pin at a23e709b. If a merge moves a pinned file before this piece's code, the worker re-derives the site by symbol. The pin stays authoritative for what it recorded; the tree is authoritative for the code the piece edits.

## §0. Disclosure

0.1 The failures. Both ran on ubuntu-24.04, and both hit the helper's setup guard:
  - PR #187, run 37675645746, attempt 1, in a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang. The guard's line number in the log is from that run's commit, not from main: state/consults/2026-10-07-pr187-ci-run-37675645746-attempt-1-failed-steps.txt:950-951 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - PR #195, run 37836080416, attempt 1, in after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name: state/consults/2026-10-08-pr195-ci-run-37836080416-attempt-1-failed-steps.txt:993-994 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD

0.2 The helper as it stands.
  - fixture(), with 50 features: kernel/src/skp.rs:3411-3427 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - the helper: kernel/src/skp.rs:3448-3468 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - the touch, after the stream is built: kernel/src/skp.rs:3453-3457 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - the drain, which neither counts nor inspects what it receives: kernel/src/skp.rs:3458-3461 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - the guard: kernel/src/skp.rs:3462-3466 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - the module doc's reason for draining on the test thread: kernel/src/skp.rs:3380-3389 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD

0.3 Cause (read from code, not observed).
  - open_engine_stream calls stream_with_cancel (kernel/src/lib.rs:255-266 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD). That call uses the default policy (engine/src/stream.rs:906-923 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD), which cuts by size only (engine/src/stream.rs:398-411 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
  - The producer is spawned inside that call, so it starts before the helper's touch: engine/src/stream.rs:1251-1268 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - With 50 features the stream is exactly one batch:
    - a row's estimate is 20·v + 12 bytes (engine/src/stream.rs:2288-2291 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD), with no attribute bytes on this path (engine/src/envelope.rs:271-274 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD);
    - for avg_vertices 8, the outer ring has 4 to 12 vertices (engine/src/fixture.rs:1251-1254 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD), and a hole of 4 vertices is added on every 7th row (engine/src/fixture.rs:1257-1258 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD; hole_every 7 is the default, engine/src/fixture.rs:548-553 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD). So a row has at most 16 vertices, which is 332 bytes;
    - 50 × 332 = 16,600 bytes, under the first target of 65,536 (engine/src/stream.rs:66-70 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD; engine/src/stream.rs:452-461 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
  - One batch fits in the empty queue (engine/src/stream.rs:85 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD; engine/src/stream.rs:1237 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD). The producer's only send therefore does not wait, and it can then run its post-check (engine/src/stream.rs:1330-1340 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD) before the helper touches the file. Nothing orders the post-check after the touch.

0.4 Siblings (the sibling-search default).
  - The helper's five call sites, nine tests in all, are Part A.
  - Same class, not in the node's summary: Part B, conditional on OPEN-1.
    - engine/tests/session_identity.rs:452-487 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD (clean) and engine/tests/session_identity.rs:495-540 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD (cancelled).
    - Both use keyless() (engine/tests/session_identity.rs:53-60 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD). That is at most 500 × 492 = 246,000 bytes, so at most 2 batches.
    - The cancelled test also cancels before it touches (engine/tests/session_identity.rs:502-503 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD). A producer that sees the cancel early can run its post-check before the touch, whatever the batch count.
    - A producer that ends clean before it sees the cancel, with its post-check after the touch, sends source_changed. The test's first assertion refuses that (engine/tests/session_identity.rs:519-522 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD), but its doc says that assertion holds in both cases (engine/tests/session_identity.rs:523-527 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
  - Already unlosable: kernel/tests/typed_terminal_codes.rs, and E2 and E3 in kernel/tests/session_end_event.rs (the sibling form, Amendment 2).
  - Different shape, out of scope:
    - kernel/src/skp.rs's an_end_between_liveness_and_redeem_refuses_by_its_code (a pre-check on a second query);
    - kernel/tests/session_end_event.rs E4 (the sibling form, §0.4);
    - the pre-check, end_generation and watcher sites in kernel/tests/session_generation.rs, session_reference.rs and source_watch_windows.rs;
    - four sites with no open stream, where the mtime is set for a descriptor read, a reference read or a watcher signal: engine/tests/source_observation.rs:43-50 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD, kernel/tests/dataset_ref.rs:76-82 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD, engine/tests/source_watch_adapter.rs:139-144 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD, engine/tests/source_watch_adapter.rs:658-664 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD.
  - A grep for set_modified and source_changed_detail() finds nothing under protocol/, frontends/ or renderer/.

0.5 Budget. The node declares 60 minutes, and the full form and its gates exceed that. The custodian records the deviation in PLAN. It is not a §7 figure.

0.6 Reuse index (the 2026-10-09 direction, item 5). node tools/reuse.mjs, run in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, found no prior art for race, post-check, drained stream or test flake. This miss does not block.

0.7 Shape. This piece follows the sibling form's §2 (Part A, and B3 for the cancelled case), re-pinned at a23e709b. The sibling's outcomes are in its Amendment 2.

## §1. May and may not claim

- May claim:
  - in every run where the helper's batch-count assertion holds, the post-check read the source after the helper's touch, by §2's argument;
  - under Part B, the same for the clean test;
  - under Part B, for the cancelled test, that the post-check ran after the touch and the terminal is Cancelled.
- May not claim:
  - that either CI failure was observed to have §0.3's cause. M-2 shows only that the two are consistent;
  - any timing, duration or performance number;
  - any change to product behaviour;
  - anything about §0.4's different-shape sites.
- No ADR is amended. ADR-018 and ADR-035, both Accepted, stay as the tests cite them. ADR-019 is Proposed and binds nothing.
- No wire, SKP, MCP or data-plane change.

## §2. The change

Part A: kernel/src/skp.rs, inside mod ticket_drop_under_lock_regression only.
- A1. A helper fixture_with_features(name, features), with fixture()'s spec and directory. fixture(name) delegates to it with 50, so its output for its other callers is unchanged.
- A2. One function, drained_stream_fixture(name), returns fixture_with_features(name, 5_000). It is the only site of that literal, and its doc states the arithmetic below by symbol name.
- A3. The fixture calls whose path reaches the helper take A2's function instead. They sit in:
  - cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang;
  - sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang;
  - cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang;
  - after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name;
  - a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang;
  - a_pending_drop_inside_close_emits_once_with_its_session_reference;
  - UnwindSetup::new.
  No other line of those functions changes.
- A4. The helper's drain loop counts Ok items only and clears buf after each item. Right after the loop, and before the existing guard, it asserts batches > MAX_QUEUED_BATCHES.
  - The constant is imported from spatial_engine (engine/src/lib.rs:150-156 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
  - The message says the ordering argument needs more batches than the queue holds, and gives the count.
- A5. The helper's doc states the ordering argument by symbol name and carries M-1's and M-2's observed lines. The guard and its message are unchanged.
- No sleep, no new or changed timeout and no timing assertion (question round 25, item 1 (a), as the sibling form's §2 cites it).

Why the order is guaranteed:
- On the helper's thread, the touch comes before the first next_into: kernel/src/skp.rs:3453-3461 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
- The queue holds MAX_QUEUED_BATCHES items: engine/src/stream.rs:85 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD and engine/src/stream.rs:1237 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
- Each batch is one blocking send: engine/src/stream.rs:2559-2570 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
- The consumer's only receive is the recv inside next_into: engine/src/stream.rs:782-797 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
- The post-check runs after produce returns. Its flag is recorded first, and the terminal follows: engine/src/stream.rs:1330-1362 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
- The guard reads that flag: engine/src/stream.rs:722-729 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
- So, with at least MAX_QUEUED_BATCHES + 1 Ok batches received:
  - the send of batch index MAX_QUEUED_BATCHES completed only after the helper's first next_into, which follows the touch;
  - produce returned after that send, and the post-check ran after produce.
- If produce fails before that send, fewer batches arrive and A4 fails by name.

Why 5,000 features give at least 3 batches (arithmetic over the code):
- Each batch's estimate is at most target_for(its index):
  - cut before append, with an incoming estimate that cannot undercount vertices, and an additive estimate: engine/src/stream.rs:2001-2038 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - cut at the target: engine/src/stream.rs:2055-2079 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD and engine/src/stream.rs:2249-2265 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - no time-budget cut under the size-only policy: engine/src/stream.rs:1879 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
- target_for(0) + target_for(1) = 65,536 + 262,144 = 327,680 (§0.3's pins on engine/src/stream.rs lines 66-70 and 452-461).
- A row is at least 92 bytes, which is 20·4 + 12:
  - at least 4 vertices per row: engine/src/fixture.rs:1251-1254 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD and engine/src/fixture.rs:1520-1532 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - no attribute bytes (§0.3).
- 5,000 × 92 = 460,000 > 327,680, in any row order.
- With 50 features, a stream is exactly one batch (§0.3).

Part B (conditional on OPEN-1): engine/tests/session_identity.rs, the two §0.4 tests only.
- B1. The clean test:
  - it writes FixtureSpec { features: 5_000, ..keyless() }, and keyless() is unchanged;
  - its drain counts Ok items;
  - before the terminal match, it asserts batches > MAX_QUEUED_BATCHES, with the constant imported from spatial_engine;
  - Part A's argument applies. Rows are at least 132 bytes at avg_vertices 12, and the 92-byte bound already suffices.
- B2. The cancelled test:
  - it writes FixtureSpec { features: 20_000, ..keyless() };
  - touch_modification_time moves before cancel.cancel();
  - its assertions are unchanged, and the None arm stays as code;
  - the doc paragraph at its lines 523-527 (pinned in §0.4) is rewritten to state B2's argument by symbol name, because its small-fixture reason no longer holds.
  - 20,000 × 92 = 1,840,000 > 1,376,256, the first three targets. target_for(2) is capped at 1,048,576 by engine/src/stream.rs:51 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD. So the stream has at least MAX_QUEUED_BATCHES + 2 batches.
  - Any cancel the producer observes was requested after the touch.
  - The send of batch index 2, which is not the last batch, cannot complete before the test's first next_into, and that call follows the touch and the cancel. After that send, every path to produce's Ok return passes a cancel check:
    - the loop top: engine/src/stream.rs:1884-1888 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
    - each row: engine/src/stream.rs:1974-1988 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
    - flush: engine/src/stream.rs:2540-2545 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD
  - An earlier observation (engine/src/stream.rs:1780-1782 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD) also follows the touch. An interrupted query is classified Cancelled (engine/src/stream.rs:2573-2579 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
  - So the terminal is Cancelled (engine/src/stream.rs:1359-1361 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD), and the post-check, which runs after the touch, records the change.

Portability (state/directives/PORTABILITY-2026-09-30.md, §2):
- R1: the argument rests on std's bounded channel and the cancel flag. It is the same on every platform.
- R2 to R4: no OS-dependent feature and no cfg. R3 is not triggered.
- R5: no level is claimed.
- R6: nothing is ignored on any platform.

## §3. Fixtures

- Part A: fixture_with_features(name, 5_000), with avg_vertices 8, NativeUnique and the rest default. The seven names are those at a23e709b, under target/fixtures/ticket-drop-under-lock.
- Part B: keyless() at 5,000 features (B1) and at 20,000 (B2), under target/fixtures/session-identity.
- All of them are seeded and generated per run. None is the 5 GB fixture or a wire fixture, and no hash is pinned.

## §4. Tests and mutations

For each mutation: apply it, run the named test or tests, record each failure by name with the commit it was observed at, then revert. A verify-mutation run is never called a mutation's observation (round 25, item 2 (c)).

Changed tests:
- Part A, nine tests: the six of A3, plus three through UnwindSetup::new:
  - an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard;
  - an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard;
  - an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard.
- Part B: the two tests of §0.4.

Mutations:
- M-0, a power re-check, of record. Apply cancel's recorded mutation (A) (kernel/src/skp.rs:3522-3530 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD). cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang fails with its did-not-return-within message.
- M-1, for A4. This is the one mutation for each of the nine changed tests.
  - Change A2's 5_000 to 50.
  - Run `cargo test -p spatial-kernel --lib ticket_drop_under_lock_regression`.
  - Each of the nine fails at A4's assertion with a count of 1, and the record names each. No other test fails.
- M-2, an observation of the existing guard, not of CI's cause. Move touch_modification_time(path) to after the drain loop. after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name passes A4 and then fails at the guard's existing message. The failure is deterministic, because the drain ends only after the terminal, and the terminal follows the post-check.
- M-B1, for B1. Change the clean test's 5_000 to 500. It fails at B1's assertion: at most 246,000 bytes, so at most 2 batches.
- M-B2, for B2. Move the cancelled test's cancel.cancel() to after its drain loop. It fails at its never-reported-as-a-source-change assertion, with SourceChanged.

The hang-timeout rule if a caller is edited (the sibling form's §8 item 4, and its Amendment 2 item 3):
- The changed tests keep their existing bounds:
  - HANG_TIMEOUT (kernel/src/skp.rs:3409 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD), through run_with_timeout (kernel/src/skp.rs:3473-3482 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD);
  - the event waits at kernel/src/skp.rs:4069-4076 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD and kernel/src/skp.rs:4166-4173 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD.
  None is added, removed, moved or changed in value.
- Each bound limits a hang or an event's absence. None synchronises anything this piece relies on:
  - every one opens after the helper has returned a stream already drained to its terminal;
  - dropping that stream does no work that grows with the fixture. BatchStream's Drop only cancels (engine/src/stream.rs:885-895 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD). EngineSource's Drop reads the recorded flag (kernel/src/lib.rs:637-642 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
- The PR body's Timing line states that none was introduced and that the existing bounds are unchanged. No report says the changed tests have no timeout (the sibling's architect gate, D-1).

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: `cargo test -p spatial-kernel --lib ticket_drop_under_lock_regression`, 20 runs: 20 of 20 pass.
- P-2: M-0, M-1 and M-2 each fail as §4 states.
- P-3 (Part B): `cargo test -p spatial-engine --test session_identity`, 20 runs: 20 of 20 pass. M-B1 and M-B2 fail as §4 states.

Declared unchanged:
- every product line: no diff under engine/src, protocol/ or frontends/, and no diff in kernel/src outside mod ticket_drop_under_lock_regression;
- fixture()'s output for every caller that does not reach the helper, and keyless();
- both copies of touch_modification_time;
- HANG_TIMEOUT, run_with_timeout and every recv_timeout bound;
- every assertion and message of the changed tests (except A4 and B1, which are added), the module doc, and every other test;
- no new pub item, constant, dependency, cfg or ignore.

Invalidators:
- With 5,000 features, A4 or B1 fails; or, with 20,000, the cancelled test ends other than Cancelled.
- §2's arithmetic is then wrong. Stop, return to the architect, and record class 2.

Falsification:
- Any run in which A4 holds and the guard fails, or B1 holds and the flag assertion fails, falsifies §2's ordering argument.

## §6. Instruments

All outcomes are structural assertions: a batch count, the recorded flag, a terminal's class and the events. Nothing is measured or printed.

## §7. Declared values and ceilings

- Part A: at most 110 changed lines, all in kernel/src/skp.rs, and every one of them inside mod ticket_drop_under_lock_regression.
- Part B: at most 70 changed lines, all in engine/tests/session_identity.rs.
- Counting: by §21c's rule, git diff --numstat B H -- kernel/src/skp.rs engine/tests/session_identity.rs, with B = git merge-base origin/main H named in the PR body.
- Non-generated files: at most 6.
  - They are this form, PLAN.yaml, kernel/src/skp.rs and kernel/README.md, plus engine/tests/session_identity.rs and engine/README.md under Part B.
  - The two READMEs carry only the owner's-index update and are outside the line count.
- Feature counts: 5,000 (A2 and B1) and 20,000 (B2). Each is a literal at one site and bounds a minimum batch count by §2's arithmetic. No new constant.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any code before this form is committed with the custodian's hashes, or before covering-names-missing-column has merged.
2. Any edit under protocol/, frontends/ or engine/src; any edit in kernel/src outside mod ticket_drop_under_lock_regression; any edit to a wire fixture, Cargo.lock or package-lock.json. On such a need, stop and tell the human.
3. A diff outside §7's files and the generated set.
4. In a changed test: a sleep, a timeout that is new or changed, or a timing assertion. Any change to HANG_TIMEOUT, run_with_timeout or a recv_timeout bound.
5. A path:line cite in a code comment. Name the symbol instead.
6. A4 placed after the guard, or B1 placed after the terminal match. A count that includes anything but Ok items.
7. fixture()'s output changed for a caller that does not reach the helper, or keyless() changed. Any test changed that §4 does not list.
8. A claim that the flake is fixed beyond §1, or that CI's cause was observed.
9. Part B code before OPEN-1 is settled to option (1).
10. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- Architect and reviewer (§21a; §25(e)).
  - Verdicts follow AUTONOMY.md §22 as the product-first direction's section 2 replaced it (state/directives/2026-10-05-product-first-direction.md:15 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
  - They block only on Correctness or Evidence. Documentation findings are fixed in this PR before the merge.
- Architect: §2's ordering argument and arithmetic against the cited sites; §8, item by item; §1.
- Reviewer:
  - the full diff, with every kernel/src/skp.rs hunk inside the test module;
  - M-0, M-1 (all nine names), M-2, M-B1 and M-B2, each observed by name with its commit id;
  - P-1 and P-3;
  - the owner's-index update against the diff.
- Suites:
  - P-1's command, and P-3's under Part B;
  - cargo fmt --all --check;
  - the workspace, by CI;
  - the node --test scripts suite; verify-plan; verify-cites; verify-quotes; verify-test-claims.
- Heavy runs follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:HASH-TBD).
- The merge is a merge commit, never a squash.
- Operator: none.
- Owner's-index update before the final gate (the second pilot's §1, item 2). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff.
  - kernel/README.md, Owner's index, Governed by, preregistrations in this module: this form's path is added last. The Stream tickets and Close ordering lines pin helper tests whose names do not change; they are verified, not edited.
  - Under Part B, engine/README.md, Owner's index, Governed by: this form's path, in the sub-bullet shape lead-data's update names. The test pinned by the Source descriptor, pre-check and post-check line keeps its name; it is verified, not edited.
- KNOWN-LIMITATIONS: no item is owed. Item 19 is unchanged, because the piece is test-only with no user-visible change.

## §10. Amendments

(opens empty)
````

## 3. OPEN items

**OPEN-1. Do the two same-class tests in `engine/tests/session_identity.rs` belong to this piece (Part B)?**
- **Options:**
  - (1) In scope as Part B, as §2 drafts it, with M-B1, M-B2 and P-3.
  - (2) Routed as a proposed node, with Part B deleted from this form.
  - (3) Recorded as a different class and left as it is.
- **Recommendation: (1).**
  - By the code they are the same class as Part A (§0.4).
  - The cancelled test also has a second loss mode. Its doc says the first assertion holds in both cases, but the code does not support that. Under §22 that is a claim the code does not support, so it should not wait in a queue.
  - The fix has the same shape the human accepted for the sibling's Part B in question round 65. It is test-only and touches one file, and the human's slot-1 pieces do not touch that file.
  - I reject (3), because the code read shows the same race.
- **Red line:** no. No ADR, wire, security or product change.
- **What waits:** Part B's code only, together with §8 item 9 and the engine/README.md index line. Part A can be dispatched once this form is committed and slot 2's item a has merged.

There is no other OPEN item.

## 4. Files read, and the impact read's pointers

**Files read:**
- The impact read, whole.
- PLAN.yaml: the node at 4244-4260; the F-2 node at 4532-4547.
- kernel/src/skp.rs: 3370-4190 and 4700-4795; grep hits for `fixture(`, the helper and `set_modified`.
- kernel/src/lib.rs: 245-289 and 580-645.
- engine/src/stream.rs: 60-89, 395-464, 700-731, 770-929, 1170-1369, 1756-2134, 2230-2294 and 2456-2585; grep hits.
- engine/src/fixture.rs: 425-564, 1240-1259 and 1515-1532.
- engine/src/lib.rs: 146-155.
- engine/src/envelope.rs: grep hits, including 271-274.
- engine/Cargo.toml and kernel/Cargo.toml: crate names.
- engine/tests/session_identity.rs: 1-69 and 430-544.
- engine/tests/source_observation.rs: 30-69, plus grep hits.
- engine/tests/source_watch_adapter.rs: grep hits.
- kernel/tests/dataset_ref.rs: 65-94, plus grep hits.
- kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md: whole.
- The sibling's worker report: whole.
- The sibling's architect draft: F-1 and F-2, by grep.
- state/consults/gates/2026-10-07-typed-terminal-codes-post-check-race-gate1-architect.md: D-1, by grep.
- The two CI logs: PR #187 at 924-955; PR #195 at 970-999.
- kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md: 205-212.
- engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md: 160-239, plus grep for kernel/src.
- kernel/README.md: 345-385. engine/README.md: 495-528.
- KNOWN-LIMITATIONS.md: 219-233.
- AUTONOMY.md: 213-227, 306-391, 413-416 and 476-483.
- docs/PREREGISTRATION-TEMPLATE.md: whole.
- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: whole.
- state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md: whole.
- state/directives/2026-10-05-product-first-direction.md: whole.
- state/directives/2026-10-06-machine-script-adopted.md: 10-23.
- state/directives/PORTABILITY-2026-09-30.md: headings and R1 to R6, by grep.

**Impact-read pointers I used:** §1.1 to §1.5 entire; §1.6 (the sibling's tests and outcomes); §2.1 to §2.4; the ADRs in §3, KNOWN-LIMITATIONS 19, the ceilings and the neighbouring pieces; all five questions. The answers are: Q1 in §2 A1 and §5; Q2 in §2's pins; Q3 in OPEN-1; Q4 in §4's hang-timeout paragraph; Q5 in §0.3 and §1.

**Pointers I found wrong:** none.

**Pointers incomplete (not wrong):**
- §1.2: the default spec continues past engine/src/fixture.rs:553 (for example `attributes: None` at :561).
- §2.4: it classes engine/tests/session_identity.rs:495-540 as the same shape. That is correct, but it misses that this test cancels before it touches. A batch count alone does not fix that test; the order has to swap, as in the sibling's E3. It also misses that the test's doc claims, at :523-527, something the code does not support.

**Pointers missing, which I added:**
- engine/src/stream.rs: the cut sites 2001-2038, 2055-2079 and 2249-2265; the time-budget switch at 1879; TARGET_BATCH_BYTES at 51; the constants at 66-70; BatchStream's Drop at 885-895; produce's cancel checks at 1780-1782, 1884-1888, 1974-1988 and 2540-2545; classify at 2573-2579.
- engine/src/fixture.rs: the vertex minimum in ring() at 1520-1532, and the hole ring at 1257-1258.
- engine/src/envelope.rs:271-274: no attributes on the streaming path.
- The sibling's architect-gate D-1, which matters for Q4.
- The F-2 node, dataset-stream-doc-producer-runs-ahead, which already routes the stale `Dataset::stream` doc.
- The four grep hits the read left unclassified. I read them, and they are a different shape (§0.4).
