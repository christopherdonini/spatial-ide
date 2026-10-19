*Custodian's filing note (2026-10-19): the worker-high's report of PR #233's correction round 1, in C:/dev/wt/mm3a from 7e4ea32a; the head 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2, pushed. The run 2026-10-19T19:19:42Z to 19:35:22Z by its transcript (Read 6, Bash 49, Write 3, Edit 2); its one SubagentHandback call, at 19:35:21Z. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed.*

---

REPORT: node:shell-migration-milestone-3@g6, correction round 1 of PR #233 (worker, claude-sonnet-5-5 as the harness reports; no override, no context handoff).

HEAD and COMMITS (worktree C:/dev/wt/mm3a, branch cut/shell-migration-milestone-3-pr-a; started at 7e4ea32a, `git fetch origin` rc=0, porcelain empty). Pushed as an ordinary update, rc=0: 7e4ea32a..621cd1f3.
- 31ae009b565a52357567f01a0eda51ca3658a2b9  fix, step 1: A C1, A C2, R C1 (code and tests)
- 635fd355f57c16601a22f7cec710fa43c6c73fb5  test, step 2: the observed mutations of UC2 and RC10 case b, recorded at 31ae009b (comments only)
- 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2  docs, step 3: E-SEARCH-b, A E2, R D1, R D2, A D3, A D4 (HEAD)

FINDINGS (file:line numbers are in the files as of HEAD)
1. A C1. commandDraft.ts: `BarPos` gains `completed: boolean` (doc comment on the interface). `typeDraft` returns `completed: false`. The Tab guard is now `if (key.shiftKey || state.completed || count === 0) return none;`. The index is `state.open && state.active !== null ? state.active : count === 1 ? 0 : null`, so Tab completes an active option of an open list, or else the only candidate whether the list is open or closed. The completion returns `{ draft: completion, open: false, active: null, completed: true }`. The doc comment of `commandBarKey` is updated. CommandBar.tsx needed no change, because `...pos` carries `completed`.
   - UC2 (commandDraft.test.ts): the grid states carry `completed: false`. Every first Tab that intercepts must give `[open, active, completed] = [false, null, true]`. New explicit assertions: the closed-list, one-candidate state (`/lay`, closed, none active) completes to `/layers` with `completed: true` and a second Tab leaves; a closed list with several candidates (`/zoom`) and none active leaves in one Tab. The composing check includes `completed`.
   - E-BARFOCUS needed no step change. Its step starts from an empty bar, which has no candidate, and it passes on reading. Its failure message (`Tab with no list open left the bar's input holding the focus`) is unchanged, so the recorded failing line stays valid. Only the header's anchor text changed (see E-BARFOCUS anchor below).
2. A C2. CommandBar.tsx line 28 now reads `"[P6 placeholder] Choose a command with the arrow keys, then press Enter."`. My script verified this string byte-equal to the one extracted from A's report.
3. R C1. StudioLayout.tsx `apply`: after `if (holdsFocus) mapRef.current?.focus();`, two added lines. A comment says the bar's `leaveBar` runs before the toggle commits. Then `if (heldRef.current !== null && regionRefs[action.region].current?.contains(heldRef.current) === true) heldRef.current = null;`.
   - New test (App.command.test.tsx): "RC10 case b: a command run from the bar that closes the region holding the field the focus came from leaves the focus on the map region". The focus is in `.filter-predicate`, then Ctrl+K, then `/inspector` and Enter (via `runBar`). The Inspector is hidden and the focus is on `#region-map`.
4. E-SEARCH-b (A E1 and R E1). e2e/command-bar.mjs header, a new entry after E-SEARCH (lines 17-18): `in the .command-list, .command-note rule, replace .command-note {\n  position: fixed;` (two lines, found exactly once in styles.css) `with .command-note {\n  position: static;`. Expected, a prediction until the custodian observes it: step E-SEARCH fails, "E-SEARCH: with the list open, document.elementFromPoint at the first option's centre does not return that option". The anchor is multi-line, so the custodian's mutation script must handle a newline. I checked by script that all 7 header anchors now occur exactly once at HEAD. This is not run by me.
5. A E2. App.command.test.tsx, the first line of RC2's recorded-mutation comment, replaced by A's text byte for byte: `// RECORDED MUTATION for "RC2": in StudioLayout.tsx pass CommandBar a copy of runAction whose toggle arm dispatches without apply (replace run={runAction} with run={(id) => { const region = TOGGLE_REGION[id]; if (region !== undefined) { dispatch({ kind: "toggle", region }); return "done"; } return runAction(id); }}), so the bar's path records no row and the buttons' path still does. Expected failure: the row assertion.`
6. Documentation. One script took every replacement from the report files and found each old text exactly once. It stopped with nothing written when it failed (it did twice, on my regexes, before the final run). The script printed the words; they match the reports.
   - R D1 styles.css (comment, now line 1187-1188): `position: fixed` just below the top bar (`--top-bar-h`), because `.top-bar` clips what overflows it. The list is rendered only while open. The note is rendered only while it holds a line, and the line goes when the draft changes, when the bar handles a key, or when the input loses the focus. Neither is a permanent element over the map. Colours are P6 placeholders. */
   - R D1 CommandBar.tsx comment (lines 16-17 became one line, 16): `The list and the one-line note are `position: fixed` below the top bar (whose `overflow: hidden` would clip them). The list is rendered only while open. The note is rendered only while it holds a line, which goes when the draft changes, when the bar handles a key, or when the input loses the focus.`
   - R D2 header, e2e line 6: `and E-SLASH, the bare `/` sent by CDP key injection from the map and in the Filter section's input (Amendment 1 item 9; what that injection does not prove is below).`
   - R D2 header, line 12: `// MUTATIONS (section 4: every mutation is observed). Written down by the worker; the custodian ran each alone at 7e4ea32a0ccef474b8b05ed582271a4baa24101f and each failed by its named step (state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md). Each is a replacement of one exact text, found exactly once` (the rest of the old line stays after it).
   - R D2 README, last sentence of the "session state" paragraph: `Each step's mutation is in the file's header, with the exact text it replaces; the custodian ran each alone at 7e4ea32a, recorded in state/consults/2026-10-19-shell-migration-milestone-3-pr-a-e2e-custodian-runs.md.`
   - A D3 README, the CDP paragraph's last sentence: `Row AB1 of the walkthrough's Part AB is the real-key check for Ctrl+K (H2); no row checks a real `/`.`
   - A D4: the COMMENT form, not the rename. Reason: the architect's gate 1 report, tracked on main at 98b4b39a, names the test ("a letter outside the three"); no other tracked record cites the full name. actionRegistry.test.ts line 49 is now `// Milestone 3: four chords (B, I, J, K); x is a letter no chord holds.` above the unchanged `it`. If the custodian reads that mention as not a citation, the rename is a one-line change.
   - Not edited, as briefed: the form (A D5, A D6, R D3).
   - E-BARFOCUS anchor (mine). The header's anchor for E-BARFOCUS had to follow C1, because `!state.open` no longer exists. It now reads `if (key.shiftKey || state.completed || count === 0) return none;`, with the note "until correction round 1 of PR #233 the guard read `!state.open` in place of `state.completed`". The to-text and the expected failure are unchanged.

TESTS AND RECORDED MUTATIONS (each applied alone at 31ae009b, the named test run, the failure read by name, reverted with the porcelain empty, then recorded in comments in 635fd355)
- UC2 (a) Tab case `open: true` (the form's mutation): vitest rc=1, `AssertionError: Tab closes the list and sets completed: {"draft":"/","open":true,"active":0,"completed":false}: expected [ true, null, true ] to deeply equal [ false, null, true ]`.
   - Difference from the form: it no longer fails on "Tab leaves in at most two", because `completed` keeps the second Tab leaving. It fails on the new assertion that Tab closes the list.
- UC2 (b) delete `state.completed || `: rc=1, `a second Tab leaves: {"draft":"/lay","open":true,"active":null,"completed":false}: expected [ true, 'none' ] to deeply equal [ false, 'none' ]`.
- UC2 (c) `!state.open` back in place of `state.completed`: rc=1, `Tab with the list closed completes the only candidate: expected [ Array(3) ] to deeply equal [ { draft: '/layers', …(3) }, …(2) ]`.
- RC10 case b: drop the `heldRef.current = null` line, rc=1, `the field's region is closed: the map region, not the field: expected <input type="text" …(3)></input> to be <main id="region-map" …(3)>…(1)</main>`.
- After the last revert, the clean vitest run is rc=0 with 83 tests (82 before, plus RC10 case b).

§7 (counting command, base 564aadae against HEAD 621cd1f3, rc=0; total 1,592 lines)
- A-P 582 of 902: commandDraft.ts 128/220; CommandBar.tsx 193/300; actionRegistry.ts 44/60; StudioLayout.tsx 87/90 (the tightest); App.tsx 13/80; AdmissionPanel.tsx 16/20; PublishPanel.tsx 26/30; styles.css 69/100; package.json 1/2; commandConstants.ts 5, no ceiling of its own.
- A-T 655 of 1,080: commandDraft.test.ts 128/450; actionRegistry.test.ts 41/50; commandBoundary.test.ts 50/70; App.command.test.tsx 436/500.
- A-E 355 of 460: command-bar.mjs 355/380.
- e2e/README.md is outside the count, +14 of 40. No overrun, so no class 8.

COMMANDS AND EXIT CODES
- `npx vitest run src/command src/layout src/App.command.test.tsx`: rc=0 (8 files, 83 tests), at 31ae009b, at 635fd355's tree and at HEAD.
- `npx tsc --noEmit`: rc=0, run twice.
- `npm run verify` in frontends/shell, inside one shared hold (granted: cores 0-7; released): the harness printed no exit code for this call. The output file shows every chained script ran to the end with no failure: 98 test files and 1,369 tests passed, citationIntegrity 30 passed and 0 failed, export-elapsed 5 of 5. I read that as rc=0 but did not see it printed.
- `node --test` over the three CI globs: rc=0, 483 pass.
- `verify-cites.mjs`: rc=0. `verify-quotes.mjs`: rc=0. `verify-test-claims.mjs`: rc=0. `verify.mjs`: rc=0. `verify-quotes.mjs --show-cites` over the changed source files and the suite: rc=0 (0 checked).
- The mutation runs: rc=1 each as above, with each revert rc=0.
- `git fetch origin`: rc=0.
- Push (separate call, ordinary, not forced): rc=0.
- Final `git status --porcelain --untracked-files=all` in the worktree: empty. The branch is level with origin.

DIFFERENCES FROM THE REPORTS OR THE BRIEF, AND WHY
- A D4 took the comment form (reason above).
- The custodian's 7e4ea32a e2e run used the old E-BARFOCUS anchor. The README and header sentences "the custodian ran each alone at 7e4ea32a" (R D2, byte for byte) hold for six mutations, but E-BARFOCUS's anchor text changed, so it should be re-run at the new head. E-SEARCH-b has never been run, and the sentence is true of it only once it is run and recorded. Please run both at 621cd1f3 and add the E-SEARCH-b row to the runs record.
- The StudioLayout fix does not handle a held element that is the region's splitter (the old `holdsFocus` test treats the splitter id as in the region). I followed R's wording (a region containing it) and kept the diff to two lines to stay within the 90-line ceiling. I did not add a test for the splitter.
- UC2's form text says the mutation "fails at Tab leaving in at most two". After C1 that no longer holds for mutation (a), as above. The form's UC2 row may need a class 3 reading, which is the custodian's.
- I added mutations (b) and (c) to UC2's record beyond the form's one.
- The E-SEARCH-b entry spells the anchor's newline as a literal `\n`. The first version of my script wrote real newlines, which broke the file's syntax. I caught it from the diff and fixed it in the same commit, and `node --check e2e/command-bar.mjs` rc=0.
- Nothing launched. No scratch path is in a tracked file.
