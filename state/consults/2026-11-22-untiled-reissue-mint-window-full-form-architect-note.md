*Filed by the custodian: the architect's draft of the full form for the node untiled-reissue-holds-earlier-look-handle-until-mint (ADV-2026-11-21-15 item 4 (ii)), with its note after the form. The form above its END OF FORM line is filed as `governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md`, byte for byte, its trailing blank lines dropped. It read the repository at 08783d07 in a detached read worktree and ran nothing. Its run: Read 34, Grep 30, Glob 3, SubagentHandback 1, by unique call ids, 1 call errored; model claude-opus-5-5, from 2026-11-22T14:46:53Z to 2026-11-22T14:57:55Z by its transcript; 0 calls named the main checkout; no compaction. The report below from its hand-back, 27198 bytes, sha256 200c2146bb4a6584dfd4e2b45b75790f1683709027bcb0a6fd07844912fbfd0c, byte for byte. Its note's finding by reading (an orphaned terminal still establishes the grid frame) goes to the advisor at once, by item 7.*

---

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

---END OF FORM---

**What the code did not settle.**
- Whether the kernel can answer two `viewport_query` calls, or their attaches, out of order. Baseline's `requestViewport` guards both awaits by generation, so the form treats it as possible.
- Whether an existing test overlaps two reissues and expects the first to be `issued`. I found none in the tests I read (U-FL2, S-1, S-C, T-C), but I did not read all 109 tests in that file. Stop I2 covers it.
- Whether a vitest file that mocks `../skp/client` through `importOriginal` can import `applyFilter` from `../App`. `candidateArmSession.refusal.test.ts` already imports `nextScanState` from `../App` that way. Stop I7 covers it.

**OPEN items and recommendations.**
- OPEN-1: (a), the generation token.
- OPEN-2: (a), cancel and return `superseded`.
- OPEN-3: out of this piece; to the advisor.
- OPEN-4: (a), keep the number and use the draft words.
- OPEN-5: the four suites.

**For the advisor at once (ADV-2026-11-21-15 item 7), by reading, not run.**
- An orphan's terminal still calls `establishFrameFromExtent(latestUnionedExtent)`. That call is gated only on the self-cancel term, not on `wasCurrent`.
- After a reissue made while the open's first look is still streaming (frameless), the earlier look's terminal can arrive after the new look's first batches. It then freezes the session's grid frame on the new look's partial union, against `tileGrid.ts`'s top doc, which says the anchor is the whole look's union.
- With a frame already in place, the same call only re-logs `candidate-grid-frame-established` with a partial `observedUnion`.
- The reach looks ordinary: an Apply soon after opening a large file. But the consequence I can see is smaller cells, not wrong data, because the frame has no boundary (`tileGrid.ts`). I did not run it.
- The fix inside this piece would be one term, `wasCurrent || (wasSelfCancelled && manager.gridFrame === null)`, which keeps `stop()`'s bootstrap path, plus a test and a mutation. That would be class 9 if the advisor adds it.

**Smaller items named, not covered.**
- A Cancel between a reissue and its mint cancels the earlier look, not the new one. This is as today, and inside one round trip.
- A superseded card change now shows the existing `CLAUSE_NOT_APPLIED_LINE`. That is true, but it is a new route to a shown string.
- A refused earlier mint still runs `applyFilter`'s recovery re-issue, which can supersede the later Apply. This is pre-existing, and the same as baseline.

**For the human.** None expected: no dependency, no lockfile, no workflow and no string the app shows. The merge waits for the tag, or for the human's word under ADV-2026-11-21-15 item 1.

**Pins.** I have no Bash, so no span hash was computed. Every line range is a reading aid at 08783d07. If the custodian wants any range pinned, the reviewer computes its hash.

Files read (all under C:/dev/wt/read-1122):
- frontends/shell/src/residency/candidateArmSession.ts
- frontends/shell/src/residency/candidateArmSession.test.ts
- frontends/shell/src/residency/candidateArmSession.refusal.test.ts
- frontends/shell/src/App.tsx
- frontends/shell/src/App.test.ts
- frontends/shell/src/canvas/WorkingCanvas.tsx
- frontends/shell/src/canvas/tileGrid.ts
- frontends/shell/src/streaming/viewportStreamManager.ts
- frontends/shell/src/streaming/transport.ts
- frontends/shell/src/skp/client.ts
- frontends/shell/src/filter/ClauseCards.tsx
- frontends/shell/src/residency/residencyStatus.ts
- KNOWN-LIMITATIONS.md
- the four directives
- the reviewer's gate report
- governance/AUTONOMY.md §21 and §25
- docs/PREREGISTRATION-TEMPLATE.md
- governance/forms/frontends/SESSION-LOG-TOKEN-REDACTION-PREREGISTRATION.md
