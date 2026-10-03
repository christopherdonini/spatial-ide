*Custodian's filing note (2026-10-03): worker report 5 for PLAN node `subagent-write-audit-script` (PR #167's correction round 2, the third Amendment's scope addition), written by the worker to this path itself under the 2026-10-03 trial directive (part 1) and committed as written below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 4e80e256775c3e2ada12529b0c8bb03eea14066be5028de7fdcf135819088d03, computed by the custodian. It equals the worker's returned sha256.*

---

# subagent-write-audit-script worker report 5 (correction round 2, the third Amendment's scope addition)

Model: claude-sonnet-5-5 (no override, no context handoff). Branch cut/subagent-write-audit-script; origin head verified ef3734af before work.

## Commits (signed off, pushed, plain git push)
- 18715e4b feat: subagent-write-audit voids on a tool on no list (T10; the third Amendment's scope addition). Adds READ_TOOLS = [Read, Grep, Glob, SubagentHandback], a void naming any tool_use on none of the three lists, the script header's VOID-case list (unparseable line, tool on no list), the test file header (T1 to T7 the form's Tests+mutation line, T8 to T10 from its Amendments), and T10 (Write to the allowed path plus an Agent call: VOID, exit 1, voids match /Agent/).
- f1e39550 test: subagent-write-audit M10 recorded for T10. The RECORDED MUTATION comment sits directly above T10.

## M10 (observed by applying it)
At 18715e4b I removed the new `else if (!READ_TOOLS.includes(...))` void, ran T10 alone (--test-name-pattern T10) and it failed by name, "T10: VOID on a call to a tool on no list, naming it", at its status assertion (actual 0, expected 1, i.e. 0 !== 1). Reverted with `git checkout -- scripts/hooks/subagent-write-audit.mjs`; tree clean afterwards. No verify-mutation run is claimed as the observation.

## Existing tests
T1 to T9 pass unchanged. Their fixtures use only Read, Write, Edit and Bash. Suite on the test file at 18715e4b: 10 tests, 10 pass.

## Live runs at head f1e39550 (--session e12d1b11-44e2-419b-9288-452e5556bf9f)
- a1761dc9daea9c1e5 with the report-2 allowed path: PASS rc 0. Counts Read 34, Grep 27, Glob 1, Write 2, Edit 1, SubagentHandback 1. No voids.
- aaa04ea882704ee94 NONE: PASS rc 0. Read 23, Grep 19, Glob 1, SubagentHandback 1.
- a11d6c7e3a67ec44d NONE: VOID rc 1. Bash 76, Read 1, SubagentHandback 1; 76 voids, all "Bash call (a shell can write anywhere)", none for any other tool.
- a34ab0514f1cb4e23 NONE: PASS rc 0. Read 16, Grep 11, Glob 2, SubagentHandback 1.
The new void fired on none of the four: the invalidator did not trigger.

## Checks after the last commit (rc as it came out)
- node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs": rc 0; tests 425, pass 425, fail 0.
- verify-mutation.mjs --base origin/main --head HEAD: rc 0; "all 10 new test(s) have a recorded mutation naming them" (includes T10).
- verify-cites.mjs rc 0; verify-quotes.mjs rc 0; verify-test-claims.mjs rc 0 (advisories only, none in my files).
- profile-path-scan --staged rc 0 before each commit; --message rc 0 on each message.

## Size
git diff --numstat origin/main...HEAD -- . ':!scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md' at f1e39550:
118 0 scripts/hooks/subagent-write-audit.mjs
191 0 scripts/hooks/subagent-write-audit.test.mjs
Total 309 added lines, 0 deleted.

## Deviations
None. The form was not edited. The test header line now exceeds 100 columns, as several existing comment lines already do. The M10 comment names the commit 18715e4b by its 8-digit short id, in the existing comments' shape.

Worktree state: clean (git status --porcelain empty), branch pushed.
