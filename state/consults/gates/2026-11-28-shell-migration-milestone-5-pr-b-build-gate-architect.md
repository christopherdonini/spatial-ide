# Milestone 5's second part, PR B: the architect's build gate, the read part, at e958b913 (node:shell-migration-milestone-5@pr-b-build-gate-architect-1): FAIL

*Filed by the custodian. The architect (Opus) read the records at main 51f5e1daf1c05dc39e0d3ac94e49657f83bbe47f in D:/wt/read-1128a and the code at e958b913240d296b7229cd976831b205fc8adbde in D:/wt/m5b, with the custodian's locators in D:/wt/m5b-logs, read only; it ran nothing and wrote no file. By the facts script its records run from 2026-11-28T02:27:02Z to 2026-11-28T02:38:44Z, and it matched none of its calls to the main checkout. By its completion notice it took 702356 ms and 60 tool uses. Its hand-back is below as received, with the harness indent removed: 18823 bytes, sha256 4c5e25df000cef3506fd2e57c60c1fa049d57112fc31d104fa5369afe2b230c5.*

---

**Verdict: FAIL.** I reviewed cut/shell-migration-milestone-5-pr-b @ e958b913240d296b7229cd976831b205fc8adbde. The governance texts were read on main at 51f5e1daf1c05dc39e0d3ac94e49657f83bbe47f, and the code in D:/wt/m5b at e958b913. The base is d6c2daf6.

There are two Evidence findings. Both are small test-code corrections. There are no Architecture or Correctness findings. D-1 to D-7 are Documentation findings, must-fix before the merge. Every cite below is a locator read at e958b913 or 51f5e1da. None is pinned by hash, because I have no shell.

**Locators.** I read gate-diff.txt and gate-numstat.txt against the head files: jobs.ts, App.tsx at 1289, 1306, 1316, 2272, 2409 and 2690, and conditions.ts 215-233. The content matches. The numstat sums to 1,107 lines. I could not check byte counts or sha256.

## Evidence (blocking)

**E-1. J-A1 never checks the relinquished statement.**
- Its row (Amendment 2, E-1 item 4) asks that `.residency-status` change to the owner's relinquished statement (`residencyStatus.ts` 463).
- Amendment 2's "Known pass cases" says J-A1 "asserts the status both changes and matches the owner's statement" (paraphrase).
- The test (`App.jobs.test.tsx`, J-A1) checks that the twin's status changes, that it is truthy, and that the Jobs status equals the twin's. It never checks that the twin's text is the owner's statement.
- So the test name's "relinquishFill runs" rests on no assertion. A broken candidate branch in `handleCancelScan` would still pass, because both Cancels call it.
- Not spying is allowed by E-1 item 4. The gap is the missing match.
- Correction (test code, one line, occurs once in `frontends/shell/src/App.jobs.test.tsx`):
  - old: `    expect(twin).toBeTruthy();`
  - new: ``    expect(twin, "the owner's relinquished statement (relinquishedText, residencyStatus.ts)").toMatch(/^Filling stopped — showing \d+ features already loaded; the rest of this view was not loaded\.$/);``
  - The dash is U+2014, as in `relinquishedText` and `jobs.mjs` line 115.
- It holds at the head: the recorded mutation output shows the twin reads "Filling stopped — showing 3 features …". The recorded J-A1 mutation still fails at the final equality.

**E-2. `jobs.mjs` turns its own preregistered mutations into VOID instead of a failure.**
- Every `waitFor` timeout throws `Void`, which exits 2. Three cases follow:
  - The J-E1 mutation ("Jobs Cancel not wired") leaves the row standing. The wait for the row to go (line 194, 60 s) then throws VOID unless the scan happens to end first. FIND' allows up to 180 s.
  - The J-E2 mutation ("the row is not removed") hits the wait at line 222 and is always VOID.
  - J-U2's mutation, whose declared set includes J-E2, can be VOID at lines 218-219.
- §4 declares each of these sets as failing. A VOID is not a failure, so the suite cannot show its own mutations failing.
- Correction (code, `frontends/shell/e2e/jobs.mjs`; each old text occurs once):
  1. old: ``  const after = await waitFor("the row and FilterPanel's Cancel to go", () => read(page), (r) => r.scanRow === null && !r.filterCancel);``
     new: ``  const after = await waitFor("the row and FilterPanel's Cancel to go", () => read(page), (r) => r.scanRow === null && !r.filterCancel, 20_000).catch(() => read(page));``
  2. old (two lines):
     ``  const answered = await waitFor("S-11 on the row", () => read(page), (r) => r.notCancelled !== null || r.exportRow === null, 20_000).catch(() => null);``
     ``  if (answered === null) throw new Void("neither S-11 nor the row's end followed Cancel");``
     new (one line):
     ``  const answered = await waitFor("S-11 on the row", () => read(page), (r) => r.notCancelled !== null || r.exportRow === null, 20_000).catch(() => read(page));``
  3. old: ``  const gone = await waitFor("the row to leave at the prepare's end", () => read(page), (r) => r.exportRow === null, 20_000);``
     new: ``  const gone = await waitFor("the row to leave at the prepare's end", () => read(page), (r) => r.exportRow === null, 20_000).catch(() => read(page));``
  - The `record(...)` call after each line then records a FAIL, which exits 1.
  - A row never standing, or gone before its click, stays VOID (lines 189, 191-193, 212-217), as Amendment 15 item 7 rules.
- Words that follow from it (not ruled):
  - `jobs.mjs` line 88. old: `// Exit 0 all PASS; 1 a check failed; 2 VOID (a precondition failed: the arm, a fixture, the row never standing, any wait that timed out).` new: `// Exit 0 all PASS; 1 a check failed, a wait after a Cancel click that timed out included; 2 VOID (a precondition failed: the arm, a fixture, a row never standing or gone before its click, any other wait that timed out).`
  - `frontends/shell/e2e/README.md`. old: `and 2 when the run is VOID (the arm, a fixture, the export row never standing before the prepare ended, or a wait that timed out).` new: `and 2 when the run is VOID (the arm, a fixture, a row never standing or gone before its Cancel click, or any other wait that timed out); a wait after a Cancel click that times out is a failure, exit 1.`

The corrected test lines need the reviewer's narrow read. J-E1 and J-E2 then run at the port.

## The architect's checks, §9

**§8, item by item:**
1. True. No file outside §2.6, Amendment 15 item 5 or Amendment 16 item 3. Nothing under protocol/, kernel/, engine/, src-tauri/, capabilities/, residency/, streaming/ or skp/ (numstat).
2. True. No dependency. The lockfile is absent from the numstat. Per the worker the lock diff is empty; I did not run it.
3. True. `ordered` reads route and seq only (`conditions.ts` 220-227).
4. True. `raise` is unchanged.
5. True. The strip (`attentionOf`, App 940) and Problems (`ProblemsTab` 16) both call `ordered`. C-A8 checks that `.reopen-notice` appears once.
6. True. The only buttons are the scan Cancel and the export Cancel that exist today (plan §9).
7. True. The scan row calls `handleCancelScan` (App 2690), the same function FilterPanel gets (2409). The export row calls `job.cancel`, which is `report.cancel` (1306). FilterPanel's Cancel is kept.
8. True. No figure. The scan row shows only the owner's `scanLivenessText`, and JobsTab.test passes it in its real form. No "cancelled" claim: S-11 is a negative, and a true answer stays at Cancelling.
9. True. Every export (JOBS_LABEL, NO_JOBS_TEXT, SCAN_JOB_TEXT, EXPORT_JOB_TEXT, NOT_CANCELLED_TEXT, ExportJob, Job, jobsFrom and its third parameter, ExportCancelState, requestExportCancel, JobsTab) has a product caller in App, contributions or JobsTab.
10. True. Jobs rewords no owner text. S-11 is ruled (OPEN-4 (a)).
11. True, as ruled. S-2, S-7, S-8, S-9 and S-11 carry no mark under ADV-2026-11-23-30 item 1, as PR A's strings do. The human sees them at AF6.
12. True. J-A1 and J-A2 use the real App and the real `ExportRunReport` (`PublishPanel.tsx` 38-41, reported at 403-408 and 518-521). C-A8 uses the hook's real answer, `"asked" | "not-asked"` (App 1495; `e2e-test-surface.ts` 190).
13. Round 25 items:
    - App's overrun is to be recorded as class 8 at the count (D-1). §7 is unedited.
    - The scope additions were declared as class 9 in Amendment 15 item 5 and Amendment 16 item 3. I did not check by git that they were committed before 0d38b74c.
    - No `verify-mutation` run is called an observation.
    - The mutation records name branch commit 12f326aa by id, with no hash.
14. True for every text the diff adds that it calls copied:
    - S-2, S-7, S-8, S-9 and S-11 against ADV-2026-11-23-30 item 1.
    - Items 81 and 82 against items KL-B and KL-C of ADV-2026-11-23-30 item 2.
    - Item 83 against the fence of ADV-2026-11-28-03 item 2, with NN as 83.
    - No line cite into the ledger, and no bare self-line.
    - Note: the moved block in `handleCancelScan` (App 2272-2340) carries a passage it marks verbatim from entry 32, already in the code. It moved byte for byte, as rule 1 requires. I could not find its source under governance/ or state/ at 51f5e1da. It is not this piece's text.
15. True. OPEN-B1 to OPEN-B4 are ruled.

**The plan's §2 rules:**
- 1: true. The handler moved whole; the lines are identical apart from indentation.
- 3: true. The scan state resets with the dataset. An export row is running work, not a fact display of the dataset.
- 4: true.
- 5: true.
- 7: true, as ruled (item 11 above).
- 10: true. Choosing a tab is pure view state (S-12). No Jobs action becomes a history step.
- 11: true. Jobs lives in an Activity tab.

**The plan's §9 against C-U2 to C-U5 and C-R1, with the new urgency-3 order (Amendment 16 item 3; Amendment 17 items 4 to 6):**
- True. Only urgency 3 changes. Urgency is still sorted first, and urgency 1 and 2 stay oldest first.
- A notice is not a blocker, so "never erases an older blocker" holds. C-U3 is unchanged and green.
- C-U4 and C-U5 are untouched, because `visibleFor` and `raise` are unchanged. C-R1 is untouched.
- The order is one total order: distinct routes have distinct newest seqs, and seq breaks ties.
- C-U2b checks the route order and each route's own raise order. C-A8 checks it from the real App.

**ADR-006:** true. `exportJobs` is App view state, and nothing becomes workspace or a history step. A Jobs Cancel only asks `publishCancel`. The export stays class 3, and nothing calls it undoable.

**ADR-010 rule 1:** true. No message carrying coordinates is added.

**ADR-018 and ADR-021:** true. No duration or progress claim, and a true answer is never read as stopped. FilterPanel's Cancel and its property are unchanged.

**Seams of §2.5:**
- Seam 4 is written against the real `handleCancelScan` and is proven from the real App by J-A1, once E-1 is fixed.
- Seam 5 is proven by J-A2 from the real shape.
- Their end-to-end tests, J-E1 and J-E2, are written and not run. This read part cannot discharge them; the second part must.

**Discharge claims:**
- "WRITTEN, NOT RUN" is honest.
- "copied by script / checked by bytes" resolves (item 14 above).
- I cannot re-apply the mutations; that is the reviewer's check. Recorded failure sets that differ from the predictions go to D-1.

## KNOWN-LIMITATIONS 81 to 83 at the head, clause by clause

**Item 81.**
- "Lists the map's loading and an export run": met by `jobsFrom` (`isScanInFlight`; `exportJobs` written by `handleExportRunning`).
- "Opening a dataset and saving or opening a project are not listed": met. `jobsFrom` lists nothing else, and `confirmOpen`, `admitAndResetStaleUiState`, `handleSaveProject` and `handleReopened` exist and make no job.

**Item 82.** The clause is met: `ExportRow`'s own `useState` latch is driven by `requestExportCancel`. PublishPanel's `cancelRequested` is set only by its own `requestPrepareCancel`. Neither touches the other, and the panel stays mounted under a hidden tab (StudioLayout 457-466). The case of ADV-2026-11-27-42 item 4 is met by `answerOpenAsk` (App 1337-1354). The source comment has one untrue clause (D-2).

**Item 83.** Every clause is met by `ordered`, `attentionOf`, `CONDITION_ROUTES` (urgency 3: reopen-notice, save-notice, record-notice), `replaceBatch` (App 892 and 2258) and the per-notice `raise` (App 1270):
- the ended session first, then the oldest refusal, then a notice;
- the three kinds;
- the kind raised last first, and each kind in its own raise order;
- after a save, the save's first line; after an open with several notices, the first of them;
- the count on the strip's button (`others`);
- while a refusal or an ended session stands, a save's lines only in Problems; a later save with as many lines leaves the top and the count unchanged.

For the advisor's sight only, with no words proposed: the "So after a save…" and "after an open…" clauses assume the places are not full. With 63 notices already kept, a save's lines are not kept, and the strip keeps an older notice. Item 79 states the cap, but item 83 cites it only for Problems.

## The worker's departures

- **`jobsFrom`'s third parameter: allowed in substance; record it (D-1).** At its one product call the predicate is exactly FilterPanel's (`isScanInFlight`), and J-U1 pins that. It adds no file, so it is not class 9. The cycle reason is true, but it runs through StudioLayout (D-6).
- **12f326aa's edit to J-A2's second test, after 0d38b74c committed it red: record it (D-1).** The dropped assertion (S-7 once both runs end) was not in J-A2's row, and J-R1 covers S-7. It was not class 3 or class 9.
- **C-A8 changed after its first red, before 0d38b74c (per the worker).** At the head it is written to the real hook. No finding.
- **J-A1 checks status equality, not a spy: allowed** by Amendment 2 E-1 item 4. The missing match is E-1.
- **AF4:** matches §9 step 4 as Amendment 2 leaves it, and Amendment 15 item 10.
- **AF5:** matches step 5 except one untrue clause (D-3). Neither row is the human's wording; they are the worker's draft for sight.

## Scope and §7

- Every file is in PR B's Scope as Amendments 15 to 17 declare it.
- B-P: App is 155 against 150, class 8 as Amendment 15 item 8 predicted. Every other file is inside its ceiling.
- Also over a ceiling: the two files of Amendment 15 item 5 are 7 lines against 0 (StudioLayout.test 5, App.table.test 2; about 6 predicted), class 8.
- The three files of Amendment 16 item 3 are 59 lines (13, 23 and 23) and are not class 8 (D-2 of Amendment 17).
- Whole count: 1,107 against 1,942 predicted, at most 1,950.
- Records: walkthrough 8 of 120, e2e/README 12 of 40, KNOWN-LIMITATIONS 11 of 50.
- The design did not grow beyond §2.4 and Amendment 16 item 3, apart from the third parameter. `requestExportCancel` and `ExportCancelState` are the shape §2.4's latch takes.

## Documentation (must-fix before the merge; none changes code; none is the human's or the advisor's wording)

**D-1. The closing amendment records the following, by reference:**
- App 155/150, class 8.
- The files of Amendment 15 item 5: 7 lines against 0, class 8.
- The third parameter.
- The edit 0d38b74c→12f326aa to J-A2's second test.
- C-U2b mutation 2 also failed C-U3 and C-U7, beyond the {C-U2, C-U2b} that Amendment 17 item 5 names.
- §4's first text check hits only the assertion regex in `src/jobs/JobsTab.test.tsx`, and how the check is read.
- §2.2's `ordered` sentence is superseded by Amendment 16 item 3.

**D-2. Item 82's source comment** (`KNOWN-LIMITATIONS.md`). The Export section's Cancel does not go through `handleExportRunning`.
- old: ``neither reads or writes the other's state, and each calls the run's `cancel` (the report's, through `handleExportRunning` in App.tsx), so the one not pressed keeps its label.``
- new: ``neither reads or writes the other's state, and each makes its own call to the host's `publishCancel` (the Export section's, while it reads Preparing, through `requestPrepareCancel` in frontends/shell/src/publish/PublishPanel.tsx; the row's through the report's `cancel`, which `handleExportRunning` in App.tsx hands to `exportJobs`), so the one not pressed keeps its label.``

**D-3. AF5** (`frontends/shell/MANUAL-WALKTHROUGH.md`). "whichever you pressed" is untrue if you press the Export section's own Cancel.
- old: `The Export section's own **Cancel** is a separate button and keeps its label whichever you pressed.`
- new: ``The Export section's own **Cancel** is a separate button: it does not change to `Cancelling` when you press the one in Jobs.``

**D-4. AF6 separators** (same file).
- old: ``S-10, `Shown above in the attention strip.` S-2, the tab's label `Jobs`; S-7, `No map loading or export is running.` S-8, `Loading the map's features` S-9, `Export interactive map` S-11, `Nothing was cancelled.` S-12 shows``
- new: ``S-10, `Shown above in the attention strip.`; S-2, the tab's label `Jobs`; S-7, `No map loading or export is running.`; S-8, `Loading the map's features`; S-9, `Export interactive map`; S-11, `Nothing was cancelled.` S-12 shows``

**D-5. Part AF's header is stale since AF4 and AF5 landed, and no fixture line covers AF4** (same file).
- old: ``§9, for PR A, run only on a build with PR A merged, with a blank result log. Its rows are §9's steps 0, 0a, 1, 2, 3 and 3a, and step 6 for PR A's strings. Steps 4 and 5 (Jobs) and PR B's strings join this Part with PR B, as rows AF4 and AF5 before AF6.``
- new: ``§9, for PR A and PR B, with a blank result log. Its rows are §9's steps 0, 0a, 1, 2, 3, 3a, 4 and 5, and step 6 for both PRs' strings. AF0 to AF3a need a build with PR A merged; AF4, AF5 and PR B's strings in AF6 need one with PR B merged.``
- old: `an empty folder that you make outside that folder, for the project; the same terminal.`
- new: ``an empty folder that you make outside that folder, for the project; the same terminal. **Before AF4 and AF5:** fixture `slow-filter-scan.parquet`, made by the same fixture generator, copied to a scratch filename in the same folder; AF5 may use the 100k scratch copy of AF3a.``

**D-6. The cycle reason.** App.tsx reaches `contributions.ts` through `StudioLayout.tsx` (`StudioLayout.tsx` 17-26), not directly.
- `frontends/shell/src/jobs/jobs.ts`:
  - old: `` * not an import because `contributions.ts` imports this module for `JOBS_LABEL` and `App.tsx` imports `contributions.ts`: a value import of `App.tsx` from here would make a cycle``
  - new: `` * not an import because `contributions.ts` imports this module for `JOBS_LABEL` and `App.tsx` reaches `contributions.ts` through `StudioLayout.tsx`: a value import of `App.tsx` from here would make a cycle``
  - old: `` * whose first evaluation reads `JOBS_LABEL` before it exists.``
  - new: `` * in which, when this module loads first, `contributions.ts` reads `JOBS_LABEL` before this module defines it.``
- `frontends/shell/src/jobs/jobs.test.ts`:
  - old: ``(`jobs.ts` cannot import `App.tsx`: `contributions.ts` imports `jobs.ts`)``
  - new: ``(`jobs.ts` takes only a type from `App.tsx`, since `contributions.ts` imports `jobs.ts` and `App.tsx` reaches `contributions.ts` through `StudioLayout.tsx`)``

**D-7. `Condition.seq`'s doc is stale under the new order** (`frontends/shell/src/conditions/conditions.ts`).
- old: `  /** The order of the first raise, for the oldest-first order within an urgency. */`
- new: `  /** The order of the first raise: oldest first within urgency 1 and 2, and within each route of urgency 3 (see `ordered`). */`

No decision is missing, so there is no ADR skeleton.

Files: D:/wt/m5b/frontends/shell/src/App.jobs.test.tsx, D:/wt/m5b/frontends/shell/e2e/jobs.mjs, D:/wt/m5b/frontends/shell/e2e/README.md, D:/wt/m5b/KNOWN-LIMITATIONS.md, D:/wt/m5b/frontends/shell/MANUAL-WALKTHROUGH.md, D:/wt/m5b/frontends/shell/src/jobs/jobs.ts, D:/wt/m5b/frontends/shell/src/jobs/jobs.test.ts, D:/wt/m5b/frontends/shell/src/conditions/conditions.ts, D:/wt/read-1128a/governance/forms/frontends/SHELL-MIGRATION-MILESTONE-5-PREREGISTRATION.md
