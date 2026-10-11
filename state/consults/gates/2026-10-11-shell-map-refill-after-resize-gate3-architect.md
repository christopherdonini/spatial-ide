# PR #207 gate 3 — architect (item 39's sentence)
Reviewed: cut/shell-map-refill-after-resize @ 58967ff4d0a7191ef33142cf2cf73ac7f8eb1480

**Verdict: block, on one Correctness finding (C1) for the human to rule on.** I have not reworded the sentence and I propose no other words. Everything else in the sentence holds. No Evidence block. One Documentation finding (D1), which must be fixed before the merge.

How I read the code: the worktree `C:/dev/wt/refill` is at 58967ff4. `.git/refs/heads/cut/shell-map-refill-after-resize` holds 58967ff4, and the worktree reflog `logs/HEAD:20` shows a2f09cc9 → 58967ff4 as one commit. Line cites are into that worktree and assume a clean tree, which worker report 8 states. I have no shell, so I give no span hashes. The reviewer recomputes them.

## C1 (Correctness, for the human): a refused Apply or Clear on the candidate arm is a second exception that the sentence does not name

"One exception" (KNOWN-LIMITATIONS.md:367) does not hold in this case.

The path, on the shipped default arm:
- The candidate arm is the shipped default: `frontends/shell/src/residency/residencyArm.ts:50` and `:84-86`, used at `frontends/shell/src/App.tsx:1319-1329`.
- On this arm, every Apply or Clear is issued through `issueQueryRef.current = … session.reissueUnrestricted(bbox, filter)` (`App.tsx:1404`).
- `reissueUnrestricted` calls `canvas?.resetFitForNewGeneration()` when it starts, before the query is minted (`frontends/shell/src/residency/candidateArmSession.ts:1657-1658`, with the mint at `:1698` → `:1274`).
- The reset clears `lastQueriedRef` (`frontends/shell/src/canvas/WorkingCanvas.tsx:1530-1534`).
- When the engine refuses the Apply, the refusal propagates (`candidateArmSession.ts:1272-1274`). `applyFilter` then re-issues the last reported view, `requestViewport(deps.getLastViewportBbox(), deps.getActiveFilter())` (`App.tsx:317-322`). That goes through `reissueUnrestricted` again and clears again.
- The outcome is `{ kind: "refused" }` (`App.tsx:331`). The shell's own vocabulary separates `applied`, `not-applied` and `refused` (`App.tsx:236-241`). So no filter was applied or cleared.

From the refusal until the recovery stream's first batch with geometry:
- `lastQueried` is null, so `viewportAfterResize` returns `none` (`frontends/shell/src/canvas/viewportBbox.ts:76`).
- A growth therefore asks for nothing.
- But the last thing asked for was the recovery's bounded box (the view shown), not an unrestricted look. So sentence 1 claims a query that does not happen, and sentence 3 does not cover the case.

If the recovered view holds no feature with geometry, no auto-fit follows, and the state lasts until the next pan or zoom. Zoom to layer is then a no-op: `fitAnchorRef` was reset (`WorkingCanvas.tsx:1531`), so `fitToBounds` returns `false` (`:1519-1520`). In that sub-case, "until the next … Zoom to layer" also does not hold.

Once the recovery's first batch with geometry arrives, the auto-fit fires (`WorkingCanvas.tsx:1679-1681`) and "the map fits itself to the data" covers the state again.

The same state follows any other mint failure inside `reissueUnrestricted`: a non-filter `SkpCallError`, or an unexpected throw (`App.tsx:333`).

The baseline arm resets only on an issued outcome (`App.tsx:336-338`), so it has no such case. Its switch is dev-only (`residencyArm.ts:31-35`).

Amendment 3 item 3 is consistent with this code if its "since the last filter Apply or Clear" means the click. Amendment 3 item 8 did not examine this case. The sentence, which says "a filter is applied or cleared", does not cover it.

## Case by case: the sentence against Amendment 3 item 3 and the code

| Case | Code | Holds? |
|---|---|---|
| A file is opened | Every open mints a new handle (`App.tsx:659-663`). The canvas is keyed on it (`App.tsx:1782-1783`), so refs start null (`WorkingCanvas.tsx:1017`, `:1020`), and `viewportBbox.ts:76` gives `none` | Yes |
| A filter is applied or cleared (path (a)) | `App.tsx:336-338` → `WorkingCanvas.tsx:1533`. On the candidate arm also `candidateArmSession.ts:1658` | Yes, except C1 |
| The map fits itself to the data | The only auto-fit sites are `WorkingCanvas.tsx:1476-1485` and `:1679-1681`. They call `fitToExtent(…, false)`, whose `else` clears (`:1351-1353`). `hasAutoFitRef` is re-armed only at `:1532` | Yes |
| "shows the features already loaded" | `onResize` writes no camera and asks nothing when `lastQueried` is null (`:1952-1956`). The stream from the open or filter query keeps arriving | Yes, on the reading "loaded by the query already made" |
| Ended by a pan or zoom | Every deck controller event, including drag, wheel, keyboard, double-click and inertia, goes through `onViewStateChange`, which reports (`:1957-2026`, report at `:2016` → `:1024`) | Yes |
| Ended by Zoom to layer | `fitToExtent(bbox, true)` → `:1350` | Yes. A no-op click (`:1519-1520`) outside C1 leaves only the unrestricted look as the last thing asked for, so nothing lies outside it (Amendment 3 item 8's reading) |
| Path (b): a pan before the first batch, then the auto-fit | The pan ends the exception, and a growth then queries against the pan's box (`viewportBbox.ts:78-79`). The auto-fit restarts the exception (`:1352`) | Yes. This closes the case that Amendment 3 item 8, fourth bullet, found sentence 1 failed |
| A pan while an Apply is being issued | The pan reports (`:2016`). Then `App.tsx:338` clears it when the outcome is issued | Yes, if "applied" means the moment the query is issued, which is the code's vocabulary. On a click-time reading, a size change after that pan still asks nothing. The window is one mint round trip, plus one `VIEWPORT_QUERY_MIN_INTERVAL_MS` retry when throttled (`App.tsx:225`). Noted for the human, not a finding |
| Origin recenter | Only inside the pan handler (`:2007-2014`), followed by the report at `:2016`. Elsewhere only inside `fitToExtent` (`:1336`) or the DEV seam | Yes |
| DEV view-state seam | Gated by `import.meta.env.DEV` (`:2200`). It reports (`:2225`) and so ends the exception in a dev build only | Yes, for the shipped build |
| Remount | Only on a new dataset handle. Layout regions are `hidden`, not unmounted (`frontends/shell/src/layout/StudioLayout.tsx:230`, `:243-245`, `:248`) | Yes |
| A size change itself | `query` → `reportViewport` (`:1954`). `within` leaves `lastQueried` as it was. `none` does nothing | Yes |
| Candidate session ended during an Apply | `:1658` resets, then `session-ended` is returned at `:1288-1290` | Outside item 39. The latch refuses every later plan until reopen |

**Read together.** Sentence 2 holds without a condition, by Amendment 3 item 3's invariant (`lastQueried` is either null or contains the box shown). Sentence 1 and the new sentence 3 hold together in every case except C1, where sentence 3's claim of one exception is untrue.

**The source comment's clause** (KNOWN-LIMITATIONS.md:368). The clause in Amendment 4 item 2 is inserted directly after "(this form's Amendment 1, item 4)" and before ". Authority:". I compared it by reading; the byte check is worker report 8's run output. The comment's statement is true against the directive (`state/directives/2026-10-11-rulings-205-c1-item-39-pieces-d-e-merge-206.md:10-12`). Holds.

**The new third sentence** reads the same as the directive's line 11 without its three leading spaces, and sentences 1 and 2 read the same as the old line in worker report 8. I compared these by reading, not by script.

## Evidence (not a block)

- **"The commit changes nothing else."** The reflog confirms that one commit separates a2f09cc9 and 58967ff4. The file-level claim, `2 2 KNOWN-LIMITATIONS.md`, rests on worker report 8's `git diff --numstat` output, which is evidence from a run. I could not recompute it without a shell. The reviewer recomputes `git diff --numstat a2f09cc9 58967ff4` before the merge.

## Documentation (must be fixed before the merge, no re-gate)

- **D1.** Two doc comments say `resetFitForNewGeneration` runs only on a new filter generation that actually issues:
  - `WorkingCanvas.tsx:134-135` ("on any Apply or Clear that actually issues");
  - `WorkingCanvas.tsx:1019` ("a new filter generation").

  In fact `candidateArmSession.ts:1658` calls it when every reissue starts, which includes a refused Apply's first attempt and its recovery. Fix it together with whatever the human rules on C1. If the code changes, this finding may no longer apply.
