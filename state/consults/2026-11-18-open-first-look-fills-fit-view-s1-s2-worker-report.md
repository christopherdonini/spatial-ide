Built: open-first-look-fills-fit-view S1, S2 and S4, worker (the custodian's filing note, 2026-11-18: the Sonnet worker, model claude-sonnet-5-5, its run 2026-11-18T18:02:09Z to 18:07:15Z by its transcript, Bash 33, Read 2, none errored; 5763 bytes, sha256 b3f4530e5e6edf4c861080fb7d8295c38825dd46e3dfe72460a862efdd569a7b; below byte for byte, with this note and one final newline)
Result: STOP at S2, I7. Two slow-fixture assertions could change and §5 does not list them. No script was written, nothing was committed, and the build and base run were not started.

Start state
- HEAD is 349cec82e5ecbfab40db3ae9b6811d471d9ea2de. Porcelain is empty.
- ls-remote origin cut/open-first-look-fills-fit-view prints the same id.
- df: C: 50G free, D: 370G free.
- Fixture `100k-happy-path.parquet`: 29933646 bytes, sha256 fd0c74ab2d5df1e1df084802134d2a6678278e764ba180ea2ea5812f53ddfb49. Re-checked at the end, unchanged.
- npm ci in `renderer/bundle-viewer`: rc 0. npm ci in `frontends/shell`: rc 0.

S1 (symbols at B, all under `frontends/shell/`)
- I0 check: `git diff 26141ebe B` of every file below is 0 lines, so no body has changed. I0 is not hit.
- `src/canvas/WorkingCanvas.tsx`:
  - interface `WorkingCanvasHandle` is at line 115, with `fitToBbox?` at 144 and `currentView?` at 150.
  - the handle object has `currentView()` at 1624.
  - `onResize`, with its unreported-branch `computeAuthoritativeViewportBbox` call, is at 2086-2094.
- `src/canvas/viewportBbox.ts`: `computeAuthoritativeViewportBbox` at 37.
- `src/residency/candidateArmSession.ts`:
  - `CandidateArmSessionDeps` at 95; `hasPlanned` at 376; `pendingViewportChange` at 404; `relinquishClearPending` at 495; `firstLookFailureStanding` at 515.
  - `syncScanLiveness` at 600; `emitResidencyStatus` at 721; the manager's `onTerminal` at 1003.
  - `issueUntiledQuery` at 1282; the sink's `onTerminal` at 1339, with `wasCurrent` right under it and `wasSelfCancelled` after; `handleViewportChange` at 1500.
  - `reissueUnrestricted` is declared in the session interface at 240.
- `src/residency/residencyStatus.ts`: `settledState` at 338; `residencyStatusText` at 475, with the `candidate-within-budget` case at 478 giving `Showing all ${n} features in view`.
- `src/streaming/tileViewportStreamManager.ts`: `gridFrame` getter at 414; the `no-frame` result at 525.

S2 (inventory; I read these suites and traced the assertions)
- Covered by §5, by reading:
  - `layout.mjs` RESIZEQ: filter-zoned (2,000 rows). The open's plan covers the same box as Zoom to layer, and the cells the Inspector close exposes stay unplanned. Assertions at 377, 383 and 391 do not change.
  - `layout.mjs` FILL: the 100k fixture. The wheel notch and Inspector close at 424-475 can find cells already resident. Line 474 (at least 1 stream and 1 row) could change. This is §5's FILL row, OPEN-6 (A).
  - `filter.mjs` at 125-162, `filter-panel.mjs` PANEL, PANELREFUSE and CLEAR (160-281), `export-view.mjs` (80-110) and `colour.mjs` PB-E1: all use filter-zoned (2,000 rows). The first look already holds every row, so I find no change.
  - `attributes.mjs`: the 500-row attributes-multitype file, same reasoning.
  - `regression.mjs` A4' at 488-505, K7 at 1760-1890 and FIND' at 2114-2334, `pan-anchor.mjs`, `recentre-crossing.mjs`, `residency-harness.mjs`: I found no assertion beyond §5's rows. I did not read all of `regression.mjs` (2,808 lines) or `residency-harness.mjs` (3,278 lines) line by line.
  - `selection.mjs` and `table.mjs` on the 100k fixture: no resident-count assertion found.
- NOT covered by §5 (I7):
  1. `filter-panel.mjs` FIND' (304-400).
     - It opens `slow-filter-scan.parquet` (766 MB, 4,000,000 rows) and settles with a non-fatal 3 s quiet window.
     - It applies `id > 3999900` and waits for Cancel to appear (phase 1, 30 s).
     - It then waits for `.scan-liveness` and `button.filter-cancel` to be gone (180 s, at 337-355), then checks `.scan-incomplete` (356).
     - After this node, the Apply's first look ends Completed with no plan, so the block plans the fit view under the filter. That adds tile scans of the slow file.
     - Cancel could then be satisfied by the fill rather than the new scan, and the 180 s liveness wait now covers the fill.
     - §5's row says only "a fraction comparison", and these are liveness waits.
  2. `table.mjs` PC-E4 (14-17, 318-372).
     - It opens the slow fixture and applies the filter, each followed by a quiet-window settle (88 and 94).
     - It then shows the Table tab and asserts exactly one `stream-issued` line after the table's query (340-343), and that the liveness line shows (15 s).
     - Fill streams queued on the slow scan could issue more `stream-issued` lines inside that window. §5's `table.mjs` row names only a resident count.
- I did not run either suite, so these are "could change" by reading, not observed changes.
- `colour.mjs` line (ADV-2026-11-18-16 item 3): it does not call a Colour-by refill hook.
  - PB-E1 (158-170) selects the column through the Style tab and clicks Apply, after the first-look settle (162).
  - Per `App.tsx` 2056-2064, that effect re-issues the first look only when the status bar says attributes were not held.
  - The script neither reads nor forces that state, and its fixture is filter-zoned (2,000 rows).
  - So it drives a Colour-by refill only if the app says "not held", and reading cannot show that it does.

S4
- Not done, per the stop rule. Script line count, `node --check`, commit E and the numstat were not produced, and nothing was pushed.
- Not done: the build, the base run, and the holds. There are no MACHINE_HOLD or MACHINE_RELEASED lines, because I took no hold.

End state
- HEAD is 349cec82e5ecbfab40db3ae9b6811d471d9ea2de, porcelain empty, fixture unchanged.
- C: 49G free, D: 370G free.
- No background process is running.

Beyond the brief
- I named the two I7 findings as a stop and added a reading of `colour.mjs` at the level of detail above. I wrote no files beyond `<S>/fl1-ci1.log` and `<S>/fl1-ci2.log`.

Model: Sonnet 5.5, claude-sonnet-5-5, as the harness reports it.
