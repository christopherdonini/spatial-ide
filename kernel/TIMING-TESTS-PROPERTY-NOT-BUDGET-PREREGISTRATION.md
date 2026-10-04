# Timing tests: reproduce the skp cancel stall and route it; the publish half closed
# (PLAN node timing-tests-assert-property-not-budget)

File: kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md
Authority: question round 25, item 1 (a) (RULED 2026-09-26); placed by question round 31, item 1; drafting: question round 43, item 2; scope: question round 51, items 1, 2 and 3 (RULED 2026-10-04).
Advice, not Authority: Fable's round-51 advice (state/directives/2026-10-04-fable-advice-round-51-forms.md), items 1 to 4.
Drafted by: the architect agent on the custodian's brief; code read at main 02dfcff3.
Order: this form is committed with the custodian's hashes before Phase R runs (round 51, item 1); then Phase R; then its consult; then the routing record (S1 or S2); then the closing amendment.
Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a cancellation guarantee / a property under test, with an outcome routing into the data plane; §25(e)).

## §0. Disclosure

0.1 Neither test asserts a docs/08 row, and neither asserts an undeclared budget of the kind round 25, item 1 (a) names.
  - publish: no timing assertion (kernel/tests/publish.rs:485-527 @ 02dfcff3 sha256:df070eaa569e038c3aafb262c30b582d1ca473fe44e02c2659b4cbc80605efb9).
  - skp: liveness bounds only, the precedent's own shape:
    - kernel/tests/skp_admission.rs:42 @ 02dfcff3 sha256:5138d15cb76f0e6e80e1135e8dadb6645b14dfc0c0a270bd593e763ffae08e53
    - kernel/tests/skp_admission.rs:941-948 @ 02dfcff3 sha256:451dd95a96f8b9499174f885963b9d3d545c13e932596b2929bb8d273c1222a7
    - precedent: engine/tests/slice.rs:697-706 @ 02dfcff3 sha256:daad6354d43a9f5c3502dd43bd44b82e9a43e430886805ba6e3561208373173a
    - precedent: engine/tests/slice.rs:732-735 @ 02dfcff3 sha256:997867141bd0555e724c4406c078c03fccf6e15b3fe88681515caa929444a879
    - precedent record: kernel/RESULTS.md:166-183 @ 02dfcff3 sha256:975985e1f21be4dc32fe716b3362b7c94bfbff02d4c25f5b8b13aac5237d3bfd
    - precedent record: engine/ADMISSION-PREREGISTRATION.md:982-989 @ 02dfcff3 sha256:87c96780eeb834a31ad19e19e9c68f8c8b78d80c65edab4f41930b1f8094f24b

0.2 Recorded failures.
  - skp, Windows job, at the terminal-frame deadline:
    - state/consults/gates/2026-10-03-port-1-linux-l1-gate2-reviewer.md:73-74 @ 02dfcff3 sha256:d131d85905b431ac431026d88a6572b9e63c1b33fa2a1845141ab5c7e96b8ae8
    - kernel/tests/skp_admission.rs:903-906 @ 02dfcff3 sha256:2bf4ec351872325cf0defd9e20a7c3858dac77efc3911af549b89d0eb0d38076
  - further skp occurrences:
    - state/CUT-STATE.md:1844 @ 02dfcff3 sha256:49075c3d010e7cccd43fe7ec7c194c36eb91a97ca2edbd9b44db13f5da051816
    - state/CUT-STATE.md:2192 @ 02dfcff3 sha256:9c4296c7a0a4a0cdc37a73733d286d5ba5af9ec60271e098b7f753b53a6d9b20
  - publish: one occurrence, failure text not recorded:
    - state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md:420 @ 02dfcff3 sha256:2eed14bffd56e0eee61d3a02068c3ac3bbfe2b7b231251e68eb354aaea6bfb3c

0.3 HYPOTHESIS H-S (skp; from reading code, not observed).
  - The test grants credit 2, once:
    - kernel/tests/skp_admission.rs:865-871 @ 02dfcff3 sha256:e8246ba3e40aaf359ece63107e161d407c5c279c207de4abf8403954aca2da14
  - It cancels through SKP after the first batch:
    - kernel/tests/skp_admission.rs:873-895 @ 02dfcff3 sha256:002662c606b66cffdd1525d75bb20e3f4c657f9b880ecd7d37cc355f3b86ea1c
  - That cancel reaches only the engine token:
    - kernel/src/skp.rs:342-356 @ 02dfcff3 sha256:92238c67887c3ed9f63f51e82be90d11f1c9ec582ac5b8da7b6b5ef384abb7d2
  - It never fires the adapter's halt signal, which only the reader sends (on a control frame, close or error):
    - protocol/data-plane/src/adapter_ws.rs:130-174 @ 02dfcff3 sha256:40b5259fcae8d4a46932b203c927344e4dddcdfd3721624494a2a23a01c737ce
  - The writer takes a pump item only after acquiring a credit permit:
    - protocol/data-plane/src/adapter_ws.rs:203-229 @ 02dfcff3 sha256:5eb3481663018a74ba0215132fd6747f2379623fd1d5a7c9068e034422a9ab04
  - The pump's Failed item is queued FIFO behind any batches already in the pump channel (capacity MAX_INFLIGHT_BATCHES = 4):
    - protocol/data-plane/src/pump.rs:47 @ 02dfcff3 sha256:841ce4344ad86e97098d4167e542d8a069c85c243d41af66bc3997aae557839a
    - protocol/data-plane/src/pump.rs:57-71 @ 02dfcff3 sha256:fba289d1db2deda53cdcf106eda64351af46d6feee6d90992240f802b52aedc9
    - protocol/data-plane/src/server.rs:550-556 @ 02dfcff3 sha256:7aabde449a096b5af5cc55137b520bc327c238b46afdb2da905ad9fad772c877
    - protocol/data-plane/src/server.rs:62 @ 02dfcff3 sha256:c80f87e55725df27bfde829547508f3cd9763fcfad7ddf5596750a3dc5e43dc3
  - Further batches sit behind the pump in the engine's own queue (capacity MAX_QUEUED_BATCHES = 2):
    - engine/src/stream.rs:80 @ 02dfcff3 sha256:4bf4b68e73d54fec88522479beb446850f79e3c73c008573a1069894f72bda0f
    - engine/src/stream.rs:1226 @ 02dfcff3 sha256:427fa25970aa4fa8ff805fd089f08a16a2c7064cb1d9174b2ff7459f5851c39a
  - The engine producer checks the token before each send, but the send itself blocks and does not watch the token:
    - engine/src/stream.rs:2452-2457 @ 02dfcff3 sha256:abb22a55352e91839b2a1bfc943b81e66d4ef077316e6a147b89dcf60e41fb51
    - engine/src/stream.rs:2471-2483 @ 02dfcff3 sha256:08d752d9b960258a828a8ec0466b682e09bc99781ad4df9663ac245127d03719
  - So the terminal is reached only after every item queued ahead of the Failed item has passed the writer, one credit each. With credit exhausted, the Failed item may never be generated, and the terminal send is not reached:
    - protocol/data-plane/src/adapter_ws.rs:281-283 @ 02dfcff3 sha256:89f34ef936f2b0d2f17103332457a3f58eda38ae7b69254b989322ff7da09583
  - The connection's capacity release is held until that send:
    - protocol/data-plane/src/adapter_ws.rs:289 @ 02dfcff3 sha256:0de7b07cda7132418b4d56e368531713cac75e675f6bc193871a85d781812468
  - Load-dependence: whether a batch is already queued or sent when the cancel lands is a scheduling race between the test task and the producer threads.
  - Corroboration: the sibling test grants u32::MAX credit and is not recorded as flaking:
    - kernel/tests/skp_filter_cancellation.rs:211-217 @ 02dfcff3 sha256:5cf0d922d0c7bc2b93ecb8fb680f90b38e24065c41d15128684ad2c95a3f2c79
  - Corroboration: the adapter's own comment names a parked writer that never sends its terminal as a deadlock, fixed for the halt path only:
    - protocol/data-plane/src/adapter_ws.rs:199-202 @ 02dfcff3 sha256:e8e644884d275fc6ba3a220b1c0770b938df7ff5c40d19dd9b44cacf0e155600
  - Discriminator: Phase R, R-1 and R-1b.

0.4 HYPOTHESIS H-P (publish; weak, from reading code). Kept as a disclosure for the node that reopens the publish half; this form tests nothing about it.
  - kernel/src/publish/mod.rs:1614-1616 @ 02dfcff3 sha256:edd8a76e37f89bf530a2db745ad6773a8f05a9aeae99f21a66e68da1db0385b8
  - kernel/src/publish/mod.rs:625-633 @ 02dfcff3 sha256:b026dee58bd467c51ef3a13859aabe19867ff69976983edc28ed6d63260eb7ed
  - kernel/tests/publish.rs:511-512 @ 02dfcff3 sha256:c8f56e336abd57b3f79ef027834ae496b2833e038cda19e9c67cd052d84202e6

0.5 ADR-012 and ADR-019 are Proposed and bind nothing (kernel/README.md:376 @ 02dfcff3 sha256:336bc27459c94d3a655f24ca568b125b24aa692c46260d504faa9bb39c272b26). They are cited only as descriptions of the code.

0.6 Fable's round-51 advice, item 1 (from reading, not run): a normal completion also waits for one credit beyond the last batch. The writer acquires a permit before it receives from the pump, and only a closed pump channel yields Completed:
  - protocol/data-plane/src/adapter_ws.rs:203-224 @ 02dfcff3 sha256:3eadd6d54770e2ad6fcd3844c97f9f5806d44fb6ce8c9b50469efe1c56024728
  - No existing data-plane test grants exactly a stream's batch count. The engine source reports no total, so an exact-count run needs the data plane's synthetic source:
    - kernel/src/lib.rs:691-696 @ 02dfcff3 sha256:80eed392cd3163581a0e16a14c1143a7ecb3ba23933c3a71a1d5a5a2e59c1444
    - protocol/data-plane/tests/candidate_a.rs:51-68 @ 02dfcff3 sha256:a43eab49a44b889148ab92d24816a76fdfaa83198ef0065bf42fce1c8b9cbb2a
  - Discriminator: Phase R, R-3 and R-3b. Their result is carried to the data-plane form; it does not route this piece.

## §1. May and may not claim

- No committed code line anywhere: no change under kernel/src/**, kernel/tests/**, engine/**, protocol/** or frontends/** (S2 excepted, under its own amendment; see §7).
- No claim that either flake is fixed.
- H-S may be called observed only as far as R-1 and R-1b observed it, in scratch, at the commit the consult names. It is never stated as a property of the shipped build beyond that.
- R-3's result is evidence for the data-plane form, not a claim of this piece about completion semantics.
- No performance number; no docs/08 row; no verdict from any printed figure. Every printed cancellation figure names its pair of instants (ADR-018 §1).
- No wire, SKP, MCP or data-plane change. No ADR is amended.

## §2. The change

Phase R: reproduction, no committed code (round 51, item 1).
A tester-high applies scratch variants in a throwaway worktree at a named main commit, runs them, discards the worktree, and files the consult state/consults/<date>-timing-tests-reproduction.md.
- The consult carries each variant's diff as text, the commit it was applied to, its run count, and each run's outcome. Every failing run's full output is filed verbatim.
- It states whether `git diff --stat 02dfcff3 <commit> -- kernel engine protocol` is empty. If it is not, it names which is authoritative, the pin or the tree, and re-reads the §0.3 cites against the tree.
- Final step: before committing, the tester resolves each summary sentence of the consult against its own steps and run logs, and STOPS on a mismatch instead of committing.

The variants:
- R-1: kernel/tests/skp_admission.rs as committed, except that it waits for two TAG_BATCH frames before host.cancel and grants no further credit. On the 60 s deadline it records the timeout and reads the trace (both stamps, present or absent) instead of panicking. It also records the TAG_BATCH count over the whole run. 10 runs, alone.
- R-1b: as R-1, plus one CREDIT grant of u32::MAX right after host.cancel returns (the sibling's grant, §0.3). It records the terminal code, both stamps, and the TAG_BATCH count between host.cancel's return and the terminal. The test's remaining assertions stay; any failure is recorded by its message. 10 runs, alone.
- R-1c: control, the unmodified test. 20 runs, alone.
- R-3: protocol/data-plane/tests/candidate_a.rs's every_batch_and_a_terminal_frame_are_delivered, with factory(12, 4096, 0) unchanged and credit granted as exactly 12 instead of 100. It records the batches received and whether a terminal arrives before recv_by's deadline. 10 runs, alone.
  - protocol/data-plane/tests/candidate_a.rs:258-293 @ 02dfcff3 sha256:b87323c5184815d3ebdc436126ccd833c7c2aacc184489a9e3a6305f1011f87e
  - protocol/data-plane/tests/candidate_a.rs:201-210 @ 02dfcff3 sha256:bd35037e6f89c048b737f87d8dc8ec14459194302287afae7b724b5e9962c7d1
- R-3b: as R-3, with credit 13. 10 runs, alone.

Routing (§5 gives the conditions):
- S1, H-S confirmed. The custodian appends a proposed PLAN node for a separate full-form protocol/data-plane piece (round 51, item 2), with depends_on this node. Its summary names:
  (i) the remedy: a producer failure reaches the client as a terminal frame without waiting for credit; the skp test stays unchanged as its end-to-end proof; §21a wire/data plane; ADR-012 is Proposed, so its shape may need a decision from the human;
  (ii) Fable's item 1, whether TERM_COMPLETED is covered too, with R-3/R-3b's observed result and the consult's path;
  (iii) Fable's item 2, what happens to batches queued before a failure, with R-1b's observed batches-after-cancel counts;
  (iv) Fable's item 3, the shell client's credit window, as read not run;
  (v) from this form's §0.3: the Failed item sits behind both queues, and the engine producer's send does not watch the token. So the form must decide whether the data plane learns of an SKP cancel directly rather than waiting for the Failed item, and whether that reaches the engine boundary (§21a, a cancellation guarantee).
  No code of that piece lands under this form.
- S2, H-S refuted. Stop. This form takes a class-1 amendment, and the skp half is redrafted there (round 51, item 2). That amendment declares §2, §4 with a mutation per test, §5, §7 with its own ceiling and counting command, §8 and §9 before any code. If R-3 behaved as predicted, the consult records it and the custodian raises it as a ledger finding; this form appends no node for it.

The publish half: closed (round 51, item 3).
- There is no undeclared budget (§0.1), and the one failure's text was never recorded (§0.2).
- It reopens on the next occurrence, with that occurrence's text. Under the standing practice recorded with that ruling (from Fable's round-51 advice, item 4), the custodian files the failing job's log text verbatim before any re-run.
- The reopening is a new proposed PLAN node starting from that text and §0.4, not an amendment to this form.
- No publish-test variant runs under this form.

Done means:
- D-1: the Phase R consult is filed, at the path above, at a named commit.
- D-2: on S1, the proposed node is in PLAN.yaml with status proposed and the summary elements (i) to (v); on S2, the class-1 amendment is in §10.
- D-3: the publish half's closure is this §2's publish paragraph, done at this form's commit.
- D-4: a closing amendment in references and hashes only: the consult's path @ commit; the node id, or the §10 amendment by number; this §2 by section.

Portability (directive §2, R1-R6): no code, so no OS-dependent feature is added or changed (R2/R3); no cfg (R4); no level claimed (R5); neither test is ignored anywhere (R6). R1: the skp failures are recorded on Windows only, with Linux green in the same run (§0.2), which is scheduling, not semantics. Phase R runs on Windows, and no platform claim is made.

## §3. Fixtures

- skp: fixture("cancel", 200_000) (kernel/tests/skp_admission.rs:804 @ 02dfcff3 sha256:1bf827f83a849cf51ad31c24477c7a15495ed8cd621056c4d394ed497fa8d5ae), generated per run, unchanged.
- synthetic: factory(12, 4096, 0) (protocol/data-plane/tests/candidate_a.rs:111-119 @ 02dfcff3 sha256:e5f96870cb2a476933e03a9b0ff68626260e65a208fef71ff88254d289c8f451).
- Not the 5 GB fixture.

## §4. Tests and mutations

- No test of record is added or changed, so no mutation is owed.
- The Phase R variants are scratch observations: not tests of record, and not mutations. None is recorded as a mutation's observation, and no verify-mutation run is called one (round 25, item 2 (c)).
- Under S2, the class-1 amendment owes §4 in full before any code.

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- R-1: no TAG_TERMINAL within the 60 s deadline in 10 of 10 runs, and exactly 2 TAG_BATCH frames in each. The PRODUCER_CANCELLED stamp is recorded with no prediction (§0.3: the producer can be parked in its send).
- R-1b: TERM_PRODUCER_FAILED in 10 of 10 runs; both stamps present; and in each run at most 7 TAG_BATCH frames between host.cancel's return and the terminal (MAX_INFLIGHT_BATCHES 4 + MAX_QUEUED_BATCHES 2 + one batch in the producer's hand).
- R-1c: 20 of 20 pass.
- R-3: 12 TAG_BATCH frames, then no terminal before recv_by's deadline, in 10 of 10 runs.
- R-3b: 12 TAG_BATCH frames, then TERM_COMPLETED, in 10 of 10 runs.

Routing:
- S1 if and only if R-1's terminal prediction and R-1b's terminal-code prediction both hold in every run. Otherwise S2.
- R-1b's stamp and count predictions, R-1c and R-3/R-3b do not route. A miss on any of them is a class-2 recorded result, carried to the data-plane form on S1.

Declared unchanged:
- every committed file under kernel/, engine/, protocol/ and frontends/, except kernel/README.md's preregistrations bullet;
- RECV_DEADLINE 60 s, the 5 s bound, ATTEMPTS 5 and the credit grant in the committed skp test;
- the publish test.

Invalidators:
- A run whose applied diff differs from its §2 description voids that row; it is re-run, not reinterpreted.
- A Phase R commit whose kernel/engine/protocol tree differs from 02dfcff3 with no named authority (§2) voids the consult.

Falsification: a recorded skp failure at a line other than kernel/tests/skp_admission.rs:906 makes §0.3 the wrong account of that failure.

## §6. Instruments

All printed figures are reports, not measurements: no p50/p95, no docs/08 dataset, and CI is not a reference profile (docs/08_Testing.md:13-21 @ 02dfcff3 sha256:2f4b25f8f53d7da1c196295e6935553f6e30cd6766172ab7ab06133d3f13f1de). The observations are structural: terminal present or absent, its code, batch counts, stamps present.

## §7. Declared values and ceilings

- Committed code: 0 changed lines of non-generated code and tests (§21c's counting rule).
  - Counted by: git diff --numstat origin/main...HEAD -- '*.rs' '*.ts' '*.tsx' '*.js' '*.mjs' '*.toml', which must print nothing.
- Non-generated files touched: at most 4. These are this form, kernel/README.md (the preregistrations bullet and Last verified at), PLAN.yaml, and the Phase R consult. The generated set does not count.
- S2: the code ceiling is the one S2's class-1 amendment declares, with its counting command, before any code. A code line committed without that amendment is a class-8 overrun of this zero and hits §8 item 2.
- No new constant.

## §8. Block-on-sight

1. Phase R run, or any variant result recorded, before this form is committed with the custodian's hashes.
2. Any committed code line in this piece: under S1, any at all; under S2, any before its class-1 amendment, or beyond that amendment's ceiling.
3. Any diff under kernel/src/**, kernel/tests/**, engine/**, protocol/** or frontends/** on S1.
4. On S1, the data-plane node appended with a status other than proposed, without the summary elements (i) to (v), or with any of its code on this branch.
5. A publish-test variant run, or any publish-test change, under this form.
6. A Phase R row without its applied diff and commit, or a failing run without its full output.
7. A consult summary sentence not resolved against the run logs (§2's final step).
8. A claim that a flake is fixed, or H-S stated beyond what R-1 and R-1b observed.
9. A printed figure without its instant pair, or phrased as a verdict or a docs/08 claim.
10. A scratch variant recorded as a test of record or as a mutation's observation.

## §9. Gates

- Architect: §21a; ADR-018 vocabulary; every round and item cite resolved against the RULED block; §8 item by item.
- Reviewer: the full diff; the consult row by row against §5; each variant diff against its §2 description; the commit ids.
- Suites:
  - node --test scripts suite; verify-plan; verify-cites; verify-quotes; verify-test-claims.
  - Cargo suites are not owed under S1 (no code). Under S2, the class-1 amendment names them.
- Operator: none.

## §10. Amendments

(opens empty)

### Amendment 1 — closing record (class 1; references and hashes only; the record cap)

*Written after Phase R's outcome was seen, by the custodian, after PR #174 merged as merge commit 95500097639acdd37689ffd7e0302c64ee1f593e (parents 7ca971f5 and b73e65d0; never a squash) at 2026-10-04T21:37:09Z. It follows the gate-1 architect's closing-record list (`state/consults/gates/2026-10-04-timing-tests-assert-property-not-budget-gate1-architect.md`). Every commit named below is on main.*

1. **D-1, the Phase R consult:** `state/consults/2026-10-04-timing-tests-reproduction.md` @ 3831d4a9edcdf7cf64a43eab4bc4d02664b62313, whole-file sha256 df0253b1c13f40e4f346ac7627ba156355d6d9cafaedcc60dd540c478a8d440d. Phase R ran at 1c71ebaf.
2. **D-2, the routing: S1.** The proposed PLAN node `data-plane-terminal-without-credit`, by node id, appended at 3831d4a9.
3. **D-3, the publish half:** closed by §2's publish paragraph, done at e582d79f085b7e391b636b7094ad47418fddc309.
4. **The PR:** #174, merged as 95500097. `kernel/README.md` is at that merge commit.
5. **Gates:** gate-log 398 (architect, gate 1, PASS) and 399 (reviewer, gate 1, PASS). The reports are `state/consults/gates/2026-10-04-timing-tests-assert-property-not-budget-gate1-architect.md` and `state/consults/gates/2026-10-04-timing-tests-assert-property-not-budget-gate1-reviewer.md`. The reviewer's report records 41 of 41 pins recomputed at 1c71ebaf (its S2-1), and the architect's N-4 reads §5's invalidator 2 as not engaged.
6. **PLAN:** done, with evidence `{pr: 174}` set in this commit.
