# skp.rs's drained-stream helper made unable to lose its post-check race
# (PLAN node skp-drained-stream-helper-post-check-race)

File: kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md
Authority: the human's direction of 2026-10-09, item 3b, slot 2 item b (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:23 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:efba862daf2c39f218aceafa4f4c6b7fb7ec2fad96a38feb8a42bd6eac226333; its RULED block in DECISIONS-PENDING.md); the node's finding F-1 (state/consults/2026-10-07-typed-terminal-codes-post-check-race-architect-draft.md:260 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:dcf0a566aa0a8fcedfa4421ae12830ee5632bb4137d4da5f456fe337b9eefe9e); the sibling-search default (AUTONOMY.md:215 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:5fc1d41f0bad9f276ad4b4c845d4d5ddcdf9af27c467ade5ae83e626387cd2c1).
Drafted by: the architect agent, from lead-data's impact read (state/consults/2026-10-09-skp-drained-stream-helper-post-check-race-impact-read.md, whole-file sha256 9ed71a48a8377c55b55a15b6b9b15af25cb771d78f352d8cdf6118d0584a8a6c), under the second pilot's §2 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:17-21 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:f6bbbdad923bec96db7129da0a748c809b49f10c1cdd119bd8885a555eacd727); code read at main a23e709b.
Committed before any code. No code starts before slot 2's item a (covering-names-missing-column) has merged. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a property currently under test; §25(e)).
Pins: every pin below is a historical pin at a23e709b. If a merge moves a pinned file before this piece's code, the worker re-derives the site by symbol. The pin stays authoritative for what it recorded; the tree is authoritative for the code the piece edits.

## §0. Disclosure

0.1 The failures. Both ran on ubuntu-24.04, and both hit the helper's setup guard:
  - PR #187, run 37675645746, attempt 1, in a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang. The guard's line number in the log is from that run's commit, not from main: state/consults/2026-10-07-pr187-ci-run-37675645746-attempt-1-failed-steps.txt:950-951 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:a3112b6877eb35126e8634dcc37c8076298915000a3543b4415a763744e5f466
  - PR #195, run 37836080416, attempt 1, in after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name: state/consults/2026-10-08-pr195-ci-run-37836080416-attempt-1-failed-steps.txt:993-994 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:1819c7e2ef3efcd47169e441e14001d354dab11b1f18e22de7b225a494564f5d

0.2 The helper as it stands.
  - fixture(), with 50 features: kernel/src/skp.rs:3411-3427 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:ed97bce00a906aa83a1265033e16074817382b5554a86fbbbe4e9a3b819a2eaf
  - the helper: kernel/src/skp.rs:3448-3468 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:c5db39c92f3516c70b8288fb1bbebe7294e001ae9b6a217573210b8311205bda
  - the touch, after the stream is built: kernel/src/skp.rs:3453-3457 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:343f3869411e9490131dbd552a544ee389e40f30e6067b595c346eae7bdedaeb
  - the drain, which neither counts nor inspects what it receives: kernel/src/skp.rs:3458-3461 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:bd31e2f4068ec96ab90c82d1be9dc7cf5a912dbb46448e4bf8d365eeeff076ee
  - the guard: kernel/src/skp.rs:3462-3466 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:ee37495aa073a403f72c580db767ae3f04d6be9e3e9c240630dfd81a848dea60
  - the module doc's reason for draining on the test thread: kernel/src/skp.rs:3380-3389 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:ccff80e0619001fe519c1e93ac2989385a12f6845121aa60ed9aec9fa02e95c2

0.3 Cause (read from code, not observed).
  - open_engine_stream calls stream_with_cancel (kernel/src/lib.rs:255-266 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:c755744461d5a16890e6118fa7bb67ad5e732501782f63ce9ab0a1507c141d0e). That call uses the default policy (engine/src/stream.rs:906-923 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:4e6e6c6a8a3fa6216f60fcfa7cefddf8384f85f0b008dbac99f320d4603b02ad), which cuts by size only (engine/src/stream.rs:398-411 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:2ab51eb8384f8fc947c103c39065393d75b7a68d6c785a5ffb7215c9c8839c68).
  - The producer is spawned inside that call, so it starts before the helper's touch: engine/src/stream.rs:1251-1268 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:678fed1388cfb6800c31e2cc4523b304065cefc89720baa0b6e174be4649d03d
  - With 50 features the stream is exactly one batch:
    - a row's estimate is 20·v + 12 bytes (engine/src/stream.rs:2288-2291 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:396c198087c4410676cc3df3795e5213a0e5c18a768c15c8f99a8cf4e79828ff), with no attribute bytes on this path (engine/src/envelope.rs:271-274 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:2a14cd8e12c55a9260c5a60bfdbaa9efd0f61191d453ddf242ac2e010656aa46);
    - for avg_vertices 8, the outer ring has 4 to 12 vertices (engine/src/fixture.rs:1251-1254 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:c6c551ee92fdb888fd848c4d714e0c8870c43582f5623c86f48ce974014af33f), and a hole of 4 vertices is added on every 7th row (engine/src/fixture.rs:1257-1258 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:6b259e264177cb1c9bf8faa4bfe21759d2d8f7b87170f725c75b79543eee5d32; hole_every 7 is the default, engine/src/fixture.rs:548-553 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:fdfde05dc4e548c20480be5d3118013578a68c64652aa57e53665e73543a0fb3). So a row has at most 16 vertices, which is 332 bytes;
    - 50 × 332 = 16,600 bytes, under the first target of 65,536 (engine/src/stream.rs:66-70 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:95a4c51f239447e203fcd7cd167335a0cf47b972038d8bbc25ca45fc6fddd1bc; engine/src/stream.rs:452-461 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:df7c55b3e6d793e7409d47f3fec795a7012d26daa66edc02b9f9cc0a15f1eee2).
  - One batch fits in the empty queue (engine/src/stream.rs:85 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:4bf4b68e73d54fec88522479beb446850f79e3c73c008573a1069894f72bda0f; engine/src/stream.rs:1237 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:427fa25970aa4fa8ff805fd089f08a16a2c7064cb1d9174b2ff7459f5851c39a). The producer's only send therefore does not wait, and it can then run its post-check (engine/src/stream.rs:1330-1340 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:8a6cd95dd078ebe30357f0c79ef4b505eb330c5104d5bc53850dad2392b19aa8) before the helper touches the file. Nothing orders the post-check after the touch.

0.4 Siblings (the sibling-search default).
  - The helper's five call sites, nine tests in all, are Part A.
  - Same class, not in the node's summary: Part B, conditional on OPEN-1.
    - engine/tests/session_identity.rs:452-487 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:82077deb35dbdb0db2f12a571d67c561b7ed925677f714de669b6b62a8341f75 (clean) and engine/tests/session_identity.rs:495-540 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:7525f6e2399b69a193b097b9cbf7b719e822432579440c22b14a4555a0061179 (cancelled).
    - Both use keyless() (engine/tests/session_identity.rs:53-60 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:0674915876ce481b278c6e4373e304476ae1ff7dfdaad9aad10a4b664b530d20). That is at most 500 × 492 = 246,000 bytes, so at most 2 batches.
    - The cancelled test also cancels before it touches (engine/tests/session_identity.rs:502-503 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:1cc59ac3287684ccfcf869a094b84f218d10ecd05f48711a8cbeb21633602dcf). A producer that sees the cancel early can run its post-check before the touch, whatever the batch count.
    - A producer that ends clean before it sees the cancel, with its post-check after the touch, sends source_changed. The test's first assertion refuses that (engine/tests/session_identity.rs:519-522 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:78f02dd1e0a45783c0ad2c42ca4df985299685a19343677bd874074e67703171), but its doc says that assertion holds in both cases (engine/tests/session_identity.rs:523-527 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:331ec2d375f55c4664d4dad9ee8b5d57c41e099f34eb176d1be09175d79e2fdc).
  - Already unlosable: kernel/tests/typed_terminal_codes.rs, and E2 and E3 in kernel/tests/session_end_event.rs (the sibling form, Amendment 2).
  - Different shape, out of scope:
    - kernel/src/skp.rs's an_end_between_liveness_and_redeem_refuses_by_its_code (a pre-check on a second query);
    - kernel/tests/session_end_event.rs E4 (the sibling form, §0.4);
    - the pre-check, end_generation and watcher sites in kernel/tests/session_generation.rs, session_reference.rs and source_watch_windows.rs;
    - four sites with no open stream, where the mtime is set for a descriptor read, a reference read or a watcher signal: engine/tests/source_observation.rs:43-50 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:e5e34c55bb5652547e2940221445a34ec1363663a1bc24c70dce30c7bed101b1, kernel/tests/dataset_ref.rs:76-82 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:4aaa61128ee4652f27d69fdf023e9611b8ff14b14450a01f175c3d0526b886cc, engine/tests/source_watch_adapter.rs:139-144 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:a9d4648686fe8fd3613e668abea39db4266520958306ce9a29186a499a8af614, engine/tests/source_watch_adapter.rs:658-664 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:d0d48e45711effc0cff174ceda25676bb4850dd2a65d1ae46c144b67a1845751.
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
  - The constant is imported from spatial_engine (engine/src/lib.rs:150-156 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:af666d8c5cff3044f1d3c542e552fe99b323d0e11f6dc91b600ffafe36e31818).
  - The message says the ordering argument needs more batches than the queue holds, and gives the count.
- A5. The helper's doc states the ordering argument by symbol name and carries M-1's and M-2's observed lines. The guard and its message are unchanged.
- No sleep, no new or changed timeout and no timing assertion (question round 25, item 1 (a), as the sibling form's §2 cites it).

Why the order is guaranteed:
- On the helper's thread, the touch comes before the first next_into: kernel/src/skp.rs:3453-3461 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:736a0db639061d309d02c3e9dc95c132d427ac0e58efef605abedc0631f72882
- The queue holds MAX_QUEUED_BATCHES items: engine/src/stream.rs:85 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:4bf4b68e73d54fec88522479beb446850f79e3c73c008573a1069894f72bda0f and engine/src/stream.rs:1237 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:427fa25970aa4fa8ff805fd089f08a16a2c7064cb1d9174b2ff7459f5851c39a
- Each batch is one blocking send: engine/src/stream.rs:2559-2570 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:38bb8aa2144230783eada5dc3acdfc70764f1626fd7f94821018c2fb05a35261
- The consumer's only receive is the recv inside next_into: engine/src/stream.rs:782-797 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:7ae7b06c51312fe223d1ce00c7e4e090ea784c54472e5f31b783bf635a8cbf47
- The post-check runs after produce returns. Its flag is recorded first, and the terminal follows: engine/src/stream.rs:1330-1362 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:24f62b0d7f59a0b07c55116b27e962328f26158dc0e051a847b35c9575384bb7
- The guard reads that flag: engine/src/stream.rs:722-729 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:0bc6da29b39ac253bac25dacc4517e0a921538ac02edcc6781c91dbee0912ec2
- So, with at least MAX_QUEUED_BATCHES + 1 Ok batches received:
  - the send of batch index MAX_QUEUED_BATCHES completed only after the helper's first next_into, which follows the touch;
  - produce returned after that send, and the post-check ran after produce.
- If produce fails before that send, fewer batches arrive and A4 fails by name.

Why 5,000 features give at least 3 batches (arithmetic over the code):
- Each batch's estimate is at most target_for(its index):
  - cut before append, with an incoming estimate that cannot undercount vertices, and an additive estimate: engine/src/stream.rs:2001-2038 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:38088365670b132e6f1284cfb5678efb80c0403bc7d709fe68ce7b1ffa28d0a4
  - cut at the target: engine/src/stream.rs:2055-2079 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:31c42ea912f98dd653fd7bb321148dbae47c3fce5fef48c3dfc95909a74a308b and engine/src/stream.rs:2249-2265 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:8b8bf08ddfe484cd8e9a90283c014101749cd15cc18c0f9550d11f06c1e340e0
  - no time-budget cut under the size-only policy: engine/src/stream.rs:1879 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:8c9434b6d25b85ac5723d85ec6cb3ec737a21227098a43e49ab8427c8e89298c
- target_for(0) + target_for(1) = 65,536 + 262,144 = 327,680 (§0.3's pins on engine/src/stream.rs lines 66-70 and 452-461).
- A row is at least 92 bytes, which is 20·4 + 12:
  - at least 4 vertices per row: engine/src/fixture.rs:1251-1254 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:c6c551ee92fdb888fd848c4d714e0c8870c43582f5623c86f48ce974014af33f and engine/src/fixture.rs:1520-1532 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:86a2914a7d663e34a2977e2eaeb411454ccbce65b424ca53ae9508c30912d269
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
  - 20,000 × 92 = 1,840,000 > 1,376,256, the first three targets. target_for(2) is capped at 1,048,576 by engine/src/stream.rs:51 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:e4e2d1d92430d9e0b16b0349a937e2aa9196846143fd5edcd5f22f59ab8defb7. So the stream has at least MAX_QUEUED_BATCHES + 2 batches.
  - Any cancel the producer observes was requested after the touch.
  - The send of batch index 2, which is not the last batch, cannot complete before the test's first next_into, and that call follows the touch and the cancel. After that send, every path to produce's Ok return passes a cancel check:
    - the loop top: engine/src/stream.rs:1884-1888 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:eed6261ee63fb0cbcda145191a96fd719919af768c20140b1ec9f7501c525439
    - each row: engine/src/stream.rs:1974-1988 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:599893251b3798e7e52067262871ede3eda128101b851ec5ade67b26a514ac8e
    - flush: engine/src/stream.rs:2540-2545 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:abb22a55352e91839b2a1bfc943b81e66d4ef077316e6a147b89dcf60e41fb51
  - An earlier observation (engine/src/stream.rs:1780-1782 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:bb98dabe01b8c4954873c482bf62b1d161ba611aae9f7a4eb442a763cac23ad7) also follows the touch. An interrupted query is classified Cancelled (engine/src/stream.rs:2573-2579 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:263373ed439c59df863ad2a407364319dd85e20a7ae7add17f31d5a13257b362).
  - So the terminal is Cancelled (engine/src/stream.rs:1359-1361 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:470ebdb625de123a07c908811e3b79833f6b2766981ee3a3fc6b8148e68ce5d0), and the post-check, which runs after the touch, records the change.

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
- M-0, a power re-check, of record. Apply cancel's recorded mutation (A) (kernel/src/skp.rs:3522-3530 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:6fa3dbde5fecdb22feeabcd54a2a6005a55f9e8faaa1dfdc8a49fd9cb03eb042). cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang fails with its did-not-return-within message.
- M-1, for A4. This is the one mutation for each of the nine changed tests.
  - Change A2's 5_000 to 50.
  - Run `cargo test -p spatial-kernel --lib ticket_drop_under_lock_regression`.
  - Each of the nine fails at A4's assertion with a count of 1, and the record names each. No other test fails.
- M-2, an observation of the existing guard, not of CI's cause. Move touch_modification_time(path) to after the drain loop. after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name passes A4 and then fails at the guard's existing message. The failure is deterministic, because the drain ends only after the terminal, and the terminal follows the post-check.
- M-B1, for B1. Change the clean test's 5_000 to 500. It fails at B1's assertion: at most 246,000 bytes, so at most 2 batches.
- M-B2, for B2. Move the cancelled test's cancel.cancel() to after its drain loop. It fails at its never-reported-as-a-source-change assertion, with SourceChanged.

The hang-timeout rule if a caller is edited (the sibling form's §8 item 4, and its Amendment 2 item 3):
- The changed tests keep their existing bounds:
  - HANG_TIMEOUT (kernel/src/skp.rs:3409 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:30f094a7beca8b92f1a92b592c887a699c96acd542d308cacc06929620710348), through run_with_timeout (kernel/src/skp.rs:3473-3482 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:55f2741972183e98fa2e9422d6fdb5a0026e39636264e8149be229a55c192c62);
  - the event waits at kernel/src/skp.rs:4069-4076 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:7115732b8df0b3193637af0e44428bc8252e45ccb04082e0e84adee2f04c985e and kernel/src/skp.rs:4166-4173 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:082f417b1e08760096b7f8e975f92ff2b24d18845ef5bf756ef6095659e24158.
  None is added, removed, moved or changed in value.
- Each bound limits a hang or an event's absence. None synchronises anything this piece relies on:
  - every one opens after the helper has returned a stream already drained to its terminal;
  - dropping that stream does no work that grows with the fixture. BatchStream's Drop only cancels (engine/src/stream.rs:885-895 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:59e6fb89cc203213ddb0853675f55cda4ef24770e83d455f60b53a4c473196bb). EngineSource's Drop reads the recorded flag (kernel/src/lib.rs:637-642 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:eb4c96d3101e6b60cc1c185b7ef2cc640900186f1341e19a63e2c0f596a1872d).
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
  - Verdicts follow AUTONOMY.md §22 as the product-first direction's section 2 replaced it (state/directives/2026-10-05-product-first-direction.md:15 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751).
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
- Heavy runs follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ a23e709be28d18c152251bbd3e0e6b24c6a8cdd5 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1).
- The merge is a merge commit, never a squash.
- Operator: none.
- Owner's-index update before the final gate (the second pilot's §1, item 2). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff.
  - kernel/README.md, Owner's index, Governed by, preregistrations in this module: this form's path is added last. The Stream tickets and Close ordering lines pin helper tests whose names do not change; they are verified, not edited.
  - Under Part B, engine/README.md, Owner's index, Governed by: this form's path, in the sub-bullet shape lead-data's update names. The test pinned by the Source descriptor, pre-check and post-check line keeps its name; it is verified, not edited.
- KNOWN-LIMITATIONS: no item is owed. Item 19 is unchanged, because the piece is test-only with no user-visible change.

## §10. Amendments

(opens empty)

### Amendment 1 — the human's ruling on OPEN-1 (class 5)

*Written by the custodian after the human's typed rulings were received (08:37:12Z by the transcript) and before any code. It records the human's ruling on this form's open item. References only; nothing below is a quotation.*

1. **The ruling:** state/directives/2026-10-09-rulings-on-the-eight-forms.md:48-49 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:05dfd632fb1093c5c2ce27c5604c8832fe313d18895ff7d8359b17d2783814bc.
2. **OPEN-1 is (1): Part B is in scope.** §2's Part B (B1 and B2), M-B1, M-B2 and P-3 bind. §8 item 9's condition is met. The `engine/README.md` index line in §9 is owed.
3. **Superseded index:** §3's OPEN-1 → item 2; §8 item 9 → satisfied by item 2. Nothing above is edited.
