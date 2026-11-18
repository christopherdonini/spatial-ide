Reviewed: PR #330 at 6abaa9fb74de1eee303e3de84f6eafab67df56c6, gate, architect, attempt 2 (the custodian's filing note, 2026-11-18: the architect, model claude-opus-5-5, 12012 bytes, sha256 ef4987c60584e5945cc6ce262bf71f92bea2eb1237fdb51962f39807a709ecf5; its run 2026-11-18T13:35:21.883Z to 13:41:57.335Z by its transcript, Read 31, Grep 11, Glob 2, SubagentHandback 1, none errored; below byte for byte, with this note and one final newline)
Branch: cut/shell-tiled-arm-stream-refusal-s1 @ 6abaa9fb74de1eee303e3de84f6eafab67df56c6
Verdict: PASS WITH NOTES

C-1 is closed and nothing blocks. I have three Documentation findings, all must-fix before the merge, and two observations. H = 6abaa9fb, F = 00bead77.

Gaps in my reads:
- Read whole: my attempt-1 report; ADV-2026-11-18-09 and -10; the form's Amendments 2 and 3; worker reports 1 to 3; the code diff `<S>/g330x-code-diff.txt`.
- Read in part: the form's §3 to §8 (lines 104-283 on main). I did not read §0 to §2, §9 to §14 or Amendment 1. Of the reviewer's attempt-1 report I read only D-1. Of the first-look draft (`state/consults/2026-11-12-open-first-look-fills-fit-view-form-architect-draft.md`) I read only §2.1's (i) to (viii). Of `KNOWN-LIMITATIONS.md` on main I read lines 180-194.
- At H I read these regions in `C:/dev/wt/srf`: `candidateArmSession.ts` (370-400, 505-525, 595-894, 990-1214, 1260-1660, 1660-1860), the refusal test (1-250, 405-520), `candidateArmSession.test.ts` (1975-2047, 2100-2119, 2170-2272), `residencyStatus.ts` (105-164, 338-344, 440-471) and `tileViewportStreamManager.ts` (104-111, 950-1013). No file I read looked changed against the diff.
- Not read: the two commits' message bodies (I saw only their subjects in report 3); the reviewer's attempt 2; ADV-2026-11-18-11.
- I have no shell. I ran no test or mutation, recomputed no hash, and did not recompute the §7 counts. Every run, mutation result and count here is the worker's, read as evidence.

## Findings

### Correctness (blocks)
None.

### Evidence (blocks)
None.

### Documentation (must fix before the merge; none of these is the human's wording)

**DA2-1. The fix branch's reworded comment claims a little too much.** `candidateArmSession.ts:1455-1456 at H` reads "so this is the settling moment".
- After a plan, `emitResidencyStatus()` (:1460) settles only if no tile is still tracked and no viewport change is pending (`residencyStatus.ts:339-341 at H`).
- Otherwise it says nothing (:843-848), or gives the over-budget sentence without the settled suffix (:755-761).
- Replacement: change "so this is the settling moment" to "so this terminal can be the settling moment". The rest of the comment stays.
- Clause check:
  - "found the view not settled": while this look ran, `untiledStreamRunning: untiledStreamHandle !== null` (:713) was true, and the handle is cleared only at :1349.
  - "can be": the conjunction at `residencyStatus.ts:340 at H`.
  - "Before any plan, only a failure speaks": :1458, `(hasPlanned || terminal.kind !== "Completed")`.

**DA2-2. A test comment the fix made untrue, outside M1.** `candidateArmSession.test.ts:2028-2030 at H` says the untiled terminal does not emit: "(no `emitResidencyStatus()` call at the untiled stream's own terminal -- S2's own surfacing obligation is scoped to the TILE manager's `onTileSuperseded`/`onTerminal`, not this session-owned stream)".
- At H that call exists (:1460). The assertion at :2035 still passes only because `pendingViewportChange` is true.
- Amendment 3 item 2 lets this file into §7 for M1 alone, so this fix needs a class 9 line first (see the drafts, item 1).
- Replacement for :2028-2033, from "`untiledStreamRunning`." to the end of that comment: "`untiledStreamRunning`. A plan has run, so this terminal recomputes the status (the stream-refusal piece S1, C-1's fix), but it emits nothing: `pendingViewportChange` is ALSO still `true` at this exact instant (the debounce has not fired yet either), so it reads not-settled. The already-scheduled debounce firing next is the first genuinely honest opportunity to settle."
- Clause check:
  - "recomputes": :1458-1460 at H. Gen2's plan set `hasPlanned` (:1523); the stream is current and not self-cancelled.
  - "emits nothing": not over budget here, `settledState` reads not-settled on `pendingViewportChange` (`residencyStatus.ts:340`), and nothing complete is standing (reset at :1710; gen2's plan emitted nothing, asserted at :2007). So :843-848 returns without a call.

**DA2-3. A stale count that F introduced. My attempt 1 missed it, and it is outside this attempt's limit.** `tileViewportStreamManager.ts:974-975 at H` reads "Five conditions, all required: not stopped, a declared-retryable code". The `if` at :989-995 now has six conditions, because S1 added `!this.overBudgetFlag` at :991.
- Replacement: "Six conditions, all required: not stopped, not over budget (S1, OPEN-1 (a)), a declared-retryable code". The rest of the comment stays.
- Clause check: the six conjuncts at :990-995.
- The file is in §7 (worker report 3: 10 of 25 lines used). Whether it is carried in this PR is for the advisor (the drafts, item 2).

### Observation

- **O-1. A new trigger inside D-5's window, timing inside one request round trip, so it does not block.**
  - `reissueUnrestricted` never clears the old handle (:1677-1745 at H), so an earlier look's terminal that lands before :1312 is read as current. It then clears the handle at :1349.
  - If a plan also ran in that window, which needs a pan and a 120 ms debounce inside the mint's round trip, the fix's :1460 reads no untiled stream running. With an empty or already-complete covering set it can say "Showing all N" before the new look starts. The new look's first batch then recomputes it (:1210) and clears it through :844-846.
  - At F, the plan's own trailing emit (:1636) reached the same state after such a terminal, so the root predates this piece. Words for the advisor: the drafts, item 3.
- **O-2. For the closing amendment.** Report 3 cites test lines such as "refusal:483" and "cas:2249" without a commit id. The closing must name each branch test span with its commit id (the Round 25 rule; §4's note).

## Checks

1. **C-1 closed.**
   - The new condition is `if (wasCurrent && !wasSelfCancelled && !relinquishedReEmitted && (hasPlanned || terminal.kind !== "Completed")) {` (:1458 at H). Branches 2 and 3 (:1461-1470) are reached only with `hasPlanned` false, so only on a non-`Completed` terminal.
   - In the case-A orders, the tile's end finds `untiledStreamRunning` true, so `settledState` is not-settled and the drop emit (:1065) or the tile-terminal emit (:1058) stays silent. Then the look's `Completed` terminal clears the handle (:1349) and recomputes (:1460).
   - Refused: `settled: "partial"`. The dropped tile is never complete and is not in `failedCoveringTerminals`.
   - Stream fails: `"partial-failure"`, through the record at :1053.
   - Load ends well: `"complete"`, the text "Showing all 3 features in view".
   - In each, the scan resets at :1472.
   - That is what Amendment 2 items 1, 2 and 4 ask.
   - No path of the same kind is left open:
     - A terminal after a plan with tiles still tracked or a change pending is silent, and the last tile's terminal or the plan's trailing emit settles it.
     - Self-cancelled: `cancelUntiledStream` clears the handle first (:1273-1279), so `wasCurrent` is false.
     - Superseded: `wasCurrent` is false, except inside O-1's window.
     - Session-ended: returns at :1366-1369.
     - After a relinquish's re-emit: excluded by name, and `relinquishFill` resets `hasPlanned` (:1821).
     - A first-look failure cannot be standing in a generation whose look completed.
     - No double emit: while the look runs, no earlier emit can have settled the view.
2. **The region.** With no plan, a `Completed` terminal fails :1458's last conjunct, so nothing in S1's branch runs. The first-look node's request needs `terminal.kind === "Completed"` and `hasPlanned` false (its draft, §2.1 (iii) and (vi)), so the two are disjoint. Amendment 2 item 3's corrected §8 sentence is true of :1458, under the guards that item 2 names. §8's own line stays as written, superseded by the amendment.
3. **What the fix adds.**
   - The three tests (refusal test :472-518 at H) each assert the settled event, the text, the scan's last event and the scan state. With the fix absent, the first status assertion reads undefined: every emit after the mark is within budget and not settled, so it says nothing (:843-848). Worker report 1 records this failing at b53d14ff for all three.
   - M-C1a, M-C1b and M-C1c each narrow `hasPlanned` to exclude the one settled state its own test reaches, which matches their comments (:472, :489, :505). Report 3 records each failing at that test's first status assertion. M-C1a also fails M1, because M1 settles partial.
   - M1's change (`candidateArmSession.test.ts:2244-2255 at H`) keeps everything before it, per item 3 (a) and (e). It asserts the count of 2 and the last call's content.
   - M-M1 is F's condition put back, and report 3 records 4 failures, M1's :2249 among them. That meets Amendment 3 item 4.
4. **The words (D-1, D-3, D-4, D-5).**
   - D-1: `tileViewportStreamManager.ts:110 at H` and `tileViewportStreamManager.test.ts:1139 at H` equal the reviewer's two replacements exactly.
   - D-3: :991 equals my replacement exactly.
   - D-4: `residencyStatus.ts:112-113 at H` has my words exactly, with the line broken between its two sentences. `residencyStatus.test.ts:583 at H` has my words exactly.
   - D-5: `residencyStatus.ts:451` and `:458 at H` each equal my line exactly. Its clause check still holds at H: after a plan, §2.2 (c) clears the standing flag (:1544-1547).
   - The reworded comment is true apart from DA2-1.
5. **Discharge claims and quotes.**
   - Neither commit subject quotes anything or claims done.
   - The added comments quote nothing as the human's, the advisor's or a doc's.
   - The test comments' "Expected failure" lines are borne out by report 1 (base) and report 3 (mutations).
   - Bodies not read (gaps).
6. **The on-main paragraph's new text** (ADV-2026-11-18-09 item 8; Amendment 2 item 8), at H:
   - "is logged": :958.
   - "still in view": :973 and :994.
   - "within its render budget": :991.
   - "the map's tile queue has room": :995.
   - "asked for again once": :993 and :997.
   - "reported as not loaded, in the words above": SR-A1..A4, APP-SR2, and now SR-A-apply-refused.
   - "names the render budget instead": SR-C and SR-C2.
   - All hold. There are two gaps for its source comment (ADV-2026-11-18-09 item 9), both needing a fault or a stale state, not ordinary use:
     - my attempt 1's stale over-budget sentence (A3);
     - when another covering stream also failed (a fault injector, a dev-only switch), the bar gives the partial-failure sentence, not "not loaded".

## Drafts for the advisor

1. **DA2-2's class 9 line, for the form before its commit.** "`candidateArmSession.test.ts` also takes the corrected comment at :2028-2033 of the test above M1 (its assertion unchanged), because C-1's fix made its parenthetical untrue." Clause check: the call is at :1460 at H; :2035 is unchanged. The lines count against the unit total (report 3: 880 of 1,010).
2. **DA2-3.** One comment line in a §7 file; it fits (10 of 25). It is outside this attempt's limit (ADV-2026-11-18-09 item 7). I recommend carrying it in the same correction commit as DA2-1, with no re-gate (AUTONOMY §31).
3. **O-1's words, if you want it recorded.** As the last line of the fix branch's comment (:1457 at H): "Not covered (AUTONOMY §31), timing inside one request round trip: after a reissue, an earlier look's terminal that lands before the new look's ticket is minted is read as current and clears the handle, so if a plan also ran in that window this call reads no untiled stream running and can settle the view before the new look starts; its first batch then recomputes."
   - "read as current": :1348, and the handle is not reassigned until :1312.
   - "clears the handle": :1349.
   - "a plan also ran": :1523.
   - "can settle": :713 then :1460.
   - "its first batch then recomputes": :1210, with the handle non-null by then, then :844-846.
   - This is worker text, not the human's wording.

Model: Opus 5.5 (claude-opus-5-5). I wrote no file.
