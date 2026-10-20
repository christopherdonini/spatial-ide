Reviewed: PR #233 at 2fa7c8d09df2e8f21370c1bf68b23213a25615a0 (base 564aadae; gate 3, reviewer, scoped to round 2)
Branch and commit: cut/shell-migration-milestone-3-pr-a @ 2fa7c8d09df2e8f21370c1bf68b23213a25615a0
Verdict: PASS WITH NOTES

Round 2 resolves every Correctness and Evidence finding from gate 2. Nothing blocks. Three Documentation findings must be fixed before the merge, with no re-gate: the two sentences gate 2 held for these words, and one stale test count in the PR body. Line numbers are at 2fa7c8d0.

## Correctness

No finding.

- **The fix.** CommandBar.tsx:6 imports `flushSync`, and CommandBar.tsx:110 runs the entry inside it. Round 1's clear in StudioLayout.tsx `apply` is gone (:168-178).
  - `leaveBar` (:204-208) now reads the page after the commit. A hidden splitter or a field in a closed region matches `closest("[hidden]")`, so the focus goes to the map. A field in a region that was closed and opened again is visible, so the focus goes back to it.
- **Callers.** `applyEntry` is reached only from event handlers: the Enter path at :126 and :128, and the option's onClick at :181. It is never called during render or in an effect.
  - Inside `flushSync`, `run` is `runAction` (StudioLayout.tsx:306). Its asynchronous arms (open, reveal) only start work there.
  - There is no Suspense or lazy anywhere in the shell's src.
- **Recorded mutations, made again in my worktree:**
  - Dropping `flushSync` fails RC10 case b (`AssertionError: the field's region is closed: the map region, not the field: expected <input type="text" …(3)></input> to be <main id="region-map" …(3)>…(1)</main> // Object.is equality`) and case c (`AssertionError: the splitter is hidden with its region: the map region, not the splitter: expected <div id="splitter-inspector" …(10)></div> to be <main id="region-map" …(3)>…(1)</main> // Object.is equality`). 2 failed, 11 passed.
  - Putting back round 1's two lines, byte-copied from 621cd1f3 StudioLayout.tsx:175-176, fails case d (`AssertionError: the field is showing again: back to the field: expected <main id="region-map" …(3)>…(1)</main> to be <input type="text" …(3)></input> // Object.is equality`). 1 failed, 12 passed.
  - Each passes after the revert (13 of 13), with the porcelain empty.
- **My gate 2 probes, again, plus two new ones.** All 6 pass:
  - field: Filter input, Ctrl+K, `/inspector` Enter, focus on the map;
  - splitter: focus on the map, the active element not hidden;
  - splitter then Escape: focus on the map;
  - reopen (Ctrl+I twice, then Escape): back on the field;
  - new, a mouse click on the option: focus on the map;
  - new, the Layers splitter (visible) held while `/inspector` runs: back on the Layers splitter.
- **React warnings.** None. The scoped vitest output has no stderr block and no "Warning". A `console.error` spy counted 0 calls in the field, splitter and click probes.
- **Comments.** The comment at CommandBar.tsx:109 is true against those probes. The mutation comments for cases b, c and d (App.command.test.tsx:337-339, :351-353, :365-367) match the failures I observed.

## Evidence

No finding.

- **The round 2 e2e record matches its artifacts** (my script: 40 checks OK, rc=0; a negative control with one altered digit, rc=1):
  - the runs block equals summary.txt;
  - command-bar, layout and regression have no FAIL line;
  - each of the eight mutation sections' FAIL lines is byte-equal to its suite log;
  - no suite log contains `unknown-attempt`.
- **The hold.** The series ran in one Bash call of the required shape. Its background output carries `MACHINE_HOLD` on line 1 and `MACHINE_RELEASED` on line 16, around the series' label line and end line, and those two lines are byte-equal to the record's lines 8-9.
- **The eight entries of mm3a-r2-mut.mjs**, checked against my worktree at the head:
  - each names its file on its header line;
  - each from-text and to-text appears once in its own header entry, and each from-text once in the whole header;
  - each anchor is found once in its file;
  - each run's mut.diff touches only that file, with that text.
- **E-SEARCH-c** fails E-SEARCH on the `elementFromPoint` line, as predicted, so the assertion from gate 2's Evidence note now has an observed failing mutation. The header's mechanism matches styles.css: `.top-bar` has `overflow: hidden` (:63), and `.command-list` is `position: fixed` (:1203).
- **Amendment 7's references hold:**
  - the round 2 record at 4e413112 and on main both hash to de22c15f…91db;
  - the round 1 record at afea0ff2 hashes to 2773fdc5…5228;
  - 4e413112 and afea0ff2 are both ancestors of origin/main.

## Documentation (must be fixed before the merge; no re-gate)

None of these three sentences is the human's wording. The worker applies the words, and the PR body lists them.

**D1. e2e/command-bar.mjs:12, the MUTATIONS sentence.**
- **The defect.** It says the custodian ran each mutation at 7e4ea32a, with each anchor found once "at the head that adds this file". E-SEARCH-b and E-SEARCH-c were never run at 7e4ea32a, and E-BARFOCUS's anchor changed in round 1. All eight were run at 2fa7c8d0.
- **Old text.** The whole of line 12, found once (my script).
- **Words:**

`// MUTATIONS (section 4: every mutation is observed). Written down by the worker. Each is a replacement of one exact text, found exactly once at 2fa7c8d09df2e8f21370c1bf68b23213a25615a0, and each is to be reverted after it is observed. The custodian ran all eight alone at that head, and each failed the step its entry names (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md):`

- **Clause check:**
  - "Written down by the worker": E-SEARCH-c by round 2's worker (the round 2 report, its A2 E1 item), and the other seven in earlier rounds.
  - "found exactly once at 2fa7c8d0…": my check 3 found all eight anchors once in their files at the head. The series' mut script also exits 3 unless the anchor is found once, and every mut line in summary.txt shows the mutation applied.
  - "to be reverted after it is observed": every mut line reads `reverted-clean-at=2fa7c8d0`.
  - "ran all eight alone at that head": the label line reads `head 2fa7c8d09df2…`, and there are eight mut lines. The series script checks the checkout is clean before each run, so only one mutation is applied at a time.
  - "each failed the step its entry names": all eight are rc=1. Each entry's named step (E-CTRLK; E-SEARCH for E-SEARCH, -b and -c; E-HELP; E-BARFOCUS; E-REVEAL; E-SLASH) is among its run's FAIL lines.
  - The words do not claim that no other step failed. E-BARFOCUS also fails E-CTRLK, which its entry says. E-REVEAL also fails E-SLASH, which its entry does not say.
  - The cited record is on main (4e413112) and on the branch after the merge. Line 12 already cites a record that exists only on main, so this is the same pattern.

**D2. e2e/README.md:817, the last sentence.**
- **The defect.** It is the same as D1. "Each step's mutation" is also wrong: E-SEARCH has three mutations.
- **Old text** (found once, at the end of line 817): `Each step's mutation is in the file's header, with the exact text it replaces; the custodian ran each alone at 7e4ea32a, recorded in state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md.`
- **Words:**

`Each mutation is in the file's header, with the exact text it replaces and the step it fails; the custodian ran all eight alone at 2fa7c8d0, and each failed that step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-round-2-e2e-custodian-runs.md).`

- **Clause check:**
  - "the exact text it replaces and the step it fails": the header has 8 entries. Each holds its from-text, and each names at least one step with "step E-… fails" (my script).
  - The rest is as D1.

**D3. The PR body's Suites bullet is stale.**
- **Old text:** `` `npm run verify`: 1,368 tests pass. ``
- **Words:** `` `npm run verify` at 2fa7c8d0: 1,371 tests pass (the round 2 report). ``
- **Clause check:**
  - The round 2 report's command line gives 98 test files and 1,371 tests, rc=0.
  - My full vitest run at the head counted 1,371 tests in 98 files. 7 of them failed, but only in the notice tests, because my worktree had the bootstrap NOTICE and no dist-metafile.json; that is an environment effect and not a finding.
  - CI's "typecheck · build · vitest · cargo test" passed at 2fa7c8d0 (runs 39319793569 and 39319801117).

**Not a finding.** E-SEARCH-c's "Expected, a prediction until the custodian observes it" (command-bar.mjs:20) stays true: the observed line equals the prediction.

**A correction to my gate 2 report.** It said E-REVEAL also fails E-SLASH "as the header predicts". The header's E-REVEAL entry (command-bar.mjs:25-26) does not predict an E-SLASH failure.

## Gate 2 findings: resolved?

Architect (551):
- **C1:** resolved. RC10 case c is in place, and its mutation fails by name.
- **C2:** resolved. RC10 case d is in place, and its mutation fails by name.
- **E1:** resolved, by E-SEARCH-c, observed as predicted.
- **D1 and D3:** take this gate's words (D1 and D2 above).
- **D2:** landed byte for byte (by script). command-bar.mjs:18 ends with the architect's words.
- **D4:** Amendment 7 item 1. It is true against commandDraft.ts:107-110.
- **D5:** Amendment 7 item 2. The round 0 report is on main, with Differences item 1 at :114. The rev afea0ff2 is on main, and the round 1 record there hashes to Amendment 6's sha256.
- **Note for PR B:** Amendment 7 item 5.

Reviewer (552):
- **C1:** resolved, both (a) and (b).
- **Evidence note:** resolved, by E-SEARCH-c.
- **D1 and D3:** take this gate's words.
- **D2:** superseded by the architect's D2, which landed.
- **D4:** resolved. The README clause landed byte for byte, and the old clause is found 0 times. The form's reading is Amendment 7 item 1.
- **D5:** resolved:
  - "Amendments 1 to 7 (5 to 7 on main)";
  - the §7 bullet equals my count;
  - the Tab line is updated;
  - the words-applied bullet is present.
  The stale test count is new, and is D3 above.

## Commands and exit codes

Each command ran in the foreground, with its output redirected to a file in my scratch folder.

**Setup and reading:**
- `git fetch origin`: 0. mm3a HEAD = 2fa7c8d0, and its porcelain is empty.
- `gh pr view 233`: 0. `gh pr view 233 --json`: 0. The head is 2fa7c8d0, and the PR is a draft.
- `git diff --stat 621cd1f3..2fa7c8d0`: 0. `git diff 621cd1f3..2fa7c8d0`: 0. 5 files, +40 and −8.

**Gate worktree:**
- `git worktree add --detach C:/dev/wt/gate233c 2fa7c8d0`: 0.
- Viewer `npm ci`: 0. Shell `npm ci`: 0. `node scripts/buildViewerFirst.mjs`: 0. `npm run generate:notice`: 0 (the bootstrap NOTICE).
- `npx vitest run src/command src/layout src/App.command.test.tsx`: 0, 8 files and 85 tests. The verbose run: 0, with no stderr and no warning.

**Mutations** (scope: App.command.test.tsx):
- Drop `flushSync`: apply 0, run 1, revert 0, reverted run 0.
- Put back round 1's lines: apply 0, run 1, revert 0, reverted run 0.

**Probes** (a temporary test file, deleted afterwards; porcelain empty):
- First run: 1. My click probe used the exact word, which lists no option. I changed the draft to `/insp`.
- Second run: 0, all 6 probes pass.

**Check 3:**
- Locating the hold lines in the transcript: 0.
- Reading the series command and its background output: 0.
- My record and entries script: first 2, then 1, both from bugs in my own script (the import ran mut.mjs's command line, and the shell collapsed a backslash). After the fixes: 0, 40 OK.
- Negative control: 1.
- `git show 4e413112:… | sha256sum` (round 2 record): 0. `git show afea0ff2:… | sha256sum` (round 1 record): 0.
- `git merge-base --is-ancestor` for 4e413112 and for afea0ff2: 0 each.

**Check 4** (in the head worktree):
- `npx tsc --noEmit`: 0.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: 0, 483 pass, 46 s.
- `verify.mjs`: 0. `verify-cites.mjs`: 0. `verify-quotes.mjs`: 0. `verify-test-claims.mjs`: 0. These are the tools at 2fa7c8d0.
- `gh pr checks 233`: 0, 8 of 8 pass.
- `gh run view` for each of the six runs: 0. Every run's headSha is 2fa7c8d0.
- Full `npx vitest run`, inside one shared hold (granted, then released): 1. 1,371 tests; the 7 failures are the notice tests' environment effect described under D3.

**Check 5:**
- `git merge-base`: 564aadae. No merge commits on the branch.
- `git diff --numstat 564aadae...HEAD` with §7's excludes: 0.
  - Total 1,624.
  - A-P is 582 of 902. StudioLayout.tsx is 85 of 90, and CommandBar.tsx 195 of 300.
  - A-T is 685 of 1,080. App.command.test.tsx is 466 of 500.
  - A-E is 357 of 460. command-bar.mjs is 357 of 380.
  - README.md +14 of 40.
  - No overrun.

**Check 6:**
- The words script: 0. Both old texts are found once, and all 8 header entries name a step.
- The script checking gate 2's words: 0.
- `git cat-file` on the round 0 report on main: 0.
- `git merge-tree origin/main 2fa7c8d0`: 0. It merges clean.

**Teardown:**
- `git worktree remove --force C:/dev/wt/gate233c`: 0. `--force` was needed because of the ignored node_modules; the porcelain was empty before.
- mm3a is still at 2fa7c8d0, with an empty porcelain.

**Holds.** Only the full vitest run was held. Everything else ran under three minutes: the longest was `node --test` at 46 s.

The app was not launched. I made no commit, no push and no PR action. I wrote only in my scratch folder and in the temporary worktree, which is removed.
