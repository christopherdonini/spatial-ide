*Custodian's filing note (2026-10-19): the worker-high's report of PR #233's correction round 2, in C:/dev/wt/mm3a from 621cd1f3; the head 2fa7c8d09df2e8f21370c1bf68b23213a25615a0, pushed. The run 2026-10-19T20:19:35Z to 20:30:22Z by its transcript (Read 13, Bash 25, Grep 2, Edit 4, Write 5); its one SubagentHandback call, at 20:30:21Z. Its Write calls are its commit messages and its words script, in its scratch folder. Extracted by script; 0 path:line cite(s) de-rooted; one final newline added if absent; nothing else changed.*

---

REPORT: node:shell-migration-milestone-3@g7, correction round 2 of PR #233. Model: claude-sonnet-5-5 as the harness reports; no override, no context handoff.

HEAD AND COMMITS (worktree C:/dev/wt/mm3a, started at 621cd1f3a0b5f12b8c837a45ebeffa472909fcb2; `git fetch origin` rc=0 and porcelain empty before work). Pushed as an ordinary update, rc=0: 621cd1f3..2fa7c8d0.
- 0e9944eabedcb862b04abf78234a7f19f4031358  fix, step 1: A2 C1, A2 C2, R2 C1 (code, RC10 cases b/c/d)
- c68551a80224db6eae1fd723f27541be24557254  test, step 2: the observed mutations, recorded at 0e9944ea (comments only)
- 2fa7c8d09df2e8f21370c1bf68b23213a25615a0  docs, step 3 (HEAD): A2 E1 (E-SEARCH-c), A2 D2, R2 D4 README

FINDINGS
- A2 C1 / A2 C2 / R2 C1 (one fix). CommandBar.tsx line 6 adds `import { flushSync } from "react-dom";`. In `applyEntry`, line 110 is now `const outcome = flushSync(() => run(id));`, with one comment line above it (line 109): the run commits before `leave` reads the page, so the focus goes back as Escape does. StudioLayout.tsx `apply`: round 1's two lines (the comment and the `heldRef.current` clear) are deleted; the file's `apply` is now byte-identical to 7e4ea32a (`git diff 7e4ea32a` on it empty before my edits applied). `leaveBar` is untouched. Comments made untrue: none outside the deleted pair. The `leaveBar` doc comment ("or it is gone or inside a closed region") is now true on the run path; the only other text that named the removed mechanism was RC10 case b's recorded-mutation comment, rewritten below. Not added beyond A2: the fallback for E1.
- Tests (App.command.test.tsx, `it` lines 340, 354, 368).
  - RC10 case b (kept; mutation comment rewritten for flushSync): "RC10 case b: a command run from the bar that closes the region holding the field the focus came from leaves the focus on the map region".
  - RC10 case c (new): "RC10 case c: a command run from the bar that closes the region whose splitter the focus came from leaves the focus on the map region". Focus `#splitter-inspector` (asserted focused), Ctrl+K, `runBar("/inspector")`, Inspector hidden, focus on `#region-map`.
  - RC10 case d (new): "RC10 case d: a region closed and opened again by chords pressed in the bar gives the focus back to the field it came from on Escape". Focus `.filter-predicate`, Ctrl+K, Ctrl+I in the bar (hidden), Ctrl+I in the bar (shown), Escape: focus on the field.
- Recorded mutations, each applied alone at 0e9944ea, the named test run, the failure read by name, reverted with the porcelain empty; recorded in c68551a8 (OBSERVED AT 0e9944eabedcb862b04abf78234a7f19f4031358):
  - Drop flushSync (`flushSync(() => run(id))` to `run(id)`, CommandBar.tsx): vitest rc=1, 2 failed, 11 passed. Case b: `the field's region is closed: the map region, not the field: expected <input ...> to be <main id="region-map" ...>`. Case c: `the splitter is hidden with its region: the map region, not the splitter: expected <div id="splitter-inspector" ...> to be <main id="region-map" ...>`.
  - Round 1's two lines put back after `if (holdsFocus) mapRef.current?.focus();` in StudioLayout.tsx `apply`: rc=1, 1 failed, 12 passed. Case d: `the field is showing again: back to the field: expected <main id="region-map" ...> to be <input ...>`.
  - Reverts by `git checkout --` of the one file; porcelain empty after each.
- A2 E1. e2e/command-bar.mjs header, lines 19-20, after E-SEARCH-b, as written (the file holds a literal backslash-n; styles.css anchor checked found once by the script):
  `//   E-SEARCH-c frontends/shell/src/styles.css, replace \`.top-bar {\n  grid-area: top;\` (two lines, \`\n\` a newline; found exactly once in that file) with \`.top-bar {\n  transform: translateZ(0);\n  grid-area: top;\``
  `//             (the top bar becomes the list's containing block, and with the rule's own \`overflow: hidden\` it clips the list). Expected, a prediction until the custodian observes it: step E-SEARCH fails, "E-SEARCH: with the list open, document.elementFromPoint at the first option's centre does not return that option".`
  The message is the string copied by the script from the file's `elementFromPoint` throw (single match). Not run by me.
- A2 D2 (e2e/command-bar.mjs line 18), the words as the script printed them, byte for byte from A2: `Predicted: step E-SEARCH fails on its elementFromPoint line. Observed at 621cd1f3: step E-SEARCH fails, "E-SEARCH: the first option's top (18.890625) is above the top bar's bottom (40)", the next assertion (class 2, the form's Amendment 6 item 4); the elementFromPoint line is E-SEARCH-c's.` Its old text, from "Expected, a prediction" through the closing quote and period, was found once. The figures match line 51 of the round 1 e2e record.
- R2 D4, README only (e2e/README.md line 813): `from an empty bar with no list open, Tab and Shift+Tab leave in one press` replaces `Tab and Shift+Tab leave in one press with no list open` (found once). Not done: the form row, the header MUTATIONS sentence, the README session-state sentence, the PR body. The form was not edited.
- The docs script's first attempt wrote bad output (its terminator for the D4 words matched too far, and the heredoc collapsed `\\n` to a real newline). I reverted both files with `git checkout --` before any commit and re-ran from a Write-tool script that validates before writing; the committed result is the second run, and `node --check e2e/command-bar.mjs` rc=0.

§7 (counting command, 564aadae...HEAD at 2fa7c8d0, rc=0; total 1,624)
- A-P 582 of 902: commandDraft.ts 128/220; CommandBar.tsx 195/300; actionRegistry.ts 44/60; StudioLayout.tsx 85/90; App.tsx 13/80; AdmissionPanel.tsx 16/20; PublishPanel.tsx 26/30; styles.css 69/100; package.json 1/2; commandConstants.ts 5 (no ceiling of its own).
- A-T 685 of 1,080: commandDraft.test.ts 128/450; actionRegistry.test.ts 41/50; commandBoundary.test.ts 50/70; App.command.test.tsx 466/500.
- A-E 357 of 460: command-bar.mjs 357/380.
- e2e/README.md is outside the count: +14 of 40. No overrun, no class 8.

COMMANDS AND EXIT CODES (the output of each in a scratch file)
- `git fetch origin`: 0 (twice). Head and porcelain confirmed before work.
- From frontends/shell: `npx vitest run src/command src/layout src/App.command.test.tsx`: 0 at 0e9944ea and at HEAD (8 files, 85 tests; 83 + cases c and d). `npx tsc --noEmit`: 0 at both.
- `npm run verify` in frontends/shell inside one shared hold in the given shape (granted, cores 0-7, released), CARGO_BUILD_JOBS=8 and RUST_TEST_THREADS=8 set: rc=0 (98 test files, 1,371 tests, 76 passed 0 failed, 30 passed 0 failed). No 96-99 code.
- From the worktree root: `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`: 0 (483 pass, 0 fail). `verify-cites.mjs`: 0. `verify-quotes.mjs`: 0. `verify-test-claims.mjs`: 0. `verify.mjs`: 0.
- The mutation runs: rc=1 each; each revert rc=0.
- Push (its own call, ordinary, not forced): rc=0.
- App not launched.

DIFFERENCES FROM THE REPORTS OR THE BRIEF
- Three commits instead of one, to separate the code, the observed-mutation comments (as round 1 did) and the docs.
- I added one comment line above the flushSync line in `applyEntry`; A2 and R2 gave only the code change. It is in CommandBar.tsx's line count (195).
- E-SEARCH-c omits A2's fallback (`z-index: 900;` to `z-index: -1;`), since the brief asked for the entry as the mutation, anchor and expected failure only. It remains in A2 if the transform does not clip.
- Nothing else differs. Hash references: none written. No user-profile path in a tracked file.

FINAL STATE: `git status --porcelain --untracked-files=all` in C:/dev/wt/mm3a is empty; the branch is level with origin at 2fa7c8d09df2e8f21370c1bf68b23213a25615a0.
