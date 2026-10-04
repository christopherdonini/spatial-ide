*Custodian's filing note (2026-10-04): the architect's draft of `timing-assertions-under-contention`'s preregistration, on the custodian's brief; drafting is the architect's by question round 43, item 2. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. Its sha256, from this file's line 5 to the end, is 8d158ab93552249b9f8a29295458522513343b40e90e789ea8fab94316e31219. Write audit PASS: zero write calls (Read 35, Grep 41, Glob 2, the hand-back 1); the run lasted 21:44:02Z to 21:55:26Z. C3: the main checkout's porcelain held only its two pre-existing untracked items before (21:44:09Z) and after (21:56:16Z), and main stayed at 61f7e64b, the commit the draft says it read. The custodian resolved the two historical lines of the draft's §0.5 step, and both resolve with no mismatch: kernel/tests/end_to_end.rs line 399 at 4155fcf2 is h2_a's latency assert, and engine/tests/slice.rs line 683 at c9ec02e3 is cancelling_mid_stream's budget assert. Three current spans were spot-checked and each holds: slice.rs's docs/08:8 assertion, h2_a's 100 ms assertion, and the data plane's blocking source creation. Two OPEN items are red lines: OPEN-1 is a docs/08 normative row, and OPEN-3 is a scope change to a ruled item. They are asked as holds, to be ruled in typed words (AUTONOMY.md §4). Profile paths redacted at filing: none.*

---

Reviewed: main @ 61f7e64b

(The working tree I read was main at 61f7e64b, per the session's git status. I have no Bash, so I could not run `git rev-parse` myself; please confirm the commit before you file this.)

## (1) Which form, and what is the human's

**Form: the full form, with full gating (architect and reviewer).** Three reasons:
- **§21a applies.** Both tests carry a cancellation guarantee (ADR-018) and a property currently under test (AUTONOMY.md §21a, "a stated guarantee or invariant").
- **The engine test enforces a docs/08 row.** `engine/tests/slice.rs:811-818` asserts docs/08:8 on that row's own pair of instants. A docs/08 normative row is on the Always-the-human list (`AI_DEVELOPMENT.md:451-454`).
- **No five-line form can be written.** Its `Out-of-scope` line would have to name a §21a category, so §25(e) requires the full form from dispatch.

**Which assertions are docs/08 rows:**
- **`engine/tests/slice.rs:815-818` is a docs/08 row's enforcement.** It asserts 100 ms on `cancel_requested → cancel_observed`, read from the product's own stamps. Two more things make it the human's:
  - The human ordered this exact assertion: question round 5, item 3 re-aimed the slice.rs test to assert the budgeted interval, requested → observed.
  - A single sample in a parallel debug suite is not the measurement docs/08 means. docs/08:8 scores p50/p95 (ADR-018 §3), on fixed reference hardware (docs/08:11), and CI is not a reference profile (docs/08:13-21).
  - Its fate under contention is OPEN-1.
- **`kernel/tests/end_to_end.rs:457-460` (h2_a) is not docs/08:8's budget, on my reading.** It borrows the number, but not the interval:
  - It starts at a client instant taken before the CANCEL is sent.
  - It ends at the data-plane adapter's receipt stamp. That stamp is taken before the engine is even told (`adapter_ws.rs:134-135`), and it is not ADR-018's `cancel_observed` (`engine/src/trace.rs:380-383`, `:445-446`).
  - So round 25, item 1 (a) applies directly: assert the property and its ordering, report the timing, and never assert a budget docs/08 does not declare.
  - **But the reading is contestable.** The test's own comment (`:433-434`) claims docs/08's budget. And the docs/08 measurement harness (`kernel/tests/slice_budgets.rs`) scores docs/08 on this same interval. The placement sends the node back to the human if a budget is docs/08-declared, so I put the reading to the human (OPEN-2) rather than settle it myself.
- **Out of the node's scope, two findings:**
  - The sibling test `h2_cancellation_is_observed_by_the_producer_inside_the_budget` (`end_to_end.rs:415-418`) has the identical interval, and its message says the docs/08 budget is 100 ms. Including it is OPEN-3.
  - The harness's docs/08 cancellation verdict uses the same client-to-adapter interval. That is OPEN-4.

**New fact from reading (Phase R decides it, not this report).** The data plane reads nothing from the socket while it creates the source:
- Source creation runs in `spawn_blocking`, and the stream's state is only recorded after it returns (`server.rs:501-508`, `:545-546`).
- So a CANCEL sent during creation waits unread. h2_a's interval can therefore contain the rest of source creation.
- That is hypothesis H-W. It is a product property, not just contention. Phase R tells it apart from plain scheduling delay (H-S1) and from a real defect.

**What runs without the human:** the form itself, Phase R (scratch, no committed code) and its consult. **What waits:** all committed code (OPEN-1, -2, -3), and any routed node.

## (2) The draft

```
# Timing assertions under contention: the h2 cancel tests re-aimed to the property, the slice.rs docs/08:8 assertion put to the human
# (PLAN node timing-assertions-under-contention)

File: kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md
Authority: question round 25, item 1 (a) (RULED 2026-09-26); question round 5, item 3 (RULED 2026-09-16; it ordered the slice.rs assertion); placed by question round 31, item 1 (RULED 2026-09-30); drafting: question round 43, item 2 (RULED 2026-10-03).
Drafted by: the architect agent on the custodian's brief; code read at main 61f7e64b.
Order: this form is committed with the custodian's hashes before Phase R runs; then Phase R; then its consult; then the routing record; then the ruling rows for OPEN-1 to OPEN-4 (section 10); then code of the parts those rulings select; then the closing amendment.
Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md section 21a: a cancellation guarantee (ADR-018), a property under test, and a docs/08 row's enforcement; section 25(e)).

## §0. Disclosure

0.1 The two assertions the node names, and the instant pair each spans (ADR-018 §1).
  - h2_a, the whole test: kernel/tests/end_to_end.rs:431-463 @ 61f7e64b sha256:HASH-TBD
    - No credit; a 50 ms sleep; the client's instant; then the CANCEL send: kernel/tests/end_to_end.rs:439-443 @ 61f7e64b sha256:HASH-TBD
    - The span is the adapter's observed_at minus that client instant: kernel/tests/end_to_end.rs:451-456 @ 61f7e64b sha256:HASH-TBD
    - The bound, 100 ms: kernel/tests/end_to_end.rs:457-460 @ 61f7e64b sha256:HASH-TBD
    - Its source is docs/08's number, invoked by the comment: kernel/tests/end_to_end.rs:433-434 @ 61f7e64b sha256:HASH-TBD
    - The end instant is stamped by the adapter's reader on parsing CANCEL, before the engine's token is cancelled: protocol/data-plane/src/adapter_ws.rs:130-137 @ 61f7e64b sha256:HASH-TBD
    - It is documented as the binding's observation on its own transport: protocol/data-plane/src/transport.rs:150-152 @ 61f7e64b sha256:HASH-TBD
  - slice.rs, cancelling_mid_stream_stops_production_promptly, the whole test: engine/tests/slice.rs:755-842 @ 61f7e64b sha256:HASH-TBD
    - The span starts at the product's own CANCELLATION_REQUESTED stamp: engine/tests/slice.rs:788-791 @ 61f7e64b sha256:HASH-TBD
    - It ends at PRODUCER_CANCELLED: engine/tests/slice.rs:808-809 @ 61f7e64b sha256:HASH-TBD
    - The bound is docs/08:8's 100 ms: engine/tests/slice.rs:811-818 @ 61f7e64b sha256:HASH-TBD
    - The acknowledged term is reported, never asserted: engine/tests/slice.rs:820-832 @ 61f7e64b sha256:HASH-TBD
  - Every other timing figure in either test is a liveness bound or a wait, not a budget.
    - slice.rs, the liveness precedent: engine/tests/slice.rs:732-735 @ 61f7e64b sha256:HASH-TBD
    - slice.rs, TEST_DEADLINE: engine/tests/slice.rs:78 @ 61f7e64b sha256:HASH-TBD
    - end_to_end.rs, RECV_DEADLINE: kernel/tests/end_to_end.rs:225 @ 61f7e64b sha256:HASH-TBD
    - end_to_end.rs, the sibling's 5 s bound: kernel/tests/end_to_end.rs:423-426 @ 61f7e64b sha256:HASH-TBD

0.2 What docs/08 and ADR-018 score.
  - The row: docs/08_Testing.md:8 @ 61f7e64b sha256:HASH-TBD
  - Reference hardware: docs/08_Testing.md:11 @ 61f7e64b sha256:HASH-TBD
  - Enforcement owed, not operating; CI is not a reference profile: docs/08_Testing.md:13-21 @ 61f7e64b sha256:HASH-TBD
  - The instants: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-50 @ 61f7e64b sha256:HASH-TBD
  - The scored pair, on the producer's clock: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56-59 @ 61f7e64b sha256:HASH-TBD
  - p50/p95 carry the verdict; max is reported: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:67-76 @ 61f7e64b sha256:HASH-TBD
  - No retroactive rescoring: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:125-129 @ 61f7e64b sha256:HASH-TBD
  - Producer-side cancel_observed is PRODUCER_CANCELLED: engine/src/trace.rs:380-383 @ 61f7e64b sha256:HASH-TBD
  - docs/08:8 budgets requested → PRODUCER_CANCELLED: engine/src/trace.rs:445-446 @ 61f7e64b sha256:HASH-TBD
  - A single sample in a parallel debug suite is not a docs/08 measurement: no p50/p95, no reference profile, no defined dataset.

0.3 Classification (this form's reading; h2_a's half is OPEN-2's question).
  - slice.rs:815-818 enforces docs/08:8 on its declared pair, and question round 5, item 3 ordered it. What happens to it under contention is the human's (OPEN-1). Its §2 Part B is conditional.
  - end_to_end.rs:457-460 asserts docs/08:8's number on an interval no docs/08 row scores.
    - The interval starts before the cancellation call, at a client instant, and ends at the adapter's receipt, before the engine's CancelToken::cancel. That cancel is reached through: kernel/src/lib.rs:701-705 @ 61f7e64b sha256:HASH-TBD
    - It is the class question round 25, item 1 (a) rules on, and the shape slice.rs's own precedent retired: engine/tests/slice.rs:697-706 @ 61f7e64b sha256:HASH-TBD
  - Part A1 is conditional on OPEN-2 only to confirm this reading.

0.4 docs/07's credit. Sub-line span; the hash is the whole line's: docs/07_Roadmap.md:21 @ 61f7e64b sha256:HASH-TBD
  - It credits end_to_end.rs's two h2 tests with a CANCEL control frame reaching the source and being observed producer-side, end to end.
  - That property stays asserted under Part A: the terminal is TERM_CANCELLED and observed_at is present. docs/07 is not edited.

0.5 Recorded failures. Each report is pinned at 61f7e64b; the lines inside a report are at that report's reviewed commit.
  - h2_a failed twice under concurrent load, at 252.7 ms and 163.6 ms: state/consults/2026-09-27-exposure-profile-paths-closing-round-worker-report.md:20 @ 61f7e64b sha256:HASH-TBD
  - The same failure is disclosed in: scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:739 @ 61f7e64b sha256:HASH-TBD
  - Passed under another gate's load, and 5 of 5 alone: state/consults/gates/2026-09-27-exposure-profile-paths-gate3-reviewer.md:143-150 @ 61f7e64b sha256:HASH-TBD
  - slice.rs failed at 101.33 ms during a concurrent DuckDB build: state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:171 @ 61f7e64b sha256:HASH-TBD
  - Custodian, before committing, in the words form, with no hash:
    - Resolve line 399 of kernel/tests/end_to_end.rs at 4155fcf21c784e64ad8daea06fbb819c1e79b426 to h2_a's assert! (today end_to_end.rs:457).
    - Resolve line 683 of engine/tests/slice.rs at c9ec02e32cb36a64a446424f6db2f4584cacdefc to cancelling_mid_stream's assert! (today slice.rs:815).
    - STOP on a mismatch. The pins are historical; the 61f7e64b tree is authoritative for every current cite.

0.6 HYPOTHESIS H-W (h2_a; from reading code, not observed): a CANCEL waits unread while the source is created.
  - The handler awaits factory.create in spawn_blocking before any reader exists: protocol/data-plane/src/server.rs:501-508 @ 61f7e64b sha256:HASH-TBD
  - The StreamState is recorded only after create returns: protocol/data-plane/src/server.rs:545-546 @ 61f7e64b sha256:HASH-TBD
  - When creation outlasts h2_a's 50 ms sleep, the interval contains the rest of creation. Load stretches creation.
  - Discriminator: Phase R, R-3 and R-4 (whether the registry is empty at the client instant).

0.7 HYPOTHESIS H-S1 (h2_a; from reading): plain scheduling.
  - h2_a is a #[tokio::test] with tokio's default current-thread runtime. The client, the server handler and the adapter's reader share one OS thread, so OS descheduling under load lands inside the interval.
  - Same-clock comment: kernel/tests/end_to_end.rs:12-14 @ 61f7e64b sha256:HASH-TBD
  - Discriminator: R-4, a run at or over 100 ms with the registry non-empty.

0.8 Why PRODUCER_CANCELLED is not asserted in end_to_end.rs.
  - The trace is process-global, one traced stream per run, and end_to_end.rs's tests run as threads in one binary: engine/src/trace.rs:90-98 @ 61f7e64b sha256:HASH-TBD
  - On h2_a's backpressured path the producer can return Cancelled without stamping:
    - engine/src/stream.rs:2452-2457 @ 61f7e64b sha256:HASH-TBD
    - engine/src/stream.rs:2471-2482 @ 61f7e64b sha256:HASH-TBD
  - Phase R observes both stamps in scratch, run alone. No committed test reads them here.

0.9 The previous node's H-S does not bear on h2_a. Its terminal comes through the adapter's halt path (0.1's adapter_ws.rs:130-137 cite), which a data-plane CANCEL fires. The SKP-cancel credit wait that kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md §0.3 describes is a different path.

0.10 Budget. The node declares 45 minutes. Phase R's cold build and its load build exceed that. The custodian records the deviation in PLAN; it is not a §7 figure.

## §1. May and may not claim

- No committed code under kernel/src/**, engine/src/**, protocol/** or frontends/**, in any part.
- No claim that a contention failure of slice.rs cannot recur. No claim that any flake is "fixed". Part A claims only that the h2 assertions no longer assert an undeclared budget.
- No performance number, no docs/08 row, no verdict. Every printed cancellation figure names its pair of instants (ADR-018 §1), and a client→adapter figure is never called cancel_observed.
- H-W and H-S1 are observed only as far as R-3 and R-4 observe them, in scratch, at the consult's named commit.
- No wire, SKP, MCP or data-plane change. No ADR amended. docs/07 and docs/08 not edited.

## §2. The change

Phase R: reproduction, no committed code.
A tester-high applies scratch variants in a throwaway worktree, detached at a named main commit, then runs them, discards the worktree and files state/consults/<date>-timing-assertions-under-contention-reproduction.md.
- Every run is one `cargo test -p <pkg> --test <bin> <name> -- --exact --nocapture`, the test alone, with its own log and `rc=N` appended. The exception is R-7, the whole binary.
- The load L:
  - `cargo build --release -p spatial-engine` in a fresh, empty CARGO_TARGET_DIR (D:/wt-targets/timing-load-<n>), started before the first loaded run.
  - Its start and exit times come from `date -u`, and the logical core count is recorded.
  - Each loaded run's start and end fall inside the loader's life. If not, that row is void, and the loader is restarted in a new empty directory.
- The consult carries each variant's diff as text, the commit, the run count and each run's outcome; every failing run's full output verbatim; and `git diff --stat 61f7e64b <commit> -- kernel/src kernel/tests engine protocol`. If that diff is non-empty, it names which is authoritative, the pin or the tree.
- Final step: before committing, the tester resolves each summary sentence against its own steps and run logs, and STOPS on a mismatch instead of committing.

The variants:
- R-1: h2_a unmodified, alone. 20 runs.
- R-2: h2_a unmodified, under L. 20 runs.
- R-3: h2_a scratch-instrumented, alone. 20 runs. Five edits:
  (i) `dp.registry.snapshot().is_empty()` read immediately before sent_at;
  (ii) an engine trace started before START (the test runs alone, so it sees one stream);
  (iii) the 100 ms assert replaced by one VARIANT-OBS line. It carries: client pre-send → adapter receipt; the terminal code; the batch count; observed_at >= sent_at; registry_empty; CANCELLATION_REQUESTED and PRODUCER_CANCELLED, present or absent, with offsets; and EXECUTE_RETURNED and FIRST_BATCH_FULL present or absent;
  (iv) the remaining assertions stay;
  (v) the trace guard is dropped before the client closes.
- R-4: as R-3, under L. 20 runs.
- R-5: slice.rs's cancelling_mid_stream_stops_production_promptly, alone. The 100 ms assert is replaced by a VARIANT-OBS line carrying requested → observed (named), the reported term, and batches_after_cancel. 20 runs.
- R-6: as R-5, under L. 20 runs.
- R-7: `cargo test -p spatial-engine --test slice`, unmodified, whole binary, under L. 5 runs. Each failing line and message recorded.

Routing (§5 gives the conditions). Phase R never changes Part A's code shape; it decides STOP and the routed nodes.
- STOP: Part A does not land. The defect is routed as its own proposed node, and this form takes a class-1 amendment.
- W: the custodian appends a proposed node, depending on this one, for the data plane's unread-CANCEL window during source creation. Its summary covers:
  - §21a, data plane;
  - ADR-018 §4, the creation section classified as (a) or (b);
  - the R-4 rows.
  No code of it lands here.
- C: recorded in the consult only; no node.
- R-5, R-6 and R-7 route nothing. They are OPEN-1's evidence and go to the human with it.

Part A1 (conditional on OPEN-2, option 1), kernel/tests/end_to_end.rs, h2_a:
- Remove the 100 ms assertion (§0.1, end_to_end.rs:457-460).
- Keep: zero batches; TERM_CANCELLED; observed_at present.
- Add the ordering: observed_at >= sent_at. The message says the observation precedes the cancel this test sent.
- Add liveness: take the client instant → terminal received after drain, and assert it under 5 s. That is the sibling's figure (end_to_end.rs:423-426) and the precedent's (slice.rs:732-735). The message says it is a liveness bound, not the docs/08 budget.
- Report, never assert: client pre-send → adapter receipt, printed with that pair named. The text says it is not ADR-018's cancel_requested → cancel_observed, and that docs/08:8 scores that pair on the producer's clock.
- Reword the comment at end_to_end.rs:433-434 to say the same. Its first sentence, the case the test serves, stays.

Part A2 (conditional on OPEN-3, option 1, and OPEN-2, option 1), the same file, h2_cancellation_is_observed_by_the_producer_inside_the_budget:
- Remove the assertion at end_to_end.rs:415-418.
- Add the same ordering assertion and the same report line.
- Keep the existing 5 s to_terminal bound and the batches_after_cancel assertion.
- The function name is unchanged, because docs/07:21 cites it. A one-line comment says the name predates the re-aim.

Part B (conditional on OPEN-1), engine/tests/slice.rs, cancelling_mid_stream_stops_production_promptly:
- B-keep: no change.
- B-retry: keep the assertion. On a miss, re-sample in a fresh stream up to 3 attempts in total, and fail only if every attempt misses. Every attempt's interval is printed with its pair.
- B-move:
  - Remove the 100 ms assertion.
  - Assert both stamps present.
  - Assert requested <= observed, with skp_admission's retry for the known flag-before-stamp race: kernel/tests/skp_admission.rs:766-778 @ 61f7e64b sha256:HASH-TBD and engine/src/cancel.rs:120-124 @ 61f7e64b sha256:HASH-TBD
  - Assert requested → observed under 5 s, as liveness: kernel/tests/skp_admission.rs:941-948 @ 61f7e64b sha256:HASH-TBD
  - Print the interval.

Done means:
- D-1: the Phase R consult is filed at a named commit.
- D-2: the routing record is in §10. On W, the node id is in PLAN.yaml with status proposed.
- D-3: the ruling rows for OPEN-1 to OPEN-4 are in §10, each cited by round and item.
- D-4: the selected parts are landed, each test named by function, and each §4 mutation observed by name at a named commit.
- D-5: a closing amendment, references and hashes only.

Portability (state/directives/PORTABILITY-2026-09-30.md §2):
- R1: cancellation semantics are unchanged on every platform. What contention moves is scheduling, not semantics, and H-W's code path is platform-independent.
- R2 and R4: no cfg, no boundary touched.
- R3: not an OS-dependent feature, so no Platform section.
- R5: no level claimed. slice.rs's 100 ms assertion running in L1 CI is not an L3 cancellation claim on any platform.
- R6: nothing is ignored anywhere. B-retry and B-move are never implemented as a platform ignore or cfg_attr.
- Phase R runs on Windows only, and no platform claim follows from it.

## §3. Fixtures

- h2_a: fixture("h2-early", 60_000): kernel/tests/end_to_end.rs:435 @ 61f7e64b sha256:HASH-TBD
- h2: fixture("h2", 60_000): kernel/tests/end_to_end.rs:382 @ 61f7e64b sha256:HASH-TBD
- slice.rs: write("cancel-mid", 40_000 features): engine/tests/slice.rs:758-764 @ 61f7e64b sha256:HASH-TBD
- All are generated per run and unchanged. Not the 5 GB fixture.

## §4. Tests and mutations

Each mutation is applied, the named test is run alone, its failure is recorded by name with the commit, and the mutation is reverted. A verify-mutation run is never called a mutation's observation (round 25, item 2 (c)).
- A1, h2_a:
  - M-A1a: protocol/data-plane/src/adapter_ws.rs, in the Some(Control::Cancel) arm, `tokio::time::sleep(std::time::Duration::from_secs(6)).await;` inserted before state.observe_cancel. h2_a fails at its liveness assertion.
  - M-A1b: the same arm stamps `Instant::now().checked_sub(Duration::from_secs(1)).unwrap()` instead of Instant::now(). h2_a fails at its ordering assertion.
- A2, h2: M-A1b fails h2 at its ordering assertion, observed separately by name.
- B-keep: no change, so no mutation.
- B-retry: M-Ba: a 150 ms std::thread::sleep in engine/src/stream.rs's row-loop cancel branch, before its PRODUCER_CANCELLED mark. Every attempt misses, and the test fails by its message.
- B-move: M-Bb: the row-loop PRODUCER_CANCELLED mark removed. The test fails at the stamp-present assertion.
- Phase R variants are scratch observations: not tests of record, not mutations.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- R-1: 20 of 20 pass.
- R-2: at least 1 of 20 fails, each failure at end_to_end.rs:457 with h2_a's message.
- R-3: in 20 of 20 runs: TERM_CANCELLED; 0 batches; observed_at present and >= sent_at; CANCELLATION_REQUESTED present; registry_empty false. PRODUCER_CANCELLED: no prediction (§0.8).
- R-4: TERM_CANCELLED, 0 batches, observed_at present and >= sent_at, and CANCELLATION_REQUESTED present, in 20 of 20 runs. Every run with client pre-send → adapter receipt at or over 100 ms has registry_empty true.
- R-5: 20 of 20 under 100 ms; both stamps present; batches_after_cancel at most 1.
- R-6: both stamps present and batches_after_cancel at most 1 in 20 of 20. The count at or over 100 ms has no prediction and is reported.
- R-7: no prediction on the count. Every failing line is recorded.

Routing:
- STOP if any R-1 to R-4 run shows a terminal other than TERM_CANCELLED, a batch, observed_at absent or before sent_at, or CANCELLATION_REQUESTED absent; or if any R-1/R-2 failure is at a line other than end_to_end.rs:457.
- W if at least one R-4 run is at or over 100 ms with registry_empty true.
- C if at least one R-4 run is at or over 100 ms with registry_empty false.
- W and C are not exclusive.
- A miss on R-2's count or on R-4's H-W clause, without STOP, is a class-2 recorded result.

Declared unchanged:
- every committed file under kernel/src, engine/src, protocol and frontends;
- RECV_DEADLINE; the sibling's 5 s bound; TEST_DEADLINE;
- slice.rs's 100 ms assertion, unless OPEN-1 selects B-retry or B-move;
- docs/07 and docs/08;
- kernel/tests/slice_budgets.rs (OPEN-4 routes it; no code here).

Invalidators:
- A row whose applied diff differs from its §2 description voids that row; it is re-run.
- A loaded row outside the loader's life is void.
- A Phase R commit whose code tree differs from 61f7e64b with no named authority voids the consult.

Falsification: §0.5's custodian step resolving either failure to a different assertion makes §0's account of that failure wrong.

## §6. Instruments

- Every printed figure is a report, not a measurement: no p50/p95, no docs/08 dataset, not a reference profile (§0.2's docs/08_Testing.md:13-21 cite).
- Observations are structural: terminal code, batch counts, stamps present, ordering, registry state.

## §7. Declared values and ceilings

- Counted by: git diff --numstat origin/main...HEAD -- '*.rs' '*.ts' '*.tsx' '*.js' '*.mjs' '*.toml' (§21c's counting rule: insertions plus deletions).
- Part A1: at most 40 changed lines, all in kernel/tests/end_to_end.rs. Part A2: at most 30 more.
- Part B: B-keep 0; B-retry at most 45 in engine/tests/slice.rs; B-move at most 35 there.
- Without the rulings: 0. A code line before its ruling row is a class-8 overrun of 0.
- Non-generated files touched: at most 5. These are this form, kernel/README.md (the preregistrations bullet and Last verified at), PLAN.yaml, the Phase R consult, and kernel/tests/end_to_end.rs. engine/tests/slice.rs makes 6 under B-retry or B-move only.
- No new constant. The 5 s liveness figure is a literal at its site, as at end_to_end.rs:423-426 and slice.rs:732-735.

## §8. Block-on-sight

1. Phase R run, or any variant result recorded, before this form is committed with the custodian's hashes.
2. Any committed code before Phase R's consult and its routing record; on STOP, any at all.
3. Code of a part before §10's ruling row selecting it, or beyond its §7 ceiling. Either is a class-8 overrun with §7 unedited.
4. Any diff under kernel/src, engine/src, protocol or frontends; any edit to docs/07, docs/08 or slice_budgets.rs.
5. A printed cancellation figure without its instant pair, or a client→adapter figure called cancel_observed or a docs/08 result.
6. An assertion of any budget docs/08 does not declare, in either test.
7. On W, the node appended with a status other than proposed, or with any of its code on this branch.
8. A Phase R row without its diff and commit, a loaded row without the loader's times, or a failing run without its full output.
9. A consult summary sentence not resolved against the run logs.
10. A verify-mutation run recorded as a mutation's observation; a scratch variant recorded as a test of record.
11. A test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id (round 25, item 2 (d)).
12. A scope addition (round 25, item 2 (a), class 9) with code before its amendment.

## §9. Gates

- Architect: §21a; ADR-018 vocabulary; every round and item cite resolved against the RULED block; §8 item by item; each ruling row against the part it selects.
- Reviewer: the full diff; the consult row by row against §5; each variant diff against §2; each mutation observed by name; the commit ids.
- Suites:
  - node --test scripts suite; verify-plan; verify-cites; verify-quotes; verify-test-claims.
  - With Part A: cargo test -p spatial-kernel --test end_to_end.
  - With Part B: cargo test -p spatial-engine --test slice.
- Operator: none.

## §10. Amendments

(opens empty)
```

## (3) OPEN items

**OPEN-1: slice.rs's docs/08:8 assertion under contention.** This is a docs/08 normative row, so it is a red line. Round 5, item 3 ordered the assertion.
- **(a) B-keep.** The human's round 5, item 3 assertion stands. A contention failure is re-run once alone, with both run ids recorded and the failing log text filed before the re-run. That is the practice PORT-1's I1 and WORKSPACE-RUSTFMT's I4 already apply to this node's tests.
- **(b) B-retry, up to 3 attempts.** This turns the check into "the best of 3 is under 100 ms", which is weaker than the row. I do not recommend it.
- **(c) B-move.** The test asserts the property and its ordering, and the budget is left to a measurement harness. That leaves docs/08:8's declared pair with no automated check until OPEN-4's harness exists.
- **Recommendation: (a).** It is the only check of docs/08:8 on its declared pair that CI runs. The recorded overshoot was 1.33 ms on a contended run. A single-sample assertion is stricter than ADR-018 §3's scoring, and that is a known trade, not a defect.
- **What waits:** under (a), nothing; under (b) or (c), Part B's code. R-5 to R-7 are its evidence.

**OPEN-2: the reading for h2_a.** Is `end_to_end.rs:457-460` docs/08:8's budget?
- **(1) No.** ADR-018 §1/§2 and the engine's own mapping (`trace.rs:380-383`, `:445-446`) apply. Round 25, item 1 (a) governs, and Part A1 lands.
- **(2) Yes.** The adapter's receipt is read as the data-plane path's `cancel_observed`. Part A1 does not land, h2_a joins OPEN-1's options, and the harness stays consistent as it is.
- **Recommendation: (1).**
- **What waits:** Part A1, and Part A2 with it.

**OPEN-3: scope, the sibling h2 test (`end_to_end.rs:415-418`).** This is a scope change to a ruled item.
- **(1)** Include it as Part A2.
- **(2)** Exclude it, and append a proposed node.
- **Recommendation: (1).** It is the same file, interval, defect class and ruling, one assertion, and it is pre-declared in the form. Its name stays, because docs/07:21 cites it.
- **What waits:** Part A2.

**OPEN-4: the harness's docs/08 cancellation verdict.**
- **The finding:** the harness scores p95 on client pre-send → adapter receipt, not on ADR-018's pair. The cites are `kernel/tests/slice_budgets.rs:540-544 @ 61f7e64b sha256:HASH-TBD`, `:584-601`, and `:894-906`.
- **(1)** A proposed node, after this one, with its own full form: re-aim the harness's cancellation cells to the engine trace pair (release build, reference hardware), and keep the adapter interval as a reported figure. Under ADR-018 (`:125-129`), kernel/RESULTS.md's existing figures are not rescored.
- **(2)** Disclose it, and change nothing.
- **Recommendation: (1)**, and only if OPEN-2 is (1). OPEN-1's option (c) would need it.
- **What waits:** no code in this piece.

## (4) Files read (at 61f7e64b)

- C:\dev\spatial-ide\PLAN.yaml (the node, and b1-engine-kernel-half-followups)
- C:\dev\spatial-ide\kernel\tests\end_to_end.rs (whole)
- C:\dev\spatial-ide\engine\tests\slice.rs (1-110, 660-995)
- C:\dev\spatial-ide\docs\08_Testing.md (whole)
- C:\dev\spatial-ide\docs\07_Roadmap.md (line 21, by span)
- C:\dev\spatial-ide\docs\adr\ADR-018-what-cancellation-acknowledged-means.md (whole)
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (whole)
- C:\dev\spatial-ide\AUTONOMY.md (§21–§22, §25)
- C:\dev\spatial-ide\AI_DEVELOPMENT.md (40-49, 449-456)
- C:\dev\spatial-ide\DECISIONS-PENDING.md (RULED blocks: round 25 item 1, round 5 item 3, round 31 item 1, round 43 item 2)
- C:\dev\spatial-ide\kernel\TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md
- C:\dev\spatial-ide\state\consults\2026-10-04-timing-tests-reproduction.md
- C:\dev\spatial-ide\state\consults\2026-09-27-exposure-profile-paths-closing-round-worker-report.md (line 20)
- C:\dev\spatial-ide\state\consults\gates\2026-09-27-exposure-profile-paths-gate3-reviewer.md
- C:\dev\spatial-ide\state\consults\gates\2026-09-27-b1-engine-kernel-half-gate3-reviewer.md
- C:\dev\spatial-ide\scripts\hooks\EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md (line 739)
- C:\dev\spatial-ide\state\CUT-STATE.md (grep hits)
- C:\dev\spatial-ide\state\directives\PORTABILITY-2026-09-30.md
- C:\dev\spatial-ide\protocol\data-plane\src\adapter_ws.rs, transport.rs, server.rs (relevant spans)
- C:\dev\spatial-ide\kernel\src\lib.rs (372-445, 701-705)
- C:\dev\spatial-ide\kernel\tests\skp_admission.rs (735-950)
- C:\dev\spatial-ide\kernel\tests\slice_budgets.rs (540-614, 886-910)
- C:\dev\spatial-ide\engine\src\cancel.rs (80-139), trace.rs (80-119, 295-454), stream.rs (1800-1984, 2440-2489)
- C:\dev\spatial-ide\kernel\README.md, engine\README.md ("Last verified at" lines)

No write-capable call was made. All quotation marks in this report enclose test-name or code tokens, not quoted prose. Every characterisation of a ruling or a doc is my paraphrase, cited by round and item or by path:line.
