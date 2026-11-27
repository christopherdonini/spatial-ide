# The advisor's ruling ADV-2026-11-23-09, under the human's delegation of 2026-11-13, not the human's words: the grid tester's report; Step 358's text changed; no further run; grid358 freed; the disk; the slip; one finding

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-09.md in the advisory folder, 11224 bytes, sha256 f321e1549b67068c641ddf15d61af8a43751bcb8f52dc6663f0dad8052c8df45, last modified at 2026-11-23T09:01:53Z by the file system; the advisor's message naming it received at 2026-11-23T09:02:05.742Z by the custodian's transcript (its queue record); read again at this filing (2026-11-23T09:12:35Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-09, to the custodian, 2026-11-23. The grid tester's report (ADV-2026-11-23-06): Step 358's text changes, no further run, the worktree, the disk, the slip, and one finding. Read by me: the report's opening lines and its sections 1, 4, 5 and 6 as you sent them byte for byte (the whole report is 18268 bytes, sha256 6255dbaa7c9ff3926791e20436d167fbf8c134ad32720902ad1f25624171afa0, and was not yet on main at aa9fff20); `changeClauses` and `applyFilterWith` in `frontends/shell/src/App.tsx` at main aa9fff20. This ruling changes part of ADV-2026-11-23-05 item 3; the rest of that ruling stands.

1. **Step 358's text changes.** The step stays where it is and stays the human's to do or to skip. Three things in its text are no longer true or no longer enough: it says nothing has been run; it treats a bar that does not empty as a failed try; and its numbers are the reading's alone. Item 2 is the new text.

2. **The text.** In `state/drafts/sitting-script-2026-11-24.md`, section 6 is replaced from its heading line `# 6.` to the last bullet of Step 358's Questions (the bullet that begins "- Your decision on PR 358"), both included, by the fenced text below, copied by script from this file. Everything after that bullet is untouched: the joining sentence, Step 68's block and the closing line. Section 2's two rows and its total are untouched.

````markdown
# 6. Step 358 and the optional Step 68: PR 358's two cases (added 2026-11-23)

You asked for Step 358 on 2026-11-23, for your decision on PR 358. It comes after block (v) and before block (vi). A tester's script tried the case on 2026-11-23 and met it once. What a hand at the keyboard meets is still not known.

**What the tester's run showed.** The script ran in a separate checkout of main without PR 358, in a debug build. It opened the file through a test hook, not the file picker, and it sent the Enter key itself. It made 20 tries.
- One try met the case. There, Zoom to layer left only a thin line of parcels at the top edge, and the status line read as row 358.7's first sentence says. The view took 5 minutes 16 seconds to hold still. Three wheel notches on the empty band then filled it across the view in about a minute.
- With Enter sent about 30 times a second from the open on, which is what this step asks of your hand, none of 10 tries met it. In 4 of those the command bar never emptied.
- With one Enter sent at a set time after the file was admitted, 1 of 10 tries met it (at 400 ms).
- In 6 other tries the number of row 358.5 was between its two values. By arithmetic a wide view is then still filled. No one has looked.
- Two pictures of the met try, `met-zoom-to-layer.png` and `met-zoom-in.png`, are in the run's evidence folder, which the custodian's note names.

So the case is real in this build, and five tries by hand may well all miss. The tester's result is there for your decision whether you make the tries or not.

## Step 358 — the largest file opened, a filter applied at once, then a wide view (PR 358's grid case; PR 358's fix is not in this build)

This step tries whether a filter applied while the file's first data load is still running can set the map's tile grid from only part of the filtered data. If it does, a wide view is then left partly unfilled. The step can only meet the case by timing; the session log tells you after each try whether it was met. A try that misses shows nothing.

**Have ready.** `slow-filter-scan.parquet` (4,000,000 parcels, the largest file in `target\fixtures\manual-walkthrough\`), made by section 1's fixture command. The app freshly started with section 1's start command, with **no file open**. File Explorer and Notepad, for the session log in `%LOCALAPPDATA%\dev.spatialide.shell\logs\`.

| # | Step | Expected outcome |
|---|---|---|
| 358.1 | Press Ctrl+K and type `/filter id < 1000 OR id >= 3900000`. Do not press Enter yet. | The text stays in the command bar. |
| 358.2 | Click **Open GeoParquet…** and pick `slow-filter-scan.parquet`. As soon as the file picker closes, press Ctrl+K (or click the command bar) and **hold Enter** until the command bar empties, or until the map has shown parcels for about five seconds. Then let go. | While the app checks the file, each Enter only shows a note under the bar; that is expected and harmless. In the tester's run the check took under a second; it can take longer the first time a file is read. When the file is admitted, the filter is sent and the bar empties. In 4 of the tester's 10 tries with Enter held, the bar kept its text and the line under it read "[P6 placeholder] Not applied: the card id < 1000 OR id >= 3900000 can only be used on its own. Turn it off first." If you see that, note it and go on to 358.3: the log tells in any case. |
| 358.3 | Hands off: no pan, zoom or resize. Wait until the map and the status line hold still. | The map shows a short strip of parcels at the bottom-left of the data. It may fill slowly. |
| 358.4 | In File Explorer, open the newest `session-….log` in the folder above with Notepad. Press Ctrl+End, then search upwards (Find, direction Up) for `candidate-grid-frame-established`. Read that line's `baseSpan=` value. | One number. |
| 358.5 | Read the number. **About 160000:** not met. This try shows nothing; note it and start the next try at 358.1. **Under 50000** (33168.2 in the tester's met try): met; go on to 358.6. **Anything between** (103331.8 five times and 82371.5 once in the tester's run): note the value; by arithmetic the try shows nothing visible; start the next try. | — |
| 358.6 | The wide view: click **Zoom to layer**. Hands off until the status line holds still; this can take several minutes (5 minutes 16 seconds in the tester's run). | The map shows the whole data: a strip along the bottom-left and parcels along the top edge. |
| 358.7 | Look at the top edge of the data and at the status line. | **If the case shows:** only a thin line of parcels at the top edge, with the band above it empty, and the status line reads "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." **If it does not show:** a band about ten times as thick is filled across the top, and the status line reads "Showing all … features in view". Note that too: after a number under 50000 the reading expects the case to show. |
| 358.8 | Optional: zoom in on the empty band, or pan it towards the middle of the map, and wait until the status line holds still. | In the tester's run three wheel notches on the band filled it across the view in about a minute, and the status line then read "Showing all … features in view". By reading, not run: what stays until the file is opened again is the small tile grid, so any view this wide leaves its far part unfilled at first. |

358.1 to 358.5 (or to 358.8) is one try. For the next try, do not press Clear and do not touch the filter's card: the card from the last try keeps the held Enter from changing the old file. If the bar still holds the text from the last try, do not type it again. Start again at 358.1 and reopen the log in Notepad each time. The step is done after the first try that reaches 358.7, or after five tries that miss.

**Questions.**
- For each try: whether the bar emptied, the `baseSpan` value from 358.4, and, if you went on, what 358.7 showed, and 358.8 if you did it.
- Overall: met, or not met, in how many tries. Neither answer says how often a user meets this case.
- Your decision on PR 358, in your own words, if you want to give it now. Until you say otherwise it merges after the tag and limitation 68 gets the approved sentences, as your message of 2026-11-23 says.
````

3. **Your note in the script.** Under section 2's table your note of 2026-11-23 gains, in your words: that section 6's Step 358 was changed on this ruling after the tester's run; the path of the filed report; and the evidence folder that holds the two pictures, written so that the human can open it at the laptop. No user-profile path.

4. **The commit.** One records commit holds the changed script and the report filed whole. It changes no file the app is built from. Send me its hash. I check every figure and the quoted line of item 2 against the filed report, and the script against this file. If a figure of mine differs from the report, the report is right and I rule the correction at once.

5. **No further run.**
   - A wide view at 103331.8 or 82371.5: by arithmetic nothing shows, the step says so in those words, and the human's decision does not turn on it.
   - 358.3's strip: not worth a run.
   - More tries would only refine a rate, and the step says that no rate is claimed.

6. **The worktree and its folders: free them now.** `C:/dev/wt/grid358`, its build folder and its data copy go, once the report and the evidence folder are complete and the throwaway script with both hashes is in that folder. The run is done and none follows. Tell me C:'s free space after.

7. **The disk.** C: stood under the floor at the tester's end by its own reading. The floor's ruling applies as it is written; I do not restate it here. Item 6 is the first step. If the Console's rows cannot run above the floor, that is a stop, and it comes to me before they start.

8. **The slip.** One command of the tester ran outside a hold for about 20 minutes: a read-only scan of a temp folder, then killed. It goes into the records as a slip against the machine's rules, in those words, with what is known of it and what is not (whether another project's run was slowed is not known). No exception is granted by anyone. From now on a tester's brief says: no folder scans, and disk space only by the one-line read of free space inside a hold. I tell the human in the digest.

9. **Series 1's earlier script version:** accepted as disclosed, with both hashes in the report.

10. **One finding, placed.** In 4 of 10 tries with Enter held, the bar kept the text and its last line was the refusal that names the very card the bar was sending. `changeClauses`'s own comment says that a change that is not applied changes neither the cards nor the filter. The tester's reading is that the first Enter after admission put the card on and the later ones were refused; that is inferred, since series 1 did not record the cards.
   - Record it as a finding with the tester's evidence. It is not a failed test, and nothing is made green by it.
   - An architect reads it in idle time, behind the sitting work, the fixtures list, the daily figures and the Console's rows: can the bar's result be other than applied while the card and the filter are on, and is every line the bar then shows true? By reading first; if the read needs a run, the architect says which.
   - The result comes to me. I grade it then, and whether it touches v0.2's known limitations.

11. **For the docs-only piece of item 68, not now.** The closing sentence I added to the v0.2 line in ADV-2026-11-22-37 says the case has not been run or seen in the running app. That is no longer true as written. I rule its new words at that piece, from the filed report.

12. Nothing here is reserved. The human hears the tester's result from me today.
