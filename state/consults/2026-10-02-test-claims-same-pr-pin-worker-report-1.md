# Worker report 1 — test-claims-same-pr-superseded-pin (2026-10-02)

*Custodian's filing note: the worker's hand-back on the brief for PLAN node `test-claims-same-pr-superseded-pin` (form `scripts/plan/TEST-CLAIMS-SAME-PR-SUPERSEDED-PIN-PREREGISTRATION.md`, committed 28e8255), recorded verbatim below with the harness's report indentation removed. One cite into a file that exists only on the deleted probe branch is de-rooted at filing to its basename (the probe form's line 3); nothing else in the text is changed.*

*The custodian's checks:*
- *branch `cut/test-claims-same-pr-pin` at 7bff7c1, its four commits read from origin;*
- *the diff over 01b5ba0...7bff7c1 is 4 files, 352 insertions and 12 deletions;*
- *probe PR #155 is closed unmerged (draft);*
- *runs 37005296152 and 37005569762 are pull_request runs on the probe branch, both success;*
- *the probe branch was deleted on origin by the custodian after reading them.*

---

Piece `test-claims-same-pr-superseded-pin` is built on `cut/test-claims-same-pr-pin` (head 7bff7c1), pushed, and the tree is clean. The test-only commit had T1 and T6 failing as expected, and every other check below passes. E1 is the branch's own push run; no PR for my branch exists yet. The probe PR needed one merge commit the form does not name (see deviations).

**Commits** (base 01b5ba0)
- 8bc450e test: T1–T9. Failing at this commit: T1 (first assertion, findings 1 !== 0) and T6 (`mergeCommitGateFiles` is not exported yet; the test reads it through a namespace import so only T6 fails). T2–T5 and T7–T9 passed already, because they pin refusals the tool already makes.
- 0e20437 feat: tool change (§2 items 1–7): `mergeCommitGateFiles`, the `mergeCommitGates` option, (f1)/(f2)/(f3) in `findSupersededSpan`, `samePr` entry field, the §7 suffix, header paragraph.
- 13c6d67 docs: README paragraph, AUTONOMY.md §27 (appended; the diff has 0 deletions), the nine mutation comments.
- 7bff7c1 test: each test named inside its RECORDED MUTATION comment. `verify-mutation` found the committed comments did not name 3 of 9 tests; it reads HEAD, not the working tree.

**Counts**
- Scripts suite (`node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`): 375 tests, 375 pass, 0 fail, 0 skipped, exit 0.
- `verify-test-claims.test.mjs`: 64 tests, 64 pass.
- Branch push runs: 0e20437, 13c6d67 and 7bff7c1 are success; 8bc450e (the test-only commit) is failure, as expected.

**M1–M9** (each applied, run, reverted; all observed at 0e20437, Node v24.18.1, git 2.49.0.windows.1; not `verify-mutation` runs)
- M1: first failing assertion is findings `[{…"kind":"claim"}]`, `1 !== 0`. Isolated, 63/64 pass.
- M2: "a pin to a commit the scanned HEAD does not contain must not exempt: [{…"samePr":true}]". Isolated.
- M3: "a claiming line already on main must not exempt…". Not isolated: T7 also fails.
- M4: "after a squash the pinned commit is not on main and must not exempt…". Not isolated: T2, T3 and T7 also fail.
- M5: "no merge-commit record, no exemption…". Not isolated: `a_pin_whose_rev_is_not_an_ancestor_of_origin_main_does_not_exempt` also fails.
- M6: deep-equal diff with an extra `'b/B-PREREGISTRATION.md'`. Isolated.
- M7: "an uncommitted claiming line is in no commit's range…". Isolated.
- M8: the row is accepted, so the withdrawn array is `1 !== 0`. Not isolated: 7 fail, among them the two existing condition-(e) tests.
- M9: findings `[{…"kind":"claim"}]`, `1 !== 0`. Not isolated: the existing condition-(e) test's on-main half also fails.
- Each mutation was reverted and the file passed again. The first failing assertion is written into each test's `// RECORDED MUTATION:` comment.

**Checks** (exit codes taken directly; tool last-change commit in brackets)
- `verify-cites` 0 [522e448]
- `verify-quotes` 0 [f9444a4]
- `verify-test-claims` 0 [0e20437]
- `verify-mutation --base origin/main --head HEAD` 0 [7d24ed1]. It was 1 on the first run, before 7bff7c1.
- `verify.mjs` 0 [2607202]
- `verify-quotes --show-cites` on the changed files exits 1 on two `AUTONOMY.md` quotes that predate this piece. I changed nothing in them, and my added lines produce no cite entries.
- `git version 2.49.0.windows.1`; `node v24.18.1`.

**§7 count** (§7's command at 7bff7c1, base 01b5ba0): 12 + 106 + 236 = 354 changed lines over 3 files (`README.md` 12/0, `verify-test-claims.mjs` 94/12, `verify-test-claims.test.mjs` 236/0), against ≤ 650 and ≤ 3. No overrun, no I7.

**E2 and E3** (draft probe PR #155; branch `probe/test-claims-same-pr-pin` kept, PR closed unmerged)
- Probe commits: first 880a13a (form with the absent claim on line 3, a proposed node with `merge: merge-commit`, generated set regenerated); second fa9a40d (superseded row pinning 880a13a); merge commit a93090c; third 06ae5d2 (key removed, regenerated).
- **E2:** pull_request run 37005296152, success. The checkout log shows `HEAD is now at 76c6bfff Merge a93090c… into 4952b6f…`, so H1 holds (no I2). `verify:test-claims` listed the probe line `PROBE-SAMEPR-PREREGISTRATION.md:3` under superseded with the suffix ` — pin not yet on main; same-PR claim, merge-commit node`, and printed PASS (464 claimed, 13 planned, 8 superseded, 17 withdrawn). Push run 37004928744 at fa9a40d, before the PR could merge, also succeeded with the same listing.
- **E3:** pull_request run 37005569762, success, HEAD at merge commit ea1ce3bf. The probe claim is listed under planned ("node probe-test-claims-same-pr is proposed"); PASS with 14 planned, 7 superseded.
- Locally H2 held: T1 and T7 pass (no I3).

**§8 self-check:** items 1–14 clear.
- 1: the acceptance is only in `findSupersededSpan`; the withdrawn path passes none and `isAncestorOfMain` is untouched.
- 2: no change to (r), (a)–(e), the recognizer, the existence index or `plannedGate*`.
- 3: the acceptance runs only after (e) refused.
- 4: blame is given no revision (M7 proves it), and a git failure is false.
- 5: only the three counted files, plus `AUTONOMY.md` and the form untouched.
- 6: no probe file, commit or node on the piece branch.
- 7: tests use `os.tmpdir()`, `execFileSync` argument arrays, no drive letter, no timing, and are ignored on no platform; the file's existing `after()` sweep removes every temp directory.
- 8: no quotation in the header, README paragraph, §27 or the new test comments.
- 9: `mergeCommitGateFiles` and the `mergeCommitGates` option have `main()` as product caller. Grep: `mergeCommitGateFiles` appears at its definition and `mergeCommitGates = mergeCommitGateFiles(plan)` in `main()`, and the option is passed `mergeCommitGates` in `main()`'s `runVerifyTestClaims` call.
- 10: mutations are recorded with commit 0e20437; none described as a `verify-mutation` observation.
- 11: no overrun, no scope addition.
- 12: no ledger line cites, no bare self-line, and §27 cites rulings by round and item.
- 13, 14: no squash or rebase; no user-profile path in the diff.

**R1–R6:** one rule on all platforms, no OS-conditional code, git argument arrays with no shell, no drive letters. Run on Windows locally and on ubuntu in CI; no macOS claim and no ignores.

**Deviations and open points**
1. The probe PR was `CONFLICTING` against main, because main had regenerated `CUSTODIAN-QUEUE.*` and `site/` since 01b5ba0. That meant no pull_request run existed. I merged `origin/main` into the probe branch (a93090c, no force, generated files regenerated), which the form does not name. E2 and E3 are the pull_request runs after that merge.
2. My piece branch does not touch the generated set, but `AUTONOMY.md` §27 and the sibling's §28 both append at the file's end, so the second to merge will conflict on that tail.
3. The test file imports `* as claimsTool` and `parseYamlSubset` only for T6. This was needed so the test-only commit fails T6 rather than the whole file.
4. The probe's claim name never appears in backticks in any tracked record outside the probe branch; the probe form itself contains it, as §4 requires.
5. No background process left running. Temp scripts were in the session scratchpad.
6. Model: Opus (Claude Opus 5.5, 1M context); no override and no context handoff received or produced.
