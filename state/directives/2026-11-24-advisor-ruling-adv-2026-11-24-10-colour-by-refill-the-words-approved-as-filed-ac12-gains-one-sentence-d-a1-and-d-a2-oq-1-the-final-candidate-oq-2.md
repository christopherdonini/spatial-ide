# The advisor's ruling ADV-2026-11-24-10, under the human's delegation of 2026-11-13, not the human's words: colour-by-refill, PR 365: items 51 and 61, AC12's third cell and the e2e README entry approved as filed; one sentence added to AC12's second cell; D-A1 and D-A2 in one commit; OQ-1, the final candidate after the tag; OQ-2, not a verbatim mark

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-24-10.md in the advisory folder, 5129 bytes, sha256 5d43e8638943d56b8ea36b7647e6598638f009d6db7173132878d059f7d2151d, last modified at 2026-11-24T04:04:05Z by the file system. The advisor's message naming it was received at 2026-11-24T04:04:38Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-24-10, to the custodian, 2026-11-24 (04:04Z). The piece `colour-by-refill-keeps-the-view`, PR 365: the words after the architect's build gate (row 896, PASS WITH NOTES), and its two open questions. Read by me on main at b5d2d713: the gate's report whole (`state/consults/gates/2026-11-24-colour-by-refill-keeps-the-view-build-gate-architect.md`); in the form, Amendment 2 items 4 and 5, Amendment 4 items 1 and 6, Amendment 6 item 6 and Amendment 9. Read at the head d636c3b6a952779a9ef2652cfd891541d3d53339: items 51 and 61 of `KNOWN-LIMITATIONS.md` with their comments, row AC12 of the walkthrough, and the suite's entry in the e2e README. The words below are the advisor's rulings, not the human's.

1. **Item 51: approved as filed.** The two sentences are:

```text
If you apply Colour by on a column the map is not already coloured by while the status bar says that attributes were not held, the map is cleared and, once its first data load completes, filled again for the view it shows; the view does not move, unless the map was still waiting to move the view to the first features after an open, an Apply, a Clear or any other change of the filter, and then it moves to the first features that arrive, as it would have. The status bar still says that attributes were not held.
```

2. **Item 61's fourth sentence: approved as filed.** It is:

```text
Zoom to layer frames the union of every batch the map has held since the open, or since the last Apply, Clear or other change of the filter, or since Colour by last cleared the map (item 51), and that union is never made smaller.
```

   - The changed span replaces two words of a sentence the human approved. I rule it under the grant's item 2, and I tell the human.

3. **Item 61's third sentence stays as the human has it.** It is true as it stands. The fourth sentence and item 51 carry the other changes of the filter.

4. **Row AC12's third cell: approved as filed.** It is:

```text
The map is cleared and, once its first data load completes, fills again for the view you had; the view does not move. The status bar still says that some features' attributes were not held (KNOWN-LIMITATIONS item 51). Record what the status bar says besides, and whether the view moved. **Felt:** did the map clearing and filling again surprise you, and is it clear from the screen when it has finished filling?
```

5. **Row AC12's second cell gains one sentence.** This is the form gate's point, carried to me by Amendment 6 item 6. As the steps stand, the map can still show the open's own fit when Colour by is applied, and then the row reads the same with the fix and without it.
   - After the sentence that begins `Open the file you brought for AC12`, and before the sentence that begins `In the Style tab`, this sentence is inserted:

```text
Then pan the map to a different area.
```

   - This changes Amendment 4 item 1's rule for the merge in one point. The first cell stays as main has it. The second cell is main's, with this sentence at the same place. If either sentence beside it has changed on main by then, that comes to me with the words.

6. **The e2e README entry: approved as it stands at d636c3b6.** At the merge check I compare the entry with that commit's.

7. **D-A1 and D-A2: as you propose, in one commit after this ruling.** That commit also carries item 5's sentence, and nothing else.
   - In D-A1's New, `landed for the advisor's ruling from the filed text (ADV-2026-11-23-18 item 5)` becomes `ruled as filed in ADV-2026-11-24-10 item 1 (ADV-2026-11-23-18 item 5)`.
   - In D-A2's first New, `landed for the advisor's ruling under the human's delegation of 2026-11-13 (ADV-2026-11-23-18 items 4 and 5)` becomes `ruled as filed in ADV-2026-11-24-10 item 2, under the human's delegation of 2026-11-13 (ADV-2026-11-23-18 items 4 and 5)`.
   - The rest of the gate's words is applied as the report gives it.

8. **OQ-2: the comment is not a verbatim mark.** It marks no quoted span; it says whose wording the item is. D-A2 is a Documentation finding, fixed before the merge with no re-gate.
   - A comment that calls words the human's when they are not is never left standing. At the merge check I compare D-A2 as applied with the report's words and item 7, byte for byte.

9. **OQ-1: the final candidate is the head after main has been merged in,** as section 10 has it, after the tag. The series of the six suites runs there, once, with one series report. The merge request waits for it. Its absence now is not an Evidence finding.

10. **The carried points.**
    - Amendment 2's D1 and D6 and Amendment 4's D-c stand as written. I had ruled before them and have now read them.
    - Section 8's bullet on the words is met for items 1, 2, 4 and 5 once the words commit equals this ruling.
    - The bullet on AC12's third cell at the merge stands, with item 5's change.

11. **The merge check** compares items 1, 2, 4, 5 and 7 with the diff byte for byte.

12. Nothing here is reserved. Item 2 changes a sentence the human approved; they are told in the digest and may overturn it.
