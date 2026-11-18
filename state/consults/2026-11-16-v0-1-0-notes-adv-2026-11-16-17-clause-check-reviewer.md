# The v0.1.0 notes: the reviewer's clause check of the three texts of the advisor's draft ADV-2026-11-16-17 against the code at the tag, read only, as the draft's item 4 asks; not a gate

*Filed by the custodian from the hand-back: 14006 bytes, sha256 a9adbc49a78a11afad84d1e02beebc35514b9237f24c37430411e65994db108f, claude-opus-5-5, 6 calls by its transcript since its first report. Byte for byte below the rule, except one scratch path in its last line, written as <S>.*

---

Clause check: ADV-2026-11-16-17's three texts against v0.1.0, reviewer, read only

Reviewed main @ 2a8907b8786dd0dc714213fa21fdb41cd6ada52c (records). Code read at tag v0.1.0, commit b391e43622056324c56d35cc33065305140a8415.

**Verdicts:**
- Fence 1 (note one): ALL PASS.
- Fence 2 (note two): 0 FAIL, 1 CONDITIONAL (F2-8).
- Fence 3 (page paragraph): 1 FAIL (F3-4), 1 CONDITIONAL (F3-2).

F3-4 states a limit that is untrue in ordinary use, so it is a Correctness finding. Per item 4 of -17, nothing should be posted until it comes back to the advisor and the human.

## Basis

All wording is mine, except text in backticks or quotation marks, which is byte-copied from the cited line.

I read the draft whole: 3071 bytes, sha256 9dbf7e727b012260154b9a389d6c2f063136446b16df7bbadfd65efe3db71c1b, both checked by `wc -c` and `sha256sum`.

I also read the filed page body at 2a8907b8. Its lines 7 onward, cut to 6545 bytes, hash to bc55e34a6c49fa3139b01a92e748a7bab5c2be8edd7166c1be78012583e5f25a. That matches the custodian's header.

Code facts come from the tag reads in my first report (same session) plus the reads named below. I wrote no file. Every git call was read-only.

## Fence 1: note one

| # | Clause | Grade | At the tag |
|---|---|---|---|
| F1-1 | "Corrected 2026-11-16:" | PASS | A date, not a code claim. |
| F1-2 | "this paragraph says the status then reports those areas as not loaded." | PASS | `v0.1.0:KNOWN-LIMITATIONS.md:153` contains `The status then reports those areas as not loaded,` |
| F1-3 | "That is not always so in v0.1.0." | PASS | The refused tile is dropped in `TileViewportStreamManager.mintAndStart`'s catch (`v0.1.0:frontends/shell/src/streaming/tileViewportStreamManager.ts:663-668`). That path makes no session call. |
| F1-4 | "In some cases, for example when the refused area is the last thing still loading, the status does not change:" | PASS | After the drop, nothing calls `emitResidencyStatus` (`candidateArmSession.ts:683`), so the status stands as it was. |
| F1-5 | "it stays empty, or keeps the sentence it showed for the view before," | PASS | See note (a). |
| F1-6 | "and Cancel can stay up in the filter panel." | PASS | See note (b). |
| F1-7 | "When the view is over its render budget, the status names the render budget instead." | PASS | See note (c). |

Notes to fence 1:

(a) F1-5:
- A pan's plan runs `emitResidencyStatus` (`candidateArmSession.ts:1456`). When the view is not yet settled, that function says nothing unless a "Showing all N" is standing; in that one case it clears it (`:805-810`).
- So the plan clears a "Showing all N" or a relinquished status (`:1386-1393`), and the status is then empty.
- The plan leaves a partial, partial-failure or over-budget sentence standing (`standingWithinBudgetComplete` is set false at `:724`, `:751` and `:775`). That is the earlier sentence.
- I found no third state.

(b) F1-6:
- Cancel is the `filter-cancel` button in `FilterPanel`, shown by `isScanInFlight(scanState)` (`v0.1.0:frontends/shell/src/filter/FilterPanel.tsx:116-117`).
- In the example case (nothing else tracked, the first look ended), no `reset` follows and Cancel always stays up. `syncScanLiveness` (`candidateArmSession.ts:562-571`) runs only from the session's own handlers.
- "can" is the right strength for "some cases" as a whole. When the filter's first look is still running at the drop, its terminal sends `reset` (`:1325`) and Cancel goes down.

(c) F1-7:
- When `manager.overBudget` is set, `emitResidencyStatus` emits `candidate-over-budget` unconditionally (`candidateArmSession.ts:695-725`).
- The plan sets the flag from its fit check, `manager.setOverBudget(!fits, …)` (`:1451`), and emits at `:1456`.
- The settle text adds `" Filling has finished for this view — the render budget is full; pan or zoom to see other areas."` (`v0.1.0:frontends/shell/src/residency/residencyStatus.ts:410`).
- When the flag clears at the plan, a stale budget sentence is still shown. F1-5 covers that case.

Generality words in fence 1:
- "In some cases" and "for example" are exact. Other cases exist:
  - the filter's first look is still running when the tiles settle (`settledState` requires `!input.untiledStreamRunning`, `residencyStatus.ts:332`);
  - another tile failed, which gives the partial-failure sentence (`residencyStatus.ts:418`).
- "can" is exact, as in note (b).

## Fence 2: note two

| # | Clause | Grade | At the tag |
|---|---|---|---|
| F2-1 | "Found 2026-11-16, true of v0.1.0:" | PASS | Trace report §2. |
| F2-2 | "when the first request for data after opening a file, or after applying or clearing a filter, starts and then fails before any data arrives," | PASS | See note (a). |
| F2-3 | "nothing from that request is drawn" | PASS | See note (b). |
| F2-4 | "and nothing on screen says it failed." | PASS | See note (c). |
| F2-5 | "After an open the map stays empty, and panning or zooming loads nothing." | PASS | See note (d). |
| F2-6 | "After a filter the map is cleared," | PASS | `reissueUnrestricted` runs `manager.clearAll()` (`candidateArmSession.ts:1508`) and `canvas?.clearAllTiles()` (`:1512`) before it issues. |
| F2-7 | "and the filter panel can still show the filter as applied." | PASS | See note (e). |
| F2-8 | "To ask again, apply or clear the filter again, or open the file again." | CONDITIONAL | Untrue for "open the file again" after a filter. See note (f). |
| F2-9 | "Found by reading v0.1.0's code; not reproduced in the v0.1.0 installer." | PASS | The trace report. My first report's search found no recorded installer run of a failing first look. |

Notes to fence 2:

(a) F2-2:
- Open: `session.reissueUnrestricted(null, …)` (`App.tsx:1069`).
- Apply and Clear: `applyFilter` calls `deps.requestViewport(null, newFilter)` (`App.tsx:294`). Clear passes `predicateTextToFilter("")`, which is null (`predicateInput.ts:17-19`).
- "starts" correctly leaves out a refusal at the call, which is shown.

(b) F2-3:
- The premise is that no batch of that stream arrives.
- The phrase is exactly as strong as the code. A batch from the previous first look can be drawn in the round-trip window before `untiledStreamHandle = stream` (`candidateArmSession.ts:1205`, guard at `:1214`). That batch is not "from that request".

(c) F2-4:
- No status-stack element renders (`App.tsx:1436-1496`). No banner is raised: only the global `error` and `unhandledrejection` listeners do that, and nothing on this path throws.
- Text that is shown, none of which says this request failed:
  - "Applied: …";
  - the admission panel's `DescribeSummary`;
  - the Console's rows (`viewport_query` resolved, and the log-command row).
- The one edge: a refusal block left from an earlier refused open, not dismissed, is still shown. The Apply path does not clear `viewportRefusal`. It names the earlier request.
- "nothing on screen" is exactly as strong as the code.

(d) F2-5:
- No batch means no frame. `establishFrameFromExtent` returns at `candidateArmSession.ts:1126`. `onCameraChange` then returns `{ kind: "no-frame" }` (`tileViewportStreamManager.ts:363`), and `handleViewportChange` stops at `if (outcome.kind !== "planned") return;` (`candidateArmSession.ts:1371`).
- "panning or zooming loads nothing" is exact. Zoom to layer reaches the same stop.

(e) F2-7:
- On an issued outcome `applyFilter` commits the filter (`App.tsx:325-326`), and `FilterPanel.tsx:123` renders `Applied: {appliedFilter.predicate}`. The outcome resolves before the failure terminal.
- After an Apply this always happens. After a Clear the filter is null and no line shows. So "can" fits the two together.

(f) F2-8, case by case:
- Apply again: the input keeps its text; only Clear empties it (`FilterPanel.tsx:52-60`, `:67`). It issues a fresh untiled first look, so it asks again.
- Clear: it issues a fresh first look even when no filter is applied, so it asks again.
- Open again after an open: a new handle (`skp.rs:338`), a remount (`App.tsx:1360`) and a new first look (`:1069`). It asks again.
- Open again after a filter: the open's reset clears the filter, `setters.setActiveFilter(null);` (`App.tsx:190`). The request asked is the unfiltered first look, not the failed filtered one, and the filter is gone.
- A pan or zoom after a filter also asks again, as tiles under the filter (the frame survives). The fence does not name it. That leaves the fence incomplete, not wrong.

## Fence 3: page paragraph

| # | Clause | Grade | At the tag / on the record |
|---|---|---|---|
| F3-1 | "Corrections after release, 2026-11-16." | PASS | Same form as line 7 of the filed body. |
| F3-2 | "[KNOWN-LIMITATIONS](…/main/KNOWN-LIMITATIONS.md) on main now states two more things this version's notes did not:" | CONDITIONAL | See note (a). |
| F3-3 | "the status does not always report a refused area of the map as not loaded;" | PASS | As F1-3 and F1-4. |
| F3-4 | "and a first request for data that fails before any data arrives leaves the map empty or cleared, with nothing on screen saying that it failed." | FAIL | See note (b). |
| F3-5 | "Both apply to this version." | PASS | |
| F3-6 | "If the map is empty or has gaps and nothing says why, try a pan or a zoom in, applying the filter again, or opening the file again." | PASS | "try" is advice, not a claim that each remedy works. Per case: item 4 below. |

Notes to fence 3:

(a) F3-2:
- This is untrue until note one and note two have merged on main. Item 5 of -17 orders the file first, so the clause holds only if that order is kept.
- "this version's notes did not" holds. Release notes are the KNOWN-LIMITATIONS text plus two items (`v0.1.0:RELEASE-0.1.md:148-149`). That text states the opposite of the first thing (`:153`) and nothing about the second (trace §4).

(b) F3-4:
- The page drops fence 2's "starts and then" and its "after opening a file, or after applying or clearing a filter".
- As written, it covers a first request refused at the call. That is ordinary use: a mistyped predicate at Apply, which the kernel refuses in `viewport_query` before any ticket (`v0.1.0:kernel/src/skp.rs:388`).
- In that case something is shown:
  - At Apply: `applyFilter` returns `{ kind: "refused", refusal }` (`App.tsx:320`), and `FilterPanel` renders it in `RefusalBlock` (`FilterPanel.tsx:132-136`). The recovery re-issue restores the last view (`App.tsx:307-311`), so the map is not left cleared either.
  - At open: `reportViewportOutcome` sets `viewportRefusal` (`App.tsx:929-931`), which renders in `.canvas-refusal` (`:1455-1468`).
- The clause is true only of the case fence 2 names. This is the advisor's wording for the human's approval, so per the coordinator's instruction I propose no text.

Generality words in fence 3:
- "does not always" (F3-3) is exact.
- "leaves the map empty or cleared, with nothing on screen" (F3-4) is stronger than the code, because of the refused-at-the-call case.

## Placement (by Bash on the files)

**Note one:**
- `git show 2a8907b8:KNOWN-LIMITATIONS.md | grep -c "^Under a row filter at wide zooms"` gives 1, at line 184.
- The paragraph is lines 184-187. Its source comment is line 188. The on-main paragraph (the human's wording) is lines 190-191.
- The place exists exactly once. "Under" has two byte positions: before the source comment or after it. The earlier corrections sit between the item text and its comment (lines 77-78, 114-115, 133-134, 162-163).
- Carried from my first report: the on-main sentence at line 190 says a refused area "is still reported as not loaded, in the words above". It stays below note one, and note one contradicts it for main too.

**Note two:**
- The v0.1.0 list ends with item 44 (lines 222-223). Next is `## On main since v0.1.0 — not in any release yet`, the only `## ` heading in the file (line 225).
- The end of the list exists exactly once, between line 223 and line 225.

**Page paragraph:**
- In the filed body, `grep -c "^Corrections after release, 2026-10-12\. "` gives 1, at line 7. `grep -c "Corrections after release"` gives 1. The rule lines `^---$` are at 5, 9 and 15.
- Line 5 is the filing's own separator. In the page's body, the rule after the paragraph is line 9, with one blank line (8) between them.
- The place exists exactly once.

## Item 4: what each suggested remedy asks again, at the tag

Cases:
- A: the refused tile, which leaves gaps.
- B2-open: the open's first look fails, and the map is empty.
- B2-filter: an Apply's or Clear's first look fails, and the map is cleared.

| Remedy | A | B2-open | B2-filter |
|---|---|---|---|
| A pan or a zoom in | Asks. The key is forgotten (`tileViewportStreamManager.ts:665`) and re-planned (`:412-418`), if still in view, within capacity (`:430-441`) and not over budget without headroom (`:453`). Zooming in means fewer covering tiles. Whether the re-ask is then admitted cannot be settled by reading. | Does not ask. There is no frame (`:363`, `candidateArmSession.ts:1371`). | Asks, as tiles under the filter (the frame survives, `tileViewportStreamManager.ts:311`), if an earlier first look in the session delivered geometry. If the open's first look had also failed, it does not ask. |
| Applying the filter again | Asks. It clears the map and issues a fresh untiled first look; tiles follow on the next pan. | Asks: an Apply or Clear issues a fresh first look, which can set the frame. "again" fits poorly, since no filter was applied at open. | Asks the same filtered first look. |
| Opening the file again | Asks, but the open clears the filter (`App.tsx:190`), so the filtered areas are not asked. | Asks the same unfiltered first look. | Asks, unfiltered. The failed filtered request is not asked, and the filter is gone. |

Files read: <S>/adv-2026-11-16-17.copy.md; C:\dev\spatial-ide\state\consults\2026-11-16-v0-1-0-release-page-body-as-read-for-the-advisor-custodian.md (at 2a8907b8); C:\dev\spatial-ide\KNOWN-LIMITATIONS.md (at 2a8907b8).
