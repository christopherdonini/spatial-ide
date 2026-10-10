*Custodian's filing note (2026-10-10): the architect's draft of `stream-flush-cancel-exit-marks-producer-cancelled`'s preregistration, on the custodian's brief at main f0fccfaf, after lead-data's impact read (measured piece 8 of the second pilot, the fourth since it resumed). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 7b79719b192ecb09971ca55667ca8570607e036eba5f82bd46f8e6a18a218cda. Write audit PASS: zero write calls (Read 58, Grep 15, SubagentHandback 1). Run window from the transcript: 11:19:29Z to 11:32:10Z. Not yet committed as a form: its pins are HASH-TBD, and OPEN-1 is the human's.*

---

Reviewed: main @ f0fccfaf6814c6993462853211ba20f7c8cdab31

## 1. The form, the gating route, and what is the human's

- **Form:** the full form, in a new file `engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md`. The change touches only `engine/`, and the precedent is `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`.
- **Gating:** full gating, architect and reviewer, from dispatch.
  - Under AUTONOMY.md §21a the piece touches two categories. One is a cancellation guarantee under ADR-018: the event is the end of the interval docs/08:8 scores. The other is a property already under test: slice.rs and the four kernel tests read the event.
  - So an Out-of-scope line could not claim "none of the four", and §25(e) applies.
  - The declared size, at most 150 lines, is under §21c's bound.
- **Already the human's:** the S2 grade, the full form, the slot and its order.
- **The human's now:** OPEN-1, permission for the scratch experiment pair (E-1/E-2). It is not a red line.
- **Forcing the exit needs no product seam.** An in-crate test calls `flush` and `produce` directly. The only change outside the two marks is moving trace.rs's test lock to module level, still `cfg(test)`, so the new tests can take it. This adds no product surface, so there is no OPEN item on seams.
- **The scope grows by one site without an OPEN item.** The pre-prepare exit is in scope as the same defect class under the sibling-search rule (AUTONOMY.md:215). The other three unmarked sites stay out of scope and go to one proposed node (§2.3 of the draft).

## 2. The draft

````markdown
# flush's cancel exit, and the pre-prepare exit, mark producer_cancelled
# (PLAN node stream-flush-cancel-exit-marks-producer-cancelled)

File: engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md
Authority:
- the human's direction of 2026-10-10, item 1: state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:7 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- the placement: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- forms ahead: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- both directives have RULED blocks in DECISIONS-PENDING.md
- the node: PLAN.yaml:4495-4511 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- the sibling-search default: AUTONOMY.md:215 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
Drafted by: the architect agent. Inputs:
- lead-data's impact read, state/consults/2026-10-10-stream-flush-cancel-exit-marks-producer-cancelled-impact-read.md (whole-file sha256 4357adab6581b0125c6855d8eead0c9593561af836dbabce834e41c88083d2cc);
- the second pilot's §2 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:17-21 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
Code was read at main f0fccfaf.
Committed before any code. No code starts before wire-bytes-invariant-trace-flag-race has merged. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a cancellation guarantee under ADR-018 and a property under test; §25(e)). See §0.9.
Pins: every pin is a historical pin at f0fccfaf. Wire-bytes edits engine/README.md and kernel/tests/wire_bytes_invariant.rs only, so no pinned code line moves before this piece. If one does, the worker re-derives the site by symbol. The pin stays authoritative for what it recorded; the tree is authoritative for the code the piece edits.

## §0. Disclosure

0.1 What was seen. In the flake hunt, run 1, at 116deb53, on Linux, engine/tests/slice.rs's cancelling_mid_stream_stops_production_promptly failed twice on two cores. Both failures were at its expect that the observed instant was stamped:
- the report: state/consults/FLAKE-HUNT-RUN-1-2026-10-10.md:39-74 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD;
- the expect: engine/tests/slice.rs:809 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.
- The two original failures carried no diagnostics. Their path is inferred from the message and the line.
- In the sandbox experiment, a sleep before flush's check gave 15 failures in 20 runs; the same sleep after the check gave 0 in 20 (state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/README.md:6-10 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). All fifteen printed dropped=0 and batches_after_cancel=1.
- The custodian's limit on the four events=11 runs: state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:55-57 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.

0.2 The exit:
- flush counts batches_generated and rows_generated, then its cancel check counts batches_after_cancel and returns Cancelled with no mark: engine/src/stream.rs:2536-2545 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.
- It comes before FIRST_BATCH_FULL, BATCH_FULL and the send: engine/src/stream.rs:2550-2570 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.
- flush's four call sites:
  - engine/src/stream.rs:2016 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
  - engine/src/stream.rs:2065 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
  - engine/src/stream.rs:2101 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
  - engine/src/stream.rs:2121 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- Each propagates the error with `?`, so produce returns.

0.3 The five exits that mark:
- the execute guard's Cancelled arm: engine/src/stream.rs:1829-1832 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- execute Err under a cancel: engine/src/stream.rs:1838-1841 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- the loop-top check: engine/src/stream.rs:1885-1888 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- a fetch panic under a cancel: engine/src/stream.rs:1918-1921 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- the per-row check: engine/src/stream.rs:1975-1988 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- The per-row mark's origin is recorded at kernel/RESULTS.md:3253-3256 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.

0.4 The event and the budget:
- PRODUCER_CANCELLED: engine/src/trace.rs:440-441 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- It is the producer's cancel_observed: engine/src/trace.rs:380-384 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- docs/08 scores the budget on requested to observed, on the producer's clock: docs/08_Testing.md:8 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- ADR-018 is Accepted: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3-5 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- cancel_observed means the worker loads the flag set and stops advancing: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:46 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- The design note's frozen instants: kernel/CANCELLATION-AND-TRACING.md:44-53 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD

0.5 The request instant and the drop:
- cancel stamps CANCELLATION_REQUESTED once, after it publishes the flag: engine/src/cancel.rs:120-124 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- cancel_for_drop sets the flag and stamps nothing: engine/src/cancel.rs:113-115 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- Its one caller is BatchStream's Drop: engine/src/stream.rs:885-895 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD

0.6 The tracing stance this piece keeps:
- tracing is not cfg(test)-gated, and enabling it must not change which code is measured: engine/src/trace.rs:26-32 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- no mark inside a per-row loop: engine/src/trace.rs:34-37 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- one process-global slot: engine/src/trace.rs:90-98 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- the unit tests' lock: engine/src/trace.rs:727-732 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- start has no product caller: kernel/src/lib.rs:613-618 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD

0.7 An earlier record of this exit: kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:76-81 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.
- slice.rs's budget assertion is kept by round 53 (B-keep), with its re-run practice: state/directives/2026-10-04-round-53-open-1-ruling.md:6-7 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD
- This piece does not touch that assertion (§8 item 2).

0.8 Reuse index (the human's standing step). node tools/reuse.mjs was run in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c.
- The one hit, the capability stale-range-cancellation, does not apply: this piece adds no cancellation mechanism and supersedes nothing. It stamps an instant on an exit the producer already takes.
- trace event, cancel latency and producer thread: no prior art recorded; noted, and not blocking.

0.9 Gating route. ADR-018's end instant (a cancellation guarantee) and a property five tests assert are touched, so §21a applies from dispatch (§25(e)). The size, at most 150 lines (§7), is under §21c's bound.

0.10 Budget. The node declares 240 minutes. If the full form, the E pair and two gates exceed that, the custodian records the deviation in PLAN. It is not a §7 figure.

0.11 Fixture drive: no measurement against the 5 GB fixture.

## §1. May and may not claim

- May claim, by §2's argument and §4's tests:
  - flush's cancel exit and the pre-prepare exit each stamp PRODUCER_CANCELLED before returning Cancelled;
  - each marking site is followed at once by a return out of produce, so a stream stamps the event at most once;
  - the four kernel tests' answers in §2.4, read from code;
  - M-1 and M-2 as observed; E-1 and E-2 as observed counts (conditional on OPEN-1).
- May not claim:
  - that the two Linux failures took this path, which stays inferred (0.1);
  - any rate, or that the race is absent, from E-1 or E-2;
  - any time bound on the interval this exit ends (§2.5);
  - any docs/08 verdict, figure or rescoring. Earlier results are not rescored (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:125-129 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD);
  - anything about the out-of-scope sites (§2.3).
- No ADR is amended. docs/08 and kernel/CANCELLATION-AND-TRACING.md are not edited. There is no wire, SKP, MCP or data-plane change, no user-visible string, no new pub item and no dependency.

## §2. The change

2.1 engine/src/stream.rs, product code: two lines and their comments.
- C1. In flush, inside the `if cancel.is_cancelled()` branch (0.2), and as its first statement: `crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0);`. Then, unchanged, the batches_after_cancel increment and the return.
  - The H2 comment gains at most two lines, by symbol and with no path:line: this is a cancel_observed exit, stamped like the others.
- C2. In produce, inside the pre-prepare check (engine/src/stream.rs:1780-1782 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD), before the return: the same mark, with a one-line comment.
- Nothing else in product code changes: classify, the send's error arm, the counters, their order, H2, cancel.rs and every product item of trace.rs stay as they are.
- Cost:
  - each mark sits on a branch that returns, so it runs at most once per stream and never per row, as engine/src/trace.rs:34-37 requires;
  - disabled, it is one relaxed load, on that branch only.

2.2 engine/src/trace.rs, test scaffolding only.
- TEST_LOCK moves from `mod tests` to module level as `#[cfg(test)] pub(crate) static TEST_LOCK`, with its doc. trace.rs's tests keep using it through `use super::*`.
- It is compiled into no shipped build. It serialises a test, not the instrument, so the stance in 0.6 is unchanged.

2.3 Sibling search (AUTONOMY.md:215).
- The defect class: the producer loads the cancel flag, finds it set, and returns Cancelled without stamping PRODUCER_CANCELLED, so ADR-018's cancel_observed has no end instant.
- The custodian's list is at state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:28-37 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.

| Site | Class | Scope | Reason |
|---|---|---|---|
| flush's check (0.2) | in | in (C1) | the node |
| the pre-prepare check (engine/src/stream.rs:1780-1782 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) | in: a direct load-and-return | in (C2) | a deterministic in-crate test reaches it with no seam (T-2), and it is a second route to skp_filter_cancellation's unretried panic (§2.4) |
| prepare Err through classify (engine/src/stream.rs:1784-1786 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) | in: the load is inside classify | out | not reachable by a deterministic test without a seam: the flag must turn from unset at the pre-prepare check to set inside prepare |
| the two-read window in the marking classify arms (engine/src/stream.rs:1838-1841 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD; engine/src/stream.rs:1918-1921 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD; engine/src/stream.rs:2573-2579 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) | in | out | cancel publishes the flag before it interrupts (0.5), so an Err or panic caused by the interrupt always reads the flag set at the first read. The window opens only for a non-cancel error that races a cancel between two adjacent loads. Closing it means restructuring classify and the two marking sites cut/sql-filter P4 added |
| the send to a gone receiver (engine/src/stream.rs:2561-2570 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) | not in: no flag is loaded; the producer sees a disconnect | out | whether a disconnect is an ADR-018 observation is a question for that node's form. The parked send does not watch the token (kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md:53-55 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) |

- The custodian records one proposed node, engine lane, depending on this piece, for the three out-of-scope rows. Its form chooses between a classify that marks when it returns Cancelled and a seam, and says whether a disconnect is an observation. This follows the precedent of engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md, §2 item 4.

2.4 The four kernel tests (the human's item 1), read from code.
- None of them is edited, and the fix changes nothing any of them asserts.
- **trace_spans, a_successful_run_stamps_no_cancellation_instant**: it cannot hit the gap. The absence assertion (kernel/tests/trace_spans.rs:355-358 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) stays true after C1 and C2.
  - The run drains next_into to None (kernel/tests/trace_spans.rs:340-345 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - next_into returns None only on disconnection (engine/src/stream.rs:782-797 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD), and the producer drops its sender only after produce has returned (engine/src/stream.rs:1254-1385 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). So no flush, and no pre-prepare check, runs after Drop's cancel_for_drop.
  - A straggler from another test in the binary stamps before its lease returns, and the lease is decided only after produce returns (engine/src/stream.rs:1292-1295 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). quiesce waits for the lease (kernel/tests/trace_spans.rs:163-175 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) under serial() (kernel/tests/trace_spans.rs:145-149 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - C1 and C2 fire only with the flag set, as the per-row and loop-top exits already do. They add no route those exits lacked.
- **first_batch_factorial, the two ignored measurement passes**: they can hit the gap.
  - Each takes two batches, then cancels (kernel/tests/first_batch_factorial.rs:1336-1343 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). The producer may then be assembling a batch, with a queue of MAX_QUEUED_BATCHES = 2 (engine/src/stream.rs:85 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - If it leaves by flush's exit, segment_ms is None (kernel/tests/first_batch_factorial.rs:1353-1356 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). That trial is dropped from the sample (kernel/tests/first_batch_factorial.rs:1367 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD), and the assertions fail only when every trial misses (kernel/tests/first_batch_factorial.rs:1389-1399 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). The H5 twin is the same (kernel/tests/first_batch_factorial.rs:1487-1490 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - So the gap thins the sample by exactly the trials that were observed during assembly. After the fix those trials carry a span.
  - The passes are not re-run here.
- **skp_admission, cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock**: it can hit the gap; it has not been observed doing so.
  - It grants credit 2 (kernel/tests/skp_admission.rs:865-871 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) and cancels after the first batch frame (kernel/tests/skp_admission.rs:888-891 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - Several batches can be in flight ahead of the client (protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:184-188 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD), so the producer can be assembling when the cancel lands.
  - A missing stamp panics and is not retried (kernel/tests/skp_admission.rs:926-931 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - After C1, the new mark is subject to the ordering race the retry already handles (kernel/tests/skp_admission.rs:766-778 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD), as every other exit is.
- **skp_filter_cancellation, cancel_reaches_the_producer_during_a_late_matching_filtered_scan**: it can hit flush's exit only if the scan reaches its matching tail before the cancel lands.
  - It cancels after TAG_OPEN (kernel/tests/skp_filter_cancellation.rs:228-243 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD), and its expected exits are the two classify marks.
  - It can also hit the pre-prepare exit (C2's site) if the producer has not passed that check when the cancel lands. When the kernel creates the stream relative to TAG_OPEN was not read for this draft.
  - Its missing-stamp expect is unretried (kernel/tests/skp_filter_cancellation.rs:269-274 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - Routes left after this piece: §2.3's prepare and window rows.

2.5 ADR-018 item 4, for the section this exit now ends (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:78-88 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
- From the last check before the cut to flush's check, the section is in-memory work over one batch (engine/src/stream.rs:2492-2539 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). flush's own head refuses a batch above MAX_BATCH_BYTES (engine/src/stream.rs:2473-2490 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
- This is class (a) in bytes only, and no time bound is derived. Scheduling is class (b), as everywhere (kernel/CANCELLATION-AND-TRACING.md:99-106 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
- At the stream-end call site (engine/src/stream.rs:2121 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD), the section also holds DuckDB's last fetch, which is class (b) (ADR-018 item 5).
- Before this piece, the interval had no end on this path. No bound is claimed after it.

2.6 Runs that stamp the event with no request (the impact read's question 3).
- These are a stream dropped (not cancelled) while its producer is assembling, or before it reaches the pre-prepare check. Drop sets the flag with no stamp (0.5).
- The loop-top, per-row and guard exits already behave this way on a drop. segment_ms returns None when the request is absent, so no figure is derived from such a run.

2.7 Seams. The diff crosses no module seam: the kernel tests are read, not changed.
- The rejected alternative is a product seam, such as the experiment's trace-gated sleep or a cfg(test) hook between the per-row check and flush's check. A trace-gated sleep would change which code is measured. A cfg(test) hook would prove the property about a build nobody ships (0.6). §4 needs neither.

2.8 Portability (state/directives/PORTABILITY-2026-09-30.md:33-65 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
- R1: cancellation semantics are the same on every platform. The failure was seen on Linux, and the fix has no platform dependence.
- R2 to R4: no OS-dependent feature and no OS cfg. R3 is not triggered.
- R5: no level is claimed.
- R6: nothing is ignored.

## §3. Fixtures

- T-1 builds its batch in memory.
- T-2 uses an in-memory DuckDB connection.
- E-1 and E-2 use slice.rs's own per-run fixture.
- No file is pinned by hash, and the 5 GB fixture is not used.

## §4. Tests and mutations

Every mutation is observed by applying it, running the named command, recording the failure by name with the commit it was observed at, and reverting. A verify-mutation run is never called an observation (round 25, item 2 (c)).

- **T-1, in engine/src/stream.rs `mod tests`.** Proposed name: `flush_cancel_exit_stamps_producer_cancelled_and_sends_nothing`.
  - It takes TEST_LOCK as its first statement and holds it to the end of the body.
  - It builds a one-row Pending: one polygon and one Int64 run over the module's one_attribute_envelope helper (engine/src/stream.rs:2901-2918 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - It starts a trace, cancels a token with cancel(), and calls flush with batch_index 1.
  - It asserts:
    - (i) Err(EngineError::Cancelled);
    - (ii) batches_generated and batches_after_cancel are each 1;
    - (iii) the receiver holds nothing, and resident_bytes is 0;
    - (iv) PRODUCER_CANCELLED is present;
    - (v) the requested-to-observed segment is Some.
  - Why (iv) is unambiguous in this binary:
    - only produce and flush stamp the event (0.3);
    - the binary's only real streams drain uncancelled tokens to disconnection (engine/src/stream.rs:3134-3136 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD; engine/src/stream.rs:3229-3231 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD);
    - other in-crate tests do stamp other names (cancel() in pin.rs, index.rs and cancel.rs), so the test asserts no absence and no exact list.
  - **M-1:** delete C1's mark. Run `cargo test -p spatial-engine --lib flush_cancel_exit`. Predicted: T-1 fails by name at (iv).
- **T-2, in the same module.** Proposed name: `the_pre_prepare_cancel_exit_stamps_producer_cancelled`.
  - It takes the same lock, starts a trace, and calls produce with a token cancelled before the call, an in-memory connection and invalid SQL.
  - It asserts Err(Cancelled), batches_generated 0, and PRODUCER_CANCELLED present.
  - The invalid SQL makes C2 the only possible stamp: without the check, prepare fails and classify returns Cancelled unmarked (§2.3). The test's doc says that a later piece that marks classify must revisit it.
  - **M-2:** delete C2's mark. Run `cargo test -p spatial-engine --lib the_pre_prepare_cancel_exit`. Predicted: T-2 fails by name at its presence assertion.
- **Changed tests: none.** No sleep, retry or timeout is added to any committed test.
- **E-1 and E-2, conditional on OPEN-1 (a).** The patch puts a 20 ms sleep, active only while a trace is enabled, immediately before flush's check: phase B's placement per state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/README.md:8 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.
  - E-1 runs on a worktree at B with the patch. E-2 runs on the piece's worktree at H with the patch.
  - Each runs `cargo test -p spatial-engine --test slice` 20 times, one shared hold per batch of runs.
  - A run counts only if it fails at the expect of engine/tests/slice.rs:809 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.
  - A failure at the budget assertion (engine/tests/slice.rs:815-818 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD) follows the round-53 practice and the machine rule: it is reported, re-run alone by the custodian, and not counted.
  - The patch is applied with git apply and reverted, each worktree is shown clean, and it is never committed or pushed. rustc -V is recorded.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: T-1 and T-2 pass at H; M-1 and M-2 each fail their test by name.
- P-2 (E-1): at least 1 of 20 runs fails at :809.
- P-3 (E-2): 0 of 20 runs fail at :809.
- P-4: engine/tests/slice.rs and the four kernel tests pass, unchanged, in CI on both platforms.

Declared unchanged:
- every product line except C1 and C2 and their comments;
- every product item of trace.rs and cancel.rs;
- engine/tests/slice.rs, byte for byte;
- the four kernel test files;
- docs/08, ADR-018 and kernel/CANCELLATION-AND-TRACING.md;
- no pub item, dependency, OS cfg, ignore, or Cargo change.

Invalidators:
- T-1 cannot reach the check without a product change;
- M-1 or M-2 does not fail its test.
- On either, stop, return to the architect, and record class 2.
- If E-1 gives 0 of 20, that is class 2 with no stop: E-2 then discriminates nothing, and §1's E claim falls back to T-1 alone.

Falsification: any E-2 run failing at :809. That would mean another unmarked exit sits on that path, and §2's reading is false.

## §6. Instruments

- T-1 and T-2 are structural assertions.
- E-1 and E-2 are pass/fail counts, not measurements, and carry no docs/08 row.
- The E logs and the patch text are filed by the custodian as evidence: a run's output, not Authority.

## §7. Declared values and ceilings

- At most 150 changed lines by §21c's rule, tests included, in engine/src/stream.rs and engine/src/trace.rs. Count with `git diff --numstat B H -- engine/src/stream.rs engine/src/trace.rs`, where B = `git merge-base origin/main H`, named in the PR body.
  - Of these, at most 10 are in engine/src/stream.rs outside `mod tests`.
  - engine/src/trace.rs changes only for the lock's move, at most 15 lines.
- Non-generated files: at most 5. They are this form, PLAN.yaml, engine/src/stream.rs, engine/src/trace.rs and engine/README.md. engine/README.md carries the owner's-index update only and is outside the line count. Evidence files are outside the count.
- E-1 and E-2: 20 runs each. No constant is added.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any code before this form is committed with the custodian's hashes, or before wire-bytes-invariant-trace-flag-race has merged.
2. Any edit to engine/tests/slice.rs (round 53, B-keep) or to the four kernel test files.
3. A product change beyond C1 and C2: classify, the send arm, counters or their order, the check itself, cancel.rs, Drop, or a non-test item of trace.rs.
4. A mark on a path that runs per row or per batch without returning.
5. A product seam, a new pub item, or a cfg(test) item other than the lock's move.
6. T-1 or T-2 not taking TEST_LOCK first; a test that tolerates an absent PRODUCER_CANCELLED; an absence or exact-list assertion on names other in-crate tests stamp.
7. The E patch committed, pushed, or left applied.
8. Code for an out-of-scope row of §2.3.
9. A claim beyond §1.
10. A path:line cite in a code comment.
11. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- **Architect and reviewer (§21a; §25(e)).**
  - Verdicts follow state/directives/2026-10-05-product-first-direction.md:15 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD.
  - They block only on Correctness or Evidence. Documentation findings are fixed in this PR before the merge.
- **Architect:** §2's readings (2.3 to 2.6) against the cited sites; ADR-018 items 1 and 4; §8 item by item; §1.
- **Reviewer:**
  - the full diff;
  - M-1 and M-2, each observed with its commit id;
  - E-1 and E-2 with their commits and logs (if OPEN-1 is (a));
  - the §7 count;
  - the owner's-index update against the diff.
- **Suites:**
  - `cargo test -p spatial-engine --lib`;
  - `cargo test -p spatial-engine --test slice`;
  - `cargo test -p spatial-kernel --test trace_spans --test skp_admission --test skp_filter_cancellation`;
  - `cargo fmt --all --check`;
  - the workspace, by CI on both platforms;
  - the node --test scripts suite, verify-plan, verify-cites, verify-quotes and verify-test-claims.
- **Heavy runs** follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). E-1 and E-2 run in shared holds. Nothing here is a timed measurement.
- **Merge:** a merge commit, never a squash.
- **Operator:** none.
- **Owner's-index update before the final gate** (the second pilot's §1, item 2: state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff. It sits on top of wire-bytes' engine entry.
  - engine/README.md, Owner's index:
    - Interfaces this module owns: the spatial_engine::trace entry wire-bytes adds gains PRODUCER_CANCELLED (ADR-018's producer-side cancel_observed), pinned by T-1 and T-2;
    - Governed by: this form, in the preregistrations list;
    - Last verified at.
  - kernel/README.md: no change.
- **KNOWN-LIMITATIONS:** no item is owed. The event is instrument surface with no product caller (0.6), and the residual sites of §2.3 are carried by the proposed node.
- **Overlap, rule (00):** the files are those in §7, with no protocol/ path. At dispatch, the custodian checks that no in-progress piece or PR awaiting merge touches engine/src/stream.rs, engine/src/trace.rs or engine/README.md.
  - module-docs-stale-statements (docs lane) edits engine/README.md's body. That is the same file as this piece's index update, so the two are sequenced. It cites engine/src/stream.rs:999 only as evidence and edits no stream.rs line.
  - dataset-stream-doc-producer-runs-ahead concerns Dataset::stream's doc (engine/src/stream.rs:898-899 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:HASH-TBD).
  - Neither node's sentence is moved or contradicted by this change. Both cited lines sit above every insertion, so neither cite shifts.

## §10. Amendments

(opens empty)
````

## 3. OPEN items

**OPEN-1: may the E pair's scratch product patch be applied?** The patch is a 20 ms sleep before flush's check, active only while a trace is enabled. It is never committed.
- (a) **Allowed**, on the terms of the human's 2026-10-10 answer for the re-aim (state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:9): applied with git apply in this piece's worktree and one base worktree, reverted, each worktree shown clean, never committed and never pushed; stop and tell the human if the permission system refuses.
- (b) **No E pair.** The evidence is T-1 and T-2 with M-1 and M-2. §1's E claim and §5's P-2 and P-3 are dropped.
- **Recommendation: (a).** The original failures were seen only on Linux with two cores, and their path is inferred. The E pair ties the fix to the observed failure shape on this machine, while T-1 proves the mark deterministically. Without it, the gate has no evidence that the observed failure shape is closed.
- **Red line:** no.
- **What waits:** only E-1 and E-2, and with them the final gate under (a). Code, T-1, T-2, M-1 and M-2 do not wait.

There are no other OPEN items. The pre-prepare site is in scope as the same defect class. The three out-of-scope rows go to a proposed node (draft §2.3), which narrows nothing. No product seam is needed.

## 4. Files read, and the impact read's pointers

**Read:**
- the impact read (whole)
- `PLAN.yaml`: 2679-2694, 3805-3821, 4065-4084, 4290-4328, 4480-4511, 4802-4836
- `state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md` (whole)
- `state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md` (whole)
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md` (whole)
- `state/directives/2026-10-06-machine-script-adopted.md` (whole)
- `state/directives/2026-10-05-product-first-direction.md` (whole)
- `state/directives/PORTABILITY-2026-09-30.md` (whole)
- `state/directives/2026-10-04-round-53-open-1-ruling.md` (whole)
- `state/consults/FLAKE-HUNT-RUN-1-2026-10-10.md`; the logs folder's `README.md` and `experiment-C-final-state.diff`
- `state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md`
- `state/consults/2026-10-10-wire-bytes-invariant-trace-flag-race-owners-index-update.md`
- `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md` (whole)
- `engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md`: 1-70
- `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`: 60-89, 280-304
- `kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md`: 48-57
- `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`: 170-199
- `docs/PREREGISTRATION-TEMPLATE.md` (whole)
- `AUTONOMY.md`: 205-394, 476-483
- `docs/08_Testing.md`: 1-12
- ADR-018 (whole)
- `kernel/CANCELLATION-AND-TRACING.md` (whole)
- `kernel/README.md`: 325-336
- `engine/README.md`: 490-529
- `kernel/RESULTS.md`: 3248-3261, plus a grep
- `frontends/shell/CANCELLATION-FACTS.md`: 20-39
- `engine/src/stream.rs`: 49, 85, 640-713, 782-895, 1225-1404, 1750-2226, 2440-2600, 2636-3299
- `engine/src/cancel.rs`: 1-200
- `engine/src/trace.rs`: 1-480, 530-789
- `engine/src/index.rs`: 880-904
- `engine/src/pin.rs`: 170-204
- `kernel/src/lib.rs`: 608-621
- `engine/tests/slice.rs`: 680-864
- `kernel/tests/trace_spans.rs`: 140-175, 300-368, plus a grep
- `kernel/tests/skp_admission.rs`: 755-950
- `kernel/tests/skp_filter_cancellation.rs`: 95-282
- `kernel/tests/first_batch_factorial.rs`: 1284-1543
- greps: engine/src for cancel(), streams and test modules; the repo's .md files for the event; the drift sweep D files for stream.rs

**Impact read pointers used:**
- §0's PLAN and directive lines
- the event (trace.rs:440-441, :380-384)
- cancel.rs:96-98, :113-115, :120-124
- the Drop at stream.rs:885-895
- every exit line in §1, flush's call sites, the unmarked returns, and stream.rs:1292-1385 and :85
- the five batches_after_cancel readers in slice.rs
- every test pointer in §2 for the four kernel tests
- TERMINAL-WITHOUT-CREDIT:184-188
- ADR-018's parts
- CANCELLATION-AND-TRACING:44-53 and :178-193
- CANCEL-BEFORE-EXECUTE:36
- TIMING-ASSERTIONS §0.8 and Amendment 3
- the round-53 ruling
- TIMING-TESTS:53-55
- kernel/README.md:331
- wire-bytes' :177-178 and :239-248
- PLAN.yaml:4316
- the evidence pointers
- all five questions; the form answers them in §2.4, §2.3, §2.6, §2.5 and §4 respectively.

**Pointers found wrong:** none outright. Two are imprecise:
- trace.rs:445-448 is POST_CHECK_BEGIN's doc, not the event's own doc, though it does say what the impact read reports;
- the impact read calls stream.rs:3192-3199 the one in-crate test of flush. A second in-crate test also goes through flush on a live stream (stream.rs:3084-3181). Neither cancels, which T-1's design relies on.

**Pointers I did not verify:**
- connection_reuse.rs:258, end_to_end.rs:428, concurrency_in_situ.rs:362
- kernel/src/lib.rs:726-737
- ADMISSION Amendment 4 items (iv) and (ix)
- ADR-012:130
- KNOWN-LIMITATIONS

**Pointers missing:**
- trace.rs:26-37, the test-only tracing stance and the per-row rule. The seam decision rests on it.
- trace.rs:727-732, TEST_LOCK. Where the forcing tests can live, question 5, depends on it.
- stream.rs:782-797 (next_into ends only on disconnection) and trace_spans.rs:163-175 (quiesce). The trace_spans answer, question 3, depends on both.
- stream.rs:2901-2918, the envelope helper, and 2208-2219, Pending::new, which T-1 builds on.
- stream.rs:3134-3136 and 3229-3231, the binary's only real streams, which show T-1's presence assertion is unambiguous.
- kernel/RESULTS.md:3253-3256. This partly answers the impact read's missing pointer for the per-row mark's origin.
- stream.rs:2473-2490, the MAX_BATCH_BYTES check that bounds the assembly section, needed for question 4.
- The sql-filter P4 preregistration is still not located. It was not needed.
- The impact read also leaves open whether skp_admission's nine other tests stream while its trace is live. I did not read that either; it belongs to slice-traced-test-cross-stamping's class.

**Outside the diff, for the docs lane, not this piece:**
- kernel/tests/skp_filter_cancellation.rs:176 says 200,000 ids, while FEATURES at :147 is 2,000,000.
- kernel/tests/first_batch_factorial.rs:1290-1291 still calls ADR-018 Proposed.
- engine/src/trace.rs's exact-list test (`a_disabled_mark_records_nothing_and_a_started_trace_records_in_order`) can collect stamps from the fixture-feature in-crate streams. That is the same class as slice-traced-test-cross-stamping.
