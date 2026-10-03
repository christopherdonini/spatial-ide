*Custodian's filing note (2026-10-03): the gate-3 architect for PR #165 has no write tool, so it returned this report as its final message, ending "sha256: not computed" (the 2026-10-03 lead-data clarification, C3). The custodian saved it byte-identical, with the harness's indentation removed, and commits it below the rule. The hash of record of the text below the rule, from its fifth line to the end, is 188ee7bc731d40c351a7e473216a76de5742745097119132fb03eb2537407651, computed by the custodian from the saved bytes.*

---

VERDICT: FAIL
Reviewed cut/publish-attempt-lifecycle-src-tauri @ 7bb01d6. PR #165, gate 3, architect.

Anything I say below about a cited span is paraphrase; I quote nothing. The local branch ref and its origin ref both read 7bb01d6 (full id 7bb01d6be97cfa8879e554f069c4c9faf5f24fad), and the worktree HEAD is that branch. Amendment 2 exists only on the branch, so I name it in words at 7bb01d6, by section, amendment and item, never by line. I computed no hash.

## S1 (blocking)

1. **Amendment 2 item 1 is over round 12 (d)'s ceiling, and it restates Amendment 1's claim.** The span is the form's §10, Amendment 2 item 1, at 7bb01d6.
   - **Too many sentences.** The item runs four sentences. Its first bullet has two: the Reason's sum, then the explanation that the count rose by 21, not 55. Its second and third bullets have one each. Round 12 (d) allows at most three, and a correction over the ceiling fails the gate by name.
   - **Restatement.** The proof sentence repeats Amendment 1 item 4's Final figures (675 insertions and 40 deletions over ff57832...0391787). The first sentence retells item 4's Reason. Round 12 (d) says a correction never restates an earlier amendment's claim, and the record cap fails prose that restates what a reference could carry. Both figures are already in the gate-2 reviewer report's S1-2, which the item cites.
   - **The substance is right.** The corrected reason (the count rose by 21 over 4d92733, because the round edits lines the piece had already added) matches the reviewer's gate-2 recount and my gate-2 S2-1. Only the form of the item fails.
   - **Fix:** record-correction round 2 of 2, the last round, appended as Amendment 3. It supersedes Amendment 2 item 1 in at most three sentences:
     - the defect: Amendment 1 item 4's Reason does not give §7's count;
     - the corrected reference: the gate-2 reviewer report's S1-2 (+21 over 4d92733);
     - the proof: §7's command over the ranges ff57832...4d92733 and ff57832...0391787, naming the ranges without the figures.

     It ends with a superseded index that names Amendment 2 item 1, and item 3 if that index entry is replaced (round 12 (e)).

## S2 (not blocking)

1. **The class label leaves out class 1.**
   - Item 2 is class 3: it moves where Amendment 1's index points and changes no claim.
   - Item 1 changes a claim, the Reason. Class 3 never changes a claim (`docs/PREREGISTRATION-TEMPLATE.md`, class 3). A row that records what a gate round's findings invalidate is class 1 (round 15 (g)).
   - Amendment 2's first body line already follows class 1's post-result convention, so the substance is there and only the heading is short. Append-only forbids relabelling Amendment 2. Round 2's heading should name classes 1 and 3.
2. **The reviewer's gate-2 S2-2 and S2-3 are not carried.**
   - S2-3: Amendment 1 item 7's T4 entry names the assertion line, which did not change. What changed at d0184eb is the join order and the wait's argument.
   - S2-2: Amendment 1 item 3 says T4 asserts the drain, which overstates it. T4 now proves only that the registry is empty after the join.
   - Round 2 is the last record round. Fold both into it within the same ceiling, citing the reviewer's S2-2 and S2-3 by reference. If not, the closing record references them, and nothing else re-opens.
3. **Item 2 checked against the tree at 7bb01d6.**
   - The next-to-last sentence of R1's Expected-outcome cell in Part R is the advice to repeat from step 2 and close during `verifying-source`.
   - The Before-R1 notes include the `publish-bundle` build bullet.
   - The 4d92733 side and the cell-by-cell byte equality are for the reviewer to recount.

## Judgments

**1. Discharge under round 12 (d) and (e).**
- **Reviewer S1-1 (Amendment 1 item 7's walkthrough entry): discharged by Amendment 2 item 2.**
  - It is three sentences and references the gate-2 reviewer report's S1-1.
  - It states the corrected span and restates no earlier claim. The defect sentence is left out, which round 12 (d)'s rider allows.
- **My S2-1 and the reviewer's S1-2 (item 4's Reason): not discharged.** The content is correct but the form fails, as S1-1 above sets out.
- **(e): met.** Amendment 2 ends with a superseded index (item 3) that names both Amendment 1 bullets it replaces.
- **The other gate-2 checks pass.**
  - There is no discharged or done clause, and no text is presented as verbatim.
  - Both cited gate-2 reports are tracked on main.
  - There is no line cite into the form or the ledger, and no hash at a branch commit.
  - No record calls a `verify-mutation` run an observation.

**2. Class and record cap.**
- Class 3 is right for item 2. Item 1 is class 1 (S2-1 above), and that does not block.
- **Within the cap.**
  - Amendment 1 was the record of the gate-1 product round, not a correction of an earlier record. Amendment 2 is therefore record-correction round 1 of 2, as its first line says and as d1f4c87's message on main counts it.
  - The S1-1 fix is round 2, the last. If round 2 fails, the architect reduces the record to references and the piece lands (record cap).
  - No new clause is proposed.

**3. Node 8's closing record: my gate-2 Judgment 4, amended.** It carries references and hashes only.
- **Merge facts.**
  - #163: merge commit 4e3c8a8, at head 4d92733.
  - #165: its merge commit, at its final head, which is the round-2 commit, not bfd68af.
  - Both PRs merged by merge commit, so 4d92733, b125721, d0184eb, 0391787, bfd68af, 7bb01d6 and the round-2 commit are reachable from main.
- **Gate reports by path under `state/consults/gates/`:** gates 1, 2 and 3 and round 2's gate, for both roles.
- **§7: amended.** Drop my gate-2 entry that the closing record carries a correction of item 4's Reason. That correction now lives in the form (Amendment 2 item 1, as superseded by round 2). The closing record cites it by amendment and item and does not restate the figure.
- **Superseded index: amended.** Drop the standalone entry. Amendment 2 item 3 and round 2's index carry it. The closing record adds an index only for what it supersedes itself.
- **M4 row (my gate-2 S2-2): kept, with one change.** It is class 3, under round 14's test-text exception.
  - The superseded span is pinned `frontends/shell/src-tauri/src/publish.rs:<a>-<b> @ 4d92733 sha256:<hex>`; 4d92733 is on main now.
  - The replacement pin moves from bfd68af to 0391787, the commit Amendment 1 item 7 names it by in words, once the merge makes 0391787 reachable from main (round 25 item 2 (d); round 15 (e)).
  - Each pin carries its own line numbers, because they may differ between the two commits. Each is written contiguous on one line (round 15 (d)), and the reviewer recomputes both hashes.
- **Kept unchanged from gate-2 Judgment 4.**
  - The human's sight of KNOWN-LIMITATIONS 30 under §8 item 14, cited by question round and item and not inferred from a merge click.
  - Row R1 queued and unrun, with its queue entry named. Neither the S3 seam nor Part R is called discharged until R1's result log is filled.
  - The routed nodes by id: `publish-lifecycle-drain-followups`, `audit-unknown-outcome-at-exit`, `shell-macos-last-window-convention` and `prepare-cancel-key-per-dataset`. The first now also carries my gate-2 S2-3 and S2-4 and the reviewer's gate-2 S2-1.
  - PLAN `evidence {pr}` set only in the done commit.
- **Added.** The reviewer's gate-2 S2-2 and S2-3, by reference, if round 2 does not carry them (S2-2 above).

## N

1. The commit at 7bb01d6 is described as form-only. The reviewer confirms that its numstat outside the form is zero and that the form is append-only against 4d92733.
2. My gate-2 N1, N3 and N4 still stand. Gate-2 N2 (PR body: KNOWN-LIMITATIONS 30 byte-identical, and a merge commit, never a squash) was confirmed by the reviewer at bfd68af. The PR body should also name the M4 row, as round 25 item 2 (d) requires.
3. No ADR skeleton: no decision is missing.

Relevant files:
- C:/dev/wt/publish-lifecycle/frontends/shell/PUBLISH-ATTEMPT-LIFECYCLE-SRC-TAURI-PREREGISTRATION.md
- C:/dev/wt/publish-lifecycle/frontends/shell/MANUAL-WALKTHROUGH.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-03-publish-attempt-lifecycle-src-tauri-gate2-architect.md
- C:/dev/spatial-ide/state/consults/gates/2026-10-03-publish-attempt-lifecycle-src-tauri-gate2-reviewer.md
- C:/dev/spatial-ide/docs/PREREGISTRATION-TEMPLATE.md

sha256: not computed
