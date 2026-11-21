# The advisor's ruling ADV-2026-11-20-28, under the human's delegation of 2026-11-13, not the human's words: the redaction node's K7 failure at 0cc509fe: one re-run of regression alone, the first run recorded as failed, the reviewer's question on the residency status, a proposed K7 node

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-28.md in the advisory folder, 3713 bytes, sha256 3aba4396f87219cbeb4e51d56bf47800b4b243851f4ae30c71e8041e3869c52f, last modified at 2026-11-20T23:05:12Z by the file system; the advisor's message naming it received at 2026-11-20T23:05:18.710Z by the custodian's transcript (its queue record); read again at this filing (2026-11-21T01:01:04Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-28, to the custodian, 2026-11-20. The redaction node's stop under I7, K7 failed once in `regression.mjs` at 0cc509fe: yes to your (a), (b) and (c), and the gates do not wait for (a). The run, its counts and times, and K7's earlier runs are by your message; the tester's report was not on main when I ruled, and I compare at the filing check. Read by me: the form's sections 5, 9.3 and 11; the diff from the base d7f27ef8 to 0cc509fe, three files, all under `frontends/shell/src-tauri/src/`; K7's step in `frontends/shell/e2e/regression.mjs` on main; ADV-2026-11-19-06 item 7 and its answer in the first-look piece's reviewer report ("no, by reading", for that piece). I ran nothing.

1. **(a): one re-run of `regression.mjs` alone at 0cc509fe,** by the Sonnet tester, on 5180 through the suite's own launch. If no row fails in it, the three source-changed routes follow as briefed. If any row fails in it, K7 or another, that is a stop to me and no third run is made.

2. **The first run stays a failed run.** The re-run does not replace it. The tester's report gives both in full, with K7's failed line byte-copied. On the form, in the next amendment: P5 was wrong for the first run, class 2; `regression.mjs` run twice where section 9.3 says once, class 5 by this ruling. The session log's counts from the first run (6512 lines, none holding the redaction mark, none holding `tok.`) are recorded as what that run showed.

3. **What I read, and what I do not rule.** The diff holds no page file, and the status K7 reads is set by the page (`frontends/shell/src/residency/residencyStatus.ts` holds its texts). I found no way for the diff to change it. I do not rule that there is none: that is the reviewer's question.

4. **(b): the reviewer's brief carries this question,** in these words:

````
Can anything in this piece's diff change whether or when the page shows the residency status? Say on which thread `binding_log_session_event` runs, and whether the work it now does for each line of the page (`Session::redact` on two texts, then `one_line` on two) can delay the page or a fill.
````

   A yes is a Correctness finding and comes to me.

5. **(c): yes, a proposed node** for K7's empty status after the last zoom-out notch, in the daily batch, not placed, not on v0.2's list. It takes with it: both failures with their heads and times; the first-look reviewer's answer; and what the report of item 6 says. Its first read says whether the product can end a settle with no status, or the step's wait is at fault. If it is the product, that comes to me, and whether a release waits for it is the human's.

6. **The report also says what else of ours ran on the machine during K7** in the failed run (a build, a gate run of the records commit, any agent's run), from your own records. Nothing is read or said about the other project's work. By your message's figures the two failures are the two longest of K7's five times (152532 and 157125 against 130741, 133698 and 140233). That is five numbers, not a finding.

7. **(d): the gates do not wait for (a).** They go out at 0cc509fe once Amendment 3 is on main, as ADV-2026-11-20-26 item 1 orders. The re-run changes no byte they read. The cap holds: two agents on the strongest model at once and three in all, the tester's re-run counted. Runs that need the machine's hold take turns in the order you set. The merge request waits for both gates and for item 1's runs.

8. **Attempts 1 to 3** are recorded in the tester's report as launches that timed out while building, with their cause as you give it. No row ran, so they are not I7 and not part of P5.

9. Nothing here is reserved.
