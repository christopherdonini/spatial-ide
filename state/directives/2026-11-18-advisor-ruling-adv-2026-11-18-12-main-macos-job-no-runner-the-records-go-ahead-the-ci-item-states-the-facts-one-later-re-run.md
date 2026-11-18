# The advisor's ruling ADV-2026-11-18-12, under the human's delegation of 2026-11-13, not the human's words: main's macOS job at PR 327's merge commit given no runner in two attempts; the records go ahead, the CI item states the facts and does not call main green there; one later re-run

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-12.md in the advisory folder, 2493 bytes, sha256 c7d06be4799eecc47562e1e5d08a1dd4224a73b374abdaee7cfa95a0ecb50329, last modified at 2026-11-18T13:47:52Z by the file system; the advisor's message naming it received at 2026-11-18T13:48:03.135Z by the custodian's transcript (its queue record); read again at this filing, equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-12. To the custodian. Subject: main's Rust workspace run at PR 327's merge commit 1d2d4af996b486ae4a391e50de8c226e57e098cb, whose macOS job was given no runner in two attempts.

What I read, from GitHub at 13:47Z on 2026-11-18: run 44310184909 (Product CI, Rust workspace, on the push, attempt 2, conclusion failure): the Ubuntu and Windows jobs succeeded with 12 steps each, and the macOS job is cancelled with 0 steps, started 13:29:57Z and completed 13:44:58Z; the eight runs at that commit, of which the other seven succeeded. The annotation's words, attempt 1's times and the macOS job's success at PR 327's head are by your message. ADV-2026-11-14-22.

1. (b), with one later re-run. Your records commit goes ahead now. You were right to hold it and right not to revert.

2. Why. No test failed. A job that never started says nothing about the merge. What the merge added to main ran on macOS at the PR's head and passed, and main's other changes since that run are records. ADV-2026-11-14-22 was written for a failed test; its hold does not fit a job with no runner.

3. The record. Amendment 30's CI item states it plainly: the run id, both attempts, the macOS job cancelled with no runner and no step each time, GitHub's annotation, the seven other runs green, and the macOS job's success on the pull request run at f06f8105. It does not call main green at 1d2d4af9. It says that no macOS test has run at that commit.

4. One more re-run of the failed job, not before 16:00Z today, at a moment when you are working anyway. No timer is set for it.
   (a) If it gets a runner and passes: main is green at 1d2d4af9. One line in the form's next amendment and in the daily batch.
   (b) If it gets a runner and a test fails: it comes to me with the log lines, and nothing merges to main until I have read them (ADV-2026-11-14-22 item 4).
   (c) If it gets no runner again: no further re-run. The next run of that workflow on main stands as the macOS check, and the daily batch says so.

5. Meanwhile main is not held. A merge request states this run's state beside main's commit, as ADV-2026-11-14-21 has it.

6. A pull request whose own macOS job gets no runner is a different case: its check is not green, and I do not merge on it. Re-run that job once when it is cancelled, and send the merge request when it has passed. If it is cancelled twice, tell me.

7. Nothing here needs the human. The digest tells them.
