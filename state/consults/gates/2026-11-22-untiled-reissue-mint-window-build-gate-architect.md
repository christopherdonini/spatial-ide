Reviewed: PR 358, the branch cut/untiled-reissue-mint-window at 17845a0cac37d5f6e4745e108a67197621308f8b, in C:/dev/wt/mint, with the base read at 8922b843529519ae1f7a028669a1b8356a7d74f9 in C:/dev/wt/read-mint (the custodian's filing note, 2026-11-22: the architect's build gate, its first attempt after the build (gate-log attempt 3: attempts 1 and 2 were the form gate), node:untiled-reissue-holds-earlier-look-handle-until-mint@gate-architect-1, dispatched at 2026-11-22T17:41:34.605Z; its run: Read 32, Grep 30, Glob 2, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T17:41:39Z to 2026-11-22T17:51:41Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 12364 bytes, sha256 842e89a298a9e327b3c72dbaa509f103954c1c4d7e7e749cc0098bac147847b5, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. FAIL, on one clause of item 68, sent to the advisor unreworded at 2026-11-22T17:52:09.919Z (ADV-2026-11-22-27 item 6); its words by ADV-2026-11-22-29 (`state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-29-pr-358-item-68s-clause-untrue-as-approved-its-new-words-an-exception-for-a-sessions-end-the-architects-attempt-2-checks-them.md`))

---

Verdict: FAIL (cut/untiled-reissue-mint-window @ 17845a0cac37d5f6e4745e108a67197621308f8b)
Reviewed: C:/dev/wt/mint @ 17845a0cac37d5f6e4745e108a67197621308f8b
REPORT PATH: state/consults/gates/2026-11-22-untiled-reissue-mint-window-build-gate-architect.md

The code is correct and its tests are sound. One sentence blocks the gate. It is in item 68's words, and the fix is to those words, not to the code. Line numbers are reading aids at 17845a0c, a branch commit, and this report is read at that commit. Cites marked "B" are at 8922b843. I ran nothing; the worker's run results are claims for the reviewer to repeat.

## Correctness

**C1. Item 68's words: one clause is untrue of the built code** (`KNOWN-LIMITATIONS.md` item 68; the advisor's wording under the delegation, ADV-2026-11-22-27 item 6; not the human's typed words). By that ruling and the brief it goes to the advisor unreworded.
- **The clause:** "each set aside what the previous first data load still sends: … its end … does not change the status line".
- **The code at the head:**
  - An earlier look's terminal whose detail says the source changed or coverage was lost goes to `manager.notifySessionEnded` (`candidateArmSession.ts:1391-1394`). That happens before any `wasCurrent` gate, and §2.3 item 5 and R13′ (§8 item 11) keep it that way by design.
  - From there, `TileViewportStreamManager.endSession` (`tileViewportStreamManager.ts:747-760`) runs `clearAll` (`:701-704`). That calls `cancelTileStream(…, true)` (`:1126-1127`), which calls the session's `onTileSuperseded`. That callback runs `emitResidencyStatus()` once `trackedTileCount === 0` (`candidateArmSession.ts:1017`). Nothing sets `suppressNestedSupersededEmit` on this route. The status it sends reaches `status.residency` (`App.tsx:2539-2544`).
  - After that, `endCandidateSession` (`candidateArmSession.ts:1116-1130`) cancels the current look through `cancelUntiledStream`, clears every tile (the new look's too) and calls App's `endSession` (`App.tsx:1488-1497`, which runs `handleSessionEnded` at `:708-722`).
  - App's `endSession` does three things: it sets `sessionEnded` (the RefusalBlock in the attention strip, `:2469-2473`), it hides `status.sourceWatch` (`:2570-2572`, `layout/statusItems.ts:28`), and it sets the hover readout.
- **What it does, against what the words mean:**
  - App's `endSession` on its own is not a change of "the status line" as item 68 and the form mean it. That means the residency line: item 64, the old item 68, and A8's clause check, which names only S1's block, the M-1 re-emit and `failedCoveringTerminals.set`.
  - The same route can still change that line. If a tile of the new view is in flight and none is queued or being minted when the earlier look's terminal arrives, `clearAll` sends a residency status. The new view gets tiles after the new look's own plan, or after a pan with a frame.
  - The earlier look's end is also not "set aside": it ends the session, clears all drawn data and puts up the session-ended statement.
  - This is by reading, not run. Ordinary use reaches it: the file changes on disk while the earlier load is still streaming after an Apply. It needs no timing inside one round trip, so it is not a §31 (c) case.
  - The code needs no change. The comment's "Not changed" sentence states the route correctly. The untrue part is the item's own sentence.
- **Outside the diff, for the advisor:** the older comment S-b (`candidateArmSession.ts:998-1016`) says the emit at `:1017` "never runs". The `endSession` route above shows it can. This is not this piece's finding.

## Evidence

No Evidence finding. By reading, each test asserts what the form claims for it:
- terminals go only to streams `startStreamMock` received (`sinkFor` throws otherwise);
- mints are held only through the `viewportQuery` promise;
- the fake canvas is typed as `WorkingCanvasHandle` with no cast;
- its `fitAnchor` is the union since the last `resetFitForNewGeneration`, as the real canvas computes it (`WorkingCanvas.tsx` B `:1660-1662`, `:1762`, `:1814`, `:1840`).

## Documentation (each must be fixed before the merge)

**D1. The `reissueUnrestricted` interface doc** (`candidateArmSession.ts:249-250`) leaves out the latch exception that R1 put into §1. The case needs `stop()` or a session end inside one round trip, so it does not block.
```text
   * Resolves `{ kind: "superseded" }` when a later call began before this one's ticket and attach
   * returned: that ticket is cancelled through `cancel`, and no stream is started for it.
```
```text
   * Resolves `{ kind: "superseded" }` when a later call began before this one's ticket and attach
   * returned, unless `stop()` ran or the session ended first, which resolve `stopped` or
   * `session-ended` as before (the latches are read before the generation): a cancel is requested
   * for that ticket through `cancel`, and no stream is started for it.
```
Clause check:
- "began": a later call raises the generation only after its session-ended check (`:1749-1750`).
- "ticket and attach returned": the generation check sits after both awaits (`:1311`, `:1316`, `:1331`).
- The latches come first (`:1312-1328`).
- "a cancel is requested": `skpCancel` is awaited and its rejection swallowed (`:1332`).
- "no stream is started": the return at `:1333` comes before `startStream` at `:1536`.

**D2. The `untiledStreamHandle` doc** (`candidateArmSession.ts:484`) says the handle "still names the earlier look" between a reissue and the new look's mint. It can already have been cleared there. That needs timing inside the window, so it does not block.
```text
   * reissue and that mint it still names the earlier look. Whether a look is current is read from
```
```text
   * reissue and that mint it still names the earlier look, unless that look's own terminal or
   * `cancelUntiledStream` (a Cancel with a frame, `stop()`, the session's end) has cleared it. Whether a
   * look is current is read from
```
Clause check:
- The look's own terminal clears the handle at `:1374`.
- `cancelUntiledStream` clears it at `:1293`.
- `cancelUntiledStream` is called by `relinquishFill` only with a frame (`:1907-1908`), by `stop()` (`:1818`) and by `endCandidateSession` (`:1123`).

**D3. The mutations' failing sets (check 6).** M-3 and M-4 also failing FE2 was to be expected. FE2's first assertion, `{kind:"superseded"}` at test `:454`, exists only through the mint-time check (`:1331-1334`). M-3 removes that check. M-4 defeats it, because FE2 holds both mints at `viewportQuery`. Amendment 1 added FE2 with M-6 as its mutation and did not widen the sets of M-3 and M-4.
- This is not class 2: P2 says each mutation fails the tests it names, and it does.
- The closing amendment records, as results, without editing §4 or R12:
  - M-3 and M-4 fail MW6 (a), MW6 (b), MW7 and FE2, each with its failing assertion and the commit;
  - M-FE3b's extra failures (MW4, FE1 (a), FE1 (b)) come from its two terms one at a time;
  - no `verify-mutation` run is called an observation;
  - test text is named with its commit id and is not hash-pinned at a branch commit (round 25).

**D4. ADV-2026-11-22-27 must be on main before the merge.** Item 68's comment names it as the approval, and it is not on main yet. Nothing tracked may cite an untracked file as Authority (round 14).

**For the advisor, with C1, unreworded as the brief directs:** item 68's comment says that a ticket minted after a later reissue "resolves superseded". It leaves out the latch exception of D1. That case needs timing inside one round trip, so it does not block.

## Checks
1. **§8, item by item:** all hold.
   - Items 1, 4 and 7: the diff is the three §7 files only (no App, canvas, status, manager or protocol edit, no existing test edited, no dependency change).
   - Item 2: no claim beyond §1 apart from C1.
   - Item 3: no imagined interface or ordering in the tests.
   - Item 5: nothing new is exported, and `superseded` is already in `RequestOutcome` (`viewportStreamManager.ts` B `:82`).
   - Item 6: no string the app shows changed.
   - Item 8: nothing was cut or packed; the long lines are the house style.
   - Item 9 (the round-25 items): no overrun. I recounted from the diff: 41+20, 492+0 and 2+3 make 558, against a ceiling of 800. Amendment 1's class-9 addition is on main at B, before the code. There are no mutation records and no hash pins yet.
   - Item 10: no quotation marks in the new comments.
   - Item 11: the only change at the frame gate is the one conjunct. Item 12: the fake canvas reports the true union.
2. **The seams, each against its interface at B:**
   - **`StreamSink` and `startStream`:** they match `transport.ts` B `:79-84` and `adapterWs.ts` B `:15-22`. The real sink is the object `startStream` receives.
   - **`viewportQuery` and `cancel`:** they match `client.ts` B `:111-134`. The tile filter is argument 4.
   - **`WorkingCanvasHandle`:** all its required members (B `:115-350`) are present.
   - **App's `RequestOutcome` consumers, each reading `superseded`:**
     - `applyFilter` (`:394-399`) returns `not-applied` and commits nothing;
     - `changeClauses` (`:2168-2169`) returns `not-applied`;
     - the Colour-by effect (`:2145-2146`) gets no retry, because only `throttled` is retried (`:280`), and then goes through `reportViewportOutcome`;
     - `reportViewportOutcome` (`:1598-1614`) clears `viewportRefusal` unless the session has ended, as it does for `issued`.
   - **MW7** is built from the real shape: the real `applyFilter`, the real session's `reissueUnrestricted` in the same position as `issueQueryRef` (`:1801`), the deps checked with `satisfies ApplyFilterDeps`, and its own `resetFitForNewGeneration` mock (R11).
3. **The caller rule:** holds. `untiledLookGeneration` is local to the session's closure.
4. **The changed comments in `candidateArmSession.ts`:**
   - True: the module doc bullet (`:83-84`), the field doc (`:487-489`), the latch comment (`:1329-1330`), the `onBatch` comment (`:1344`), the S-1 addition (`:1371-1372`), the frame-gate comment (`:1444-1450`), the S1 comment, which matches R14 (`:1490-1495`), and the first-look comment (`:1515-1516`).
   - D1 and D2 need the words above.
5. **Item 68's words:**
   - The text is A8's (form line 592), byte for byte by reading.
   - W8's placement holds: the comment's markTilePartial sentence ("True by reading, and not an AUTONOMY §31 (c) case").
   - These clauses hold: the four triggers, "its data is not drawn", "asks for no tiles", "does not set the grid" (the only call is at `:1452`) and "filled as after any other filter change".
   - "Does not change the status line" fails: C1.
6. **Mutation sets:** D3.
7. **The constitution:**
   - docs/02: the change stays inside `residency/`.
   - docs/10: no wire change; the cancel is the existing control-plane `cancel`.
   - ADR-006: a superseded Apply makes no workspace change, because the commit runs only on `issued`.
   - ADR-018: the vocabulary is unchanged.
   - docs/01 principle 7: nothing waits on the canvas.
   - Round 25: as in check 1, item 9.
8. **Records:** no line cite into the ledger. No source-comment cite will fail to hold on main, apart from D4.

## Files read
- `C:/dev/wt/read-mint/governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md`
- `C:/dev/wt/read-mint/state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-{16,19,21,23}-*.md`
- `<S>/ADV-2026-11-22-27.md`, `<S>/mint-diff-17845a0c.txt`, `<S>/mint-build-tests-report.md`, `<S>/mint-build-code-report.md`
- `C:/dev/wt/mint/frontends/shell/src/residency/candidateArmSession.ts`, `C:/dev/wt/mint/frontends/shell/src/App.tsx`, `C:/dev/wt/mint/frontends/shell/src/streaming/tileViewportStreamManager.ts`, `C:/dev/wt/mint/frontends/shell/src/layout/regionParts.tsx`, `C:/dev/wt/mint/frontends/shell/src/layout/statusItems.ts`, `C:/dev/wt/mint/KNOWN-LIMITATIONS.md`
- At B: `C:/dev/wt/read-mint/frontends/shell/src/streaming/transport.ts`, `adapterWs.ts` and `viewportStreamManager.ts`; `C:/dev/wt/read-mint/frontends/shell/src/skp/client.ts`, `skp/types.ts`; `C:/dev/wt/read-mint/frontends/shell/src/canvas/WorkingCanvas.tsx`; `C:/dev/wt/read-mint/frontends/shell/src/residency/candidateArmSession.test.ts`; `C:/dev/wt/read-mint/frontends/shell/src/App.tsx`; `C:/dev/wt/read-mint/docs/adr/ADR-018-what-cancellation-acknowledged-means.md`
