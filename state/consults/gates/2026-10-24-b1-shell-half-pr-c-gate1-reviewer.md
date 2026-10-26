Reviewed: PR #253 at ec95eacb69766759ec454f2f5aae9688b49458b1 (base e5e6e03a), gate 1, reviewer (cut/b1-shell-half-pr-c @ ec95eacb69766759ec454f2f5aae9688b49458b1)
Verdict: FAIL

The gate fails on two findings: C1 (Correctness) and E1 (Evidence). Everything else checks out. All 19 recorded mutations fail their named tests at the head, nothing goes over a §7 ceiling, there is no lock diff, the head's one-line change is confirmed, and verify, the governance suite and CI are green.

## Correctness

**C1. The Table tells the operator "The file changed" for every session end, including coverage-lost, where the file has not been shown to change.**
- **Where:**
  - `frontends/shell/src/table/tableSource.ts:72-73`: the `ended` line.
  - `frontends/shell/src/table/tableSource.ts:243-246`: `isSessionEndedTerminal` matches `engine.source_coverage_lost` as well as `engine.source_changed` (`frontends/shell/src/streaming/liveTicketSet.ts:58-63`).
  - `frontends/shell/src/table/TableTab.tsx:69-71` and `frontends/shell/src/App.tsx:2479`: the prop `sessionEnded={sessionEnded !== null}` is true for both reasons (`App.tsx:740`).
- **What is wrong:**
  - The app's own coverage-lost guidance says the opposite: "this is not a statement that the file changed" (`frontends/shell/src/admission/formatRefusal.ts:72-80`).
  - The two lines would sit side by side, so the operator reads a contradiction.
  - Coverage-lost is reached in ordinary use: the OS watch overflows or stops reporting. No dev switch is needed.
  - §2.4 (b) gives the owner line to `engine.source_changed` only.
  - The line states a cause the Table does not know. That breaks §8 items 11 and 14, §1's rule that the shell's lines state only the shell's consequences, and round 5, item 1 ("a false status string does not sit on main").
- **How it was shown:** a throwaway probe test at the head fed `REAL_SOURCE_COVERAGE_LOST_TERMINAL_DETAIL` to the table's sink. `onSessionEnded` was called with it, and `tableLine` returned `[P6 placeholder] The file changed, so the table was cleared; open the file again to load it.` The probe passed and was then removed.
- PC-R2 (`TableTab.test.tsx:161-163`) asserts this same line for a generic `sessionEnded: true`.
- **Fix (a code change):**
  - Option 1: carry the end's code into the Table, for example `sessionEndedCode` from App's `FormattedRefusal.code`, or the terminal's code. Keep the current line for `engine.source_changed`, and give every other end a line that states only the Table's consequence.
  - Option 2: make the single line state only the consequence.
  - Either way, add a test that drives a coverage-lost terminal and a coverage-lost `sessionEnded`.
- The new words are a P6 placeholder, for sight at AC8. Because the fix changes what the code does, the wording-block rule does not apply, and I give no replacement words.

## Evidence

**E1. PC-U4's PublishPanel stand-in hands App a run whose `ended` resolves to an outcome that is not a real one, typed by the mock's own type (the seam rule, round 4).**
- **Where:**
  - `frontends/shell/src/App.table.test.tsx:21` types the capture as `ended: Promise<unknown>`, not `ExportRunReport`.
  - `frontends/shell/src/App.table.test.tsx:241` resolves it with `{ phase: "execute", outcome: { kind: "cancelled" } }`.
- **What is wrong:** the real shape is `ExportRunEnd`, whose execute outcome is keyed by `status` (`frontends/shell/src/publish/PublishPanel.tsx:31`, `frontends/shell/src/publish/types.ts:68-87`). No `ExecuteOutcome` has `kind`. App passes the value to `lateCancelOutcome`, which reads `outcome.status` (`frontends/shell/src/feature/OpenDuringExportAsk.tsx:30-34`).
- **What still holds:** with `cancelChosen` false that function returns before it reads the outcome. So PC-U4's asserted path, and its mutation result below, are not affected. The defect is in the fixture only.
- **Fix:**
  - Type the capture with the real type: `import type { ExportRunReport } from "./publish/PublishPanel"`, and `exportRunning: null as null | ((run: ExportRunReport) => void)`.
  - Type the stand-in's props from `PublishPanel`'s real props.
  - Resolve `ended` with a real `ExportRunEnd`, for example `{ phase: "execute", outcome: { status: "refused", message: "x" } }`.

## Documentation (each must be fixed before the merge; none is the human's wording, so the worker applies these words with no re-gate and the PR body lists them)

**D1. PR body, "The change":** "in four commits that each build:" is followed by five commits.
- Replace with: `**The change:** the Table tab in the Activity region, in five commits that each build:`
- Clause check: `git log origin/main..HEAD` lists 5 commits. CI's Product CI passed at bc315fb9 and at ec95eacb. "Each build" for the first three is the worker's report.

**D2. PR body, Evidence, the §7 bullet:** "56 changed files under `frontends/shell/`, plus KNOWN-LIMITATIONS" miscounts. 58 files change under `frontends/shell/`, and §7 counts 56 of them.
- Replace with: `§7, by its command over e5e6e03a: 56 files, 2,513 lines of the 4,248 declared; no file passes its ceiling. With the three records outside the count (KNOWN-LIMITATIONS.md, frontends/shell/MANUAL-WALKTHROUGH.md, frontends/shell/e2e/README.md) the PR changes 59 files. layout/actionRegistry.ts is on the list and unedited (Amendment 8 item 2).`
- Clause check: the numstat gives 56 files and 2,513 lines. `git diff --stat` gives 59 files. The list comparison by script shows actionRegistry is the only listed file not changed.

**D3. PR body, E2E, the first bullet:** "At bc315fb9 every existing suite passed" is untrue for `pan-anchor.mjs` (14 and then 15 of 16 at bc315fb9) and for the source-changed post route (rc 3).
- Replace with: `- At bc315fb9 every existing suite passed, on its first run or a later one, except pan-anchor.mjs and the source-changed post route: e2e:refusal-contract-baseline failed its first run and its re-run in the head series, then passed 5 of 5 in the diagnosis and once in the re-run; e2e:layout and e2e:selection each failed once at full load and passed on their re-run; e2e:recording failed twice under the default shim, a harness cause, and passed under the waiting shim. pan-anchor.mjs passed 14 and then 15 of 16 at bc315fb9, and 16 of 16 twice at ec95eacb, whose product code is bc315fb9's (git diff bc315fb9 ec95eacb is one line of e2e/table.mjs). Amendment 9 item 3 reads these as not I3, for the gates to check. The source-changed post route's rc 3 matches the base series.`
- Clause check: the head-series report (two refusal failures at 100% load). The diagnosis (head 5 of 5, base 4 of 4). The re-run report's table and findings 2, 3 and 5. The follow-up's rows. My check 6.

**D4. Amendment 9, the custodian's reading (on main, append-only), so this needs an appended correction row:**
- Item 3's "None failed again at the head when re-run" is false for two suites:
  - the refusal suite failed its immediate re-run in the head series;
  - `pan-anchor.mjs` failed its immediate re-run in the re-run series.
- Item 2's "within the suite's settle window" is wrong too. The poll is bounded by its own 10,000 ms. The file calls `NO_FURTHER_QUERY_MS` the settle window (`frontends/shell/e2e/table.mjs:57`, `:350-354`).
- The substance of item 3 holds under THE MACHINE rule: every timing-sensitive failure was re-run and passed in every later run at the head, and none is tied to PR C's diff.
- Suggested row, two sentences, with no pin to a commit off main: `Amendment 9 item 3's "None failed again at the head when re-run" is wrong for two suites: e2e:refusal-contract-baseline failed its immediate re-run in the head series and pan-anchor.mjs its immediate re-run in the re-run series, each under load, and each passed every later run at the head (the diagnosis's 5 of 5 and the re-run's one run; the follow-up's 16 of 16 twice). Item 2's poll waits within its own 10,000 ms bound in stepSlowCancel, not "within the suite's settle window", which in e2e/table.mjs is NO_FURTHER_QUERY_MS.`
- Clause check: against the four reports named in Amendment 9 item 1, and `table.mjs:57` and `:353` at the head.

**D5. `frontends/shell/src/canvas/WorkingCanvas.tsx:179`:** "its product caller is `table/tableScope.ts`, through App" is wrong. `tableScope.ts` never calls the method. The caller is `TableTab.tsx:74`, through App's callback at `App.tsx:1401-1402`.
- Replace with: `* REQUIRED, with no `?`: its product caller is `table/TableTab.tsx`, through App's `residentIdsStreamedUnder` callback, which hands the set to `tableScope.ts`'s `secondScope` (the second scope's "an id in a resident batch streamed under the view's filter"). */`
- Clause check: `git grep residentIdsStreamedUnder` outside tests gives App.tsx:1401-1402 and 2483, TableTab.tsx:42, 74 and 76, and WorkingCanvas.tsx:180 and 1615. `secondScope`'s `residentUnderView` parameter is at `tableScope.ts:40`.

**D6. PC-E2's description claims more than the step asserts.**
- The step checks only `line.includes("2 of 3 selected features")` (`e2e/table.mjs:295-296`). It never reads how the hidden feature is counted.
- The header's reason is also false. PC-E2 issues no first-scope query under `id <> X`: the tab is on the third scope when that filter is applied. So no result under that filter exists, at the limit or otherwise.
- Either add the assertion `line.includes("1 could not be checked against it")` (a test change), or replace the words:
  - `e2e/table.mjs:12-13`, from "The second scope lists the other two" to "not complete);": `The second scope lists the other two, and its line names 2 of 3 selected features (the step does not read how the hidden one is counted; no first-scope query is issued under that filter in this step, so it can only be counted as not established);`
  - `e2e/README.md:831`, the PC-E2 clause "the second scope lists the other two and counts the hidden one as one it could not check": `the second scope lists the other two and its line names 2 of 3 selected features`
- Clause check: `TableTab.tsx:63-67` issues only when `scope === "filtered"`. The PC-E2 step order is at `table.mjs:283-300`. `secondScope`'s `firstForView` is false when the result's filter differs (`tableScope.ts:41-49`).

**D7. A case that needs timing inside one request round trip; it does not block, and is named here so it goes into the source comment.**
- If a start is made while an earlier start's `viewport_query` reply is still pending, it issues its own query before that earlier ticket is known. A hide and show, or a filter change, inside one round trip does this.
- The earlier ticket is cancelled only when its reply arrives (`tableSource.ts:127-139`).
- A throwaway probe showed two `viewportQuery` calls with no `cancel`, then `cancel("sh_a")` once A's reply resolved.
- The sentences concerned are `tableSource.ts:26` (the worker's) and `tableConstants.ts:19` (the architect's, byte-carried; leave it as it is).
- Add after `tableConstants.ts:19`: `// Not covered: a start made while an earlier start's viewport_query reply is still pending (a hide and show, or a filter change, inside one request round trip) issues before that earlier ticket is known; the earlier ticket is cancelled when its reply arrives, so for that round trip the engine can hold two of the table's tickets.`
- Clause check: `start`'s `previous` is null while A is unresolved (`:119`, `:125-126`). The `mine !== this.run` branch cancels A after its reply (`:136-138`). The probe.

## Suggestions / nits
- **S1.** Amendment 8 item 1's search at the head finds one three-parameter `onBatch`: `frontends/shell/src/streaming/viewportStreamManager.test.ts:351`, the `fakeResidentTracker` stand-in for App's wiring. It predates PR C (main:338) and is typed by the real option, so it is not a call or a capture through a mock's own type. It does stand in for App's wiring without the filter. Optionally add `_filter: unknown`.
- **S2.** `table.mjs:355`: once the row exists but stays pending past 10 s, the failure message still says "no class-A cancel row ... appeared". Distinguish the two cases.
- **S3.** On a reopen, `TableTab` (keyed on the new dataset) renders the previous, disposed source's snapshot until App's effect runs `setTableSource` (`App.tsx:1378-1398`), so one painted frame of the old file's rows is possible. Gate on `tableSource` matching `admitted.dataset`, or build the source in a memo.
- **S4.** `selfCancelled` keeps a handle for tickets cancelled before `startStream` runs, since no terminal ever arrives (`tableSource.ts:137`, `:147`). This is bounded by operator actions.
- **S5.** `frontends/shell/package.json` (1 line) has no per-file ceiling in §7's C-P row, unlike A-P. It sits inside C-P's or C-E's total either way, so there is no overrun. Name where it is counted in the closing record.
- **S6.** For sight at AC7: the stopped line says "more may pass the filter" even with no filter, where the count and cancelled lines say "the file may hold more". These are the architect's fixed words.

## §8, item by item
1. Pass. Every changed file is on §2.6 plus Amendments 7 and 8 (script comparison). The only listed file not changed is `actionRegistry.ts`. Nothing under `protocol/`, `kernel/src`, `engine/` or `src-tauri/`.
2. Pass. No dependency or lockfile in the diff.
3. Pass. No SKP command, field or literal. No `skp/` or `protocol/` file is in the diff.
4. Pass. The table reads its rows through `readRow` on its own decode's block with the local index. Members take theirs from `resolveClickPick`. Both rebuilds carry `filter`, confirmed by the PC-U8 and PC-U9 mutations.
5. Pass. Ids are bigint. `cellBytes` counts integers with `toString()`.
6. and 7. Not applicable (PR B).
8. Pass. `columns` is the open's projection set or null (`App.tsx:1389`).
9. Pass. NULL shows its marker (`TableTab.test.tsx:139`).
10. Pass at the shell's count: one handle field (`tableSource.ts:101`); hidden, consumer held and pan each issue nothing (PC-R1, PC-U4). The case inside one round trip is named in D7.
11. Fail on C1, the `ended` line. The count, stopped and selection lines are otherwise within §2.4.
12. Pass. No undo wording, and the style is not touched.
13. Pass. Every new export, prop and method has a product caller (grep). `residentIdsStreamedUnder` is required, with `?.` only on the ref.
14. Fail on C1.
15. Pass. New strings are P6 placeholders or plan §3's labels and "features".
16. Pass. No figure. The ceiling is "declared, not measured".
17. Fail on E1. Otherwise PC-U7 to PC-U12 use the real decode, PC-U6 runs the real tile manager with the real source, and PC-U15's App site has unit proof only, as Amendment 8 item 1 names.
18. Pass. No overrun. Scope additions are in Amendments 7 and 8, before the code. No `verify-mutation` claim. No pin to a branch commit.
19. Pass. The PR body's "and says so" and "the table's own words" match `state/directives/2026-10-24-sort-window-a-both-gates-pr-c-table-ceiling-approved-covering-case-open-a-to-f-kl-item-51-line-probe-branch.md:10` byte for byte. No ledger cite and no bare self-line in the diff.
20. Pass. No PR B or OPEN-16 code.

## What I checked, with evidence (each command in the foreground, output to a file, exit code printed right after)
1. **The diff.** `git diff origin/main...HEAD`, merge base e5e6e03a, origin/main c8a24a95: 59 files, 5 commits, rc 0. I read every file.
   - A script comparison against the 60-path allowed list gives "changed-not-allowed:" empty and "allowed-not-changed:" `actionRegistry.ts` only.
   - A grep for protected paths gives rc 1 (no match).
   - Nothing in §2.1's list is edited: `layoutReducer` is in `layout/layoutState.ts`, which is not in the diff, and the grep for FilterPanel, filterClauses, predicateInput, Publish, e2e-test-surface and bundle-viewer gives rc 1.
2. **The mutations.** In a throwaway worktree, `C:/dev/wt/m4c-g1r`, detached at ec95eacb, under shared holds: `npm ci` (rc 0); viewer `npm ci` plus shell `npm run build` (rc 0, needed for the generated NOTICE).
   - The unmutated baseline of the 15 files is 388 of 388 passing (rc 0).
   - Each mutation was applied alone by script, its named test run with `npx vitest run <file> -t "<ID>:"`, the failure recorded, the file reverted with `git checkout`, and the porcelain printed EMPTY after each.
   - Every one gave vitest rc 1, failing the named test at ec95eacb. The first assertion for each:

| ID | First failing assertion |
|---|---|
| PC-U1 | called with [ 'ds_x', null, null, '1000', … ] |
| PC-U2 | [1n..5n] vs [1n,2n,3n] |
| PC-U3 | Array(3) vs {cut…} |
| PC-U4 | length 1 but got 2 |
| PC-U5 | 10001 ≤ 22 |
| PC-U6 | length 2 but got 1 |
| PC-U7 | 0 > 0 |
| PC-U8 | null vs {…} |
| PC-U9 | null vs {…} |
| PC-U10 | transitions mismatch |
| PC-U11 | null vs {…} |
| PC-U12 (viewport manager) | null vs {…} |
| PC-U12 (tile manager) | null vs {…} |
| PC-U12 (candidate session) | null vs {…} |
| PC-U13 | 'loading' vs 'stopped' |
| PC-U14 | failed 1 vs 0 |
| PC-U15 | null vs {…} |
| PC-R1 | called 1 times |
| PC-R2 | ['1','north'] vs [] |

   - The two probes for C1 and D7 were throwaway test files, run once each with rc 0 and removed, with the porcelain empty after.
   - `git worktree remove` gave rc 0. `git worktree list` no longer shows it, and the directory is gone.
3. **§7.** The numstat command over `e5e6e03a...HEAD` gave rc 0: 56 files, 2,513 lines.
   - Per group: C-P 970 plus package.json 1, against 1,600 + 58. C-T 934 of 1,700; Amendment 7's added tests 107 of 230; fills 48 of 68 + 6; Amendment 8's 25 of 30 and 10 of 14. C-E: `table.mjs` 418 of 480 and of 540.
   - Closest to their ceilings: `decodeBatch.test.ts` 58 of 60, `highlightLayers.test.ts` 6 of 6, `values.test.ts` 4 of 4, `TableTab.test.tsx` 178 of 200.
   - No overrun, so no class 8.
4. **Lock diff.** `git diff --name-only origin/main...HEAD` (rc 0) holds no lock or Cargo file. The grep gave rc 1.
5. **Amendment 8 item 1's search at the head.**
   - `git grep onBatch\b` over `src` gives 20 files (rc 0). The new ones are App.table.test, the table's TableTab.test, tableSource.test and tableSource.ts, and a doc comment in decodeBatch.ts.
   - Every manager-option call or assertion carries the fourth or fifth argument. `App.lateResult`'s mock types take `filter: unknown`. The only three-parameter `onBatch` is S1.
   - The constructor and session search gives rc 0, with no caller outside the known set.
   - The fill diffs of the 13 Amendment 7 files and the 9 Amendment 8 files hold only the declared forms, plus PC-U15 in `App.test.ts`, plus PC-U12 and two `null` assertions in `candidateArmSession.test.ts`, which are under §7's managers ceiling.
   - Amendment 8 item 3's comment:
     - the one handle field: `tableSource.ts:101`;
     - PC-U1's order assertion: `tableSource.test.ts:73`;
     - the constant's absence: `git grep TABLE_MAX_IN_FLIGHT` hits only the form and the comment at `tableConstants.ts:19`;
     - its "cancels it before it issues another" is subject to D7.
   - One `traceStreamIssued` (`tableSource.ts:163`), and no `recordResidency*` in `table/`.
6. **The head's one change.** `git diff bc315fb9 ec95eacb` gives rc 0 and one line: `table.mjs:352`'s predicate gains `&& found.at(-1).outcome !== "pending"`. Nothing else changed.
7. **`npm run verify`** in `C:/dev/wt/m4c/frontends/shell` at ec95eacb, in a shared hold: rc 0. vitest gave 109 files and 1,443 tests passed. The node suites passed 5 of 5 and 7 of 7. The typecheck step passed. The PR worktree's porcelain was empty afterwards.
8. **Governance**, tools at ec95eacb:
   - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: rc 0, 553 of 553 passed, 0 failed (no guardian-parity rerun was needed).
   - `verify.mjs --offline`: rc 0, PASS.
   - `verify-cites.mjs`: rc 0, PASS (2,333 files).
   - `verify-quotes.mjs`: rc 0, PASS (131 checked, 0 errors).
   - `verify-test-claims.mjs`: rc 0, PASS (656 claims).
9. **PR body** (`gh pr view 253`, rc 0):
   - The commit hashes are correct, but the count is wrong (D1).
   - The §7 figures are right but the file count is wrong (D2).
   - The test counts match my run.
   - The signature `residentIdsStreamedUnder(streamedUnder: (filter: Filter | null) => boolean): ReadonlySet<bigint>` equals `WorkingCanvas.tsx:180`.
   - The four carried code blocks are byte-identical to `tableConstants.ts`, `tableSource.ts` and `KNOWN-LIMITATIONS.md` at bc315fb9 and at ec95eacb (script, rc 0).
   - The E2E bullet is wrong (D3).
10. **CI.** `gh pr checks 253`: rc 0, all 8 pass. `gh run list` at ec95eacb: Product CI (twice), Exposure scan, Ported notices (twice) and DCO all success. bc315fb9 is also all success.

**Amendment 9's readings:**
- Item 2: the fix, the 418 count and the follow-up's 3 of 3 plus the mutation's failure at assertion 3 all match the reports. Only "settle window" is wrong (D4).
- Item 3: its substance is supported, and one sentence is untrue (D4).

**State at the end:**
- `C:/dev/wt/m4c`: HEAD ec95eacb, `git status --porcelain` empty.
- The throwaway is removed and is not in `git worktree list`.
- No process I started is still running. The one `node.exe` still running, PID 30540, started 2026-10-22.
- Every heavy run was in its own shared hold, and every hold was released. No exit code 96 to 99. I made no commit, push or PR action.
