# shell-tiled-arm-stream-refusal-shown-to-the-user: the clause check of the two v0.1.0 notes of the advisor's draft ADV-2026-11-16-14, against the code at the tag, read only; the reviewer's report

*Filed by the custodian from the hand-back: 18525 bytes, sha256 6c7a9a49574f708001d5ab1249451a654f3e06da1026d11fd9f05fdf28b90030, claude-opus-5-5, 71 calls by its transcript. Byte for byte below the rule. Not a gate.*

---

Clause check: v0.1.0 notes (ADV-2026-11-16-14 draft), reviewer, read only. Reviewed main @ f4027cc05f296bb34697cb518ebf896b5c9ef618 (records). Code read at tag v0.1.0 (annotated, fbba9ae8cfd825e837dc71c0df596dc14ff3b2c5), commit b391e43622056324c56d35cc33065305140a8415.
Verdict: 0 FAIL, 4 CONDITIONAL

All wording here is mine, except text in backticks or quotation marks, which is byte-copied from the line cited beside it. I ran only read-only git (`git show v0.1.0:…`, `git grep … v0.1.0`, `git rev-parse`, `git merge-base --is-ancestor`, `git diff --stat`, `git log -1`) plus Read and Grep on main's tree. I wrote no file and ran no build or test.

Sources read: the trace report and the tester's step report named in the brief; main's KNOWN-LIMITATIONS.md. At the tag: KNOWN-LIMITATIONS.md, tileViewportStreamManager.ts, candidateArmSession.ts, residencyStatus.ts, App.tsx, FilterPanel.tsx, AdmissionPanel.tsx, admitDataset.ts, predicateInput.ts, WorkingCanvas.tsx (parts), tileResidentSet.ts, ConsolePanel.tsx, ErrorBanner.tsx, errorHandlers.ts, log.ts, dataPlaneClient.ts, kernel/src/skp.rs, kernel/src/lib.rs, protocol/skp/src/v0/handles.rs and engine/src/predicate.rs (bind_admit).

## Clause table

### Note 1

**N1-1** "Corrected 2026-11-16:"
- HOLDS. This is not a code claim. The finding is dated 2026-11-16 by both consult reports.

**N1-2** "this paragraph says the status then reports those areas as not loaded."
- HOLDS.
- `v0.1.0:KNOWN-LIMITATIONS.md:153` contains `The status then reports those areas as not loaded,`
- The note does not put this in quotation marks, and its report of the paragraph is accurate.

**N1-3** "That is not always so, for v0.1.0 too:"
- HOLDS.
- At the tag, the refused tile is dropped at `v0.1.0:frontends/shell/src/streaming/tileViewportStreamManager.ts:663-668`: `} catch {` / `if (this.issueEpoch.get(tileKey) === epoch) {` / `this.tileState.delete(tileKey);` / `this.drainQueueIfRoom();`. There is no session call and no log line on that path.
- "too": the tester's A1 and A2 show the same silence at 20844fd8. `git diff --stat 20844fd8 f4027cc0 -- frontends/shell/src kernel/src engine/src` printed nothing, so that is main's code.

**N1-4** "when the refused area is the last one still loading, no status is shown"
- HOLDS ONLY IF nothing was still standing from before the current view's plan. That covers a fresh status after an open, Apply or Clear (`query-issued` folds to null, `v0.1.0:frontends/shell/src/residency/residencyStatus.ts:203-205`), or a previous "Showing all N", which the plan clears.
- After a pan, the plan's own emit stays silent. Byte-copied, `v0.1.0:frontends/shell/src/residency/candidateArmSession.ts:805-810`: `if (settled !== "settled-complete") {` / `if (standingWithinBudgetComplete) {` … `return; // mid-fill or a re-plan is pending -- absence is honest`.
- `standingWithinBudgetComplete` is false after a settled-partial emit (`:775`) and after an over-budget emit (`:724`). So an earlier view's "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." (`residencyStatus.ts:429-430`) or its over-budget sentence stays on screen, unchanged.
- The status is then not absent. It is stale.

**N1-5** "and Cancel stays up in the filter panel."
- HOLDS ONLY IF "the last one still loading" counts the filter's own untiled first look as something still loading.
- The scan goes `reset` only through `syncScanLiveness` (`candidateArmSession.ts:562-571`), and `hasOutstandingWork()` is `untiledStreamHandle !== null || manager.trackedTileCount > 0` (`:553`).
- If the first look is still running when the tile is dropped, its terminal sends `reset` (`:1325`) and Cancel goes down. The status still stays absent in that case (see the notes, case iii).
- Otherwise Cancel stays up, because the scan stays `issuing` (`App.tsx:461-463`), until the next pan or zoom plan, an Apply or Clear, or a Cancel click.

**N1-6** "Pan or zoom to ask for it again."
- HOLDS ONLY IF all of these are true:
  - the area is still inside the new view's covering set;
  - the area is not cut by the farthest-first capacity truncation (`tileViewportStreamManager.ts:430-441`);
  - the view is not over budget without headroom (`:453`).
- The ask can be refused again. The paragraph's own remedy is "pan or zoom in". See answer (b).

### Note 2

**N2-1** "Found 2026-11-16, true of v0.1.0 too:"
- HOLDS. See trace §2. My re-read is below.

**N2-2** "when the first request for data after opening a file … starts and then fails before any data arrives,"
- HOLDS.
- The open's first look is `reportViewportOutcome(session.reissueUnrestricted(null, activeFilterRef.current));` (`v0.1.0:frontends/shell/src/App.tsx:1069`).
- "starts" correctly leaves out B1, a refusal at the call. That case sets `viewportRefusal` (`App.tsx:929-931`), and the canvas then shows a refusal block.

**N2-3** "or after applying or clearing a filter,"
- HOLDS.
- Clear is Apply with an empty predicate (`v0.1.0:frontends/shell/src/filter/FilterPanel.tsx:66-69`). `predicateTextToFilter("")` returns null (`v0.1.0:frontends/shell/src/filter/predicateInput.ts:17-19`).
- `applyFilter` always issues `deps.requestViewport(null, newFilter)` (`App.tsx:294`) through `issueQueryRef` to `session.reissueUnrestricted(bbox, filter)` (`App.tsx:1051`). There is no "nothing to clear" short-circuit.

**N2-4** "the map stays empty"
- HOLDS.
- Open: the `WorkingCanvas` is keyed on the new dataset handle (`App.tsx:1360`), so it is fresh. No batch arrives.
- Apply or Clear: `manager.clearAll()` (`candidateArmSession.ts:1508`) and `canvas?.clearAllTiles()` (`:1512`) run before the issue. `clearAllTiles` empties the resident set (`v0.1.0:frontends/shell/src/canvas/WorkingCanvas.tsx:1520-1524`).
- There is one exception, a case of timing inside one request round trip; it does not block, and I name it under N2-9.

**N2-5** "and no message is shown."
- HOLDS. Nothing on screen states the failure. Details are in the notes.

**N2-6** "After an open, panning or zooming loads nothing;"
- HOLDS.
- No batch arrived, so `establishFrameFromExtent(null)` returns at `candidateArmSession.ts:1126`.
- With no frame, `if (frame === null) return { kind: "no-frame" };` (`tileViewportStreamManager.ts:363`), and then `if (outcome.kind !== "planned") return;` (`candidateArmSession.ts:1371`).

**N2-7** "open the file again."
- HOLDS. It is a fresh open (answer (a)).
- It is a retry, not a guaranteed fix.
- It is also not the only remedy: an Apply or a Clear issues the same fresh untiled first look on the open session (N2-3).

**N2-8** "After a filter, pan or zoom to load the view."
- HOLDS ONLY IF an earlier first look in this session delivered geometry, so that the grid frame exists.
- In that case the frame survives the reissue: `reissueUnrestricted` resets only the session's `frameEstablished` (`:1514`), and `establishGridFrame` and `establishTileGridContext` are one-shot (`tileViewportStreamManager.ts:311`, `WorkingCanvas.tsx:1551`). A pan therefore plans tiles under the new filter (`currentFilter = filter`, `candidateArmSession.ts:1498`). The tester's B2-apply run shows `viewportQueryCallsAdded":1` at current code.
- If the open's own first look had already failed, and an Apply or Clear made as the remedy fails the same way, panning still loads nothing.

**N2-9** "No wrong data is drawn."
- HOLDS, with one case named here so it can be recorded:
  - `reissueUnrestricted` (`candidateArmSession.ts:1497-1553`) does not cancel a previous untiled first look that is still streaming. `cancelUntiledStream()` is called only at `:1564` and `:1654`.
  - That stream's batches pass the guard `if (untiledStreamHandle !== stream) return;` (`:1214`) until the new handle is set at `:1205`, after the `viewportQuery` and `dataPlaneAttach` awaits.
  - So if Apply or Clear is clicked while the previous first look is still streaming, a batch landing in that window is drawn under the old filter. After the new first look fails, it stays drawn.
  - This needs timing inside one request round trip.
- The open path has no such window.

**N2-10** "This was found by reading v0.1.0's code"
- HOLDS: trace report §2, and the re-read above.

**N2-11** "and by a test of the current code;"
- HOLDS. It is the tester's probe `streamRefusalProbe.test.ts`, cases "B2" (open; ProducerFailed and TransportFailed) and "B2-apply", run at 20844fd8, whose code equals main's. Saved copy: 32148 bytes, sha256 4b9d87fadb14da4b11e47e7c84ea26aff1d353ac5f682d4dc34861186763c38d.
- The probe is not in the repository: it was removed from the worktree, and the copy is in scratch.
- Only the kernel boundary is mocked, and the canvas is a test double.
- The App surfaces were read, not run: "App, reading only, not run" in the tester's report. "No message is shown" therefore rests on reading.
- Clear was not one of the probe's cases.

**N2-12** "it was not reproduced in the v0.1.0 installer."
- HOLDS.
- Grep over `governance/**`, `state/**` and `frontends/shell/MANUAL-WALKTHROUGH.md`:
  - `ProducerFailed|TransportFailed|stream_failed|candidate-untiled-terminal`: 22 files. They are post-tag consults and forms, plus two pre-tag dev sittings (`state/cut-archive/CUT-STATE-residency-debt.md`, `state/cut-archive/E2E-STATE.md`). The only failure seen in a run, `state/consults/2026-10-14-shell-status-bar-one-height-e2e-custodian-run-1.md:43`, is an e2e run on main's dev build, not the installer.
  - An installer/RC/Part M pattern combined with first look, untiled, stream fail or empty map: no match.
  - "first look", in RELEASE-0.1.md and the walkthrough: only over-budget and fixture rows. No Part M row exercises a failing first look.
- This is absence by search, not proof.

## The advisor's three questions

**(a) Re-opening the same file is a fresh open. It is neither refused nor ignored.**
- The pick goes `handlePick` → `admitPath(path)` (`v0.1.0:frontends/shell/src/admission/AdmissionPanel.tsx:290-296`) → `runAdmitPath`.
- `runAdmitPath` has no same-path check against an admitted dataset. Its only same-path branch is for a refused state (`:206-210`). It then calls `deps.onAdmitted(outcome.admitted)` (`:254-255`).
- The kernel mints a new handle every time: `let handle = DatasetHandle::mint();` (`v0.1.0:kernel/src/skp.rs:338`), drawn from the OS CSPRNG (`v0.1.0:protocol/skp/src/v0/handles.rs:17-21`, `:46-48`). The catalog inserts by that name with no path check (`v0.1.0:kernel/src/lib.rs:175-177`).
- App resets the stale UI, filter included (`App.tsx:183-193`), and sets a new `Admitted`.
- `WorkingCanvas key={admitted.dataset}` (`App.tsx:1360`) remounts. Its comment, `App.tsx:1342`, byte-copied: `(a *new* \`open_dataset\`, \`Admitted\` object, even for the same file: SKP-V0.md never`.
- The `[admitted]` effect (`:1229`) re-runs. Its cleanup stops the old session and closes the old dataset (`:1071-1075` ff.). It starts a new session (`:1014`) and a new first look (`:1069`).

**(b) The dropped tile's key is forgotten. The next plan issues it fresh.**
- The catch deletes the key from `tileState` (`tileViewportStreamManager.ts:665`). The tile is not recorded as done or refused anywhere:
  - no batch arrived, so it is not resident;
  - nothing is written to `failedCoveringTerminals`, because the session is never called;
  - its epoch is only bumped again at the next `beginIssue`.
- On the next `onCameraChange`, `if (this.tileState.has(tileKey)) continue;` (`:412`) is false. `isTileResident` is `isTileCompleteInCandidateSet` (`candidateArmSession.ts:900`), and `isTileComplete` returns false for a missing entry (`v0.1.0:frontends/shell/src/canvas/tileResidentSet.ts:134-136`). So the tile becomes a new candidate and is issued or queued, subject to N1-6's three conditions.
- Pan and zoom both re-plan. `onViewStateChange` (`WorkingCanvas.tsx:1730`) calls `onViewportChangedRef.current(...)` (`:1760`). That goes to `viewportDebounceRef.current?.call` (`App.tsx:1401`), then to `handleViewportChange` (`candidateArmSession.ts:1338`, `:1367`).
- Nothing re-asks without a camera change.

**(c) Yes, the Cancel that stays up is in the filter panel.**
- Component: `FilterPanel`, inside `.filter-panel` / `.filter-controls`, at `v0.1.0:frontends/shell/src/filter/FilterPanel.tsx:116-120`: `{isScanInFlight(scanState) && (` / `<button type="button" className="filter-cancel" onClick={onCancel}>`.
- It is mounted only while a dataset is admitted (`App.tsx:1250-1265`, `scanState={scanState}`).
- What shows or hides it: `isScanInFlight`, which is true for `issuing`, `open-no-rows` and `delivering` (`App.tsx:461-463`). The candidate session sends only `issued`, folded to `issuing` (`App.tsx:414-415`), and `reset`, folded to `idle` (`:449-450`).
- Clicking it calls `relinquishFill` (`App.tsx:1325`), which emits the relinquished status (`candidateArmSession.ts:1675`). From then on a status sentence is shown.
- The admission panel has its own Cancel (`AdmissionPanel.tsx:355-363`). It shows only while an open is in flight, so it is not this one.

## Notes for items 3 and 4

1. **When the status is absent, and when it is not (N1-4).**
   - Silent and Cancel up: the refused tile is the last thing tracked, and the filter's first look has ended.
   - Present when other tiles are still tracked: the last one's terminal emits (`candidateArmSession.ts:1014`). Within budget that is the settled-partial sentence, because the dropped key is in `lastCoveringTileKeys` and not complete (`:651-653`).
   - Other cases:
     - (i) A sentence from the previous view stands: it stays, stale (N1-4).
     - (ii) Over budget, the settle gives the budget sentence plus `" Filling has finished for this view — the render budget is full; pan or zoom to see other areas."` (`residencyStatus.ts:410`). That does not say "not loaded" (the tester's case C, at current code).
     - (iii) The user pans during the filter's still-running first look, and the tiles settle before it ends. `settledState` requires `!input.untiledStreamRunning` (`residencyStatus.ts:332`), and the untiled terminal emits nothing except the relinquish re-emit (`candidateArmSession.ts:1321-1324`). So the status stays absent whether or not the refused tile was last, and Cancel goes down when the first look ends.
   - Case (iii) is reachable by ordinary use: the first plan after an Apply waits for a user pan or zoom, because the auto-fit does not notify, `fitToExtent(residentExtentRef.current, false);` (`WorkingCanvas.tsx:1489`). How often it happens cannot be settled by reading.

2. **Both pan and zoom re-ask (N1-6).** See (b).

3. **What is on screen in the B2 cases (N2-5).**
   - The status stack (`App.tsx:1436-1496`) is not rendered: no refusal, no residency status, scan not `cancelled`.
   - No global banner: nothing on the path throws. Only the `window` error and `unhandledrejection` listeners raise one (`v0.1.0:frontends/shell/src/diagnostics/errorHandlers.ts:58-68`).
   - The tag has no layer row and no toast (`git grep` for `layer-row|LayerRow|LayerList|layers-panel|toast` under `frontends/shell/src`: no product match).
   - What is shown but says nothing about the failure:
     - At Apply: `Applied: {appliedFilter.predicate}` (`FilterPanel.tsx:123`), which reads as success. The panel's refusal is cleared (`:56`). At a Clear the line goes away.
     - At open: the admission panel's `DescribeSummary` (`AdmissionPanel.tsx:411`).
     - The filter panel's Cancel shows while the first look runs and goes down at the failure. That is the only visible change at the moment of failure.
     - The collapsed `Console — N actions` count goes up (`v0.1.0:frontends/shell/src/console/ConsolePanel.tsx`, the label). Expanded, it lists `viewport_query` and the `binding_log_session_event` row, whose effect text is "writes one diagnostic log line to a host-side log that outlives the session …" (`v0.1.0:frontends/shell/src/console/surfaceRegistry.ts:106-108`).
     - A `viewportRefusal` block left from an earlier B1 at open is not cleared by the Apply path, which does not go through `reportViewportOutcome`. It names the earlier refusal, not this failure.

4. **The map is cleared first at Apply (N2-4).** Confirmed: `candidateArmSession.ts:1508`, `:1512`.

5. **The frame survives an Apply (N2-8).** Confirmed, with the condition stated under N2-8.

## Item 5: clauses I would flag (reasons only; the words are the advisor's)

- **N1-4, "no status is shown".** It is false when an earlier view's partial or over-budget sentence is still standing; that sentence stays, unchanged. The paragraph's own scenario, repeated pans at wide zoom under a filter, is exactly where a partial sentence from the previous view is likely to stand.
- **Note 1 names one exception, but the paragraph has two more** (notes 1(ii) and 1(iii)). A reader may take the named case as the only one.
- **N1-6, "ask for it again".** True as an ask, but at the same wide zoom the ask can be refused again. The paragraph says "zoom in", and the note's wording drops "in".
- **Placement: main's own paragraph below.** On main, under this paragraph, `f4027cc0:KNOWN-LIMITATIONS.md:190` (the human's wording, by its comment at `:191`) says an area refused after the retry "is still reported as not loaded, in the words above". Note 1's "for v0.1.0 too" implies main as well, and the tester's A1 and A2 show silence on main. That sentence would stand, contradicted, just below the correction.
- **N2-7, "open the file again".** It is offered as the remedy, while Apply or Clear also re-asks without reopening.
- **N2-8.** The compound case, where the open's first look also failed, is not covered.
- **N2-11, "a test of the current code".** This can read as a committed, re-runnable test. The probe is not in the repository, and its on-screen half is by reading.
- **N2-5.** At an Apply, "Applied: …" is on screen and reads as success. The note's words are not wrong, but a reader seeing that line may not recognise the case.

Not blocking, named so it can go in the source comment: the N2-9 window (a previous first look still streaming when Apply or Clear is clicked, with a batch landing between the clear and the new stream's attach). It needs timing inside one request round trip.

Files: C:\dev\spatial-ide\state\consults\2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-v0-1-0-trace-reviewer.md, C:\dev\spatial-ide\state\consults\2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-test-step-tester-report.md, C:\dev\spatial-ide\KNOWN-LIMITATIONS.md
