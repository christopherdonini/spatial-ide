# Rulings — the e2e re-aim's question round: OPEN-1 to OPEN-3 and the lead-data pilot (the human, verbatim)

*Custodian's filing note (2026-10-09): the human's answers to the custodian's question round on `frontends/shell/e2e/E2E-STALE-EXPECTATIONS-REAIM-PREREGISTRATION.md`, received at 14:09:02Z by the transcript, its AskUserQuestion result record. Below the rule, byte-copied by script from that record's answers map, is each question as the custodian asked it, then the human's answer: a chosen option's label, or the human's own typed text. Nothing is changed in either, and one final newline is added. The question texts are the custodian's; the answers are the human's. The fourth answer refers to "the last sentence of the paste", and no paste is in this session's record. The custodian asks the human which text that is, and records the reply when it comes. It names no other project. It gets a RULED block in `DECISIONS-PENDING.md`.*

---
1. Question: OPEN-1: the re-aim must keep proving refuse-then-declare on a file that still refuses and offers a column to declare. Today's fixture writer cannot make one (it writes either id or parcel_key, never both). How is that file written?
   Answer: (A) Test-support variant (Recommended)

2. Question: OPEN-2: each re-aimed step is shown still able to fail by one observed mutation. Which kind of mutation?
   Answer: Take the test-side mutations for every step except REFUSAL', which gets the product-line one. REFUSAL' is the step being loosened from an immediate read to a poll, and with about 120 tile entries arriving, a loose match could pass on the wrong entry. Only removing the real refusal block shows the step still catches that. GROUP' is fine test-side.

3. Question: OPEN-3: your ruling names walkthrough rows C2/C3, I4 and I5. Rows I6 and I8, the Part C heading and three fixture-table rows also name a fixture that no longer refuses. Include those name changes, for your sight, in this PR?
   Answer: (a) Include them (Recommended)

4. Question: The re-aim turns out to touch kernel/tests and, under OPEN-1 (A), engine/src/fixture.rs. You said the architect drafts it alone; the lead-data pilot puts an impact read first for pieces touching engine/ or kernel/. Which governs here?
   Answer: Alone stands. The form is already drafted, so an impact read now would not be the pilot's "read before drafting" and would not count as a measured piece. The one risk it would have caught is covered by the last sentence of the paste.
