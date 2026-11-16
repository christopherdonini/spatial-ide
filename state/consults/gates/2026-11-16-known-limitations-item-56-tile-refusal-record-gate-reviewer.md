Reviewed: PR #328 at 6f98980e9a9fc77b28a577a61b0852544817c4bb, its one gate, the reviewer (filed by the custodian, 2026-11-16: the hand-back below byte for byte, 15577 bytes, sha256 a35793e5f993452f37b8d5122e8e5f079fd62dab92b32ddf501f39c3c1465d42, model claude-opus-5-5, 53 calls (Bash 49, Read 3, SubagentHandback 1), 1 errored; this line added above it)

**FAIL (one wording finding on the advisor's span; the code is correct and nothing in it needs to change)** — `cut/known-limitations-item-56-tile-refusal-record @ 6f98980e9a9fc77b28a577a61b0852544817c4bb`

Tag: `node:known-limitations-item-56-tile-refusal-record@g1`. I wrote nothing in any worktree or in the main checkout. The worktree was clean (porcelain empty) before and after the checks, and HEAD = 6f98980e.

**Inputs checked by command.**
- The brief: 5548 bytes, sha256 8297896b…2aba. It matches.
- The drafter's report `<S>/kl56-drafter-report.md`: 6551 bytes, sha256 9c6c9474…0eb3. It matches.
- I read whole: the form, ADV-2026-11-16-05, the architect's read and the drafter's report.

## Checks

1. **The diff.** I ran `git -C C:/dev/wt/kl56 diff --stat 2e99751d… 6f98980e…` (rc 0): `KNOWN-LIMITATIONS.md | 4 ++--`, one file. `-U0` shows one hunk, `@@ -481,2 +481,2 @@`. My script `<S>/kl56rev-check2.mjs` (rc 0) compares every line: the only differing lines are `[481, 482]`, the file is 510 lines on both sides, and there are no CR bytes. **Holds.**

2. **Line 481 outside the span.** Same script, rc 0.
   - Main's line has each anchor once (start at offset 340, end anchor at 478).
   - On the head, §A's fenced text (462 chars, no newline) occurs once, at offset 340.
   - The text before the span is equal (340 bytes) and the text after it is equal (211 bytes).
   - §A's fence is byte-equal to the ruling's line 21 at 799e0db4.
   - **Holds.**

3. **The clauses** (cites are `path:line @ 6f98980e`; FSM = `frontends/shell/src`).
   - *"Together they can leave a request refused with the code engine.connections_exhausted."* **Holds.**
     - `kernel/src/skp.rs:2241-2246` maps `EngineError::ConnectionsExhausted` to `connections_exhausted`.
     - `engine/src/pool.rs:99` sets `MAX_STREAM_CONNECTIONS = 4`.
     - `FSM/canvas/tileGridConstants.ts:40` sets 3 tile streams in flight.
   - *"A refused request is never a wrong result."* **Holds for the map.**
     - `kernel/src/skp.rs:1484-1490`: `open_engine_stream(...).map_err(...error_of)?` returns before `self.tickets.mint` at `:1508`.
     - The shell catches the refusal and takes no data: `FSM/streaming/tileViewportStreamManager.ts:948-1000` and `FSM/residency/candidateArmSession.ts:1283`.
   - *"For the first look after an open or an Apply, the code is shown by name."* **Holds on both paths.**
     - Open:
       - `FSM/App.tsx:1738` calls `reportViewportOutcome(session.reissueUnrestricted(...))`.
       - `candidateArmSession.ts:1707` and `:1283` let the `SkpCallError` reject unchanged.
       - `App.tsx:1536` calls `setViewportRefusal(formatRefusal(e.skpError))`.
       - `App.tsx:2397-2399` renders `.admission-refusal-code` with `{viewportRefusal.code}`. It is suppressed only while the session-ended block, which shows the same code, stands.
     - Apply:
       - `App.tsx:1705` sets `issueQueryRef` = `session.reissueUnrestricted`.
       - `App.tsx:357`, `:374` and `:388` give `applyFilter` → `{kind:"refused", refusal}`.
       - `FSM/filter/FilterPanel.tsx:60` and `:136-138` render `RefusalBlock`, and `FSM/admission/RefusalBlock.tsx:28` renders `{refusal.code}`.
       - A card or bar change goes through the same call and also renders `RefusalBlock` (`FSM/filter/ClauseCards.tsx:101-104`).
   - *"For a tile of the map it is not shown."* **Holds.**
     - The catch at `tileViewportStreamManager.ts:949-1000` calls `logMintRefused` (`:951`, `:276-284`; `logSessionEvent` at `:283`).
     - It calls no `onTerminal`, no `onTileSuperseded` and no session callback.
     - The candidate session gives App no failure callback (`App.tsx:1650-1700`).
   - *"the map asks again once for a tile it was refused"* **Holds, conditionally.**
     - `:982-993`: the tile is requeued when the code is `RETRYABLE_ENGINE_CODE` (`:321`, `:329-332`), it has not been retried yet, it is still in view, and `this.queue.length < MAX_QUEUED_TILES` (`:987`).
     - Timing case (it does not block, §31): if a pan fills the queue to 512 while the tile's request is in flight, the tile is dropped after its first refusal and never asked for again. Outside a plan the queue cannot get back to 512, because each requeue follows a pop. So this needs a camera change inside the refused request's round trip. It is named for the source comment; words are in D4.
   - *"if that request is refused too, the tile is not loaded"* **Holds**, by `:995-997` (the tile is dropped).
     - Note: a tile that was already partly loaded is asked for again, because `isTileResident` means complete (`candidateArmSession.ts:935`; `tileViewportStreamManager.ts:608`). If that request is refused twice, the tile keeps the part it held, since the drop clears nothing.
     - This is still "not loaded" in the plain reading. It goes to the advisor, and it does not block.
   - *"the code is written to the session log alone"* **Holds.**
     - `logSessionEvent` invokes only `binding_log_session_event` (`FSM/diagnostics/log.ts:20-31`).
     - No other path out of that catch carries the code.
   - *"the status bar says at most that some areas were not loaded"* **Does not hold as worded.** This is finding C1. What the status bar can show after a second refusal:
     - **Tiles still tracked when it is dropped.**
       - The last terminal emits (`candidateArmSession.ts:1054`).
       - `isFillComplete` is false, because the dropped tile is in `lastCoveringTileKeys` and not complete (`:668-689`, loop at `:685`). `settledState` therefore gives a partial reading (`residencyStatus.ts:330-336`).
       - Within budget, the bar reads `:435` ("…some areas were not loaded…"). If another stream failed, it reads `:422` ("…part of this view failed to load…").
       - **Over budget, it reads `:468` plus `:414`:** "Showing N features — the farthest areas of this view are not drawn, to stay within the render budget. Zoom in to see more detail. Filling has finished for this view — the render budget is full; pan or zoom to see other areas."
       - That says more than "some areas were not loaded": it gives the render budget as the reason. For the refused tile that reason is wrong, and the tile need not be farthest.
       - Ordinary use can reach this. The other in-flight tiles' batches can set `overBudget` after the drop, and nothing clears it before the settling emit (`candidateArmSession.ts:741-757`, `:1599`). A large dataset with the Table and an export open is enough. This is by reading; a run would confirm it.
     - **Can anything say the view is complete?** By reading, no.
       - "Showing all N" (`residencyStatus.ts:463`) needs `settled-complete`, and `isFillComplete` rules that out while the dropped tile is missing.
       - A "Showing all" still standing from an earlier view is cleared at the plan: the plan's emit (`candidateArmSession.ts:1599`) runs while tiles are tracked, and so sends `candidate-fill-progress` (`:842`), which the reducer maps to null (`residencyStatus.ts:204`).
     - **The architect's stale case: the dropped tile was the last one tracked.**
       - The drop path calls back into the session for nothing, so no emit runs and `syncScanLiveness` does not run.
       - The bar keeps what stood: nothing, or an earlier partial, failure or budget sentence. By reading, it is never "Showing all".
       - The scan state stays `issuing`. For that state the status-bar mirror shows no text (`App.tsx:553-561`; the candidate arm sends only issued and reset, `candidateArmSession.ts:601-603`). The filter panel's Cancel stays visible, but that is outside the status bar.
       - **Only a run can settle** whether ordinary use reaches this case, and what the bar then shows. It is consistent with "at most" (silence is less), so it is not a finding on the span. It belongs to the stream-refusal node.

4. **Line 482.**
   - The new first part says all four things the Change line names:
     - the human's wording but for the span;
     - the advisor's wording under the delegation of 2026-11-13, from ADV-2026-11-16-05;
     - why it replaces the human's clause ("because a refused tile request does not show the code");
     - where the code does each thing, by symbol.
   - It holds no line numbers; my script's only matches are dates and the ruling id.
   - Every symbol exists at the head and does what the comment says:
     - `logMintRefused`, `RETRYABLE_ENGINE_CODE` and `mintAndStart` in `tileViewportStreamManager.ts`;
     - the within-budget partial text and `SETTLED_PARTIAL_SUFFIX` in `residencyStatus.ts`, neither of which names a code;
     - `reportViewportOutcome`, `applyFilter` and `RefusalBlock`;
     - `viewport_query` in `kernel/src/skp.rs`.
     - The exception is that `formatRefusal` is placed "in App.tsx". It is defined in `FSM/admission/formatRefusal.ts:27` and only called from App.tsx (D3).
   - **The kept part is not byte-equal as the brief states it.** I checked with `<S>/kl56rev-check4.mjs` (rc 0):
     - `Approved in governance/forms/root/KNOWN-LIMITATIONS-UNDECLARED-BEHAVIOURS-AND-GRADED-ITEMS-PREREGISTRATION.md` does not occur on main's line 482. Main reads `The human's wording, approved in …`.
     - From ` in governance/forms/root/KNOWN-LIMITATIONS-UNDECLARED-…` to the end of the line, head and main are byte-equal.
     - So the drafter capitalised one byte and moved "The human's wording" into the new part. The drafter's "byte for byte" claim is off by that byte (D1).

5. **The released records.**
   - `KNOWN-LIMITATIONS.md:191` is a source comment. It pins the tile refusal as logged, the single requeue, the drop and the partial sentence. It makes no "shown by name" claim.
   - `governance/RELEASE-0.1.md:1276` records that at v0.1.0 "the shell's minting code discards the refusal silently", and that the `engine.connections_exhausted` hypothesis was refuted. That is the opposite of a "shown by name" claim, and the line says nothing of a tile retry.
   - So the drafter's lead sentence ("not clean … the same line cites the tile retry") misdescribes it. This is report-only and changes nothing.
   - I did a spot check rather than a full rerun: `grep -i "shown by name\|connections_exhausted"` over `RELEASE-0.1.md`, `MANUAL-WALKTHROUGH.md` and `RELEASE-DAY-CHECKLIST.md`, plus `git ls-files | grep -i release`. It agrees with the drafter: no such claim.

6. **The drafter's checks.** I reused none of them. The drafter ran them on the staged tree before the commit, with no tree id, so I could not tie them to 6f98980e. I reran each in `C:/dev/wt/kl56` at 6f98980e, on this machine's Node:
   - `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 3140 files; the loose advisories are only in exempt `state/drafts/`.
   - `node scripts/plan/forms-layout.mjs`: rc 0, PASS, 234 files.
   - `node scripts/hooks/profile-path-scan.mjs --range 2e99751d… 6f98980e…`: rc 0, clean, 1 commit, 2 added lines. This replaces `--staged`, which has nothing staged to read at a committed head.
   - `timeout 1200 node scripts/plan/verify-quotes.mjs`, in the background: rc 0, PASS (156 checked, 125 verified, 30 baselined, 1 advisory, 0 errors). The log is `<S>/kl56rev-vq.log`.

7. **Mutation:** none was made, as the form declares.

## Correctness (blocking; the words only)

**C1. The span's clause "and the status bar says at most that some areas were not loaded."** When the view is over budget, the bar names the render budget as the reason areas are missing (`residencyStatus.ts:468` + `:414`). Ordinary use can reach this, by reading. The words are the advisor's under the delegation, not the human's; the advisor rules them. Replacement for the span's last sentence:

> For a tile of the map it is not shown: the map asks again once for a tile it was refused, and if that request is refused too, the tile is not loaded, the code is written to the session log alone, and the status bar never names it: at most it says that some areas were not loaded, or that areas are not drawn to stay within the render budget.

How each new clause checks against the code:
- "never names it": every residency string is a constant or a count (`residencyStatus.ts:414`, `:422`, `:435`, `:463-473`; relinquished text in the same file). None carries a code.
- "some areas were not loaded": `:435`. The failure variant `:422` and the relinquished "the rest of this view was not loaded" fall under it.
- "or that areas are not drawn to stay within the render budget": `:466-468`, with suffixes `:414` and `STALLED_SUFFIX`.
- "at most": "Showing all" is excluded while the tile is missing (`candidateArmSession.ts:668-689`), and the stale case is silence or an earlier one of these sentences.
- The rest of the sentence is unchanged and checked under 3.

## Evidence

None. Every claim the piece makes resolves against the code or a check run at 6f98980e.

## Documentation (must fix before the merge; line 482 is the drafter's wording, so the worker applies these words with no re-gate and the PR body lists them)

- **D1.** Replace `The rest of this comment is the human's approved wording as it stood. Approved in` with `The rest of this comment stands as it was before this change: the item's wording was approved in`.
  - This misattributes the comment's own prose (its pins, the "Where the code does this" list and "Not covered") to the human, and the capital A breaks the kept tail.
  - With these words, the tail from ` in governance/…` is byte-equal to main's (checked by script). They also restate what main's `The human's wording, approved in …` said.
- **D2.** Replace `The Table and an export are not said to show the code in the span: the export panel's path was not established to.` (the last clause is ungrammatical) with `The span says nothing of the Table or of an export: how the export panel shows the code was not established.`
  - The span has no Table or export clause.
  - The architect's read leaves `PublishPanel` unread past `:750`.
- **D3.** Replace `through reportViewportOutcome and formatRefusal in App.tsx` with `through reportViewportOutcome in App.tsx and formatRefusal (frontends/shell/src/admission/formatRefusal.ts)`.
- **D4.** This is the §31 timing case from 3, to be recorded in the source comment. Insert before ` The rest of this comment`: `Not covered (§31c): a tile refused just after a pan has filled the map's queue (MAX_QUEUED_TILES, in mintAndStart's requeue test) is not asked for again; that needs a camera change inside the refused request's round trip.`
  - Checked at `tileViewportStreamManager.ts:987` and `:995-997`. Outside a plan the queue cannot reach 512 again.

## Notes (do not block)

- The partly-loaded tile case (see 3) goes to the advisor. Optional words: append `(a tile already partly loaded keeps only that part)` after "the tile is not loaded".
- The stale-status case after the last tracked tile is dropped, and what the bar then shows, needs a run. It belongs to `shell-tiled-arm-stream-refusal-shown-to-the-user` (ADV-2026-11-16-05 item 4 (b)), not to this piece.
- The drafter's report misdescribes `RELEASE-0.1.md:1276` and overstates the "byte for byte" kept part. Both are report-only.

Files:
- C:/dev/wt/kl56/KNOWN-LIMITATIONS.md
- C:/dev/wt/kl56/frontends/shell/src/streaming/tileViewportStreamManager.ts
- C:/dev/wt/kl56/frontends/shell/src/residency/candidateArmSession.ts
- C:/dev/wt/kl56/frontends/shell/src/residency/residencyStatus.ts
- C:/dev/wt/kl56/frontends/shell/src/App.tsx
- `<S>/kl56rev-check2.mjs`, `<S>/kl56rev-check4.mjs` and `<S>/kl56rev-vq.log`, where `<S>` is the session scratchpad named in the brief.