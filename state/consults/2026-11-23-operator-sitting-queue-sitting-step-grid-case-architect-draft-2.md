*Filed by the custodian: the architect's second draft of the sitting's new step, the grid case of PR 358 in the human's order, node:operator-sitting-queue@sitting-step-grid-architect-2, asked for by ADV-2026-11-23-04 item 2 (`state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-04-the-sitting-step-a-second-draft-for-the-grid-case-in-the-humans-order-the-first-kept-as-an-optional-second-part.md`) and dispatched at 2026-11-23T05:34:47.795Z; read at main 9bd7bc05c3b84f37cf3d96db16b08f95d511eef2 in the detached read worktree C:/dev/wt/read-1122, with nothing run and no launch; its run: Read 47, Grep 46, Glob 2, SubagentHandback 1, by unique call ids, 2 calls errored (two reads of paths that do not exist); model claude-opus-5-5, from 2026-11-23T05:34:51Z to 2026-11-23T05:57:16Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, whose 20766 bytes have sha256 df9c42a6b10c0a7c794e8707f3e148aa87b0b7d2ae5dbabc1ddd9d1c9e90d7a0, with one final newline added and nothing masked. Three disclosed rewrites: three rooted paths name no tracked file, and each is de-rooted to its file name at both of its places (a cite and the files-read list), because verify-cites reads a rooted cite and would fail it on main: `frontends/shell/src/residency/limits.ts` to `limits.ts` (the tracked file is `frontends/shell/src/canvas/limits.ts`); `frontends/shell/src/residency/tileViewportStreamManager.ts` to `tileViewportStreamManager.ts` (the tracked file is `frontends/shell/src/streaming/tileViewportStreamManager.ts`); `frontends/shell/src/log.ts` to `log.ts` (the tracked file is `frontends/shell/src/diagnostics/log.ts`). Nothing else is changed. The text below the rule, without the final newline, has sha256 00af669bc2000ab3b1b3115b1478ca857338df990c18a9ec162246c3f0367405. It is a draft and not yet words of the sitting script: the advisor gives its words, with the first draft's step (`state/consults/2026-11-23-operator-sitting-queue-sitting-step-mint-window-architect-draft.md`) as an optional second part, before either goes into the script. None of it is the human's wording or the advisor's. Its verdict is REACHABLE BY HAND, by reading and not measured. Its section 4 finds, by reading, that one bullet of ADV-2026-11-23-04 item 2 does not hold: panning or zooming does fill the unfilled part; what stays until the file is opened again is the small grid. That is for the advisor.*

---

**REACHABLE BY HAND** (by reading, not measured): if the human holds Enter in the command bar, the filter goes out within one key repeat of the file's admission. Whether that lands inside the open's first look has not been measured, and the session log tells, try by try, whether it did.

Reviewed: `C:/dev/wt/read-1122` (detached) @ 9bd7bc05c3b84f37cf3d96db16b08f95d511eef2. Its app source is the same as at 4fa8070f. I also read `C:/dev/wt/mint` @ 7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd for PR 358's form, as a reading aid only. I used Read, Grep and Glob only. I ran nothing, launched nothing and computed no hashes. I did not read the main checkout.

**Wording.** None of this is the human's wording or the advisor's. Text in quotation marks is copied byte for byte from the file named beside it. Everything else is my own words. Every path:line is a reading aid at 9bd7bc05 unless it names another commit. Every timing is by reading and not measured, unless a filed record is named for it.

**The human's line 2** (`state/directives/2026-11-23-the-humans-four-lines-typed-in-the-advisors-session-adv-22-40-stands-pr-358-at-the-sitting-the-2026-11-16-directive-to-the-tag-pr-356-after-the-tag.md:8`): "the largest test file opened, a filter applied at once, then a wide view." The step keeps that order.

**What the step tries** (from the code at the paths named):
- An Apply made during the open's first look reissues. It does not cancel the open's look (`frontends/shell/src/residency/candidateArmSession.ts:1718-1786`). It resets the union and the frame flag (`:1746`, `:1758`).
- The open's look then ends as an orphan. Its terminal still calls `establishFrameFromExtent` (`:1429-1431`) on the union the *filter's* look has admitted so far. PR 358's form describes this at its Amendment 1 item 2.1 (i), `governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md:450-455` @ 7a3fd37b.
- So the grid is frozen on a part of the filtered data. Its cells are then too small for a wide view, and the covering bound leaves the far part of that view unfilled.

---

### 1. Can it be reached by hand?

**The file.** `slow-filter-scan.parquet`:
- 4,000,000 rows (`kernel/tests/manual_walkthrough_fixtures.rs:714`), in one row group (`:726`).
- 766,186,557 bytes. That figure is from the custodian's `ls -l` listing of 2026-11-23T03:46:13Z, not from me.
- The generator lays it out as a grid 2,000 parcels wide, cells of 40 m, from E 2,600,000 / N 1,200,000 (`engine/src/fixture.rs:1405-1406`, `:67-68`, `:93`). The whole file is about 80 km × 80 km. Ids rise with the rows, starting from the bottom-left.

**How long the open's first look lasts.**
- It reads at most 10,000 rows (`frontends/shell/src/canvas/tileGridConstants.ts:185`) under a LIMIT, with no full scan.
- The engine sends them in about four batches: first target 64 KiB, then ×4 (`engine/src/stream.rs:51`, `:68`, `:70`). The shell then decodes and ingests them.
- Not measured. My estimate is about a second or less, and well under a few seconds.
- The only filed figure near this is an e2e step line `OPEN 641` ms for a 100,000-row file (`state/consults/2026-11-19-open-first-look-fills-fit-view-s8-after-amendment-3-worker-report.md:19`). I did not read what that step times, so it does not measure this look.
- The open's id check over all 4,000,000 rows runs before admission. It is not measured, and the held key covers it.

**Can the filter be typed in time?**
- **Filter section: no, in practice.** The section is mounted only once the file is admitted (`frontends/shell/src/App.tsx:2244`). Typing a clause and clicking Apply takes seconds, which is very likely after the look has ended.
- **Command bar: yes, by reading.**
  - The draft can be typed before the open, and it survives the blur when the human clicks Open (`frontends/shell/src/command/CommandBar.tsx:219-222`).
  - Before admission, Enter only shows a note and keeps the draft (`:160`, availability at `frontends/shell/src/layout/StudioLayout.tsx:203`, `:220-221`).
  - On later tries the previous try's filter card is still on. That clause is advanced (it has an OR), so a new add is refused by the shell and nothing is sent (`frontends/shell/src/workspace/filterClauses.ts:87-95`). The draft is kept (`CommandBar.tsx:167`).
  - The admission resets the clauses (`frontends/shell/src/workspace/workspaceState.ts:127-161`). The next repeated Enter then applies the filter (`CommandBar.tsx:162-166`).
  - An Enter that comes before the canvas's issue path exists is stopped (`App.tsx:1122-1124`). It reads as not applied, so the next repeat tries again.
  - So holding Enter sends the filter at about the first key repeat after admission. Windows' default repeat rate is about 30 a second; that is my assumption, not read from code.
- **Colour by: no.**
  - The panel is mounted only after admission (`App.tsx:2595`).
  - A Colour by starts a new load only when the attributes were not held (`App.tsx:2144`). That does not apply to this file, whose attributes are None in the generator.

**When a try meets the case** (timings by reading, not measured):
- The filtered look's batch 0 must arrive before the open's look ends. By arithmetic from `estimate_bytes` (`engine/src/stream.rs:2294-2297`) at 12 vertices a row, batch 0 is about 260 rows: ids 0 to about 259, a strip about 10.4 km × 40 m.
- Its batch 1 (ids 260–999, then the top rows) must not have arrived yet. It waits until the scan reaches id 3,900,000, about 97.5 % of the file.
- The generator's doc comment records 962.5 ms, engine only, to the first batch of a scan that matches only at the end (`kernel/tests/manual_walkthrough_fixtures.rs:690`). That is the comment's record, not mine. On it, the window is about 0.9 s wide.
- A try misses if the open's look ends before the filter's ticket, attach and batch 0. It also misses, with nothing visible, if the look ends after batch 1.

### 2. The actions, in the human's order

1. Open `slow-filter-scan.parquet`.
2. Apply `id < 1000 OR id >= 3900000` at once: typed in the command bar as `/filter id < 1000 OR id >= 3900000`, with Enter held.
3. The wide view: click **Zoom to layer**, after the map has held still.

**Why this filter.**
- `id > 3999900`, the first draft's filter, matches only at the end of the scan. Its first batch comes after the open's look has ended.
- A filter matching only early rows would sit wholly inside the filtered first look. Those rows stay drawn whatever the tiles do, so nothing would be left unfilled.
- `%` is not admitted (`engine/src/predicate.rs:75`), which rules out a compact spatial filter.
- This filter gives:
  - an early part at once: row 0, x 2,600,000 to 2,640,000;
  - a far part only after almost the whole scan: rows 1950–1999, a band 2 km tall across the top, y 1,278,000 to 1,280,000.
- 101,000 parcels match, about 1.2 M vertices by arithmetic. That is under `MAX_RESIDENT_VERTICES` of 2,000,000 (`limits.ts:73`), so the render budget does not speak.

**How wide the view must be. S7 is checked, and holds.**
- At medium, baseSpan = 2 × the anchor span (`frontends/shell/src/canvas/tileGrid.ts:120-132`), and a cell is baseSpan / 16 (`tileGridConstants.ts:26-35`). So a cell is S / 8, where S is the anchor span.
- One plan takes at most 3 + 512 = 515 new cells (`tileGridConstants.ts:40`, `:54`; `tileViewportStreamManager.ts:632-647`).
- **Square view of width W:**
  - It covers (8W / S)² cells.
  - That is more than 515 when W > S · √515 / 8 = S × 22.69 / 8 ≈ **2.84 S**.
  - This agrees with S7's "about 2.8" (`state/consults/2026-11-22-untiled-reissue-mint-window-v0-2-line-architect-draft-2.md`). Counting the cells cut by the view's edges, the threshold is about 2.7 S.
- **A 16:10 view:** 40 W² / S² > 515 gives a width of more than √12.875 · S ≈ **3.6 S**.
- **In the met case:**
  - S ≈ 10,400 m, so the cell is about 1,300 m.
  - A square view must be wider than about 29.5 km. A 16:10 view must be wider than about 37 km.
  - Zoom to layer frames the union of every batch since the Apply (`frontends/shell/src/canvas/WorkingCanvas.tsx:1618-1634`; KNOWN-LIMITATIONS item 61). Once the map holds still that is the whole 80 km file, about 7.7 S.
  - A view of about 128 × 80 km needs about 6,000 cells.
  - The 515 kept are those nearest the centre: a disc of about 12.8 cells, about 16.6 km radius, around (2,640,000, 1,240,000). The top band is 38–40 km from the centre, so it lies outside the disc.
- **In the normal case:** S ≈ 80,000 m, the cell is 10 km, and the same view needs about 100–130 cells. All of them are planned.

### 3. How the human tells at the laptop whether the grid was set from a part

**The log.** The newest `session-<unix seconds>.log` in `%LOCALAPPDATA%\dev.spatialide.shell\logs\`. Sources for the path:
- the file name (`frontends/shell/src-tauri/src/state.rs:41-56`);
- the folder (`frontends/shell/src-tauri/src/lib.rs:326-329`);
- the identifier (`frontends/shell/src-tauri/tauri.conf.json:5`);
- a recorded path (`frontends/shell/MANUAL-WALKTHROUGH.md:1438`).

Each line has the form `<unix-ms> <event name> <fields>` (`state.rs:58`, `:76`; `log.ts:20-22`).

**The line:** the *last* `candidate-grid-frame-established` line, read after the map has held still. Its form is in the filed example (`state/consults/2026-11-19-open-first-look-fills-fit-view-s8-after-amendment-3-worker-report.md:22`), for another file: "`1795049770230 candidate-grid-frame-established dataset=ds_c3f8a89ef7c856f50b6d4952a22275af baseSpan=25346.079664039426 originX=2593667.074747726 originY=1187966.9847111297 level=medium observedUnion={xmin:2600003.594663736,ymin:1200003.2761975063,xmax:2612676.6344957557,ymax:1201276.7728887927}`".

**What it shows for this file** (values by arithmetic from the generator, not run):
- **Normal: baseSpan near 160,000** (about 159,98x). This value appears in both ways a try can miss:
  - The change came too late. The frame is set from the open's 10,000 rows: an 80 km row strip, observedUnion xmax about 2,679,99x and ymax about 1,200,19x. The filter's end then logs the frozen frame again with a wider observedUnion.
  - Nothing of the filter's look arrived before the open's look ended. The frame is then set from the filter's whole union, with ymax about 1,279,99x.
- **Met: baseSpan near 20,800**, with observedUnion xmax about 2,610,3xx and ymax about 1,200,03x. Anything under about 50,000 counts as met.
- **Anything between about 50,000 and 150,000:** set from a part, but not one this step can show. Record the value.
- **What a 160,000 line cannot tell:** whether the frame was set from batch 0 plus batch 1, which is also a part. Batch 1 already reaches the top band, so that case gives the normal value and nothing visible.

### 4. What is seen

All times here are estimates by reading, not measured. The file is one row group, so each tile read may scan it whole.

**Met.** After **Zoom to layer**, the map takes minutes to hold still: about 515 tiles at up to 4 streams (`kernel/src/skp.rs:87-94`).
- At the top edge, only a thin line of parcels is drawn. These are the filtered first look's 9,000 top rows, about 4.5 rows of 40 m, a pixel or two at this zoom.
- The rest of the 2 km band above that line stays empty.
- The status line reads "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." (`frontends/shell/src/residency/residencyStatus.ts:443`).

**Not met.** After Zoom to layer:
- a band about ten times as thick as that line is filled across the top;
- the status line reads `Showing all ${status.residentFeatureCount} features in view` (`residencyStatus.ts:487`);
- holding still takes well under a minute, by estimate.

**Finding on the advisor's bullet.** The brief's bullet carried from ADV-2026-11-23-04 item 2 (not in the worktree at 9bd7bc05; I did not read it) says that panning and zooming do not mend it until the file is opened again.
- **By reading, this does not hold.** A later plan skips the cells already held or requested, and asks for up to 515 more of the missing cells, nearest the new centre (`tileViewportStreamManager.ts:611-647`).
- Zooming in on the band, or panning it towards the middle, fills it there. The status sentence itself says "pan or zoom to load them" (`residencyStatus.ts:443`).
- What does stay until the file is opened again is the small grid. Any view that wide again leaves its far part unfilled at first.
- This agrees with draft 2's N2 and with ADV-2026-11-22-37 item 6, which notes that the approved sentences do not say how long the unfilled part lasts.
- The step is written to the code: it says what panning and zooming do. Asking the human to pan is not needed to see the case.

**Before Zoom to layer.** In both cases the Apply's fit shows the bottom-left strip. In the met case it fills slowly, about 54–70 small tiles. No reading is taken there.

### 5. When the change came too late

The step shows nothing, and it says so in row 358.5. The same holds when nothing of the filter's look arrived before the open's look ended. The baseSpan is then near 160,000 and the try ends there.

### 6. Frequency

No result says how often a user meets the case. A miss does not show the case absent, and a hit does not show it common. The step says so in its Questions.

**Needs beyond section 1:** File Explorer and Notepad, for the log. Notepad does not reload, so the human reopens the file in it on each try. The step starts from a freshly started app with no file open, using section 1's own start command. Nothing new is compiled.

**Length (estimate, not measured):** about 20 minutes over 7 rows:
- about 2–3 minutes for each try that misses;
- about 6 minutes for one that meets, including the wait after Zoom to layer;
- up to about 5 tries.

**Placement and name:** the advisor's choice. The name `Step 358` avoids a clash with Part G's rows, and the advisor may change it.

```markdown
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
| 358.7 | Look at the top edge of the data and at the status line. | **Met:** only a thin line of parcels at the top edge, with the band above it empty, and the status line reads "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." **Not met:** a band about ten times as thick is filled across the top, and the status line reads "Showing all … features in view". Zooming in on the empty band, or panning it towards the middle, fills it there. What stays until the file is opened again is the small tile grid: any view this wide leaves its far part unfilled at first. |

358.1 to 358.5 (or to 358.7) is one try. For the next try, do not press Clear and do not touch the filter's card: the card from the last try keeps the held Enter from changing the old file. Start again at 358.1 and reopen the log in Notepad each time. Make as many tries as the step's minutes allow.

**Questions.**
- For each try: the `baseSpan` value from 358.4, and, if you went on, what 358.7 showed.
- Overall: met, or not met, in how many tries. Neither answer says how often a user meets this case.
```

**Joining sentence**, given separately, for placing the first draft's Step 68 after mine as an optional second part. It is my own wording, is not part of either step and rewrites neither: "Step 68, which follows, is an optional second part: it tries item 68 of the known limitations as it stands today, a different case in the same build, and takes about 15 minutes (an estimate)."

**Files read** (all at `C:/dev/wt/read-1122` @ 9bd7bc05c3b84f37cf3d96db16b08f95d511eef2, except the one row naming `C:/dev/wt/mint`):

Shell, residency and canvas:
- `frontends/shell/src/residency/candidateArmSession.ts`
- `frontends/shell/src/residency/residencyStatus.ts`
- `tileViewportStreamManager.ts`
- `limits.ts`
- `frontends/shell/src/canvas/tileGrid.ts`
- `frontends/shell/src/canvas/tileGridConstants.ts`
- `frontends/shell/src/canvas/WorkingCanvas.tsx`
- `frontends/shell/src/canvas/extent.ts`

Shell, app and controls:
- `frontends/shell/src/App.tsx`
- `frontends/shell/src/filter/FilterPanel.tsx`
- `frontends/shell/src/command/CommandBar.tsx`
- `frontends/shell/src/layout/StudioLayout.tsx`
- `frontends/shell/src/layout/actionRegistry.ts`
- `frontends/shell/src/workspace/workspaceState.ts`
- `frontends/shell/src/workspace/filterClauses.ts`
- `frontends/shell/src/admission/AdmissionPanel.tsx`
- `frontends/shell/src/project/openProject.ts`
- `log.ts`

Tauri side:
- `frontends/shell/src-tauri/src/state.rs`
- `frontends/shell/src-tauri/src/lib.rs`
- `frontends/shell/src-tauri/tauri.conf.json`
- `frontends/shell/MANUAL-WALKTHROUGH.md`

Engine and kernel:
- `engine/src/stream.rs`
- `engine/src/fixture.rs`
- `engine/src/predicate.rs`
- `kernel/src/skp.rs`
- `kernel/src/project/store.rs`
- `kernel/tests/manual_walkthrough_fixtures.rs`

Records, rulings and drafts:
- `KNOWN-LIMITATIONS.md`
- `state/drafts/sitting-script-2026-11-24.md`
- `state/consults/2026-11-23-operator-sitting-queue-sitting-step-mint-window-architect-draft.md`
- `state/consults/2026-11-22-untiled-reissue-mint-window-v0-2-line-architect-draft-2.md`
- `state/consults/2026-11-22-untiled-reissue-mint-window-e2e-tester-reports.md`
- `state/consults/2026-11-19-open-first-look-fills-fit-view-s8-after-amendment-3-worker-report.md`
- `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-31-the-frame-fault-graded-again-moderate-uncommon-the-v0-2-line-approved-from-the-filed-draft-item-68-stands-until-then.md`
- `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-37-the-v0-2-line-for-item-68-approved-placed-after-its-last-sentence-with-one-closing-sentence.md`
- `state/directives/2026-11-23-the-humans-four-lines-typed-in-the-advisors-session-adv-22-40-stands-pr-358-at-the-sitting-the-2026-11-16-directive-to-the-tag-pr-356-after-the-tag.md`
- `state/directives/2026-11-23-advisor-ruling-adv-2026-11-23-01-the-humans-four-lines-in-force-the-sitting-step-the-2026-11-16-directive-to-the-tag-the-spend-limit.md`
- `governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md`, at read-1122 (line 608) and at `C:/dev/wt/mint` @ 7a3fd37b22bd43ab48fba8aa465fc7bf1b1cb2fd (lines 446-470)

ADV-2026-11-23-04 is not in the worktree at 9bd7bc05. Its item 2 is taken from the brief.

Model: claude-opus-5-5
