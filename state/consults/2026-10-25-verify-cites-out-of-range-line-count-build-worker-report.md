*Custodian's filing note (2026-10-25): the worker's build of `verify-cites-out-of-range-line-count` on its branch, from main f031fa3c (the form's commit), final head 68dfa3b7; draft PR #257. The custodian's check: the numstat from f031fa3c is 66 lines in the two files the Scope line names, and the worktree is clean. Its writes were inside the worktree's scripts/plan/ and its own scratch files (3 by the write tools); no rebase, reset, PR action or force push. The run 16:53:42Z to 17:03:23Z by its transcript (Read 4, Bash 23, Write 3). Extracted by script from its SubagentHandback call, with one final newline added; nothing else is changed. Its sha256, from line 5 to the end, is 81222cfeac2b0ca14162baaadaf71b33d5f6e8429be399660c7c8e7bff68bfc8.*

---

Built: verify-cites-out-of-range-line-count at 68dfa3b74d82e97da99852bc9c93be53c3d5df61 (branch cut/verify-cites-out-of-range-line-count, pushed; origin equals HEAD; porcelain empty).

Commits (both `-s`; the message files had `@` only in the first trailer line):
- 4ec98d9f9e90e3f437073507fd0e1ad6b60c9629: the code and T1-T4.
- 68dfa3b74d82e97da99852bc9c93be53c3d5df61: the four RECORDED MUTATION comments, each naming 4ec98d9f9e90e3f437073507fd0e1ad6b60c9629.

Files:
- scripts/plan/verify-cites.mjs (+21/-14):
  - New helper `countOf` returns `{pieces, lines}`. `lines` is `pieces` minus 1 when the text is empty or ends in a newline.
  - The bound uses `pieces`. The exact, suffix and pinned reasons print `lines`.
  - W1, W2 and W3 are copied from note 1. W1 and W2 are wrapped at spaces to fit `//` comment lines; their words are unchanged.
- scripts/plan/verify-cites.test.mjs (+31): T1-T4 under the names the form gives, plus the 4 mutation comments. No existing test is changed.
- Line total: `git diff --numstat f031fa3c...HEAD` gives 21/14 and 31/0, only those two files, 66 in all (budget 100), rc=0.

Tests:
- T1-T4 fail at the base (the base `verify-cites.mjs` against the new tests: `fail 4`, `pass 32`) and pass at the head (`verify-cites.test.mjs`: 36/36).
- Suite inside one shared hold, rc=0: `node --test` over plan, hooks and evidence gives tests 561, pass 561, fail 0.
- `verify.mjs --offline`, `verify-cites.mjs`, `verify-quotes.mjs` and `verify-test-claims.mjs`, in the worktree: rc=0 on each.

Mutations, each applied alone to 4ec98d9f9e90, test run, reverted with `git checkout -- <file>`, porcelain empty after each:
- M1: the exact figure taken from `pieces`. Fails `an_exact_out_of_range_reason_counts_the_lines_of_a_newline_ended_file` and `an_out_of_range_reason_for_an_empty_file_counts_0_lines` (fail 2, as the form says).
- M2: the suffix figure taken from `pieces`. Fails `a_suffix_out_of_range_reason_counts_the_lines_of_a_newline_ended_file` alone.
- M3: checkPinned's figure taken from `pieces`. Fails `a_pinned_out_of_range_reason_counts_the_lines_of_a_newline_ended_file` alone.
- M4: the helper's empty-file term dropped. Fails `an_out_of_range_reason_for_an_empty_file_counts_0_lines` alone; actual `line 2 exceeds "engine/src/pool.rs" (1 lines)`, expected `/\(0 lines\)$/`.

Settlement run:
- Base = `verify-cites.mjs` from f031fa3c. Head = `verify-cites.mjs` at HEAD. Each was copied to scratch and run with `runVerifyCites({repoRoot:'C:/dev/spatial-ide'})`.
- The main checkout's `git status --porcelain --untracked-files=no` was empty before and after.
- Main's checkout was at ff406cea09151da24eb95b085a7cc890abae7369 (one docs commit after the base). I read its tree as it stood, and f031fa3c..HEAD left `verify-cites.mjs` unchanged.
- Result: scanned 2391 for both. Gated 0 and 0. Advisory 97 and 97.
- 82 differences, all count-only: same key and tier, the reason's count one lower at the head. Nothing else: no base-only key, no head-only key, no tier change, no other reason difference.
- The form predicted 81 at 5315a6a5. Main's tree has since moved, and the form says the figure is whatever that tree gives, with the same classes.

Pre-gate self-check:
- No cross-module seam. The helper is unexported with product callers only: `verify-cites.mjs:241` (`countOf`), `:244` (`lineCount`), `:261`/`:270`/`:274` (the checkCitation callers) and `:291` (checkPinned).
- Each completion claim above points to a recorded run.
- The message strings are unchanged except the printed count.
- Each test reaches its assertion: the mutation runs show the `assert.match` failures.

Model: Sonnet 5.5 (claude-sonnet-5-5) as the harness reports it, no override, no context handoff.

Off-scope noticed, not done: none.

Process: every process I started has ended. One other `node.exe` is running that I did not start.
