# Direction after the 2026-10-11 status review: product first, the wording-block rule, two verdicts, no release, no sweep — the human, verbatim

*Custodian's filing note (2026-10-11): typed by the human mid-turn, queued at 18:23:36Z by the transcript (a queued command). Below the rule is the message, byte-copied by script from that record, from line 6. One final newline is added and nothing else is changed. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
Direction after the 2026-10-11 status review.

1. Product first.
   a. Slot 1 is the product slot. Its order: shell-migration-milestone-2 now (phase A, then phase B), then shell-migration-milestone-3, the command bar. B2's next recording stage follows when its dependencies clear.
   b. Forms ahead: while milestone 2 is in code, the architect drafts milestone 3's form and its question round.
   c. The docs lane, slot 2 and Guardian v1 never hold slot 1. One exception stands, by my S1 grading: phase B's branch is cut after the CRS-form piece has merged. Phase A does not wait for it. If any other piece outside slot 1 would make slot 1 wait, tell me before it does.
   d. Guardian v1 keeps its turn in slot 2, after the CRS-form piece. Installing it stays mine.

2. A wording block ends in one answer. I authorise this as an exemption to the governance freeze, if the freeze still stands.
   a. When a gate's only blocking findings are the words of a document sentence, and the code's Correctness and Evidence are closed, the gate's author writes exact replacement words in the same report. The report shows each clause of those words checked against the code.
   b. I answer yes, or give my own words, or accept the sentence as it stands.
      - Yes: the worker applies the proposed words. No re-gate. The PR body records it.
      - My own words: the same author checks those words only, once. If that check fails, the author's words land unless I accept mine as they stand. There is no third round.
      - Accepted as it stands: the gap is recorded in the sentence's source comment and on the form.
   c. A sentence is judged at what an operator can observe in the shipped app. A case that needs timing inside one request round trip, a dev-only switch or an instrumented build does not block. The author names it, and it is recorded in the source comment. Anything ordinary use can reach still blocks.
   d. Where the sentence is not my wording (a worker's README line, a doc comment, a row I have not worded), no answer from me is needed. The worker applies the author's words, with no re-gate, and the PR body lists them.
   e. Where a piece needs a new sentence of mine that states what the code does, the architect drafts it in the form with the same clause check, and I approve or replace it there. I no longer write such a sentence first.
   f. Not covered: red-line texts (ADR statuses and amendments, gate rulings, licensing, security posture) keep my typed words; strings the app shows stay under P6; and nothing here applies to a finding that changes what the code does.
   g. This replaces "tell me and do not reword" (my instruction of 2026-10-10 and my rulings since) for the cases it covers. The proportional-gates section of 2026-10-05 is otherwise unchanged: an untrue claim of a limit is still a Correctness finding.
   h. Where it lives: this directive; a new section appended at the end of AUTONOMY.md; one paragraph in each gate agent's definition; every gate brief by reference. One docs pull request for my click. The rule applies from now, before that pull request merges.

3. Two verdicts before anything new. No new agent, lead or mod until points 2 and 3 are settled.
   a. The data lead's second pilot. A table of every piece since the pilot's baseline, beside the baseline pieces. Per merged piece: its lane and changed lines; total agent tokens, correction rounds included; gate rounds; and its correction rounds split by cause: the draft, the code, or wording. Each draft-caused round cites its gate finding. From the table, recommend one: keep the mandatory impact read, or end it and keep the owner's indexes with impact questions on demand. I rule. Clear the trial log's "first four-piece result owed" with it.
   b. The Evidence Recorder. File the E10 verdict against the duration-relative bound I authorised. If it fails, recommend uninstalling it or reducing it to sampling. That is my call.
   c. With them, the measures of section 6 of the 2026-10-05 direction, for the days since.

4. No packaged release now. Nothing is released from main before the CRS-form piece has landed and I have graded the node on the Export panel's Current view. When milestone 2 has merged, propose a v0.2 plan: what is in it, the felt sitting and the release notes. Publishing waits for my typed approval.

5. No new sweep report comes from me until the docs lane is empty.
