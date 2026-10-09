# Impact read — skp-drained-stream-helper-post-check-race (lead-data, second pilot, resumed)
Read at: main 0a8f6dcb

Pointers only (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:7-15). Nothing below is a quotation; every path:line is at main 0a8f6dcb.

The piece: PLAN.yaml:4244-4259 (title :4245, depends_on :4251, gate :4253, budget_minutes :4255, summary :4259). Placed by state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:23; pilot resumed by the same file :31. Found as F-1: state/consults/2026-10-07-typed-terminal-codes-post-check-race-architect-draft.md:26 and :260 (pins at 3d740f7b; at main the helper is at kernel/src/skp.rs:3448-3468 and its fixture at kernel/src/skp.rs:3411-3427).

## 1. Interfaces the piece touches

1.1 **The helper** `drained_stream_with_a_recorded_change`, private to the `#[cfg(test)]` module `ticket_drop_under_lock_regression` (kernel/src/skp.rs:3398-3399).
- Whole helper: kernel/src/skp.rs:3448-3468; its doc :3443-3447; the module doc's reason for draining on the test thread :3380-3389.
- Builds the stream through `crate::open_engine_stream(&ds, &query, None)`: kernel/src/skp.rs:3451-3454.
- Touches the file: kernel/src/skp.rs:3457.
- Drains with results discarded, no batch count, terminal not inspected: kernel/src/skp.rs:3458-3461.
- The setup guard both CI failures hit: kernel/src/skp.rs:3462-3466.
- Pinned by: no test pins the helper itself; the guard is the vacuity check for the nine tests in §2.1.

1.2 **The fixture** `fixture(name)`: kernel/src/skp.rs:3411-3427 — 50 features (:3419), avg_vertices 8 (:3420), NativeUnique (:3421), the rest from `FixtureSpec::default()` (engine/src/fixture.rs:548-553). Spec fields: engine/src/fixture.rs:436-441. Per-feature vertex count rule: engine/src/fixture.rs:1251-1254. Output directory: kernel/src/skp.rs:3412-3413. Shared with tests that never use the helper (§2.3).

1.3 **The touch** `touch_modification_time`: kernel/src/skp.rs:3433-3441. Also used at kernel/src/skp.rs:4777 (§2.4).

1.4 **The engine's stream and post-check, as the helper reaches them.**
- `open_engine_stream`: kernel/src/lib.rs:255-266 → `Dataset::stream_with_cancel`: engine/src/stream.rs:906-923, with `BatchSizePolicy::default()` at :917; the default's cut policy is size-only: engine/src/stream.rs:398-411.
- Pre-check, on the caller's thread: engine/src/stream.rs:1179 (`Dataset::check_source_unchanged`, engine/src/dataset.rs:624).
- Producer spawned inside the stream call, so before the helper's touch: engine/src/stream.rs:1251-1268.
- Bounded channel: engine/src/stream.rs:1237; `MAX_QUEUED_BATCHES`: engine/src/stream.rs:85, re-exported at engine/src/lib.rs:153.
- One blocking send per batch: engine/src/stream.rs:2559-2570. The consumer's only receive, `BatchStream::next_into`: engine/src/stream.rs:782-797.
- Batch cut inputs: `target_for` engine/src/stream.rs:452-461; `estimate_bytes` engine/src/stream.rs:2288-2291.
- Post-check after `produce` returns, flag recorded before any terminal: engine/src/stream.rs:1330-1340; `record_source_changed` :715-720; the terminal :1342-1362.
- Read by the guard: `StreamStats::source_changed_detail`, engine/src/stream.rs:722-729.
- Owner's index: engine/README.md:508 (source descriptor, pre-check and post-check), pinned by `engine/tests/session_identity.rs::a_clean_stream_whose_source_changed_terminates_as_source_changed`; engine/README.md:502 (viewport stream, batch sizing), pinned by `engine/tests/batch_sizing.rs::the_policy_stays_inside_its_ceiling_in_every_state_it_can_reach`.

1.5 **What the helper's stream feeds.** `wrap_for_data_plane`: kernel/src/lib.rs:269-288 → `Drop for EngineSource`: kernel/src/lib.rs:637-642 → `end_session_if_source_changed`: kernel/src/lib.rs:593-627 (reads the same flag at :597; its best-effort note :582-588). Owner's index: kernel/README.md:353 (stream tickets), :355 (generations), :358 (close ordering).

1.6 **What the sibling fix used to hold the producer back** (test-only; no product change).
- kernel/tests/typed_terminal_codes.rs: `fixture_with_features` :53-68; 5,000 features :115; touch before the first `next_into` :158; batch count and the `MAX_QUEUED_BATCHES` assertion before the terminal expect :160-178 (import :29); ordering doc :90-94; mutations :96-112. Pinned by `kernel/tests/typed_terminal_codes.rs::the_data_plane_terminal_a_real_redeemed_stream_produces_carries_its_typed_code`.
- kernel/tests/session_end_event.rs: `fixture_with_features` :37-50; E2 :147-212 (5,000; assertion :199-202), pinned by `kernel/tests/session_end_event.rs::a_post_check_end_on_a_clean_terminal_emits_once`; E3 :218-281 (20,000; touch then cancel :257-258), pinned by `kernel/tests/session_end_event.rs::a_post_check_end_on_an_error_terminal_emits_once`.
- The registered argument: kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md:59-76 (Part A) and :81-88 (B3), with sites pinned at 3d740f7b; at main the same symbols are at the engine/src/stream.rs lines in 1.4.
- Outcomes: state/consults/2026-10-07-typed-terminal-codes-post-check-race-worker-report-1.md:19-25 (mutations) and :31-34 (predictions); the closing record, kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md:199-228.

## 2. Who consumes them

2.1 **Callers of the helper**: five call sites, nine tests, all in kernel/src/skp.rs.
- Through `seeded_pending_ticket` (kernel/src/skp.rs:3487-3520, call :3491): `cancel_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` :3541; `sweep_of_an_expired_pending_ticket_whose_post_check_found_a_change_does_not_hang` :3575; `cancel_all_for_dataset_of_a_pending_ticket_whose_post_check_found_a_change_does_not_hang` :3641.
- Directly: `after_cancelling_a_ticket_whose_source_changed_the_next_viewport_query_refuses_by_name` :3684-3749 (call :3689); `a_pending_ticket_retired_by_sweep_emits_once_and_does_not_hang` :4009-4077 (call :4011); `a_pending_drop_inside_close_emits_once_with_its_session_reference` :4117-4174 (call :4137).
- Through `UnwindSetup::new` (kernel/src/skp.rs:3782-3825, call :3795): `an_unwind_through_cancel_drops_its_swept_source_after_releasing_the_guard` :3923; `an_unwind_through_cancel_all_for_dataset_drops_its_swept_source_after_releasing_the_guard` :3942; `an_unwind_through_cancel_all_for_dataset_drops_its_retired_source_after_releasing_the_guard` :3963.
- Pinned in the owner's index: kernel/README.md:353 (the :3923 and :3963 tests) and :358 (the :3541 test).

2.2 **Guard failures seen**, both on ubuntu-24.04: state/consults/2026-10-07-pr187-ci-run-37675645746-attempt-1-failed-steps.txt:928 and :950-951 (the :4009 test; line number at that run's commit); state/consults/2026-10-08-pr195-ci-run-37836080416-attempt-1-failed-steps.txt:975 and :993-994 (the :3684 test, at kernel/src/skp.rs:3462).

2.3 **Other callers of `fixture()`** in the same module that do not use the helper: kernel/src/skp.rs:4204, :4273, :4414, :4499, :4548-4549, :4610, :4706 (inside `a_ticket_past_the_liveness_step`, :4703), :4914, :4952.

2.4 **Other touch-after-open tests in kernel/ and engine/** (grep of `set_modified`, `touch_modification_time(` and `source_changed_detail()` over their .rs files).
- Same shape (the file is touched after the stream is built, and an assertion needs the post-check to see it), with no batch-count condition:
  - engine/tests/session_identity.rs:452-487 (touch :466, terminal match :476-484, flag :486). The engine index pins it (engine/README.md:508).
  - engine/tests/session_identity.rs:495-540 (cancel :502, touch :503, flag assertion :536-539; its doc :523-527 allows a clean end but not an empty flag).
  - Both use `keyless()`, engine/tests/session_identity.rs:53-60 (500 features, avg_vertices 12).
- Already made unlosable: kernel/tests/typed_terminal_codes.rs:158; kernel/tests/session_end_event.rs:186 and :257.
- Different shape (no reliance on the first stream's post-check): kernel/tests/session_end_event.rs:128 (pre-check) and :328-334 (E4, sleep then drop; out of scope per kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md:35); kernel/tests/session_generation.rs:396 (pre-check); kernel/tests/session_reference.rs:109 (direct `end_generation`); kernel/tests/source_watch_windows.rs:106 (watcher); kernel/src/skp.rs:4777 (pre-check of a second query).
- Grep hits not read and not classified: engine/tests/source_observation.rs:48; engine/tests/source_watch_adapter.rs:143 and :663; kernel/tests/dataset_ref.rs:81.

2.5 **Other modules:** none. The helper, the fixture and the touch are private to a `#[cfg(test)]` module. The only product reader of the flag in kernel/ and engine/ is kernel/src/lib.rs:597.

## 3. What governs them

ADRs, Status lines as on main:
- ADR-018: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3 (Accepted 2026-08-08; architect-blockable, :5). The callers cite it for not waiting in real time: kernel/src/skp.rs:3579-3583.
- ADR-019: docs/adr/ADR-019-control-plane-admission-tickets.md:3 (Proposed; binds nothing). The module doc cites it for the producer starting before the mint: kernel/src/skp.rs:3381-3383.
- ADR-035: docs/adr/ADR-035-dataset-session-ended-control-plane-event.md:3 (Accepted 2026-09-24). The events the :4009 and :4117 tests assert.

Preregistrations:
- kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md:12-21 (the module and its first four tests); Amendment 1 :51-108.
- kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md:164-177 (T1 to T3 on the helper), :210 (declared unchanged), :319.
- engine/SOURCE-WATCHER-PREREGISTRATION.md:278, :286, :288 (E5 and E7 reuse the module's helpers).
- kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md:25 and :211; kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md:70 and :95; kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md:12 and :48 (tests placed in the same module).
- kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md: §0.4 :31-35 (routes this helper out); §1 :39-47; §2 :59-88; declared unchanged :118-124; §7 :136-143; §8 :145-164 (item 4 :154, item 5 :155); Amendment 1 :185-197 (index line deferred); Amendment 2 :199-228 (item 3 :211, item 6 :218, item 9 :221-225); Amendment 3 :230-237.
- The lines cut, whose file list held kernel/src/skp.rs (cited by the sibling form at :34 and :151): node geometry-lines-cut is done, PLAN.yaml:2298-2303.
- AUTONOMY.md:215 (sibling search on every fix; one mutation per new test).

KNOWN-LIMITATIONS:
- Item 19, KNOWN-LIMITATIONS.md:219-233: the post-check as the during-query detector the helper's guard depends on. It is in the engine index (engine/README.md:521), not the kernel index (kernel/README.md:379).
- No other item found that governs the helper.

Ceilings:
- `MAX_QUEUED_BATCHES` engine/src/stream.rs:85 (engine/README.md:523); `MIN_BATCH_BYTES` :66; `FIRST_TARGET_BATCH_BYTES` :68; `BATCH_GROWTH_FACTOR` :70.
- `TICKET_TTL` (kernel/README.md:381), used by the sweep callers.
- `HANG_TIMEOUT` kernel/src/skp.rs:3409 is test-local and not in the index.

Neighbouring slot-2 pieces (paths only):
- covering-names-missing-column (PLAN.yaml:3337-3342, blocked). Its form cites kernel/src/skp.rs sites at engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md:56 and :61-62, puts its kernel test in kernel/tests/skp_projection.rs (:172), and counts kernel/src in its budget (:223).
- wire-bytes-invariant-trace-flag-race (PLAN.yaml:4514-4519) names kernel/tests/wire_bytes_invariant.rs in its title.

Owner's index check: no pointer the piece touches was found wrong at main. Both indexes say Last verified at 14acee0b (kernel/README.md:350, engine/README.md:499).

## 4. Questions the form must answer

1. `fixture()` (kernel/src/skp.rs:3411-3427) feeds the nine helper tests and the tests at §2.3. Does `fixture()`'s output stay unchanged for those callers? The sibling declared this for its own files at kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md:120.
2. The sibling's ordering argument is pinned at 3d740f7b for a stream built in `viewport_query` (kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md:59-76). This helper builds through `open_engine_stream` (kernel/src/lib.rs:255-266) and drains on its own thread (kernel/src/skp.rs:3453-3461). Which sites at main (§1.4) does the form pin, and for which fixture spec?
3. engine/tests/session_identity.rs:452-487 and :495-540 have the same shape, on a 500-feature fixture (:53-60) with no batch-count condition. Are they in scope, routed, or recorded as a different class (AUTONOMY.md:215)?
4. The callers use `run_with_timeout`/`HANG_TIMEOUT` (kernel/src/skp.rs:3409, :3473-3482) and `recv_timeout` (:4069-4076, :4166-4173). The sibling's block-on-sight item 4 is at kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md:154, and its Amendment 2 item 3 at :211. How does that item apply if a caller is edited?
5. Two guard failures, in different callers (state/consults/2026-10-07-pr187-ci-run-37675645746-attempt-1-failed-steps.txt:950-951; state/consults/2026-10-08-pr195-ci-run-37836080416-attempt-1-failed-steps.txt:993-994). What may the form claim about their cause, given the sibling's may-not-claim at kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md:43?

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-61
- state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md: 1-45
- kernel/README.md: 346-385
- engine/README.md: 495-528
- PLAN.yaml: 4244-4264, 2298-2304, 3337-3343, 4158-4164, 4514-4520 (grep hits and context)
- kernel/src/skp.rs: 3340-4277, 4720-4839; grep hits for `fixture(`, `touch_modification_time(`, `open_engine_stream`, `wrap_for_data_plane`, test function names
- kernel/src/lib.rs: 225-304, 580-649
- engine/src/stream.rs: 60-89, 398-411, 440-464, 700-799, 896-923, 1220-1379, 2268-2297, 2540-2579; grep hits (:1179 and others)
- engine/src/lib.rs: 148-155
- engine/src/fixture.rs: 430-459, 540-564, 1240-1264
- engine/src/dataset.rs: grep hit :624
- kernel/tests/typed_terminal_codes.rs: 1-230
- kernel/tests/session_end_event.rs: 25-354
- kernel/tests/session_generation.rs: 370-409
- kernel/tests/session_reference.rs: 90-119
- kernel/tests/source_watch_windows.rs: 90-119
- engine/tests/session_identity.rs: 1-80, 395-604
- kernel/TYPED-TERMINAL-CODES-POST-CHECK-RACE-PREREGISTRATION.md: 1-238
- state/consults/2026-10-07-typed-terminal-codes-post-check-race-worker-report-1.md: 1-70
- state/consults/2026-10-07-typed-terminal-codes-post-check-race-architect-draft.md: grep hits :26, :260
- state/consults/2026-10-08-pr195-ci-run-37836080416-attempt-1-failed-steps.txt: 1-231; grep hits :975, :991-999
- state/consults/2026-10-07-pr187-ci-run-37675645746-attempt-1-failed-steps.txt: grep hits :928, :950-951
- kernel/TICKET-DROP-UNDER-LOCK-PREREGISTRATION.md: 1-110
- kernel/TICKET-DROP-FOLLOWUPS-PREREGISTRATION.md: 160-179; grep hits :15, :24, :164, :170, :210, :319
- engine/SOURCE-WATCHER-PREREGISTRATION.md: grep hits :278, :286, :288
- kernel/GENERATION-CLOSE-RACES-PREREGISTRATION.md, kernel/CLOSE-DATASET-UNKNOWN-KEEPS-OPENRECORD-PREREGISTRATION.md, kernel/TICKET-LIVENESS-REDEEM-PREREGISTRATION.md, kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md: grep hits only
- engine/COVERING-NAMES-MISSING-COLUMN-PREREGISTRATION.md: 160-244; grep hits :15, :56, :61-63, :172, :188
- engine/GEOMETRY-LINES-PREREGISTRATION.md: grep hits for kernel/src/skp.rs
- docs/adr/ADR-018-what-cancellation-acknowledged-means.md: 1-6
- docs/adr/ADR-019-control-plane-admission-tickets.md: grep hit :3
- docs/adr/ADR-035-dataset-session-ended-control-plane-event.md: 1-4
- KNOWN-LIMITATIONS.md: 219-234; item headings by grep
- AUTONOMY.md: grep hits :215, :415
