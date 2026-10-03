*Custodian's filing note (2026-10-03): worker report 4 for PLAN node `subagent-write-audit-script` (PR #167's correction round 1), written by the worker to this path itself under the 2026-10-03 trial directive (part 1) and committed as written below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 9d5da3d38645ffe1514bbdace0d73cf96d8e722db4c4f439903232063247ff9b, computed by the custodian from the saved bytes. It equals the worker's returned sha256. Its third Deviations bullet is imprecise: the reworded header at aed61535 keeps "export anything" (the form's second Amendment).*

---

# subagent-write-audit-script, correction round 1, worker report 4

Branch cut/subagent-write-audit-script, start 7a9784cb (origin head matched), final head c656076e (pushed, worktree clean).

## Commits
- 1202bf4e `fix: subagent-write-audit voids on an unparseable transcript line (T9)` (S1-3 fix in the parse loop, T9 added)
- aed61535 `test: subagent-write-audit M6-M9 recorded for T9, T4, T6 and T7` (also S2-2 clause on M2's comment, N-1 header reword)
- c656076e `test: subagent-write-audit M2's worktree clause moved above its comment (the mutation window)`

## Mutations (each applied to the script, its test run alone, failure seen, reverted by git checkout; observed at 1202bf4e)
- M6, T9: silent skip restored; T9 fails at its status assertion, 0 !== 1.
- M7, T4: NONE accepts any target (`allowed !== null && target !== allowed`); T4 fails at its status assertion, 0 !== 1.
- M8, T6: case-fold dropped from the path comparison; T6 fails at its status assertion, 1 !== 0.
- M9, T7: usage path exits 1; T7 fails at its first status assertion, 1 !== 2.

## Checks at c656076e (rc)
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: tests 424, pass 424, fail 0; rc=0
- verify-mutation --base origin/main --head HEAD: PASS, all 9 new tests; rc=0
- verify-cites rc=0; verify-quotes rc=0; verify-test-claims rc=0
- verify.mjs: PASS; rc=0
- profile-path-scan: clean, rc=0 on --staged and --message for all three commits

## Size
`git diff --numstat origin/main...HEAD -- . ':!scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md'` at c656076e:
114 0 scripts/hooks/subagent-write-audit.mjs
179 0 scripts/hooks/subagent-write-audit.test.mjs

## Deviations
- My first commit of T9 was broken (a shell backslash collapse wrote a literal newline into the test, and the script edit had not applied); I saw the failures before pushing and amended the unpushed commit to 1202bf4e. Nothing broken was pushed. A first M6 "observation" at the broken state was discarded; all four mutations were observed afresh at 1202bf4e.
- The first push of aed61535 made verify-mutation report MISS for T8: the S2-2 clause placed after M2's comment pushed the comment's word "mutation" beyond the 500-character window. Fixed in a third commit (c656076e) by placing the clause above the M2 line; M2's own text unchanged.
- The N-1 reword also trimmed "export anything" from the Does-not list wording only as reflowed; no meaning dropped beyond the git-state phrase.
- Not done, as instructed: S2-4, N-2.
