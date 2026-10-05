*Custodian's filing note (2026-10-05): the architect's draft of `data-plane-terminal-without-credit`'s preregistration, on the custodian's brief. Drafting is the architect's by question round 43, item 2. This is the lead-data second pilot's first measured piece, so the brief named the impact read `state/consults/2026-10-05-data-plane-terminal-without-credit-impact-read.md` (sha256 dcb21e03), and the draft's part 4 lists the pointers it used, found wrong and found missing. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with two changes: one final newline, and in part 4 the short cite of ADR-018 lines 36-65, written with the bare ADR id after the docs/adr folder, expanded to the ADR file full name so that verify-cites resolves it. Its sha256 is of the text as received, with the final newline, from this file's line 5 to the end, is ad52818bd96205ea3a500abb8b1f5988a18d1afa815d4d95d480b4fdfb05caa8. Write audit PASS: zero write calls (Read 46, Grep 12, Glob 2, the hand-back 1). The run lasted 00:49:09Z to 01:06:04Z (273,907 subagent tokens, 61 tool uses). C3: the main checkout's porcelain held only its two pre-existing untracked items before (00:48:49Z) and after (01:07:41Z), and main stayed at 92a71c30, the commit the draft says it read. Spot checks by the custodian hold: the attribution-race cancel meets the Pending arm (the draft's W1), and the Redeemed-arm cancel runs under the ticket registry's lock. The two OPEN items are red lines, asked as holds to be ruled in typed words (AUTONOMY.md §4). OPEN-1's option B narrows the human's shape ruling, and OPEN-2's option (a) states a residual the ruling's text does not, so each is a scope change to a ruled item. Profile paths redacted at filing: none.*

---

Reviewed: main @ 92a71c30

I read only. I made no write calls, ran nothing and computed no hashes. Every `HASH-TBD` below is for the custodian to compute. Nothing in this report is in quotation marks, because nothing in it is byte-copied text. All of it is my paraphrase.

## 1. Which form, and why, and what is the human's

**Full form. The node is right.** One correction to its element (i) follows the grounds. Three independent grounds each require the full form:

- **§21a, the data plane.** The piece changes the rule for when the data plane emits TAG_TERMINAL and TAG_BATCH. It also adds one provided method to the data plane's neutral interface (`SourceCancel`), which the kernel implements. That is a cross-module seam.
- **§21a, a stated guarantee.** Three are touched:
  - the data plane's declared recovery policy, which says every stream ends in exactly one terminal frame (`protocol/data-plane/README.md:160-165 @ 92a71c30 sha256:HASH-TBD`);
  - credit-bounded memory, which tests already pin;
  - cancellation propagation (ADR-018).
- **§21c, size.** About 200 code lines and 370 test lines, across 11 files.
- §25(e) also applies: an Out-of-scope line would name §21a categories, so no five-line form may be committed.

**Correction to element (i).** It says §21a's *wire* category applies. The ruling forbids any wire change, so the categories are the data plane and a stated guarantee, not the wire.

**What is the human's:**
- OPEN-1 and OPEN-2 (part 3 below). The ruling says both are asked before any code, so no code lands at all until both are ruled, including Part 1.
- The wording of the one new detail string, if OPEN-1 is answered A (P6).
- The merge click.

The shape itself is ruled and is not reopened.

## 2. The draft

````markdown
# Data plane: credit gates batch frames only, so no terminal frame waits for credit
# (PLAN node data-plane-terminal-without-credit)

File: protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md
Authority: the human's 2026-10-05 direction, line 1, the shape ruling (state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md:7-15 @ 92a71c30 sha256:HASH-TBD; RULED 2026-10-05 in DECISIONS-PENDING.md, where the ledger records a sha256 for these lines that the custodian compares). Drafting: question round 43, item 2. Precedent: question round 25, item 1 (a). Origin: question round 51, item 2 (S1 of kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md, its §2 and Amendment 1).
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
  - protocol/data-plane/src/pump.rs:47 @ 92a71c30 sha256:HASH-TBD
  - protocol/data-plane/src/pump.rs:57-62 @ 92a71c30 sha256:HASH-TBD
  - engine/src/stream.rs:2452-2457 @ 92a71c30 sha256:HASH-TBD
  - engine/src/stream.rs:2471-2483 @ 92a71c30 sha256:HASH-TBD
  - engine/src/stream.rs:1348-1350 @ 92a71c30 sha256:HASH-TBD

0.3 Scope of R-3 (N-2). R-3 and R-3b are evidence about the synthetic source, in scratch, at 1c71ebaf. This piece's completion claim rests on its own T2 (§4), not on them.

0.4 The code today, by pointer.
  - The writer acquires a credit permit before it receives from the pump:
    - protocol/data-plane/src/adapter_ws.rs:203-215 @ 92a71c30 sha256:HASH-TBD
    - protocol/data-plane/src/adapter_ws.rs:217-224 @ 92a71c30 sha256:HASH-TBD
  - Completed comes only from a closed pump channel, and ProducerFailed only from a Failed item:
    - protocol/data-plane/src/adapter_ws.rs:222 @ 92a71c30 sha256:HASH-TBD
    - protocol/data-plane/src/adapter_ws.rs:226-229 @ 92a71c30 sha256:HASH-TBD
  - Only the reader task fires the halt signal, and every reader arm calls observe_cancel before the source's cancel:
    - protocol/data-plane/src/adapter_ws.rs:130-174 @ 92a71c30 sha256:HASH-TBD
    - protocol/data-plane/src/adapter_ws.rs:134-135 @ 92a71c30 sha256:HASH-TBD
    - protocol/data-plane/src/adapter_ws.rs:152-153 @ 92a71c30 sha256:HASH-TBD
    - protocol/data-plane/src/adapter_ws.rs:162-163 @ 92a71c30 sha256:HASH-TBD
    - protocol/data-plane/src/adapter_ws.rs:169-170 @ 92a71c30 sha256:HASH-TBD
  - `SourceCancel` has one method and no return path:
    - protocol/data-plane/src/transport.rs:128-135 @ 92a71c30 sha256:HASH-TBD
  - Redemption hands the data plane the same cancel the ticket registry keeps:
    - kernel/src/skp.rs:300-309 @ 92a71c30 sha256:HASH-TBD
  - The Redeemed-arm cancel runs under the ticket registry's own lock, in cancel and in cancel_all_for_dataset:
    - kernel/src/skp.rs:323 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/skp.rs:353 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/skp.rs:370 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/skp.rs:392 @ 92a71c30 sha256:HASH-TBD
  - Session end reaches the same cancel arm:
    - kernel/src/skp.rs:920 @ 92a71c30 sha256:HASH-TBD
  - The attribution-race cancel names a ticket minted in the same call and never returned, so it always meets the Pending arm, and no data-plane stream exists for it:
    - kernel/src/skp.rs:1500-1504 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/skp.rs:333-341 @ 92a71c30 sha256:HASH-TBD
  - The kernel's cancel object and where it is built:
    - kernel/src/lib.rs:699-705 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/lib.rs:286 @ 92a71c30 sha256:HASH-TBD
  - Any engine error, cancellation included, reaches the terminal as `<code>: <display>`:
    - kernel/src/lib.rs:683-687 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/skp.rs:2022-2024 @ 92a71c30 sha256:HASH-TBD

0.5 The unchanged end-to-end test passes without the remedy, 20 of 20 in R-1c. #174 gate-1 architect N-3 therefore asks for a test of record that fails deterministically when the remedy is reverted. That test is T1 (§4). The unchanged test:
  - kernel/tests/skp_admission.rs:750-950 @ 92a71c30 sha256:HASH-TBD

0.6 HYPOTHESIS, read from code: Part 1 raises the zero-credit plateau. Today the writer holds nothing while it waits for credit, so the plateau is MAX_INFLIGHT_BATCHES (4). After Part 1 the writer holds one batch while it waits, so the plateau becomes MAX_INFLIGHT_BATCHES + 1 (5). That is exactly the bound the existing tests assert and kernel/README.md composes. The declared bound does not grow; the slack in it is used up.
  - protocol/data-plane/tests/candidate_a.rs:508 @ 92a71c30 sha256:HASH-TBD
  - protocol/data-plane/tests/candidate_a.rs:517 @ 92a71c30 sha256:HASH-TBD
  - kernel/tests/end_to_end.rs:494-495 @ 92a71c30 sha256:HASH-TBD
  - kernel/tests/end_to_end.rs:509-513 @ 92a71c30 sha256:HASH-TBD
  - kernel/README.md:59-63 @ 92a71c30 sha256:HASH-TBD
  Discriminator: §5 P-3 and invalidator I-1.

0.7 The shell consumer, read not run (Fable's item 3; the impact read's question 5).
  - The client grants CREDIT_WINDOW (4) at start. After each batch, it tops up to the full window whenever outstanding is at or below half of it. So once in-flight frames are consumed, the writer holds at least 3 credits, and neither stall is a shell symptom:
    - frontends/shell/src/streaming/adapterWs.ts:13 @ 92a71c30 sha256:HASH-TBD
    - frontends/shell/src/streaming/adapterWs.ts:45-55 @ 92a71c30 sha256:HASH-TBD
    - frontends/shell/src/streaming/adapterWs.ts:119-123 @ 92a71c30 sha256:HASH-TBD
  - Supersede clears the current handle before its SKP cancel, so batches of a superseded stream are not drawn:
    - frontends/shell/src/streaming/viewportStreamManager.ts:385-391 @ 92a71c30 sha256:HASH-TBD
  - The self-cancel suppression keys on the handle, not on the terminal's kind:
    - frontends/shell/src/streaming/viewportStreamManager.ts:128-137 @ 92a71c30 sha256:HASH-TBD
  - No frontends/ change is made.

0.8 ADRs. ADR-004, ADR-010 (rules 6 and 7) and ADR-018 are Accepted and bind. ADR-012 and ADR-019 are Proposed; they are cited only as descriptions, and ADR-012 is neither touched nor amended (the ruling).

0.9 The predecessor. timing-assertions-under-contention's form lets it change kernel/tests/end_to_end.rs (its §7). This piece edits no line of that file. It runs h2, h2_a and h3 as they stand on main at its branch point.

0.10 The trace is process-global, one traced stream per run:
  - engine/src/trace.rs:90-98 @ 92a71c30 sha256:HASH-TBD
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
- Any new ADR-018 instant, or a moved or renamed one. observed_at stays the binding's own-transport instant (protocol/data-plane/src/transport.rs:148-152 @ 92a71c30 sha256:HASH-TBD). The owner-cancel notice is not cancel_observed, and no record calls it so.
- Any wire change: no tag, code or frame layout change; nothing under protocol/skp/; no MCP surface.
- Any ADR amended or touched.
- Any peak-resident figure carried across. One recorded before this piece describes the pre-remedy writer, and is not carried across it (the rule at kernel/README.md:65-69 @ 92a71c30 sha256:HASH-TBD).
- Any wording settled. The wording of the one new detail string (Part 2, conditional) is the human's at P6, and it ships marked as a placeholder.

## §2. The change

Split on the module boundary. No line under engine/ changes (Part 3).

Part 1, protocol/data-plane/src/adapter_ws.rs (unconditional within the ruling):
- 1a. Each turn of the writer loop receives the next pump item first, raced against the halt signal.
  - None yields Terminal::Completed, and a Failed item yields Terminal::ProducerFailed(detail). Neither waits for credit.
  - A batch waits for one credit, raced against the halt signal (and Part 2's notices), then forgets that permit, then is sent exactly as today.
- 1b. Unchanged:
  - the loop-top halt check: protocol/data-plane/src/adapter_ws.rs:183-185 @ 92a71c30 sha256:HASH-TBD
  - the send and progress selects: protocol/data-plane/src/adapter_ws.rs:239-266 @ 92a71c30 sha256:HASH-TBD
  - the post-loop source cancel, the terminal mapping, the slot release and the peer drain: protocol/data-plane/src/adapter_ws.rs:272-313 @ 92a71c30 sha256:HASH-TBD
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
  - protocol/data-plane/src/server.rs:481-543 @ 92a71c30 sha256:HASH-TBD
  - protocol/data-plane/src/server.rs:557-580 @ 92a71c30 sha256:HASH-TBD
  - protocol/data-plane/src/server.rs:607-628 @ 92a71c30 sha256:HASH-TBD

Part 2 (CONDITIONAL on OPEN-1 option A; under option B it drops out; under option C, see OPEN-1):
- 2a. The neutral interface, protocol/data-plane/src/transport.rs. `SourceCancel` gains one provided method, `on_cancel(&self, notify: Box<dyn FnOnce() + Send>)`, whose default drops notify unrun.
  - The contract: the implementor runs notify once, after its own cancel has taken effect. That happens either from cancel(), or at registration when cancel has already run. notify never blocks.
  - No name in it contains a component on the scan's forbidden list: protocol/data-plane/tests/no_transport_leakage.rs:15-45 @ 92a71c30 sha256:HASH-TBD.
  - The existing implementors keep compiling on the default:
    - protocol/data-plane/tests/candidate_a.rs:44 @ 92a71c30 sha256:HASH-TBD
    - protocol/data-plane/tests/stream_registry_bound.rs:34 @ 92a71c30 sha256:HASH-TBD
    - protocol/data-plane/tests/origin_header_encoding.rs:35 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/skp.rs:2376 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/skp.rs:3422 @ 92a71c30 sha256:HASH-TBD
    - kernel/src/skp.rs:4015 @ 92a71c30 sha256:HASH-TBD
- 2b. The kernel, kernel/src/lib.rs, `EngineCancel` only.
  - cancel() first cancels the token, as today, then takes the registered notify under EngineCancel's own mutex, and runs it after releasing that mutex.
  - on_cancel stores notify, or runs it at once if cancel has already run.
  - notify may run under the ticket registry's lock (§0.4), so it does only a non-blocking signal and drops nothing that re-enters the kernel (entry 132).
  - StreamRegistry, redeem and every cancel caller are unchanged.
- 2c. The pump, protocol/data-plane/src/pump.rs. Each Failed send also sets a data-plane-internal failure flag, returned with the receiver from pump::spawn. server.rs passes the flag to drive. The Failed sends:
  - protocol/data-plane/src/pump.rs:69-72 @ 92a71c30 sha256:HASH-TBD
  - protocol/data-plane/src/pump.rs:74-82 @ 92a71c30 sha256:HASH-TBD
  - protocol/data-plane/src/pump.rs:83-86 @ 92a71c30 sha256:HASH-TBD
- 2d. The writer.
  - It registers on_cancel once, at the start of drive. The closure sets an owner-cancel notice.
  - In every wait, it reads both notices' current values before waiting and races their change while waiting, so a notice set earlier is never missed. That is the same shape as the halt check.
  - Deferral. On the owner-cancel notice, if StreamState::is_cancelled() is already true, the data plane's own reader cancelled first (§0.4), so the writer waits for the halt signal and ends with its outcome.
  - Otherwise, and on the pump-failure notice, the writer enters the discard drain:
    - it sends no further batch, and releases the batch it holds;
    - it receives pump items without credit, discarding each batch, until it reaches a Failed item, which yields ProducerFailed(detail) with the source's own detail unchanged;
    - if the channel closes instead, the terminal is Completed when nothing was discarded. Otherwise it is TERM_PRODUCER_FAILED with a data-plane detail stating the data plane's own fact. Its wording is the human's at P6, and it ships marked as a placeholder.
  - The drain races the halt signal, halt first, as every wait does.
- 2e. On the owner path the writer never calls observe_cancel. That would set the pump's loop-top stop (protocol/data-plane/src/pump.rs:53-55 @ 92a71c30 sha256:HASH-TBD), the Failed item carrying the engine's typed detail would never be produced, and the ADR-018 meaning of observed_at would change.
- 2f. StreamState gains `note_discarded(bytes)`. It lowers resident_bytes and adds nothing to bytes_emitted. Its product caller is 2d. The counters it sits beside: protocol/data-plane/src/transport.rs:200-213 @ 92a71c30 sha256:HASH-TBD.
- 2g. Why the owner paths need no engine change, read from code.
  - Once the token is set, the producer sends no new batch, because the pre-send check returns Cancelled.
  - The drain frees pump capacity. The pump then pulls the engine queue (MAX_QUEUED_BATCHES, 2) and the one send parked behind it, and the producer's next turn sends Cancelled as the stream's terminal item.
  - At most 8 items are discarded: one in the writer's hand, 4 in the pump channel, 2 in the engine queue and 1 parked send.
  - This is the sequence a u32::MAX grant produces today (R-1b; kernel/tests/skp_filter_cancellation.rs:211-217 @ 92a71c30 sha256:HASH-TBD), with the sends removed.

Part 3 (CONDITIONAL on OPEN-2 option (a)). No line under engine/ changes. protocol/data-plane/README.md states the residual: an engine failure not yet handed to the pump reaches the terminal only after credit moves the items ahead of it. That happens when the failure sits behind a full engine queue while the consumer withholds credit.

Part 4, documentation.
- protocol/data-plane/README.md:
  - the mechanism: credit gates batch frames only;
  - the policy for queued batches, as OPEN-1 rules it;
  - Part 3's residual;
  - the stale START_TIMEOUT figure at protocol/data-plane/README.md:94-95 @ 92a71c30 sha256:HASH-TBD, corrected to the code's existing 120 s (protocol/data-plane/src/server.rs:73 @ 92a71c30 sha256:HASH-TBD, also stated at protocol/data-plane/README.md:124-125 @ 92a71c30 sha256:HASH-TBD). This corrects a summary to the declared constant. The constant does not change.
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

- T1 and T1b: one 200,000-feature fixture each, generated per run under its own name, by the same generator and spec as the unchanged test (kernel/tests/skp_admission.rs:54-69 @ 92a71c30 sha256:HASH-TBD; its size at kernel/tests/skp_admission.rs:804 @ 92a71c30 sha256:HASH-TBD). Predicted: more than 8 engine batches, which is the premise the unchanged test's comment rests on (kernel/tests/skp_admission.rs:865-866 @ 92a71c30 sha256:HASH-TBD).
- T2: factory(12, 4096, 0) (protocol/data-plane/tests/candidate_a.rs:111-119 @ 92a71c30 sha256:HASH-TBD).
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
- all of candidate_a.rs, including a_grant_of_n_moves_exactly_n_batches (protocol/data-plane/tests/candidate_a.rs:525-565 @ 92a71c30 sha256:HASH-TBD) and withholding_credit_bounds_producer_memory (protocol/data-plane/tests/candidate_a.rs:483-522 @ 92a71c30 sha256:HASH-TBD);
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
- M2 (T2, T3a): move the credit wait back above the pump receive, the order at protocol/data-plane/src/adapter_ws.rs:203-224 @ 92a71c30 sha256:HASH-TBD. Predicted: T2 fails at recv_by's deadline after 12 batches, and T3a at recv_by's deadline with 0 batches.
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
- protocol/data-plane/src/wire.rs:22-39 @ 92a71c30 sha256:HASH-TBD
- protocol/data-plane/src/wire.rs:87-92 @ 92a71c30 sha256:HASH-TBD
- protocol/data-plane/src/server.rs:49-116 @ 92a71c30 sha256:HASH-TBD (every data-plane ceiling, with its compile-time floors)
- engine/src/stream.rs:80 @ 92a71c30 sha256:HASH-TBD
- kernel/README.md:59-63 @ 92a71c30 sha256:HASH-TBD
- frontends/shell/src/streaming/adapterWs.ts:13 @ 92a71c30 sha256:HASH-TBD
- frontends/canvas-probe/src/adapter-ws.ts:23 @ 92a71c30 sha256:HASH-TBD
- kernel/tests/skp_admission.rs (whole file); docs/adr/ (whole tree); protocol/skp/; frontends/; engine/ (Part 3); KNOWN-LIMITATIONS.md.

Invalidators (STOP; record; back to the human):
- I-1: any zero-credit plateau above MAX_INFLIGHT_BATCHES + 1 (a ceiling grew).
- I-2: any terminal code outside the five, or any batch sent without a credit consumed (a_grant_of_n_moves_exactly_n_batches fails).
- I-3: T1 or T1b passes under M1. The determinism argument would then be wrong.
- I-4: h2, h2_a or the skp cancel test changes outcome.
- I-5: any engine/ line found necessary under OPEN-2 option (a).

Falsification: in T1, the owner-cancel notice fires and no Failed item follows within the deadline. §2g would then be the wrong account.

## §6. Instruments

Every quantity here is an assertion: a terminal present or absent, its code, the code prefix of its detail, batch counts, batches_generated, resident_bytes. Nothing is a measurement. The deadlines are liveness bounds the files already declare, plus one in the new file (§7). No figure is printed as a cancellation span, and no docs/08 row is touched (docs/08_Testing.md:8 @ 92a71c30 sha256:HASH-TBD; ADR-018 §1 and §2 at docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-59 @ 92a71c30 sha256:HASH-TBD).

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
  - the new kernel test file's receive deadline is 60 s, a liveness bound with the same value as kernel/tests/skp_admission.rs:42 @ 92a71c30 sha256:HASH-TBD;
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
````

## 3. The OPEN items, for the human before any code

**OPEN-1: what happens to batches queued ahead of the terminal.** The case: the data plane knows the stream will not complete, because either the pump has received a failure or the source's owner has cancelled it (SKP cancel, close_dataset, session end).

- **(A) Discard. Recommended.**
  - What it does:
    - Once the end is known, no further batch is sent.
    - The pump is drained without credit and its batches are discarded.
    - The terminal carries the source's own detail, so the engine's typed code is kept.
    - If the pump ends with no Failed item after a discard, the terminal is TERM_PRODUCER_FAILED with one new data-plane detail string; its wording is the human's at P6.
  - Why:
    - It is the only option that meets line 1 as written.
    - It is what the data-plane CANCEL path already does to queued batches, since the halt arm breaks and pump items are dropped.
    - Its tests are deterministic.
  - Costs:
    - A stream ended by a source change or a session end no longer delivers batches already queued, at most 8.
    - A superseded stream's batches are not drawn anyway (read, not run).
- **(B) Deliver first, FIFO under credit.**
  - The terminal waits for the credit those batches need. That is H-S's stall on the SKP path whenever credit is scarce.
  - It contradicts line 1's rule that a terminal is never held for credit, after a failure or after an SKP cancel, so choosing it narrows the ruling.
  - Part 2 drops out. T1, T1b and T3b invert.
- **(C) Deliver what held credit covers, discard the rest.**
  - It never holds the terminal.
  - How many batches are delivered depends on when credit arrived, so tests can pin only the zero-credit case.
  - It needs more code.
- **What waits on it:**
  - all of Part 2: the SourceCancel method, EngineCancel, the pump flag, the writer's drain and deferral, note_discarded;
  - T1, T1b, T3b and T4, with M1, M3 and M4;
  - the README policy sentence;
  - the new detail string.

**OPEN-2: any engine change.**

- **(a) None. Recommended.**
  - Part 2's drain releases the engine's parked send (§2g), so element (v) needs no engine change on the owner paths.
  - The bound to accept: an engine failure not yet handed to the pump still reaches the terminal only after credit moves the items ahead of it. That happens when the failure sits behind a full engine queue while the consumer withholds credit.
  - That bound is stated as a residual in protocol/data-plane/README.md.
  - No KNOWN-LIMITATIONS item, because the shell never withholds credit at quiescence (§0.7, read, not run).
- **(b) An engine change that removes the bound.**
  - The engine side: an error slot that BatchStream::next_into reads ahead of its queue, with the producer's sends made token-aware.
  - The pump side: a BatchSource addition, so the parked pump can learn of the error.
  - It crosses engine, kernel and the data plane, and it moves PRODUCER_CANCELLED's stamp sites (ADR-018).
  - If wanted, it should be its own placed node with its own form, not a class-9 addition here.
- **(c) Only element (v), literally: the blocking send watches the token.**
  - Alone, it delivers no terminal, because the pump stays parked on a full channel.
  - It moves stamp sites.
  - Not recommended.
- **What waits on it:** Part 3, §8 item 2, §1's bound sentence, the README residual, and the KNOWN-LIMITATIONS decision.

## 4. Files read, and the impact read's pointers

**Read:**
- the impact read (whole);
- `state/directives/2026-10-05-human-direction-data-plane-mods-v1-pilot-v2.md` (whole);
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` (whole);
- `PLAN.yaml:3985-4065`;
- `DECISIONS-PENDING.md`: the RULED 2026-10-05 block and round 25, item 1;
- `docs/PREREGISTRATION-TEMPLATE.md` (whole);
- `AUTONOMY.md` §21 to §22 and §23 to §30;
- `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md` (whole);
- the Phase R consult: §1 to §3 head, and §4 to §8;
- the #174 gate-1 architect report (whole);
- `state/directives/2026-10-04-fable-advice-round-51-forms.md` (whole);
- `state/directives/PORTABILITY-2026-09-30.md`: headings and R3 to R6;
- `protocol/data-plane/src/adapter_ws.rs` (whole) and `pump.rs` (whole);
- `protocol/data-plane/src/transport.rs:60-315`;
- `protocol/data-plane/src/server.rs:40-124` and `:470-640`;
- `protocol/data-plane/README.md:56-178`;
- `protocol/data-plane/tests/candidate_a.rs:1-755` and `no_transport_leakage.rs` (whole);
- `kernel/src/lib.rs:240-290` and `:440-706`;
- `kernel/src/skp.rs:240-405`, `:895-929`, `:1490-1607`, `:2012-2036` and `:2085-2109`;
- `kernel/tests/skp_admission.rs:40-129` and `:740-951`;
- `kernel/tests/end_to_end.rs:370-519`;
- `kernel/README.md:48-83`;
- `engine/src/stream.rs:1325-1379` and `:2440-2489`;
- `engine/src/trace.rs:60-119`;
- `frontends/shell/src/streaming/adapterWs.ts` (whole);
- `viewportStreamManager.ts:120-149` and `:340-394`;
- `docs/adr/ADR-018-what-cancellation-acknowledged-means.md:36-65` and `ADR-012:210-221`;
- `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`: a grep of headings and of the files it changes;
- `KNOWN-LIMITATIONS.md`: item headings, last item 30.
- Also greps for SourceCancel implementors, MAX_INFLIGHT_BATCHES, snapshot and batches_generated, and the watch_support module.

**Pointers used:**
- 1a: the writer, credit gate, halt, terminal paths, pump, neutral interface and memory-bound tests. These drive §0.4, §2 and §4.
- 1b: the Redeemed arm, redemption, EngineCancel, the detail mapping and the unchanged test. These drive §0.4, 2b and T1.
- 1c: MAX_QUEUED_BATCHES, the pre-send check, the blocking sends and the terminal send. These drive §0.2 and 2g.
- §2: the shell window, the self-cancel suppression and the canvas-probe window. These drive §0.7 and §5.
- §3: ADR statuses, the README recovery policy, ADR-012's Consequences, ADR-018, the predecessor's §7, the consult rows, N-1 to N-3, the ceilings list, and the START_TIMEOUT inconsistency. These drive Part 4.
- All five questions are answered:
  - Q1: the §2 path table and Part 2.
  - Q2: Part 3 and OPEN-2.
  - Q3: T1, with M0 and M1.
  - Q4: T2.
  - Q5: §0.7.

**Pointers found wrong:**
- W1. The read lists the attribution-race cancel (`kernel/src/skp.rs:1500-1504`) as a Redeemed-arm caller whose terminal is ProducerFailed with the engine's cancelled detail. In fact it cancels a ticket minted in the same call and never returned, so it meets the Pending arm (`:333-341`). No data-plane stream exists for it.
- W2. The read says all the kernel test clients grant credit. `kernel/tests/end_to_end.rs`'s h2_a and h3 grant none (`:440`, and `:475` with no grant after it).

**Pointers missing:**
- M-a. The Redeemed-arm cancel runs under the ticket registry's own lock (`kernel/src/skp.rs:323`/`:353`, `:370`/`:392`). Any notify added to `SourceCancel` depends on this.
- M-b. The other `SourceCancel` implementors that a trait change must keep compiling (the six sites in 2a).
- M-c. The scan's forbidden-word list (`no_transport_leakage.rs:15-45`) limits new names in `transport.rs`. The read cited the test but not this constraint.
- M-d. The process-global trace (`engine/src/trace.rs:90-98`). A new SKP-cancel test inside `skp_admission.rs`'s binary would pollute the unchanged test's trace, which is why T1 gets its own binary.
- M-e. What receive-first does to the memory bound: the writer holding one batch meets the existing MAX_INFLIGHT_BATCHES + 1 bound exactly.
- M-f. Supersede clears the current handle before its SKP cancel (`viewportStreamManager.ts:385-391`). This bears on what discarding costs the shell.
- M-g. EngineCancel's construction site, `kernel/src/lib.rs:286`, where the kernel side of the seam lands.

**Key paths:**
- C:\dev\spatial-ide\state\consults\2026-10-05-data-plane-terminal-without-credit-impact-read.md
- C:\dev\spatial-ide\protocol\data-plane\src\adapter_ws.rs
- C:\dev\spatial-ide\protocol\data-plane\src\pump.rs
- C:\dev\spatial-ide\protocol\data-plane\src\transport.rs
- C:\dev\spatial-ide\kernel\src\lib.rs
- C:\dev\spatial-ide\kernel\src\skp.rs
- C:\dev\spatial-ide\kernel\tests\skp_admission.rs
- C:\dev\spatial-ide\protocol\data-plane\tests\candidate_a.rs
- C:\dev\spatial-ide\PLAN.yaml
