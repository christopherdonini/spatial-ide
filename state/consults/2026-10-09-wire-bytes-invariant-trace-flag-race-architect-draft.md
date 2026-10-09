*Custodian's filing note (2026-10-09): the architect's draft of `wire-bytes-invariant-trace-flag-race`'s preregistration, on the custodian's brief at main 0c2be9cb, after lead-data's impact read (measured piece 7 of the second pilot). It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 6f986d2c7e99bf21b9c955f0100acb1a79a48d93d6d2951449b004b78483e99e. Write audit PASS: zero write calls (Read 39, Grep 23, Glob 3, SubagentHandback 1). Run window from the transcript: 2026-10-09T06:44:22Z to 06:54:24Z. The form as committed, `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`, is part 2's block with its 66 pins computed at 0c2be9cb, each pinned span's first and last line checked by the custodian (sha256 f9c25a2598580903d9711cffef15829346e7a915744c8f748c65703b72447543). One mechanical change: three of those pins are written in words, at the same commit and with no hash, because verify-quotes cannot resolve them: one path begins with a dot (`.github/workflows/product-ci-rust.yml`, lines 233 to 234; the proposed node on that grammar covers it), and the bare root `Cargo.lock` (lines 2068 to 2069 and 2084 to 2085) is ambiguous among the tree's lockfiles. Nothing else in it is changed.*

---

Reviewed: main @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693

**1. Which form, which gates, and what is left for the human**

- **Form: the full form, with full gating (architect and reviewer), from dispatch.** The size does not force this: the change is about 40 lines in one test file, under §21c's bound. The reason is §21a's fourth category, a property currently under test. ADR-004 Amendment 4 names `kernel/tests/wire_bytes_invariant.rs` as the proof of the wire-bytes invariant.
  - This change leaves the invariant, its scope and the compared bytes alone.
  - But serialising the two tests decides whether each "untraced" baseline really runs untraced. Without the lock, one test's trace can start during the other's untraced run. That run's comparison then passes without being the comparison the amendment asks for.
  - So a five-line `Out-of-scope` line could not honestly say the piece touches none of the four categories. Under §25(e), that means the full form from dispatch.
- **Where the form lives:** `kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md`.
- **What is the human's:** only OPEN-1 (whether two sibling sites get their own PLAN nodes). The form choice follows mechanically from §21a and §25(e), and the size threshold is the custodian's.

**2. The draft**

````markdown
# wire_bytes_invariant.rs's two traced tests made to take turns on the engine's trace flag and slot
# (PLAN node wire-bytes-invariant-trace-flag-race)

File: kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md
Authority: the human's direction of 2026-10-09, item 3c, slot 2 item c (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:24 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD; its RULED block in DECISIONS-PENDING.md); the node (PLAN.yaml:4514-4530 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD); the sibling-search default (AUTONOMY.md:215 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
Drafted by: the architect agent, from lead-data's impact read (state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-impact-read.md, whole-file sha256 cd1d36ce52231d8294b0890c1e778239ea140f7d27056936812e13f55fb7b5de), under the second pilot's §2 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:17-21 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD); code read at main 0c2be9cb.
Committed before any code. No code starts before slot 2's item a (covering-names-missing-column) and item b (skp-drained-stream-helper-post-check-race) have merged. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a property currently under test; §25(e)); see §0.11.
Pins: every pin below is a historical pin at 0c2be9cb. If a merge moves a pinned file before this piece's code, the worker re-derives the site by symbol. The pin stays authoritative for what it recorded; the tree is authoritative for the code the piece edits.

## §0. Disclosure

0.1 The failure: ubuntu-24.04, PR #189's pull_request run 37723999952, attempt 1, on the merge ref, not main.
  - The binary ran two tests. The projected test is reported FAILED, then its sibling ok: state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt:1424-1426 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - The panic is at the projected test's opening assertion: state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt:1432-1433 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - The result line: state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt:1440 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - The step runs the workspace suite with no thread setting: .github/workflows/product-ci-rust.yml:233-234 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - The push run at the same head passed on both platforms (the node's summary, PLAN.yaml:4529 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).

0.2 The cause was read from code by PR #189's gate-1 reviewer, not observed: state/consults/gates/2026-10-08-data-plane-crowded-start-detail-spaces-gate1-reviewer.md:100 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD. Its ledger-candidate note: state/consults/gates/2026-10-08-data-plane-crowded-start-detail-spaces-gate1-reviewer.md:102 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD

0.3 The flag and the slot.
  - ENABLED, one process-global AtomicBool, false at start: engine/src/trace.rs:82-88 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - CURRENT, the single slot, with its declared one-traced-stream limit (ADR-010 rule 6): engine/src/trace.rs:90-98 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - start refuses while the slot is occupied; otherwise it fills the slot, then sets the flag: engine/src/trace.rs:329-339 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - TraceGuard's Drop clears the flag and empties the slot: engine/src/trace.rs:353-358 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - is_enabled reads the flag: engine/src/trace.rs:318-322 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - start has no product caller: engine/src/stream.rs:708-710 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD and kernel/src/lib.rs:615-617 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD. A search of the .rs files under engine/, kernel/ and protocol/ at 0c2be9cb finds trace::start only in tests and in engine/src/trace.rs's own unit tests.

0.4 The two tests are the only tests in their binary. 0.1's line 1424 shows two; kernel/tests/watch_support/mod.rs declares no test and names no trace item.
  - tracing_changes_no_byte_on_the_wire: kernel/tests/wire_bytes_invariant.rs:168-255 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
    - its opening assertion that tracing is off: kernel/tests/wire_bytes_invariant.rs:173-176 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
    - its start, with an expect on a refusal: kernel/tests/wire_bytes_invariant.rs:179-185 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
    - its batch guard, counted then dropped: kernel/tests/wire_bytes_invariant.rs:188-194 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too: kernel/tests/wire_bytes_invariant.rs:374-436 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
    - its opening assertion, the CI panic site: kernel/tests/wire_bytes_invariant.rs:378-381 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
    - its start: kernel/tests/wire_bytes_invariant.rs:384-390 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
    - its batch guard, counted then dropped: kernel/tests/wire_bytes_invariant.rs:393-399 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - Both are multi-thread tokio tests (kernel/tests/wire_bytes_invariant.rs:168 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD; kernel/tests/wire_bytes_invariant.rs:374 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
  - Each collector stops at TAG_TERMINAL: kernel/tests/wire_bytes_invariant.rs:143-158 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD and kernel/tests/wire_bytes_invariant.rs:339-354 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - A search of the file at 0c2be9cb finds no static, lock or serialising helper.

0.5 Cause. This is a hypothesis read from code, not observed. With no setting, the harness runs the two tests as concurrent threads of one process. The interleavings:
  - (a) The sibling's trace is live at the projected test's opening assertion. This is the CI shape.
  - (b) The reverse.
  - (c) Either start is refused while the other's trace is live, and its expect panics.
  - (d) Silent: one test's trace starts during the other's untraced run. That baseline is then partly traced, and its comparison passes without being the comparison ADR-004 Amendment 4 asks for. While a trace is live, the other test's producers also stamp batch_full into it, which can satisfy its batch guard.
  - Discriminator: §4's M-0, for consistency only.

0.6 Precedents on main.
  - kernel/tests/trace_spans.rs:138-149 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - engine/src/trace.rs:727-732 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - The reason another file was split from this one: kernel/tests/skp_admission.rs:6-9 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - Two forms placed their tests by this constraint: kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:76-81 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD and protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:100-102 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD

0.7 Siblings, under the sibling-search default. The class is two or more tests in one binary that start a trace or assert the flag, with no shared lock.
  - In the class and in scope: this file.
  - In the class and already serialised:
    - kernel/tests/trace_spans.rs: serial(), taken by each traced test (kernel/tests/trace_spans.rs:145-149 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD);
    - engine/src/trace.rs's unit tests: TEST_LOCK (0.6).
  - One trace user per binary, outside the class:
    - kernel/tests/skp_admission.rs:820-830 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
    - kernel/tests/skp_filter_cancellation.rs:164-174 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
    - engine/tests/slice.rs:776-782 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - A child process, or one ignored test running sequentially: kernel/tests/query_window_attribution.rs and kernel/tests/cancel_rescore.rs.
  - In the class but outside CI, and OPEN-1: kernel/tests/first_batch_factorial.rs's two ignored measurement tests each start a trace, with no shared lock (kernel/tests/first_batch_factorial.rs:1321 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD; kernel/tests/first_batch_factorial.rs:1455 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
  - A different shape, OPEN-1: engine/tests/slice.rs's traced test reads the first cancellation-requested and producer-cancelled stamps in its trace (engine/tests/slice.rs:802-809 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
    - Meanwhile the binary's other tests run unserialised, and one of them cancels (engine/tests/slice.rs:722 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
    - cancel stamps cancellation-requested itself (engine/src/cancel.rs:120-124 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
    - That is cross-test stamping into a live trace, not a flag or slot assertion. It has not been observed failing.

0.8 Governing texts.
  - ADR-004 is Accepted (docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD). Amendment 4's proof obligation names this file and is scoped to one operation class: docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:51-56 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - kernel/CANCELLATION-AND-TRACING.md §5 (kernel/CANCELLATION-AND-TRACING.md:144-155 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD) and §7 (kernel/CANCELLATION-AND-TRACING.md:180-182 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
  - The projected test was added as K-6: engine/B1-PROJECTION-PREREGISTRATION.md:280 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD and engine/B1-PROJECTION-PREREGISTRATION.md:469-470 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - Its recorded-mutation comment: kernel/tests/wire_bytes_invariant.rs:364-373 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD. That comment is pinned by kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md, C7 and W-1.

0.9 Budget. The node declares 60 minutes; the full form and its gates exceed that. The custodian records the deviation in PLAN. It is not a §7 figure.

0.10 Reuse index (the 2026-10-09 direction, item 5). node tools/reuse.mjs, run in the private clone at 89bbac3738dbb46d47988e55a7c0f0d4f9fe4c5c, found no prior art for trace flag, tracing, global state or test isolation. This miss does not block.

0.11 Gating route. This file is ADR-004 Amendment 4's named proof. Serialising its two tests decides whether each untraced baseline is untraced throughout (0.5 (d)). The piece therefore touches a property currently under test (§21a), and a five-line Out-of-scope line could not assert that it touches none of the four categories. So the full form applies from dispatch (§25(e)). The size, at most 40 lines (§7), is under §21c's bound.

## §1. May and may not claim

- May claim, by §2's argument:
  - with the lock, the two test bodies never overlap;
  - at either test's opening assertion, no trace started by the other is live;
  - each untraced run runs with the flag off throughout;
  - neither start is refused by the other test.
- May claim M-1's and M-0's outcomes as observed.
- May not claim:
  - that CI's failure was observed to have 0.5's cause. M-0 shows consistency only;
  - any rate, or the race's absence, from R-0's or R-1's counts;
  - that no stamp from the same test's untraced run can reach its traced trace. §2 argues this from the engine side only. It does not pin the data-plane link from the source's end to TAG_TERMINAL, and a collection that ends on a socket error or close is not drained;
  - anything about the OPEN-1 sites;
  - any timing, duration or performance number; any product change;
  - any change to ADR-004 Amendment 4's scope (one operation class) or wording.
- No ADR is amended. ADR-004, ADR-010 and ADR-018 are Accepted and are cited, not changed.
- No wire, SKP, MCP or data-plane change.

## §2. The change

Only kernel/tests/wire_bytes_invariant.rs changes.
- C1. A file-local `static TRACE_SERIAL: std::sync::Mutex<()>`, and `fn serial() -> std::sync::MutexGuard<'static, ()>`, which locks and recovers a poisoned lock with into_inner. The shape is kernel/tests/trace_spans.rs:145-149 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD. They are placed after collect_frames and above the first test. They are not pub, and no other item is added.
- C2. The first statement of each of the two test bodies is `let _serial = serial();`. It is a named binding, so the guard lives to the end of the body.
- C3. serial()'s doc states, by symbol name only:
  - the flag and slot are process-global, and start refuses a second trace (the declared limit);
  - the tests here are threads of one process, so the two take turns for their whole bodies, and the refusal is kept;
  - the lock is taken first and so released last, after any TraceGuard, on a panic too;
  - holding it across .await is deliberate, for the reason below.
  - The doc carries no path:line.
- Unchanged, byte for byte: the test names, every assertion and message, both collectors, both fixtures, the module header and the recorded-mutation comment (0.8).
- The seam consumed is engine/src/trace.rs's existing interface (is_enabled, start returning an Option of TraceGuard, TraceGuard's Drop), read at 0.3. No interface is added.

Why the two tests can no longer overlap:
- Both bodies take serial() first and hold it to their end, and the Mutex has one holder at a time.
- Rust drops locals in reverse declaration order, during unwinding too. A live TraceGuard therefore clears the flag and empties the slot (0.3) before the lock is released.
- Only these two tests are in the binary (0.4), and nothing on the product path calls start (0.3). So when either test is granted the lock, the flag is off and the slot is empty, unless a body leaked a guard. Until that test's body ends, no other start runs in the process.
- This gives 0.5's (a), (b) and (c), and the flag-off half of (d). The stamp half of (d) follows from the next argument.

Cross-run stamping (the impact read's question 2) is argued closed. No code is added for it:
- batch_full is stamped after a batch is assembled, and only if the stream is not cancelled; then the batch is sent: engine/src/stream.rs:2540-2570 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
- The consumer sees the end only when recv reports disconnection: engine/src/stream.rs:782-797 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD. std's Receiver::recv contract delivers buffered items before it reports disconnection. The worker records rustc -V with the first run.
- Each collector stops at TAG_TERMINAL (0.4). So every batch_full stamp of a run drained to TAG_TERMINAL precedes that run's end, if the data plane sends TAG_TERMINAL only after its source ends. That link is not pinned here (§1).
- trace_spans.rs's quiesce answers streams dropped before their end (kernel/tests/trace_spans.rs:151-175 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD). Neither test drops a stream early, so no quiesce is added.

Holding the lock across .await:
- A tokio test builds its own runtime and runs the body with block_on on the test's own thread. A test that is waiting for the lock therefore blocks only its own thread, never a worker of the other test's runtime. The guard is never moved into a spawned task.
- This is a library claim, about tokio 1.53.1 (Cargo.lock:2068-2069 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD) and tokio-macros 2.7.2 (Cargo.lock:2084-2085 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD). Before any code, the worker reads that macro's expansion at the locked version and stops on a mismatch.
- Clippy's await_holding_lock would name this hold. No workflow under .github/workflows runs clippy (search at 0c2be9cb). No allow attribute is added.

Portability (state/directives/PORTABILITY-2026-09-30.md, §2):
- R1: std's Mutex and the process-global flag behave the same on every platform. CI saw the race on ubuntu, and the fix is platform-free.
- R2 to R4: no OS-dependent feature and no cfg. R3 is not triggered.
- R5: no level is claimed.
- R6: nothing is ignored on any platform.

## §3. Fixtures

The two existing fixtures are unchanged: kernel/tests/wire_bytes_invariant.rs:60-75 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD and kernel/tests/wire_bytes_invariant.rs:267-283 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD. They are generated per run. Neither is the 5 GB fixture, and no hash is pinned.

## §4. Tests and mutations

For each mutation: apply it, run the named command, record each failure by name with the commit it was observed at, then revert. A verify-mutation run is never called a mutation's observation (round 25, item 2 (c)).

- Changed tests: the two in 0.4. New tests: none.
- M-1, the mutation of record for both changed tests.
  - The change: in serial(), after the lock is taken and before it returns, insert `std::mem::forget(trace::start(TraceKey::default()));`. TraceKey has a Default: engine/src/trace.rs:767 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD
  - Run cargo test -p spatial-kernel --test wire_bytes_invariant.
  - Both tests fail by name at their opening assertion, with the messages at kernel/tests/wire_bytes_invariant.rs:175 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD and kernel/tests/wire_bytes_invariant.rs:380 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD.
  - This holds in any order. The first holder's start fills the slot, and the forgotten guard never clears it. The second holder's start is refused, and the flag stays on.
- M-0 is an observation of consistency with CI, not of CI's cause.
  - The change: in tracing_changes_no_byte_on_the_wire, replace drop(guard) (kernel/tests/wire_bytes_invariant.rs:194 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD) with std::mem::forget(guard).
  - Run cargo test -p spatial-kernel --test wire_bytes_invariant -- --test-threads=1, and record the run order the output prints.
  - If the sibling runs first, it passes and the projected test fails at its opening assertion, which is 0.1's shape. Any other outcome is recorded as observed.
- The projected test's recorded mutation (the impact read's question 4).
  - The comment and its observation commit stay byte-identical.
  - It is not re-observed: neither the mutated site (engine/src/envelope.rs) nor the comparison its failure passes through (kernel/tests/wire_bytes_invariant.rs:415-435 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD) changes.
  - The pins in the followups form stay historical: authoritative for what they recorded, with the tree authoritative for the code.
- Timing: no sleep, retry or timeout is added or changed. RECV_DEADLINE is unchanged.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- P-1: M-1 fails both tests as §4 states.
- P-2 (R-1): at the piece's head, 100 consecutive runs of cargo test -p spatial-kernel --test wire_bytes_invariant; 100 of 100 pass.

Reported, with no prediction:
- R-0: the same 100 runs at the branch point, before any code, with each failure recorded by test name and message. The CI failure was on ubuntu. A Windows reproduction is neither expected nor required.
- M-0.

Declared unchanged:
- every line of both test bodies except the inserted first statement;
- the collectors, fixtures, constants, module header and recorded-mutation comment;
- the test names;
- engine/src/trace.rs, including the refusal in start;
- every product line; no diff under engine/, protocol/, frontends/ or kernel/src;
- kernel/tests/skp_admission.rs's module doc;
- no new pub item, dependency, cfg, ignore or Cargo change.

Invalidators:
- M-1 does not fail both tests at their opening assertion;
- the locked macro's expansion is not block_on on the test thread.
- On either, stop, return to the architect and record class 2.

Falsification: a run with the lock in place and no mutation in which either test fails at its opening assertion or at its start's expect. §2's argument is then false; some other flag-setter exists.

## §6. Instruments

All outcomes are structural assertions. R-0 and R-1 are pass/fail counts, not measurements, and carry no docs/08 row.

## §7. Declared values and ceilings

- At most 40 changed lines, all in kernel/tests/wire_bytes_invariant.rs.
- Counting: by §21c's rule, git diff --numstat B H -- kernel/tests/wire_bytes_invariant.rs, with B = git merge-base origin/main H, named in the PR body.
- Non-generated files: at most 5. They are this form, PLAN.yaml, kernel/tests/wire_bytes_invariant.rs, kernel/README.md and engine/README.md. The two READMEs carry only the owner's-index update and are outside the line count.
- R-0 and R-1: 100 runs each. No constant is added to code.
- An overrun is class 8, and this section is never edited.

## §8. Block-on-sight

1. Any code before this form is committed with the custodian's hashes, or before slot 2's items a and b have merged.
2. Any edit outside kernel/tests/wire_bytes_invariant.rs among code and test files: under engine/, protocol/, frontends/ or kernel/src, another test file, Cargo.toml, Cargo.lock or a workflow. On such a need, stop and tell the human.
3. The guard bound to `_`; serial() not the first statement of a body; the lock released before the body ends; a lock other than §2's.
4. Any change to start's refusal, the flag or the slot, or a test that tolerates a refused start.
5. An edit to an assertion, a message, a test name, a collector, a fixture, the module header or the recorded-mutation comment.
6. A sleep, retry, timeout change or test-thread setting, in the file or in CI.
7. The two tests merged, or either moved to another binary.
8. A path:line cite in a code comment.
9. A claim beyond §1.
10. Code for an OPEN-1 site in this piece.
11. The round-25 items, by name:
    - a §7 overrun not recorded as class 8, or §7 edited to match;
    - a scope addition not recorded as class 9, or its code before its amendment;
    - a verify-mutation run called a mutation's observation;
    - a test-text span on an unmerged branch pinned by hash at a branch commit, or named without its commit id.

## §9. Gates

- Architect and reviewer (§21a; §25(e)).
  - Verdicts follow AUTONOMY.md §22 as the product-first direction's section 2 replaced it (state/directives/2026-10-05-product-first-direction.md:15 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
  - They block only on Correctness or Evidence. Documentation findings are fixed in this PR before the merge.
- Architect: §2's arguments against the cited sites; §8, item by item; §1.
- Reviewer:
  - the full diff;
  - M-1, both names, and M-0, each observed with its commit id;
  - R-0 and R-1, with their commits;
  - the macro-expansion check;
  - the owner's-index update against the diff.
- Suites:
  - cargo test -p spatial-kernel --test wire_bytes_invariant;
  - cargo fmt --all --check;
  - the workspace, by CI on both platforms;
  - the node --test scripts suite; verify-plan; verify-cites; verify-quotes; verify-test-claims.
- Heavy runs follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:HASH-TBD).
- The merge is a merge commit, never a squash.
- Operator: none.
- Owner's-index update before the final gate (the second pilot's §1, item 2). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff. It closes the three gaps the impact read found:
  - kernel/README.md, Owner's index:
    - Interfaces this module owns: one line, in the shape of the persisted-artifact line, for instrument surface never on the wire (ADR-004 Amendment 4; kernel/CANCELLATION-AND-TRACING.md §5), pinned by the two tests of 0.4.
    - Consumed from other modules: spatial_engine's list gains trace (start, TraceGuard, TraceKey, is_enabled, mark).
    - Governed by: this form is added to the preregistrations in this module, and kernel/CANCELLATION-AND-TRACING.md is added as a design note, in the sub-bullet shape lead-data names.
    - Last verified at.
  - engine/README.md, Owner's index:
    - Interfaces this module owns: a spatial_engine::trace entry (start, TraceGuard, TraceKey, mark, is_enabled), never on the wire (ADR-004 Amendment 4), with its one-traced-stream limit by pointer. It is pinned by engine/src/trace.rs::tests::a_disabled_mark_records_nothing_and_a_started_trace_records_in_order and engine/src/trace.rs::tests::a_second_trace_is_refused_rather_than_replacing_the_first.
    - Governed by: no change.
    - Last verified at.
- KNOWN-LIMITATIONS: no item is owed. The piece is test-only, with no user-visible change. The one-traced-stream limit stays declared where it is (0.3; 0.8).

## §10. Amendments

(opens empty)
````

**3. OPEN items**

**OPEN-1: two sibling sites outside the node's summary.**
- **The sites.**
  - (i) `engine/tests/slice.rs`'s traced test reads the first cancellation stamps in its trace while its binary's other tests run unserialised, and one of them cancels. This is a different shape from this node's: cross-test stamping, not a flag or slot assertion. It has not been observed failing.
  - (ii) `kernel/tests/first_batch_factorial.rs`'s two ignored measurement tests are the same class as this node's, but they run outside CI and race only if run together.
- **Options.**
  - (1) Neither enters this piece. The custodian appends a proposed PLAN node for each: (i) its own form, because any fix bears on the docs/08 budgeted assertion at `engine/tests/slice.rs:815-818`; (ii) a lock, or a stated one-at-a-time rule.
  - (2) Site (i) enters this piece as Part B: the traced test moves to its own binary, the shape of the precedent in 0.6. That widens Scope to `engine/tests/`, adds about 100 lines, and brings a budgeted assertion under this gate.
  - (3) Record them in §0.7 only, and place nothing.
- **Recommendation:** (1).
- **Red line:** no.
- **What waits on it:** nothing in this piece.

**4. Files read, and the impact read's pointers**

Read at 0c2be9cb unless noted:
- The impact read (whole file).
- `PLAN.yaml`: 4514-4530.
- `state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md`: whole file.
- `state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md`: whole file.
- `state/directives/2026-10-05-product-first-direction.md`: 10-19.
- `state/directives/2026-10-06-machine-script-adopted.md`: 10-23.
- `state/directives/PORTABILITY-2026-09-30.md`: headings and R1 to R6 lines.
- The CI log: 1420-1444.
- The gate-1 reviewer report: 93-104.
- `kernel/tests/wire_bytes_invariant.rs`: 1-437.
- `kernel/tests/trace_spans.rs`: 120-209.
- `engine/src/trace.rs`: 40-109, 290-399, 554-555, 650-671, 715-784.
- `engine/src/stream.rs`: 703-714, 770-801, 2525-2584.
- `kernel/src/lib.rs`: 608-619.
- `kernel/tests/skp_admission.rs`: 1-22, 810-844.
- `engine/tests/slice.rs`: 740-829, plus a search for the test attributes, cancel and trace.
- `kernel/tests/first_batch_factorial.rs`: 1290-1324, 1425-1459, plus a search.
- `kernel/tests/permission_boundary.rs`: 60-84.
- `kernel/tests/watch_support/mod.rs`: search only.
- `protocol/data-plane/src/server.rs`: 540-629.
- `kernel/CANCELLATION-AND-TRACING.md`: 1-12, 140-187.
- `docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md`: 1-4, 28-60.
- `kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md`: 60-89.
- `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`: 95-106.
- `engine/B1-PROJECTION-PREREGISTRATION.md` and `kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md`: search hits.
- `kernel/SKP-DRAINED-STREAM-HELPER-POST-CHECK-RACE-PREREGISTRATION.md`: whole file, as the format precedent.
- `kernel/README.md`: 340-385.
- `engine/README.md`: 490-528.
- `AUTONOMY.md`: 210-219, 300-499.
- `docs/PREREGISTRATION-TEMPLATE.md`: whole file.
- `.github/workflows/product-ci-rust.yml`: 225-236.
- `kernel/Cargo.toml`: whole file.
- `Cargo.toml`: the tokio line.
- `Cargo.lock`: the tokio and tokio-macros entries.
- Repo searches for trace::start, is_enabled, BATCH_FULL, static locks and clippy.

**Pointers used:**
- all of §0;
- §1's test table, flag/slot pins and no-product-caller pins;
- §2's sibling table and the two forms' precedents;
- §3's ADR-004 Amendment 4, CANCELLATION-AND-TRACING §5 and §7, B1 K-6, and the followups form's C7 and W-1;
- the three owner's-index gaps;
- all five questions.

ADR-018 and ADR-010 were not needed beyond what `engine/src/trace.rs:90-98` cites.

**Pointers found wrong:** none. I spot-checked every line range I re-cited, and each matched.

**Pointers missing:**
1. For question 2:
   - the order in which a batch is stamped and then sent (`engine/src/stream.rs:2540-2570`). The read lists 2551-2557 only as mark sites;
   - the end-on-disconnect in `next_into` (`engine/src/stream.rs:782-797`).
2. For question 5 and the sibling search, the mechanism of slice.rs's exposure:
   - its first-occurrence reads (`engine/tests/slice.rs:802-809`);
   - another test's cancel (`engine/tests/slice.rs:722`);
   - `engine/src/cancel.rs:120-124`, which the read cites only as a reader site, as the stamp that test's cancel makes.
3. `kernel/tests/first_batch_factorial.rs`'s two ignored trace starters share one binary with no lock. The read classed them only as ignored.
4. `kernel/tests/watch_support/mod.rs` has no tests. That confirms the binary holds only the two tests; the CI log's count line also covers it.
5. For a question the read could not foresee (holding the lock across `.await`): the locked tokio and tokio-macros versions, and that no workflow runs clippy.
