Reviewed: PR #320 at fd101297612bbafbd15a1819f44b47335240b425 (the custodian's filing note, 2026-11-14: the gate, the architect, at the head, one of the two gates from dispatch under the five-line form `governance/forms/kernel/CLOSE-RACES-THREE-UNTESTED-KERNEL-TESTS-PREREGISTRATION.md`, section 36 and its N3, PLAN node close-races-three-untested-kernel-tests, filler entry 14; dispatched 2026-11-14T19:18:33Z by a prompt naming its brief by file (sha256 1d2e4c42); run 2026-11-14T19:18:33Z to 2026-11-14T19:22:09Z by its transcript, 26 calls (Read 20, Grep 5, SubagentHandback 1), none errored, no file written by a Write or Edit call, model claude-opus-5-5; by script, every run it claims has a call behind it whose result is not an error; below, the hand-back byte for byte (with one final newline, 9129 bytes, sha256 128c90c1a19ed531ba399452920de71a9aa6ed4fd4f9b46a77d478f1d3b9e7a7). Nothing is changed.)

Reviewed: PR #320 at fd101297612bbafbd15a1819f44b47335240b425, gate architect
Branch and commit: cut/close-races-three-untested-kernel-tests @ fd101297612bbafbd15a1819f44b47335240b425 (base B′ a9c884bac1e9f675784bdc31f285d1e7a981051a; main eedcbcef369c5b85d20ed410d8323f52f91bea86)
Verdict: PASS WITH NOTES

All the words below are my own paraphrase unless marked. Line numbers are at H unless I say otherwise. Every span before kernel/src/skp.rs:4814 has the same line number at B′ and at H, because the only hunk starts at 4814. I had no shell, so the reviewer recomputes any hash.

## Findings by class

**Correctness.** None.

**Evidence.** None blocking. The base run and the M1 to M3 observations rest on the worker's report. The reviewer observes them again (Part 1 item 9).

**Documentation (must fix before the merge; no re-gate).**
- **D1. Amendment 1's "reason" bullet compares two different counts.** The form is on main at eedcbcef, and this bullet is the custodian's wording, not the human's.
  - The bullet sets "the three tests came to 135 lines" against "N4's about 121".
  - N4's 121 is 35 + 41 + 45, and N4 says "The recorded-mutation lines are included in each figure".
  - The 135 leaves out the 15 lines of the `REGISTERED MUTATION:` paragraphs, as Amendment 1's own "Final" bullet splits it. I counted the diff myself: 33 + 50 + 52 = 135 for the tests, plus 3 × 5 for the paragraphs, gives 150.
  - So the like-for-like comparison is kernel/src/skp.rs's 150 against about 121. The figures 154, 150, 135 and 15 are each right, and class 6 is right.
  - Fix: append a correction to the form. It is the custodian's record, append-only, and this is its first correction round. My words: "Correction to Amendment 1's reason bullet: N4's about 121 counts the recorded-mutation lines in, so the like-for-like figure is kernel/src/skp.rs's 150 against about 121, not 135. Reference: N4's fourth bullet; proof: `git diff --numstat a9c884ba...fd101297` gives 150 for kernel/src/skp.rs."
  - Clause check of my words:
    - "N4's about 121 counts the recorded-mutation lines in": N4's bullets give 35, 41 and 45, and its fourth bullet says the mutation lines are included. True.
    - "150 … not 135": the diff's skp.rs insertions are 150 (diff lines 31-180), and the packet's numstat agrees. True.
    - It is two sentences, it restates no earlier claim, and it is under round 12 (d)'s ceiling.

**Observation (no action required).**
- **O1. U3's shape (flag 2).** U3 calls the mint step and does not chain on to `viewport_query_attribute`.
  - This does not change what U3 shows. The product chains the steps with `?` (`viewport_query`, :1413-1415), so a mint step that refuses never reaches the attribute step.
  - U3's `expect_err` on the mint step is at least as strict as CR1's `.and_then` shape (:4672-4675): if the mint step ever succeeded, U3 would panic.
  - The Tests+mutation line's pre-code wording ("continues through … both") is disclosed in Amendment 1, which is enough.
- **O2. U1's doc comment says "refuses as the close's answer"**, which means `skp.unknown_dataset`. That is the module's existing phrase (CR3's doc, :4705), and U1 asserts the code (diff, its `assert_eq!` on `refused.code`). It is true in the module's own vocabulary.
- **O3. M1's extra failure of U2 (flag 3)** is recorded in the report only. The form's §4 rule records each registered mutation in the named test's doc comment. M1 is registered on U1 and recorded there, and U2's registered mutation is M2. One paragraph per test is enough.
- **O4. The README name "the three untested close-race tests piece"** is the worker's wording, taken from the node id. It reads as if the tests were untested, but it is a name, not a claim. Optional wording: "the close-race places' three tests piece".

## Checks

1. **Change line: holds.**
   - Each test runs in step order on its own thread, and the diff has no sleep, `thread::spawn`, `recv_timeout` or timeout.
     - U1: open, then `close`, then `StreamRegistry::mint`, then `viewport_query_attribute`.
     - U2: open, then resolve, mint, `invalidator.end_generation(ObservedChange)`, then attribute.
     - U3: open, then end, the `live_generation` precondition, resolve, `close`, then mint.
   - Every added line is inside `#[cfg(test)] mod ticket_drop_under_lock_regression` (:3454-3455), between T2 (ends :4812) and R2 (:4964). No product line changes.
   - Exactly three `#[test]` are added.
2. **Each test against the Tests+mutation line, N1 and N2.**
   - **U1** mints through the real `StreamRegistry::mint` (:236-241) after the close. The close has already run `forget_dataset`, so `attribute_ticket` returns false on its no-live arm (:628-630). Then :1526 cancels, and `ended_reason` is `None`, giving `skp.unknown_dataset` (:1531-1532).
     - Neither the test nor its doc claims that product code mints at that moment: the doc's words are "(as in CR2, no claim that product code mints at that moment)".
     - Every clause of its doc holds against :1621-1623 and :1522-1532.
   - **U2** is exact equality with the arm's literal (:1539), braces included, as OPEN-2 (A) requires. `error_of` carries `detail` in `fields` (:2162-2163).
     - The 0 return holds because `invalidate` collects only attributed tickets (:795-800), and `end_generation` cancels only those (:919-924).
     - The arm's detail is not `require_live`'s sentence (:1677-1678). Every clause of its doc holds.
   - **U3** drives N1 (3) exactly as N1 (3) states it.
     - The query resolves before step 4. `forget_dataset` removes the mark (:830). The mint step's `require_live` (:1472) then reads no mark, no closing flag and no live entry, so it answers `NotOpen` (:605-614), which becomes `skp.unknown_dataset` (:1673). This happens before `build_viewport_query` (:1473).
     - Its doc comment is true clause by clause. "The attribute step after it is not reached" holds for the product's `?` chain (:1414-1415).
     - Its event, ticket-map and precondition asserts match the form.
3. **Each test fails if its claim is false.**
   - M1 deletes :1526, the only cancel for a ticket minted after step 2 or attributed after an end (N1 (1)). U1 and U2 then fail at `assert_cancelled_before_redeem` (:5039-5051), which is the form's prediction (flag 4).
   - M2 gives the `ObservedChange` branch the coverage-lost body (:1538-1541). U2 then fails on its code assertion, and T2 passes.
   - M3 deletes :830. The mark stays, so `NotLive::Ended` turns into `engine.source_changed`, and U3 fails on its code assertion.
   - The three `REGISTERED MUTATION:` paragraphs match the report's observations (its Mutations section) by test name, assertion and `left:` value, and each names `b7133d0a` (C1, where the mutation was applied).
   - No record calls a `verify-mutation` run an observation.
4. **Comments and doc sentences, against Part 1 items 1 and 7.**
   - The three doc comments are written from the built code and are true clause by clause (check 2). U1's test double implements the real `BatchSource` and `SourceCancel` traits (Part 1 item 7).
   - README: the form path appended to the preregistration list exists at C1, because the form is on main at B′, an ancestor of C1. The Last-verified clause's "at b7133d0a" is therefore true. Neither README line is the human's wording.
   - None fails. O4 is optional.
5. **Scope and size.**
   - Two files only (packet numstat; diff). Nothing in skp.rs outside the module. No `pub` item, no new helper outside the module, no fixture file.
   - The size is 154 against 150, and class 6 is correct by AUTONOMY §21c's size-overrun clause (AUTONOMY.md:345, the five-line form kept, overrun as amendment). Amendment 1's first line says it was written after the runs were seen.
   - The route is both gates from dispatch (§36; N3). D1 is the only figure finding.
6. **ADR-035's Note items 1 and 2.**
   - U3 checks item 1's last sentence. U1 and U2 check item 2's arm, the `skp.unknown_dataset` branch and the end's-reason branch.
   - The diff edits nothing under docs/. Nothing at H makes the note untrue, so N5's stop does not arise.
   - Item 1's during-close half stays at registry level under R2 (OPEN-4 (A)).
7. **The packet's flags.**
   - 1: class 6, route and form kept (check 5).
   - 2: U3 still drives N1 (3), and its doc is true (check 2; O1).
   - 3: one paragraph is enough (O3).
   - 4: the failure point is the form's named assertion (check 3).
   - 5: the worker's wording, not the human's (O4).
   - 6: by the report, U1 to U3 pass at the base, and the reviewer re-runs it.
   - 7: departures 2 and 3 are for round 77. They touch no repository file, and nothing here depends on them.
   - 8: I re-read every source myself, and nothing in the packet is relied on unread.

Constitution: no docs/01 principle, docs/02 or docs/10 boundary, ADR-006 class, docs/08 budget or docs/07 scope is touched, because the PR adds tests only. There is no seam: the tests call the in-crate private steps, as CR1, CR3 and T2 already do.

Calls: Read 20, Grep 5, SubagentHandback 1.
Model: Opus 5.5 (claude-opus-5-5), as the harness reports it.
