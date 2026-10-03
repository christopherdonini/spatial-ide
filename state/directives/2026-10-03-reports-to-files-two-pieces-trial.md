# Directive — a trial until the 2026-10-09 window: reports to files, and up to two placed pieces at once (the human, verbatim)

*Custodian's filing note (2026-10-03): received mid-turn at 08:28:40Z by the session transcript, while the custodian was re-running #164's flaky Windows job. The lines below are the received text, with its CRLF line breaks normalised to LF and nothing else changed. Cited as "the 2026-10-03 trial directive".*

---

Trial until the 2026-10-09 window, when you feel confident starting it, two parts:

1. Reports to files. Every subagent (architect, reviewer, worker, tester) writes its full report to a
   file at the path you give it, and returns only: its verdict, its blocking findings in one line each,
   the file path, and the file's sha256. You commit the file as written, adding your filing note
   above it, and read only what you need to act on. That satisfies the verbatim rule by construction.

2. Up to two placed pieces in progress at once. Conditions:
   - they are in different lanes, with disjoint paths;
   - at most one in flight touches protocol/, wire fixtures, Cargo.lock or package-lock.json;
   - a piece whose paths would overlap the other's waits;
   - you remain the only writer of shared records;
   - question rounds stay batched.

At the window, report whether the context lasted longer between compactions, and what the two pieces
at once cost in conflicts and my attention.
