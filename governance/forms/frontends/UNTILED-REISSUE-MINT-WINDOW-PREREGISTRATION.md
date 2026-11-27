# shell: an untiled look is read as current only while no later reissue has begun, and a look minted after a later reissue began is cancelled and never started; full form, both gates

*File (proposed): `governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md`. PLAN node `untiled-reissue-holds-earlier-look-handle-until-mint`.*
*Drafted by the architect (claude-opus-5-5) on the custodian's brief. Read only, in a detached worktree at main 08783d073376686eba767d5a65bb89675bd40b38. The custodian commits it as its own commit, before any code.*
*Append-only once committed. Self-references are by section, amendment and item, never by line.*
*Form: full, both gates from dispatch. The grounds are ADV-2026-11-19-17 item 3, and ADV-2026-11-16-06 item 2 (a) for the class (concurrency and cancellation; what the user is told about the state of their data).*

## §0 Disclosure

**0.1 Authority.** The advisor's rulings, made under the delegation of 2026-11-13. None of them is the human's words. Each is filed under `state/directives/` by its id, and each is paraphrased here:
- ADV-2026-11-19-17, items 1 to 4: what the probe shows, the grade (serious in kind, rare in reach), and the placement (full form, both gates, the strongest model, because of the session's state machine and timing). Item 3 names both effects of the window: the S1 effect (ADV-2026-11-18-13 item 6) and the plan effect.
- ADV-2026-11-21-15 item 1: until v0.2 is tagged, this piece is built and gated on its branch, and its merge request waits for the tag or for the human's word. Item 4 (ii): the piece is placed second among the product pieces, and limitation 68 stays until the piece merges.
- ADV-2026-11-22-11 item 2, last bullet: the piece is built and gated now, and its merge request waits for the tag. Item 3: no merge of code that ships in the app, and no lockfile change, before the tag. The cap stays as it is.
- ADV-2026-11-16-06 item 2 (a): the class.

**0.2 Evidence, not Authority.**
- The reviewer's probe: `state/consults/gates/2026-11-19-open-first-look-fills-fit-view-gate-reviewer.md`, its check 7, lines A to D, and its D3. The probe was a unit test with events put in order by hand. It was reverted and never committed.
- `KNOWN-LIMITATIONS.md` item 68 and its comment, which names each clause's code by symbol.

**0.3 The reuse index.** Byte-copied from the custodian's brief, marked so. It is `tools/reuse.mjs` in the read-only reuse clone at 89bbac37, run by the custodian on 2026-11-22, exit 1. The brief is not tracked, so this is evidence, not Authority.

```text
No prior art recorded for "stale terminal after reissue". Research it before planning an implementation.
```

The search missed. In this repository the prior art is `ViewportStreamManager.requestViewport` (`frontends/shell/src/streaming/viewportStreamManager.ts`). It claims a generation before any await, and it cancels a ticket minted after a newer call, returning `superseded`.

**0.4 Cites.** Every cite is by file and symbol. A line range is a reading aid at 08783d07, and no line range is pinned by hash. At dispatch, the tree at the dispatch base is authoritative, and stop I1 checks it.

**0.5 Not read by this form.**
- Whether the kernel can answer two `viewport_query` calls out of order. Baseline treats that as possible: it has two generation checks.
- The e2e suites' step lists.
- ADV-2026-11-18-13 item 6, which is cited through ADV-2026-11-19-17 and not read whole.

## §1 What this may and may not claim

**May claim:**
- After a reissue has begun (`reissueUnrestricted` passed its session-ended check), a batch or terminal of any earlier untiled look is not read as current, whether it arrives before or after the new look's ticket is minted. Its batch is not ingested. Its terminal plans nothing, emits no status and records no failure.
- When a later reissue began before an untiled look's ticket and attach returned, that look's ticket is cancelled through the existing `cancel`. No stream is started for it, and its promise resolves `{ kind: "superseded" }`.
- Through App's `applyFilter`, a superseded Apply commits no filter and resets no fit.

**May not claim:**
- That anything was seen in the app window, before or after the fix. The window needs timing inside one request round trip.
- How long the window lasts.
- That the earlier look's stream is cancelled. Once minted, it runs to its own terminal server-side, as it does today after the mint.
- That an orphan's terminal does nothing at all. `establishFrameFromExtent` still runs for it, unchanged (OPEN-3).
- That a Cancel between a reissue and its mint stops the new look. `relinquishFill` reaches only the handle the session holds, as today.
- That a refusal of a superseded mint is handled differently from today. It still rejects into the earlier caller's refusal path.
- Any performance number, any docs/08 row, any wire change, or any change to an ADR.

**ADRs cited, none amended:** ADR-006 (no operation is added and no class changes), ADR-018 (the cancel vocabulary) and ADR-010 (no constant is added).

## §2 The change

### 2.1 The interfaces it is written against (read at 08783d07)
- **The transport.** `StreamSink` in `frontends/shell/src/streaming/transport.ts` has `onOpen`, `onBatch(payload, contiguous)`, `onProgress` and `onTerminal(terminal)`. The session passes its sink to `startStream({ url, subprotocols, ticketHandle, sink })` (`streaming/adapterWs`).
- **The client.** `viewportQuery` in `frontends/shell/src/skp/client.ts` resolves `{ stream }`. `cancel` is imported in the session as `skpCancel`. `dataPlaneAttach` lives in `streaming/dataPlaneClient`.
- **The canvas.** `WorkingCanvasHandle.shownViewportBbox`, `pushTileBatch`, `applyTileViewportContext` and `resetFitForNewGeneration` (`frontends/shell/src/canvas/WorkingCanvas.tsx`; the type at lines 151–156, the implementation at lines 1652–1664).
- **App's consumer.** `RequestOutcome` (`viewportStreamManager.ts`, lines 79–87) already has `superseded`.
  - `applyFilter` (`frontends/shell/src/App.tsx`, lines 358–400) commits the filter and resets the fit only on `issued`. Any other outcome returns `not-applied`.
  - `issueQueryRef` is bound to `session.reissueUnrestricted` (line 1801).
  - Other callers: the open's first look (line 1834), the Colour-by refill effect (lines 2140–2147) and `changeClauses` (lines 2154–2174), whose `not-applied` shows `CLAUSE_NOT_APPLIED_LINE` (`filter/ClauseCards.tsx`).
  - `reportViewportOutcome` treats every resolved outcome alike.

### 2.2 Before (`frontends/shell/src/residency/candidateArmSession.ts`)
- `reissueUnrestricted` (lines 1718–1787) records `currentFilter`, clears everything (`hasPlanned = false`, `latestUnionedExtent = null`, and the rest) and calls `issueUntiledQuery`. It neither cancels the earlier look nor clears `untiledStreamHandle`.
- `issueUntiledQuery` (lines 1292–1521) assigns `untiledStreamHandle = stream` only after `viewportQuery` and `dataPlaneAttach` have returned (line 1322).
- In the sink:
  - `onBatch` drops a batch only when `untiledStreamHandle !== stream` (line 1331);
  - `onTerminal` reads `wasCurrent = untiledStreamHandle === stream` (line 1358);
  - S1's block (lines 1472–1485) and the first-look block (lines 1497–1512) are gated on `wasCurrent`.
- So inside the mint window the earlier look is current:
  - its batches are ingested after the clear, under its own filter;
  - a failed terminal emits S1's status;
  - a Completed terminal plans `shownViewportBbox` under the new `currentFilter` and sets `hasPlanned`, so the new look's terminal plans nothing (KNOWN-LIMITATIONS item 68).
- Two "Not covered (AUTONOMY §31)" notes name the window (lines 1468–1471 and 1491–1496).
- A look minted after a later reissue is still assigned to the handle. If two mints resolve out of order, the earlier look's handle wins.

### 2.3 After (one file of product code)
1. **A field `untiledLookGeneration`** (a number, closure-local, starting at 0), with a doc comment. Its only writer is item 2.
2. **`reissueUnrestricted`** adds 1 to it straight after its `sessionEnded` check, before `currentFilter = filter`.
3. **`issueUntiledQuery`**:
   - its first line captures `const lookGeneration = untiledLookGeneration`, before any await;
   - after the existing `sessionEnded` check that follows `dataPlaneAttach`, and before `untiledStreamHandle = stream`, it adds this: if `lookGeneration !== untiledLookGeneration`, `await skpCancel(stream).catch(() => {})` and return `{ kind: "superseded" }`. This is the order baseline uses: the latch first, then the generation.
4. **The sink.** `onBatch` returns when `untiledStreamHandle !== stream || lookGeneration !== untiledLookGeneration`. `onTerminal`'s `wasCurrent` becomes `untiledStreamHandle === stream && lookGeneration === untiledLookGeneration`.
5. **Unchanged:**
   - the handle-clear on the next line (`if (untiledStreamHandle === stream) untiledStreamHandle = null`), so scan liveness and `relinquishFill` inside the window are as today;
   - `isSessionEndedTerminal`'s ungated routing;
   - the `establishFrameFromExtent` call (OPEN-3);
   - the superseded log line.
6. **Comments** (the worker's words; §2.4):
   - the two "Not covered" notes are replaced;
   - the module doc's bullet that names "the one window where an earlier look is still held" (lines 80–86);
   - the `untiledStreamHandle` doc (lines 479–483);
   - the S-1 comment above `wasCurrent`;
   - the `reissueUnrestricted` interface doc (lines 239–250) gains the `superseded` outcome.

**Why this mechanism** (OPEN-1). It changes only what the sink reads as current, and the order of the mint. The alternative, cancelling the earlier look at the reissue, would make it a self-cancel. A self-cancel's terminal logs nothing, so the existing S-1 test (`candidateArmSession.test.ts`, the "orphaned previous-generation ... (S-1)" test) would fail. That is stop I2.

**Other checks.**
- docs/02: the change stays inside `residency/`, and App's code is unchanged.
- docs/10: no wire change. The cancel is the existing control-plane `cancel`.
- ADR-006: a superseded Apply makes no workspace change, because the commit and its step run only on `applied`.
- Principle 7: nothing waits on the canvas.

### 2.4 Words (none is the human's wording)
- **Source comments:** the worker's words. Both gates read each clause against the code, and the PR body lists them.
- **A draft for the comment that replaces the two notes** (the architect's words):
  "An earlier look is never read as current once a reissue has begun: `wasCurrent` also compares the look's own generation with `untiledLookGeneration`, so its terminal, before or after the new look's mint, plans nothing, emits no status and records no failure here."
  - Clause check: the generation term is §2.3 item 4.
  - The first-look block is gated on term (i).
  - S1's block, the M-1 re-emit and `failedCoveringTerminals.set` are each gated on `wasCurrent`.
  - The draft says "here" because `establishFrameFromExtent` is not gated.
- **KNOWN-LIMITATIONS item 68:** see §9.5. Those words are drafts for the advisor.
- **P6:** no string the app shows changes. A superseded card change reaches the existing `CLAUSE_NOT_APPLIED_LINE` by a new route, inside one round trip. That is named in the note.

## §3 Fixtures

None. Each test builds a real `startCandidateArmSession`, and with it a real `TileViewportStreamManager`, against a fake canvas typed as the real `WorkingCanvasHandle` with no cast. Only the kernel's boundary is mocked: the client, the data-plane attach, `startStream`, the session log and the instrument.

## §4 Tests, and the mutations

**Where the tests go.** One new file, `frontends/shell/src/residency/candidateArmSession.mintWindow.test.ts`. No existing test file is edited.
- It follows `candidateArmSession.refusal.test.ts`: the same mock set, `importOriginal` for `../skp/client`, and its own `fakeCanvas`. Tile completeness follows `markTileComplete` and `clearAllTiles`.
- `shownViewportBbox` reads a variable. A test moves that variable when the new look's first batch is pushed, as the real canvas's auto-fit moves the camera then.
- SHOWN_BOX, PENDING_BOX and the degenerate fit anchor are copied from the `open-first-look-fills-fit-view` describe block in `candidateArmSession.test.ts`.
- A held mint is a deferred promise returned once by the `viewportQuery` mock.
- Tile terminals are delivered only to streams the session actually started (`startStreamMock` calls), never to an imagined handle.
- The status is folded through `nextResidencyStatus`, and the complete sentence is computed with `residencyStatusText`. No app string appears as a literal.
- `applyFilter` and `nextScanState` are imported from `../App`.

**The common setup (S).**
1. Look sh_1 delivers a batch, then Completed: the frame exists, and its plan's tiles are completed.
2. `reissueUnrestricted(null, null)`: look sh_2 is minted and delivers a batch, and stays running.
3. `reissueUnrestricted(null, f)` with the mint held.

| Test | Asserts | At the base, red because |
|---|---|---|
| MW1 | after S, sh_2's Completed terminal: no `applyTileViewportContext` call, no tile `viewportQuery`, no `candidate-first-look-view-planned` line | the plan of SHOWN_BOX under f runs (probe line A) |
| MW2 | after MW1's events, sh_3 is minted, its batch moves the shown box to PENDING_BOX, and its Completed terminal gives exactly one plan, of PENDING_BOX's cover, with every tile query carrying f | zero plans at sh_3's terminal (probe line C) |
| MW3 | after S, sh_2's terminal, a batch and Completed to every tile stream started since the reissue other than sh_3, then sh_3's batch and terminal: the folded status is not within-budget complete; once PENDING_BOX's tiles end, it is | the status reads complete for a view never asked for (probe line C) |
| MW4 | after S, a batch on sh_2's sink before the mint: `pushTileBatch` is not called for sh_2 | it is ingested once |
| MW5 | after S, sh_2's terminal as `ProducerFailed`: no status event at it; after sh_3 completes and its tiles end, the folded status is complete | `candidate-first-look-failed` is emitted (the S1 effect) |
| MW6 (a) and (b) | with a frame, two reissues under f1 then f2, both mints held, resolved (a) in order and (b) out of order: the first promise is `{kind:"superseded"}`, `cancelMock` got its handle, `startStreamMock` has no call for it, the second look's batch reaches `pushTileBatch` and its terminal plans under f2 | the first resolves `issued` |
| MW7 | `applyFilter(f1)` and `applyFilter(f2)`, with `requestViewport` bound to the real session's `reissueUnrestricted` and the mints resolved out of order: the first is `not-applied`, `commitActiveFilter.mock.calls` equals `[[f2]]`, `resetFitForNewGeneration` ran once | both commit |

MW6 and MW7 stand on OPEN-2 (a).

**Mutations.** Each is applied, the named tests are run and seen to fail by name, and the failing assertion and the commit are recorded. Then the mutation is reverted (round 25, item 2 (c)). No `verify-mutation` run is called an observation.
- M-1: the generation term dropped from `wasCurrent`. MW1, MW2, MW3 and MW5 fail.
- M-2: the generation term dropped from `onBatch`. MW4 fails.
- M-3: the mint-time generation check removed. MW6 and MW7 fail.
- M-4: `lookGeneration` captured after the awaits instead of first. MW6 fails.

## §5 Predictions, declared unchanged, falsification

**Predictions:**
- P1: the tests' commit, run at the base, gives MW1 to MW7 red, each at the assertion §4 names. Each is green at the head.
- P2: each mutation fails the tests it names.
- P3: every existing test passes unedited, including U-FL1 to U-FL6, U-FL2 (d), S-1, S-C and T-C. `npm run verify` passes.
- P4: the e2e suites of §9.3 pass.
- P5: §7 holds.

A wrong P1 to P4 is class 2. A wrong P5 is class 8.

**Declared unchanged:**
- `App.tsx`, `WorkingCanvas.tsx`, `residencyStatus.ts`, `tileViewportStreamManager.ts`, `viewportStreamManager.ts` and `protocol/**`;
- `RequestOutcome`;
- every string;
- `package.json` and `package-lock.json`;
- the session's handle-clear, frame establishment, scan liveness and log lines.

**Falsification:**
- a test that orders the events in §4's way stays green at the base;
- `applyFilter` does not treat `superseded` as `not-applied`;
- the real sink is not the object `startStream` receives.

## §6 Instruments

Assertions only: call counts, call arguments and the folded status. No measurement.

## §7 Declared values and the ceiling

- **No new constant.** The generation is a counter, not a bound.
- **The ceiling:** at most 560 changed lines, both numstat columns summed, over the three files `frontends/shell/src/residency/candidateArmSession.ts`, `frontends/shell/src/residency/candidateArmSession.mintWindow.test.ts` and `KNOWN-LIMITATIONS.md`.
  - An overrun is class 8.
  - Nothing is cut or packed to fit.
  - This section is never edited.
- **Estimate:** product about 70, the new test file about 360, KNOWN-LIMITATIONS about 8. About 440 lines.
- **Counting**, at a named commit:
  - `git diff --numstat B...H --` over the three files;
  - `git diff --name-only B...H`, which names no other path but this form, `governance/PLAN.yaml`, `governance/CUSTODIAN-QUEUE.*`, `site/**` and `state/**`.

## §8 Block-on-sight

1. Any edit to `App.tsx`, the canvas, the status module, the managers or `protocol/`.
2. A claim beyond §1: an app-window observation; that the earlier stream is cancelled; that an orphan's terminal does nothing.
3. A test that delivers a terminal to a stream the session never started, or that holds a mint by any route other than the `viewportQuery` promise (an imagined interface or ordering).
4. An existing test edited.
5. A new `pub` or exported item with no product caller. A new outcome kind.
6. A string the app shows changed.
7. A dependency or lockfile change.
8. A line cut or packed to fit §7.
9. The round-25 items, by name:
   - an overrun not recorded as class 8, or §7 edited;
   - a scope addition not recorded as class 9, or its code landed before the amendment that declares it;
   - a `verify-mutation` run called an observation;
   - a test-text span on the branch pinned by hash at a branch commit, or named without its commit id.
10. Record items:
    - quotation marks around text that is not byte-identical to its named source;
    - a line cite into the ledger;
    - a bare self-line;
    - a pin read as current.

## §9 Gates

**9.1 Architect** (full):
- §8, item by item.
- The seam rule on four seams, each against its actual interface at the base: the session to `StreamSink`/`startStream`; to `viewportQuery`/`cancel`; to `WorkingCanvasHandle`; and to App's `RequestOutcome` consumers (`applyFilter`, `reportViewportOutcome`, `changeClauses`, the Colour-by effect). MW7 is the end-to-end proof from the real shape for the last seam.
- The caller rule: nothing exported is added.
- Each clause of the worker's comments, and the item 68 words, against the code.
- docs/01, 02 and 10; ADR-006 and ADR-018; round 25.

**9.2 Reviewer:**
- the full diff, `origin/main...HEAD`;
- the four mutations made again;
- §7 by its commands;
- `npm run verify` in a hold;
- a re-run of the probe's ordering, as MW3.

**9.3 Suites:**
- `npm run verify` in `frontends/shell`, after `npm ci` there and in `renderer/bundle-viewer`;
- the `scripts/plan` node tests;
- verify cites, quotes (a floor) and test-claims;
- green CI.

E2E, once each at the gated head, through the suites' own launch on port 5180, by the Sonnet tester, with heavy runs taking turns: `e2e/regression.mjs`, `e2e/open-fills-fit-view.mjs`, `e2e/command-bar.mjs` and `e2e/project.mjs` (OPEN-5). Any failed row is stop I6.

**9.4 Operator:** no Part. The window needs timing inside one request round trip.

**9.5 KNOWN-LIMITATIONS item 68 at the merge** (OPEN-4).
- The PR carries item 68's change, so it lands only with the fix, after the tag.
- The number is kept, because item 69's comment and the other cites name items by number.
- Draft words for the advisor (the architect's, not the human's):
  "68. **No longer a limitation: a filter change made while the previous data load is finishing.** Results of the previous load that arrive after an Apply, a Clear, any other applied filter change, or a Colour by that starts a new first data load are set aside, and the new view is filled as after any other filter change. The number is kept so that the items after it keep theirs."
  - Clause check: "set aside" is §2.3 item 4 (MW1, MW4, MW5).
  - "filled as after any other filter change" is the first-look block at the new look's terminal (MW2, MW3).
  - The four triggers are the callers of `reissueUnrestricted` that item 68's comment names.
- The item's comment is the worker's, by symbol. Its reviewer checks each clause.

**9.6 PR body:**
- asks for a merge commit;
- names base B and the OPEN rulings;
- lists the worker's comment words and item 68's words;
- states that the merge request waits for the tag (ADV-2026-11-21-15 item 1; ADV-2026-11-22-11 items 2 and 3).

## §10 Where it is built, the order and the model

- **Where:** the branch `cut/untiled-reissue-mint-window`, the worktree `C:/dev/wt/mint`, the build folder `D:/wt-targets/mint` and the test data folder `D:/wt-data/mint`, cut from main at dispatch.
- **Commits:** this form first. Then the tests' commit on its own, before the code; the worker's local run shows each test red. Then the code commit, pushed with the tests. A stop still pushes the branch as it stands. A worker pushes in a call of its own.
- **Merging main in:** before the merge request, main is merged in. If that merge changes a §7 file, the reviewer makes a narrow read, and §9.3's e2e runs again at the final head.
- **Model:** worker-high, on the strongest model, for the session's state machine and timing (ADV-2026-11-19-17 item 3). It counts under the cap of ADV-2026-11-22-11 item 3.

## §11 Stops

Each stop is reported, and the custodian sends it to the advisor.
- I1: an interface of §2.1 or a symbol of §2.2 differs at the dispatch base.
- I2: an existing test needs an edit.
- I3: a test is green at the base, or red for another reason than §4 names.
- I4: any edit outside §7's files.
- I5: a path of §7 is in the declared files of a piece in flight or a PR awaiting merge at dispatch. KNOWN-LIMITATIONS item 68's region counts.
- I6: any failed e2e row.
- I7: the mocks cannot import `../App` without editing an existing file.

## §12 OPEN items

- **OPEN-1, the mechanism.** Recommended: (a), the generation compared beside the handle. The alternatives are (b), clearing the handle at the reissue, which changes scan liveness and `relinquishFill`'s reach inside the window, and (c), cancelling the earlier look, which needs the S-1 test edited.
- **OPEN-2, the superseded mint.** Recommended: (a), in this piece, because without it (a) of OPEN-1 drops both looks when mints resolve out of order. The alternative is (b), out, leaving today's overwrite.
- **OPEN-3, frame establishment by an orphan's terminal.** Recommended: out of this piece, to the advisor as a finding by reading, not run (the note).
- **OPEN-4, item 68 at the merge.** Recommended: (a), the number kept and the text replaced by §9.5's words. The alternative is (b), the item removed, leaving a gap.
- **OPEN-5, the e2e list.** Recommended: §9.3's four suites.

## §13 Amendments

*(Opens empty; append-only.)*

### Amendment 1 — 2026-11-22 — post-result amendment after the architect's form gate (attempt 1), and scope addition on ADV-2026-11-22-16 item 3: the gate's words R1 to R15, and the frame gate

Post-result amendment. It was written after the architect's form gate, attempt 1 (PASS WITH NOTES), whose findings are this round's results (read as round 15 (g) reads them). Within item 1, R8, R9 and R10 are class 3. Item 2 is a **scope addition** (class 9, round 25, item 2 (a)) on ADV-2026-11-22-16 item 3, and it is declared before any code. Nothing above is edited: each new text below is read in place of its old text, and the form's own text stays as filed.

**Authority.** These are the advisor's rulings under the delegation of 2026-11-13, not the human's words, cited by id and item: ADV-2026-11-22-16 items 3 and 4, and ADV-2026-11-22-19 items 1 to 4 (which govern where they differ). **Evidence:** the gate report, filed as `state/consults/gates/2026-11-22-untiled-reissue-mint-window-form-gate-architect.md`.

**Cites.** Every path:line below is at 466318621a13f00ae7b1114a4690582be42bdc94 and is a reading aid. A range marked "pin: hash by the custodian" is to be pinned at that commit. At dispatch, §0.4 still holds: the tree at the dispatch base is authoritative, and stop I1 checks it. Each old text is the form's, copied by reading and not by script. I checked by reading that each one occurs once in the form. Each R new text is the gate's, copied from its report.

#### 1. The gate's words, R1 to R15

None of these is the human's wording. Each clause check is the gate's own, with its cites written out against the file's path. I found no gate word that the code at the head shows to be wrong. Items 2.4 and 2.5 supersede R3's new text, R13's item 11 and the line R15 keeps, because of the scope addition, not because those words were in error.

**R1 (§1, the second may-claim).** Old:
```text
that look's ticket is cancelled through the existing `cancel`. No stream is started for it, and its promise resolves `{ kind: "superseded" }`.
```
New:
```text
a cancel is requested for that look's ticket through the existing `cancel`. No stream is started for it, and its promise resolves `{ kind: "superseded" }`, unless `stop()` ran or the session ended first, when it resolves `{ kind: "stopped" }` or `{ kind: "session-ended" }` as today: the latches are read before the generation (§2.3 item 3).
```
Clause check: `frontends/shell/src/residency/candidateArmSession.ts:1305-1313` and `:1318-1321` come before the planned check.

**R2 (§2.3 item 5).** Old:
```text
so scan liveness and `relinquishFill` inside the window are as today;
```
New:
```text
so the handle that `hasOutstandingWork` and `relinquishFill` read inside the window is as today. Scan liveness differs in one case: an earlier look's Completed terminal inside the window no longer plans, so when no tile is tracked its closing `syncScanLiveness()` can dispatch `reset` until the new look is minted;
```
Clause check: `frontends/shell/src/residency/candidateArmSession.ts:601`, `:1886`, `:1740`, `:1359`, `:1513`, `:612-617`.

**R3 (§5).** Old:
```text
- the session's handle-clear, frame establishment, scan liveness and log lines.
```
New (superseded in turn by R3′, item 2.4):
```text
- the session's handle-clear, frame establishment and the text of every log line. Changed by design, inside the window only: an earlier look's terminal writes the superseded variant of `candidate-untiled-terminal` and no `candidate-first-look-view-planned` line, and scan liveness differs as §2.3 item 5 says.
```
Clause check: `frontends/shell/src/residency/candidateArmSession.ts:1402-1404`, `:1509`.

**R4 (§7).** Old:
```text
- **Counting**, at a named commit:
```
New:
```text
- **Counting**, at a named commit H, with B read as `git merge-base origin/main H` at the count, so that a merge of main into the branch (§10) counts none of main's own lines (a reading of B, not an edit of the ceiling or its files):
```
Clause check: the gate gave none. R4 is a reading of B.

**R5 (§9.3).** Old:
```text
`e2e/regression.mjs`, `e2e/open-fills-fit-view.mjs`, `e2e/command-bar.mjs` and `e2e/project.mjs` (OPEN-5)
```
New:
```text
`e2e/regression.mjs`, `e2e/open-fills-fit-view.mjs`, `e2e/command-bar.mjs`, `e2e/project.mjs` and `e2e/filter-panel.mjs`, the last for the Filter section's Apply, Clear and refused Apply with its recovery re-issue on the shipped default arm (OPEN-5)
```
Clause check: `frontends/shell/e2e/filter-panel.mjs:200-220`, `:257-278`, `:462-478`; `frontends/shell/src/App.tsx:363-389`.

**R6 (§12).** Old:
```text
**OPEN-5, the e2e list.** Recommended: §9.3's four suites.
```
New:
```text
**OPEN-5, the e2e list.** Recommended: §9.3's five suites.
```

**R7 (§10).** Old:
```text
If that merge changes a §7 file, the reviewer makes a narrow read, and §9.3's e2e runs again at the final head.
```
New:
```text
If that merge changes a §7 file or any file under `frontends/shell/src/`, the reviewer makes a narrow read, and §9.3's e2e runs again at the final head (AUTONOMY §22: a change to source reopens the affected verdict).
```
Clause check: the gate cites `governance/AUTONOMY.md:391`.

**R8 (§2.1, class 3).** Old:
```text
(`frontends/shell/src/canvas/WorkingCanvas.tsx`; the type at lines 151–156, the implementation at lines 1652–1664)
```
New:
```text
(`frontends/shell/src/canvas/WorkingCanvas.tsx`: the four members of the `WorkingCanvasHandle` interface and their implementations in the component's handle object, by symbol)
```
Clause check (the gate's §1): `frontends/shell/src/canvas/WorkingCanvas.tsx:193`, `:233`, `:344`, `:1740`, `:1885`.

**R9 (§2.3 item 6, class 3).** Old:
```text
the module doc's bullet that names "the one window where an earlier look is still held" (lines 80–86);
```
New:
```text
the module doc's bullet on the first look's `Completed` terminal, whose `wasCurrent` clause points to the sink's comment for the window in which an earlier look is still held (lines 80–86);
```
Reason (the gate's): the quoted text breaks across `frontends/shell/src/residency/candidateArmSession.ts:83-84` with a comment prefix, so it is not byte-identical to its source.

**R10 (§4, class 3).** Old:
```text
copied from the `open-first-look-fills-fit-view` describe block in `candidateArmSession.test.ts`.
```
New:
```text
copied from the describe block in `candidateArmSession.test.ts` whose name ends with `(open-first-look-fills-fit-view)`.
```
Clause check: `frontends/shell/src/residency/candidateArmSession.test.ts:3787`.

**R11 (§4, MW7).** Old:
```text
`resetFitForNewGeneration` ran once
```
New:
```text
the `ApplyFilterDeps.resetFitForNewGeneration` mock, a function of its own and not the fake canvas's, ran once (the session's `canvas?.resetFitForNewGeneration()` runs at each reissue)
```
Clause check (the gate's §4): `frontends/shell/src/App.tsx:328`, `:396`; `frontends/shell/src/residency/candidateArmSession.ts:1745`.

**R12 (§4).** Old:
```text
- M-4: `lookGeneration` captured after the awaits instead of first. MW6 fails.
```
New:
```text
- M-4: `lookGeneration` captured after the `viewportQuery` await instead of first. MW6 and MW7 fail.
```
Clause check: the mints are held at `viewportQuery`, so the later reissue raises the generation before the earlier one resumes.

**R13 (§8).** Old:
```text
    - a pin read as current.
```
New (the gate's words; its item 11 is superseded in turn by R13′, item 2.5):
```text
`    - a pin read as current.` followed by a new line: 11. A change to the handle-clear, to `isSessionEndedTerminal`'s routing or to the `establishFrameFromExtent` call: OPEN-3 is the advisor's, and any addition there is class 9 (round 25, item 2 (a)).
```

**R14 (§2.4).** Old:
```text
emits no status and records no failure here."
```
New:
```text
emits no status and records no failure here. Not covered (AUTONOMY §31), timing inside one request round trip: with a frame, a Cancel between a reissue and its mint cancels the earlier look, which the session still holds, and not the new one."
```

**R15 (§2.4).** Old:
```text
  - The draft says "here" because `establishFrameFromExtent` is not gated.
```
New (the gate's words; item 2.4's A5 supersedes the line it keeps):
```text
that same line, followed by a new line: `  - The Cancel clause is `relinquishFill`'s frame-gated `cancelUntiledStream()`, which reads `untiledStreamHandle`, still the earlier look's inside the window.`
```
Clause check: `frontends/shell/src/residency/candidateArmSession.ts:1886-1887`, `:1283-1289`.

#### 2. Scope addition (class 9): frame establishment by an earlier look's terminal

**2.1 The cases.** This answers ADV-2026-11-22-16 item 3 for each way an earlier look can end. "Today" means main at 46631862.

- **(i) Its own terminal, arriving as an orphan,** before or after the new look's mint, with or without a frame.
  - **May not establish the frame,** on any extent.
  - The extent it would read is `latestUnionedExtent`. The reissue resets it (`frontends/shell/src/residency/candidateArmSession.ts:1758`), and from then on only what the newer generation admitted feeds it (`:1150`, with §2.3 item 4's `onBatch` term). It never holds this look's own union.
  - Today the call is gated only on `!(wasSelfCancelled && manager.gridFrame !== null)` (`frontends/shell/src/residency/candidateArmSession.ts:1429-1431` @ 466318621a13f00ae7b1114a4690582be42bdc94 sha256:2dabb9ae1075327efa077c0a839a0ac13727faff30f6d06556b464e901287ab1, pinned by the custodian), not on `wasCurrent`.
    - Without a frame, the orphan's terminal therefore freezes the frame on the newer look's partial union (the reading of ADV-2026-11-22-16 item 1).
    - With a frame, it re-logs `candidate-grid-frame-established` on that union and sets `frameEstablished` (`:1242`). The current look's own terminal then returns at `:1235` and writes no frame line.
  - That second effect is the gate's second OPEN-3 point (ADV-2026-11-22-19 item 1). **Case (i) covers it**, by the same change and the same mutation (M-5), with a test of its own (FE1 (b)).
  - An earlier look's terminal inside the mint window is also of an earlier generation, and it falls under the same rule. After the piece, its extent there is null: its batches are dropped, and the reissue reset the union at `:1758`. So no frame test can show the gate's effect inside the window.
- **(ii) The reissue's cancel, with OPEN-2 taken as (a).**
  - **No terminal reaches the session.** By §2.3 item 3, the cancel is requested at the mint, before the handle is assigned (`:1322`), the sink is built (`:1328`) and `startStream` is called (`:1516`). The look has no sink.
  - The frame comes from the newer look's own terminal, on its own union (FE2).
  - My paraphrase of item 3's premise: under OPEN-2, the reissue cancels the earlier running look, so its terminal arrives self-cancelled. That describes OPEN-1 (c), which the form does not take. OPEN-1 (a) leaves the running look uncancelled, and it ends by (i).
- **(iii) `stop()` during the bootstrap, with no later reissue begun.**
  - **May establish the frame, as today, when no frame exists.** The extent is `latestUnionedExtent`, the look's own union up to the cancel (FE3). With a frame, establishment is skipped, as today.
  - Variant: `stop()` or the session's end inside a frameless mint window, after the look's generation has passed (`cancelUntiledStream` reaches the earlier look there, `:1283-1290`).
    - It establishes no frame.
    - Today that path freezes one on the earlier look's batches admitted after the reissue. Under the piece those batches are dropped, and the extent is null.
    - By reading and not run, nothing reads a frame after that point: `issueUntiledQuery` returns at `:1293`; the first-look block's term (vi) is at `:1503`; `stop()`'s only caller is the teardown (`:1808-1812`).
    - It is named here and not tested, because no observable differs.

**2.2 The change.** §2.3 gains this item, read after its item 6:
```text
7. **The frame gate** (Amendment 1, the scope addition). In the untiled sink's `onTerminal`, the condition before `establishFrameFromExtent(latestUnionedExtent)`, today `!(wasSelfCancelled && manager.gridFrame !== null)`, becomes `lookGeneration === untiledLookGeneration && !(wasSelfCancelled && manager.gridFrame !== null)`: the look's own generation first, today's expression unedited after it. `establishFrameFromExtent`'s body is unchanged.
```

Why this is not the one term `wasCurrent || (wasSelfCancelled && manager.gridFrame === null)` alone:
- **(1) The term was drafted against main's `wasCurrent`, which reads only the handle.** Inside the window, `untiledStreamHandle === stream` still holds for the earlier look, because the handle is assigned only at the new mint (`:1322`). Its post-reissue batches are also admitted (`:1331`, `:1150`). So the term alone, on main's code, would still let that look's terminal freeze the frame on its own post-reissue union. It needs the piece's generation, which is item 3's "cannot be designed apart from the piece".
- **(2) Item 3's reason, by the code.** A self-cancelled terminal arrives with `wasCurrent` false, because `cancelUntiledStream` clears the handle before the cancel (`:1286-1287`). In the term, therefore, only `wasSelfCancelled && manager.gridFrame === null` decides a self-cancelled look, and that clause does not ask whose generation the look is. A look self-cancelled after a later reissue began would pass it: case (iii)'s variant, the only self-cancel that reaches an earlier look while there is no frame, because `relinquishFill` cancels only with a frame (`:1886`). The conjunct asks for the generation first, for every way a look ends.
- **(3) The two are equivalent, by reading.** With the piece's `wasCurrent` (handle and generation), the term and the conjunct give the same frame on every path the code reaches, because the path in (2) has a null extent. No test separates them, and no mutation targets the difference. The conjunct is chosen because it is today's expression, unedited, with one operand added. Case (iii) and the frame-exists skip are therefore unchanged by construction.

**2.3 The tests and the mutations (§4).** The tests go in the new file `candidateArmSession.mintWindow.test.ts`, with §4's mock set. No existing test file is edited.
- The file's fake canvas reports each `pushTileBatch`'s `fitAnchor` as the union of the batch extents it has been given since the last `resetFitForNewGeneration`, as the real canvas does (`frontends/shell/src/canvas/WorkingCanvas.tsx:1661`, `:1762`, `:1814`, `:1840`). It is typed as `WorkingCanvasHandle`, with no cast.
- The extents E1 to E4 are distinct and non-degenerate, and E2 is not equal to E2∪E3.
- A frame line is a `logSessionEventMock` call whose first argument is `candidate-grid-frame-established`. Its `observedUnion` is compared with the expected union (`frontends/shell/src/residency/candidateArmSession.ts:1254-1258`).
- Terminals go only to streams that `startStreamMock` received.

| Test | Steps and assertions | At the base |
|---|---|---|
| FE1 (a), case (i) without a frame | sh_1 is minted and delivers E1. `reissueUnrestricted(null, f)`: sh_2 is minted and delivers E2. Then sh_1's `Completed` arrives: `session.manager.gridFrame` is null, `establishTileGridContext` is not called and no frame line is written. Then sh_2 delivers E3 and its `Completed` arrives: a frame exists, `establishTileGridContext` has one call, and exactly one frame line is written, with `observedUnion` E2∪E3. | Red at "after sh_1's terminal, `session.manager.gridFrame` is null": main freezes the frame there on E2, because the call is not gated on `wasCurrent` (ADV-2026-11-22-16 item 1). |
| FE1 (b), case (i) with a frame | sh_1 delivers E1 and completes, giving frame F. A reissue mints sh_2, which delivers E2 and keeps running. A second reissue mints sh_3, which delivers E3. The log mock is cleared. sh_2's `Completed` arrives: no frame line is written and no `establishTileGridContext` call is added. sh_3 delivers E4 and completes: exactly one frame line is written, with `observedUnion` E3∪E4. `gridFrame` equals F throughout. | Red at "sh_2's terminal writes no `candidate-grid-frame-established` line": main writes one, with `observedUnion` E3. sh_3's terminal then writes none (`:1235`). |
| FE2, case (ii) | The first look's mint (sh_a) is held, through `reissueUnrestricted(null, null)`. Then `reissueUnrestricted(null, f)` runs with its mint (sh_b) held. sh_a is resolved, then sh_b. sh_b delivers E1 and E2 and completes. Asserts: the first promise is `{ kind: "superseded" }`; `cancelMock` was called with sh_a; `startStreamMock` has no call whose `ticketHandle` is sh_a; exactly one frame line is written, with `observedUnion` E1∪E2. | Red at the first assertion: main resolves `issued`. |
| FE3, case (iii) | sh_1 delivers E1 and E2. `await session.stop()`. sh_1's `{ kind: "Cancelled", detail: "" }` arrives (`frontends/shell/src/streaming/transport.ts:26`). Asserts: `cancelMock` was called with sh_1; a frame exists; `establishTileGridContext` has one call; exactly one frame line is written, with `observedUnion` E1∪E2. | Green by design: it guards today's path. |

Mutations, each applied, run, recorded by name with its commit, and reverted (round 25, item 2 (c)):
- **M-5:** the generation conjunct is dropped from §2.3 item 7, which leaves main's gate. FE1 (a) and FE1 (b) fail, at the assertions named above.
- **M-6:** §2.3 item 3's mint-time check is moved below `startStream(...)`, so the stream starts before it is cancelled and `superseded` is returned. FE2 fails at "no call whose `ticketHandle` is sh_a", and MW6 fails at its `startStreamMock` assertion.
- **M-7:** today's self-cancel expression is narrowed to `!wasSelfCancelled`. FE3 fails at "a frame exists".
- Item 2.2 (3) is named and not mutated.

**2.4 §1, §2, §5 and §11 rows.** Each new text is read in place of its old text.
- **A1 (§1).** Old: ``- Through App's `applyFilter`, a superseded Apply commits no filter and resets no fit.`` New: that same line, followed by:
  ```text
  - An untiled look's terminal establishes the grid frame only while its own generation is current: an earlier look's terminal, before or after the new look's mint, establishes no frame and writes no `candidate-grid-frame-established` line; a look superseded at its mint has no stream and no terminal; `stop()` during the bootstrap, with no later reissue begun, establishes the frame from the look's own union, as today (Amendment 1, item 2).
  ```
- **A2 (§1, may not claim).** Old: ``establishFrameFromExtent` still runs for it, unchanged (OPEN-3).`` New:
  ```text
  It still writes its `candidate-untiled-terminal` line, clears the handle it held and syncs scan liveness; only its frame establishment is now gated (Amendment 1, item 2). Nor: what an operator sees of the frame an orphan froze before this piece.
  ```
- **A3 (§2.3 item 5).** Old: ``the `establishFrameFromExtent` call (OPEN-3);`` New:
  ```text
  the `establishFrameFromExtent` call and the function's body; only the gate before the call changes, by §2.3 item 7;
  ```
- **A4 (§2.3 item 6).** Old: ``the S-1 comment above `wasCurrent`;`` New: that text, followed by a new bullet:
  ```text
  - the Nit 1 comment above the `establishFrameFromExtent` call gains the generation's clause (§2.4, Amendment 1's draft);
  ```
- **A5 (§2.4).** Old: ``  - The draft says "here" because `establishFrameFromExtent` is not gated.`` New (R15's added line still follows it):
  ```text
    - The draft says "here" because the terminal still clears the handle it held, writes its `candidate-untiled-terminal` line and syncs scan liveness; the frame gate has its own comment.
  ```
  A draft for that frame-gate comment (the architect's words, not the human's):
  ```text
  An untiled look's terminal may establish the grid frame only while its own generation is current (`lookGeneration === untiledLookGeneration`). An earlier look's terminal, before or after the new look's mint, establishes nothing: `latestUnionedExtent` then holds only what the newer generation admitted, never this look's own union. Within the current generation today's rule stands: a self-cancelled stream is skipped once a frame exists, and a self-cancel before any frame (`stop()` during the bootstrap) still establishes it from the look's own union.
  ```
  Clause check:
  - "only while ... current" is §2.3 item 7.
  - "before or after the mint": the generation rises at the reissue (§2.3 item 2).
  - "holds only what the newer generation admitted": `candidateArmSession.ts:1758` and `:1150`, with §2.3 item 4's `onBatch` term.
  - "skipped once a frame exists": `:1429`.
  - "`stop()` during the bootstrap": FE3.
- **R3′ (§5),** read in place of R3's new text:
  ```text
  - the session's handle-clear, `establishFrameFromExtent`'s body, `cancelUntiledStream`, `stop()`, `relinquishFill`, and the text of every log line. Changed by design: inside the window only, an earlier look's terminal writes the superseded variant of `candidate-untiled-terminal` and no `candidate-first-look-view-planned` line, and scan liveness differs as §2.3 item 5 says; inside the window and after it, an earlier look's terminal establishes no frame and writes no `candidate-grid-frame-established` line, and `stop()` or the session's end inside a frameless mint window establishes no frame (Amendment 1, item 2.1).
  ```
  Clause check: `candidateArmSession.ts:1402-1404` and `:1509` (the gate's), and item 2.1.
- **§5 additions.**
  - P6: the tests' commit, run at the base, gives FE1 (a), FE1 (b) and FE2 red at the assertions item 2.3 names, and FE3 green. All four are green at the head.
  - P7: M-5, M-6 and M-7 fail as named.
  - A wrong P6 or P7 is class 2.
  - P3 covers, by reading, these existing tests, unedited:
    - "the untiled first look's own terminal establishes the grid frame ... exactly once" (`candidateArmSession.test.ts:225`): its second terminal is of the same generation and returns at `:1235`;
    - the degrees fixture test (`:264`);
    - the stop()-suppression test (`:406`);
    - S-C (`:3339`);
    - U-FL2 (b) and (d) (`:3925`, `:3945`): (d) no longer sees the orphan's frame line, and it asserts only planned lines.
  - Falsification adds: FE1 green at the base; FE3 red at the base or at the head; an existing test that needs an orphan's frame line (stop I2).
- **A6 (§11).** Old: `- I3: a test is green at the base, or red for another reason than §4 names.` New:
  ```text
  - I3: a test other than FE3 is green at the base, or any test is red at the base for another reason than §4 and Amendment 1 name; FE3 red at the base is I3.
  ```

**2.5 §8.** R13′ is read in place of R13's item 11:
```text
11. A change to the handle-clear, to `isSessionEndedTerminal`'s routing, to `establishFrameFromExtent`'s body, or to the gate before its call other than §2.3 item 7's one conjunct: any further addition there is class 9 (round 25, item 2 (a)), declared by an amendment before its code.
12. A frame test whose fake canvas reports a `fitAnchor` other than the union since the last `resetFitForNewGeneration` (an imagined canvas).
```

**2.6 §9 and §10.**
- §9.1 adds the seam to the real `TileViewportStreamManager` (`establishGridFrame`, `gridFrame`; `frontends/shell/src/streaming/tileViewportStreamManager.ts:414-416`, `:468-471`). It also adds the seam to the canvas's `pushTileBatch` `fitAnchor`, `resetFitForNewGeneration` and `establishTileGridContext`, each checked against `WorkingCanvas.tsx` at the base, together with the frame-gate comment's clauses.
- **A7 (§9.2).** Old: `- the four mutations made again;` New: `- the seven mutations made again, and FE1 (a) run red at the base;`
- §10: no code before the architect's next attempt ends PASS or PASS WITH NOTES (ADV-2026-11-22-16 item 4). The tests' commit carries FE1 to FE3. For FE1 (a)'s red result, see OPEN-7.

#### 3. The gate's Notes

- **N1 (MW1).** Old: ``no tile `viewportQuery` `` (the text before the comma in MW1's row). New:
  ```text
  no `viewportQuery` call with a non-null bbox (its second argument) after step 3 of S
  ```
  The held untiled mint passes bbox null (`candidateArmSession.ts:1304`, from `reissueUnrestricted(null, f)`), and a tile query carries a bbox (`candidateArmSession.test.ts:3892`).
- **N2 (PLAN).** This is the custodian's action, not form text. The node shows `status: unscheduled` and `gate: none` (`governance/PLAN.yaml:7558`, `:7562`). Its gate is set to this form's path before the node goes in progress.
- **N3 (the swallowed cancel rejection).** **Kept as declared.** My reasons:
  - The rejection is not lost from the operator's sight: `client.ts`'s single capture site resolves the Console entry as refused or threw before it rethrows (`frontends/shell/src/skp/client.ts:59-71`).
  - The three latch branches beside it do the same (`candidateArmSession.ts:1306`, `:1311`, `:1319`), and so does baseline (`frontends/shell/src/streaming/viewportStreamManager.ts:205`, `:211`).
  - The "reported, never dropped" rule (`candidateArmSession.ts:1262-1266`) belongs to `logRejectedUntiledCancel`, which serves `cancelUntiledStream`'s cancels of a stream the session started. A superseded ticket never started one.
- **N4.** The section numbering differs from the template, and class 8 still points at §7. No change.

#### 4. §7 after the addition

§7 is not edited. The addition declares its own ceiling as part of the class 9 declaration, before any code; it is not class 8, because no overrun has happened.
- **The addition's ceiling:** at most 240 changed lines, both numstat columns summed, over §7's same three files. The piece is counted against **800** (560 + 240). An overrun of 800 is class 8, and P5 reads "§7 and the addition's ceiling hold".
- **Estimate for the addition:** product about 20 (the conjunct and the Nit 1 comment); tests about 165 (FE1 (a), FE1 (b), FE2, FE3 and the fake canvas's union); KNOWN-LIMITATIONS about 4. That is about 190, and the piece about 630.
- **Counting**, at a named commit H, with `B=$(git merge-base origin/main H)` (R4):
  - `git diff --numstat B...H -- frontends/shell/src/residency/candidateArmSession.ts frontends/shell/src/residency/candidateArmSession.mintWindow.test.ts KNOWN-LIMITATIONS.md`, both columns summed;
  - `git diff --name-only B...H`, with §7's path list unchanged.
- No file is added. The reading is OPEN-6.

#### 5. OPEN items

- **OPEN-1 and OPEN-2:** unchanged; (a) for each is recommended. FE2 stands on OPEN-2 (a).
- **OPEN-3: closed.** ADV-2026-11-22-16 item 3 puts it in this piece (class 9), and item 2 declares it.
- **OPEN-4: open to the advisor** after the next attempt (ADV-2026-11-22-19 item 3). Until the piece merges, limitation 68 stays as it is in the file. **A8 (§9.5)** replaces the quoted draft words with the words below, and the three clause-check bullets after them are read as the check below. These are the architect's draft, not the human's wording:
  ```text
  68. **No longer a limitation: a filter change made while the previous data load is finishing.** An Apply, a Clear, any other change of the filter that is applied, and a Colour by that starts a new first data load each set aside what the previous first data load still sends: its data is not drawn, and its end asks for no tiles, does not change the status line and does not set the grid the map's tiles are cut from. The new view is filled as after any other filter change. The number is kept so that the items after it keep theirs.
  ```
  Clause check, against the code as it will be built:
  - **The four triggers:** `issueQueryRef` is bound to `reissueUnrestricted` (`frontends/shell/src/App.tsx:1801`). It is reached by Apply and Clear through `applyFilter`'s `requestViewport` (`:1119-1126`, `:1144-1146`), by `changeClauses` (`:2168`) and by the Colour-by effect (`:2145`). Each raises the generation before any await (§2.3 item 2). A refused or superseded Apply raises it too.
  - **"its data is not drawn":** what was drawn is cleared at the reissue (`candidateArmSession.ts:1744`), and later batches are dropped by §2.3 item 4 (MW4).
  - **"asks for no tiles":** the first-look block (`:1497-1512`) is gated on `wasCurrent` with the generation (MW1).
  - **"does not change the status line":** S1's block (`:1472-1485`), the M-1 re-emit (`:1458-1462`) and `failedCoveringTerminals.set` (`:1406-1408`) are gated on `wasCurrent` (MW5).
  - **"does not set the grid":** §2.3 item 7 (FE1 (a), FE1 (b)). The grid is the frame `establishGridFrame` freezes (`tileViewportStreamManager.ts:468-471`), which fixes the cells' origin and size (`frontends/shell/src/canvas/tileGrid.ts:46-51`). This clause includes the fault of case (i).
  - **"filled as after any other filter change":** with a frame, the first-look block runs at the new look's terminal with `hasPlanned` false (MW2, MW3). Without one, the new look's terminal sets the frame on its own union and plans (FE1 (a), FE2).
  - **For the item's comment, not covered (§31 (c)):**
    - R2's scan reset inside the window, and R14's Cancel inside the window, both timing inside one round trip;
    - an orphan's terminal still marks the first look's tile partial once the newer look has reached the row limit (`candidateArmSession.ts:1440-1442`, ungated). By reading, the newer look's own terminal records that fact anyway.
- **OPEN-5:** I recommend five suites, as R5 and R6 give.
- **OPEN-6 (new): the addition's ceiling as a sum.** Recommended: (a), as item 4 declares. The alternative is (b): no added ceiling and a class 8 at the end, which would record declared scope as an overrun.
- **OPEN-7 (new): FE1 (a)'s red result to the advisor at once** (ADV-2026-11-22-19 item 4). Recommended: (a). The worker pushes the tests' commit in a call of its own and hands back with FE1 (a)'s red run (its failing assertion and commit). The custodian sends that result outside the batch, and the same worker continues to the code commit on the same branch. The alternative is (b), the result in the final hand-back, which is not "at once".
- **OPEN-8 (new): a v0.2 line for the frame fault,** which is the advisor's (ADV-2026-11-22-19 item 4). If one lands on main before this piece merges, this piece's KNOWN-LIMITATIONS change rewrites it as item 68 is rewritten, with the number kept and the words a draft for the advisor. Item 4's ceiling holds up to about 10 such lines.
- **OPEN-9 (new): operator and e2e proof of the frame case.** Recommended: none beyond §9.3. By reading, the case needs no timing inside one round trip, but an e2e run cannot place the orphan's terminal after the new look's first batch deterministically, and the only effect is the cells' size and position. The proof is FE1.

#### 6. What the architect's next attempt reads and checks

It reads this amendment alone, with the rest carried forward (ADV-2026-11-22-16 item 4). It checks:
1. Each old text (R1 to R15, A1 to A8, N1) occurs once in the form, and each new text reads in its sentence. R1 to R15 match the filed gate report byte for byte.
2. Item 2.1's case statements against the code at the dispatch base: `candidateArmSession.ts:1150`, `:1235-1242`, `:1283-1290`, `:1293`, `:1322`, `:1328`, `:1376-1378`, `:1394`, `:1429-1431`, `:1503`, `:1516`, `:1746`, `:1758`, `:1886`.
3. The reading of OPEN-2 (a) against ADV-2026-11-22-16 item 3's premise, and the equivalence in item 2.2 (3), with no test claiming the difference.
4. FE1 to FE3:
   - each base prediction, by reading;
   - the fake canvas's `fitAnchor` against `WorkingCanvas.tsx`;
   - terminals only to streams that were started;
   - FE3's exception to I3.
5. The specificity of M-5 to M-7, and that P3's existing tests stay green.
6. R3′, R13′, A6, item 4 (OPEN-6), and the item 68 draft's clause check.
7. N3's disposition, and OPEN-7 to OPEN-9.
8. The record rules: no line cite into the ledger, no bare self-line, quotes byte for byte, and this round's superseded index.

**Superseded index (this round):**
- the form's spans named as old in R1 to R15, A1 to A8 and N1;
- R3's new text (by R3′);
- R13's item 11 (by R13′);
- the line R15 keeps (by A5);
- §9.5's draft words and their clause-check bullets (by A8).

Read the last amendment first.

Nothing above is edited.

### Amendment 2 — 2026-11-22 — the architect's attempt 2: its words W1 to W10; FE3 (b); the order of the filing

1. **The attempt.** The architect's attempt 2 on Amendment 1 alone: `state/consults/gates/2026-11-22-untiled-reissue-mint-window-form-gate-architect-attempt-2.md`, PASS WITH NOTES, gate-log row 836, the filed file 23047 bytes, sha256 ba4f8461645b2d066e33c6f52d802ec798312dc5ad6ecc408a700494e0c5a7ca. By ADV-2026-11-22-23 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-23-the-mint-forms-added-test-is-fe3-b-its-mutation-both-terms-amendment-2-holds-the-words-in-full.md`) item 6 there is no further attempt on the form; the build's two gates read the form with both amendments.

2. **The words W1 to W10.** They are the architect's, not the human's and not the advisor's, applied under AUTONOMY §31 (d) with no re-gate. Each new text below is read in place of its old text in Amendment 1. Each old text occurs exactly once in Amendment 1, checked by the custodian's script at this filing. Every old and new text is copied by script from the filed report's section "Replacement words"; each is the text between its fence lines, which are not part of it. The report's clause checks stay in the report.

**W1 (Correctness; item 2.1 (iii)).** Old:

````text
It is named here and not tested, because no observable differs.
````

New:

````text
It is named here and not tested. The one observable that differs is the session log: today this path can write a `candidate-grid-frame-established` line on the earlier look's post-reissue union, and under the piece it writes none. No single mutation can show it, because two terms each prevent it: §2.3 item 4's `onBatch` term leaves the extent null, and §2.3 item 7's conjunct skips the call (item 2.2 (3)).
````

By ADV-2026-11-22-23 item 3, the clause "named here and not tested" in this new text is read as "named here and tested by FE3 (b)" (item 3 below); its other words stand as the report gives them.

**W2 (Correctness; A2's new text).** Old:

````text
It still writes its `candidate-untiled-terminal` line, clears the handle it held and syncs scan liveness; only its frame establishment is now gated (Amendment 1, item 2).
````

New:

````text
It still writes its `candidate-untiled-terminal` line unless it was self-cancelled, clears the handle when it still holds it, and syncs scan liveness; its frame establishment, like its plan, its status and its accounting (§2.3 item 4), is now gated on its generation (Amendment 1, item 2).
````

**W3 (Documentation; markup).** A2. Old:

````text
Old: ``establishFrameFromExtent` still runs for it, unchanged (OPEN-3).`` New:
````

New:

````text
Old: `` `establishFrameFromExtent` still runs for it, unchanged (OPEN-3). `` New:
````

**W3 (Documentation; markup).** N1. Old:

````text
Old: ``no tile `viewportQuery` `` (the text
````

New:

````text
Old: `` no tile `viewportQuery` `` (the text
````

**W4 (Documentation; A5's clause check).** Old:

````text
"before or after the mint": the generation rises at the reissue (§2.3 item 2).
````

New:

````text
"before or after the new look's mint": the generation rises at the reissue (§2.3 item 2), and the look's own generation is captured before its first await (§2.3 item 3).
````

**W5 (Documentation; the Cites paragraph).** Old:

````text
A range marked "pin: hash by the custodian" is to be pinned at that commit.
````

New:

````text
The one pinned range, in item 2.1 (i), carries its hash at that commit.
````

**W6 (Documentation; item 2.4, P3).** Old:

````text
(d) no longer sees the orphan's frame line, and it asserts only planned lines.
````

New:

````text
at (d)'s orphan terminal the extent is null at the base and at the head (the reissue reset it at `:1758`, and sh_3 delivers nothing), so no frame line is written either way, and (d) asserts only planned lines.
````

**W7 (Documentation; R7′, the drafter's note item 4).** Insertion. Old:

````text
Clause check: the gate cites `governance/AUTONOMY.md:391`.
````

New:

````text
Clause check: the gate cites `governance/AUTONOMY.md:391`.

**R7′ (§10, the architect's attempt 2),** read in place of R7's new text:
```text
If that merge changes any tracked file outside `governance/`, `state/`, `site/` and `docs/`, the reviewer makes a narrow read, and §9.3's e2e runs again at the final head (AUTONOMY §22: a change to source, tests, configuration or fixtures reopens the affected verdict).
```
````

The report gives this new text as a block followed by the line "followed by a text block containing:" and a second block; here the second block is written inside a text fence after the first, as that line describes.

**W7 (Documentation; R7′, the drafter's note item 4).** Item 1's opening. Old:

````text
Items 2.4 and 2.5 supersede R3's new text, R13's item 11 and the line R15 keeps, because of the scope addition, not because those words were in error.
````

New:

````text
Items 2.4 and 2.5 supersede R3's new text, R13's item 11 and the line R15 keeps, because of the scope addition, not because those words were in error. R7′ supersedes R7's new text, whose trigger was narrower than `governance/AUTONOMY.md:391`.
````

**W7 (Documentation; R7′, the drafter's note item 4).** The superseded index. Old:

````text
- R3's new text (by R3′);
````

New:

````text
- R3's new text (by R3′);
- R7's new text (by R7′);
````

**W8 (Documentation; A8's not-covered list).** Old:

````text
    - an orphan's terminal still marks the first look's tile partial once the newer look has reached the row limit (`candidateArmSession.ts:1440-1442`, ungated). By reading, the newer look's own terminal records that fact anyway.
````

New:

````text
  - **For the item's comment, true by reading and not a §31 (c) case** (ordinary use reaches it): an orphan's terminal still marks the first look's tile partial once the newer look has reached the row limit (`candidateArmSession.ts:1440-1442`, ungated). After the reissue only the newer look's admitted rows count toward that limit (`:1760`, `:1156`, with §2.3 item 4's `onBatch` term), so the mark states a fact about the newer look, which its own terminal records anyway.
````

**W9 (Documentation; item 2.2 (3)).** Old:

````text
the term and the conjunct give the same frame on every path the code reaches, because the path in (2) has a null extent.
````

New:

````text
the term and the conjunct give the same frame on every path the code reaches: they differ only for a self-cancelled look of an earlier generation while there is no frame, and every such look's terminal reads a null extent, because the only self-cancels that reach a look with no frame are `stop()` and the session's end, whose latches stop any later look from being started (`:1293`, `:1305-1313`, `:1318-1321`, `:1729`) and so from feeding `latestUnionedExtent` after the reissue reset it (`:1758`).
````

**W10 (Documentation; item 2.1 (iii)'s variant cites).** Old:

````text
`stop()`'s only caller is the teardown (`:1808-1812`).
````

New:

````text
`stop()`'s only caller is the teardown (`:1808-1812`); after the session's end, `reissueUnrestricted` returns at `:1729`, a late mint at `:1318-1321`, and the manager plans nothing (`frontends/shell/src/streaming/tileViewportStreamManager.ts:523`).
````

3. By ADV-2026-11-22-21 item 3 and ADV-2026-11-22-23: one more test in the tests' commit, FE3 (b), as the architect's attempt 2 gives it in its N-6. sh_1 delivers E1, a reissue is held, sh_1 delivers E2, then stop(), then sh_1 is cancelled. It asserts that no frame is established and that no frame line is written. It is red at the base, with a frame on E2. Its mutation removes both terms together, section 2.3 item 4's onBatch term and section 2.3 item 7's conjunct, because either alone prevents the frame. It is counted inside the addition's ceiling.

4. **The order of the filing.** Amendment 1 was appended to this form in the custodian's records commit 9282833d2408d4ed31e7834fcd9a4b23ea401288, built while the attempt ran and so before its words, which its report asked to be applied before the append; nothing is rewritten, and the attempt read the bytes that were appended (ADV-2026-11-22-23 item 5).

5. **Next.** The build, the tests' commit first; FE1 (a)'s red run goes to the advisor at once; the worker leaves `KNOWN-LIMITATIONS.md` alone until the advisor has approved item 68's words (ADV-2026-11-22-23 item 7).

Read the last amendment first.

Nothing above is edited.
