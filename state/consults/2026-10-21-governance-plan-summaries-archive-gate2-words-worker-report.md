*Custodian's filing note (2026-10-21): the worker's report for governance D's gate-2 word round: the architect's D5 and D7 words (`state/consults/gates/2026-10-21-governance-plan-summaries-archive-gate2-architect.md`), applied on `cut/plan-summaries-archive` in C:/dev/wt/psa from 510f4bac to f54b54ac4a9f9f73b482e865dacdb7e314f126fc, pushed. The run 2026-10-21T03:20:05Z to 03:24:06Z by its transcript (Bash 8, Write 2); its one SubagentHandback call, at 03:24:05Z. Checked against the branch: the commit changes the README's exit-code sentence and R15's two comment lines into the architect's words and nothing else. Extracted by script; one final newline added; nothing else changed.*

---

Both gate-2 word replacements are applied and pushed as one commit f54b54ac4a9f9f73b482e865dacdb7e314f126fc on cut/plan-summaries-archive. Every check exited 0. The commit message is the one you gave and carries both trailers.

**Words and replacements**
- The words file's sha256 matched 23ba10d5...e1c63. A Write-tool script asserted each `old` occurs exactly once and refused on a CR byte. Both replaced with rc=0.
- The first replacement is the exit-codes sentence in scripts/plan/README.md, starting at line 375.
- The second is the two comment lines in scripts/plan/rotate-plan-summaries.test.mjs, starting at line 346.
- `git diff 510f4bac HEAD` shows only those two files, 3 insertions and 3 deletions: README +1/-1, test file +2/-2.

**Checks at the new head**
- `node --test scripts/plan/rotate-plan-summaries.test.mjs`: rc=0, tests 18, pass 18, fail 0.
- `verify.mjs --offline`: rc=0, "verify:plan PASS".
- `verify-cites.mjs`: rc=0, PASS, 2116 files, 89 loose references advised.
- `verify-quotes.mjs`: rc=0, PASS, 129 checked, 98 verified, 30 baselined, 1 advisory.
- `verify-test-claims.mjs`: rc=0, PASS, 574 claimed tests.
- `verify-mutation.mjs`: rc=0, "all 18 new test(s) have a recorded mutation naming them".
- §8 item 7 `cmp` against M0 81c34c8b: AUTONOMY.md rc=0 and scripts/plan/README.md rc=0.

**§7 counting command** (insertions plus deletions)

| File | Lines |
|---|---|
| AUTONOMY.md | 19 |
| scripts/plan/README.md | 12 |
| scripts/plan/rotate-plan-summaries.mjs | 251 |
| scripts/plan/rotate-plan-summaries.test.mjs | 381 |
| Total | 663 over 4 files (declared budget: 800 lines over at most 6 files) |

**Push:** `git push origin cut/plan-summaries-archive` was an ordinary update, 510f4bac..f54b54ac, rc=0.

**Differences from the brief:** none. I ran no heavy command, so no machine hold was used. I did not run the CI globs, as you said.

**Final porcelain:** empty. **Model:** Sonnet 5.5 (claude-sonnet-5-5).
