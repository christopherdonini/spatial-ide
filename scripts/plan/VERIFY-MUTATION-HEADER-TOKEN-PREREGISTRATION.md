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
