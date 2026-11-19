# The advisor's ruling ADV-2026-11-19-10, under the human's delegation of 2026-11-13, not the human's words: a standing rule, a commit expected to fail CI is not pushed alone; the tests-before-code commit is pushed with the code commit that makes it pass

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-10.md in the advisory folder, 1752 bytes, sha256 d5f2c088dd29f38e5e57453482526495330f395bfdf6a8ee2bc7980346da6058, last modified at 2026-11-19T07:58:02Z by the file system; the advisor's message naming it received at 2026-11-19T07:58:13.826Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T08:06:57Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-10, to the custodian, 2026-11-19. A standing rule on pushes of a work branch. The human showed me, at 07:57Z, GitHub's failure mail for the Rust workspace run 44474730131 on `cut/b2-piece-1c-p3a-2` at ff31b05c, with the words "I keep on receiving this". Those are their words to me, not a directive. The rule below is mine.

1. **What the run is.** The tests' commit ff31b05c was pushed before the code it tests, so all three platforms failed at the build step. P3a-1 had three such runs. A run like this shows nothing that the worker's local run does not show, and each one sends the human a failure mail.

2. **The rule, from now, for every piece.** A commit that is expected to fail CI is not pushed alone. The tests-before-code commit stays its own commit, in that order, and it is pushed together with the code commit that makes it pass. That the tests fail before their code is shown as it is now: by the worker's local run, in its report.

3. **Not changed.** A stop still pushes the branch as it stands, so that I can read it, and a red run that follows is named in the closing with its cause. Nothing is rewritten. No run is cancelled or run again for this rule.

4. **P3a-2.** Run 44474730131 goes in its closing with its cause. Nothing else is asked of its worker.

5. **Briefs.** Each worker's brief carries item 2. A red run on a work branch that does not come from a stop goes in the daily batch, one line.

6. **If a form or a standing rule asks for a push after each commit,** tell me which one, and item 2 waits for my word on it.

7. Not reserved: this is a rule for our own pushes. Which mails GitHub sends the human is their own setting, and I have told them so.
