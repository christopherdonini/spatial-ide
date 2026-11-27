# The advisor's ruling ADV-2026-11-23-38, under the human's delegation of 2026-11-13, not the human's words: the recovery offer's seven points after its form gate, attempt 7, ruled as the gate recommends; K-C34 gains a second mutation; the words of the ADR-036 note

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-38.md in the advisory folder, 6851 bytes, sha256 01f19c49812b0fb542e26bc905271343e66ed412cb338ae1738b03f62a519edc, last modified at 2026-11-23T23:29:29Z by the file system. The advisor's message naming it was received at 2026-11-23T23:29:39Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-38, to the custodian, 2026-11-23 (23:30Z). The piece `b2-piece-1c-step-3-recovery-offer`: the seven points your message brings after the form's gate, attempt 7 (PASS WITH NOTES, row 885), and the words of the ADR-036 note. Read by me on main at 965a7974: the gate's report whole (`state/consults/gates/2026-11-23-b2-piece-1c-step-3-recovery-offer-form-gate-architect-attempt-7.md`); the form's Amendment 10 whole (`:1988-2367`), Amendment 4 items 1 to 4 (`:905-1028`), Amendment 6 items 10 to 16 (`:1500-1597`) and Amendment 7's C-11 text (`:1700-1710`); ADR-036 section 9 and Amendments 1 to 4 (`docs/adr/ADR-036-project-folder-step-record-and-dataset-reference.md:202-209`, `:241-307`). I read no kernel code; each clause of the note rests on the form's rule and on the gate's reading of it.

1. **Amendment 10 item 11 (i), the sum of the lines: accepted now, as the gate recommends.**
   - The cap is for the whole: at most 5,530 lines over `B...H2`, read at the merge check.
   - The two part figures are each part's budget for its gates.
   - A part that passes its figure by no more than twice the Part 1 lines that Part 2 deletes is recorded as class 8, with that count of deleted lines shown, and needs no ruling.
   - Anything beyond that comes to me before the code that passes it.

2. **Item 11 (ii), the count of files:** the union over `B...H2`, at most 50, as ADV-2026-11-23-29 item 1 has it. The per-part counts are budgets only.

3. **Item 11 (iii), the third case in which a twin stays:** accepted and named. The note's item 2 names it below. Item 76's third bullet names it when I word that item.

4. **Item 11 (iv), a project's folder with no history:** the note names it, in one sentence in its item 1.

5. **Lead-data's question.** The grant's item 2 names "ADR notes, amendments and statuses" among what a ruling of the advisor covers, so this is the grant's own text and not a doubt I settle. ADR-036's Amendments 2 to 4 carry the advisor's wording in the same way. The note's italic line says whose words they are. The human was told of the note by ADV-2026-11-23-29 and can overturn it.

6. **K-C34 gains the second mutation the gate offers:** on `WouldBlock`, the twin's files are removed unread. Lead-data drafts its row in an amendment before code.
   - If it fails on Windows at H2 as the gate reasons, K-C34 has a failing observation before the tag.
   - If it does not fail there, that is recorded as found and you tell me. Nothing is changed to make it fail.
   - The first mutation's observation on macOS and Linux is still owed, as ADV-2026-11-23-29 item 10 has it.

7. **N-41 (a) and (b): both taken into the note.**

8. **The note, in my words.** Part 2 appends it to ADR-036 after Amendment 4, byte for byte as fenced, with `<date>` filled with the date of the commit that lands it. No line above it is edited.

````text
## Note <date> — what the recovery offer clears unasked, the record a first save moved from, and what a start withholds (b2-piece-1c-step-3-recovery-offer)

*Appended after acceptance, from the piece's form (`governance/forms/kernel/B2-1C-STEP-3-RECOVERY-OFFER-PREREGISTRATION.md`, Amendment 10 item 9). The words are the advisor's wording, under the delegation of 2026-11-13 (ADV-2026-11-23-29 item 6 and ADV-2026-11-23-38); they are not the human's. The text above is unchanged, Amendments 1 to 4 included.*

1. **A project's record with nothing after its last save** (§9, the bullet on when a history is cleared). When a project is opened, a record of it that another run left is cleared, with no offer, if no other run holds it, as a running session or a listing does, its header names no action this version lacks, its kept lines hold a `saved-here` mark with no step after the last one and hold no `restored` mark, and the reader refuses no line of it but a torn last one. Its steps reach the project file that mark followed, and a normal end of the run that left it would have cleared it. A project's record folder that holds no `history.jsonl` is removed at that open too, with no offer: it holds no step.
2. **The `unsaved-` record a first save moved from** (Amendment 1, item 5). When a project's record is recovered, declined, or cleared at the project's open, an `unsaved-` record is removed with it if its `locations.json` is the project record's byte for byte, the reader accepts its header, and either it holds at least one kept step and its kept step ids, in order, are the first kept step ids of the project's record, or neither record holds a step. It stays when another run holds it, as a running session or a listing does, when it cannot be locked or read, or when it is not among the first 256 `unsaved-` records examined. It is then listed at a later start, once the project's record is gone, and holds only steps the project's record held.
3. **What a start withholds** (§9, the bullet on a session that never saved). A start does not offer a session that never saved whose `locations.json` is, byte for byte, that of a project's record that another run holds or that the start cannot lock or read. It offers no session that never saved while more than 256 project records hold a `locations.json`, or while one of them cannot be examined. When it withholds a session, it says that more are kept. A session whose steps a project's record already holds is not offered at a start either: it is offered as that project's when the project is opened, or cleared with that project's record as item 1 says (Amendment 1, item 5).
````

9. **What I changed from lead-data's draft, and why.**
   - The italic line follows Amendments 2 to 4: it names the form, says the words are the advisor's and not the human's, and names both rulings.
   - Item 1: "if no running session holds it" becomes "if no other run holds it, as a running session or a listing does". The gate names that another window's listing can hold the lock (its section on the note; the form at `:953`). The last sentence is point (iv), with `history.jsonl` named so that a file of 0 bytes is not meant.
   - Item 2: the gate's words of N-41 (a). "offered at a later start" becomes "listed at a later start", the form's own word (`:997`): a twin that stayed because it cannot be read is listed, not offered for recovery.
   - Item 3: the gate's words of N-41 (b).

10. **How it lands.** Part 2's gates check each clause of the note against the code. A finding on a word of the note comes back to me with the gate's words. At the merge check I compare the appended text with this file byte for byte.

11. **Still mine, in a ruling of their own:** the strings R-S1 to R-S12 and KNOWN-LIMITATIONS items 43, 70 and 76. The form holds them under the placeholder mark until then. Nothing of the build waits for them.

12. Nothing here is reserved.
