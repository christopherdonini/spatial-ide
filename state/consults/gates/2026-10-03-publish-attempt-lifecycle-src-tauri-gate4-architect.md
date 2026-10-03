*Custodian's filing note (2026-10-03): the gate-4 architect for PR #165 has no write tool, so it returned this report as its final message, ending "sha256: not computed" (the 2026-10-03 lead-data clarification, C3). The custodian saved it byte-identical, with the harness's indentation removed, and commits it below the rule. The hash of record of the text below the rule, from its fifth line to the end, is 26407f5c8619961fc1bb4e15e41bb369ce0ca475a615a743c77e8398fb4c9a1a, computed by the custodian from the saved bytes.*

---

VERDICT: PASS
Reviewed cut/publish-attempt-lifecycle-src-tauri @ f73befc. PR #165, gate 4, architect.

Anything I say below about a cited span is paraphrase; I quote nothing. The local branch ref and its origin ref both read f73befc (full id f73befc6978e2c9197a4594f6158f18e7d042a3a). Amendment 3 exists only on the branch, so I name it in words at f73befc, by section, amendment and item, never by line. I computed no hash. I have no shell, so I did not check that f73befc touches only the form or that it is append-only against 7bb01d6. Both are for the reviewer to recount.

## S1 (blocking)

None.

## S2 (not blocking)

1. **The heading names two classes but does not say which item has which.** Item 1 is class 1, a post-result row recording what gate 3 invalidated (round 15 (g)). Item 2 is class 3, a pointer only. The first body line meets class 1's post-result convention. The mapping can be read off the items, so this does not block. Append-only forbids relabelling it.
2. **Item 1's defect sentence has the same content as Amendment 2 item 1's first clause.** This is not a restatement under round 12 (d). The item replaces Amendment 2 item 1 outright, so the earlier clause no longer stands. The sentence also carries none of Amendment 1 item 4's claims: no 55, no 694, no Final figures. This is the defect form my gate-3 fix prescribed.

## Judgments

**1. Gate-3 S1-1: discharged by Amendment 3 item 1 at f73befc.**
- **Ceiling.** Three sentences: the defect, the corrected reference, the proof. That is round 12 (d)'s ceiling, and it is under it, not over. The bold lead-in is a label, and I counted it the same way I counted Amendment 2 item 2 at gate 3.
- **No restatement.** No figure appears. The proof names §7's command and the two ranges, ff57832...4d92733 and ff57832...0391787, without their results. The corrected reference is S1-2 of the gate-2 reviewer report, which is tracked on main and carries the +21 recount, so a reference carries the claim (record cap).
- **Other checks clean.**
  - Nothing is presented as verbatim, and there is no discharged or done clause (round 7).
  - The only self-reference, to §7, is by section (round 14). There is no line cite into the form or the ledger.
  - There is no hash at a branch commit (round 15 (e); round 25 item 2).
  - No record calls a `verify-mutation` run an observation.
  - §7's budget line is unedited at f73befc, and the overrun stays recorded as class 8 in Amendment 1 item 4 (round 25 item 2).

**2. Superseded index and classes: right.**
- **(e): met.** Item 2 ends the round with an index that names Amendment 2 item 1. Amendment 2 item 3's index entry is not replaced, only one item it points to. So the chain still resolves by reading the last amendment first: Amendment 1 item 4's Reason, superseded by Amendment 2 item 1, superseded by Amendment 3 item 1. Not naming Amendment 2 item 3 is correct, by the condition my gate-3 fix set.
- **Classes 1 and 3: right,** as in S2-1.
- **Record cap.** This is round 2 of 2, and it passes. No round 3 is open. No new clause is proposed.

**3. Node 8's closing record: my gate-3 Judgment 3, confirmed with these amendments.** It carries references and hashes only, and it is written on main after #165 merges.
- **Merge facts.** #165's merge commit is at its final head, which is f73befc unless a later commit lands, not 7bb01d6. With a merge commit, 7bb01d6 and f73befc join the reachable set my gate-3 list named.
- **Gate reports by path under `state/consults/gates/`:** gates 1, 2, 3 and 4, for both roles.
- **§7.** Cite Amendment 1 item 4, read through Amendment 3 item 1, by amendment and item. Restate no figure.
- **The reviewer's gate-2 S2-2 and S2-3: carried here, by reference only.** Amendment 3 did not carry them.
  - S2-2 is against Amendment 1 item 3's statement that T4 asserts the drain.
  - S2-3 is against Amendment 1 item 7's T4 index entry.
  - Each is cited by report path and finding id, with no prose re-describing T4.
  - Because these references make the two spans read through the findings, the closing record ends with its own superseded index naming those two spans and nothing else (round 12 (e)). This amends my gate-3 line that the closing record adds no index unless it supersedes something itself: now it does.
- **M4 row: unchanged from gate 3.** It is class 3 under round 14's test-text exception. The old span is pinned at 4d92733. The replacement pin is at 0391787 once the merge makes it reachable from main. Each pin carries its own line numbers, is written contiguous on one line (round 15 (d)), and is recomputed by the reviewer.
- **Kept unchanged:**
  - the human's sight of KNOWN-LIMITATIONS 30 under §8 item 14, cited by question round and item;
  - R1 queued and unrun, with its queue entry named, and nothing about the S3 seam or Part R called discharged;
  - the four routed nodes by id;
  - PLAN `evidence {pr}` set only in the done commit.

**4. Reduction.** Not needed, because this round passes. The record at f73befc is already references for everything the record cap reaches. If any record-fidelity defect in this piece is found from here on, I reduce it to references in the closing record. It is not a round 3, and the piece lands (record cap).

## N

1. Gate-3 N2 stands. #165's body should name the M4 row (round 25 item 2 (d)) and keep the merge-commit instruction.
2. The reviewer confirms that f73befc is the only commit over 7bb01d6, that its numstat outside the form is zero, and that the form is append-only against 7bb01d6.
3. No ADR skeleton: no decision is missing.

Relevant files:
- C:/dev/wt/publish-lifecycle/frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-03-publish-attempt-lifecycle-src-tauri-gate3-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-03-publish-attempt-lifecycle-src-tauri-gate2-reviewer.md
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md

sha256: not computed
