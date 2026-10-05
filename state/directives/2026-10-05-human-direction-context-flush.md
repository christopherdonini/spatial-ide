# Directive — the flush before an automatic compaction (window item J): Fable's brief approved, pieces A and B placed (the human, verbatim)

*Custodian's filing note (2026-10-05): the human's direction, received mid-turn at 18:15:58Z by the session transcript (its enqueue record, origin human), as pasted content in the human's own message. The text below the rule is the pasted block's text, extracted from the transcript by script, with its pasted-content wrapper lines removed and nothing else changed except one final newline. It approves Fable's brief `CONTEXT-FLUSH-2026-10-05.md` by name, sha256 and size. Fable's follow-up message, relayed by the human at 18:18:35Z, gave the brief's path in the advisory folder MODS-V1 and LEAD-DATA-PILOT-V2 were copied from. It is filed byte-identical at `state/directives/CONTEXT-FLUSH-2026-10-05.md`, 9270 bytes, its sha256 equal to the one this direction states. It gets a RULED block in `DECISIONS-PENDING.md` (§105). Cited as "the 2026-10-05 context-flush direction".*

---
HUMAN DIRECTION, 2026-10-05: the flush before an automatic compaction (window item J).

1. I have item J's path and Fable's advice. I approve Fable's brief CONTEXT-FLUSH-2026-10-05.md (sha256 9cf5d9826bbd847f07fce456c155847342c3c0f3df7fefcbfe875856f75c7a93, 9270 bytes): file it under state/directives/ and build its two pieces under the usual forms and gates.

2. Piece A, compaction-record-and-resume-line, takes the second slot when guardian-v1 frees it, ahead of the second-slot queue. In it the PreCompact hook no longer blocks an automatic compaction: it records the call and its reason and lets it through. A manual /compact is blocked once, as today. This changes my 2026-09-15 word in AUTONOMY section 7, and section 7's text is corrected in the same pull request, with its freshness figure brought to the hook's 10 minutes.

3. Piece B, guardian-n1-before-auto-compaction, follows piece A. N1's fill is measured against the auto-compaction threshold, its bands are 5 points from 80, and it also judges the block stale when flushed_at is more than 10 minutes old. This changes round 44, item 1 for N1. Its merge waits for my typed approval.

4. The brief's measure replaces item J's count from the first automatic compaction after piece A merges.

5. Nothing else changes: no Context Keeper, no meter band, no mod that blocks or defers a compaction.
