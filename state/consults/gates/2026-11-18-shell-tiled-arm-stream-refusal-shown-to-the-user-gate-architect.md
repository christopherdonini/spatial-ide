Reviewed: PR #330 at 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3 (the custodian's filing note, 2026-11-18: the architect, PLAN node shell-tiled-arm-stream-refusal-shown-to-the-user, S1, the second of its two gates under its form (`governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md`); dispatched at 2026-11-18T11:40:32.221Z by the custodian's transcript, in the background, its prompt naming the brief in the custodian's scratch folder (6715 bytes, sha256 0ea1f7c2a6c41cb596bea550a4429935d6f5855236a2ed280d6f6c6a7b264b05), which had it read the reviewer's report only after its own first five checks; the run 2026-11-18T11:40:38.753Z to 2026-11-18T11:49:58.223Z by its transcript, 49 calls (Read 29, Grep 18, Glob 1, SubagentHandback 1), 2 errored, model claude-opus-5-5; it writes nothing; received at 2026-11-18T11:49:58.223Z by the custodian's transcript; the report below, byte for byte, from its hand-back of 15904 bytes, sha256 90f7dc048c8da4ed2204e0d9c4b2dce8b71048d6e06c371509d3a70774f0d73b, with this note added in its first line and one final newline), gate, architect
Branch: cut/shell-tiled-arm-stream-refusal-s1 @ 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3
Verdict: FAIL

Gaps in my reads:
- I read these whole: the form; ADV-2026-11-16-12, -13 and -15; Part 1 items 1 to 9 of the 2026-11-05 directive; docs/01; the product diff; the four test files' S1 parts; the worker reports 1 and 2; the reviewer's report.
- I did not read ADV-2026-11-16-05, -06, -09 or -10 whole. None of my checks rests on them.
- I read ADR-010 only for rule 5 (staleness is signalled). I read the series report only for its result lines.
- I did not re-read AUTONOMY §22/§31 or the 2026-10-05 directive. I applied them as my brief states them.
- I have no shell. I ran no test and no mutation, and recomputed no hash or count. The probes G330R-SIB, -PRE and -CTL, the mutation results and §7's counts are the reviewer's runs and the worker's, read as evidence.
- I read the commit messages only as their subject lines in the worker reports, not their bodies.

## Findings

### Correctness (blocks)

**C-1, the same as the reviewer's C-1: I concur, by the code.** This is the case where a tile is dropped while a reissued first look (an Apply, a Clear or a Colour by refill) is still running. After that look ends `Completed`, nothing emits a status.
- The drop handler at `frontends/shell/src/residency/candidateArmSession.ts:1063-1066 at F` calls `if (manager.trackedTileCount === 0) emitResidencyStatus();`.
- `currentSettledState` passes `untiledStreamRunning: untiledStreamHandle !== null,` (:713 at F). `settledState` then returns not-settled (`frontends/shell/src/residency/residencyStatus.ts:339-341 at F`).
- `emitResidencyStatus` stays silent on not-settled (:843-848 at F). `standingWithinBudgetComplete` was reset by `reissueUnrestricted` (:1708 at F).
- The untiled terminal's S1 branch is `if (wasCurrent && !wasSelfCancelled && terminal.kind !== "Completed" && !relinquishedReEmitted) {` (:1456 at F). Nothing else emits on `Completed`; only `syncScanLiveness()` runs (:1470 at F), so the scan ends with no status.
- What it breaks: ADV-2026-11-16-13 item 1, byte-copied: "The S1 piece ensures that a tile dropped after a refusal, and a first look whose stream fails, never leave the view without a status, and that the scan ends." Also §3's first claim and ADV-2026-11-16-12 item 3.
- Ordinary use reaches it: a refusal is item 56's case on main, and an Apply followed by a pan during its look is ordinary. It needs no timing inside one round trip, no dev-only switch and no instrumented build.
- The same order with a tile stream that fails (G330R-PRE) gives the same silence.
- Closure: see the drafts, item 1.

### Evidence (blocks)

None.

### Documentation (must fix before the merge; none of D-1, D-3, D-4 or D-5 is the human's wording, so the worker applies the words with no re-gate and the PR body lists them)

- **D-1, the same as the reviewer's D-1: I concur.**
  - Where: `frontends/shell/src/streaming/tileViewportStreamManager.ts:110 at F` ("which settles its status and its scan") and the test comment at `frontends/shell/src/streaming/tileViewportStreamManager.test.ts:1139 at F`.
  - The reviewer's replacement words hold against :1064 and :1065 at F under either closure, so I adopt them as written.
- **D-2, the same as the reviewer's D-2: `KNOWN-LIMITATIONS.md:192` at main 0e4148bf. It is the human's wording** (its :193 comment says so).
  - Clause 2, "asked for again once", omits the new condition `!this.overBudgetFlag` (`tileViewportStreamManager.ts:991 at F`).
  - Clause 3, "still reported as not loaded, in the words above", is false over budget: SR-C and SR-C2 show the over-budget sentence. It is also false in C-1's order until C-1 closes.
  - Draft: the drafts, item 3.
- **D-3 (new). `tileViewportStreamManager.ts:991 at F` overclaims.** It reads `!this.overBudgetFlag && // S1 (OPEN-1 (a)): the held drain would never issue the retry`.
  - The drain is held only while the flag is set (`if (this.overBudgetFlag) return;`, :922 at F).
  - `setOverBudget(false)` re-drains (`if (!overBudget) this.drainQueueIfRoom();`, :503 at F). `handleViewportChange` calls it on every plan (`candidateArmSession.ts:1629 at F`).
  - Replacement comment: `// S1 (OPEN-1 (a)): while over budget the drain is held, so a requeued retry would wait for the next camera change`.
  - Clause check: "the drain is held" is :922. "would wait for the next camera change" is :503, reached only from :1629, since the session's only other caller sets `true` (:1171 at F).
- **D-4 (new). The variant's doc at `residencyStatus.ts:112-113 at F` is untrue in one case.** It reads "the first look failed before any plan and without a row of its own".
  - Branch 3 (`candidateArmSession.ts:1465-1467 at F`) is reached when there is no plan and `!(manager.gridFrame !== null && untiledRowsSeen > 0)`. That covers a frameless look that did deliver rows (rows with no extent).
  - Replacement for :112-113: "The stream-refusal piece S1 (§2.3): the first look failed before any plan, either with no grid frame, or with one and no row of its own. `frame` says whether a grid frame exists, so whether a pan can plan tiles."
  - Clause check: the condition of the else at :1459/:1465 at F.
  - The same applies to the test comment at `residencyStatus.test.ts:583 at F`, "a first look that failed before any row". Replacement: "a first look that failed before any plan, with no frame or with no row of its own".
- **D-5 (new, AUTONOMY §31: a case that needs timing inside one request round trip, named in the source comment).**
  - The case: `reissueUnrestricted` never clears `untiledStreamHandle` (:1675-1743 at F). `issueUntiledQuery` assigns the new handle only after `await viewportQuery` and `await dataPlaneAttach` (:1294-1312 at F).
  - So an earlier look's failure that lands inside that window has `wasCurrent` true (:1348 at F). It emits W1, W2 or the partial-failure sentence after the reissue's `firstLookFailureStanding = false` (:1741 at F) has already run, and sets the flag again (:1467 at F).
  - That status then stands over the new look. The new look's `Completed` terminal does not emit (:1456 at F), and its batches are silent before a plan unless over budget.
  - It needs a stream failure (a fault) and timing inside one round trip, so it does not block.
  - Words to add, as the last line of both constants' comments (after :450 and :456 at F): " * Not covered (AUTONOMY §31), timing inside one request round trip: an earlier first look that fails after a reissue (an Apply, a Clear or a Colour by refill) has started a new one, but before the new one's ticket is minted, is read as current, so this sentence can stand over the new look until the session next emits a status."
  - Clause check: "read as current" is :1294-1312 and :1348. "can stand over the new look" is :1741 before the await, then :1467 and :1456. "until the session next emits a status": any later event replaces it in `nextResidencyStatus`, whose sticky rule covers only `candidate-relinquished` (`residencyStatus.ts:182-187 at F`), and the next fresh plan clears the flag (:1542-1545 at F). "inside one request round trip": the window closes at :1312. If the new mint is refused instead, the earlier look really is the stream feeding the view (:1321 at F), so the sentence is then about the data shown.

### Observation

- **O-1.** The new branch's `!wasSelfCancelled` is implied by `wasCurrent`: `cancelUntiledStream` clears the handle before `skpCancel` (:1273-1279 at F). No mutation can prove it; it is kept as a defensive guard. `!relinquishedReEmitted` has no test or mutation. It guards §5's out-of-scope relinquished case.
- **O-2.** OPEN-1 (a) closes C-order2 as probed: a refusal that arrives while over budget. A retry queued before the budget fills, behind other queued tiles, joins the held queue like any queued tile. That is the existing "stalled" state until the next camera change, not new here.
- **O-3, against the reviewer's O-3.** By the file, `tileViewportStreamManager.test.ts:1192 at F` is inside TM-D3 (:1183-1193), not TM-D1; TM-D1's non-retryable check is :1170. So the reviewer's own failing lines under M-A1 (:1164, :1192) support worker report 2's M-A1 list, which includes TM-D3. The custodian may note this when filing.
- **O-4.** A dropped tile is still never counted as ended in the instrument (no `countTileStreamEndedOnce` in the handler, :1063-1066 at F). This is unchanged from main, as §5 declares; it is for instrumented builds only.
- **O-5.** The reviewer's O-2 (B3's "Filling has finished…" sentence stands through the next fill) is pre-existing in the settled path. I concur.

## Checks

1. **Design against §2 and §8:** holds, apart from C-1.
   - The seam is the manager's `onTileDropped(tileKey)` (`tileViewportStreamManager.ts:161 at F`), called at :1006 and :1035 inside the epoch checks (:973, :1031) and gated by `!this.stopped`. It reaches the session handler (:1063-1066), then App's `onResidencyStatusChange` (App.tsx:1676-1682 at F, unchanged), then `.residency-status` (App.tsx:2422 at F).
   - The seam is written against the real interfaces and proven from the real shape by APP-SR1 and APP-SR2: the real App, session, manager and `SkpCallError` shape (`skp/client.ts:28-33 at F`).
   - The regions touched are the ones §2 names, all in §8's files. App.tsx is untouched.
   - Nothing crosses a docs/02 module or ADR-010 boundary: this is shell control state only, with no wire or protocol change. No ADR-006 class changes. The added work is one synchronous callback and at most one emit per event (docs/01 rule 1, principle 7).
2. **Concurrency and cancellation.**
   - Untiled terminals:
     - current failure: one of three statuses, then the scan ends;
     - `Completed`: no status (C-1 when a plan ran);
     - self-cancelled: nothing, because `wasCurrent` is false by construction;
     - superseded: nothing, except inside D-5's window;
     - session-ended: returns before the branch (:1366-1369);
     - stop: self-cancel, plus App's dataset guard.
   - Tile drops:
     - stale epoch, from a camera change, `clearAll`, `relinquishOutstanding` or `endSession`'s `clearAll`: no callback (TM-D4);
     - stopped: no callback (TM-D4);
     - requeue: no callback (TM-D1);
     - over budget: dropped (TM-D3).
   - Races in one turn:
     - The refusal's catch always runs in a later microtask (`call` is async, `skp/client.ts:48 at F`), so the drop is never nested inside `handleViewportChange`'s suppress window.
     - `relinquishOutstanding`'s epoch bump is synchronous (:822-857 at F), so a refusal after it calls nothing.
     - A pending camera change makes the drop's emit silent, and the plan's trailing emit (:1634 at F) settles it.
   - No order leaves a scan waiting forever except the pre-existing held over-budget queue (O-2). A status for the wrong request can only come from D-5's window.
3. **§3 and §9.**
   - Claim 1 fails in C-1's order. Claims 2 to 4 hold, with D-4's frameless-with-rows case going to W1.
   - W1, "failed to load": branch 3 with `frame` false, when no grid frame exists after `establishFrameFromExtent`.
   - W1, "Open the file again": `AdmissionPanel.tsx:262-263 at F` admits anew, with no same-path guard on success, and the old session stops (App.tsx:1746 at F).
   - W2, "this view failed to load": a frame with `untiledRowsSeen === 0` after the reissue's `clearAllTiles`.
   - W2, "Pan or zoom to retry": the frame survives the reissue, so `onCameraChange` plans; the next plan clears W2 (:1542-1545 at F).
   - Both strings are byte-equal to ADV-2026-11-16-13 item 4's fences (I compared them read against read; the reviewer hashed them).
4. **§4's tests and mutations.**
   - Each assertion fails if its claim is false. M-B3 (`&& false`) and M-RS (the swapped return) are the changes §4 describes.
   - No test covers C-1's order; G330R-SIB and -PRE would.
   - Part 1 item 7 holds: the doubles are typed with the real interface types, and the refusal is the real `SkpCallError` (a faithful mirror of it in the App test).
5. **Records clause (Amendment 1 item 4):** `KNOWN-LIMITATIONS.md:192` is not true at F in clauses 2 and 3 (D-2). The first sentence and "logged" are unchanged by this diff.
6. **The reviewer's findings.**
   - C-1 holds.
   - The design supports (a), and (a) opens no path of the same kind (the drafts, item 1).
   - D-1 holds, and its words are right under both closures. D-2 holds.
7. **Discharge claims and quotes.** The added comments quote nothing as the human's. "copied from the form by script" holds for W1 and W2. "Clause check (§9, in short)" is labelled as a summary. No "done" claim lacks support in the subjects I read. D-3 and D-4 are untrue comment sentences, fixed by words.

## Drafts for the advisor

1. **C-1's closure: I recommend (a), and the design supports it.**
   - The branch's own comment states the rule (:1453-1455 at F, byte-copied): "after one, the existing settled path does".
   - Shape: in the untiled `onTerminal`, under `wasCurrent && !wasSelfCancelled && !relinquishedReEmitted`, call `emitResidencyStatus()` when `hasPlanned`, whatever the terminal's kind. Branches 2 and 3 stay non-`Completed` only.
   - Does (a) open a path of the same kind?
     - A superseded look: no. `wasCurrent` gates it, and inside D-5's window `hasPlanned` was reset by the reissue (:1706 at F), so (a) fires only if a plan also ran inside that same round trip.
     - Twice: no. Only the last of the final tile terminal and the untiled terminal finds the view settled, and neither emit is nested in another call.
     - Overwrites a newer status: no. It recomputes live state. The reducer keeps a relinquished status, the frameless relinquish is excluded by `!relinquishedReEmitted`, and `firstLookFailureStanding` cannot be set in a generation whose current look completed.
   - Region (§8): the first-look node's accept call on `Completed` requires `hasPlanned` false (its draft, `state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md`, §2.1 (vi)), so the two conditions are disjoint. The region needs only your ruling or a form amendment, and that node re-reads its §2.1 when it takes main in (ADV-2026-11-16-13 item 2).
   - A consequence to rule on: (a) also gives a status in the success case (G330R-CTL). I recommend adding that probe as a test beside G330R-SIB and -PRE, so no unclaimed behaviour lands.
   - Room: candidateArmSession.ts is at 38 of 60 lines, and the refusal tests at 448 of 540, so three tests must fit in 92 lines, or it is class 8.
   - (b) would need you to narrow your own item 1.
2. **D-5's words** (above) go into both constants' source comments. They are worker text, but they name a case in your W1 and W2 rulings, for your sight.
3. **`KNOWN-LIMITATIONS.md:192` (the human's wording; the human answers yes, their own words, or accepted as it stands).**
   - I endorse the reviewer's (a) variant word for word.
   - My clause check at F:
     - "while it is still in view, the view is within its render budget and the map's tile queue has room, asked for again once": `tileViewportStreamManager.ts:989-995 at F`, plus `requeuedTiles` for "once" (:993).
     - "reported as not loaded, in the words above": `residencyStatus.ts:442-443 at F`, when the view settles (SR-A1..A4, APP-SR2; under (a) also C-1's order).
     - "names the render budget instead": SR-C and SR-C2.
   - One gap to record in its source comment: "within its render budget" is the manager's flag. A stale over-budget sentence from the first look (A3, in the node's notes) can be showing while the flag is false and the retry runs.
   - If you choose (b), add the reviewer's (b) sentence.

Model: Opus 5.5 (claude-opus-5-5). Files read at F are in `C:/dev/wt/srf`; the reviewer's report is `<S>/g330r-report.md`.
