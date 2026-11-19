Reviewed: PR #338 at ba3e2ed010bb924d14a544298451c88ff0f5d5dc (the custodian's filing note, 2026-11-19: the reviewer's attempt 2, scoped by ADV-2026-11-19-25 item 7 to the lines changed since attempt 1; Bash 30, Read 3, SubagentHandback 1, none errored, model claude-opus-5-5, from 2026-11-19T15:59:31Z to 16:16:45Z by its transcript; the report below byte for byte from its hand-back of 13329 bytes, sha256 1557d528a69654667df67f692ab79b28443d6275c2d2e3bda90cb658e7fc09f1, nothing masked by the custodian, with this note in its first line and one final newline. Its check 1 found ADV-2026-11-19-25 staged and not yet committed on main: records commit 1119ag was then running, and it landed at 948ab342), gate, reviewer, attempt 2
Gate: PR #338, kl-pins, reviewer, attempt 2, at ba3e2ed010bb924d14a544298451c88ff0f5d5dc (cut/kl-pins @ ba3e2ed010bb924d14a544298451c88ff0f5d5dc)
Verdict: PASS WITH NOTES

Nothing blocks. Item 68's three lines match the ruling's fence byte for byte. The six pin hashes recompute: two old, four new. Only the five expected lines changed. Both verify scripts return rc 0 at the head. There is one note for the advisor (N-1, below), on a clause in the comment. It is not blocking.

Paths: `<S>` is the session scratchpad. `<W>` is C:/dev/wt/pins. "cas" means `frontends/shell/src/residency/candidateArmSession.ts`. Code line numbers are at ba3e2ed0.

## Checks

**1. Byte check.** I wrote a script, `<S>/g338r2-bytes.mjs`, and ran it twice (rc 0 both times).
- **Against the ruling's sources.** I ran it once against the file staged on main and once against the custodian's copy `<S>/ADV-2026-11-19-25.copy.md`. That copy is 6130 bytes, with sha256 b796fdad5a2ee58af42038d5af85521b39914b19982bf6f917d6623bb49f22a3. Both its size and its hash match what the ruling's filing note gives.
- **The ruling is not committed on main.** At main 8ed6de02 it is staged only (`A` in the porcelain). The staged file has no CR.
- **Both runs printed the same result:**
  - the fence has 3 inner lines;
  - line 529 is equal (196 bytes);
  - line 530 is equal (954 bytes);
  - line 531 is equal (3326 bytes);
  - the file's last two bytes are `3e0a`, so it ends with one newline;
  - there is no CR in the file;
  - the bold line at ee411613 (line 529) equals the bold line at the head.

**2. Item 68, clause by clause, at the head.**
- **The code is the same as on main.** `git diff --stat ba3e2ed0 origin/main` over frontends/kernel/engine/protocol/renderer is empty. The merge-base is 203ceef1.
- **Paragraph:**
  - **"An Apply or a Clear starts a new first data load…":** true.
    - Apply and Clear: `handleApplyFilter` → `applyFilterWith` (App.tsx:1133-1134) → `issue(bbox, null, f)` (App.tsx:1107-1113) → `issueQueryRef.current` = `session.reissueUnrestricted` (App.tsx:1724).
  - **"…any other change of the filter that is applied":** true. `changeClauses` → `applyFilterWith` (App.tsx:2085). Its callers are the command bar's `onAddClause` (App.tsx:2125) and `ClauseCards onChange` (App.tsx:2248).
  - **"applying Colour by can start one too (item 56)":** true.
    - The effect calls `issueQueryRef.current(null, null, activeFilterRef.current)` (App.tsx:2062).
    - It does so only when `attributesNotHeld === dataset` (App.tsx:2061). Item 56 states that condition, and "can" covers it.
  - **No other caller.** The only other callers of `reissueUnrestricted` are the open (App.tsx:1757) and the instrumented-only `queryWithFilter` hook (App.tsx:1727-1734).
  - **"…goes on treating it as the current one … until the new load's stream has been set up":** true. `untiledStreamHandle = stream` happens only at cas:1322, after `viewportQuery` (:1304) and `dataPlaneAttach` (:1309).
  - **"…the map can ask for tiles of the view it shows at that instant, under the filter the new load carries, as it does when a first data load of a view completes (item 64)":** true.
    - The path: the block at cas:1497-1511 → `handleViewportChange(box)` → `manager.onCameraChange(bbox, currentFilter)` (:1555), where `currentFilter = filter` (:1730).
    - "can" now matches the block's condition at :1508.
  - **"If it does, then when the new load itself completes the map asks for no tiles…; it asks for them at your next pan or zoom":** true.
    - `hasPlanned = true` (:1564).
    - The new terminal takes `if (hasPlanned) { emitResidencyStatus(); }` (:1473-1474), and then fails `!hasPlanned && // (iv)` (:1501).
    - The next plan comes from `onViewportChanged` → `debounced` → `handleViewportChange` (:1703-1708, :1526).
  - **The last two sentences:** unchanged since attempt 1. My attempt 1 readings still hold (the code is the same).
- **Comment, the clauses that are new or changed:**
  - **The callers list ("reached, through issueQueryRef … by the Filter section's Apply and Clear, by changeClauses…, and by the effect that asks again when Colour by changes its column"):** true, as above. The effect's other condition, `attributesNotHeld`, is not named. The phrase identifies the effect and does not claim it always asks; see N-2.
  - **"…runs only when that block's whole condition holds: its terms (i) to (viii), a shown box, and a grid frame":** true. The terms are cas:1498-1505, and :1508 adds `box !== null && manager.gridFrame !== null`.
  - **"establishFrameFromExtent sets it at an untiled look's terminal from latestUnionedExtent, which reissueUnrestricted has just cleared":** true.
    - The frame is written only at `this.frame = deriveTileGridFrame(anchor, unit)` (tileViewportStreamManager.ts:470), which is guarded by `if (this.frame !== null) return;` (:469).
    - Its only product caller is cas:1238, inside `establishFrameFromExtent`. That function is called only at :1430, inside `onTerminal`.
    - `latestUnionedExtent = null` is at :1758.
  - **"…plans only when a frame was set before the reissue or, by reading and not run, when batches of the previous load arrive inside the moment and give that terminal an extent":** true.
    - The old stream's batches pass `if (untiledStreamHandle !== stream) return;` (:1331).
    - `ingestAndMaybeEstablishFrame` then sets `latestUnionedExtent = outcome.fitAnchor` (:1150).
    - The canvas writes `fitAnchorRef.current = outcome.unionedExtent` (WorkingCanvas.tsx:1798), after `resetFitForNewGeneration` has nulled it (:1645).
  - **"Without a frame it plans nothing, the new load's own terminal sets the frame and plans, and the case does not arise":** true.
    - The old terminal, Completed, with `hasPlanned` false, skips S1's block (:1472) and fails :1508.
    - Then the new terminal establishes the frame (:1430) and plans.
  - **"an Apply or a Clear made while the open's own first load is still running is of that kind":** true when no batch of the open's look arrives inside the moment. See N-1, `to the advisor`.
  - **"For a Clear the filter recorded is none, so the earlier view's tiles are asked for unfiltered":** true. The path: FilterPanel `submit("")` → `predicateTextToFilter` returns `null` (attempt 1's chain) → cas:1730 `currentFilter = null` → :1555.
  - **"Not examined: what else the previous load's batches do…, since the sink takes them as current":** true (:1331).
  - **Every other clause of the comment** is unchanged from attempt 1 and checked there. The code is the same, and the readings hold.

**3. C-1, D-1, O-1 and the Clear, by the ruling's items 1 to 4.**
- **Item 1, C-1:** answered. "asks" became "can ask". The next sentence now opens "If it does". The comment names the grid frame as the deciding term and names C-1 by name.
- **Item 2, D-1:** answered. The comment no longer cites item 64's comment. It names the block's whole condition, which matches cas:1497-1508.
- **Item 3, O-1:** answered. The first sentence now covers any applied filter change and Colour by. The comment names `changeClauses` and the Colour by effect.
- **Item 4, the Clear:** answered by the comment's sentence on the unfiltered tiles.

**4. The pins.** I recomputed them with `<S>/g338r2-pins.mjs` (rc 0). It takes sha256 over lines a to b of `git show <rev>:<path>`, each line with its LF. The blobs have no CR.
```
old frontends/shell/src/workspace/filterClauses.ts:84-108 @ 203ceef1beae got 890fd8a1650621e6d93a8b64b50c15040a9f0da5cdeedc9c0e2403d18bd3ab4d OK
old frontends/shell/src/table/tableSource.ts:119-126 @ 203ceef1beae got a01339792fc150f637bcee047ac17d86efc7f6060a9696f67dcb124bf9360390 OK
new frontends/shell/src/workspace/filterClauses.ts:87-101 @ 203ceef1beae got eecdc47e656828bc6953d9a06969a715bbbd75a1d5fb562147caaf359b0946b3 OK
new frontends/shell/src/table/tableSource.ts:119-129 @ 203ceef1beae got 7ef5360f8eae352fc8fdac6c4991ef5cfec0ec14113ff9178d7b9cb1323e2245 OK
new frontends/shell/src/table/tableSource.ts:119-135 @ 203ceef1beae got 377aed9acbfd79b2223a4efba2dd3d81a0b88a018530579fd7ed410f5a6432b6 OK
new frontends/shell/src/table/tableSource.ts:140-142 @ 203ceef1beae got e3b646455686687fd552bf44ea0347f9b5e0d4ddc6b5ef1be93e974a4c8f681e OK
fail: 0
```
- **Coverage (I read each range at 203ceef1):**
  - **L448, "proposeClauseChange's refusal" → 87-101.** The range holds `blockerOf` (87-90) and both `{ kind: "refuse", reason: "advanced-alone", … }` returns (95, 101). This answers D-3.
  - **L480, "start supersedes and resets" → 119-129.** The range holds `++this.run` (121), `this.reset(filter)` (125) and `if (previous !== null) await this.cancelHandle(previous);` (129). This is the range I proposed for D-2.
    - The issue itself (`viewportQuery` at :135) lies outside the range. That fits "supersedes and resets", which is not a claim about the issue.
  - **L488, "start, superseding and resetting" → 119-135 and 140-142.** These hold the cancel and the next query (129, 135), and the late cancel of a stale handle (`await this.cancelHandle(stream);` at 141). This is the range I proposed for D-2.

**5. Nothing else changed.**
- `git diff --stat ee411613 ba3e2ed0` reads `KNOWN-LIMITATIONS.md | 10 +++++-----`, 1 file.
- The line count is equal at both commits, and the changed lines are 448, 480, 488, 530 and 531 (`<S>/g338r2-bytes.mjs`).
- `<S>/g338r2-ctx.mjs` (rc 0) took each old line, swapped its old pin text for the new pin text, and compared the result with the line at the head. All three were equal: `448 … equals new: true`, `480 … true` and `488 … true`. So on those three lines only the pins changed.

**6. verify-cites and verify-quotes.**
- **I ran both myself** in `<W>`, at HEAD ba3e2ed010bb924d14a544298451c88ff0f5d5dc, with an empty porcelain before and after, under node v24.18.1. Both exited rc 0 (`cites_rc=0`, `quotes_rc=0`).
- **The logs:** `<S>/g338r2-cites.log` was last written 2026-11-19T16:07:30Z and `<S>/g338r2-quotes.log` 2026-11-19T16:15:45Z. Their last lines:
```
verify:cites PASS — every rooted (in-tree) path:line reference across 3347 file(s) resolves. (196 loose reference(s) advised above.)
verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 936 ruling cites resolved, 0 ruling-cite errors.
```
- **A correction to attempt 1.** "125 verified" is unchanged from attempt 1, but the pins went from 157 to 158. So that count is not the pin count. Attempt 1's line "`125 verified` equals the 125 new pins" was a coincidence, not proof. The pin proof is check 4's recompute.

## Findings

**Correctness:** none.

**Evidence:** none.

**Documentation** (must-fix before the merge): none.

**Notes:**
- **N-1, `to the advisor`, not blocking.** The comment's clause "an Apply or a Clear made while the open's own first load is still running is of that kind" is not always true.
  - **Where it holds.** It holds when no batch of the open's look arrives inside the moment.
  - **Where it fails** (by reading; not run). When such a batch does arrive, the preceding sentence's second path applies:
    1. The batch passes cas:1331 and sets `latestUnionedExtent` (:1150, from WorkingCanvas.tsx:1798).
    2. The old terminal, with `frameEstablished` reset false (:1746), then sets the frame at :1430.
    3. It then plans the shown box under the new filter (:1508-1510).
  - So for that Apply, the case does arise.
  - A load that completes inside the moment may well deliver its last batch inside it too, so this sub-case may be the common one.
  - It needs timing inside one request round trip, so it does not block under §31. I do not reword it. Two side effects of this path are for the advisor's information, under the comment's "what else the previous load's batches do":
    - the frame would be anchored on that partial union;
    - the batch is decoded with the old look's filter (the closure's `filter`, :1346).
- **N-2, information only.** The comment's "the effect that asks again when Colour by changes its column" leaves out the effect's `attributesNotHeld === dataset` condition (App.tsx:2061). The paragraph's "can … (item 56)" carries that condition, so neither the paragraph nor the comment is untrue.
- **CI at the head** (`gh run list`, head SHA ba3e2ed0): DCO sign-off (pull_request), Exposure scan (pull_request), Ported notices (pull_request) and Ported notices (push) all succeeded. `gh pr checks 338` shows four passes.
- **The end state.** HEAD is ba3e2ed0 and the porcelain is 0. `ls-remote` gives `ba3e2ed010bb924d14a544298451c88ff0f5d5dc refs/heads/cut/kl-pins`.

## Runs

- **Reused:** none.
- **Reproduced:**
  - verify-cites and verify-quotes in `<W>` at the exact head (check 6);
  - the two old pin hashes, before the four new ones (check 4).
- **My own scripts** (in `<S>`, all read only):
  - `g338r2-bytes.mjs` (the byte and line diff);
  - `g338r2-pins.mjs` (the pin recompute);
  - `g338r2-ctx.mjs` (proof that only the pins changed, and their context);
  - `g338r2-diff.txt` (the saved diff).
- **CI** was read by `gh`. Nothing was re-run.
- I wrote nothing tracked and took no merge or PR action.

## Model

Opus 5.5 (claude-opus-5-5), as the harness reports.
