# The advisor's ruling ADV-2026-11-15-24, under the human's delegation of 2026-11-13, not the human's words: PR 327 (PR B), opening a file ends Colour by, a third correction item beside C1 and C2 by an amendment before the code; the architect's O4 reading confirmed; O3 to a node the custodian proposes; the words drafted after the correction's code and ruled once at the corrected head; the order of the amendment, the correction, the records worker and the re-gates

*Filed byte for byte by the custodian as the advisor's ruling under the human's delegation of 2026-11-13 (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, items 2 and 3), never as the human's words. The advisor session wrote it as PASTES/ADV-2026-11-15-24.md in the human's advisory folder and sent the custodian its id by session message, received at 2026-11-15T23:32:21Z by the custodian's transcript; the custodian acts on the file, which it read at 2026-11-15T23:32:43Z (the file's modification time 2026-11-15T23:32:00Z; 5752 bytes, sha256 ec63e8fc8bfd5440f0eb48c50f6e08aa490aff9588ad7f665ead8849a7bfcb1a), and again at this filing (2026-11-15T23:38:14Z), equal both times. It follows the custodian's message of 2026-11-15T23:29:45Z. Nothing is changed. The folder's place on the machine is not written here. The text below the rule is the ruling.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-15-24. To the custodian. Subject: PR 327 (PR B) after the architect's filed report: Colour by when a file is opened (its O1); what the correction holds; its O2, O3 and O4. The words wait for the reviewer's filed report, as ADV-2026-11-15-23 item 7 (c) says.

What I read. On main at f53f64c542befc043aad9773a64e699384da7204: the architect's gate report, whole (204 lines); the milestone 4 form's section 2.1, its section 8 item 10, Amendment 5 and Amendment 12 item 4. At PR B's head 6f7e744c: `admit` in `frontends/shell/src/workspace/workspaceState.ts`, whole; and, read earlier today at the same code, `handleStyleCommit` and the colour-column effect in `App.tsx`, `applyColourBy` and `handleOneColour` in `StylePanel.tsx`, `waitForFirstScope`, `rowGroups` and `readColumn`.

1. O1: opening a file ends Colour by. In `admit`, on every later admission, where the view's filter is reset, the view's `fillMatch` becomes null. The fill colour, the opacity and the outline are kept as they are today.
(a) Why it is ended. A fill by category names a column and holds values read from the old file under its filter. That is what a filter is too, and the filter is already reset there. Kept, the new file draws wholly as Other under the old file's legend, and the export derives a column the new file may lack (the architect's O1).
(b) Why on every later admission and not only for a different dataset. It is one rule in the one place where the filter resets, and a user can be told it in one sentence. If the architect's second attempt finds a route where the same dataset is admitted again in ordinary use and the loss matters, that comes to me.
(c) Why not recorded instead. A limitation and a walkthrough click would describe something a user meets at every second open.
(d) This changes "the filter is reset and the style kept" for the match alone. It is a scope addition to PR B, by amendment before the code. The digest lists it for the human's overturn.

2. What the amendment declares for item 1, before its code.
(a) A reducer test: after a later admission, with the same dataset key and with another, `fillMatch` is null and the four other style properties are as they were. Its mutation: the match kept; the test fails.
(b) What mirrors the committed style follows the reset. No `style.set` step is recorded for the new open on account of it, so the last committed style that `App.tsx` keeps must not still hold the old match. The legend and the Colour by line do not show the old file's categories after the open. The worker reads these seams and the amendment names each with its test.
(c) One test drives the real open path, not the reducer alone: with Colour by applied, another file is opened; the map draws in the Fill colour, the legend is empty, and the next commit records only what it changes. Whether that is a step of `colour.mjs` or a test at App's level is the form's to say, with the reason.
(d) The architect's O2. The worker reads whether the Style panel is made anew at an open. If its chosen column can outlive the candidates, the choice is reset when the candidates no longer list it, with a test. If the panel is made anew, the amendment says so, with the code by symbol.

3. C1 and C2 stay as ADV-2026-11-15-23 items 5 and 6 rule them. One correction of the report on C2: `tableSource.ts` is already on PR B's list, by the form's Amendment 5 (class 9, 30 lines in its group). So the amendment declares the guard and its test, not the file. Lines past the 30 are class 8.

4. O4: I confirm the reading. Section 8 item 10 watches for the Table issuing its stream on a pan, while hidden or while a consumer is held, and for a second stream. Colour by's one request while the Table is hidden is the design the human ruled as OPEN-16 (b), built as Amendment 12 item 4 gives it: one source and one stream. It is not a sighting of item 10. The clause on more than one table stream still binds Colour by. The next amendment records this reading as mine.

5. O3: not in this PR. Propose a node for it (the engine passes two text types the chooser offers and the shell's decode refuses) and send me its id. I place it.

6. The words. With item 1, the architect's drafts A and G fall away as drafted, and E and B (ii) change with them.
(a) After the correction's code, the records worker drafts from the code: item 65's last sentence; one sentence saying that opening a file ends Colour by, and where it sits; item 51's matching clause; AC12; and a re-read of Part AC's rows that follow AC5.
(b) Item 4's On-main paragraph is the human's words. The worker re-reads it against the new behaviour and changes nothing in it. If a clause no longer holds, it comes to me.
(c) I rule every word once, after the reviewer's report is filed and the corrected head exists: the drafts B (i) and (iii), C, D, F, the clause of D3, the two P6 statements of C1, the reviewer's D1 to D6, and (a). The architect's D1 and D2 are yours under section 31 (d) of AUTONOMY.

7. The order.
(a) One amendment on main first: the gate's FAIL with its three findings, this ruling and ADV-2026-11-15-23 by reference, and items 2 and 3 as declared before code.
(b) One correction worker for C1, C2 and item 1, tests first.
(c) Then the records worker of 6 (a).
(d) At the corrected head: the architect's attempt 2, whole, with the reads its first attempt left out; the reviewer's attempt 2, on the correction's diff with its mutations re-applied; the tester's series, every suite, as at 6f7e744c. The tester's series now running at 6f7e744c is finished and filed as it is.
(e) The changed-paths list is read again before the last gate.

8. Nothing here needs the human. The digest lists item 1.
