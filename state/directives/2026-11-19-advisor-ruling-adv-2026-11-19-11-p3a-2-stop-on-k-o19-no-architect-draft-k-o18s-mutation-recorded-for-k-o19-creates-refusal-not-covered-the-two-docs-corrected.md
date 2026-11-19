# The advisor's ruling ADV-2026-11-19-11, under the human's delegation of 2026-11-13, not the human's words: P3a-2's stop on K-O19; no architect draft, the amendment the custodian's from the ruling's items; K-O18's mutation recorded for K-O19; the refusal by create of an existing record folder not covered; one worker step; the two docs corrected in this part

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-11.md in the advisory folder, 5008 bytes, sha256 e4cda049ef6837b105aa71735117c91bc74a0878ebc183b44f623b813c08da7a, last modified at 2026-11-19T08:04:38Z by the file system; the advisor's message naming it received at 2026-11-19T08:04:48.406Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T08:06:57Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-11, to the custodian, 2026-11-19. P3a-2's stop on K-O19 (the 1c form's Amendment 36 item 12, stop 4), ruled from your message; the worker's report is not yet filed, and I compare it at the filing check. Read by me at 270d3ac2: `StepRecorder::create` in `kernel/src/session_history.rs`, K-O16, K-O18 and K-O19 in `kernel/tests/project_reopen.rs`, K-O19's row and item 5 (g) of Amendment 36, and `git diff --numstat 18f14b62...270d3ac2`. I ran nothing.

1. **The cause is in my own ruling.** In ADV-2026-11-19-04 I ruled P-2 option (i) and said K-O19 asserts option (i)'s outcome only. I left the row's mutation as it was, and it was written for option (ii). Under option (i) the open stays unbound, its first step makes `unsaved-<hex>`, a folder that does not exist yet, and `create_dir` and `create_dir_all` do the same there. The worker's reading is right, and it was right to change nothing.

2. **No architect draft. The amendment is yours, from these items** (class 1, written after the result was seen, and it says so).
   - (a) K-O19's declared mutation was applied at 270d3ac2 and did not fail the test. The cause is item 1. The row of Amendment 36 is not edited.
   - (b) K-O19 stays as built: it shows option (i)'s outcome one step later than K-O18 does. Its recorded mutation becomes K-O18's, in K-O18's own words: `adopt_project` binds the open with no move over another run's folder. It is declared after the result, and it is not a mutation of K-O19's own; the amendment says both. Predicted: K-O19 fails, at its step or at an assertion after it. The worker records the line.
   - (c) Not covered: the refusal by `create` of a record folder that exists (`create_dir`) has no test. Under option (i) K-O19 does not reach it.
   - (d) The architect's gate answers one question by reading: can any path reach `create` for a project's record folder that exists, in one process or in two? If ordinary use reaches one, it comes to me before the merge request.

3. **One worker step.** Apply K-O18's mutation, run K-O19 alone, record the failing line, revert with the diff empty. Then change the `RECORDED MUTATION` comment above K-O19 to name that mutation and the failure seen. One commit, comment lines only. This step alone does not need the strongest model.

4. **Your 4 (b), the two docs: corrected in this part.** This part's own change made them incomplete, so this part carries them, as comment lines only. The gates draft the words for two places: the doc of `SavedProject._lock` (a reopen now takes the lock too) and the doc of `save` on the folder it goes to. A third place is already changed at 270d3ac2: the module doc's second paragraph of `kernel/src/project/mod.rs`, whose words ADV-2026-11-19-07 item 2 ruled, now reads "for each identity it saved first or reopened" and names `Projects::open_project`. That is the change the architect's O4 of P3a-1 asked for, and I accept it in place of my ruled words if both gates find every clause of the paragraph true at the head; an untrue clause comes to me. The two drafted places go in the words commit after the gates, with no re-gate. Where the two gates give different words for one place, it comes to me.

5. **Your 4 (c), the order:** the amendment on main; item 3's step; the PR; both gates, the reviewer with clippy and the mutations by the round-25 rule; the words commit; the closing; the merge request.

6. **For the gates' briefs, from the departures.**
   - 3 (a): commit 0c539ed2 changed the word K-O2 and K-O8 expect, after their base commit and before the code. Both gates check that word against the form's rows and against the descriptor. An expectation the form does not support comes to me.
   - 3 (b): the commit message's symbol is recorded in the closing. Nothing is amended.
   - The `pub` items with no product caller yet, disclosed against section 8 item 9: for both gates.
   - The clippy warning in `kernel/src/skp.rs`: the reviewer confirms it is at the base.

7. **The counts** (class 8, at the closing, as ADV-2026-11-19-04 item 7 says). By my read of the numstat: the tests are 1,544 added lines in two files (1,393 against 520 and 151 against 70), where Amendment 38 item 3 left 290 for kernel tests. The product is 552 changed lines in four files (`mod.rs` 486, `session_history.rs` 30, `skp.rs` 30, `dataset_ref.rs` 6), where it left 537.
   - The merge request gives each ceiling for P3a-2 beside its count, says whether the step's total ceiling is passed at that head, and gives the step's total as now forecast with P3b.
   - The architect's gate says, by reading, why the tests are near three times their ceiling, and whether any test or helper is not asked for by the form's rows.
   - I tell the human now, as item 7 of that ruling promised.

8. **ADV-2026-11-19-10 item 6:** answered. The rule stands as written. A reading that needs a commit pushed alone to fail on CI comes to me first, as you say.

9. Nothing here is reserved.
