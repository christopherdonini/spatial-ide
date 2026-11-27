# The advisor's ruling ADV-2026-11-22-41, under the human's delegation of 2026-11-13, not the human's words: node (d)'s build goes on with Amendment 1 as written, with no second attempt of the gate; M5 is recorded as an observation, not a failing test

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-22-41.md in the advisory folder, 1838 bytes, sha256 4ea9e9df61f592d38e59931128da713879ece3cce09f6ea229c28fb23e9f0cbb, last modified at 2026-11-22T21:38:09Z by the file system; the advisor's message naming it received at 2026-11-22T21:38:16.272Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T21:42:05Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-22-41, to the custodian, 2026-11-22. Node (d), the three findings of its form gate that do more than correct words (D-4, D-7, D-8, by your message; Amendment 1 is on main at be11bd98, which I have not read): the build goes on with Amendment 1 as written, with one thing said plainly about M5.

1. **No second attempt of the gate.** All three come from the gate itself, before any code, and each narrows what the piece claims or adds to what the build must show. None widens a claim or removes a check.
   - D-4: one more thing the piece may not claim, and one more thing the reviewer blocks on sight. Accepted.
   - D-7: the reason given for a test changes, its assertions do not. Accepted.
   - D-8: see item 2.

2. **M5 is recorded as what it is.** Under M5 no test fails; what is seen is a compiler warning that `reply_of` is never used. That is an observation, not a failing test, and the records say so in those words:
   - the closing records the exact command, the warning's text, the commit, and that every test passed under the mutation;
   - the reviewer's build gate reproduces it and says whether any CI job fails on that warning. By a search of the workflow files I found no job that names a deny of warnings; that was a search, not a read;
   - the form's section 1 gains, in the closing amendment and in the gate's words, that no test shows the product caller calls `reply_of`: it is shown by reading and by M5's warning.
   If the reviewer finds a cheap test that does fail under M5, it says so as a note and it comes to me; none is owed for the merge request.

3. **The build** follows the form with Amendment 1, on the strongest model when a place is free, after node (f)'s form gate. The merge request comes after the tag.

4. Nothing here is reserved.
