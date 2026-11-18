Drafted: S1 (PR #330) records step at ec6a6382bc35c9273b31f7036f9215c4c5330d14, architect (the custodian's filing note, 2026-11-18: ruled in ADV-2026-11-18-15; the architect, model claude-opus-5-5, 17776 bytes, sha256 c1825fed10e63789836a29b0b5674d1ec7b1cc51ec38eaa2e5a5044fbe6321a0; its run 2026-11-18T14:38:49.067Z to 14:48:30.958Z by its transcript, Read 37, Grep 21, Glob 1, SubagentHandback 1, none errored; below byte for byte, with this note and one final newline)
Result: Four drafts (D1, plus D2 to D4 as one to three Old/New pairs each) are checked clause by clause against the code at X. Both pairs' New texts hold at X. There is one gap, from my attempt-1 report (its drafts, item 3), which D2 and D3 name. One point is for the advisor: D1's sentence on a first look whose stream fails is not a refusal for want of a connection.

None of these words is the human's. They are the advisor's wording under the delegation (D1 to D4's quoted words), or worker comment text that the advisor rules. Code is cited by symbol, with lines at X in `C:/dev/wt/srf`.

## D1. Item 56's span (`KNOWN-LIMITATIONS.md` line 487 at X)

Old (line 487, stands once):
```
Together they can leave a request refused with the code engine.connections_exhausted. A refused request is never a wrong result. For the first look after an open or an Apply, the code is shown by name. For a tile of the map it is not shown: the map asks again once for a tile it was refused, and if that request is refused too, the tile is not loaded, the code is written to the session log alone, and the status bar never names it: at most it says that some areas were not loaded, or that areas are not drawn to stay within the render budget.
```
New:
```
Together they can leave a request refused with the code engine.connections_exhausted. A refused request is never a wrong result. For the first look, the code is shown by name. For a tile of the map it is not shown: while the view is within its render budget, the map asks again once for a tile it was refused, and if that request is refused too, or the view is over its render budget, the tile is not loaded, the code is written to the session log alone, and the status bar never names it: once the view has finished loading, it says that some areas were not loaded, or that part of this view failed to load when another part also failed, or, over the render budget, that areas are not drawn to stay within the render budget. If the first look's request is granted but its stream fails before you next pan or zoom, the status bar says that the data for the map, or for this view, failed to load, or that part of this view failed to load.
```
What is untrue or incomplete at X, and so changed:
- "after an open or an Apply" leaves out the Colour by refill, which item 56 itself names as a third time the first look is issued.
- "asks again once" is false while the view is over budget (OPEN-1 (a)).
- "at most it says" leaves out the failure sentence and no longer states what the bar shows once the view settles.
- Nothing in the span said what the bar shows after a first look whose stream fails (§10).

The first two sentences are unchanged.

Clause checks at X:
- **"For the first look, the code is shown by name"**:
  - At open: `reportViewportOutcome(session.reissueUnrestricted(...))` (App.tsx:1757). Its rejection arm `setViewportRefusal(formatRefusal(e.skpError))` (:1555) renders the code in `attention.viewportRefusal` (:2428-2431).
  - On the Colour by refill: the effect that follows `previousColourColumn` (:2057-2064) goes through `reportViewportOutcome`.
  - On an Apply or a Clear: `applyFilter` returns `formatRefusal` (:374, :388). `FilterPanel.submit` sets it for `RefusalBlock`, and Clear is `submit("")` (FilterPanel.tsx:56-73).
- **"For a tile of the map it is not shown"**: the only report is `logMintRefused` (tileViewportStreamManager.ts:283-291, called at :958). `onTileDropped` carries `tileKey` alone (:112).
- **"while the view is within its render budget, the map asks again once"**: the requeue test in `mintAndStart` (:990-997): `!this.overBudgetFlag` (:992), `isRetryableRefusal`/`RETRYABLE_ENGINE_CODE` (:993, :328), and `requeuedTiles` for "once" (:994, :998).
- **"if that request is refused too, or the view is over its render budget, the tile is not loaded"**: the drop branch, `tileState.delete` (:1004-1007), is reached when `requeuedTiles.has` is true or `overBudgetFlag` is set.
- **"the code is written to the session log alone"**: `logMintRefused` at :958 runs before the branch, in every case.
- **"the status bar never names it"**: none of `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`, `SETTLED_PARTIAL_FAILURE_TEXT`, `SETTLED_PARTIAL_SUFFIX` or the over-budget base names a code (residencyStatus.ts:422, :430, :442-443, :489-492).
- **"once the view has finished loading, it says"**:
  - `onTileDropped` in candidateArmSession.ts (:1063-1066) calls `emitResidencyStatus` when `trackedTileCount === 0`. So do a tile's terminal (:1058), the untiled terminal after a plan (:1462-1464) and a plan's trailing emit (:1640).
  - `settledState` (residencyStatus.ts:338-344) reads settled only with `hasPlanned`, no pending viewport change, no tracked tile and no untiled stream running.
  - The sticky relinquished status cannot stand over a drop: `relinquishOutstanding` bumps every epoch, so the drop calls nothing.
- **"some areas were not loaded"**:
  - Within budget and settled, `isFillComplete` is false (:672-693), because the dropped tile is in `lastCoveringTileKeys` and is not complete.
  - With no failure, the reading is `settled-partial`, giving `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` (:807-814; residencyStatus.ts:486).
- **"or that part of this view failed to load when another part also failed"**: when `failedCoveringTerminals.size > 0` (:717, set at :1053 and :1397), the reading is `settled-partial-failure`, giving `SETTLED_PARTIAL_FAILURE_TEXT` (:783-790; residencyStatus.ts:482).
- **"or, over the render budget, that areas are not drawn to stay within the render budget"**: the `candidate-over-budget` branch (:755-761) emits whether or not the view is settled. Settled, it adds `SETTLED_PARTIAL_SUFFIX` (residencyStatus.ts:492, :497).
- **"If the first look's request is granted but its stream fails before you next pan or zoom"**:
  - The untiled sink's `onTerminal` in `issueUntiledQuery` (§2.2 (b), :1462). The look is current (`wasCurrent`, :1348), not self-cancelled, not after a relinquish re-emit, its terminal kind is not `Completed`, and `hasPlanned` is false.
  - `hasPlanned` is set only by a planned camera change (:1527) and is reset by the reissue (:1712).
  - A session-ended terminal returns earlier (:1366-1369).
- **"the data for the map, or for this view, failed to load"**: `candidate-first-look-failed` (:1472) reads `FIRST_LOOK_FAILED_NO_FRAME_TEXT` without a grid frame and `FIRST_LOOK_FAILED_TEXT` with one (residencyStatus.ts:452, :459, :504-505).
- **"or that part of this view failed to load"**: with a grid frame and `untiledRowsSeen > 0`, it emits `partial-failure` (:1465-1470).

## D2. Item 56's comment (line 488 at X): three insertions, each Old standing once

D2a. Old:
```
because a refused tile request does not show the code.
```
New:
```
because a refused tile request does not show the code. Since the stream-refusal piece S1, the span from "For the first look, the code" to the end of its sentence on a first look whose stream fails is the advisor's wording, under the delegation of 2026-11-13, ruled in @RULING@, checked against the code at the head of that piece's branch (by symbol) under its form's §10 (governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md), in place of the words of ADV-2026-11-16-05 and ADV-2026-11-16-09 from there to the span's end.
```
D2b. Old:
```
a refused request is never a wrong result because viewport_query in kernel/src/skp.rs returns the engine's error before it mints a ticket.
```
New:
```
a refused request is never a wrong result because viewport_query in kernel/src/skp.rs returns the engine's error before it mints a ticket. Since the stream-refusal piece S1: a refusal while the manager's overBudgetFlag is set is not requeued (the !this.overBudgetFlag term of mintAndStart's requeue test, OPEN-1 (a)) and drops the tile; both of mintAndStart's drop sites, after the requeue declines and when dataPlaneAttach fails, call the manager's onTileDropped, whose one product caller, its handler in candidateArmSession.ts, re-syncs the scan and, when no tile is still tracked, recomputes the status through emitResidencyStatus; settledState reads the view as finished loading only after a plan with no viewport change pending, no tile tracked and no untiled stream running, and a settled view with an entry in failedCoveringTerminals shows SETTLED_PARTIAL_FAILURE_TEXT, which names no code either; the first look's own terminal (§2.2 (b), the untiled sink's onTerminal in issueUntiledQuery) recomputes the status after a plan, whatever its kind, and before any plan a failed one emits SETTLED_PARTIAL_FAILURE_TEXT when a grid frame exists and some of its rows arrived, and otherwise candidate-first-look-failed, which residencyStatusText reads as FIRST_LOOK_FAILED_NO_FRAME_TEXT without a grid frame and FIRST_LOOK_FAILED_TEXT with one. A refused first look on a Colour by refill (the effect in App.tsx that follows previousColourColumn) reaches the canvas strip through reportViewportOutcome as one at open does.
```
D2c. Old:
```
that needs a camera change inside the refused request's round trip.
```
New:
```
that needs a camera change inside the refused request's round trip. Not covered (§31c), for the words of the stream-refusal piece S1: an earlier first look whose stream fails after a reissue has started a new one, but before the new one's ticket is minted, is read as current, so its sentence can stand over the new look until the session next emits a status (the comments of FIRST_LOOK_FAILED_NO_FRAME_TEXT and FIRST_LOOK_FAILED_TEXT). Not covered: "within its render budget" is the manager's overBudgetFlag, so an over-budget sentence left standing from the first look while the view is back within budget can show while a refused tile is asked for again.
```
Clause checks at X:
- **D2a**: an attribution, in the brief's words. "From "For the first look, the code"" is D1's first changed sentence. The form's §10 orders the draft.
- **D2b, the over-budget refusal**: `!this.overBudgetFlag` at tileViewportStreamManager.ts:992 drops the tile (:1004-1007).
- **D2b, the two drop sites**: :1007 and :1036, each `if (!this.stopped) this.opts.onTileDropped?.(tileKey)` after `drainQueueIfRoom()`.
- **D2b, "one product caller"**: the option's doc (:106-112).
- **D2b, the handler**: candidateArmSession.ts:1063-1066, which runs `syncScanLiveness`, then `emitResidencyStatus` when `trackedTileCount === 0`.
- **D2b, the settled conditions**: `settledState` (residencyStatus.ts:339-341), with its inputs at :708-719.
- **D2b, the failure text**: :783-790 and residencyStatus.ts:482, 430.
- **D2b, the untiled terminal**: :1462-1474.
- **D2b, the strings**: residencyStatus.ts:504-505.
- **D2b, the Colour by refusal**: App.tsx:2057-2064, then :1555.
- **D2c, §31c (first sentence)**: the reissue leaves the old handle (:1681-1749). The new handle is assigned only at :1312, after the awaits (:1294, :1299), and `wasCurrent` is read at :1348. This needs a stream failure (a fault) and timing inside one round trip. The same words stand in W1's and W2's comments (residencyStatus.ts:451, :458).
- **D2c, second sentence (my attempt-1 gap, at its line 129)**:
  - `handleViewportChange` sets `setOverBudget(!fits)` (:1635). Within budget and not settled, `emitResidencyStatus` is then silent (:843-848), so an over-budget sentence from the first look can stand. That is A3, in the node's notes.
  - Ordinary use can reach it, but the retry is not observable (session log only), so D1 shows nothing false. It is not a §31c case and is labelled plainly.
  - This clause is one more than the brief lists for D2. It is there because the gap applies to D1's new words. The advisor may drop it.

## D3. The on-main paragraph's source comment (line 194 at X)

Old (line 194, stands once):
```
(§A R-P; the sighted paragraph above is unchanged).
```
New:
```
(§A R-P; the sighted paragraph above is unchanged), except its second and third sentences, which are the advisor's wording, under the delegation of 2026-11-13, ruled in ADV-2026-11-18-09 item 8, with that ruling's New text replaced in its second sentence (the paragraph's third) by ADV-2026-11-18-13 item 4, because the stream-refusal piece S1 changed what the human's two sentences described. Where the code does what those two sentences say, by symbol at the head of that piece's branch: a refused tile query is logged by logMintRefused in mintAndStart's viewportQuery catch (frontends/shell/src/streaming/tileViewportStreamManager.ts); it is asked for again once by the requeue test there, whose terms are the tile's epoch and latestMembership (still in view), !this.overBudgetFlag (within its render budget), queue.length < MAX_QUEUED_TILES (the queue has room), isRetryableRefusal (RETRYABLE_ENGINE_CODE) and requeuedTiles (once); a tile refused after that retry is dropped and onTileDropped reaches candidateArmSession.ts, whose emitResidencyStatus, once settledState reads the view settled, gives SETTLED_PARTIAL_WITHIN_BUDGET_TEXT (not loaded), SETTLED_PARTIAL_FAILURE_TEXT when failedCoveringTerminals is not empty (part of the view failed to load), and, over budget, the candidate-over-budget sentence, which names the render budget (frontends/shell/src/residency/residencyStatus.ts). The pins below are at the base and describe the paragraph as the human approved it; the code named here by symbol is authoritative for the two sentences as they now read. Not covered: "within its render budget" is the manager's overBudgetFlag, so an over-budget sentence left standing from the first look while the view is back within budget can show while the tile is asked for again.
```
Clause checks at X:
- "logged": :958.
- "still in view": :973 (epoch) and :995 (`latestMembership`).
- "within its render budget": :992.
- "queue has room": :996.
- "again once": :993-994 and :998-1001.
- "dropped and onTileDropped": :1004-1007.
- The three settled readings: candidateArmSession.ts :755-761, :783-790 and :807-814, with residencyStatus.ts:338-344, 482-497.
- "The pins below are at the base": the comment's pins are all `@ e0a4810d…`. My sentence names the tree as authoritative over those historical pins (round 14).
- The gap is the one at my attempt-1 report's line 129 (drafts, item 3).

## D4. Item 4's source comment (line 81 at X)

Old (line 81, stands once; "The pins follow on main after the merge. -->" stands twice, at :81 and :127, so it is not used):
```
and every other property of StyleState is a literal in toStyleDocument in the same file.
```
New:
```
and every other property of StyleState is a literal in toStyleDocument in the same file. The end of the sentence that begins "Opening a file also clears", from "and ends Colour by", is the advisor's wording, under the delegation of 2026-11-13, ruled in ADV-2026-11-18-11; where the code does it: admit, the workspace reducer's handler of resource.admitted in frontends/shell/src/workspace/workspaceState.ts, sets the view's fillMatch to null on every open after the first and keeps the other StyleState properties (fillColor, fillOpacity, outlineColor, outlineWidth, frontends/shell/src/style/document.ts).
```
Clause checks at X:
- `admit` (workspaceState.ts:127-161): `fillMatch: null` at :155, and the spread keeps the rest. The first open mints a view with `DEFAULT_STYLE_STATE` (:132-140).
- `StyleState` has exactly those five fields (document.ts:66-72).
- The reducer routes `resource.admitted` to `admit` (:187-188).

## The two pairs' New texts at X

**ADV-2026-11-18-13 item 4: true at X, with one gap for the comment (D3).**
- "is logged": :958.
- "while it is still in view": :973 and :995.
- "the view is within its render budget": :992 (the gap: it is the manager's flag, A3).
- "the map's tile queue has room": :996.
- "asked for again once": :994 and :998.
- "reported as not loaded, in the words above": `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` at settle (:807-814). "The words above" are the v0.1.0 paragraph's "reports those areas as not loaded" (:186).
- "or, when another part of the view also failed to load, by the sentence that says part of the view failed to load": :783-790 with :717.
- "when the view is over its render budget, the status names the render budget instead": :755-761 and residencyStatus.ts:489-492.

**ADV-2026-11-18-11 item 2: true at X.**
- "clears the filter cards, not the filter alone": `clauses` dropped (:154), `filter: null` (:158).
- "and ends Colour by (item 65)": :155. Item 65's last sentence at X says the same.
- "the other style properties are kept": the spread at :155.

## Not checked, and points for the advisor

- **D1's last sentence is outside item 56's subject.** A first look whose stream fails is not a refusal for want of a connection: the stream lease is taken before the ticket (`lease_for_stream`, engine/src/stream.rs:1234, inside the query build). It is there because §10 orders the span to cover a failed first look. The advisor may place it elsewhere.
- **Not run.** I have no shell. I ran no test, made no byte-count or uniqueness check by script (uniqueness is by Grep -o at X), and recomputed no hash.
- **Not read.**
  - `onCameraChange`, so D1 says nothing of the next pan replanning a dropped tile.
  - `handleApplyFilter` (App.tsx:1078-1110) and the clause cards' route. The Apply route rests on `applyFilter` and FilterPanel.
  - `isTileCompleteInCandidateSet`, for a partly resident tile that is refetched and then dropped.
  - The Table and export paths. The span says nothing of them.
- **Not established:** a first look whose rows all lack an extent gives W1. D1's union wording holds for it.

Model: Opus 5.5 (claude-opus-5-5). I wrote no file.
