*Custodian's filing note (2026-10-05): the architect's draft of Amendment 2 to `protocol/data-plane/TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md`, on Fable's round-54 advice (`state/directives/2026-10-05-fable-advice-round-54.md`), drafted on the custodian's brief at main ac0bb0e7. It arrived as a message and is extracted here by script from the SubagentHandback call in the subagent's own transcript, with nothing changed except one final newline. Its sha256, from this file's line 5 to the end, is 35a0a6e096e3d76678d926e06b8a7cae82ce090db4229dc458447549f0de7240. The amendment's fenced block is appended to the form with the custodian's 19 pins at ac0bb0e7, and nothing else in it is changed. Write audit PASS: zero write calls (Read 18, Grep 15, Glob 1, the hand-back 1). The run lasted 04:28:33Z to 04:35:06Z (111,659 subagent tokens, 35 tool uses). C3: the main checkout's porcelain held only its two pre-existing untracked items before (04:28:12Z) and after (04:35:45Z, before the append), and main stayed at ac0bb0e7. Spot checks by the custodian hold: the source-watcher form's Placeholders row, the brace-wrapped site it names, ADR-010 rule 7's progress clause, and round 5, item 4's instrument-accessor exemption. Profile paths redacted at filing: none.*

---

Reviewed: main @ ac0bb0e7
Verdict: none. This is a drafting consult, not a gate. All four points need an amendment row: three are class 9 and one is class 5.

**1. Dispositions**
1. Point 1, the discard-then-close test: needed. Row A (class 9, round 7, item 1, its addition 2) adds T5, with M5, plus M8 for the placeholder mark. No current test reaches 2d's channel-closed branch.
2. Point 2, cancel before registration: needed. Row B (class 9, the same rule) does three things:
   - it pins 2b down to one mutex over the cancelled mark and the notify slot;
   - it adds T6 in kernel/src/lib.rs, with M6;
   - it adds §8 item 20 as the gate check.
3. Point 3, the placeholder mark: needed, as a narrowing. Row C (class 5, round 54, OPEN-1) fixes the mark to the source-watcher form's §7 Placeholders row (engine/SOURCE-WATCHER-PREREGISTRATION.md:402), with no brace. That adds no site to pre-admission-change-detail-braces. T5 with M8 proves it.
4. Point 4, a discard visible in the registry record: today the answer to Fable's question is no. Row D (class 9, ADR-010 rule 7) does three things:
   - it adds a batches_discarded counter, which note_discarded increments, with an instrument accessor under round 5, item 4;
   - it adds counter assertions in T1, T1b, T3b and T5;
   - it adds M7.
- Ceilings: I do not assume the additions fit inside §7. Read from the planned shape, Product (240) and Tests (420) were already close to full. So the amendment declares its own extra lines (Product +70, Tests +70, Documentation +5, no extra files). Each category's final count is held against §7's figure plus this amendment's. §7 is not edited.

**2. The amendment**

```
### Amendment 2 — Fable's round-54 points: the discard-then-close test, cancel before registration, the placeholder mark, the discard count (rows A, B and D class 9; row C class 5)

*Written before any outcome of this piece: no test, M0 or code exists. Drafted by the architect on the custodian's brief at main ac0bb0e7. Considered: Fable's round-54 advice (`state/directives/2026-10-05-fable-advice-round-54.md`), points 1 to 4. That advice is not Authority; the human's typed rulings (round 54, OPEN-1 and OPEN-2) govern. Nothing below is a quotation.*

**Row A — point 1. Scope addition (class 9; round 7, item 1, its addition 2).**
- Grounds. Amendment 1 maps round 54, OPEN-1's clause (a channel close after a discard is never TERM_COMPLETED) to §2d and §8 item 10, and neither names a test. T1, T1b, T3a and T3b end on a Failed item, and T4 ends on halt. So no test reaches 2d's channel-closed branch, and the closing amendment could name no proof for it.
- §2: no product change.
- §3: T5's fixture is T4's synthetic source and test SourceCancel, with the cancel's delay at 0. Once its stop flag is set, the source's next next_into returns None, with no failure.
- §4: T5, an_owner_cancel_on_a_source_that_then_ends_without_failure_is_a_producer_failed_terminal_with_no_credit_granted, in protocol/data-plane/tests/candidate_a.rs.
  - Steps: no credit; wait for the plateau; the test, acting as the source's owner, calls the test SourceCancel's cancel through its own clone of the handle the factory returned; drain.
  - Asserts:
    - TERM_PRODUCER_FAILED;
    - the detail begins with `[P6 placeholder]` and contains no brace (row C);
    - 0 TAG_BATCH over the run;
    - after the terminal, resident_bytes is 0 and batches_discarded equals batches_generated (row D).
- Mutations:
  - M5: 2d's channel-closed branch sends Completed whatever was discarded. Predicted: T5 fails at its terminal-code assertion, with TERM_COMPLETED in place of TERM_PRODUCER_FAILED.
  - M8: the `[P6 placeholder]` prefix is removed from the new detail literal. Predicted: T5 fails at its prefix assertion.
- T5 needs on_cancel, so it lands with the remedy commit, as T4 does (§4). M0 does not cover it.

**Row B — point 2. Scope addition (class 9; round 7, item 1, its addition 2).**
- Grounds. The cancel-before-registration order is reachable in the product:
  - redemption hands the data plane the cancel the ticket registry keeps (kernel/src/skp.rs:300-309 @ ac0bb0e7 sha256:HASH-TBD);
  - an SKP cancel's Redeemed arm calls that cancel under the registry's lock, whatever the stream's progress (kernel/src/skp.rs:342-356 @ ac0bb0e7 sha256:HASH-TBD);
  - so the arm can run after redemption and before drive registers on_cancel.
  - C3 covers that order, and 2a's contract names its branch. T1 cancels at the plateau, long after registration, so it proves register-then-cancel only.
  - EngineCancel today holds the token alone (kernel/src/lib.rs:699-705 @ ac0bb0e7 sha256:HASH-TBD), and it is built at kernel/src/lib.rs:286 @ ac0bb0e7 sha256:HASH-TBD.
- §2, 2b made exact. EngineCancel holds its token and one mutex over two values: the notify slot and a cancelled mark.
  - cancel() cancels the token. Then, under that mutex, it sets the mark and takes the slot. It runs any taken notify after the guard drops.
  - on_cancel reads the mark under the same mutex. If the mark is set, it runs notify after the guard drops. If not, it stores notify.
  - The token's own flag is not read for this decision.
  - Why one mutex over both: otherwise on_cancel could read the mark unset, cancel could then set it and find the slot empty, and on_cancel could store a notify that nothing ever runs. That is T1's stall, in the cancel-first order.
- §4: T6, engine_cancel_runs_the_registered_notice_once_in_either_order, in a #[cfg(test)] module in kernel/src/lib.rs (EngineCancel is private to the crate).
  - Order (i): on_cancel, then cancel twice. The run count is 0 after registration and 1 after each cancel.
  - Order (ii): cancel, then on_cancel, then cancel again. The run count is 1 when on_cancel returns, and still 1 after the second cancel.
- Mutation M6: on_cancel always stores notify (the run-at-registration branch is dropped). Predicted: T6 fails at order (ii)'s first count assertion, with 0 in place of 1.
- T6 needs on_cancel and the mark, so it lands with the remedy commit. M0 does not cover it. It runs with the kernel unit tests (§9). Its lines count under §7's Product command, which includes kernel/src.

**Row C — point 3. Scope narrowing on a ruling (class 5; round 54, OPEN-1).**
- Grounds. The ruling ships the new detail string as a P6 placeholder, and §2d leaves the mark's form open.
  - The repository's form is the source-watcher form's §7 Placeholders row: each new operator string starts with `[P6 placeholder]` (engine/SOURCE-WATCHER-PREREGISTRATION.md:402 @ ac0bb0e7 sha256:HASH-TBD).
  - PLAN node pre-admission-change-detail-braces lists the sites that wrap that mark in literal braces, for example kernel/src/skp.rs:1024 @ ac0bb0e7 sha256:HASH-TBD.
- Narrowed:
  - the new detail literal begins with `[P6 placeholder]` and contains no brace;
  - the piece adds no site to that node;
  - the wording after the mark stays the human's at P6.
- Proof: T5's prefix assertion and M8 (row A).

**Row D — point 4. Scope addition (class 9; ADR-010 rule 7, its progress-observability clause, docs/adr/ADR-010-render-frames-origins-boundaries.md:85 @ ac0bb0e7 sha256:HASH-TBD; Accepted and binding per §0.8, and already in §9's architect gate).**
- Grounds: the gate question is answered no.
  - A stream's registry record is two things: its StreamState, returned by snapshot (protocol/data-plane/src/server.rs:213-219 @ ac0bb0e7 sha256:HASH-TBD), and its terminal record, which holds the stream, the terminal and an instant (protocol/data-plane/src/server.rs:173-181 @ ac0bb0e7 sha256:HASH-TBD).
  - batches_generated and rows_emitted count at generation (protocol/data-plane/src/transport.rs:200-208 @ ac0bb0e7 sha256:HASH-TBD, called at protocol/data-plane/src/pump.rs:87 @ ac0bb0e7 sha256:HASH-TBD).
  - bytes_emitted counts written bytes only (protocol/data-plane/src/transport.rs:210-213 @ ac0bb0e7 sha256:HASH-TBD).
  - No field counts batches written or dropped (protocol/data-plane/src/transport.rs:153-166 @ ac0bb0e7 sha256:HASH-TBD). The writer's sent count is a local variable (protocol/data-plane/src/adapter_ws.rs:84 @ ac0bb0e7 sha256:HASH-TBD).
  - So with 2f as drafted, a discard leaves resident_bytes at 0 and bytes_emitted unchanged. A reader can neither tell that a discard happened nor count it.
- §2, 2f extended:
  - StreamState gains batches_discarded (an AtomicU64, starting at 0).
  - note_discarded(bytes) also adds 1 to it, once for each batch 2d discards, the held batch included. Its product caller is 2d.
  - One pub read-only accessor, batches_discarded(), under the instrument-accessor exemption (round 5, item 4). Its doc says that its only caller is the test suite and names T1, T1b, T3b and T5. It also says why the count must be proven of the shipped writer: no wire field may carry it (§1), and the terminal's detail is the source's own, unchanged.
  - rows_emitted and batches_generated keep counting at generation. On the 2d paths, after the terminal, batches sent equals batches_generated minus batches_discarded.
  - Part 4's README item on the queued-batch policy says what batches_discarded counts, and that rows_emitted counts rows at generation.
  - The name carries no ADR-018 instant and no component on the scan's forbidden list (§2a's pin).
- §4: T1, T1b and T3b each gain one assertion: after the terminal, batches_discarded equals batches_generated (0 batches were sent). T3b also asserts that it is 3. These assertions are added in the remedy commit, so that the tests commit still compiles against the base interfaces (§4, M0). T5 carries the same assertion (row A).
- Mutation M7: delete the batches_discarded increment from note_discarded. Predicted: T3b fails at its batches_discarded assertion, with 0 in place of 3.

**§4, added.** M5 to M8 follow §4's mutation rule. Each is applied to the remedy commit, its test is run alone, the failure is recorded by name with the commit id, and the mutation is reverted. No verify-mutation run is called an observation (round 25, item 2 (c)).

**§2, added line.** D-3 also covers T5, T6, row D's assertions, and the observations of M5 to M8.

**§5, added.**
- P-8: after the remedy commit, T5 and T6 each pass 10 of 10 alone runs.
- P-9: after the terminal, batches_discarded equals batches_generated in T1, T1b, T3b and T5. In T3b it is 3.
- P-10: M5 to M8 each fail their test as rows A, B and D predict.
- P-11: the piece adds one `[P6 placeholder]` site and no brace-wrapped site.
- Declared unchanged, added (each line range shows no diff, origin/main...HEAD):
  - protocol/data-plane/src/transport.rs:87-94 @ ac0bb0e7 sha256:HASH-TBD (Progress: no progress or wire change);
  - protocol/data-plane/src/transport.rs:200-213 @ ac0bb0e7 sha256:HASH-TBD;
  - protocol/data-plane/src/server.rs:213-219 @ ac0bb0e7 sha256:HASH-TBD;
  - kernel/src/skp.rs:300-309 @ ac0bb0e7 sha256:HASH-TBD;
  - kernel/src/skp.rs:342-356 @ ac0bb0e7 sha256:HASH-TBD.
- I-6: T6 passes under M6.
- I-7: on a 2d path, after the terminal, batches_generated differs from batches sent plus batches_discarded. §2g would then be the wrong account.

**§7, not edited. The additions' own ceilings, declared under class 9:**
- Product (§7's Product command): at most 70 further lines. Planned: the counter, its accessor and doc, about 15; T6, about 45.
- Tests (§7's Tests command): at most 70 further lines. Planned: T5, about 50; the four counter assertions and the fixture's stop-to-None, about 15.
- Documentation: at most 5 further lines.
- Non-generated files: none further. Every file these rows touch is already in §7's list.
- Counting: by §7's own commands at the final head. Each figure is held against §7's ceiling plus this amendment's: Product 310, Tests 490, Documentation 45, files 11. A figure above that sum is class 8, with neither §7 nor this amendment edited.

**§8, added.**
20. EngineCancel decides whether to run notify now or store it from anything other than the mark held under the mutex that guards the notify slot; or cancel() sets the mark or takes the slot outside that mutex (row B).
21. The new detail literal does not begin with `[P6 placeholder]`, or it contains a brace (row C).
22. A batch discarded under 2d that note_discarded does not count; or batches_discarded()'s doc lacks its round 5, item 4 declaration (row D).

**§9, added.**
- Architect:
  - rows A to D;
  - §8 items 20 to 22;
  - the round 5, item 4 exemption, resolved against batches_discarded()'s doc;
  - T6's two orders, against EngineCancel as it lands.
- Reviewer:
  - EngineCancel read whole, for item 20;
  - every discard in the writer, against a note_discarded call;
  - §7's commands, against the sums above;
  - the M5 to M8 records, against their commits.
- Suites: unchanged. T6 runs with the kernel unit tests, and T5 with cargo test -p spatial-data-plane.

**Unchanged:** §1 (no claim is added); §5's P-1 to P-7 and I-1 to I-5; §7; §8 items 1 to 19. Code still waits for PR #175's merge (§8 item 1).

**Superseded index.** None.
```

**3. Files read**
- C:\dev\spatial-ide\protocol\data-plane\TERMINAL-WITHOUT-CREDIT-PREREGISTRATION.md (whole, Amendment 1 included)
- C:\dev\spatial-ide\state\directives\2026-10-05-round-54-open-1-open-2-ruling.md
- C:\dev\spatial-ide\DECISIONS-PENDING.md (round 54's RULED block; round 7's RULED block, item 1)
- C:\dev\spatial-ide\state\directives\2026-10-05-fable-advice-round-54.md
- C:\dev\spatial-ide\docs\PREREGISTRATION-TEMPLATE.md (classes 1 to 9, the Round 25 additions)
- C:\dev\spatial-ide\protocol\data-plane\src\transport.rs (lines 78-259)
- C:\dev\spatial-ide\protocol\data-plane\src\server.rs (lines 170-235)
- C:\dev\spatial-ide\protocol\data-plane\src\pump.rs (whole)
- C:\dev\spatial-ide\protocol\data-plane\src\adapter_ws.rs (the batches_sent lines only)
- C:\dev\spatial-ide\protocol\data-plane\tests\no_transport_leakage.rs (the FORBIDDEN list)
- C:\dev\spatial-ide\kernel\src\lib.rs (lines 236-299, 675-705)
- C:\dev\spatial-ide\kernel\src\skp.rs (lines 270-404)
- C:\dev\spatial-ide\engine\SOURCE-WATCHER-PREREGISTRATION.md (the §7 Placeholders row, line 402)
- C:\dev\spatial-ide\PLAN.yaml (node pre-admission-change-detail-braces)
- C:\dev\spatial-ide\docs\adr\ADR-010-render-frames-origins-boundaries.md (rule 7, lines 76-87)

Notes for the custodian:
- Every HASH-TBD pin is at ac0bb0e7. I read the working tree at that commit, which has no tracked changes, so recompute each hash.
- Row D's instrument-accessor ruling: the counter lands in this piece, but its only writer is the product path (2d). I read round 5, item 4's phrase about state the shipped build already maintains as covering it. The architect gate should rule on that reading explicitly.
- The row D assertions in T1, T1b and T3b must go in the remedy commit, not the tests commit. Otherwise M0's compile-at-base requirement fails.
