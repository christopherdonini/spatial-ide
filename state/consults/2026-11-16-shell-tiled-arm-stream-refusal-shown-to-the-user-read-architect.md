# shell-tiled-arm-stream-refusal-shown-to-the-user: the architect's read-only read of the shipped arm's refused requests and failed streams, for a tile and for the first look (ADV-2026-11-16-04 item 2); not a gate, no verdict

*Custodian's filing note (2026-11-16): the read-only read's report from its hand-back (10430 bytes, sha256 c09273679ac1567f002edd2fa6ae6974511e50917b1ec55f61f04ed98a21ffdb), below the rule, byte for byte except as listed here. Its brief, in the Agent call (2269 bytes), was dispatched at 2026-11-16T01:55:06Z; the run 2026-11-16T01:55:06Z to 2026-11-16T02:00:11Z by its transcript, 68 calls (Grep 29, Read 38, SubagentHandback 1), 0 errored, model claude-opus-5-5. It ran nothing. Changes: none. The advisor's ruling ADV-2026-11-16-04, item 2, asked for this read (`state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-04-two-nodes-from-the-architects-read-the-stream-refusal-node-after-a-read-the-dictionary-node-s3-after-b1-shell-half.md`); its finding on item 56 went to the advisor at once, as item 3 asks.*

---

main @ ddaabe8e355b3b76530a2ba9c2879ccf838fcfe0. This is a read-only read, not a gate, with no verdict. I ran nothing.

**For ADV-2026-11-16-04 item 3: item 56's sentence "which is shown by name" does not hold on main for a tile request in the shipped arm.** It does hold for the first look, both at open and at Apply.

Everything below is my own paraphrase. The only exceptions are text in quotation marks, which is copied exactly from the file cited.

# Tiled-arm refusal and failed-stream read

## The shipped arm and the two routes
- The shipped arm is the candidate session: `frontends/shell/src/App.tsx:1649-1705`.
- The first look is issued through `reportViewportOutcome(session.reissueUnrestricted(...))`: `App.tsx:1738`.
- An Apply goes through `applyFilter`, then `issueQueryRef`, which is `session.reissueUnrestricted`: `App.tsx:1705`, `:1092-1098`, `:362`.
- A tile is minted in `TileViewportStreamManager.mintAndStart`: `frontends/shell/src/streaming/tileViewportStreamManager.ts:933-1107`.
- **Stream-connection exhaustion is a refusal of the request, not a failed stream.** `viewport_query` opens the engine stream, and with it the stream lease, before it mints a ticket. It maps the error through `error_of`: `kernel/src/skp.rs:1485-1491`; the lease is taken at `engine/src/dataset.rs:2235`. Admission-class exhaustion also arrives as a refusal: `engine/src/predicate.rs:422-426`.
- So `engine.connections_exhausted` takes route (a) for the map. Route (b) is any terminal other than Completed after a stream was admitted.

## (a) A request the kernel refuses (`engine.connections_exhausted`)

**Tile request**
- **By which code:** the `viewportQuery` rejection is caught at `tileViewportStreamManager.ts:949`. `logMintRefused` writes the session-log line `tile-stream-mint-refused <tileKey>: <code> <fields>`: `:276-284`, `:951`.
- **First refusal:** the tile is queued again once (`:982-993`; the retryable code is at `:321`, `:329-332`).
  - If the retry mints, the log also gets `tile-stream-mint-recovered` (`:1047-1049`).
  - The user sees nothing.
- **Second refusal:** the tile is dropped (`:995-997`). The catch calls neither `onTerminal` nor any session callback, so nothing goes into `failedCoveringTerminals`.
- **What reaches the user:** no banner, no code and no message. The candidate session gives App no failure callback (`App.tsx:1650-1700`). Only the baseline arm sets `canvasRefusal` (`App.tsx:1794`).
- **The status bar, by my reading:**
  - The dropped tile is not complete, so `isFillComplete` reads false (`frontends/shell/src/residency/candidateArmSession.ts:685-687`). No failure is recorded, so `settledState` gives `settled-partial` (`frontends/shell/src/residency/residencyStatus.ts:330-335`).
  - At the next emission, within budget, the bar reads "Filling has finished for this view — some areas were not loaded; pan or zoom to load them." (`residencyStatus.ts:434-435`, `:462`).
  - Over budget, it reads the budget sentence plus " Filling has finished for this view — the render budget is full; pan or zoom to see other areas." (`residencyStatus.ts:414`, `:473`).
- **A stale case, by my reading:** the drop path calls neither `emitResidencyStatus` nor `syncScanLiveness`. If the dropped tile was the last one tracked, no settled sentence appears until the next pan or zoom. The scan-liveness state also stays "issued" until then (`candidateArmSession.ts:586-605`).

**First look at open**
- **By which code:** `issueUntiledQuery` awaits `viewportQuery` and lets the `SkpCallError` reject unchanged (`candidateArmSession.ts:1281-1283`).
  - Before that, `reissueUnrestricted` has already cleared the tiles and sent `query-issued` (`:1662-1666`, `:1705`).
  - `reportViewportOutcome` then calls `setViewportRefusal(formatRefusal(e.skpError))` (`App.tsx:1528-1536`).
- **What reaches the user:** the `.canvas-refusal` strip, which can be dismissed. It shows the code `engine.connections_exhausted` in `.admission-refusal-code`, then the message (`App.tsx:2397-2410`).
- **In which words:** the engine's Display text, unchanged (`frontends/shell/src/admission/formatRefusal.ts:27-33`).
  - Stream or other pool class: `engine/src/error.rs:416-421`.
  - Admission class: `engine/src/predicate.rs:422-426`.
  - `refusalGuidance` adds nothing for this code (`formatRefusal.ts:144-145`).

**First look at Apply or Clear**
- **What reaches the user:** `applyFilter` catches the error and returns `refused` with `formatRefusal` (`App.tsx:363-389`). `FilterPanel` shows it in `RefusalBlock`, which gives the code, the message and the fields (`frontends/shell/src/filter/FilterPanel.tsx:59-60`, `:136-139`; `frontends/shell/src/admission/RefusalBlock.tsx:27-31`).
- **Note:** the recovery re-issue goes through `reissueUnrestricted` again. If it is refused too, it is logged only, as `filter-recovery-failed` (`App.tsx:375-387`). By my reading the map then stays cleared.

## (b) A stream that ends in a terminal other than Completed

**Tile stream**
- **What reaches the session log alone:** the line `candidate-tile-terminal <tileKey> <handle>: <kind> — <detail>` (`candidateArmSession.ts:1006`). The code's own comment says a stream failure "has no dedicated UI wiring yet" (`:1002-1006`). No banner is shown.
- **How it reaches the status:** the failure is recorded in `failedCoveringTerminals` (`:1049`). When `trackedTileCount === 0`, the status is emitted (`:1054`).
  - **Within budget:** the bar reads "Filling has finished for this view, but part of this view failed to load; pan or zoom to retry." (`residencyStatus.ts:422`, `:458`; emitted at `candidateArmSession.ts:779-787`).
  - **Over budget:** the failure is folded into the budget sentence and its budget-only suffix (`candidateArmSession.ts:741-757`; `residencyStatus.ts:473`). So the user is told the render budget is full, and no failure is named.
- **So:** the user is told at most that part of the view failed to load. The code and the detail reach the log only.

**First look**
- **What reaches the session log alone:** the line `candidate-untiled-terminal <key> <handle>: <kind> — <detail>` (`candidateArmSession.ts:1379-1384`). The failure is recorded for the first-look key (`:1385-1387`).
- **What reaches the status bar:** the untiled `onTerminal` never calls `emitResidencyStatus` (`:1328-1442`).
- **At open, by my reading, the status bar shows no failure text.**
  - With no plan yet, `hasPlanned` is false and the state is `not-settled` (`residencyStatus.ts:331-333`).
  - The first plan clears `failedCoveringTerminals` (`candidateArmSession.ts:1496`), which erases the first look's failure.
  - If no batch with geometry arrived, no frame is set (`:1213-1214`). No plan can then run (`:1487`), so the map stays empty with no status. `query-issued` had already cleared the status (`:1705`).
- **At Apply (a later generation; the grid frame survives):** a pan can plan while the first look runs. A later failure then stands with `hasPlanned` true. The next emission reads "…part of this view failed to load…", or the budget sentence. That is my reading, and no test asserts it.
- The scan liveness is reset (`:1441`).

## (c) Item 56's "which is shown by name"

**Does not hold.** The item and its words are at `KNOWN-LIMITATIONS.md:480-481`.
- **Tile request:** the code reaches the session log only (`tileViewportStreamManager.ts:283`). The user sees at most the unnamed "some areas were not loaded" line, or a stale status (see (a)).
- **First look:** it holds. The code is shown on the canvas strip at open (`App.tsx:2399`) and in the filter panel at Apply (`RefusalBlock.tsx:28`).
- **Outside the map:** the Table shows the code (`frontends/shell/src/table/TableTab.test.tsx:172-175`). I did not read the export path beyond `frontends/shell/src/publish/PublishPanel.tsx:750`.
- **The sentence's other clauses:** "never a wrong result" was not tested by this read. "The map asks again once for a tile it was refused" holds (`tileViewportStreamManager.ts:982-993`).

## (d) Tests that observe (a) or (b) in the shipped arm

**Unit tests, (a), tile request:**
- `tileViewportStreamManager.test.ts:895-921` asserts the `tile-stream-mint-refused` line with `engine.connections_exhausted`, the one retry and the recovery line.
- `:923` asserts that a tile refused twice does not spin.
- Both cover log and queue behaviour only. Nothing user-visible is asserted.

**Unit tests, (a), first look:**
- `App.lateResult.test.tsx:1206-1212` is in the candidate-arm describe (`:1071`, `:1085`). It asserts that a live-generation `reissueUnrestricted` rejection shows `.canvas-refusal .admission-refusal-code`.
- The code is `engine.no_covering_bbox`, not `engine.connections_exhausted`, and the session is mocked (`:288`). The route does not depend on the code.
- `:517-529` uses `engine.connections_exhausted`, but it is in the baseline describe (`:421`, `:437`) and asserts that nothing is written.

**Unit tests, (b):**
- `candidateArmSession.test.ts:1446-1465` (a tile `ProducerFailed`) asserts the `partial-failure` emission.
- `residencyStatus.test.ts:179-182` asserts that sentence's text.
- `candidateArmSession.test.ts:3249-3263` (a first-look `ProducerFailed`) asserts the `candidate-untiled-terminal` log line and that `isFillComplete()` is false. It asserts no status emission.
- No test renders App with the real session to observe the status bar after a failure.

**End-to-end tests:**
- None observes (a) with `engine.connections_exhausted`, or (b), as the user sees it, in the shipped arm.
- `e2e/regression.mjs:2057-2082` reads `tile-stream-mint-refused` and `-recovered` lines for a summary only (`:2084-2089`).
- `e2e/source-changed.mjs:1094` and `:1394` assert a mint-refused line, but only for `engine.source_changed`.
- `e2e/residency-harness.mjs:2514` reads `candidate-tile-terminal` lines to attribute them, not to judge a failure.

## Not settled by reading
1. Whether the stale-status and stale-liveness case after a last-tile drop is reached in ordinary use. That needs a run.
2. What `PublishPanel` shows for this code.

These paths are relevant to the custodian:
- C:/dev/spatial-ide/frontends/shell/src/streaming/tileViewportStreamManager.ts
- C:/dev/spatial-ide/frontends/shell/src/residency/candidateArmSession.ts
- C:/dev/spatial-ide/frontends/shell/src/residency/residencyStatus.ts
- C:/dev/spatial-ide/frontends/shell/src/App.tsx
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md