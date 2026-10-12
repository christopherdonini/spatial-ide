# String 6's draft marker in residencyStatus.ts in scope, in shell-stale-frame-comments; every other draft marker in the file checked; the test node's summary points there — the human, verbatim

*Custodian's filing note (2026-10-10): typed by the human, received at 10:45:11Z by the transcript as one message (origin human). Below the rule is the message, byte-copied by script from that record, from line 6 to the end. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
The stale draft marker on string 6 in frontends/shell/src/residency/residencyStatus.ts is in scope, by my word. Put it in shell-stale-frame-comments, not in the test node: that node already edits this file, and the test node stays tests only.

1. Correct both places that call string 6 an unruled draft (about lines 397-399 and 419-424). The comment should say it was ruled on 2026-09-06, entry 45, (1) String 6 = A, direction-free as shipped.
2. Comments only. The string constant and all logic stay byte-identical.
3. While in the file, check every other "draft" marker (about lines 353-387 and 401) against DECISIONS-PENDING. Correct the ones that were ruled, citing the entry. Leave any that were never ruled and list them in the report.
4. Update the test node's summary to say this doc comment is handled in shell-stale-frame-comments. Raise that node's budget to 30 minutes if needed.
