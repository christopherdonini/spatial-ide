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
  - h2_a, the whole test: kernel/tests/end_to_end.rs:431-463 @ 61f7e64b sha256:66a648ab85e57e6c9d4590b32b938623cbd77ad63367941ada13ec079d9c0911
    - No credit; a 50 ms sleep; the client's instant; then the CANCEL send: kernel/tests/end_to_end.rs:439-443 @ 61f7e64b sha256:7619e0be7eba4e9f05742212dd3ec894dfe0ec60589ca2df71469b7756b4bce8
    - The span is the adapter's observed_at minus that client instant: kernel/tests/end_to_end.rs:451-456 @ 61f7e64b sha256:a8e391a8bfb0a6919d712d9170ddb454d653634090b43a3880e382a4a70d97d6
    - The bound, 100 ms: kernel/tests/end_to_end.rs:457-460 @ 61f7e64b sha256:1e8cbe5ebf5da3855c8182463c97905c777e398e33e38b27a505fa849ecedcbc
    - Its source is docs/08's number, invoked by the comment: kernel/tests/end_to_end.rs:433-434 @ 61f7e64b sha256:e1a58e33328288b9157fc6361f18659d729babd1b70015808a28695ba6128df5
    - The end instant is stamped by the adapter's reader on parsing CANCEL, before the engine's token is cancelled: protocol/data-plane/src/adapter_ws.rs:130-137 @ 61f7e64b sha256:a4e18733766a086bc9ef8c16cd4f73756801577f177b3379d9ab574658302f65
    - It is documented as the binding's observation on its own transport: protocol/data-plane/src/transport.rs:150-152 @ 61f7e64b sha256:d2142cbb5276418cfe508e2c74504ebde1724d367bcdcf8a3b1724f4bd8febaf
  - slice.rs, cancelling_mid_stream_stops_production_promptly, the whole test: engine/tests/slice.rs:755-842 @ 61f7e64b sha256:f5a522db45c947c4a2077766180aaed6b59716a17ec8ed0cdfedf28c43168684
    - The span starts at the product's own CANCELLATION_REQUESTED stamp: engine/tests/slice.rs:788-791 @ 61f7e64b sha256:fd013ad84a00a67602f087a3e9f582ce8474627d69e5eac783615d6093e7b7af
    - It ends at PRODUCER_CANCELLED: engine/tests/slice.rs:808-809 @ 61f7e64b sha256:491afe351a0a1ac278966107f0478016ef1d4dfc9471a2d496fa8bf340bbc4a1
    - The bound is docs/08:8's 100 ms: engine/tests/slice.rs:811-818 @ 61f7e64b sha256:f74d57a382588018d404af1bb09172b515bb1c6cb5e6dee3fc0db11d2c71d62c
    - The acknowledged term is reported, never asserted: engine/tests/slice.rs:820-832 @ 61f7e64b sha256:8d7cc74b26779cc1e193f0a069b952800b31d42ef789ca464b0a7908a765f3b6
  - Every other timing figure in either test is a liveness bound or a wait, not a budget.
    - slice.rs, the liveness precedent: engine/tests/slice.rs:732-735 @ 61f7e64b sha256:997867141bd0555e724c4406c078c03fccf6e15b3fe88681515caa929444a879
    - slice.rs, TEST_DEADLINE: engine/tests/slice.rs:78 @ 61f7e64b sha256:040dc627635d07bc185fa4ffb4498db257772b2f1596c08bdb9155934f1d75a2
    - end_to_end.rs, RECV_DEADLINE: kernel/tests/end_to_end.rs:225 @ 61f7e64b sha256:5138d15cb76f0e6e80e1135e8dadb6645b14dfc0c0a270bd593e763ffae08e53
    - end_to_end.rs, the sibling's 5 s bound: kernel/tests/end_to_end.rs:423-426 @ 61f7e64b sha256:7a356cab9bf39eaa0c4c942708737c838bf0da247cf6b2376ba70ee6f26e4785

0.2 What docs/08 and ADR-018 score.
  - The row: docs/08_Testing.md:8 @ 61f7e64b sha256:1185356552cbb402306f649f0c38dd4f85c109e86a2a64b34c12009d3e6ea558
  - Reference hardware: docs/08_Testing.md:11 @ 61f7e64b sha256:1df4ead111e0e3eef75474dd27a412142f6f157861259d28ac5cbea5d86dd0f6
  - Enforcement owed, not operating; CI is not a reference profile: docs/08_Testing.md:13-21 @ 61f7e64b sha256:2f4b25f8f53d7da1c196295e6935553f6e30cd6766172ab7ab06133d3f13f1de
  - The instants: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:41-50 @ 61f7e64b sha256:0cad6778dab4a42c5c13739e462203f7334cec25373d869f462f5afef511583c
  - The scored pair, on the producer's clock: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:56-59 @ 61f7e64b sha256:1de8b1c741c6202979d1a1f8972719f5c80e64d75d5937c45984bfc6e8623eb0
  - p50/p95 carry the verdict; max is reported: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:67-76 @ 61f7e64b sha256:86e6ef3a045c8389e00a7e302dee0ea0778a17956da2e3bb38906b7da7240b35
  - No retroactive rescoring: docs/adr/ADR-018-what-cancellation-acknowledged-means.md:125-129 @ 61f7e64b sha256:41613b9bfcbf1d16d771c6769e5207a8270bae606ab3d665b2be5c51c5acfeb6
  - Producer-side cancel_observed is PRODUCER_CANCELLED: engine/src/trace.rs:380-383 @ 61f7e64b sha256:554a65dd208f7686fc726254e4c65ff686da479387dcc8465f366dc94621608c
  - docs/08:8 budgets requested → PRODUCER_CANCELLED: engine/src/trace.rs:445-446 @ 61f7e64b sha256:0069fc59b007d4bfd13f6d9e4f30ec61cf4948c4c6cb0a845697b0ce1767847d
  - A single sample in a parallel debug suite is not a docs/08 measurement: no p50/p95, no reference profile, no defined dataset.

0.3 Classification (this form's reading; h2_a's half is OPEN-2's question).
  - slice.rs:815-818 enforces docs/08:8 on its declared pair, and question round 5, item 3 ordered it. What happens to it under contention is the human's (OPEN-1). Its §2 Part B is conditional.
  - end_to_end.rs:457-460 asserts docs/08:8's number on an interval no docs/08 row scores.
    - The interval starts before the cancellation call, at a client instant, and ends at the adapter's receipt, before the engine's CancelToken::cancel. That cancel is reached through: kernel/src/lib.rs:701-705 @ 61f7e64b sha256:2131edaabfafbad04e7c4275752f8e44594a32a21c7eaa9fac1e083369c26f9f
    - It is the class question round 25, item 1 (a) rules on, and the shape slice.rs's own precedent retired: engine/tests/slice.rs:697-706 @ 61f7e64b sha256:daad6354d43a9f5c3502dd43bd44b82e9a43e430886805ba6e3561208373173a
  - Part A1 is conditional on OPEN-2 only to confirm this reading.

0.4 docs/07's credit. Sub-line span; the hash is the whole line's: docs/07_Roadmap.md:21 @ 61f7e64b sha256:7be5cd1b600e2575527d64e8b297dc69fa789dd24046564a22ba7ade9a14d6d3
  - It credits end_to_end.rs's two h2 tests with a CANCEL control frame reaching the source and being observed producer-side, end to end.
  - That property stays asserted under Part A: the terminal is TERM_CANCELLED and observed_at is present. docs/07 is not edited.

0.5 Recorded failures. Each report is pinned at 61f7e64b; the lines inside a report are at that report's reviewed commit.
  - h2_a failed twice under concurrent load, at 252.7 ms and 163.6 ms: state/consults/2026-09-27-exposure-profile-paths-closing-round-worker-report.md:20 @ 61f7e64b sha256:8e097af5a8358cca11e23137acb3a9cd352948b20b13c86ddf3c974fa4bff3ac
  - The same failure is disclosed in: scripts/hooks/EXPOSURE-PROFILE-PATHS-PREREGISTRATION.md:739 @ 61f7e64b sha256:250c192739692b7f195247d600c7c7f2edda1bfbe092b82366ff602a5a2518ff
  - Passed under another gate's load, and 5 of 5 alone: state/consults/gates/2026-09-27-exposure-profile-paths-gate3-reviewer.md:143-150 @ 61f7e64b sha256:3aa6a331604e3a3ed51ec373511e169c12918dbf260c328ae925d20ba4bc3b8f
  - slice.rs failed at 101.33 ms during a concurrent DuckDB build: state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md:171 @ 61f7e64b sha256:08f6a3e48814123a2305e1243a052e9a2de6e02020308aefd7c653f9cbaaf211
  - Custodian, before committing, in the words form, with no hash:
    - Resolve line 399 of kernel/tests/end_to_end.rs at 4155fcf21c784e64ad8daea06fbb819c1e79b426 to h2_a's assert! (today end_to_end.rs:457).
    - Resolve line 683 of engine/tests/slice.rs at c9ec02e32cb36a64a446424f6db2f4584cacdefc to cancelling_mid_stream's assert! (today slice.rs:815).
    - STOP on a mismatch. The pins are historical; the 61f7e64b tree is authoritative for every current cite.

0.6 HYPOTHESIS H-W (h2_a; from reading code, not observed): a CANCEL waits unread while the source is created.
  - The handler awaits factory.create in spawn_blocking before any reader exists: protocol/data-plane/src/server.rs:501-508 @ 61f7e64b sha256:00870fbf2467e13522aa44d91ece769eb821e7d1a6678ebd9a6024bd8bc9d8b2
  - The StreamState is recorded only after create returns: protocol/data-plane/src/server.rs:545-546 @ 61f7e64b sha256:6c8fac6735b86566aae8c6f606b72ca9f9eeea8349ff8f30e8f74b95e08f6a1b
  - When creation outlasts h2_a's 50 ms sleep, the interval contains the rest of creation. Load stretches creation.
  - Discriminator: Phase R, R-3 and R-4 (whether the registry is empty at the client instant).

0.7 HYPOTHESIS H-S1 (h2_a; from reading): plain scheduling.
  - h2_a is a #[tokio::test] with tokio's default current-thread runtime. The client, the server handler and the adapter's reader share one OS thread, so OS descheduling under load lands inside the interval.
  - Same-clock comment: kernel/tests/end_to_end.rs:12-14 @ 61f7e64b sha256:23403a89b4020fbc4ab96e2decb89812aee75e3833eab9b4c762cd0803b53d33
  - Discriminator: R-4, a run at or over 100 ms with the registry non-empty.

0.8 Why PRODUCER_CANCELLED is not asserted in end_to_end.rs.
  - The trace is process-global, one traced stream per run, and end_to_end.rs's tests run as threads in one binary: engine/src/trace.rs:90-98 @ 61f7e64b sha256:8c1d47840decf4cd1dccfaac02ed1f36c4dd22c77a219d1185c8687fb1a80e3d
  - On h2_a's backpressured path the producer can return Cancelled without stamping:
    - engine/src/stream.rs:2452-2457 @ 61f7e64b sha256:abb22a55352e91839b2a1bfc943b81e66d4ef077316e6a147b89dcf60e41fb51
    - engine/src/stream.rs:2471-2482 @ 61f7e64b sha256:38bb8aa2144230783eada5dc3acdfc70764f1626fd7f94821018c2fb05a35261
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
  - Assert requested <= observed, with skp_admission's retry for the known flag-before-stamp race: kernel/tests/skp_admission.rs:766-778 @ 61f7e64b sha256:65a166e59ae6d280b8c59a443c3fa83766ccf87998748b8226b956b52444f3ff and engine/src/cancel.rs:120-124 @ 61f7e64b sha256:e71f1fbaf0e76420626fc5288c962acd24e3a7701010171d8ec65278e3937d91
  - Assert requested → observed under 5 s, as liveness: kernel/tests/skp_admission.rs:941-948 @ 61f7e64b sha256:451dd95a96f8b9499174f885963b9d3d545c13e932596b2929bb8d273c1222a7
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

- h2_a: fixture("h2-early", 60_000): kernel/tests/end_to_end.rs:435 @ 61f7e64b sha256:57c9e31fff98c28e4ff2a7be7626b66959899b1eeea4c0fc16fe033d1fe22bbc
- h2: fixture("h2", 60_000): kernel/tests/end_to_end.rs:382 @ 61f7e64b sha256:f426e15148d9ff092a96afb8b5ae69eae6ff5c4ac1a9e288ffcb819a045bfca1
- slice.rs: write("cancel-mid", 40_000 features): engine/tests/slice.rs:758-764 @ 61f7e64b sha256:7bc38a691a58292891d565071a8053697d40b61ad382a7ea076404c4348ae0a3
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

### Amendment 1 — the ruling rows for OPEN-2 to OPEN-4 (class 5; D-3)

*Written by the custodian before Phase R's outcome, after question round 52 was answered (its RULED block in `DECISIONS-PENDING.md`). Class 5: each ruling narrows this form's conditional branches to the one it selects. Every part selected here is already declared in full in §2, §4 and §7, so no undeclared work is added (not class 9). Rulings are cited by round and item. The one typed ruling is referenced by its filed path, not reproduced.*

- **OPEN-2, round 52, item 2:** No, h2_a's assertion is not docs/08:8's row. Part A1 is selected. The branch in which h2_a joins OPEN-1 is closed.
- **OPEN-3, round 52, item 3:** a red-line item, ruled in the human's typed words, filed at `state/directives/2026-10-04-round-52-open-3-ruling.md`. Its condition (OPEN-2 is No) is met. Part A2 is selected, with the function name kept and the one-line comment §2 declares. The branch excluding the sibling test is closed.
- **OPEN-4, round 52, item 4:** option (1). The harness node is appended to PLAN as proposed, by id `slice-budgets-cancel-cells-on-trace-pair`, depending on this node. No code lands under this form (§7, unchanged).
- **OPEN-1, round 52, item 1:** held for Phase R. This is a hold, not a ruling. Part B stays unselected, slice.rs is unchanged, and the row follows its typed ruling.
- **Unchanged:** Phase R, §5's predictions and routing, and §8. Part A1 and Part A2 code still waits for Phase R's consult and its routing record, and lands on no STOP (§8 item 2).

**Superseded index.** None.

### Amendment 2 — Phase R's routing record (D-2) and its class-2 results

*Written after Phase R's outcome was seen, by the custodian. The evidence is the Phase R consult, `state/consults/2026-10-04-timing-assertions-under-contention-reproduction.md` (whole-file sha256 9a29dda13266c301b5e3f783d92418159be027f4140c1d67e76e6b50ab65ef71, run at 201f833e, whose code trees equal 61f7e64b). It is cited by section, and nothing below is a quotation.*

- **The routing (§5), class 1:** STOP, W and C are all not triggered (the consult's §7), so no node arises from Phase R. The deciding rows are R-1 to R-4 for STOP, and R-4 for W and C, where no run reached 100 ms.
- **R-2, class 2:** its count prediction is missed. Under L, 0 of 20 runs failed, against a prediction of at least 1, so the line clause has no failure to bind to. §5 classes such a miss without STOP as class 2. The recorded failures in §0.5 were not reproduced under this one load, and that is not evidence that they cannot recur (§1).
- **R-4's H-W clause, class 2:** untested, because no run reached 100 ms; the largest client pre-send to adapter receipt was 43.529 ms, in a run with registry_empty true. H-W stays a reading of the code, neither confirmed nor refuted.
- **R-5 to R-7 route nothing (§2).** They are OPEN-1's evidence. The budgeted pair stayed in microseconds in all 40 single-test runs, alone and under load. The unmodified assertion passed in all 5 whole-binary runs under load.
- **Unchanged:** Part A1 and Part A2, selected by Amendment 1, may now be written (§8 item 2: the consult and this routing record are filed, and there is no STOP). Part B waits for OPEN-1's typed ruling.

**Superseded index.** None.
