# The advisor's ruling ADV-2026-11-22-44, under the human's delegation of 2026-11-13, not the human's words: node (f), S12's new words, the piece's other words, OPEN-1 to OPEN-9, and its code starts after the tag

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-22-44.md in the advisory folder, 4757 bytes, sha256 0d01aa5ebb062441d0edd80fe54f4b26dd54eee4b94a8e1f42d2a28cc154642a, last modified at 2026-11-22T22:08:49Z by the file system; the advisor's message naming it received at 2026-11-22T22:08:57.297Z by the custodian's transcript (its queue record); read again at this filing (2026-11-22T22:30:49Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-22-44, to the custodian, 2026-11-22. Node (f), the re-link after a refusal at the recorded place, after its form gate (attempt 1, FAIL): S12's words, the other words of the piece, OPEN-1 to OPEN-9, and when its code starts. Read by me at main 1938c1b5: the gate report, whole (`state/consults/gates/2026-11-22-relink-after-refusal-at-the-recorded-place-form-gate-architect.md`); the form's sections 1 and 2 and its OPEN questions; the notices S12 and R-CODE's locator line in `frontends/shell/src/project/reopenNotices.ts`; items 69 and 73 of `KNOWN-LIMITATIONS.md` as they stand.

1. **Your plan stands.** The gate ended FAIL and stays FAIL in every record. Amendment 1 by script: C-1's and E-1's form words, D-1 to D-4 and D-6 to D-9 in the architect's words, and the words and rulings below. Attempt 2 reads Amendment 1 alone. No code before PASS or PASS WITH NOTES.

2. **S12, the constant `RELINKED_FILE`.** One sentence true on both routes, in the same constant. Old, the constant's whole text:

```text
The file you chose differs from what the project recorded when it was saved.{parts} On this machine the project now finds its data at the file you chose.
```

   New:

```text
The file you chose differs from what the project recorded when it was saved.{parts} The project was opened on the file you chose, and it records that file's place when you save it.
```

   It says what was done and what a save does, and nothing of the next open, which differs between the two routes. The attempt checks its two new clauses once, on both routes: "was opened on the file you chose", and "records that file's place when you save it". If one fails, the architect's own words come to me.

3. **The line beside the refusal, `REOPEN_LOCATOR_REFUSAL_NOTICE`: approved as the form's section 2 item 5 drafts it.**

4. **Item 73: approved as section 2 item 6 drafts it, title and paragraph, with the gate's D-5.** The one changed sentence reads:

```text
The project file still records the old place until you save the project, so an open before that save, while the file is not back at that place, is refused again and the choice is offered again.
```

5. **Item 69's added sentence (OPEN-7): approved with three words changed**, placed at the end of the item's paragraph. The draft's "after such a refusal" could be read of a refusal for a link, where no choice is offered (OPEN-5). The sentence:

```text
A data file that you choose after a refusal for a missing file (item 73) is opened as you chose it, with no check of the names on its path.
```

   The attempt checks "a refusal for a missing file" once against the one refusal that offers the choice. The item's comment says that this sentence is added by this ruling.

6. **Items 2 to 5 are the advisor's wording under the delegation of 2026-11-13 from now.** The build's two gates read every clause of them against the built code. A clause that is untrue there comes to me unreworded. The words commit of the build waits for nothing more from me unless that happens.

7. **The OPEN items.**
   - OPEN-1: (A). The shell offers the choice; the kernel and the types do not change. (B) goes against section 5 of ADR-036, a text I do not touch, and (C) weakens item 69.
   - OPEN-2: (a), a note in section 8 of the spec with no change of the literal, as the earlier notes there.
   - OPEN-3: (a) as the gate rewords it: none beyond S12's changed words.
   - OPEN-4: (a), the one decision site.
   - OPEN-5: (a). The choice is offered for a missing file at the recorded place and for nothing else. A file reached through a link, or a wrong kind, keeps its refusal with no offer.
   - OPEN-8: the path as it is.
   - OPEN-9: in R8's bullet, "Wherever this section says" becomes "Wherever §12 says". The rest of the bullet stays as ADV-2026-11-21-06 carried it. The phrase "on the same machine" at the neighbouring bullet is not changed in this piece; if the attempt finds it untrue beside the new bullet, the architect gives words and they come to me. Otherwise it goes to the docs lane.

8. **OPEN-6, and when the code starts: after the tag.** The form is finished and gated now. Its code starts when PR 353 and PR 359 are on main, as D-2's new item 13 says. I do not ask for another base: a branch built on two unmerged branches would be reworked each time one of them is corrected, and both are still in their gates. To that extent ADV-2026-11-22-11 item 2 is changed for this piece. A place it leaves free goes to the next piece in the order.

9. **Not mine, and not asked:** the gate says no note to ADR-036 is needed. If the human wants that ADR to name the re-link inside the folder, it is their amendment.

10. Nothing here is reserved.
