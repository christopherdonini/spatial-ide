*Custodian's filing note (2026-09-27): gate 1, attempt 1 (reviewer; the single combined gate of AUTONOMY.md §21b), of PLAN node `test-claims-landedness-bound`. Reviewed: governance/test-claims-landedness-bound @ d9a8ae4 (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: governance/test-claims-landedness-bound @ d9a8ae4 — **FAIL** (single combined gate, §21b, attempt 1, node `test-claims-landedness-bound`)

Three findings block this gate. All three recorded mutations do reproduce by name, and every suite is green. Worktree left clean (`git status --porcelain` empty).

## Checked first (§21d)
- **Out-of-scope line holds.** No ADR, security, wire or guarantee text is touched. The AUTONOMY.md edit adds a round to a cite and changes no described property.
- **Its factual claim holds.** The only non-done node with PR evidence is `governance-verify-mutation-header-token` (`unscheduled`, #110). `gh api` returns `closed`, `merged=false`.
- **Authority holds.** Round 17 item 8 (design (c)) resolves in the RULED block. The scanner node is `done` with evidence #117, and verify-test-claims reports P3b's three mentions as superseded.

## Blocking

**B1. Nothing tests the new check through verify:plan (missing test; Change line).**
- The Change line says "verify:plan fails by name". All three tests call `verifyNotDoneEvidenceNotMerged` directly; none goes through `verifyStatusAgreement` or `runVerify`.
- Mutation M4: I deleted `scripts/plan/verify.mjs:254`:
  ```js
  failures.push(...verifyNotDoneEvidenceNotMerged(node, { repoRoot, offline, slug, ghApiPrMergedFn }));
  ```
  `verify.test.mjs` still passed 19 of 19, so the check can be unhooked from verify:plan and every test stays green.
- **Fix:** add one test through `verifyStatusAgreement` with an in-progress node whose evidence PR is merged. Record M4 as that test's mutation (class 4), observed at a named commit.

**B2. Caller rule (checklist 8), by name: the `ghApiPrMergedFn` option.**
- On `verifyEvidence` (verify.mjs:166) and `verifyStatusAgreement` (:232), nothing sets it. `runVerify` passes only `{ repoRoot, offline, slug }` (:298), and no test passes it.
- On `verifyNotDoneEvidenceNotMerged` (:219), only `verify.test.mjs` passes a non-default value. A test-only caller does not count.
- The accessor exemption doesn't apply: this seam replaces a `gh api` call, so it acts.
- The `verifyEvidence` signature change also falls outside the Change line ("one new check beside the existing PR-merged check").
- The test comment at verify.test.mjs:239-240 says "via the same injection point `verifyEvidence` already takes for the done-node check (`ghApiPrMergedFn`)". That is false at origin/main, where verify.mjs:166 reads `export function verifyEvidence(node, { repoRoot, offline, slug })`. This diff adds the parameter at c0fa9c0. The form's "stubbed as the existing PR tests stub it" has the same false premise: the tests on main stub nothing and run with `offline: true`.
- **Fix:**
  - Remove the option from `verifyEvidence`, and delete the "already takes" clause.
  - Turn the PR state into data that a product caller supplies. For example, `runVerify` gets the real `ghApiPrMerged` result for each non-done node naming a PR and passes the results into `verifyStatusAgreement`. The tests then pass the real `{ ok, detail }` shape (verify.mjs:48) through `verifyStatusAgreement`, which also closes B1.
  - If this goes over 150 lines: a class 6 amendment and the architect gate (§21b's mid-piece clause).
  - If the custodian reads a stubbed external CLI as outside the rule, that is a reading for the human; this gate can't grant it.

**B3. N4 did not land as the note asked.**
- `scripts/plan/verify-test-claims.test.mjs:386-387` reads: `Recorded in Amendment 4 item 3 (state/consults/2026-09-26-test-claims-followups-gate2-architect.md)`.
- N4's defect was a pointer to a hand-back instead of the record. The file named is the architect's gate report; the record is `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md` §10, Amendment 4 (item 3 is there).
- **Fix:** point the parenthetical at that form's Amendment 4, item 3.

## Suggestions
- **S1. The new check passes silently when it cannot check.** A `gh` error makes `ghApiPrMerged` return `ok:false` (:49-51), and the check reads that as not merged. A missing slug returns `[]` (:224). The done-node check fails loudly on both (:175, :177). Today every done node with PR evidence fails loudly on the same fault, which covers the new check in practice. The comment "not this check's failure to report" should say so.
- **S2. The PR's reported state is never asserted.** Test 1 checks `f.includes('merged')`, which the fixed message text always contains. Dropping `(${result.detail})` survives. Assert `state=closed`.
- **S3. Test 3 covers only one of its two named cases.** Its name says "open or closed-unmerged", but it stubs only `state=open merged=false`.
- **S4. Descriptions not updated for the new check.**
  - README's existing sentence "`--offline` skips the two GitHub-only checks (PR-merged, release-published)" now undercounts.
  - verify.mjs's header list (lines 7-10) omits the check. Both files are in Scope.
  - AUTONOMY §6 item 2 omits it too. A same-line edit only; no inserted lines.
- **S5. Keep the observation commits reachable.** verify.test.mjs names c0fa9c0 and 31cbb68 as observation commits. The PR body should ask for a non-squash merge so both stay reachable from main.

## Nits
- **Amendment 1 is not class 9** (round 25 item 2 (a)). §21d's template line already required one mutation per new test when the form was filed. So no standing rule added work; the form under-declared what it owed, and Scope and Change are unchanged. Class 1 stands, and its first line says post-result.
- **The correction is fine as written.** It is one sentence and not a gate correction round, so no superseded index is needed. Item 14 is in `AUTONOMY.md` Appendix A, which is what it says.
- `verify-test-claims.mjs:578` is 120 columns (N7's reflow).
- **N4's optional class-4 mutation:** not asked for.

## What was checked and held
- **Diff and budget.** Three-dot range: 6 Scope files plus the form. Counted without the form: 115 insertions + 18 deletions = 133 lines across 6 files (≤150). No CRLF.
- **Append-only.** The form was never edited in place: acd35aa, then 6cc77fa and 31cbb68 each append 2 lines.
- **Recorded mutations.** Each applied, run and reverted by script:

  | Mutation | Result |
  |---|---|
  | M1 | fails only "...fails by name when an in-progress node's evidence PR is reported merged" (18/19) |
  | M2 | fails only "...passes when the same node is recorded done" |
  | M3 | fails only "...passes when an in-progress node's evidence PR is open or closed-unmerged" |

- **N2, N3, N5, N6, N7** landed as asked, text only.
- **N5:** AUTONOMY.md has 482 lines before and after, one line changed in place (@@ -163 +163), adding "; round 23 item 4".
- **Round 25:**
  - No record calls a verify-mutation run an observation.
  - No hash pin sits at a branch commit.
  - No class 8/9 miss.
  - The five-line form's Out-of-scope names no §21a category as touched.
- **Suites:**
  - `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: 352/352.
  - verify-mutation (`--base origin/main --head HEAD`): PASS, 3/3.
  - verify-cites, verify-quotes and verify-test-claims: PASS.
  - verify.mjs: PASS both with `--offline` and online.
  - Branch CI run 36356880050: success at headSha d9a8ae47d8f3.
- The branch is one commit behind main (5a6df78, which touches only `state/CUT-STATE.md`); no conflict.

Files: C:/dev/wt/test-claims-landedness/scripts/plan/verify.mjs, C:/dev/wt/test-claims-landedness/scripts/plan/verify.test.mjs, C:/dev/wt/test-claims-landedness/scripts/plan/verify-test-claims.test.mjs, C:/dev/wt/test-claims-landedness/scripts/plan/README.md, C:/dev/wt/test-claims-landedness/scripts/plan/TEST-CLAIMS-LANDEDNESS-PREREGISTRATION.md, C:/dev/wt/test-claims-landedness/scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md
