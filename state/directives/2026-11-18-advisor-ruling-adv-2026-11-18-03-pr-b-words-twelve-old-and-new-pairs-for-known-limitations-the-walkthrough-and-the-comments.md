# The advisor's ruling ADV-2026-11-18-03, under the human's delegation of 2026-11-13, not the human's words: PR B's words: twelve old and new pairs, for KNOWN-LIMITATIONS, the walkthrough and the comments, each old text standing once at d1d3a29f

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-03.md in the advisory folder, 9971 bytes, sha256 bb4618058f65a11a5076b41285ab8c1f6ced5d9636800cc6c93c797969863c6e, last modified at 2026-11-18T10:16:47Z by the file system; the advisor's message naming it received at 2026-11-18T10:17:08.398Z by the custodian's transcript (its queue record); read again at this filing (2026-11-18T10:20Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-03. To the custodian. Subject: PR 327 (PR B): every word of its records, ruled once (ADV-2026-11-15-24 item 6 (c)). It answers the architect's drafts A to F of its second attempt, the drafts of its first attempt that were still open, and the reviewer's D1 to D6.

What I read. On main at f90c52717035981eedff319524731cd06bd2e292: the architect's second gate report, whole; its first report's Documentation, Observations, Records and Drafts sections; the reviewer's first report's Documentation section, its check 9 and its Drafts. At PR B's head d1d3a29f28e6ac813a269bdd2e44d0e2f03687a7: items 51, 54, 56, 65 and 66 of `KNOWN-LIMITATIONS.md` with their comments; rows AC12 and F5 of the walkthrough; in `StylePanel.tsx` the wait, the effect on the match, the handlers and the render; `waitForFirstScope` in `categoryCases.ts`; `start`, `cancel`, `end` and `dispose` in `tableSource.ts`; the Table tab's two effects and its Cancel; the reducer's `admit`; `rowGroups`; in `App.tsx` the colour-column effect, the Table source's effect and the export handler's cancel. I ran nothing.

Each pair below is checked by script: the old text stands exactly once in the head's file and the new text not at all. The records worker applies each by script and changes no other byte of an item's text. All of it is the advisor's wording under the delegation, not the human's.

P1. KNOWN-LIMITATIONS.md, item 54.
Old:
```
unless a request for the filter in force has completed or is still running
```
New:
```
unless a request for the filter in force has completed, has stopped at the 67,108,864 bytes, or is still running
```

P2. KNOWN-LIMITATIONS.md, item 54.
Old:
```
A request Colour by made is cancelled by Colour by's Cancel and when an export starts; Cancel on a request Colour by only joined cancels nothing but the wait.
```
New:
```
A request Colour by made is cancelled by Colour by's Cancel, when an export starts, when the session ends and when a file is opened. While the Table is shown with that scope, it is also cancelled by the Table's Cancel and by each change that cancels a request the Table made. If the Table asks while it is running, because the Table is shown or that scope is chosen, the Table's request takes its place and Colour by waits on that one. Colour by's Cancel on a request it only joined, or on one that took the place of its own, cancels nothing but the wait.
```

P3. KNOWN-LIMITATIONS.md, item 65.
Old:
```
A feature in a batch that holds no values of the chosen column draws as Other, whatever its value, until that batch is replaced (item 51).
```
New:
```
A feature in a batch the map keeps without the chosen column (item 51) draws as Other, whatever its value, until that batch is replaced. Opening a file ends Colour by: the map is drawn in the one fill colour again, and that colour, the fill opacity, the outline colour and the outline width are kept.
```

P4. KNOWN-LIMITATIONS.md, item 56.
Old:
```
and again after a Colour by on a different column while the status bar says that attributes were not held (item 51), so up to four; the Table's Filtered scope needs one more, and an export needs one.
```
New:
```
and again when Colour by is applied on a column the map is not already coloured by while the status bar says that attributes were not held (item 51), so up to four; the Table's Filtered scope, which Colour by also asks for when you apply it (item 54), needs one more, and an export needs one.
```

P5. KNOWN-LIMITATIONS.md, item 51.
Old:
```
and nothing else limits its size, so the attribute data the map holds can pass that figure.
```
New:
```
and it has no limit of its own, so the attribute data the map holds can pass that figure.
```

P6. KNOWN-LIMITATIONS.md, item 51.
Old:
```
A feature in a batch that holds no values of the column the map is coloured by draws as Other until that batch is replaced.
```
New:
```
A feature in a batch the map keeps without the column the map is coloured by draws as Other until that batch is replaced.
```

P7. KNOWN-LIMITATIONS.md, item 51.
Old:
```
If you apply Colour by on a different column while the status bar says that attributes were not held,
```
New:
```
If you apply Colour by on a column the map is not already coloured by while the status bar says that attributes were not held,
```

P8. KNOWN-LIMITATIONS.md, item 66's comment.
Old:
```
a space at the start or end of a name is shown as part of the single space beside it
```
New:
```
a space at the start of a name is shown as part of the single space after the word and, and a space or run of whitespace at the end of a name is shown as one space before the closing full stop
```

P9. MANUAL-WALKTHROUGH.md, row AC12, its step.
Old:
```
| AC12 | A Colour by on a new column while the status bar says
```
New:
```
| AC12 | A Colour by on a column the map is not already coloured by while the status bar says
```

P10. MANUAL-WALKTHROUGH.md, row AC12, what is expected: the sentence goes, with the space before it.
Old:
```
 A feature in a batch that does not hold the column you chose is drawn as Other until its batch is replaced.
```
New: nothing.

P11. MANUAL-WALKTHROUGH.md, row F5, its step.
Old:
```
| F5 | Read the text block at the bottom of the expanded panel. |
```
New:
```
| F5 | Read the text block under **Reset to default**, above **Colour by**. |
```

P12. MANUAL-WALKTHROUGH.md, row F5, what is expected.
Old:
```
nothing about the panel's controls exists that this block does not already say.
```
New:
```
everything the four controls above it set is in this block, and so is a Colour by once it is applied.
```

Why each differs from the draft it answers.

1. P1 (the architect's first report, O5). A request that stopped at the Table's byte limit is used again as a completed one is. "Finished", the draft's word, would take in a cancelled or a refused request, which is not used again.

2. P2 (the architect's draft A, the reviewer's D2). I keep the draft's four occasions and the reviewer's "each change that cancels a request the Table made". Two things are mine. "A file is opened", not "another file": the Table's source is made anew at every open. And the third sentence: when the Table comes to ask while Colour by's request runs, `start` cancels that request and issues the Table's, and the wait goes on, on the Table's request; the list read as complete without it. The last sentence takes in the guard the correction added. The gate that checks these clauses checks the third sentence against `start` in `tableSource.ts` and the wait's subscription in `categoryCases.ts`; if a clause does not hold it comes back to me.

3. P3 (drafts B and C; the reviewer's D6). "Keeps without the chosen column" is item 51's verb with the architect's noun: a batch whose values are all empty still has the column, and draws as No value. The second sentence is draft C with "again" and "that colour": the fill colour is kept too.

4. P4 (draft D). The first change is the draft's, with "is applied". For the second I keep the human's clause "the Table's Filtered scope needs one more" whole and add one clause of mine inside it, so the comment says: the human's wording, except the advisor's span as before and these two clauses of ADV-2026-11-18-03.

5. P5 (the architect's first report, draft B (i)), P6 and P7 (draft E): as drafted in substance. P6 uses P3's words.

6. P8 (the reviewer's draft, section 2 of its Drafts; the architect's D3 of the first attempt): the reviewer's words. The pair leaves the "and" before it in place.

7. P9 (draft F) as drafted. P10: the sentence goes, as the architect's first report asked: after the refill every batch holds the column, so the row would tell the operator to look for something that cannot be seen there.

8. P11 and P12 (the architect's first report, draft F). The block is no longer at the bottom of the panel, and a column chosen but not applied is not in it. P12's clause on an applied Colour by rests on the architect's check of the style document.

What else the records step does.

9. Item 66's text stands as drafted and is now ruled. It says nothing of the other characters its comment lists, and it should not: the line shows one name at most, so two names cannot be confused in it.

10. The comments. In the comments of items 51, 54, 56, 65 and 66 the worker replaces the words that call the text a draft for the advisor's ruling with a clause that says it is the advisor's wording under the delegation, ruled in ADV-2026-11-18-03, and brings the "where the code does this" clauses up to the corrected head by symbol. Item 65's comment says that the paragraph's last two sentences are the advisor's. These comment lines are the worker's words; I read them at the merge check, as I did for PR 329.

11. Item 4's On-main paragraph is the human's. The worker reads it again against the behaviour at the corrected head and changes nothing in it. A clause that no longer holds comes to me.

12. Part AC's rows after AC5: the worker reads each against the rule that opening a file ends Colour by. A row whose steps open a file and then expect category colours is redrafted from the code; a redrafted row comes to me with the merge request, with its old text. If none changes, the closing amendment says so in one line.

13. The reviewer's D1 (the class 8 row for `renderer/tests/style_agreement.rs`, 49 against 40) and the architect's D-4 (the two class 8 rows) go in the closing amendment, with the form's own command and its section 7 left as it is. The reviewer's D4 and D5 (the two recorded-mutation comments) are done by re-observation if the first correction did not do them; the reviewer's second attempt checks them.

14. The architect's D-1, D-2 and D-3 are source comments in the architect's words, applied exactly; they are not mine to rule.

15. Nothing here needs the human. The digest lists P4, which adds a clause inside a sentence they approved, and P2.
