Reviewed: PR #253 at 580d389e797381e466e00a4d239926baa9eb462a (gate 1 at ec95eacb), gate 2, reviewer — cut/b1-shell-half-pr-c @ 580d389e797381e466e00a4d239926baa9eb462a
Verdict: PASS WITH NOTES

The fixes for C1 and E1 hold, and nothing is open under Correctness or Evidence. Four Documentation findings, N1 to N4 below, must be fixed before the merge. They need no re-gate.

## Gate 1 findings, both reports

- **C1 (both reports): closed.**
  - `tableSource.ts:73`, PC-R2's expected line (`TableTab.test.tsx:163`) and the AC8 phrase (`MANUAL-WALKTHROUGH.md:1983`) match the architect's C1 words byte for byte (script, rc 0).
  - The delta has no other "file changed" wording for the table: a grep over the PR's added lines (`e5e6e03a...HEAD`) finds none.
  - PC-U16 passes at the head. With ec95eacb's `tableSource.ts` it fails, rc 1: `Expected: "[P6 placeholder] The dataset's session ended, so the table was cleared; open the file again to load it."` `Received: "[P6 placeholder] The file changed, so the table was cleared; open the file again to load it."`
  - My C1 probe at the head passed: the real coverage-lost detail reaches `onSessionEnded`, the phase is `ended`, the count is 0, and the line is the new ended line. On the pre-check route (a coverage-lost `SkpCallError`) `onSessionEnded` is called once. The new line does not depend on the end's reason, so PR C's code needs nothing more for C1.
- **E1 (both reports): closed.**
  - `App.table.test.tsx` now takes the real types: `ExportRunReport`, `PublishPanelHandle`, `Pick<PublishPanelProps, "onExportRunning">` and `ExportRunEnd`. These are exported at `PublishPanel.tsx:31`, `:38`, `:316`, `:339` and `:343`.
  - The run ends with `{ status: "unknown-attempt" }`, which is a real `ExecuteOutcome` (`publish/types.ts:87`).
  - tsc covers `src` (`tsconfig.json:19`) and passes, rc 0.
  - PC-U4's mutation fails by name again.
- **Reviewer D1: closed.** The body reads my words with "five" changed to "six", for the sixth commit 580d389e.
- **Reviewer D2 and D3: closed.** Both are byte-identical in the body (script).
- **Reviewer D4: closed.** Amendment 10 item 5 covers it. See N4 for that item's length.
- **Reviewer D5 and D6: closed.** The architect's D3 and D4 words are in place, as listed under architect D3 and D4 below.
- **Reviewer D7: closed as a disclosure.** The window is named at `tableConstants.ts:19`, `tableSource.ts:27` and `KNOWN-LIMITATIONS.md:430`. Its count is wrong (N1).
- **Architect D1 to D6: closed,** each byte-identical in its target file (script, rc 0):
  - D1 is the whole of `tableConstants.ts:19`.
  - D2 is at `KNOWN-LIMITATIONS.md:430`.
  - D3 is the whole of `WorkingCanvas.tsx:179`. Its clauses hold: the call is at `TableTab.tsx:74`, App's callback at `App.tsx:1401-1402`, and the set is read at `tableScope.ts:47`.
  - D4(a) is at `e2e/table.mjs:12`, now one line. D4(b) is at `e2e/README.md:831`.
  - D5 is at `KNOWN-LIMITATIONS.md:421`. D6 is at `tableConstants.ts:9`.
- **Architect D7: closed.** The body carries my D3 for the same bullet, which includes D7's pan-anchor exception. D7's own words are not in the body (script), so the architect should confirm.
- **Architect D8: closed** by Amendment 10 item 5 and its superseded index.
- **Architect D9: closed.**
  - The AC8 words are byte-identical at `MANUAL-WALKTHROUGH.md:1983`.
  - Both items are in the body's sight list.
  - Amendment 10 item 4 records the statement change as class 1.
- **S1 to S6 and the architect's sight points:** not taken (Amendment 10 item 6). Not re-read.

## New findings

### Correctness
None.

### Evidence
None.

### Documentation (each must be fixed before the merge; none of these is the human's wording, so the worker applies the words with no re-gate and the PR body lists them)

**N1. The round-trip window says "two tickets"; three or more starts inside one window hold three or more.**
- **Where:**
  - `frontends/shell/src/table/tableConstants.ts:19` (the architect's D1)
  - `frontends/shell/src/table/tableSource.ts:27` (the worker's sentence)
  - `KNOWN-LIMITATIONS.md:430` (the architect's D2; a draft)
- **The probe:** at the head I made three starts, with each `viewport_query` left unanswered and a cancel between starts. Before any answer there were 3 `viewportQuery` calls and 0 `cancel` calls. After the answers, `cancel` was called for `sh_1` and `sh_2`, and only `sh_3` was streamed. My own gate 1 D7 also said "two", so the error is partly mine.
- **Why it does not block:** the case needs timing inside one request round trip (§31, `state/directives/2026-10-11-direction-after-status-review.md`, item 2). The kernel's stream pool bounds it: the fifth concurrent pending ticket fails at the lease with `engine.connections_exhausted` (`kernel/src/skp.rs:87-91`).
- **Replacement words:**
  - `tableConstants.ts:19`, the whole line: `// TABLE_MAX_IN_FLIGHT (milestone 4 section 7, 1) is not a constant here: tableSource holds one stream handle and cancels it before it issues another, so no code would read the constant. Not covered: a start made before the previous viewport_query has been answered issues at once, and each earlier ticket is cancelled when its answer arrives, so for that window the kernel holds every table ticket issued in it, each with a stream connection.`
  - `tableSource.ts:27`, the added sentence: `A start made before the previous \`viewport_query\` has been answered issues at once and each earlier ticket is cancelled when its answer arrives, so for that window every ticket issued in it is held (\`tableConstants.ts\`'s comment on \`TABLE_MAX_IN_FLIGHT\`).`
  - `KNOWN-LIMITATIONS.md:430`: replace `so until that answer arrives and its cancel lands the Table holds two tickets, each with a stream connection` with `so until each earlier answer arrives and its cancel lands the Table holds every ticket issued in that window, each with a stream connection`
- **Clause check, at the head:**
  - "holds one stream handle": `tableSource.ts:101`.
  - "cancels it before it issues another": `:125` runs before `:131`.
  - "issues at once": while a query is pending the handle is null (`:119-120`), so only `:126`'s microtask comes before `:131`. The probe showed 3 calls and 0 cancels.
  - "each earlier ticket is cancelled when its answer arrives": `:136-137`. The probe cancelled `sh_1` and `sh_2`.
  - "each with a stream connection": `kernel/src/skp.rs:87-90`.

**N2. The PR body offers bc315fb9's texts for sight, and the delta changed three of them.**
- **Where:** "The carried texts" (the `TABLE_MAX_IN_FLIGHT` block) and the KNOWN-LIMITATIONS 54 to 56 block.
- **Shown by script:** both blocks equal bc315fb9 and differ at 580d389e. The delta changes `tableConstants.ts:19`, `KNOWN-LIMITATIONS.md:421` and `KNOWN-LIMITATIONS.md:430`.
- **Fix:** replace `**The carried texts**, byte-copied from bc315fb9:` with `**The carried texts**, byte-copied from <head>:`, and `KNOWN-LIMITATIONS items 54 to 56, drafts for your sight, byte-copied from bc315fb9:` with `KNOWN-LIMITATIONS items 54 to 56, drafts for your sight, byte-copied from <head>:`. `<head>` is the commit after N1 lands. Re-copy both blocks from it by script.
- **Clause check:** `git diff ec95eacb..580d389e` touches these three lines.

**N3. The PR body's Evidence leaves out PC-U16 and the fix commit's runs.**
- **Where:** the Evidence list. Its mutation bullet names PC-U1 to PC-U15, PC-R1 and PC-R2, all at bc315fb9.
- **Fix:** add after that bullet: `- At 580d389e (gate 1's fixes, the form's Amendment 10): \`npx tsc --noEmit\` and \`npm run verify\` exit 0 (vitest 109 files, 1,444 tests); PC-R2, PC-U4 and the new PC-U16 fail by name under their mutations, and PC-U16 fails with ec95eacb's \`tableSource.ts\`, on the old ended line.`
- **Clause check:** my checks 2 and 4 below.

**N4. Amendment 10 item 5's first bullet, a class 3 correction, has four sentences.**
- **What is wrong:** round 12, item (d) sets a ceiling of three sentences per correction. The fourth sentence ("The reading's conclusion stands…") restates Amendment 9 item 3's claim, which (d) forbids.
- **Fix:** the amendment is on main and append-only, so it cannot be fixed in place, and the record cap allows no new clause or row for this. PR C's closing amendment should cite Amendment 10 item 5 by reference only, and the architect's reduction carries it. The architect rules.

## What I checked (each command in the foreground, output to a scratch file, exit code printed)

1. **The delta.**
   - `git diff --name-only ec95eacb..HEAD`, rc 0: exactly the 10 files Amendment 10 items 1 to 3 name. Item 4 needs no code here.
   - The word sets were compared by a script against the gate 1 report lines that give them: all 11 present at the head and absent at ec95eacb, rc 0.
2. **Mutations** in the throwaway `C:/dev/wt/m4c-g2r`, detached at 580d389e.
   - Setup, each inside a shared hold: `npm ci`, rc 0. The viewer's `npm ci` and build, plus `generate:notice`, rc 0. The first baseline had failed to resolve `NOTICE.txt?raw` until the notice was generated.
   - Baseline of the three files: 13 of 13 pass, rc 0.
   - PC-R2 (drop `this.reset(this.filter);` in `end`): rc 1, `AssertionError: expected [ '1', 'north' ] to deeply equal []`.
   - PC-U4 (`const exportHeld = false;`): rc 1, `to have a length of 1 but got 2`.
   - PC-U16 (`isSessionEndedTerminal` matches only `engine.source_changed`): rc 1, `expected "vi.fn()" to be called with arguments`.
   - PC-U16 unmutated at the head passes, rc 0. With ec95eacb's `tableSource.ts` it fails, rc 1, as quoted under C1.
   - The porcelain was empty after each revert and after the restore.
   - Not a `verify-mutation` run: each mutation was applied and its test run.
3. **§7,** by its command over `e5e6e03a...HEAD`, rc 0: 56 files, 2,527 lines of the 4,248 declared.
   - `table.mjs` 417 of 480
   - `App.table.test.tsx` 276 of 450
   - `WorkingCanvas.tsx` 25 of 40
   - `TableTab.test.tsx` 178 of 200
   - `tableConstants.ts` 31 of 40
   - `tableSource.ts` 289 of 300
   - `tableSource.test.ts` 198 of 320
   - The records: `KNOWN-LIMITATIONS.md` 13 of 70, `MANUAL-WALKTHROUGH.md` 12 of 160, `e2e/README.md` 12 of 60.
   - No overrun, so no class 8.
4. **In `C:/dev/wt/m4c` at 580d389e, one shared hold:** `npx tsc --noEmit`, rc 0. `npm run verify`, rc 0: vitest 109 files, 1,444 tests; node suites 5 of 5 and 7 of 7. The porcelain was empty afterwards.
5. **Probes,** in a throwaway test file in the throwaway worktree, deleted afterwards (porcelain empty): the C1 probe (under C1) and the D7 probe (N1). The run passed, rc 0.
6. **Governance, tools at 580d389e:**
   - `node --test` over the three globs: rc 0, 553 of 553.
   - `verify.mjs --offline`: rc 0, PASS.
   - `verify-cites.mjs`: rc 0, PASS, 2,333 files.
   - `verify-quotes.mjs`: rc 0, PASS, 131 checked.
   - `verify-test-claims.mjs`: rc 0, PASS, 656 claims.
7. **PR body and CI.**
   - `gh pr view 253`, rc 0: head 580d389e, draft. The body is byte-identical to the architect's copy (`cmp`, rc 0).
   - The six commits are listed. My D2 and D3 are byte-identical, and D9's two sight items are present (script).
   - `gh pr checks 253`, rc 0: all 8 pass.
   - `gh run list`, rc 0: at 580d389e, Product CI (two runs), Ported notices (two), Exposure scan and DCO all succeeded. Nothing was pending.

**State at the end:**
- `C:/dev/wt/m4c` is at 580d389e, with an empty porcelain.
- `git worktree remove C:/dev/wt/m4c-g2r` gave rc 0 without `--force`. `git worktree list` no longer shows it, and the directory is gone.
- No vitest or node process I started is still running (process query).
- Every hold was released, and no exit code 96 to 99 came back. I made no commit, push or PR action.
