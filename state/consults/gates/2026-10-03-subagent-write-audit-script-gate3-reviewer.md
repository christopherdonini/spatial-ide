*Custodian's filing note (2026-10-03): the gate-3 reviewer for PR #167 wrote this report to this path itself, through its shell as its brief permitted, under the 2026-10-03 trial directive (part 1). It is committed as written, below the rule. The hash of record of the report as written, from this file's line 5 (the report's first line) to the end, is 1c80b02d26605cbe73bb7980b2c5061f090bcd0ad8378697799b15972685e9e5, computed by the custodian. It equals the reviewer's returned sha256. Its two blocking findings are record defects which the gate-3 architect's reduction removes (the record cap, item 3).*

---

VERDICT: FAIL
Reviewed cut/subagent-write-audit-script @ f1e39550ac8c6b6c2ca9d885441ae2d797f1bdec. PR #167, gate 3, reviewer.

Scope: correction round 2 (`git diff 8173b1e6 f1e39550`: ef3734af, 18715e4b, f1e39550), read in the worktree C:/dev/wt/write-audit after `git fetch` (origin's head equal to f1e39550; tree clean; origin/main 09992021, merge base 8715ad1b). Main-side sources read at 09992021. Line cites into branch files are named in words at a named commit, with no hash (round 15 (e)). M10 was applied and reverted with `git checkout`; the worktree was clean after it and after every run. Scratch files were made outside both checkouts. No commit, no push, no tracked edit. Both checkouts were left as found (main: the two untracked paths only).

Disposition under the record cap: the code, the tests, the mutation, the invalidator, the size and append-only all hold. The two S1 findings are record defects only. Both are removed by the architect's reduction to references (one reference row each, listed in the Fix lines). The round 25 (d) PR-body and post-merge parts of S1-1 are the custodian's, not the reduction's. No third correction round is asked.

## S1 (blocking)

S1-1. A test-text span on an unmerged branch named without its commit id (round 25, item 2 (d); the reviewer checklist fails it by name), and a test-text correction with no class-3 row (template §10 class 3, the named exception of round 14).
- 18715e4b replaces line 5 of `scripts/hooks/subagent-write-audit.test.mjs` at 8173b1e6, whose claim "(Tests+mutation line, T1-T8)" gate 2 found false (reviewer S2-4, architect N-3). That is a record correction of a claim in a test comment. Class 3 reads: "a record correction that changes a claim living in a test comment or an operator-facing test string is class 3, recorded by row with the superseded span pinned."
- The third Amendment records it only as: "The script's header list of VOID cases and the test file's "T1-T8" header are updated with this Amendment's code." No line, no commit. The span exists only on the branch, and the template's Round 25 additions require: "the row names it by that commit's id until merge, in words and with no hash: lines <a>-<b> of `<path>` at `<commit>`."
- The same rule asks that the PR body name the row (the body asks for a merge commit, but names no row), and that the post-merge hash pin be carried by a PLAN node blocked on the piece (none exists on main at 09992021).
- The script-header half of the sentence is a code comment, not test text, and is not part of this finding.
- Fix (the reduction): one class-3 row, "line 5 of `scripts/hooks/subagent-write-audit.test.mjs` at 8173b1e6, replaced at 18715e4b". Custodian: name that row in the PR body, and carry the post-merge pin by a PLAN node.

S1-2. The superseded index is incomplete and says "Nothing else is superseded." (round 12, item 1 (e); gate 2's S1-1 on both sides was the same defect: supersessions stated inline and not indexed.)
- Missing row 1: the Change line's PASS clause ("The verdict is PASS iff every Write, Edit, MultiEdit and NotebookEdit call targets exactly the allowed path" ... ). At head a transcript whose writes all hit the allowed path but which holds one call to a tool on no list is VOID (T10), so the clause no longer holds. The Amendment says so inline: "This narrows the Change line's PASS. The Change line is not rewritten." The index has no row for it.
- Missing row 2: the test file's line 5 at 8173b1e6 (S1-1).
- Every row the index does carry resolves to an existing target: the class-8 label (second Amendment, class 6 bullet), the fallback phrase (second Amendment, its correction bullet), the "every new test" clause (second Amendment, class 4 bullet), the rc claim (this Amendment, class 3), "A record finding" (this Amendment, class 1), the Out-of-scope line's single-gate claim (second Amendment and this Amendment's Corrections), "no longer holds" (Corrections), the class 4 label for the parse void (Class 1 row), and the reason for not taking S2-4 (the scope addition).
- Fix (the reduction): two rows, "the Change line's PASS clause: by the third Amendment's scope addition" and the S1-1 row; then "Nothing else is superseded" holds.

## Checklist

1. Gate 2's findings.
   - S1-1 (both gates): an index is present (round 12 (e)); it is incomplete (S1-2).
   - Architect S1-2: resolved. The class-3 row names tool commit 7d24ed15. `git log -1 --format=%H 8d296b9c -- scripts/plan/verify-mutation.mjs` gives 7d24ed155a120556d6e726eea68237409270d975, which is on main. The gate-1 reviewer's Exit codes section gives that tool commit and "At head 8d296b9c: rc 1, 5 of 7."
   - Architect S1-3: resolved. The second Amendment's reason is superseded by the scope addition (the index's ninth row), and the sibling search is recorded in the Amendment. Its claims match the parse loop at 8173b1e6: a blank line, a non-array `message.content` and a non-`tool_use` item carry no call; a write with no path (target "" never equals the allowed path), a missing or empty transcript, zero calls and an unparseable line void; a tool on no list passed silently. The search is recorded as a reading only ("The custodian read the parse loop at 8173b1e6."), while §14 asks "by grep and by reading the sibling sites" (S2-1).
   - Architect S2-1: resolved ("did not hold at dispatch"; the round 25 (e) cite named as governing §21a categories, not size).
   - Architect S2-2 and reviewer S2-1: resolved in substance. The reason given for 264 to 293 is "T9, M6 to M9 and the parse void". By numstat, 264 to 278 at 1202bf4e (script 4/1, test 11/0) and 278 to 293 at aed61535 (script 3/2, test 14/0). The script's net +1 at aed61535 is the N-1 header rewording, which the reason does not name (N-1).
   - Architect S2-3: resolved (Class 1 row; class 4 kept for M6).
   - Architect S2-4: resolved. The gate-1 reviewer observed M1 at 7a9784cb (its Checklist 3). See S2-2 for the M1 comment.
   - Architect S2-5: the Amendment's figures for the four transcripts at 8173b1e6 reproduce (this gate ran the 8173b1e6 script on the four transcript paths: PASS, PASS, VOID with 76 voids, PASS). The head re-run is item 5 below.
   - Reviewer S2-3: the clause is replaced. Its second ask, "carry to the follow-up that lead-data runs are dispatched as general-purpose", is not in the Follow-ups list (S2-3).
   - Reviewer S2-4: both comments updated at 18715e4b (record side: S1-1).
   - Reviewer N-2 and gate-1 N-2: in the Follow-ups list.
   - The OPEN entry is narrowed on main at 09992021 to "Mutations added", as the Amendment says.
2. The superseded index: see S1-2. Nine rows, each target exists; two rows are missing.
3. Class 9 before its code.
   - ef3734af (form only, +40) is the parent of 18715e4b (script and test); f1e39550 adds the M10 comment only. No code of the addition precedes the Amendment.
   - First line carries "scope addition" and names AUTONOMY.md §14 (N-2 on the cite form).
   - §2 shape ("The change"), §4 test with its mutation (T10, M10), §5 declared unchanged and the invalidator are all present. The §8 and §9 items the class names are present in substance only: the invalidator stops the piece, and "The gate-3 reviewer re-runs them at head." (S2-4).
   - The code does what is declared: `READ_TOOLS = ['Read', 'Grep', 'Glob', 'SubagentHandback']`, and a third branch after the write and shell branches pushes `${item.name} is on no tool list: the audit cannot see what it writes` for any other name. The write and shell branches are unchanged. In the test file, the only line deleted from 8173b1e6 to head is the header; T1 to T9 are unchanged.
4. T10 and M10.
   - T10 alone at head: pass.
   - M10, observed by this gate at f1e39550: I deleted the two lines of the third branch (the `else if` that tests `READ_TOOLS`, and its `voids.push`) from `scripts/hooks/subagent-write-audit.mjs` and ran `node --test --test-name-pattern="^T10:" scripts/hooks/subagent-write-audit.test.mjs`. Result: "✖ T10: VOID on a call to a tool on no list, naming it", AssertionError "0 !== 1", actual 0, expected 1, at line 187 of the test file (the status assertion), rc 1. Reverted with `git checkout`; T10 passes again; tree clean. This matches the recorded comment.
   - `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: rc 0, "all 10 new test(s) have a recorded mutation naming them". Tool commit 7d24ed155a120556d6e726eea68237409270d975. A recording check, not an observation (round 25, item 2 (c)); the observation of record is the M10 run above.
5. The invalidator, at head f1e39550, from the worktree, `--session e12d1b11-44e2-419b-9288-452e5556bf9f`:
   - a1761dc9daea9c1e5, allowed `C:/dev/spatial-ide/state/consults/2026-10-03-lead-data-pilot-setup-lead-data-report-2.md`: PASS, rc 0. Read 34, Grep 27, Glob 1, Write 2, Edit 1, SubagentHandback 1; three write calls, all to the allowed path; no voids.
   - aaa04ea882704ee94, NONE: PASS, rc 0. Read 23, Grep 19, Glob 1, SubagentHandback 1.
   - a11d6c7e3a67ec44d, NONE: VOID, rc 1. Bash 76, Read 1, SubagentHandback 1; 76 voids, every one "Bash call (a shell can write anywhere)"; none from the new void.
   - a34ab0514f1cb4e23, NONE: PASS, rc 0. Read 16, Grep 11, Glob 2, SubagentHandback 1.
   - As expected: PASS, PASS, VOID (Bash only), PASS. The invalidator did not fire.
   - Context, not a finding: across all 136 subagent transcripts of this session the tool names are Bash, SubagentHandback, Read, Grep, Glob, Write, Edit and Monitor, and the only content item types containing "tool" are `tool_use` and `tool_result`. Monitor (8 transcripts) would now void; it is a worker tool, not a lead-data or architect one.
6. Size: `git diff --numstat origin/main...HEAD -- . ':!scripts/hooks/SUBAGENT-WRITE-AUDIT-PREREGISTRATION.md'` gives 118 0 (script) and 191 0 (test): 309 over 2 files. The Amendment defers the final figure to the closing record; the PR body says 309. No new bound is crossed (full gating already applies).
7. Append-only: the form at head has 83 lines, LF, no CR, final newline. sha256 of its first 11 lines = the form at 8715ad1b (on main) = c121ab13b48b9318682a80cfd66d337874d127191c335a3963452bedc3222e37. First 25 lines = the form at 7a9784cb = f05e9451a8b05e6c29de048ec51a75d88567459feb960d88433518c8713331f2. First 43 lines = the form at 8173b1e6 = 0e261131f107d00fd74a210892f5a6a89967e1f55561be7f83aa193d40ac35e2. The five lines and the first and second Amendments are byte-unchanged; ef3734af is a pure append of 40 lines.
8. The PR body (read at headRefOid f1e39550, MERGEABLE). Gate 2's N-3 sentence is gone. Its replacement, "So a run cannot pass if part of the transcript it reads was invisible to the audit, or if it called a tool that could write unseen, such as spawning another agent.", is narrowed to the transcript read and matches the code. N-3 needs no further edit. Other body items: N-3 and N-4 below, and S1-1's row naming.
9. Round 25, item 2 fail-by-name list: no full-form §7 overrun; class 9 recorded and declared before its code; no record calls a verify-mutation run an observation (worker report 5 says "No verify-mutation run is claimed as the observation."); one test-text span named without its commit id (S1-1); the Out-of-scope line names no §21a category as touched.
10. References in the Amendment resolve on main at 09992021: both gate-2 reports (hash from line 5 to the end: architect ceda871621400fbe73d3e176f976143ce7de2a818c0b3166b58710d2f1611149, reviewer 34270837421e857a17c7dcaf3bb58a4464f73426c70a61b342e98ce91cfddc04, each equal to its filing note), and `state/gate-log.json` records 368 (architect, FAIL, @ 8173b1e6) and 369 (reviewer, FAIL, @ 8173b1e6). No hash reference is written in the Amendment.

## Exit codes

All runs in the worktree at f1e39550, node v24.18.1. Each tool commit is the last commit touching that script at head.
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: rc 0. 425 tests, 425 pass, 0 fail.
- `node scripts/plan/verify-cites.mjs`: rc 0, PASS, 1169 files, 38 loose advisories. Tool commit 522e448d55e089b974e115e23f0c72bfc6e1120a.
- `node scripts/plan/verify-quotes.mjs`: rc 0, PASS (113 checked, 82 verified, 30 baselined, 1 advisory). Tool commit f9444a4d99a9087394c55d4b1d4c414a8b11f980.
- `node scripts/plan/verify-test-claims.mjs`: rc 0, PASS, 483 claims over 114 files. Tool commit e9735d4749f094f03b69a8b570e8bf10f511c279.
- `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: rc 0, 10 of 10. Tool commit 7d24ed155a120556d6e726eea68237409270d975.
- `timeout 1200 node scripts/plan/verify.mjs`: rc 0, "verify:plan PASS". Tool commit 260720226f136d1ec7d72da64656f07d29400ed7.
- `gh pr checks 167`: rc 0, all six pass. `gh run view` gives headSha f1e39550ac8c6b6c2ca9d885441ae2d797f1bdec, conclusion success, for Governance CI push (37130184818), Governance CI pull_request (37130187723), DCO sign-off (37130187710) and Exposure scan (37130187693).

## S2

S2-1. The §14 sibling search is recorded as a reading only; §14 asks "by grep and by reading the sibling sites". The reading's conclusions hold (Checklist 1). One line naming the grep, or saying none was run, closes it in the closing record.

S2-2. M1's comment (lines 101-103 of the test file at 8173b1e6, unchanged at head) still names 8715ad1b as the observation commit, where the mutated code did not exist. The Corrections bullet makes gate 1's 7a9784cb run the observation of record, which supersedes the comment's commit, but the index carries no row for it. The round-1 M2 correction has the same shape. A row each, in words at 8173b1e6, would complete it; the reduction can carry them.

S2-3. Gate-2 reviewer S2-3 asked to "carry to the follow-up that lead-data runs are dispatched as general-purpose". The allow-list now voids such a run on a tool outside the lists, but the dispatch fact is not in the Follow-ups list.

S2-4. Class 9 names "its §8 and §9 items". The short form has no §8 or §9; the invalidator and the gate-3 re-run carry them in substance, unlabelled. Naming them as such would make the shape checkable.

S2-5. No unit test holds `Grep`, `Glob` or `SubagentHandback` on the read-only list. This gate reduced `READ_TOOLS` to `['Read']` at f1e39550 and ran the test file: 10 tests, 10 pass, 0 fail; reverted with `git checkout`, tree clean. A probe, not a recorded mutation. The live runs in Checklist 5 cover it today; a follow-up test would pin it.

## N

N-1. The 264-to-293 reason omits the N-1 header rewording at aed61535 (+1 net line in the script).

N-2. Class 9's first line "cites the rule by round and item, or by the directive's path". The Amendment cites "AUTONOMY.md §14 (the sibling search)". The rule is item 14 of the human's directive of 2026-09-13 (AUTONOMY.md Appendix A). It resolves, but not in the template's form.

N-3. The PR title still ends "(question round 41 item 3; T1-T8)"; the body holds T1 to T10.

N-4. The PR body's second-Amendment entry says "two of its bullets fit no amendment class, and come to you in the next question round." After the narrowing, one bullet ("Mutations added") remains.

N-5. Worker report 5 is untracked in the main checkout; the closing record will cite it, so it needs committing first.
