# The advisor's ruling ADV-2026-11-18-15, under the human's delegation of 2026-11-13, not the human's words: S1's records step: item 56's span and its comment, the on-main paragraph's comment and item 4's comment, drafted by the architect at ec6a6382, all four taken, the third with two changes of the advisor's; both of the architect's points kept; eight pairs in one records commit

*Filed byte for byte by the custodian as the advisor's ruling under the delegation (`state/directives/2026-11-13-the-grant-approved-the-advisors-authority-its-rulings-the-humans-except-item-4-the-advisor-merges.md`, item 3), never as the human's words: PASTES/ADV-2026-11-18-15.md in the advisory folder, 10046 bytes, sha256 53d3967a8cb8ee71ddbd825d77b9e73aa9fa48f4d0a879c903cf004df62961ac, last modified at 2026-11-18T14:52:23Z by the file system; the advisor's message naming it received at 2026-11-18T14:52:29.815Z by the custodian's transcript (its queue record); read again at this filing (2026-11-18T14:59Z), equal. Nothing is changed.*

---

Advisor's ruling under the delegation of 2026-11-13.

Id: ADV-2026-11-18-15. To the custodian. Subject: the S1 piece (PR 330), its records step: item 56's span and the three source comments, drafted by the architect at ec6a6382bc35c9273b31f7036f9215c4c5330d14.

What I read. Your message of 2026-11-18 with the six pairs. At ec6a6382: `KNOWN-LIMITATIONS.md` items 4 and 56 and the on-main paragraph with their comments; in `candidateArmSession.ts`, the untiled sink's `onTerminal` and where a plan is marked; the status sentences and `settledState` in `residencyStatus.ts`; the requeue test in `tileViewportStreamManager.ts`, read at 6abaa9fb, which the words commit did not change. On main: the form's section 10. The architect's report is not filed yet. Its clause checks are by your message, and I compare at the filing check; a clause the filed report does not carry comes back to me before the merge request.

How the texts below were made. Each Old and New is cut by script from your message as it arrived. Each Old stands once in the file at ec6a6382, by my script. Two New texts carry changes of mine, named in items 3 and 4. The fences below are what the records step applies, by script, in this order; it changes no other byte.

1. Item 56's span (your D1): taken as drafted. It is the advisor's wording. Every sentence it replaces was already mine (ADV-2026-11-16-05 and -09), so no word of the human's changes here.
Old:
```
Together they can leave a request refused with the code engine.connections_exhausted. A refused request is never a wrong result. For the first look after an open or an Apply, the code is shown by name. For a tile of the map it is not shown: the map asks again once for a tile it was refused, and if that request is refused too, the tile is not loaded, the code is written to the session log alone, and the status bar never names it: at most it says that some areas were not loaded, or that areas are not drawn to stay within the render budget.
```
New:
```
Together they can leave a request refused with the code engine.connections_exhausted. A refused request is never a wrong result. For the first look, the code is shown by name. For a tile of the map it is not shown: while the view is within its render budget, the map asks again once for a tile it was refused, and if that request is refused too, or the view is over its render budget, the tile is not loaded, the code is written to the session log alone, and the status bar never names it: once the view has finished loading, it says that some areas were not loaded, or that part of this view failed to load when another part also failed, or, over the render budget, that areas are not drawn to stay within the render budget. If the first look's request is granted but its stream fails before you next pan or zoom, the status bar says that the data for the map, or for this view, failed to load, or that part of this view failed to load.
```

2. The last sentence of that span stays (the architect's point (a)). The form's section 10 orders what the status bar says after a failed first look into this span, and item 56 is where a reader looks when the map's data does not arrive.

3. Item 56's comment (your D2), three insertions: taken as drafted, with the id filled in. The second "Not covered" sentence stays (the architect's point (b)): the span's words carry the same gap.
Old:
```
because a refused tile request does not show the code.
```
New:
```
because a refused tile request does not show the code. Since the stream-refusal piece S1, the span from "For the first look, the code" to the end of its sentence on a first look whose stream fails is the advisor's wording, under the delegation of 2026-11-13, ruled in ADV-2026-11-18-15, checked against the code at the head of that piece's branch (by symbol) under its form's §10 (governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md), in place of the words of ADV-2026-11-16-05 and ADV-2026-11-16-09 from there to the span's end.
```
Old:
```
a refused request is never a wrong result because viewport_query in kernel/src/skp.rs returns the engine's error before it mints a ticket.
```
New:
```
a refused request is never a wrong result because viewport_query in kernel/src/skp.rs returns the engine's error before it mints a ticket. Since the stream-refusal piece S1: a refusal while the manager's overBudgetFlag is set is not requeued (the !this.overBudgetFlag term of mintAndStart's requeue test, OPEN-1 (a)) and drops the tile; both of mintAndStart's drop sites, after the requeue declines and when dataPlaneAttach fails, call the manager's onTileDropped, whose one product caller, its handler in candidateArmSession.ts, re-syncs the scan and, when no tile is still tracked, recomputes the status through emitResidencyStatus; settledState reads the view as finished loading only after a plan with no viewport change pending, no tile tracked and no untiled stream running, and a settled view with an entry in failedCoveringTerminals shows SETTLED_PARTIAL_FAILURE_TEXT, which names no code either; the first look's own terminal (§2.2 (b), the untiled sink's onTerminal in issueUntiledQuery) recomputes the status after a plan, whatever its kind, and before any plan a failed one emits SETTLED_PARTIAL_FAILURE_TEXT when a grid frame exists and some of its rows arrived, and otherwise candidate-first-look-failed, which residencyStatusText reads as FIRST_LOOK_FAILED_NO_FRAME_TEXT without a grid frame and FIRST_LOOK_FAILED_TEXT with one. A refused first look on a Colour by refill (the effect in App.tsx that follows previousColourColumn) reaches the canvas strip through reportViewportOutcome as one at open does.
```
Old:
```
that needs a camera change inside the refused request's round trip.
```
New:
```
that needs a camera change inside the refused request's round trip. Not covered (§31c), for the words of the stream-refusal piece S1: an earlier first look whose stream fails after a reissue has started a new one, but before the new one's ticket is minted, is read as current, so its sentence can stand over the new look until the session next emits a status (the comments of FIRST_LOOK_FAILED_NO_FRAME_TEXT and FIRST_LOOK_FAILED_TEXT). Not covered: "within its render budget" is the manager's overBudgetFlag, so an over-budget sentence left standing from the first look while the view is back within budget can show while a refused tile is asked for again.
```

4. The on-main paragraph's comment (your D3): taken, with two changes of mine.
   (a) "except its second and third sentences" becomes "except this paragraph's second and third sentences". After the parenthesis, "its" reads as the sighted paragraph above, which is not the one that changed.
   (b) The list of the requeue test's terms gains `!this.stopped`, which the test has and the draft left out.
Old:
```
(§A R-P; the sighted paragraph above is unchanged).
```
New:
```
(§A R-P; the sighted paragraph above is unchanged), except this paragraph's second and third sentences, which are the advisor's wording, under the delegation of 2026-11-13, ruled in ADV-2026-11-18-09 item 8, with that ruling's New text replaced in its second sentence (the paragraph's third) by ADV-2026-11-18-13 item 4, because the stream-refusal piece S1 changed what the human's two sentences described. Where the code does what those two sentences say, by symbol at the head of that piece's branch: a refused tile query is logged by logMintRefused in mintAndStart's viewportQuery catch (frontends/shell/src/streaming/tileViewportStreamManager.ts); it is asked for again once by the requeue test there, whose terms are the tile's epoch and latestMembership (still in view), !this.stopped, !this.overBudgetFlag (within its render budget), queue.length < MAX_QUEUED_TILES (the queue has room), isRetryableRefusal (RETRYABLE_ENGINE_CODE) and requeuedTiles (once); a tile refused after that retry is dropped and onTileDropped reaches candidateArmSession.ts, whose emitResidencyStatus, once settledState reads the view settled, gives SETTLED_PARTIAL_WITHIN_BUDGET_TEXT (not loaded), SETTLED_PARTIAL_FAILURE_TEXT when failedCoveringTerminals is not empty (part of the view failed to load), and, over budget, the candidate-over-budget sentence, which names the render budget (frontends/shell/src/residency/residencyStatus.ts). The pins below are at the base and describe the paragraph as the human approved it; the code named here by symbol is authoritative for the two sentences as they now read. Not covered: "within its render budget" is the manager's overBudgetFlag, so an over-budget sentence left standing from the first look while the view is back within budget can show while the tile is asked for again.
```

5. Item 4's comment (your D4): taken as drafted.
Old:
```
and every other property of StyleState is a literal in toStyleDocument in the same file.
```
New:
```
and every other property of StyleState is a literal in toStyleDocument in the same file. The end of the sentence that begins "Opening a file also clears", from "and ends Colour by", is the advisor's wording, under the delegation of 2026-11-13, ruled in ADV-2026-11-18-11; where the code does it: admit, the workspace reducer's handler of resource.admitted in frontends/shell/src/workspace/workspaceState.ts, sets the view's fillMatch to null on every open after the first and keeps the other StyleState properties (fillColor, fillOpacity, outlineColor, outlineWidth, frontends/shell/src/style/document.ts).
```

6. Beside these, unchanged: the pair of ADV-2026-11-18-13 item 4 and the pair of ADV-2026-11-18-11 item 2. Eight pairs in one records commit, as you say.

7. At the merge check I compare all eight by script against my files, and I read the architect's filed report for the span's clauses: "For the first look, the code is shown by name" for an Apply, a Clear and a Colour by refill; "once the view has finished loading"; and "before you next pan or zoom".

8. Nothing here needs the human. The digest lists item 1.
