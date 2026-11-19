# The advisor's ruling ADV-2026-11-19-13, under the human's delegation of 2026-11-13, not the human's words: PR 336's gate FAIL; one run of the selection suite at the merge base by a tester; the gate's words for findings 2 to 4 in one worker commit; the inexact words of the earlier ruling corrected in the closing; the remaining window recorded, no node; a short second attempt by the reviewer

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-13.md in the advisory folder, 2874 bytes, sha256 e017035b0163f3d085818ea2bfef4128ec27d2ce724fe4e88046d3995ebf992c, last modified at 2026-11-19T08:09:03Z by the file system; the advisor's message naming it received at 2026-11-19T08:09:20.479Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T08:33:51Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-13, to the custodian, 2026-11-19. PR 336 (`selection-export-unknown-attempt`), the reviewer's gate FAIL at 9a4c5833. Ruled from your message; the gate report is not yet filed, and I compare it at the filing check. Read by me: the piece's form on main, ADV-2026-11-18-05, and PR 336's head and file list (two files, `frontends/shell/e2e/README.md` and `frontends/shell/e2e/selection.mjs`; merge base f5584f28). I ran nothing.

1. **Your (a), the run at the merge base: yes.** The form's own second branch applies, since `frontends/shell/src/App.tsx` changed between 619a7cc9 and the merge base. One run of the selection suite, with the debug app built at the head and `selection.mjs` as it stands at the merge base, put in place and reverted with the porcelain empty. Before the run the tester shows by `git diff --name-only` that the head differs from the merge base in those two e2e files only. A tester in place of the form's worker is a disclosed departure, class 1. It runs after the first look's ready steps (ADV-2026-11-19-03).
   - If E-EXPORT fails with unknown-attempt, finding 1 is answered.
   - If the suite passes, nothing is concluded and it comes to me. The failure is known to come and go: the same commit gave 18 passes on one day and 16 on another.

2. **Your (b), the words of findings 2 to 4: yes, as the gate report gives them**, in one worker commit after the run, inside the form's budget. I check them against the filed report at the merge check, by script.

3. **The gate's note 6: "as the publish suite does" was inexact, and it was mine.** ADV-2026-11-18-05 item 2 (c) and the form took those words from it. By the gate's read, `publish.mjs` waits for the hook alone, and `colour.mjs` waits for the dialog and the hook. The comment and the README say what the code does, in the gate's words of finding 2. Neither my ruling nor the form is edited; the closing records the correction (class 3) with the gate's read.

4. **The window that remains.** Recorded in the comment, in finding 2's words, and in the closing. No node: by the gate's read a person cannot reach it, and the suite can meet it only as a failure, never as a false pass. If a selection export step fails with unknown-attempt after this piece merges, it comes to me with this item.

5. **Finding 5** goes in the closing: the line cited in step 1's report, and the line it is.

6. **Your (c): no, a second attempt is needed, and it is short.** The human's merge check asks that every gate on a piece ended PASS or PASS WITH NOTES. A gate that ended FAIL does not, whatever closed its finding, and that rule is not mine to loosen. The reviewer's attempt 2 is limited to its own findings 1 to 4: the run's result and the words commit by diff. It runs nothing and reuses everything else.

7. Nothing here is reserved.
