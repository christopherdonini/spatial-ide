*Custodian's filing note (2026-10-03): the gate-3 architect for PR #166 has no write tool, so it returned this report as its final message, ending "sha256: not computed" (C3). The custodian saved it byte-identical, with the harness's indentation removed. The hash of record of the report as saved, from this file's line 5 (the report's first line) to the end, is b5c0af782b168495eb45fee6f0b1a8bca507c3982de07bd3aea2a847df3b40c2. The write audit (the 2026-10-03 write-audit ruling) passed: its transcript holds no write-capable call.*

---

VERDICT: PASS
Reviewed cut/lead-data-pilot-setup @ 11c3fe62. PR #166, gate 3, architect.

I have no Bash, so I read the working tree of `C:/dev/wt/lead-data-setup` and took the commit id from the dispatch. The reviewer confirms HEAD, the per-commit diff, the bytes and the Scope recount. I made no write call of any kind. This gate covers correction round 2 only: f59c3566 and 11c3fe62 over 0e630623.

**S1 (blocking)**

None.

**S2 (required, not blocking; each goes in the closing record. This was the piece's second correction round, so under the record cap nothing here opens a third.)**

None new. The record notes carried forward are listed under Judgment 4.

**Judgments**

1. **My gate-2 S2-2 is resolved.**
   - **It matches ADR-017.** The bullet at f59c3566 is in `kernel/README.md`, section "Publishing, and the trigger this file named in advance", the bullet headed "No SKP message reaches it."
     - It names the shell's `binding_publish_*` commands as the UI surface for which the acceptance condition was discharged on 2026-08-17. This matches ADR-017's section "Exposure review completion — 2026-08-17", which discharges the condition for the shell's UI surface, and the 2026-08-17 exposure review above it, which says "this UI surface only".
     - It says ADR-017 keeps `publish-bundle` as developer/test tooling. This matches the same completion section, and also "Clarification to the acceptance condition — 2026-08-07, human decision" (the condition does not lapse because the machinery exists).
     - The open-question sentence is gone, which is right because the clarification answers that question.
     - "product callers" is gone too, which removes the tension I raised at gate 2.
     - The bullet extends the discharge to no other surface. "No SKP message reaches it" holds the SKP line, and nothing is said of CLI-as-product, MCP, plugin, notebook or AI.
   - **It stays within the ruling.** Question round 42, item 1 described the rewording element by element: two callers, both through the permission boundary, each with its ADR-017 standing, and the open-question sentence dropped. The applied text has exactly those elements. The rest is wording C8 already carried (the SKP and `protocol/` sentence, "binding-local", the `publish.rs` path).
   - **It approves nothing.** It adds no surface, discharges nothing and claims no review. It states two existing facts of ADR-017. The ADR-017 exposure-surface review for SKP, CLI-as-product, MCP, plugin, notebook and AI is still a red line.

2. **The form's correction-round-2 Amendment meets my gate-2 S2-1 under round 25, item 2 (e).**
   - It names lead-data's "security posture" class for C8.
   - It records C8 as a guarantee-category touch found mid-piece. The phrase "Nothing is exposed" byte-matches the pre-piece bullet (on main, `kernel/README.md`, the same section).
   - It says the bullet adds no surface, so it is not a new exposure surface under §21b.
   - It names who decided, by round and item only (question rounds 41 and 42, item 1), and says full gating already applies (§21b's mid-piece clause).
   - It says the Out-of-scope line is not rewritten, as the template's "Out-of-scope at dispatch" paragraph requires.
   - It is class 1, written post-result, with a superseded index, no line cite, no ledger line cite and no self-line.
   - The 190 figure is the reviewer's to recount.

3. **Gate independence is intact.**
   - My gate-2 S2-2 sent the wording to the human and said it was not a gate fix. The custodian drafted the description, the human ruled it in typed words, and a worker applied it (worker report 3). Lead-data took no part in this round.
   - I gate the applied text against ADR-017 and the ruling, not against any text of mine.
   - Only the two named commits are in the round. Whether `architect.md` and `reviewer.md` are untouched is the reviewer's diff check.
   - **What is new:** the edit rests on a one-off red-line ruling, not on a lead-data report under Change (3). Like the gate-2 pointer, that makes it not class 9 (round 25, item 2). The Amendment records it by its ruling.
   - Round 25 fail-by-name list: no full form, so no class 8. No class 9. No `verify-mutation` wording. No test-text span. No dispatch on a five-line form whose Out-of-scope line named a §21a category.
   - Question round 42, item 2 settles my gate-1 Judgment 5 and gate-2 N6: the setup is excluded from the §5 count.

4. **What the closing record for node `lead-data-pilot-setup` must carry** (written on main after #166 merges; references only):
   - (a) PR #166 and its merge commit.
   - (b) The form at the merge commit: the five-line block and both Amendments, cited by amendment number (correction rounds 1 and 2), never by line.
   - (c) Authority:
     - the data-path lead pilot ruling and the 2026-10-03 clarification, by the form's own Authority references;
     - question round 41, items 1 to 4, and question round 42, items 1 to 3, by round and item.
   - (d) The applied text, pinned at the merge commit: both owner's-index sections; the `kernel/README.md` body; the publish-exposure bullet, by its section.
   - (e) Reports, by path with the hash of record in each filing note: lead-data reports 1 and 2; worker reports 1, 2 and 3.
   - (f) Gate reports: gates 1 to 3, architect and reviewer, under `state/consults/gates/`.
   - (g) The Scope figure: Amendment 2's figure, and the gate-3 reviewer's recount.
   - (h) The category touches: C5 by Amendment 1, C8 by Amendment 2.
   - (i) The write-audit result: question round 41, item 3, the Applied bullet "First runs". Also the audits of the gate-2 and gate-3 architect runs, by their filing notes.
   - (j) The trial log: the gate-1 architect's S1-1 is a setup finding, excluded (question round 42, item 2).
   - (k) The record-round count: 2.
   - (l) Follow-ups, by node:
     - `module-docs-stale-statements` (gate-2 architect N1; lead-data report 1, section 6's notes);
     - `kernel-composed-ceiling-projected-stream` (C5);
     - `subagent-write-audit-script` (question round 42, item 3);
     - lead-data as its own agent type (gate-2 architect N3).
   - (m) The reviewers' S2 record notes left to the closing record:
     - `state/consults/gates/2026-10-03-lead-data-pilot-setup-gate1-reviewer.md`:
       - S2-2: reference the C8 ruling by round and item (question round 41, item 1; question round 42, item 1), and record that C5 was taken where report 1 marked it held.
       - S2-4: the four `kernel/README.md` line references in lead-data report 1, section 4 are pinned to af40bbf, and the merge moves them.
     - `state/consults/gates/2026-10-03-lead-data-pilot-setup-gate2-reviewer.md`:
       - S2-1: the superseded index must also name the pre-piece "Nothing is exposed" bullet (af40bbf), superseded at c18f87f9. Amendment 2's index names only the second step, c18f87f9 to f59c3566.
       - S2-2: cite question round 41, item 3 for the audit result. Dispatch 1's "no shell call" resolves only to a draft, which may be named as evidence, never as Authority.
       - S2-3: the pointer's second source, settled by my gate-2 Judgment 4; reference that judgment.

**N (notes)**

- N1. The ledger's Applied line for question round 42, item 1 says "applied byte for byte", but the question gave a description, not bytes. Worker report 3 carries only truncated hashes. The closing record should cite the bullet by its merge-commit pin as the applied text, and not as a byte copy of the question.
- N2. The rewording keeps C8's `frontends/shell/src-tauri/src/publish.rs` parenthetical. The gate-2 reviewer's N notes that the commands are defined in `commands.rs` and reach the boundary through `publish.rs`. Add it to `module-docs-stale-statements`; it is not a gate fix.

**ADR skeleton:** none.

sha256: not computed
