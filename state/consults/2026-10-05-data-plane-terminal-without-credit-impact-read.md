# Impact read — data-plane-terminal-without-credit (lead-data, second pilot, piece 1)
Read at: main c823bce5

Task: lead-data impact read under state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:7-15 (§1, item 1), for the architect's draft (§2, :17-21). Pointers only. It holds no draft text, design, recommendation or approval, and it answers neither OPEN item in state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md:14-15. Nothing in this file is a quotation. Every sentence is my paraphrase of the code or record it points to.

How it was read: Read, Grep and Glob only. I had no Bash, so I computed no hash and ran no build or test. main's ref is c823bce5f393cd9f00dacf7dd2e2fef185f61bf3, from .git/refs/heads/main. Every line cited below was read in the main checkout at that ref. The timing form's §0.3 lines (pinned at 02dfcff3) read the same at main by eye. I did not recompute their hashes.

The piece, by pointer: PLAN.yaml:3994-4011, the node, with summary elements (i) to (v) at :4010 and depends_on at :4001. The shape ruling is state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md:7-15.

## 1. Interfaces the piece touches

### 1a. The data plane's writer, credit gate and terminal frame (protocol/data-plane)

- **Writer entry.** `adapter_ws::drive`, protocol/data-plane/src/adapter_ws.rs:71-80.
  - Credit semaphore created at :82. Halt watch channel at :83.
  - The module doc states the credit and cancel mechanism at :30-36.
- **Credit grant (reader task).** protocol/data-plane/src/adapter_ws.rs:110-129.
  - A CREDIT frame adds permits, clamped only at the semaphore maximum.
  - The reader closes the semaphore when it exits, at :177.
  - Pinned by `protocol/data-plane/src/adapter_ws.rs::tests::parses_credit_and_cancel_control_frames` (:360).
  - Pinned by `protocol/data-plane/tests/candidate_a.rs::a_grant_of_n_moves_exactly_n_batches` (:525).
- **Halt signal: who fires it.** Only the reader task does, at protocol/data-plane/src/adapter_ws.rs:130-174:
  - a CANCEL control frame (:130-150);
  - a malformed control frame (:151-158);
  - a peer close or end of stream (:161-166);
  - a receive error (:168-174).
  - Each arm also calls `StreamState::observe_cancel` and `SourceCancel::cancel`.
  - The writer reads the halt state at the top of each loop, at :183-185.
- **The credit gate.** protocol/data-plane/src/adapter_ws.rs:203-215.
  - The writer acquires one permit, raced only against the halt signal, and forgets it.
  - Then it receives from the pump, at :217-224.
  - A closed pump channel yields `Terminal::Completed` (:222).
  - A `PumpItem::Failed` yields `Terminal::ProducerFailed` (:226-229).
  - The comment at :199-202 names the parked-writer deadlock as fixed for the halt path. It names `h2_a_cancel_before_the_first_batch_still_stops_the_query` as the test that caught it.
- **Terminal frame.**
  - Code mapping at protocol/data-plane/src/adapter_ws.rs:274-280. Frame built and sent at :281-283.
  - Before it, `source_cancel.cancel()` runs at :272.
  - The admission slot (`release_when_done`) is dropped only after the terminal send, at :289.
  - Peer drain, bounded by `PEER_DRAIN_TIMEOUT`, at :307-313.
- **Terminal paths that already send without credit.** Each goes through `terminal_and_drain` (protocol/data-plane/src/server.rs:607-628), not through `drive`:
  - the factory's create-time refusal (:510-531);
  - a create panic (:532-542);
  - a pump-spawn failure (:557-580);
  - the concurrency-ceiling refusal (:491).
  - Pinned by `protocol/data-plane/tests/candidate_a.rs::a_source_refusal_reaches_the_consumer_as_a_typed_terminal` (:611), which grants no credit.
  - Pinned by `protocol/data-plane/tests/candidate_a.rs::the_declared_concurrency_ceiling_refuses_rather_than_queues` (:568).
  - Pinned by `kernel/tests/end_to_end.rs::a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code` (:615).
- **Halt-path terminals reach the wire with no credit held.** The halt arm of the select at protocol/data-plane/src/adapter_ws.rs:203-205 lets them through.
  - Pinned by `kernel/tests/end_to_end.rs::h2_a_cancel_before_the_first_batch_still_stops_the_query` (:432). It grants no credit and expects TERM_CANCELLED.
  - Pinned by `kernel/tests/end_to_end.rs::h2_cancellation_is_observed_by_the_producer_inside_the_budget` (:381).
  - Pinned by `protocol/data-plane/tests/candidate_a.rs::a_cancel_control_frame_reaches_the_source_and_is_observed_producer_side` (:296).
  - Pinned by `protocol/data-plane/tests/candidate_a.rs::a_peer_that_closes_without_cancelling_still_stops_the_producer` (:364).
- **Wire tags and terminal codes.**
  - Tags at protocol/data-plane/src/wire.rs:22-32. Codes TERM_COMPLETED to TERM_DECODE_FAILED at :34-39. Terminal payload layout at :87-92.
  - The `Terminal` taxonomy is at protocol/data-plane/src/transport.rs:73-85.
  - Pinned by `protocol/data-plane/src/wire.rs::tests::progress_and_terminal_payloads_are_fixed_layout_binary` (:184).
  - Pinned by `protocol/data-plane/src/wire.rs::tests::frame_layout_roundtrips` (:139).
  - The ruling holds these unchanged (directive :13).
- **Completion through the writer.**
  - Pinned by `protocol/data-plane/tests/candidate_a.rs::every_batch_and_a_terminal_frame_are_delivered` (:259). It grants 100 credits for 12 batches at :265, and asserts 12 batches then TERM_COMPLETED at :269-270.
  - Pinned by `protocol/data-plane/tests/candidate_a.rs::a_completed_stream_is_recorded_with_its_terminal_outcome` (:668). It grants 10 credits for 3 batches at :672.
- **Producer failure through the writer.**
  - Pinned by `protocol/data-plane/tests/candidate_a.rs::a_batch_over_the_declared_frame_ceiling_terminates_with_the_ceiling_named` (:703). It grants 4 credits at :715, then asserts TERM_PRODUCER_FAILED and 0 batches at :736-743.
- **Pump channel feeding the writer.** `pump::spawn`, protocol/data-plane/src/pump.rs:40-95.
  - `PumpItem` (Batch and Failed) at :26-31.
  - Channel capacity at :47, passed as `MAX_INFLIGHT_BATCHES` from protocol/data-plane/src/server.rs:550-556.
  - The pump checks the data plane's own `StreamState::is_cancelled` at :53-55. It reserves channel capacity before asking the source for a batch, at :57-62.
  - A source error becomes `Failed` at :69-72. A frame-ceiling breach becomes `Failed` at :74-82.
  - The memory bound is pinned by `protocol/data-plane/tests/candidate_a.rs::withholding_credit_bounds_producer_memory` (:483), using `MAX_INFLIGHT_BATCHES + 1` at :508 and :517.
  - The same bound is pinned by `kernel/tests/end_to_end.rs::h3_a_consumer_that_withholds_credit_bounds_producer_memory` (:470).
- **The neutral interface the data plane hands to its sources.**
  - `SourceCancel` has one method, `cancel`, and no return path to the binding: protocol/data-plane/src/transport.rs:128-135.
  - `CreatedSource` at :137-141. `SourceFactory` at :143-146.
  - `StreamState::observe_cancel` and `is_cancelled` at :184-194. The doc at :148-152 states that `observed_at` is the binding's observation on its own transport.
  - Pinned by `protocol/data-plane/tests/no_transport_leakage.rs::the_neutral_interface_names_no_transport` (:98).
  - Pinned by `protocol/data-plane/tests/no_transport_leakage.rs::the_neutral_interface_still_covers_its_declared_vocabulary` (:142).
- **Registry of finished streams.**
  - `record_terminal` runs after `drive` returns, at protocol/data-plane/src/server.rs:596.
  - Pinned by `protocol/data-plane/tests/stream_registry_bound.rs::a_cancel_after_the_terminal_frame_is_still_observed_by_the_producer` (:322).

### 1b. The kernel's SKP cancel path, as far as it reaches the data plane (kernel)

- **`SkpHost::cancel`.** kernel/src/skp.rs:1554-1566. A stream handle goes to `StreamRegistry::cancel`, at :1560.
- **`StreamRegistry::cancel`.** kernel/src/skp.rs:319-364.
  - The Redeemed arm, :342-356, calls the ticket's `SourceCancel` and marks the ticket cancelled. It does not touch the data plane's `StreamState` or the adapter's halt signal.
  - ADR-019 convergence is commented at :348-350.
- **The same `SourceCancel` the data plane holds.**
  - Redemption clones `built.cancel` into the Redeemed state and returns the same `Arc` to the data plane's factory call: kernel/src/skp.rs:293-310.
  - Reached via `EngineSourceFactory::create_from_ticket`, kernel/src/lib.rs:468-482, and `redeem_or_liveness_refusal`, :545-553.
  - `SourceCancel` for the engine is `EngineCancel`, which calls `CancelToken::cancel`: kernel/src/lib.rs:699-705.
- **Other callers of the same Redeemed-arm cancel.** Each ends a redeemed stream by the same route, so each terminal is a ProducerFailed carrying the engine's cancelled detail:
  - `StreamRegistry::cancel_all_for_dataset`, kernel/src/skp.rs:366-404, called by `close_dataset` at :1599-1600;
  - `SessionInvalidator::end_generation`, kernel/src/skp.rs:900-925, through `StreamRegistry::cancel` at :920;
  - the attribution-race cancel in `viewport_query`, kernel/src/skp.rs:1500-1504.
  - All are indexed at kernel/README.md:353-357.
- **How the engine's cancel becomes the terminal's detail.**
  - `EngineSource::next_into` maps every engine error, cancellation included, to a String detail at kernel/src/lib.rs:662-689 (arm at :683-687).
  - The detail is built by `terminal_detail_of`, kernel/src/skp.rs:2022-2024. `EngineError::Cancelled` maps to code name `cancelled` at :2101.
  - Pinned by `kernel/src/skp.rs::tests::every_engine_error_variant_maps_to_a_distinct_engine_dot_code` (:2601).
- **The end-to-end proof the ruling keeps unchanged.**
  - `kernel/tests/skp_admission.rs::cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock` (:780; body :803-950).
  - Credit of 2 granted once at :865-871. `host.cancel` at :888-895. Drain with the 60 s `RECV_DEADLINE` (:42) at :901-913. TERM_PRODUCER_FAILED asserted at :914-919. The liveness bound is at :941-948.
  - Its sibling `kernel/tests/skp_filter_cancellation.rs::cancel_reaches_the_producer_during_a_late_matching_filtered_scan` (:123) grants u32::MAX credit at :214 and cancels at :240.

### 1c. The engine producer's failure and cancel paths, as the data plane sees them (engine)

- **Engine queue.**
  - `MAX_QUEUED_BATCHES` = 2 at engine/src/stream.rs:80 (doc :67-79; compile-time floor :222).
  - The channel is a `sync_channel` of that capacity, at :1226.
- **Pre-send cancel check.** engine/src/stream.rs:2452-2457.
  - It counts `batches_after_cancel` and returns `Cancelled`.
  - It sets no `PRODUCER_CANCELLED` mark. The row-loop site that does set it is at :1963-1977.
- **The blocking send (summary element (v)).** engine/src/stream.rs:2471-2482.
  - The send blocks while the consumer is behind, and it does not watch the token.
  - A disconnected receiver maps to `Cancelled` at :2482.
- **The producer's terminal item.**
  - It is sent after the post-check, by a blocking `tx.send(Err(e))` at engine/src/stream.rs:1331-1351. The error arm is at :1348-1350.
  - `PRODUCER_FINISHED` is marked at :1374, after the terminal send.
- **Consumer side.**
  - `BatchStream::next_into` blocks on `rx.recv()` at engine/src/stream.rs:769-788. On the data plane it is called only from the pump thread, via kernel/src/lib.rs:664.
  - `BatchStream`'s `Drop` cancels the token without a stamp, at engine/src/stream.rs:876-886.
- **The token.**
  - `CancelToken::cancel` at engine/src/cancel.rs:88-98. `cancel_inner` at :117-165, which stamps CANCELLATION_REQUESTED at :122-124. `is_cancelled` at :167-169.
  - Pinned by `engine/src/cancel.rs::tests::an_interrupt_on_an_idle_connection_is_not_latched` (:500).
  - Pinned by `engine/tests/cancel_execute_window.rs::a_cancel_inside_the_producers_execute_window_ends_the_stream_cancelled` (:71).
  - Indexed at engine/README.md:506.
- **Engine cancel tests read so far all keep draining after the cancel.**
  - `engine/tests/slice.rs::cancelling_mid_stream_stops_production_promptly` (:756) drains at :792-797.
  - `engine/tests/slice.rs::dropping_the_stream_cancels_the_query` (:845).
  - `engine/tests/session_identity.rs::a_cancelled_stream_keeps_its_cancelled_terminal_while_the_change_is_still_recorded` (:495).
  - I found no engine test that pins a producer parked in its send after a cancel while the consumer has stopped receiving. That search covered only the test names grepped under engine/tests, listed in Files read. It is not a proof of absence.
- **The boundary any engine change must keep.**
  - `kernel/tests/end_to_end.rs::the_engine_does_not_depend_on_the_data_plane_or_the_other_way_round` (:662).
  - `engine/tests/slice.rs::h6_the_engine_module_names_no_transport` (:981).
  - Indexed at engine/README.md:513.

## 2. Consumers in other modules

- **Shell streaming client.** frontends/shell/src/streaming/adapterWs.ts.
  - `CREDIT_WINDOW` = 4, at :10-13.
  - `grant` at :45-50. The full window is granted at start, at :52-55.
  - Top-up after each batch whenever outstanding is at or below half the window, at :119-123.
  - On a terminal it closes the socket, at :127-134.
  - A close with no terminal is reported as TransportFailed, at :143-148.
  - `RunningStream.cancel` sends a data-plane CANCEL frame, at :157-161.
  - Tests: frontends/shell/src/streaming/adapterWs.test.ts, five cases from :81, all on sink poisoning. None reads the credit window against terminal timing.
  - Fable's round-51 item 3 records the window as read, not run: state/directives/2026-10-04-fable-advice-round-51-forms.md:16-18. Both gate-1 reports checked it against main (architect report :86; reviewer report :40).
- **Shell callers of `startStream` that cancel by SKP.**
  - frontends/shell/src/streaming/viewportStreamManager.ts. `skpCancel` is imported at :13.
  - It discards the `RunningStream` returned at :367, so no data-plane CANCEL is sent there.
  - `supersedeCurrent` calls `skpCancel` at :385-391.
  - The `selfCancelledHandles` doc at :128-137 expects an SKP-cancelled stream to end in ProducerFailed. The suppression is at :351-362.
  - Also frontends/shell/src/streaming/tileViewportStreamManager.ts:1096 and frontends/shell/src/residency/candidateArmSession.ts:1435.
  - The shell's in-situ record of the SKP-cancel terminal code is frontends/shell/CANCELLATION-FACTS.md:14-32.
- **Shell decoding of terminal codes.**
  - By ordinal, at frontends/shell/src/streaming/transport.ts:26-35 and frontends/shell/src/streaming/wire.ts:169-171.
- **Shell host process.**
  - frontends/shell/src-tauri/src/lib.rs:32 serves the data plane. The dependency is at frontends/shell/src-tauri/Cargo.toml:72.
- **Canvas probe client.**
  - Same credit shape: frontends/canvas-probe/src/adapter-ws.ts:23, :101, :129.
- **Kernel test clients of the data plane's credit and terminal frames.** All grant credit and are not edited by the ruling (directive :12 names only the skp cancel test):
  - kernel/tests/skp_admission.rs;
  - kernel/tests/skp_filter_cancellation.rs;
  - kernel/tests/end_to_end.rs;
  - kernel/tests/skp_projection.rs;
  - kernel/tests/concurrency_in_situ.rs;
  - kernel/tests/wire_bytes_invariant.rs;
  - kernel/tests/slice_budgets.rs;
  - kernel/tests/indexed_budgets.rs.
- **No MCP adapter consumer.**
  - protocol/ holds three crates: data-plane, skp and transport-bakeoff (Glob of protocol/*/Cargo.toml).
  - protocol/transport-bakeoff/src/adapter_ws.rs is the bake-off harness's own copy of the adapter. It is a sibling, not a consumer of this crate.

## 3. What governs them

**ADRs, Status lines as they read on main.**
- **ADR-004, Accepted 2026-07-31.** docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3.
- **ADR-010, Accepted 2026-08-03.** docs/adr/ADR-010-render-frames-origins-boundaries.md:3.
  - Rule 6, declared ceilings, at :70.
  - Rule 7, observable failure and a declared recovery policy, at :76-87.
  - The data plane's declared recovery policy is protocol/data-plane/README.md:160-165.
- **ADR-012, Proposed.** docs/adr/ADR-012-data-plane-transport.md:3.
  - Consequences, if accepted, at :216-218: the shutdown protocol at :217, credit accounting as contract at :218.
  - The ruling keeps it Proposed and not amended (directive :15).
- **ADR-018, Accepted 2026-08-08.** docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3.
  - Three instants at :41-50. The scored pair at :56-59.
  - Budget line: docs/08_Testing.md:8.
- **ADR-019, Proposed.** docs/adr/ADR-019-control-plane-admission-tickets.md:3. Its convergence of SKP cancel and TAG_CANCEL is at :99-103.
- **ADR-020, Accepted 2026-08-13.** docs/adr/ADR-020-data-plane-origin-admission-for-an-embedded-consumer.md:3. It governs the data-plane socket's admission, not its credit.
- **ADR-014.** Named as reserved at protocol/data-plane/README.md:103-105. No ADR-014 file exists under docs/adr/ (missing pointer, recorded only).
- **SKP wire text.**
  - `cancel` at protocol/skp/SKP-V0.md:111-121.
  - Backpressure is data-plane credit only, with `MAX_INFLIGHT_BATCHES` 4 unchanged, at :247-248.
  - The terminal detail carries the typed code, at :755-757.
- **Gating.** AUTONOMY.md:315-327 (§21a: the data plane or the wire, and a cancellation guarantee).

**Preregistrations.**
- **kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md:**
  - §0.3 H-S at :34-65, read from code;
  - §0.6 at :74-79;
  - §2 routing and elements (i) to (v) at :107-114;
  - §5's R-1b bound arithmetic, 4 + 2 + 1, at :147;
  - Amendment 1, the closing record, at :205-214.
- **kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md**, the predecessor this piece waits on (PLAN.yaml:4001):
  - its §0.9 separates h2_a's halt-path terminal from H-S, at :83;
  - its §7 lets it change kernel/tests/end_to_end.rs, at :229 and :232. That file holds the h2 and h2_a tests listed in 1a.
- **protocol/data-plane/STREAM-REGISTRY-BOUND-PREREGISTRATION.md:**
  - the pump-spawn Err arm records a terminal, at :99;
  - its readers of `snapshot().last()`, at :119.
- **Kernel halves listed in kernel/README.md:375,** including protocol/skp/CANCEL-STATE-CLOSED-SET-PREREGISTRATION.md (the closed cancel-state set).
- **engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md**, the engine token's execute window, listed at engine/README.md:518.
- **Frozen cancellation semantics:** kernel/CANCELLATION-AND-TRACING.md, cited from engine/src/stream.rs:1355.

**The evidence these rest on.**
- **Phase R consult** state/consults/2026-10-04-timing-tests-reproduction.md:
  - R-1 table at :331-344: no terminal in the 60 s after host.cancel's return, 10 of 10;
  - R-1b at :346-360: TERM_PRODUCER_FAILED after a u32::MAX grant, 0 batches between host.cancel's return and the terminal, 11 of 11 attempts;
  - R-1c at :362-385: the unmodified test passed 20 of 20;
  - R-3 and R-3b at :387-415, on the synthetic source;
  - rows at :745-755; routing and the limited reading of H-S at :763-774.
- **Gate-1 architect** state/consults/gates/2026-10-04-timing-tests-assert-property-not-budget-gate1-architect.md:
  - N-1 at :23-27: (v) is read from code, not observed;
  - N-2 at :29: R-3 is scoped to the synthetic source;
  - N-3 at :31-33: a test of record whose remedy-reverting mutation fails deterministically.
- **Gate-1 reviewer** state/consults/gates/2026-10-04-timing-tests-assert-property-not-budget-gate1-reviewer.md:73-76 (N-6, the same scope as N-1).
- **Fable's round-51 advice:** state/directives/2026-10-04-fable-advice-round-51-forms.md:8-18.

**KNOWN-LIMITATIONS.**
- Items in scope by the indexes: kernel/README.md:377 (5, 6, 8, 12, 16, 21, 28, 30) and engine/README.md:521.
- A case-insensitive grep of KNOWN-LIMITATIONS.md for credit, terminal frame, stall, data plane and cancel found no item about the data plane's credit or terminal frames. No item names the stall (missing, recorded only).
- Item 28, KNOWN-LIMITATIONS.md:308 (a lost dataset_session_ended event), sits beside the session-end cancel route in 1b. It does not name the data plane.

**Declared ceilings, so that the form can show none grows.**
- **Data plane,** protocol/data-plane/src/server.rs:
  - `MAX_CONCURRENT_STREAMS` 4 at :60;
  - `MAX_INFLIGHT_BATCHES` 4 at :62 (credit window and pump capacity, doc :61);
  - `MAX_FRAME_BYTES` 16 MiB at :64;
  - `START_TIMEOUT` 120 s at :73;
  - `MAX_IDLE_CONNECTIONS` 4 at :82;
  - `CROWDED_START_TIMEOUT` 5 s at :89;
  - `PEER_DRAIN_TIMEOUT` 30 s at :96;
  - `MAX_TERMINAL_RECORDS` 64 at :102;
  - `TERMINAL_RECORD_MAX_AGE` 300 s at :107;
  - compile-time floors at :111-116.
- **Data-plane README list.** protocol/data-plane/README.md:94-95 gives `START_TIMEOUT` as 10 s. That disagrees with server.rs:73 and with README.md:124, which both give 120 s (pointer found inconsistent, recorded only).
- **Engine.** `MAX_QUEUED_BATCHES` 2 at engine/src/stream.rs:80. The full engine list is in engine/README.md:523-527.
- **Composed per-stream and per-process figures.** kernel/README.md:52-63. The engine row is at :59, the data-plane row at :60, the per-stream composition at :62, and the four-stream product at :63.
- **Kernel ceilings.** Listed at kernel/README.md:379-382.
- **Client-side.** `CREDIT_WINDOW` 4 at frontends/shell/src/streaming/adapterWs.ts:13, and the same value at frontends/canvas-probe/src/adapter-ws.ts:23.

## 4. Questions the form must answer (gaps only)

1. After an SKP cancel, and after the close_dataset and session-end cancels that use the same Redeemed-arm route, by what signal does the writer learn the stream is over? `SourceCancel` has no return path (protocol/data-plane/src/transport.rs:128-135), and the halt signal and `StreamState` are set only by the reader (protocol/data-plane/src/adapter_ws.rs:130-174; kernel/src/skp.rs:342-356, :920, :1600).
2. Does any line under engine/ change? The ruling sends any engine change to the human before code (directive :14). The blocking send does not watch the token (engine/src/stream.rs:2471-2482), and no engine test found pins a parked send whose consumer has stopped receiving (engine/tests/slice.rs:792-797).
3. Which test of record fails deterministically when the remedy is reverted? The unchanged end-to-end test passed 20 of 20 without the remedy (consult :362-385; gate-1 architect N-3 at :31-33), and the ruling keeps that test unchanged (directive :12).
4. Which assertion pins every batch before the terminal at completion when credit equals the batch count? Every existing completion test grants credit above the batch count (protocol/data-plane/tests/candidate_a.rs:265, :672). The R-3 and R-3b evidence is scoped to the synthetic source (gate-1 architect N-2 at :29).
5. Does the shell's credit top-up ever leave the writer holding zero credit when a terminal is due? It is recorded as read, not run (frontends/shell/src/streaming/adapterWs.ts:119-123; state/directives/2026-10-04-fable-advice-round-51-forms.md:16-18). The shell's self-cancel suppression waits for that terminal (frontends/shell/src/streaming/viewportStreamManager.ts:128-137).

## Files read

- state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md: 1-62
- state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md: 1-46
- engine/README.md: 495-528
- kernel/README.md: 52-81, 346-383
- PLAN.yaml: 3990-4065
- state/consults/2026-10-04-timing-tests-reproduction.md: 1-787
- kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md: 1-215
- state/directives/2026-10-04-fable-advice-round-51-forms.md: 1-22
- state/consults/gates/2026-10-04-timing-tests-assert-property-not-budget-gate1-architect.md: 1-109
- state/consults/gates/2026-10-04-timing-tests-assert-property-not-budget-gate1-reviewer.md: 1-110
- protocol/data-plane/src/adapter_ws.rs: 1-385
- protocol/data-plane/src/pump.rs: 1-96
- protocol/data-plane/src/wire.rs: 1-205
- protocol/data-plane/src/server.rs: 40-119, 500-649; grep of ceiling names
- protocol/data-plane/src/transport.rs: 64-198; grep of declarations
- protocol/data-plane/tests/candidate_a.rs: 1-400, 480-755
- protocol/data-plane/tests/no_transport_leakage.rs, protocol/data-plane/tests/stream_registry_bound.rs: grep of fn names
- protocol/data-plane/README.md: 88-178; grep of headings
- protocol/data-plane/STREAM-REGISTRY-BOUND-PREREGISTRATION.md: grep (credit, record_terminal)
- kernel/src/skp.rs: 280-404, 900-929, 1495-1509, 1540-1605, 2015-2034, 2600-2614; greps (cancel, mod tests)
- kernel/src/lib.rs: 370-706
- kernel/tests/skp_admission.rs: 760-951; grep
- kernel/tests/skp_filter_cancellation.rs: grep
- kernel/tests/end_to_end.rs: 381-520, 655-681; grep
- kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md: grep (data-plane terms, headings, §7)
- engine/src/stream.rs: 60-84, 760-894, 1215-1384, 1955-1984, 2410-2499; grep
- engine/src/cancel.rs: 80-179; grep
- engine/tests/slice.rs: 756-875; grep of cancel tests and h6
- engine/tests/cancel_execute_window.rs and the engine/tests tree: grep of test names
- frontends/shell/src/streaming/adapterWs.ts: 1-164
- frontends/shell/src/streaming/adapterWs.test.ts: grep of test names
- frontends/shell/src/streaming/viewportStreamManager.ts: 120-149, 320-379; grep
- frontends/shell/src/streaming/transport.ts: grep (TERMINAL_KINDS)
- frontends/shell/src/streaming/wire.ts: grep
- frontends/shell/src (startStream callers), frontends/canvas-probe/src/adapter-ws.ts, frontends/shell/src-tauri/src: grep
- frontends/shell/CANCELLATION-FACTS.md: 14-41; grep of headings
- protocol/skp/SKP-V0.md: 108-132, 236-255, 748-762; grep
- docs/adr/ (all Status lines): grep
- docs/adr/ADR-012-data-plane-transport.md: 212-221; grep
- docs/adr/ADR-019-control-plane-admission-tickets.md: 91-108
- docs/adr/ADR-018-what-cancellation-acknowledged-means.md: 39-78; grep of headings
- docs/adr/ADR-010-render-frames-origins-boundaries.md: 70-88; grep of headings
- docs/08_Testing.md: 1-22
- AUTONOMY.md: 315-329; grep
- KNOWN-LIMITATIONS.md: greps (headings; credit, terminal frame, stall, data plane, cancel)
- Cargo.toml files (spatial-data-plane dependents): grep
- .git/HEAD, .git/refs/heads/main, .git/packed-refs: main's ref
