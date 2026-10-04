*Custodian's filing note (2026-10-04): the architect's draft 2 of `timing-tests-assert-property-not-budget`'s preregistration, written to question round 51 (its RULED block in `DECISIONS-PENDING.md`) on the custodian's brief. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. Its sha256, from this file's line 5 to the end, is 3688755f7ae65e0f03cb1215b4e0cc484b61cfe0d86c7c71af7240b04da9f797. Write audit PASS: zero write calls (Read 20, Grep 13, the hand-back 1); the run lasted 18:09:58Z to 18:17:25Z. C3: before (18:10Z), the round 51 records were uncommitted in the main checkout; they were committed and published as 0f3310e2 during the run. After (18:18:10Z), the porcelain held only the two pre-existing untracked items. The draft's precondition, that round 51's block and the two files be on main before the form commits, is met at 0f3310e2. The custodian keeps R-3 and R-3b, the draft's addition, and names them to the human. Profile paths redacted at filing: none.*

---

Reviewed: main @ 02dfcff3 (draft 2, to question round 51)

This is a draft, not a gate verdict. Code pins are at 02dfcff3. I read the round 51 RULED block in `DECISIONS-PENDING.md`, `state/questions/round-51.md` and `state/directives/2026-10-04-fable-advice-round-51-forms.md` from the working tree. At read time the first was an uncommitted modification and the other two were untracked (see (3)).

## (1) What changed from draft 1

1. **Authority.** Adds round 51, items 1 to 3. Fable's round-51 advice is cited as advice, never as Authority.
2. **§0.3 condition corrected.** The terminal frame does not wait behind one credit permit. It waits behind every item queued ahead of the Failed item, and those items sit in two places:
   - the pump channel, which holds up to MAX_INFLIGHT_BATCHES = 4;
   - the engine queue, which holds up to MAX_QUEUED_BATCHES = 2.
   On top of that, the engine producer's send blocks and does not watch the cancel token (`engine/src/stream.rs:2471-2483`). So once credit runs out, the Failed item may never even be generated. New cites are added for this.
3. **§0.6 is new.** It records Fable's item 1 from reading: completion also waits on credit (`adapter_ws.rs:203-224`). It also says why R-3 uses the data plane's synthetic source: the engine source reports no total (`kernel/src/lib.rs:691-696`).
4. **§1.** No code at all, kernel/tests included. Claims are limited to scratch observations and routing.
5. **§2.** Phase C is removed:
   - C-S goes to the data-plane piece on S1, or to the class-1 amendment on S2 (round 51, item 2);
   - C-P is closed (round 51, item 3).
   The publish closure is recorded in §2 itself, with the standing log-filing practice. The deliverables D-1 to D-4 are defined.
6. **R-1b's drain credit changes from 5 to u32::MAX.** Under the corrected §0.3, up to 7 batches can sit ahead of the Failed item, so a grant of 5 can stall for a reason that is not H-S. That would refute H-S falsely and send the piece to S2. The number of batches between the cancel and the terminal is now recorded, which gives Fable's item 2 a starting observation.
7. **R-1's PRODUCER_CANCELLED stamp is recorded, no longer predicted.** The engine producer can sit parked in its blocking send. On the deadline, the variant reads the trace instead of panicking.
8. **R-2 is dropped.** I agree with your reading. R-2 served only C-P, which is now closed. A scratch failure under synthetic load is not the next occurrence the ruling names, and catching one would reopen the closed half inside a piece with no code budget.
9. **R-3 and R-3b are added** as the discriminator for Fable's item 1. Each grants credit equal to, or one more than, an exact batch count on the synthetic source. Both are deterministic and neither routes S1/S2.
10. **Phase R runs at a named main commit.** The consult states whether kernel/, engine/ and protocol/ at that commit equal 02dfcff3, and names which is authoritative, the pin or the tree (round 14).
11. **The consult gets a final step.** Each summary sentence is resolved against the run logs, stopping on a mismatch. Every failing run's full output is filed verbatim.
12. **§3.** The publish fixture is removed and the synthetic factory is added.
13. **§4.** No tests and no mutations are owed. Under S2 the class-1 amendment owes them before code.
14. **§5.** Predictions and routing are rewritten. S1 holds if and only if R-1 and R-1b both behave as predicted in every run. Anything else is S2.
15. **§7.** Zero committed code lines, with a counting command and a file ceiling. The S2 route is declared in advance, so that S2's code is not misread as a class-8 overrun of the zero.
16. **§8 and §9 are rewritten.** Cargo suites are not owed under S1.
17. **Form choice: the full form stands (§21a, §25(e)), even with zero code.**
    - The category governs, not the size.
    - The piece's subject is a cancellation guarantee under test (ADR-018).
    - On S1 it routes into the data plane. On S2 it reopens test code on a property under test.
    - So any `Out-of-scope` line written at dispatch would have to name a §21a category, and round 25, item 2 fails by name a five-line dispatch whose line names one.
    - Switching forms now would also cost a second draft with no change to the gating.
18. **PLAN summary, one sentence for the custodian.** The node reproduces the skp_admission cancel-test stall (H-S) in scratch, files the Phase R consult, and routes the result. On S1 that is a proposed full-form protocol/data-plane node; on S2 it is a class-1 amendment redrafting the skp half. The publish half is closed by round 51, item 3, and the piece commits no code. (The node's title no longer describes it. Retitling is current-state class, so yours to do.)

## (2) The form

```
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
  - publish: no timing assertion (kernel/tests/publish.rs:485-527 @ 02dfcff3 sha256:HASH-TBD).
  - skp: liveness bounds only, the precedent's own shape:
    - kernel/tests/skp_admission.rs:42 @ 02dfcff3 sha256:HASH-TBD
    - kernel/tests/skp_admission.rs:941-948 @ 02dfcff3 sha256:HASH-TBD
    - precedent: engine/tests/slice.rs:697-706 @ 02dfcff3 sha256:HASH-TBD
    - precedent: engine/tests/slice.rs:732-735 @ 02dfcff3 sha256:HASH-TBD
    - precedent record: kernel/RESULTS.md:166-183 @ 02dfcff3 sha256:HASH-TBD
    - precedent record: engine/ADMISSION-PREREGISTRATION.md:982-989 @ 02dfcff3 sha256:HASH-TBD

0.2 Recorded failures.
  - skp, Windows job, at the terminal-frame deadline:
    - state/consults/gates/2026-10-03-port-1-linux-l1-gate2-reviewer.md:73-74 @ 02dfcff3 sha256:HASH-TBD
    - kernel/tests/skp_admission.rs:903-906 @ 02dfcff3 sha256:HASH-TBD
  - further skp occurrences:
    - state/CUT-STATE.md:1844 @ 02dfcff3 sha256:HASH-TBD
    - state/CUT-STATE.md:2192 @ 02dfcff3 sha256:HASH-TBD
  - publish: one occurrence, failure text not recorded:
    - state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md:420 @ 02dfcff3 sha256:HASH-TBD

0.3 HYPOTHESIS H-S (skp; from reading code, not observed).
  - The test grants credit 2, once:
    - kernel/tests/skp_admission.rs:865-871 @ 02dfcff3 sha256:HASH-TBD
  - It cancels through SKP after the first batch:
    - kernel/tests/skp_admission.rs:873-895 @ 02dfcff3 sha256:HASH-TBD
  - That cancel reaches only the engine token:
    - kernel/src/skp.rs:342-356 @ 02dfcff3 sha256:HASH-TBD
  - It never fires the adapter's halt signal, which only the reader sends (on a control frame, close or error):
    - protocol/data-plane/src/adapter_ws.rs:130-174 @ 02dfcff3 sha256:HASH-TBD
  - The writer takes a pump item only after acquiring a credit permit:
    - protocol/data-plane/src/adapter_ws.rs:203-229 @ 02dfcff3 sha256:HASH-TBD
  - The pump's Failed item is queued FIFO behind any batches already in the pump channel (capacity MAX_INFLIGHT_BATCHES = 4):
    - protocol/data-plane/src/pump.rs:47 @ 02dfcff3 sha256:HASH-TBD
    - protocol/data-plane/src/pump.rs:57-71 @ 02dfcff3 sha256:HASH-TBD
    - protocol/data-plane/src/server.rs:550-556 @ 02dfcff3 sha256:HASH-TBD
    - protocol/data-plane/src/server.rs:62 @ 02dfcff3 sha256:HASH-TBD
  - Further batches sit behind the pump in the engine's own queue (capacity MAX_QUEUED_BATCHES = 2):
    - engine/src/stream.rs:80 @ 02dfcff3 sha256:HASH-TBD
    - engine/src/stream.rs:1226 @ 02dfcff3 sha256:HASH-TBD
  - The engine producer checks the token before each send, but the send itself blocks and does not watch the token:
    - engine/src/stream.rs:2452-2457 @ 02dfcff3 sha256:HASH-TBD
    - engine/src/stream.rs:2471-2483 @ 02dfcff3 sha256:HASH-TBD
  - So the terminal is reached only after every item queued ahead of the Failed item has passed the writer, one credit each. With credit exhausted, the Failed item may never be generated, and the terminal send is not reached:
    - protocol/data-plane/src/adapter_ws.rs:281-283 @ 02dfcff3 sha256:HASH-TBD
  - The connection's capacity release is held until that send:
    - protocol/data-plane/src/adapter_ws.rs:289 @ 02dfcff3 sha256:HASH-TBD
  - Load-dependence: whether a batch is already queued or sent when the cancel lands is a scheduling race between the test task and the producer threads.
  - Corroboration: the sibling test grants u32::MAX credit and is not recorded as flaking:
    - kernel/tests/skp_filter_cancellation.rs:211-217 @ 02dfcff3 sha256:HASH-TBD
  - Corroboration: the adapter's own comment names a parked writer that never sends its terminal as a deadlock, fixed for the halt path only:
    - protocol/data-plane/src/adapter_ws.rs:199-202 @ 02dfcff3 sha256:HASH-TBD
  - Discriminator: Phase R, R-1 and R-1b.

0.4 HYPOTHESIS H-P (publish; weak, from reading code). Kept as a disclosure for the node that reopens the publish half; this form tests nothing about it.
  - kernel/src/publish/mod.rs:1614-1616 @ 02dfcff3 sha256:HASH-TBD
  - kernel/src/publish/mod.rs:625-633 @ 02dfcff3 sha256:HASH-TBD
  - kernel/tests/publish.rs:511-512 @ 02dfcff3 sha256:HASH-TBD

0.5 ADR-012 and ADR-019 are Proposed and bind nothing (kernel/README.md:376 @ 02dfcff3 sha256:HASH-TBD). They are cited only as descriptions of the code.

0.6 Fable's round-51 advice, item 1 (from reading, not run): a normal completion also waits for one credit beyond the last batch. The writer acquires a permit before it receives from the pump, and only a closed pump channel yields Completed:
  - protocol/data-plane/src/adapter_ws.rs:203-224 @ 02dfcff3 sha256:HASH-TBD
  - No existing data-plane test grants exactly a stream's batch count. The engine source reports no total, so an exact-count run needs the data plane's synthetic source:
    - kernel/src/lib.rs:691-696 @ 02dfcff3 sha256:HASH-TBD
    - protocol/data-plane/tests/candidate_a.rs:51-68 @ 02dfcff3 sha256:HASH-TBD
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
  - protocol/data-plane/tests/candidate_a.rs:258-293 @ 02dfcff3 sha256:HASH-TBD
  - protocol/data-plane/tests/candidate_a.rs:201-210 @ 02dfcff3 sha256:HASH-TBD
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

- skp: fixture("cancel", 200_000) (kernel/tests/skp_admission.rs:804 @ 02dfcff3 sha256:HASH-TBD), generated per run, unchanged.
- synthetic: factory(12, 4096, 0) (protocol/data-plane/tests/candidate_a.rs:111-119 @ 02dfcff3 sha256:HASH-TBD).
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

All printed figures are reports, not measurements: no p50/p95, no docs/08 dataset, and CI is not a reference profile (docs/08_Testing.md:13-21 @ 02dfcff3 sha256:HASH-TBD). The observations are structural: terminal present or absent, its code, batch counts, stamps present.

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
```

## (3) OPEN items

None for the human. There are three preconditions and notes for the custodian:

- **Precondition.** The form cites round 51 as Authority and Fable's file as advice. At read time, the round 51 RULED block was uncommitted in `DECISIONS-PENDING.md`, and `state/questions/round-51.md` and the Fable file were untracked. All three must be on main before the form commits, because nothing tracked may cite an untracked file as Authority (round 14).
- **R-3 is my addition.** The variant list in round 51, item 1's option text did not include it; your brief invited it. If you read that list as exhaustive, strike R-3/R-3b, and the data-plane form starts from Fable's reading alone.
- **The S1 node id is yours.** I suggest `data-plane-terminal-without-credit`.

## (4) Files read

- `state/consults/2026-10-04-timing-tests-assert-property-not-budget-architect-draft.md`
- `DECISIONS-PENDING.md` (the round 51 RULED block, working tree)
- `state/questions/round-51.md`
- `state/directives/2026-10-04-fable-advice-round-51-forms.md`
- `AUTONOMY.md` (§21-§21d, §22, §25)
- `docs/PREREGISTRATION-TEMPLATE.md` (§10 classes, the Round 25 additions)
- `PLAN.yaml` (the node block)
- `kernel/tests/skp_admission.rs` (:795-951)
- `kernel/tests/skp_filter_cancellation.rs` (:205-220)
- `kernel/src/skp.rs` (:338-359)
- `kernel/src/lib.rs` (:630-706)
- `protocol/data-plane/src/adapter_ws.rs` (:120-319)
- `protocol/data-plane/src/pump.rs`
- `protocol/data-plane/src/server.rs` (:540-564, plus grep for constants and timeouts)
- `protocol/data-plane/tests/candidate_a.rs` (:40-299, :636-675, plus grep for grant calls)
- `engine/src/stream.rs` (:760-804, :1800-1839, :2440-2489, plus grep)
- `engine/src` (grep for PRODUCER_CANCELLED, MAX_QUEUED_BATCHES)

I made no write-capable call.
