*The architect's draft of the v0.2 line owed in item 68 of `KNOWN-LIMITATIONS.md`, with its answer on the reopen, for the advisor's rulings ADV-2026-11-22-27 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-27-the-mint-window-after-fe1-as-red-run-a-v0-2-line-owed-in-item-68-item-68s-words-after-the-fix-approved.md`) items 3 and 4 and ADV-2026-11-22-29 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-29-pr-358-item-68s-clause-untrue-as-approved-its-new-words-an-exception-for-a-sessions-end-the-architects-attempt-2-checks-them.md`) item 7; tag node:untiled-reissue-holds-earlier-look-handle-until-mint@v02-line-architect, dispatched at 2026-11-22T18:30:43.571Z, read only at main b1261d72b01a2432f0feeee8db4300cce7d66488 in a detached read checkout. A draft, not a gate; its words are the architect's, sent to the advisor at 2026-11-22T18:43:32.497Z for approval or replacement. Filed by the custodian below the rule from its hand-back, 12966 bytes, sha256 c8b380a3ea161ba1d08da58320718072bd760cda74c36983c3b4563a93ff01e9, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. Its run: Glob 1, Grep 25, Read 37, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T18:30:47Z to 2026-11-22T18:39:58Z by its transcript; 0 calls named the main checkout.*

---

Draft: v0.2 line for item 68
Read: C:/dev/wt/read-1122 @ b1261d72b01a2432f0feeee8db4300cce7d66488
REPORT PATH: state/consults/2026-11-22-untiled-reissue-mint-window-v0-2-line-architect-draft.md
Reopen: no

This is a draft, not a gate. The rulings ADV-2026-11-22-27 and -29 are the advisor's, under the human's delegation of 2026-11-13. They are not the human's words. The words below are the architect's, so they are not the human's wording either, and the advisor approves or replaces them (ADV-2026-11-22-27 item 3). Every code cite is a reading aid at b1261d72. Every finding is by reading; I ran nothing.

## Words

Where they go: in item 68's paragraph, straight after this sentence. It occurs once in `KNOWN-LIMITATIONS.md`; I checked that with a Grep count of 1.

```text
Until then the map can show only part of what that view holds, and the status line can say that it is showing all the features in view.
```

Put one space, then the new text. The sentence that follows today ("This has been reached only in a test …") stays where it is, after the new text. Nothing else in item 68 changes.

```text
The grid the map's tiles are cut from is set only when a first data load ends; if a change that starts a new first data load is made before any has ended since the file was opened, and the previous load ends before the new one does, that grid can be set from only the part of the data that has arrived since the change, and it is kept until the file is opened again. The grid is not shown and no feature is drawn wrongly because of it, but its cells can be smaller than they would otherwise be, so that at a view much wider than that part of the data the map can ask for fewer tiles than the view needs, and part of the view is left unfilled; the status line then does not say that all features in view are shown.
```

## Clause check (candidateArmSession.ts unless another file is named)

**Sentence 1**
- **"set only when a first data load ends".** There is one product call to `establishGridFrame`, at `:1238`, inside `establishFrameFromExtent`. That function is called only at `:1430`, in the untiled sink's `onTerminal`. The manager's write is at `streaming/tileViewportStreamManager.ts:469-470`.
- **"a change that starts a new first data load"** covers the four triggers. All of them go through `issueQueryRef`, which is bound to `reissueUnrestricted` (`App.tsx:1801`):
  - Apply and Clear, through `applyFilterWith`'s `requestViewport` (`App.tsx:1119-1126`, `:1146`);
  - a card or command-bar change, through `changeClauses` (`App.tsx:2168`);
  - Colour by, through the effect at `App.tsx:2140-2147`, only when attributes were not held (`:2144`).
- **"before any has ended since the file was opened".** No untiled terminal has arrived yet, so by the first bullet no grid exists. Every new open builds a new session and a new manager (`App.tsx:1746`, `:936`).
- **"the previous load ends before the new one does".**
  - `reissueUnrestricted` neither cancels the earlier look nor clears the handle (`:1718-1786`).
  - If the earlier look ends after the new look's mint, it reads `wasCurrent` false (`:1358`), and the frame call is gated only on `!(wasSelfCancelled && manager.gridFrame !== null)` (`:1429-1431`).
  - If the new load ended first, its own terminal has already set the frame. A later call then returns at `:1235` and `:469`.
- **"only the part of the data that has arrived since the change".**
  - The reissue resets `latestUnionedExtent` (`:1758`) and the canvas's fit anchor (`:1745`; `canvas/WorkingCanvas.tsx:1660-1662`).
  - From then on, each admitted batch sets it to the union since that reset (`:1150`; `WorkingCanvas.tsx:1762`, `:1814`, `:1840`).
  - After the mint those batches are the new look's. Before the mint they are the earlier look's, because `onBatch` checks only the handle (`:1331`).
  - "can" covers the null case: when nothing has arrived, `:1235` returns and the new look's own terminal sets the grid.
- **"kept until the file is opened again".** `establishGridFrame` does nothing once a frame exists (`tileViewportStreamManager.ts:469`), and nothing else writes the frame. A reissue's `clearAll` does not touch it. A new open builds a new manager (`App.tsx:1746`).

**Sentence 2**
- **"The grid is not shown".** I found no draw of the frame. It goes only into tile keys and bboxes (`tileGrid.ts:120-138`, `:158`) and into `establishTileGridContext` (`:1241`).
- **"no feature is drawn wrongly because of it".**
  - Each tile asks for its cell's bbox under the current filter (`tileViewportStreamManager.ts:941-955`, `:526`).
  - Tiles have no row limit (`mintAndStart` passes a limit of `null`, `:955`).
  - Cells tile the whole plane, with no boundary (`tileGrid.ts:46-51`).
  - Cell size changes which tiles are asked for, not what a tile holds. For data drawn inside the window itself, see Notes N1.
- **"its cells can be smaller".**
  - Cell size is `baseSpan / TILE_GRID_DIMENSIONS[level]` (`tileGrid.ts:137-138`).
  - `baseSpan` is twice the anchor's largest side (`:120-124`), and the anchor is the extent itself (`canvas/extent.ts:90-91`).
  - The level is medium, 16 cells a side (`tileGridConstants.ts:26-28`, `:35`), unless a dev-only selector is set (`App.tsx:1752-1758`).
  - "can": a part taken under an earlier, wider filter can be larger than the new look's whole union, and then the cells are larger.
- **"at a view much wider than that part … fewer tiles than the view needs, and part of the view is left unfilled".**
  - Each plan takes at most `freeSlots + availableQueueRoom` new tiles: at most 3 + 512 (`tileViewportStreamManager.ts:632-646`; `tileGridConstants.ts:40`, `:54`).
  - It keeps the nearest to the view's centre and sets `coveringTruncated`.
  - A dropped cell is not tracked, so only a later plan asks for it (`:612-623`).
  - My arithmetic, not run: the anchor spans 8 cells a side at medium, so a square view needs more than 515 cells once it is about 2.8 times the anchor's span. That is reached against the part's span rather than against the whole first look's union.
- **"the status line then does not say that all features in view are shown".**
  - `lastCoveringTruncated` (`:1627`) makes `isFillComplete` false (`:689`).
  - The settled branch sends the partial variant (`:817-824`).
  - The over-budget branch never reads complete (`:743-773`).

**Answer to the question in ADV-2026-11-22-27 item 3: yes.** With smaller cells, the limit on the tiles of one plan can leave part of a view unfilled. The code is `tileViewportStreamManager.ts:632-646` with `tileGrid.ts:120-138`.

**Which effects a user can notice**
- **Cell size: yes, indirectly.** More tiles are asked for per view, and each request is a Console entry (item 67's comment). The one effect a user can name is the unfilled part at a wide view, together with its status. After the change the camera fits to the new generation's first geometry batch (`WorkingCanvas.tsx:1817-1819`). That batch lies inside the part when the end comes after the mint, so the cap is met on zooming out, for example at Zoom to layer, which fits the whole union received since the change (`WorkingCanvas.tsx:1625`). That is ordinary use, not a §31 (c) case.
- **Cell position: no.** The grid has no boundary and is not drawn.
- **N-4's camera changes that plan tiles before the current look ends: no.**
  - With a frame, `onCameraChange` plans instead of returning `no-frame` (`tileViewportStreamManager.ts:525`; `:1555-1564`).
  - That is what the app does after any change made once a grid exists, so a user cannot tell it apart.
  - The words therefore leave position and N-4 out. If the advisor wants them named, a clause "its cells' position, and tiles asked for during the new load, are not visible as such" would be true by the same cites.

## Session-end route (ADV-2026-11-22-29 item 7)

Main has the same route, ungated.
- **It is not gated on the look.** `wasCurrent` is read at `:1358`. `isSessionEndedTerminal` comes after it at `:1376-1379`, gated on nothing, so it runs for an earlier load's terminal too.
- **It matches only the two codes**, file changed and coverage lost (`streaming/liveTicketSet.ts:58-63`).
- **The path to the session's end:**
  1. `manager.notifySessionEnded` (`tileViewportStreamManager.ts:775-777`) calls `endSession` (`:747-760`).
  2. `endSession` sets its latch, then `clearAll` (`:754`), then `onSessionEnded` (`:759`).
  3. `onSessionEnded` is `endCandidateSession` (`candidateArmSession.ts:1082`, `:1110-1124`). It cancels the untiled stream, clears every tile from the map (`:1118`), and calls App's `endSession` (`App.tsx:1795`, `:1488-1500`) and then `handleSessionEnded` (`App.tsx:708-722`).
- **The status line can change on this route.** `clearAll`'s in-flight loop (`tileViewportStreamManager.ts:702-704`) calls `cancelTileStream(…, true)`, which calls `onTileSuperseded` (`:1126-1127`). That reaches `emitResidencyStatus` (`candidateArmSession.ts:1011`) when it reports the last tracked tile, with nothing queued or minting. `emitResidencyStatus` sends through `onResidencyStatusChange` to `setResidencyStatus` (`App.tsx:1772-1777`).
- **This end sets no grid.** It returns at `:1378`, before the frame call at `:1429-1431`.
- **What the v0.2 words claim about it.** They claim nothing about the status line or the map at an earlier load's end. "can be set" leaves this end out without denying it. Main's present item 68 makes no such claim either: it speaks only of the previous load completing.

## Reopen (ADV-2026-11-22-27 item 4): no

At a reopen with a saved filter or a saved Colour by, no new first data load is started before the open's own first look has ended. Traced:
1. `AdmissionPanel.tsx:288-290` calls `onReopened` instead of `onAdmitted`, synchronously.
2. `handleReopened` (`App.tsx:1215-1241`) runs `handleAdmitted` (`:1221`), whose `resource.admitted` is dispatched at `:1198`. In the same turn it:
   - sets `activeFilterRef.current` to the combined saved clauses (`:1226`) or to the saved filter (`:1229`);
   - dispatches the style transitions, including Colour by's `fillMatch` (`:1232-1233`).
   React 18 `createRoot` (`bootstrap.tsx:25`) batches all of this into one commit.
3. The `[admitted]` effect (`App.tsx:1652-2053`) starts the open's own first look under that filter: `session.reissueUnrestricted(null, activeFilterRef.current)` (`:1834`). This is the one load, and the saved filter travels on it.
4. The Colour-by effect (`App.tsx:2140-2147`) depends only on `[colourColumn]`.
   - It records the column (`:2142`) and returns unless `attributesNotHeld === dataset` (`:2144`).
   - `attributesNotHeld` starts as null (`:862`). It is set only from the new canvas's `onAttributesNotHeld` (`:2373-2375`), which fires on a decoded batch (`WorkingCanvas.tsx:1093-1095`), and no batch exists in the commit that sets the column.
   - Each open's dataset handle is new and never reused (`App.tsx:727-731`, which cites `kernel/src/skp.rs:731`).
   - When `attributesNotHeld` later becomes the dataset, the effect does not run again, because its dependency has not changed.
5. The saved view's `applyView` (`App.tsx:1836`; `WorkingCanvas.tsx:1646-1650`) only moves the camera. Before a frame exists, a camera change plans nothing (`tileViewportStreamManager.ts:525`).

At a reopen, the fault therefore needs the same quick Apply or Clear, card or bar change, or Colour by as at any open.

## Notes
- **N1 (on "no data shown is wrong").**
  - The clause is true of the grid, and the words scope it with "because of it".
  - It does not hold for the mint window itself, by reading and not run. Before the new look's mint, the earlier look's batches are still admitted after the reissue's clear (`:1331`, `:1346`), under the earlier filter, and are drawn under `INITIAL_TILE_KEY` (form §2.2). That needs timing inside one request round trip (form §1), so it is a §31 (c) case: it goes in the item's comment, not in the words. The item's comment already lists "what else the previous load's batches do" as not examined.
- **N2.** The paragraph's last sentence ("This has been reached only in a test …") will also cover the new text. For the grid case, the test is FE1 (a) on PR 358's branch (form Amendment 1 item 2.3), red at main's code by ADV-2026-11-22-27 item 1. Nothing has been seen in the app (form §1; OPEN-9).
- **N3.** Item 68's bold line does not cover the new case. The ruling keeps it unchanged.
- **N4.** Item 68's comment needs this clause map by symbol when the docs-only piece lands. The bullets under Clause check are the material for it.
- **N5.** If PR 358 merges after this line, OPEN-8 governs, and the A8 words with ADV-2026-11-22-29's sentence replace item 68, including this line.
- **N6 (paraphrase, by reading).** An early frame also lets Cancel reach the new untiled look (`:1886`). That is the ordinary behaviour once any frame exists, so I do not count it as noticeable.

Model: claude-opus-5-5 (Opus 5.5).
