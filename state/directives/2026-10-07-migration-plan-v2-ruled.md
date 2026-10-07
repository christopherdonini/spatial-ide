# Directive — the shell-migration plan, second version, ruled; milestone 1 placed (the human, verbatim)

*Custodian's filing note (2026-10-07): the human's message, received at 19:23:41Z by the session transcript, as pasted content. Below the rule is the pasted text, byte-copied by script from the transcript without the harness's paste markers, with one final newline and nothing else changed (lines 6 to 30). It names no other project. Item 1 was done first: both files were copied from the human's advisory folder for this project into `state/directives/`, and each matched its stated sha256 and size. `SHELL-MIGRATION-PLAN-2026-10-07.md` is c154b27b936ecee2a962c730ef2ebb019dc935038eb39481234ab74e985485ee, 34,489 bytes. `O-07-WALKTHROUGH-2026-10-05.md` is 2f7a82a194bfb77038590bd8ec098d38040e9b5b2cc90e8898056b928b1982fe, 25,859 bytes. Both are filed byte-identical, with no filing note of their own. The rulings get a RULED block in `DECISIONS-PENDING.md`.*

---
Custodian: the migration plan, second version. File it and place milestone 1.

1. File. Copy both from my advisory folder to state/directives/ and check sha256.
   If a hash differs, stop and tell me.
   - SHELL-MIGRATION-PLAN-2026-10-07.md
     c154b27b936ecee2a962c730ef2ebb019dc935038eb39481234ab74e985485ee (34,489 bytes)
   - O-07-WALKTHROUGH-2026-10-05.md
     2f7a82a194bfb77038590bd8ec098d38040e9b5b2cc90e8898056b928b1982fe (25,859 bytes)

2. My rulings (Chris):
   - The plan is the migration's order. §13 items 1 to 8 are ruled as written.
   - §10.9 question 1: the session history is kept on the machine, keyed to the
     project, not in the project folder. This replaces that row of my decisions' §1.
   - Question 2: one dated note in docs/07, in B2's pull request. I type it then.
   - Question 3: keeping a branch stays out of B2.
   - Question 4: B2 goes in the five stages of §10.8, each with its own form.
   - Questions 5 to 11 come to me as open items in B2's forms.

3. Do:
   - Place shell-migration-milestone-1 per §5.7: its form and question round now,
     its code when the lines cut has merged.
   - Re-describe b1-shell-half as milestone 4 and briefb-b2-save-reopen per §10.
   - Add proposed nodes for milestones 2, 3 and 5, and for the macOS and Linux run
     (§13 item 8).
   - Change no ADR status, no docs/ text and no dependency in this step.
