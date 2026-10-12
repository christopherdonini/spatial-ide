# Ruling — K6 case (v) strengthened under Decision A, and the stage 6 slip recorded as it is (the human, verbatim)

*Custodian's filing note (2026-10-08): typed by the human as a new message, received at 19:40:09Z by the transcript (a user turn, origin human). Below the rule, byte-copied by script from the transcript with one final newline added, with nothing else, is the message (from line 6 to the end). It answers the custodian's question on milestone 1's K6 case (v), after the stage 6 diagnosis (`state/consults/2026-10-08-shell-migration-milestone-1-worker-report-6.md`). It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
K6 (v): (b). Case (v) keeps what it asserts and also fails when a camera-settle
re-pick line appears in the render trace since the release mark, whatever that
pick found. This strengthens the assertion, and I allow it under Decision A.
- The PR body states the old assertion, the new one and the reason: on this map
  the stale pick lands on background, so "no id" no longer tells a re-pick from
  none.
- It also states the report's reading that the 9 px pick threshold of
  2026-09-14 contributes, marked as read from the record and not from a run.
- The mutation is then observed properly: one application, one run of the real
  suite, restore, clean check.
- Option (a) is not built.

The slip: recorded as it is, with your reconstruction from the command log. No
clean run ran mutated and nothing was committed. Nothing is redone beyond the
observation above, and it adds no new rule.
