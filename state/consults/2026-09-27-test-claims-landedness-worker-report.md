*Custodian's filing note (2026-09-27): the worker's two hand-backs for PLAN node `test-claims-landedness-bound` (branch `governance/test-claims-landedness-bound`): the build (head 57c626f), then the follow-up that added the two mutations of the form's Amendment 1 (head d9a8ae4). Both are transcribed from the hand-back messages with the harness's two-space indent removed. A worker report, not a gate report. Its `path:line` cites are into the branch; they are written with a path and a line number, and the files exist on main, so main's verify-cites resolves them by bounds only. Everything below the rule is the worker's text. Profile paths redacted at filing (0).*

---

## Hand-back 1 (the build)

Built the landedness check exactly as TEST-CLAIMS-LANDEDNESS-PREREGISTRATION.md declares, in worktree C:/dev/wt/test-claims-landedness, branch governance/test-claims-landedness-bound.

Commits (both `git commit -s`, HEAD now 57c626f, acd35aa is the form's own commit, unmoved):
1. c0fa9c0 feat(plan): verify:plan fails a non-done node whose evidence PR is merged — new `verifyNotDoneEvidenceNotMerged` (scripts/plan/verify.mjs:213-229), wired into `verifyStatusAgreement`'s loop; `verifyEvidence`/`verifyStatusAgreement` gained an optional `ghApiPrMergedFn` param (default: the real `ghApiPrMerged`, scripts/plan/verify.mjs:44-52) so tests stub the PR lookup with no real `gh` call; three new tests in verify.test.mjs; README.md paragraph added.
2. 57c626f docs(plan): mutation record + carried notes N2-N7.

Tests added (scripts/plan/verify.test.mjs): `verifyNotDoneEvidenceNotMerged fails by name when an in-progress node's evidence PR is reported merged`; `...passes when the same node is recorded done`; `...passes when an in-progress node's evidence PR is open or closed-unmerged`.

Mutation: dropped the `result.ok ? [...] : []` conditional in `verifyNotDoneEvidenceNotMerged` (unconditional `return []`), ran `node --test scripts/plan/verify.test.mjs` at commit c0fa9c0 — the first test failed by name ("expected a named merged-PR failure, got: []", 18 of 19 pass, Node v24.18.1) — then reverted (confirmed `git diff --stat verify.mjs` empty after revert). Recorded in verify.test.mjs:242-246.

Notes N2-N7: N2 fixed both verify-test-claims.mjs cites (§5's invalidator → §2.1(c) at old 583; §2.1(b)+wrong extra clause → §2.1(c), clause deleted, at old 745-747). N3 named the test in the comment above `a_withdrawn_test_row_whose_rev_is_not_on_main_fails_by_name` (verify-test-claims.test.mjs). N4 repointed the comment above `a_pin_with_no_rev_does_not_exempt` to Amendment 4 item 3; its optional class-4 mutation NOT taken, per the form. N5 added "round 23 item 4" to AUTONOMY.md's §6a item 3 row-position cite on the same line (482 lines before and after — checked with wc -l). N6 dropped "above" from the withdrawn-claims SKIPPED note (verify-test-claims.mjs:838). N7 added `mainUnchecked` to `computeWithdrawnRows`' doc return-shape (verify-test-claims.mjs:577).

Caller check: `verifyNotDoneEvidenceNotMerged` is exported but has a real product caller — `verifyStatusAgreement` (verify.mjs:254), reached by `runVerify`/`main()`, i.e. `node scripts/plan/verify.mjs` itself; confirmed by grep (only call sites are that line and the three new tests).

Suite results:
- `node --test scripts/plan/*.test.mjs scripts/hooks/*.test.mjs`: 352 pass, 0 fail (exit 0).
- `node scripts/plan/verify.mjs --offline`: PASS, exit 0.
- `node scripts/plan/verify.mjs` (online): PASS, exit 0 (new check does not false-flag the real PLAN.yaml).
- `verify-cites.mjs`: PASS, exit 0 (36 pre-existing loose-reference advisories, none in my files).
- `verify-quotes.mjs`: PASS, exit 0 (30 pre-existing baselined entries + 1 advisory, none in my files).
- `verify-quotes.mjs --show-cites <my 6 files>`: 3 "quote not found" FAILs (verify.mjs:138, AUTONOMY.md:395, :399) — confirmed pre-existing on origin/main by running the identical command against the main checkout (C:/dev/spatial-ide), same 3 failures, same lines, untouched by my edits.
- `verify-test-claims.mjs`: PASS, exit 0 — 343 claimed tests across 90 files (5 planned, 3 superseded, 15 withdrawn, all advisory).
- `verify-mutation.mjs --base origin/main --head HEAD`: FAIL, exit 1 — only the first of my three new tests has a recorded mutation (`ok`); the other two ("...passes when done" / "...passes when open or closed-unmerged") are flagged MISS. This is the form's own Tests+mutation line as written ("the recorded mutation for the first is..." — only one mutation specified for three tests), which conflicts with the general §14/verify-mutation one-mutation-per-new-test rule. I did not add mutations for tests 2/3 because the form doesn't specify any and I was told to work only to what the form declares — flagging this conflict rather than resolving it myself.

§21c count: `git diff --numstat origin/main...HEAD -- . ':!scripts/plan/TEST-CLAIMS-LANDEDNESS-PREREGISTRATION.md'` = 6 files, 122 lines changed (2+5+14+11+29+61), under the declared ≤150-line/6-file budget — no class 6.

Files touched: scripts/plan/verify.mjs, scripts/plan/verify.test.mjs, scripts/plan/verify-test-claims.mjs, scripts/plan/verify-test-claims.test.mjs, scripts/plan/README.md, AUTONOMY.md.

Off-scope, noticed not done: the verify-mutation MISS above (tests 2/3, flagged not fixed); N6's "no target" pathological case not itself unit-tested (only the wording was fixed, per Scope's "comments and doc text only").

Model: Sonnet 5 (claude-sonnet-5), no override. No context handoff received or produced (single-session worker). No local token-usage evidence at hand.

`git status --porcelain` in the worktree: empty.

## Hand-back 2 (Amendment 1's two mutations)

Addressed the coordinator's follow-up. Both Amendment-1 mutations applied for real, observed to fail their named test, then reverted (`git diff --stat verify.mjs` empty after each revert), all at commit 31cbb68 (Node v24.18.1):

1. `...passes when the same node is recorded done`: removed `if (node.status === 'done') return [];` in `verifyNotDoneEvidenceNotMerged` (verify.mjs) — failed with actual `['node "n-inprogress": status is "done" but PR #42 is reported merged (state=closed merged=true)']` vs expected `[]`.
2. `...passes when an in-progress node's evidence PR is open or closed-unmerged`: replaced `result.ok ? [...] : []` with `true ? [...] : []` — failed with actual `['node "n-inprogress": status is "in-progress" but PR #42 is reported merged (state=open merged=false)']` vs expected `[]`.

Both recorded as `RECORDED MUTATION`-style doc comments directly above each test in scripts/plan/verify.test.mjs, one commit `git commit -s`: d9a8ae4 (amended once, still unpushed/local-only, to shorten the second comment after verify-mutation.mjs's own 500-char-window recognizer initially MISSed it — the amendment kept "one commit for the two records" as asked rather than adding a third).

Re-run results:
- `node scripts/plan/verify-mutation.mjs --base origin/main --head HEAD`: PASS, exit 0 — "all 3 new test(s) have a recorded mutation naming them" (3/3, was 1/3 then 2/3 before the comment fix).
- `node --test "scripts/plan/*.test.mjs" "scripts/hooks/*.test.mjs"`: 352 pass, 0 fail, exit 0.
- `verify-cites.mjs`: PASS, exit 0 (same 36 pre-existing loose-reference advisories, none touching my files).
- §21c count: `git diff --numstat origin/main...HEAD -- . ':!scripts/plan/TEST-CLAIMS-LANDEDNESS-PREREGISTRATION.md'` = 6 files, 133 lines (2+5+14+11+29+72) — still under the 150-line/6-file budget.

Commits now ahead of origin/main (unpushed): acd35aa (form) → c0fa9c0 (check+tests) → 57c626f (mutation record 1 + N2-N7) → 6cc77fa/31cbb68 (custodian's Amendment 1 + correction) → d9a8ae4 (mutation records 2 and 3).

`git status --porcelain`: empty.
