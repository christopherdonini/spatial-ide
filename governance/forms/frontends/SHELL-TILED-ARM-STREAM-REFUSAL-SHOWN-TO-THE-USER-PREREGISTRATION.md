# shell: on the tiled arm, a refused tile or a failed first look never leaves the view without a status, and the scan ends: case A, case B2 at open and at an Apply, B3, and C-order2's stuck state; full form, both gates

*File: `governance/forms/frontends/SHELL-TILED-ARM-STREAM-REFUSAL-SHOWN-TO-THE-USER-PREREGISTRATION.md`. PLAN node `shell-tiled-arm-stream-refusal-shown-to-the-user` (S1, piece S1).*
*Drafted by the architect (claude-opus-5-5) on 2026-11-16 for the custodian, read only, at main 45e68459cb1a3903d2230f920b4843e8db512c92. The custodian commits it before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, with both gates from dispatch (ADV-2026-11-16-06 item 2 (a): what the user is told, and a new seam).*
*Code starts when §14 OPEN-A is settled and §8's check of PR B's diff stat is recorded.*

## §0 Disclosure

**0.1 Authority.**
- ADV-2026-11-16-13, which rules this form's packet: `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-13-the-s1-stream-refusal-piece-packet-ruled-open-1-a-the-two-sentences-as-drafted.md`. What it rules, in my words:
  - the cut, with B2 and B3 in this piece;
  - S1 goes first;
  - OPEN-1 is (a);
  - W1 and W2 as drafted, as the advisor's wording under the delegation;
  - the app's existing sentences unchanged;
  - B1 out, and no naming;
  - the test stops and APP-SR2;
  - the series;
  - no line of `App.tsx`.
- ADV-2026-11-16-12, which ordered the form drafted now and cut small, and placed it: `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-12-the-stream-refusal-node-s1-after-its-test-step-the-architect-drafts-its-form-now-cut-small.md`, items 1 to 7.
- ADV-2026-11-16-05, item 4 (d) and (e): `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-05-known-limitations-item-56-tile-refusal-record-corrected-now-the-stream-refusal-node-s2-slot-2.md`.
- ADV-2026-11-16-09, items 6 and 7: `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-09-known-limitations-item-56-words-after-the-reviewers-gate-c1-stands-four-pairs-the-partly-loaded-words-not-added.md`.
- ADV-2026-11-16-06, items 2 (a) and 4: `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-06-the-humans-directive-of-2026-11-16-put-in-force-focus-record-classes-runs-pieces-models-the-two-drafts-the-held-dispatches-go.md`.
- ADV-2026-11-16-10, item 1 (c): `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-10-the-reopen-r1-to-r4-five-pieces-p3-split-producers-ahead-pre-committed-a-later-runs-reopen-does-not-bind-adr-036-amendment-3.md`.

ADV-2026-11-16-12 item 3's first sentence, byte-copied: "The S1 piece does one thing: no refusal and no failure leaves the view without a status, and the scan state ends, so that Cancel does not stay up."

**0.2 Evidence, not Authority.**
- The test step's report: `state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-test-step-tester-report.md`. It covers cases A1, A2, A3, A4, A-control, C, C-order2, B1, B1-apply, B2 and B2-apply.
- The probe that report ran, `<S>/srp/streamRefusalProbe.test.ts`. It is untracked and read for what it does; it is not Authority.
- The architect's packet draft for this form, filed by the custodian at `state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-form-draft-architect.md`.
- The reopen's step-2 read and its supplement: `state/consults/2026-11-16-b2-piece-1c-save-and-reopen-step-2-declaration-read-architect.md` and `state/consults/2026-11-16-b2-piece-1c-save-and-reopen-step-2-declaration-supplement-architect.md`.
- The first-look node's draft form: `state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md`, its §2.1 (iii), §3 and F2.

**0.3 Hashes.** None in this form; its drafter had no shell. References are by path and symbol.

## §1 The defects, from the records

Every case below is on the candidate (tiled) arm, which is `DEFAULT_RESIDENCY_ARM` in `residency/residencyArm.ts`. Each was observed by the test step (§0.2) at main.

- **A (A1, A2, A4).** The only tracked tile is refused twice with `engine.connections_exhausted`, so `mintAndStart` drops it. No call goes back to the session. Nothing is emitted, the bar says nothing, and App's scan state stays `issuing`, so Cancel stays up.
- **A3.** As A, while a stale over-budget sentence from the first look stands. It keeps standing, and the scan stays `issuing`.
- **B2 at open.** The first look's stream ends `ProducerFailed` or `TransportFailed` after its ticket and before any batch. The scan resets, but nothing is emitted. No grid frame exists, so a pan issues nothing and the map stays empty with no status.
- **B2-apply.** The same failure on an Apply's first look. The frame survives the Apply, so a pan does re-plan, but nothing is said.
- **B3, predicted by reading, not probed.** A first look that fails after some rows and before any plan. `settledState` reads not-settled while `hasPlanned` is false, so nothing is emitted.
- **C-order2.** A tile is refused while the view is over budget. It is requeued, but `drainQueueIfRoom` returns while `overBudgetFlag` is set, so it is never asked for. One tile stays tracked and one queued, and the scan stays `issuing`.

## §2 The change

### 2.1 The tile manager (`frontends/shell/src/streaming/tileViewportStreamManager.ts`)

- **A new option.** The manager's options interface gains an optional `onTileDropped?: (tileKey: string) => void`. Its doc names its one product caller, the candidate session (§2.2 (a)).
- **Where it is called.** At the two drop sites in `mintAndStart`:
  - the viewport-query catch's drop, after the bounded requeue declines;
  - the `dataPlaneAttach` catch.
  At each site it is called after `drainQueueIfRoom()`, only when the tile's epoch still matches and `!this.stopped`.
- **The requeue while over budget (OPEN-1 (a)).** The bounded requeue's condition gains `!this.overBudgetFlag`. A refusal while the view is over budget drops the tile instead of queuing a retry that the held drain never issues. The next camera change plans that tile afresh.
- **Unchanged:** the session-ended refusal route, `logMintRefused`, `RETRYABLE_ENGINE_CODE`, `MAX_QUEUED_TILES` and the instrument counts.

### 2.2 The candidate session (`frontends/shell/src/residency/candidateArmSession.ts`)

**(a) The manager's `onTileDropped`.** The session subscribes it in the manager's construction, beside `onTerminal`:
- it calls `syncScanLiveness()`, then `emitResidencyStatus()` when `manager.trackedTileCount === 0`;
- it records nothing into `failedCoveringTerminals`, so case A reads as A-control does;
- it calls no `canvas.clearTile`. `onTileSuperseded(tileKey, null)` is not reused, because its handler clears the tile's features.

**(b) The first look's failure.** The branch sits in `issueUntiledQuery`'s sink `onTerminal`, after the M-1 relinquished re-emit and before `syncScanLiveness()`. It runs only when all of these hold:
- the terminal is current (`wasCurrent`);
- it is not self-cancelled;
- its kind is not `Completed`;
- the M-1 re-emit did not run on this terminal.

A session-ended terminal returns earlier, as today. When the branch runs, it does the first of these that applies:
1. If `hasPlanned`, it calls `emitResidencyStatus()`, the existing path.
2. Else, if `manager.gridFrame !== null` and `untiledRowsSeen > 0`, it emits `{ kind: "candidate-within-budget", residentFeatureCount, settled: "partial-failure" }`, which reads `SETTLED_PARTIAL_FAILURE_TEXT` (B3).
3. Else, it emits `{ kind: "candidate-first-look-failed", frame: manager.gridFrame !== null }` and sets a new session flag, `firstLookFailureStanding = true`.

**(c) The fresh plan.** In `handleViewportChange`'s fresh-plan block, beside the `relinquishClearPending` clear: if `firstLookFailureStanding` is set, it is consumed and `{ kind: "candidate-fill-progress" }` is emitted. So "Pan or zoom to retry" does not stand through the fill it started.

**(d) `reissueUnrestricted`.** It sets `firstLookFailureStanding = false` beside its existing `query-issued`.

### 2.3 The status (`frontends/shell/src/residency/residencyStatus.ts`)

- `ResidencyStatus` and `ResidencyStatusEvent` each gain the variant `{ kind: "candidate-first-look-failed"; frame: boolean }`.
- `nextResidencyStatus` returns it. The variant is not under the sticky relinquished refusal, which names only the two budget events.
- `query-issued`, `dataset-changed`, `delivery-complete` and `candidate-fill-progress` still reduce to null.
- `residencyStatusText` reads:
  - `FIRST_LOOK_FAILED_NO_FRAME_TEXT` (W1, §9) when `frame` is false;
  - `FIRST_LOOK_FAILED_TEXT` (W2, §9) when it is true.
  Each constant carries its clause check (§9) and §3's not-covered case in its source comment.

### 2.4 `App.tsx`: unchanged

App already carries the new variant to the status bar, along `onResidencyStatusChange` → `setResidencyStatus(nextResidencyStatus(event, current))` → the `status.residency` slot's `residencyStatusText(residencyStatus)`. If the worker needs any line of `App.tsx`, it stops (§11).

### 2.5 Boundaries

- The control plane only. Nothing touches the engine, the kernel, `protocol/` or the wire.
- No operation class changes (ADR-006). Every operation stays cancellable, and no new blocking path is added (docs/01).
- The seam (§2.1 to §2.2 (a)) is written against the session's real use, and the App test (§4, APP-SR1) proves it from the real shape: the real `App`, the real session and the real manager, with only the transport, the canvas and the publish panel mocked.

## §3 What may and may not be claimed

**May be claimed, at the head, by the tests in §4:**
- When the last tracked tile is dropped after a refusal, or after a failed `dataPlaneAttach`, the status bar settles to one of the app's existing sentences and the scan ends.
- A first look that fails before any plan leaves one of three sentences:
  - W1 without a frame;
  - W2 with a frame and no row of this look;
  - `SETTLED_PARTIAL_FAILURE_TEXT` with rows.
- In each of those three, the scan ends.
- A tile refused while the view is over budget is not requeued, and the scan ends when the view settles.

**May not be claimed:**
- That the status bar names a refused tile's code or a first look's failure. That is S2, and no naming is in this piece (OPEN-5 of the packet, ruled).
- That the reason given for a refused tile while over budget is the true one. The bar then gives the render budget, as main does for case C; that is S2.
- B1 (§5).
- Any docs/08 measurement.
- macOS or Linux.
- That an e2e run reproduces a refusal or a failed first look. Ordinary use cannot force either without a fault injector, which would be a dev-only switch. This is named in W1's and W2's source comment (AUTONOMY §31).

## §4 Tests, and their mutations

All are declared here, before any code. Each new test that is not a control is observed failing at the base, at a branch commit named by its commit id, before its code.

**`frontends/shell/src/residency/candidateArmSession.refusal.test.ts` (new).** It uses the probe's harness:
- `vi.mock("../skp/client", async (importOriginal) => ...)`, which keeps the real `SkpCallError`;
- mocks for `streaming/dataPlaneClient`, `streaming/adapterWs`, the instruments and the session log;
- the real `startCandidateArmSession`, with status folded through `nextResidencyStatus` and scan events through App's `nextScanState`.

It is a new file because `candidateArmSession.test.ts`'s client mock drops `SkpCallError`, and that file stays unchanged.

| ID | Asserts | Fails on main because | Mutation, and the test it fails |
|---|---|---|---|
| SR-A1 | the only tracked tile, refused twice: the last status event is `candidate-within-budget` with `settled: "partial"`; the text is `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`; the scan events end `{kind:"reset"}`; the scan state is `idle` | no event; scan `issuing` | M-A1: remove the manager's `onTileDropped` call at the viewport-query drop (SR-A1, SR-A2, SR-A4, TM-D1) |
| SR-A2 | three tiles, the refused one last tracked: as SR-A1 | as SR-A1 | M-A2: remove the session handler's `emitResidencyStatus()` (the text stays null) |
| SR-A3 | after a stale over-budget sentence: the text becomes `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`; the scan is `idle` | the over-budget sentence stays; scan `issuing` | M-A3: remove the handler's `syncScanLiveness()` (scan stays `issuing`) |
| SR-A4 | after a settled view, a pan to one tile refused twice: as SR-A1 | as SR-A1 | M-A1 |
| SR-A-control | control: the probe's A-control, unchanged | passes by design | none |
| SR-C | control: the probe's C, its text and the scan `idle`, unchanged | passes by design; S2's case | none |
| SR-C2 | the probe's C-order2: after 0:1 completes, `trackedTileCount` 0, `queuedCount` 0, scan `idle`; the text is the over-budget base sentence followed by `SETTLED_PARTIAL_SUFFIX` | tracked 1, queued 1, `issuing` | M-C2: remove `!this.overBudgetFlag` from the requeue condition (SR-C2, TM-D3) |
| SR-B2-open | `it.each` over `ProducerFailed` and `TransportFailed`: the last status event is `{kind:"candidate-first-look-failed",frame:false}`; the text is W1; the scan is `idle`; a pan adds no query and the text still reads W1 | no event; text null | M-B2a: drop §2.2 (b)'s emit of the failed variant (SR-B2-open, SR-B2-apply, APP-SR1); M-B2b: emit `frame: true` always (the text reads W2) |
| SR-B2-apply | the probe's B2-apply: the text is W2 after the failure; after a pan the events start `{kind:"candidate-fill-progress"}` and the text is null during the fill | text null | M-B2c: remove §2.2 (c)'s clear (W2 stands through the fill) |
| SR-B3 | a first look failing after rows, before any plan: the text is `SETTLED_PARTIAL_FAILURE_TEXT`; the scan is `idle` | predicted by reading: no event | M-B3: take branch 3 whatever `untiledRowsSeen` is (the text reads W2) |
| SR-B-guard | a self-cancelled, a session-ended and a superseded first-look terminal each emit no `candidate-first-look-failed` | predicted by reading: passes on main (a guard) | M-BG: drop the `wasCurrent` condition (the superseded terminal emits) |
| SR-A-scan | asserted only if APP-SR2 does not fit (§4 note): the scan's reset event at the drop, on SR-A1's setup | as SR-A1 | M-A3 |

**`frontends/shell/src/streaming/tileViewportStreamManager.test.ts`.** Its existing mocks, the transport only.

| ID | Asserts | Fails on main because | Mutation |
|---|---|---|---|
| TM-D1 | `onTileDropped` is called once with the key, after the second refusal and after a non-retryable refusal, and not on the requeue | no such call | M-A1 |
| TM-D2 | a `dataPlaneAttach` failure drops the tile and calls `onTileDropped` once | no such call | M-D2: remove the call in the `dataPlaneAttach` catch |
| TM-D3 | a retryable refusal while over budget is dropped, not queued (`queuedCount` 0), and calls `onTileDropped` once | main requeues it | M-C2 |
| TM-D4 | control: a stale-epoch refusal and a stopped manager's refusal call no `onTileDropped` | passes on main | M-D4: remove `!this.stopped` at the call (the stopped case calls it) |

**`frontends/shell/src/residency/residencyStatus.test.ts`.**

| ID | Asserts | Fails on main because | Mutation |
|---|---|---|---|
| RS-F1 | `candidate-first-look-failed` reduces to its status; the text is W1 with `frame: false` and W2 with `frame: true`; `query-issued` and `candidate-fill-progress` each clear it | the event kind does not exist | M-RS: swap the two constants |

**`frontends/shell/src/App.streamFailure.test.tsx` (new).** The App status slot, the seam's end-to-end test from the real shape.
- The harness is `App.table.test.tsx`'s:
  - mocks for `./skp/client` (with a `SkpCallError` class), `./skp/events`, `./streaming/dataPlaneClient`, `./streaming/adapterWs` (keeping each sink), the baseline `./streaming/viewportStreamManager`, `./publish/PublishPanel` and `./canvas/WorkingCanvas`, the last with the tile handle methods App.table's mock lists;
  - the real `App` and the real candidate session.
- `setResidencyArm` is not called, so the arm is `DEFAULT_RESIDENCY_ARM`, `"candidate"`.
- Each test opens through the `openPath` hook the other App tests use.

| ID | Asserts | Fails on main because | Mutation |
|---|---|---|---|
| APP-SR1 | at open, after the first look's sink reports `{kind:"ProducerFailed",detail:"engine.stream_failed"}` before any batch: `.residency-status` reads W1, and `.filter-cancel` and `.scan-liveness` are absent | `.residency-status` is null | M-B2a |
| APP-SR2 | case A through the real App: after the last tracked tile is refused twice, `.residency-status` reads `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` and `.filter-cancel` is absent | no status; Cancel shown | M-A1 |

**Notes on the tests:**
- **APP-SR2's size.** It is added if it fits in about 80 lines (ADV-2026-11-16-13). If it does not, the worker records why in its report and in the closing amendment, and SR-A-scan asserts the scan's reset.
- **Existing suites that stay green, unchanged:**
  - `tileViewportStreamManager.test.ts`: the refusal and retry; refused twice with no spin; the `filter_too_long` drop; the non-`SkpCallError` drop; the `MAX_QUEUED_TILES` drop;
  - `candidateArmSession.test.ts`: the settled, partial, partial-failure, relinquished and M-1 paths;
  - `residencyStatus.test.ts`;
  - `App.lateResult.test.tsx`'s `.residency-status` cases.
- **Observing mutations.** Each mutation is applied by hand, the named tests run and their failure recorded, then reverted. The reviewer re-applies each one by Bash. A `verify-mutation` run, if one is made, is recorded as a check of the mutation's text, never as its observation. A test-text span on the branch is named with its commit id and never pinned by hash at a branch commit.

## §5 Predictions, unchanged items, invalidators

**Predictions:**
- P-base: at the base with the test files added, every test in §4 that is not a control fails as its row says. The controls (SR-A-control, SR-C, TM-D4) and SR-B-guard pass.
- P-head: every test in §4 passes.
- P-A3: under §2.2 (a), the drop's emit runs with `manager.overBudget` false. Settled and not fill-complete, the text is `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT`. This is my derivation, asserted by SR-A3.

**Declared unchanged:**
- every existing vitest test;
- every e2e suite named in §12;
- `App.tsx`;
- the instrument counts;
- the status sentences that already exist.

**Invalidators.** Each stops the worker and goes to the advisor; nothing is adjusted (ADV-2026-11-16-13):
- I1: a test predicted to fail at the base passes there (in particular SR-A3, SR-B3, or a non-control case).
- I2: a test predicted to pass at the base fails there (SR-B-guard, or a control).
- I3: P-A3 does not hold at the head.
- I4: a failure seen in a shared e2e run that depends on timing. It is recorded as such, run again in a later hold, and not counted.

**Falsification.** A failure of any §4 test at the head is the fix failing, recorded as seen.

**Out of scope:**
- S2: naming the code for a tile, and the render budget given as a refused tile's reason (case C, and A while over budget).
- B1: the first look refused at the call. The code is shown by name at the time; its silence after Dismiss goes to the node's notes.
- Naming the first look's failure kind or detail.
- A3's earlier stale over-budget sentence mid-fill, before the drop: the first look's over-budget sentence stands through a plan that cleared `overBudget`. Node's notes.
- A first-look failure while a relinquished status stands: the M-1 re-emit keeps the relinquished sentence.
- The queue-full requeue case (ADV-2026-11-16-09 item 6), which stays in the node's notes.
- `App.tsx`, `WorkingCanvas.tsx`, the engine, the kernel and `protocol/`.

## §6 The instrument

None. The probe (§0.2) does not land. Its harness shape is rewritten as §4's committed test file.

## §7 Steps, files, ceilings, budget

**Steps.** S1 is the custodian's; S2 to S7 are the worker's.
- S1: this form is committed on main, OPEN-A is settled, and §8's diff-stat check is recorded.
- S2: a branch from the base (the main commit named in the report). Commit the four test files with no product change. Run vitest and record P-base with the commit id.
- S3: the product commit, in the three files of §2.
- S4: vitest at the head. Record P-head, then observe every mutation of §4.
- S5: the series of §12 at the final candidate.
- S6: the report, then both gates.
- S7, after the gates: the records step (§10).
- Nothing after S3 is committed before S2's record exists.

**Files and ceilings.** Insertions plus deletions, comments counted, by `git diff --numstat <base>...HEAD -- frontends/shell`.

| Group | File | Ceiling |
|---|---|---|
| product | `frontends/shell/src/streaming/tileViewportStreamManager.ts` | 25 |
| product | `frontends/shell/src/residency/candidateArmSession.ts` | 60 |
| product | `frontends/shell/src/residency/residencyStatus.ts` | 35 |
| unit | `frontends/shell/src/residency/candidateArmSession.refusal.test.ts` (new) | 540 |
| unit | `frontends/shell/src/streaming/tileViewportStreamManager.test.ts` | 110 |
| unit | `frontends/shell/src/residency/residencyStatus.test.ts` | 50 |
| unit | `frontends/shell/src/App.streamFailure.test.tsx` (new) | 310 |

- Product total: 120. Unit total: 1,010. Total: 1,130.
- The records step (§10) edits `KNOWN-LIMITATIONS.md` and is counted apart.
- An overrun is class 8 (`docs/PREREGISTRATION-TEMPLATE.md`, Round 25 additions), and §7 is not edited to match.
- A file outside this table is class 9, declared by amendment before any of its code.

**Budget:** 300 minutes of work. This is my estimate, not a measurement.

| Work | Minutes |
|---|---|
| product | 50 |
| session refusal tests | 100 |
| manager and status tests | 40 |
| App tests | 50 |
| runs and mutations | 30 |
| report | 30 |

- The series' wall time and the waits for a hold are stamped and reported separately.
- PLAN's `budget_minutes` is the custodian's to set.

## §8 Regions and order

**PR B's correction** (`b1-shell-half`, at 2f7047737f64d9ca8a7a06332672ab9b3d25c9bc).
- The correction's production files are `StylePanel.tsx`, `categoryCases.ts`, `workspaceState.ts`, `App.tsx`, `surfaceRegistry.ts` and `tableSource.ts`. None is a §7 file.
- Every file under `frontends/shell/src/residency/`, and `tileViewportStreamManager.ts`, has the same line count in both trees.
- PR B's `App.tsx` regions (`colourColumns`, `handleAdmitted`'s `lastCommittedStyle` reset, `handleStyleCommit`, the colour-column effect, the Style slot) are not edited here. This piece edits no line of `App.tsx`.
- One semantic adjacency. PR B's colour-column effect issues a `reissueUnrestricted` first look, so W2 and B3's sentence also cover a first look a Colour by refill issues. Both clause checks hold there, because the frame survives a reissue.
- **Before S2,** the custodian records `git diff --stat 08ce9935...2f704773` and checks that it names no §7 file. If it names one, the worker does not start and the regions go back to the advisor.

**`open-first-look-fills-fit-view`.**
- Overlap by symbol: `issueUntiledQuery`'s sink `onTerminal`. Its accept call is §2.1 of its draft, under condition (iii), `Completed` only. This piece's branch is non-`Completed` only.
- Adjacency: `handleViewportChange`'s plan path.
- This piece goes first (ADV-2026-11-16-12 item 6; ADV-2026-11-16-13). The first-look node takes main in before its gate (ADV-2026-11-16-06 item 4), and re-reads its F2, since after this piece a failed first look speaks.

**The reopen's P4.**
- P4's files, per the step-2 read §3, include none of §7's files.
- Its `App.tsx` regions come from a real diff after PR B merges (ADV-2026-11-16-10 item 1 (c)), and this piece edits no line of `App.tsx`.
- If P4 adds a second path that admits a file, P4's form checks W1's clause "Open the file again to retry" against that path.
- P1 and P2 of the reopen share no file with this piece.

**Slot rule.** No file under `protocol/`.

## §9 Strings

New strings that the app shows: two, W1 and W2. They are the advisor's wording under the delegation (ADV-2026-11-16-13), not the human's. The worker applies them byte for byte and rewords nothing. Both gates check each clause against the built code. Both join `operator-sitting-queue` at the merge.

**W1**, `FIRST_LOOK_FAILED_NO_FRAME_TEXT`:

```
The data for the map failed to load. Open the file again to retry.
```

Clause check, to be re-made by both gates at the head:
- "The data for the map failed to load": §2.2 (b)'s branch 3 with `frame` false. The first look's terminal is current, not self-cancelled, not session-ended and not `Completed`. `manager.gridFrame` is null after `establishFrameFromExtent`, so nothing is drawn.
- "Open the file again to retry": opening the file again admits it anew. The old session is stopped and a new one starts a new first look (`App.selection.test.tsx`, RB-S1).
- Not said: that a pan retries, which is false here.

**W2**, `FIRST_LOOK_FAILED_TEXT`:

```
The data for this view failed to load. Pan or zoom to retry.
```

Clause check:
- "The data for this view failed to load": branch 3 with `frame` true and `untiledRowsSeen === 0`.
- "Pan or zoom to retry": the frame exists, so `onCameraChange` plans tiles (the probe's B2-apply: one query after a pan).
- The sentence does not stand through that fill: §2.2 (c) clears it.

**Not covered (AUTONOMY §31).** No e2e reaches either sentence without a fault injector, which is a dev-only switch. This is recorded in both constants' source comment.

**Existing sentences, used unchanged:**
- `SETTLED_PARTIAL_WITHIN_BUDGET_TEXT` (case A, A3);
- `SETTLED_PARTIAL_FAILURE_TEXT` (B3);
- the over-budget base sentence with `SETTLED_PARTIAL_SUFFIX` (A while over budget, C-order2).

Their clause checks are in the packet draft (§0.2), part (3).

**Measurements.** None claimed (docs/08). The added work per drop or per first-look terminal is one callback and at most one emit.

## §10 Records

The records step runs after both gates, and after PR 328 merges with ADV-2026-11-16-09's words: `KNOWN-LIMITATIONS.md` item 56 is one physical line, so the two go in turns.
- **Item 56's span (ADV-2026-11-16-05 item 4 (e); ADV-2026-11-16-12 item 7).** The records drafter drafts it from the built code. It covers:
  - what the status bar says after a dropped tile and after a failed first look;
  - the restatement of the map's "asks again once" for a tile refused while the view is over the render budget (OPEN-1 (a), ADV-2026-11-16-13).
  The comment's "Where the code does this" gains `onTileDropped` and §2.2 (b), by symbol. The words go to the advisor.
- **The fallback.** If this piece is not on main when the release's records are written, ADV-2026-11-16-12 item 7's sentence applies instead, with its words to the advisor.
- **The node's notes.** The custodian adds §5's out-of-scope items: B1 after Dismiss, A3's mid-fill staleness, the relinquished case, and S2.
- **`operator-sitting-queue`.** W1 and W2 join it at the merge.

## §11 Block on sight

1. Any line of `App.tsx`. The worker stops.
2. A string the app shows other than W1 and W2, or either one reworded.
3. A file outside §7 without a class 9 amendment before its code.
4. Any change to `candidateArmSession.test.ts`'s client mock.
5. A new option, export or code path with no product caller (`onTileDropped`'s caller lands in the same diff).
6. `onTileDropped` carrying more than `tileKey`: that is S2's.
7. A refusal code or failure detail shown to the user (S2).
8. `canvas.clearTile` in the drop handler, or `onTileSuperseded` reused for a drop.
9. A test outcome or prediction changed after a run has been seen.
10. A record that calls a verify-mutation run an observation, or a test-text span on the branch pinned by hash at a branch commit or named without its commit id.
11. The product commit before S2's record.
12. Any file under `protocol/`, the engine or the kernel.

## §12 Gates

**The architect and the reviewer from dispatch** (ADV-2026-11-16-06 item 2 (a)). Verdicts follow AUTONOMY §22, and a Documentation finding is must-fix before the merge. Both gates:
- check each clause of W1 and W2 against the built code;
- check the seam against §2.5;
- check the regions against §8.

**The series at the final candidate** (ADV-2026-11-16-13), one series. Each heavy command runs inside a shared hold of the machine script, and nothing filed names another project.
- In `frontends/shell`, after the fresh-worktree setup (both `npm ci`), `npm run verify`. It runs `tsc --noEmit`, the static checks and every vitest suite.
- "lint": `frontends/shell/package.json` has no `lint` script. OPEN-A settles what stands for it.
- The e2e suites `regression` (`npm run e2e:regression`), `residency-harness` (`npm run e2e:residency-harness`), `filter` (`npm run e2e:filter`), and `e2e/pan-anchor.mjs` and `e2e/source-changed.mjs` by `node`, on the dev build and the port the custodian names.
- The repository's CI `node --test` scripts suite, and the cite, quote and plan checks.

**The reviewer, at the final head:**
- recomputes §7's counts;
- re-applies every §4 mutation by Bash and records each failure;
- records a timing-dependent failure in a shared run as such (§5 I4).

## §13 Heavy runs

Builds, vitest and every e2e suite in §12 each run inside a shared hold. The machine paragraph goes into the worker's, the tester's and the reviewer's briefs as written.

## §14 Open items

| OPEN | Subject | Red line | Options | Recommendation |
|---|---|---|---|---|
| A | what stands for "lint" in §12's series: `frontends/shell/package.json` has no `lint` script | no | (A) `npm run verify`'s static checks (`tsc --noEmit`, the dev-origin, origin-event, ADR-index and dist checks) stand for it; (B) a lint script is added (class 9, outside this piece's scope) | (A) |

The packet's OPEN-1 to OPEN-5 are settled by ADV-2026-11-16-13 (§0.1). The custodian records the settlement of OPEN-A here by amendment.

## §15 Amendments (opens empty; append-only)

## Amendment 1: OPEN-A settled and the unit-test ceiling kept (ADV-2026-11-16-15); §8's check recorded; one records-step item; recorded by the custodian before any code

*Written by the custodian on 2026-11-16. The ruling is filed at `state/directives/2026-11-16-advisor-ruling-adv-2026-11-16-15-the-s1-form-open-a-npm-run-verify-whole-stands-for-lint-the-unit-ceiling-of-1010-stands.md`.*

1. **OPEN-A (§14): (A).** What ADV-2026-11-16-13 item 8 (c) called lint is `npm run verify` whole, once, at the final candidate: its type check, its four static checks, its build and its tests. No lint script is added. §12's series reads so.

2. **§7's unit-test ceiling stands**: 1,010, with product 120 in three files and 1,130 in all (ADV-2026-11-16-15 item 2). An overrun is class 8.

3. **§8's check, made by the custodian before S2.** No §7 file is named by `git diff --name-only 08ce9935...2f7047737f64d9ca8a7a06332672ab9b3d25c9bc` (195 paths), nor by PR B's own paths at its present head, `git diff --name-only 619a7cc94c6ac89768ca6d68d40ea9afff0c2a7b...6f95993e37255513bf7f5d78b519bc3a71562fb0` (57 paths). The worker starts.

4. **One records-step item for §10** (the advisor's message of 2026-11-16, after the clause check of the v0.1.0 notes, `state/consults/2026-11-16-shell-tiled-arm-stream-refusal-shown-to-the-user-v0-1-0-notes-clause-check-reviewer.md`). The on-main paragraph of `KNOWN-LIMITATIONS.md` below the row-filter paragraph says that an area whose tile is refused after the retry is still reported as not loaded. The clause check and the test step's A1 and A2 show that untrue on main today. It stays untrue until this piece merges; the records step checks it against the built code then, and its words go to the advisor.

Read the last amendment first.

Nothing above is edited.

## Amendment 2: C-1 of both gates closed by closure (a) under ADV-2026-11-18-09; the Completed terminal after a plan moves to this piece; the success case claimed; three tests; one correction by worker-high; the gates' second attempts and the runs; the on-main paragraph's words for the records step; recorded by the custodian before the correction's code

*Written by the custodian on 2026-11-18, after both gates' first attempts were seen and before the correction's code, under the advisor's ruling ADV-2026-11-18-09, filed at `state/directives/2026-11-18-advisor-ruling-adv-2026-11-18-09-s1-takes-the-fix-the-completed-terminal-after-a-plan-moves-to-s1-the-success-case-claimed-the-on-main-words.md`. The gate reports are `state/consults/gates/2026-11-18-shell-tiled-arm-stream-refusal-shown-to-the-user-gate-reviewer.md` (gate-log row 770) and `state/consults/gates/2026-11-18-shell-tiled-arm-stream-refusal-shown-to-the-user-gate-architect.md` (row 772). References only.*

1. **The finding.** Both gates ended FAIL at 00bead7749ac7fd91708d2fb31ec96e5a1e4c2c3 on one Correctness finding, C-1. The architect concurs with the reviewer's C-1. A tile dropped while an Apply's first look still runs leaves the view with no status once that look ends `Completed`, though the scan ends. §3's first claim does not hold in that order, and ADV-2026-11-16-13 item 1 is not met without the fix.

2. **The fix (the ruling's item 2).** In the untiled sink's `onTerminal`, under the guards this piece's branch already has, the status is recomputed after a plan whatever the terminal's kind. Those guards are: the terminal is current, it is not self-cancelled, and it does not follow a relinquish's re-emit. The branches for a first look that fails before any plan stay non-`Completed` only. The shape is the first of the architect's drafts for the advisor; where the filed report gives a different shape, the report's stands.

3. **The region (item 3).**
   - The current first look's `Completed` terminal after a plan moves to this piece.
   - `open-first-look-fills-fit-view` keeps the `Completed` terminal where no plan has run.
   - §8's sentence that this piece's branch is non-`Completed` only is corrected to read: this piece's branch takes a non-`Completed` terminal, or any terminal after a plan; the first-look node's accept call takes a `Completed` terminal with no plan.
   - The first-look node reads its own region again when it takes main in, as §8 asks.

4. **The success case, a claim of this piece (item 4).** §3's claims gain one: after an Apply and a pan during its first look, a load that ends well shows its settled status. Before this piece the status stayed empty there, as the reviewer's probe G330R-CTL showed at 00bead77.

5. **Three tests (item 5).** Each asserts the status the view settles to, and each has its own mutation, observed failing:
   - the reviewer's probe G330R-SIB: a tile is refused twice during an Apply's first look, then the look ends `Completed`;
   - the reviewer's probe G330R-PRE: the same order, with the tile's stream ending `ProducerFailed`;
   - the success case of item 4.

   §7's ceilings stand as Amendment 1 item 2 keeps them. Any excess is a class 8 row in the closing, and no more.

6. **One correction, by worker-high (item 6).** Its ground: the order in which the terminals of streams that run side by side arrive, in the session's state. It carries the reviewer's D-1, and the architect's D-3, D-4 and D-5, in the words their reports give. Nothing else changes.

7. **After the correction (item 7).**
   - Both gates make second attempts, each limited to C-1's fix and what it adds (Part 1 item 6 of the directive of 2026-11-05).
   - At the corrected head, `npm run verify` runs whole and the series' five app-window suites run once more, because the fix is in the session's status path.

8. **The records step (items 8 and 9).**
   - Amendment 1 item 4's on-main paragraph takes the old and new pair of ADV-2026-11-18-09 item 8. That pair is the advisor's wording under the delegation.
   - It is applied by script after both gates, and no other byte of the paragraph changes.
   - The gates' second attempts check the new text's clauses at the corrected head.
   - The paragraph's source comment lines, and item 56's span (§10), go to the advisor after the gates.

Nothing above is edited.
