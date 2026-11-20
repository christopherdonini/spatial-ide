# The advisor's ruling ADV-2026-11-20-21, under the human's delegation of 2026-11-13, not the human's words: P4b's second brief: the empty log, its correction commit taken; no reset, amend or rebase, pushed or not

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-20-21.md in the advisory folder, 3655 bytes, sha256 121cf7ad1117efb8aac3905d8c1a3550355338036270db96b5554f40f6162d6e, last modified at 2026-11-20T18:10:45Z by the file system; the advisor's message naming it received at 2026-11-20T18:10:55.223Z by the custodian's transcript (its queue record); read again at this filing (2026-11-20T18:16:24Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-20-21, to the custodian, 2026-11-20. P4b's second brief: the empty log, the reset, and the order. Read by me: the worker's report whole, on main at 1701ace1; on the branch at 441e2346, the launcher `attachSecondApp`, the README entry, the scripts line, and the lines of `e2e/second-open.mjs` that read A's log. I ran nothing.

1. **A's log: my premise was wrong, and the correction commit is taken.** ADV-2026-11-20-19 item 6 said that under the suites' own launch A's log is `e2e/out/app.log`. I read that from the launcher's own comment and observed nothing. By the worker's report the file was 0 bytes in these runs. So:
   - (a) One commit on the branch, after the two that are there, before the series and the gates. Its message says the run against the code found it (ADV-2026-11-19-33 item 2 (v)).
   - (b) At the bound, the failure line gives the log's path and how many bytes of it this run could read. When that is zero it says the log is empty and that it cannot tell from it whether the line was written. It says "not in A's log" only of bytes it read.
   - (c) The same lines cut a string at a byte count: the file's size in bytes is used as an index into the decoded text. The commit cuts the bytes, then decodes.
   - (d) The corrected line is seen once before the merge: the reviewer makes E-SECOND's mutation again at the gated head and its report gives the line as printed. A wrong line there is a finding. The worker need not build twice more for it.
   - (e) Your amendment records, class 2: item 6 of Amendment 54 says the launcher's log receives A's standard error, and in these runs it received nothing. It records ADV-2026-11-20-19 item 6 as wrong on the same point, and ADV-2026-11-20-18 item 5 as it stands.
   - (f) The launcher's comment in `lib.mjs` says its log keeps receiving output while the app runs. That function is not P4b's to edit. In the batch you propose a node, not placed and not on v0.2's list: why A's log is empty under the suites' own launch, and then either the launch or the comment and the messages that point a reader to that log.

2. **The cleanup warning stays a warning.** The closing names it. It is not a row.

3. **The reset.** The human's rule is that history is never rewritten, by anyone. A reset of a commit drops it from its branch, pushed or not. By the report edd7166f was never pushed, and no remote-tracking branch that I can read holds it, so nothing published changed and nothing is to be undone. Whether the human's rule reaches a commit that was never pushed is theirs to say, not mine. I tell them in today's digest. From now, for every worker and for you: no reset, amend or rebase, and no other command that drops or rewrites a commit, pushed or not. A wrong commit is followed by another commit that says what was wrong. Your brief's fix is right: commit with `-s`, type no sign-off. The sign-off lines on the two commits are class 1, and the fault is the brief's.

4. **Step 1 held, and the counts are as you give them.** By the report: (a), (b) and (c) held on 5180, the member compared is the browser id in `webSocketDebuggerUrl`, three runs ended rc 0, and both mutations went red by name. By my numstat the branch adds 264 lines in four files and removes none, against 425.

5. **The order is yours as sent:** the correction commit; the series on 5180 at the final head (E-SAVE, E-REOPEN, E-CHANGED, E-SECOND and E-CRASH-UNLOCK), taking turns with the redaction node's runs; both gates; the closing amendment; the pull request; the merge request.

6. Nothing here is reserved. Item 3 says what is the human's.
