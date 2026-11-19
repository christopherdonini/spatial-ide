Reviewed: PR #338 at ee41161355e0d8194cd13c1e5117cb3422f835e5 (the custodian's filing note, 2026-11-19: the reviewer, PR 338's one reader with no form (ADV-2026-11-16-06 item 2 (c)); Bash 56, Read 1, SubagentHandback 1, none errored, model claude-opus-5-5, from 2026-11-19T14:30:22Z to 14:44:56Z by its transcript; the report below byte for byte from its hand-back of 18134 bytes, sha256 68f602d386a929fc9f8e57dac435b20492ffb64699e2490946dbf9fc0885088b, nothing masked by the custodian, with this note in its first line and one final newline), gate, reviewer
Gate: PR #338, kl-pins, reviewer, at ee41161355e0d8194cd13c1e5117cb3422f835e5 (cut/kl-pins @ ee41161355e0d8194cd13c1e5117cb3422f835e5)
Verdict: PASS WITH NOTES
Nothing blocks. All 125 new pins recompute. P and H change only the lines they should. Five findings go with the PR; two of them, C-1 and D-1, are clauses of item 68 and go `to the advisor`.

Paths: `<S>` is the session scratchpad and `<W>` = C:/dev/wt/pins. B = 203ceef1beae60acbd9590060bba7bd0cb0fc2fc, P = e4c1044b0c41eccb875f90737a67968c8343c765, H = ee41161355e0d8194cd13c1e5117cb3422f835e5. "cas" means `frontends/shell/src/residency/candidateArmSession.ts`. Every code line I cite is at H. The diff B to H touches no code file, so these lines are also the lines at B. Text marked "(mine)" is my paraphrase. In two outputs below, a user-profile path and the GitHub URLs are masked as `<S>` and `<url>`; nothing else is changed.

## Checks

**1. Start.**
```
fetch=0
ee41161355e0d8194cd13c1e5117cb3422f835e5
porc=0
ee41161355e0d8194cd13c1e5117cb3422f835e5	refs/heads/cut/kl-pins
```
- HEAD is H and the porcelain is empty (no output). `ls-remote` gives H.
- origin/main was c945a3097aff8db4face541a4d2917ec62583488.

**2. The diff.**
```
15	11	KNOWN-LIMITATIONS.md
ee41161355e0d8194cd13c1e5117cb3422f835e5 docs: KNOWN-LIMITATIONS item 68, the reissue window, in the advisor's words (ADV-2026-11-19-22)
e4c1044b0c41eccb875f90737a67968c8343c765 docs: the eleven owed pins on main in KNOWN-LIMITATIONS' comment lines (ADV-2026-11-19-01 item 2)
KNOWN-LIMITATIONS.md
---
rc=0
203ceef1beae60acbd9590060bba7bd0cb0fc2fc
```
- `git diff --name-only B origin/main -- KNOWN-LIMITATIONS.md` printed nothing. Main has not changed the file since B.
- **P**, checked by `<S>/g338r-p.mjs` (rc=0). It found `changed count 11`, at L81 (item 4), L127 (9), L448 (45), L452 (46), L467 (51), L475 (53), L480 (54), L488 (56), L500 (59), L519 (65) and L523 (66).
  - For every line the script printed `commentBefore=true commentAfter=true`, `OLD mid: " follow on main after the merge"`, `old count of phrase: 1  new count: 0` and `outside-of-old-sentence untouched: true`.
  - So each new line is its old line, with only the span ` follow on main after the merge` of the sentence about the pins replaced by `, on main: …` and the pin list.
- **H**, checked by `<S>/g338r-h.mjs` (rc=0):
```
H starts with P bytes: true
added text ends with \n: true  ends with \n\n: false
added lines (by \n, last empty after final newline): 4
first added line empty: true
fence lines: 11:"````" 15:"````"
four-backtick fence lines count: 2
inner line count: 3
line 1 equal: true bytes 196
line 2 equal: true bytes 815
line 3 equal: true bytes 2269
H last two bytes hex: 3e0a
P last byte hex: 0a
H has CR: false
4	0	KNOWN-LIMITATIONS.md
```
  - The fence's source was ADV-2026-11-19-22 at origin/main. It was filed at 1e289d6699be7d615de165d7b8d1ac01e0ea7682, which is on main.

**3. The 125 pins.**
- My own script `<S>/g338r-pins.mjs` computes sha256 over `git show <rev>:<path>` lines a to b, each line with its LF. Its last line:
```
total pins on the 11 lines: 157, new: 125, hash ok: 157, fail: 0
```
- All 125 new pins at B match. The 32 older pins on those lines also match. Per line, the new pins number 5, 3, 5, 6, 21, 12, 17, 36, 2, 13 and 5. The full list, one entry per pin with its first and last line, is `<S>/g338r-pins.out`.
- `git diff --name-only B H` printed `KNOWN-LIMITATIONS.md` only.
- I read every range in context (`<S>/g338r-ctx.mjs`). Each range holds the named symbol and what the comment says it does, except where the findings say otherwise (D-2, D-3).
- I found no symbol named at a branch commit or by symbol without an entry.
- **Rule 2.** `git diff --name-only 1d2d4af9^1 1d2d4af9` lists `tableSource.ts` among PR B's files but not `candidateArmSession.ts`, `tileGridConstants.ts`, `TableTab.tsx`, `publish.rs` or `PublishDialog.tsx`.
  - So the only 0d13561d pins on PR B files are `tableSource.ts:116-122`, `:167-177` (L480) and `:131` (L519). This matches the worker.
  - The changed `start` (`this.request++;` inserted, now `tableSource.ts:122`) was re-pinned. I agree with :135 and with `:171-193` for "cancel and end": it is the smallest contiguous range holding both functions.
  - The `start` range was carried over with the old pin's gap; see D-2.
- **Judgement call 1** (no pin for `hostile_names_colliding_after_case_folding_bind_one_column_each`): I agree. L475 names that test under "Evidence for the changed names", not under "Where the code does this".
- **Judgement call 2** (cas:789-801, the settled-partial-failure branch of `emitResidencyStatus`, not the whole function): I agree. That branch holds the claim. :793-801 would leave out the four comment lines, but they explain this branch.

**4. Item 68** (KNOWN-LIMITATIONS.md:528-531 at H: 528 empty, 529 bold line, 530 paragraph, 531 comment).

Paragraph:
- **S1 "An Apply or a Clear starts a new first data load."** True.
  - `applyFilter` calls `deps.requestViewport(null, newFilter)` (App.tsx:357-362).
  - That is `issueQueryRef.current` = `session.reissueUnrestricted` (App.tsx:1724).
  - `reissueUnrestricted` returns `issueUntiledQuery(bbox, filter)` (cas:1718, :1786).
- **S2 "…goes on treating it as the current one for a short moment, until the new load's stream has been set up."** True.
  - `reissueUnrestricted` (cas:1718-1787) never writes `untiledStreamHandle`. The only writes are cas:1287 (`cancelUntiledStream`), :1322 and :1359.
  - :1322 runs only after the `viewportQuery` call (:1304) and the `dataPlaneAttach` call (:1309) have returned.
- **S3 "When the previous load completes inside that moment, the map asks for tiles of the view it shows at that instant, under the new filter…"** True when the map already has a grid frame; untrue without one (C-1).
  - `wasCurrent` is true (cas:1358).
  - Guard (iv) holds because `hasPlanned = false` (:1749). (vii) and (iii) hold because `relinquishClearPending = false` (:1752) and `lastEmittedRelinquishedUntiled = false` (:1757). (viii) holds because `cancelViewportDebounce()` (:1731, :1534).
  - :1507-1510 then plans `canvas?.shownViewportBbox?.()`, which is the camera last written (WorkingCanvas.tsx:1636-1642), through `handleViewportChange`.
  - That calls `manager.onCameraChange(bbox, currentFilter)` (cas:1555) with `currentFilter = filter` from :1730, and sets `hasPlanned = true` (:1564).
- **S4 "When the new load itself completes, the map then asks for no tiles of the view it shows; it asks for them at your next pan or zoom."** True.
  - The new terminal takes S1's branch, `if (hasPlanned) { emitResidencyStatus(); }` (cas:1472-1474), and the next block fails `!hasPlanned && // (iv)` (:1501).
  - The canvas's auto-fit does not report a view: `fitToExtent(residentExtentRef.current, false)` (WorkingCanvas.tsx:1803) reaches the `else` at :1444-1448, which sends `onViewShown` and leaves `lastQueriedRef` null.
  - So a resize afterwards asks nothing either (:2100-2110).
  - The next plan is the debounced `handleViewportChange` from `onViewportChanged` (cas:1703-1708, :1526). "Zoom to layer" (`fitToBounds`, WorkingCanvas.tsx:1608-1623, `notifyViewport: true`) is a zoom.
- **S5 "Until then the map can show only part… the status line can say that it is showing all the features in view."** True.
  - `settledState` needs a plan, no pending change, no tracked tile and no untiled stream (residencyStatus.ts:338-344).
  - The within-budget sentence is residencyStatus.ts:487. Probe line C saw it.
- **S6 "reached only in a test… not been seen in the running app."** It agrees with the filed check 7 (a unit test) and with ADV-2026-11-19-17 item 2: "No app-window run has shown it." I cannot test the negative.

Comment, by symbol:
- `reissueUnrestricted` starts the new load, and neither cancels the earlier look nor clears `untiledStreamHandle`. True (above). `manager.clearAll()` (:1740) clears tile streams, not the untiled one, which this session owns (:1351-1352).
- `issueUntiledQuery` sets the handle only after the `viewportQuery` and `dataPlaneAttach` calls. True (:1304, :1309, :1322).
- The untiled sink's `onTerminal` reads `wasCurrent` from that handle. True (:1358).
- The block after S1's plans `shownViewportBbox` through `handleViewportChange`, which sets `hasPlanned`. True (:1497-1511, :1564).
  - `hasPlanned` is set only when the plan's outcome is `planned` (:1559). That needs the frame that :1508 checks.
- The tiles carry the filter recorded in `currentFilter`. True (:1730, :1555).
- With `hasPlanned` set, the new terminal takes S1's branch, recomputes through `emitResidencyStatus` and plans nothing. True (:1472-1474, :1501).
- The next plan is `handleViewportChange` at a camera change (`onViewportChanged`). True (:1703-1708, :1526).
- "the within-budget sentence of residencyStatusText (frontends/shell/src/residency/residencyStatus.ts)". True (:487).
- "The plan of the paragraph's third sentence runs only when none of that block's other guards holds; item 64's comment lists them." The first half is true (:1497-1508). The second half is untrue (D-1).
- "Not examined" items:
  - The batches are taken as current: true (`if (untiledStreamHandle !== stream) return;` at :1331 lets the old stream's batches through).
  - On a failure, S1's block speaks: true (:1472, :1475-1484).

**The advisor's question: a Clear takes the same path as an Apply.**
- The path:
  1. `handleClearClick` calls `submit("")` (FilterPanel.tsx:70-73 at H).
  2. `submit` calls `onApply(predicateTextToFilter(text))` (:59).
  3. `predicateTextToFilter` returns `null` for `""` (frontends/shell/src/filter/predicateInput.ts:16-19 at H).
  4. `onApply={handleApplyFilter}` (App.tsx:2175) calls `applyFilterWith` (App.tsx:1133-1134).
  5. Its `requestViewport` calls `issue(bbox, null, f)` (App.tsx:1107-1113) inside `applyFilter(null, …)` (App.tsx:357-362).
  6. `issueQueryRef.current` (App.tsx:1724) calls `reissueUnrestricted(null, null)`.
- There is no point where it parts from an Apply. The one difference: cas:1730 records `currentFilter = null`, so S3's pre-fit tiles are asked for with no filter. "Under the new filter" then means no filter.
- S3 and S4 therefore hold for a Clear exactly as for an Apply, C-1 included.
- The probe ran only `reissueUnrestricted(null, f2)`, not a null filter, so for a Clear this rests on reading the code. The harness's U-FL5 test name says the seam is "Apply's, Clear's and the Colour-by refill's seam" (candidateArmSession.test.ts:4029 at H).

**The probe** (`state/consults/gates/2026-11-19-open-first-look-fills-fit-view-gate-reviewer.md` on main, lines 123-131; last changed at 65a72f7243d205e519f194de1b9175dd669286fd). It is tracked at H.
- "a unit test with a stand-in canvas and events ordered by hand"
  - Matches: line 123 reads "One test (53 lines) was inserted after U-FL6", and line A reads "after `reissueUnrestricted(null, f2)` and before the mint".
  - The stand-in is that harness's `firstLookCanvas`/`fakeCanvas` (candidateArmSession.test.ts:3826-3842 at H).
- "the tile requests of the earlier view carried the new filter": line A reads "which is SHOWN_BOX, the pre-fit box … Both tile queries carry `"zone = 2"`". Matches.
- "the new look's terminal planned nothing": line C reads "apply `[]`, planned lines `[]`". Matches.
- "the status read complete with the within-budget sentence": line C reads "Status `candidate-within-budget`, complete". Matches.
- "planned at the next viewport change": line D reads "`onViewportChanged(PENDING_BOX)` plus 120 ms: apply `[["4:4"]]`". Matches.

**5. The checks' runs.**
```
== kl68-cites.log
verify:cites PASS — every rooted (in-tree) path:line reference across 3347 file(s) resolves. (196 loose reference(s) advised above.)
== kl68-quotes.log
verify:quotes PASS — 156 checked, 125 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 936 ruling cites resolved, 0 ruling-cite errors.
diffstat_rc=0
 KNOWN-LIMITATIONS.md | 4 ++++
 1 file changed, 4 insertions(+)
```
- Times in UTC, from `date -u -r` and the commit date:
  - kl68-cites.log 2026-11-19T13:55:54Z;
  - kl68-quotes.log 2026-11-19T14:03:29Z;
  - `<W>`/KNOWN-LIMITATIONS.md last written 13:54:13Z, before both runs;
  - H committed 14:03:51Z.
- The file's sha256 in `<W>` (d34f5145ee044f1595c5d3a310ff59b87859bc638f580e5947c04071abace92b) equals H's blob. `git diff --stat H` is empty.
- So both runs read the tree that H commits. `125 verified` equals the 125 new pins.

**6. CI.** Read at 2026-11-19T14:42:25Z. `gh pr checks 338` (rc=0, URLs masked):
```
every commit is signed off	pass	12s	<url>
no profile path in the range	pass	10s	<url>
ported-notices	pass	9s	<url>
ported-notices	pass	8s	<url>
```
`gh run list --branch cut/kl-pins` (rc=0):
```
… ee41161355e0d8194cd13c1e5117cb3422f835e5 Exposure scan pull_request completed success 2026-11-19T14:08:41Z
… ee41161355e0d8194cd13c1e5117cb3422f835e5 DCO sign-off pull_request completed success 2026-11-19T14:08:41Z
… ee41161355e0d8194cd13c1e5117cb3422f835e5 Ported notices pull_request completed success 2026-11-19T14:08:41Z
… ee41161355e0d8194cd13c1e5117cb3422f835e5 Ported notices push completed success 2026-11-19T14:07:43Z
… e4c1044b0c41eccb875f90737a67968c8343c765 Ported notices push completed success 2026-11-19T13:52:50Z
```
No run on the branch is red or cancelled, at either commit.

**7. End.**
```
ee41161355e0d8194cd13c1e5117cb3422f835e5
rc=0
0
ee41161355e0d8194cd13c1e5117cb3422f835e5	refs/heads/cut/kl-pins
```
HEAD is H, the porcelain is 0 bytes and `ls-remote` gives H (read at 2026-11-19T14:42:38Z).

## Findings

**Correctness**

**C-1. Not blocking. `to the advisor`.** Item 68's S3 is untrue when the map has no grid frame yet: an Apply or Clear made while the open's own first look is still running.
- The frame is set only in the untiled terminal: `establishFrameFromExtent(latestUnionedExtent)` (cas:1430).
- `reissueUnrestricted` sets `latestUnionedExtent = null` (:1758), and `establishFrameFromExtent` returns on a null extent (:1235).
- So if the open's first look completes inside the window, no frame is set. :1508 (`manager.gridFrame !== null`) then plans nothing.
- The new look's own terminal then sets the frame and, with `hasPlanned` false, plans the shown box. The defect does not happen.
- The one exception: batches of the old look arriving in the window, which the comment leaves "Not examined".
- Apply is enabled during a load (`disabled={busy}`, FilterPanel.tsx:111 at H).
- It does not block: the whole window needs timing inside one request round trip, and the sentence overstates the effect rather than hiding it.
- It should be named in the item's source comment. The words are the advisor's (ADV-2026-11-19-22 item 3), so I propose no words.

**Evidence**

None.

**Documentation** (must be fixed before the merge)

**D-1. `to the advisor`.** "item 64's comment lists them" is untrue.
- The block's guards are cas:1498-1505, (i) to (viii), plus `box !== null && manager.gridFrame !== null` at :1508.
- Item 64's comment (KNOWN-LIMITATIONS.md:515 at H) names:
  - a failed first look, which is (v);
  - a Cancel during the first look, which is (ii), (iii) and (vii);
  - the timing case, which is (i);
  - a first look with no geometry, which leaves no grid frame (:1508).
- It does not name (vi) `!stopped && !sessionEnded`, (viii) `!pendingViewportChange`, or a null shown box.
- The words are the advisor's.

**D-2. Loose pin `frontends/shell/src/table/tableSource.ts:119-126 @ 203ceef1…`, in L480 and L488.** These are the worker's pins, so the worker applies the correction.
- The range stops at `this.phase = "loading";`.
- The code's own doc of `start` reads "Supersedes: cancels the held handle first, then issues for `filter`." (tableSource.ts:118 at B).
- The cancel is at :129 (`if (previous !== null) await this.cancelHandle(previous);`) and the issue at :135, both outside the range.
- The old pin at 0d13561d (:116-122) had the same gap.
- Proposed:
  - L480, "start supersedes and resets": `tableSource.ts:119-129`.
  - L488, where the clause is that a change before the answer issues the next query at once and the earlier answer's cancel lands later: `tableSource.ts:119-135` and `tableSource.ts:140-142`.

**D-3. Loose pin `frontends/shell/src/workspace/filterClauses.ts:84-108`, L448 "proposeClauseChange's refusal".** The worker's pin.
- Every refusal site lies in :87-101: `blockerOf`, and the two `{ kind: "refuse", … }` returns at :95 and :101.
- Proposed: `filterClauses.ts:87-101`.

**Observations** (not findings)
- **O-1.** Item 68's S1 names an Apply or a Clear. Two other callers reach the same `reissueUnrestricted` window:
  - a card or command-bar change (`changeClauses` calls `applyFilterWith`, App.tsx:2085);
  - the Colour by refill (App.tsx:2062).
  - ADV-2026-11-19-22 item 4 says the item describes the one chain the probe showed, so this is for the advisor's information only.
- **O-2.** L467's sentence on `setResidencyArm("baseline")` says its file and line are left to the gates. It is outside the eleven pins and outside this PR.
- **O-3.** L467's `attributesNotHeld` pin (App.tsx:861) is the declaration. The only place it is set is App.tsx:2289-2290 at B. The pin is adequate; a second entry is optional.

## Runs

- **Reused:**
  - The custodian's `verify-cites` and `verify-quotes`, run in `<W>` on the tree that H commits (`<S>/kl68-cites.log`, `<S>/kl68-quotes.log`). The logs do not record the Node version.
  - CI at H and P, by GitHub (DCO, Exposure scan, Ported notices twice).
- **Reproduced:** none of these, because nothing gave me cause to doubt them.
- **My own runs** (scripts in `<S>`, read only):
  - the pin recompute (`g338r-pins.mjs`, 157/157);
  - P's byte check (`g338r-p.mjs`);
  - H's byte check (`g338r-h.mjs`);
  - the context reads (`g338r-ctx.mjs`).
- The worker's report `<S>/pinsw-1.md`, 8650 bytes, sha256 b57050e608ef3314c27a70d7d67ab80b57e17019aa160c6d3958be079cd1b19e, was read as evidence.

## Model

Opus 5.5 (claude-opus-5-5), as the harness reports.
