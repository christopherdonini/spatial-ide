# Milestone 5's second part, PR B (Jobs), on PR A's head: the architect's draft (node:shell-migration-milestone-5@second-part-form)

*Filed by the custodian, 2026-11-27, under `state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`, item 6 (c). The architect (Opus) was dispatched with its brief byte for byte (pasted whole into its dispatch), read only. By its completion notice, 877335 ms and 98 tool uses. It wrote no file. Its hand-back is below as received, with the harness indent removed. Its Amendment 15 is a draft, not appended; its OPEN-B1 to OPEN-B4, with the two questions of ADV-2026-11-26-25 item 6, go to the advisor. Not a gate.*

---

cut/shell-migration-milestone-5-pr-a @ d6c2daf69eb500027197945f5a4302f0508e0f69. This is a draft, not a gate, and it gives no verdict.

# Milestone 5, PR B (Jobs): the form part on PR A's head (ADV-2026-11-27-37 item 6 (c))

**Checkouts read.**
- **[M]** is `C:/dev/spatial-ide`, the working tree; its HEAD at session start was ba5e7397.
  - The milestone-5 form was not in the session-start status's modified list.
  - `governance/PLAN.yaml` was staged-modified, so the node is read from the working tree, not from a commit.
- **[A]** is `D:/wt/m5a`.
  - Its HEAD ref `cut/shell-migration-milestone-5-pr-a` reads d6c2daf69eb500027197945f5a4302f0508e0f69 (`C:/dev/spatial-ide/.git/refs/heads/cut/shell-migration-milestone-5-pr-a`).
  - I read its working tree. I have no git tool, so uncommitted changes there were not checked.
  - There is no `src/jobs/` at [A]: no code of PR B exists.

**Discrepancies with the brief.**
- The brief's "§2.11" does not exist in this form (it has §2.1 to §2.8). I read the budget against §7, whose PR B table is [M] form:447-453.
- I computed no sha256: I have no shell. Cites are path:line with the checkout named.

**Quotes.** Nothing below is quoted from the human or the advisor. Rulings are cited by id and item, and every summary of them is paraphrase.

---

## 1. PR B's re-sweep at d6c2daf6 (§0.3), claim by claim

§0.3 ([M] form:102-108) asks for four things before PR B's code:
- the 0.2 interfaces re-read at the base;
- every e2e suite run at the base;
- the declared selector list;
- the Part letter and the KNOWN-LIMITATIONS numbers.

This re-sweep was made by reading alone. No suite was run (see OPEN-B3).

| §2 claim of PR B (form cite) | At [A] | Holds? |
|---|---|---|
| `ScanState` / `isScanInFlight` (form §0.2; [M] :70) | [A] App.tsx:454-461, :534-536 | Holds; cite moved (class 3) |
| `scanLivenessText`, no figure implying duration | [A] App.tsx:553-567 | Holds; moved. On the shipped arm the candidate session dispatches only `issued` and `reset` ([A] candidateArmSession.ts:624-633). `scanLivenessText` returns null for `issuing` ([A] App.tsx:558-566). So on the shipped arm the Jobs scan row shows S-8 alone, and the liveness text reaches it only on baseline. |
| FilterPanel shows Cancel exactly while `isScanInFlight`; `onCancel: () => void` | [A] FilterPanel.tsx:28, :120-121 | Holds, unchanged |
| App's inline Cancel handler, to be moved whole into `handleCancelScan` (§2.4; [M] :270) | [A] App.tsx:2327-2396 (70 lines). Candidate branch with `relinquishFill`: :2372-2388. Baseline: :2389-2395 | Holds; moved |
| No source-text test pins that handler | Searched [A] `src`/`e2e` tests for `scanStateRef`, `candidate-cancel-session-missing`, `session.relinquishFill` and `onCancel`: only candidateArmSession tests call `relinquishFill`. The App.test.ts source pins are elsewhere ([A] App.test.ts:1108-1116, :1266-1289). | Holds |
| `ExportRunReport` is `{cancel, ended}`; `ended` never rejects; `cancel`'s true means only that a token was found | [A] PublishPanel.tsx:33-41 | Holds, unchanged (no I4) |
| Prepare and execute report a run | [A] PublishPanel.tsx:403-408, :518-521 | Holds; moved |
| The e2e destination path registers no token, so H4 is expected | [A] PublishPanel.tsx:449-453 (doc comment). `commands.rs` not read (limit). | Holds by the doc; J-E2 discriminates |
| App holds the runs in a ref; mirror sites "set at :1270 and :1279" (§2.4) | [A] App.tsx:1283 (ref), :1300 (set), :1309 (delete). Run record: :138-143 | Holds; moved |
| The ask's `run.cancel()` call is unchanged (§2.4 as D-c left it) | [A] App.tsx:1343, inside `answerOpenAsk` :1330-1347; `confirmOpen` :1315-1327 | Holds; moved |
| The panel's own Cancel words are Cancel/Cancelling (§2.4; [M] :278) | [A] PublishPanel.tsx:727 | Holds |
| PublishDialog's execute Cancel is unchanged | [A] PublishDialog.tsx:228, :324-327 ("Cancel publish"/"Cancelling") | Holds; moved |
| A table load cannot run while Jobs is shown (§2.4; [M] :269) | `tableShown` [A] StudioLayout.tsx:175-176. TableTab's effect starts only while shown and cancels in cleanup ([A] TableTab.tsx:21-22, :63-67) | Holds. Bound: the cancel lands asynchronously (`tableSource.ts:27`), so "cannot be running" means its effect has ended it. Jobs claims nothing here. |
| `ACTIVITY_TABS` gains jobs; each tab panel renders from the list | [A] contributions.ts:41-46; StudioLayout.tsx:457-463 renders `ACTIVITY_TABS.map` | Holds: no StudioLayout.tsx edit needed (it is not in PR B's list, [M] :311-319) |
| `SlotId` is derived, so `activity.jobs` becomes a required slot | [A] contributions.ts:73-86 | Holds. Consequence: a test-side `Slots` literal fails `tsc` (selector list below) |
| S-12's second form, the `layout.selectActivityTab` statement | [A] surfaceRegistry.ts:325-331 (statement at :329) | Holds; moved |
| J-A1's setup APP-SR2 (Amendment 2) | [A] App.streamFailure.test.tsx:223-250 | Holds, unchanged |
| The relinquished statement J-A1/J-E1 compare with (`residencyStatus.ts:463` in Amendment 2) | [A] residencyStatus.ts:462 (`relinquishedText`); frameless variant :470 | Holds; moved |
| H6: a pan after settle starts a fill and the row stands until clicked | `syncScanLiveness` dispatches `issued` while tiles are tracked ([A] candidateArmSession.ts:614-633) | First half holds by reading. "Until it is clicked" has no recorded duration, so it is re-aimed under N-2 (below) |
| §2.5 seam 4 (one function) and seam 5 (unchanged interface) | Interfaces as above | Hold |
| I8 (the base changes the attention slots or the reopen routing) | PR A's change is PR B's base by design | Not an invalidator for PR B |

**Present at [A] but named nowhere in the form.** I cannot tell from reading whether these are new since 0bcf5434: the run record's `cancelChosen` and `end` ([A] App.tsx:138-143); the operation consumer acquired and released per run (:1304, :1310); and the late-cancel statement decided by `lateCancelOutcome` ([A] OpenDuringExportAsk.tsx:26-34). None of them changes a 0.2 interface. So §2.4's calls stand, and this is not I4.

**Declared selector list for PR B.**
- **Unit tests that the Jobs tab breaks:**
  - [A] StudioLayout.test.tsx:24-42: the `NO_SLOTS: Slots` literal lacks `activity.jobs`, so `tsc` fails.
  - [A] StudioLayout.test.tsx:371: the tab list `toEqual`.
  - [A] App.table.test.tsx:206: the tab list `toEqual`.
  - Searched [A] `src` for `Slots`, `activity.problems`, `PROBLEMS_LABEL` and `"Problems"`.
- **e2e reads:** none.
  - The suites read tabs by id (`#activity-tab-problems`, `-table`, `-console`).
  - layout.mjs's Tab walk counts regions, not tabs ([A] e2e/layout.mjs:193-224).
  - No e2e reads the `selectActivityTab` statement.

**Part and numbers.**
- **Part: AF, rows AF4 and AF5 before AF6.** PR A's Part reserves them ([A] MANUAL-WALKTHROUGH.md:2075, :2091).
- **KNOWN-LIMITATIONS numbers** go to the next unused under rule (00a) (as ADV-2026-11-27-35 item 1 applies it), over the base and every unmerged branch.
  - Known taken: 76 (the recovery offer's form), 77-79 (PR A, [A] KNOWN-LIMITATIONS.md:560-571), 80 (the scale display's form), and ADV-2026-11-27-35's NN (not yet assigned).
  - I could not enumerate branches. The custodian names the numbers by script at filing.

**The row-filter paragraph** ([A] KNOWN-LIMITATIONS.md:185-190; §9a [M] :559). Its correction speaks of v0.1.0. At [A], a tile dropped on a refused mint calls `onTileDropped` ([A] tileViewportStreamManager.ts:1004-1007, :1032-1036). That re-syncs scan liveness ([A] candidateArmSession.ts:1083-1086), so the stale-Cancel case is closed on that path. The Jobs row uses FilterPanel's own predicate, so it follows FilterPanel's Cancel either way. My reading: no note is added there. Limit: other paths were not traced.

**PR B can stay under this form.** Item 3 of the brief does not arise:
- §2.4, §2.6, §4 and §7 already give PR B its own Scope, tests and budget.
- OPEN-4 and OPEN-5 are ruled (ADV-2026-11-23-17 items 4 and 5), and the strings and KL-B/KL-C are worded (ADV-2026-11-23-30 items 1 and 2).
- The deltas at the base are moved cites, two existing test files, J-E1's start (which N-2 foresaw) and one predicted class 8.

---

## 2. The amendment that brings PR B current (to append after Amendment 14)

Its class: a §0.3 re-sweep amendment written before code. It carries class 9 (two existing test files in Scope), class 3 (moved cites) and a predicted class 8. The custodian gives it its number at filing.

````text
## Amendment 15 — 2026-11-27 — the architect's, before PR B's code: the §0.3 re-sweep for PR B by reading at d6c2daf6; two existing tests join PR B's Scope (class 9); J-E1's start under N-2; the moved cites (class 3); App's predicted overrun (class 8)

*Written by the architect before any code of PR B and before any run of a J test. Every "`path`, line N at d6c2daf6" below is read at d6c2daf69eb500027197945f5a4302f0508e0f69 on `cut/shell-migration-milestone-5-pr-a`, a branch commit; no span is pinned by hash. It is made by reading alone: no suite was run (item 12, OPEN-B3).*

1. **Authority.** ADV-2026-11-27-37 item 6 (c) (`state/directives/2026-11-27-advisor-ruling-adv-2026-11-27-37-the-recovery-offers-base-c1-with-b-merged-in-its-recover-open-counted-adr-037-amendment-1-the-posture-check-the-places.md`); ADV-2026-11-26-25 item 6, the finding for this part (`state/directives/2026-11-26-advisor-ruling-adv-2026-11-26-25-a-form-open-a1-to-a8-the-time-of-the-save-on-every-first-line-seven-walkthrough-spans.md`); Amendment 11 item 5 (PR B's re-sweep before PR B's code). These are the advisor's rulings under the human's delegation of 2026-11-13, not the human's words.

2. **The base** is PR A's head d6c2daf69eb500027197945f5a4302f0508e0f69 (Amendment 4 item 11; ADV-2026-11-27-37 item 6 (c)). How a later head of PR A comes in is OPEN-B3.

3. **The §0.2 interfaces PR B is written against, at d6c2daf6.** None differs in shape (no I4); the cites move (class 3):
   - `ScanState` and `isScanInFlight`: `frontends/shell/src/App.tsx`, lines 454-461 and 534-536 at d6c2daf6; `scanLivenessText`, lines 558-567.
   - FilterPanel's Cancel: `frontends/shell/src/filter/FilterPanel.tsx`, lines 28 and 120-121 at d6c2daf6.
   - App's inline Cancel handler, moved whole into `handleCancelScan` (§2.4): `App.tsx`, lines 2327-2396 at d6c2daf6; its candidate branch lines 2372-2388, its baseline branch lines 2389-2395.
   - `ExportRunReport`: `frontends/shell/src/publish/PublishPanel.tsx`, lines 33-41 at d6c2daf6; reported at lines 403-408 (prepare) and 518-521 (execute); the destination path registers no token (lines 449-453).
   - App's runs: the ref at `App.tsx` line 1283 at d6c2daf6; §2.4's two mirror sites are the set at line 1300 and the delete at line 1309; the ask's call is line 1343, inside `answerOpenAsk` (lines 1330-1347).
   - Labels: PublishPanel's Cancel and Cancelling, `PublishPanel.tsx` line 727 at d6c2daf6; the S-12 statement, `frontends/shell/src/console/surfaceRegistry.ts` line 329 at d6c2daf6; `ACTIVITY_TABS`, `frontends/shell/src/layout/contributions.ts` lines 41-46 at d6c2daf6, rendered by `StudioLayout.tsx` lines 457-463, so StudioLayout.tsx is not edited.
   - The Table is shown only with its tab selected (`StudioLayout.tsx`, lines 175-176 at d6c2daf6) and its load ends when hidden (`frontends/shell/src/table/TableTab.tsx`, lines 63-67 at d6c2daf6).
   - The relinquished statement J-A1 and J-E1 compare with: `frontends/shell/src/residency/residencyStatus.ts`, line 462 at d6c2daf6.
   - Not named in the form, unchanged by PR B: the run record's `cancelChosen` and `end` (`App.tsx`, lines 138-143 at d6c2daf6) and the late-cancel statement (`frontends/shell/src/feature/OpenDuringExportAsk.tsx`, lines 26-34 at d6c2daf6).
   - I8 is read for PR B as: PR A's change is the base, not an invalidator.

4. **Declared selector list for PR B.** e2e: none (the suites read Activity's tabs by id; `e2e/layout.mjs`'s Tab walk, lines 193-224 at d6c2daf6, counts regions). Unit: `frontends/shell/src/layout/StudioLayout.test.tsx`, lines 24-42 (the `Slots` literal lacks `activity.jobs`, a `tsc` error) and line 371 (the tab list) at d6c2daf6; `frontends/shell/src/App.table.test.tsx`, line 206 at d6c2daf6 (the tab list).

5. **Scope, class 9 on the seam rule, declared before their code.** PR B's Tests (§2.6) gain two existing files:
   - `frontends/shell/src/layout/StudioLayout.test.tsx`: `NO_SLOTS` gains `"activity.jobs": null`; the tab-list case expects Jobs after Problems, with its comment. No other line changes.
   - `frontends/shell/src/App.table.test.tsx`: the expected tab list gains Jobs. No other line changes.
   - Declared unchanged for them (§5): every other case of both files.
   - **Mutation M15-1:** in `contributions.ts`, put Jobs before Problems in `ACTIVITY_TABS`. Expected failure: both tab-list assertions. Observed and recorded as a dated line beside the StudioLayout case (§4, "How a mutation is observed").

6. **§2.4 at this base, declared.**
   - The Jobs export Cancel calls `run.cancel()` once and never sets `cancelChosen`. The late-cancel statement stays the ask's alone, as its own comment says (`OpenDuringExportAsk.tsx`, lines 14-17 at d6c2daf6). An execute cancelled from Jobs that ends in a bundle anyway shows no statement in Jobs. That needs the cancel to land within one request round trip (the same comment), a case named in the JobsTab comment and not tested.
   - `handleExportRunning` and `answerOpenAsk` keep every existing line byte for byte; the mirror adds lines beside lines 1300 and 1309 at d6c2daf6. The recorded mutations of `App.selection.test.tsx` name lines there (line 1103 at d6c2daf6).
   - S-2, S-7, S-8, S-9 and S-11 (ADV-2026-11-23-30 item 1) live in `jobs.ts`, copied by script from the ruling; `contributions.ts` imports S-2 from it. No constants file is added.
   - On the shipped arm the scan row shows S-8 alone: the candidate session dispatches only `issued` and `reset` (`candidateArmSession.ts`, lines 624-633 at d6c2daf6), for which `scanLivenessText` is null. The liveness text reaches the row on baseline only; J-R1 covers the digit clause.

7. **Tests.** The J rows are §4's as Amendment 2 leaves them, with each one mutation there. Three declarations, no row edited:
   - **J-A1 and J-A2's harness.** The PublishPanel stand-in keeps the `onExportRunning` that App passes, as `App.table.test.tsx` does (lines 97-102 at d6c2daf6). The test calls it with a report of `ExportRunReport`'s real shape. The module is already mocked by the harness, so this is not I5. J-A2 observes "releases the consumer" through the Table's first scope, which issues again once `ended` resolves, as the table suite observes `exportHeld`; it does not use a spy.
   - **J-E1's start, under N-2 (Amendment 4).** In place of the pan (H6), the step waits for the settle and applies the slow predicate through the Filter panel, as `e2e/filter-panel.mjs`'s FIND' does on the shipped arm (lines 304-334 at d6c2daf6). It then waits for `button.filter-cancel` and the Jobs scan row, and goes on as Amendment 2's J-E1 row. Why: FIND' shows that the predicate's scan of the 4,000,000-feature fixture runs long (its bound, lines 336-349 at d6c2daf6), while a fill after a pan has no recorded duration. H6 is then not tested; it is neither confirmed nor refuted. Operator step 4 already filters (Amendment 2, E-1 item 5). Any status other than the statement at `residencyStatus.ts` line 462 at d6c2daf6 FAILS the step.
   - **J-E2.** If the export row is gone before the click, the run is VOID (exit 2), never a PASS, as `e2e/admission-remediation.mjs` reports a fast open (line 655 at d6c2daf6).

8. **§7, not edited.** Predicted at the count:
   - B-P: jobs ~110 (120), JobsTab ~150 (170), contributions ~3 (5), surfaceRegistry ~2 (6), styles.css ~30 (40) and package.json 1 (1) hold. **App ~185 against 150, class 8:** the 70-line move counts about 140 under numstat, as the form gate's attempt 1 named it under "Ceiling risk", plus the mirror, the slot and the imports.
   - B-T: jobs.test, JobsTab.test and App.jobs.test within 260, 230 and 400. The two files of item 5 have no ceiling of their own, so their ~6 lines are class 8 against 0 (as Amendment 12 item 7 reads such files).
   - B-E: jobs.mjs within 420 plus 60.
   - PR B: about 1,850 against 1,862. Any overrun is class 8 in PR B's closing amendment.
   - Records, outside the count: walkthrough ~14 of 120, e2e/README ~6 of 40, KNOWN-LIMITATIONS ~6 of 50 (OPEN-B2 (b) adds ~5).

9. **KNOWN-LIMITATIONS.** KL-B and KL-C land with PR B (Amendment 9 item 6), in ADV-2026-11-23-30 item 2's words, at the numbers of item 10. Each has a source comment naming, by symbol, where the code does each clause. The build's gates check each clause, and the advisor compares the words byte for byte at the merge check.

10. **Part and numbers.** Part AF, rows AF4 and AF5 before AF6, and their Result log lines before AF6's (`frontends/shell/MANUAL-WALKTHROUGH.md`, lines 2075 and 2091 at d6c2daf6), from §9's steps 4 and 5 as Amendment 2 leaves step 4. AF6 gains S-2, S-7, S-8, S-9 and S-11. The S-12 row text that AF6 shows changes to the widened tab list. KL-B's and KL-C's numbers are the next unused under rule (00a) over the base and every unmerged branch, named by the custodian by script at this amendment's filing and checked again before their commit.

11. **The row-filter paragraph (§9a).** No note is added. Its correction speaks of v0.1.0. At d6c2daf6 a tile dropped on a refused mint ends its work (`frontends/shell/src/streaming/tileViewportStreamManager.ts`, lines 1004-1007 and 1032-1036; `candidateArmSession.ts`, lines 1083-1086 at d6c2daf6). The Jobs scan row uses FilterPanel's predicate exactly. Limit: other paths were not traced.

12. **OPEN-B1 to OPEN-B4** go to the advisor with this amendment. No code of OPEN-B1 (b) or (c), or of OPEN-B2 (b), before its ruling (I7). Under OPEN-B1 (b), the scope additions there are declared by this item and bind only on that ruling.

Read the last amendment first.

Nothing above is edited.
````

**Seams PR B crosses**, checked against the real interfaces read above:
- Seam 4: FilterPanel's `onCancel` ([A] FilterPanel.tsx:28), proven by J-A1 and then J-E1.
- Seam 5: `ExportRunReport` ([A] PublishPanel.tsx:38-41). J-A2 proves App's consumer side through the captured prop; J-E2 proves the real producer.
- The App to JobsTab props are PR B's own; J-A1 and J-A2 prove them from the real App.
- Every new export has a product caller:
  - `jobsFrom` and `JobsTab` are called by App;
  - `handleCancelScan` is called by FilterPanel and JobsTab;
  - the strings are used by contributions and JobsTab.

**Security posture.** PR B's Scope holds no file under `src-tauri/` or `capabilities/` and adds no command. So, by Scope, it does not change the posture.

**Shared paths under rule (00): the custodian's list.** From what I read:
- the a-second-save piece shares `MANUAL-WALKTHROUGH.md` (its AF3a spans; ADV-2026-11-26-25 item 3);
- under OPEN-B1 (b), it also shares `App.conditions.test.tsx`, since its C-A6 words change with the time.

---

## 3. A form of its own

Not needed (see the end of part 1).

---

## 4. The two questions of ADV-2026-11-26-25 item 6, for the advisor (OPEN, not decided)

### OPEN-B1. Should a newer notice of the same urgency take the strip's top?

**The facts at [A]:**
- `ordered` sorts by urgency, then by first raise, oldest first ([A] conditions.ts:215-218). The strip shows the first ([A] :220-224), in its one slot ([A] contributions.ts:48-49).
- All three notice routes are urgency 3 ([A] conditions.ts:50-52). The reopen notice ends only at the next open (:52).
- A save's batch ends the old save notices once and raises each display through `raise` ([A] :187-203). Each gets the next `seq` (:167-169), so it is newer than any notice standing.
- Reopen notices are raised one per notice, in the owner's order ([A] App.tsx:1266-1267). Ordinary reopens give them: a changed file, the lineage places, a view not applied, hidden text, a style not applied ([A] openProject.ts:132-142).
- The result, as a paraphrase: after any reopen that gives a notice, every save's lines show only in Problems, with no alert role ([A] ConditionView.tsx:61). Only S-3 changes ([A] StudioLayout.tsx:392-395). A save that gives as many lines as the last changes nothing in the strip, because the batch's end and its raises are one reducer step.
- The rules that bind it:
  - Oldest-first is OPEN-3 (a), ruled in ADV-2026-11-23-17 item 3; its recorded reason concerns refusals ([M] form:525, paraphrase).
  - Plan §9 binds only "the most urgent" and never erasing an older blocker ([M] state/directives/SHELL-MIGRATION-PLAN-2026-10-07.md:246-247). A notice is not a blocker.

**The options:**
- **(a) Keep oldest first at every urgency.**
  - PR B's Scope and budget do not change.
  - The gap goes to OPEN-B2.
- **(b) Within urgency 3 only, the notice route raised most recently comes first, and each route keeps its own raise order.** Urgency 1 and 2 are unchanged.
  - It is a pure change to `ordered`, so the strip and Problems both follow it.
  - A batch keeps its order, so the save's first line still leads (C-A6).
  - By reading (not run), it changes no existing test: C-U2's fixture has one notice ([A] conditions.test.ts:71), so its mutation still fails, and C-R2 has one notice route ([A] ProblemsTab.test.tsx:64).
  - Scope, class 9: `conditions/conditions.ts` (~10 lines) and `conditions/conditions.test.ts` (a new case C-U2b, ~30 lines). Its mutation is plain `seq` order, which fails C-U2b; newest-first for all fails C-U2 and C-U2b.
  - The seam rule also asks for a new App test from the real App: reopen with a notice, then save; the top is the save notice (~40 lines in `App.conditions.test.tsx`, class 9). The harness already has a reopen (C-A3) and a save (C-A6).
  - Budget: about +80 counted lines, so PR B is about 1,930 against 1,862 (class 8).
  - It shares a path with the a-second-save piece.
- **(c) As (b), but in its own node after PR B.**
  - PR B is unchanged.
  - The gap stands until that node.

**Recommendation: (b), in PR B.** It is within seam 8 of this form, keeps plan §9 and keeps OPEN-3 (a) for refusals, and it closes the ordinary-use gap at the cost of one selector. Take (c) if PR B is to stay Jobs-only.

### OPEN-B2. Do PR B's KNOWN-LIMITATIONS words cover a save's line under an older notice?

**The facts:**
- KL-B and KL-C (ADV-2026-11-23-30 item 2) describe Jobs.
- PR A's items 77-79 ([A] KNOWN-LIMITATIONS.md:560-571) say what Problems lists, that it is emptied at each open, and the cap. None says that a report can show only in Problems.
- The a-second-save form records the case only as a non-claim ([M] governance/forms/frontends/A-SECOND-SAVE-IS-ANNOUNCED-PREREGISTRATION.md:109) and in its §9c ([M] :429-431). Its OPEN-A5 was ruled "neither" (ADV-2026-11-26-25 item 5).
- Ordinary use reaches the case under both options of OPEN-B1:
  - under (a), below an older notice, refusal or ended session;
  - under (b), below a refusal or an ended session.

**The options:**
- **(a) No words.**
  - KL-B and KL-C stand as ruled.
  - Nothing changes in PR B.
- **(b) A new item, KL-F, PR B's third number.**
  - It is a record, outside the count (~5 lines).
  - My drafts are below. They are not the human's or the advisor's words; the advisor words the item.
- **(c) A sentence added to item 77 (KL-A).**
  - That edits the advisor's ruled words in PR A's item, from PR B.
  - Not recommended.

**Recommendation: (b).** This case is reachable in ordinary use, and it is a limit that no record states.

**Draft KL-F under OPEN-B1 (a):** "The attention strip shows one report: an ended session first, then the oldest refusal, then the oldest notice. A report raised after the one shown, with the same rank, is listed in the Problems tab and not shown in the strip. While an earlier report stands in the strip, a save's lines are shown only in Problems, and in the strip only its button appears or changes; a later save that gives as many lines as the one before changes nothing in the strip."

Clause check at [A]:
- one report: the one slot (contributions.ts:48-49);
- the ranks: urgency 1-3 (conditions.ts:46-52), oldest first (:216-218);
- "only its button appears or changes": `others > 0` gives S-3 (StudioLayout.tsx:392-395);
- "changes nothing": one-step `replaceBatch` (conditions.ts:187-203) with the top's id unchanged.

**Draft KL-F under OPEN-B1 (b):** "The attention strip shows one report: an ended session first, then the oldest refusal, then the newest group of notices, such as a save's. While a refusal or an ended session stands in the strip, a save's lines are shown only in the Problems tab, and in the strip only its button appears or changes; a later save that gives as many lines as the one before changes nothing in the strip."

Clause check: the same, with `ordered` as (b) defines it. "Group" is a route's notices: a save's batch, an open's reopen notices, or a record notice.

---

## 5. OPEN items beyond the two

- **OPEN-B3. Runs before code, and a moving base.**
  - **The facts:**
    - §0.3 has the re-sweep run every e2e suite at the base before code ([M] form:102-104).
    - Port 5180 is held, and PR A's own head runs are still owed (Amendment 13, [M] form:2047, :2052).
    - PR A's head will move.
  - **The options:**
    - (a) PR B's code waits for the base e2e runs.
    - (b) Code and vitest runs go ahead inside the holds, as ADV-2026-11-26-25 item 9 allowed for A.
      - PR B's base runs are PR A's own head runs when PR B's base is that commit; otherwise they are run at PR B's base once the port is free, before any J-E run.
      - A later head of PR A comes in by a merge commit with the reviewer's narrow read, recorded by amendment, as ADV-2026-11-27-08 item 2 and ADV-2026-11-26-25 item 8 set it for other pieces.
  - **Recommendation: (b).** Scope is unchanged; it costs one narrow read per moved head.

- **OPEN-B4. KL-C's reach to the ask.**
  - **The facts:**
    - The ask's "Cancel the export and go on" also calls `run.cancel()` ([A] App.tsx:1336-1344). It is a third control.
    - The Jobs row's latch is the row's own, so after the ask's choice the row still reads Cancel until `ended`.
    - KL-C names two buttons.
  - **The options:**
    - (a) KL-C as ruled, with the case named in its source comment.
    - (b) The advisor widens KL-C.
  - **Recommendation: (a).** The ask is not a button with a label to keep, and the row keeping its label matches what KL-C states. Neither option changes Scope or budget.

**Files read**
- [M] `C:/dev/spatial-ide/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md`
- [M] `C:/dev/spatial-ide/governance/PLAN.yaml`
- [M] `C:/dev/spatial-ide/governance/forms/frontends/A-SECOND-SAVE-IS-ANNOUNCED-PREREGISTRATION.md`
- [M] the two rulings in the brief, plus ADV-2026-11-23-30 and ADV-2026-11-27-35 under `C:/dev/spatial-ide/state/directives/`
- [A] under `D:/wt/m5a/frontends/shell/src/`: `conditions/`, `layout/`, `App.tsx`, `publish/`, `feature/OpenDuringExportAsk.tsx`, `filter/FilterPanel.tsx`, `table/TableTab.tsx`, `residency/`, `streaming/tileViewportStreamManager.ts`
- [A] the cited lines in `D:/wt/m5a/KNOWN-LIMITATIONS.md` and `D:/wt/m5a/frontends/shell/MANUAL-WALKTHROUGH.md`
