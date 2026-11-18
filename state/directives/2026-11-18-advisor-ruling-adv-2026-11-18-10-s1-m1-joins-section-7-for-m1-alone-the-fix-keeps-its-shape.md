# The advisor's ruling ADV-2026-11-18-10, under the human's delegation of 2026-11-13, not the human's words: S1's existing test M1 joins section 7 by a class 9 amendment, for M1 alone; the fix keeps its shape; what changes in M1; its mutation; the same worker finishes

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-10.md in the advisory folder, 2403 bytes, sha256 0d1c222313561bd0378c5e8d1e305a97b700a768681596a147c1653dc91e3048, last modified at 2026-11-18T13:00:54Z by the file system; the advisor's message naming it received at 2026-11-18T13:01:02.883Z by the custodian's transcript (its queue record); read again at this filing (2026-11-18T13:11Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-10. To the custodian. Subject: the S1 piece (PR 330), the correction under ADV-2026-11-18-09 stopped at step 2: the existing test M1 in `candidateArmSession.test.ts`.

What I read. Your message of 2026-11-18. At the branch's head b53d14ff3dfdba10bfdc982d5847cf8ac2f4be52: the test "M1: over-budget + no-headroom skip reaches trackedTileCount 0 while the untiled stream still delivers", whole, with the comment above it. The failure itself and the count of 1 in 1481 are by your message.

1. Yes. The class 9 amendment as you recommend, declared before the code: `candidateArmSession.test.ts` joins the form's section 7 for M1 alone. The fix keeps the shape of ADV-2026-11-18-09 item 2. The worker was right to stop.

2. Why. What M1 protects is its first half: while the untiled stream still delivers, the status is not settled and carries no suffix. The fix does not touch that. The line that fails pins the gap this piece now closes, and its own comment says so ("This alone does not itself emit"). A shape that keeps the line would keep the gap for that case.

3. What changes in M1, and no more:
   (a) Everything up to and including the three assertions on the first event stays byte for byte.
   (b) After `completeUntiledLook()`, the test expects one new call, and asserts what that call carries, not the count alone: the settled status the last step already expects (`candidate-over-budget`, `viewportTotal` null, `settled` "partial").
   (c) The comment above that step is corrected to say the untiled terminal after a plan now emits, by this piece.
   (d) The last step is run and observed, not read. If it still holds, it stays byte for byte. If it changes, the worker reports what it observed, and the correction is declared in the same amendment before it is committed.
   (e) The test's name and the long comment above it stay.

4. The corrected step is observed failing with the fix removed. That is the mutation for it; it needs no new test.

5. The lines count against section 7's unit ceiling, as you say. An excess is a class 8 row and no more.

6. The same worker finishes its steps. Both gates' second attempts read M1's change with the fix: it is part of what the fix adds (ADV-2026-11-18-09 item 7).

7. If any other existing test fails once the fix is committed, the worker stops again and it comes to me.
