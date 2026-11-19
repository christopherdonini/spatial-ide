*Filed by the custodian: the architect's hand-back (claude-opus-5-5), 14479 bytes, sha256 199c18e4aa8769dae878ac1a290c7a3f86970c33754219705c4fcf534138c92e, below the rule with one final newline added, its 2 scratch paths written `<S>` and nothing else changed; calls Read 20, Grep 23, Glob 1, one errored, from 2026-11-18T23:48:13Z to 2026-11-19T00:00:37Z. A draft, read only, at main 1067f753 and the branch's commit 47693664; nothing in it is ruled by its filing, and the advisor rules Amendment 3 from it (the custodian's correction of its item 5 (2) taken, by the advisor's message).*

---

cut/open-first-look-fills-fit-view @ 476936642cddefe4a7652918f7674907a9f2b183 (form read at main 1067f753bd4f4226260575cbd3bbe3ece8fc7180)

**Verdict: pass with notes.** The draft goes to the advisor. Item 5 does not hold, so (B) has a declared move, below.

````
## Amendment 3 — step S8 stopped on I3 at FILL's precondition: FILL's set-up adds one declared drag east of the fit view before the toggle, with OPEN-6 (A)'s counting kept

*Drafted by the architect (claude-opus-5-5), read only, at main 1067f753bd4f4226260575cbd3bbe3ece8fc7180 and at the worktree's commit 1, 476936642cddefe4a7652918f7674907a9f2b183, under the advisor's ruling ADV-2026-11-18-27, items 3 and 4. Appended by the custodian's script. It declares FILL's set-up before the code for it. It changes no product file and no line of `stepFill` from the line that takes `mark` onward. The reuse index missed. The line below is byte-copied from the custodian's brief and marked so: `No prior art recorded for "e2e check set-up that moves the view off the open's planned box before a resize". Research it before planning an implementation.` Code is cited by symbol at 476936642cdd unless another commit is named. Figures come from the files named, or are worked here.*

1. **(a) The set-up.** After the wheel notch, its settle and its zoom check, `stepFill` makes one declared drag before it reads the size, the growth and the status. The drag starts at the canvas centre and goes 160 CSS px to the left in 16 steps. That moves the view east. It is not a search.
   - The lines, added to `frontends/shell/e2e/layout.mjs`. The first three go after `FILL_WINDOW_MS`:
     ```js
     // FILL's declared drag (open-first-look-fills-fit-view Amendment 3, item 1): from the canvas centre, 160 CSS px to the left in 16 steps. Not a search.
     const FILL_PAN_PX = 160;
     const FILL_PAN_STEPS = 16;
     ```
     These seven go after the `view.zoom === zoom0` check in `stepFill`:
     ```js
       // The open's own plan asked for the fit view's cells, so the view moves east off them before the toggle: one declared drag after the notch.
       // Its effect is read back from the view-state lines, as the notch's is, and the drag's views count as asks below.
       await page.mouse.move(centre.x, centre.y);
       await page.mouse.down();
       await page.mouse.move(centre.x - FILL_PAN_PX, centre.y, { steps: FILL_PAN_STEPS });
       await page.mouse.up();
       await settleFully(page, consoleHandle, "FILL: after the drag");
     ```
   - The drag is worked out and recorded the same way the notch is. Its effect is never assumed. `markView` is taken before the notch, so every view-state line the drag emits (`WorkingCanvas.tsx` `onViewStateChange` traces one per tick) counts as an ask in `qualifying`. The grown view is read from the last view-state line. The run's result line records both qualifying counts.
   - Unchanged, as ADV-2026-11-18-27 item 2 rules:
     - the notch, its settle and its I3 check;
     - `PARCEL_AREA`;
     - `qualifying` as commit 1 left it;
     - the status precondition, which is now read after the drag and still ends in I3;
     - the precondition's form, at least one qualifying cell or else I3;
     - everything from `const mark` onward.

2. **(b) Where the boxes and cells lie, with the working.**
   - **Frame.** The 100k dataset's `candidate-grid-frame-established` line (`<S>/fl8-layout-s8.session.log:257`; the same values at `<S>/fl8-layout-c.session.log:260`) gives:
     - baseSpan 25346.079664039426, originX 2593667.074747726, originY 1187966.9847111297, level medium;
     - 16 cells per axis (`tileGridConstants.ts` `TILE_GRID_DIMENSIONS`), so a cell is 1584.129979 m (`tileGrid.ts` `cellSizeForLevel`).
   - **Column and row edges.** Column c starts at originX + c × cell, and row r at originY + r × cell. Cells are half-open (`coveringIndexRange`).
     - Columns 3, 4, 5, 8, 9, 10 and 12 start at 2598419.465, 2600003.595, 2601587.725, 2606340.115, 2607924.245, 2609508.375 and 2612676.634.
     - Rows 4, 5, 6, 7, 8, 9, 10 and 11 start at 1194303.505, 1195887.635, 1197471.765, 1199055.895, 1200640.025, 1202224.155, 1203808.285 and 1205392.414. Row 14 ends at 1211728.934.
   - **Cells wholly inside `PARCEL_AREA`.** These are columns 4 to 11 and rows 8 to 14, 56 cells.
     - Column 3 starts west of 2,600,000.
     - Column 11 ends at 2612676.634, which is not past 2,612,680.
     - Row 7 starts south of 1,200,000.
     - Row 15 ends at 1213313.064, which is past 1,212,600.
   - **The open's planned box, at this suite's sizes.** The 100k dataset's `candidate-first-look-view-planned` line (`<S>/fl8-layout-s8.session.log:258`; the same box at `<S>/fl8-layout-c.session.log:261`) is x 2599141.846 to 2607778.383 and y 1195053.894 to 1204985.911.
     - That is the fit's view-state, centre (2603460.114, 1200019.902) at zoom -4.169346624228335, at 480 × 552 CSS px. The box is 8636.537 m ÷ 480 = 9932.018 m ÷ 552 = 17.99279 m per px. The view-state is at `<H>/fl-e2e-layout-s8.rep.layout-results-1795045054002.json:4166` and at `:4184` of the C results file.
     - Its cover is columns 3 to 8 and rows 4 to 10, 42 cells. Of those, 15 are wholly inside (columns 4 to 8, rows 8 to 10).
     - The other 41 wholly-inside cells lie outside the open's cover: columns 9 to 11 in rows 8 to 14, and columns 4 to 8 in rows 11 to 14.
   - **The notch, as observed.** The zoom goes to -3.2394433553937008 at the same centre (`:6050`; `:6080` at C). That is 9.44430 m per px.
     - At 480 px the view covers x 2601193.483 to 2605726.745 and y 1197413.276 to 1202626.528, so columns 4 to 7 and rows 5 to 9.
     - At 480 + 312 px it covers x 2599720.173 to 2607200.055, so columns 3 to 8.
     - At C the exposed wholly-inside cells were 8:8 and 9:8, so 2, as C's line says. Both are in the open's cover, so commit 1 counted 0, as its line says.
   - **The drag.** 160 px in 16 steps moves the view 150 px, because deck drops the first step (`e2e/pan-anchor.mjs` `instrumentA`, its `dx / steps` term). At 9.44430 m per px that is 1416.644 m east, so the centre x becomes 2604876.758.
     - Before the toggle, the view covers x 2602610.127 to 2607143.389, so columns 5 to 8.
     - Grown, it covers x 2601136.817 to 2608616.699, so columns 4 to 9.
     - Rows stay 5 to 9.
   - **The asked set.** It is the union of:
     - the open's cover;
     - the notch's and the drag's view-state lines at 480 × 552, which give columns 4 to 8 and rows 5 to 9;
     - the first dataset's tile lines (item 7), which give columns 3 to 5 and rows 7 to 8.
   - **Predicted count.** In the grown cover, only column 9 is unasked, in rows 5 to 9. Of those cells, 8:9 and 9:9 are wholly inside. **The prediction is 2 qualifying cells before the toggle and 2 after.**
   - **Margins.** The count stays 2 for any effective drag from 77 px to 232 px:
     - column 9 enters the grown view past 76.68 px;
     - column 9 enters the view before the toggle past 232.68 px;
     - column 10 enters the grown view only past 244.41 px.
     - Row 9 is inside by 42.6 px, and row 10 is outside by 125.1 px.
   - **At the toggle.** The grown view's plan has five unresident cells, column 9 in rows 5 to 9. Rows 7 to 9 of that column hold parcels, so streams and rows are due.

3. **(c) What FILL proves after the change.** On `100k-happy-path.parquet`, after the open's own fill, one notch in, and a move about 150 px east, a growth that uncovers a cell wholly inside the parcel area that no earlier ask covered issues a stream that delivers rows within 10 s.
   - It no longer tests the growth at the centred one-notch view. There, since this node, the open's fill has already loaded the uncovered cells, no stream is due, and FILL asserts nothing about that case.
   - FILL's mutation (`SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md`, Amendment 2, item 7) still fails by name. The mutated handler re-reports the last asked box, which is now the drag's view. The status precondition shows that every cell of that box is complete, so no stream is issued.

4. **(d) The stop.**
   - **Step 1, at C (e4c1dfba), with the script unedited, failed as §5's table said it might.** The two exposed cells were already resident from the open's fill. Byte-copied from `<H>/fl-e2e-layout-c.log:14`: `[FILL] FAIL (21546ms): FILL: within 10000ms of closing the Inspector 0 streams were issued and 0 rows arrived on them, expected at least 1 stream and 1 row (qualifying cells 2 before, 2 after; zoom -3.2394433553937008)`. The run went from 2026-11-18T23:34:01Z to 2026-11-18T23:35:14Z, by the log's first and last lines.
   - **Step 3, at commit 1, stopped at the precondition.** Byte-copied from `<H>/fl-e2e-layout-s8.log:14`: `[FILL] FAIL (9725ms): FILL: 0 qualifying cells before the toggle (zoom -3.2394433553937008, 480x552 + 312px): invalidator I3, STOP and report`. The run went from 2026-11-18T23:36:41Z to 2026-11-18T23:37:34Z.
   - So OPEN-6 (A) alone was not enough. §5's P-head predicted that every test passes, and that did not hold for FILL at commit 1.

5. **(e) The worker's two deviations, as its S8 report (`<S>/fl-s8-report-1.md`) states them.**
   - (1) Before step 1, it applied the FILL edit by mistake. It saved the edit to `<S>/fl8-fill.patch` and reverted it with `git checkout -- frontends/shell/e2e/layout.mjs`. It then ran the busy check and the run with `git status --porcelain` empty, so step 1 ran on the unedited file at C.
   - (2) Beyond its brief, it wrote seven scratch files under `<S>` with `fl8-` names.

6. **(f) The prediction for the next run.** `layout.mjs` runs once, whole, at the worker's commit. Every step passes, FILL among them, with 2 qualifying cells before the toggle and 2 after.
   - The run's record copies:
     - the 100k dataset's `candidate-grid-frame-established` and `candidate-first-look-view-planned` session-log lines;
     - the last view-state line before the toggle.
   - It also says whether the planned box equals the fit view-state's box at FILL's measured size.
   - If FILL passes with any other count, or the box differs, the run goes to the advisor before S8 continues. Anything else follows ADV-2026-11-18-27 item 7.

7. **The ruling's item 4: the size at the plan.**
   - **The 100k open, which FILL counts, planned at 480 × 552.** That is the size FILL measures. Item 2 shows the session-log box is the fit's view-state at that size, in both runs. No script action between E-REOPEN's `openPath` and FILL's size read changes the window or a region, and the notch and the drag change no size.
   - **Commit 1's scan also counts another dataset.** It runs from the trace's first line, so it also counts the first dataset's tile lines. That open planned at 668 × 712 (`<S>/fl8-layout-s8.session.log:7`: 2239.774 × 2387.304 m at zoom -1.7454331102923848), and RESIZEQ asked at a grown size. The scan counts both at FILL's size in the 100k frame, which adds columns 3 to 5 and rows 7 to 8.
   - **Those extra asks can only remove a qualifying cell.** They only add cells to the asked set, so they can never add a qualifying cell. All of them lie in the open's cover, so they remove nothing here.
   - **A larger canvas at the plan could make FILL fail, never pass falsely.** If a page reflow without input ever made the canvas larger at the plan than at FILL's read, FILL could fail although the app is right. It could not pass where no stream is issued. Item 6's record checks this.
   - **No counting fix is made.**

8. **The lines, against §7.** The change adds 10 lines to `e2e/layout.mjs` and removes none, so `git diff --numstat 476936642cdd <commit>` gives 10 and 0.
   - Against the base, the file then stands at 20 of §7's 30: commit 1's 10 (9 added, 1 removed) plus these 10.
   - A count over 30 is class 8, recorded in the closing, and §7 is not edited.
   - No other e2e file changes. The README's FILL entry is redrawn afterwards from the script, under ADV-2026-11-18-27 item 8 (b).

Read the last amendment first.

Nothing above is edited.
````

**For the custodian**

- **Item 4, the size at the plan.** The 100k open planned at 480 × 552, the size FILL measures. The session-log box at `fl8-layout-s8.session.log:258` and `fl8-layout-c.session.log:261` matches that size exactly. Commit 1 also counts the filter-zoned dataset's asks (planned at 668 × 712), but those can only remove a qualifying cell, they remove none here, and no counting fix is needed.
- **Predicted qualifying count:** 2 before and 2 after, cells 8:9 and 9:9. It holds for any effective drag from 77 px to 232 px.
- **Item 5 does not hold.** 41 of the 56 wholly-inside cells lie outside the open's cover, which is columns 3 to 8 and rows 4 to 10.
- **For the advisor:**
  - (i) Commit 1's pre-mark scan also reads the earlier dataset's lines. This is conservative and left as ruled. A one-line bound starting at the last `describe.extent` line is available if the advisor wants it.
  - (ii) The PASS note comes after `mark`, so it stays as typed and names only the notch. The drag is recorded in the amendment and in the code comment, and the item 8 (b) README redraw should name it.
  - (iii) "The two deviations" is my reading of the S8 report. The custodian's message to the advisor was not in my packet.
  - (iv) Out of this amendment's scope: the refill form's walkthrough Part V (its Amendment 2, item 11; V1 is one notch, then V2 uncovers a strip) may now uncover cells the open's fill has already loaded, the same way FILL did. Its rows should be re-read with S8's walkthrough drafts.
- **Files read:**
  - C:/dev/spatial-ide/governance/forms/frontends/OPEN-FIRST-LOOK-FILLS-FIT-VIEW-PREREGISTRATION.md
  - C:/dev/spatial-ide/governance/forms/frontends/SHELL-MAP-REFILL-AFTER-RESIZE-PREREGISTRATION.md
  - C:/dev/wt/fl/frontends/shell/e2e/layout.mjs
  - C:/dev/wt/fl/frontends/shell/e2e/lib.mjs
  - C:/dev/wt/fl/frontends/shell/e2e/pan-anchor.mjs
  - C:/dev/wt/fl/frontends/shell/src/canvas/tileGrid.ts
  - C:/dev/wt/fl/frontends/shell/src/canvas/viewportBbox.ts
  - C:/dev/wt/fl/frontends/shell/src/canvas/WorkingCanvas.tsx
  - C:/dev/wt/fl/frontends/shell/src/residency/candidateArmSession.ts
  - <S>/fl8-layout-s8.session.log
  - <S>/fl8-layout-c.session.log

Model: claude-opus-5-5.
