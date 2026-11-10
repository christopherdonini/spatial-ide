*Custodian's filing note (2026-11-01): `verify-cites-reversed-range`, built by a worker on `cut/verify-cites-reversed-range` from main 180b1e9f, head 5efa8bd1; 64 of the Scope's 100 lines. The custodian's check by git: origin's branch is at 5efa8bd1, 3 commits past main. By its transcript: 3 commits, one push to the branch, no reset, rebase, merge, amend, force, PR action or claude call; Bash 16, Read 5, Edit 8, Write 7, TaskStop 1; run 00:47:13Z to 01:05:09Z. Its one TaskStop call was refused by the harness (no such tool); the background run it aimed at finished by itself. Its read-only fetch of origin main, against the brief, is disclosed in its report. Its base-copy and clone folders are in the scratch folder. Draft PR #272 opened by the custodian. Extracted by script from its SubagentHandback call, with one final newline added; the session's scratch folder, named 0 time(s) by its full path, is written `<scratch>/`; nothing else is changed. Its sha256 as handed back, from line 5 to the end, is df15db15ace0d944dede40ae4e3c71f7b7f4490699b6f2c5d83ab27a36e2092c; as filed, df15db15ace0d944dede40ae4e3c71f7b7f4490699b6f2c5d83ab27a36e2092c.*

---

Built: verify-cites-reversed-range at 5efa8bd178a8ad9b8e2114e8d61f8b64263cbef5 (pushed, origin branch = HEAD, porcelain empty).

Disclosure (a rule I broke): my final check chain ran `git fetch -q origin main`, a network fetch other than the push. It is read-only and only refreshed origin/main for the numstat. No other stop rule was met.

Commits (all `-s`, no `@` outside the first trailer line):
1. 702d172b4a38e232506800040e874889fa328026 "fix: verify-cites-reversed-range: verify-cites fails a range whose end is below its start, by name"
2. 843e206b119c24af4163b40389135715d2b40276 "test: verify-cites-reversed-range: T1 to T4 for a range whose end is below its start"
3. 5efa8bd178a8ad9b8e2114e8d61f8b64263cbef5 "docs: verify-cites-reversed-range: the four RECORDED MUTATION comments, observed at 843e206b119c"

Product change in scripts/plan/verify-cites.mjs. The cited lines at B had not moved, so I found them by text:
- Unexported helper `backwardReason(cite)`: null unless start is above end and end is not 0; otherwise the reason `range <s>-<e> of "<path as written, ./ stripped>" runs backwards (its end is below its start)`.
- `checkResolved`: returns `oob-exact` when the exact set is non-empty, else `oob-suffix`, right after the no-match return and before `inRange`.
- `checkPinned`: returns `{ok:false, reason}` first, before the `cat-file -e` commit check.
- W1: inserted after the line-0 sentence in the header.
- W2: ", or the range runs backwards" added before the closing parenthetical on both the `oob-exact` and `oob-suffix` lines.
- W3: one sentence added to checkPinned's doc comment.
- Words as the notes give them; line breaks are mine.
- After commit 1, `node --test` over plan, hooks and evidence: rc 0, 590 pass.

Tests (all in verify-cites.test.mjs, appended; every cite built at run time with `BACK = (p) => \`${p}:${3}-${2}\``):
- T1 `a_reversed_rooted_range_in_a_document_is_gated_by_name`: gitTree with a 3-line pool.rs and a docs/notes.md; asserts gated 1, advisory 0, exact reason. Fails at the base.
- T2 `a_reversed_bare_basename_range_is_advice_by_name`: asserts `oob-suffix` and the reason prefix. Fails at the base.
- T3 `a_pinned_reversed_range_fails_even_where_its_lines_exist_at_the_pin`: pinnedRun with `gated`; asserts one entry with T1's reason. Fails at the base.
- T4 `a_range_ending_at_line_0_keeps_the_line_0_reason`: start 5, end 0; asserts `oob-exact` and the line-0 reason exactly. Passes at the base.
- Base run: a scratch copy of the test file over B's scripts (a `git archive` of B in my scratch folder, never committed). It had 51 pass, 3 fail: T1, T2 and T3 by name. T4 passed.
- At commit 2 and at head: the test file has 54 tests, 54 pass.
- No existing test was changed or removed (commit 2 is 38 insertions, 0 deletions).

Mutations, each applied alone at 843e206b119c24af4163b40389135715d2b40276:
- M1 (status forced to `oob-suffix`): fails T1 and T3 only.
- M2 (status forced to `oob-exact`): fails T2 only.
- M3 (checkPinned's return removed): fails T3 only.
- M4 (end-at-line-0 exclusion dropped): fails T4 only.
- Each was reverted. After the last, the file's sha256 equalled the pre-mutation copy (4e4f77579ab29ede94dcabb70deba5bca768b6553c7384d43873ef3aefa289b5) and `git diff` was empty.
- The comments are in commit 3, beside each test. They hold no reversed token.

Predicted run: main's checker (from B) and my head's checker over a clone checked out at B, with core.longpaths set so the checkout is complete.
- Both give scanned 2539, gated 0, advisory 76, listErrors 0. The gated and advisory sets, keys, tiers and reasons are identical. exit 0.
- Two earlier attempts failed on tool setup before this one passed: the first checkout hit Windows path-length limits and the run read a missing file; the second was this successful run.

Scan over my head's tree (the form's script, counts only, in the worktree):
- Positive control (forward): `forward ranges: 15372 across 2539 file(s)`, exit 0.
- Default set: `reversed ranges: 0 across 2539 file(s)`, exit 0.
- All tracked files: `reversed ranges: 0 across 2998 file(s)`, exit 0.

Checks at head (exit code, last line):
- `node --test` over plan, hooks and evidence: rc 0, tests 594 pass.
- `verify.mjs --offline`: rc 0, "verify:plan PASS".
- `verify-cites.mjs`: rc 0, "PASS ... across 2539 file(s) ... (76 loose reference(s) advised above.)"
- `verify-quotes.mjs`: rc 0, "PASS — 134 checked, 103 verified, 30 baselined, 1 advisory, ... 0 ruling-cite errors."
- `verify-test-claims.mjs`: rc 0, "PASS — all 705 claimed test(s) across 217 file(s) exist or are planned, superseded or withdrawn".

Size: `git diff --numstat origin/main...HEAD` gives 18+4 for verify-cites.mjs and 42+0 for the test file. That is 64 against the declared 100, with no overrun.

Off-scope: none done. Background shells: my verify-quotes call was moved to the background by the harness (b0ynvpbsu, then b05hy6idz). Both completed with exit 0, and none of my processes is still running. I used scratch files vcrr-* only, including a clone folder and a base-copy folder in the scratchpad.

Model as the harness reports it: Sonnet 5.5 (claude-sonnet-5-5), no override, no context handoff.

Self-check on the four classes:
1. Cross-module interfaces: none crossed. The change touches only verify-cites' own functions, and verify-quotes is untouched.
2. Completion claims: each points to a transcript call with evidence.
3. User-facing messages: the new reason text is produced by the code at this commit and asserted by T1 and T3.
4. Required tests: each reaches its assertion, shown by the base failures and the mutation failures by name.
