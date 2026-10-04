*Custodian's filing note (2026-10-04): the architect's draft of `timing-tests-assert-property-not-budget`'s preregistration, on the custodian's brief. Drafting returned to the architect by question round 43, item 2. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed. Its sha256, from this file's line 11 to the end, is 6021bca0d6e28d6e29bd777a6ad90c41f710b262dda6b371dde320cccb017258. Write audit PASS: zero write calls (Read 32, Grep 32, Glob 3, the hand-back 1); the run lasted 17:27:40Z to 17:36:40Z. C3: the main checkout's porcelain held only its two pre-existing untracked items before (17:27:47Z) and after (17:37:16Z), and main did not move from 02dfcff3. The custodian spot-checked four claims at 02dfcff3, and each holds:*
- *the publish test asserts no timing (no `Instant`, `Duration`, deadline or timeout in its lines);*
- *its line history shows no later piece removed one (a format pass, a refactor, and the original commit);*
- *the skp test grants credit 2 once, and panics on its 60 s terminal-frame deadline;*
- *the data-plane writer acquires a credit permit before it takes the next pump item, so a producer failure waits behind credit.*

*The draft finds that neither test asserts an undeclared budget, and that the skp test's recorded failure is more likely a credit-gated stall (hypothesis H-S) than slowness. It takes the full form and raises O-1 to O-3 for the human. It is not yet a form. It is committed with the custodian's hashes only after the human's answers. Profile paths redacted at filing: none.*

---

Reviewed: main @ 02dfcff3. This is a draft, not a gate verdict. My recommendation: narrow the node and reproduce before any code.

**The main finding, ahead of the form question.** At 02dfcff3, neither test asserts an undeclared budget in the sense the ruling targets. That ruling is question round 25, item 1 (a).
- **publish.rs test.** `cancelling_mid_publish_leaves_no_bundle_and_no_staging_directory` asserts no timing at all: no Instant, no Duration, no deadline (`kernel/tests/publish.rs:485-527`).
  - Its one recorded flake was never captured with its failure text. The only record is the line saying it "flaked once under load" (`state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md:420`).
  - I cannot see from the tree whether a later piece removed a timing assertion from it. The custodian can check with `git log -L485,527:kernel/tests/publish.rs`.
- **skp_admission.rs test.** `cancel_reaches_the_producer_directly_and_is_observed_on_its_own_clock` has three bounds. All three are liveness bounds of the kind the slice.rs precedent keeps:
  - a 5 s bound on requested→observed (`kernel/tests/skp_admission.rs:941-948`);
  - two 60 s receive deadlines (`:42`, `:877-879`, `:903-906`).
  - The precedent itself keeps a 5 s liveness bound "so a genuine hang still fails" (`engine/tests/slice.rs:704-706`, `:732-735`; record `kernel/RESULTS.md:179-182`).
- **Where the recorded failure sits.** The skp failure is recorded at `:906`, the 60 s wait for the terminal frame after cancel (`state/consults/gates/2026-10-03-port-1-linux-l1-gate2-reviewer.md:74`).
- **What I think causes it.** My reading of the code points to an indefinite stall, not a slow run. It is a hypothesis, H-S, set out in the draft's §0. In short:
  - after an SKP cancel, the data-plane writer hands over the producer's failure only once it holds credit;
  - the test grants 2 credits, once;
  - if the second batch has already gone out when the cancel lands, no terminal frame is ever sent.
- **What follows.**
  - Applied literally, the ruling changes no failing assertion in either test.
  - Raising or dropping the 60 s deadline would hide a stall rather than fix a flake.
  - The node's premise does not hold. This goes to the human: OPEN items O-1 to O-3 below.

**docs/08.** No bound in either test is a declared docs/08 row.
- The 5 s bound sits on the interval docs/08:8 scores (cancel_requested → cancel_observed). But 5 s is not docs/08's figure (100 ms, scored p50/p95 on reference hardware), and the draft leaves the bound unchanged.
- The 60 s deadline spans cancel → terminal frame received. That interval contains cancel_quiescent, which ADR-018 §2 reports with no budget (`docs/adr/ADR-018-what-cancellation-acknowledged-means.md:59`).
- So the next node's "goes back to the human" trigger does not fire here. The node after this one, `timing-assertions-under-contention`, owns `engine/tests/slice.rs`'s 100 ms docs/08:8 assertion (`engine/tests/slice.rs:815-818`).

## (1) Form: full form (§21a), reviewer and architect

- **§21a, "a stated guarantee or invariant".** The text covers "a cancellation guarantee (ADR-018) … or any property currently under test" (`AUTONOMY.md:325-327`).
  - The skp test is the evidence `frontends/shell/CANCELLATION-FACTS.md:25-32` rests on: producer-observed cancellation, and the SKP-cancel path ending in TERM_PRODUCER_FAILED.
  - The publish test pins "no partial output after a cancel" (ADR-010 rule 7, `kernel/src/publish/mod.rs:621-637`).
  - Any change to either test's assertions touches a property under test.
- **§25(e).** The Out-of-scope line could not assert that the piece touches none of the four categories, so the full form applies from dispatch (`AUTONOMY.md:482`).
- **Where Phase R most likely leads.** Its likely outcome points into `protocol/data-plane` (§21a data plane). That fix is not in this piece's code scope, but the routing has to be gated.
- **Size.** Phase C as drafted is about 90 lines or fewer, under §21c, but the category governs.

## (2) The draft

```
# Timing tests: the property and its ordering, not a budget — reproduction first
# (PLAN node timing-tests-assert-property-not-budget)

File: kernel/TIMING-TESTS-PROPERTY-NOT-BUDGET-PREREGISTRATION.md
Authority: question round 25, item 1 (a) (RULED 2026-09-26); placed by question round 31, item 1. Drafting: question round 43, item 2.
Drafted by: the architect agent on the custodian's brief, read at main 02dfcff3.
Committed before any code. Append-only once committed; an amendment made after any outcome has been seen says so in its first line.
Form: full (AUTONOMY.md §21a, a cancellation guarantee / a property under test; §25(e)).

## §0. Disclosure

0.1 Neither test asserts a docs/08 row, and neither asserts an undeclared budget of the kind the ruling names.
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
  - Further skp occurrences:
    - state/CUT-STATE.md:1844 @ 02dfcff3 sha256:HASH-TBD
    - state/CUT-STATE.md:2192 @ 02dfcff3 sha256:HASH-TBD
  - publish: one occurrence, failure text not recorded:
    - state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md:420 @ 02dfcff3 sha256:HASH-TBD

0.3 HYPOTHESIS H-S (skp; from reading code, not observed).
  - The test grants credit 2, once:
    - kernel/tests/skp_admission.rs:867-871 @ 02dfcff3 sha256:HASH-TBD
  - It cancels through SKP after the first batch:
    - kernel/tests/skp_admission.rs:876-895 @ 02dfcff3 sha256:HASH-TBD
  - That cancel reaches only the engine token:
    - kernel/src/skp.rs:342-356 @ 02dfcff3 sha256:HASH-TBD
  - It never fires the adapter's halt signal, which only the reader sends, on a control frame, close or error:
    - protocol/data-plane/src/adapter_ws.rs:130-174 @ 02dfcff3 sha256:HASH-TBD
  - The writer takes a pump item only after acquiring a credit permit:
    - protocol/data-plane/src/adapter_ws.rs:203-229 @ 02dfcff3 sha256:HASH-TBD
  - So the pump's Failed item waits behind credit:
    - protocol/data-plane/src/pump.rs:69-71 @ 02dfcff3 sha256:HASH-TBD
  - If batch 2 was sent before the cancel landed, no permit remains and the terminal send is never reached:
    - protocol/data-plane/src/adapter_ws.rs:281-283 @ 02dfcff3 sha256:HASH-TBD
  - The connection's capacity release is held until that send:
    - protocol/data-plane/src/adapter_ws.rs:289 @ 02dfcff3 sha256:HASH-TBD
  - Load-dependence: whether batch 2 leaves before the cancel call lands is a scheduling race between the test task and the writer and producer.
  - Corroboration: the sibling test grants u32::MAX credit and is not recorded as flaking:
    - kernel/tests/skp_filter_cancellation.rs:211-217 @ 02dfcff3 sha256:HASH-TBD
  - Corroboration: the adapter's own comment names a parked writer that never sends its terminal as a deadlock, fixed for the halt path only:
    - protocol/data-plane/src/adapter_ws.rs:199-202 @ 02dfcff3 sha256:HASH-TBD
  - Discriminator: Phase R, R-1 and R-1b.

0.4 HYPOTHESIS H-P (publish; weak, from reading code).
  - On Windows, the staging removal can fail while another process holds a handle on a just-written file:
    - kernel/src/publish/mod.rs:1614-1616 @ 02dfcff3 sha256:HASH-TBD
  - Cleanup failure is reported, not swallowed, as StagingNotRemoved:
    - kernel/src/publish/mod.rs:625-633 @ 02dfcff3 sha256:HASH-TBD
  - The test's Cancelled match would then fail, printing the variant:
    - kernel/tests/publish.rs:511-512 @ 02dfcff3 sha256:HASH-TBD
  - Discriminator: the next failure's own message. The existing assertion messages already carry it.

0.5 ADR-012 and ADR-019 are Proposed and bind nothing (kernel/README.md:376 @ 02dfcff3 sha256:HASH-TBD). They are cited only as descriptions of the code.

## §1. May and may not claim

- No performance number; no docs/08 row; no verdict from any printed figure.
- Every printed cancellation figure names its pair of instants (ADR-018 §1).
- No wire, SKP, MCP or data-plane change. No change under kernel/src/** or protocol/**.
- No ADR is amended.
- Phase R's outcome is evidence for the human's ruling, not a fix.

## §2. The change

Phase R — reproduction, no committed code. A tester-high runs scratch variants of the skp test in a worktree, discarded afterwards, and files the consult state/consults/<date>-timing-tests-reproduction.md.
- R-1: the test as-is, except it waits for two TAG_BATCH frames before host.cancel; no further credit.
- R-1b: as R-1, plus one CREDIT grant of MAX_INFLIGHT_BATCHES + 1 = 5 after the cancel (protocol/data-plane/src/server.rs:62 @ 02dfcff3 sha256:HASH-TBD).
- R-1c: control. The unmodified test, 20 runs, alone.
- R-2: the publish test, 50 runs under a concurrent cargo build. Every failure's full message is recorded.

Outcomes:
- S1: H-S confirmed. The skp half routes to O-2; no skp test code before that ruling.
- S2: H-S refuted. Stop; this preregistration takes a class-1 amendment and the skp half is redrafted.

Phase C — code, only after the rulings on O-1 to O-3; two test files only.

C-S, skp test:
- Assertions unchanged:
  - both trace instants are stamped;
  - requested ≤ observed, with the existing retry for the known instrument race (kernel/tests/skp_admission.rs:750-801 @ 02dfcff3 sha256:HASH-TBD);
  - the terminal is TERM_PRODUCER_FAILED;
  - the 5 s and 60 s liveness bounds stay, the 5 s message relabelled "a liveness bound, not the docs/08 budget" in slice.rs's form.
- Reported, never asserted: one println naming its pairs:
  - cancel_requested → cancel_observed (trace offsets);
  - host.cancel returned → TAG_TERMINAL received (test Instant), which contains cancel_quiescent and the wire.
- Only under O-2 (b): after the cancel, the test grants drain credit of MAX_INFLIGHT_BATCHES + 1, and the comment states that the consumer must drain to a terminal.

C-P, publish test, only under O-3 (b):
- The CancelAfter observer records the Instant just before it cancels, and records each cancellation_observed call (the trait seam read at kernel/src/publish/mod.rs:230-252 @ 02dfcff3 sha256:HASH-TBD).
- Asserted: cancellation_observed is called exactly once, at or after the cancel instant and before publish_unguarded returns.
- Existing assertions unchanged.
- Reported, never asserted: cancel raised → cancel_observed, and cancel_observed → publish_unguarded returned. The second contains staging removal (kernel/src/publish/mod.rs:621-637 @ 02dfcff3 sha256:HASH-TBD).

Portability (directive §2, R1–R6):
- R1: the semantics under test are platform-independent. The skp failures are recorded on Windows only (Linux green in the same run, §0.2), which is scheduling, not semantics. No platform claim is made.
- R2/R3: no OS-dependent feature is added or changed. If H-P were confirmed, its fix belongs at the OS-error boundary (kernel/src/publish/error.rs) with R3's three items, in another piece.
- R4: no cfg added.
- R5: no level claimed.
- R6: neither test is ignored on any platform.

## §3. Fixtures

- skp: fixture("cancel", 200_000) (kernel/tests/skp_admission.rs:804 @ 02dfcff3 sha256:HASH-TBD).
- publish: fixture(&d, 30_000) (kernel/tests/publish.rs:487 @ 02dfcff3 sha256:HASH-TBD).
- Both generated per run, unchanged. Not the 5 GB fixture.

## §4. Tests and mutations

- C-S report lines: not assertions; no mutation owed.
- C-S under O-2 (b), the terminal assertion under drain credit (kernel/tests/skp_admission.rs:914-919 @ 02dfcff3 sha256:HASH-TBD).
  - Mutation: at protocol/data-plane/src/pump.rs:70 @ 02dfcff3 sha256:HASH-TBD, drop the Failed send and keep the break.
  - The writer then reads a closed channel and sends TERM_COMPLETED, and the test fails by its TERM_PRODUCER_FAILED message.
- C-P (i), cancellation_observed is reported exactly once.
  - Mutation: delete the callback call at kernel/src/publish/mod.rs:983-984 @ 02dfcff3 sha256:HASH-TBD.
  - Fails by the message "cancellation_observed was never reported".
- C-P (ii), observed at or after the cancel.
  - Mutation: in CancelWatch::check, hoist self.observe() above the is_cancelled test (kernel/src/publish/mod.rs:958-964 @ 02dfcff3 sha256:HASH-TBD).
  - Fails by the message "observed before the cancel was raised".
- Each mutation is observed by applying it, running the named test, recording the failure by name with its commit id, and reverting. A verify-mutation run is never called an observation of a mutation (round 25, item 2 (c)).

## §5. Predictions · unchanged · invalidators · falsification

Predictions:
- R-1: no TAG_TERMINAL within 60 s in 10 of 10 runs, with PRODUCER_CANCELLED stamped in each.
- R-1b: TERM_PRODUCER_FAILED in 10 of 10 runs.
- R-1c: 20 of 20 pass.
- R-2: no prediction registered. A non-reproduction does not refute H-P.

Declared unchanged:
- every product file;
- RECV_DEADLINE 60 s, the 5 s bound, ATTEMPTS 5;
- the credit grant (except under O-2 (b));
- every existing assertion.

Invalidators:
- R-1 reaches a terminal in any run → S2.
- R-1b fails to → H-S is wrong as stated → stop.

Falsification: a recorded skp failure at a line other than kernel/tests/skp_admission.rs:906 makes §0.3 the wrong account.

## §6. Instruments

All printed figures are reports, not measurements: no p50/p95, no docs/08 dataset, CI is not a reference profile (docs/08_Testing.md:13-21 @ 02dfcff3 sha256:HASH-TBD). The assertions are structural: the stamps exist, their order, the terminal code, the error variant, the paths absent.

## §7. Declared values and ceilings

Phase C:
- at most 90 changed lines over at most 2 files: kernel/tests/skp_admission.rs and kernel/tests/publish.rs;
- counted by: git diff --numstat 02dfcff3...HEAD -- kernel/tests/skp_admission.rs kernel/tests/publish.rs.

Phase R: 0 committed code lines; one consult file.

No new constant.

## §8. Block-on-sight

1. Any committed code before Phase R's consult is filed and O-1 to O-3 are ruled.
2. A change to RECV_DEADLINE, the 5 s bound, ATTEMPTS or the credit grant outside O-2 (b).
3. Any diff under kernel/src/** or protocol/**.
4. An ignore or cfg_attr on either test (R4, R6).
5. A printed figure without its instant pair, or phrased as a verdict or a docs/08 claim.
6. A "done" claim that the flake is fixed without R-1/R-1b evidence and the ruled remedy's test.
7. A mutation recorded without its observed failure name and commit.

## §9. Gates

- Architect: §21a; ADR-018 vocabulary; §8 one by one.
- Reviewer: the full diff, the consult against §5.
- Suites:
  - cargo test -p spatial-kernel --test skp_admission
  - cargo test -p spatial-kernel --test publish
  - the workspace
  - node --test scripts suite; verify-cites; verify-quotes; verify-test-claims
- Operator: none.

## §10. Amendments

(opens empty)
```

## (3) OPEN items

- **O-1, reproduce before any code.** This follows the round 25, item 1 (d) shape.
  - Options: (1) Phase R first; (2) rule from the code reading alone; (3) apply the ruling literally, with report-only edits to both tests and the stall left in place.
  - Recommended: (1).
  - Waits on it: all code.
- **O-2, if Phase R confirms H-S.**
  - Options:
    - (a) A separate full-form `protocol/data-plane` piece delivers a producer failure as a terminal frame without waiting for credit. The skp test stays unchanged as that piece's end-to-end proof. This is wire/data-plane under §21a. Since ADR-012 is Proposed, the shape may need a decision.
    - (b) Declare the credit-gated terminal the contract. C-S grants drain credit after the cancel, and a KNOWN-LIMITATIONS line goes in, its wording yours.
    - (c) Hold; the flake stays.
  - Recommended: (a). The adapter already treats a parked writer with no terminal as a deadlock (`adapter_ws.rs:199-202`), and the capacity slot is held until the terminal is sent.
  - Waits on it: C-S's drain-credit change (under (b)) and any data-plane code.
- **O-3, the publish half.**
  - Options: (a) close it as "no undeclared budget; failure text unrecorded; the existing messages diagnose themselves", and reopen on the next occurrence with its text; (b) apply the precedent's ordering and report additions (C-P, about 40 lines), with any done-claim limited to "precedent applied; cause unknown".
  - Recommended: (a).
  - Waits on it: C-P.
- **A note, not an item.** The node reads `needs_human: none` with a 60-minute budget. O-1 to O-3 need a question round first.

**Owner's index.** No interface pointer changes, since neither test is a pinned pointer. The PR adds this preregistration to the "preregistrations in this module" bullet (`kernel/README.md:373` @ 02dfcff3) and refreshes "Last verified at".

## (4) Files read, at 02dfcff3

- `PLAN.yaml` (node blocks at :2494-2510 and :2884-2900)
- `DECISIONS-PENDING.md` (the round 25 RULED block)
- `state/questions/round-25.md`
- `kernel/tests/skp_admission.rs` (:42, :700-951)
- `kernel/tests/publish.rs` (:55-92, :380-599)
- `kernel/tests/skp_filter_cancellation.rs` (:1-40, :85-269)
- `kernel/src/skp.rs` (:280-360, :1530-1599)
- `kernel/src/publish/mod.rs` (:205-264, :585-990, :1405-1665)
- `protocol/data-plane/src/adapter_ws.rs` (:60-325)
- `protocol/data-plane/src/pump.rs`
- `protocol/data-plane/src/server.rs` (grep)
- `engine/tests/slice.rs` (:680-840)
- `engine/ADMISSION-PREREGISTRATION.md` (:970-999)
- `kernel/RESULTS.md` (:155-194)
- `docs/08_Testing.md`
- `docs/adr/ADR-018-what-cancellation-acknowledged-means.md` (:40-64)
- `docs/adr` (grep: ADR-012, ADR-019)
- `docs/PREREGISTRATION-TEMPLATE.md`
- `AUTONOMY.md` (§21-§21d, §22, §25)
- `state/directives/PORTABILITY-2026-09-30.md`
- `kernel/README.md` (Owner's index)
- `frontends/shell/CANCELLATION-FACTS.md`
- `frontends/shell/src/streaming/adapterWs.ts` (:30-139)
- `frontends/shell/src/streaming/viewportStreamManager.ts` (:380-429)
- `state/consults/gates/2026-10-03-port-1-linux-l1-gate2-reviewer.md` (:60-89)
- `state/consults/gates/2026-09-27-b1-engine-kernel-half-gate3-reviewer.md` (grep)
- `state/cut-archive/CUT-STATE-2026-09-24-post-tag-arc.md` (:410-429)
- `state/CUT-STATE.md` (grep)

I made no write-capable call.
