Reviewed: PR #253 at ec95eacb69766759ec454f2f5aae9688b49458b1 (base e5e6e03a), gate 1, architect — cut/b1-shell-half-pr-c @ ec95eacb69766759ec454f2f5aae9688b49458b1
Verdict: FAIL

The gate fails on one Correctness finding and one Evidence finding. Both are small, but both change code, so each fix is re-gated on its own delta. All path:line cites below are read at ec95eacb in the worktree.

## Correctness

**C1. The table's "ended" line states an engine fact that is untrue for one of the two ways a session ends (§1 "The shell's lines state only the shell's consequences"; §8 item 14).**
- `frontends/shell/src/table/tableSource.ts:73` shows `"[P6 placeholder] The file changed, so the table was cleared; open the file again to load it."`
- It shows for every session end:
  - `TableTab.tsx:69-70` calls `end()` when `sessionEnded` is set.
  - App sets `sessionEnded` from both end reasons (`App.tsx:739-742`, `1363-1375`, `2479`).
  - The source's own terminal and refusal checks match both `engine.source_changed` and `engine.source_coverage_lost` (`streaming/liveTicketSet.ts:58-63`, `80-85`).
- Coverage-lost is the watcher losing its watch, and the engine says it is never a source change (`protocol/skp/SKP-V0.md:882-884`). It fires on a notification-buffer overflow (`engine/src/watch.rs:343-351`), which a burst of file activity in the dataset's folder can cause in ordinary use.
- **Fix:**
  - At `tableSource.ts:73`, a line that states only the table's consequence, for example `[P6 placeholder] The dataset's session ended, so the table was cleared; open the file again to load it.` It is still a P6 placeholder for the sitting (AC8).
  - Update `TableTab.test.tsx:163` to the new string and observe PC-R2's mutation again.
  - In AC8 (`MANUAL-WALKTHROUGH.md:1983`), "the line it shows after the file changed" becomes "the line it shows after the dataset's session ended".
- Ledger note, outside PR C: `canvas/HoverReadoutView.tsx:40` and the Feature tab's selection-ended notice already word both end reasons as "the source file changed". This is not PR C's diff.

## Evidence

**E1. PC-U4 is written against an imagined interface (the seam rule, RULED 2026-09-16, question round 4; §8 item 17).**
- `frontends/shell/src/App.table.test.tsx:21` types the PublishPanel stand-in's capture with its own shape, `ended: Promise<unknown>`.
- `:241` ends the run with `{ phase: "execute", outcome: { kind: "cancelled" } }`.
- The real shapes are different:
  - `ExportRunReport` is at `publish/PublishPanel.tsx:38-41` and `ExportRunEnd` at `:31`.
  - `ExecuteOutcome` (`publish/types.ts:68`) is keyed by `status` and has no `kind`.
- This is the same pattern Amendment 8 item 1 closed for `App.lateResult.test.tsx`.
- PC-U4's claim itself holds: with `cancelChosen` false, `lateCancelOutcome` (`feature/OpenDuringExportAsk.tsx:31`) never reads the outcome. The rule fails it by name anyway.
- **Fix (in a §2.6 file, inside its 450):**
  - Type `mocks.exportRunning` as `null | ((run: ExportRunReport) => void)`, importing the type from `./publish/PublishPanel`.
  - End the run with a real `ExportRunEnd`, for example `{ phase: "execute", outcome: { status: "unknown-attempt" } }` (the shape used at `PublishPanel.test.ts:189`).
  - Observe PC-U4's mutation again.

## Documentation (must fix before the merge; no re-gate; none of these sentences is the human's wording)

**D1. `frontends/shell/src/table/tableConstants.ts:19`** (the architect's words, from Amendment 8 item 3). It leaves out a window that needs timing inside one request round trip, so under §31 it is named in the comment rather than blocked. Replacement line:

`// TABLE_MAX_IN_FLIGHT (milestone 4 section 7, 1) is not a constant here: tableSource holds one stream handle and cancels it before it issues another, so no code would read the constant. Not covered: a start made before the previous viewport_query has been answered issues at once, and the earlier ticket is cancelled when its answer arrives, so for that window the kernel holds two table tickets, each with a stream connection.`

Clause check:
- "holds one stream handle": `tableSource.ts:101`.
- "cancels it before it issues another": `tableSource.ts:125` runs before `:131`, and TableTab's cleanup `source.cancel()` (`TableTab.tsx:66`) runs before the re-run's `start`.
- "issues at once": the handle is set only at `:140`, so while the earlier query is pending, `previous` is null and only `:126`'s microtask comes before `:131`.
- "cancelled when its answer arrives": `:136-137`.
- "each with a stream connection": `kernel/src/skp.rs:87-90`.

**D2. `KNOWN-LIMITATIONS.md:430`** (item 56's source comment). Replace `Not covered: the engine may hold a cancelled stream until its cancel completes (milestone 4's form, Amendment 8 item 3).` with:

`Not covered: the engine may hold a cancelled stream until its cancel completes (milestone 4's form, Amendment 8 item 3); and a filter, scope or visibility change made before the Table's previous viewport_query is answered issues the next one at once, so until that answer arrives and its cancel lands the Table holds two tickets, each with a stream connection (start in frontends/shell/src/table/tableSource.ts; MAX_PENDING_TICKETS's comment in kernel/src/skp.rs).`

Clause check: the same as D1. Hide then show issues through `TableTab.tsx:64-66`, and so do filter and scope changes, which are its effect's dependencies.

**D3. `frontends/shell/src/canvas/WorkingCanvas.tsx:179`** names the wrong caller. Replace it with:

`   * REQUIRED, with no `?`: its product caller is `table/TableTab.tsx`, through App's `residentIdsStreamedUnder` callback, and `table/tableScope.ts`'s `secondScope` reads the set it returns (the second scope's "an id in a resident batch streamed under the view's filter"). */`

Clause check: the call is at `TableTab.tsx:74`, App's wrapper is at `App.tsx:1401-1404`, and the set is read at `tableScope.ts:47`.

**D4. PC-E2's text says more than PC-E2 asserts.**
- (a) `frontends/shell/e2e/table.mjs:12-13`. Replace the text from "The second scope lists the other two," to "still lists three." with:

  `The second scope lists the other two (the map holds them from streams asked for under that filter) and its line names 2 of 3 selected features; the third scope still lists three.`

  Clause check: the step switches to the third scope at `:285` and only then applies the filter at `:290`. The first scope issues only in "filtered" (`TableTab.tsx:64`), so it never ran under `id <> N`. The members were selected under no filter. So the two pass only through `residentUnderView` (`tableScope.ts:47`). The assertions are at `:292-296`. The old reason given, that the first scope's result reached the limit, is untrue.
- (b) `frontends/shell/e2e/README.md:831`. Replace `the second scope lists the other two and counts the hidden one as one it could not check;` with `the second scope lists the other two and its line names 2 of 3 selected features;`.

  Clause check: `table.mjs:294-296`. Asserting `1 could not be checked against it` instead would be a test change and would need a new run.

**D5. `KNOWN-LIMITATIONS.md:421`.** Replace `and says that more may pass.` with `and says that more may pass the filter, or, with no filter in force, that the file may hold more.`

Clause check: `tableSource.ts:63-65`.

**D6. `frontends/shell/src/table/tableConstants.ts:9`.** Replace `, so 10,000 members hold at most 160 MiB.` with `, so 10,000 members count at most 163,840,000 bytes (156.25 MiB); the count is declared by `cellBytes`, not a measured heap size.`

Clause check: 16,384 × 10,000 = 163,840,000 bytes, which is 156.25 MiB. `selection.ts:55-56` declares the count. Read as heap size, the old clause would not hold, because per-cell objects are not counted.

**D7. PR body, the E2E paragraph.** Replace `At bc315fb9 every existing suite passed. The refusal suite, `e2e:layout`, `e2e:selection` and `pan-anchor.mjs` each failed at least once and passed when run again; Amendment 9 item 3 reads them as not I3, for the gates to check.` with:

`At bc315fb9 every existing suite passed except `pan-anchor.mjs`, which passed 14 and then 15 of 16 there. The refusal suite, `e2e:layout` and `e2e:selection` each failed at least once and passed when run again; Amendment 9 item 3 reads these four as not I3, for the gates to check.`

Clause check: the re-run report's suite table (pan-anchor ended rc 1 both times at bc315fb9). The body's next bullet already gives the ec95eacb runs.

**D8. Amendment 9 item 3, the reading's second sentence, is untrue for `pan-anchor.mjs`.** It failed again on its own re-run, 15 of 16 (the re-run report, finding 3). A correction appended under the record cap:

> Defect: Amendment 9 item 3's reading, its second sentence, is untrue for `pan-anchor.mjs`, which failed again on its re-run at bc315fb9 (the re-run report, finding 3). Corrected reference: it passed at the head in the follow-up report's rows `pan-anchor` head 1 and head 2, at ec95eacb with the bc315fb9 exe. Proof: those two rows, and PR C's diff, whose `WorkingCanvas.tsx` hunks change only `pushBatch`, `pushTileBatch` and the new read-only method.

It closes with the superseded index: Amendment 9 item 3, the reading's second sentence.

**D9. Two strings are neither listed for sight nor recorded (§8 item 15; §5).**
- `table-failed` (`tableSource.ts:267`) is a code the RefusalBlock shows.
- The reworded `layout.selectActivityTab` statement (`console/surfaceRegistry.ts:296`) changes an existing string.
- **Fix:**
  - At the end of AC8 (`MANUAL-WALKTHROUGH.md:1983`), replace `and the Console's statements for the Table's scope choice and Cancel.` with `the Console's statements for the Table's scope choice and Cancel, the Console's statement for switching Activity tabs, which now names the Table tab, and the code `table-failed` the table shows when it fails for a reason the kernel did not give.`
  - Add both to the PR body's sight list.
  - PR C's closing amendment records the statement change, by reference, as class 1, as Amendment 6 item 2 did for PR A.

**Points for the human's P6 sight (not findings):**
- With no filter in force, `selectionLine` still says "that pass the filter" (`tableScope.ts:63`).
- The stopped line always says "more may pass the filter". That is the architect's wording from Amendment 7 item 5, for AC7.
- A refusal partway through a stream keeps the rows already delivered under "could not be loaded" (`tableSource.ts:71`).

## §8, item by item

1. Pass. The diff has 59 files: §2.6's PR C list, Amendment 7 item 3, Amendment 8 items 1 and 4, and the three records. `actionRegistry.ts` is not among them. Nothing is under `protocol/`, `kernel/src`, `engine/` or `src-tauri/`.
2. Pass. `package.json` gains one script line, and the diff has no lockfile.
3. Pass. Only the existing `viewportQuery` and `cancel` are used (`skp/client.ts:107-130`).
4. Pass. `rowAt` reads ids and attributes from the same decoded block (`tableSource.ts:280-285`). Both rebuilds carry `filter` (`tileIngest.ts:232`, `tileResidentSet.ts:263`).
5. Pass. Ids stay `bigint`, and `cellBytes` uses `toString()`.
6–7. Not applicable; these are PR B's.
8. Pass. The table sends the open's `projectionFor` set (`App.tsx:842`, `1389`).
9. Pass. A NULL shows its marker (`TableTab.test.tsx`). An empty cell appears only where no row was captured, and then the projection has no columns.
10. Pass for hidden, pan and a held consumer. "More than one" passes except for the round-trip window, which D1 and D2 name.
11. Pass. The count lines are `tableLine` (`tableSource.ts:58-77`). A stopped, cancelled, refused or limit-sized result is never complete (`:53-55`, PC-U14).
12. Pass. No "undo" anywhere in the diff.
13. Pass. Every new export, the handle method and `onTableShownChange` has a product caller.
14. **Fail: C1.**
15. Documentation finding D9.
16. Pass.
17. **Fail: E1.** The filter seam is proven by PC-U7 to PC-U12 and PC-U15. The wire seam is proven end to end by PC-E1, PC-E3 and PC-E4. The resident-batch path is proven end to end by PC-E2 (see D4).
18. Pass. Round 25: no overrun (the worker's per-file figures), no scope addition without its amendment, no `verify-mutation` run called an observation, and no test-text span pinned at a branch commit.
19. Pass. The PR body's two quotes of the ruling match `state/directives/2026-10-24-…probe-branch.md:10`. There is no ledger line cite and no bare self-line.
20. Pass. No code for an open OPEN item, and no PR B hook.

## What I checked

- **§2.4 with Amendment 7 item 5 and Amendment 8 items 3–6.**
  - The ceiling: `tableSource.ts:216-234` uses `>` against the running sum, cancels the stream, sets "stopped" and adds no later batch.
  - The derivation is at the constant, and the measurement node exists (`PLAN.yaml:2371`).
  - The table never marks a row not-held.
  - The constant's comment matches the redraft consult's lines 13–23, compared by eye.
  - The `TABLE_MAX_IN_FLIGHT` comment is byte-equal to Amendment 8 item 3's words, compared by eye.
  - PC-U1 asserts the call order.
  - PC-U6 is in `tableSource.test.ts` with only the transport mocked.
  - PC-E4's source comment on the case not covered is at `table.mjs:18-19`, with the same statement in `README.md:833`.
- **ADR-023 §11 items 2–9.** Items 2 and 3 pass: no new refusal mapping and no second type gate. Item 4 passes. Items 5 and 6 do not apply to PR C. Item 7 passes: the hover is unchanged and the rows are co-indexed. Item 8 passes: no version bump. Item 9 passes: no figure and no completed workflow.
- **ADR-010.**
  - Rule 1: `decodeBatch` checks the frame.
  - Rule 2: as §8 item 4.
  - Rule 5: generation end runs `end()`, and close or replace runs `dispose()` (`App.tsx:1377-1398`).
  - Rule 6: the ceiling above.
- **ADR-006.** The table and the selection's new fields are class 1. Export is still class 3: the only change in its handler is the table cancel at `App.tsx:1175`.
- **Amendment 8 item 9's list.**
  - The handle method has no `?` (`WorkingCanvas.tsx:180`), and App's `?.` is on the ref, not the method (`App.tsx:1402`).
  - There is one `traceStreamIssued` call (`tableSource.ts:163`).
  - Nothing under `table/` calls `recordResidency*`, and there is no `TABLE_MAX_IN_FLIGHT` export (grep).
  - `actionRegistry.ts` is unedited.
  - Amendment 7 item 10's additions also hold: `candidateArmSession.ts`'s diff is the filter argument only, and `tableSource` has no PR B hook.
- **Seams.** I read the real interfaces of `viewportQuery` and `cancel`, `CancelResponse`, `SkpCallError`, `ExportRunReport` and `ExportRunEnd`, `Terminal`, and `PublishPanel`'s reporting order (`:403-431`, `:516-520`), which supports KL-56's "beside, not before".
- **KNOWN-LIMITATIONS items 54–56** against the code: corrections in D2 and D5. Item 55 holds.
- **AC6–AC8 against §9's rows 6–8:** they match, apart from C1's phrase and D9.
- **Amendment 9.**
  - Item 2 holds: the one-line fix is in a §2.6 file, 418 of 540 lines, and the follow-up gives 3 of 3 passes with the mutation failing at assertion 3.
  - Item 3 holds for the refusal suite, `e2e:layout` and `e2e:selection`.
  - For `pan-anchor.mjs` the conclusion holds on the diff: no hunk touches camera or recenter code. But its wording is wrong (D8). The base was never run under comparable load, so the record does not separate load from code. The amendment's own tripwire (a later failure at the head is I3) is what guards it.
- **PR body:** every claim checked against the form and the head. One correction, D7.

**Not run (I have no shell):** `tsc`, `vitest` and the verify scripts (I relied on the worker report at bc315fb9); recomputing any sha256 (the filing notes agree with Amendment 9's values; the reviewer recomputes them); and rule (00) against the other branches. No ADR is needed.
