# The advisor's ruling ADV-2026-11-23-05, under the human's delegation of 2026-11-13, not the human's words: the sitting's two steps approved with five changes of the advisor's, as a new section 6 of the sitting script; the architect's finding against the advisor's bullet is right

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-05.md in the advisory folder, 10198 bytes, sha256 d8ae4de2dcf973c0dbc9857efc3b2db8d5d68085c7130f7e3a011bd40d859805, last modified at 2026-11-23T06:30:01Z by the file system; the advisor's message naming it received at 2026-11-23T06:30:19.749Z by the custodian's transcript (its queue record); read again at this filing (2026-11-23T07:48:12Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-05, to the custodian, 2026-11-23. The sitting's two steps: their words, their place in the script, and the finding against my own bullet. Read by me at main 54710d4c: the architect's second draft, whole (`state/consults/2026-11-23-operator-sitting-queue-sitting-step-grid-case-architect-draft-2.md`, blob 5c4e5210); the first draft, whole, again (blob 1ea59f7a); yesterday's draft 2 of the v0.2 line, whole; the script's sections 1 and 2 and its headings.

1. **Both steps are approved, in the text of item 3.** The words are the architect's except where item 2 lists a change. None of it is the human's wording.

2. **My changes to the second draft's fenced text, and no others.**
   - (a) Row 358.7's two labels: "Met:" becomes "If the case shows:" and "Not met:" becomes "If it does not show:", with one closing sentence. Row 358.5 has already said met by then, so the same two words for a second thing would mislead.
   - (b) Row 358.7's last two sentences move into a new optional row, 358.8, under the words "By reading, not run:". They are the architect's sentences and stay theirs.
   - (c) "Make as many tries as the step's minutes allow." is replaced by a rule for when the step is done, and by one sentence for a bar that does not empty.
   - (d) "(or to 358.7)" becomes "(or to 358.8)", and the first question names 358.8.
   - (e) A third question is added, for the human's decision.

3. **The text.** It goes into `state/drafts/sitting-script-2026-11-24.md` as a new section 6 at the end of the file, copied by script from this file, from the line `# 6.` to the line that ends "before block (vi)." Step 68's block is not typed here: it is the first draft's fenced text, lines 65 to 84 of its filed file, byte for byte, placed where the marker line stands.

````markdown
# 6. Step 358 and the optional Step 68: PR 358's two cases (added 2026-11-23)

You asked for Step 358 on 2026-11-23, for your decision on PR 358. It comes after block (v) and before block (vi). Everything it expects is read from the code or worked out by arithmetic. None of it has been run or measured.

## Step 358 — the largest file opened, a filter applied at once, then a wide view (PR 358's grid case; PR 358's fix is not in this build)

This step tries whether a filter applied while the file's first data load is still running can set the map's tile grid from only part of the filtered data. If it does, a wide view is then left partly unfilled. The step can only meet the case by timing; the session log tells you after each try whether it was met. A try that misses shows nothing.

**Have ready.** `slow-filter-scan.parquet` (4,000,000 parcels, the largest file in `target\fixtures\manual-walkthrough\`), made by section 1's fixture command. The app freshly started with section 1's start command, with **no file open**. File Explorer and Notepad, for the session log in `%LOCALAPPDATA%\dev.spatialide.shell\logs\`.

| # | Step | Expected outcome |
|---|---|---|
| 358.1 | Press Ctrl+K and type `/filter id < 1000 OR id >= 3900000`. Do not press Enter yet. | The text stays in the command bar. |
| 358.2 | Click **Open GeoParquet…** and pick `slow-filter-scan.parquet`. As soon as the file picker closes, press Ctrl+K (or click the command bar) and **hold Enter** until the command bar empties. Then let go. | While the app checks the file (this can take a while), each Enter only shows a note under the bar; that is expected and harmless. When the file is admitted, the filter is sent and the bar empties. |
| 358.3 | Hands off: no pan, zoom or resize. Wait until the map and the status line hold still. | The map shows a short strip of parcels at the bottom-left of the data. It may fill slowly. |
| 358.4 | In File Explorer, open the newest `session-….log` in the folder above with Notepad. Press Ctrl+End, then search upwards (Find, direction Up) for `candidate-grid-frame-established`. Read that line's `baseSpan=` value. | One number. |
| 358.5 | Read the number. **About 160000:** not met. This try shows nothing; note it and start the next try at 358.1. **Under 50000 (about 20800 expected):** met; go on to 358.6. **Anything between:** note the value; the try shows nothing visible; start the next try. | — |
| 358.6 | The wide view: click **Zoom to layer**. Hands off until the status line holds still; this can take several minutes. | The map shows the whole data: a strip along the bottom-left and parcels along the top edge. |
| 358.7 | Look at the top edge of the data and at the status line. | **If the case shows:** only a thin line of parcels at the top edge, with the band above it empty, and the status line reads "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." **If it does not show:** a band about ten times as thick is filled across the top, and the status line reads "Showing all … features in view". Note that too: after a number under 50000 the reading expects the case to show. |
| 358.8 | Optional: zoom in on the empty band, or pan it towards the middle of the map, and wait until the status line holds still. | By reading, not run: zooming in on the empty band, or panning it towards the middle, fills it there. What stays until the file is opened again is the small tile grid: any view this wide leaves its far part unfilled at first. |

358.1 to 358.5 (or to 358.8) is one try. For the next try, do not press Clear and do not touch the filter's card: the card from the last try keeps the held Enter from changing the old file. Start again at 358.1 and reopen the log in Notepad each time. The step is done after the first try that reaches 358.7, or after five tries that miss. If the bar still holds the text well after the file is on the map, let go and note the line under the bar: the try has failed in a way the step does not expect.

**Questions.**
- For each try: the `baseSpan` value from 358.4, and, if you went on, what 358.7 showed, and 358.8 if you did it.
- Overall: met, or not met, in how many tries. Neither answer says how often a user meets this case.
- Your decision on PR 358, in your own words, if you want to give it now. Until you say otherwise it merges after the tag and limitation 68 gets the approved sentences, as your message of 2026-11-23 says.

Step 68, which follows, is an optional second part: it tries item 68 of the known limitations as it stands today, a different case in the same build, and takes about 15 minutes (an estimate).

[HERE: the first draft's fenced text, its lines 65 to 84, byte for byte]

After Step 358, and after Step 68 if you do it, close the window and start the app again with section 1's second command before block (vi).
````

4. **Section 2 of the script.** Two rows go into its table between block (v) and block (vi), and the total changes. Nothing in sections 3, 4 and 5 changes: they are byte copies.
   - `| Step 358 | The largest file opened, a filter applied at once, then a wide view: the step you asked for on 2026-11-23, for your decision on PR 358 (section 6) | 8 rows a try, up to five tries | 20 |`
   - `| Step 68 | Optional: item 68 of the known limitations as it stands today (section 6) | 6 rows a try | 15 |`
   - The total's cell becomes `300, or 315 with the optional Step 68`.
   - Both steps' minutes are the architect's estimates. Your own note under the table says so, and says that section 6 was added on this ruling, in your words.

5. **The finding against my bullet: the architect is right.** My bullet in ADV-2026-11-23-04 item 2, and the half sentence in its item 1 ("left unfilled until the file is opened again"), were wrong. By the architect's reading a later plan asks for the missing cells nearest the new centre, and the status line itself says to pan or zoom. What is kept until the file is opened again is the grid.
   - The ten sentences approved in ADV-2026-11-22-37 say only that the grid is kept. They stand unchanged.
   - The grade of ADV-2026-11-22-31 (moderate in kind, uncommon in reach) stands for now. It rested in part on the stronger reading, so I read it again after the sitting.
   - I had given the human the stronger reading on 2026-11-22. I correct it with them today.
   - Owed at the docs-only piece for item 68, not now: the architect proposes one sentence saying that a pan or a zoom loads the unfilled part, with its clause check, and I approve or drop it then.

6. **The three de-rooted paths:** accepted as you disclosed them. The filing note gives the true paths and both hashes, and nothing of the draft's substance changed.

7. **What I checked in the code myself, and what I did not.**
   - Checked at 54710d4c: Ctrl+K takes the bar and keeps a typed draft through a blur (`CommandBar.tsx`); `/filter` is unavailable with no dataset and then only shows a note; a held Enter while a change is pending sends nothing; an applied condition empties the bar; a new clause beside an advanced card that is on is refused by the shell; an admission resets the filter and the clauses (`workspaceState.ts`); the two button labels and the two status sentences are in the source as the step quotes them; the log line's name and its `baseSpan` field (`candidateArmSession.ts`); each log line is flushed as it is written (`state.rs`); the three log names Step 68 uses.
   - Not checked by me, and resting on the architect's reading alone: every timing, the batch arithmetic, the expected `baseSpan` values, what a later plan asks for, and all of Step 68's mechanism.

8. **The commit.** It is a records commit on main and changes no file the app is built from, so the main checkout may move to it (ADV-2026-11-21-27 item 3). Send me its hash. I then check section 6 against this file and the first draft.

9. **Noted from your message.**
   - The Guardian's two live checks: I read the form's Amendments 6 and 7. Both went as predicted, M-E1 refused by G1 and logged with tool Monitor, M-E2 run. The hold on Monitor has ended. I tell the human in the digest.
   - The Console form's Amendment 3 is on main. I have not read it yet.

10. Nothing here is reserved. The human's decision on PR 358 is theirs, and the step only asks for it.
