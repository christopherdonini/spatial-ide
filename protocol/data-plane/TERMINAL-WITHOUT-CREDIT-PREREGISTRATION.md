# Data plane: credit gates batch frames only, so no terminal frame waits for credit
# (PLAN node data-plane-terminal-without-credit)

File: protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md
Authority: the human's 2026-10-05 direction, line 1, the shape ruling (state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md:7-15 @ 92a71c30 sha256:f18884f27e9525c1aa93974f6dcf72b739fd8fae2c6b052a13f583cc7d1a93bb; RULED 2026-10-05 in DECISIONS-PENDING.md, where the ledger records a sha256 for these lines that the custodian compares). Drafting: question round 43, item 2. Precedent: question round 25, item 1 (a). Origin: question round 51, item 2 (S1 of kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md, its §2 and Amendment 1).
Pilot: the first measured piece of state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md (its §2). Impact read: state/consults/2026-10-05-data-plane-terminal-without-credit-impact-read.md @ c823bce5 sha256:dcb21e03e8bdc5bad32435a06aed164eb275bce56c62755a54cee030451a1941.
Advice, not Authority: Fable's round-51 advice (state/directives/2026-10-04-fable-advice-round-51-forms.md), items 1 to 3.
Drafted by: the architect agent on the custodian's brief; code read at main 92a71c30.
Order:
  1. This form is committed with the custodian's hashes.
  2. OPEN-1 and OPEN-2 go to the human.
  3. Their rulings are recorded as class-5 amendments.
  4. timing-assertions-under-contention (PR #175) merges.
  5. The tests commit, then the M0 observation (§4).
  6. The remedy commit, then the mutation observations (§4).
  7. The gates, then the closing amendment.
  No code line lands before steps 3 and 4 have both happened.
Append-only once committed. An amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, the data plane and a stated guarantee; §21c, size; §25(e)).
Merge: a merge commit (the node key merge: merge-commit), never a squash.

## §0. Disclosure

0.1 Evidence, from the Phase R consult: state/consults/2026-10-04-timing-tests-reproduction.md @ 3831d4a9 sha256:df0253b1c13f40e4f346ac7627ba156355d6d9cafaedcc60dd540c478a8d440d (the hash as the timing form's Amendment 1 records it). Run in scratch at 1c71ebaf. By its §4 tables and §6 rows:
  - R-1: credit 2 granted once, cancel after two TAG_BATCH. No terminal in the 60 s after host.cancel returned, in 10 of 10 runs.
  - R-1b: as R-1, plus a u32::MAX grant after the cancel. TERM_PRODUCER_FAILED in every run, with 0 TAG_BATCH between host.cancel's return and the terminal, in 11 of 11 attempts.
  - R-1c: the unmodified test passed 20 of 20.
  - R-3: credit exactly 12 for 12 batches. 12 batches, then no terminal before the 30 s deadline, in 10 of 10.
  - R-3b: credit 13. 12 batches, then TERM_COMPLETED, in 10 of 10.

0.2 Read from code, not observed (#174 gate-1 architect, N-1). The queue half of H-S was not observed: R-1b counted no batch ahead of the terminal. That half says the Failed item can sit behind the pump channel and the engine queue, and that the engine's blocking send does not watch the token. This form treats it as a code reading:
  - protocol/data-plane/src/pump.rs:47 @ 92a71c30 sha256:841ce4344ad86e97098d4167e542d8a069c85c243d41af66bc3997aae557839a
  - protocol/data-plane/src/pump.rs:57-62 @ 92a71c30 sha256:9efae9f6364a1b128f0100e8182fb92f03b0286679d509b4a3211060ccd8ff32
  - engine/src/stream.rs:2452-2457 @ 92a71c30 sha256:abb22a55352e91839b2a1bfc943b81e66d4ef077316e6a147b89dcf60e41fb51
  - engine/src/stream.rs:2471-2483 @ 92a71c30 sha256:08d752d9b960258a828a8ec0466b682e09bc99781ad4df9663ac245127d03719
  - engine/src/stream.rs:1348-1350 @ 92a71c30 sha256:470ebdb625de123a07c908811e3b79833f6b2766981ee3a3fc6b8148e68ce5d0

0.3 Scope of R-3 (N-2). R-3 and R-3b are evidence about the synthetic source, in scratch, at 1c71ebaf. This piece's completion claim rests on its own T2 (§4), not on them.

0.4 The code today, by pointer.
  - The writer acquires a credit permit before it receives from the pump:
    - protocol/data-plane/src/adapter_ws.rs:203-215 @ 92a71c30 sha256:eb049478bdf47e3f23e4bcf4b5133a76204f5f533eb166c821cf99728a75756a
    - protocol/data-plane/src/adapter_ws.rs:217-224 @ 92a71c30 sha256:3d278e0f137da4118db6e6969512ebe3aa99345986bd715534d21a6956095cbf
  - Completed comes only from a closed pump channel, and ProducerFailed only from a Failed item:
    - protocol/data-plane/src/adapter_ws.rs:222 @ 92a71c30 sha256:dae868595bbfb0839c5e74405fed576563c1e52c08c203594814c2aac8938786
    - protocol/data-plane/src/adapter_ws.rs:226-229 @ 92a71c30 sha256:0dd7ad8e3b4e30f48bd48bdfe6b195c0a28438eedda6a9d3870fe8ef05f500cc
  - Only the reader task fires the halt signal, and every reader arm calls observe_cancel before the source's cancel:
    - protocol/data-plane/src/adapter_ws.rs:130-174 @ 92a71c30 sha256:40b5259fcae8d4a46932b203c927344e4dddcdfd3721624494a2a23a01c737ce
    - protocol/data-plane/src/adapter_ws.rs:134-135 @ 92a71c30 sha256:e743dece3e038e86d29e59c2fc59abaeee6e3864ea9fa04cc99eb5f1b4c65932
    - protocol/data-plane/src/adapter_ws.rs:152-153 @ 92a71c30 sha256:e743dece3e038e86d29e59c2fc59abaeee6e3864ea9fa04cc99eb5f1b4c65932
    - protocol/data-plane/src/adapter_ws.rs:162-163 @ 92a71c30 sha256:a4b2737afd8990caa486ffa70355692e5ad9d7a148e4dcd0ce098127c339518b
    - protocol/data-plane/src/adapter_ws.rs:169-170 @ 92a71c30 sha256:a4b2737afd8990caa486ffa70355692e5ad9d7a148e4dcd0ce098127c339518b
  - `SourceCancel` has one method and no return path:
    - protocol/data-plane/src/transport.rs:128-135 @ 92a71c30 sha256:368df8ce954186a7887863a3f07082c8668af43c791bec1495d153e30a7792d2
  - Redemption hands the data plane the same cancel the ticket registry keeps:
    - kernel/src/skp.rs:300-309 @ 92a71c30 sha256:c00080230c25b962195aecffabc82fb38adc0ec182a56b2cd03c68cffde51450
  - The Redeemed-arm cancel runs under the ticket registry's own lock, in cancel and in cancel_all_for_dataset:
    - kernel/src/skp.rs:323 @ 92a71c30 sha256:f8d7f70f39329e80344a7a13288767770cd5659993360af8386059fe17896cd9
    - kernel/src/skp.rs:353 @ 92a71c30 sha256:094db9f631da7d01cf4458af89296d6e83ca4ae2eab18d3d90798440fbe77217
    - kernel/src/skp.rs:370 @ 92a71c30 sha256:f8d7f70f39329e80344a7a13288767770cd5659993360af8386059fe17896cd9
    - kernel/src/skp.rs:392 @ 92a71c30 sha256:094db9f631da7d01cf4458af89296d6e83ca4ae2eab18d3d90798440fbe77217
  - Session end reaches the same cancel arm:
    - kernel/src/skp.rs:920 @ 92a71c30 sha256:15535f1d13407419ecdc59918eaf396e4b1cc3a28a39d310adb84d5d96f9e79a
  - The attribution-race cancel names a ticket minted in the same call and never returned, so it always meets the Pending arm, and no data-plane stream exists for it:
    - kernel/src/skp.rs:1500-1504 @ 92a71c30 sha256:7530bd777e480e18de7f7e2fc8c8c09b4510a9ab2eb81eb3b5f8517ff2473178
    - kernel/src/skp.rs:333-341 @ 92a71c30 sha256:3e48c95175bc0671769a0ed61ba09efd1877877f89deb7eadde62645b85fe8f3
  - The kernel's cancel object and where it is built:
    - kernel/src/lib.rs:699-705 @ 92a71c30 sha256:f7ba4a049c7a18e445db48b65657924a84a87f593a9162fe17b186f26f078bde
    - kernel/src/lib.rs:286 @ 92a71c30 sha256:3fd4b3ca9a9c7d77923150053a75da97a601a56fc6025b61b0390cfc96c5cf5e
  - Any engine error, cancellation included, reaches the terminal as `<code>: <display>`:
    - kernel/src/lib.rs:683-687 @ 92a71c30 sha256:4b1f967a5599ab67580b35977f0878afd649f39b03c37ba2fdff0f9ad44dfd62
    - kernel/src/skp.rs:2022-2024 @ 92a71c30 sha256:7b791429f3ee7ca8baa5d1f3052d48d773a1b2be91cc8157345514e1de0339ca

0.5 The unchanged end-to-end test passes without the remedy, 20 of 20 in R-1c. #174 gate-1 architect N-3 therefore asks for a test of record that fails deterministically when the remedy is reverted. That test is T1 (§4). The unchanged test:
  - kernel/tests/skp_admission.rs:750-950 @ 92a71c30 sha256:fe0ad6f61486fc9da2de87ed9c17d2a1a6f405739434f2982e4169543c52d010

0.6 HYPOTHESIS, read from code: Part 1 raises the zero-credit plateau. Today the writer holds nothing while it waits for credit, so the plateau is MAX_INFLIGHT_BATCHES (4). After Part 1 the writer holds one batch while it waits, so the plateau becomes MAX_INFLIGHT_BATCHES + 1 (5). That is exactly the bound the existing tests assert and kernel/README.md composes. The declared bound does not grow; the slack in it is used up.
  - protocol/data-plane/tests/candidate_a.rs:508 @ 92a71c30 sha256:cc88dc58110a449126700f85bdf0edced98ddf9d46f5aa80e621cc1aa5af8517
  - protocol/data-plane/tests/candidate_a.rs:517 @ 92a71c30 sha256:acad761c5dea8f9dbf841e4ff6293af4744a10e7eaa2268bc96cef7eac660642
  - kernel/tests/end_to_end.rs:494-495 @ 92a71c30 sha256:57c3131d11c4bf692bba446684aebb471f8f2d5699a4fb4ee9afdeac2913bfc7
  - kernel/tests/end_to_end.rs:509-513 @ 92a71c30 sha256:606312316de07aa7d4f7b0476fcf3a788b1534cbffd8fa27d95799386dd9beba
  - kernel/README.md:59-63 @ 92a71c30 sha256:c9aa475ab5f6dcd8e07975c114d0fe6ad2fa9c8c05155ad0dfbddf5ecd93e416
  Discriminator: §5 P-3 and invalidator I-1.

0.7 The shell consumer, read not run (Fable's item 3; the impact read's question 5).
  - The client grants CREDIT_WINDOW (4) at start. After each batch, it tops up to the full window whenever outstanding is at or below half of it. So once in-flight frames are consumed, the writer holds at least 3 credits, and neither stall is a shell symptom:
    - frontends/shell/src/streaming/adapterWs.ts:13 @ 92a71c30 sha256:19844f7cf735f475705906e2d424346b9ea0aad90b9b858ce3abf3ae1119cd43
    - frontends/shell/src/streaming/adapterWs.ts:45-55 @ 92a71c30 sha256:b36ffc406eca068044f33cb47eb8e399fb4e7d36a8736ac93cd521dadc40718f
    - frontends/shell/src/streaming/adapterWs.ts:119-123 @ 92a71c30 sha256:0bf59fa8b8168a875909a6b009566216667e3aa6a8316fbac4e514fafca6960e
  - Supersede clears the current handle before its SKP cancel, so batches of a superseded stream are not drawn:
    - frontends/shell/src/streaming/viewportStreamManager.ts:385-391 @ 92a71c30 sha256:c119f800ae3287911d31b4ffb105502c6d3ab68f88dcb812094b94f55a32d3b9
  - The self-cancel suppression keys on the handle, not on the terminal's kind:
    - frontends/shell/src/streaming/viewportStreamManager.ts:128-137 @ 92a71c30 sha256:691c4377a17e125d4655b4169dd9369b5cc03598103fc30eaea3b50236ea3c8e
  - No frontends/ change is made.

0.8 ADRs. ADR-004, ADR-010 (rules 6 and 7) and ADR-018 are Accepted and bind. ADR-012 and ADR-019 are Proposed; they are cited only as descriptions, and ADR-012 is neither touched nor amended (the ruling).

0.9 The predecessor. timing-assertions-under-contention's form lets it change kernel/tests/end_to_end.rs (its §7). This piece edits no line of that file. It runs h2, h2_a and h3 as they stand on main at its branch point.

0.10 The trace is process-global, one traced stream per run:
  - engine/src/trace.rs:90-98 @ 92a71c30 sha256:8c1d47840decf4cd1dccfaac02ed1f36c4dd22c77a219d1185c8687fb1a80e3d
  So T1 and T1b live in their own test binary and start no trace. kernel/tests/skp_admission.rs is not touched.

0.11 Not the 5 GB fixture.

## §1. What this preregistration may and may not claim

May claim, once its tests pass:
- C1, completion. With credit equal to the batch count, every batch arrives, then TERM_COMPLETED. No credit beyond the last batch is needed (T2).
- C2, a failure at the head. A Failed item with no batch ahead of it is sent as a terminal with zero credit held (T3a).
- C3, conditional on OPEN-1 option A. From the instant the pump has received a source failure, or the source's owner has cancelled through its SourceCancel (SKP cancel, close_dataset, session end), no terminal waits for credit (T1, T1b, T3b).

May not claim:
- That every producer failure is credit-free. A failure the engine has not yet handed to the pump is outside C3. That is OPEN-2 option (a)'s declared bound.
- That a CI flake is fixed, beyond what T1 and the unchanged test show at the commits named in the closing amendment.
- Any performance figure, or any docs/08 row. The only timing assertions are the liveness deadlines (round 25, item 1 (a)).
- Any new ADR-018 instant, or a moved or renamed one. observed_at stays the binding's own-transport instant (protocol/data-plane/src/transport.rs:148-152 @ 92a71c30 sha256:a0df7b1797e566735df8637da7c07c8d1aa7f13732aefaee092ea941f35bfcc1). The owner-cancel notice is not cancel_observed, and no record calls it so.
- Any wire change: no tag, code or frame layout change; nothing under protocol/skp/; no MCP surface.
- Any ADR amended or touched.
- Any peak-resident figure carried across. One recorded before this piece describes the pre-remedy writer, and is not carried across it (the rule at kernel/README.md:65-69 @ 92a71c30 sha256:24fafe9b85b820de8dab89720c003cb26a56d830f0701dfeb31d2071d90b4f35).
- Any wording settled. The wording of the one new detail string (Part 2, conditional) is the human's at P6, and it ships marked as a placeholder.

## §2. The change

Split on the module boundary. No line under engine/ changes (Part 3).

Part 1, protocol/data-plane/src/adapter_ws.rs (unconditional within the ruling):
- 1a. Each turn of the writer loop receives the next pump item first, raced against the halt signal.
  - None yields Terminal::Completed, and a Failed item yields Terminal::ProducerFailed(detail). Neither waits for credit.
  - A batch waits for one credit, raced against the halt signal (and Part 2's notices), then forgets that permit, then is sent exactly as today.
- 1b. Unchanged:
  - the loop-top halt check: protocol/data-plane/src/adapter_ws.rs:183-185 @ 92a71c30 sha256:4fa730917469fa4d1b11050224c0b1ec9fd71a848bc450557f13dc4948ccaead
  - the send and progress selects: protocol/data-plane/src/adapter_ws.rs:239-266 @ 92a71c30 sha256:6f62252fad029db02306f3d9128c311f38ea5150b454c8969daf920afe9079fe
  - the post-loop source cancel, the terminal mapping, the slot release and the peer drain: protocol/data-plane/src/adapter_ws.rs:272-313 @ 92a71c30 sha256:c55d117d7e1e7b3bd9e0a8250acb7978e82bbe3ba97577a0068900ad8665bd31
- 1c. Ordering at completion. Pump items are FIFO, and the pump drops its sender only after the source returns None, so every batch precedes Completed.

How the writer learns that the stream is over, path by path (the impact read's question 1):
| Path | Signal | Credit needed for the terminal |
|---|---|---|
| Completion | the closed pump channel, read by 1a | none (C1) |
| Producer failure, nothing ahead | the Failed item, read by 1a | none (C2) |
| Producer failure, batches ahead | Part 2's pump-failure notice | none (C3; OPEN-1) |
| SKP cancel; close_dataset; session end | Part 2's owner-cancel notice, via SourceCancel | none (C3; OPEN-1) |
| Data-plane CANCEL, peer close, malformed frame, receive error | the halt signal, unchanged | none, as today |
| Create-time refusal, create panic, pump-spawn failure, concurrency refusal | terminal_and_drain, which never reaches the writer; unchanged | none, as today |
| Attribution race | the Pending arm, so the create-time refusal path (§0.4); unchanged | none, as today |

The unchanged terminal_and_drain paths:
  - protocol/data-plane/src/server.rs:481-543 @ 92a71c30 sha256:d9a9bd588c71bb20cd4e654adee43e7c867599dd51bab98de1353e403a79bae9
  - protocol/data-plane/src/server.rs:557-580 @ 92a71c30 sha256:e9952a7d7b0d9eab7a14ac897d59ea22804e650274085d082c84e118a781001b
  - protocol/data-plane/src/server.rs:607-628 @ 92a71c30 sha256:faf5527db0144167687d2de3010ea5c70cdd83631a2f8ac9f159504354b95a9b

Part 2 (CONDITIONAL on OPEN-1 option A; under option B it drops out; under option C, see OPEN-1):
- 2a. The neutral interface, protocol/data-plane/src/transport.rs. `SourceCancel` gains one provided method, `on_cancel(&self, notify: Box<dyn FnOnce() + Send>)`, whose default drops notify unrun.
  - The contract: the implementor runs notify once, after its own cancel has taken effect. That happens either from cancel(), or at registration when cancel has already run. notify never blocks.
  - No name in it contains a component on the scan's forbidden list: protocol/data-plane/tests/no_transport_leakage.rs:15-45 @ 92a71c30 sha256:5faa7343c6f592da0951f565bad55c654d99615f01b8503748e1e23d6c0fb99d.
  - The existing implementors keep compiling on the default:
    - protocol/data-plane/tests/candidate_a.rs:44 @ 92a71c30 sha256:afbbd5cec068b12af1cba2d41d292bc5d9f13e7cbbeb5aa9689e819dd83c2d71
    - protocol/data-plane/tests/stream_registry_bound.rs:34 @ 92a71c30 sha256:4776e2de25578d96f6ee85805452ec00c8bc2c4536844630d42365cad07bf3f2
    - protocol/data-plane/tests/origin_header_encoding.rs:35 @ 92a71c30 sha256:bb63447fa3dedee7d989a7839d99f1122112635eaf77e81b80905e709a5a4773
    - kernel/src/skp.rs:2376 @ 92a71c30 sha256:9401d2901b37b1b86c418395ac617b4e3e7c29b76c66d523dbcce2cf13661b12
    - kernel/src/skp.rs:3422 @ 92a71c30 sha256:56cd51ceda7e054c6c8295d9d179fd4735bff8ec7831e5129d228b69caccbba1
    - kernel/src/skp.rs:4015 @ 92a71c30 sha256:c237afb2cf9e60806d02798d27bc6aadb387514fac803e13ae6b7a3207c5b994
- 2b. The kernel, kernel/src/lib.rs, `EngineCancel` only.
  - cancel() first cancels the token, as today, then takes the registered notify under EngineCancel's own mutex, and runs it after releasing that mutex.
  - on_cancel stores notify, or runs it at once if cancel has already run.
  - notify may run under the ticket registry's lock (§0.4), so it does only a non-blocking signal and drops nothing that re-enters the kernel (entry 132).
  - StreamRegistry, redeem and every cancel caller are unchanged.
- 2c. The pump, protocol/data-plane/src/pump.rs. Each Failed send also sets a data-plane-internal failure flag, returned with the receiver from pump::spawn. server.rs passes the flag to drive. The Failed sends:
  - protocol/data-plane/src/pump.rs:69-72 @ 92a71c30 sha256:91e6a5a1aa1110e3b9c94f4d9a4514ce531d93722333d81a80459a443b40d719
  - protocol/data-plane/src/pump.rs:74-82 @ 92a71c30 sha256:c507c71002802026cadbd53a39929cf6148b6f7ee4aeff9b717cc383b75937c5
  - protocol/data-plane/src/pump.rs:83-86 @ 92a71c30 sha256:a14fded29654afb0d5d9cd9347da2476cefa2f58009c15b136955e9f876d825f
- 2d. The writer.
  - It registers on_cancel once, at the start of drive. The closure sets an owner-cancel notice.
  - In every wait, it reads both notices' current values before waiting and races their change while waiting, so a notice set earlier is never missed. That is the same shape as the halt check.
  - Deferral. On the owner-cancel notice, if StreamState::is_cancelled() is already true, the data plane's own reader cancelled first (§0.4), so the writer waits for the halt signal and ends with its outcome.
  - Otherwise, and on the pump-failure notice, the writer enters the discard drain:
    - it sends no further batch, and releases the batch it holds;
    - it receives pump items without credit, discarding each batch, until it reaches a Failed item, which yields ProducerFailed(detail) with the source's own detail unchanged;
    - if the channel closes instead, the terminal is Completed when nothing was discarded. Otherwise it is TERM_PRODUCER_FAILED with a data-plane detail stating the data plane's own fact. Its wording is the human's at P6, and it ships marked as a placeholder.
  - The drain races the halt signal, halt first, as every wait does.
- 2e. On the owner path the writer never calls observe_cancel. That would set the pump's loop-top stop (protocol/data-plane/src/pump.rs:53-55 @ 92a71c30 sha256:65970c276f52dfe956c1847fb12f2fb3257279c73c2a17027a5c7607505229b1), the Failed item carrying the engine's typed detail would never be produced, and the ADR-018 meaning of observed_at would change.
- 2f. StreamState gains `note_discarded(bytes)`. It lowers resident_bytes and adds nothing to bytes_emitted. Its product caller is 2d. The counters it sits beside: protocol/data-plane/src/transport.rs:200-213 @ 92a71c30 sha256:ca07d3cfd5b61a1f86dda50953cc2b5e018aaad93cc039245dc2edebeb0b4ace.
- 2g. Why the owner paths need no engine change, read from code.
  - Once the token is set, the producer sends no new batch, because the pre-send check returns Cancelled.
  - The drain frees pump capacity. The pump then pulls the engine queue (MAX_QUEUED_BATCHES, 2) and the one send parked behind it, and the producer's next turn sends Cancelled as the stream's terminal item.
  - At most 8 items are discarded: one in the writer's hand, 4 in the pump channel, 2 in the engine queue and 1 parked send.
  - This is the sequence a u32::MAX grant produces today (R-1b; kernel/tests/skp_filter_cancellation.rs:211-217 @ 92a71c30 sha256:5cf0d922d0c7bc2b93ecb8fb680f90b38e24065c41d15128684ad2c95a3f2c79), with the sends removed.

Part 3 (CONDITIONAL on OPEN-2 option (a)). No line under engine/ changes. protocol/data-plane/README.md states the residual: an engine failure not yet handed to the pump reaches the terminal only after credit moves the items ahead of it. That happens when the failure sits behind a full engine queue while the consumer withholds credit.

Part 4, documentation.
- protocol/data-plane/README.md:
  - the mechanism: credit gates batch frames only;
  - the policy for queued batches, as OPEN-1 rules it;
  - Part 3's residual;
  - the stale START_TIMEOUT figure at protocol/data-plane/README.md:94-95 @ 92a71c30 sha256:e164db1602a5fe25a24827a739f649683509fae2859f9777cd2247867f401aa4, corrected to the code's existing 120 s (protocol/data-plane/src/server.rs:73 @ 92a71c30 sha256:0bc8efcf4fa5e00ccb5bbb7c72015e389ad9cce15bd15d27ee8f26aebe7ec4ab, also stated at protocol/data-plane/README.md:124-125 @ 92a71c30 sha256:6a0bf1cdd24a34ee60bcc0beab6ec5ef1e8e17b166f175c73cba9a2f9311d72d). This corrects a summary to the declared constant. The constant does not change.
- kernel/README.md: the preregistrations bullet.
- The owner's-index update (the pilot's §1, item 2), in kernel/README.md and protocol/data-plane/README.md.

Portability (state/directives/PORTABILITY-2026-09-30.md §2):
- R1. Credit, terminal and cancellation semantics are the same on every platform.
- R2 and R3. No OS-dependent feature is added or changed. tokio's watch and Semaphore, and std's Mutex, are portable.
- R4. No cfg is added.
- R5. Nothing beyond L1 is claimed: the new tests run in the Rust CI matrix on Windows and Linux.
- R6. No test is ignored on any platform.

Done means:
- D-1: OPEN-1 and OPEN-2 recorded as class-5 amendments, by round and item.
- D-2: M0 recorded (§4).
- D-3: the parts the rulings keep have landed, T1 to T4 (as kept) are green, and each mutation is observed (§4).
- D-4: the owner's-index update is in the PR.
- D-5: a closing amendment in references and hashes only.
- D-6: PLAN done, with evidence {pr} set only in the done commit.

## §3. Fixtures

- T1 and T1b: one 200,000-feature fixture each, generated per run under its own name, by the same generator and spec as the unchanged test (kernel/tests/skp_admission.rs:54-69 @ 92a71c30 sha256:2a28b4ab50d9ea905f1074b6b719cec4fd1acd2e85b0ece1cc4cda8b44701d63; its size at kernel/tests/skp_admission.rs:804 @ 92a71c30 sha256:1bf827f83a849cf51ad31c24477c7a15495ed8cd621056c4d394ed497fa8d5ae). Predicted: more than 8 engine batches, which is the premise the unchanged test's comment rests on (kernel/tests/skp_admission.rs:865-866 @ 92a71c30 sha256:f3201c27376b46d717ba2dd7235bb59aebd2c06a8e1a30b76d89a943d02673ca).
- T2: factory(12, 4096, 0) (protocol/data-plane/tests/candidate_a.rs:111-119 @ 92a71c30 sha256:e5f96870cb2a476933e03a9b0ff68626260e65a208fef71ff88254d289c8f451).
- T3a and T3b: a new test-only source that fails after n batches, n = 0 and n = 3, with a fixed detail string.
- T4: a synthetic source of 10,000 batches with a test SourceCancel. Its cancel sets the source's stop flag, runs notify, then sleeps 2 s before returning.
- Not the 5 GB fixture.

## §4. Tests, and the mutation per new test

New tests:
- T1 (CONDITIONAL on OPEN-1 option A). an_skp_cancel_reaches_the_client_as_a_terminal_with_no_credit_granted, in a new file, kernel/tests/skp_cancel_terminal_without_credit.rs. The real shape throughout: SkpHost, a ticket, EngineSourceFactory::ticket_only, serve.
  - Steps: START; no CREDIT frame ever; wait for TAG_OPEN; wait for the stream's batches_generated to plateau (dp.registry.snapshot()); host.cancel, then assert Requested; drain.
  - Asserts:
    - MAX_INFLIGHT_BATCHES <= plateau <= MAX_INFLIGHT_BATCHES + 1;
    - a TAG_TERMINAL arrives within the receive deadline;
    - its code is TERM_PRODUCER_FAILED;
    - its detail begins with spatial_kernel::skp::error_of(&EngineError::Cancelled).code followed by a colon;
    - zero TAG_BATCH frames over the whole run.
  - It starts no trace.
  - Why it is deterministic: no credit is ever granted, and at the plateau the pump is parked on a full channel. Without the owner-cancel notice, no item can move.
  - This test proves the SourceCancel seam end to end, from the real shape.
- T1b (CONDITIONAL on OPEN-1 option A). a_close_dataset_reaches_the_client_as_a_terminal_with_no_credit_granted, same file. As T1, with host.close_dataset in place of host.cancel. It covers cancel_all_for_dataset's own call site. Session end goes through StreamRegistry::cancel, the arm T1 drives, so it is covered by code-path identity and has no separate test.
- T2. credit_equal_to_the_batch_count_delivers_every_batch_then_the_terminal, in protocol/data-plane/tests/candidate_a.rs. Grant exactly 12 for 12 batches, then drain. Asserts: opened; 12 batches; then TERM_COMPLETED; the last progress frame reads 12 of 12; one frame per message.
- T3a. a_producer_failure_with_no_batch_ahead_is_a_terminal_with_no_credit_granted, in candidate_a.rs. Failure at n = 0, no credit. Asserts: TERM_PRODUCER_FAILED; the detail carries the source's words; 0 batches.
- T3b (CONDITIONAL on OPEN-1 option A). a_producer_failure_behind_queued_batches_is_a_terminal_with_no_credit_granted, in candidate_a.rs. Failure at n = 3, no credit; wait until batches_generated is 3. Asserts: TERM_PRODUCER_FAILED with the source's words; 0 batches; resident_bytes is 0 once the terminal has arrived.
- T4 (CONDITIONAL on OPEN-1 option A). a_data_plane_cancel_still_ends_cancelled_when_the_owner_notice_fires_first, in candidate_a.rs, on a multi_thread runtime. No credit; wait for the plateau; send a CANCEL frame. Asserts: TERM_CANCELLED; 0 batches.

Existing tests kept, unchanged and run:
- the unchanged end-to-end proof, kernel/tests/skp_admission.rs's cancel test (§0.5), and the whole of skp_admission.rs;
- skp_filter_cancellation.rs;
- end_to_end.rs's h2, h2_a, h3 and a_create_time_engine_refusal_on_the_raw_path_carries_its_typed_code;
- all of candidate_a.rs, including a_grant_of_n_moves_exactly_n_batches (protocol/data-plane/tests/candidate_a.rs:525-565 @ 92a71c30 sha256:4fe3ca25eab7388e1a493c2a73bcc06133f3e3105f57e57df4583b41a39f0195) and withholding_credit_bounds_producer_memory (protocol/data-plane/tests/candidate_a.rs:483-522 @ 92a71c30 sha256:7d201c3508d5b7e7244cc562eb808212ff715be90aa847683412131f9d3b91bf);
- stream_registry_bound.rs;
- no_transport_leakage.rs;
- the unit tests in wire.rs, adapter_ws.rs and transport.rs;
- kernel/src/skp.rs's unit tests.

M0, the reverted-remedy observation of record:
- T1, T1b, T2, T3a and T3b compile against 92a71c30's interfaces. They are committed first, in a tests commit with no product change.
- Each is run alone 3 times at that commit, through the repeat-runner if evidence-recorder-v0-1 has merged by then, and each failure is recorded by name with that commit's id.
- Predicted:
  - T1 and T1b fail at the receive deadline. Under the old writer, the plateau is 4, the precondition passes, and the writer is parked on credit.
  - T2 fails at recv_by's deadline after 12 batches.
  - T3a and T3b fail at recv_by's deadline with 0 batches.
- T4 needs the new trait method, so it lands with the remedy commit.

Mutations. Each is applied to the remedy commit; its test is run alone; the failure is recorded by name with the commit id; the mutation is reverted. No verify-mutation run is called an observation (round 25, item 2 (c)).
- M1 (T1, T1b): delete the owner-cancel arm from the writer's waits (2d). Predicted: each fails at the receive deadline.
- M2 (T2, T3a): move the credit wait back above the pump receive, the order at protocol/data-plane/src/adapter_ws.rs:203-224 @ 92a71c30 sha256:3eadd6d54770e2ad6fcd3844c97f9f5806d44fb6ce8c9b50469efe1c56024728. Predicted: T2 fails at recv_by's deadline after 12 batches, and T3a at recv_by's deadline with 0 batches.
- M3 (T3b): delete the pump-failure arm. Predicted: it fails at recv_by's deadline.
- M4 (T4): delete the is_cancelled deferral in the owner-cancel arm. Predicted: it fails at its terminal-code assertion, with TERM_PRODUCER_FAILED in place of TERM_CANCELLED.

Under a round 25, item 2 (d) row, a test-text span on the branch is named by its commit id in words until the merge.

## §5. Predictions · declared unchanged · invalidators · falsification

Predictions:
- P-1: M0 as §4 states.
- P-2: after the remedy commit, T1 to T4 (as kept) pass in 10 of 10 alone runs each.
- P-3: withholding_credit_bounds_producer_memory and h3 pass unchanged. Read from code, the zero-credit plateau is 5.
- P-4: the unchanged skp cancel test passes 20 of 20 alone, R-1c's count.
- P-5: h2, h2_a and the data-plane CANCEL tests in candidate_a.rs still end in TERM_CANCELLED in 10 of 10 alone runs each.
- P-6: the suites (§9) are green on Windows and Linux.
- P-7: each mutation fails its test as §4 predicts.
- A miss is a class-2 recorded result. A prediction is never edited.

Declared unchanged (each line range shows no diff, origin/main...HEAD):
- protocol/data-plane/src/wire.rs:22-39 @ 92a71c30 sha256:9692d9118db26b760054a8e3ecf4e237d9d6e870e424da035c2bcb2a6ebc07c4
- protocol/data-plane/src/wire.rs:87-92 @ 92a71c30 sha256:be826dd0dc98eced336d2f21754001d934d5b2f4523ba2a103f083af32b7c91b
- protocol/data-plane/src/server.rs:49-116 @ 92a71c30 sha256:7aff1bd76065b68762f6030b8dca99dd90c50e2643c1f002c0c6bfd97236b064 (every data-plane ceiling, with its compile-time floors)
- engine/src/stream.rs:80 @ 92a71c30 sha256:4bf4b68e73d54fec88522479beb446850f79e3c73c008573a1069894f72bda0f
- kernel/README.md:59-63 @ 92a71c30 sha256:c9aa475ab5f6dcd8e07975c114d0fe6ad2fa9c8c05155ad0dfbddf5ecd93e416
- frontends/shell/src/streaming/adapterWs.ts:13 @ 92a71c30 sha256:19844f7cf735f475705906e2d424346b9ea0aad90b9b858ce3abf3ae1119cd43
- frontends/canvas-probe/src/adapter-ws.ts:23 @ 92a71c30 sha256:19844f7cf735f475705906e2d424346b9ea0aad90b9b858ce3abf3ae1119cd43
- kernel/tests/skp_admission.rs (whole file); docs/adr/ (whole tree); protocol/skp/; frontends/; engine/ (Part 3); KNOWN-LIMITATIONS.md.

Invalidators (STOP; record; back to the human):
- I-1: any zero-credit plateau above MAX_INFLIGHT_BATCHES + 1 (a ceiling grew).
- I-2: any terminal code outside the five, or any batch sent without a credit consumed (a_grant_of_n_moves_exactly_n_batches fails).
- I-3: T1 or T1b passes under M1. The determinism argument would then be wrong.
- I-4: h2, h2_a or the skp cancel test changes outcome.
- I-5: any engine/ line found necessary under OPEN-2 option (a).

Falsification: in T1, the owner-cancel notice fires and no Failed item follows within the deadline. §2g would then be the wrong account.

## §6. Instruments

Every quantity here is an assertion: a terminal present or absent, its code, the code prefix of its detail, batch counts, batches_generated, resident_bytes. Nothing is a measurement. The deadlines are liveness bounds the files already declare, plus one in the new file (§7). No figure is printed as a cancellation span, and no docs/08 row is touched (docs/08_Testing.md:8 @ 92a71c30 sha256:1185356552cbb402306f649f0c38dd4f85c109e86a2a64b34c12009d3e6ea558; ADR-018 §1 and §2 at docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-59 @ 92a71c30 sha256:a78bef239ffe1291f264d2719ba9194bbc158d4d27c658d8e01a7a4e86cd2775).

## §7. Declared values and ceilings

Changed lines are counted by §21c's rule (insertions plus deletions; this form excluded), at the final head, which the closing amendment names:
- Product code, at most 240: git diff --numstat origin/main...HEAD -- protocol/data-plane/src kernel/src
- Tests, at most 420: git diff --numstat origin/main...HEAD -- protocol/data-plane/tests kernel/tests
- Documentation, at most 40: protocol/data-plane/README.md and kernel/README.md.
- Non-generated files touched, at most 11:
  - this form, PLAN.yaml, kernel/README.md, protocol/data-plane/README.md;
  - adapter_ws.rs, pump.rs, server.rs and transport.rs under protocol/data-plane/src, and kernel/src/lib.rs;
  - protocol/data-plane/tests/candidate_a.rs and kernel/tests/skp_cancel_terminal_without_credit.rs (new).
- Must print nothing: git diff --stat origin/main...HEAD -- engine frontends protocol/skp protocol/transport-bakeoff protocol/data-plane/src/wire.rs docs/adr kernel/tests/skp_admission.rs KNOWN-LIMITATIONS.md
- No new product constant.
- Test-site values:
  - the new kernel test file's receive deadline is 60 s, a liveness bound with the same value as kernel/tests/skp_admission.rs:42 @ 92a71c30 sha256:5138d15cb76f0e6e80e1135e8dadb6645b14dfc0c0a270bd593e763ffae08e53;
  - T4's 2 s delay is a fixture delay, asserted nowhere.
- An overrun is recorded as class 8. This section is never edited to match.

## §8. Block-on-sight

1. Any code line before this form is committed with hashes, OPEN-1 and OPEN-2 are recorded as class-5 amendments, and PR #175 has merged.
2. Any line under engine/ changed, unless OPEN-2 is ruled (b) and a class-9 amendment declares the change before its code.
3. Any diff in the §7 must-print-nothing set.
4. A batch frame sent without a credit permit acquired and forgotten, or a terminal outside the five codes.
5. A terminal of any code that waits for credit, within C1 to C3's scope.
6. On the owner path, the writer calls observe_cancel, or the pump stops pulling (2e).
7. The SourceCancel addition is not a provided method with a no-op default; or it names a component on the scan's forbidden list; or EngineCancel runs notify while holding its own mutex; or notify does anything beyond a non-blocking signal.
8. A notice set before a wait can be missed (2d).
9. The owner-cancel arm proceeds without the is_cancelled deferral.
10. TERM_COMPLETED sent after any batch was discarded.
11. A new constant, or a timing assertion other than a liveness deadline (round 25, item 1 (a)).
12. A new test without its mutation observed and recorded by name with its commit; or a verify-mutation run called an observation.
13. M0 missing, or not recorded at the tests commit before the remedy commit.
14. A §7 overrun not recorded as class 8, or §7 edited; a scope addition not recorded as class 9 before its code.
15. A claim beyond §1, in particular credit-free producer failure stated without OPEN-2's bound.
16. Any ADR touched.
17. A bare self-line, a line cite into a file the same commit edits, or a hash pin at a branch commit, in any record.
18. The owner's-index update missing from the PR.
19. A seam written to an interface other than the one transport.rs and kernel/src/lib.rs actually have, or not proven by T1 from the real shape.

## §9. Gates

- Architect:
  - §21a;
  - ADR-004 (binding-neutral interface), ADR-010 rules 6 and 7, ADR-018 vocabulary;
  - the ruling's points, one by one;
  - each round and item cite resolved against its RULED block;
  - each seam against the implementor's actual code;
  - §8 item by item.
- Reviewer:
  - the full diff;
  - every TAG_BATCH send against its credit acquire;
  - §7's commands;
  - the §5 line ranges;
  - the mutation and M0 records against their commits;
  - every pin's hash recomputed.
- Suites:
  - cargo test -p spatial-data-plane;
  - cargo test -p spatial-kernel --test skp_cancel_terminal_without_credit --test skp_admission --test skp_filter_cancellation --test end_to_end;
  - kernel unit tests;
  - cargo clippy and fmt, as CI runs them;
  - the node --test scripts suite; verify-plan, verify-cites, verify-quotes, verify-test-claims and verify-mutation (each a floor, not the proof).
- Operator: none. No frontends change, and §0.7 is read, not run.

## §10. Amendments

(opens empty)
