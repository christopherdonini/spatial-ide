*The architect's draft of the mint-window form's Amendment 1 (ADV-2026-11-22-16 item 3 and ADV-2026-11-22-19, `state/directives/2026-11-22-advisor-ruling-adv-2026-11-22-19-the-mint-window-forms-plan-stands-amendment-1-by-the-architect-item-68s-words-its-draft-the-orphan-red-result-at-once.md`), tag node:untiled-reissue-holds-earlier-look-handle-until-mint@amendment-1-draft, read only at main 466318621a13f00ae7b1114a4690582be42bdc94 in a detached read checkout. Filed by the custodian below the rule from its hand-back in its transcript, 36005 bytes, sha256 6a348076602943bf5a734351e669b215d3f41815744a25b7e71bd3f83fd7e7f6, byte for byte. Its run: Read 30, Grep 14, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T16:07:27Z to 2026-11-22T16:22:36Z by its transcript; 0 calls named the main checkout; no compaction. The amendment, up to its tail, is appended to `governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md` with one change: the marker at item 2.1 (i) is replaced by the pin `frontends/shell/src/residency/candidateArmSession.ts:1429-1431` @ 466318621a13f00ae7b1114a4690582be42bdc94 sha256:2dabb9ae1075327efa077c0a839a0ac13727faff30f6d06556b464e901287ab1 (the three whole lines with LF at that commit). The note after its end line is the drafter's, for the custodian and the advisor.*

---

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
  - Today the call is gated only on `!(wasSelfCancelled && manager.gridFrame !== null)` (`:1429-1431`; pin: hash by the custodian), not on `wasCurrent`.
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

---END OF AMENDMENT---

**Note for the custodian and the advisor**

1. **ADV-2026-11-22-16 item 3's premise.** The form's OPEN-2 (a) cancels a ticket at its mint, before any sink exists, so no look ends "self-cancelled by the reissue". The advisor read the note's single OPEN-2 line and took it as cancelling the running earlier look, which is OPEN-1 (c). Item 3's concern still holds, but by another route: a self-cancelled earlier look exists only through `stop()` or the session's end inside the mint window. The conjunct covers both routes. I say this in the amendment as a paraphrase, not as a quote.
2. **`stop()` "as today".** It is kept exactly when no later reissue has begun (FE3). Inside a frameless mint window, `stop()` or the session's end now freezes no frame. Today it freezes one on the earlier look's post-reissue batches. By reading, nothing reads a frame after that point, so the difference is named and not tested. The advisor may want to confirm that this satisfies "must keep working as today".
3. **The conjunct and the one term are equivalent by reading** once the piece's generation is in `wasCurrent`. The real defect in the note's one term is that it was drafted against main's handle-only `wasCurrent`, which still treats the earlier look as current inside the window.
4. **R7, not corrected, because the code does not show it wrong.** Its trigger, "any file under `frontends/shell/src/`", is narrower than `governance/AUTONOMY.md:391`'s "source, tests, configuration or fixtures". A merge of main that changed `frontends/shell/e2e/`, `src-tauri/` or `package.json` would not trigger the re-run. I recommend the next attempt widen it.
5. **The §7 sum (OPEN-6)** is my reading of class 9's "declares it as the form declares everything else". No template text says so in terms.
6. **Smaller items, pre-existing and harmless by reading:** the ungated `markTilePartial(INITIAL_TILE_KEY)` at an orphan's terminal (`candidateArmSession.ts:1440-1442`); and the orphan's `syncScanLiveness`.
7. The item 68 words and every replacement here are drafts. None is the human's wording, and no string the app shows changes.

**What the code did not settle:**
- whether the kernel's `Cancelled` terminal is the kind a real `stop()` cancel delivers (FE3 assumes it, from `TerminalKind`);
- every App component test that reaches the real session (stop I2 stays the guard);
- the lines of `filter-panel.mjs` that the gate cites, which I did not re-read.

**Files read** (in the read-only checkout at the head):
- governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md (whole)
- state/consults/2026-11-22-untiled-reissue-mint-window-full-form-architect-note.md (from its OPEN items to its end)
- frontends/shell/src/residency/candidateArmSession.ts (76-89, 236-255, 595-619, 1100-1539, 1700-1918)
- frontends/shell/src/residency/candidateArmSession.test.ts (1-270, 370-430, 3280-3389, 3730-3969)
- frontends/shell/src/residency/candidateArmSession.refusal.test.ts (1-170)
- frontends/shell/src/streaming/tileViewportStreamManager.ts (405-479)
- frontends/shell/src/streaming/viewportStreamManager.ts (196-217)
- frontends/shell/src/streaming/transport.ts (26-89)
- frontends/shell/src/canvas/tileGrid.ts (1-60)
- frontends/shell/src/canvas/WorkingCanvas.tsx (1645-1674, 1738-1845; fitAnchor grep)
- frontends/shell/src/skp/client.ts (40-139)
- frontends/shell/src/App.tsx (540-563, 1118-1147, 2154-2173; issueQueryRef and resetFitForNewGeneration greps)
- KNOWN-LIMITATIONS.md (520-533)
- governance/PLAN.yaml (the node)
- docs/PREREGISTRATION-TEMPLATE.md (95-177)
- governance/AUTONOMY.md (§21, §22, §31)

Also read, from the custodian's copies: ADV-2026-11-22-16, ADV-2026-11-22-19, and the architect's form gate report, attempt 1.
