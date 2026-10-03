*Custodian's filing note (2026-10-03): the gate-1 architect for PR #166 has no write tool, so it returned this report as its final message, ending "sha256: not computed" (the 2026-10-03 lead-data clarification, C3). The custodian saved it byte-identical, with the harness's indentation removed, and commits it below the rule. The hash of record of the text below the rule, from its fifth line to the end, is bee6108607e284cec21c9d4d126ae2d1c057c4a9dee7318cedc63db8cdce3894, computed by the custodian from the saved bytes.*

---

VERDICT: FAIL
Reviewed cut/lead-data-pilot-setup @ 629fb7f. PR #166, gate 1, architect.

I have no Bash, so I read the worktree at C:/dev/wt/lead-data-setup and took the commit id from the dispatch. The reviewer confirms HEAD and does every byte check. Verdicts: Correctness PASS · Evidence PASS · Documentation FAIL (one bounded correction round on summary-class text, AUTONOMY §22).

**S1 (blocking)**

S1-1. **Proposed ADRs are listed as governing.** In both owner's-index sections at 629fb7f, the "Governed by" line lists ADRs whose own Status lines say Proposed and "binds nothing":
- kernel/README.md's index lists ADR-012, ADR-019, ADR-023 and ADR-024;
- engine/README.md's index lists ADR-023;
- the kernel index's "Stream tickets" entry uses ADR-019 as its authoritative source (Part 4's "→" slot).

The tree contradicts this: ADR-019 and ADR-024 say they are not architect-blockable, ADR-023's decision is undrafted, and ADR-012 awaits approval. The index exists to be cited instead of re-reading the module (pilot §5, acceptance). If it labels non-binding ADRs as governing, every lead draft inherits that error. Cited as settled design it is the error CLAUDE.md forbids for ADR-011, and it counts toward §5's stop condition "a gate finds the index wrong twice".

Fix: in the two index sections, mark each Proposed ADR as not binding, or list them apart from the governing ones, and re-verify against the Status lines. The text is lead-data's under C1, so the custodian routes it, a worker applies it, and the reviewer checks it. The fix adds no rule.

**S2 (required, not blocking)**

S2-1. **The setup dispatch's tool set is not recorded.** The form's Change item (3) records the model, Part 2's body as the instructions and the default effort. It does not record the tools the general agent held. Part 2's body leaves out the frontmatter's tools line, so that dispatch was not limited to Read, Grep, Glob and Write. If it held Bash, it could act on refs, and C3's porcelain check does not see a commit on another branch or a push. The report saying it used "Read, Grep and Glob only" is a self-report. Record the tools held, or "unknown" per C4. If Bash was held, the custodian states whether refs were unchanged across the dispatch window.

S2-2. **C5 touches a §21a category the form says it does not.** C5 narrows the scope of a declared ceiling: the composed per-stream table, under ADR-010 rule 6. lead-data itself classed it as a guarantee question. The form's Out-of-scope line says "guarantee none". Under Round 25 (e), a category found mid-piece follows §21b, and the committed five-line form is not rewritten. §21b's consequence, full gating, is already met: the direction puts both gates on this piece. The PR body (or one Amendment line) should name C5 as the mid-piece guarantee-category touch, the custodian's taking of question 1, and the routing to `kernel-composed-ceiling-projected-stream`.

**Judgments**

1. **lead-data's role (Part 2, read with C1-C4).** It cannot approve, review, gate, merge, place or order work, or review its own draft. The agent file forbids each of these, and it has no Bash, so it cannot commit, push or merge. architect.md and reviewer.md are unchanged at 629fb7f:
   - each has the same line count as on main;
   - neither mentions lead-data or the owner's index;
   - architect.md still carries Read, Grep and Glob only.

   Neither gate is told to rely on lead-data's output. For in-module pieces the pilot actually gains independence: before, the architect drafted and then gated its own draft; now the drafter and the gate differ.
2. **No path lets a draft bypass the gates.**
   - Shared records: lead-data writes only into the working tree, and only the custodian stages and commits.
   - C1: the index update lands inside the implementation PR, under that PR's gates, and the final review checks it against the diff.
   - C2: whether lead-data flags a piece as crossing decides who drafts, not whether the architect gates. A missed flag is still caught by the architect's docs/02 and docs/10 boundary check.

   One question for the human (I draft no rule): when lead-data drafts a five-line form, its Out-of-scope line decides between the single-gate and full routes. AUTONOMY §21d makes that line "the custodian's written claim", and the human should confirm it stays so.
3. **The Write grant: C3 detects, it does not enforce.** It misses:
   - (a) writes outside the two checked trees: other worktrees, user-level configuration, memory files;
   - (b) further edits to a file that was already dirty, whose porcelain line stays the same (C3 explicitly keeps such changes);
   - (c) new files inside an already-untracked directory, which porcelain collapses without `-uall` (main's checkout has one now);
   - (d) ignored paths.

   Options for the human only:
   - a harness permission rule scoping this agent's Write to state/consults/;
   - porcelain with all untracked files shown and ignored files included, plus content hashes of dirty files taken before and after;
   - removing Write so the report comes back as a message, as the architect's and reviewer's do now (C3 already has the custodian hash the saved bytes).
4. **AI_DEVELOPMENT.md placement and wording.** It is appended at the end, after Amendment 6, as the append-at-end rule requires, and it is Part 3 by eye (the reviewer checks the bytes). Two of its sentences are superseded on arrival:
   - "after a merge" for the index update, which C1 moves to before the final gate;
   - the porcelain sentence, which C3 restates as "only difference allowed" and extends to the architect's dispatches.

   The clarification governs and travels in every brief, but someone reading AI_DEVELOPMENT.md alone sees the old mechanics. Whether to append a pointer to the clarification is the human's call, since Part 3 is copied verbatim by direction.
5. **The setup dispatch.** It is acceptable for the setup: its output went through both gates and C3 passed. The pilot's measurement should treat it differently:
   - exclude it from the four measured pieces and from §5's evidence for acceptance and stop, as C4's separate setup cost implies;
   - record its effort as "harness default" with the value unknown;
   - record its tools as S2-1 says.

   It is no evidence of how the lead drafts at high effort, with its file's tool limits.
6. **Index sections and kernel README edits.** Apart from S1-1, the indexes are pointers. C7 restates ADR-035, ADR-019 and ADR-021/023 behaviour in README prose, and its watcher sentence restates KNOWN-LIMITATIONS 24 without pointing to it. That is allowed in a README body but is a drift risk (N). No edit changes a guarantee the code or tests provide:
   - C1b and C5 withdraw over-claims (the shell does depend on both crates; the projected stream was never inside the 12 MiB engine row);
   - the 92 MiB figure stays true for the non-projected stream that kernel/tests/scale_pass_a6.rs measures.

   C5 narrows what the README claims. It is not a docs/08 budget change and not a red line, so the custodian's taking of it holds. Holding C8 is correct, since the ADR-017 exposure-surface review is a red line (AI_DEVELOPMENT.md, the red-lines section).
7. **Constitution.** This is development practice, outside 00-13 (AI_DEVELOPMENT.md's preamble). There is no docs/01 issue, no change to docs/02's module map, no ADR edited, no wire touch, no perf claim, and nothing ADR-006 classes. On the Round 25 fail-by-name list: no short form was dispatched naming a category; there is no class 8, 9 or mutation wording; there is no test-text span.

**N (notes)**

- N1. After C5, the README declares no composed ceiling for the live projected stream (ADR-010 rule 6). The gap existed before this PR and is now visible. Until `kernel-composed-ceiling-projected-stream` lands, consider whether it belongs in KNOWN-LIMITATIONS.
- N2. Because C8 is held, the bullet saying nothing is exposed stays in kernel/README.md at 629fb7f, so the body is "up to date" except for that bullet. The PR body should name the OPEN entry.
- N3. The Scope line declares ≤ 400 lines, above §21d's field bound of 150. Under §21c's counting rule (code and tests) this docs-only diff counts close to zero, and full gating is in place anyway. No action.
- N4. lead-data.md's final-message line asks for the sha256, which C3 overrides with "not computed". C3 governs, and the human ordered the file left unedited.
- N5. The C6 line exceeds 100 columns. It is cosmetic.
- N6. C7 cites FILTER-BIND-COERCIONS §2, while the report's "Why" for C7 cites §1. The reviewer resolves which is right.
- N7. lead-data's report notes two things outside this Scope: the engine README body calls Accepted ADRs (013, 015, 016) Proposed, and kernel/src/lib.rs's module doc carries the stale statements that C1a, C1b and C8 correct in the README. Route them to the queue.

**ADR skeleton:** none.

sha256: not computed
