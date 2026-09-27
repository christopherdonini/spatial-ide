*Custodian's filing note (2026-09-27): gate 2, attempt 2 (reviewer; the single combined gate of AUTONOMY.md §21b), of PLAN node `test-claims-landedness-bound`. Reviewed: governance/test-claims-landedness-bound @ d047dda (from the report's own first line). Filed under `state/consults/gates/` by `AUTONOMY.md` §25(b), transcribed from the hand-back message with the harness's two-space indent removed. The text below the rule is the agent's. Profile paths redacted at filing (0).*

---

Reviewed: governance/test-claims-landedness-bound @ d047dda — **PASS** (single combined gate, §21b, attempt 2, node `test-claims-landedness-bound`)

All three attempt-1 blockers are resolved and the suites and branch CI are green. The worktree was left clean (`git status --porcelain` empty); no file edits.

## Gate-1 findings
- **B1 (verify:plan path untested): resolved.**
  - The new test "verifyStatusAgreement fails by name when an in-progress node's evidence PR is reported merged" goes through `verifyStatusAgreement`.
  - I re-made M4 by deleting `failures.push(...verifyNotDoneEvidenceNotMerged(node, { prResults }));`. That test alone fails (19 of 20 pass).
- **B2 (caller rule): resolved.**
  - `verifyEvidence`'s signature is back to main's: `{ repoRoot, offline, slug }`.
  - No function takes a lookup callback any more.
  - The "already takes" comment is gone.
- **B3 (N4 pointer): resolved.** `verify-test-claims.test.mjs:387` now names `scripts/plan/TEST-CLAIMS-FOLLOWUPS-PREREGISTRATION.md §10`, Amendment 4, item 3.
- **S1 (silent pass when the lookup fails):** the check's doc now says a missing entry or a `gh` error means "not checked", and that the done-node check fails loudly on the same fault.
- **S2 (reported state never asserted):** the new verifyStatusAgreement test asserts `state=closed`.
- **S3 (closed-unmerged case missing):** test 3 now covers both `state=open merged=false` and `state=closed merged=false`.
- **S4 (stale descriptions):** the README's `--offline` sentence and paragraph now name the check, and so does item 2 of the `verify.mjs` header.
- **S5 (non-squash merge):** declared in Amendment 2. There is no PR yet, so the PR body is still to check.

## Caller rule on the new data path
- `prResults` is data, not an option.
  - `runVerify` is the product caller (verify.mjs, the gather block before the `verifyStatusAgreement` call). It sets it for each non-done node naming a PR, using the existing `ghApiPrMerged` and keying by `node.id`.
  - The consumer reads `prResults[node.id]` in the `{ ok, detail }` shape `ghApiPrMerged` returns.
  - The tests build exactly that shape, so it is the producer's real shape, not an imagined one.
- **End to end, run by me:** `runVerify` online against a scratch copy of PLAN.yaml, with `test-claims-landedness-bound` given `evidence: {pr: 117}`. It printed:
  `node "test-claims-landedness-bound": status is "ready" but PR #117 is reported merged (state=closed merged=true)`

  This went through the real `gh api` path.
- **Residual, not blocking:** the unit suite does not cover `runVerify`'s gather loop. With `if (!offline && slug)` replaced by `if (false)`, 20 of 20 pass. It can't be driven offline without reintroducing the lookup seam. Its real-`gh` behaviour is covered by the probe above and by CI's online `verify.mjs` step, which runs it against the real plan.

## Mutations, each re-made, run and reverted

| Mutation | Tests failing | Matches the record |
|---|---|---|
| M4, call site removed | "verifyStatusAgreement fails by name…" only (19/20) | yes |
| M1, final `return [...]` → `return []` | the wiring test and "verifyNotDoneEvidenceNotMerged fails by name…" (18/20) | yes, "not isolated" disclosed |
| M2, `status === 'done'` guard removed | "…passes when the same node is recorded done" only (19/20) | yes |
| M3, `!result \|\| !result.ok` → `!result` | "…passes when … open or closed-unmerged" only (19/20) | yes |

`verify-mutation --base origin/main --head HEAD`: PASS, 4 of 4.

## Form, merge and count
- **Append-only:** `git diff acd35aa HEAD` over the form has 0 removed lines. Amendment 2 appends 7 lines.
- **Order:** Amendment 2 (c94115e, 01:05:56) comes before the fix (2607202, 01:13:02).
  - Its first line says class 1, post-result, and names `state/consults/gates/2026-09-27-test-claims-landedness-gate1-reviewer.md`, which is present through the merge.
  - It is not class 9: a gate finding added the work, not a standing rule.
  - It makes no verify-mutation observation claim and no hash pin at a branch commit.
- **Merge f5802d9:** its second parent, 78cfe90, is on origin/main. Against the first parent it changes only `state/` files (CUT-STATE, gate-log, two reports) and it is signed off.
- **§21c:** by three-dot numstat, with the form excluded, 136 insertions + 12 deletions = 148 lines across 6 files. That is within the ≤150 and ≤8 bounds, so no class-6 amendment is needed.
- **AUTONOMY.md:** still 482 lines, with only N5's single line changed.

## Suites and CI
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: 353 of 353.
- verify-cites, verify-quotes, verify-test-claims: PASS.
- `verify.mjs --offline` and online: PASS.
- Branch CI: run 36358399586 at d047dda completed with success.

## Nits
- `runVerify`'s `--offline` note still reads "PR-merged and release-published checks were skipped." It doesn't name the landedness check. Amendment 2 limited S4 to the README and the header, so leaving it is within the declared scope.
- `verify-test-claims.mjs:578` is still 120 columns.

Files: C:/dev/wt/test-claims-landedness/scripts/plan/verify.mjs, C:/dev/wt/test-claims-landedness/scripts/plan/verify.test.mjs, C:/dev/wt/test-claims-landedness/scripts/plan/verify-test-claims.test.mjs, C:/dev/wt/test-claims-landedness/scripts/plan/README.md, C:/dev/wt/test-claims-landedness/scripts/plan/TEST-CLAIMS-LANDEDNESS-PREREGISTRATION.md
