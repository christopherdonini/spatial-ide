*Custodian's filing note (2026-10-02): the architect's gate 1 on PR #156, for PLAN node `test-claims-same-pr-superseded-pin`, full gating. Reviewed: cut/test-claims-same-pr-pin @ 7bff7c1 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b) and transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Its branch-only `path:line` cites are read at 7bff7c1.*

*Verdict: FAIL on S1-1. In (f3), a git failure in the last ancestry check is negated into acceptance, against §8 item 4. It is taken in correction round 1.*

*Routing: the template pointer for round 34 item 4's exception becomes a proposed docs-only PLAN node.*

*Profile paths redacted at filing: none.*

---

VERDICT: FAIL. Reviewed cut/test-claims-same-pr-pin @ 7bff7c1 (worktree C:/dev/wt/test-claims-same-pr-pin). Gate 1, architect, PR #156, node `test-claims-same-pr-superseded-pin`.

All cites below are read at 7bff7c1.

## Findings

**S1-1. A git failure in (f3) counts as acceptance. This hits §8 item 4 and §2 item 3's last paragraph.**
- Where: `scripts/plan/verify-test-claims.mjs:448`. The line is reproduced because the defect is in its exact text:
  `if (/^[0-9a-f]{40}$/.test(c) && !/^0+$/.test(c)) result = !gitSucceeds(root, ['merge-base', '--is-ancestor', c, mainSha]);`
- The cause: `gitSucceeds` (`:413-420`) returns false for exit 1, which means "not an ancestor" and is the in-range answer. It also returns false for every other failure (exit 128, a missing object, a spawn error). The line negates that result, so a git error on (f3)'s third spawn reads as "in range" and lets the pin through.
- Two record statements are false at this commit:
  - the code comment at `:433` ("Any git failure is false");
  - `scripts/plan/README.md:164` ("Any git failure is not acceptance").
- Shared cause: the form's own (f3) wording "fails" (§2 item 3, my draft) is ambiguous. The same item's last paragraph governs, so no amendment is needed.
- Fix: set `result = true` only when the spawn throws with `status === 1`. Any other outcome is false.
- After the fix, the reviewer decides whether M3 and M7 are re-observed at the corrected commit. They also decide whether a test is owed for the error branch, which is hard to trigger without a mock; if no test, record the gap as a residual. The correction row is at most three sentences (round 12 (d)).

**N-1. E2 deviation (worker report :74): probe branch merged with main at a93090c. Accepted.**
- It is benign and makes the evidence stronger. E2's pull_request run 37005296152 tested a merge commit whose PR range itself contains a merge from main. That is the regenerate-on-merge shape of AUTONOMY.md §23, and blame still credited the line to 880a13a, so H2 held through a merge.
- It departs from §4's wording: E2 was meant to be "the second commit's run", and the pull_request run's head is a93090c. Push run 37004928744 at fa9a40d is the push context, not H1's discriminator.
- The closing record states this by reference: run id, head a93090c, test merge 76c6bfff. Its first line says it is post-result.
- The piece branch carries no probe commit, file or node (checked: no `PROBE*` file under `scripts/`, no probe node in `PLAN.yaml`).

**N-2. E1 is not in the evidence.**
- The worker's E1 was a branch push run (report :14).
- §4 E1 is PR #156's own pull_request run, green at the head marked ready. The reviewer reads it by run id before merge.

**N-3. Rebase is reasoned, not tested.**
- §1 May-claim 3 says squash or rebase; T4 (`verify-test-claims.test.mjs:1497-1507`) tests squash only.
- The mechanism is the same: P1 is rewritten, and both (e) and (f2) refuse it.
- The closing record must not call rebase tested.

**N-4. Test-file shape (worker deviation 3). Not an edit to existing test code.**
- Two imports are added (`verify-test-claims.test.mjs:19-20`), needed so T6 is red first.
- There are two new helpers, `sameprGit` and `sameprFixture` (`:1400-1441`), where §4 says one. `sameprGit` is a three-line git wrapper. No existing helper is edited.

**N-5. The `RECORDED MUTATION` comments put assertion output in quotation marks.**
- §4 requires the first failing assertion to be recorded, and this is tool output, not quotation of a source.
- So it is not a §8 item 8 quotation.

**N-6. Section-number collision with round-mirror-pretooluse-hook (worker deviation 2).**
- That piece appends §28 and this one appends §27, so the second to merge conflicts at the file's tail.
- Fix: keep both sections whole and unaltered at the end of the file. No record may cite either section by line.

## Architect checklist (§9)
- **Gating heads:** both hold. A property under test is narrowed: the existing condition-(e) test still guards, and M5 shows it failing (`:1509-1514`). The size, 354 lines over 3 files (worker report :48), is over §21c's 150-line bound.
- **Round 33 item 2 against §2:** matches proposal C (`state/drafts/weekly-window-2026-10-02.md:80-89`) and is narrower. The acceptance sits outside (e), on the superseded path only (`verify-test-claims.mjs:456-461`).
- **Round 15 (e) and R-1:**
  - `AUTONOMY.md:499` states exactly round 34 item 4's row shape: claiming line and pinned commit both from the scanned PR, on a merge-commit node. Round 15 (e) holds everywhere else.
  - The code accepts nothing wider: (e) refused, then (f1) and (f2) and (f3).
  - T8 (`:1583-1607`) shows the withdrawn path still refuses with "rev not on main".
- **B-2:** `mergeCommitGateFiles` (`:777-785`) reads only not-done nodes with the exact value. It rightly applies no sticky-landed exclusion, because the motivating file is also gated by a done node. T6 (`:1527-1556`) covers it.
- **Round 26 item 3:** `AUTONOMY.md:497`.
- **Round 25 item 2:**
  - no overrun;
  - no scope addition;
  - mutations named at 0e20437 and not called `verify-mutation` observations (worker report :27);
  - no hash pin to a branch commit in the diff;
  - full form used.
- **Seams and caller rule:**
  - `main()` is the product caller of `mergeCommitGateFiles` and of the option (`:883-897`);
  - T6 goes through the shipped `parseYamlSubset`, which `loadPlan` uses (`plan.mjs:58`);
  - GitHub's checkout is proven by E2 and E3 from real runs.
- **Round 7 operator-visible text:** the suffix (`:877`) states only the tool's own facts.
- **AUTONOMY.md §27 (`:492-500`):** covers §2 item 9's five points. It cites by round and item, quotes nothing, and adds lines only after `:490`, main's last line. The reviewer confirms 0 deletions in the diff.
- **R1 to R6:** clear. There is no `process.platform`, shell, skip or timeout in the new code. Tests use `os.tmpdir()`, `execFileSync` argument arrays and `git branch -M main` (`:1409`, `:1590`), and the existing `after()` sweep removes the temp directories (`:36-51`).

## Does round 15 (e)'s text elsewhere need a pointer? Yes, one, in the template. Not in this piece.
- §27 carries the exception, as round 34 item 4's Applied line places it.
- But `docs/PREREGISTRATION-TEMPLATE.md:142` (round 15 (e)) and `:174` (round 25 (d), which prescribes words with no hash until merge) both appear to forbid this exact row. A superseded row recording a claimed-test rename is a class-3 test-text row. So a form author or gate reading only the template would fail a row round 34 allows.
- What is owed: one sentence appended at the end of the template, naming AUTONOMY.md §27 and round 34 item 4, reproducing nothing.
- `AI_DEVELOPMENT.md:732` needs nothing, since it defers to the template (`:729`).
- The architect and reviewer agent definitions also carry round 15 (e)'s fail-by-name text. Changing them is the custodian's and the human's call, not mine.
- Routing: outside §7's files (§8 item 5), so it does not go in this piece. It goes to the custodian as a proposed docs-only PLAN node, or to the next weekly window, for the human to place.

## §8, item by item
1. Clear. The withdrawn path passes no acceptance (`:561-569`). `isAncestorOfMain` (`:360-374`) and `withdrawnRowPinCondition` (`:614-623`) are unchanged.
2. Clear. (e)'s refusal (`:401-406`) is narrowed only at the placement §2 item 4 preregisters. (r), (a) to (d), the recognizer, the index and `plannedGate*` are unchanged.
3. Clear. The acceptance runs only when `anc.checked && !anc.ok` (`:403`), and there is also a no-`origin/main` guard (`:437`).
4. **FAIL.** Blame is given no revision (`:442`), but a git failure is read as acceptance (`:448`). See S1-1.
5. Clear. Three counted files plus `AUTONOMY.md` §27.
6. Clear. No probe file, commit or node at the head.
7. Clear.
8. Clear (N-5).
9. Clear. `main()` is the caller.
10. Clear.
11. Clear. 354 ≤ 650 over 3 files; the reviewer recounts.
12. Clear. No ledger line cite, no bare self-line, and no branch-commit hash in the diff.
13. Pending. The merge method is decided at the click; the PR body must ask for a merge commit.
14. Clear.
