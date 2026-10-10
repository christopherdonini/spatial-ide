# flush's cancel exit, and the pre-prepare exit, mark producer_cancelled
# (PLAN node stream-flush-cancel-exit-marks-producer-cancelled)

File: engine/STREAM-FLUSH-CANCEL-EXIT-PREREGISTRATION.md
Authority:
- the human's direction of 2026-10-10, item 1: state/directives/2026-10-10-flake-hunt-run-1-flush-cancel-exit.md:7 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:07cb9cae12091fae0e057e74a3126791bd25c0a8f1cc2ef629b21b34ab7a77bb
- the placement: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:36 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:b9d820912b82dca112a33a3ef86fa8a9cad3f81b4a709b07886834be56a62e6b
- forms ahead: state/directives/2026-10-10-docs-lane-slot-2-order-reaim-answers-strike-crs-wording.md:38 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:2eba54a30650266443f7bfd35cb1581b050063d7db93623b0ad2b648a7d92c4d
- both directives have RULED blocks in DECISIONS-PENDING.md
- the node: PLAN.yaml:4495-4511 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:116e6125fe448975b7e56b71b3f597d9f2fb0720959a0b14e481aa850dc6fb7b
- the sibling-search default: AUTONOMY.md:215 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:5fc1d41f0bad9f276ad4b4c845d4d5ddcdf9af27c467ade5ae83e626387cd2c1
Drafted by: the architect agent. Inputs:
- lead-data's impact read, state/consults/2026-10-10-stream-flush-cancel-exit-marks-producer-cancelled-impact-read.md (whole-file sha256 4357adab6581b0125c6855d8eead0c9593561af836dbabce834e41c88083d2cc);
- the second pilot's §2 (state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:17-21 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:f6bbbdad923bec96db7129da0a748c809b49f10c1cdd119bd8885a555eacd727).
Code was read at main f0fccfaf.
Committed before any code. No code starts before wire-bytes-invariant-trace-flag-race has merged. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a cancellation guarantee under ADR-018 and a property under test; §25(e)). See §0.9.
Pins: every pin is a historical pin at f0fccfaf. Wire-bytes edits engine/README.md and kernel/tests/wire_bytes_invariant.rs only, so no pinned code line moves before this piece. If one does, the worker re-derives the site by symbol. The pin stays authoritative for what it recorded; the tree is authoritative for the code the piece edits.

## §0. Disclosure

0.1 What was seen. In the flake hunt, run 1, at 116deb53, on Linux, engine/tests/slice.rs's cancelling_mid_stream_stops_production_promptly failed twice on two cores. Both failures were at its expect that the observed instant was stamped:
- the report: state/consults/FLAKE-HUNT-RUN-1-2026-10-10.md:39-74 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:86819ec673f2e0ee0e2dc0c987028cb6ce97c5573a5116f1a7c5731e248d802f;
- the expect: engine/tests/slice.rs:809 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:96c5cec9d8cbcd45a03afc78fdb948d5ab5bd39370af1200c014d2dc8cabe013.
- The two original failures carried no diagnostics. Their path is inferred from the message and the line.
- In the sandbox experiment, a sleep before flush's check gave 15 failures in 20 runs; the same sleep after the check gave 0 in 20 (state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/README.md:6-10 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:61606664670cc55f47ba490771d66a2e6e52e1f1a45b2a67d93ba85de4240db1). All fifteen printed dropped=0 and batches_after_cancel=1.
- The custodian's limit on the four events=11 runs: state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:55-57 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:7215627ac8745d6fe6053c7ffab59c9ba938dc117a895f58afdb7c99e489a966.

0.2 The exit:
- flush counts batches_generated and rows_generated, then its cancel check counts batches_after_cancel and returns Cancelled with no mark: engine/src/stream.rs:2536-2545 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:c1471d600417166aa33d527314a4c50b1f3e33d3c6abefa41d706864280903b7.
- It comes before FIRST_BATCH_FULL, BATCH_FULL and the send: engine/src/stream.rs:2550-2570 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:f831c6db250d07da7b01def78f68a9698b52ae1fe51d97ee0d2772c937b2dd9c.
- flush's four call sites:
  - engine/src/stream.rs:2016 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:a21bff59a79be9ebf87739deba9d4ad97651a72bde63daa0a719fe594874c0ab
  - engine/src/stream.rs:2065 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:a21bff59a79be9ebf87739deba9d4ad97651a72bde63daa0a719fe594874c0ab
  - engine/src/stream.rs:2101 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:a21bff59a79be9ebf87739deba9d4ad97651a72bde63daa0a719fe594874c0ab
  - engine/src/stream.rs:2121 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:b7355eab8867b4e7b08bec7d5269d117ea5f7a0259da98865502d977c78663b0
- Each propagates the error with `?`, so produce returns.

0.3 The five exits that mark:
- the execute guard's Cancelled arm: engine/src/stream.rs:1829-1832 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:db8ce733ecbfe55262cb217f9d39c64d9b6fe693722442f40435b614b7a66c3e
- execute Err under a cancel: engine/src/stream.rs:1838-1841 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:0334ac9efc6b5504f1f9b09e7ff93ab6460f2f6fd5d9be53dcd317a8066060b1
- the loop-top check: engine/src/stream.rs:1885-1888 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:b8abc914302f837b08463999e7969a0fcbd6e7622255e4cdd2120441899908ac
- a fetch panic under a cancel: engine/src/stream.rs:1918-1921 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:84c0e6b1fda7228f0a808e21ae49590f519a56d05e5f830b2c7277b9aa8a0b45
- the per-row check: engine/src/stream.rs:1975-1988 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:c2d2d39671970ddae332fa623c66c8eaf76585f46d947a864e0117e1ead7fdbc
- The per-row mark's origin is recorded at kernel/RESULTS.md:3253-3256 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:dbc5d334079ae6ba4321cd3ed600b88e9bdea6beeda44b70d4cde4cdb28de572.

0.4 The event and the budget:
- PRODUCER_CANCELLED: engine/src/trace.rs:440-441 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:f40bd706165a64136b7312cfbea74930f101c659873c7a912e5d9f4510aae362
- It is the producer's cancel_observed: engine/src/trace.rs:380-384 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:2f15e44a3595aa1a42cfe46d2c7c9063410a2419875de81a933b73c04a46aacf
- docs/08 scores the budget on requested to observed, on the producer's clock: docs/08_Testing.md:8 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:1185356552cbb402306f649f0c38dd4f85c109e86a2a64b34c12009d3e6ea558
- ADR-018 is Accepted: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:3-5 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:4082fae8687782be69d827890522af1a5eb8cbf73eb506675ba3a50a8aa75635
- cancel_observed means the worker loads the flag set and stops advancing: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:46 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:ee8ca11cf4c5ed0ff2a728f8e5cb0c4e20df9d567c97fa47c7942f6aa7d0f5c9
- The design note's frozen instants: kernel/CANCELLATION-AND-TRACING.md:44-53 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:4fb5abbb527452018e650bc893f94f844f29dc457a8126305ec788c236efac16

0.5 The request instant and the drop:
- cancel stamps CANCELLATION_REQUESTED once, after it publishes the flag: engine/src/cancel.rs:120-124 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:e71f1fbaf0e76420626fc5288c962acd24e3a7701010171d8ec65278e3937d91
- cancel_for_drop sets the flag and stamps nothing: engine/src/cancel.rs:113-115 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:855021fc659e24c2e4fc2ec4d8cd3d6e30a6d130110080aefd72bd7b3e102e1f
- Its one caller is BatchStream's Drop: engine/src/stream.rs:885-895 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:59e6fb89cc203213ddb0853675f55cda4ef24770e83d455f60b53a4c473196bb

0.6 The tracing stance this piece keeps:
- tracing is not cfg(test)-gated, and enabling it must not change which code is measured: engine/src/trace.rs:26-32 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:00adf442583d90955fb57f411c3a9e53098ce5b39eb5adfaba5d8a1f574f2d28
- no mark inside a per-row loop: engine/src/trace.rs:34-37 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:2f8c3e34e5ff346e62a7d7906800e95a7909f805a04e66971bbf883e7d0e6b69
- one process-global slot: engine/src/trace.rs:90-98 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:8c1d47840decf4cd1dccfaac02ed1f36c4dd22c77a219d1185c8687fb1a80e3d
- the unit tests' lock: engine/src/trace.rs:727-732 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:ec8a5bbd2c92a02dda09ee0049146dd91a858319a638cf4b9eecdabc18416bdc
- start has no product caller: kernel/src/lib.rs:613-618 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:55858a1149fa4dee7d87a045fdfad26920bdadf7dd0ab2c643d2cded4edd97fa

0.7 An earlier record of this exit: kernel/TIMING-ASSERTIONS-UNDER-CONTENTION-PREREGISTRATION.md:76-81 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:a960445ece2ca5894fd08d5b927b6fec4520099fbd6d816d50daeb9744d19206.
- slice.rs's budget assertion is kept by round 53 (B-keep), with its re-run practice: state/directives/2026-10-04-round-53-open-1-ruling.md:6-7 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:ebf502fb79d55138fb81ab3de5077abd527b4714ac67a452ba76eb0ff3df9bf7
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
  - any docs/08 verdict, figure or rescoring. Earlier results are not rescored (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:125-129 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:41613b9bfcbf1d16d771c6769e5207a8270bae606ab3d665b2be5c51c5acfeb6);
  - anything about the out-of-scope sites (§2.3).
- No ADR is amended. docs/08 and kernel/CANCELLATION-AND-TRACING.md are not edited. There is no wire, SKP, MCP or data-plane change, no user-visible string, no new pub item and no dependency.

## §2. The change

2.1 engine/src/stream.rs, product code: two lines and their comments.
- C1. In flush, inside the `if cancel.is_cancelled()` branch (0.2), and as its first statement: `crate::trace::mark(crate::trace::PRODUCER_CANCELLED, 0, 0);`. Then, unchanged, the batches_after_cancel increment and the return.
  - The H2 comment gains at most two lines, by symbol and with no path:line: this is a cancel_observed exit, stamped like the others.
- C2. In produce, inside the pre-prepare check (engine/src/stream.rs:1780-1782 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:bb98dabe01b8c4954873c482bf62b1d161ba611aae9f7a4eb442a763cac23ad7), before the return: the same mark, with a one-line comment.
- Nothing else in product code changes: classify, the send's error arm, the counters, their order, H2, cancel.rs and every product item of trace.rs stay as they are.
- Cost:
  - each mark sits on a branch that returns, so it runs at most once per stream and never per row, as engine/src/trace.rs:34-37 requires;
  - disabled, it is one relaxed load, on that branch only.

2.2 engine/src/trace.rs, test scaffolding only.
- TEST_LOCK moves from `mod tests` to module level as `#[cfg(test)] pub(crate) static TEST_LOCK`, with its doc. trace.rs's tests keep using it through `use super::*`.
- It is compiled into no shipped build. It serialises a test, not the instrument, so the stance in 0.6 is unchanged.

2.3 Sibling search (AUTONOMY.md:215).
- The defect class: the producer loads the cancel flag, finds it set, and returns Cancelled without stamping PRODUCER_CANCELLED, so ADR-018's cancel_observed has no end instant.
- The custodian's list is at state/consults/2026-10-10-flake-hunt-run-1-custodian-check.md:28-37 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:e909483f580dee5645d4dc2c007952a917b7d9aaea203ad7837e53b4f73b73c9.

| Site | Class | Scope | Reason |
|---|---|---|---|
| flush's check (0.2) | in | in (C1) | the node |
| the pre-prepare check (engine/src/stream.rs:1780-1782 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:bb98dabe01b8c4954873c482bf62b1d161ba611aae9f7a4eb442a763cac23ad7) | in: a direct load-and-return | in (C2) | a deterministic in-crate test reaches it with no seam (T-2), and it is a second route to skp_filter_cancellation's unretried panic (§2.4) |
| prepare Err through classify (engine/src/stream.rs:1784-1786 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:1f6866b74430c28445959c7901442ac5d5c4cfd96b567cf420bd62570bfca6ec) | in: the load is inside classify | out | not reachable by a deterministic test without a seam: the flag must turn from unset at the pre-prepare check to set inside prepare |
| the two-read window in the marking classify arms (engine/src/stream.rs:1838-1841 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:0334ac9efc6b5504f1f9b09e7ff93ab6460f2f6fd5d9be53dcd317a8066060b1; engine/src/stream.rs:1918-1921 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:84c0e6b1fda7228f0a808e21ae49590f519a56d05e5f830b2c7277b9aa8a0b45; engine/src/stream.rs:2573-2579 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:263373ed439c59df863ad2a407364319dd85e20a7ae7add17f31d5a13257b362) | in | out | cancel publishes the flag before it interrupts (0.5), so an Err or panic caused by the interrupt always reads the flag set at the first read. The window opens only for a non-cancel error that races a cancel between two adjacent loads. Closing it means restructuring classify and the two marking sites cut/sql-filter P4 added |
| the send to a gone receiver (engine/src/stream.rs:2561-2570 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:5f1d136b384553d6a910a0f6a7bb9cfb1cff96cf12c702cddcf53f9ac303e071) | not in: no flag is loaded; the producer sees a disconnect | out | whether a disconnect is an ADR-018 observation is a question for that node's form. The parked send does not watch the token (kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md:53-55 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:0e326ff90ce8052679eea7dc63541729c7d1a78591d5a57d47d74ec2a5cc1fac) |

- The custodian records one proposed node, engine lane, depending on this piece, for the three out-of-scope rows. Its form chooses between a classify that marks when it returns Cancelled and a seam, and says whether a disconnect is an observation. This follows the precedent of engine/CANCEL-BEFORE-EXECUTE-PREREGISTRATION.md, §2 item 4.

2.4 The four kernel tests (the human's item 1), read from code.
- None of them is edited, and the fix changes nothing any of them asserts.
- **trace_spans, a_successful_run_stamps_no_cancellation_instant**: it cannot hit the gap. The absence assertion (kernel/tests/trace_spans.rs:355-358 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:36bb75f5709143b73957c22c2b21935440bcd1d839601a812ee41e7b32b38970) stays true after C1 and C2.
  - The run drains next_into to None (kernel/tests/trace_spans.rs:340-345 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:6bea2f8a52ce818a69b63ac870ed091177e9f30deb80ceaea0d06ddfc76c7703).
  - next_into returns None only on disconnection (engine/src/stream.rs:782-797 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:7ae7b06c51312fe223d1ce00c7e4e090ea784c54472e5f31b783bf635a8cbf47), and the producer drops its sender only after produce has returned (engine/src/stream.rs:1254-1385 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:1878bf16baf56a402a4351be43c373c7f09392e0513c483fdfd7bda218e1a52e). So no flush, and no pre-prepare check, runs after Drop's cancel_for_drop.
  - A straggler from another test in the binary stamps before its lease returns, and the lease is decided only after produce returns (engine/src/stream.rs:1292-1295 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:49158d66ff8f60d0a6c782b0c230a99b42b939e50b09a1660f7a8f61073297cb). quiesce waits for the lease (kernel/tests/trace_spans.rs:163-175 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:0938df04b06c64165624b5fd2ea04c739e7510f80c6275218a3b12efbbc23d1d) under serial() (kernel/tests/trace_spans.rs:145-149 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:34df4f7d5e01eb83a92a658e40c11dc1c418c1928a21d2267019949cc25286a6).
  - C1 and C2 fire only with the flag set, as the per-row and loop-top exits already do. They add no route those exits lacked.
- **first_batch_factorial, the two ignored measurement passes**: they can hit the gap.
  - Each takes two batches, then cancels (kernel/tests/first_batch_factorial.rs:1336-1343 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:d60476dd9390f37d1eb58db47476c9cf2ca53c3df76eb7bd3098f87f9d114e6e). The producer may then be assembling a batch, with a queue of MAX_QUEUED_BATCHES = 2 (engine/src/stream.rs:85 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:4bf4b68e73d54fec88522479beb446850f79e3c73c008573a1069894f72bda0f).
  - If it leaves by flush's exit, segment_ms is None (kernel/tests/first_batch_factorial.rs:1353-1356 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:daac1262bb7302ffca9e25aef58d1e80d48c1c3d95207a3b852b1815fc75ace9). That trial is dropped from the sample (kernel/tests/first_batch_factorial.rs:1367 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:86ad7fc5888d6c96e5da932ef3a4c1c01ba12caa39a633310c9356b3d0f3f8f8), and the assertions fail only when every trial misses (kernel/tests/first_batch_factorial.rs:1389-1399 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:6046901b557024a9ba026f35ff908334d140721cf1f9de7437f5114ec8d7c1b6). The H5 twin is the same (kernel/tests/first_batch_factorial.rs:1487-1490 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:daac1262bb7302ffca9e25aef58d1e80d48c1c3d95207a3b852b1815fc75ace9).
  - So the gap thins the sample by exactly the trials that were observed during assembly. After the fix those trials carry a span.
  - The passes are not re-run here.
- **skp_admission, cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock**: it can hit the gap; it has not been observed doing so.
  - It grants credit 2 (kernel/tests/skp_admission.rs:865-871 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:e8246ba3e40aaf359ece63107e161d407c5c279c207de4abf8403954aca2da14) and cancels after the first batch frame (kernel/tests/skp_admission.rs:888-891 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:e3d9ca52da2bd32406a7816da1477113aec5ba275d3cf1715c7c7048d646222b).
  - Several batches can be in flight ahead of the client (protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md:184-188 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:fb6ca456db4c4eced8d64824da9ae18a8d9c727d1353bcef492cedff3fcf127e), so the producer can be assembling when the cancel lands.
  - A missing stamp panics and is not retried (kernel/tests/skp_admission.rs:926-931 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:1b4085953a3c0d7cc9f349a061eef79a14dcf9067d9a7a9968192330c69ed002).
  - After C1, the new mark is subject to the ordering race the retry already handles (kernel/tests/skp_admission.rs:766-778 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:65a166e59ae6d280b8c59a443c3fa83766ccf87998748b8226b956b52444f3ff), as every other exit is.
- **skp_filter_cancellation, cancel_reaches_the_producer_during_a_late_matching_filtered_scan**: it can hit flush's exit only if the scan reaches its matching tail before the cancel lands.
  - It cancels after TAG_OPEN (kernel/tests/skp_filter_cancellation.rs:228-243 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:143cf6f711f2ef8e378c5d478c0056b2df39f3011b462672e54825a29b101fe7), and its expected exits are the two classify marks.
  - It can also hit the pre-prepare exit (C2's site) if the producer has not passed that check when the cancel lands. When the kernel creates the stream relative to TAG_OPEN was not read for this draft.
  - Its missing-stamp expect is unretried (kernel/tests/skp_filter_cancellation.rs:269-274 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:7501e797b2b64f6082560ca7c9aab09a35ddedb3cbb34d84eea94942e545a2f7).
  - Routes left after this piece: §2.3's prepare and window rows.

2.5 ADR-018 item 4, for the section this exit now ends (docs/adr/ADR-018-what-cancellation-acknowledged-means.md:78-88 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:d25698d56329e26cf6bf8ab59cba7c5ef6d9eb19893aa9d1ac8fed312c66d628).
- From the last check before the cut to flush's check, the section is in-memory work over one batch (engine/src/stream.rs:2492-2539 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:89ff6225fd428df3e3e004e72a6ebdd9db7d845d7755f799f32c21da64f5d0a2). flush's own head refuses a batch above MAX_BATCH_BYTES (engine/src/stream.rs:2473-2490 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:9e3291b5bbdf0853b33fe49d3995e83fb351d841871c1c9f1604a55d40a8e772).
- This is class (a) in bytes only, and no time bound is derived. Scheduling is class (b), as everywhere (kernel/CANCELLATION-AND-TRACING.md:99-106 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:b43f82ba11078fa8b1c366e16dde19edfb2caecc62993813bb499fee0f8112d6).
- At the stream-end call site (engine/src/stream.rs:2121 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:b7355eab8867b4e7b08bec7d5269d117ea5f7a0259da98865502d977c78663b0), the section also holds DuckDB's last fetch, which is class (b) (ADR-018 item 5).
- Before this piece, the interval had no end on this path. No bound is claimed after it.

2.6 Runs that stamp the event with no request (the impact read's question 3).
- These are a stream dropped (not cancelled) while its producer is assembling, or before it reaches the pre-prepare check. Drop sets the flag with no stamp (0.5).
- The loop-top, per-row and guard exits already behave this way on a drop. segment_ms returns None when the request is absent, so no figure is derived from such a run.

2.7 Seams. The diff crosses no module seam: the kernel tests are read, not changed.
- The rejected alternative is a product seam, such as the experiment's trace-gated sleep or a cfg(test) hook between the per-row check and flush's check. A trace-gated sleep would change which code is measured. A cfg(test) hook would prove the property about a build nobody ships (0.6). §4 needs neither.

2.8 Portability (state/directives/PORTABILITY-2026-09-30.md:33-65 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:858fbe6132793c3558641015f865790dd3845749591c18b495a955b7fd2944ff).
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
  - It builds a one-row Pending: one polygon and one Int64 run over the module's one_attribute_envelope helper (engine/src/stream.rs:2901-2918 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:3d364a6cbadc590fdf02b8b6db60656ef6afbfd3f57f2c9c884df8add6cfe816).
  - It starts a trace, cancels a token with cancel(), and calls flush with batch_index 1.
  - It asserts:
    - (i) Err(EngineError::Cancelled);
    - (ii) batches_generated and batches_after_cancel are each 1;
    - (iii) the receiver holds nothing, and resident_bytes is 0;
    - (iv) PRODUCER_CANCELLED is present;
    - (v) the requested-to-observed segment is Some.
  - Why (iv) is unambiguous in this binary:
    - only produce and flush stamp the event (0.3);
    - the binary's only real streams drain uncancelled tokens to disconnection (engine/src/stream.rs:3134-3136 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:7ff1f0d4edb067d30deb52c262e26c88bb3e2697e974b4ae2bca647630c5bda3; engine/src/stream.rs:3229-3231 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:f171b03d166e68b1fbaf1f455c7937af6836a50be2562a5eadc576cc700e215b);
    - other in-crate tests do stamp other names (cancel() in pin.rs, index.rs and cancel.rs), so the test asserts no absence and no exact list.
  - **M-1:** delete C1's mark. Run `cargo test -p spatial-engine --lib flush_cancel_exit`. Predicted: T-1 fails by name at (iv).
- **T-2, in the same module.** Proposed name: `the_pre_prepare_cancel_exit_stamps_producer_cancelled`.
  - It takes the same lock, starts a trace, and calls produce with a token cancelled before the call, an in-memory connection and invalid SQL.
  - It asserts Err(Cancelled), batches_generated 0, and PRODUCER_CANCELLED present.
  - The invalid SQL makes C2 the only possible stamp: without the check, prepare fails and classify returns Cancelled unmarked (§2.3). The test's doc says that a later piece that marks classify must revisit it.
  - **M-2:** delete C2's mark. Run `cargo test -p spatial-engine --lib the_pre_prepare_cancel_exit`. Predicted: T-2 fails by name at its presence assertion.
- **Changed tests: none.** No sleep, retry or timeout is added to any committed test.
- **E-1 and E-2, conditional on OPEN-1 (a).** The patch puts a 20 ms sleep, active only while a trace is enabled, immediately before flush's check: phase B's placement per state/consults/FLAKE-HUNT-RUN-1-2026-10-10-logs/README.md:8 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:ecb2fd07334eed7faf34b5c35aec1c3e0bf83fed47fa5971b240545ef242ab13.
  - E-1 runs on a worktree at B with the patch. E-2 runs on the piece's worktree at H with the patch.
  - Each runs `cargo test -p spatial-engine --test slice` 20 times, one shared hold per batch of runs.
  - A run counts only if it fails at the expect of engine/tests/slice.rs:809 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:96c5cec9d8cbcd45a03afc78fdb948d5ab5bd39370af1200c014d2dc8cabe013.
  - A failure at the budget assertion (engine/tests/slice.rs:815-818 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:068fe63b3753c60052e4b9815a83d3df5d1ebab7d0cdf19642e0c0bdb2017a1b) follows the round-53 practice and the machine rule: it is reported, re-run alone by the custodian, and not counted.
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
  - Verdicts follow state/directives/2026-10-05-product-first-direction.md:15 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:8c0e4e3f404b413db3e506411f401880baf9681ac8dd67362dfba73c20d7b751.
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
- **Heavy runs** follow the machine paragraph the briefs carry (state/directives/2026-10-06-machine-script-adopted.md:12-22 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:7350977156bed7c94b0da4e8db806ba34c25c6678e65c46447a62d791ba9e8e1). E-1 and E-2 run in shared holds. Nothing here is a timed measurement.
- **Merge:** a merge commit, never a squash.
- **Operator:** none.
- **Owner's-index update before the final gate** (the second pilot's §1, item 2: state/directives/LEAD-DATA-PILOT-V2-2026-10-05.md:12 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:6baf1cbfb7e93952f2c41c71be144cafc5c06ced596e2b8f4d3db5410b42821c). lead-data writes it, the worker applies it in this PR, and the final review checks it against the diff. It sits on top of wire-bytes' engine entry.
  - engine/README.md, Owner's index:
    - Interfaces this module owns: the spatial_engine::trace entry wire-bytes adds gains PRODUCER_CANCELLED (ADR-018's producer-side cancel_observed), pinned by T-1 and T-2;
    - Governed by: this form, in the preregistrations list;
    - Last verified at.
  - kernel/README.md: no change.
- **KNOWN-LIMITATIONS:** no item is owed. The event is instrument surface with no product caller (0.6), and the residual sites of §2.3 are carried by the proposed node.
- **Overlap, rule (00):** the files are those in §7, with no protocol/ path. At dispatch, the custodian checks that no in-progress piece or PR awaiting merge touches engine/src/stream.rs, engine/src/trace.rs or engine/README.md.
  - module-docs-stale-statements (docs lane) edits engine/README.md's body. That is the same file as this piece's index update, so the two are sequenced. It cites engine/src/stream.rs:999 only as evidence and edits no stream.rs line.
  - dataset-stream-doc-producer-runs-ahead concerns Dataset::stream's doc (engine/src/stream.rs:898-899 @ f0fccfaf6814c6993462853211ba20f7c8cdab31 sha256:928bf3becb50f4f2abf16cc0ee6e77845f9c6b7e2c07f8be1001fcb19cf47fa2).
  - Neither node's sentence is moved or contradicted by this change. Both cited lines sit above every insertion, so neither cite shifts.

## §10. Amendments

(opens empty)
