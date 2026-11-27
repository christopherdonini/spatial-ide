Reviewed: PR 358 at 55a6be7966051a2c8d96c85bb8b78157a2c04509, the corrections b119889b and 55a6be79 against 17845a0c, in C:/dev/wt/mint (the custodian's filing note, 2026-11-22: the reviewer's narrow read of the two corrections, a note to its build gate by ADV-2026-11-22-29 item 6 (gate-log attempt 2), node:untiled-reissue-holds-earlier-look-handle-until-mint@gate-reviewer-1-note, resumed at 2026-11-22T18:03:47.348Z; its run: Read 1, Bash 16, SubagentHandback 1, by unique call ids, 0 calls errored; model claude-opus-5-5, from 2026-11-22T18:04:01Z to 2026-11-22T18:07:21Z by its transcript; 0 calls named the main checkout. Filed below the rule from its hand-back, 8970 bytes, sha256 4253887e249e4ea75f3c057be240d11e8a8ed86791622bbd52dc90044a3d80d4, byte for byte except that 0 scratch-folder paths are written as <S>, and with one final newline added. PASS WITH NOTES. Its N-1, one line of the S-b comment in its words, is applied by correction 3, dispatched at 2026-11-22T18:09:52.228Z; its check 4 withdraws its gate's reading of the status-line route)

---

Verdict: PASS WITH NOTES (cut/untiled-reissue-mint-window @ 55a6be7966051a2c8d96c85bb8b78157a2c04509)
Reviewed: 55a6be7966051a2c8d96c85bb8b78157a2c04509

The correction is words and comments only, and all five texts are applied exactly as their sources give them. My earlier D-1, D-2 and D-3 are each fixed. I was wrong in my gate's check 5: the session-end route does change the status line, so the clause the advisor approved was untrue, and the new sentence repairs it. One clause of the new S-b comment is untrue when tiles are still queued; replacement words are below. That is a Documentation finding, to be fixed before the merge. Nothing blocks.

All result files are in `<S>`. Code cites are at 55a6be79, a branch commit, unless another commit is named. The worktree was clean at 55a6be79, and I wrote only `<S>/mintn-*` files.

**Check 1: words and comments only** (`<S>/mintn-check1.txt`, rc 0)
- One `node` script over `<S>/mintn-diff-U0.txt` (`git diff -U0 17845a0c 55a6be79`) found exactly two files:
  - `KNOWN-LIMITATIONS.md`: 4 changed lines.
  - `frontends/shell/src/residency/candidateArmSession.ts`: 40 changed lines, every one a comment line (`//`, `*` or `/**` after its indent).
- No code line changed.

**Check 2: applied as given** (`<S>/mintn-check2.txt`, rc 0)
- One `node` script took the fences (the lines between a ```` ```text ```` line and the next ```` ``` ````) from `<S>/ADV-2026-11-22-29.md` (2 fences), `<S>/mint-arch-gate-1-report.md` (4) and `<S>/mint-arch-gate-2-report.md` (4). In each place below, the new text occurs once and the old text is gone:
  - the item 68 sentence, in `KNOWN-LIMITATIONS.md:529`;
  - D1, the `reissueUnrestricted` doc, in `candidateArmSession.ts`;
  - D2, the `untiledStreamHandle` doc, in `candidateArmSession.ts`;
  - item 68's comment clause, in `KNOWN-LIMITATIONS.md:530`;
  - the S-b comment, in `candidateArmSession.ts`.
- The old item-68 sentence and the old comment clause appear nowhere else in the file (0 each).
- **Control:** the same comparisons at 17845a0c give every old text once and every new text 0 times (`<S>/mintn-check2-control.txt`).

**Check 3: each new clause against the code**
- **Item 68's sentence (the advisor's wording under the delegation; not reworded):** every clause is true.
  - "if the previous load ends because the file has changed, or because the watch on it lost coverage": `isSessionEndedTerminal` matches only those two codes (`streaming/liveTicketSet.ts:58-63`). The untiled sink calls it before any gate on the look (`candidateArmSession.ts:1391-1394`).
  - "the app ends the session, as it does whenever it learns that": the same `TileViewportStreamManager.endSession` (`tileViewportStreamManager.ts:747-760`) is reached from `notifySessionEnded` (`:776`), a tile's terminal (`:1103`), a tile's mint refusal (`:970`) and App's event route (`App.tsx:787-789`). Every route then runs `onSessionEnded`, then `endCandidateSession` (`candidateArmSession.ts:1116-1130`), then App's `endSession`.
  - "Otherwise the new view is filled as after any other filter change": as at my gate (MW2, FE1 (a) and FE2 are green at 17845a0c), and the correction changes no code.
  - With the exception in place, the earlier sentence is true:
    - every other end of an earlier look reaches the status line only through blocks gated on `wasCurrent` (`:1421`, `:1480`, `:1496`);
    - the session-ending end returns before the frame call (`:1393`, ahead of `:1451`);
    - `syncScanLiveness` (`:1533`) drives the scan item, not the status line.
- **D1 (the `reissueUnrestricted` doc, `:249-252`):** true, and it removes my D-1.
  - The latches `:1312-1328` come before the generation check at `:1331`.
  - They resolve `stopped` or `session-ended` at `:1314`, `:1319` and `:1327`.
  - A cancel is requested through `skpCancel` at `:1313`, `:1318`, `:1326` and `:1332`, each with its rejection swallowed.
  - `startStream` is only at `:1536`.
- **D2 (the `untiledStreamHandle` doc, `:485-489`):** true, and it removes my D-2.
  - The look's own terminal clears the handle at `:1374`; `cancelUntiledStream` clears it at `:1293`.
  - `cancelUntiledStream` is called from `relinquishFill` only with a frame (`:1907-1908`), from `stop()` (`:1818`) and from `endCandidateSession` (`:1123`).
  - The only assignment is at the mint (`:1335`).
- **Item 68's comment (the architect's words for the worker's comment):** true, and it removes my D-3. "never started" is `:1536`, after every early return. "requests its cancel" is the four `skpCancel` calls above. The latches-first order is `:1312-1328` before `:1331`.
- **S-b comment (`candidateArmSession.ts:1002-1016`):** every clause is true but one. The true ones:
  - **The three guarded sites:** `:1215-1217`, `:1572-1575` and `:1759-1761`.
  - **"`relinquishOutstanding` and `stop` never call `onTileSuperseded`":** neither body calls it (`tileViewportStreamManager.ts:822-850`, `:861-876`).
  - **The drop-at-drain clause:** marked as the old comment's reading. Note that `drainQueueIfRoom` returns at once after a session end (`:921` area, `if (this.sessionEnded) return`).
  - **The unguarded route:** `clearAll` → `cancelTileStream(…, true)` (`:703`, `:1126-1127`) → `onTileSuperseded`.
  - **"before `endCandidateSession` clears every tile":** `onSessionEnded` runs last (`:759`).
- **The untrue clause:** "when the last tracked tile goes, the emission below runs once".
  - `trackedTileCount` is `tileState.size` (`tileViewportStreamManager.ts:447-449`).
  - `clearAll` reports only the in-flight tiles, in its first loop (`:702-704`). Queued and minting tiles leave `tileState` afterwards with no report (`:705-718`).
  - So when any tile is queued or being minted, no report sees a count of 0, and the emission does not run even though the last tracked tile goes. A large plan with queued tiles when the file changes is ordinary use.
  - The architect's own section 1 states the condition ("none queued or being minted"), but the comment drops it.
  - These are the architect's words, not the human's or the advisor's. Replacement:
    - Old (occurs once, `:1014`): ``      // whose `cancelTileStream` reports each in-flight tile here; when the last tracked tile goes,``
    - New: ``      // whose `cancelTileStream` reports each in-flight tile here; when the tile it reports is the last one tracked (none queued or being minted, which `clearAll` then drops unreported),``
    - Clause check: the reports come from `:702-704`; the unreported drops are `:705-718`; the count is `:447-449`. The next line, "the emission below runs once, …", stands: with at least one tile in flight and nothing else tracked, only the last report sees 0.

**Check 4: my check 5's reading**
- The architect's attempt 2, section 1, holds by my reading:
  1. `endSession` calls `clearAll` (`tileViewportStreamManager.ts:754`).
  2. Its in-flight loop calls `cancelTileStream(…, true)` (`:702-704`), which calls `this.opts.onTileSuperseded` (`:1126-1127`).
  3. That is the session's `onTileSuperseded` (`candidateArmSession.ts:985`), which runs `emitResidencyStatus()` at `:1017` when `trackedTileCount === 0`. Nothing sets `suppressNestedSupersededEmit` on this route: its only setters are `:1215`, `:1572` and `:1759`.
  4. `emitResidencyStatus` dispatches through `deps.onResidencyStatusChange` (for example `:775`), which App binds to `setResidencyStatus` (`App.tsx:1772-1777`).
- My gate's check 5 looked only along App's `endSession` path and missed this route. Its conclusion, that the clause "does not change the status line" was true of the built code, is withdrawn. The clause was untrue as approved, as attempt 1's C1 said, and the advisor's new sentence repairs it.

**Check 5: the commits and CI** (`<S>/mintn-commits.txt`, `<S>/mintn-gh.txt`)
- **Commits.** b119889b and 55a6be79 each carry one `Signed-off-by:` line. The only addresses in each message are the sign-off's and `noreply@anthropic.com`. The diff's added lines hold no address.
- **CI.** `gh pr checks 358`, read at 2026-11-22T18:06:39Z, gave rc 8 (checks pending):
  - passed: sign-off, profile path, ported-notices ×2;
  - pending: `typecheck · build · vitest · cargo test` ×2 and `tauri build` ×2.
  - `gh pr view 358` gives head 55a6be79 and `isDraft` true.
  - The pending checks are a note, not a finding.

**Findings**
- **N-1, Documentation, must fix before the merge:** the S-b clause above, with its replacement words. It is a comment line, so it is part of the class 9 line ADV-2026-11-22-29 item 5 records in the closing amendment.

**Notes**
- **What the closing amendment must still carry:**
  - the observed failing sets of M-3 and M-4 (FE2 at `candidateArmSession.mintWindow.test.ts:454:53 @ 17845a0c`) and M-FE3b's extra failures, by reference, with §4 unedited;
  - the class 9 S-b line.
- ADV-2026-11-22-27 and ADV-2026-11-22-29 must be on main before the merge.
- CI was pending at my read time.

Model: claude-opus-5-5 (Opus 5.5).
