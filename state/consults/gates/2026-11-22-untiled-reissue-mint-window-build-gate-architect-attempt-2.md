Reviewed: PR 358 at b119889b2d6c90707cdd45635868a83377f8d051, the correction alone, in C:/dev/wt/mint, with the base read at 8922b843529519ae1f7a028669a1b8356a7d74f9 in C:/dev/wt/read-mint (the custodian's filing note, 2026-11-22: the architect's build gate, attempt 2 on the correction (gate-log attempt 4), by ADV-2026-11-22-29 item 3, node:untiled-reissue-holds-earlier-look-handle-until-mint@gate-architect-2, resumed at 2026-11-22T17:56:46.332Z; its run: Read 8, Grep 6, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T17:57:01Z to 2026-11-22T17:59:30Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 10669 bytes, sha256 645bb65ac2d4683d5f5582e2740c00dc5549ee6e9b0ac53e1ccbce09c0c4f0e8, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. PASS WITH NOTES. The words of its sections 2 and 3 are applied as given at 55a6be79, dispatched at 2026-11-22T18:02:33.215Z)

---

Verdict: PASS WITH NOTES
Reviewed: C:/dev/wt/mint @ b119889b2d6c90707cdd45635868a83377f8d051
REPORT PATH: state/consults/gates/2026-11-22-untiled-reissue-mint-window-build-gate-architect-attempt-2.md

The advisor's new sentence for item 68 holds against the built code, so nothing blocks now. The rulings' items 4 and 5 still need applying: both sets of words are below. They are words only and need no re-gate. ADV-2026-11-22-29 is the advisor's ruling under the delegation of 2026-11-13, not the human's words.

Line numbers are reading aids at b119889b. In `candidateArmSession.ts`, lines after `:486` sit 4 lines lower than at 17845a0c. Cites marked "B" are at 8922b843.

## 1. Ruling item 3: the advisor's new sentence in item 68 (`KNOWN-LIMITATIONS.md:529`)

All three clauses hold.

- **Only those two ends reach the session's end.**
  - `isSessionEndedTerminal` matches only a detail that starts with `engine.source_changed: ` or `engine.source_coverage_lost: ` (`streaming/liveTicketSet.ts:58-63`).
  - The untiled sink calls it before any gate on the look (`candidateArmSession.ts:1395-1398`).
  - No other branch of that `onTerminal` reaches `notifySessionEnded` or `endCandidateSession`.
- **The route is the same as at any other time.** An earlier look's terminal calls `manager.notifySessionEnded`. That is the same method the App's session-ended event route calls on the candidate arm (`App.tsx:787-789`, through `endSessionForReason` at `:1544-1553`). Tile terminals (`tileViewportStreamManager.ts:1103`) and tile mint refusals (`:970`) reach the same private `endSession` (`:747-760`). Every route then runs `onSessionEnded`, `endCandidateSession` (`candidateArmSession.ts:1120-1134`), App's `endSession` (`App.tsx:1488-1500`) and `handleSessionEnded` (`:708-722`).
- **With the exception, the earlier sentence is true.** For any other end of an earlier look, nothing in `onTerminal` (`candidateArmSession.ts:1367-1537`) sends a residency status ungated:
  - S1's block, the relinquished re-emit and `failedCoveringTerminals.set` are gated on `wasCurrent`.
  - The first-look plan and the frame call are gated on the generation.
  - `markTilePartial` sends no status.
  - `syncScanLiveness` drives the scan item, not the status line. The scan reset inside the window is the §31 (c) case the comment already names.
  - So the only status-line change is inside the exception.

**Which reading holds (the locator).** Attempt 1's reading holds: the session-end route does send a residency status. The reviewer looked for `setResidencyStatus` on App's `endSession` path, but the status comes in through the session:
1. `endSession` calls `clearAll` (`tileViewportStreamManager.ts:754`, `:701-704`).
2. `clearAll` calls `cancelTileStream(…, true)` for each in-flight tile (`:1120-1130`, `:1126-1127`).
3. That calls the session's `onTileSuperseded`, whose `emitResidencyStatus()` runs at `candidateArmSession.ts:1021`. Nothing sets `suppressNestedSupersededEmit` on this route.
4. `deps.onResidencyStatusChange` then reaches `setResidencyStatus` (`App.tsx:1772-1777`).

It runs once, when the last tracked tile goes: at least one tile in flight, none queued or being minted.

## 2. Ruling item 4: words for item 68's comment (`KNOWN-LIMITATIONS.md:530`; the old text occurs once)

```text
A ticket minted after a later reissue began is cancelled (skpCancel) and its stream is never started, and that call of reissueUnrestricted resolves superseded.
```
```text
A ticket minted after a later reissue began is never started: issueUntiledQuery requests its cancel (skpCancel), and that call of reissueUnrestricted resolves superseded, or stopped or session-ended when stop() ran or the session ended first, because the latches are read before the generation.
```
Clause check, against `candidateArmSession.ts`:
- "never started": every early return comes before `startStream` (`:1540`).
- "requests its cancel": `skpCancel` is awaited and its rejection swallowed (`:1316-1318`, `:1321-1323`, `:1329-1331`, `:1336`).
- "superseded": `:1335-1338`.
- "stopped or session-ended … first": the `stopped` and `sessionEnded` checks (`:1316`, `:1321`, `:1329`) come before the generation check (`:1335`).

## 3. Ruling item 5: the S-b comment (`candidateArmSession.ts:1002-1020`; comment lines only; class 9 in the closing amendment)

It belongs to this piece: same file, and this piece's gate showed it untrue.
```text
      // S-b (re-reviewer gate, residency-debt cut 1b): DEFENSIVE, and UNREACHABLE in production today
      // -- stated plainly, not implied otherwise. This module's own manager construction has exactly
      // three call sites that can synchronously recurse into `onTileSuperseded`
      // (`ingestAndMaybeEstablishFrame`'s self-cancel, `handleViewportChange`'s re-plan,
      // `reissueUnrestricted`'s full clear), and every one of them now wraps the one manager call that
      // can do so in `suppressNestedSupersededEmit = true` for its entire duration (S-a, above) --
      // `onTileSuperseded` is never invoked from anywhere else in this module (`manager`'s own
      // `relinquishOutstanding`, `tileViewportStreamManager.ts`, states plainly it "never calls
      // `onTileSuperseded`" at all). Entry 66 (b)'s second batch adds ONE new producer inside the
      // manager -- `drainQueueIfRoom`'s drop-at-drain, for a queued tile no longer in view at mint
      // time -- and it does not widen this: a queued tile can only BE out of view at a drain when the
      // drain is the one nested inside `onCameraChange`'s own prune (that method's own comment), i.e.
      // inside `handleViewportChange`'s already-guarded call. So `!suppressNestedSupersededEmit`
      // still reads `false` at every call site this callback can actually fire from today, and the
      // emission below never runs. Kept
      // rather than deleted as the honest fallback for a producer this module does not yet have: if a
      // future change ever called `onTileSuperseded` from OUTSIDE those three guarded sites, this line
      // is what keeps the S2 settling-moment obligation from silently going missing for it. TODAY, that
      // obligation is carried entirely by `onTerminal`'s own identical emit, below.
```
```text
      // S-b (re-reviewer gate, residency-debt cut 1b; corrected at the mint-window piece's build gate):
      // three call sites in this module can synchronously recurse into `onTileSuperseded`
      // (`ingestAndMaybeEstablishFrame`'s self-cancel, `handleViewportChange`'s re-plan,
      // `reissueUnrestricted`'s full clear), and each wraps the one manager call that can do so in
      // `suppressNestedSupersededEmit = true` for its entire duration (S-a, above), so the emission
      // below never runs from them. `manager`'s own `relinquishOutstanding` and `stop` never call
      // `onTileSuperseded`. Entry 66 (b)'s second batch adds `drainQueueIfRoom`'s drop-at-drain, which
      // by this comment's first reading finds a queued tile out of view only inside `onCameraChange`'s
      // own prune, i.e. inside `handleViewportChange`'s already-guarded call. One route is not
      // guarded: the manager's session end (`TileViewportStreamManager.endSession`, reached through
      // `notifySessionEnded` from the untiled sink's `onTerminal` and from `App.tsx`'s session-ended
      // event route, and from a tile's own session-ended terminal or mint refusal) runs `clearAll`,
      // whose `cancelTileStream` reports each in-flight tile here; when the last tracked tile goes,
      // the emission below runs once, before `endCandidateSession` clears every tile. Otherwise the S2
      // settling-moment obligation is carried by `onTerminal`'s own identical emit, below.
```
Clause check:
- **The three guarded sites:** `candidateArmSession.ts:1219-1224`, `:1576-1582` and `:1763-1768`.
- **`relinquishOutstanding`:** the manager's own doc (`tileViewportStreamManager.ts:808`) says it never calls `onTileSuperseded`.
- **`stop`:** it reports nothing (`:861-876`).
- **The drop-at-drain claim:** carried over from the old comment as its reading, and marked as such. I did not re-derive it.
- **The unguarded route:** `endSession` `:747-760` and `clearAll` `:701-704`. It is reached from `candidateArmSession.ts:1395-1398`, `App.tsx:787-789` and `tileViewportStreamManager.ts:970` and `:1103`.
- **"Once, when the last tracked tile goes":** the in-flight loop runs first, while queued and minting tiles still count in `tileState` (`:703`, `:447-449`).
- **"Before `endCandidateSession`":** `onSessionEnded` runs last (`:759`).

## 4. Ruling item 7: the same route exists at B
At B an earlier look's session-ending terminal also ends the session ungated:
- `isSessionEndedTerminal` and `manager.notifySessionEnded` are at `candidateArmSession.ts` B `:1376-1378`. That is after `wasCurrent` (B `:1358`) and gated on nothing.
- `endCandidateSession` is at B `:1110`, and the same unguarded emit at B `:1011`.
- `tileViewportStreamManager.ts` is unchanged by the piece (B `:747-760`, `:701-704`, `:1120-1130`).

For the v0.2 line:
- An earlier load's end that says the file changed or the watch lost coverage ends the session at v0.2, as at any time.
- That end returns before the frame call (B `:1376-1378` comes before the frame gate), so it does not freeze the grid. The frame fault comes only from the earlier load's other ends.
- The v0.2 words should not say that the earlier load's end never changes the status line.

## 5. D1 and D2
Applied exactly as I gave them: `candidateArmSession.ts:249-252` and `:485-489`.

Nothing else changed:
- Item 68's text differs only by the ruling's sentence, which matches its item 2 byte for byte by reading.
- Item 68's comment is unchanged.
- No code line changed.

## Notes (Documentation, to fix before the merge)
- **N1:** apply the words of §2 and §3 as given, with no re-gate. Record §3 as a class 9 line in the closing amendment (ADV-2026-11-22-29 item 5).
- **N2:** attempt 1's D3 (the closing amendment records the failing sets of M-3, M-4 and M-FE3b) and D4 (ADV-2026-11-22-27, and now -29, on main before the merge) still stand.

## Files read
- `<S>/msg-mint-arch-2.md`, `<S>/ADV-2026-11-22-29.md`, `<S>/mint-diff-b119889b.txt`, `<S>/mint-rev-gate-1-report.md` (check 5)
- `C:/dev/wt/mint/frontends/shell/src/residency/candidateArmSession.ts`, `C:/dev/wt/mint/frontends/shell/src/streaming/liveTicketSet.ts`, `C:/dev/wt/mint/frontends/shell/src/streaming/tileViewportStreamManager.ts`, `C:/dev/wt/mint/frontends/shell/src/App.tsx`, `C:/dev/wt/mint/KNOWN-LIMITATIONS.md`
- `C:/dev/wt/read-mint/frontends/shell/src/residency/candidateArmSession.ts`
