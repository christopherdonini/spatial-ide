# The advisor's ruling ADV-2026-11-24-14, under the human's delegation of 2026-11-13, not the human's words: milestone 5 PR A: Part AF approved as it stands at 9d990d79 with row AF0a's read-back; Q2 to Q11 as the Part has them; Q1 (a) for both new suites, class 9, the architect's amendment first; one narrow architect read of plan section 2's rules and four ADR texts as its own gate row; one store test for a raise after a Dismiss

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-24-14.md in the advisory folder, 5293 bytes, sha256 f1775b578d2fdd1c3530380a194b6b1180e60e368f816bfa79054ff6fc443028, last modified at 2026-11-24T05:39:09Z by the file system. The advisor's message naming it was received at 2026-11-24T05:39:27Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-24-14, to the custodian, 2026-11-24 (05:39Z). The piece `shell-migration-milestone-5`, PR A: the words of Part AF, the twelve points, and three things the architect's build gate leaves open (row 898, PASS WITH NOTES). Read by me on main at e259a946: the gate's report whole (`state/consults/gates/2026-11-24-shell-migration-milestone-5-pr-a-build-gate-architect.md`); the form's section 9. Read on the branch at c62940ab: Part AF with its result log, the last lines of the walkthrough. The words below are the advisor's, not the human's.

1. **Part AF is approved as it stands at 9d990d79, with the one change of item 3.** That is the Part's heading, its two paragraphs, its table and its result log.
   - The gate's cite runs one line past the file's end. The closing amendment pins the Part by the lines the file has.
   - The gate marked the clauses that rest on the fixture, the watcher or the kernel, which reading cannot settle. After C-E1 and C-E2 have run at the head, each such clause of rows AF1 to AF3a is compared with what those runs recorded. A clause a run contradicts comes to me with words before the merge request.

2. **Q2 to Q11: each as the Part has it.**
   - Q2: the copies go under the walkthrough's fixture folder, as Part Q does; section 3's temp folder is for the e2e runs; operator copies are not hashed.
   - Q3: "change the file" is Part Q's touch of the modification time.
   - Q4, Q5, Q7, Q10, Q11: keep.
   - Q6: "reopen the file" is Open GeoParquet on the same copy.
   - Q8: a new start of the dev build with no DevTools step.
   - Q9: sight in the source is enough for S-6 and S-13 here, as row AC10 already does for strings no step provokes.

3. **Q12: the read-back is added to row AF0a.** The row's two cells and its log line become:

```text
Before opening anything, open DevTools and run `await window.__SPATIAL_E2E__.setResidencyArm("baseline")`. Then run `await window.__SPATIAL_E2E__.getResidencyArm()`.
```

```text
The first call resolves `{ok:true}` (Part D's D0), and the second returns `"baseline"`. AF1 to AF3 show the baseline arm, which no operator reaches in the shipped build.
```

```text
- **AF0a (what each call returned):**
```

   - My reading on main: `getResidencyArm` is registered as an e2e hook beside `setResidencyArm`, and it is async.
   - This lands in a words commit with nothing else in the walkthrough.

4. **Q1, the gate's ER-1: (a), for both new suites.** A step that can pass or end VOID and can never fail is not evidence. Neither suite has run yet, so this is a change before any result.
   - It is class 9, with its amendment first, written by the architect.
   - **C-E1 step 4.** After the reopen is admitted, the step waits, with its bound, for the old session's block to go. If the block still stands at the bound, the step FAILS; it does not end VOID. Once the block is gone the step passes on either of two readings: S-4; or the new open's refusal as the strip's top with Problems listing only the top's row. Any other reading FAILS.
   - The gate's words also ask that the new refusal carry no `Raised` line. The architect keeps that clause only if, by reading, the new open cannot raise the refusal twice without a pan. If it can, the clause is left out, and the amendment says why.
   - **C-E2 step 4** takes the same rule for the old conditions: still shown at the bound after an admitted reopen is a FAIL.
   - D-4's words follow the suite as amended, for the comment and for the e2e README's sentence. The gate's narrow read checks them.
   - The closing amendment records as class 2 that the form's end state for C-E1 and for section 9's step 3 was wrong for the baseline arm.

5. **The gate did not check part of its own list.** By its check 1, it did not read plan section 2's rules 1, 3, 4, 5, 7, 10 and 11, nor the texts of ADR-006, ADR-010, ADR-018 and ADR-021. Section 9 gives those to the architect. A check that was not made is missing evidence.
   - One narrow read by the architect closes it: those rules and those four texts against the head, and nothing else. It is filed as a gate row of its own with its own verdict. It only reads, so it may run during the sitting.
   - PR A does not leave draft before that row ends PASS or PASS WITH NOTES.

6. **The store case no test reaches** (the gate's check 3, case 3): a Dismiss of a condition raised more than once, and a raise of the same key after it.
   - One test of the store is added: raised twice, dismissed, raised again; the new condition has a new id and one occurrence, and no `Raised` count is carried over.
   - It is class 9 and goes in the same amendment as the N8 test of ADV-2026-11-24-09 item 4. It is a guard, green at the head; its proof is one mutation, observed and recorded as a dated line.

7. **For the reviewer's second attempt,** from the gate: that each class 9 amendment came before its commit, by the log; and why `App.layout.test.tsx` needed no edit.

8. **D-1 to D-3** are applied at c62940ab with the gate's words. I compare them at the merge check.

9. **Order.** Items 3 and 5 and the amendments of items 4 and 6 may be done during the sitting. Every run waits until the human says it is over. PR A stays a draft.

10. Nothing here is reserved.
