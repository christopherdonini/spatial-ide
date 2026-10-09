# wire_bytes_invariant.rs's two traced tests made to take turns on the engine's trace flag and slot
# (PLAN node wire-bytes-invariant-trace-flag-race)

File: kernel/WIRE-BYTES-INVARIANT-TRACE-FLAG-RACE-PREREGISTRATION.md
Authority: the human's direction of 2026-10-09, item 3c, slot 2 item c (state/directives/2026-10-09-slot-orders-pilot-and-reuse-standing-step.md:24 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:b2041daad709cd1587d7680fb3cce390975853989cea032ee32318b7faaafd58; its RULED block in DECISIONS-PENDING.md); the node (PLAN.yaml:4514-4530 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:b92543d31c53be75ddc34603269faf5db900cbedf377537e7fcd880957b05526); the sibling-search default (AUTONOMY.md:215 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:5fc1d41f0bad9f276ad4b4c845d4d5ddcdf9af27c467ade5ae83e626387cd2c1).
Drafted by: the architect agent, from lead-data's impact read (state/consults/2026-10-09-wire-bytes-invariant-trace-flag-race-impact-read.md, whole-file sha256 cd1d36ce52231d8294b0890c1e778239ea140f7d27056936812e13f55fb7b5de), under the second pilot's §2 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:17-21 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:f6bbbdad923bec96db7129da0a748c809b49f10c1cdd119bd8885a555eacd727); code read at main 0c2be9cb.
Committed before any code. No code starts before slot 2's item a (covering-names-missing-column) and item b (skp-drained-stream-helper-post-check-race) have merged. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a property currently under test; §25(e)); see §0.11.
Pins: every pin below is a historical pin at 0c2be9cb. If a merge moves a pinned file before this piece's code, the worker re-derives the site by symbol. The pin stays authoritative for what it recorded; the tree is authoritative for the code the piece edits.

## §0. Disclosure

0.1 The failure: ubuntu-24.04, PR #189's pull_request run 37723999952, attempt 1, on the merge ref, not main.
  - The binary ran two tests. The projected test is reported FAILED, then its sibling ok: state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt:1424-1426 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:51ae62acbdfb88e420237ec89b57a46b179cc6fc2b0e46541338819566c7377c
  - The panic is at the projected test's opening assertion: state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt:1432-1433 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:4f3c9689acc2b42e64acb16e2f4ce2af7be063cb577b5c880ce0ff0d404301b5
  - The result line: state/consults/2026-10-08-pr189-ci-run-37723999952-attempt-1-failed-steps.txt:1440 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:b3e8fb562b285cab18079fed2e720e4a37c96eec4b81a5665f9f010ddfff8347
  - The step runs the workspace suite with no thread setting: lines 233 to 234 of the CI workflow `.github/workflows/product-ci-rust.yml` at 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693
  - The push run at the same head passed on both platforms (the node's summary, PLAN.yaml:4529 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:c79666d1b3c7e288a249223d5dcc13013a9123d40b02c94164a9e84454db4aaa).

0.2 The cause was read from code by PR #189's gate-1 reviewer, not observed: state/consults/gates/2026-10-08-data-plane-crowded-start-detail-spaces-gate1-reviewer.md:100 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:8cfa1ab19c384a3ac46c78c7d2e5b971c99b6dd567af21ad4dad4eebb7c37cc8. Its ledger-candidate note: state/consults/gates/2026-10-08-data-plane-crowded-start-detail-spaces-gate1-reviewer.md:102 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:cb55973a6b35164886588aa444dbe807c0702e774ccb97680eaf1f3070dc60b3

0.3 The flag and the slot.
  - ENABLED, one process-global AtomicBool, false at start: engine/src/trace.rs:82-88 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:1e10cd4bdd0dee9c813703609a00fa16bce69cec699b6a1c133ac64185562d94
  - CURRENT, the single slot, with its declared one-traced-stream limit (ADR-010 rule 6): engine/src/trace.rs:90-98 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:8c1d47840decf4cd1dccfaac02ed1f36c4dd22c77a219d1185c8687fb1a80e3d
  - start refuses while the slot is occupied; otherwise it fills the slot, then sets the flag: engine/src/trace.rs:329-339 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:72cb6e20ff3dded4a83ff1581b36eb55cbfe5906eb7f903715df9f89da3b3ed3
  - TraceGuard's Drop clears the flag and empties the slot: engine/src/trace.rs:353-358 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:30150ef28e04c7da7d4a8fc24b6b2bf00c0d18dce65b4bb2a8fe31ef6ff3143a
  - is_enabled reads the flag: engine/src/trace.rs:318-322 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:8853372b8c332bf731637513743c89893beaccc350969f5fd163de216a9204c0
  - start has no product caller: engine/src/stream.rs:708-710 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:027e277689524c7fabedba13af9787f96d934d23ab53929ddbe89752fafe7718 and kernel/src/lib.rs:615-617 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:a5be8bed9034bd5de7f094b14f81938ebe18dcd608dadb1aff2789858bfbb357. A search of the .rs files under engine/, kernel/ and protocol/ at 0c2be9cb finds trace::start only in tests and in engine/src/trace.rs's own unit tests.

0.4 The two tests are the only tests in their binary. 0.1's line 1424 shows two; kernel/tests/watch_support/mod.rs declares no test and names no trace item.
  - tracing_changes_no_byte_on_the_wire: kernel/tests/wire_bytes_invariant.rs:168-255 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:902ee7e35565474cd321a4f1a03477cb0b00079788558ecfde77e7807b1b91d2
    - its opening assertion that tracing is off: kernel/tests/wire_bytes_invariant.rs:173-176 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:56955addbc0ed240405dcca2657e0acee28f3bfa6cefe5bbdc121edf44c81b4d
    - its start, with an expect on a refusal: kernel/tests/wire_bytes_invariant.rs:179-185 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:0a6649c68f1acb8c6eae013cc08c05ffb64c12bcd7ca844e12f66e458d2a9052
    - its batch guard, counted then dropped: kernel/tests/wire_bytes_invariant.rs:188-194 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:d45ff5ad8e2e8a6fb8be2d938ab97705f1ce6affdf73ed6e9ec09759f1665d59
  - wire_bytes_invariant_holds_for_the_projected_ticket_path_case_too: kernel/tests/wire_bytes_invariant.rs:374-436 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:87859752fb272ae92a5770428d11ca1232cbc636d90b38b07ee5e80e13e474e4
    - its opening assertion, the CI panic site: kernel/tests/wire_bytes_invariant.rs:378-381 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:56955addbc0ed240405dcca2657e0acee28f3bfa6cefe5bbdc121edf44c81b4d
    - its start: kernel/tests/wire_bytes_invariant.rs:384-390 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:2bdcd1fb658a79c36401b4a9f02a490a363ad18790ae3ab025a1364ebb97f734
    - its batch guard, counted then dropped: kernel/tests/wire_bytes_invariant.rs:393-399 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:d45ff5ad8e2e8a6fb8be2d938ab97705f1ce6affdf73ed6e9ec09759f1665d59
  - Both are multi-thread tokio tests (kernel/tests/wire_bytes_invariant.rs:168 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:02e4f564b13c1d7de03007d7aa7d5aec02e4fc4aa7614576437135490b9f8def; kernel/tests/wire_bytes_invariant.rs:374 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:02e4f564b13c1d7de03007d7aa7d5aec02e4fc4aa7614576437135490b9f8def).
  - Each collector stops at TAG_TERMINAL: kernel/tests/wire_bytes_invariant.rs:143-158 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:9d413649af7123915fc231696155dca0a87ecda10707bbbf0fae5c7b6b6d2cfd and kernel/tests/wire_bytes_invariant.rs:339-354 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:9d413649af7123915fc231696155dca0a87ecda10707bbbf0fae5c7b6b6d2cfd
  - A search of the file at 0c2be9cb finds no static, lock or serialising helper.

0.5 Cause. This is a hypothesis read from code, not observed. With no setting, the harness runs the two tests as concurrent threads of one process. The interleavings:
  - (a) The sibling's trace is live at the projected test's opening assertion. This is the CI shape.
  - (b) The reverse.
  - (c) Either start is refused while the other's trace is live, and its expect panics.
  - (d) Silent: one test's trace starts during the other's untraced run. That baseline is then partly traced, and its comparison passes without being the comparison ADR-004 Amendment 4 asks for. While a trace is live, the other test's producers also stamp batch_full into it, which can satisfy its batch guard.
  - Discriminator: §4's M-0, for consistency only.

0.6 Precedents on main.
  - kernel/tests/trace_spans.rs:138-149 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:76469d6e22627b34b41a911ede579948e8028fd6a9d6cf52b98b0357b9a0d979
  - engine/src/trace.rs:727-732 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:ec8a5bbd2c92a02dda09ee0049146dd91a858319a638cf4b9eecdabc18416bdc
  - The reason another file was split from this one: kernel/tests/skp_admission.rs:6-9 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:341f014da21e8c32f053059fc8305dc2e2c5f7611e1447a0aaacb1010f182c6a
  - Two forms placed their tests by this constraint: kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:76-81 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:a960445ece2ca5894fd08d5b927b6fec4520099fbd6d816d50daeb9744d19206 and protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:100-102 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:321382cb6a06f53c125e450f8078a93919767f9bdc327bab4169bdd1d109cf8d

0.7 Siblings, under the sibling-search default. The class is two or more tests in one binary that start a trace or assert the flag, with no shared lock.
  - In the class and in scope: this file.
  - In the class and already serialised:
    - kernel/tests/trace_spans.rs: serial(), taken by each traced test (kernel/tests/trace_spans.rs:145-149 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:34df4f7d5e01eb83a92a658e40c11dc1c418c1928a21d2267019949cc25286a6);
    - engine/src/trace.rs's unit tests: TEST_LOCK (0.6).
  - One trace user per binary, outside the class:
    - kernel/tests/skp_admission.rs:820-830 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:6b80cf45e075f98aad3a9f1f0e83070ba5f326897e517990615f0c5f5fb9bbb0
    - kernel/tests/skp_filter_cancellation.rs:164-174 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:09a5cf7613fb4ff405009a02649d48eaa17020d9cdc14955cf4e5b6c2b0e3810
    - engine/tests/slice.rs:776-782 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:cc2e968d6f31f3b681a38a7f519d8fe81f417094aaba70d814c1d200a2e67c36
  - A child process, or one ignored test running sequentially: kernel/tests/query_window_attribution.rs and kernel/tests/cancel_rescore.rs.
  - In the class but outside CI, and OPEN-1: kernel/tests/first_batch_factorial.rs's two ignored measurement tests each start a trace, with no shared lock (kernel/tests/first_batch_factorial.rs:1321 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:447869b591ce74a7252b923d6923e5cf9b439e5222bd2076fe0db209c770f89b; kernel/tests/first_batch_factorial.rs:1455 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:447869b591ce74a7252b923d6923e5cf9b439e5222bd2076fe0db209c770f89b).
  - A different shape, OPEN-1: engine/tests/slice.rs's traced test reads the first cancellation-requested and producer-cancelled stamps in its trace (engine/tests/slice.rs:802-809 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:91df57f43e69fe26ff73cd944c1f8dfc91eb1ef57fe5491448db5ce730118a62).
    - Meanwhile the binary's other tests run unserialised, and one of them cancels (engine/tests/slice.rs:722 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:2fc1073f69499eff9f2799403883afb872b8dada4d0011bcf0eb0baa72725cde).
    - cancel stamps cancellation-requested itself (engine/src/cancel.rs:120-124 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:e71f1fbaf0e76420626fc5288c962acd24e3a7701010171d8ec65278e3937d91).
    - That is cross-test stamping into a live trace, not a flag or slot assertion. It has not been observed failing.

0.8 Governing texts.
  - ADR-004 is Accepted (docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:3 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:7d0b37869d665e5e5168cc80df8d4e12eaadd60fe70326fd469c539ce1ea8ad9). Amendment 4's proof obligation names this file and is scoped to one operation class: docs/adr/ADR-004-skp-control-data-plane-mcp-adapter.md:51-56 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:e993255d707bb6f5413dff4084d7bc44bfbf208875b6843e35213b8f0ca4ddd2
  - kernel/CANCELLATION-AND-TRACING.md §5 (kernel/CANCELLATION-AND-TRACING.md:144-155 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:8ce43a3c1ead6764887f5ba48f879d0a3f49ac76616cb3ebff798a42c0f973db) and §7 (kernel/CANCELLATION-AND-TRACING.md:180-182 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:c35e4bb4fa55b9dad63f822e892dbd8541425dd930221edb133098dd61ce65f7).
  - The projected test was added as K-6: engine/B1-PROJECTION-PREREGISTRATION.md:280 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:f763d9de46b14d8a513609b661372a6aa10cfa8374dc323fe80b51c4998c3566 and engine/B1-PROJECTION-PREREGISTRATION.md:469-470 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:6536dede369dfc5c850c82a8bc2466c2bea614a96981a642646676398a3a451c
  - Its recorded-mutation comment: kernel/tests/wire_bytes_invariant.rs:364-373 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:463b5b9348ae2ab1d6b08ddfcd14619f12212d40ca23e8f68f89b404f4abad87. That comment is pinned by kernel/GENERATION-CLOSE-RACES-FOLLOWUPS-PREREGISTRATION.md, C7 and W-1.

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
- C1. A file-local `static TRACE_SERIAL: std::sync::Mutex<()>`, and `fn serial() -> std::sync::MutexGuard<'static, ()>`, which locks and recovers a poisoned lock with into_inner. The shape is kernel/tests/trace_spans.rs:145-149 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:34df4f7d5e01eb83a92a658e40c11dc1c418c1928a21d2267019949cc25286a6. They are placed after collect_frames and above the first test. They are not pub, and no other item is added.
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
- batch_full is stamped after a batch is assembled, and only if the stream is not cancelled; then the batch is sent: engine/src/stream.rs:2540-2570 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:d4cf9202255bf76dc7f220198195e98a0d5ec9384b4529db9e7fea9decb418eb
- The consumer sees the end only when recv reports disconnection: engine/src/stream.rs:782-797 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:7ae7b06c51312fe223d1ce00c7e4e090ea784c54472e5f31b783bf635a8cbf47. std's Receiver::recv contract delivers buffered items before it reports disconnection. The worker records rustc -V with the first run.
- Each collector stops at TAG_TERMINAL (0.4). So every batch_full stamp of a run drained to TAG_TERMINAL precedes that run's end, if the data plane sends TAG_TERMINAL only after its source ends. That link is not pinned here (§1).
- trace_spans.rs's quiesce answers streams dropped before their end (kernel/tests/trace_spans.rs:151-175 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:64467e755374eb4f881d31f2dd5576528ff36e55953c06122b4cfbd683f33e16). Neither test drops a stream early, so no quiesce is added.

Holding the lock across .await:
- A tokio test builds its own runtime and runs the body with block_on on the test's own thread. A test that is waiting for the lock therefore blocks only its own thread, never a worker of the other test's runtime. The guard is never moved into a spawned task.
- This is a library claim, about tokio 1.53.1 (lines 2068 to 2069 of the repository-root `Cargo.lock` at 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693) and tokio-macros 2.7.2 (lines 2084 to 2085 of the repository-root `Cargo.lock` at 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693). Before any code, the worker reads that macro's expansion at the locked version and stops on a mismatch.
- Clippy's await_holding_lock would name this hold. No workflow under .github/workflows runs clippy (search at 0c2be9cb). No allow attribute is added.

Portability (state/directives/PORTABILITY-2026-09-30.md, §2):
- R1: std's Mutex and the process-global flag behave the same on every platform. CI saw the race on ubuntu, and the fix is platform-free.
- R2 to R4: no OS-dependent feature and no cfg. R3 is not triggered.
- R5: no level is claimed.
- R6: nothing is ignored on any platform.

## §3. Fixtures

The two existing fixtures are unchanged: kernel/tests/wire_bytes_invariant.rs:60-75 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:08a300f4b5893859122a2edfd0d4c2683182feca1ee1fb77cf2a505efd2c18e5 and kernel/tests/wire_bytes_invariant.rs:267-283 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:f14ce10821d2f6ab077009cceaacba5a07a2465963002cfb7e02c61425ef3488. They are generated per run. Neither is the 5 GB fixture, and no hash is pinned.

## §4. Tests and mutations

For each mutation: apply it, run the named command, record each failure by name with the commit it was observed at, then revert. A verify-mutation run is never called a mutation's observation (round 25, item 2 (c)).

- Changed tests: the two in 0.4. New tests: none.
- M-1, the mutation of record for both changed tests.
  - The change: in serial(), after the lock is taken and before it returns, insert `std::mem::forget(trace::start(TraceKey::default()));`. TraceKey has a Default: engine/src/trace.rs:767 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:da031c27293af9dfb7493f0b3593dbd8b30695b5ae6a82e5971d082fe50eb36a
  - Run cargo test -p spatial-kernel --test wire_bytes_invariant.
  - Both tests fail by name at their opening assertion, with the messages at kernel/tests/wire_bytes_invariant.rs:175 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:08e304fed93b97ca099a9b25ffc0e84f28672afc8f507f4c3c1492c0eba19e4a and kernel/tests/wire_bytes_invariant.rs:380 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:08e304fed93b97ca099a9b25ffc0e84f28672afc8f507f4c3c1492c0eba19e4a.
  - This holds in any order. The first holder's start fills the slot, and the forgotten guard never clears it. The second holder's start is refused, and the flag stays on.
- M-0 is an observation of consistency with CI, not of CI's cause.
  - The change: in tracing_changes_no_byte_on_the_wire, replace drop(guard) (kernel/tests/wire_bytes_invariant.rs:194 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:095cbe584600cd1955dd4cc3e827bfb857ad17875d96b8154252bc51f922b524) with std::mem::forget(guard).
  - Run cargo test -p spatial-kernel --test wire_bytes_invariant -- --test-threads=1, and record the run order the output prints.
  - If the sibling runs first, it passes and the projected test fails at its opening assertion, which is 0.1's shape. Any other outcome is recorded as observed.
- The projected test's recorded mutation (the impact read's question 4).
  - The comment and its observation commit stay byte-identical.
  - It is not re-observed: neither the mutated site (engine/src/envelope.rs) nor the comparison its failure passes through (kernel/tests/wire_bytes_invariant.rs:415-435 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:91450b6a9f7601753ff8c7b49573e6d8353f576a8c46374ad382cf7a0801dbba) changes.
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
  - Verdicts follow AUTONOMY.md §22 as the product-first direction's section 2 replaced it (state/directives/2026-10-05-product-first-direction.md:15 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751).
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
- Heavy runs follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ 0c2be9cb4802cebe6e75aefb4cb8125fd61d1693 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1).
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

### Amendment 1 — the human's ruling on OPEN-1 (class 5)

*Written by the custodian after the human's typed rulings were received (08:37:12Z by the transcript) and before any code. It records the human's ruling on this form's open item. References only; nothing below is a quotation.*

1. **The ruling:** state/directives/2026-10-09-rulings-on-the-eight-forms.md:51-52 @ b4dc05e08c1e24ef7d6904596bb2332b87dcf75b sha256:3401a8f16e0b370aa4ffaa329cf79e0491d9f4b12eae3c7f2e7a9de30ca3d162.
2. **OPEN-1 is (1): neither sibling site enters this piece.** PLAN gained one proposed node for each on 2026-10-09: `first-batch-factorial-ignored-trace-tests` and `slice-traced-test-cross-stamping` (the latter with its own form). §8 item 10 stands.
3. **Superseded index:** the OPEN-1 entry → item 2. Nothing above is edited.
