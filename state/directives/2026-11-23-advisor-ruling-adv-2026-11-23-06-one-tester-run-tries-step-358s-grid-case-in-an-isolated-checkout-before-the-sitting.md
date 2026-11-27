# The advisor's ruling ADV-2026-11-23-06, under the human's delegation of 2026-11-13, not the human's words: one tester run that tries Step 358's grid case in an isolated checkout before the sitting

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-23-06.md in the advisory folder, 3866 bytes, sha256 34520087360ab7d46690329c42c6d9f7c061059342f43b868f02dbfad24d962c, last modified at 2026-11-23T06:30:44Z by the file system; the advisor's message naming it received at 2026-11-23T06:30:52.010Z by the custodian's transcript (its queue record); read again at this filing (2026-11-23T07:48:12Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

ADV-2026-11-23-06, to the custodian, 2026-11-23. One tester run that tries the grid case of Step 358 before the sitting. It is my own request, as a check that needs a run. Read by me: the architect's second draft, whole, at main 54710d4c; the e2e folder by search only (the residency harness reads the session log's lines and the grid frame).

1. **Why.** Step 358's every expectation is by reading. The human decides on PR 358 from what the step shows, and a hand may never meet the case. One run by the tester says whether the case is met at all when the filter goes out at once, and what is then seen. The step's words do not wait for it: ADV-2026-11-23-05 stands whatever this finds.

2. **Where.** In an isolated worktree whose app source equals main's (no PR 358), with its own build output and its own copy of `slow-filter-scan.parquet`. The run's first record shows that neither resolves to the main checkout's target or fixtures (the human's Isolation line of 2026-11-22). Nothing in the main checkout is built, started or moved. The Tauri app is not started: the run goes through the e2e suites' own launch.

3. **What it does.** A throwaway script, never committed, no tracked file changed. Kept with the report in the evidence folder, with its sha256.
   - It puts `/filter id < 1000 OR id >= 3900000` into the command bar as a typed draft.
   - It opens the file through the surface the suites open files with, and sends Enter key presses to the bar at about 30 a second from the open's call until the bar empties.
   - It waits until the map holds still and reads the last `candidate-grid-frame-established` line: `baseSpan` and `observedUnion`.
   - Up to ten such tries. For each: `baseSpan`, and the times the log gives for the admission, the filter's send, the end of the open's own load and the end of the filter's load.
   - On the first try with `baseSpan` under 50000: Zoom to layer; the time until the status line holds still; the status line's text; a screenshot; then a zoom in on the top band, whether it fills, and the status line's text again.
   - If none of the ten is under 50000: a second series of up to ten tries that send the filter a stated time after the admission (for example 100, 200, 400 and 800 ms), to find whether any delay meets the case. Each try is labelled with its delay.

4. **What the report says.** Met in how many tries of each series, with each try's figures. What it does not show, in these words or truer ones: a hand at the keyboard, the native file picker, and the app as the sitting starts it. If the session log's lines cannot be read in that launch, the tester stops and says so, and reads nothing by another route without asking you.

5. **Limits.**
   - One tester, on the model your rules give a tester. It goes ahead of the Console's reruns, which are for a piece that merges after the tag. It does not go ahead of the fixtures list due at 18:00Z.
   - Its report is with me by 20:00Z today. If the run is not done by then it stops, and the report says how far it got.
   - No assertion of any suite is changed, and no existing test is touched. A crash, or a failure of something that is not this script's own, is a finding to me.
   - If what is seen differs from Step 358's text (the `baseSpan` values, the status line's sentences, what a zoom in does), that comes to me at once, so the step's text is corrected before the sitting.

6. **Afterwards.** I tell the human what it found, before the sitting. If the case is met and seen, the closing sentence I added to the v0.2 line in ADV-2026-11-22-37 ("has not been run or seen in the running app") needs new words. I rule those at the docs-only piece, from the report.

7. Nothing here is reserved. The run changes no tracked file, and its build output is neither the sitting's nor a release's.
