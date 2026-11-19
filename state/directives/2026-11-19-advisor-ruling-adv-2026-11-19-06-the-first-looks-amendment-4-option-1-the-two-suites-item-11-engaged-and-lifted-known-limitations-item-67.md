# The advisor's ruling ADV-2026-11-19-06, under the human's delegation of 2026-11-13, not the human's words: the first look's S9 stop: Amendment 4 goes in as the architect drafted it with five changes; Option 1, the two suites; §11 item 11 engaged and lifted on three conditions; KNOWN-LIMITATIONS item 67 in the advisor's words; one node proposed, not placed

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-19-06.md in the advisory folder, 10344 bytes, sha256 b06b66ec731bb8753c6960fc3672ed4b8732aebcf5190e90def7a344885cbc2f, last modified at 2026-11-19T03:59:12Z by the file system; the advisor's message naming it received at 2026-11-19T03:59:19.606Z by the custodian's transcript (its queue record); read again at this filing (2026-11-19T04:12:15Z), equal. Nothing is changed.*

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-19-06. To the custodian. Subject: the first look's S9 stop: Amendment 4 and its packet A4-1 to A4-7, and a new KNOWN-LIMITATIONS item 67.

What I read. On main at 1b33d858: the architect's diagnosis and draft, whole. The re-runs report, whole, and the series report's lines on `console`, K7 and the load. The form's §5 and §11. On the branch at e1fd8495: the ring and its drop in `console/recorder.ts`, the title and the group row in `console/ConsolePanel.tsx`, `readRecordStepRows` and E-AND's two waits in `command-bar.mjs`, `waitForRecordedRows` in `recording.mjs`, KNOWN-LIMITATIONS items 61 to 66, and the walkthrough's rows J1 to J6 and AA0 to AA4. I did not read the session logs or the base check's report: the counts of 110 are the architect's, from logs I have not opened.

1. Amendment 4 goes into the form as the architect drafted it, from its heading to its line "Nothing above is edited.", with five changes, each applied by script. Each Old text occurs once in the draft's amendment.

(a) item 3. Old:
````
   - Steps still reach the session history. No string changes.
````
New:
````
   - Steps still reach the session history. No string changes.
   - §3 did not name this change. KNOWN-LIMITATIONS gains item 67, in the advisor's words (ADV-2026-11-19-06 item 5; class 9, a scope addition), and a node is proposed (item 14, A4-6).
````

(b) item 5. Old:
````
5. **§5's table gains three rows, "changed; observed":**
   - `command-bar.mjs` E-AND;
   - `project.mjs` CLAUSES;
   - `project.mjs` STYLE.
   - Each with the cause of item 2.
````
New:
````
5. **§5's last row failed for two suites, and is recorded as failed.** The row predicted no change for `command-bar.mjs` and `project.mjs`. At F, E-AND and STYLE failed; CLAUSES passed, and its reading changes with theirs. The row is not rewritten. Three rows are added below it, each marked "found at S9, not predicted", each with the cause of item 2:
   - `command-bar.mjs` E-AND;
   - `project.mjs` CLAUSES;
   - `project.mjs` STYLE.
````

(c) item 6. Old:
````
6. **§11 item 11 is not engaged.** No tolerance changes, and no prediction changes. The property each step asserted is kept: one row per commit, in order, `ok`. Item 7's mutations show that it still fails. Both gates check this.
````
New:
````
6. **§11 item 11 is engaged, and the advisor lifts it for this case (ADV-2026-11-19-06 item 3).** A prediction of §5 failed at S9, and two suites' readings change after that run. The block is lifted on three conditions. The failed prediction is recorded as failed (item 5). The new reading is declared here before its code and keeps the property each step asserted: one row per commit, in order, `ok`. Each of item 7's three mutations is seen to fail. Both gates check all three. A gate that finds the property weakened reports it as a Correctness finding.
````

(d) item 12. Old:
````
    - §5's last row, as it read for `command-bar.mjs` and `project.mjs`: by item 5.
````
New:
````
    - Nothing of §5 is superseded: its last row stands, as a prediction that failed for `command-bar.mjs` and `project.mjs` (item 5).
````

(e) item 13, and a new item 14. Old:
````
    - **A4-7:** a note on walkthrough rows AA1 and AA2: none (recommended; AA1 stays true by my reading), or a note in the advisor's words.
````
New:
````
    - **A4-7:** a note on walkthrough rows AA1 and AA2: none (recommended; AA1 stays true by my reading), or a note in the advisor's words.
14. **The packet, as the advisor ruled it (ADV-2026-11-19-06).** Where an item above says "recommended", this item settles it.
    - **A4-1:** Option 1. `recording.mjs` is not changed. Not covered: its `waitForRecordedRows` counts the `record_step` rows since the open, and passed at F with one open's fill and one Apply's fill in the ring. The proposed node of A4-6 names it, and the form of the next piece that adds a first look to that suite's path reads it.
    - **A4-2:** item 6, as it now reads.
    - **A4-3:** the two suites only, if `git diff --name-only` from F to the merge request's head names only `frontends/shell/e2e/command-bar.mjs`, `frontends/shell/e2e/project.mjs` and `KNOWN-LIMITATIONS.md`. Any other path there comes to the advisor.
    - **A4-4:** no base runs of the edited suites.
    - **A4-5:** the `console` suite's one failure through K7 stays as classed (I4; its re-run passed). The reviewer's brief carries one question on it (ADV-2026-11-19-06 item 7).
    - **A4-6:** one node is proposed, not placed, and not on v0.2's list: the Console's ring against a view load's tile requests. Its summary names three things: the entries before two or three loads are dropped, a recorded step among them; an opened group closes when its first entry is dropped; `recording.mjs` counts rows since the open.
    - **A4-7:** no note on AA1 or AA2. J1 says "at least one `viewport_query`" and stays true by the advisor's reading.
    - **The reuse index:** the slot in this amendment's first paragraph takes the custodian's line, byte-copied and marked.
````

2. A4-1: Option 1, the two suites. The cause is the architect's and I agree with it from the code I read: the ring drops its oldest entry at 256, and both suites count every `record_step` row since the open. Options 3 and 4 stay rejected in this piece. `recording.mjs` is left as it is and named as not covered.

3. A4-2: I do not confirm "not engaged". §11 item 11 says "A tolerance or prediction changed after a run", and §5's last row is a prediction that failed at S9. Item 11 is engaged. I lift it for this case, on the three conditions item 6 now states. Why: the reading that failed rested on the ring keeping every row, which the README entries the architect quotes do not claim; the property is kept and is shown by three mutations; and the failed prediction stays on the record as failed. It is in the digest for the human, theirs to overturn.

4. What the form calls this. §5 says a failure at the head is the change failing, recorded as seen. So the record says it plainly: the piece changes what the Console holds after an open, an Apply and a Clear, §3 did not name that, and S9 found it. The shipped code is not changed for it in this piece. The change is declared as limitation 67 and carried by the proposed node.

5. KNOWN-LIMITATIONS item 67 (class 9; §11 item 15 is met by this ruling). The exact text, three lines, appended by script at the end of `KNOWN-LIMITATIONS.md` on the branch after one empty line, in a commit of its own or in F'. The file ends with one newline.

````
67. **The Console keeps its newest 256 entries, and one load of a view can add more than a hundred.**
    The Console keeps its newest 256 entries. When it is full, each new entry drops the oldest one, and the Console's label shows how many were dropped. When the first data load of a view completes (after an open, an Apply or a Clear, for example), the map asks for the tiles of that view, one request for each tile, and each request is an entry. Panning and zooming ask for tiles in the same way. In the app-window tests one such load was 110 requests. At that size the Console holds little more than two such loads, so the entries before them, the steps you recorded among them, are dropped. Only the entry leaves the Console: the request was already sent, and a recorded step stays in the session's history. A group of entries you have opened closes again when its first entry is dropped.
    <!-- The advisor's wording under the human's delegation of 2026-11-13 (state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md, items 2 and 3), not the human's words, ruled in ADV-2026-11-19-06 (item 5); the number is the next after item 66. Found at step S9 of open-first-look-fills-fit-view (Amendment 4 of governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md). Where the code does each clause, by symbol: MAX_CONSOLE_ENTRIES, push and droppedCount in frontends/shell/src/console/recorder.ts (the 256, the oldest entry dropped, each drop counted); the label in ConsolePanel in frontends/shell/src/console/ConsolePanel.tsx (the count of drops in the label), and ConsoleGroupRow there (a group is keyed by its first entry and holds its own open state); consoleRecorder.record in frontends/shell/src/skp/client.ts (every request is an entry); the viewportQuery call in frontends/shell/src/streaming/tileViewportStreamManager.ts (one request for each planned tile); the plan at the first look's Completed terminal, as item 64's comment names it. The figure 110 is the count of tile terminals after each first look in the S9 session logs of command-bar.mjs and project.mjs on filter-zoned.parquet, as the architect's diagnosis counts them (state/consults/2026-11-19-open-first-look-fills-fit-view-s9-failures-diagnosis-and-amendment-4-architect-draft.md); it is not a bound. Not examined: how many entries a cancelled tile request adds. -->
````

Both gates check every clause of the paragraph and of the comment against the code at the head. An untrue clause comes to me; nobody rewords it.

6. A4-3 to A4-7: as item 14 of the amendment says. If the worker finds that a README entry for E-AND, CLAUSES or STYLE is no longer true after its edit, it stops and the entry comes to me.

7. K7, one question into the reviewer's brief, beside the two of ADV-2026-11-19-01 item 3. In the `console` suite's first run the status line was empty after the last zoom-out notch, where the partial-view sentence was expected. The piece changes when the status is sent. The reviewer reads K7's wait and the status emits at the head and says whether, at F, a settle after a zoom-out can end with no status where the base sent that sentence. If it can, that is a Correctness finding and comes to me. No further run is ordered for it.

8. The worker is the Sonnet worker, as you say, and the S9 exe stands. Both gates follow, with the questions of ADV-2026-11-19-01 item 3, ADV-2026-11-19-02 item 6 and item 7 above.

9. For the human, in the digest: after this piece the Console holds little more than two view loads on a large window, so a user's own earlier steps leave it sooner. Whether v0.2 waits for the proposed node is theirs. I do not place it on v0.2's list.
