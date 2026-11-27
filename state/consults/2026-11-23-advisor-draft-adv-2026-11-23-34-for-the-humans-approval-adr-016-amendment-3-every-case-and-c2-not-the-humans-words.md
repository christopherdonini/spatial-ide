# The advisor's draft ADV-2026-11-23-34, for the human's approval: ADR-016 Amendment 3 as the architect drafted it (`state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md`), with every case in which the file's own id column cannot serve and C2, and two sentences of KNOWN-LIMITATIONS item 3 replaced. Not the human's words and not a ruling: it binds nothing until the human types approved ADV-2026-11-23-34 in the custodian's session

*Filed byte for byte by the custodian, 2026-11-23: PASTES/ADV-2026-11-23-34.md in the advisory folder, 3499 bytes, sha256 a8c7ef24984dfa0bb6aaf0c242222fde9f17d2ab38f286197cff77f0b8dd7000, last modified at 2026-11-23T22:33:12Z by the file system; the advisor's message naming it received at 2026-11-23T22:33:42Z by the custodian's transcript (its queue record). Nothing is changed.*

---

Draft for Chris's approval.

To the custodian, 2026-11-23. On the piece `text-id-opens-for-the-session-by-row-position`, after my message of 2026-11-23 (20:56Z).

1. **ADR-016 Amendment 3 is accepted as the architect drafted it.**
   - The text is the block in part 2 of `state/consults/2026-11-23-text-id-opens-for-the-session-by-row-position-adr-016-amendment-architect-draft.md`, as filed at main 8dad2a6c (the file: 23103 bytes, sha256 3d1e6181d7f5918a581ec0ae92a529938aece3f53d312eec1a3ea92f184eb668). It runs from the heading `## Amendment 3` to the words "the choice for a dataset that Recover opened."
   - It is appended to ADR-016 in this piece's own pull request, after Amendment 2 and the Note 2026-11-23. Nothing above it changes.
   - Three things are filled at the append. The heading's date is the date of my approval, and its status is Accepted. The italic line under the heading says that I accepted it by this message, and still says that the words are the architect's and not mine. An acceptance line at the end names this message as filed, and the draft's path and hash.

2. **Which files get the choice:** every single file whose own `id` column cannot serve. That is a type that is not an integer, a negative value, or repeated values (the draft's Decision 2). A file refused for its values is checked across the whole file again before it opens this way.

3. **A saved project.** Nothing of the choice is saved. Opening the project refuses the column again and offers the row-position choice, and only that choice. The file opens only if the user chooses again (the draft's Decision 6; the architect's C2).

4. **The file's own `id` column on such an open.** The name `id` then means the row position. The file's own `id` column cannot be shown or filtered on (the draft's Decision 5).

5. **KNOWN-LIMITATIONS item 3.** Two sentences of mine are replaced.
   - `This is the one case in which a row position stands in for identity.` becomes `This and the choice below are the only cases in which a row position stands in for identity.`
   - `A file whose `id` column cannot serve is still refused.` becomes ``A file whose `id` column cannot serve is still refused, and the identity form then offers a second choice: open the file for this session by row position. Chosen, it opens as a file without an `id` column does, the summary says that you chose it, and its own `id` column cannot be filtered on or projected. Nothing of the choice is saved or published: opening the file or the project again refuses the column and asks again.``

6. **Corrections of wording.** If a gate finds a clause of the amendment or of item 5's sentences untrue or unclear, the advisor settles it with the gate's words, under my message of 2026-11-21, as long as nothing in items 2 to 4 changes. A change to items 2 to 4 comes back to me.

7. **The build** may start once this is approved and the form's gate has passed. The piece stays second in my order.

8. **If my approval adds a word, that item changes.**
   - `narrow`: item 2 is instead only a file whose `id` column is text. The architect's narrow wording of Decision 2 replaces the drafted one, and the sentence on the second check leaves the Consequences.
   - `C4`: item 3 is instead that a project cannot be saved while such a file is open in it. The architect's C4 wording of Decision 6 replaces the drafted one, and `open_project` leaves the Consequences.
   - With either word, item 5's second sentence comes back to me reworded.
