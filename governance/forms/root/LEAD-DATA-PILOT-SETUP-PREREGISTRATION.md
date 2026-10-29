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
Amendment: class 1, the closing record, written after the merge (a post-result amendment). References and hashes only.
- **(a) Merged:** PR #166 merged on 2026-10-03 at 12:45:15Z as merge commit ab70bf87, at head 11c3fe62.
- **(b) The form:** this five-line block, and its first and second Amendment lines (correction rounds 1 and 2).
- **(c) Authority:** the Authority line above; question round 41, items 1 to 4; question round 42, items 1 to 3.
- **(d) Applied text:**
  - `engine/README.md:495-527` @ ab70bf87 sha256:a9d21c9e0f5fc118439240b35ad7c4800cb73e70220f298b561dcce4de77da43
  - `kernel/README.md:346-382` @ ab70bf87 sha256:0b26f5054068eed46f1485abff1eaf29fcb5a8759883e27061cb0acfd8c8ac5d
  - `kernel/README.md:237-241` @ ab70bf87 sha256:cf5c6d24fa4bef4b588070acde755149fc387564371f0aa67b37c2d16513902b. This is the publish-exposure bullet, and it is cited by this pin, not as a byte copy of question round 42's description.
  - The agent file and the `AI_DEVELOPMENT.md` section are the gate-1 reviewer's byte checks.
- **(e) Reports.** Each filing note carries the report's hash of record.
  - `state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-1.md` and `-lead-data-report-2.md`
  - `state/consults/2026-10-03-lead-data-pilot-setup-worker-report-1.md`, `-worker-report-2.md` and `-worker-report-3.md`
- **(f) Gate reports:** `state/consults/gates/2026-10-03-lead-data-pilot-setup-gate1-architect.md` and `-gate1-reviewer.md`, and the same names for gates 2 and 3.
- **(g) The Scope figure:** the second Amendment line's figure, recounted by the gate-3 reviewer.
- **(h) Category touches:** C5 by the first Amendment line, C8 by the second.
- **(i) Write audit:** question round 41, item 3, Applied, "First runs"; and the gate-2 and gate-3 architect runs, by their filing notes.
- **(j) Trial log:** the gate-1 architect's S1-1 is a setup finding, excluded by question round 42, item 2.
- **(k) Record rounds:** 2.
- **(l) Follow-ups:**
  - `module-docs-stale-statements`;
  - `kernel-composed-ceiling-projected-stream`;
  - `subagent-write-audit-script`;
  - lead-data dispatched as its own agent type (the gate-2 architect's N3).
- **(m) The reviewers' record notes:**
  - gate-1 S2-2: C8 is ruled by question round 41, item 1 and question round 42, item 1. C5 was taken, though lead-data report 1 had held it.
  - gate-1 S2-4: report 1's section 4 line references are pinned to af40bbf, and the merge moves them.
  - gate-2 S2-1: see the index below.
  - gate-2 S2-2: the audit result is cited as in (i). Dispatch 1's "no shell call" is evidence in `state/drafts/weekly-window-2026-10-09.md`, item B2, not Authority.
  - gate-2 S2-3: settled by the gate-2 architect's Judgment 4.
- **Superseded index.**
  - `kernel/README.md`'s pre-piece bullet "Nothing is exposed", as at af40bbf, was superseded at c18f87f9, and that text in turn at f59c3566.
  - Nothing else is superseded.
