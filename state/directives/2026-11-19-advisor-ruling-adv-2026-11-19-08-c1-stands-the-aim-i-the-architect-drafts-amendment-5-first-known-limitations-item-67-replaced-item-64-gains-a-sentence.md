# The advisor's ruling ADV-2026-11-19-08, under the human's delegation of 2026-11-13, not the human's words: PR 335 (the first look) after both gates: C1 stands and the aim is (i); the reviewer's proposed lines are not dispatched, the architect drafts Amendment 5 first; project.mjs not changed; KNOWN-LIMITATIONS item 67 replaced whole, item 64's comment gains a sentence; the words; one reviewer re-gate

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-08.md in the advisory folder, 12030 bytes, sha256 c9c451ecb149e4358d1598de7ff99826287d6b6560cae394f62a0c8ed93d5e27, last modified at 2026-11-19T06:48:35Z by the file system; the advisor's message naming it received at 2026-11-19T06:48:53.401Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T06:54:00Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-19-08, to the custodian, 2026-11-19. PR 335 (the first look), after both gates at e374eb711caaeae4dd898e8ddb49a35d4d80c619. Read by me at that head: both gate reports, whole, as filed at 65a72f72; `stepAnd`, `waitCommitted` and `readRecordStepRows` in `frontends/shell/e2e/command-bar.mjs`; `ConsolePanel.tsx`, the ring in `recorder.ts`, the grouping in `consoleViewModel.ts`, `diagnostics/log.ts` and `call` in `skp/client.ts`; the top doc and the new block of `candidateArmSession.ts`; items 64 and 67. I ran nothing.

1. **C1 stands, and the aim is (i): the property is restored, not reworded.** Amendment 4 item 6 lifted section 11 item 11 on the condition that each step keeps "one row per commit, in order, `ok`". The reviewer showed that E-AND does not keep it after card B. The lift does not hold until C1 is closed, and nothing merges before that.

2. **The reviewer's proposed lines are not dispatched as they stand.** From what is filed I cannot predict that M-X2 fails under them. Three facts, by my reading of the code at the head:
   - (a) `waitCommitted` compares as many rows as the Console holds (`Math.min(r.length, committed.length)`). The proposed lines keep that. When the Console no longer holds the row before the last two, the comparison is the one M-X2 passed.
   - (b) A load of a view adds about twice the entries Amendment 4 counted. Each tile is one `viewport_query` request, which is an entry. Each tile terminal also writes a session-log line through `logSessionEvent`, and that call records an entry of its own (`recordNamed("binding-command", "binding_log_session_event")`). So a load of 110 tiles is at least 220 of the Console's 256 entries. The reviewer's M-A4-3 line agrees: its last reading held two `record_step` rows, though card A and card B had recorded four between them.
   - (c) Each click that opens a closed group is an entry too (`console.toggleGroupExpanded`). `readRecordStepRows` clicks every closed group at every poll, and a group closes again when its first entry is dropped. So the reader pushes rows out while it waits.
   Under M-X2 the rows are A, card A's load, A again, the combined text, card B's load. Once the first A is dropped, the Console's last two rows are A and the combined text, and the step passes as it did. Whether that happens inside the 30 s wait depends on the load and on the reader's own clicks. A mutation whose failure depends on what the ring still holds is not a declared prediction.

3. **The architect drafts Amendment 5 in one short read, and the draft comes to me before any code.** It answers, in this order:
   - (a) Is there a reading for E-AND after card B, in `command-bar.mjs` alone, that shows card B's commit added exactly one `record_step` row, whatever the ring has dropped? It must not shorten to the rows the Console holds. Where it cannot tell, the step fails and says so. It must not rest on timing. If there is one, the amendment declares it before its code, with its ceiling against F, what the unmutated run does, and the failing line predicted for each of M-A4-1, M-A4-3 and M-X2.
   - (b) If there is none in test code alone: the smallest change outside it that would give one, named with its file and not built. That is a scope addition, and mine to rule.
   - (c) Which unit tests, by name, pin one recorded step for one card change, and whether M-X2 would fail any of them, by reading.
   For its brief, by my reading and for it to check: 2 (a) to (c); the Console's label shows the number of entries held and the number dropped, and their sum is every entry recorded since the app started; the page shows no sequence number for an entry; consecutive entries of one command form one closed group, so two `record_step` rows side by side are hidden until the group is opened.
   If (a) has no answer and (b) is more than this piece should carry, I rule (ii) then, in the open: the weaker reading named, the README's E-AND entry and the PASS text reworded by me, the loss recorded as not covered, and the human told that a condition I set was not met.

4. **Section 11 item 11 and a fix under (i).** Not engaged: no prediction or tolerance of the form changes, the code is brought to the property the form already declares, and M-X2's prediction is declared in Amendment 5 before the code. (ii) would engage it.

5. **`project.mjs` is not changed.** Its reading has the same gap at its second step. That is not a weakening against F, which counted "at least" (the reviewer's C1). The closing records it as not covered, with the architect's O1: a duplicate of a suite's first commit is not caught, at F or now.

6. **KNOWN-LIMITATIONS item 67: A1 and A2 are both right, and a third clause of mine is untrue.**
   - A1: the 110 is a count of tile terminals, so the requests were at least that many.
   - A2: a tile gets a request only when the app mints it. A tile already held, cut from the plan or dropped from the queue gets none.
   - Mine, found now: "the Console holds little more than two such loads" is untrue, by 2 (b). It holds little more than one. I took the diagnosis's count of 110 a load and did not read what else records an entry. The reviewer's re-gate reads the new clauses, this one first.
   Item 67 is replaced whole: its bold line, its paragraph and its comment become the three lines below. Old is the item as it stands at the head. New:

````
67. **The Console keeps its newest 256 entries, and one load of a view can add more than two hundred.**
    The Console keeps its newest 256 entries. When it is full, each new entry drops the oldest one, and the Console's label shows how many were dropped. When the first data load of a view completes (after an open, an Apply or a Clear, for example), the map asks for tiles of that view. Each tile is asked for in a request of its own, and each request is an entry. When a tile's load ends, other than by the app's own cancel, the app writes a line to the session log, and that write is an entry too. Panning and zooming ask for tiles in the same way. In the app-window tests one such load was at least 110 tiles, which is at least 220 entries. At 220 entries a load the Console holds little more than one load, so the entries before it, the steps you recorded among them, are dropped. Only the entry leaves the Console: the request was already sent, and a recorded step stays in the session's history. A group of entries you have opened closes again when its first entry is dropped.
    <!-- The advisor's wording under the human's delegation of 2026-11-13 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md, items 2 and 3), not the human's words, ruled in ADV-2026-11-19-06 (item 5) and corrected in ADV-2026-11-19-08 (item 6); the number is the next after item 66. Found at step S9 of open-first-look-fills-fit-view (Amendment 4 of governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md). Where the code does each clause, by symbol: MAX_CONSOLE_ENTRIES, push and droppedCount in frontends/shell/src/console/recorder.ts (the 256, the oldest entry dropped, each drop counted); the label in ConsolePanel in frontends/shell/src/console/ConsolePanel.tsx (the count of drops in the label), and ConsoleGroupRow there (a group is keyed by its first entry and holds its own open state); consoleRecorder.record in frontends/shell/src/skp/client.ts (every request is an entry); the viewportQuery call in frontends/shell/src/streaming/tileViewportStreamManager.ts (one request for each tile it mints; a tile already held, cut from the plan or dropped from the queue gets none); logSessionEvent in frontends/shell/src/diagnostics/log.ts, called with candidate-tile-terminal in the tile manager's onTerminal callback in frontends/shell/src/residency/candidateArmSession.ts (one line for each tile terminal, which the manager does not report for a cancel of its own), an entry through recordNamed in recorder.ts; the plan at the first look's Completed terminal, as item 64's comment names it. The figure 110 is the count of tile terminals after each first look in the S9 session logs of command-bar.mjs and project.mjs on filter-zoned.parquet, as the architect's diagnosis counts them (state/consults/2026-11-19-open-first-look-fills-fit-view-s9-failures-diagnosis-and-amendment-4-architect-draft.md); it is not a bound. Each of those terminals is one session-log write and follows one request, so the entries were at least 220: that is the advisor's reading of the code at e374eb711caaeae4dd898e8ddb49a35d4d80c619, not a count from a run. ADV-2026-11-19-06's text said 110 requests and little more than two loads; the architect's gate findings A1 and A2 and the advisor's own reading corrected it. Not examined: how many entries a cancelled tile request adds. -->
````

   The next unmutated `command-bar.mjs` run records the two numbers of the Console's label after card A's wait and after card B's map settles. If the entries added between them are fewer than 220, it comes to me.

7. **Item 64, the architect's open edge.** The paragraph is not changed: with no geometry there is nothing to show and no tile to ask for. Its comment gains one sentence at its end. Old:

````
(untiled-reissue-holds-earlier-look-handle-until-mint). -->
````

New:

````
(untiled-reissue-holds-earlier-look-handle-until-mint). Also not covered, found at the architect's gate of the piece and ruled in ADV-2026-11-19-08 (item 7): an open whose first look delivers no geometry, after which no grid frame is set (establishFrameFromExtent returns on a null extent) and this change plans nothing, so no tiles are asked for. -->
````

8. **The words commit.** One commit, made with C1's outcome and before the re-gate.
   - The frame sentence of `candidateArmSession.ts`: the reviewer's D1, the whole sentence. The architect's Draft 1 replaces a clause that follows a dash and itself begins with a dash, so applied as given it leaves two. Its finding is closed by the reviewer's words.
   - The auto-fit sentence: the architect's Draft 2. The reviewer's D2 says the view's tiles are planned either way, which is untrue for an open with no geometry: no frame, so no plan.
   - The header for E-AND-b in `command-bar.mjs`: written with C1's outcome, from the code at that head, in the shape of the architect's Draft 3. The re-gate reads it.
   - As given: the architect's Draft 4 (the README's E-FL entry) and the reviewer's D3 (the block's not-covered note).
   - Not applied: the architect's D5. It changes a string in `layout.mjs`, not a comment, and `layout.mjs` stays the file that ran. The closing records it for the next piece that edits that suite.
   - By reference in the closing, the form not edited: the M-U2g row (the architect's E-R1, the reviewer's D5 and its M-X); M-A4-1's earlier failure (E-R2); FILL's mutation after Amendment 3, seen to fail by the reviewer at the head (its check 8), which answers the architect's O2.

9. **Runs and the re-gate.** A4-3's condition named three paths. The words commit adds `frontends/shell/src/residency/candidateArmSession.ts` and `frontends/shell/e2e/README.md`. They call for no further app-window run if every line of `candidateArmSession.ts` changed since the gated head is a comment line, by script. The reviewer alone re-gates, once, at the head that carries C1's outcome and the words: C1, the words by diff, and the clauses of items 6 and 7. Every other run is reused. The architect's gate stands.

10. **Noted, no ruling.** The reviewer's mint-window probe (its check 7): I grade `untiled-reissue-holds-earlier-look-handle-until-mint` from it at the merge check, as ADV-2026-11-19-01 item 1 says. K7: no finding. The two red runs on the branch go in the closing with their causes.

11. Nothing here is reserved. The human is told, in the digest and in chat, that item 67 was wrong in my words and how, because whether v0.2 waits for the Console node is theirs.
