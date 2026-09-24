# verify-mutation.mjs header-token fix — five-line preregistration (AUTONOMY.md §21d)

*Committed before any code, per the header rule both full and short forms keep.*

```
Authority: PLAN.yaml node governance-verify-mutation-header-token; state/directives/2026-09-24-night-program.md item 5 (the human, verbatim: "All are light-lane fixes to tools that can silently skip tests, not new policy."); AUTONOMY.md §21b-§21d.
Scope: scripts/plan/verify-mutation.mjs (findTestsInFile's block tracking, runVerifyMutation's own-file mutation check, and the module doc comment describing both) and scripts/plan/verify-mutation.test.mjs; declared line budget <= 105 insertions + deletions across these 2 files.
Change: for the changed-test-file mutation convention, the RECORDED MUTATION token must fall inside the test's own block (from the previous item's end, or the file header's end for the first item, through the test's own declaration line) instead of anywhere within a fixed 500-character window in the whole file; a diagnostic is printed for a "mutation" mention that owns no test.
Tests+mutation: a new test pairing a file-header "mutation" mention with a bare test that has none of its own, asserting the bare test is reported as a finding (MISS); the recorded mutation reverts the own-file check to the whole-file window and that test fails by name.
Out-of-scope: no ADR, wire, security or guarantee text; no change to the changed-preregistration (convention 1) matching, which stays whole-text proximity; no change to the multi-line-attribute fix landed in governance/verify-mutation-multiline-attrs (this branch stacks on it).
```

Budget: references only, filled in at landing.

## Correction round 1

Reviewer attempt 1 (state/gate-log.json, node governance-verify-mutation-header-token, @ c5f913e): a test's own block started at the previous item's DECLARATION line, so a neighbouring test's body comment (Rust) or body string (JS) mentioning "mutation" still credited a bare test. Corrected at commit 0d087a6: `lastItemEndLine` is now the previous item's own body's matching close (`bodyEndLine`, brackets in strings/comments ignored), not its declaration line. Proof: `a_neighbouring_rust_tests_body_comment_does_not_credit_a_bare_test` and `a_neighbouring_js_tests_body_string_does_not_credit_a_bare_test` (scripts/plan/verify-mutation.test.mjs, commit 0d087a6), each verified to fail when `lastItemEndLine = bodyEndLine(...)` is reverted to `= i + 1`.

Doc cite (reviewer attempt 1, Documentation FAIL): the module doc's `§hasOwnMutationMention` citation named a function that never existed. Fixed at commit 0d087a6 to point at `runVerifyMutation`'s changed-test-file convention, the check's real location.

Known residual (reviewer attempt 1, item (c), reproduced and NOT fixed): a file's first test with no leading comment/attribute of its own still has its own leading token absorbed into `headerLineCount`'s header span (a false MISS) — `headerLineCount` is unchanged by this fix; this is the pre-existing limitation already disclosed in the module doc (scripts/plan/verify-mutation.mjs's own "disclosed, not solved" note).

Flip count on main (reviewer attempt 1 confirmed 20; re-run at commit 0d087a6 against origin/main: 22 — the higher count reflects piece 1's own netBracketDelta change landing between the two counts): `runVerifyMutation`'s `parseAddedRanges` gates only tests inside a diff's added ranges (scripts/plan/verify-mutation.mjs's `runVerifyMutation`), so none of these pre-existing tests turn main red.

Superseded index: none. No form or doc text from this piece's own history is made false by commit 0d087a6 — the Change line above and the module doc's "previous item's end" description were already the intended design; the fix makes the code match text that was already true, not false.

Amendment (class-6, AUTONOMY.md §21b size-overrun): declared budget 105; final figure 192 (`git diff --numstat origin/governance/verify-mutation-multiline-attrs...HEAD -- scripts/plan/verify-mutation.mjs scripts/plan/verify-mutation.test.mjs`, form excluded: 105+20 mjs, 67+0 test), landed at commit 0d087a6 — reason: reviewer attempt 1's Correctness finding (the own-block boundary) required a structural rewrite beyond the declared scope. Per AUTONOMY.md §21b, this overrun closes the single-gate route exactly as a §21a category does; this piece routes to FULL gating (reviewer + architect) while keeping its five-line form.
