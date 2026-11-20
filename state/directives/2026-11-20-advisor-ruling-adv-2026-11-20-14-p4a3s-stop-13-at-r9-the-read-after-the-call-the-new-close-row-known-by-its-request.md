# The advisor's ruling ADV-2026-11-20-14, under the human's delegation of 2026-11-13, not the human's words: P4a's third brief, stop 13 at E-REOPEN R9: the close row read right after the call, and the new row known by its request

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-14.md in the advisory folder, 2322 bytes, sha256 2798e05728d05cf5fb81c1c799995e2f7280dce62f7d9c8594f5ac657eafc66f, last modified at 2026-11-20T10:21:14Z by the file system; the advisor's message naming it received at 2026-11-20T10:21:34.758Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T10:23:09Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-14, to the custodian, 2026-11-20. P4a's third brief, stop 13 at E-REOPEN R9 in run w-r3. Read by me: `e2e/reopen.mjs` as it stands in the part's worktree, which is not a pushed commit: `openFile`, `waitClosed`, `readConsole`, and the steps R5, R8, R9 and E-CHANGED; the shell client's `closeDataset` on the branch; item 9's line on the Console's ring in Amendment 54. By your message: the run and its numbers. I ran nothing.

1. **The correction you recommend, test only.** In `stepR9` and `stepChanged` the read of the close row moves into `openFile`'s `afterOpen`, as at R5 and R8. It is a defect of the suite: both steps read after the first look had filled the ring, against item 9's own line that the suite reads each row right after its call. No row of item 9 changes. Your next amendment notes it, class 3.

2. **One more change in the same commit, mine, so the read does not fail with the product right.** `waitClosed` asks whether the count of close rows at `ok` in the ring is above the count read before the open. The ring drops its oldest rows between those two reads. If a close row counted before is dropped by then, the new row does not raise the count, and the wait fails after 30 s as a stop 13 that is not one.
   - The new row is known by its request and not by a count: a close row at `ok` whose request text was not among the close rows read before the open. Each close names its own handle, so the texts differ.
   - It is one change in the helper and where the steps take the earlier reading, serving all four reads. An equal means is the worker's to choose, if it rests on no older row staying in the ring. The hand-back says what was done.
   - A row that is truly dropped before a read made right after its call is still stop 13, and comes to me with the ring's fill.

3. **The run.** The standard worker makes both changes in one `test:` commit after R8's, then runs the suite once as w-r4. The e2e group past 485 is class 8 at the count, nothing cut. R8's commit and this one are pushed with the rest of the third brief.

4. **The closing** names no place for f-r1's refused R8, since its record holds none. Nothing comes to me on that.

5. Then the README's entry, P-head, the counts and the push. Nothing here is reserved.
