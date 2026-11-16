# shell-tiled-arm-stream-refusal-shown-to-the-user: the S1 piece's full form, drafted for the advisor's packet ruling (ADV-2026-11-16-12 items 2 to 5); the architect's draft

*Filed by the custodian from the hand-back: 27917 bytes, sha256 5c10060e6ca3c88312c41f6508cc0ba1864206a94284f2d35e0384b29a54e949, claude-opus-5-5, 87 calls by its transcript. Byte for byte below the rule. Not a gate; read only. Its question 8 on residency/ and the tile manager: the custodian's git diff between main at 619a7cc9 and PR B's head 6f95993e over those paths is empty.*

---

Drafted: shell-tiled-arm-stream-refusal-shown-to-the-user, full form, architect · reviewed main @ 45e68459cb1a3903d2230f920b4843e8db512c92 (and PR B's worktree C:/dev/wt/m4b at 2f7047737f64d9ca8a7a06332672ab9b3d25c9bc, read only). Verdict: not a gate. This is a form draft, with no Correctness or Evidence finding against main's records.
OPEN items for the advisor: 5

I have no shell, so this report gives no sha256 for anything. Line numbers are at 45e68459 unless I say otherwise, and they serve to locate code only. Symbols are the reference. Everything below is in my own words, except where it is marked byte-copied.

## (1) The cut, and whether S2 parts

S2 parts cleanly.

S1 adds no string to the tile path and no field to any tile status. It feeds the session's existing settled classification:
- `emitResidencyStatus` → `currentSettledState` → `settledState`;
- after that, the existing `residencyStatusText` sentences.

S2 would need three things S1 does not:
- a refusal record as a new `settledState` input;
- the code carried into a status variant;
- new P6 words.

S1's drop callback carries only `tileKey`. S2 widens it when S2 has a caller for the code, which respects the seam rule (no parameter without a product caller). C needs nothing from S1: on main it already settles and resets.

Cost of the parting. Between S1 and S2, a tile refused while it is the last one tracked and the view is over budget will show C's sentence: the over-budget base sentence plus `SETTLED_PARTIAL_SUFFIX`. Main shows that sentence for C today. Each clause of it is true of the budget state. What it lacks is the refused tile, which is exactly what S2 adds. S1 makes no sentence untrue that main does not already show.

What A3's stale sentence becomes. At the drop, the session now emits. `manager.overBudget` is false there (the probe's A3 asserts `r.state.overBudget` false), so the within-budget path runs. Settled and not fill-complete → `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`, the same as A-control. This is a prediction from reading; test SR-A3 asserts it.

A separate staleness stays out of scope and should be recorded in the node's notes. The probe's A3 shows it: after a pan, the first look's over-budget sentence still stands while the tile is tracked (`before.text` is the over-budget text with `trackedTileCount` 1). The plan's own `emitResidencyStatus` does not clear it.

## (2) B2's home and the order

**Home: this piece.** The first-look node cannot reach B2 as drafted:
- In `state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md`, §2.1's condition (iii) is a `Completed` terminal.
- Its §3 says a failed first look stays as it is today.
- Its F2 says that after a non-`Completed` first look no plan runs and the settled status cannot speak.

So ADV-2026-11-16-06 item 1 (c)'s question is answered no, and B2 needs a code path the first-look node does not add. B2-apply is the same branch with a grid frame present, so it lands here too.

**Order: S1 first, then the first-look node.**
- Both edit `issueUntiledQuery`'s sink `onTerminal` (lines 1328-1442):
  - the first-look node inserts its accept call after the frame and partial-mark block (1408-1421) and before the M-1 re-emit (1437-1440);
  - S1 inserts its failure branch after the M-1 re-emit and before `syncScanLiveness` (1441).
- That is an overlap by symbol under ADV-2026-11-16-06 item 4, so the two go in turns.
- S1 is S1, `ready`, and placed ahead by ADV-2026-11-16-12 item 6. The first-look node is `blocked` on `b1-shell-half` (PR B).
- The two branches are exclusive by terminal kind (`Completed` against non-`Completed`), so the first-look node's re-derivation after taking main in is mechanical.
- Its F2 then needs re-reading: after S1, a failed first look does speak.

## (3) The strings, with clause checks

Case A (A1, A2, A4), and A3 under S1: `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` (residencyStatus.ts), unchanged. Clause check:
- "Filling has finished for this view": the emit runs only when `manager.trackedTileCount === 0`, and `settledState` returns settled only with no tracked tile, no pending change and no untiled stream. True.
- "some areas were not loaded": the dropped tile is not complete in the candidate set, so `isFillComplete` is false. True.
- "pan or zoom to load them": the dropped tile is not resident. `tileState` was deleted at the drop, so the next `onCameraChange` that covers it plans it again (A-control's path). True.

Case A while over budget: C's existing sentence (see (1)). Its budget-as-reason is S2's.

C-order2 under OPEN-1 (a): the same over-budget settled sentence, once 0:1 completes. Under (b): the over-budget base plus `STALLED_SUFFIX`. Both are existing sentences.

B3, predicted by reading and not probed. B3 is a first look that fails after some rows with a grid frame present, with no plan run yet (`hasPlanned` false), so main says nothing (`settledState` is not-settled). It takes `SETTLED_PARTIAL_FAILURE_TEXT`, unchanged, emitted as `candidate-within-budget` with `settled: "partial-failure"`. Clause check:
- "Filling has finished for this view": the first look ended and nothing is tracked. True.
- "but part of this view failed to load": rows were admitted (`untiledRowsSeen > 0`) and the stream failed. True.
- "pan or zoom to retry": a frame exists, so `onCameraChange` plans tiles (B2-apply shows one query after a pan). True.

B2 at open (no frame): no existing sentence is true.
- `SETTLED_PARTIAL_FAILURE_TEXT`: "part" is false (nothing loaded), and "pan or zoom to retry" is false, because with no frame a pan issues nothing (the probe's B2: `viewportQueryCallsAdded` 0).
- `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`: "pan or zoom" is false for the same reason.
- My draft words are W1, OPEN-2.

B2-apply (frame present, no row of this look): no existing sentence is true. "part" is false, because the reissue's `manager.clearAll()` cleared the tiles and no row of this look arrived. My draft words are W2, OPEN-3.

W1, my draft words (not the human's): "The data for the map failed to load. Open the file again to retry." Clause check:
- "The data for the map failed to load": the branch's condition. The terminal is current (`wasCurrent`), not self-cancelled (`wasSelfCancelled` false), not session-ended (that returns earlier), and not `Completed`. `manager.gridFrame` is null after `establishFrameFromExtent`, so nothing is drawn. True.
- "Open the file again to retry": opening the file again admits it anew (`handleAdmitted`), which stops the old session and starts a new session with a new first look (App.selection.test.tsx's RB-S1). True.
- Not said: that a pan retries. That would be false.

W2, my draft words (not the human's): "The data for this view failed to load. Pan or zoom to retry." Clause check:
- "The data for this view failed to load": the same condition, with a frame present and `untiledRowsSeen === 0`. True.
- "Pan or zoom to retry": the frame survived (the probe's B2-apply: `gridFrameEstablished` true, one query after a pan). True.
- The sentence does not stand during the fill: the fresh plan clears it (see (6), Change 2 (c)).

The app's open control reads "Open GeoParquet…" (AdmissionPanel.tsx). No string the app shows says "reopen", so W1 says "open the file again".

## (4) Regions against the three, by symbol

S1's product symbols:
- tileViewportStreamManager.ts: the options interface; `mintAndStart`'s viewport-query catch (the requeue condition and the drop, lines 981-998) and its `dataPlaneAttach` catch (1022-1026).
- candidateArmSession.ts:
  - the manager construction's options (922-1062), with a new `onTileDropped` beside `onTerminal`;
  - `issueUntiledQuery`'s sink `onTerminal`;
  - `handleViewportChange`'s fresh-plan block (1492-1510);
  - `reissueUnrestricted` (1640-1708);
  - one new `let` beside `relinquishClearPending`.
- residencyStatus.ts: `ResidencyStatus`, `ResidencyStatusEvent`, `nextResidencyStatus`, `residencyStatusText`, and two new constants beside `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`.
- There is no App.tsx product edit.

**Against PR B's correction at 2f704773.**
- residency/ and the tile manager:
  - every file in `frontends/shell/src/residency/` has the same line count in both trees: candidateArmSession.ts 1839, residencyStatus.ts 481, candidateArmSession.test.ts 3775, residencyStatus.test.ts 580;
  - tileViewportStreamManager.ts has 1120 in both;
  - the correction's list (Amendments 25 items 3 to 5, and 26) names none of them. No overlap.
  - Reading cannot prove byte identity; the custodian's `git diff --stat 08ce9935...2f704773` settles it.
- App.tsx: the worktree has 2594 lines against main's 2563. The PR B regions I read are:
  - the `colourColumns` memo (856);
  - `handleAdmitted`'s `lastCommittedStyle` reset (1167-1169);
  - `handleStyleCommit` (2044-2052);
  - the colour-column effect (2054-2064);
  - the Style slot's new props (2505).
  - The step-2 read §4 lists PR B's other App regions at 6f7e744c.
  - S1 edits no App.tsx line. It reads the status slot `status.residency` (2418-2431 on main), which PR B shifts but does not change: its JSX at the worktree's line 2449 is the same expression.
- One semantic adjacency. PR B's colour-column effect calls `issueQueryRef.current(null, null, filter)`, which is a `reissueUnrestricted` first look. So W2 and the B3 sentence also cover a first look that a Colour by refill issues. Both clause checks hold there, because the frame survives a reissue.
- Result: clear of PR B by reading. ADV-2026-11-16-12 item 6's start condition holds once the diff stat confirms it.

**Against `open-first-look-fills-fit-view`.**
- Its draft's files are candidateArmSession.ts (ceiling 70) and WorkingCanvas.tsx (30), plus tests. Its §2.6 and §11 forbid App.tsx, residencyStatus.ts, the manager and the constants.
- Overlap:
  - `issueUntiledQuery`'s sink `onTerminal`, as in (2);
  - an adjacency in the session's plan path: its accept function sets `pendingViewportChange` and calls `debounced.call`, and S1's clear sits in `handleViewportChange`'s fresh-plan block.
- In turns, S1 first. The later piece takes main in before its gate (ADV-2026-11-16-06 item 4).
- The KL form (`KNOWN-LIMITATIONS-FIRST-LOOK-PARTIAL-VIEW-PREREGISTRATION.md`, item 64) is a separate physical line from item 56. No overlap.

**Against the reopen's P4.**
- P4's files, from the step-2 read §3 and the supplement:
  - `project/openProject.ts`, the question and re-link components, AdmissionPanel.tsx and admitDataset.ts;
  - App.tsx and WorkingCanvas.tsx;
  - `style/document.ts`, `skp/{types,client}.ts` and surfaceRegistry.ts;
  - perhaps StudioLayout.tsx, actionRegistry.ts and StylePanel.tsx;
  - `e2e/project.mjs` and `e2e/lib.mjs`.
- None is S1's. No overlap by file.
- What reading cannot settle:
  - P4's App regions come from a real diff after PR B merges (ADV-2026-11-16-10 item 1 (c)), and S1 does not edit App;
  - whether P4's reopen adds a second path that admits a file. If it does, W1's "Open the file again" stays true only if that path also builds a new session. P4's form should check W1 against that path.

## (5) The tests, with their mutations

All tests are declared before code, and each is observed failing on main before its code. Controls are marked.

**New file `frontends/shell/src/residency/candidateArmSession.refusal.test.ts`.** It uses the probe's harness (`<S>/srp/streamRefusalProbe.test.ts`):
- `vi.mock("../skp/client", async (importOriginal) => ...)`, so the real `SkpCallError` is kept;
- the same mocks for `dataPlaneClient`, `adapterWs`, the instruments and the log;
- the real `startCandidateArmSession`, with status folded through `nextResidencyStatus` and scan state through App's `nextScanState`.

It is a new file because candidateArmSession.test.ts's factory (`vi.mock("../skp/client", () => ({ viewportQuery, cancel }))`) drops `SkpCallError`, and that harness stays unchanged.

| Test | Assertion | Why it fails on main | Mutation that fails it |
|---|---|---|---|
| SR-A1: "SR-A1: the only tracked tile, refused twice, settles the bar to the within-budget partial sentence and ends the scan" | after the second refusal, the last status is `{kind:"candidate-within-budget",settled:"partial"}`; the text is `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`; the scan events end with `{kind:"reset"}`; the scan state is `idle` | statusEvents `[]`, text null, scan `issuing` (probe A1) | M-A1: remove the manager's `onTileDropped` call at the drop (995-997) |
| SR-A2: "SR-A2: three tiles, the refused one the last tracked, settles and ends the scan" | as SR-A1 | probe A2 | M-A2: remove the session handler's `emitResidencyStatus()` (text stays null) |
| SR-A3: "SR-A3: a stale over-budget sentence is replaced by the within-budget partial sentence when the last tracked tile is dropped" | the text is `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` and the scan is `idle` | probe A3: the over-budget text stays, scan `issuing` | M-A3: remove the handler's `syncScanLiveness()` (scan stays `issuing`) |
| SR-A4: "SR-A4: after a settled view, a pan to one tile refused twice settles partial, not silent" | as SR-A1 | probe A4: text null, scan `issuing` | M-A1 |
| SR-A-control (control): the probe's A-control | unchanged | passes on main by design | none |
| SR-C (control): the probe's C | C's text and scan `idle`, unchanged | passes on main; S2's case | none |
| SR-C2: "SR-C2: a refusal while the view is over budget leaves no tile tracked and the scan ends when the view settles" (OPEN-1 (a)) | after 0:1 completes, `trackedTileCount` 0, `queuedCount` 0, scan `idle`, text is the over-budget base + `SETTLED_PARTIAL_SUFFIX` | probe C-order2: tracked 1, queued 1, `issuing` | M-C2: remove `!this.overBudgetFlag` from the requeue condition |
| SR-B2-open (it.each ProducerFailed and TransportFailed): "SR-B2 (%s): a first look failing before any batch at open shows the open-again sentence and ends the scan" | the last status event is `{kind:"candidate-first-look-failed",frame:false}`; the text is W1; the scan is `idle`; a pan adds 0 queries and the text still reads W1 | probe B2: `afterFailure.statusEvents` `[]`, text null | M-B2a: drop the new branch's emit; M-B2b: hard-code `frame: true` (the text reads W2) |
| SR-B2-apply: "SR-B2-apply: an Apply's first look failing before any batch shows the pan-to-retry sentence; the next plan clears it" | after the failure, the text is W2; after a pan, the status events start with `{kind:"candidate-fill-progress"}` and the text is null during the fill | probe B2-apply: `afterFailureText` null | M-B2c: remove the fresh-plan clear (W2 stands during the fill); M-B2b |
| SR-B3: "SR-B3: a first look failing after some rows, before any plan, settles to the partial-failure sentence" | the text is `SETTLED_PARTIAL_FAILURE_TEXT`; scan `idle` | by reading: `settledState` is not-settled while `hasPlanned` is false, so nothing is emitted | M-B3: emit the no-rows variant whatever `untiledRowsSeen` is (the text reads W2) |
| SR-B-guard: "SR-B-guard: a self-cancelled, session-ended or superseded first-look terminal emits no failure status" | no `candidate-first-look-failed` event in any of the three | passes on main (a guard, not a case). Declared as a control | M-BG: drop the `wasCurrent` condition (the superseded terminal emits) |

**`frontends/shell/src/streaming/tileViewportStreamManager.test.ts`, with its existing transport-only mocks.**

| Test | Assertion | Why it fails on main | Mutation that fails it |
|---|---|---|---|
| TM-D1: "TM-D1: onTileDropped is called once with the tile key when a tile is dropped after its second refusal or on a non-retryable refusal, and not on a requeue" | the calls equal `[tileKey]` | no such option is called | M-A1 |
| TM-D2: "TM-D2: a dataPlaneAttach failure drops the tile and calls onTileDropped" | as TM-D1 | as TM-D1 | M-D2: remove the call at 1022-1026 |
| TM-D3: "TM-D3: a retryable refusal while over budget is dropped, not queued, and calls onTileDropped" | `queuedCount` 0, one call | main requeues it | M-C2 |
| TM-D4: "TM-D4: a stale-epoch or stopped manager's refusal calls no onTileDropped" (control) | zero calls | passes on main | M-D4: remove the `!this.stopped` check at the call |

**`frontends/shell/src/residency/residencyStatus.test.ts`.**
- RS-F1: "RS-F1: candidate-first-look-failed reduces to its status and reads W1 without a frame and W2 with one; query-issued and candidate-fill-progress clear it". It fails on main because the event kind does not exist (the reducer falls through to `undefined`).
- Mutation: swap the two constants.

**The App status-slot test: new file `frontends/shell/src/App.streamFailure.test.tsx`.** This is the seam's end-to-end test from the real shape.
- Harness: App.table.test.tsx's, with real `App` and the real candidate session.
  - Mocks: `./skp/client` (with a `SkpCallError` class), `./skp/events`, `./streaming/dataPlaneClient`, `./streaming/adapterWs` (keeping each sink), the baseline `./streaming/viewportStreamManager`, `./publish/PublishPanel`, and `./canvas/WorkingCanvas` with the tile handle methods App.table's mock already lists.
  - `setResidencyArm` is not called, so `DEFAULT_RESIDENCY_ARM` is `"candidate"`.
- APP-SR1: "APP-SR1: at open, a first look that fails before any batch shows W1 in the status bar and no Cancel".
  - It opens through the `openPath` hook the other App tests use, then calls `onTerminal({kind:"ProducerFailed",detail:"engine.stream_failed"})` on the first look's sink.
  - It asserts that `.residency-status` has text W1 and that `.filter-cancel` and `.scan-liveness` are absent.
  - It fails on main because `.residency-status` is null.
  - Mutation: M-B2a.
- Case A is not driven through App. It needs a grid frame and a tile plan through the mocked canvas, and the session-level SR tests cover it. If the worker finds that App can drive it cheaply, it adds APP-SR2 by class 9 before code.

**What the existing suites already cover:**
- tileViewportStreamManager.test.ts: the refusal and its retry; refused twice, with no spin and `trackedTileCount` 0; the `filter_too_long` drop; the non-`SkpCallError` drop; the `MAX_QUEUED_TILES` drop. These must stay green, and the first three gain no assertion change.
- candidateArmSession.test.ts: the settled, partial, partial-failure, relinquished and M-1 paths (stay green).
- residencyStatus.test.ts: the existing texts (stay green).
- App.lateResult.test.tsx: `.residency-status` through a mocked session (stays green).

Mutations are applied by the worker and observed failing, then re-applied by the reviewer by Bash. A record of them calls them observed runs at a named commit, never a `verify-mutation` observation.

## (6) The form whole

**Heading.** shell: the tiled arm's refusals and failed first looks never leave the view without a status, and the scan ends: case A, case B2 at open and at an Apply, and C-order2's stuck state (S1). Full form, both gates.

**§1 Authority** (by reference):
- ADV-2026-11-16-12 items 1 to 7;
- ADV-2026-11-16-05 item 4 (d) and (e);
- ADV-2026-11-16-09 items 6 and 7;
- ADV-2026-11-16-06 items 2 (a) and 4;
- ADV-2026-11-16-10 item 1 (c);
- the tester's report `state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-test-step-tester-report.md`;
- the PLAN node.

ADV-2026-11-16-12 item 3, byte-copied: "The S1 piece does one thing: no refusal and no failure leaves the view without a status, and the scan state ends, so that Cancel does not stay up."

**§2 Change.**
1. **Manager** (tileViewportStreamManager.ts):
   - a new optional option `onTileDropped?: (tileKey: string) => void` in the options interface, with a doc naming its one product caller, the candidate session;
   - it is called after `drainQueueIfRoom()` at the two drop sites (the viewport-query catch's drop and the `dataPlaneAttach` catch), only when the epoch matches and `!this.stopped`;
   - under OPEN-1 (a), the requeue condition gains `!this.overBudgetFlag`.
2. **Session** (candidateArmSession.ts):
   - (a) It subscribes `onTileDropped: () => { syncScanLiveness(); if (manager.trackedTileCount === 0) emitResidencyStatus(); }`.
     - It records nothing into `failedCoveringTerminals`, so A reads as A-control does.
     - It calls no `canvas.clearTile` and does not reuse `onTileSuperseded(tileKey, null)`. That handler clears the tile's features, which would drop a partly loaded tile.
     - The instrument counts (`countTileStreamEndedOnce`) are unchanged.
   - (b) In `issueUntiledQuery`'s sink `onTerminal`, after the M-1 re-emit and before `syncScanLiveness`, the branch runs when `wasCurrent && !wasSelfCancelled && terminal.kind !== "Completed"` and the M-1 re-emit did not run:
     - if `hasPlanned`: `emitResidencyStatus()`, the existing path;
     - else, with a frame and `untiledRowsSeen > 0`: `candidate-within-budget` with `settled: "partial-failure"`;
     - else: `{kind:"candidate-first-look-failed", frame: manager.gridFrame !== null}`, and the flag `firstLookFailureStanding = true` is set.
   - (c) `handleViewportChange`'s fresh-plan block: if `firstLookFailureStanding`, it is consumed and `candidate-fill-progress` is emitted, in the `relinquishClearPending` pattern.
   - (d) `reissueUnrestricted` resets the flag beside its `query-issued`.
3. **Status** (residencyStatus.ts):
   - a `ResidencyStatus` variant and a `ResidencyStatusEvent` variant `candidate-first-look-failed` `{frame: boolean}`;
   - a `nextResidencyStatus` case, not under the sticky refusal;
   - a `residencyStatusText` case reading `FIRST_LOOK_FAILED_NO_FRAME_TEXT` (W1) or `FIRST_LOOK_FAILED_TEXT` (W2), both constants carrying their clause-check comment.
4. **App.tsx: unchanged.** The existing `onResidencyStatusChange` → `setResidencyStatus(nextResidencyStatus(...))` → `status.residency` slot carries the new variant.

**§3 Scope and ceilings (lines added plus removed).**

| File | Ceiling (lines) |
|---|---|
| tileViewportStreamManager.ts | 25 |
| candidateArmSession.ts | 60 |
| residencyStatus.ts | 35 |
| **Product total** | **120** |
| candidateArmSession.refusal.test.ts (new) | 520 |
| tileViewportStreamManager.test.ts | 110 |
| residencyStatus.test.ts | 50 |
| App.streamFailure.test.tsx (new) | 230 |
| **Tests total** | **910** |
| **Total** | **1,030** |

- Records: KNOWN-LIMITATIONS.md item 56's line and its comment (§6), counted apart.
- A file past its ceiling is class 8. A file not listed is class 9, declared before its code.

**§4 Tests and mutations:** as in (5).

**§5 Out of scope:**
- S2: naming the code for a tile, and the render budget given as a refused tile's reason (A3's budget clause and C).
- B1 (OPEN-4).
- Naming the first look's failure kind or detail (OPEN-5).
- A3's mid-fill stale over-budget sentence.
- A first-look failure while a relinquished status stands (the M-1 re-emit covers it with the relinquished sentence).
- The queue-full requeue (ADV-2026-11-16-09 item 6; stays recorded in the node's notes).
- The instrument counts.
- App.tsx, WorkingCanvas.tsx, the engine, the kernel and protocol/.

**§6 The records.** After the code:
- PR 328 merges first, with ADV-2026-11-16-09's words; item 56 is one physical line.
- The records drafter then drafts item 56's span from the code (ADV-2026-11-16-05 item 4 (e); ADV-2026-11-16-12 item 7):
  - the status bar's sentences after a dropped tile and after a failed first look;
  - under OPEN-1 (a), that the map does not ask again for a tile refused while the view is over the render budget;
  - the comment's "Where the code does this" gains `onTileDropped` and the new branch, by symbol.
- The words go to the advisor.
- If S1 is not on main when the release records are written, ADV-2026-11-16-12 item 7's fallback sentence applies instead.
- The node's notes gain the out-of-scope items of §5.

**§7 Stop rules.** The worker stops and reports if:
- a declared failing test passes on main before its code;
- SR-A3's or SR-B3's prediction is not met;
- the handler needs more than `tileKey`;
- App.tsx, candidateArmSession.test.ts's mock factory or any unlisted file needs an edit (class 9 first);
- the App test cannot drive the real session with the listed mocks;
- any new string beyond W1 and W2 appears;
- `git diff --stat` against PR B shows a shared file.

**§8 Gates:**
- the architect and the reviewer, full class (ADV-2026-11-16-06 2 (a): what the user is told, and a new seam);
- the tester's series: shell `vitest` (every suite), `tsc`, and lint;
- no e2e. Ordinary use cannot force a refusal or a failed first look without a fault injector, which would be a dev-only switch, so the App test is the end-to-end proof from the real shape. Name it in the source comment of W1 and W2 (§31).

**§9 Order:**
1. Packet ruled.
2. PR B's diff stat read.
3. Tests first, observed failing at the base.
4. The code.
5. The mutations.
6. The series and both gates.
7. PR 328 merged.
8. The records step.
9. The first-look node takes main in.

## (7) OPEN items

- **OPEN-1: C-order2.**
  - (a) [recommended]: no requeue while `overBudgetFlag` is set. The tile is dropped, the scan ends once the view settles, and the next camera change plans it fresh. Today the drain is held and it is never asked for anyway.
  - (b): keep the requeue and emit after it, so `STALLED_SUFFIX` shows. Cancel then stays up, as it does in any designed stall, which departs from item 3's "scan state ends".
  - Not offered: letting the drain issue the retry while over budget, because that loads past the budget.
- **OPEN-2: W1's words** (B2 at open). Recommended: as drafted in (3), with its clause check. They are my words, not the human's.
- **OPEN-3: W2's words** (B2-apply and a Colour by refill's first look). Recommended: as drafted in (3). They are my words, not the human's.
- **OPEN-4: B1** (the first look refused at the call). Recommended: out of S1. The code is shown by name at the time (`viewportRefusal`), and B1 is not in item 3's list. Record the silence after Dismiss in the node's notes. Taking it in needs a generation guard in `issueUntiledQuery`'s catch, excluding session-ended refusals, and a string.
- **OPEN-5: whether W1 and W2 name the failure** (the terminal kind or detail). Recommended: no, not in S1. Naming is designed once in S2, for the tile and the first look together (ADV-2026-11-16-05 item 4 (d)'s "by name"). Under the owner rule, W1 and W2 state the view's consequence and quote no engine text.

## (8) What I could not settle

- Byte identity of residency/ and the tile manager between main and 2f704773 (I compared line counts only). The custodian reads the diff stat.
- P4's App regions and any second admit path: these wait for the real diff after PR B merges.
- SR-A3, SR-B3 and SR-B-guard's outcomes on main are predictions from reading.
- Whether App can drive case A cheaply (APP-SR2).
- No sha256 anywhere, because I have no shell.
- Ceilings are estimates.
- The figures of ADV-2026-11-16-12 item 9 (merge days) are not mine to give.

Files read (absolute):
- C:/dev/spatial-ide/frontends/shell/src/residency/candidateArmSession.ts
- C:/dev/spatial-ide/frontends/shell/src/residency/residencyStatus.ts
- C:/dev/spatial-ide/frontends/shell/src/streaming/tileViewportStreamManager.ts
- C:/dev/spatial-ide/frontends/shell/src/App.tsx
- C:/dev/spatial-ide/frontends/shell/src/App.table.test.tsx
- C:/dev/wt/m4b/frontends/shell/src/App.tsx
- C:/dev/spatial-ide/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-4-PREREGISTRATION.md
- C:/dev/spatial-ide/state/consults/2026-11-16-b2-piece-1c-save-and-reopen-step-2-declaration-read-architect.md
- C:/dev/spatial-ide/state/consults/2026-11-16-b2-piece-1c-save-and-reopen-step-2-declaration-supplement-architect.md
- C:/dev/spatial-ide/state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md
- C:/dev/spatial-ide/KNOWN-LIMITATIONS.md
- the probe `<S>/srp/streamRefusalProbe.test.ts`
