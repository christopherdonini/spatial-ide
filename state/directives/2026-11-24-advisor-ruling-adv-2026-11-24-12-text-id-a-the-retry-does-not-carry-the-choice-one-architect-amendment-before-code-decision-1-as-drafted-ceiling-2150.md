# The advisor's ruling ADV-2026-11-24-12, under the human's delegation of 2026-11-13, not the human's words: text-id, the choice ADV-2026-11-24-11 item 4 left open: (A), a retry after a question or a not-found reply does not carry the choice; one architect amendment before code; Decision 1 of the draft as drafted, five corrections not six; the line ceiling restated to 2,150; the amendment reserved through ADV-2026-11-23-34

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-24-12.md in the advisory folder, 2580 bytes, sha256 d7e874fc7c0b37bedb645469e9ce7c6572c8f064a07dd5de89b5d7d8811673e8, last modified at 2026-11-24T04:45:18Z by the file system. The advisor's message naming it was received at 2026-11-24T04:45:31Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-24-12, to the custodian, 2026-11-24 (04:45Z). The piece `text-id-opens-for-the-session-by-row-position`: the choice ADV-2026-11-24-11 item 4 left open, and the line ceiling. Read by me on main at 7a07ca1c: in the architect's form gate, attempt 3 (`state/consults/gates/2026-11-24-text-id-opens-for-the-session-by-row-position-form-gate-architect-attempt-3.md`), checks 5 to 8, the findings D4 to D6 and the paragraph on my item 4; in `AdmissionPanel.tsx`, `reopenPath`, `handleRelink` and the question and not-found blocks.

1. **(A): a retry after a question or a not-found reply does not carry the choice.** It carries the answer and the re-link, as today. The retry is then refused for the file's `id` column again and the choice is offered again.
   - Why: the choice is the user's, made beside a refusal they can see. Asking once more after a moved file or a question costs one click and takes nothing for granted. Carrying it across two more screens costs several times the lines for a case that is seldom met.
   - My reading of the code agrees with attempt 3: `reopenPath` builds the retry's options from the reopen's answer and re-link alone.

2. **How (A) lands.** The architect writes it as one amendment before code, with no further gate attempt:
   - one sentence in section 2 item 12, saying what item 1 says;
   - one row in section 4 for the pure-function test, with its file, its name, its red reason at the skeleton and its mutation.
   - The build's reviewer reads that row with the diff.

3. **Decision 1 of the ADR-016 Amendment 3 draft stays as drafted.** With (A), its last sentence holds: the one further attempt that carries the choice is the CRS form's, and that form shows it. The gate's words for that sentence, the first of the five in attempt 2's check 6, are not taken.
   - This changes ADV-2026-11-24-11 item 3 in one point: the corrections I settle under item 6 of ADV-2026-11-23-34 are five, not six. They are K-2's, and the gate's words for Decision 3, for Decision 4's second sentence, for the candidate list and for the engine's consequence.

4. **The line ceiling is restated to 2,150, before code.** The estimate with (A) is about 2,095 to 2,106. The file ceiling stays 84. Section 7's line is not edited; an overrun at the head is class 8.

5. **D4, D5 and D6** are carried by your Amendment 5 with the gate's words. Nothing in them needs a ruling.

6. **Reserved.** The amendment itself is the human's, through ADV-2026-11-23-34. No code is written before their approval.
