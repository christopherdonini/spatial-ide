*Custodian's filing note (2026-10-23): the build of `verify-cites-pin-resolution-and-line-zero` by a worker on `cut/verify-cites-pin-resolution-and-line-zero` from the form's commit e408606d. The run 11:51:12Z to 12:07:16Z by its transcript (Read 5, Bash 26, Edit 13); its claims were read against that transcript's calls before filing: two commits and two pushes, origin's branch equal to the head, the porcelain empty, no force push, rebase, amend, PR call or `verify-mutation` run; its Edit and Write calls only on the piece's two files and its `vcpin-` scratch files; only those two files changed since the form's commit (60 and 106 lines). Its scripts suite's exit code was not printed, as it says; the gates re-run it. Its two class 2 mutation results go into the form's Amendment 2. Extracted by script from its SubagentHandback call, with any scratch-folder path written as a placeholder, and its one line-0 cite token (the target of the gate report's line-54 cite) written in words, so that main's checker does not gate it and one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 424b534a2dcd31bc0b43ecf0c9f8c568ecf7e01e3ea8cc4176aaedd854f65792.*

---

Built: verify-cites-pin-resolution-and-line-zero at 7a23dbad24d3efc923e5108a9047811a2909aacf (branch cut/verify-cites-pin-resolution-and-line-zero; origin's branch = HEAD, porcelain empty).

Commits (both signed off, each pushed in its own call):
- eb499a8910b8 "feat(plan): verify-cites-pin-resolution-and-line-zero, the change and the tests (form sections 2.1 to 2.3 and 4)"
- 7a23dbad24d3 "test(plan): verify-cites-pin-resolution-and-line-zero, the RECORDED MUTATION comments (form section 4)"

Diff
- scripts/plan/verify-cites.mjs:
  - checkCitation has line-0 reasons for the exact tier and the suffix tier.
  - checkPinned takes a required third parameter, `paths`. It checks the commit once, reads each path at the pin, and returns ok at the first file holding the line. Otherwise it returns the first non-missing failure (directory, line 0, or range). If every path is missing it returns missingFile naming the path as written.
  - runVerifyCites builds the list: the exact set if any, else the suffix set, then the path as written, with no duplicates.
  - The header carries the §2.3 sentences.
  - `checkPinned` stays exported with the same name. No other export was added or changed.
- scripts/plan/verify-cites.test.mjs: T-C3a, T-C3b, T-D4a, T-D4b, T-D4c and T-D4d under the form's names, a `pinnedAfter` helper and `AT0` (builds line-0 cites at run time). The C2 test keeps its name and gets the `late.rs` line-9 fixture. Seven RECORDED MUTATION comments in the second commit.
- Seams, read first: verify-quotes imports buildTrackedIndex, extractCitations, resolveRef, classifyPath, topDirsOf and CODE_EXTS at scripts/plan/verify-quotes.mjs:137, none changed. checkPinned has one product caller, runVerifyCites in the same file.

§7 figures (`git diff --numstat e408606d...HEAD`, rc=0): verify-cites.mjs 37+23 = 60 (limit 60), verify-cites.test.mjs 104+2 = 106 (limit 150), total 166 (limit 210). The two files are the only ones changed.

Tests: verify-cites test file 32 of 32 pass, rc=0 (the last full run is at the head).

Mutations
Each was applied by hand at eb499a8910b8, alone. I ran `node --test scripts/plan/verify-cites.test.mjs`, then reverted with `git checkout`. Porcelain was `[]` after each revert. No verify-mutation tool was used. The assertion message is `AssertionError [ERR_ASSERTION]`, followed by the text shown.

| Mutation | Tests that failed | Assertion message | Matches §4? |
|---|---|---|---|
| M-C3a (both line-0 returns in checkCitation removed) | a_cite_starting_at_line_0_is_reported_at_line_0_in_the_tree | input did not match /^line 0 does not exist in "engine\/src\/pool\.rs" \(lines count from 1\)$/ | yes, only this test |
| M-C3b (checkPinned line-0 condition made false) | a_pinned_cite_starting_at_line_0_is_reported_at_line_0_at_its_pin | `[]` (gated was empty) | yes, only this test |
| M-D4a (pin read at the path as written only) | a_pinned_relative_or_md_fallback_cite_is_read_at_the_file_the_tree_resolves; a_pinned_basename_cite_is_read_at_its_suffix_match; a_pinned_basename_cite_past_its_resolved_files_end_gives_the_pins_reason | gated listed the two tree-reason findings; advisory listed `pool.rs:4` with "line 4 exceeds engine/src/pool.rs (3 lines)"; the reason did not match /exceeds "engine\/src\/pool\.rs" at pinned commit/ | yes (T-D4a, T-D4b, T-D4c) |
| M-D4b (list from the exact set only) | a_pinned_basename_cite_is_read_at_its_suffix_match; a_pinned_basename_cite_past_its_resolved_files_end_gives_the_pins_reason | the same two messages as in the M-D4a row | no: the form says T-D4b only |
| M-D4c (failure kept only from the path as written) | a_pinned_basename_cite_past_its_resolved_files_end_gives_the_pins_reason | did not match /exceeds "engine\/src\/pool\.rs" at pinned commit/ | yes, only this test |
| M-D4d (path as written dropped always) | a_pinned_cite_still_passes_at_the_path_as_written_when_the_tree_resolves_elsewhere; a_pinned_cite_whose_path_is_a_directory_at_that_commit_fails_by_name | gated held "line 4 exceeds renderer/v/scripts/x.mjs at pinned commit … (3 lines)"; the directory reason did not match /"engine\/src" is a directory at pinned commit/ | no: the form says T-D4d only |
| M-D4d2 (supplementary: path as written dropped only when the tree has candidates) | a_pinned_cite_still_passes_at_the_path_as_written_when_the_tree_resolves_elsewhere | none captured | yes, only this test |
| C2 (reason choice made unconditional) | a_pinned_loose_cite_keeps_the_trees_reason_when_the_pin_path_is_not_found | did not match /^line 9 exceeds engine\/src\/late\.rs \(/ | yes, only this test |

Two results differ from the form's predictions. These are class 2 results for the architect:
- M-D4b also fails T-D4c. The exact-set-only list leaves T-D4c's basename cite with the tree's reason instead of the pin's.
- M-D4d, with the path as written dropped always, also fails the unchanged P5 test. A rooted cite with no match then has an empty list. D4d2 is the narrowed variant, and it fails T-D4d only.

The RECORDED MUTATION comments state these as observed.

I1 and I2 (my scratch script, main's checker from 2ffbf957 against the head's file; the trees are detached checkouts of 2ffbf957 and of 7a23dbad)

| Run | Gated | Advisory | Differences |
|---|---|---|---|
| I1 at B (head's checker is B's file, e408606d) | 0 vs 0 | 110 vs 110 | 0, empty |
| I1 at the head, tree 2ffbf957 | 0 vs 0 | 110 vs 110 | 1 |
| I2 at the head, tree 7a23dbad | 0 vs 0 | 108 vs 108 | 1 |

- Wall time was about 6.6 s per checker per run.
- The one change in both I1 and I2 is class C3, the prediction. The cite is at state/consults/gates/2026-10-08-verify-cites-pinned-citations-gate1-reviewer-attempt-2.md line 54, target lines 0 to 2 of `engine/src/pool.rs`. Only its reason changed, from `line 2 exceeds "engine/src/pool.rs" (1014 lines)` to `line 0 does not exist in "engine/src/pool.rs" (lines count from 1)`.
- The D4 classes are empty, as Amendment 1 predicted (E0 found no advisory entry with a pin). No entry was added. No invalidator was met.
- Tree differences in the advisory count: 110 at the 2ffbf957 tree, 108 at the head's tree and at E0's tree. I did not look into why.

Checks at the head (the first six print their rc; the scripts suite does not, see below)

| Check | rc | Last line / summary |
|---|---|---|
| `node --test scripts/plan/verify-cites.test.mjs` | 0 | tests 32, pass 32, fail 0 |
| `node --test scripts/plan/verify-quotes.test.mjs scripts/plan/rotate-decisions-pending.test.mjs` | 0 | tests 78, pass 78, fail 0 |
| `node scripts/plan/verify-cites.mjs` | 0 | `verify:cites PASS — every rooted (in-tree) path:line reference across 2261 file(s) resolves. (108 loose reference(s) advised above.)` |
| `node scripts/plan/verify-quotes.mjs` | 0 | `verify:quotes PASS — 131 checked, 100 verified, 30 baselined, 1 advisory, 0 baseline entry errors, 0 hash-reference errors (2 hash-baselined), 0 hash-baseline entry errors, 843 ruling cites resolved, 0 ruling-cite errors.` |
| `node scripts/plan/verify-test-claims.mjs` | 0 | `verify:test-claims PASS — all 632 claimed test(s) across 193 file(s) exist or are planned, superseded or withdrawn (48 planned, 9 superseded, 17 withdrawn, advisory).` |
| `node scripts/plan/verify.mjs` | 0 | `verify:plan PASS — C:\dev\wt\vcpin\PLAN.yaml agrees with the repository.` |
| scripts suite, under a shared hold (see below) | not printed | tests 549, pass 549, fail 0, cancelled 0, skipped 0 |

- The scripts suite was run with `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs" "scripts/evidence/*.test.mjs"`. The one-call shape ends in `exit $rc`, but the tool did not show the code. fail 0 and cancelled 0 are the evidence. There was no `guardian parity` failure.
- Hold lines (my project only): `MACHINE_HOLD shared project=SpatialIDE cores=0-7 affinity=FF …` and `MACHINE_RELEASED project=SpatialIDE … affinity=FF (cores 0-7)`.

Disclosures
- Both scratch checkouts needed `git -c core.longpaths=true worktree add`. Without it, three state/directives paths failed with "Filename too long" and the first attempt left an incomplete tree. The long-paths trees are complete, and my script found no tracked path missing from disk. `git status` inside them reports those three paths as modified only because of that path-length error. `git worktree remove` failed on the same limit, so I deleted both scratch directories with node's `fs.rmSync`. `git worktree list` no longer shows them, and `.git/worktrees` has no vcpin-t or vcpin-h entry.
- Once, I wrote a test run's output to a file under the user's Temp folder, outside my scratch folder. I read it and deleted it.
- No `verify-mutation` tool was run. No file under `.claude/` was touched. No `verify-quotes.mjs` edit. No new export. No default or optional parameter. No PR action.
- No process I started is still running (every command ran in the foreground).
- Scratch files, all under `<the session scratch folder>/` with names starting `vcpin-`:
  - `vcpin-main-checker.mjs`, `vcpin-i.mjs`
  - `vcpin-i1-atB.txt`, `vcpin-i1-head.txt`, `vcpin-i2-head.txt`
  - `vcpin-mutations.txt`, `vcpin-mutations2.txt`, `vcpin-mutations3.txt`
- The first rows of `vcpin-mutations.txt` for M-D4a and M-D4d are void: my script's anchor did not match, so no mutation was applied. Those two were re-run, and `vcpin-mutations2.txt` is the valid record for them.

Model: Sonnet 5.5 (claude-sonnet-5-5), as the harness reports it. No override. No context handoff received or produced.

Pre-gate self-check
- Cross-module code uses the interface the other side exposes: yes, see the seams above.
- Completion claims point to evidence that exists: yes, the transcript calls and the files named above.
- Every user-facing message describes behaviour implemented at this commit: yes. The line-0 strings and the header sentences match the code.
- Every required test reaches its assertion: yes. Each mutation above fails at an assertion, not at setup.
