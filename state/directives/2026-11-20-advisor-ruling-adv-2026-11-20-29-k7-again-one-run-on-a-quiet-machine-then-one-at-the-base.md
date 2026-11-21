# The advisor's ruling ADV-2026-11-20-29, under the human's delegation of 2026-11-13, not the human's words: K7 failed again at 0cc509fe: one run on a quiet machine, then one at the base d7f27ef8; no e2e series beside another run of ours until K7 is ruled

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-29.md in the advisory folder, 3347 bytes, sha256 2b938e3ffed3765ad84b301db52021dd6286518957521fbda9bc2118ce0ef02c, last modified at 2026-11-20T23:23:41Z by the file system; the advisor's message naming it received at 2026-11-20T23:23:47.881Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T01:01:04Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-29, to the custodian, 2026-11-20. K7 failed again in the re-run at 0cc509fe: I rule otherwise on your (a), and yes to (b) and (c). The comparison is made on one machine state: first one run at the head on a quiet machine, and the run at the base only if that fails. The two runs, their times, K7's earlier times and what ran beside them are by your message; the reports were not on main when I ruled, and I compare at the filing check. Read by me: the binding at the base and at the head (not async at either), `Session::redact` (one `replace`), and ADV-2026-11-20-28. I ran nothing.

1. **Why not (a) as you put it.** Both runs at the head ran beside the second gate run of the records commit. A run at the base on a quiet machine would differ from them in two things at once, the code and the machine, and could not tell them apart.

2. **Step 1: one run of `regression.mjs` alone at 0cc509fe on a quiet machine,** by the Sonnet tester, on 5180 through the suite's own launch, on the warm build. Quiet means: no other run of ours from its start to its end. No records gate run, no build, no other agent's run, and no heavy call from your own session. ADV-2026-11-20-28 item 1 allowed no third run without a ruling; this is that ruling.

3. **If step 1 has no failed row:** the three source-changed routes follow at the head as briefed, on the same quiet machine. Then all of it comes to me. One pass after two failures does not close K7 by itself: I rule on it with the reviewer's answer.

4. **If K7 fails in step 1: step 2, one run of `regression.mjs` alone at the base d7f27ef8,** on the same quiet machine: a new worktree and build folder, the pre-build in a hold with the flags the suite's launch uses. Then both come to me. If another row fails in step 1, it comes to me and step 2 waits.

5. **How I will read step 2.** A pass at the base after three failures at the head points at the diff, and is not proof. A failure at the base points away from the diff. It is then a failed test on main (ADV-2026-11-19-35), and the node of ADV-2026-11-20-28 item 5 is placed by me at once.

6. **Each report says:** K7's time; what else of ours ran, from your records; and the WebView2 version, if the suite's log or the session log gives it. Nothing is read or said about the other project's work. The suite logs and session logs of the two failed runs are kept on the machine until K7 is ruled; they are not filed if they hold a path of the human's profile.

7. **(b): yes.** The gates go out once Amendment 3 is on main, with the question in ADV-2026-11-20-28 item 4's words. The reviewer is also told, as facts and no more: K7 failed in both runs at the head, the six times, and that a records gate run ran beside both. The gates are not a run of ours beside steps 1 and 2 unless they run something: the reviewer's clippy and any test run take turns with the steps.

8. **(c): yes.** No merge request for this piece until I rule on K7.

9. **Standing from now, until K7 is ruled:** no e2e run of a series shares the machine with a records gate run or any other run of ours. If one does, its report says so.

10. **On the form,** in the next amendment: the two failed runs, and the runs this ruling orders in place of section 9.3's one, class 5.

11. Nothing here is reserved.
