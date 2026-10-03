# The data-path lead pilot's setup — five-line preregistration (`AUTONOMY.md` §21d)

*Committed before any code. Placed by the human's direction of 2026-10-03 (RULED 2026-10-03, the data-path lead pilot), ahead of node 9. The pilot document is `state/directives/LEAD-DATA-PILOT-2026-10-03.md` (whole-file sha256 05c740f8352e6d218f920f1ccef5b8a461de9b625da768ce160c37bde0b4a962), and Fable's instructions are `state/directives/2026-10-03-lead-data-pilot-direction.md`, item 2. The gates are the reviewer and the architect, by that item; the architect checks gate independence.*

```
Authority: PLAN node lead-data-pilot-setup; RULED 2026-10-03, the data-path lead pilot (state/directives/2026-10-03-lead-data-pilot-direction.md, Fable items 1-2); the pilot document state/directives/LEAD-DATA-PILOT-2026-10-03.md, section 5 (scope) and Parts 2-4 (content); RULED 2026-10-03, the lead-data clarification (state/directives/2026-10-03-lead-data-pilot-clarification.md, C1-C4), which governs where it differs
Scope: .claude/agents/lead-data.md (new); AI_DEVELOPMENT.md (one dated section appended at the end); engine/README.md and kernel/README.md (the owner's-index section added to each; kernel/README.md's body brought up to date); 4 files; <= 400 changed lines, this form excluded
Change: (1) Part 2's fenced block copied byte for byte as .claude/agents/lead-data.md; (2) Part 3's fenced block appended byte for byte to AI_DEVELOPMENT.md, after a blank line; (3) lead-data's first dispatch writes one report file under state/consults/ holding the two filled owner's-index sections (Part 4's template, pointers only, each at most 60 lines, "Last verified at" a commit on main) and kernel/README.md's body update; a worker applies that report as written. That dispatch runs before lead-data.md reaches main, so it goes out as a general agent on model opus whose instructions are Part 2's body verbatim; its effort is the harness default, recorded as such. Its brief carries the 2026-10-03 lead-data clarification (C1-C4). Per C3, the custodian records git status --porcelain of the custodian checkout and of the assigned worktree before the dispatch, and afterwards the only difference allowed is its one report file. The agent returns "sha256: not computed", and the custodian's hash of the saved bytes is the hash of record.
Tests+mutation: no code or test changes. Checks, each observed by the reviewer: (1) and (2) are byte-equal to the pilot document's fenced blocks, compared by script; every index pointer resolves in the tree at its "Last verified at" commit; each index section is at most 60 lines; the kernel README's updated body states nothing the tree contradicts; verify-cites, verify-quotes and verify:plan are green. No mutation applies: nothing is executable.
Out-of-scope: ADR none; security none (no product permission or audit surface); wire none; guarantee none. The architect's and reviewer's definitions are unchanged, and so is the architect's write tool, which is the human's. No product source, test, workflow or record rule changes. Owner's-index updates after later merges belong to those pieces.
```

Amendment: class 1, correction round 1 after gate 1, written after gate 1's results were seen (a post-result amendment). References only.
- **The round.** These branch commits answer the gate-1 architect's S1-1 (`state/consults/gates/2026-10-03-lead-data-pilot-setup-gate1-architect.md`) and the gate-1 reviewer's C7 note (`state/consults/gates/2026-10-03-lead-data-pilot-setup-gate1-reviewer.md`, section N). The worker's report is `state/consults/2026-10-03-lead-data-pilot-setup-worker-report-2.md`.
  - cc8dfcce: the index sections, from `state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-2.md`;
  - c18f87f9: C7's sentence, from report 2, and C8, from `state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-1.md`, by question round 41, item 1;
  - daeaa487: the pointer, by question round 41, item 4.
- **A §21a category found mid-piece** (the gate-1 architect's S2-2; round 25, item 2 (e)).
  - Edit C5 narrows a declared ceiling's stated scope (ADR-010 rule 6). That is a guarantee touch the Out-of-scope line does not name.
  - The gate-1 reviewer's S2-1 judges it not a guarantee change. The stricter reading is recorded.
  - Full gating already applies, by the human's direction.
  - The custodian took lead-data's question 1 and routed the recomposition to `kernel-composed-ceiling-projected-stream`.
  - The Out-of-scope line is not rewritten.
- **The setup dispatches' tools** (the gate-1 architect's S2-1).
  - Both lead-data dispatches ran as general agents holding the full tool set, at the harness's default effort. The value of that effort is unknown.
  - The write audit (`state/directives/2026-10-03-write-audit-ruling.md`) passed on both: every write call targets the report path, and there is no shell call.
- **The Scope figure.** By the Scope line's counting, at daeaa487 against af40bbf, the figure is 191 lines over the same 4 files, within 400.
- **Superseded index.**
  - The two owner's-index sections as they stood at 629fb7f are superseded at cc8dfcce.
  - C7's convergence sentence at 629fb7f is superseded at c18f87f9.
  - Nothing else is superseded.
Amendment: class 1, correction round 2, written after question round 42's results were seen (a post-result amendment). References only.
- **The round.** Branch commit f59c3566 rewords `kernel/README.md`'s publish-exposure bullet to ADR-017's 2026-08-07 clarification and 2026-08-17 completion, by question round 42, item 1 (the human's typed ruling on a red line).
  - It answers the gate-2 architect's S2-2 (`state/consults/gates/2026-10-03-lead-data-pilot-setup-gate2-architect.md`).
  - The worker's report is `state/consults/2026-10-03-lead-data-pilot-setup-worker-report-3.md`.
- **C8's category** (the gate-2 architect's S2-1).
  - lead-data classed C8 as security posture.
  - The bullet withdraws a stated property ("Nothing is exposed"). That is a guarantee-category touch in the sense of C5, found mid-piece, which the Out-of-scope line does not name.
  - It adds no surface. The human decided it (question rounds 41 and 42, item 1). Full gating already applies.
  - The Out-of-scope line is not rewritten.
- **The Scope figure.** By the Scope line's counting, at f59c3566 against af40bbf, the figure is 190 lines over the same 4 files.
- **Superseded index.**
  - The publish-exposure bullet as c18f87f9 applied it is superseded at f59c3566.
  - Nothing else is superseded.
