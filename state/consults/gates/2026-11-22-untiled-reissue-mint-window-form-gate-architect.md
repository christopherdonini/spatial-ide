Reviewed: governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md on main at 466318621a13f00ae7b1114a4690582be42bdc94 (the custodian's filing note, 2026-11-22: the architect's form gate on the full form, attempt 1, node:untiled-reissue-holds-earlier-look-handle-until-mint@form-gate-architect-1, read in a detached read checkout at that head; Read 35, Grep 42, Glob 3, SubagentHandback 1, by unique call ids, 1 calls errored; model claude-opus-5-5, from 2026-11-22T15:47:39Z to 2026-11-22T16:00:27Z by its transcript; 0 calls named the main checkout; no compaction. Filed byte for byte below the rule from its hand-back, 19154 bytes, sha256 c4fe5009f75cedbf8e62cbaef32d1dc833f1e87a705a3f5a19c56e39d7616cb2, with one final newline added. Its replacement words land as the form's Amendment 1, by the architect, with ADV-2026-11-22-16 item 3.)

---

Verdict: PASS WITH NOTES. Reviewed: main @ 466318621a13f00ae7b1114a4690582be42bdc94 (detached read checkout C:/dev/wt/read-1122). Every cite below is path:line at that commit.

Mapped onto AUTONOMY §22:
- **Correctness:** nothing is open once R1 to R3 land. Each is a wording defect in what the form claims or declares, and no code exists yet. Under §31 my words close them with no re-gate, and none of the three is the human's wording.
- **Evidence:** nothing is open once R4, R5 and R7 land.
- **Documentation:** R6 and R8 to R15 must be fixed before dispatch.

**How the words must land.** The form is already on main at this head, and its header says "Append-only once committed" (form line 5). AUTONOMY.md:385 also makes a preregistration immutable as filed. So R1 to R15 should land as an appended §13 Amendment 1, written before any code, carrying each old/new pair. They should not be applied in place. R4 is a reading of what B means, not an edit of §7's ceiling.

## 1. The claim and the mechanism against the code at the head

Every read of the code in §2.1 and §2.2 is true at this head. Every line range sits exactly where the form puts it. One range is wrong.

Ranges confirmed:
- `candidateArmSession.ts`:
  - `reissueUnrestricted` at 1718–1787; the sessionEnded check at 1729; `return issueUntiledQuery` at 1786.
  - `issueUntiledQuery` at 1292–1521; the handle assigned at 1322.
  - `onBatch`'s handle check at 1331; `wasCurrent` at 1358.
  - S1's block at 1472–1485; the first-look block at 1497–1512.
  - The two "Not covered (AUTONOMY §31)" notes at 1468–1471 and 1491–1496.
  - The module doc bullet at 80–86; the `untiledStreamHandle` doc at 479–483; the interface doc at 239–250.
- `App.tsx`: `applyFilter` at 358–400 (commit and reset only on `issued`, 394–399); `issueQueryRef` bound at 1801; the open's first look at 1834; Colour-by at 2140–2147; `changeClauses` at 2154–2174; `reportViewportOutcome` at 1597–1614.
- `viewportStreamManager.ts`: `RequestOutcome` at 79–87; the latch read before the generation at 204–213 (the order §2.3 item 3 cites).
- Interfaces: `transport.ts:79-83` has `StreamSink`'s four members; `adapterWs.ts:18-20,37` has `startStream`; `client.ts:111,132` has `viewportQuery` and `cancel`; `candidateArmSession.ts:23` imports `cancel` as `skpCancel`.

The wrong range is in §2.1, the canvas bullet. The range 151–156 covers only `shownViewportBbox`'s type. The other three members are typed at `WorkingCanvas.tsx:193` (`resetFitForNewGeneration`), `:233` (`pushTileBatch`) and `:344` (`applyTileViewportContext`). The range 1652–1664 holds `shownViewportBbox` and `resetFitForNewGeneration` only; `pushTileBatch` is implemented at `:1740` and `applyTileViewportContext` at `:1885`. R8 fixes this.

The mechanism is sound by reading:
- `issueUntiledQuery` has one caller, `candidateArmSession.ts:1786`, so the open's first look also takes a generation.
- `reissueUnrestricted` is synchronous up to that call, so the increment cannot interleave with anything.

Three wording defects, closed by R1 to R3:
- **(a) §1's second may-claim is unconditional, and the code will not support that.** The `stopped` checks (`:1305-1313`) and the `sessionEnded` check (`:1318-1321`) come before the planned generation check. A superseded mint therefore resolves `stopped` or `session-ended` when one of those latches came first. Per ADR-018, "is cancelled" is also better said as "a cancel is requested". (R1)
- **(b) §2.3 item 5 says scan liveness inside the window is "as today", and §5 declares "scan liveness and log lines" unchanged. Both are false by design.**
  - Today an earlier look's Completed terminal inside the window plans (`:1510`), so tiles are tracked.
  - After the fix it plans nothing. `manager.clearAll()` (`:1740`) has left nothing tracked, and the terminal's handle-clear (`:1359`) empties the handle, so `hasOutstandingWork()` (`:601`) is false. The closing `syncScanLiveness()` (`:1513`) then dispatches `reset` (`:612-617`).
  - The same terminal now writes the superseded variant of `candidate-untiled-terminal` (`:1404`) and no `candidate-first-look-view-planned` line (`:1509`).
  - As written, P3 and this declaration would fail at the gate as class 2. (R2, R3)

## 2. OPEN items 1 to 5

- **OPEN-1: I agree with (a).** It leaves the handle's readers unchanged (`:601`, `:1117`, `:1284`, `:1886`). Option (c) self-cancels, which suppresses the log line (`:1394-1405`) that S-1 asserts at `candidateArmSession.test.ts:3333`.
- **OPEN-2: I agree with (a).** Without it, mints resolving out of order let the earlier look overwrite the handle (`:1322`). That look then fails its own generation term, and the newer look fails the handle term (`:1331`), so both are dropped. The fix mirrors baseline's `viewportStreamManager.ts:208-213`.
- **OPEN-3: the drafter's reading of the `establishFrameFromExtent` call reads true. I do not rule on it.**
  - The call at `:1429-1431` is gated only on `!(wasSelfCancelled && manager.gridFrame !== null)`, not on `wasCurrent`.
  - `latestUnionedExtent` is fed by every admitted batch (`:1150`) after the reissue's reset (`:1758`). The fit anchor behind it is reset at `:1745`, reaching `WorkingCanvas.tsx:1661`.
  - `establishGridFrame` freezes the frame only while none exists (`tileViewportStreamManager.ts:468-471`), and `tileGrid.ts:24` says the anchor is the whole look's union.
  - Two nuances for the advisor. First, with a frame in place the call also sets `frameEstablished` (`:1242`), so the current look's own terminal returns early (`:1235`) and its own frame log line never appears; `establishTileGridContext` is idempotent (`WorkingCanvas.tsx:1881`). Second, the case is pre-existing, and by reading it needs no timing inside one round trip: only the new look's first batch arriving before the orphan's terminal.
- **OPEN-4: I agree with (a). The item 68 words read true against the code at what an operator can see.**
  - "Set aside": the `onBatch` term, and the `wasCurrent` gates at `:1406`, `:1458`, `:1472` and `:1498`.
  - "Filled as after any other filter change": the first-look block (`:1497-1512`), with `hasPlanned` still false at the new look's terminal.
  - The triggers: `App.tsx:1801`, reached from `:1145-1146`, `:2168` and `:2145`.
  - "After an Apply" also holds for an Apply that is itself superseded or refused, because the generation rises before the mint.
  - Not covered by "set aside": OPEN-3's frameless anchor. It changes no drawn result.
  - These are the advisor's words.
- **OPEN-5: four suites are not enough; add `e2e/filter-panel.mjs`.** It drives Apply, Clear and a refused Apply with its recovery re-issue through the real DOM on the shipped default arm (`filter-panel.mjs:200-220`, `:257-278`, `:462-478`). That is the path the generation now sits on (`App.tsx:363-389`). (R5, R6)

## 3. What the code did not settle

- **Does an existing test overlap two reissues?** By reading, none of the session suites does.
  - In `candidateArmSession.test.ts`, every `reissueUnrestricted(` call is awaited before the next reissue, except two. `:3743` (SH15) is one held reissue ended by the session's end. `:3916` (U-FL2 (a), second case) is one held reissue with `relinquishFill`. Neither starts a second reissue before its mint resolves.
  - In `candidateArmSession.refusal.test.ts`, all calls are awaited (`:161`, `:363`, `:385`, `:403`, `:422`, `:432`, `:441-442`, `:461`).
  - `App.reopen.test.tsx:368-378` holds a single reissue. `App.lateResult.test.tsx:312` mocks the session.
  - S-1 (`:3290-3337`), S-C (`:3339-3379`), U-FL2 (d) (`:3945-3952`) and T-C (`:2705`) see their orphans only after the next mint, so their results are unchanged.
  - I did not read every App component test that reaches the real session through `App.tsx`. Stop I2 stays as the guard.
- **Can `../App` be imported where MW7 needs it?** Yes, without editing any existing file. `candidateArmSession.refusal.test.ts:17-20` mocks `../skp/client` with `importOriginal`, and `:38` imports `nextScanState` from `../App` under that mock set. `applyFilter` is exported from the same module (`App.tsx:358`). Stop I7 is settled by reading.

## 4. The tests and the mutations

- **Can each prediction fail?** Yes. MW1 to MW5 match the probe's lines A and C (the reviewer's report, check 7). For MW5, base takes the `candidate-first-look-failed` branch (`:1481-1483`), because `untiledRowsSeen` was reset to 0 (`:1760`) while the frame exists. MW6 and MW7 fail at base on `issued` and `applied`.
- **Are the mutations specific?**
  - M-1 targets `wasCurrent` and fails MW1, MW2, MW3 and MW5.
  - M-2 targets `onBatch` and fails MW4.
  - M-3 targets the mint-time check and fails MW6 and MW7.
  - M-4 is ambiguous. Captured "after the awaits", meaning both, it behaves like M-3. Captured after the `viewportQuery` await, it is deterministic, and it also fails MW7. (R12)
- **MW7 is ambiguous.** The session itself calls `canvas?.resetFitForNewGeneration()` at every reissue (`:1745`). "Ran once" must therefore name the `ApplyFilterDeps` mock (`App.tsx:328`, `:396`), not the canvas. (R11)
- **The §7 count after merging main is wrong.** Once main is merged in (§10), `B...H` with B as the dispatch base counts main's own lines in `KNOWN-LIMITATIONS.md`. It also names main's other paths. That would give a false class 8 or a false stop I4. (R4)
- **§8 is missing one item.** It has none for the code §5 declares unchanged, which is where OPEN-3 tempts a fix. (R13)
- **§9.3 needs `filter-panel.mjs`.** (R5) **§10 re-runs too little after a merge of main.** It re-runs only when a §7 file changed, but AUTONOMY.md:391 reopens a verdict on any source change. (R7)

## 5. The class and the gates

The full form, both gates and worker-high on the strongest model are right, by these authorities:
- ADV-2026-11-19-17 item 3 (its file, line 16).
- ADV-2026-11-16-06 item 2 (a) (line 25: concurrency, cancellation, and what the user is told) and item 5 (a) (line 38).
- AUTONOMY.md:325-327 (a cancellation guarantee; a property under test), plus the roughly 440 lines estimated against §21c.

Note that ADV-2026-11-16-06 ran for one week from 2026-11-16 (line 13). The class does not depend on it.

The merge waits for the tag in §9.5 and §9.6. That follows ADV-2026-11-21-15 item 1 (line 11) and item 4 (ii) (line 23), and ADV-2026-11-22-11 items 2 and 3 (lines 17 and 19). The Sonnet tester for the e2e runs follows ADV-2026-11-16-06 item 5 (b).

## 6. Contradictions

- The only contradiction between sections is §2.3 item 5 against §5, closed by R2 and R3.
- **docs/01:** principle 7 holds; nothing awaits on the canvas. Principle 8: a superseded mint writes no session-log line, as baseline's does not, and its cancel request is a Console entry through `client.ts`.
- **docs/02:** the change stays inside `residency/`.
- **docs/10:** the cancel is the existing control-plane `cancel`, and nothing changes on the wire.
- **ADR-006:** a superseded Apply commits nothing (`App.tsx:394-399`).
- **ADR-018:** "acknowledged" is not used, and R1 makes the cancel a request.
- **ADR-010:** no constant is added.
- **P6:** the only shown-string route is `ClauseCards.tsx:23,40-41`. `FilterPanel.tsx:59-60` shows nothing for `not-applied`.

## Replacement words

None of these is the human's wording. Each old text occurs once in the form.

- **R1 (§1)**
  - old: that look's ticket is cancelled through the existing `cancel`. No stream is started for it, and its promise resolves `{ kind: "superseded" }`.
  - new: a cancel is requested for that look's ticket through the existing `cancel`. No stream is started for it, and its promise resolves `{ kind: "superseded" }`, unless `stop()` ran or the session ended first, when it resolves `{ kind: "stopped" }` or `{ kind: "session-ended" }` as today: the latches are read before the generation (§2.3 item 3).
  - Clause check: `:1305-1313` and `:1318-1321` come before the planned check.
- **R2 (§2.3 item 5)**
  - old: so scan liveness and `relinquishFill` inside the window are as today;
  - new: so the handle that `hasOutstandingWork` and `relinquishFill` read inside the window is as today. Scan liveness differs in one case: an earlier look's Completed terminal inside the window no longer plans, so when no tile is tracked its closing `syncScanLiveness()` can dispatch `reset` until the new look is minted;
  - Clause check: `:601`, `:1886`, `:1740`, `:1359`, `:1513`, `:612-617`.
- **R3 (§5)**
  - old: - the session's handle-clear, frame establishment, scan liveness and log lines.
  - new: - the session's handle-clear, frame establishment and the text of every log line. Changed by design, inside the window only: an earlier look's terminal writes the superseded variant of `candidate-untiled-terminal` and no `candidate-first-look-view-planned` line, and scan liveness differs as §2.3 item 5 says.
  - Clause check: `:1402-1404`, `:1509`.
- **R4 (§7)**
  - old: - **Counting**, at a named commit:
  - new: - **Counting**, at a named commit H, with B read as `git merge-base origin/main H` at the count, so that a merge of main into the branch (§10) counts none of main's own lines (a reading of B, not an edit of the ceiling or its files):
- **R5 (§9.3)**
  - old: `e2e/regression.mjs`, `e2e/open-fills-fit-view.mjs`, `e2e/command-bar.mjs` and `e2e/project.mjs` (OPEN-5)
  - new: `e2e/regression.mjs`, `e2e/open-fills-fit-view.mjs`, `e2e/command-bar.mjs`, `e2e/project.mjs` and `e2e/filter-panel.mjs`, the last for the Filter section's Apply, Clear and refused Apply with its recovery re-issue on the shipped default arm (OPEN-5)
  - Clause check: `filter-panel.mjs:200-220,257-278,462-478`; `App.tsx:363-389`.
- **R6 (§12)**
  - old: **OPEN-5, the e2e list.** Recommended: §9.3's four suites.
  - new: **OPEN-5, the e2e list.** Recommended: §9.3's five suites.
- **R7 (§10)**
  - old: If that merge changes a §7 file, the reviewer makes a narrow read, and §9.3's e2e runs again at the final head.
  - new: If that merge changes a §7 file or any file under `frontends/shell/src/`, the reviewer makes a narrow read, and §9.3's e2e runs again at the final head (AUTONOMY §22: a change to source reopens the affected verdict).
- **R8 (§2.1)**
  - old: (`frontends/shell/src/canvas/WorkingCanvas.tsx`; the type at lines 151–156, the implementation at lines 1652–1664)
  - new: (`frontends/shell/src/canvas/WorkingCanvas.tsx`: the four members of the `WorkingCanvasHandle` interface and their implementations in the component's handle object, by symbol)
- **R9 (§2.3 item 6)**
  - old: the module doc's bullet that names "the one window where an earlier look is still held" (lines 80–86);
  - new: the module doc's bullet on the first look's `Completed` terminal, whose `wasCurrent` clause points to the sink's comment for the window in which an earlier look is still held (lines 80–86);
  - Reason: the quoted text breaks across `:83-84` with a comment prefix, so it is not byte-identical to its source.
- **R10 (§4)**
  - old: copied from the `open-first-look-fills-fit-view` describe block in `candidateArmSession.test.ts`.
  - new: copied from the describe block in `candidateArmSession.test.ts` whose name ends with `(open-first-look-fills-fit-view)`.
  - Clause check: `candidateArmSession.test.ts:3787`.
- **R11 (§4, MW7)**
  - old: `resetFitForNewGeneration` ran once
  - new: the `ApplyFilterDeps.resetFitForNewGeneration` mock, a function of its own and not the fake canvas's, ran once (the session's `canvas?.resetFitForNewGeneration()` runs at each reissue)
- **R12 (§4)**
  - old: - M-4: `lookGeneration` captured after the awaits instead of first. MW6 fails.
  - new: - M-4: `lookGeneration` captured after the `viewportQuery` await instead of first. MW6 and MW7 fail.
  - Clause check: the mints are held at `viewportQuery`, so the later reissue raises the generation before the earlier one resumes.
- **R13 (§8)**
  - old: `    - a pin read as current.`
  - new: `    - a pin read as current.` followed by a new line: 11. A change to the handle-clear, to `isSessionEndedTerminal`'s routing or to the `establishFrameFromExtent` call: OPEN-3 is the advisor's, and any addition there is class 9 (round 25, item 2 (a)).
- **R14 (§2.4)**
  - old: emits no status and records no failure here."
  - new: emits no status and records no failure here. Not covered (AUTONOMY §31), timing inside one request round trip: with a frame, a Cancel between a reissue and its mint cancels the earlier look, which the session still holds, and not the new one."
- **R15 (§2.4)**
  - old: `  - The draft says "here" because `establishFrameFromExtent` is not gated.`
  - new: that same line, followed by a new line: `  - The Cancel clause is `relinquishFill`'s frame-gated `cancelUntiledStream()`, which reads `untiledStreamHandle`, still the earlier look's inside the window.`
  - Clause check: `:1886-1887`, `:1283-1289`.

## Notes

- PLAN.yaml:7558 and :7562 show the node `unscheduled` with `gate: none`. The custodian sets the gate to the form before the node goes in progress.
- The planned superseded path swallows a rejected cancel, as its neighbours do (`:1306`, `:1311`, `:1319`) and as baseline does. The module's own rule at `:1262-1266` says such a rejection is reported and never dropped. Leave it as declared; this is a note only.
- MW1's "no tile `viewportQuery`" must not count the held untiled mint, which is itself a `viewportQuery` call. Either clear the mock after step 3 of setup S, or filter on a non-null bbox.
- The form's section numbers (§10 build, §11 stops, §12 OPEN, §13 amendments) differ from the template's §10. Class 8 still points at §7, which matches.

Files read (all under C:/dev/wt/read-1122):
- governance/forms/frontends/UNTILED-REISSUE-MINT-WINDOW-PREREGISTRATION.md
- state/consults/2026-11-22-untiled-reissue-mint-window-full-form-architect-note.md
- state/consults/gates/2026-11-19-open-first-look-fills-fit-view-gate-reviewer.md
- the four directives under state/directives/: ADV-2026-11-19-17, ADV-2026-11-21-15, ADV-2026-11-22-11, ADV-2026-11-16-06
- frontends/shell/src/residency/candidateArmSession.ts
- frontends/shell/src/residency/candidateArmSession.test.ts
- frontends/shell/src/residency/candidateArmSession.refusal.test.ts
- frontends/shell/src/App.tsx
- frontends/shell/src/App.reopen.test.tsx
- frontends/shell/src/canvas/WorkingCanvas.tsx
- frontends/shell/src/canvas/tileGrid.ts
- frontends/shell/src/streaming/viewportStreamManager.ts
- frontends/shell/src/streaming/tileViewportStreamManager.ts
- frontends/shell/src/streaming/transport.ts
- frontends/shell/src/streaming/adapterWs.ts
- frontends/shell/src/skp/client.ts
- frontends/shell/src/filter/ClauseCards.tsx
- frontends/shell/src/filter/FilterPanel.tsx
- frontends/shell/e2e/filter-panel.mjs
- KNOWN-LIMITATIONS.md
- governance/PLAN.yaml
- docs/PREREGISTRATION-TEMPLATE.md
- governance/AUTONOMY.md §21 and §22
- docs/01_Principles.md
- docs/adr/ADR-018-what-cancellation-acknowledged-means.md

Read in part (grep only): App.lateResult.test.tsx, e2e/regression.mjs and e2e/colour.mjs.
