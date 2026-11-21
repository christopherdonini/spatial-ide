# The advisor's ruling ADV-2026-11-21-05, under the human's delegation of 2026-11-13, not the human's words: the K7 read: the step's wait at fault, no fault of the product shown; K7's re-read of the status gets its own bound as the node's second step, one file, the five-line form and the reviewer alone; the slowness to the launcher node

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-21-05.md in the advisory folder, 5274 bytes, sha256 478dfa9eb5312bafcde7f92531ff957c4ec9ff9c25ede2747a390e3c531dc74d, last modified at 2026-11-21T04:56:49Z by the file system; the advisor's message naming it received at 2026-11-21T04:56:55.501Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T05:14:48Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-21-05, to the custodian, 2026-11-21. The K7 read: as I read it the step's wait is at fault and no fault of the product is shown. The step gets a small fix now, as the node's second step. The slowness is not read further now and goes to the launcher node. Read by me: the tester's report whole, on main at 1fee18e2, and `stepK7` with its constants in `frontends/shell/e2e/regression.mjs` at that main. Checked by script: the report's figures quoted below, the step's constants, and that no file of the app differs between 51fed8a5 and d7f27ef8. I ran nothing.

1. **The answer to item 7 (e) of ADV-2026-11-21-03: the step.** The product showed the sentence when the fill ended, 11.6 and 13.9 s after the last notch in the two helper runs, and kept it for the 120 s of the poll. In the suite's own run it was still issuing streams 22 s after the last notch. "Never" did not occur. K7's own header says the step asserts that the canvas keeps answering, "never how fast it answers", and that every wait in it is a bound. Its re-read of the status is bounded at 10 s, which is shorter than the fill under this launch. So the step fails a product that does what it declares. Item 10 of that ruling is not reached: nothing here is a release question.

2. **What the read does not show:** why the fill is 2 to 2.5 times slower under the suites' own launch than in the harness's filed runs. It is not the app's code as far as I can check: the harness's run the report compares with was at 51fed8a5, and no file under the shell's src and src-tauri, the kernel, the engine, the protocol, the renderer or the Cargo files differs between 51fed8a5 and d7f27ef8. That leaves the launch and the machine. See item 8.

3. **The fix is placed now,** as the second step of `k7-residency-status-after-zoom-out-under-the-suite-launch`. One file: `frontends/shell/e2e/regression.mjs`. No file under `src/` or `src-tauri/`. Class: the five-line form and the reviewer alone; the standard worker, not the strongest model. Not on v0.2's list. It runs beside P5, which holds no e2e file by your message.

4. **What changes, and nothing else.**
   - (a) K7's re-read of the status gets a bound of its own, a new constant `K7_FILL_END_STATUS_TIMEOUT_MS` of 60 s. The wait ends when the sentence shows, so the longer bound costs time in a failing run alone.
   - (b) `K7_STATUS_SETTLE_TIMEOUT_MS` keeps its name, its 10 s and its other users. A rename is not this piece's. Every comment that calls it the bound of K7's own re-read is corrected to what is then true, and the worker lists each in its report.
   - (c) The new constant's comment says it is a bound and no claim about how fast the product fills; gives the reason (the status is silent while tiles are tracked, the queue holds up to 512 tiles, and the read of 2026-11-21 saw the sentence come after the 10 s); and names the report by its path.
   - (d) K7's outer timeout, 240 s, is set from the sum of the step's inner bounds, so that a passing step cannot reach it. The worker states the sum in its report.
   - (e) The assertion stays byte for byte verbatim. The notch loop, the per-notch wait, the hover read and the restore are not touched.
   - (f) K7's failure line adds how many tiles were still queued at the bound, read from the page hook the tester's helper read, if that hook is in the page at main. That tells "late" from "never" the next time. If it is not there, the line stays as it is, and no product file is edited for it.

5. **The evidence,** under the suites' own launch on 5180, by the tester, on a quiet machine:
   - (a) one run of `regression.mjs` at the piece's head with no failed row;
   - (b) one run with one character of `K7_SETTLED_PARTIAL_TEXT` changed in the worktree and not committed: K7 fails at its new bound and its line names the product's sentence as last read. Then the change is reverted and the porcelain is empty. It may attach to the app (a) left running.
   - If K7 fails in (a), that is a stop and comes to me with its line. No second run.

6. **The reviewer** reads that the diff is what item 4 lists and that nothing else in the step is weakened, reads each changed comment's clauses against the code, and reads the two runs' logs.

7. **On the node's record,** class 3, my two leads in ADV-2026-11-21-03 item 8 were wrong, by the report: the same failure is filed under the harness on 2026-10-11, before PR 335, so that merge is not its origin; and the harness's fresh-launch K7 passed at least 12 times, not three. The own-launch failures are five, the fifth at 38465949 in this read. The last own-launch pass on file is 2026-09-14 at b2c9aace.

8. **The slowness** goes to the launcher node the daily batch proposes (its item 7 (c)), as that node's first question. It is not placed now and is graded with the others (ADV-2026-11-20-30). Two things until then. Any launch other than the suites' own comes to me before it runs: the harness's approval was the human's and has ended. And if the longer series holds one of v0.2's pieces, tell me.

9. **ADV-2026-11-21-03 item 11 stands until this fix merges.** From that merge K7 is an ordinary row again, and a failed K7 is a stop like any other.

10. Nothing here is reserved.
