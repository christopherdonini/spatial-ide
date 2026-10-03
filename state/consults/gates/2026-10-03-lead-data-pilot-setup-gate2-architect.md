*Custodian's filing note (2026-10-03): the gate-2 architect for PR #166 has no write tool, so it returned this report as its final message, ending "sha256: not computed" (C3). The custodian saved it byte-identical, with the harness's indentation removed. The hash of record of the report as saved, from this file's line 5 (the report's first line) to the end, is eb3f4b236962e86f4caec2dc7537ad1b41dd87a33773697676c2acd32065a714. The write audit (the 2026-10-03 write-audit ruling) passed: its transcript holds no write-capable call.*

---

VERDICT: PASS
Reviewed cut/lead-data-pilot-setup @ 0e630623. PR #166, gate 2, architect.

I have no Bash. I read the working tree of the worktree C:/dev/wt/lead-data-setup and took the commit id from the dispatch. The reviewer confirms HEAD, the bytes and the counts. I made no write call of any kind. This gate covers correction round 1 only (cc8dfcce, c18f87f9, daeaa487, 0e630623 over 629fb7f).

**S1 (blocking)**

None.

**S2 (required, not blocking; both can go in the closing record or the PR body, so neither opens a correction round under the record cap)**

S2-1. **C8 needs the same record as C5.**
- Report 1's question 2 (lead-data report 1, section 6) classed C8 as "Security posture". The form's Out-of-scope line says "security none".
- C8 is now applied in c18f87f9. My gate-1 S2-2 asked the record to name C5 because lead-data had classed it as a guarantee question. Consistency asks the same for C8.
- On the merits, C8 does not touch §21a's security-posture category: AUTONOMY §21a defines it by ADR-020, ADR-009 and ADR-021, and C8 adds no surface. It does withdraw a stated property ("Nothing is exposed"), which is a guarantee-category touch in the same sense as C5.
- What the record needs: one line naming C8 as a mid-piece category touch on lead-data's classification, decided by the human (question round 41, item 1), with full gating already in place. The five-line form is not rewritten (round 25, item 2 (e)).

S2-2. **For the human, not a gate fix: the context for round 41, item 1 left out ADR-017's own answer.**
- C8 carries over unchanged the README's existing sentence, which treats it as an open question flagged for the custodian whether ADR-017's "developer/test tooling until then" has lapsed.
- Two sections of ADR-017 (Accepted, architect-blockable) answer that question:
  - "Clarification to the acceptance condition — 2026-08-07, human decision" (the F-10 ruling: it does not lapse because the machinery exists);
  - "Exposure review completion — 2026-08-17" (the condition is discharged for the shell's UI surface only; `publish-bundle` remains developer/test tooling as a CLI).
- C8's "Two product callers" names `publish-bundle` as one of the two. That sits uneasily beside the completion section, which keeps the CLI as developer/test tooling.
- The CLOSED entry for round 41, item 1 (its Context and Recommendation) does not mention either section.
- The human's typed ruling on a red line governs this README text, and the gate does not reopen it. ADR-017 outranks a README, so nothing becomes binding through C8. But the human ruled on incomplete context, so the custodian should put the two ADR-017 sections to the human at the next batched round. Any rewording waits for the human; it is not a gate fix.
- I missed this at gate 1 too. My Judgment 6 there called holding C8 correct without noting that ADR-017 already settles the CLI's standing.

**Judgments**

1. **S1-1 is discharged.**
   - I read every Status line under `docs/adr/` in the worktree.
   - Engine, "accepted ADRs": ADR-004, 005, 006, 007, 010, 013, 015, 016, 017, 018, 021, 026, 032, 033 and 035 all read Accepted (ADR-032 on its line 5).
   - Kernel, "accepted ADRs": ADR-004, 005, 006, 008, 009, 010, 015, 016, 017, 018, 021, 025, 026, 033 and 035 all read Accepted.
   - The "Proposed ADRs, binding nothing" lines are ADR-023 (engine) and ADR-012, 019, 023 and 024 (kernel). All four Status lines read Proposed.
   - "Stream tickets" now points to SKP-V0 §1 and §3. SKP-V0's Scope paragraph calls the document normative for v0. The only other "→" slots that name an ADR name ADR-035 and ADR-017, both Accepted.
   - Adding a separate line for Proposed ADRs was one of the two fixes I offered at gate 1. It does not depart from Part 4's field set.

   **Report 2's section 6 question (`kernel/PERMISSION-BOUNDARY.md` in the "→" slot): keep it.**
   - It is not an ADR, so S1-1's defect, a non-binding ADR presented as governing, does not apply.
   - Its header keeps it as "the record of the machinery's own design" and of the 2026-08-07 human rulings on F-5 and F-10. That machinery is exactly what the slot's two pub items are.
   - The header also says to cite ADR-024 going forward. Doing that in the index would recreate S1-1, because ADR-024 is Proposed and binds nothing. Pointing at the file instead of at ADR-024 is therefore the correct reading.
   - The file's body is dated "as of 2026-08-07". Its "Nothing here is exposed" paragraph is a dated record, not a current-state claim (see N1).

2. **S2-1 and S2-2 as the form's Amendment records them: sufficient under round 25, item 2 (e).**
   - *Tools.* The record says both setup dispatches held the full tool set at the harness default effort, with the value unknown (C4). It says the transcript audit found no shell call and only report-path writes. A transcript showing no shell call is stronger evidence than the refs snapshot I asked for, so S2-1 is met.
   - *C5.* The record names the category (guarantee, ADR-010 rule 6), records the reviewer's contrary gate-1 reading, says full gating already applies (§21b's mid-piece consequence) and names the routing node. It also says the Out-of-scope line is not rewritten, as round 25, item 2 (e) requires.
   - The Amendment is class 1 with its post-result first line, carries a superseded index and cites the ledger by round and item only.

3. **C8 as applied stays within the ruling and approves nothing.**
   - The bullet in kernel/README.md at 0e630623 (section "Publishing, and the trigger this file named in advance") matches C8's new text in report 1, section 3, by eye. The reviewer holds the byte check.
   - The human typed "Take C8" (round 41, item 1). The Recommendation said to take it as written and left the routing sentence to the human, who left it unchanged. The applied text does exactly that.
   - It adds no surface and claims no exposure review. Both callers really do go through `permission::boundary::execute`: `kernel/src/bin/publish-bundle.rs` and `frontends/shell/src-tauri/src/publish.rs`.
   - The ADR-017 exposure-surface review is still a red line: nothing here discharges SKP, CLI-as-product, MCP, plugin, notebook or AI exposure. The one problem is the context gap in S2-2.

4. **The `AI_DEVELOPMENT.md` pointer is within the governing-docs rule.**
   - It is one italic line appended after Part 3's section at the end of the file, so no line any record cites above it moves. Part 3's bytes are untouched (the reviewer checks).
   - It is pointer-only. It cites the clarification by its path on main and the write audit by round and item, never by line into the ledger. It restates neither.
   - "Those govern" is faithful to both sources. The clarification says it governs where it differs, and round 41, item 3 makes the transcript audit the primary check over the section's porcelain sentence.
   - It is not class 9: round 41, item 4 is a one-off ruling for this piece, not a standing rule, permanent ruling or standing directive. So landing it before the Amendment is not the round-25 "code before the amendment" failure.

5. **Gate independence is intact.**
   - lead-data drafted the fix to my finding and I gated it. lead-data's section 6 question reached me through the custodian, as a question rather than a decision. The reviewer works separately.
   - architect.md and reviewer.md are not touched in this round.
   - One new fact: dispatch 2 used Edit, which was outside its brief's tool list. It was disclosed, and the audit passes because every write-capable call targets the report path. While lead-data runs as a general agent, the audit is the only thing limiting its tools (N3).
   - Round 25 fail-by-name list:
     - no full-form budget overrun (the short form's figure is 191 against 400);
     - no class 9;
     - no wording that calls a verify-mutation run an observation of a mutation;
     - no test-text span;
     - no dispatch on a five-line form whose Out-of-scope line named a category.

**N (notes)**

- N1. The body of `kernel/PERMISSION-BOUNDARY.md` and the module doc of `kernel/src/lib.rs` still state the exposure position that C8 corrects in the README. Add both to `module-docs-stale-statements`.
- N2. The Amendment's "passed on both" cites the ruling file rather than the result. The result's reference form is round 41, item 3 (its Applied bullet "First runs"). The closing record can cite that.
- N3. Once #166 merges, dispatch lead-data as its own agent type, so that its file's tool line binds and not just the audit.
- N4. "Last verified at: af40bbf" survives the rewrite of the index sections, on report 2's argument that nothing under `docs/adr/` or `protocol/` changed up to 629fb7f. The reviewer confirms that no branch commit changes a pointer's target.
- N5. The gate-1 reviewer's reading of the Out-of-scope line ("C8 ... is not applied") is superseded by c18f87f9. Gate 2's reviewer re-reads that line.
- N6. My gate-1 Judgment 5 still stands for the window: S1-1 was found at the setup, and whether it counts toward §5's index-wrong stop condition is the human's call.

**ADR skeleton:** none.

sha256: not computed
